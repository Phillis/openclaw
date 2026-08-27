import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { O as getRetainedLegacyDefaultAgentId, b as tryResolveLegacyCompatibilityAgentId, k as setRetainedLegacyDefaultAgentId } from "./agent-scope-config-BdXMWufB.js";
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
