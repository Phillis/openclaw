import { f as isLoopbackIpAddress } from "./ip-Bc6HA4HC.js";
import { a as isWssUrl } from "./url-protocol-OU3K-ySz.js";
import { a as parseHostForAddressChecks, i as parseGatewayIpAddress, r as normalizeTlsFingerprint } from "./client-address-utils-ycG4vrin.js";
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
	const normalize = params.normalizeTlsFingerprint ?? normalizeTlsFingerprint;
	const expectedFingerprint = params.tlsFingerprint ? normalizeTlsFingerprint(params.tlsFingerprint) : void 0;
	if (params.tlsFingerprint && !expectedFingerprint) throw new GatewayWebSocketTransportConfigurationError("gateway tls fingerprint must be a SHA-256 fingerprint");
	const options = { ...params.options };
	if (usesTls && expectedFingerprint) {
		options.rejectUnauthorized = false;
		options.checkServerIdentity = (_hostValue, cert) => {
			const fingerprintValue = typeof cert === "object" && cert && "fingerprint256" in cert ? cert.fingerprint256 ?? "" : "";
			const canonicalFingerprint = normalizeTlsFingerprint(typeof fingerprintValue === "string" ? fingerprintValue : "");
			const fingerprint = canonicalFingerprint ? normalize(canonicalFingerprint) : "";
			const expected = normalize(expectedFingerprint);
			if (!fingerprint) return /* @__PURE__ */ new Error("Missing server TLS fingerprint");
			if (fingerprint !== expected) return /* @__PURE__ */ new Error("Server TLS fingerprint mismatch");
		};
	}
	return {
		options,
		validateSocket: (socket) => {
			if (!params.tlsFingerprint) return null;
			const expected = expectedFingerprint ? normalize(expectedFingerprint) : "";
			if (!expected) return /* @__PURE__ */ new Error("gateway tls fingerprint missing");
			const rawSocket = socket["_socket"];
			if (!rawSocket || typeof rawSocket.getPeerCertificate !== "function") return /* @__PURE__ */ new Error("gateway tls fingerprint unavailable");
			const canonicalFingerprint = normalizeTlsFingerprint(rawSocket.getPeerCertificate()?.fingerprint256 ?? "");
			const fingerprint = canonicalFingerprint ? normalize(canonicalFingerprint) : "";
			if (!fingerprint) return /* @__PURE__ */ new Error("gateway tls fingerprint unavailable");
			return fingerprint === expected ? null : /* @__PURE__ */ new Error("gateway tls fingerprint mismatch");
		}
	};
}
//#endregion
export { isGatewayLoopbackHost as n, resolveGatewayWebSocketTransport as r, GatewayWebSocketTransportConfigurationError as t };
