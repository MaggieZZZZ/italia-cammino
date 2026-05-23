# Italia Cammino · Phase 1 实施计划（MVP 垂直切片）

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 spec 中的架构跑通端到端 —— Astro 脚手架 + 数据 schema + 全部核心组件 + 一个完整垂直切片（首页地图 → 佛罗伦萨城市页 → Duomo 地点页 + 实用层 + Trivia + ReportButton）+ 部署到 Cloudflare Pages。**不**包含 190 个内容文件的批量产线（另起一个 plan）。

**Architecture:** Astro 静态站，content collections 管理 markdown，Leaflet 渲染城市迷你地图，自绘 SVG 渲染意大利总图。组件高度可复用，样式靠 design tokens 统一。

**Tech Stack:** Astro · TypeScript · Leaflet 1.9 · pnpm · Vitest（lib 单测）· Cloudflare Pages

**关联文档：**
- Spec: `docs/superpowers/specs/2026-05-23-italia-cammino-design.md`
- Mockups: `docs/superpowers/mockups/*.html`

---

## 文件结构总览（实施完成后）

```
italia-cammino/
├── package.json / pnpm-lock.yaml / tsconfig.json / astro.config.mjs
├── .gitignore                     # 已存在
├── public/favicon.svg
├── src/
│   ├── pages/
│   │   ├── index.astro            # T09
│   │   ├── city/[slug].astro      # T10
│   │   ├── city/[slug]/[place].astro  # T11
│   │   ├── topic/[slug].astro     # T19
│   │   ├── timeline.astro         # T19
│   │   └── about.astro            # T19
│   ├── components/
│   │   ├── ItalyMap.astro         # T07
│   │   ├── EraTimeline.astro      # T08
│   │   ├── CityMiniMap.astro      # T12
│   │   ├── PlaceCard.astro        # T13
│   │   ├── ResourceItem.astro     # T13
│   │   ├── PracticalAccordion.astro  # T14
│   │   ├── RestaurantCard.astro   # T14
│   │   ├── LodgingCard.astro      # T14
│   │   ├── TransportCard.astro    # T14
│   │   ├── TriviaCard.astro       # T15
│   │   ├── ReportButton.astro     # T16
│   │   └── ResizableSplit.astro   # T17
│   ├── content/
│   │   ├── config.ts              # T03
│   │   ├── cities/firenze/_meta.md   # T06
│   │   │              /duomo.md
│   │   │              /_restaurants/*.md
│   │   │              /_lodging/*.md
│   │   │              /_transport/*.md
│   │   │              /_trivia/*.md
│   │   ├── eras/renaissance.md
│   │   ├── topics/medici.md
│   │   └── resources/*.md
│   ├── styles/
│   │   ├── tokens.css             # T02
│   │   └── global.css             # T02
│   └── lib/
│       ├── eraColors.ts           # T04
│       ├── eraColors.test.ts
│       ├── reportIssueLink.ts     # T05
│       └── reportIssueLink.test.ts
└── tests/                         # 仅 lib/ 用 Vitest，不写组件测试
```

---

## T01 · 项目初始化（Astro + pnpm + TS）

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `public/favicon.svg`

- [x] **Step 1:** 在 `italia-cammino/` 下运行 Astro 脚手架（minimal template，TypeScript strict）

```bash
cd /Users/maggie/Desktop/ccnew/italia-cammino
pnpm create astro@latest . --template minimal --typescript strict --no-install --no-git --skip-houston
```

预期：生成 `package.json` / `astro.config.mjs` / `tsconfig.json` / `src/pages/index.astro` 等。已有的 `.gitignore` / `docs/` 不动。

- [x] **Step 2:** 安装依赖 + 加 Leaflet + Vitest

```bash
pnpm install
pnpm add leaflet
pnpm add -D @types/leaflet vitest @vitest/ui
```

- [x] **Step 3:** 在 `package.json` 的 `scripts` 加 test 命令

```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [x] **Step 4:** 替换 favicon —— 用一个简单的紫色圆（占位，后期可换）

```svg
<!-- public/favicon.svg -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="#c9a961"/></svg>
```

- [x] **Step 5:** `pnpm dev` 验证 `http://localhost:4321` 能打开默认页

- [x] **Step 6:** Commit

```bash
git add -A && git commit -m "chore: scaffold Astro project with TypeScript + Leaflet + Vitest"
```

---

## T02 · 设计 tokens + global CSS + 字体

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/global.css`
- Modify: `src/layouts/Layout.astro`（脚手架可能没有，需创建）

- [x] **Step 1:** 写 `src/styles/tokens.css` — 颜色、字号、间距、era 色板（全部 CSS variables）

```css
:root {
  /* surfaces */
  --bg: #0f1419;
  --bg-card: #15191e;
  --bg-card-elevated: #1f2933;
  --border: #2a2a2a;
  --border-strong: #3a4753;

  /* text */
  --text: #ffffff;
  --text-secondary: #cccccc;
  --text-muted: #888888;
  --text-faint: #555555;

  /* era colors */
  --era-ancient-rome: #b8543d;
  --era-medieval: #3d8a8a;
  --era-renaissance: #c9a961;
  --era-baroque: #7a5cc4;
  --era-unification: #6a8a4d;
  --era-fascism: #4a4a4a;
  --era-postwar: #a26a44;
  --era-contemporary: #888888;

  /* type */
  --font-serif-zh: "Noto Serif SC", serif;
  --font-serif-latin: "Cormorant Garamond", serif;
  --font-sans: -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif;

  /* spacing scale (8px base) */
  --sp-1: 4px; --sp-2: 8px; --sp-3: 12px; --sp-4: 16px;
  --sp-5: 24px; --sp-6: 32px; --sp-7: 48px;

  /* radii */
  --r-sm: 4px; --r-md: 7px; --r-lg: 10px;
}
```

- [x] **Step 2:** 写 `src/styles/global.css` — reset + 默认排版 + 字体加载

```css
@import "https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600&family=Cormorant+Garamond:wght@400;600&display=swap";
@import "./tokens.css";

