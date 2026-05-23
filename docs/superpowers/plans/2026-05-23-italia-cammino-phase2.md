# Italia Cammino · Phase 2 实施计划（内容批量产线）

## Context

Phase 1（架构 + Firenze/Duomo 垂直切片）已完成并部署到 `italia-cammino.pages.dev`。Phase 2 的目标是**填充内容**，把架构里跑通的那条路扩展成 5 座城市完整可消费的行前学习地图。

不写新代码（已有的 9 个 collection schema、所有组件、所有页面都在 Phase 1 就绪），只生产 markdown 文件。按 spec § 7.3 的 backlog，Phase 2 大约 ~190 个文件，但实际我会写 **~140 个**（剔除拉文纳/五渔村/西西里候选城，放到 Phase 2.5）。

**完成定义**：5 座城市（Roma 进、Milano 出、Firenze 完成、Venezia、Napoli+Pompeii）都有完整的 hero + 时代轴 + 地点 + 实用层 + trivia；时代轴页 8 个时代都有摘要；主题门户至少 8 个。

---

## Scope

| 类型 | Phase 1 已有 | Phase 2 新增 | 累计 |
|---|---|---|---|
| 城市人格 `_meta.md` | 1 (Firenze) | 4 (Roma/Milano/Venezia/Napoli) | 5 |
| 地点 `*.md` | 1 (Duomo) | ~30 (每城 6-8) | ~31 |
| 餐厅 `_restaurants/*.md` | 2 | ~18 (每城 4-5) | ~20 |
| 民宿 `_lodging/*.md` | 1 | ~12 (每城 2-3) | ~13 |
| 交通 `_transport/*.md` | 1 | ~7 (城际路线) | ~8 |
| Trivia `_trivia/*.md` | 2 | ~15-20 | ~20 |
| 时代摘要 `eras/*.md` | 2 (Renaissance/Medieval) | 6 (剩余) | 8 |
| 主题门户 `topics/*.md` | 1 (Medici) | 7-10 | ~8-11 |
| 资源 `resources/*.md` | 3 | ~40-50 | ~50 |
| **合计** | 14 | **~140** | ~155 |

Phase 2.5（延后）：拉文纳、五渔村、西西里、Siena 等。

---

## Sequencing · 5 个批次

按城市分批，每批一个 commit + redeploy。城市内顺序：先写人格 + 时代摘要 + 主题（这些不依赖其他城市），再写地点（地点 frontmatter 会引用资源），再写实用层（餐厅/民宿/交通），最后 trivia。

| 批次 | 内容 | 估算文件数 |
|---|---|---|
| **B1 · Roma + Vaticano** | 1 meta + 8 places + 5 餐厅 + 3 lodging + 2 transport + 4 trivia + 12 resources | ~35 |
| **B2 · Milano** | 1 meta + 6 places + 4 餐厅 + 2 lodging + 1 transport + 3 trivia + 8 resources | ~25 |
| **B3 · Venezia** | 1 meta + 6 places + 4 餐厅 + 2 lodging + 1 transport + 3 trivia + 8 resources | ~25 |
| **B4 · Napoli + Pompeii** | 1 meta + 7 places (含 Pompeii) + 4 餐厅 + 2 lodging + 1 transport + 3 trivia + 8 resources | ~26 |
| **B5 · 时代摘要 + 主题门户** | 6 era + 8 topic + 6-10 跨城 resources | ~22 |

每批走流程：
1. 写所有 markdown
2. 跑 `pnpm build` 确认 schema 校验全过
3. `pnpm dev` 浏览器扫一眼新页面渲染正常
4. `git add -A && git commit -m "content: <batch name>"`
5. `pnpm build && npx wrangler pages deploy dist --project-name=italia-cammino --branch=main --commit-dirty=true`
6. `git push`
7. 标记本批次完成

---

## B1 · Roma + Vaticano 详细切片（先做这个）

### `_meta.md`（人格）
- 200 字。主题：永恒之城、层层叠加的历史地层（古罗马→早期基督教→巴洛克→法西斯→现代）、东西方文明枢纽。
- `era_weights`：ancient_rome=5, medieval=2, renaissance=3, baroque=5, unification=2, fascism=3, postwar=2, contemporary=2
- `status: confirmed`, `on_route: true`, `suggested_stay: "4 天"`

