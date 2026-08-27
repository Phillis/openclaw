import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.js";
import { o as isLoopbackHost } from "./net-BRYQcUG8.js";
import "./security-runtime-Bm9RUgAZ.js";
import { n as rawDataToString } from "./ws-C3ckvj65.js";
import "./webhook-ingress-h_3NGYrN.js";
import { a as resolveProfile } from "./config-Cj5bkhGy.js";
import "./tmp-openclaw-dir-D8YnNVMn.js";
import { n as readExtensionRelayToken } from "./relay-auth-Cwei20kM.js";
import "./bounded-utf8-tail-0BX-1sOF.js";
import { a as getOrCreateProfileRuntime, m as withProfileOperationLease, o as getProfileLifecycle, s as isBrowserRuntimeRunning } from "./server-context.lifecycle-Pe7TIt3D.js";
import { a as getBrowserRelayAuthV2Authority, c as parseRelayAuthHello, d as parseRelayHttpCompleteRequest, f as parseStrictJsonObject, l as parseRelayAuthResponse, o as invalidateBrowserRelayAuthV2Authority, r as BROWSER_RELAY_CHALLENGE_TTL_MS, s as parseExtensionRelayResource, u as parseRelayHttpChallengeRequest } from "./auth-v2-Bg7Y5-gQ.js";
import crypto from "node:crypto";
import { Duplex } from "node:stream";
import { WebSocketServer } from "ws";
import http from "node:http";
const MAX_WEBSOCKET_PREAUTH_WIRE_BYTES = 17408;
function boundedRawDataByteLength(data, limit) {
	if (!Array.isArray(data)) return data.byteLength;
	let length = 0;
	for (const chunk of data) {
		length += chunk.byteLength;
		if (length > limit) break;
	}
	return length;
}
var PreAuthWebSocketTransport = class extends Duplex {
	constructor(rawSocket, headBytes) {
		super();
		this.rawSocket = rawSocket;
		this.guardActive = true;
		this.removeGuard = () => {
			this.guardActive = false;
		};
		this.onRawData = (chunk) => {
			if (this.guardActive) {
				this.wireBytes += chunk.byteLength;
				if (this.wireBytes > MAX_WEBSOCKET_PREAUTH_WIRE_BYTES) {
					this.destroy();
					return;
				}
			}
			if (!this.push(chunk)) this.rawSocket.pause();
		};
		this.onRawEnd = () => this.push(null);
		this.onRawClose = () => this.destroy();
		this.onRawError = (error) => this.destroy(error);
		this.wireBytes = headBytes;
		rawSocket.on("data", this.onRawData);
		rawSocket.once("end", this.onRawEnd);
		rawSocket.once("close", this.onRawClose);
		rawSocket.once("error", this.onRawError);
	}
	_read() {
		this.rawSocket.resume();
	}
	_write(chunk, encoding, callback) {
		this.rawSocket.write(chunk, encoding, callback);
	}
	_final(callback) {
		this.rawSocket.end(callback);
	}
	_destroy(error, callback) {
		this.rawSocket.off("data", this.onRawData);
		this.rawSocket.off("end", this.onRawEnd);
		this.rawSocket.off("close", this.onRawClose);
		this.rawSocket.off("error", this.onRawError);
		if (!this.rawSocket.destroyed) this.rawSocket.destroy();
		callback(error);
	}
};
/** Withhold pre-auth bytes from `ws`; successful proof makes the transport transparent. */
function handlePreAuthWebSocketUpgrade(params) {
	if (params.head.byteLength > MAX_WEBSOCKET_PREAUTH_WIRE_BYTES) return false;
	const transport = new PreAuthWebSocketTransport(params.socket, params.head.byteLength);
	try {
		params.wss.handleUpgrade(params.req, transport, params.head, (ws) => {
			params.onUpgrade(ws, transport.removeGuard);
		});
	} catch (err) {
		transport.destroy();
		throw err;
	}
	return true;
}
//#endregion
//#region extensions/browser/src/browser/extension-relay/create-target-params.ts
function resolveCreateTargetParams(params) {
	const background = params?.background;
	const focus = params?.focus;
	if (background === true && focus === true) throw new Error("Target.createTarget does not support background=true with focus=true");
	const resolvedBackground = focus === void 0 ? background !== false : background === true && focus === false;
	return {
		background: resolvedBackground,
		focus: focus === true || focus === void 0 && !resolvedBackground
	};
}
//#endregion
//#region extensions/browser/src/browser/extension-relay/relay-protocol.ts
function hasExactOwnKeys(value, keys) {
	return Object.keys(value).length === keys.length && keys.every((key) => Object.hasOwn(value, key));
}
function isRelayTabInfo(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	if (!hasExactOwnKeys(value, [
		"tabId",
		"url",
		"title",
		"active"
	])) return false;
	const tab = value;
	return Number.isSafeInteger(tab.tabId) && tab.tabId >= 0 && typeof tab.url === "string" && tab.url.length <= 16384 && typeof tab.title === "string" && tab.title.length <= 4096 && typeof tab.active === "boolean";
}
function isRelayTabInfoArray(value) {
	if (!Array.isArray(value) || value.length > 1e3 || !value.every(isRelayTabInfo)) return false;
	return new Set(value.map((tab) => tab.tabId)).size === value.length;
}
function isNonNegativeSafeInteger(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}
function isExtensionHelloMessage(value) {
	if (!hasExactOwnKeys(value, [
		"type",
		"userAgent",
		"browserVersion",
		"extensionVersion",
		"tabs"
	])) return false;
	const hello = value;
	if (hello.type !== "hello" || typeof hello.userAgent !== "string" || hello.userAgent.length === 0 || hello.userAgent.length > 2048 || typeof hello.browserVersion !== "string" || hello.browserVersion.length === 0 || hello.browserVersion.length > 512 || typeof hello.extensionVersion !== "string" || hello.extensionVersion.length === 0 || hello.extensionVersion.length > 128 || !isRelayTabInfoArray(hello.tabs)) return false;
	return true;
}
function isExtensionTabsMessage(msg) {
	return msg.type === "tabs" && isRelayTabInfoArray(msg.tabs);
}
function isExtensionCdpEventMessage(msg) {
	return msg.type === "cdpEvent" && isNonNegativeSafeInteger(msg.tabId) && (msg.sessionId === void 0 || typeof msg.sessionId === "string") && typeof msg.method === "string";
}
function isExtensionResultMessage(msg) {
	return msg.type === "result" && isNonNegativeSafeInteger(msg.seq);
}
function isExtensionErrorMessage(msg) {
	return msg.type === "error" && isNonNegativeSafeInteger(msg.seq) && typeof msg.message === "string";
}
function isExtensionDetachedMessage(msg) {
	return msg.type === "detached" && isNonNegativeSafeInteger(msg.tabId) && typeof msg.reason === "string";
}
function isExtensionPongMessage(msg) {
	return msg.type === "pong";
}
/** Parse one extension frame; returns null for malformed input. */
function parseExtensionMessage(raw) {
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return null;
	}
	if (!parsed || typeof parsed !== "object") return null;
	const msg = parsed;
	switch (msg.type) {
		case "hello": return isExtensionHelloMessage(msg) ? msg : null;
		case "tabs": return isExtensionTabsMessage(msg) ? msg : null;
		case "cdpEvent": return isExtensionCdpEventMessage(msg) ? msg : null;
		case "result": return isExtensionResultMessage(msg) ? msg : null;
		case "error": return isExtensionErrorMessage(msg) ? msg : null;
		case "detached": return isExtensionDetachedMessage(msg) ? msg : null;
		case "pong": return isExtensionPongMessage(msg) ? msg : null;
		default: return null;
	}
}
//#endregion
//#region extensions/browser/src/browser/extension-relay/relay-bridge.ts
/**
* Extension relay CDP bridge.
*
* Presents a CDP browser endpoint (compatible with Playwright connectOverCDP)
* on one side and the OpenClaw Chrome extension's chrome.debugger transport on
* the other. The bridge owns all Target.* synthesis so the extension stays a
* thin forwarder — the old assets/chrome-extension put this logic in an
* untestable MV3 service worker, which is why it rotted and was removed.
*/
const log$2 = createSubsystemLogger("browser").child("extension-relay");
/** Default timeout for commands forwarded to the extension. */
const EXTENSION_COMMAND_TIMEOUT_MS = 15e3;
/** App-level keepalive interval; message traffic keeps the MV3 worker alive. */
const EXTENSION_PING_INTERVAL_MS = 2e4;
/** Synthetic targetId for the emulated browser target. */
const BROWSER_TARGET_ID = "openclaw-extension-relay";
/** Playwright requires every attached page target to identify its browser context. */
const BROWSER_CONTEXT_ID = "openclaw-extension-context";
function toErrorPayload(id, sessionId, message, code = -32e3) {
	return JSON.stringify({
		id,
		...sessionId ? { sessionId } : {},
		error: {
			code,
			message
		}
	});
}
/**
* One relay bridge per extension-driver profile. Accepts at most one extension
* connection (a newer one replaces the old — MV3 workers restart freely) and
* any number of CDP clients (pw-session caches one per cdpUrl in practice).
*/
var ExtensionRelayBridge = class {
	constructor(opts = {}) {
		this.extension = null;
		this.extensionCandidates = /* @__PURE__ */ new Set();
		this.clients = /* @__PURE__ */ new Set();
		this.tabs = /* @__PURE__ */ new Map();
		this.browserSessions = /* @__PURE__ */ new Map();
		this.auxiliaryTabSessions = /* @__PURE__ */ new Map();
		this.childSessions = /* @__PURE__ */ new Map();
		this.pendingExtension = /* @__PURE__ */ new Map();
		this.nextSeq = 1;
		this.nextSessionOrdinal = 1;
		this.nextExtensionCandidateOrdinal = 1;
		this.latestPromotedCandidateOrdinal = 0;
		this.pingTimer = null;
		this.missedPongs = 0;
		this.onStateChange = opts.onStateChange;
	}
	/** True once an extension socket completed its hello handshake. */
	get extensionConnected() {
		return this.extension !== null;
	}
	/** Identity of the paired browser, when connected. */
	get identity() {
		return this.extension?.identity ?? null;
	}
	/** Tabs currently reported as accessible by the extension. */
	accessibleTabs() {
		return [...this.tabs.values()].map((tab) => tab.info);
	}
	/**
	* DevTools-style descriptors for `/json/list`: RelayTabInfo plus the `id`
	* and `type` fields CDP discovery clients expect. `id` is the live debugger
	* targetId once a tab is attached; before that it is the same `tab-<tabId>`
	* fallback ensureTabAttached mints, so unattached tabs still list stably.
	* No per-target webSocketDebuggerUrl: all CDP traffic multiplexes over the
	* single browser endpoint (`/cdp`).
	*/
	devtoolsTargetDescriptors() {
		return [...this.tabs.values()].map((tab) => ({
			tabId: tab.info.tabId,
			url: tab.info.url,
			title: tab.info.title,
			active: tab.info.active,
			id: tab.attached?.targetId ?? `tab-${tab.info.tabId}`,
			type: "page"
		}));
	}
	/** Number of connected CDP clients (diagnostics). */
	get cdpClientCount() {
		return this.clients.size;
	}
	/** Wire up a newly accepted extension WebSocket. */
	attachExtensionSocket(socket) {
		const candidateOrdinal = this.nextExtensionCandidateOrdinal++;
		let candidateState = "awaiting-hello";
		this.extensionCandidates.add(socket);
		const rejectCandidate = (code, reason) => {
			candidateState = "rejected";
			this.extensionCandidates.delete(socket);
			socket.close(code, reason);
		};
		const onMessage = (raw) => {
			if (candidateState === "rejected") return;
			const msg = parseExtensionMessage(raw);
			if (candidateState === "awaiting-hello") {
				if (msg?.type !== "hello") {
					rejectCandidate(4001, "expected valid hello");
					return;
				}
				if (candidateOrdinal < this.latestPromotedCandidateOrdinal) {
					rejectCandidate(4e3, "superseded by newer extension connection");
					return;
				}
				candidateState = "active";
				this.extensionCandidates.delete(socket);
				this.latestPromotedCandidateOrdinal = candidateOrdinal;
				if (this.extension) {
					log$2.info("extension reconnected; replacing previous relay connection");
					const previous = this.extension;
					previous.socket.close(4e3, "replaced by newer extension connection");
					if (this.extension === previous) this.handleExtensionGone();
				}
				this.extension = {
					socket,
					identity: {
						userAgent: msg.userAgent,
						browserVersion: msg.browserVersion,
						extensionVersion: msg.extensionVersion
					}
				};
				this.syncTabs(msg.tabs);
				this.startPing();
				this.onStateChange?.();
				return;
			}
			if (this.extension?.socket !== socket) return;
			if (!msg) {
				log$2.warn("dropping malformed extension relay frame");
				return;
			}
			this.handleExtensionMessage(msg);
		};
		const onClose = () => {
			candidateState = "rejected";
			this.extensionCandidates.delete(socket);
			if (this.extension?.socket === socket) {
				this.handleExtensionGone();
				this.onStateChange?.();
			}
		};
		return {
			onMessage,
			onClose
		};
	}
	handleExtensionMessage(msg) {
		switch (msg.type) {
			case "result": {
				const pending = this.pendingExtension.get(msg.seq);
				if (pending) {
					this.pendingExtension.delete(msg.seq);
					clearTimeout(pending.timer);
					pending.resolve(msg.result);
				}
				return;
			}
			case "error": {
				const pending = this.pendingExtension.get(msg.seq);
				if (pending) {
					this.pendingExtension.delete(msg.seq);
					clearTimeout(pending.timer);
					pending.reject(new Error(msg.message));
				}
				return;
			}
			case "cdpEvent":
				this.forwardExtensionEvent(msg.tabId, msg.sessionId, msg.method, msg.params);
				return;
			case "tabs":
				this.syncTabs(msg.tabs);
				return;
			case "detached": {
				const tab = this.tabs.get(msg.tabId);
				if (tab?.attached) {
					this.emitDetachedFromTarget(msg.tabId, tab.attached.sessionId, tab.attached.targetId);
					tab.attached = void 0;
				}
				break;
			}
			case "pong":
				this.missedPongs = 0;
				break;
			case "hello": break;
		}
	}
	handleExtensionGone() {
		this.extension = null;
		this.stopPing();
		for (const pending of this.pendingExtension.values()) {
			clearTimeout(pending.timer);
			pending.reject(/* @__PURE__ */ new Error("extension disconnected"));
		}
		this.pendingExtension.clear();
		for (const [tabId, tab] of this.tabs) if (tab.attached) {
			this.emitDetachedFromTarget(tabId, tab.attached.sessionId, tab.attached.targetId);
			tab.attached = void 0;
		}
		this.childSessions.clear();
	}
	startPing() {
		this.stopPing();
		const owner = this.extension;
		this.pingTimer = setInterval(() => {
			if (!owner || this.extension !== owner) return;
			if (++this.missedPongs > 2) {
				owner.socket.close(4e3, "extension heartbeat timeout");
				if (this.extension === owner) {
					this.handleExtensionGone();
					this.onStateChange?.();
				}
				return;
			}
			this.sendToExtension({ type: "ping" });
		}, EXTENSION_PING_INTERVAL_MS);
		this.pingTimer.unref?.();
	}
	stopPing() {
		this.missedPongs = 0;
		if (this.pingTimer) {
			clearInterval(this.pingTimer);
			this.pingTimer = null;
		}
	}
	sendToExtension(msg) {
		if (!this.extension) throw new Error("OpenClaw Chrome extension is not connected to the relay");
		this.extension.socket.send(JSON.stringify(msg));
	}
	callExtension(command, timeoutMs = EXTENSION_COMMAND_TIMEOUT_MS) {
		const seq = this.nextSeq++;
		return new Promise((resolve, reject) => {
			const timer = setTimeout(() => {
				this.pendingExtension.delete(seq);
				reject(/* @__PURE__ */ new Error(`extension relay command timed out: ${command.type}`));
			}, timeoutMs);
			timer.unref?.();
			this.pendingExtension.set(seq, {
				resolve,
				reject,
				timer
			});
			try {
				this.sendToExtension({
					...command,
					seq
				});
			} catch (err) {
				this.pendingExtension.delete(seq);
				clearTimeout(timer);
				reject(err instanceof Error ? err : new Error(String(err)));
			}
		});
	}
	syncTabs(tabs) {
		const nextIds = new Set(tabs.map((tab) => tab.tabId));
		for (const [tabId, tab] of this.tabs) if (!nextIds.has(tabId)) {
			if (tab.attached) this.emitDetachedFromTarget(tabId, tab.attached.sessionId, tab.attached.targetId);
			this.tabs.delete(tabId);
		}
		for (const info of tabs) {
			const existing = this.tabs.get(info.tabId);
			if (existing) existing.info = info;
			else {
				this.tabs.set(info.tabId, { info });
				if ([...this.clients].some((client) => client.autoAttach)) this.ensureTabAttached(info.tabId).then(({ targetId, sessionId }) => {
					this.announceAttachedTab(info.tabId, targetId, sessionId, { onlyAutoAttach: true });
				}).catch((err) => {
					log$2.warn(`auto-attach of accessible tab ${info.tabId} failed: ${String(err)}`);
				});
			}
		}
	}
	async ensureTabAttached(tabId) {
		const tab = this.tabs.get(tabId);
		if (!tab) throw new Error(`tab ${tabId} is not available to OpenClaw`);
		if (tab.attached) return tab.attached;
		if (tab.attaching) return await tab.attaching;
		const attaching = (async () => {
			const result = await this.callExtension({
				type: "attach",
				tabId
			});
			const attached = {
				targetId: typeof result?.targetId === "string" ? result.targetId : `tab-${tabId}`,
				sessionId: `openclaw-tab-${tabId}-${this.nextSessionOrdinal++}`
			};
			const current = this.tabs.get(tabId);
			if (current !== tab) {
				this.callExtension({
					type: "detach",
					tabId
				}).catch(() => {});
				throw new Error(`tab ${tabId} closed during attach`);
			}
			current.attached = attached;
			return attached;
		})();
		tab.attaching = attaching;
		try {
			return await attaching;
		} finally {
			tab.attaching = void 0;
		}
	}
	targetInfoForTab(tab, targetId) {
		return {
			targetId,
			type: "page",
			title: tab.info.title,
			url: tab.info.url,
			browserContextId: BROWSER_CONTEXT_ID,
			attached: true,
			canAccessOpener: false
		};
	}
	announceAttachedTab(tabId, targetId, sessionId, opts) {
		const tab = this.tabs.get(tabId);
		if (!tab) return;
		const event = {
			method: "Target.attachedToTarget",
			params: {
				sessionId,
				targetInfo: this.targetInfoForTab(tab, targetId),
				waitingForDebugger: false
			}
		};
		const recipients = opts.onlyClient ? [opts.onlyClient] : [...this.clients].filter((client) => !opts.onlyAutoAttach || client.autoAttach);
		for (const client of recipients) {
			if (client.announcedSessions.has(sessionId)) continue;
			client.announcedSessions.add(sessionId);
			client.socket.send(JSON.stringify(event));
		}
	}
	emitDetachedFromTarget(tabId, sessionId, targetId) {
		const event = JSON.stringify({
			method: "Target.detachedFromTarget",
			params: {
				sessionId,
				targetId
			}
		});
		for (const client of this.clients) if (client.announcedSessions.delete(sessionId)) client.socket.send(event);
		for (const [auxiliarySessionId, auxiliary] of this.auxiliaryTabSessions) {
			if (auxiliary.tabId !== tabId) continue;
			auxiliary.client.socket.send(JSON.stringify({
				sessionId: auxiliary.parentSessionId,
				method: "Target.detachedFromTarget",
				params: {
					sessionId: auxiliarySessionId,
					targetId
				}
			}));
			this.auxiliaryTabSessions.delete(auxiliarySessionId);
		}
		for (const [childSessionId, ownerTabId] of this.childSessions) {
			if (ownerTabId !== tabId) continue;
			this.childSessions.delete(childSessionId);
			for (const client of this.clients) client.announcedSessions.delete(childSessionId);
		}
	}
	forwardExtensionEvent(tabId, childSessionId, method, params) {
		const rootSessionId = this.tabs.get(tabId)?.attached?.sessionId;
		if (!rootSessionId) return;
		const sessionId = childSessionId ?? rootSessionId;
		if (childSessionId) this.childSessions.set(childSessionId, tabId);
		if (method === "Target.attachedToTarget") {
			const announced = params?.sessionId;
			if (typeof announced === "string") {
				this.childSessions.set(announced, tabId);
				for (const client of this.clients) if (client.announcedSessions.has(sessionId)) client.announcedSessions.add(announced);
			}
		}
		const frame = JSON.stringify({
			sessionId,
			method,
			params
		});
		for (const client of this.clients) if (client.announcedSessions.has(sessionId)) client.socket.send(frame);
		if (!childSessionId) {
			for (const [auxiliarySessionId, auxiliary] of this.auxiliaryTabSessions) if (auxiliary.tabId === tabId) auxiliary.client.socket.send(JSON.stringify({
				sessionId: auxiliarySessionId,
				method,
				params
			}));
		}
	}
	/** Wire up a newly accepted CDP client WebSocket. */
	attachCdpClientSocket(socket) {
		const client = {
			socket,
			autoAttach: false,
			announcedSessions: /* @__PURE__ */ new Set()
		};
		this.clients.add(client);
		const onMessage = (raw) => {
			let parsed;
			try {
				parsed = JSON.parse(raw);
			} catch {
				client.socket.send(toErrorPayload(null, void 0, "Parse error", -32700));
				return;
			}
			if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
				client.socket.send(toErrorPayload(null, void 0, "Invalid request", -32600));
				return;
			}
			const request = parsed;
			if (typeof request.id !== "number" || typeof request.method !== "string") {
				const id = typeof request.id === "number" ? request.id : null;
				const sessionId = typeof request.sessionId === "string" ? request.sessionId : void 0;
				client.socket.send(toErrorPayload(id, sessionId, "Invalid request", -32600));
				return;
			}
			this.handleCdpRequest(client, request);
		};
		const onClose = () => {
			this.clients.delete(client);
			for (const [sessionId, owner] of this.browserSessions) if (owner === client) this.browserSessions.delete(sessionId);
			for (const [sessionId, auxiliary] of this.auxiliaryTabSessions) if (auxiliary.client === client) this.auxiliaryTabSessions.delete(sessionId);
			this.detachAllWhenIdle();
		};
		return {
			onMessage,
			onClose
		};
	}
	/**
	* Drop chrome.debugger sessions once no CDP client is connected so the
	* "OpenClaw is debugging this browser" infobar only spans active automation.
	*/
	detachAllWhenIdle() {
		if (this.clients.size > 0 || !this.extension) return;
		for (const [tabId, tab] of this.tabs) if (tab.attached) {
			const { sessionId, targetId } = tab.attached;
			tab.attached = void 0;
			this.emitDetachedFromTarget(tabId, sessionId, targetId);
			this.callExtension({
				type: "detach",
				tabId
			}).catch(() => {});
		}
	}
	respond(client, request, result) {
		client.socket.send(JSON.stringify({
			id: request.id,
			...request.sessionId ? { sessionId: request.sessionId } : {},
			result: result ?? {}
		}));
	}
	respondError(client, request, message, code = -32e3) {
		client.socket.send(toErrorPayload(request.id, request.sessionId, message, code));
	}
	tabBySessionId(sessionId) {
		for (const [tabId, tab] of this.tabs) if (tab.attached?.sessionId === sessionId) return {
			tabId,
			child: false
		};
		const auxiliary = this.auxiliaryTabSessions.get(sessionId);
		if (auxiliary) return {
			tabId: auxiliary.tabId,
			child: false
		};
		const childOwner = this.childSessions.get(sessionId);
		if (childOwner !== void 0) return {
			tabId: childOwner,
			child: true
		};
		return null;
	}
	tabByTargetId(targetId) {
		for (const [tabId, tab] of this.tabs) if (tab.attached?.targetId === targetId) return {
			tabId,
			tab
		};
		return null;
	}
	async handleCdpRequest(client, request) {
		try {
			if (request.sessionId) {
				if (this.browserSessions.get(request.sessionId) === client) {
					await this.handleBrowserScopedRequest(client, request);
					return;
				}
				await this.handleSessionScopedRequest(client, request);
				return;
			}
			await this.handleBrowserScopedRequest(client, request);
		} catch (err) {
			this.respondError(client, request, err instanceof Error ? err.message : String(err));
		}
	}
	async handleSessionScopedRequest(client, request) {
		const sessionId = request.sessionId;
		const auxiliary = this.auxiliaryTabSessions.get(sessionId);
		if (auxiliary && auxiliary.client !== client) {
			this.respondError(client, request, `Session not found: ${sessionId}`, -32001);
			return;
		}
		const route = this.tabBySessionId(sessionId);
		if (!route) {
			this.respondError(client, request, `Session not found: ${sessionId}`, -32001);
			return;
		}
		const result = await this.callExtension({
			type: "cdp",
			tabId: route.tabId,
			...route.child ? { sessionId } : {},
			method: request.method,
			params: request.params
		});
		this.respond(client, request, result);
	}
	async handleBrowserScopedRequest(client, request) {
		switch (request.method) {
			case "Browser.getVersion": {
				const identity = this.extension?.identity;
				this.respond(client, request, {
					protocolVersion: "1.3",
					product: identity?.browserVersion ?? "Chrome/unknown",
					revision: "openclaw-extension-relay",
					userAgent: identity?.userAgent ?? "unknown",
					jsVersion: ""
				});
				return;
			}
			case "Browser.close":
				this.respond(client, request, {});
				client.socket.close(1e3, "Browser.close");
				return;
			case "Browser.setDownloadBehavior":
			case "Target.setDiscoverTargets":
				this.respond(client, request, {});
				return;
			case "Target.getTargetInfo": {
				const targetId = request.params?.targetId;
				if (!targetId || targetId === BROWSER_TARGET_ID) {
					this.respond(client, request, { targetInfo: {
						targetId: BROWSER_TARGET_ID,
						type: "browser",
						title: "OpenClaw Extension Relay",
						url: "",
						attached: true,
						canAccessOpener: false
					} });
					return;
				}
				const found = this.tabByTargetId(targetId);
				if (!found) {
					this.respondError(client, request, `No target with given id found: ${targetId}`, -32602);
					return;
				}
				this.respond(client, request, { targetInfo: this.targetInfoForTab(found.tab, targetId) });
				return;
			}
			case "Target.getTargets": {
				const targetInfos = [...this.tabs.values()].filter((tab) => tab.attached).map((tab) => this.targetInfoForTab(tab, tab.attached?.targetId ?? ""));
				this.respond(client, request, { targetInfos });
				return;
			}
			case "Target.attachToBrowserTarget": {
				const sessionId = `openclaw-browser-${this.nextSessionOrdinal++}`;
				this.browserSessions.set(sessionId, client);
				this.respond(client, request, { sessionId });
				return;
			}
			case "Target.setAutoAttach": {
				const autoAttach = request.params?.autoAttach !== false;
				client.autoAttach = autoAttach;
				if (autoAttach) {
					const attachResults = await Promise.allSettled([...this.tabs.keys()].map(async (tabId) => {
						const { targetId, sessionId } = await this.ensureTabAttached(tabId);
						return {
							tabId,
							targetId,
							sessionId
						};
					}));
					for (const settled of attachResults) if (settled.status === "fulfilled") this.announceAttachedTab(settled.value.tabId, settled.value.targetId, settled.value.sessionId, {
						onlyAutoAttach: false,
						onlyClient: client
					});
					else log$2.warn(`setAutoAttach attach failed: ${String(settled.reason)}`);
				}
				this.respond(client, request, {});
				return;
			}
			case "Target.attachToTarget": {
				const targetId = request.params?.targetId;
				const found = targetId ? this.tabByTargetId(targetId) : null;
				if (!found && targetId) {
					this.respondError(client, request, `No target with given id found: ${targetId}`, -32602);
					return;
				}
				if (!found) {
					this.respondError(client, request, "targetId is required", -32602);
					return;
				}
				const attached = await this.ensureTabAttached(found.tabId);
				if (request.sessionId && this.browserSessions.get(request.sessionId) === client) {
					const sessionId = `openclaw-tab-${found.tabId}-${this.nextSessionOrdinal++}`;
					this.auxiliaryTabSessions.set(sessionId, {
						tabId: found.tabId,
						parentSessionId: request.sessionId,
						client
					});
					this.respond(client, request, { sessionId });
					return;
				}
				this.announceAttachedTab(found.tabId, attached.targetId, attached.sessionId, {
					onlyAutoAttach: false,
					onlyClient: client
				});
				this.respond(client, request, { sessionId: attached.sessionId });
				return;
			}
			case "Target.detachFromTarget": {
				const sessionId = request.params?.sessionId;
				if (sessionId && this.browserSessions.get(sessionId) === client) {
					this.browserSessions.delete(sessionId);
					for (const [auxiliarySessionId, auxiliary] of this.auxiliaryTabSessions) if (auxiliary.parentSessionId === sessionId && auxiliary.client === client) this.auxiliaryTabSessions.delete(auxiliarySessionId);
					this.respond(client, request, {});
					return;
				}
				const auxiliary = sessionId ? this.auxiliaryTabSessions.get(sessionId) : void 0;
				if (auxiliary?.client === client) {
					this.auxiliaryTabSessions.delete(sessionId);
					this.respond(client, request, {});
					return;
				}
				if (auxiliary) {
					this.respondError(client, request, `Session not found: ${String(sessionId)}`, -32001);
					return;
				}
				const route = sessionId ? this.tabBySessionId(sessionId) : null;
				if (route && !route.child) {
					const tab = this.tabs.get(route.tabId);
					if (tab?.attached) {
						const { sessionId: rootSession, targetId } = tab.attached;
						tab.attached = void 0;
						this.emitDetachedFromTarget(route.tabId, rootSession, targetId);
						await this.callExtension({
							type: "detach",
							tabId: route.tabId
						}).catch(() => {});
					}
				}
				this.respond(client, request, {});
				return;
			}
			case "Target.createTarget": {
				const url = typeof request.params?.url === "string" ? request.params.url : "about:blank";
				const command = {
					type: "createTab",
					url,
					...resolveCreateTargetParams(request.params)
				};
				const created = await this.callExtension(command);
				if (typeof created?.tabId !== "number") {
					this.respondError(client, request, "extension did not return a tabId for createTab");
					return;
				}
				const tabId = created.tabId;
				if (!this.tabs.has(tabId)) this.tabs.set(tabId, { info: {
					tabId,
					url,
					title: "",
					active: false
				} });
				const attached = await this.ensureTabAttached(tabId);
				this.announceAttachedTab(tabId, attached.targetId, attached.sessionId, { onlyAutoAttach: true });
				this.announceAttachedTab(tabId, attached.targetId, attached.sessionId, {
					onlyAutoAttach: false,
					onlyClient: client
				});
				this.respond(client, request, { targetId: attached.targetId });
				return;
			}
			case "Target.closeTarget": {
				const targetId = request.params?.targetId;
				const found = targetId ? this.tabByTargetId(targetId) : null;
				if (!found) {
					this.respondError(client, request, `No target with given id found: ${String(targetId)}`, -32602);
					return;
				}
				await this.callExtension({
					type: "closeTab",
					tabId: found.tabId
				});
				this.respond(client, request, { success: true });
				return;
			}
			case "Target.activateTarget": {
				const targetId = request.params?.targetId;
				const found = targetId ? this.tabByTargetId(targetId) : null;
				if (!found) {
					this.respondError(client, request, `No target with given id found: ${String(targetId)}`, -32602);
					return;
				}
				await this.callExtension({
					type: "activateTab",
					tabId: found.tabId
				});
				this.respond(client, request, {});
				return;
			}
			case "Target.getBrowserContexts":
				this.respond(client, request, { browserContextIds: [] });
				return;
			case "Target.createBrowserContext":
				this.respondError(client, request, "The OpenClaw extension relay drives the user's real browser profile; isolated browser contexts are not supported.");
				return;
			default: this.respondError(client, request, `'${request.method}' wasn't found`, -32601);
		}
	}
	/** Close all sockets and reject pending work (relay shutdown). */
	dispose() {
		this.stopPing();
		for (const pending of this.pendingExtension.values()) {
			clearTimeout(pending.timer);
			pending.reject(/* @__PURE__ */ new Error("extension relay stopped"));
		}
		this.pendingExtension.clear();
		for (const candidate of this.extensionCandidates) candidate.close(1001, "relay stopped");
		this.extensionCandidates.clear();
		this.extension?.socket.close(1001, "relay stopped");
		this.extension = null;
		for (const client of this.clients) client.socket.close(1001, "relay stopped");
		this.clients.clear();
		this.browserSessions.clear();
		this.auxiliaryTabSessions.clear();
		this.tabs.clear();
		this.childSessions.clear();
	}
};
//#endregion
//#region extensions/browser/src/browser/extension-relay/relay-request.ts
const LEGACY_EXTENSION_RELAY_PROTOCOL = "openclaw-extension-relay";
const LEGACY_EXTENSION_RELAY_TOKEN_PROTOCOL_PREFIX = "openclaw-extension-token.";
function firstHeader(value) {
	return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}
