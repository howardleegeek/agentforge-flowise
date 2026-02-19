// Oyster Dispatch bridge for AgentForge server
// This bridge is optional and controlled by DISPATCH_ENABLED env var
// It talks to the remote Dispatch controller over HTTP using built-in fetch
// It converts Flowise chatflow executions into dispatch tasks and handles callbacks

export type DispatchCallback = {
    taskId: string
    status?: string
    result?: any
}

export class DispatchBridge {
    private static controllerUrl: string = (process.env.DISPATCH_CONTROLLER_URL || '').trim()
    private static enabled: boolean = (process.env.DISPATCH_ENABLED || 'false').toLowerCase() === 'true'
    private static callbackStore: Map<string, any> = new Map()

    // Static API: used by routes and tests that import the module directly
    static isEnabled(): boolean {
        // Enabled only when explicitly configured and URL exists
        return this.enabled && !!this.controllerUrl
    }

    // Instance API wrappers for tests that expect an object API
    isEnabled(): boolean {
        return (DispatchBridge as any).isEnabled()
    }

    // Submit a chatflow/workflow as a dispatch task
    // Supports both API shapes used by tests:
    // - Static API: submitTask(flowId, input, flowName?) -> string|object
    // - Instance API: submit(flowId, input, flowName?) -> { taskId: string }
    async submit(flowId: string, input?: any, flowName?: string): Promise<{ taskId: string } | null> {
        const res = await (DispatchBridge as any).submitTask(flowId, input, flowName)
        // If disabled, static submitTask returns a string skip-id; propagate null for instance API
        if (!res) return null
        if (typeof res === 'string') {
            // Disabled path
            return null
        }
        // Normalize to a consistent object for instance API
        return res as { taskId: string }
    }

    // Get status of a submitted task
    async status(taskId: string): Promise<any> {
        return await (DispatchBridge as any).getStatus(taskId)
    }

    // List available computation nodes on the controller
    async nodes(): Promise<string[]> {
        return await (DispatchBridge as any).getNodes()
    }

    // Static Submit Task
    // Returns a string when disabled (to satisfy existing tests), otherwise an object with taskId
    static async submitTask(flowId: string, input?: any, flowName?: string): Promise<any> {
        if (!this.isEnabled()) {
            // Return a skip-id to indicate no-op submission when disabled
            return `dispatch-skip-${Date.now()}`
        }
        const url = `${this.controllerUrl.replace(/\/$/, '')}/submit`
        const payload: any = {
            chatflowId: flowId,
            input,
            flowName
        }
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        if (!res.ok) {
            const text = await res.text()
            throw new Error(`Dispatch submit failed: ${res.status} ${text}`)
        }
        const data = await res.json()
        // Normalize to an object with taskId for the instance API
        const taskId = String(data?.taskId ?? data?.id ?? '')
        return { taskId }
    }

    // Get status of a submitted task
    static async getStatus(taskId: string): Promise<any> {
        if (!this.isEnabled()) {
            return { status: 'DISABLED' }
        }
        const url = `${this.controllerUrl.replace(/\/$/, '')}/tasks/${taskId}`
        const res = await fetch(url, { method: 'GET' })
        if (!res.ok) {
            const text = await res.text()
            throw new Error(`Dispatch status failed: ${res.status} ${text}`)
        }
        const data = await res.json()
        return data
    }

    // List available computation nodes on the controller
    static async getNodes(): Promise<string[]> {
        if (!this.isEnabled()) {
            return []
        }
        const url = `${this.controllerUrl.replace(/\/$/, '')}/nodes`
        const res = await fetch(url, { method: 'GET' })
        if (!res.ok) {
            const text = await res.text()
            throw new Error(`Dispatch nodes failed: ${res.status} ${text}`)
        }
        const data = await res.json()
        // Support { nodes: [...] } or a raw array
        if (Array.isArray(data)) return data
        if (Array.isArray((data as any)?.nodes)) return (data as any).nodes
        return []
    }

    // Handle a completion callback from the controller
    static handleCallback(callback: DispatchCallback): void {
        const { taskId, status, result } = callback
        if (!taskId) return
        this.callbackStore.set(taskId, { status, result, timestamp: Date.now() })
    }

    // Optional helper to inspect a callback history (not required by API)
    static getCallbackInfo(taskId: string): any {
        return this.callbackStore.get(taskId)
    }
}

export default DispatchBridge