### Places（8 个 — 覆盖主要时代）
1. **colosseo**（古罗马）— 罗马斗兽场，is_museum: true
2. **pantheon**（古罗马）— 万神殿，免费但需预约
3. **foro-romano**（古罗马）— 古罗马广场
4. **vaticano-basilica**（文艺复兴）— 圣彼得大教堂
5. **cappella-sistina**（文艺复兴）— 西斯廷礼拜堂，is_museum: true
6. **fontana-di-trevi**（巴洛克）— 许愿池
7. **piazza-navona**（巴洛克）— 纳沃纳广场
8. **trastevere**（综合）— 河对岸老城区，氛围地点（不是 museum）

每个地点 300-500 字四段式（起因→转折→意义→现场看什么），按 spec § 4.2 schema。

### Restaurants（5 个）
- 1 经典罗马菜（cacio e pepe 类）
- 1 犹太区（Carciofi alla giudia）
- 1 街头小吃（Trapizzino 或类似）
- 1 Trastevere 区
- 1 Stanley Tucci 推荐或 Rick Steves 推荐

### Lodging（3 个区域）
- Trastevere（最热门住宿区，氛围好）
- Monti（中心区，年轻人喜欢）
- Prati（梵蒂冈附近，安静）

### Transport
- `roma-airport-to-center`（FCO 机场到市区）
- 把现有 `roma-to-firenze.md` 保留

### Trivia（4 条）
- "永恒之城"的来历
- 罗马斗兽场地下结构
- 梵蒂冈是世界最小国家
- 古罗马水道桥至今仍在供水

### Resources（约 12 个，地点 frontmatter 会引用）
- 书：《罗马人的故事》《罗马帝国衰亡史》《我克劳狄》《天使与魔鬼》（部分场景在罗马）
- 影视：BBC《罗马》、Netflix《罗马帝国》、《罗马假日》
- 纪录片：BBC《罗马:一个帝国的兴衰》、Smarthistory 西斯廷礼拜堂讲解
- 网站：Roma Pass 官网、梵蒂冈博物馆官网

---

## B2-B4 · 城市批次的 places 主轴预览

只列每城的主要地点（命名 + 时代），完整内容执行时按 B1 同样模板写。

### B2 · Milano
- **duomo-milano**（gothic，medieval）— 米兰大教堂
- **cenacolo**（renaissance）— 最后的晚餐，is_museum + booking_required
- **galleria-vittorio-emanuele**（unification）— 玻璃顶购物廊
- **teatro-alla-scala**（baroque/unification）— 斯卡拉歌剧院
- **navigli**（综合，氛围）— 运河区
- **quartiere-isola**（contemporary）— 现代摩天楼区

### B3 · Venezia
- **basilica-san-marco**（medieval）— 圣马可大教堂
- **palazzo-ducale**（medieval）— 总督府
- **canal-grande**（综合）— 大运河
- **rialto**（medieval）— 里亚托桥
- **dorsoduro-collection**（contemporary）— Peggy Guggenheim
- **murano-burano**（综合）— 玻璃岛 + 彩色岛（合并为一篇）

### B4 · Napoli + Pompeii
- **pompei-scavi**（ancient_rome）— 庞贝古城遗址，is_museum
- **museo-archeologico-napoli**（综合 / 古罗马藏品）— 国家考古博物馆
- **napoli-sotterranea**（综合）— 地下那不勒斯
- **spaccanapoli**（综合，氛围）— 老城主街
- **cappella-sansevero**（baroque）— 维罗大教堂礼拜堂，含"被遮蔽的基督"雕塑
- **vesuvio**（综合）— 维苏威火山
- **ercolano**（ancient_rome）— 赫库兰尼姆（庞贝姊妹城）

---

## B5 · 时代摘要 + 主题门户

### 6 个剩余时代（每个 150 字）
- `ancient_rome.md`
- `baroque.md`
- `unification.md`
- `fascism.md`
- `postwar.md`
- `contemporary.md`

### 8 个主题门户（每个 150 字）
现有：`medici.md`。新增提议：
- `brunelleschi.md`（建筑师，文艺复兴）
- `caravaggio.md`（画家，巴洛克）
- `michelangelo.md`（艺术家，文艺复兴）
- `vatican-papacy.md`（教皇制度）
- `roman-empire.md`（帝国兴衰）
- `maritime-republics.md`（海上共和国：威尼斯/热那亚/比萨/阿马尔菲）
- `risorgimento.md`（统一运动）
- `italian-cuisine-regional.md`（意大利地区饮食差异）

