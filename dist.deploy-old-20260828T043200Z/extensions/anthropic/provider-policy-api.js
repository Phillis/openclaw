import { c as resolveClaudeMythos5ModelIdentity, s as resolveClaudeModelIdentity } from "../../src-5i09w5fd.js";
import { n as resolveClaudeThinkingProfile } from "../../provider-claude-thinking-CBFvK_PW.js";
import "../../claude-model-runtime-Chb5Sinl.js";
import { c as CLAUDE_CLI_OFF_THINKING_PROFILE, l as CLAUDE_CLI_PROFILE_ID } from "../../cli-constants-Djv4WtLq.js";
import { n as normalizeAnthropicProviderConfigForProvider, t as applyAnthropicConfigDefaults } from "../../config-defaults-o63DNFcy.js";
//#region extensions/anthropic/provider-policy-api.ts
/**
* Provider-policy API for Anthropic and Claude CLI. Core calls this lightweight
* path for config defaults and thinking profiles.
*/
/** Profile ids that native Claude auth has retired from OpenClaw ownership. */
const deprecatedProfileIds = [CLAUDE_CLI_PROFILE_ID];
/** Normalize Anthropic provider config without importing runtime registration. */
function normalizeConfig(params) {
	return normalizeAnthropicProviderConfigForProvider(params);
}
/** Apply Anthropic config defaults through the provider-policy seam. */
function applyConfigDefaults(params) {
	return applyAnthropicConfigDefaults(params);
}
/** Resolve Claude thinking profile for Anthropic or Claude CLI providers. */
function resolveThinkingProfile(params) {
	const contractModelId = resolveClaudeModelIdentity({
		id: params.modelId,
		params: params.params
	});
	switch (params.provider.trim().toLowerCase()) {
		case "anthropic": return resolveClaudeThinkingProfile(contractModelId, void 0, { includeNativeMax: true });
		case "claude-cli":
			if (resolveClaudeMythos5ModelIdentity({ id: contractModelId })) return CLAUDE_CLI_OFF_THINKING_PROFILE;
			return resolveClaudeThinkingProfile(contractModelId, void 0, { includeNativeMax: true });
		default: return null;
	}
}
//#endregion
export { applyConfigDefaults, deprecatedProfileIds, normalizeConfig, resolveThinkingProfile };
