import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { t as coerceErrorMessage } from "./error-coercion-DisD0JTb.js";
import { C as parseStrictNonNegativeInteger, P as resolvePositiveTimerTimeoutMs, y as parseDateStringTimestampMs } from "./number-coercion-oCkfUEEq.js";
import { n as estimateStringChars } from "./cjk-chars-B-gnWt4x.js";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { d as readResponseWithLimit } from "./http-body-D5I0NwSl.js";
import { d as resolveClaudeSonnet5ModelIdentity, o as resolveClaudeFable5ModelIdentity, u as resolveClaudeOpus5ModelIdentity } from "./src-88rHSicm.js";
import "./llm-C6LpWjvd.js";
import { n as ok, t as err } from "./result-BQGgYouL.js";
import { n as TranscriptNotContinuableError } from "./errors-wmH7Ncz4.js";
import { a as getInternalBeforeToolBatch, l as takeInternalToolBatchLifecycle, o as getInternalSyncSteeringGetter, s as getInternalToolExecutionPreparer, t as attachInternalSyncSteeringGetter } from "./internal-hooks-BK9FsMLA.js";
import { i as streamSimple, n as completeSimple } from "./stream-CgPJAnrX.js";
import { t as event_stream_exports } from "./event-stream-MHM-_qcK.js";
import { c as selectResetKeptEntries } from "./tool-result-pairing-DSYUlrYa.js";
import { AsyncLocalStorage } from "node:async_hooks";
import { replaceCompactionReplayOwnerContent, stripCompactionReplayCheckpoint } from "@openclaw/ai/transports";
import "@openclaw/ai/event-stream";
import { validateToolArguments } from "@openclaw/ai/validation";
import { createSseByteGuard, parseStreamingJson } from "@openclaw/ai/internal/runtime";
//#region packages/agent-core/src/harness/session/uuid.ts
let lastTimestamp = -Infinity;
let sequence = 0;
function fillRandomBytes(bytes) {
	const crypto = globalThis.crypto;
	if (crypto?.getRandomValues) {
		crypto.getRandomValues(bytes);
		return;
	}
	for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
}
/** Generate a monotonic UUIDv7 string. */
function uuidv7() {
	const random = /* @__PURE__ */ new Uint8Array(16);
	fillRandomBytes(random);
	const timestamp = Date.now();
	if (timestamp > lastTimestamp) {
		sequence = new DataView(random.buffer, random.byteOffset + 6, 4).getUint32(0);
		lastTimestamp = timestamp;
	} else {
		sequence = sequence + 1 >>> 0;
		if (sequence === 0) lastTimestamp++;
	}
	const bytes = /* @__PURE__ */ new Uint8Array(16);
	bytes[0] = lastTimestamp / 1099511627776 & 255;
	bytes[1] = lastTimestamp / 4294967296 & 255;
	bytes[2] = lastTimestamp / 16777216 & 255;
	bytes[3] = lastTimestamp / 65536 & 255;
	bytes[4] = lastTimestamp / 256 & 255;
	bytes[5] = lastTimestamp & 255;
	bytes[6] = 112 | sequence >>> 28 & 15;
	bytes[7] = sequence >>> 20 & 255;
	bytes[8] = 128 | sequence >>> 14 & 63;
	bytes[9] = sequence >>> 6 & 255;
	const randomLowBits = random.at(10);
	if (randomLowBits === void 0) throw new Error("UUID random buffer is shorter than 11 bytes");
	bytes[10] = (sequence & 63) << 2 | randomLowBits & 3;
	bytes.set(random.subarray(11), 11);
	return formatUuid(bytes);
}
function formatUuid(bytes) {
	const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"));
	return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10, 16).join("")}`;
}
//#endregion
//#region packages/agent-core/src/reasoning.ts
const ENABLED_THINKING_LEVELS = /* @__PURE__ */ new Set([
	"minimal",
	"low",
	"medium",
	"high",
	"xhigh",
	"max"
]);
function isEnabledThinkingLevel(value) {
	return ENABLED_THINKING_LEVELS.has(value);
}
function resolveAgentReasoningOption(model, thinkingLevel) {
	if (thinkingLevel !== "off") return thinkingLevel;
	const offFallback = model.thinkingLevelMap?.off ?? ((model.api === "anthropic-messages" || model.api === "bedrock-converse-stream") && resolveClaudeFable5ModelIdentity(model) ? "low" : void 0);
	if (isEnabledThinkingLevel(offFallback)) return offFallback;
	return model.api === "anthropic-messages" && (resolveClaudeSonnet5ModelIdentity(model) || resolveClaudeOpus5ModelIdentity(model)) ? "off" : void 0;
}
//#endregion
//#region packages/agent-core/src/runtime-deps.ts
function missingRuntimeDep(name) {
	return /* @__PURE__ */ new Error(`@openclaw/agent-core runtime dependency "${name}" is not configured. Pass an AgentCoreRuntimeDeps instance or a streamFn explicitly.`);
}
/** Resolve the stream function, preferring an explicit override over injected runtime deps. */
function resolveAgentCoreStreamFn(runtime, streamFn) {
	if (streamFn) return streamFn;
	if (runtime?.streamSimple) return runtime.streamSimple;
	throw missingRuntimeDep("streamSimple");
}
/** Resolve the completion function used by non-streaming helper flows. */
function resolveAgentCoreCompleteFn(runtime) {
	if (runtime?.completeSimple) return runtime.completeSimple;
	throw missingRuntimeDep("completeSimple");
}
//#endregion
//#region packages/agent-core/src/tool-execution-context.ts
const activeToolExecution = new AsyncLocalStorage();
function getAgentToolExecutionContext() {
	return activeToolExecution.getStore();
}
function runWithAgentToolExecutionContext(context, run) {
	return activeToolExecution.run(context, run);
}
//#endregion
//#region packages/agent-core/src/turn-interruption.ts
/** Canonical empty aborted/error assistant recorded when a run ends without output. */
function createFailureMessage(model, error, aborted) {
	return {
		role: "assistant",
		content: [{
			type: "text",
			text: ""
		}],
		api: model.api,
		provider: model.provider,
		model: model.id,
		stopReason: aborted ? "aborted" : "error",
		errorMessage: error instanceof Error ? error.message : String(error),
		timestamp: Date.now(),
		usage: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0,
			totalTokens: 0,
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0,
				total: 0
			}
		}
	};
}
const INTERRUPTED_TURN_GUIDANCE = `<turn_aborted>
The previous turn was interrupted. Any running background processes may still be active. If any tools or commands were aborted, they may have partially executed.
</turn_aborted>`;
/**
* Aborts that end a turn as an intentional handoff (e.g. yield-style tools)
* mark it with an abort reason carrying `turnHandoff: true`. Interruption
* guidance is skipped for them: the next turn would otherwise be told tools
* may have partially executed after a clean, deliberate stop.
*/
function isTurnHandoffAbort(signal) {
	if (!signal?.aborted) return false;
	const reason = signal.reason;
	return typeof reason === "object" && reason !== null && reason.turnHandoff === true;
}
function createInterruptedTurnMessage() {
	return {
		role: "custom",
		customType: "openclaw:turn-aborted",
		content: INTERRUPTED_TURN_GUIDANCE,
		display: false,
		timestamp: Date.now()
	};
}
async function appendInterruptedTurnMessage(messages, emit) {
	const interruption = createInterruptedTurnMessage();
	messages.push(interruption);
	await emit({
		type: "message_start",
		message: interruption
	});
	await emit({
		type: "message_end",
		message: interruption
	});
}
function normalizeCoreContextMessages(messages) {
	return messages.map((message) => {
		if (message.role !== "custom" || message.customType !== "openclaw:turn-aborted") return message;
		return {
			role: "user",
			content: typeof message.content === "string" ? [{
				type: "text",
				text: message.content
			}] : message.content,
			timestamp: message.timestamp
		};
	});
}
//#endregion
//#region packages/agent-core/src/agent-loop.ts
const TOOL_LOOP_RECOVERY_TERMINATED_MESSAGE = "OpenClaw stopped this run because tool-loop recovery encountered another critical loop. No blocked tool action was executed.";
const STEERING_TOOL_SKIP_MESSAGE = "Skipped due to queued user message.";
function getSteeringAtCheckpoint(config) {
	const callback = config.getSteeringMessages;
	if (!callback) return [];
	return getInternalSyncSteeringGetter(callback)?.() ?? callback.call(config);
}
function appendTextDeltaToAssistantMessage(message, contentIndex, delta) {
	const content = [...message.content];
	const currentContent = content[contentIndex];
	content[contentIndex] = currentContent?.type === "text" ? {
		...currentContent,
		text: currentContent.text + delta
	} : {
		type: "text",
		text: delta
	};
	return {
		...message,
		content
	};
}
function resolveAssistantMessageUpdate(event, currentMessage) {
	if ("partial" in event && event.partial) return event.partial;
	if (event.type === "text_delta") return appendTextDeltaToAssistantMessage(currentMessage, event.contentIndex, event.delta);
	return currentMessage;
}
function removeNonExecutableToolCalls(message) {
	if (message.stopReason === "toolUse") return message;
	const content = message.content.filter((item) => item.type !== "toolCall");
	return content.length === message.content.length ? message : replaceCompactionReplayOwnerContent(message, content);
}
function ensureToolTurnIdentity(message) {
	if (message.stopReason !== "toolUse" || message.responseId?.trim() || message.turnId?.trim()) return message;
	return {
		...message,
		turnId: uuidv7()
	};
}
/** Run a prompt-started loop and emit events through a caller-owned sink. */
async function runAgentLoop(prompts, context, config, emit, signal, streamFn, runtime) {
	const newMessages = [...prompts];
	const currentContext = {
		...context,
		messages: [...context.messages, ...prompts]
	};
	await emit({ type: "agent_start" });
	await emit({ type: "turn_start" });
	for (const prompt of prompts) {
		await emit({
			type: "message_start",
			message: prompt
		});
		await emit({
			type: "message_end",
			message: prompt
		});
	}
	await runLoop(currentContext, newMessages, config, signal, emit, streamFn, runtime);
	return newMessages;
}
/** Continue an existing loop context and emit only newly produced messages. */
async function runAgentLoopContinue(context, config, emit, signal, streamFn, runtime) {
	const lastMessage = context.messages.at(-1);
	if (!lastMessage) throw new Error("Cannot continue: no messages in context");
	if (lastMessage.role === "assistant") throw new TranscriptNotContinuableError(lastMessage.role);
	const newMessages = [];
	const currentContext = { ...context };
	await emit({ type: "agent_start" });
	await emit({ type: "turn_start" });
	await runLoop(currentContext, newMessages, config, signal, emit, streamFn, runtime);
	return newMessages;
}
/**
* Main loop logic shared by agentLoop and agentLoopContinue.
*/
async function runLoop(initialContext, newMessages, initialConfig, signal, emit, streamFn, runtime) {
	let currentContext = initialContext;
	let config = initialConfig;
	let firstTurn = true;
	let turnOpen = true;
	let turnTainted = isActiveTurnTainted(initialContext.messages);
	const toolLoopRecoveryState = initialConfig.toolLoopRecoveryState ?? { criticalToolLoopSeen: false };
	const initialSteering = getSteeringAtCheckpoint(config);
	let pendingMessages = Array.isArray(initialSteering) ? initialSteering : await initialSteering;
	const stopIfAborted = async () => {
		if (!signal?.aborted) return false;
		const abortedMessage = withAssistantTurnTaint(createFailureMessage(config.model, signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("Agent run aborted"), true), turnTainted);
		newMessages.push(abortedMessage);
		if (!turnOpen) {
			await emit({ type: "turn_start" });
			turnOpen = true;
		}
		await emit({
			type: "message_start",
			message: abortedMessage
		});
		await emit({
			type: "message_end",
			message: abortedMessage
		});
		await emit({
			type: "turn_end",
			message: abortedMessage,
			toolResults: []
		});
		turnOpen = false;
		if (!isTurnHandoffAbort(signal)) await appendInterruptedTurnMessage(newMessages, emit);
		await emit({
			type: "agent_end",
			messages: newMessages
		});
		return true;
	};
	while (true) {
		let hasMoreToolCalls = true;
		while (hasMoreToolCalls || pendingMessages.length > 0) {
			if (await stopIfAborted()) return;
			if (!firstTurn) {
				await emit({ type: "turn_start" });
				turnOpen = true;
			} else firstTurn = false;
			if (pendingMessages.length > 0) {
				const messagesToInject = pendingMessages;
				pendingMessages = [];
				for (const message of messagesToInject) {
					if (message.role === "user") turnTainted = false;
					await emit({
						type: "message_start",
						message
					});
					await emit({
						type: "message_end",
						message
					});
					currentContext.messages.push(message);
					newMessages.push(message);
				}
			}
			if (await stopIfAborted()) return;
			const message = await streamAssistantResponse(currentContext, config, signal, emit, streamFn, runtime, turnTainted);
			newMessages.push(message);
			if (message.stopReason === "error" || message.stopReason === "aborted") {
				await emit({
					type: "turn_end",
					message,
					toolResults: []
				});
				if (message.stopReason === "aborted" && signal?.aborted && !isTurnHandoffAbort(signal)) await appendInterruptedTurnMessage(newMessages, emit);
				await emit({
					type: "agent_end",
					messages: newMessages
				});
				return;
			}
			const toolCalls = message.content.filter((c) => c.type === "toolCall");
			const toolResults = [];
			hasMoreToolCalls = false;
			let terminateRun = false;
			if (message.stopReason === "toolUse" && toolCalls.length > 0) {
				const executedToolBatch = await executeToolCalls(currentContext, message, config, signal, emit, toolLoopRecoveryState.criticalToolLoopSeen);
				toolResults.push(...executedToolBatch.messages);
				turnTainted ||= toolResults.some(toolResultTaintsTurn);
				hasMoreToolCalls = !executedToolBatch.terminate;
				pendingMessages = executedToolBatch.steeringMessages;
				if (executedToolBatch.intervention) toolLoopRecoveryState.criticalToolLoopSeen = true;
				terminateRun = executedToolBatch.terminateRun;
				for (const result of toolResults) {
					currentContext.messages.push(result);
					newMessages.push(result);
				}
			}
			await emit({
				type: "turn_end",
				message,
				toolResults
			});
			turnOpen = false;
			if (await stopIfAborted()) return;
			if (terminateRun) {
				const terminalMessage = {
					...createFailureMessage(config.model, /* @__PURE__ */ new Error(TOOL_LOOP_RECOVERY_TERMINATED_MESSAGE), false),
					content: [{
						type: "text",
						text: TOOL_LOOP_RECOVERY_TERMINATED_MESSAGE
					}]
				};
				currentContext.messages.push(terminalMessage);
				newMessages.push(terminalMessage);
				await emit({ type: "turn_start" });
				turnOpen = true;
				await emit({
					type: "message_start",
					message: terminalMessage
				});
				await emit({
					type: "message_end",
					message: terminalMessage
				});
				await emit({
					type: "turn_end",
					message: terminalMessage,
					toolResults: []
				});
				turnOpen = false;
				await emit({
					type: "agent_end",
					messages: newMessages
				});
				return;
			}
			const nextTurnContext = {
				message,
				toolResults,
				context: currentContext,
				newMessages
			};
			const nextTurnSnapshot = await config.prepareNextTurn?.(nextTurnContext);
			if (nextTurnSnapshot) {
				currentContext = nextTurnSnapshot.context ?? currentContext;
				const nextModel = nextTurnSnapshot.model ?? config.model;
				const nextThinkingLevel = nextTurnSnapshot.thinkingLevel ?? config.thinkingLevel;
				const nextReasoning = (nextTurnSnapshot.thinkingLevel !== void 0 || nextTurnSnapshot.model !== void 0 && nextThinkingLevel !== void 0) && nextThinkingLevel !== void 0 ? resolveAgentReasoningOption(nextModel, nextThinkingLevel) : config.reasoning;
				config = Object.assign({}, config, {
					model: nextModel,
					thinkingLevel: nextThinkingLevel,
					reasoning: nextReasoning
				});
			}
			if (await stopIfAborted()) return;
			if (pendingMessages.length === 0) {
				if (await config.shouldStopAfterTurn?.({
					message,
					toolResults,
					context: currentContext,
					newMessages
				})) {
					await emit({
						type: "agent_end",
						messages: newMessages
					});
					return;
				}
				const steering = getSteeringAtCheckpoint(config);
				pendingMessages = Array.isArray(steering) ? steering : await steering;
			}
			if (await stopIfAborted()) return;
		}
		const followUpMessages = await config.getFollowUpMessages?.() || [];
		if (followUpMessages.length > 0) {
			pendingMessages = followUpMessages;
			continue;
		}
		break;
	}
	await emit({
		type: "agent_end",
		messages: newMessages
	});
}
/**
* Stream an assistant response from the LLM.
* This is where AgentMessage[] gets transformed to Message[] for the LLM.
*/
async function streamAssistantResponse(context, config, signal, emit, streamFn, runtime, turnTainted = false) {
	let messages = context.messages;
	if (config.transformContext) messages = await config.transformContext(messages, signal);
	messages = normalizeCoreContextMessages(messages);
	const llmMessages = await config.convertToLlm(messages);
	const llmContext = {
		systemPrompt: context.systemPrompt,
		messages: llmMessages,
		tools: context.tools
	};
	const streamFunction = resolveAgentCoreStreamFn(runtime, streamFn);
	const resolvedApiKey = (config.getApiKey ? await config.getApiKey(config.model.provider) : void 0) || config.apiKey;
	const response = await streamFunction(config.model, llmContext, {
		...config,
		apiKey: resolvedApiKey,
		signal
	});
	let partialMessage = null;
	let addedPartial = false;
	for await (const event of response) switch (event.type) {
		case "start": {
			const message = event.partial;
			partialMessage = message;
			context.messages.push(message);
			addedPartial = true;
			await emit({
				type: "message_start",
				message: { ...message }
			});
			break;
		}
		case "text_start":
		case "text_delta":
		case "text_end":
		case "thinking_start":
		case "thinking_delta":
		case "thinking_end":
		case "toolcall_start":
		case "toolcall_delta":
		case "toolcall_end":
			if (partialMessage) {
				const message = resolveAssistantMessageUpdate(event, partialMessage);
				partialMessage = message;
				context.messages[context.messages.length - 1] = message;
				await emit({
					type: "message_update",
					assistantMessageEvent: event,
					message: { ...message }
				});
			}
			break;
		case "done":
		case "error": return await finalizeAssistantMessage();
	}
	return await finalizeAssistantMessage();
	async function finalizeAssistantMessage() {
		const finalMessage = withAssistantTurnTaint(ensureToolTurnIdentity(removeNonExecutableToolCalls(await response.result())), turnTainted);
		if (addedPartial) context.messages[context.messages.length - 1] = finalMessage;
		else {
			context.messages.push(finalMessage);
			await emit({
				type: "message_start",
				message: { ...finalMessage }
			});
		}
		await emit({
			type: "message_end",
			message: finalMessage
		});
		return finalMessage;
	}
}
/**
* Execute tool calls from an assistant message.
*/
async function executeToolCalls(currentContext, assistantMessage, config, signal, emit, criticalToolLoopSeen) {
	const toolCalls = assistantMessage.content.filter((c) => c.type === "toolCall");
	const resolvedToolCalls = /* @__PURE__ */ new Map();
	const validatedToolCalls = /* @__PURE__ */ new Map();
	let batchLifecycle;
	if (config.beforeToolBatch) {
		for (const toolCall of toolCalls) {
			if (signal?.aborted) break;
			validatedToolCalls.set(toolCall, await validateToolCallForBatchAdmission(currentContext, assistantMessage, toolCall, config, signal, resolvedToolCalls));
		}
		const calls = toolCalls.flatMap((toolCall) => {
			const validation = validatedToolCalls.get(toolCall);
			return validation?.kind === "validated" ? [{
				toolCall,
				args: validation.prepared.args,
				tool: validation.prepared.tool
			}] : [];
		});
		if (calls.length > 0 && !signal?.aborted) {
			const admission = await config.beforeToolBatch({
				assistantMessage,
				calls,
				context: currentContext
			}, signal);
			if (admission?.intervention) return await completeToolLoopInterventionBatch({
				currentContext,
				assistantMessage,
				toolCalls,
				resolvedToolCalls,
				validatedToolCalls,
				config,
				signal,
				emit,
				intervention: admission.intervention,
				terminal: criticalToolLoopSeen
			});
			batchLifecycle = admission ? takeInternalToolBatchLifecycle(admission) : void 0;
		}
	}
	let hasSequentialToolCall = false;
	if (config.toolExecution !== "sequential") for (const toolCall of toolCalls) {
		if (signal?.aborted) break;
		const resolution = await resolveToolCallTool(currentContext, assistantMessage, toolCall, config, signal, resolvedToolCalls);
		if (resolution.kind === "resolved" && resolution.tool?.executionMode === "sequential") {
			hasSequentialToolCall = true;
			break;
		}
	}
	if (config.toolExecution === "sequential" || hasSequentialToolCall) return executeToolCallsSequential(currentContext, assistantMessage, toolCalls, resolvedToolCalls, validatedToolCalls, batchLifecycle, config, signal, emit);
	return executeToolCallsParallel(currentContext, assistantMessage, toolCalls, resolvedToolCalls, validatedToolCalls, batchLifecycle, config, signal, emit);
}
function hidesToolCallFromChannelProgress(context, toolCall, resolvedToolCalls) {
	const resolution = resolvedToolCalls.get(toolCall);
	return (resolution?.kind === "resolved" ? resolution.tool : context.tools?.find((candidate) => candidate.name === toolCall.name))?.hideFromChannelProgress === true;
}
async function executeToolCallsSequential(currentContext, assistantMessage, toolCalls, resolvedToolCalls, validatedToolCalls, batchLifecycle, config, signal, emit) {
	const finalizedCalls = [];
	const messages = [];
	let steeringMessages = [];
	let skippedReady;
	let skippedStartIndex = toolCalls.length;
	for (let callIndex = 0; callIndex < toolCalls.length; callIndex++) {
		const toolCall = toolCalls[callIndex];
		if (!toolCall) continue;
		if (!signal?.aborted) {
			const steering = getSteeringAtCheckpoint(config);
			steeringMessages = Array.isArray(steering) ? steering : await steering;
		}
		if (steeringMessages.length > 0) {
			skippedStartIndex = callIndex;
			break;
		}
		const hideFromChannelProgress = hidesToolCallFromChannelProgress(currentContext, toolCall, resolvedToolCalls);
		await emit({
			type: "tool_execution_start",
			toolCallId: toolCall.id,
			toolName: toolCall.name,
			args: toolCall.arguments,
			...hideFromChannelProgress ? { hideFromChannelProgress: true } : {}
		});
		const preparation = await prepareToolCall(currentContext, assistantMessage, toolCall, config, signal, resolvedToolCalls, validatedToolCalls);
		let finalized;
		if (preparation.kind === "immediate") finalized = await finalizeToolCallOutcome(currentContext, assistantMessage, {
			toolCall,
			result: preparation.result,
			isError: preparation.isError,
			executionStarted: false,
			...preparation.errorKind ? { errorKind: preparation.errorKind } : {},
			...hideFromChannelProgress ? { hideFromChannelProgress: true } : {}
		}, toolCall.arguments, config, signal);
		else {
			const execution = await prepareToolCallExecution(preparation, {
				assistantMessage,
				toolCall: preparation.toolCall
			}, signal, emit);
			if (execution.kind === "immediate") finalized = await finalizeExecutedToolCall(currentContext, assistantMessage, preparation, execution.outcome, preparation.args, config, signal);
			else try {
				if (!signal?.aborted) {
					const steering = getSteeringAtCheckpoint(config);
					steeringMessages = Array.isArray(steering) ? steering : await steering;
				}
				if (steeringMessages.length > 0) {
					skippedReady = {
						args: execution.args,
						startEmitted: true
					};
					skippedStartIndex = callIndex;
					break;
				}
				finalized = await finalizeExecutedToolCall(currentContext, assistantMessage, preparation, await execution.execute(() => batchLifecycle?.commitReadyCalls([{
					toolCallId: toolCall.id,
					args: execution.args
				}])), execution.args, config, signal);
			} finally {
				execution.dispose();
			}
		}
		await emitToolExecutionEnd(finalized, emit);
		const toolResultMessage = createToolResultMessage(finalized);
		await emitToolResultMessage(toolResultMessage, emit);
		finalizedCalls.push(finalized);
		messages.push(toolResultMessage);
		if (signal?.aborted) {
			skippedStartIndex = callIndex + 1;
			break;
		}
	}
	if (!signal?.aborted && steeringMessages.length === 0 && skippedStartIndex === toolCalls.length) {
		const steering = getSteeringAtCheckpoint(config);
		steeringMessages = Array.isArray(steering) ? steering : await steering;
	}
	if (steeringMessages.length > 0) batchLifecycle?.releaseSkippedCalls(toolCalls.slice(skippedStartIndex).filter((toolCall) => validatedToolCalls.get(toolCall)?.kind === "validated").map((toolCall) => toolCall.id));
	for (let i = skippedStartIndex; i < toolCalls.length; i++) {
		const skippedToolCall = toolCalls[i];
		if (!skippedToolCall) continue;
		const isSteeringSkip = steeringMessages.length > 0;
		const completed = await completeUnstartedToolCall(currentContext, assistantMessage, skippedToolCall, resolvedToolCalls, config, signal, emit, {
			...i === skippedStartIndex && skippedReady ? skippedReady : {},
			...isSteeringSkip ? {
				details: {
					status: "skipped",
					deniedReason: "steering"
				},
				message: STEERING_TOOL_SKIP_MESSAGE
			} : {}
		});
		await emitToolResultMessage(completed.message, emit);
		finalizedCalls.push(completed.finalized);
		messages.push(completed.message);
	}
	return {
		messages,
		steeringMessages,
		terminate: shouldTerminateToolBatch(finalizedCalls),
		terminateRun: false
	};
}
async function executeToolCallsParallel(currentContext, assistantMessage, toolCalls, resolvedToolCalls, validatedToolCalls, batchLifecycle, config, signal, emit) {
	const finalizedCalls = [];
	const pendingExecutions = /* @__PURE__ */ new Set();
	try {
		for (const toolCall of toolCalls) {
			const hideFromChannelProgress = hidesToolCallFromChannelProgress(currentContext, toolCall, resolvedToolCalls);
			await emit({
				type: "tool_execution_start",
				toolCallId: toolCall.id,
				toolName: toolCall.name,
				args: toolCall.arguments,
				...hideFromChannelProgress ? { hideFromChannelProgress: true } : {}
			});
			const preparation = await prepareToolCall(currentContext, assistantMessage, toolCall, config, signal, resolvedToolCalls, validatedToolCalls);
			if (preparation.kind === "immediate") {
				const finalized = await finalizeToolCallOutcome(currentContext, assistantMessage, {
					toolCall,
					result: preparation.result,
					isError: preparation.isError,
					executionStarted: false,
					...preparation.errorKind ? { errorKind: preparation.errorKind } : {},
					...hideFromChannelProgress ? { hideFromChannelProgress: true } : {}
				}, toolCall.arguments, config, signal);
				await emitToolExecutionEnd(finalized, emit);
				finalizedCalls.push(finalized);
				if (signal?.aborted) break;
				continue;
			}
			const execution = await prepareToolCallExecution(preparation, {
				assistantMessage,
				toolCall: preparation.toolCall
			}, signal, emit);
			if (execution.kind === "immediate") {
				const finalized = await finalizeExecutedToolCall(currentContext, assistantMessage, preparation, execution.outcome, preparation.args, config, signal);
				await emitToolExecutionEnd(finalized, emit);
				finalizedCalls.push(finalized);
				if (signal?.aborted) break;
				continue;
			}
			pendingExecutions.add(execution);
			finalizedCalls.push({
				...preparation,
				execution
			});
			if (signal?.aborted) break;
		}
		const steering = signal?.aborted ? [] : getSteeringAtCheckpoint(config);
		const steeringMessages = Array.isArray(steering) ? steering : await steering;
		const skippedToolCallIds = [...steeringMessages.length > 0 ? finalizedCalls.flatMap((entry) => "kind" in entry ? [entry.toolCall.id] : []) : [], ...steeringMessages.length > 0 ? toolCalls.slice(finalizedCalls.length).map((toolCall) => toolCall.id) : []];
		if (skippedToolCallIds.length > 0) batchLifecycle?.releaseSkippedCalls(skippedToolCallIds);
		const orderedFinalizedCalls = [];
		if (steeringMessages.length > 0) for (const entry of finalizedCalls) {
			if (!("kind" in entry)) {
				orderedFinalizedCalls.push(entry);
				continue;
			}
			entry.execution.dispose();
			pendingExecutions.delete(entry.execution);
			const completed = await completeUnstartedToolCall(currentContext, assistantMessage, entry.toolCall, resolvedToolCalls, config, signal, emit, {
				args: entry.execution.args,
				details: {
					status: "skipped",
					deniedReason: "steering"
				},
				message: STEERING_TOOL_SKIP_MESSAGE,
				startEmitted: true
			});
			orderedFinalizedCalls.push(completed.finalized);
		}
		else orderedFinalizedCalls.push(...await Promise.all(finalizedCalls.map(async (entry) => {
			if (!("kind" in entry)) return entry;
			try {
				const finalized = await finalizeExecutedToolCall(currentContext, assistantMessage, entry, await entry.execution.execute(() => batchLifecycle?.commitReadyCalls([{
					toolCallId: entry.toolCall.id,
					args: entry.execution.args
				}])), entry.execution.args, config, signal);
				await emitToolExecutionEnd(finalized, emit);
				return finalized;
			} finally {
				entry.execution.dispose();
				pendingExecutions.delete(entry.execution);
			}
		})));
		const messages = [];
		for (const finalized of orderedFinalizedCalls) {
			const toolResultMessage = createToolResultMessage(finalized);
			await emitToolResultMessage(toolResultMessage, emit);
			messages.push(toolResultMessage);
		}
		if (signal?.aborted && orderedFinalizedCalls.length < toolCalls.length) for (let i = orderedFinalizedCalls.length; i < toolCalls.length; i++) {
			const skippedToolCall = toolCalls[i];
			if (!skippedToolCall) continue;
			const completed = await completeUnstartedToolCall(currentContext, assistantMessage, skippedToolCall, resolvedToolCalls, config, signal, emit);
			await emitToolResultMessage(completed.message, emit);
			orderedFinalizedCalls.push(completed.finalized);
			messages.push(completed.message);
		}
		return {
			messages,
			steeringMessages,
			terminate: shouldTerminateToolBatch(orderedFinalizedCalls),
			terminateRun: false
		};
	} finally {
		for (const execution of pendingExecutions) execution.dispose();
	}
}
function shouldTerminateToolBatch(finalizedCalls) {
	return finalizedCalls.length > 0 && finalizedCalls.every((finalized) => finalized.result.terminate === true);
}
function prepareToolCallArguments(tool, toolCall) {
	if (!tool.prepareArguments) return toolCall;
	const preparedArguments = tool.prepareArguments(toolCall.arguments);
	if (preparedArguments === toolCall.arguments) return toolCall;
	return {
		...toolCall,
		arguments: preparedArguments
	};
}
async function resolveToolCallTool(currentContext, assistantMessage, toolCall, config, signal, resolvedToolCalls) {
	const cached = resolvedToolCalls?.get(toolCall);
	if (cached) return cached;
	let resolution;
	try {
		let tool = currentContext.tools?.find((t) => t.name === toolCall.name);
		if (!tool) {
			const resolvedTool = await config.resolveDeferredTool?.({
				assistantMessage,
				toolCall,
				context: currentContext
			}, signal);
			if (resolvedTool && resolvedTool.name !== toolCall.name) throw new Error(`Deferred tool resolver returned "${resolvedTool.name}" for requested "${toolCall.name}"`);
			tool = resolvedTool;
			if (tool) currentContext.tools = [...currentContext.tools ?? [], tool];
		}
		resolution = {
			kind: "resolved",
			...tool ? { tool } : {}
		};
	} catch (error) {
		resolution = {
			kind: "error",
			error
		};
	}
	resolvedToolCalls?.set(toolCall, resolution);
	return resolution;
}
async function prepareToolCall(currentContext, assistantMessage, toolCall, config, signal, resolvedToolCalls, validatedToolCalls) {
	const cachedValidation = validatedToolCalls.get(toolCall);
	if (signal?.aborted && !cachedValidation) return {
		kind: "immediate",
		result: createErrorToolResult("Operation aborted"),
		isError: true
	};
	const validation = cachedValidation ?? await validateToolCallForBatchAdmission(currentContext, assistantMessage, toolCall, config, signal, resolvedToolCalls);
	if (validation.kind === "immediate") return validation.outcome;
	const { args: validatedArgs } = validation.prepared;
	try {
		if (config.beforeToolCall) {
			const beforeResult = await config.beforeToolCall({
				assistantMessage,
				toolCall,
				args: validatedArgs,
				context: currentContext
			}, signal);
			if (signal?.aborted) return {
				kind: "immediate",
				result: createErrorToolResult("Operation aborted"),
				isError: true
			};
			if (beforeResult?.block) return {
				kind: "immediate",
				result: createErrorToolResult(beforeResult.reason || "Tool execution was blocked"),
				isError: true
			};
		}
		if (signal?.aborted) return {
			kind: "immediate",
			result: createErrorToolResult("Operation aborted"),
			isError: true
		};
		return validation.prepared;
	} catch (error) {
		return {
			kind: "immediate",
			result: createErrorToolResult(coerceErrorMessage(error)),
			isError: true
		};
	}
}
async function validateToolCallForBatchAdmission(currentContext, assistantMessage, toolCall, config, signal, resolvedToolCalls) {
	const resolution = await resolveToolCallTool(currentContext, assistantMessage, toolCall, config, signal, resolvedToolCalls);
	if (resolution.kind === "error") return {
		kind: "immediate",
		outcome: {
			kind: "immediate",
			result: createErrorToolResult(signal?.aborted ? "Operation aborted" : coerceErrorMessage(resolution.error)),
			isError: true
		}
	};
	const tool = resolution.tool;
	if (!tool) return {
		kind: "immediate",
		outcome: {
			kind: "immediate",
			result: createErrorToolResult(`Tool ${toolCall.name} not found`),
			isError: true
		}
	};
	let preparedToolCall;
	try {
		preparedToolCall = prepareToolCallArguments(tool, toolCall);
	} catch (error) {
		return {
			kind: "immediate",
			outcome: {
				kind: "immediate",
				result: createErrorToolResult(coerceErrorMessage(error)),
				isError: true
			}
		};
	}
	let validatedArgs;
	try {
		validatedArgs = validateToolArguments(tool, preparedToolCall);
	} catch (error) {
		return {
			kind: "immediate",
			outcome: {
				kind: "immediate",
				result: createErrorToolResult(coerceErrorMessage(error)),
				isError: true,
				errorKind: "argument-validation"
			}
		};
	}
	return {
		kind: "validated",
		prepared: {
			kind: "prepared",
			toolCall,
			tool,
			args: validatedArgs
		}
	};
}
async function prepareToolCallExecution(prepared, executionContext, signal, emit) {
	const updateEvents = [];
	let acceptingUpdates = true;
	const onUpdate = (partialResult) => {
		if (!acceptingUpdates) return;
		updateEvents.push(Promise.resolve(emit({
			type: "tool_execution_update",
			toolCallId: prepared.toolCall.id,
			toolName: prepared.toolCall.name,
			args: prepared.toolCall.arguments,
			partialResult,
			...prepared.tool.hideFromChannelProgress === true ? { hideFromChannelProgress: true } : {}
		})));
	};
	const finishUpdates = async () => {
		acceptingUpdates = false;
		await Promise.all(updateEvents);
	};
	const immediateError = async (error) => {
		await finishUpdates();
		return {
			kind: "immediate",
			outcome: {
				result: createErrorToolResult(coerceErrorMessage(error)),
				isError: true,
				executionStarted: false
			}
		};
	};
	const readyExecution = (args, run, disposeSource = () => {}) => {
		let disposed = false;
		const dispose = () => {
			if (!disposed) {
				disposed = true;
				acceptingUpdates = false;
				disposeSource();
			}
		};
		return {
			kind: "ready",
			args,
			dispose,
			async execute(onImplementationStart) {
				if (signal?.aborted) {
					dispose();
					await finishUpdates();
					return {
						result: createErrorToolResult("Operation aborted"),
						isError: true,
						executionStarted: false
					};
				}
				let executionStarted = false;
				let implementationStartError;
				try {
					const result = await run(() => {
						try {
							onImplementationStart?.();
						} catch (error) {
							implementationStartError = { error };
							throw error;
						}
						executionStarted = true;
					});
					if (implementationStartError) throw implementationStartError.error;
					await finishUpdates();
					return {
						result,
						isError: false,
						executionStarted
					};
				} catch (error) {
					await finishUpdates();
					if (implementationStartError) throw implementationStartError.error;
					return {
						result: createErrorToolResult(coerceErrorMessage(error)),
						isError: true,
						executionStarted,
						...executionStarted && signal?.aborted && error === signal.reason ? { callerCancelled: true } : {}
					};
				} finally {
					dispose();
				}
			}
		};
	};
	const preparer = getInternalToolExecutionPreparer(prepared.tool);
	if (!preparer) return readyExecution(prepared.args, async (onImplementationStart) => {
		if (signal?.aborted) throw signal.reason ?? /* @__PURE__ */ new Error("Operation aborted");
		return await runWithAgentToolExecutionContext(executionContext, () => {
			onImplementationStart();
			return prepared.tool.execute(prepared.toolCall.id, prepared.args, signal, onUpdate);
		});
	});
	let internalPreparation;
	try {
		internalPreparation = await runWithAgentToolExecutionContext(executionContext, () => preparer({
			toolCallId: prepared.toolCall.id,
			args: prepared.args,
			...signal ? { signal } : {},
			onUpdate
		}));
	} catch (error) {
		return await immediateError(error);
	}
	if (internalPreparation.kind === "immediate") {
		internalPreparation.dispose();
		await finishUpdates();
		if (internalPreparation.outcome.kind === "result") return {
			kind: "immediate",
			outcome: {
				result: internalPreparation.outcome.result,
				isError: internalPreparation.outcome.isError,
				executionStarted: false
			}
		};
		return {
			kind: "immediate",
			outcome: {
				result: createErrorToolResult(coerceErrorMessage(internalPreparation.outcome.error)),
				isError: true,
				executionStarted: false
			}
		};
	}
	const readyPreparation = internalPreparation;
	return readyExecution(readyPreparation.args, (onImplementationStart) => runWithAgentToolExecutionContext(executionContext, () => readyPreparation.execute(onImplementationStart)), readyPreparation.dispose);
}
async function finalizeExecutedToolCall(currentContext, assistantMessage, prepared, executed, finalArgs, config, signal) {
	let result = executed.result;
	let isError = executed.isError;
	if (executed.executionStarted && config.afterToolCall) try {
		const afterResult = await config.afterToolCall({
			assistantMessage,
			toolCall: prepared.toolCall,
			args: finalArgs,
			result,
			isError,
			context: currentContext
		}, signal);
		if (afterResult) {
			result = {
				...result,
				content: afterResult.content ?? result.content,
				details: afterResult.details ?? result.details,
				terminate: afterResult.terminate ?? result.terminate
			};
			isError = afterResult.isError ?? isError;
		}
	} catch (error) {
		result = createErrorToolResult(coerceErrorMessage(error));
		isError = true;
	}
	return await finalizeToolCallOutcome(currentContext, assistantMessage, {
		toolCall: prepared.toolCall,
		result,
		isError,
		executionStarted: executed.executionStarted,
		...prepared.tool.hideFromChannelProgress === true ? { hideFromChannelProgress: true } : {},
		...executed.executionStarted && !executed.callerCancelled && prepared.tool.resultContentSource ? { resultContentSource: prepared.tool.resultContentSource } : {}
	}, finalArgs, config, signal);
}
async function finalizeToolCallOutcome(currentContext, assistantMessage, finalized, args, config, signal) {
	if (!config.afterToolOutcome) return finalized;
	try {
		const afterResult = await config.afterToolOutcome({
			assistantMessage,
			toolCall: finalized.toolCall,
			args,
			result: finalized.result,
			isError: finalized.isError,
			executionStarted: finalized.executionStarted,
			...finalized.errorKind ? { errorKind: finalized.errorKind } : {},
			context: currentContext
		}, signal);
		if (!afterResult) return finalized;
		return {
			...finalized,
			result: {
				...finalized.result,
				content: afterResult.content ?? finalized.result.content,
				details: afterResult.details ?? finalized.result.details,
				terminate: afterResult.terminate ?? finalized.result.terminate
			},
			isError: afterResult.isError ?? finalized.isError
		};
	} catch (error) {
		const errorResult = createErrorToolResult(coerceErrorMessage(error));
		return {
			...finalized,
			result: {
				...errorResult,
				...finalized.result.terminate === void 0 ? {} : { terminate: finalized.result.terminate }
			},
			isError: true
		};
	}
}
async function completeToolLoopInterventionBatch(params) {
	const messages = [];
	const finalizedCalls = [];
	for (const toolCall of params.toolCalls) {
		const hideFromChannelProgress = hidesToolCallFromChannelProgress(params.currentContext, toolCall, params.resolvedToolCalls);
		await params.emit({
			type: "tool_execution_start",
			toolCallId: toolCall.id,
			toolName: toolCall.name,
			args: toolCall.arguments,
			...hideFromChannelProgress ? { hideFromChannelProgress: true } : {}
		});
		const isTrigger = toolCall.id === params.intervention.toolCallId;
		const text = params.terminal ? isTrigger ? `${params.intervention.reason}\n\nCritical tool-loop recovery failed because another critical loop was detected. This run is stopping now.` : "This tool was not executed because another call in the batch repeated a critical tool loop. This run is stopping now." : isTrigger ? `${params.intervention.reason}\n\nDo not repeat this exact tool action. Reassess the task. You may answer the user, ask for clarification, or continue with a different tool or different arguments.` : "This tool was not executed because another call in the batch triggered critical tool-loop recovery. Reassess the task before choosing the next action.";
		const validation = params.validatedToolCalls.get(toolCall);
		const finalized = await finalizeToolCallOutcome(params.currentContext, params.assistantMessage, {
			toolCall,
			result: {
				content: [{
					type: "text",
					text
				}],
				details: {
					status: "blocked",
					deniedReason: "tool-loop",
					intervention: params.intervention
				},
				...params.terminal ? { terminate: true } : {}
			},
			isError: true,
			executionStarted: false,
			...hideFromChannelProgress ? { hideFromChannelProgress: true } : {}
		}, validation?.kind === "validated" ? validation.prepared.args : toolCall.arguments, params.config, params.signal);
		await emitToolExecutionEnd(finalized, params.emit);
		const message = createToolResultMessage(finalized);
		await emitToolResultMessage(message, params.emit);
		messages.push(message);
		finalizedCalls.push(finalized);
	}
	return {
		messages,
		steeringMessages: [],
		terminate: params.terminal || shouldTerminateToolBatch(finalizedCalls),
		terminateRun: params.terminal,
		intervention: params.intervention
	};
}
async function completeUnstartedToolCall(currentContext, assistantMessage, toolCall, resolvedToolCalls, config, signal, emit, options = {}) {
	const hideFromChannelProgress = hidesToolCallFromChannelProgress(currentContext, toolCall, resolvedToolCalls);
	if (!options.startEmitted) await emit({
		type: "tool_execution_start",
		toolCallId: toolCall.id,
		toolName: toolCall.name,
		args: toolCall.arguments,
		...hideFromChannelProgress ? { hideFromChannelProgress: true } : {}
	});
	const finalized = await finalizeToolCallOutcome(currentContext, assistantMessage, {
		toolCall,
		result: createErrorToolResult(options.message ?? "Operation aborted", options.details),
		isError: true,
		executionStarted: false,
		...hideFromChannelProgress ? { hideFromChannelProgress: true } : {}
	}, "args" in options ? options.args : toolCall.arguments, config, signal);
	await emitToolExecutionEnd(finalized, emit);
	return {
		finalized,
		message: createToolResultMessage(finalized)
	};
}
function createErrorToolResult(message, details = {}) {
	return {
		content: [{
			type: "text",
			text: message
		}],
		details
	};
}
async function emitToolExecutionEnd(finalized, emit) {
	await emit({
		type: "tool_execution_end",
		toolCallId: finalized.toolCall.id,
		toolName: finalized.toolCall.name,
		result: finalized.result,
		isError: finalized.isError,
		executionStarted: finalized.executionStarted,
		...finalized.errorKind ? { errorKind: finalized.errorKind } : {},
		...finalized.hideFromChannelProgress === true ? { hideFromChannelProgress: true } : {}
	});
}
function createToolResultMessage(finalized) {
	return withToolResultContentSource({
		role: "toolResult",
		toolCallId: finalized.toolCall.id,
		toolName: finalized.toolCall.name,
		content: finalized.result.content ?? [],
		details: finalized.result.details,
		isError: finalized.isError,
		timestamp: Date.now()
	}, finalized.resultContentSource);
}
function readTurnTaintMetadata(message) {
	const metadata = message["__openclaw"];
	return asOptionalRecord(metadata);
}
function toolResultTaintsTurn(message) {
	return readTurnTaintMetadata(message)?.resultContentSource === "network";
}
function isActiveTurnTainted(messages) {
	for (const message of messages.toReversed()) {
		if (message.role === "user") return false;
		const metadata = readTurnTaintMetadata(message);
		if (metadata?.turnTainted === true || metadata?.resultContentSource === "network") return true;
	}
	return false;
}
function withAssistantTurnTaint(message, tainted) {
	if (!tainted) return message;
	return {
		...message,
		__openclaw: {
			...readTurnTaintMetadata(message),
			turnTainted: true
		}
	};
}
function withToolResultContentSource(message, source) {
	if (!source) return message;
	return {
		...message,
		__openclaw: {
			...readTurnTaintMetadata(message),
			resultContentSource: source
		}
	};
}
async function emitToolResultMessage(toolResultMessage, emit) {
	await emit({
		type: "message_start",
		message: toolResultMessage
	});
	await emit({
		type: "message_end",
		message: toolResultMessage
	});
}
//#endregion
//#region packages/agent-core/src/agent.ts
function defaultConvertToLlm(messages) {
	return messages.filter((message) => message.role === "user" || message.role === "assistant" || message.role === "toolResult");
}
const DEFAULT_MODEL = {
	id: "unknown",
	name: "unknown",
	api: "unknown",
	provider: "unknown",
	baseUrl: "",
	reasoning: false,
	input: [],
	cost: {
		input: 0,
		output: 0,
		cacheRead: 0,
		cacheWrite: 0
	},
	contextWindow: 0,
	maxTokens: 0
};
function createMutableAgentState(initialState) {
	let tools = initialState?.tools?.slice() ?? [];
	let messages = initialState?.messages?.slice() ?? [];
	return {
		systemPrompt: initialState?.systemPrompt ?? "",
		model: initialState?.model ?? DEFAULT_MODEL,
		thinkingLevel: initialState?.thinkingLevel ?? "off",
		get tools() {
			return tools;
		},
		set tools(nextTools) {
			tools = nextTools.slice();
		},
		get messages() {
			return messages;
		},
		set messages(nextMessages) {
			messages = nextMessages.slice();
		},
		isStreaming: false,
		streamingMessage: void 0,
		pendingToolCalls: /* @__PURE__ */ new Set(),
		errorMessage: void 0
	};
}
var PendingMessageQueue = class {
	constructor(mode) {
		this.messages = [];
		this.mode = mode;
	}
	enqueue(message) {
		this.messages.push(message);
	}
	hasItems() {
		return this.messages.length > 0;
	}
	drain() {
		if (this.mode === "all") {
			const drained = this.messages.slice();
			this.messages = [];
			return drained;
		}
		const first = this.messages[0];
		if (!first) return [];
		this.messages = this.messages.slice(1);
		return [first];
	}
	clear() {
		this.messages = [];
	}
};
/**
* Stateful wrapper around the low-level agent loop.
*
* `Agent` owns the current transcript, emits lifecycle events, executes tools,
* and exposes queueing APIs for steering and follow-up messages.
*/
var Agent$1 = class {
	constructor(options = {}) {
		this.listeners = /* @__PURE__ */ new Set();
		this.toolLoopRecoveryState = { criticalToolLoopSeen: false };
		this.mutableState = createMutableAgentState(options.initialState);
		this.convertToLlm = options.convertToLlm ?? defaultConvertToLlm;
		this.transformContext = options.transformContext;
		this.runtime = options.runtime;
		this.streamFn = resolveAgentCoreStreamFn(options.runtime, options.streamFn);
		this.getApiKey = options.getApiKey;
		this.onPayload = options.onPayload;
		this.onResponse = options.onResponse;
		this.beforeToolCall = options.beforeToolCall;
		this.resolveDeferredTool = options.resolveDeferredTool;
		this.afterToolCall = options.afterToolCall;
		this.afterToolOutcome = options.afterToolOutcome;
		this.prepareNextTurn = options.prepareNextTurn;
		this.prepareNextTurnWithContext = options.prepareNextTurnWithContext;
		this.steeringQueue = new PendingMessageQueue(options.steeringMode ?? "one-at-a-time");
		this.followUpQueue = new PendingMessageQueue(options.followUpMode ?? "one-at-a-time");
		this.sessionId = options.sessionId;
		this.thinkingBudgets = options.thinkingBudgets;
		this.transport = options.transport ?? "auto";
		this.maxRetryDelayMs = options.maxRetryDelayMs;
		this.toolExecution = options.toolExecution ?? "parallel";
	}
	/**
	* Subscribe to agent lifecycle events.
	*
	* Listener promises are awaited in subscription order and are included in
	* the current run's settlement. Listeners also receive the active abort
	* signal for the current run.
	*
	* `agent_end` is the final emitted event for a run, but the agent does not
	* become idle until all awaited listeners for that event have settled.
	*/
	subscribe(listener) {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}
	/**
	* Current agent state.
	*
	* Assigning `state.tools` or `state.messages` copies the provided top-level array.
	*/
	get state() {
		return this.mutableState;
	}
	/** Controls how queued steering messages are drained. */
	set steeringMode(mode) {
		this.steeringQueue.mode = mode;
	}
	get steeringMode() {
		return this.steeringQueue.mode;
	}
	/** Controls how queued follow-up messages are drained. */
	set followUpMode(mode) {
		this.followUpQueue.mode = mode;
	}
	get followUpMode() {
		return this.followUpQueue.mode;
	}
	/**
	* Queue a message for the active run. Running tools finish, while sequential
	* tail calls or a parallel batch that has not launched yet are skipped.
	*/
	steer(message) {
		this.steeringQueue.enqueue(message);
	}
	/** Queue a message to run only after the agent would otherwise stop. */
	followUp(message) {
		this.followUpQueue.enqueue(message);
	}
	/** Remove all queued steering messages. */
	clearSteeringQueue() {
		this.steeringQueue.clear();
	}
	/** Remove all queued follow-up messages. */
	clearFollowUpQueue() {
		this.followUpQueue.clear();
	}
	/** Remove all queued steering and follow-up messages. */
	clearAllQueues() {
		this.clearSteeringQueue();
		this.clearFollowUpQueue();
	}
	/** Returns true when either queue still contains pending messages. */
	hasQueuedMessages() {
		return this.steeringQueue.hasItems() || this.followUpQueue.hasItems();
	}
	/** Active abort signal for the current run, if any. */
	get signal() {
		return this.activeRun?.abortController.signal;
	}
	/** Abort the current run, if one is active. */
	abort(reason) {
		this.activeRun?.abortController.abort(reason);
	}
	/**
	* Resolve when the current run and all awaited event listeners have finished.
	*
	* This resolves after `agent_end` listeners settle.
	*/
	waitForIdle() {
		return this.activeRun?.promise ?? Promise.resolve();
	}
	/** Clear transcript state, runtime state, and queued messages. */
	reset() {
		this.mutableState.messages = [];
		this.mutableState.isStreaming = false;
		this.mutableState.streamingMessage = void 0;
		this.mutableState.pendingToolCalls = /* @__PURE__ */ new Set();
		this.mutableState.errorMessage = void 0;
		this.toolLoopRecoveryState.criticalToolLoopSeen = false;
		this.clearFollowUpQueue();
		this.clearSteeringQueue();
	}
	async prompt(input, images) {
		if (this.activeRun) throw new Error("Agent is already processing a prompt. Use steer() or followUp() to queue messages, or wait for completion.");
		this.toolLoopRecoveryState.criticalToolLoopSeen = false;
		const messages = this.normalizePromptInput(input, images);
		await this.runPromptMessages(messages);
	}
	/** Continue from the current transcript. The last message must be a user or tool-result message. */
	async continue() {
		if (this.activeRun) throw new Error("Agent is already processing. Wait for completion before continuing.");
		const lastMessage = this.mutableState.messages[this.mutableState.messages.length - 1];
		if (!lastMessage) throw new Error("No messages to continue from");
		if (lastMessage.role === "assistant" || lastMessage.role === "toolResult") {
			const queuedSteering = this.steeringQueue.drain();
			if (queuedSteering.length > 0) {
				await this.runPromptMessages(queuedSteering, { skipInitialSteeringPoll: true });
				return;
			}
			const queuedFollowUps = this.followUpQueue.drain();
			if (queuedFollowUps.length > 0) {
				await this.runPromptMessages(queuedFollowUps);
				return;
			}
		}
		if (lastMessage.role === "assistant") throw new TranscriptNotContinuableError(lastMessage.role);
		await this.runContinuation();
	}
	normalizePromptInput(input, images) {
		if (Array.isArray(input)) return input;
		if (typeof input !== "string") return [input];
		const content = [{
			type: "text",
			text: input
		}];
		if (images && images.length > 0) content.push(...images);
		return [{
			role: "user",
			content,
			timestamp: Date.now()
		}];
	}
	async runPromptMessages(messages, options = {}) {
		await this.runWithLifecycle(async (signal) => {
			await runAgentLoop(messages, this.createContextSnapshot(), this.createLoopConfig(options), (event) => this.processEvents(event), signal, this.streamFn);
		});
	}
	async runContinuation() {
		await this.runWithLifecycle(async (signal) => {
			await runAgentLoopContinue(this.createContextSnapshot(), this.createLoopConfig(), (event) => this.processEvents(event), signal, this.streamFn);
		});
	}
	createContextSnapshot() {
		return {
			systemPrompt: this.mutableState.systemPrompt,
			messages: this.mutableState.messages.slice(),
			tools: this.mutableState.tools.slice()
		};
	}
	createLoopConfig(options = {}) {
		let skipInitialSteeringPoll = options.skipInitialSteeringPoll === true;
		const drainSteeringMessages = () => {
			if (skipInitialSteeringPoll) {
				skipInitialSteeringPoll = false;
				return [];
			}
			return this.steeringQueue.drain();
		};
		const getSteeringMessages = attachInternalSyncSteeringGetter(async () => drainSteeringMessages(), drainSteeringMessages);
		return {
			model: this.mutableState.model,
			thinkingLevel: this.mutableState.thinkingLevel,
			reasoning: resolveAgentReasoningOption(this.mutableState.model, this.mutableState.thinkingLevel),
			sessionId: this.sessionId,
			onPayload: this.onPayload,
			onResponse: this.onResponse,
			transport: this.transport,
			thinkingBudgets: this.thinkingBudgets,
			maxRetryDelayMs: this.maxRetryDelayMs,
			toolExecution: this.toolExecution,
			beforeToolCall: this.beforeToolCall,
			beforeToolBatch: getInternalBeforeToolBatch(this),
			toolLoopRecoveryState: this.toolLoopRecoveryState,
			resolveDeferredTool: this.resolveDeferredTool,
			afterToolCall: this.afterToolCall,
			afterToolOutcome: this.afterToolOutcome,
			prepareNextTurn: this.prepareNextTurnWithContext || this.prepareNextTurn ? async (context) => {
				if (this.prepareNextTurnWithContext) return await this.prepareNextTurnWithContext(context, this.signal);
				return await this.prepareNextTurn?.(this.signal);
			} : void 0,
			convertToLlm: this.convertToLlm,
			transformContext: this.transformContext,
			getApiKey: this.getApiKey,
			getSteeringMessages,
			getFollowUpMessages: async () => this.followUpQueue.drain()
		};
	}
	async runWithLifecycle(executor) {
		if (this.activeRun) throw new Error("Agent is already processing.");
		const abortController = new AbortController();
		let resolvePromise = () => {};
		const promise = new Promise((resolve) => {
			resolvePromise = resolve;
		});
		this.activeRun = {
			promise,
			resolve: resolvePromise,
			abortController
		};
		this.mutableState.isStreaming = true;
		this.mutableState.streamingMessage = void 0;
		this.mutableState.errorMessage = void 0;
		try {
			await executor(abortController.signal);
		} catch (error) {
			await this.handleRunFailure(error, abortController.signal.aborted);
		} finally {
			this.finishRun();
		}
	}
	async handleRunFailure(error, aborted) {
		const failureMessage = createFailureMessage(this.mutableState.model, error, aborted);
		await this.processEvents({
			type: "message_start",
			message: failureMessage
		});
		await this.processEvents({
			type: "message_end",
			message: failureMessage
		});
		await this.processEvents({
			type: "turn_end",
			message: failureMessage,
			toolResults: []
		});
		const messages = [failureMessage];
		if (aborted && !isTurnHandoffAbort(this.signal)) await appendInterruptedTurnMessage(messages, (event) => this.processEvents(event));
		await this.processEvents({
			type: "agent_end",
			messages
		});
	}
	finishRun() {
		this.mutableState.isStreaming = false;
		this.mutableState.streamingMessage = void 0;
		this.mutableState.pendingToolCalls = /* @__PURE__ */ new Set();
		this.activeRun?.resolve();
		this.activeRun = void 0;
	}
	/**
	* Reduce internal state for a loop event, then await listeners.
	*
	* `agent_end` only means no further loop events will be emitted. The run is
	* considered idle later, after all awaited listeners for `agent_end` finish
	* and `finishRun()` clears runtime-owned state.
	*/
	async processEvents(event) {
		switch (event.type) {
			case "agent_start":
			case "turn_start":
			case "tool_execution_update": break;
			case "message_start":
				this.mutableState.streamingMessage = event.message;
				break;
			case "message_update":
				this.mutableState.streamingMessage = event.message;
				break;
			case "message_end":
				this.mutableState.streamingMessage = void 0;
				this.mutableState.messages.push(event.message);
				break;
			case "tool_execution_start": {
				const pendingToolCalls = new Set(this.mutableState.pendingToolCalls);
				pendingToolCalls.add(event.toolCallId);
				this.mutableState.pendingToolCalls = pendingToolCalls;
				break;
			}
			case "tool_execution_end": {
				const pendingToolCalls = new Set(this.mutableState.pendingToolCalls);
				pendingToolCalls.delete(event.toolCallId);
				this.mutableState.pendingToolCalls = pendingToolCalls;
				break;
			}
			case "turn_end":
				if (event.message.role === "assistant" && event.message.errorMessage) this.mutableState.errorMessage = event.message.errorMessage;
				break;
			case "agent_end":
				this.mutableState.streamingMessage = void 0;
				break;
		}
		const signal = this.activeRun?.abortController.signal;
		if (!signal) throw new Error("Agent listener invoked outside active run");
		for (const listener of this.listeners) await listener(event, signal);
	}
};
//#endregion
//#region packages/agent-core/src/harness/messages.ts
function asAgentMessage(message) {
	return message;
}
function requireSessionTimestampMs(value, label) {
	const parsed = parseDateStringTimestampMs(value);
	if (parsed === void 0) throw new Error(`${label} must be a valid timestamp`);
	return parsed;
}
function normalizeCompactionSummaryTimestamp(timestamp) {
	if (typeof timestamp === "number") return timestamp;
	return parseDateStringTimestampMs(timestamp) ?? 0;
}
const COMPACTION_SUMMARY_PREFIX = `The conversation history before this point was compacted into the following summary:

