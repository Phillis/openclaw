import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { u as normalizeStringEntries } from "./string-normalization-e_fvmxMf.js";
import { t as DEFAULT_ACCOUNT_ID } from "./account-id-BRqK6RmF.js";
import { p as defineChannelMessageAdapter } from "./channel-outbound-BLZ5I8xo.js";
import { n as sanitizeAssistantVisibleText } from "./assistant-visible-text-CdBeRVUX.js";
import "./reply-payload-DBNGwex4.js";
import { i as resolveOutboundMediaUrls } from "./reply-payload-parts-CRXUQ13n.js";
import { n as listMessageReceiptPlatformIds } from "./receipt-_WMqEo47.js";
import { n as createChannelPartialDeliveryError } from "./delivery-result-DI1YgQUl.js";
import { t as clearAccountEntryFields } from "./config-helpers-CzQqpZhA.js";
import { a as createScopedChannelConfigAdapter } from "./channel-config-helpers-C6dKYMZI.js";
import { r as describeWebhookAccountSnapshot } from "./account-helpers-CEliAVvN.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import { t as createAccountStatusSink } from "./channel-lifecycle.core-C98dobNq.js";
import "./text-chunking-DrVvfnLf.js";
import { i as createChatChannelPlugin, t as buildChannelOutboundSessionRoute } from "./core-Bqt7fa3M.js";
import "./channel-inbound-BGRQ2Fep.js";
import { n as buildDmGroupAccountAllowlistAdapter, s as createFlatAllowlistOverrideResolver } from "./allowlist-config-edit-NQZ48Kwo.js";
import { d as createDefaultChannelRuntimeState, f as createDependentCredentialStatusIssueCollector, o as buildTokenChannelStatusSummary, u as createComputedAccountStatusAdapter } from "./status-helpers-C_Xyyv4E.js";
import "./channel-core-BRUYuJMt.js";
import { i as createPairingPrefixStripper } from "./channel-pairing-BBZdNgVG.js";
import { a as createRestrictSendersChannelSecurity, m as resolveScopeRequireMention, u as buildChannelGroupsScopeTree } from "./channel-policy-DlGVx39H.js";
import { a as createEmptyChannelResult, i as createAttachedChannelResultAdapter } from "./channel-send-result-BFAnsv6z.js";
import { r as createEmptyChannelDirectoryAdapter } from "./directory-runtime-DTJ8UiOr.js";
import { i as resolveLineAccount, r as resolveDefaultLineAccountId, t as listLineAccountIds } from "./accounts-BXGVFRfn.js";
import { i as hasLineCredentials, r as lineSetupContract, t as lineSetupWizard } from "./setup-surface-Ddo6di22.js";
import { i as resolveExactLineGroupConfigKey, n as getLineRuntime, t as buildLineQuickReplyFallbackText } from "./quick-reply-fallback-D3xDjvU6.js";
import { n as parseLineDirectives, r as LineChannelConfigSchema, t as hasLineDirectives } from "./reply-payload-transform-CGx-ENs1.js";
import { _ as createLineSendReceipt, b as resolveLineOutboundMedia, v as buildLineMediaMessage, y as hasLineSpecificMediaOptions } from "./flex-templates-D4V8U953.js";
//#region extensions/line/src/bindings.ts
function normalizeLineConversationId(raw) {
	const trimmed = raw?.trim() ?? "";
	if (!trimmed) return null;
	return (trimmed.match(/^line:(?:(?:user|group|room):)?(.+)$/i)?.[1] ?? trimmed).trim() || null;
}
function resolveLineCommandConversation(params) {
	const conversationId = normalizeLineConversationId(params.originatingTo) ?? normalizeLineConversationId(params.commandTo) ?? normalizeLineConversationId(params.fallbackTo);
	return conversationId ? { conversationId } : null;
}
function resolveLineInboundConversation(params) {
	const conversationId = normalizeLineConversationId(params.conversationId) ?? normalizeLineConversationId(params.to);
	return conversationId ? { conversationId } : null;
}
const lineBindingsAdapter = {
	compileConfiguredBinding: ({ conversationId }) => {
		const normalized = normalizeLineConversationId(conversationId);
		return normalized ? { conversationId: normalized } : null;
	},
	matchInboundConversation: ({ compiledBinding, conversationId }) => {
		const normalizedIncoming = normalizeLineConversationId(conversationId);
		if (!normalizedIncoming || compiledBinding.conversationId !== normalizedIncoming) return null;
		return {
			conversationId: normalizedIncoming,
			matchPriority: 2
		};
	},
	resolveCommandConversation: ({ originatingTo, commandTo, fallbackTo }) => resolveLineCommandConversation({
		originatingTo,
		commandTo,
		fallbackTo
	}),
	resolveInboundConversation: ({ to, conversationId }) => resolveLineInboundConversation({
		to,
		conversationId
	})
};
//#endregion
//#region extensions/line/src/config-adapter.ts
function normalizeLineAllowFrom(entry) {
	return entry.replace(/^line:(?:user:)?/i, "");
}
const lineConfigAdapter = createScopedChannelConfigAdapter({
	sectionKey: "line",
	listAccountIds: listLineAccountIds,
	resolveAccount: (cfg, accountId) => resolveLineAccount({
		cfg,
		accountId: accountId ?? void 0
	}),
	defaultAccountId: resolveDefaultLineAccountId,
	clearBaseFields: [
		"channelAccessToken",
		"channelSecret",
		"tokenFile",
		"secretFile",
		"name"
	],
	resolveAllowFrom: (account) => account.config.allowFrom,
	formatAllowFrom: (allowFrom) => normalizeStringEntries(allowFrom).map(normalizeLineAllowFrom)
});
const lineChannelPluginCommon = {
	meta: {
		id: "line",
		label: "LINE",
		selectionLabel: "LINE (Messaging API)",
		detailLabel: "LINE Bot",
		docsPath: "/channels/line",
		docsLabel: "line",
		blurb: "LINE Messaging API bot for Japan/Taiwan/Thailand markets.",
		systemImage: "message.fill",
		quickstartAllowFrom: true
	},
	capabilities: {
		chatTypes: ["direct", "group"],
		reactions: false,
		threads: false,
		media: true,
		nativeCommands: false,
		blockStreaming: true
	},
	reload: { configPrefixes: ["channels.line"] },
	configSchema: LineChannelConfigSchema,
	config: {
		...lineConfigAdapter,
		isConfigured: (account) => hasLineCredentials(account),
		describeAccount: (account) => describeWebhookAccountSnapshot({
			account,
			configured: hasLineCredentials(account),
			extra: {
				tokenSource: account.tokenSource ?? void 0,
				signingSecretSource: account.signingSecretSource ?? void 0,
				tokenStatus: account.tokenStatus,
				signingSecretStatus: account.signingSecretStatus
			}
		})
	}
};
//#endregion
//#region extensions/line/src/gateway.ts
const loadLineProbeRuntime$1 = createLazyRuntimeModule(() => import("./probe.runtime-CHBUpjCj.js"));
const loadLineMonitorRuntime = createLazyRuntimeModule(() => import("./monitor.runtime.js"));
const lineGatewayAdapter = {
	startAccount: async (ctx) => {
		const account = ctx.account;
		const statusSink = createAccountStatusSink({
			accountId: account.accountId,
			setStatus: ctx.setStatus
		});
		const token = account.channelAccessToken.trim();
		const secret = account.channelSecret.trim();
		if (!token) throw new Error(`LINE webhook mode requires a non-empty channel access token for account "${account.accountId}".`);
		if (!secret) throw new Error(`LINE webhook mode requires a non-empty channel secret for account "${account.accountId}".`);
		statusSink({ lifecycle: "starting" });
		let lineBotLabel = "";
		try {
			const probe = await (await loadLineProbeRuntime$1()).probeLineBot(token, 2500);
			const displayName = probe.ok ? probe.bot?.displayName?.trim() : null;
			if (displayName) lineBotLabel = ` (${displayName})`;
		} catch (err) {
			if (getLineRuntime().logging.shouldLogVerbose()) ctx.log?.debug?.(`[${account.accountId}] bot probe failed: ${String(err)}`);
		}
		ctx.log?.info(`[${account.accountId}] starting LINE provider${lineBotLabel}`);
		return await (getLineRuntime().channel.line?.monitorLineProvider ?? (await loadLineMonitorRuntime()).monitorLineProvider)({
			channelAccessToken: token,
			channelSecret: secret,
			accountId: account.accountId,
			config: ctx.cfg,
			runtime: ctx.runtime,
			buildContext: ctx.channelRuntime?.inbound.buildContext,
			abortSignal: ctx.abortSignal,
			webhookPath: account.config.webhookPath,
			statusSink
		});
	},
	logoutAccount: async ({ accountId, cfg }) => {
		const envToken = process.env.LINE_CHANNEL_ACCESS_TOKEN?.trim() ?? "";
		const nextCfg = { ...cfg };
		const nextLine = { ...cfg.channels?.line ?? {} };
		let cleared = false;
		let changed = false;
		if (accountId === "default") {
			if (nextLine.channelAccessToken || nextLine.channelSecret || nextLine.tokenFile || nextLine.secretFile) {
				delete nextLine.channelAccessToken;
				delete nextLine.channelSecret;
				delete nextLine.tokenFile;
				delete nextLine.secretFile;
				cleared = true;
				changed = true;
			}
		}
		const accountCleanup = clearAccountEntryFields({
			accounts: nextLine.accounts,
			accountId,
			fields: [
				"channelAccessToken",
				"channelSecret",
				"tokenFile",
				"secretFile"
			],
			markClearedOnFieldPresence: true
		});
		if (accountCleanup.changed) {
			changed = true;
			if (accountCleanup.cleared) cleared = true;
			if (accountCleanup.nextAccounts) nextLine.accounts = accountCleanup.nextAccounts;
			else delete nextLine.accounts;
		}
		if (changed) {
			if (Object.keys(nextLine).length > 0) nextCfg.channels = {
				...nextCfg.channels,
				line: nextLine
			};
			else {
				const nextChannels = { ...nextCfg.channels };
				delete nextChannels.line;
				if (Object.keys(nextChannels).length > 0) nextCfg.channels = nextChannels;
				else delete nextCfg.channels;
			}
			await getLineRuntime().config.replaceConfigFile({
				nextConfig: nextCfg,
				afterWrite: { mode: "auto" }
			});
		}
		const loggedOut = resolveLineAccount({
			cfg: changed ? nextCfg : cfg,
			accountId
		}).tokenSource === "none";
		return {
			cleared,
			envToken: Boolean(envToken),
			loggedOut
		};
	}
};
//#endregion
//#region extensions/line/src/group-policy.ts
function resolveLineGroupRequireMention(params) {
	const tree = buildChannelGroupsScopeTree(params.cfg, "line", params.accountId);
	const matchedKey = resolveExactLineGroupConfigKey({
		groups: tree.scopes,
		groupId: params.groupId
	});
	return resolveScopeRequireMention({
		tree,
		path: matchedKey ? [matchedKey] : []
	});
}
//#endregion
//#region extensions/line/src/messaging-target.ts
function normalizeLineMessagingTarget(target) {
	const trimmed = target.trim();
	if (!trimmed) return;
	return trimmed.replace(/^line:(group|room|user):/i, "").replace(/^line:/i, "");
}
function inferLineTargetChatType(target) {
	const normalized = normalizeLineMessagingTarget(target);
	if (!normalized) return;
	if (/^U[a-f0-9]{32}$/i.test(normalized)) return "direct";
	return /^[CR][a-f0-9]{32}$/i.test(normalized) ? "group" : void 0;
}
//#endregion
//#region extensions/line/src/outbound.ts
const loadLineOutboundRuntime = createLazyRuntimeModule(() => import("./outbound.runtime.js"));
const lineOutboundAdapter = {
	deliveryMode: "direct",
	chunker: (text, limit) => getLineRuntime().channel.text.chunkMarkdownText(text, limit),
	textChunkLimit: 5e3,
	sanitizeText: ({ text }) => sanitizeAssistantVisibleText(text),
	sendPayload: async ({ to, payload, accountId, cfg, onDeliveryResult }) => {
		const runtime = getLineRuntime();
		const outboundRuntime = await loadLineOutboundRuntime();
		const lineData = payload.channelData?.line ?? {};
		const lineRuntime = runtime.channel.line;
		const location = lineData.location;
		const locationMessage = location ? outboundRuntime.createLocationMessage(location) : null;
		const validLocation = locationMessage ? location : void 0;
		const sendText = lineRuntime?.pushMessageLine ?? outboundRuntime.pushMessageLine;
		const sendBatch = lineRuntime?.pushMessagesLine ?? outboundRuntime.pushMessagesLine;
		const sendFlex = lineRuntime?.pushFlexMessage ?? outboundRuntime.pushFlexMessage;
		const sendTemplate = lineRuntime?.pushTemplateMessage ?? outboundRuntime.pushTemplateMessage;
		const sendLocation = lineRuntime?.pushLocationMessage ?? outboundRuntime.pushLocationMessage;
		const sendQuickReplies = lineRuntime?.pushTextMessageWithQuickReplies ?? outboundRuntime.pushTextMessageWithQuickReplies;
		const buildTemplate = lineRuntime?.buildTemplateMessageFromPayload ?? outboundRuntime.buildTemplateMessageFromPayload;
		let lastResult = null;
		const recordResult = async (resultPromise) => {
			const result = await resultPromise;
			lastResult = result;
			try {
				await onDeliveryResult?.(createEmptyChannelResult("line", { ...result }));
			} catch (error) {
				throw createChannelPartialDeliveryError(error, {
					messageIds: listMessageReceiptPlatformIds(result.receipt),
					receipt: result.receipt,
					visibleReplySent: true
				});
			}
			return result;
		};
		const quickReplies = lineData.quickReplies ?? [];
		const hasQuickReplies = quickReplies.length > 0;
		const quickReply = hasQuickReplies ? (lineRuntime?.createQuickReplyItems ?? outboundRuntime.createQuickReplyItems)(quickReplies) : void 0;
		const sendMessageBatch = async (messages) => {
			if (messages.length === 0) return;
			for (let i = 0; i < messages.length; i += 5) {
				const batch = messages.slice(i, i + 5);
				await recordResult(sendBatch(to, batch, {
					verbose: false,
					cfg,
					accountId: accountId ?? void 0
				}));
			}
		};
		const processed = payload.text ? outboundRuntime.processLineMessage(payload.text) : {
			text: "",
			flexMessages: []
		};
		const chunkLimit = runtime.channel.text.resolveTextChunkLimit?.(cfg, "line", accountId ?? void 0, { fallbackLimit: 5e3 }) ?? 5e3;
		const orderedMessages = processed.segments?.flatMap((segment) => segment.type === "flex" ? [segment.message] : runtime.channel.text.chunkMarkdownText(segment.text, chunkLimit).map((text) => ({
			type: "text",
			text
		})));
		const chunks = orderedMessages ? orderedMessages.flatMap((message) => message.type === "text" ? [message.text] : []) : processed.text ? runtime.channel.text.chunkMarkdownText(processed.text, chunkLimit) : [];
		const mediaUrls = resolveOutboundMediaUrls(payload);
		const useLineSpecificMedia = hasLineSpecificMediaOptions(lineData);
		const mediaOptions = {
			mediaKind: useLineSpecificMedia ? lineData.mediaKind : "image",
			previewImageUrl: lineData.previewImageUrl,
			durationMs: lineData.durationMs,
			trackingId: lineData.trackingId
		};
		const shouldSendQuickRepliesInline = chunks.length === 0 && hasQuickReplies;
		const sendMediaMessages = async () => {
			for (const url of mediaUrls) {
				const trimmed = url?.trim();
				if (!trimmed) continue;
				if (!useLineSpecificMedia) {
					await recordResult((lineRuntime?.sendMessageLine ?? outboundRuntime.sendMessageLine)(to, "", {
						verbose: false,
						mediaUrl: trimmed,
						cfg,
						accountId: accountId ?? void 0
					}));
					continue;
				}
				const resolved = await resolveLineOutboundMedia(trimmed, mediaOptions);
				await recordResult((lineRuntime?.sendMessageLine ?? outboundRuntime.sendMessageLine)(to, "", {
					verbose: false,
					mediaUrl: resolved.mediaUrl,
					mediaKind: resolved.mediaKind,
					previewImageUrl: resolved.previewImageUrl,
					durationMs: resolved.durationMs,
					trackingId: resolved.trackingId,
					cfg,
					accountId: accountId ?? void 0
				}));
			}
		};
		if (!shouldSendQuickRepliesInline) {
			if (lineData.flexMessage) {
				const flexContents = lineData.flexMessage.contents;
				await recordResult(sendFlex(to, lineData.flexMessage.altText, flexContents, {
					verbose: false,
					cfg,
					accountId: accountId ?? void 0
				}));
			}
			if (lineData.templateMessage) {
				const template = buildTemplate(lineData.templateMessage);
				if (template) await recordResult(sendTemplate(to, template, {
					verbose: false,
					cfg,
					accountId: accountId ?? void 0
				}));
			}
			if (validLocation) await recordResult(sendLocation(to, validLocation, {
				verbose: false,
				cfg,
				accountId: accountId ?? void 0
			}));
			if (!orderedMessages) for (const flexMsg of processed.flexMessages) await recordResult(sendFlex(to, flexMsg.altText, flexMsg.contents, {
				verbose: false,
				cfg,
				accountId: accountId ?? void 0
			}));
		}
		const sendMediaAfterText = !(hasQuickReplies && chunks.length > 0);
		if (mediaUrls.length > 0 && !shouldSendQuickRepliesInline && !sendMediaAfterText) await sendMediaMessages();
		if (orderedMessages) for (const [index, message] of orderedMessages.entries()) {
			const isLast = index === orderedMessages.length - 1;
			if (message.type === "flex") if (isLast && quickReply) await sendMessageBatch([{
				...message,
				quickReply
			}]);
			else await recordResult(sendFlex(to, message.altText, message.contents, {
				verbose: false,
				cfg,
				accountId: accountId ?? void 0
			}));
			else if (isLast && hasQuickReplies) await recordResult(sendQuickReplies(to, message.text, quickReplies, {
				verbose: false,
				cfg,
				accountId: accountId ?? void 0
			}));
			else await recordResult(sendText(to, message.text, {
				verbose: false,
				cfg,
				accountId: accountId ?? void 0
			}));
		}
		else if (chunks.length > 0) for (const [i, chunk] of chunks.entries()) if (i === chunks.length - 1 && hasQuickReplies) await recordResult(sendQuickReplies(to, chunk, quickReplies, {
			verbose: false,
			cfg,
			accountId: accountId ?? void 0
		}));
		else await recordResult(sendText(to, chunk, {
			verbose: false,
			cfg,
			accountId: accountId ?? void 0
		}));
		else if (shouldSendQuickRepliesInline) {
			const quickReplyMessages = [];
			if (lineData.flexMessage) quickReplyMessages.push(outboundRuntime.createFlexMessage(lineData.flexMessage.altText, lineData.flexMessage.contents));
			if (lineData.templateMessage) {
				const template = buildTemplate(lineData.templateMessage);
				if (template) quickReplyMessages.push(template);
			}
			if (locationMessage) quickReplyMessages.push(locationMessage);
			for (const flexMsg of processed.flexMessages) quickReplyMessages.push(outboundRuntime.createFlexMessage(flexMsg.altText, flexMsg.contents));
			for (const url of mediaUrls) {
				const trimmed = url?.trim();
				if (!trimmed) continue;
				quickReplyMessages.push(await buildLineMediaMessage(trimmed, mediaOptions, to));
			}
			if (quickReplyMessages.length > 0 && quickReply) {
				const lastIndex = quickReplyMessages.length - 1;
				quickReplyMessages[lastIndex] = {
					...quickReplyMessages[lastIndex],
					quickReply
				};
				await sendMessageBatch(quickReplyMessages);
			} else if (quickReply) await recordResult(sendQuickReplies(to, buildLineQuickReplyFallbackText(quickReplies), quickReplies, {
				verbose: false,
				cfg,
				accountId: accountId ?? void 0
			}));
		}
		if (mediaUrls.length > 0 && !shouldSendQuickRepliesInline && sendMediaAfterText) await sendMediaMessages();
		const completedResult = lastResult;
		if (!completedResult) throw new Error("Message must be non-empty for LINE sends");
		return createEmptyChannelResult("line", { ...completedResult });
	},
	...createAttachedChannelResultAdapter({
		channel: "line",
		sendText: async (ctx) => await lineOutboundAdapter.sendPayload({
			...ctx,
			payload: { text: ctx.text }
		}),
		sendMedia: async ({ cfg, to, text, mediaUrl, accountId }) => await (await loadLineOutboundRuntime()).sendMessageLine(to, text, {
			verbose: false,
			mediaUrl,
			cfg,
			accountId: accountId ?? void 0
		})
	})
};
function toLineMessageSendResult(result, kind) {
	const source = result;
	const receipt = result.receipt ?? (result.messageId ? createLineSendReceipt({
		messageId: result.messageId,
		chatId: source.chatId ?? "",
		kind
	}) : void 0);
	if (!receipt) throw new Error("LINE message adapter send did not return a receipt");
	return {
		messageId: result.messageId || receipt.primaryPlatformMessageId,
		receipt
	};
}
const lineMessageAdapter = defineChannelMessageAdapter({
	id: "line",
	durableFinal: { capabilities: {
		text: true,
		media: true,
		messageSendingHooks: true
	} },
	send: {
		text: async ({ cfg, to, text, accountId, onDeliveryResult }) => {
			return toLineMessageSendResult(await lineOutboundAdapter.sendPayload({
				cfg,
				to,
				text,
				accountId,
				payload: { text },
				onDeliveryResult: async (deliveryResult) => {
					await onDeliveryResult?.(toLineMessageSendResult(deliveryResult, "text"));
				}
			}), "text");
		},
		media: async ({ cfg, to, text, mediaUrl, accountId, onDeliveryResult }) => {
			return toLineMessageSendResult(await lineOutboundAdapter.sendPayload({
				cfg,
				to,
				text,
				mediaUrl,
				accountId,
				payload: {
					text,
					mediaUrl
				},
				onDeliveryResult: async (deliveryResult) => {
					await onDeliveryResult?.(toLineMessageSendResult(deliveryResult, "media"));
				}
			}), "media");
		}
	},
	receive: {
		defaultAckPolicy: "after_receive_record",
		supportedAckPolicies: ["after_receive_record"]
	}
});
//#endregion
//#region extensions/line/src/status.ts
const loadLineProbeRuntime = createLazyRuntimeModule(() => import("./probe.runtime-CHBUpjCj.js"));
const collectLineStatusIssues = createDependentCredentialStatusIssueCollector({
	channel: "line",
	dependencySourceKey: "tokenSource",
	missingPrimaryMessage: "LINE channel access token not configured",
	missingDependentMessage: "LINE channel secret not configured"
});
const lineStatusAdapter = createComputedAccountStatusAdapter({
	defaultRuntime: createDefaultChannelRuntimeState(DEFAULT_ACCOUNT_ID),
	collectStatusIssues: collectLineStatusIssues,
	buildChannelSummary: ({ snapshot }) => buildTokenChannelStatusSummary(snapshot),
	probeAccount: async ({ account, timeoutMs }) => await (await loadLineProbeRuntime()).probeLineBot(account.channelAccessToken, timeoutMs),
	resolveAccountSnapshot: ({ account }) => ({
		accountId: account.accountId,
		name: account.name,
		enabled: account.enabled,
		configured: hasLineCredentials(account),
		extra: {
			tokenSource: account.tokenSource,
			signingSecretSource: account.signingSecretSource,
			tokenStatus: account.tokenStatus,
			signingSecretStatus: account.signingSecretStatus,
			mode: "webhook"
		}
	})
});
//#endregion
//#region extensions/line/src/channel.ts
const loadLineChannelRuntime = createLazyRuntimeModule(() => import("./channel.runtime-CZvYqnVb.js"));
const lineSecurityAdapter = createRestrictSendersChannelSecurity({
	channelKey: "line",
	resolveDmPolicy: (account) => account.config.dmPolicy,
	resolveDmAllowFrom: (account) => account.config.allowFrom,
	resolveGroupPolicy: (account) => account.config.groupPolicy,
	surface: "LINE groups",
	openScope: "any member in groups",
	groupPolicyPath: "channels.line.groupPolicy",
	groupAllowFromPath: "channels.line.groupAllowFrom",
	mentionGated: false,
	policyPathSuffix: "dmPolicy",
	approveHint: "openclaw pairing approve line <code>",
	normalizeDmEntry: (raw) => raw.replace(/^line:(?:user:)?/i, "")
});
const linePlugin = createChatChannelPlugin({
	base: {
		id: "line",
		...lineChannelPluginCommon,
		setupWizard: lineSetupWizard,
		groups: { resolveRequireMention: resolveLineGroupRequireMention },
		allowlist: buildDmGroupAccountAllowlistAdapter({
			channelId: "line",
			resolveAccount: ({ cfg, accountId }) => resolveLineAccount({
				cfg,
				accountId: accountId ?? void 0
			}),
			normalize: ({ cfg, accountId, values }) => lineConfigAdapter.formatAllowFrom({
				cfg,
				accountId,
				allowFrom: values
			}),
			resolveDmAllowFrom: (account) => account.config.allowFrom,
			resolveGroupAllowFrom: (account) => account.config.groupAllowFrom,
			resolveDmPolicy: (account) => account.config.dmPolicy,
			resolveGroupPolicy: (account) => account.config.groupPolicy,
			resolveGroupOverrides: createFlatAllowlistOverrideResolver({
				resolveRecord: (account) => account.config.groups,
				label: (groupId) => groupId,
				resolveEntries: (groupCfg) => groupCfg?.allowFrom
			})
		}),
		messaging: {
			targetPrefixes: ["line"],
			normalizeTarget: normalizeLineMessagingTarget,
			inferTargetChatType: ({ to }) => inferLineTargetChatType(to),
			resolveOutboundSessionRoute: ({ cfg, agentId, accountId, target }) => {
				const peerId = normalizeLineMessagingTarget(target);
				const chatType = inferLineTargetChatType(target);
				if (!peerId || !chatType) return null;
				const isRoom = peerId.startsWith("R");
				return buildChannelOutboundSessionRoute({
					cfg,
					agentId,
					channel: "line",
					accountId,
					recipientSessionExact: true,
					peer: {
						kind: chatType,
						id: peerId
					},
					chatType,
					from: chatType === "direct" ? `line:${peerId}` : isRoom ? `line:room:${peerId}` : `line:group:${peerId}`,
					to: peerId
				});
			},
			resolveInboundConversation: lineBindingsAdapter.resolveInboundConversation,
			transformReplyPayload: ({ payload }) => {
				if (!payload.text || !hasLineDirectives(payload.text)) return payload;
				return parseLineDirectives(payload);
			},
			targetResolver: {
				looksLikeId: (id) => {
					const trimmed = id?.trim();
					if (!trimmed) return false;
					return /^[UCR][a-f0-9]{32}$/i.test(trimmed) || /^line:/i.test(trimmed);
				},
				hint: "<userId|groupId|roomId>"
			}
		},
		directory: createEmptyChannelDirectoryAdapter(),
		setupContract: lineSetupContract,
		status: lineStatusAdapter,
		gateway: lineGatewayAdapter,
		message: lineMessageAdapter,
		bindings: lineBindingsAdapter,
		conversationBindings: { defaultTopLevelPlacement: "current" },
		agentPrompt: { messageToolHints: () => [
			"",
			"### LINE Rich Messages",
			"LINE supports rich visual messages. Use these directives in your reply when appropriate:",
			"",
			"**Quick Replies** (bottom button suggestions):",
			"  [[quick_replies: Option 1, Option 2, Option 3]]",
			"",
			"**Location** (map pin):",
			"  [[location: Place Name | Address | latitude | longitude]]",
			"",
			"**Confirm Dialog** (yes/no prompt):",
			"  [[confirm: Question text? | Yes Label | No Label]]",
			"",
			"**Button Menu** (title + text + buttons):",
			"  [[buttons: Title | Description | Btn1:action1, Btn2:https://url.com]]",
			"",
			"**Media Player Card** (music status):",
			"  [[media_player: Song Title | Artist Name | Source | https://albumart.url | playing]]",
			"  - Status: 'playing' or 'paused' (optional)",
			"",
			"**Event Card** (calendar events, meetings):",
			"  [[event: Event Title | Date | Time | Location | Description]]",
			"  - Time, Location, Description are optional",
			"",
			"**Agenda Card** (multiple events/schedule):",
			"  [[agenda: Schedule Title | Event1:9:00 AM, Event2:12:00 PM, Event3:3:00 PM]]",
			"",
			"**Device Control Card** (smart devices, TVs, etc.):",
			"  [[device: Device Name | Device Type | Status | Control1:data1, Control2:data2]]",
			"",
			"**Apple TV Remote** (full D-pad + transport):",
			"  [[appletv_remote: Apple TV | Playing]]",
			"",
			"**Auto-converted**: Markdown tables become Flex cards, code blocks become styled cards.",
			"",
			"When to use rich messages:",
			"- Use [[quick_replies:...]] when offering 2-4 clear options",
			"- Use [[confirm:...]] for yes/no decisions",
			"- Use [[buttons:...]] for menus with actions/links",
			"- Use [[location:...]] when sharing a place",
			"- Use [[media_player:...]] when showing what's playing",
			"- Use [[event:...]] for calendar event details",
			"- Use [[agenda:...]] for a day's schedule or event list",
			"- Use [[device:...]] for smart device status/controls",
			"- Tables/code in your response auto-convert to visual cards"
		] }
	},
	pairing: { text: {
		idLabel: "lineUserId",
		message: "OpenClaw: your access has been approved.",
		normalizeAllowEntry: createPairingPrefixStripper(/^line:(?:user:)?/i),
		notify: async ({ cfg, id, message }) => {
			const account = (getLineRuntime().channel.line?.resolveLineAccount ?? resolveLineAccount)({ cfg });
			if (!account.channelAccessToken) throw new Error("LINE channel access token not configured");
			await (getLineRuntime().channel.line?.pushMessageLine ?? (await loadLineChannelRuntime()).pushMessageLine)(id, message, {
				cfg,
				accountId: account.accountId,
				channelAccessToken: account.channelAccessToken
			});
		}
	} },
	security: lineSecurityAdapter,
	outbound: lineOutboundAdapter
});
//#endregion
export { lineChannelPluginCommon as n, linePlugin as t };
