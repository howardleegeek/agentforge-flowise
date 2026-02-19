// Lightweight compile-time sanity for OysterAgentPool node
const mod = require('./OysterAgentPool')
if (mod && mod.nodeClass) {
    // Ensure the class can be instantiated (no runtime side effects)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const Instance = new mod.nodeClass()
}