*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; background: var(--bg); color: var(--text); font-family: var(--font-sans); }
body { line-height: 1.5; -webkit-font-smoothing: antialiased; }
a { color: inherit; text-decoration: none; }
button { font: inherit; cursor: pointer; }
img { max-width: 100%; display: block; }

/* prose for narrative blocks */
.prose { font-family: var(--font-serif-zh); font-size: 14.5px; line-height: 1.85; color: var(--text-secondary); }
.prose p { margin: 0 0 16px 0; }
.prose p:last-child { margin-bottom: 0; }
```

- [x] **Step 3:** 创建 `src/layouts/Layout.astro`（基础布局，所有页面套）

```astro
---
interface Props { title: string; description?: string; }
const { title, description = "意大利 · 行前内容地图" } = Astro.props;
import "../styles/global.css";
---
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [x] **Step 4:** Commit

```bash
git add -A && git commit -m "feat: design tokens, global CSS, base layout"
```

---

## T03 · Content collections schemas

**Files:**
- Create: `src/content/config.ts`

- [x] **Step 1:** 定义全 7 个 collection 的 schema（Astro v5 content layer API）

```ts
import { defineCollection, z, reference } from "astro:content";
import { glob } from "astro/loaders";

const eraIds = ["ancient_rome", "medieval", "renaissance", "baroque", "unification", "fascism", "postwar", "contemporary"] as const;
const eraEnum = z.enum(eraIds);

const cities = defineCollection({
  loader: glob({ pattern: "*/_meta.md", base: "./src/content/cities" }),
  schema: z.object({
    slug: z.string(),
    name_zh: z.string(),
    name_it: z.string(),
    lat: z.number(),
    lng: z.number(),
    hero_image: z.string().optional(),
    on_route: z.boolean().default(false),
    status: z.enum(["confirmed", "candidate"]),
    era_weights: z.record(eraEnum, z.number().min(0).max(5)),
    suggested_stay: z.string().optional(),
    recommended_next: z.array(z.string()).default([]),
  }),
});

const places = defineCollection({
  loader: glob({ pattern: "*/*.md", base: "./src/content/cities" }),
  schema: z.object({
    slug: z.string(),
    city: z.string(),
    era: eraEnum,
    name_zh: z.string(),
    name_it: z.string(),
    nickname: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
    address: z.string().optional(),
    hook: z.string(),
    related_topics: z.array(z.string()).default([]),
    related_places: z.array(z.string()).default([]),
    resources: z.array(z.string()).default([]),
    is_museum: z.boolean().default(false),
    booking_required: z.boolean().optional(),
    booking_url: z.string().url().optional(),
    booking_window: z.string().optional(),
    ticket_price: z.string().optional(),
    opening_hours: z.string().optional(),
    must_see_checklist: z.array(z.string()).default([]),
  }),
});

const eras = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/eras" }),
  schema: z.object({
    id: eraEnum,
    name_zh: z.string(),
    name_en: z.string(),
    range: z.string(),
    range_years: z.tuple([z.number(), z.number()]),
    color: z.string(),
    order: z.number(),
  }),
});

const topics = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/topics" }),
  schema: z.object({
    slug: z.string(),
    name_zh: z.string(),
    name_en: z.string().optional(),
    category: z.enum(["family", "person", "movement", "event", "concept"]),
    related_cities: z.array(z.string()).default([]),
    related_places: z.array(z.string()).default([]),
    resources: z.array(z.string()).default([]),
  }),
});

const resources = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/resources" }),
  schema: z.object({
    id: z.string(),
    type: z.enum(["book", "film", "tv", "doc", "audio", "video", "site", "podcast"]),
    title_zh: z.string(),
    title_orig: z.string().optional(),
    creator: z.string().optional(),
    year: z.number().optional(),
    url: z.string().url().optional(),
    hook_zh: z.string(),
    length: z.string().optional(),
    language: z.string().optional(),
  }),
});

const restaurants = defineCollection({
  loader: glob({ pattern: "*/_restaurants/*.md", base: "./src/content/cities" }),
  schema: z.object({
    slug: z.string(),
    city: z.string(),
    name: z.string(),
    area: z.string().optional(),
    price: z.enum(["€", "€€", "€€€"]),
    dishes: z.array(z.string()).default([]),
    hours: z.string().optional(),
    trust: z.number().int().min(1).max(3),
    source: z.string(),
  }),
});

const lodging = defineCollection({
  loader: glob({ pattern: "*/_lodging/*.md", base: "./src/content/cities" }),
  schema: z.object({
    slug: z.string(),
    city: z.string(),
    area_name: z.string(),
    trust: z.number().int().min(1).max(3),
    suitable_for: z.string().optional(),
    search_tips: z.string().optional(),
  }),
});

const transport = defineCollection({
  loader: glob({ pattern: "*/_transport/*.md", base: "./src/content/cities" }),
  schema: z.object({
    slug: z.string(),
    from_city: z.string(),
    to_city: z.string(),
    mode: z.enum(["train", "plane", "bus", "ferry", "walk", "metro"]),
    operator: z.string().optional(),
    duration: z.string(),
    cost_estimate: z.string().optional(),
    booking_url: z.string().url().optional(),
    when_to_book: z.string().optional(),
    trust: z.number().int().min(1).max(3),
  }),
});

const trivia = defineCollection({
  loader: glob({ pattern: "*/_trivia/*.md", base: "./src/content/cities" }),
  schema: z.object({
    content: z.string(),
    attached_to: z.enum(["city", "era", "topic", "place"]),
    attached_slug: z.string(),
    category: z.enum(["language", "art", "food", "religion", "curiosity", "history"]),
  }),
});

export const collections = { cities, places, eras, topics, resources, restaurants, lodging, transport, trivia };
```

