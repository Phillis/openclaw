import { _ as isDefaultAgentRuntimeId, y as normalizeOptionalAgentRuntimeId } from "./openai-routing-BC0q3X-J.js";
import { t as DEFAULT_CONTEXT_TOKENS } from "./defaults-CdX9UGcX.js";
import { s as normalizeThinkLevel } from "./thinking.shared-bHYuuc1L.js";
import { t as resolveAgentHarnessPolicy } from "./policy-Ce8eESmX.js";
import { l as kindFromMime, u as mimeTypeFromFilePath } from "./mime-Hm4eS2i0.js";
import { a as isAgentHarnessSessionKey, c as isValidAgentHarnessSessionStoreEntry, d as resolveAgentHarnessSessionStoreEntryError, n as AGENT_HARNESS_SESSION_ID_LOCKED_MESSAGE, r as AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE } from "./agent-harness-session-key-BpWapmwX.js";
import { t as FailoverError } from "./failover-error-DKFCUqL9.js";
import { t as log } from "./logger-BQ2aebRn.js";
import { a as resolveContextWindowInfo, i as formatContextWindowWarningMessage, n as evaluateContextWindowGuard, r as formatContextWindowBlockMessage } from "./context-window-guard-DplKE2ms.js";
import { t as readAgentModelContextTokens } from "./model-context-tokens-D9c8hKDs.js";
//#region src/agents/embedded-agent-runner/run/setup.ts
/**
* Resolves hook-selected model state and pre-model attachments for a run.
*/
const BEFORE_MODEL_RESOLVE_SUPPORTED_OVERRIDES = Object.freeze([
	"modelOverride",
	"providerOverride",
	"thinkingLevelOverride",
	"fastModeOverride"
]);
/** Durable harness sessions run only with their exact persisted identity and runtime lock. */
function resolveAgentHarnessRunAdmissionError(params) {
	const sessionKey = params.sessionKey?.trim();
	if (!sessionKey) return;
	const entry = params.entry;
	const reservedKey = isAgentHarnessSessionKey(sessionKey);
	if (!entry) return reservedKey ? AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE : void 0;
	if (entry.modelSelectionLocked !== true) return;
	const durableEntryError = resolveAgentHarnessSessionStoreEntryError(sessionKey, entry);
	if (durableEntryError) return durableEntryError;
	if (!isValidAgentHarnessSessionStoreEntry(sessionKey, entry)) return;
	const requestedHarnessId = normalizeOptionalAgentRuntimeId(params.agentHarnessId);
	const durableHarnessId = normalizeOptionalAgentRuntimeId(entry.agentHarnessId);
	const matchesRequestedRuntime = params.modelSelectionLocked === true && requestedHarnessId === durableHarnessId;
	const matchesDurableRuntime = entry.sessionId === params.sessionId && durableHarnessId !== void 0;
	return matchesRequestedRuntime && matchesDurableRuntime ? void 0 : reservedKey ? AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE : AGENT_HARNESS_SESSION_ID_LOCKED_MESSAGE;
}
/**
* Runs model-selection hooks before resolving the runtime model.
*/
async function resolveHookModelSelection(params) {
	let provider = params.provider;
	let modelId = params.modelId;
	if (params.modelSelectionLocked === true) return {
		provider,
		modelId
	};
	let modelResolveOverride;
	const hookRunner = params.hookRunner;
	if (hookRunner?.hasHooks("before_model_resolve")) try {
		const event = {
			controlContractVersion: 1,
			supportedOverrides: BEFORE_MODEL_RESOLVE_SUPPORTED_OVERRIDES,
			prompt: params.prompt,
			provider,
			model: modelId,
			...params.requestedProvider ? { requestedProvider: params.requestedProvider } : {},
			...params.requestedModel ? { requestedModel: params.requestedModel } : {},
			...params.fallbackUsed !== void 0 ? { fallbackUsed: params.fallbackUsed } : {},
			...params.attachments ? { attachments: params.attachments } : {}
		};
		modelResolveOverride = await hookRunner.runBeforeModelResolve(event, params.hookContext);
	} catch (hookErr) {
		log.warn(`before_model_resolve hook failed: ${String(hookErr)}`);
	}
	if (modelResolveOverride?.providerOverride) {
		provider = modelResolveOverride.providerOverride;
		log.info(`[hooks] provider overridden to ${provider}`);
	}
	if (modelResolveOverride?.modelOverride) {
		modelId = modelResolveOverride.modelOverride;
		log.info(`[hooks] model overridden to ${modelId}`);
	}
	const thinkingLevelOverride = normalizeThinkLevel(modelResolveOverride?.thinkingLevelOverride);
	const fastModeOverride = typeof modelResolveOverride?.fastModeOverride === "boolean" ? modelResolveOverride.fastModeOverride : void 0;
	const boundHarnessRuntime = normalizeOptionalAgentRuntimeId(params.boundHarnessRuntime);
	if (boundHarnessRuntime && (provider !== params.provider || modelId !== params.modelId)) {
		const selectedRuntime = resolveAgentHarnessPolicy({
			provider,
			modelId,
			config: params.config,
			agentId: params.hookContext.agentId,
			sessionKey: params.hookContext.sessionKey
		}).runtime;
		if ((selectedRuntime === "auto" ? "openclaw" : selectedRuntime) !== boundHarnessRuntime) {
			log.info(`[hooks] ignored cross-harness model override ${provider}/${modelId}; session lane remains ${boundHarnessRuntime}`);
			provider = params.provider;
			modelId = params.modelId;
		}
	}
	return {
		provider,
		modelId,
		thinkingLevelOverride,
		fastModeOverride
	};
}
/**
* Converts current-turn media into the minimal attachment shape exposed to
* before-model-resolve hooks. Paths and URLs never cross the plugin boundary.
*/
function buildBeforeModelResolveAttachments(images, media) {
	const attachments = [];
	let mediaImageCount = 0;
	for (const fact of media ?? []) {
		if (!fact.kind && !fact.contentType && !fact.path && !fact.url) continue;
		const inferredMimeType = fact.contentType ?? mimeTypeFromFilePath(fact.path) ?? mimeTypeFromFilePath(fact.url);
		const inferredKind = fact.kind ?? kindFromMime(inferredMimeType) ?? "unknown";
		const kind = inferredKind === "sticker" ? "image" : inferredKind === "unknown" ? "other" : inferredKind;
		if (kind === "image") mediaImageCount += 1;
		attachments.push({
			kind,
			...inferredMimeType ? { mimeType: inferredMimeType } : {}
		});
	}
	for (const image of images?.slice(mediaImageCount) ?? []) attachments.push({
		kind: "image",
		...image.mimeType ? { mimeType: image.mimeType } : {}
	});
	return attachments.length > 0 ? attachments : void 0;
}
/** Resolves a pinned non-default harness that owns native model selection. */
function resolveNativeModelOwnedHarnessId(params) {
	if (params.modelSelectionLocked !== true) return;
	const requestedHarnessId = normalizeOptionalAgentRuntimeId(params.agentHarnessId);
	const selectedHarnessId = normalizeOptionalAgentRuntimeId(params.selectedHarnessId);
	if (!requestedHarnessId || isDefaultAgentRuntimeId(requestedHarnessId) || requestedHarnessId === "openclaw" || requestedHarnessId !== selectedHarnessId) return;
	return requestedHarnessId;
}
/** Builds structural model metadata for a harness that resolves its real model natively. */
function createNativeModelOwnedRuntimeModel(params) {
	return {
		provider: params.provider,
		id: params.modelId,
		name: params.modelId,
		baseUrl: "",
		api: "openai-responses",
		reasoning: true,
		input: ["text", "image"],
		cost: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0
		},
		contextWindow: DEFAULT_CONTEXT_TOKENS,
		maxTokens: DEFAULT_CONTEXT_TOKENS
	};
}
/**
* Resolves context-window policy for the selected runtime model and returns the
* model shape the session runtime should see. Configured context caps are
* reflected in `effectiveModel.contextWindow` so auto-compaction uses the same
* limit as the guard.
*/
function resolveEffectiveRuntimeModel(params) {
	const ctxInfo = resolveContextWindowInfo({
		cfg: params.cfg,
		provider: params.contextConfigProvider ?? params.provider,
		modelId: params.modelId,
		modelContextTokens: readAgentModelContextTokens(params.runtimeModel),
		modelContextWindow: params.runtimeModel.contextWindow,
		agentContextTokens: params.agentContextTokens,
		defaultTokens: DEFAULT_CONTEXT_TOKENS
	});
	const effectiveModel = ctxInfo.tokens < (params.runtimeModel.contextWindow ?? Infinity) ? {
		...params.runtimeModel,
		contextWindow: ctxInfo.tokens
	} : params.runtimeModel;
	const ctxGuard = evaluateContextWindowGuard({ info: ctxInfo });
	const runtimeBaseUrl = typeof params.runtimeModel.baseUrl === "string" ? params.runtimeModel.baseUrl : void 0;
	if (ctxGuard.shouldWarn) log.warn(formatContextWindowWarningMessage({
		provider: params.provider,
		modelId: params.modelId,
		guard: ctxGuard,
		runtimeBaseUrl
	}));
	if (ctxGuard.shouldBlock) {
		const message = formatContextWindowBlockMessage({
			guard: ctxGuard,
			runtimeBaseUrl
		});
		log.error(`blocked model (context window too small): ${params.provider}/${params.modelId} ctx=${ctxGuard.tokens} (min=${ctxGuard.hardMinTokens}) source=${ctxGuard.source}; ${message}`);
		throw new FailoverError(message, {
			reason: "unknown",
			provider: params.provider,
			model: params.modelId
		});
	}
	return {
		ctxInfo,
		effectiveModel
	};
}
/** Resolves only OpenClaw-owned context policy; native model owners keep that policy private. */
function resolveEmbeddedRuntimeModelPolicy(params) {
	if (params.nativeModelOwned) return { effectiveModel: params.runtimeModel };
	const resolved = resolveEffectiveRuntimeModel(params);
	return {
		contextWindowInfo: resolved.ctxInfo,
		contextTokenBudget: resolved.ctxInfo.tokens,
		effectiveModel: resolved.effectiveModel
	};
}
//#endregion
export { resolveHookModelSelection as a, resolveEmbeddedRuntimeModelPolicy as i, createNativeModelOwnedRuntimeModel as n, resolveNativeModelOwnedHarnessId as o, resolveAgentHarnessRunAdmissionError as r, buildBeforeModelResolveAttachments as t };
