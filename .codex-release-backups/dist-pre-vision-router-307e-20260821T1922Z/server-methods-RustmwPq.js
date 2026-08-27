import { a as isPathInside, n as hasNodeErrorCode } from "./path-D138yf8v.js";
import "./path-guards-fBZukd5S.js";
import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import { n as resolveOpenClawPackageRootSync } from "./openclaw-root-DSkQ6e_8.js";
import { d as getActivePluginRegistry, l as getActivePluginHttpRouteRegistry } from "./runtime-g0R28Sy0.js";
import { g as createPluginGatewayMethodDescriptors, h as createGatewayMethodRegistry, m as createGatewayMethodDescriptorsFromHandlers } from "./loader-B4G6K_LK.js";
import { n as withPluginRuntimeGatewayRequestScope, t as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BULcX9xX.js";
import { l as isOperatorScope, t as ADMIN_SCOPE } from "./operator-scopes-Dw7Gu2cA.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { i as gatewayStartupUnavailableDetails } from "./startup-unavailable-CRTM-3cy.js";
import { n as createCoreGatewayMethodDescriptors, r as isCoreGatewayMethodClassified, s as listCoreGatewayHandlerMethodNames } from "./core-descriptors-x7tVv8yG.js";
import { n as authorizeOperatorScopesForMethod, r as authorizeOperatorScopesForRequiredScope, s as resolveLeastPrivilegeOperatorScopesForMethod } from "./method-scopes-DRTuNy7j.js";
import { _ as tryBeginGatewayRootWorkAdmission, a as getGatewaySuspendAdmissionPhase, o as isGatewayRestartDraining } from "./gateway-work-admission-QDz202p9.js";
import { c as missingScopeErrorShape, s as errorShape } from "./error-codes-CMSvT5-d.js";
import { f as resolveSessionMutationAuthorization, t as SessionMutationAuthorizationChangedError } from "./session-sharing-DOLHhSnW.js";
import { n as resolveControlPlaneActor, t as formatControlPlaneActor } from "./control-plane-audit-CN8L3SYx.js";
import { n as consumeControlPlaneWriteBudget, t as CONTROL_PLANE_RATE_LIMIT_WINDOW_MS } from "./control-plane-rate-limit-BtKY9m7Q.js";
import { n as parseGatewayRole, t as isRoleAuthorizedForMethod } from "./role-policy-DqOrvDyQ.js";
import { fileURLToPath } from "node:url";
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
const gatewayInstallRoot = resolveOpenClawPackageRootSync({ moduleUrl: import.meta.url });
function staleInstallErrorShape(error) {
	if (!gatewayInstallRoot || !(error instanceof Error) || !hasNodeErrorCode(error, "ERR_MODULE_NOT_FOUND")) return null;
	const url = error.url;
	if (typeof url !== "string") return null;
	let missingPath;
	try {
		missingPath = fileURLToPath(url);
	} catch {
		return null;
	}
	if (!isPathInside(gatewayInstallRoot, missingPath)) return null;
	const restartCommand = formatCliCommand("openclaw gateway restart");
	return errorShape(ErrorCodes.UNAVAILABLE, `The running Gateway can no longer load part of its OpenClaw installation. The installation may have changed while the Gateway was running. Restart it with: ${restartCommand}`, {
		details: {
			code: "STALE_INSTALL",
			restartCommand
		},
		retryable: false
	});
}
const CORE_GATEWAY_HANDLER_MODULES = {
	agent: () => import("./agent-Cp9hZf9S.js").then((module) => module.agentHandlers),
	"agent-identity": () => import("./agent-identity-CY44xJjN.js").then((module) => module.agentIdentityHandlers),
	agents: () => import("./agents-BNZhMhoz.js").then((module) => module.agentsHandlers),
	"agents-workspace": () => import("./agents-workspace-C8gYaPIS.js").then((module) => module.agentsWorkspaceHandlers),
	artifacts: () => import("./artifacts-DgyQ7_uE.js").then((module) => module.artifactsHandlers),
	board: () => import("./board-CZ_W8f08.js").then((module) => module.boardHandlers),
	audit: () => import("./audit-DacPvdyI.js").then((module) => module.auditHandlers),
	users: () => import("./users-BuwnVXWR.js").then((module) => module.usersHandlers),
	attach: () => import("./attach-D9E0ATFS.js").then((module) => module.attachHandlers),
	channels: () => import("./channels-DAGNNDhg.js").then((module) => module.channelsHandlers),
	"channel-pairing": () => import("./channel-pairing-DMYaYEjf.js").then((module) => module.channelPairingHandlers),
	chat: () => import("./chat-BHv4nmGT.js").then((module) => module.chatHandlers),
	commands: () => import("./commands-CJlRJQEJ.js").then((module) => module.commandsHandlers),
	config: () => import("./config-Cc07QvZt.js").then((module) => module.configHandlers),
	conversations: () => import("./conversations-CTqM-4x4.js").then((module) => module.conversationHandlers),
	connect: () => import("./connect-DQkIlbDI.js").then((module) => module.connectHandlers),
	"control-ui": () => import("./control-ui-Bf_pDM8Z.js").then((module) => module.controlUiHandlers),
	cron: () => import("./cron-DJoIdIfE.js").then((module) => module.cronHandlers),
	devices: () => import("./devices-DsCmhari.js").then((module) => module.deviceHandlers),
	"device-pair-setup": () => import("./device-pair-setup-EFU1RCFG.js").then((module) => module.devicePairSetupHandlers),
	diagnostics: () => import("./diagnostics-BScS6cDJ.js").then((module) => module.diagnosticsHandlers),
	doctor: () => import("./doctor-T5V1FSLi.js").then((module) => module.doctorHandlers),
	environments: () => import("./environments-b1jdJ5wj.js").then((module) => module.environmentsHandlers),
	worktrees: () => import("./worktrees-CnR_ksrd.js").then((module) => module.worktreesHandlers),
	"exec-approvals": () => import("./exec-approvals-CnQTk-LK.js").then((module) => module.execApprovalsHandlers),
	fs: () => import("./fs-D_zRgmOj.js").then((module) => module.fsHandlers),
	health: () => import("./health-B66PDuHz.js").then((module) => module.healthHandlers),
	logs: () => import("./logs-BV6PkS5O.js").then((module) => module.logsHandlers),
	"memory-search": () => import("./memory-search-BjSSjWzI.js").then((module) => module.memorySearchHandlers),
	terminal: () => import("./terminal-NfXf-ZY0.js").then((module) => module.terminalHandlers),
	"ui-command": () => import("./ui-command-BHR4RYi3.js").then((module) => module.uiCommandHandlers),
	"models-auth-status": () => import("./models-auth-status-BD7g_ud9.js").then((module) => module.modelsAuthStatusHandlers),
	models: () => import("./models-DrZWIEwe.js").then((module) => module.modelsHandlers),
	"models-probe": () => import("./models-probe-DkEoLsK7.js").then((module) => module.modelsProbeHandlers),
	"native-hook-relay": () => import("./native-hook-relay-DkTaqXOp.js").then((module) => module.nativeHookRelayHandlers),
	"nodes-pending": () => import("./nodes.pending-work-oKcCEHGK.js").then((module) => module.nodePendingWorkHandlers),
	nodes: () => import("./nodes-Ce0ukl73.js").then((module) => module.nodeHandlers),
	"plugin-host-hooks": () => import("./plugin-host-hooks-Dz4r6eE6.js").then((module) => module.pluginHostHookHandlers),
	plugins: () => import("./plugins-DzIfjYMx.js").then((module) => module.pluginsHandlers),
	projects: () => import("./projects-D39nTGUM.js").then((module) => module.projectsHandlers),
	portals: () => import("./portals-BxZtO403.js").then((module) => module.portalHandlers),
	migrations: () => import("./migrations-CJ8BQnWn.js").then((module) => module.migrationsHandlers),
	push: () => import("./push-CUzRsnw8.js").then((module) => module.pushHandlers),
	restart: () => import("./restart-K91Il-RH.js").then((module) => module.restartHandlers),
	suspend: () => import("./suspend-mbMFu6x7.js").then((module) => module.suspendHandlers),
	send: () => import("./send-BFgEoDcC.js").then((module) => module.sendHandlers),
	"sessions-files": () => import("./sessions-files-Bhqp82V9.js").then((module) => module.sessionsFilesHandlers),
	"sessions-diff": () => import("./sessions-diff-B2iTxbk6.js").then((module) => module.sessionsDiffHandlers),
	"sessions-abort": () => import("./sessions-abort-Xx1a2xtT.js").then((module) => module.sessionAbortHandlers),
	"sessions-compact": () => import("./sessions-compact-CXL4STPC.js").then((module) => module.sessionCompactHandlers),
	"sessions-compaction-checkpoints": () => import("./sessions-compaction-checkpoints-DhmbBvpg.js").then((module) => module.sessionCheckpointHandlers),
	"sessions-compaction-queries": () => import("./sessions-compaction-queries-BdCSw6Px.js").then((module) => module.sessionCheckpointQueryHandlers),
	"sessions-create": () => import("./sessions-create-Jdqn6TKy.js").then((module) => module.sessionCreateHandlers),
	"sessions-recover": () => import("./sessions-recover-D6AnGUgg.js").then((module) => module.sessionRecoverHandlers),
	"sessions-delete": () => import("./sessions-delete-jM4L1r3i.js").then((module) => module.sessionDeleteHandlers),
	"sessions-dispatch": () => import("./sessions-dispatch-mPlu9Uwi.js").then((module) => module.sessionDispatchHandlers),
	"sessions-groups": () => import("./sessions-groups-DT5-xOIS.js").then((module) => module.sessionGroupHandlers),
	"sessions-messaging": () => import("./sessions-messaging-Bhl-tSW1.js").then((module) => module.sessionMessagingHandlers),
	"sessions-mutations": () => import("./sessions-mutations-CeuRLYJH.js").then((module) => module.sessionMutationHandlers),
	"sessions-read": () => import("./sessions-read-I-edPAm0.js").then((module) => module.sessionReadHandlers),
	"sessions-rewind": () => import("./sessions-rewind-DIVuL58p.js").then((module) => module.sessionRewindHandlers),
	"sessions-sharing": () => import("./sessions-sharing-BDr_Jz5U.js").then((module) => module.sessionSharingHandlers),
	"sessions-subscriptions": () => import("./sessions-subscriptions--9_qg8Q3.js").then((module) => module.sessionSubscriptionHandlers),
	"sessions-suggestions": () => import("./sessions-suggestions-CswbK6aQ.js").then((module) => module.sessionSuggestionHandlers),
	"session-catalog": () => import("./session-catalog-BIIJyNQu.js").then((module) => module.sessionCatalogHandlers),
	"session-discussion": () => import("./session-discussion-MUyoaMqT.js").then((module) => module.sessionDiscussionHandlers),
	"session-observer-rpc": () => import("./session-observer-rpc-Bxaf2ZP4.js").then((module) => module.sessionObserverHandlers),
	"session-companion-rpc": () => import("./session-companion-rpc-Bvda8cY8.js").then((module) => module.sessionCompanionHandlers),
	"hooks-status": () => import("./hooks-status-DV3wT_SY.js").then((module) => module.hooksStatusHandlers),
	skills: () => import("./skills-Czyq05Xp.js").then((module) => module.skillsHandlers),
	system: () => import("./system-Dh2ghvtO.js").then((module) => module.systemHandlers),
	talk: () => import("./talk-DQjabz4F.js").then((module) => module.talkHandlers),
	tasks: () => import("./tasks-DUm2489Y.js").then((module) => module.tasksHandlers),
	"task-suggestions": () => import("./task-suggestions-JDfc2X3N.js").then((module) => module.taskSuggestionsHandlers),
	"tools-catalog": () => import("./tools-catalog-BB58rEWe.js").then((module) => module.toolsCatalogHandlers),
	"tools-effective": () => import("./tools-effective-BP2JMiKX.js").then((module) => module.toolsEffectiveHandlers),
	"tools-invoke": () => import("./tools-invoke-CAa2caZX.js").then((module) => module.toolsInvokeHandlers),
	"mcp-app": () => import("./mcp-app-D2ipSSQU.js").then((module) => module.mcpAppHandlers),
	tts: () => import("./tts-Cmq3MauZ.js").then((module) => module.ttsHandlers),
	update: () => import("./update-D_ECTVdJ.js").then((module) => module.updateHandlers),
	usage: () => import("./usage-DUfkEFkW.js").then((module) => module.usageHandlers),
	"voicewake-routing": () => import("./voicewake-routing-raIc1FPN.js").then((module) => module.voicewakeRoutingHandlers),
	voicewake: () => import("./voicewake-BFeSi4dJ.js").then((module) => module.voicewakeHandlers),
	web: () => import("./web-BaezQwVj.js").then((module) => module.webHandlers),
	"system-agent": () => import("./system-agent-BW_PR9iH.js").then((module) => module.systemAgentHandlers),
	"system-changes": () => import("./system-changes-GbDi9zJY.js").then((module) => module.systemChangesHandlers),
	wizard: () => import("./wizard-Ke7_LWlZ.js").then((module) => module.wizardHandlers)
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
	if (params.context.unavailableGatewayMethods?.has(params.method)) return { error: errorShape(ErrorCodes.UNAVAILABLE, `${params.method} unavailable during gateway startup`, {
		retryable: true,
		retryAfterMs: 500,
		details: {
			...gatewayStartupUnavailableDetails(),
			method: params.method
		}
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
	const rootWorkAdmission = tryBeginGatewayRootWorkAdmission();
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
				reason: restartDraining ? "gateway-restarting" : "gateway-suspending",
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
			const staleInstallError = staleInstallErrorShape(error);
			if (staleInstallError) return await options.reject(staleInstallError);
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
		...authorization.sessionMutationAuthorization ? { sessionMutationAuthorization: authorization.sessionMutationAuthorization } : {}
	});
	await runWithGatewayRequestEnvelope(req.method, client, invokeHandler, {
		context,
		isWebchatConnect,
		methodRegistry,
		reject: (error) => respond(false, void 0, error)
	});
}
//#endregion
export { runWithGatewayRequestEnvelope as a, handleGatewayRequest as i, coreGatewayHandlers as n, createRequestGatewayMethodRegistry as r, authorizeGatewayRequestPreDispatch as t };
