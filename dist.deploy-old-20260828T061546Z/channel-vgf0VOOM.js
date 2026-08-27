import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { a as listAgentIds, s as resolveAgentConfig } from "./agent-scope-config-CUBiGmG3.js";
import { t as DEFAULT_ACCOUNT_ID } from "./account-id-BH0zJUew.js";
import { At as boolean, Et as array, Nn as record, Rn as string, St as _null, Tn as object, Xn as union, Zn as unknown, dn as literal, wn as number, yt as _enum } from "./schemas-CZ9Toj_c.js";
import { l as readRequestBodyWithLimit, s as isRequestBodyLimitError } from "./http-body-DthsuKdw.js";
import { b as ssrfPolicyFromHttpBaseUrlAllowedOrigin } from "./ssrf-arYIaOWE.js";
import { i as fetchWithSsrFGuard } from "./fetch-guard-Dt4YqBT2.js";
import { p as defineChannelMessageAdapter } from "./channel-outbound-DO-F9-0m.js";
import { t as createMessageReceiptFromOutboundResults } from "./receipt-BzekpwQi.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import "./agent-scope-runtime-D15-6dFI.js";
import { i as createChatChannelPlugin, t as buildChannelOutboundSessionRoute } from "./core-CQsT-38z.js";
import { r as resolveChannelInboundRouteEnvelope } from "./envelope-C88XYhn2.js";
import "./channel-inbound-BmDzyYQ4.js";
import { a as waitUntilAbort } from "./channel-lifecycle.core-CnejcREy.js";
import "./ssrf-runtime-CIuLn0o4.js";
import { i as channelStoppedPatch, r as channelReadyPatch } from "./gateway-runtime-BOxS77yr.js";
import { d as createDefaultChannelRuntimeState, u as createComputedAccountStatusAdapter } from "./status-helpers-CopMHs_f.js";
import "./channel-core-DYDgmix_.js";
import { s as resolveStableChannelMessageIngress } from "./channel-ingress-runtime-BxqYlzv5.js";
import "./webhook-ingress-ByuWujwG.js";
import { l as runDetachedWebhookWork } from "./webhook-request-guards-BYzmIdMp.js";
import { t as registerPluginHttpRoute } from "./http-registry-BjvSX18D.js";
import { r as resolveA2aChannelAccount, t as createA2aChannelPluginBase } from "./channel-base-s-6jsRwi.js";
import { t as getA2aChannelRuntime } from "./runtime-vVzCzqsn.js";
import { createHash, randomUUID, timingSafeEqual } from "node:crypto";
//#region extensions/a2a/src/protocol.ts
const A2A_CONTEXT_PATTERN = /^[A-Za-z0-9._:-]{1,128}$/;
const A2A_MESSAGE_MAX_BYTES = 64 * 1024;
const A2A_TRUNCATION_MARKER = `\n[message truncated at ${A2A_MESSAGE_MAX_BYTES} bytes]`;
const A2aRpcRequestSchema = object({
	jsonrpc: literal("2.0"),
	id: union([
		string(),
		number().finite(),
		_null()
	]).optional(),
	method: string().min(1),
	params: unknown().optional()
});
const A2aMetadataSchema = record(string(), unknown());
const A2aInboundPartSchema = object({
	text: string().optional(),
	data: unknown().optional()
});
const A2aSendMessageParamsSchema = object({
	message: object({
		messageId: string().min(1).optional(),
		contextId: string().regex(A2A_CONTEXT_PATTERN).optional(),
		taskId: string().min(1).optional(),
		role: _enum([
			"ROLE_USER",
			"ROLE_AGENT",
			"user",
			"agent"
		]),
		parts: array(unknown()),
		metadata: A2aMetadataSchema.optional()
	}),
	configuration: object({
		acceptedOutputModes: array(string()).optional(),
		historyLength: number().int().nonnegative().optional(),
		returnImmediately: boolean().optional()
	}).optional(),
	tenant: string().optional(),
	metadata: A2aMetadataSchema.optional()
});
const A2aTaskRequestParamsSchema = object({
	id: string().min(1),
	historyLength: number().int().nonnegative().optional(),
	tenant: string().optional()
});
const A2A_METHOD_ALIASES = {
	SendMessage: "SendMessage",
	GetTask: "GetTask",
	"message/send": "SendMessage",
	"tasks/get": "GetTask"
};
const A2A_UNSUPPORTED_METHODS = /* @__PURE__ */ new Set([
	"CancelTask",
	"tasks/cancel",
	"ListTasks",
	"SendStreamingMessage",
	"SubscribeToTask",
	"CreateTaskPushNotificationConfig",
	"SetTaskPushNotificationConfig",
	"GetTaskPushNotificationConfig",
	"ListTaskPushNotificationConfig",
	"ListTaskPushNotificationConfigs",
	"DeleteTaskPushNotificationConfig",
	"GetExtendedAgentCard"
]);
function resolveA2aRpcMethod(method) {
	if (Object.hasOwn(A2A_METHOD_ALIASES, method)) return A2A_METHOD_ALIASES[method];
	return A2A_UNSUPPORTED_METHODS.has(method) ? "unsupported" : void 0;
}
function isA2aContextId(value) {
	return A2A_CONTEXT_PATTERN.test(value);
}
function extractA2aMessageText(parts) {
	const textParts = [];
	for (const candidate of parts) {
		const parsed = A2aInboundPartSchema.safeParse(candidate);
		if (!parsed.success) continue;
		if (typeof parsed.data.text === "string") textParts.push(parsed.data.text);
		else if (Object.hasOwn(parsed.data, "data") && parsed.data.data !== void 0) textParts.push(JSON.stringify(parsed.data.data));
	}
	const text = textParts.join("\n");
	if (!text.trim()) return;
	if (Buffer.byteLength(text) <= A2A_MESSAGE_MAX_BYTES) return text;
	const encoded = Buffer.from(text);
	let prefixBytes = A2A_MESSAGE_MAX_BYTES - Buffer.byteLength(A2A_TRUNCATION_MARKER);
	const decoder = new TextDecoder("utf-8", { fatal: true });
	while (prefixBytes > 0) try {
		return decoder.decode(encoded.subarray(0, prefixBytes)) + A2A_TRUNCATION_MARKER;
	} catch {
		prefixBytes -= 1;
	}
	return A2A_TRUNCATION_MARKER.trimStart();
}
var A2aProtocolError = class extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
		this.name = "A2aProtocolError";
	}
};
//#endregion
//#region extensions/a2a/src/http.ts
const MAX_REQUEST_BODY_BYTES = 1024 * 1024;
const DEFAULT_REPLY_TIMEOUT_MS = 12e4;
const DEFAULT_RATE_LIMIT_PER_MINUTE = 30;
const RATE_LIMIT_WINDOW_MS = 6e4;
function writeJsonResponse(response, statusCode, value) {
	response.statusCode = statusCode;
	response.setHeader("content-type", "application/json; charset=utf-8");
	response.setHeader("cache-control", "no-store");
	response.end(JSON.stringify(value));
}
function createRpcError(id, code, message) {
	return {
		jsonrpc: "2.0",
		id,
		error: {
			code,
			message
		}
	};
}
function resolvePeerName(request, config) {
	const token = request.headers.authorization?.match(/^Bearer\s+([^\s]+)$/i)?.[1];
	if (!token) return;
	const presentedDigest = createHash("sha256").update(token).digest();
	for (const [peerName, peer] of Object.entries(config.peers ?? {})) if (timingSafeEqual(presentedDigest, createHash("sha256").update(peer.token).digest())) return peerName;
}
function resolveRequestOrigin(request) {
	const encrypted = "encrypted" in request.socket && request.socket.encrypted;
	try {
		return new URL(`${encrypted ? "https" : "http"}://${request.headers.host ?? "localhost"}`).origin;
	} catch {
		return `${encrypted ? "https" : "http"}://localhost`;
	}
}
function createAgentCard(params, request) {
	const exposed = params.a2aConfig.exposeAgents;
	const agentIds = listAgentIds(params.config).filter((agentId) => !exposed?.length || exposed.includes(agentId));
	return {
		name: (agentIds[0] ? resolveAgentConfig(params.config, agentIds[0])?.name?.trim() : void 0) || "OpenClaw",
		description: "OpenClaw agent gateway using the Agent2Agent protocol.",
		supportedInterfaces: [{
			url: `${(params.a2aConfig.advertisedUrl ?? resolveRequestOrigin(request)).replace(/\/+$/, "")}/a2a/v1`,
			protocolBinding: "JSONRPC",
			protocolVersion: "1.0"
		}],
		version: params.version,
		capabilities: {
			streaming: false,
			pushNotifications: false
		},
		defaultInputModes: ["text/plain"],
		defaultOutputModes: ["text/plain"],
		skills: agentIds.map((agentId) => ({
			id: agentId,
			name: agentId,
			description: `OpenClaw agent ${agentId}.`,
			tags: ["openclaw"]
		}))
	};
}
function createA2aHttpHandler(params) {
	const peerRequestTimes = /* @__PURE__ */ new Map();
	function isRateLimited(peerName) {
		const maximum = params.a2aConfig.rateLimitPerMinute ?? DEFAULT_RATE_LIMIT_PER_MINUTE;
		if (maximum === 0) return false;
		const now = Date.now();
		const requests = (peerRequestTimes.get(peerName) ?? []).filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);
		if (requests.length >= maximum) {
			peerRequestTimes.set(peerName, requests);
			return true;
		}
		requests.push(now);
		peerRequestTimes.set(peerName, requests);
		return false;
	}
	async function processRpcRequest(input, peerName) {
		const parsed = A2aRpcRequestSchema.safeParse(input);
		if (!parsed.success) {
			const candidateId = isRecord(input) ? input.id : void 0;
			return createRpcError(typeof candidateId === "string" || typeof candidateId === "number" ? candidateId : null, -32600, "Invalid JSON-RPC request");
		}
		const request = parsed.data;
		const notification = !Object.hasOwn(request, "id");
		const id = request.id ?? null;
		if (isRateLimited(peerName)) return notification ? void 0 : createRpcError(id, -32e3, "Peer is rate limited");
		let result;
		try {
			const method = resolveA2aRpcMethod(request.method);
			if (method === void 0) throw new A2aProtocolError(-32601, `Method not found: ${request.method}`);
			if (method === "unsupported") throw new A2aProtocolError(-32004, "Unsupported operation; supported methods are SendMessage and GetTask");
			if (method === "SendMessage") {
				const send = A2aSendMessageParamsSchema.safeParse(request.params);
				if (!send.success) throw new A2aProtocolError(-32602, "Invalid SendMessage params: message and parts required");
				const message = send.data.message;
				const text = extractA2aMessageText(message.parts);
				if (!text) throw new A2aProtocolError(-32602, "Message must contain at least one usable text part");
				const contextId = message.contextId ?? `ctx-${randomUUID()}`;
				if (!isA2aContextId(contextId)) throw new A2aProtocolError(-32602, "Invalid message contextId");
				const task = params.taskStore.create(contextId, peerName);
				params.taskStore.start(task.id);
				runDetachedWebhookWork(async () => {
					await params.dispatchInbound({
						taskId: task.id,
						contextId,
						messageId: message.messageId ?? randomUUID(),
						peerName,
						text
					});
				}).catch((error) => params.taskStore.fail(task.id, error));
				if (send.data.configuration?.returnImmediately) result = { task: params.taskStore.get(task.id, peerName) ?? task };
				else {
					const timeoutMs = params.a2aConfig.replyTimeoutMs ?? DEFAULT_REPLY_TIMEOUT_MS;
					result = { task: await params.taskStore.wait(task.id, timeoutMs) ?? params.taskStore.get(task.id, peerName) ?? task };
				}
			} else {
				const taskParams = A2aTaskRequestParamsSchema.safeParse(request.params);
				if (!taskParams.success) throw new A2aProtocolError(-32602, "Invalid task params: id is required");
				const task = params.taskStore.get(taskParams.data.id, peerName);
				if (!task) throw new A2aProtocolError(-32001, "Task not found");
				result = task;
			}
		} catch (error) {
			if (notification) return;
			if (error instanceof A2aProtocolError) return createRpcError(id, error.code, error.message);
			return createRpcError(id, -32e3, "A2A request could not be processed");
		}
		return notification ? void 0 : {
			jsonrpc: "2.0",
			id,
			result
		};
	}
	return async (request, response) => {
		const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
		if (request.method === "GET" && (pathname === "/.well-known/agent-card.json" || pathname === "/.well-known/agent.json")) {
			writeJsonResponse(response, 200, createAgentCard(params, request));
			return true;
		}
		if (request.method !== "POST" || pathname !== "/a2a/v1") {
			writeJsonResponse(response, 404, { error: "Not found" });
			return true;
		}
		const peerName = resolvePeerName(request, params.a2aConfig);
		if (!peerName) {
			writeJsonResponse(response, 401, { error: "Unauthorized; configure channels.a2a.peers with a matching Bearer token" });
			return true;
		}
		let body;
		try {
			body = await readRequestBodyWithLimit(request, {
				maxBytes: MAX_REQUEST_BODY_BYTES,
				destroyOnLimit: false
			});
		} catch (error) {
			if (isRequestBodyLimitError(error, "PAYLOAD_TOO_LARGE")) {
				response.setHeader("connection", "close");
				response.once("finish", () => request.destroy());
				writeJsonResponse(response, 413, { error: "Request body exceeds the 1 MiB limit" });
				return true;
			}
			writeJsonResponse(response, 200, createRpcError(null, -32e3, "Request body could not be read"));
			return true;
		}
		let payload;
		try {
			payload = JSON.parse(body);
		} catch {
			writeJsonResponse(response, 200, createRpcError(null, -32700, "Parse error"));
			return true;
		}
		if (Array.isArray(payload)) {
			if (payload.length === 0) {
				writeJsonResponse(response, 200, createRpcError(null, -32600, "Invalid JSON-RPC request"));
				return true;
			}
			const responses = (await Promise.all(payload.map((entry) => processRpcRequest(entry, peerName)))).filter((entry) => entry !== void 0);
			if (responses.length > 0) writeJsonResponse(response, 200, responses);
			else {
				response.statusCode = 200;
				response.end();
			}
			return true;
		}
		const result = await processRpcRequest(payload, peerName);
		if (result) writeJsonResponse(response, 200, result);
		else {
			response.statusCode = 200;
			response.end();
		}
		return true;
	};
}
//#endregion
//#region extensions/a2a/src/inbound.ts
async function dispatchA2aInbound(params) {
	try {
		const { route, buildEnvelope } = resolveChannelInboundRouteEnvelope({
			cfg: params.config,
			channel: "a2a",
			accountId: params.account.accountId,
			peer: {
				kind: "direct",
				id: `${params.peerName}:${params.contextId}`
			},
			dmScope: "per-account-channel-peer"
		});
		const ingress = await resolveStableChannelMessageIngress({
			channelId: "a2a",
			accountId: params.account.accountId,
			cfg: params.config,
			identity: {
				key: "sender",
				entryIdPrefix: "a2a-entry"
			},
			subject: { stableId: params.peerName },
			conversation: {
				kind: "direct",
				id: params.contextId
			},
			contextBinding: {
				agentId: route.agentId,
				sessionKey: route.sessionKey,
				messageId: params.messageId,
				inboundEventKind: "user_request"
			},
			dmPolicy: "allowlist",
			allowFrom: Object.keys(params.account.config.peers ?? {})
		});
		if (ingress.ingress.admission !== "dispatch") {
			params.store.reject(params.taskId, "A2A peer was blocked by channel ingress policy");
			return;
		}
		const timestamp = Date.now();
		const target = `a2a:${params.peerName}`;
		const body = buildEnvelope({
			channel: "A2A",
			from: params.peerName,
			timestamp,
			body: params.text
		});
		const ctxPayload = params.buildContext({
			channel: "a2a",
			accountId: route.accountId ?? params.account.accountId,
			messageId: params.messageId,
			messageIdFull: params.messageId,
			timestamp,
			from: target,
			sender: {
				id: params.peerName,
				name: params.peerName
			},
			conversation: {
				kind: "direct",
				id: params.contextId,
				label: params.peerName
			},
			route: {
				agentId: route.agentId,
				dmScope: route.dmScope,
				accountId: route.accountId,
				routeSessionKey: route.sessionKey,
				dispatchSessionKey: route.sessionKey
			},
			reply: {
				to: target,
				originatingTo: target
			},
			message: {
				body,
				bodyForAgent: params.text,
				rawBody: params.text,
				commandBody: params.text
			},
			channelIngress: ingress,
			access: { commands: { authorized: true } }
		});
		const dispatch = await params.channelRuntime.inbound.dispatch({
			cfg: params.config,
			channel: "a2a",
			accountId: params.account.accountId,
			route: {
				agentId: route.agentId,
				dmScope: route.dmScope,
				sessionKey: route.sessionKey
			},
			ctxPayload,
			delivery: {
				deliver: async (payload, info) => {
					if (info.kind !== "final") return;
					params.store.completeNext(params.contextId, payload.text, params.peerName);
				},
				onError: (error) => {
					params.store.fail(params.taskId, error);
				}
			},
			replyPipeline: {}
		});
		if (dispatch.admission.kind !== "dispatch") params.store.reject(params.taskId, `A2A channel declined the turn: ${dispatch.admission.kind}`);
		else if (!dispatch.dispatched) params.store.fail(params.taskId, "A2A channel accepted the turn without dispatching it");
	} catch (error) {
		params.store.fail(params.taskId, error);
	}
}
//#endregion
//#region extensions/a2a/src/task-store.ts
const A2A_TERMINAL_MAX_TASKS = 500;
const A2A_TERMINAL_RETENTION_MS = 1440 * 60 * 1e3;
const A2A_ERROR_MAX_LENGTH = 512;
function isTerminalTask(task) {
	return task.status.state !== "TASK_STATE_SUBMITTED" && task.status.state !== "TASK_STATE_WORKING";
}
function createStatusMessage(contextId, text) {
	return {
		messageId: randomUUID(),
		contextId,
		role: "ROLE_AGENT",
		parts: [{ text: text.slice(0, A2A_ERROR_MAX_LENGTH) }]
	};
}
var A2aTaskStore = class {
	#tasks = /* @__PURE__ */ new Map();
	#taskOwners = /* @__PURE__ */ new Map();
	#pendingByContext = /* @__PURE__ */ new Map();
	#terminalTasks = /* @__PURE__ */ new Map();
	#waiters = /* @__PURE__ */ new Map();
	create(contextId, ownerPeer) {
		this.#pruneTerminalTasks();
		const task = {
			id: randomUUID(),
			contextId,
			status: {
				state: "TASK_STATE_SUBMITTED",
				timestamp: (/* @__PURE__ */ new Date()).toISOString()
			},
			artifacts: [],
			history: []
		};
		this.#tasks.set(task.id, task);
		if (ownerPeer !== void 0) this.#taskOwners.set(task.id, ownerPeer);
		const conversationKey = this.#conversationKey(contextId, ownerPeer);
		const pending = this.#pendingByContext.get(conversationKey) ?? [];
		pending.push(task.id);
		this.#pendingByContext.set(conversationKey, pending);
		return task;
	}
	get(taskId, ownerPeer) {
		this.#pruneTerminalTasks();
		if (ownerPeer !== void 0 && this.#taskOwners.get(taskId) !== ownerPeer) return;
		return this.#tasks.get(taskId);
	}
	start(taskId) {
		const task = this.#tasks.get(taskId);
		if (task?.status.state === "TASK_STATE_SUBMITTED") task.status = {
			state: "TASK_STATE_WORKING",
			timestamp: (/* @__PURE__ */ new Date()).toISOString()
		};
		return task;
	}
	completeNext(contextId, text, ownerPeer) {
		const conversationKey = this.#conversationKey(contextId, ownerPeer);
		const queue = this.#pendingByContext.get(conversationKey);
		if (!queue?.length) return;
		const nextTaskId = queue.shift();
		if (queue.length === 0) this.#pendingByContext.delete(conversationKey);
		if (!nextTaskId) return;
		const task = this.#tasks.get(nextTaskId);
		if (!task || isTerminalTask(task)) return;
		if (text?.trim()) task.artifacts = [{
			artifactId: randomUUID(),
			parts: [{ text }]
		}];
		task.status = {
			state: "TASK_STATE_COMPLETED",
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			...!text?.trim() ? { message: createStatusMessage(contextId, "Agent completed without reply text") } : {}
		};
		return this.#finishTask(task);
	}
	fail(taskId, error) {
		const reason = error instanceof Error ? error.message : String(error);
		return this.#finishWithMessage(taskId, "TASK_STATE_FAILED", reason);
	}
	reject(taskId, reason) {
		return this.#finishWithMessage(taskId, "TASK_STATE_REJECTED", reason);
	}
	wait(taskId, timeoutMs) {
		const task = this.get(taskId);
		if (!task || isTerminalTask(task)) return Promise.resolve(task);
		return new Promise((resolve) => {
			const waiters = this.#waiters.get(taskId) ?? /* @__PURE__ */ new Set();
			const waiter = {
				resolve,
				timer: setTimeout(() => {
					waiters.delete(waiter);
					if (waiters.size === 0) this.#waiters.delete(taskId);
					resolve(task);
				}, timeoutMs)
			};
			waiters.add(waiter);
			this.#waiters.set(taskId, waiters);
		});
	}
	stop() {
		for (const [taskId, waiters] of this.#waiters) {
			const task = this.#tasks.get(taskId);
			for (const waiter of waiters) {
				clearTimeout(waiter.timer);
				if (task) waiter.resolve(task);
			}
		}
		this.#waiters.clear();
		this.#pendingByContext.clear();
		this.#terminalTasks.clear();
		this.#taskOwners.clear();
		this.#tasks.clear();
	}
	#finishWithMessage(taskId, state, reason) {
		const task = this.#tasks.get(taskId);
		if (!task || isTerminalTask(task)) return task;
		const conversationKey = this.#conversationKey(task.contextId, this.#taskOwners.get(task.id));
		const queue = this.#pendingByContext.get(conversationKey);
		if (queue) {
			const position = queue.indexOf(taskId);
			if (position !== -1) queue.splice(position, 1);
			if (queue.length === 0) this.#pendingByContext.delete(conversationKey);
		}
		task.status = {
			state,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			message: createStatusMessage(task.contextId, reason)
		};
		return this.#finishTask(task);
	}
	#finishTask(task) {
		this.#terminalTasks.set(task.id, Date.now());
		const waiters = this.#waiters.get(task.id);
		if (waiters) {
			this.#waiters.delete(task.id);
			for (const waiter of waiters) {
				clearTimeout(waiter.timer);
				waiter.resolve(task);
			}
		}
		this.#pruneTerminalTasks();
		return task;
	}
	#pruneTerminalTasks() {
		const expiresBefore = Date.now() - A2A_TERMINAL_RETENTION_MS;
		for (const [taskId, finishedAt] of this.#terminalTasks) {
			if (finishedAt > expiresBefore && this.#terminalTasks.size <= A2A_TERMINAL_MAX_TASKS) break;
			this.#terminalTasks.delete(taskId);
			this.#taskOwners.delete(taskId);
			this.#tasks.delete(taskId);
		}
	}
	#conversationKey(contextId, ownerPeer) {
		return ownerPeer === void 0 ? contextId : `${ownerPeer}\0${contextId}`;
	}
};
//#endregion
//#region extensions/a2a/src/gateway.ts
const a2aGatewayRoutePaths = [
	"/.well-known/agent-card.json",
	"/.well-known/agent.json",
	"/a2a/v1"
];
async function startA2aGatewayAccount(ctx) {
	const { account } = ctx;
	if (!account.configured) throw new Error(`A2A channel is not configured for account "${account.accountId}"`);
	ctx.setStatus({
		accountId: account.accountId,
		running: true,
		lifecycle: "starting",
		configured: true,
		enabled: account.enabled
	});
	const runtime = getA2aChannelRuntime();
	const channelRuntime = ctx.channelRuntime ?? runtime.channel;
	const store = new A2aTaskStore();
	const unregisterRoutes = [];
	try {
		const handler = createA2aHttpHandler({
			config: ctx.cfg,
			a2aConfig: account.config,
			version: runtime.version,
			taskStore: store,
			dispatchInbound: async (message) => {
				await dispatchA2aInbound({
					...message,
					account,
					config: ctx.cfg,
					channelRuntime,
					buildContext: channelRuntime.inbound.buildContext,
					store
				});
			}
		});
		for (const routePath of a2aGatewayRoutePaths) unregisterRoutes.push(registerPluginHttpRoute({
			path: routePath,
			auth: "plugin",
			match: "exact",
			pluginId: "a2a",
			source: "a2a-gateway",
			accountId: account.accountId,
			throwOnFailure: true,
			handler
		}));
		ctx.setStatus(channelReadyPatch({ accountId: account.accountId }));
		await waitUntilAbort(ctx.abortSignal);
	} finally {
		for (const unregister of unregisterRoutes.toReversed()) unregister();
		store.stop();
		ctx.setStatus(channelStoppedPatch({ accountId: account.accountId }));
	}
}
//#endregion
//#region extensions/a2a/src/outbound.ts
const A2A_OUTBOUND_TIMEOUT_MS = 3e4;
const A2aOutboundResponseSchema = object({
	error: object({
		code: number(),
		message: string()
	}).optional(),
	result: object({ task: object({ id: string().optional() }).optional() }).optional()
});
async function sendA2aChannelText(params) {
	const account = resolveA2aChannelAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	const peerName = params.to.replace(/^a2a:/i, "").trim();
	const peer = account.config.peers?.[peerName];
	if (!peer?.url) throw new Error(`peer ${peerName} has no url configured for outbound A2A`);
	const messageId = randomUUID();
	const requestId = randomUUID();
	const headers = { "content-type": "application/json" };
	if (peer.outboundToken) headers.authorization = `Bearer ${peer.outboundToken}`;
	const request = {
		jsonrpc: "2.0",
		id: requestId,
		method: "SendMessage",
		params: {
			message: {
				messageId,
				role: "ROLE_USER",
				contextId: `ctx-oc-${peerName}`,
				parts: [{ text: params.text }]
			},
			configuration: { returnImmediately: true }
		}
	};
	const signal = AbortSignal.timeout(A2A_OUTBOUND_TIMEOUT_MS);
	for (let attempt = 0; attempt < 2; attempt += 1) {
		const { response, release } = await fetchWithSsrFGuard({
			url: peer.url,
			timeoutMs: A2A_OUTBOUND_TIMEOUT_MS,
			signal,
			policy: ssrfPolicyFromHttpBaseUrlAllowedOrigin(peer.url),
			auditContext: "a2a.outbound_send",
			maxRedirects: 0,
			init: {
				method: "POST",
				headers,
				body: JSON.stringify(request)
			}
		});
		try {
			if (!response.ok) throw new Error(`outbound A2A request to peer ${peerName} failed (HTTP ${response.status})`);
			const parsed = A2aOutboundResponseSchema.safeParse(await response.json());
			if (!parsed.success) throw new Error(`peer ${peerName} returned an invalid A2A JSON-RPC response`);
			if (parsed.data.error) {
				if (attempt === 0 && parsed.data.error.code === -32601) {
					request.method = "message/send";
					continue;
				}
				throw new Error(`outbound A2A request to peer ${peerName} failed: ${parsed.data.error.message}`);
			}
			if (!parsed.data.result) throw new Error(`peer ${peerName} returned an A2A response without a result`);
			return {
				to: params.to,
				messageId: parsed.data.result.task?.id ?? messageId
			};
		} finally {
			await release();
		}
	}
	throw new Error(`outbound A2A request to peer ${peerName} exhausted its compatibility retry`);
}
//#endregion
//#region extensions/a2a/src/status.ts
const a2aChannelStatus = createComputedAccountStatusAdapter({
	defaultRuntime: createDefaultChannelRuntimeState(DEFAULT_ACCOUNT_ID),
	buildChannelSummary: ({ snapshot }) => ({
		configured: snapshot.configured ?? false,
		running: snapshot.running ?? false
	}),
	resolveAccountSnapshot: ({ account }) => ({
		accountId: account.accountId,
		enabled: account.enabled,
		configured: account.configured,
		extra: { peerCount: Object.keys(account.config.peers ?? {}).length }
	})
});
//#endregion
//#region extensions/a2a/src/channel.ts
function normalizeA2aChannelTarget(raw) {
	const target = raw.trim().replace(/^a2a:/i, "");
	return /^[a-z0-9][a-z0-9._-]{0,63}$/.test(target) ? target : void 0;
}
const a2aChannelMessageAdapter = defineChannelMessageAdapter({
	id: "a2a",
	durableFinal: { capabilities: { text: true } },
	send: { text: async (ctx) => {
		const result = await sendA2aChannelText({
			cfg: ctx.cfg,
			accountId: ctx.accountId,
			to: ctx.to,
			text: ctx.text
		});
		return {
			messageId: result.messageId,
			receipt: createMessageReceiptFromOutboundResults({
				results: [{
					channel: "a2a",
					messageId: result.messageId
				}],
				kind: "text"
			})
		};
	} }
});
const a2aChannelPlugin = createChatChannelPlugin({
	base: {
		...createA2aChannelPluginBase(),
		messaging: {
			normalizeTarget: normalizeA2aChannelTarget,
			inferTargetChatType: () => "direct",
			targetResolver: {
				looksLikeId: (raw) => normalizeA2aChannelTarget(raw) !== void 0,
				hint: "<a2a-peer-name>"
			},
			resolveOutboundSessionRoute: ({ cfg, agentId, accountId, target }) => {
				const peerName = normalizeA2aChannelTarget(target);
				if (!peerName) return null;
				return buildChannelOutboundSessionRoute({
					cfg,
					agentId,
					channel: "a2a",
					accountId,
					recipientSessionExact: true,
					peer: {
						kind: "direct",
						id: peerName
					},
					chatType: "direct",
					from: `a2a:${accountId ?? "default"}`,
					to: peerName
				});
			}
		},
		status: a2aChannelStatus,
		gateway: { startAccount: async (ctx) => await startA2aGatewayAccount(ctx) },
		message: a2aChannelMessageAdapter
	},
	outbound: {
		base: { deliveryMode: "direct" },
		attachedResults: {
			channel: "a2a",
			sendText: async ({ cfg, to, text, accountId }) => await sendA2aChannelText({
				cfg,
				accountId,
				to,
				text
			})
		}
	}
});
//#endregion
export { a2aChannelPlugin as t };
