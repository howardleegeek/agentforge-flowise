import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'

// Production component under test
import DispatchDashboard from '../index.jsx'

// Mocks for heavy UI components and modules used by DispatchDashboard
jest.mock('../../../../api/dispatch', () => ({
    getNodes: jest.fn(() => Promise.resolve({ data: { data: [{ id: 'n1', name: 'node-1', status: 'online' }] } })),
    getSlots: jest.fn(() => Promise.resolve({ data: { data: [{ nodeId: 'n1', used: 1, total: 4 }] } })),
    getQueue: jest.fn(() => Promise.resolve({ data: { data: { counts: { pending: 2, running: 1, completed: 5 } } } }))
}))

jest.mock('../../../../layout/MainLayout/ViewHeader', () => {
    return function ViewHeaderMock({ children }) {
        return <div data-testid='view-header'>{children}</div>
    }
})

jest.mock('../../../../ui-component/cards/MainCard', () => {
    return function MainCardMock({ children }) {
        return <div data-testid='main-card'>{children}</div>
    }
})

jest.mock('../../../../store/context/ErrorContext', () => ({
    useError: () => ({ error: false })
}))

describe('DispatchDashboard', () => {
    test('renders node cards and queue summary from API', async () => {
        render(<DispatchDashboard />)

        // Expect the mocked node name to appear
        await waitFor(() => {
            expect(screen.getByText('node-1')).toBeInTheDocument()
        })

        // Check queue counts are displayed
        expect(screen.getByText(/Pending:/)).toBeInTheDocument()
        expect(screen.getByText(/Running:/)).toBeInTheDocument()
        expect(screen.getByText(/Completed:/)).toBeInTheDocument()
    })
})

test('auto refresh fetches data every 10s', async () => {
    jest.useFakeTimers()
    const apiMock = require('../../../../api/dispatch')
    apiMock.getNodes.mockClear()
    render(<DispatchDashboard />)

    // wait for initial fetch
    await waitFor(() => expect(apiMock.getNodes).toHaveBeenCalled())

    // advance timer by 10 seconds
    act(() => {
        jest.advanceTimersByTime(10000)
    })

    // allow any pending promises to flush
    await waitFor(() => expect(apiMock.getNodes).toHaveBeenCalledTimes(2))

    jest.useRealTimers()
})
