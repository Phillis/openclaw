import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { c as asFiniteNumberInRange, x as parseStrictFiniteNumber } from "./number-coercion-CLj0HTDM.js";
import { n as isTransientNetworkError } from "./retryable-network-errors-cvh3iRtf.js";
import { t as parseRetryAfterHeaderSeconds } from "./retry-after-BIGpiFES.js";
import "./number-runtime-Cy4drVnh.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import "./retry-runtime-D94jIZiS.js";
//#region extensions/msteams/src/errors.ts
const MAX_SAFE_RETRY_AFTER_SECONDS = Number.MAX_SAFE_INTEGER / 1e3;
function formatUnknownError(err) {
	if (err instanceof Error) return err.message;
	if (typeof err === "string") return err;
	if (err === null) return "null";
	if (err === void 0) return "undefined";
	if (typeof err === "number" || typeof err === "boolean" || typeof err === "bigint") return String(err);
	if (typeof err === "symbol") return err.description ?? err.toString();
	if (typeof err === "function") return err.name ? `[function ${err.name}]` : "[function]";
	try {
		return JSON.stringify(err) ?? "unknown error";
	} catch {
		return "unknown error";
	}
}
function extractStatusCode(err) {
	if (!isRecord(err)) return null;
	const parseStatusCode = (value) => {
		if (typeof value === "number") return Number.isInteger(value) && value >= 100 && value <= 599 ? value : null;
		if (typeof value === "string") {
			const trimmed = value.trim();
			if (!/^\d{3}$/.test(trimmed)) return null;
			const parsed = Number(trimmed);
			return parsed >= 100 && parsed <= 599 ? parsed : null;
		}
		return null;
	};
	const directStatus = parseStatusCode(err.statusCode ?? err.status);
	if (directStatus !== null) return directStatus;
	const response = err.response;
	if (isRecord(response)) {
		const responseStatus = parseStatusCode(response.status);
		if (responseStatus !== null) return responseStatus;
	}
	return null;
}
function extractErrorCode(err) {
	if (!isRecord(err)) return null;
	const direct = err.code;
	if (typeof direct === "string" && direct.trim()) return direct;
	const response = err.response;
	if (!isRecord(response)) return null;
	const body = response.body;
	if (isRecord(body)) {
		const error = body.error;
		if (isRecord(error) && typeof error.code === "string" && error.code.trim()) return error.code;
	}
	return null;
}
function extractRetryAfterMs(err) {
	if (!isRecord(err)) return null;
	const directMs = asFiniteNumberInRange(err.retryAfterMs ?? err.retry_after_ms, {
		min: 0,
		max: Number.MAX_SAFE_INTEGER
	});
	if (directMs !== void 0) return directMs;
	const retryAfter = err.retryAfter ?? err.retry_after;
	const retryAfterSeconds = asFiniteNumberInRange(retryAfter, {
		min: 0,
		max: MAX_SAFE_RETRY_AFTER_SECONDS
	});
	if (retryAfterSeconds !== void 0) return retryAfterSeconds * 1e3;
	if (typeof retryAfter === "string") {
		const parsed = parseNonNegativeRetryAfterSeconds(retryAfter);
		if (parsed !== void 0) return parsed * 1e3;
	}
	const response = err.response;
	if (!isRecord(response)) return null;
	const headers = response.headers;
	if (!headers) return null;
	if (isRecord(headers)) {
		const raw = headers["retry-after"] ?? headers["Retry-After"];
		if (typeof raw === "string") {
			const parsed = parseRetryAfterHeaderSeconds(raw);
			if (parsed !== void 0) return parsed * 1e3;
		}
	}
	if (typeof headers === "object" && headers !== null && "get" in headers && typeof headers.get === "function") {
		const raw = headers.get("retry-after");
		if (raw) {
			const parsed = parseRetryAfterHeaderSeconds(raw);
			if (parsed !== void 0) return parsed * 1e3;
		}
	}
	return null;
}
function parseNonNegativeRetryAfterSeconds(raw) {
	const trimmed = raw.trim();
	if (!/^\d+(?:\.\d+)?$/.test(trimmed)) return;
	return asFiniteNumberInRange(parseStrictFiniteNumber(trimmed), {
		min: 0,
		max: MAX_SAFE_RETRY_AFTER_SECONDS
	});
}
/**
* Owns retry safety and delivery ambiguity for Teams send failures.
* Only Teams rate-limit rejection proves this unkeyed POST safe to replay.
*/
function classifyMSTeamsSendError(err) {
	const statusCode = extractStatusCode(err);
	const retryAfterMs = extractRetryAfterMs(err);
	const errorCode = extractErrorCode(err) ?? void 0;
	if (statusCode === 401) return {
		kind: "auth",
		statusCode,
		errorCode
	};
	if (statusCode === 403) {
		if (errorCode === "ContentStreamNotAllowed") return {
			kind: "permanent",
			statusCode,
			errorCode
		};
		return {
			kind: "auth",
			statusCode,
			errorCode
		};
	}
	if (statusCode === 429) return {
		kind: "replay-safe",
		statusCode,
		retryAfterMs: retryAfterMs ?? void 0,
		errorCode
	};
	if (statusCode === 408 || statusCode != null && statusCode >= 500) return {
		kind: "ambiguous",
		source: "http",
		statusCode,
		errorCode
	};
	if (statusCode != null && statusCode >= 400) return {
		kind: "permanent",
		statusCode,
		errorCode
	};
	if (statusCode == null && isTransientNetworkError(err)) return {
		kind: "ambiguous",
		source: "transport",
		errorCode
	};
	return {
		kind: "unknown",
		statusCode: statusCode ?? void 0,
		errorCode
	};
}
/**
* Detect whether an error is caused by a revoked Proxy.
*
* The Bot Framework SDK wraps TurnContext in a Proxy that is revoked once the
* turn handler returns.  Any later access (e.g. from a debounced callback)
* throws a TypeError whose message contains the distinctive "proxy that has
* been revoked" string.
*/
function isRevokedProxyError(err) {
	if (!(err instanceof TypeError)) return false;
	return /proxy that has been revoked/i.test(err.message);
}
function formatMSTeamsSendErrorHint(classification) {
	if (classification.kind === "auth") return "check msteams appId/appPassword/tenantId (or env vars MSTEAMS_APP_ID/MSTEAMS_APP_PASSWORD/MSTEAMS_TENANT_ID)";
	if (classification.errorCode === "ContentStreamNotAllowed") return "Teams expired the content stream; stop streaming earlier and fall back to normal message delivery";
	if (classification.kind === "replay-safe") return "Teams throttled the bot; backing off may help";
	if (classification.kind === "ambiguous") {
		if (classification.source === "transport") return "transport-level failure sending to Teams Bot Connector (smba.trafficmanager.net); the outcome is unknown, so check egress and conversation history before taking further action";
		return "Teams/Bot Framework delivery outcome is unknown; inspect the conversation history before taking further action";
	}
}
function formatMSTeamsDeliveryFailureGuidance(classification) {
	if (classification.kind === "replay-safe") return "The request was rate-limited before delivery; retrying later may succeed.";
	if (classification.kind === "ambiguous") return "Delivery may already have succeeded; do not send the same content again without checking the conversation.";
}
//#endregion
export { isRevokedProxyError as a, formatUnknownError as i, formatMSTeamsDeliveryFailureGuidance as n, formatMSTeamsSendErrorHint as r, classifyMSTeamsSendError as t };
