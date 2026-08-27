import "./agent-scope-DigoIwHb.js";
import { a as listAgentIds, f as resolveAgentWorkspaceDir, l as resolveAgentDir, p as resolveAmbientOwnerAgentId } from "./agent-scope-config-CUBiGmG3.js";
import { n as resolveDefaultAgentWorkspaceDir } from "./workspace-default-DNxmF3kK.js";
import { n as getRuntimeConfig } from "./io-DlN5njvP.js";
import { a as resolveLegacyInheritedAuthDir } from "./legacy-inherited-auth-dir-DSU8DSTr.js";
import "./config-B2bSneS2.js";
import { a as loadPreparedModelRuntimeAuth, c as setPreparedModelRuntimeAuthMaterializations, l as setPreparedModelRuntimeAuthStore, n as getPreparedModelFullCatalogAuth, r as getPreparedModelRuntimeAuthMaterializations, s as setPreparedModelRuntimeAuthLoader } from "./prepared-model-runtime-auth-CnrySjUa.js";
import { n as resolvePublishedModelCatalogOwner } from "./prepared-model-catalog-owner-BVMJbn_l.js";
import { i as normalizeThinkingCatalogProviders, n as hasResolvedThinkingCatalogEntry } from "./thinking-runtime-1slENmfx.js";
import "./workspace-CYdcs93J.js";
import { t as isPreparedModelCatalogFull } from "./prepared-model-runtime.full-catalog-BZLdS4PV.js";
import { t as PreparedModelRuntimeOwnerNotPublishedError } from "./prepared-model-runtime.errors-DeG6Ut3_.js";
import { a as getPreparedModelRuntimeSnapshot, l as prepareModelRuntimeSnapshot, n as acquireReadOnlyPreparedModelRuntime, p as preparedModelRuntimeConfigsMatch, r as activateStandalonePreparedModelRuntime, t as acquireAgentRunPreparedModelRuntime } from "./prepared-model-runtime-afzKiwqZ.js";
import { n as prepareScopedReadOnlyModelCatalog, t as prepareScopedReadOnlyLiveModelCatalog } from "./prepared-model-runtime.scoped-catalog-9dgFU7-W.js";
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
	const explicitOrDefaultAgentId = params.agentId ?? (params.agentDir === void 0 ? resolveAmbientOwnerAgentId(config) : void 0);
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
	if (activationFull.workspaceDir !== full.workspaceDir) {
		const activatedFull = getPreparedModelRuntimeSnapshot(activationFull);
		if (activatedFull && preparedModelRuntimeConfigsMatch(activatedFull.config, full.config)) return activatedFull;
	}
	if (exact === full) return;
	const publishedExact = getPreparedModelRuntimeSnapshot(exact);
	if (publishedExact && preparedModelRuntimeConfigsMatch(publishedExact.config, exact.config)) return publishedExact;
	if (activationExact.workspaceDir === exact.workspaceDir) return;
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
/** Returns the newest completed catalog for the current generation without starting discovery. */
function getAvailablePreparedModelCatalogSnapshot(params = {}) {
	const owner = getPreparedModelCatalogOwnerSnapshot(params);
	return owner?.readFullModelCatalog?.() ?? owner?.modelCatalog;
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
* Turn-path capability reads (thinking levels and similar per-model facts) must stay off a new
* full catalog build: reuse the published generation, then manifest/scoped read-only metadata,
* then scoped live discovery only for providers whose models exist solely at runtime.
*/
async function loadProviderScopedThinkingCatalog(params) {
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
	const augmentHarnessCatalog = async (snapshot) => {
		const agentId = params.agentId ?? resolveAmbientOwnerAgentId(params.config);
		const { augmentModelCatalogWithAgentHarness } = await import("./model-catalog-Czqp9Zp1.js");
		return normalizeThinkingCatalogProviders((await augmentModelCatalogWithAgentHarness({
			cfg: params.config,
			agentId,
			agentDir: params.agentDir ?? resolveAgentDir(params.config, agentId),
			workspaceDir: params.workspaceDir ?? resolveAgentWorkspaceDir(params.config, agentId) ?? resolveDefaultAgentWorkspaceDir(),
			defaultProvider: params.provider,
			defaultModel: `${params.provider}/${params.model}`,
			snapshot
		})).entries);
	};
	const publishedCatalog = getPreparedModelCatalogSnapshot(scopedParams);
	if (publishedCatalog && entryResolved(publishedCatalog.entries)) return await augmentHarnessCatalog(publishedCatalog);
	const { loadManifestModelCatalog } = await import("./model-catalog-voDZx4Qf.js");
	const manifestCatalog = normalizeThinkingCatalogProviders(loadManifestModelCatalog({
		config: params.config,
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
	}));
	if (entryResolved(manifestCatalog)) return await augmentHarnessCatalog({
		entries: manifestCatalog,
		routeVariants: manifestCatalog,
		staticEntries: manifestCatalog
	});
	const scopedStatic = await loadPreparedModelCatalogSnapshot(scopedParams);
	if (entryResolved(scopedStatic.entries)) return await augmentHarnessCatalog(scopedStatic);
	return await augmentHarnessCatalog(await loadPreparedModelCatalogSnapshot({
		...scopedParams,
		scopedLiveProviderDiscovery: true
	}));
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
export { loadPreparedModelCatalog as a, loadProviderScopedThinkingCatalog as c, loadResolvedPublishedModelCatalogOwner as d, getPublishedPreparedModelCatalogOwnerSnapshot as i, loadPublishedPreparedModelCatalog as l, getPreparedModelCatalogOwnerSnapshot as n, loadPreparedModelCatalogOwnerSnapshot as o, getPreparedModelCatalogSnapshot as r, loadPreparedModelCatalogSnapshot as s, getAvailablePreparedModelCatalogSnapshot as t, loadPublishedPreparedModelCatalogOwnerSnapshot as u };
