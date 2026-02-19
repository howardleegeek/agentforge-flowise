import DispatchBridge from '../../../../src/services/dispatch-bridge'

// Helpers to mock global fetch in Node
const mockFetch = (() => {
    const calls: any[] = []
    const mock = jest.fn(async (...args: any[]) => {
        calls.push(args)
        // default success response
        return {
            ok: true,
            json: async () => ({})
        }
    })
    ;(global as any).fetch = mock
    return { mock, calls }
})()

describe('DispatchBridge (unit tests)', () => {
    const ORIGINAL_DISPATCH_ENABLED = process.env.DISPATCH_ENABLED
    const ORIGINAL_DISPATCH_CONTROLLER_URL = process.env.DISPATCH_CONTROLLER_URL

    afterEach(() => {
        mockFetch.mockReset()
        process.env.DISPATCH_ENABLED = ORIGINAL_DISPATCH_ENABLED as string
        process.env.DISPATCH_CONTROLLER_URL = ORIGINAL_DISPATCH_CONTROLLER_URL as string
    })

    test('disabled when DISPATCH_ENABLED is false', async () => {
        process.env.DISPATCH_ENABLED = 'false'
        process.env.DISPATCH_CONTROLLER_URL = 'http://controller'
        const bridge = new DispatchBridge()
        expect(bridge.isEnabled()).toBe(false)
        const res = await bridge.submit('chatflow-1')
        expect(res).toBeNull()
        expect(mockFetch).not.toHaveBeenCalled()
    })

    test('enabled submit calls controller and returns taskId', async () => {
        process.env.DISPATCH_ENABLED = 'true'
        process.env.DISPATCH_CONTROLLER_URL = 'https://controller'
        // Mock fetch to return a taskId
        mockFetch.mockImplementationOnce(async () => ({ ok: true, json: async () => ({ taskId: 'abc-123' }) }))
        const bridge = new DispatchBridge()
        const result = await bridge.submit('chatflow-1', { hello: 'world' }, 'flow-name')
        expect(result).toEqual({ taskId: 'abc-123' })
        // verify fetch call
        expect((global as any).fetch).toHaveBeenCalled()
        const [url, opts] = (global as any).fetch.mock.calls[0]
        expect(url).toBe('https://controller/submit')
        expect(opts?.method).toBe('POST')
        expect(opts?.body).toBe(JSON.stringify({ chatflowId: 'chatflow-1', input: { hello: 'world' }, flowName: 'flow-name' }))
    })

    test('status and nodes route through getJson', async () => {
        process.env.DISPATCH_ENABLED = 'true'
        process.env.DISPATCH_CONTROLLER_URL = 'https://controller'
        // status
        mockFetch.mockImplementationOnce(async () => ({ ok: true, json: async () => ({ status: 'completed' }) }))
        const bridge = new DispatchBridge()
        const status = await bridge.status('task-1')
        expect(status).toEqual({ status: 'completed' })
        // nodes
        mockFetch.mockImplementationOnce(async () => ({ ok: true, json: async () => ['node1', 'node2'] }))
        const nodes = await bridge.nodes()
        expect(nodes).toEqual(['node1', 'node2'])
    })
})
