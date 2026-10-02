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

> `lab.html` 目前是规则引擎演示原型，不是生产系统。
> 它的目标是先验证产品主线和工作流，再逐步替换为真实数据与模型能力。

## 当前状态

- 交互原型：已可用
- 真实数据接入：未开始
- 模型能力：规则引擎演示
- 工程化：单页原型 + SDD 规范文档

## 快速开始

```bash
open index.html
open lab.html
```

或使用任意静态服务器：

```bash
python3 -m http.server 8000
```

然后访问：

- <http://localhost:8000/index.html>
- <http://localhost:8000/lab.html>

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

## 文档

- SDD 规格：
  - [docs/specs/0001-game-ideation-lab.md](docs/specs/0001-game-ideation-lab.md)
- 架构决策：
  - [docs/decisions/0001-separate-lab-prototype.md](docs/decisions/0001-separate-lab-prototype.md)
