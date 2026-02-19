// Ensure fetch is visible for environments without DOM lib typings
declare const fetch: any

export default class DispatchBridge {
    private controllerUrl: string
    private enabled: boolean

    constructor() {
        this.controllerUrl = (process.env.DISPATCH_CONTROLLER_URL || '').trim()
        // enable flag is a combination: enabled AND controller url provided
        const rawEnabled = (process.env.DISPATCH_ENABLED || 'false').toLowerCase()
        this.enabled = rawEnabled === 'true' || rawEnabled === '1'
    }

    public isEnabled(): boolean {
        // Bridge is usable only when explicitly enabled and URL is configured
        return this.enabled && this.controllerUrl.length > 0
    }

    private async postJson(path: string, body: any): Promise<any> {
        if (!this.isEnabled()) {
            return null
        }
        try {
            const res = await fetch(`${this.controllerUrl}${path}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })
            if (!res.ok) {
                // Return null to indicate not dispatched
                return null
            }
            return await res.json()
        } catch (e) {
            // swallow and signal not available
            return null
        }
    }

    private async getJson(path: string): Promise<any> {
        if (!this.isEnabled()) {
            return null
        }
        try {
            const res = await fetch(`${this.controllerUrl}${path}`, {
                method: 'GET'
            })
            if (!res.ok) {
                return null
            }
            return await res.json()
        } catch (e) {
            return null
        }
    }

    // Submit a chatflow/workflow to dispatch controller
    async submit(chatflowId: string, input?: any, flowName?: string): Promise<{ taskId: string } | null> {
        const payload: any = { chatflowId }
        if (input !== undefined) payload.input = input
        if (flowName) payload.flowName = flowName
        const result = await this.postJson('/submit', payload)
        if (result && result.taskId) {
            return { taskId: String(result.taskId) }
        }
        return null
    }

    // Query status of a dispatched task
    async status(taskId: string): Promise<any> {
        const data = await this.getJson(`/status/${encodeURIComponent(taskId)}`)
        return data
    }

    // List available dispatch nodes
    async nodes(): Promise<any> {
        const data = await this.getJson('/nodes')
        return data
    }
}
