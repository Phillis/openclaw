import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { s as sleepWithAbort } from "./src-BQ327IOM.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { s as resolveAgentConfig } from "./agent-scope-config-BdXMWufB.js";
import { h as resolveThreadSessionKeys } from "./session-key-D8GLfPr_.js";
import { i as shouldLogVerbose, r as logVerbose, t as danger } from "./globals-CAwGc4B6.js";
import { t as getGlobalHookRunner } from "./hook-runner-global-IYtayVps.js";
import { c as isReplyPayloadNonTerminalToolErrorWarning, o as getReplyPayloadTtsSupplement } from "./reply-payload-DVcGHORx.js";
import { i as resolveChannelDraftStreamingChunking, m as bindIngressLifecycleToReplyOptions } from "./channel-outbound-DhlIXa0y.js";
import { f as stripReasoningTagsFromText } from "./assistant-visible-text-CdBeRVUX.js";
import { r as stripInlineDirectiveTagsForDelivery } from "./directive-tags-CvzK-y8_.js";
import "./reply-payload-DBNGwex4.js";
import { a as resolveSendableOutboundReplyParts } from "./reply-payload-parts-CRXUQ13n.js";
import { i as resolveHumanDelayConfig, t as resolveAckReaction } from "./identity-hPPJEi06.js";
import { n as getAgentScopedMediaLocalRoots } from "./local-roots-Beya70q2.js";
import { E as resolveTranscriptBackedChannelFinalText, S as resolveChannelStreamingPreviewToolProgress, T as resolveChannelStreamingSuppressDefaultToolProgressMessages, n as buildChannelProgressDraftLineForEntry, p as resolveChannelPreviewStreamMode, t as buildChannelProgressDraftLine, v as resolveChannelStreamingBlockEnabled, w as resolveChannelStreamingProgressNarration, x as resolveChannelStreamingPreviewCommandText } from "./streaming-3t37hp7G.js";
import { t as readAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-Ovu6kj_3.js";
import { l as readSessionUpdatedAt, m as resolveStorePath, r as getSessionEntry } from "./session-store-runtime-BsqwEEwm.js";
import { t as EmbeddedBlockChunker } from "./embedded-agent-block-chunker-BDFESe1L.js";
import { t as buildAgentSessionKey } from "./resolve-route-CUq-ePT_.js";
import { o as resolvePinnedMainDmOwnerFromAllowlist } from "./dm-policy-shared-DqJhfdto.js";
import { s as resolveChunkMode } from "./chunk-DbIKi2Y2.js";
import { a as deliverWithFinalizableLivePreviewAdapter, r as defineFinalizableLivePreviewAdapter } from "./live-BkLbrfBk.js";
import { l as buildInboundHistoryFromEntries, s as buildHistoryContextFromEntries } from "./history-DLKGD0Dj.js";
import "./error-runtime-CmlvK1A3.js";
import "./runtime-env-COkbgBI4.js";
import { t as expectDefined } from "./expect-runtime--WgnKYXT.js";
import "./routing-DG_rmd7A.js";
import "./agent-runtime-BOIKP1my.js";
import "./text-utility-runtime-LRU688AB.js";
import "./security-runtime-Bm9RUgAZ.js";
import { t as evaluateSupplementalContextVisibility } from "./context-visibility-C5CaKMWO.js";
import "./text-chunking-DrVvfnLf.js";
import { t as convertMarkdownTables } from "./tables-Bu53rjrA.js";
import { o as readLatestAssistantTextByIdentity } from "./session-transcript-runtime-BrQue-7k.js";
import "./media-runtime-C6qiOSZe.js";
import "./plugin-runtime-BiPnM-6w.js";
import { a as resolveEnvelopeFormatOptions, r as formatInboundEnvelope } from "./envelope-dDJDsvuE.js";
import { i as shouldAckReaction } from "./ack-reactions-GIPTG1Wz.js";
import { f as toHistoryMediaEntries, m as toInboundMediaFactsWithMetadata, r as buildChannelInboundEventContext, u as formatInboundMediaUnavailableText } from "./run-channel-turn-CC5VYUIa.js";
import { n as hasFinalChannelTurnDispatch } from "./dispatch-result-DaybJgme.js";
import { t as createTypingCallbacks } from "./typing-BdTQBR6k.js";
import { n as resolveChannelSourceReplyDeliveryMode, t as createChannelReplyPipeline } from "./reply-pipeline-CH_BtvSb.js";
import { t as resolveMarkdownTableMode } from "./markdown-tables-DAUsjtN3.js";
import { n as isDangerousNameMatchingEnabled } from "./dangerous-name-matching-5xYA17l_.js";
import { t as resolveChannelContextVisibilityMode } from "./context-visibility-81UhELj4.js";
import { n as createChannelProgressDraftCompositor, r as createChannelProgressReceiptTracker } from "./progress-draft-compositor-DKnaJSAY.js";
import "./reply-chunking-Bm5QeUSE.js";
import { r as dispatchChannelInboundTurn } from "./channel-inbound-C_BpWedI.js";
import { r as logTypingFailure, t as logAckFailure } from "./logging-gUWPKC5g.js";
import { n as createFinalizableDraftLifecycle } from "./draft-stream-controls-CzidI4eh.js";
import "./conversation-runtime-C-lCCwrS.js";
import "./markdown-table-runtime-yelWZff9.js";
import "./dangerous-name-runtime-DPfCb05r.js";
import { a as DEFAULT_TIMING, c as createStatusReactionController } from "./channel-feedback-DgI18dCP.js";
import { t as createChannelHistoryWindow } from "./reply-history-ydRF4RaB.js";
import { f as resolveDiscordMaxLinesPerMessage } from "./accounts-B99sjC_p.js";
import { Vt as ChannelType, ct as editChannelMessage, ot as deleteChannelMessage, rt as createChannelMessage } from "./discord-BinpTEur.js";
import { _ as resolveDiscordMessageFlags, d as resolveDiscordTargetChannelId } from "./send.shared-AS0AC-JP.js";
import { d as createDiscordRestClient, f as createDiscordRuntimeAccountContext } from "./send.permissions-g2olELEg.js";
import { i as resolveTimestampMs } from "./format-DFB1xYxQ.js";
import { a as normalizeDiscordSlug, r as normalizeDiscordAllowList } from "./allow-list-63Tv49Q4.js";
import { n as resolveDiscordChannelId } from "./target-parsing-BCrLMCew.js";
import { t as discordTextHasBroadcastMention } from "./mentions-ClF_uUn_.js";
import { t as chunkDiscordTextWithMode } from "./chunk-BQPwKawm.js";
import { s as editMessageDiscord } from "./send-CCZQ6nJ8.js";
import { n as DISCORD_ATTACHMENT_TOTAL_TIMEOUT_MS, t as DISCORD_ATTACHMENT_IDLE_TIMEOUT_MS } from "./timeouts-BTHN67kZ.js";
import { i as removeReactionDiscord, n as reactMessageDiscord } from "./send.reactions-DZnd9v7u.js";
import "./targets-CjO8laGa.js";
import { t as discordInboundEventDelivery } from "./inbound-event-delivery-h8Th1s9l.js";
import { t as resolveDiscordConversationIdentity } from "./conversation-identity-CT3fAIh9.js";
import { t as DISCORD_TEXT_CHUNK_LIMIT } from "./outbound-adapter-DS_CT83g.js";
import { a as formatDiscordMediaText, c as resolveReferencedReplyMediaList, i as resolveDiscordMessageText, u as resolveDiscordMessageStickers } from "./message-utils-BeutZHJD.js";
import { c as resolveDiscordThreadStarter, r as resolveDiscordAutoThreadReplyPlan } from "./threading-QEW3tASB.js";
import { n as resolveDiscordWebhookId } from "./sender-identity-Chk7ntJ0.js";
import { n as buildDiscordInboundAccessContext, r as createDiscordSupplementalContextAccessChecker } from "./inbound-context-LNOe6n_S.js";
import { a as buildDirectLabel, i as sanitizeDiscordFrontChannelReplyPayloads, n as formatDiscordReplyDeliveryFailure, o as buildGuildLabel, r as formatDiscordReplySkip, s as resolveReplyContext, t as deliverDiscordReply } from "./reply-delivery-w8UNPTdC.js";
import { t as beginDiscordActiveTurnThreadRoute } from "./active-turn-thread-route-C6Rgw7ql.js";
import { n as filterDiscordHistoryEntriesForContext, t as createDiscordHistorySenderProvenance } from "./message-handler.history-DCm6NIm2.js";
import { t as sendTyping } from "./typing-CkrRDraE.js";
//#region extensions/discord/src/monitor/message-handler.retry.ts
const REPLY_SESSION_INIT_CONFLICT_MESSAGE_RE = /^reply session initialization conflicted for \S+$/u;
const DISCORD_SESSION_CONFLICT_FAILURE_TEXT = "⚠️ Couldn't process this message because the session stayed busy. Please try again in a moment.";
function isReplySessionInitConflictError(error) {
	const message = error instanceof Error ? error.message : String(error);
	return REPLY_SESSION_INIT_CONFLICT_MESSAGE_RE.test(message);
}
async function completeDiscordSessionConflict(error, deliver, onDeliveryError) {
	if (!isReplySessionInitConflictError(error)) return false;
	try {
		await deliver({
			text: DISCORD_SESSION_CONFLICT_FAILURE_TEXT,
			isError: true
		}, { kind: "final" });
		return true;
	} catch (deliveryError) {
		onDeliveryError(deliveryError, { kind: "final" });
		throw new Error(`discord: reply session init conflict exhausted and terminal notice failed: ${String(deliveryError)}`, { cause: deliveryError });
	}
}
function removeDiscordReplayHistoryEntry(historyMap, historyKey, messageId) {
	const history = historyMap.get(historyKey);
	if (!history) return;
	for (let index = history.length - 1; index >= 0; index -= 1) if (history[index]?.messageId === messageId) history.splice(index, 1);
}
//#endregion
//#region extensions/discord/src/monitor/message-handler.context.ts
function normalizeDiscordDmOwnerEntry(entry) {
	const candidate = normalizeDiscordAllowList([entry], [
		"discord:",
		"user:",
		"pk:"
	])?.ids.values().next().value;
	return typeof candidate === "string" && /^\d+$/.test(candidate) ? candidate : void 0;
}
function isContextAborted(abortSignal) {
	return Boolean(abortSignal?.aborted);
}
async function buildDiscordMessageProcessContext(params) {
	const { ctx, text, mediaList } = params;
	const { cfg, discordConfig, accountId, runtime, botUserId, mediaMaxBytes, discordRestFetch, abortSignal, guildHistories, historyLimit, replyToMode, message, author, sender, canonicalMessageId, data, client, channelInfo, channelName, messageChannelId, isGuildMessage, isDirectMessage, baseText, preflightAudioTranscript, threadChannel, threadParentId, threadParentName, threadParentType, threadName, displayChannelSlug, guildInfo, guildSlug, memberRoleIds, channelConfig, baseSessionKey, boundSessionKey, route, commandAuthorized, resolveChannelIngress } = ctx;
	const fromLabel = isDirectMessage ? buildDirectLabel(author) : buildGuildLabel({
		guild: data.guild ?? void 0,
		channelName: channelName ?? messageChannelId,
		channelId: messageChannelId
	});
	const senderLabel = sender.label;
	const isForumParent = threadParentType === ChannelType.GuildForum || threadParentType === ChannelType.GuildMedia;
	const forumParentSlug = isForumParent && threadParentName ? normalizeDiscordSlug(threadParentName) : "";
	const threadChannelId = threadChannel?.id;
	const threadParentInheritanceEnabled = discordConfig?.thread?.inheritParent ?? false;
	const forumContextLine = Boolean(threadChannelId && isForumParent && forumParentSlug) && message.id === threadChannelId ? `[Forum parent: #${forumParentSlug}]` : null;
	const groupChannel = isGuildMessage && displayChannelSlug ? `#${displayChannelSlug}` : void 0;
	const senderName = sender.isPluralKit ? sender.name ?? author.username : data.member?.nickname ?? author.globalName ?? author.username;
	const senderUsername = sender.isPluralKit ? sender.tag ?? sender.name ?? author.username : author.username;
	const { groupSystemPrompt, ownerAllowFrom, channelStructuredContext } = buildDiscordInboundAccessContext({
		channelConfig,
		guildInfo,
		sender: {
			id: sender.id,
			name: sender.name,
			tag: sender.tag
		},
		allowNameMatching: isDangerousNameMatchingEnabled(discordConfig),
		isGuild: isGuildMessage,
		channelTopic: channelInfo?.topic
	});
	const pinnedMainDmOwner = isDirectMessage ? resolvePinnedMainDmOwnerFromAllowlist({
		dmScope: cfg.session?.dmScope,
		allowFrom: channelConfig?.users ?? guildInfo?.users,
		normalizeEntry: normalizeDiscordDmOwnerEntry
	}) : null;
	const contextVisibilityMode = resolveChannelContextVisibilityMode({
		cfg,
		channel: "discord",
		accountId
	});
	const isSupplementalContextSenderAllowed = createDiscordSupplementalContextAccessChecker({
		channelConfig,
		guildInfo,
		allowNameMatching: isDangerousNameMatchingEnabled(discordConfig),
		isGuild: isGuildMessage
	});
	const storePath = resolveStorePath(cfg.session?.store, { agentId: route.agentId });
	const envelopeOptions = resolveEnvelopeFormatOptions(cfg);
	const previousTimestamp = readSessionUpdatedAt({
		storePath,
		sessionKey: route.sessionKey
	});
	const channelHistory = createChannelHistoryWindow({ historyMap: guildHistories });
	let visibleChannelHistory;
	const unavailableMediaCount = mediaList.filter((media) => !media.path).length;
	const appendMediaUnavailableNotice = (body) => unavailableMediaCount > 0 ? formatInboundMediaUnavailableText({
		body,
		notice: `[discord ${unavailableMediaCount > 1 ? `${unavailableMediaCount} attachments` : "attachment"} unavailable]`
	}) : body;
	const bodyWithMediaNotice = appendMediaUnavailableNotice(text) ?? text;
	let combinedBody = formatInboundEnvelope({
		channel: "Discord",
		from: fromLabel,
		timestamp: resolveTimestampMs(message.timestamp),
		body: bodyWithMediaNotice,
		chatType: isDirectMessage ? "direct" : "channel",
		senderLabel,
		previousTimestamp,
		envelope: envelopeOptions
	});
	const shouldIncludeChannelHistory = !isDirectMessage && (ctx.inboundEventKind === "room_event" || !(isGuildMessage && channelConfig?.autoThread && !threadChannel));
	if (shouldIncludeChannelHistory) {
		removeDiscordReplayHistoryEntry(guildHistories, messageChannelId, message.id);
		if (historyLimit > 0) {
			const filteredHistory = filterDiscordHistoryEntriesForContext({
				entries: guildHistories.get(messageChannelId) ?? [],
				mode: contextVisibilityMode,
				isSenderAllowed: isSupplementalContextSenderAllowed
			});
			visibleChannelHistory = filteredHistory.entries;
			if (filteredHistory.omitted > 0) logVerbose(`discord: omit ${filteredHistory.omitted} pending history entries (mode=${contextVisibilityMode})`);
			combinedBody = buildHistoryContextFromEntries({
				entries: visibleChannelHistory,
				currentMessage: combinedBody,
				formatEntry: (entry) => formatInboundEnvelope({
					channel: "Discord",
					from: fromLabel,
					timestamp: entry.timestamp,
					body: `${entry.body} [id:${entry.messageId ?? "unknown"} channel:${messageChannelId}]`,
					chatType: "channel",
					senderLabel: entry.sender,
					envelope: envelopeOptions
				}),
				excludeLast: false
			});
		}
	}
	const replyContext = resolveReplyContext(message, resolveDiscordMessageText);
	const replySenderAllowed = replyContext ? isSupplementalContextSenderAllowed({
		id: replyContext.senderId,
		name: replyContext.senderName,
		tag: replyContext.senderTag,
		memberRoleIds: replyContext.memberRoleIds
	}) : true;
	const replyVisible = evaluateSupplementalContextVisibility({
		mode: contextVisibilityMode,
		kind: "quote",
		senderAllowed: replySenderAllowed
	}).include;
	if (replyContext && !replyVisible && isGuildMessage) logVerbose(`discord: drop reply context (mode=${contextVisibilityMode})`);
	if (forumContextLine) combinedBody = `${combinedBody}\n${forumContextLine}`;
	let threadStarterBody;
	let threadLabel;
	let parentSessionKey;
	let modelParentSessionKey;
	if (threadChannel) {
		if (channelConfig?.includeThreadStarter !== false) {
			const starter = await resolveDiscordThreadStarter({
				channel: threadChannel,
				client,
				parentId: threadParentId,
				parentType: threadParentType,
				resolveTimestampMs
			});
			if (starter?.text) if (evaluateSupplementalContextVisibility({
				mode: contextVisibilityMode,
				kind: "thread",
				senderAllowed: isSupplementalContextSenderAllowed({
					id: starter.authorId,
					name: starter.authorName ?? starter.author,
					tag: starter.authorTag,
					memberRoleIds: starter.memberRoleIds
				})
			}).include) threadStarterBody = starter.text;
			else logVerbose(`discord: drop thread starter context (mode=${contextVisibilityMode})`);
		}
		const parentName = threadParentName ?? "parent";
		threadLabel = threadName ? `Discord thread #${normalizeDiscordSlug(parentName)} › ${threadName}` : `Discord thread #${normalizeDiscordSlug(parentName)}`;
		if (threadParentId) {
			parentSessionKey = buildAgentSessionKey({
				agentId: route.agentId,
				channel: route.channel,
				peer: {
					kind: "channel",
					id: threadParentId
				}
			});
			modelParentSessionKey = parentSessionKey;
		}
		if (!threadParentInheritanceEnabled) parentSessionKey = void 0;
	}
	const preflightAudioIndex = preflightAudioTranscript === void 0 ? -1 : mediaList.findIndex((media) => media.contentType?.startsWith("audio/"));
	const threadKeys = resolveThreadSessionKeys({
		baseSessionKey,
		threadId: threadChannel ? messageChannelId : void 0,
		parentSessionKey,
		useSuffix: false
	});
	const replyPlan = await resolveDiscordAutoThreadReplyPlan({
		client,
		message,
		messageChannelId,
		isGuildMessage,
		channelConfig: ctx.inboundEventKind === "room_event" ? null : channelConfig,
		threadChannel,
		channelType: channelInfo?.type,
		channelName: channelInfo?.name,
		channelDescription: channelInfo?.topic,
		baseText: baseText ?? "",
		combinedBody,
		replyToMode,
		agentId: route.agentId,
		channel: route.channel,
		cfg,
		threadParentInheritanceEnabled
	});
	const deliverTarget = replyPlan.deliverTarget;
	const replyTarget = replyPlan.replyTarget;
	const replyReference = replyPlan.replyReference;
	const autoThreadContext = replyPlan.autoThreadContext;
	const effectiveFrom = isDirectMessage ? `discord:${author.id}` : autoThreadContext?.From ?? `discord:channel:${messageChannelId}`;
	const dmConversationTarget = isDirectMessage ? resolveDiscordConversationIdentity({
		isDirectMessage,
		userId: author.id
	}) : void 0;
	const effectiveTo = autoThreadContext?.To ?? dmConversationTarget ?? replyTarget;
	if (!effectiveTo) {
		runtime.error(danger("discord: missing reply target"));
		return null;
	}
	const lastRouteTo = dmConversationTarget ?? effectiveTo;
	const inboundHistory = shouldIncludeChannelHistory ? buildInboundHistoryFromEntries({
		entries: visibleChannelHistory ?? [],
		limit: historyLimit
	}) : void 0;
	const originatingTo = autoThreadContext?.OriginatingTo ?? dmConversationTarget ?? replyTarget;
	const effectiveSessionKey = boundSessionKey ?? autoThreadContext?.SessionKey ?? threadKeys.sessionKey;
	const effectivePreviousTimestamp = effectiveSessionKey === route.sessionKey ? previousTimestamp : readSessionUpdatedAt({
		storePath,
		sessionKey: effectiveSessionKey
	});
	const channelIngress = await resolveChannelIngress({
		agentId: route.agentId,
		sessionKey: effectiveSessionKey,
		messageId: canonicalMessageId ?? message.id,
		inboundEventKind: ctx.inboundEventKind
	}, {
		parentId: threadChannel ? threadParentId : void 0,
		threadId: threadChannel?.id ?? autoThreadContext?.createdThreadId ?? void 0
	});
	const ctxPayload = await (ctx.buildContext ?? buildChannelInboundEventContext)({
		channelIngress,
		channel: "discord",
		resolveSupplementalMedia: true,
		contextVisibility: contextVisibilityMode,
		accountId: route.accountId,
		messageId: canonicalMessageId ?? message.id,
		messageIdFull: canonicalMessageId && canonicalMessageId !== message.id ? message.id : void 0,
		timestamp: resolveTimestampMs(message.timestamp),
		from: effectiveFrom,
		sender: {
			id: sender.id,
			name: senderName,
			username: senderUsername,
			tag: sender.tag,
			roles: memberRoleIds,
			displayLabel: senderLabel,
			isBot: author.bot && !sender.isPluralKit ? true : void 0
		},
		conversation: {
			kind: isDirectMessage ? "direct" : "channel",
			id: messageChannelId,
			nativeChannelId: messageChannelId,
			label: fromLabel,
			spaceId: isGuildMessage ? (guildInfo?.id ?? guildSlug) || void 0 : void 0,
			parentId: threadChannel ? threadParentId : void 0,
			threadId: threadChannel?.id ?? autoThreadContext?.createdThreadId ?? void 0
		},
		route: {
			agentId: route.agentId,
			dmScope: route.dmScope,
			accountId: route.accountId,
			routeSessionKey: route.sessionKey,
			dispatchSessionKey: effectiveSessionKey,
			parentSessionKey: autoThreadContext?.ParentSessionKey ?? threadKeys.parentSessionKey,
			modelParentSessionKey: autoThreadContext?.ModelParentSessionKey ?? modelParentSessionKey ?? void 0
		},
		reply: {
			to: effectiveTo,
			...originatingTo !== effectiveTo ? { originatingTo } : {}
		},
		message: {
			inboundEventKind: ctx.inboundEventKind,
			body: combinedBody,
			rawBody: preflightAudioTranscript ?? baseText,
			bodyForAgent: appendMediaUnavailableNotice(preflightAudioTranscript ?? baseText ?? text),
			commandBody: preflightAudioTranscript ?? baseText,
			inboundHistory
		},
		sessionTranscript: { historyLimit: shouldIncludeChannelHistory ? historyLimit : 0 },
		access: {
			mentions: {
				canDetectMention: ctx.canDetectMention,
				wasMentioned: ctx.effectiveWasMentioned,
				hasAnyMention: ctx.hasAnyMention,
				requireMention: ctx.shouldRequireMention,
				effectiveWasMentioned: ctx.effectiveWasMentioned
			},
			commands: { authorized: commandAuthorized }
		},
		commandTurn: {
			kind: "text-slash",
			source: "text",
			authorized: commandAuthorized,
			body: preflightAudioTranscript ?? baseText
		},
		media: await toInboundMediaFactsWithMetadata(mediaList, { transcribed: (_media, index) => index === preflightAudioIndex }),
		supplemental: {
			quote: replyContext && replyVisible ? {
				id: replyContext.id,
				body: replyContext.body,
				sender: replyContext.sender,
				senderAllowed: replySenderAllowed,
				isSelf: Boolean(botUserId && replyContext.senderId === botUserId),
				media: async () => {
					const referencedReplyMediaList = await resolveReferencedReplyMediaList(message, mediaMaxBytes, {
						fetchImpl: discordRestFetch,
						ssrfPolicy: cfg.browser?.ssrfPolicy,
						readIdleTimeoutMs: DISCORD_ATTACHMENT_IDLE_TIMEOUT_MS,
						totalTimeoutMs: DISCORD_ATTACHMENT_TOTAL_TIMEOUT_MS,
						abortSignal
					});
					return isContextAborted(abortSignal) ? [] : await toInboundMediaFactsWithMetadata(referencedReplyMediaList);
				}
			} : void 0,
			thread: {
				starterBody: !effectivePreviousTimestamp ? threadStarterBody : void 0,
				label: threadLabel,
				senderAllowed: true
			},
			groupSystemPrompt: isGuildMessage ? groupSystemPrompt : void 0
		},
		extra: {
			...preflightAudioTranscript !== void 0 ? { Transcript: preflightAudioTranscript } : {},
			GroupSubject: isDirectMessage ? void 0 : groupChannel,
			GroupChannel: groupChannel,
			...isGuildMessage ? { GroupRequireMention: ctx.groupRequireMention } : {},
			ChannelStructuredContext: channelStructuredContext,
			OwnerAllowFrom: ownerAllowFrom
		}
	});
	const persistedSessionKey = ctxPayload.SessionKey ?? route.sessionKey;
	if (ctx.inboundEventKind === "room_event" && shouldIncludeChannelHistory) {
		const historyText = [text, formatDiscordMediaText({
			attachments: message.attachments ?? void 0,
			stickers: resolveDiscordMessageStickers(message)
		})].filter(Boolean).join("\n");
		await channelHistory.recordWithMedia({
			historyKey: messageChannelId,
			limit: historyLimit,
			entry: {
				sender: senderName,
				body: historyText,
				timestamp: resolveTimestampMs(message.timestamp),
				messageId: message.id,
				senderProvenance: createDiscordHistorySenderProvenance({
					sender,
					memberRoleIds
				})
			},
			media: toHistoryMediaEntries(mediaList, { messageId: message.id }),
			messageId: message.id
		});
	}
	if (shouldLogVerbose()) {
		const preview = truncateUtf16Safe(combinedBody, 200).replace(/\n/g, "\\n");
		logVerbose(`discord inbound: channel=${messageChannelId} deliver=${deliverTarget} from=${ctxPayload.From} preview="${preview}"`);
	}
	return {
		ctxPayload,
		persistedSessionKey,
		turn: {
			storePath,
			record: {
				updateLastRoute: {
					sessionKey: persistedSessionKey,
					channel: "discord",
					to: lastRouteTo,
					accountId: route.accountId,
					mainDmOwnerPin: isDirectMessage && persistedSessionKey === route.mainSessionKey && pinnedMainDmOwner ? {
						ownerRecipient: pinnedMainDmOwner,
						senderRecipient: author.id,
						onSkip: ({ ownerRecipient, senderRecipient }) => {
							logVerbose(`discord: skip main-session last route for ${senderRecipient} (pinned owner ${ownerRecipient})`);
						}
					} : void 0
				},
				onRecordError: (err) => {
					logVerbose(`discord: failed updating session meta: ${String(err)}`);
				}
			}
		},
		replyPlan,
		deliverTarget,
		replyTarget,
		replyReference
	};
}
//#endregion
//#region extensions/discord/src/monitor/message-handler.process-progress.ts
function isProcessAborted$1(abortSignal) {
	return Boolean(abortSignal?.aborted);
}
function isFailedProgress(payload) {
	return payload.phase === "error" || payload.status === "failed" || payload.status === "error" || typeof payload.exitCode === "number" && payload.exitCode !== 0;
}
function createDiscordMessageProgressRuntime(params) {
	const { ctx, draftPreview } = params;
	const { cfg, route, abortSignal } = ctx;
	const reasoningLevel = (() => {
		const normalizedAgentId = (route.agentId ?? "").trim().toLowerCase() || "main";
		const cfgDefault = cfg.agents?.list?.find((entry) => ((entry?.id ?? "").trim().toLowerCase() || "main") === normalizedAgentId)?.reasoningDefault ?? cfg.agents?.defaults?.reasoningDefault;
		const configDefault = cfgDefault === "on" || cfgDefault === "stream" ? cfgDefault : "off";
		if (!params.sessionKey) return configDefault;
		try {
			const storePath = resolveStorePath(cfg.session?.store, { agentId: route.agentId });
			const level = getSessionEntry({
				agentId: route.agentId,
				sessionKey: params.sessionKey,
				storePath
			})?.reasoningLevel;
			if (level === "on" || level === "stream" || level === "off") return level;
		} catch {
			return "off";
		}
		return configDefault;
	})();
	const reasoningDurableEnabled = reasoningLevel === "on";
	const reasoningWindowEnabled = reasoningLevel === "stream";
	let shouldYieldDraftCommentary = () => false;
	const progressReceipt = createChannelProgressReceiptTracker();
	const resetTurnState = () => {
		progressReceipt.reset();
	};
	const handleAssistantMessageBoundary = () => {
		if (draftPreview.handleAssistantMessageBoundary()) {
			resetTurnState();
			params.onTurnReset();
		}
	};
	const buildProgressSummaryLine = () => `-# ${progressReceipt.buildSummaryLine()}`;
	return {
		replyOptions: {
			onAssistantMessageStart: draftPreview.draftStream ? () => {
				handleAssistantMessageBoundary();
				return false;
			} : void 0,
			onReasoningEnd: draftPreview.draftStream ? () => {
				progressReceipt.closeReasoning();
				handleAssistantMessageBoundary();
				return false;
			} : void 0,
			onQueuedFollowupAdmitted: draftPreview.draftStream ? () => {
				if (draftPreview.handleQueuedFollowupAdmitted()) {
					resetTurnState();
					params.onTurnReset();
				}
			} : void 0,
			suppressDefaultToolProgressMessages: params.sourceRepliesAreToolOnly && params.reactions.statusReactionsExplicitlyEnabled || draftPreview.suppressDefaultToolProgressMessages ? true : void 0,
			allowToolLifecycleWhenProgressHidden: params.reactions.statusReactionsEnabled ? true : void 0,
			commentaryProgressEnabled: draftPreview.isProgressMode ? draftPreview.commentaryProgressEnabled : void 0,
			progressPreambleEnabled: draftPreview.draftStream && draftPreview.isProgressMode ? true : void 0,
			commentaryPayloadsEnabled: draftPreview.isProgressMode ? draftPreview.commentaryProgressEnabled : void 0,
			shouldDeliverCommentaryPayloads: draftPreview.isProgressMode && draftPreview.commentaryProgressEnabled ? () => shouldYieldDraftCommentary() : void 0,
			reasoningPayloadsEnabled: reasoningDurableEnabled,
			onVerboseProgressVisibility: (isActive) => {
				shouldYieldDraftCommentary = isActive;
			},
			onNarrationUpdate: draftPreview.narrationProgressEnabled ? async (payload) => {
				if (isProcessAborted$1(abortSignal) || shouldYieldDraftCommentary()) return;
				await draftPreview.pushNarrationProgress(payload.text);
			} : void 0,
			onProgressNarratorLifecycle: draftPreview.narrationProgressEnabled ? (lifecycle) => draftPreview.setProgressNarratorLifecycle(lifecycle) : void 0,
			isProgressDraftVisible: draftPreview.narrationProgressEnabled ? () => draftPreview.isProgressDraftVisible : void 0,
			narrationHideCommandText: draftPreview.narrationHideCommandText ? true : void 0,
			onReasoningStream: async (payload) => {
				if (payload?.requiresReasoningProgressOptIn === true && !reasoningWindowEnabled) return false;
				if (payload?.text) progressReceipt.noteReasoning();
				await params.reactions.controller.setThinking();
				return await draftPreview.pushReasoningProgress(payload?.text, { snapshot: payload?.isReasoningSnapshot === true });
			},
			streamReasoningInNonStreamModes: reasoningWindowEnabled,
			onToolStart: async (payload) => {
				if (isProcessAborted$1(abortSignal)) return false;
				await params.reactions.maybeBindToToolReaction(payload);
				await params.reactions.controller.setTool(payload.name);
				if (payload.phase === "start") progressReceipt.noteToolCall(payload.name);
				return await draftPreview.pushToolEvent(payload);
			},
			onItemEvent: async (payload) => {
				if (isFailedProgress(payload)) return false;
				if (payload.kind === "preamble") {
					if (shouldYieldDraftCommentary()) return;
					return await draftPreview.pushPreambleItemEvent(payload, (itemId, text) => {
						progressReceipt.noteCommentary(itemId, text);
					});
				}
				return await draftPreview.pushItemEvent(payload);
			},
			onPlanUpdate: async (payload) => {
				if (payload.phase === "update") return await draftPreview.pushPlanProgress(payload.steps, { explanation: payload.explanation });
				return false;
			},
			onApprovalEvent: async (payload) => {
				return await draftPreview.pushApprovalEvent(payload);
			},
			onCommandOutput: async (payload) => {
				if (isFailedProgress(payload)) return false;
				return await draftPreview.pushCommandOutputEvent(payload);
			},
			onPatchSummary: async (payload) => {
				return await draftPreview.pushPatchEvent(payload);
			},
			onCompactionStart: async () => {
				if (!isProcessAborted$1(abortSignal)) await params.reactions.controller.setCompacting();
				return false;
			},
			onCompactionEnd: async () => {
				if (!isProcessAborted$1(abortSignal)) {
					params.reactions.controller.cancelPending();
					await params.reactions.controller.setThinking();
				}
				return false;
			}
		},
		buildProgressSummaryLine
	};
}
//#endregion
//#region extensions/discord/src/monitor/ack-reactions.ts
function createDiscordAckReactionContext(params) {
	return {
		rest: params.rest,
		...createDiscordRuntimeAccountContext({
			cfg: params.cfg,
			accountId: params.accountId
		})
	};
}
function createDiscordAckReactionAdapter(params) {
	return {
		setReaction: async (emoji) => {
			await reactMessageDiscord(params.channelId, params.messageId, emoji, params.reactionContext);
		},
		removeReaction: async (emoji) => {
			await removeReactionDiscord(params.channelId, params.messageId, emoji, params.reactionContext);
		}
	};
}
function queueInitialDiscordAckReaction(params) {
	if (params.enabled) {
		params.statusReactions.setQueued();
		return;
	}
	if (!params.shouldSendAckReaction || !params.ackReaction) return;
	params.reactionAdapter.setReaction(params.ackReaction).catch((err) => {
		logAckFailure({
			log: logVerbose,
			channel: "discord",
			target: params.target,
			error: err
		});
	});
}
//#endregion
//#region extensions/discord/src/monitor/message-handler.process-reactions.ts
function readToolStringArg(args, key) {
	const value = args[key];
	return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function readToolBooleanArg(args, key) {
	return args[key] === true;
}
function createDiscordMessageReactionRuntime(params) {
	const { ctx } = params;
	const { cfg, accountId, token, ackReactionScope, message, messageChannelId, isGuildMessage, isDirectMessage, isGroupDm, canDetectMention, effectiveWasMentioned, shouldBypassMention, route } = ctx;
	const ackReaction = resolveAckReaction(cfg, route.agentId, {
		channel: "discord",
		accountId
	});
	const shouldSendAckReaction = Boolean(ackReaction && shouldAckReaction({
		scope: ackReactionScope,
		inboundEventKind: ctx.inboundEventKind,
		isDirect: isDirectMessage,
		isGroup: isGuildMessage || isGroupDm,
		isMentionableGroup: isGuildMessage,
		canDetectMention,
		effectiveWasMentioned,
		shouldBypassMention
	}));
	const statusReactionsExplicitlyEnabled = cfg.messages?.statusReactions?.enabled === true;
	const statusReactionsEnabled = !params.isRoomEvent && shouldSendAckReaction && cfg.messages?.statusReactions?.enabled !== false && (!params.sourceRepliesAreToolOnly || statusReactionsExplicitlyEnabled);
	const feedbackRest = createDiscordRestClient({
		cfg,
		token,
		accountId
	}).rest;
	const deliveryRest = createDiscordRestClient({
		cfg,
		token,
		accountId
	}).rest;
	const ackReactionContext = createDiscordAckReactionContext({
		rest: feedbackRest,
		cfg,
		accountId
	});
	const discordAdapter = createDiscordAckReactionAdapter({
		channelId: messageChannelId,
		messageId: message.id,
		reactionContext: ackReactionContext
	});
	const statusReactionTiming = DEFAULT_TIMING;
	let statusReactionTarget = `${messageChannelId}/${message.id}`;
	let statusReactionsActive = statusReactionsEnabled;
	let statusReactions = createStatusReactionController({
		enabled: statusReactionsEnabled,
		adapter: discordAdapter,
		initialEmoji: ackReaction,
		emojis: void 0,
		timing: statusReactionTiming,
		onError: (err) => {
			logAckFailure({
				log: logVerbose,
				channel: "discord",
				target: statusReactionTarget,
				error: err
			});
		}
	});
	const resolveTrackedReactionChannelId = async (args) => {
		const target = readToolStringArg(args, "channelId") ?? readToolStringArg(args, "channel_id") ?? readToolStringArg(args, "to");
		if (!target) return messageChannelId;
		try {
			return resolveDiscordChannelId(target);
		} catch {
			return (await resolveDiscordTargetChannelId(target, {
				cfg,
				token,
				accountId
			})).channelId;
		}
	};
	const maybeBindToToolReaction = async (payload) => {
		if (params.sourceRepliesAreToolOnly || cfg.messages?.statusReactions?.enabled === false || payload.phase !== "start" || payload.name !== "message" || !payload.args) return;
		const args = payload.args;
		if (readToolStringArg(args, "action")?.toLowerCase() !== "react") return;
		if (!(readToolBooleanArg(args, "trackToolCalls") || readToolBooleanArg(args, "track_tool_calls"))) return;
		const emoji = readToolStringArg(args, "emoji");
		if (!emoji || readToolBooleanArg(args, "remove")) return;
		const trackedMessageId = readToolStringArg(args, "messageId") ?? readToolStringArg(args, "message_id") ?? message.id;
		let trackedChannelId;
		try {
			trackedChannelId = await resolveTrackedReactionChannelId(args);
		} catch (err) {
			logAckFailure({
				log: logVerbose,
				channel: "discord",
				target: `${readToolStringArg(args, "to") ?? readToolStringArg(args, "channelId") ?? messageChannelId}/${trackedMessageId}`,
				error: err
			});
			return;
		}
		statusReactionTarget = `${trackedChannelId}/${trackedMessageId}`;
		if (statusReactionsActive) statusReactions.clear();
		statusReactions = createStatusReactionController({
			enabled: true,
			adapter: createDiscordAckReactionAdapter({
				channelId: trackedChannelId,
				messageId: trackedMessageId,
				reactionContext: ackReactionContext
			}),
			initialEmoji: emoji,
			emojis: void 0,
			timing: statusReactionTiming,
			onError: (err) => {
				logAckFailure({
					log: logVerbose,
					channel: "discord",
					target: statusReactionTarget,
					error: err
				});
			}
		});
		statusReactionsActive = true;
		statusReactions.setQueued();
	};
	let initialAckReactionQueued = false;
	const queueInitialAckReactionAfterRecord = () => {
		if (initialAckReactionQueued) return;
		initialAckReactionQueued = true;
		if (statusReactionsEnabled) statusReactionsActive = true;
		queueInitialDiscordAckReaction({
			enabled: statusReactionsEnabled,
			shouldSendAckReaction,
			ackReaction,
			statusReactions,
			reactionAdapter: discordAdapter,
			target: `${messageChannelId}/${message.id}`
		});
	};
	const finish = async (result) => {
		if (statusReactionsActive) {
			if (result.dispatchAborted) {
				statusReactions.restoreInitial();
				return;
			}
			if (result.dispatchError || result.finalDeliveryFailed) await statusReactions.setError();
			else await statusReactions.setDone();
			statusReactions.restoreInitial();
		}
	};
	return {
		feedbackRest,
		deliveryRest,
		statusReactionsExplicitlyEnabled,
		statusReactionsEnabled,
		get controller() {
			return statusReactions;
		},
		maybeBindToToolReaction,
		queueInitialAckReactionAfterRecord,
		finish
	};
}
//#endregion
//#region extensions/discord/src/draft-chunking.ts
function resolveDiscordDraftStreamingChunking(cfg, accountId) {
	return resolveChannelDraftStreamingChunking(cfg, "discord", accountId, { fallbackLimit: DISCORD_TEXT_CHUNK_LIMIT });
}
//#endregion
//#region extensions/discord/src/draft-stream.ts
/** Discord messages cap at 2000 characters. */
const DISCORD_STREAM_MAX_CHARS = 2e3;
const DEFAULT_THROTTLE_MS = 1200;
const DISCORD_PREVIEW_ALLOWED_MENTIONS = { parse: [] };
function createDiscordDraftStream(params) {
	const maxChars = Math.min(params.maxChars ?? DISCORD_STREAM_MAX_CHARS, DISCORD_STREAM_MAX_CHARS);
	const throttleMs = Math.max(250, params.throttleMs ?? DEFAULT_THROTTLE_MS);
	const minInitialChars = params.minInitialChars;
	let channelId = params.channelId;
	const rest = params.rest;
	const flags = resolveDiscordMessageFlags({ suppressEmbeds: params.suppressEmbeds });
	const resolveReplyToMessageId = () => typeof params.replyToMessageId === "function" ? params.replyToMessageId() : params.replyToMessageId;
	const streamState = {
		stopped: false,
		final: false
	};
	let streamMessageId;
	let lastSentText = "";
	let streamGeneration = 0;
	let activeCreateGeneration;
	let discardActiveCreate = false;
	let retargetedCleanup = [];
	const sendOrEditStreamMessage = async (text) => {
		const generation = streamGeneration;
		if (streamState.stopped && !streamState.final) return false;
		const trimmed = text.trimEnd();
		if (!trimmed) return false;
		if (trimmed.length > maxChars) {
			streamState.stopped = true;
			params.warn?.(`discord stream preview stopped (text length ${trimmed.length} > ${maxChars})`);
			return false;
		}
		if (trimmed === lastSentText) return true;
		if (streamMessageId === void 0 && minInitialChars != null && !streamState.final) {
			if (trimmed.length < minInitialChars) return false;
		}
		lastSentText = trimmed;
		try {
			if (streamMessageId !== void 0) {
				await editChannelMessage(rest, channelId, streamMessageId, { body: {
					content: trimmed,
					allowed_mentions: DISCORD_PREVIEW_ALLOWED_MENTIONS,
					...flags ? { flags } : {}
				} });
				return true;
			}
			const replyToMessageId = resolveReplyToMessageId()?.trim();
			const messageReference = replyToMessageId ? {
				message_id: replyToMessageId,
				fail_if_not_exists: false
			} : void 0;
			activeCreateGeneration = generation;
			const sentMessageId = (await createChannelMessage(rest, channelId, { body: {
				content: trimmed,
				allowed_mentions: DISCORD_PREVIEW_ALLOWED_MENTIONS,
				...flags ? { flags } : {},
				...messageReference ? { message_reference: messageReference } : {}
			} }))?.id;
			const shouldDiscardStaleCreate = activeCreateGeneration === generation && discardActiveCreate;
			activeCreateGeneration = void 0;
			discardActiveCreate = false;
			if (generation !== streamGeneration) {
				if (shouldDiscardStaleCreate && typeof sentMessageId === "string" && sentMessageId) try {
					await deleteChannelMessage(rest, channelId, sentMessageId);
				} catch (err) {
					params.warn?.(`discord stale stream preview cleanup failed: ${formatErrorMessage(err)}`);
				}
				return true;
			}
			if (typeof sentMessageId !== "string" || !sentMessageId) {
				streamState.stopped = true;
				params.warn?.("discord stream preview stopped (missing message id from send)");
				return false;
			}
			streamMessageId = sentMessageId;
			return true;
		} catch (err) {
			if (activeCreateGeneration === generation) {
				activeCreateGeneration = void 0;
				discardActiveCreate = false;
			}
			if (generation !== streamGeneration) return true;
			streamState.stopped = true;
			params.warn?.(`discord stream preview failed: ${formatErrorMessage(err)}`);
			return false;
		}
	};
	const readMessageId = () => streamMessageId;
	const clearMessageId = () => {
		streamMessageId = void 0;
	};
	const isValidStreamMessageId = (value) => typeof value === "string";
	const deleteStreamMessage = async (messageId) => {
		await deleteChannelMessage(rest, channelId, messageId);
	};
	const { loop, update, stop, clear, discardPending, seal } = createFinalizableDraftLifecycle({
		throttleMs,
		state: streamState,
		sendOrEditStreamMessage,
		readMessageId,
		clearMessageId,
		isValidMessageId: isValidStreamMessageId,
		deleteMessage: deleteStreamMessage,
		warn: params.warn,
		warnPrefix: "discord stream preview cleanup failed"
	});
	const forceNewMessage = (mode = "preserve") => {
		if (mode === "discard" && activeCreateGeneration !== void 0) discardActiveCreate = true;
		streamGeneration += 1;
		streamState.stopped = false;
		streamState.final = false;
		streamMessageId = void 0;
		lastSentText = "";
		loop.resetPending();
		loop.resetThrottleWindow();
	};
	const cleanupRetargeted = async () => {
		const pending = retargetedCleanup;
		retargetedCleanup = [];
		for (const stale of pending) try {
			await deleteChannelMessage(rest, stale.channelId, stale.messageId);
		} catch (err) {
			retargetedCleanup.push(stale);
			params.warn?.(`discord stream preview retarget cleanup failed: ${formatErrorMessage(err)}`);
		}
	};
	const retarget = async (nextChannelId) => {
		const normalized = nextChannelId.trim();
		if (!normalized || normalized === channelId) return;
		await loop.waitForInFlight();
		const pendingText = loop.takePending?.() ?? "";
		const previousChannelId = channelId;
		const previousMessageId = streamMessageId;
		const previousText = pendingText || lastSentText;
		streamGeneration += 1;
		channelId = normalized;
		streamMessageId = void 0;
		lastSentText = "";
		streamState.stopped = false;
		streamState.final = false;
		loop.resetThrottleWindow();
		if (previousText) {
			update(previousText);
			await loop.flush();
		}
		if (previousMessageId) {
			const stale = {
				channelId: previousChannelId,
				messageId: previousMessageId
			};
			if (!streamMessageId) {
				retargetedCleanup.push(stale);
				throw new Error("discord stream preview retarget replacement failed");
			}
			try {
				await deleteChannelMessage(rest, previousChannelId, previousMessageId);
			} catch (err) {
				retargetedCleanup.push(stale);
				params.warn?.(`discord stream preview retarget cleanup failed: ${formatErrorMessage(err)}`);
			}
		}
	};
	const deleteCurrentMessage = async () => {
		loop.resetPending();
		await loop.waitForInFlight();
		const messageId = streamMessageId;
		streamMessageId = void 0;
		lastSentText = "";
		loop.resetThrottleWindow();
		if (!isValidStreamMessageId(messageId)) return;
		try {
			await deleteStreamMessage(messageId);
		} catch (err) {
			params.warn?.(`discord stream preview cleanup failed: ${formatErrorMessage(err)}`);
		}
	};
	params.log?.(`discord stream preview ready (maxChars=${maxChars}, throttleMs=${throttleMs})`);
	return {
		update,
		flush: loop.flush,
		messageId: () => streamMessageId,
		clear,
		deleteCurrentMessage,
		discardPending,
		seal,
		stop,
		retarget,
		cleanupRetargeted,
		forceNewMessage
	};
}
//#endregion
//#region extensions/discord/src/preview-streaming.ts
function resolveDiscordPreviewStreamMode(params = {}) {
	return resolveChannelPreviewStreamMode(params, "off");
}
//#endregion
//#region extensions/discord/src/monitor/message-handler.draft-preview.ts
function createDiscordDraftPreviewController(params) {
	const discordStreamMode = resolveDiscordPreviewStreamMode(params.discordConfig);
	const hookRunner = getGlobalHookRunner();
	const allowProviderPreview = !((hookRunner?.hasHooks("reply_payload_sending") ?? false) || (hookRunner?.hasHooks("message_sending") ?? false));
	const draftMaxChars = Math.min(params.textLimit, 2e3);
	const canStreamProgressDraftForToolOnlySource = params.sourceRepliesAreToolOnly && discordStreamMode === "progress";
	const previewAvailable = allowProviderPreview && (!params.sourceRepliesAreToolOnly || canStreamProgressDraftForToolOnlySource) && discordStreamMode !== "off";
	const accountBlockStreamingEnabled = resolveChannelStreamingBlockEnabled(params.discordConfig, {
		previewAvailable,
		blockStreamingDefault: params.cfg.agents?.defaults?.blockStreamingDefault
	});
	const draftStream = previewAvailable && !accountBlockStreamingEnabled ? createDiscordDraftStream({
		rest: params.deliveryRest,
		channelId: params.deliverChannelId,
		maxChars: draftMaxChars,
		replyToMessageId: () => params.replyReference.peek(),
		minInitialChars: discordStreamMode === "progress" ? 0 : 30,
		suppressEmbeds: params.discordConfig?.suppressEmbeds ?? true,
		throttleMs: 1200,
		log: params.log,
		warn: params.log
	}) : void 0;
	const draftChunking = draftStream && discordStreamMode === "block" ? resolveDiscordDraftStreamingChunking(params.cfg, params.accountId) : void 0;
	const shouldSplitPreviewMessages = discordStreamMode === "block";
	const draftChunker = draftChunking ? new EmbeddedBlockChunker(draftChunking) : void 0;
	let lastPartialText = "";
	let draftText = "";
	let hasStreamedMessage = false;
	let finalizedViaPreviewMessage = false;
	let finalReplyDelivered = false;
	let progressDraftStartedBeforeFinal = false;
	let progressDraftCollapsed = false;
	let progressNarratorLifecycle;
	const previewToolProgressEnabled = Boolean(draftStream) && resolveChannelStreamingPreviewToolProgress(params.discordConfig, true, discordStreamMode);
	const narrationProgressEnabled = Boolean(draftStream) && discordStreamMode === "progress" && resolveChannelStreamingProgressNarration(params.discordConfig);
	const narrationHideCommandText = narrationProgressEnabled && resolveChannelStreamingPreviewCommandText(params.discordConfig) === "status";
	const suppressDefaultToolProgressMessages = Boolean(draftStream) && resolveChannelStreamingSuppressDefaultToolProgressMessages(params.discordConfig, {
		draftStreamActive: true,
		previewToolProgressEnabled
	});
	const progressSeed = `${params.accountId}:${params.deliverChannelId}`;
	const progressDraft = createChannelProgressDraftCompositor({
		entry: params.discordConfig,
		mode: discordStreamMode,
		active: Boolean(draftStream),
		seed: progressSeed,
		reasoningLinePrefix: "🧠 ",
		commentaryLinePrefix: "💬 ",
		reasoningGate: previewToolProgressEnabled,
		commentaryItalics: false,
		buildProgressEventLine: (input, options) => input.event === "tool" || input.event === "item" || input.event === "command-output" ? buildChannelProgressDraftLineForEntry(params.discordConfig, input, options) : buildChannelProgressDraftLine(input, options),
		update: async (previewText, options) => {
			if (!draftStream) return false;
			lastPartialText = previewText;
			draftText = previewText;
			hasStreamedMessage = true;
			draftChunker?.reset();
			draftStream.update(previewText);
			if (options?.flush) await draftStream.flush();
			return Boolean(draftStream.messageId());
		},
		deleteCurrent: async () => {
			lastPartialText = "";
			draftText = "";
			hasStreamedMessage = false;
			if (draftStream?.messageId()) await draftStream.deleteCurrentMessage();
		},
		isEmptyLine: isEmptyDiscordProgressLine,
		shouldStartNow: shouldStartDiscordProgressDraftNow
	});
	const resetProgressState = () => {
		lastPartialText = "";
		draftText = "";
		draftChunker?.reset();
		progressDraft.reset();
	};
	const forceNewMessageIfNeeded = () => {
		if (shouldSplitPreviewMessages && hasStreamedMessage) {
			params.log("discord: calling forceNewMessage() for draft stream");
			draftStream?.forceNewMessage();
		}
		resetProgressState();
	};
	const pushPreambleHeadline = async (text, options) => {
		if (discordStreamMode === "progress") return await progressDraft.pushPreambleHeadline(text, options);
		return false;
	};
	const beginNewProgressTurn = (options) => {
		const beganNewTurn = progressDraft.beginNewTurn(options);
		if (beganNewTurn) {
			progressDraftCollapsed = false;
			progressDraftStartedBeforeFinal = false;
			finalReplyDelivered = false;
			finalizedViaPreviewMessage = false;
			progressNarratorLifecycle?.beginTurn();
		}
		if (discordStreamMode === "progress") {
			if (beganNewTurn) draftStream?.forceNewMessage("discard");
		} else forceNewMessageIfNeeded();
		return beganNewTurn;
	};
	return {
		draftStream,
		previewToolProgressEnabled,
		narrationProgressEnabled,
		narrationHideCommandText,
		commentaryProgressEnabled: progressDraft.commentaryProgressEnabled,
		suppressDefaultToolProgressMessages,
		get isProgressMode() {
			return discordStreamMode === "progress";
		},
		get hasProgressDraftStarted() {
			return progressDraft.hasStarted;
		},
		get isProgressDraftVisible() {
			return progressDraft.isVisible;
		},
		get hasProgressDraftToCollapse() {
			return !progressDraftCollapsed && (progressDraft.hasStarted || progressDraftStartedBeforeFinal);
		},
		markProgressDraftCollapsed() {
			progressDraftCollapsed = true;
			progressDraftStartedBeforeFinal = false;
		},
		get finalizedViaPreviewMessage() {
			return finalizedViaPreviewMessage;
		},
		setProgressNarratorLifecycle(lifecycle) {
			progressNarratorLifecycle = lifecycle;
		},
		markFinalReplyStarted() {
			progressDraftStartedBeforeFinal ||= progressDraft.hasStarted;
			progressDraft.markFinalReplyStarted();
			progressNarratorLifecycle?.stopTurn();
		},
		markFinalReplyDelivered() {
			finalReplyDelivered = true;
			progressDraft.markFinalReplyDelivered();
		},
		markPreviewFinalized() {
			finalizedViaPreviewMessage = true;
		},
		async retarget(channelId) {
			await draftStream?.retarget(channelId);
		},
		async finalizeProgressReceipt(receiptLine) {
			if (!draftStream || discordStreamMode !== "progress") return false;
			const receipt = receiptLine.trim();
			if (!receipt) return false;
			const progressText = lastPartialText.trimEnd();
			const maxProgressChars = Math.max(0, draftMaxChars - receipt.length - 1);
			const fittedProgressText = progressText.length > maxProgressChars ? progressText.slice(progressText.length - maxProgressChars).trimStart() : progressText;
			draftStream.update(fittedProgressText ? `${fittedProgressText}\n${receipt}` : receipt);
			await draftStream.stop();
			if (!draftStream.messageId()) return false;
			finalizedViaPreviewMessage = true;
			return true;
		},
		disableBlockStreamingForDraft: draftStream ? true : void 0,
		pushToolEvent: progressDraft.pushToolEvent,
		pushItemEvent: progressDraft.pushItemEvent,
		pushApprovalEvent: progressDraft.pushApprovalEvent,
		pushCommandOutputEvent: progressDraft.pushCommandOutputEvent,
		pushPatchEvent: progressDraft.pushPatchEvent,
		async pushToolProgress(line, options) {
			return await progressDraft.pushToolProgress(line, options);
		},
		async pushPlanProgress(steps, options) {
			return await progressDraft.pushPlanProgress(steps, options);
		},
		async pushReasoningProgress(text, options) {
			return await progressDraft.pushReasoningProgress(text, options);
		},
		async pushNarrationProgress(text) {
			return await progressDraft.pushNarrationProgress(text);
		},
		pushPreambleHeadline,
		async pushPreambleItemEvent(payload, noteCommentary) {
			const headlineAccepted = await pushPreambleHeadline(payload.progressText, { itemId: payload.itemId });
			if (!progressDraft.commentaryProgressEnabled) return headlineAccepted;
			const commentaryAccepted = await progressDraft.pushCommentaryProgress(payload.progressText, { itemId: payload.itemId });
			if (commentaryAccepted) noteCommentary(payload.itemId, payload.progressText);
			return headlineAccepted || commentaryAccepted;
		},
		async pushCommentaryProgress(text, options) {
			return await progressDraft.pushCommentaryProgress(text, options);
		},
		resolvePreviewFinalText(text) {
			if (typeof text !== "string") return;
			const formatted = convertMarkdownTables(stripInlineDirectiveTagsForDelivery(text).text, params.tableMode);
			const chunks = chunkDiscordTextWithMode(formatted, {
				maxChars: draftMaxChars,
				maxLines: params.maxLinesPerMessage,
				chunkMode: params.chunkMode
			});
			if (!chunks.length && formatted) chunks.push(formatted);
			if (chunks.length !== 1) return;
			const trimmed = expectDefined(chunks.at(0), "single Discord preview chunk").trim();
			if (!trimmed) return;
			const currentPreviewText = discordStreamMode === "block" ? draftText : lastPartialText;
			if (currentPreviewText && currentPreviewText.startsWith(trimmed) && trimmed.length < currentPreviewText.length) return;
			return trimmed;
		},
		updateFromPartial(text) {
			if (!draftStream || !text) return;
			const cleaned = stripInlineDirectiveTagsForDelivery(stripReasoningTagsFromText(text, {
				mode: "strict",
				trim: "both"
			})).text;
			if (!cleaned || cleaned.startsWith("Reasoning:\n")) return;
			if (cleaned === lastPartialText) return;
			if (discordStreamMode === "progress") return;
			progressDraft.suppress();
			hasStreamedMessage = true;
			if (discordStreamMode === "partial") {
				if (lastPartialText && lastPartialText.startsWith(cleaned) && cleaned.length < lastPartialText.length) return;
				lastPartialText = cleaned;
				draftStream.update(cleaned);
				return;
			}
			let delta = cleaned;
			if (cleaned.startsWith(lastPartialText)) delta = cleaned.slice(lastPartialText.length);
			else {
				draftChunker?.reset();
				draftText = "";
			}
			lastPartialText = cleaned;
			if (!delta) return;
			if (!draftChunker) {
				draftText = cleaned;
				draftStream.update(draftText);
				return;
			}
			draftChunker.append(delta);
			draftChunker.drain({
				force: false,
				emit: (chunk) => {
					draftText += chunk;
					draftStream.update(draftText);
				}
			});
		},
		handleAssistantMessageBoundary() {
			return beginNewProgressTurn();
		},
		handleQueuedFollowupAdmitted() {
			return beginNewProgressTurn({ force: true });
		},
		async flush() {
			if (!draftStream) return;
			if (draftChunker?.hasBuffered()) {
				draftChunker.drain({
					force: true,
					emit: (chunk) => {
						draftText += chunk;
					}
				});
				draftChunker.reset();
				if (draftText) draftStream.update(draftText);
			}
			await draftStream.flush();
		},
		async cleanup() {
			try {
				progressDraft.cancel();
				if (!finalReplyDelivered) await draftStream?.discardPending();
				if (!finalizedViaPreviewMessage && draftStream?.messageId()) await draftStream.clear();
				await draftStream?.cleanupRetargeted();
			} catch (err) {
				params.log(`discord: draft cleanup failed: ${String(err)}`);
			}
		}
	};
}
function isEmptyDiscordProgressLine(line) {
	if (!line || typeof line === "string") return false;
	return line.toolName === "apply_patch" && !line.detail && !line.status;
}
function shouldStartDiscordProgressDraftNow(line) {
	return typeof line === "object" && line?.kind === "patch" && Boolean(line.detail);
}
//#endregion
//#region extensions/discord/src/monitor/reply-typing-feedback.ts
const DISCORD_REPLY_TYPING_MAX_DURATION_MS = 20 * 6e4;
function createDiscordReplyTypingFeedback(params) {
	const rest = params.rest ?? createDiscordRestClient({
		cfg: params.cfg,
		token: params.token,
		accountId: params.accountId
	}).rest;
	return createTypingCallbacks({
		start: () => sendTyping({
			rest,
			channelId: params.channelId
		}),
		onStartError: (err) => {
			logTypingFailure({
				log: params.log,
				channel: "discord",
				target: params.channelId,
				error: err
			});
		},
		keepaliveIntervalMs: params.keepaliveIntervalMs,
		maxDurationMs: params.maxDurationMs ?? DISCORD_REPLY_TYPING_MAX_DURATION_MS
	});
}
//#endregion
//#region extensions/discord/src/monitor/message-handler.process-reply-runtime.ts
function formatDiscordReasoningQuote(quoteText) {
	const lines = quoteText.split("\n").map((line) => line.trim()).filter(Boolean);
	if (!lines.length) return;
	lines[0] = `🧠 ${lines[0]}`;
	return lines.map((line) => `> ${line}`).join("\n");
}
function createDiscordBeforePayloadDelivery(params) {
	return (payload, info) => {
		if (params.abortSignal?.aborted) {
			logVerbose(formatDiscordReplySkip({
				kind: info.kind,
				reason: "aborted before delivery",
				target: params.getDeliverTarget(),
				sessionKey: params.sessionKey
			}));
			return null;
		}
		if (payload.isReasoning || payload.isCommentary) return payload;
		if (params.draftPreview.draftStream && params.draftPreview.isProgressMode && info.kind === "block" && !resolveSendableOutboundReplyParts(payload).hasMedia && !payload.isError) return null;
		if (info.kind === "final" && !params.isFallbackOnlyToolWarningFinal(payload)) params.draftPreview.markFinalReplyStarted();
		return payload;
	};
}
function createDiscordMessageReplyRuntime(params) {
	const { ctx, processContext } = params;
	const { cfg, discordConfig, accountId, token, guildHistories, historyLimit, textLimit, messageChannelId, isDirectMessage, route } = ctx;
	const { ctxPayload, deliverTarget, replyReference } = processContext;
	const typingChannelId = deliverTarget.startsWith("channel:") ? deliverTarget.slice(8) : messageChannelId;
	let typingFeedback;
	const getTypingFeedback = () => typingFeedback ??= createDiscordReplyTypingFeedback({
		cfg,
		token,
		accountId,
		channelId: typingChannelId,
		rest: params.feedbackRest,
		log: logVerbose,
		keepaliveIntervalMs: params.shouldDisableCoreTypingKeepalive ? void 0 : 0
	});
	const { onModelSelected, ...replyPipeline } = createChannelReplyPipeline({
		cfg,
		agentId: route.agentId,
		channel: "discord",
		accountId: route.accountId,
		typingCallbacks: {
			onReplyStart: () => getTypingFeedback().onReplyStart(),
			onIdle: () => typingFeedback?.onIdle?.(),
			onCleanup: () => typingFeedback?.onCleanup?.()
		}
	});
	const tableMode = resolveMarkdownTableMode({
		cfg,
		channel: "discord",
		accountId
	});
	const maxLinesPerMessage = resolveDiscordMaxLinesPerMessage({
		cfg,
		discordConfig,
		accountId
	});
	const chunkMode = resolveChunkMode(cfg, "discord", accountId);
	const clearGroupHistory = () => {
		if (isDirectMessage) return;
		createChannelHistoryWindow({ historyMap: guildHistories }).clear({
			historyKey: messageChannelId,
			limit: historyLimit
		});
	};
	const beginDeliveryCorrelation = () => params.isRoomEvent ? discordInboundEventDelivery.begin(ctxPayload.SessionKey, {
		outboundTo: messageChannelId,
		outboundAccountId: route.accountId,
		markInboundEventDelivered: clearGroupHistory
	}, { inboundEventKind: ctxPayload.InboundEventKind }) : () => {};
	const endDeliveryCorrelation = beginDeliveryCorrelation();
	const resolveCurrentTurnTranscriptFinalText = async () => {
		const sessionKey = ctxPayload.SessionKey;
		if (!sessionKey) return;
		try {
			const storePath = resolveStorePath(cfg.session?.store, { agentId: route.agentId });
			const sessionEntry = getSessionEntry({
				agentId: route.agentId,
				sessionKey,
				storePath
			});
			if (!sessionEntry?.sessionId) return;
			const latest = await readLatestAssistantTextByIdentity({
				agentId: route.agentId,
				sessionId: sessionEntry.sessionId,
				sessionKey,
				storePath
			});
			if (!latest?.timestamp || latest.timestamp < params.dispatchStartedAt) return;
			return latest.text;
		} catch (err) {
			logVerbose(`discord transcript final candidate lookup failed: ${String(err)}`);
			return;
		}
	};
	const deliverChannelId = deliverTarget.startsWith("channel:") ? deliverTarget.slice(8) : messageChannelId;
	return {
		replyPipeline,
		onModelSelected,
		tableMode,
		maxLinesPerMessage,
		chunkMode,
		beginQueuedDeliveryCorrelation: beginDeliveryCorrelation,
		endDeliveryCorrelation,
		resolveCurrentTurnTranscriptFinalText,
		deliverChannelId,
		draftPreview: createDiscordDraftPreviewController({
			cfg,
			discordConfig,
			accountId,
			sourceRepliesAreToolOnly: params.sourceRepliesAreToolOnly,
			textLimit,
			deliveryRest: params.deliveryRest,
			deliverChannelId,
			replyReference,
			tableMode,
			maxLinesPerMessage,
			chunkMode,
			log: logVerbose
		}),
		resolvedBlockStreamingEnabled: resolveChannelStreamingBlockEnabled(discordConfig)
	};
}
//#endregion
//#region extensions/discord/src/monitor/message-handler.process-thread-route.ts
async function finalizeDiscordAdoptedThreadProgressReceipt(hasProgressDraft, receipt, finalizeDraft, deliverReceipt, onFinalizeError) {
	const receiptLine = receipt.trim();
	if (!hasProgressDraft || !receiptLine) return;
	try {
		if (await finalizeDraft(receiptLine)) return;
	} catch (error) {
		onFinalizeError?.(error);
	}
	await deliverReceipt(receiptLine);
}
function createDiscordMessageActiveThreadRoute(params) {
	let adoptedThreadId;
	let threadReplyDelivered = false;
	let onThreadAdopted;
	return {
		replyReference: {
			peek: () => adoptedThreadId ? void 0 : params.sourceReplyReference.peek(),
			use: () => adoptedThreadId ? void 0 : params.sourceReplyReference.use(),
			markSent: () => params.sourceReplyReference.markSent(),
			hasReplied: () => Boolean(adoptedThreadId) || params.sourceReplyReference.hasReplied()
		},
		bindThreadAdoption(callback) {
			onThreadAdopted = callback;
		},
		get threadReplyDelivered() {
			return threadReplyDelivered;
		},
		end: beginDiscordActiveTurnThreadRoute(params.sessionKey, {
			accountId: params.accountId,
			sourceChannelId: params.sourceChannelId,
			sourceMessageId: params.sourceMessageId,
			onThreadAdopted: async (threadId) => {
				adoptedThreadId = threadId;
				await onThreadAdopted?.(threadId);
			},
			onThreadReplyDelivered: () => {
				threadReplyDelivered = true;
			},
			onThreadAdoptionError: (error) => {
				params.log(`discord: failed to move active progress into adopted thread (${String(error)})`);
			}
		})
	};
}
//#endregion
//#region extensions/discord/src/monitor/message-handler.process.ts
const TARGETED_ONLY_ALLOWED_MENTIONS = { parse: ["users", "roles"] };
function isProcessAborted(abortSignal) {
	return Boolean(abortSignal?.aborted);
}
function isFallbackOnlyToolWarningFinal(payload) {
	if (payload.isError !== true || !isReplyPayloadNonTerminalToolErrorWarning(payload)) return false;
	return !resolveSendableOutboundReplyParts(payload).hasMedia;
}
async function processDiscordMessage(ctx, observer) {
	await processDiscordMessageInner(ctx, observer);
}
async function processDiscordMessageInner(ctx, observer) {
	const dispatchStartedAt = Date.now();
	const { cfg, accountId, token, runtime, textLimit, replyToMode, message, messageChannelId, isGuildMessage, isDirectMessage, isGroupDm, messageText, threadBindings, route, abortSignal, turnAdoptionLifecycle, preparedMedia: mediaList } = ctx;
	if (isProcessAborted(abortSignal)) return;
	const text = messageText;
	if (!text && mediaList.length === 0) {
		logVerbose("discord: drop message " + message.id + " (empty content)");
		return;
	}
	const boundThreadId = ctx.threadBinding?.conversation?.conversationId?.trim();
	if (boundThreadId && typeof threadBindings.touchThread === "function") threadBindings.touchThread({ threadId: boundThreadId });
	const sourceReplyDeliveryMode = resolveChannelSourceReplyDeliveryMode({
		cfg,
		ctx: {
			ChatType: isDirectMessage ? "direct" : isGroupDm ? "group" : isGuildMessage ? "channel" : void 0,
			InboundEventKind: ctx.inboundEventKind
		}
	});
	const sourceRepliesAreToolOnly = sourceReplyDeliveryMode === "message_tool_only";
	const configuredTypingMode = resolveAgentConfig(cfg, route.agentId)?.typingMode ?? cfg.agents?.defaults?.typingMode;
	const configuredTypingInterval = cfg.agents?.defaults?.typingIntervalSeconds;
	const shouldDisableCoreTypingKeepalive = sourceRepliesAreToolOnly && configuredTypingMode === void 0 && configuredTypingInterval === void 0;
	const mediaLocalRoots = getAgentScopedMediaLocalRoots(cfg, route.agentId);
	const isRoomEvent = ctx.inboundEventKind === "room_event";
	const reactions = createDiscordMessageReactionRuntime({
		ctx,
		sourceRepliesAreToolOnly,
		isRoomEvent
	});
	const processContext = await buildDiscordMessageProcessContext({
		ctx,
		text,
		mediaList
	});
	if (!processContext) return;
	const { ctxPayload, persistedSessionKey, turn, replyPlan, deliverTarget: initialDeliverTarget, replyTarget, replyReference: sourceReplyReference } = processContext;
	let deliverTarget = initialDeliverTarget;
	const activeThreadRoute = createDiscordMessageActiveThreadRoute({
		sessionKey: ctxPayload.SessionKey,
		accountId,
		sourceChannelId: messageChannelId,
		sourceMessageId: ctx.canonicalMessageId ?? message.id,
		sourceReplyReference,
		log: logVerbose
	});
	const replyReference = activeThreadRoute.replyReference;
	observer?.onReplyPlanResolved?.({
		createdThreadId: replyPlan.createdThreadId,
		sessionKey: persistedSessionKey
	});
	const { replyPipeline, onModelSelected, tableMode, maxLinesPerMessage, chunkMode, beginQueuedDeliveryCorrelation, endDeliveryCorrelation, resolveCurrentTurnTranscriptFinalText, deliverChannelId: initialDeliverChannelId, draftPreview, resolvedBlockStreamingEnabled } = createDiscordMessageReplyRuntime({
		ctx,
		processContext: {
			...processContext,
			replyReference
		},
		sourceRepliesAreToolOnly,
		shouldDisableCoreTypingKeepalive,
		isRoomEvent,
		dispatchStartedAt,
		feedbackRest: reactions.feedbackRest,
		deliveryRest: reactions.deliveryRest
	});
	let deliverChannelId = initialDeliverChannelId;
	activeThreadRoute.bindThreadAdoption(async (threadId) => {
		deliverTarget = `channel:${threadId}`;
		deliverChannelId = threadId;
		await draftPreview.retarget(threadId);
	});
	let finalReplyStartNotified = false;
	const notifyFinalReplyStart = () => {
		if (finalReplyStartNotified) return;
		finalReplyStartNotified = true;
		draftPreview.markFinalReplyStarted();
		observer?.onFinalReplyStart?.();
	};
	let userFacingFinalDelivered = false;
	let userFacingFinalDeliveryFailed = false;
	let pendingToolWarningFinal;
	const markUserFacingFinalDelivered = () => {
		userFacingFinalDelivered = true;
		userFacingFinalDeliveryFailed = false;
		pendingToolWarningFinal = void 0;
		draftPreview.markFinalReplyDelivered();
		observer?.onFinalReplyDelivered?.();
	};
	let progressReceiptLine;
	let clearProgressDraftAfterFinalDelivery = false;
	const resetDeliveryState = () => {
		finalReplyStartNotified = false;
		userFacingFinalDelivered = false;
		userFacingFinalDeliveryFailed = false;
		pendingToolWarningFinal = void 0;
		progressReceiptLine = void 0;
		clearProgressDraftAfterFinalDelivery = false;
	};
	const progress = createDiscordMessageProgressRuntime({
		ctx,
		sessionKey: ctxPayload.SessionKey,
		sourceRepliesAreToolOnly,
		draftPreview,
		reactions,
		onTurnReset: resetDeliveryState
	});
	let replyLifecycleStarted = false;
	const onDiscordReplyStart = async () => {
		if (isProcessAborted(abortSignal)) return;
		replyLifecycleStarted = true;
		await replyPipeline.typingCallbacks?.onReplyStart();
		await reactions.controller.setThinking();
	};
	const beforeDiscordPayloadDelivery = createDiscordBeforePayloadDelivery({
		abortSignal,
		getDeliverTarget: () => deliverTarget,
		sessionKey: ctxPayload.SessionKey,
		draftPreview,
		isFallbackOnlyToolWarningFinal
	});
	const deliverDiscordPayload = async (payload, info, options) => {
		if (isProcessAborted(abortSignal)) {
			logVerbose(formatDiscordReplySkip({
				kind: info.kind,
				reason: "aborted before delivery",
				target: deliverTarget,
				sessionKey: ctxPayload.SessionKey
			}));
			return { visibleReplySent: false };
		}
		const isFinal = info.kind === "final";
		if (payload.isReasoning) {
			const raw = (payload.text ?? "").trim();
			const body = raw.startsWith("Reasoning:\n") ? raw.slice(11).trim() : raw;
			if (!body) return { visibleReplySent: false };
			const chunks = chunkDiscordTextWithMode(body, {
				maxChars: Math.max(256, Math.min(textLimit, 2e3) - 8),
				maxLines: maxLinesPerMessage,
				chunkMode
			});
			const replies = (chunks.length ? chunks : [body]).map((chunk) => formatDiscordReasoningQuote(chunk)).filter((quote) => Boolean(quote)).map((quote) => Object.assign({}, payload, {
				text: quote,
				isReasoning: void 0
			}));
			if (!replies.length) return { visibleReplySent: false };
			const result = await deliverDiscordReply({
				cfg,
				replies,
				target: deliverTarget,
				token,
				accountId,
				rest: reactions.deliveryRest,
				runtime,
				replyToId: replyReference.use(),
				replyToMode,
				textLimit,
				maxLinesPerMessage,
				tableMode,
				chunkMode,
				sessionKey: ctxPayload.SessionKey,
				threadBindings,
				mediaLocalRoots,
				kind: "block",
				bindPendingFinalDelivery: info.bindPendingFinalDelivery
			});
			if (result.visibleReplySent) replyReference.markSent();
			return result;
		}
		if (isFinal && !options?.allowFallbackOnlyToolWarning && isFallbackOnlyToolWarningFinal(payload)) {
			if (!userFacingFinalDelivered && (!finalReplyStartNotified || userFacingFinalDeliveryFailed)) pendingToolWarningFinal = {
				payload,
				info
			};
			return { visibleReplySent: false };
		}
		if (isFinal) draftPreview.markFinalReplyStarted();
		const finalText = isFinal && typeof payload.text === "string" ? await resolveTranscriptBackedChannelFinalText({
			finalText: payload.text,
			resolveCandidateText: resolveCurrentTurnTranscriptFinalText
		}) : payload.text;
		const [deliverablePayload] = sanitizeDiscordFrontChannelReplyPayloads([finalText !== payload.text ? {
			...payload,
			text: finalText
		} : payload], { kind: info.kind });
		if (!deliverablePayload) {
			logVerbose(formatDiscordReplySkip({
				kind: info.kind,
				reason: "internal-only payload",
				target: deliverTarget,
				sessionKey: ctxPayload.SessionKey
			}));
			return { visibleReplySent: false };
		}
		if (isFinal && !replyLifecycleStarted && !isRoomEvent && configuredTypingMode !== "never") await onDiscordReplyStart();
		const draftStream = draftPreview.draftStream;
		if (draftStream && draftPreview.isProgressMode && info.kind === "block" && !options?.allowProgressBlock) {
			if (!resolveSendableOutboundReplyParts(deliverablePayload).hasMedia && !deliverablePayload.isError) return { visibleReplySent: false };
		}
		if (draftStream && isFinal && draftPreview.isProgressMode && !deliverablePayload.isError && draftPreview.hasProgressDraftToCollapse && draftStream) {
			await draftPreview.flush();
			progressReceiptLine = progress.buildProgressSummaryLine();
			clearProgressDraftAfterFinalDelivery = true;
		}
		if (draftStream && isFinal && !draftPreview.isProgressMode && !deliverablePayload.isError) {
			const ttsSupplement = getReplyPayloadTtsSupplement(deliverablePayload);
			if ((await deliverWithFinalizableLivePreviewAdapter({
				kind: info.kind,
				payload: deliverablePayload,
				adapter: defineFinalizableLivePreviewAdapter({
					draft: {
						flush: () => draftPreview.flush(),
						clear: () => draftStream.clear(),
						discardPending: () => draftStream.discardPending(),
						seal: () => draftStream.seal(),
						id: draftStream.messageId
					},
					buildFinalEdit: () => {},
					editFinal: async (previewMessageId, edit) => {
						if (isProcessAborted(abortSignal)) throw new Error("process aborted");
						notifyFinalReplyStart();
						await editMessageDiscord(deliverChannelId, previewMessageId, edit, {
							cfg,
							accountId,
							rest: reactions.deliveryRest
						});
					},
					onPreviewFinalized: () => {
						markUserFacingFinalDelivered();
						draftPreview.markPreviewFinalized();
						replyReference.markSent();
					},
					logPreviewEditFailure: (err) => {
						logVerbose(`discord: preview final edit failed; falling back to standard send (${String(err)})`);
					}
				}),
				deliverNormally: async () => {
					if (isProcessAborted(abortSignal)) return false;
					const fallbackPayload = ttsSupplement && ttsSupplement.visibleTextAlreadyDelivered !== true && !deliverablePayload.text?.trim() ? {
						...deliverablePayload,
						text: ttsSupplement.spokenText
					} : deliverablePayload;
					const allowedMentions = discordTextHasBroadcastMention(fallbackPayload.text ?? "") ? TARGETED_ONLY_ALLOWED_MENTIONS : void 0;
					const replyToId = replyReference.use();
					notifyFinalReplyStart();
					return (await deliverDiscordReply({
						cfg,
						replies: [fallbackPayload],
						target: deliverTarget,
						token,
						accountId,
						rest: reactions.deliveryRest,
						runtime,
						replyToId,
						replyToMode,
						textLimit,
						maxLinesPerMessage,
						tableMode,
						chunkMode,
						sessionKey: ctxPayload.SessionKey,
						threadBindings,
						mediaLocalRoots,
						allowedMentions,
						kind: info.kind,
						bindPendingFinalDelivery: info.bindPendingFinalDelivery
					})).visibleReplySent;
				},
				onNormalDelivered: () => {
					markUserFacingFinalDelivered();
					replyReference.markSent();
				}
			})).kind !== "normal-skipped") return { visibleReplySent: true };
		}
		if (isProcessAborted(abortSignal)) {
			logVerbose(formatDiscordReplySkip({
				kind: info.kind,
				reason: "aborted before delivery",
				target: deliverTarget,
				sessionKey: ctxPayload.SessionKey
			}));
			return { visibleReplySent: false };
		}
		const replyToId = replyReference.use();
		if (isFinal) notifyFinalReplyStart();
		const receiptLine = isFinal && deliverablePayload.isError !== true ? progressReceiptLine : void 0;
		const payloadForDelivery = receiptLine ? {
			...deliverablePayload,
			text: deliverablePayload.text?.trim() ? `${deliverablePayload.text.trimEnd()}\n${receiptLine}` : receiptLine
		} : deliverablePayload;
		const result = await deliverDiscordReply({
			cfg,
			replies: [payloadForDelivery],
			target: deliverTarget,
			token,
			accountId,
			rest: reactions.deliveryRest,
			runtime,
			replyToId,
			replyToMode,
			textLimit,
			maxLinesPerMessage,
			tableMode,
			chunkMode,
			sessionKey: ctxPayload.SessionKey,
			threadBindings,
			mediaLocalRoots,
			kind: info.kind,
			bindPendingFinalDelivery: info.bindPendingFinalDelivery
		});
		if (!result.visibleReplySent) return result;
		replyReference.markSent();
		if (isFinal && deliverablePayload.isError !== true) {
			if (receiptLine) {
				progressReceiptLine = void 0;
				draftPreview.markProgressDraftCollapsed();
			}
			markUserFacingFinalDelivered();
			if (clearProgressDraftAfterFinalDelivery) {
				clearProgressDraftAfterFinalDelivery = false;
				await draftStream?.discardPending();
				await draftStream?.clear();
			}
		}
		return result;
	};
	const onDiscordDeliveryError = (err, info) => {
		if (info.kind === "final" && finalReplyStartNotified && !userFacingFinalDelivered) userFacingFinalDeliveryFailed = true;
		runtime.error(danger(formatDiscordReplyDeliveryFailure({
			kind: info.kind,
			err,
			target: deliverTarget,
			sessionKey: ctxPayload.SessionKey
		})));
	};
	let dispatchResult = null;
	let dispatchError = false;
	let dispatchAborted = false;
	const deliverPendingToolWarningFinalIfNeeded = async () => {
		if (!pendingToolWarningFinal || userFacingFinalDelivered || isProcessAborted(abortSignal)) return;
		const pending = pendingToolWarningFinal;
		pendingToolWarningFinal = void 0;
		try {
			return await deliverDiscordPayload(pending.payload, pending.info, { allowFallbackOnlyToolWarning: true });
		} catch (err) {
			dispatchError = true;
			onDiscordDeliveryError(err, pending.info);
			return { visibleReplySent: false };
		}
	};
	try {
		if (isProcessAborted(abortSignal)) {
			dispatchAborted = true;
			return;
		}
		const preparedResult = await dispatchChannelInboundTurn({
			cfg,
			channel: "discord",
			accountId: route.accountId,
			outboundEchoSourceId: resolveDiscordWebhookId(message) ?? void 0,
			route: {
				agentId: route.agentId,
				sessionKey: persistedSessionKey
			},
			ctxPayload,
			afterRecord: reactions.queueInitialAckReactionAfterRecord,
			sessionInitRetry: {
				delaysMs: [
					250,
					1e3,
					2500
				],
				signal: abortSignal,
				sleep: sleepWithAbort
			},
			dispatcherOptions: {
				...replyPipeline,
				humanDelay: resolveHumanDelayConfig(cfg, route.agentId),
				beforeDeliver: beforeDiscordPayloadDelivery,
				onReplyStart: onDiscordReplyStart,
				onFreshSettledDelivery: deliverPendingToolWarningFinalIfNeeded
			},
			delivery: {
				deliverWithProviderMessageSending: deliverDiscordPayload,
				onError: onDiscordDeliveryError
			},
			record: turn.record,
			history: isRoomEvent ? void 0 : {
				isGroup: isGuildMessage,
				historyKey: messageChannelId,
				historyMap: ctx.guildHistories,
				limit: ctx.historyLimit
			},
			replyOptions: {
				...turnAdoptionLifecycle ? bindIngressLifecycleToReplyOptions(turnAdoptionLifecycle) : {},
				abortSignal,
				skillFilter: ctx.channelConfig?.skills,
				sourceReplyDeliveryMode,
				typingKeepalive: shouldDisableCoreTypingKeepalive ? false : void 0,
				queuedDeliveryCorrelations: isRoomEvent ? [{ begin: beginQueuedDeliveryCorrelation }] : void 0,
				suppressTyping: isRoomEvent ? true : void 0,
				allowProgressCallbacksWhenSourceDeliverySuppressed: sourceRepliesAreToolOnly && draftPreview.draftStream && draftPreview.isProgressMode ? true : void 0,
				disableBlockStreaming: sourceRepliesAreToolOnly ? true : draftPreview.disableBlockStreamingForDraft ?? (typeof resolvedBlockStreamingEnabled === "boolean" ? !resolvedBlockStreamingEnabled : void 0),
				onPartialReply: draftPreview.draftStream && !draftPreview.isProgressMode ? (payload) => draftPreview.updateFromPartial(payload.text) : void 0,
				...progress.replyOptions,
				onModelSelected
			}
		});
		if (!preparedResult.dispatched) return;
		dispatchResult = preparedResult.dispatchResult;
		if (isProcessAborted(abortSignal)) {
			dispatchAborted = true;
			return;
		}
		if (activeThreadRoute.threadReplyDelivered && !userFacingFinalDelivered) {
			draftPreview.markFinalReplyStarted();
			await finalizeDiscordAdoptedThreadProgressReceipt(draftPreview.hasProgressDraftToCollapse, progress.buildProgressSummaryLine(), (receiptLine) => draftPreview.finalizeProgressReceipt(receiptLine), (receiptText) => deliverDiscordPayload({ text: receiptText }, { kind: "block" }, { allowProgressBlock: true }), (error) => logVerbose(`discord: failed to finalize adopted thread progress (${String(error)})`));
			markUserFacingFinalDelivered();
		}
	} catch (err) {
		if (isProcessAborted(abortSignal)) {
			dispatchAborted = true;
			return;
		}
		dispatchError = true;
		if (await completeDiscordSessionConflict(err, deliverDiscordPayload, onDiscordDeliveryError)) return;
		throw err;
	} finally {
		activeThreadRoute.end();
		endDeliveryCorrelation();
		await draftPreview.cleanup();
		dispatchError ||= readAgentRunTerminalOutcome(dispatchResult) === "failed";
		const finalDeliveryFailed = (dispatchResult?.failedCounts?.final ?? 0) > 0;
		await reactions.finish({
			dispatchAborted,
			dispatchError,
			finalDeliveryFailed
		});
	}
	if (dispatchAborted) return;
	const finalDispatchResult = dispatchResult;
	if (!finalDispatchResult || !hasFinalChannelTurnDispatch(finalDispatchResult)) return;
	if (shouldLogVerbose()) {
		const finalCount = finalDispatchResult.counts.final;
		logVerbose(`discord: delivered ${finalCount} reply${finalCount === 1 ? "" : "ies"} to ${replyTarget}`);
	}
}
//#endregion
export { formatDiscordReplySkip, processDiscordMessage };
