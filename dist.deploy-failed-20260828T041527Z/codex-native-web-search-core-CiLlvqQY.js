import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import "./utils-Bw16L5tB.js";
import { u as resolveToolProfilePolicy } from "./tool-policy-shared-DmpG3HvD.js";
import { l as mergeAlsoAllowPolicy } from "./tool-policy-B1rvCc4B.js";
import { n as isToolAllowedByPolicies, t as isRuntimeToolAllowed } from "./tool-policy-match-DfCekeWz.js";
import { n as listProfilesForProvider } from "./profile-list-CFe_FbXc.js";
import { r as ensureAuthProfileStore } from "./store-C6iqqcJy.js";
import { n as externalCliDiscoveryForProviderAuth } from "./external-cli-discovery-kohNMVnn.js";
import { i as resolveGroupToolPolicy, r as resolveEffectiveToolPolicy } from "./agent-tools.policy-BuNXvHMo.js";
import { t as resolveSenderToolPolicy } from "./sender-tool-policy-DuMIfV8W.js";
import { n as resolveRequesterToolPolicies } from "./requester-tool-policy-CNXmQc7V.js";
import { n as resolveCodexNativeWebSearchConfig } from "./codex-native-web-search.shared-fr3fqH85.js";
//#region src/agents/web-search-tool-policy.ts
/** Resolves current and sender-independent policy for the managed web_search tool. */
function resolveWebSearchToolPolicy(params) {
	if (params.webSearchEnabled === false) return {
		allowed: false,
		persistentAllowed: false
	};
	const { agentId, globalPolicy, globalProviderPolicy, agentPolicy, agentProviderPolicy, profile, providerProfile, profileAlsoAllow, providerProfileAlsoAllow } = resolveEffectiveToolPolicy({
		config: params.config,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		modelProvider: params.modelProvider,
		modelId: params.modelId
	});
	const profilePolicy = mergeAlsoAllowPolicy(resolveToolProfilePolicy(profile), profileAlsoAllow);
	const providerProfilePolicy = mergeAlsoAllowPolicy(resolveToolProfilePolicy(providerProfile), providerProfileAlsoAllow);
	const groupPolicyParams = {
		config: params.config,
		sessionKey: params.scheduledToolPolicy?.ownerSessionKey ?? params.sessionKey,
		spawnedBy: params.spawnedBy,
		messageProvider: params.messageProvider,
		groupId: params.groupId,
		groupChannel: params.groupChannel,
		groupSpace: params.groupSpace,
		accountId: params.scheduledToolPolicy?.ownerAccountId ?? params.agentAccountId,
		requireConfiguredAccount: params.scheduledToolPolicy?.mode === "account",
		senderPolicyMode: params.scheduledToolPolicy ? "never" : "always"
	};
	const senderPolicyParams = {
		config: params.config,
		agentId,
		sessionKey: params.sessionKey,
		messageProvider: params.messageProvider
	};
	const requesterPolicies = resolveRequesterToolPolicies({
		...groupPolicyParams,
		agentId,
		senderId: params.senderId,
		senderName: params.senderName,
		senderUsername: params.senderUsername,
		senderE164: params.senderE164,
		inputProvenance: params.inputProvenance,
		trustedInternalHandoff: params.trustedInternalHandoff,
		sessionId: params.sessionId,
		modelProvider: params.modelProvider,
		modelId: params.modelId,
		senderPolicyMode: params.scheduledToolPolicy ? "never" : "always",
		groupPolicySessionKey: params.scheduledToolPolicy?.ownerSessionKey,
		requireConfiguredGroupAccount: params.scheduledToolPolicy?.mode === "account"
	});
	const persistentGroupPolicy = requesterPolicies.delegated ? void 0 : resolveGroupToolPolicy(groupPolicyParams);
	const persistentSenderPolicy = requesterPolicies.delegated || params.scheduledToolPolicy ? void 0 : resolveSenderToolPolicy(senderPolicyParams);
	const fixedPolicies = [
		profilePolicy,
		providerProfilePolicy,
		globalPolicy,
		globalProviderPolicy,
		agentPolicy,
		agentProviderPolicy
	];
	const trailingPolicies = [
		params.sandboxToolPolicy,
		requesterPolicies.subagentPolicy,
		requesterPolicies.inheritedToolPolicy
	];
	return {
		allowed: isRuntimeToolAllowed("web_search", params.runtimeToolAllowlist) && isToolAllowedByPolicies("web_search", [
			...fixedPolicies,
			requesterPolicies.groupPolicy,
			requesterPolicies.senderPolicy,
			...trailingPolicies
		]),
		persistentAllowed: isToolAllowedByPolicies("web_search", [
			...fixedPolicies,
			persistentGroupPolicy,
			persistentSenderPolicy,
			...trailingPolicies
		])
	};
}
//#endregion
//#region src/agents/codex-native-web-search-core.ts
const OPENAI_AUTH_PROVIDER_IDS = ["openai"];
function isOpenAIAuthProviderId(provider) {
	return OPENAI_AUTH_PROVIDER_IDS.some((candidate) => candidate === provider);
}
/** Returns whether a model API can accept the native Codex web_search tool. */
function isCodexNativeSearchEligibleModel(params) {
	return params.modelApi === "openai-chatgpt-responses";
}
function hasCodexNativeWebSearchTool(tools) {
	if (!Array.isArray(tools)) return false;
	return tools.some((tool) => isRecord(tool) && typeof tool.type === "string" && tool.type === "web_search");
}
/** Checks whether OpenAI/Codex auth is available for native web search. */
function hasAvailableCodexAuth(params) {
	if (Object.values(params.config?.auth?.profiles ?? {}).some((profile) => isRecord(profile) && isOpenAIAuthProviderId(profile.provider) && (profile.mode === "oauth" || profile.mode === "token"))) return true;
	if (params.agentDir) try {
		const store = ensureAuthProfileStore(params.agentDir, { externalCli: externalCliDiscoveryForProviderAuth({
			cfg: params.config,
			provider: "openai"
		}) });
		if (OPENAI_AUTH_PROVIDER_IDS.some((provider) => listProfilesForProvider(store, provider).length > 0)) return true;
	} catch {}
	return false;
}
/** Resolves whether native search is active or why managed search should remain. */
function resolveCodexNativeSearchActivation(params) {
	const globalWebSearchEnabled = params.webSearchEnabled !== false && params.config?.tools?.web?.search?.enabled !== false;
	const codexConfig = resolveCodexNativeWebSearchConfig(params.config);
	const nativeEligible = isCodexNativeSearchEligibleModel(params);
	const hasRequiredAuth = params.modelApi !== "openai-chatgpt-responses" || !isOpenAIAuthProviderId(params.modelProvider) || hasAvailableCodexAuth(params);
	if (!globalWebSearchEnabled) return {
		globalWebSearchEnabled,
		codexNativeEnabled: codexConfig.enabled,
		codexMode: codexConfig.mode,
		nativeEligible,
		hasRequiredAuth,
		state: "managed_only",
		inactiveReason: "globally_disabled"
	};
	if (!codexConfig.enabled) return {
		globalWebSearchEnabled,
		codexNativeEnabled: false,
		codexMode: codexConfig.mode,
		nativeEligible,
		hasRequiredAuth,
		state: "managed_only",
		inactiveReason: "codex_not_enabled"
	};
	if (!nativeEligible) return {
		globalWebSearchEnabled,
		codexNativeEnabled: true,
		codexMode: codexConfig.mode,
		nativeEligible: false,
		hasRequiredAuth,
		state: "managed_only",
		inactiveReason: "model_not_eligible"
	};
	if (!hasRequiredAuth) return {
		globalWebSearchEnabled,
		codexNativeEnabled: true,
		codexMode: codexConfig.mode,
		nativeEligible: true,
		hasRequiredAuth: false,
		state: "managed_only",
		inactiveReason: "codex_auth_missing"
	};
	if (!isNativeWebSearchAllowedByToolPolicy(params)) return {
		globalWebSearchEnabled,
		codexNativeEnabled: true,
		codexMode: codexConfig.mode,
		nativeEligible: true,
		hasRequiredAuth: true,
		state: "managed_only",
		inactiveReason: "tool_policy_denied"
	};
	return {
		globalWebSearchEnabled,
		codexNativeEnabled: true,
		codexMode: codexConfig.mode,
		nativeEligible: true,
		hasRequiredAuth: true,
		state: "native_active"
	};
}
function isNativeWebSearchAllowedByToolPolicy(params) {
	return resolveWebSearchToolPolicy(params).allowed;
}
/** Builds the OpenAI Responses `web_search` tool payload from config. */
function buildCodexNativeWebSearchTool(config) {
	const nativeConfig = resolveCodexNativeWebSearchConfig(config);
	const tool = {
		type: "web_search",
		external_web_access: nativeConfig.mode === "live"
	};
	if (nativeConfig.allowedDomains) tool.filters = { allowed_domains: nativeConfig.allowedDomains };
	if (nativeConfig.contextSize) tool.search_context_size = nativeConfig.contextSize;
	if (nativeConfig.userLocation) tool.user_location = {
		type: "approximate",
		...nativeConfig.userLocation
	};
	return tool;
}
/** Injects a native Codex web-search tool into a mutable provider payload. */
function patchCodexNativeWebSearchPayload(params) {
	if (!isRecord(params.payload)) return { status: "payload_not_object" };
	const payload = params.payload;
	if (hasCodexNativeWebSearchTool(payload.tools)) return { status: "native_tool_already_present" };
	const tools = Array.isArray(payload.tools) ? [...payload.tools] : [];
	tools.push(buildCodexNativeWebSearchTool(params.config));
	payload.tools = tools;
	return { status: "injected" };
}
/** Returns whether the managed OpenClaw web-search tool should be hidden. */
function shouldSuppressManagedWebSearchTool(params) {
	return resolveCodexNativeSearchActivation(params).state === "native_active";
}
//#endregion
export { patchCodexNativeWebSearchPayload as a, resolveWebSearchToolPolicy as c, isNativeWebSearchAllowedByToolPolicy as i, hasAvailableCodexAuth as n, resolveCodexNativeSearchActivation as o, isCodexNativeSearchEligibleModel as r, shouldSuppressManagedWebSearchTool as s, buildCodexNativeWebSearchTool as t };
