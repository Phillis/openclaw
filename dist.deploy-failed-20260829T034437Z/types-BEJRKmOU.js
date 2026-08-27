import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { l as asNonNegativeFiniteNumber } from "./number-coercion-CLj0HTDM.js";
import { r as collectActiveSessionWorkAdmissions } from "./session-lifecycle-admission-1qqb7Ac0.js";
import { a as normalizeStoreSessionKey } from "./store-entry-CwpzgKGD.js";
import crypto from "node:crypto";
//#region src/config/sessions/store-maintenance-preserve.ts
const preserveKeysProviders = /* @__PURE__ */ new Set();
/** Registers a provider for session maintenance preserve keys. */
function registerSessionMaintenancePreserveKeysProvider(provider) {
	preserveKeysProviders.add(provider);
	return () => {
		preserveKeysProviders.delete(provider);
	};
}
function addSessionMaintenancePreserveKey(keys, value) {
	const normalized = normalizeStoreSessionKey(value ?? "");
	if (normalized) keys.add(normalized);
}
function addSessionMaintenancePreserveKeys(keys, values) {
	for (const value of values ?? []) addSessionMaintenancePreserveKey(keys, value);
}
/** Collects normalized session keys that maintenance/pruning must preserve. */
function collectSessionMaintenancePreserveKeys(baseKeys) {
	const keys = /* @__PURE__ */ new Set();
	addSessionMaintenancePreserveKeys(keys, baseKeys);
	for (const provider of preserveKeysProviders) try {
		addSessionMaintenancePreserveKeys(keys, provider());
	} catch {}
	return keys.size > 0 ? keys : void 0;
}
/** Resolves store keys owned by active work, including aliases sharing a backing session id. */
function collectActiveSessionWorkAdmissionKeys(params) {
	const activeIdentities = collectActiveSessionWorkAdmissions().get(params.storePath) ?? /* @__PURE__ */ new Set();
	if (activeIdentities.size === 0) return;
	const normalizedIdentities = new Set(Array.from(activeIdentities, (identity) => normalizeStoreSessionKey(identity)));
	const keys = /* @__PURE__ */ new Set();
	for (const [key, entry] of Object.entries(params.store)) if (normalizedIdentities.has(normalizeStoreSessionKey(key)) || activeIdentities.has(entry.sessionId)) {
		keys.add(key);
		keys.add(normalizeStoreSessionKey(key));
	}
	return keys.size > 0 ? keys : void 0;
}
/** Collects every runtime and active-work key protected from automatic maintenance. */
function collectSessionMaintenancePreserveKeysForStore(params) {
	const keys = collectSessionMaintenancePreserveKeys(params.baseKeys) ?? /* @__PURE__ */ new Set();
	for (const key of collectActiveSessionWorkAdmissionKeys({
		storePath: params.storePath,
		store: params.store
	}) ?? []) keys.add(key);
	return keys.size > 0 ? keys : void 0;
}
function isTerminalSessionStatus(status) {
	return status === "done" || status === "failed" || status === "killed" || status === "timeout";
}
function isSessionPluginTraceLine(line) {
	const trimmed = line.trim();
	return trimmed.startsWith("🔎 ") || /(?:^|\s)(?:Debug|Trace):/.test(trimmed);
}
function resolveSessionPluginLines(entry, includeLine) {
	return Array.isArray(entry?.pluginDebugEntries) ? entry.pluginDebugEntries.flatMap((pluginEntry) => Array.isArray(pluginEntry?.lines) ? pluginEntry.lines.filter((line) => typeof line === "string" && line.trim().length > 0 && includeLine(line)) : []) : [];
}
function resolveSessionPluginStatusLines(entry) {
	return resolveSessionPluginLines(entry, (line) => !isSessionPluginTraceLine(line));
}
function resolveSessionPluginTraceLines(entry) {
	return resolveSessionPluginLines(entry, isSessionPluginTraceLine);
}
function normalizeSessionRuntimeModelFields(entry) {
	const normalizedModel = normalizeOptionalString(entry.model);
	const normalizedProvider = normalizeOptionalString(entry.modelProvider);
	let next = entry;
	if (!normalizedModel) {
		if (entry.model !== void 0 || entry.modelProvider !== void 0) {
			next = { ...next };
			delete next.model;
			delete next.modelProvider;
		}
		return next;
	}
	if (entry.model !== normalizedModel) {
		if (next === entry) next = { ...next };
		next.model = normalizedModel;
	}
	if (!normalizedProvider) {
		if (entry.modelProvider !== void 0) {
			if (next === entry) next = { ...next };
			delete next.modelProvider;
		}
		return next;
	}
	if (entry.modelProvider !== normalizedProvider) {
		if (next === entry) next = { ...next };
		next.modelProvider = normalizedProvider;
	}
	return next;
}
function setSessionRuntimeModel(entry, runtime) {
	const provider = runtime.provider.trim();
	const model = runtime.model.trim();
	if (!provider || !model) return false;
	entry.modelProvider = provider;
	entry.model = model;
	return true;
}
function resolveMergedUpdatedAt(existing, patch, options) {
	const now = options?.now ?? Date.now();
	const existingUpdatedAt = normalizeMergedUpdatedAt(existing?.updatedAt, now);
	const patchUpdatedAt = normalizeMergedUpdatedAt(patch.updatedAt, now);
	if (options?.policy === "preserve-activity" && existing) return existingUpdatedAt ?? patchUpdatedAt ?? now;
	return Math.max(existingUpdatedAt ?? 0, patchUpdatedAt ?? 0, now);
}
function normalizeMergedUpdatedAt(value, now) {
	if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return;
	return Math.min(value, now);
}
function mergeSessionEntryWithPolicy(existing, patch, options) {
	const sessionId = patch.sessionId ?? existing?.sessionId ?? crypto.randomUUID();
	const updatedAt = resolveMergedUpdatedAt(existing, patch, options);
	if (!existing) return stripRetiredSessionEntryLocators(normalizeSessionRuntimeModelFields({
		...patch,
		sessionId,
		updatedAt,
		sessionStartedAt: patch.sessionStartedAt ?? updatedAt
	}));
	const next = {
		...existing,
		...patch,
		sessionId,
		updatedAt,
		sessionStartedAt: patch.sessionStartedAt ?? (existing.sessionId === sessionId ? existing.sessionStartedAt : updatedAt)
	};
	if (existing.createdVia !== void 0) next.createdVia = existing.createdVia;
	if (existing.createdActor !== void 0) next.createdActor = existing.createdActor;
	if (existing.sandbox === "required") next.sandbox = existing.sandbox;
	else delete next.sandbox;
	if (existing.createdAt !== void 0) next.createdAt = existing.createdAt;
	if (existing.projectId !== void 0) next.projectId = existing.projectId;
	if (existing.forkSource !== void 0) next.forkSource = existing.forkSource;
	if (Object.hasOwn(patch, "model") && !Object.hasOwn(patch, "modelProvider")) {
		const patchedModel = normalizeOptionalString(patch.model);
		const existingModel = normalizeOptionalString(existing.model);
		if (patchedModel && patchedModel !== existingModel) delete next.modelProvider;
	}
	return stripRetiredSessionEntryLocators(normalizeSessionRuntimeModelFields(next));
}
function stripRetiredSessionEntryLocators(entry) {
	const mutable = entry;
	delete mutable.sessionFile;
	delete mutable.transcriptPath;
	return entry;
}
function mergeSessionEntry(existing, patch) {
	return mergeSessionEntryWithPolicy(existing, patch);
}
function mergeSessionEntryPreserveActivity(existing, patch) {
	return mergeSessionEntryWithPolicy(existing, patch, { policy: "preserve-activity" });
}
function resolveSessionTotalTokens(entry) {
	return asNonNegativeFiniteNumber(entry?.totalTokens);
}
function resolveFreshSessionTotalTokens(entry) {
	const total = resolveSessionTotalTokens(entry);
	if (total === void 0) return;
	if (entry?.totalTokensFresh !== true || entry.totalTokensVersion !== 1) return;
	return total;
}
const DEFAULT_RESET_TRIGGERS = ["/new", "/reset"];
//#endregion
export { normalizeSessionRuntimeModelFields as a, resolveSessionPluginTraceLines as c, collectActiveSessionWorkAdmissionKeys as d, collectSessionMaintenancePreserveKeys as f, mergeSessionEntryPreserveActivity as i, resolveSessionTotalTokens as l, registerSessionMaintenancePreserveKeysProvider as m, isTerminalSessionStatus as n, resolveFreshSessionTotalTokens as o, collectSessionMaintenancePreserveKeysForStore as p, mergeSessionEntry as r, resolveSessionPluginStatusLines as s, DEFAULT_RESET_TRIGGERS as t, setSessionRuntimeModel as u };
