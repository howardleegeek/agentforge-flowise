// Simple validation to ensure required env example is present and contains key vars
const fs = require('fs')
const path = require('path')

const repoRoot = path.resolve(__dirname, '..')
const envPath = path.join(repoRoot, '.env.example')

function fail(msg) {
    console.error('ENV_VALIDATION_FAILED:', msg)
    process.exit(1)
}

try {
    if (!fs.existsSync(envPath)) {
        fail('.env.example not found at ' + envPath)
    }
    const content = fs.readFileSync(envPath, 'utf8')
    // Basic checks: some critical keys should exist
    const required = ['DISPATCH_CONTROLLER_URL=', 'DISPATCH_ENABLED=']
    for (const k of required) {
        if (!content.includes(k)) {
            fail('Missing required env variable in .env.example: ' + k)
        }
    }
    console.log('ENV_VALIDATION_OK: .env.example contains required keys')
    process.exit(0)
} catch (e) {
    console.error(e)
    process.exit(1)
}
