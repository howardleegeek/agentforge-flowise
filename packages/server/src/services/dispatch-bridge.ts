// Dispatch bridge for AgentForge server
// - Bridges Flowise chatflow execution to the Dispatch controller via HTTP
// - Exposes simple in-memory task tracking and a callback updater
// - Optional: when DISPATCH_ENABLED is false, all operations become no-ops

type TaskStatus = 'pending' | 'running' | 'completed' | 'failed' | string

interface InternalTask {
    taskId: string
    chatflowId: string
    input: any
    status: TaskStatus
}

// Simple in-memory store of tasks when dispatch is enabled
class DispatchBridge {
    private static _enabled: boolean = ((): boolean => {
        const v = process.env.DISPATCH_ENABLED
        return v === 'true' || v === '1'
    })()

    private static _controllerUrl: string = ((): string => {
        return (process.env.DISPATCH_CONTROLLER_URL || '').trim()
    })()

    private static _tasks: Map<string, InternalTask> = new Map()

    /** Public helpers used by routes */
    static isEnabled(): boolean {
        return this._enabled && this._controllerUrl.length > 0
    }

    // Convenience wrapper to match route expectations:
    // bridge.submit(chatflowId, input, flowName) -> Promise<{ taskId } | null>
    // Delegates to submitTask and adapts the return shape.
    static async submit(chatflowId: string, input: any, flowName?: string): Promise<{ taskId: string } | null> {
        // Reuse the existing submission logic. Pass flowName through to the underlying submitTask
        // so that the controller payload can carry the flow name when provided.
        const taskId = await this.submitTask(chatflowId, input, flowName)
        return taskId ? { taskId } : null
    }

    // Compatibility wrapper: expose status() same as getStatus()
    // Return an object for compatibility with tests expecting { status: '...' }
    static async status(taskId: string): Promise<{ status: string }> {
        const s = await this.getStatus(taskId)
        return { status: s }
    }

    // Compatibility wrapper: expose nodes() that delegates to getNodes()
    static async nodes(): Promise<any> {
        return this.getNodes()
    }

    // Instance methods to satisfy tests that instantiate the class
    async submit(chatflowId: string, input: any, flowName?: string): Promise<{ taskId: string } | null> {
        // Delegate to static implementation
        // @ts-ignore
        return (DispatchBridge as any).submit(chatflowId, input, flowName)
    }
    async submitTask(chatflowId: string, input: any, flowName?: string): Promise<string> {
        // @ts-ignore
        return (DispatchBridge as any).submitTask(chatflowId, input, flowName)
    }
    async status(taskId: string): Promise<{ status: string }> {
        // @ts-ignore
        return (DispatchBridge as any).status(taskId)
    }
    async nodes(): Promise<any> {
        // @ts-ignore
        return (DispatchBridge as any).nodes()
    }
    // Submit a task to the dispatch controller. Returns a taskId.
    static async submitTask(chatflowId: string, input: any, flowName?: string): Promise<string> {
        // If disabled, simulate a skipped task
        if (!this._enabled || this._controllerUrl.length === 0) {
            const taskId = `dispatch-skip-${Date.now()}-${Math.floor(Math.random() * 1000)}`
            this._tasks.set(taskId, {
                taskId,
                chatflowId,
                input,
                status: 'completed'
            })
            return taskId
        }

        const payload: any = {
            chatflowId,
            input,
            callbackUrl: process.env.DISPATCH_CALLBACK_URL || ''
        }
        if (flowName) payload.flowName = flowName

        const res: any = await this._postJson(`${this._controllerUrl.replace(/\/$/, '')}/submit`, payload)
        const taskId = (res && res.taskId) || `dispatch-${Date.now()}`
        this._tasks.set(taskId, {
            taskId,
            chatflowId,
            input,
            status: 'running'
        })
        return taskId
    }

    static async getStatus(taskId: string): Promise<string> {
        const t = this._tasks.get(taskId)
        if (!t) return 'unknown'
        if (t.status === 'completed' || t.status === 'failed') return t.status
        // Try to poll controller for updated status
        if (this._enabled && this._controllerUrl) {
            try {
                const res: any = await this._getJson(`${this._controllerUrl.replace(/\/$/, '')}/status/${taskId}`)
                const status = (res && res.status) || t.status
                t.status = status
                return t.status
            } catch {
                // ignore and keep local status
            }
        }
        return t.status
    }

    static updateStatus(taskId: string, status: string): void {
        const t = this._tasks.get(taskId)
        if (t) {
            t.status = status as TaskStatus
        } else {
            // Unknown task, create a minimal record to reflect status
            this._tasks.set(taskId, {
                taskId,
                chatflowId: '',
                input: null,
                status: status as TaskStatus
            })
        }
    }

    static async getNodes(): Promise<any> {
        if (!this._enabled || this._controllerUrl.length === 0) return []
        try {
            const res = await this._getJson(`${this._controllerUrl.replace(/\/$/, '')}/nodes`)
            return res
        } catch {
            return []
        }
    }

    // Callback updater (called by the route)
    static handleCallback(payload: { taskId: string; status: string }): void {
        if (!payload?.taskId) return
        this.updateStatus(payload.taskId, payload.status)
    }

    // Internal helpers
    private static async _postJson(url: string, body: any): Promise<any> {
        const fetchFn: any = (globalThis as any).fetch
        if (!fetchFn) return {}
        const res = await fetchFn(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
        try {
            return await res.json()
        } catch {
            return {}
        }
    }

    private static async _getJson(url: string): Promise<any> {
        const fetchFn: any = (globalThis as any).fetch
        if (!fetchFn) return {}
        const res = await fetchFn(url, { method: 'GET' })
        try {
            return await res.json()
        } catch {
            return {}
        }
    }
}

// Instance-compatible wrappers (to satisfy tests that instantiate DispatchBridge)
// These simply delegate to the static implementations above.
// Removed: DispatchBridgeInstanceWrapper (no longer needed)

export { DispatchBridge }
export default DispatchBridge
