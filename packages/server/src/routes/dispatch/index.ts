import express, { Request, Response } from 'express'
import { DispatchBridge } from '../../services/dispatch-bridge'

const router = express.Router()

// Ensure JSON body parsing for these routes
router.use(express.json())

// POST /api/v1/dispatch/submit — 提交 workflow 到 dispatch
interface SubmitPayload {
    chatflowId: string
    input?: any
    flowName?: string
}
router.post('/submit', async (req: Request, res: Response) => {
    const { chatflowId, input, flowName } = (req.body as SubmitPayload) || {}
    try {
        if (!DispatchBridge.isEnabled()) {
            return res.json({ dispatched: false, reason: 'DISPATCH_DISABLED' })
        }
        if (!chatflowId) {
            return res.status(400).json({ error: 'chatflowId is required' })
        }
        const result = await DispatchBridge.submitTask(chatflowId, input)
        // Lightweight debug log to aid tracing dispatch submissions
        if (result && typeof result === 'object' && 'taskId' in result) {
            // eslint-disable-next-line no-console
            console.debug(`Dispatch bridge submitted, taskId=${(result as any).taskId}`)
        } else {
            // eslint-disable-next-line no-console
            console.debug(`Dispatch bridge submission skipped or returned non-structured result:`, result)
        }
        if (!result) {
            return res.json({ dispatched: false, reason: 'DISPATCH_DISABLED' })
        }
        res.json({ taskId: result, dispatched: true })
    } catch (err: any) {
        res.status(500).json({ error: err?.message ?? 'dispatch submission error' })
    }
})

// GET /api/v1/dispatch/status/:taskId — 查询任务状态
router.get('/status/:taskId', async (req: Request, res: Response) => {
    const { taskId } = req.params
    try {
        // If dispatch bridge is disabled, skip and return a clear indicator
        if (!DispatchBridge.isEnabled()) {
            return res.json({ skipped: true, reason: 'DISPATCH_DISABLED' })
        }
        const status = await DispatchBridge.getStatus(taskId)
        res.json(status)
    } catch (err: any) {
        res.status(500).json({ error: err?.message ?? 'status retrieval error' })
    }
})

// POST /api/v1/dispatch/callback — 由 controller 回调更新任务状态
router.post('/callback', (req: Request, res: Response) => {
    const payload = req.body as { taskId?: string; status?: string }
    try {
        DispatchBridge.handleCallback(payload as any)
        res.json({ ok: true })
    } catch (err: any) {
        res.status(500).json({ error: err?.message ?? 'callback handling error' })
    }
})

// GET /api/v1/dispatch/nodes — 查看可用节点
router.get('/nodes', async (_req: Request, res: Response) => {
    try {
        // If dispatch bridge is disabled, skip and return a clear indicator
        if (!DispatchBridge.isEnabled()) {
            return res.json({ skipped: true, reason: 'DISPATCH_DISABLED', nodes: [] })
        }
        const nodes = await DispatchBridge.getNodes()
        res.json({ nodes })
    } catch (err: any) {
        res.status(500).json({ error: err?.message ?? 'nodes retrieval error' })
    }
})

export default router
