import { i as loadBundledPluginPublicSurfaceModuleSyncCore } from "./facade-loader-DJLnNwdN.js";
import { t as truncateUtf8Prefix } from "./utf8-truncate-Dro7v_iB.js";
import { p as WORKER_SESSION_TOOL_MAX_TEXT_LENGTH } from "./worker-admission-R0mXKdG7.js";
import { t as WORKER_INFERENCE_MAX_CONTEXT_MESSAGES } from "./worker-inference-DaOiVsCq.js";
import { X as SettingsManager, at as ModelRegistry, gt as AuthStorage, r as DefaultResourceLoader, t as createAgentSession } from "./sessions-BHNzcBA2.js";
import { t as SessionManager } from "./session-manager-2mjIFFdj.js";
import { b as loadWorkspaceBootstrapFiles, t as DEFAULT_AGENTS_FILENAME } from "./workspace-Bhf9rmeb.js";
import { t as getProcessSupervisor } from "./supervisor-By4LUnR5.js";
import { u as wrapToolWithGatewayCallerIdentity } from "./gateway-IvUFCG_L.js";
import { n as buildBootstrapContextForFiles } from "./bootstrap-files-BWOevwpV.js";
import { t as guardSessionManager } from "./session-tool-result-guard-wrapper-0HUuZwQy.js";
import { t as redactAgentDiagnosticPayload } from "./diagnostic-redaction-BaYiZsI1.js";
import { a as toToolDefinitions } from "./agent-tool-definition-adapter-BfoUleFa.js";
import { a as finalizeAgentTools, i as isApplyPatchAllowedForModel, t as createCoreCodingTools } from "./core-coding-tools-iN7ispLx.js";
import { t as resolveToolLoopDetectionConfig } from "./tool-loop-detection-config-BebVSdcS.js";
import { n as createNativeModelOwnedRuntimeModel } from "./setup-DNH-OYeh.js";
import { i as WORKER_TOOL_NAMES, n as WORKER_REQUIRED_LOCAL_TOOL_NAMES, r as WORKER_SESSION_TOOL_NAMES, t as WORKER_LOCAL_TOOL_NAMES } from "./tool-authority-DJXVjqm0.js";
import { i as isWorkerTranscriptMessageFrameSafe, n as cloneImageContent, o as toWorkerTranscriptMessage, r as cloneTextContent, t as WORKER_PROVIDER_REPLAY_LOCAL_RETRY_MESSAGE } from "./transcript-message-CAkPZKyT.js";
import { t as windowWorkerReplayMessages } from "./replay-message-window-Bq8t8hQh.js";
import { execFile } from "node:child_process";
import { Type } from "typebox";
//#region src/worker/browser-runtime.ts
/** Core-private adapter for the bundled Browser plugin's attached worker runtime. */
const WORKER_BROWSER_LAUNCH_TIMEOUT_MS = 3e4;
const WORKER_BROWSER_LAUNCH_OUTPUT_LIMIT_BYTES = 64 * 1024;
function runWorkerBrowserLauncher(launcherPath) {
	return new Promise((resolve, reject) => {
		execFile(launcherPath, [], {
			timeout: WORKER_BROWSER_LAUNCH_TIMEOUT_MS,
			maxBuffer: WORKER_BROWSER_LAUNCH_OUTPUT_LIMIT_BYTES,
			windowsHide: true
		}, (error) => {
			if (error) {
				reject(new Error(`Worker Browser launcher failed: ${error.message}`, { cause: error }));
				return;
			}
			resolve();
		});
	});
}
/** Materialize the exact bundled Browser runtime; no descriptor-controlled plugin path is used. */
async function createWorkerBrowserToolRuntime(params) {
	return await loadBundledPluginPublicSurfaceModuleSyncCore({
		dirName: "browser",
		artifactBasename: "runtime-api.js",
		trackedPluginId: "browser"
	}).createAttachedBrowserToolRuntime({
		cdpUrl: params.descriptor.cdpUrl,
		ensureAttachTarget: async () => await runWorkerBrowserLauncher(params.descriptor.launcherPath),
		agentSessionKey: params.sessionKey,
		agentDir: params.stateDir,
		workspaceDir: params.workspaceDir
	});
}
//#endregion
//#region src/worker/embedded-agent-live.runtime.ts
const MAX_LIVE_EVENT_BYTES = 32 * 1024;
const MAX_LIVE_PREVIEW_BYTES = 4 * 1024;
function liveEventBytes(event) {
	try {
		return Buffer.byteLength(JSON.stringify(event), "utf8");
	} catch {
		return Number.POSITIVE_INFINITY;
	}
}
function truncateLiveText(value) {
	if (Buffer.byteLength(value, "utf8") <= MAX_LIVE_PREVIEW_BYTES) return value;
	const suffix = "…";
	return `${truncateUtf8Prefix(value, MAX_LIVE_PREVIEW_BYTES - Buffer.byteLength(suffix, "utf8"))}${suffix}`;
}
function boundLiveValue(value) {
	try {
		const serialized = JSON.stringify(value);
		if (serialized === void 0) return null;
		if (Buffer.byteLength(serialized, "utf8") <= MAX_LIVE_PREVIEW_BYTES) return value;
		return {
			truncated: true,
			preview: truncateLiveText(serialized)
		};
	} catch {
		return {
			truncated: true,
			preview: "[unserializable live payload]"
		};
	}
}
function redactLiveText(value) {
	const redacted = redactAgentDiagnosticPayload(value);
	return truncateLiveText(typeof redacted === "string" ? redacted : "[unreadable diagnostic text]");
}
function boundLiveEvent(event) {
	if (liveEventBytes(event) <= MAX_LIVE_EVENT_BYTES) return event;
	let bounded;
	if (event.kind === "assistant") {
		const text = truncateLiveText(event.payload.text);
		bounded = {
			kind: "assistant",
			payload: {
				...event.payload,
				text,
				delta: text,
				replace: true
			}
		};
	} else if (event.kind === "thinking") bounded = {
		kind: "thinking",
		payload: {
			text: truncateLiveText(event.payload.text),
			delta: truncateLiveText(event.payload.delta)
		}
	};
	else if (event.kind === "tool") if (event.payload.phase === "start") bounded = {
		kind: "tool",
		payload: {
			...event.payload,
			args: boundLiveValue(event.payload.args)
		}
	};
	else if (event.payload.phase === "update") bounded = {
		kind: "tool",
		payload: {
			...event.payload,
			partialResult: boundLiveValue(event.payload.partialResult)
		}
	};
	else bounded = {
		kind: "tool",
		payload: {
			...event.payload,
			result: boundLiveValue(event.payload.result)
		}
	};
	else if (event.kind === "lifecycle" && event.payload.phase === "error") bounded = {
		kind: "lifecycle",
		payload: {
			...event.payload,
			error: truncateLiveText(event.payload.error)
		}
	};
	else throw new Error(`worker live ${event.kind} event exceeds the protocol payload limit`);
	if (liveEventBytes(bounded) > MAX_LIVE_EVENT_BYTES) throw new Error(`worker live ${event.kind} event cannot fit the protocol payload limit`);
	return bounded;
}
function readAssistantText(message) {
	if (message.role !== "assistant") return "";
	return message.content.filter((part) => part.type === "text").map((part) => part.text).join("");
}
function readAssistantThinking(message) {
	if (message.role !== "assistant") return "";
	return message.content.filter((part) => part.type === "thinking").map((part) => part.thinking).join("");
}
function createWorkerLiveRuntime(client) {
	let previewEnabled = true;
	const enqueueLive = (event) => {
		if (previewEnabled) previewEnabled = client.enqueuePreview(boundLiveEvent(event));
	};
	const startedAt = Date.now();
	let lifecycleFinished = false;
	let terminalLiveEvent;
	let streamedText = "";
	let streamedThinking = "";
	const handleSessionEvent = (event) => {
		if (event.type === "agent_start") {
			enqueueLive({
				kind: "lifecycle",
				payload: {
					phase: "start",
					startedAt
				}
			});
			return;
		}
		if (event.type === "message_start" && event.message.role === "assistant") {
			streamedText = "";
			streamedThinking = "";
			return;
		}
		if (event.type === "message_update") {
			if (event.assistantMessageEvent.type === "text_delta") {
				streamedText = readAssistantText(event.message);
				enqueueLive({
					kind: "assistant",
					payload: {
						text: streamedText,
						delta: event.assistantMessageEvent.delta
					}
				});
			} else if (event.assistantMessageEvent.type === "thinking_delta") {
				streamedThinking = readAssistantThinking(event.message);
				enqueueLive({
					kind: "thinking",
					payload: {
						text: streamedThinking,
						delta: event.assistantMessageEvent.delta
					}
				});
			}
			return;
		}
		if (event.type === "message_end" && event.message.role === "assistant") {
			const finalText = readAssistantText(event.message);
			if (finalText !== streamedText) enqueueLive({
				kind: "assistant",
				payload: {
					text: finalText,
					delta: finalText,
					replace: true
				}
			});
			const finalThinking = readAssistantThinking(event.message);
			if (finalThinking !== streamedThinking) enqueueLive({
				kind: "thinking",
				payload: {
					text: finalThinking,
					delta: finalThinking
				}
			});
			return;
		}
		if (event.type === "tool_execution_start") {
			enqueueLive({
				kind: "tool",
				payload: {
					phase: "start",
					name: event.toolName,
					toolCallId: event.toolCallId,
					args: redactAgentDiagnosticPayload(event.args),
					...event.hideFromChannelProgress ? { hideFromChannelProgress: true } : {}
				}
			});
			return;
		}
		if (event.type === "tool_execution_update") {
			enqueueLive({
				kind: "tool",
				payload: {
					phase: "update",
					name: event.toolName,
					toolCallId: event.toolCallId,
					partialResult: redactAgentDiagnosticPayload(event.partialResult),
					...event.hideFromChannelProgress ? { hideFromChannelProgress: true } : {}
				}
			});
			return;
		}
		if (event.type === "tool_execution_end") {
			enqueueLive({
				kind: "tool",
				payload: {
					phase: "result",
					name: event.toolName,
					toolCallId: event.toolCallId,
					isError: event.isError,
					result: redactAgentDiagnosticPayload(event.result),
					...event.hideFromChannelProgress ? { hideFromChannelProgress: true } : {}
				}
			});
			return;
		}
		if (event.type === "agent_end") {
			lifecycleFinished = true;
			const lastAssistant = event.messages.findLast((message) => message.role === "assistant");
			terminalLiveEvent = {
				kind: "lifecycle",
				payload: {
					phase: "finishing",
					startedAt,
					endedAt: Date.now(),
					...lastAssistant ? { stopReason: lastAssistant.stopReason } : {},
					...lastAssistant?.stopReason === "error" ? { error: redactLiveText(lastAssistant.errorMessage ?? "Worker inference failed.") } : {},
					...lastAssistant?.stopReason === "aborted" ? { aborted: true } : {}
				}
			};
		}
	};
	const enqueueRunFailure = (failure) => {
		if (lifecycleFinished) return;
		terminalLiveEvent = {
			kind: "lifecycle",
			payload: {
				phase: "finishing",
				startedAt,
				endedAt: Date.now(),
				...failure.aborted ? {
					stopReason: "aborted",
					aborted: true
				} : { error: redactLiveText(failure.error.message) }
			}
		};
	};
	const emitTerminal = async () => {
		if (!terminalLiveEvent) return;
		await client.emitTerminal(boundLiveEvent(terminalLiveEvent));
	};
	return {
		handleSessionEvent,
		enqueueRunFailure,
		emitTerminal
	};
}
//#endregion
//#region src/worker/embedded-agent-transcript.runtime.ts
function toAgentMessage(message) {
	if (message.role === "user") return {
		role: "user",
		content: message.content.map((part) => part.type === "text" ? cloneTextContent(part) : cloneImageContent(part)),
		timestamp: message.timestamp
	};
	if (message.role === "toolResult") return {
		role: "toolResult",
		toolCallId: message.toolCallId,
		toolName: message.toolName,
		content: message.content.map((part) => part.type === "text" ? cloneTextContent(part) : cloneImageContent(part)),
		...message.details === void 0 ? {} : { details: structuredClone(message.details) },
		isError: message.isError,
		timestamp: message.timestamp
	};
	return structuredClone(message);
}
function toWorkerInferenceMessage(message) {
	if (message.role === "user") return {
		kind: "complete",
		message: {
			role: "user",
			content: typeof message.content === "string" ? message.content : message.content.map((part) => part.type === "text" ? cloneTextContent(part) : cloneImageContent(part)),
			timestamp: message.timestamp,
			...message.runtimeContextCarrier ? { runtimeContextCarrier: true } : {}
		}
	};
	const projected = toWorkerTranscriptMessage(message, "inference");
	if (!projected) throw new Error(`Unsupported inference message role: ${message.role}`);
	return projected;
}
function toWorkerInferenceContext(context) {
	const windowed = windowWorkerReplayMessages(context.messages, WORKER_INFERENCE_MAX_CONTEXT_MESSAGES);
	if (windowed.kind === "provider-replay-unavailable") return windowed;
	const messages = [];
	for (const message of windowed.messages) {
		const projected = toWorkerInferenceMessage(message);
		if (projected.kind === "provider-replay-unavailable") return projected;
		messages.push(projected.message);
	}
	return {
		kind: "complete",
		context: {
			...context.systemPrompt === void 0 ? {} : { systemPrompt: context.systemPrompt },
			messages,
			...context.tools ? { tools: context.tools.map((tool) => ({
				name: tool.name,
				description: tool.description,
				parameters: structuredClone(tool.parameters)
			})) } : {}
		}
	};
}
function createWorkerTranscriptRuntime(client) {
	const pendingTranscriptMessages = [];
	const onMessagePersisted = (message) => {
		const projected = toWorkerTranscriptMessage(message, "transcript");
		if (!projected) return;
		if (projected.kind === "provider-replay-unavailable") throw new Error(`Worker transcript cannot persist authoritative provider replay: ${projected.details.reason}.`);
		if (!isWorkerTranscriptMessageFrameSafe(projected.message)) throw new Error("Worker transcript message exceeds the protocol payload limit.");
		pendingTranscriptMessages.push(projected.message);
	};
	const flushTranscript = async () => {
		while (pendingTranscriptMessages.length > 0) {
			const batch = pendingTranscriptMessages.slice(0, 64);
			await client.commit(batch);
			pendingTranscriptMessages.splice(0, batch.length);
		}
	};
	let sessionWriteQueue = Promise.resolve();
	const withSessionWriteSettlement = (operation) => {
		const result = sessionWriteQueue.then(async () => {
			const value = await operation();
			await flushTranscript();
			return value;
		});
		sessionWriteQueue = result.then(() => void 0, () => void 0);
		return result;
	};
	return {
		onMessagePersisted,
		withSessionWriteSettlement
	};
}
//#endregion
//#region src/worker/worker-session-tools.ts
function parseToolResult(frame) {
	if (!frame.ok) throw new Error(frame.error.message);
	let parsed;
	try {
		parsed = JSON.parse(frame.payload.resultJson);
	} catch (error) {
		throw new Error("Gateway returned an invalid worker session tool result", { cause: error });
	}
	if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.content)) throw new Error("Gateway returned an invalid worker session tool result");
	return parsed;
}
function createWorkerSessionTools(client) {
	return [{
		label: "Sessions",
		name: "sessions_spawn",
		description: "Spawn a visible cloud child session in a fresh managed worktree. The child inherits the current cloud placement profile and attenuated tool policy.",
		parameters: Type.Object({
			task: Type.String({
				minLength: 1,
				maxLength: WORKER_SESSION_TOOL_MAX_TEXT_LENGTH
			}),
			label: Type.Optional(Type.String({
				minLength: 1,
				maxLength: 256
			})),
			agentId: Type.Optional(Type.String({
				minLength: 1,
				maxLength: 256
			})),
			model: Type.Optional(Type.String({
				minLength: 1,
				maxLength: 256
			})),
			runTimeoutSeconds: Type.Optional(Type.Integer({
				minimum: 0,
				maximum: 86400
			}))
		}),
		execute: async (toolCallId, raw) => {
			const params = raw;
			return parseToolResult(await client.requestSessionsSpawn({
				toolCallId,
				...params
			}));
		}
	}, {
		label: "Session Send",
		name: "sessions_send",
		description: "Send a message to an authorized parent, child, or sibling cloud session. Cross-tree and stale-incarnation targets are denied by the Gateway.",
		parameters: Type.Object({
			sessionKey: Type.String({
				minLength: 1,
				maxLength: 1024
			}),
			message: Type.String({
				minLength: 1,
				maxLength: WORKER_SESSION_TOOL_MAX_TEXT_LENGTH
			}),
			timeoutSeconds: Type.Optional(Type.Integer({
				minimum: 0,
				maximum: 86400
			}))
		}),
		execute: async (toolCallId, raw) => {
			const params = raw;
			return parseToolResult(await client.requestSessionsSend({
				toolCallId,
				...params
			}));
		}
	}];
}
//#endregion
//#region src/worker/embedded-agent.runtime.ts
function toWorkerAgentError(value, fallback) {
	return value instanceof Error ? value : new Error(fallback, { cause: value });
}
const WORKER_TOOL_CONFIG = { plugins: { enabled: false } };
async function runWorkerEmbeddedTurn(params) {
	if (params.allowedToolNames.includes("browser") !== (params.browser !== void 0)) throw new Error("Worker Browser authority and launch descriptor must be provided together.");
	if (params.operationalRunInstance.runId !== params.runId) throw new Error("worker operational run instance disagrees with the admitted turn");
	const model = createNativeModelOwnedRuntimeModel({
		provider: params.modelRef.provider,
		modelId: params.modelRef.model
	});
	const authStorage = AuthStorage.inMemory({});
	const modelRegistry = ModelRegistry.inMemory(authStorage);
	const settingsManager = SettingsManager.inMemory({
		compaction: { enabled: false },
		retry: { enabled: false }
	});
	const contextFiles = buildBootstrapContextForFiles((await loadWorkspaceBootstrapFiles(params.cwd)).filter((file) => file.name === DEFAULT_AGENTS_FILENAME), {});
	const resourceLoader = new DefaultResourceLoader({
		cwd: params.cwd,
		agentDir: params.stateDir,
		settingsManager,
		noExtensions: true,
		noSkills: true,
		noPromptTemplates: true,
		noThemes: true,
		noContextFiles: true,
		...params.systemPrompt === void 0 ? {} : { appendSystemPrompt: [params.systemPrompt] },
		agentsFilesOverride: () => ({ agentsFiles: contextFiles })
	});
	await resourceLoader.reload();
	const baseSessionManager = SessionManager.inMemory(params.cwd);
	for (const message of params.initialMessages ?? []) baseSessionManager.appendMessage(toAgentMessage(message));
	const transcriptRuntime = createWorkerTranscriptRuntime(params.transcript);
	const sessionManager = guardSessionManager(baseSessionManager, {
		suppressNextUserMessagePersistence: params.suppressPromptTranscript,
		onMessagePersisted: transcriptRuntime.onMessagePersisted
	});
	const allowedToolNameSet = new Set(params.allowedToolNames);
	const activeToolNames = WORKER_TOOL_NAMES.filter((name) => allowedToolNameSet.has(name));
	const localToolNameSet = new Set(WORKER_LOCAL_TOOL_NAMES);
	const coreTools = createCoreCodingTools({
		codingRoot: params.cwd,
		includeBaseCodingTools: true,
		includeShellTools: true,
		workspaceOnly: false,
		modelContextWindowTokens: model.contextWindow,
		imageSanitization: {},
		applyPatchEnabled: isApplyPatchAllowedForModel({
			modelProvider: params.modelRef.provider,
			modelId: params.modelRef.model
		}),
		applyPatchWorkspaceOnly: true,
		execDefaults: {
			host: "gateway",
			security: "full",
			ask: "off",
			config: WORKER_TOOL_CONFIG,
			commandHighlighting: false,
			agentId: params.agentId,
			allowBackground: true,
			scopeKey: params.sessionKey,
			sessionKey: params.sessionKey,
			runId: params.runId,
			notifySessionKey: params.sessionKey,
			sessionId: params.sessionId,
			eventRouting: { preserveSessionKey: false }
		},
		processDefaults: { scopeKey: params.sessionKey }
	});
	const browserRuntime = params.browser ? await createWorkerBrowserToolRuntime({
		descriptor: params.browser,
		sessionKey: params.sessionKey,
		stateDir: params.stateDir,
		workspaceDir: params.cwd
	}) : void 0;
	const { session } = await (async () => {
		try {
			const localTools = finalizeAgentTools({
				tools: browserRuntime ? [...coreTools, browserRuntime.tool] : coreTools,
				modelProvider: params.modelRef.provider,
				modelId: params.modelRef.model,
				hookContext: {
					agentId: params.agentId,
					config: WORKER_TOOL_CONFIG,
					cwd: params.cwd,
					workspaceDir: params.cwd,
					sessionKey: params.sessionKey,
					sessionId: params.sessionId,
					runId: params.runId,
					requester: { senderIsOwner: true },
					loopDetection: resolveToolLoopDetectionConfig({
						cfg: WORKER_TOOL_CONFIG,
						agentId: params.agentId
					})
				},
				agentId: params.agentId
			}).filter((tool) => localToolNameSet.has(tool.name)).map((tool) => wrapToolWithGatewayCallerIdentity(tool, {
				agentId: params.agentId,
				sessionKey: params.sessionKey,
				operationalRunInstance: params.operationalRunInstance,
				signedAgentRuntimeIdentityToken: params.agentRuntimeIdentityToken
			}));
			const discoveredToolNames = new Set(localTools.map((tool) => tool.name));
			for (const toolName of WORKER_REQUIRED_LOCAL_TOOL_NAMES) if (!discoveredToolNames.has(toolName)) throw new Error(`Worker coding tool unavailable: ${toolName}`);
			if (WORKER_SESSION_TOOL_NAMES.filter((name) => allowedToolNameSet.has(name)).length > 0 && !params.sessions) throw new Error("Worker session tool client unavailable");
			const sessionTools = params.sessions ? createWorkerSessionTools(params.sessions).filter((tool) => allowedToolNameSet.has(tool.name)) : [];
			return await createAgentSession({
				cwd: params.cwd,
				agentDir: params.stateDir,
				authStorage,
				modelRegistry,
				model,
				thinkingLevel: "medium",
				tools: [...activeToolNames],
				customTools: toToolDefinitions([...localTools.filter((tool) => allowedToolNameSet.has(tool.name)), ...sessionTools]),
				noTools: "all",
				sessionManager,
				settingsManager,
				resourceLoader,
				withSessionWriteSettlement: transcriptRuntime.withSessionWriteSettlement
			});
		} catch (error) {
			await browserRuntime?.dispose();
			throw error;
		}
	})();
	session.agent.sessionId = params.sessionId;
	session.setActiveToolsByName([...activeToolNames]);
	session.agent.streamFn = (_model, context, options) => {
		const projected = toWorkerInferenceContext(context);
		if (projected.kind === "provider-replay-unavailable") throw new Error(`${WORKER_PROVIDER_REPLAY_LOCAL_RETRY_MESSAGE} (${projected.details.reason})`);
		return params.inference.stream({
			modelRef: params.modelRef,
			context: projected.context,
			options: structuredClone(params.inferenceOptions ?? {}),
			...options?.signal ? { signal: options.signal } : {}
		});
	};
	const liveRuntime = createWorkerLiveRuntime(params.live);
	const unsubscribe = session.subscribe(liveRuntime.handleSessionEvent);
	const abortTurn = () => session.agent.abort();
	params.signal?.addEventListener("abort", abortTurn, { once: true });
	let runFailure;
	try {
		if (params.signal?.aborted) throw toWorkerAgentError(params.signal.reason, "Worker agent turn aborted.");
		await session.agent.prompt({
			role: "user",
			content: [{
				type: "text",
				text: params.prompt
			}],
			timestamp: Date.now()
		});
		await session.agent.waitForIdle();
		if (params.signal?.aborted) throw toWorkerAgentError(params.signal.reason, "Worker agent turn aborted.");
		const terminalAssistant = session.agent.state.messages.toReversed().find((message) => message.role === "assistant");
		if (terminalAssistant?.stopReason === "error") throw new Error(terminalAssistant.errorMessage ?? "Worker inference failed.");
		if (terminalAssistant?.stopReason === "aborted") throw new Error(terminalAssistant.errorMessage ?? "Worker inference was aborted.");
	} catch (error) {
		runFailure = params.signal?.aborted ? toWorkerAgentError(params.signal.reason, "Worker agent turn aborted.") : toWorkerAgentError(error, "Worker agent turn failed.");
		liveRuntime.enqueueRunFailure({
			aborted: params.signal?.aborted === true,
			error: runFailure
		});
	}
	let finalTranscriptFailure;
	try {
		try {
			await transcriptRuntime.withSessionWriteSettlement(() => void 0);
		} catch (error) {
			finalTranscriptFailure = toWorkerAgentError(error, "Worker transcript flush failed.");
		}
		if (finalTranscriptFailure === void 0) await liveRuntime.emitTerminal();
	} finally {
		params.signal?.removeEventListener("abort", abortTurn);
		unsubscribe();
		getProcessSupervisor().cancelScope(params.sessionKey, "manual-cancel");
		session.dispose();
		await browserRuntime?.dispose();
	}
	if (runFailure !== void 0) throw runFailure;
	if (finalTranscriptFailure !== void 0) throw finalTranscriptFailure;
}
//#endregion
export { runWorkerEmbeddedTurn };
