import express, { Request, Response } from 'express'
import { DispatchBridge } from '../services/dispatch-bridge'

const router = express.Router()
// Ensure JSON body parsing for these routes
router.use(express.json())

// Submit a workflow to dispatch
router.post('/api/v1/dispatch/submit', async (req: Request, res: Response) => {
    // Rely on the bridge to determine if dispatch is enabled
    if (!(DispatchBridge as any).isEnabled()) {
        return res.json({ ok: true, dispatched: false, reason: 'DISPATCH_DISABLED' })
    }
    const { chatflowId, input } = req.body || {}
    if (!chatflowId) {
        return res.status(400).json({ error: 'chatflowId is required' })
    }
    try {
        const taskId = await (DispatchBridge as any).submitTask(chatflowId, input)
        res.json({ taskId })
    } catch (e: any) {
        res.status(500).json({ error: String(e) })
    }
})

// Check dispatch task status
router.get('/api/v1/dispatch/status/:taskId', async (req: Request, res: Response) => {
    const { taskId } = req.params
    try {
        const status = await (DispatchBridge as any).getStatus(taskId)
        res.json({ taskId, status })
    } catch (e: any) {
        res.status(500).json({ error: String(e) })
    }
})

// List available dispatch nodes
router.get('/api/v1/dispatch/nodes', async (_req: Request, res: Response) => {
    try {
        const nodes = await (DispatchBridge as any).getNodes()
        res.json({ nodes })
    } catch (e: any) {
        res.status(500).json({ error: String(e) })
    }
})

// Callback endpoint for task completion from dispatch controller
router.post('/api/v1/dispatch/callback', (req: Request, res: Response) => {
    const { taskId, status } = req.body || {}
    if (!taskId) {
        return res.status(400).json({ error: 'taskId is required' })
    }
    DispatchBridge.handleCallback({ taskId, status: status ?? 'unknown' })
    res.json({ ok: true })
})

export default router
