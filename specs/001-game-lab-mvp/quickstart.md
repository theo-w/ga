# Quickstart: Game Lab Local-first Functional MVP

## Prerequisites

- Node.js 24+
- Modern browser

## Run Tests

```bash
npm run check
```

## Start Local Server

```bash
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000/lab.html
```

## User Journey

### 1. Input Insights

1. Click `输入洞察`.
2. Click `载入演示数据`.
3. Click `分析口碑`.
4. Review motivation demand, gap score, cross-game count, and evidence.

Expected result:

- At least one motivation appears.
- Evidence can be traced to the input reviews.

### 2. Select Hypothesis

1. Open `机制假设`.
2. Review statement, mechanism combination, target user, differentiation, precedents, and risks.
3. Click `选择该假设`.

Expected result:

- The selected hypothesis is highlighted.
- Experiment design becomes available.

### 3. Review Experiment Design

1. Open `实验设计`.
2. Review control and treatment groups.
3. Review metrics and thresholds.

Expected result:

- Control and treatment descriptions exist.
- Completion, adjustment, restart, and share metrics are visible.

### 4. Play Prototype

#### Control Group

1. Open `机制原型`.
2. Click `开始对照组`.
3. Click `完成教学`.
4. Click `采集资源 +3` until resources reach 30.

#### Treatment Group

1. Click `开始实验组`.
2. Click `完成教学`.
3. Capture all three creatures.
4. Assign each creature to a station.
5. Wait for automatic production until delivery reaches 30.

Expected result:

- Every key action appears in the event log.
- Completing the target records `complete`.

### 5. Review Results

1. Open `结果回流`.
2. Review treatment funnel and group metrics.
3. Review sample status and judgment.
4. Click `导出实验 JSON`.
5. Click `导出事件 CSV`.

Expected result:

- Metrics are calculated from local sessions.
- Small-sample boundaries are visible.
- JSON and CSV files can be downloaded.

### 6. Import Data

1. Click `导入 JSON`.
2. Select a previously exported JSON file.

Expected result:

- State is restored.
- Result view is shown.

### 7. Generate Mechanism Knowledge

1. Open `机制知识库`.

Expected result:

- A mechanism knowledge card appears if sessions exist.
- Boundary and next action are shown.
- Empty state is shown if no session exists.

## Validation Checklist

- [ ] Demo data loads.
- [ ] Review parsing works.
- [ ] Motivation analysis works.
- [ ] Hypothesis is generated.
- [ ] Experiment design is generated.
- [ ] Control group is playable.
- [ ] Treatment group is playable.
- [ ] Events are recorded.
- [ ] Result metrics are calculated.
- [ ] JSON export works.
- [ ] CSV export works.
- [ ] JSON import works.
- [ ] Mechanism knowledge is generated.
- [ ] `npm run check` passes.
