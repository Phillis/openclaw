import { r as makeProxyFetch } from "./proxy-fetch-CxekH4gx.js";
import "./fetch-runtime-C50Ab8yk.js";
//#region extensions/zalo/src/proxy.ts
const proxyCache = /* @__PURE__ */ new Map();
function resolveZaloProxyFetch(proxyUrl) {
	const trimmed = proxyUrl?.trim();
	if (!trimmed) return;
	const cached = proxyCache.get(trimmed);
	if (cached) return cached;
	const fetcher = makeProxyFetch(trimmed);
	proxyCache.set(trimmed, fetcher);
	return fetcher;
}
//#endregion
export { resolveZaloProxyFetch as t };
