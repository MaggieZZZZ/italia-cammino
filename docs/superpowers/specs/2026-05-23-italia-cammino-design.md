# Italia Cammino · 设计文档

| | |
|---|---|
| **状态** | Draft（等待用户审阅） |
| **日期** | 2026-05-23 |
| **作者** | Maggie + Claude（brainstorming skill） |
| **目标** | 在 2026 年 9 月意大利之行前，建立对意大利文化历史的整体心智地图 |
| **背景** | 上一版 `Italy/` 跳过了 brainstorm 阶段，结构和体验需大量返工。本项目独立重启，与 v1 并存供对照。 |

---

## 1 · 使命与成功标准

### 1.1 第一身份

**行前学习工具，建立意大利文化历史的整体心智地图。**

不是清单管理器，不是行程执行器，不是社交平台。其他特性可作为次要功能存在，但只要它们和"学习"主轴冲突，让位给主轴。

### 1.2 成功标准

**站在意大利现场（一座教堂 / 广场 / 画作前）时，脑子能立刻调出："这是哪个时代、为什么重要、它前后发生了什么"。**

这个标准定向了所有设计决策：
- **地图是核心视图**（不是辅助）—— 因为目标是空间直觉
- **故事单元锚定到具体地点**（而非时代或人物）
- **每座城市的时代权重不均** —— 让"这里最该看什么"一眼可见

### 1.3 次要目标

1. 学习的同时，帮助决定尚未敲定的行程（哪些候选城市值得加）
2. 9 月出发后仍可在手机上随时查（responsive）
3. 提供基础实用信息（餐厅 / 民宿 / 交通 / 预约），不抢学习主轴

---

## 2 · 约束 / 边界条件

| 维度 | 决定 |
|---|---|
| 用户 | 单人（作者）。可分享 URL 给 2 个同行朋友，但不要求登录 / 同步 / 协作 |
| 行程 | **罗马进 · 米兰出**（机票已定）；候选城市：罗马·梵蒂冈 / 佛罗伦萨 / 威尼斯 / 米兰 / 那不勒斯·庞贝 / 拉文纳 / 五渔村 / 西西里 |
| 设备 | Responsive，桌面 + 手机都认真做 |
| 后端 | 不要。纯静态站点，无账号、无数据库 |
| 时效 | 9 月之前每周可能更新；9 月之后维护到旅程结束；旅程后归档（不删除） |
| 内容主语言 | 中文。专有名词带意大利语原名 |

### 非目标（明确不做）

- ❌ 用户账号 / 多用户协作 / 评论系统
- ❌ 行程编排器（"D1: 罗马，D2: ..."）—— Notion 或专门工具更合适
- ❌ 实时翻译 / 语音导览 / AR
- ❌ 自动支付 / 订票集成（仅提供官网链接）
- ❌ 评论 / 评分系统（这不是 TripAdvisor）
- ❌ 全文检索（数据量小，无必要）—— 不排除 Phase 2 加

---

## 3 · 信息架构

### 3.1 页面树

```
首页 (/)                          ← 意大利地图，城市钉点 + 罗马→米兰动线高亮
  └─ 点 city pin → /city/:slug

城市页 (/city/:slug)              ← 主要消费页
  ├─ Hero（图 + 城市人格 200 字）
  ├─ 迷你时代轴（横向，格子宽度按 era_weights 加权）
  ├─ 展开的时代区块（一次只展开一个）→ 地点 + 关键人物 + 行前延伸资源
  ├─ 🍝 吃（折叠，默认收起）
  ├─ 🛏 住（折叠，推荐区域而非具体房源）
  └─ 🚆 交通（折叠，进出 + 城内 + 购票时机）

地点页 (/city/:slug/:place)       ← 叶子节点
  ├─ 钩子引文 + 300-500 字原创叙事（起因→转折→意义→现场看）
  ├─ 关联标签（同主题 / 同城同时代 / 同时代别处）
  └─ 右侧：城市迷你地图 + 行前延伸资源 + 🎟 如何参观（仅 museum 类）

主题页 (/topic/:slug)             ← 跨城市的人物 / 流派 / 概念
  ├─ 150 字引文
  └─ 资源清单 + 关联城市 / 地点

时代轴页 (/timeline)              ← 次要视图
  └─ 横铺 8 个时代，每个时代点亮当时活跃的城市

关于 (/about)                     ← 极简：这是什么 / 给谁的 / 怎么用
```

### 3.2 导航

