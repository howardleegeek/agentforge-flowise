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
        this.description = 'Wraps a subworkflow as a dispatch task'
        this.baseClasses = [this.type, 'Dispatch', 'Task']
        this.inputs = [
            {
                label: 'Project',
                name: 'project',
                type: 'string'
            } as INodeParams,
            {
                label: 'Priority',
                name: 'priority',
                type: 'options',
                options: [
                    { label: 'Low', name: 'low' },
                    { label: 'Medium', name: 'medium' },
                    { label: 'High', name: 'high' }
                ],
                default: 'medium'
            } as INodeParams,
            {
                label: 'Estimated Minutes',
                name: 'estimatedMinutes',
                type: 'number'
            } as INodeParams,
            {
                label: 'Node Preference',
                name: 'nodePreference',
                type: 'string',
                optional: true
            } as INodeParams
        ]
        this.outputs = [
            { label: 'Task Id', name: 'taskId', baseClasses: this.baseClasses },
            { label: 'Status', name: 'status', baseClasses: this.baseClasses },
            { label: 'Result', name: 'result', baseClasses: this.baseClasses }
        ]
    }

    async init(nodeData: INodeData, _input: string, _options: ICommonObject): Promise<any> {
        // Basic validation to satisfy tests and preserve behavior
        const project = nodeData.inputs?.project
        if (!project) {
            throw new Error('Project is required for OysterDispatchTask')
        }
        return {}
    }
}

module.exports = { nodeClass: OysterDispatchTask }
