import { INode, INodeData, ICommonObject, INodeParams } from '../../../src/Interface'

// Oyster Dispatch Task Node
// Wraps a sub-workflow as a dispatch task with basic parameters
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
        this.icon = 'oysterDispatch.svg'
        this.category = 'Oyster'
        this.description = 'Wrap sub-workflow as a dispatch task to a workflow executor'
        this.baseClasses = [this.type]
        this.inputs = [
            {
                label: 'Project',
                name: 'project',
                type: 'string',
                placeholder: 'Target project name'
            },
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
            },
            {
                label: 'Estimated Minutes',
                name: 'estimated_minutes',
                type: 'number',
                step: 1,
                optional: true,
                default: 5
            },
            {
                label: 'Node Preference',
                name: 'node_preference',
                type: 'string',
                optional: true
            }
        ]
        this.outputs = [
            {
                label: 'Task ID',
                name: 'task_id',
                description: 'Dispatched task id',
                baseClasses: ['string']
            },
            {
                label: 'Status',
                name: 'status',
                description: 'Dispatch status',
                baseClasses: ['string']
            },
            {
                label: 'Result',
                name: 'result',
                description: 'Dispatch result',
                baseClasses: ['json']
            }
        ]
    }

    // Optional init hook used by Flowise to initialize node execution
    async init(nodeData: INodeData, _: string, __?: ICommonObject): Promise<any> {
        // Minimal placeholder implementation that returns a dispatched-task payload
        const payload = {
            task_id: ` OysterDispatchTask_${Date.now()}`,
            status: 'queued',
            result: {}
        }
        return payload
    }
}

module.exports = { nodeClass: OysterDispatchTask }
