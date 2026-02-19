// Additional Chinese translations sanity check for i18n zh.js
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function run() {
    const zhPath = path.resolve(__dirname, '../i18n/zh.js')
    const mod = await import(zhPath)
    const zh = mod.default

    const tCardView = zh?.translation?.['Card View']
    const tListView = zh?.translation?.['List View']
    const tInactive = zh?.translation?.Inactive
    const tLangChain = zh?.translation?.LangChain
    // New: ensure translation for Agentflows key exists in zh.json/zh.js
    const tAgentflows = zh?.translation?.['Agentflows'] ?? zh?.translation?.['Agent Flows']
    // Expect Chinese translations for these keys after patch
    const ok =
        tCardView === '卡片视图' &&
        tListView === '列表视图' &&
        tInactive === '未激活' &&
        tLangChain === '语言链' &&
        tAgentflows === '代理流程'
    if (ok) {
        console.log('PASS: zh.js translations updated (additional checks)')
        process.exit(0)
    } else {
        console.error('FAIL: zh.js translations mismatch (additional checks)', {
            CardView: tCardView,
            ListView: tListView,
            Inactive: tInactive,
            LangChain: tLangChain
        })
        process.exit(1)
    }
}

run()
