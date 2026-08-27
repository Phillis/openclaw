import { r as getRuntimeConfig } from "./io-CeQckj5v.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { a as resolveProfile, r as resolveBrowserConfig } from "./config-ChuJBdOZ.js";
import "./config-CV2XVi0r.js";
import { t as ensureBrowserControlAuth } from "./control-auth-BBJ8Ai-O.js";
import "./bounded-utf8-tail-0BX-1sOF.js";
import { a as getExtensionRelayModule, o as loadBrowserConfigForRuntimeRefresh } from "./server-context-DrhV4-XI.js";
import { a as withBrowserControlStart, i as stopBrowserControlRuntime, n as ensureBrowserControlRuntime, r as getBrowserControlState } from "./browser-control-state-CRclhuSW.js";
import { t as isDefaultBrowserPluginEnabled } from "./plugin-enabled-JKBEkHOS.js";
//#region extensions/browser/src/control-service.ts
/**
* Browser control service lifecycle for plugin-managed, in-process operation.
*/
const logService = createSubsystemLogger("browser").child("service");
async function startBrowserControlServiceUnlocked() {
	const current = getBrowserControlState();
	if (current) return current;
	const cfg = getRuntimeConfig();
	const browserCfg = loadBrowserConfigForRuntimeRefresh();
	if (!isDefaultBrowserPluginEnabled(browserCfg)) return null;
	let resolved = resolveBrowserConfig(browserCfg.browser, browserCfg);
	if (!resolved.enabled) return null;
	try {
		if ((await ensureBrowserControlAuth({ cfg })).generatedToken) logService.info("No browser auth configured; generated gateway.auth.token automatically.");
	} catch (err) {
		logService.warn(`failed to auto-configure browser auth: ${String(err)}`);
	}
	const hasExtensionProfiles = Object.values(resolved.profiles).some((profile) => profile.driver === "extension");
	if (hasExtensionProfiles) {
		const { ensureExtensionRelayToken } = await import("./relay-auth-D5zH-VS5.js");
		await ensureExtensionRelayToken();
		const refreshed = loadBrowserConfigForRuntimeRefresh();
		resolved = resolveBrowserConfig(refreshed.browser, refreshed);
	}
	const state = await ensureBrowserControlRuntime({
		server: null,
		port: resolved.controlPort,
		resolved,
		owner: "service",
		onWarn: (message) => logService.warn(message)
	});
	if (hasExtensionProfiles) {
		const { startConfiguredExtensionRelays } = await getExtensionRelayModule();
		await startConfiguredExtensionRelays(state, (name) => resolveProfile(resolved, name), (message) => logService.warn(message));
	}
	logService.info(`Browser control service ready (profiles=${Object.keys(resolved.profiles).length})`);
	return state;
}
/** Starts Browser control without binding the HTTP server when config enables it. */
async function startBrowserControlServiceFromConfig() {
	return await withBrowserControlStart(startBrowserControlServiceUnlocked);
}
/** Stops the in-process Browser control service runtime. */
async function stopBrowserControlService() {
	try {
		await stopBrowserControlRuntime({
			requestedBy: "service",
			onWarn: (message) => logService.warn(message)
		});
	} finally {
		const { disposeGatewayExtensionRelay } = await import("./gateway-relay-route-C6LIPFwQ.js");
		disposeGatewayExtensionRelay();
	}
}
//#endregion
export { stopBrowserControlService as n, startBrowserControlServiceFromConfig as t };
