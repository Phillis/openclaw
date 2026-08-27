import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { a as hasTailscaleFunnelRouteForPort, i as getTailnetHostnameAfterServe, r as getTailnetHostname, t as claimTailscaleRoute } from "./tailscale-wMoHhrdJ.js";
import { r as resolveTailscalePublishedHost } from "./tailscale-status-CYn6ebpC.js";
import { n as prepareMcpAppChannelOrigin } from "./mcp-app-channel-origin-CN4qXU72.js";
//#region src/gateway/server-tailscale.ts
async function startGatewayTailscaleExposure(params) {
	if (params.tailscaleMode === "off") return null;
	if (!params.backend) throw new Error("Managed Tailscale ingress failed to start");
	const backendTarget = params.backend.port;
	const effectiveMode = params.tailscaleMode;
	let clearPublishedOrigin;
	if (params.tailscaleMode === "serve" && params.preserveFunnel === true) {
		let preservedFunnel;
		try {
			preservedFunnel = await hasTailscaleFunnelRouteForPort(params.port);
		} catch (error) {
			params.logTailscale.warn(`serve not changed because external Funnel status could not be inspected: ${formatErrorMessage(error)}`);
			throw error;
		}
		if (preservedFunnel) {
			params.logTailscale.warn(`external Tailscale Funnel for port ${params.port} remains active only for plugin-authenticated webhook routes; Gateway-authenticated routes reject its unattributable ingress. First configure a durable gateway password (gateway.auth.password or OPENCLAW_GATEWAY_PASSWORD) and set gateway.auth.mode=password, then run \`openclaw config set gateway.tailscale.mode funnel\` and \`openclaw config unset gateway.tailscale.preserveFunnel\`; see https://docs.openclaw.ai/gateway/tailscale#public-internet-funnel--shared-password`);
			return null;
		}
	}
	let claim;
	try {
		claim = await claimTailscaleRoute(params.tailscaleMode, backendTarget);
		const host = await (params.tailscaleMode === "serve" ? getTailnetHostnameAfterServe() : getTailnetHostname()).catch(() => null);
		if (!claim.isActive()) throw new Error(`Managed Tailscale ${params.tailscaleMode} claim exited during startup`);
		if (host) {
			const uiPath = params.controlUiBasePath ? `${params.controlUiBasePath}/` : "/";
			const publicHost = resolveTailscalePublishedHost({
				tailscaleMode: effectiveMode,
				tailnetHost: host
			});
			if (publicHost) {
				clearPublishedOrigin = prepareMcpAppChannelOrigin({
					origin: `https://${publicHost}`,
					reachability: effectiveMode === "funnel" ? "internet" : "tailnet"
				});
				params.logTailscale.info(`${params.tailscaleMode} enabled: https://${publicHost}${uiPath} (WS via wss://${publicHost})`);
			} else params.logTailscale.info(`${params.tailscaleMode} enabled`);
		} else params.logTailscale.info(`${params.tailscaleMode} enabled`);
	} catch (err) {
		clearPublishedOrigin?.();
		await claim?.stop();
		params.logTailscale.warn(`${params.tailscaleMode} failed: ${formatErrorMessage(err)}`);
		throw err;
	}
	let stopping = false;
	claim.exited.then(() => {
		if (stopping) return;
		clearPublishedOrigin?.();
		params.logTailscale.warn(`${params.tailscaleMode} route claim exited; managed Tailscale ingress is unavailable until the Gateway restarts`);
	});
	return async () => {
		stopping = true;
		clearPublishedOrigin?.();
		await claim.stop();
	};
}
//#endregion
export { startGatewayTailscaleExposure };
