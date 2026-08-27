import { _ as resolvePrimaryStringValue, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty, r as lowercasePreservingWhitespace } from "./string-coerce-CIXf7egm.js";
import { a as isPathInside } from "./path-CYL8StfC.js";
import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import "./path-guards-CQdx2c2I.js";
import "./utils-D9gvQMP6.js";
import { r as resolveAgentModelFallbackValues } from "./model-input-ekSMR50U.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { a as listAgentIds, b as tryResolveLegacyCompatibilityAgentId, d as resolveAgentWorkspaceDir, m as resolveMutableAgentEntry, p as resolveDefaultAgentId, s as resolveAgentConfig, t as AgentSelectionRequiredError } from "./agent-scope-config-CsnnOL14.js";
import { a as isSubagentSessionKey, c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-CLtsGq3M.js";
import { n as resolveEffectiveAgentSkillFilter } from "./agent-filter-CYpKkXA_.js";
import fs from "node:fs";
import path from "node:path";
//#region src/config/sessions/auth-profile-override-provenance.ts
function resolveSessionAuthProfileOverrideSource(entry) {
	if (!entry?.authProfileOverride?.trim()) return;
	const isAutomatic = typeof entry.authProfileOverrideCompactionCount === "number";
	return entry.authProfileOverrideSource || (isAutomatic ? "auto" : "user");
}
//#endregion
//#region src/config/sessions/model-override-provenance.ts
/** Detects model overrides created by automatic fallback provenance. */
function hasSessionAutoModelFallbackProvenance(entry) {
	const hasActiveOverride = Boolean(normalizeOptionalString(entry?.providerOverride) || normalizeOptionalString(entry?.modelOverride));
	return Boolean(hasActiveOverride && normalizeOptionalString(entry?.modelOverrideFallbackOriginProvider) && normalizeOptionalString(entry?.modelOverrideFallbackOriginModel));
}
/** Resolves persisted route provenance, including fallback pins from before the marker existed. */
function resolveSessionModelOverrideRouteResolution(entry) {
	return entry?.modelOverrideRouteResolution ?? (hasSessionAutoModelFallbackProvenance(entry) ? "resolved" : "raw");
}
/** Detects an active automatic fallback rather than a self-origin configured selection. */
function hasSessionActiveAutoModelFallback(entry) {
	if (!entry) return false;
	if (!hasSessionAutoModelFallbackProvenance(entry) || entry.modelOverrideSource !== void 0 && entry.modelOverrideSource !== "auto") return false;
	const originProvider = normalizeOptionalString(entry.modelOverrideFallbackOriginProvider);
	const originModel = normalizeOptionalString(entry.modelOverrideFallbackOriginModel);
	const overrideProvider = normalizeOptionalString(entry.providerOverride) ?? originProvider;
	const overrideModel = normalizeOptionalString(entry.modelOverride) ?? originModel;
	return overrideProvider !== originProvider || overrideModel !== originModel;
}
//#endregion
//#region src/agents/agent-scope.ts
/** Higher-level agent scope helpers for model selection, fallbacks, skills, and workspaces. */
/** Strip null bytes from paths to prevent ENOTDIR errors. */
function stripNullBytes(s) {
	return s.split("\0").join("");
}
const AUTO_FALLBACK_PRIMARY_PROBE_INTERVAL_MS = 300 * 1e3;
const AUTO_FALLBACK_PRIMARY_PROBE_MAX_KEYS = 4096;
const autoFallbackPrimaryProbeState = /* @__PURE__ */ new Map();
function autoFallbackPrimaryProbeStateKey(params) {
	return [normalizeOptionalString(params.sessionKey) ?? "", `${params.primaryProvider}/${params.primaryModel}`].join("\0");
}
function pruneAutoFallbackPrimaryProbeState(params) {
	const maxKeys = Math.max(1, Math.trunc(params.maxKeys ?? AUTO_FALLBACK_PRIMARY_PROBE_MAX_KEYS));
	const staleBefore = params.now - params.minIntervalMs;
	for (const [key, lastProbeAt] of params.state) if (!Number.isFinite(lastProbeAt) || lastProbeAt < staleBefore) params.state.delete(key);
	if (params.state.size <= maxKeys) return;
	const removeCount = params.state.size - maxKeys;
	let removed = 0;
	for (const key of params.state.keys()) {
		params.state.delete(key);
		removed += 1;
		if (removed >= removeCount) break;
	}
}
/** Detects old auto-fallback session entries that lack primary-origin metadata. */
function hasLegacyAutoFallbackWithoutOrigin(entry) {
	return entry?.modelOverrideSource === "auto" && (!normalizeOptionalString(entry.modelOverrideFallbackOriginProvider) || !normalizeOptionalString(entry.modelOverrideFallbackOriginModel));
}
function resolveAutoFallbackPrimaryProbe(params) {
	const entry = params.entry;
	if (!entry) return;
	const recoveredAutoFallbackOverride = entry.modelOverrideSource === void 0 && hasSessionAutoModelFallbackProvenance(entry);
	if (entry.modelOverrideSource !== "auto" && !recoveredAutoFallbackOverride) return;
	const originProvider = normalizeOptionalString(entry.modelOverrideFallbackOriginProvider);
	const originModel = normalizeOptionalString(entry.modelOverrideFallbackOriginModel);
	const overrideProvider = normalizeOptionalString(entry.providerOverride);
	const overrideModel = normalizeOptionalString(entry.modelOverride);
	const primaryProvider = normalizeOptionalString(params.primaryProvider);
	const primaryModel = normalizeOptionalString(params.primaryModel);
	if (!originProvider || !originModel || !overrideProvider || !overrideModel) return;
	if (!primaryProvider || !primaryModel) return;
	if (originProvider !== primaryProvider || originModel !== primaryModel) return;
	if (overrideProvider === originProvider && overrideModel === originModel) return;
	const now = params.now ?? Date.now();
	const minIntervalMs = params.minIntervalMs ?? AUTO_FALLBACK_PRIMARY_PROBE_INTERVAL_MS;
	const state = params.probeState ?? autoFallbackPrimaryProbeState;
	pruneAutoFallbackPrimaryProbeState({
		state,
		now,
		minIntervalMs,
		maxKeys: params.maxTrackedProbeKeys
	});
	const key = autoFallbackPrimaryProbeStateKey({
		sessionKey: params.sessionKey,
		primaryProvider: originProvider,
		primaryModel: originModel
	});
	const lastProbeAt = state.get(key);
	if (typeof lastProbeAt === "number" && Number.isFinite(lastProbeAt) && now - lastProbeAt < minIntervalMs) return;
	const fallbackAuthProfileId = normalizeOptionalString(entry.authProfileOverride);
	const fallbackAuthProfileIdSource = resolveSessionAuthProfileOverrideSource(entry);
	return {
		provider: originProvider,
		model: originModel,
		fallbackProvider: overrideProvider,
		fallbackModel: overrideModel,
		...fallbackAuthProfileId ? {
			fallbackAuthProfileId,
			...fallbackAuthProfileIdSource ? { fallbackAuthProfileIdSource } : {}
		} : {}
	};
}
function markAutoFallbackPrimaryProbe(params) {
	const now = params.now ?? Date.now();
	const minIntervalMs = params.minIntervalMs ?? AUTO_FALLBACK_PRIMARY_PROBE_INTERVAL_MS;
	const state = params.probeState ?? autoFallbackPrimaryProbeState;
	pruneAutoFallbackPrimaryProbeState({
		state,
		now,
		minIntervalMs,
		maxKeys: params.maxTrackedProbeKeys
	});
	const key = autoFallbackPrimaryProbeStateKey({
		sessionKey: params.sessionKey,
		primaryProvider: params.probe.provider,
		primaryModel: params.probe.model
	});
	state.set(key, now);
	pruneAutoFallbackPrimaryProbeState({
		state,
		now,
		minIntervalMs,
		maxKeys: params.maxTrackedProbeKeys
	});
}
function entryMatchesAutoFallbackPrimaryProbe(entry, probe) {
	if (!entry) return false;
	const recoveredAutoFallbackOverride = entry.modelOverrideSource === void 0 && hasSessionAutoModelFallbackProvenance(entry);
	if (entry.modelOverrideSource !== "auto" && !recoveredAutoFallbackOverride) return false;
	return normalizeOptionalString(entry.providerOverride) === probe.fallbackProvider && normalizeOptionalString(entry.modelOverride) === probe.fallbackModel && normalizeOptionalString(entry.modelOverrideFallbackOriginProvider) === probe.provider && normalizeOptionalString(entry.modelOverrideFallbackOriginModel) === probe.model;
}
function clearAutoFallbackPrimaryProbeSelection(entry, now = Date.now()) {
	delete entry.providerOverride;
	delete entry.modelOverride;
	delete entry.modelOverrideSource;
	delete entry.modelOverrideRouteResolution;
	delete entry.modelOverrideFallbackOriginProvider;
	delete entry.modelOverrideFallbackOriginModel;
	if (resolveSessionAuthProfileOverrideSource(entry) === "auto") {
		delete entry.authProfileOverride;
		delete entry.authProfileOverrideSource;
		delete entry.authProfileOverrideCompactionCount;
	}
	delete entry.fallbackNotice;
	entry.updatedAt = now;
}
function resolveSessionAgentIds(params) {
	const explicitAgentIdRaw = normalizeLowercaseStringOrEmpty(params.agentId);
	const explicitAgentId = explicitAgentIdRaw ? normalizeAgentId(explicitAgentIdRaw) : null;
	const fallbackAgentIdRaw = normalizeLowercaseStringOrEmpty(params.fallbackAgentId);
	const fallbackAgentId = fallbackAgentIdRaw ? normalizeAgentId(fallbackAgentIdRaw) : null;
	const sessionKey = params.sessionKey?.trim();
	const normalizedSessionKey = sessionKey ? normalizeLowercaseStringOrEmpty(sessionKey) : void 0;
	const parsed = normalizedSessionKey ? parseAgentSessionKey(normalizedSessionKey) : null;
	const sessionKeyAgentId = parsed?.agentId ? normalizeAgentId(parsed.agentId) : null;
	const cfg = params.config ?? {};
	const persistedStoreOwner = resolvePersistedSessionStoreOwnerForKey(cfg, sessionKey);
	if (sessionKeyAgentId && explicitAgentId && explicitAgentId !== sessionKeyAgentId) throw new AgentSelectionRequiredError(listAgentIds(cfg), {
		surface: "session agent resolution",
		hint: `The agent-scoped session key belongs to "${sessionKeyAgentId}", not "${explicitAgentId}".`
	});
	const requestedUnscopedAgentId = explicitAgentId ?? fallbackAgentId;
	if (!sessionKeyAgentId && persistedStoreOwner.kind === "retired") throw new AgentSelectionRequiredError(listAgentIds(cfg), {
		surface: "session agent resolution",
		hint: `The shared fixed-store row belongs to retired agent "${persistedStoreOwner.agentId}".`
	});
	if (!sessionKeyAgentId && persistedStoreOwner.kind === "configured" && requestedUnscopedAgentId && requestedUnscopedAgentId !== persistedStoreOwner.agentId) throw new AgentSelectionRequiredError(listAgentIds(cfg), {
		surface: "session agent resolution",
		hint: `The shared fixed-store row belongs to "${persistedStoreOwner.agentId}", not "${requestedUnscopedAgentId}".`
	});
	const compatibilityAgentId = tryResolveLegacyCompatibilityAgentId(cfg);
	const sessionAgentId = sessionKeyAgentId ?? (persistedStoreOwner.kind === "configured" ? persistedStoreOwner.agentId : void 0) ?? requestedUnscopedAgentId ?? compatibilityAgentId ?? resolveDefaultAgentId(cfg, {
		surface: "session agent resolution",
		hint: "Pass an agentId, an agent-scoped session key, or a prepared fallbackAgentId."
	});
	return {
		defaultAgentId: compatibilityAgentId ?? sessionAgentId,
		sessionAgentId
	};
}
function resolveSessionAgentId(params) {
	return resolveSessionAgentIds(params).sessionAgentId;
}
function resolveAgentExecutionContract(cfg, agentId) {
	const defaultContract = cfg?.agents?.defaults?.embeddedAgent?.executionContract;
	if (!cfg || !agentId) return defaultContract;
	return resolveAgentConfig(cfg, agentId)?.embeddedAgent?.executionContract ?? defaultContract;
}
function resolveAgentSkillsFilter(cfg, agentId) {
	return resolveEffectiveAgentSkillFilter(cfg, agentId);
}
function resolveAgentExplicitModelPrimary(cfg, agentId) {
	const raw = resolveAgentConfig(cfg, agentId)?.model;
	return resolvePrimaryStringValue(raw);
}
function resolveAgentEffectiveModelPrimary(cfg, agentId) {
	return resolveAgentExplicitModelPrimary(cfg, agentId) ?? resolvePrimaryStringValue(cfg.agents?.defaults?.model);
}
function updateAgentModelPrimary(existing, primary) {
	if (existing && typeof existing === "object" && !Array.isArray(existing)) return {
		...existing,
		primary
	};
	return primary;
}
function setAgentEffectiveModelPrimary(cfg, agentId, primary, options = {}) {
	const id = normalizeAgentId(agentId);
	if (options.forceAgent || resolveAgentExplicitModelPrimary(cfg, id)) {
		const entry = resolveMutableAgentEntry(cfg, id);
		if (entry) {
			entry.model = updateAgentModelPrimary(entry.model, primary);
			return "agent";
		}
		if (options.forceAgent) throw new Error(`Could not resolve configured agent "${id}".`);
	}
	cfg.agents ??= {};
	cfg.agents.defaults ??= {};
	cfg.agents.defaults.model = updateAgentModelPrimary(cfg.agents.defaults.model, primary);
	return "defaults";
}
function resolveAgentModelFallbacksOverride(cfg, agentId) {
	return resolveSelectedModelFallbacksOverride(resolveAgentConfig(cfg, agentId)?.model);
}
function resolveSelectedModelFallbacksOverride(raw) {
	if (!raw) return;
	if (typeof raw === "string") return resolvePrimaryStringValue(raw) ? [] : void 0;
	if (!Object.hasOwn(raw, "fallbacks")) return Object.hasOwn(raw, "primary") && resolvePrimaryStringValue(raw) ? [] : void 0;
	return Array.isArray(raw.fallbacks) ? raw.fallbacks : void 0;
}
function resolveFirstModelFallbacksOverride(candidates) {
	for (const candidate of candidates) {
		const fallbackOverride = resolveSelectedModelFallbacksOverride(candidate);
		if (fallbackOverride !== void 0) return fallbackOverride;
	}
}
function resolveSubagentModelConfigSelectionResult(params) {
	const agentConfig = params.agentConfigOverride ?? (params.agentId ? resolveAgentConfig(params.cfg, params.agentId) : void 0);
	return [
		...agentConfig?.subagents?.model ? [{
			raw: agentConfig.subagents.model,
			source: "subagent"
		}] : [],
		...params.cfg.agents?.defaults?.subagents?.model ? [{
			raw: params.cfg.agents.defaults.subagents.model,
			source: "default-subagent"
		}] : [],
		...agentConfig?.model ? [{
			raw: agentConfig.model,
			source: "agent"
		}] : []
	].find((candidate) => resolvePrimaryStringValue(candidate.raw));
}
function resolveSubagentModelFallbacksOverride(cfg, agentId) {
	const agentConfig = resolveAgentConfig(cfg, agentId);
	const subagentFallbacks = resolveSelectedModelFallbacksOverride(agentConfig?.subagents?.model);
	if (subagentFallbacks !== void 0) return subagentFallbacks;
	const selection = resolveSubagentModelConfigSelectionResult({
		cfg,
		agentId
	});
	if (selection?.source === "agent") return resolveSelectedModelFallbacksOverride(agentConfig?.model);
	if (selection?.source === "default-subagent") return resolveSelectedModelFallbacksOverride(cfg.agents?.defaults?.subagents?.model);
}
function resolveSubagentSpawnModelFallbacksOverride(cfg, agentId) {
	const agentConfig = resolveAgentConfig(cfg, agentId);
	return resolveFirstModelFallbacksOverride([
		agentConfig?.subagents?.model,
		cfg.agents?.defaults?.subagents?.model,
		agentConfig?.model
	]);
}
function resolveRunModelFallbacksOverride(params) {
	if (!params.cfg) return;
	const explicitAgentId = normalizeOptionalString(params.agentId);
	const agentId = explicitAgentId ? normalizeAgentId(explicitAgentId) : listAgentIds(params.cfg).length > 0 ? resolveSessionAgentIds({
		config: params.cfg,
		sessionKey: params.sessionKey ?? void 0
	}).sessionAgentId : void 0;
	return agentId ? resolveAgentModelFallbacksOverride(params.cfg, agentId) : void 0;
}
function hasConfiguredModelFallbacks(params) {
	const fallbacksOverride = resolveRunModelFallbacksOverride(params);
	const defaultFallbacks = resolveAgentModelFallbackValues(params.cfg?.agents?.defaults?.model);
	return (fallbacksOverride ?? defaultFallbacks).length > 0;
}
function resolveEffectiveModelFallbacks(params) {
	const agentFallbacksOverride = resolveAgentModelFallbacksOverride(params.cfg, params.agentId);
	if (!params.hasSessionModelOverride) return agentFallbacksOverride;
	if (!(params.modelOverrideSource === "auto" || params.modelOverrideSource === void 0 && params.hasAutoFallbackProvenance === true)) return [];
	const subagentFallbacksOverride = isSubagentSessionKey(params.sessionKey) ? resolveSubagentSpawnModelFallbacksOverride(params.cfg, params.agentId) : void 0;
	if (subagentFallbacksOverride !== void 0) return subagentFallbacksOverride;
	const defaultFallbacks = resolveAgentModelFallbackValues(params.cfg.agents?.defaults?.model);
	return agentFallbacksOverride ?? defaultFallbacks;
}
function normalizePathForComparison(input) {
	const resolved = path.resolve(stripNullBytes(resolveUserPath(input)));
	let normalized = resolved;
	try {
		normalized = fs.realpathSync.native(resolved);
	} catch {}
	if (process.platform === "win32") return lowercasePreservingWhitespace(normalized);
	return normalized;
}
function resolveAgentIdByWorkspacePath(cfg, workspacePath) {
	const normalizedWorkspacePath = normalizePathForComparison(workspacePath);
	let matchedAgentId;
	let matchedWorkspaceLength = -1;
	for (const id of listAgentIds(cfg)) {
		const workspaceDir = normalizePathForComparison(resolveAgentWorkspaceDir(cfg, id));
		if (!isPathInside(workspaceDir, normalizedWorkspacePath)) continue;
		if (workspaceDir.length > matchedWorkspaceLength) {
			matchedAgentId = id;
			matchedWorkspaceLength = workspaceDir.length;
		}
	}
	return matchedAgentId;
}
//#endregion
export { resolveSessionAuthProfileOverrideSource as C, resolveSessionModelOverrideRouteResolution as S, resolveSubagentModelConfigSelectionResult as _, markAutoFallbackPrimaryProbe as a, hasSessionActiveAutoModelFallback as b, resolveAgentExplicitModelPrimary as c, resolveAgentSkillsFilter as d, resolveAutoFallbackPrimaryProbe as f, resolveSessionAgentIds as g, resolveSessionAgentId as h, hasLegacyAutoFallbackWithoutOrigin as i, resolveAgentIdByWorkspacePath as l, resolveRunModelFallbacksOverride as m, entryMatchesAutoFallbackPrimaryProbe as n, resolveAgentEffectiveModelPrimary as o, resolveEffectiveModelFallbacks as p, hasConfiguredModelFallbacks as r, resolveAgentExecutionContract as s, clearAutoFallbackPrimaryProbeSelection as t, resolveAgentModelFallbacksOverride as u, resolveSubagentModelFallbacksOverride as v, hasSessionAutoModelFallbackProvenance as x, setAgentEffectiveModelPrimary as y };
