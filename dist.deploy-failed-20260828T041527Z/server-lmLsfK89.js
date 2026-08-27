import { n as getRuntimeConfig } from "./io-ClLVsBMp.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { r as resolveBrowserConfig } from "./config-CSL9j7n3.js";
import "./config-ClwjlHgx.js";
import { n as resolveBrowserControlAuth, r as shouldAutoGenerateBrowserAuth, t as ensureBrowserControlAuth } from "./control-auth-CjCZORq5.js";
import "./bounded-utf8-tail-BrxoLTbp.js";
import { o as loadBrowserConfigForRuntimeRefresh } from "./server-context-ZddMXBGO.js";
import { E as setBridgeAuthForPort, T as deleteBridgeAuthForPort } from "./session-tab-registry-B04yZSN3.js";
import { t as registerBrowserRoutes } from "./routes-CjC7EQeT.js";
import { i as listenBrowserHttpServer, n as installBrowserAuthMiddleware, r as installBrowserCommonMiddleware } from "./server-middleware-1rk9HeEQ.js";
import { a as withBrowserControlStart, i as stopBrowserControlRuntime, n as ensureBrowserControlRuntime, r as getBrowserControlState, t as createBrowserControlContext } from "./browser-control-state-DP3NUAZ5.js";
import { t as isDefaultBrowserPluginEnabled } from "./plugin-enabled-DNxrWtWr.js";
import express from "express";
//#region extensions/browser/src/server.ts
/**
* Browser control HTTP server startup and shutdown entrypoints.
*/
const logServer = createSubsystemLogger("browser").child("server");
async function startBrowserControlServerUnlocked() {
	const current = getBrowserControlState();
	if (current?.server) return current;
	const cfg = getRuntimeConfig();
	const browserCfg = loadBrowserConfigForRuntimeRefresh();
	if (!isDefaultBrowserPluginEnabled(browserCfg)) return null;
	const resolved = resolveBrowserConfig(browserCfg.browser, browserCfg);
	if (!resolved.enabled) return null;
	let browserAuth = resolveBrowserControlAuth(cfg);
	let browserAuthBootstrapFailed = false;
	try {
		const ensured = await ensureBrowserControlAuth({ cfg });
		browserAuth = ensured.auth;
		if (ensured.generatedToken) logServer.info("No browser auth configured; generated browser control auth credential automatically.");
	} catch (err) {
		logServer.warn(`failed to auto-configure browser auth: ${String(err)}`);
		browserAuthBootstrapFailed = true;
	}
	if ((browserAuthBootstrapFailed || shouldAutoGenerateBrowserAuth(process.env)) && !browserAuth.token && !browserAuth.password) {
		if (browserAuthBootstrapFailed) logServer.error("browser control startup aborted: authentication bootstrap failed and no fallback auth is configured.");
		else logServer.error("browser control startup aborted: no authentication configured.");
		return null;
	}
	const app = express();
	installBrowserCommonMiddleware(app);
	installBrowserAuthMiddleware(app, browserAuth);
	registerBrowserRoutes(app, createBrowserControlContext());
	const port = resolved.controlPort;
	const server = await listenBrowserHttpServer(app, port, "127.0.0.1").catch((err) => {
		logServer.error(`openclaw browser server failed to bind 127.0.0.1:${port}: ${String(err)}`);
		return null;
	});
	if (!server) return null;
	let state;
	try {
		state = await ensureBrowserControlRuntime({
			server,
			port,
			resolved,
			owner: "server",
			onWarn: (message) => logServer.warn(message)
		});
	} catch (err) {
		await new Promise((resolve) => {
			server.close(() => resolve());
		});
		throw err;
	}
	setBridgeAuthForPort(port, browserAuth);
	const authMode = browserAuth.token ? "token" : browserAuth.password ? "password" : "off";
	logServer.info(`Browser control listening on http://127.0.0.1:${port}/ (auth=${authMode})`);
	return state;
}
/** Starts the Browser control HTTP server from runtime config. */
async function startBrowserControlServerFromConfig() {
	return await withBrowserControlStart(startBrowserControlServerUnlocked);
}
/** Stops the Browser control HTTP server and unregisters bridge auth. */
async function stopBrowserControlServer() {
	const stopped = await stopBrowserControlRuntime({
		requestedBy: "server",
		closeServer: true,
		onWarn: (message) => logServer.warn(message)
	});
	if (stopped?.port) deleteBridgeAuthForPort(stopped.port);
}
//#endregion
export { startBrowserControlServerFromConfig, stopBrowserControlServer };
