import { a as maxBytesForKind } from "./constants-Mf57IYS0.js";
import { t as MEDIA_MAX_BYTES } from "./store-CvNsGg9Z.js";
//#region src/media/configured-max-bytes.ts
const MB = 1024 * 1024;
/** Resolves the global generated-media byte cap from the user-facing MB config value. */
function resolveConfiguredMediaMaxBytes(cfg) {
	const configured = cfg?.agents?.defaults?.mediaMaxMb;
	if (typeof configured === "number" && Number.isFinite(configured) && configured > 0) return Math.floor(configured * MB);
}
/** Returns the configured media cap, falling back to the media-core per-kind default. */
function resolveGeneratedMediaMaxBytes(cfg, kind) {
	return resolveConfiguredMediaMaxBytes(cfg) ?? maxBytesForKind(kind);
}
/** Reads channel/account media caps from raw channel config without requiring typed account schemas. */
function resolveChannelAccountMediaMaxMb(params) {
	const channelId = params.channel?.trim();
	const accountId = params.accountId?.trim();
	const channelCfg = channelId ? params.cfg.channels?.[channelId] : void 0;
	const channelObj = channelCfg && typeof channelCfg === "object" ? channelCfg : void 0;
	const channelMediaMax = typeof channelObj?.mediaMaxMb === "number" ? channelObj.mediaMaxMb : void 0;
	const accountsObj = channelObj?.accounts && typeof channelObj.accounts === "object" ? channelObj.accounts : void 0;
	const accountCfg = accountId && accountsObj ? accountsObj[accountId] : void 0;
	const accountMediaMax = accountCfg && typeof accountCfg === "object" ? accountCfg.mediaMaxMb : void 0;
	return (typeof accountMediaMax === "number" ? accountMediaMax : void 0) ?? channelMediaMax;
}
/** Resolves the byte cap for staging an outbound reply's media: channel/account, then agent default. */
function resolveOutboundMediaMaxBytes(params) {
	const limitMb = resolveChannelAccountMediaMaxMb(params) ?? params.cfg.agents?.defaults?.mediaMaxMb;
	return typeof limitMb === "number" && Number.isFinite(limitMb) && limitMb > 0 ? Math.floor(limitMb * MB) : MEDIA_MAX_BYTES;
}
//#endregion
export { resolveOutboundMediaMaxBytes as i, resolveConfiguredMediaMaxBytes as n, resolveGeneratedMediaMaxBytes as r, resolveChannelAccountMediaMaxMb as t };
