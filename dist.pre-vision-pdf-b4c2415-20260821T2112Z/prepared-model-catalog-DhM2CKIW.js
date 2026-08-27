import "./agent-scope-BizOtGGz.js";
import { a as listAgentIds, b as tryResolveLegacyCompatibilityAgentId, d as resolveAgentWorkspaceDir, l as resolveAgentDir, p as resolveDefaultAgentId } from "./agent-scope-config-BdXMWufB.js";
import { r as getRuntimeConfig } from "./io-CeQckj5v.js";
import { i as resolveLegacyInheritedAuthDir } from "./legacy-inherited-auth-dir-DqCM942-.js";
import "./config-Dl8DJbzM.js";
import { a as setPreparedModelRuntimeAuthLoader, i as loadPreparedModelRuntimeAuth, n as resolvePublishedModelCatalogOwner, o as setPreparedModelRuntimeAuthMaterializations, r as getPreparedModelRuntimeAuthMaterializations, s as setPreparedModelRuntimeAuthStore } from "./prepared-model-catalog-owner-DOM4UhG5.js";
import { t as PreparedModelRuntimeOwnerNotPublishedError } from "./prepared-model-runtime.errors-DUOk3SoP.js";
import { n as isPreparedModelCatalogFull } from "./prepared-model-runtime.facts-BrYzuXKg.js";
import { i as getPreparedModelFullCatalogAuth } from "./prepared-model-catalog-worker-B3ekHnv8.js";
import { c as prepareModelRuntimeSnapshot, i as getPreparedModelRuntimeSnapshot, n as acquireReadOnlyPreparedModelRuntime, p as preparedModelRuntimeConfigsMatch, r as activateStandalonePreparedModelRuntime, t as acquireAgentRunPreparedModelRuntime } from "./prepared-model-runtime-CzaIYeTz.js";
import { n as prepareScopedReadOnlyModelCatalog, t as prepareScopedReadOnlyLiveModelCatalog } from "./prepared-model-runtime.scoped-catalog-NhiTzCgQ.js";
import { i as normalizeThinkingCatalogProviders, n as hasResolvedThinkingCatalogEntry } from "./thinking-runtime-BnpBwpz_.js";
//#region src/agents/prepared-model-catalog.errors.ts
var PreparedModelCatalogConfigReplacedError = class extends Error {
	constructor(agentDir) {
		super(`prepared model catalog owner config was replaced during the read (${agentDir})`);
		this.name = "PreparedModelCatalogConfigReplacedError";
	}
};
//#endregion
//#region src/agents/prepared-model-catalog.ts
/** Lifecycle-owned model catalog access. */
async function materializeRequestedModelCatalog(snapshot, readOnly, refreshFullCatalog) {
	if (!snapshot.loadFullModelCatalog) return snapshot;
	const modelCatalog = readOnly === true ? snapshot.readFullModelCatalog?.() : await snapshot.loadFullModelCatalog({ refresh: refreshFullCatalog === true });
	if (!modelCatalog) return snapshot;
	const fullAuth = getPreparedModelFullCatalogAuth(modelCatalog);
	if (!fullAuth) throw new Error("prepared full model catalog omitted its auth generation");
	const materialized = Object.freeze({
		...snapshot,
		authModes: fullAuth.authModes,
		modelCatalog
	});
	setPreparedModelRuntimeAuthStore(materialized, fullAuth.authStore);
	setPreparedModelRuntimeAuthLoader(materialized, async (scope) => await loadPreparedModelRuntimeAuth(snapshot, scope) ?? fullAuth);
	setPreparedModelRuntimeAuthMaterializations(materialized, getPreparedModelRuntimeAuthMaterializations(snapshot));
	return materialized;
}
function acceptsPreparedSnapshotConfig(snapshot, input, policy) {
	return policy === "published" || preparedModelRuntimeConfigsMatch(snapshot.config, input.config);
}
function resolveInputs(params = {}) {
	const config = params.config ?? getRuntimeConfig();
	const explicitOrDefaultAgentId = params.agentId ?? (params.agentDir === void 0 ? tryResolveLegacyCompatibilityAgentId(config) ?? resolveDefaultAgentId(config) : void 0);
	const agentDir = params.agentDir ?? resolveAgentDir(config, explicitOrDefaultAgentId, params.env);
	const matchingAgentIds = params.agentDir === void 0 ? [] : listAgentIds(config).filter((candidateAgentId) => resolveAgentDir(config, candidateAgentId) === agentDir);
	const agentId = explicitOrDefaultAgentId ?? (matchingAgentIds.length === 1 ? matchingAgentIds[0] : void 0);
	const explicitWorkspaceDir = params.workspaceDir === void 0 ? void 0 : params.workspaceDir;
	const activationWorkspaceDir = explicitWorkspaceDir ?? (agentId ? resolveAgentWorkspaceDir(config, agentId) : void 0);
	const full = {
		...agentId ? { agentId } : {},
		agentDir,
		config,
		...params.env ? { env: params.env } : {},
		inheritedAuthDir: resolveLegacyInheritedAuthDir(config, params.env),
		...explicitWorkspaceDir ? { workspaceDir: explicitWorkspaceDir } : {},
		...params.allowGatewaySubagentBinding ? { allowGatewaySubagentBinding: true } : {}
	};
	const exact = params.readOnly ? {
		...full,
		readOnly: true
	} : full;
	const activationFull = activationWorkspaceDir ? {
		...full,
		workspaceDir: activationWorkspaceDir
	} : full;
	return {
		exact,
		full,
		activationFull,
		activationExact: params.readOnly ? {
			...activationFull,
			readOnly: true
		} : activationFull
	};
}
/** Returns the configured lifecycle owner for the current generation without starting discovery. */
function getPreparedModelCatalogOwnerSnapshot(params = {}) {
	const { activationExact, activationFull, exact, full } = resolveInputs(params);
	const publishedFull = getPreparedModelRuntimeSnapshot(full);
	if (publishedFull && preparedModelRuntimeConfigsMatch(publishedFull.config, full.config)) return publishedFull;
	if (activationFull && activationFull.workspaceDir !== full.workspaceDir) {
		const activatedFull = getPreparedModelRuntimeSnapshot(activationFull);
		if (activatedFull && preparedModelRuntimeConfigsMatch(activatedFull.config, full.config)) return activatedFull;
	}
	if (exact === full) return;
	const publishedExact = getPreparedModelRuntimeSnapshot(exact);
	if (publishedExact && preparedModelRuntimeConfigsMatch(publishedExact.config, exact.config)) return publishedExact;
	if (!activationExact || activationExact.workspaceDir === exact.workspaceDir) return;
	const activatedExact = getPreparedModelRuntimeSnapshot(activationExact);
	return activatedExact && preparedModelRuntimeConfigsMatch(activatedExact.config, exact.config) ? activatedExact : void 0;
}
/**
* Returns the currently published lifecycle owner and its configured/static turn facts without
* config hashing, fallback construction, or full control-plane catalog materialization.
*/
function getPublishedPreparedModelCatalogOwnerSnapshot(params = {}) {
	const { activationFull, full } = resolveInputs(params);
	const published = getPreparedModelRuntimeSnapshot(full);
	if (published) return published;
	if (activationFull.workspaceDir === full.workspaceDir) return;
	return getPreparedModelRuntimeSnapshot(activationFull);
}
/** Returns the configured catalog for the current generation without starting discovery. */
function getPreparedModelCatalogSnapshot(params = {}) {
	return getPreparedModelCatalogOwnerSnapshot(params)?.modelCatalog;
}
async function resolvePreparedModelCatalogOwnerSnapshotWithPolicy(params, configPolicy) {
	const { activationExact, activationFull, exact, full } = resolveInputs(params);
	if (params.readOnly) {
		const fullCandidates = activationFull.workspaceDir === full.workspaceDir ? [full] : [full, activationFull];
		for (const candidate of fullCandidates) try {
			const prepared = await prepareModelRuntimeSnapshot(candidate);
			if (!acceptsPreparedSnapshotConfig(prepared, candidate, configPolicy)) throw new PreparedModelCatalogConfigReplacedError(candidate.agentDir);
			return prepared;
		} catch (error) {
			if (!(error instanceof PreparedModelRuntimeOwnerNotPublishedError)) throw error;
		}
		const lease = await acquireReadOnlyPreparedModelRuntime(activationExact);
		try {
			if (!acceptsPreparedSnapshotConfig(lease.snapshot, activationExact, configPolicy)) throw new PreparedModelCatalogConfigReplacedError(activationExact.agentDir);
			return lease.snapshot;
		} finally {
			lease.release();
		}
	}
	if (exact !== full) {
		const fullCandidates = activationFull.workspaceDir === full.workspaceDir ? [full] : [full, activationFull];
		for (const candidate of fullCandidates) try {
			const preparedFull = await prepareModelRuntimeSnapshot(candidate);
			if (acceptsPreparedSnapshotConfig(preparedFull, full, configPolicy)) return preparedFull;
		} catch (error) {
			if (!(error instanceof PreparedModelRuntimeOwnerNotPublishedError)) throw error;
		}
	}
	try {
		const preparedExact = await prepareModelRuntimeSnapshot(exact);
		if (acceptsPreparedSnapshotConfig(preparedExact, exact, configPolicy)) return preparedExact;
	} catch (error) {
		if (!(error instanceof PreparedModelRuntimeOwnerNotPublishedError)) throw error;
	}
	const activated = await activateStandalonePreparedModelRuntime(activationExact);
	if (activated && acceptsPreparedSnapshotConfig(activated, activationExact, configPolicy)) return activated;
	if (activated) throw new PreparedModelRuntimeOwnerNotPublishedError(`prepared model catalog owner was not published for the requested config (${activationExact.agentDir})`);
	const lease = await acquireAgentRunPreparedModelRuntime(activationFull);
	try {
		if (!acceptsPreparedSnapshotConfig(lease.snapshot, activationFull, configPolicy)) throw new PreparedModelRuntimeOwnerNotPublishedError(`prepared model catalog owner was not published for the requested config (${activationFull.agentDir})`);
		return lease.snapshot;
	} finally {
		lease.release();
	}
}
async function loadPreparedModelCatalogOwnerSnapshotWithPolicy(params, configPolicy) {
	const publishedReadOnlyOwner = params.readOnly ? getPreparedModelCatalogOwnerSnapshot(params) : void 0;
	const snapshot = await resolvePreparedModelCatalogOwnerSnapshotWithPolicy(params, configPolicy);
	if (params.readOnly && !publishedReadOnlyOwner) return snapshot;
	return await materializeRequestedModelCatalog(snapshot, params.readOnly, params.refreshFullCatalog);
}
async function loadScopedReadOnlyModelCatalog(params) {
	const { activationExact, activationFull, full } = resolveInputs(params);
	const fullCandidates = activationFull.workspaceDir === full.workspaceDir ? [full] : [full, activationFull];
	for (const candidate of fullCandidates) try {
		const prepared = await prepareModelRuntimeSnapshot(candidate);
		if (!preparedModelRuntimeConfigsMatch(prepared.config, candidate.config)) throw new PreparedModelCatalogConfigReplacedError(candidate.agentDir);
		if (isPreparedModelCatalogFull(prepared.modelCatalog)) return prepared.modelCatalog;
	} catch (error) {
		if (!(error instanceof PreparedModelRuntimeOwnerNotPublishedError)) throw error;
	}
	return (params.scopedLiveProviderDiscovery === true ? prepareScopedReadOnlyLiveModelCatalog : prepareScopedReadOnlyModelCatalog)(activationExact, params.providerDiscoveryProviderIds ?? []);
}
/**
* Turn-path capability reads (thinking levels and similar per-model facts) must stay off the
* full live catalog build: manifest metadata first, then a provider-scoped read-only catalog,
* then scoped live discovery only for providers whose models exist solely at runtime.
*/
async function loadProviderScopedThinkingCatalog(params) {
	const { loadManifestModelCatalog } = await import("./model-catalog-gBlOUXXc.js");
	const manifestCatalog = normalizeThinkingCatalogProviders(loadManifestModelCatalog({
		config: params.config,
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
	}));
	const scopedParams = {
		config: params.config,
		...params.agentId ? { agentId: params.agentId } : {},
		...params.agentDir ? { agentDir: params.agentDir } : {},
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {},
		readOnly: true,
		providerDiscoveryProviderIds: [params.provider]
	};
	const entryResolved = (catalog) => hasResolvedThinkingCatalogEntry({
		catalog,
		provider: params.provider,
		model: params.model
	});
	if (entryResolved(manifestCatalog)) return manifestCatalog;
	const scopedStatic = normalizeThinkingCatalogProviders((await loadPreparedModelCatalogSnapshot(scopedParams)).entries);
	if (entryResolved(scopedStatic)) return scopedStatic;
	return normalizeThinkingCatalogProviders((await loadPreparedModelCatalogSnapshot({
		...scopedParams,
		scopedLiveProviderDiscovery: true
	})).entries);
}
/** Resolves the lifecycle owner for an exact caller-supplied config. */
async function loadPreparedModelCatalogOwnerSnapshot(params = {}) {
	return await loadPreparedModelCatalogOwnerSnapshotWithPolicy(params, "exact");
}
/** Resolves the currently published owner when Gateway config changes during the read. */
async function loadPublishedPreparedModelCatalogOwnerSnapshot(params = {}) {
	return await loadPreparedModelCatalogOwnerSnapshotWithPolicy(params, "published");
}
/** Resolves a complete published owner for long-lived runtime consumers. */
async function loadResolvedPublishedModelCatalogOwner(params = {}) {
	return resolvePublishedModelCatalogOwner(await loadPublishedPreparedModelCatalogOwnerSnapshot(params));
}
/** Reads one atomic catalog generation, activating a lifecycle owner when needed. */
async function loadPreparedModelCatalogSnapshot(params = {}) {
	if (params.readOnly && params.providerDiscoveryProviderIds) return loadScopedReadOnlyModelCatalog(params);
	return (await loadPreparedModelCatalogOwnerSnapshot(params)).modelCatalog;
}
async function loadPreparedModelCatalog(params = {}) {
	return (await loadPreparedModelCatalogSnapshot(params)).entries;
}
/** Reads the committed owner generation for long-lived runtime work. */
async function loadPublishedPreparedModelCatalog(params = {}) {
	return (await loadPublishedPreparedModelCatalogOwnerSnapshot(params)).modelCatalog.entries;
}
//#endregion
export { loadPreparedModelCatalogOwnerSnapshot as a, loadPublishedPreparedModelCatalog as c, loadPreparedModelCatalog as i, loadPublishedPreparedModelCatalogOwnerSnapshot as l, getPreparedModelCatalogSnapshot as n, loadPreparedModelCatalogSnapshot as o, getPublishedPreparedModelCatalogOwnerSnapshot as r, loadProviderScopedThinkingCatalog as s, getPreparedModelCatalogOwnerSnapshot as t, loadResolvedPublishedModelCatalogOwner as u };
