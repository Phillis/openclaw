import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./src-BntaCZM-.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import "./agent-scope-DigoIwHb.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { r as listAgentEntries } from "./agent-scope-config-CUBiGmG3.js";
import { c as parseAgentSessionKey } from "./session-key-utils-Di3FvABa.js";
import { t as isIncognitoSessionKey } from "./incognito-session-key-BwpD1Lwd.js";
import { o as resolveSessionStorePathCore } from "./paths-DVAvlIOc.js";
import { n as resolveSessionStoreCompatibilityAgentId } from "./legacy.default-agent-owner-CL_-T11Y.js";
import { i as resolveStoredSessionKeyForAgentStore, n as resolveSessionStoreAgentId, r as resolveSessionStoreKey } from "./session-store-key-DRF7yKG5.js";
import { _ as readOpenIncognitoAgentDatabaseGeneration, h as listOpenIncognitoAgentDatabases } from "./openclaw-agent-db-CM8nAOgX.js";
import { F as listOpenClawRegisteredAgentDatabases, I as readOpenClawAgentDatabaseRegistryToken } from "./openclaw-agent-db-maintenance-DDqVWNe-.js";
import { o as listSessionEntriesReadOnly, t as countSessionEntryRowsReadOnly } from "./session-accessor.sqlite-entry-CNdoUuFZ.js";
import { M as canonicalSessionKeyMigrationRequiredError } from "./session-accessor.sqlite-entry-store-DmHR081P.js";
import { o as resolveDeliveryProvenCanonicalSessionKey } from "./store-entry-CwpzgKGD.js";
import { r as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-CVc2mOCy.js";
import { It as listSessionEntriesCore } from "./session-accessor-B-FKZX9M.js";
import { i as resolveAgentSessionStoreTargetsSync, l as dedupeSessionStoreTargetsBySqliteTarget, n as listConfiguredSessionStoreAgentIds, o as resolveAllAgentSessionStoreTargetsSync, r as listKnownSessionStoreAgentIds } from "./targets-Bo3OPXck.js";
//#region src/config/sessions/combined-store-gateway.ts
let preparedConfiguredSessionStoreTargets;
function isStorePathTemplate(store) {
	return typeof store === "string" && store.includes("{agentId}");
}
function resolveCombinedStorePath(paths, storeConfig) {
	return paths.length === 1 ? expectDefined(paths[0], "store path at 0") : typeof storeConfig === "string" && storeConfig.trim() ? storeConfig.trim() : "(multiple)";
}
function resolveCombinedDatabasePath(targets, defaultAgentId, physicallyDeduped = false) {
	if (physicallyDeduped && targets.length !== 1) return "(multiple)";
	const paths = [...new Set(targets.map((target) => resolveSqliteTargetFromSessionStorePath(target.storePath, {
		agentId: target.agentId,
		defaultAgentId
	}).path))];
	return paths.length === 1 ? expectDefined(paths[0], "database path at 0") : "(multiple)";
}
function loadGatewayStoreEntries(params) {
	return (params.includeOpenDatabases ? listSessionEntriesCore : listSessionEntriesReadOnly)({
		agentId: params.agentId,
		clone: false,
		projection: params.projection,
		storePath: params.storePath
	});
}
function mergeSessionEntryIntoCombined(params) {
	const { cfg, combined, entry, agentId, canonicalKey } = params;
	const existing = combined[canonicalKey];
	if (existing && (canonicalKey === "global" || canonicalKey === "unknown")) return;
	if (existing) throw canonicalSessionKeyMigrationRequiredError(`duplicate rows resolve to canonical session key ${canonicalKey}`);
	const deliveryCanonicalKey = resolveDeliveryProvenCanonicalSessionKey(canonicalKey, entry);
	if (deliveryCanonicalKey !== canonicalKey) throw canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${deliveryCanonicalKey}`);
	const resolveLineageKey = (sessionKey) => sessionKey ? resolveSessionStoreKey({
		cfg,
		sessionKey,
		storeAgentId: agentId
	}) : void 0;
	combined[canonicalKey] = {
		...entry,
		...entry.parentSessionKey ? { parentSessionKey: resolveLineageKey(entry.parentSessionKey) } : {},
		...entry.spawnedBy ? { spawnedBy: resolveLineageKey(entry.spawnedBy) } : {}
	};
}
function mergeOpenIncognitoStores(params) {
	const storePaths = [];
	for (const target of params.targets) {
		const store = loadGatewayStoreEntries({
			agentId: target.agentId,
			includeOpenDatabases: true,
			projection: params.projection,
			storePath: target.storePath
		});
		let merged = false;
		for (const { sessionKey, entry } of store) {
			if (!isIncognitoSessionKey(sessionKey) || entry.incognito !== true) continue;
			mergeSessionEntryIntoCombined({
				cfg: params.cfg,
				combined: params.combined,
				entry,
				agentId: target.agentId,
				canonicalKey: sessionKey
			});
			merged = true;
		}
		if (merged) storePaths.push(target.storePath);
	}
	return storePaths;
}
function filterCombinedStoreToConfiguredAgents(params) {
	const isConfiguredSessionKey = (key) => {
		const normalizedKey = normalizeOptionalString(key);
		if (!normalizedKey) return false;
		const canonicalKey = resolveSessionStoreKey({
			cfg: params.cfg,
			sessionKey: normalizedKey
		});
		const agentId = resolveSessionStoreAgentId(params.cfg, canonicalKey);
		return params.configuredAgentIds.has(normalizeAgentId(agentId));
	};
	for (const [key, entry] of Object.entries(params.store)) if (!(key === "global" || key === "unknown" || isConfiguredSessionKey(key) || isConfiguredSessionKey(entry.spawnedBy) || isConfiguredSessionKey(entry.parentSessionKey))) delete params.store[key];
}
function resolvePreparedConfiguredSessionStoreTargets(cfg, includeIncognito) {
	const registryToken = readOpenClawAgentDatabaseRegistryToken();
	const incognitoGeneration = readOpenIncognitoAgentDatabaseGeneration();
	const cached = preparedConfiguredSessionStoreTargets;
	if (cached?.cfg === cfg && cached.registryToken === registryToken && cached.incognitoGeneration === incognitoGeneration && cached.includeIncognito === includeIncognito) return cached.resolved;
	const storeConfig = cfg.session?.store;
	const defaultAgentId = normalizeAgentId(resolveSessionStoreCompatibilityAgentId(cfg));
	const configuredIds = listConfiguredSessionStoreAgentIds(cfg);
	const configuredAgentIds = new Set(configuredIds);
	const incognitoTargets = includeIncognito ? listOpenIncognitoAgentDatabases() : [];
	const incognitoTargetKeys = new Set(incognitoTargets.map((target) => `${target.agentId}\0${target.storePath}`));
	const diagnostics = [];
	const candidates = dedupeSessionStoreTargetsBySqliteTarget([
		...listOpenClawRegisteredAgentDatabases().map(({ agentId, path }) => ({
			agentId,
			storePath: path
		})),
		...configuredIds.map((agentId) => ({
			agentId,
			storePath: resolveSessionStorePathCore(storeConfig, { agentId })
		})),
		...incognitoTargets
	], {
		defaultAgentId,
		onDiagnostic: (diagnostic) => diagnostics.push(diagnostic.message)
	});
	const durableTargets = candidates.filter((target) => !incognitoTargetKeys.has(`${target.agentId}\0${target.storePath}`));
	const resolved = Object.freeze({
		configuredAgentIds,
		defaultAgentId,
		diagnostics: Object.freeze(diagnostics),
		durableStorePath: resolveCombinedDatabasePath(durableTargets, defaultAgentId, true),
		durableTargets: Object.freeze(durableTargets.map((target) => Object.freeze({ ...target }))),
		incognitoTargets: Object.freeze(candidates.filter((target) => incognitoTargetKeys.has(`${target.agentId}\0${target.storePath}`)).map((target) => Object.freeze({ ...target }))),
		storeConfig
	});
	preparedConfiguredSessionStoreTargets = {
		cfg,
		includeIncognito,
		incognitoGeneration,
		registryToken,
		resolved
	};
	return resolved;
}
function resolveGatewaySessionStoreTargets(cfg, opts) {
	const storeConfig = cfg.session?.store;
	const diagnostics = [];
	const requestedAgentId = typeof opts.agentId === "string" && opts.agentId.trim() ? normalizeAgentId(opts.agentId) : void 0;
	if (opts.configuredAgentsOnly === true && !requestedAgentId) return resolvePreparedConfiguredSessionStoreTargets(cfg, opts.includeIncognito !== false);
	const defaultAgentId = normalizeAgentId(resolveSessionStoreCompatibilityAgentId(cfg));
	const incognitoTargets = opts.includeIncognito === false ? [] : listOpenIncognitoAgentDatabases().filter((target) => !requestedAgentId || target.agentId === requestedAgentId);
	if (storeConfig && !isStorePathTemplate(storeConfig)) return {
		defaultAgentId,
		diagnostics,
		durableTargets: dedupeSessionStoreTargetsBySqliteTarget([.../* @__PURE__ */ new Set([
			...listAgentEntries(cfg).map((entry) => normalizeAgentId(entry.id)),
			...listKnownSessionStoreAgentIds(cfg),
			defaultAgentId,
			...requestedAgentId ? [requestedAgentId] : []
		])].map((agentId) => ({
			agentId,
			storePath: resolveSessionStorePathCore(storeConfig, { agentId })
		})), {
			defaultAgentId,
			onDiagnostic: (diagnostic) => diagnostics.push(diagnostic.message)
		}),
		incognitoTargets,
		requestedAgentId,
		storeConfig
	};
	return {
		defaultAgentId,
		diagnostics,
		durableTargets: requestedAgentId ? dedupeSessionStoreTargetsBySqliteTarget(resolveAgentSessionStoreTargetsSync(cfg, requestedAgentId), { defaultAgentId }) : resolveAllAgentSessionStoreTargetsSync(cfg),
		incognitoTargets,
		requestedAgentId,
		storeConfig
	};
}
/** Checks whether Gateway prewarm can project the selected stores within a bounded row budget. */
function canPrewarmCombinedSessionStoresForGateway(cfg, params) {
	let totalRows = 0;
	for (const agentId of params.agentIds) {
		const resolved = resolveGatewaySessionStoreTargets(cfg, { agentId });
		const projectionTargets = resolved.incognitoTargets.length === 0 ? resolved.durableTargets : dedupeSessionStoreTargetsBySqliteTarget([...resolved.durableTargets, ...resolved.incognitoTargets], { defaultAgentId: resolved.defaultAgentId });
		for (const target of projectionTargets) {
			totalRows += countSessionEntryRowsReadOnly(target);
			if (totalRows > params.maxRows) return false;
		}
	}
	return true;
}
/** Loads and canonicalizes session entries for gateway views across one or more agent stores. */
function loadCombinedSessionStoreForGatewayCore(cfg, opts = {}) {
	const projection = opts.projection ?? "full";
	const { configuredAgentIds, defaultAgentId, diagnostics, durableStorePath: preparedDurableStorePath, durableTargets, incognitoTargets, requestedAgentId, storeConfig } = resolveGatewaySessionStoreTargets(cfg, opts);
	const combined = {};
	for (const target of durableTargets) {
		const agentId = target.agentId;
		const storePath = target.storePath;
		const store = loadGatewayStoreEntries({
			agentId,
			projection,
			storePath
		});
		for (const { sessionKey: key, entry } of store) {
			const canonicalKey = resolveStoredSessionKeyForAgentStore({
				cfg,
				agentId,
				sessionKey: key
			});
			if (key !== canonicalKey) throw canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${canonicalKey}`);
			const canonicalAgentId = normalizeAgentId(parseAgentSessionKey(canonicalKey)?.agentId ?? agentId);
			if (requestedAgentId && canonicalAgentId !== requestedAgentId) continue;
			mergeSessionEntryIntoCombined({
				cfg,
				combined,
				entry,
				agentId: canonicalAgentId,
				canonicalKey
			});
		}
	}
	const incognitoStorePaths = mergeOpenIncognitoStores({
		cfg,
		combined,
		projection,
		targets: incognitoTargets
	});
	if (configuredAgentIds) filterCombinedStoreToConfiguredAgents({
		cfg,
		configuredAgentIds,
		store: combined
	});
	const durableStorePaths = durableTargets.map((target) => target.storePath);
	const durableStorePath = preparedDurableStorePath ?? resolveCombinedDatabasePath(durableTargets, defaultAgentId);
	if (storeConfig && !isStorePathTemplate(storeConfig)) return {
		diagnostics,
		durableStorePath,
		durableTargets,
		storePath: incognitoStorePaths.length > 0 ? "(multiple)" : durableStorePath,
		store: combined
	};
	return {
		diagnostics,
		durableStorePath,
		durableTargets,
		storePath: resolveCombinedStorePath([...durableStorePaths, ...incognitoStorePaths], storeConfig),
		store: combined
	};
}
//#endregion
export { loadCombinedSessionStoreForGatewayCore as n, canPrewarmCombinedSessionStoresForGateway as t };
