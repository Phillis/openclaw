import { r as runCommandWithTimeout } from "./exec-BL80Wdzl.js";
import { o as isLoopbackHost } from "./net-BRYQcUG8.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { Et as validateDevicePairSetupStatusParams, Tt as validateDevicePairSetupCodeParams } from "./src-Bo4ezI_n.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
import { n as renderQrPngDataUrl } from "./qr-image-BU2pvgPz.js";
import { A as NODE_PAIRING_SETUP_BOOTSTRAP_PROFILE, j as PAIRING_SETUP_BOOTSTRAP_PROFILE, l as readDevicePairSetupCompletion } from "./device-bootstrap-DCaGQVSG.js";
import { t as formatForLog } from "./ws-log-DAJ6wT2O.js";
import { t as assertValidParams } from "./validation-CsGeElrb.js";
import { n as encodePairingSetupCode, r as resolvePairingSetupFromConfig } from "./setup-code-DhZBwB8q.js";
import { n as registerDevicePairingJoinCode } from "./device-pairing-join-code-B_FtNjTs.js";
//#region src/gateway/server-methods/device-pair-setup.ts
const MAX_QR_DATA_URL_LENGTH = 16384;
function readConfiguredDevicePairPublicUrl(config) {
	const value = config.plugins?.entries?.["device-pair"]?.config?.["publicUrl"];
	return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function resolveDevicePairingJoinBaseUrl(payload) {
	for (const candidate of payload.urls ?? [payload.url]) {
		const parsed = new URL(candidate);
		if (parsed.protocol === "wss:") {
			parsed.protocol = "https:";
			return parsed;
		}
		if (parsed.protocol === "ws:" && isLoopbackHost(parsed.hostname)) {
			parsed.protocol = "http:";
			return parsed;
		}
	}
	throw new Error("Join URLs require a TLS gateway endpoint, except for loopback. Use the setup code directly for plaintext LAN pairing.");
}
/** Gateway handler for producing a device-pairing setup code + connect QR. */
const devicePairSetupHandlers = {
	"device.pair.setupCode": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateDevicePairSetupCodeParams, "device.pair.setupCode", respond)) return;
		try {
			if (params.joinUrl === true && params.bootstrapProfile !== void 0 && params.bootstrapProfile !== "node") {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Join URLs require bootstrapProfile=node."));
				return;
			}
			const config = context.getRuntimeConfig();
			const requestPublicUrl = typeof params.publicUrl === "string" ? params.publicUrl : void 0;
			const configuredPublicUrl = params.preferRemoteUrl === true ? void 0 : readConfiguredDevicePairPublicUrl(config);
			const publicUrl = requestPublicUrl ?? configuredPublicUrl;
			const resolved = await resolvePairingSetupFromConfig(config, {
				env: process.env,
				publicUrl,
				preferRemoteUrl: params.preferRemoteUrl === true,
				localTlsFingerprint: context.gatewayTlsFingerprint,
				...params.joinUrl === true || params.bootstrapProfile ? { bootstrapProfile: params.joinUrl === true || params.bootstrapProfile === "node" ? NODE_PAIRING_SETUP_BOOTSTRAP_PROFILE : PAIRING_SETUP_BOOTSTRAP_PROFILE } : {},
				runCommandWithTimeout: async (argv, runOpts) => await runCommandWithTimeout(argv, { timeoutMs: runOpts.timeoutMs })
			});
			if (!resolved.ok) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, resolved.error));
				return;
			}
			const setupCode = encodePairingSetupCode(resolved.payload);
			let joinUrl;
			if (params.joinUrl === true) {
				const parsedJoinUrl = resolveDevicePairingJoinBaseUrl(resolved.payload);
				const shortcode = registerDevicePairingJoinCode({
					payload: resolved.payload,
					expiresAtMs: resolved.expiresAtMs
				});
				parsedJoinUrl.pathname = `${parsedJoinUrl.pathname.replace(/\/+$/u, "")}/j/${shortcode}`;
				parsedJoinUrl.search = "";
				parsedJoinUrl.hash = "";
				joinUrl = parsedJoinUrl.toString();
			}
			const renderedQr = params.includeQr !== false ? await renderQrPngDataUrl(setupCode).catch(() => void 0) : void 0;
			const qrDataUrl = renderedQr && renderedQr.length <= MAX_QR_DATA_URL_LENGTH ? renderedQr : void 0;
			respond(true, {
				setupId: resolved.setupId,
				expiresAtMs: resolved.expiresAtMs,
				setupCode,
				...joinUrl ? { joinUrl } : {},
				...qrDataUrl ? { qrDataUrl } : {},
				gatewayUrl: resolved.payload.url,
				...resolved.payload.urls ? { gatewayUrls: resolved.payload.urls } : {},
				auth: resolved.authLabel,
				urlSource: requestPublicUrl ? "request.publicUrl" : resolved.urlSource,
				access: resolved.access,
				...resolved.accessDowngraded ? { accessDowngraded: true } : {}
			}, void 0);
		} catch (err) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err)));
		}
	},
	"device.pair.setupStatus": async ({ params, respond }) => {
		if (!assertValidParams(params, validateDevicePairSetupStatusParams, "device.pair.setupStatus", respond)) return;
		try {
			const completion = await readDevicePairSetupCompletion({ setupId: params.setupId });
			respond(true, completion ? (() => {
				const payload = {
					setupId: completion.setupId,
					deviceId: completion.deviceId,
					...completion.deviceName ? { deviceName: completion.deviceName } : {},
					access: completion.access,
					ts: completion.completedAtMs
				};
				return completion.deliveryState === "confirmed" ? { completion: payload } : { deliveryUncertain: payload };
			})() : {}, void 0);
		} catch (err) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err)));
		}
	}
};
//#endregion
export { devicePairSetupHandlers };
