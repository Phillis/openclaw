import { a as isPathInside, n as hasNodeErrorCode } from "./path-D138yf8v.js";
import "./path-guards-fBZukd5S.js";
import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import { n as resolveOpenClawPackageRootSync } from "./openclaw-root-DSkQ6e_8.js";
import { d as getActivePluginRegistry, l as getActivePluginHttpRouteRegistry } from "./runtime-CTbL314X.js";
import { g as createPluginGatewayMethodDescriptors, h as createGatewayMethodRegistry, m as createGatewayMethodDescriptorsFromHandlers } from "./loader-CwiP0Igf.js";
import { n as withPluginRuntimeGatewayRequestScope, t as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BULcX9xX.js";
import { l as isOperatorScope, t as ADMIN_SCOPE } from "./operator-scopes-Dw7Gu2cA.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { i as gatewayStartupUnavailableDetails } from "./startup-unavailable-CRTM-3cy.js";
import { n as createCoreGatewayMethodDescriptors, r as isCoreGatewayMethodClassified, s as listCoreGatewayHandlerMethodNames } from "./core-descriptors-CrDEzuuq.js";
import { n as authorizeOperatorScopesForMethod, r as authorizeOperatorScopesForRequiredScope, s as resolveLeastPrivilegeOperatorScopesForMethod } from "./method-scopes-rPUXjV_D.js";
import { _ as tryBeginGatewayRootWorkAdmission, a as getGatewaySuspendAdmissionPhase, o as isGatewayRestartDraining } from "./gateway-work-admission-QDz202p9.js";
import { c as missingScopeErrorShape, s as errorShape } from "./error-codes-CMSvT5-d.js";
import { f as resolveSessionMutationAuthorization, t as SessionMutationAuthorizationChangedError } from "./session-sharing-QTh4cZeN.js";
import { n as resolveControlPlaneActor, t as formatControlPlaneActor } from "./control-plane-audit-CN8L3SYx.js";
import { n as consumeControlPlaneWriteBudget, t as CONTROL_PLANE_RATE_LIMIT_WINDOW_MS } from "./control-plane-rate-limit-BtKY9m7Q.js";
import { n as parseGatewayRole, t as isRoleAuthorizedForMethod } from "./role-policy-9kY6IXGc.js";
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
	agent: () => import("./agent-BV-TKTz8.js").then((module) => module.agentHandlers),
	"agent-identity": () => import("./agent-identity-ZO1VVAfr.js").then((module) => module.agentIdentityHandlers),
	agents: () => import("./agents-DBHriqz_.js").then((module) => module.agentsHandlers),
	"agents-workspace": () => import("./agents-workspace-BbIRTC5G.js").then((module) => module.agentsWorkspaceHandlers),
	artifacts: () => import("./artifacts-DaREH7wv.js").then((module) => module.artifactsHandlers),
	board: () => import("./board-C5AX4-aW.js").then((module) => module.boardHandlers),
	audit: () => import("./audit-Dis63ZJ6.js").then((module) => module.auditHandlers),
	users: () => import("./users-Bw-3Sb2E.js").then((module) => module.usersHandlers),
	attach: () => import("./attach-DElQRi1Q.js").then((module) => module.attachHandlers),
	channels: () => import("./channels-D0kfxuD5.js").then((module) => module.channelsHandlers),
	"channel-pairing": () => import("./channel-pairing-GESjDH8Q.js").then((module) => module.channelPairingHandlers),
	chat: () => import("./chat-CCTy5vXU.js").then((module) => module.chatHandlers),
	commands: () => import("./commands-B4xO5ogU.js").then((module) => module.commandsHandlers),
	config: () => import("./config-BMExvz8o.js").then((module) => module.configHandlers),
	conversations: () => import("./conversations-DqW6DF-M.js").then((module) => module.conversationHandlers),
	connect: () => import("./connect-DQkIlbDI.js").then((module) => module.connectHandlers),
	"control-ui": () => import("./control-ui-BevvnZCu.js").then((module) => module.controlUiHandlers),
	cron: () => import("./cron-BN2LLM7H.js").then((module) => module.cronHandlers),
	devices: () => import("./devices-qlqPzDZy.js").then((module) => module.deviceHandlers),
	"device-pair-setup": () => import("./device-pair-setup-Cd7PKE1x.js").then((module) => module.devicePairSetupHandlers),
	diagnostics: () => import("./diagnostics-BScS6cDJ.js").then((module) => module.diagnosticsHandlers),
	doctor: () => import("./doctor-Fw0qeJdV.js").then((module) => module.doctorHandlers),
	environments: () => import("./environments-Cim1Pe0n.js").then((module) => module.environmentsHandlers),
	worktrees: () => import("./worktrees-CnbVbfwj.js").then((module) => module.worktreesHandlers),
	"exec-approvals": () => import("./exec-approvals-BNQLAi0p.js").then((module) => module.execApprovalsHandlers),
	fs: () => import("./fs-wH_mwHVy.js").then((module) => module.fsHandlers),
	health: () => import("./health-DUBZTUyV.js").then((module) => module.healthHandlers),
	logs: () => import("./logs-BFCDtFYu.js").then((module) => module.logsHandlers),
	"memory-search": () => import("./memory-search-CuF4co5_.js").then((module) => module.memorySearchHandlers),
	terminal: () => import("./terminal-DvKVGrOu.js").then((module) => module.terminalHandlers),
	"ui-command": () => import("./ui-command-DfnBVtCa.js").then((module) => module.uiCommandHandlers),
	"models-auth-status": () => import("./models-auth-status-CkERt25Z.js").then((module) => module.modelsAuthStatusHandlers),
	models: () => import("./models-B8xvtT67.js").then((module) => module.modelsHandlers),
	"models-probe": () => import("./models-probe-C6mxNncX.js").then((module) => module.modelsProbeHandlers),
	"native-hook-relay": () => import("./native-hook-relay-CS6SsihG.js").then((module) => module.nativeHookRelayHandlers),
	"nodes-pending": () => import("./nodes.pending-work-bmtPS8Fv.js").then((module) => module.nodePendingWorkHandlers),
	nodes: () => import("./nodes-cYmb9aNU.js").then((module) => module.nodeHandlers),
	"plugin-host-hooks": () => import("./plugin-host-hooks-DiH3xWCV.js").then((module) => module.pluginHostHookHandlers),
	plugins: () => import("./plugins-CyK68g6-.js").then((module) => module.pluginsHandlers),
	projects: () => import("./projects-CBg06yGn.js").then((module) => module.projectsHandlers),
	portals: () => import("./portals-BYzAyyFm.js").then((module) => module.portalHandlers),
	migrations: () => import("./migrations-CJP-LUKL.js").then((module) => module.migrationsHandlers),
	push: () => import("./push-BWRm1l1t.js").then((module) => module.pushHandlers),
	restart: () => import("./restart-pHFMTRxZ.js").then((module) => module.restartHandlers),
	suspend: () => import("./suspend-2f0katig.js").then((module) => module.suspendHandlers),
	send: () => import("./send-DaweWT3a.js").then((module) => module.sendHandlers),
	"sessions-files": () => import("./sessions-files-DcpQwDMV.js").then((module) => module.sessionsFilesHandlers),
	"sessions-diff": () => import("./sessions-diff-Ceip6ATd.js").then((module) => module.sessionsDiffHandlers),
	"sessions-abort": () => import("./sessions-abort-BI_4nfnj.js").then((module) => module.sessionAbortHandlers),
	"sessions-compact": () => import("./sessions-compact-hPm3Ulln.js").then((module) => module.sessionCompactHandlers),
	"sessions-compaction-checkpoints": () => import("./sessions-compaction-checkpoints-BBh0tB23.js").then((module) => module.sessionCheckpointHandlers),
	"sessions-compaction-queries": () => import("./sessions-compaction-queries-2ro3i5Va.js").then((module) => module.sessionCheckpointQueryHandlers),
	"sessions-create": () => import("./sessions-create-BJZ7LSCh.js").then((module) => module.sessionCreateHandlers),
	"sessions-recover": () => import("./sessions-recover-D_ImxdcF.js").then((module) => module.sessionRecoverHandlers),
	"sessions-delete": () => import("./sessions-delete-S459aHSa.js").then((module) => module.sessionDeleteHandlers),
	"sessions-dispatch": () => import("./sessions-dispatch-B_jRbUkf.js").then((module) => module.sessionDispatchHandlers),
	"sessions-groups": () => import("./sessions-groups-CXsVi46R.js").then((module) => module.sessionGroupHandlers),
	"sessions-messaging": () => import("./sessions-messaging-DcmJDdoz.js").then((module) => module.sessionMessagingHandlers),
	"sessions-mutations": () => import("./sessions-mutations-kbVi-h-R.js").then((module) => module.sessionMutationHandlers),
	"sessions-read": () => import("./sessions-read-vF6k_cqv.js").then((module) => module.sessionReadHandlers),
	"sessions-rewind": () => import("./sessions-rewind-Df-wY4y4.js").then((module) => module.sessionRewindHandlers),
	"sessions-sharing": () => import("./sessions-sharing-B8meTGN5.js").then((module) => module.sessionSharingHandlers),
	"sessions-subscriptions": () => import("./sessions-subscriptions-BmfMPiy0.js").then((module) => module.sessionSubscriptionHandlers),
	"sessions-suggestions": () => import("./sessions-suggestions-2I0oI8Jw.js").then((module) => module.sessionSuggestionHandlers),
	"session-catalog": () => import("./session-catalog-BfqzP5np.js").then((module) => module.sessionCatalogHandlers),
	"session-discussion": () => import("./session-discussion-CJbKwNAo.js").then((module) => module.sessionDiscussionHandlers),
	"session-observer-rpc": () => import("./session-observer-rpc-DZX-SV-T.js").then((module) => module.sessionObserverHandlers),
	"session-companion-rpc": () => import("./session-companion-rpc-qR_34LOr.js").then((module) => module.sessionCompanionHandlers),
	"hooks-status": () => import("./hooks-status-BNdDhz4j.js").then((module) => module.hooksStatusHandlers),
	skills: () => import("./skills-BAq0EurV.js").then((module) => module.skillsHandlers),
	system: () => import("./system-CfRB4wl4.js").then((module) => module.systemHandlers),
	talk: () => import("./talk-DuLZj5vM.js").then((module) => module.talkHandlers),
	tasks: () => import("./tasks-l30JJX34.js").then((module) => module.tasksHandlers),
	"task-suggestions": () => import("./task-suggestions-Cg4tSzYF.js").then((module) => module.taskSuggestionsHandlers),
	"tools-catalog": () => import("./tools-catalog-B8xBzkqk.js").then((module) => module.toolsCatalogHandlers),
	"tools-effective": () => import("./tools-effective-1I9LX3w3.js").then((module) => module.toolsEffectiveHandlers),
	"tools-invoke": () => import("./tools-invoke-ByFBw1wO.js").then((module) => module.toolsInvokeHandlers),
	"mcp-app": () => import("./mcp-app-KfTNRuNN.js").then((module) => module.mcpAppHandlers),
	tts: () => import("./tts-C7IOn7kA.js").then((module) => module.ttsHandlers),
	update: () => import("./update-Djib_Mvk.js").then((module) => module.updateHandlers),
	usage: () => import("./usage-CIvMgM7H.js").then((module) => module.usageHandlers),
	"voicewake-routing": () => import("./voicewake-routing-DRh97iPN.js").then((module) => module.voicewakeRoutingHandlers),
	voicewake: () => import("./voicewake-DItEUyDp.js").then((module) => module.voicewakeHandlers),
	web: () => import("./web-B0rn8ET0.js").then((module) => module.webHandlers),
	"system-agent": () => import("./system-agent-T2w2DjgQ.js").then((module) => module.systemAgentHandlers),
	"system-changes": () => import("./system-changes-BP6263xY.js").then((module) => module.systemChangesHandlers),
	wizard: () => import("./wizard-CQ29KvlO.js").then((module) => module.wizardHandlers)
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