- **顶栏**（桌面）：4 个 tab — **地图** · **城市** · **时代轴** · **主题**。"城市"下拉直达各城。
- **抽屉**（手机）：同上，汉堡菜单收起
- **面包屑**：地点页、主题页显示
- **每页右下角**：📝 报错按钮（→ GitHub issues，自动带 URL + 内容引用）

### 3.3 交互细节

- **R1 · 可拖动分隔条**：首页地图与右侧面板之间加 splitter，可左右拖；双击恢复默认 3:1 比例。手机版无此特性。
- **R2 · 地图 ↔ 面板双向联动**：点地图 city pin → 右侧面板自动 scroll + select + 展开；hover/click 右侧城市 → 地图 pin 高亮 + 脉冲。
- **时代格子单展开**：城市页迷你时代轴一次只展开一个 era；点其他格子切换；手机版默认展开主轴时代。
- **Trivia 浮卡**：随机出现在城市页 / 地点页边角；可关闭；localStorage 记录已看过，不重复。

---

## 4 · 数据模型

所有内容存盘为 **markdown + frontmatter**（Astro content collections），无数据库。

### 4.1 City

```yaml
slug: firenze
name_zh: 佛罗伦萨
name_it: Firenze
lat: 43.7696
lng: 11.2558
hero_image: ./hero.jpg
on_route: true              # 是否在已定的罗马→米兰主线上
status: confirmed | candidate
era_weights:
  ancient_rome: 0           # 0 = 几乎无（灰格子）
  medieval: 2               # 1-5，决定迷你时代轴格子宽度和亮度
  renaissance: 5
  baroque: 2
  unification: 0
  fascism: 0
  postwar: 0
  contemporary: 1
suggested_stay: "3 天"
recommended_next: ["roma", "venezia"]
---
persona_md: |
  200 字"城市人格"短文。原创。
```

### 4.2 Place

```yaml
slug: duomo
city: firenze
era: renaissance
name_zh: 圣母百花大教堂
name_it: Cattedrale di Santa Maria del Fiore
nickname: Il Duomo
lat: 43.7731
lng: 11.2560
address: Piazza del Duomo
hook: "教堂盖了 140 年，最后 16 年都在等一个钟表匠学徒说他想清楚了那个圆顶怎么盖。"
related_topics: [brunelleschi, medici]
related_places_same_era_other_city: [st-peters-basilica]
resources: [brunelleschis-dome, smarthistory-duomo, pbs-cathedral-mystery]

# museum 类可选字段
is_museum: true
booking_required: true
booking_url: https://...
booking_window: "建议出发前 60 天预订"
ticket_price: "€20"
opening_hours: "8:15–19:30 周一闭"
must_see_checklist:
  - Vasari 顶部壁画《最后的审判》
  - 爬 463 级台阶到圆顶外
  - 旁边 Baptistery 的"天堂之门"
---
narrative_md: |
  300-500 字四段式：起因 → 转折 → 意义 → 现场看
```

### 4.3 Era

固定 8 个，闭集，不增不减：

```yaml
id: renaissance
name_zh: 文艺复兴
name_en: Renaissance
range: "14C–17C"
range_years: [1300, 1600]
color: "#c9a961"
order: 3
---
summary_md: |
  150 字。
```

8 个 era id：`ancient_rome` `medieval` `renaissance` `baroque` `unification` `fascism` `postwar` `contemporary`

### 4.4 Topic

```yaml
slug: medici
name_zh: 美第奇家族
name_en: House of Medici
category: family | person | movement | event
related_cities: [firenze, roma]
related_places: [duomo, uffizi, palazzo-vecchio]
resources: [hibbert-medici, medici-netflix]
---
summary_md: |
  150 字引文。
```

### 4.5 Resource（独立条目，可被多处引用）

```yaml
id: brunelleschis-dome
type: book | film | tv | doc | audio | video | site | podcast
title_zh: 布鲁内莱斯基的圆顶
title_orig: "Brunelleschi's Dome"
creator: Ross King
year: 2000
url: https://...
hook_zh: "薄、好读，专门讲佛罗伦萨大教堂圆顶的工程史诗。"
length: "120 页"
language: 英 / 中译本可购
---
```

### 4.6 实用内容

**Restaurant**
```yaml
slug: trattoria-mario
city: firenze
name: Trattoria Mario
area: 中央市场附近
price: € | €€ | €€€
dishes: [Bistecca alla Fiorentina, Ribollita]
hours: "仅午餐 12:00-15:00"
trust: 3  # 1-3 颗星（信源信任档）
source: stanley_tucci  # 信源来源
why_md: 一段话理由
---
```

