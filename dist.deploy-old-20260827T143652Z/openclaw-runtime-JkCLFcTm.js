import "./redact-Cl7lwBnl.js";
import "./fs-safe-C9N8pCh1.js";
import "./utils-DEqefz4f.js";
import "./paths-CqeDjSA4.js";
import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import "./agent-scope-BizOtGGz.js";
import "./artifacts-Cg2BoGvO.js";
import "./paths-B2oibYbs.js";
import "./subsystem-CDLhGl2-.js";
import "./parse-duration-CuuCHKpt.js";
import "./types.secrets-BrIfhxSG.js";
import "./openclaw-state-db-DlCMR4eQ.js";
import "./sqlite-wal-B0_s-lfW.js";
import "./internal-runtime-context-E3ku7Huk.js";
import "./config-Dl8DJbzM.js";
import "./run-with-concurrency-BHgpSCM6.js";
import { n as resolveProviderEndpoint } from "./provider-attribution-iFUXefU9.js";
import "./mime-Hm4eS2i0.js";
import "./main-session-er-Gn_t_.js";
import "./session-accessor-Bi6bzKQE.js";
import { k as readTranscriptStatsSync } from "./session-accessor.sqlite-transcript-store-E-m-_aAq.js";
import "./transcript-events-D-a7D51Y.js";
import { n as MIN_PROMPT_BUDGET_TOKENS, t as MIN_PROMPT_BUDGET_RATIO } from "./agent-compaction-constants-BHnSZLzH.js";
import "./common-BGOZLJ2_.js";
import "./input-provenance-BA6fPshG.js";
import "./heartbeat-BB6nm0Fy.js";
import "./heartbeat-filter-RigS-vEa.js";
import "./memory-state-DhEOmKyi.js";
import "./memory-search-DG7CB6wz.js";
import "./current-time-D-I8cLSc.js";
import "./memory-embedding-provider-runtime-DhdVX9jH.js";
import "./session-store-runtime-BsqwEEwm.js";
import "./heartbeat-events-filter-3knu9SYy.js";
import "./config-schema-CkCZDriU.js";
//#region src/agents/agent-settings.ts
/** Applies agent compaction settings and small-context overflow guards. */
const DEFAULT_AGENT_COMPACTION_RESERVE_TOKENS_FLOOR = 2e4;
function toPositiveInt(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return;
	return Math.floor(value);
}
/** Returns a configured context-usage fraction (0 < x < 1) or undefined when unset/invalid. */
function resolveConfiguredContextUsageThreshold(cfg) {
	const value = cfg?.agents?.defaults?.compaction?.contextUsageThreshold;
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0 || value >= 1) return;
	return value;
}
/** Applies configured compaction reserve/keep-recent settings to an agent settings manager. */
function applyAgentCompactionSettingsFromConfig(params) {
	const currentReserveTokens = params.settingsManager.getCompactionReserveTokens();
	const currentKeepRecentTokens = params.settingsManager.getCompactionKeepRecentTokens();
	const compactionCfg = params.cfg?.agents?.defaults?.compaction;
	const configuredEnabled = compactionCfg?.enabled;
	const configuredKeepRecentTokens = toPositiveInt(compactionCfg?.keepRecentTokens);
	let reserveTokensFloor = DEFAULT_AGENT_COMPACTION_RESERVE_TOKENS_FLOOR;
	let maxReserveTokens;
	const contextTokenBudget = toPositiveInt(params.contextTokenBudget);
	if (contextTokenBudget !== void 0) {
		const minPromptBudget = Math.min(MIN_PROMPT_BUDGET_TOKENS, Math.max(1, Math.floor(contextTokenBudget * MIN_PROMPT_BUDGET_RATIO)));
		maxReserveTokens = Math.max(0, contextTokenBudget - minPromptBudget);
		reserveTokensFloor = Math.min(reserveTokensFloor, maxReserveTokens);
	}
	let targetReserveTokens = Math.max(currentReserveTokens, reserveTokensFloor);
	if (maxReserveTokens !== void 0) targetReserveTokens = Math.min(targetReserveTokens, maxReserveTokens);
	const targetKeepRecentTokens = configuredKeepRecentTokens ?? currentKeepRecentTokens;
	const overrides = {};
	if (targetReserveTokens !== currentReserveTokens) overrides.reserveTokens = targetReserveTokens;
	if (targetKeepRecentTokens !== currentKeepRecentTokens) overrides.keepRecentTokens = targetKeepRecentTokens;
	const configuredThreshold = resolveConfiguredContextUsageThreshold(params.cfg);
	if (configuredThreshold !== void 0) overrides.contextUsageThreshold = configuredThreshold;
	const shouldApplyEnabled = configuredEnabled !== void 0 && typeof params.settingsManager.setCompactionEnabled === "function" && (typeof params.settingsManager.getCompactionEnabled !== "function" || params.settingsManager.getCompactionEnabled() !== configuredEnabled);
	if (shouldApplyEnabled) params.settingsManager.setCompactionEnabled(configuredEnabled);
	if (Object.keys(overrides).length > 0) params.settingsManager.applyOverrides({ compaction: overrides });
	return {
		didOverride: shouldApplyEnabled || Object.keys(overrides).length > 0,
		compaction: {
			reserveTokens: targetReserveTokens,
			keepRecentTokens: targetKeepRecentTokens
		}
	};
}
/** Resolve the compaction mode after provider-backed safeguard promotion. */
function resolveEffectiveCompactionMode(cfg) {
	const compaction = cfg?.agents?.defaults?.compaction;
	if (compaction?.provider) return "safeguard";
	return compaction?.mode === "safeguard" ? "safeguard" : "default";
}
/**
* Detect providers whose shared model runtime `isContextOverflow` Case 2 (silent overflow)
* fires on a successful turn and triggers OpenClaw runtime's `_runAutoCompaction` from
* inside `Session.prompt()`, collapsing `agent.state.messages` before the
* provider call (openclaw#75799).
*
* True on any of: `zai-native` endpoint class, normalized provider id `zai`,
* a `z-ai/` / `openrouter/z-ai/` model-id namespace prefix, or a bare `glm-`
* model id (no namespace prefix) — the latter covers in-house gateways that
* expose Zhipu's GLM family directly without a `z-ai/` qualifier. Intentionally
* narrow: namespaced GLM ids that route through other providers (e.g.
* `ollama/glm-*`, `opencode-go/glm-*`) are NOT included because their hosts
* have their own overflow accounting and may not exhibit the z.ai silent-
* overflow shape. Other providers documented as silently truncating are not
* added without a reproducible repro.
*/
function isSilentOverflowProneModel(model) {
	if (normalizeProviderId(typeof model.provider === "string" ? model.provider : "") === "zai") return true;
	if (typeof model.baseUrl === "string" && model.baseUrl.length > 0) {
		if (resolveProviderEndpoint(model.baseUrl).endpointClass === "zai-native") return true;
	}
	if (typeof model.modelId === "string" && model.modelId.length > 0) {
		const normalized = model.modelId.toLowerCase();
		if (normalized.startsWith("z-ai/") || normalized.startsWith("openrouter/z-ai/") || normalized.startsWith("glm-")) return true;
	}
	return false;
}
/**
* Disable OpenClaw runtime's `_checkCompaction → _runAutoCompaction` (which would otherwise
* fire from inside `Session.prompt()` and reassign `agent.state.messages`
* before the provider call) when OpenClaw or a plugin owns compaction:
* `contextEngineInfo.ownsCompaction === true`, effective safeguard compaction,
* or an active model that is silent-overflow-prone (openclaw#75799).
* Default-mode runs against ordinary providers keep OpenClaw runtime's auto-compaction as
* the existing baseline.
*/
function shouldDisableAgentAutoCompaction(params) {
	return params.contextEngineInfo?.ownsCompaction === true || params.compactionMode === "safeguard" || params.silentOverflowProneProvider === true;
}
/**
* Apply the auto-compaction guard. Callers that reload a `DefaultResourceLoader`
* MUST call this AGAIN after each `reload()` — `settingsManager.reload()`
* rehydrates `compaction.enabled` from disk and silently restores OpenClaw runtime's
* default-on behavior, undoing the guard. Mirrors the existing
* `applyAgentCompactionSettingsFromConfig` re-call pattern at the same sites.
*/
function applyAgentAutoCompactionGuard(params) {
	const disable = shouldDisableAgentAutoCompaction({
		contextEngineInfo: params.contextEngineInfo,
		compactionMode: params.compactionMode,
		silentOverflowProneProvider: params.silentOverflowProneProvider
	});
	const hasMethod = typeof params.settingsManager.setCompactionEnabled === "function";
	if (!disable || !hasMethod) return {
		supported: hasMethod,
		disabled: false
	};
	params.settingsManager.setCompactionEnabled(false);
	return {
		supported: true,
		disabled: true
	};
}
//#endregion
//#region packages/memory-host-sdk/src/host/openclaw-runtime.ts
/** Returns an opaque revision that changes for every canonical transcript mutation. */
function readTranscriptContentRevisionSync(params) {
	const stats = readTranscriptStatsSync(params);
	return [
		"sqlite",
		stats.maxSeq,
		stats.sizeBytes,
		stats.eventCount,
		stats.lastMutationAtMs ?? "",
		stats.lastObservedMutationAtMs ?? ""
	].join(":");
}
//#endregion
export { isSilentOverflowProneModel as a, applyAgentCompactionSettingsFromConfig as i, DEFAULT_AGENT_COMPACTION_RESERVE_TOKENS_FLOOR as n, resolveEffectiveCompactionMode as o, applyAgentAutoCompactionGuard as r, readTranscriptContentRevisionSync as t };
