import React, { useEffect, useState, useRef } from 'react'
// Note: This component consumes /api/v1/dispatch/* endpoints to render node status, slots usage, and queue counts.
// Auto-refresh is performed every 10 seconds.
import { Box, Card, CardContent, CardHeader, Grid, Typography, LinearProgress } from '@mui/material'

type NodeInfo = {
    name: string
    status: string
    slotsUsed?: number
    slotsTotal?: number
}

type TasksSummary = {
    pending?: number
    running?: number
    completed?: number
}

/**
 * DispatchDashboard
 * Shows cluster nodes, slots usage and task queue counts.
 * - Fetches data from /api/v1/dispatch/* endpoints
 * - Auto refresh every 10s
 */
const DispatchDashboard: React.FC = () => {
    const [nodes, setNodes] = useState<NodeInfo[]>([])
    const [tasks, setTasks] = useState<TasksSummary>({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [lastUpdated, setLastUpdated] = useState<string | null>(null)
    // Abort controller to cancel in-flight fetches on unmount
    const abortCtrl = useRef<AbortController | null>(null)

    const fetchData = async () => {
        // cancel any in-flight requests from a previous interval
        abortCtrl.current?.abort()
        abortCtrl.current = new AbortController()
        const signal = abortCtrl.current.signal
        try {
            setError(null)
            // Nodes
            const nodesResp = await fetch('/api/v1/dispatch/nodes', { signal })
            if (nodesResp.ok) {
                const data = await nodesResp.json()
                // Normalize to NodeInfo[]; tolerate different shapes
                const normalized: NodeInfo[] = Array.isArray(data)
                    ? data.map((n) => ({
                          name: (n?.name ?? '') as string,
                          status: (n?.status ?? 'unknown') as string,
                          slotsUsed: n?.slotsUsed ?? n?.slots ?? 0,
                          slotsTotal: n?.slotsTotal ?? n?.slotsCap ?? 0
                      }))
                    : []
                setNodes(normalized)
            }

            // Tasks summary
            const tasksResp = await fetch('/api/v1/dispatch/tasks', { signal })
            if (tasksResp.ok) {
                const data = await tasksResp.json()
                // Expecting { pending, running, completed }
                setTasks({
                    pending: data?.pending ?? 0,
                    running: data?.running ?? 0,
                    completed: data?.completed ?? 0
                })
            }
        } catch (e) {
            setError('Failed to fetch dispatch data')
        } finally {
            setLoading(false)
            setLastUpdated(new Date().toLocaleTimeString())
        }
    }

    useEffect(() => {
        fetchData()
        const t = setInterval(fetchData, 10000)
        return () => {
            clearInterval(t)
            abortCtrl.current?.abort()
        }
    }, [])

    const totalSlots = (n: NodeInfo) => n.slotsTotal ?? 0
    const usedPct = (n: NodeInfo) => {
        const total = totalSlots(n)
        const used = n.slotsUsed ?? 0
        return total > 0 ? Math.round((used / total) * 100) : 0
    }

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant='h5' gutterBottom>
                Dispatch Dashboard
            </Typography>
            {lastUpdated && (
                <Typography variant='caption' display='block' sx={{ mb: 2 }}>
                    Last updated: {lastUpdated}
                </Typography>
            )}

            {loading && <Typography variant='body2'>Loading...</Typography>}
            {error && (
                <Typography variant='body2' color='error'>
                    {error}
                </Typography>
            )}

            <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={4} md={4}>
                    <Card>
                        <CardHeader title='Pending' />
                        <CardContent>
                            <Typography variant='h6'>{tasks.pending ?? 0}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4} md={4}>
                    <Card>
                        <CardHeader title='Running' />
                        <CardContent>
                            <Typography variant='h6'>{tasks.running ?? 0}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4} md={4}>
                    <Card>
                        <CardHeader title='Completed' />
                        <CardContent>
                            <Typography variant='h6'>{tasks.completed ?? 0}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                    {nodes.map((n) => (
                        <Grid item xs={12} sm={6} md={4} key={n.name}>
                            <Card variant='outlined'>
                                {/* Provide fallbacks for missing data to improve resilience */}
                                <CardHeader title={n.name || 'Unknown Node'} subheader={n.status || 'unknown'} />
                                <CardContent>
                                    <Typography variant='body2' gutterBottom>
                                        Slots: {n.slotsUsed ?? 0}/{n.slotsTotal ?? 0}
                                    </Typography>
                                    <LinearProgress variant='determinate' value={usedPct(n)} />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    )
}

export default DispatchDashboard
