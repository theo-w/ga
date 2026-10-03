# Implementation Plan: Real Review Import

**Branch**: `codex/real-review-import` | **Date**: 2026-10-03 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-real-review-import/spec.md`

## Summary

Add a local, backend-free review JSON importer to Game Lab. The importer accepts a normalized Game Lab dataset and conservative adapters for Steam-style and TapTap-style review JSON, validates records, preserves source IDs and timestamps where available, and stores one active dataset with auditable metadata. The Input view exposes the import control and dataset boundary card; analysis continues through the existing rule engine and export path.

## Technical Context

- **Runtime**: Browser
- **Language**: JavaScript ES5-compatible
- **State Store**: `localStorage`
- **Test Runner**: Node.js built-in test runner
- **External Runtime Dependencies**: None
- **Network Behavior**: None; the selected file never leaves the browser

## Constitution Check

- **Evidence Before Conclusion**: Dataset metadata and normalized review evidence are visible and exportable.
- **AI Assists, Humans Decide**: Imported data only feeds hypotheses; it does not auto-approve a project.
- **Validate Mechanisms, Not Generate Full Games**: Real reviews improve the upstream evidence quality of the mechanism loop.
- **Local-First Until Workflow Is Proven**: Import uses FileReader and localStorage only.
- **Small Samples Are Not Decisions**: Sample count and missing metadata boundaries are displayed.
- **Testable and Explainable Output**: Import adapters and errors are unit-tested.
- **Minimal Scope**: No scraping, account, backend, or LLM integration.

## Project Structure

```text
lab.html
css/lab.css
js/
├── engine.js
└── app.js
tests/
└── engine.test.js
specs/002-real-review-import/
├── spec.md
├── plan.md
├── data-model.md
├── quickstart.md
└── tasks.md
```

## Design Decisions

### 1. Adapter in the Pure Engine

`js/engine.js` owns `importReviewDataset(input, fileName)`:

- Detects normalized Game Lab, Steam-style, and TapTap-style JSON.
- Validates and normalizes records.
- Computes metadata and skipped counts.
- Returns `{ dataset, reviews }`.
- Throws actionable errors for invalid or empty datasets.

Keeping this logic in the engine makes it testable without a browser.

### 2. Supported Input Shapes

**Normalized Game Lab**:

```json
{
  "source": "game_lab",
  "game": "Example Game",
  "retrievedAt": "2026-10-03T08:00:00.000Z",
  "reviews": []
}
```

**Steam-compatible**: an object containing a non-empty `reviews` array. Each review uses `recommendationid`, `review`, `voted_up`, and `timestamp_created`.

**TapTap-compatible**: an object containing a review list under `data.list`, `data.reviews`, or `reviews`. Each item can use `id`, `text` or `contents.text`, and a numeric `score` / `rating`.

The adapters deliberately support conservative shapes rather than pretending to cover every platform API response.

### 3. One Active Dataset

State stores one `dataset`. Importing a real dataset:

- replaces `reviews`, `stats`, `hypotheses`, `selectedHypothesisId`, and `experiment`;
- clears active play sessions and game state because downstream data belongs to the old hypothesis;
- writes canonical review JSON to `inputText` so the current `分析口碑` path remains reproducible.

### 4. Metadata Boundary

The UI shows a data source card with:

- `平台`
- `游戏`
- `样本`
- `导入时间`
- `采集时间`
- `评论时间范围`
- `跳过记录`
- `来源文件`

Missing values display `未知`. Demo/manual input is explicitly labelled as non-real.

### 5. Error Handling

The importer never partially replaces state. The engine returns a complete result or throws. The UI catches the error, displays it in the existing input error area, and leaves the current state untouched.

## Implementation Tasks

Tasks are listed in [tasks.md](./tasks.md).

## Testing Strategy

- Unit tests cover Steam import, TapTap import, normalized import, metadata boundaries, skipped records, and every error case.
- Existing tests ensure manual parsing and motivation analysis remain intact.
- Browser smoke checks verify the import control, metadata card, analysis flow, and export payload.

## Rollout Plan

1. Add engine adapter and tests.
2. Add app state and Input UI.
3. Add metadata and export integration.
4. Update README and quickstart.
5. Run automated and smoke checks.
6. Open and merge a pull request.
