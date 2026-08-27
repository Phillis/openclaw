import { GRADIUM_API_HOSTNAME, normalizeGradiumBaseUrl } from "./shared.js";
import { assertOkOrThrowProviderError, readProviderBinaryResponse } from "openclaw/plugin-sdk/provider-http";
import { fetchWithSsrFGuard } from "openclaw/plugin-sdk/ssrf-runtime";
//#region extensions/gradium/tts.ts
const DEFAULT_TTS_MAX_BYTES = 16 * 1024 * 1024;
async function gradiumTTS(params) {
	const { text, apiKey, baseUrl, voiceId, outputFormat, timeoutMs, maxBytes = DEFAULT_TTS_MAX_BYTES } = params;
	const { response, release } = await fetchWithSsrFGuard({
		url: `${normalizeGradiumBaseUrl(baseUrl)}/api/post/speech/tts`,
		init: {
			method: "POST",
			headers: {
				"x-api-key": apiKey,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				text,
				voice_id: voiceId,
				only_audio: true,
				output_format: outputFormat,
				json_config: JSON.stringify({ padding_bonus: 0 })
			})
		},
		timeoutMs,
		requireHttps: true,
		policy: { hostnameAllowlist: [GRADIUM_API_HOSTNAME] },
		auditContext: "gradium.tts"
	});
	try {
		await assertOkOrThrowProviderError(response, "Gradium API error");
		return Buffer.from(await readProviderBinaryResponse(response, "Gradium API error", "audio", {
			maxBytes,
			onOverflow: ({ maxBytes: maxBytesLocal }) => /* @__PURE__ */ new Error(`Gradium TTS audio response exceeds ${maxBytesLocal} bytes`)
		}));
	} finally {
		await release();
	}
}
//#endregion
export { gradiumTTS };
