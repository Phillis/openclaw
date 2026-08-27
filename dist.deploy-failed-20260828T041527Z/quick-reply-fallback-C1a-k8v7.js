import { u as normalizeStringEntries } from "./string-normalization-e_fvmxMf.js";
import { n as normalizeAccountId } from "./account-id-BH0zJUew.js";
import { t as resolveAccountEntry } from "./account-lookup-CaTe6-6f.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import "./account-resolution-B2Bh3J2z.js";
import { t as createPluginRuntimeStore } from "./runtime-store-CjjjpvHZ.js";
//#region extensions/line/src/runtime.ts
const { setRuntime: setLineRuntime, getRuntime: getLineRuntime } = createPluginRuntimeStore({
	pluginId: "line",
	errorMessage: "LINE runtime not initialized - plugin not registered"
});
//#endregion
//#region extensions/line/src/group-keys.ts
function resolveLineGroupLookupIds(groupId) {
	const normalized = groupId?.trim();
	if (!normalized) return [];
	if (normalized.startsWith("group:") || normalized.startsWith("room:")) {
		const rawId = normalized.split(":").slice(1).join(":");
		return rawId ? [rawId, normalized] : [normalized];
	}
	return [
		normalized,
		`group:${normalized}`,
		`room:${normalized}`
	];
}
function resolveLineGroupConfigEntry(groups, params) {
	if (!groups) return;
	for (const candidate of resolveLineGroupLookupIds(params.groupId)) {
		const hit = groups[candidate];
		if (hit) return hit;
	}
	for (const candidate of resolveLineGroupLookupIds(params.roomId)) {
		const hit = groups[candidate];
		if (hit) return hit;
	}
	return groups["*"];
}
function resolveLineGroupsConfig(cfg, accountId) {
	const lineConfig = cfg.channels?.line;
	if (!lineConfig) return;
	const normalizedAccountId = normalizeAccountId(accountId);
	return resolveAccountEntry(lineConfig.accounts, normalizedAccountId)?.groups ?? lineConfig.groups;
}
function resolveExactLineGroupConfigKey(params) {
	const { groups } = params;
	if (!groups) return;
	return resolveLineGroupLookupIds(params.groupId).find((candidate) => Object.hasOwn(groups, candidate));
}
//#endregion
//#region extensions/line/src/quick-reply-fallback.ts
function buildLineQuickReplyFallbackText(labels) {
	const normalized = normalizeStringEntries(labels ?? []).slice(0, 13);
	if (normalized.length === 0) return "Choose an option.";
	return `Options:\n${normalized.map((label) => `- ${label}`).join("\n")}`;
}
//#endregion
export { resolveLineGroupsConfig as a, resolveLineGroupLookupIds as i, resolveExactLineGroupConfigKey as n, getLineRuntime as o, resolveLineGroupConfigEntry as r, setLineRuntime as s, buildLineQuickReplyFallbackText as t };
