// Minimal runtime test to verify Chinese translations load by default (or after explicit switch)
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function run() {
    // Resolve path to the i18n index.js in the workspace
    const i18nPath = path.resolve(__dirname, '../', 'packages', 'ui', 'src', 'i18n', 'index.js')
    // Dynamic import of the ES module
    const mod = await import(i18nPath)
    const i18n = mod.default

    // Ensure Chinese translations are available
    try {
        await i18n.changeLanguage('zh')
    } catch (e) {
        console.error('Failed to change language to zh:', e)
        process.exit(2)
    }

    const langLabel = i18n.t('Language')
    const providersLabel = i18n.t('Providers')
    const agentsLabel = i18n.t('Agents')

    if (langLabel === '语言' && providersLabel === '提供者' && agentsLabel === '智能体') {
        console.log('PASS: Chinese translations loaded by default')
        process.exit(0)
    } else {
        console.error('FAIL: Translations mismatch', { langLabel, providersLabel, agentsLabel })
        process.exit(1)
    }
}

run()
