// Lightweight Oyster Dispatch bridge integration for AgentForge server
// - Optional feature controlled by DISPATCH_ENABLED and DISPATCH_CONTROLLER_URL
// - Exposes both static API (for routes/tests) and instance API (for internal usage)

type CallbackPayload = { taskId: string; status?: string }

// Internal simple in-memory store for task statuses (demo-friendly)
class StatusStore {
    private map: Map<string, string> = new Map()
    set(id: string, status: string) {
        this.map.set(id, status)
    }
    get(id: string): string | undefined {
        return this.map.get(id)
    }
}

const globalStatusStore = new StatusStore()

export class DispatchBridge {
    // Public: check if bridge is enabled via env flag
    static isEnabled(): boolean {
        try {
            const v = process.env.DISPATCH_ENABLED
            return typeof v === 'string' && v.toLowerCase() === 'true'
        } catch {
            return false
        }
    }

    // Instance helper (tests expect this)
    isEnabled(): boolean {
        return DispatchBridge.isEnabled()
    }

    // Submit a chatflow as a dispatch task
    // Returns { taskId } on success, or a string starting with 'dispatch-skip-' when disabled/no-url
    static async submitTask(chatflowId: string, input: any, flowName?: string): Promise<{ taskId: string } | string> {
        if (!DispatchBridge.isEnabled()) {
            return `dispatch-skip-${Date.now()}`
        }
        const base = (process.env.DISPATCH_CONTROLLER_URL || '').trim().replace(/\/$/, '')
        if (!base) {
            return `dispatch-skip-${Date.now()}`
        }
        const url = `${base}/submit`
        const payload = {
            chatflowId,
            input,
            flowName
        }
        const opts: any = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }
        const res = await fetch(url, opts)
        if (!res || !res.ok) {
            throw new Error(`Dispatch controller request failed: ${res?.status ?? 'unknown'}`)
        }
        const data = await res.json()
        const taskId = data?.taskId
        if (!taskId) {
            throw new Error('Dispatch controller response missing taskId')
        }
        // store initial status
        globalStatusStore.set(taskId, 'submitted')
        return { taskId }
    }

    // Query status from controller
    // Returns the raw JSON payload from controller, or a local stub if controller not available
    static async getStatus(taskId: string): Promise<any> {
        if (!DispatchBridge.isEnabled()) {
            return { status: 'disabled' }
        }
        const base = (process.env.DISPATCH_CONTROLLER_URL || '').trim().replace(/\/$/, '')
        if (!base) {
            // Fall back to local status if available
            const local = globalStatusStore.get(taskId)
            return { status: local ?? 'unknown' }
        }
        const url = `${base}/status/${taskId}`
        const res = await fetch(url)
        if (!res || !res.ok) {
            throw new Error(`Failed to fetch status for ${taskId}`)
        }
        const data = await res.json()
        // Optional: sync local store
        if (data?.status) globalStatusStore.set(taskId, data.status)
        return data
    }

    // Retrieve available nodes from controller
    static async getNodes(): Promise<any> {
        if (!DispatchBridge.isEnabled()) return []
        const base = (process.env.DISPATCH_CONTROLLER_URL || '').trim().replace(/\/$/, '')
        if (!base) return []
        const url = `${base}/nodes`
        const res = await fetch(url)
        if (!res || !res.ok) {
            throw new Error(`Failed to fetch nodes`)
        }
        const data = await res.json()
        return data
    }

    // Callback handler from controller to update status
    static handleCallback(payload: CallbackPayload) {
        if (!payload?.taskId) return
        const status = payload.status ?? 'unknown'
        globalStatusStore.set(payload.taskId, status)
    }

    // Instance-level wrappers for tests that instantiate the class
    constructor() {
        // no-op
    }

    async submit(chatflowId: string, input: any, flowName?: string): Promise<{ taskId: string } | null> {
        const result = await DispatchBridge.submitTask(chatflowId, input, flowName)
        if (typeof result === 'string') {
            // disabled or no controller URL
            return null
        }
        return result
    }

    async status(taskId: string): Promise<any> {
        return DispatchBridge.getStatus(taskId)
    }

    async nodes(): Promise<any> {
        return DispatchBridge.getNodes()
    }
}

export default DispatchBridge
