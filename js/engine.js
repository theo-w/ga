(function (global) {
  "use strict";

  var MOTIVATIONS = [
    {
      id: "collection",
      label: "收集",
      keywords: ["收集", "捕捉", "宠物", "生物", "图鉴", "养成", "collect", "collection", "capture", "creature", "pet", "companion"]
    },
    {
      id: "automation",
      label: "自动化",
      keywords: ["自动化", "自动", "产线", "工厂", "代工", "生产", "automation", "automated", "factory", "production", "assembly"]
    },
    {
      id: "building",
      label: "建造",
      keywords: ["建造", "建筑", "基地", "建设", "农场", "build", "building", "base", "construction", "farm"]
    },
    {
      id: "cooperation",
      label: "协作",
      keywords: ["联机", "好友", "合作", "协作", "一起", "共同", "multiplayer", "co-op", "coop", "friend", "cooperate", "together"]
    },
    {
      id: "growth",
      label: "成长目标",
      keywords: ["成长", "升级", "后期", "目标", "长线", "内容量", "progress", "progression", "upgrade", "late game", "goal", "long-term", "content"]
    },
    {
      id: "expression",
      label: "策略表达",
      keywords: ["表达", "个性", "自定义", "搭配", "组合", "策略", "customization", "customize", "personality", "build variety", "strategy", "strategic"]
    },
    {
      id: "exploration",
      label: "探索",
      keywords: ["探索", "地图", "世界", "区域", "发现", "explore", "exploration", "map", "world", "region", "discover"]
    },
    {
      id: "mastery",
      label: "掌握技巧",
      keywords: ["操作", "技巧", "手感", "挑战", "难度", "controls", "skill", "skill-based", "challenge", "difficulty", "mechanics"]
    }
  ];

  var HYPOTHESIS_TEMPLATES = {
    collection: {
      title: "生物作为生产单元",
      statement: "把可收集生物部署到生产岗位，可以同时增强收集、自动化与策略表达。",
      mechanisms: ["生物收集", "岗位分配", "基地自动化"],
      targetUser: "喜欢收集、自动化与轻协作的玩家",
      differentiation: "收集物从资产变成生产力与情感资产",
      precedents: ["幻兽帕鲁", "星露谷物语", "Valheim"],
      risks: ["自动化过强可能削弱玩家主动操作参与"]
    },
    automation: {
      title: "可表达的自动化产线",
      statement: "用角色化单元组合替代纯流水线摆放，可以提升自动化系统的策略表达。",
      mechanisms: ["岗位角色", "组合加成", "产线规划"],
      targetUser: "喜欢系统优化与构建的玩家",
      differentiation: "自动化从摆放效率升级为策略配队",
      precedents: ["戴森球计划", "异星工厂"],
      risks: ["策略过深可能提高理解成本"]
    },
    cooperation: {
      title: "共同目标驱动后期协作",
      statement: "把个人生产成果汇入团队共同目标，可以提升后期目标感与协作动机。",
      mechanisms: ["资源贡献", "阶段解锁", "共同建造"],
      targetUser: "偏社交、喜欢共同目标的中小队玩家",
      differentiation: "个人自动化成果转化为团队共享目标",
      precedents: ["Valheim", "幻兽帕鲁"],
      risks: ["高活跃玩家可能代打，弱化普通玩家参与"]
    },
    growth: {
      title: "阶段化长线目标",
      statement: "把后期重复劳动重构为阶段化目标，可以提升长线留存与目标感。",
      mechanisms: ["阶段目标", "解锁节奏", "成就系统"],
      targetUser: "喜欢长线经营和养成的玩家",
      differentiation: "后期从重复循环转为阶段突破",
      precedents: ["星露谷物语", "牧场物语"],
      risks: ["内容产能不足会造成空洞目标"]
    },
    expression: {
      title: "岗位组合策略",
      statement: "让不同单元通过岗位组合产生可识别效果，可以提升策略表达与重开动机。",
      mechanisms: ["岗位角色", "组合加成", "即时反馈"],
      targetUser: "喜欢优化、构建和 experimenting 的玩家",
      differentiation: "玩家通过组合表达个人策略",
      precedents: ["自动化工厂", "塔防", "肉鸽构建"],
      risks: ["变量过多会压过核心乐趣"]
    },
    exploration: {
      title: "探索驱动资源发现",
      statement: "把关键生产资源绑定到可探索区域，可以强化探索与建造动机的耦合。",
      mechanisms: ["区域探索", "资源发现", "建造解锁"],
      targetUser: "喜欢探索与建造的玩家",
      differentiation: "探索结果直接改变建造策略",
      precedents: ["Valheim", "幻兽帕鲁"],
      risks: ["探索成本过高会打断生产节奏"]
    },
    mastery: {
      title: "技巧介入自动化",
      statement: "在自动化过程中保留低频技巧操作，可以避免玩家被完全排除出生产循环。",
      mechanisms: ["自动化", "技巧校准", "生产加成"],
      targetUser: "喜欢操作与优化兼顾的玩家",
      differentiation: "自动化不等于完全托管",
      precedents: ["异星工厂", "戴森球计划"],
      risks: ["技巧要求过高会破坏自动化爽感"]
    }
  };

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function round(value, digits) {
    var factor = Math.pow(10, digits || 0);
    return Math.round(value * factor) / factor;
  }

  function normalizeSentiment(value) {
    var v = String(value || "").toLowerCase();
    if (["neg", "negative", "负面", "差评", "-"].indexOf(v) !== -1) return "negative";
    if (["pos", "positive", "正面", "好评", "+"].indexOf(v) !== -1) return "positive";
    return "neutral";
  }

  function parseReviews(input) {
    if (typeof input !== "string" || !input.trim()) return [];

    var text = input.trim();
    if (text[0] === "[") {
      var parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) throw new Error("JSON 输入必须是数组");
      return parsed.map(function (item, index) {
        if (!item || typeof item.text !== "string" || !item.text.trim()) {
          throw new Error("第 " + (index + 1) + " 条 JSON 缺少 text 字段");
        }
        return {
          id: item.id || "rv" + String(index + 1).padStart(3, "0"),
          game: String(item.game || "未命名游戏"),
          sentiment: normalizeSentiment(item.sentiment),
          text: item.text.trim()
        };
      });
    }

    return text.split(/\r?\n/).map(function (line, index) {
      if (!line.trim()) return null;
      var parts = line.split("|").map(function (x) { return x.trim(); });
      if (parts.length < 3) {
        throw new Error("第 " + (index + 1) + " 行格式错误，应为：游戏|情绪|评论");
      }
      return {
        id: "rv" + String(index + 1).padStart(3, "0"),
        game: parts[0] || "未命名游戏",
        sentiment: normalizeSentiment(parts[1]),
        text: parts.slice(2).join("|")
      };
    }).filter(Boolean);
  }

  function normalizeDateValue(value, unitSeconds) {
    if (value == null || value === "") return null;
    if (typeof value === "number" && isFinite(value)) {
      var ms = unitSeconds ? value * 1000 : value;
      var date = new Date(ms);
      return isNaN(date.getTime()) ? null : date.toISOString();
    }
    var parsed = new Date(String(value));
    return isNaN(parsed.getTime()) ? null : parsed.toISOString();
  }

  function stableReviewId(value, prefix, index) {
    if (value == null || String(value).trim() === "") {
      return prefix + "-" + String(index + 1).padStart(3, "0");
    }
    return String(value).trim();
  }

  function tapTapScore(item) {
    if (!item) return null;
    if (typeof item.score === "number") return item.score;
    if (typeof item.rating === "number") return item.rating;
    if (item.score && typeof item.score.value === "number") return item.score.value;
    if (item.rating && typeof item.rating.value === "number") return item.rating.value;
    return null;
  }

  function tapTapText(item) {
    if (!item) return "";
    if (typeof item.text === "string") return item.text;
    if (item.contents && typeof item.contents.text === "string") return item.contents.text;
    if (typeof item.content === "string") return item.content;
    return "";
  }

  function detectReviewInput(input) {
    if (!input || typeof input !== "object") return null;

    if (input.source === "game_lab" && Array.isArray(input.reviews)) {
      return {
        platform: "game_lab",
        game: input.game || input.title,
        retrievedAt: input.retrievedAt || input.fetchedAt,
        records: input.reviews
      };
    }

    if (Array.isArray(input.reviews)) {
      var steamLike = input.reviews.some(function (item) {
        return item && (
          typeof item.review === "string" ||
          typeof item.voted_up === "boolean" ||
          item.recommendationid != null
        );
      });
      if (steamLike || input.source === "steam") {
        return {
          platform: "steam",
          game: input.game || input.app_name || input.title,
          retrievedAt: input.retrievedAt || input.fetchedAt,
          records: input.reviews
        };
      }

      return {
        platform: "taptap",
        game: input.game || input.title,
        retrievedAt: input.retrievedAt || input.fetched_at,
        records: input.reviews
      };
    }

    if (input.data && typeof input.data === "object") {
      var records = null;
      if (Array.isArray(input.data.list)) records = input.data.list;
      if (!records && Array.isArray(input.data.reviews)) records = input.data.reviews;
      if (records) {
        return {
          platform: "taptap",
          game: (input.data.game && input.data.game.name) || input.game || input.title,
          retrievedAt: input.retrievedAt || input.fetchedAt || input.data.fetchedAt,
          records: records
        };
      }
    }

    return null;
  }

  function importReviewDataset(input, fileName, importedAt) {
    var parsed = input;
    if (typeof input === "string") {
      try {
        parsed = JSON.parse(input);
      } catch (error) {
        throw new Error("导入失败：文件必须是有效 JSON。");
      }
    }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("导入失败：JSON 根节点必须是对象。");
    }

    var detected = detectReviewInput(parsed);
    if (!detected) throw new Error("导入失败：无法识别的评论格式。");

    var records = detected.records;
    var reviews = [];
    var skipped = 0;
    var createdDates = [];

    records.forEach(function (item, index) {
      var text = "";
      var sentiment = "neutral";
      var createdAt = null;
      var id = null;

      if (detected.platform === "game_lab") {
        if (!item) return;
        text = typeof item.text === "string" ? item.text : "";
        sentiment = normalizeSentiment(item.sentiment);
        createdAt = normalizeDateValue(item.createdAt, false);
        id = item.id;
      } else if (detected.platform === "steam") {
        if (!item) {
          skipped += 1;
          return;
        }
        text = typeof item.review === "string" ? item.review : "";
        sentiment = item.voted_up === true ? "positive" : (item.voted_up === false ? "negative" : "neutral");
        createdAt = normalizeDateValue(item.timestamp_created, true);
        id = item.recommendationid || item.id;
      } else {
        if (!item) {
          skipped += 1;
          return;
        }
        text = tapTapText(item);
        var score = tapTapScore(item);
        sentiment = score == null ? "neutral" : (score >= 4 ? "positive" : (score <= 2 ? "negative" : "neutral"));
        createdAt = normalizeDateValue(item.created_at || item.createdAt, false);
        id = item.id;
      }

      if (!text.trim()) {
        skipped += 1;
        return;
      }

      if (createdAt) createdDates.push(createdAt);
      reviews.push({
        id: stableReviewId(id, detected.platform, index),
        game: String(detected.game || "未知"),
        sentiment: sentiment,
        text: text.trim(),
        createdAt: createdAt || undefined
      });
    });

    if (!reviews.length) {
      throw new Error("导入失败：没有可导入的评论" + (skipped ? "，跳过 " + skipped + " 条空记录。" : "。"));
    }

    createdDates.sort();
    var dataset = {
      kind: "real",
      platform: detected.platform,
      game: String(detected.game || "未知"),
      fileName: String(fileName || "未知"),
      importedAt: String(importedAt || new Date().toISOString()),
      retrievedAt: normalizeDateValue(detected.retrievedAt, false),
      sampleCount: reviews.length,
      skippedCount: skipped,
      startedAt: createdDates.length ? createdDates[0] : null,
      endedAt: createdDates.length ? createdDates[createdDates.length - 1] : null
    };

    return { dataset: dataset, reviews: reviews };
  }

  function isUnmet(review) {
    return review.sentiment === "negative" ||
      /希望|想要|缺少|不足|期待|没法|无法|不够|重复|孤独|hope|wish|want|need|lack|missing|not enough|repetitive|grind|lonely/i.test(review.text);
  }

  function analyzeMotivations(reviews) {
    if (!Array.isArray(reviews) || !reviews.length) return [];

    var maxMentions = 1;
    var stats = MOTIVATIONS.map(function (motivation) {
      var evidence = [];
      var games = {};
      var satisfied = 0;
      var unmet = 0;

      reviews.forEach(function (review) {
        var normalizedReviewText = String(review.text || "").toLowerCase();
        var hit = motivation.keywords.some(function (keyword) {
          return normalizedReviewText.indexOf(String(keyword).toLowerCase()) !== -1;
        });
        if (!hit) return;
        games[review.game] = true;
        if (isUnmet(review)) unmet += 1;
        else satisfied += 1;
        if (evidence.length < 4) evidence.push({
          id: review.id,
          game: review.game,
          sentiment: review.sentiment,
          text: review.text
        });
      });

      var mentions = satisfied + unmet;
      maxMentions = Math.max(maxMentions, mentions);
      return {
        id: motivation.id,
        label: motivation.label,
        mentions: mentions,
        satisfied: satisfied,
        unmet: unmet,
        crossGames: Object.keys(games).length,
        demandScore: 0,
        gapScore: 0,
        evidence: evidence
      };
    }).filter(function (stat) {
      return stat.mentions > 0;
    });

    return stats.map(function (stat) {
      stat.demandScore = round(stat.mentions / maxMentions, 2);
      var unmetRatio = stat.unmet / stat.mentions;
      stat.gapScore = round(unmetRatio * (0.55 + 0.45 * stat.demandScore), 2);
      return stat;
    }).sort(function (a, b) {
      return b.gapScore - a.gapScore || b.mentions - a.mentions;
    });
  }

  function buildHypotheses(stats, limit) {
    if (!Array.isArray(stats) || !stats.length) return [];
    var selected = [];
    var usedTemplates = {};

    stats.forEach(function (stat) {
      if (selected.length >= (limit || 3)) return;
      var template = HYPOTHESIS_TEMPLATES[stat.id];
      if (!template || usedTemplates[stat.id]) return;
      usedTemplates[stat.id] = true;
      var confidence = clamp(
        Math.round(58 + stat.gapScore * 24 + stat.demandScore * 8 + Math.min(stat.crossGames, 3) * 4),
        55,
        95
      );
      selected.push({
        id: "HYP-" + String(selected.length + 1).padStart(3, "0"),
        title: template.title,
        statement: template.statement,
        mechanisms: template.mechanisms.slice(),
        targetUser: template.targetUser,
        differentiation: template.differentiation,
        precedents: template.precedents.slice(),
        risks: template.risks.slice(),
        confidence: confidence,
        motivation: stat,
        evidence: stat.evidence.slice(0, 3)
      });
    });

    return selected;
  }

  function buildExperiment(hypothesis) {
    if (!hypothesis) return null;
    return {
      hypothesisId: hypothesis.id,
      groups: [
        {
          id: "control",
          name: "对照组 · 手动生产",
          description: "玩家手动采集资源并完成目标，不包含岗位分配机制。"
        },
        {
          id: "treatment",
          name: "实验组 · 生物生产",
          description: "玩家捕捉生物并分配岗位，由生物组合驱动生产。"
        }
      ],
      metrics: [
        { id: "completion", label: "完成率", threshold: 0.5, why: "机制可理解、可完成" },
        { id: "adjustment", label: "主动调整率", threshold: 0.4, why: "机制产生策略表达" },
        { id: "restart", label: "重开率", threshold: 0.3, why: "存在二次兴趣" },
        { id: "share", label: "分享意愿", threshold: 0.2, why: "存在传播信号" }
      ],
      target: 12,
      durationMinutes: 10
    };
  }

  function hasEvent(session, type) {
    return session.events.some(function (event) { return event.type === type; });
  }

  function wilsonInterval(successes, total) {
    if (!total || total < 0 || successes < 0 || successes > total) return null;
    var z = 1.959963984540054;
    var proportion = successes / total;
    var denominator = 1 + (z * z) / total;
    var center = (proportion + (z * z) / (2 * total)) / denominator;
    var margin = z * Math.sqrt(
      (proportion * (1 - proportion)) / total +
      (z * z) / (4 * total * total)
    ) / denominator;
    return {
      rate: round(proportion, 2),
      lower: round(Math.max(0, center - margin), 2),
      upper: round(Math.min(1, center + margin), 2)
    };
  }

  function intervalsOverlap(a, b) {
    return Boolean(a && b && a.lower <= b.upper && b.lower <= a.upper);
  }

  function sampleStatus(total, target) {
    if (total <= 0) return "empty";
    if (total < 5) return "small";
    if (total < target) return "partial";
    return "ready";
  }

  function sampleStatusLabel(status) {
    return {
      empty: "未开始",
      small: "小样本 (<5)",
      partial: "收集中 (<12)",
      ready: "达到目标样本"
    }[status] || "未知";
  }

  function summarizeSessions(sessions) {
    var safeSessions = Array.isArray(sessions) ? sessions : [];
    var groups = ["control", "treatment"].map(function (groupId) {
      var list = safeSessions.filter(function (session) { return session.group === groupId; });
      var total = list.length;
      var completed = list.filter(function (session) { return hasEvent(session, "complete"); }).length;
      var adjusted = list.filter(function (session) {
        return session.events.filter(function (event) { return event.type === "assign"; }).length >= 1;
      }).length;
      var restarted = list.filter(function (session) { return hasEvent(session, "restart"); }).length;
      var shared = list.filter(function (session) { return hasEvent(session, "share_intent"); }).length;

      return {
        group: groupId,
        total: total,
        completionRate: total ? round(completed / total, 2) : 0,
        adjustmentRate: total ? round(adjusted / total, 2) : 0,
        restartRate: total ? round(restarted / total, 2) : 0,
        shareRate: total ? round(shared / total, 2) : 0,
        counts: {
          completion: completed,
          adjustment: adjusted,
          restart: restarted,
          share: shared
        },
        intervals: {
          completion: wilsonInterval(completed, total),
          adjustment: wilsonInterval(adjusted, total),
          restart: wilsonInterval(restarted, total),
          share: wilsonInterval(shared, total)
        },
        sampleStatus: sampleStatus(total, 12),
        sampleStatusLabel: null,
        funnel: {
          start: total,
          tutorial: list.filter(function (session) { return hasEvent(session, "tutorial_complete"); }).length,
          progress: list.filter(function (session) { return hasEvent(session, "cycle"); }).length,
          complete: completed,
          share: shared
        }
      };
    });

    groups.forEach(function (group) {
      group.sampleStatusLabel = sampleStatusLabel(group.sampleStatus);
    });

    var treatment = groups[1];
    var control = groups[0];
    var minimumTotal = Math.min(control.total, treatment.total);
    var overallSampleStatus = sampleStatus(minimumTotal, 12);
    var judgment = {
      status: "insufficient",
      headline: "样本不足，暂不能形成机制结论",
      sampleStatus: overallSampleStatus,
      sampleStatusLabel: sampleStatusLabel(overallSampleStatus),
      actions: ["继续收集会话数据", "确保对照组和实验组都有玩家完成流程"],
      confidenceNote: "指标使用 Wilson 95% 置信区间；区间较宽时只能视为观察信号。"
    };

    if (treatment.total >= 5 && control.total < 5) {
      judgment.status = "exploratory";
      judgment.headline = "实验组已有初步样本，但对照组不足";
      judgment.actions = ["继续补足对照组样本", "暂不做组间强弱结论", "只观察实验组流程可行性"];
    } else if (treatment.total >= 5 && control.total >= 5) {
      if (
        treatment.completionRate >= 0.5 &&
        treatment.adjustmentRate >= 0.4 &&
        (treatment.restartRate >= 0.3 || treatment.shareRate >= 0.2)
      ) {
        judgment.status = "signal";
        judgment.headline = "机制出现正向信号，值得进入下一轮验证";
        judgment.actions = ["保留生物岗位机制", "降低教学成本", "继续验证共同目标"];
      } else if (treatment.completionRate < 0.5) {
        judgment.status = "blocked";
        judgment.headline = "完成率未过线，优先排查理解成本";
        judgment.actions = ["缩短教学", "强化目标提示", "降低首次任务复杂度"];
      } else {
        judgment.status = "weak";
        judgment.headline = "机制可完成，但兴趣信号偏弱";
        judgment.actions = ["强化岗位组合反馈", "增加重开理由", "验证是否缺少明确目标"];
      }
    }

    return {
      groups: groups,
      comparison: {
        completionDelta: round(treatment.completionRate - control.completionRate, 2),
        shareDelta: round(treatment.shareRate - control.shareRate, 2),
        completionComparisonAvailable: Boolean(
          control.intervals.completion &&
          treatment.intervals.completion
        ),
        completionIntervalsOverlap: intervalsOverlap(
          control.intervals.completion,
          treatment.intervals.completion
        ),
        shareComparisonAvailable: Boolean(
          control.intervals.share &&
          treatment.intervals.share
        ),
        shareIntervalsOverlap: intervalsOverlap(
          control.intervals.share,
          treatment.intervals.share
        )
      },
      judgment: judgment
    };
  }

  function buildKnowledge(summary, hypothesis) {
    if (!summary || !summary.groups || !summary.groups[1] || !hypothesis) return null;
    var treatment = summary.groups[1];
    if (!treatment.total) return null;
    return {
      mechanism: hypothesis ? hypothesis.title : "未选择机制",
      motivations: hypothesis ? [hypothesis.motivation.label] : [],
      effect: {
        completionRate: treatment.completionRate,
        adjustmentRate: treatment.adjustmentRate,
        restartRate: treatment.restartRate,
        shareRate: treatment.shareRate
      },
      boundary: treatment.total < 12
      ? "样本少于 12，仅可用于流程演示，不可用于立项判断"
      : "初步适用于收集 + 自动化动机明显的生存建造切片；仍需更大样本和版本迭代验证",
      nextAction: summary.judgment.actions[0] || "继续收集数据"
    };
  }

  function eventsToCSV(sessions) {
    var rows = [["group", "sessionId", "sessionStartedAt", "eventIndex", "eventType", "eventAt", "detail"]];
    (sessions || []).forEach(function (session) {
      session.events.forEach(function (event, index) {
        rows.push([
          session.group,
          session.sessionId,
          session.startedAt,
          String(index + 1),
          event.type,
          event.at,
          JSON.stringify(event.detail || {})
        ]);
      });
    });
    return rows.map(function (row) {
      return row.map(function (cell) {
        var value = String(cell);
        if (/[",\n]/.test(value)) return '"' + value.replace(/"/g, '""') + '"';
        return value;
      }).join(",");
    }).join("\n");
  }

  var DEMO_REVIEWS = [
    { game: "幻兽帕鲁", sentiment: "negative", text: "喜欢收集生物，但希望它们除了战斗，还能参与基地生产和自动化。" },
    { game: "幻兽帕鲁", sentiment: "positive", text: "把宠物放进基地干活很有意思，收集和建造终于连起来了。" },
    { game: "幻兽帕鲁", sentiment: "negative", text: "后期目标不足，基地建完之后就变得重复。" },
    { game: "星露谷物语", sentiment: "positive", text: "农场成长目标清晰，每天都有一个新目标。" },
    { game: "星露谷物语", sentiment: "negative", text: "一个人玩很孤独，希望有更多和好友合作的共同目标。" },
    { game: "星露谷物语", sentiment: "negative", text: "后期自动化不足，重复劳动太多。" },
    { game: "Valheim", sentiment: "positive", text: "和朋友一起建造基地、探索地图非常快乐。" },
    { game: "Valheim", sentiment: "negative", text: "后期缺少共同目标，联机之后不知道该一起做什么。" },
    { game: "Valheim", sentiment: "negative", text: "想要更多个性化和自定义搭配，基地容易长得一样。" },
    { game: "戴森球计划", sentiment: "positive", text: "自动化产线和工厂规划很有策略深度。" },
    { game: "戴森球计划", sentiment: "negative", text: "自动化很强，但缺少生物收集和情感表达。" }
  ];

  var api = {
    MOTIVATIONS: MOTIVATIONS,
    wilsonInterval: wilsonInterval,
    intervalsOverlap: intervalsOverlap,
    DEMO_REVIEWS: DEMO_REVIEWS,
    parseReviews: parseReviews,
    importReviewDataset: importReviewDataset,
    analyzeMotivations: analyzeMotivations,
    buildHypotheses: buildHypotheses,
    buildExperiment: buildExperiment,
    summarizeSessions: summarizeSessions,
    buildKnowledge: buildKnowledge,
    eventsToCSV: eventsToCSV
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  global.GameLabEngine = api;
})(typeof window !== "undefined" ? window : globalThis);
