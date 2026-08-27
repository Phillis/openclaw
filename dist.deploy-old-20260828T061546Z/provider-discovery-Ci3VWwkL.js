import { s as CLAUDE_CLI_NATIVE_AUTH_MARKER, t as CLAUDE_CLI_BACKEND_ID } from "./cli-constants-Djv4WtLq.js";
import { t as probeClaudeCliAuthStatus } from "./cli-auth-seam-B8D2x_9U.js";
//#region extensions/anthropic/provider-discovery.ts
const nativeLoginAvailabilityByConfig = /* @__PURE__ */ new WeakMap();
function resolveClaudeCliSyntheticAuth(config) {
	if (!config) return;
	let available = nativeLoginAvailabilityByConfig.get(config);
	if (available === void 0) {
		available = probeClaudeCliAuthStatus().status === "available";
		nativeLoginAvailabilityByConfig.set(config, available);
	}
	if (!available) return;
	return {
		apiKey: CLAUDE_CLI_NATIVE_AUTH_MARKER,
		source: "Claude CLI native auth",
		mode: "oauth"
	};
}
const anthropicProviderDiscovery = {
	id: CLAUDE_CLI_BACKEND_ID,
	label: "Claude CLI",
	docsPath: "/providers/models",
	auth: [],
	resolveSyntheticAuth: ({ config, provider }) => provider === "claude-cli" ? resolveClaudeCliSyntheticAuth(config) : void 0
};
//#endregion
export { resolveClaudeCliSyntheticAuth as n, anthropicProviderDiscovery as t };
