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

test("analyzes motivations with evidence and gap score", () => {
  const stats = engine.analyzeMotivations(engine.DEMO_REVIEWS);
  assert.ok(stats.length > 0);
  const collection = stats.find((item) => item.id === "collection");
  assert.ok(collection);
  assert.ok(collection.mentions > 0);
  assert.ok(collection.evidence.length > 0);
  assert.ok(collection.gapScore > 0);
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
  assert.match(knowledge.boundary, /样本少于 5/);
});
