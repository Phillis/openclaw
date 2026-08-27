import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { w as parseStrictPositiveInteger } from "./number-coercion-oCkfUEEq.js";
import { n as normalizeAccountId } from "./account-id-BRqK6RmF.js";
import "./number-runtime-CoAPZzJY.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./account-resolution-Cb-rHsSW.js";
import { t as getFeishuRuntime } from "./runtime-zwHao5bm.js";
import { n as registerFeishuAiAgent, t as probeFeishu } from "./probe-DkO8A1q9.js";
//#region extensions/feishu/src/bot-identity-cache.ts
const FEISHU_BOT_IDENTITY_CACHE_NAMESPACE = "feishu.bot-identity-cache";
const FEISHU_BOT_IDENTITY_CACHE_MAX_ENTRIES = 128;
function openFeishuBotIdentityCache() {
	return getFeishuRuntime().state.openKeyedStore({
		namespace: FEISHU_BOT_IDENTITY_CACHE_NAMESPACE,
		maxEntries: FEISHU_BOT_IDENTITY_CACHE_MAX_ENTRIES
	});
}
function parseCachedFeishuBotIdentity(value) {
	if (!value || typeof value !== "object") return null;
	const state = value;
	const appId = normalizeOptionalString(state.appId);
	const botOpenId = normalizeOptionalString(state.botOpenId);
	const botName = normalizeOptionalString(state.botName);
	const fetchedAt = normalizeOptionalString(state.fetchedAt);
	if (!appId || !botOpenId || !fetchedAt || Number.isNaN(Date.parse(fetchedAt))) return null;
	return {
		appId,
		botOpenId,
		botName,
		fetchedAt
	};
}
async function readCachedFeishuBotIdentity(params) {
	const appId = normalizeOptionalString(params.appId);
	if (!appId) return null;
	const cached = parseCachedFeishuBotIdentity(await openFeishuBotIdentityCache().lookup(normalizeAccountId(params.accountId)));
	if (!cached || cached.appId !== appId) return null;
	return {
		botOpenId: cached.botOpenId,
		botName: cached.botName,
		fetchedAt: cached.fetchedAt
	};
}
async function writeCachedFeishuBotIdentity(params) {
	const appId = normalizeOptionalString(params.appId);
	const botOpenId = normalizeOptionalString(params.botOpenId);
	if (!appId || !botOpenId) return;
	const botName = normalizeOptionalString(params.botName);
	await openFeishuBotIdentityCache().register(normalizeAccountId(params.accountId), {
		appId,
		botOpenId,
		botName,
		fetchedAt: (/* @__PURE__ */ new Date()).toISOString()
	});
}
//#endregion
//#region extensions/feishu/src/monitor-startup-timeout.ts
const FEISHU_STARTUP_BOT_INFO_TIMEOUT_DEFAULT_MS = 3e4;
const FEISHU_STARTUP_BOT_INFO_TIMEOUT_ENV = "OPENCLAW_FEISHU_STARTUP_PROBE_TIMEOUT_MS";
function resolveStartupProbeTimeoutMs(env = process.env) {
	const raw = env[FEISHU_STARTUP_BOT_INFO_TIMEOUT_ENV];
	if (raw) {
		const parsed = parseStrictPositiveInteger(raw);
		if (parsed !== void 0) return parsed;
		console.warn(`[feishu] ${FEISHU_STARTUP_BOT_INFO_TIMEOUT_ENV}="${raw}" is invalid; using default ${FEISHU_STARTUP_BOT_INFO_TIMEOUT_DEFAULT_MS}ms`);
	}
	return FEISHU_STARTUP_BOT_INFO_TIMEOUT_DEFAULT_MS;
}
//#endregion
//#region extensions/feishu/src/monitor.startup.ts
const FEISHU_STARTUP_BOT_INFO_TIMEOUT_MS = resolveStartupProbeTimeoutMs();
function isTimeoutErrorMessage(message) {
	const lower = normalizeLowercaseStringOrEmpty(message);
	return lower.includes("timeout") || lower.includes("timed out");
}
function isAbortErrorMessage(message) {
	return normalizeLowercaseStringOrEmpty(message).includes("aborted");
}
async function writeProviderBotIdentityCache(params) {
	try {
		await writeCachedFeishuBotIdentity({
			accountId: params.account.accountId,
			appId: params.account.appId,
			botOpenId: params.botOpenId,
			botName: params.botName
		});
	} catch {
		params.runtime?.log?.(`feishu[${params.account.accountId}]: bot identity cache write failed; continuing startup`);
	}
}
async function readProviderBotIdentityCache(params) {
	try {
		const cached = await readCachedFeishuBotIdentity({
			accountId: params.account.accountId,
			appId: params.account.appId
		});
		if (!cached) return {};
		params.runtime?.log?.(`feishu[${params.account.accountId}]: using cached provider-verified bot identity while the fresh probe is unavailable`);
		return {
			botOpenId: cached.botOpenId,
			botName: cached.botName,
			source: "cache"
		};
	} catch {
		params.runtime?.log?.(`feishu[${params.account.accountId}]: bot identity cache read failed; continuing without cached identity`);
		return {};
	}
}
async function fetchBotIdentityForMonitor(account, options = {}) {
	if (options.abortSignal?.aborted) return {};
	const timeoutMs = options.timeoutMs ?? FEISHU_STARTUP_BOT_INFO_TIMEOUT_MS;
	const result = await probeFeishu(account, {
		timeoutMs,
		abortSignal: options.abortSignal
	});
	const resultAppId = normalizeOptionalString(result.appId);
	if (result.ok && resultAppId === account.appId) {
		registerFeishuAiAgent(account, { abortSignal: options.abortSignal }).then((registration) => {
			if (!registration.ok && registration.reason !== "aborted") (options.runtime?.log ?? console.log)(`feishu[${account.accountId}]: AI-agent registration unavailable (${registration.reason}); continuing with standard bot identity`);
		}).catch(() => {
			(options.runtime?.log ?? console.log)(`feishu[${account.accountId}]: AI-agent registration failed unexpectedly; continuing with standard bot identity`);
		});
		await writeProviderBotIdentityCache({
			account,
			botOpenId: result.botOpenId,
			botName: result.botName,
			runtime: options.runtime
		});
		return {
			botOpenId: normalizeOptionalString(result.botOpenId),
			botName: normalizeOptionalString(result.botName),
			source: "provider"
		};
	}
	if (result.ok) (options.runtime?.log ?? console.log)(`feishu[${account.accountId}]: bot info probe returned identity for a different app; ignoring stale result`);
	const probeError = result.error ?? void 0;
	if (options.abortSignal?.aborted || isAbortErrorMessage(probeError)) return {};
	if (isTimeoutErrorMessage(probeError)) (options.runtime?.error ?? console.error)(`feishu[${account.accountId}]: bot info probe timed out after ${timeoutMs}ms; continuing startup`);
	if (options.allowCachedFallback === false) return {};
	return readProviderBotIdentityCache({
		account,
		runtime: options.runtime
	});
}
//#endregion
export { fetchBotIdentityForMonitor as t };
