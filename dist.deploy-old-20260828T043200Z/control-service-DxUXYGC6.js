import { n as getRuntimeConfig } from "./io-DlN5njvP.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { a as resolveProfile, r as resolveBrowserConfig } from "./config-HQZ6_yJ9.js";
import "./config-DCsvl-zC.js";
import { t as ensureBrowserControlAuth } from "./control-auth-_STA_Sab.js";
import "./bounded-utf8-tail-C3tCSEoX.js";
import { a as getExtensionRelayModule, o as loadBrowserConfigForRuntimeRefresh } from "./server-context-CWeEXVWZ.js";
import { a as withBrowserControlStart, i as stopBrowserControlRuntime, n as ensureBrowserControlRuntime, r as getBrowserControlState } from "./browser-control-state-BTWAc1BW.js";
import { t as isDefaultBrowserPluginEnabled } from "./plugin-enabled-wZ7NRxWS.js";
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
	const resolved = resolveBrowserConfig(browserCfg.browser, browserCfg);
	if (!resolved.enabled) return null;
	try {
		if ((await ensureBrowserControlAuth({ cfg })).generatedToken) logService.info("No browser auth configured; generated gateway.auth.token automatically.");
	} catch (err) {
		logService.warn(`failed to auto-configure browser auth: ${String(err)}`);
	}
	const hasExtensionProfiles = Object.values(resolved.profiles).some((profile) => profile.driver === "extension");
	if (hasExtensionProfiles) {
		const { ensureExtensionRelayToken } = await import("./relay-auth-DyAxLn6c.js");
		await ensureExtensionRelayToken();
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
		const { disposeGatewayExtensionRelay } = await import("./gateway-relay-route-FuUB1-XJ.js");
		disposeGatewayExtensionRelay();
	}
}
//#endregion
export { stopBrowserControlService as n, startBrowserControlServiceFromConfig as t };
