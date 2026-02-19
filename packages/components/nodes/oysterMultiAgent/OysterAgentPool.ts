import { ICommonObject, INode, INodeData, INodeParams, INodeOutputsValue } from '../../../src/Interface'

// Oyster Agent Pool Node
class OysterAgentPool implements INode {
    label: string
    name: string
    version: number
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs?: INodeParams[]
    outputs: INodeOutputsValue[]
    constructor() {
        this.label = 'Oyster Agent Pool'
        this.name = 'oysterAgentPool'
        this.version = 1.0
        this.type = 'OysterAgentPool'
        this.icon = 'oysterAgentPool.svg'
        this.category = 'Oyster'
        this.description = 'Distributes multiple tasks across an agent pool in parallel'
        this.baseClasses = [this.type, 'Pool']
        this.inputs = [
            {
                label: 'Max Parallel',
                name: 'maxParallel',
                type: 'number',
                default: 4
            } as INodeParams,
            {
                label: 'Timeout (ms)',
                name: 'timeout',
                type: 'number',
                optional: true,
                default: 30000
            } as INodeParams,
            {
                label: 'Retry Count',
                name: 'retryCount',
                type: 'number',
                optional: true,
                default: 1
            } as INodeParams
        ]
        this.outputs = [
            {
                label: 'Aggregated Results',
                name: 'aggregated_results',
                baseClasses: this.baseClasses
            } as INodeOutputsValue
        ]
    }

    async init(nodeData: INodeData, _input: string, _options: ICommonObject): Promise<any> {
        // Basic validation to keep compatibility with other nodes
        const maxParallel = nodeData.inputs?.maxParallel
        if (typeof maxParallel !== 'undefined' && Number.isNaN(Number(maxParallel))) {
            throw new Error('Invalid maxParallel value')
        }
        return {}
    }
}

module.exports = { nodeClass: OysterAgentPool }