---

## 内容质量准则（每个文件都遵守）

来自 spec § 4 和 § 7.1：

**City `_meta.md`**：
- 200 字"城市人格"短文，原创口吻
- frontmatter `era_weights` 反映该城真实历史分量（佛罗伦萨 renaissance=5，威尼斯 medieval=5 这种）

**Place `*.md`**：
- 300-500 字四段式：**起因 → 转折 → 意义 → 现场看什么**
- 钩子引文一句话能让人停下来
- 关联 `related_topics` / `resources`（必须指向已存在的 id，否则 build 报错）
- museum 类必填 `booking_window`（用相对时间，例如"出发前 60 天预订"）和 `must_see_checklist`

**Restaurant**：
- 只写有信源能背书的（`trust: 2-3`）
- ★★★ = Tucci / Rick Steves / 官方
- ★★ = 训练数据中常识级
- 不写 ★（凭空捏造）

**Lodging**：
- 写**区域**不是具体房源
- `suitable_for` 描述对象（"3-4 人首选"等）
- `search_tips` 给 Airbnb 关键词 + 价格区间

**Transport**：
- `when_to_book` 永远用相对时间（"出发前 2-4 周"）
- 提供 `booking_url` 指向官方

**Trivia**：
- 一句话能讲完，让人"嗯？"
- 类型分布均匀：language / art / food / religion / curiosity / history

**Resource**：
- `hook_zh` 必须说清"读/看完后会得到什么"（不只是介绍）
- 不堆砌经典，挑能改变看意大利方式的几本

---

## 关键文件路径

**新建**：
- `src/content/cities/roma/_meta.md` + 7+ 个地点 + 实用层 + trivia
- `src/content/cities/milano/_meta.md` + 同上
- `src/content/cities/venezia/_meta.md` + 同上
- `src/content/cities/napoli/_meta.md` + 同上（Pompeii 是 Napoli 的 place）
- `src/content/eras/{ancient_rome,baroque,unification,fascism,postwar,contemporary}.md`
- `src/content/topics/*.md`（7 个新增）
- `src/content/resources/*.md`（~40-50 个新增）

**只读参考**：
- `src/content.config.ts` — schema 定义（不动）
- `src/content/cities/firenze/` — 已写好的样板
- `docs/superpowers/specs/2026-05-23-italia-cammino-design.md` § 4 + § 7

**Phase 1 plan 末尾追加 cross-link**：
- `docs/superpowers/plans/2026-05-23-italia-cammino-phase1.md` 加一行指向本 Phase 2 plan

---

## Verification

每个批次结束前：

```bash
cd /Users/maggie/Desktop/ccnew/italia-cammino
pnpm test                     # lib 单测，应当 4/4 pass
pnpm build                    # schema 校验 + Astro 类型 + 所有页面生成
pnpm dev                      # 手动浏览新页面
```

预期：每批新增的城市页 + 地点页全部能从首页地图 pin 点进去；时代轴页新城出现在对应时代列；schema 错误（比如 resource id 写错）一律在 `pnpm build` 阶段就抛出。

部署后访问 `https://italia-cammino.pages.dev/city/<新城>` 验证。

---

## 执行模式

把这份 plan 移到项目下 `docs/superpowers/plans/2026-05-XX-italia-cammino-phase2.md`，然后从 B1 (Roma) 开始。每完成一批 commit + deploy + 标记本 plan 里对应 checklist。

我会一批一批做，每批至少 25 个文件——单条消息内能写完。如果中途想看进度可以随时打断；如果想跳过某座城或某个地点改成你自己写，告诉我。

---

## 完成定义

- ✅ 5 座城市每座都有完整页面（点首页 pin 进去能看到时代轴 + 至少 5 个地点 + 实用层）
- ✅ 时代轴页 8 个时代格子都有内容
- ✅ 主题门户至少 8 个可访问
- ✅ Phase 1 plan 最后一行更新 Phase 2 完成状态
- ✅ `pnpm build` 无错，部署到 Cloudflare 后访问无 404
