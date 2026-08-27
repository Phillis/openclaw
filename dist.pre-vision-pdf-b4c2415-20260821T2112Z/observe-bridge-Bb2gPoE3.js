import crypto, { createCipheriv, createHash, randomBytes } from "node:crypto";
import net from "node:net";
import { WebSocket, WebSocketServer } from "ws";
//#region src/gateway/desktop/attachment.ts
function connectRfbAttachment(attachment) {
	return attachment.kind === "unix-socket" ? net.connect(attachment.socketPath) : net.connect(attachment.port, attachment.host);
}
//#endregion
//#region src/gateway/desktop/rfb-preauth.ts
const RFB_VERSION_BYTES = 12;
const RFB_3_3_VERSION = Buffer.from("RFB 003.003\n", "ascii");
const RFB_3_8_VERSION$1 = Buffer.from("RFB 003.008\n", "ascii");
const RFB_SECURITY_NONE = 1;
const RFB_SECURITY_VNC = 2;
const RFB_SECURITY_ARD = 30;
const MAX_ARD_KEY_BYTES = 1024;
const MAX_REASON_BYTES = 64 * 1024;
const DEFAULT_PREAUTH_TIMEOUT_MS = 1e4;
var RfbPreauthTimeoutError = class extends Error {
	constructor() {
		super("RFB authentication negotiation timed out");
		this.name = "RfbPreauthTimeoutError";
	}
};
function abortReason(signal) {
	return signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("RFB authentication negotiation aborted");
}
/** Exact-byte queue shared by stream and WebSocket handshake adapters. */
var RfbPreauthBuffer = class {
	constructor() {
		this.buffered = Buffer.alloc(0);
		this.waiters = /* @__PURE__ */ new Set();
	}
	push(chunk) {
		this.buffered = Buffer.concat([this.buffered, chunk]);
		this.wake();
	}
	fail(error) {
		this.failure = error;
		this.wake();
	}
	wake() {
		for (const waiter of this.waiters) waiter();
		this.waiters.clear();
	}
	async waitForData(signal) {
		if (signal.aborted) throw abortReason(signal);
		await new Promise((resolve, reject) => {
			const cleanup = () => {
				this.waiters.delete(onWake);
				signal.removeEventListener("abort", onAbort);
			};
			const onWake = () => {
				cleanup();
				resolve();
			};
			const onAbort = () => {
				cleanup();
				reject(abortReason(signal));
			};
			this.waiters.add(onWake);
			signal.addEventListener("abort", onAbort, { once: true });
		});
	}
	async readExactly(length, signal) {
		while (this.buffered.length < length) {
			if (this.failure) throw this.failure;
			await this.waitForData(signal);
		}
		const value = this.buffered.subarray(0, length);
		this.buffered = this.buffered.subarray(length);
		return value;
	}
	takeBuffered() {
		const value = this.buffered;
		this.buffered = Buffer.alloc(0);
		return value;
	}
};
var StreamRfbPreauthPeer = class {
	constructor(stream) {
		this.stream = stream;
		this.reader = new RfbPreauthBuffer();
		this.onData = (chunk) => this.reader.push(chunk);
		this.onEnd = () => {
			this.reader.fail(/* @__PURE__ */ new Error("RFB peer closed during authentication negotiation"));
		};
		this.onError = (error) => {
			this.reader.fail(error);
		};
		stream.on("data", this.onData);
		stream.once("end", this.onEnd);
		stream.once("close", this.onEnd);
		stream.once("error", this.onError);
	}
	async readExactly(length, signal) {
		return await this.reader.readExactly(length, signal);
	}
	async write(buffer, signal) {
		if (signal.aborted) throw abortReason(signal);
		await new Promise((resolve, reject) => {
			const cleanup = () => signal.removeEventListener("abort", onAbort);
			const onAbort = () => {
				cleanup();
				reject(abortReason(signal));
			};
			signal.addEventListener("abort", onAbort, { once: true });
			this.stream.write(buffer, (error) => {
				cleanup();
				if (error) reject(error);
				else resolve();
			});
		});
	}
	dispose() {
		this.stream.off("data", this.onData);
		this.stream.off("end", this.onEnd);
		this.stream.off("close", this.onEnd);
		this.stream.off("error", this.onError);
	}
};
function parseServerVersion(banner) {
	const match = /^RFB 003\.(\d{3})\n$/u.exec(banner.toString("ascii"));
	if (!match) throw new Error(`unsupported RFB protocol version ${JSON.stringify(banner.toString("ascii"))}`);
	const offeredMinor = Number.parseInt(match[1] ?? "", 10);
	if (offeredMinor === 889 || offeredMinor >= 7) return {
		minor: 8,
		reply: RFB_3_8_VERSION$1
	};
	return {
		minor: 3,
		reply: RFB_3_3_VERSION
	};
}
async function readReason(peer, signal) {
	const length = (await peer.readExactly(4, signal)).readUInt32BE(0);
	if (length === 0) return "";
	if (length > MAX_REASON_BYTES) throw new Error("RFB failure reason is too large");
	return (await peer.readExactly(length, signal)).toString("utf8");
}
async function selectSecurityType(params) {
	if (params.protocolMinor < 7) {
		const selected = (await params.peer.readExactly(4, params.signal)).readUInt32BE(0);
		if (selected === 0) {
			const reason = await readReason(params.peer, params.signal);
			throw new Error(`RFB server rejected security negotiation${reason ? `: ${reason}` : ""}`);
		}
		if (selected !== params.requiredType) throw new Error(`RFB server selected security type ${selected}, want ${params.requiredType}`);
		return;
	}
	const count = (await params.peer.readExactly(1, params.signal))[0] ?? 0;
	if (count === 0) {
		const reason = await readReason(params.peer, params.signal);
		throw new Error(`RFB server rejected security negotiation${reason ? `: ${reason}` : ""}`);
	}
	const offered = await params.peer.readExactly(count, params.signal);
	if (!offered.includes(params.requiredType)) throw new Error(`RFB server did not offer required security type ${params.requiredType} (offered ${[...offered].join(", ")})`);
	await params.peer.write(Buffer.from([params.requiredType]), params.signal);
}
function bufferToBigInt(value) {
	return value.length === 0 ? 0n : BigInt(`0x${value.toString("hex")}`);
}
function leftPadBigInt(value, length) {
	const hex = value.toString(16).padStart(2, "0");
	let bytes = Buffer.from(hex.length % 2 === 0 ? hex : `0${hex}`, "hex");
	if (bytes.length > length) bytes = bytes.subarray(bytes.length - length);
	const output = Buffer.alloc(length);
	bytes.copy(output, length - bytes.length);
	return output;
}
function modularExponentiation(base, exponent, modulus) {
	if (modulus <= 0n) throw new Error("invalid ARD Diffie-Hellman modulus");
	let result = 1n;
	let factor = base % modulus;
	let power = exponent;
	while (power > 0n) {
		if ((power & 1n) === 1n) result = result * factor % modulus;
		factor = factor * factor % modulus;
		power >>= 1n;
	}
	return result;
}
function buildArdCredentialsBlock(username, password) {
	const block = randomBytes(128);
	const usernameBytes = Buffer.from(username, "utf8").subarray(0, 63);
	const passwordBytes = Buffer.from(password, "utf8").subarray(0, 63);
	usernameBytes.copy(block, 0);
	block[usernameBytes.length] = 0;
	passwordBytes.copy(block, 64);
	block[64 + passwordBytes.length] = 0;
	return block;
}
function encryptAesEcb(key, plaintext) {
	const cipher = createCipheriv("aes-128-ecb", key, null);
	cipher.setAutoPadding(false);
	return Buffer.concat([cipher.update(plaintext), cipher.final()]);
}
async function negotiateArdAuth(params) {
	const header = await params.peer.readExactly(4, params.signal);
	const keyLength = header.readUInt16BE(2);
	if (keyLength < 1 || keyLength > MAX_ARD_KEY_BYTES) throw new Error(`invalid ARD key length ${keyLength}`);
	const dhParameters = await params.peer.readExactly(keyLength * 2, params.signal);
	const generator = bufferToBigInt(header.subarray(0, 2));
	const modulus = bufferToBigInt(dhParameters.subarray(0, keyLength));
	const serverPublic = bufferToBigInt(dhParameters.subarray(keyLength));
	if (generator === 0n || modulus === 0n || serverPublic === 0n) throw new Error("invalid ARD Diffie-Hellman parameters");
	const privateKey = bufferToBigInt(randomBytes(keyLength));
	const clientPublic = modularExponentiation(generator, privateKey, modulus);
	const shared = modularExponentiation(serverPublic, privateKey, modulus);
	const encryptedCredentials = encryptAesEcb(createHash("md5").update(leftPadBigInt(shared, keyLength)).digest(), buildArdCredentialsBlock(params.credentials.username, params.credentials.password));
	await params.peer.write(Buffer.concat([encryptedCredentials, leftPadBigInt(clientPublic, keyLength)]), params.signal);
}
function reverseByteBits(value) {
	let input = value;
	let output = 0;
	for (let index = 0; index < 8; index += 1) {
		output = output << 1 | input & 1;
		input >>= 1;
	}
	return output;
}
function buildVncAuthResponse(password, challenge) {
	const key = Buffer.alloc(8);
	Buffer.from(password, "utf8").copy(key, 0, 0, 8);
	for (let index = 0; index < key.length; index += 1) key[index] = reverseByteBits(key[index] ?? 0);
	const cipher = createCipheriv("des-ede", Buffer.concat([key, key]), null);
	cipher.setAutoPadding(false);
	return Buffer.concat([cipher.update(challenge), cipher.final()]);
}
async function negotiateVncAuth(params) {
	if (!params.password) throw new Error("VNC password is required");
	const challenge = await params.peer.readExactly(16, params.signal);
	await params.peer.write(buildVncAuthResponse(params.password, challenge), params.signal);
}
async function readSecurityResult(peer, signal) {
	const status = (await peer.readExactly(4, signal)).readUInt32BE(0);
	if (status === 0) return;
	let reason = "";
	try {
		reason = await readReason(peer, signal);
	} catch {}
	throw new Error(reason ? `RFB authentication failed: ${reason}` : `RFB authentication failed with status ${status}`);
}
async function negotiateServer(params) {
	if (params.preauth.auth === "ard-account" && (!params.preauth.credentials.username || !params.preauth.credentials.password)) throw new Error("ARD account username and password are required");
	const version = parseServerVersion(await params.peer.readExactly(RFB_VERSION_BYTES, params.signal));
	await params.peer.write(version.reply, params.signal);
	const requiredType = params.preauth.auth === "ard-account" ? RFB_SECURITY_ARD : RFB_SECURITY_VNC;
	await selectSecurityType({
		peer: params.peer,
		protocolMinor: version.minor,
		requiredType,
		signal: params.signal
	});
	if (params.preauth.auth === "ard-account") await negotiateArdAuth({
		peer: params.peer,
		credentials: params.preauth.credentials,
		signal: params.signal
	});
	else await negotiateVncAuth({
		peer: params.peer,
		password: params.preauth.credentials.password,
		signal: params.signal
	});
	await readSecurityResult(params.peer, params.signal);
}
async function synthesizeBrowserHandshake(browser, signal) {
	await browser.write(RFB_3_8_VERSION$1, signal);
	if (!(await browser.readExactly(RFB_VERSION_BYTES, signal)).equals(RFB_3_8_VERSION$1)) throw new Error("RFB browser did not accept protocol version 3.8");
	await browser.write(Buffer.from([1, RFB_SECURITY_NONE]), signal);
	if ((await browser.readExactly(1, signal))[0] !== RFB_SECURITY_NONE) throw new Error("RFB browser did not select no authentication");
	await browser.write(Buffer.alloc(4), signal);
}
/** Authenticates the Gateway to an RFB server, then exposes a synthetic None handshake. */
async function preauthenticateRfb(params) {
	const server = new StreamRfbPreauthPeer(params.server);
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(new RfbPreauthTimeoutError()), params.timeoutMs ?? DEFAULT_PREAUTH_TIMEOUT_MS);
	timeout.unref?.();
	try {
		await negotiateServer({
			peer: server,
			preauth: params.preauth,
			signal: controller.signal
		});
		await synthesizeBrowserHandshake(params.browser, controller.signal);
	} finally {
		clearTimeout(timeout);
		server.dispose();
	}
}
//#endregion
//#region src/gateway/desktop/rfb-view-only-filter.ts
const RFB_3_8_VERSION = Buffer.from("RFB 003.008\n", "ascii");
const MAX_PENDING_BYTES = 64 * 1024;
const FIXED_PHASE_LENGTHS = {
	version: RFB_3_8_VERSION.length,
	security: 1,
	authResponse: 16,
	clientInit: 1
};
/** Filters one view-only RFB client byte stream without trusting WebSocket frame boundaries. */
function createRfbClientMessageFilter(options = {}) {
	let phase = options.startPhase ?? "version";
	let pending = Buffer.alloc(0);
	let failure;
	const fail = (error) => {
		failure = error;
		pending = Buffer.alloc(0);
		return { error };
	};
	const pendingTargetLength = () => {
		if (phase !== "messages") return FIXED_PHASE_LENGTHS[phase];
		if (pending.length === 0) return 1;
		switch (pending[0]) {
			case 0: return 20;
			case 2: return pending.length < 4 ? 4 : 4 + pending.readUInt16BE(2) * 4;
			case 3: return 10;
			case 4: return 8;
			case 5: return 6;
			case 6: return pending.length < 8 ? 8 : 8 + Math.abs(pending.readInt32BE(4));
			case 150: return 10;
			case 248: return pending.length < 9 ? 9 : 9 + pending.readUInt8(8);
			default: return `unsupported RFB client message type ${pending[0]}`;
		}
	};
	const routePending = (forwarded) => {
		if (phase === "version") {
			if (!pending.equals(RFB_3_8_VERSION)) return "unsupported RFB protocol version";
			forwarded.push(pending);
			phase = "security";
		} else if (phase === "security") {
			const securityType = pending[0];
			forwarded.push(pending);
			if (securityType === 1) phase = "clientInit";
			else if (securityType === 2) phase = "authResponse";
			else return `unsupported RFB security type ${securityType}`;
		} else if (phase === "authResponse") {
			forwarded.push(pending);
			phase = "clientInit";
		} else if (phase === "clientInit") {
			pending[0] = 1;
			forwarded.push(pending);
			phase = "messages";
		} else if (pending[0] === 0 || pending[0] === 2 || pending[0] === 3 || pending[0] === 150 || pending[0] === 248) forwarded.push(pending);
		pending = Buffer.alloc(0);
	};
	return { filter(chunk) {
		if (failure) return { error: failure };
		const forwarded = [];
		let offset = 0;
		while (offset < chunk.length) {
			const target = pendingTargetLength();
			if (typeof target === "string") return fail(target);
			if (target > MAX_PENDING_BYTES) return fail("RFB client message exceeds the 64 KiB buffer limit");
			const take = Math.min(target - pending.length, chunk.length - offset);
			pending = Buffer.concat([pending, chunk.subarray(offset, offset + take)]);
			offset += take;
			const completedTarget = pendingTargetLength();
			if (typeof completedTarget === "string") return fail(completedTarget);
			if (completedTarget > MAX_PENDING_BYTES) return fail("RFB client message exceeds the 64 KiB buffer limit");
			if (pending.length < completedTarget) continue;
			const error = routePending(forwarded);
			if (error) return fail(error);
		}
		return { forward: Buffer.concat(forwarded) };
	} };
}
//#endregion
//#region src/gateway/desktop/observe-bridge.ts
const DESKTOP_OBSERVE_PATH = "/desktop/observe";
const TOKEN_TTL_MS = 6e4;
const TOKEN_PATTERN = /^[a-f0-9]{48}$/u;
const MAX_PAYLOAD_BYTES = 1024 * 1024;
const PAUSE_BUFFERED_BYTES = 4 * 1024 * 1024;
const RESUME_CHECK_MS = 25;
const observerTokens = /* @__PURE__ */ new Map();
const observerTokenExpiryTimers = /* @__PURE__ */ new Map();
const desktopObserverWss = new WebSocketServer({
	noServer: true,
	maxPayload: MAX_PAYLOAD_BYTES
});
function deleteDesktopObserverToken(token) {
	observerTokens.delete(token);
	const expiryTimer = observerTokenExpiryTimers.get(token);
	if (expiryTimer) {
		clearTimeout(expiryTimer);
		observerTokenExpiryTimers.delete(token);
	}
}
function pruneDesktopObserverTokens(nowMs) {
	for (const [token, entry] of observerTokens) if (entry.expiresAt <= nowMs) deleteDesktopObserverToken(token);
}
function mintDesktopObserverToken(params) {
	const nowMs = params.nowMs ?? Date.now();
	pruneDesktopObserverTokens(nowMs);
	const token = crypto.randomBytes(24).toString("hex");
	const expiresAtMs = nowMs + TOKEN_TTL_MS;
	const entry = {
		sourceKey: params.sourceKey,
		ownerEpoch: params.ownerEpoch,
		control: params.control,
		attachment: params.attachment,
		...params.preauth ? { preauth: params.preauth } : {},
		expiresAt: expiresAtMs
	};
	observerTokens.set(token, entry);
	const expiryTimer = setTimeout(() => {
		observerTokens.delete(token);
		observerTokenExpiryTimers.delete(token);
	}, TOKEN_TTL_MS);
	expiryTimer.unref?.();
	observerTokenExpiryTimers.set(token, expiryTimer);
	return {
		token,
		expiresAtMs
	};
}
function consumeDesktopObserverToken(token, nowMs = Date.now()) {
	pruneDesktopObserverTokens(nowMs);
	const normalized = token.trim();
	if (!TOKEN_PATTERN.test(normalized)) return;
	const entry = observerTokens.get(normalized);
	if (!entry) return;
	deleteDesktopObserverToken(normalized);
	return entry.expiresAt > nowMs ? entry : void 0;
}
function writeUnauthorized(socket) {
	socket.write("HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n");
	socket.destroy();
}
function rawDataBuffer(data) {
	if (Buffer.isBuffer(data)) return data;
	if (Array.isArray(data)) return Buffer.concat(data);
	return Buffer.from(data);
}
var WebSocketPreauthPeer = class {
	constructor(ws) {
		this.ws = ws;
		this.reader = new RfbPreauthBuffer();
		this.onMessage = (data, isBinary) => {
			if (!isBinary) this.reader.fail(/* @__PURE__ */ new Error("RFB browser sent a non-binary handshake frame"));
			else this.reader.push(rawDataBuffer(data));
		};
		this.onClose = () => {
			this.reader.fail(/* @__PURE__ */ new Error("RFB browser closed during authentication negotiation"));
		};
		this.onError = () => {
			this.reader.fail(/* @__PURE__ */ new Error("RFB browser failed during authentication negotiation"));
		};
		ws.on("message", this.onMessage);
		ws.once("close", this.onClose);
		ws.once("error", this.onError);
	}
	async readExactly(length, signal) {
		return await this.reader.readExactly(length, signal);
	}
	async write(buffer, signal) {
		if (signal.aborted) throw signal.reason;
		await new Promise((resolve, reject) => {
			const cleanup = () => signal.removeEventListener("abort", onAbort);
			const onAbort = () => {
				cleanup();
				reject(signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("RFB authentication negotiation aborted"));
			};
			signal.addEventListener("abort", onAbort, { once: true });
			this.ws.send(buffer, { binary: true }, (error) => {
				cleanup();
				if (error) reject(error);
				else resolve();
			});
		});
	}
	detach() {
		this.ws.off("message", this.onMessage);
		this.ws.off("close", this.onClose);
		this.ws.off("error", this.onError);
		return this.reader.takeBuffered();
	}
};
/** Upgrades one authenticated observer token into a raw bidirectional RFB stream. */
function handleDesktopObserveUpgrade(req, socket, head, deps) {
	const resource = new URL(req.url ?? "/", "http://127.0.0.1");
	if (resource.pathname !== "/desktop/observe") return false;
	const entry = consumeDesktopObserverToken(resource.searchParams.get("token") ?? "");
	if (!entry) {
		writeUnauthorized(socket);
		return true;
	}
	desktopObserverWss.handleUpgrade(req, socket, head, (ws) => {
		const claimedStream = entry.attachment.kind === "stream" ? deps.registry.claimStream(entry.attachment) : void 0;
		if (entry.attachment.kind === "stream" && !claimedStream) {
			ws.close(1013, "desktop stream unavailable");
			return;
		}
		const observer = deps.registry.attachObserver(entry.sourceKey, {
			control: entry.control,
			ownerEpoch: entry.ownerEpoch,
			close: (code, reason) => ws.close(code, reason)
		});
		if (!observer) {
			claimedStream?.destroy();
			ws.close(1013, "desktop observer limit");
			return;
		}
		const desktopSocket = entry.attachment.kind === "stream" ? claimedStream : connectRfbAttachment(entry.attachment);
		if (!desktopSocket) {
			observer.release();
			ws.close(1013, "desktop stream unavailable");
			return;
		}
		let closed = false;
		let negotiating = Boolean(entry.preauth);
		let resumeTimer;
		const closeBoth = (code, reason) => {
			if (closed) return;
			closed = true;
			clearInterval(resumeTimer);
			resumeTimer = void 0;
			observer.release();
			desktopSocket.destroy();
			if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) ws.close(code, reason);
		};
		const startSplice = (browserRemainder = Buffer.alloc(0), preauthenticated = false) => {
			const clientMessageFilter = entry.control ? void 0 : createRfbClientMessageFilter({ startPhase: preauthenticated ? "clientInit" : "version" });
			const forwardClientChunk = (chunk) => {
				if (!clientMessageFilter) {
					desktopSocket.write(chunk);
					return;
				}
				const result = clientMessageFilter.filter(chunk);
				if ("error" in result) {
					closeBoth(1008, "invalid view-only RFB stream");
					return;
				}
				if (result.forward.length > 0) desktopSocket.write(result.forward);
			};
			ws.on("message", (data, isBinary) => {
				if (!isBinary || closed) return;
				forwardClientChunk(rawDataBuffer(data));
			});
			desktopSocket.on("data", (chunk) => {
				if (closed || ws.readyState !== WebSocket.OPEN) return;
				ws.send(chunk, { binary: true });
				const bufferedAmount = () => deps.getBufferedAmount?.(ws) ?? ws.bufferedAmount;
				if (bufferedAmount() <= PAUSE_BUFFERED_BYTES || resumeTimer) return;
				desktopSocket.pause();
				resumeTimer = setInterval(() => {
					if (bufferedAmount() <= PAUSE_BUFFERED_BYTES) {
						clearInterval(resumeTimer);
						resumeTimer = void 0;
						desktopSocket.resume();
					}
				}, RESUME_CHECK_MS);
				resumeTimer.unref?.();
			});
			if (browserRemainder.length > 0) forwardClientChunk(browserRemainder);
		};
		ws.once("close", () => closeBoth(1e3, "desktop observer closed"));
		ws.once("error", () => closeBoth(1011, "desktop observer failed"));
		desktopSocket.once("close", () => closeBoth(1e3, "desktop stream closed"));
		desktopSocket.once("error", () => closeBoth(negotiating ? 1008 : 1011, negotiating ? "desktop authentication failed" : "desktop stream failed"));
		if (!entry.preauth) {
			startSplice();
			return;
		}
		const preauth = entry.preauth;
		const browser = new WebSocketPreauthPeer(ws);
		(async () => {
			try {
				await preauthenticateRfb({
					server: desktopSocket,
					browser,
					preauth
				});
				const remainder = browser.detach();
				entry.preauth = void 0;
				negotiating = false;
				if (!closed) startSplice(remainder, true);
			} catch (error) {
				browser.detach();
				entry.preauth = void 0;
				closeBoth(1008, error instanceof RfbPreauthTimeoutError ? "desktop authentication timed out" : `desktop ${preauth.auth === "ard-account" ? "ARD" : "VNC"} authentication failed`);
			}
		})();
	});
	return true;
}
//#endregion
export { handleDesktopObserveUpgrade as n, mintDesktopObserverToken as r, DESKTOP_OBSERVE_PATH as t };
