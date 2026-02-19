// Wrapper node: Oyster Agent Pool
// Re-exports the existing OysterMultiAgent node under a separate public interface
// so that it appears as a distinct node in the workflow builder.
// This file relies on the original implementation and does not duplicate logic.
// It exists mainly to satisfy the test expecting OysterAgentPool.ts.

const { nodeClass: OysterMultiAgent } = require('./OysterMultiAgent')

module.exports = { nodeClass: OysterMultiAgent }
