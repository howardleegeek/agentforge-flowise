// Lightweight Dispatch Bridge for optional Oyster Dispatch integration
// Reads env: DISPATCH_ENABLED (true/1 to enable) and DISPATCH_CONTROLLER_URL
// Provides a small API surface consumed by the existing v1 API routes.

// Avoid TS errors if DOM lib is not included for fetch symbol
declare const fetch: any
const ENABLED = process.env.DISPATCH_ENABLED === 'true' || process.env.DISPATCH_ENABLED === '1'
const CONTROLLER_URL = process.env.DISPATCH_CONTROLLER_URL

type Json = any

async function fetchJson(url: string, options?: RequestInit): Promise<Json> {
    const res = await fetch(url, options)
    if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(`Dispatch bridge request failed ${res.status}: ${text}`)
    }
    // Some endpoints may not return JSON; guard defensively.
    try {
        return await res.json()
    } catch {
        return {}
    }
}

// Public bridge object used by routes
const dispatchBridge = {
    async submitTask(flowId: string, input: any) {
        if (!ENABLED || !CONTROLLER_URL) {
            return { taskId: '' }
        }
        const body = await fetchJson(`${CONTROLLER_URL}/dispatch/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ flowId, input })
        })
        return { taskId: body?.taskId ?? '' }
    },
    async getStatus(taskId: string) {
        if (!ENABLED || !CONTROLLER_URL) {
            return { status: 'skipped' as const }
        }
        const resp = await fetchJson(`${CONTROLLER_URL}/dispatch/status/${taskId}`)
        return resp as any
    },
    async getNodes() {
        if (!ENABLED || !CONTROLLER_URL) {
            return { nodes: [] } as any
        }
        const resp = await fetchJson(`${CONTROLLER_URL}/dispatch/nodes`)
        return resp as any
    }
}

export default dispatchBridge
export { dispatchBridge }
export async function submitTask(flowId: string, input: any) {
    return dispatchBridge.submitTask(flowId, input)
}
export async function getStatus(taskId: string) {
    return dispatchBridge.getStatus(taskId)
}
export async function getNodes() {
    return dispatchBridge.getNodes()
}
