import express from 'express'
import request from 'supertest'
import dispatchRouter from '../../packages/server/src/routes/dispatch'

describe('Oyster Dispatch Bridge - API', () => {
    let controllerServer: any
    let controllerUrl: string = ''

    beforeAll((done) => {
        // Spin up a minimal mock Dispatch controller
        const app = express()
        app.use(express.json())
        app.post('/submit', (req, res) => {
            res.json({ taskId: 'task-123' })
        })
        app.get('/status/:taskId', (req, res) => {
            res.json({ taskId: req.params.taskId, status: 'running' })
        })
        app.get('/nodes', (req, res) => {
            res.json({ nodes: ['node-A', 'node-B'] })
        })
        controllerServer = app.listen(0, () => {
            const addr: any = controllerServer.address()
            const port = addr?.port ?? 0
            controllerUrl = `http://127.0.0.1:${port}`
            process.env.DISPATCH_ENABLED = 'true'
            process.env.DISPATCH_CONTROLLER_URL = controllerUrl
            // Allow some time for async bootstrap in real app if needed
            done()
        })
    })

    afterAll(() => {
        try {
            controllerServer && controllerServer.close()
        } catch {
            // ignore
        }
    })

    test('POST /api/v1/dispatch/submit submits to controller and returns taskId', async () => {
        const app = express()
        app.use('/api/v1', dispatchRouter)
        app.use(express.json())
        const res = await request(app)
            .post('/api/v1/dispatch/submit')
            .send({ chatflowId: 'cf-1', input: { a: 1 } })
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('taskId')
        expect(res.body.dispatched).toBe(true)
    })

    test('GET /api/v1/dispatch/status/:taskId returns status from controller', async () => {
        const app = express()
        app.use('/api/v1', dispatchRouter)
        app.use(express.json())
        const res = await request(app).get('/api/v1/dispatch/status/task-123')
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('status', 'running')
    })

    test('GET /api/v1/dispatch/nodes returns nodes list', async () => {
        const app = express()
        app.use('/api/v1', dispatchRouter)
        app.use(express.json())
        const res = await request(app).get('/api/v1/dispatch/nodes')
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('nodes')
        expect(Array.isArray(res.body.nodes)).toBe(true)
    })
})

describe('Oyster Dispatch Bridge - Disabled', () => {
    beforeAll(() => {
        process.env.DISPATCH_ENABLED = 'false'
    })

    test('POST /api/v1/dispatch/submit is skipped when disabled', async () => {
        const app = express()
        app.use('/api/v1', dispatchRouter)
        app.use(express.json())
        const res = await request(app).post('/api/v1/dispatch/submit').send({ chatflowId: 'cf-2', input: {} })
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('dispatched', false)
        expect(res.body).toHaveProperty('reason', 'DISPATCH_DISABLED')
    })

    test('GET /api/v1/dispatch/status/:taskId is skipped when disabled', async () => {
        const app = express()
        app.use('/api/v1', dispatchRouter)
        app.use(express.json())
        const res = await request(app).get('/api/v1/dispatch/status/some-id')
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('skipped', true)
        expect(res.body).toHaveProperty('reason', 'DISPATCH_DISABLED')
    })

    test('GET /api/v1/dispatch/nodes is skipped when disabled', async () => {
        const app = express()
        app.use('/api/v1', dispatchRouter)
        app.use(express.json())
        const res = await request(app).get('/api/v1/dispatch/nodes')
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('nodes')
        expect(res.body).toHaveProperty('skipped', true)
    })
})