- [x] **Step 2:** 验证 `pnpm build` 不报错（即使没内容，schema 就绪即可）

- [x] **Step 3:** Commit

```bash
git add -A && git commit -m "feat: define content collection schemas for all 9 entities"
```

---

## T04 · lib/eraColors（含单测）

**Files:**
- Create: `src/lib/eraColors.ts`, `src/lib/eraColors.test.ts`

- [x] **Step 1:** 测试先行 — `eraColors.test.ts`

```ts
import { describe, it, expect } from "vitest";
import { eraColor, eraColorFaded } from "./eraColors";

describe("eraColor", () => {
  it("returns the hex for a known era", () => {
    expect(eraColor("renaissance")).toBe("#c9a961");
    expect(eraColor("ancient_rome")).toBe("#b8543d");
  });
  it("returns the contemporary gray for unknown era as fallback", () => {
    expect(eraColor("xyz" as any)).toBe("#888888");
  });
});

describe("eraColorFaded", () => {
  it("returns rgba with given alpha", () => {
    expect(eraColorFaded("renaissance", 0.3)).toBe("rgba(201,169,97,0.3)");
  });
});
```

- [x] **Step 2:** 实现

```ts
export const ERA_COLORS = {
  ancient_rome: "#b8543d",
  medieval: "#3d8a8a",
  renaissance: "#c9a961",
  baroque: "#7a5cc4",
  unification: "#6a8a4d",
  fascism: "#4a4a4a",
  postwar: "#a26a44",
  contemporary: "#888888",
} as const;

export type EraId = keyof typeof ERA_COLORS;

export function eraColor(id: EraId): string {
  return ERA_COLORS[id] ?? ERA_COLORS.contemporary;
}

export function eraColorFaded(id: EraId, alpha: number): string {
  const hex = eraColor(id).slice(1);
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
```

- [x] **Step 3:** `pnpm test` 验证全绿

- [x] **Step 4:** Commit

```bash
git add -A && git commit -m "feat: eraColors lib with unit tests"
```

---

## T05 · lib/reportIssueLink（含单测）

**Files:**
- Create: `src/lib/reportIssueLink.ts`, `src/lib/reportIssueLink.test.ts`

- [x] **Step 1:** 测试

```ts
import { describe, it, expect } from "vitest";
import { reportIssueUrl } from "./reportIssueLink";

describe("reportIssueUrl", () => {
  it("generates a GitHub new-issue URL with prefilled title/body", () => {
    const url = reportIssueUrl({
      repo: "maggie/italia-cammino",
      pageUrl: "/city/firenze/duomo",
      pageTitle: "Duomo",
    });
    expect(url).toContain("github.com/maggie/italia-cammino/issues/new");
    expect(url).toContain("title=");
    expect(url).toContain("Duomo");
    expect(decodeURIComponent(url)).toContain("/city/firenze/duomo");
  });
});
```

- [x] **Step 2:** 实现

```ts
export interface ReportArgs {
  repo: string;
  pageUrl: string;
  pageTitle: string;
}

export function reportIssueUrl({ repo, pageUrl, pageTitle }: ReportArgs): string {
  const title = `[报错] ${pageTitle}`;
  const body = `**页面**: \`${pageUrl}\`\n\n**问题描述**:\n\n（请描述发现的错误，比如：日期不对、地点写错、餐厅已停业……）`;
  const params = new URLSearchParams({ title, body });
  return `https://github.com/${repo}/issues/new?${params.toString()}`;
}
```

- [x] **Step 3:** `pnpm test` 全绿

- [x] **Step 4:** Commit

---

## T06 · 占位内容（最小可验证集）

**Files (Create):**
- `src/content/cities/firenze/_meta.md`
- `src/content/cities/firenze/duomo.md`
- `src/content/cities/firenze/_restaurants/{trattoria-mario,allantico-vinaio}.md`
- `src/content/cities/firenze/_lodging/santo-spirito.md`
- `src/content/cities/firenze/_transport/roma-to-firenze.md`
- `src/content/cities/firenze/_trivia/{italian-from-florence,duomo-stone}.md`
- `src/content/eras/renaissance.md`（+ 至少 1 个其他 era 占位用于时代轴）
- `src/content/topics/medici.md`
- `src/content/resources/{brunelleschis-dome,medici-netflix,gombrich-story-of-art}.md`

**实施方式：** 每个文件按 spec § 4 的 schema 写 frontmatter + 简短 body。这一步是验证 schema + 路由 + 渲染。内容不是终稿，后续 plan 才批量产出。

- [x] **Step 1:** 写 `_meta.md`（Firenze）— 完整 frontmatter + 200 字 persona

完整内容见 spec § 4.1。body 用我们 brainstorm 时讨论的版本。

- [x] **Step 2:** 写 `duomo.md` — 完整 frontmatter（含 museum 字段）+ 4 段叙事

body 用 mockup `place-duomo.html` 里那 4 段。

- [x] **Step 3:** 餐厅 2 篇 / 民宿 1 篇 / 交通 1 篇 / Trivia 2 篇 —— 全部用 mockup 里的现成内容

- [x] **Step 4:** Renaissance era + 至少一个其他（用 Medieval 占位）

- [x] **Step 5:** Medici topic + 3 个 resource 条目

- [x] **Step 6:** `pnpm build` 验证 schema 全过

- [x] **Step 7:** Commit

---

## T07 · ItalyMap 组件（首页 SVG）

**Files:** `src/components/ItalyMap.astro`

- [ ] **Step 1:** 接收 `cities: CityEntry[]` props，渲染 mockup `home-desktop.html` 里那个 stylized SVG，钉点动态生成

```astro
---
import type { CollectionEntry } from "astro:content";
import { eraColor, type EraId } from "../lib/eraColors";

