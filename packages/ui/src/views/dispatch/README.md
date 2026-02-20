Dispatch UI in AgentForge

Overview

- Adds a Dispatch control panel to the UI under the /dispatch route.
- Displays cluster nodes, per-node Slots usage, and the current task queue.
- Sidebar includes a Dispatch menu item to navigate to the panel.
- Data is fetched from /api/v1/dispatch/\* endpoints and refreshed every 10 seconds.

Files touched by this feature (existing in this repo):

- packages/ui/src/views/dispatch/DispatchDashboard.tsx
- packages/ui/src/views/dispatch/index.tsx
- packages/ui/src/menu-items/DispatchMenuItem.tsx
- packages/ui/src/routes/MainRoutes.jsx (Dispatch route)
- packages/ui/src/api/dispatch.js (API wrappers)

How to test

- Run npm install and npm run build to ensure the app bundles cleanly.
- Open the UI and verify:
    1. The sidebar shows a Dispatch entry.
    2. Clicking Dispatch loads the dashboard with a list of nodes, their slots usage, and the queue counts (pending/running/completed).
    3. Data auto-refreshes every 10 seconds; Last updated timestamp updates accordingly.

Notes

- No new dependencies are introduced. The UI reuses existing MUI components.
- The layout is responsive and designed to fit current visual language.
