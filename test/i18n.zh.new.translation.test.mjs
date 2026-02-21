// Test that NEW translates to 新建 in zh.js translations
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function run() {
    // Load zh.js translations directly
    const zhPath = path.resolve(__dirname, '../i18n/zh.js')
    const mod = await import(zhPath)
    const zh = mod.default
    const tNew = zh?.translation?.NEW
    if (tNew === '新建') {
        console.log('PASS: NEW translates to 新建 in zh.js')
        process.exit(0)
    } else {
        console.error('FAIL: NEW translation mismatch', { NEW: tNew })
        process.exit(1)
    }
}

run()
