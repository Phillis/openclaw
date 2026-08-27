import { n as buildTimeoutAbortSignal } from "./fetch-timeout-hKtCSlbr.js";
import { f as readProviderJsonObjectResponse, h as readResponseTextLimited } from "./provider-http-errors-DwYSuIHs.js";
import { t as resolveFetch } from "./fetch-Bn9EhBEw.js";
import "./fetch-runtime-C50Ab8yk.js";
import "./extension-shared-D4oakjAV.js";
import "./provider-http-D7FntVgP.js";
//#region extensions/discord/src/pluralkit.ts
const PLURALKIT_API_BASE = "https://api.pluralkit.me/v2";
const PLURALKIT_ERROR_BODY_LIMIT_BYTES = 8 * 1024;
const PLURALKIT_LOOKUP_TIMEOUT_MS = 1e4;
async function fetchPluralKitMessageInfo(params) {
	if (!params.config?.enabled) return null;
	const fetchImpl = resolveFetch(params.fetcher);
	if (!fetchImpl) return null;
	const headers = {};
	if (params.config.token?.trim()) headers.Authorization = params.config.token.trim();
	const url = `${PLURALKIT_API_BASE}/messages/${params.messageId}`;
	const timeout = buildTimeoutAbortSignal({
		signal: params.signal,
		timeoutMs: PLURALKIT_LOOKUP_TIMEOUT_MS,
		operation: "discord.pluralkit.lookup",
		url
	});
	try {
		const res = await fetchImpl(url, {
			headers,
			signal: timeout.signal
		});
		if (res.status === 404) {
			await res.body?.cancel().catch(() => void 0);
			return null;
		}
		if (!res.ok) {
			const text = await readResponseTextLimited(res, PLURALKIT_ERROR_BODY_LIMIT_BYTES).catch(() => "");
			const detail = text.trim() ? `: ${text.trim()}` : "";
			throw new Error(`PluralKit API failed (${res.status})${detail}`);
		}
		return await readProviderJsonObjectResponse(res, "PluralKit message");
	} finally {
		timeout.cleanup();
	}
}
//#endregion
export { fetchPluralKitMessageInfo as t };
