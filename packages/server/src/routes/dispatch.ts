import { Router, Request, Response } from 'express'
import dispatchBridge from '../services/dispatch-bridge'

const router = Router()

// POST /api/v1/dispatch/submit
router.post('/submit', async (req: Request, res: Response) => {
    try {
        const { flowId, input } = req.body || {}
        if (!flowId) {
            return res.status(400).json({ error: 'flowId is required' })
        }
        const result = await dispatchBridge.submitTask(flowId, input)
        return res.json({ taskId: result.taskId })
    } catch (err) {
        console.error('[dispatch] submit error', err)
        return res.status(500).json({ error: 'dispatch submit failed' })
    }
})

// GET /api/v1/dispatch/status/:taskId
router.get('/status/:taskId', async (req: Request, res: Response) => {
    const { taskId } = req.params
    try {
        const status = await dispatchBridge.getStatus(taskId)
        return res.json(status)
    } catch (err) {
        console.error('[dispatch] status error', err)
        return res.status(500).json({ error: 'dispatch status failed' })
    }
})

// GET /api/v1/dispatch/nodes
router.get('/nodes', async (_req: Request, res: Response) => {
    try {
        const nodes = await dispatchBridge.getNodes()
        return res.json(nodes)
    } catch (err) {
        console.error('[dispatch] nodes error', err)
        return res.status(500).json({ error: 'dispatch nodes failed' })
    }
})

export default router
