import { u as openAIQuicksilverAuthHeaders } from "./realtime-quicksilver-wire-B_uld9Ep.js";
//#region extensions/openai/realtime-quicksilver-sideband.ts
const SIDEBAND_CONNECT_TIMEOUT_MS = 15e3;
const SIDEBAND_CONNECT_ATTEMPTS = 5;
const SIDEBAND_RETRY_BASE_MS = 200;
const EARLY_FRAME_MAX = 32;
const EARLY_FRAME_MAX_BYTES = 1024 * 1024;
const SIDEBAND_MAX_PAYLOAD_BYTES = 16 * 1024 * 1024;
function rawDataByteLength(data) {
	if (Array.isArray(data)) return data.reduce((total, chunk) => total + chunk.byteLength, 0);
	return data.byteLength;
}
function waitForSocketOpen(params) {
	return new Promise((resolve, reject) => {
		let settled = false;
		let opened = false;
		let terminalEvent;
		const detachTerminalListeners = () => {
			params.socket.off("error", onError);
			params.socket.off("close", onClose);
			return terminalEvent;
		};
		const finish = (error) => {
			if (settled) return;
			settled = true;
			clearTimeout(timeout);
			params.signal.removeEventListener("abort", onAbort);
			params.socket.off("open", onOpen);
			if (error) {
				detachTerminalListeners();
				reject(error);
			} else resolve({ detachTerminalListeners });
		};
		const onOpen = () => {
			opened = true;
			finish();
		};
		const onError = (error) => {
			if (opened) {
				terminalEvent ??= {
					kind: "error",
					error
				};
				return;
			}
			finish(error);
		};
		const onClose = (code, reason) => {
			if (opened) {
				terminalEvent ??= {
					kind: "close",
					code: code ?? 1006,
					reason: reason?.toString("utf8") ?? ""
				};
				return;
			}
			finish(/* @__PURE__ */ new Error("GPT-Live sideband closed during startup"));
		};
		const onAbort = () => finish(params.signal.reason instanceof Error ? params.signal.reason : /* @__PURE__ */ new Error("GPT-Live session stopped during startup"));
		const timeout = setTimeout(() => finish(/* @__PURE__ */ new Error("GPT-Live sideband connection timed out")), SIDEBAND_CONNECT_TIMEOUT_MS);
		timeout.unref?.();
		params.socket.once("open", onOpen);
		params.socket.on("error", onError);
		params.socket.on("close", onClose);
		params.signal.addEventListener("abort", onAbort, { once: true });
		if (params.signal.aborted) onAbort();
	});
}
function waitForRetryDelay(ms, signal) {
	return new Promise((resolve, reject) => {
		const finish = (error) => {
			clearTimeout(timer);
			signal.removeEventListener("abort", onAbort);
			if (error) reject(error);
			else resolve();
		};
		const onAbort = () => {
			const reason = signal.reason;
			finish(reason instanceof Error ? reason : new Error(reason === void 0 ? "GPT-Live session stopped" : String(reason), { cause: reason }));
		};
		const timer = setTimeout(() => finish(), ms);
		timer.unref?.();
		signal.addEventListener("abort", onAbort, { once: true });
		if (signal.aborted) onAbort();
	});
}
async function connectOpenAIQuicksilverSideband(params) {
	let lastError = /* @__PURE__ */ new Error("GPT-Live sideband connection failed");
	for (let attempt = 0; attempt < SIDEBAND_CONNECT_ATTEMPTS; attempt += 1) {
		if (params.signal.aborted) throw params.signal.reason;
		const socket = params.createSocket(params.url, {
			headers: openAIQuicksilverAuthHeaders(params.auth, params.requestIds),
			maxPayload: SIDEBAND_MAX_PAYLOAD_BYTES
		});
		const bufferedFrames = [];
		let bufferedBytes = 0;
		const bufferFrame = (data, isBinary) => {
			const frameBytes = rawDataByteLength(data);
			if (bufferedFrames.length >= EARLY_FRAME_MAX || bufferedBytes + frameBytes > EARLY_FRAME_MAX_BYTES) {
				socket.off("message", bufferFrame);
				socket.close(1009, "sideband startup buffer exceeded");
				return;
			}
			bufferedBytes += frameBytes;
			bufferedFrames.push({
				data,
				isBinary
			});
		};
		socket.on("message", bufferFrame);
		try {
			const openHandoff = await waitForSocketOpen({
				socket,
				signal: params.signal
			});
			if (params.signal.aborted) {
				socket.off("message", bufferFrame);
				openHandoff.detachTerminalListeners();
				socket.on("error", () => {});
				socket.close(1e3, "sideband startup stopped");
				throw params.signal.reason;
			}
			return {
				socket,
				bufferedFrames,
				detachBuffer: () => {
					socket.off("message", bufferFrame);
					return openHandoff.detachTerminalListeners();
				}
			};
		} catch (error) {
			lastError = error;
			socket.off("message", bufferFrame);
			socket.on("error", () => {});
			try {
				socket.close(1e3, "retrying sideband");
			} catch {}
			if (params.signal.aborted) throw params.signal.reason;
			if (attempt + 1 < SIDEBAND_CONNECT_ATTEMPTS) await waitForRetryDelay(SIDEBAND_RETRY_BASE_MS * 2 ** attempt, params.signal);
		}
	}
	throw lastError;
}
//#endregion
export { connectOpenAIQuicksilverSideband as t };
