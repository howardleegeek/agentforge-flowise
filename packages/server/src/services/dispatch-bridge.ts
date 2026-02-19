// Dispatch bridge: lightweight adapter to dispatch controller over HTTP
// - Enables optional integration via DISPATCH_ENABLED / DISPATCH_CONTROLLER_URL
// - Converts Flowise chatflow executions into dispatch tasks
// - Fetches task status and available nodes from controller

type Json = any

export class DispatchBridge {
    private baseUrl: string
    private enabled: boolean

    constructor() {
        // Enabled when env flag is true (case-insensitive)
        const enabledVal = process.env.DISPATCH_ENABLED
        this.enabled = typeof enabledVal === 'string' && enabledVal.toLowerCase() === 'true'
        const url = process.env.DISPATCH_CONTROLLER_URL || ''
        // Normalize URL (remove trailing slash if any)
        this.baseUrl = url.endsWith('/') ? url.slice(0, -1) : url
    }

    isEnabled(): boolean {
        return this.enabled
    }

    private async fetchJson(url: string, options?: RequestInit): Promise<Json> {
        // If not enabled or no base URL, surface a clear error
        if (!this.enabled) {
            throw new Error('Dispatch is disabled by configuration (DISPATCH_ENABLED)')
        }
        if (!this.baseUrl) {
            throw new Error('DISPATCH_CONTROLLER_URL is not configured')
        }
        const resp = await (globalThis as any).fetch(url, {
            method: options?.method ?? 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(options?.headers as any)
            },
            body: options?.body as any
        })
        if (!resp.ok) {
            const text = await resp.text()
            throw new Error(`Dispatch controller HTTP ${resp.status}: ${text}`)
        }
        // Some endpoints may return no body
        const ct = resp.headers.get('content-type') || ''
        if (ct.includes('application/json')) {
            return await resp.json()
        }
        return {}
    }

    async submit(chatflowId: string, input: any, flowName?: string): Promise<{ taskId: string } | null> {
        if (!this.enabled) return null
        const payload = { chatflowId, input, flowName }

        // Try a couple of conventional endpoints for dispatch submission
        const primary = `${this.baseUrl.replace(/\/$/, '')}/dispatch/submit`
        const secondary = `${this.baseUrl.replace(/\/$/, '')}/api/v1/dispatch/submit`

        try {
            const res = await this.fetchJson(primary, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            return { taskId: res?.taskId ?? '' }
        } catch {
            // Fall back to secondary endpoint
            const res2 = await this.fetchJson(secondary, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            return { taskId: res2?.taskId ?? '' }
        }
    }

    async status(taskId: string): Promise<any> {
        if (!this.enabled) return { status: 'DISPATCH_DISABLED' }
        const primary = `${this.baseUrl.replace(/\/$/, '')}/dispatch/status/${taskId}`
        const secondary = `${this.baseUrl.replace(/\/$/, '')}/api/v1/dispatch/status/${taskId}`
        try {
            return await this.fetchJson(primary)
        } catch {
            return await this.fetchJson(secondary)
        }
    }

    async nodes(): Promise<any> {
        if (!this.enabled) return { status: 'DISPATCH_DISABLED' }
        const primary = `${this.baseUrl.replace(/\/$/, '')}/dispatch/nodes`
        const secondary = `${this.baseUrl.replace(/\/$/, '')}/api/v1/dispatch/nodes`
        try {
            return await this.fetchJson(primary)
        } catch {
            return await this.fetchJson(secondary)
        }
    }
}

export default DispatchBridge
