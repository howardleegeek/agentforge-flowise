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

    // Submit a task to the dispatch controller. Returns a taskId.
    static async submitTask(chatflowId: string, input: any): Promise<string> {
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

        const payload = {
            chatflowId,
            input,
            callbackUrl: process.env.DISPATCH_CALLBACK_URL || ''
        }

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

export { DispatchBridge }