<summary>
`;
const COMPACTION_SUMMARY_SUFFIX = `
</summary>`;
const BRANCH_SUMMARY_PREFIX = `The following is a summary of a branch that this conversation came back from:

<summary>
`;
const BRANCH_SUMMARY_SUFFIX = `</summary>`;
/** Render a shell execution record as user-visible context text for the model. */
function bashExecutionToText(msg) {
	let text = `Ran \`${msg.command}\`\n`;
	if (msg.output) text += `\`\`\`\n${msg.output}\n\`\`\``;
	else text += "(no output)";
	if (msg.cancelled) text += "\n\n(command cancelled)";
	else if (msg.exitCode !== null && msg.exitCode !== void 0 && msg.exitCode !== 0) text += `\n\nCommand exited with code ${msg.exitCode}`;
	if (msg.truncated && msg.fullOutputPath) text += `\n\n[Output truncated. Full output: ${msg.fullOutputPath}]`;
	return text;
}
/** Build a persisted branch summary message from the repository timestamp string. */
function createBranchSummaryMessage(summary, fromId, timestamp) {
	return {
		role: "branchSummary",
		summary,
		fromId,
		timestamp: requireSessionTimestampMs(timestamp, "branch summary timestamp")
	};
}
/** Build a persisted compaction summary message from the repository timestamp string. */
function createCompactionSummaryMessage(summary, tokensBefore, timestamp) {
	return {
		role: "compactionSummary",
		summary,
		tokensBefore,
		timestamp: requireSessionTimestampMs(timestamp, "compaction summary timestamp")
	};
}
/** Build a custom transcript message that can be shown and replayed into context. */
function createCustomMessage(customType, content, display, details, timestamp) {
	return {
		role: "custom",
		customType,
		content,
		display,
		details,
		timestamp: requireSessionTimestampMs(timestamp, "custom message timestamp")
	};
}
/** Convert harness transcript messages into the LLM-facing message sequence. */
function convertToLlm(messages) {
	return messages.map((m) => {
		const message = m;
		switch (message.role) {
			case "bashExecution":
				if (message.excludeFromContext) return;
				return {
					role: "user",
					content: [{
						type: "text",
						text: bashExecutionToText(message)
					}],
					timestamp: message.timestamp
				};
			case "custom": {
				const content = typeof message.content === "string" ? [{
					type: "text",
					text: message.content
				}] : message.content;
				const runtimeContextCarrier = message.details?.runtimeContextCarrier === true;
				return {
					role: "user",
					content,
					timestamp: message.timestamp,
					...runtimeContextCarrier ? { runtimeContextCarrier: true } : {}
				};
			}
			case "branchSummary": return {
				role: "user",
				content: [{
					type: "text",
					text: BRANCH_SUMMARY_PREFIX + message.summary + BRANCH_SUMMARY_SUFFIX
				}],
				timestamp: message.timestamp
			};
			case "compactionSummary": return {
				role: "user",
				content: [{
					type: "text",
					text: COMPACTION_SUMMARY_PREFIX + message.summary + COMPACTION_SUMMARY_SUFFIX
				}],
				timestamp: normalizeCompactionSummaryTimestamp(message.timestamp)
			};
			case "user":
			case "assistant":
			case "toolResult": return message;
			default: return;
		}
	}).filter((m) => m !== void 0);
}
//#endregion
//#region packages/agent-core/src/harness/prompt-template-arguments.ts
/** Parse an argument string using simple shell-style single and double quotes. */
function parseCommandArgs(argsString) {
	const args = [];
	let current = "";
	let inQuote = null;
	let hasToken = false;
	for (const char of argsString) if (inQuote) if (char === inQuote) inQuote = null;
	else {
		hasToken = true;
		current += char;
	}
	else if (char === "\"" || char === "'") {
		hasToken = true;
		inQuote = char;
	} else if (/\s/.test(char)) {
		if (hasToken) {
			args.push(current);
			current = "";
			hasToken = false;
		}
	} else {
		hasToken = true;
		current += char;
	}
	if (hasToken) args.push(current);
	return args;
}
/**
* Substitute prompt template placeholders (`$1`, `$@`, `$ARGUMENTS`, `${@:N}`, `${@:N:L}`) with command arguments.
*
* Unsafe integer placeholders resolve to empty text instead of throwing, so malformed templates cannot abort prompt
* loading or invocation.
*/
function substituteArgs(content, args) {
	let result = content;
	result = result.replace(/\$(\d+)/g, (_, num) => {
		const parsed = parseStrictNonNegativeInteger(num);
		if (parsed === void 0 || parsed <= 0) return "";
		return args[parsed - 1] ?? "";
	});
	result = result.replace(/\$\{@:(\d+)(?::(\d+))?\}/g, (_, startStr, lengthStr) => {
		const parsedStart = parseStrictNonNegativeInteger(startStr);
		if (parsedStart === void 0) return "";
		let start = parsedStart - 1;
		if (start < 0) start = 0;
		if (lengthStr) {
			const length = parseStrictNonNegativeInteger(lengthStr);
			if (length === void 0) return "";
			return args.slice(start, start + length).join(" ");
		}
		return args.slice(start).join(" ");
	});
	const allArgs = args.join(" ");
	result = result.replace(/\$ARGUMENTS/g, allArgs);
	result = result.replace(/\$@/g, allArgs);
	return result;
}
//#endregion
//#region packages/agent-core/src/harness/session/session.ts
const SESSION_HISTORY_PRELUDE = Symbol.for("openclaw.sessionHistoryPrelude");
/** Project persisted session entries into the message shared by replay and summarization. */
function projectSessionEntryMessage(entry) {
	switch (entry.type) {
		case "message": return entry.message.role === "bashExecution" && entry.message.excludeFromContext === true ? void 0 : entry.message;
		case "custom_message": return asAgentMessage(createCustomMessage(entry.customType, entry.content, entry.display, entry.details, entry.timestamp));
		case "branch_summary": return asAgentMessage(createBranchSummaryMessage(entry.summary, entry.fromId, entry.timestamp));
		case "compaction": return asAgentMessage(createCompactionSummaryMessage(entry.summary, entry.tokensBefore, entry.timestamp));
		default: return;
	}
}
function stripStalePrefixReplay(message) {
	return message.role === "assistant" ? stripCompactionReplayCheckpoint(message) : message;
}
function appendContextMessage(messages, entry, options) {
	if (entry.type === "compaction" || entry.type === "branch_summary" && !entry.summary) return;
	const message = projectSessionEntryMessage(entry);
	if (message) messages.push(options?.prefixWasRewritten ? stripStalePrefixReplay(message) : message);
}
function appendResetKeptMessage(messages, entry) {
	if (entry.type !== "message") return;
	if (entry.message.role === "user" || entry.message.role === "assistant") {
		const message = { ...stripStalePrefixReplay(entry.message) };
		Object.defineProperty(message, SESSION_HISTORY_PRELUDE, {
			configurable: true,
			enumerable: false,
			value: true
		});
		messages.push(message);
	} else if (entry.message.role === "toolResult") messages.push(entry.message);
}
/** Build model context from an ordered session branch and its latest state markers. */
function buildSessionContext(pathEntries) {
	let thinkingLevel = "off";
	let model = null;
	let boundary = null;
	for (const entry of pathEntries) if (entry.type === "thinking_level_change") thinkingLevel = entry.thinkingLevel;
	else if (entry.type === "model_change") model = {
		provider: entry.provider,
		modelId: entry.modelId
	};
	else if (entry.type === "message" && entry.message.role === "assistant") model = {
		provider: entry.message.provider,
		modelId: entry.message.model
	};
	else if (entry.type === "compaction" || entry.type === "reset") boundary = entry;
	const messages = [];
	if (boundary) {
		if (boundary.type === "compaction") {
			const summary = projectSessionEntryMessage(boundary);
			if (summary) messages.push(summary);
		}
		const boundaryIdx = pathEntries.findIndex((entry) => entry.id === boundary.id);
		const firstKeptIdx = pathEntries.findIndex((entry) => entry.id === boundary.firstKeptEntryId);
		const keptEntries = firstKeptIdx >= 0 && firstKeptIdx < boundaryIdx ? pathEntries.slice(firstKeptIdx, boundaryIdx) : [];
		const replayEntries = boundary.type === "reset" ? selectResetKeptEntries(keptEntries) : keptEntries;
		for (const entry of replayEntries) if (boundary.type === "reset") appendResetKeptMessage(messages, entry);
		else appendContextMessage(messages, entry, { prefixWasRewritten: true });
		for (const entry of pathEntries.slice(boundaryIdx + 1)) appendContextMessage(messages, entry);
	} else for (const entry of pathEntries) appendContextMessage(messages, entry);
	return {
		messages,
		thinkingLevel,
		model
	};
}
//#endregion
//#region packages/agent-core/src/harness/types.ts
var CompactionError = class extends Error {
	constructor(code, message, cause) {
		super(message, cause === void 0 ? void 0 : { cause });
		this.name = "CompactionError";
		this.code = code;
	}
};
/** Internal typed signal for a completed summary response with no usable text. */
var InvalidSummaryOutputError = class extends CompactionError {
	constructor(message) {
		super("summarization_failed", message);
	}
};
var BranchSummaryError = class extends Error {
	constructor(code, message, cause) {
		super(message, cause === void 0 ? void 0 : { cause });
		this.name = "BranchSummaryError";
		this.code = code;
	}
};
//#endregion
//#region packages/agent-core/src/harness/compaction/utils.ts
function normalizeFileToolName(value) {
	const name = typeof value === "string" ? value.toLowerCase() : "";
	const separator = name.indexOf("__", name.startsWith("mcp__") ? 5 : 0);
	return separator < 0 ? name : name.slice(separator + 2);
}
function addFilePaths(target, value) {
	for (const path of Array.isArray(value) ? value : []) if (typeof path === "string") target.add(path);
}
/** Create an empty file-operation accumulator. */
function createFileOps() {
	return {
		read: /* @__PURE__ */ new Set(),
		written: /* @__PURE__ */ new Set(),
		edited: /* @__PURE__ */ new Set()
	};
}
/** Restore file metadata recorded by an earlier compaction or branch summary. */
function mergeSummaryFileOperations(fileOps, details) {
	addFilePaths(fileOps.read, details.readFiles);
	addFilePaths(fileOps.edited, details.modifiedFiles);
}
/** Add file operations from tool calls and results to an accumulator. */
function extractFileOpsFromMessage(message, fileOps) {
	if (message.role === "toolResult") {
		if (normalizeFileToolName(message.toolName) !== "apply_patch") return;
		for (const result of [message, ...Array.isArray(message.content) ? message.content : []]) {
			const summary = asOptionalRecord(asOptionalRecord(asOptionalRecord(result)?.details)?.summary);
			addFilePaths(fileOps.written, summary?.added);
			addFilePaths(fileOps.edited, summary?.modified);
		}
		return;
	}
	if (message.role !== "assistant" || !Array.isArray(message.content)) return;
	for (const block of message.content) {
		const toolCall = asOptionalRecord(block);
		if (toolCall?.type !== "toolCall") continue;
		const args = asOptionalRecord(toolCall.arguments);
		const path = [
			args?.path,
			args?.file_path,
			args?.filePath
		].find((value) => typeof value === "string");
		if (!path) continue;
		switch (normalizeFileToolName(toolCall.name)) {
			case "read":
				fileOps.read.add(path);
				break;
			case "write":
				fileOps.written.add(path);
				break;
			case "edit":
				fileOps.edited.add(path);
				break;
		}
	}
}
/** Compute sorted read-only and modified file lists from accumulated operations. */
function computeFileLists(fileOps) {
	const modified = /* @__PURE__ */ new Set([...fileOps.edited, ...fileOps.written]);
	return {
		readFiles: [...fileOps.read].filter((f) => !modified.has(f)).toSorted(),
		modifiedFiles: [...modified].toSorted()
	};
}
/** Format file lists as summary metadata tags. */
function formatFileOperations(readFiles, modifiedFiles) {
	const sections = [readFiles.length ? `<read-files>\n${readFiles.join("\n")}\n</read-files>` : "", modifiedFiles.length ? `<modified-files>\n${modifiedFiles.join("\n")}\n</modified-files>` : ""].filter(Boolean);
	return sections.length ? `\n\n${sections.join("\n\n")}` : "";
}
/** Extract visible summary text without normalizing valid model output. */
function extractSummaryText(response) {
	const summary = response.content.filter((block) => block.type === "text").map((block) => block.text).join("\n");
	return summary.trim() ? summary : void 0;
}
const TOOL_RESULT_MAX_CHARS = 2e3;
const IMPORTANT_TOOL_RESULT_TAIL = /(error|exception|failed|fatal|traceback|panic|stack trace|errno|exit code)/i;
function stringifyCompactionValue(value) {
	try {
		return JSON.stringify(value) ?? "undefined";
	} catch {
		return "[unserializable]";
	}
}
function truncateForSummary(text, maxChars) {
	if (text.length <= maxChars) return text;
	const tailChars = Math.min(Math.floor(maxChars * .3), 600);
	const diagnosticSearch = sliceUtf16Safe(text, -maxChars);
	const diagnosticMatches = [...diagnosticSearch.matchAll(new RegExp(IMPORTANT_TOOL_RESULT_TAIL.source, "gi"))];
	const diagnosticMatch = diagnosticMatches.findLast((match) => /^(error|exception|fatal|panic|errno)$/i.test(match[0])) ?? diagnosticMatches.at(-1);
	if (diagnosticMatch) {
		const head = truncateUtf16Safe(text, maxChars - tailChars);
		const displacedHead = sliceUtf16Safe(text, Math.max(0, head.length - 32), maxChars);
		if (!IMPORTANT_TOOL_RESULT_TAIL.test(displacedHead)) {
			const diagnosticOffset = text.length - diagnosticSearch.length + (diagnosticMatch.index ?? 0);
			const tailStart = Math.min(diagnosticOffset, text.length - tailChars);
			if (tailStart >= head.length) {
				const tail = sliceUtf16Safe(text, tailStart, tailStart + tailChars);
				return `${head}\n\n[... ${text.length - head.length - tail.length} ${tailStart + tail.length < text.length ? "middle/trailing" : "more"} characters truncated]\n\n${tail}`;
			}
		}
	}
	const sliced = truncateUtf16Safe(text, maxChars);
	return `${sliced}\n\n[... ${text.length - sliced.length} more characters truncated]`;
}
/** Extract text that compaction both estimates and includes in summary prompts. */
function getCompactionContentBlockText(block) {
	if ((block.type === "text" || block.type === "toolResult" || block.type === "tool_result") && block.text) return block.text;
	return (block.type === "toolResult" || block.type === "tool_result") && typeof block.content === "string" ? block.content : "";
}
/** Serialize LLM messages to plain text for summarization prompts. */
function serializeConversation(messages) {
	const parts = [];
	for (const msg of messages) if (msg.role === "user") {
		const content = typeof msg.content === "string" ? msg.content : msg.content.map(getCompactionContentBlockText).join("");
		if (content) parts.push(`[User]: ${content}`);
	} else if (msg.role === "assistant") {
		const textParts = [];
		const thinkingParts = [];
		const toolCalls = [];
		for (const block of msg.content) if (block.type === "text") textParts.push(block.text);
		else if (block.type === "thinking") thinkingParts.push(block.thinking);
		else if (block.type === "toolCall") {
			const argsStr = Object.entries(block.arguments).map(([k, v]) => `${k}=${stringifyCompactionValue(v)}`).join(", ");
			toolCalls.push(`${block.name}(${argsStr})`);
		}
		if (thinkingParts.length > 0) parts.push(`[Assistant thinking]: ${thinkingParts.join("\n")}`);
		if (textParts.length > 0) parts.push(`[Assistant]: ${textParts.join("\n")}`);
		if (toolCalls.length > 0) parts.push(`[Assistant tool calls]: ${toolCalls.join("; ")}`);
	} else if (msg.role === "toolResult") {
		const content = msg.content.map(getCompactionContentBlockText).join("");
		if (content) parts.push(`[Tool result]: ${truncateForSummary(content, TOOL_RESULT_MAX_CHARS)}`);
	}
	return parts.join("\n\n");
}
//#endregion
//#region packages/agent-core/src/harness/compaction/compaction.ts
function extractFileOperations(messages, entries, prevBoundaryIndex) {
	const fileOps = createFileOps();
	if (prevBoundaryIndex >= 0 && entries[prevBoundaryIndex]?.type === "compaction") {
		const prevCompaction = entries[prevBoundaryIndex];
		if (!prevCompaction.fromHook && prevCompaction.details) mergeSummaryFileOperations(fileOps, prevCompaction.details);
	}
	for (const msg of messages) extractFileOpsFromMessage(msg, fileOps);
	return fileOps;
}
function getMessageFromEntryForCompaction(entry) {
	if (entry.type === "compaction") return;
	return projectSessionEntryMessage(entry);
}
/** Default compaction settings used by the harness. */
const DEFAULT_COMPACTION_SETTINGS = {
	enabled: true,
	reserveTokens: 16384,
	keepRecentTokens: 2e4
};
/** Calculate total context tokens from provider usage. */
function calculateContextTokens(usage) {
	if (usage.contextUsage?.state === "available") return usage.contextUsage.totalTokens;
	return usage.totalTokens || usage.input + usage.output + usage.cacheRead + usage.cacheWrite;
}
function getAssistantUsage(msg) {
	if (msg.role === "assistant" && "usage" in msg) {
		const assistantMsg = msg;
		if (assistantMsg.stopReason !== "aborted" && assistantMsg.stopReason !== "error" && assistantMsg.usage && calculateContextTokens(assistantMsg.usage) > 0) return assistantMsg.usage;
	}
}
function isUnavailableContextBarrier(message) {
	if (message.role !== "assistant") return false;
	const usage = "usage" in message ? message.usage : void 0;
	if (!usage) return false;
	if (message.api === "cli" && usage.contextUsage === void 0) return true;
	if (usage.contextUsage?.state !== "unavailable") return false;
	return calculateContextTokens(usage) === 0;
}
/** Return usage from the last valid assistant message in session entries. */
function getLastAssistantUsage(entries) {
	for (const entry of entries.toReversed()) if (entry.type === "message") {
		if (isUnavailableContextBarrier(entry.message)) return;
		const usage = getAssistantUsage(entry.message);
		if (usage) return usage;
	}
}
function getLastAssistantUsageInfo(messages) {
	for (let i = messages.length - 1; i >= 0; i--) {
		const message = messages.at(i);
		if (!message) continue;
		if (isUnavailableContextBarrier(message)) return;
		const usage = getAssistantUsage(message);
		if (usage && usage.contextUsage?.state !== "unavailable") return {
			usage,
			index: i
		};
	}
}
/** Estimate context tokens for messages using provider usage when available. */
function estimateContextTokens(messages) {
	const usageInfo = getLastAssistantUsageInfo(messages);
	if (!usageInfo) {
		let estimated = 0;
		for (const message of messages) estimated += estimateTokens(message);
		return {
			tokens: estimated,
			usageTokens: 0,
			trailingTokens: estimated,
			lastUsageIndex: null
		};
	}
	const usageTokens = calculateContextTokens(usageInfo.usage);
	let trailingTokens = 0;
	for (const message of messages.slice(usageInfo.index + 1)) trailingTokens += estimateTokens(message);
	return {
		tokens: usageTokens + trailingTokens,
		usageTokens,
		trailingTokens,
		lastUsageIndex: usageInfo.index
	};
}
/** Return whether context usage exceeds the configured compaction threshold. */
function shouldCompact(contextTokens, contextWindow, settings) {
	if (!settings.enabled || !Number.isFinite(contextWindow) || contextWindow <= 0) return false;
	if (typeof settings.contextUsageThreshold === "number" && Number.isFinite(settings.contextUsageThreshold) && settings.contextUsageThreshold > 0 && settings.contextUsageThreshold < 1) return contextTokens > contextWindow * settings.contextUsageThreshold;
	return contextTokens > contextWindow - settings.reserveTokens;
}
const IMAGE_BLOCK_TOKENS = 2e3;
const IMAGE_BLOCK_CHARS = IMAGE_BLOCK_TOKENS * 4;
function countContentBlockChars(content) {
	let chars = 0;
	for (const block of content) if (block.type === "image") chars += IMAGE_BLOCK_CHARS;
	else chars += estimateStringChars(getCompactionContentBlockText(block));
	return chars;
}
/** Estimate token count for one message using a conservative character heuristic. */
function estimateTokens(message) {
	let chars = 0;
	const harnessMessage = message;
	switch (harnessMessage.role) {
		case "user": {
			const content = harnessMessage.content;
			if (typeof content === "string") chars = estimateStringChars(content);
			else if (Array.isArray(content)) chars = countContentBlockChars(content);
			return Math.ceil(chars / 4);
		}
		case "assistant": {
			const assistant = harnessMessage;
			for (const block of assistant.content) if (block.type === "text") chars += estimateStringChars(block.text);
			else if (block.type === "thinking") chars += estimateStringChars(block.thinking);
			else if (block.type === "toolCall") chars += estimateStringChars(block.name) + estimateStringChars(stringifyCompactionValue(block.arguments));
			return Math.ceil(chars / 4);
		}
		case "custom":
		case "toolResult":
			if (typeof harnessMessage.content === "string") chars = estimateStringChars(harnessMessage.content);
			else chars = countContentBlockChars(harnessMessage.content);
			return Math.ceil(chars / 4);
		case "bashExecution":
			if (harnessMessage.excludeFromContext === true) return 0;
			chars = estimateStringChars(harnessMessage.command) + estimateStringChars(harnessMessage.output);
			return Math.ceil(chars / 4);
		case "branchSummary":
		case "compactionSummary":
			chars = estimateStringChars(harnessMessage.summary);
			return Math.ceil(chars / 4);
	}
	return 0;
}
function isCutPointMessage(message) {
	switch (message.role) {
		case "user":
		case "assistant":
		case "bashExecution":
		case "custom":
		case "branchSummary":
		case "compactionSummary": return true;
		case "toolResult": return false;
	}
	return false;
}
function isTurnStartMessage(message) {
	switch (message.role) {
		case "user":
		case "bashExecution":
		case "custom":
		case "branchSummary":
		case "compactionSummary": return true;
		case "assistant":
		case "toolResult": return false;
	}
	return false;
}
function isTurnStartEntry(entry) {
	const message = getMessageFromEntryForCompaction(entry);
	return message ? isTurnStartMessage(message) : false;
}
function findValidCutPoints(entries, startIndex, endIndex) {
	const cutPoints = [];
	for (let i = startIndex; i < endIndex; i++) {
		const entry = entries[i];
		if (!entry) continue;
		const message = getMessageFromEntryForCompaction(entry);
		if (message && isCutPointMessage(message)) cutPoints.push(i);
	}
	return cutPoints;
}
/** Find the user-visible message that starts the turn containing an entry. */
function findTurnStartIndex(entries, entryIndex, startIndex) {
	for (let i = entryIndex; i >= startIndex; i--) {
		const entry = entries[i];
		if (!entry) continue;
		if (isTurnStartEntry(entry)) return i;
	}
	return -1;
}
/** Find the compaction cut point that keeps approximately the requested recent-token budget. */
function findCutPoint(entries, startIndex, endIndex, keepRecentTokens) {
	const cutPoints = findValidCutPoints(entries, startIndex, endIndex);
	if (cutPoints.length === 0) return {
		firstKeptEntryIndex: startIndex,
		turnStartIndex: -1,
		isSplitTurn: false
	};
	let accumulatedTokens = 0;
	const firstCutIndex = cutPoints.at(0);
	if (firstCutIndex === void 0) return {
		firstKeptEntryIndex: startIndex,
		turnStartIndex: -1,
		isSplitTurn: false
	};
	let cutIndex = firstCutIndex;
	for (let i = endIndex - 1; i >= startIndex; i--) {
		const entry = entries[i];
		if (!entry) continue;
		const message = getMessageFromEntryForCompaction(entry);
		if (!message) continue;
		const messageTokens = estimateTokens(message);
		accumulatedTokens += messageTokens;
		if (accumulatedTokens >= keepRecentTokens) {
			const lastCutIndex = cutPoints.at(-1);
			if (lastCutIndex === void 0) throw new Error("compaction cut-point list became empty during selection");
			cutIndex = lastCutIndex;
			for (const cutPoint of cutPoints) if (cutPoint >= i) {
				cutIndex = cutPoint;
				break;
			}
			break;
		}
	}
	while (cutIndex > startIndex) {
		const prevEntry = entries[cutIndex - 1];
		if (!prevEntry) break;
		if (prevEntry.type === "compaction" || prevEntry.type === "reset") break;
		if (prevEntry.type === "message" || getMessageFromEntryForCompaction(prevEntry)) break;
		cutIndex--;
	}
	const cutEntry = entries[cutIndex];
	if (!cutEntry) throw new Error("compaction cut point does not reference a session entry");
	const startsTurn = isTurnStartEntry(cutEntry);
	const turnStartIndex = startsTurn ? -1 : findTurnStartIndex(entries, cutIndex, startIndex);
	return {
		firstKeptEntryIndex: cutIndex,
		turnStartIndex,
		isSplitTurn: !startsTurn && turnStartIndex !== -1
	};
}
const SUMMARIZATION_SYSTEM_PROMPT = `You are a context summarization assistant. Your task is to read a conversation between a user and an AI assistant, then produce a structured summary following the exact format specified.

Do NOT continue the conversation. Do NOT respond to any questions in the conversation. ONLY output the structured summary.`;
const SUMMARIZATION_PROMPT = `The messages above are a conversation to summarize. Create a structured context checkpoint summary that another LLM will use to continue the work.

Use this EXACT format:

## Goal
[What is the user trying to accomplish? Can be multiple items if the session covers different tasks.]

## Constraints & Preferences
- [Any constraints, preferences, or requirements mentioned by user]
- [Or "(none)" if none were mentioned]

## Progress
### Done
- [x] [Completed tasks/changes]

### In Progress
- [ ] [Current work]

### Blocked
- [Issues preventing progress, if any]

## Key Decisions
- **[Decision]**: [Brief rationale]

## Next Steps
1. [Ordered list of what should happen next]

## Critical Context
- [Any data, examples, or references needed to continue]
- [Or "(none)" if not applicable]

Keep each section concise. Preserve exact file paths, function names, and error messages.`;
const UPDATE_SUMMARIZATION_PROMPT = `The messages above are NEW conversation messages to incorporate into the existing summary provided in <previous-summary> tags.

Update the existing structured summary with new information. RULES:
- PRESERVE all existing information from the previous summary
- ADD new progress, decisions, and context from the new messages
- UPDATE the Progress section: move items from "In Progress" to "Done" when completed
- UPDATE "Next Steps" based on what was accomplished
- PRESERVE exact file paths, function names, and error messages
- If something is no longer relevant, you may remove it

Use this EXACT format:

## Goal
[Preserve existing goals, add new ones if the task expanded]

## Constraints & Preferences
- [Preserve existing, add new ones discovered]

## Progress
### Done
- [x] [Include previously done items AND newly completed items]

### In Progress
- [ ] [Current work - update based on progress]

### Blocked
- [Current blockers - remove if resolved]

## Key Decisions
- **[Decision]**: [Brief rationale] (preserve all previous, add new)

## Next Steps
1. [Update based on current state]

## Critical Context
- [Preserve important context, add new if needed]

Keep each section concise. Preserve exact file paths, function names, and error messages.`;
function createSummarizationOptions(model, maxTokens, apiKey, headers, signal, thinkingLevel) {
	const options = {
		maxTokens,
		signal,
		apiKey,
		headers
	};
	const fableReasoning = (model.api === "anthropic-messages" || model.api === "bedrock-converse-stream") && resolveClaudeFable5ModelIdentity(model) !== void 0;
	if ((model.reasoning || fableReasoning) && thinkingLevel) options.reasoning = resolveAgentReasoningOption(model, thinkingLevel);
	return options;
}
/** Runs one summarization completion and maps abort/error stops to CompactionError. */
async function runSummarizationCompletion(params) {
	const context = {
		systemPrompt: SUMMARIZATION_SYSTEM_PROMPT,
		messages: [{
			role: "user",
			content: [{
				type: "text",
				text: params.promptText
			}],
			timestamp: Date.now()
		}]
	};
	const options = createSummarizationOptions(params.model, params.maxTokens, params.apiKey, params.headers, params.signal, params.thinkingLevel);
	const response = params.streamFn ? await (await params.streamFn(params.model, context, options)).result() : await resolveAgentCoreCompleteFn(params.runtime)(params.model, context, options);
	if (response.stopReason === "aborted") return err(new CompactionError("aborted", response.errorMessage || `${params.errorLabel} aborted`));
	if (response.stopReason === "error") return err(new CompactionError("summarization_failed", `${params.errorLabel} failed: ${response.errorMessage || "Unknown error"}`));
	const summary = extractSummaryText(response);
	if (summary === void 0) return err(new InvalidSummaryOutputError(`${params.errorLabel} failed: model returned no summary text`));
	return ok(summary);
}
/** Generate or update a conversation summary for compaction. */
async function generateSummary(currentMessages, model, reserveTokens, apiKey, headers, signal, customInstructions, previousSummary, thinkingLevel, streamFn, runtime) {
	const maxTokens = Math.min(Math.floor(.8 * reserveTokens), model.maxTokens > 0 ? model.maxTokens : Number.POSITIVE_INFINITY);
	let basePrompt = previousSummary ? UPDATE_SUMMARIZATION_PROMPT : SUMMARIZATION_PROMPT;
	if (customInstructions) basePrompt = `${basePrompt}\n\nAdditional focus: ${customInstructions}`;
	let promptText = `<conversation>\n${serializeConversation(convertToLlm(currentMessages))}\n</conversation>\n\n`;
	if (previousSummary) promptText += `<previous-summary>\n${previousSummary}\n</previous-summary>\n\n`;
	promptText += basePrompt;
	return await runSummarizationCompletion({
		promptText,
		model,
		maxTokens,
		apiKey,
		headers,
		signal,
		thinkingLevel,
		streamFn,
		runtime,
		errorLabel: "Summarization"
	});
}
/** Prepare session entries for compaction, or return undefined when compaction is not applicable. */
function prepareCompaction(pathEntries, settings) {
	if (pathEntries.at(-1)?.type === "compaction" || pathEntries.at(-1)?.type === "reset" || pathEntries.length === 0) return ok(void 0);
	let prevBoundaryIndex = -1;
	for (let i = pathEntries.length - 1; i >= 0; i--) {
		const type = pathEntries.at(i)?.type;
		if (type === "compaction" || type === "reset") {
			prevBoundaryIndex = i;
			break;
		}
	}
	let previousSummary;
	let effectiveEntries = pathEntries;
	let resetPreludeMessages = [];
	let boundaryStart = 0;
	if (prevBoundaryIndex >= 0) {
		const prevBoundary = pathEntries[prevBoundaryIndex];
		previousSummary = prevBoundary?.type === "compaction" ? prevBoundary.summary : void 0;
		const firstKeptEntryId = prevBoundary?.type === "compaction" || prevBoundary?.type === "reset" ? prevBoundary.firstKeptEntryId : void 0;
		const firstKeptEntryIndex = pathEntries.findIndex((entry) => entry.id === firstKeptEntryId);
		if (prevBoundary?.type === "reset") {
			resetPreludeMessages = (firstKeptEntryIndex >= 0 ? selectResetKeptEntries(pathEntries.slice(firstKeptEntryIndex, prevBoundaryIndex)) : []).flatMap((entry) => {
				const message = getMessageFromEntryForCompaction(entry);
				return message ? [message] : [];
			});
			effectiveEntries = pathEntries.slice(prevBoundaryIndex + 1);
			prevBoundaryIndex = -1;
		} else boundaryStart = firstKeptEntryIndex >= 0 ? firstKeptEntryIndex : prevBoundaryIndex + 1;
	}
	const boundaryEnd = effectiveEntries.length;
	const contextMessages = buildSessionContext(pathEntries).messages;
	const contextUsage = estimateContextTokens(contextMessages);
	const tokensBefore = contextUsage.tokens;
	const totalEstimatedTokens = contextMessages.reduce((total, message) => total + estimateTokens(message), 0);
	const triggerUnitScale = totalEstimatedTokens > 0 && Number.isFinite(totalEstimatedTokens) && Number.isFinite(contextUsage.usageTokens) ? Math.min(Math.max(1, settings.keepRecentTokens), Math.max(1, contextUsage.usageTokens / totalEstimatedTokens)) : 1;
	const resetPreludeTokens = resetPreludeMessages.reduce((total, message) => total + estimateTokens(message), 0);
	const keepRecentTokens = Math.min(Number.MAX_SAFE_INTEGER, settings.keepRecentTokens / triggerUnitScale + resetPreludeTokens);
	const cutPoint = findCutPoint(effectiveEntries, boundaryStart, boundaryEnd, keepRecentTokens);
	const firstKeptEntry = effectiveEntries[cutPoint.firstKeptEntryIndex];
	if (!firstKeptEntry?.id) return err(new CompactionError("invalid_session", "First kept entry has no UUID - session may need migration"));
	const firstKeptEntryId = firstKeptEntry.id;
	const historyEnd = cutPoint.isSplitTurn ? cutPoint.turnStartIndex : cutPoint.firstKeptEntryIndex;
	const messagesToSummarize = [...resetPreludeMessages];
	for (let i = boundaryStart; i < historyEnd; i++) {
		const entry = effectiveEntries.at(i);
		const msg = entry ? getMessageFromEntryForCompaction(entry) : void 0;
		if (msg) messagesToSummarize.push(msg);
	}
	const turnPrefixMessages = [];
	if (cutPoint.isSplitTurn) for (let i = cutPoint.turnStartIndex; i < cutPoint.firstKeptEntryIndex; i++) {
		const entry = effectiveEntries.at(i);
		const msg = entry ? getMessageFromEntryForCompaction(entry) : void 0;
		if (msg) turnPrefixMessages.push(msg);
	}
	if (messagesToSummarize.length === 0 && turnPrefixMessages.length === 0) return ok(void 0);
	const fileOps = extractFileOperations(messagesToSummarize, effectiveEntries, prevBoundaryIndex);
	if (cutPoint.isSplitTurn) for (const msg of turnPrefixMessages) extractFileOpsFromMessage(msg, fileOps);
	return ok({
		firstKeptEntryId,
		messagesToSummarize,
		turnPrefixMessages,
		isSplitTurn: cutPoint.isSplitTurn,
		tokensBefore,
		previousSummary,
		fileOps,
		settings
	});
}
const TURN_PREFIX_SUMMARIZATION_PROMPT = `This is the PREFIX of a turn that was too large to keep. The SUFFIX (recent work) is retained.

Summarize the prefix to provide context for the retained suffix:

## Original Request
[What did the user ask for in this turn?]

## Early Progress
- [Key decisions and work done in the prefix]

## Context for Suffix
- [Information needed to understand the retained recent work]

Be concise. Focus on what's needed to understand the kept suffix.`;
/** Generate compaction summary data from prepared session history. */
async function compact(preparation, model, apiKey, headers, customInstructions, signal, thinkingLevel, streamFn, runtime) {
	const { firstKeptEntryId, messagesToSummarize, turnPrefixMessages, isSplitTurn, tokensBefore, previousSummary, fileOps, settings } = preparation;
	if (!firstKeptEntryId) return err(new CompactionError("invalid_session", "First kept entry has no UUID - session may need migration"));
	const summarizeTurnPrefix = isSplitTurn && turnPrefixMessages.length > 0;
	const historyResult = messagesToSummarize.length > 0 || !summarizeTurnPrefix ? await generateSummary(messagesToSummarize, model, settings.reserveTokens, apiKey, headers, signal, customInstructions, previousSummary, thinkingLevel, streamFn, runtime) : ok("No prior history.");
	if (!historyResult.ok) return err(historyResult.error);
	let summary = historyResult.value;
	if (summarizeTurnPrefix) {
		const turnPrefixResult = await generateTurnPrefixSummary(turnPrefixMessages, model, settings.reserveTokens, apiKey, headers, signal, thinkingLevel, streamFn, runtime);
		if (!turnPrefixResult.ok) return err(turnPrefixResult.error);
		summary = `${summary}\n\n---\n\n**Turn Context (split turn):**\n\n${turnPrefixResult.value}`;
	}
	const { readFiles, modifiedFiles } = computeFileLists(fileOps);
	summary += formatFileOperations(readFiles, modifiedFiles);
	return ok({
		summary,
		firstKeptEntryId,
		tokensBefore,
		details: {
			readFiles,
			modifiedFiles
		}
	});
}
async function generateTurnPrefixSummary(messages, model, reserveTokens, apiKey, headers, signal, thinkingLevel, streamFn, runtime) {
	const maxTokens = Math.min(Math.floor(.5 * reserveTokens), model.maxTokens > 0 ? model.maxTokens : Number.POSITIVE_INFINITY);
	return await runSummarizationCompletion({
		promptText: `<conversation>\n${serializeConversation(convertToLlm(messages))}\n</conversation>\n\n${TURN_PREFIX_SUMMARIZATION_PROMPT}`,
		model,
		maxTokens,
		apiKey,
		headers,
		signal,
		thinkingLevel,
		streamFn,
		runtime,
		errorLabel: "Turn prefix summarization"
	});
}
//#endregion
//#region packages/agent-core/src/harness/compaction/branch-summarization.ts
/** Collect entries that should be summarized before navigating to a different session tree entry. */
function collectEntriesForBranchSummaryFromBranches(oldBranch, targetBranch) {
	const oldPath = new Set(oldBranch.map((entry) => entry.id));
	let commonAncestorId = null;
	for (const targetEntry of targetBranch.toReversed()) if (oldPath.has(targetEntry.id)) {
		commonAncestorId = targetEntry.id;
		break;
	}
	const firstSummarizedIndex = commonAncestorId === null ? 0 : oldBranch.findIndex((entry) => entry.id === commonAncestorId) + 1;
	return {
		entries: oldBranch.slice(firstSummarizedIndex),
		commonAncestorId
	};
}
/** Prepare branch entries for summarization within an optional token budget. */
function prepareBranchEntries(entries, tokenBudget = 0) {
	const messages = [];
	const fileOps = createFileOps();
	let totalTokens = 0;
	for (const entry of entries) if (entry.type === "branch_summary" && !entry.fromHook && entry.details) mergeSummaryFileOperations(fileOps, entry.details);
	for (const entry of entries.toReversed()) {
		const message = projectSessionEntryMessage(entry);
		if (!message) continue;
		extractFileOpsFromMessage(message, fileOps);
		const tokens = estimateTokens(message);
		if (tokenBudget > 0 && totalTokens + tokens > tokenBudget) {
			if (entry.type === "compaction" || entry.type === "branch_summary") {
				if (totalTokens < tokenBudget * .9) {
					messages.unshift(message);
					totalTokens += tokens;
				}
			}
			break;
		}
		messages.unshift(message);
		totalTokens += tokens;
	}
	return {
		messages,
		fileOps,
		totalTokens
	};
}
const BRANCH_SUMMARY_PREAMBLE = `The user explored a different conversation branch before returning here.
Summary of that exploration:

`;
const BRANCH_SUMMARY_PROMPT = `Create a structured summary of this conversation branch for context when returning later.

Use this EXACT format:

## Goal
[What was the user trying to accomplish in this branch?]

## Constraints & Preferences
- [Any constraints, preferences, or requirements mentioned]
- [Or "(none)" if none were mentioned]

## Progress
### Done
- [x] [Completed tasks/changes]

### In Progress
- [ ] [Work that was started but not finished]

### Blocked
- [Issues preventing progress, if any]

## Key Decisions
- **[Decision]**: [Brief rationale]

## Next Steps
1. [What should happen next to continue this work]

Keep each section concise. Preserve exact file paths, function names, and error messages.`;
/** Generate a summary for abandoned branch entries. */
async function generateBranchSummary(entries, options) {
	const { model, apiKey, headers, signal, customInstructions, replaceInstructions, reserveTokens = 16384 } = options;
	const contextWindow = model.contextWindow || 128e3;
	const maxSummaryOutputTokens = Math.min(2048, Math.max(1, Math.floor(contextWindow / 4)), model.maxTokens > 0 ? model.maxTokens : 2048);
	const usableReserveTokens = reserveTokens < contextWindow ? reserveTokens : Math.floor(contextWindow / 2);
	const { messages, fileOps } = prepareBranchEntries(entries, Math.max(1, contextWindow - Math.max(maxSummaryOutputTokens, usableReserveTokens)));
	if (messages.length === 0) return ok({
		summary: "No content to summarize",
		readFiles: [],
		modifiedFiles: []
	});
	const conversationText = serializeConversation(convertToLlm(messages));
	let instructions;
	if (replaceInstructions && customInstructions) instructions = customInstructions;
	else if (customInstructions) instructions = `${BRANCH_SUMMARY_PROMPT}\n\nAdditional focus: ${customInstructions}`;
	else instructions = BRANCH_SUMMARY_PROMPT;
	const context = {
		systemPrompt: SUMMARIZATION_SYSTEM_PROMPT,
		messages: [{
			role: "user",
			content: [{
				type: "text",
				text: `<conversation>\n${conversationText}\n</conversation>\n\n${instructions}`
			}],
			timestamp: Date.now()
		}]
	};
	const streamOptions = {
		apiKey,
		headers,
		signal,
		maxTokens: maxSummaryOutputTokens
	};
	const response = options.streamFn ? await (await options.streamFn(model, context, streamOptions)).result() : await resolveAgentCoreCompleteFn(options.runtime)(model, context, streamOptions);
	if (response.stopReason === "aborted") return err(new BranchSummaryError("aborted", response.errorMessage || "Branch summary aborted"));
	if (response.stopReason === "error") return err(new BranchSummaryError("summarization_failed", `Branch summary failed: ${response.errorMessage || "Unknown error"}`));
	const summaryText = extractSummaryText(response);
	if (summaryText === void 0) return err(new BranchSummaryError("summarization_failed", "Branch summary failed: model returned no summary text"));
	let summary = BRANCH_SUMMARY_PREAMBLE + summaryText;
	const { readFiles, modifiedFiles } = computeFileLists(fileOps);
	summary += formatFileOperations(readFiles, modifiedFiles);
	return ok({
		summary,
		readFiles,
		modifiedFiles
	});
}
//#endregion
//#region packages/agent-core/src/harness/utils/truncate.ts
const DEFAULT_MAX_LINES = 2e3;
const DEFAULT_MAX_BYTES = 50 * 1024;
const runtimeBuffer = globalThis.Buffer;
function splitLinesForCounting(content) {
	if (content.length === 0) return [];
	const lines = content.split("\n");
	if (content.endsWith("\n")) lines.pop();
	return lines;
}
function findFirstNonAscii(content) {
	for (let index = 0; index < content.length; index++) if (content.charCodeAt(index) > 127) return index;
	return -1;
}
function utf8ByteLength(content) {
	if (runtimeBuffer) return runtimeBuffer.byteLength(content, "utf8");
	const firstNonAscii = findFirstNonAscii(content);
	if (firstNonAscii === -1) return content.length;
	let bytes = firstNonAscii;
	for (let i = firstNonAscii; i < content.length; i++) {
		const code = content.charCodeAt(i);
		if (code <= 127) bytes += 1;
		else if (code <= 2047) bytes += 2;
		else if (code >= 55296 && code <= 56319 && i + 1 < content.length) {
			const next = content.charCodeAt(i + 1);
			if (next >= 56320 && next <= 57343) {
				bytes += 4;
				i++;
			} else bytes += 3;
		} else bytes += 3;
	}
	return bytes;
}
function replaceUnpairedSurrogates(content) {
	let output = "";
	for (let i = 0; i < content.length; i++) {
		const code = content.charCodeAt(i);
		if (code >= 55296 && code <= 56319) {
			if (i + 1 < content.length) {
				const next = content.charCodeAt(i + 1);
				if (next >= 56320 && next <= 57343) {
					output += content.charAt(i) + content.charAt(i + 1);
					i++;
					continue;
				}
			}
			output += "�";
		} else if (code >= 56320 && code <= 57343) output += "�";
		else output += content.charAt(i);
	}
	return output;
}
/**
* Format byte counts for compact tool-output diagnostics.
*/
function formatSize(bytes) {
	if (bytes < 1024) return `${bytes}B`;
	else if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}
