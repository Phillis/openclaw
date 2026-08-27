import { l as redactToolDetail } from "./redact-Cl7lwBnl.js";
import "./utils-DEqefz4f.js";
import { t as isPlainObject } from "./plain-object-5a0EzLzX.js";
import { g as normalizeToolPolicyName } from "./tool-policy-CWmnHLY1.js";
import { n as logError, t as logDebug } from "./logger-DKrZPnAI.js";
import { _ as consumeFinalClientVoiceToolConfirmation, b as runBeforeToolCallHook, c as recordStructuredReplayTrustForToolCall, f as createInternalExecutionPreparer, i as isBeforeToolCallBlockedError, n as finalizeBeforeToolCallExecutionParams, o as prepareBeforeToolCallExecutionParams, p as readInternalExecutionControl, s as recordAdjustedParamsForToolCall, t as buildBlockedToolResult } from "./agent-tools.before-tool-call-aNXucund.js";
import { t as sanitizeForConsole } from "./console-sanitize-NjY4pEOW.js";
import { r as attachInternalToolExecutionPreparer, s as getInternalToolExecutionPreparer } from "./internal-hooks-BK9FsMLA.js";
import { c as normalizeCodeModeExecBeforeHookParams, i as getCodeModeExecBeforeHookMetadata, r as copyCodeModeControlToolIdentity } from "./code-mode-control-tools-ChmXUFfk.js";
import { l as payloadTextResult, n as ToolInputError } from "./common-BGOZLJ2_.js";
import { t as jsonResult } from "./tool-results-BCM3fdVS.js";
import { S as isToolWrappedWithBeforeToolCallHook } from "./gateway-Cl3WHu5g.js";
import { createHash } from "node:crypto";
//#region src/agents/agent-tool-definition-adapter.ts
/**
* Adapts runtime AgentTool objects into session ToolDefinition entries.
* Owns hook execution, client-tool delegation, result coercion, and safe
* logging for failed tool calls.
*/
const TOOL_ERROR_PARAM_PREVIEW_MAX_CHARS = 600;
const TOOL_ERROR_EXEC_COMMAND_HASH_CHARS = 16;
const SENSITIVE_EXEC_ENV_VALUE = "[omitted exec env value]";
const EXEC_COMMAND_PARAM_KEYS = /* @__PURE__ */ new Set(["command", "cmd"]);
function isAbortSignal(value) {
	return typeof value === "object" && value !== null && "aborted" in value;
}
function isLegacyToolExecuteArgs(args) {
	const third = args[2];
	const fifth = args[4];
	if (typeof third === "function") return true;
	return isAbortSignal(fifth);
}
function describeToolExecutionError(err) {
	if (err instanceof Error) return {
		message: err.message?.trim() ? err.message : String(err),
		stack: err.stack
	};
	return { message: String(err) };
}
function serializeToolParams(value) {
	if (value === void 0) return "<undefined>";
	if (typeof value === "string") return value;
	if (value === null || typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return String(value);
	try {
		const serialized = JSON.stringify(value);
		if (typeof serialized === "string") return serialized;
	} catch {}
	if (typeof value === "function") return value.name ? `[Function ${value.name}]` : "[Function anonymous]";
	if (typeof value === "symbol") return value.description ? `Symbol(${value.description})` : "Symbol()";
	return Object.prototype.toString.call(value);
}
function formatToolParamPreview(label, value) {
	return `${label}=${sanitizeForConsole(redactToolDetail(serializeToolParams(value)), TOOL_ERROR_PARAM_PREVIEW_MAX_CHARS) ?? "<empty>"}`;
}
function kindForLog(value) {
	if (Array.isArray(value)) return "array";
	if (value === null) return "null";
	return typeof value;
}
function summarizeSensitiveValueForLog(params) {
	const serialized = serializeToolParams(params.value);
	return {
		omitted: true,
		reason: params.reason,
		type: kindForLog(params.value),
		chars: serialized.length,
		sha256: createHash("sha256").update(serialized).digest("hex").slice(0, TOOL_ERROR_EXEC_COMMAND_HASH_CHARS)
	};
}
function summarizeExecCommandForLog(command) {
	return summarizeSensitiveValueForLog({
		value: command,
		reason: "exec command may contain credentials"
	});
}
function sanitizeExecEnvForLog(value) {
	if (!isPlainObject(value)) return value === void 0 ? void 0 : "[omitted exec env]";
	return Object.fromEntries(Object.keys(value).toSorted().map((key) => [key, SENSITIVE_EXEC_ENV_VALUE]));
}
function sanitizeExecFailureParamsForLog(value) {
	if (typeof value === "string") try {
		const parsed = JSON.parse(value);
		if (isPlainObject(parsed)) return sanitizeExecFailureParamsForLog(parsed);
	} catch {}
	if (!isPlainObject(value)) return summarizeSensitiveValueForLog({
		value,
		reason: "exec params may contain command credentials"
	});
	const sanitized = {};
	for (const [key, field] of Object.entries(value)) {
		if (EXEC_COMMAND_PARAM_KEYS.has(key)) {
			sanitized[key] = summarizeExecCommandForLog(field);
			continue;
		}
		if (key === "env") {
			sanitized[key] = sanitizeExecEnvForLog(field);
			continue;
		}
		sanitized[key] = field;
	}
	return sanitized;
}
function sanitizeToolFailureParamsForLog(toolName, value) {
	return toolName === "exec" ? sanitizeExecFailureParamsForLog(value) : value;
}
function describeToolFailureInputs(params) {
	const rawParams = sanitizeToolFailureParamsForLog(params.toolName, params.rawParams);
	const effectiveParams = sanitizeToolFailureParamsForLog(params.toolName, params.effectiveParams);
	const parts = [formatToolParamPreview("raw_params", rawParams)];
	const rawSerialized = serializeToolParams(rawParams);
	if (serializeToolParams(effectiveParams) !== rawSerialized) parts.push(formatToolParamPreview("effective_params", effectiveParams));
	return parts.join(" ");
}
function normalizeToolExecutionResult(params) {
	const { toolName, result } = params;
	if (result && typeof result === "object") {
		const record = result;
		if (Array.isArray(record.content)) return result;
		logDebug(`tools: ${toolName} returned non-standard result (missing content[]); coercing`);
		return payloadTextResult(("details" in record ? record.details : record) ?? {
			status: "ok",
			tool: toolName
		});
	}
	return payloadTextResult(result ?? {
		status: "ok",
		tool: toolName
	});
}
function buildToolExecutionErrorResult(params) {
	return jsonResult({
		status: "error",
		tool: params.toolName,
		error: params.message
	});
}
async function executeAdaptedToolOperation(params) {
	try {
		return normalizeToolExecutionResult({
			toolName: params.normalizedToolName,
			result: await params.run()
		});
	} catch (err) {
		if (params.signal?.aborted) throw err;
		if (isBeforeToolCallBlockedError(err)) {
			logDebug(`tools: ${params.normalizedToolName} blocked by before_tool_call: ${err.reason}`);
			return buildBlockedToolResult({
				reason: err.reason,
				toolCallId: params.toolCallId,
				runId: params.hookContext?.runId
			});
		}
		const described = describeToolExecutionError(err);
		if (described.stack && described.stack !== described.message) logDebug(`tools: ${params.normalizedToolName} failed stack:\n${described.stack}`);
		const inputPreview = describeToolFailureInputs({
			toolName: params.normalizedToolName,
			rawParams: params.rawParams,
			effectiveParams: params.getEffectiveParams()
		});
		logError(`[tools] ${params.normalizedToolName} failed: ${described.message} ${inputPreview}`);
		return buildToolExecutionErrorResult({
			toolName: params.normalizedToolName,
			message: described.message
		});
	}
}
function splitToolExecuteArgs(args) {
	if (isLegacyToolExecuteArgs(args)) {
		const [toolCallId, params, onUpdate, _ctx, signal] = args;
		return {
			toolCallId,
			params,
			onUpdate,
			signal
		};
	}
	const [toolCallId, params, signal, onUpdate] = args;
	return {
		toolCallId,
		params,
		onUpdate,
		signal
	};
}
function attachAdapterExecutionPreparer(definition) {
	return attachInternalToolExecutionPreparer(definition, createInternalExecutionPreparer((params, control) => definition.execute(params.toolCallId, params.args, params.signal, params.onUpdate, control)));
}
const CLIENT_TOOL_NAME_CONFLICT_PREFIX = "client tool name conflict:";
/** Find client-hosted tool names that collide with runtime or sibling tools. */
function findClientToolNameConflicts(params) {
	const existingNormalized = /* @__PURE__ */ new Set();
	for (const name of params.existingToolNames ?? []) {
		const trimmed = name.trim();
		if (trimmed) existingNormalized.add(normalizeToolPolicyName(trimmed));
	}
	const conflicts = /* @__PURE__ */ new Set();
	const seenClientNames = /* @__PURE__ */ new Map();
	for (const tool of params.tools) {
		const rawName = (tool.function?.name ?? "").trim();
		if (!rawName) continue;
		const normalizedName = normalizeToolPolicyName(rawName);
		if (existingNormalized.has(normalizedName)) conflicts.add(rawName);
		const priorClientName = seenClientNames.get(normalizedName);
		if (priorClientName) {
			conflicts.add(priorClientName);
			conflicts.add(rawName);
			continue;
		}
		seenClientNames.set(normalizedName, rawName);
	}
	return Array.from(conflicts);
}
/** Build a recognizable error for rejecting conflicting client tool names. */
function createClientToolNameConflictError(conflicts) {
	return /* @__PURE__ */ new Error(`${CLIENT_TOOL_NAME_CONFLICT_PREFIX} ${conflicts.join(", ")}`);
}
/** Detect client tool conflict errors without depending on object identity. */
function isClientToolNameConflictError(err) {
	return err instanceof Error && err.message.startsWith(CLIENT_TOOL_NAME_CONFLICT_PREFIX);
}
/** Convert executable agent tools into session definitions with hook handling. */
function toToolDefinitions(tools, hookContext) {
	return tools.map((tool) => {
		const name = tool.name || "tool";
		const normalizedName = normalizeToolPolicyName(name);
		const beforeHookWrapped = isToolWrappedWithBeforeToolCallHook(tool);
		const sourcePreparer = getInternalToolExecutionPreparer(tool);
		const definition = {
			name,
			label: tool.label ?? name,
			...tool.hideFromChannelProgress === true ? { hideFromChannelProgress: true } : {},
			...tool.resultContentSource ? { resultContentSource: tool.resultContentSource } : {},
			description: tool.description ?? "",
			parameters: tool.parameters,
			prepareArguments: tool.prepareArguments,
			executionMode: tool.executionMode,
			execute: async (...args) => {
				const { toolCallId, params, onUpdate, signal } = splitToolExecuteArgs(args);
				const control = readInternalExecutionControl(args[4]);
				recordStructuredReplayTrustForToolCall(toolCallId, tool, hookContext?.runId);
				let executeParams = params;
				return await executeAdaptedToolOperation({
					toolCallId,
					normalizedToolName: normalizedName,
					rawParams: params,
					getEffectiveParams: () => executeParams,
					signal,
					hookContext,
					run: async () => {
						if (!beforeHookWrapped) {
							const preparedParams = await prepareBeforeToolCallExecutionParams({
								tool,
								params,
								...toolCallId ? { toolCallId } : {},
								...hookContext ? { ctx: hookContext } : {},
								...signal ? { signal } : {}
							});
							const hookParams = normalizeCodeModeExecBeforeHookParams({
								tool,
								params: preparedParams
							});
							const hookMetadata = getCodeModeExecBeforeHookMetadata({
								tool,
								params: preparedParams
							});
							const hookOutcome = await runBeforeToolCallHook({
								toolName: name,
								params: hookParams,
								...hookMetadata,
								toolCallId,
								ctx: hookContext,
								signal
							});
							if (hookOutcome.blocked) {
								if (hookOutcome.kind === "veto") return buildBlockedToolResult({
									reason: hookOutcome.reason,
									deniedReason: hookOutcome.deniedReason,
									toolCallId,
									runId: hookContext?.runId
								});
								throw new Error(hookOutcome.reason);
							}
							executeParams = finalizeBeforeToolCallExecutionParams({
								tool,
								preparedParams,
								hookParams,
								adjustedParams: hookOutcome.params,
								finalizerMode: "adapter"
							});
							const decision = control ? await control.pause(executeParams) : void 0;
							if (decision && !decision.launch) return {
								content: [],
								details: { status: "skipped" }
							};
							const voiceConfirmation = consumeFinalClientVoiceToolConfirmation({
								toolName: name,
								params: executeParams,
								ctx: hookContext
							});
							if (!voiceConfirmation.allowed) return buildBlockedToolResult({
								reason: voiceConfirmation.reason,
								deniedReason: "client-voice-confirmation",
								toolCallId,
								runId: hookContext?.runId
							});
							decision?.start?.();
							recordAdjustedParamsForToolCall(toolCallId, executeParams, hookContext?.runId);
						}
						return await tool.execute(toolCallId, executeParams, signal, onUpdate);
					}
				});
			}
		};
		copyCodeModeControlToolIdentity(tool, definition);
		if (!sourcePreparer) return beforeHookWrapped ? definition : attachAdapterExecutionPreparer(definition);
		return attachInternalToolExecutionPreparer(definition, async (params) => {
			recordStructuredReplayTrustForToolCall(params.toolCallId, tool, hookContext?.runId);
			const settle = (run) => executeAdaptedToolOperation({
				toolCallId: params.toolCallId,
				normalizedToolName: normalizedName,
				rawParams: params.args,
				getEffectiveParams: () => params.args,
				signal: params.signal,
				hookContext,
				run
			});
			const settleImmediate = async (outcome, dispose) => {
				try {
					return {
						kind: "immediate",
						outcome: {
							kind: "result",
							result: await settle(async () => {
								if (outcome.kind === "error") throw outcome.error;
								return outcome.result;
							}),
							isError: outcome.kind === "result" && outcome.isError
						},
						dispose
					};
				} catch (error) {
					return {
						kind: "immediate",
						outcome: {
							kind: "error",
							error
						},
						dispose
					};
				}
			};
			let prepared;
			try {
				prepared = await sourcePreparer({
					toolCallId: params.toolCallId,
					args: params.args,
					...params.signal ? { signal: params.signal } : {},
					...params.onUpdate ? { onUpdate: params.onUpdate } : {}
				});
			} catch (error) {
				return await settleImmediate({
					kind: "error",
					error
				}, () => {});
			}
			if (prepared.kind === "immediate") return await settleImmediate(prepared.outcome, prepared.dispose);
			const ready = prepared;
			return {
				kind: "ready",
				args: ready.args,
				execute: (onImplementationStart) => settle(() => ready.execute(onImplementationStart)),
				dispose: ready.dispose
			};
		});
	});
}
function coerceParamsRecord(value, schema) {
	let record;
	if (isPlainObject(value)) record = value;
	else if (value === void 0 || value === null) record = {};
	else if (typeof value === "string") {
		const trimmed = value.trim();
		if (!trimmed) record = {};
		else {
			let parsed;
			try {
				parsed = JSON.parse(trimmed);
			} catch {
				throw new ToolInputError("Invalid client tool arguments: expected a JSON object");
			}
			if (parsed === null) record = {};
			else if (isPlainObject(parsed)) record = parsed;
			else throw new ToolInputError("Invalid client tool arguments: expected a JSON object");
		}
	} else throw new ToolInputError("Invalid client tool arguments: expected a JSON object");
	const missing = (Array.isArray(schema?.required) ? schema.required.filter((key) => typeof key === "string") : []).filter((key) => !Object.hasOwn(record, key));
	if (missing.length > 0) throw new ToolInputError(`Invalid client tool arguments: missing required ${missing.join(", ")}`);
	return record;
}
/** Convert client-hosted tools into pending session definitions. */
function toClientToolDefinitions(tools, onClientToolCall, hookContext) {
	return tools.map((tool) => {
		const func = tool.function;
		return attachAdapterExecutionPreparer({
			name: func.name,
			label: func.name,
			description: func.description ?? "",
			parameters: func.parameters,
			execute: async (...args) => {
				const { toolCallId, params, signal } = splitToolExecuteArgs(args);
				const control = readInternalExecutionControl(args[4]);
				if (onClientToolCall && typeof onClientToolCall !== "function") onClientToolCall.reserve?.(toolCallId, func.name);
				try {
					const initialParamsRecord = coerceParamsRecord(params, func.parameters);
					const outcome = await runBeforeToolCallHook({
						toolName: func.name,
						params: initialParamsRecord,
						toolCallId,
						ctx: hookContext,
						signal
					});
					if (outcome.blocked) {
						if (onClientToolCall && typeof onClientToolCall !== "function") onClientToolCall.discard?.(toolCallId, func.name);
						if (outcome.kind === "veto") return buildBlockedToolResult({
							reason: outcome.reason,
							deniedReason: outcome.deniedReason,
							toolCallId,
							runId: hookContext?.runId
						});
						throw new Error(outcome.reason);
					}
					const adjustedParams = outcome.params;
					const paramsRecord = coerceParamsRecord(adjustedParams, func.parameters);
					const decision = control ? await control.pause(paramsRecord) : void 0;
					if (decision && !decision.launch) {
						if (onClientToolCall && typeof onClientToolCall !== "function") onClientToolCall.discard?.(toolCallId, func.name);
						return {
							content: [],
							details: { status: "skipped" }
						};
					}
					const voiceConfirmation = consumeFinalClientVoiceToolConfirmation({
						toolName: func.name,
						params: paramsRecord,
						ctx: hookContext
					});
					if (!voiceConfirmation.allowed) {
						if (onClientToolCall && typeof onClientToolCall !== "function") onClientToolCall.discard?.(toolCallId, func.name);
						return buildBlockedToolResult({
							reason: voiceConfirmation.reason,
							deniedReason: "client-voice-confirmation",
							toolCallId,
							runId: hookContext?.runId
						});
					}
					decision?.start?.();
					if (onClientToolCall) if (typeof onClientToolCall === "function") onClientToolCall(func.name, paramsRecord);
					else onClientToolCall.complete(toolCallId, func.name, paramsRecord);
				} catch (err) {
					if (onClientToolCall && typeof onClientToolCall !== "function") onClientToolCall.discard?.(toolCallId, func.name);
					if (err instanceof ToolInputError) return buildToolExecutionErrorResult({
						toolName: func.name,
						message: err.message
					});
					throw err;
				}
				return {
					...jsonResult({
						status: "pending",
						tool: func.name,
						message: "Tool execution delegated to client"
					}),
					terminate: true
				};
			}
		});
	});
}
//#endregion
export { toToolDefinitions as a, toClientToolDefinitions as i, findClientToolNameConflicts as n, isClientToolNameConflictError as r, createClientToolNameConflictError as t };
