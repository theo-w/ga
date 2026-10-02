# Feature Specification: Game Lab Local-first Functional MVP

**Feature Branch**: `codex/sdd-game-ideation-lab`

**Created**: 2026-10-03

**Status**: Implemented baseline; statistical judgment enhancement in progress

**Input**: User description: "基于之前的构想，做一个可跑通的 Game Lab MVP：从口碑洞察、机制假设、可玩原型、实验设计、行为事件、结果回流到机制知识沉淀。"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 输入口碑并生成机制假设 (Priority: P1)

作为游戏产品经理，我希望粘贴或载入竞品评论样本，并看到可解释的动机缺口与机制假设，以便判断哪个玩法方向值得进入实验。

**Why this priority**: 没有可信的口碑洞察，后续原型和实验都会失去依据。该故事是 MVP 的入口价值。

**Independent Test**: 载入演示数据，点击“分析口碑”，检查是否输出动机强度、缺口排序、证据列表和机制假设。

**Acceptance Scenarios**:

1. **Given** 用户打开 `lab.html`，**When** 点击“载入演示数据”并点击“分析口碑”，**Then** 系统显示动机缺口、证据和至少一个机制假设。
2. **Given** 用户粘贴 JSON 数组，**When** 点击“分析口碑”，**Then** 系统解析评论并生成对应分析。
3. **Given** 用户粘贴格式错误的按行输入，**When** 点击“分析口碑”，**Then** 系统显示格式错误提示且不生成结论。

---

### User Story 2 - 选择机制假设并查看实验设计 (Priority: P2)

作为策划，我希望选择一个机制假设，并看到对照组、实验组、指标和通过线，以便知道实验要验证什么。

**Why this priority**: 实验设计把“想法”转成“可验证命题”，是机制验证的核心。

**Independent Test**: 在机制假设页选择任一假设，检查实验页是否生成对照组、实验组和指标。

**Acceptance Scenarios**:

1. **Given** 已生成机制假设，**When** 用户选择一个假设，**Then** 系统生成对照组和实验组说明。
2. **Given** 实验已生成，**When** 用户进入实验设计页，**Then** 系统显示完成率、主动调整率、重开率、分享意愿及其通过线。

---

### User Story 3 - 游玩最小机制原型并采集行为事件 (Priority: P3)

作为测试玩家，我希望在浏览器内完成对照组或实验组流程，并让系统记录我的行为，以便产生可分析数据。

**Why this priority**: 没有可玩原型和行为事件，机制假设无法进入实验验证。

**Independent Test**: 分别启动对照组和实验组，完成或放弃流程，检查事件流是否记录 `start`、`tutorial_complete`、`assign`、`complete` 等事件。

**Acceptance Scenarios**:

1. **Given** 用户进入机制原型页，**When** 点击“开始对照组”，**Then** 系统创建本地会话并记录 `start`。
2. **Given** 实验组已启动，**When** 用户捕捉生物并分配岗位，**Then** 系统记录 `capture` 和 `assign`。
3. **Given** 玩家达到目标，**When** 资源或交付达到 30，**Then** 系统记录 `complete` 并结束会话。

---

### User Story 4 - 查看实验结果并管理数据 (Priority: P4)

作为产品经理，我希望查看两组指标、行为漏斗和样本边界，并导出或导入实验数据，以便继续分析或团队协作。

**Why this priority**: 结果回流让实验从“可玩 Demo”变成“可复盘数据”。

**Independent Test**: 完成至少一次会话后进入结果回流页，检查指标表、行为漏斗、导出 JSON、导出 CSV 和导入 JSON 功能。

**Acceptance Scenarios**:

1. **Given** 存在本地会话，**When** 用户进入结果回流页，**Then** 系统显示两组指标和行为漏斗。
2. **Given** 用户点击导出实验 JSON，**When** 下载完成，**Then** 文件包含输入、假设、实验和会话事件。
3. **Given** 用户导入有效 JSON，**When** 导入完成，**Then** 系统恢复实验状态并显示结果。

---

### User Story 5 - 沉淀机制知识 (Priority: P5)

作为策划，我希望看到机制、动机、效果、边界和下一步动作，以便决定是否进入下一轮验证。

**Why this priority**: 机制知识库让一次实验沉淀为可复用经验。

**Independent Test**: 有会话数据后进入机制知识库页，检查是否输出机制、动机、效果、边界和下一步。

**Acceptance Scenarios**:

1. **Given** 存在实验组会话，**When** 用户进入机制知识库页，**Then** 系统显示机制知识卡。
2. **Given** 样本量低于目标，**When** 用户查看机制知识，**Then** 系统明确提示不可用于立项判断。

### Edge Cases

