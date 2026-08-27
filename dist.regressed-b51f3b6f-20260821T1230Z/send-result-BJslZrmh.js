import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { n as normalizeAccountId } from "./account-id-BRqK6RmF.js";
import { i as resolveAllowlistMatchByCandidates, t as compileAllowlist } from "./allowlist-match-B8i_bWcB.js";
import "./channel-outbound-DhlIXa0y.js";
import { t as ToolAuthorizationError } from "./common-BGOZLJ2_.js";
import { t as fromMarkdown } from "./lib-vv6_0VBO.js";
import { o as gfmTable, s as gfmTableFromMarkdown } from "./code-regions-BWkFWnhP.js";
import { t as createMessageReceiptFromOutboundResults } from "./receipt-_WMqEo47.js";
import { n as createChannelPartialDeliveryError } from "./delivery-result-DI1YgQUl.js";
import { i as chunkMarkdownTextWithMode } from "./chunk-DbIKi2Y2.js";
import { c as resolveMergedAccountConfig } from "./account-helpers-CEliAVvN.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import { i as resolveOpenProviderRuntimeGroupPolicy, r as resolveDefaultGroupPolicy } from "./runtime-group-policy-6UJsFi-Z.js";
import "./reply-chunking-Bm5QeUSE.js";
import "./channel-inbound-C_BpWedI.js";
import "./runtime-group-policy-N6jVf60n.js";
import "./account-resolution-Cb-rHsSW.js";
import "./allow-from-D8N51uwu.js";
import "./channel-actions-CeWsyukw.js";
import { a as createChannelIngressResolver, c as defineStableChannelIngressIdentity } from "./channel-ingress-runtime-pp5r5113.js";
import { r as normalizeFeishuTarget, t as detectIdType } from "./targets-Bo4YyHFo.js";
//#region extensions/feishu/src/card-interaction.ts
const FEISHU_CARD_INTERACTION_VERSION = "ocf1";
function isInteractionKind(value) {
	return value === "button" || value === "quick" || value === "meta";
}
function isMetadataValue(value) {
	return value === null || value === void 0 || typeof value === "string" || typeof value === "number" || typeof value === "boolean";
}
function createFeishuCardInteractionEnvelope(envelope) {
	return {
		oc: FEISHU_CARD_INTERACTION_VERSION,
		...envelope
	};
}
function buildFeishuCardActionTextFallback(event) {
	const actionValue = event.action.value;
	if (isRecord(actionValue)) {
		if (typeof actionValue.text === "string") return actionValue.text;
		if (typeof actionValue.command === "string") return actionValue.command;
		return JSON.stringify(actionValue);
	}
	return String(actionValue);
}
function decodeFeishuCardAction(params) {
	const { event, now = Date.now() } = params;
	const actionValue = event.action.value;
	if (!isRecord(actionValue) || actionValue.oc !== "ocf1") return {
		kind: "legacy",
		text: buildFeishuCardActionTextFallback(event)
	};
	if (!isInteractionKind(actionValue.k) || typeof actionValue.a !== "string" || !actionValue.a) return {
		kind: "invalid",
		reason: "malformed"
	};
	if (actionValue.q !== void 0 && typeof actionValue.q !== "string") return {
		kind: "invalid",
		reason: "malformed"
	};
	if (actionValue.m !== void 0) {
		if (!isRecord(actionValue.m)) return {
			kind: "invalid",
			reason: "malformed"
		};
		for (const value of Object.values(actionValue.m)) if (!isMetadataValue(value)) return {
			kind: "invalid",
			reason: "malformed"
		};
	}
	if (actionValue.c !== void 0) {
		if (!isRecord(actionValue.c)) return {
			kind: "invalid",
			reason: "malformed"
		};
		if (actionValue.c.u !== void 0 && typeof actionValue.c.u !== "string") return {
			kind: "invalid",
			reason: "malformed"
		};
		if (actionValue.c.h !== void 0 && typeof actionValue.c.h !== "string") return {
			kind: "invalid",
			reason: "malformed"
		};
		if (actionValue.c.s !== void 0 && typeof actionValue.c.s !== "string") return {
			kind: "invalid",
			reason: "malformed"
		};
		if (actionValue.c.e !== void 0 && !Number.isFinite(actionValue.c.e)) return {
			kind: "invalid",
			reason: "malformed"
		};
		if (actionValue.c.t !== void 0 && actionValue.c.t !== "p2p" && actionValue.c.t !== "group") return {
			kind: "invalid",
			reason: "malformed"
		};
		if (typeof actionValue.c.e === "number" && actionValue.c.e < now) return {
			kind: "invalid",
			reason: "stale"
		};
		const expectedUser = actionValue.c.u?.trim();
		if (expectedUser && expectedUser !== (event.operator.open_id ?? "").trim()) return {
			kind: "invalid",
			reason: "wrong_user"
		};
		const expectedChat = actionValue.c.h?.trim();
		if (expectedChat && expectedChat !== (event.context.chat_id ?? "").trim()) return {
			kind: "invalid",
			reason: "wrong_conversation"
		};
	}
	return {
		kind: "structured",
		envelope: actionValue
	};
}
//#endregion
//#region extensions/feishu/src/chat-type.ts
function normalizeFeishuChatType(value) {
	if (value === "group" || value === "topic_group") return "group";
	if (value === "p2p") return "p2p";
}
function normalizeFeishuChatMode(value) {
	if (value === "group" || value === "topic" || value === "topic_group") return "group";
	return value === "p2p" ? "p2p" : void 0;
}
function resolveFeishuChatType(chat) {
	return normalizeFeishuChatMode(chat.chat_mode) ?? normalizeFeishuChatType(chat.chat_type);
}
//#endregion
//#region extensions/feishu/src/policy.ts
const FEISHU_PROVIDER_PREFIX_RE = /^(feishu|lark):/i;
const FEISHU_TYPED_PREFIX_RE = /^(chat|group|channel|user|dm|open_id):/i;
const FEISHU_ID_KIND = "plugin:feishu-id";
const feishuIngressIdentity = defineStableChannelIngressIdentity({
	key: "feishu-id",
	kind: FEISHU_ID_KIND,
	normalize: normalizeFeishuAllowEntry,
	sensitivity: "pii",
	aliases: [{
		key: "feishu-alt-id",
		kind: FEISHU_ID_KIND,
		normalizeEntry: () => null,
		normalizeSubject: normalizeFeishuAllowEntry,
		sensitivity: "pii"
	}],
	isWildcardEntry: (entry) => normalizeFeishuAllowEntry(entry) === "*",
	resolveEntryId: ({ entryIndex }) => `feishu-entry-${entryIndex + 1}`
});
function normalizeFeishuAllowEntry(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return "";
	if (trimmed === "*") return "*";
	let withoutProviderPrefix = trimmed;
	while (FEISHU_PROVIDER_PREFIX_RE.test(withoutProviderPrefix)) withoutProviderPrefix = withoutProviderPrefix.replace(FEISHU_PROVIDER_PREFIX_RE, "").trim();
	if (withoutProviderPrefix === "*") return "*";
	const lowered = normalizeOptionalLowercaseString(withoutProviderPrefix) ?? "";
	if (!lowered) return "";
	const prefixed = lowered.match(FEISHU_TYPED_PREFIX_RE);
	if (prefixed?.[1]) {
		const kind = [
			"chat",
			"group",
			"channel"
		].includes(prefixed[1]) ? "chat" : "user";
		const value = withoutProviderPrefix.slice(prefixed[0].length).trim();
		return value === "*" ? "*" : value ? `${kind}:${value}` : "";
	}
	const detectedType = detectIdType(withoutProviderPrefix);
	if (detectedType === "chat_id") return `chat:${withoutProviderPrefix}`;
	if (detectedType === "open_id" || detectedType === "user_id") return `user:${withoutProviderPrefix}`;
	return "";
}
function normalizeFeishuDmPolicy(policy) {
	return policy === "open" || policy === "pairing" || policy === "allowlist" || policy === "disabled" ? policy : "pairing";
}
function normalizeFeishuGroupPolicy(policy) {
	return policy === "allowall" ? "open" : policy;
}
function createFeishuIngressSubject(params) {
	const ids = [params.primaryId, ...params.alternateIds ?? []].map((value) => value?.trim()).filter((value) => Boolean(value));
	return {
		stableId: ids[0],
		aliases: { "feishu-alt-id": ids[1] }
	};
}
function createFeishuIngressResolver(params) {
	return createChannelIngressResolver({
		channelId: "feishu",
		accountId: normalizeAccountId(params.accountId) ?? "default",
		identity: feishuIngressIdentity,
		cfg: params.cfg,
		...params.readAllowFromStore ? { readStoreAllowFrom: params.readAllowFromStore } : {}
	});
}
async function resolveFeishuDmIngressAccess(params) {
	return await createFeishuIngressResolver({
		cfg: params.cfg,
		accountId: params.accountId,
		readAllowFromStore: params.readAllowFromStore
	}).message({
		subject: createFeishuIngressSubject({
			primaryId: params.senderOpenId,
			alternateIds: [params.senderUserId]
		}),
		conversation: {
			kind: "direct",
			id: params.conversationId
		},
		...params.contextBinding ? { contextBinding: params.contextBinding } : {},
		event: { mayPair: params.mayPair },
		dmPolicy: normalizeFeishuDmPolicy(params.dmPolicy),
		groupPolicy: "disabled",
		allowFrom: params.allowFrom ?? [],
		...params.command ? { command: params.command } : {}
	});
}
async function resolveFeishuGroupConversationIngressAccess(params) {
	const groupPolicy = normalizeFeishuGroupPolicy(params.groupPolicy);
	const groupAllowFrom = groupPolicy === "allowlist" && params.groupExplicitlyConfigured ? [...params.groupAllowFrom ?? [], params.chatId] : params.groupAllowFrom ?? [];
	return await createFeishuIngressResolver({
		cfg: params.cfg,
		accountId: params.accountId
	}).message({
		subject: createFeishuIngressSubject({ primaryId: params.chatId }),
		conversation: {
			kind: "group",
			id: params.chatId,
			threadId: params.threadId
		},
		...params.contextBinding ? { contextBinding: params.contextBinding } : {},
		dmPolicy: "disabled",
		groupPolicy,
		groupAllowFrom
	});
}
async function resolveFeishuGroupSenderActivationIngressAccess(params) {
	const groupAllowFrom = params.allowFrom ?? [];
	return await createFeishuIngressResolver({
		cfg: params.cfg,
		accountId: params.accountId
	}).message({
		subject: createFeishuIngressSubject({
			primaryId: params.senderOpenId,
			alternateIds: [params.senderUserId]
		}),
		conversation: {
			kind: "group",
			id: params.chatId,
			threadId: params.threadId
		},
		...params.contextBinding ? { contextBinding: params.contextBinding } : {},
		dmPolicy: "disabled",
		groupPolicy: groupAllowFrom.length > 0 ? "allowlist" : "open",
		groupAllowFrom,
		mentionFacts: {
			canDetectMention: true,
			wasMentioned: params.mentionedBot
		},
		policy: { activation: {
			requireMention: params.requireMention,
			allowTextCommands: false
		} },
		...params.command ? { command: params.command } : {}
	});
}
function resolveFeishuExplicitGroupConfigKey(params) {
	const groups = params.cfg?.groups ?? {};
	const groupId = params.groupId?.trim();
	if (!groupId || groupId === "*") return;
	if (Object.hasOwn(groups, groupId)) return groupId;
	const lowered = normalizeOptionalLowercaseString(groupId) ?? "";
	return Object.keys(groups).find((key) => key !== "*" && normalizeOptionalLowercaseString(key) === lowered);
}
function resolveFeishuGroupConfig(params) {
	if (!params.groupId?.trim()) return;
	const groups = params.cfg?.groups ?? {};
	const key = resolveFeishuExplicitGroupConfigKey(params);
	return key ? groups[key] : groups["*"];
}
function hasExplicitFeishuGroupConfig(params) {
	return resolveFeishuExplicitGroupConfigKey(params) !== void 0;
}
function resolveFeishuGroupToolPolicy(params) {
	return resolveFeishuGroupConfig({
		cfg: params.cfg.channels?.feishu,
		groupId: params.groupId
	})?.tools;
}
function resolveFeishuReplyPolicy(params) {
	if (params.isDirectMessage) return { requireMention: false };
	const feishuCfg = params.cfg.channels?.feishu;
	const resolvedCfg = resolveMergedAccountConfig({
		channelConfig: feishuCfg,
		accounts: feishuCfg?.accounts,
		accountId: normalizeAccountId(params.accountId),
		normalizeAccountId,
		omitKeys: ["defaultAccount"]
	});
	const groupRequireMention = resolveFeishuGroupConfig({
		cfg: resolvedCfg,
		groupId: params.groupId
	})?.requireMention;
	return { requireMention: typeof groupRequireMention === "boolean" ? groupRequireMention : typeof resolvedCfg.requireMention === "boolean" ? resolvedCfg.requireMention : params.groupPolicy !== "open" };
}
//#endregion
//#region extensions/feishu/src/read-policy.ts
function isActionContext(ctx) {
	return "toolContext" in ctx;
}
function normalizeChatId(raw) {
	if (!raw) return "";
	return normalizeFeishuTarget(raw) ?? raw.trim();
}
function normalizeFeishuAllowlist(entries) {
	return (entries ?? []).map((entry) => normalizeFeishuAllowEntry(String(entry))).filter(Boolean);
}
function readContextFields(ctx) {
	if (isActionContext(ctx)) return {
		accountId: normalizeOptionalString(ctx.accountId),
		currentChannelId: normalizeOptionalString(ctx.toolContext?.currentChannelId),
		currentProvider: normalizeOptionalString(ctx.toolContext?.currentChannelProvider),
		requesterAccountId: normalizeOptionalString(ctx.requesterAccountId),
		requesterSenderId: normalizeOptionalString(ctx.requesterSenderId),
		directOperator: ctx.conversationReadOrigin === "direct-operator"
	};
	return {
		accountId: normalizeOptionalString(ctx.agentAccountId),
		currentChannelId: normalizeOptionalString(ctx.nativeChannelId),
		currentProvider: normalizeOptionalString(ctx.messageChannel ?? ctx.deliveryContext?.channel),
		requesterAccountId: normalizeOptionalString(ctx.deliveryContext?.accountId),
		requesterSenderId: normalizeOptionalString(ctx.requesterSenderId),
		directOperator: ctx.conversationReadOrigin === "direct-operator"
	};
}
function isCurrentChat(params) {
	const context = readContextFields(params.ctx);
	return context.currentProvider?.toLowerCase() === "feishu" && context.requesterAccountId === params.account.accountId && (context.accountId ?? params.account.accountId) === params.account.accountId && normalizeChatId(context.currentChannelId) === normalizeChatId(params.chatId);
}
function resolveFeishuReadGroupPolicy(cfg, account) {
	return resolveOpenProviderRuntimeGroupPolicy({
		providerConfigPresent: cfg.channels?.feishu !== void 0,
		groupPolicy: account.config.groupPolicy,
		defaultGroupPolicy: resolveDefaultGroupPolicy(cfg)
	}).groupPolicy;
}
function isFeishuGroupReadAllowed(cfg, account, chatId, current) {
	const policy = resolveFeishuReadGroupPolicy(cfg, account);
	if (policy === "disabled") return false;
	if (resolveFeishuGroupConfig({
		cfg: account.config,
		groupId: chatId
	})?.enabled === false) return false;
	if (current) return true;
	if (policy === "open") return true;
	const explicitlyConfigured = hasExplicitFeishuGroupConfig({
		cfg: account.config,
		groupId: chatId
	});
	const normalizedChatId = normalizeFeishuAllowEntry(chatId);
	return explicitlyConfigured || resolveAllowlistMatchByCandidates({
		allowList: normalizeFeishuAllowlist(account.config.groupAllowFrom),
		candidates: [{
			value: normalizedChatId,
			source: "id"
		}]
	}).allowed;
}
function isFeishuGroupReadEnabled(cfg, account, chatId) {
	if (resolveFeishuReadGroupPolicy(cfg, account) === "disabled") return false;
	return resolveFeishuGroupConfig({
		cfg: account.config,
		groupId: chatId
	})?.enabled !== false;
}
function isDmUniversallyAllowed(account) {
	return compileAllowlist(normalizeFeishuAllowlist(account.config.allowFrom)).wildcard;
}
function assertFeishuChatReadAllowed(params) {
	const authorization = resolveFeishuChatReadPreliminaryAuthorization(params);
	if (authorization.decision !== "allow") throw new ToolAuthorizationError("Feishu read target is not allowed.");
	return authorization.chatId;
}
function resolveFeishuChatReadPreliminaryAuthorization(params) {
	const chatId = normalizeChatId(params.chatId);
	const resolvedChatType = normalizeFeishuChatType(params.chatType);
	const knownGroup = resolvedChatType === "group" || params.chatType === void 0 && hasExplicitFeishuGroupConfig({
		cfg: params.account.config,
		groupId: chatId
	});
	const knownDm = resolvedChatType === "p2p";
	const current = isCurrentChat({
		account: params.account,
		chatId,
		ctx: params.ctx
	});
	const directOperator = readContextFields(params.ctx).directOperator;
	const groupAllowed = directOperator ? isFeishuGroupReadEnabled(params.cfg, params.account, chatId) : isFeishuGroupReadAllowed(params.cfg, params.account, chatId, current);
	const dmAllowed = directOperator || current || isDmUniversallyAllowed(params.account);
	if (knownGroup) return {
		chatId,
		decision: groupAllowed ? "allow" : "deny"
	};
	if (knownDm) return {
		chatId,
		decision: dmAllowed ? "allow" : "deny"
	};
	if (groupAllowed === dmAllowed) return {
		chatId,
		decision: groupAllowed ? "allow" : "deny"
	};
	return {
		chatId,
		decision: "needs-metadata"
	};
}
function authorizeFeishuChatMemberRead(params) {
	const chatId = assertFeishuChatReadAllowed(params);
	const chatType = normalizeFeishuChatType(params.chatType);
	if (chatType === "group") return {
		kind: "group",
		chatId
	};
	if (chatType !== "p2p") throw new ToolAuthorizationError("Feishu chat member reads require a known chat type.");
	if (!isCurrentChat({
		account: params.account,
		chatId,
		ctx: params.ctx
	})) throw new ToolAuthorizationError("Feishu direct-chat member reads require the current conversation.");
	const requesterSenderId = normalizeChatId(readContextFields(params.ctx).requesterSenderId);
	if (!requesterSenderId) throw new ToolAuthorizationError("Feishu direct-chat member identity is unavailable.");
	const requesterSenderIdType = detectIdType(requesterSenderId);
	if (requesterSenderIdType !== "open_id" && requesterSenderIdType !== "user_id") throw new ToolAuthorizationError("Feishu direct-chat member identity type is unavailable.");
	if (params.memberIdType && params.memberIdType !== requesterSenderIdType) throw new ToolAuthorizationError("Feishu direct-chat member identifier type must match the current sender.");
	if (params.memberId && normalizeChatId(params.memberId) !== requesterSenderId) throw new ToolAuthorizationError("Feishu direct-chat member reads are limited to the current sender.");
	return {
		kind: "direct",
		chatId,
		memberId: requesterSenderId,
		memberIdType: requesterSenderIdType
	};
}
function canEnumerateAllFeishuGroups(cfg, account) {
	const policy = resolveFeishuReadGroupPolicy(cfg, account);
	return policy === "open" || policy === "allowlist" && compileAllowlist(normalizeFeishuAllowlist(account.config.groupAllowFrom)).wildcard;
}
function canEnumerateAllFeishuPeers(account) {
	return isDmUniversallyAllowed(account);
}
//#endregion
//#region extensions/feishu/src/markdown.ts
const FEISHU_POST_MAX_BYTES = 30 * 1024;
/** One parser contract for Feishu message and document Markdown decisions. */
function parseFeishuMarkdown(text) {
	return fromMarkdown(text, {
		extensions: [gfmTable()],
		mdastExtensions: [gfmTableFromMarkdown()]
	});
}
function buildFeishuPostMentionElements(mentions) {
	if (!mentions?.length) return [];
	const elements = [];
	for (const mention of mentions) {
		const userId = mention.openId.trim();
		if (!userId) continue;
		const userName = mention.name.trim();
		elements.push({
			tag: "at",
			user_id: userId,
			...userName ? { user_name: userName } : {}
		});
	}
	return elements;
}
function buildFeishuPostMessageContent(params) {
	const content = [...buildFeishuPostMentionElements(params.mentions), {
		tag: "md",
		text: params.messageText
	}];
	return JSON.stringify({ zh_cn: { content: [content] } });
}
function assertFeishuPostWithinEnvelope(content, label) {
	if (Buffer.byteLength(content, "utf8") > FEISHU_POST_MAX_BYTES) throw new Error(`${label} exceeds the 30 KB rich-post API limit`);
}
function collectSoftBreakOffsets(text) {
	const root = parseFeishuMarkdown(text);
	const offsets = [];
	const pending = [root];
	while (pending.length > 0) {
		const node = pending.pop();
		if (!node) continue;
		if (node.children) pending.push(...node.children);
		if (node.type !== "text") continue;
		const start = node.position?.start.offset;
		const end = node.position?.end.offset;
		if (start === void 0 || end === void 0) continue;
		for (let offset = start; offset < end; offset += 1) {
			const char = text[offset];
			if (char === "\n") {
				if (text[offset - 1] !== "\r") offsets.push(offset);
				continue;
			}
			if (char === "\r") {
				offsets.push(offset);
				if (text[offset + 1] === "\n") offset += 1;
			}
		}
	}
	return offsets.toSorted((left, right) => left - right);
}
/**
* Materialize CommonMark soft breaks for Feishu post `md` rendering.
*
* The parser identifies only soft breaks, then upgrades them to CommonMark
* hard breaks. Structural line endings and code, HTML, definitions, setext
* headings, and existing hard breaks retain their source bytes.
*/
function materializeFeishuPostMarkdownSoftBreaks(text) {
	if (!text.includes("\n") && !text.includes("\r")) return text;
	const softBreakOffsets = collectSoftBreakOffsets(text);
	if (softBreakOffsets.length === 0) return text;
	const parts = [];
	let cursor = 0;
	for (const offset of softBreakOffsets) {
		const lineEnding = text[offset] === "\r" ? text[offset + 1] === "\n" ? "\r\n" : "\r" : "\n";
		parts.push(text.slice(cursor, offset), "  ", lineEnding);
		cursor = offset + lineEnding.length;
	}
	parts.push(text.slice(cursor));
	return parts.join("");
}
function chunkFeishuMarkdownWithMode(text, limit, mode) {
	return chunkMarkdownTextWithMode(text, limit, mode);
}
/** Keep every platform chunk independently valid Markdown, including fences. */
function chunkFeishuMarkdown(text, limit) {
	return chunkFeishuMarkdownWithMode(text, limit, "length");
}
function postContentBytes(messageText, mentions) {
	return Buffer.byteLength(buildFeishuPostMessageContent({
		messageText,
		mentions
	}), "utf8");
}
/**
* Honor both configured character chunking and Feishu's serialized post envelope.
* Markdown wrappers and first-chunk mentions count toward the byte budget.
*/
function chunkFeishuPostMarkdown(params) {
	const { text, firstChunkMentions, chunkMentions } = params;
	if (!text) return [];
	const requestedLimit = Number.isFinite(params.limit) && params.limit > 0 ? Math.floor(params.limit) : text.length;
	const initialChunks = params.initialChunks ?? chunkFeishuMarkdownWithMode(text, requestedLimit, params.mode ?? "length");
	const output = [];
	const resolveMentions = (isFirst) => {
		const mentions = [...chunkMentions ?? [], ...isFirst ? firstChunkMentions ?? [] : []];
		return mentions.length > 0 ? mentions : void 0;
	};
	for (const initialChunk of initialChunks) {
		if (postContentBytes(initialChunk, resolveMentions(output.length === 0)) <= FEISHU_POST_MAX_BYTES) {
			output.push(initialChunk);
			continue;
		}
		let adaptiveLimit = Math.max(1, Math.min(requestedLimit, initialChunk.length));
		while (true) {
			const chunks = chunkFeishuMarkdownWithMode(initialChunk, adaptiveLimit, params.mode ?? "length");
			let largestContentBytes = 0;
			let oversizedChunk;
			let oversizedMentions;
			for (const [index, chunk] of chunks.entries()) {
				const mentionsForChunk = resolveMentions(output.length === 0 && index === 0);
				const contentBytes = postContentBytes(chunk, mentionsForChunk);
				largestContentBytes = Math.max(largestContentBytes, contentBytes);
				if (contentBytes > FEISHU_POST_MAX_BYTES && oversizedChunk === void 0) {
					oversizedChunk = chunk;
					oversizedMentions = mentionsForChunk;
				}
			}
			if (oversizedChunk === void 0) {
				output.push(...chunks);
				break;
			}
			if (adaptiveLimit === 1) {
				assertFeishuPostWithinEnvelope(buildFeishuPostMessageContent({
					messageText: oversizedChunk,
					mentions: oversizedMentions
				}), "Feishu post chunk");
				return [...output, ...chunks];
			}
			adaptiveLimit = Math.max(1, Math.min(adaptiveLimit - 1, Math.floor(adaptiveLimit * FEISHU_POST_MAX_BYTES / largestContentBytes) - 1));
		}
	}
	return output;
}
//#endregion
//#region extensions/feishu/src/native-card.ts
const FEISHU_CARD_TEMPLATES = /* @__PURE__ */ new Set([
	"blue",
	"green",
	"red",
	"orange",
	"purple",
	"indigo",
	"wathet",
	"turquoise",
	"yellow",
	"grey",
	"carmine",
	"violet",
	"lime"
]);
function resolveFeishuCardTemplate(template) {
	const normalized = normalizeOptionalLowercaseString(template);
	if (!normalized || !FEISHU_CARD_TEMPLATES.has(normalized)) return;
	return normalized;
}
function escapeFeishuCardMarkdownText(text) {
	return text.replace(/[&<>]/g, (char) => {
		switch (char) {
			case "&": return "&amp;";
			case "<": return "&lt;";
			case ">": return "&gt;";
			default: return char;
		}
	});
}
function escapeFeishuCardPlainText(text) {
	return escapeFeishuCardMarkdownText(text).replace(/([\\`*_{}[\]()#+\-!|>~])/g, "\\$1");
}
function resolveSafeFeishuButtonUrl(url) {
	const trimmed = typeof url === "string" ? url.trim() : "";
	if (!trimmed) return;
	try {
		const parsed = new URL(trimmed);
		return parsed.protocol === "https:" || parsed.protocol === "http:" ? trimmed : void 0;
	} catch {
		return;
	}
}
function sanitizeNativeFeishuButtonBehavior(behavior) {
	if (!isRecord(behavior)) return;
	if (behavior.type === "open_url") {
		const safeUrl = resolveSafeFeishuButtonUrl(behavior.default_url) ?? resolveSafeFeishuButtonUrl(behavior.url);
		return safeUrl ? {
			type: "open_url",
			default_url: safeUrl
		} : void 0;
	}
	if (behavior.type === "callback" && isRecord(behavior.value) && behavior.value.oc === "ocf1") return {
		type: "callback",
		value: behavior.value
	};
}
function sanitizeNativeFeishuCardButton(button) {
	if (!isRecord(button)) return;
	const text = isRecord(button.text) && typeof button.text.content === "string" ? button.text.content : void 0;
	if (!text?.trim()) return;
	const style = button.type === "danger" ? "danger" : button.type === "primary" || button.type === "success" ? "primary" : void 0;
	const behaviors = Array.isArray(button.behaviors) ? button.behaviors.map((behavior) => sanitizeNativeFeishuButtonBehavior(behavior)).filter((behavior) => Boolean(behavior)) : [];
	const rootSafeUrl = resolveSafeFeishuButtonUrl(button.url);
	if (rootSafeUrl) behaviors.push({
		type: "open_url",
		default_url: rootSafeUrl
	});
	if (isRecord(button.value) && button.value.oc === "ocf1") behaviors.push({
		type: "callback",
		value: button.value
	});
	if (behaviors.length === 0) return;
	return {
		tag: "button",
		text: {
			tag: "plain_text",
			content: text
		},
		type: style === "danger" ? "danger" : style === "primary" ? "primary" : "default",
		behaviors
	};
}
function sanitizeNativeFeishuCardElements(element) {
	if (!isRecord(element) || typeof element.tag !== "string") return [];
	if (element.tag === "hr") return [{ tag: "hr" }];
	if (element.tag === "markdown" && typeof element.content === "string") return [{
		tag: "markdown",
		content: escapeFeishuCardMarkdownText(element.content)
	}];
	if (element.tag === "div" && isRecord(element.text)) {
		const text = element.text;
		if (text.tag === "lark_md" && typeof text.content === "string") return [{
			tag: "markdown",
			content: escapeFeishuCardMarkdownText(text.content)
		}];
		if (text.tag === "plain_text" && typeof text.content === "string") return [{
			tag: "markdown",
			content: escapeFeishuCardPlainText(text.content)
		}];
		return [];
	}
	if (element.tag === "button") {
		const button = sanitizeNativeFeishuCardButton(element);
		return button ? [button] : [];
	}
	if (element.tag === "action" && Array.isArray(element.actions)) return element.actions.map((action) => sanitizeNativeFeishuCardButton(action)).filter((action) => Boolean(action));
	return [];
}
function sanitizeNativeFeishuCard(card) {
	const normalizedCard = card.type === "interactive" && isRecord(card.card) ? card.card : card;
	const body = isRecord(normalizedCard.body) ? normalizedCard.body : void 0;
	const elements = (Array.isArray(body?.elements) ? body.elements : Array.isArray(normalizedCard.elements) ? normalizedCard.elements : []).flatMap((element) => sanitizeNativeFeishuCardElements(element)).filter((element) => Boolean(element));
	if (elements.length === 0) return;
	const header = isRecord(normalizedCard.header) ? normalizedCard.header : void 0;
	const title = isRecord(header?.title) && typeof header.title.content === "string" ? header.title.content : void 0;
	return {
		schema: "2.0",
		config: { width_mode: "fill" },
		...title?.trim() ? { header: {
			title: {
				tag: "plain_text",
				content: title
			},
			template: resolveFeishuCardTemplate(typeof header?.template === "string" ? header.template : void 0) ?? "blue"
		} } : {},
		body: { elements }
	};
}
function readNativeFeishuCardJson(text, options) {
	let trimmed = text?.trim();
	const responsePrefix = options?.responsePrefix;
	if (trimmed && responsePrefix && trimmed.startsWith(responsePrefix)) {
		const suffix = trimmed.slice(responsePrefix.length);
		if (/^\s+\{/.test(suffix)) trimmed = suffix.trimStart();
	}
	if (!trimmed?.startsWith("{") || !trimmed.endsWith("}")) return;
	try {
		const parsed = JSON.parse(trimmed);
		return isRecord(parsed) ? sanitizeNativeFeishuCard(parsed) : void 0;
	} catch {
		return;
	}
}
//#endregion
//#region extensions/feishu/src/send-result.ts
function resolveFeishuReceiptKind(msgType) {
	switch (msgType) {
		case "audio": return "voice";
		case "image":
		case "media":
		case "file": return "media";
		case "interactive": return "card";
		case "post":
		case "text": return "text";
		default: return "unknown";
	}
}
function createFeishuSendReceipt(params) {
	const messageId = params.messageId?.trim();
	const chatId = params.chatId.trim();
	return createMessageReceiptFromOutboundResults({
		results: messageId ? [{
			channel: "feishu",
			messageId,
			chatId,
			conversationId: chatId
		}] : [],
		...chatId ? { threadId: chatId } : {},
		kind: params.kind ?? "unknown"
	});
}
function assertFeishuMessageApiSuccess(response, errorPrefix) {
	if (response.code !== 0) throw new Error(`${errorPrefix}: ${response.msg || `code ${response.code}`}`);
}
function toFeishuSendResult(response, chatId, kind, errorPrefix = "Feishu send failed") {
	const messageId = response.data?.message_id?.trim();
	if (!messageId) throw createChannelPartialDeliveryError(/* @__PURE__ */ new Error(`${errorPrefix}: no message_id returned`), {
		messageIds: [],
		visibleReplySent: true
	});
	return {
		messageId,
		chatId,
		receipt: createFeishuSendReceipt({
			messageId,
			chatId,
			kind
		})
	};
}
//#endregion
export { resolveFeishuChatType as A, resolveFeishuDmIngressAccess as C, resolveFeishuGroupToolPolicy as D, resolveFeishuGroupSenderActivationIngressAccess as E, buildFeishuCardActionTextFallback as M, createFeishuCardInteractionEnvelope as N, resolveFeishuReplyPolicy as O, decodeFeishuCardAction as P, normalizeFeishuAllowEntry as S, resolveFeishuGroupConversationIngressAccess as T, canEnumerateAllFeishuPeers as _, readNativeFeishuCardJson as a, resolveFeishuChatReadPreliminaryAuthorization as b, assertFeishuPostWithinEnvelope as c, chunkFeishuPostMarkdown as d, materializeFeishuPostMarkdownSoftBreaks as f, canEnumerateAllFeishuGroups as g, authorizeFeishuChatMemberRead as h, toFeishuSendResult as i, FEISHU_CARD_INTERACTION_VERSION as j, normalizeFeishuChatType as k, buildFeishuPostMessageContent as l, assertFeishuChatReadAllowed as m, createFeishuSendReceipt as n, resolveFeishuCardTemplate as o, parseFeishuMarkdown as p, resolveFeishuReceiptKind as r, sanitizeNativeFeishuCard as s, assertFeishuMessageApiSuccess as t, chunkFeishuMarkdown as u, isFeishuGroupReadAllowed as v, resolveFeishuGroupConfig as w, hasExplicitFeishuGroupConfig as x, isFeishuGroupReadEnabled as y };
