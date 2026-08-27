import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { r as getRuntimeConfig } from "./io-CeQckj5v.js";
import "./config-Dl8DJbzM.js";
import { i as loadOrCreateProcessDeviceIdentity } from "./device-identity-D1g4SzdB.js";
import { a as getActiveSecretsRuntimeConfigSnapshot, o as getActiveSecretsRuntimeEnvState } from "./runtime-state-BVazrsUD.js";
import { s as getPairedDevice } from "./device-pairing-CkbDK__R.js";
import { i as createDeviceWorkerRuntime, n as bindDeviceWorkerAvailability, r as bindDeviceWorkerReconciliation, t as DEVICE_WORKER_PROVIDER_ID } from "./device-provider-BH10kl6t.js";
import { t as nodeWorkerGatewayNamespace } from "./node-worker-gateway-namespace-kRiA3LFq.js";
//#region src/gateway/worker-environments/worker-bundle-retention.ts
const TERMINAL_ENVIRONMENT_STATES = /* @__PURE__ */ new Set([
	"destroyed",
	"failed",
	"orphaned"
]);
const RECOVERY_BUNDLE_PLACEMENT_STATES = /* @__PURE__ */ new Set([
	"syncing",
	"starting",
	"active",
	"draining",
	"reconciling"
]);
function listRetainedWorkerBundleHashes(params) {
	return uniqueStrings([...params.environments.flatMap((record) => record.bootstrapReceipt && !TERMINAL_ENVIRONMENT_STATES.has(record.state) ? [record.bootstrapReceipt.bundleHash] : []), ...params.placements.flatMap((placement) => placement.workerBundleHash && RECOVERY_BUNDLE_PLACEMENT_STATES.has(placement.state) ? [placement.workerBundleHash] : [])]);
}
//#endregion
//#region src/gateway/server-worker-environment-startup.ts
const loadWorkerEnvironmentRuntimeModule = createLazyRuntimeModule(() => import("./gateway/worker-environments/runtime.js"));
const loadWorkerInferenceRuntimeModule = createLazyRuntimeModule(() => import("./inference-runtime-DzH1-AZt.js"));
async function loadGatewayWorkerEnvironmentStartupState() {
	const [{ createWorkerEnvironmentStore }, { createWorkerSessionPlacementStore }] = await Promise.all([import("./store-uTiLCLs3.js"), import("./placement-store-pK8js7Sq.js")]);
	const store = createWorkerEnvironmentStore();
	const placementStore = createWorkerSessionPlacementStore();
	const records = store.list();
	const durableProviderIds = uniqueStrings(records.flatMap((record) => record.state === "destroyed" || record.state === "failed" || record.state === "orphaned" ? [] : record.providerId === "device" ? [] : [record.providerId]));
	const listDurableProviderIds = () => uniqueStrings(store.listForReconcile().filter((record) => record.providerId !== DEVICE_WORKER_PROVIDER_ID).map((record) => record.providerId));
	return {
		durableProviderIds,
		listDurableProviderIds,
		records,
		store,
		placementStore,
		hasNonlocalPlacementRecords: placementStore.listForReconcile().length > 0
	};
}
async function createGatewayWorkerEnvironmentRuntime(params) {
	const deviceRuntime = createDeviceWorkerRuntime({ getPairedDevice });
	const [{ createWorkerEnvironmentService }, { createWorkerLiveEventReceiver }, { createWorkerSessionPlacementGate }, { createWorkerTranscriptCommitter }, { createWorkerTunnelManager }, { createNodeWorkerTunnelManager }, { createNodeWorkspaceTransferService }, { createNodeWorkspaceTransferHttpCallback }, { createWorkerSessionToolExecutor }, { resolveWorkerProvider }] = await Promise.all([
		import("./service-BCyg7tlY.js"),
		import("./live-events-BR8ZsF7Q.js"),
		import("./placement-worker-gate-DsHLmvor.js"),
		import("./transcript-commit-CrHEtb8v.js"),
		import("./tunnel-DA22lo12.js"),
		import("./node-worker-tunnel-AQG-57Ka.js"),
		import("./node-workspace-transfer-service-CIjpwkGE.js"),
		import("./node-workspace-transfer-http-CQQSvosh.js"),
		import("./worker-session-tool-executor-Bg7qEHHh.js"),
		import("./worker-provider-registry-C63bcwyx.js")
	]);
	params.startup.placementStore.recoverWorkerSessionToolOperationsAfterRestart();
	params.startup.placementStore.clearLocalTurnClaimsAfterRestart();
	const placementGate = createWorkerSessionPlacementGate(params.startup.placementStore);
	const workerEnvironmentLog = params.log.child("worker-environments");
	const listRetainedBundleHashes = () => listRetainedWorkerBundleHashes({
		environments: params.startup.store.list(),
		placements: params.startup.placementStore.list()
	});
	let workerBundleProducer;
	let workerNpmArtifact;
	const prepareInstallation = async (install) => {
		const [workerRuntime, { WORKER_PROTOCOL_FEATURES }] = await Promise.all([loadWorkerEnvironmentRuntimeModule(), import("./worker-admission-DPj16P-k.js")]);
		const producer = workerBundleProducer ??= workerRuntime.createWorkerBundleProducer({
			protocolFeatures: WORKER_PROTOCOL_FEATURES,
			cacheOwnership: "exclusive",
			onCacheCleanupError: (error) => {
				workerEnvironmentLog.warn(`Worker bundle cache cleanup failed: ${String(error)}`);
			}
		});
		const bundle = await producer.prepare();
		await producer.prune(listRetainedBundleHashes());
		if (install === "bundle") return bundle;
		workerNpmArtifact ??= workerRuntime.resolveWorkerNpmInstallationArtifact({ bundle }).catch((error) => {
			workerNpmArtifact = void 0;
			throw error;
		});
		return await workerNpmArtifact;
	};
	const startupBindings = params.startup.records.flatMap((record) => record.state === "attached" && record.attachedSessionIds.length === 1 ? [{
		environmentId: record.environmentId,
		runEpoch: record.ownerEpoch,
		sessionId: record.attachedSessionIds[0]
	}] : []);
	const workerLiveEvents = createWorkerLiveEventReceiver({
		getConfig: getRuntimeConfig,
		startupBindings,
		startupOwners: new Map(startupBindings.map((binding) => [binding.environmentId, binding.runEpoch]))
	});
	const workerTunnelManager = createWorkerTunnelManager({ desktopSessionRegistry: params.desktopSessionRegistry });
	const nodeWorkspaceTransfer = createNodeWorkspaceTransferService({ getOwner: (environmentId) => params.startup.store.getTransferOwner(environmentId) });
	await nodeWorkspaceTransfer.initialize();
	const gatewayDeviceId = loadOrCreateProcessDeviceIdentity().deviceId;
	const nodeWorkerGatewayNamespace$1 = nodeWorkerGatewayNamespace(gatewayDeviceId);
	const nodeWorkerTunnelManager = createNodeWorkerTunnelManager({
		gatewayDeviceId,
		getEnvironment: (environmentId) => params.startup.store.get(environmentId),
		getTransport: () => deviceRuntime.getNodeTransport(),
		launchNodeWorker: async (request) => await deviceRuntime.launchNodeWorker(request),
		validateWorkerTurn: (binding) => placementGate.validateWorkerTurn(binding),
		workspaceTransfer: nodeWorkspaceTransfer
	});
	let executeSessionTool = async () => {
		throw new Error("Worker session tools are unavailable");
	};
	let dispatchChild = async () => {
		throw new Error("Worker session dispatch is unavailable");
	};
	const workerEnvironmentService = createWorkerEnvironmentService({
		store: params.startup.store,
		getConfig: getRuntimeConfig,
		resolveProvider: (providerId) => providerId === "device" ? deviceRuntime.provider : resolveWorkerProvider(params.getPluginRegistry(), providerId),
		prepareInstallation,
		resolveNodeWorkerBuild: async (deviceId) => {
			const build = await deviceRuntime.resolveWorkerBuild(deviceId);
			return build ? structuredClone(build) : void 0;
		},
		tunnelManager: workerTunnelManager,
		nodeTunnelManager: nodeWorkerTunnelManager,
		resolveWorkerGateway: params.resolveWorkerGateway,
		applyTranscriptCommit: createWorkerTranscriptCommitter({ getConfig: getRuntimeConfig }).commit,
		executeInference: async (inferenceParams) => {
			return await (await loadWorkerInferenceRuntimeModule()).executeWorkerInference(inferenceParams);
		},
		placementStore: placementGate,
		executeSessionTool: (request) => executeSessionTool(request),
		liveEvents: workerLiveEvents,
		resolveSshIdentity: async ({ provider, leaseId, profile, keyRef }) => {
			const workerRuntime = await loadWorkerEnvironmentRuntimeModule();
			return await workerRuntime.resolveWorkerSshIdentity({
				provider,
				leaseId,
				profile,
				keyRef,
				resolveGeneric: async (genericKeyRef) => ({
					kind: "material",
					contents: await workerRuntime.resolveSecretRefString(genericKeyRef, {
						config: getActiveSecretsRuntimeConfigSnapshot()?.sourceConfig ?? getRuntimeConfig(),
						env: getActiveSecretsRuntimeEnvState()
					})
				})
			});
		},
		bootstrapWorker: async ({ operationId, sshEndpoint, installation, resolveIdentity, signal }) => {
			return await (await loadWorkerEnvironmentRuntimeModule()).bootstrapWorker({
				operationId,
				ssh: sshEndpoint,
				artifact: installation,
				pinnedHostKey: sshEndpoint.hostKey
			}, {
				signal,
				resolveIdentity
			});
		},
		logger: workerEnvironmentLog
	});
	bindDeviceWorkerAvailability(workerEnvironmentService, deviceRuntime.isAvailable);
	bindDeviceWorkerReconciliation(workerEnvironmentService, async (deviceId) => {
		const environmentIds = params.startup.store.listForReconcile().filter((record) => {
			const settings = record.profileSnapshot.settings;
			const profileDeviceId = isRecord(settings) ? settings.device : void 0;
			return record.providerId === "device" && typeof profileDeviceId === "string" && profileDeviceId.trim() === deviceId;
		}).map((record) => record.environmentId);
		for (const environmentId of environmentIds) params.startup.store.revokeEnvironmentCredential(environmentId);
		await Promise.all(environmentIds.map(async (environmentId) => {
			await workerEnvironmentService.reconcileEnvironment(environmentId).catch(() => {
				workerEnvironmentLog.warn(`Device worker reconcile failed (${deviceId}, ${environmentId}); periodic cleanup will retry`);
			});
		}));
		return environmentIds;
	});
	executeSessionTool = createWorkerSessionToolExecutor({
		placements: params.startup.placementStore,
		environments: workerEnvironmentService,
		dispatchChild: (request) => dispatchChild(request)
	});
	return {
		workerEnvironmentService,
		workerLiveEvents,
		workerTunnelManager,
		nodeWorkerGatewayNamespace: nodeWorkerGatewayNamespace$1,
		bindWorkerSessionDispatch: (dispatch) => {
			dispatchChild = dispatch;
		},
		bindDeviceNodeControl: deviceRuntime.bindNodeTransport,
		bindNodeWorkspaceBindingResolver: (resolver) => nodeWorkerTunnelManager.bindWorkspaceBindingResolver(resolver),
		handleNodeWorkspaceTransferRequest: createNodeWorkspaceTransferHttpCallback(nodeWorkspaceTransfer)
	};
}
//#endregion
export { createGatewayWorkerEnvironmentRuntime, loadGatewayWorkerEnvironmentStartupState };
