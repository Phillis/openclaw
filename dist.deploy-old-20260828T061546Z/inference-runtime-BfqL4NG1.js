import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-DigoIwHb.js";
import { f as resolveAgentWorkspaceDir, g as resolveDefaultAgentId, l as resolveAgentDir } from "./agent-scope-config-CUBiGmG3.js";
import { n as getRuntimeConfig } from "./io-ClLVsBMp.js";
import { D as freezeDiagnosticTraceContext, T as createDiagnosticTraceContextFromActiveScope, f as isDiagnosticsEnabled, o as emitTrustedDiagnosticEvent } from "./diagnostic-events-BGzDm6gu.js";
import { s as normalizeProviderId } from "./model-ref-shared-D4yx0hwT.js";
import { b as resolveModelRefFromString, f as modelCatalogLogicalKey, i as buildModelAliasIndex } from "./model-selection-shared-DbjoXfPH.js";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.js";
import { i as projectProviderModelRouteConfig, o as resolveProviderModelRoutes } from "./provider-model-route-n5WsvCIn.js";
import { w as resolveDefaultModelForAgent } from "./codex-route-model-ref-BJZ-8dtR.js";
import { t as resolveAgentHarnessPolicy } from "./policy-Cj3P99a_.js";
import "./config-B_0xOnKq.js";
import { n as withPluginRuntimeGenerationScope } from "./generation-scope-D--dYlKj.js";
import { i as hasNonzeroUsage, o as normalizeUsage } from "./usage-DNKCVmJi.js";
import { s as getModelLlmRuntime } from "./stream-CKjrnhcO.js";
import { t as acquireAgentRunPreparedModelRuntime } from "./prepared-model-runtime-DRxNQEhr.js";
import "./model-selection-Cp8EGD61.js";
import { i as resolveModelCostConfig, t as estimateUsageCost } from "./usage-format-CVbhwZGU.js";
import { n as resolveDiagnosticModelContentCapturePolicy } from "./diagnostic-llm-content-CAc71KJ1.js";
import { t as applyExtraParamsToAgent } from "./extra-params-DJOGLM8c.js";
import { t as mapThinkingLevel } from "./utils-CefVZRZM.js";
import { a as resolveEmbeddedAgentStreamFn, t as wrapStreamFnWithDiagnosticModelCallEvents } from "./attempt.model-diagnostic-events-DgednQ09.js";
import { t as registerProviderStreamForModel } from "./provider-stream-CaAcAYw6.js";
import { n as resolveModelAsync } from "./model-S0ufJtGi.js";
import { n as createModelVisibilityPolicy, t as RUNTIME_MODEL_VISIBILITY_NORMALIZATION } from "./model-visibility-policy-0m0xt0BZ.js";
import { n as prepareSimpleCompletionModel } from "./simple-completion-runtime-RpHRaaRj.js";
import { n as resolveSessionAuthSelection } from "./session-override-LTIDP5EY.js";
import { a as projectWorkerProviderReplay, t as WORKER_PROVIDER_REPLAY_LOCAL_RETRY_MESSAGE } from "./transcript-message-WHdKssX2.js";
import { t as boundedWorkerError } from "./worker-error-C2z1Ud9q.js";
import { t as resolveWorkerSessionTarget } from "./session-target-BGLvbr4J.js";
import { isDeepStrictEqual } from "node:util";
import { normalizeCodexResponsesBaseUrlForOpenAISdk } from "@openclaw/ai/transports";
//#region src/gateway/worker-environments/inference-terminal-message.ts
function projectWorkerInferenceTerminalMessage(params) {
	const content = params.message.content.map((part) => {
		switch (part.type) {
			case "text": return {
				type: part.type,
				text: part.text,
				...part.textSignature ? { textSignature: part.textSignature } : {}
			};
			case "thinking": return {
				type: part.type,
				thinking: part.thinking,
				...part.thinkingSignature ? { thinkingSignature: part.thinkingSignature } : {},
				...part.redacted !== void 0 ? { redacted: part.redacted } : {}
			};
			case "toolCall": return {
				type: part.type,
				id: part.id,
				name: part.name,
				arguments: structuredClone(part.arguments),
				...part.thoughtSignature ? { thoughtSignature: part.thoughtSignature } : {},
				...part.executionMode ? { executionMode: part.executionMode } : {}
			};
			default: throw new Error("Unsupported assistant terminal content");
		}
	});
	const usage = params.message.usage;
	return projectWorkerProviderReplay({
		message: {
			role: "assistant",
			content,
			api: params.modelIdentity.api,
			provider: params.modelIdentity.provider,
			model: params.modelIdentity.model,
			...params.message.responseModel ? { responseModel: params.message.responseModel } : {},
			...params.message.responseId ? { responseId: params.message.responseId } : {},
			usage: {
				input: usage.input,
				output: usage.output,
				cacheRead: usage.cacheRead,
				cacheWrite: usage.cacheWrite,
				...usage.contextUsage?.state === "available" ? { contextUsage: {
					state: usage.contextUsage.state,
					promptTokens: usage.contextUsage.promptTokens,
					totalTokens: usage.contextUsage.totalTokens
				} } : usage.contextUsage?.state === "unavailable" ? { contextUsage: { state: usage.contextUsage.state } } : {},
				totalTokens: usage.totalTokens,
				cost: {
					input: usage.cost.input,
					output: usage.cost.output,
					cacheRead: usage.cost.cacheRead,
					cacheWrite: usage.cost.cacheWrite,
					total: usage.cost.total,
					...usage.cost.totalOrigin ? { totalOrigin: usage.cost.totalOrigin } : {}
				}
			},
			stopReason: params.stopReason,
			timestamp: params.message.timestamp
		},
		providerReplay: params.message.providerReplay,
		purpose: "transcript"
	});
}
//#endregion
//#region src/gateway/worker-environments/inference-tool-call-stream.ts
const MAX_PENDING_TOOL_DELTA_BYTES = 1024 * 1024;
const MAX_PENDING_TOOL_DELTAS = 4096;
const MAX_STREAMED_TOOL_DELTAS = 64 * 1024;
const RETAINED_TOOL_ARGUMENT_CHUNK_BYTES = 16 * 1024;
function contentAt$1(message, index) {
	return message.content[index];
}
function createWorkerToolCallStream(params) {
	const pendingDeltas = /* @__PURE__ */ new Map();
	let pendingDeltaBytes = 0;
	let pendingDeltaCount = 0;
	const started = /* @__PURE__ */ new Set();
	const ended = /* @__PURE__ */ new Set();
	const identities = /* @__PURE__ */ new Map();
	const emittedArgumentChunks = /* @__PURE__ */ new Map();
	const emittedArgumentChunkBytes = /* @__PURE__ */ new Map();
	let retainedArgumentBytes = 0;
	let streamedDeltaCount = 0;
	const emitDelta = (contentIndex, delta) => {
		if (!params.isCurrent()) return "cancelled";
		if (streamedDeltaCount + 1 > MAX_STREAMED_TOOL_DELTAS) return "invalid";
		streamedDeltaCount += 1;
		const deltaBytes = Buffer.byteLength(delta, "utf8");
		if (deltaBytes === 0) return params.isCurrent() ? "ok" : "cancelled";
		if (retainedArgumentBytes + deltaBytes > MAX_PENDING_TOOL_DELTA_BYTES) return "invalid";
		params.emit({
			type: "toolcall_delta",
			contentIndex,
			delta
		});
		const emitted = emittedArgumentChunks.get(contentIndex) ?? [];
		const emittedBytes = emittedArgumentChunkBytes.get(contentIndex) ?? [];
		const lastIndex = emitted.length - 1;
		const last = emitted[lastIndex];
		const lastBytes = emittedBytes[lastIndex];
		if (last !== void 0 && lastBytes !== void 0 && lastBytes + deltaBytes <= RETAINED_TOOL_ARGUMENT_CHUNK_BYTES) {
			emitted[lastIndex] = last + delta;
			emittedBytes[lastIndex] = lastBytes + deltaBytes;
		} else {
			emitted.push(delta);
			emittedBytes.push(deltaBytes);
		}
		emittedArgumentChunks.set(contentIndex, emitted);
		emittedArgumentChunkBytes.set(contentIndex, emittedBytes);
		retainedArgumentBytes += deltaBytes;
		return params.isCurrent() ? "ok" : "cancelled";
	};
	const start = (contentIndex, partial) => {
		if (started.has(contentIndex)) return params.isCurrent() ? "ok" : "cancelled";
		const content = contentAt$1(partial, contentIndex);
		if (content?.type !== "toolCall" || !content.id || !content.name) return "invalid";
		if (!params.isCurrent()) return "cancelled";
		started.add(contentIndex);
		identities.set(contentIndex, {
			id: content.id,
			name: content.name
		});
		params.emit({
			type: "toolcall_start",
			contentIndex,
			id: content.id,
			toolName: content.name
		});
		if (!params.isCurrent()) return "cancelled";
		for (const delta of pendingDeltas.get(contentIndex) ?? []) {
			const result = emitDelta(contentIndex, delta);
			pendingDeltaBytes -= Buffer.byteLength(delta, "utf8");
			pendingDeltaCount -= 1;
			if (result !== "ok") return result;
		}
		pendingDeltas.delete(contentIndex);
		return "ok";
	};
	const delta = (contentIndex, value, partial) => {
		if (ended.has(contentIndex)) return "invalid";
		if (started.has(contentIndex)) return emitDelta(contentIndex, value);
		const pending = pendingDeltas.get(contentIndex) ?? [];
		pendingDeltaBytes += Buffer.byteLength(value, "utf8");
		pendingDeltaCount += 1;
		if (pendingDeltaBytes > MAX_PENDING_TOOL_DELTA_BYTES || pendingDeltaCount > MAX_PENDING_TOOL_DELTAS) return "invalid";
		pending.push(value);
		pendingDeltas.set(contentIndex, pending);
		const result = start(contentIndex, partial);
		return result === "invalid" ? "ok" : result;
	};
	const reconcile = (contentIndex, complete) => {
		const identity = identities.get(contentIndex);
		if (!identity || identity.id !== complete.id || identity.name !== complete.name) return "invalid";
		const emittedJson = (emittedArgumentChunks.get(contentIndex) ?? []).join("");
		if (!emittedJson) try {
			const completeJson = JSON.stringify(complete.arguments);
			return typeof completeJson === "string" ? emitDelta(contentIndex, completeJson) : "invalid";
		} catch {
			return "invalid";
		}
		try {
			return isDeepStrictEqual(JSON.parse(emittedJson), complete.arguments) ? params.isCurrent() ? "ok" : "cancelled" : "invalid";
		} catch {
			return "invalid";
		}
	};
	const end = (contentIndex, partial, complete) => {
		if (ended.has(contentIndex)) return reconcile(contentIndex, complete);
		const startResult = start(contentIndex, partial);
		if (startResult !== "ok") return startResult;
		const reconcileResult = reconcile(contentIndex, complete);
		if (reconcileResult !== "ok") return reconcileResult;
		ended.add(contentIndex);
		params.emit({
			type: "toolcall_end",
			contentIndex
		});
		return params.isCurrent() ? "ok" : "cancelled";
	};
	return {
		delta,
		end,
		matchesTerminal: (message) => {
			const terminal = new Set(message.content.flatMap((content, contentIndex) => content.type === "toolCall" ? [contentIndex] : []));
			return pendingDeltas.size === 0 && terminal.size === started.size && [...started].every((contentIndex) => terminal.has(contentIndex) && ended.has(contentIndex));
		},
		start
	};
}
//#endregion
//#region src/gateway/worker-environments/inference-runtime.ts
const ERROR_MESSAGES = {
	"model-not-approved": "Model is not approved for this agent.",
	"invalid-context": "Inference context is invalid.",
	"epoch-mismatch": "Worker run epoch does not match.",
	"session-not-attached": "Worker session is not attached.",
	"provider-error": "Model provider request failed.",
	cancelled: "Inference request was cancelled."
};
function inferenceError(reason, usage, message = ERROR_MESSAGES[reason]) {
	return {
		type: "error",
		reason,
		message,
		...usage ? { usage: structuredClone(usage) } : {}
	};
}
function copyTool(tool) {
	if (!isRecord(tool.parameters) || tool.parameters.type !== "object") return;
	return {
		name: tool.name,
		description: tool.description,
		parameters: structuredClone(tool.parameters)
	};
}
function buildContext(context) {
	const tools = [];
	for (const tool of context.tools ?? []) {
		const copied = copyTool(tool);
		if (!copied) return;
		tools.push(copied);
	}
	return {
		...context.systemPrompt !== void 0 ? { systemPrompt: context.systemPrompt } : {},
		messages: structuredClone(context.messages),
		...tools.length > 0 ? { tools } : {}
	};
}
function optionBudgetsFitModel(options, model) {
	if (options.maxTokens !== void 0 && options.maxTokens > model.maxTokens) return false;
	for (const budget of Object.values(options.thinkingBudgets ?? {})) if (budget !== void 0 && budget > model.maxTokens) return false;
	return true;
}
function buildStreamOptions(params) {
	const options = params.request.options;
	return {
		...options.temperature !== void 0 ? { temperature: options.temperature } : {},
		...options.maxTokens !== void 0 ? { maxTokens: options.maxTokens } : {},
		...options.reasoning !== void 0 ? { reasoning: mapThinkingLevel(options.reasoning) } : {},
		...options.thinkingBudgets ? { thinkingBudgets: { ...options.thinkingBudgets } } : {},
		signal: params.signal,
		sessionId: params.request.sessionId,
		...params.apiKey ? { apiKey: params.apiKey } : {}
	};
}
function contentAt(message, index) {
	return message.content[index];
}
function toWorkerStreamEvent(event, modelIdentity) {
	switch (event.type) {
		case "start": return {
			type: "start",
			resolvedModel: {
				api: modelIdentity.api,
				provider: modelIdentity.provider,
				model: modelIdentity.model
			},
			timestamp: event.partial.timestamp
		};
		case "text_start": {
			const content = contentAt(event.partial, event.contentIndex);
			return {
				type: "text_start",
				contentIndex: event.contentIndex,
				...content?.type === "text" && content.textSignature ? { contentSignature: content.textSignature } : {}
			};
		}
		case "text_delta": return {
			type: "text_delta",
			contentIndex: event.contentIndex,
			delta: event.delta
		};
		case "text_end": {
			const content = contentAt(event.partial, event.contentIndex);
			return {
				type: "text_end",
				contentIndex: event.contentIndex,
				...content?.type === "text" && content.textSignature ? { contentSignature: content.textSignature } : {}
			};
		}
		case "thinking_start": return {
			type: "thinking_start",
			contentIndex: event.contentIndex
		};
		case "thinking_delta": return {
			type: "thinking_delta",
			contentIndex: event.contentIndex,
			delta: event.delta
		};
		case "thinking_end": {
			const content = contentAt(event.partial, event.contentIndex);
			return {
				type: "thinking_end",
				contentIndex: event.contentIndex,
				...content?.type === "thinking" && content.thinkingSignature ? { contentSignature: content.thinkingSignature } : {}
			};
		}
		case "toolcall_start":
		case "toolcall_delta":
		case "toolcall_end":
		case "done":
		case "error": return;
	}
}
function emitWorkerInferenceUsage(params) {
	if (!isDiagnosticsEnabled(params.config)) return;
	const usage = normalizeUsage(params.usage);
	if (!hasNonzeroUsage(usage)) return;
	const input = usage.input ?? 0;
	const output = usage.output ?? 0;
	const cacheRead = usage.cacheRead ?? 0;
	const cacheWrite = usage.cacheWrite ?? 0;
	const promptTokens = input + cacheRead + cacheWrite;
	const total = usage.total ?? promptTokens + output;
	const costUsd = estimateUsageCost({
		usage,
		cost: resolveModelCostConfig({
			provider: params.model.provider,
			model: params.model.id,
			config: params.config
		})
	});
	emitTrustedDiagnosticEvent({
		type: "model.usage",
		trace: freezeDiagnosticTraceContext(params.trace),
		sessionKey: params.target.sessionKey,
		sessionId: params.request.sessionId,
		channel: "worker",
		agentId: params.target.agentId,
		provider: params.model.provider,
		model: params.model.id,
		usage: {
			input,
			output,
			cacheRead,
			cacheWrite,
			promptTokens,
			total
		},
		context: {
			limit: params.model.contextTokens ?? params.model.contextWindow,
			...usage.contextUsage?.state === "available" ? { used: usage.contextUsage.promptTokens } : {}
		},
		...costUsd !== void 0 ? { costUsd } : {},
		durationMs: params.durationMs
	});
}
const DEFAULT_DEPENDENCIES = {
	now: Date.now,
	resolveSessionTarget: (config, sessionId) => {
		const target = resolveWorkerSessionTarget(config, sessionId);
		if (!target) return;
		return {
			...target,
			agentId: target.agentId ?? resolveDefaultAgentId(config)
		};
	},
	acquireRuntimeLease: acquireAgentRunPreparedModelRuntime,
	resolveDefaultModel: resolveDefaultModelForAgent,
	resolveSessionAuthSelection,
	resolveModel: resolveModelAsync,
	prepareModel: prepareSimpleCompletionModel,
	resolveProviderStream: registerProviderStreamForModel,
	resolveStream: resolveEmbeddedAgentStreamFn,
	applyStreamPolicy: applyExtraParamsToAgent,
	wrapStream: wrapStreamFnWithDiagnosticModelCallEvents,
	createTrace: createDiagnosticTraceContextFromActiveScope,
	recordUsage: emitWorkerInferenceUsage
};
async function resolveApprovedModel(params) {
	const { config, target, request, dependencies } = params;
	const rawRef = `${request.modelRef.provider}/${request.modelRef.model}`;
	if (splitTrailingAuthProfile(rawRef).profile) return;
	const runtimeLease = await dependencies.acquireRuntimeLease({
		config,
		agentId: target.agentId,
		agentDir: resolveAgentDir(config, target.agentId)
	});
	const runtimeSnapshot = runtimeLease.snapshot;
	try {
		return await withPluginRuntimeGenerationScope(runtimeSnapshot, async () => {
			const lifecycleConfig = runtimeSnapshot.config;
			const agentDir = runtimeSnapshot.agentDir;
			const workspaceDir = runtimeSnapshot.workspaceDir ?? resolveAgentWorkspaceDir(lifecycleConfig, target.agentId);
			const manifestSnapshot = runtimeSnapshot.metadataSnapshot;
			const defaultModel = dependencies.resolveDefaultModel({
				cfg: lifecycleConfig,
				agentId: target.agentId,
				manifestPlugins: manifestSnapshot.plugins,
				...RUNTIME_MODEL_VISIBILITY_NORMALIZATION
			});
			const aliasIndex = buildModelAliasIndex({
				cfg: lifecycleConfig,
				agentId: target.agentId,
				defaultProvider: defaultModel.provider,
				manifestPlugins: manifestSnapshot.plugins,
				...RUNTIME_MODEL_VISIBILITY_NORMALIZATION
			});
			const resolved = resolveModelRefFromString({
				cfg: lifecycleConfig,
				agentId: target.agentId,
				raw: rawRef,
				defaultProvider: defaultModel.provider,
				aliasIndex,
				manifestPlugins: manifestSnapshot.plugins,
				...RUNTIME_MODEL_VISIBILITY_NORMALIZATION
			});
			if (!resolved || normalizeProviderId(resolved.ref.provider) !== normalizeProviderId(request.modelRef.provider)) {
				runtimeLease.release();
				return;
			}
			const catalog = runtimeSnapshot.modelCatalog.entries;
			const policy = createModelVisibilityPolicy({
				cfg: lifecycleConfig,
				catalog,
				defaultProvider: defaultModel.provider,
				defaultModel: `${defaultModel.provider}/${defaultModel.model}`,
				agentId: target.agentId,
				manifestPlugins: manifestSnapshot.plugins,
				...RUNTIME_MODEL_VISIBILITY_NORMALIZATION
			});
			const resolvedKey = modelCatalogLogicalKey({
				provider: resolved.ref.provider,
				id: resolved.ref.model
			});
			if (!(policy.allowedCatalog.some((entry) => resolvedKey === modelCatalogLogicalKey(entry)) || policy.retainedKeys.has(resolvedKey)) || !policy.allows(resolved.ref)) {
				runtimeLease.release();
				return;
			}
			const configuredDefaultProfile = resolvedKey === modelCatalogLogicalKey({
				provider: defaultModel.provider,
				id: defaultModel.model
			}) ? splitTrailingAuthProfile(resolveAgentEffectiveModelPrimary(lifecycleConfig, target.agentId) ?? "").profile : void 0;
			const harnessPolicy = resolveAgentHarnessPolicy({
				provider: resolved.ref.provider,
				modelId: resolved.ref.model,
				config: lifecycleConfig,
				agentId: target.agentId,
				sessionKey: target.sessionKey
			});
			const agentRuntimeId = harnessPolicy.runtimeSource !== "implicit" || lifecycleConfig.plugins?.entries?.codex?.enabled === true ? harnessPolicy.runtime : void 0;
			const sessionSelection = await dependencies.resolveSessionAuthSelection({
				cfg: lifecycleConfig,
				provider: resolved.ref.provider,
				modelId: resolved.ref.model,
				...configuredDefaultProfile ? { configuredProfileId: configuredDefaultProfile } : {},
				harnessRuntime: harnessPolicy.runtime,
				agentDir,
				sessionEntry: target.sessionEntry,
				sessionStore: target.sessionStore,
				sessionKey: target.sessionKey,
				storePath: target.storePath,
				isNewSession: false
			});
			const selectedProfileId = sessionSelection?.profileId;
			const routeRequirement = sessionSelection?.routeRequirement;
			let modelConfig = lifecycleConfig;
			const routeResolution = routeRequirement ? resolveProviderModelRoutes({
				provider: resolved.ref.provider,
				modelId: resolved.ref.model,
				config: lifecycleConfig
			}) : void 0;
			const route = routeResolution?.kind === "routes" ? routeResolution.routes.find((candidate) => candidate.authRequirement === routeRequirement) : void 0;
			if (route) modelConfig = projectProviderModelRouteConfig({
				provider: resolved.ref.provider,
				config: lifecycleConfig,
				route
			});
			const prepared = await dependencies.prepareModel({
				cfg: modelConfig,
				agentId: target.agentId,
				provider: resolved.ref.provider,
				modelId: resolved.ref.model,
				agentDir,
				...selectedProfileId ? { profileId: selectedProfileId } : {},
				...selectedProfileId ? { preferredProfile: selectedProfileId } : {},
				...selectedProfileId ? { bindAuthOwner: true } : {},
				allowMissingApiKeyModes: ["aws-sdk"],
				allowBundledStaticCatalogFallback: true,
				modelResolver: dependencies.resolveModel,
				preparedModelRuntime: runtimeSnapshot,
				workspaceDir,
				...agentRuntimeId ? { agentRuntimeId } : {}
			});
			return {
				provider: resolved.ref.provider,
				model: resolved.ref.model,
				config: lifecycleConfig,
				agentDir,
				workspaceDir,
				prepared,
				runtimeSnapshot,
				release: runtimeLease.release
			};
		});
	} catch (error) {
		runtimeLease.release();
		throw error;
	}
}
function createWorkerInferenceExecutor(overrides = {}) {
	const dependencies = {
		...DEFAULT_DEPENDENCIES,
		...overrides
	};
	return async (params) => {
		const { identity, request, signal } = params;
		if (identity.sessionId !== request.sessionId) return inferenceError("session-not-attached");
		if (identity.ownerEpoch !== request.runEpoch) return inferenceError("epoch-mismatch");
		if (signal.aborted || !params.isCurrent()) return inferenceError("cancelled");
		const config = params.config ?? getRuntimeConfig();
		const target = dependencies.resolveSessionTarget(config, request.sessionId);
		if (!target) return inferenceError("session-not-attached");
		const context = buildContext(request.context);
		if (!context) return inferenceError("invalid-context");
		const approved = await resolveApprovedModel({
			config,
			target,
			request,
			dependencies
		});
		if (!approved) return inferenceError("model-not-approved");
		return await withPluginRuntimeGenerationScope(approved.runtimeSnapshot, async () => {
			try {
				if ("error" in approved.prepared) return inferenceError("provider-error", void 0, boundedWorkerError(approved.prepared.error, 256));
				const modelIdentity = {
					api: approved.prepared.model.api,
					provider: approved.provider,
					model: approved.model
				};
				const logicalModel = approved.prepared.model;
				const llmRuntime = getModelLlmRuntime(logicalModel);
				if (!llmRuntime) throw new Error("Prepared worker model has no lifecycle runtime owner");
				const providerModel = logicalModel.provider === "openai" && logicalModel.api === "openai-chatgpt-responses" ? {
					...logicalModel,
					baseUrl: normalizeCodexResponsesBaseUrlForOpenAISdk(logicalModel.baseUrl)
				} : logicalModel;
				const providerStream = dependencies.resolveProviderStream({
					model: providerModel,
					cfg: approved.config,
					agentDir: approved.agentDir,
					workspaceDir: approved.workspaceDir
				});
				const authValue = approved.prepared.auth.apiKey;
				const streamAgent = { streamFn: dependencies.resolveStream({
					llmRuntime,
					currentStreamFn: llmRuntime.streamSimple,
					...providerStream ? { providerStreamFn: providerStream } : {},
					sessionId: request.sessionId,
					signal,
					model: providerModel,
					resolvedApiKey: authValue,
					authProfileId: approved.prepared.auth.profileId
				}) };
				const streamPolicyOptions = {
					...request.options.temperature !== void 0 ? { temperature: request.options.temperature } : {},
					...request.options.maxTokens !== void 0 ? { maxTokens: request.options.maxTokens } : {},
					...request.options.reasoning !== void 0 ? { reasoning: request.options.reasoning } : {},
					...request.options.thinkingBudgets ? { thinkingBudgets: { ...request.options.thinkingBudgets } } : {}
				};
				dependencies.applyStreamPolicy(streamAgent, approved.config, approved.provider, approved.model, streamPolicyOptions, streamPolicyOptions.reasoning, target.agentId, approved.workspaceDir, providerModel, approved.agentDir);
				const scopedStream = streamAgent.streamFn;
				const model = providerModel;
				if (!optionBudgetsFitModel(request.options, model)) return inferenceError("invalid-context");
				if (signal.aborted || !params.isCurrent()) return inferenceError("cancelled");
				const startedAt = dependencies.now();
				const trace = dependencies.createTrace();
				let modelCallSeq = 0;
				const stream = dependencies.wrapStream(scopedStream, {
					runId: request.runId,
					sessionKey: target.sessionKey,
					sessionId: request.sessionId,
					provider: model.provider,
					model: model.id,
					api: model.api,
					contextTokenBudget: model.contextTokens ?? model.contextWindow,
					trace,
					contentCapture: resolveDiagnosticModelContentCapturePolicy(approved.config),
					nextCallId: () => `${request.runId}:${request.turnId}:worker-model:${modelCallSeq += 1}`
				});
				let usageRecorded = false;
				const recordUsage = (usage) => {
					if (usageRecorded) return;
					usageRecorded = true;
					dependencies.recordUsage({
						config: approved.config,
						target,
						request,
						model,
						usage,
						durationMs: Math.max(0, dependencies.now() - startedAt),
						trace
					});
				};
				const executionIsCurrent = () => !signal.aborted && params.isCurrent();
				const toolCalls = createWorkerToolCallStream({
					emit: params.emit,
					isCurrent: executionIsCurrent
				});
				const providerAbort = new AbortController();
				const providerSignal = AbortSignal.any([signal, providerAbort.signal]);
				try {
					const events = await stream(model, context, buildStreamOptions({
						request,
						signal: providerSignal,
						apiKey: authValue
					}));
					for await (const event of events) {
						if (event.type === "done") {
							recordUsage(event.message.usage);
							if (signal.aborted || !params.isCurrent()) return inferenceError("cancelled", event.message.usage);
							for (const [contentIndex, content] of event.message.content.entries()) if (content.type === "toolCall") {
								const endResult = toolCalls.end(contentIndex, event.message, content);
								if (endResult === "cancelled") return inferenceError("cancelled", event.message.usage);
								if (endResult === "invalid") return inferenceError("provider-error");
							}
							if (!toolCalls.matchesTerminal(event.message)) return inferenceError("provider-error");
							const terminal = projectWorkerInferenceTerminalMessage({
								message: event.message,
								modelIdentity,
								stopReason: event.reason
							});
							if (terminal.kind === "provider-replay-unavailable") {
								if (isDiagnosticsEnabled(approved.config)) {
									const { bytes, limitBytes, reason } = terminal.details;
									emitTrustedDiagnosticEvent({
										type: "payload.large",
										surface: "worker.provider-replay",
										action: "rejected",
										bytes,
										limitBytes,
										reason,
										trace: freezeDiagnosticTraceContext(trace)
									});
								}
								return inferenceError("provider-error", event.message.usage, WORKER_PROVIDER_REPLAY_LOCAL_RETRY_MESSAGE);
							}
							return {
								type: "done",
								message: terminal.message
							};
						}
						if (event.type === "error") {
							recordUsage(event.error.usage);
							return inferenceError(event.reason === "aborted" ? "cancelled" : "provider-error", event.error.usage);
						}
						if (signal.aborted || !params.isCurrent()) return inferenceError("cancelled");
						if (event.type === "toolcall_start") {
							if (toolCalls.start(event.contentIndex, event.partial) === "cancelled") return inferenceError("cancelled");
							continue;
						}
						if (event.type === "toolcall_delta") {
							const deltaResult = toolCalls.delta(event.contentIndex, event.delta, event.partial);
							if (deltaResult === "cancelled") return inferenceError("cancelled");
							if (deltaResult === "invalid") return inferenceError("provider-error");
							continue;
						}
						if (event.type === "toolcall_end") {
							const endResult = toolCalls.end(event.contentIndex, event.partial, event.toolCall);
							if (endResult === "cancelled") return inferenceError("cancelled");
							if (endResult === "invalid") return inferenceError("provider-error");
							continue;
						}
						const workerEvent = toWorkerStreamEvent(event, modelIdentity);
						if (workerEvent) params.emit(workerEvent);
					}
					return inferenceError(signal.aborted ? "cancelled" : "provider-error");
				} catch {
					return inferenceError(signal.aborted ? "cancelled" : "provider-error");
				} finally {
					providerAbort.abort();
				}
			} finally {
				approved.release();
			}
		});
	};
}
const executeWorkerInference = createWorkerInferenceExecutor();
//#endregion
export { createWorkerInferenceExecutor, executeWorkerInference };
