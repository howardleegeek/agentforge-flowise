import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import express from 'express'
import request from 'supertest'

// Helper to load a fresh module instance with specific env vars
async function loadBridgeWithEnv(env: NodeJS.ProcessEnv) {
    // Clear require cache for the module under test to ensure fresh env usage
    const path = require.resolve('../src/services/dispatch-bridge')
    delete require.cache[path]
    Object.assign(process, { env: { ...process.env, ...env } })
    // Dynamically import the bridge to pick up env at load time
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('../src/services/dispatch-bridge')
    // Return the DispatchBridge class
    // @ts-ignore
    return mod.DispatchBridge as typeof import('../src/services/dispatch-bridge').DispatchBridge
}

describe('DispatchBridge (unit tests)', () => {
    afterAll(() => {
        jest.restoreAllMocks()
    })

    it('disables when DISPATCH_ENABLED=false', async () => {
        const Bridge = await loadBridgeWithEnv({ DISPATCH_ENABLED: 'false', DISPATCH_CONTROLLER_URL: '' })
        // submitTask should return a skip taskId when disabled
        const taskId = await Bridge.submitTask('cf1', { a: 1 })
        expect(typeof taskId).toBe('string')
        expect(taskId).toMatch(/^dispatch-skip-/)
    })

    it('disables nodes when DISPATCH_ENABLED=true but no controller URL', async () => {
        const Bridge = await loadBridgeWithEnv({ DISPATCH_ENABLED: 'true', DISPATCH_CONTROLLER_URL: '' })
        const nodes = await Bridge.nodes()
        expect(Array.isArray(nodes)).toBe(true)
        expect(nodes.length).toBe(0)
    })

    it('sends request to controller when enabled and URL provided (mock fetch)', async () => {
        const Bridge = await loadBridgeWithEnv({ DISPATCH_ENABLED: 'true', DISPATCH_CONTROLLER_URL: 'http://controller' })
        // Mock global fetch used by DispatchBridge
        // @ts-ignore
        global.fetch = async (_url: string, _opts: any) => {
            return {
                json: async () => ({ taskId: 'abc123' })
            }
        }

        const taskId = await Bridge.submitTask('cf2', { x: 2 })
        expect(taskId).toBeDefined()
    })
})
