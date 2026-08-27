import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { u as normalizeStringEntries } from "./string-normalization-e_fvmxMf.js";
import { i as resolveAllowlistMatchByCandidates } from "./allowlist-match-B8i_bWcB.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import "./allow-from-C78YI2I3.js";
//#region extensions/matrix/src/matrix/monitor/allowlist.ts
function normalizeAllowList(list) {
	return normalizeStringEntries(list);
}
function normalizeMatrixUser(raw) {
	const value = (raw ?? "").trim();
	if (!value) return "";
	if (!value.startsWith("@") || !value.includes(":")) return normalizeLowercaseStringOrEmpty(value);
	return value;
}
function normalizeMatrixUserId(raw) {
	const trimmed = (raw ?? "").trim();
	if (!trimmed) return "";
	const lowered = normalizeLowercaseStringOrEmpty(trimmed);
	if (lowered.startsWith("matrix:")) return normalizeMatrixUser(trimmed.slice(7));
	if (lowered.startsWith("user:")) return normalizeMatrixUser(trimmed.slice(5));
	return normalizeMatrixUser(trimmed);
}
function normalizeMatrixAllowListEntry(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return "";
	if (trimmed === "*") return trimmed;
	const lowered = normalizeLowercaseStringOrEmpty(trimmed);
	if (lowered.startsWith("matrix:")) return `matrix:${normalizeMatrixUser(trimmed.slice(7))}`;
	if (lowered.startsWith("user:")) return `user:${normalizeMatrixUser(trimmed.slice(5))}`;
	return normalizeMatrixUser(trimmed);
}
function normalizeMatrixAllowList(list) {
	return normalizeAllowList(list).map((entry) => normalizeMatrixAllowListEntry(entry));
}
function resolveMatrixAllowListMatch(params) {
	const allowList = params.allowList;
	if (allowList.length === 0) return { allowed: false };
	if (allowList.includes("*")) return {
		allowed: true,
		matchKey: "*",
		matchSource: "wildcard"
	};
	const userId = normalizeMatrixUser(params.userId);
	return resolveAllowlistMatchByCandidates({
		allowList,
		candidates: [
			{
				value: userId,
				source: "id"
			},
			{
				value: userId ? `matrix:${userId}` : "",
				source: "prefixed-id"
			},
			{
				value: userId ? `user:${userId}` : "",
				source: "prefixed-user"
			}
		]
	});
}
//#endregion
export { normalizeMatrixUserId as n, resolveMatrixAllowListMatch as r, normalizeMatrixAllowList as t };
