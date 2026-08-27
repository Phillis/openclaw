import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { d as readResponseWithLimit } from "./http-body-D5I0NwSl.js";
import { u as readProviderBinaryResponse } from "./provider-http-errors-BH2HGv8j.js";
import { a as maxBytesForKind } from "./constants-Mf57IYS0.js";
import { r as extensionForMime } from "./mime-Hm4eS2i0.js";
import { t as canonicalizeBase64 } from "./base64-KcXAb-1x.js";
import { i as fetchProviderDownloadResponse, n as createProviderOperationDeadline, r as createProviderOperationTimeoutResolver } from "./shared-CzcciRDF.js";
//#region src/music-generation/provider-assets.ts
function normalizeSpecificAudioMimeType(value) {
	const mimeType = normalizeOptionalString(value)?.split(";")[0]?.trim().toLowerCase();
	if (!mimeType || mimeType === "application/octet-stream" || mimeType === "binary/octet-stream") return;
	return mimeType;
}
function pushGeneratedMusicFileCandidate(candidates, value) {
	if (typeof value === "string") {
		const url = normalizeOptionalString(value);
		if (url) candidates.push({ url });
		return;
	}
	if (!isRecord(value)) return;
	const url = normalizeOptionalString(value.url);
	if (!url) return;
	candidates.push({
		url,
		...normalizeOptionalString(value.content_type) ? { mimeType: normalizeOptionalString(value.content_type) } : {},
		...normalizeOptionalString(value.file_name) ? { fileName: normalizeOptionalString(value.file_name) } : {}
	});
}
/** Extract URL/file candidates from common provider response keys. */
function extractGeneratedMusicFileCandidates(payload, keys = ["audio", "audio_file"]) {
	if (!isRecord(payload)) return [];
	const candidates = [];
	for (const key of keys) pushGeneratedMusicFileCandidate(candidates, payload[key]);
	return candidates;
}
/** Convert a base64 provider payload into a generated music asset. */
function generatedMusicAssetFromBase64(params) {
	const canonicalAudio = canonicalizeBase64(params.base64);
	if (!canonicalAudio) throw new Error("Generated music asset contains malformed base64 audio data");
	const ext = extensionForMime(params.mimeType)?.replace(/^\./u, "") || "mp3";
	return {
		buffer: Buffer.from(canonicalAudio, "base64"),
		mimeType: params.mimeType,
		fileName: params.fileName ?? `track-${(params.index ?? 0) + 1}.${ext}`
	};
}
/** Download a generated music URL with size limits and inferred audio metadata. */
async function downloadGeneratedMusicAsset(params) {
	const deadline = createProviderOperationDeadline({
		timeoutMs: params.timeoutMs,
		label: `${params.provider} generated music download`
	});
	const timeoutMs = createProviderOperationTimeoutResolver({
		deadline,
		defaultTimeoutMs: params.timeoutMs
	});
	const handle = params.fetchResponse ? await params.fetchResponse({
		deadline,
		timeoutMs
	}) : { response: await fetchProviderDownloadResponse({
		url: params.candidate.url,
		init: { method: "GET" },
		deadline,
		fetchFn: params.fetchFn,
		provider: params.provider,
		requestFailedMessage: params.requestFailedMessage
	}) };
	try {
		const mimeType = handle.mimeType ?? normalizeSpecificAudioMimeType(handle.response.headers.get("content-type")) ?? normalizeSpecificAudioMimeType(params.candidate.mimeType) ?? "audio/mpeg";
		const ext = extensionForMime(mimeType)?.replace(/^\./u, "") || "mp3";
		const maxBytes = params.maxBytes ?? maxBytesForKind("audio");
		const readOptions = {
			maxBytes,
			timeoutMs,
			onTimeout: ({ timeoutMs: bodyTimeoutMs }) => /* @__PURE__ */ new Error(`${params.provider} generated music download timed out after ${deadline.timeoutMs ?? bodyTimeoutMs}ms`),
			onOverflow: ({ maxBytes: maxBytesLocal }) => /* @__PURE__ */ new Error(`${params.provider} generated music download exceeds ${maxBytesLocal} bytes`)
		};
		return {
			buffer: params.validateBinaryResponse ? Buffer.from(await readProviderBinaryResponse(handle.response, deadline.label, "audio", readOptions)) : await readResponseWithLimit(handle.response, maxBytes, readOptions),
			mimeType,
			fileName: params.candidate.fileName ?? `track-${(params.index ?? 0) + 1}.${ext}`,
			...params.includeSourceUrl === false ? {} : { metadata: { url: params.candidate.url } }
		};
	} finally {
		await handle.release?.();
	}
}
//#endregion
export { extractGeneratedMusicFileCandidates as n, generatedMusicAssetFromBase64 as r, downloadGeneratedMusicAsset as t };
