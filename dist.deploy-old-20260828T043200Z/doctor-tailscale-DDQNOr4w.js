import { _ as resolveGatewayPort } from "./paths-BBSTUjD5.js";
import { i as runUtf8CommandWithTimeout } from "./exec-D2kbpwdA.js";
import { t as inspectTailscaleServeGatewayUrlsWithRunner } from "./tailscale-status-CYn6ebpC.js";
//#region src/commands/doctor-tailscale.ts
function result(config, changes = [], warnings = []) {
	return {
		config,
		changes,
		warnings
	};
}
function isCanonicalServeUrl(raw) {
	try {
		const url = new URL(raw);
		return url.protocol === "wss:" && (url.port === "" || url.port === "443");
	} catch {
		return false;
	}
}
async function prepareTailscaleConfigMigration(params) {
	const config = params.cfg;
	const gateway = config.gateway;
	if (!gateway || gateway.mode === "remote" || gateway.bind !== "lan" || (gateway.tailscale?.mode ?? "off") !== "off") return result(config);
	const gatewayPort = resolveGatewayPort(config, params.env ?? process.env);
	const inspection = await inspectTailscaleServeGatewayUrlsWithRunner(gatewayPort, params.runCommandWithTimeout ?? ((argv, options) => runUtf8CommandWithTimeout(argv, {
		...options,
		maxOutputBytes: 4e5
	})));
	if (inspection.status === "unavailable") return result(config);
	if (inspection.status === "invalid") return result(config, [], ["Tailscale Serve status could not be parsed, so legacy Serve configuration was not changed. Review `tailscale serve status --json`, then rerun Doctor."]);
	if (inspection.urls.length === 0) return result(config);
	if (!(inspection.urls.length === 1 && isCanonicalServeUrl(inspection.urls[0] ?? "") && gateway.auth?.mode !== "none")) return result(config, [], [`Legacy Tailscale Serve still targets Gateway port ${gatewayPort}, but its custom endpoint, Service, or disabled authentication cannot be migrated safely; configuration was not changed. Remove that route or configure gateway.bind="loopback" and gateway.tailscale.mode="serve" manually.`]);
	const { preserveFunnel: _preserveFunnel, ...tailscale } = gateway.tailscale ?? {};
	return {
		config: {
			...config,
			gateway: {
				...gateway,
				bind: "loopback",
				tailscale: {
					...tailscale,
					mode: "serve"
				}
			}
		},
		changes: [`Migrated legacy Tailscale Serve on port ${gatewayPort} to managed Tailscale Serve ingress (gateway.bind="loopback", gateway.tailscale.mode="serve"); restart the Gateway to claim the route.`],
		warnings: []
	};
}
//#endregion
export { prepareTailscaleConfigMigration };
