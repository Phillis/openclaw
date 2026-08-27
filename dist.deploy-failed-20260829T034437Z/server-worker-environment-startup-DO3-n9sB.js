import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { n as getRuntimeConfig } from "./io-DlN5njvP.js";
import { n as VERSION } from "./version-CkBmshxX.js";
import "./config-B2bSneS2.js";
import { r as runCommandWithTimeout } from "./exec-D2kbpwdA.js";
import { i as loadOrCreateProcessDeviceIdentity } from "./device-identity-UxfYyiX_.js";
import { t as resolveGatewayPublicOrigin } from "./gateway-public-origin-BcHLka2A.js";
import { a as getActiveSecretsRuntimeConfigSnapshot, o as getActiveSecretsRuntimeEnvState } from "./runtime-state-LhRdbFR1.js";
import { A as CLOUD_WORKER_PAIRING_SETUP_BOOTSTRAP_PROFILE, i as ensureDevicePairSetupBootstrapToken } from "./device-bootstrap-DpkEF5MF.js";
import { m as removePairedDeviceRole, n as getPairedDevice } from "./device-pairing-Li5h-3GZ.js";
import { t as DEVICE_WORKER_PROVIDER_ID } from "./device-provider-identity-v6nXqNq_.js";
import { i as resolvePairingSetupFromConfig, n as encodePairingSetupCode, r as resolveConfiguredPairingPublicUrl } from "./setup-code-DpM52__Q.js";
import { n as bindDeviceWorkerReconciliation, r as createDeviceWorkerRuntime, t as bindDeviceWorkerAvailability } from "./device-provider-Cppm2wj2.js";
import { t as nodeWorkerGatewayNamespace } from "./node-worker-gateway-namespace-kRiA3LFq.js";
import { t as listRetainedWorkerBundleHashes } from "./worker-bundle-retention-BkGqvbuZ.js";
import { setTimeout } from "node:timers/promises";
//#region src/gateway/worker-environments/node-enrollment.ts
const NODE_ENROLLMENT_TIMEOUT_MS = 10 * 6e4;
const NODE_ENROLLMENT_POLL_MS = 250;
function enrollmentDisplayName(record) {
	return `Cloud worker ${record.profileId}`.slice(0, 64);
}
function resolveEnrollmentPackageSpecs() {
	return [`openclaw@${VERSION}`];
}
function createWorkerNodeEnrollmentManager(options) {
	const now = options.now ?? Date.now;
	const packageSpecs = resolveEnrollmentPackageSpecs();
	const controller = new AbortController();
	const { signal } = controller;
	const waitForDeviceId = async (environmentId) => {
		const deadline = now() + NODE_ENROLLMENT_TIMEOUT_MS;
		while (now() < deadline) {
			signal.throwIfAborted();
			const record = options.store.ensureNodeEnrollment(environmentId);
			if (record.destroyRequestedAtMs !== null) throw new Error("Worker node enrollment was canceled by environment teardown");
			if (record.nodeDeviceId) {
				const availability = await options.resolveAvailability(record.nodeDeviceId);
				signal.throwIfAborted();
				if (availability.available) return record.nodeDeviceId;
			}
			await setTimeout(NODE_ENROLLMENT_POLL_MS, void 0, { signal });
		}
		throw new Error("Worker node did not connect before the enrollment deadline");
	};
	const begin = async (record) => {
		signal.throwIfAborted();
		let current = options.store.ensureNodeEnrollment(record.environmentId);
		const displayName = enrollmentDisplayName(current);
		const wait = async () => await waitForDeviceId(current.environmentId);
		if (current.nodeDeviceId) return {
			mode: "resume",
			deviceId: current.nodeDeviceId,
			openclawVersion: VERSION,
			packageSpecs,
			displayName,
			signal,
			waitForDeviceId: wait
		};
		if (!current.nodeSetupId) throw new Error("Worker node enrollment setup identity was not persisted");
		const issued = await ensureDevicePairSetupBootstrapToken({
			setupId: current.nodeSetupId,
			profile: CLOUD_WORKER_PAIRING_SETUP_BOOTSTRAP_PROFILE
		});
		signal.throwIfAborted();
		if (issued.status === "completed") {
			current = options.store.ensureNodeEnrollment(current.environmentId);
			if (!current.nodeDeviceId || current.nodeDeviceId !== issued.deviceId) throw new Error("Worker node enrollment completion did not bind its environment");
			return {
				mode: "resume",
				deviceId: current.nodeDeviceId,
				openclawVersion: VERSION,
				packageSpecs,
				displayName,
				signal,
				waitForDeviceId: wait
			};
		}
		const config = options.getConfig();
		const resolved = await resolvePairingSetupFromConfig(config, {
			env: process.env,
			publicUrl: resolveConfiguredPairingPublicUrl(config) ?? resolveGatewayPublicOrigin(config),
			bootstrapProfile: CLOUD_WORKER_PAIRING_SETUP_BOOTSTRAP_PROFILE,
			issuedBootstrap: issued,
			runCommandWithTimeout: async (argv, runOptions) => await runCommandWithTimeout(argv, { timeoutMs: runOptions.timeoutMs })
		});
		signal.throwIfAborted();
		if (!resolved.ok) throw new Error(resolved.error);
		if (resolved.setupId !== current.nodeSetupId) throw new Error("Worker node enrollment setup identity changed during preparation");
		return {
			mode: "connect",
			setupCode: encodePairingSetupCode(resolved.payload),
			setupId: current.nodeSetupId,
			openclawVersion: VERSION,
			packageSpecs,
			displayName,
			signal,
			waitForDeviceId: wait
		};
	};
	const retire = async (record) => {
		const deviceId = record.nodeDeviceId;
		if (!deviceId) return;
		const sharedOwner = options.store.listForReconcile().find((candidate) => candidate.environmentId !== record.environmentId && candidate.nodeDeviceId === deviceId);
		if (sharedOwner) throw new Error(`Worker node ${deviceId} is still owned by environment ${sharedOwner.environmentId}`);
		await removePairedDeviceRole({
			deviceId,
			role: "node"
		});
	};
	return {
		begin,
		retire,
		stop: () => controller.abort()
	};
}
//#endregion
//#region src/gateway/server-worker-environment-startup.ts
const loadWorkerEnvironmentRuntimeModule = createLazyRuntimeModule(() => import("./gateway/worker-environments/runtime.js"));
const loadWorkerInferenceRuntimeModule = createLazyRuntimeModule(() => import("./inference-runtime-DY7TsNQ8.js"));
async function loadGatewayWorkerEnvironmentStartupState() {
	const [{ createWorkerEnvironmentStore }, { createWorkerSessionPlacementStore }] = await Promise.all([import("./store-DJV5upKD.js"), import("./placement-store-CfbK0j1p.js")]);
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
	const [{ createWorkerEnvironmentService }, { createWorkerLiveEventReceiver }, { createWorkerSessionPlacementGate }, { createWorkerTranscriptCommitter }, { createWorkerTunnelManager }, { createNodeWorkerTunnelManager }, { createGatewayNodeWorkerBundleInstaller }, { createNodeWorkerBundleTransferService }, { createNodeWorkerBundleTransferHttpCallback }, { createNodeWorkspaceTransferService }, { createNodeWorkspaceTransferHttpCallback }, { createWorkerSessionToolExecutor }, { createWorkerNodeDesktopCarrier }, { createWorkerNodePortalCarrier }, { resolveWorkerProvider }] = await Promise.all([
		import("./service-COtVjIZ_.js"),
		import("./live-events-DUxUB6ZE.js"),
		import("./placement-worker-gate-C0EQiOmN.js"),
		import("./transcript-commit-DaoATXIl.js"),
		import("./tunnel-BomyJVph.js"),
		import("./node-worker-tunnel-CTC2AY3D.js"),
		import("./node-worker-bundle-installer-CKCd5Z6E.js"),
		import("./node-worker-bundle-transfer-service-BTL4q0mO.js"),
		import("./node-worker-bundle-transfer-http-CMyr_DGK.js"),
		import("./node-workspace-transfer-service-EKg-Sc5I.js"),
		import("./node-workspace-transfer-http-DtIwHhQN.js"),
		import("./worker-session-tool-executor-CBT3eWQB.js"),
		import("./node-desktop-carrier-xNP41mMs.js"),
		import("./portal-node-carrier-zG1p09iB.js"),
		import("./worker-provider-registry-C2tfiF8A.js")
	]);
	params.startup.placementStore.recoverWorkerSessionToolOperationsAfterRestart();
	params.startup.placementStore.clearLocalTurnClaimsAfterRestart();
	const placementGate = createWorkerSessionPlacementGate(params.startup.placementStore, { rejectExistingWorkerClaims: true });
	const workerEnvironmentLog = params.log.child("worker-environments");
	const listRetainedBundleHashes = () => listRetainedWorkerBundleHashes({
		environments: params.startup.store.list(),
		placements: params.startup.placementStore.list()
	});
	let workerBundleProducer;
	let workerNpmArtifact;
	const prepareInstallation = async (install) => {
		const [workerRuntime, { WORKER_PROTOCOL_FEATURES }] = await Promise.all([loadWorkerEnvironmentRuntimeModule(), import("./worker-admission-CJyzM-43.js")]);
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
	const notifyPortalChange = () => {
		const runtime = params.getPortalRuntime();
		const service = runtime?.portalService;
		if (!service) return;
		runtime.broadcast("portal.changed", { portals: service.list().map(({ tokenQuery: _tokenQuery, url: _url, ...portal }) => portal) }, { dropIfSlow: true });
	};
	const workerNodeDesktopStreamBroker = params.nodeDesktopStreamBroker;
	const workerNodePortalCarrier = createWorkerNodePortalCarrier({ store: params.startup.store });
	const workerNodeDesktopCarrier = workerNodeDesktopStreamBroker ? createWorkerNodeDesktopCarrier({
		store: params.startup.store,
		desktopRegistry: params.desktopSessionRegistry
	}) : void 0;
	const nodeWorkerBundleTransfer = createNodeWorkerBundleTransferService();
	const nodeWorkspaceTransfer = createNodeWorkspaceTransferService({ getOwner: (environmentId) => params.startup.store.getTransferOwner(environmentId) });
	await nodeWorkspaceTransfer.initialize();
	const gatewayDeviceId = loadOrCreateProcessDeviceIdentity().deviceId;
	const nodeWorkerGatewayNamespace$1 = nodeWorkerGatewayNamespace(gatewayDeviceId);
	const nodeWorkerTunnelManager = createNodeWorkerTunnelManager({
		gatewayDeviceId,
		getEnvironment: (environmentId) => params.startup.store.get(environmentId),
		listEnvironments: () => params.startup.store.list(),
		getTransport: () => deviceRuntime.getNodeTransport(),
		launchNodeWorker: async (request) => await deviceRuntime.launchNodeWorker(request),
		validateWorkerTurn: (binding) => placementGate.validateWorkerTurn(binding),
		workspaceTransfer: nodeWorkspaceTransfer
	});
	const ensureNodeWorkerBundle = createGatewayNodeWorkerBundleInstaller({
		gatewayNamespace: nodeWorkerGatewayNamespace$1,
		getTransport: () => deviceRuntime.getNodeTransport(),
		prepareBundle: async () => {
			const artifact = await prepareInstallation("bundle");
			if (artifact.install !== "bundle") throw new Error("Worker bundle preparation returned the wrong install channel");
			return artifact;
		},
		transfer: nodeWorkerBundleTransfer
	});
	const nodeEnrollment = createWorkerNodeEnrollmentManager({
		store: params.startup.store,
		getConfig: getRuntimeConfig,
		resolveAvailability: deviceRuntime.resolveAvailability
	});
	let executeSessionTool = async () => {
		throw new Error("Worker session tools are unavailable");
	};
	let dispatchChild = async () => {
		throw new Error("Worker session dispatch is unavailable");
	};
	let githubPublication = { requestForClaim: async () => {
		throw new Error("GitHub publication is unavailable");
	} };
	const workerEnvironmentService = createWorkerEnvironmentService({
		store: params.startup.store,
		getConfig: getRuntimeConfig,
		resolveProvider: (providerId) => providerId === "device" ? deviceRuntime.provider : resolveWorkerProvider(params.getPluginRegistry(), providerId),
		prepareInstallation,
		ensureNodeWorkerBundle: async (deviceId) => await ensureNodeWorkerBundle({ deviceId }),
		prepareNodeEnrollment: nodeEnrollment.begin,
		retireNodeEnrollment: nodeEnrollment.retire,
		stopNodeEnrollmentWaits: nodeEnrollment.stop,
		tunnelManager: workerTunnelManager,
		nodeTunnelManager: nodeWorkerTunnelManager,
		nodeDesktopCarrier: workerNodeDesktopCarrier,
		nodePortalCarrier: workerNodePortalCarrier,
		closeWorkerPortals: async (environmentId, ownerEpoch) => {
			const service = params.getPortalRuntime()?.portalService;
			if (!service) return;
			await service.closeWorkerPortals(environmentId, ownerEpoch);
			notifyPortalChange();
		},
		stopNodeWorkerBundleTransfers: () => nodeWorkerBundleTransfer.closeAll(),
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
	bindDeviceWorkerAvailability(workerEnvironmentService, deviceRuntime.resolveAvailability);
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
		resolveGatewayContext: params.resolveGatewayContext,
		placements: params.startup.placementStore,
		environments: workerEnvironmentService,
		dispatchChild: (request) => dispatchChild(request),
		githubPublication: { requestForClaim: (request) => githubPublication.requestForClaim(request) },
		portals: {
			getService: () => params.getPortalRuntime()?.portalService,
			carrier: workerNodePortalCarrier,
			onChanged: notifyPortalChange
		}
	});
	const bindWorkerNodeDesktopControl = workerNodeDesktopCarrier && workerNodeDesktopStreamBroker ? (transport) => workerNodeDesktopCarrier.bindRuntime({
		transport,
		streamBroker: workerNodeDesktopStreamBroker
	}) : void 0;
	return {
		workerEnvironmentService,
		workerLiveEvents,
		workerTunnelManager,
		nodeWorkerGatewayNamespace: nodeWorkerGatewayNamespace$1,
		bindWorkerSessionDispatch: (dispatch) => {
			dispatchChild = dispatch;
		},
		bindGitHubPublication: (coordinator) => {
			githubPublication = coordinator;
		},
		bindDeviceNodeControl: (transport) => {
			deviceRuntime.bindNodeTransport(transport);
			if (workerNodeDesktopStreamBroker) workerNodePortalCarrier.bindRuntime({
				transport,
				streamBroker: workerNodeDesktopStreamBroker
			});
		},
		...bindWorkerNodeDesktopControl ? { bindWorkerNodeDesktopControl } : {},
		bindNodeWorkspaceBindingResolver: (resolver) => nodeWorkerTunnelManager.bindWorkspaceBindingResolver(resolver),
		handleNodeWorkerBundleTransferRequest: createNodeWorkerBundleTransferHttpCallback(nodeWorkerBundleTransfer),
		handleNodeWorkspaceTransferRequest: createNodeWorkspaceTransferHttpCallback(nodeWorkspaceTransfer)
	};
}
//#endregion
export { createGatewayWorkerEnvironmentRuntime, loadGatewayWorkerEnvironmentStartupState };
