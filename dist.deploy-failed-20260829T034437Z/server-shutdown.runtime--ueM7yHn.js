//#region src/gateway/server-shutdown.runtime.ts
async function prepareGatewayShutdownRuntime() {
	const [{ createGatewayCloseHandler, drainActiveSessionsForShutdown, runGatewayClosePrelude }, { runGlobalGatewayStopSafely }, { flushPendingSessionsChangedEvents }, { closeMcpLoopbackServer }, { stopTaskRegistryMaintenance }, { markRestartAbortedMainSessions }, { disposeAllBundleLspRuntimes }, { drainRetainedOpenAiEmbeddingProviders }, { stopGmailWatcher }, { disposeAllCodeModeRuns }, { closeProviderTransportDispatcherPool }, { clearActivePluginRegistry, prepareActivePluginRegistryShutdown }] = await Promise.all([
		import("./server-close.runtime.js"),
		import("./plugins/hook-runner-global.js"),
		import("./session-change-event-COHsmqyi.js"),
		import("./mcp-http-D6Wmh3N2.js"),
		import("./task-registry.maintenance-DKRDQDlA.js"),
		import("./main-session-restart-recovery-CnLuU0Z-.js"),
		import("./agent-bundle-lsp-runtime-DIqDIqaY.js"),
		import("./embeddings-http-CjuNrEiD.js"),
		import("./gmail-watcher-BktAKPyL.js"),
		import("./code-mode-state-C1pq1N39.js"),
		import("./provider-transport-dispatcher-pool-CFeenw-J.js"),
		import("./runtime-Bmbsnk9e.js")
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
