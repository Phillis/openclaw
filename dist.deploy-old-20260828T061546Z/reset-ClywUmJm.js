import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { f as parseThreadSessionSuffix, u as parseRawSessionConversationRef } from "./session-key-utils-Di3FvABa.js";
import { r as getLoadedChannelPluginForRead } from "./registry-loaded-Dbglb2uR.js";
import { n as normalizeMessageChannel } from "./message-channel-core-D5yZGaHY.js";
import "./message-channel-BZwx7FCw.js";
//#region src/channels/plugins/session-thread-info-loaded.ts
/**
* Loaded-plugin session thread info resolver.
*
* Uses only already loaded channel hooks to resolve thread suffix metadata on hot paths.
*/
function resolveLoadedSessionConversationThreadInfo(sessionKey) {
	const raw = parseRawSessionConversationRef(sessionKey);
	if (!raw) return null;
	const rawId = raw.rawId.trim();
	if (!rawId) return null;
	const resolved = (getLoadedChannelPluginForRead(raw.channel)?.messaging)?.resolveSessionConversation?.({
		kind: raw.kind,
		rawId
	});
	if (!resolved?.id?.trim()) return null;
	const id = resolved.id.trim();
	const threadId = normalizeOptionalString(resolved.threadId);
	return {
		baseSessionKey: threadId ? `${raw.prefix}:${id}` : normalizeOptionalString(sessionKey),
		threadId
	};
}
/**
* Resolves thread suffix metadata using loaded plugin hooks or generic parsing.
*/
function resolveLoadedSessionThreadInfo(sessionKey) {
	return resolveLoadedSessionConversationThreadInfo(sessionKey) ?? parseThreadSessionSuffix(sessionKey);
}
//#endregion
//#region src/config/sessions/reset.ts
const GROUP_SESSION_MARKERS = [":group:", ":channel:"];
/** Returns true when a session key is known to represent a thread. */
function isThreadSessionKey(sessionKey) {
	return Boolean(resolveLoadedSessionThreadInfo(sessionKey).threadId);
}
function resolveSessionResetType(params) {
	if (params.isThread || isThreadSessionKey(params.sessionKey)) return "thread";
	if (params.isGroup) return "group";
	const normalized = normalizeLowercaseStringOrEmpty(params.sessionKey);
	if (GROUP_SESSION_MARKERS.some((marker) => normalized.includes(marker))) return "group";
	return "direct";
}
function resolveThreadFlag(params) {
	if (params.messageThreadId != null) return true;
	if (params.threadLabel?.trim()) return true;
	if (params.threadStarterBody?.trim()) return true;
	if (params.parentSessionKey?.trim()) return true;
	return isThreadSessionKey(params.sessionKey);
}
function resolveChannelResetConfig(params) {
	const resetByChannel = params.sessionCfg?.resetByChannel;
	if (!resetByChannel) return;
	const normalized = normalizeMessageChannel(params.channel);
	const fallback = normalizeOptionalLowercaseString(params.channel);
	const key = normalized ?? fallback;
	if (!key) return;
	return resetByChannel[key];
}
//#endregion
export { resolveLoadedSessionThreadInfo as i, resolveSessionResetType as n, resolveThreadFlag as r, resolveChannelResetConfig as t };
