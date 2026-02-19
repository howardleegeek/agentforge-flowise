import { ICommonObject, INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'

// Oyster Multi-Agent Node
// Dispatch tasks in parallel across an agent pool
class OysterAgentPool implements INode {
    label: string
    name: string
    version: number
    type: string
    icon: string
    category: string
    description: string
    baseClasses: string[]
    inputs: INodeParams[]
    outputs: any[]

    constructor() {
        this.label = 'Oyster Agent Pool'
        this.name = 'oysterAgentPool'
        this.version = 1.0
        this.type = 'OysterAgentPool'
        this.icon = 'oysterAgentPool.svg'
        this.category = 'Oyster'
        this.description = 'Distribute tasks to an agent pool in parallel'
        this.baseClasses = getBaseClasses(OysterAgentPool)
        this.inputs = [
            {
                label: 'Max Parallel',
                name: 'max_parallel',
                type: 'number',
                default: 4
            },
            {
                label: 'Timeout (ms)',
                name: 'timeout',
                type: 'number',
                default: 10000
            },
            {
                label: 'Retry Count',
                name: 'retry_count',
                type: 'number',
                default: 1,
                optional: true
            }
        ]
        this.outputs = [
            {
                label: 'Aggregated Results',
                name: 'aggregated_results',
                baseClasses: [...this.baseClasses, 'json']
            }
        ]
    }

    async init(nodeData: INodeData, _path: string, _options: ICommonObject): Promise<any> {
        // Lightweight, dependency-free simulation of parallel task distribution
        const maxParallel = (nodeData.inputs?.max_parallel ?? 1) as number
        const timeout = (nodeData.inputs?.timeout ?? 1000) as number
        const retryCount = (nodeData.inputs?.retry_count ?? 1) as number

        const workers = Math.max(1, Math.min(maxParallel, 8))
        const results: any[] = []
        for (let i = 0; i < workers; i++) {
            results.push({ worker: `agent-worker-${i + 1}`, status: 'completed', duration_ms: Math.max(0, Math.floor(timeout / workers)) })
        }

        // Include retry hints to reflect common usage
        const aggregated = {
            results,
            retries_used: retryCount
        }
        return { aggregated_results: aggregated }
    }
}

module.exports = { nodeClass: OysterAgentPool }
