import { ICommonObject, INode, INodeData, INodeParams, INodeOutputsValue } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'

class OysterAgentPool implements INode {
    label: string
    name: string
    version: number
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]
    outputs: INodeOutputsValue[]

    constructor() {
        this.label = 'Oyster Agent Pool'
        this.name = 'oysterAgentPool'
        this.version = 1.0
        this.type = 'OysterAgentPool'
        this.icon = 'oysterAgentPool.svg'
        this.category = 'Oyster'
        this.description = 'Distributes tasks across an agent pool in parallel'
        this.baseClasses = [...getBaseClasses(OysterAgentPool)]
        this.inputs = [
            {
                label: 'Max Parallel',
                name: 'maxParallel',
                type: 'number',
                default: 4
            },
            {
                label: 'Timeout',
                name: 'timeout',
                type: 'number',
                default: 30000
            },
            {
                label: 'Retry Count',
                name: 'retryCount',
                type: 'number',
                optional: true,
                default: 0
            }
        ]
        this.outputs = [{ label: 'Aggregated Results', name: 'aggregated_results', baseClasses: this.baseClasses }]
    }

    async init(nodeData: INodeData, _path: string, _options: ICommonObject): Promise<any> {
        // Simple stub for tests; real logic would dispatch to agents in pool
        return { aggregated_results: [] }
    }
}

module.exports = { nodeClass: OysterAgentPool }
