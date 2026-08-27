import { r as getRuntimeConfig } from "./io-BTBpQ7uO.js";
import { t as createSubsystemLogger } from "./subsystem-DNgaGOch.js";
import { a as resolveProfile, r as resolveBrowserConfig } from "./config-C1vMek6l.js";
import "./config-nmkodlr_.js";
import { t as ensureBrowserControlAuth } from "./control-auth-2FlbLpRg.js";
import "./bounded-utf8-tail-DMAS0CSr.js";
import { a as getExtensionRelayModule, o as loadBrowserConfigForRuntimeRefresh } from "./server-context-jMH62Sba.js";
import { a as withBrowserControlStart, i as stopBrowserControlRuntime, n as ensureBrowserControlRuntime, r as getBrowserControlState } from "./browser-control-state-D6OadZx6.js";
import { t as isDefaultBrowserPluginEnabled } from "./plugin-enabled-DEjCKPey.js";
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
		const { ensureExtensionRelayToken } = await import("./relay-auth-C3k3tWbF.js");
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
		const { disposeGatewayExtensionRelay } = await import("./gateway-relay-route-gC6U1WnW.js");
		disposeGatewayExtensionRelay();
	}
}
//#endregion
export { stopBrowserControlService as n, startBrowserControlServiceFromConfig as t };
