import { INode, INodeData, ICommonObject, INodeParams } from '../../../src/Interface'

// Oyster Dispatch Task Node
// Wraps a sub-workflow as a dispatch task
class OysterDispatchTask implements INode {
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
        this.label = 'Oyster Dispatch Task'
        this.name = 'oysterDispatchTask'
        this.version = 1.0
        this.type = 'OysterDispatchTask'
        this.icon = 'oysterDispatchTask.svg'
        this.category = 'Oyster'
        this.description = 'Wraps a sub-workflow as a dispatch task'
        this.baseClasses = [this.type]
        this.inputs = [
            {
                label: 'Project',
                name: 'project',
                type: 'string',
                default: ''
            },
            {
                label: 'Priority',
                name: 'priority',
                type: 'number',
                default: 1
            },
            {
                label: 'Estimated Minutes',
                name: 'estimated_minutes',
                type: 'number',
                default: 15
            },
            {
                label: 'Node Preference',
                name: 'node_preference',
                type: 'string',
                default: 'default',
                optional: true
            }
        ]
        this.outputs = [
            {
                label: 'Task ID',
                name: 'task_id',
                description: 'Dispatched task identifier',
                baseClasses: [...this.baseClasses, 'string']
            },
            {
                label: 'Status',
                name: 'status',
                description: 'Current status of the dispatched task',
                baseClasses: [...this.baseClasses, 'string']
            },
            {
                label: 'Result',
                name: 'result',
                description: 'Dispatch result placeholder',
                baseClasses: [...this.baseClasses, 'json']
            }
        ]
    }

    async init(nodeData: INodeData, _path: string, _options: ICommonObject): Promise<any> {
        // Minimal placeholder: generate a synthetic task id and empty result
        const taskId = `dispatch_${Date.now()}_${Math.floor(Math.random() * 1000)}`
        const status = 'submitted'
        const result = null

        return {
            task_id: taskId,
            status,
            result
        }
    }
}

module.exports = { nodeClass: OysterDispatchTask }
