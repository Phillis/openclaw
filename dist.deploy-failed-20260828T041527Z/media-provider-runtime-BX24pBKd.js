import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./string-coerce-runtime-C8jKEm3h.js";
//#region extensions/minimax/media-provider-runtime.ts
const DEFAULT_MINIMAX_MEDIA_BASE_URL = "https://api.minimax.io";
function resolveMinimaxMediaBaseUrl(cfg, providerId) {
	const configured = normalizeOptionalString(cfg?.models?.providers?.[providerId]?.baseUrl);
	try {
		return configured ? new URL(configured).origin : DEFAULT_MINIMAX_MEDIA_BASE_URL;
	} catch {
		return DEFAULT_MINIMAX_MEDIA_BASE_URL;
	}
}
function assertMinimaxBaseResp(baseResp, context) {
	if (baseResp && typeof baseResp.status_code === "number" && baseResp.status_code !== 0) throw new Error(`${context} (${baseResp.status_code}): ${baseResp.status_msg ?? "unknown error"}`);
}
function normalizeMinimaxHexAudio(data, label) {
	const normalized = data.trim();
	if (!/^[0-9a-f]+$/iu.test(normalized) || normalized.length % 2 !== 0) throw new Error(`${label} returned malformed hex audio`);
	return normalized;
}
function resolveMinimaxGuardedRequestOptions(policy) {
	return policy.allowPrivateNetwork || policy.dispatcherPolicy ? {
		...policy.allowPrivateNetwork ? { ssrfPolicy: { allowPrivateNetwork: true } } : {},
		...policy.dispatcherPolicy ? { dispatcherPolicy: policy.dispatcherPolicy } : {}
	} : void 0;
}
//#endregion
export { resolveMinimaxMediaBaseUrl as a, resolveMinimaxGuardedRequestOptions as i, assertMinimaxBaseResp as n, normalizeMinimaxHexAudio as r, DEFAULT_MINIMAX_MEDIA_BASE_URL as t };
