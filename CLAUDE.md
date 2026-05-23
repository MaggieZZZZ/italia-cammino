# CLAUDE.md · italia-cammino

意大利行前内容地图。**2026-05-23 由 brainstorming skill 设计完成，等待实施。**

## 工作起点

1. 读 spec：`docs/superpowers/specs/2026-05-23-italia-cammino-design.md`
2. 读 plan：`docs/superpowers/plans/2026-05-23-italia-cammino-phase1.md`
3. 看 mockup（5 张 wireframe）：`docs/superpowers/mockups/*.html`

Plan 设计为 zero-context 可接手 —— 不需要回看上一会话的 brainstorming 对话。

## 上下文

- **作者**：Maggie。9 月与 2 个朋友去意大利首旅。
- **v1 是 `../Italy/`**（同 parent dir），跳过了 brainstorm，要保留作对照。**不要动 `../Italy/`。**
- **v2 = 本项目**。Astro + Leaflet + Cloudflare Pages 静态站。
- **第一身份**：行前学习工具，建立意大利文化历史心智地图（不是清单、不是行程器）。
- **成功标准**：现场能调出故事 = 空间直觉。地图为核心视图，城市页为消费页。

## 关键约束（更详细的在 spec § 2）

- 无后端 / 无账号 / 无登录。纯静态。
- 单用户（可分享 URL 给朋友）。
- Responsive：桌面 + 手机都认真做。
- 内容中文为主，专有名词带意大利语原名。
- 不要 README.md（项目知识在 CLAUDE.md + spec + plan）。

## 执行流程

按 `docs/superpowers/plans/2026-05-23-italia-cammino-phase1.md` 的 T01 → T22 顺序。每完成一个 task：
1. 在 plan 文件里把对应 step 的 `- [ ]` 改成 `- [x]`
2. Commit（plan 里给了 commit message 模板）

## 测试

- `pnpm test`（Vitest，仅 `src/lib/*.test.ts`）
- `pnpm build`（Astro 类型 + schema 校验）
- 视觉验证：`pnpm dev` 然后浏览器 `http://localhost:4321`

## Phase 1 完成的定义

见 plan 文档末尾"完成定义"清单。简言之：架构跑通 + Firenze/Duomo 端到端可用 + 部署上线。

Phase 2（剩余 ~190 内容文件）另起 plan，先把 Phase 1 跑通。
