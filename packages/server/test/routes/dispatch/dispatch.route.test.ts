import { StatusCodes } from 'http-status-codes'
import supertest from 'supertest'
import { getRunningExpressApp } from '../../../src/utils/getRunningExpressApp'

export function dispatchRouteTest() {
    describe('Dispatch Routes', () => {
        const base = '/api/v1/dispatch'

        afterEach(() => {
            // Restore any mocks between tests
            if (typeof (global as any).fetch === 'function') {
                ;(global as any).fetch.mockRestore?.()
            }
            // Clean env flags after each test to avoid leakage
            delete process.env.DISPATCH_ENABLED
            delete process.env.DISPATCH_CONTROLLER_URL
        })

        test('POST /submit when dispatch is disabled', async () => {
            process.env.DISPATCH_ENABLED = 'false'
            const res = await supertest(getRunningExpressApp().app)
                .post(`${base}/submit`)
                .send({ chatflowId: 'flow1' })
                .set('Accept', 'application/json')
                .expect(StatusCodes.OK)

            expect(res.body).toEqual({ dispatched: false, reason: 'DISPATCH_DISABLED' })
        })

        test('POST /submit when enabled forwards to controller', async () => {
            process.env.DISPATCH_ENABLED = 'true'
            process.env.DISPATCH_CONTROLLER_URL = 'http://mock-controller'

            const mock = {
                ok: true,
                json: async () => ({ taskId: 't-123' })
            } as any
            jest.spyOn(global, 'fetch').mockResolvedValue(mock)

            const res = await supertest(getRunningExpressApp().app)
                .post(`${base}/submit`)
                .send({ chatflowId: 'flow1', input: { a: 1 } })
                .set('Accept', 'application/json')
                .expect(StatusCodes.OK)

            expect(res.body).toEqual({ taskId: 't-123', dispatched: true })
            ;(global as any).fetch.mockRestore()
        })

        test('GET /status/:taskId forwards to controller when enabled', async () => {
            process.env.DISPATCH_ENABLED = 'true'
            process.env.DISPATCH_CONTROLLER_URL = 'http://mock-controller'

            const mock = {
                ok: true,
                json: async () => ({ status: 'completed' })
            } as any
            jest.spyOn(global, 'fetch').mockResolvedValue(mock)

            const res = await supertest(getRunningExpressApp().app)
                .get(`${base}/status/t-abc`)
                .set('Accept', 'application/json')
                .expect(StatusCodes.OK)

            expect(res.body).toHaveProperty('status')
            ;(global as any).fetch.mockRestore()
        })

        test('GET /nodes returns nodes from controller when enabled', async () => {
            process.env.DISPATCH_ENABLED = 'true'
            process.env.DISPATCH_CONTROLLER_URL = 'http://mock-controller'

            const mock = {
                ok: true,
                json: async () => ({ nodes: ['nodeA', 'nodeB'] })
            } as any
            jest.spyOn(global, 'fetch').mockResolvedValue(mock)

            const res = await supertest(getRunningExpressApp().app)
                .get(`${base}/nodes`)
                .set('Accept', 'application/json')
                .expect(StatusCodes.OK)

            expect(res.body).toHaveProperty('nodes')
            expect(res.body.nodes).toEqual(['nodeA', 'nodeB'])
            ;(global as any).fetch.mockRestore()
        })
    })
}
