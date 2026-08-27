import { r as isGatewayTransportError, t as GatewayTransportError } from "./transport-error-D_LRKgla.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as isVitestRuntimeEnv } from "./test-runtime-env-DQDRzsLt.js";
import "./env-ChWDbSFK.js";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-BN1NZvXG.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { D as parseJsonWithJson5Fallback, E as resolveConfigIncludes, w as readConfigIncludeFileWithGuards } from "./redact-CWP17HFN.js";
import { t as createAbortError } from "./abort-signal-D2k14JsD.js";
import { r as resolveConfigEnvVars } from "./env-substitution-DXYJj0ec.js";
import { _ as resolveGatewayPort, f as resolveConfigPath, v as resolveIncludeRoots, w as resolveStateDir } from "./paths-BBSTUjD5.js";
import { n as extractErrorCodeOrErrno } from "./error-graph-internal-H3duHSSm.js";
import { n as VERSION } from "./version-CkBmshxX.js";
import { t as applyConfigEnvVars } from "./config-env-vars-C_yEEhJa.js";
import { a as getRuntimeConfigSnapshot } from "./runtime-snapshot-Cv5MaU8U.js";
import { c as resolveSafeTimeoutDelayMs, s as resolvePreauthHandshakeTimeoutMs } from "./timeouts-D2XMKe-X.js";
import { f as isLoopbackIpAddress } from "./ip-Bc6HA4HC.js";
import { t as ADMIN_SCOPE } from "./operator-scopes-Dw7Gu2cA.js";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-UYcIi_5g.js";
import { r as trimToUndefined } from "./credential-planner-Cyn3ajET.js";
import { n as isGatewaySecretRefUnavailableError, r as resolveExplicitGatewayAuth } from "./credentials-CNWVqkD0.js";
import { n as resolveGatewayAuth } from "./auth-resolve-BCGWcCc0.js";
import { t as ConnectErrorDetailCodes, u as readConnectErrorDetailCode } from "./connect-error-details-Dxf1zdDX.js";
import { s as readMissingScopeErrorDetails } from "./gateway-error-details-C2IaYyht.js";
import "./version-CwNT1gaY.js";
import { i as loadDeviceAuthTokenReadOnly, o as loadOriginDeviceToken, r as loadDeviceAuthToken, s as loadOriginDeviceTokenReadOnly } from "./device-auth-store-DVgrQui-.js";
import { n as loadDeviceIdentityIfPresent, r as loadOrCreateDeviceIdentity } from "./device-identity-UxfYyiX_.js";
import { t as loadGatewayTlsRuntime } from "./gateway-JLU8_492.js";
import { r as roleScopesAllow } from "./operator-scope-compat-C7_b0yme.js";
import { n as projectGatewayConnectionDetailsForDiagnostics, r as projectGatewayUrlForDiagnostics, t as buildGatewayConnectionDetailsWithResolvers } from "./connection-details-BknYMhkx.js";
import "./credentials-secret-inputs-B7OzED4v.js";
import { a as resolveGatewayConnectionTlsFingerprint, i as resolveGatewayUrlOverride, r as resolveGatewayClientBootstrap } from "./client-bootstrap-PTj3BLWq.js";
import { t as startGatewayClientWhenEventLoopReady } from "./client-start-readiness-B1nULpha.js";
import { n as isGatewayConnectAssemblyError, t as GatewayClient } from "./client-CtXLFRHL.js";
import { n as normalizeEdgeAuthHeadersConfig, r as resolveEdgeAuthHeaders, t as gatewayEdgeAuthValueForTarget } from "./edge-auth-DIfb3Zvn.js";
import { a as isGatewayMethodClassified, s as resolveLeastPrivilegeOperatorScopesForMethod, t as CLI_DEFAULT_OPERATOR_SCOPES } from "./method-scopes-BTnJZEGh.js";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
//#region src/config/gateway-dispatch-config.ts
const GATEWAY_DISPATCH_SHELL_ENV_EXPECTED_KEYS = ["OPENCLAW_GATEWAY_TOKEN", "OPENCLAW_GATEWAY_PASSWORD"];
const GATEWAY_DISPATCH_TOP_LEVEL_KEYS = [
	"agents",
	"env",
	"gateway",
	"plugins",
	"secrets",
	"session"
];
function cloneConfigValue(value) {
	if (Array.isArray(value)) return value.map((entry) => cloneConfigValue(entry));
	if (!isRecord(value)) return value;
	const out = {};
	for (const [key, child] of Object.entries(value)) out[key] = cloneConfigValue(child);
	return out;
}
function projectGatewayDispatchConfig(value) {
	if (!isRecord(value)) return {};
	const projected = {};
	for (const key of GATEWAY_DISPATCH_TOP_LEVEL_KEYS) if (Object.hasOwn(value, key)) projected[key] = cloneConfigValue(value[key]);
	return projected;
}
function applyGatewayDispatchSessionDefaults(config) {
	if (config.session?.mainKey === void 0) return config;
	return {
		...config,
		session: {
			...config.session,
			mainKey: "main"
		}
	};
}
function resolveIncludesForGatewayDispatch(parsed, configPath, env) {
	return resolveConfigIncludes(parsed, configPath, {
		readFile: (candidate) => fs.readFileSync(candidate, "utf-8"),
		readFileWithGuards: ({ includePath, resolvedPath, rootRealDir }) => readConfigIncludeFileWithGuards({
			includePath,
			resolvedPath,
			rootRealDir,
			ioFs: fs
		}),
		parseJson: parseJsonWithJson5Fallback
	}, { allowedRoots: resolveIncludeRoots(env) });
}
function resolveGatewayDispatchEnvVars(config, env) {
	if (isRecord(config) && Object.hasOwn(config, "env")) applyConfigEnvVars(config, env);
	return resolveConfigEnvVars(config, env, { onMissing: () => void 0 });
}
function readRawGatewayDispatchConfig(options = {}) {
	const env = options.env ?? process.env;
	const configPath = options.configPath ?? resolveConfigPath(env);
	if (!fs.existsSync(configPath)) return {
		config: {},
		configPath
	};
	return {
		config: applyGatewayDispatchSessionDefaults(projectGatewayDispatchConfig(resolveGatewayDispatchEnvVars(resolveIncludesForGatewayDispatch(parseJsonWithJson5Fallback(fs.readFileSync(configPath, "utf-8")), configPath, env), env))),
		configPath
	};
}
function readGatewayDispatchConfig(options = {}) {
	return readRawGatewayDispatchConfig(options).config;
}
async function readGatewayDispatchConfigWithShellEnvFallback(options = {}) {
	const env = options.env ?? process.env;
	const firstRead = readRawGatewayDispatchConfig(options);
	const { loadShellEnvFallback, resolveShellEnvFallbackTimeoutMs, shouldDeferShellEnvFallback, shouldEnableShellEnvFallback } = await import("./shell-env-BURAOfLk.js");
	if ((shouldEnableShellEnvFallback(env) || firstRead.config.env?.shellEnv?.enabled === true) && !shouldDeferShellEnvFallback(env)) loadShellEnvFallback({
		enabled: true,
		env,
		expectedKeys: [...GATEWAY_DISPATCH_SHELL_ENV_EXPECTED_KEYS],
		logger: options.logger ?? console,
		timeoutMs: firstRead.config.env?.shellEnv?.timeoutMs ?? resolveShellEnvFallbackTimeoutMs(env)
	});
	return readGatewayDispatchConfig({
		...options,
		configPath: path.resolve(firstRead.configPath)
	});
}
//#endregion
//#region src/gateway/explicit-connection-policy.ts
function hasExplicitGatewayConnectionAuth(auth) {
	return Boolean(trimToUndefined(auth?.token) || trimToUndefined(auth?.password));
}
function targetMayRequireConfiguredEdgeAuth(url) {
	try {
		const protocol = new URL(url).protocol;
		return protocol === "wss:" || protocol === "https:";
	} catch {
		return false;
	}
}
/**
* True when the caller fully addressed the Gateway with flags. Config is then
* consulted only for gateway.remote.edgeAuth, so a broken config must not block
* the connection: this is the historical recovery path for an invalid config.
*/
function isExplicitGatewayConnection(params) {
	return !params.config && Boolean(trimToUndefined(params.urlOverride)) && hasExplicitGatewayConnectionAuth(params.explicitAuth);
}
/** Returns true when url/auth flags are sufficient and loading OpenClaw config is unnecessary. */
function canSkipGatewayConfigLoad(params) {
	const urlOverride = trimToUndefined(params.urlOverride);
	if (!urlOverride || params.config || !hasExplicitGatewayConnectionAuth(params.explicitAuth)) return false;
	return !targetMayRequireConfiguredEdgeAuth(urlOverride);
}
//#endregion
//#region src/gateway/call.ts
var GatewayCredentialsRequiredError = class extends Error {
	constructor(params) {
		super([
			`gateway ${params.method} requires credentials before opening a websocket`,
			"Fix: configure gateway.auth token/password, pair this device, or pass --token/--password.",
			`Config: ${params.configPath}`
		].join("\n"));
		this.name = "GatewayCredentialsRequiredError";
		this.method = params.method;
		this.configPath = params.configPath;
	}
};
var GatewayStoredDeviceAuthUnavailableError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "GatewayStoredDeviceAuthUnavailableError";
	}
};
var GatewayLocalBackendSharedAuthUnavailableError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "GatewayLocalBackendSharedAuthUnavailableError";
	}
};
function firstGatewayErrorLine(message) {
	return message.split("\n", 1)[0]?.trim() || message;
}
const GATEWAY_UNREACHABLE_SOCKET_CODES = /* @__PURE__ */ new Set([
	"ECONNREFUSED",
	"ECONNRESET",
	"EHOSTUNREACH",
	"ENETUNREACH",
	"ENOTFOUND",
	"ETIMEDOUT"
]);
function isGatewayUnreachableSocketError(error) {
	const code = extractErrorCodeOrErrno(error);
	return code !== void 0 && GATEWAY_UNREACHABLE_SOCKET_CODES.has(code);
}
function formatGatewayTransportErrorJson(value) {
	if (!isGatewayTransportError(value)) return null;
	const connectionDetails = projectGatewayConnectionDetailsForDiagnostics(value.connectionDetails);
	return {
		ok: false,
		error: {
			type: "gateway_transport_error",
			kind: value.kind,
			message: redactSensitiveUrlLikeString(firstGatewayErrorLine(value.message)),
			...value.code !== void 0 ? { code: value.code } : {},
			...value.reason !== void 0 ? { reason: redactSensitiveUrlLikeString(value.reason) } : {},
			...value.timeoutMs !== void 0 ? { timeoutMs: value.timeoutMs } : {}
		},
		gateway: {
			url: connectionDetails.url,
			urlSource: connectionDetails.urlSource,
			...connectionDetails.bindDetail ? { bindDetail: connectionDetails.bindDetail } : {},
			...connectionDetails.remoteFallbackNote ? { remoteFallbackNote: connectionDetails.remoteFallbackNote } : {}
		}
	};
}
function formatGatewayClientRequestErrorJson(value) {
	if (!isGatewayClientRequestError(value)) return null;
	const requestError = value;
	return {
		ok: false,
		error: {
			type: "gateway_request_error",
			code: requestError.gatewayCode,
			message: requestError.message,
			...requestError.details !== void 0 ? { details: requestError.details } : {},
			retryable: requestError.retryable,
			...requestError.retryAfterMs !== void 0 ? { retryAfterMs: requestError.retryAfterMs } : {}
		}
	};
}
function isGatewayClientRequestError(value) {
	if (!(value instanceof Error) || value.name !== "GatewayClientRequestError") return false;
	const requestError = value;
	if (typeof requestError.gatewayCode !== "string" || requestError.gatewayCode.length === 0 || requestError.message.length === 0 || typeof requestError.retryable !== "boolean" || requestError.retryAfterMs !== void 0 && (typeof requestError.retryAfterMs !== "number" || !Number.isInteger(requestError.retryAfterMs) || requestError.retryAfterMs < 0)) return false;
	return true;
}
/** Preserve machine-readable output for auth failures raised before transport startup. */
function formatGatewayAuthErrorJson(value) {
	if (!isGatewayCredentialsRequiredError(value) && !isGatewayExplicitAuthRequiredError(value) && !isGatewaySecretRefUnavailableError(value)) return null;
	return {
		ok: false,
		error: {
			type: "gateway_credentials_required",
			message: value.message
		}
	};
}
function isGatewayCredentialsRequiredError(value) {
	if (value instanceof GatewayCredentialsRequiredError) return true;
	if (!(value instanceof Error) || value.name !== "GatewayCredentialsRequiredError") return false;
	const candidate = value;
	return typeof candidate.method === "string" && typeof candidate.configPath === "string";
}
function isGatewayExplicitAuthRequiredError(value) {
	return value instanceof Error && value.name === "GatewayExplicitAuthRequiredError";
}
const defaultGetRuntimeConfig = async () => getRuntimeConfigSnapshot() ?? await readGatewayDispatchConfigWithShellEnvFallback();
async function stopGatewayClient(client) {
	try {
		await client.stopAndWait({ timeoutMs: 1e3 });
	} catch {
		client.stop();
	}
}
function resolveGatewayClientDisplayName(opts) {
	if (opts.clientDisplayName) return opts.clientDisplayName;
	const clientName = opts.clientName ?? GATEWAY_CLIENT_NAMES.CLI;
	if ((opts.mode ?? GATEWAY_CLIENT_MODES.CLI) !== GATEWAY_CLIENT_MODES.BACKEND && clientName !== GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT) return;
	const method = opts.method.trim();
	return method ? `gateway:${method}` : "gateway:request";
}
async function loadGatewayConfig() {
	return await defaultGetRuntimeConfig();
}
/**
* Load config for a fully flag-addressed connection. Config only supplies
* gateway.remote.edgeAuth here, so an unreadable or invalid config degrades to
* empty rather than blocking a connection the flags already describe.
*/
async function loadGatewayConfigForExplicitConnection() {
	try {
		return await loadGatewayConfig();
	} catch {
		return {};
	}
}
function loadGatewayConfigForConnectionDetails() {
	return readGatewayDispatchConfig();
}
function resolveGatewayStateDir(env) {
	return resolveStateDir(env);
}
function resolveGatewayConfigPath(env) {
	return resolveConfigPath(env, resolveGatewayStateDir(env));
}
function resolveGatewayPortValue(config, env) {
	return resolveGatewayPort(config, env);
}
function buildGatewayConnectionDetails(options = {}) {
	return buildGatewayConnectionDetailsWithResolvers(options, {
		getRuntimeConfig: () => loadGatewayConfigForConnectionDetails(),
		resolveConfigPath: (env) => resolveGatewayConfigPath(env),
		resolveGatewayPort: (config, env) => resolveGatewayPortValue(config, env)
	});
}
function isLoopbackGatewayUrl(rawUrl) {
	try {
		const hostname = new URL(rawUrl).hostname.toLowerCase();
		const unbracketed = hostname.startsWith("[") && hostname.endsWith("]") ? hostname.slice(1, -1) : hostname;
		return unbracketed === "localhost" || isLoopbackIpAddress(unbracketed);
	} catch {
		return false;
	}
}
function shouldOmitDeviceIdentityForGatewayCall(params) {
	const mode = params.opts.mode ?? GATEWAY_CLIENT_MODES.CLI;
	const clientName = params.opts.clientName ?? GATEWAY_CLIENT_NAMES.CLI;
	const hasSharedSecretAuth = params.authMode === "token" && Boolean(params.token) || params.authMode === "password" && Boolean(params.password);
	const isLoopback = isLoopbackGatewayUrl(params.url);
	const isLocalBackendSharedAuth = mode === GATEWAY_CLIENT_MODES.BACKEND && clientName === GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT && (hasSharedSecretAuth || params.allowAuthNone === true) && isLoopback;
	const isLocalCliSharedAuth = mode === GATEWAY_CLIENT_MODES.CLI && clientName === GATEWAY_CLIENT_NAMES.CLI && hasSharedSecretAuth && isLoopback;
	return isLocalBackendSharedAuth || isLocalCliSharedAuth;
}
function resolveDeviceIdentityForGatewayCall(sharedStateMode) {
	try {
		return sharedStateMode === "read-only" ? loadDeviceIdentityIfPresent() : loadOrCreateDeviceIdentity();
	} catch {
		return null;
	}
}
function loadStoredOperatorDeviceAuthToken(deviceIdentity, deviceAuthScope, sharedStateMode) {
	if (!deviceIdentity) return null;
	try {
		if (deviceAuthScope) return (sharedStateMode === "read-only" ? loadOriginDeviceTokenReadOnly : loadOriginDeviceToken)({
			gatewayScope: deviceAuthScope,
			deviceId: deviceIdentity.deviceId,
			role: "operator",
			env: process.env
		});
		return (sharedStateMode === "read-only" ? loadDeviceAuthTokenReadOnly : loadDeviceAuthToken)({
			deviceId: deviceIdentity.deviceId,
			role: "operator",
			env: process.env
		});
	} catch {
		return null;
	}
}
function resolveGatewayCallAuth(config) {
	return resolveGatewayAuth({
		authConfig: config.gateway?.auth,
		env: process.env,
		tailscaleMode: config.gateway?.tailscale?.mode
	});
}
function ensureGatewayCallCanAuthenticate(params) {
	const resolvedAuth = resolveGatewayCallAuth(params.context.config);
	const authMode = resolvedAuth.mode;
	if (authMode !== "token" && authMode !== "password") return;
	if (params.token || params.password || params.opts.approvalRuntimeToken) return;
	if (resolvedAuth.allowTailscale) return;
	if (params.storedAuth !== void 0 ? Boolean(params.storedAuth?.token) : Boolean(loadStoredOperatorDeviceAuthToken(params.deviceIdentity, params.deviceAuthScope, params.opts.sharedStateMode)?.token)) return;
	throw new GatewayCredentialsRequiredError({
		method: params.opts.method,
		configPath: params.context.configPath
	});
}
function resolveGatewayCallTimeout(timeoutValue) {
	const resolvedHandshakeTimeoutMs = Boolean(process.env.OPENCLAW_HANDSHAKE_TIMEOUT_MS) || Boolean(isVitestRuntimeEnv() && process.env.OPENCLAW_TEST_HANDSHAKE_TIMEOUT_MS) ? resolvePreauthHandshakeTimeoutMs() : void 0;
	const defaultTimeoutMs = typeof resolvedHandshakeTimeoutMs === "number" && resolvedHandshakeTimeoutMs > 1e4 ? resolvedHandshakeTimeoutMs : 1e4;
	const explicitTimeoutMs = typeof timeoutValue === "number" && Number.isFinite(timeoutValue) ? timeoutValue : void 0;
	const startupTimeoutMs = explicitTimeoutMs ?? defaultTimeoutMs;
	const timeoutMs = timeoutValue === null ? null : explicitTimeoutMs ?? defaultTimeoutMs;
	return {
		timeoutMs,
		startupTimeoutMs,
		safeTimerTimeoutMs: resolveSafeTimeoutDelayMs(timeoutMs ?? startupTimeoutMs)
	};
}
async function resolveGatewayCallContext(opts) {
	const explicitAuth = resolveExplicitGatewayAuth({
		token: opts.token,
		password: opts.password
	});
	const urlOverride = resolveGatewayUrlOverride({
		gatewayUrl: opts.url,
		env: process.env,
		ignoreEnvUrlOverride: opts.ignoreEnvUrlOverride,
		localPortOverride: opts.localPortOverride
	}).url;
	const canSkipConfigLoad = canSkipGatewayConfigLoad({
		config: opts.config,
		urlOverride,
		explicitAuth
	});
	const explicitConnection = isExplicitGatewayConnection({
		config: opts.config,
		urlOverride,
		explicitAuth
	});
	const config = opts.config ?? (canSkipConfigLoad ? {} : explicitConnection ? await loadGatewayConfigForExplicitConnection() : await loadGatewayConfig());
	return {
		config,
		configPath: opts.configPath ?? resolveGatewayConfigPath(process.env),
		isRemoteMode: opts.localPortOverride === void 0 && config.gateway?.mode === "remote",
		explicitAuth
	};
}
/** Whether the caller selected the configured local Gateway without a URL override. */
async function isImplicitLocalGatewayTarget(opts) {
	if (resolveGatewayUrlOverride({
		gatewayUrl: opts.url,
		env: process.env,
		ignoreEnvUrlOverride: opts.ignoreEnvUrlOverride,
		localPortOverride: opts.localPortOverride
	}).url) return false;
	const config = opts.config ?? await loadGatewayConfig();
	return opts.localPortOverride !== void 0 || config.gateway?.mode !== "remote";
}
function ensureRemoteModeUrlConfigured(params) {
	if (!params.context.isRemoteMode || params.urlOverrideSource || trimToUndefined(params.context.config.gateway?.remote?.url)) return;
	throw new Error([
		"gateway remote mode misconfigured: gateway.remote.url missing",
		`Config: ${params.context.configPath}`,
		"Fix: set gateway.remote.url, or set gateway.mode=local."
	].join("\n"));
}
function formatGatewayCloseError(code, reason, connectionDetails) {
	const reasonText = normalizeOptionalString(reason) || "no close reason";
	const hint = code === 1006 ? "abnormal closure (no close frame)" : code === 1e3 ? "normal closure" : "";
	let message = `gateway closed (${code}${hint ? ` ${hint}` : ""}): ${reasonText}\n${connectionDetails.message}`;
	if (code === 1006) message += "\n\nPossible causes:\n- Connection dropped without a close frame (retry; check network and gateway load)\n- Gateway not yet ready to accept connections (retry after a moment)\n- TLS mismatch (connecting with ws:// to a wss:// gateway, or vice versa)\n- Gateway process stopped or became unreachable (confirm it is still running)\nRun `openclaw doctor` for diagnostics.";
	return message;
}
function formatGatewayTimeoutError(timeoutMs, connectionDetails) {
	return `gateway timeout after ${timeoutMs}ms\n${connectionDetails.message}`;
}
/** Wrap raw socket-level connect failures (ECONNREFUSED etc.) into one actionable message. */
function createGatewayUnreachableTransportError(params) {
	const code = extractErrorCodeOrErrno(params.cause);
	return new GatewayTransportError({
		kind: "closed",
		reason: firstGatewayErrorLine(params.cause.message),
		connectionDetails: params.connectionDetails,
		message: [
			`Gateway not reachable at ${projectGatewayUrlForDiagnostics(params.connectionDetails.url)}${code ? ` (${code})` : ""}.`,
			"Start it with `openclaw gateway run` or check `openclaw gateway status`.",
			params.connectionDetails.message
		].join("\n")
	});
}
function createGatewayCloseTransportError(params) {
	const reasonText = normalizeOptionalString(params.reason) || "no close reason";
	return new GatewayTransportError({
		kind: "closed",
		code: params.code,
		reason: reasonText,
		connectionDetails: params.connectionDetails,
		message: formatGatewayCloseError(params.code, params.reason, params.connectionDetails)
	});
}
function createGatewayTimeoutTransportError(params) {
	return new GatewayTransportError({
		kind: "timeout",
		timeoutMs: params.timeoutMs,
		connectionDetails: params.connectionDetails,
		message: formatGatewayTimeoutError(params.timeoutMs, params.connectionDetails)
	});
}
function createGatewayRequestAbortError(method) {
	return createAbortError(`gateway request aborted for ${method}`);
}
function ensureGatewaySupportsRequiredMethods(params) {
	const requiredMethods = Array.isArray(params.requiredMethods) ? params.requiredMethods.map((entry) => entry.trim()).filter((entry) => entry.length > 0) : [];
	if (requiredMethods.length === 0) return;
	const supportedMethods = new Set((Array.isArray(params.methods) ? params.methods : []).map((entry) => entry.trim()).filter((entry) => entry.length > 0));
	for (const method of requiredMethods) {
		if (supportedMethods.has(method)) continue;
		throw new Error([`active gateway does not support required method "${method}" for "${params.attemptedMethod}".`, "Update or restart the active gateway and try again."].join(" "));
	}
}
function ensureGatewaySupportsRequiredCapabilities(params) {
	const required = (params.requiredCapabilities ?? []).map((entry) => entry.trim()).filter(Boolean);
	if (required.length === 0) return;
	const supported = new Set((params.capabilities ?? []).map((entry) => entry.trim()).filter(Boolean));
	for (const capability of required) if (!supported.has(capability)) throw new Error(`active gateway does not support required capability "${capability}" for "${params.attemptedMethod}". Update or restart the active gateway and try again.`);
}
function isRequiredAgentRuntimeIdentityConnectError(err) {
	return err.message.includes("gateway rejected required agent runtime identity auth field; refusing to retry without it");
}
function isAllowlistedGatewayConnectRequestError(err) {
	if (err.name !== "GatewayClientRequestError") return false;
	return readConnectErrorDetailCode(err.details) === ConnectErrorDetailCodes.AUTH_RATE_LIMITED;
}
async function executeGatewayRequestWithScopes(params) {
	const { opts, scopes, url, token, password, edgeAuthHeaders, tlsFingerprint, timeoutMs, startupTimeoutMs, safeTimerTimeoutMs, deviceIdentity, deviceAuthScope, storedAuth, surfaceGatewayClientRequestErrors } = params;
	return await new Promise((resolve, reject) => {
		if (opts.signal?.aborted) {
			reject(createGatewayRequestAbortError(opts.method));
			return;
		}
		let settled = false;
		let ignoreClose = false;
		let timer;
		const startAbort = new AbortController();
		let primaryRequestStarted = false;
		let suppressedPreHelloCleanCloses = 0;
		const cleanup = () => {
			startAbort.abort();
			if (abortHandler) opts.signal?.removeEventListener("abort", abortHandler);
			if (timer) clearTimeout(timer);
		};
		const stopClientThenSettle = (activeClient, err, value) => {
			const complete = () => {
				if (err) reject(err);
				else resolve(value);
			};
			if (!activeClient) {
				complete();
				return;
			}
			stopGatewayClient(activeClient).finally(complete);
		};
		const stop = (err, value) => {
			if (settled) return;
			settled = true;
			cleanup();
			stopClientThenSettle(client, err, value);
		};
		const abortHandler = () => {
			if (settled) return;
			ignoreClose = true;
			settled = true;
			cleanup();
			const err = createGatewayRequestAbortError(opts.method);
			const activeClient = client;
			const stopAfterAbortHook = () => stopClientThenSettle(activeClient, err);
			if (!activeClient || !opts.onSignalAbort || !primaryRequestStarted) {
				stopAfterAbortHook();
				return;
			}
			const request = activeClient.request.bind(activeClient);
			Promise.resolve().then(() => opts.onSignalAbort?.(request)).catch(() => {}).finally(stopAfterAbortHook);
		};
		opts.signal?.addEventListener("abort", abortHandler, { once: true });
		const client = new GatewayClient({
			url,
			token,
			password,
			edgeAuthHeaders,
			tlsFingerprint,
			preauthHandshakeTimeoutMs: opts.preauthHandshakeTimeoutMs,
			instanceId: opts.instanceId ?? randomUUID(),
			clientName: opts.clientName ?? GATEWAY_CLIENT_NAMES.CLI,
			clientDisplayName: resolveGatewayClientDisplayName(opts),
			clientVersion: opts.clientVersion ?? VERSION,
			platform: opts.platform,
			mode: opts.mode ?? GATEWAY_CLIENT_MODES.CLI,
			...opts.approvalRuntimeToken ? { approvalRuntimeToken: opts.approvalRuntimeToken } : {},
			...opts.agentRuntimeIdentityToken ? { agentRuntimeIdentityToken: opts.agentRuntimeIdentityToken } : {},
			role: "operator",
			...Array.isArray(scopes) ? { scopes } : {},
			deviceIdentity,
			...deviceAuthScope ? { deviceAuthScope } : {},
			...storedAuth ? { preparedDeviceAuth: storedAuth } : {},
			...opts.sharedStateMode ? { sharedStateMode: opts.sharedStateMode } : {},
			minProtocol: opts.minProtocol ?? 4,
			maxProtocol: opts.maxProtocol ?? 4,
			onHelloOk: (hello) => {
				if (timeoutMs === null && timer) {
					clearTimeout(timer);
					timer = void 0;
				}
				try {
					opts.onHelloOk?.(hello);
				} catch {}
				(async () => {
					try {
						ensureGatewaySupportsRequiredMethods({
							requiredMethods: opts.requiredMethods,
							methods: hello.features?.methods,
							attemptedMethod: opts.method
						});
						ensureGatewaySupportsRequiredCapabilities({
							requiredCapabilities: opts.requiredCapabilities,
							capabilities: hello.features?.capabilities,
							attemptedMethod: opts.method
						});
						const activeClient = client;
						if (!activeClient) throw new Error("gateway client not initialized");
						primaryRequestStarted = true;
						const result = await activeClient.request(opts.method, opts.params, {
							expectFinal: opts.expectFinal,
							timeoutMs: opts.timeoutMs,
							signal: opts.signal,
							onAccepted: opts.onAccepted
						});
						ignoreClose = true;
						stop(void 0, result);
					} catch (err) {
						ignoreClose = true;
						stop(err);
					}
				})();
			},
			onClose: (code, reason, info) => {
				if (settled || ignoreClose) return;
				if (info?.connectError) {
					ignoreClose = true;
					stop(isGatewayUnreachableSocketError(info.connectError) ? createGatewayUnreachableTransportError({
						cause: info.connectError,
						connectionDetails: params.connectionDetails
					}) : info.connectError);
					return;
				}
				if (!primaryRequestStarted && info?.transientPreHelloCleanClose === true && suppressedPreHelloCleanCloses < 1) {
					suppressedPreHelloCleanCloses += 1;
					return;
				}
				ignoreClose = true;
				stop(createGatewayCloseTransportError({
					code,
					reason,
					connectionDetails: params.connectionDetails
				}));
			},
			onConnectError: (err) => {
				const gatewayClientRequestError = err.name === "GatewayClientRequestError";
				const isAgentRuntimeIdentityConnectError = Boolean(opts.agentRuntimeIdentityToken) && isRequiredAgentRuntimeIdentityConnectError(err);
				const shouldSurface = isGatewayConnectAssemblyError(err) || isAgentRuntimeIdentityConnectError || isAllowlistedGatewayConnectRequestError(err) || surfaceGatewayClientRequestErrors && gatewayClientRequestError;
				if (settled || !shouldSurface) return;
				ignoreClose = true;
				stop(err);
			}
		});
		const wrapperTimeoutMs = timeoutMs ?? startupTimeoutMs;
		timer = setTimeout(() => {
			ignoreClose = true;
			stop(createGatewayTimeoutTransportError({
				timeoutMs: wrapperTimeoutMs,
				connectionDetails: params.connectionDetails
			}));
		}, safeTimerTimeoutMs);
		startGatewayClientWhenEventLoopReady(client, {
			timeoutMs: safeTimerTimeoutMs,
			signal: startAbort.signal
		}).then((readiness) => {
			if (settled || readiness.ready || readiness.aborted) return;
			ignoreClose = true;
			stop(createGatewayTimeoutTransportError({
				timeoutMs: startupTimeoutMs,
				connectionDetails: params.connectionDetails
			}));
		}).catch((err) => {
			if (settled) return;
			ignoreClose = true;
			stop(err instanceof Error ? err : new Error(String(err)));
		});
	});
}
async function callGatewayWithScopes(opts, scopes) {
	const context = await resolveGatewayCallContext(opts);
	const { timeoutMs, startupTimeoutMs, safeTimerTimeoutMs } = resolveGatewayCallTimeout(opts.timeoutMs);
	const urlOverrideSource = resolveGatewayUrlOverride({
		gatewayUrl: opts.url,
		env: process.env,
		ignoreEnvUrlOverride: opts.ignoreEnvUrlOverride,
		localPortOverride: opts.localPortOverride
	}).source;
	if (opts.requireLocalBackendSharedAuth && (urlOverrideSource || context.isRemoteMode)) throw new GatewayLocalBackendSharedAuthUnavailableError("local backend shared auth is limited to the configured local gateway");
	const requestedStoredDeviceAuth = opts.useStoredDeviceAuth === true;
	const hasExplicitAuth = Boolean(context.explicitAuth.token || context.explicitAuth.password);
	const useStoredDeviceAuth = requestedStoredDeviceAuth && !hasExplicitAuth;
	const bootstrap = await resolveGatewayClientBootstrap({
		config: context.config,
		gatewayUrl: opts.url,
		explicitAuth: context.explicitAuth,
		env: process.env,
		configPath: context.configPath,
		ignoreEnvUrlOverride: opts.localPortOverride !== void 0 || opts.ignoreEnvUrlOverride === true,
		localPortOverride: opts.localPortOverride,
		explicitTlsFingerprint: opts.tlsFingerprint,
		skipImplicitAuth: useStoredDeviceAuth,
		...useStoredDeviceAuth ? {} : { overrideAuthErrorHint: "Fix: pass --token or --password with --url (or gatewayToken in tools)." },
		buildConnectionDetails: buildGatewayConnectionDetails,
		resolveTlsFingerprint: async (params) => await resolveGatewayConnectionTlsFingerprint({
			...params,
			loadGatewayTlsRuntime
		})
	});
	ensureRemoteModeUrlConfigured({
		context,
		urlOverrideSource: bootstrap.urlOverrideSource
	});
	const connectionDetails = bootstrap.connectionDetails;
	const url = bootstrap.url;
	const deviceAuthScope = bootstrap.deviceAuthScope;
	const token = useStoredDeviceAuth ? void 0 : bootstrap.auth.token;
	const password = useStoredDeviceAuth ? void 0 : bootstrap.auth.password;
	const authMode = resolveGatewayCallAuth(context.config).mode;
	const omitDeviceIdentity = shouldOmitDeviceIdentityForGatewayCall({
		opts,
		url,
		authMode,
		token,
		password,
		allowAuthNone: opts.requireLocalBackendSharedAuth === true && authMode === "none"
	});
	if (opts.requireLocalBackendSharedAuth && !omitDeviceIdentity) throw new GatewayLocalBackendSharedAuthUnavailableError("local backend shared auth requires a loopback gateway with token/password credentials or auth mode none");
	const deviceIdentity = opts.deviceIdentity === void 0 ? omitDeviceIdentity ? null : resolveDeviceIdentityForGatewayCall(opts.sharedStateMode) : opts.deviceIdentity;
	let storedAuth;
	if (useStoredDeviceAuth) {
		storedAuth = loadStoredOperatorDeviceAuthToken(deviceIdentity, deviceAuthScope, opts.sharedStateMode);
		if (!storedAuth?.token && deviceAuthScope) throw new GatewayStoredDeviceAuthUnavailableError(["No stored device auth for this gateway origin.", `Run \`openclaw tui --url ${deviceAuthScope}\` to send a pairing request, approve it in that gateway's Control UI (Settings -> Devices) or run \`openclaw devices approve --latest\` on the gateway host, then retry.`].join("\n"));
	}
	const tlsFingerprint = bootstrap.tlsFingerprint;
	const edgeAuthConfig = normalizeEdgeAuthHeadersConfig(gatewayEdgeAuthValueForTarget({
		config: context.config,
		targetUrl: url
	}));
	const edgeAuthHeaders = await resolveEdgeAuthHeaders({
		config: context.config,
		value: edgeAuthConfig,
		targetUrl: url,
		env: process.env
	});
	if (useStoredDeviceAuth) {
		if (!storedAuth?.token) throw new GatewayCredentialsRequiredError({
			method: opts.method,
			configPath: context.configPath
		});
		if (Array.isArray(opts.requiredStoredDeviceAuthScopes) && !roleScopesAllow({
			role: "operator",
			requestedScopes: opts.requiredStoredDeviceAuthScopes,
			allowedScopes: storedAuth.scopes
		})) throw new GatewayStoredDeviceAuthUnavailableError("stored device auth does not grant the required operator scopes");
	}
	ensureGatewayCallCanAuthenticate({
		opts,
		context,
		token,
		password,
		deviceIdentity,
		deviceAuthScope,
		storedAuth
	});
	return await executeGatewayRequestWithScopes({
		opts,
		scopes: requestedStoredDeviceAuth && hasExplicitAuth && opts.requiredStoredDeviceAuthScopes ? opts.requiredStoredDeviceAuthScopes : useStoredDeviceAuth ? void 0 : scopes,
		url,
		token,
		password,
		edgeAuthHeaders,
		tlsFingerprint,
		timeoutMs,
		startupTimeoutMs,
		safeTimerTimeoutMs,
		connectionDetails,
		deviceIdentity,
		deviceAuthScope,
		...storedAuth ? { storedAuth } : {},
		surfaceGatewayClientRequestErrors: useStoredDeviceAuth || opts.requireLocalBackendSharedAuth === true || Boolean(opts.agentRuntimeIdentityToken)
	});
}
async function buildGatewayProbeConnectionDetails(opts = {}) {
	const context = await resolveGatewayCallContext({
		...opts,
		method: "status"
	});
	const bootstrap = await resolveGatewayClientBootstrap({
		config: context.config,
		gatewayUrl: opts.url,
		explicitAuth: context.explicitAuth,
		env: process.env,
		configPath: context.configPath,
		ignoreEnvUrlOverride: opts.localPortOverride !== void 0 || opts.ignoreEnvUrlOverride === true,
		localPortOverride: opts.localPortOverride,
		explicitTlsFingerprint: opts.tlsFingerprint,
		skipImplicitAuth: true,
		buildConnectionDetails: buildGatewayConnectionDetails,
		resolveTlsFingerprint: async (params) => await resolveGatewayConnectionTlsFingerprint({
			...params,
			loadGatewayTlsRuntime
		})
	});
	ensureRemoteModeUrlConfigured({
		context,
		urlOverrideSource: bootstrap.urlOverrideSource
	});
	return {
		...bootstrap.connectionDetails,
		...bootstrap.tlsFingerprint ? { tlsFingerprint: bootstrap.tlsFingerprint } : {}
	};
}
function shouldEscalateSessionCreateCwdScope(params) {
	if (params.opts.method !== "sessions.create" || !isRecord(params.opts.params) || !normalizeOptionalString(params.opts.params.cwd) || params.scopes.length !== 1 || params.scopes[0] !== "operator.write") return false;
	const missingScope = readMissingScopeErrorDetails((isRecord(params.error) ? params.error : void 0)?.details);
	return missingScope?.missingScope === "operator.admin" && missingScope.requiredScopes.includes("operator.admin");
}
async function callGatewayWithScopeEscalation(opts, scopes) {
	try {
		return await callGatewayWithScopes(opts, scopes);
	} catch (error) {
		if (!shouldEscalateSessionCreateCwdScope({
			opts,
			scopes,
			error
		})) throw error;
		return await callGatewayWithScopes(opts, [ADMIN_SCOPE]);
	}
}
async function callGatewayCli(opts) {
	if (Array.isArray(opts.scopes)) return await callGatewayWithScopes(opts, opts.scopes);
	return await callGatewayWithScopeEscalation(opts, isGatewayMethodClassified(opts.method) ? resolveLeastPrivilegeOperatorScopesForMethod(opts.method, opts.params) : CLI_DEFAULT_OPERATOR_SCOPES);
}
async function callGatewayLeastPrivilege(opts) {
	return await callGatewayWithScopeEscalation(opts, resolveLeastPrivilegeOperatorScopesForMethod(opts.method, opts.params));
}
async function callGateway(opts) {
	const callerMode = opts.mode ?? GATEWAY_CLIENT_MODES.BACKEND;
	const callerName = opts.clientName ?? GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT;
	if (callerMode === GATEWAY_CLIENT_MODES.CLI || callerName === GATEWAY_CLIENT_NAMES.CLI) return await callGatewayCli(opts);
	if (Array.isArray(opts.scopes)) return await callGatewayWithScopes({
		...opts,
		mode: callerMode,
		clientName: callerName
	}, opts.scopes);
	return await callGatewayLeastPrivilege({
		...opts,
		mode: callerMode,
		clientName: callerName
	});
}
function randomIdempotencyKey() {
	return randomUUID();
}
//#endregion
export { readGatewayDispatchConfig as _, buildGatewayProbeConnectionDetails as a, callGatewayLeastPrivilege as c, formatGatewayTransportErrorJson as d, isGatewayClientRequestError as f, randomIdempotencyKey as g, isImplicitLocalGatewayTarget as h, buildGatewayConnectionDetails as i, formatGatewayAuthErrorJson as l, isGatewayExplicitAuthRequiredError as m, GatewayLocalBackendSharedAuthUnavailableError as n, callGateway as o, isGatewayCredentialsRequiredError as p, GatewayStoredDeviceAuthUnavailableError as r, callGatewayCli as s, GatewayCredentialsRequiredError as t, formatGatewayClientRequestErrorJson as u, readGatewayDispatchConfigWithShellEnvFallback as v };
