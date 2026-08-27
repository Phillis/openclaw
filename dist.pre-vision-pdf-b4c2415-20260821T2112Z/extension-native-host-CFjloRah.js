import { r as asNullableRecord } from "./record-coerce-DItp3I4t.js";
import { w as resolveStateDir } from "./paths-CqeDjSA4.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./state-paths-BIUvtBLx.js";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/browser/src/browser/extension-native-protocol.ts
const BROWSER_NATIVE_REQUEST_MAX_BYTES = 4 * 1024;
const BROWSER_NATIVE_RESPONSE_MAX_BYTES = 1024 * 1024;
const NONCE_PATTERN = /^[A-Za-z0-9_-]+$/;
function readNativeUint32(buffer, offset = 0) {
	return os.endianness() === "LE" ? buffer.readUInt32LE(offset) : buffer.readUInt32BE(offset);
}
function writeNativeUint32(buffer, value, offset = 0) {
	if (os.endianness() === "LE") buffer.writeUInt32LE(value, offset);
	else buffer.writeUInt32BE(value, offset);
}
function rootJsonKeys(raw) {
	const keys = [];
	let index = 0;
	const skipWhitespace = () => {
		while (/\s/u.test(raw[index] ?? "")) index += 1;
	};
	const readJsonString = () => {
		if (raw[index] !== "\"") return null;
		const start = index++;
		while (index < raw.length) {
			const char = raw[index++];
			if (char === "\\") index += 1;
			else if (char === "\"") try {
				return JSON.parse(raw.slice(start, index));
			} catch {
				return null;
			}
		}
		return null;
	};
	const skipValue = () => {
		let depth = 0;
		let inString = false;
		let escaped = false;
		while (index < raw.length) {
			const char = raw[index];
			if (inString) {
				index += 1;
				if (escaped) escaped = false;
				else if (char === "\\") escaped = true;
				else if (char === "\"") inString = false;
				continue;
			}
			if (char === "\"") {
				inString = true;
				index += 1;
				continue;
			}
			if (char === "{" || char === "[") depth += 1;
			else if (char === "}" || char === "]") {
				if (depth === 0) return true;
				depth -= 1;
			} else if (char === "," && depth === 0) return true;
			index += 1;
		}
		return true;
	};
	skipWhitespace();
	if (raw[index++] !== "{") return null;
	for (;;) {
		skipWhitespace();
		if (raw[index] === "}") return keys;
		const key = readJsonString();
		if (key === null) return null;
		keys.push(key);
		skipWhitespace();
		if (raw[index++] !== ":") return null;
		skipWhitespace();
		if (!skipValue()) return null;
		skipWhitespace();
		if (raw[index] === ",") {
			index += 1;
			continue;
		}
		return raw[index] === "}" ? keys : null;
	}
}
function isCanonicalNonce(value) {
	if (typeof value !== "string" || !NONCE_PATTERN.test(value)) return false;
	const bytes = Buffer.from(value, "base64url");
	return bytes.length >= 16 && bytes.length <= 32 && bytes.toString("base64url") === value;
}
/** Strictly validate one decoded native bootstrap request. */
function parseBrowserNativeRequest(raw) {
	const keys = rootJsonKeys(raw);
	if (!keys || new Set(keys).size !== keys.length) return null;
	const expected = [
		"v",
		"op",
		"nonce"
	];
	if (keys.length !== expected.length || !expected.every((key) => keys.includes(key))) return null;
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return null;
	}
	const record = asNullableRecord(parsed);
	return record?.v === 1 && record.op === "bootstrap" && isCanonicalNonce(record.nonce) ? {
		v: 1,
		op: "bootstrap",
		nonce: record.nonce
	} : null;
}
function decodeBrowserNativeFrame(frame) {
	if (frame.length < 4) return {
		ok: false,
		code: "invalid_frame"
	};
	const length = readNativeUint32(frame);
	if (length === 0 || length > BROWSER_NATIVE_REQUEST_MAX_BYTES || frame.length !== length + 4) return {
		ok: false,
		code: "invalid_frame"
	};
	let raw;
	try {
		raw = new TextDecoder("utf-8", { fatal: true }).decode(frame.subarray(4));
	} catch {
		return {
			ok: false,
			code: "invalid_utf8"
		};
	}
	const request = parseBrowserNativeRequest(raw);
	return request ? {
		ok: true,
		request
	} : {
		ok: false,
		code: "invalid_request"
	};
}
/** Read exactly one small frame without allocating from an untrusted length. */
async function readBrowserNativeFrame(input) {
	let buffered = Buffer.alloc(0);
	let expected = 4;
	for await (const chunk of input) {
		if (buffered.length + chunk.length > 4100) throw new Error("invalid_frame");
		buffered = Buffer.concat([buffered, chunk], buffered.length + chunk.length);
		if (expected === 4 && buffered.length >= 4) {
			const length = readNativeUint32(buffered);
			if (length === 0 || length > BROWSER_NATIVE_REQUEST_MAX_BYTES) throw new Error("invalid_frame");
			expected = length + 4;
		}
		if (buffered.length >= expected) {
			if (buffered.length !== expected) throw new Error("invalid_frame");
			return buffered;
		}
	}
	throw new Error("invalid_frame");
}
function encodeBrowserNativeResponse(response) {
	const payload = Buffer.from(JSON.stringify(response), "utf8");
	if (payload.length >= BROWSER_NATIVE_RESPONSE_MAX_BYTES) throw new Error("native response exceeds Chrome's 1 MiB limit");
	const frame = Buffer.allocUnsafe(payload.length + 4);
	writeNativeUint32(frame, payload.length);
	payload.copy(frame, 4);
	return frame;
}
//#endregion
//#region extensions/browser/src/browser/extension-native-host.ts
const BROWSER_NATIVE_HOST_NAME = "ai.openclaw.browser_bootstrap";
const EXTENSION_ORIGIN_PATTERN = /^chrome-extension:\/\/[a-p]{32}\/$/;
function validateExpectedOrigins(origins) {
	const canonical = [...new Set(origins)].toSorted();
	if (origins.length === 0 || origins.length !== canonical.length || origins.some((origin, index) => origin !== canonical[index]) || origins.some((origin) => !EXTENSION_ORIGIN_PATTERN.test(origin))) throw new Error("invalid expected origins");
	return canonical;
}
function parseBrowserNativeHostOrigins(argv) {
	const expectedOrigins = [];
	let callerOrigin = "";
	for (let index = 0; index < argv.length; index += 1) {
		const argument = argv[index];
		if (argument === "--expected-origin") {
			const value = argv[index + 1];
			if (!value || callerOrigin) throw new Error("invalid expected-origin arguments");
			expectedOrigins.push(value);
			index += 1;
		} else if (argument?.startsWith("chrome-extension://")) {
			if (callerOrigin) throw new Error("multiple Chrome extension origins");
			callerOrigin = argument;
		}
	}
	validateExpectedOrigins(expectedOrigins);
	if (!EXTENSION_ORIGIN_PATTERN.test(callerOrigin)) throw new Error("missing Chrome extension origin");
	return {
		expectedOrigins,
		callerOrigin
	};
}
async function validateOwnedFile(filePath, executable) {
	const resolved = path.resolve(filePath);
	const info = await fs.lstat(resolved);
	if (!info.isFile() || info.isSymbolicLink()) throw new Error("unsafe file type");
	if (process.platform !== "win32") {
		const uid = process.getuid?.();
		if (uid !== void 0 && info.uid !== uid) throw new Error("foreign file owner");
		const mode = info.mode & 511;
		if ((mode & 63) !== 0 || executable && (mode & 64) === 0) throw new Error("unsafe file mode");
	}
	const canonical = await fs.realpath(resolved);
	if (canonical !== resolved) throw new Error("non-canonical file path");
	return canonical;
}
async function validateNativeManifest(params) {
	const manifestPath = await validateOwnedFile(params.manifestPath, false);
	const launcherPath = await validateOwnedFile(params.launcherPath, true);
	const managedRoot = path.resolve(params.stateDir ?? resolveStateDir(), "browser", "native-messaging");
	if (launcherPath !== managedRoot && !launcherPath.startsWith(`${managedRoot}${path.sep}`)) throw new Error("launcher is outside the managed root");
	const manifestRecord = asNullableRecord(JSON.parse(await fs.readFile(manifestPath, "utf8")));
	if (!manifestRecord) throw new Error("invalid manifest");
	const manifest = manifestRecord;
	const expectedOrigins = validateExpectedOrigins(params.expectedOrigins);
	const keys = [
		"name",
		"description",
		"path",
		"type",
		"allowed_origins"
	];
	if (Object.keys(manifest).length !== keys.length || !keys.every((key) => Object.hasOwn(manifest, key)) || manifest.name !== "ai.openclaw.browser_bootstrap" || manifest.type !== "stdio" || manifest.path !== launcherPath || !Array.isArray(manifest.allowed_origins) || JSON.stringify(manifest.allowed_origins) !== JSON.stringify(expectedOrigins)) throw new Error("invalid manifest");
	if (!expectedOrigins.includes(params.callerOrigin)) throw new Error("origin forbidden");
}
/** Run one request/response native host process. */
async function runBrowserNativeHost(params) {
	let response;
	try {
		const decoded = decodeBrowserNativeFrame(await readBrowserNativeFrame(params.input));
		if (!decoded.ok) response = {
			v: 1,
			ok: false,
			code: decoded.code
		};
		else if ((params.platform ?? process.platform) === "win32") response = {
			v: 1,
			ok: false,
			code: "manual_required"
		};
		else {
			try {
				await validateNativeManifest(params);
			} catch (error) {
				response = {
					v: 1,
					ok: false,
					code: error instanceof Error && error.message === "origin forbidden" ? "origin_forbidden" : "manifest_invalid"
				};
				params.write(encodeBrowserNativeResponse(response));
				return response;
			}
			try {
				const pairing = await params.buildPairing();
				response = pairing.topology === "direct-remote" ? {
					v: 1,
					ok: false,
					code: "manual_required"
				} : {
					v: 1,
					ok: true,
					nonce: decoded.request.nonce,
					pairingString: pairing.pairingString
				};
			} catch (error) {
				response = {
					v: 1,
					ok: false,
					code: error instanceof Error && error.message.includes("--gateway-url") ? "manual_required" : "pairing_unavailable"
				};
			}
		}
	} catch {
		response = {
			v: 1,
			ok: false,
			code: "invalid_frame"
		};
	}
	params.write(encodeBrowserNativeResponse(response));
	return response;
}
//#endregion
export { parseBrowserNativeHostOrigins as n, runBrowserNativeHost as r, BROWSER_NATIVE_HOST_NAME as t };
