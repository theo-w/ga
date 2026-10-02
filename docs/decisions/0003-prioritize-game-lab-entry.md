# ADR 0003：将 Game Lab 设为默认产品入口

- **状态**：Accepted
- **日期**：2026-10-03

## 背景

仓库最初以 `index.html` 承载 Game Analyzer 交互原型。
随着 Game Lab Functional MVP 完成，产品主线已经从“竞品口碑分析”推进为：

```text
口碑洞察
→ 机制假设
→ 可玩原型
→ 实验验证
→ 数据回流
→ 机制知识沉淀
```

如果继续把 Game Analyzer 放在根入口，会让新用户误解当前产品重心，也会弱化 AI 原生立项实验室这条主线。

## 决策

1. `lab.html` 保持为当前主产品入口。
2. 根路径 `index.html` 重定向到 `lab.html`。
3. 原 Game Analyzer 页面移动到 `legacy/analyzer.html`。
4. README 将 Game Lab 放在首要位置，Game Analyzer 收入 Legacy 区块。
5. Game Lab 页脚保留弱化的 Legacy 入口，不进入主导航。
6. Constitution 同步以 Game Lab 为当前产品主体，并将 Game Analyzer 标记为 Legacy。

## 影响

### 正面影响

- 默认入口与当前产品方向一致；
- 降低新用户认知成本；
- 保留 Game Analyzer 供历史参考，不删除资产；
- SDD 治理文档与当前产品主线保持一致；
- 后续迭代可以继续围绕 Game Lab 展开。

### 负面影响

- 旧的 `index.html` 路径不再直接展示 Game Analyzer；
- 已有书签需要改为 `legacy/analyzer.html`。

## 结论

Game Lab 是当前主产品，Game Analyzer 作为 Legacy 交互原型保留。
后续新增能力默认进入 Game Lab 工作流，除非通过新的 ADR 明确调整产品边界。
