import { i as resolveAllowlistMatchByCandidates } from "./allowlist-match-B8i_bWcB.js";
import "./allow-from-C78YI2I3.js";
import { t as parseDiscordTarget } from "./target-parsing-CEpBARoV.js";
//#region extensions/discord/src/normalize.ts
function normalizeDiscordMessagingTarget(raw) {
	return parseDiscordTarget(raw, { defaultKind: "channel" })?.normalized;
}
/**
* Normalize a Discord outbound target for delivery. Bare numeric IDs are
* prefixed with "channel:" to avoid the ambiguous-target error in
* parseDiscordTarget, unless the ID is explicitly configured as an allowed DM
* sender. All other formats pass through unchanged.
*/
function normalizeDiscordOutboundTarget(to, allowFrom) {
	const trimmed = to?.trim();
	if (!trimmed) return {
		ok: false,
		error: /* @__PURE__ */ new Error("Discord recipient is required. Use \"channel:<id>\" for channels or \"user:<id>\" for DMs.")
	};
	if (/^\d+$/.test(trimmed)) {
		if (allowFromContainsDiscordUserId(allowFrom, trimmed)) return {
			ok: true,
			to: `user:${trimmed}`
		};
		return {
			ok: true,
			to: `channel:${trimmed}`
		};
	}
	return {
		ok: true,
		to: trimmed
	};
}
function allowFromContainsDiscordUserId(allowFrom, userId) {
	const normalizedUserId = userId.trim();
	if (!normalizedUserId) return false;
	return resolveAllowlistMatchByCandidates({
		allowList: (allowFrom ?? []).map(normalizeAllowFromDiscordUserId).filter((entry) => Boolean(entry)),
		candidates: [{
			value: normalizedUserId,
			source: "id"
		}]
	}).allowed;
}
function normalizeAllowFromDiscordUserId(entry) {
	const trimmed = entry.trim().toLowerCase();
	if (!trimmed || trimmed === "*") return;
	const mentionMatch = /^<@!?(\d+)>$/.exec(trimmed);
	if (mentionMatch) return mentionMatch[1];
	const prefixedMatch = /^(?:discord:)?user:(\d+)$/.exec(trimmed);
	if (prefixedMatch) return prefixedMatch[1];
	const discordMatch = /^discord:(\d+)$/.exec(trimmed);
	if (discordMatch) return discordMatch[1];
	return /^\d+$/.test(trimmed) ? trimmed : void 0;
}
function looksLikeDiscordTargetId(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return false;
	if (/^<@!?\d+>$/.test(trimmed)) return true;
	if (/^(?:(?:user|channel|discord):\d+|discord:(?:user|channel):\d+)$/i.test(trimmed)) return true;
	if (/^\d{6,}$/.test(trimmed)) return true;
	return false;
}
//#endregion
export { normalizeDiscordOutboundTarget as i, looksLikeDiscordTargetId as n, normalizeDiscordMessagingTarget as r, allowFromContainsDiscordUserId as t };
