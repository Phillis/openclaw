import { i as resolveOsHomeDir } from "./home-dir-BFvskzn8.js";
import { a as resolveCodexCliHomePath, n as readCodexCliCredentialsCached } from "./cli-credentials-DZ9rGNcm.js";
import os from "node:os";
//#region src/commands/onboard-inference-ambient.ts
const OPENAI_API_DEFAULT_MODEL_REF = "openai/gpt-5.6-sol";
const ANTHROPIC_API_DEFAULT_MODEL_REF = "anthropic/claude-opus-5";
const CLAUDE_CLI_DEFAULT_MODEL_REF = "claude-cli/claude-opus-5";
const CODEX_APP_SERVER_DEFAULT_MODEL_REF = "openai/gpt-5.6-sol";
const GEMINI_CLI_DEFAULT_MODEL_REF = "google-gemini-cli/gemini-3.1-pro-preview";
function detectAmbientInferenceBackends(env = process.env) {
	const candidates = [];
	if (env.OPENAI_API_KEY?.trim()) candidates.push({
		kind: "openai-api-key",
		modelRef: OPENAI_API_DEFAULT_MODEL_REF,
		label: "OpenAI API key",
		detail: "OPENAI_API_KEY set",
		credentials: true
	});
	if (env.ANTHROPIC_API_KEY?.trim()) candidates.push({
		kind: "anthropic-api-key",
		modelRef: ANTHROPIC_API_DEFAULT_MODEL_REF,
		label: "Anthropic API key",
		detail: "ANTHROPIC_API_KEY set",
		credentials: true
	});
	const homeDir = resolveOsHomeDir(env, env === process.env ? os.homedir : () => "");
	try {
		const codexHome = homeDir || env.CODEX_HOME?.trim() ? resolveCodexCliHomePath(void 0, env) : void 0;
		if (codexHome && readCodexCliCredentialsCached({
			codexHome,
			allowKeychainPrompt: false,
			ttlMs: 0
		})) candidates.push({
			kind: "codex-cli",
			modelRef: CODEX_APP_SERVER_DEFAULT_MODEL_REF,
			label: "Codex",
			detail: "credential file found",
			credentials: true
		});
	} catch {}
	return candidates;
}
//#endregion
//#region src/system-agent/setup-inference-brand.ts
function resolveSetupInferenceCandidateBrandId(candidate, providerId) {
	if (candidate.kind === "claude-cli") return "claude";
	if (candidate.kind === "codex-cli") return "openai";
	return providerId?.trim() || candidate.modelRef.split("/", 1)[0]?.trim() || void 0;
}
//#endregion
export { GEMINI_CLI_DEFAULT_MODEL_REF as a, CODEX_APP_SERVER_DEFAULT_MODEL_REF as i, ANTHROPIC_API_DEFAULT_MODEL_REF as n, OPENAI_API_DEFAULT_MODEL_REF as o, CLAUDE_CLI_DEFAULT_MODEL_REF as r, detectAmbientInferenceBackends as s, resolveSetupInferenceCandidateBrandId as t };
