import { t as ADMIN_SCOPE } from "./operator-scopes-Dw7Gu2cA.js";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-UYcIi_5g.js";
import { l as storeDeviceAuthToken } from "./device-auth-store-DVgrQui-.js";
import { o as publicKeyRawBase64UrlFromPem, r as loadOrCreateDeviceIdentity } from "./device-identity-UxfYyiX_.js";
import { r as roleScopesAllow } from "./operator-scope-compat-C7_b0yme.js";
import { h as requestDevicePairing, n as getPairedDevice } from "./device-pairing-Li5h-3GZ.js";
import { n as approveDevicePairing } from "./device-pairing-approval-BDF-0zH-.js";
//#region src/gateway/startup-local-cli-pairing.ts
function cacheOperatorToken(params) {
	const token = params.paired?.tokens?.operator;
	if (!token?.token || !roleScopesAllow({
		role: "operator",
		requestedScopes: ["operator.admin"],
		allowedScopes: token.scopes
	})) return false;
	storeDeviceAuthToken({
		deviceId: params.deviceId,
		role: "operator",
		token: token.token,
		scopes: token.scopes
	});
	return true;
}
/**
* Runtime-only auth has no shared secret a sibling CLI process can read. Bind
* the canonical same-user device identity before readiness instead, preserving
* authenticated loopback access without writing generated auth into config.
*/
async function ensureStartupLocalCliPairing() {
	const identity = loadOrCreateDeviceIdentity();
	const publicKey = publicKeyRawBase64UrlFromPem(identity.publicKeyPem);
	const existing = await getPairedDevice(identity.deviceId);
	if (existing) {
		if (existing.publicKey !== publicKey) throw new Error("local CLI pairing identity does not match the canonical device key");
		return cacheOperatorToken({
			deviceId: identity.deviceId,
			paired: existing
		}) ? "reused" : "unavailable";
	}
	const approved = await approveDevicePairing((await requestDevicePairing({
		deviceId: identity.deviceId,
		publicKey,
		displayName: "OpenClaw CLI",
		platform: process.platform,
		clientId: GATEWAY_CLIENT_NAMES.CLI,
		clientMode: GATEWAY_CLIENT_MODES.CLI,
		role: "operator",
		scopes: [ADMIN_SCOPE],
		remoteIp: "127.0.0.1",
		silent: true
	})).request.requestId, {
		callerScopes: [ADMIN_SCOPE],
		approvedVia: "silent",
		accessMetadata: {
			displayName: "OpenClaw CLI",
			remoteIp: "127.0.0.1",
			lastSeenAtMs: Date.now(),
			lastSeenReason: "runtime-token-startup"
		}
	});
	if (approved?.status === "approved") {
		if (!cacheOperatorToken({
			deviceId: identity.deviceId,
			paired: approved.device
		})) throw new Error("local CLI pairing approval did not issue an operator token");
		return "created";
	}
	const pairedAfterApproval = await getPairedDevice(identity.deviceId);
	if (pairedAfterApproval?.publicKey === publicKey && cacheOperatorToken({
		deviceId: identity.deviceId,
		paired: pairedAfterApproval
	})) return "reused";
	return "unavailable";
}
//#endregion
export { ensureStartupLocalCliPairing };
