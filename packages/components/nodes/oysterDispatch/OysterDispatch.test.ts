// Lightweight compile-time sanity for OysterDispatchTask node
const mod = require('./OysterDispatch')
if (mod && mod.nodeClass) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const Instance = new mod.nodeClass()
}
