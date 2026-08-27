import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty, u as normalizeOptionalStringifiedId } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAccountId } from "./account-id-BRqK6RmF.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./routing-CERGQFBr.js";
//#region extensions/discord/src/directory-cache-state.ts
const discordDirectoryCacheState = { handlesByAccount: /* @__PURE__ */ new Map() };
//#endregion
//#region extensions/discord/src/directory-cache.ts
const DISCORD_DIRECTORY_CACHE_MAX_ENTRIES = 4e3;
const DISCORD_DISCRIMINATOR_SUFFIX = /#\d{4}$/;
function normalizeAccountCacheKey(accountId) {
	return normalizeAccountId(accountId ?? "default") || "default";
}
function normalizeSnowflake(value) {
	const text = normalizeOptionalStringifiedId(value) ?? "";
	if (!/^\d+$/.test(text)) return null;
	return text;
}
function normalizeDiscordHandleKey(raw) {
	let handle = normalizeOptionalString(raw) ?? "";
	if (!handle) return null;
	if (handle.startsWith("@")) handle = normalizeOptionalString(handle.slice(1)) ?? "";
	if (!handle || /\s/.test(handle)) return null;
	return normalizeLowercaseStringOrEmpty(handle);
}
function ensureAccountCache(accountId) {
	const cacheKey = normalizeAccountCacheKey(accountId);
	const existing = discordDirectoryCacheState.handlesByAccount.get(cacheKey);
	if (existing) return existing;
	const created = /* @__PURE__ */ new Map();
	discordDirectoryCacheState.handlesByAccount.set(cacheKey, created);
	return created;
}
function setCacheEntry(cache, key, userId) {
	if (cache.has(key)) cache.delete(key);
	cache.set(key, userId);
	if (cache.size <= DISCORD_DIRECTORY_CACHE_MAX_ENTRIES) return;
	const oldest = cache.keys().next();
	if (!oldest.done) cache.delete(oldest.value);
}
function rememberDiscordDirectoryUser(params) {
	const userId = normalizeSnowflake(params.userId);
	if (!userId) return;
	const cache = ensureAccountCache(params.accountId);
	for (const candidate of params.handles) {
		if (typeof candidate !== "string") continue;
		const handle = normalizeDiscordHandleKey(candidate);
		if (!handle) continue;
		setCacheEntry(cache, handle, userId);
		const withoutDiscriminator = handle.replace(DISCORD_DISCRIMINATOR_SUFFIX, "");
		if (withoutDiscriminator && withoutDiscriminator !== handle) setCacheEntry(cache, withoutDiscriminator, userId);
	}
}
function resolveDiscordDirectoryUserId(params) {
	const cache = discordDirectoryCacheState.handlesByAccount.get(normalizeAccountCacheKey(params.accountId));
	if (!cache) return;
	const handle = normalizeDiscordHandleKey(params.handle);
	if (!handle) return;
	const direct = cache.get(handle);
	if (direct) return direct;
	const withoutDiscriminator = handle.replace(DISCORD_DISCRIMINATOR_SUFFIX, "");
	if (!withoutDiscriminator || withoutDiscriminator === handle) return;
	return cache.get(withoutDiscriminator);
}
//#endregion
export { rememberDiscordDirectoryUser as n, resolveDiscordDirectoryUserId as r, normalizeDiscordHandleKey as t };
