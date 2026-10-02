(function () {
  "use strict";

  var STORAGE_KEY = "game_lab_mvp_v1";
  var views = {
    input: document.getElementById("view-input"),
    hypothesis: document.getElementById("view-hypothesis"),
    experiment: document.getElementById("view-experiment"),
    prototype: document.getElementById("view-prototype"),
    result: document.getElementById("view-result"),
    knowledge: document.getElementById("view-knowledge")
  };
  var tabButtons = document.querySelectorAll(".tabs button");
  var gameTimer = null;

  var defaultState = {
    version: 1,
    inputText: "",
    reviews: [],
    stats: [],
    hypotheses: [],
    selectedHypothesisId: null,
    experiment: null,
    sessions: [],
    activeSession: null,
    game: null
  };

  var state = loadState();

  function loadState() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return JSON.parse(JSON.stringify(defaultState));
      var parsed = JSON.parse(raw);
      if (!parsed || parsed.version !== 1) return JSON.parse(JSON.stringify(defaultState));
      parsed.inputText = parsed.inputText || "";
      parsed.reviews = parsed.reviews || [];
      parsed.stats = parsed.stats || [];
      parsed.hypotheses = parsed.hypotheses || [];
      parsed.selectedHypothesisId = parsed.selectedHypothesisId || null;
      parsed.experiment = parsed.experiment || null;
      parsed.sessions = parsed.sessions || [];
      parsed.activeSession = parsed.activeSession || null;
      parsed.game = parsed.game || null;
      return parsed;
    } catch (error) {
      console.warn("Game Lab state load failed:", error);
      return JSON.parse(JSON.stringify(defaultState));
    }
  }

  function persist() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn("Game Lab state save failed:", error);
    }
  }

  function resetState() {
    if (gameTimer) {
      window.clearInterval(gameTimer);
      gameTimer = null;
    }
    state = JSON.parse(JSON.stringify(defaultState));
    window.localStorage.removeItem(STORAGE_KEY);
    renderAll();
  }

  function restoreActiveTimer() {
    if (gameTimer) {
      window.clearInterval(gameTimer);
      gameTimer = null;
    }
    if (
      state.activeSession &&
      state.game &&
      state.game.kind === "treatment" &&
      !state.game.finished
    ) {
      gameTimer = window.setInterval(runTreatmentTick, 1000);
    }
  }

  function escapeHTML(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function selectedHypothesis() {
    var id = state.selectedHypothesisId;
    return state.hypotheses.filter(function (item) { return item.id === id; })[0] || null;
  }

  function showView(name) {
    Object.keys(views).forEach(function (key) {
      views[key].classList.toggle("active", key === name);
    });
    tabButtons.forEach(function (button) {
      var active = button.dataset.view === name;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
    });
    history.replaceState(null, "", "#" + name);
    renderView(name);
  }

  function renderAll() {
    Object.keys(views).forEach(function (key) {
      renderView(key);
    });
  }

  function renderView(name) {
    if (name === "input") renderInput();
    if (name === "hypothesis") renderHypothesis();
    if (name === "experiment") renderExperiment();
    if (name === "prototype") renderPrototype();
    if (name === "result") renderResult();
    if (name === "knowledge") renderKnowledge();
  }

  function renderInput() {
    var statsHTML = "";
    if (state.stats.length) {
      statsHTML = state.stats.map(function (stat) {
        var evidence = stat.evidence.map(function (item) {
          return "<div class=\"evidence-item\">" +
            "<div class=\"meta-line\">" + escapeHTML(item.game) + " · " + escapeHTML(item.sentiment) + " · " + escapeHTML(item.id) + "</div>" +
            escapeHTML(item.text) +
            "</div>";
        }).join("");

        return "<div class=\"card\" style=\"margin-bottom:12px;\">" +
          "<div class=\"head\" style=\"display:flex;align-items:center;gap:8px;margin-bottom:8px;\">" +
          "<div class=\"card-title\" style=\"margin:0;\">" + escapeHTML(stat.label) + "</div>" +
          "<span class=\"level\">缺口 " + Math.round(stat.gapScore * 100) + "%</span>" +
          "</div>" +
          "<div class=\"bar-row\"><span>需求强度</span><div class=\"bar-track\"><div class=\"bar-fill satisfied\" style=\"width:" + Math.round(stat.demandScore * 100) + "%\"></div></div><b>" + Math.round(stat.demandScore * 100) + "%</b></div>" +
          "<div class=\"bar-row\"><span>未满足</span><div class=\"bar-track\"><div class=\"bar-fill unmet\" style=\"width:" + Math.round((stat.unmet / stat.mentions) * 100) + "%\"></div></div><b>" + Math.round((stat.unmet / stat.mentions) * 100) + "%</b></div>" +
          "<div class=\"meta\"><span>提及 " + stat.mentions + "</span><span>负面 / 期待 " + stat.unmet + "</span><span>跨竞品 " + stat.crossGames + "</span></div>" +
          "<div class=\"evidence-list\">" + evidence + "</div>" +
          "</div>";
      }).join("");
    } else if (state.reviews.length) {
      statsHTML = "<div class=\"empty\">尚未分析，请点击「分析口碑」。</div>";
    } else {
      statsHTML = "<div class=\"empty\">载入演示数据或粘贴评论样本后开始分析。</div>";
    }

    views.input.innerHTML =
      "<div class=\"section-head\"><h2>输入洞察</h2><p>支持演示数据、JSON 数组或「游戏|情绪|评论」按行输入</p><span class=\"tag\">Step 1</span></div>" +
      "<div class=\"grid cols-2\">" +
        "<div class=\"panel\"><h3 class=\"panel-title\">口碑样本</h3>" +
          "<label class=\"field\" for=\"review-input\">评论输入</label>" +
          "<textarea id=\"review-input\" placeholder=\"幻兽帕鲁|负面|希望生物参与基地生产&#10;星露谷物语|正面|农场成长目标清晰\"></textarea>" +
          "<div class=\"actions\">" +
            "<button class=\"ghost small\" id=\"load-demo\" type=\"button\">载入演示数据</button>" +
            "<button class=\"primary small\" id=\"analyze-reviews\" type=\"button\">分析口碑</button>" +
            "<button class=\"ghost small\" id=\"clear-input\" type=\"button\">清空输入</button>" +
          "</div>" +
          "<div id=\"input-error\"></div>" +
          "<div class=\"note\">情绪支持：positive / negative / neutral，或：正面 / 负面 / 中性。</div>" +
        "</div>" +
        "<div class=\"panel\"><h3 class=\"panel-title\">动机与缺口</h3><div id=\"motivation-stats\">" + statsHTML + "</div></div>" +
      "</div>";

    var textarea = document.getElementById("review-input");
    textarea.value = state.inputText;
    textarea.addEventListener("input", function () {
      state.inputText = textarea.value;
      persist();
    });

    document.getElementById("load-demo").addEventListener("click", function () {
      state.inputText = window.GameLabEngine.DEMO_REVIEWS.map(function (review) {
        return review.game + "|" + (review.sentiment === "negative" ? "负面" : "正面") + "|" + review.text;
      }).join("\n");
      persist();
      renderInput();
    });

    document.getElementById("clear-input").addEventListener("click", function () {
      state.inputText = "";
      persist();
      renderInput();
    });

    document.getElementById("analyze-reviews").addEventListener("click", function () {
      var errorBox = document.getElementById("input-error");
      errorBox.innerHTML = "";
      try {
        state.reviews = window.GameLabEngine.parseReviews(state.inputText);
        state.stats = window.GameLabEngine.analyzeMotivations(state.reviews);
        state.hypotheses = window.GameLabEngine.buildHypotheses(state.stats, 3);
        state.selectedHypothesisId = state.hypotheses.length ? state.hypotheses[0].id : null;
        state.experiment = state.hypotheses.length ? window.GameLabEngine.buildExperiment(state.hypotheses[0]) : null;
        persist();
        renderAll();
        showView("hypothesis");
      } catch (error) {
        errorBox.innerHTML = "<div class=\"error\">" + escapeHTML(error.message) + "</div>";
      }
    });
  }

  function renderHypothesis() {
    var content;
    if (!state.hypotheses.length) {
      content = "<div class=\"empty\">请先在「输入洞察」中分析口碑样本。</div>";
    } else {
      content = "<div class=\"grid cols-3\">" + state.hypotheses.map(function (item) {
        var selected = item.id === state.selectedHypothesisId;
        return "<div class=\"hypothesis-card" + (selected ? " selected" : "") + "\">" +
          "<div class=\"head\"><span class=\"id\">" + escapeHTML(item.id) + "</span><span class=\"confidence\">置信度 " + item.confidence + "%</span></div>" +
          "<h4>" + escapeHTML(item.title) + "</h4>" +
          "<dl class=\"kv\">" +
            "<dt>命题</dt><dd>" + escapeHTML(item.statement) + "</dd>" +
            "<dt>机制组合</dt><dd>" + escapeHTML(item.mechanisms.join(" + ")) + "</dd>" +
            "<dt>目标玩家</dt><dd>" + escapeHTML(item.targetUser) + "</dd>" +
            "<dt>差异点</dt><dd>" + escapeHTML(item.differentiation) + "</dd>" +
            "<dt>先例</dt><dd>" + escapeHTML(item.precedents.join(" / ")) + "</dd>" +
            "<dt>风险</dt><dd>" + escapeHTML(item.risks.join("；")) + "</dd>" +
          "</dl>" +
          "<div class=\"actions\"><button class=\"" + (selected ? "ghost" : "primary") + " small\" data-hypothesis=\"" + escapeHTML(item.id) + "\" type=\"button\">" + (selected ? "已选择" : "选择该假设") + "</button></div>" +
        "</div>";
      }).join("") + "</div>";
    }

    views.hypothesis.innerHTML =
      "<div class=\"section-head\"><h2>机制假设</h2><p>从动机缺口生成可验证的设计命题</p><span class=\"tag\">Step 2</span></div>" + content;

    views.hypothesis.querySelectorAll("[data-hypothesis]").forEach(function (button) {
      button.addEventListener("click", function () {
        state.selectedHypothesisId = button.dataset.hypothesis;
        var hypothesis = selectedHypothesis();
        state.experiment = window.GameLabEngine.buildExperiment(hypothesis);
        persist();
        renderAll();
      });
    });
  }

  function renderExperiment() {
    var experiment = state.experiment;
    if (!experiment) {
      views.experiment.innerHTML = "<div class=\"section-head\"><h2>实验设计</h2><p>选择机制假设后自动生成实验</p><span class=\"tag\">Step 3</span></div><div class=\"empty\">暂无实验，请先分析口碑并选择机制假设。</div>";
      return;
    }

    var hypothesis = selectedHypothesis();
    var groups = experiment.groups.map(function (group) {
      return "<div class=\"card\"><div class=\"card-title\">" + escapeHTML(group.name) + "</div><div class=\"card-desc\">" + escapeHTML(group.description) + "</div></div>";
    }).join("");

    var metrics = experiment.metrics.map(function (metric) {
      return "<tr><td>" + escapeHTML(metric.label) + "</td><td>≥ " + Math.round(metric.threshold * 100) + "%</td><td>" + escapeHTML(metric.why) + "</td></tr>";
    }).join("");

    views.experiment.innerHTML =
      "<div class=\"section-head\"><h2>实验设计</h2><p>验证「" + escapeHTML(hypothesis ? hypothesis.title : "") + "」</p><span class=\"tag\">Step 3</span></div>" +
      "<div class=\"grid cols-2\">" + groups + "</div>" +
      "<div class=\"panel\" style=\"margin-top:14px;\"><h3 class=\"panel-title\">指标与通过线</h3>" +
        "<table><thead><tr><th>指标</th><th>最低通过线</th><th>为什么重要</th></tr></thead><tbody>" + metrics + "</tbody></table>" +
        "<div class=\"note\">目标样本：每组 " + experiment.target + " 人；原型时长：" + experiment.durationMinutes + " 分钟。本地 MVP 可先少量试玩验证流程。</div>" +
      "</div>";
  }

  function eventLine(event) {
    return "<div>" + escapeHTML(new Date(event.at).toLocaleTimeString()) + " · " + escapeHTML(event.type) + (event.detail && Object.keys(event.detail).length ? " · " + escapeHTML(JSON.stringify(event.detail)) : "") + "</div>";
  }

  function renderPrototype() {
    var experiment = state.experiment;
    if (!experiment) {
      views.prototype.innerHTML = "<div class=\"section-head\"><h2>机制原型</h2><p>浏览器内可玩机制切片</p><span class=\"tag\">Step 4</span></div><div class=\"empty\">暂无实验，请先完成口碑分析。</div>";
      return;
    }

    var game = state.game;
    var gameHTML;
    if (!game) {
      gameHTML =
        "<div class=\"game-shell\">" +
          "<div class=\"game-top\"><div><div class=\"game-title\">选择实验组开始</div><div class=\"game-goal\">完成一次流程即写入本地行为事件</div></div></div>" +
          "<div class=\"actions\">" +
            "<button class=\"primary\" id=\"start-control\" type=\"button\">开始对照组</button>" +
            "<button class=\"primary\" id=\"start-treatment\" type=\"button\">开始实验组</button>" +
          "</div>" +
        "</div>";
    } else if (game.kind === "control") {
      gameHTML = controlHTML(game);
    } else {
      gameHTML = treatmentHTML(game);
    }

    var eventsHTML = state.activeSession && state.activeSession.events.length
      ? state.activeSession.events.map(eventLine).join("")
      : "<div>暂无事件</div>";

    views.prototype.innerHTML =
      "<div class=\"section-head\"><h2>机制原型</h2><p>验证生物岗位机制是否产生理解、策略表达与二次兴趣</p><span class=\"tag\">Step 4</span></div>" +
      gameHTML +
      "<div class=\"panel\" style=\"margin-top:14px;\"><h3 class=\"panel-title\">行为事件流</h3><div class=\"event-log\">" + eventsHTML + "</div></div>";

    bindPrototypeEvents();
  }

  function controlHTML(game) {
    var finished = Boolean(game.finished);
    return "<div class=\"game-shell\">" +
      "<div class=\"game-top\"><div><div class=\"game-title\">对照组 · 手动生产</div><div class=\"game-goal\">手动采集资源，目标 30 单位</div></div><span class=\"status\">" + (finished ? "已完成" : "进行中") + "</span></div>" +
      "<div class=\"resource-row\"><div class=\"resource-box\"><div class=\"name\">资源</div><div class=\"value\" id=\"control-resource\">" + game.resources + "</div></div></div>" +
      "<div class=\"progress\"><div style=\"width:" + Math.min(100, (game.resources / 30) * 100) + "%\"></div></div>" +
      "<div class=\"actions\">" +
        "<button class=\"primary\" id=\"control-gather\" type=\"button\" " + (finished ? "disabled" : "") + ">采集资源 +3</button>" +
        "<button class=\"ghost\" id=\"control-tutorial\" type=\"button\" " + (game.tutorialDone ? "disabled" : "") + ">完成教学</button>" +
        "<button class=\"ghost\" id=\"game-share\" type=\"button\">我有分享意愿</button>" +
        "<button class=\"ghost\" id=\"game-restart\" type=\"button\">重开一局</button>" +
        "<button class=\"ghost\" id=\"game-abandon\" type=\"button\">放弃并记录</button>" +
      "</div>" +
    "</div>";
  }

  function treatmentHTML(game) {
    var creatures = game.creatures.map(function (creature, index) {
      var options = ["采集岗", "加工岗", "运输岗"].map(function (station) {
        return "<option value=\"" + station + "\"" + (creature.station === station ? " selected" : "") + ">" + station + "</option>";
      }).join("");
      return "<div class=\"creature\">" +
        "<div><div class=\"name\">" + escapeHTML(creature.name) + "</div><div class=\"role\">" + escapeHTML(creature.role) + "</div></div>" +
        "<div class=\"creature-actions\">" +
          "<button class=\"primary small\" data-capture=\"" + index + "\" type=\"button\" " + (creature.captured ? "disabled" : "") + ">" + (creature.captured ? "已捕捉" : "捕捉") + "</button>" +
          "<select data-station-for=\"" + index + "\" " + (creature.captured ? "" : "disabled") + ">" + options + "</select>" +
          "<button class=\"ghost small\" data-assign=\"" + index + "\" type=\"button\" " + (creature.captured ? "" : "disabled") + ">分配岗位</button>" +
        "</div>" +
      "</div>";
    }).join("");

    var stations = [
      ["采集岗", "增加原料"],
      ["加工岗", "原料转为加工品"],
      ["运输岗", "加工品转为交付"]
    ].map(function (station) {
      var workers = game.creatures.filter(function (creature) {
        return creature.station === station[0];
      }).map(function (creature) { return creature.name; }).join("、") || "空";
      return "<div class=\"station\"><div class=\"name\">" + station[0] + "</div><div class=\"desc\">" + station[1] + "</div><div class=\"workers\">当前：" + escapeHTML(workers) + "</div></div>";
    }).join("");

    return "<div class=\"game-shell\">" +
      "<div class=\"game-top\"><div><div class=\"game-title\">实验组 · 生物生产</div><div class=\"game-goal\">捕捉生物并分配岗位，目标交付 30 单位</div></div><span class=\"status\">" + (game.finished ? "已完成" : "进行中") + "</span></div>" +
      "<div class=\"resource-row\">" +
        "<div class=\"resource-box\"><div class=\"name\">原料</div><div class=\"value\" id=\"treat-raw\">" + game.raw + "</div></div>" +
        "<div class=\"resource-box\"><div class=\"name\">加工品</div><div class=\"value\" id=\"treat-processed\">" + game.processed + "</div></div>" +
        "<div class=\"resource-box\"><div class=\"name\">交付</div><div class=\"value\" id=\"treat-delivered\">" + game.delivered + "</div></div>" +
      "</div>" +
      "<div class=\"progress\"><div id=\"treat-progress\" style=\"width:" + Math.min(100, (game.delivered / 30) * 100) + "%\"></div></div>" +
      "<div class=\"actions\"><button class=\"ghost\" id=\"control-tutorial\" type=\"button\" " + (game.tutorialDone ? "disabled" : "") + ">完成教学</button></div>" +
      "<div class=\"creatures\" style=\"margin-top:14px;\">" + creatures + "</div>" +
      "<div class=\"station-grid\">" + stations + "</div>" +
      "<div class=\"actions\">" +
        "<button class=\"ghost\" id=\"game-share\" type=\"button\">我有分享意愿</button>" +
        "<button class=\"ghost\" id=\"game-restart\" type=\"button\">重开一局</button>" +
        "<button class=\"ghost\" id=\"game-abandon\" type=\"button\">放弃并记录</button>" +
      "</div>" +
    "</div>";
  }

  function bindPrototypeEvents() {
    var startControl = document.getElementById("start-control");
    var startTreatment = document.getElementById("start-treatment");
    if (startControl) startControl.addEventListener("click", function () { startSession("control"); });
    if (startTreatment) startTreatment.addEventListener("click", function () { startSession("treatment"); });

    var gather = document.getElementById("control-gather");
    if (gather) gather.addEventListener("click", function () {
      if (!state.game || state.game.finished) return;
      state.game.resources += 3;
      logEvent("manual_gather", { resource: 3, total: state.game.resources });
      if (state.game.resources >= 5 && !state.game.cycleLogged) {
        state.game.cycleLogged = true;
        logEvent("cycle", { source: "manual", total: state.game.resources });
      }
      updateControlHud();
      if (state.game.resources >= 30) finishGame();
    });

    var tutorial = document.getElementById("control-tutorial");
    if (tutorial) tutorial.addEventListener("click", function () {
      if (!state.game || state.game.tutorialDone) return;
      state.game.tutorialDone = true;
      logEvent("tutorial_complete", { group: state.activeSession.group });
      renderPrototype();
    });

    views.prototype.querySelectorAll("[data-capture]").forEach(function (button) {
      button.addEventListener("click", function () {
        var index = Number(button.dataset.capture);
        var creature = state.game.creatures[index];
        if (!creature || creature.captured) return;
        creature.captured = true;
        logEvent("capture", { creature: creature.name });
        renderPrototype();
      });
    });

    views.prototype.querySelectorAll("[data-assign]").forEach(function (button) {
      button.addEventListener("click", function () {
        var index = Number(button.dataset.assign);
        var creature = state.game.creatures[index];
        var select = views.prototype.querySelector("[data-station-for=\"" + index + "\"]");
        if (!creature || !creature.captured || !select) return;
        creature.station = select.value;
        logEvent("assign", { creature: creature.name, station: select.value });
        renderPrototype();
      });
    });

    var share = document.getElementById("game-share");
    if (share) share.addEventListener("click", function () {
      logEvent("share_intent", { group: state.activeSession.group });
    });

    var restart = document.getElementById("game-restart");
    if (restart) restart.addEventListener("click", function () {
      restartSession();
    });

    var abandon = document.getElementById("game-abandon");
    if (abandon) abandon.addEventListener("click", function () {
      abandonSession();
    });
  }

  function startSession(group) {
    if (gameTimer) {
      window.clearInterval(gameTimer);
      gameTimer = null;
    }

    state.activeSession = {
      sessionId: "session_" + Date.now(),
      group: group,
      startedAt: new Date().toISOString(),
      endedAt: null,
      events: []
    };
    state.sessions.push(state.activeSession);

    if (group === "control") {
      state.game = {
        kind: "control",
        group: group,
        resources: 0,
        tutorialDone: false,
        cycleLogged: false,
        finished: false
      };
    } else {
      state.game = {
        kind: "treatment",
        group: group,
        raw: 0,
        processed: 0,
        delivered: 0,
        tutorialDone: false,
        cycleCount: 0,
        finished: false,
        creatures: [
          { id: "moss", name: "苔灵", role: "采集型生物", captured: false, station: null },
          { id: "ember", name: "焰犬", role: "加工型生物", captured: false, station: null },
          { id: "wind", name: "风蛾", role: "运输型生物", captured: false, station: null }
        ]
      };
      gameTimer = window.setInterval(runTreatmentTick, 1000);
    }

    logEvent("start", { group: group });
    renderPrototype();
  }

  function logEvent(type, detail) {
    if (!state.activeSession) return;
    state.activeSession.events.push({
      type: type,
      at: new Date().toISOString(),
      detail: detail || {}
    });
    persist();
    var log = views.prototype.querySelector(".event-log");
    if (log) {
      var item = document.createElement("div");
      item.innerHTML = eventLine({ type: type, at: new Date().toISOString(), detail: detail || {} });
      while (item.firstChild) log.appendChild(item.firstChild);
      log.scrollTop = log.scrollHeight;
    }
  }

  function updateControlHud() {
    var value = document.getElementById("control-resource");
    if (value) value.textContent = String(state.game.resources);
    renderPrototype();
  }

  function runTreatmentTick() {
    var game = state.game;
    if (!game || game.kind !== "treatment" || game.finished) return;

    game.creatures.forEach(function (creature) {
      if (!creature.captured || !creature.station) return;
      if (creature.station === "采集岗") {
        game.raw += 1;
      } else if (creature.station === "加工岗") {
        if (game.raw > 0) {
          game.raw -= 1;
          game.processed += 1;
        }
      } else if (creature.station === "运输岗") {
        if (game.processed > 0) {
          game.processed -= 1;
          game.delivered += 1;
        }
      }
    });

    game.cycleCount += 1;
    if (game.cycleCount % 5 === 0) {
      logEvent("cycle", {
        raw: game.raw,
        processed: game.processed,
        delivered: game.delivered
      });
    }

    updateTreatmentHud();
    if (game.delivered >= 30) finishGame();
  }

  function updateTreatmentHud() {
    var game = state.game;
    var raw = document.getElementById("treat-raw");
    var processed = document.getElementById("treat-processed");
    var delivered = document.getElementById("treat-delivered");
    var progress = document.getElementById("treat-progress");
    if (raw) raw.textContent = String(game.raw);
    if (processed) processed.textContent = String(game.processed);
    if (delivered) delivered.textContent = String(game.delivered);
    if (progress) progress.style.width = Math.min(100, (game.delivered / 30) * 100) + "%";
  }

  function finishGame() {
    if (!state.game || state.game.finished) return;
    state.game.finished = true;
    if (gameTimer) {
      window.clearInterval(gameTimer);
      gameTimer = null;
    }
    logEvent("complete", {
      group: state.activeSession.group,
      resources: state.game.kind === "control" ? state.game.resources : state.game.delivered
    });
    state.activeSession.endedAt = new Date().toISOString();
    persist();
    renderPrototype();
  }

  function restartSession() {
    if (!state.activeSession || !state.game) return;
    var group = state.activeSession.group;
    logEvent("restart", { group: group });
    state.activeSession.endedAt = new Date().toISOString();
    startSession(group);
  }

  function abandonSession() {
    if (!state.activeSession) return;
    logEvent("abandon", { group: state.activeSession.group });
    state.activeSession.endedAt = new Date().toISOString();
    state.activeSession = null;
    state.game = null;
    if (gameTimer) {
      window.clearInterval(gameTimer);
      gameTimer = null;
    }
    persist();
    renderPrototype();
  }

  function formatInterval(value) {
    if (!value) return "—";
    return Math.round(value.rate * 100) + "%<br><small>CI " +
      Math.round(value.lower * 100) + "%–" +
      Math.round(value.upper * 100) + "%</small>";
  }

  function comparisonNote(metricLabel, available, overlap) {
    if (!available) return "";
    if (overlap) {
      return "<li>" + escapeHTML(metricLabel) + "的 95% 置信区间重叠，暂不能判断组间差异。</li>";
    }
    return "<li>" + escapeHTML(metricLabel) + "的 95% 置信区间不重叠，出现差异信号，但仍需达到目标样本。</li>";
  }

  function renderResult() {
    var summary = window.GameLabEngine.summarizeSessions(state.sessions);
    var rows = summary.groups.map(function (group) {
      return "<tr>" +
        "<td>" + (group.group === "control" ? "对照组" : "实验组") + "</td>" +
        "<td>" + group.total + "<br><small>" + escapeHTML(group.sampleStatusLabel) + "</small></td>" +
        "<td>" + formatInterval(group.intervals.completion) + "</td>" +
        "<td>" + formatInterval(group.intervals.adjustment) + "</td>" +
        "<td>" + formatInterval(group.intervals.restart) + "</td>" +
        "<td>" + formatInterval(group.intervals.share) + "</td>" +
      "</tr>";
    }).join("");

    var treatment = summary.groups[1];
    var maxStart = Math.max(1, treatment.funnel.start);
    var funnel = [
      ["进入原型", treatment.funnel.start],
      ["完成教学", treatment.funnel.tutorial],
      ["进入生产循环", treatment.funnel.progress],
      ["完成目标", treatment.funnel.complete],
      ["分享意愿", treatment.funnel.share]
    ].map(function (item) {
      return "<div class=\"funnel-step\"><div class=\"label\">" + item[0] + "</div><div class=\"track\"><div class=\"fill\" style=\"width:" + Math.round((item[1] / maxStart) * 100) + "%\"></div></div><b>" + item[1] + "</b></div>";
    }).join("");

    views.result.innerHTML =
      "<div class=\"section-head\"><h2>结果回流</h2><p>读取本地会话并计算实验指标</p><span class=\"tag\">Step 5</span></div>" +
      "<div class=\"panel\"><h3 class=\"panel-title\">实验组行为漏斗</h3>" + funnel + "</div>" +
      "<div class=\"panel\" style=\"margin-top:14px;\"><h3 class=\"panel-title\">指标对比（Wilson 95% CI）</h3>" +
        "<table><thead><tr><th>组别</th><th>样本</th><th>完成率</th><th>主动调整率</th><th>重开率</th><th>分享率</th></tr></thead><tbody>" + rows + "</tbody></table>" +
      "</div>" +
      "<div class=\"judgment\" style=\"margin-top:14px;\">" +
        "<h3>" + escapeHTML(summary.judgment.headline) + "</h3>" +
        "<p><b>样本状态：</b>" + escapeHTML(summary.judgment.sampleStatusLabel) + " · 当前共 " + state.sessions.length + " 个会话</p>" +
        "<ul>" +
          summary.judgment.actions.map(function (action) {
            return "<li>" + escapeHTML(action) + "</li>";
          }).join("") +
          comparisonNote("完成率", summary.comparison.completionComparisonAvailable, summary.comparison.completionIntervalsOverlap) +
          comparisonNote("分享率", summary.comparison.shareComparisonAvailable, summary.comparison.shareIntervalsOverlap) +
        "</ul>" +
        "<p>" + escapeHTML(summary.judgment.confidenceNote) + " 小样本结果仅用于流程验证，不可直接作为立项结论。</p>" +
      "</div>" +
      "<div class=\"panel\" style=\"margin-top:14px;\"><h3 class=\"panel-title\">数据管理</h3><div class=\"file-actions\">" +
        "<button class=\"primary small\" id=\"export-json\" type=\"button\">导出实验 JSON</button>" +
        "<button class=\"ghost small\" id=\"export-csv\" type=\"button\">导出事件 CSV</button>" +
        "<button class=\"ghost small\" id=\"import-json\" type=\"button\">导入 JSON</button>" +
        "<button class=\"ghost small\" id=\"clear-data\" type=\"button\">清空本地数据</button>" +
        "<input id=\"import-file\" type=\"file\" accept=\"application/json,.json\" class=\"hidden\">" +
      "</div></div>";

    document.getElementById("export-json").addEventListener("click", exportJSON);
    document.getElementById("export-csv").addEventListener("click", exportCSV);
    document.getElementById("import-json").addEventListener("click", function () {
      document.getElementById("import-file").click();
    });
    document.getElementById("import-file").addEventListener("change", importJSON);
    document.getElementById("clear-data").addEventListener("click", resetState);
  }

  function download(filename, content, type) {
    var blob = new Blob([content], { type: type });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function exportJSON() {
    var stamp = new Date().toISOString().replace(/[:.]/g, "-");
    download("game-lab-experiment-" + stamp + ".json", JSON.stringify(state, null, 2), "application/json");
  }

  function exportCSV() {
    var csv = window.GameLabEngine.eventsToCSV(state.sessions);
    var stamp = new Date().toISOString().replace(/[:.]/g, "-");
    download("game-lab-events-" + stamp + ".csv", csv, "text/csv;charset=utf-8");
  }

  function importJSON(event) {
    var file = event.target.files && event.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var imported = JSON.parse(String(reader.result));
        if (!imported || imported.version !== 1) throw new Error("无效的 Game Lab 实验文件");
        if (!Array.isArray(imported.sessions)) throw new Error("文件缺少 sessions 数组");
        if (gameTimer) {
          window.clearInterval(gameTimer);
          gameTimer = null;
        }
        state = imported;
        restoreActiveTimer();
        persist();
        renderAll();
        showView("result");
      } catch (error) {
        alert(error.message);
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  function renderKnowledge() {
    var summary = window.GameLabEngine.summarizeSessions(state.sessions);
    var hypothesis = selectedHypothesis();
    var knowledge = window.GameLabEngine.buildKnowledge(summary, hypothesis);
    var content;
    if (!knowledge) {
      content = "<div class=\"empty\">暂无可沉淀的机制知识。</div>";
    } else {
      content = "<div class=\"card\"><div class=\"card-title\">" + escapeHTML(knowledge.mechanism) + "</div>" +
        "<div class=\"meta\">" + knowledge.motivations.map(function (motivation) { return "<span>" + escapeHTML(motivation) + "</span>"; }).join("") + "</div>" +
        "<div class=\"card-desc\">完成率 " + Math.round(knowledge.effect.completionRate * 100) + "%，主动调整率 " + Math.round(knowledge.effect.adjustmentRate * 100) + "%，重开率 " + Math.round(knowledge.effect.restartRate * 100) + "%，分享率 " + Math.round(knowledge.effect.shareRate * 100) + "%。</div>" +
        "<div class=\"card-desc\" style=\"margin-top:8px;\">边界：" + escapeHTML(knowledge.boundary) + "</div>" +
        "<div class=\"card-desc\">下一步：" + escapeHTML(knowledge.nextAction) + "</div>" +
      "</div>";
    }

    views.knowledge.innerHTML =
      "<div class=\"section-head\"><h2>机制知识库</h2><p>把实验结果沉淀为机制、动机、效果与边界</p><span class=\"tag\">Step 6</span></div>" + content +
      "<div class=\"note\">知识由本地规则生成，尚未经过统计显著性检验。</div>";
  }

  tabButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      showView(button.dataset.view);
    });
  });

  var initialView = (location.hash || "#input").replace("#", "");
  if (!views[initialView]) initialView = "input";
  restoreActiveTimer();
  renderAll();
  showView(initialView);
})();
