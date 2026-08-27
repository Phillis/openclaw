import { m as mergeRuntimeExternalProfileReferences } from "../persisted-B895D0I1.js";
import { g as replaceRuntimeAuthProfileStoreSnapshots } from "../runtime-snapshots-CVpJCNdz.js";
import { x as withPluginRuntimeGenerationScope } from "../hook-runner-global-BgVsqem2.js";
import { n as overlayExternalAuthProfiles } from "../external-auth-D0I4FGco.js";
import { r as listExternalCliSyncProviderIds } from "../external-cli-sync-DCM6idGB.js";
import { m as preserveResolvedSecretBackedCredentials, p as loadAuthProfileStoreWithoutExternalProfiles } from "../store-DZy8rsrA.js";
import { f as resolveAmbientAgentCredentialsForDiscovery, m as resolveUsableAgentCredentialModes, p as resolveAgentCredentialMapFromStore } from "../prepared-model-runtime.facts-B0EtkVQK.js";
import { gt as AuthStorage } from "../sessions-BHNzcBA2.js";
import { r as fingerprintPreparedModelCatalogGeneration } from "../prepared-model-catalog-worker-UYICDCc6.js";
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
		pluginRegistry: params.pluginGeneration.pluginRegistry,
		workspaceDir: params.pluginGeneration.pluginMetadataSnapshot.workspaceDir
	}, () => overlayExternalAuthProfiles(prepared, {
		config: params.config,
		env: params.env,
		...params.providerIds ? { externalCliProviderIds: params.providerIds } : {},
		...params.profileIds ? { externalCliProfileIds: params.profileIds } : {},
		allowKeychainPrompt: false
	}));
}
async function prepareWorkerGeneration(value) {
	const { prepareWorkspaceBuildGroup } = await import("../prepared-model-runtime.facts-BZDdr6R_.js");
	const prepared = await prepareWorkspaceBuildGroup([value.input], "live");
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
		const { prepareAgentCatalogSource, prepareFullCatalogFacts } = await import("../prepared-model-runtime.facts-BZDdr6R_.js");
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
				pluginRegistry: prepared.pluginGeneration.pluginRegistry,
				workspaceDir: value.input.workspaceDir
			}, () => resolveAmbientAgentCredentialsForDiscovery({
				config: value.input.config,
				env: value.input.env,
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
