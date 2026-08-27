import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { d as getActivePluginRegistry, l as getActivePluginHttpRouteRegistry } from "./runtime-B2KAtS3O.js";
import { f as createGatewayMethodDescriptorsFromHandlers, m as createPluginGatewayMethodDescriptors, p as createGatewayMethodRegistry } from "./loader-BcKpDiEM.js";
import { i as getPluginRuntimeGatewayRequestScope, s as withPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-B19X7f09.js";
import { l as isOperatorScope, t as ADMIN_SCOPE } from "./operator-scopes-Dw7Gu2cA.js";
import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { i as gatewayStartupUnavailableDetails } from "./startup-unavailable-D0-EeFjq.js";
import { m as resolveDirectIncognitoTargets, n as createCoreGatewayMethodDescriptors, r as isCoreGatewayMethodClassified, s as listCoreGatewayHandlerMethodNames, v as sessionMutationTargetFields } from "./core-descriptors-8FmEpKxY.js";
import { _d as GATEWAY_RESTART_UNAVAILABLE_REASON, vd as GATEWAY_SUSPEND_UNAVAILABLE_REASON } from "./src-4dv5TpeQ.js";
import { n as authorizeOperatorScopesForMethod, r as authorizeOperatorScopesForRequiredScope, s as resolveLeastPrivilegeOperatorScopesForMethod } from "./method-scopes-BQC2sTma.js";
import { S as tryBeginGatewayRootWorkAdmission, b as tryBeginGatewayPreparedRestartRootWorkAdmission, c as isGatewayRestartDraining, o as getGatewaySuspendAdmissionPhase } from "./gateway-work-admission-CTDt7IQ1.js";
import { d as errorShape, f as missingScopeErrorShape } from "./validation-errors-rELRlKfn.js";
import { l as authenticatedProfileUnavailableError } from "./operator-role-policy-il7s4lXY.js";
import { m as resolveSessionMutationAuthorization, t as SessionMutationAuthorizationChangedError } from "./session-sharing-DSLYm21V.js";
import { n as resolveControlPlaneActor, t as formatControlPlaneActor } from "./control-plane-audit-CN8L3SYx.js";
import { n as consumeControlPlaneWriteBudget, t as CONTROL_PLANE_RATE_LIMIT_WINDOW_MS } from "./control-plane-rate-limit-BtKY9m7Q.js";
import { n as parseGatewayRole, t as isRoleAuthorizedForMethod } from "./role-policy-pur-V2kn.js";
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
	agent: () => import("./agent-0JcKx7RY.js").then((module) => module.agentHandlers),
	"agent-identity": () => import("./agent-identity-kSGZWCyB.js").then((module) => module.agentIdentityHandlers),
	agents: () => import("./agents-sNS5Y41B.js").then((module) => module.agentsHandlers),
	"agents-workspace": () => import("./agents-workspace-BRiKZH4T.js").then((module) => module.agentsWorkspaceHandlers),
	artifacts: () => import("./artifacts-CulNRj1m.js").then((module) => module.artifactsHandlers),
	board: () => import("./board-CIG7dlex.js").then((module) => module.boardHandlers),
	audit: () => import("./audit-osqjddAw.js").then((module) => module.auditHandlers),
	users: () => import("./users-Dj2juEyp.js").then((module) => module.usersHandlers),
	attach: () => import("./attach-CHv4XVIP.js").then((module) => module.attachHandlers),
	channels: () => import("./channels-jKAyF5pq.js").then((module) => module.channelsHandlers),
	"channel-pairing": () => import("./channel-pairing-B95u8cDx.js").then((module) => module.channelPairingHandlers),
	chat: () => import("./chat-BUUPfZz3.js").then((module) => module.chatHandlers),
	commands: () => import("./commands-DPPkJRjf.js").then((module) => module.commandsHandlers),
	config: () => import("./config-DH4Qx0Mp.js").then((module) => module.configHandlers),
	conversations: () => import("./conversations-lfp6N7b0.js").then((module) => module.conversationHandlers),
	connect: () => import("./connect-DtNTeZSr.js").then((module) => module.connectHandlers),
	"control-ui": () => import("./control-ui-CTB0vYLN.js").then((module) => module.controlUiHandlers),
	cron: () => import("./cron-5-rwAUP_.js").then((module) => module.cronHandlers),
	devices: () => import("./devices-DupBtLw4.js").then((module) => module.deviceHandlers),
	"device-pair-setup": () => import("./device-pair-setup-xBJ-GYSL.js").then((module) => module.devicePairSetupHandlers),
	diagnostics: () => import("./diagnostics-CgBYnj_F.js").then((module) => module.diagnosticsHandlers),
	doctor: () => import("./doctor-C0--acHK.js").then((module) => module.createDoctorHandlers()),
	environments: () => import("./environments-CmVFFNyJ.js").then((module) => module.environmentsHandlers),
	worktrees: () => import("./worktrees-QioyPZpI.js").then((module) => module.worktreesHandlers),
	"exec-approvals": () => import("./exec-approvals-DwOXq3Xl.js").then((module) => module.execApprovalsHandlers),
	fs: () => import("./fs-DeeHY0w2.js").then((module) => module.fsHandlers),
	health: () => import("./health-BdUTLA0H.js").then((module) => module.healthHandlers),
	logs: () => import("./logs-ggi4OME-.js").then((module) => module.logsHandlers),
	"memory-search": () => import("./memory-search-Babc16ZN.js").then((module) => module.memorySearchHandlers),
	terminal: () => import("./terminal-Bsj6WzE7.js").then((module) => module.terminalHandlers),
	"ui-command": () => import("./ui-command-CBmcLJPE.js").then((module) => module.uiCommandHandlers),
	"models-auth-status": () => import("./models-auth-status-B6GCWdx_.js").then((module) => module.modelsAuthStatusHandlers),
	models: () => import("./models-BAueLPzg.js").then((module) => module.modelsHandlers),
	"models-probe": () => import("./models-probe-BAu9qkyQ.js").then((module) => module.modelsProbeHandlers),
	"native-hook-relay": () => import("./native-hook-relay-CstbDLcw.js").then((module) => module.nativeHookRelayHandlers),
	"nodes-pending": () => import("./nodes.pending-work-DmMnuY5z.js").then((module) => module.nodePendingWorkHandlers),
	nodes: () => import("./nodes-MhZ16doz.js").then((module) => module.nodeHandlers),
	"plugin-host-hooks": () => import("./plugin-host-hooks-DMlmesjd.js").then((module) => module.pluginHostHookHandlers),
	plugins: () => import("./plugins-TjX-aOL7.js").then((module) => module.pluginsHandlers),
	projects: () => import("./projects-DDSoy_GG.js").then((module) => module.projectsHandlers),
	portals: () => import("./portals-mdYN5L3Z.js").then((module) => module.portalHandlers),
	"progress-card": () => import("./progress-card-YWJ6Ujtd.js").then((module) => module.progressCardHandlers),
	migrations: () => import("./migrations-HrHhObtK.js").then((module) => module.migrationsHandlers),
	push: () => import("./push-MLKFukzv.js").then((module) => module.pushHandlers),
	restart: () => import("./restart-CCyf7tAP.js").then((module) => module.restartHandlers),
	suspend: () => import("./suspend-2YybtIUp.js").then((module) => module.suspendHandlers),
	send: () => import("./send-BlhW-QFY.js").then((module) => module.sendHandlers),
	"sessions-files": () => import("./sessions-files-Ck8TO-AR.js").then((module) => module.sessionsFilesHandlers),
	"sessions-github": () => import("./sessions-github-D4PXZm-T.js").then((module) => module.sessionsGitHubHandlers),
	"sessions-diff": () => import("./sessions-diff-D2BDbpvD.js").then((module) => module.sessionsDiffHandlers),
	"sessions-abort": () => import("./sessions-abort-BK66WFQX.js").then((module) => module.sessionAbortHandlers),
	"sessions-compact": () => import("./sessions-compact-DVJjeXhz.js").then((module) => module.sessionCompactHandlers),
	"sessions-compaction-checkpoints": () => import("./sessions-compaction-checkpoints-BtQweMNx.js").then((module) => module.sessionCheckpointHandlers),
	"sessions-compaction-queries": () => import("./sessions-compaction-queries-ChYvsvKK.js").then((module) => module.sessionCheckpointQueryHandlers),
	"sessions-create": () => import("./sessions-create-BrwYVXDl.js").then((module) => module.sessionCreateHandlers),
	"sessions-recover": () => import("./sessions-recover-D3vobpKI.js").then((module) => module.sessionRecoverHandlers),
	"sessions-delete": () => import("./sessions-delete-C2B1Jf6f.js").then((module) => module.sessionDeleteHandlers),
	"sessions-dispatch": () => import("./sessions-dispatch-2dtIKFRz.js").then((module) => module.sessionDispatchHandlers),
	"sessions-groups": () => import("./sessions-groups-CL4WKNZk.js").then((module) => module.sessionGroupHandlers),
	"sessions-messaging": () => import("./sessions-messaging-DMz9SxfC.js").then((module) => module.sessionMessagingHandlers),
	"sessions-mutations": () => import("./sessions-mutations-BTjc8ivv.js").then((module) => module.sessionMutationHandlers),
	"sessions-read": () => import("./sessions-read-DVa-4SfO.js").then((module) => module.sessionReadHandlers),
	"sessions-rewind": () => import("./sessions-rewind-C01qwR0G.js").then((module) => module.sessionRewindHandlers),
	"sessions-sharing": () => import("./sessions-sharing-DBM23wBC.js").then((module) => module.sessionSharingHandlers),
	"sessions-subscriptions": () => import("./sessions-subscriptions-Df93PboB.js").then((module) => module.sessionSubscriptionHandlers),
	"sessions-suggestions": () => import("./sessions-suggestions-BdYmB0mB.js").then((module) => module.sessionSuggestionHandlers),
	"session-catalog": () => import("./session-catalog-BU9VHmHd.js").then((module) => module.sessionCatalogHandlers),
	"session-discussion": () => import("./session-discussion-3VWgMfKt.js").then((module) => module.sessionDiscussionHandlers),
	"session-observer-rpc": () => import("./session-observer-rpc-ClAjENXm.js").then((module) => module.sessionObserverHandlers),
	"session-companion-rpc": () => import("./session-companion-rpc-kL18oLeR.js").then((module) => module.sessionCompanionHandlers),
	"hooks-status": () => import("./hooks-status-BSSDV8DN.js").then((module) => module.hooksStatusHandlers),
	skills: () => import("./skills-KNIF8KyG.js").then((module) => module.skillsHandlers),
	system: () => import("./system-CWdyf6XF.js").then((module) => module.systemHandlers),
	talk: () => import("./talk-C8hj0rwS.js").then((module) => module.talkHandlers),
	tasks: () => import("./tasks-BijdX7xa.js").then((module) => module.tasksHandlers),
	"task-suggestions": () => import("./task-suggestions-DusNoi-K.js").then((module) => module.taskSuggestionsHandlers),
	"tools-catalog": () => import("./tools-catalog-Dg1KtRg6.js").then((module) => module.toolsCatalogHandlers),
	"tools-github": () => import("./tools-github-Bx1E76Fr.js").then((module) => module.toolsGitHubHandlers),
	"tools-effective": () => import("./tools-effective-_HpJrUL-.js").then((module) => module.toolsEffectiveHandlers),
	"tools-invoke": () => import("./tools-invoke-DmzxG0X0.js").then((module) => module.toolsInvokeHandlers),
	"mcp-app": () => import("./mcp-app-CeJ9q-CP.js").then((module) => module.mcpAppHandlers),
	tts: () => import("./tts-IYUbj6w5.js").then((module) => module.ttsHandlers),
	update: () => import("./update-CH-sDXVJ.js").then((module) => module.updateHandlers),
	usage: () => import("./usage-DvN_FRy-.js").then((module) => module.usageHandlers),
	"voicewake-routing": () => import("./voicewake-routing-BEpex0wI.js").then((module) => module.voicewakeRoutingHandlers),
	voicewake: () => import("./voicewake-BOT7KdnL.js").then((module) => module.voicewakeHandlers),
	web: () => import("./web-D82PPHkZ.js").then((module) => module.webHandlers),
	"system-agent": () => import("./system-agent-DkP_HIwP.js").then((module) => module.systemAgentHandlers),
	"system-changes": () => import("./system-changes-DCywRr0J.js").then((module) => module.systemChangesHandlers),
	wizard: () => import("./wizard-B918GDcR.js").then((module) => module.wizardHandlers)
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
