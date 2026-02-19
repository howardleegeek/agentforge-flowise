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

    static isEnabled(): boolean {
        return this.enabled && !!this.controllerUrl
    }

    // Submit a chatflow/workflow as a dispatch task
    static async submitTask(flowId: string, input?: any): Promise<string> {
        if (!this.isEnabled()) {
            throw new Error('DISPATCH_DISABLED')
        }
        const url = `${this.controllerUrl.replace(/\/$/, '')}/tasks`
        const payload = {
            flowId,
            input
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
        // Normalize to a string taskId
        const taskId = String(data?.taskId ?? data?.id ?? '')
        return taskId
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
