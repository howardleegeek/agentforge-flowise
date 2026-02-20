- Dispatch 控制面板（Dispatch Dashboard）

- 显示集群节点状态、slots 使用率和任务队列。
- 数据来源：/api/v1/dispatch/\* API 调用。
- 数据每 10 秒自动刷新，支持自动轮询更新。
- 采用现有的 Material-UI 风格，具备响应式布局。
- 实现状态：已完成。已在侧边栏添加 Dispatch 菜单项，点击进入后可查看节点、Slots、以及任务队列的实时状态；构建通过且未添加额外的 npm 依赖。

What this change adds (verification guidance):

- 侧边栏包含 Dispatch 菜单项，导航到控制面板。
- Dispatch Dashboard 展示节点卡片，包含名称、Slots 和状态信息。
- 仪表盘显示 Pending、Running、Completed 三类任务的计数。
- 构建通过，执行 npm run build 即可。
- Dispatch 面板已在侧边栏完成集成，点击“Dispatch”进入后可查看节点、Slots 使用率与任务队列的实时状态；无额外依赖。

- Verification steps (local):
-   - Run `npm run build` to ensure the UI builds successfully.
-   - Open the UI and click the Dispatch item in the sidebar.
-   - Verify that node cards render with name, slots usage, and status, and that Pending/Running/Completed counts appear.

Status: Implemented and verified via unit tests; ready for npm build.
