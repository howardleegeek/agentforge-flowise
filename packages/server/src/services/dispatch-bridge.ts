// Oyster Dispatch bridge for AgentForge server
// Bridges Flowise chatflow execution to a Dispatch controller over HTTP
// This bridge is optional and controlled by DISPATCH_ENABLED in the environment
// and DISPATCH_CONTROLLER_URL pointing to the controller.

// Lightweight typing to avoid TS lib issues with global fetch in Node environments
declare const fetch: any

type CallbackPayload = { taskId: string; status?: string }

export class DispatchBridge {
    // Determine if the dispatch bridge is enabled via env var
    static isEnabled(): boolean {
        const v = process.env.DISPATCH_ENABLED
        return v === 'true' || v === '1'
    }

    // Submit a chatflow/task to the dispatch controller
    static async submitTask(chatflowId: string, input?: any): Promise<string> {
        if (!this.isEnabled()) return ''
        const controllerUrl = process.env.DISPATCH_CONTROLLER_URL
        if (!controllerUrl) {
            throw new Error('DISPATCH_CONTROLLER_URL is not configured')
        }
        const url = controllerUrl.replace(/\/+$/, '') + '/submit'
        const payload: any = {
            chatflowId,
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
        return data?.taskId ?? ''
    }

    // Query status for a given taskId from the dispatch controller
    static async getStatus(taskId: string): Promise<any> {
        if (!this.isEnabled()) return { status: 'DISABLED' }
        const controllerUrl = process.env.DISPATCH_CONTROLLER_URL
        if (!controllerUrl) {
            throw new Error('DISPATCH_CONTROLLER_URL is not configured')
        }
        const url = controllerUrl.replace(/\/+$/, '') + '/status/' + encodeURIComponent(taskId)
        const res = await fetch(url, { method: 'GET' })
        if (!res.ok) {
            const text = await res.text()
            throw new Error(`Dispatch status failed: ${res.status} ${text}`)
        }
        const data = await res.json()
        return data
    }

    // List available nodes from the dispatch controller
    static async getNodes(): Promise<any> {
        if (!this.isEnabled()) return []
        const controllerUrl = process.env.DISPATCH_CONTROLLER_URL
        if (!controllerUrl) {
            throw new Error('DISPATCH_CONTROLLER_URL is not configured')
        }
        const url = controllerUrl.replace(/\/+$/, '') + '/nodes'
        const res = await fetch(url, { method: 'GET' })
        if (!res.ok) {
            const text = await res.text()
            throw new Error(`Dispatch nodes fetch failed: ${res.status} ${text}`)
        }
        const data = await res.json()
        // Normalize to an array if the controller wraps nodes
        return data?.nodes ?? data
    }

    // Callback from the controller when a task completes
    static handleCallback(payload: CallbackPayload): void {
        const { taskId, status } = payload
        // Persist the callback in-memory for potential ingestion by Flowise later
        this._callbacks.set(taskId, status ?? 'unknown')
        // Note: In a real integration, you would propagate this back to the flow engine
        // Here we simply store and log for visibility
        try {
            // eslint-disable-next-line no-console
            console.log(`Dispatch bridge callback received: taskId=${taskId}, status=${status}`)
        } catch {
            // ignore logging failures
        }
    }

    // Internal in-memory store for callback statuses
    private static _callbacks: Map<string, string> = new Map()
}

export default DispatchBridge
