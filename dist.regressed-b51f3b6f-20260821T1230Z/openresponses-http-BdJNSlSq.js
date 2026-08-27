import { j as resolveIntegerOption } from "./number-coercion-oCkfUEEq.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { r as defaultRuntime } from "./runtime-DtFIMC-W.js";
import { At as boolean, Bt as discriminatedUnion, Et as array, Nn as record, Rn as string, Tn as object, Xn as union, Zn as unknown, dn as literal, wn as number, yt as _enum } from "./schemas-CZ9Toj_c.js";
import { n as ZodIssueCode } from "./compat-BJw8yvyp.js";
import { i as logWarn } from "./logger-DKrZPnAI.js";
import { i as emitAgentEvent, u as onAgentEvent } from "./agent-events-Cmj8toCy.js";
import { d as retainGatewayRootWorkAdmissionContinuation } from "./gateway-work-admission-QDz202p9.js";
import { vt as toOpenAiResponsesUsage } from "./session-accessor-Bi6bzKQE.js";
import { a as wrapExternalContent } from "./external-content-IQUFD6xt.js";
import { r as isClientToolNameConflictError } from "./agent-tool-definition-adapter-kwdlWM4p.js";
import { t as renderFileContextBlock } from "./file-context-Lbu5USC0.js";
import { a as extractImageContentFromSource, i as extractFileContentFromSource, n as DEFAULT_INPUT_IMAGE_MIMES, o as normalizeMimeList, s as resolveInputFileLimits } from "./input-files-uwbMv1cN.js";
import { r as agentCommandFromIngress } from "./agent-command-BIPK24tL.js";
import { t as createDefaultDeps } from "./deps-DbFiGwEJ.js";
import "./agent-Bf0ejFy8.js";
import { c as getBearerToken, l as getHeader, m as resolveOpenAiCompatibleHttpSenderIsOwner, p as resolveOpenAiCompatibleHttpOperatorScopes, r as authorizeOpenAiCompatibleHttpModelOverride } from "./http-auth-utils-CM89UREd.js";
import { h as writeDone, l as sendMissingScopeForbidden, m as watchClientDisconnect, p as setSseHeaders, s as sendJson } from "./http-common-BIedCt0N.js";
import { a as isInvalidGatewayModelError, c as resolveAgentIdForRequest, d as resolveOpenAiCompatModelOverride, i as isGatewaySessionKeyOverrideError, r as isAgentSelectionRequiredError, s as isUnknownGatewayAgentError, u as resolveGatewayRequestContext } from "./http-utils-Cc5uth5g.js";
import { t as handleGatewayPostJsonEndpoint } from "./http-endpoint-helpers-w8dPy022.js";
import { c as IMAGE_ONLY_USER_MESSAGE, d as resolveAssistantStreamDeltaText, f as resolveAssistantStreamSnapshotText, i as resolveOpenAiCompatError, l as buildAgentMessageFromConversationEntries, n as resolveUnsatisfiedToolChoiceMessage, o as resolveAgentRunUsage, r as toolChoiceConstraintPrompt, s as normalizeInputHostnameAllowlist, t as isToolChoiceConstraintSatisfied, u as isReplaceableAssistantStreamEvent } from "./openai-tool-choice-DZAn0Aha.js";
import { createHash, randomUUID } from "node:crypto";
//#region src/gateway/open-responses.schema.ts
/**
* OpenResponses API Zod Schemas
*
* Zod schemas for the OpenResponses `/v1/responses` endpoint.
* This module is isolated from gateway imports to enable future codegen and prevent drift.
*
* @see https://www.open-responses.com/
*/
const InputTextContentPartSchema = object({
	type: literal("input_text"),
	text: string()
}).strict();
const OutputTextContentPartSchema = object({
	type: literal("output_text"),
	text: string()
}).strict();
const InputImageSourceSchema = discriminatedUnion("type", [object({
	type: literal("url"),
	url: string().url()
}), object({
	type: literal("base64"),
	media_type: _enum([
		"image/jpeg",
		"image/png",
		"image/gif",
		"image/webp",
		"image/heic",
		"image/heif"
	]),
	data: string().min(1)
})]);
const InputImageContentPartSchema = object({
	type: literal("input_image"),
	source: InputImageSourceSchema
}).strict();
const InputFileSourceSchema = discriminatedUnion("type", [object({
	type: literal("url"),
	url: string().url()
}), object({
	type: literal("base64"),
	media_type: string().min(1),
	data: string().min(1),
	filename: string().optional()
})]);
const ContentPartSchema = discriminatedUnion("type", [
	InputTextContentPartSchema,
	OutputTextContentPartSchema,
	InputImageContentPartSchema,
	object({
		type: literal("input_file"),
		source: InputFileSourceSchema
	}).strict()
]);
const MessageItemRoleSchema = _enum([
	"system",
	"developer",
	"user",
	"assistant"
]);
const AssistantPhaseSchema = _enum(["commentary", "final_answer"]);
const ItemParamSchema = discriminatedUnion("type", [
	object({
		type: literal("message"),
		role: MessageItemRoleSchema,
		content: union([string(), array(ContentPartSchema)]),
		phase: AssistantPhaseSchema.optional()
	}).strict().superRefine((value, ctx) => {
		if (value.phase !== void 0 && value.role !== "assistant") ctx.addIssue({
			code: ZodIssueCode.custom,
			path: ["phase"],
			message: "`phase` is only valid on assistant messages."
		});
	}),
	object({
		type: literal("function_call"),
		id: string().optional(),
		call_id: string().optional(),
		name: string(),
		arguments: string()
	}).strict(),
	object({
		type: literal("function_call_output"),
		call_id: string(),
		output: string()
	}).strict(),
	object({
		type: literal("reasoning"),
		content: string().optional(),
		encrypted_content: string().optional(),
		summary: string().optional()
	}).strict(),
	object({
		type: literal("item_reference"),
		id: string()
	}).strict()
]);
const ToolDefinitionSchema = object({
	type: literal("function"),
	name: string().min(1, "Tool name cannot be empty"),
	description: string().optional(),
	parameters: record(string(), unknown()).optional(),
	strict: boolean().optional()
}).strict();
const ToolChoiceSchema = union([
	literal("auto"),
	literal("none"),
	literal("required"),
	object({
		type: literal("function"),
		name: string().min(1)
	}).strict(),
	object({
		type: literal("function"),
		function: object({ name: string().min(1) })
	}).strict()
]);
const CreateResponseBodySchema = object({
	model: string(),
	input: union([string(), array(ItemParamSchema)]),
	instructions: string().optional(),
	tools: array(ToolDefinitionSchema).optional(),
	tool_choice: ToolChoiceSchema.optional(),
	text: object({ format: object({ type: literal("text") }).strict() }).strict().optional(),
	stream: boolean().optional(),
	max_output_tokens: number().int().positive().optional(),
	max_tool_calls: number().int().positive().optional(),
	user: string().optional(),
	temperature: number().min(0).max(2).optional(),
	top_p: number().min(0).max(1).optional(),
	metadata: record(string(), string()).optional(),
	store: boolean().optional(),
	previous_response_id: string().optional(),
	reasoning: object({
		effort: _enum([
			"low",
			"medium",
			"high"
		]).optional(),
		summary: _enum([
			"auto",
			"concise",
			"detailed"
		]).optional()
	}).optional(),
	truncation: _enum(["auto", "disabled"]).optional()
}).strict();
const ResponseStatusSchema = _enum([
	"in_progress",
	"completed",
	"failed",
	"cancelled",
	"incomplete"
]);
const OutputItemSchema = discriminatedUnion("type", [
	object({
		type: literal("message"),
		id: string(),
		role: literal("assistant"),
		content: array(OutputTextContentPartSchema),
		phase: AssistantPhaseSchema.optional(),
		status: _enum(["in_progress", "completed"]).optional()
	}).strict(),
	object({
		type: literal("function_call"),
		id: string(),
		call_id: string(),
		name: string(),
		arguments: string(),
		status: _enum(["in_progress", "completed"]).optional()
	}).strict(),
	object({
		type: literal("reasoning"),
		id: string(),
		content: string().optional(),
		summary: string().optional()
	}).strict()
]);
const UsageSchema = object({
	input_tokens: number().int().nonnegative(),
	input_tokens_details: object({
		cached_tokens: number().int().nonnegative(),
		cache_write_tokens: number().int().nonnegative()
	}),
	output_tokens: number().int().nonnegative(),
	output_tokens_details: object({ reasoning_tokens: number().int().nonnegative() }),
	total_tokens: number().int().nonnegative()
});
const ResponseResourceSchema = object({
	id: string(),
	object: literal("response"),
	created_at: number().int(),
	status: ResponseStatusSchema,
	model: string(),
	output: array(OutputItemSchema),
	usage: UsageSchema,
	error: object({
		code: string(),
		message: string()
	}).optional()
});
object({
	type: literal("response.created"),
	response: ResponseResourceSchema
});
object({
	type: literal("response.in_progress"),
	response: ResponseResourceSchema
});
object({
	type: literal("response.completed"),
	response: ResponseResourceSchema
});
object({
	type: literal("response.failed"),
	response: ResponseResourceSchema
});
object({
	type: literal("response.output_item.added"),
	output_index: number().int().nonnegative(),
	item: OutputItemSchema
});
object({
	type: literal("response.output_item.done"),
	output_index: number().int().nonnegative(),
	item: OutputItemSchema
});
object({
	type: literal("response.content_part.added"),
	item_id: string(),
	output_index: number().int().nonnegative(),
	content_index: number().int().nonnegative(),
	part: OutputTextContentPartSchema
});
object({
	type: literal("response.content_part.done"),
	item_id: string(),
	output_index: number().int().nonnegative(),
	content_index: number().int().nonnegative(),
	part: OutputTextContentPartSchema
});
object({
	type: literal("response.output_text.delta"),
	item_id: string(),
	output_index: number().int().nonnegative(),
	content_index: number().int().nonnegative(),
	delta: string()
});
object({
	type: literal("response.output_text.done"),
	item_id: string(),
	output_index: number().int().nonnegative(),
	content_index: number().int().nonnegative(),
	text: string()
});
//#endregion
//#region src/gateway/openresponses-file-content.ts
/** Wraps untrusted file content for OpenResponses input blocks. */
function wrapUntrustedFileContent(content) {
	return wrapExternalContent(content, {
		source: "unknown",
		includeWarning: false
	});
}
//#endregion
//#region src/gateway/openresponses-prompt.ts
const FILE_ONLY_USER_MESSAGE = "User sent file(s) with no text.";
function extractTextContent(content) {
	if (typeof content === "string") return content;
	return content.map((part) => {
		if (part.type === "input_text") return part.text;
		if (part.type === "output_text") return part.text;
		return "";
	}).filter(Boolean).join("\n");
}
function hasImageContent(content) {
	return typeof content !== "string" && content.some((part) => part.type === "input_image");
}
function hasFileContent(content) {
	return typeof content !== "string" && content.some((part) => part.type === "input_file");
}
function placeholderForActiveTurn(content) {
	if (hasImageContent(content)) return IMAGE_ONLY_USER_MESSAGE;
	if (hasFileContent(content)) return FILE_ONLY_USER_MESSAGE;
	return "";
}
/** A tool result starts its own turn and cannot inherit an earlier user's media. */
function resolveActiveUserMessage(input) {
	for (let i = input.length - 1; i >= 0; i -= 1) {
		const item = input[i];
		if (item?.type === "function_call_output") return;
		if (item?.type === "message" && item.role === "user") return item;
	}
}
/** Build the user message and optional system prompt from Responses API input. */
function buildAgentPrompt(input) {
	if (typeof input === "string") return { message: input };
	const systemParts = [];
	const conversationEntries = [];
	const activeUserMessage = resolveActiveUserMessage(input);
	for (const item of input) if (item.type === "message") {
		const body = extractTextContent(item.content).trim() || (item === activeUserMessage ? placeholderForActiveTurn(item.content) : "");
		if (!body) continue;
		if (item.role === "system" || item.role === "developer") {
			systemParts.push(body);
			continue;
		}
		const normalizedRole = item.role === "assistant" ? "assistant" : "user";
		const sender = normalizedRole === "assistant" ? "Assistant" : "User";
		conversationEntries.push({
			role: normalizedRole,
			entry: {
				sender,
				body
			}
		});
	} else if (item.type === "function_call_output") conversationEntries.push({
		role: "tool",
		entry: {
			sender: `Tool:${item.call_id}`,
			body: item.output
		}
	});
	return {
		message: buildAgentMessageFromConversationEntries(conversationEntries),
		extraSystemPrompt: systemParts.length > 0 ? systemParts.join("\n\n") : void 0,
		activeUserMessage
	};
}
//#endregion
//#region src/gateway/openresponses-shape.ts
/** Creates an assistant output message item for OpenResponses-compatible responses. */
function createAssistantOutputItem(params) {
	return {
		type: "message",
		id: params.id,
		role: "assistant",
		content: [{
			type: "output_text",
			text: params.text
		}],
		...params.phase ? { phase: params.phase } : {},
		status: params.status
	};
}
/** Creates a function-call output item for OpenResponses-compatible responses. */
function createFunctionCallOutputItem(params) {
	return {
		type: "function_call",
		id: params.id,
		call_id: params.callId,
		name: params.name,
		arguments: params.arguments,
		status: params.status
	};
}
//#endregion
//#region src/gateway/openresponses-http.ts
/**
* OpenResponses HTTP Handler
*
* Implements the OpenResponses `/v1/responses` endpoint for OpenClaw Gateway.
*
* @see https://www.open-responses.com/
*/
const DEFAULT_BODY_BYTES = 20 * 1024 * 1024;
const DEFAULT_MAX_URL_PARTS = 8;
const RESPONSE_SESSION_TTL_MS = 1800 * 1e3;
const MAX_RESPONSE_SESSION_ENTRIES = 500;
const responseSessionMap = /* @__PURE__ */ new Map();
function normalizeResponseSessionScope(scope) {
	const authSubject = scope.authSubject.trim();
	const requestedSessionKey = scope.requestedSessionKey?.trim();
	return {
		authSubject,
		agentId: scope.agentId,
		requestedSessionKey: requestedSessionKey || void 0
	};
}
function resolveResponseSessionAuthSubject(params) {
	if (params.requestAuth.authMethod === "trusted-proxy") return `trusted-proxy:${params.requestAuth.user}`;
	const bearer = getBearerToken(params.req);
	if (bearer) return `bearer:${createHash("sha256").update(bearer).digest("hex")}`;
	return `gateway-auth:${params.auth.mode}`;
}
function createResponseSessionScope(params) {
	return normalizeResponseSessionScope({
		authSubject: resolveResponseSessionAuthSubject(params),
		agentId: params.agentId,
		requestedSessionKey: getHeader(params.req, "x-openclaw-session-key")
	});
}
function matchesResponseSessionScope(entry, scope) {
	return entry.authSubject === scope.authSubject && entry.agentId === scope.agentId && entry.requestedSessionKey === scope.requestedSessionKey;
}
function pruneExpiredResponseSessions(now) {
	while (responseSessionMap.size > 0) {
		const oldest = responseSessionMap.entries().next().value;
		if (!oldest) return;
		const [oldestKey, oldestValue] = oldest;
		if (now - oldestValue.ts <= RESPONSE_SESSION_TTL_MS) return;
		responseSessionMap.delete(oldestKey);
	}
}
function storeResponseSession(responseId, sessionKey, scope, now = Date.now()) {
	responseSessionMap.delete(responseId);
	responseSessionMap.set(responseId, {
		...scope,
		sessionKey,
		ts: now
	});
	pruneExpiredResponseSessions(now);
	pruneMapToMaxSize(responseSessionMap, MAX_RESPONSE_SESSION_ENTRIES);
}
function lookupResponseSession(responseId, scope, now = Date.now()) {
	if (!responseId) return;
	const entry = responseSessionMap.get(responseId);
	if (!entry) return;
	if (now - entry.ts > RESPONSE_SESSION_TTL_MS) {
		responseSessionMap.delete(responseId);
		return;
	}
	if (!matchesResponseSessionScope(entry, scope)) return;
	return entry.sessionKey;
}
const testing = {
	resetResponseSessionState() {
		responseSessionMap.clear();
	},
	wrapUntrustedFileContent,
	storeResponseSessionAt(responseId, sessionKey, now, scope = {
		authSubject: "test",
		agentId: "main"
	}) {
		storeResponseSession(responseId, sessionKey, normalizeResponseSessionScope(scope), now);
	},
	lookupResponseSessionAt(responseId, now, scope = {
		authSubject: "test",
		agentId: "main"
	}) {
		return lookupResponseSession(responseId, normalizeResponseSessionScope(scope), now);
	},
	getResponseSessionIds() {
		return [...responseSessionMap.keys()];
	},
	resolveResponsesLimits
};
function writeSseEvent(res, event) {
	res.write(`event: ${event.type}\n`);
	res.write(`data: ${JSON.stringify(event)}\n\n`);
}
function resolveResponsesLimits(config) {
	const files = config?.files;
	const images = config?.images;
	const fileLimits = resolveInputFileLimits(files);
	return {
		maxBodyBytes: DEFAULT_BODY_BYTES,
		maxUrlParts: resolveIntegerOption(config?.maxUrlParts, DEFAULT_MAX_URL_PARTS, { min: 0 }),
		files: {
			...fileLimits,
			urlAllowlist: normalizeInputHostnameAllowlist(files?.urlAllowlist)
		},
		images: {
			allowUrl: images?.allowUrl ?? true,
			urlAllowlist: normalizeInputHostnameAllowlist(images?.urlAllowlist),
			allowedMimes: normalizeMimeList(images?.allowedMimes, DEFAULT_INPUT_IMAGE_MIMES),
			maxBytes: images?.maxBytes ?? 10485760,
			maxRedirects: images?.maxRedirects ?? 3,
			timeoutMs: images?.timeoutMs ?? 1e4
		}
	};
}
function extractClientTools(body) {
	return (body.tools ?? []).map((tool) => ({
		type: "function",
		function: {
			name: tool.name,
			description: tool.description,
			parameters: tool.parameters,
			strict: tool.strict
		}
	}));
}
function applyToolChoice(params) {
	const { tools, toolChoice } = params;
	if (!toolChoice) return { tools };
	if (toolChoice === "none") return { tools: [] };
	if (toolChoice === "required") {
		if (tools.length === 0) throw new Error("tool_choice=required but no tools were provided");
		const constraint = { type: "required" };
		return {
			tools,
			extraSystemPrompt: toolChoiceConstraintPrompt(constraint),
			constraint
		};
	}
	if (typeof toolChoice === "object" && toolChoice.type === "function") {
		const targetName = ("name" in toolChoice ? toolChoice.name : toolChoice.function.name).trim();
		if (!targetName) throw new Error("tool_choice.name is required");
		const matched = tools.filter((tool) => tool.function?.name === targetName);
		if (matched.length === 0) throw new Error(`tool_choice requested unknown tool: ${targetName}`);
		const constraint = {
			type: "function",
			name: targetName
		};
		return {
			tools: matched,
			extraSystemPrompt: toolChoiceConstraintPrompt(constraint),
			constraint
		};
	}
	return { tools };
}
function createEmptyUsage() {
	return toOpenAiResponsesUsage(void 0);
}
function extractUsageFromResult(result) {
	return toOpenAiResponsesUsage(resolveAgentRunUsage(result));
}
function resolveStopReasonAndPendingToolCalls(meta) {
	if (!meta || typeof meta !== "object") return {
		stopReason: void 0,
		pendingToolCalls: void 0
	};
	const record = meta;
	return {
		stopReason: record.stopReason,
		pendingToolCalls: record.pendingToolCalls
	};
}
function createResponseResource(params) {
	return {
		id: params.id,
		object: "response",
		created_at: Math.floor(Date.now() / 1e3),
		status: params.status,
		model: params.model,
		output: params.output,
		usage: params.usage ?? createEmptyUsage(),
		error: params.error
	};
}
async function runResponsesAgentCommand(params) {
	return agentCommandFromIngress({
		message: params.message,
		images: params.images.length > 0 ? params.images : void 0,
		clientTools: params.clientTools.length > 0 ? params.clientTools : void 0,
		extraSystemPrompt: params.extraSystemPrompt || void 0,
		model: params.modelOverride,
		streamParams: params.streamParams ?? void 0,
		sessionKey: params.sessionKey,
		runId: params.runId,
		deliver: false,
		messageChannel: params.messageChannel,
		senderIsOwner: params.senderIsOwner,
		bestEffortDeliver: false,
		allowModelOverride: params.modelOverride !== void 0,
		abortSignal: params.abortSignal
	}, defaultRuntime, params.deps);
}
async function handleOpenResponsesHttpRequest(req, res, opts) {
	const limits = resolveResponsesLimits(opts.config);
	const maxBodyBytes = opts.maxBodyBytes ?? Math.max(limits.maxBodyBytes, limits.files.maxBytes * 2, limits.images.maxBytes * 2);
	const handled = await handleGatewayPostJsonEndpoint(req, res, {
		pathname: "/v1/responses",
		requiredOperatorMethod: "chat.send",
		resolveOperatorScopes: resolveOpenAiCompatibleHttpOperatorScopes,
		auth: opts.auth,
		trustedProxies: opts.trustedProxies,
		allowRealIpFallback: opts.allowRealIpFallback,
		rateLimiter: opts.rateLimiter,
		maxBodyBytes
	});
	if (handled === false) return false;
	if (!handled) return true;
	const modelOverrideAuth = authorizeOpenAiCompatibleHttpModelOverride(req, handled.requestAuth);
	if (!modelOverrideAuth.allowed) {
		sendMissingScopeForbidden(res, modelOverrideAuth.missingScope);
		return true;
	}
	const senderIsOwner = resolveOpenAiCompatibleHttpSenderIsOwner(req, handled.requestAuth);
	const parseResult = CreateResponseBodySchema.safeParse(handled.body);
	if (!parseResult.success) {
		const issue = parseResult.error.issues[0];
		sendJson(res, 400, { error: {
			message: issue ? `${issue.path.join(".")}: ${issue.message}` : "Invalid request body",
			type: "invalid_request_error"
		} });
		return true;
	}
	const payload = parseResult.data;
	const stream = Boolean(payload.stream);
	const model = payload.model;
	const user = payload.user;
	let agentId;
	try {
		agentId = resolveAgentIdForRequest({
			req,
			model
		});
	} catch (err) {
		if (isAgentSelectionRequiredError(err) || isInvalidGatewayModelError(err) || isUnknownGatewayAgentError(err)) {
			sendJson(res, 400, { error: {
				message: err.message,
				type: "invalid_request_error"
			} });
			return true;
		}
		throw err;
	}
	const { modelOverride, errorMessage: modelError } = await resolveOpenAiCompatModelOverride({
		req,
		agentId,
		model
	});
	if (modelError) {
		sendJson(res, 400, { error: {
			message: modelError,
			type: "invalid_request_error"
		} });
		return true;
	}
	const prompt = buildAgentPrompt(payload.input);
	let images = [];
	const fileContexts = [];
	let urlParts = 0;
	const markUrlPart = () => {
		urlParts += 1;
		if (urlParts > limits.maxUrlParts) throw new Error(`Too many URL-based input sources: ${urlParts} (limit: ${limits.maxUrlParts})`);
	};
	try {
		if (Array.isArray(payload.input)) {
			for (const item of payload.input) if (item.type === "message" && typeof item.content !== "string") for (const part of item.content) {
				if (part.type !== "input_image" && part.type !== "input_file") continue;
				if (part.source.type === "url") markUrlPart();
				if (item !== prompt.activeUserMessage) continue;
				if (part.type === "input_image") {
					const source = part.source;
					const image = await extractImageContentFromSource(source.type === "url" ? {
						type: "url",
						url: source.url
					} : {
						type: "base64",
						data: source.data,
						mediaType: source.media_type
					}, limits.images);
					images.push(image);
					continue;
				}
				const source = part.source;
				const file = await extractFileContentFromSource({
					source: source.type === "url" ? {
						type: "url",
						url: source.url
					} : {
						type: "base64",
						data: source.data,
						mediaType: source.media_type,
						filename: source.filename
					},
					limits: limits.files
				});
				const rawText = file.text;
				if (rawText?.trim()) fileContexts.push(renderFileContextBlock({
					filename: file.filename,
					content: wrapUntrustedFileContent(rawText)
				}));
				else if (file.images && file.images.length > 0) fileContexts.push(renderFileContextBlock({
					filename: file.filename,
					content: "[PDF content rendered to images]",
					surroundContentWithNewlines: false
				}));
				else fileContexts.push(renderFileContextBlock({
					filename: file.filename,
					content: "[No extractable text]",
					surroundContentWithNewlines: false
				}));
				if (file.images && file.images.length > 0) images = images.concat(file.images);
			}
		}
	} catch (err) {
		logWarn(`openresponses: request parsing failed: ${String(err)}`);
		sendJson(res, 400, { error: {
			message: "invalid request",
			type: "invalid_request_error"
		} });
		return true;
	}
	const clientTools = extractClientTools(payload);
	let toolChoicePrompt;
	let toolChoiceConstraint;
	let resolvedClientTools = clientTools;
	try {
		const toolChoiceResult = applyToolChoice({
			tools: clientTools,
			toolChoice: payload.tool_choice
		});
		resolvedClientTools = toolChoiceResult.tools;
		toolChoicePrompt = toolChoiceResult.extraSystemPrompt;
		toolChoiceConstraint = toolChoiceResult.constraint;
	} catch (err) {
		logWarn(`openresponses: tool configuration failed: ${String(err)}`);
		sendJson(res, 400, { error: {
			message: "invalid tool configuration",
			type: "invalid_request_error"
		} });
		return true;
	}
	let resolved;
	try {
		resolved = resolveGatewayRequestContext({
			req,
			model,
			user,
			sessionPrefix: "openresponses",
			defaultMessageChannel: "webchat",
			useMessageChannelHeader: true
		});
	} catch (err) {
		if (isAgentSelectionRequiredError(err) || isUnknownGatewayAgentError(err) || isInvalidGatewayModelError(err) || isGatewaySessionKeyOverrideError(err)) {
			sendJson(res, 400, { error: {
				message: err.message,
				type: "invalid_request_error"
			} });
			return true;
		}
		throw err;
	}
	const responseSessionScope = createResponseSessionScope({
		req,
		auth: opts.auth,
		requestAuth: handled.requestAuth,
		agentId: resolved.agentId
	});
	const sessionKey = lookupResponseSession(payload.previous_response_id, responseSessionScope) ?? resolved.sessionKey;
	const messageChannel = resolved.messageChannel;
	const fileContext = fileContexts.length > 0 ? fileContexts.join("\n\n") : void 0;
	const toolChoiceContext = toolChoicePrompt?.trim();
	const extraSystemPrompt = [
		payload.instructions,
		prompt.extraSystemPrompt,
		toolChoiceContext,
		fileContext
	].filter(Boolean).join("\n\n");
	if (!prompt.message) {
		sendJson(res, 400, { error: {
			message: "Missing user message in `input`.",
			type: "invalid_request_error"
		} });
		return true;
	}
	const responseId = `resp_${randomUUID()}`;
	const rememberResponseSession = () => storeResponseSession(responseId, sessionKey, responseSessionScope);
	const outputItemId = `msg_${randomUUID()}`;
	const deps = createDefaultDeps();
	const abortController = new AbortController();
	const streamMaxTokens = typeof payload.max_output_tokens === "number" ? payload.max_output_tokens : void 0;
	const streamTemperature = typeof payload.temperature === "number" ? payload.temperature : void 0;
	const streamTopP = typeof payload.top_p === "number" ? payload.top_p : void 0;
	const streamParams = streamMaxTokens !== void 0 || streamTemperature !== void 0 || streamTopP !== void 0 ? {
		...streamMaxTokens !== void 0 ? { maxTokens: streamMaxTokens } : {},
		...streamTemperature !== void 0 ? { temperature: streamTemperature } : {},
		...streamTopP !== void 0 ? { topP: streamTopP } : {}
	} : void 0;
	if (!stream) {
		const stopWatchingDisconnect = watchClientDisconnect(req, res, abortController);
		try {
			const result = await runResponsesAgentCommand({
				message: prompt.message,
				images,
				clientTools: resolvedClientTools,
				extraSystemPrompt,
				modelOverride,
				streamParams,
				sessionKey,
				runId: responseId,
				messageChannel,
				senderIsOwner,
				deps,
				abortSignal: abortController.signal
			});
			if (abortController.signal.aborted) return true;
			const payloads = result?.payloads;
			const usage = extractUsageFromResult(result);
			const meta = result?.meta;
			const { stopReason, pendingToolCalls } = resolveStopReasonAndPendingToolCalls(meta);
			if (toolChoiceConstraint && !isToolChoiceConstraintSatisfied({
				constraint: toolChoiceConstraint,
				pendingToolCalls
			})) {
				const failed = createResponseResource({
					id: responseId,
					model,
					status: "failed",
					output: [],
					error: {
						code: "api_error",
						message: resolveUnsatisfiedToolChoiceMessage(toolChoiceConstraint)
					},
					usage
				});
				rememberResponseSession();
				sendJson(res, 502, failed);
				return true;
			}
			if (stopReason === "tool_calls" && pendingToolCalls && pendingToolCalls.length > 0) {
				const assistantText = Array.isArray(payloads) && payloads.length > 0 ? payloads.map((p) => typeof p.text === "string" ? p.text : "").filter(Boolean).join("\n\n") : "";
				const output = [];
				if (assistantText) output.push(createAssistantOutputItem({
					id: outputItemId,
					text: assistantText,
					phase: "commentary",
					status: "completed"
				}));
				for (const functionCall of pendingToolCalls) output.push(createFunctionCallOutputItem({
					id: `call_${randomUUID()}`,
					callId: functionCall.id,
					name: functionCall.name,
					arguments: functionCall.arguments
				}));
				const response = createResponseResource({
					id: responseId,
					model,
					status: "completed",
					output,
					usage
				});
				rememberResponseSession();
				sendJson(res, 200, response);
				return true;
			}
			const response = createResponseResource({
				id: responseId,
				model,
				status: "completed",
				output: [createAssistantOutputItem({
					id: outputItemId,
					text: Array.isArray(payloads) && payloads.length > 0 ? payloads.map((p) => typeof p.text === "string" ? p.text : "").filter(Boolean).join("\n\n") : "No response from OpenClaw.",
					phase: "final_answer",
					status: "completed"
				})],
				usage
			});
			rememberResponseSession();
			sendJson(res, 200, response);
		} catch (err) {
			if (abortController.signal.aborted) return true;
			logWarn(`openresponses: non-stream response failed: ${String(err)}`);
			if (isClientToolNameConflictError(err)) {
				sendJson(res, 400, createResponseResource({
					id: responseId,
					model,
					status: "failed",
					output: [],
					error: {
						code: "invalid_request_error",
						message: "invalid tool configuration"
					}
				}));
				return true;
			}
			const response = createResponseResource({
				id: responseId,
				model,
				status: "failed",
				output: [],
				error: {
					code: "api_error",
					message: "internal error"
				}
			});
			const mapped = resolveOpenAiCompatError(err);
			if (mapped) {
				const mappedResponse = createResponseResource({
					id: responseId,
					model,
					status: "failed",
					output: [],
					error: {
						code: mapped.error.type,
						message: mapped.error.message
					}
				});
				rememberResponseSession();
				sendJson(res, mapped.status, mappedResponse);
				return true;
			}
			rememberResponseSession();
			sendJson(res, 500, response);
		} finally {
			stopWatchingDisconnect();
		}
		return true;
	}
	setSseHeaders(res);
	let accumulatedText = "";
	let streamedAssistantText = "";
	let bufferedReplaceableAssistantContent = "";
	let sawAssistantDelta = false;
	let unrepresentableAssistantReplacement = false;
	let closed = false;
	let unsubscribe = () => {};
	let stopWatchingDisconnect = () => {};
	let finalUsage;
	let finalizeStatus = null;
	let finalizeRequested = null;
	let finalizeScheduled = false;
	let finalizeErrorMessage;
	let terminalLifecyclePhase = "end";
	const maybeFinalize = () => {
		if (closed || finalizeScheduled) return;
		if (!finalizeRequested) return;
		if (!finalUsage) return;
		finalizeScheduled = true;
		setImmediate(() => {
			if (closed || !finalizeRequested || !finalUsage) return;
			if (unrepresentableAssistantReplacement) {
				finalizeUnrepresentableAssistantReplacement();
				return;
			}
			const usage = finalUsage;
			const finalText = accumulatedText || bufferedReplaceableAssistantContent || finalizeRequested.text;
			closed = true;
			stopWatchingDisconnect();
			unsubscribe();
			writeSseEvent(res, {
				type: "response.output_text.done",
				item_id: outputItemId,
				output_index: 0,
				content_index: 0,
				text: finalText
			});
			writeSseEvent(res, {
				type: "response.content_part.done",
				item_id: outputItemId,
				output_index: 0,
				content_index: 0,
				part: {
					type: "output_text",
					text: finalText
				}
			});
			const completedItem = createAssistantOutputItem({
				id: outputItemId,
				text: finalText,
				phase: finalizeRequested.status === "completed" ? "final_answer" : "commentary",
				status: "completed"
			});
			writeSseEvent(res, {
				type: "response.output_item.done",
				output_index: 0,
				item: completedItem
			});
			const finalResponse = createResponseResource({
				id: responseId,
				model,
				status: finalizeRequested.status,
				output: [completedItem],
				usage,
				...finalizeRequested.status === "failed" ? { error: {
					code: "server_error",
					message: finalizeErrorMessage || "Agent run failed"
				} } : {}
			});
			rememberResponseSession();
			writeSseEvent(res, {
				type: finalizeRequested.status === "failed" ? "response.failed" : "response.completed",
				response: finalResponse
			});
			writeDone(res);
			res.end();
		});
	};
	const requestFinalize = (status, text, errorMessage) => {
		if (finalizeRequested) return;
		finalizeStatus = status;
		finalizeErrorMessage = errorMessage;
		finalizeRequested = {
			status,
			text
		};
		maybeFinalize();
	};
	const finalizeFailedResponse = (response) => {
		if (closed) return;
		closed = true;
		stopWatchingDisconnect();
		unsubscribe();
		writeSseEvent(res, {
			type: "response.failed",
			response
		});
		writeDone(res);
		res.end();
	};
	const finalizeUnrepresentableAssistantReplacement = () => {
		const usage = finalUsage;
		if (!usage) return;
		rememberResponseSession();
		finalizeFailedResponse(createResponseResource({
			id: responseId,
			model,
			status: "failed",
			output: [],
			error: {
				code: "server_error",
				message: "Assistant output cannot be represented as an append-only response stream."
			},
			usage
		}));
	};
	const initialResponse = createResponseResource({
		id: responseId,
		model,
		status: "in_progress",
		output: []
	});
	writeSseEvent(res, {
		type: "response.created",
		response: initialResponse
	});
	writeSseEvent(res, {
		type: "response.in_progress",
		response: initialResponse
	});
	writeSseEvent(res, {
		type: "response.output_item.added",
		output_index: 0,
		item: createAssistantOutputItem({
			id: outputItemId,
			text: "",
			status: "in_progress"
		})
	});
	writeSseEvent(res, {
		type: "response.content_part.added",
		item_id: outputItemId,
		output_index: 0,
		content_index: 0,
		part: {
			type: "output_text",
			text: ""
		}
	});
	unsubscribe = onAgentEvent((evt) => {
		if (evt.runId !== responseId) return;
		if (closed) return;
		if (evt.stream === "assistant") {
			if (isReplaceableAssistantStreamEvent(evt)) {
				const snapshot = resolveAssistantStreamSnapshotText(evt);
				if (snapshot) bufferedReplaceableAssistantContent = snapshot;
				return;
			}
			const text = evt.data?.text;
			if (evt.data?.replace === true && typeof text === "string") {
				accumulatedText = text;
				if (toolChoiceConstraint) return;
				if (!text.startsWith(streamedAssistantText)) {
					unrepresentableAssistantReplacement = true;
					return;
				}
				unrepresentableAssistantReplacement = false;
				const replacementDelta = text.slice(streamedAssistantText.length);
				if (replacementDelta) {
					sawAssistantDelta = true;
					streamedAssistantText = text;
					writeSseEvent(res, {
						type: "response.output_text.delta",
						item_id: outputItemId,
						output_index: 0,
						content_index: 0,
						delta: replacementDelta
					});
				}
				return;
			}
			const content = resolveAssistantStreamDeltaText(evt);
			if (!content) return;
			if (toolChoiceConstraint) {
				accumulatedText += content;
				return;
			}
			sawAssistantDelta = true;
			accumulatedText += content;
			streamedAssistantText += content;
			writeSseEvent(res, {
				type: "response.output_text.delta",
				item_id: outputItemId,
				output_index: 0,
				content_index: 0,
				delta: content
			});
			return;
		}
		if (evt.stream === "lifecycle") {
			const phase = evt.data?.phase;
			if (phase === "end" || phase === "error") {
				const finalText = accumulatedText || bufferedReplaceableAssistantContent || "No response from OpenClaw.";
				const finalStatus = phase === "error" ? "failed" : "completed";
				const errorMessage = phase === "error" && typeof evt.data?.error === "string" ? evt.data.error.trim() : void 0;
				requestFinalize(finalStatus, finalText, errorMessage);
			}
		}
	});
	const releaseAgentRootWork = retainGatewayRootWorkAdmissionContinuation();
	const releaseResponseRootWork = retainGatewayRootWorkAdmissionContinuation();
	const releaseStreamRootWork = () => {
		res.off("finish", releaseStreamRootWork);
		res.off("close", releaseStreamRootWork);
		releaseResponseRootWork?.();
	};
	res.once("finish", releaseStreamRootWork);
	res.once("close", releaseStreamRootWork);
	stopWatchingDisconnect = watchClientDisconnect(req, res, abortController, () => {
		closed = true;
		unsubscribe();
		releaseStreamRootWork();
	});
	(async () => {
		try {
			const result = await runResponsesAgentCommand({
				message: prompt.message,
				images,
				clientTools: resolvedClientTools,
				extraSystemPrompt,
				modelOverride,
				streamParams,
				sessionKey,
				runId: responseId,
				messageChannel,
				senderIsOwner,
				deps,
				abortSignal: abortController.signal
			});
			finalUsage = extractUsageFromResult(result);
			if (unrepresentableAssistantReplacement) {
				finalizeUnrepresentableAssistantReplacement();
				return;
			}
			const resultAny = result;
			const resultPayloadText = Array.isArray(resultAny.payloads) ? resultAny.payloads.map((p) => typeof p.text === "string" ? p.text : "").filter(Boolean).join("\n\n") : "";
			const meta = resultAny.meta;
			const { stopReason, pendingToolCalls } = resolveStopReasonAndPendingToolCalls(meta);
			if (!closed && toolChoiceConstraint && !isToolChoiceConstraintSatisfied({
				constraint: toolChoiceConstraint,
				pendingToolCalls
			})) {
				const failed = createResponseResource({
					id: responseId,
					model,
					status: "failed",
					output: [],
					error: {
						code: "api_error",
						message: resolveUnsatisfiedToolChoiceMessage(toolChoiceConstraint)
					},
					usage: finalUsage ?? createEmptyUsage()
				});
				closed = true;
				stopWatchingDisconnect();
				unsubscribe();
				rememberResponseSession();
				writeSseEvent(res, {
					type: "response.failed",
					response: failed
				});
				writeDone(res);
				res.end();
				return;
			}
			if (!closed && stopReason === "tool_calls" && pendingToolCalls && pendingToolCalls.length > 0) {
				const usage = finalUsage ?? createEmptyUsage();
				const finalText = accumulatedText || resultPayloadText || bufferedReplaceableAssistantContent;
				if (toolChoiceConstraint && finalText && !sawAssistantDelta) {
					sawAssistantDelta = true;
					writeSseEvent(res, {
						type: "response.output_text.delta",
						item_id: outputItemId,
						output_index: 0,
						content_index: 0,
						delta: finalText
					});
				}
				writeSseEvent(res, {
					type: "response.output_text.done",
					item_id: outputItemId,
					output_index: 0,
					content_index: 0,
					text: finalText
				});
				writeSseEvent(res, {
					type: "response.content_part.done",
					item_id: outputItemId,
					output_index: 0,
					content_index: 0,
					part: {
						type: "output_text",
						text: finalText
					}
				});
				const completedItem = createAssistantOutputItem({
					id: outputItemId,
					text: finalText,
					phase: "commentary",
					status: "completed"
				});
				writeSseEvent(res, {
					type: "response.output_item.done",
					output_index: 0,
					item: completedItem
				});
				const functionCallItems = [];
				let nextStreamOutputIndex = 1;
				for (const functionCall of pendingToolCalls) {
					const functionCallItemId = `call_${randomUUID()}`;
					const functionCallItem = createFunctionCallOutputItem({
						id: functionCallItemId,
						callId: functionCall.id,
						name: functionCall.name,
						arguments: functionCall.arguments
					});
					writeSseEvent(res, {
						type: "response.output_item.added",
						output_index: nextStreamOutputIndex,
						item: functionCallItem
					});
					const completedFunctionCallItem = createFunctionCallOutputItem({
						id: functionCallItemId,
						callId: functionCall.id,
						name: functionCall.name,
						arguments: functionCall.arguments,
						status: "completed"
					});
					writeSseEvent(res, {
						type: "response.output_item.done",
						output_index: nextStreamOutputIndex,
						item: completedFunctionCallItem
					});
					functionCallItems.push(functionCallItem);
					nextStreamOutputIndex += 1;
				}
				const completedResponse = createResponseResource({
					id: responseId,
					model,
					status: "completed",
					output: [completedItem, ...functionCallItems],
					usage
				});
				closed = true;
				stopWatchingDisconnect();
				unsubscribe();
				rememberResponseSession();
				writeSseEvent(res, {
					type: "response.completed",
					response: completedResponse
				});
				writeDone(res);
				res.end();
				return;
			}
			if (!sawAssistantDelta) {
				const content = resultPayloadText || bufferedReplaceableAssistantContent || "No response from OpenClaw.";
				accumulatedText = content;
				sawAssistantDelta = true;
				if (finalizeStatus !== null) finalizeRequested = {
					status: finalizeStatus,
					text: content
				};
				writeSseEvent(res, {
					type: "response.output_text.delta",
					item_id: outputItemId,
					output_index: 0,
					content_index: 0,
					delta: content
				});
			}
			maybeFinalize();
		} catch (err) {
			if (closed || abortController.signal.aborted) return;
			terminalLifecyclePhase = "error";
			logWarn(`openresponses: streaming response failed: ${String(err)}`);
			finalUsage = finalUsage ?? createEmptyUsage();
			if (isClientToolNameConflictError(err)) {
				const errorResponse = createResponseResource({
					id: responseId,
					model,
					status: "failed",
					output: [],
					error: {
						code: "invalid_request_error",
						message: "invalid tool configuration"
					},
					usage: finalUsage
				});
				finalizeFailedResponse(errorResponse);
				return;
			}
			const errorResponse = createResponseResource({
				id: responseId,
				model,
				status: "failed",
				output: [],
				error: {
					code: "api_error",
					message: "internal error"
				},
				usage: finalUsage
			});
			const mapped = resolveOpenAiCompatError(err);
			if (mapped) {
				const mappedResponse = createResponseResource({
					id: responseId,
					model,
					status: "failed",
					output: [],
					error: {
						code: mapped.error.type,
						message: mapped.error.message
					},
					usage: finalUsage
				});
				rememberResponseSession();
				finalizeFailedResponse(mappedResponse);
				return;
			}
			rememberResponseSession();
			finalizeFailedResponse(errorResponse);
		} finally {
			releaseAgentRootWork?.();
			if (finalizeStatus === null && (terminalLifecyclePhase === "error" || !closed)) emitAgentEvent({
				runId: responseId,
				stream: "lifecycle",
				data: { phase: terminalLifecyclePhase }
			});
		}
	})();
	return true;
}
//#endregion
export { buildAgentPrompt, handleOpenResponsesHttpRequest, testing };
