//#region src/agents/cli-runner/claude-live-session-policy.ts
const LIVE_SESSION_LIMITS = {
	maxSessions: 16,
	maxStderrChars: 64 * 1024
};
/** Returns whether a prepared backend context is eligible for Claude live stdio reuse. */
function acceptsClaudeLive(context) {
	return context.params.sessionEntry?.execHost !== "node" && context.backendResolved.id === "claude-cli" && context.preparedBackend.backend.liveSession === "claude-stdio" && context.preparedBackend.backend.output === "jsonl" && context.preparedBackend.backend.input === "stdin";
}
/** Resolve Claude's live permission mode without asking root to use an unsupported bypass. */
function resolveClaudeLiveMode(security, ask, uid) {
	return security === "full" && ask === "off" && uid !== 0 ? "bypassPermissions" : "default";
}
//#endregion
export { acceptsClaudeLive as n, resolveClaudeLiveMode as r, LIVE_SESSION_LIMITS as t };
