# Data Model: Real Review Import

## RealReviewDataset

```json
{
  "source": "steam",
  "game": "Example Game",
  "retrievedAt": "2026-10-03T08:00:00.000Z",
  "reviews": []
}
```

Fields:

- `source`: `steam`, `taptap`, `game_lab`, or `manual`
- `game`: source game name; `未知` when unavailable
- `retrievedAt`: optional source retrieval timestamp
- `reviews`: normalized review array

## DatasetMetadata

```json
{
  "kind": "real",
  "platform": "steam",
  "game": "Example Game",
  "fileName": "steam-reviews.json",
  "importedAt": "2026-10-03T08:48:15.000Z",
  "retrievedAt": "2026-10-03T08:00:00.000Z",
  "sampleCount": 120,
  "skippedCount": 2,
  "startedAt": "2026-09-01T00:00:00.000Z",
  "endedAt": "2026-10-01T00:00:00.000Z"
}
```

Constraints:

- `kind` is `real` for imported datasets and `manual` for demo/pasted input.
- `platform` must be a supported non-empty string for imported data.
- `sampleCount` must equal the number of normalized reviews.
- `skippedCount` records records with missing/empty text.
- Missing `game`, `retrievedAt`, and time-range values are displayed as `未知`, not fabricated.
- `fileName` is the browser-provided file name; no path or credential is stored.

## NormalizedReview

```json
{
  "id": "steam-123",
  "game": "Example Game",
  "sentiment": "positive",
  "text": "The automation loop is satisfying.",
  "createdAt": "2026-10-01T00:00:00.000Z"
}
```

Sentiment mapping:

- Steam `voted_up: true` → `positive`
- Steam `voted_up: false` → `negative`
- TapTap score/rating >= 4 → `positive`
- TapTap score/rating <= 2 → `negative`
- Other ratings or missing ratings → `neutral`
- Existing positive/negative/neutral strings are normalized by the current engine rules

## State Store

```json
{
  "version": 1,
  "inputText": "",
  "dataset": null,
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

`dataset` is `null` for demo/manual input.

## Data Flow

```text
Local JSON file
  → importReviewDataset()
  → RealReviewDataset + DatasetMetadata + NormalizedReview[]
  → analyzeMotivations()
  → buildHypotheses()
  → buildExperiment()
  → exportJSON()
```

## Privacy and Evidence Boundaries

- The file is read locally with `FileReader`.
- No network request is made.
- The normalized dataset is stored in `localStorage`.
- Exported experiment JSON includes dataset metadata and normalized reviews so conclusions can be audited.
- Raw author credentials, cookies, and unrelated response fields are not intentionally stored.
