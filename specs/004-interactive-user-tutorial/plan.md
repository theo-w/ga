# Implementation Plan: Interactive User Tutorial

**Branch**: `codex/interactive-user-tutorial` | **Date**: 2026-10-03 | **Spec**: [spec.md](./spec.md)

## Summary

Replace the static path explanation with a persistent, interactive tutorial panel. The panel tracks progress in local state, asks the user to write a business objective, explains what to think about at every step, detects when the required product state is ready, and records the final business decision.

## Technical Context

- **Runtime**: Browser
- **Language**: JavaScript ES5-compatible
- **State Store**: Existing `localStorage` state
- **Test Runner**: Node.js built-in test runner
- **External Dependencies**: None

## Design Decisions

1. Add `tutorial` to the existing state object without changing the state version.
2. Render a persistent tutorial panel above the workflow views.
3. Keep normal navigation unrestricted.
4. Use step-specific readiness checks instead of blindly advancing.
5. Require explicit user confirmation after completing each step.
6. Persist tutorial state, objective, export completion, and final decision.
7. Keep the tutorial local-first and add no backend dependency.

## Tutorial Steps

1. **明确业务问题**  
   Action: write the mechanism, target user, and unmet motivation.  
   Think: why this mechanism matters and what evidence would change the decision.

2. **准备可比样本**  
   Action: import real review JSON or load demo data.  
   Think: product comparability, platform bias, time window, and sample bias.

3. **分析动机与缺口**  
   Action: click `分析口碑`.  
   Think: which motivations are frequent, unmet, and cross-game.

4. **选择机制假设**  
   Action: select one hypothesis.  
   Think: evidence chain, differentiation, and whether the mechanism can be sliced into a prototype.

5. **评审实验设计**  
   Action: inspect the experiment.  
   Think: whether control and treatment differ by one key mechanism and whether metrics match the question.

6. **体验对照原型**  
   Action: play both control and treatment.  
   Think: engagement, choices, boredom, and whether the mechanism changes the experience.

7. **回看结果边界**  
   Action: inspect sample status and confidence intervals.  
   Think: whether the result is exploratory, ready, or inconclusive.

8. **导出证据包**  
   Action: export experiment JSON or event CSV.  
   Think: what evidence supports continuing, adjusting, or stopping.

9. **记录业务决策**  
   Action: choose `继续验证`, `调整机制`, or `暂缓方向`.  
   Think: next action, missing evidence, and the smallest next experiment.

## Testing Strategy

- Existing automated tests must pass.
- Browser smoke validation must cover:
  - tutorial render
  - objective requirement
  - demo data and analysis
  - step advancement
  - persistence after reload
  - skip and restart
  - export step completion
  - final decision recording
