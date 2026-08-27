import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { l as resolveAgentDir } from "./agent-scope-config-CUBiGmG3.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import "./agent-runtime-BOXRUj3V.js";
import { a as resolveApiKeyForProvider } from "./provider-auth-runtime-C9IBkITf.js";
//#region extensions/xai/realtime-voice-auth.runtime.ts
async function resolveXaiRealtimeApiKey(configApiKey, cfg, agentId) {
	const direct = normalizeOptionalString(configApiKey) ?? normalizeOptionalString(process.env.XAI_API_KEY);
	if (direct) return direct;
	const oauthKey = normalizeOptionalString((await resolveApiKeyForProvider({
		provider: "xai",
		cfg,
		...cfg && agentId ? { agentDir: resolveAgentDir(cfg, agentId) } : {}
	}))?.apiKey);
	if (oauthKey) return oauthKey;
	throw new Error("xAI credentials missing for realtime voice. Sign in with `openclaw onboard --auth-choice xai-oauth`, run `openclaw onboard --auth-choice xai-api-key`, or set XAI_API_KEY.");
}
//#endregion
export { resolveXaiRealtimeApiKey as t };
