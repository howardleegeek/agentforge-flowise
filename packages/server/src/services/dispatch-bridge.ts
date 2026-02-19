// Oyster Dispatch bridge for AgentForge server
// This bridge is optional and controlled by DISPATCH_ENABLED env var
// It talks to the remote Dispatch controller over HTTP using built-in fetch
// It converts Flowise chatflow executions into dispatch tasks and handles callbacks

export type DispatchCallback = {
    taskId: string
    status?: string
    result?: any
}

type DispatchSubmitResult = {
    taskId: string
}

export class DispatchBridge {
    private static callbackStore: Map<string, any> = new Map()

    private static getControllerUrl(): string {
        return (process.env.DISPATCH_CONTROLLER_URL || '').trim()
    }

    private static isEnabledByEnv(): boolean {
        return (process.env.DISPATCH_ENABLED || 'false').toLowerCase() === 'true'
    }

    private static async requestJson(path: string, init: RequestInit, errorPrefix: string): Promise<any> {
        const url = `${this.getControllerUrl().replace(/\/$/, '')}${path}`
        const response = await fetch(url, init)
        if (!response.ok) {
            const text = await response.text()
            throw new Error(`${errorPrefix}: ${response.status} ${text}`)
        }
        return response.json()
    }

    static isEnabled(): boolean {
        return this.isEnabledByEnv() && this.getControllerUrl().length > 0
    }

    isEnabled(): boolean {
        return DispatchBridge.isEnabled()
    }

    async submit(flowId: string, input?: any, flowName?: string): Promise<{ taskId: string } | null> {
        const res = await DispatchBridge.submitTask(flowId, input, flowName)
        if (typeof res === 'string') {
            return null
        }
        return res
    }

    async status(taskId: string): Promise<any> {
        return DispatchBridge.getStatus(taskId)
    }

    async nodes(): Promise<string[]> {
        return DispatchBridge.getNodes()
    }

    static async submitTask(flowId: string, input?: any, flowName?: string): Promise<DispatchSubmitResult | string> {
        if (!this.isEnabled()) {
            return `dispatch-skip-${Date.now()}`
        }
        const payload = {
            chatflowId: flowId,
            input,
            flowName
        }
        const data = await this.requestJson(
            '/submit',
            {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
            },
            'Dispatch submit failed'
        )
        const taskId = String(data?.taskId ?? data?.id ?? '').trim()
        if (!taskId) {
            throw new Error('Dispatch submit failed: missing taskId in response')
        }
        return { taskId }
    }

    static async getStatus(taskId: string): Promise<any> {
        if (!this.isEnabled()) {
            return { skipped: true, reason: 'DISPATCH_DISABLED' }
        }
        return this.requestJson(`/tasks/${taskId}`, { method: 'GET' }, 'Dispatch status failed')
    }

    static async getNodes(): Promise<string[]> {
        if (!this.isEnabled()) {
            return []
        }
        const data = await this.requestJson('/nodes', { method: 'GET' }, 'Dispatch nodes failed')
        if (Array.isArray(data)) return data
        if (Array.isArray((data as any)?.nodes)) return (data as any).nodes
        return []
    }

    static handleCallback(callback: DispatchCallback): void {
        const { taskId, status, result } = callback
        if (!taskId) return
        this.callbackStore.set(taskId, { status, result, timestamp: Date.now() })
    }

    static getCallbackInfo(taskId: string): any {
        return this.callbackStore.get(taskId)
    }
}

export default DispatchBridge
