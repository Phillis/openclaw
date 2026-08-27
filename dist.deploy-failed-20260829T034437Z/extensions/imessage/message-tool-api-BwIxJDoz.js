import { c as getCachedIMessageRemoteHost, o as resolveIMessageAccount } from "./accounts-DIpGOIiN.js";
import { normalizeE164 } from "openclaw/plugin-sdk/account-resolution";
import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createActionGate } from "openclaw/plugin-sdk/channel-actions";
import { Type } from "typebox";
import { asDateTimestampMs } from "openclaw/plugin-sdk/number-runtime";
import { createAllowedChatSenderMatcher, parseChatTargetPrefixesOrThrow, resolveServicePrefixedChatTarget, resolveServicePrefixedOrChatAllowTarget } from "openclaw/plugin-sdk/channel-targets";
//#region extensions/imessage/src/actions-contract.ts
const IMESSAGE_ACTIONS = {
	react: { gate: "reactions" },
	edit: { gate: "edit" },
	unsend: { gate: "unsend" },
	reply: { gate: "reply" },
	sendWithEffect: { gate: "sendWithEffect" },
	renameGroup: {
		gate: "renameGroup",
		groupOnly: true
	},
	setGroupIcon: {
		gate: "setGroupIcon",
		groupOnly: true
	},
	addParticipant: {
		gate: "addParticipant",
		groupOnly: true
	},
	removeParticipant: {
		gate: "removeParticipant",
		groupOnly: true
	},
	leaveGroup: {
		gate: "leaveGroup",
		groupOnly: true
	},
	sendAttachment: { gate: "sendAttachment" },
	poll: { gate: "polls" },
	"poll-vote": { gate: "polls" }
};
const IMESSAGE_ACTION_NAMES = Object.keys(IMESSAGE_ACTIONS);
//#endregion
//#region extensions/imessage/src/private-api-status.ts
const FOUNDATIONAL_RPC_METHODS = /* @__PURE__ */ new Set([
	"chats.list",
	"messages.history",
	"watch.subscribe",
	"watch.unsubscribe",
	"send"
]);
const bridgeStatusCache = /* @__PURE__ */ new Map();
function normalizeCliPath(cliPath) {
	return cliPath?.trim() || "imsg";
}
function imessageRpcSupportsMethod(status, method) {
	if (!status?.available) return false;
	if (status.rpcMethods.length === 0) return FOUNDATIONAL_RPC_METHODS.has(method);
	return status.rpcMethods.includes(method);
}
function getCachedIMessagePrivateApiStatus(cliPath) {
	const key = normalizeCliPath(cliPath);
	const entry = bridgeStatusCache.get(key);
	if (!entry) return;
	if (entry.expiresAt === 0) return entry.status;
	const now = asDateTimestampMs(Date.now());
	if (now === void 0 || entry.expiresAt <= now) {
		bridgeStatusCache.delete(key);
		return;
	}
	return entry.status;
}
function setCachedIMessagePrivateApiStatus(cliPath, status, expiresAt = 0) {
	if (expiresAt !== 0 && asDateTimestampMs(expiresAt) === void 0) return;
	bridgeStatusCache.set(normalizeCliPath(cliPath), {
		status,
		expiresAt
	});
}
//#endregion
//#region extensions/imessage/src/target-identifiers.ts
const BARE_CHAT_IDENTIFIER_RE = /^[0-9a-f]{32}$/i;
function isIMessagePhoneLikeHandle(raw) {
	return /^(?:tel:)?[+\d\s().-]+$/i.test(raw.trim());
}
function normalizeBareIMessageChatIdentifier(raw) {
	const trimmed = raw.trim();
	if (!BARE_CHAT_IDENTIFIER_RE.test(trimmed)) return;
	return trimmed.toLowerCase();
}
//#endregion
//#region extensions/imessage/src/targets.ts
const CHAT_ID_PREFIXES = [
	"chat_id:",
	"chatid:",
	"chat:"
];
const CHAT_GUID_PREFIXES = [
	"chat_guid:",
	"chatguid:",
	"guid:"
];
const CHAT_IDENTIFIER_PREFIXES = [
	"chat_identifier:",
	"chatidentifier:",
	"chatident:"
];
const SERVICE_PREFIXES = [
	{
		prefix: "imessage:",
		service: "imessage"
	},
	{
		prefix: "sms:",
		service: "sms"
	},
	{
		prefix: "auto:",
		service: "auto"
	}
];
function parseServicePrefixedBareChatIdentifier(params) {
	for (const { prefix } of SERVICE_PREFIXES) {
		if (!params.lower.startsWith(prefix)) continue;
		const chatIdentifier = normalizeBareIMessageChatIdentifier(params.trimmed.slice(prefix.length));
		if (chatIdentifier) return {
			kind: "chat_identifier",
			chatIdentifier
		};
	}
}
function normalizeIMessageHandle(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return "";
	const lowered = normalizeLowercaseStringOrEmpty(trimmed);
	if (lowered.startsWith("imessage:")) return normalizeIMessageHandle(trimmed.slice(9));
	if (lowered.startsWith("sms:")) return normalizeIMessageHandle(trimmed.slice(4));
	if (lowered.startsWith("auto:")) return normalizeIMessageHandle(trimmed.slice(5));
	for (const prefix of CHAT_ID_PREFIXES) if (lowered.startsWith(prefix)) return `chat_id:${trimmed.slice(prefix.length).trim()}`;
	for (const prefix of CHAT_GUID_PREFIXES) if (lowered.startsWith(prefix)) return `chat_guid:${trimmed.slice(prefix.length).trim()}`;
	for (const prefix of CHAT_IDENTIFIER_PREFIXES) if (lowered.startsWith(prefix)) return `chat_identifier:${trimmed.slice(prefix.length).trim()}`;
	if (trimmed.includes("@")) return normalizeLowercaseStringOrEmpty(trimmed);
	const bareChatIdentifier = normalizeBareIMessageChatIdentifier(trimmed);
	if (bareChatIdentifier) return `chat_identifier:${bareChatIdentifier}`;
	const normalized = isIMessagePhoneLikeHandle(trimmed) ? normalizeE164(trimmed) : "";
	if (normalized) return normalized;
	return trimmed.replace(/\s+/g, "");
}
function parseIMessageTarget(raw) {
	const trimmed = raw.trim();
	if (!trimmed) throw new Error("iMessage target is required");
	const lower = normalizeLowercaseStringOrEmpty(trimmed);
	const servicePrefixedBareChatIdentifier = parseServicePrefixedBareChatIdentifier({
		trimmed,
		lower
	});
	if (servicePrefixedBareChatIdentifier) return servicePrefixedBareChatIdentifier;
	const servicePrefixed = resolveServicePrefixedChatTarget({
		trimmed,
		lower,
		servicePrefixes: SERVICE_PREFIXES,
		chatIdPrefixes: CHAT_ID_PREFIXES,
		chatGuidPrefixes: CHAT_GUID_PREFIXES,
		chatIdentifierPrefixes: CHAT_IDENTIFIER_PREFIXES,
		parseTarget: parseIMessageTarget
	});
	if (servicePrefixed) {
		if (servicePrefixed.kind === "handle") return {
			...servicePrefixed,
			serviceExplicit: true
		};
		return servicePrefixed;
	}
	const chatTarget = parseChatTargetPrefixesOrThrow({
		trimmed,
		lower,
		chatIdPrefixes: CHAT_ID_PREFIXES,
		chatGuidPrefixes: CHAT_GUID_PREFIXES,
		chatIdentifierPrefixes: CHAT_IDENTIFIER_PREFIXES
	});
	if (chatTarget) return chatTarget;
	const bareChatIdentifier = normalizeBareIMessageChatIdentifier(trimmed);
	if (bareChatIdentifier) return {
		kind: "chat_identifier",
		chatIdentifier: bareChatIdentifier
	};
	return {
		kind: "handle",
		to: trimmed,
		service: "auto"
	};
}
function looksLikeIMessageExplicitTargetId(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return false;
	const lower = normalizeLowercaseStringOrEmpty(trimmed);
	if (/^(imessage:|sms:|auto:)/.test(lower)) return true;
	return CHAT_ID_PREFIXES.some((prefix) => lower.startsWith(prefix)) || CHAT_GUID_PREFIXES.some((prefix) => lower.startsWith(prefix)) || CHAT_IDENTIFIER_PREFIXES.some((prefix) => lower.startsWith(prefix)) || Boolean(normalizeBareIMessageChatIdentifier(trimmed));
}
function inferIMessageTargetChatType(raw) {
	try {
		if (parseIMessageTarget(raw).kind === "handle") return "direct";
		return "group";
	} catch {
		return;
	}
}
function parseIMessageAllowTarget(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return {
		kind: "handle",
		handle: ""
	};
	const servicePrefixed = resolveServicePrefixedOrChatAllowTarget({
		trimmed,
		lower: normalizeLowercaseStringOrEmpty(trimmed),
		servicePrefixes: SERVICE_PREFIXES,
		parseAllowTarget: parseIMessageAllowTarget,
		chatIdPrefixes: CHAT_ID_PREFIXES,
		chatGuidPrefixes: CHAT_GUID_PREFIXES,
		chatIdentifierPrefixes: CHAT_IDENTIFIER_PREFIXES
	});
	if (servicePrefixed) return servicePrefixed;
	return {
		kind: "handle",
		handle: normalizeIMessageHandle(trimmed)
	};
}
const isAllowedIMessageSenderMatcher = createAllowedChatSenderMatcher({
	normalizeSender: normalizeIMessageHandle,
	parseAllowTarget: parseIMessageAllowTarget,
	allowConversationTargets: false
});
function isAllowedIMessageSender(params) {
	return isAllowedIMessageSenderMatcher({
		...params,
		allowConversationTargets: false
	});
}
const isAllowedIMessageReplyContextSenderMatcher = createAllowedChatSenderMatcher({
	normalizeSender: normalizeIMessageHandle,
	parseAllowTarget: parseIMessageAllowTarget,
	allowConversationTargets: true
});
function isAllowedIMessageReplyContextSender(params) {
	return isAllowedIMessageReplyContextSenderMatcher(params);
}
function formatIMessageChatTarget(chatId) {
	if (!chatId || !Number.isFinite(chatId)) return "";
	return `chat_id:${chatId}`;
}
//#endregion
//#region extensions/imessage/src/message-tool-api.ts
const PRIVATE_API_ACTIONS = /* @__PURE__ */ new Set([
	"react",
	"edit",
	"unsend",
	"reply",
	"sendWithEffect",
	"renameGroup",
	"setGroupIcon",
	"addParticipant",
	"removeParticipant",
	"leaveGroup",
	"sendAttachment",
	"poll",
	"poll-vote"
]);
function isGroupTarget(raw) {
	if (!raw) return false;
	return inferIMessageTargetChatType(raw) === "group";
}
function describeIMessageMessageTool({ cfg, accountId, currentChannelId }) {
	const account = resolveIMessageAccount({
		cfg,
		accountId
	});
	if (!account.enabled || !account.configured) return null;
	const cliPath = account.config.cliPath?.trim() || "imsg";
	const privateApiStatus = getCachedIMessagePrivateApiStatus(cliPath);
	const remote = Boolean(getCachedIMessageRemoteHost({
		cliPath,
		remoteHost: account.config.remoteHost
	}));
	const gate = createActionGate(account.config.actions);
	const actions = /* @__PURE__ */ new Set();
	for (const action of IMESSAGE_ACTION_NAMES) {
		const spec = IMESSAGE_ACTIONS[action];
		if (!spec?.gate || !gate(spec.gate)) continue;
		if (privateApiStatus?.available === false && PRIVATE_API_ACTIONS.has(action)) continue;
		if (action === "edit" && privateApiStatus?.selectors && !privateApiStatus.selectors.editMessage && !privateApiStatus.selectors.editMessageItem) continue;
		if (action === "unsend" && privateApiStatus?.selectors?.retractMessagePart !== true) continue;
		if (action === "poll" && privateApiStatus?.selectors && !privateApiStatus.selectors.pollPayloadMessage) continue;
		if (action === "poll-vote" && privateApiStatus?.selectors && !privateApiStatus.selectors.pollVoteMessage) continue;
		if (action === "poll-vote" && privateApiStatus && !imessageRpcSupportsMethod(privateApiStatus, "poll.vote")) continue;
		actions.add(action);
	}
	if (!isGroupTarget(currentChannelId)) {
		for (const action of IMESSAGE_ACTION_NAMES) if ("groupOnly" in IMESSAGE_ACTIONS[action] && IMESSAGE_ACTIONS[action].groupOnly) actions.delete(action);
	}
	if (actions.delete("sendAttachment")) actions.add("upload-file");
	return {
		actions: Array.from(actions),
		...actions.has("poll-vote") ? { schema: {
			properties: {
				...remote ? {
					pollOptionId: Type.Optional(Type.String({ description: "Stable iMessage poll option id. Required for Remote Mac over SSH accounts; copy it from the inbound poll options." })),
					pollOptionIndex: Type.Optional(Type.Integer({
						minimum: 1,
						description: "Local iMessage accounts only. Remote Mac accounts must use pollOptionId."
					}))
				} : {},
				pollOptionText: Type.Optional(Type.String({ description: remote ? "Local iMessage accounts only. Remote Mac accounts must use pollOptionId." : "Exact iMessage poll option text." }))
			},
			actions: ["poll-vote"],
			visibility: "all-configured"
		} } : {}
	};
}
//#endregion
export { isAllowedIMessageSender as a, parseIMessageAllowTarget as c, normalizeBareIMessageChatIdentifier as d, getCachedIMessagePrivateApiStatus as f, IMESSAGE_ACTION_NAMES as g, IMESSAGE_ACTIONS as h, isAllowedIMessageReplyContextSender as i, parseIMessageTarget as l, setCachedIMessagePrivateApiStatus as m, formatIMessageChatTarget as n, looksLikeIMessageExplicitTargetId as o, imessageRpcSupportsMethod as p, inferIMessageTargetChatType as r, normalizeIMessageHandle as s, describeIMessageMessageTool as t, isIMessagePhoneLikeHandle as u };
