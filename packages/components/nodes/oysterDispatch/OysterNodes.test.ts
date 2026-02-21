// Lightweight tests for OysterDispatchTask and OysterAgentPool nodes

// Re-exported classes to test loading and basic behavior
export { OysterDispatchTask } from './OysterDispatchTask'
export { OysterAgentPool } from './OysterAgentPool'

describe('Oyster nodes smoke tests', () => {
    test('OysterDispatchTask basic run', async () => {
        // Import lazily to ensure the module loads without side effects
        const { OysterDispatchTask } = require('./OysterDispatchTask')
        const task = new OysterDispatchTask({ project: 'demo', priority: 1, estimated_minutes: 10, node_preference: 'high' } as any)
        const res = await task.run()
        expect(res).toHaveProperty('task_id')
        expect(res).toHaveProperty('status')
    })

    test('OysterAgentPool basic run', async () => {
        const { OysterAgentPool } = require('./OysterAgentPool')
        const pool = new OysterAgentPool({ max_parallel: 2, timeout: 1000, retry_count: 1 } as any)
        const res = await pool.run()
        expect(res).toHaveProperty('aggregated_results')
    })
})
