import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { t as sleep } from "./sleep-D7nua6TP.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { n as getRuntimeConfig } from "./io-DlN5njvP.js";
import { n as VERSION } from "./version-CkBmshxX.js";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES, t as GATEWAY_CLIENT_CAPS } from "./client-info-UYcIi_5g.js";
import "./config-B2bSneS2.js";
import { a as readActiveGatewayLockPort } from "./gateway-lock-G9roAjek.js";
import { t as assertExplicitGatewayAuthModeWhenBothConfigured } from "./auth-mode-policy-DuqbQCOS.js";
import { r as resolveExplicitGatewayAuth } from "./credentials-CNWVqkD0.js";
import { t as ConnectErrorDetailCodes, u as readConnectErrorDetailCode } from "./connect-error-details-Dxf1zdDX.js";
import "./version-CwNT1gaY.js";
import { i as buildGatewayConnectionDetails } from "./call-Bwn2P4nz.js";
import { o as loadOriginDeviceToken } from "./device-auth-store-DVgrQui-.js";
import { n as loadDeviceIdentityIfPresent } from "./device-identity-UxfYyiX_.js";
import { r as roleScopesAllow } from "./operator-scope-compat-C7_b0yme.js";
import { t as gatewayOriginScope } from "./gateway-origin-scope-D4zHFrov.js";
import { i as resolveGatewayUrlOverride, r as resolveGatewayClientBootstrap } from "./client-bootstrap-PTj3BLWq.js";
import { t as startGatewayClientWhenEventLoopReady } from "./client-start-readiness-B1nULpha.js";
import { a as isRetryableGatewayStartupUnavailableError } from "./startup-unavailable-D0-EeFjq.js";
import { t as GatewayClient } from "./client-CtXLFRHL.js";
import { t as GatewayClientRequestError } from "./request-error-DOHu7KKj.js";
import { n as normalizeEdgeAuthHeadersConfig, r as resolveEdgeAuthHeaders, t as gatewayEdgeAuthValueForTarget } from "./edge-auth-DIfb3Zvn.js";
import { Cm as GATEWAY_SERVER_CAPS } from "./src-4dv5TpeQ.js";
import { randomUUID } from "node:crypto";
//#region src/tui/gateway-chat.ts
const STARTUP_CHAT_HISTORY_RETRY_TIMEOUT_MS = 6e4;
const STARTUP_CHAT_HISTORY_DEFAULT_RETRY_MS = 500;
const STARTUP_CHAT_HISTORY_MAX_RETRY_MS = 5e3;
function throwGatewayAuthResolutionError(reason) {
	throw new Error([
		reason,
		"Fix: set OPENCLAW_GATEWAY_TOKEN/OPENCLAW_GATEWAY_PASSWORD, pass --token/--password,",
		"or resolve the configured secret provider for this credential."
	].join("\n"));
}
function isRetryableStartupUnavailable(err, method) {
	if (!(err instanceof GatewayClientRequestError)) return false;
	if (err.gatewayCode !== "UNAVAILABLE" || !err.retryable) return false;
	const details = err.details;
	if (!details || typeof details !== "object") return true;
	const detailMethod = details.method;
	return typeof detailMethod !== "string" || detailMethod === method;
}
function resolveStartupRetryDelayMs(err) {
	const retryAfterMs = typeof err.retryAfterMs === "number" ? err.retryAfterMs : STARTUP_CHAT_HISTORY_DEFAULT_RETRY_MS;
	return Math.min(Math.max(retryAfterMs, 100), STARTUP_CHAT_HISTORY_MAX_RETRY_MS);
}
function hasStoredOriginDeviceAuth(deviceAuthScope) {
	try {
		const identity = loadDeviceIdentityIfPresent();
		return Boolean(identity && loadOriginDeviceToken({
			gatewayScope: deviceAuthScope,
			deviceId: identity.deviceId,
			role: "operator"
		})?.token);
	} catch {
		return false;
	}
}
function isLegacyPreserveSideRunsError(err) {
	if (!(err instanceof GatewayClientRequestError) || err.gatewayCode !== "INVALID_REQUEST") return false;
	const message = err.message.toLowerCase();
	return message.includes("invalid chat.abort params") && message.includes("preservesideruns");
}
function isLegacySucceedsParentError(err) {
	if (!(err instanceof GatewayClientRequestError) || err.gatewayCode !== "INVALID_REQUEST") return false;
	const message = err.message.toLowerCase();
	return message.includes("invalid sessions.create params") && message.includes("succeedsparent");
}
var GatewayChatClient = class GatewayChatClient {
	constructor(connection) {
		this.historyLifetime = new AbortController();
		this.connection = connection;
		this.readyPromise = new Promise((resolve) => {
			this.resolveReady = resolve;
		});
		this.client = new GatewayClient({
			url: connection.url,
			...connection.deviceAuthScope ? { deviceAuthScope: connection.deviceAuthScope } : {},
			token: connection.token,
			password: connection.password,
			edgeAuthHeaders: connection.edgeAuthHeaders,
			tlsFingerprint: connection.tlsFingerprint,
			preauthHandshakeTimeoutMs: connection.preauthHandshakeTimeoutMs,
			clientName: GATEWAY_CLIENT_NAMES.TUI,
			clientDisplayName: "openclaw-tui",
			clientVersion: VERSION,
			platform: process.platform,
			mode: GATEWAY_CLIENT_MODES.UI,
			scopes: [
				"operator.admin",
				"operator.read",
				"operator.write",
				"operator.approvals"
			],
			caps: [
				GATEWAY_CLIENT_CAPS.AGENT_KIND,
				GATEWAY_CLIENT_CAPS.PLUGIN_APPROVALS,
				GATEWAY_CLIENT_CAPS.TASK_SUGGESTIONS,
				GATEWAY_CLIENT_CAPS.TOOL_EVENTS
			],
			instanceId: randomUUID(),
			minProtocol: 4,
			maxProtocol: 4,
			notifyOnStartupRetry: true,
			onHelloOk: (hello) => {
				this.pendingConnectError = void 0;
				this.hello = hello;
				this.resolveReady?.();
				this.onConnected?.();
			},
			onEvent: (evt) => {
				this.onEvent?.({
					event: evt.event,
					payload: evt.payload,
					seq: evt.seq
				});
			},
			onClose: (_code, reason) => {
				this.readyPromise = new Promise((resolve) => {
					this.resolveReady = resolve;
				});
				if (this.pendingConnectError && this.onConnectError) {
					this.pendingConnectError = void 0;
					return;
				}
				this.onDisconnected?.(reason);
			},
			onConnectError: (error) => this.notifyConnectError(error),
			onGap: (info) => {
				this.onGap?.(info);
			}
		});
	}
	static async connect(opts) {
		const connection = await resolveGatewayConnection(opts);
		return new GatewayChatClient(connection);
	}
	/** Connect to a target already selected and authenticated by a preceding Gateway probe. */
	static async connectBound(opts) {
		return new GatewayChatClient(await resolveBoundGatewayConnection(opts));
	}
	start() {
		startGatewayClientWhenEventLoopReady(this.client, { clientOptions: { preauthHandshakeTimeoutMs: this.connection.preauthHandshakeTimeoutMs } }).then((readiness) => {
			if (!readiness.ready && !readiness.aborted) this.notifyUnclosedConnectError(/* @__PURE__ */ new Error("gateway event loop readiness timeout"));
		}).catch((err) => {
			this.notifyUnclosedConnectError(err instanceof Error ? err : new Error(String(err)));
		});
	}
	notifyConnectError(error) {
		if (this.pendingConnectError) return;
		if (isRetryableGatewayStartupUnavailableError(error)) return;
		if (this.connection.deviceAuthScope && readConnectErrorDetailCode(error.details) === ConnectErrorDetailCodes.PAIRING_REQUIRED && !error.message.includes("Pairing request sent.")) error.message = [error.message, "Pairing request sent. Approve it in that gateway's Control UI (Settings -> Devices), or run `openclaw devices approve --latest` on the gateway host, then retry."].join("\n");
		this.pendingConnectError = error;
		this.onConnectError?.(error);
	}
	notifyUnclosedConnectError(error) {
		const hasStructuredHandler = Boolean(this.onConnectError);
		this.notifyConnectError(error);
		if (!hasStructuredHandler) this.onDisconnected?.(error.message);
	}
	stop() {
		this.historyLifetime.abort();
		return this.client.stopAndWait();
	}
	async subscribeSessionEvents() {
		return await this.client.request("sessions.subscribe", {});
	}
	async waitForReady() {
		await this.readyPromise;
	}
	async sendChat(opts) {
		const runId = opts.runId ?? randomUUID();
		const response = await this.client.request("chat.send", {
			sessionKey: opts.sessionKey,
			...opts.agentId ? { agentId: opts.agentId } : {},
			...opts.sessionId ? { sessionId: opts.sessionId } : {},
			message: opts.message,
			thinking: opts.thinking,
			deliver: opts.deliver,
			timeoutMs: opts.timeoutMs,
			idempotencyKey: runId
		});
		const acceptedRunId = normalizeOptionalString(response?.runId) ?? runId;
		const status = normalizeOptionalString(response?.status);
		return status ? {
			runId: acceptedRunId,
			status
		} : { runId: acceptedRunId };
	}
	async abortChat(opts) {
		const params = {
			sessionKey: opts.sessionKey,
			...opts.agentId ? { agentId: opts.agentId } : {},
			...opts.runId ? { runId: opts.runId } : {}
		};
		if (opts.runId) return await this.client.request("chat.abort", params);
		try {
			return await this.client.request("chat.abort", {
				...params,
				preserveSideRuns: true
			});
		} catch (err) {
			if (!isLegacyPreserveSideRunsError(err)) throw err;
			return await this.client.request("chat.abort", params);
		}
	}
	async loadHistory(opts) {
		const deadline = Date.now() + STARTUP_CHAT_HISTORY_RETRY_TIMEOUT_MS;
		for (;;) {
			this.historyLifetime.signal.throwIfAborted();
			try {
				return await this.client.request("chat.history", {
					sessionKey: opts.sessionKey,
					...opts.agentId ? { agentId: opts.agentId } : {},
					limit: opts.limit
				});
			} catch (err) {
				if (Date.now() >= deadline || !isRetryableStartupUnavailable(err, "chat.history")) throw err;
				await sleep(resolveStartupRetryDelayMs(err), this.historyLifetime.signal);
			}
		}
	}
	async listSessions(opts) {
		return await this.client.request("sessions.list", opts ?? {});
	}
	async resolveSession(opts) {
		return await this.client.request("sessions.resolve", opts);
	}
	async listAgents() {
		return await this.client.request("agents.list", {});
	}
	async patchSession(opts) {
		return await this.client.request("sessions.patch", opts);
	}
	async createSession(opts) {
		const params = {
			...opts,
			emitCommandHooks: Boolean(opts.parentSessionKey)
		};
		try {
			return await this.client.request("sessions.create", params);
		} catch (err) {
			if (opts.succeedsParent === void 0 || !isLegacySucceedsParentError(err)) throw err;
			const { succeedsParent: _succeedsParent, ...legacyParams } = params;
			if (!opts.succeedsParent) {
				const { parentSessionKey: _parentSessionKey, emitCommandHooks: _emitCommandHooks, ...parallelParams } = legacyParams;
				return await this.client.request("sessions.create", parallelParams);
			}
			return await this.client.request("sessions.create", legacyParams);
		}
	}
	async resetSession(key, reason, opts) {
		return await this.client.request("sessions.reset", {
			key,
			...opts?.agentId ? { agentId: opts.agentId } : {},
			...reason ? { reason } : {}
		});
	}
	async getGatewayStatus() {
		return await this.client.request("status");
	}
	async listModels(opts) {
		const res = await this.client.request("models.list", opts ?? {});
		return Array.isArray(res?.models) ? res.models : [];
	}
	async listCommands(opts) {
		const res = await this.client.request("commands.list", opts ?? {});
		return Array.isArray(res?.commands) ? res.commands : [];
	}
	async listPluginApprovals() {
		return await this.client.request("plugin.approval.list", {});
	}
	async resolvePluginApproval(id, decision) {
		return await this.client.request("plugin.approval.resolve", {
			id,
			decision
		});
	}
	getTaskSuggestionActionCapabilities() {
		const auth = this.hello?.auth;
		const methods = this.hello?.features?.methods;
		const capabilities = this.hello?.features?.capabilities;
		const allows = (method, scope) => Array.isArray(methods) && methods.includes(method) && Boolean(auth && roleScopesAllow({
			role: auth.role,
			requestedScopes: [scope],
			allowedScopes: auth.scopes
		}));
		return {
			canAccept: allows("taskSuggestions.accept", "operator.admin"),
			canAcceptModes: Array.isArray(capabilities) && capabilities.includes(GATEWAY_SERVER_CAPS.TASK_SUGGESTIONS_ACCEPT_MODES),
			canDismiss: allows("taskSuggestions.dismiss", "operator.write")
		};
	}
	async listTaskSuggestions() {
		if (this.hello?.features?.methods?.includes("taskSuggestions.list") !== true) return [];
		const actions = this.getTaskSuggestionActionCapabilities();
		if (!actions.canAccept && !actions.canDismiss) return [];
		return (await this.client.request("taskSuggestions.list", {})).suggestions;
	}
	async listCloudWorkerProfiles() {
		if (this.hello?.features?.methods?.includes("environments.list") !== true) return [];
		try {
			return (await this.client.request("environments.list", {})).profiles?.map((profile) => profile.id) ?? [];
		} catch {
			return [];
		}
	}
	async acceptTaskSuggestion(taskId, mode, cloudProfileId) {
		const params = !mode || mode === "worktree" ? { taskId } : {
			taskId,
			mode,
			...cloudProfileId ? { cloudProfileId } : {}
		};
		return await this.client.request("taskSuggestions.accept", params);
	}
	async dismissTaskSuggestion(taskId) {
		return await this.client.request("taskSuggestions.dismiss", { taskId });
	}
};
/**
* Preserve a pre-probed Gateway route across an in-process handoff. This path
* deliberately ignores global config and Gateway env overrides, including
* credentials, while still applying the normal remote URL safety policy.
*/
async function resolveBoundGatewayConnection(opts) {
	const url = buildGatewayConnectionDetails({
		config: opts.config,
		url: opts.url,
		ignoreEnvUrlOverride: true
	}).url;
	const explicitAuth = resolveExplicitGatewayAuth({
		token: opts.token,
		password: opts.password
	});
	const edgeAuthConfig = normalizeEdgeAuthHeadersConfig(gatewayEdgeAuthValueForTarget({
		config: opts.config,
		targetUrl: url
	}));
	const edgeAuthHeaders = await resolveEdgeAuthHeaders({
		config: opts.config,
		value: edgeAuthConfig,
		targetUrl: url,
		env: process.env
	});
	return {
		url,
		deviceAuthScope: gatewayOriginScope(url),
		token: explicitAuth.token,
		password: explicitAuth.password,
		...edgeAuthHeaders ? { edgeAuthHeaders } : {},
		...opts.tlsFingerprint ? { tlsFingerprint: opts.tlsFingerprint } : {}
	};
}
async function resolveGatewayConnection(opts) {
	const config = getRuntimeConfig();
	const env = process.env;
	const gatewayAuthMode = config.gateway?.auth?.mode;
	const isRemoteMode = config.gateway?.mode === "remote";
	const urlOverride = resolveGatewayUrlOverride({
		gatewayUrl: opts.url,
		env
	});
	const explicitAuth = resolveExplicitGatewayAuth({
		token: opts.token,
		password: opts.password
	});
	const hasExplicitGatewayTarget = Boolean(urlOverride.url || env.OPENCLAW_GATEWAY_PORT?.trim() || isRemoteMode);
	const resumeMayMatchLocalTarget = opts.allowConfiguredAuthForExactTarget === true && urlOverride.source === "cli" && !isRemoteMode && !env.OPENCLAW_GATEWAY_PORT?.trim();
	const activeLocalGatewayPort = !hasExplicitGatewayTarget || resumeMayMatchLocalTarget ? await readActiveGatewayLockPort() : void 0;
	if (!urlOverride.source && gatewayAuthMode !== "none" && gatewayAuthMode !== "trusted-proxy" && !isRemoteMode) try {
		assertExplicitGatewayAuthModeWhenBothConfigured(config);
	} catch (err) {
		throwGatewayAuthResolutionError(formatErrorMessage(err));
	}
	const bootstrap = await resolveGatewayClientBootstrap({
		config,
		gatewayUrl: urlOverride.source === "cli" ? urlOverride.url : void 0,
		explicitAuth,
		env,
		authPolicy: "interactive",
		allowConfiguredAuthForExactTarget: opts.allowConfiguredAuthForExactTarget,
		suppressEnvAuthFallback: opts.suppressEnvAuthFallback,
		...activeLocalGatewayPort ? { localPortOverride: activeLocalGatewayPort } : {},
		explicitTlsFingerprint: opts.tlsFingerprint,
		allowStoredOriginAuth: hasStoredOriginDeviceAuth,
		overrideAuthErrorHint: "Fix: pass --token or --password once to request pairing, approve it in that gateway's Control UI (Settings -> Devices), then retry with the same credential so OpenClaw can store the device token.",
		buildConnectionDetails: buildGatewayConnectionDetails
	});
	const hasStoredOriginAuth = Boolean(bootstrap.deviceAuthScope && hasStoredOriginDeviceAuth(bootstrap.deviceAuthScope));
	const missingSharedAuth = bootstrap.authFailureReason === "Missing gateway auth credentials." || bootstrap.authFailureReason === "Missing gateway auth token." || bootstrap.authFailureReason === "Missing gateway auth password.";
	if (bootstrap.authFailureReason && (!missingSharedAuth || !hasStoredOriginAuth)) throwGatewayAuthResolutionError(bootstrap.authFailureReason);
	const edgeAuthHeaders = await resolveEdgeAuthHeaders({
		config,
		value: normalizeEdgeAuthHeadersConfig(gatewayEdgeAuthValueForTarget({
			config,
			targetUrl: bootstrap.url
		})),
		targetUrl: bootstrap.url,
		env
	});
	return {
		url: bootstrap.url,
		deviceAuthScope: bootstrap.deviceAuthScope,
		token: bootstrap.auth.token,
		password: bootstrap.auth.password,
		...edgeAuthHeaders ? { edgeAuthHeaders } : {},
		...bootstrap.tlsFingerprint ? { tlsFingerprint: bootstrap.tlsFingerprint } : {}
	};
}
//#endregion
export { GatewayChatClient };