function requestProtocols(req) {
	return firstHeader(req.headers["sec-websocket-protocol"]).split(",").map((value) => value.trim()).filter(Boolean);
}
function requestExtensionProtocolToken(req) {
	const protocols = requestProtocols(req);
	if (!protocols.includes("openclaw-extension-relay")) return "";
	return protocols.find((value) => value.startsWith(LEGACY_EXTENSION_RELAY_TOKEN_PROTOCOL_PREFIX))?.slice(25) ?? "";
}
function isAllowedExtensionOrigin(req) {
	const origin = firstHeader(req.headers.origin);
	return origin === "" || origin.startsWith("chrome-extension://");
}
//#endregion
//#region extensions/browser/src/browser/extension-relay/relay-server.ts
/** Loopback extension relay with connection-bound Browser Relay Authentication v2. */
const log$1 = createSubsystemLogger("browser").child("extension-relay");
const INTERNAL_CDP_USERNAME = "openclaw-internal";
const MAX_AUTH_BODY_BYTES = 8 * 1024;
const EXTENSION_RELAY_MAX_PAYLOAD_BYTES = 64 * 1024 * 1024;
function decodeBasic(req) {
	const auth = firstHeader(req.headers.authorization);
	if (!auth.startsWith("Basic ")) return null;
	try {
		const decoded = Buffer.from(auth.slice(6), "base64").toString("utf8");
		const separator = decoded.indexOf(":");
		return separator < 0 ? {
			username: "",
			password: decoded
		} : {
			username: decoded.slice(0, separator),
			password: decoded.slice(separator + 1)
		};
	} catch {
		return null;
	}
}
function isAuthorizedInternal(req, internalToken) {
	const basic = decodeBasic(req);
	return basic?.username === INTERNAL_CDP_USERNAME && safeEqualSecret(internalToken, basic.password);
}
function isAuthorizedLegacy(req, token, allowLegacyAuth) {
	if (!allowLegacyAuth) return false;
	const auth = firstHeader(req.headers.authorization);
	if (auth.startsWith("Bearer ") && safeEqualSecret(token, auth.slice(7).trim())) return true;
	const basic = decodeBasic(req);
	if (basic && safeEqualSecret(token, basic.password)) return true;
	const protocolToken = requestExtensionProtocolToken(req);
	return protocolToken.length > 0 && safeEqualSecret(token, protocolToken);
}
function hasLoopbackHostHeader(req) {
	const host = firstHeader(req.headers.host);
	if (!host) return true;
	try {
		return isLoopbackHost(new URL(`http://${host}`).hostname);
	} catch {
		return false;
	}
}
function destroySocket(socket, response) {
	try {
		socket.write(response);
	} finally {
		socket.destroy();
	}
}
function writeJson(res, status, value, headers = {}) {
	const body = JSON.stringify(value);
	res.writeHead(status, {
		"Content-Type": "application/json",
		"Content-Length": String(Buffer.byteLength(body)),
		...headers
	});
	res.end(body);
}
function rejectHttp(res, status, message) {
	res.once("finish", () => res.socket?.destroy());
	writeJson(res, status, { error: message }, { Connection: "close" });
}
async function readAuthBody(req) {
	let body = "";
	for await (const chunk of req) {
		body += Buffer.isBuffer(chunk) ? chunk.toString("utf8") : String(chunk);
		if (Buffer.byteLength(body) > MAX_AUTH_BODY_BYTES) return null;
	}
	return body;
}
function bindSocket(ws, handlers) {
	ws.on("message", (data) => handlers.onMessage(rawDataToString(data)));
	ws.on("close", handlers.onClose);
	ws.on("error", (err) => log$1.warn(`relay socket error: ${String(err)}`));
}
function trackAuthenticatedSocket(authority, ws) {
	if (!authority.registerAuthenticatedConnection(ws, () => ws.close(4003, "browser relay key rotated"))) {
		ws.terminate();
		return false;
	}
	ws.once("close", () => authority.releaseConnection(ws));
	return true;
}
/** Wire an already-v2-authenticated extension socket to the bridge. */
function attachExtensionWebSocket(bridge, ws) {
	const handlers = bridge.attachExtensionSocket(ws);
	let helloSeen = false;
	const helloTimer = setTimeout(() => {
		ws.close(4008, "extension hello timeout");
		ws.terminate();
	}, BROWSER_RELAY_CHALLENGE_TTL_MS);
	helloTimer.unref?.();
	bindSocket(ws, {
		onMessage: (raw) => {
			if (!helloSeen && parseExtensionMessage(raw)?.type === "hello") {
				helloSeen = true;
				clearTimeout(helloTimer);
			}
			handlers.onMessage(raw);
		},
		onClose: () => {
			clearTimeout(helloTimer);
			handlers.onClose();
		}
	});
}
function authenticateExtensionWebSocket(params) {
	const { ws, authority } = params;
	let stage = "hello";
	let preAuthGuardActive = true;
	const removePreAuthGuard = () => {
		if (!preAuthGuardActive) return;
		preAuthGuardActive = false;
		params.removePreAuthGuard?.();
	};
	const timer = setTimeout(() => {
		stage = "failed";
		ws.off("message", onMessage);
		ws.close(4008, "browser relay auth timeout");
		ws.terminate();
	}, BROWSER_RELAY_CHALLENGE_TTL_MS);
	timer.unref?.();
	const release = () => {
		clearTimeout(timer);
		removePreAuthGuard();
		authority.releaseConnection(ws);
	};
	if (!authority.registerPendingConnection(ws, () => {
		ws.close(4003, "browser relay key rotated");
	})) {
		clearTimeout(timer);
		ws.close(4013, "browser relay auth capacity reached");
		return;
	}
	ws.once("close", release);
	const fail = (code, reason) => {
		if (stage === "failed") return;
		stage = "failed";
		clearTimeout(timer);
		ws.off("message", onMessage);
		ws.close(code, reason);
		setTimeout(() => ws.terminate(), 100).unref?.();
	};
	const onMessage = (data, isBinary) => {
		if (isBinary) {
			fail(4003, "binary browser relay auth frames are not allowed");
			return;
		}
		if (boundedRawDataByteLength(data, 16384) > 16384) {
			fail(4003, "browser relay auth frame is too large");
			return;
		}
		const parsed = parseStrictJsonObject(rawDataToString(data));
		if (stage === "hello") {
			const hello = parseRelayAuthHello(parsed);
			if (!hello) {
				fail(4003, "invalid browser relay auth hello");
				return;
			}
			const challenge = authority.issueChallenge(ws, hello, {
				role: "extension",
				transport: "websocket",
				method: "GET",
				resource: params.resource,
				flow: "extension"
			});
			if (!challenge) {
				fail(4003, "browser relay auth rejected");
				return;
			}
			stage = "response";
			ws.send(JSON.stringify(challenge));
			return;
		}
		if (stage === "response") {
			const response = parseRelayAuthResponse(parsed);
			if (!response) {
				fail(4003, "invalid browser relay auth response");
				return;
			}
			const completed = authority.completeChallenge(ws, response);
			if (!completed) {
				fail(4003, "browser relay auth proof failed");
				return;
			}
			stage = "authenticated";
			clearTimeout(timer);
			removePreAuthGuard();
			params.prepareAuthenticated().then((attach) => {
				if (ws.readyState !== 1) return;
				ws.off("message", onMessage);
				attach();
				ws.send(JSON.stringify(completed.ok), (err) => {
					if (err) ws.close(1011, "browser relay auth acknowledgement failed");
				});
			}).catch((err) => {
				log$1.warn(`browser relay post-auth preparation failed: ${String(err)}`);
				fail(1011, "browser relay unavailable after authentication");
			});
			return;
		}
		fail(4003, "unexpected browser relay auth frame");
	};
	ws.on("message", onMessage);
}
async function startExtensionRelayServer(params) {
	const allowLegacyAuth = params.allowLegacyAuth ?? true;
	const internalToken = crypto.randomBytes(32).toString("base64url");
	if (readExtensionRelayToken() === params.token) getBrowserRelayAuthV2Authority(params.token);
	const bridge = new ExtensionRelayBridge({ onStateChange: params.onStateChange });
	const wss = new WebSocketServer({
		noServer: true,
		maxPayload: EXTENSION_RELAY_MAX_PAYLOAD_BYTES
	});
	const httpStates = /* @__PURE__ */ new WeakMap();
	const socketAuthorities = /* @__PURE__ */ new WeakMap();
	const authSockets = /* @__PURE__ */ new Set();
	const currentAuthority = () => {
		const liveToken = readExtensionRelayToken();
		if (!liveToken) {
			invalidateBrowserRelayAuthV2Authority();
			return null;
		}
		return getBrowserRelayAuthV2Authority(liveToken);
	};
	const clearSocketState = (socket) => {
		const state = httpStates.get(socket);
		if (state && "timer" in state) clearTimeout(state.timer);
		httpStates.delete(socket);
		authSockets.delete(socket);
		const authority = socketAuthorities.get(socket);
		socketAuthorities.delete(socket);
		authority?.releaseConnection(socket);
	};
	const armSocketTimer = (socket) => {
		const timer = setTimeout(() => socket.destroy(), BROWSER_RELAY_CHALLENGE_TTL_MS);
		timer.unref?.();
		return timer;
	};
	const registerHttpSocket = (socket, authority) => {
		if (authSockets.has(socket)) return true;
		if (!authority.registerPendingConnection(socket, () => socket.destroy())) return false;
		authSockets.add(socket);
		socketAuthorities.set(socket, authority);
		socket.once("close", () => clearSocketState(socket));
		return true;
	};
	const versionPayload = () => ({
		Browser: bridge.identity?.browserVersion ?? "Chrome/unknown",
		"Protocol-Version": "1.3",
		"User-Agent": bridge.identity?.userAgent ?? "unknown",
		webSocketDebuggerUrl: `ws://127.0.0.1:${resolvedPort()}/cdp`
	});
	const server = http.createServer((req, res) => {
		(async () => {
			if (!hasLoopbackHostHeader(req)) {
				rejectHttp(res, 403, "Forbidden");
				return;
			}
			const path = (req.url ?? "/").split("?")[0];
			const socket = req.socket;
			const existingState = httpStates.get(socket);
			const authority = currentAuthority();
			if (path === "/_openclaw/relay/auth/v2/challenge") {
				if (req.url !== "/_openclaw/relay/auth/v2/challenge" || req.method !== "POST" || existingState || !authority || !registerHttpSocket(socket, authority)) {
					rejectHttp(res, existingState ? 409 : 400, "Invalid relay auth sequence");
					return;
				}
				const pending = { stage: "busy" };
				httpStates.set(socket, pending);
				const raw = await readAuthBody(req);
				const request = raw === null ? null : parseRelayHttpChallengeRequest(parseStrictJsonObject(raw));
				if (!request || request.keyId !== authority.keyId) {
					clearSocketState(socket);
					rejectHttp(res, 400, "Invalid relay auth challenge request");
					return;
				}
				const challenge = authority.issueChallenge(socket, {
					type: "auth.hello",
					v: 2,
					keyId: request.keyId,
					clientNonce: request.clientNonce
				}, {
					role: request.role,
					transport: request.transport,
					method: request.method,
					resource: request.resource,
					flow: request.flow
				});
				if (!challenge) {
					clearSocketState(socket);
					rejectHttp(res, 401, "Relay auth challenge rejected");
					return;
				}
				res.once("finish", () => {
					if (!socket.destroyed && httpStates.get(socket) === pending) httpStates.set(socket, {
						stage: "challenged",
						flow: request.flow,
						authority,
						timer: armSocketTimer(socket)
					});
				});
				writeJson(res, 200, challenge);
				return;
			}
			if (path === "/_openclaw/relay/auth/v2/complete") {
				if (req.url !== "/_openclaw/relay/auth/v2/complete" || req.method !== "POST" || existingState?.stage !== "challenged") {
					rejectHttp(res, 409, "Invalid relay auth sequence");
					return;
				}
				clearTimeout(existingState.timer);
				const pending = { stage: "busy" };
				httpStates.set(socket, pending);
				const raw = await readAuthBody(req);
				const request = raw === null ? null : parseRelayHttpCompleteRequest(parseStrictJsonObject(raw));
				const completed = request ? existingState.authority.completeChallenge(socket, {
					type: "auth.response",
					...request
				}) : null;
				if (!completed) {
					clearSocketState(socket);
					rejectHttp(res, 401, "Relay auth proof failed");
					return;
				}
				res.once("finish", () => {
					if (!socket.destroyed && httpStates.get(socket) === pending) httpStates.set(socket, {
						stage: "authenticated",
						flow: existingState.flow,
						authority: existingState.authority,
						timer: armSocketTimer(socket)
					});
				});
				writeJson(res, 200, completed.ok);
				return;
			}
			if (existingState?.stage === "authenticated") {
				clearTimeout(existingState.timer);
				const pending = { stage: "busy" };
				httpStates.set(socket, pending);
				if (existingState.flow === "cdp" && req.method === "GET" && req.url === "/json/version") {
					if (!bridge.extensionConnected) {
						clearSocketState(socket);
						rejectHttp(res, 503, "OpenClaw Chrome extension is not connected");
						return;
					}
					res.once("finish", () => {
						if (!socket.destroyed && httpStates.get(socket) === pending) httpStates.set(socket, {
							stage: "awaiting-upgrade",
							authority: existingState.authority,
							timer: armSocketTimer(socket)
						});
					});
					writeJson(res, 200, versionPayload());
					return;
				}
				if (existingState.flow === "json-list" && req.method === "GET" && req.url === "/json/list") {
					clearSocketState(socket);
					res.once("finish", () => socket.destroy());
					writeJson(res, 200, bridge.devtoolsTargetDescriptors(), { Connection: "close" });
					return;
				}
				clearSocketState(socket);
				rejectHttp(res, 409, "Invalid relay auth sequence");
				return;
			}
			if (existingState) {
				clearSocketState(socket);
				rejectHttp(res, 409, "Invalid relay auth sequence");
				return;
			}
			if (!(isAuthorizedInternal(req, internalToken) || authority !== null && isAuthorizedLegacy(req, readExtensionRelayToken() ?? "", allowLegacyAuth))) {
				rejectHttp(res, 401, "Unauthorized");
				return;
			}
			if (req.method === "GET" && (path === "/json/version" || path === "/json/version/")) {
				if (!bridge.extensionConnected) {
					writeJson(res, 503, { error: "OpenClaw Chrome extension is not connected. Install the extension and pair it with `openclaw browser extension pair`." });
					return;
				}
				writeJson(res, 200, versionPayload());
				return;
			}
			if (req.method === "GET" && (path === "/json" || path === "/json/list")) {
				writeJson(res, 200, bridge.devtoolsTargetDescriptors());
				return;
			}
			rejectHttp(res, 404, "Not found");
		})().catch((err) => {
			log$1.warn(`relay HTTP request failed: ${String(err)}`);
			if (!res.headersSent) rejectHttp(res, 500, "Relay request failed");
			else res.destroy();
		});
	});
	server.on("upgrade", (req, socket, head) => {
		const path = (req.url ?? "/").split("?")[0];
		if (!hasLoopbackHostHeader(req)) {
			destroySocket(socket, "HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n");
			return;
		}
		if (path === "/extension") {
			if (!isAllowedExtensionOrigin(req)) {
				destroySocket(socket, "HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n");
				return;
			}
			const protocols = requestProtocols(req);
			const resource = parseExtensionRelayResource(req.url ?? "/", "/extension");
			if (protocols.length === 1 && protocols[0] === "openclaw-extension-relay.v2" && resource) {
				const authority = currentAuthority();
				if (!authority) {
					destroySocket(socket, "HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n");
					return;
				}
				if (!handlePreAuthWebSocketUpgrade({
					wss,
					req,
					socket,
					head,
					onUpgrade: (ws, removePreAuthGuard) => {
						authenticateExtensionWebSocket({
							ws,
							authority,
							resource,
							removePreAuthGuard,
							prepareAuthenticated: async () => () => {
								attachExtensionWebSocket(bridge, ws);
								log$1.info("extension authenticated and connected to relay");
							}
						});
					}
				})) destroySocket(socket, "HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n");
				return;
			}
			if (protocols.includes("openclaw-extension-relay.v2")) {
				destroySocket(socket, "HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n");
				return;
			}
			const liveToken = readExtensionRelayToken();
			if (!liveToken || !isAuthorizedLegacy(req, liveToken, allowLegacyAuth)) {
				destroySocket(socket, "HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n");
				return;
			}
			const authority = getBrowserRelayAuthV2Authority(liveToken);
			wss.handleUpgrade(req, socket, head, (ws) => {
				if (!trackAuthenticatedSocket(authority, ws)) return;
				attachExtensionWebSocket(bridge, ws);
				log$1.warn("legacy extension relay authentication accepted");
			});
			return;
		}
		if (path === "/cdp") {
			const state = httpStates.get(socket);
			if (req.url === "/cdp" && state?.stage === "awaiting-upgrade") {
				clearTimeout(state.timer);
				httpStates.delete(socket);
				wss.handleUpgrade(req, socket, head, (ws) => bindSocket(ws, bridge.attachCdpClientSocket(ws)));
				return;
			}
			if (!isAuthorizedInternal(req, internalToken) && !isAuthorizedLegacy(req, readExtensionRelayToken() ?? "", allowLegacyAuth)) {
				destroySocket(socket, "HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n");
				return;
			}
			const authority = currentAuthority();
			if (!authority) {
				destroySocket(socket, "HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n");
				return;
			}
			wss.handleUpgrade(req, socket, head, (ws) => trackAuthenticatedSocket(authority, ws) ? bindSocket(ws, bridge.attachCdpClientSocket(ws)) : void 0);
			return;
		}
		destroySocket(socket, "HTTP/1.1 404 Not Found\r\nConnection: close\r\n\r\n");
	});
	await new Promise((resolve, reject) => {
		server.once("error", reject);
		server.listen(params.port, "127.0.0.1", () => resolve());
	});
	const resolvedPort = () => {
		const address = server.address();
		return typeof address === "object" && address ? address.port : params.port;
	};
	return {
		port: resolvedPort(),
		token: params.token,
		allowLegacyAuth,
		internalToken,
		bridge,
		close: async () => {
			for (const socket of authSockets) {
				clearSocketState(socket);
				socket.destroy();
			}
			for (const client of wss.clients) client.terminate();
			bridge.dispose();
			wss.close();
			await new Promise((resolve) => {
				server.close(() => resolve());
			});
		}
	};
}
//#endregion
//#region extensions/browser/src/browser/extension-relay/relay-lifecycle.ts
/**
* Extension relay lifecycle: one relay server per extension-driver profile,
* owned by the browser control runtime state.
*/
const log = createSubsystemLogger("browser").child("extension-relay");
const pendingRelayEnsures = /* @__PURE__ */ new WeakMap();
/** Human guidance for a relay without a paired/connected extension. */
const EXTENSION_PAIRING_HINT = "Run `openclaw browser extension install`, load the printed unpacked directory once, and wait for automatic setup.";
function relays(state) {
	if (!state.extensionRelays) state.extensionRelays = /* @__PURE__ */ new Map();
	return state.extensionRelays;
}
function applyInternalRelayToken(state, profileName, internalToken) {
	const tokens = { ...state.resolved.extensionRelayInternalTokens };
	if (internalToken) tokens[profileName] = internalToken;
	else delete tokens[profileName];
	state.resolved = {
		...state.resolved,
		extensionRelayInternalTokens: tokens
	};
	const resolved = resolveProfile(state.resolved, profileName);
	const runtime = state.profiles.get(profileName);
	if (resolved?.driver === "extension" && runtime?.profile.driver === "extension") Object.assign(runtime.profile, resolved);
	return resolved;
}
/**
* Start the relay server for one extension-driver profile, reconciling any
* existing one. Idempotency is keyed on profile name, but the desired (port,
* token) can drift when the host-local relay secret is rotated or the profile's
* cdpPort changes — a stale relay would then authenticate the extension against
* the old token or listen on the wrong port. When the desired config differs,
* the old relay is closed and a fresh one bound.
*/
async function ensureExtensionRelayForProfile(state, profile) {
	for (;;) {
		if (!isBrowserRuntimeRunning(state)) throw new Error("Browser runtime is stopping");
		const { ensureExtensionRelayToken, readExtensionRelayToken } = await import("./relay-auth-D5zH-VS5.js");
		const token = readExtensionRelayToken() ?? await ensureExtensionRelayToken();
		if (state.resolved.extensionRelayToken !== token) state.resolved = {
			...state.resolved,
			extensionRelayToken: token
		};
		const desiredProfile = resolveProfile(state.resolved, profile.name);
		if (profile.driver !== "extension" || desiredProfile?.driver !== "extension" || desiredProfile.cdpPort !== profile.cdpPort) throw new Error(`Extension relay profile "${profile.name}" changed during startup.`);
		Object.assign(profile, desiredProfile);
		const runtime = getOrCreateProfileRuntime(state, desiredProfile);
		if (runtime.profile !== profile && runtime.profile.driver === "extension" && runtime.profile.cdpPort === desiredProfile.cdpPort) Object.assign(runtime.profile, desiredProfile);
		const pending = pendingRelayEnsures.get(runtime);
		if (pending) {
			if (pending.port === desiredProfile.cdpPort && pending.token === token && pending.allowLegacyAuth === state.resolved.extensionRelay.allowLegacyAuth) {
				const handle = await pending.promise;
				const current = resolveProfile(state.resolved, profile.name);
				if (current) Object.assign(profile, current);
				return handle;
			}
			try {
				await pending.promise;
			} catch (err) {
				if (getProfileLifecycle(runtime).blockedReason) throw err;
			}
			continue;
		}
		const promise = ensureDesiredRelay({
			state,
			runtime,
			profile: desiredProfile,
			token
		});
		const owned = {
			port: desiredProfile.cdpPort,
			token,
			allowLegacyAuth: state.resolved.extensionRelay.allowLegacyAuth,
			promise
		};
		pendingRelayEnsures.set(runtime, owned);
		try {
			const handle = await promise;
			const current = resolveProfile(state.resolved, profile.name);
			if (current) Object.assign(profile, current);
			return handle;
		} finally {
			if (pendingRelayEnsures.get(runtime) === owned) pendingRelayEnsures.delete(runtime);
		}
	}
}
async function ensureDesiredRelay(params) {
	const { state, runtime, profile, token } = params;
	return await withProfileOperationLease({
		state,
		runtime,
		configRevision: getProfileLifecycle(runtime).configRevision,
		run: async (signal) => {
			const map = relays(state);
			const actor = getProfileLifecycle(runtime);
			const existing = map.get(profile.name);
			if (existing) {
				if (existing.port === profile.cdpPort && existing.token === token && existing.allowLegacyAuth === state.resolved.extensionRelay.allowLegacyAuth) {
					const current = applyInternalRelayToken(state, profile.name, existing.internalToken);
					if (current) Object.assign(profile, current);
					return existing;
				}
				actor.cleanupRelays.add(existing);
				await existing.close();
				actor.cleanupRelays.delete(existing);
				if (map.get(profile.name) === existing) map.delete(profile.name);
				applyInternalRelayToken(state, profile.name, null);
			}
			let handle;
			try {
				handle = await startExtensionRelayServer({
					port: profile.cdpPort,
					token,
					allowLegacyAuth: state.resolved.extensionRelay.allowLegacyAuth
				});
				actor.cleanupRelays.add(handle);
				signal.throwIfAborted();
				const currentProfile = resolveProfile(state.resolved, profile.name);
				if (state.profiles.get(profile.name) !== runtime || currentProfile?.driver !== "extension" || currentProfile.cdpPort !== profile.cdpPort || state.resolved.extensionRelayToken !== token) throw new Error(`Extension relay profile "${profile.name}" changed during startup.`);
				map.set(profile.name, handle);
				const currentWithInternalAuth = applyInternalRelayToken(state, profile.name, handle.internalToken);
				if (!currentWithInternalAuth) throw new Error(`Extension relay profile "${profile.name}" disappeared during startup.`);
				Object.assign(profile, currentWithInternalAuth);
				actor.cleanupRelays.delete(handle);
				log.info(`extension relay for profile "${profile.name}" listening on 127.0.0.1:${handle.port}`);
				return handle;
			} catch (err) {
				if (handle) try {
					await handle.close();
					actor.cleanupRelays.delete(handle);
				} catch (closeError) {
					actor.blockedReason = "extension relay cleanup failed";
					throw closeError;
				}
				throw err;
			}
		}
	});
}
/** Start relays for every extension-driver profile (control service startup). */
async function startConfiguredExtensionRelays(state, resolveProfileByName, onWarn) {
	for (const [name, profile] of Object.entries(state.resolved.profiles)) {
		if (profile.driver !== "extension") continue;
		const resolved = resolveProfileByName(name);
		if (!resolved) continue;
		try {
			await ensureExtensionRelayForProfile(state, resolved);
		} catch (err) {
			onWarn(`extension relay for profile "${name}" failed to start: ${String(err)}`);
		}
	}
}
/** Stop every running relay (runtime shutdown). */
async function stopExtensionRelays(state) {
	const map = state.extensionRelays;
	if (!map) return;
	let firstError;
	for (const [name, handle] of map) try {
		await handle.close();
		if (map.get(name) === handle) map.delete(name);
		applyInternalRelayToken(state, name, null);
	} catch (err) {
		log.warn(`extension relay for profile "${name}" failed to stop: ${String(err)}`);
		firstError ??= err instanceof Error ? err : new Error("Extension relay cleanup failed.", { cause: err });
	}
	if (firstError) throw firstError;
}
//#endregion
export { EXTENSION_RELAY_MAX_PAYLOAD_BYTES as a, LEGACY_EXTENSION_RELAY_PROTOCOL as c, requestProtocols as d, handlePreAuthWebSocketUpgrade as f, stopExtensionRelays as i, isAllowedExtensionOrigin as l, ensureExtensionRelayForProfile as n, attachExtensionWebSocket as o, startConfiguredExtensionRelays as r, authenticateExtensionWebSocket as s, EXTENSION_PAIRING_HINT as t, requestExtensionProtocolToken as u };
