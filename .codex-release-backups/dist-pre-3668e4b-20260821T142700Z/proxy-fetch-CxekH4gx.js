import { r as formatErrorMessage } from "./errors-CqPTYU6G.js";
import { i as logWarn } from "./logger-frf2HPJn.js";
import { n as resolveManagedEnvHttpProxyAgentOptions } from "./managed-proxy-undici-o4uSFixO.js";
import { _ as withUndiciErrorDiagnostics, a as loadUndiciRuntimeDeps, o as buildHttp1EnvHttpProxyAgentOptions, s as buildHttp1ProxyAgentOptions } from "./undici-runtime-D3K4ZfcZ.js";
import { t as fetchWithPreparedRuntimeDispatcher } from "./runtime-fetch-DiYW5v-w.js";
//#region src/infra/net/proxy-fetch.ts
/** Non-enumerable marker used to recover the explicit proxy URL from proxy fetch wrappers. */
const PROXY_FETCH_PROXY_URL = Symbol.for("openclaw.proxyFetch.proxyUrl");
/**
* Create a fetch function that routes requests through the given HTTP proxy.
* Uses undici's ProxyAgent under the hood.
*/
function makeProxyFetch(proxyUrl) {
	const runtimeDeps = loadUndiciRuntimeDeps();
	const { ProxyAgent } = runtimeDeps;
	let agent = null;
	const resolveAgent = () => {
		if (!agent) agent = withUndiciErrorDiagnostics(new ProxyAgent(buildHttp1ProxyAgentOptions({ uri: proxyUrl })));
		return agent;
	};
	const proxyFetch = ((input, init) => fetchWithPreparedRuntimeDispatcher(runtimeDeps, input, {
		...init,
		dispatcher: resolveAgent()
	}));
	Object.defineProperty(proxyFetch, PROXY_FETCH_PROXY_URL, {
		value: proxyUrl,
		enumerable: false,
		configurable: false,
		writable: false
	});
	return proxyFetch;
}
/** Return the explicit proxy URL attached by {@link makeProxyFetch}, if present. */
function getProxyUrlFromFetch(fetchImpl) {
	const proxyUrl = fetchImpl?.[PROXY_FETCH_PROXY_URL];
	if (typeof proxyUrl !== "string") return;
	const trimmed = proxyUrl.trim();
	return trimmed ? trimmed : void 0;
}
/**
* Resolve a proxy-aware fetch from standard environment variables.
* Respects NO_PROXY / no_proxy exclusions via undici's EnvHttpProxyAgent.
* Returns undefined when no proxy is configured.
* Gracefully returns undefined if the proxy URL is malformed.
*/
function resolveProxyFetchFromEnv(env = process.env) {
	const proxyOptions = resolveManagedEnvHttpProxyAgentOptions(env);
	if (!proxyOptions) return;
	try {
		const runtimeDeps = loadUndiciRuntimeDeps();
		const { EnvHttpProxyAgent } = runtimeDeps;
		const agent = withUndiciErrorDiagnostics(new EnvHttpProxyAgent(buildHttp1EnvHttpProxyAgentOptions(proxyOptions)));
		return ((input, init) => fetchWithPreparedRuntimeDispatcher(runtimeDeps, input, {
			...init,
			dispatcher: agent
		}));
	} catch (err) {
		logWarn(`Proxy env var set but agent creation failed — falling back to direct fetch: ${formatErrorMessage(err)}`);
		return;
	}
}
//#endregion
export { resolveProxyFetchFromEnv as i, getProxyUrlFromFetch as n, makeProxyFetch as r, PROXY_FETCH_PROXY_URL as t };