**Lodging**（区域建议，**不**推具体房源）
```yaml
slug: santo-spirito
city: firenze
area_name: 圣灵区（老桥南岸）
trust: 3
why_md: |
  3-4 人民宿首选区。理由：1) 在历史中心步行 5 分钟内；
  2) 比 Duomo 附近便宜 30%；3) 晚上有本地夜生活但不吵；
  4) 治安评分高。
suitable_for: "3-4 人 · 2 女 1-2 男"
search_tips: "Airbnb 关键词 Santo Spirito / Oltrarno。预算 €40-80/人/晚。"
---
```

**Transport**
```yaml
slug: roma-to-firenze
from_city: roma
to_city: firenze
mode: train
operator: Frecciarossa
duration: "1h30m"
cost_estimate: "€30-70（早订便宜）"
booking_url: https://www.trenitalia.com
when_to_book: "出发前 2-4 周；周末早班车贵且满"
trust: 3
tips_md: 罗马 Termini 出 → 佛罗伦萨 SMN。坐二等舱即可。
---
```

**Trivia**
```yaml
content: "现代意大利语其实来自佛罗伦萨方言..."
attached_to: city | era | topic | place
attached_slug: firenze
category: language | art | food | religion | curiosity
---
```

### 4.7 信任档展示

`trust` 字段在每条实用卡片右下角显示：
- ★★★ = 官方 / 你已确认的来源（Tucci / Rick Steves / recommendations.md）
- ★★ = AI 训练数据中的常识级信息
- ★ = 不写。宁可缺也不胡诌。

---

## 5 · 视觉与关键页面

参考 `docs/superpowers/mockups/` 下的 5 张 wireframe：

| 文件 | 内容 |
|---|---|
| `home-desktop.html` | 首页地图视图（桌面） |
| `city-firenze.html` | 城市页（佛罗伦萨，桌面，展开"文艺复兴"时代） |
| `place-duomo.html` | 地点页（Duomo，桌面） |
| `city-firenze-practical.html` | 城市页下半段（实用层 + trivia 浮卡） |
| `mobile.html` | 手机版（首页 + 城市页并排） |

### 5.1 视觉语言

- **配色**：深色主题（背景 `#0f1419` / 卡片 `#15191e` / 边框 `#2a2a2a`）。文化历史内容用深色更易聚焦阅读。
- **Era 色板**（每个时代一个色，贯穿钉点、格子、tag）：
  - `ancient_rome` `#b8543d`（赭红，古砖色）
  - `medieval` `#3d8a8a`（海蓝，海上共和国）
  - `renaissance` `#c9a961`（金色，主色调）
  - `baroque` `#7a5cc4`（深紫，戏剧感）
  - `unification` `#6a8a4d`（橄榄绿）
  - `fascism` `#4a4a4a`（中灰）
  - `postwar` `#a26a44`（赭石）
  - `contemporary` `#888888`（浅灰）
- **字体**：中文 Noto Serif SC，拉丁 Cormorant Garamond，正文行高 1.75-1.85
- **间距**：8px 基础格

### 5.2 视觉决策的"灵魂点"

1. **首页地图**：城市钉点颜色 = era_weights 主轴时代色。罗马→米兰动线虚线高亮。
2. **城市页迷你时代轴**：格子宽度**不等**，按 era_weights 加权。灰格子（权重 0）也是知识 —— 它告诉你"这里几乎没有那段"。
3. **地点页**：钩子引文置顶，5 秒决定读不读；右侧城市迷你地图把当前点拴回上下文。
4. **实用层**：默认折叠，置于学习内容下方，不抢首屏。
5. **Trivia 浮卡**：随机出现，零散投喂"你可能不知道"。

---

## 6 · 技术栈

| 层 | 选择 |
|---|---|
| 框架 | **Astro**（当前 stable，预计 5.x） |
| 内容 | Astro content collections（markdown + frontmatter，强类型 schema） |
| 地图（首页 / 时代轴） | 自绘 SVG（轻量、风格化） |
| 地图（城市迷你地图） | **Leaflet 1.9 + OpenStreetMap tile** |
| 样式 | 手写 CSS + design tokens（不用 Tailwind） |
| 字体 | Google Fonts: Noto Serif SC + Cormorant Garamond |
| 包管理 | pnpm |
| 部署 | **Cloudflare Pages**（git push 自动部署） |
| 版本控制 | git（独立 repo，host on GitHub private） |
| 反馈通道 | GitHub Issues（每页"📝 报错"按钮自动生成 new issue 链接） |

**否决项**：
- ❌ Next.js / Nuxt（SPA 框架对静态站过度）
- ❌ Tailwind（class noise 影响 AI 写叙事内容时的可读性）
- ❌ Mapbox（API 配额 + 收费）
- ❌ 数据库 / 后端（YAGNI）

