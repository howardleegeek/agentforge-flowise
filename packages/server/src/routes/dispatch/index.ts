import express, { Request, Response } from 'express'
import DispatchBridge from '../../services/dispatch-bridge'

const router = express.Router()
const bridge = new DispatchBridge()

// POST /api/v1/dispatch/submit — 提交 workflow 到 dispatch
interface SubmitPayload {
    chatflowId: string
    input?: any
    flowName?: string
}
router.post('/submit', async (req: Request, res: Response) => {
    const { chatflowId, input, flowName } = (req.body as SubmitPayload) || {}
    try {
        if (!bridge.isEnabled()) {
            return res.json({ dispatched: false, reason: 'DISPATCH_DISABLED' })
        }
        if (!chatflowId) {
            return res.status(400).json({ error: 'chatflowId is required' })
        }
        const result = await bridge.submit(chatflowId, input, flowName)
        if (!result) {
            return res.json({ dispatched: false, reason: 'DISPATCH_DISABLED' })
        }
        res.json({ taskId: result.taskId, dispatched: true })
    } catch (err: any) {
        res.status(500).json({ error: err?.message ?? 'dispatch submission error' })
    }
})

// GET /api/v1/dispatch/status/:taskId — 查询任务状态
router.get('/status/:taskId', async (req: Request, res: Response) => {
    const { taskId } = req.params
    try {
        const status = await bridge.status(taskId)
        res.json(status)
    } catch (err: any) {
        res.status(500).json({ error: err?.message ?? 'status retrieval error' })
    }
})

// GET /api/v1/dispatch/nodes — 查看可用节点
router.get('/nodes', async (_req: Request, res: Response) => {
    try {
        const nodes = await bridge.nodes()
        res.json(nodes)
    } catch (err: any) {
        res.status(500).json({ error: err?.message ?? 'nodes retrieval error' })
    }
})

export default router
