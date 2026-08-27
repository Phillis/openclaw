import { r as fetchWithRuntimeDispatcherOrMockedGlobal } from "./runtime-fetch-UrD4QjQb.js";
import { i as getFileExtension } from "./mime-Hm4eS2i0.js";
import { i as saveRemoteMedia } from "./fetch-CLYC5ZpH.js";
//#region src/media/store.remote.runtime.ts
const REMOTE_MEDIA_TIMEOUT_MS = 3e4;
const fetchWithoutIgnoredBody = async (input, init) => {
	const response = await fetchWithRuntimeDispatcherOrMockedGlobal(input, init);
	if (response.ok) return response;
	response.body?.cancel().catch(() => void 0);
	return new Response(null, {
		status: response.status,
		statusText: response.statusText,
		headers: response.headers
	});
};
async function saveRemoteMediaForStore(params) {
	const resolvePinned = params.resolvePinnedHostnameForTest;
	const lookupFn = resolvePinned ? (async (hostname) => {
		return (await resolvePinned(hostname)).addresses.map((address) => ({
			address,
			family: address.includes(":") ? 6 : 4
		}));
	}) : void 0;
	const { id, path, size, contentType } = await saveRemoteMedia({
		url: params.source,
		fetchImpl: fetchWithoutIgnoredBody,
		requestInit: params.headers ? { headers: params.headers } : void 0,
		filePathHint: params.source,
		originalFilename: `_${getFileExtension(params.source) ?? ""}`,
		maxBytes: params.maxBytes,
		maxRedirects: 5,
		responseHeaderTimeoutMs: REMOTE_MEDIA_TIMEOUT_MS,
		readIdleTimeoutMs: REMOTE_MEDIA_TIMEOUT_MS,
		subdir: params.subdir,
		...lookupFn ? { lookupFn } : {},
		...resolvePinned ? { ssrfPolicy: { allowedHostnames: [new URL(params.source).hostname] } } : {}
	});
	return {
		id,
		path,
		size,
		contentType
	};
}
//#endregion
export { saveRemoteMediaForStore };
