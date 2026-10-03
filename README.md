# Game Lab

**Game Lab 是一个 AI 原生游戏立项实验室。**

它不是“一键生成完整游戏”，而是把游戏立项从几个人凭经验讨论，推进为一条可重复的机制验证流水线：

```text
玩家口碑
→ 动机与缺口识别
→ 机制假设
→ 最小可玩原型
→ 对照实验
→ 行为数据回流
→ 机制知识沉淀
```

## 当前主入口

- **Game Lab**：[`lab.html`](lab.html)
- **默认入口**：[`index.html`](index.html) 会自动跳转到 `lab.html`

本地运行：

```bash
npm run check
python3 -m http.server 8000
```

访问：

- <http://localhost:8000/>
- <http://localhost:8000/lab.html>

## 当前状态

- Game Lab Functional MVP：已可用
- 真实评论数据导入：已支持本地 Steam / TapTap JSON（中文与常见英文关键词）
- 模型能力：本地规则引擎
- 存储：浏览器 `localStorage`
- 测试：`npm test`
- 统计判断：Wilson 95% 置信区间、样本状态、区间重叠提示

## 核心流程

1. **输入洞察**
   - 按系统内「最小使用路径」逐步引导完成业务目标；
   - 导入本地 Steam / TapTap 评论 JSON，或使用演示数据、JSON / 按行评论样本；
   - 展示平台、样本量、时间范围、跳过记录等数据集证据；
   - 识别玩家动机、相对提及强度、未满足、缺口强度和跨竞品证据。

2. **机制假设**
   - 生成最多 3 个可验证机制假设；
   - 每个假设包含命题、机制组合、目标玩家、差异点、先例、风险、证据和置信度。

3. **实验设计**
   - 自动生成对照组与实验组；
   - 定义完成率、主动调整率、重开率和分享意愿阈值。

4. **机制原型**
   - 对照组：手动采集资源；
   - 实验组：捕捉生物、分配岗位、形成自动化生产；
   - 采集行为事件并写入 `localStorage`。

5. **结果回流**
   - 计算两组指标和行为漏斗；
   - 展示 Wilson 95% 置信区间、样本状态和区间重叠提示；
   - 支持实验 JSON 导出、事件 CSV 导出、JSON 导入和清空数据。

6. **机制知识库**
   - 沉淀机制、动机、效果、边界条件和下一步动作；
   - 当前知识由规则生成，未经统计显著性检验。

## 产品边界

- 数据保存在当前浏览器；
- 小样本结果不能直接用于正式立项决策；
- 当前支持本地 JSON 导入，没有真实评论抓取、后端服务、账号系统和大模型调用；
- 机制知识库当前用于流程演示和结构验证；
- 区间重叠只作为不确定性提示，不等于正式显著性检验。

## SDD 工程规范

本仓库已安装并初始化 GitHub Spec Kit：

- 项目原则：[.specify/memory/constitution.md](.specify/memory/constitution.md)
- 当前功能规格：[specs/003-guided-user-workflow/spec.md](specs/003-guided-user-workflow/spec.md)
- 实施计划：[specs/003-guided-user-workflow/plan.md](specs/003-guided-user-workflow/plan.md)
- 数据模型：沿用 [specs/002-real-review-import/data-model.md](specs/002-real-review-import/data-model.md)
- 快速验证：[specs/003-guided-user-workflow/quickstart.md](specs/003-guided-user-workflow/quickstart.md)
- 任务清单：[specs/003-guided-user-workflow/tasks.md](specs/003-guided-user-workflow/tasks.md)

Codex Spec-Kit 技能位于：

```text
.agents/skills/
```

## Legacy 原型

<details>
<summary>查看旧的 Game Analyzer 原型</summary>

### Game Analyzer

- 入口：[`legacy/analyzer.html`](legacy/analyzer.html)
- 定位：游戏竞品口碑分析交互原型
- 状态：Legacy，仅保留参考
- 数据：演示样例，不代表真实统计

Game Analyzer 的价值在于提供竞品口碑诊断、玩法拆解、竞品对比和设计建议展示。
它不再作为当前默认产品入口，后续优先级低于 Game Lab。

</details>

## 历史规格

<details>
<summary>查看历史规格与架构决策</summary>

- SDD 规格：
  - [docs/specs/0001-game-ideation-lab.md](docs/specs/0001-game-ideation-lab.md)
  - [docs/specs/0002-functional-mvp.md](docs/specs/0002-functional-mvp.md)
- 架构决策：
  - [docs/decisions/0001-separate-lab-prototype.md](docs/decisions/0001-separate-lab-prototype.md)
  - [docs/decisions/0002-local-first-browser-mvp.md](docs/decisions/0002-local-first-browser-mvp.md)
  - [docs/decisions/0003-prioritize-game-lab-entry.md](docs/decisions/0003-prioritize-game-lab-entry.md)

</details>
