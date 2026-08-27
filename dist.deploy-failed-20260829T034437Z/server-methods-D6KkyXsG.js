import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { d as getActivePluginRegistry, l as getActivePluginHttpRouteRegistry } from "./runtime-DMlUh4Cg.js";
import { f as createGatewayMethodDescriptorsFromHandlers, m as createPluginGatewayMethodDescriptors, p as createGatewayMethodRegistry } from "./loader-D0AfkRZe.js";
import { i as getPluginRuntimeGatewayRequestScope, s as withPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-B19X7f09.js";
import { l as isOperatorScope, t as ADMIN_SCOPE } from "./operator-scopes-Dw7Gu2cA.js";
import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { i as gatewayStartupUnavailableDetails } from "./startup-unavailable-D0-EeFjq.js";
import { m as resolveDirectIncognitoTargets, n as createCoreGatewayMethodDescriptors, r as isCoreGatewayMethodClassified, s as listCoreGatewayHandlerMethodNames, v as sessionMutationTargetFields } from "./core-descriptors-By5XY4Wa.js";
import { _d as GATEWAY_RESTART_UNAVAILABLE_REASON, vd as GATEWAY_SUSPEND_UNAVAILABLE_REASON } from "./src-4dv5TpeQ.js";
import { n as authorizeOperatorScopesForMethod, r as authorizeOperatorScopesForRequiredScope, s as resolveLeastPrivilegeOperatorScopesForMethod } from "./method-scopes-BTnJZEGh.js";
import { S as tryBeginGatewayRootWorkAdmission, b as tryBeginGatewayPreparedRestartRootWorkAdmission, c as isGatewayRestartDraining, o as getGatewaySuspendAdmissionPhase } from "./gateway-work-admission-CTDt7IQ1.js";
import { d as errorShape, f as missingScopeErrorShape } from "./validation-errors-rELRlKfn.js";
import { l as authenticatedProfileUnavailableError } from "./operator-role-policy-Bvt-UeJ1.js";
import { m as resolveSessionMutationAuthorization, t as SessionMutationAuthorizationChangedError } from "./session-sharing-C4OmHGYo.js";
import { n as resolveControlPlaneActor, t as formatControlPlaneActor } from "./control-plane-audit-CN8L3SYx.js";
import { n as consumeControlPlaneWriteBudget, t as CONTROL_PLANE_RATE_LIMIT_WINDOW_MS } from "./control-plane-rate-limit-BtKY9m7Q.js";
import { n as parseGatewayRole, t as isRoleAuthorizedForMethod } from "./role-policy-DYYoQXIG.js";
import { t as isTargetedNonSafeGatewayRestartRequest } from "./restart-request-cVXXa5KE.js";
import { n as classifyGatewayStaleInstall } from "./stale-install-Ddx9ofaa.js";
//#region src/gateway/server-methods/lazy-core-handlers.ts
function lazyHandlerModule(loadModule, selectHandlers) {
	let handlersPromise = null;
	return () => handlersPromise ??= loadModule().then(selectHandlers);
}
function createLazyCoreHandlers(params) {
	return Object.fromEntries(params.methods.map((method) => [method, async (opts) => {
		const handler = (await params.loadHandlers())[method];
		if (!handler) throw new Error(`lazy gateway handler not found: ${method}`);
		await handler(opts);
	}]));
}
//#endregion
//#region src/gateway/server-methods.ts
const CORE_GATEWAY_HANDLER_MODULES = {
	agent: () => import("./agent-BB5og-FP.js").then((module) => module.agentHandlers),
	"agent-identity": () => import("./agent-identity-C1GxNkTw.js").then((module) => module.agentIdentityHandlers),
	agents: () => import("./agents-DAvtZcUO.js").then((module) => module.agentsHandlers),
	"agents-workspace": () => import("./agents-workspace-BRiKZH4T.js").then((module) => module.agentsWorkspaceHandlers),
	artifacts: () => import("./artifacts-De_Kf_Bo.js").then((module) => module.artifactsHandlers),
	board: () => import("./board-BnRvTzqc.js").then((module) => module.boardHandlers),
	audit: () => import("./audit-Buw-5io2.js").then((module) => module.auditHandlers),
	users: () => import("./users-Bm2hV7wU.js").then((module) => module.usersHandlers),
	attach: () => import("./attach-DS1elKLY.js").then((module) => module.attachHandlers),
	channels: () => import("./channels-B8uYzGT0.js").then((module) => module.channelsHandlers),
	"channel-pairing": () => import("./channel-pairing-BV7O5y1s.js").then((module) => module.channelPairingHandlers),
	chat: () => import("./chat-D9gWEPJu.js").then((module) => module.chatHandlers),
	commands: () => import("./commands-DDtTfH_B.js").then((module) => module.commandsHandlers),
	config: () => import("./config-bDVWQRFm.js").then((module) => module.configHandlers),
	conversations: () => import("./conversations-Ds6nvLeW.js").then((module) => module.conversationHandlers),
	connect: () => import("./connect-DtNTeZSr.js").then((module) => module.connectHandlers),
	"control-ui": () => import("./control-ui-BEnbk1_k.js").then((module) => module.controlUiHandlers),
	cron: () => import("./cron-JNzXICyz.js").then((module) => module.cronHandlers),
	devices: () => import("./devices-Dmz_mOBS.js").then((module) => module.deviceHandlers),
	"device-pair-setup": () => import("./device-pair-setup-BQsaqbk8.js").then((module) => module.devicePairSetupHandlers),
	diagnostics: () => import("./diagnostics-CgBYnj_F.js").then((module) => module.diagnosticsHandlers),
	doctor: () => import("./doctor-JPSGXVQf.js").then((module) => module.createDoctorHandlers()),
	environments: () => import("./environments-By2Igq3w.js").then((module) => module.environmentsHandlers),
	worktrees: () => import("./worktrees-BAmGUHLl.js").then((module) => module.worktreesHandlers),
	"exec-approvals": () => import("./exec-approvals-9_ezHl4j.js").then((module) => module.execApprovalsHandlers),
	fs: () => import("./fs-CB4Z724a.js").then((module) => module.fsHandlers),
	health: () => import("./health-CEWbqKtX.js").then((module) => module.healthHandlers),
	logs: () => import("./logs-ggi4OME-.js").then((module) => module.logsHandlers),
	"memory-search": () => import("./memory-search-x3Xj34JV.js").then((module) => module.memorySearchHandlers),
	terminal: () => import("./terminal-h9EhHWGL.js").then((module) => module.terminalHandlers),
	"ui-command": () => import("./ui-command-CBmcLJPE.js").then((module) => module.uiCommandHandlers),
	"models-auth-status": () => import("./models-auth-status-CLSjN4bA.js").then((module) => module.modelsAuthStatusHandlers),
	models: () => import("./models-ia4jXddO.js").then((module) => module.modelsHandlers),
	"models-probe": () => import("./models-probe-D_9ywWN3.js").then((module) => module.modelsProbeHandlers),
	"native-hook-relay": () => import("./native-hook-relay-7UDiFy7K.js").then((module) => module.nativeHookRelayHandlers),
	"nodes-pending": () => import("./nodes.pending-work-BtETbleL.js").then((module) => module.nodePendingWorkHandlers),
	nodes: () => import("./nodes-B07AXO-u.js").then((module) => module.nodeHandlers),
	"plugin-host-hooks": () => import("./plugin-host-hooks-BfXJoh9L.js").then((module) => module.pluginHostHookHandlers),
	plugins: () => import("./plugins-BbPLed3_.js").then((module) => module.pluginsHandlers),
	projects: () => import("./projects-C6l7C-OL.js").then((module) => module.projectsHandlers),
	portals: () => import("./portals-mdYN5L3Z.js").then((module) => module.portalHandlers),
	"progress-card": () => import("./progress-card-Dt2K3dWO.js").then((module) => module.progressCardHandlers),
	migrations: () => import("./migrations-BO9dDXCQ.js").then((module) => module.migrationsHandlers),
	push: () => import("./push-CuiKZ9zN.js").then((module) => module.pushHandlers),
	restart: () => import("./restart-OSDgt_zA.js").then((module) => module.restartHandlers),
	suspend: () => import("./suspend-DjKTM9cx.js").then((module) => module.suspendHandlers),
	send: () => import("./send-B2UHT6bi.js").then((module) => module.sendHandlers),
	"sessions-files": () => import("./sessions-files-DbKAvzXT.js").then((module) => module.sessionsFilesHandlers),
	"sessions-github": () => import("./sessions-github-BksJOjVO.js").then((module) => module.sessionsGitHubHandlers),
	"sessions-diff": () => import("./sessions-diff-Q0n5er6U.js").then((module) => module.sessionsDiffHandlers),
	"sessions-abort": () => import("./sessions-abort-qhBMOx9S.js").then((module) => module.sessionAbortHandlers),
	"sessions-compact": () => import("./sessions-compact-yckRC_rs.js").then((module) => module.sessionCompactHandlers),
	"sessions-compaction-checkpoints": () => import("./sessions-compaction-checkpoints-B_XoiTyt.js").then((module) => module.sessionCheckpointHandlers),
	"sessions-compaction-queries": () => import("./sessions-compaction-queries-DEu12ZN3.js").then((module) => module.sessionCheckpointQueryHandlers),
	"sessions-create": () => import("./sessions-create-vUSX-WFN.js").then((module) => module.sessionCreateHandlers),
	"sessions-recover": () => import("./sessions-recover-BLmHBGSu.js").then((module) => module.sessionRecoverHandlers),
	"sessions-delete": () => import("./sessions-delete-4_30lQpl.js").then((module) => module.sessionDeleteHandlers),
	"sessions-dispatch": () => import("./sessions-dispatch-X28tR2Xh.js").then((module) => module.sessionDispatchHandlers),
	"sessions-groups": () => import("./sessions-groups-C6nMgGrt.js").then((module) => module.sessionGroupHandlers),
	"sessions-messaging": () => import("./sessions-messaging-DCX9Zjk9.js").then((module) => module.sessionMessagingHandlers),
	"sessions-mutations": () => import("./sessions-mutations-BYWEjitV.js").then((module) => module.sessionMutationHandlers),
	"sessions-read": () => import("./sessions-read-EMSJaNXv.js").then((module) => module.sessionReadHandlers),
	"sessions-rewind": () => import("./sessions-rewind-BFIhjUGf.js").then((module) => module.sessionRewindHandlers),
	"sessions-sharing": () => import("./sessions-sharing-48cEl_xL.js").then((module) => module.sessionSharingHandlers),
	"sessions-subscriptions": () => import("./sessions-subscriptions-DiRee80j.js").then((module) => module.sessionSubscriptionHandlers),
	"sessions-suggestions": () => import("./sessions-suggestions-Dvwmw0XH.js").then((module) => module.sessionSuggestionHandlers),
	"session-catalog": () => import("./session-catalog-tF8L-0F-.js").then((module) => module.sessionCatalogHandlers),
	"session-discussion": () => import("./session-discussion-Dgskr-R1.js").then((module) => module.sessionDiscussionHandlers),
	"session-observer-rpc": () => import("./session-observer-rpc-ClAjENXm.js").then((module) => module.sessionObserverHandlers),
	"session-companion-rpc": () => import("./session-companion-rpc-DkkrEhRC.js").then((module) => module.sessionCompanionHandlers),
	"hooks-status": () => import("./hooks-status-DNdyT3Ev.js").then((module) => module.hooksStatusHandlers),
	skills: () => import("./skills-EjW4JusL.js").then((module) => module.skillsHandlers),
	system: () => import("./system-ru2tR3AP.js").then((module) => module.systemHandlers),
	talk: () => import("./talk-CVKueVwW.js").then((module) => module.talkHandlers),
	tasks: () => import("./tasks-BaW3VRIf.js").then((module) => module.tasksHandlers),
	"task-suggestions": () => import("./task-suggestions-CQGtDbyZ.js").then((module) => module.taskSuggestionsHandlers),
	"tools-catalog": () => import("./tools-catalog-ByFUPFhi.js").then((module) => module.toolsCatalogHandlers),
	"tools-github": () => import("./tools-github-xjLO9txF.js").then((module) => module.toolsGitHubHandlers),
	"tools-effective": () => import("./tools-effective-BXceTHFk.js").then((module) => module.toolsEffectiveHandlers),
	"tools-invoke": () => import("./tools-invoke-DaW3rMT3.js").then((module) => module.toolsInvokeHandlers),
	"mcp-app": () => import("./mcp-app-CjaOwufj.js").then((module) => module.mcpAppHandlers),
	tts: () => import("./tts-D1hL18-r.js").then((module) => module.ttsHandlers),
	update: () => import("./update-Cd545jkr.js").then((module) => module.updateHandlers),
	usage: () => import("./usage-DH7abUaF.js").then((module) => module.usageHandlers),
	"voicewake-routing": () => import("./voicewake-routing-B3GGUVG_.js").then((module) => module.voicewakeRoutingHandlers),
	voicewake: () => import("./voicewake-DaYGDguT.js").then((module) => module.voicewakeHandlers),
	web: () => import("./web-Dh2ziYKq.js").then((module) => module.webHandlers),
	"system-agent": () => import("./system-agent-Ct58jFgn.js").then((module) => module.systemAgentHandlers),
	"system-changes": () => import("./system-changes-ZiB4Zqov.js").then((module) => module.systemChangesHandlers),
	wizard: () => import("./wizard-DS7ZtCLA.js").then((module) => module.wizardHandlers)
};
function authorizeGatewayMethod(method, client, params, methodRegistry) {
	if (!client?.connect) return null;
	if (method === "health") return null;
	const roleRaw = client.connect.role ?? "operator";
	const role = parseGatewayRole(roleRaw);
	if (!role) return errorShape(ErrorCodes.INVALID_REQUEST, `unauthorized role: ${roleRaw}`);
	const scopes = client.connect.scopes ?? [];
	if (!isRoleAuthorizedForMethod(role, method)) return errorShape(ErrorCodes.INVALID_REQUEST, `unauthorized role: ${role}`);
	if (role === "node") return null;
	if (scopes.includes("operator.admin")) return null;
	const registeredScope = methodRegistry.getScope(method);
	const scopeAuth = isOperatorScope(registeredScope) ? authorizeOperatorScopesForRequiredScope(registeredScope, scopes) : authorizeOperatorScopesForMethod(method, scopes, params);
	if (!scopeAuth.allowed) {
		const resolvedRequiredScopes = isOperatorScope(registeredScope) ? [registeredScope] : resolveLeastPrivilegeOperatorScopesForMethod(method, params);
		return missingScopeErrorShape({
			missingScope: scopeAuth.missingScope,
			requiredScopes: resolvedRequiredScopes.length > 0 ? resolvedRequiredScopes : [scopeAuth.missingScope]
		});
	}
	return null;
}
const SUSPEND_CONTROL_METHODS = /* @__PURE__ */ new Set([
	"gateway.suspend.prepare",
	"gateway.suspend.status",
	"gateway.suspend.resume"
]);
function isGatewayMethodAllowedDuringSuspension(method) {
	return SUSPEND_CONTROL_METHODS.has(method);
}
function runGatewayPendingWorkContinuation(params) {
	if (getGatewaySuspendAdmissionPhase() !== "draining" || !isRecord(params.requestParams)) return null;
	const request = params.requestParams;
	if (params.client?.connect.role === "node") {
		const invokeId = params.method === "node.invoke.progress" ? request.invokeId : params.method === "node.invoke.result" ? request.id : void 0;
		if (typeof invokeId !== "string" || typeof request.nodeId !== "string") return null;
		return params.context.nodeRegistry.runPendingInvokeContinuation({
			invokeId,
			nodeId: request.nodeId,
			connId: params.client.connId,
			run: params.run
		});
	}
	if (params.client?.connect.role !== "operator" || typeof request.id !== "string") return null;
	if (params.method === "question.resolve" || params.method === "question.get") return params.context.questionManager?.runPendingContinuation(request.id, params.run) ?? null;
	return (params.method === "exec.approval.resolve" ? params.context.execApprovalManager : params.method === "plugin.approval.resolve" ? params.context.pluginApprovalManager : params.method === "approval.resolve" ? request.kind === "exec" ? params.context.execApprovalManager : request.kind === "plugin" ? params.context.pluginApprovalManager : request.kind === "system-agent" ? params.context.systemAgentApprovalManager : void 0 : void 0)?.runPendingContinuation(request.id, params.run) ?? null;
}
async function authorizeAuthenticatedProfileForMethod(params) {
	const sync = params.client?.authenticatedGitHubIdentitySync;
	if (!sync || params.client?.authenticatedUserProfile?.profileId.trim()) return null;
	if (!(params.methodRegistry.requiresAuthenticatedProfile(params.method) || resolveDirectIncognitoTargets(params.method, params.requestParams).length > 0 || sessionMutationTargetFields(params.method).length > 0 && params.context.getRuntimeConfig().gateway?.roles !== void 0)) return null;
	try {
		await sync();
	} catch {
		return authenticatedProfileUnavailableError();
	}
	return params.client?.authenticatedUserProfile?.profileId.trim() ? null : authenticatedProfileUnavailableError();
}
const coreGatewayHandlerMethodNames = listCoreGatewayHandlerMethodNames();
const coreGatewayHandlerModules = Object.entries(CORE_GATEWAY_HANDLER_MODULES);
const coreGatewayHandlers = Object.fromEntries(coreGatewayHandlerModules.flatMap(([family, loadModule]) => Object.entries(createLazyCoreHandlers({
	methods: coreGatewayHandlerMethodNames.get(family) ?? [],
	loadHandlers: lazyHandlerModule(loadModule, (handlers) => handlers)
}))));
/** Builds the per-request method registry from core, plugin, and explicit extra handlers. */
function createRequestGatewayMethodRegistry(extraHandlers) {
	const gatewayPluginRegistry = getActivePluginHttpRouteRegistry();
	const gatewayPluginHandlers = gatewayPluginRegistry?.gatewayHandlers ?? {};
	const extraHandlerEntries = Object.entries(extraHandlers ?? {});
	const pluginMethodNames = new Set(Object.keys(gatewayPluginHandlers));
	const coreDescriptorHandlers = { ...coreGatewayHandlers };
	for (const [method, extraHandler] of extraHandlerEntries) if (!pluginMethodNames.has(method) && isCoreGatewayMethodClassified(method)) coreDescriptorHandlers[method] = extraHandler;
	const coreDescriptors = createCoreGatewayMethodDescriptors(coreDescriptorHandlers);
	for (const descriptor of coreDescriptors) {
		const extraHandler = extraHandlers?.[descriptor.name];
		if (extraHandler && !pluginMethodNames.has(descriptor.name)) descriptor.handler = extraHandler;
	}
	const coreMethodNames = new Set(coreDescriptors.map((descriptor) => descriptor.name));
	const auxHandlers = Object.fromEntries(extraHandlerEntries.filter(([method]) => !pluginMethodNames.has(method) && !coreMethodNames.has(method)));
	return createGatewayMethodRegistry([
		...coreDescriptors,
		...gatewayPluginRegistry ? createPluginGatewayMethodDescriptors(gatewayPluginRegistry) : [],
		...createGatewayMethodDescriptorsFromHandlers({
			handlers: auxHandlers,
			owner: {
				kind: "aux",
				area: "gateway-extra"
			},
			defaultScope: ADMIN_SCOPE
		})
	], gatewayPluginRegistry ?? void 0);
}
/** Applies the router-owned authorization fence before any transport or typed dispatch. */
async function authorizeGatewayRequestPreDispatch(params) {
	const authError = authorizeGatewayMethod(params.method, params.client, params.requestParams, params.methodRegistry);
	if (authError) return { error: authError };
	const profileError = await authorizeAuthenticatedProfileForMethod(params);
	if (profileError) return { error: profileError };
	if (params.context.unavailableGatewayMethods?.has(params.method)) return { error: errorShape(ErrorCodes.UNAVAILABLE, `${params.method} unavailable during gateway startup`, {
		retryable: true,
		retryAfterMs: 500,
		details: {
			...gatewayStartupUnavailableDetails(),
			method: params.method
		}
	}) };
	const sessionMutation = resolveSessionMutationAuthorization({
		client: params.client ?? null,
		method: params.method,
		requestParams: params.requestParams,
		context: params.context
	});
	if (sessionMutation.error) return { error: sessionMutation.error };
	if (params.client?.connect.role === "node" && (!params.client.connId || !await params.context.nodeRegistry.isConnectionCurrentPairingState(params.client.connId))) return { error: errorShape(ErrorCodes.UNAVAILABLE, "node pairing changed before request dispatch", {
		retryable: true,
		details: { code: "PAIRING_CHANGED" }
	}) };
	return {
		error: null,
		...sessionMutation.authorization ? { sessionMutationAuthorization: sessionMutation.authorization } : {}
	};
}
/** Runs admitted Gateway work inside the shared root and plugin request scopes. */
async function runWithGatewayRequestEnvelope(method, client, fn, options) {
	const rejectRateLimitedControlPlaneWrite = () => {
		if (!options.methodRegistry.isControlPlaneWrite(method)) return;
		const budget = consumeControlPlaneWriteBudget({
			client,
			method
		});
		if (budget.allowed) return;
		const actor = resolveControlPlaneActor(client);
		options.context.logGateway.warn(`control-plane write rate-limited method=${method} ${formatControlPlaneActor(actor)} retryAfterMs=${budget.retryAfterMs} key=${budget.key}`);
		return errorShape(ErrorCodes.UNAVAILABLE, `rate limit exceeded for ${method}; retry after ${Math.ceil(budget.retryAfterMs / 1e3)}s`, {
			retryable: true,
			retryAfterMs: budget.retryAfterMs,
			details: {
				method,
				limit: `30 per ${CONTROL_PLANE_RATE_LIMIT_WINDOW_MS / 1e3}s`
			}
		});
	};
	const isSuspendPrepare = method === "gateway.suspend.prepare";
	const preAdmissionRateLimitError = isSuspendPrepare ? rejectRateLimitedControlPlaneWrite() : void 0;
	if (preAdmissionRateLimitError) return await options.reject(preAdmissionRateLimitError);
	const rootWorkAdmission = tryBeginGatewayRootWorkAdmission() ?? (method === "gateway.restart.request" && isTargetedNonSafeGatewayRestartRequest(options.requestParams) ? tryBeginGatewayPreparedRestartRootWorkAdmission() : null);
	if (!rootWorkAdmission) {
		const continuation = runGatewayPendingWorkContinuation({
			method,
			client,
			requestParams: options.requestParams,
			context: options.context,
			run: () => runWithGatewayRequestEnvelope(method, client, fn, options)
		});
		if (continuation) return await continuation;
	}
	if (isSuspendPrepare && rootWorkAdmission && !rootWorkAdmission.ownsRoot) return await options.reject(errorShape(ErrorCodes.UNAVAILABLE, "gateway suspension cannot begin from a nested request", {
		retryable: true,
		retryAfterMs: 1e3,
		details: {
			method,
			reason: "nested-gateway-request"
		}
	}));
	if (!rootWorkAdmission && !isGatewayMethodAllowedDuringSuspension(method)) {
		const restartDraining = isGatewayRestartDraining();
		return await options.reject(errorShape(ErrorCodes.UNAVAILABLE, `${method} unavailable during gateway ${restartDraining ? "restart" : "suspension"}`, {
			retryable: true,
			retryAfterMs: 1e3,
			details: {
				method,
				reason: restartDraining ? GATEWAY_RESTART_UNAVAILABLE_REASON : GATEWAY_SUSPEND_UNAVAILABLE_REASON,
				phase: getGatewaySuspendAdmissionPhase()
			}
		}));
	}
	const postAdmissionRateLimitError = isSuspendPrepare ? void 0 : rejectRateLimitedControlPlaneWrite();
	if (postAdmissionRateLimitError) try {
		return await options.reject(postAdmissionRateLimitError);
	} finally {
		rootWorkAdmission?.release();
	}
	const invokeWithRequestScope = async () => {
		try {
			const pluginRegistry = options.methodRegistry.pluginRegistry ?? getPluginRuntimeGatewayRequestScope()?.pluginRegistry ?? getActivePluginRegistry() ?? void 0;
			return await withPluginRuntimeGatewayRequestScope({
				context: options.context,
				client,
				isWebchatConnect: options.isWebchatConnect,
				...pluginRegistry ? { pluginRegistry } : {}
			}, fn);
		} catch (error) {
			if (error instanceof SessionMutationAuthorizationChangedError) return await options.reject(error.error);
			const staleInstall = classifyGatewayStaleInstall(error);
			if (staleInstall) return await options.reject(staleInstall.error);
			throw error;
		}
	};
	if (!rootWorkAdmission) return await invokeWithRequestScope();
	try {
		return await rootWorkAdmission.run(invokeWithRequestScope);
	} finally {
		rootWorkAdmission.release();
	}
}
/** Authorizes and dispatches one gateway JSON-RPC-style request. */
async function handleGatewayRequest(opts) {
	const { req, respond, client, isWebchatConnect, context, signal } = opts;
	const methodRegistry = opts.methodRegistry?.getHandler(req.method) !== void 0 ? opts.methodRegistry : createRequestGatewayMethodRegistry(opts.extraHandlers);
	const authorization = await authorizeGatewayRequestPreDispatch({
		method: req.method,
		requestParams: req.params,
		client,
		context,
		methodRegistry
	});
	if (authorization.error) {
		respond(false, void 0, authorization.error);
		return;
	}
	const handler = methodRegistry.getHandler(req.method);
	if (!handler) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown method: ${req.method}`));
		return;
	}
	const invokeHandler = () => handler({
		req,
		params: req.params ?? {},
		client,
		isWebchatConnect,
		respond,
		context,
		...signal ? { signal } : {},
		...opts.sessionMutationCommitGuard ? { sessionMutationCommitGuard: opts.sessionMutationCommitGuard } : {},
		...authorization.sessionMutationAuthorization ? { sessionMutationAuthorization: authorization.sessionMutationAuthorization } : {}
	});
	await runWithGatewayRequestEnvelope(req.method, client, invokeHandler, {
		context,
		isWebchatConnect,
		methodRegistry,
		requestParams: req.params,
		reject: (error) => respond(false, void 0, error)
	});
}
//#endregion
export { runWithGatewayRequestEnvelope as a, handleGatewayRequest as i, coreGatewayHandlers as n, createRequestGatewayMethodRegistry as r, authorizeGatewayRequestPreDispatch as t };
