import { INode, INodeData, ICommonObject, INodeParams } from '../../../src/Interface'

// Oyster Multi-Agent Node
// Distributes tasks across a pool of agents in parallel
class OysterMultiAgent implements INode {
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
        this.name = 'oysterMultiAgent'
        this.version = 1.0
        this.type = 'OysterMultiAgent'
        this.icon = 'oysterMultiAgent.svg'
        this.category = 'Oyster'
        this.description = 'Parallel distribution of multiple tasks to an agent pool'
        this.baseClasses = [this.type]
        this.inputs = [
            {
                label: 'Max Parallel',
                name: 'max_parallel',
                type: 'number',
                step: 1,
                default: 4
            },
            {
                label: 'Timeout (s)',
                name: 'timeout',
                type: 'number',
                step: 1,
                default: 60
            },
            {
                label: 'Retry Count',
                name: 'retry_count',
                type: 'number',
                step: 1,
                default: 3
            }
        ]
        this.outputs = [
            {
                label: 'Aggregated Results',
                name: 'aggregated_results',
                description: 'Merged results from all agents',
                baseClasses: [...this.baseClasses, 'json']
            }
        ]
    }

    async init(nodeData: INodeData, _: string, __?: ICommonObject): Promise<any> {
        // Minimal placeholder that returns aggregated results structure
        const maxParallel = (nodeData.inputs?.max_parallel ?? 4) as number
        const timeout = (nodeData.inputs?.timeout ?? 60) as number
        const retryCount = (nodeData.inputs?.retry_count ?? 3) as number

        const aggregated = {
            maxParallel,
            timeout,
            retryCount,
            results: [] as any[]
        }

        return { aggregated_results: aggregated }
    }
}

module.exports = { nodeClass: OysterMultiAgent }
