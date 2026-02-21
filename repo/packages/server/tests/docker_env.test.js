const fs = require('fs')
const path = require('path')

describe('Docker env example', () => {
    const envPath = path.resolve(__dirname, '../../../.env.example')

    test('env.example exists', () => {
        expect(fs.existsSync(envPath)).toBe(true)
    })

    test('env.example documents DISPATCH_CONTROLLER_URL', () => {
        const content = fs.readFileSync(envPath, 'utf8')
        expect(content).toContain('DISPATCH_CONTROLLER_URL')
    })
})
