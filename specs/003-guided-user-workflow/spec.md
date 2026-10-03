# Feature Specification: Guided User Workflow

**Feature Branch**: `codex/guided-user-workflow`
**Created**: 2026-10-03
**Status**: Approved
**Input**: User feedback: "Add step-by-step guidance inside the system and fix the analysis jump so users can inspect motivations before hypotheses."

## User Scenarios & Testing

### User Story 1 - Follow the Minimal Business Path (Priority: P1)

As a first-time product manager, I want an in-system guide for the minimal path so that I know how to use Game Lab to reach a business decision.

**Why this priority**: New users currently need external explanation to understand the workflow, which blocks adoption.

**Independent Test**: Open `lab.html`; the Input view must explain the six-step path and what business question each step answers.

**Acceptance Scenarios**:

1. **Given** a user opens Input Insights, **When** the view renders, **Then** the system shows a concise six-step usage guide.
2. **Given** the user reviews the guide, **When** they read each step, **Then** they can identify the action and the business question answered.
3. **Given** the user wants a quick trial, **When** no dataset exists, **Then** the guide offers the demo-data path.

### User Story 2 - Inspect Motivations Before Hypotheses (Priority: P1)

As a reviewer, I want to stay on the Input view after clicking `分析口碑` so that I can inspect motivation and gap evidence before moving to hypotheses.

**Why this priority**: Automatically jumping to Step 2 hides the evidence that justifies generated hypotheses.

**Independent Test**: Load demo data, click `分析口碑`, and confirm the page remains on Input Insights and scrolls to the motivation panel.

**Acceptance Scenarios**:

1. **Given** valid reviews are entered, **When** the user clicks `分析口碑`, **Then** the Input view remains active.
2. **Given** analysis succeeds, **When** motivation results render, **Then** the view scrolls to `动机与缺口`.
3. **Given** analysis succeeds, **When** the user is ready, **Then** an explicit `进入机制假设` action is available.
4. **Given** analysis fails, **When** the error appears, **Then** the page does not scroll to the result panel or navigate away.

### User Story 3 - Understand Each Metric and Stage (Priority: P2)

As a user, I want concise explanations of demand, unmet, gap, cross-game, sample, and result boundaries so that I do not misread exploratory signals as conclusions.

**Why this priority**: The current percentages are relative signals, and misinterpretation can damage decision quality.

**Independent Test**: Inspect the Input and Result views; both must explain metric interpretation and statistical boundaries.

**Acceptance Scenarios**:

1. **Given** motivation statistics are displayed, **When** the user opens the interpretation note, **Then** the system explains relative demand, unmet ratio, gap signal, and cross-game evidence.
2. **Given** the user reaches Results, **When** they read the guidance, **Then** the system states that small samples and overlapping intervals are not formal decisions.
3. **Given** any generated output, **When** the user follows the guide, **Then** it emphasizes human review before project decisions.

## Edge Cases

- Existing saved state should continue rendering without migration because no state schema change is required.
- Analysis failure must not change the active tab.
- The guide must remain compact and not replace the primary workflow.
- The guide must work on small screens.
- Demo/manual data must remain clearly labelled as non-real.
- Real imported data must retain its evidence card.

## Functional Requirements

- **FR-001**: The Input view MUST display an in-system minimal workflow guide.
- **FR-002**: The guide MUST cover input, motivation analysis, hypothesis selection, experiment review, prototype play, result review, and evidence export.
- **FR-003**: Clicking `分析口碑` MUST keep the Input view active after successful analysis.
- **FR-004**: Successful analysis MUST scroll the motivation panel into view.
- **FR-005**: Successful analysis MUST show a next-step action leading to the Hypothesis view.
- **FR-006**: The Input view MUST explain demand, unmet, gap, and cross-game signals.
- **FR-007**: The Result view MUST explain sample and interval boundaries.
- **FR-008**: Guidance MUST distinguish exploratory signals from formal conclusions.
- **FR-009**: Existing behavior and tests MUST continue to pass.

## Success Criteria

- **SC-001**: A first-time user can understand the complete path without external documentation.
- **SC-002**: After analysis, users can inspect motivation evidence before hypotheses.
- **SC-003**: Automated checks pass with 18 or more tests.
- **SC-004**: Browser smoke validation confirms the corrected navigation behavior.
- **SC-005**: No secrets or placeholder text are introduced.
