# Implementation Plan: Guided User Workflow

**Branch**: `codex/guided-user-workflow` | **Date**: 2026-10-03 | **Spec**: [spec.md](./spec.md)

## Summary

Improve user adoption and decision quality by embedding the minimal business path into Game Lab, correcting the post-analysis navigation, and adding concise metric and result interpretations. The implementation remains local-first and requires no backend or state migration.

## Technical Context

- **Runtime**: Browser
- **Language**: JavaScript ES5-compatible
- **State Store**: Existing `localStorage` state
- **Test Runner**: Node.js built-in test runner
- **External Dependencies**: None

## Design Decisions

1. Add a compact guide card to the Input view.
2. Keep the user on Input Insights after successful analysis.
3. Scroll to `动机与缺口` only after success.
4. Add an explicit `进入机制假设` button.
5. Add a metric interpretation panel under motivation results.
6. Add result-boundary guidance to the Result view.
7. Reuse existing CSS patterns with a new guide card style.

## Testing Strategy

- Existing automated tests must pass.
- Browser smoke test must verify:
  - guide renders;
  - analysis stays on Input;
  - motivation panel scrolls into view;
  - next-step action navigates to Hypotheses;
  - result guidance is present.

## Implementation Tasks

See [tasks.md](./tasks.md).
