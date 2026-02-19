import express, { Request, Response } from 'express'
import { DispatchBridge } from '../services/dispatch-bridge'

const router = express.Router()
// Ensure JSON body parsing for these routes
router.use(express.json())

// Submit a workflow to dispatch
router.post('/submit', async (req: Request, res: Response) => {
    const { chatflowId, input } = req.body || {}
    if (!chatflowId) {
        return res.status(400).json({ error: 'chatflowId is required' })
    }
    if (!DispatchBridge.isEnabled()) {
        return res.json({ dispatched: false, reason: 'DISPATCH_DISABLED' })
    }
    try {
        const result = await DispatchBridge.submitTask(chatflowId, input)
        if (typeof result === 'string') {
            return res.json({ dispatched: false, reason: 'DISPATCH_DISABLED' })
        }
        res.json({ taskId: result.taskId, dispatched: true })
    } catch (e: any) {
        res.status(500).json({ error: String(e) })
    }
})

// Check dispatch task status
router.get('/status/:taskId', async (req: Request, res: Response) => {
    const { taskId } = req.params
    if (!DispatchBridge.isEnabled()) {
        return res.json({ taskId, skipped: true, reason: 'DISPATCH_DISABLED' })
    }
    try {
        const status = await DispatchBridge.getStatus(taskId)
        res.json({ taskId, status })
    } catch (e: any) {
        res.status(500).json({ error: String(e) })
    }
})

// List available dispatch nodes
router.get('/nodes', async (_req: Request, res: Response) => {
    if (!DispatchBridge.isEnabled()) {
        return res.json({ nodes: [], skipped: true, reason: 'DISPATCH_DISABLED' })
    }
    try {
        const nodes = await DispatchBridge.getNodes()
        res.json({ nodes })
    } catch (e: any) {
        res.status(500).json({ error: String(e) })
    }
})

// Callback endpoint for task completion from dispatch controller
router.post('/callback', (req: Request, res: Response) => {
    const { taskId, status } = req.body || {}
    if (!taskId) {
        return res.status(400).json({ error: 'taskId is required' })
    }
    DispatchBridge.handleCallback({ taskId, status: status ?? 'unknown' })
    res.json({ ok: true })
})

export default router
