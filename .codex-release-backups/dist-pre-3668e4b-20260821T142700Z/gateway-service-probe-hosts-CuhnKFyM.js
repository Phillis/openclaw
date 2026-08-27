import { b as createConfigIO } from "./io-BTBpQ7uO.js";
import { t as isContainerEnvironment } from "./container-environment-CNsJSTpY.js";
import { n as pickPrimaryTailnetIPv4 } from "./tailnet-CZ5kuyGX.js";
import { _ as resolveGatewayRequiredListenHosts, t as defaultGatewayBindMode } from "./net-BRYQcUG8.js";
import { t as LOOPBACK_PORT_PROBE_HOSTS } from "./ports-probe-BqWAGNAk.js";
//#region src/daemon/service-env-merge.ts
function mergeGatewayServiceEnv(baseEnv, command) {
	if (!command?.environment) return baseEnv;
	const merged = {
		...baseEnv,
		...command.environment
	};
	for (const key of [
		"OPENCLAW_LAUNCHD_LABEL",
		"OPENCLAW_SYSTEMD_UNIT",
		"OPENCLAW_WINDOWS_TASK_NAME"
	]) {
		const value = baseEnv[key]?.trim();
		if (value) merged[key] = value;
	}
	return merged;
}
//#endregion
//#region src/daemon/gateway-service-probe-hosts.ts
async function resolveGatewayServiceProbeHosts(params) {
	const cfg = await createConfigIO({
		env: mergeGatewayServiceEnv(params.env ?? process.env, params.command ?? null),
		pluginValidation: "skip",
		suppressFutureVersionWarning: true
	}).readBestEffortConfig().catch(() => ({}));
	const bindMode = cfg.gateway?.bind ?? defaultGatewayBindMode(cfg.gateway?.tailscale?.mode ?? "off");
	return resolveGatewayRequiredListenHosts(bindMode === "lan" ? "0.0.0.0" : bindMode === "custom" ? cfg.gateway?.customBindHost?.trim() || "0.0.0.0" : bindMode === "tailnet" ? pickPrimaryTailnetIPv4() ?? LOOPBACK_PORT_PROBE_HOSTS[0] : bindMode === "auto" && isContainerEnvironment() ? "0.0.0.0" : LOOPBACK_PORT_PROBE_HOSTS[0]);
}
//#endregion
export { mergeGatewayServiceEnv as n, resolveGatewayServiceProbeHosts as t };
