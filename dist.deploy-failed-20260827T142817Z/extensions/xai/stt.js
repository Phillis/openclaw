import { l as normalizeOptionalString } from "../../string-coerce-CIXf7egm.js";
import { n as assertOkOrThrowHttpError, p as readProviderJsonResponse } from "../../provider-http-errors-BH2HGv8j.js";
import { d as requireTranscriptionText, p as resolveProviderHttpRequestConfig, t as buildAudioTranscriptionFormData, u as postTranscriptionRequest } from "../../shared-CzcciRDF.js";
import "../../string-coerce-runtime-D9ocX9lc.js";
import "../../provider-http-DfD6NQiF.js";
import { t as XAI_BASE_URL } from "../../model-definitions-LKzPOBHs.js";
import { l as createXaiMediaUnderstandingProviderMetadata } from "../../capability-provider-metadata-DikE8kIL.js";
//#region extensions/xai/stt.ts
function resolveXaiSttBaseUrl(value) {
	return normalizeOptionalString(value ?? process.env.XAI_BASE_URL) ?? "https://api.x.ai/v1";
}
async function transcribeXaiAudio(params) {
	const fetchFn = params.fetchFn ?? fetch;
	const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } = resolveProviderHttpRequestConfig({
		baseUrl: resolveXaiSttBaseUrl(params.baseUrl),
		defaultBaseUrl: XAI_BASE_URL,
		headers: params.headers,
		request: params.request,
		defaultHeaders: { Authorization: `Bearer ${params.apiKey}` },
		provider: "xai",
		api: "xai-stt",
		capability: "audio",
		transport: "media-understanding"
	});
	const language = normalizeOptionalString(params.language);
	const form = buildAudioTranscriptionFormData({
		buffer: params.buffer,
		fileName: params.fileName,
		mime: params.mime,
		fields: { language }
	});
	const { response, release } = await postTranscriptionRequest({
		url: `${baseUrl}/stt`,
		headers,
		body: form,
		timeoutMs: params.timeoutMs,
		...params.signal ? { signal: params.signal } : {},
		fetchFn,
		allowPrivateNetwork,
		dispatcherPolicy,
		auditContext: "xai stt"
	});
	try {
		await assertOkOrThrowHttpError(response, "xAI audio transcription failed");
		return { text: requireTranscriptionText((await readProviderJsonResponse(response, "xai.stt")).text, "xAI transcription response missing text") };
	} finally {
		await release();
	}
}
function buildXaiMediaUnderstandingProvider() {
	return {
		...createXaiMediaUnderstandingProviderMetadata(),
		transcribeAudio: transcribeXaiAudio
	};
}
//#endregion
export { buildXaiMediaUnderstandingProvider };
