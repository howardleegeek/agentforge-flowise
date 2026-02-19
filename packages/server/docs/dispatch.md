# Dispatch Bridge (Oyster Dispatch) Integration

Overview

- Lightweight adapter that lets Flowise workflow executions be dispatched to an external Dispatch controller over HTTP.
- It converts Flowise chatflow executions into Dispatch tasks and handles completion callbacks.
- The bridge is optional and controlled via DISPATCH_ENABLED and DISPATCH_CONTROLLER_URL.

Configuration

- DISPATCH_ENABLED: true to enable, false to disable (default: false)
- DISPATCH_CONTROLLER_URL: base URL of the Dispatch controller (e.g. https://controller.example.com)

API Endpoints (mounted under /api/v1/dispatch)

- POST /submit
    - Body: { chatflowId: string, input?: any, flowName?: string }
    - Response: { taskId: string, dispatched: boolean } or { dispatched: false, reason: string }
- GET /status/:taskId
    - Response: status payload returned by the Dispatch controller (or DISPATCH_DISABLED if bridge is disabled)
- GET /nodes
    - Response: list of available Dispatch nodes

Current State (as implemented in this repo)

- dispatch-bridge.ts exists and handles HTTP calls to the Dispatch controller
- Routes mounted at /api/v1/dispatch with submit/status/nodes
- DISPATCH_ENABLED and DISPATCH_CONTROLLER_URL control behavior
- No changes to Flowise core; bridge is optional

Behavior notes

- If DISPATCH_ENABLED is false, all endpoints will skip processing and report as disabled.
- The bridge uses the built-in fetch (no new dependencies).
- If DISPATCH_CONTROLLER_URL ends with a slash, it is normalized.

Files touched in this change

- Existing: packages/server/src/services/dispatch-bridge.ts
- Existing: packages/server/src/routes/dispatch/index.ts
- New (documentation): packages/server/docs/dispatch.md

Next steps (optional)

- Add automated tests around DispatchBridge behavior when enabled/disabled.
- Update deployment docs to include DISPATCH_ENABLED and DISPATCH_CONTROLLER_URL configuration.
