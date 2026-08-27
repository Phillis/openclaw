import { f as isLoopbackIpAddress, g as parseCanonicalIpAddress, h as normalizeIpAddress } from "./ip-pzzTYlfq.js";
import { a as isWssUrl } from "./url-protocol-OU3K-ySz.js";
//#region packages/gateway-client/src/client-address-utils.ts
function normalizeGatewayErrorText(value) {
	return typeof value === "string" ? value.trim().toLowerCase() : "";
}
function isSensitiveUrlQueryParamName(key) {
	return /(?:token|password|secret|key|auth|credential)/iu.test(key);
}
function normalizeFingerprint(fingerprint) {
	return (fingerprint ?? "").replaceAll(":", "").trim().toLowerCase();
}
function parseHostForAddressChecks(host) {
	if (!host) return null;
	const normalizedHost = host.toLowerCase().trim();
	const canonicalHost = normalizedHost.replace(/\.+$/, "");
	if (canonicalHost === "localhost") return {
		isLocalhost: true,
		unbracketedHost: canonicalHost
	};
	return {
		isLocalhost: false,
		unbracketedHost: normalizedHost.startsWith("[") && normalizedHost.endsWith("]") ? normalizedHost.slice(1, -1) : normalizedHost
	};
}
function parseGatewayIpAddress(host) {
	const normalized = normalizeIpAddress(host);
	return normalized ? parseCanonicalIpAddress(normalized) : void 0;
}
//#endregion
//#region packages/gateway-client/src/websocket-transport.ts
const PRIVATE_OR_LOOPBACK_IPV4_RANGES = /* @__PURE__ */ new Set([
	"loopback",
	"private",
	"linkLocal",
	"carrierGradeNat"
]);
const PRIVATE_OR_LOOPBACK_IPV6_RANGES = /* @__PURE__ */ new Set([
	"loopback",
	"linkLocal",
	"uniqueLocal",
	"deprecatedSiteLocal"
]);
function isPrivateOrLoopbackIpAddress(address) {
	return (address.kind() === "ipv4" ? PRIVATE_OR_LOOPBACK_IPV4_RANGES : PRIVATE_OR_LOOPBACK_IPV6_RANGES).has(address.range());
}
function isGatewayLoopbackHost(host) {
	const parsed = parseHostForAddressChecks(host);
	return Boolean(parsed && (parsed.isLocalhost || isLoopbackIpAddress(parsed.unbracketedHost)));
}
function isPrivateOrLoopbackHost(host) {
	const parsed = parseHostForAddressChecks(host);
	if (!parsed) return false;
	if (parsed.isLocalhost) return true;
	const address = parseGatewayIpAddress(parsed.unbracketedHost);
	return Boolean(address && isPrivateOrLoopbackIpAddress(address));
}
function isTrustedPlaintextWebSocketHost(hostname) {
	if (isPrivateOrLoopbackHost(hostname)) return true;
	const normalized = hostname.toLowerCase().trim().replace(/\.+$/, "");
	return normalized.endsWith(".local") || normalized.endsWith(".ts.net");
}
function isSecureWebSocketUrl(rawUrl, options) {
	try {
		const url = new URL(rawUrl);
		const protocol = url.protocol === "https:" ? "wss:" : url.protocol === "http:" ? "ws:" : url.protocol;
		if (protocol === "wss:") return true;
		if (protocol !== "ws:") return false;
		if (isGatewayLoopbackHost(url.hostname) || isTrustedPlaintextWebSocketHost(url.hostname)) return true;
		if (options?.allowPrivateWs === true) {
			const hostForIpCheck = url.hostname.startsWith("[") && url.hostname.endsWith("]") ? url.hostname.slice(1, -1) : url.hostname;
			return isPrivateOrLoopbackHost(url.hostname) || parseGatewayIpAddress(hostForIpCheck) === void 0;
		}
		return false;
	} catch {
		return false;
	}
}
var GatewayWebSocketTransportConfigurationError = class extends Error {};
function resolveGatewayWebSocketTransport(params) {
	const usesTls = isWssUrl(params.url);
	if (params.tlsFingerprint && !usesTls) throw new GatewayWebSocketTransportConfigurationError("gateway tls fingerprint requires wss:// gateway url");
	const allowPrivateWs = (params.env ?? process.env).OPENCLAW_ALLOW_INSECURE_PRIVATE_WS === "1";
	if (!isSecureWebSocketUrl(params.url, { allowPrivateWs })) {
		let displayHost = params.url;
		try {
			displayHost = new URL(params.url).hostname || params.url;
		} catch {}
		throw new GatewayWebSocketTransportConfigurationError(`SECURITY ERROR: Cannot connect to "${displayHost}" over plaintext ws://. Both credentials and chat data would be exposed to network interception. Use wss:// for remote URLs. Safe defaults: keep gateway.bind=loopback and connect via SSH tunnel (ssh -N -L 18789:127.0.0.1:18789 user@gateway-host), or use Tailscale Serve/Funnel. ` + (allowPrivateWs ? "" : "Break-glass (trusted private networks only): set OPENCLAW_ALLOW_INSECURE_PRIVATE_WS=1. ") + "Run `openclaw doctor --fix` for guidance.");
	}
	const normalize = params.normalizeTlsFingerprint ?? normalizeFingerprint;
	const options = { ...params.options };
	if (usesTls && params.tlsFingerprint) {
		options.rejectUnauthorized = false;
		options.checkServerIdentity = (_hostValue, cert) => {
			const fingerprintValue = typeof cert === "object" && cert && "fingerprint256" in cert ? cert.fingerprint256 ?? "" : "";
			const fingerprint = normalize(typeof fingerprintValue === "string" ? fingerprintValue : "");
			const expected = normalize(params.tlsFingerprint);
			if (!expected) return;
			if (!fingerprint) return /* @__PURE__ */ new Error("Missing server TLS fingerprint");
			if (fingerprint !== expected) return /* @__PURE__ */ new Error("Server TLS fingerprint mismatch");
		};
	}
	return {
		options,
		validateSocket: (socket) => {
			if (!params.tlsFingerprint) return null;
			const expected = normalize(params.tlsFingerprint);
			if (!expected) return /* @__PURE__ */ new Error("gateway tls fingerprint missing");
			const rawSocket = socket["_socket"];
			if (!rawSocket || typeof rawSocket.getPeerCertificate !== "function") return /* @__PURE__ */ new Error("gateway tls fingerprint unavailable");
			const cert = rawSocket.getPeerCertificate();
			const fingerprint = normalize(cert?.fingerprint256 ?? "");
			if (!fingerprint) return /* @__PURE__ */ new Error("gateway tls fingerprint unavailable");
			return fingerprint === expected ? null : /* @__PURE__ */ new Error("gateway tls fingerprint mismatch");
		}
	};
}
//#endregion
export { normalizeFingerprint as a, isSensitiveUrlQueryParamName as i, isGatewayLoopbackHost as n, normalizeGatewayErrorText as o, resolveGatewayWebSocketTransport as r, GatewayWebSocketTransportConfigurationError as t };
