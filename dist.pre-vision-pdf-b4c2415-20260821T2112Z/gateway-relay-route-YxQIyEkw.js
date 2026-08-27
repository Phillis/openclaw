import { r as getRuntimeConfig } from "./io-CeQckj5v.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.js";
import "./security-runtime-Bm9RUgAZ.js";
import { a as resolveProfile } from "./config-Cj5bkhGy.js";
import { n as readExtensionRelayToken } from "./relay-auth-Cwei20kM.js";
import "./config-BNmgwa3Q.js";
import "./bounded-utf8-tail-0BX-1sOF.js";
import { r as getBrowserControlState } from "./browser-control-state-B8K8CIAv.js";
import { t as startBrowserControlServiceFromConfig } from "./control-service-B2wgAsev.js";
import { a as getBrowserRelayAuthV2Authority, o as invalidateBrowserRelayAuthV2Authority, s as parseExtensionRelayResource } from "./auth-v2-Bg7Y5-gQ.js";
import { a as EXTENSION_RELAY_MAX_PAYLOAD_BYTES, d as requestProtocols, f as handlePreAuthWebSocketUpgrade, l as isAllowedExtensionOrigin, n as ensureExtensionRelayForProfile, o as attachExtensionWebSocket, s as authenticateExtensionWebSocket, u as requestExtensionProtocolToken } from "./relay-lifecycle-BWFq9TFg.js";
import { WebSocketServer } from "ws";
//#region extensions/browser/src/browser/extension-relay/gateway-relay-route.ts
const log = createSubsystemLogger("browser").child("extension-relay-gateway");
const GATEWAY_EXTENSION_RELAY_PATH = "/browser/extension";
let wss = null;
function getWss() {
	wss ??= new WebSocketServer({
		noServer: true,
		maxPayload: EXTENSION_RELAY_MAX_PAYLOAD_BYTES
	});
	return wss;
}
function destroy(socket, statusLine) {
	try {
		socket.write(`HTTP/1.1 ${statusLine}\r\nConnection: close\r\n\r\n`);
	} finally {
		socket.destroy();
	}
}
function requestedProfileName(resource, fallback) {
	return new URL(resource, "http://127.0.0.1").searchParams.get("profile") ?? fallback;
}
function defaultExtensionProfileName(profiles) {
	for (const [name, profile] of Object.entries(profiles)) if (profile.driver === "extension") return name;
	return "chrome";
}
async function resolveGatewayBridge(resource) {
	let state = getBrowserControlState();
	if (!state) {
		state = await startBrowserControlServiceFromConfig();
		if (!state) throw new Error("Browser control is disabled");
	}
	const profileName = requestedProfileName(resource, defaultExtensionProfileName(state.resolved.profiles));
	const resolved = resolveProfile(state.resolved, profileName);
	if (!resolved || resolved.driver !== "extension") throw new Error(`Extension browser profile "${profileName}" was not found`);
	return {
		bridge: (await ensureExtensionRelayForProfile(state, resolved)).bridge,
		profileName
	};
}
/** Handle the plugin-owned Gateway upgrade path. */
async function handleGatewayExtensionUpgrade(req, socket, head) {
	const resource = parseExtensionRelayResource(req.url ?? "/", GATEWAY_EXTENSION_RELAY_PATH);
	if (!resource) return (req.url ?? "/").split("?")[0] === GATEWAY_EXTENSION_RELAY_PATH ? (destroy(socket, "400 Bad Request"), true) : false;
	if (!isAllowedExtensionOrigin(req)) {
		destroy(socket, "403 Forbidden");
		return true;
	}
	const protocols = requestProtocols(req);
	const token = readExtensionRelayToken();
	if (!token) {
		invalidateBrowserRelayAuthV2Authority();
		destroy(socket, "401 Unauthorized");
		return true;
	}
	if (protocols.length === 1 && protocols[0] === "openclaw-extension-relay.v2") {
		const authority = getBrowserRelayAuthV2Authority(token);
		if (!handlePreAuthWebSocketUpgrade({
			wss: getWss(),
			req,
			socket,
			head,
			onUpgrade: (ws, removePreAuthGuard) => {
				authenticateExtensionWebSocket({
					ws,
					authority,
					resource,
					removePreAuthGuard,
					prepareAuthenticated: async () => {
						if (readExtensionRelayToken() !== token) throw new Error("browser relay key rotated during authentication");
						const { bridge, profileName } = await resolveGatewayBridge(resource);
						return () => {
							attachExtensionWebSocket(bridge, ws);
							log.info(`extension authenticated over gateway for profile "${profileName}"`);
						};
					}
				});
			}
		})) destroy(socket, "400 Bad Request");
		return true;
	}
	if (protocols.includes("openclaw-extension-relay.v2")) {
		destroy(socket, "400 Bad Request");
		return true;
	}
	const allowLegacyAuth = getRuntimeConfig().browser?.extensionRelay?.allowLegacyAuth !== false;
	const legacyToken = requestExtensionProtocolToken(req);
	if (!allowLegacyAuth || !protocols.includes("openclaw-extension-relay") || legacyToken.length === 0 || !safeEqualSecret(token, legacyToken)) {
		destroy(socket, "401 Unauthorized");
		return true;
	}
	let resolved;
	try {
		resolved = await resolveGatewayBridge(resource);
	} catch (err) {
		log.warn(`failed to start Browser control for legacy extension relay: ${String(err)}`);
		destroy(socket, "503 Service Unavailable");
		return true;
	}
	const authority = getBrowserRelayAuthV2Authority(token);
	getWss().handleUpgrade(req, socket, head, (ws) => {
		if (!authority.registerAuthenticatedConnection(ws, () => ws.close(4003, "browser relay key rotated"))) {
			ws.terminate();
			return;
		}
		ws.once("close", () => authority.releaseConnection(ws));
		attachExtensionWebSocket(resolved.bridge, ws);
		log.warn(`legacy extension authentication accepted for profile "${resolved.profileName}"`);
	});
	return true;
}
function disposeGatewayExtensionRelay() {
	if (!wss) return;
	for (const client of wss.clients) client.terminate();
	wss.close();
	wss = null;
}
//#endregion
export { disposeGatewayExtensionRelay, handleGatewayExtensionUpgrade };
