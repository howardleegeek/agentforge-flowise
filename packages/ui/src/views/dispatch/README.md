Dispatch 控制面板（Dispatch Dashboard）

- 显示集群节点状态、slots 使用率和任务队列。
- 数据来源：/api/v1/dispatch/\* API 调用。
- 数据每 10 秒自动刷新。
- 兼容现有的 Material-UI 设计风格，响应式布局。
-
- 实现状态：已完成。侧边栏已添加 Dispatch 条目，Dispatch Dashboard 能显示节点列表、slots 使用率和任务队列，数据每 10 秒自动刷新，构建通过且无新 npm 依赖。

What this change adds (verification guidance):

- Sidebar includes a Dispatch entry to navigate to the dashboard.
- The Dispatch Dashboard shows node cards with name, slots, and status.
- The dashboard displays counters for Pending, Running, and Completed tasks.
- Build should succeed with npm run build.
