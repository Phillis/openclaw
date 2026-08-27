//#region src/channels/status/account-state.ts
function assertNeverState(state) {
	throw new Error(`Unhandled channel account state: ${String(state)}`);
}
function resolveChannelAccountState(input) {
	const failure = input.runtime?.lastError ?? null;
	if (!input.enabled) return {
		kind: "disabled",
		configured: input.configured,
		linked: input.linked,
		reason: input.disabledReason ?? "disabled",
		failure
	};
	if (!input.configured) return {
		kind: "unconfigured",
		reason: input.unconfiguredReason ?? "not configured",
		failure
	};
	if (input.linked === false) return {
		kind: "unlinked",
		reason: input.unlinkedReason ?? "not linked",
		failure
	};
	if (input.runtime?.running === true) return {
		kind: "running",
		linked: input.linked,
		connected: input.runtime.connected,
		failure
	};
	return {
		kind: "stopped",
		linked: input.linked,
		connected: input.runtime?.connected,
		failure
	};
}
function resolveChannelAccountLinked(state, fallback) {
	return state ? state === "unknown" ? void 0 : state === "linked" : fallback;
}
function projectChannelAccountState(state) {
	switch (state.kind) {
		case "disabled": return {
			configured: state.configured,
			...typeof state.linked === "boolean" ? { linked: state.linked } : {},
			running: false,
			stateReason: state.reason,
			lastError: state.failure
		};
		case "unconfigured":
		case "unlinked": return {
			configured: state.kind === "unlinked",
			...state.kind === "unlinked" ? { linked: false } : {},
			running: false,
			stateReason: state.reason,
			lastError: state.failure
		};
		case "running":
		case "stopped": return {
			configured: true,
			...state.linked ? { linked: true } : {},
			running: state.kind === "running",
			...typeof state.connected === "boolean" ? { connected: state.connected } : {},
			lastError: state.failure
		};
	}
	return assertNeverState(state);
}
const CHANNEL_ACCOUNT_STATE_FIELDS = [
	"configured",
	"linked",
	"running",
	"connected",
	"stateReason",
	"lastError"
];
function applyChannelAccountState(snapshot, state) {
	for (const field of CHANNEL_ACCOUNT_STATE_FIELDS) delete snapshot[field];
	Object.assign(snapshot, projectChannelAccountState(state));
}
function projectChannelAccountDisplayState(state, fallback) {
	switch (state.kind) {
		case "disabled": return "disabled";
		case "unconfigured": return "not configured";
		case "unlinked": return "not linked";
		case "running":
		case "stopped": return state.linked ? "linked" : fallback ?? "configured";
	}
	return assertNeverState(state);
}
//#endregion
export { resolveChannelAccountState as i, projectChannelAccountDisplayState as n, resolveChannelAccountLinked as r, applyChannelAccountState as t };
