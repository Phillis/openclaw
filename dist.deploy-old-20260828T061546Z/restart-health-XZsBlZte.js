import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-BN1NZvXG.js";
import "./utils-Bw16L5tB.js";
import { t as sleep } from "./sleep-D7nua6TP.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { S as createConfigIO } from "./io-ClLVsBMp.js";
import { n as sanitizeTerminalText } from "./safe-text-DbwznzfG.js";
import { i as readActiveGatewayLockIdentity, r as isSameGatewayLockIdentity } from "./gateway-lock-G9roAjek.js";
import { t as LOOPBACK_PORT_PROBE_HOSTS } from "./ports-probe-hhQ4vd04.js";
import { t as resolveGatewayServiceProbeHosts } from "./gateway-service-probe-hosts-D4oFi6hw.js";
import { n as classifyPortListener, r as formatPortDiagnostics } from "./ports-format-FOKK5FaA.js";
import { n as inspectPortUsage } from "./ports-inspect-8eZVwL-B.js";
import "./restart-stale-pids-g_celehk.js";
import { o as classifyGatewayConnectFailure } from "./connect-error-details-Dxf1zdDX.js";
import { n as probeGateway } from "./probe-BciXecJ6.js";
import { i as hasActiveStartupMigrationLease, t as STARTUP_MIGRATION_LEASE_TTL_MS } from "./startup-migration-checkpoint-CgfvqOqk.js";
import { r as resolveGatewayProbeAuthSafeWithSecretInputs } from "./probe-auth-Cmw7Ozpm.js";
import "./ports-8zXv4rN7.js";
//#region src/cli/daemon-cli/restart-port-ownership.ts
function hasListenerAttributionGap(portUsage) {
	if (portUsage.status !== "busy" || portUsage.listeners.length > 0) return false;
	if (portUsage.errors?.length) return true;
	return portUsage.hints.some((hint) => hint.includes("process details are unavailable"));
}
function listenerOwnedByRuntimePid(params) {
	return params.listener.pid === params.runtimePid || params.listener.ppid === params.runtimePid;
}
function allListenersOwnedByRuntimePid(listeners, runtimePid) {
	return listeners.length > 0 && listeners.every((listener) => listenerOwnedByRuntimePid({
		listener,
		runtimePid
	}));
}
//#endregion
//#region src/cli/daemon-cli/restart-health-probe.ts
function formatGatewayRestartProbeError(error) {
	return truncateUtf16Safe(sanitizeTerminalText(redactSensitiveUrlLikeString(formatErrorMessage(error))), 1024);
}
function looksLikeAuthClose(code, reason) {
	if (code !== 1008) return false;
	const normalized = normalizeLowercaseStringOrEmpty(reason);
	if (!normalized) return false;
	if (classifyGatewayConnectFailure({ reason: normalized }).kind === "pairing-required" && (normalized === "pairing required" || normalized.startsWith("pairing required:"))) return true;
	return normalized === "auth required" || normalized === "owner auth required" || normalized === "connect failed" || normalized === "device required" || normalized.startsWith("unauthorized: gateway token missing") || normalized.startsWith("unauthorized: gateway token mismatch") || normalized.startsWith("unauthorized: gateway token not configured") || normalized.startsWith("unauthorized: gateway password missing") || normalized.startsWith("unauthorized: gateway password mismatch") || normalized.startsWith("unauthorized: gateway password not configured") || normalized.startsWith("unauthorized: bootstrap token invalid or expired") || normalized.startsWith("unauthorized: tailscale identity missing") || normalized.startsWith("unauthorized: tailscale proxy headers missing") || normalized.startsWith("unauthorized: tailscale identity check failed") || normalized.startsWith("unauthorized: tailscale identity mismatch") || normalized.startsWith("unauthorized: too many failed authentication attempts") || normalized.startsWith("unauthorized: device token mismatch") || normalized.startsWith("unauthorized: device token rejected");
}
function readActivatedPluginErrors(health) {
	if (!health || typeof health !== "object") return [];
	const plugins = health.plugins;
	if (!plugins || typeof plugins !== "object") return [];
	const errors = plugins.errors;
	if (!Array.isArray(errors)) return [];
	return errors.filter((entry) => {
		if (!entry || typeof entry !== "object") return false;
		const candidate = entry;
		return candidate.activated === true && typeof candidate.id === "string" && typeof candidate.error === "string";
	}).map((entry) => {
		const error = {
			id: entry.id,
			origin: typeof entry.origin === "string" ? entry.origin : "unknown",
			activated: true,
			error: entry.error
		};
		if (typeof entry.activationSource === "string") error.activationSource = entry.activationSource;
		if (typeof entry.activationReason === "string") error.activationReason = entry.activationReason;
		if (typeof entry.failurePhase === "string") error.failurePhase = entry.failurePhase;
		return error;
	});
}
function readChannelProbeErrors(health) {
	if (!health || typeof health !== "object") return [];
	const channels = health.channels;
	if (!channels || typeof channels !== "object" || Array.isArray(channels)) return [];
	const errors = [];
	for (const [id, summary] of Object.entries(channels)) {
		if (!summary || typeof summary !== "object") continue;
		const probe = summary.probe;
		if (!probe || typeof probe !== "object") continue;
		if (probe.ok !== false) continue;
		const error = probe.error;
		errors.push({
			id,
			error: typeof error === "string" && error.trim() ? error : "probe failed"
		});
	}
	return errors;
}
async function confirmGatewayReachable(params) {
	const token = normalizeOptionalString(params.auth?.token ?? process.env.OPENCLAW_GATEWAY_TOKEN);
	const password = normalizeOptionalString(params.auth?.password ?? process.env.OPENCLAW_GATEWAY_PASSWORD);
	try {
		const probe = await probeGateway({
			url: `ws://127.0.0.1:${params.port}`,
			auth: token || password ? {
				token,
				password
			} : void 0,
			timeoutMs: 3e3,
			includeDetails: params.includeHealthDetails === true,
			env: params.env
		});
		const reachedGateway = probe.ok || looksLikeAuthClose(probe.close?.code, probe.close?.reason) || params.allowDeviceIdentityRequired === true && probe.close?.code === 1008 && normalizeLowercaseStringOrEmpty(probe.close.reason) === "device identity required" || probe.connectLatencyMs != null && probe.server?.version != null && probe.auth.capability === "connected_no_operator_scope";
		return {
			reachable: reachedGateway,
			gatewayVersion: probe.server?.version ?? null,
			activatedPluginErrors: readActivatedPluginErrors(probe.health),
			channelProbeErrors: readChannelProbeErrors(probe.health),
			...!reachedGateway && probe.error ? { probeError: formatGatewayRestartProbeError(probe.error) } : {}
		};
	} catch (error) {
		return {
			reachable: false,
			gatewayVersion: null,
			activatedPluginErrors: [],
			channelProbeErrors: [],
			probeError: formatGatewayRestartProbeError(error)
		};
	}
}
async function resolveGatewayRestartProbeAuth(env) {
	const mergedEnv = {
		...process.env,
		...env ?? void 0
	};
	return (await resolveGatewayProbeAuthSafeWithSecretInputs({
		cfg: await createConfigIO({
			env: mergedEnv,
			observe: false,
			pluginValidation: "skip",
			suppressFutureVersionWarning: true
		}).readBestEffortConfig().catch(() => ({})),
		mode: "local",
		env: mergedEnv
	})).auth;
}
async function inspectGatewayPortHealth(params) {
	let portUsage;
	try {
		portUsage = await inspectPortUsage(params.port, { probeHosts: LOOPBACK_PORT_PROBE_HOSTS });
	} catch (err) {
		portUsage = {
			port: params.port,
			status: "unknown",
			listeners: [],
			hints: [],
			errors: [String(err)]
		};
	}
	if (portUsage.status !== "busy") return {
		portUsage,
		healthy: false
	};
	const expectedListenerPid = params.expectedListenerPid;
	const listenerOwnershipVerified = expectedListenerPid !== void 0 && allListenersOwnedByRuntimePid(portUsage.listeners, expectedListenerPid);
	const { reachable, probeError } = await confirmGatewayReachable({
		port: params.port,
		auth: params.auth,
		env: process.env,
		allowDeviceIdentityRequired: listenerOwnershipVerified
	});
	return {
		portUsage,
		healthy: reachable,
		...probeError ? { probeError } : {}
	};
}
//#endregion
//#region src/cli/daemon-cli/restart-health.constants.ts
const DEFAULT_RESTART_HEALTH_TIMEOUT_MS = 6e4;
const DEFAULT_RESTART_HEALTH_DELAY_MS = 500;
const DEFAULT_RESTART_HEALTH_ATTEMPTS = Math.ceil(DEFAULT_RESTART_HEALTH_TIMEOUT_MS / 500);
//#endregion
//#region src/cli/daemon-cli/restart-health-diagnostics.ts
function renderPortUsageDiagnostics(snapshot) {
	const lines = [];
	if (snapshot.portUsage.status === "busy") lines.push(...formatPortDiagnostics(snapshot.portUsage));
	else lines.push(`Gateway port ${snapshot.portUsage.port} status: ${snapshot.portUsage.status}.`);
	if (snapshot.portUsage.errors?.length) lines.push(`Port diagnostics errors: ${snapshot.portUsage.errors.join("; ")}`);
	if (snapshot.probeError) lines.push(`Gateway probe failed: ${snapshot.probeError}`);
	return lines;
}
function renderRestartDiagnostics(snapshot) {
	const lines = [];
	if (snapshot.versionMismatch) {
		const actual = snapshot.versionMismatch.actual ?? "unavailable";
		lines.push(`Gateway version mismatch: expected ${snapshot.versionMismatch.expected}, running gateway reported ${actual}.`);
	}
	if (snapshot.activatedPluginErrors?.length) {
		lines.push("Activated plugin load errors:");
		for (const plugin of snapshot.activatedPluginErrors) lines.push(`- ${plugin.id}: ${plugin.error}`);
	}
	if (snapshot.channelProbeErrors?.length) {
		lines.push("Channel health probe errors:");
		for (const channel of snapshot.channelProbeErrors) lines.push(`- ${channel.id}: ${channel.error}`);
	}
	const runtimeSummary = [
		snapshot.runtime.status ? `status=${snapshot.runtime.status}` : null,
		snapshot.runtime.state ? `state=${snapshot.runtime.state}` : null,
		snapshot.runtime.pid != null ? `pid=${snapshot.runtime.pid}` : null,
		snapshot.runtime.lastExitStatus != null ? `lastExit=${snapshot.runtime.lastExitStatus}` : null
	].filter(Boolean).join(", ");
	if (runtimeSummary) lines.push(`Service runtime: ${runtimeSummary}`);
	lines.push(...renderPortUsageDiagnostics(snapshot));
	return lines;
}
function renderGatewayPortHealthDiagnostics(snapshot) {
	return renderPortUsageDiagnostics(snapshot);
}
//#endregion
//#region src/cli/daemon-cli/restart-lock-replacement.ts
async function waitForGatewayLockReplacement(params) {
	let attemptsUsed = 0;
	let previousOwnerReleased = false;
	for (;;) {
		let currentLockIdentity;
		try {
			currentLockIdentity = await readActiveGatewayLockIdentity();
		} catch {
			if (params.waitIndefinitelyForPreviousOwner && !previousOwnerReleased) {
				await sleep(params.delayMs);
				continue;
			}
			if (attemptsUsed >= params.attempts) return { status: "timeout" };
			attemptsUsed += 1;
			await sleep(params.delayMs);
			continue;
		}
		if (!previousOwnerReleased) if (currentLockIdentity && isSameGatewayLockIdentity(params.previousLockIdentity, currentLockIdentity)) {
			if (params.waitIndefinitelyForPreviousOwner) {
				await sleep(params.delayMs);
				continue;
			}
		} else {
			previousOwnerReleased = true;
			if (params.waitIndefinitelyForPreviousOwner) attemptsUsed = 0;
		}
		if (previousOwnerReleased && currentLockIdentity && !isSameGatewayLockIdentity(params.previousLockIdentity, currentLockIdentity)) return {
			status: "replacement",
			attemptsUsed,
			lockIdentity: currentLockIdentity
		};
		if (attemptsUsed >= params.attempts) return { status: "timeout" };
		attemptsUsed += 1;
		await sleep(params.delayMs);
	}
}
//#endregion
//#region src/cli/daemon-cli/restart-health-external.ts
async function waitForGatewayHealthyListener(params) {
	const attempts = params.attempts ?? DEFAULT_RESTART_HEALTH_ATTEMPTS;
	const delayMs = params.delayMs ?? 500;
	const previousLockIdentity = params.previousLockIdentity;
	const probeAuth = await resolveGatewayRestartProbeAuth(void 0).catch(() => void 0);
	let snapshot = previousLockIdentity ? {
		portUsage: {
			port: params.port,
			status: "unknown",
			listeners: [],
			hints: [],
			errors: [`Previous gateway lock owner ${previousLockIdentity.ownerId ?? previousLockIdentity.pid} is still active.`]
		},
		healthy: false
	} : await inspectGatewayPortHealth({
		port: params.port,
		auth: probeAuth
	});
	let attempt = 0;
	let expectedListenerPid;
	if (previousLockIdentity) {
		const replacement = await waitForGatewayLockReplacement({
			previousLockIdentity,
			attempts,
			delayMs,
			waitIndefinitelyForPreviousOwner: params.waitIndefinitelyForPreviousOwner === true
		});
		if (replacement.status === "timeout") return snapshot;
		attempt = replacement.attemptsUsed;
		expectedListenerPid = replacement.lockIdentity.pid;
		snapshot = await inspectGatewayPortHealth({
			port: params.port,
			auth: probeAuth,
			expectedListenerPid
		});
	}
	if (snapshot.healthy) return snapshot;
	while (attempt < attempts) {
		attempt += 1;
		await sleep(delayMs);
		snapshot = await inspectGatewayPortHealth({
			port: params.port,
			auth: probeAuth,
			expectedListenerPid
		});
		if (snapshot.healthy) return snapshot;
	}
	return snapshot;
}
//#endregion
//#region src/cli/daemon-cli/restart-health.ts
const STARTUP_MIGRATION_ACTIVITY_POLL_MS = 5e3;
const STOPPED_FREE_EARLY_EXIT_GRACE_MS = 1e4;
const WINDOWS_STOPPED_FREE_EARLY_EXIT_GRACE_MS = 9e4;
function applyExpectedVersion(snapshot, expectedVersion) {
	if (!expectedVersion) return snapshot;
	if (snapshot.gatewayVersion === expectedVersion) return {
		...snapshot,
		expectedVersion
	};
	if (snapshot.gatewayVersion == null) return {
		...snapshot,
		healthy: false,
		expectedVersion
	};
	return {
		...snapshot,
		healthy: false,
		expectedVersion,
		versionMismatch: {
			expected: expectedVersion,
			actual: snapshot.gatewayVersion ?? null
		}
	};
}
function applyActivatedPluginErrors(snapshot) {
	if (!snapshot.activatedPluginErrors?.length) return snapshot;
	return {
		...snapshot,
		healthy: false
	};
}
function applyChannelProbeErrors(snapshot) {
	if (!snapshot.channelProbeErrors?.length) return snapshot;
	return {
		...snapshot,
		healthy: false
	};
}
async function inspectGatewayRestart(params) {
	const env = params.env ?? process.env;
	const probeHosts = params.probeHosts ?? await resolveGatewayServiceProbeHosts({
		env,
		command: await params.service.readCommand?.(env).catch(() => null) ?? null
	});
	const expectedVersion = normalizeOptionalString(params.expectedVersion);
	let reachability = null;
	let probeError;
	let activatedPluginErrors = [];
	let channelProbeErrors = [];
	const loadReachability = async () => {
		if (!reachability) {
			reachability = await confirmGatewayReachable({
				port: params.port,
				includeHealthDetails: Boolean(expectedVersion),
				auth: params.probeAuth,
				env
			});
			probeError = reachability.probeError;
			activatedPluginErrors = reachability.activatedPluginErrors;
			channelProbeErrors = reachability.channelProbeErrors;
		}
		return reachability;
	};
	let runtime = { status: "unknown" };
	try {
		runtime = await params.service.readRuntime(env);
	} catch (err) {
		runtime = {
			status: "unknown",
			detail: String(err)
		};
	}
	let portUsage;
	try {
		portUsage = await inspectPortUsage(params.port, { probeHosts });
	} catch (err) {
		portUsage = {
			port: params.port,
			status: "unknown",
			listeners: [],
			hints: [],
			errors: [String(err)]
		};
	}
	if (portUsage.status === "busy" && runtime.status !== "running") {
		const reachable = await loadReachability();
		if (reachable.reachable) return applyChannelProbeErrors(applyActivatedPluginErrors(applyExpectedVersion({
			runtime,
			portUsage,
			healthy: true,
			staleGatewayPids: [],
			gatewayVersion: reachable.gatewayVersion,
			...reachable.activatedPluginErrors.length > 0 ? { activatedPluginErrors: reachable.activatedPluginErrors } : {},
			...reachable.channelProbeErrors.length > 0 ? { channelProbeErrors: reachable.channelProbeErrors } : {}
		}, expectedVersion)));
	}
	const gatewayListeners = portUsage.status === "busy" ? portUsage.listeners.filter((listener) => classifyPortListener(listener, params.port) === "gateway") : [];
	const fallbackListenerPids = params.includeUnknownListenersAsStale && process.platform === "win32" && runtime.status !== "running" && portUsage.status === "busy" ? portUsage.listeners.filter((listener) => classifyPortListener(listener, params.port) === "unknown").map((listener) => listener.pid).filter((pid) => Number.isFinite(pid)) : [];
	const running = runtime.status === "running";
	const runtimePid = runtime.pid;
	const listenerAttributionGap = hasListenerAttributionGap(portUsage);
	const ownsPort = runtimePid != null ? portUsage.listeners.some((listener) => listenerOwnedByRuntimePid({
		listener,
		runtimePid
	})) || listenerAttributionGap : gatewayListeners.length > 0 || listenerAttributionGap;
	let healthy = running && ownsPort;
	let gatewayVersion;
	if (expectedVersion && healthy && portUsage.status === "busy") {
		const reachable = await loadReachability();
		healthy = reachable.reachable;
		gatewayVersion = reachable.gatewayVersion;
		if (reachable.activatedPluginErrors.length > 0) healthy = false;
		if (reachable.channelProbeErrors.length > 0) healthy = false;
	}
	if (!healthy && running && portUsage.status === "busy" && !expectedVersion) {
		const reachable = await loadReachability();
		healthy = reachable.reachable;
		gatewayVersion = reachable.gatewayVersion;
	}
	const staleGatewayPids = Array.from(/* @__PURE__ */ new Set([...gatewayListeners.filter((listener) => Number.isFinite(listener.pid)).filter((listener) => {
		if (!running) return true;
		if (runtimePid == null) return false;
		return !listenerOwnedByRuntimePid({
			listener,
			runtimePid
		});
	}).map((listener) => listener.pid), ...fallbackListenerPids.filter((pid) => runtime.pid == null || pid !== runtime.pid || !running)]));
	return applyChannelProbeErrors(applyActivatedPluginErrors(applyExpectedVersion({
		runtime,
		portUsage,
		healthy,
		staleGatewayPids,
		...gatewayVersion !== void 0 ? { gatewayVersion } : {},
		...probeError ? { probeError } : {},
		...activatedPluginErrors.length ? { activatedPluginErrors } : {},
		...channelProbeErrors.length ? { channelProbeErrors } : {}
	}, expectedVersion)));
}
function shouldEarlyExitStoppedFree(snapshot, attempt, minAttempt) {
	return attempt >= minAttempt && snapshot.runtime.status === "stopped" && snapshot.portUsage.status === "free";
}
function stoppedFreeEarlyExitGraceMs() {
	return process.platform === "win32" ? WINDOWS_STOPPED_FREE_EARLY_EXIT_GRACE_MS : STOPPED_FREE_EARLY_EXIT_GRACE_MS;
}
function withWaitContext(snapshot, waitOutcome, elapsedMs) {
	return {
		...snapshot,
		waitOutcome,
		elapsedMs
	};
}
async function waitForGatewayHealthyRestart(params) {
	const startedAtMs = performance.now();
	const attempts = params.attempts ?? DEFAULT_RESTART_HEALTH_ATTEMPTS;
	const delayMs = params.delayMs ?? 500;
	const standardDeadlineMs = attempts * delayMs;
	const probeAuth = await resolveGatewayRestartProbeAuth(params.env).catch(() => void 0);
	const probeHosts = params.probeHosts ?? await resolveGatewayServiceProbeHosts({
		env: params.env,
		command: await params.service.readCommand(params.env ?? process.env).catch(() => null)
	});
	let snapshot = await inspectGatewayRestart({
		service: params.service,
		port: params.port,
		env: params.env,
		expectedVersion: params.expectedVersion,
		includeUnknownListenersAsStale: params.includeUnknownListenersAsStale,
		probeAuth,
		probeHosts
	});
	let consecutiveStoppedFreeCount = 0;
	const STOPPED_FREE_THRESHOLD = 6;
	const minAttemptForEarlyExit = Math.min(Math.ceil(stoppedFreeEarlyExitGraceMs() / delayMs), Math.floor(attempts / 2));
	let migrationDeadlineMs;
	let postMigrationDeadlineMs;
	let migrationActive = false;
	let nextMigrationActivityPollMs = 0;
	for (let attempt = 0;; attempt += 1) {
		const elapsedMs = Math.max(0, performance.now() - startedAtMs);
		if (snapshot.healthy && (!params.requireRunningService || snapshot.runtime.status === "running")) return withWaitContext(snapshot, "healthy", elapsedMs);
		if (snapshot.activatedPluginErrors?.length) return withWaitContext(snapshot, "plugin-errors", elapsedMs);
		if (snapshot.channelProbeErrors?.length) return withWaitContext(snapshot, "channel-errors", elapsedMs);
		if (snapshot.versionMismatch) return withWaitContext(snapshot, "version-mismatch", elapsedMs);
		if (snapshot.staleGatewayPids.length > 0 && snapshot.runtime.status !== "running") return withWaitContext(snapshot, "stale-pids", elapsedMs);
		if (!params.supervisorKeepsAlive && shouldEarlyExitStoppedFree(snapshot, attempt, minAttemptForEarlyExit)) {
			consecutiveStoppedFreeCount += 1;
			if (consecutiveStoppedFreeCount >= STOPPED_FREE_THRESHOLD) return withWaitContext(snapshot, "stopped-free", elapsedMs);
		} else if (snapshot.runtime.status !== "stopped" || snapshot.portUsage.status !== "free") consecutiveStoppedFreeCount = 0;
		if (snapshot.runtime.status !== "running") migrationActive = false;
		else if (elapsedMs >= nextMigrationActivityPollMs) {
			migrationActive = (() => {
				try {
					return (params.isStartupMigrationActive ?? hasActiveStartupMigrationLease)({ env: params.env });
				} catch {
					return false;
				}
			})();
			nextMigrationActivityPollMs = elapsedMs + STARTUP_MIGRATION_ACTIVITY_POLL_MS;
			if (migrationActive && migrationDeadlineMs === void 0) migrationDeadlineMs = elapsedMs + STARTUP_MIGRATION_LEASE_TTL_MS;
			else if (!migrationActive && migrationDeadlineMs !== void 0) postMigrationDeadlineMs ??= elapsedMs + standardDeadlineMs;
		}
		if (elapsedMs >= standardDeadlineMs || migrationDeadlineMs !== void 0) {
			const deadlineMs = migrationActive ? migrationDeadlineMs : postMigrationDeadlineMs ?? standardDeadlineMs;
			if (deadlineMs === void 0 || elapsedMs >= deadlineMs) return withWaitContext(snapshot, "timeout", elapsedMs);
		}
		await sleep(delayMs);
		snapshot = await inspectGatewayRestart({
			service: params.service,
			port: params.port,
			env: params.env,
			expectedVersion: params.expectedVersion,
			includeUnknownListenersAsStale: params.includeUnknownListenersAsStale,
			probeAuth,
			probeHosts
		});
	}
}
//#endregion
export { renderRestartDiagnostics as a, renderGatewayPortHealthDiagnostics as i, waitForGatewayHealthyRestart as n, DEFAULT_RESTART_HEALTH_ATTEMPTS as o, waitForGatewayHealthyListener as r, DEFAULT_RESTART_HEALTH_DELAY_MS as s, inspectGatewayRestart as t };