function resolveTruncationInput(content, options) {
	const maxLines = options.maxLines ?? 2e3;
	const maxBytes = options.maxBytes ?? 51200;
	const totalBytes = utf8ByteLength(content);
	const lines = splitLinesForCounting(content);
	return {
		lines,
		totalLines: lines.length,
		totalBytes,
		maxLines,
		maxBytes
	};
}
function buildTruncationResult(input, params) {
	return {
		content: params.content,
		truncated: params.truncated,
		truncatedBy: params.truncatedBy,
		totalLines: input.totalLines,
		totalBytes: input.totalBytes,
		outputLines: params.outputLines,
		outputBytes: params.outputBytes ?? utf8ByteLength(params.content),
		lastLinePartial: params.lastLinePartial ?? false,
		firstLineExceedsLimit: params.firstLineExceedsLimit ?? false,
		maxLines: input.maxLines,
		maxBytes: input.maxBytes
	};
}
/**
* Keep the beginning of content while respecting independent line and byte ceilings.
*
* Head truncation preserves complete lines; a first line that exceeds the byte
* ceiling produces empty output and sets firstLineExceedsLimit.
*/
function truncateHead(content, options = {}) {
	const input = resolveTruncationInput(content, options);
	if (input.totalLines <= input.maxLines && input.totalBytes <= input.maxBytes) return buildTruncationResult(input, {
		content,
		truncated: false,
		truncatedBy: null,
		outputLines: input.totalLines,
		outputBytes: input.totalBytes
	});
	const firstLine = input.lines[0];
	if (firstLine !== void 0 && utf8ByteLength(firstLine) > input.maxBytes) return buildTruncationResult(input, {
		content: "",
		truncated: true,
		truncatedBy: "bytes",
		outputLines: 0,
		outputBytes: 0,
		firstLineExceedsLimit: true
	});
	const outputLinesArr = [];
	let outputBytesCount = 0;
	let truncatedBy = input.totalLines > input.maxLines ? "lines" : "bytes";
	for (const [i, line] of input.lines.slice(0, input.maxLines).entries()) {
		const lineBytes = utf8ByteLength(line) + (i > 0 ? 1 : 0);
		if (outputBytesCount + lineBytes > input.maxBytes) {
			truncatedBy = "bytes";
			break;
		}
		outputLinesArr.push(line);
		outputBytesCount += lineBytes;
	}
	if (input.totalLines > input.maxLines && outputLinesArr.length >= input.maxLines && outputBytesCount <= input.maxBytes) truncatedBy = "lines";
	return buildTruncationResult(input, {
		content: outputLinesArr.join("\n"),
		truncated: true,
		truncatedBy,
		outputLines: outputLinesArr.length
	});
}
/**
* Keep the end of content while respecting independent line and byte ceilings.
*
* Tail truncation preserves recent output for command errors and may keep a
* partial first line when one final line alone exceeds the byte ceiling.
*/
function truncateTail(content, options = {}) {
	const input = resolveTruncationInput(content, options);
	if (input.totalLines <= input.maxLines && input.totalBytes <= input.maxBytes) return buildTruncationResult(input, {
		content,
		truncated: false,
		truncatedBy: null,
		outputLines: input.totalLines,
		outputBytes: input.totalBytes
	});
	const outputLinesArr = [];
	let outputBytesCount = 0;
	let truncatedBy = input.totalLines > input.maxLines ? "lines" : "bytes";
	let lastLinePartial = false;
	for (let i = input.lines.length - 1; i >= 0 && outputLinesArr.length < input.maxLines; i--) {
		const line = input.lines.at(i);
		if (line === void 0) continue;
		const lineBytes = utf8ByteLength(line) + (outputLinesArr.length > 0 ? 1 : 0);
		if (outputBytesCount + lineBytes > input.maxBytes) {
			truncatedBy = "bytes";
			if (outputLinesArr.length === 0) {
				const truncatedLine = truncateStringToBytesFromEnd(line, input.maxBytes);
				outputLinesArr.unshift(truncatedLine);
				outputBytesCount = utf8ByteLength(truncatedLine);
				lastLinePartial = true;
			}
			break;
		}
		outputLinesArr.unshift(line);
		outputBytesCount += lineBytes;
	}
	if (input.totalLines > input.maxLines && outputLinesArr.length >= input.maxLines && outputBytesCount <= input.maxBytes) truncatedBy = "lines";
	return buildTruncationResult(input, {
		content: outputLinesArr.join("\n"),
		truncated: true,
		truncatedBy,
		outputLines: outputLinesArr.length,
		lastLinePartial
	});
}
/**
* Truncate a string to fit within a byte limit (from the end).
* Handles multi-byte UTF-8 characters correctly.
*/
function truncateStringToBytesFromEnd(str, maxBytes) {
	if (maxBytes <= 0) return "";
	let outputBytes = 0;
	let start = str.length;
	let needsReplacement = false;
	for (let i = str.length; i > 0;) {
		let characterStart = i - 1;
		const code = str.charCodeAt(characterStart);
		let characterBytes;
		let unpairedSurrogate = false;
		if (code >= 56320 && code <= 57343 && characterStart > 0) {
			const previous = str.charCodeAt(characterStart - 1);
			if (previous >= 55296 && previous <= 56319) {
				characterStart--;
				characterBytes = 4;
			} else {
				characterBytes = 3;
				unpairedSurrogate = true;
			}
		} else if (code >= 55296 && code <= 57343) {
			characterBytes = 3;
			unpairedSurrogate = true;
		} else characterBytes = code <= 127 ? 1 : code <= 2047 ? 2 : 3;
		if (outputBytes + characterBytes > maxBytes) break;
		outputBytes += characterBytes;
		start = characterStart;
		needsReplacement ||= unpairedSurrogate;
		i = characterStart;
	}
	const output = str.slice(start);
	return needsReplacement ? replaceUnpairedSurrogates(output) : output;
}
/**
* Trim a single display line and mark it with the grep-style truncation suffix.
*
* The cut point is backed off by one code unit when it would otherwise split a
* surrogate pair, so emoji / CJK Extension B characters crossing the boundary
* stay intact instead of rendering as replacement characters.
*/
function truncateLine(line, maxChars = 500) {
	if (line.length <= maxChars) return {
		text: line,
		wasTruncated: false
	};
	let cut = maxChars;
	if (cut < line.length) {
		const lastCode = line.charCodeAt(cut - 1);
		if (lastCode >= 55296 && lastCode <= 56319) {
			const nextCode = line.charCodeAt(cut);
			if (nextCode >= 56320 && nextCode <= 57343) cut -= 1;
		}
	}
	return {
		text: `${line.slice(0, cut)}... [truncated]`,
		wasTruncated: true
	};
}
//#endregion
//#region src/agents/runtime/proxy.ts
/**
* Proxy stream function for apps that route LLM calls through a server.
* The server manages auth and proxies requests to LLM providers.
*/
const PROXY_ERROR_BODY_MAX_BYTES = 16 * 1024 * 1024;
const PROXY_SSE_STREAM_MAX_BYTES = 16 * 1024 * 1024;
const PROXY_SSE_PENDING_BUFFER_MAX_BYTES = PROXY_SSE_STREAM_MAX_BYTES;
const PROXY_SSE_READ_IDLE_TIMEOUT_MS = 12e4;
var ProxyMessageEventStream = class extends event_stream_exports.EventStream {
	constructor() {
		super((event) => event.type === "done" || event.type === "error", (event) => {
			if (event.type === "done") return event.message;
			if (event.type === "error") return event.error;
			throw new Error("Unexpected event type");
		});
	}
};
/**
* Stream function that proxies through a server instead of calling LLM providers directly.
* The server strips the partial field from delta events to reduce bandwidth.
* We reconstruct the partial message client-side.
*
* Use this as the `streamFn` option when creating an Agent that needs to go through a proxy.
*
* @example
* ```typescript
* const agent = new Agent({
*   streamFn: (model, context, options) =>
*     streamProxy(model, context, {
*       ...options,
*       authToken: await getAuthToken(),
*       proxyUrl: "https://genai.example.com",
*     }),
* });
* ```
*/
function buildProxyRequestOptions(options) {
	return {
		temperature: options.temperature,
		maxTokens: options.maxTokens,
		reasoning: options.reasoning,
		cacheRetention: options.cacheRetention,
		sessionId: options.sessionId,
		promptCacheKey: options.promptCacheKey,
		metadata: options.metadata,
		transport: options.transport,
		thinkingBudgets: options.thinkingBudgets,
		maxRetryDelayMs: options.maxRetryDelayMs,
		timeoutMs: options.timeoutMs
	};
}
function sanitizeProxyModel(model) {
	const { headers: _headers, ...safeModel } = model;
	return safeModel;
}
function resolveProxyReadIdleTimeoutMs(timeoutMs) {
	return resolvePositiveTimerTimeoutMs(timeoutMs, PROXY_SSE_READ_IDLE_TIMEOUT_MS);
}
function createProxyRequestTimeoutError(timeoutMs) {
	const error = /* @__PURE__ */ new Error(`Proxy request timed out after ${timeoutMs}ms`);
	error.name = "TimeoutError";
	return error;
}
function buildProxyRequestAbort(callerSignal, timeoutMs) {
	const timeoutController = new AbortController();
	const timeoutId = setTimeout(() => {
		timeoutController.abort(createProxyRequestTimeoutError(timeoutMs));
	}, timeoutMs);
	return {
		signal: callerSignal ? AbortSignal.any([callerSignal, timeoutController.signal]) : timeoutController.signal,
		clear: () => {
			clearTimeout(timeoutId);
		}
	};
}
function isProxyRequestTimeoutError(params) {
	if (params.callerSignal?.aborted || !params.requestSignal.aborted) return false;
	if (!(params.error instanceof Error)) return false;
	return params.error.name === "AbortError" || params.error.name === "TimeoutError" || params.error.message === "Request was aborted";
}
async function readProxyErrorData(response, readIdleTimeoutMs) {
	const bytes = await readResponseWithLimit(response, PROXY_ERROR_BODY_MAX_BYTES, {
		onOverflow: ({ maxBytes }) => /* @__PURE__ */ new Error(`Proxy error body exceeded ${maxBytes} bytes`),
		chunkTimeoutMs: readIdleTimeoutMs,
		onIdleTimeout: ({ chunkTimeoutMs }) => /* @__PURE__ */ new Error(`Proxy error body stalled: no data received for ${chunkTimeoutMs}ms`)
	});
	return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
}
async function readProxySseChunk(reader, readIdleTimeoutMs) {
	let timeoutId;
	let timedOut = false;
	return await new Promise((resolve, reject) => {
		const timeoutError = /* @__PURE__ */ new Error(`Proxy SSE stream stalled: no data received for ${readIdleTimeoutMs}ms`);
		timeoutId = setTimeout(() => {
			timedOut = true;
			reader.cancel(timeoutError);
			reject(timeoutError);
		}, readIdleTimeoutMs);
		reader.read().then((result) => {
			if (timeoutId !== void 0) clearTimeout(timeoutId);
			if (!timedOut) resolve(result);
		}, (error) => {
			if (timeoutId !== void 0) clearTimeout(timeoutId);
			if (!timedOut) reject(error instanceof Error ? error : new Error(String(error)));
		});
	});
}
function assertProxySsePendingBufferWithinLimit(buffer, reader) {
	if (new TextEncoder().encode(buffer).byteLength <= PROXY_SSE_PENDING_BUFFER_MAX_BYTES) return;
	const error = /* @__PURE__ */ new Error(`Proxy SSE pending buffer exceeded ${PROXY_SSE_PENDING_BUFFER_MAX_BYTES} bytes`);
	reader.cancel(error).catch(() => void 0);
	throw error;
}
function streamProxy(model, context, options) {
	const stream = new ProxyMessageEventStream();
	(async () => {
		const partial = {
			role: "assistant",
			stopReason: "stop",
			content: [],
			api: model.api,
			provider: model.provider,
			model: model.id,
			usage: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0,
				totalTokens: 0,
				cost: {
					input: 0,
					output: 0,
					cacheRead: 0,
					cacheWrite: 0,
					total: 0
				}
			},
			timestamp: Date.now()
		};
		let reader;
		const readIdleTimeoutMs = resolveProxyReadIdleTimeoutMs(options.timeoutMs);
		const abortHandler = () => {
			if (reader) reader.cancel("Request aborted by user").catch(() => {});
		};
		if (options.signal) options.signal.addEventListener("abort", abortHandler);
		try {
			const requestAbort = buildProxyRequestAbort(options.signal, readIdleTimeoutMs);
			const response = await fetch(`${options.proxyUrl}/api/stream`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${options.authToken}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					model: sanitizeProxyModel(model),
					context,
					options: buildProxyRequestOptions(options)
				}),
				signal: requestAbort.signal
			}).catch((error) => {
				if (isProxyRequestTimeoutError({
					error,
					callerSignal: options.signal,
					requestSignal: requestAbort.signal
				})) throw new Error(`Proxy request timed out after ${readIdleTimeoutMs}ms`, { cause: error instanceof Error ? error : void 0 });
				throw error;
			}).finally(() => {
				requestAbort.clear();
			});
			if (!response.ok) {
				let errorMessage = `Proxy error: ${response.status} ${response.statusText}`;
				try {
					const errorData = await readProxyErrorData(response, readIdleTimeoutMs);
					if (errorData?.error) errorMessage = `Proxy error: ${errorData.error}`;
				} catch (error) {
					if (error instanceof Error && error.message.startsWith("Proxy error body")) throw error;
				}
				throw new Error(errorMessage);
			}
			reader = response.body.getReader();
			const sseReader = createSseByteGuard(reader, {
				maxBytes: PROXY_SSE_STREAM_MAX_BYTES,
				onOverflow: ({ maxBytes }) => /* @__PURE__ */ new Error(`Proxy SSE stream exceeded ${maxBytes} bytes`)
			});
			const decoder = new TextDecoder();
			let buffer = "";
			let terminalEventSeen = false;
			const processSseLine = (line) => {
				if (!line.startsWith("data: ")) return;
				const data = line.slice(6).trim();
				if (!data) return;
				const event = processProxyEvent(JSON.parse(data), partial);
				if (!event) return;
				terminalEventSeen = event.type === "done" || event.type === "error";
				stream.push(event);
			};
			while (true) {
				const { done, value } = await readProxySseChunk(sseReader, readIdleTimeoutMs);
				if (done) break;
				if (options.signal?.aborted) throw new Error("Request aborted by user");
				buffer += decoder.decode(value, { stream: true });
				const lines = buffer.split("\n");
				buffer = lines.pop() || "";
				assertProxySsePendingBufferWithinLimit(buffer, reader);
				for (const line of lines) processSseLine(line);
			}
			if (options.signal?.aborted) throw new Error("Request aborted by user");
			buffer += decoder.decode();
			if (buffer.trim()) processSseLine(buffer);
			if (!terminalEventSeen) throw new Error("Proxy stream ended before terminal event");
			stream.end();
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			const reason = options.signal?.aborted ? "aborted" : "error";
			partial.stopReason = reason;
			partial.errorMessage = errorMessage;
			stream.push({
				type: "error",
				reason,
				error: partial
			});
			stream.end();
		} finally {
			try {
				reader?.releaseLock();
			} catch {}
			if (options.signal) options.signal.removeEventListener("abort", abortHandler);
		}
	})();
	return stream;
}
/**
* Process a proxy event and update the partial message.
*/
function processProxyEvent(proxyEvent, partial) {
	switch (proxyEvent.type) {
		case "start": return {
			type: "start",
			partial
		};
		case "text_start":
			partial.content[proxyEvent.contentIndex] = {
				type: "text",
				text: "",
				...proxyEvent.contentSignature !== void 0 ? { textSignature: proxyEvent.contentSignature } : {}
			};
			return {
				type: "text_start",
				contentIndex: proxyEvent.contentIndex,
				partial
			};
		case "text_delta": {
			const content = partial.content[proxyEvent.contentIndex];
			if (content?.type === "text") {
				content.text += proxyEvent.delta;
				return {
					type: "text_delta",
					contentIndex: proxyEvent.contentIndex,
					delta: proxyEvent.delta,
					partial
				};
			}
			throw new Error("Received text_delta for non-text content");
		}
		case "text_end": {
			const content = partial.content[proxyEvent.contentIndex];
			if (content?.type === "text") {
				if (proxyEvent.contentSignature !== void 0) content.textSignature = proxyEvent.contentSignature;
				return {
					type: "text_end",
					contentIndex: proxyEvent.contentIndex,
					content: content.text,
					partial
				};
			}
			throw new Error("Received text_end for non-text content");
		}
		case "thinking_start":
			partial.content[proxyEvent.contentIndex] = {
				type: "thinking",
				thinking: ""
			};
			return {
				type: "thinking_start",
				contentIndex: proxyEvent.contentIndex,
				partial
			};
		case "thinking_delta": {
			const content = partial.content[proxyEvent.contentIndex];
			if (content?.type === "thinking") {
				content.thinking += proxyEvent.delta;
				return {
					type: "thinking_delta",
					contentIndex: proxyEvent.contentIndex,
					delta: proxyEvent.delta,
					partial
				};
			}
			throw new Error("Received thinking_delta for non-thinking content");
		}
		case "thinking_end": {
			const content = partial.content[proxyEvent.contentIndex];
			if (content?.type === "thinking") {
				content.thinkingSignature = proxyEvent.contentSignature;
				return {
					type: "thinking_end",
					contentIndex: proxyEvent.contentIndex,
					content: content.thinking,
					partial
				};
			}
			throw new Error("Received thinking_end for non-thinking content");
		}
		case "toolcall_start":
			partial.content[proxyEvent.contentIndex] = {
				type: "toolCall",
				id: proxyEvent.id,
				name: proxyEvent.toolName,
				arguments: {},
				partialJson: ""
			};
			return {
				type: "toolcall_start",
				contentIndex: proxyEvent.contentIndex,
				partial
			};
		case "toolcall_delta": {
			const content = partial.content[proxyEvent.contentIndex];
			if (content?.type === "toolCall") {
				const streamingContent = content;
				streamingContent.partialJson = `${streamingContent.partialJson ?? ""}${proxyEvent.delta}`;
				content.arguments = parseStreamingJson(streamingContent.partialJson) || {};
				partial.content[proxyEvent.contentIndex] = { ...content };
				return {
					type: "toolcall_delta",
					contentIndex: proxyEvent.contentIndex,
					delta: proxyEvent.delta,
					partial
				};
			}
			throw new Error("Received toolcall_delta for non-toolCall content");
		}
		case "toolcall_end": {
			const content = partial.content[proxyEvent.contentIndex];
			if (content?.type === "toolCall") {
				delete content.partialJson;
				return {
					type: "toolcall_end",
					contentIndex: proxyEvent.contentIndex,
					toolCall: content,
					partial
				};
			}
			return;
		}
		case "done":
			partial.stopReason = proxyEvent.reason;
			partial.usage = proxyEvent.usage;
			return {
				type: "done",
				reason: proxyEvent.reason,
				message: partial
			};
		case "error":
			partial.stopReason = proxyEvent.reason;
			partial.errorMessage = proxyEvent.errorMessage;
			partial.usage = proxyEvent.usage;
			return {
				type: "error",
				reason: proxyEvent.reason,
				error: partial
			};
		default:
			console.warn(`Unhandled proxy event type: ${proxyEvent.type}`);
			return;
	}
}
//#endregion
//#region src/plugin-sdk/agent-core.ts
/** Runtime adapter that lets the package agent-core use OpenClaw LLM helpers. */
const openClawAgentCoreRuntime = {
	completeSimple,
	streamSimple
};
/** Agent-core class preconfigured with OpenClaw runtime dependencies. */
var Agent = class extends Agent$1 {
	constructor(options = {}) {
		super({
			runtime: openClawAgentCoreRuntime,
			...options
		});
	}
};
//#endregion
export { substituteArgs as A, prepareCompaction as C, InvalidSummaryOutputError as D, CompactionError as E, bashExecutionToText as F, convertToLlm as I, runAgentLoop as L, BRANCH_SUMMARY_SUFFIX as M, COMPACTION_SUMMARY_PREFIX as N, buildSessionContext as O, COMPACTION_SUMMARY_SUFFIX as P, getAgentToolExecutionContext as R, getLastAssistantUsage as S, serializeConversation as T, estimateContextTokens as _, DEFAULT_MAX_LINES as a, findTurnStartIndex as b, truncateLine as c, generateBranchSummary as d, prepareBranchEntries as f, compact as g, calculateContextTokens as h, DEFAULT_MAX_BYTES as i, BRANCH_SUMMARY_PREFIX as j, parseCommandArgs as k, truncateTail as l, IMAGE_BLOCK_TOKENS as m, openClawAgentCoreRuntime as n, formatSize as o, DEFAULT_COMPACTION_SETTINGS as p, streamProxy as r, truncateHead as s, Agent as t, collectEntriesForBranchSummaryFromBranches as u, estimateTokens as v, shouldCompact as w, generateSummary as x, findCutPoint as y, uuidv7 as z };
