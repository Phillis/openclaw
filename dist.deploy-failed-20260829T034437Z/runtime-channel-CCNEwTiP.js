import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { o as resolveSessionStorePathCore } from "./paths-DVAvlIOc.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { S as updateSessionLastRoute, _ as recordInboundSessionMeta, g as readSessionUpdatedAtCore } from "./session-accessor.sqlite-entry-CNdoUuFZ.js";
import "./session-accessor-B-FKZX9M.js";
import "./sessions-CdrF1uzY.js";
import "./logging-aRZskxqi.js";
import { f as saveMediaBuffer } from "./store-B6ILpvye.js";
import { a as shouldComputeCommandAuthorized, r as isControlCommandMessage, t as hasControlCommand } from "./command-detection-XNPlqOSe.js";
import { t as finalizeInboundContext } from "./inbound-context-G3To7LaP.js";
import { a as createReplyDispatcherWithTyping } from "./reply-dispatcher-DRSctPVt.js";
import { i as resolveHumanDelayConfig, r as resolveEffectiveMessagesConfig } from "./identity-Cc11oAxY.js";
import { n as resolveChannelGroupRequireMention, t as resolveChannelGroupPolicy } from "./group-policy-1fHWm2yO.js";
import { h as withReplyDispatcher, m as settleReplyDispatcher } from "./dispatch-from-config.finalize-CdP1lvBf.js";
import { t as dispatchReplyFromConfig } from "./dispatch-from-config-bb6A3t7Z.js";
import { a as saveResponseMedia, i as saveRemoteMedia, r as readRemoteMediaBuffer } from "./fetch-evq4MjQ1.js";
import { o as resolveAgentRoute, t as buildAgentSessionKey } from "./resolve-route-CaHBZG2x.js";
import { n as resolveSessionEntryResetFreshness } from "./entry-freshness-Dzk2YCn_.js";
import { t as loadChannelOutboundAdapter } from "./load-4FKBlQEg.js";
import { a as chunkText, c as resolveTextChunkLimit, i as chunkMarkdownTextWithMode, o as chunkTextWithMode, r as chunkMarkdownText, s as resolveChunkMode, t as chunkByNewline } from "./chunk-_fxsAvI_.js";
import { n as shouldHandleTextCommands } from "./commands-text-routing-Dn4j9R0-.js";
import "./commands-registry-DmQwXgfM.js";
import { n as matchesMentionPatterns, r as matchesMentionWithExplicit, t as buildMentionRegexes } from "./mentions-BHWGvP4S.js";
import "./dispatch-Dy4Hm8Bi.js";
import { t as dispatchReplyWithBufferedBlockDispatcherCore } from "./provider-dispatcher-bTlv9yXt.js";
import { t as convertMarkdownTables } from "./tables-DNKAswSM.js";
import { a as resolveEnvelopeFormatOptions, t as formatAgentEnvelope } from "./envelope-CiUE0My_.js";
import { n as resolveInboundDebounceMs, t as createInboundDebouncer } from "./inbound-debounce-5ARHlWJs.js";
import { i as shouldAckReaction, n as removeAckReactionAfterReply, r as removeAckReactionHandleAfterReply, t as createAckReactionHandle } from "./ack-reactions-Aw9rHWJe.js";
import { t as resolveCommandAuthorizedFromAuthorizers } from "./command-gating-65fgTdwb.js";
import { n as runChannelTurn, r as buildChannelInboundEventContext } from "./run-channel-turn-CMWbyBYF.js";
import { n as implicitMentionKindWhen, r as resolveInboundMentionDecision } from "./mention-gating-Cqy7URJJ.js";
import { n as setChannelConversationBindingMaxAgeBySessionKey, t as setChannelConversationBindingIdleTimeoutBySessionKey } from "./conversation-bindings-B68ZnH4c.js";
import { t as recordInboundSession } from "./session-BON_pp2B.js";
import { i as runPreparedChannelTurn, n as dispatchAssembledChannelTurn, r as dispatchRoutedChannelTurn } from "./lifecycle-C2A-fp2O.js";
import { t as resolveMarkdownTableMode } from "./markdown-tables-D_24uQPz.js";
import { n as recordChannelActivity, t as getChannelActivity } from "./channel-activity-KGHrbxIK.js";
import { t as buildPairingReply } from "./pairing-messages-Dj2tShxJ.js";
import { d as upsertChannelPairingRequest, l as removeChannelAllowFromStoreEntry, s as readChannelAllowFromStore } from "./pairing-store-CHm2POOL.js";
//#region src/plugins/runtime/channel-runtime-contexts.ts
const log = createSubsystemLogger("plugins/runtime-channel");
function normalizeRuntimeContextString(value) {
	return normalizeOptionalString(value) ?? "";
}
function normalizeRuntimeContextKey(params) {
	const channelId = normalizeRuntimeContextString(params.channelId);
	const capability = normalizeRuntimeContextString(params.capability);
	const accountId = normalizeRuntimeContextString(params.accountId);
	if (!channelId || !capability) return null;
	return {
		mapKey: `${channelId}\u0000${accountId}\u0000${capability}`,
		normalizedKey: {
			channelId,
			capability,
			...accountId ? { accountId } : {}
		}
	};
}
function doesRuntimeContextWatcherMatch(params) {
	if (params.watcher.channelId && params.watcher.channelId !== params.event.key.channelId) return false;
	if (params.watcher.accountId !== void 0 && params.watcher.accountId !== (params.event.key.accountId ?? "")) return false;
	if (params.watcher.capability && params.watcher.capability !== params.event.key.capability) return false;
	return true;
}
/** Creates the in-memory channel runtime context registry used by plugin runtime surfaces. */
function createChannelRuntimeContextRegistry() {
	const runtimeContexts = /* @__PURE__ */ new Map();
	const runtimeContextWatchers = /* @__PURE__ */ new Set();
	const emitRuntimeContextEvent = (event) => {
		for (const watcher of runtimeContextWatchers) {
			if (!doesRuntimeContextWatcherMatch({
				watcher: watcher.filter,
				event
			})) continue;
			try {
				watcher.onEvent(event);
			} catch (error) {
				const message = error instanceof Error ? error.message : String(error);
				log.error(`runtime context watcher failed during ${event.type} channel=${event.key.channelId} capability=${event.key.capability}` + (event.key.accountId ? ` account=${event.key.accountId}` : "") + `: ${message}`);
			}
		}
	};
	return {
		register: (params) => {
			const normalized = normalizeRuntimeContextKey(params);
			if (!normalized) return { dispose: () => {} };
			if (params.abortSignal?.aborted) return { dispose: () => {} };
			const token = Symbol(normalized.mapKey);
			let disposed = false;
			const dispose = () => {
				if (disposed) return;
				disposed = true;
				params.abortSignal?.removeEventListener("abort", dispose);
				const current = runtimeContexts.get(normalized.mapKey);
				if (!current || current.token !== token) return;
				runtimeContexts.delete(normalized.mapKey);
				emitRuntimeContextEvent({
					type: "unregistered",
					key: normalized.normalizedKey
				});
			};
			params.abortSignal?.addEventListener("abort", dispose, { once: true });
			if (params.abortSignal?.aborted) {
				dispose();
				return { dispose };
			}
			runtimeContexts.set(normalized.mapKey, {
				token,
				context: params.context,
				normalizedKey: normalized.normalizedKey
			});
			if (disposed) return { dispose };
			emitRuntimeContextEvent({
				type: "registered",
				key: normalized.normalizedKey,
				context: params.context
			});
			return { dispose };
		},
		get: (params) => {
			const normalized = normalizeRuntimeContextKey(params);
			if (!normalized) return;
			return runtimeContexts.get(normalized.mapKey)?.context;
		},
		watch: (params) => {
			const watcher = {
				filter: {
					...params.channelId?.trim() ? { channelId: params.channelId.trim() } : {},
					...params.accountId != null ? { accountId: params.accountId.trim() } : {},
					...params.capability?.trim() ? { capability: params.capability.trim() } : {}
				},
				onEvent: params.onEvent
			};
			runtimeContextWatchers.add(watcher);
			return () => {
				runtimeContextWatchers.delete(watcher);
			};
		}
	};
}
//#endregion
//#region src/plugins/runtime/runtime-channel.ts
function createRuntimeChannel(options) {
	const dispatchInbound = (params) => dispatchRoutedChannelTurn({
		...params,
		...options?.dispatchReplyFromConfig ? { dispatchReplyFromConfig: options.dispatchReplyFromConfig } : {}
	});
	const sessionRuntime = {
		resolveStorePath: resolveSessionStorePathCore,
		readSessionUpdatedAt: readSessionUpdatedAtCore,
		recordSessionMetaFromInbound: recordInboundSessionMeta,
		recordInboundSession,
		updateLastRoute: updateSessionLastRoute,
		resolveEntryResetFreshness: resolveSessionEntryResetFreshness
	};
	return {
		text: {
			chunkByNewline,
			chunkMarkdownText,
			chunkMarkdownTextWithMode,
			chunkText,
			chunkTextWithMode,
			resolveChunkMode,
			resolveTextChunkLimit,
			hasControlCommand,
			resolveMarkdownTableMode,
			convertMarkdownTables
		},
		reply: {
			dispatchReplyWithBufferedBlockDispatcher: dispatchReplyWithBufferedBlockDispatcherCore,
			createReplyDispatcherWithTyping,
			resolveEffectiveMessagesConfig,
			resolveHumanDelayConfig,
			dispatchReplyFromConfig: options?.dispatchReplyFromConfig ?? dispatchReplyFromConfig,
			withReplyDispatcher,
			settleReplyDispatcher,
			finalizeInboundContext,
			formatAgentEnvelope,
			resolveEnvelopeFormatOptions
		},
		routing: {
			buildAgentSessionKey,
			resolveAgentRoute
		},
		pairing: {
			buildPairingReply,
			readAllowFromStore: ({ channel, accountId, env }) => readChannelAllowFromStore(channel, env, accountId),
			removeAllowFromStoreEntry: ({ channel, entry, accountId, env, pairingAdapter }) => removeChannelAllowFromStoreEntry({
				channel,
				entry,
				accountId,
				env,
				pairingAdapter
			}),
			upsertPairingRequest: ({ channel, id, accountId, meta, env, pairingAdapter }) => upsertChannelPairingRequest({
				channel,
				id,
				accountId,
				meta,
				env,
				pairingAdapter
			})
		},
		media: {
			readRemoteMediaBuffer,
			fetchRemoteMedia: readRemoteMediaBuffer,
			saveRemoteMedia,
			saveResponseMedia,
			saveMediaBuffer
		},
		activity: {
			record: recordChannelActivity,
			get: getChannelActivity
		},
		session: sessionRuntime,
		mentions: {
			buildMentionRegexes,
			matchesMentionPatterns,
			matchesMentionWithExplicit,
			implicitMentionKindWhen,
			resolveInboundMentionDecision
		},
		reactions: {
			createAckReactionHandle,
			shouldAckReaction,
			removeAckReactionAfterReply,
			removeAckReactionHandleAfterReply
		},
		groups: {
			resolveGroupPolicy: resolveChannelGroupPolicy,
			resolveRequireMention: resolveChannelGroupRequireMention
		},
		debounce: {
			createInboundDebouncer,
			resolveInboundDebounceMs
		},
		commands: {
			resolveCommandAuthorizedFromAuthorizers,
			isControlCommandMessage,
			shouldComputeCommandAuthorized,
			shouldHandleTextCommands
		},
		outbound: { loadAdapter: loadChannelOutboundAdapter },
		inbound: {
			buildContext: buildChannelInboundEventContext,
			run: runChannelTurn,
			runPreparedReply: runPreparedChannelTurn,
			dispatch: dispatchInbound,
			dispatchReply: dispatchAssembledChannelTurn
		},
		threadBindings: {
			setIdleTimeoutBySessionKey: ({ channelId, targetSessionKey, accountId, idleTimeoutMs }) => setChannelConversationBindingIdleTimeoutBySessionKey({
				channelId,
				targetSessionKey,
				accountId,
				idleTimeoutMs
			}),
			setMaxAgeBySessionKey: ({ channelId, targetSessionKey, accountId, maxAgeMs }) => setChannelConversationBindingMaxAgeBySessionKey({
				channelId,
				targetSessionKey,
				accountId,
				maxAgeMs
			})
		},
		runtimeContexts: createChannelRuntimeContextRegistry()
	};
}
//#endregion
export { createRuntimeChannel as t };
