import "./account-id-BRqK6RmF.js";
import "./routing-CERGQFBr.js";
import { i as DEFAULT_EMOJIS } from "./channel-feedback-B6I2nrI5.js";
import { l as resolveDiscordAccountConfig, s as resolveDiscordAccount } from "./accounts-nD0JW5tp.js";
import { i as removeReactionDiscord } from "./send.reactions-RWLcNk0-.js";
//#region extensions/discord/src/subagent-progress.ts
const PROGRESS_STORE_TTL_MS = 10080 * 6e4;
const MAX_TRACKED_RUNS = 4096;
const RETRY_BASE_DELAY_MS = 1e3;
const RETRY_MAX_DELAY_MS = 60 * 6e4;
const RETRY_MAX_ATTEMPTS = 12;
const HISTORICAL_RUNNING_EMOJIS = /* @__PURE__ */ new Set([
	"1️⃣",
	"2️⃣",
	"3️⃣",
	"4️⃣",
	"5️⃣",
	"6️⃣",
	"7️⃣",
	"8️⃣",
	"9️⃣",
	"🔟"
]);
const recoveryRetries = /* @__PURE__ */ new Map();
function logFailure(api, action, error) {
	const message = error instanceof Error ? error.message : String(error);
	api.logger.debug?.(`discord retired subagent progress ${action} failed: ${message}`);
}
function reservedReactionEmojis(api, accountAckReaction) {
	const reserved = new Set(Object.values(DEFAULT_EMOJIS));
	for (const emoji of [api.config.messages?.ackReaction, accountAckReaction]) if (emoji?.trim()) reserved.add(emoji.trim());
	for (const agent of api.config.agents?.list ?? []) {
		const emoji = agent.identity?.emoji?.trim();
		if (emoji) reserved.add(emoji);
	}
	return reserved;
}
function clearRecoveryRetry(api) {
	const retry = recoveryRetries.get(api);
	if (retry?.timer) clearTimeout(retry.timer);
	recoveryRetries.delete(api);
}
function scheduleRecoveryRetry(api) {
	const retry = recoveryRetries.get(api) ?? { attempts: 0 };
	if (retry.timer || retry.attempts >= RETRY_MAX_ATTEMPTS) return;
	const delayMs = Math.min(RETRY_BASE_DELAY_MS * 2 ** retry.attempts, RETRY_MAX_DELAY_MS);
	retry.attempts += 1;
	retry.timer = setTimeout(() => {
		retry.timer = void 0;
		recoverDiscordSubagentProgress(api);
	}, delayMs);
	retry.timer.unref?.();
	recoveryRetries.set(api, retry);
}
async function cleanPersistedReaction(api, store, entry) {
	try {
		if (entry.value.accountId !== "default" && !resolveDiscordAccountConfig(api.config, entry.value.accountId)) return false;
		const account = resolveDiscordAccount({
			cfg: api.config,
			accountId: entry.value.accountId
		});
		if (!account.enabled || account.tokenStatus !== "available") return false;
		const emoji = entry.value.runningEmoji;
		if (emoji && HISTORICAL_RUNNING_EMOJIS.has(emoji) && !reservedReactionEmojis(api, account.config.ackReaction).has(emoji)) await removeReactionDiscord(entry.value.channelId, entry.value.messageId, emoji, {
			cfg: api.config,
			accountId: entry.value.accountId
		});
		await store.consume(entry.key);
		return true;
	} catch (error) {
		logFailure(api, "startup cleanup", error);
		return false;
	}
}
async function recoverDiscordSubagentProgressImpl(api) {
	let store;
	try {
		store = api.runtime.state.openKeyedStore({
			namespace: "subagent-progress",
			maxEntries: MAX_TRACKED_RUNS,
			overflowPolicy: "reject-new",
			defaultTtlMs: PROGRESS_STORE_TTL_MS
		});
	} catch (error) {
		logFailure(api, "state store open", error);
		scheduleRecoveryRetry(api);
		return;
	}
	let entries;
	try {
		entries = await store.entries();
	} catch (error) {
		logFailure(api, "startup recovery list", error);
		scheduleRecoveryRetry(api);
		return;
	}
	let retryNeeded = false;
	for (const entry of entries) if (!await cleanPersistedReaction(api, store, entry)) retryNeeded = true;
	if (retryNeeded) scheduleRecoveryRetry(api);
	else clearRecoveryRetry(api);
}
function resetDiscordSubagentProgressForTest() {
	for (const [api, retry] of recoveryRetries) {
		if (retry.timer) clearTimeout(retry.timer);
		recoveryRetries.delete(api);
	}
}
const recoverDiscordSubagentProgress = Object.assign(recoverDiscordSubagentProgressImpl, { resetForTest: resetDiscordSubagentProgressForTest });
//#endregion
export { recoverDiscordSubagentProgress };
