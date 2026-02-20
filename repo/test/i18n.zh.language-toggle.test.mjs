// Language toggle test for Chinese/English in i18n
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function run() {
    const i18nPath = path.resolve(__dirname, '../', 'packages', 'ui', 'src', 'i18n', 'index.js')
    // Dynamic import of the i18n instance
    const mod = await import(i18nPath)
    const i18n = mod.default

    // Switch to Chinese first
    try {
        await i18n.changeLanguage('zh')
    } catch (e) {
        console.error('Failed to switch to zh:', e)
        process.exit(2)
    }

    const langZh = i18n.t('Language')

    // Then switch to English
    try {
        await i18n.changeLanguage('en')
    } catch (e) {
        console.error('Failed to switch to en:', e)
        process.exit(2)
    }
    const langEn = i18n.t('Language')

    if (langZh === '语言' && langEn === 'Language') {
        console.log('PASS: Language toggle zh<->en works')
        process.exit(0)
    } else {
        console.error('FAIL: Language toggle mismatch', { zh: langZh, en: langEn })
        process.exit(1)
    }
}

run()
