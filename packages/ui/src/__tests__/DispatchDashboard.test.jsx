import React from 'react'
import { render, screen } from '@testing-library/react'
import DispatchDashboard from '../views/dispatch'

// Mock the API layer and the useApi hook to provide predictable data
jest.mock('../hooks/useApi', () => {
    return () => ({
        data: { data: [{ id: 'node1', name: 'node-1', status: 'online', slots: 2 }] },
        loading: false,
        error: null,
        request: jest.fn()
    })
})

jest.mock('../api/dispatch', () => ({
    getNodes: jest.fn(() => Promise.resolve({ data: { data: [{ id: 'node1', name: 'node-1', status: 'online', slots: 2 }] } })),
    getSlots: jest.fn(() => Promise.resolve({ data: { data: [{ nodeId: 'node1', used: 1, total: 2 }] } })),
    getQueue: jest.fn(() => Promise.resolve({ data: { data: { pending: 1, running: 0, completed: 0 } } }))
}))

test('renders at least one node card when data is available', async () => {
    render(<DispatchDashboard />)
    // Node name should appear
    const nodeName = await screen.findByText(/node-1/i)
    expect(nodeName).toBeInTheDocument()
})
