import { n as assertOkOrThrowHttpError } from "./provider-http-errors-BH2HGv8j.js";
import { t as executeProviderOperationWithRetry } from "./operation-retry-C3gOvC-u.js";
import { o as fetchWithTimeoutGuarded } from "./shared-BEAvjECH.js";
import "./provider-http-RuCpoOP3.js";
import { t as downloadGeneratedVideoAsset } from "./media-generation-runtime-B6aEjmpL.js";
//#region extensions/xai/video-generation-transport.ts
function resolveXaiVideoFetchTimeoutMs(timeoutMs, defaultTimeoutMs) {
	const resolved = typeof timeoutMs === "function" ? timeoutMs() : timeoutMs;
	return typeof resolved === "number" && Number.isFinite(resolved) && resolved > 0 ? resolved : defaultTimeoutMs;
}
async function fetchXaiVideoResponse(params) {
	return await executeProviderOperationWithRetry({
		provider: "xai",
		stage: params.stage,
		operation: async () => {
			const result = await fetchWithTimeoutGuarded(params.url, params.init, resolveXaiVideoFetchTimeoutMs(params.timeoutMs, params.defaultTimeoutMs), params.fetchFn, {
				...params.allowPrivateNetwork ? { ssrfPolicy: { allowPrivateNetwork: true } } : {},
				...params.dispatcherPolicy ? { dispatcherPolicy: params.dispatcherPolicy } : {},
				auditContext: params.auditContext
			});
			try {
				await assertOkOrThrowHttpError(result.response, params.requestFailedMessage);
				return result;
			} catch (error) {
				await result.release();
				throw error;
			}
		}
	});
}
async function downloadXaiVideo(params) {
	return await downloadGeneratedVideoAsset({
		url: params.url,
		timeoutMs: params.timeoutMs ?? params.defaultTimeoutMs,
		defaultTimeoutMs: params.defaultTimeoutMs,
		fetchFn: params.fetchFn,
		provider: "xai",
		label: "xAI generated video download",
		requestFailedMessage: "xAI generated video download failed",
		maxBytes: params.maxBytes,
		fetchResponse: async ({ timeoutMs }) => await fetchXaiVideoResponse({
			url: params.url,
			stage: "download",
			requestFailedMessage: "xAI generated video download failed",
			auditContext: "xai-video-download",
			init: { method: "GET" },
			timeoutMs,
			defaultTimeoutMs: params.defaultTimeoutMs,
			allowPrivateNetwork: params.allowPrivateNetwork,
			dispatcherPolicy: params.dispatcherPolicy,
			fetchFn: params.fetchFn
		})
	});
}
//#endregion
export { fetchXaiVideoResponse as n, downloadXaiVideo as t };