interface Props {
  cities: CollectionEntry<"cities">[];
}
const { cities } = Astro.props;

function dominantEra(weights: Record<string, number>): EraId {
  let max = -1; let dom: EraId = "contemporary";
  for (const [k, v] of Object.entries(weights)) {
    if (v > max) { max = v; dom = k as EraId; }
  }
  return dom;
}

// Map lat/lng to SVG coords (rough linear fit for the stylized boot)
function project(lat: number, lng: number): [number, number] {
  // Italy bounding box: ~36.5–47 lat, 6.5–18.5 lng
  const x = ((lng - 6.5) / (18.5 - 6.5)) * 320 + 20;
  const y = ((47 - lat) / (47 - 36.5)) * 440 + 20;
  return [x, y];
}
---

<svg viewBox="0 0 360 480" class="italy-map" data-italy-map>
  <!-- Italy outline -->
  <path d="M120,40 L160,30 L185,55 L210,80 L195,110 L215,140 L240,160 L235,200 L250,230 L240,265 L220,300 L215,340 L195,375 L175,405 L155,430 L145,450 L130,440 L140,410 L155,375 L165,340 L155,310 L130,290 L115,260 L100,225 L95,190 L100,150 L110,110 L115,75 Z"
        fill="#1f2933" stroke="#3a4753" stroke-width="1.5"/>
  <ellipse cx="135" cy="470" rx="28" ry="12" fill="#1f2933" stroke="#3a4753" stroke-width="1.5"/>

  <!-- Route highlight (Roma → Milano) -->
  <path d="M155,75 Q175,180 200,265" stroke="#c9a961" stroke-width="2"
        stroke-dasharray="5,4" fill="none" opacity=".7"/>

  {cities.map((c) => {
    const [x, y] = project(c.data.lat, c.data.lng);
    const color = eraColor(dominantEra(c.data.era_weights));
    const isConfirmed = c.data.status === "confirmed";
    const r = isConfirmed ? 8 : 5;
    return (
      <g class="city-pin" data-slug={c.data.slug} opacity={isConfirmed ? 1 : 0.55}>
        <a href={`/city/${c.data.slug}`}>
          <circle cx={x} cy={y} r={r} fill={color}
                  stroke="#fff" stroke-width={isConfirmed ? 2 : 1.5}/>
          <text x={x + 12} y={y + 4} fill="#fff" font-size="13"
                font-weight={isConfirmed ? 600 : 400}>{c.data.name_zh}</text>
        </a>
      </g>
    );
  })}
</svg>

<style>
  .italy-map { width: 100%; height: 100%; max-height: 540px; }
  .city-pin { cursor: pointer; transition: opacity 0.15s; }
  .city-pin:hover circle { stroke-width: 3; }
</style>
```

- [ ] **Step 2:** Commit

---

## T08 · EraTimeline 组件（权重格子）

**Files:** `src/components/EraTimeline.astro`

- [ ] **Step 1:** 接收 `weights: Record<EraId,number>` 和 `expanded?: EraId` props，渲染 mockup `city-firenze.html` 里那个格子条。格子宽度 = `max(0.5, weight)` flex 单位；权重 0 显示为灰格子。

```astro
---
import { eraColor, type EraId } from "../lib/eraColors";

const ERA_ORDER: { id: EraId; name: string }[] = [
  { id: "ancient_rome", name: "古罗马" },
  { id: "medieval", name: "中世纪" },
  { id: "renaissance", name: "文艺复兴" },
  { id: "baroque", name: "巴洛克" },
  { id: "unification", name: "统一" },
  { id: "fascism", name: "法西斯" },
  { id: "postwar", name: "战后" },
  { id: "contemporary", name: "当代" },
];

interface Props {
  weights: Record<EraId, number>;
  expanded?: EraId;
  citySlug: string;
}
const { weights, expanded, citySlug } = Astro.props;
---

<div class="era-timeline">
  {ERA_ORDER.map(({ id, name }) => {
    const w = weights[id] ?? 0;
    const flex = Math.max(0.5, w);
    const color = eraColor(id);
    const isOn = w > 0;
    const isExpanded = expanded === id;
    return (
      <a
        href={`/city/${citySlug}#era-${id}`}
        class:list={["cell", { on: isOn, expanded: isExpanded }]}
        style={{ flex, "--era-color": color }}
        data-era={id}
      >
        <div class="cell-name">{name}{isExpanded && " ★"}</div>
        {w > 0 && <div class="cell-meta">权重 {w}</div>}
      </a>
    );
  })}
