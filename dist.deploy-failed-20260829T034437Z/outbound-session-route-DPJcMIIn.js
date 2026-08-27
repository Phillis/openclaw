import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { t as buildOutboundBaseSessionKey } from "./base-session-key-DbIvcY5J.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import "./routing-DM8631ts.js";
import { n as buildThreadAwareOutboundSessionRoute } from "./core-BW81HbTR.js";
import { n as createUnionActionGate } from "./channel-actions-AIJ6nLei.js";
import "./channel-core-CyDgaJnW.js";
import { t as extractToolSend } from "./tool-send-CpdY8Wzi.js";
import { r as listDiscordAccountIds, t as createDiscordActionGate } from "./accounts-Ce_-CVy_.js";
import { c as readDiscordComponentSpec, s as coerceDiscordComponentParam } from "./components-CN5PDDJ9.js";
import { t as parseDiscordTarget } from "./target-parsing-CEpBARoV.js";
import { t as inspectDiscordAccount } from "./account-inspect-QOSnG4YT.js";
import { r as withDiscordInboundEventDeliveryMetadata } from "./inbound-event-delivery-DuweviLV.js";
import { t as isTrustedRequesterGuildAdminAction } from "./trusted-requester-actions-vFvBzRog.js";
import { Type } from "typebox";
//#region extensions/discord/src/channel-actions.ts
const localExecutionActions = /* @__PURE__ */ new Set([
	"send",
	"poll",
	"upload-file",
	"thread-reply",
	"sticker",
	"emoji-upload",
	"sticker-upload",
	"event-create"
]);
function resolveDiscordActionExecutionMode({ action }) {
	return localExecutionActions.has(action) ? "local" : "gateway";
}
const loadDiscordChannelActionsRuntime = createLazyRuntimeModule(() => import("./channel-actions.runtime.js"));
function listDiscoverableDiscordAccounts(cfg) {
	return listDiscordAccountIds(cfg).map((accountId) => inspectDiscordAccount({
		cfg,
		accountId
	})).filter((account) => account.enabled && account.configured);
}
function resolveDiscordActionDiscovery(cfg) {
	const accounts = listDiscoverableDiscordAccounts(cfg);
	if (accounts.length === 0) return null;
	const unionGate = createUnionActionGate(accounts, (account) => createDiscordActionGate({
		cfg,
		accountId: account.accountId
	}));
	return { isEnabled: (key, defaultValue = true) => unionGate(key, defaultValue) };
}
function resolveScopedDiscordActionDiscovery(params) {
	if (!params.accountId) return resolveDiscordActionDiscovery(params.cfg);
	const account = inspectDiscordAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	if (!account.enabled || !account.configured) return null;
	const gate = createDiscordActionGate({
		cfg: params.cfg,
		accountId: account.accountId
	});
	return { isEnabled: (key, defaultValue = true) => gate(key, defaultValue) };
}
function describeDiscordMessageTool({ cfg, accountId }) {
	const discovery = resolveScopedDiscordActionDiscovery({
		cfg,
		accountId
	});
	if (!discovery) return {
		actions: [],
		capabilities: [],
		schema: null
	};
	const actions = /* @__PURE__ */ new Set(["send"]);
	if (discovery.isEnabled("polls")) actions.add("poll");
	if (discovery.isEnabled("reactions")) {
		actions.add("react");
		actions.add("reactions");
		actions.add("emoji-list");
	}
	if (discovery.isEnabled("messages")) {
		actions.add("upload-file");
		actions.add("read");
		actions.add("edit");
		actions.add("delete");
	}
	if (discovery.isEnabled("pins")) {
		actions.add("pin");
		actions.add("unpin");
		actions.add("list-pins");
	}
	if (discovery.isEnabled("permissions")) actions.add("permissions");
	if (discovery.isEnabled("threads")) {
		actions.add("thread-create");
		actions.add("thread-list");
		actions.add("thread-reply");
	}
	if (discovery.isEnabled("search")) actions.add("search");
	if (discovery.isEnabled("stickers")) actions.add("sticker");
	if (discovery.isEnabled("memberInfo")) actions.add("member-info");
	if (discovery.isEnabled("roleInfo")) actions.add("role-info");
	if (discovery.isEnabled("emojiUploads")) actions.add("emoji-upload");
	if (discovery.isEnabled("stickerUploads")) actions.add("sticker-upload");
	if (discovery.isEnabled("roles", false)) {
		actions.add("role-add");
		actions.add("role-remove");
	}
	if (discovery.isEnabled("channelInfo")) {
		actions.add("channel-info");
		actions.add("channel-list");
	}
	if (discovery.isEnabled("channels")) {
		actions.add("channel-create");
		actions.add("channel-edit");
		actions.add("channel-delete");
		actions.add("channel-move");
		actions.add("category-create");
		actions.add("category-edit");
		actions.add("category-delete");
	}
	if (discovery.isEnabled("voiceStatus")) actions.add("voice-status");
	if (discovery.isEnabled("events")) {
		actions.add("event-list");
		actions.add("event-create");
	}
	if (discovery.isEnabled("moderation", false)) {
		actions.add("timeout");
		actions.add("kick");
		actions.add("ban");
	}
	if (discovery.isEnabled("presence", false)) actions.add("set-presence");
	const schema = [];
	if (actions.has("react")) schema.push({
		actions: ["react", "reactions"],
		properties: { emoji: Type.Optional(Type.String({ description: `Unicode emoji or custom name:id (also <:name:id> / <a:name:id>).${actions.has("emoji-list") ? " Use action:\"emoji-list\" for server emojis." : ""}` })) }
	});
	if (actions.has("send")) schema.push({
		actions: ["send"],
		visibility: "all-configured",
		properties: { components: Type.Optional(Type.Object({
			blocks: Type.Optional(Type.Array(Type.Unknown(), { description: "Discord Components V2 blocks such as text, buttons, selects, media, containers, and separators." })),
			modal: Type.Optional(Type.Object({}, {
				additionalProperties: true,
				description: "Optional Discord modal triggered by generated components."
			}))
		}, {
			additionalProperties: true,
			description: "Discord Components V2 payload for send actions. Accepts the same object consumed by the Discord components adapter."
		})) }
	});
	return {
		actions: Array.from(actions),
		capabilities: ["presentation"],
		schema
	};
}
const discordMessageActions = {
	providerOwnedReadGates: true,
	resolveExecutionMode: resolveDiscordActionExecutionMode,
	describeMessageTool: describeDiscordMessageTool,
	supportsAction: ({ action }) => action !== "poll",
	requiresTrustedRequesterSender: ({ action, toolContext }) => Boolean(toolContext) && isTrustedRequesterGuildAdminAction(action),
	extractToolSend: ({ args }) => {
		const action = normalizeOptionalString(args.action) ?? "";
		if (action === "sendMessage") return extractToolSend(args, "sendMessage");
		if (action === "threadReply") {
			const channelId = normalizeOptionalString(args.channelId) ?? "";
			return channelId ? { to: `channel:${channelId}` } : null;
		}
		return null;
	},
	prepareSendPayload: ({ ctx, payload }) => {
		if (ctx.action !== "send") return null;
		const payloadWithDeliveryMetadata = withDiscordInboundEventDeliveryMetadata(payload, {
			sessionKey: ctx.sessionKey,
			inboundEventKind: ctx.inboundEventKind
		});
		const rawComponents = coerceDiscordComponentParam(ctx.params.components);
		if (typeof rawComponents === "function") return null;
		const componentSpec = rawComponents && typeof rawComponents === "object" && !Array.isArray(rawComponents) ? readDiscordComponentSpec(rawComponents) : void 0;
		const nativeComponents = Array.isArray(rawComponents) ? rawComponents : void 0;
		const embeds = Array.isArray(ctx.params.embeds) ? ctx.params.embeds : void 0;
		if ((componentSpec || nativeComponents) && embeds?.length) return null;
		const filename = normalizeOptionalString(ctx.params.filename);
		if (!componentSpec && !nativeComponents && !embeds?.length && !filename) return payloadWithDeliveryMetadata;
		const discordData = payloadWithDeliveryMetadata.channelData?.discord && typeof payloadWithDeliveryMetadata.channelData.discord === "object" && !Array.isArray(payloadWithDeliveryMetadata.channelData.discord) ? payloadWithDeliveryMetadata.channelData.discord : {};
		return {
			...payloadWithDeliveryMetadata,
			channelData: {
				...payloadWithDeliveryMetadata.channelData,
				discord: {
					...discordData,
					...componentSpec ? { components: componentSpec } : {},
					...nativeComponents ? { components: nativeComponents } : {},
					...embeds?.length ? { embeds } : {},
					...filename ? { filename } : {}
				}
			}
		};
	},
	handleAction: async ({ action, params, cfg, accountId, requesterAccountId, requesterSenderId, senderIsOwner, toolContext, mediaAccess, mediaLocalRoots, mediaReadFile, sessionKey, inboundEventKind, conversationReadOrigin, reply }) => {
		return await (await loadDiscordChannelActionsRuntime()).handleDiscordMessageAction({
			action,
			params,
			cfg,
			accountId,
			requesterSenderId,
			senderIsOwner,
			toolContext,
			mediaAccess,
			mediaLocalRoots,
			mediaReadFile,
			...sessionKey ? { sessionKey } : {},
			...inboundEventKind ? { inboundEventKind } : {},
			...requesterAccountId ? { requesterAccountId } : {},
			...conversationReadOrigin ? { conversationReadOrigin } : {},
			...reply ? { reply } : {}
		});
	}
};
//#endregion
//#region extensions/discord/src/outbound-session-route.ts
function resolveDiscordOutboundSessionRoute(params) {
	const parsed = parseDiscordTarget(params.target, { defaultKind: resolveDiscordOutboundTargetKindHint(params) });
	if (!parsed) return null;
	const explicitThreadId = params.threadId == null ? void 0 : String(params.threadId).trim();
	const peerId = explicitThreadId || parsed.id;
	const isDm = parsed.kind === "user" && !explicitThreadId;
	const recipientSessionExact = /^\d+$/.test(peerId);
	const peer = {
		kind: isDm ? "direct" : "channel",
		id: peerId
	};
	const baseSessionKey = buildOutboundBaseSessionKey({
		cfg: params.cfg,
		agentId: params.agentId,
		channel: "discord",
		accountId: params.accountId,
		peer
	});
	return buildThreadAwareOutboundSessionRoute({
		route: {
			sessionKey: baseSessionKey,
			baseSessionKey,
			recipientSessionExact,
			peer,
			chatType: isDm ? "direct" : "channel",
			from: isDm ? `discord:${peerId}` : `discord:channel:${peerId}`,
			to: isDm ? `user:${peerId}` : `channel:${peerId}`
		},
		threadId: params.threadId,
		precedence: ["threadId"],
		useSuffix: false
	});
}
function resolveDiscordOutboundTargetKindHint(params) {
	const resolvedKind = params.resolvedTarget?.kind;
	if (resolvedKind === "user") return "user";
	if (resolvedKind === "group" || resolvedKind === "channel") return "channel";
	const target = params.target.trim();
	if (/^channel:/i.test(target)) return "channel";
	if (/^(user:|discord:|@|<@!?)/i.test(target)) return "user";
	return "channel";
}
//#endregion
export { discordMessageActions as n, resolveDiscordOutboundSessionRoute as t };
