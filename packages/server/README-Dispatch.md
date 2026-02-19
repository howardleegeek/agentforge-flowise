Oyster Dispatch integration (Dispatch Bridge) for AgentForge server

- Enabled by environment variables:
    - DISPATCH_ENABLED
    - DISPATCH_CONTROLLER_URL
- Endpoints exposed when enabled:
    - POST /api/v1/dispatch/submit
    - GET /api/v1/dispatch/status/:taskId
    - GET /api/v1/dispatch/nodes
- How to enable locally:
    1. Copy the example env to your working env: `cp .env.example .env` (or set the vars in your env)
    2. Set `DISPATCH_ENABLED=true` and `DISPATCH_CONTROLLER_URL="https://your-dispatch-controller.local"` in the env
    3. If your controller uses a callback, set `DISPATCH_CALLBACK_URL` accordingly (optional here but available in the example)
- Build and run:
    - npm run build
    - Start the server as you normally do for Flowise AgentForge

Notes:

- The dispatch bridge is designed to be a drop-in optional feature. When DISPATCH_ENABLED is false, all dispatch-related routes are skipped and behave as no-ops.
- This preserves the Flowise core chatflow execution while providing a distribution layer for supported workflows.