---

## 7 · 内容创作工作流

**两条管线，不同信任度。** 完全跳过预审，所有内容直接 publish，用户在网页里发现问题通过 📝 报错按钮反馈。

### 7.1 管线 A · 文化历史内容（AI 主笔）

适用：城市人格 / 时代摘要 / 地点叙事 / 主题门户 / Trivia

- 我（Claude）按模板批量起草，遵循结构（钩子引文 / 起因→转折→意义→现场看 四段式）
- 直接 commit + push，无 review gate
- 用户在网页消费时发现问题 → 点 📝 → 创建 issue → 我下轮一并修

### 7.2 管线 B · 实用信息（信源驱动）

适用：餐厅 / 民宿区域 / 交通 / 预约 / 票价

- 我只写有信源能背书的条目：trust ★★★（官方 / Tucci / Rick Steves / recommendations.md）或 ★★（常识级）
- trust ★（AI 凭训练胡诌）= **不写**
- 每条卡片右下角显示信任档星标
- 预约时间永远是相对时间（"建议出发前 60 天"），不写死日期

### 7.3 内容 backlog（Phase 1）

仅覆盖**确认 + 高概率会去**的城市。Phase 2 等行程定后再补。

| 类型 | 估算数量 |
|---|---|
| 城市人格（5 城：罗马·梵蒂冈 / 佛罗伦萨 / 威尼斯 / 米兰 + 1 候选） | 5 |
| 地点叙事（每城 5-8 个） | 30 |
| 时代摘要（固定 8 个） | 8 |
| 主题门户（美第奇 / 卡拉瓦乔 / 法西斯 / 海上共和国…） | 8 |
| 餐厅（每城约 5） | 25 |
| 民宿区域（每城 3） | 15 |
| 交通 segment | 8 |
| Trivia | 30 |
| Resource 条目 | 60 |
| **Phase 1 合计** | **~190 markdown 文件** |

### 7.4 Phase 2（延后）

- 拉文纳 / 五渔村 / 西西里 / Siena 等延伸城市内容
- 全文检索（如 Phase 1 上线后觉得需要）
- PWA / 离线缓存（如 9 月旅程中网络不稳定）
- 多语言（v1 目标语就是中文，无国际化需求）

---

## 8 · 项目骨架

```
italia-cammino/                       # 独立 git repo
├── .gitignore                        # node_modules / .astro / dist
├── astro.config.mjs
├── package.json                      # pnpm
├── tsconfig.json
├── README.md                         # 简介 + dev / build / deploy 三段
├── public/
│   ├── favicon.svg
│   └── images/                       # hero / 地点图
├── src/
│   ├── pages/
│   │   ├── index.astro               # 首页（地图）
│   │   ├── city/[slug].astro         # 城市页
│   │   ├── city/[slug]/[place].astro # 地点页
│   │   ├── topic/[slug].astro
│   │   ├── timeline.astro
│   │   └── about.astro
│   ├── components/
│   │   ├── ItalyMap.astro            # 首页地图
│   │   ├── CityMiniMap.astro         # 地点页右侧小地图
│   │   ├── EraTimeline.astro         # 迷你时代轴（权重格子）
│   │   ├── PlaceCard.astro
│   │   ├── ResourceItem.astro
│   │   ├── PracticalAccordion.astro  # 吃 / 住 / 交通折叠
│   │   ├── TriviaCard.astro          # 浮卡
│   │   ├── ReportButton.astro        # 右下报错 → GH issue
│   │   └── ResizableSplit.astro      # R1
│   ├── content/
│   │   ├── config.ts                 # 所有 schema 定义
│   │   ├── cities/
│   │   │   └── firenze/
│   │   │       ├── _meta.md          # City 元数据 + persona
│   │   │       ├── duomo.md          # Place
│   │   │       ├── uffizi.md
│   │   │       ├── _restaurants/*.md
│   │   │       ├── _lodging/*.md
│   │   │       ├── _transport/*.md
│   │   │       └── _trivia/*.md
│   │   ├── eras/*.md
│   │   ├── topics/*.md
│   │   └── resources/*.md
│   ├── styles/
│   │   ├── tokens.css                # colors / type / spacing
│   │   └── global.css
│   └── lib/
│       ├── eraColors.ts
│       └── reportIssueLink.ts        # 生成 GH issue URL
└── docs/
    └── superpowers/
        ├── specs/2026-05-23-italia-cammino-design.md   # 本文
        └── mockups/*.html                              # 5 张 wireframe
```

---

