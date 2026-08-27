//#region src/agents/agent-run-terminal-receipt.ts
function normalizeAgentRunTerminalReceipt(value) {
	const receipt = value;
	return receipt && typeof receipt.runId === "string" && typeof receipt.sessionId === "string" && typeof receipt.turnId === "string" && receipt.requested && receipt.effective && Array.isArray(receipt.successfulToolNames) ? receipt : void 0;
}
//#endregion
export { normalizeAgentRunTerminalReceipt as t };
