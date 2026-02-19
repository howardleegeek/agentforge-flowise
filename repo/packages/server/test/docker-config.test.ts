import * as fs from 'fs'
import * as path from 'path'

// Validate presence of docker config snippets and env documentation
describe('Docker & Env Config Presence', () => {
    it('docker-compose.yml contains DISPATCH_ENABLED and DISPATCH_CONTROLLER_URL', () => {
        const dockerComposePath = path.resolve(__dirname, '../../../docker-compose.yml')
        const content = fs.readFileSync(dockerComposePath, 'utf8')
        expect(content).toContain('DISPATCH_ENABLED')
        expect(content).toContain('DISPATCH_CONTROLLER_URL')
    })

    it('.env.example contains DISPATCH_CONTROLLER_URL documentation', () => {
        const envExamplePath = path.resolve(__dirname, '../../../.env.example')
        const text = fs.readFileSync(envExamplePath, 'utf8')
        expect(text).toContain('DISPATCH_CONTROLLER_URL')
    })
})
