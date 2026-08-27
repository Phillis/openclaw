//#region src/gateway/server-shutdown.runtime.ts
async function prepareGatewayShutdownRuntime() {
	const [{ createGatewayCloseHandler, drainActiveSessionsForShutdown, runGatewayClosePrelude }, { runGlobalGatewayStopSafely }, { flushPendingSessionsChangedEvents }, { closeMcpLoopbackServer }, { stopTaskRegistryMaintenance }, { markRestartAbortedMainSessions }, { disposeAllBundleLspRuntimes }, { drainRetainedOpenAiEmbeddingProviders }, { stopGmailWatcher }, { disposeAllCodeModeRuns }, { closeProviderTransportDispatcherPool }, { clearActivePluginRegistry, prepareActivePluginRegistryShutdown }] = await Promise.all([
		import("./server-close.runtime.js"),
		import("./plugins/hook-runner-global.js"),
		import("./session-change-event-C0JmC1oR.js"),
		import("./mcp-http-DPJIi0Ok.js"),
		import("./task-registry.maintenance-C5QPxLol.js"),
		import("./main-session-restart-recovery-WvD0I0ZR.js"),
		import("./agent-bundle-lsp-runtime-UOQmyNzP.js"),
		import("./embeddings-http-UPM8qWUd.js"),
		import("./gmail-watcher-DBcFHlvH.js"),
		import("./code-mode-state-DKbPcQpl.js"),
		import("./provider-transport-dispatcher-pool-CFeenw-J.js"),
		import("./runtime-DRLPaapq.js")
	]);
	await prepareActivePluginRegistryShutdown();
	return {
		createGatewayCloseHandler,
		drainActiveSessionsForShutdown,
		runGatewayClosePrelude,
		runGlobalGatewayStopSafely,
		flushPendingSessionsChangedEvents,
		closeMcpLoopbackServer,
		stopTaskRegistryMaintenance,
		markRestartAbortedMainSessions,
		disposeAllBundleLspRuntimes,
		drainRetainedOpenAiEmbeddingProviders,
		stopGmailWatcher,
		disposeAllCodeModeRuns,
		closeProviderTransportDispatcherPool,
		clearActivePluginRegistry
	};
}
//#endregion
export { prepareGatewayShutdownRuntime };
