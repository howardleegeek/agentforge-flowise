describe('OysterDispatchTask Node', () => {
    const path = require('path')
    // Dynamically require the node class to avoid TS path issues in test env
    const mod = require('../../../../nodes/oysterDispatch/OysterDispatchTask')
    const NodeClass = mod?.nodeClass
    const node: any = NodeClass ? new NodeClass() : null

    test('should initialize with basic metadata', () => {
        expect(node.label).toBe('Oyster Dispatch Task')
        expect(node.name).toBe('oysterDispatchTask')
        expect(node.icon).toBe('oysterDispatchTask.svg')
    })

    test('should have input/output definitions', () => {
        expect(Array.isArray(node.inputs)).toBe(true)
        // 4 inputs as defined (project, priority, estimatedMinutes, nodePreference)
        expect(node.inputs?.length).toBeGreaterThanOrEqual(4)
        const names = (node.inputs || []).map((i: any) => i.name)
        expect(names).toContain('project')
        expect(names).toContain('priority')
        expect(names).toContain('estimatedMinutes')
        expect(names).toContain('nodePreference')
        expect(node.outputs.length).toBeGreaterThanOrEqual(3)
        const outNames = node.outputs.map((o: any) => o.name)
        expect(outNames).toContain('taskId')
        expect(outNames).toContain('status')
        expect(outNames).toContain('result')
    })

  test('init should require project', async () => {
    await expect(node.init({ inputs: {} } as any, '', {} as any)).rejects.toBeTruthy()
  })
})

// Additional tests for Oyster Agent Pool
describe('OysterAgentPool Node (inline tests)', () => {
  const modPool = require('../../../../nodes/oysterMultiAgent/OysterAgentPool')
  const NodePoolClass = modPool?.nodeClass
  const poolNode: any = NodePoolClass ? new NodePoolClass() : null

  test('should initialize pool node metadata', () => {
    expect(poolNode.label).toBe('Oyster Agent Pool')
    expect(poolNode.name).toBe('oysterAgentPool')
    expect(poolNode.icon).toBe('oysterAgentPool.svg')
  })
  test('should have pool inputs and outputs', () => {
    expect(Array.isArray(poolNode.inputs)).toBe(true)
    const names = (poolNode.inputs || []).map((i: any) => i.name)
    expect(names).toContain('maxParallel')
    expect(names).toContain('timeout')
    expect(names).toContain('retryCount')
    expect(poolNode.outputs.length).toBeGreaterThanOrEqual(1)
    const outNames = poolNode.outputs.map((o: any) => o.name)
    expect(outNames).toContain('aggregated_results')
  })
})
})
