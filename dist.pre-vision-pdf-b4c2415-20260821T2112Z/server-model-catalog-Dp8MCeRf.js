import { r as getRuntimeConfig } from "./io-CeQckj5v.js";
import { i as loadPreparedModelRuntimeAuth, n as resolvePublishedModelCatalogOwner, r as getPreparedModelRuntimeAuthMaterializations } from "./prepared-model-catalog-owner-DOM4UhG5.js";
import { n as PreparedModelRuntimePublicationSupersededError } from "./prepared-model-runtime.errors-DUOk3SoP.js";
import { n as isPreparedModelCatalogFull } from "./prepared-model-runtime.facts-BrYzuXKg.js";
//#region src/gateway/server-model-catalog.ts
async function resolveLoader(params) {
	if (params?.loadPublishedPreparedModelCatalogOwnerSnapshot) return params.loadPublishedPreparedModelCatalogOwnerSnapshot;
	const { loadPublishedPreparedModelCatalogOwnerSnapshot } = await import("./prepared-model-catalog-BGLDTo2i.js");
	return loadPublishedPreparedModelCatalogOwnerSnapshot;
}
async function resetPreparedModelCatalogStateForTest() {
	const [{ resetPreparedModelRuntimeSnapshotsForTest }, { resetModelCatalogBuilderCacheForTest }] = await Promise.all([import("./prepared-model-runtime.test-support-BYyBntIt.js"), import("./model-catalog-gBlOUXXc.js")]);
	resetPreparedModelRuntimeSnapshotsForTest();
	resetModelCatalogBuilderCacheForTest();
}
async function loadGatewayModelCatalogOwnerSnapshot(params) {
	const candidate = await (await resolveLoader(params))({
		...params?.agentId ? { agentId: params.agentId } : {},
		...params?.agentDir ? { agentDir: params.agentDir } : {},
		config: (params?.getConfig ?? getRuntimeConfig)(),
		readOnly: params?.readOnly !== false,
		...params?.refreshFullCatalog ? { refreshFullCatalog: true } : {},
		...params?.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
	});
	return {
		candidate,
		owner: {
			...resolvePublishedModelCatalogOwner(candidate),
			authMaterializations: getPreparedModelRuntimeAuthMaterializations(candidate)
		}
	};
}
function projectGatewayModelCatalogSnapshot(owner) {
	return {
		...owner.modelCatalog,
		agentId: owner.agentId,
		agentDir: owner.agentDir,
		catalogComplete: isPreparedModelCatalogFull(owner.modelCatalog),
		workspaceDir: owner.workspaceDir,
		config: owner.config
	};
}
async function loadPreparedGatewayModelCatalogSnapshot(params) {
	for (;;) {
		let loaded;
		try {
			loaded = await loadGatewayModelCatalogOwnerSnapshot(params);
		} catch (error) {
			if (error instanceof PreparedModelRuntimePublicationSupersededError) continue;
			throw error;
		}
		const { candidate, owner } = loaded;
		let refreshedAuth;
		try {
			refreshedAuth = params?.refreshAuth ? await loadPreparedModelRuntimeAuth(candidate, params.authScope ?? { providerIds: owner.modelCatalog.entries.map((entry) => entry.provider) }) : void 0;
		} catch (error) {
			if (error instanceof PreparedModelRuntimePublicationSupersededError) continue;
			refreshedAuth = void 0;
		}
		return {
			...projectGatewayModelCatalogSnapshot(owner),
			authModes: refreshedAuth?.authModes ?? owner.authModes,
			authStore: refreshedAuth?.authStore ?? owner.authStore,
			metadataSnapshot: owner.metadataSnapshot,
			authMaterializations: owner.authMaterializations
		};
	}
}
async function loadGatewayModelCatalogSnapshot(params) {
	const { authModes: _authModes, authStore: _authStore, metadataSnapshot: _metadataSnapshot, authMaterializations: _authMaterializations, ...snapshot } = await loadPreparedGatewayModelCatalogSnapshot(params);
	return snapshot;
}
async function loadGatewayModelCatalog(params) {
	return (await loadGatewayModelCatalogSnapshot(params)).entries;
}
/** Reads the already-published startup catalog without starting provider discovery. */
async function readPreparedGatewayModelCatalog(params) {
	const { getPreparedModelCatalogSnapshot } = await import("./prepared-model-catalog-BGLDTo2i.js");
	const config = (params?.getConfig ?? getRuntimeConfig)();
	return getPreparedModelCatalogSnapshot({
		...params?.agentId ? { agentId: params.agentId } : {},
		...params?.agentDir ? { agentDir: params.agentDir } : {},
		config,
		readOnly: true,
		...params?.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
	})?.entries;
}
/** Reads the published owner generation without activating full catalog discovery. */
async function readPreparedGatewayModelCatalogOwnerSnapshot(params) {
	const { getPublishedPreparedModelCatalogOwnerSnapshot } = await import("./prepared-model-catalog-BGLDTo2i.js");
	const config = (params?.getConfig ?? getRuntimeConfig)();
	const candidate = getPublishedPreparedModelCatalogOwnerSnapshot({
		...params?.agentId ? { agentId: params.agentId } : {},
		...params?.agentDir ? { agentDir: params.agentDir } : {},
		config,
		...params?.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
	});
	if (!candidate) return;
	const owner = resolvePublishedModelCatalogOwner(candidate);
	return {
		...projectGatewayModelCatalogSnapshot(owner),
		authModes: owner.authModes,
		authStore: owner.authStore,
		metadataSnapshot: owner.metadataSnapshot,
		authMaterializations: getPreparedModelRuntimeAuthMaterializations(candidate)
	};
}
//#endregion
export { readPreparedGatewayModelCatalogOwnerSnapshot as a, readPreparedGatewayModelCatalog as i, loadGatewayModelCatalogSnapshot as n, resetPreparedModelCatalogStateForTest as o, loadPreparedGatewayModelCatalogSnapshot as r, loadGatewayModelCatalog as t };
