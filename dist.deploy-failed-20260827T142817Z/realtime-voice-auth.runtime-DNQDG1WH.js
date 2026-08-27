import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import { a as resolveApiKeyForProvider } from "./provider-auth-runtime-DRnZC8WF.js";
//#region extensions/xai/realtime-voice-auth.runtime.ts
async function resolveXaiRealtimeApiKey(configApiKey, cfg) {
	const direct = normalizeOptionalString(configApiKey) ?? normalizeOptionalString(process.env.XAI_API_KEY);
	if (direct) return direct;
	const oauthKey = normalizeOptionalString((await resolveApiKeyForProvider({
		provider: "xai",
		cfg
	}))?.apiKey);
	if (oauthKey) return oauthKey;
	throw new Error("xAI credentials missing for realtime voice. Sign in with `openclaw onboard --auth-choice xai-oauth`, run `openclaw onboard --auth-choice xai-api-key`, or set XAI_API_KEY.");
}
//#endregion
export { resolveXaiRealtimeApiKey as t };
