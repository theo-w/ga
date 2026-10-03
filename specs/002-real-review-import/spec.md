# Feature Specification: Real Review Import

**Feature Branch**: `codex/real-review-import`
**Created**: 2026-10-03
**Status**: Approved
**Input**: User description: "Import real Steam and TapTap review JSON files into Game Lab with verifiable dataset metadata"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Import a Real Review Dataset (Priority: P1)

As a product manager, I want to import a real Steam or TapTap review JSON file so that Game Lab starts from real player evidence instead of hand-written demo comments.

**Why this priority**: Real evidence is the prerequisite for credible motivation and gap analysis. Without this story, Game Lab remains a demo workflow.

**Independent Test**: Import one supported JSON file in `lab.html`; the review count increases and motivation analysis runs from the converted reviews.

**Acceptance Scenarios**:

1. **Given** Game Lab is open, **When** the user selects a supported Steam review JSON file, **Then** the system converts `reviews[].review` and `voted_up` into Game Lab reviews and keeps dataset metadata.
2. **Given** Game Lab is open, **When** the user selects a supported TapTap review JSON file, **Then** the system converts review text and rating/score into sentiment and keeps dataset metadata.
3. **Given** a supported dataset is imported, **When** the user clicks `分析口碑`, **Then** motivation stats, hypotheses, and experiment design are generated from the imported reviews.
4. **Given** the file is invalid or contains no usable reviews, **When** the user imports it, **Then** Game Lab shows a specific error and does not replace the current working dataset.

### User Story 2 - Verify Dataset Boundaries (Priority: P2)

As a reviewer, I want to see platform, game, sample size, retrieval time, and review time range so that I can judge whether an insight is credible.

**Why this priority**: Constitution requires evidence before conclusion. Metadata is the boundary that makes the evidence auditable.

**Independent Test**: Import a dataset and inspect the `数据集证据` card in the Input view.

**Acceptance Scenarios**:

1. **Given** a real dataset is imported, **When** the user opens Input Insights, **Then** Game Lab shows platform, source file, imported time, sample count, and review time range.
2. **Given** metadata is missing, **When** the dataset is imported, **Then** Game Lab marks those fields as `未知` and still displays the sample boundary.
3. **Given** a demo or manually pasted sample is used, **When** the Input view is rendered, **Then** Game Lab identifies it as a non-real sample instead of claiming real-data status.

### User Story 3 - Preserve the Evidence Trail (Priority: P3)

As a reviewer, I want imported evidence to remain traceable after analysis and export so that a hypothesis can be audited later.

**Why this priority**: The analysis is only useful if later decisions can trace each motivation back to the original review.

**Independent Test** Import a dataset, analyze it, export experiment JSON, and confirm that dataset metadata and normalized reviews are included.

**Acceptance Scenarios**:

1. **Given** a real dataset is imported and analyzed, **When** the user exports experiment JSON, **Then** the export includes dataset metadata and normalized reviews.
2. **Given** a real dataset is imported, **When** motivation evidence is displayed, **Then** each evidence item has a stable source ID.
3. **Given** a new dataset is imported, **When** the user confirms replacement, **Then** prior review-derived hypotheses and experiment design are reset to avoid mixing datasets.

### Edge Cases

- The selected file is not valid JSON: show a JSON parsing error and preserve current state.
- The JSON is valid but the platform cannot be recognized: show an unsupported-format error.
- The platform is recognized but the review list is empty: show a no-usable-reviews error.
- A review has missing or empty text: skip it and report skipped count.
- A review has a missing timestamp: exclude it from the time range but still import the review.
- A dataset is very large: import remains local and no automatic network requests are made.
- The user imports a new dataset after analysis: replace the active review dataset and derived hypothesis state rather than silently mixing sources.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Input view MUST provide a file import control for real review JSON.
- **FR-002**: The engine MUST support a normalized Game Lab dataset format with `source`, `game`, `retrievedAt`, and `reviews`.
- **FR-003**: The engine MUST adapt a Steam-compatible object containing a `reviews` array, using `review` as text and `voted_up` as positive/negative sentiment.
- **FR-004**: The engine MUST adapt a TapTap-compatible object containing a review list, using the available text field and rating/score as sentiment.
- **FR-005**: The engine MUST reject an unrecognized or empty dataset with an actionable error.
- **FR-006**: Imported review IDs MUST be preserved when present and otherwise generated deterministically.
- **FR-007**: Dataset metadata MUST include source file, platform, game, sample count, imported time, review time range, and skipped review count.
- **FR-008**: Missing metadata MUST be represented as `未知`, not invented.
- **FR-009**: The import MUST NOT call an external service or transmit the file.
- **FR-010**: Importing a new real dataset MUST replace prior review-derived analysis state.
- **FR-011**: The input textarea MUST be populated with canonical JSON reviews so the existing analysis path remains reproducible.
- **FR-012**: Exported experiment JSON MUST include the active dataset metadata.
- **FR-013**: Demo/manual input MUST NOT be labelled as a real dataset.

### Key Entities *(include if feature involves data)*

- **RealReviewDataset**: Source metadata plus normalized reviews imported from one local JSON file.
- **DatasetMetadata**: Platform, file name, game, imported time, retrieval time, sample count, skipped count, and review time range.
- **NormalizedReview**: Existing Game Lab review shape with stable `id`, `game`, `sentiment`, and `text`, extended with optional `createdAt`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least one Steam-format and one TapTap-format fixture pass automated engine tests.
- **SC-002**: Invalid JSON, unsupported JSON, and empty review arrays each return specific errors.
- **SC-003**: The Input view visibly distinguishes real datasets from demo/manual samples.
- **SC-004**: Motivation analysis after import still passes all existing tests.
- **SC-005**: The browser workflow can import, analyze, display metadata, and export JSON without a backend.
- **SC-006**: No credential or raw unrelated payload is written to the repository.

## Assumptions

- The first version imports local JSON files; it does not scrape Steam or TapTap.
- Raw platform responses are adapted conservatively and unsupported fields are ignored.
- TapTap rating fields may vary by export method; supported forms are `score`, `rating`, and nested score fields.
- One active dataset is sufficient for MVP; multiple dataset comparison is deferred.
- Review text remains local in `localStorage` and exported JSON.
