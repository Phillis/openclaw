import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { i as resolveAgentModelFallbackValues } from "./model-input-ILUprkGk.js";
import { u as resolveAgentModelFallbacksOverride } from "./agent-scope-DigoIwHb.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { a as listAgentIds, f as resolveAgentWorkspaceDir, r as listAgentEntries } from "./agent-scope-config-CUBiGmG3.js";
import { c as parseAgentSessionKey, n as isAcpSessionKey } from "./session-key-utils-Di3FvABa.js";
import { t as isIncognitoSessionKey } from "./incognito-session-key-BwpD1Lwd.js";
import "./session-key-Dbce_H9p.js";
import { o as resolveSessionStorePathCore } from "./paths-DVAvlIOc.js";
import { n as getRuntimeConfig } from "./io-ClLVsBMp.js";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.js";
import { w as resolveDefaultModelForAgent } from "./codex-route-model-ref-BJZ-8dtR.js";
import { r as resolveAgentMainSessionKey } from "./main-session-CPkeRwvL.js";
import { i as resolveStoredSessionKeyForAgentStore, n as resolveSessionStoreAgentId, r as resolveSessionStoreKey } from "./session-store-key-DRF7yKG5.js";
import { d as listAgentProvenance } from "./agent-deletion-journal-C1nSMR13.js";
import "./openclaw-agent-db-BEQsKM0c.js";
import { z as resolveIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db-maintenance-_0tYy-zT.js";
import { d as loadExactSessionEntryReadOnly, i as listSessionChildEntriesReadOnly, o as listSessionEntriesReadOnly } from "./session-accessor.sqlite-entry-Ik-U-wpI.js";
import { M as canonicalSessionKeyMigrationRequiredError } from "./session-accessor.sqlite-entry-store-BIW-GrsF.js";
import { It as listSessionEntriesCore } from "./session-accessor-fcDZuc2H.js";
import { s as resolveExistingAgentSessionStoreTargetsSync, t as isConfiguredSessionStoreAgentId } from "./targets-CSCF74bk.js";
import "./sessions-BI8dPUCI.js";
import "./model-selection-Cp8EGD61.js";
import { a as readAcpSessionMetaForEntry, o as repairAcpSessionMetaKeyForMigration, r as readAcpSessionMeta } from "./session-meta-CpNLCGd4.js";
import { i as resolveGatewayModelThinkingProfile } from "./session-utils-model-DHZkyDhz.js";
import { n as resolveModelAgentRuntimeMetadata } from "./agent-runtime-metadata-DytIv1m8.js";
import { r as resolveAgentAvatarUrlFromSource } from "./identity-avatar-file-DgtrLWCY.js";
import { a as insideGitCheckout } from "./git-CsWoUZAt.js";
import { t as listGatewayAgentsBasic } from "./agent-list-HVk8EUft.js";
import { i as tryResolveSessionCompatibilityOwnerAgentId } from "./session-request-agent-C9E8iDY4.js";
import { t as projectWorkerPlacementAgentRuntime } from "./placement-session-runtime-CugBJIqO.js";
//#region src/gateway/session-utils-store-lookup.ts
function findCanonicalStoreMatch(store, candidates, onCanonicalError) {
	const matches = /* @__PURE__ */ new Map();
	for (const candidate of candidates) {
		const trimmed = normalizeOptionalString(candidate) ?? "";
		if (!trimmed) continue;
		const exact = store[trimmed];
		if (exact) matches.set(trimmed, {
			entry: exact,
			key: trimmed
		});
	}
	if (matches.size === 0) return;
	const canonicalKey = candidates[0] ?? "";
	const selected = matches.get(canonicalKey) ?? matches.values().next().value;
	if (matches.size > 1) {
		const error = canonicalSessionKeyMigrationRequiredError(`duplicate rows resolve to canonical session key ${canonicalKey || selected?.key || ""}`);
		if (!onCanonicalError) throw error;
		onCanonicalError(error);
	}
	if (selected && selected.key !== canonicalKey) {
		const error = canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${canonicalKey || selected.key}`);
		if (!onCanonicalError) throw error;
		onCanonicalError(error);
	}
	return selected;
}
function buildGatewaySessionStoreScanTargets(params) {
	const targets = /* @__PURE__ */ new Set();
	if (params.canonicalKey) targets.add(params.canonicalKey);
	if (params.key && params.key !== params.canonicalKey) targets.add(params.key);
	if (params.canonicalKey === "global" || params.canonicalKey === "unknown") return [...targets];
	const agentMainKey = resolveAgentMainSessionKey({
		cfg: params.cfg,
		agentId: params.agentId
	});
	if (params.canonicalKey === agentMainKey) targets.add(`agent:${params.agentId}:main`);
	return [...targets];
}
function resolveGatewaySessionStoreCandidates(cfg, agentId, cache) {
	const cached = cache?.get(agentId);
	if (cached) return cached;
	const storeConfig = cfg.session?.store;
	const fallback = {
		agentId,
		storePath: resolveSessionStorePathCore(storeConfig, { agentId })
	};
	const discovery = {
		existing: resolveExistingAgentSessionStoreTargetsSync(cfg, agentId),
		fallback
	};
	cache?.set(agentId, discovery);
	return discovery;
}
function createGatewaySessionStoreDiscoveryCache(params) {
	const cache = /* @__PURE__ */ new Map();
	const prepare = (rawAgentId, target) => {
		const agentId = normalizeAgentId(rawAgentId);
		const current = cache.get(agentId);
		if (current) {
			if (target) current.existing.push(target);
			return;
		}
		const fallback = {
			agentId,
			storePath: resolveSessionStorePathCore(params.cfg.session?.store, { agentId })
		};
		const existing = target ? [target] : params.targets.length > 0 ? [...params.targets] : [fallback];
		cache.set(agentId, {
			existing,
			fallback,
			prepared: true
		});
	};
	for (const target of params.targets) prepare(target.agentId, target);
	for (const agentId of params.agentIds) prepare(agentId);
	return cache;
}
function loadGatewaySessionLookupStore(storePath, clone, agentId, options = {}) {
	const cache = options.cache;
	const cacheKey = cache ? `${storePath}\u0000${agentId ?? ""}\u0000${clone === false ? "0" : "1"}\u0000${options.readOnly ? "1" : "0"}\u0000${options.projection ?? "full"}\u0000${options.exactKeys?.join("") ?? ""}` : "";
	if (cache) {
		const cached = cache.get(cacheKey);
		if (cached) return cached;
	}
	const loaded = loadGatewaySessionLookupStoreUncached(storePath, clone, agentId, options);
	cache?.set(cacheKey, loaded);
	return loaded;
}
function loadGatewaySessionLookupStoreUncached(storePath, clone, agentId, options = {}) {
	try {
		if (options.exactKeys) {
			const store = {};
			for (const sessionKey of options.exactKeys) {
				const match = loadExactSessionEntryReadOnly({
					...agentId ? { agentId } : {},
					clone: false,
					sessionKey,
					storePath
				});
				if (match) store[match.sessionKey] = match.entry;
			}
			return store;
		}
		const listEntries = options.readOnly ? listSessionEntriesReadOnly : listSessionEntriesCore;
		return Object.fromEntries(listEntries({
			...agentId ? { agentId } : {},
			...clone === false ? { clone: false } : {},
			...options.projection ? { projection: options.projection } : {},
			storePath
		}).map(({ sessionKey, entry }) => [sessionKey, entry]));
	} catch {
		return {};
	}
}
function resolveGatewaySessionStoreLookup(params) {
	const scanTargets = buildGatewaySessionStoreScanTargets(params);
	const discovery = resolveGatewaySessionStoreCandidates(params.cfg, params.agentId, params.targetDiscoveryCache);
	const { existing, fallback } = discovery;
	const configured = isConfiguredSessionStoreAgentId(params.cfg, params.agentId);
	const candidates = discovery.prepared ? existing : configured ? [fallback, ...existing.filter((target) => target.storePath !== fallback.storePath)] : existing;
	if (candidates.length === 0) return {
		storePath: fallback.storePath,
		store: {},
		match: void 0
	};
	const loadStore = (target) => loadGatewaySessionLookupStore(target.storePath, params.clone, target.agentId, {
		readOnly: params.readOnly || !configured,
		...params.exactRead ? { exactKeys: scanTargets } : {},
		...params.projection ? { projection: params.projection } : {},
		...params.storeCache ? { cache: params.storeCache } : {}
	});
	const firstCandidate = candidates[0] ?? fallback;
	let selectedStorePath = firstCandidate.storePath;
	let selectedStore = params.initialStore && firstCandidate.storePath === fallback.storePath ? params.initialStore : loadStore(firstCandidate);
	let canonicalValidationError;
	const recordCanonicalError = params.deferCanonicalValidation ? (error) => {
		canonicalValidationError ??= error;
	} : void 0;
	let selectedMatch = findCanonicalStoreMatch(selectedStore, scanTargets, recordCanonicalError);
	for (let index = 1; index < candidates.length; index += 1) {
		const candidate = candidates[index];
		if (!candidate) continue;
		const store = loadStore(candidate);
		const match = findCanonicalStoreMatch(store, scanTargets, recordCanonicalError);
		if (!match) continue;
		if (selectedMatch) {
			const error = canonicalSessionKeyMigrationRequiredError(`duplicate rows resolve to canonical session key ${params.canonicalKey}`);
			if (!recordCanonicalError) throw error;
			recordCanonicalError(error);
			if (match.key !== params.canonicalKey || selectedMatch.key === params.canonicalKey) continue;
		}
		selectedStorePath = candidate.storePath;
		selectedStore = store;
		selectedMatch = match;
	}
	return {
		storePath: selectedStorePath,
		store: selectedStore,
		match: selectedMatch,
		...canonicalValidationError ? { canonicalValidationError } : {}
	};
}
function isAgentScopedSentinelSessionKey(canonicalKey) {
	return canonicalKey === "global" || canonicalKey === "unknown";
}
function resolveExplicitDeletedLegacyMainStoreTarget(params) {
	const parsed = parseAgentSessionKey(params.key);
	const legacyAgentId = normalizeAgentId(parsed?.agentId);
	if (!parsed || legacyAgentId !== "main" || listAgentIds(params.cfg).includes(legacyAgentId)) return null;
	const canonicalKey = resolveStoredSessionKeyForAgentStore({
		cfg: params.cfg,
		agentId: legacyAgentId,
		sessionKey: params.key
	});
	const agentMainKey = resolveAgentMainSessionKey({
		cfg: params.cfg,
		agentId: legacyAgentId
	});
	const legacyAgentMainKey = `agent:${legacyAgentId}:main`;
	const lookupSeeds = Array.from(/* @__PURE__ */ new Set([
		params.key,
		canonicalKey,
		agentMainKey,
		legacyAgentMainKey
	]));
	let best;
	const { existing } = resolveGatewaySessionStoreCandidates(params.cfg, legacyAgentId, params.targetDiscoveryCache);
	let canonicalValidationError;
	const recordCanonicalError = params.deferCanonicalValidation ? (error) => {
		canonicalValidationError ??= error;
	} : void 0;
	for (const target of existing) {
		if (target.agentId !== legacyAgentId) continue;
		const store = loadGatewaySessionLookupStore(target.storePath, params.clone, target.agentId, {
			readOnly: true,
			...params.exactRead ? { exactKeys: lookupSeeds } : {},
			...params.projection ? { projection: params.projection } : {},
			...params.storeCache ? { cache: params.storeCache } : {}
		});
		const match = findCanonicalStoreMatch(store, lookupSeeds, recordCanonicalError);
		if (!match) continue;
		if (best) {
			const error = canonicalSessionKeyMigrationRequiredError(`duplicate rows resolve to canonical session key ${canonicalKey}`);
			if (!recordCanonicalError) throw error;
			recordCanonicalError(error);
		}
		if (!best || (match.entry.updatedAt ?? 0) >= (best.match.entry.updatedAt ?? 0)) best = {
			storePath: target.storePath,
			store,
			match
		};
	}
	if (!best) return null;
	const storeKeys = /* @__PURE__ */ new Set([canonicalKey]);
	if (params.key !== canonicalKey) storeKeys.add(params.key);
	storeKeys.add(best.match.key);
	for (const seed of lookupSeeds) storeKeys.add(seed);
	return {
		agentId: legacyAgentId,
		storePath: best.storePath,
		canonicalKey,
		storeKeys: Array.from(storeKeys),
		store: best.store,
		...canonicalValidationError ? { canonicalValidationError } : {}
	};
}
function resolveGatewaySessionStoreTargetWithStore(params) {
	const key = normalizeOptionalString(params.key) ?? "";
	const explicitDeletedMainTarget = resolveExplicitDeletedLegacyMainStoreTarget({
		cfg: params.cfg,
		key,
		clone: params.clone,
		...params.deferCanonicalValidation ? { deferCanonicalValidation: true } : {},
		readOnly: params.readOnly,
		exactRead: params.exactRead,
		...params.projection ? { projection: params.projection } : {},
		...params.storeCache ? { storeCache: params.storeCache } : {},
		...params.targetDiscoveryCache ? { targetDiscoveryCache: params.targetDiscoveryCache } : {}
	});
	if (explicitDeletedMainTarget) return includeDirectChildEntries(explicitDeletedMainTarget, params.includeStoreChildEntries);
	const requestedAgentId = normalizeOptionalString(params.agentId);
	const canonicalKey = resolveSessionStoreKey({
		cfg: params.cfg,
		sessionKey: key,
		...requestedAgentId ? { storeAgentId: requestedAgentId } : {}
	});
	const agentId = requestedAgentId && (isAgentScopedSentinelSessionKey(canonicalKey) || !parseAgentSessionKey(key)) ? normalizeAgentId(requestedAgentId) : resolveSessionStoreAgentId(params.cfg, canonicalKey);
	if (isIncognitoSessionKey(canonicalKey)) {
		const storePath = resolveIncognitoOpenClawAgentSqlitePath({ agentId });
		const store = loadGatewaySessionLookupStore(storePath, params.clone, agentId, {
			readOnly: true,
			...params.exactRead ? { exactKeys: [canonicalKey] } : {},
			...params.projection ? { projection: params.projection } : {},
			...params.storeCache ? { cache: params.storeCache } : {}
		});
		return includeDirectChildEntries({
			agentId,
			storePath,
			canonicalKey,
			storeKeys: [canonicalKey],
			store
		}, params.includeStoreChildEntries);
	}
	const { canonicalValidationError, storePath, store } = resolveGatewaySessionStoreLookup({
		cfg: params.cfg,
		key,
		canonicalKey,
		agentId,
		clone: params.clone,
		readOnly: params.readOnly,
		exactRead: params.exactRead,
		deferCanonicalValidation: params.deferCanonicalValidation,
		initialStore: params.store,
		...params.projection ? { projection: params.projection } : {},
		...params.storeCache ? { storeCache: params.storeCache } : {},
		...params.targetDiscoveryCache ? { targetDiscoveryCache: params.targetDiscoveryCache } : {}
	});
	if (canonicalKey === "global" || canonicalKey === "unknown") return includeDirectChildEntries({
		agentId,
		storePath,
		canonicalKey,
		storeKeys: key && key !== canonicalKey ? [canonicalKey, key] : [key],
		store,
		...canonicalValidationError ? { canonicalValidationError } : {}
	}, params.includeStoreChildEntries);
	const storeKeys = new Set(buildGatewaySessionStoreScanTargets({
		cfg: params.cfg,
		key,
		canonicalKey,
		agentId
	}));
	return includeDirectChildEntries({
		agentId,
		storePath,
		canonicalKey,
		storeKeys: Array.from(storeKeys),
		store,
		...canonicalValidationError ? { canonicalValidationError } : {}
	}, params.includeStoreChildEntries);
}
function includeDirectChildEntries(target, include) {
	if (!include) return target;
	try {
		const parentKeys = /* @__PURE__ */ new Set([target.canonicalKey, ...target.storeKeys]);
		for (const parentKey of parentKeys) for (const { sessionKey, entry } of listSessionChildEntriesReadOnly({
			agentId: target.agentId,
			clone: false,
			sessionKey: parentKey,
			storePath: target.storePath
		})) target.store[sessionKey] = entry;
	} catch {}
	return target;
}
function resolveGatewaySessionStoreTarget(params) {
	const { store: _store, ...target } = resolveGatewaySessionStoreTargetWithStore(params);
	return target;
}
//#endregion
//#region src/gateway/session-utils-store.ts
/**
* Returns the owning agent id if the session key belongs to an agent that is no
* longer present in config (deleted). Returns null for non-agent legacy/global
* keys, confirmed ACP runtime session keys, or when the owning agent still
* exists (#65524).
*/
function resolveDeletedAgentIdFromSessionKey(cfg, sessionKey, entry, options) {
	const parsed = parseAgentSessionKey(sessionKey);
	if (!parsed) return null;
	const agentId = normalizeAgentId(parsed.agentId);
	if (listAgentIds(cfg).includes(agentId)) return null;
	if (isAcpSessionKey(sessionKey) && !parsed.rest.startsWith("acp:binding:")) {
		if (readAcpMetaForDeletedAgentCheck({
			cfg,
			sessionKey,
			entry,
			acpMetadataSessionKey: options?.acpMetadataSessionKey
		})) return null;
	}
	return agentId;
}
function readAcpMetaForDeletedAgentCheck(params) {
	if (params.entry?.acp) return params.entry.acp;
	const acpMetadataSessionKey = normalizeOptionalString(params.acpMetadataSessionKey);
	const directKeys = /* @__PURE__ */ new Set();
	if (acpMetadataSessionKey) directKeys.add(acpMetadataSessionKey);
	else {
		const acpMeta = readAcpSessionMeta({
			sessionKey: params.sessionKey,
			cfg: params.cfg
		});
		if (acpMeta) return acpMeta;
	}
	directKeys.add(params.sessionKey);
	for (const directKey of directKeys) {
		const agentId = parseAgentSessionKey(directKey)?.agentId ?? tryResolveSessionCompatibilityOwnerAgentId(params.cfg, directKey);
		const acpMeta = readAcpSessionMetaForEntry({
			sessionKey: directKey,
			...agentId ? { agentId } : {},
			entry: params.entry ?? void 0
		});
		if (acpMeta) return acpMeta;
	}
	repairAcpSessionMetaKeyForMigration({
		sessionKey: params.sessionKey,
		candidateSessionKeys: directKeys,
		entry: params.entry ?? void 0
	});
	const finalAgentId = parseAgentSessionKey(params.sessionKey)?.agentId ?? tryResolveSessionCompatibilityOwnerAgentId(params.cfg, params.sessionKey);
	return readAcpSessionMetaForEntry({
		sessionKey: params.sessionKey,
		...finalAgentId ? { agentId: finalAgentId } : {},
		entry: params.entry ?? void 0
	});
}
function loadSessionEntryWithMode(sessionKey, opts, readOnly) {
	const cfg = getRuntimeConfig();
	const target = resolveGatewaySessionStoreTargetWithStore({
		cfg,
		key: normalizeOptionalString(sessionKey) ?? "",
		...opts?.clone === false ? { clone: false } : {},
		...opts?.agentId ? { agentId: opts.agentId } : {},
		...readOnly ? {
			exactRead: true,
			readOnly: true,
			...opts?.includeStoreChildEntries ? { includeStoreChildEntries: true } : {}
		} : {}
	});
	const storePath = target.storePath;
	const store = target.store;
	const canonicalMatch = resolveCanonicalSessionStoreMatchFromStoreKeys(store, target.storeKeys);
	const legacyKey = canonicalMatch?.key !== target.canonicalKey ? canonicalMatch?.key : void 0;
	const entry = readOnly && opts?.clone !== false && canonicalMatch?.entry ? structuredClone(canonicalMatch.entry) : canonicalMatch?.entry;
	return {
		cfg,
		agentId: target.agentId,
		storePath,
		store,
		entry,
		canonicalKey: target.canonicalKey,
		storeKeys: target.storeKeys,
		legacyKey
	};
}
function loadGatewaySessionEntry(sessionKey, opts) {
	return loadSessionEntryWithMode(sessionKey, opts, false);
}
function loadGatewaySessionEntryReadOnly(sessionKey, opts) {
	return loadSessionEntryWithMode(sessionKey, opts, true);
}
/** Returns the one canonical entry and the exact persisted key that owns it. */
function resolveCanonicalSessionStoreMatchFromStoreKeys(store, storeKeys) {
	let selected;
	for (const key of storeKeys) {
		const entry = store[key];
		if (!entry) continue;
		const match = {
			key,
			entry
		};
		if (selected) throw canonicalSessionKeyMigrationRequiredError(`duplicate rows resolve to canonical session key ${storeKeys[0] ?? key}`);
		selected = match;
	}
	if (selected && selected.key !== storeKeys[0]) throw canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${storeKeys[0] ?? selected.key}`);
	return selected;
}
function resolveCanonicalSessionEntryFromStoreKeys(store, storeKeys) {
	return resolveCanonicalSessionStoreMatchFromStoreKeys(store, storeKeys)?.entry;
}
function resolveCanonicalGatewaySessionStoreKey(params) {
	const target = resolveGatewaySessionStoreTarget({
		cfg: params.cfg,
		key: params.key,
		store: params.store,
		...params.agentId ? { agentId: params.agentId } : {}
	});
	const primaryKey = target.canonicalKey;
	resolveCanonicalSessionStoreMatchFromStoreKeys(params.store, target.storeKeys);
	return {
		target,
		primaryKey,
		entry: params.store[primaryKey]
	};
}
function parseGroupKey(key) {
	const parts = (parseAgentSessionKey(key)?.rest ?? key).split(":").filter(Boolean);
	if (parts.length >= 3) {
		const [channel, kind, ...rest] = parts;
		if (kind === "group" || kind === "channel") return {
			channel,
			kind,
			id: rest.join(":")
		};
	}
	return null;
}
function isGroupOrChannelDisplaySession(entry, parsed) {
	return entry?.chatType === "group" || entry?.chatType === "channel" || parsed?.kind === "group" || parsed?.kind === "channel";
}
function normalizeFallbackList(values) {
	const out = [];
	const seen = /* @__PURE__ */ new Set();
	for (const value of values) {
		const trimmed = value.trim();
		if (!trimmed) continue;
		const key = normalizeLowercaseStringOrEmpty(trimmed);
		if (seen.has(key)) continue;
		seen.add(key);
		out.push(trimmed);
	}
	return out;
}
function resolveGatewayAgentModel(cfg, agentId, resolvedModel) {
	const primary = `${resolvedModel.provider}/${resolvedModel.model}`;
	const fallbackOverride = resolveAgentModelFallbacksOverride(cfg, agentId);
	const defaultFallbacks = resolveAgentModelFallbackValues(cfg.agents?.defaults?.model);
	const fallbacks = normalizeFallbackList((fallbackOverride ?? defaultFallbacks).map((value) => splitTrailingAuthProfile(value).model));
	return {
		primary,
		...fallbacks.length > 0 ? { fallbacks } : {}
	};
}
function listAgentsForGateway(cfg, modelCatalog, options) {
	const basic = listGatewayAgentsBasic(cfg);
	const configuredById = /* @__PURE__ */ new Map();
	for (const entry of listAgentEntries(cfg)) {
		if (!entry?.id) continue;
		const agentId = normalizeAgentId(entry.id);
		const avatar = normalizeOptionalString(entry.identity?.avatar);
		const avatarUrl = resolveAgentAvatarUrlFromSource(cfg, agentId, avatar);
		const identity = entry.identity ? {
			name: normalizeOptionalString(entry.identity.name),
			theme: normalizeOptionalString(entry.identity.theme),
			emoji: normalizeOptionalString(entry.identity.emoji),
			avatar,
			avatarUrl
		} : void 0;
		configuredById.set(agentId, { identity });
	}
	const roster = options?.includeSystem ? basic.agents : basic.agents.filter((entry) => entry.kind !== "system");
	const provenanceById = new Map(listAgentProvenance().map((record) => [record.agentId, record]));
	const agents = roster.map((entry) => {
		const { id } = entry;
		const meta = configuredById.get(id);
		const resolvedModel = resolveDefaultModelForAgent({
			cfg,
			agentId: id
		});
		const model = resolveGatewayAgentModel(cfg, id, resolvedModel);
		const sessionKey = resolveAgentMainSessionKey({
			cfg,
			agentId: id
		});
		const agentRuntime = projectWorkerPlacementAgentRuntime(resolveModelAgentRuntimeMetadata({
			cfg,
			agentId: id,
			provider: resolvedModel.provider,
			model: resolvedModel.model,
			sessionKey,
			acpRuntime: false
		}));
		const agentModelCatalog = options?.modelCatalogByAgentId?.has(id) ? options.modelCatalogByAgentId.get(id) : modelCatalog ?? options?.modelCatalogByAgentId?.get(basic.defaultId);
		const thinkingProfile = resolveGatewayModelThinkingProfile({
			cfg,
			agentId: id,
			provider: resolvedModel.provider,
			model: resolvedModel.model,
			modelCatalog: agentModelCatalog,
			sessionKey
		});
		const workspace = resolveAgentWorkspaceDir(cfg, id);
		const workspaceGit = insideGitCheckout(workspace);
		const agent = Object.assign({
			id,
			...options?.includeSystem ? { kind: entry.kind } : {},
			name: entry.name,
			identity: meta?.identity,
			workspace,
			workspaceGit,
			agentRuntime,
			thinkingLevels: thinkingProfile.thinkingLevels,
			thinkingOptions: thinkingProfile.thinkingLevels.map((level) => level.label),
			thinkingDefault: thinkingProfile.thinkingDefault
		}, { model });
		const provenance = provenanceById.get(id);
		return provenance ? Object.assign(agent, {
			createdVia: provenance.createdVia,
			creatorAgentId: provenance.creatorAgentId,
			createdAt: provenance.createdAtMs
		}) : agent;
	});
	return {
		defaultId: basic.defaultId,
		ownership: basic.ownership,
		selectionRequired: basic.selectionRequired,
		mainKey: basic.mainKey,
		scope: basic.scope,
		agents
	};
}
//#endregion
export { parseGroupKey as a, resolveCanonicalSessionStoreMatchFromStoreKeys as c, resolveGatewaySessionStoreTarget as d, resolveGatewaySessionStoreTargetWithStore as f, loadGatewaySessionEntryReadOnly as i, resolveDeletedAgentIdFromSessionKey as l, listAgentsForGateway as n, resolveCanonicalGatewaySessionStoreKey as o, loadGatewaySessionEntry as r, resolveCanonicalSessionEntryFromStoreKeys as s, isGroupOrChannelDisplaySession as t, createGatewaySessionStoreDiscoveryCache as u };
