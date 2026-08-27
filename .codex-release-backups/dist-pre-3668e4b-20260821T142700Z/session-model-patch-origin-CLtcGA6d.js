import { a as resolveSessionModelRef } from "./placement-session-runtime-D3R4yOqT.js";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/config/sessions/session-model-fallback.ts
function createAgentPatchedSessionModelFallback(params) {
	const { entry } = params;
	return {
		prevModel: params.model,
		prevProvider: params.provider,
		...entry.modelOverride ? { prevModelOverride: entry.modelOverride } : {},
		...entry.providerOverride ? { prevProviderOverride: entry.providerOverride } : {},
		...entry.modelOverrideSource ? { prevModelOverrideSource: entry.modelOverrideSource } : {},
		...entry.modelOverrideRouteResolution ? { prevModelOverrideRouteResolution: entry.modelOverrideRouteResolution } : {},
		...entry.modelOverrideFallbackOriginProvider ? { prevModelOverrideFallbackOriginProvider: entry.modelOverrideFallbackOriginProvider } : {},
		...entry.modelOverrideFallbackOriginModel ? { prevModelOverrideFallbackOriginModel: entry.modelOverrideFallbackOriginModel } : {},
		...entry.authProfileOverride ? { prevAuthProfileOverride: entry.authProfileOverride } : {},
		...entry.authProfileOverrideSource ? { prevAuthProfileOverrideSource: entry.authProfileOverrideSource } : {},
		...entry.authProfileOverrideCompactionCount !== void 0 ? { prevAuthProfileOverrideCompactionCount: entry.authProfileOverrideCompactionCount } : {},
		...entry.thinkingLevel ? { prevThinkingLevel: entry.thinkingLevel } : {},
		ts: params.ts,
		source: "agent-patch"
	};
}
//#endregion
//#region src/gateway/session-model-patch-origin.ts
const agentSessionModelPatch = new AsyncLocalStorage();
function withAgentSessionModelPatchOrigin(run) {
	return agentSessionModelPatch.run(true, run);
}
function isAgentSessionModelPatchOrigin() {
	return agentSessionModelPatch.getStore() === true;
}
function snapshotAgentModelFallback(cfg, entry, agentId, now) {
	const prior = resolveSessionModelRef(cfg, entry, agentId);
	return createAgentPatchedSessionModelFallback({
		model: prior.model,
		provider: prior.provider,
		entry,
		ts: now
	});
}
//#endregion
export { createAgentPatchedSessionModelFallback as i, snapshotAgentModelFallback as n, withAgentSessionModelPatchOrigin as r, isAgentSessionModelPatchOrigin as t };