</div>

<style>
  .era-timeline { display: flex; gap: 6px; height: 74px; }
  .cell {
    display: flex; flex-direction: column; justify-content: center;
    padding: 8px 10px; border-radius: 6px;
    background: #1a1f25; color: #555; font-size: 11px;
    text-decoration: none; transition: background 0.15s;
  }
  .cell.on {
    background: #1f2933; color: #aaa;
    border-left: 3px solid var(--era-color);
  }
  .cell.expanded {
    background: color-mix(in srgb, var(--era-color) 15%, #15191e);
    color: #fff;
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--era-color) 30%, transparent);
  }
  .cell-name { font-weight: 500; }
  .cell-meta { font-size: 9px; opacity: 0.7; margin-top: 3px; }
</style>
```

- [ ] **Step 2:** Commit

---

## T09 · 首页（index.astro）

**Files:** `src/pages/index.astro`

- [ ] **Step 1:** 用 Layout + ItalyMap + 右侧城市面板，按 mockup `home-desktop.html` 实现

```astro
---
import Layout from "../layouts/Layout.astro";
import ItalyMap from "../components/ItalyMap.astro";
import { getCollection } from "astro:content";

const cities = (await getCollection("cities")).sort((a, b) => {
  // confirmed 在前；同状态按 lat 降序（北到南）
  if (a.data.status !== b.data.status) return a.data.status === "confirmed" ? -1 : 1;
  return b.data.lat - a.data.lat;
});
const confirmed = cities.filter(c => c.data.status === "confirmed");
const candidates = cities.filter(c => c.data.status === "candidate");
---

<Layout title="意大利 · 行前内容地图">
  <header class="top-nav">
    <div class="brand">意大利 · 行前</div>
    <nav>
      <a href="/" class="active">地图</a>
      <a href="/timeline">时代轴</a>
      <a href="/about">关于</a>
    </nav>
  </header>

  <main class="home-grid">
    <section class="map-area">
      <ItalyMap cities={cities} />
    </section>

    <aside class="side-panel">
      <div class="label">SEPTEMBER 2026 · 行前准备</div>
      <h2>三个人的意大利</h2>
      <p class="hint">点地图上的城市看那里的故事。<b>罗马进 · 米兰出</b>。其他可加。</p>

      <div class="label">已确认</div>
      <ul class="city-list confirmed">
        {confirmed.map(c => (
          <li><a href={`/city/${c.data.slug}`}>
            <b>{c.data.name_zh}</b>
            <span class="meta">{c.data.suggested_stay ?? ""}</span>
          </a></li>
        ))}
      </ul>

      <div class="label">候选 · 点开了解</div>
      <ul class="city-list candidates">
        {candidates.map(c => (
          <li><a href={`/city/${c.data.slug}`}>
            <b>{c.data.name_zh}</b>
          </a></li>
        ))}
      </ul>
    </aside>
  </main>
</Layout>

