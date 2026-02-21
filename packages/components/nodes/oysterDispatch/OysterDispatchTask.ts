// Minimal Oyster Dispatch Task node (TypeScript)

export interface DispatchTaskInputs {
    project: string
    priority: number
    estimated_minutes: number
    node_preference?: string
}

export interface DispatchTaskOutputs {
    task_id: string
    status: string
    result?: any
}

export class OysterDispatchTask {
    public inputs: DispatchTaskInputs

    // Lightweight static schemas for tooling visibility
    static inputSchema = {
        type: 'object',
        properties: {
            project: { type: 'string' },
            priority: { type: 'number' },
            estimated_minutes: { type: 'number' },
            node_preference: { type: 'string' }
        },
        required: ['project', 'priority', 'estimated_minutes']
    }
    static outputSchema = {
        type: 'object',
        properties: {
            task_id: { type: 'string' },
            status: { type: 'string' },
            result: { type: 'any' }
        }
    }

    constructor(inputs: DispatchTaskInputs) {
        this.inputs = inputs
    }

    async run(): Promise<DispatchTaskOutputs> {
        // Basic validation to simulate real behavior without performing work
        const { project, priority, estimated_minutes } = this.inputs
        if (!project || typeof priority !== 'number' || typeof estimated_minutes !== 'number') {
            return { task_id: 'invalid', status: 'error', result: 'invalid inputs' }
        }

        // In a real implementation this would wrap a sub-workflow as a dispatch task
        const taskId = `dispatch_${Date.now()}_${Math.floor(Math.random() * 1000)}`
        return { task_id: taskId, status: 'queued', result: null }
    }
}
