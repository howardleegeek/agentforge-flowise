import { getBrand, BRAND_NAME } from '../src/branding'

describe('branding', () => {
    test('should expose correct brand name', () => {
        expect(BRAND_NAME).toBe('AgentForge')
        expect(getBrand()).toBe('AgentForge')
    })
})
