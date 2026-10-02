# Tasks: Game Lab Local-first Functional MVP

**Input**: Design documents from `/specs/001-game-lab-mvp/`

**Prerequisites**: plan.md, spec.md, data-model.md, quickstart.md

**Tests**: Required for `js/engine.js`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel.
- **[Story]**: Which user story this task belongs to.

## Phase 1: Setup

**Purpose**: Establish the SDD and static project structure.

- [x] T001 Install and initialize GitHub Spec Kit for Codex in `.specify/` and `.agents/skills/`.
- [x] T002 Create feature directory `specs/001-game-lab-mvp/`.
- [x] T003 Create project constitution in `.specify/memory/constitution.md`.
- [x] T004 Create specification in `specs/001-game-lab-mvp/spec.md`.
- [x] T005 Create implementation plan in `specs/001-game-lab-mvp/plan.md`.
- [x] T006 Create data model in `specs/001-game-lab-mvp/data-model.md`.
- [x] T007 Create quickstart guide in `specs/001-game-lab-mvp/quickstart.md`.

**Checkpoint**: SDD documentation structure is ready.

---

## Phase 2: Foundational Engine

**Purpose**: Implement testable core logic independent from UI.

- [x] T008 [P] Create `js/engine.js` as a CommonJS/browser-compatible module.
- [x] T009 [P] Create `tests/engine.test.js`.
- [x] T010 Add line input parsing for `游戏|情绪|评论`.
- [x] T011 Add JSON array parsing.
- [x] T012 Normalize sentiment labels.
- [x] T013 Add motivation keyword rules.
- [x] T014 Calculate demand score, unmet ratio, and gap score.
- [x] T015 Attach evidence reviews to motivation stats.
- [x] T016 Generate up to three mechanism hypotheses.
- [x] T017 Generate control/treatment experiment design.
- [x] T018 Summarize sessions into group metrics.
- [x] T019 Convert events to CSV.
- [x] T020 Build mechanism knowledge from experiment summary.

**Checkpoint**: Core rules can be tested without a browser.

---

## Phase 3: User Story 1 - Input Insights (Priority: P1) 🎯 MVP

**Goal**: A PM can load or paste reviews and receive explainable motivation gaps and hypotheses.

**Independent Test**: Load demo data, analyze it, and verify evidence-backed output.

### Tests

- [x] T021 [P] [US1] Test line input parsing in `tests/engine.test.js`.
- [x] T022 [P] [US1] Test JSON input parsing in `tests/engine.test.js`.
- [x] T023 [P] [US1] Test invalid line input rejection in `tests/engine.test.js`.
- [x] T024 [P] [US1] Test motivation analysis and evidence in `tests/engine.test.js`.
- [x] T025 [P] [US1] Test hypothesis and experiment generation in `tests/engine.test.js`.

### Implementation

- [x] T026 [US1] Create input view in `js/app.js`.
- [x] T027 [US1] Add demo data loader in `js/app.js`.
- [x] T028 [US1] Add analysis trigger and error display in `js/app.js`.
- [x] T029 [US1] Render motivation bars and evidence list in `js/app.js`.
- [x] T030 [US1] Render hypothesis cards in `js/app.js`.

**Checkpoint**: A user can move from reviews to evidence-backed hypotheses.

---

## Phase 4: User Story 2 - Experiment Design (Priority: P2)

**Goal**: A planner can select a hypothesis and see the experiment contract.

**Independent Test**: Select a hypothesis and inspect control/treatment groups and metrics.

### Implementation

- [x] T031 [US2] Add hypothesis selection state in `js/app.js`.
- [x] T032 [US2] Render experiment design view in `js/app.js`.
- [x] T033 [US2] Show metrics, thresholds, target sample, and duration in `js/app.js`.

**Checkpoint**: A mechanism idea is translated into a testable experiment.

---

## Phase 5: User Story 3 - Playable Prototype (Priority: P3)

**Goal**: A player can complete both group flows and generate behavior events.

**Independent Test**: Complete or abandon both groups and inspect the event log.

### Implementation

- [x] T034 [US3] Create prototype view in `js/app.js`.
- [x] T035 [US3] Implement control-group manual gathering loop in `js/app.js`.
- [x] T036 [US3] Implement treatment-group capture and station assignment in `js/app.js`.
- [x] T037 [US3] Implement treatment-group automatic production timer in `js/app.js`.
- [x] T038 [US3] Persist active session and game state to `localStorage`.
- [x] T039 [US3] Restore active treatment timer after page refresh or JSON import.
- [x] T040 [US3] Log required behavior events in `js/app.js`.
- [x] T041 [US3] Add restart, share intent, and abandon actions in `js/app.js`.

