import { ICommonObject, INode, INodeData, INodeParams, INodeOutputsValue } from '../../../src/Interface'

// Oyster Dispatch Task Node
class OysterDispatchTask implements INode {
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
        this.label = 'Oyster Dispatch Task'
        this.name = 'oysterDispatchTask'
        this.version = 1.0
        this.type = 'OysterDispatchTask'
        this.icon = 'oysterDispatchTask.svg'
        this.category = 'Oyster'
        this.description = 'Wraps a subworkflow as a dispatch task for a single workflow execution'
        this.baseClasses = [this.type, 'Task']
        this.inputs = [
            {
                label: 'Project',
                name: 'project',
                type: 'string',
                default: ''
            } as INodeParams,
            {
                label: 'Priority',
                name: 'priority',
                type: 'string',
                default: 'normal'
            } as INodeParams,
            {
                label: 'Estimated Minutes',
                name: 'estimatedMinutes',
                type: 'number',
                default: 30
            } as INodeParams,
            {
                label: 'Node Preference',
                name: 'nodePreference',
                type: 'string',
                optional: true,
                default: ''
            } as INodeParams
        ]
        this.outputs = [
            {
                label: 'Task ID',
                name: 'task_id',
                baseClasses: this.baseClasses
            } as INodeOutputsValue,
            {
                label: 'Status',
                name: 'status',
                baseClasses: this.baseClasses
            } as INodeOutputsValue,
            {
                label: 'Result',
                name: 'result',
                baseClasses: this.baseClasses
            } as INodeOutputsValue
        ]
    }

    async init(nodeData: INodeData, _input: string, _options: ICommonObject): Promise<any> {
        const project = nodeData.inputs?.project
        if (typeof project !== 'undefined' && typeof project !== 'string') {
            throw new Error('Invalid project value')
        }
        const estimatedMinutes = nodeData.inputs?.estimatedMinutes
        if (typeof estimatedMinutes !== 'undefined' && Number.isNaN(Number(estimatedMinutes))) {
            throw new Error('Invalid estimatedMinutes value')
        }
        return {}
    }
}

module.exports = { nodeClass: OysterDispatchTask }
