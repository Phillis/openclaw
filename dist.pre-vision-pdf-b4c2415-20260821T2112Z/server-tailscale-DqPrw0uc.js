import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { c as hasTailscaleFunnelRouteForPort, i as enableTailscaleServe, n as disableTailscaleServe, o as getTailnetHostname, r as enableTailscaleFunnel, s as getTailnetHostnameAfterServe, t as disableTailscaleFunnel } from "./tailscale-BTNUtOR0.js";
import { n as resolveTailscalePublishedHost } from "./tailscale-status-C8p6ZWI6.js";
import { n as prepareMcpAppChannelOrigin } from "./mcp-app-channel-origin-CN4qXU72.js";
//#region src/gateway/server-tailscale.ts
async function startGatewayTailscaleExposure(params) {
	if (params.tailscaleMode === "off") return null;
	const serviceName = params.tailscaleMode === "serve" ? params.serviceName?.trim() || void 0 : void 0;
	let effectiveMode = params.tailscaleMode;
	let preservedFunnel = false;
	let clearPublishedOrigin;
	try {
		if (params.tailscaleMode === "serve") {
			if (params.preserveFunnel === true) {
				if (await hasTailscaleFunnelRouteForPort(params.port)) {
					effectiveMode = "funnel";
					preservedFunnel = true;
					const resetSuffix = params.resetOnExit ? "; resetOnExit is a no-op because no Serve route was applied this run" : "";
					params.logTailscale.info(`serve skipped: preserving externally configured Tailscale Funnel for port ${params.port}${resetSuffix}`);
				}
			}
			if (!preservedFunnel) if (serviceName) await enableTailscaleServe(params.port, void 0, serviceName);
			else await enableTailscaleServe(params.port);
		} else await enableTailscaleFunnel(params.port);
		const host = await (params.tailscaleMode === "serve" && !preservedFunnel ? getTailnetHostnameAfterServe() : getTailnetHostname()).catch(() => null);
		if (host) {
			const uiPath = params.controlUiBasePath ? `${params.controlUiBasePath}/` : "/";
			const publicHost = resolveTailscalePublishedHost({
				tailscaleMode: effectiveMode,
				tailnetHost: host,
				serviceName: effectiveMode === "serve" ? serviceName : void 0
			});
			if (publicHost) {
				clearPublishedOrigin = prepareMcpAppChannelOrigin({
					origin: `https://${publicHost}`,
					reachability: effectiveMode === "funnel" ? "internet" : "tailnet"
				});
				if (!preservedFunnel) {
					const serviceLabel = serviceName ? ` for ${serviceName}` : "";
					params.logTailscale.info(`${params.tailscaleMode} enabled${serviceLabel}: https://${publicHost}${uiPath} (WS via wss://${publicHost})`);
				}
			} else if (!preservedFunnel) params.logTailscale.info(`${params.tailscaleMode} enabled`);
		} else if (!preservedFunnel) params.logTailscale.info(`${params.tailscaleMode} enabled`);
	} catch (err) {
		params.logTailscale.warn(`${params.tailscaleMode} failed: ${formatErrorMessage(err)}`);
	}
	if (!params.resetOnExit && !clearPublishedOrigin) return null;
	return async () => {
		clearPublishedOrigin?.();
		if (!params.resetOnExit || preservedFunnel) return;
		try {
			if (params.tailscaleMode === "serve") if (serviceName) await disableTailscaleServe(void 0, serviceName);
			else await disableTailscaleServe();
			else await disableTailscaleFunnel();
		} catch (err) {
			params.logTailscale.warn(`${params.tailscaleMode} cleanup failed: ${formatErrorMessage(err)}`);
		}
	};
}
//#endregion
export { startGatewayTailscaleExposure };
