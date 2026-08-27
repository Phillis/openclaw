import { n as measureStartup } from "./server-startup-trace-DA1KytiF.js";
//#region src/gateway/server-startup-early.ts
const loadRemoteSkillsRuntimeModule = async () => await import("./remote-CG3K8RoH.js");
/** Start plugin discovery and return the Bonjour shutdown callback when discovery is active. */
async function startGatewayPluginDiscovery(params) {
	if (params.minimalTestGateway) return null;
	const machineDisplayName = await measureStartup(params.startupTrace, "runtime.early.discovery.machine-name", async () => (await import("./machine-name-wmDWwxaL.js")).getMachineDisplayName());
	return await measureStartup(params.startupTrace, "runtime.early.discovery.start", async () => {
		const { startGatewayDiscovery } = await import("./server-discovery-runtime-CDsoisrs.js");
		return (await startGatewayDiscovery({
			machineDisplayName,
			port: params.port,
			gatewayTls: params.gatewayTls.enabled ? {
				enabled: true,
				fingerprintSha256: params.gatewayTls.fingerprintSha256
			} : void 0,
			gatewayDirectReachable: params.gatewayDirectReachable,
			wideAreaDiscoveryEnabled: Boolean(params.cfgAtStart.discovery?.wideArea?.domain?.trim()),
			wideAreaDiscoveryDomain: params.cfgAtStart.discovery?.wideArea?.domain,
			tailscaleMode: params.tailscaleMode,
			mdnsMode: params.cfgAtStart.discovery?.mdns?.mode,
			gatewayDiscoveryServices: params.pluginRegistry?.gatewayDiscoveryServices,
			logDiscovery: params.logDiscovery
		})).bonjourStop;
	});
}
/** Start early Gateway side runtimes before the main server is fully ready. */
async function startGatewayEarlyRuntime(params) {
	if (!params.minimalTestGateway) await measureStartup(params.startupTrace, "runtime.early.task-state", async () => {
		const { ensureTaskRuntimeStateReady } = await import("./runtime-internal-ChOBCB2W.js");
		ensureTaskRuntimeStateReady();
	});
	const bonjourStop = await measureStartup(params.startupTrace, "runtime.early.discovery", () => startGatewayPluginDiscovery(params));
	let getActiveTaskCount = () => 0;
	if (!params.minimalTestGateway) {
		const [{ primeRemoteSkillsCache, setSkillsRemoteRegistry }, taskRegistryMaintenance] = await measureStartup(params.startupTrace, "runtime.early.lazy-runtime-imports", () => Promise.all([loadRemoteSkillsRuntimeModule(), import("./task-registry.maintenance-CM1CScI3.js")]));
		setSkillsRemoteRegistry(params.nodeRegistry);
		primeRemoteSkillsCache();
		taskRegistryMaintenance.configureTaskRegistryMaintenance({ runtimeAuthoritative: true });
		taskRegistryMaintenance.startTaskRegistryMaintenance();
		getActiveTaskCount = () => taskRegistryMaintenance.getInspectableActiveTaskRestartBlockers().length;
	}
	const skillsChangeUnsub = params.minimalTestGateway ? () => {} : await measureStartup(params.startupTrace, "runtime.early.skills-listener", async () => {
		const [{ registerSkillsChangeListener }, { refreshRemoteBinsForConnectedNodes }] = await Promise.all([import("./refresh-o2q_UoSK.js"), loadRemoteSkillsRuntimeModule()]);
		return registerSkillsChangeListener((event) => {
			if (event.reason === "remote-node") {
				params.broadcast("skills.changed", { reason: event.reason });
				return;
			}
			const existingTimer = params.getSkillsRefreshTimer();
			if (existingTimer) clearTimeout(existingTimer);
			const nextTimer = setTimeout(() => {
				params.setSkillsRefreshTimer(null);
				refreshRemoteBinsForConnectedNodes(params.getRuntimeConfig()).then(() => {
					params.broadcast("skills.changed", { reason: event.reason });
				}, (error) => {
					params.log.warn(`failed to refresh remote bins after skills change: ${String(error)}`);
					params.broadcast("skills.changed", { reason: event.reason });
				});
			}, params.skillsRefreshDelayMs);
			params.setSkillsRefreshTimer(nextTimer);
		});
	});
	const startMaintenance = async () => {
		if (params.minimalTestGateway) return null;
		return await measureStartup(params.startupTrace, "post-ready.maintenance", async () => {
			const { startGatewayMaintenanceTimers } = await import("./server-maintenance-DG2Cl3Jw.js");
			return startGatewayMaintenanceTimers({
				broadcast: params.broadcast,
				nodeSendToAllSubscribed: params.nodeSendToAllSubscribed,
				getPresenceVersion: params.getPresenceVersion,
				getHealthVersion: params.getHealthVersion,
				refreshGatewayHealthSnapshot: params.refreshGatewayHealthSnapshot,
				restartRunningChannels: params.restartRunningChannels,
				refreshPresence: params.refreshPresence,
				resetEventLoopHealth: params.resetEventLoopHealth,
				logHealth: params.logHealth,
				dedupe: params.dedupe,
				chatAbortControllers: params.chatAbortControllers,
				chatQueuedTurns: params.chatQueuedTurns,
				restartRecoveryCandidates: params.restartRecoveryCandidates,
				chatRunState: params.chatRunState,
				removeChatRun: params.removeChatRun,
				agentRunSeq: params.agentRunSeq,
				nodeSendToSession: params.nodeSendToSession,
				getRuntimeConfig: params.getRuntimeConfig,
				enableSkillCurator: true,
				...typeof params.mediaCleanupTtlMs === "number" ? { mediaCleanupTtlMs: params.mediaCleanupTtlMs } : {}
			});
		});
	};
	return {
		bonjourStop,
		getActiveTaskCount,
		skillsChangeUnsub,
		startMaintenance
	};
}
//#endregion
export { startGatewayEarlyRuntime, startGatewayPluginDiscovery };
