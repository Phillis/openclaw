import { r as getRuntimeConfig } from "./io-CeQckj5v.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { r as resolveBrowserConfig } from "./config-UUh1etbS.js";
import "./config-B8NE56GF.js";
import { n as resolveBrowserControlAuth, r as shouldAutoGenerateBrowserAuth, t as ensureBrowserControlAuth } from "./control-auth-BPAeQxJp.js";
import "./bounded-utf8-tail-0BX-1sOF.js";
import { o as loadBrowserConfigForRuntimeRefresh } from "./server-context-C2rqVjpc.js";
import { T as setBridgeAuthForPort, w as deleteBridgeAuthForPort } from "./session-tab-registry-BHFmz3Y-.js";
import { t as registerBrowserRoutes } from "./routes-qhnSVLah.js";
import { i as listenBrowserHttpServer, n as installBrowserAuthMiddleware, r as installBrowserCommonMiddleware } from "./server-middleware-sbXKOBe5.js";
import { a as withBrowserControlStart, i as stopBrowserControlRuntime, n as ensureBrowserControlRuntime, r as getBrowserControlState, t as createBrowserControlContext } from "./browser-control-state-C6fSVOZ3.js";
import { t as isDefaultBrowserPluginEnabled } from "./plugin-enabled-oHAbBSF0.js";
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
