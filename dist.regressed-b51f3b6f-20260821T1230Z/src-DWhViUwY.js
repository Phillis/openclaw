import { s as normalizeNullableString } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { i as parseShortSessionRef, n as isReservedSessionRest, r as normalizeControlUiBasePath, t as DEFAULT_MAIN_KEY } from "./grammar-HdFA7BPj.js";
//#region packages/session-url-contract/src/index.ts
const SESSION_UUID_SUFFIX_RE = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/iu;
const SHORT_SESSION_ID_RE = /^[0-9a-f]{8,32}$/iu;
const SESSION_SLUG_MAX_LENGTH = 48;
function agentSessionKeyParts(sessionKey) {
	const parts = sessionKey.split(":");
	if (parts.length < 3 || parts[0]?.toLowerCase() !== "agent") return null;
	const agentId = normalizeNullableString(parts[1]);
	const restSegments = parts.slice(2);
	if (!agentId || restSegments.some((segment) => !segment)) return null;
	return {
		agentId: normalizeAgentId(agentId),
		rest: restSegments.join(":")
	};
}
function encodePathSegment(segment) {
	if (segment === ".") return "~dot";
	if (segment === "..") return "~dotdot";
	const encoded = encodeURIComponent(segment).replaceAll(".", "%2E");
	return encoded.startsWith("~") ? `~${encoded}` : encoded;
}
function controlUiSessionSlug(displayName) {
	const tokens = (displayName ?? "").toLowerCase().replace(/[^a-z0-9]+/gu, "-").replace(/^-+|-+$/gu, "").split("-").filter(Boolean);
	while (tokens.length > 0 && /^[0-9a-f]+$/u.test(tokens.at(-1) ?? "")) tokens.pop();
	return tokens.join("-").slice(0, SESSION_SLUG_MAX_LENGTH).replace(/-+$/gu, "");
}
function buildControlUiSessionPath(params) {
	const rawKey = normalizeNullableString(params.sessionKey);
	const parsed = rawKey ? agentSessionKeyParts(rawKey) : null;
	const fallbackAgentId = normalizeNullableString(params.fallbackAgentId);
	const agentId = parsed?.agentId ?? (fallbackAgentId ? normalizeAgentId(fallbackAgentId) : null);
	if (!rawKey || !agentId || !parsed && rawKey.toLowerCase().startsWith("agent:")) return null;
	const namespace = `${normalizeControlUiBasePath(params.basePath)}/${params.namespace}`;
	const encodedAgentId = encodePathSegment(agentId);
	const rest = parsed?.rest ?? rawKey;
	const normalizedRest = rest.toLowerCase();
	const mainKey = normalizeNullableString(params.mainKey)?.toLowerCase() ?? "main";
	if (!parsed && normalizedRest === "main" || normalizedRest === mainKey || normalizedRest === "global") return `${namespace}/${encodedAgentId}`;
	const uuid = (parsed?.rest.match(SESSION_UUID_SUFFIX_RE)?.[1])?.toLowerCase().replaceAll("-", "") ?? null;
	if (uuid) {
		const requestedLength = params.shortIdLength ?? 8;
		let length = Math.min(uuid.length, Math.max(8, Math.floor(requestedLength)));
		const slug = controlUiSessionSlug(params.displayName);
		let sessionRef = `${slug ? `${slug}-` : ""}${uuid.slice(0, length)}`;
		while (length < uuid.length && isReservedSessionRest(sessionRef, params.mainKey)) {
			length += 1;
			sessionRef = `${slug ? `${slug}-` : ""}${uuid.slice(0, length)}`;
		}
		return isReservedSessionRest(sessionRef, params.mainKey) ? null : `${namespace}/${encodedAgentId}/${sessionRef}`;
	}
	const segments = rest.split(":");
	if (segments.some((segment) => !segment)) return null;
	if (segments.length === 1) {
		const segment = segments[0] ?? "";
		if (!isReservedSessionRest(segment, params.mainKey) && parseShortSessionRef(segment)) return `${namespace}/${encodedAgentId}/~key/${encodePathSegment(segment)}`;
	}
	return `${namespace}/${encodedAgentId}/${segments.map(encodePathSegment).join("/")}`;
}
function buildControlUiCatalogSessionUrl(params) {
	const catalog = normalizeNullableString(params.catalog);
	const host = normalizeNullableString(params.host);
	const thread = normalizeNullableString(params.thread);
	const path = buildControlUiSessionPath({
		namespace: params.namespace,
		sessionKey: DEFAULT_MAIN_KEY,
		fallbackAgentId: params.agentId,
		basePath: params.basePath
	});
	if (!path || !catalog || !host || !thread) return null;
	return `${path}?${new URLSearchParams({
		catalog,
		host,
		thread
	}).toString()}`;
}
//#endregion
export { controlUiSessionSlug as a, buildControlUiSessionPath as i, SHORT_SESSION_ID_RE as n, buildControlUiCatalogSessionUrl as r, SESSION_UUID_SUFFIX_RE as t };
