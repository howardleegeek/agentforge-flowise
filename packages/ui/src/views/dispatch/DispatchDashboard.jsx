import React, { useEffect, useMemo, useState } from 'react'

// material-ui
import { Box, Grid, Card, CardContent, Typography, Chip, Avatar, CircularProgress } from '@mui/material'

// project imports
import MainCard from '@/ui-component/cards/MainCard'
import dispatchApi from '@/api/dispatch'
import useApi from '@/hooks/useApi'
import { gridSpacing } from '@/store/constant'

// Simple Dispatch dashboard showing cluster nodes, slots usage and task queue
const DispatchDashboard = () => {
    // Fetch data via existing API wrappers and useApi hook
    const nodesApi = useApi(dispatchApi.getNodes)
    const slotsApi = useApi(dispatchApi.getSlots)
    const queueApi = useApi(dispatchApi.getQueue)

    // Local state for slots mapping and refresh interval
    const [refreshTick, setRefreshTick] = useState(0)

    useEffect(() => {
        // Initial fetch
        nodesApi.request()
        slotsApi.request()
        queueApi.request()
        // Auto refresh every 10 seconds
        const t = setInterval(() => {
            nodesApi.request()
            slotsApi.request()
            queueApi.request()
            setRefreshTick((r) => r + 1)
        }, 10000)
        return () => clearInterval(t)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Derive slots per node, handling flexible shapes from API
    const slotsList = slotsApi.data?.data?.slots || slotsApi.data?.data?.slots || []
    const slotsMap = useMemo(() => {
        const map = new Map()
        if (Array.isArray(slotsList)) {
            slotsList.forEach((s) => {
                if (s?.nodeId) map.set(s.nodeId, s)
            })
        } else if (slotsList && typeof slotsList === 'object') {
            // object keyed by nodeId
            Object.entries(slotsList).forEach(([k, v]) => {
                map.set(k, v)
            })
        }
        return map
    }, [slotsList])

    const nodes = nodesApi.data?.data?.nodes ?? nodesApi.data?.data ?? []
    const queueCounts = queueApi.data?.data ?? {}

    return (
        <MainCard title='Dispatch Dashboard'>
            <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                <Typography variant='h6'>Cluster Overview</Typography>
                {queueApi.loading && <CircularProgress size={16} />}
                {!queueApi.loading && (
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Chip label={`Pending: ${queueCounts.pending ?? 0}`} color='primary' size='small' />
                        <Chip label={`Running: ${queueCounts.running ?? 0}`} color='info' size='small' />
                        <Chip label={`Completed: ${queueCounts.completed ?? 0}`} color='success' size='small' />
                    </Box>
                )}
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: gridSpacing }}>
                {nodes.map((n) => {
                    const slotInfo = slotsMap.get(n.id) || {}
                    const used = slotInfo?.used ?? 0
                    const total = slotInfo?.total ?? slotInfo?.slots ?? 0
                    const slotsDisplay = total > 0 ? `${used}/${total}` : 'N/A'
                    const status = n?.status ?? 'unknown'
                    const name = n?.name ?? n?.id ?? 'Node'

                    return (
                        <Card key={n.id ?? name} variant='outlined' sx={{ height: 140 }}>
                            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1, height: '100%' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                                        {name}
                                    </Typography>
                                    <Chip label={status} size='small' color={status === 'online' ? 'success' : 'default'} />
                                </Box>
                                <Typography variant='body2' color='text.secondary'>
                                    Slots: {slotsDisplay}
                                </Typography>
                                <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Avatar sx={{ width: 24, height: 24 }}>N</Avatar>
                                    <Typography variant='caption' color='text.secondary'>
                                        Node ID: {n.id ?? 'unknown'}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    )
                })}
            </Box>
        </MainCard>
    )
}

export default DispatchDashboard
