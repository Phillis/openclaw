import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { c as resolveSafeTimeoutDelayMs } from "./timeouts-D2XMKe-X.js";
import { a as READ_SCOPE } from "./operator-scopes-Dw7Gu2cA.js";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-UYcIi_5g.js";
import { o as isLoopbackHost } from "./net-DeK7gO-9.js";
import { o as classifyGatewayConnectFailure } from "./connect-error-details-Dxf1zdDX.js";
import { o as readMissingScopeError } from "./gateway-error-details-C2IaYyht.js";
import { i as loadDeviceAuthTokenReadOnly, s as loadOriginDeviceTokenReadOnly } from "./device-auth-store-DJskO_me.js";
import { t as gatewayOriginScope } from "./gateway-origin-scope-D4zHFrov.js";
import { t as startGatewayClientWhenEventLoopReady } from "./client-start-readiness-B1nULpha.js";
import { t as GatewayClient } from "./client-X46urv_Y.js";
import { t as GatewayClientRequestError } from "./request-error-DOHu7KKj.js";
import { n as normalizeEdgeAuthHeadersConfig, r as resolveEdgeAuthHeaders, t as gatewayEdgeAuthValueForTarget } from "./edge-auth-Civ8JWuj.js";
import "./method-scopes-BQC2sTma.js";
import { randomUUID } from "node:crypto";
//#region src/gateway/probe.ts
const MIN_PROBE_TIMEOUT_MS = 250;
const OPERATOR_READ_SCOPE = "operator.read";
const OPERATOR_WRITE_SCOPE = "operator.write";
const OPERATOR_ADMIN_SCOPE = "operator.admin";
const DEVICE_IDENTITY_REQUIRED_CLOSE_CODE = 1008;
const DEVICE_IDENTITY_REQUIRED_CLOSE_REASON = "device identity required";
const DEVICE_REQUIRED_PROBE_FAILURE_THRESHOLD = 3;
const DEVICE_REQUIRED_PROBE_TTL_MS = 5 * 6e4;
const PROBE_CLIENT_STOP_TIMEOUT_MS = 1e3;
const deviceRequiredProbeCache = /* @__PURE__ */ new Map();
function clampProbeTimeoutMs(timeoutMs) {
	return resolveSafeTimeoutDelayMs(timeoutMs, { minMs: MIN_PROBE_TIMEOUT_MS });
}
function formatProbeCloseError(close) {
	return `gateway closed (${close.code}): ${close.reason}`;
}
function resolveDeviceRequiredProbeCacheKey(url) {
	try {
		return new URL(url).href;
	} catch {
		return url;
	}
}
function isDeviceIdentityRequiredClose(close) {
	return close?.code === DEVICE_IDENTITY_REQUIRED_CLOSE_CODE && close.reason.trim().toLowerCase() === DEVICE_IDENTITY_REQUIRED_CLOSE_REASON;
}
function hasProbeAuth(auth) {
	return Boolean(auth?.token?.trim() || auth?.password?.trim());
}
function resolveProbeDeviceAuthScope(url) {
	try {
		return isLoopbackHost(new URL(url).hostname) ? void 0 : gatewayOriginScope(url);
	} catch {
		return;
	}
}
function shouldShortCircuitDeviceRequiredProbe(cacheKey, nowMs) {
	const entry = deviceRequiredProbeCache.get(cacheKey);
	if (!entry) return false;
	if (nowMs - entry.firstFailureAtMs >= DEVICE_REQUIRED_PROBE_TTL_MS) {
		deviceRequiredProbeCache.delete(cacheKey);
		return false;
	}
	return entry.failures >= DEVICE_REQUIRED_PROBE_FAILURE_THRESHOLD;
}
function noteDeviceRequiredProbeFailure(cacheKey, nowMs) {
	const existing = deviceRequiredProbeCache.get(cacheKey);
	if (!existing || nowMs - existing.firstFailureAtMs >= DEVICE_REQUIRED_PROBE_TTL_MS) {
		deviceRequiredProbeCache.set(cacheKey, {
			failures: 1,
			firstFailureAtMs: nowMs
		});
		return;
	}
	existing.failures += 1;
}
function clearDeviceRequiredProbeFailures(cacheKey) {
	deviceRequiredProbeCache.delete(cacheKey);
}
function emptyProbeAuth() {
	return {
		role: null,
		scopes: [],
		capability: "unknown"
	};
}
function emptyProbeServer() {
	return {
		version: null,
		connId: null
	};
}
function makeDeviceRequiredShortCircuitResult(url) {
	const close = {
		code: DEVICE_IDENTITY_REQUIRED_CLOSE_CODE,
		reason: DEVICE_IDENTITY_REQUIRED_CLOSE_REASON,
		hint: "probe short-circuited by recent device-required rejections"
	};
	return {
		ok: false,
		url,
		connectLatencyMs: null,
		error: formatProbeCloseError(close),
		close,
		auth: emptyProbeAuth(),
		server: emptyProbeServer(),
		health: null,
		status: null,
		presence: null,
		configSnapshot: null
	};
}
function resolveProbeAuthSummary(params) {
	const scopes = Array.isArray(params.scopes) ? params.scopes : [];
	return {
		role: params.role ?? null,
		scopes,
		capability: resolveGatewayProbeCapability({
			auth: { scopes },
			authMetadataPresent: params.authMetadataPresent,
			connectErrorDetails: params.connectErrorDetails,
			error: params.error,
			close: params.close,
			verifiedRead: params.verifiedRead,
			connectLatencyMs: params.connectLatencyMs
		})
	};
}
function resolveGatewayProbeCapability(params) {
	if (classifyGatewayConnectFailure({
		details: params.connectErrorDetails,
		reason: params.close?.reason,
		message: params.error
	}).kind === "pairing-required") return "pairing_pending";
	const scopes = Array.isArray(params.auth?.scopes) ? params.auth.scopes : [];
	if (scopes.includes(OPERATOR_ADMIN_SCOPE)) return "admin_capable";
	if (scopes.includes(OPERATOR_WRITE_SCOPE)) return "write_capable";
	if (scopes.includes(OPERATOR_READ_SCOPE) || params.verifiedRead === true) return "read_only";
	if (params.connectLatencyMs != null && params.authMetadataPresent === true) return "connected_no_operator_scope";
	return "unknown";
}
async function probeGateway(opts) {
	const startedAt = Date.now();
	const instanceId = randomUUID();
	let connectLatencyMs = null;
	let connectError = null;
	let connectErrorDetails = null;
	let close = null;
	let auth = emptyProbeAuth();
	let server = emptyProbeServer();
	let authMetadataPresent = false;
	const detailLevel = opts.includeDetails === false ? "none" : opts.detailLevel ?? "full";
	const deviceAuthScope = opts.suppressStoredDeviceAuth ? void 0 : opts.originScopedDeviceAuth ? gatewayOriginScope(opts.url) : resolveProbeDeviceAuthScope(opts.url);
	const deviceIdentity = await (async () => {
		try {
			if (!URL.canParse(opts.url)) return null;
			const { loadDeviceIdentityIfPresent } = await import("./device-identity-CIVBf3VR.js");
			const identity = loadDeviceIdentityIfPresent({ env: opts.env });
			if (!identity) return null;
			return (opts.suppressStoredDeviceAuth ? null : deviceAuthScope ? loadOriginDeviceTokenReadOnly({
				gatewayScope: deviceAuthScope,
				deviceId: identity.deviceId,
				role: "operator",
				env: opts.env
			}) : loadDeviceAuthTokenReadOnly({
				deviceId: identity.deviceId,
				role: "operator",
				env: opts.env
			})) ? identity : null;
		} catch {
			return null;
		}
	})();
	const cacheKey = resolveDeviceRequiredProbeCacheKey(opts.url);
	const cacheEligible = deviceIdentity == null && !hasProbeAuth(opts.auth);
	if (cacheEligible && shouldShortCircuitDeviceRequiredProbe(cacheKey, Date.now())) return makeDeviceRequiredShortCircuitResult(opts.url);
	const initialProbeTimeoutMs = clampProbeTimeoutMs(opts.timeoutMs);
	const edgeAuthConfig = normalizeEdgeAuthHeadersConfig(gatewayEdgeAuthValueForTarget({
		config: opts.config ?? {},
		targetUrl: opts.url
	}));
	const edgeAuthHeaders = await resolveEdgeAuthHeaders({
		config: opts.config ?? {},
		value: edgeAuthConfig,
		targetUrl: opts.url,
		env: opts.env ?? process.env
	});
	return await new Promise((resolve) => {
		let settled = false;
		let timer = null;
		const startAbort = new AbortController();
		const clearProbeTimer = () => {
			if (timer) {
				clearTimeout(timer);
				timer = null;
			}
		};
		const armProbeTimer = (onTimeout, timeoutMs = initialProbeTimeoutMs) => {
			clearProbeTimer();
			timer = setTimeout(onTimeout, resolveSafeTimeoutDelayMs(timeoutMs));
		};
		const settle = (result) => {
			if (settled) return;
			settled = true;
			startAbort.abort();
			clearProbeTimer();
			(async () => {
				try {
					await client.stopAndWait({ timeoutMs: PROBE_CLIENT_STOP_TIMEOUT_MS });
				} catch {
					client.stop();
				}
				if (result.ok) clearDeviceRequiredProbeFailures(cacheKey);
				else if (cacheEligible && isDeviceIdentityRequiredClose(result.close)) noteDeviceRequiredProbeFailure(cacheKey, Date.now());
				const { connectErrorDetails: resultConnectErrorDetails, ...rest } = result;
				resolve({
					url: opts.url,
					...rest,
					...resultConnectErrorDetails != null ? { connectErrorDetails: resultConnectErrorDetails } : {}
				});
			})();
		};
		const settleProbe = (params) => {
			settle({
				ok: params.ok,
				connectLatencyMs,
				error: params.error,
				...params.missingScopeErrorDetails ? { missingScopeErrorDetails: params.missingScopeErrorDetails } : {},
				connectErrorDetails,
				close,
				auth: resolveProbeAuthSummary({
					role: auth.role,
					scopes: auth.scopes,
					authMetadataPresent,
					connectErrorDetails,
					error: params.error,
					close,
					verifiedRead: params.verifiedRead,
					connectLatencyMs
				}),
				server,
				health: params.health,
				status: params.status,
				presence: params.presence,
				configSnapshot: params.configSnapshot
			});
		};
		const client = new GatewayClient({
			url: opts.url,
			...deviceAuthScope ? { deviceAuthScope } : {},
			token: opts.auth?.token,
			password: opts.auth?.password,
			edgeAuthHeaders,
			tlsFingerprint: opts.tlsFingerprint,
			preauthHandshakeTimeoutMs: opts.preauthHandshakeTimeoutMs,
			env: opts.env,
			scopes: [READ_SCOPE],
			clientName: GATEWAY_CLIENT_NAMES.CLI,
			clientVersion: "dev",
			mode: GATEWAY_CLIENT_MODES.PROBE,
			sharedStateMode: "read-only",
			instanceId,
			deviceIdentity,
			onConnectError: (err) => {
				connectError = formatErrorMessage(err);
				connectErrorDetails = err instanceof GatewayClientRequestError ? err.details : null;
			},
			onClose: (code, reason, info) => {
				close = {
					code,
					reason
				};
				if (connectLatencyMs == null) {
					if (info?.transportValidated === true) connectLatencyMs = Date.now() - startedAt;
					settleProbe({
						ok: false,
						error: connectError || formatProbeCloseError(close),
						health: null,
						status: null,
						presence: null,
						configSnapshot: null
					});
				}
			},
			onHelloOk: (hello) => {
				(async () => {
					connectLatencyMs = Date.now() - startedAt;
					authMetadataPresent = typeof hello?.auth === "object" && hello.auth !== null;
					server = {
						version: typeof hello?.server?.version === "string" ? hello.server.version : null,
						...typeof hello?.server?.buildId === "string" ? { buildId: hello.server.buildId } : {},
						connId: typeof hello?.server?.connId === "string" ? hello.server.connId : null
					};
					auth = resolveProbeAuthSummary({
						role: typeof hello?.auth?.role === "string" ? hello.auth.role : null,
						scopes: Array.isArray(hello?.auth?.scopes) ? hello.auth.scopes.filter((scope) => typeof scope === "string") : [],
						authMetadataPresent
					});
					if (detailLevel === "none") {
						settleProbe({
							ok: true,
							error: null,
							verifiedRead: false,
							health: null,
							status: null,
							presence: null,
							configSnapshot: null
						});
						return;
					}
					armProbeTimer(() => {
						settleProbe({
							ok: false,
							error: "timeout",
							health: null,
							status: null,
							presence: null,
							configSnapshot: null
						});
					});
					try {
						if (detailLevel === "presence") {
							const presence = await client.request("system-presence");
							settleProbe({
								ok: true,
								error: null,
								verifiedRead: true,
								health: null,
								status: null,
								presence: Array.isArray(presence) ? presence : null,
								configSnapshot: null
							});
							return;
						}
						if (detailLevel === "config") {
							const configSnapshot = await client.request("config.get", {});
							settleProbe({
								ok: true,
								error: null,
								verifiedRead: true,
								health: null,
								status: null,
								presence: null,
								configSnapshot
							});
							return;
						}
						const [health, status, presence, configSnapshot] = await Promise.all([
							client.request("health"),
							client.request("status"),
							client.request("system-presence"),
							client.request("config.get", {})
						]);
						settleProbe({
							ok: true,
							error: null,
							verifiedRead: true,
							health,
							status,
							presence: Array.isArray(presence) ? presence : null,
							configSnapshot
						});
					} catch (err) {
						const error = formatErrorMessage(err);
						const missingScopeErrorDetails = readMissingScopeError(err);
						settleProbe({
							ok: false,
							error,
							...missingScopeErrorDetails ? { missingScopeErrorDetails } : {},
							health: null,
							status: null,
							presence: null,
							configSnapshot: null
						});
					}
				})();
			}
		});
		armProbeTimer(() => {
			const error = connectError ? `connect failed: ${connectError}` : "timeout";
			settleProbe({
				ok: false,
				error,
				health: null,
				status: null,
				presence: null,
				configSnapshot: null
			});
		});
		startGatewayClientWhenEventLoopReady(client, {
			timeoutMs: initialProbeTimeoutMs,
			signal: startAbort.signal
		}).then((readiness) => {
			if (settled || readiness.ready || readiness.aborted) return;
			settleProbe({
				ok: false,
				error: "timeout",
				health: null,
				status: null,
				presence: null,
				configSnapshot: null
			});
		}).catch((err) => {
			if (settled) return;
			connectError = formatErrorMessage(err);
			settleProbe({
				ok: false,
				error: connectError,
				health: null,
				status: null,
				presence: null,
				configSnapshot: null
			});
		});
	});
}
//#endregion
export { probeGateway as n, resolveProbeAuthSummary as r, clampProbeTimeoutMs as t };
