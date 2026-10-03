# Feature Specification: Interactive User Tutorial

**Feature Branch**: `codex/interactive-user-tutorial`  
**Created**: 2026-10-03  
**Status**: Approved  
**Input**: User feedback: "A path alone is hard for users to act on. Build a tutorial that guides users step by step and tells them what to think about at each step."

## User Scenarios & Testing

### User Story 1 - Complete a Guided Business Tutorial (Priority: P1)

As a first-time user, I want an interactive tutorial that moves me step by step through Game Lab so that I can turn a business question into an evidence-based mechanism decision.

**Why this priority**: A static path explains the product but does not teach the user how to operate it or what to think about at each decision point.

**Independent Test**: Start the tutorial from `lab.html`, complete the first three steps, and confirm the tutorial advances only after the required action and reflection are completed.

**Acceptance Scenarios**:

1. **Given** the user opens Game Lab, **When** the tutorial is active, **Then** the system shows the current step, progress, required action, and reflection questions.
2. **Given** the user is on a step, **When** the step's required state is not yet met, **Then** the next action remains disabled and shows what must be completed.
3. **Given** the required state is met, **When** the user clicks `我已完成思考，下一步`, **Then** the tutorial advances to the next step.
4. **Given** the user wants to leave the tutorial, **When** the user clicks `跳过教程`, **Then** the tutorial can be closed and restarted later.

### User Story 2 - Capture the User's Thinking (Priority: P1)

As a product manager, I want each tutorial step to ask me the key business questions I should consider so that I do not just click through the workflow.

**Why this priority**: The product's value depends on human judgment, not automation.

**Independent Test**: Inspect each tutorial step; every step must include explicit reflection questions and a completion condition.

**Acceptance Scenarios**:

1. **Given** step 1 is displayed, **When** the user writes a business objective, **Then** the tutorial requires a meaningful objective before advancing.
2. **Given** any later step, **When** the user reads the tutorial, **Then** the step explains what to think about, not only what to click.
3. **Given** the final step, **When** the user chooses `继续验证 / 调整机制 / 暂缓方向`, **Then** the tutorial records the business decision.

### User Story 3 - Resume and Restart the Tutorial (Priority: P2)

As a returning user, I want my tutorial progress to persist so that I can continue where I left off.

**Why this priority**: The full workflow may take more than one session.

**Independent Test**: Advance the tutorial, reload the page, and confirm the active step remains.

**Acceptance Scenarios**:

1. **Given** the tutorial is active, **When** the page reloads, **Then** the active step and entered objective persist.
2. **Given** the tutorial is closed, **When** the user clicks `重新开始教程`, **Then** the tutorial restarts from step 1 without clearing experiment data.
3. **Given** the user resets local data, **When** the state returns to defaults, **Then** the tutorial starts fresh.

## Edge Cases

- Existing saved state without a tutorial object must initialize the tutorial safely.
- Invalid or missing tutorial state must fall back to step 1.
- The tutorial must not block normal navigation.
- The user must be able to skip the tutorial and continue using the product.
- The tutorial must not clear imported reviews, hypotheses, sessions, or experiment data.
- The last step must allow the user to record a decision without automatically changing project state.

## Functional Requirements

- **FR-001**: The system MUST provide an interactive tutorial panel.
- **FR-002**: The tutorial MUST display current step, total steps, and progress.
- **FR-003**: Every step MUST include a required action and reflection questions.
- **FR-004**: Step 1 MUST require a written business objective.
- **FR-005**: Later steps MUST detect whether the required product state is ready.
- **FR-006**: The user MUST be able to advance only after the required state is ready; the user may explicitly close the tutorial.
- **FR-007**: The tutorial MUST support previous step, next step, skip tutorial, and restart.
- **FR-008**: Tutorial progress and objective MUST persist in local state.
- **FR-009**: Export actions MUST mark the evidence-export step complete.
- **FR-010**: The final step MUST allow the user to record `继续验证`, `调整机制`, or `暂缓方向`.
- **FR-011**: The tutorial MUST NOT replace human judgment or auto-approve a project.

## Success Criteria

- **SC-001**: A first-time user can complete the tutorial without external documentation.
- **SC-002**: Every step includes action and reflection guidance.
- **SC-003**: Tutorial progress survives page reload.
- **SC-004**: Existing automated tests continue to pass.
- **SC-005**: Browser smoke validation confirms step progression, persistence, skip, and restart.