- 输入为空或只有空白时，不生成任何分析结论；
- JSON 不是数组或缺少 `text` 字段时，显示可理解错误；
- 按行输入缺少 `游戏|情绪|评论` 三段时，显示行号和格式要求；
- `localStorage` 不可用时，页面仍可运行，但状态无法持久化；
- 刷新页面时，实验组未结束会话应恢复自动化计时器；
- 无会话时，结果页和机制知识库显示空态；
- 小样本时，结果页必须显示样本不足，而不是输出确定性结论；
- 对照组缺失时，不允许得出组间强弱结论。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST 支持载入内置演示评论数据。
- **FR-002**: System MUST 支持粘贴 JSON 数组输入。
- **FR-003**: System MUST 支持按行输入 `游戏|情绪|评论`。
- **FR-004**: System MUST 在输入格式错误时显示明确错误信息。
- **FR-005**: System MUST 基于本地规则引擎识别玩家动机。
- **FR-006**: System MUST 输出动机需求强度、未满足比例和跨竞品出现次数。
- **FR-007**: System MUST 为每个动机输出可追溯证据。
- **FR-008**: System MUST 根据动机缺口生成最多 3 个机制假设。
- **FR-009**: 每个机制假设 MUST 包含命题、机制组合、目标玩家、差异点、先例、风险、证据和置信度。
- **FR-010**: System MUST 根据被选机制假设生成对照组和实验组。
- **FR-011**: 实验设计 MUST 包含完成率、主动调整率、重开率、分享意愿和通过线。
- **FR-012**: System MUST 提供浏览器内可玩对照组流程。
- **FR-013**: System MUST 提供浏览器内可玩实验组流程。
- **FR-014**: System MUST 记录 `start`、`tutorial_complete`、`capture`、`assign`、`cycle`、`complete`、`restart`、`share_intent`、`abandon` 等事件。
- **FR-015**: 行为事件 MUST 写入浏览器 `localStorage`。
- **FR-016**: System MUST 按对照组和实验组计算指标。
- **FR-017**: System MUST 输出实验组行为漏斗。
- **FR-018**: System MUST 支持导出完整实验 JSON。
- **FR-019**: System MUST 支持导出事件 CSV。
- **FR-020**: System MUST 支持导入实验 JSON 并恢复状态。
- **FR-021**: System MUST 支持清空本地实验数据。
- **FR-022**: System MUST 根据实验结果生成机制知识。
- **FR-023**: 所有实验结论 MUST 显示样本量和验证边界。
- **FR-024**: 小样本结果 MUST 明确提示不可直接用于立项决策。

### Key Entities *(include if feature involves data)*

- **ReviewInput**: 一条评论样本，包含游戏名、情绪和评论正文。
- **MotivationStat**: 一个玩家动机的统计结果，包含提及数、满足数、未满足数、跨竞品数、需求强度、缺口强度和证据。
- **Hypothesis**: 一个机制假设，包含命题、机制组合、目标玩家、差异点、先例、风险、证据和置信度。
- **Experiment**: 一个实验设计，包含对照组、实验组、指标和目标样本。
- **PlaySession**: 一次原型游玩会话，包含组别、开始时间、结束时间和事件列表。
- **SessionEvent**: 一次行为事件，包含事件类型、发生时间和详情。
- **ExperimentSummary**: 实验结果聚合，包含两组指标、行为漏斗、样本状态和判断。
- **MechanismKnowledge**: 机制知识，包含机制、动机、效果、边界和下一步动作。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 用户能在 10 分钟内理解 Game Lab 的完整流程。
- **SC-002**: 载入演示数据后，系统能在 1 秒内生成动机与缺口分析。
- **SC-003**: 至少生成 1 个带证据链的机制假设。
- **SC-004**: 对照组和实验组均可完成一次可玩流程。
- **SC-005**: 每次游玩都产生可查看的行为事件。
- **SC-006**: 结果页能计算完成率、主动调整率、重开率和分享率。
- **SC-007**: 支持实验 JSON 导出、事件 CSV 导出和 JSON 导入。
- **SC-008**: 所有小样本结果均显示不可直接立项的边界提示。
- **SC-009**: `npm run check` 全部通过。
- **SC-010**: 浏览器冒烟测试通过。

## Assumptions

- 当前用户主要使用桌面浏览器；
- MVP 阶段允许使用演示数据验证产品流程；
- 规则引擎可以代表“AI 建议”的产品形态，但不能声称生产级 AI 能力；
- 实验样本量目标为每组 12 人；
- 小于 12 个会话的结果只用于流程演示；
- 当前不需要真实评论抓取和云端存储；
- 当前不需要多人协作和账号系统。
