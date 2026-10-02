# Data Model: Game Lab Local-first Functional MVP

## Overview

Game Lab MVP 的数据模型围绕“口碑样本 → 机制假设 → 实验 → 行为事件 → 结果 → 机制知识”设计。
当前所有数据保存在浏览器 `localStorage`，不依赖服务端。

## Entities

### ReviewInput

```json
{
  "id": "rv001",
  "game": "幻兽帕鲁",
  "sentiment": "negative",
  "text": "希望生物除了战斗，还能参与基地生产。"
}
```

| Field | Type | Description |
|---|---|---|
| `id` | string | 评论样本 ID |
| `game` | string | 游戏名称 |
| `sentiment` | string | `positive` / `negative` / `neutral` |
| `text` | string | 评论正文 |

### MotivationStat

```json
{
  "id": "collection",
  "label": "收集",
  "mentions": 4,
  "satisfied": 1,
  "unmet": 3,
  "crossGames": 3,
  "demandScore": 0.8,
  "gapScore": 0.72,
  "evidence": []
}
```

| Field | Type | Description |
|---|---|---|
| `id` | string | 动机 ID |
| `label` | string | 动机名称 |
| `mentions` | number | 相关评论数 |
| `satisfied` | number | 已满足评论数 |
| `unmet` | number | 未满足或负面评论数 |
| `crossGames` | number | 出现该动机的游戏数 |
| `demandScore` | number | 需求强度 |
| `gapScore` | number | 缺口强度 |
| `evidence` | array | 证据评论列表 |

### Hypothesis

```json
{
  "id": "HYP-001",
  "title": "生物作为生产单元",
  "statement": "把可收集生物部署到生产岗位，可以同时增强收集、自动化与策略表达。",
  "mechanisms": ["生物收集", "岗位分配", "基地自动化"],
  "targetUser": "喜欢收集、自动化与轻协作的玩家",
  "differentiation": "收集物从资产变成生产力与情感资产",
  "precedents": ["幻兽帕鲁", "星露谷物语", "Valheim"],
  "risks": ["自动化过强可能削弱玩家主动操作参与"],
  "confidence": 88,
  "motivation": {},
  "evidence": []
}
```

### Experiment

```json
{
  "hypothesisId": "HYP-001",
  "groups": [
    { "id": "control", "name": "对照组 · 手动生产" },
    { "id": "treatment", "name": "实验组 · 生物生产" }
  ],
  "metrics": [
    { "id": "completion", "label": "完成率", "threshold": 0.5 }
  ],
  "target": 12,
  "durationMinutes": 10
}
```

### PlaySession

```json
{
  "sessionId": "session_1760000000000",
  "group": "treatment",
  "startedAt": "2026-10-03T00:00:00.000Z",
  "endedAt": "2026-10-03T00:04:00.000Z",
  "events": []
}
```

### SessionEvent

```json
{
  "type": "assign",
  "at": "2026-10-03T00:01:00.000Z",
  "detail": {
    "creature": "苔灵",
    "station": "采集岗"
  }
}
```

支持的事件：

- `start`
- `tutorial_complete`
- `capture`
- `assign`
- `cycle`
- `manual_gather`
- `complete`
- `restart`
- `share_intent`
- `abandon`

### GroupSummary

```json
{
  "group": "treatment",
  "total": 12,
  "completionRate": 0.67,
  "adjustmentRate": 0.75,
  "restartRate": 0.33,
  "shareRate": 0.25,
  "counts": {},
  "intervals": {},
  "sampleStatus": "ready",
  "sampleStatusLabel": "达到目标样本",
  "funnel": {}
}
```

### ExperimentSummary

```json
{
  "groups": [],
  "comparison": {
    "completionDelta": 0.2,
    "shareDelta": 0.1,
    "completionIntervalsOverlap": true,
    "shareIntervalsOverlap": true
  },
  "judgment": {
    "status": "signal",
    "headline": "机制出现正向信号，值得进入下一轮验证",
    "sampleStatus": "ready",
    "actions": []
  }
}
```

### MechanismKnowledge

```json
{
  "mechanism": "生物作为生产单元",
  "motivations": ["收集"],
  "effect": {
    "completionRate": 0.67,
    "adjustmentRate": 0.75,
    "restartRate": 0.33,
    "shareRate": 0.25
  },
  "boundary": "样本少于 12，仅可用于流程演示，不可用于立项判断",
  "nextAction": "继续收集会话数据"
}
```

## State Store

```json
{
  "version": 1,
  "inputText": "",
  "reviews": [],
  "stats": [],
  "hypotheses": [],
  "selectedHypothesisId": null,
  "experiment": null,
  "sessions": [],
  "activeSession": null,
  "game": null
}
```

## Data Flow

```text
ReviewInput
  → MotivationStat
  → Hypothesis
  → Experiment
  → PlaySession + SessionEvent
  → ExperimentSummary
  → MechanismKnowledge
```

## Statistical Boundaries

- 目标样本：每组 12 个会话；
- 小于 5 个会话：小样本；
- 5 到 11 个会话：收集中；
- 达到 12 个会话：达到目标样本；
- 指标展示 Wilson 95% 置信区间；
- 对照组与实验组区间重叠时，不做组间强弱结论。