## 9 · 错误处理与边界

| 场景 | 处理 |
|---|---|
| 地点缺少 `lat/lng` | 仍然渲染，城市迷你地图上不显示 pin（不报错） |
| Resource 引用了不存在的 id | Astro 构建时报错（content collections 强类型） |
| Trivia 卡用户全关掉 | 暂停 7 天后重新池子里抽 |
| 报错按钮无 GitHub 账号 | 兜底 `mailto:` 链接 |
| 图片加载失败 | 显示 era 色块 + 城市名作为 fallback hero |
| 用户分享 URL 给朋友 | 直接可看，无登录墙 |
| 9 月没网 | 出发前提示"把这些页面保存到手机收藏夹"；Phase 2 考虑 PWA |

---

## 10 · 不写测试 / 质量保证策略

**单元测试**：不写。
- 项目本质是内容站，逻辑极少（地图渲染、时代格子计算、URL 路由）
- Astro content collections schema 验证 = 类型检查 = 构建时报错
- TypeScript 类型检查覆盖大部分回归风险

**手动验收**：
- 每次 push 后 Cloudflare 自动构建，构建失败 = 部署失败 = 不会破现网
- 关键页面（首页 / 任一城市页 / 任一地点页）肉眼过一遍
- 手机响应式用浏览器 devtools 模拟 + 真机偶尔验证

**性能指标**：
- 首屏 LCP < 1.5s（4G 模拟）
- 整页 JS < 80KB（不含地图）
- Lighthouse Performance > 90

---

## 11 · 与 v1（`Italy/`）的对比策略

`Italy/` 冻结、不动。`italia-cammino/` 独立开发。完成后做以下对比：

| 维度 | v1 | v2（本设计） |
|---|---|---|
| 是否 brainstorm | 否 | 是（本 spec） |
| 信息架构 | 列表 / 时代轴 / 地图（三平级） | 地图为主，城市为消费页，时代轴次要 |
| 内容单元 | 主要是清单条目 | 短原创叙事 + 资源链接 |
| 实用模块 | 无 | 有（吃 / 住 / 交通 / 预约） |
| 技术栈 | 原生 HTML/CSS/JS + Leaflet | Astro + Leaflet |
| 内容文件数 | ~1 个 JS 数据文件 | ~190 markdown 文件 |
| 部署 | 本地静态 | Cloudflare Pages |

对比报告在 v2 上线后另起一篇 `2026-XX-XX-v1-v2-comparison.md`。

---

## 12 · 风险与待解决问题

| # | 风险 / 问题 | 当前处理 |
|---|---|---|
| 1 | AI 起草历史叙事可能错日期 / 错人物 | 接受。报错通道修复。重大史实部分会标"我已交叉验证" |
| 2 | 餐厅 / 预约信息时效快，9 月可能已变 | trust 星标 + 预约写相对时间 |
| 3 | 地图 SVG 风格化 vs 真实 OSM tile 视觉割裂 | Phase 1 先看效果，违和则统一一种 |
| 4 | 内容工作量大（190 文件） | 分阶段：先 Phase 1 五城；其余按需 |
| 5 | trivia 浮卡可能打扰阅读 | 默认开，但显眼关闭按钮 + localStorage 永久关闭项 |
| 6 | 拖动分隔条（R1）的移动端表现 | 手机不实现，仅桌面 |

---

## 13 · 实施次序建议（给 writing-plans 用）

1. **骨架 + tooling**：git init / Astro 脚手架 / pnpm / tokens / 字体加载
2. **数据 schema**：`src/content/config.ts` 全 7 个 collection 的 schema
3. **首页骨架**：Italy SVG + 假数据钉点 + 右侧面板布局（无可拖动）
4. **城市页骨架**：Hero / 迷你时代轴 / 时代展开区
5. **地点页骨架**：钩子 / 叙事 / 关联 / 资源 / 城市迷你地图
6. **5 个 City `_meta.md` + 至少每城 1 个 Place** 占位内容验证流程
7. **R1 ResizableSplit + R2 双向联动**
8. **实用模块**（Restaurant / Lodging / Transport / 折叠 UI）
9. **Trivia 浮卡 + 信任档星标**
10. **ReportButton（GH issue 链接生成）**
11. **时代轴页 + 主题页**
12. **批量内容生产（管线 A 5-7 批 + 管线 B 3-4 批）**
13. **部署到 Cloudflare Pages**
14. **手机真机验证**

writing-plans skill 会把上面每条展开成详细 task。

---

_本 spec 是 brainstorming skill 的产物，等待用户审阅后进入 writing-plans 阶段。_
