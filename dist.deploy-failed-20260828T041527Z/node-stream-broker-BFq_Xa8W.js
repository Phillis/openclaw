import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { i as registerSecretValueForRedaction } from "./secret-redaction-registry-gIFE-2_j.js";
import { r as NODE_PORTAL_ATTACH_PATH, t as NODE_DESKTOP_ATTACH_PATH } from "./node-desktop-stream-BZM2AiRA.js";
import crypto from "node:crypto";
import { WebSocketServer, createWebSocketStream } from "ws";
//#region src/gateway/desktop/node-stream-broker.ts
const DEFAULT_TICKET_TTL_MS = 6e4;
const TICKET_PATTERN = /^[a-f0-9]{48}$/u;
const MAX_ATTACH_FRAME_BYTES = 64 * 1024;
function rawDataBuffer(data) {
	if (Buffer.isBuffer(data)) return data;
	if (Array.isArray(data)) return Buffer.concat(data);
	return Buffer.from(data);
}
function parseStreamMetadata(data, isBinary, kind) {
	const buffer = rawDataBuffer(data);
	if (!isBinary || buffer.length === 0 || buffer.length > MAX_ATTACH_FRAME_BYTES) throw new Error(`invalid node ${kind} attach metadata`);
	let value;
	try {
		value = JSON.parse(buffer.toString("utf8"));
	} catch {
		throw new Error(`invalid node ${kind} attach metadata`);
	}
	if (kind === "portal") {
		if (!isRecord(value) || value.ok !== true || Object.keys(value).length !== 1) throw new Error("invalid node portal attach metadata");
		return;
	}
	if (!isRecord(value) || value.auth !== "vnc-password" && value.auth !== "ard-account") throw new Error("invalid node desktop attach metadata");
	if (Object.keys(value).some((key) => key !== "auth" && key !== "vncPassword")) throw new Error("invalid node desktop attach metadata");
	if (value.vncPassword !== void 0 && typeof value.vncPassword !== "string") throw new Error("invalid node desktop attach metadata");
	if (value.auth === "ard-account" && value.vncPassword !== void 0) throw new Error("invalid node desktop attach metadata");
	const vncPassword = typeof value.vncPassword === "string" ? value.vncPassword : void 0;
	if (vncPassword) registerSecretValueForRedaction(vncPassword);
	return {
		auth: value.auth,
		...vncPassword ? { vncPassword } : {}
	};
}
function writeUnauthorized(socket) {
	socket.write("HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n");
	socket.destroy();
}
function readAttachedStream(ws, kind, onStreamError) {
	return new Promise((resolve, reject) => {
		const cleanup = () => {
			ws.off("message", onMessage);
			ws.off("close", onClose);
		};
		const onMessage = (data, isBinary) => {
			cleanup();
			try {
				const metadata = parseStreamMetadata(data, isBinary, kind);
				const stream = createWebSocketStream(ws, { allowHalfOpen: false });
				stream.on("error", onStreamError);
				resolve({
					metadata,
					stream
				});
			} catch (error) {
				reject(error instanceof Error ? error : new Error(String(error)));
			}
		};
		const onClose = () => {
			cleanup();
			reject(/* @__PURE__ */ new Error(`node ${kind} stream closed before attach`));
		};
		const onError = (error) => {
			cleanup();
			onStreamError(error);
			reject(error);
		};
		ws.once("message", onMessage);
		ws.once("close", onClose);
		ws.on("error", onError);
	});
}
/** Owns one-time node stream tickets and pairs authenticated desktop or portal duplexes. */
function createNodeDesktopStreamBroker(deps = {}) {
	const ttlMs = deps.ttlMs ?? DEFAULT_TICKET_TTL_MS;
	const now = deps.now ?? Date.now;
	const tickets = /* @__PURE__ */ new Map();
	const wss = new WebSocketServer({
		noServer: true,
		maxPayload: MAX_ATTACH_FRAME_BYTES
	});
	const remove = (ticket) => {
		const entry = tickets.get(ticket);
		if (!entry) return;
		tickets.delete(ticket);
		clearTimeout(entry.timer);
		return entry;
	};
	const rejectTicket = (ticket, error) => {
		const entry = remove(ticket);
		if (!entry || entry.settled) return;
		entry.settled = true;
		entry.reject(error);
		entry.ws?.close(1008, `node ${entry.kind} attach rejected`);
		entry.socket?.destroy();
	};
	const resolveTicket = (ticket, stream, metadata) => {
		const entry = remove(ticket);
		if (!entry || entry.settled) {
			stream.destroy();
			return;
		}
		entry.settled = true;
		entry.resolve(stream, metadata);
	};
	function mintStream(binding, kind, attach) {
		const ticket = crypto.randomBytes(24).toString("hex");
		const expiresAtMs = now() + ttlMs;
		let resolve;
		let reject;
		const attached = new Promise((resolvePromise, rejectPromise) => {
			resolve = (stream, metadata) => {
				try {
					resolvePromise(attach(stream, metadata));
				} catch (error) {
					stream.destroy();
					rejectPromise(error instanceof Error ? error : new Error(String(error)));
				}
			};
			reject = rejectPromise;
		});
		attached.catch(() => void 0);
		const timer = setTimeout(() => {
			rejectTicket(ticket, /* @__PURE__ */ new Error(`node ${kind} stream ticket expired`));
		}, ttlMs);
		timer.unref?.();
		tickets.set(ticket, {
			kind,
			binding,
			expiresAtMs,
			resolve,
			reject,
			timer,
			redeemed: false,
			settled: false
		});
		return {
			ticket,
			attachPath: `${kind === "desktop" ? NODE_DESKTOP_ATTACH_PATH : NODE_PORTAL_ATTACH_PATH}?ticket=${ticket}`,
			expiresAtMs,
			attached,
			cancel() {
				rejectTicket(ticket, /* @__PURE__ */ new Error(`node ${kind} stream ticket cancelled`));
			}
		};
	}
	function mint(binding) {
		return mintStream(binding, "desktop", (stream, metadata) => {
			if (!metadata) throw new Error("invalid node desktop attach metadata");
			return {
				...metadata,
				stream
			};
		});
	}
	function mintPortal(binding) {
		return mintStream(binding, "portal", (stream) => ({ stream }));
	}
	const bindingIsCurrent = async (registry, binding) => {
		const current = registry.getForPairingGeneration(binding.nodeId, binding.pairingGeneration);
		if (!current || current.connId !== binding.connId) return false;
		if (!await registry.isConnectionCurrentPairingState(binding.connId)) return false;
		return registry.getForPairingGeneration(binding.nodeId, binding.pairingGeneration)?.connId === binding.connId;
	};
	async function handleUpgrade(req, socket, head, registry) {
		const resource = new URL(req.url ?? "/", "http://127.0.0.1");
		const kind = resource.pathname === "/node-desktop/attach" ? "desktop" : resource.pathname === "/node-portal/attach" ? "portal" : void 0;
		if (!kind) return false;
		const ticket = (resource.searchParams.get("ticket") ?? "").trim();
		if (!TICKET_PATTERN.test(ticket)) {
			writeUnauthorized(socket);
			return true;
		}
		const entry = tickets.get(ticket);
		if (!entry || entry.kind !== kind || entry.redeemed || entry.expiresAtMs <= now()) {
			writeUnauthorized(socket);
			if (entry && entry.kind === kind && !entry.redeemed) rejectTicket(ticket, /* @__PURE__ */ new Error(`node ${kind} stream ticket expired`));
			return true;
		}
		entry.redeemed = true;
		entry.socket = socket;
		const onSocketError = (error) => rejectTicket(ticket, error);
		const onSocketClose = () => rejectTicket(ticket, /* @__PURE__ */ new Error(`node ${kind} attach closed during authorization`));
		socket.once("error", onSocketError);
		socket.once("end", onSocketClose);
		socket.once("close", onSocketClose);
		let current;
		try {
			current = await bindingIsCurrent(registry, entry.binding);
		} catch {
			current = false;
		}
		if (entry.settled) return true;
		if (!current) {
			socket.off("error", onSocketError);
			socket.off("end", onSocketClose);
			socket.off("close", onSocketClose);
			writeUnauthorized(socket);
			rejectTicket(ticket, /* @__PURE__ */ new Error(`node ${kind} stream ticket binding is stale`));
			return true;
		}
		socket.off("error", onSocketError);
		socket.off("end", onSocketClose);
		socket.off("close", onSocketClose);
		try {
			wss.handleUpgrade(req, socket, head, (ws) => {
				entry.socket = void 0;
				entry.ws = ws;
				const attached = readAttachedStream(ws, kind, (error) => rejectTicket(ticket, error));
				(async () => {
					try {
						const resolved = await attached;
						if (!await bindingIsCurrent(registry, entry.binding)) throw new Error(`node ${kind} stream ticket binding is stale`);
						resolveTicket(ticket, resolved.stream, resolved.metadata);
					} catch (error) {
						rejectTicket(ticket, error instanceof Error ? error : new Error(String(error)));
					}
				})();
			});
		} catch (error) {
			rejectTicket(ticket, error instanceof Error ? error : new Error(String(error)));
		}
		return true;
	}
	return {
		mint,
		mintPortal,
		handleUpgrade
	};
}
//#endregion
export { createNodeDesktopStreamBroker };
