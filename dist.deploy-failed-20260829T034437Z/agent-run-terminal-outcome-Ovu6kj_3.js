import { c as isRecord } from "./record-coerce-DItp3I4t.js";
//#region src/channels/turn/agent-run-terminal-outcome.ts
const AGENT_RUN_TERMINAL_OUTCOME = Symbol.for("openclaw.agentRunTerminalOutcome");
function recordAgentRunTerminalOutcome(result, outcome) {
	return Object.assign(result, { [AGENT_RUN_TERMINAL_OUTCOME]: outcome });
}
function readAgentRunTerminalOutcome(result) {
	const outcome = isRecord(result) && Object.hasOwn(result, AGENT_RUN_TERMINAL_OUTCOME) ? Reflect.get(result, AGENT_RUN_TERMINAL_OUTCOME) : void 0;
	return outcome === "completed" || outcome === "failed" ? outcome : void 0;
}
//#endregion
export { recordAgentRunTerminalOutcome as n, readAgentRunTerminalOutcome as t };
