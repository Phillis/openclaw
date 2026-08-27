import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { _ as isDefaultAgentRuntimeId, y as normalizeOptionalAgentRuntimeId } from "./openai-routing-mOc2UICM.js";
import { ht as getCliSessionBinding } from "./session-accessor-B-FKZX9M.js";
import { i as isCliRuntimeAliasForProvider } from "./model-runtime-aliases-CGiGCCsY.js";
//#region src/agents/harness/auto-selection.ts
/** Returns a prepared negative auto-selection fact, or undefined when full support needs probing. */
function resolveAgentHarnessAutoSelectionHint(params) {
	const providerIds = params.harness.autoSelection?.providerIds;
	if (providerIds === void 0) return;
	const provider = normalizeProviderId(params.provider);
	if (providerIds.some((id) => normalizeProviderId(id) === provider)) return;
	return {
		supported: false,
		reason: providerIds.length === 0 ? "harness is explicit-only" : "provider is not auto-selectable"
	};
}
//#endregion
//#region src/agents/session-runtime-compat.ts
/** Resolves the persisted runtime id, preserving locked transcript ownership. */
function resolvePersistedSessionRuntimeId(entry) {
	const harnessRuntime = normalizeOptionalAgentRuntimeId(entry?.agentHarnessId);
	if (entry?.modelSelectionLocked === true && harnessRuntime && !isDefaultAgentRuntimeId(harnessRuntime)) return harnessRuntime;
	const runtimeOverride = normalizeOptionalAgentRuntimeId(entry?.agentRuntimeOverride);
	if (runtimeOverride && !isDefaultAgentRuntimeId(runtimeOverride)) return runtimeOverride;
	return harnessRuntime;
}
/** Resolves a runtime id only when it can serve the selected provider. */
function resolveCompatibleAgentRuntimeForProvider(params) {
	const runtime = normalizeOptionalAgentRuntimeId(params.runtime);
	if (!runtime || isDefaultAgentRuntimeId(runtime)) return;
	if (runtime === "openclaw") return runtime;
	const provider = params.provider?.trim().toLowerCase() ?? "";
	if (runtime === "codex" && (provider === "codex" || provider === "openai")) return runtime;
	return isCliRuntimeAliasForProvider({
		provider,
		runtime,
		cfg: params.cfg
	}) ? runtime : void 0;
}
/** Resolves a persisted runtime override only when it can serve the selected provider. */
function resolveSessionRuntimeOverrideForProvider(params) {
	const lockedHarness = normalizeOptionalAgentRuntimeId(params.entry?.agentHarnessId);
	if (params.entry?.modelSelectionLocked === true && lockedHarness && !isDefaultAgentRuntimeId(lockedHarness)) return lockedHarness;
	return resolveCompatibleAgentRuntimeForProvider({
		provider: params.provider,
		runtime: params.entry?.agentRuntimeOverride,
		cfg: params.cfg
	});
}
/** Resolves the native CLI transcript that owns manual compaction for a session. */
function resolveManualCompactionCliTarget(params) {
	const runtimeOverride = normalizeOptionalAgentRuntimeId(params.entry?.agentRuntimeOverride);
	const runtimeConfig = runtimeOverride && getCliSessionBinding(params.entry, runtimeOverride) ? params.cfg : void 0;
	const historicalRuntime = normalizeOptionalAgentRuntimeId(params.entry?.agentHarnessId);
	const historicalRuntimeConfig = historicalRuntime && getCliSessionBinding(params.entry, historicalRuntime) ? params.cfg : void 0;
	const selectedRuntime = resolveSessionRuntimeOverrideForProvider({
		provider: params.provider,
		entry: params.entry,
		cfg: runtimeConfig
	});
	const persistedRuntime = params.entry?.modelSelectionLocked === true ? resolvePersistedSessionRuntimeId(params.entry) : selectedRuntime ?? (params.entry?.agentRuntimeOverride ? void 0 : resolveCompatibleAgentRuntimeForProvider({
		provider: params.provider,
		runtime: historicalRuntime,
		cfg: historicalRuntimeConfig
	}));
	if (persistedRuntime) {
		const cliSessionBinding = getCliSessionBinding(params.entry, persistedRuntime);
		return {
			agentHarnessId: persistedRuntime,
			cliSessionBinding,
			cliSessionId: cliSessionBinding?.sessionId
		};
	}
	const compatibleBindings = [.../* @__PURE__ */ new Set([
		...Object.keys(params.entry?.cliSessionBindings ?? {}),
		...Object.keys(params.entry?.cliSessionIds ?? {}),
		...params.entry?.claudeCliSessionId ? ["claude-cli"] : []
	])].flatMap((runtime) => {
		const compatibleRuntime = resolveCompatibleAgentRuntimeForProvider({
			provider: params.provider,
			runtime,
			cfg: params.cfg
		});
		const binding = compatibleRuntime ? getCliSessionBinding(params.entry, compatibleRuntime) : void 0;
		return compatibleRuntime && binding ? [{
			runtime: compatibleRuntime,
			binding
		}] : [];
	});
	const compatibleBinding = compatibleBindings.length === 1 ? compatibleBindings[0] : void 0;
	if (!compatibleBinding) return {};
	return {
		agentHarnessId: compatibleBinding.runtime,
		cliSessionBinding: compatibleBinding.binding,
		cliSessionId: compatibleBinding.binding.sessionId
	};
}
//#endregion
export { resolveAgentHarnessAutoSelectionHint as a, resolveSessionRuntimeOverrideForProvider as i, resolveManualCompactionCliTarget as n, resolvePersistedSessionRuntimeId as r, resolveCompatibleAgentRuntimeForProvider as t };
