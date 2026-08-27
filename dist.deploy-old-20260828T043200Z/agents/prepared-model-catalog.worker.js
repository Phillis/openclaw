import { c as restorePluginMetadataSnapshot } from "../plugin-metadata-snapshot-CeAk9iRD.js";
import { n as withPluginRuntimeGenerationScope } from "../generation-scope-DDjt_91x.js";
import { _ as mergeRuntimeExternalProfileReferences } from "../persisted-DGErf7Xt.js";
import { n as overlayExternalAuthProfiles } from "../external-auth-C_dozyej.js";
import { n as listExternalCliSyncProviderIds } from "../external-cli-sync-8w5l6WKw.js";
import { m as preserveResolvedSecretBackedCredentials, p as loadAuthProfileStoreWithoutExternalProfiles } from "../store-C0UG5FOx.js";
import { g as replaceRuntimeAuthProfileStoreSnapshots } from "../runtime-snapshots-ChaCVIEN.js";
import { n as resolveRuntimeSyntheticAuthProviderRefs } from "../synthetic-auth.runtime-Dxm6GkhK.js";
import { d as resolveAmbientAgentCredentialsForDiscovery, f as resolveAgentCredentialMapFromStore, p as resolveUsableAgentCredentialModes } from "../prepared-model-runtime.plugin-generation-BglH_JIU.js";
import { vt as AuthStorage } from "../sessions-PHTfe5gZ.js";
import { a as scopeSyntheticAuthProviderRefs } from "../prepared-model-runtime.facts-D3vOUXaC.js";
import { r as fingerprintPreparedModelCatalogGeneration } from "../prepared-model-catalog-worker-BmNY_W0R.js";
import { parentPort, workerData } from "node:worker_threads";
//#region src/agents/prepared-model-catalog.worker.ts
/** Worker-thread entrypoint for complete model-catalog discovery. */
function refreshAuthStore(params) {
	const durable = preserveResolvedSecretBackedCredentials({
		next: loadAuthProfileStoreWithoutExternalProfiles(params.agentDir, {
			allowKeychainPrompt: false,
			...params.inheritedAuthDir ? { inheritedAuthDir: params.inheritedAuthDir } : {}
		}),
		existing: params.authStore
	});
	const persistedProfileIds = new Set(params.authStore.runtimePersistedProfileIds ?? []);
	const externalProfileIds = new Set(params.authStore.runtimeExternalProfileIds ?? []);
	for (const [profileId, credential] of Object.entries(params.authStore.profiles)) if (!persistedProfileIds.has(profileId) && !externalProfileIds.has(profileId) && durable.profiles[profileId] === void 0) durable.profiles[profileId] = credential;
	const prepared = mergeRuntimeExternalProfileReferences({
		next: durable,
		existing: params.authStore
	});
	return withPluginRuntimeGenerationScope({
		config: params.config,
		metadataSnapshot: params.pluginGeneration.pluginMetadataSnapshot,
		pluginRegistry: params.pluginGeneration.pluginRegistry
	}, () => overlayExternalAuthProfiles(prepared, {
		config: params.config,
		env: params.env,
		...params.providerIds ? { externalCliProviderIds: params.providerIds } : {},
		...params.profileIds ? { externalCliProfileIds: params.profileIds } : {},
		allowKeychainPrompt: false
	}));
}
async function prepareWorkerGeneration(value) {
	const { prepareWorkspaceBuildGroup } = await import("../prepared-model-runtime.facts-Dvt43WVQ.js");
	const metadata = restorePluginMetadataSnapshot(value.pluginMetadataSnapshot);
	const prepared = await prepareWorkspaceBuildGroup([value.input], "live", {}, void 0, void 0, metadata);
	const agentFacts = prepared.agentFacts[0];
	if (!agentFacts) throw new Error("prepared model catalog worker produced no agent facts");
	if (fingerprintPreparedModelCatalogGeneration({
		input: value.input,
		authStore: value.authStore,
		providerIds: value.providerIds,
		pluginMetadataSnapshot: prepared.pluginGeneration.pluginMetadataSnapshot
	}) !== value.generationFingerprint) throw new Error("prepared model catalog worker reconstructed a different runtime generation");
	return {
		agentFacts,
		pluginGeneration: prepared.pluginGeneration
	};
}
async function runPreparedModelCatalogWorkerRequest(value, request, preparedGeneration = prepareWorkerGeneration(value)) {
	try {
		const prepared = await preparedGeneration;
		if (request.kind === "auth-refresh") {
			const authStore = refreshAuthStore({
				agentDir: value.input.agentDir,
				inheritedAuthDir: value.input.inheritedAuthDir,
				authStore: value.authStore,
				config: value.input.config,
				env: value.input.env ?? process.env,
				...request.profileIds ? { profileIds: request.profileIds } : {},
				providerIds: request.providerIds,
				pluginGeneration: prepared.pluginGeneration
			});
			return {
				status: "ok",
				requestId: request.requestId,
				kind: "auth-refresh",
				generationFingerprint: value.generationFingerprint,
				authStore,
				authModes: resolveUsableAgentCredentialModes(resolveAgentCredentialMapFromStore(authStore, { config: value.input.config }))
			};
		}
		const { prepareAgentCatalogSource } = await import("../prepared-model-runtime.facts-Dvt43WVQ.js");
		const { prepareFullCatalogFacts } = await import("../prepared-model-runtime.full-catalog-DW4tygO7.js");
		const authStore = refreshAuthStore({
			agentDir: value.input.agentDir,
			inheritedAuthDir: value.input.inheritedAuthDir,
			authStore: value.authStore,
			config: value.input.config,
			env: value.input.env ?? process.env,
			providerIds: listExternalCliSyncProviderIds(),
			pluginGeneration: prepared.pluginGeneration
		});
		replaceRuntimeAuthProfileStoreSnapshots([{
			agentDir: value.input.agentDir,
			store: authStore
		}]);
		const credentials = {
			...withPluginRuntimeGenerationScope({
				config: value.input.config,
				metadataSnapshot: prepared.pluginGeneration.pluginMetadataSnapshot,
				pluginRegistry: prepared.pluginGeneration.pluginRegistry
			}, () => resolveAmbientAgentCredentialsForDiscovery({
				config: value.input.config,
				env: value.input.env,
				syntheticAuthProviderRefs: scopeSyntheticAuthProviderRefs(resolveRuntimeSyntheticAuthProviderRefs(), value.providerIds),
				...value.input.workspaceDir ? { workspaceDir: value.input.workspaceDir } : {}
			})),
			...resolveAgentCredentialMapFromStore(authStore, { config: value.input.config })
		};
		const exactAgentFacts = {
			...prepared.agentFacts,
			authStore,
			templateAuthStorage: AuthStorage.inMemory(credentials),
			credentials,
			providerIds: [.../* @__PURE__ */ new Set([...value.providerIds, ...Object.keys(credentials)])].toSorted((left, right) => left.localeCompare(right))
		};
		const source = await prepareAgentCatalogSource(exactAgentFacts, prepared.pluginGeneration, "live", false, { authStore });
		const facts = await prepareFullCatalogFacts(exactAgentFacts, prepared.pluginGeneration, "live", source);
		return {
			status: "ok",
			requestId: request.requestId,
			kind: "catalog",
			generationFingerprint: value.generationFingerprint,
			snapshot: facts.modelCatalog,
			authStore,
			authModes: resolveUsableAgentCredentialModes(credentials)
		};
	} catch (error) {
		return {
			status: "failed",
			requestId: request.requestId,
			error: error instanceof Error ? error.message : String(error)
		};
	}
}
if (parentPort) {
	const send = parentPort.postMessage.bind(parentPort);
	const value = workerData;
	const preparedGeneration = prepareWorkerGeneration(value);
	let queue = Promise.resolve();
	parentPort.on("message", (request) => {
		queue = queue.then(async () => {
			send(await runPreparedModelCatalogWorkerRequest(value, request, preparedGeneration));
		});
	});
}
//#endregion
export { runPreparedModelCatalogWorkerRequest };
