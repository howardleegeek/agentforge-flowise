// Lightweight dispatch bridge to forward workflow tasks to an external Dispatch controller
// This module is intentionally small and dependency-free (uses built-in fetch)

type CallbackPayload = { taskId?: string; status?: string }

export class DispatchBridge {
    // Runtime check for enabling the bridge
    static isEnabled(): boolean {
        const val = process.env.DISPATCH_ENABLED ?? 'false'
        const v = String(val).toLowerCase()
        return v === 'true' || v === '1' || v === 'enabled'
    }

    // Simple in-memory task status cache for callbacks
    private static _taskStatus = new Map<string, string>()

    // Submit a chatflow/workflow to the controller
    static async submitTask(chatflowId: string, input?: any): Promise<string | null> {
        if (!DispatchBridge.isEnabled()) return null
        const controller = process.env.DISPATCH_CONTROLLER_URL
        if (!controller) return null
        try {
            const payload: any = { chatflowId, input }
            const res = await (global as any).fetch(`${controller}/api/v1/dispatch/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            if (!res || !res.ok) {
                // If controller responds with error, treat as no dispatch
                return null
            }
            const data = await res.json()
            // Expect the controller to return a taskId
            return data?.taskId ?? null
        } catch (err) {
            // Swallow errors in bridge to avoid breaking the API layer
            console.error('DispatchBridge.submitTask error', err)
            return null
        }
    }

    // Query status for a given task
    static async getStatus(taskId: string): Promise<any> {
        // First check in-memory cache
        if (DispatchBridge._taskStatus.has(taskId)) {
            return { taskId, status: DispatchBridge._taskStatus.get(taskId) }
        }
        if (!DispatchBridge.isEnabled()) {
            return { skipped: true, reason: 'DISPATCH_DISABLED', taskId }
        }
        const controller = process.env.DISPATCH_CONTROLLER_URL
        if (!controller) {
            return { skipped: true, reason: 'NO_CONTROLLER_URL', taskId }
        }
        try {
            const res = await (global as any).fetch(`${controller}/api/v1/dispatch/status/${taskId}`, {
                method: 'GET'
            })
            if (!res || !res.ok) {
                return { error: 'status_error', taskId }
            }
            const data = await res.json()
            // Normalize to return whatever the controller provides
            // Also store in cache if a status is provided
            if (data?.status) {
                DispatchBridge._taskStatus.set(taskId, data.status)
            }
            return { taskId, ...data }
        } catch (err) {
            console.error('DispatchBridge.getStatus error', err)
            return { error: (err as Error)?.message ?? 'status_error', taskId }
        }
    }

    // Retrieve available nodes from the controller
    static async getNodes(): Promise<any> {
        if (!DispatchBridge.isEnabled()) {
            return { skipped: true, reason: 'DISPATCH_DISABLED', nodes: [] }
        }
        const controller = process.env.DISPATCH_CONTROLLER_URL
        if (!controller) {
            return { skipped: true, reason: 'NO_CONTROLLER_URL', nodes: [] }
        }
        try {
            const res = await (global as any).fetch(`${controller}/api/v1/dispatch/nodes`, {
                method: 'GET'
            })
            if (!res || !res.ok) {
                return { error: 'nodes_error', nodes: [] }
            }
            const data = await res.json()
            // Expect { nodes: [...] } or similar shape; be permissive
            return data
        } catch (err) {
            console.error('DispatchBridge.getNodes error', err)
            return { error: (err as Error)?.message ?? 'nodes_error', nodes: [] }
        }
    }

    // Callback endpoint: update internal state from the controller
    static handleCallback(payload: CallbackPayload): void {
        const { taskId, status } = payload ?? {}
        if (!taskId) return
        if (status) {
            DispatchBridge._taskStatus.set(taskId, status)
        } else {
            DispatchBridge._taskStatus.set(taskId, 'updated')
        }
    }
}

export default DispatchBridge
