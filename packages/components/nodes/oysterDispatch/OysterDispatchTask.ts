import { ICommonObject, INode, INodeData, INodeParams, INodeOutputsValue } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'

class OysterDispatchTask implements INode {
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
        this.label = 'Oyster Dispatch Task'
        this.name = 'oysterDispatchTask'
        this.version = 1.0
        this.type = 'OysterDispatchTask'
        this.icon = 'oysterDispatchTask.svg'
        this.category = 'Oyster'
        this.description = 'Wraps a sub-workflow as a dispatch task'
        this.baseClasses = [...getBaseClasses(OysterDispatchTask)]
        this.inputs = [
            {
                label: 'Project',
                name: 'project',
                type: 'string',
                placeholder: 'my-project'
            },
            {
                label: 'Priority',
                name: 'priority',
                type: 'number',
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
            { label: 'Task ID', name: 'taskId', baseClasses: this.baseClasses },
            { label: 'Status', name: 'status', baseClasses: this.baseClasses },
            { label: 'Result', name: 'result', baseClasses: ['string', 'json'] }
        ]
    }

    async init(nodeData: INodeData, _: string, __: ICommonObject): Promise<any> {
        const project = nodeData?.inputs?.project as string
        if (!project) {
            throw new Error('Project is required')
        }
        const taskId = 'task_' + Math.random().toString(36).slice(2, 9)
        return { taskId, status: 'created', result: {} }
    }
}

module.exports = { nodeClass: OysterDispatchTask }
