// AF04: Dispatch control panel - pre-implemented UI with auto-refresh
// Note: This component renders DispatchDashboard which displays cluster nodes,
// slots usage, and task queue by consuming /api/v1/dispatch/* endpoints.
import React, { useEffect, useState, useMemo } from 'react'
import { Box, Grid, Card, CardContent, Typography, LinearProgress, Skeleton } from '@mui/material'
import MainCard from '@/ui-component/cards/MainCard'
import ViewHeader from '@/layout/MainLayout/ViewHeader'
import { gridSpacing } from '@/store/constant'
import dispatchApi from '@/api/dispatch'
import { useError } from '@/store/context/ErrorContext'

// Simple Dispatch Dashboard: show nodes, slots usage and task queue
// NOTE: UI auto-refreshes data every 10 seconds (see REFRESH_INTERVAL_MS)
// This DispatchDashboard is implemented per Task AF04: shows cluster nodes, slots usage, and task queue
// Data is fetched from /api/v1/dispatch/* endpoints and auto-refreshed every 10s
export const DispatchDashboard = () => {
    // refresh interval in ms
    const REFRESH_INTERVAL_MS = 10000
    const { error } = useError()
    const [nodes, setNodes] = useState([])
    const [slots, setSlots] = useState([])
    const [queue, setQueue] = useState({ pending: 0, running: 0, completed: 0 })
    const [loading, setLoading] = useState(true)

    // Fetch data from API
    const fetchData = async () => {
        try {
            const [nodesRes, slotsRes, queueRes] = await Promise.all([
                dispatchApi.getNodes(),
                dispatchApi.getSlots(),
                dispatchApi.getQueue()
            ])
            setNodes(nodesRes?.data?.data || [])
            setSlots(slotsRes?.data?.data || [])
            // Normalize queue data: support different possible shapes for robustness
            // Some APIs may return counts under data.counts, others under data.data.counts, etc.
            const rawCounts = queueRes?.data?.data?.counts ?? queueRes?.data?.counts ?? {}
            setQueue({
                pending: rawCounts?.pending ?? 0,
                running: rawCounts?.running ?? 0,
                completed: rawCounts?.completed ?? 0
            })
            setLoading(false)
        } catch (e) {
            // swallow; error context may handle
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
        const t = setInterval(fetchData, REFRESH_INTERVAL_MS)
        return () => clearInterval(t)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const totalNodes = useMemo(() => nodes.length, [nodes])

    return (
        <MainCard>
            {error ? (
                <div />
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <ViewHeader title='Dispatch' description='Cluster nodes, slots usage, and task queue' />
                    <Grid container spacing={gridSpacing}>
                        {loading &&
                            Array.from({ length: 3 }).map((_, idx) => (
                                <Grid item xs={12} md={4} key={idx}>
                                    <Skeleton variant='rounded' height={120} />
                                </Grid>
                            ))}
                        {!loading &&
                            nodes.map((node) => {
                                const slotInfo = slots.find((s) => s.nodeId === node.id) || { used: 0, total: 1 }
                                const usage = Math.min(100, Math.max(0, ((slotInfo?.used || 0) / (slotInfo?.total || 1)) * 100))
                                return (
                                    <Grid item xs={12} sm={6} md={4} key={node.id}>
                                        <Card variant='outlined' aria-label={`Node ${node.name || node.id}`}>
                                            <CardContent>
                                                <Typography variant='subtitle1'>{node.name || node.id}</Typography>
                                                <Typography variant='body2' color='text.secondary'>
                                                    Status: {node.status || 'unknown'}
                                                </Typography>
                                                <Box sx={{ mt: 1 }}>
                                                    <Typography variant='caption' color='text.secondary'>
                                                        Slots usage
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                                        <LinearProgress variant='determinate' value={usage} sx={{ width: '100%' }} />
                                                        <Box minWidth={40}>
                                                            <Typography variant='caption'>{Math.round(usage)}%</Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )
                            })}
                    </Grid>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                        <Typography variant='subtitle2'>Tasks</Typography>
                        <Box component='span' sx={{ background: '#f5f5f5', px: 2, py: 1, borderRadius: 2 }}>
                            Pending: {queue.pending}
                        </Box>
                        <Box component='span' sx={{ background: '#f5f5f5', px: 2, py: 1, borderRadius: 2 }}>
                            Running: {queue.running}
                        </Box>
                        <Box component='span' sx={{ background: '#f5f5f5', px: 2, py: 1, borderRadius: 2 }}>
                            Completed: {queue.completed}
                        </Box>
                        <Box sx={{ flex: 1 }} />
                        <Box>
                            <Typography variant='caption' color='text.secondary'>
                                Nodes: {totalNodes}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            )}
        </MainCard>
    )
}

export default DispatchDashboard
