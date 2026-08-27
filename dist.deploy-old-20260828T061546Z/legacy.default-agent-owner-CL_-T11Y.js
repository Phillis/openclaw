import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { A as getRetainedLegacyDefaultAgentId, C as tryResolveLegacyCompatibilityAgentId, j as setRetainedLegacyDefaultAgentId } from "./agent-scope-config-CUBiGmG3.js";
//#region src/config/legacy.default-agent-owner.ts
function retainLegacyDefaultAgentId(config, agentId) {
	setRetainedLegacyDefaultAgentId(config, agentId ? normalizeAgentId(agentId) : void 0);
	return config;
}
function inheritLegacyDefaultAgentId(source, target) {
	return retainLegacyDefaultAgentId(target, tryGetLegacyDefaultAgentId(source));
}
function tryGetLegacyDefaultAgentId(config) {
	return getRetainedLegacyDefaultAgentId(config);
}
function resolveSessionStoreCompatibilityAgentId(config) {
	const persistedAgentId = config.agents?.defaults?.sessionStore?.agentId?.trim();
	return persistedAgentId ? normalizeAgentId(persistedAgentId) : tryResolveLegacyCompatibilityAgentId(config) ?? "main";
}
//#endregion
export { tryGetLegacyDefaultAgentId as i, resolveSessionStoreCompatibilityAgentId as n, retainLegacyDefaultAgentId as r, inheritLegacyDefaultAgentId as t };
