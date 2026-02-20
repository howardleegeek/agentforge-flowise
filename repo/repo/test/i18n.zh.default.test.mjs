// Default language should be zh
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

    // Do not switch language; ensure default is zh
    const current = i18n.currentLanguage
    const tWorkflowBuilder = i18n.t('Workflow Builder')
    const tWorkflow = i18n.t('Workflow')
    const tAgentFlows = i18n.t('Agent Flows')
    const tAgentFlowsAlt = i18n.t('AgentFlows')

    const ok =
        current === 'zh' &&
        tWorkflowBuilder === '工作流构建器' &&
        tWorkflow === '工作流' &&
        tAgentFlows === '代理流程' &&
        tAgentFlowsAlt === '代理流程'
    if (ok) {
        console.log('PASS: Default language is Chinese with proper translations')
        process.exit(0)
    } else {
        console.error('FAIL: Default language translations mismatch', {
            currentLanguage: current,
            WorkflowBuilder: tWorkflowBuilder,
            Workflow: tWorkflow,
            AgentFlows: tAgentFlows,
            AgentFlowsAlt: tAgentFlowsAlt
        })
        process.exit(1)
    }
}

run().catch((e) => {
    console.error('ERROR running i18n zh default test', e)
    process.exit(2)
})
