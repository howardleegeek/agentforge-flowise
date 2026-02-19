import { ICommonObject, INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'

// Oyster Dispatch Task Node
// Wraps a subworkflow as a dispatched task
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
        this.name = 'oysterDispatch'
        this.version = 1.0
        this.type = 'OysterDispatchTask'
        this.icon = 'oysterDispatchTask.svg'
        this.category = 'Oyster'
        this.description = 'Dispatch a single subworkflow as a task'
        this.baseClasses = getBaseClasses(OysterDispatchTask)
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
                type: 'string',
                default: 'normal'
            },
            {
                label: 'Estimated Minutes',
                name: 'estimated_minutes',
                type: 'number',
                step: 1,
                default: 60
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
                baseClasses: [...this.baseClasses, 'text']
            },
            {
                label: 'Status',
                name: 'status',
                baseClasses: [...this.baseClasses, 'text']
            },
            {
                label: 'Result',
                name: 'result',
                baseClasses: [...this.baseClasses, 'json']
            }
        ]
    }

    async init(nodeData: INodeData, _path: string, _options: ICommonObject): Promise<any> {
        // Lightweight stub: simulate creating a task and returning initial status
        const project = (nodeData.inputs?.project ?? '') as string
        const priority = (nodeData.inputs?.priority ?? 'normal') as string
        const estimatedMinutes = (nodeData.inputs?.estimated_minutes ?? 60) as number
        const nodePref = (nodeData.inputs?.node_preference ?? '') as string

        const taskId = `task_${Date.now()}_${Math.floor(Math.random() * 1000)}`
        const status = 'queued'
        const result = {
            project,
            priority,
            estimated_minutes: estimatedMinutes,
            node_preference: nodePref
        }

        return { task_id: taskId, status, result }
    }
}

module.exports = { nodeClass: OysterDispatchTask }
