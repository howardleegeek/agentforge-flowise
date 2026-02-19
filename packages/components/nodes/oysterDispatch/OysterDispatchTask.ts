import { ICommonObject, INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'

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
        this.description = 'Dispatch a sub-workflow as a task'
        this.baseClasses = getBaseClasses(OysterDispatchTask)
        this.inputs = [
            {
                label: 'Project',
                name: 'project',
                type: 'string'
            },
            {
                label: 'Priority',
                name: 'priority',
                type: 'string',
                optional: true
            },
            {
                label: 'Estimated Minutes',
                name: 'estimatedMinutes',
                type: 'number',
                optional: true
            },
            {
                label: 'Node Preference',
                name: 'nodePreference',
                type: 'string',
                optional: true
            }
        ]
        this.outputs = [
            {
                label: 'Task ID',
                name: 'taskId',
                baseClasses: [...this.baseClasses, 'json']
            },
            {
                label: 'Status',
                name: 'status',
                baseClasses: [...this.baseClasses, 'json']
            },
            {
                label: 'Result',
                name: 'result',
                baseClasses: [...this.baseClasses, 'json']
            }
        ]
    }

    async init(nodeData: INodeData, _path: string, _options: ICommonObject): Promise<any> {
        const project = (nodeData.inputs as any)?.project
        if (!project) {
            throw new Error('Project is required for OysterDispatchTask')
        }

        // Minimal, deterministic-ish placeholder for task creation
        const taskId = `task-${Math.random().toString(36).slice(2, 9)}`
        const status = 'scheduled'
        const result = null

        return { taskId, status, result }
    }
}

module.exports = { nodeClass: OysterDispatchTask }
