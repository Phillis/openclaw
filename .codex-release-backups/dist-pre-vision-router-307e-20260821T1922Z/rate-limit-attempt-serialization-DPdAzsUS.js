import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.js";
import { m as normalizeRateLimitClientIp } from "./auth-rate-limit-Bw_B6Pm2.js";
//#region src/gateway/rate-limit-attempt-serialization.ts
const pendingAttempts = new KeyedAsyncQueue();
function normalizeScope(scope) {
	return (scope ?? "default").trim() || "default";
}
function buildSerializationKey(ip, scope) {
	return `${normalizeScope(scope)}:${normalizeRateLimitClientIp(ip)}`;
}
/** Runs one rate-limit attempt after prior attempts for the same IP/scope finish. */
async function withSerializedRateLimitAttempt(params) {
	return await pendingAttempts.enqueue(buildSerializationKey(params.ip, params.scope), params.run);
}
//#endregion
export { withSerializedRateLimitAttempt as t };
