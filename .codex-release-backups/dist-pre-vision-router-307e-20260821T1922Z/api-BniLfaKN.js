import { c as isRecord, t as asNonArrayRecord } from "./record-coerce-DItp3I4t.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import "./runtime-env-COkbgBI4.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./channel-secret-basic-runtime-uhDHsA4U.js";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import net from "node:net";
//#region extensions/linux-canvas/src/ipc-client.ts
const DEFAULT_REQUEST_TIMEOUT_MS = 3e4;
const MAX_FRAME_BYTES = 32 * 1024 * 1024;
function canvasUnavailable(message = "desktop app not running") {
	return /* @__PURE__ */ new Error(`CANVAS_UNAVAILABLE: ${message}`);
}
function parseFrame(line) {
	try {
		return JSON.parse(line);
	} catch {
		return;
	}
}
var LinuxCanvasIpcClient = class {
	constructor(socketPath, timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS) {
		this.socketPath = socketPath;
		this.timeoutMs = timeoutMs;
		this.closed = false;
		this.buffer = "";
		this.bufferBytes = 0;
		this.pending = /* @__PURE__ */ new Map();
		this.requestTail = Promise.resolve();
	}
	setActionHandler(handler) {
		this.actionHandler = handler;
	}
	request(command, paramsJSON, hooks) {
		if (this.closed) return Promise.reject(canvasUnavailable("node host is shutting down"));
		const request = this.requestTail.then(() => this.sendRequest(command, paramsJSON, hooks), () => this.sendRequest(command, paramsJSON, hooks));
		this.requestTail = request.then(() => void 0, () => void 0);
		return request;
	}
	async sendRequest(command, paramsJSON, hooks) {
		if (this.closed) throw canvasUnavailable("node host is shutting down");
		const socket = await this.connect();
		if (this.closed) throw canvasUnavailable("node host is shutting down");
		const id = randomUUID();
		return await new Promise((resolve, reject) => {
			const timer = setTimeout(() => {
				this.pending.delete(id);
				reject(/* @__PURE__ */ new Error(`CANVAS_UNAVAILABLE: desktop app timed out handling ${command}`));
			}, this.timeoutMs);
			timer.unref?.();
			this.pending.set(id, {
				resolve,
				reject,
				timer
			});
			hooks?.onDispatch?.();
			socket.write(`${JSON.stringify({
				id,
				command,
				paramsJSON
			})}\n`, (error) => {
				if (!error) return;
				const pending = this.pending.get(id);
				if (!pending) return;
				this.pending.delete(id);
				clearTimeout(pending.timer);
				pending.reject(canvasUnavailable());
			});
		});
	}
	sendActionResult(id, result) {
		this.socket?.write(`${JSON.stringify({
			event: "a2ui-action-result",
			id,
			...result
		})}\n`);
	}
	close() {
		this.closed = true;
		this.connectingSocket?.destroy();
		this.socket?.destroy();
		this.reset(canvasUnavailable("node host is shutting down"));
	}
	async connect() {
		if (this.closed) throw canvasUnavailable("node host is shutting down");
		if (this.socket && !this.socket.destroyed) return this.socket;
		this.connecting ??= new Promise((resolve, reject) => {
			const socket = net.createConnection({ path: this.socketPath });
			this.connectingSocket = socket;
			const fail = () => {
				socket.destroy();
				reject(this.closed ? canvasUnavailable("node host is shutting down") : canvasUnavailable());
			};
			socket.once("error", fail);
			socket.once("close", fail);
			socket.once("connect", () => {
				socket.off("error", fail);
				socket.off("close", fail);
				if (this.closed) {
					socket.destroy();
					reject(canvasUnavailable("node host is shutting down"));
					return;
				}
				socket.setEncoding("utf8");
				socket.on("error", () => this.resetSocket(socket, canvasUnavailable()));
				socket.on("close", () => this.resetSocket(socket, canvasUnavailable()));
				socket.on("data", (chunk) => this.onData(typeof chunk === "string" ? chunk : chunk.toString("utf8")));
				this.socket = socket;
				resolve(socket);
			});
		}).finally(() => {
			this.connecting = void 0;
			this.connectingSocket = void 0;
		});
		return await this.connecting;
	}
	onData(chunk) {
		this.buffer += chunk;
		this.bufferBytes += Buffer.byteLength(chunk, "utf8");
		if (this.bufferBytes > MAX_FRAME_BYTES && !this.buffer.includes("\n")) {
			this.socket?.destroy(/* @__PURE__ */ new Error("canvas IPC frame exceeded 32 MiB"));
			return;
		}
		let newline = this.buffer.indexOf("\n");
		while (newline >= 0) {
			const line = this.buffer.slice(0, newline);
			this.buffer = this.buffer.slice(newline + 1);
			this.bufferBytes = Buffer.byteLength(this.buffer, "utf8");
			if (line) {
				if (Buffer.byteLength(line, "utf8") > MAX_FRAME_BYTES) {
					this.socket?.destroy(/* @__PURE__ */ new Error("canvas IPC frame exceeded 32 MiB"));
					return;
				}
				const frame = parseFrame(line);
				if (frame === void 0) {
					this.socket?.destroy(/* @__PURE__ */ new Error("desktop app sent invalid canvas IPC JSON"));
					return;
				}
				this.onFrame(frame);
			}
			newline = this.buffer.indexOf("\n");
		}
	}
	onFrame(frame) {
		if (!isRecord(frame)) return;
		if (frame.event === "a2ui-action" && typeof frame.id === "string") {
			const event = {
				event: "a2ui-action",
				id: frame.id,
				action: frame.action
			};
			this.actionHandler?.(event).catch(() => {});
			return;
		}
		if (typeof frame.id !== "string") return;
		const pending = this.pending.get(frame.id);
		if (!pending) return;
		this.pending.delete(frame.id);
		clearTimeout(pending.timer);
		if (frame.ok === true) {
			if (typeof frame.payloadJSON !== "string") {
				pending.reject(canvasUnavailable("desktop app returned an invalid payload"));
				return;
			}
			try {
				JSON.parse(frame.payloadJSON);
			} catch {
				pending.reject(canvasUnavailable("desktop app returned invalid payload JSON"));
				return;
			}
			pending.resolve(frame.payloadJSON);
			return;
		}
		const error = isRecord(frame.error) ? frame.error : void 0;
		const code = typeof error?.code === "string" ? error.code : "CANVAS_UNAVAILABLE";
		const message = typeof error?.message === "string" ? error.message : "desktop app failed";
		pending.reject(/* @__PURE__ */ new Error(`${code}: ${message}`));
	}
	resetSocket(socket, error) {
		if (this.socket === socket) this.reset(error);
	}
	reset(error) {
		this.socket = void 0;
		this.buffer = "";
		this.bufferBytes = 0;
		for (const pending of this.pending.values()) {
			clearTimeout(pending.timer);
			pending.reject(error);
		}
		this.pending.clear();
	}
};
//#endregion
//#region extensions/linux-canvas/src/socket-path.ts
const log = createSubsystemLogger("linux-canvas");
function reportSocketWatchError(directory, error) {
	log.warn(`linux canvas socket watcher unavailable for ${directory}; continuing with availability polling: ${String(error)}`);
}
function resolveLinuxCanvasSocketPath(env = process.env, uid = process.getuid?.()) {
	const runtimeDir = env.XDG_RUNTIME_DIR?.trim();
	if (runtimeDir) return path.join(runtimeDir, "openclaw-canvas.sock");
	return path.join("/tmp", `openclaw-canvas-${uid ?? "unknown"}.sock`);
}
function linuxCanvasSocketExists(socketPath) {
	try {
		const stat = fs.lstatSync(socketPath);
		const uid = process.geteuid?.() ?? process.getuid?.();
		if (!stat.isSocket() || uid !== void 0 && stat.uid !== uid || (stat.mode & 63) !== 0) return false;
		return fs.readFileSync("/proc/net/unix", "utf8").split("\n").some((line) => line.endsWith(` ${socketPath}`));
	} catch {
		return false;
	}
}
function watchLinuxCanvasSocket(socketPath, onChange) {
	const directory = path.dirname(socketPath);
	const socketName = path.basename(socketPath);
	try {
		const watcher = fs.watch(directory, (_event, filename) => {
			if (!filename || filename === socketName) onChange();
		});
		watcher.on("error", (error) => reportSocketWatchError(directory, error));
		return () => watcher.close();
	} catch (error) {
		reportSocketWatchError(directory, error);
		return () => {};
	}
}
//#endregion
//#region extensions/linux-canvas/src/commands.ts
const AVAILABILITY_CACHE_MS = 250;
const AVAILABILITY_POLL_MS = 1e3;
const AGENT_REQUEST_MESSAGE_MAX_CHARS = 2e4;
const OWNERSHIP_COMMANDS = /* @__PURE__ */ new Set([
	"canvas.present",
	"canvas.navigate",
	"canvas.eval",
	"canvas.a2ui.push",
	"canvas.a2ui.pushJSONL",
	"canvas.a2ui.reset"
]);
const SESSIONLESS_OWNER_CLEAR_COMMANDS = /* @__PURE__ */ new Set([
	"canvas.navigate",
	"canvas.a2ui.push",
	"canvas.a2ui.pushJSONL",
	"canvas.a2ui.reset"
]);
const LINUX_CANVAS_COMMANDS = [
	"canvas.present",
	"canvas.hide",
	"canvas.navigate",
	"canvas.eval",
	"canvas.snapshot",
	"canvas.a2ui.push",
	"canvas.a2ui.pushJSONL",
	"canvas.a2ui.reset"
];
function cleanToken(value, fallback) {
	if (typeof value !== "string") return fallback;
	return value.replaceAll(/[^a-zA-Z0-9._:-]/g, "").slice(0, 120) || fallback;
}
function buildActionMessage(action, sessionKey) {
	const value = asNonArrayRecord(action);
	const actionName = cleanToken(value.name, "unknown");
	const surface = cleanToken(value.surfaceId, "main");
	const component = cleanToken(value.sourceComponentId, "unknown");
	const context = value.context === void 0 ? "" : ` ctx=${JSON.stringify(value.context)}`;
	const message = `CANVAS_A2UI action=${actionName} session=${cleanToken(sessionKey, "node")} surface=${surface} component=${component}${context} default=update_canvas`;
	if (message.length > AGENT_REQUEST_MESSAGE_MAX_CHARS) throw new Error("Canvas action exceeds the Gateway agent message limit");
	return message;
}
function bindActionRelay(transport, getContext) {
	transport.setActionHandler(async (event) => {
		try {
			const context = getContext();
			if (!context) throw new Error("node host event relay unavailable");
			await context.sendNodeEvent("agent.request", {
				message: buildActionMessage(event.action, context.sessionKey),
				...context.sessionKey ? { sessionKey: context.sessionKey } : {},
				thinking: "low",
				deliver: false,
				key: event.id
			});
			transport.sendActionResult(event.id, { ok: true });
		} catch (error) {
			transport.sendActionResult(event.id, {
				ok: false,
				error: String(error)
			});
		}
	});
}
function createLinuxCanvasCommands(options = {}) {
	const platform = options.platform ?? process.platform;
	const socketPath = resolveLinuxCanvasSocketPath(options.env ?? process.env);
	const socketExists = options.socketExists ?? linuxCanvasSocketExists;
	const watchSocket = options.watchSocket ?? watchLinuxCanvasSocket;
	const transport = options.transport ?? new LinuxCanvasIpcClient(socketPath);
	let ownerContext;
	bindActionRelay(transport, () => ownerContext);
	let lastAvailabilityCheck = 0;
	let lastAvailable = false;
	const isAvailable = () => {
		if (platform !== "linux") return false;
		const now = Date.now();
		if (now - lastAvailabilityCheck >= AVAILABILITY_CACHE_MS) {
			lastAvailable = socketExists(socketPath);
			lastAvailabilityCheck = now;
		}
		return lastAvailable;
	};
	return LINUX_CANVAS_COMMANDS.map((command, index) => {
		const registration = {
			command,
			cap: "canvas",
			dangerous: false,
			isAvailable,
			handle: async (paramsJSON, _io, context) => {
				if (platform !== "linux") throw new Error("CANVAS_DISABLED: Linux canvas is only available on Linux");
				if (!context) throw new Error("CANVAS_UNAVAILABLE: node host event relay unavailable");
				return await transport.request(command, paramsJSON ?? "{}", { onDispatch: () => {
					if (!OWNERSHIP_COMMANDS.has(command)) return;
					let clearSessionlessOwner = SESSIONLESS_OWNER_CLEAR_COMMANDS.has(command);
					if (command === "canvas.present" && !context.sessionKey) try {
						clearSessionlessOwner = typeof JSON.parse(paramsJSON ?? "{}").url === "string";
					} catch {
						clearSessionlessOwner = false;
					}
					if (!context.sessionKey && !clearSessionlessOwner) return;
					ownerContext = context.sessionKey ? context : void 0;
				} });
			}
		};
		if (index === 0 && platform === "linux") registration.watchAvailability = (_context, onChange) => {
			lastAvailabilityCheck = 0;
			let knownAvailable = isAvailable();
			const reconcile = () => {
				lastAvailabilityCheck = 0;
				const available = isAvailable();
				if (available === knownAvailable) return;
				knownAvailable = available;
				onChange();
			};
			const stopSocketWatch = watchSocket(socketPath, reconcile);
			const timer = setInterval(reconcile, AVAILABILITY_POLL_MS);
			timer.unref?.();
			return () => {
				clearInterval(timer);
				stopSocketWatch();
				transport.close();
			};
		};
		return registration;
	});
}
//#endregion
export { createLinuxCanvasCommands as t };
