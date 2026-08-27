import { c as isNixMode } from "./paths-BBSTUjD5.js";
import { n as measureStartup } from "./server-startup-trace-Dgjmizj1.js";
//#region src/gateway/server-startup-early.ts
const loadRemoteSkillsRuntimeModule = async () => await import("./remote-BtWGGhYF.js");
/** Start plugin discovery and return the Bonjour shutdown callback when discovery is active. */
async function startGatewayPluginDiscovery(params) {
	if (params.minimalTestGateway) return null;
	const machineDisplayName = await measureStartup(params.startupTrace, "runtime.early.discovery.machine-name", async () => (await import("./machine-name-B0eeV-0K.js")).getMachineDisplayName());
	return await measureStartup(params.startupTrace, "runtime.early.discovery.start", async () => {
		const { startGatewayDiscovery } = await import("./server-discovery-runtime-DTXAwze1.js");
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
		const { ensureTaskRuntimeStateReady } = await import("./runtime-internal-B0HIr-i-.js");
		ensureTaskRuntimeStateReady();
	});
	params.swapBonjourStop(await measureStartup(params.startupTrace, "runtime.early.discovery", () => startGatewayPluginDiscovery(params)));
	let getActiveTaskCount = () => 0;
	if (!params.minimalTestGateway) {
		const [{ primeRemoteSkillsCache, setSkillsRemoteRegistry }, taskRegistryMaintenance] = await measureStartup(params.startupTrace, "runtime.early.lazy-runtime-imports", () => Promise.all([loadRemoteSkillsRuntimeModule(), import("./task-registry.maintenance-BT0rFWuh.js")]));
		setSkillsRemoteRegistry(params.nodeRegistry);
		primeRemoteSkillsCache();
		taskRegistryMaintenance.configureTaskRegistryMaintenance({ runtimeAuthoritative: true });
		taskRegistryMaintenance.startTaskRegistryMaintenance();
		getActiveTaskCount = () => taskRegistryMaintenance.getInspectableActiveTaskRestartBlockers().length;
	}
	const skillsChangeUnsub = params.minimalTestGateway ? async () => {} : await measureStartup(params.startupTrace, "runtime.early.skills-listener", async () => {
		const skillsRuntimePromise = import("./refresh-BXxnnXZs.js");
		const remoteSkillsRuntimePromise = loadRemoteSkillsRuntimeModule();
		const { closeSkillsWatchers, registerSkillsChangeListener } = await skillsRuntimePromise;
		const { refreshRemoteBinsForConnectedNodes } = await remoteSkillsRuntimePromise;
		const unregister = registerSkillsChangeListener((event) => {
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
		return async () => {
			unregister();
			await closeSkillsWatchers();
		};
	});
	const startMaintenance = async () => {
		if (params.minimalTestGateway) return null;
		return await measureStartup(params.startupTrace, "post-ready.maintenance", async () => {
			const { startGatewayMaintenanceTimers } = await import("./server-maintenance-DpnPSdQC.js");
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
				isNixMode,
				getRuntimeConfig: params.getRuntimeConfig,
				...typeof params.mediaCleanupTtlMs === "number" ? { mediaCleanupTtlMs: params.mediaCleanupTtlMs } : {}
			});
		});
	};
	return {
		getActiveTaskCount,
		skillsChangeUnsub,
		startMaintenance
	};
}
//#endregion
export { startGatewayEarlyRuntime, startGatewayPluginDiscovery };
