import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { i as resolveAgentModelPrimaryValue } from "./model-input-ekSMR50U.js";
import { s as resolveAgentConfig } from "./agent-scope-config-BdXMWufB.js";
import { n as sanitizeTerminalText } from "./safe-text-DbwznzfG.js";
import { l as inferUniqueProviderFromConfiguredModels } from "./model-selection-shared-BSy9FczT.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import { r as theme } from "./theme-vjDs9tao.js";
import { _n as sessionEntryForkedFromParent } from "./session-accessor-Bi6bzKQE.js";
import { t as isCliProvider } from "./model-selection-cli-BKHYNvuu.js";
import "./model-selection-CMo6Emvk.js";
import { n as formatTimeAgo } from "./format-relative-DhTC8f11.js";
//#region src/commands/sessions-display-model.ts
/**
* Model display resolution for session listings.
*
* Session rows may carry persisted model/provider overrides or CLI-runtime
* model strings; this module normalizes them into display-ready model refs.
*/
function parseModelRef(raw, defaultProvider) {
	const trimmed = raw.trim();
	if (!trimmed) return {
		provider: defaultProvider,
		model: DEFAULT_MODEL
	};
	const slashIndex = trimmed.indexOf("/");
	if (slashIndex <= 0 || slashIndex === trimmed.length - 1) return {
		provider: defaultProvider,
		model: trimmed
	};
	return {
		provider: trimmed.slice(0, slashIndex).trim() || defaultProvider,
		model: trimmed.slice(slashIndex + 1).trim() || "gpt-5.6-sol"
	};
}
function resolveAgentPrimaryModel(cfg, agentId) {
	if (!agentId) return;
	return resolveAgentModelPrimaryValue(resolveAgentConfig(cfg, agentId)?.model);
}
function normalizeStoredOverrideModel(params) {
	const providerOverride = params.providerOverride?.trim();
	const modelOverride = params.modelOverride?.trim();
	if (!providerOverride || !modelOverride) return {
		providerOverride,
		modelOverride
	};
	const providerPrefix = `${providerOverride.toLowerCase()}/`;
	return {
		providerOverride,
		modelOverride: modelOverride.toLowerCase().startsWith(providerPrefix) ? modelOverride.slice(providerOverride.length + 1).trim() || modelOverride : modelOverride
	};
}
function resolveDefaultModelRef(cfg, agentId) {
	return parseModelRef(resolveAgentPrimaryModel(cfg, agentId) ?? resolveAgentModelPrimaryValue(cfg.agents?.defaults?.model) ?? "gpt-5.6-sol", DEFAULT_PROVIDER);
}
/** Resolves default display values for a session table scoped to an agent. */
function resolveSessionDisplayDefaults(cfg, agentId) {
	return { model: resolveDefaultModelRef(cfg, agentId).model };
}
function normalizeCliRuntimeDisplayRef(cfg, ref, defaultRef, classifyCliProvider) {
	if (!classifyCliProvider(ref.provider)) return ref;
	if (ref.model.includes("/")) {
		const parsed = parseModelRef(ref.model, defaultRef.provider);
		if (!classifyCliProvider(parsed.provider)) return parsed;
	}
	const inferredProvider = inferUniqueProviderFromConfiguredModels({
		cfg,
		model: ref.model
	});
	if (inferredProvider && !classifyCliProvider(inferredProvider)) return {
		provider: inferredProvider,
		model: ref.model
	};
	const parsed = parseModelRef(ref.model, defaultRef.provider);
	if (!classifyCliProvider(parsed.provider)) return parsed;
	return {
		provider: defaultRef.provider || ref.provider,
		model: parsed.model || ref.model
	};
}
/** Resolves only the model id to show for a session row. */
function resolveSessionDisplayModel(cfg, row, classifyCliProvider) {
	return resolveSessionDisplayModelRef(cfg, row, classifyCliProvider).model;
}
/** Resolves provider/model display metadata for a session row. */
function resolveSessionDisplayModelRef(cfg, row, classifyCliProvider = (provider) => isCliProvider(provider, cfg)) {
	const defaultRef = resolveDefaultModelRef(cfg, row.key.startsWith("agent:") ? row.key.split(":")[1] : void 0);
	const normalizedOverride = normalizeStoredOverrideModel({
		providerOverride: row.providerOverride,
		modelOverride: row.modelOverride
	});
	if (normalizedOverride.modelOverride) return parseModelRef(normalizedOverride.modelOverride, normalizedOverride.providerOverride ?? defaultRef.provider);
	if (row.model) return normalizeCliRuntimeDisplayRef(cfg, parseModelRef(row.model, row.modelProvider ?? defaultRef.provider), defaultRef, classifyCliProvider);
	return defaultRef;
}
/** Converts a persisted session entry into the shared display row shape. */
function toSessionDisplayRow(key, entry) {
	const updatedAt = entry?.updatedAt ?? null;
	return {
		key,
		updatedAt,
		ageMs: updatedAt ? Date.now() - updatedAt : null,
		sessionId: entry?.sessionId,
		spawnedBy: entry?.spawnedBy,
		spawnedWorkspaceDir: entry?.spawnedWorkspaceDir,
		spawnedCwd: entry?.spawnedCwd,
		parentSessionKey: entry?.parentSessionKey,
		forkedFromParent: sessionEntryForkedFromParent(entry) ? true : void 0,
		spawnDepth: entry?.spawnDepth,
		subagentRole: entry?.subagentRole,
		subagentControlScope: entry?.subagentControlScope,
		sessionStartedAt: entry?.sessionStartedAt,
		lastInteractionAt: entry?.lastInteractionAt,
		label: entry?.label,
		status: entry?.status,
		systemSent: entry?.systemSent,
		abortedLastRun: entry?.abortedLastRun,
		thinkingLevel: entry?.thinkingLevel,
		verboseLevel: entry?.verboseLevel,
		traceLevel: entry?.traceLevel,
		reasoningLevel: entry?.reasoningLevel,
		elevatedLevel: entry?.elevatedLevel,
		responseUsage: entry?.responseUsage,
		groupActivation: entry?.groupActivation,
		inputTokens: entry?.inputTokens,
		outputTokens: entry?.outputTokens,
		totalTokens: entry?.totalTokens,
		totalTokensFresh: entry?.totalTokensFresh,
		totalTokensVersion: entry?.totalTokensVersion,
		model: entry?.model,
		modelProvider: entry?.modelProvider,
		providerOverride: entry?.providerOverride,
		modelOverride: entry?.modelOverride,
		contextTokens: entry?.contextTokens
	};
}
/** Converts and sorts a session store by most recent activity first. */
function toSessionDisplayRows(store) {
	return Object.entries(store).map(([key, entry]) => toSessionDisplayRow(key, entry)).toSorted((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
}
function truncateSessionKey(key) {
	if (key.length <= 26) return key;
	return `${truncateUtf16Safe(key, Math.max(4, 16))}...${sliceUtf16Safe(key, -6)}`;
}
/** Formats a session key cell for table output. */
function formatSessionKeyCell(key, rich) {
	const label = truncateSessionKey(sanitizeTerminalText(key)).padEnd(26);
	return rich ? theme.accent(label) : label;
}
/** Formats a relative session age cell for table output. */
function formatSessionAgeCell(updatedAt, rich) {
	const padded = (updatedAt ? formatTimeAgo(Date.now() - updatedAt) : "unknown").padEnd(9);
	return rich ? theme.muted(padded) : padded;
}
/** Formats a model cell for table output. */
function formatSessionModelCell(model, rich) {
	const label = sanitizeTerminalText(model ?? "unknown").padEnd(14);
	return rich ? theme.info(label) : label;
}
/** Formats compact per-session flags for table output. */
function formatSessionFlagsCell(row, rich) {
	const label = sanitizeTerminalText([
		row.thinkingLevel ? `think:${row.thinkingLevel}` : null,
		row.verboseLevel ? `verbose:${row.verboseLevel}` : null,
		row.traceLevel ? `trace:${row.traceLevel}` : null,
		row.reasoningLevel ? `reasoning:${row.reasoningLevel}` : null,
		row.elevatedLevel ? `elev:${row.elevatedLevel}` : null,
		row.responseUsage ? `usage:${row.responseUsage}` : null,
		row.groupActivation ? `activation:${row.groupActivation}` : null,
		row.systemSent ? "system" : null,
		row.abortedLastRun ? "aborted" : null,
		row.runtimePolicySessionKey ? `policy:${row.runtimePolicySessionKey}` : null,
		row.sessionId ? `id:${row.sessionId}` : null
	].filter(Boolean).join(" "));
	return label.length === 0 ? "" : rich ? theme.muted(label) : label;
}
//#endregion
export { toSessionDisplayRow as a, resolveSessionDisplayModel as c, formatSessionModelCell as i, resolveSessionDisplayModelRef as l, formatSessionFlagsCell as n, toSessionDisplayRows as o, formatSessionKeyCell as r, resolveSessionDisplayDefaults as s, formatSessionAgeCell as t };
