import { r as formatErrorMessage } from "./errors-CqPTYU6G.js";
import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import { n as sanitizeTerminalText } from "./safe-text-CpAuEO38.js";
import { n as VERSION } from "./version-o4XN9fka.js";
import { n as isGatewaySecretRefUnavailableError } from "./credentials-BCdWdXTF.js";
import { a as buildGatewayConnectionDetails, o as buildGatewayProbeConnectionDetails, p as isGatewayCredentialsRequiredError, s as callGateway } from "./call-CZ1eu88h.js";
import { f as redactSecretDegradationReason } from "./runtime-degraded-state-DqIBoQI-.js";
import { t as note } from "./note-C_xoKlB9.js";
import { t as probeGatewayStatus } from "./probe-Cju08OMc.js";
import { t as collectChannelStatusIssues } from "./channels-status-issues-BududTG3.js";
import { r as formatHealthCheckFailure, t as formatGatewayClosedDiagnostic } from "./health-format-74V9mwr2.js";
import { c as gatewayConnectErrorWasRateLimited, i as GATEWAY_HEALTH_RATE_LIMITED_TITLE, l as gatewayProbeResultSawGateway, n as GATEWAY_HEALTH_CREDENTIALS_REQUIRED_TITLE, r as GATEWAY_HEALTH_RATE_LIMITED_MESSAGE, t as GATEWAY_HEALTH_CREDENTIALS_REQUIRED_MESSAGE, u as gatewayProbeResultWasRateLimited } from "./gateway-health-auth-diagnostic-BO2Wc3Dv.js";
import { t as formatTelemetryExporterSummary } from "./telemetry-exporter-summary-BzbrNr8-.js";
//#region src/commands/doctor-gateway-health.ts
/** Gateway health probes used by doctor before deeper daemon and memory diagnostics. */
function isGatewayCallTimeout(message) {
	return /^gateway timeout after \d+ms(?:\n|$)/.test(message);
}
function isGatewayHealthAuthUnavailableError(error) {
	return isGatewayCredentialsRequiredError(error) || isGatewaySecretRefUnavailableError(error);
}
function noteCliGatewayVersionSkew(status) {
	const gatewayVersion = status?.runtimeVersion?.trim();
	if (!gatewayVersion || gatewayVersion === VERSION) return;
	note([
		`This command is OpenClaw ${VERSION}; the running Gateway is OpenClaw ${gatewayVersion}.`,
		"Check `openclaw --version`, `which openclaw`, and `openclaw gateway status --deep`.",
		"If this mismatch is unexpected, update PATH so `openclaw` points to the version you want, or reinstall the Gateway service from that same OpenClaw install."
	].join("\n"), "OpenClaw version mismatch");
}
/**
* Probes gateway status and reports user-facing connection/auth/channel warnings.
*
* A credentials-required gateway still counts as healthy but unauthenticated when the preauth
* probe confirms the server is reachable.
*/
async function checkGatewayHealth(params) {
	const timeoutMs = typeof params.timeoutMs === "number" && params.timeoutMs > 0 ? params.timeoutMs : 1e4;
	let healthOk = false;
	let status;
	try {
		status = await callGateway({
			method: "status",
			params: { includeChannelSummary: false },
			timeoutMs,
			config: params.cfg
		});
		healthOk = true;
		noteCliGatewayVersionSkew(status);
		if (status.degradedSecretOwners && status.degradedSecretOwners.length > 0) note(status.degradedSecretOwners.map((owner) => `- ${owner.degradationState ?? "cold"} ${owner.ownerKind}:${owner.ownerId} (${owner.paths.join(", ")}): ${redactSecretDegradationReason(owner.reason)}
  Retry: openclaw secrets reload`).join("\n"), "Secret runtime degradation");
		if (status.degradedPlugins && status.degradedPlugins.length > 0) note(status.degradedPlugins.map((plugin) => `- ${plugin.pluginId} (${plugin.diagnostic.reason}): ${plugin.diagnostic.detail}`).join("\n"), "Plugins configured unavailable");
		const [channelsResult, exporterResult] = await Promise.allSettled([callGateway({
			method: "channels.status",
			params: {
				probe: true,
				timeoutMs: 5e3
			},
			timeoutMs: 6e3,
			config: params.cfg
		}), callGateway({
			method: "diagnostics.stability",
			params: {
				type: "telemetry.exporter",
				limit: 1e3
			},
			timeoutMs: Math.min(timeoutMs, 6e3),
			config: params.cfg
		})]);
		if (channelsResult.status === "fulfilled") {
			const issues = collectChannelStatusIssues(channelsResult.value);
			if (issues.length > 0) note(issues.map((issue) => `- ${issue.channel} ${issue.accountId}: ${issue.message}${issue.fix ? ` (${issue.fix})` : ""}`).join("\n"), "Channel warnings");
		} else note([`Channel status probe failed: ${sanitizeTerminalText(formatErrorMessage(channelsResult.reason))}`, `Retry: ${formatCliCommand("openclaw channels status --probe")}`].join("\n"), "Channel warnings");
		if (exporterResult.status === "fulfilled") {
			const exporterSummary = formatTelemetryExporterSummary(exporterResult.value);
			if (exporterSummary) note(exporterSummary.lines.join("\n"), exporterSummary.title);
		}
		return {
			healthOk,
			authenticated: true,
			status
		};
	} catch (err) {
		if (gatewayConnectErrorWasRateLimited(err)) {
			note(GATEWAY_HEALTH_RATE_LIMITED_MESSAGE, GATEWAY_HEALTH_RATE_LIMITED_TITLE);
			return {
				healthOk: true,
				authenticated: false
			};
		}
		if (isGatewayHealthAuthUnavailableError(err)) {
			const probeDetails = await buildGatewayProbeConnectionDetails({ config: params.cfg });
			const probe = await probeGatewayStatus({
				url: probeDetails.url,
				timeoutMs,
				tlsFingerprint: probeDetails.tlsFingerprint,
				preauthHandshakeTimeoutMs: probeDetails.preauthHandshakeTimeoutMs,
				config: params.cfg,
				json: true
			});
			if (gatewayProbeResultSawGateway(probe)) {
				if (gatewayProbeResultWasRateLimited(probe)) note(GATEWAY_HEALTH_RATE_LIMITED_MESSAGE, GATEWAY_HEALTH_RATE_LIMITED_TITLE);
				else note(GATEWAY_HEALTH_CREDENTIALS_REQUIRED_MESSAGE, GATEWAY_HEALTH_CREDENTIALS_REQUIRED_TITLE);
				healthOk = true;
				return {
					healthOk,
					authenticated: false
				};
			}
		}
		if (String(err).includes("gateway closed")) {
			const gatewayDetails = buildGatewayConnectionDetails({ config: params.cfg });
			const closedDiagnostic = formatGatewayClosedDiagnostic(err);
			if (closedDiagnostic) note(closedDiagnostic, "Gateway");
			else note("Gateway not running.", "Gateway");
			note(gatewayDetails.message, "Gateway connection");
		} else params.runtime.error(formatHealthCheckFailure(err));
	}
	return {
		healthOk,
		authenticated: false,
		status
	};
}
/** Probes gateway memory readiness without forcing deep embedding checks. */
async function probeGatewayMemoryStatus(params) {
	const timeoutMs = typeof params.timeoutMs === "number" && params.timeoutMs > 0 ? params.timeoutMs : 8e3;
	try {
		const payload = await callGateway({
			method: "doctor.memory.status",
			params: { probe: false },
			timeoutMs,
			config: params.cfg
		});
		const gatewayChecked = payload.embedding.checked !== false;
		return {
			checked: gatewayChecked,
			ready: payload.embedding.ok,
			error: payload.embedding.error,
			...payload.embeddingRuntime ? { runtimeFacts: payload.embeddingRuntime } : {},
			skipped: !gatewayChecked
		};
	} catch (err) {
		const message = formatErrorMessage(err);
		if (isGatewayCallTimeout(message)) return {
			checked: false,
			ready: false,
			error: `gateway memory probe timed out: ${message}`,
			skipped: false
		};
		return {
			checked: true,
			ready: false,
			error: `gateway memory probe unavailable: ${message}`,
			skipped: false
		};
	}
}
//#endregion
export { checkGatewayHealth, probeGatewayMemoryStatus };
