// Branding sanity test using Node's built-in test harness
const { test } = require('node:test')
const assert = require('assert')
const path = require('path')
const fs = require('fs')

const indexHtml = path.join(__dirname, '..', 'public', 'index.html')
let content
try {
    content = fs.readFileSync(indexHtml, 'utf8')
} catch (e) {
    content = ''
}

test('branding includes AgentForge in public HTML', (t) => {
    t.equal(typeof content, 'string', 'index.html should be readable as string')
    t.ok(content.includes('AgentForge'), 'index.html should contain AgentForge branding')
})
