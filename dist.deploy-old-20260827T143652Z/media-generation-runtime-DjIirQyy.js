import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { d as readResponseWithLimit } from "./http-body-D5I0NwSl.js";
import { u as readProviderBinaryResponse } from "./provider-http-errors-BH2HGv8j.js";
import { a as maxBytesForKind } from "./constants-Mf57IYS0.js";
import { r as extensionForMime } from "./mime-Hm4eS2i0.js";
import "./configured-max-bytes-DkfKmiZP.js";
import "./runtime-shared-DE1lp4EM.js";
import { i as fetchProviderDownloadResponse, n as createProviderOperationDeadline, r as createProviderOperationTimeoutResolver } from "./shared-BEAvjECH.js";
//#region src/media-generation/provider-assets.ts
/** Download a generated video URL with size limits and inferred video metadata. */
async function downloadGeneratedVideoAsset(params) {
	const deadline = createProviderOperationDeadline({
		timeoutMs: params.timeoutMs,
		label: params.label
	});
	const timeoutMs = createProviderOperationTimeoutResolver({
		deadline,
		defaultTimeoutMs: deadline.timeoutMs ?? params.defaultTimeoutMs
	});
	const handle = params.fetchResponse ? await params.fetchResponse({
		deadline,
		timeoutMs
	}) : { response: await fetchProviderDownloadResponse({
		url: params.url,
		init: { method: "GET" },
		deadline,
		fetchFn: params.fetchFn,
		provider: params.provider,
		requestFailedMessage: params.requestFailedMessage
	}) };
	try {
		const mimeType = normalizeOptionalString(handle.response.headers.get("content-type")) ?? "video/mp4";
		const maxBytes = params.maxBytes ?? maxBytesForKind("video");
		const readOptions = {
			maxBytes,
			timeoutMs,
			onTimeout: ({ timeoutMs: bodyTimeoutMs }) => /* @__PURE__ */ new Error(`${params.label} timed out after ${deadline.timeoutMs ?? bodyTimeoutMs}ms`),
			onOverflow: ({ maxBytes: maxBytesLocal }) => /* @__PURE__ */ new Error(`${params.label} exceeds ${maxBytesLocal} bytes`)
		};
		const buffer = params.validateBinaryResponse ? Buffer.from(await readProviderBinaryResponse(handle.response, params.label, "video", readOptions)) : await readResponseWithLimit(handle.response, maxBytes, readOptions);
		const ext = extensionForMime(mimeType)?.replace(/^\./u, "") ?? "mp4";
		return {
			buffer,
			mimeType,
			fileName: `video-${(params.index ?? 0) + 1}.${ext}`,
			...params.metadata ? { metadata: params.metadata } : {}
		};
	} finally {
		await handle.release?.();
	}
}
//#endregion
export { downloadGeneratedVideoAsset as t };
