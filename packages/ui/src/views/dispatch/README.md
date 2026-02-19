Dispatch 控制面板（Dispatch Dashboard）

- 显示集群节点状态、slots 使用率和任务队列。
- 数据来源：/api/v1/dispatch/\* API 调用。
- 数据每 10 秒自动刷新。
- 兼容现有的 Material-UI 设计风格，响应式布局。

What this change adds (verification guidance):

- Sidebar includes a Dispatch entry to navigate to the dashboard.
- The Dispatch Dashboard shows node cards with name, slots, and status.
- The dashboard displays counters for Pending, Running, and Completed tasks.
- Build should succeed with npm run build.
