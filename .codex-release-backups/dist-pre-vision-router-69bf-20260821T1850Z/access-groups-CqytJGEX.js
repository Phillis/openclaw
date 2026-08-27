import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { t as createSubsystemLogger } from "./subsystem-DNgaGOch.js";
import { a as parseAccessGroupAllowFromEntry, i as mergeDmAllowFromSources, r as isSenderIdAllowed } from "./allow-from-D4kg2zcb.js";
import "./runtime-env-dZQRmQRq.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./security-runtime-fAO34zGh.js";
import { t as expandAllowFromWithAccessGroups } from "./access-groups-DdAoO5yT.js";
import "./allow-from-D8N51uwu.js";
//#region extensions/telegram/src/bot-access.ts
const warnedInvalidEntries = /* @__PURE__ */ new Set();
const log = createSubsystemLogger("telegram/bot-access");
function warnInvalidAllowFromEntries(entries) {
	if (process.env.VITEST || false) return;
	for (const entry of entries) {
		if (warnedInvalidEntries.has(entry)) continue;
		warnedInvalidEntries.add(entry);
		log.warn([
			"Invalid allowFrom entry:",
			JSON.stringify(entry),
			"- allowFrom/groupAllowFrom authorization expects numeric Telegram sender user IDs only.",
			"To allow a Telegram group or supergroup, add its negative chat ID under \"channels.telegram.groups\" instead.",
			"If you had \"@username\" entries, re-run setup (it resolves @username to IDs) or replace them manually."
		].join(" "));
	}
}
const normalizeAllowFrom = (list) => {
	const entries = (list ?? []).map((value) => normalizeOptionalString(String(value)) ?? "").filter(Boolean);
	const hasWildcard = entries.includes("*");
	const normalized = entries.filter((value) => value !== "*").map((value) => value.replace(/^(telegram|tg):/i, ""));
	const invalidEntries = normalized.filter((value) => !/^\d+$/.test(value));
	if (invalidEntries.length > 0) warnInvalidAllowFromEntries(uniqueStrings(invalidEntries));
	return {
		entries: normalized.filter((value) => /^\d+$/.test(value)),
		hasWildcard,
		hasEntries: entries.length > 0,
		invalidEntries
	};
};
const normalizeDmAllowFromWithStore = (params) => normalizeAllowFrom(mergeDmAllowFromSources(params));
function resolveTelegramEffectiveDmPolicy(params) {
	if (!params.isGroup && params.groupConfig && "dmPolicy" in params.groupConfig) return params.groupConfig.dmPolicy ?? params.dmPolicy ?? "pairing";
	return params.dmPolicy ?? "pairing";
}
const isSenderAllowed = (params) => {
	const { allow, senderId } = params;
	return isSenderIdAllowed(allow, senderId, true);
};
//#endregion
//#region extensions/telegram/src/access-groups.ts
async function expandTelegramAllowFromWithAccessGroups(params) {
	const allowFrom = (params.allowFrom ?? []).map(String);
	const senderId = params.senderId?.trim() ?? "";
	const expanded = params.cfg && senderId ? await expandAllowFromWithAccessGroups({
		cfg: params.cfg,
		allowFrom,
		channel: "telegram",
		accountId: params.accountId ?? "default",
		senderId,
		isSenderAllowed: (candidateSenderId, allowEntries) => isSenderAllowed({
			allow: normalizeAllowFrom(allowEntries),
			senderId: candidateSenderId
		})
	}) : allowFrom;
	const originalEntries = new Set(allowFrom);
	return expanded.some((entry) => !originalEntries.has(entry)) ? expanded.filter((entry) => parseAccessGroupAllowFromEntry(entry) == null) : expanded;
}
async function resolveTelegramDmAllow(params) {
	const allowFrom = params.groupAllowOverride ?? params.allowFrom;
	const expandedAllowFrom = await expandTelegramAllowFromWithAccessGroups({
		cfg: params.cfg,
		allowFrom,
		accountId: params.accountId,
		senderId: params.senderId
	});
	return {
		allowFrom,
		expandedAllowFrom,
		effectiveAllow: normalizeDmAllowFromWithStore({
			allowFrom: expandedAllowFrom,
			storeAllowFrom: params.storeAllowFrom,
			dmPolicy: params.dmPolicy
		})
	};
}
//#endregion
export { normalizeDmAllowFromWithStore as a, normalizeAllowFrom as i, resolveTelegramDmAllow as n, resolveTelegramEffectiveDmPolicy as o, isSenderAllowed as r, expandTelegramAllowFromWithAccessGroups as t };
