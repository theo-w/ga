# Quickstart: Real Review Import

## Prerequisites

- Node.js 24+
- A modern browser
- A local Steam-style or TapTap-style review JSON file

## Automated Check

```bash
npm run check
```

## Local Run

```bash
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000/lab.html
```

## User Journey

### 1. Import Reviews

1. Open `输入洞察`.
2. Click `导入真实评论 JSON`.
3. Select a supported local JSON file.

Expected result:

- The file name appears in `数据集证据`.
- Platform, game, sample count, import time, and review time range are visible.
- Missing metadata displays `未知`.

### 2. Analyze Real Reviews

1. Click `分析口碑`.

Expected result:

- Motivation stats use imported reviews.
- Hypotheses and experiment design update.
- Evidence items include source IDs.

### 3. Export the Evidence Trail

1. Open `结果回流`.
2. Click `导出实验 JSON`.

Expected result:

- Export includes `dataset` metadata.
- Export includes normalized `reviews`.

## Validation Checklist

- [ ] Steam-format fixture imports.
- [ ] TapTap-format fixture imports.
- [ ] Dataset metadata displays.
- [ ] Missing metadata displays `未知`.
- [ ] Invalid JSON shows an error.
- [ ] Unsupported JSON shows an error.
- [ ] Empty review list shows an error.
- [ ] New import replaces prior review-derived analysis.
- [ ] Motivation analysis runs.
- [ ] Export includes dataset metadata.
- [ ] `npm run check` passes.
