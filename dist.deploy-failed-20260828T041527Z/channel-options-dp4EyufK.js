import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { t as readCliStartupMetadata } from "./startup-metadata-CCK-kryO.js";
//#region src/cli/channel-options.ts
function loadPrecomputedChannelOptions() {
	try {
		const parsed = readCliStartupMetadata(import.meta.url);
		if (parsed && Array.isArray(parsed.channelOptions)) return uniqueStrings(parsed.channelOptions.filter((value) => typeof value === "string" && Boolean(value)));
	} catch {}
	return null;
}
function resolveCliChannelOptions() {
	return loadPrecomputedChannelOptions() ?? [];
}
function formatCliChannelOptions(extra = []) {
	const options = [...extra, ...resolveCliChannelOptions()];
	return options.length > 0 ? options.join("|") : "channel";
}
//#endregion
export { resolveCliChannelOptions as n, formatCliChannelOptions as t };
