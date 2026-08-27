import { F as resolveTimerTimeoutMs } from "./number-coercion-oCkfUEEq.js";
import { _ as resolvePinnedHostnameWithPolicy } from "./ssrf-UFPP-fbI.js";
import { p as readProviderJsonResponse } from "./provider-http-errors-BH2HGv8j.js";
import "./number-runtime-CoAPZzJY.js";
import "./ssrf-runtime-DEEsG6Hl.js";
import "./provider-http-DfD6NQiF.js";
//#region extensions/zalo/src/timeouts.ts
const ZALO_DEFAULT_REQUEST_TIMEOUT_MS = 3e4;
const ZALO_OUTBOUND_MEDIA_TTL_MS = 2 * 6e4;
const ZALO_SEND_PHOTO_REQUEST_TIMEOUT_MS = 15e4;
//#endregion
//#region extensions/zalo/src/api.ts
/**
* Zalo Bot API client
* @see https://bot.zaloplatforms.com/docs
*/
const ZALO_API_BASE = "https://bot-api.zaloplatforms.com";
const ZALO_API_URL_ENV = "ZALO_API_URL";
const ZALO_MEDIA_SSRF_POLICY = {};
var ZaloApiError = class extends Error {
	constructor(message, errorCode, description) {
		super(message);
		this.errorCode = errorCode;
		this.description = description;
		this.name = "ZaloApiError";
	}
	/** True if this is a long-polling timeout (no updates available) */
	get isPollingTimeout() {
		return this.errorCode === 408;
	}
};
function resolveZaloApiUrl(apiUrl) {
	const value = apiUrl === void 0 ? process.env[ZALO_API_URL_ENV]?.trim() ?? ZALO_API_BASE : apiUrl.trim();
	if (!value) throw new Error(`${ZALO_API_URL_ENV} must not be empty.`);
	let parsed;
	try {
		parsed = new URL(value);
	} catch {
		throw new Error(`${ZALO_API_URL_ENV} must be a valid URL.`);
	}
	if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new Error(`${ZALO_API_URL_ENV} must use http:// or https://.`);
	if (parsed.search || parsed.hash) throw new Error(`${ZALO_API_URL_ENV} must not include a query string or fragment.`);
	return parsed.href.replace(/\/+$/u, "");
}
/**
* Call the Zalo Bot API
*/
async function callZaloApi(method, token, body, options) {
	const url = `${resolveZaloApiUrl(options?.apiUrl)}/bot${token}/${method}`;
	const controller = new AbortController();
	const requestTimeoutMs = resolveTimerTimeoutMs(options?.timeoutMs, ZALO_DEFAULT_REQUEST_TIMEOUT_MS);
	const timeoutId = setTimeout(() => controller.abort(), requestTimeoutMs);
	const fetcher = options?.fetch ?? fetch;
	try {
		const data = await readProviderJsonResponse(await fetcher(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: body ? JSON.stringify(body) : void 0,
			signal: controller.signal
		}), `zalo.${method}`);
		if (!data.ok) throw new ZaloApiError(data.description ?? `Zalo API error: ${method}`, data.error_code, data.description);
		return data;
	} finally {
		clearTimeout(timeoutId);
	}
}
/**
* Validate bot token and get bot info
*/
async function getMe(token, timeoutMs, fetcher) {
	return callZaloApi("getMe", token, void 0, {
		timeoutMs,
		fetch: fetcher
	});
}
/**
* Send a text message
*/
async function sendMessage(token, params, fetcher) {
	return callZaloApi("sendMessage", token, params, { fetch: fetcher });
}
/**
* Send a photo message
*/
async function sendPhoto(token, params, fetcher) {
	const photoUrl = params.photo.trim();
	let parsedPhotoUrl;
	try {
		parsedPhotoUrl = new URL(photoUrl);
	} catch {
		throw new Error("Zalo photo URL must be an absolute HTTP or HTTPS URL");
	}
	if (parsedPhotoUrl.protocol !== "http:" && parsedPhotoUrl.protocol !== "https:") throw new Error("Zalo photo URL must use HTTP or HTTPS");
	await resolvePinnedHostnameWithPolicy(parsedPhotoUrl.hostname, { policy: ZALO_MEDIA_SSRF_POLICY });
	return callZaloApi("sendPhoto", token, {
		...params,
		photo: parsedPhotoUrl.href
	}, {
		timeoutMs: ZALO_SEND_PHOTO_REQUEST_TIMEOUT_MS,
		fetch: fetcher
	});
}
/**
* Send a temporary chat action such as typing.
*/
async function sendChatAction(token, params, fetcher, timeoutMs) {
	return callZaloApi("sendChatAction", token, params, {
		timeoutMs,
		fetch: fetcher
	});
}
/**
* Get updates using long polling (dev/testing only)
* Note: Zalo returns a single update per call, not an array like Telegram
*/
async function getUpdates(token, params, fetcher) {
	const pollTimeoutSec = params?.timeout ?? 30;
	const timeoutMs = (pollTimeoutSec + 5) * 1e3;
	return callZaloApi("getUpdates", token, { timeout: String(pollTimeoutSec) }, {
		timeoutMs,
		fetch: fetcher
	});
}
/**
* Set webhook URL for receiving updates
*/
async function setWebhook(token, params, fetcher) {
	return callZaloApi("setWebhook", token, params, { fetch: fetcher });
}
/**
* Delete webhook configuration
*/
async function deleteWebhook(token, fetcher, timeoutMs) {
	return callZaloApi("deleteWebhook", token, void 0, {
		timeoutMs,
		fetch: fetcher
	});
}
/**
* Get current webhook info
*/
async function getWebhookInfo(token, fetcher) {
	return callZaloApi("getWebhookInfo", token, void 0, { fetch: fetcher });
}
//#endregion
export { getWebhookInfo as a, sendPhoto as c, getUpdates as i, setWebhook as l, deleteWebhook as n, sendChatAction as o, getMe as r, sendMessage as s, ZaloApiError as t, ZALO_OUTBOUND_MEDIA_TTL_MS as u };
