const test = require("node:test");
const assert = require("node:assert/strict");
const engine = require("../js/engine.js");

test("parses line input", () => {
  const reviews = engine.parseReviews("幻兽帕鲁|负面|希望生物参与生产");
  assert.equal(reviews.length, 1);
  assert.equal(reviews[0].game, "幻兽帕鲁");
  assert.equal(reviews[0].sentiment, "negative");
});

test("rejects invalid line input", () => {
  assert.throws(() => engine.parseReviews("无效行"), /格式错误/);
});

test("parses JSON input and normalizes sentiment", () => {
  const reviews = engine.parseReviews(JSON.stringify([
    { game: "幻兽帕鲁", sentiment: "负面", text: "希望生物参与生产" },
    { game: "星露谷物语", sentiment: "positive", text: "成长目标清晰" }
  ]));
  assert.equal(reviews.length, 2);
  assert.equal(reviews[0].sentiment, "negative");
  assert.equal(reviews[1].sentiment, "positive");
});

test("imports a normalized Game Lab review dataset", () => {
  const result = engine.importReviewDataset({
    source: "game_lab",
    game: "Example Game",
    retrievedAt: "2026-10-03T08:00:00.000Z",
    reviews: [
      {
        id: "review-1",
        game: "Example Game",
        sentiment: "negative",
        text: "希望生物可以参与自动化生产。",
        createdAt: "2026-09-30T00:00:00.000Z"
      }
    ]
  }, "game-lab.json", "2026-10-03T08:10:00.000Z");

  assert.equal(result.dataset.kind, "real");
  assert.equal(result.dataset.platform, "game_lab");
  assert.equal(result.dataset.game, "Example Game");
  assert.equal(result.dataset.fileName, "game-lab.json");
  assert.equal(result.dataset.importedAt, "2026-10-03T08:10:00.000Z");
  assert.equal(result.dataset.retrievedAt, "2026-10-03T08:00:00.000Z");
  assert.equal(result.dataset.sampleCount, 1);
  assert.equal(result.dataset.skippedCount, 0);
  assert.equal(result.dataset.startedAt, "2026-09-30T00:00:00.000Z");
  assert.equal(result.dataset.endedAt, "2026-09-30T00:00:00.000Z");
  assert.equal(result.reviews.length, 1);
  assert.equal(result.reviews[0].id, "review-1");
  assert.equal(result.reviews[0].game, "Example Game");
  assert.equal(result.reviews[0].sentiment, "negative");
});

test("imports a Steam-compatible review dataset", () => {
  const result = engine.importReviewDataset({
    query_summary: { total_reviews: 2 },
    reviews: [
      {
        recommendationid: "steam-1",
        review: "The automation loop is satisfying.",
        voted_up: true,
        timestamp_created: 1790000000
      },
      {
        recommendationid: "steam-2",
        review: "The late game lacks goals.",
        voted_up: false,
        timestamp_created: 1790001000
      }
    ]
  }, "steam.json", "2026-10-03T08:10:00.000Z");

  assert.equal(result.dataset.platform, "steam");
  assert.equal(result.dataset.game, "未知");
  assert.equal(result.dataset.sampleCount, 2);
  assert.equal(result.dataset.skippedCount, 0);
  assert.equal(result.dataset.startedAt, new Date(1790000000 * 1000).toISOString());
  assert.equal(result.dataset.endedAt, new Date(1790001000 * 1000).toISOString());
  assert.equal(result.reviews[0].id, "steam-1");
  assert.equal(result.reviews[0].sentiment, "positive");
  assert.equal(result.reviews[1].sentiment, "negative");
});

test("imports a TapTap-compatible review dataset", () => {
  const result = engine.importReviewDataset({
    data: {
      game: { name: "Example Mobile Game" },
      list: [
        {
          id: "tap-1",
          text: "自动化玩法很有深度。",
          score: 5,
          created_at: "2026-09-28T00:00:00.000Z"
        },
        {
          id: "tap-2",
          contents: { text: "后期缺少目标。" },
          rating: 1,
          created_at: "2026-09-29T00:00:00.000Z"
        }
      ]
    }
  }, "taptap.json", "2026-10-03T08:10:00.000Z");

  assert.equal(result.dataset.platform, "taptap");
  assert.equal(result.dataset.game, "Example Mobile Game");
  assert.equal(result.dataset.sampleCount, 2);
  assert.equal(result.dataset.skippedCount, 0);
  assert.equal(result.reviews[0].sentiment, "positive");
  assert.equal(result.reviews[1].text, "后期缺少目标。");
  assert.equal(result.reviews[1].sentiment, "negative");
  assert.equal(result.dataset.startedAt, "2026-09-28T00:00:00.000Z");
  assert.equal(result.dataset.endedAt, "2026-09-29T00:00:00.000Z");
});

