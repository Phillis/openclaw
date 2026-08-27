import { r as defaultRuntime } from "./runtime-LRpY2Icg.js";
import { n as getRuntimeConfig } from "./io-ClLVsBMp.js";
import { a as transformConfigFileWithRetry } from "./mutate-BjBakg7Z.js";
import "./config-B_0xOnKq.js";
import { n as runCommandWithRuntime } from "./cli-utils-DKdcuZ9M.js";
import { i as resolveTelemetryStatus, n as buildTelemetryUserAgent, t as buildTelemetryPayload } from "./telemetry-DxQUXMlP.js";
//#region src/cli/telemetry-cli.ts
const TELEMETRY_REASON_LABELS = {
	enabled: "enabled in configuration",
	"automated-environment": "disabled in an automated environment (CI is set)",
	"do-not-track": "disabled by DO_NOT_TRACK",
	"config-disabled": "disabled in configuration",
	"never-asked": "consent has not been requested",
	"update-disabled": "update checks are disabled"
};
async function showTelemetry(options) {
	const config = getRuntimeConfig({ skipPluginValidation: true });
	const telemetry = resolveTelemetryStatus(config);
	const userAgent = buildTelemetryUserAgent("gateway");
	const requestSent = telemetry.reason !== "update-disabled";
	const payload = telemetry.enabled ? buildTelemetryPayload(config, { surface: "gateway" }) : void 0;
	if (options.json) {
		defaultRuntime.writeJson({
			featureStatsEnabled: telemetry.enabled,
			reason: telemetry.reason,
			endpoint: telemetry.endpoint,
			lastPingAt: telemetry.lastPingAt ? new Date(telemetry.lastPingAt).toISOString() : null,
			request: requestSent ? {
				method: telemetry.enabled ? "POST" : "GET",
				userAgent,
				...payload ? { payload } : {}
			} : null
		}, 0);
		return;
	}
	defaultRuntime.log(`Feature stats: ${telemetry.enabled ? "enabled" : "disabled"}`);
	defaultRuntime.log(`Reason: ${TELEMETRY_REASON_LABELS[telemetry.reason]}`);
	defaultRuntime.log(`Endpoint: ${telemetry.endpoint}`);
	defaultRuntime.log(`Last ping: ${telemetry.lastPingAt ? new Date(telemetry.lastPingAt).toISOString() : "never"}`);
	if (telemetry.reason === "update-disabled") {
		defaultRuntime.log("Request: none (update checks are disabled)");
		return;
	}
	defaultRuntime.log(`Request: ${telemetry.enabled ? "POST" : "GET"} ${telemetry.endpoint}`);
	defaultRuntime.log(`User-Agent: ${userAgent}`);
	if (payload) {
		defaultRuntime.log("Payload:");
		defaultRuntime.log(JSON.stringify(payload));
	}
}
async function setTelemetryEnabled(enabled) {
	await transformConfigFileWithRetry({ transform: (config) => ({ nextConfig: {
		...config,
		telemetry: {
			...config.telemetry,
			enabled,
			consentedAt: (/* @__PURE__ */ new Date()).toISOString()
		}
	} }) });
	defaultRuntime.log(`Anonymous feature stats ${enabled ? "enabled" : "disabled"}.`);
}
function registerTelemetryCli(program) {
	const telemetry = program.command("telemetry").description("Inspect and manage anonymous usage telemetry");
	telemetry.command("show").description("Show exactly what the daily update request sends").option("--json", "Print the request and payload as JSON").action(async (options) => runCommandWithRuntime(defaultRuntime, () => showTelemetry(options)));
	telemetry.command("on").description("Enable anonymous feature statistics").action(async () => runCommandWithRuntime(defaultRuntime, () => setTelemetryEnabled(true)));
	telemetry.command("off").description("Disable anonymous feature statistics").action(async () => runCommandWithRuntime(defaultRuntime, () => setTelemetryEnabled(false)));
}
//#endregion
export { registerTelemetryCli };
