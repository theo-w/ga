# Task List: Real Review Import

**Feature**: [spec.md](./spec.md)
**Created**: 2026-10-03
**Implementation Plan**: [plan.md](./plan.md)

---

## Phase 1: Setup

- [x] T001 Create the SDD feature directory in `specs/002-real-review-import/`.
- [x] T002 Define import scope and acceptance criteria in `specs/002-real-review-import/spec.md`.
- [x] T003 Define normalized and source data shapes in `specs/002-real-review-import/data-model.md`.

## Phase 2: Foundational Engine

- [x] T004 Add tests for normalized Game Lab dataset import in `tests/engine.test.js`.
- [x] T005 Add tests for Steam-compatible review import in `tests/engine.test.js`.
- [x] T006 Add tests for TapTap-compatible review import in `tests/engine.test.js`.
- [x] T007 Add tests for invalid, unsupported, empty, and skipped-record cases in `tests/engine.test.js`.
- [x] T008 Implement `importReviewDataset` and metadata normalization in `js/engine.js`.
- [x] T009 Export `importReviewDataset` from `js/engine.js`.

## Phase 3: User Story 1 - Import a Real Review Dataset

- [x] T010 [US1] Add `dataset` to browser state with backward-compatible loading in `js/app.js`.
- [x] T011 [US1] Add a local JSON file input and `导入真实评论 JSON` action to `js/app.js`.
- [x] T012 [US1] Replace review-derived state on successful import and reset stale active gameplay in `js/app.js`.
- [x] T013 [US1] Populate `inputText` with canonical review JSON in `js/app.js`.
- [x] T014 [US1] Keep current state unchanged when import validation fails in `js/app.js`.

## Phase 4: User Story 2 - Verify Dataset Boundaries

- [x] T015 [US2] Render a `数据集证据` card with platform, game, sample, timestamps, range, skipped count, and file name in `js/app.js`.
- [x] T016 [US2] Display `未知` for missing metadata in `js/app.js`.
- [x] T017 [US2] Label demo/manual input as non-real data in `js/app.js`.
- [x] T018 [US2] Add dataset card styling in `css/lab.css`.

## Phase 5: User Story 3 - Preserve the Evidence Trail

- [x] T019 [US3] Include dataset metadata in exported experiment JSON through existing state export in `js/app.js`.
- [x] T020 [US3] Preserve stable source IDs in normalized review evidence through `js/engine.js`.
- [x] T021 [US3] Update real-review workflow and boundaries in `README.md`.
- [x] T022 [US3] Update browser validation steps in `specs/002-real-review-import/quickstart.md`.

## Phase 6: Polish & Verification

- [x] T023 Run `npm run check`.
- [x] T024 Run JavaScript syntax checks for `js/engine.js` and `js/app.js`.
- [x] T025 Run browser smoke checks for import, metadata, analysis, and state-backed export payload.
- [x] T026 Run placeholder and secret scans.
- [x] T027 [US1] Add English motivation keyword coverage for imported Steam reviews in `js/engine.js` and `tests/engine.test.js`.
- [x] T028 Update task completion and commit the feature.

---

## Dependencies & Execution Order

1. Engine tests must exist before implementation.
2. Engine import must pass before UI wiring.
3. UI import must work before metadata rendering.
4. Metadata must persist before export integration is verified.
5. Documentation updates follow implementation.
6. Final verification gates the commit.

## MVP Scope

Complete Phases 1-4 for one local dataset import and visible evidence boundary. Phase 5 strengthens auditability and should be included before merge.
