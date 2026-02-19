import React, { useEffect, useState } from 'react'
// Note: This component consumes /api/v1/dispatch/* endpoints to render node status, slots usage, and queue counts.
// Auto-refresh is performed every 10 seconds.
import { Box, Card, CardContent, CardHeader, Grid, Typography, LinearProgress } from '@mui/material'

// API client for dispatch endpoints. Reuses existing api/dispatch module to keep
// a consistent data-fetching surface across the UI.
import apiDispatch from '@/api/dispatch'

type NodeInfo = {
    id?: string
    name?: string
    status?: string
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

    // No manual AbortController; we rely on api client semantics for cancellation if needed
    const fetchData = async () => {
        try {
            setError(null)
            // Nodes
            let normalized: NodeInfo[] = []
            try {
                const nodesResp: any = await apiDispatch.getNodes({})
                const data = nodesResp?.data?.data ?? nodesResp?.data ?? []
                normalized = Array.isArray(data)
                    ? data.map((n) => {
                          const id = (n?.id ?? n?.name ?? '') as string
                          const displayName = n?.name ?? id ?? ''
                          return {
                              id,
                              name: displayName,
                              status: (n?.status ?? 'unknown') as string,
                              slotsUsed: n?.slotsUsed ?? n?.slots ?? 0,
                              slotsTotal: n?.slotsTotal ?? n?.slotsCap ?? 0
                          }
                      })
                    : []
            } catch {
                normalized = []
            }
            // Slots (optional: enrich node data if provided)
            try {
                const slotsResp: any = await apiDispatch.getSlots({})
                const slotsData = slotsResp?.data?.data ?? slotsResp?.data ?? []
                const byNode: Record<string, { used?: number; total?: number }> = {}
                ;(Array.isArray(slotsData) ? slotsData : []).forEach((s) => {
                    const id = s?.nodeId ?? s?.name ?? ''
                    byNode[id] = {
                        used: s?.used ?? 0,
                        total: s?.total ?? 0
                    }
                })
                normalized = normalized.map((n) => {
                    const key = n?.id ?? n?.name ?? ''
                    return {
                        ...n,
                        slotsUsed: byNode[key]?.used ?? n.slotsUsed,
                        slotsTotal: byNode[key]?.total ?? n.slotsTotal
                    }
                })
            } catch {
                // ignore if no slots data
            }
            setNodes(normalized)

            // Tasks summary
            let queueCounts: any = { pending: 0, running: 0, completed: 0 }
            try {
                const queueResp: any = await apiDispatch.getQueue({})
                const data = queueResp?.data?.data ?? queueResp?.data ?? queueResp
                queueCounts = {
                    pending: data?.counts?.pending ?? data?.pending ?? 0,
                    running: data?.counts?.running ?? data?.running ?? 0,
                    completed: data?.counts?.completed ?? data?.completed ?? 0
                }
            } catch {
                queueCounts = { pending: 0, running: 0, completed: 0 }
            }
            setTasks(queueCounts)
        } catch {
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
            {!loading && nodes.length === 0 && (
                <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
                    No nodes found
                </Typography>
            )}
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
                <Grid container spacing={2} aria-label='dispatch-node-grid' role='list'>
                    {nodes.map((n) => (
                        <Grid item xs={12} sm={6} md={4} key={n.id ?? n.name ?? ''} aria-label={`node-${n.id ?? n.name ?? 'unknown'}-card`}>
                            <Card variant='outlined' aria-label={`node-${n.id ?? n.name ?? 'unknown'}-card`}>
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
