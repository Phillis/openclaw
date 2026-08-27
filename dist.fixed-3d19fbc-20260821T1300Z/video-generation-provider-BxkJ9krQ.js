import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { f as asSafeIntegerInRange } from "./number-coercion-oCkfUEEq.js";
import { n as assertOkOrThrowHttpError, p as readProviderJsonResponse } from "./provider-http-errors-DwYSuIHs.js";
import { r as resolveGeneratedMediaMaxBytes } from "./configured-max-bytes-kmWDwnsJ.js";
import { r as isProviderApiKeyConfigured } from "./provider-auth-DqOUi0El.js";
import { c as postJsonRequest, h as resolveProviderOperationTimeoutMs, i as fetchProviderDownloadResponse, n as createProviderOperationDeadline, p as resolveProviderHttpRequestConfig, r as createProviderOperationTimeoutResolver, s as pollProviderOperationJson } from "./shared-DEePW_9S.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import { a as resolveApiKeyForProvider } from "./provider-auth-runtime-zf48LPN6.js";
import "./provider-http-D7FntVgP.js";
import { d as toImageDataUrl } from "./image-generation-aGS5BxMk.js";
import { t as downloadGeneratedVideoAsset } from "./media-generation-runtime-C74FTpN9.js";
import { t as TOGETHER_BASE_URL } from "./models-iSjZ3Vhk.js";
//#region extensions/together/video-generation-provider.ts
const DEFAULT_TOGETHER_VIDEO_MODEL = "Wan-AI/Wan2.2-T2V-A14B";
const TOGETHER_IMAGE_TO_VIDEO_MODELS = /* @__PURE__ */ new Set(["Wan-AI/Wan2.2-I2V-A14B"]);
const TOGETHER_VIDEO_BASE_URL = "https://api.together.xyz/v2";
const DEFAULT_TIMEOUT_MS = 12e4;
const POLL_INTERVAL_MS = 5e3;
const MAX_POLL_ATTEMPTS = 120;
const TOGETHER_MIN_DURATION_SECONDS = 1;
const TOGETHER_MAX_DURATION_SECONDS = 10;
function resolveTogetherVideoBaseUrl(req) {
	const configuredBaseUrl = normalizeOptionalString(req.cfg?.models?.providers?.together?.baseUrl);
	if (!configuredBaseUrl || stripTrailingSlash(configuredBaseUrl) === stripTrailingSlash(TOGETHER_BASE_URL)) return TOGETHER_VIDEO_BASE_URL;
	return configuredBaseUrl;
}
function stripTrailingSlash(value) {
	return value.replace(/\/+$/u, "");
}
function extractTogetherVideoUrl(payload) {
	if (Array.isArray(payload.outputs)) {
		for (const entry of payload.outputs) {
			const url = normalizeOptionalString(entry.video_url) ?? normalizeOptionalString(entry.url);
			if (url) return url;
		}
		return;
	}
	return normalizeOptionalString(payload.outputs?.video_url) ?? normalizeOptionalString(payload.outputs?.url);
}
function readTogetherVideoFailureMessage(payload) {
	return payload.status === "failed" ? normalizeOptionalString(payload.error?.message) ?? "Together video generation failed" : void 0;
}
function resolveTogetherDurationSeconds(value) {
	if (typeof value !== "number" || !Number.isFinite(value)) return;
	const duration = asSafeIntegerInRange(Math.round(value), {
		min: TOGETHER_MIN_DURATION_SECONDS,
		max: TOGETHER_MAX_DURATION_SECONDS
	});
	return duration === void 0 ? void 0 : String(duration);
}
async function pollTogetherVideo(params) {
	const deadline = createProviderOperationDeadline({
		timeoutMs: params.timeoutMs,
		label: `Together video generation task ${params.videoId}`
	});
	return await pollProviderOperationJson({
		url: `${params.baseUrl}/videos/${params.videoId}`,
		headers: params.headers,
		deadline,
		defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
		fetchFn: params.fetchFn,
		maxAttempts: MAX_POLL_ATTEMPTS,
		pollIntervalMs: POLL_INTERVAL_MS,
		requestFailedMessage: "Together video status request failed",
		timeoutMessage: `Together video generation task ${params.videoId} did not finish in time`,
		isComplete: (payload) => payload.status === "completed",
		getFailureMessage: readTogetherVideoFailureMessage
	});
}
async function downloadTogetherVideo(params) {
	return await downloadGeneratedVideoAsset({
		url: params.url,
		timeoutMs: params.timeoutMs ?? DEFAULT_TIMEOUT_MS,
		defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
		fetchFn: params.fetchFn,
		provider: "together",
		label: "Together generated video download",
		requestFailedMessage: "Together generated video download failed",
		maxBytes: params.maxBytes,
		fetchResponse: async ({ deadline }) => ({ response: await fetchProviderDownloadResponse({
			url: params.url,
			init: { method: "GET" },
			deadline,
			fetchFn: params.fetchFn,
			provider: "together",
			requestFailedMessage: "Together generated video download failed"
		}) })
	});
}
function buildTogetherVideoGenerationProvider() {
	return {
		id: "together",
		label: "Together",
		defaultModel: DEFAULT_TOGETHER_VIDEO_MODEL,
		models: [
			DEFAULT_TOGETHER_VIDEO_MODEL,
			"Wan-AI/Wan2.2-I2V-A14B",
			"minimax/hailuo-02",
			"kwaivgI/kling-2.1-master"
		],
		isConfigured: (ctx) => isProviderApiKeyConfigured({
			provider: "together",
			...ctx
		}),
		capabilities: {
			generate: {
				maxVideos: 1,
				maxDurationSeconds: TOGETHER_MAX_DURATION_SECONDS,
				supportsSize: true
			},
			imageToVideo: {
				enabled: true,
				maxInputImagesByModel: { "Wan-AI/Wan2.2-I2V-A14B": 1 },
				maxDurationSeconds: TOGETHER_MAX_DURATION_SECONDS,
				supportsSize: true
			},
			videoToVideo: { enabled: false }
		},
		async generateVideo(req) {
			if ((req.inputVideos?.length ?? 0) > 0) throw new Error("Together video generation does not support video reference inputs.");
			const auth = await resolveApiKeyForProvider({
				provider: "together",
				cfg: req.cfg,
				agentDir: req.agentDir,
				store: req.authStore
			});
			if (!auth.apiKey) throw new Error("Together API key missing");
			const fetchFn = fetch;
			const deadline = createProviderOperationDeadline({
				timeoutMs: req.timeoutMs,
				label: "Together video generation"
			});
			const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } = resolveProviderHttpRequestConfig({
				baseUrl: resolveTogetherVideoBaseUrl(req),
				defaultBaseUrl: TOGETHER_VIDEO_BASE_URL,
				allowPrivateNetwork: false,
				defaultHeaders: {
					Authorization: `Bearer ${auth.apiKey}`,
					"Content-Type": "application/json"
				},
				provider: "together",
				capability: "video",
				transport: "http"
			});
			const body = {
				model: normalizeOptionalString(req.model) ?? DEFAULT_TOGETHER_VIDEO_MODEL,
				prompt: req.prompt
			};
			const model = String(body.model);
			const duration = resolveTogetherDurationSeconds(req.durationSeconds);
			if (duration !== void 0) body.seconds = duration;
			const size = normalizeOptionalString(req.size);
			if (size) {
				const match = /^(\d+)x(\d+)$/u.exec(size);
				if (match) {
					body.width = Number.parseInt(match[1] ?? "", 10);
					body.height = Number.parseInt(match[2] ?? "", 10);
				}
			}
			if (req.inputImages?.[0]) {
				if (!TOGETHER_IMAGE_TO_VIDEO_MODELS.has(model)) throw new Error(`Together video model ${model} does not support image reference inputs. Use Wan-AI/Wan2.2-I2V-A14B or omit input images.`);
				const input = req.inputImages[0];
				const value = normalizeOptionalString(input.url) ? normalizeOptionalString(input.url) : input.buffer ? toImageDataUrl({
					...input,
					buffer: input.buffer,
					defaultMimeType: "image/png"
				}) : void 0;
				if (!value) throw new Error("Together reference image is missing image data.");
				body.media = { reference_images: [value] };
			}
			const { response, release } = await postJsonRequest({
				url: `${baseUrl}/videos`,
				headers,
				body,
				timeoutMs: resolveProviderOperationTimeoutMs({
					deadline,
					defaultTimeoutMs: DEFAULT_TIMEOUT_MS
				}),
				fetchFn,
				allowPrivateNetwork,
				dispatcherPolicy
			});
			try {
				await assertOkOrThrowHttpError(response, "Together video generation failed");
				const submitted = await readProviderJsonResponse(response, "Together video generation failed");
				const failureMessage = readTogetherVideoFailureMessage(submitted);
				if (failureMessage) throw new Error(failureMessage);
				const videoId = normalizeOptionalString(submitted.id);
				if (!videoId) throw new Error("Together video generation response missing id");
				const completed = submitted.status === "completed" ? submitted : await pollTogetherVideo({
					videoId,
					headers,
					timeoutMs: resolveProviderOperationTimeoutMs({
						deadline,
						defaultTimeoutMs: DEFAULT_TIMEOUT_MS
					}),
					baseUrl,
					fetchFn
				});
				const videoUrl = extractTogetherVideoUrl(completed);
				if (!videoUrl) throw new Error("Together video generation completed without an output URL");
				return {
					videos: [await downloadTogetherVideo({
						url: videoUrl,
						timeoutMs: createProviderOperationTimeoutResolver({
							deadline,
							defaultTimeoutMs: DEFAULT_TIMEOUT_MS
						}),
						fetchFn,
						maxBytes: resolveGeneratedMediaMaxBytes(req.cfg, "video")
					})],
					model: completed.model ?? req.model ?? DEFAULT_TOGETHER_VIDEO_MODEL,
					metadata: {
						videoId,
						status: completed.status,
						videoUrl
					}
				};
			} finally {
				await release();
			}
		}
	};
}
//#endregion
export { buildTogetherVideoGenerationProvider as t };
