import client from './client'

// Dispatch related API wrappers
// Endpoints are expected under /api/v1/dispatch/*

// Get the list of cluster nodes and their statuses
const getNodes = (params) => client.get('/dispatch/nodes', { params })

// Get slots usage information per node (or aggregated)
const getSlots = (params) => client.get('/dispatch/slots', { params })

// Get current dispatch task queue/status counts
const getQueue = (params) => client.get('/dispatch/tasks', { params })

export default {
    getNodes,
    getSlots,
    getQueue
}