**Checkpoint**: Play sessions generate analyzable event streams.

---

## Phase 6: User Story 4 - Results and Data Management (Priority: P4)

**Goal**: A PM can review metrics and export/import experiment data.

**Independent Test**: Create sessions, open result view, export JSON/CSV, and re-import JSON.

### Tests

- [x] T042 [P] [US4] Test session summary and small-sample warning in `tests/engine.test.js`.
- [x] T043 [P] [US4] Test event CSV export in `tests/engine.test.js`.

### Implementation

- [x] T044 [US4] Render treatment behavior funnel in `js/app.js`.
- [x] T045 [US4] Render group metric comparison table in `js/app.js`.
- [x] T046 [US4] Add JSON export in `js/app.js`.
- [x] T047 [US4] Add CSV export in `js/app.js`.
- [x] T048 [US4] Add JSON import in `js/app.js`.
- [x] T049 [US4] Add local data reset in `js/app.js`.

**Checkpoint**: Results and raw events can leave the browser for review.

---

## Phase 7: User Story 5 - Mechanism Knowledge (Priority: P5)

**Goal**: A planner can see what was learned and what should happen next.

**Independent Test**: Generate knowledge after a session and inspect boundary language.

### Tests

- [x] T050 [P] [US5] Test mechanism knowledge generation only after sessions exist.

### Implementation

- [x] T051 [US5] Render mechanism knowledge view in `js/app.js`.
- [x] T052 [US5] Show mechanism, motivation, effect, boundary, and next action.

**Checkpoint**: One experiment can become reusable mechanism knowledge.

---

## Phase 8: Statistical Judgment Enhancement

**Purpose**: Prevent small-sample results from being overinterpreted.

- [x] T053 Add Wilson 95% confidence interval calculation in `js/engine.js`.
- [x] T054 Add sample status labels in `js/engine.js`.
- [x] T055 Add control/treatment interval overlap detection in `js/engine.js`.
- [x] T056 Render confidence intervals and sample status in `js/app.js`.
- [x] T057 Render interval-overlap warnings in `js/app.js`.
- [x] T058 Add tests for Wilson interval boundaries in `tests/engine.test.js`.
- [x] T059 Add tests for sample status and overlap detection in `tests/engine.test.js`.
- [x] T060 Update result view and README boundary language.

**Checkpoint**: Results are informative but do not claim unsupported certainty.

---

## Phase 9: Polish & Cross-Cutting Concerns

- [x] T061 [P] Add `npm test`.
- [x] T062 [P] Add `npm run check`.
- [x] T063 [P] Add responsive layout in `css/lab.css`.
- [x] T064 Add dark visual system in `css/lab.css`.
- [x] T065 Add empty states for all secondary views.
- [x] T066 Add browser smoke validation.
- [x] T067 Add security scan for token-like strings.
- [ ] T068 Add automated browser tests.
- [ ] T069 Add accessibility audit.
- [ ] T070 Add localization review.

---

## Dependencies & Execution Order

### Phase Dependencies

1. Setup must complete before implementation tasks.
2. Foundational engine blocks all user-story implementation.
3. User stories can be implemented in priority order after the engine exists.
4. Statistical enhancement depends on result summarization.
5. Polish tasks depend on the main workflow being functional.

### Within Each User Story

- Tests are written before implementation.
- Pure engine logic is tested in `tests/engine.test.js`.
- UI behavior is validated by browser smoke tests.
- Each story remains independently demonstrable.

## Implementation Strategy

1. Complete setup and SDD documents.
2. Implement the pure rule engine.
3. Deliver input-to-hypothesis flow.
4. Deliver experiment design.
5. Deliver playable prototype.
6. Deliver result and data management.
7. Deliver mechanism knowledge.
8. Finish statistical judgment enhancement.
9. Run convergence and update tasks.

## Notes

- `index.html` now redirects to `lab.html`; the original Game Analyzer prototype is preserved at `legacy/analyzer.html` as a Legacy reference per ADR 0003.
- Current statistical enhancement is partially implemented in the working tree and must be completed before marking Phase 8 complete.
