// Branding sanity: ensure package.json is correctly renamed for AgentForge UI
const path = require('path')
const fs = require('fs')
const assert = require('assert')

const pkgPath = path.join(__dirname, '..', 'package.json')
let pkg
try {
    pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
} catch (e) {
    pkg = null
}

test('ui/package.json has AgentForge UI package name', () => {
    // If package.json could not be read, fail the test
    assert.ok(pkg, 'package.json should be readable')
    // Expect the renamed package name to reflect branding
    assert.strictEqual(pkg.name, '@oyster/agentforge-ui')
})