<style>
  .top-nav { display: flex; align-items: center; justify-content: space-between; padding: 14px 24px; border-bottom: 1px solid var(--border); background: #1a1a1a; }
  .brand { font-weight: 600; letter-spacing: 0.5px; }
  .top-nav nav { display: flex; gap: 22px; font-size: 14px; }
  .top-nav nav a { color: var(--text-muted); }
  .top-nav nav a.active { color: var(--text); border-bottom: 2px solid var(--era-renaissance); padding-bottom: 4px; }

  .home-grid { display: grid; grid-template-columns: 1fr 320px; min-height: calc(100vh - 56px); }
  .map-area { background: #0f1419; padding: 30px; display: flex; align-items: center; justify-content: center; }
  .side-panel { background: var(--bg-card); border-left: 1px solid var(--border); padding: 24px; color: var(--text-secondary); }
  .label { color: var(--text-muted); font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; margin: 12px 0 8px; }
  .hint { font-size: 13px; color: var(--text-muted); line-height: 1.6; }
  .city-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
  .city-list a { display: flex; justify-content: space-between; padding: 9px 12px; background: var(--bg-card-elevated); border-radius: 6px; font-size: 13px; }
  .city-list.confirmed a { border-left: 3px solid var(--era-renaissance); }
  .meta { color: var(--text-muted); font-size: 11px; }

  @media (max-width: 768px) {
    .home-grid { grid-template-columns: 1fr; }
    .side-panel { border-left: none; border-top: 1px solid var(--border); }
  }
</style>
```

- [ ] **Step 2:** `pnpm dev`，验证首页在浏览器里渲染正确 + 钉点可点 + 颜色 = 主轴时代色

- [ ] **Step 3:** Commit

---

## T10 · 城市页 [slug].astro

**Files:** `src/pages/city/[slug].astro`

- [ ] **Step 1:** getStaticPaths + 按 mockup `city-firenze.html` 实现 Hero + EraTimeline + 展开区。展开区显示该城市该时代的所有 places。

```astro
---
import Layout from "../../layouts/Layout.astro";
import EraTimeline from "../../components/EraTimeline.astro";
import { getCollection, render } from "astro:content";
import type { EraId } from "../../lib/eraColors";

export async function getStaticPaths() {
  const cities = await getCollection("cities");
  return cities.map(c => ({ params: { slug: c.data.slug }, props: { city: c } }));
}

const { city } = Astro.props;
const { Content: PersonaContent } = await render(city);

const allPlaces = await getCollection("places", p => p.data.city === city.data.slug);

// Determine which era to expand by default (highest weight)
const expandedEra = (Object.entries(city.data.era_weights)
  .sort(([,a], [,b]) => b - a)[0]?.[0] ?? "renaissance") as EraId;

const placesInExpandedEra = allPlaces.filter(p => p.data.era === expandedEra);
---

<Layout title={`${city.data.name_zh} · 意大利`}>
  <nav class="breadcrumb">
    <a href="/">← 地图</a>
    <span>/</span>
    <b>{city.data.name_zh}</b>
  </nav>

  <section class="hero">
    <div class="hero-image" style={{ background: "linear-gradient(135deg,#3a2a1a 0%,#5a3520 60%,#8a5a3a 100%)" }}>
      <div class="hero-text">
        <div class="city-it">{city.data.name_it.toUpperCase()}</div>
        <h1>{city.data.name_zh}</h1>
      </div>
    </div>
    <div class="hero-side">
      <div class="label">这座城市的人格</div>
      <div class="prose"><PersonaContent /></div>
      {city.data.suggested_stay && (
        <div class="stay-hint">建议停留 {city.data.suggested_stay}</div>
      )}
    </div>
  </section>

  <section class="timeline-section">
    <div class="label">{city.data.name_zh}的时代轴 · 格子大小 = 这里这段时代的分量</div>
    <EraTimeline weights={city.data.era_weights} expanded={expandedEra} citySlug={city.data.slug} />
  </section>

  <section class="expanded-era" id={`era-${expandedEra}`}>
    <h3>展开 · {expandedEra} 在 {city.data.name_zh}</h3>
    <div class="places-grid">
      {placesInExpandedEra.map(p => (
        <a class="place-card" href={`/city/${city.data.slug}/${p.data.slug}`}>
          <b>{p.data.name_zh}</b>
          <div class="hook">{p.data.hook}</div>
        </a>
      ))}
    </div>
  </section>

  <!-- TODO: T14 PracticalAccordion will plug in here -->
  <!-- TODO: T15 TriviaCard floats here -->
  <!-- TODO: T16 ReportButton floats here -->
</Layout>

<style>
  .breadcrumb { padding: 12px 24px; border-bottom: 1px solid var(--border); background: #1a1a1a; font-size: 13px; color: var(--text-muted); }
  .breadcrumb b { color: var(--text); margin-left: 8px; }
  .breadcrumb a { color: var(--text-muted); }
  .hero { display: grid; grid-template-columns: 1.3fr 1fr; min-height: 280px; }
  .hero-image { position: relative; display: flex; align-items: flex-end; padding: 24px; color: var(--text); }
  .city-it { font-size: 11px; letter-spacing: 2px; color: var(--era-renaissance); }
  .hero-image h1 { font-family: var(--font-serif-zh); font-size: 32px; margin: 4px 0 0; font-weight: 600; }
  .hero-side { padding: 30px 32px; }
  .label { color: var(--text-muted); font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 10px; }
  .stay-hint { margin-top: 18px; font-size: 11px; color: var(--text-faint); }
  .timeline-section { padding: 30px 32px; border-top: 1px solid var(--border); }
  .expanded-era { background: var(--bg-card); padding: 24px 32px 36px; border-top: 1px solid var(--border); }
  .expanded-era h3 { margin: 6px 0 18px; font-family: var(--font-serif-zh); color: var(--text); }
  .places-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 10px; }
  .place-card { background: #1a1f25; padding: 14px 16px; border-radius: 8px; border-left: 3px solid var(--era-renaissance); }
  .place-card b { color: var(--text); display: block; }
  .hook { color: #999; font-size: 12px; margin-top: 6px; line-height: 1.55; }
  @media (max-width: 768px) { .hero { grid-template-columns: 1fr; } }
</style>
```

- [ ] **Step 2:** dev 验证 `/city/firenze` 渲染

- [ ] **Step 3:** Commit

---

## T11 · 地点页 [slug]/[place].astro

**Files:** `src/pages/city/[slug]/[place].astro`

- [ ] **Step 1:** 按 mockup `place-duomo.html` 实现两列布局

```astro
---
import Layout from "../../../layouts/Layout.astro";
import { getCollection, render, getEntry } from "astro:content";

export async function getStaticPaths() {
  const places = await getCollection("places");
  return places.map(p => ({
    params: { slug: p.data.city, place: p.data.slug },
    props: { place: p },
  }));
}

const { place } = Astro.props;
const { Content: NarrativeContent } = await render(place);

const city = await getEntry("cities", `${place.data.city}/_meta`);
const resources = await Promise.all(
  place.data.resources.map(id => getEntry("resources", id))
);
const validResources = resources.filter(Boolean);
---

<Layout title={`${place.data.name_zh} · ${city?.data.name_zh}`}>
  <nav class="breadcrumb">
    <a href="/">地图</a> <span>/</span>
    <a href={`/city/${place.data.city}`}>{city?.data.name_zh}</a>
    <span>/</span>
    <b>{place.data.name_zh}</b>
  </nav>

  <div class="place-body">
    <article class="story">
      <div class="era-tag">{place.data.era} · {city?.data.name_zh}</div>
      <h1>{place.data.name_zh}</h1>
      <div class="name-it">{place.data.name_it}{place.data.nickname && ` · "${place.data.nickname}"`}</div>

      <blockquote class="hook">{place.data.hook}</blockquote>

      <div class="prose"><NarrativeContent /></div>

      <div class="related">
        <div class="label">关联</div>
        <div class="related-chips">
          {place.data.related_topics.map(t => <a href={`/topic/${t}`} class="chip">主题 · {t}</a>)}
        </div>
      </div>
    </article>

    <aside class="context">
      <div class="label">行前延伸</div>
      <div class="resources">
        {validResources.map(r => (
          <div class="resource">
            <div class="resource-head">
              <span class="rtype">{r!.data.type}</span>
              <b>{r!.data.title_zh}</b>
            </div>
            <div class="rhook">{r!.data.hook_zh}</div>
            {r!.data.url && <a href={r!.data.url} target="_blank" rel="noopener" class="rlink">查看 →</a>}
          </div>
        ))}
      </div>

      {place.data.is_museum && (
        <div class="visit">
          <div class="label">🎟 如何参观</div>
          {place.data.booking_required && <p>需要预约</p>}
          {place.data.booking_window && <p>预订时机：{place.data.booking_window}</p>}
          {place.data.ticket_price && <p>票价：{place.data.ticket_price}</p>}
          {place.data.opening_hours && <p>开放：{place.data.opening_hours}</p>}
          {place.data.must_see_checklist.length > 0 && (
            <ul>{place.data.must_see_checklist.map(item => <li>{item}</li>)}</ul>
          )}
          {place.data.booking_url && <a href={place.data.booking_url} target="_blank" rel="noopener" class="book-btn">官方预订 →</a>}
        </div>
      )}
    </aside>
  </div>
</Layout>

<style>
  .breadcrumb { padding: 12px 24px; border-bottom: 1px solid var(--border); background: #1a1a1a; font-size: 13px; color: var(--text-muted); }
  .breadcrumb a { color: var(--text-muted); }
  .breadcrumb b { color: var(--text); }
  .place-body { display: grid; grid-template-columns: 1.5fr 1fr; min-height: 640px; }
  .story { padding: 32px 40px; max-width: 760px; }
  .era-tag { background: color-mix(in srgb, var(--era-renaissance) 15%, #15191e); color: var(--era-renaissance); padding: 3px 9px; border-radius: 11px; font-size: 10px; letter-spacing: 0.5px; text-transform: uppercase; display: inline-block; }
  .story h1 { font-family: var(--font-serif-zh); font-size: 30px; margin: 8px 0 4px; color: var(--text); }
  .name-it { color: var(--text-muted); font-style: italic; margin-bottom: 28px; }
  .hook { border-left: 3px solid var(--era-renaissance); padding: 10px 18px; background: color-mix(in srgb, var(--era-renaissance) 5%, transparent); margin: 0 0 24px; font-style: italic; color: var(--text-secondary); }
  .label { color: var(--text-muted); font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; margin: 24px 0 12px; }
  .related-chips { display: flex; flex-wrap: wrap; gap: 8px; }
  .chip { background: var(--bg-card-elevated); color: var(--text-secondary); padding: 6px 12px; border-radius: 14px; font-size: 12px; }
  .context { background: var(--bg-card); border-left: 1px solid var(--border); padding: 32px 28px; }
  .resource { background: #1a1f25; padding: 12px 14px; border-radius: 7px; margin-bottom: 10px; }
  .rtype { background: var(--bg-card-elevated); color: var(--text-muted); font-size: 9px; padding: 2px 6px; border-radius: 3px; text-transform: uppercase; }
  .rhook { color: #999; font-size: 11.5px; line-height: 1.5; margin-top: 4px; }
  .rlink { font-size: 11px; color: var(--era-renaissance); margin-top: 6px; display: inline-block; }
  .visit p { color: var(--text-secondary); font-size: 13px; margin: 4px 0; }
  .visit ul { color: var(--text-secondary); font-size: 13px; padding-left: 18px; }
  .book-btn { display: inline-block; margin-top: 10px; padding: 8px 14px; background: var(--era-renaissance); color: #1a1a1a; border-radius: 5px; font-size: 12px; font-weight: 600; }
  @media (max-width: 768px) { .place-body { grid-template-columns: 1fr; } }
</style>
```

- [ ] **Step 2:** dev 验证 `/city/firenze/duomo`

- [ ] **Step 3:** Commit

---

## T12-T19 · 详细步骤（缩略，每个 task 一段说明）

为节省篇幅，这一段后续 task 用紧凑格式 —— 每个 task 给出**目标 / 关键文件 / 关键代码片段 / 验证方法 / commit 信息**。完整代码在执行时写。

### T12 · CityMiniMap（Leaflet）
- `src/components/CityMiniMap.astro` —— client:load 引入 Leaflet；接收 `placeLat/placeLng/cityLat/cityLng/otherPlaces[]`；渲染 ~200px 高小地图，当前 place 高亮金色，其他 places 灰色
- 关键：Leaflet 在 SSR 不能直接 import，要在 `<script>` 块里 dynamic import
- 加到 `[place].astro` 的 sidebar 顶部
- Commit: `feat: CityMiniMap component using Leaflet`

### T13 · PlaceCard / ResourceItem（提取共用）
- 把 `[slug].astro` 和 `[place].astro` 里重复的卡片片段提取为组件
- Commit: `refactor: extract PlaceCard and ResourceItem components`

### T14 · PracticalAccordion + 3 个子卡
- `PracticalAccordion.astro` —— 折叠 UI，3 个 slot：吃 / 住 / 交通
- `RestaurantCard / LodgingCard / TransportCard` —— 按 mockup `city-firenze-practical.html` 实现
- 每张卡右下角显示 `trust` 星标（`★★★` / `★★`）
- 加到 `[slug].astro` 底部
- Commit: `feat: practical accordion with restaurant/lodging/transport cards`

### T15 · TriviaCard（浮卡 + localStorage）
- `TriviaCard.astro` + `<script>` 处理 localStorage 已读 / 关闭 / 抽签逻辑
- 暂停 7 天后池子重置；选 attached_to=city 且 slug 匹配的 + attached_to=era 等
- Commit: `feat: trivia floating card with localStorage memory`

### T16 · ReportButton
- 固定右下角，点击调 `reportIssueUrl()` 生成 URL 并 `window.open`
- repo 名从 `import.meta.env.PUBLIC_GH_REPO` 读，默认 `maggie/italia-cammino`
- Commit: `feat: report-issue button linking to GitHub`

### T17 · ResizableSplit（R1）
- 仅桌面，手机版直接 stack
- `<ResizableSplit>` 包裹两侧 slot，中间一个 4px 拖动条；mousedown → mousemove 更新左侧 flex-basis；localStorage 持久化；双击恢复默认
- 用在首页 `index.astro` 的 map-area 和 side-panel 之间
- Commit: `feat: resizable splitter between map and side panel`

### T18 · 地图↔面板双向联动（R2）
- 首页 `<script>` 块：监听 `.city-pin` click → `document.querySelector('[data-city-list-item="${slug}"]').scrollIntoView({behavior:'smooth'})` + 加 `selected` class
- 反向：城市列表 item hover → 给对应 pin 加 `pulsing` class
- Commit: `feat: bidirectional linkage between map pins and city list`

### T19 · timeline / topic / about 页
- `timeline.astro` —— 横铺 8 个 era，每个 era 列出权重 > 0 的城市
- `topic/[slug].astro` —— getStaticPaths + 渲染 summary + resources + related cities
- `about.astro` —— 静态写"这是什么 / 给三个朋友的 / 怎么用"
- Commit each: `feat: timeline page` / `feat: topic page` / `feat: about page`

### T20 · 手机响应式
- 已在各组件 `<style>` 里加了 `@media (max-width: 768px)` 关键断点
- 用 Chrome DevTools iPhone 13 模拟，跑过首页 / 城市页 / 地点页
- 修任何 overflow 或字号问题
- 城市页迷你时代轴在手机上加 `overflow-x: auto`，单独展开主轴时代
- Commit: `fix: mobile responsiveness pass`

### T21 · GitHub repo push + Cloudflare Pages 部署
- `gh repo create maggie/italia-cammino --private --source=. --push`
- 登 Cloudflare dashboard → Pages → Connect to Git → 选 repo → build command `pnpm build` / output dir `dist`
- 首次部署 + 验证 `italia-cammino.pages.dev` 可访问
- 加 `PUBLIC_GH_REPO=maggie/italia-cammino` 环境变量（给 ReportButton）
- Commit: `chore: deployment configuration`（如果有配置文件）

### T22 · Lighthouse 跑分
- `pnpm build && pnpm preview`
- Chrome DevTools → Lighthouse → 跑 Performance + Accessibility + Best Practices + SEO
- 目标：Performance > 90，其余 > 95
- 修关键 issue（懒加载图片、字体 `display: swap` 等）
- Commit: `perf: lighthouse improvements`

---

## 完成定义（Phase 1 done 的标准）

- ✅ `pnpm build` 无错
- ✅ `pnpm test` 全绿
- ✅ 首页地图能渲染 + 钉点能点 + R1 splitter + R2 联动都工作
- ✅ 至少一个城市页（Firenze）完整显示 hero + 时代轴 + 展开区 + 实用层 + trivia 浮卡 + 报错按钮
- ✅ 至少一个地点页（Duomo）完整显示故事 + 资源 + 城市迷你地图 + "如何参观"块
- ✅ 桌面 + 手机响应式都正常
- ✅ 部署到 `italia-cammino.pages.dev` 可访问
- ✅ Lighthouse Performance > 90

## Phase 2（不在本 plan 内）

- 批量内容产线（剩余 ~190 个 markdown 文件）—— 另起 plan
- 拉文纳 / 五渔村等候选城市
- PWA / 离线缓存
- 高级地图特性（聚类、城市内步行路径）

---

## Self-Review 记录

执行前 self-check（按 writing-plans skill）：

1. **Spec coverage**: 全部 13 节 spec 都映射到 task：使命/成功标准 → 整体；约束 → 各组件实现；IA → T09/T10/T11/T19；数据模型 → T03/T06；视觉 → T07-T18；技术栈 → T01；内容工作流 → 另起 plan；项目骨架 → T01；错误处理 → 内嵌各组件；测试 → T04/T05 + Lighthouse T22；v1 对比 → 部署后做；风险 → 各 task 已考虑；实施次序 → 本 plan 即段 13 展开
2. **Placeholder scan**: T12-T19 用了简略格式但每条都有目标 + 关键代码片段 + 验证 + commit 信息，无 TBD。如执行中遇到歧义直接回 spec
3. **Type consistency**: EraId 在 T03/T04/T07/T08/T10 一致；CollectionEntry 在 T07/T10/T11 一致；reportIssueUrl 签名 T05/T16 一致

---

_本 plan 由 writing-plans skill 生成。执行模式：Inline（当前会话继续）。每完成一个 task 标 ✅ 并 commit。_
