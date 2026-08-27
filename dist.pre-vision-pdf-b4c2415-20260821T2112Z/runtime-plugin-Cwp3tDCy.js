import { _ as isDefaultAgentRuntimeId, y as normalizeOptionalAgentRuntimeId } from "./openai-routing-BGuHAkXI.js";
import { t as resolveAgentHarnessPolicy } from "./policy-BHrZvZfs.js";
import { s as pluginInstallPathMatchesRoot } from "./runtime-degraded-state-BGAUzsaR.js";
import { i as isCliRuntimeAliasForProvider } from "./model-runtime-aliases-HmfG8BuO.js";
import { n as resolveAgentHarnessOwnerPluginIds } from "./runtime-plugin-load-plan-WnHtkIH9.js";
//#region src/agents/harness/runtime-plugin.ts
/**
* Resolves whether manifest-owned harness code is loadable without importing it.
* Callers must pass the result of a payload check performed for this invocation.
*/
function resolveAgentHarnessRuntimeAvailability(params) {
	const runtime = params.runtime.trim();
	const ownerPluginIds = resolveAgentHarnessOwnerPluginIds({
		...params,
		runtime
	});
	if (ownerPluginIds.length === 0) return {
		status: "unavailable",
		ownerPluginIds,
		reason: "owner-plugin-not-activatable",
		detail: `No enabled plugin owns agent harness "${runtime}".`
	};
	const checkedPluginIds = new Set(params.payloadCheckedPluginIds);
	const unverifiedOwner = ownerPluginIds.find((pluginId) => !params.selectedPluginRootDirs.has(pluginId) || !checkedPluginIds.has(pluginId));
	if (unverifiedOwner) return {
		status: "unavailable",
		ownerPluginIds,
		reason: "owner-plugin-unverified",
		detail: `Agent harness "${runtime}" owner plugin "${unverifiedOwner}" payload was not verified.`
	};
	const failedOwner = params.payloadFailures.find((failure) => {
		if (!ownerPluginIds.includes(failure.pluginId)) return false;
		const selectedRootDir = params.selectedPluginRootDirs.get(failure.pluginId);
		return selectedRootDir ? pluginInstallPathMatchesRoot(failure.installPath, selectedRootDir) : false;
	});
	if (failedOwner) return {
		status: "unavailable",
		ownerPluginIds,
		reason: "owner-plugin-degraded",
		detail: `Agent harness "${runtime}" owner plugin "${failedOwner.pluginId}" is unavailable (${failedOwner.reason}).`
	};
	return {
		status: "available",
		ownerPluginIds
	};
}
/** Resolves the selected harness from the run-owned registry without loading or activating. */
async function ensureSelectedAgentHarnessPlugin(params) {
	const pinnedHarnessId = normalizeOptionalAgentRuntimeId(params.agentHarnessId);
	const runtimeOverride = normalizeOptionalAgentRuntimeId(params.agentHarnessRuntimeOverride);
	const policy = resolveAgentHarnessPolicy({
		provider: params.provider,
		modelId: params.modelId,
		config: params.config,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		requestTransportOverrides: params.requestTransportOverrides
	});
	const requestedRuntime = pinnedHarnessId ?? runtimeOverride;
	const runtime = requestedRuntime && !isDefaultAgentRuntimeId(requestedRuntime) ? requestedRuntime : policy.runtime;
	if (isDefaultAgentRuntimeId(runtime) || runtime === "openclaw" || isCliRuntimeAliasForProvider({
		runtime,
		provider: params.provider,
		cfg: params.config
	})) return;
	if (!params.pluginRegistry?.agentHarnesses.some((entry) => entry.harness.id === runtime)) throw new Error(`Agent harness runtime "${runtime}" is unavailable because its plugin registration is missing from this prepared run. Enable or reinstall the plugin that provides this runtime, restart the Gateway, then retry.`);
}
//#endregion
export { resolveAgentHarnessRuntimeAvailability as n, ensureSelectedAgentHarnessPlugin as t };
