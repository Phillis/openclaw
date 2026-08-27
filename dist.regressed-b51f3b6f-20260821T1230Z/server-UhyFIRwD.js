import { t as truncateCloseReason } from "./close-reason-D2Hhty2p.js";
//#region src/gateway/server.ts
async function emitStartupTrace(name, durationMs, totalMs) {
	if (!process.env.OPENCLAW_GATEWAY_STARTUP_TRACE) return;
	const { formatConsoleDiagnosticLine } = await import("./json-console-line-C2I0NKji.js");
	const message = `[gateway] startup trace: ${name} ${durationMs.toFixed(1)}ms total=${totalMs.toFixed(1)}ms`;
	process.stderr.write(`${formatConsoleDiagnosticLine({
		level: "info",
		message
	})}\n`);
}
async function loadServerStart() {
	const startupStartedAt = performance.now();
	const before = performance.now();
	try {
		return await import("./server-start-D1b7gmoM.js");
	} finally {
		const now = performance.now();
		await emitStartupTrace("gateway.server-start-import", now - before, now - startupStartedAt);
	}
}
/** Starts the gateway server after lazily loading the full server implementation. */
async function startGatewayServer(...args) {
	return await (await loadServerStart()).startGatewayServerCore(...args);
}
/** Clears prepared model-catalog generations between tests. */
async function resetPreparedModelCatalogForTest() {
	await (await loadServerStart()).resetPreparedModelCatalogForTestCore();
}
//#endregion
export { resetPreparedModelCatalogForTest, startGatewayServer, truncateCloseReason };
