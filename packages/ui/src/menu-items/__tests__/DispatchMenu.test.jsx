import dashboard from '../dashboard'

function hasDispatch(node) {
    if (!node) return false
    if (node.id === 'dispatch' && node.title === 'Dispatch') return true
    if (node.children && node.children.length) {
        return node.children.some((c) => hasDispatch(c))
    }
    return false
}

describe('Dispatch Menu', () => {
    test('includes a Dispatch menu item in the dashboard menu structure', () => {
        expect(hasDispatch(dashboard)).toBe(true)
    })
})
