// Workflow nodes Chinese translations sanity check
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function run() {
    // Load the i18n instance from the UI package
    const i18nPath = path.resolve(__dirname, '../', 'packages', 'ui', 'src', 'i18n', 'index.js')
    const mod = await import(i18nPath)
    const i18n = mod.default

    // Switch to Chinese for testing
    try {
        await i18n.changeLanguage('zh')
    } catch (e) {
        console.error('Failed to change language to zh:', e)
        process.exit(2)
    }

    const tWorkflowBuilder = i18n.t('Workflow Builder')
    const tWorkflow = i18n.t('Workflow')
    const tAgentFlows = i18n.t('Agent Flows')
    const tAgentFlowsAlt = i18n.t('AgentFlows')

    const ok = tWorkflowBuilder === '工作流构建器' && tWorkflow === '工作流' && tAgentFlows === '代理流程' && tAgentFlowsAlt === '代理流程'

    if (ok) {
        console.log('PASS: Workflow builder nodes translations are Chinese')
        process.exit(0)
    } else {
        console.error('FAIL: Workflow builder translations mismatch', {
            WorkflowBuilder: tWorkflowBuilder,
            Workflow: tWorkflow,
            AgentFlows: tAgentFlows,
            AgentFlowsAlt: tAgentFlowsAlt
        })
        process.exit(1)
    }
}

run()
