# Game Analyzer / Game Lab

**当前仓库包含两个互补原型。**

1. `index.html`
   - **Game Analyzer**
   - 面向游戏产品经理、策划、运营与独立开发者。
   - 目标是把竞品口碑快速转成可解释的诊断、竞品基准与设计建议。

2. `lab.html`
   - **Game Lab**
   - AI 原生游戏立项实验室。
   - 目标不是“一键生成完整游戏”，而是把“口碑洞察 → 机制假设 → 可玩原型 → 实验验证 → 数据回流”做成一条可重复的工程化流水线。

> `lab.html` 当前是 **Local-first Functional MVP**：可在浏览器中完成口碑输入、机制假设、实验设计、可玩原型、事件采集、结果回流与知识沉淀。
> 当前仍是规则引擎演示，不是生产系统，也不声称具备真实数据抓取或生产级 AI 能力。

## 当前状态

- Game Analyzer：交互原型，已可用
- Game Lab Functional MVP：已可用
- 真实数据接入：未开始
- 模型能力：本地规则引擎
- 存储：浏览器 `localStorage`
- 测试：`npm test`

## 快速开始

```bash
npm test
npm run check
python3 -m http.server 8000
```

访问：

- Game Analyzer：<http://localhost:8000/index.html>
- Game Lab：<http://localhost:8000/lab.html>

也可以直接用浏览器打开 `index.html` 和 `lab.html`。

## Game Lab MVP 使用流程

1. **输入洞察**
   - 点击「载入演示数据」，或粘贴自有样本；
   - 支持 JSON 数组，也支持按行输入：`游戏|情绪|评论`；
   - 情绪支持 `positive` / `negative` / `neutral`，或 `正面` / `负面` / `中性`。

2. **机制假设**
   - 系统根据动机缺口生成最多 3 个机制假设；
   - 每个假设包含命题、机制组合、目标玩家、差异点、先例、风险和证据；
   - 选择一个假设进入实验。

3. **实验设计**
   - 自动生成对照组与实验组；
   - 指标包括完成率、主动调整率、重开率和分享意愿；
   - 当前每组目标样本为 12，实际可用于小规模流程验证。

4. **机制原型**
   - 对照组：手动采集资源；
   - 实验组：捕捉生物、分配岗位、形成自动化生产；
   - 每次操作都会记录为本地行为事件。

5. **结果回流**
   - 自动计算两组指标和实验组行为漏斗；
   - 输出「继续收集 / 正向信号 / 完成率受阻 / 信号偏弱」的判断；
   - 支持导出实验 JSON、导出事件 CSV、导入 JSON 和清空本地数据。

6. **机制知识库**
   - 根据实验结果沉淀机制、动机、效果、边界条件和下一步动作；
   - 当前知识由规则生成，未经统计显著性检验。

## 产品主线

Game Lab 的核心不是“生成一个游戏”，而是：

```text
真实口碑
→ 识别玩家动机与口碑缺口
→ 生成机制假设
→ 生成最小可玩原型
→ 设计对照实验
→ 采集行为数据
→ 判断机制是否成立
→ 产出下一版方向
→ 沉淀机制知识库
```

## 边界说明

- 实验数据保存在当前浏览器 `localStorage`；
- 本地小样本结果不能直接用于正式立项决策；
- 当前没有真实评论抓取、后端服务、账号系统和大模型调用；
- 机制知识库当前用于流程演示和结构验证。

## SDD 工程规范

本仓库已安装并初始化 GitHub Spec Kit：

- 项目原则：[.specify/memory/constitution.md](.specify/memory/constitution.md)
- 当前功能规格：[specs/001-game-lab-mvp/spec.md](specs/001-game-lab-mvp/spec.md)
- 实施计划：[specs/001-game-lab-mvp/plan.md](specs/001-game-lab-mvp/plan.md)
- 数据模型：[specs/001-game-lab-mvp/data-model.md](specs/001-game-lab-mvp/data-model.md)
- 快速验证：[specs/001-game-lab-mvp/quickstart.md](specs/001-game-lab-mvp/quickstart.md)
- 任务清单：[specs/001-game-lab-mvp/tasks.md](specs/001-game-lab-mvp/tasks.md)

Codex Spec-Kit 技能位于：

```text
.agents/skills/
```

## 历史规格文档

- SDD 规格：
  - [docs/specs/0001-game-ideation-lab.md](docs/specs/0001-game-ideation-lab.md)
  - [docs/specs/0002-functional-mvp.md](docs/specs/0002-functional-mvp.md)
- 架构决策：
  - [docs/decisions/0001-separate-lab-prototype.md](docs/decisions/0001-separate-lab-prototype.md)
  - [docs/decisions/0002-local-first-browser-mvp.md](docs/decisions/0002-local-first-browser-mvp.md)
