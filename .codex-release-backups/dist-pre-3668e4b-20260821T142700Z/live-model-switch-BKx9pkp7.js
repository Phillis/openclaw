import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { C as resolveSessionAuthProfileOverrideSource, h as resolveSessionAgentId } from "./agent-scope-D9GLFAyB.js";
import { o as resolveSessionStorePathCore } from "./paths-CfFmgJmW.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import { w as resolveDefaultModelForAgent } from "./codex-route-model-ref-WCq2iqcj.js";
import { a as getReplyPayloadMetadata, i as copyReplyPayloadMetadata, p as markReplyPayloadForSourceSuppressionDelivery } from "./reply-payload-DVcGHORx.js";
import { $t as loadSessionEntryReadOnly, Qt as loadSessionEntry, en as patchSessionEntryCore } from "./session-accessor-CIiPoGwM.js";
import { i as resolveSessionRuntimeOverrideForProvider } from "./session-runtime-compat-DNLW-mvy.js";
import { c as resolvePersistedSelectedModelRef, r as normalizeStoredOverrideModel } from "./model-selection-BEGvRdL1.js";
//#region src/agents/embedded-agent-runner/run/tool-media-payloads.ts
/**
* Merges media emitted by tools into the channel payloads produced by the
* assistant turn. The first non-reasoning reply owns the media so text and
* attachments stay together; metadata is preserved for delivery bookkeeping.
*/
function mergeAttemptToolMediaPayloads(params) {
	const mediaUrls = Array.from(new Set(params.toolMediaUrls?.map((url) => url.trim()).filter(Boolean) ?? []));
	const mediaUrlSet = new Set(mediaUrls);
	const hostOwnedMediaUrls = Array.from(new Set(params.hostOwnedToolMediaUrls?.map((url) => url.trim()).filter((url) => url.length > 0 && mediaUrlSet.has(url)) ?? []));
	if (mediaUrls.length === 0 && !params.toolAudioAsVoice && !params.toolTrustedLocalMedia) return params.payloads;
	const buildMediaPayload = (urls, includeAudio) => ({
		mediaUrls: urls.length ? urls : void 0,
		mediaUrl: urls[0],
		audioAsVoice: includeAudio && params.toolAudioAsVoice || void 0,
		trustedLocalMedia: params.toolTrustedLocalMedia || void 0
	});
	const shouldSplitHostOwnedMedia = params.sourceReplyDeliveryMode === "message_tool_only" && hostOwnedMediaUrls.length > 0;
	const hostOwnedMediaUrlSet = new Set(hostOwnedMediaUrls);
	const mergeableMediaUrls = shouldSplitHostOwnedMedia ? mediaUrls.filter((url) => !hostOwnedMediaUrlSet.has(url)) : mediaUrls;
	const appendHostOwnedMedia = (nextPayloads) => {
		if (!shouldSplitHostOwnedMedia) return nextPayloads;
		return [...nextPayloads, markReplyPayloadForSourceSuppressionDelivery(buildMediaPayload(hostOwnedMediaUrls, false))];
	};
	const payloads = params.payloads?.length ? [...params.payloads] : [];
	const payloadIndex = payloads.findIndex((payload) => !payload.isReasoning);
	if (payloadIndex >= 0) {
		const payload = payloads.at(payloadIndex);
		if (!payload) return payloads;
		if (params.sourceReplyDeliveryMode === "message_tool_only" && getReplyPayloadMetadata(payload)?.sourceReplyTranscriptMirror) return appendHostOwnedMedia(payloads);
		if (mergeableMediaUrls.length === 0 && shouldSplitHostOwnedMedia) return appendHostOwnedMedia(payloads);
		const mergedMediaUrls = Array.from(/* @__PURE__ */ new Set([...payload.mediaUrls ?? [], ...mergeableMediaUrls]));
		payloads[payloadIndex] = copyReplyPayloadMetadata(payload, {
			...payload,
			mediaUrls: mergedMediaUrls.length ? mergedMediaUrls : void 0,
			mediaUrl: payload.mediaUrl ?? mergedMediaUrls[0],
			audioAsVoice: payload.audioAsVoice || params.toolAudioAsVoice || void 0,
			trustedLocalMedia: payload.trustedLocalMedia || params.toolTrustedLocalMedia || void 0
		});
		return appendHostOwnedMedia(payloads);
	}
	if (shouldSplitHostOwnedMedia) {
		const genericMediaPayload = mergeableMediaUrls.length > 0 ? [buildMediaPayload(mergeableMediaUrls, true)] : [];
		return appendHostOwnedMedia([...payloads, ...genericMediaPayload]);
	}
	const mediaPayload = buildMediaPayload(mergeableMediaUrls, true);
	return [...payloads, mediaPayload];
}
//#endregion
//#region src/agents/live-model-switch.ts
/**
* Resolves and persists live-session model switch requests.
*/
const OPENAI_PROVIDER_ID = "openai";
const OPENAI_CODEX_PROVIDER_ID = "openai";
function resolveLiveSessionModelSelection(params) {
	const sessionKey = normalizeOptionalString(params.sessionKey);
	const cfg = params.cfg;
	if (!cfg || !sessionKey) return null;
	const agentId = normalizeOptionalString(params.agentId);
	return resolveSelectionFromSessionEntry({
		cfg,
		entry: loadSessionEntryReadOnly({
			storePath: resolveSessionStorePathCore(cfg.session?.store, { agentId }),
			sessionKey,
			hydrateSkillPromptRefs: false,
			readConsistency: "latest"
		}),
		agentId,
		defaultProvider: params.defaultProvider,
		defaultModel: params.defaultModel
	});
}
/**
* Entry-snapshot variant of the selection resolver, so atomic patch callbacks
* can evaluate the persisted selection against the exact row they may rewrite.
*/
function resolveSelectionFromSessionEntry(params) {
	const { cfg, entry } = params;
	const agentId = normalizeOptionalString(params.agentId);
	const defaultModelRef = agentId ? resolveDefaultModelForAgent({
		cfg,
		agentId
	}) : {
		provider: params.defaultProvider,
		model: params.defaultModel
	};
	const normalizedSelection = normalizeStoredOverrideModel({
		providerOverride: entry?.providerOverride,
		modelOverride: entry?.modelOverride
	});
	const persisted = resolvePersistedSelectedModelRef({
		defaultProvider: defaultModelRef.provider,
		runtimeProvider: entry?.modelProvider,
		runtimeModel: entry?.model,
		overrideProvider: normalizedSelection.providerOverride,
		overrideModel: normalizedSelection.modelOverride
	});
	const provider = persisted?.provider ?? normalizedSelection.providerOverride ?? entry?.providerOverride?.trim() ?? defaultModelRef.provider;
	const model = persisted?.model ?? defaultModelRef.model;
	const agentRuntimeOverride = resolveSessionRuntimeOverrideForProvider({
		provider,
		entry,
		cfg
	});
	const authProfileId = normalizeOptionalString(entry?.authProfileOverride);
	return {
		provider,
		model,
		...agentRuntimeOverride ? { agentRuntimeOverride } : {},
		authProfileId,
		authProfileIdSource: authProfileId ? resolveSessionAuthProfileOverrideSource(entry) : void 0
	};
}
function isAlreadyAppliedOpenAICodexRuntimePromotion(current, next) {
	return normalizeProviderId(current.provider) === OPENAI_CODEX_PROVIDER_ID && normalizeProviderId(next.provider) === OPENAI_PROVIDER_ID && current.model === next.model;
}
function hasDifferentLiveSessionModelSelection(current, next) {
	if (!next) return false;
	return (current.provider !== next.provider || current.model !== next.model) && !isAlreadyAppliedOpenAICodexRuntimePromotion(current, next) || normalizeOptionalString(current.agentRuntimeOverride) !== next.agentRuntimeOverride || normalizeOptionalString(current.authProfileId) !== next.authProfileId || (normalizeOptionalString(current.authProfileId) ? current.authProfileIdSource : void 0) !== next.authProfileIdSource;
}
/**
* Check whether a user-initiated live model switch is pending for the given
* session.  Returns the persisted model selection when the session's
* `liveModelSwitchPending` flag is `true` AND the persisted selection differs
* from the currently running model; otherwise returns `undefined`.
*
* When the flag is set but the current model already matches the persisted
* selection (e.g. the switch was applied as an override and the current
* attempt is already using the new model), the flag is consumed (cleared)
* eagerly to prevent it from persisting as stale state.
*
* **Deferral semantics:** The caller in `run.ts` only acts on the returned
* selection when `canRestartForLiveSwitch` is `true`.  If the run cannot
* restart (e.g. a tool call is in progress), the flag intentionally remains
* set so the switch fires on the next clean retry opportunity — even if that
* falls into a subsequent user turn.
*
* This replaces the previous approach that used an in-memory run-state map,
* which could not distinguish between
* user-initiated `/model` switches and system-initiated fallback rotations.
*/
function shouldSwitchToLiveModel(params) {
	const sessionKey = params.sessionKey?.trim();
	const cfg = params.cfg;
	if (!cfg || !sessionKey) return;
	if (!loadSessionEntry({
		storePath: resolveSessionStorePathCore(cfg.session?.store, { agentId: params.agentId?.trim() }),
		sessionKey,
		hydrateSkillPromptRefs: false,
		clone: false,
		readConsistency: "latest"
	})?.liveModelSwitchPending) return;
	const persisted = resolveLiveSessionModelSelection({
		cfg,
		sessionKey,
		agentId: params.agentId,
		defaultProvider: params.defaultProvider,
		defaultModel: params.defaultModel
	});
	if (!hasDifferentLiveSessionModelSelection({
		provider: params.currentProvider,
		model: params.currentModel,
		agentRuntimeOverride: params.currentAgentRuntimeOverride,
		authProfileId: params.currentAuthProfileId,
		authProfileIdSource: params.currentAuthProfileIdSource
	}, persisted)) {
		clearLiveModelSwitchPending({
			cfg,
			sessionKey,
			agentId: params.agentId
		}).catch(() => {});
		return;
	}
	return persisted ?? void 0;
}
/**
* Post-run consolidation: once a completed run has actually executed the
* persisted selection, the pending live-switch flag is spent. CLI harness runs
* never pass through the embedded attempt-recovery clear, so without this the
* flag survives forever and `/status` keeps reporting a switch that already
* happened. Unlike `shouldSwitchToLiveModel`, runtime/auth-profile drift is
* ignored here: the selected model demonstrably ran, so keeping the flag would
* only re-arm mid-run restarts that have nothing left to apply. Compare and
* clear happen inside one atomic patch so a concurrent `/model` that persists
* a newer selection is never consumed by this run's result.
*/
async function consolidateLiveModelSwitchAfterRun(params) {
	const sessionKey = normalizeOptionalString(params.sessionKey);
	const cfg = params.cfg;
	const providerUsed = normalizeOptionalString(params.providerUsed);
	const modelUsed = normalizeOptionalString(params.modelUsed);
	if (!cfg || !sessionKey || !providerUsed || !modelUsed) return;
	const agentId = resolveSessionAgentId({
		sessionKey,
		config: cfg,
		agentId: params.agentId
	});
	const storePath = resolveSessionStorePathCore(cfg.session?.store, { agentId });
	if (!storePath) return;
	await patchSessionEntryCore({
		storePath,
		sessionKey
	}, (entry) => {
		if (!entry.liveModelSwitchPending) return null;
		const persisted = resolveSelectionFromSessionEntry({
			cfg,
			entry,
			agentId,
			defaultProvider: DEFAULT_PROVIDER,
			defaultModel: DEFAULT_MODEL
		});
		if (!(providerUsed === persisted.provider && modelUsed === persisted.model || isAlreadyAppliedOpenAICodexRuntimePromotion({
			provider: providerUsed,
			model: modelUsed
		}, persisted))) return null;
		const next = { ...entry };
		delete next.liveModelSwitchPending;
		return next;
	}, { replaceEntry: true });
}
/**
* Clear the `liveModelSwitchPending` flag from the session entry on disk so
* subsequent retry iterations do not re-trigger the switch.
*/
async function clearLiveModelSwitchPending(params) {
	const sessionKey = params.sessionKey?.trim();
	const cfg = params.cfg;
	if (!cfg || !sessionKey) return;
	const storePath = resolveSessionStorePathCore(cfg.session?.store, { agentId: params.agentId?.trim() });
	if (!storePath) return;
	await patchSessionEntryCore({
		storePath,
		sessionKey
	}, (entry) => {
		const next = { ...entry };
		delete next.liveModelSwitchPending;
		return next;
	}, { replaceEntry: true });
}
//#endregion
export { mergeAttemptToolMediaPayloads as i, consolidateLiveModelSwitchAfterRun as n, shouldSwitchToLiveModel as r, clearLiveModelSwitchPending as t };