test("imports review datasets from JSON text and skips unusable records", () => {
  const result = engine.importReviewDataset(JSON.stringify({
    source: "game_lab",
    game: "Example Game",
    reviews: [
      { id: "ok", sentiment: "positive", text: "基地建造目标清晰。" },
      { id: "empty", sentiment: "positive", text: "   " },
      { sentiment: "negative", text: "希望加入自动化。" }
    ]
  }), "mixed.json", "2026-10-03T08:10:00.000Z");

  assert.equal(result.dataset.sampleCount, 2);
  assert.equal(result.dataset.skippedCount, 1);
  assert.equal(result.reviews[0].id, "ok");
  assert.match(result.reviews[1].id, /^game_lab-003$/);
});

test("rejects invalid and unsupported review datasets", () => {
  assert.throws(() => engine.importReviewDataset("not-json"), /有效 JSON/);
  assert.throws(() => engine.importReviewDataset({ foo: "bar" }), /无法识别的评论格式/);
  assert.throws(() => engine.importReviewDataset({ source: "game_lab", reviews: [] }), /没有可导入的评论/);
  assert.throws(() => engine.importReviewDataset({
    reviews: [{ review: "   ", voted_up: true }]
  }), /没有可导入的评论.*跳过 1/);
});

test("analyzes motivations with evidence and gap score", () => {
  const stats = engine.analyzeMotivations(engine.DEMO_REVIEWS);
  assert.ok(stats.length > 0);
  const collection = stats.find((item) => item.id === "collection");
  assert.ok(collection);
  assert.ok(collection.mentions > 0);
  assert.ok(collection.evidence.length > 0);
  assert.ok(collection.gapScore > 0);
});

test("analyzes English Steam reviews and generates a collection hypothesis", () => {
  const result = engine.importReviewDataset({
    source: "steam",
    game: "Automation Frontier",
    reviews: [
      {
        recommendationid: "steam-en-1",
        review: "Creature Collection is fun, but I wish creatures could work in Base Automation.",
        voted_up: false
      },
      {
        recommendationid: "steam-en-2",
        review: "The factory production loop is satisfying.",
        voted_up: true
      }
    ]
  }, "steam-en.json");
  const stats = engine.analyzeMotivations(result.reviews);
  const hypotheses = engine.buildHypotheses(stats, 3);

  assert.ok(stats.some((item) => item.id === "collection"));
  assert.ok(hypotheses.some((item) => item.id === "HYP-001" && item.title === "生物作为生产单元"));
});

test("builds hypothesis and experiment", () => {
  const stats = engine.analyzeMotivations(engine.DEMO_REVIEWS);
  const hypotheses = engine.buildHypotheses(stats, 3);
  assert.ok(hypotheses.length >= 1);
  assert.ok(hypotheses[0].confidence >= 55);
  const experiment = engine.buildExperiment(hypotheses[0]);
  assert.equal(experiment.groups.length, 2);
  assert.equal(experiment.target, 12);
});

test("summarizes sessions and warns on small samples", () => {
  const summary = engine.summarizeSessions([
    {
      group: "treatment",
      sessionId: "s1",
      events: [
        { type: "start" },
        { type: "tutorial_complete" },
        { type: "capture" },
        { type: "assign" },
        { type: "cycle" },
        { type: "complete" }
      ]
    }
  ]);
  assert.equal(summary.groups[1].total, 1);
  assert.equal(summary.groups[1].completionRate, 1);
  assert.equal(summary.judgment.status, "insufficient");
});

test("exports events CSV", () => {
  const csv = engine.eventsToCSV([
    {
      group: "treatment",
      sessionId: "s1",
      startedAt: "2026-10-02T00:00:00.000Z",
      events: [{ type: "start", at: "2026-10-02T00:00:01.000Z", detail: { source: "demo" } }]
    }
  ]);
  const lines = csv.split("\n");
  assert.equal(lines.length, 2);
  assert.match(lines[1], /treatment,s1/);
});

