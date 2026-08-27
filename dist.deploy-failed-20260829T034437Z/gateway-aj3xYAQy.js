import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { r as asNullableRecord } from "./record-coerce-DItp3I4t.js";
import { _ as resolveGatewayPort } from "./paths-BBSTUjD5.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { n as getRuntimeConfig } from "./io-DlN5njvP.js";
import { o as getActiveAgentRunDelegatedAuthority } from "./agent-run-registry-t4kvUyNQ.js";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-UYcIi_5g.js";
import "./config-B2bSneS2.js";
import { r as trimToUndefined } from "./credential-planner-Cyn3ajET.js";
import { i as resolveGatewayCredentialsFromConfig } from "./credentials-CNWVqkD0.js";
import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { o as callGateway } from "./call-Bwn2P4nz.js";
import { n as loadDeviceIdentityIfPresent, r as loadOrCreateDeviceIdentity } from "./device-identity-UxfYyiX_.js";
import { s as resolveLeastPrivilegeOperatorScopesForMethod } from "./method-scopes-BTnJZEGh.js";
import { _ as readToolStringParam, p as readPositiveIntegerParam } from "./common-CI1GnPjt.js";
import { r as getGatewayToolCallerIdentity } from "./gateway-caller-context-D1DYQtHE.js";
import { o as createAgentRuntimeExecutionLineageHandoff, r as mintAgentRuntimeIdentityToken, s as readAgentRuntimeExecutionLineage } from "./agent-runtime-identity-token-BLnwLnqH.js";
import { r as resolveMessageActionTurnCapability } from "./message-action-turn-capability-CLlRwpDl.js";
import { t as getOperatorApprovalRuntimeToken } from "./operator-approval-runtime-token-XOu_Hz9m.js";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/tools/gateway-session-spawn-context.ts
const sessionSpawnContext = new AsyncLocalStorage();
/** Scope signed session-creation authority to one local Gateway tool call. */
function runWithGatewaySessionSpawnContext(context, run) {
	return sessionSpawnContext.run(context, run);
}
function getGatewaySessionSpawnContext() {
	return sessionSpawnContext.getStore();
}
//#endregion
//#region src/agents/tools/gateway-session-spawn-execution-identity.ts
const parentExecutionIdentityToken = new AsyncLocalStorage();
/** Scope exact parent evidence to the same local Gateway call as spawn authority. */
function runWithGatewaySessionSpawnParentExecutionIdentity(token, run) {
	return token ? parentExecutionIdentityToken.run(token, run) : run();
}
function getGatewaySessionSpawnParentExecutionIdentityToken() {
	return parentExecutionIdentityToken.getStore();
}
//#endregion
//#region src/agents/tools/gateway.ts
/**
* Gateway call helpers for built-in tools.
*
* Resolves gateway URL/token overrides, local credentials, and least-privilege operator scopes.
*/
/** Reads common gateway options from tool parameters while preserving explicit token whitespace. */
function readGatewayCallOptions(params) {
	return {
		gatewayUrl: readToolStringParam(params, "gatewayUrl", { trim: false }),
		gatewayToken: readToolStringParam(params, "gatewayToken", { trim: false }),
		timeoutMs: readPositiveIntegerParam(params, "timeoutMs")
	};
}
/**
* Canonicalizes websocket URLs for allowlist comparisons without retaining paths or credentials.
*/
function canonicalizeToolGatewayWsUrl(raw) {
	const input = raw.trim();
	let url;
	try {
		url = new URL(input);
	} catch (error) {
		const message = formatErrorMessage(error);
		throw new Error(`invalid gatewayUrl: ${input} (${message})`, { cause: error });
	}
	if (url.protocol !== "ws:" && url.protocol !== "wss:") throw new Error(`invalid gatewayUrl protocol: ${url.protocol} (expected ws:// or wss://)`);
	if (url.username || url.password) throw new Error("invalid gatewayUrl: credentials are not allowed");
	if (url.search || url.hash) throw new Error("invalid gatewayUrl: query/hash not allowed");
	if (url.pathname && url.pathname !== "/") throw new Error("invalid gatewayUrl: path not allowed");
	return {
		origin: url.origin,
		key: `${url.protocol}//${normalizeLowercaseStringOrEmpty(url.host)}`
	};
}
function resolveLocalGatewayUrlKeys(cfg) {
	const port = resolveGatewayPort(cfg);
	return /* @__PURE__ */ new Set([
		`ws://127.0.0.1:${port}`,
		`wss://127.0.0.1:${port}`,
		`ws://localhost:${port}`,
		`wss://localhost:${port}`,
		`ws://[::1]:${port}`,
		`wss://[::1]:${port}`
	]);
}
function resolveConfiguredRemoteGatewayKey(cfg) {
	let remoteKey;
	const remoteUrl = normalizeOptionalString(cfg.gateway?.remote?.url) ?? "";
	if (remoteUrl) try {
		remoteKey = canonicalizeToolGatewayWsUrl(remoteUrl).key;
	} catch {}
	return remoteKey;
}
function resolveDefaultGatewayTarget(params) {
	if (params.envGatewayUrl) return "remote";
	if (params.cfg.gateway?.mode === "remote" && normalizeOptionalString(params.cfg.gateway.remote?.url)) return "remote";
	return "local";
}
function validateGatewayUrlOverrideForAgentTools(params) {
	const { cfg } = params;
	const localAllowed = resolveLocalGatewayUrlKeys(cfg);
	const remoteKey = resolveConfiguredRemoteGatewayKey(cfg);
	const parsed = canonicalizeToolGatewayWsUrl(params.urlOverride);
	if (localAllowed.has(parsed.key)) return {
		url: parsed.origin,
		target: "local"
	};
	if (remoteKey && parsed.key === remoteKey) return {
		url: parsed.origin,
		target: "remote"
	};
	const port = resolveGatewayPort(cfg);
	throw new Error([
		"gatewayUrl override rejected.",
		`Allowed: ws(s) loopback on port ${port} (127.0.0.1/localhost/[::1])`,
		"Or: configure gateway.remote.url and omit gatewayUrl to use the configured remote gateway."
	].join(" "));
}
function resolveGatewayOverrideToken(params) {
	if (params.explicitToken) return params.explicitToken;
	return resolveGatewayCredentialsFromConfig({
		cfg: params.cfg,
		env: process.env,
		modeOverride: params.target,
		remoteTokenFallback: params.target === "remote" ? "remote-only" : "remote-env-local",
		remotePasswordFallback: params.target === "remote" ? "remote-only" : "remote-env-local"
	}).token;
}
/**
* Resolves the gateway URL, token, and timeout for agent tool calls.
*/
function resolveGatewayOptions(opts) {
	const cfg = getRuntimeConfig();
	const validatedOverride = trimToUndefined(opts?.gatewayUrl) !== void 0 ? validateGatewayUrlOverrideForAgentTools({
		cfg,
		urlOverride: String(opts?.gatewayUrl)
	}) : void 0;
	const explicitToken = trimToUndefined(opts?.gatewayToken);
	const token = validatedOverride ? resolveGatewayOverrideToken({
		cfg,
		target: validatedOverride.target,
		explicitToken
	}) : explicitToken;
	const timeoutMs = typeof opts?.timeoutMs === "number" && Number.isFinite(opts.timeoutMs) ? Math.max(1, Math.floor(opts.timeoutMs)) : 3e4;
	const envGatewayUrl = trimToUndefined(process.env.OPENCLAW_GATEWAY_URL);
	const target = validatedOverride?.target ?? resolveDefaultGatewayTarget({
		cfg,
		envGatewayUrl
	});
	return {
		url: validatedOverride?.url,
		token,
		timeoutMs,
		target
	};
}
const APPROVAL_RUNTIME_METHODS = /* @__PURE__ */ new Set([
	"exec.approval.request",
	"exec.approval.resolve",
	"exec.approval.waitDecision",
	"plugin.approval.request",
	"plugin.approval.waitDecision"
]);
const AGENT_RUNTIME_IDENTITY_METHODS = /* @__PURE__ */ new Set([
	"exec.approval.request",
	"plugin.approval.request",
	"wake",
	"cron.list",
	"cron.get",
	"cron.add",
	"cron.update",
	"cron.remove",
	"cron.run",
	"cron.runs",
	"secrets.store.delete"
]);
const OPTIONAL_LOCAL_AGENT_RUNTIME_IDENTITY_METHODS = /* @__PURE__ */ new Set(["node.invoke"]);
function resolveApprovalRuntimeTokenForGatewayTool(params) {
	if (!APPROVAL_RUNTIME_METHODS.has(params.method)) return;
	if (trimToUndefined(params.opts.gatewayUrl) !== void 0) return;
	if (params.target !== "local") return;
	return getOperatorApprovalRuntimeToken();
}
function isApprovalReplayNodeSystemRun(method, callParams) {
	const invoke = method === "node.invoke" ? asNullableRecord(callParams) : null;
	const run = invoke?.command === "system.run" ? asNullableRecord(invoke.params) : null;
	const decision = normalizeOptionalString(run?.approvalDecision);
	return run?.approved === true || decision === "allow-once" || decision === "allow-always";
}
function attachNodeInvokeTurnSource(method, params) {
	if (method !== "node.invoke") return params;
	const invoke = asNullableRecord(params);
	const caller = getGatewayToolCallerIdentity();
	if (!invoke || !caller) return params;
	return {
		...omitNodeInvokeTurnSource(invoke),
		...caller.turnSourceChannel ? { turnSourceChannel: caller.turnSourceChannel } : {},
		...caller.turnSourceTo ? { turnSourceTo: caller.turnSourceTo } : {},
		...caller.turnSourceAccountId ? { turnSourceAccountId: caller.turnSourceAccountId } : {},
		...caller.turnSourceThreadId !== void 0 ? { turnSourceThreadId: caller.turnSourceThreadId } : {}
	};
}
function omitNodeInvokeTurnSource(invoke) {
	const legacyParams = { ...invoke };
	delete legacyParams.turnSourceChannel;
	delete legacyParams.turnSourceTo;
	delete legacyParams.turnSourceAccountId;
	delete legacyParams.turnSourceThreadId;
	return legacyParams;
}
function stripNodeInvokeTurnSource(params) {
	const invoke = asNullableRecord(params);
	return invoke ? omitNodeInvokeTurnSource(invoke) : params;
}
function resolveApprovalRequesterDeviceIdentityForGatewayTool(params) {
	const isApprovalRuntimeMethod = APPROVAL_RUNTIME_METHODS.has(params.method);
	const isNodeApprovalReplay = isApprovalReplayNodeSystemRun(params.method, params.callParams);
	if (!isApprovalRuntimeMethod && !isNodeApprovalReplay) return;
	if (isApprovalRuntimeMethod && trimToUndefined(params.opts.gatewayUrl) !== void 0) return;
	if (params.approvalRuntimeToken !== void 0) return;
	try {
		if (isNodeApprovalReplay) {
			const identity = loadDeviceIdentityIfPresent();
			if (!identity) throw new Error("device identity is not persisted");
			return identity;
		}
		return loadOrCreateDeviceIdentity();
	} catch (error) {
		if (isNodeApprovalReplay) throw new Error(["approved node gateway calls require a stable device identity.", "Fix the OpenClaw state directory permissions and retry the approval."].join(" "), { cause: error });
		throw new Error(["remote approval gateway calls require a stable device identity.", "Fix the OpenClaw state directory permissions or use the local approval-runtime gateway."].join(" "), { cause: error });
	}
}
async function resolveAgentRuntimeIdentityTokenForGatewayTool(params) {
	const optionalLocalIdentity = OPTIONAL_LOCAL_AGENT_RUNTIME_IDENTITY_METHODS.has(params.method);
	if (!params.required && !AGENT_RUNTIME_IDENTITY_METHODS.has(params.method) && !optionalLocalIdentity) return;
	const identity = getGatewayToolCallerIdentity();
	if (!identity) {
		if (params.required) throw new Error("trusted agent runtime identity required for this gateway call");
		return;
	}
	const hasGatewayUrlOverride = trimToUndefined(params.opts.gatewayUrl) !== void 0;
	const hasGatewayTokenOverride = trimToUndefined(params.opts.gatewayToken) !== void 0;
	if (hasGatewayUrlOverride || hasGatewayTokenOverride || params.target !== "local") {
		if (optionalLocalIdentity && !params.required) return;
		throw new Error("agent gateway calls require the trusted local gateway context");
	}
	if (identity.signedAgentRuntimeIdentityToken) return identity.signedAgentRuntimeIdentityToken;
	if (!identity.operationalRunInstance) {
		if (optionalLocalIdentity && !params.required) return;
		throw new Error("trusted operational run instance required for this gateway call");
	}
	try {
		const sessionSpawnContext = getGatewaySessionSpawnContext();
		const parentExecutionIdentityToken = getGatewaySessionSpawnParentExecutionIdentityToken();
		const activeAuthority = getActiveAgentRunDelegatedAuthority(identity.operationalRunInstance);
		const executionLineage = readAgentRuntimeExecutionLineage(sessionSpawnContext);
		if (executionLineage && !activeAuthority) throw new Error("execution lineage handoff requires active parent authority");
		const lineageHandoff = sessionSpawnContext && executionLineage && activeAuthority ? createAgentRuntimeExecutionLineageHandoff({
			agentId: identity.agentId,
			sessionKey: identity.sessionKey,
			operationalRunInstance: identity.operationalRunInstance,
			delegatedAuthority: activeAuthority,
			...parentExecutionIdentityToken ? { executionIdentity: parentExecutionIdentityToken } : {},
			sessionSpawnContext
		}) : void 0;
		if (executionLineage && !lineageHandoff) throw new Error("execution lineage handoff could not bind the parent admission");
		try {
			return await mintAgentRuntimeIdentityToken({
				...identity,
				operationalRunInstance: identity.operationalRunInstance,
				...lineageHandoff ? { executionIdentityToken: void 0 } : {},
				...lineageHandoff ? { executionLineageHandoffId: lineageHandoff.id } : sessionSpawnContext ? {
					executionIdentityToken: parentExecutionIdentityToken,
					sessionSpawnContext
				} : {}
			});
		} catch (error) {
			lineageHandoff?.revoke();
			throw error;
		}
	} catch (error) {
		if (optionalLocalIdentity && !params.required) return;
		throw error;
	}
}
async function resolveMessageActionAgentRuntimeIdentityToken(params) {
	const terminalSourceReply = params.sourceReplyFinal === true;
	const sourceReplyToolCallId = normalizeOptionalString(params.sourceReplyToolCallId);
	if (terminalSourceReply && !sourceReplyToolCallId) throw new Error("terminal source reply requires tool-call correlation");
	const identity = getGatewayToolCallerIdentity();
	if (!identity) {
		if (terminalSourceReply) throw new Error("terminal source reply requires trusted agent runtime identity");
		return;
	}
	const hasGatewayUrlOverride = trimToUndefined(params.opts.gatewayUrl) !== void 0;
	const hasGatewayTokenOverride = trimToUndefined(params.opts.gatewayToken) !== void 0;
	const usesUntrustedGatewayContext = hasGatewayUrlOverride || hasGatewayTokenOverride || params.target !== "local";
	if (usesUntrustedGatewayContext && !terminalSourceReply) return;
	const turnCapabilitySessionKey = normalizeOptionalString(params.turnCapabilitySessionKey) ?? identity.sessionKey;
	const messageActionContext = resolveMessageActionTurnCapability({
		token: params.turnCapability,
		agentId: identity.agentId,
		runId: params.runId,
		sessionKey: turnCapabilitySessionKey,
		sessionId: params.sessionId
	});
	if (!messageActionContext) {
		if (terminalSourceReply) throw new Error("terminal source reply requires an active turn capability");
		return;
	}
	if (terminalSourceReply && !normalizeOptionalString(messageActionContext.toolContext?.currentSourceTurnId)) throw new Error("terminal source reply requires source-turn correlation");
	if (usesUntrustedGatewayContext) {
		if (params.callerOwnsTerminalReceipt !== true) throw new Error("terminal source reply requires the trusted local gateway context");
		return;
	}
	if (!identity.operationalRunInstance) {
		if (terminalSourceReply) throw new Error("terminal source reply requires a trusted operational run instance");
		return;
	}
	const resolvedMessageActionContext = terminalSourceReply ? {
		...messageActionContext,
		turnCapability: params.turnCapability,
		sourceReplyFinal: true,
		sourceReplyToolCallId
	} : {
		...messageActionContext,
		turnCapability: params.turnCapability,
		...params.sourceReplyFinal === false ? { sourceReplyFinal: false } : {},
		...sourceReplyToolCallId ? { sourceReplyToolCallId } : {}
	};
	return await mintAgentRuntimeIdentityToken({
		...identity,
		sessionKey: turnCapabilitySessionKey,
		operationalRunInstance: identity.operationalRunInstance,
		messageActionContext: resolvedMessageActionContext
	});
}
function isStaleGatewayAgentRuntimeIdentityRejection(error) {
	const message = formatErrorMessage(error);
	if (message.includes("gateway rejected required agent runtime identity auth field; refusing to retry without it")) return true;
	return message.includes("invalid connect params") && message.includes("/auth") && message.includes("unexpected property 'agentRuntimeIdentityToken'");
}
function isStaleGatewayNodeInvokeTurnSourceRejection(error) {
	if (!(error instanceof Error) || error.name !== "GatewayClientRequestError") return false;
	const requestError = error;
	if (requestError.gatewayCode !== ErrorCodes.INVALID_REQUEST) return false;
	if (asNullableRecord(requestError.details)?.nodeCommandDispatched !== false) return false;
	const message = formatErrorMessage(error);
	if (!message.includes("invalid node.invoke params:")) return false;
	return [
		"turnSourceChannel",
		"turnSourceTo",
		"turnSourceAccountId",
		"turnSourceThreadId"
	].some((field) => message.includes(`unexpected property '${field}'`));
}
function staleGatewayAgentRuntimeIdentityError(cause) {
	return new Error(["The running Gateway is from an older OpenClaw build and rejected current agent runtime connection metadata.", "Restart the Gateway with `openclaw gateway restart`, then retry."].join(" "), { cause });
}
/**
* Calls a gateway method as the agent-tool backend client with least-privilege scopes.
*/
async function callGatewayTool(method, opts, params, extra) {
	const gateway = resolveGatewayOptions(opts);
	const callParams = attachNodeInvokeTurnSource(method, params);
	const scopes = Array.isArray(extra?.scopes) ? extra.scopes : resolveLeastPrivilegeOperatorScopesForMethod(method, callParams);
	const approvalRuntimeToken = resolveApprovalRuntimeTokenForGatewayTool({
		method,
		opts,
		target: gateway.target
	});
	const agentRuntimeIdentityToken = await resolveAgentRuntimeIdentityTokenForGatewayTool({
		method,
		opts,
		target: gateway.target,
		required: extra?.requireAgentRuntimeIdentity
	});
	const deviceIdentity = resolveApprovalRequesterDeviceIdentityForGatewayTool({
		method,
		callParams,
		opts,
		approvalRuntimeToken
	});
	const callOptions = {
		url: gateway.url,
		token: gateway.token,
		method,
		params: callParams,
		timeoutMs: gateway.timeoutMs,
		signal: extra?.signal,
		expectFinal: extra?.expectFinal,
		clientName: GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT,
		clientDisplayName: "agent",
		mode: GATEWAY_CLIENT_MODES.BACKEND,
		...approvalRuntimeToken ? { approvalRuntimeToken } : {},
		...agentRuntimeIdentityToken ? { agentRuntimeIdentityToken } : {},
		...deviceIdentity ? { deviceIdentity } : {},
		scopes
	};
	try {
		return await callGateway(callOptions);
	} catch (error) {
		if (method === "node.invoke" && isStaleGatewayNodeInvokeTurnSourceRejection(error)) return await callGateway({
			...callOptions,
			params: stripNodeInvokeTurnSource(callOptions.params)
		});
		if (agentRuntimeIdentityToken && isStaleGatewayAgentRuntimeIdentityRejection(error)) {
			if (method === "node.invoke" && extra?.requireAgentRuntimeIdentity !== true) return await callGateway({
				...callOptions,
				params: stripNodeInvokeTurnSource(callOptions.params),
				agentRuntimeIdentityToken: void 0
			});
			throw staleGatewayAgentRuntimeIdentityError(error);
		}
		throw error;
	}
}
//#endregion
export { runWithGatewaySessionSpawnParentExecutionIdentity as a, resolveMessageActionAgentRuntimeIdentityToken as i, readGatewayCallOptions as n, runWithGatewaySessionSpawnContext as o, resolveGatewayOptions as r, callGatewayTool as t };
