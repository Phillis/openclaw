import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { u as normalizeStringEntries } from "./string-normalization-e_fvmxMf.js";
import { t as DEFAULT_ACCOUNT_ID } from "./account-id-BH0zJUew.js";
import { p as defineChannelMessageAdapter } from "./channel-outbound-DO-F9-0m.js";
import { n as sanitizeAssistantVisibleText } from "./assistant-visible-text-BMBDlrGB.js";
import { n as listMessageReceiptPlatformIds } from "./receipt-BzekpwQi.js";
import { C as resolveMessagePresentationButtonAction, T as resolveMessagePresentationOptionAction } from "./payload-C7E4iMOo.js";
import "./reply-payload-i0RzN2iF.js";
import { i as resolveOutboundMediaUrls } from "./reply-payload-parts-CJuHXrph.js";
import { n as clearAccountFieldsFromConfigSection } from "./config-helpers-Dwx1uD2b.js";
import { a as createScopedChannelConfigAdapter } from "./channel-config-helpers-C7An4wuC.js";
import { r as describeWebhookAccountSnapshot } from "./account-helpers-Cnv50TjD.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import { n as createChannelPartialDeliveryError } from "./delivery-result-BB-vQ7ul.js";
import { i as createChatChannelPlugin, t as buildChannelOutboundSessionRoute } from "./core-CQsT-38z.js";
import "./channel-inbound-BmDzyYQ4.js";
import { t as createAccountStatusSink } from "./channel-lifecycle.core-CnejcREy.js";
import "./text-chunking-CJz4kAsi.js";
import { n as buildDmGroupAccountAllowlistAdapter, s as createFlatAllowlistOverrideResolver } from "./allowlist-config-edit-LKsNZKOu.js";
import { d as createDefaultChannelRuntimeState, f as createDependentCredentialStatusIssueCollector, o as buildTokenChannelStatusSummary, u as createComputedAccountStatusAdapter } from "./status-helpers-CopMHs_f.js";
import "./channel-core-DYDgmix_.js";
import { i as createPairingPrefixStripper } from "./channel-pairing-YowAfeUY.js";
import { a as createRestrictSendersChannelSecurity, m as resolveScopeRequireMention, u as buildChannelGroupsScopeTree } from "./channel-policy-RPOWSkLP.js";
import { a as createEmptyChannelResult, i as createAttachedChannelResultAdapter } from "./channel-send-result-BFAnsv6z.js";
import { n as createEmptyChannelDirectoryAdapter } from "./directory-adapters-CwR372GJ.js";
import "./directory-runtime-CuE5Ke_q.js";
import { i as resolveLineAccount, r as resolveDefaultLineAccountId, t as listLineAccountIds } from "./accounts-Cx1pXoZV.js";
import { i as hasLineCredentials, r as lineSetupContract, t as lineSetupWizard } from "./setup-surface-CU0lmNov.js";
import { i as LineChannelConfigSchema, n as createDeviceControlCard, r as createMediaPlayerCard, t as createAppleTvRemoteCard } from "./media-control-cards-Bk9Ckcha.js";
import { n as resolveExactLineGroupConfigKey, o as getLineRuntime, t as buildLineQuickReplyFallbackText } from "./quick-reply-fallback-C1a-k8v7.js";
import { h as resolveLineOutboundMedia, m as hasLineSpecificMediaOptions, n as createAgendaCard, p as buildLineMediaMessage, r as createEventCard, s as messageAction, t as createLineSendReceipt, u as postbackAction } from "./send-receipt-I33lTCFa.js";
import { t as createActionCard } from "./basic-cards-CVO2DvGK.js";
import { Type } from "typebox";
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
const loadLineProbeRuntime$1 = createLazyRuntimeModule(() => import("./probe.runtime-utS-h2_1.js"));
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
		const { nextConfig, changed, cleared } = clearAccountFieldsFromConfigSection({
			cfg,
			sectionKey: "line",
			accountId,
			fields: [
				"channelAccessToken",
				"channelSecret",
				"tokenFile",
				"secretFile"
			],
			markClearedOnFieldPresence: true
		});
		if (changed) await getLineRuntime().config.replaceConfigFile({
			nextConfig,
			afterWrite: { mode: "auto" }
		});
		const loggedOut = resolveLineAccount({
			cfg: nextConfig,
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
//#region extensions/line/src/rich-messages.ts
const nonempty = () => Type.String({ minLength: 1 });
const closed = (properties) => Type.Object(properties, { additionalProperties: false });
const lineCardSchema = Type.Union([
	closed({
		type: Type.Literal("media_player"),
		title: nonempty(),
		artist: Type.Optional(nonempty()),
		source: Type.Optional(nonempty()),
		imageUrl: Type.Optional(Type.String({ pattern: "^https://" })),
		status: Type.Optional(Type.Union([Type.Literal("playing"), Type.Literal("paused")]))
	}),
	closed({
		type: Type.Literal("event"),
		title: nonempty(),
		date: nonempty(),
		time: Type.Optional(nonempty()),
		location: Type.Optional(nonempty()),
		description: Type.Optional(nonempty())
	}),
	closed({
		type: Type.Literal("agenda"),
		title: nonempty(),
		events: Type.Array(closed({
			title: nonempty(),
			time: Type.Optional(nonempty()),
			location: Type.Optional(nonempty())
		}), {
			minItems: 1,
			maxItems: 6
		})
	}),
	closed({
		type: Type.Literal("device"),
		name: nonempty(),
		deviceType: Type.Optional(nonempty()),
		status: Type.Optional(nonempty()),
		controls: Type.Optional(Type.Array(closed({
			label: nonempty(),
			action: nonempty()
		}), { maxItems: 6 }))
	}),
	closed({
		type: Type.Literal("appletv_remote"),
		name: Type.Optional(nonempty()),
		status: Type.Optional(nonempty())
	})
]);
const lineChannelDataSchema = Type.Optional(closed({ line: closed({
	location: Type.Optional(closed({
		title: nonempty(),
		address: nonempty(),
		latitude: Type.Number({
			minimum: -90,
			maximum: 90
		}),
		longitude: Type.Number({
			minimum: -180,
			maximum: 180
		})
	})),
	card: Type.Optional(lineCardSchema),
	mediaKind: Type.Optional(Type.Union([
		Type.Literal("image"),
		Type.Literal("video"),
		Type.Literal("audio")
	])),
	previewImageUrl: Type.Optional(Type.String({ pattern: "^https://" })),
	durationMs: Type.Optional(Type.Integer({ minimum: 1 })),
	trackingId: Type.Optional(nonempty())
}) }));
const lineMessageActions = {
	describeMessageTool: ({ cfg, accountId }) => {
		const account = resolveLineAccount({
			cfg,
			accountId: accountId ?? void 0
		});
		return account.enabled && hasLineCredentials(account) ? {
			actions: ["send"],
			capabilities: ["presentation"],
			schema: {
				actions: ["send"],
				properties: { channelData: lineChannelDataSchema }
			}
		} : {
			actions: [],
			capabilities: [],
			schema: null
		};
	},
	prepareSendPayload: ({ payload }) => payload
};
const LINE_PRESENTATION_CAPABILITIES = {
	supported: true,
	buttons: true,
	selects: true,
	context: true,
	limits: {
		actions: {
			maxActions: 4,
			maxActionsPerRow: 1,
			maxRows: 4,
			maxLabelLength: 40
		},
		selects: {
			maxOptions: 13,
			maxLabelLength: 20,
			maxValueBytes: 300
		},
		text: { markdownDialect: "plain" }
	}
};
function toLineAction(button) {
	const normalized = resolveMessagePresentationButtonAction(button);
	const { label } = button;
	if (normalized?.type === "command") return {
		type: "message",
		label,
		text: normalized.command
	};
	if (normalized?.type === "callback") return {
		type: "postback",
		label,
		data: normalized.value,
		displayText: label
	};
	if (normalized?.type === "url") return {
		type: "uri",
		label,
		uri: normalized.url
	};
	if (normalized?.type === "web-app" && normalized.url) return {
		type: "uri",
		label,
		uri: normalized.url
	};
}
function renderLinePresentation(payload, presentation) {
	const buttons = presentation.blocks.flatMap((block) => block.type === "buttons" ? block.buttons : []);
	const buttonActions = buttons.map(toLineAction);
	const options = presentation.blocks.flatMap((block) => block.type === "select" ? block.options : []);
	const quickReplyItems = options.flatMap((option) => {
		const action = resolveMessagePresentationOptionAction(option);
		return action?.type === "command" || action?.type === "callback" ? [{
			label: option.label,
			action
		}] : [];
	});
	if (buttons.length > 0 && buttonActions.some((action) => !action) || quickReplyItems.length !== options.length || buttons.length === 0 && options.length === 0) return null;
	const lineData = isRecord(payload.channelData?.line) ? payload.channelData.line : {};
	const text = presentation.blocks.flatMap((block) => block.type === "text" || block.type === "context" ? [block.text] : []).join("\n");
	const title = presentation.title || "Choose an option";
	const flexMessage = buttonActions.length > 0 ? {
		altText: title,
		contents: createActionCard(title, text || "Choose an option.", buttons.map((button, index) => ({
			label: button.label,
			action: buttonActions[index]
		})))
	} : void 0;
	return {
		...payload,
		channelData: {
			...payload.channelData,
			line: {
				...lineData,
				...flexMessage ? { flexMessage } : {},
				quickReplyItems
			}
		}
	};
}
const toSlug = (value) => normalizeLowercaseStringOrEmpty(value).replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "device";
const lineActionData = (action, device) => `line.action=${encodeURIComponent(action)}&line.device=${encodeURIComponent(device)}`;
function renderLineCard(card) {
	if (card.type === "media_player") {
		const device = toSlug(card.source || card.title);
		return {
			altText: `🎵 ${card.title}${card.artist ? ` - ${card.artist}` : ""}`,
			contents: createMediaPlayerCard({
				title: card.title,
				subtitle: card.artist,
				source: card.source,
				imageUrl: card.imageUrl,
				isPlaying: card.status ? card.status === "playing" : void 0,
				controls: Object.fromEntries([
					"previous",
					"play",
					"pause",
					"next"
				].map((action) => [action, { data: lineActionData(action, device) }]))
			})
		};
	}
	if (card.type === "event") return {
		altText: `📅 ${card.title} - ${card.date}${card.time ? ` ${card.time}` : ""}`,
		contents: createEventCard(card)
	};
	if (card.type === "agenda") return {
		altText: `📋 ${card.title} (${card.events.length} events)`,
		contents: createAgendaCard(card)
	};
	const device = toSlug(card.type === "device" ? card.name : card.name || "apple_tv");
	if (card.type === "device") return {
		altText: `📱 ${card.name}${card.status ? `: ${card.status}` : ""}`,
		contents: createDeviceControlCard({
			deviceName: card.name,
			deviceType: card.deviceType,
			status: card.status,
			controls: (card.controls ?? []).map((control) => ({
				label: control.label,
				data: lineActionData(control.action, device)
			}))
		})
	};
	const actionData = {
		up: lineActionData("up", device),
		down: lineActionData("down", device),
		left: lineActionData("left", device),
		right: lineActionData("right", device),
		select: lineActionData("select", device),
		menu: lineActionData("menu", device),
		home: lineActionData("home", device),
		play: lineActionData("play", device),
		pause: lineActionData("pause", device),
		volumeUp: lineActionData("volume_up", device),
		volumeDown: lineActionData("volume_down", device),
		mute: lineActionData("mute", device)
	};
	return {
		altText: `📺 ${card.name || "Apple TV"} Remote`,
		contents: createAppleTvRemoteCard({
			deviceName: card.name || "Apple TV",
			status: card.status,
			actionData
		})
	};
}
function createLineQuickReply(items) {
	return { items: items.slice(0, 13).map((item) => ({
		type: "action",
		action: item.action.type === "command" ? messageAction(item.label, item.action.command) : postbackAction(item.label, item.action.value, item.label)
	})) };
}
//#endregion
//#region extensions/line/src/outbound.ts
const loadLineOutboundRuntime = createLazyRuntimeModule(() => import("./outbound.runtime.js"));
const lineOutboundAdapter = {
	deliveryMode: "direct",
	chunker: (text, limit) => getLineRuntime().channel.text.chunkMarkdownText(text, limit),
	textChunkLimit: 5e3,
	sanitizeText: ({ text }) => sanitizeAssistantVisibleText(text),
	presentationCapabilities: LINE_PRESENTATION_CAPABILITIES,
	renderPresentation: ({ payload, presentation }) => renderLinePresentation(payload, presentation),
	sendPayload: async ({ to, payload, accountId, cfg, onDeliveryResult }) => {
		const runtime = getLineRuntime();
		const outboundRuntime = await loadLineOutboundRuntime();
		const rawLineData = payload.channelData?.line ?? {};
		const lineData = rawLineData.card && !rawLineData.flexMessage ? {
			...rawLineData,
			flexMessage: renderLineCard(rawLineData.card)
		} : rawLineData;
		const lineRuntime = runtime.channel.line;
		const location = lineData.location;
		const locationMessage = location ? outboundRuntime.createLocationMessage(location) : null;
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
		const quickReplyItems = lineData.quickReplyItems ?? [];
		const hasQuickReplies = quickReplies.length > 0 || quickReplyItems.length > 0;
		const quickReply = quickReplyItems.length ? createLineQuickReply(quickReplyItems) : quickReplies.length ? (lineRuntime?.createQuickReplyItems ?? outboundRuntime.createQuickReplyItems)(quickReplies) : void 0;
		const quickReplyLabels = quickReplyItems.length ? quickReplyItems.map((item) => item.label) : quickReplies;
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
		const sendTextWithQuickReply = async (text) => {
			if (quickReplyItems.length > 0 && quickReply) {
				await sendMessageBatch([{
					type: "text",
					text,
					quickReply
				}]);
				return;
			}
			await recordResult(sendQuickReplies(to, text, quickReplies, {
				verbose: false,
				cfg,
				accountId: accountId ?? void 0
			}));
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
			if (location) await recordResult(sendLocation(to, location, {
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
		if (orderedMessages && !shouldSendQuickRepliesInline) for (const [index, message] of orderedMessages.entries()) {
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
			else if (isLast && hasQuickReplies) await sendTextWithQuickReply(message.text);
			else await recordResult(sendText(to, message.text, {
				verbose: false,
				cfg,
				accountId: accountId ?? void 0
			}));
		}
		else if (chunks.length > 0) for (const [i, chunk] of chunks.entries()) if (i === chunks.length - 1 && hasQuickReplies) await sendTextWithQuickReply(chunk);
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
			} else if (quickReply) await sendTextWithQuickReply(buildLineQuickReplyFallbackText(quickReplyLabels));
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
const loadLineProbeRuntime = createLazyRuntimeModule(() => import("./probe.runtime-utS-h2_1.js"));
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
const loadLineChannelRuntime = createLazyRuntimeModule(() => import("./channel.runtime-BtTuUrNh.js"));
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
	findingTitle: "LINE security warning",
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
		actions: lineMessageActions,
		bindings: lineBindingsAdapter,
		conversationBindings: { defaultTopLevelPlacement: "current" },
		agentPrompt: { messageToolHints: () => [
			"",
			"### LINE structured output",
			"Use `presentation.blocks` for buttons, yes/no choices, and selectable options; LINE maps them to Flex controls or quick replies.",
			"Use `channelData.line.location` for a location pin and `channelData.line.card` for one LINE-specific card. Supported card types are `media_player`, `event`, `agenda`, `device`, and `appletv_remote`.",
			"Send rich output with the structured message fields. Double-bracket marker text has no special meaning."
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
