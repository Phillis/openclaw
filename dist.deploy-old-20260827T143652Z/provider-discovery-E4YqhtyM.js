import { t as readClaudeCliCredentialsForRuntime } from "./cli-auth-seam-Df4N3D_0.js";
import { t as CLAUDE_CLI_API_KEY_HELPER_AUTH_MARKER } from "./cli-constants-BoJ2vZl0.js";
//#region extensions/anthropic/provider-discovery.ts
const CLAUDE_CLI_BACKEND_ID = "claude-cli";
function resolveClaudeCliSyntheticAuth() {
	const credential = readClaudeCliCredentialsForRuntime();
	if (!credential) return;
	switch (credential.type) {
		case "oauth": return {
			apiKey: credential.access,
			source: "Claude CLI native auth",
			mode: "oauth",
			expiresAt: credential.expires
		};
		case "token": return {
			apiKey: credential.token,
			source: "Claude CLI native auth",
			mode: "token",
			expiresAt: credential.expires
		};
		case "api_key_helper": return {
			apiKey: CLAUDE_CLI_API_KEY_HELPER_AUTH_MARKER,
			source: "Claude CLI apiKeyHelper",
			mode: "api-key"
		};
	}
}
const anthropicProviderDiscovery = {
	id: CLAUDE_CLI_BACKEND_ID,
	label: "Claude CLI",
	docsPath: "/providers/models",
	auth: [],
	resolveSyntheticAuth: ({ provider }) => provider === CLAUDE_CLI_BACKEND_ID ? resolveClaudeCliSyntheticAuth() : void 0
};
//#endregion
export { resolveClaudeCliSyntheticAuth as n, anthropicProviderDiscovery as t };