test("builds mechanism knowledge only after sessions exist", () => {
  const stats = engine.analyzeMotivations(engine.DEMO_REVIEWS);
  const hypothesis = engine.buildHypotheses(stats, 1)[0];

  const emptySummary = engine.summarizeSessions([]);
  assert.equal(engine.buildKnowledge(emptySummary, hypothesis), null);

  const summary = engine.summarizeSessions([
    {
      group: "treatment",
      sessionId: "s1",
      events: [
        { type: "start" },
        { type: "tutorial_complete" },
        { type: "capture" },
        { type: "assign" },
        { type: "cycle" },
        { type: "complete" }
      ]
    }
  ]);
  const knowledge = engine.buildKnowledge(summary, hypothesis);
  assert.equal(knowledge.mechanism, hypothesis.title);
  assert.equal(knowledge.effect.completionRate, 1);
  assert.match(knowledge.boundary, /样本少于 12/);
});

test("calculates Wilson interval boundaries", () => {
  const zero = engine.wilsonInterval(0, 10);
  assert.equal(zero.rate, 0);
  assert.equal(zero.lower, 0);
  assert.equal(zero.upper, 0.28);

  const all = engine.wilsonInterval(10, 10);
  assert.equal(all.rate, 1);
  assert.equal(all.lower, 0.72);
  assert.equal(all.upper, 1);

  const mixed = engine.wilsonInterval(5, 10);
  assert.equal(mixed.rate, 0.5);
  assert.equal(mixed.lower, 0.24);
  assert.equal(mixed.upper, 0.76);

  assert.equal(engine.wilsonInterval(11, 10), null);
  assert.equal(engine.wilsonInterval(-1, 10), null);
  assert.equal(engine.wilsonInterval(1, 0), null);
});

test("detects interval overlap", () => {
  assert.equal(engine.intervalsOverlap(
    { lower: 0.1, upper: 0.3 },
    { lower: 0.2, upper: 0.4 }
  ), true);
  assert.equal(engine.intervalsOverlap(
    { lower: 0.4, upper: 0.6 },
    { lower: 0.1, upper: 0.3 }
  ), false);
  assert.equal(engine.intervalsOverlap(null, { lower: 0.1, upper: 0.2 }), false);
});

test("summarizes sample status and exploratory judgment", () => {
  function session(group, complete) {
    return {
      group,
      sessionId: group + "-" + Math.random().toString(36).slice(2),
      events: complete
        ? [{ type: "start" }, { type: "tutorial_complete" }, { type: "complete" }]
        : [{ type: "start" }]
    };
  }

  const small = engine.summarizeSessions([
    session("treatment", true),
    session("treatment", false)
  ]);
  assert.equal(small.groups[1].sampleStatus, "small");
  assert.equal(small.judgment.status, "insufficient");

  const exploratory = engine.summarizeSessions([
    session("treatment", true),
    session("treatment", true),
    session("treatment", true),
    session("treatment", true),
    session("treatment", true)
  ]);
  assert.equal(exploratory.groups[1].sampleStatus, "partial");
  assert.equal(exploratory.judgment.status, "exploratory");

  const ready = engine.summarizeSessions([
    ...Array.from({ length: 12 }, () => session("control", true)),
    ...Array.from({ length: 12 }, () => session("treatment", true))
  ]);
  assert.equal(ready.groups[0].sampleStatus, "ready");
  assert.equal(ready.groups[1].sampleStatus, "ready");
  assert.equal(ready.judgment.sampleStatus, "ready");
});

test("reports comparison availability and interval overlap", () => {
  function session(group, complete, shared) {
    const events = [{ type: "start" }];
    if (complete) events.push({ type: "complete" });
    if (shared) events.push({ type: "share_intent" });
    return { group, sessionId: group + "-" + Math.random().toString(36).slice(2), events };
  }

  const summary = engine.summarizeSessions([
    session("control", false, false),
    session("treatment", true, true)
  ]);

  assert.equal(summary.comparison.completionComparisonAvailable, true);
  assert.equal(summary.comparison.shareComparisonAvailable, true);
  assert.equal(summary.comparison.completionIntervalsOverlap, true);
  assert.equal(summary.comparison.shareIntervalsOverlap, true);
});
