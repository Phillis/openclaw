import { y as ssrfPolicyFromHttpBaseUrlAllowedHostname } from "./ssrf-UFPP-fbI.js";
import { r as fetchWithSsrFGuard } from "./fetch-guard-Dj5fUySl.js";
import { i as assertProviderBinaryResponseContent, r as assertOkOrThrowProviderError, u as readProviderBinaryResponse } from "./provider-http-errors-BH2HGv8j.js";
import { t as MAX_AUDIO_BYTES } from "./constants-Mf57IYS0.js";
import { i as requireInRange, n as normalizeLanguageCode, r as normalizeSeed, t as normalizeApplyTextNormalization } from "./tts-provider-helpers-DAXQcw0n.js";
import "./ssrf-runtime-Co-K4Dxq.js";
import "./provider-http-RuCpoOP3.js";
import "./media-runtime-OD8vPDOE.js";
import "./speech-di6r9UXG.js";
import { n as isValidElevenLabsVoiceId, r as normalizeElevenLabsBaseUrl } from "./shared-C4zbmF0I.js";
//#region extensions/elevenlabs/tts.ts
function assertElevenLabsVoiceSettings(settings) {
	requireInRange(settings.stability, 0, 1, "stability");
	requireInRange(settings.similarityBoost, 0, 1, "similarityBoost");
	requireInRange(settings.style, 0, 1, "style");
	requireInRange(settings.speed, .5, 2, "speed");
}
function resolveElevenLabsAcceptHeader(outputFormat) {
	const normalized = outputFormat.trim().toLowerCase();
	if (!normalized || normalized.startsWith("mp3_")) return "audio/mpeg";
}
function normalizeElevenLabsLatencyTier(latencyTier) {
	if (latencyTier === void 0 || !Number.isFinite(latencyTier)) return;
	if (!Number.isSafeInteger(latencyTier)) throw new Error("latencyTier must be an integer");
	requireInRange(latencyTier, 0, 4, "latencyTier");
	return latencyTier;
}
function createBoundedElevenLabsAudioStream(stream) {
	let reader;
	let totalBytes = 0;
	const releaseReader = (activeReader) => {
		if (reader !== activeReader) return;
		reader = void 0;
		activeReader.releaseLock();
	};
	const cancelReader = async (reason) => {
		const activeReader = reader;
		if (!activeReader) return;
		try {
			await activeReader.cancel(reason).catch(() => void 0);
		} finally {
			releaseReader(activeReader);
		}
	};
	return {
		audioStream: new ReadableStream({
			start() {
				reader = stream.getReader();
			},
			async pull(controller) {
				const activeReader = reader;
				if (!activeReader) {
					controller.close();
					return;
				}
				try {
					const chunk = await activeReader.read();
					if (chunk.done) {
						releaseReader(activeReader);
						controller.close();
						return;
					}
					const remainingBytes = MAX_AUDIO_BYTES - totalBytes;
					if (chunk.value.byteLength > remainingBytes) {
						if (remainingBytes > 0) controller.enqueue(chunk.value.subarray(0, remainingBytes));
						const error = /* @__PURE__ */ new Error(`ElevenLabs API error: audio response exceeds ${MAX_AUDIO_BYTES} bytes`);
						await activeReader.cancel(error).catch(() => void 0);
						releaseReader(activeReader);
						controller.error(error);
						return;
					}
					totalBytes += chunk.value.byteLength;
					controller.enqueue(chunk.value);
				} catch (error) {
					releaseReader(activeReader);
					controller.error(error);
				}
			},
			async cancel(reason) {
				await cancelReader(reason);
			}
		}),
		release: () => cancelReader(/* @__PURE__ */ new Error("ElevenLabs TTS stream released"))
	};
}
function prepareElevenLabsTtsRequest(params) {
	const { text, baseUrl, voiceId, modelId, outputFormat, seed, applyTextNormalization, languageCode, latencyTier, voiceSettings } = params;
	if (!isValidElevenLabsVoiceId(voiceId)) throw new Error("Invalid voiceId format");
	assertElevenLabsVoiceSettings(voiceSettings);
	const normalizedLanguage = normalizeLanguageCode(languageCode);
	const normalizedNormalization = normalizeApplyTextNormalization(applyTextNormalization);
	const normalizedSeed = normalizeSeed(seed);
	const normalizedBaseUrl = normalizeElevenLabsBaseUrl(baseUrl);
	const normalizedLatencyTier = normalizeElevenLabsLatencyTier(latencyTier);
	const url = new URL(`${normalizedBaseUrl}/v1/text-to-speech/${voiceId}${params.stream ? "/stream" : ""}`);
	if (outputFormat) url.searchParams.set("output_format", outputFormat);
	const supportsStreamingLatency = modelId.trim().toLowerCase() !== "eleven_v3";
	if (normalizedLatencyTier !== void 0 && supportsStreamingLatency) url.searchParams.set("optimize_streaming_latency", normalizedLatencyTier.toString());
	return {
		url,
		normalizedBaseUrl,
		acceptHeader: resolveElevenLabsAcceptHeader(outputFormat),
		body: JSON.stringify({
			text,
			model_id: modelId,
			seed: normalizedSeed,
			apply_text_normalization: normalizedNormalization,
			language_code: normalizedLanguage,
			voice_settings: {
				stability: voiceSettings.stability,
				similarity_boost: voiceSettings.similarityBoost,
				style: voiceSettings.style,
				use_speaker_boost: voiceSettings.useSpeakerBoost,
				speed: voiceSettings.speed
			}
		})
	};
}
async function elevenLabsTTS(params) {
	const { apiKey, timeoutMs } = params;
	const { url, normalizedBaseUrl, acceptHeader, body } = prepareElevenLabsTtsRequest({
		...params,
		stream: false
	});
	const { response, release } = await fetchWithSsrFGuard({
		url: url.toString(),
		init: {
			method: "POST",
			headers: {
				"xi-api-key": apiKey,
				"Content-Type": "application/json",
				...acceptHeader ? { Accept: acceptHeader } : {}
			},
			body
		},
		timeoutMs,
		policy: ssrfPolicyFromHttpBaseUrlAllowedHostname(normalizedBaseUrl),
		auditContext: "elevenlabs.tts"
	});
	try {
		await assertOkOrThrowProviderError(response, "ElevenLabs API error");
		return Buffer.from(await readProviderBinaryResponse(response, "ElevenLabs API error", "audio"));
	} finally {
		await release();
	}
}
async function elevenLabsTTSStream(params) {
	const { apiKey, timeoutMs } = params;
	const { url, normalizedBaseUrl, acceptHeader, body } = prepareElevenLabsTtsRequest({
		...params,
		stream: true
	});
	const { response, release } = await fetchWithSsrFGuard({
		url: url.toString(),
		init: {
			method: "POST",
			headers: {
				"xi-api-key": apiKey,
				"Content-Type": "application/json",
				...acceptHeader ? { Accept: acceptHeader } : {}
			},
			body
		},
		timeoutMs,
		policy: ssrfPolicyFromHttpBaseUrlAllowedHostname(normalizedBaseUrl),
		auditContext: "elevenlabs.tts.stream"
	});
	let handedOff = false;
	try {
		await assertOkOrThrowProviderError(response, "ElevenLabs API error");
		assertProviderBinaryResponseContent(response, "ElevenLabs API error", "audio");
		if (!response.body) throw new Error("ElevenLabs API response missing audio stream");
		const boundedStream = createBoundedElevenLabsAudioStream(response.body);
		let releasePromise;
		const releaseAll = () => {
			releasePromise ??= (async () => {
				try {
					await boundedStream.release();
				} finally {
					await release();
				}
			})();
			return releasePromise;
		};
		handedOff = true;
		return {
			audioStream: boundedStream.audioStream,
			release: releaseAll
		};
	} finally {
		if (!handedOff) await release();
	}
}
//#endregion
export { elevenLabsTTSStream as n, elevenLabsTTS as t };
