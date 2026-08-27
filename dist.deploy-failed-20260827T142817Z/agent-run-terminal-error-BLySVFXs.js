//#region src/agents/agent-run-terminal-error.ts
/** Carries a canonical terminal outcome when an embedded attempt exits by throwing. */
var AgentRunTerminalOutcomeError = class extends Error {
	constructor(error, terminalOutcome) {
		super(error instanceof Error ? error.message : String(error), { cause: error });
		this.name = "AgentRunTerminalOutcomeError";
		this.terminalOutcome = terminalOutcome;
	}
};
/** Finds a canonical terminal outcome through ordinary error wrapper boundaries. */
function findAgentRunTerminalOutcome(error) {
	let candidate = error;
	const seen = /* @__PURE__ */ new Set();
	while (candidate && typeof candidate === "object" && !seen.has(candidate)) {
		seen.add(candidate);
		if (candidate instanceof AgentRunTerminalOutcomeError) return candidate.terminalOutcome;
		candidate = candidate.cause;
	}
}
//#endregion
export { findAgentRunTerminalOutcome as n, AgentRunTerminalOutcomeError as t };
