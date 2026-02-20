import React, { useEffect } from 'react'
import { Box, Card, CardContent, Grid, Typography, LinearProgress } from '@mui/material'

// API helpers
import useApi from '@/hooks/useApi'
import dispatchApi from '@/api/dispatch'

// ==============================|| Dispatch Dashboard ||============================== //

/**
 * Dispatch dashboard page
 * - Displays cluster nodes, per-node slots usage, and dispatch queue counts
 * - Auto-refresh every 10 seconds
 */
const DispatchDashboard = () => {
    // API hooks
    const nodesApi = useApi(dispatchApi.getNodes)
    const slotsApi = useApi(dispatchApi.getSlots)
    const queueApi = useApi(dispatchApi.getQueue)

    // Initial fetch
    useEffect(() => {
        nodesApi.request()
        slotsApi.request()
        queueApi.request()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Auto refresh every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            nodesApi.request()
            slotsApi.request()
            queueApi.request()
        }, 10000)
        return () => clearInterval(interval)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const nodes = nodesApi.data?.data || []
    const slots = slotsApi.data?.data || []
    const queue = queueApi.data?.data ?? { pending: 0, running: 0, completed: 0 }

    // Build a map of nodeId -> slots info
    const slotsByNode = React.useMemo(() => {
        const map = {}(slots || []).forEach((s) => {
            map[s.nodeId] = { used: s.used ?? 0, total: s.total ?? 0 }
        })
        return map
    }, [slotsApi.data])

    return (
        <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
                {nodes.map((node) => {
                    const s = slotsByNode[node.id] || { used: 0, total: 0 }
                    const total = s.total || 0
                    const used = s.used || 0
                    const usage = total > 0 ? Math.round((used / total) * 100) : 0
                    return (
                        <Grid item xs={12} sm={6} md={4} key={node.id}>
                            <Card variant='outlined'>
                                <CardContent>
                                    <Typography variant='h6' component='div'>
                                        {node.name}
                                    </Typography>
                                    <Typography variant='body2' color='text.secondary'>
                                        Status: {node.status}
                                    </Typography>
                                    <Box sx={{ mt: 1 }}>
                                        <Typography variant='body2' color='text.secondary'>
                                            Slots: {used}/{total}
                                        </Typography>
                                        <Box sx={{ mt: 1 }}>
                                            <LinearProgress variant='determinate' value={usage} />
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    )
                })}
            </Grid>
            <Box sx={{ mt: 2 }}>
                <Typography variant='body2' color='text.secondary'>
                    Pending: {queue?.pending ?? 0}, Running: {queue?.running ?? 0}, Completed: {queue?.completed ?? 0}
                </Typography>
            </Box>
        </Box>
    )
}

export default DispatchDashboard
