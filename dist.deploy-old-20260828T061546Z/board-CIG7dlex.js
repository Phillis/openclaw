import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { h as resolveSessionAgentId } from "./agent-scope-DigoIwHb.js";
import { s as resolveAgentConfig } from "./agent-scope-config-CUBiGmG3.js";
import { t as validateJsonSchemaValue } from "./schema-validator-yfJyG0DX.js";
import { o as isPluginRegistryLifecycleEpochActive, r as capturePluginRegistryLifecycleEpoch } from "./registry-lifecycle-DYhl0RY-.js";
import { d as getActivePluginRegistry } from "./runtime-B2KAtS3O.js";
import { i as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-B19X7f09.js";
import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { A as validateBoardWidgetContent, C as validateBoardActionParams, D as validateBoardPromptAuthorizeParams, E as validateBoardGetParams, M as validateBoardWidgetPutParams, O as validateBoardUpdateParams, T as validateBoardEventParams, j as validateBoardWidgetGrantParams, k as validateBoardWidgetAppViewParams, w as validateBoardDataReadParams } from "./src-4dv5TpeQ.js";
import { r as resolveSessionStoreKey } from "./session-store-key-DRF7yKG5.js";
import { p as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-Ik-U-wpI.js";
import { l as isGatewaySubordinateWorkAdmissionClosed } from "./gateway-work-admission-CTDt7IQ1.js";
import { a as enqueueSystemEvent } from "./system-events-BVZAS_Ok.js";
import "./session-accessor-fcDZuc2H.js";
import { a as createBoardViewTicket, i as buildBoardWidgetFrameUrl, n as BOARD_VIEW_TICKET_TTL_MS, r as BoardGatewayUnavailableError } from "./board-view-ticket-CzaUvvHs.js";
import { d as errorShape } from "./validation-errors-rELRlKfn.js";
import { a as resolveBoardWidgetContentKindResourceUrls, c as CORE_BOARD_DATA_BINDING_IDS, i as resolveBoardWidgetContentKindByPluginKind, r as resolveBoardWidgetContentKind } from "./board-widget-content-kinds-DiWZfBNV.js";
import "./exec-approvals-PtbcLeQo.js";
import { s as loadExecApprovalsReadOnly } from "./exec-approvals-generated-migration-KEjNHNyB.js";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-C9E8iDY4.js";
import { n as readCanvasDocumentHtmlSource } from "./documents-CrnqL8aM.js";
import { a as BoardValidationError, n as boardWidgetHasGrantedTool, r as normalizeBoardWidgetDeclared } from "./board-capabilities-hTT3cLrc.js";
import { t as buildWidgetDocument } from "./wrap-DanFiQH0.js";
import { t as resolveExecDefaults } from "./exec-defaults-DFjm1Q5i.js";
import { i as resolveExecAutoReviewDecision } from "./exec-auto-review-Biuf1fPP.js";
import { n as defineValidatedGatewayMethod, t as assertValidParams } from "./validation-kYFXohur.js";
import { a as resolveMcpAppActiveView, c as mintMcpAppViewFromTranscript, i as requireMcpAppInteraction, o as resolveMcpAppAllowedToolNames } from "./mcp-app-operations-C0pyoRlp.js";
import { r as buildBoardWidgetSandboxPath, t as resolveAuthorizedBoardWidgetView } from "./board-widget-view-DqNlQvpB.js";
import { t as boardStore } from "./board-store-BK3Pp_I8.js";
import { t as agentsHandlers } from "./agents-CJCFPS5r.js";
import { t as cronHandlers } from "./cron-kreU5QP3.js";
import { t as healthHandlers } from "./health-BVrsyoTw.js";
import { t as sessionReadHandlers } from "./sessions-read-aDkkNica.js";
import { t as usageHandlers } from "./usage-CqgC9W6q.js";
import { p as sessionObserverScopeKey } from "./session-observer-model-CHUEX8KS.js";
//#region src/boards/board-notices.ts
const BOARD_EVENT_MAX_BYTES = 8 * 1024;
const BOARD_NOTICE_MAX_CHARS = 500;
const BOARD_EVENT_DEDUPE_MS = 5e3;
const recentNotices = /* @__PURE__ */ new Map();
var BoardEventPayloadError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "BoardEventPayloadError";
	}
};
function serializePayload(payload) {
	try {
		const serialized = JSON.stringify(payload);
		return serialized === void 0 ? String(payload) : serialized;
	} catch {
		throw new BoardEventPayloadError("board event payload must be JSON serializable");
	}
}
function formatNotice(widget, summary) {
	const prefix = "[dashboard] ";
	const suffix = ` on widget ${widget}`;
	const available = BOARD_NOTICE_MAX_CHARS - 12 - suffix.length;
	return `${prefix}${summary.length <= available ? summary : `${truncateUtf16Safe(summary, Math.max(0, available - 1))}…`}${suffix}`;
}
function appendBoardEventNotice(params) {
	const summary = serializePayload(params.payload);
	if (Buffer.byteLength(summary, "utf8") > BOARD_EVENT_MAX_BYTES) throw new BoardEventPayloadError(`board event payload exceeds ${BOARD_EVENT_MAX_BYTES} bytes`);
	const now = params.now ?? Date.now();
	const key = `${params.sessionKey}\0${params.widget}`;
	const recent = recentNotices.get(key);
	if (recent?.summary === summary && now - recent.at < BOARD_EVENT_DEDUPE_MS) return false;
	recentNotices.set(key, {
		summary,
		at: now
	});
	for (const [candidate, notice] of recentNotices) if (now - notice.at >= BOARD_EVENT_DEDUPE_MS) recentNotices.delete(candidate);
	return enqueueSystemEvent(formatNotice(params.widget, summary), {
		sessionKey: params.sessionKey,
		contextKey: `dashboard:${params.widget}:${now}`
	});
}
//#endregion
//#region src/gateway/board-host-tools.ts
function captureBoardRequestAuthority(invocation) {
	const context = invocation.context;
	const resolveGatewayContext = context.resolveGatewayContext;
	if (!resolveGatewayContext) throw new BoardGatewayUnavailableError();
	const methodRegistry = context.getGatewayMethodRegistry?.();
	const pluginRegistry = getPluginRuntimeGatewayRequestScope()?.pluginRegistry ?? getActivePluginRegistry() ?? void 0;
	const pluginRegistryEpoch = pluginRegistry ? capturePluginRegistryLifecycleEpoch(pluginRegistry) : void 0;
	const assertActive = () => {
		try {
			if (isGatewaySubordinateWorkAdmissionClosed() || resolveGatewayContext() !== context || context.resolveGatewayContext !== resolveGatewayContext || methodRegistry && context.getGatewayMethodRegistry?.() !== methodRegistry || pluginRegistry && (!pluginRegistryEpoch || !isPluginRegistryLifecycleEpochActive(pluginRegistry, pluginRegistryEpoch))) throw new BoardGatewayUnavailableError();
		} catch (error) {
			if (error instanceof BoardGatewayUnavailableError) throw error;
			throw new BoardGatewayUnavailableError();
		}
	};
	assertActive();
	return {
		assertActive,
		...pluginRegistry ? { pluginRegistry } : {},
		ticketAuthority: {
			gatewayContext: context,
			resolveGatewayContext,
			...pluginRegistry ? { pluginRegistry } : {}
		}
	};
}
function respondBoardError(error, respond) {
	if (error instanceof BoardGatewayUnavailableError) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error.message));
		return;
	}
	if (error instanceof BoardValidationError || error instanceof BoardEventPayloadError) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message));
		return;
	}
	respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(error)));
}
const BOARD_DATA_HANDLERS = {
	"sessions.list": sessionReadHandlers["sessions.list"],
	"usage.status": (invocation) => usageHandlers["usage.status"]({
		...invocation,
		client: null
	}),
	"usage.cost": usageHandlers["usage.cost"],
	"cron.list": cronHandlers["cron.list"],
	"cron.status": cronHandlers["cron.status"],
	"agents.list": agentsHandlers["agents.list"],
	health: healthHandlers.health
};
function isBoardDataBindingId(value) {
	return CORE_BOARD_DATA_BINDING_IDS.includes(value);
}
async function invokeGatewayHandler(handler, method, params, invocation, authority) {
	let didRespond = false;
	let succeeded = false;
	let payload;
	let responseError;
	authority.assertActive();
	await handler({
		...invocation,
		req: {
			...invocation.req,
			method,
			params
		},
		params,
		respond: (ok, value, error) => {
			if (didRespond) return;
			didRespond = true;
			if (ok) {
				succeeded = true;
				payload = value;
			} else responseError = error;
		}
	});
	authority.assertActive();
	if (!didRespond) throw new BoardValidationError("invalid_operation", `${method} did not return a result`);
	if (!succeeded) throw new BoardValidationError("invalid_operation", responseError?.message || `${method} failed`);
	return payload;
}
async function readBoardDataBinding(bindingId, params, invocation, authority = captureBoardRequestAuthority(invocation)) {
	if (isBoardDataBindingId(bindingId)) return await invokeGatewayHandler(BOARD_DATA_HANDLERS[bindingId], bindingId, params, invocation, authority);
	const registration = authority.pluginRegistry?.dashboardDataBindings.get(bindingId);
	if (!registration) throw new BoardValidationError("invalid_operation", `board widget data binding is not allowed: ${bindingId}`);
	return await invokeGatewayHandler(registration.handler, registration.method, params, invocation, authority);
}
async function runBoardActionVerb(actionId, params, invocation, authority = captureBoardRequestAuthority(invocation)) {
	const registration = authority.pluginRegistry?.dashboardActionVerbs.get(actionId);
	if (!registration) throw new BoardValidationError("invalid_operation", `board widget action verb is not allowed: ${actionId}`);
	if (registration.paramShape) {
		const validation = validateJsonSchemaValue({
			schema: registration.paramShape,
			cacheKey: `dashboard-action:${registration.pluginId}:${registration.id}`,
			value: params
		});
		if (!validation.ok) throw new BoardValidationError("invalid_operation", `board widget action params do not match ${actionId}: ${validation.errors.map((error) => error.text).join(", ")}`);
	}
	return await invokeGatewayHandler(registration.handler, registration.method, params, invocation, authority);
}
async function triggerBoardCronJob(jobId, invocation, authority = captureBoardRequestAuthority(invocation)) {
	return await invokeGatewayHandler(cronHandlers["cron.run"], "cron.run", {
		id: jobId,
		mode: "force"
	}, invocation, authority);
}
//#endregion
//#region src/gateway/server-methods/board.ts
const defaultMcpAppDependencies = {
	resolveActiveView: resolveMcpAppActiveView,
	resolveAllowedToolNames: resolveMcpAppAllowedToolNames,
	mintFromTranscript: mintMcpAppViewFromTranscript
};
function resolveBoardSessionKey(params, context, respond) {
	const cfg = context.getRuntimeConfig();
	const requested = resolveRequestedSessionAgentId(cfg, params.sessionKey, params.agentId);
	if (!requested.ok) {
		respond(false, void 0, requested.error);
		return;
	}
	return sessionObserverScopeKey(resolveSessionStoreKey({
		cfg,
		sessionKey: params.sessionKey,
		storeAgentId: requested.agentId
	}), requested.agentId);
}
function assertCapabilityParamsSize(params, capability) {
	if (Buffer.byteLength(JSON.stringify(params), "utf8") > 8 * 1024) throw new BoardValidationError("invalid_operation", `board widget ${capability} params exceed 8192 UTF-8 bytes`);
}
async function resolveBoardWidgetApproval(params) {
	const { cfg, sessionKey, name, declared } = params;
	const agentId = resolveSessionAgentId({
		sessionKey,
		config: cfg
	});
	const mode = resolveExecDefaults({
		cfg,
		agentId,
		sessionKey,
		sessionEntry: loadSessionEntryReadOnly({
			sessionKey,
			agentId
		}),
		execApprovals: loadExecApprovalsReadOnly()
	}).mode;
	if (mode === "ask") return;
	if (mode !== "auto") return mode === "full" ? "granted" : "rejected";
	const { createModelExecAutoReviewer } = await import("./exec-auto-reviewer-BWGYNq1x.js");
	const review = await resolveExecAutoReviewDecision(createModelExecAutoReviewer({
		cfg,
		agentId,
		reviewer: resolveAgentConfig(cfg, agentId)?.tools?.exec?.reviewer ?? cfg.tools?.exec?.reviewer
	}), {
		kind: "board-widget",
		name,
		declared,
		agent: {
			id: agentId,
			sessionKey
		}
	});
	return review.decision === "allow-once" && review.risk === "low" ? "granted" : "rejected";
}
function createBoardHandlers(store, appendNotice = appendBoardEventNotice, readCanvasDocument = readCanvasDocumentHtmlSource, dependencies = {}) {
	const mcpApp = {
		resolveActiveView: dependencies.resolveActiveView ?? defaultMcpAppDependencies.resolveActiveView,
		resolveAllowedToolNames: dependencies.resolveAllowedToolNames ?? defaultMcpAppDependencies.resolveAllowedToolNames,
		mintFromTranscript: dependencies.mintFromTranscript ?? defaultMcpAppDependencies.mintFromTranscript
	};
	const readDataBinding = dependencies.readDataBinding ?? readBoardDataBinding;
	const runActionVerb = dependencies.runActionVerb ?? runBoardActionVerb;
	const triggerCronJob = dependencies.triggerCronJob ?? triggerBoardCronJob;
	return {
		"board.get": defineValidatedGatewayMethod("board.get", validateBoardGetParams, async (invocation) => {
			const { params: boardParams, respond, context, client } = invocation;
			try {
				const authority = captureBoardRequestAuthority(invocation);
				const boardSessionKey = resolveBoardSessionKey(boardParams, context, respond);
				if (!boardSessionKey) return;
				const { snapshot, htmlViewMetadata } = store.getSnapshotWithHtmlViewMetadata(boardSessionKey);
				let sandboxPort = context.getMcpAppSandboxPort?.();
				let sandboxOrigin;
				let sandboxOriginResolved = false;
				for (const widget of snapshot.widgets) {
					if (widget.grantState !== "none" && widget.grantState !== "granted") continue;
					const viewMetadata = htmlViewMetadata.get(widget.name);
					if (!viewMetadata || viewMetadata.revision !== widget.revision) continue;
					const registration = widget.pluginKind ? resolveBoardWidgetContentKindByPluginKind(authority.pluginRegistry, widget.pluginKind) : void 0;
					const scopedHostUrl = registration ? client?.pluginSurfaceUrls?.[registration.definition.resources.surface] : void 0;
					const resourceUrls = registration && scopedHostUrl ? resolveBoardWidgetContentKindResourceUrls(registration, scopedHostUrl) : void 0;
					if (widget.contentKind === "plugin" && (!registration || !resourceUrls || !scopedHostUrl)) continue;
					const resourceOrigins = resourceUrls ? [...new Set(Object.values(resourceUrls).map((url) => new URL(url).origin))] : void 0;
					if (sandboxPort === void 0 && context.ensureSandboxHostPort) {
						sandboxPort = await context.ensureSandboxHostPort();
						authority.assertActive();
					}
					authority.assertActive();
					const { ticket } = createBoardViewTicket({
						sessionKey: snapshot.sessionKey,
						name: widget.name,
						revision: widget.revision,
						viewGeneration: viewMetadata.viewGeneration,
						...registration && scopedHostUrl ? { pluginFrame: {
							pluginKind: registration.pluginKind,
							scopedHostUrl
						} } : {},
						authority: authority.ticketAuthority
					});
					if (registration) widget.kindLabel = registration.definition.label;
					widget.frameUrl = buildBoardWidgetFrameUrl({
						sessionKey: snapshot.sessionKey,
						name: widget.name,
						ticket
					});
					widget.viewTicket = ticket;
					widget.viewTicketTtlMs = BOARD_VIEW_TICKET_TTL_MS;
					widget.viewGeneration = viewMetadata.viewGeneration;
					if (sandboxPort !== void 0) {
						widget.sandboxUrl = buildBoardWidgetSandboxPath({
							...viewMetadata,
							...resourceOrigins ? { resourceOrigins } : {}
						});
						widget.sandboxPort = sandboxPort;
						if (!sandboxOriginResolved) {
							const configuredOrigin = context.getRuntimeConfig?.().mcp?.apps?.sandboxOrigin;
							sandboxOrigin = configuredOrigin ? new URL(configuredOrigin).origin : void 0;
							sandboxOriginResolved = true;
						}
						if (sandboxOrigin) widget.sandboxOrigin = sandboxOrigin;
					}
				}
				authority.assertActive();
				respond(true, snapshot);
			} catch (error) {
				respondBoardError(error, respond);
			}
		}),
		"board.update": defineValidatedGatewayMethod("board.update", validateBoardUpdateParams, (invocation) => {
			const { params: boardParams, respond, context } = invocation;
			try {
				const authority = captureBoardRequestAuthority(invocation);
				const boardSessionKey = resolveBoardSessionKey(boardParams, context, respond);
				if (!boardSessionKey) return;
				authority.assertActive();
				const snapshot = store.applyOps(boardSessionKey, boardParams.ops);
				if (boardParams.ops.length > 0) context.broadcast("board.changed", {
					sessionKey: snapshot.sessionKey,
					revision: snapshot.revision
				});
				respond(true, snapshot);
			} catch (error) {
				respondBoardError(error, respond);
			}
		}),
		"board.widget.put": defineValidatedGatewayMethod("board.widget.put", validateBoardWidgetPutParams, async (invocation) => {
			const { params: requestParams, respond, context } = invocation;
			try {
				const authority = captureBoardRequestAuthority(invocation);
				const requestedBoardSessionKey = resolveBoardSessionKey(requestParams, context, respond);
				if (!requestedBoardSessionKey) return;
				const boardSessionKey = store.getSnapshot(requestedBoardSessionKey).sessionKey;
				const { agentId: _agentId, declared: requestDeclared, ...requestWithoutDeclared } = requestParams;
				let content;
				let declared = requestDeclared;
				if (requestParams.content.kind === "canvas-doc") {
					const document = await readCanvasDocument(requestParams.content.docId);
					authority.assertActive();
					if (document.cspSandbox !== "scripts") throw new BoardValidationError("invalid_operation", `canvas document is not script-enabled: ${requestParams.content.docId}`);
					content = {
						kind: "html",
						html: document.html
					};
				} else if (requestParams.content.kind === "mcp-app") {
					const active = await mcpApp.resolveActiveView({
						sessionKey: boardSessionKey,
						viewId: requestParams.content.viewId,
						cfg: context.getRuntimeConfig()
					});
					authority.assertActive();
					const { view } = active;
					if (!view.toolCallId) throw new BoardValidationError("invalid_operation", "MCP App view is missing its originating tool call");
					let interactive = false;
					try {
						await requireMcpAppInteraction(view);
						interactive = true;
					} catch {}
					authority.assertActive();
					const allowedTools = interactive ? await mcpApp.resolveAllowedToolNames(active) : [];
					authority.assertActive();
					if (interactive) {
						try {
							await requireMcpAppInteraction(view);
						} catch {
							interactive = false;
						}
						authority.assertActive();
					}
					content = {
						kind: "mcp-app",
						descriptor: {
							serverName: view.serverName,
							toolName: view.toolName,
							uiResourceUri: view.uiResourceUri,
							toolCallId: view.toolCallId
						},
						interactive
					};
					declared = interactive && allowedTools.length > 0 ? { tools: allowedTools } : void 0;
				} else if (requestParams.content.kind === "registered") {
					const registration = resolveBoardWidgetContentKind(authority.pluginRegistry, requestParams.content.contentKind);
					if (!registration) throw new BoardValidationError("invalid_operation", `widget kind ${JSON.stringify(requestParams.content.contentKind)} is unavailable; enable the plugin that provides it and retry`);
					try {
						registration.definition.validateSource(requestParams.content.source);
					} catch (error) {
						throw new BoardValidationError("invalid_operation", `invalid ${requestParams.content.contentKind} widget source: ${String(error)}`);
					}
					content = {
						...requestParams.content,
						pluginKind: registration.pluginKind
					};
				} else content = requestParams.content;
				if (!assertValidParams(content.kind === "mcp-app" ? {
					kind: content.kind,
					descriptor: content.descriptor
				} : content.kind === "registered" ? {
					kind: content.kind,
					contentKind: content.contentKind,
					source: content.source
				} : content, validateBoardWidgetContent, "board.widget.put content", respond)) return;
				declared = normalizeBoardWidgetDeclared(declared);
				const materializedContent = content.kind === "html" ? {
					kind: "html",
					html: buildWidgetDocument(requestParams.title ?? requestParams.name, content.html, { connectOrigins: declared?.netOrigins })
				} : content;
				const boardParams = {
					...requestWithoutDeclared,
					sessionKey: boardSessionKey,
					content: materializedContent,
					...declared ? { declared } : {}
				};
				authority.assertActive();
				let snapshot = store.putWidget(boardParams);
				const widget = snapshot.widgets.find((candidate) => candidate.name === snapshot.resolvedWidgetName);
				if (widget?.grantState === "pending") {
					const decision = await resolveBoardWidgetApproval({
						cfg: context.getRuntimeConfig(),
						sessionKey: snapshot.sessionKey,
						name: snapshot.resolvedWidgetName,
						declared: declared ?? {}
					});
					authority.assertActive();
					if (decision) snapshot = {
						...store.grant(snapshot.sessionKey, snapshot.resolvedWidgetName, decision, widget.revision, widget.instanceId),
						resolvedWidgetName: snapshot.resolvedWidgetName
					};
				}
				context.broadcast("board.changed", {
					sessionKey: snapshot.sessionKey,
					revision: snapshot.revision,
					widget: snapshot.resolvedWidgetName
				});
				respond(true, snapshot);
			} catch (error) {
				respondBoardError(error, respond);
			}
		}),
		"board.widget.grant": defineValidatedGatewayMethod("board.widget.grant", validateBoardWidgetGrantParams, (invocation) => {
			const { params: boardParams, respond, context } = invocation;
			try {
				const authority = captureBoardRequestAuthority(invocation);
				const boardSessionKey = resolveBoardSessionKey(boardParams, context, respond);
				if (!boardSessionKey) return;
				authority.assertActive();
				const snapshot = store.grant(boardSessionKey, boardParams.name, boardParams.decision, boardParams.revision, boardParams.instanceId);
				context.broadcast("board.changed", {
					sessionKey: snapshot.sessionKey,
					revision: snapshot.revision
				});
				respond(true, snapshot);
			} catch (error) {
				respondBoardError(error, respond);
			}
		}),
		"board.widget.appView": defineValidatedGatewayMethod("board.widget.appView", validateBoardWidgetAppViewParams, async ({ params: boardParams, respond, context }) => {
			try {
				const boardSessionKey = resolveBoardSessionKey(boardParams, context, respond);
				if (!boardSessionKey) return;
				const snapshot = store.getSnapshot(boardSessionKey);
				const widget = snapshot.widgets.find((candidate) => candidate.name === boardParams.name);
				const document = store.readWidgetMcpApp(snapshot.sessionKey, boardParams.name);
				if (!widget || widget.contentKind !== "mcp-app" || widget.revision !== boardParams.revision || widget.instanceId !== boardParams.instanceId || !document || document.revision !== boardParams.revision || document.instanceId !== boardParams.instanceId) throw new BoardValidationError("not_found", `board MCP App widget not found: ${boardParams.name}`);
				const interactive = document.interactive && document.grantState === "granted";
				const authorizeAppInteraction = interactive ? () => {
					const current = store.readWidgetMcpApp(snapshot.sessionKey, boardParams.name);
					return current?.interactive === true && current.grantState === "granted" && current.revision === boardParams.revision && current.instanceId === boardParams.instanceId;
				} : void 0;
				const minted = await mcpApp.mintFromTranscript({
					cfg: context.getRuntimeConfig(),
					sessionKey: snapshot.sessionKey,
					descriptor: document.descriptor,
					allowedAppToolNames: new Set(interactive ? document.declaredTools : []),
					...authorizeAppInteraction ? { authorizeAppInteraction } : {},
					readOnly: !interactive
				});
				if (!minted) throw new Error("Pinned MCP App source is no longer available");
				respond(true, {
					viewId: minted.view.viewId,
					expiresAtMs: minted.view.expiresAtMs
				});
			} catch (error) {
				respondBoardError(error, respond);
			}
		}),
		"board.event": defineValidatedGatewayMethod("board.event", validateBoardEventParams, (invocation) => {
			const { params: boardParams, respond, context } = invocation;
			try {
				const authority = captureBoardRequestAuthority(invocation);
				const identity = "ticket" in boardParams ? resolveAuthorizedBoardWidgetView(store, boardParams.ticket, { gatewayContext: context }) : (() => {
					const boardSessionKey = resolveBoardSessionKey(boardParams, context, respond);
					if (!boardSessionKey) return;
					const snapshot = store.getSnapshot(boardSessionKey);
					if (!snapshot.widgets.some((candidate) => candidate.name === boardParams.widget)) throw new BoardValidationError("not_found", `board widget not found: ${boardParams.widget}`);
					return {
						sessionKey: snapshot.sessionKey,
						name: boardParams.widget
					};
				})();
				if (!identity) return;
				authority.assertActive();
				respond(true, {
					ok: true,
					appended: appendNotice({
						sessionKey: identity.sessionKey,
						widget: identity.name,
						payload: boardParams.payload
					})
				});
			} catch (error) {
				respondBoardError(error, respond);
			}
		}),
		"board.prompt.authorize": defineValidatedGatewayMethod("board.prompt.authorize", validateBoardPromptAuthorizeParams, (invocation) => {
			const { params: boardParams, respond, context } = invocation;
			try {
				const authority = captureBoardRequestAuthority(invocation);
				const { document } = resolveAuthorizedBoardWidgetView(store, boardParams.ticket, { gatewayContext: context });
				authority.assertActive();
				respond(true, { confirmationRequired: !boardWidgetHasGrantedTool(document.declared, document.grantState, "prompt") });
			} catch (error) {
				respondBoardError(error, respond);
			}
		}),
		"board.data.read": defineValidatedGatewayMethod("board.data.read", validateBoardDataReadParams, async (invocation) => {
			const { params: boardParams, respond, context } = invocation;
			try {
				const authority = captureBoardRequestAuthority(invocation);
				const bindingParams = boardParams.params ?? {};
				assertCapabilityParamsSize(bindingParams, "data binding");
				const { document } = resolveAuthorizedBoardWidgetView(store, boardParams.ticket, { gatewayContext: context });
				if (!boardWidgetHasGrantedTool(document.declared, document.grantState, boardParams.bindingId)) throw new BoardValidationError("invalid_operation", `board widget tool is not granted: ${boardParams.bindingId}`);
				const result = await readDataBinding(boardParams.bindingId, bindingParams, invocation, authority);
				authority.assertActive();
				respond(true, result);
			} catch (error) {
				respondBoardError(error, respond);
			}
		}),
		"board.action": defineValidatedGatewayMethod("board.action", validateBoardActionParams, async (invocation) => {
			const { params: boardParams, respond, context } = invocation;
			try {
				const authority = captureBoardRequestAuthority(invocation);
				const { document } = resolveAuthorizedBoardWidgetView(store, boardParams.ticket, { gatewayContext: context });
				const capability = "jobId" in boardParams ? `cron.trigger:${boardParams.jobId}` : boardParams.action;
				if (!boardWidgetHasGrantedTool(document.declared, document.grantState, capability)) throw new BoardValidationError("invalid_operation", `board widget tool is not granted: ${capability}`);
				if ("jobId" in boardParams) {
					const result = await triggerCronJob(boardParams.jobId, invocation, authority);
					authority.assertActive();
					respond(true, result);
					return;
				}
				const actionParams = boardParams.params ?? {};
				assertCapabilityParamsSize(actionParams, "action");
				const result = await runActionVerb(boardParams.action, actionParams, invocation, authority);
				authority.assertActive();
				respond(true, result);
			} catch (error) {
				respondBoardError(error, respond);
			}
		})
	};
}
const boardHandlers = createBoardHandlers(boardStore);
//#endregion
export { boardHandlers };
