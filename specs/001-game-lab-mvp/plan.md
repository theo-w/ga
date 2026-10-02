# Implementation Plan: Game Lab Local-first Functional MVP

**Branch**: `codex/sdd-game-ideation-lab` | **Date**: 2026-10-03 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-game-lab-mvp/spec.md`

## Summary

Game Lab MVP 采用纯浏览器 Local-first 架构，把口碑输入、动机缺口分析、机制假设、实验设计、可玩原型、行为事件、结果回流和机制知识沉淀放进同一个静态页面。核心分析逻辑抽取到 `js/engine.js`，页面状态与渲染逻辑放在 `js/app.js`，样式独立为 `css/lab.css`。

该方案优先验证产品主线，而不是引入后端、账号或生产级 AI 服务。

## Technical Context

- **Runtime**: Browser
- **Language**: HTML / CSS / JavaScript ES5-compatible
- **State Store**: `localStorage`
- **Test Runner**: Node.js built-in test runner
- **Package Manager**: npm
- **External Runtime Dependencies**: None
- **Build Step**: None
- **Deployment**: Static file hosting

## Constitution Check

- **Evidence Before Conclusion**: 分析结果输出证据列表；实验结果输出行为事件。
- **AI Assists, Humans Decide**: 系统只生成假设与建议，不自动立项。
- **Validate Mechanisms, Not Generate Full Games**: 原型只验证机制切片。
- **Local-First Until Workflow Is Proven**: 不依赖后端和外部模型。
- **Small Samples Are Not Decisions**: 结果页显示样本边界。
- **Testable and Explainable Output**: 核心规则引擎有测试，页面有冒烟验证。
- **Minimal Scope**: 不做账号、云同步、真实抓取和商业游戏生成。

## Project Structure

### Documentation (this feature)

```text
specs/001-game-lab-mvp/
├── spec.md
├── plan.md
├── data-model.md
├── quickstart.md
└── tasks.md
```

### Source Code (repository root)

```text
lab.html
css/lab.css
js/
├── engine.js
└── app.js
tests/
└── engine.test.js
package.json
```

### Legacy Prototype / Default Entry

```text
index.html
legacy/analyzer.html
```

`index.html` 是默认入口，自动重定向到 `lab.html`。
原 Game Analyzer 交互原型保留在 `legacy/analyzer.html`，仅作为 Legacy 参考，不承载 Game Lab 实验流程。入口调整依据见 [ADR 0003](../../docs/decisions/0003-prioritize-game-lab-entry.md)。

## Design Decisions

### 1. Engine / UI Separation

`js/engine.js` 只包含纯逻辑：

- 输入解析；
- 动机统计；
- 假设生成；
- 实验生成；
- 结果聚合；
- 知识生成；
- CSV 导出。

`js/app.js` 负责：

- 状态读写；
- 页面渲染；
- 事件绑定；
- 原型计时器；
- 文件导入导出。

这样规则引擎可以直接用 Node.js 测试，不需要浏览器环境。

### 2. Local-first State

状态保存到 `localStorage`：

```text
game_lab_mvp_v1
```

状态包含：

- 输入文本；
- 解析后的评论；
- 动机统计；
- 机制假设；
- 当前实验；
- 游玩会话；
- 当前游戏状态。

刷新页面后恢复状态。若实验组仍在进行中，恢复自动化计时器。

### 3. Rule Engine as MVP AI Layer

当前“AI 原生”重点在于工作流，而不是调用大模型。
机制假设由规则模板和动机缺口计算生成，确保结果可解释、可测试、可控。

### 4. Playable Prototype as Mechanism Slice

对照组：

```text
手动采集 → 达成资源目标
```

实验组：

```text
捕捉生物 → 分配岗位 → 自动生产 → 达成交付目标
```

原型只验证一个机制假设：生物是否可以作为生产单元增强收集、自动化和策略表达。

### 5. Event-first Result

所有重要玩家动作记录为事件。
结果页从事件推导指标，而不是只显示静态数值。

## Implementation Phases

1. **输入与解析**
   - 支持演示数据、JSON、按行输入；
   - 校验格式和情绪标签。

2. **动机与缺口**
   - 关键词规则统计动机；
   - 计算需求强度和缺口强度；
   - 输出证据。

3. **机制假设与实验**
   - 根据最高缺口生成假设；
   - 生成对照组与实验组；
   - 定义指标和通过线。

4. **可玩原型**
   - 实现对照组手动采集；
   - 实现实验组捕捉、分配、自动化生产；
   - 记录行为事件。

5. **结果回流**
   - 聚合两组指标；
   - 输出行为漏斗；
   - 提供导入导出。

6. **机制知识**
   - 根据实验组结果生成机制知识；
   - 输出边界和下一步动作。

7. **统计判断增强**
   - 增加样本状态；
   - 增加 Wilson 95% 置信区间；
   - 增加区间重叠提示；
   - 防止小样本误读。

## Complexity Tracking

- **Low**: 输入解析、样式、页面导航。
- **Medium**: 动机统计、机制假设生成、结果聚合。
- **High**: 可玩原型状态机、事件采集、导入导出、统计判断。

## Validation Plan

```bash
npm run check
```

包含：

1. `js/engine.js` 语法检查；
2. `js/app.js` 语法检查；
3. `tests/engine.test.js` 单元测试。

浏览器验证：

1. 打开 `lab.html`；
2. 载入演示数据；
3. 分析口碑；
4. 选择机制假设；
5. 完成对照组；
6. 完成实验组；
7. 查看结果回流；
8. 导出 JSON；
9. 导出 CSV；
10. 导入 JSON；
11. 清空本地数据。
