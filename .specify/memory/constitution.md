# Game Lab Constitution

## Core Principles

### I. Evidence Before Conclusion

Every product conclusion MUST be traceable to evidence.
口碑洞察必须能回溯到评论样本；机制判断必须能回溯到行为事件；竞品结论必须说明样本窗口、来源和边界。

不允许出现无证据链的“AI 洞察”或“市场结论”。

### II. AI Assists, Humans Decide

Game Lab 是立项实验工作台，不是自动立项系统。
AI 可以生成机制假设、原型方案和实验建议，但进入制作、放弃方向或调整投资，必须由产品经理、策划或评审者决定。

### III. Validate Mechanisms, Not Generate Full Games

产品目标是验证机制假设，不是一键生成完整商业游戏。
所有生成物都必须服务于一个明确、可测试的机制命题。

### IV. Local-First Until Workflow Is Proven

在产品主线被验证前，系统保持 Local-first：

- 静态页面；
- 浏览器本地运行；
- `localStorage` 保存实验状态；
- 不引入后端、账号、数据库和外部模型依赖。

### V. Small Samples Are Not Decisions

实验结果必须展示样本量、比例和不确定性边界。
小于目标样本的结果只能用于流程验证，不得直接作为立项结论。

### VI. Testable and Explainable Output

每个功能都必须有可验证的验收标准。
每个重要输出都必须解释生成路径：输入是什么、规则是什么、证据是什么、边界是什么。

### VII. Minimal Scope

优先做最小闭环，避免过早引入复杂能力。
在以下能力被证明前，不进入对应阶段：

- 真实评论抓取；
- 云端多用户实验；
- 大模型生成；
- 自动试玩验证；
- 商业化支付。

## Product Boundary

### Legacy: Game Analyzer

定位：Legacy 竞品口碑分析原型。
核心任务：保留历史参考价值，帮助理解竞品口碑诊断、玩法拆解、竞品对比和设计建议展示。
状态：不作为当前默认入口，后续优先级低于 Game Lab。

### Game Lab

定位：AI 原生游戏立项实验室。
核心任务：把口碑洞察转成机制假设、最小可玩原型、实验结果和机制知识。

Game Lab 不承诺：

- 生成完整商业游戏；
- 预测爆款；
- 替代策划创意；
- 生产级 AI 分析能力。

## Quality Gates

每个变更必须满足：

1. `npm run check` 通过；
2. `npm test` 通过；
3. HTML 结构检查通过；
4. 浏览器冒烟测试通过；
5. Markdown 文档无占位符残留；
6. 不提交任何 token、密钥或私有凭证；
7. 涉及结论展示时，必须包含样本和边界说明。

## Development Workflow

1. **Constitution**
   - 项目原则和不可协商约束。
2. **Spec**
   - 定义用户故事、验收场景、功能需求、成功标准。
3. **Plan**
   - 定义技术结构、实现路径和设计决策。
4. **Tasks**
   - 按依赖顺序拆分可执行任务。
5. **Implement**
   - 按任务实现并保持测试通过。
6. **Converge**
   - 对照 spec、plan、tasks 检查缺口并补充任务。

## Governance

- 本 Constitution 优先于临时实现偏好；
- 修改 Constitution 必须通过新的 ADR 记录原因；
- 与 Constitution 冲突的 PR 必须说明例外理由和迁移计划；
- 产品边界变化必须先更新文档，再实现代码。

**Version**: 1.0.0 | **Ratified**: 2026-10-03 | **Last Amended**: 2026-10-03
