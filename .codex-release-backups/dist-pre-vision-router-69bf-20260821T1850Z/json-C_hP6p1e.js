import { t as FsSafeError } from "./errors-hdcLXK2n.js";
import { n as readFileDescriptorBoundedSync } from "./bounded-read-W_MSGG4q.js";
import { a as stringifyJsonDocument } from "./root-impl-DNOINk8h.js";
import { i as openRootFileSync } from "./root-file-CdmcBz8_.js";
import { i as readRegularFileSync, o as statRegularFile, r as readRegularFile } from "./regular-file-SotPWt-b.js";
import { t as sleep } from "./timing-DpgMro2Q.js";
import { t as writeTextAtomic } from "./text-atomic-pC09XB1J.js";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
//#region ../../../../../../openclaw/node_modules/@openclaw/fs-safe/dist/json.js
const READ_RETRY_MAX_ATTEMPTS = 5;
const READ_RETRY_BASE_DELAY_MS = 50;
function isRetryableReadError(err, options) {
	if (err instanceof FsSafeError && err.code === "path-mismatch") return true;
	if (options.retryOpenRaceErrors !== true) return false;
	const code = getErrorCode(err);
	return code === "ENOENT" || code === "EPERM";
}
async function readRegularFileWithRetry(filePath, options = {}) {
	let lastErr;
	for (let attempt = 0; attempt < READ_RETRY_MAX_ATTEMPTS; attempt++) try {
		return (await readRegularFile({
			filePath,
			maxBytes: options.maxBytes
		})).buffer;
	} catch (err) {
		lastErr = err;
		if (!isRetryableReadError(err, options) || attempt === READ_RETRY_MAX_ATTEMPTS - 1) throw err;
		await sleep(READ_RETRY_BASE_DELAY_MS * Math.pow(2, attempt));
	}
	throw lastErr;
}
async function readRegularFileIfExistsWithRetry(filePath, options = {}) {
	if ((await statRegularFile(filePath)).missing) return null;
	return await readRegularFileWithRetry(filePath, {
		maxBytes: options.maxBytes,
		retryOpenRaceErrors: true
	});
}
const JSON_FILE_MODE = 384;
const JSON_DIR_MODE = 448;
const SUPPORTS_SYNC_NOFOLLOW = process.platform !== "win32" && "O_NOFOLLOW" in fs.constants;
function getErrorCode(err) {
	return err instanceof Error ? err.code : void 0;
}
function trySetSecureMode(pathname) {
	let fd;
	try {
		fd = fs.openSync(pathname, fs.constants.O_RDONLY | (SUPPORTS_SYNC_NOFOLLOW ? fs.constants.O_NOFOLLOW : 0));
		fs.fchmodSync(fd, JSON_FILE_MODE);
	} catch {} finally {
		if (fd !== void 0) try {
			fs.closeSync(fd);
		} catch {}
	}
}
function trySyncDirectory(pathname) {
	let fd;
	try {
		fd = fs.openSync(path.dirname(pathname), "r");
		fs.fsyncSync(fd);
	} catch {} finally {
		if (fd !== void 0) try {
			fs.closeSync(fd);
		} catch {}
	}
}
function renameJsonFileWithFallback(tmpPath, pathname) {
	try {
		fs.renameSync(tmpPath, pathname);
		return;
	} catch (error) {
		const code = error.code;
		if (code === "EPERM" || code === "EEXIST") {
			if ((() => {
				try {
					return fs.lstatSync(pathname);
				} catch (lstatError) {
					if (lstatError.code === "ENOENT") return null;
					throw lstatError;
				}
			})()?.isSymbolicLink()) {
				fs.rmSync(pathname, { force: true });
				fs.renameSync(tmpPath, pathname);
				return;
			}
			fs.rmSync(pathname, { force: true });
			fs.renameSync(tmpPath, pathname);
			return;
		}
		throw error;
	}
}
function writeTempJsonFile(pathname, payload) {
	const fd = fs.openSync(pathname, "wx", JSON_FILE_MODE);
	try {
		fs.writeFileSync(fd, payload, "utf8");
		fs.fsyncSync(fd);
	} finally {
		fs.closeSync(fd);
	}
}
function tryReadJsonSync(pathname, options = {}) {
	try {
		const raw = readRegularFileSync({
			filePath: pathname,
			maxBytes: options.maxBytes
		}).buffer.toString("utf8");
		return JSON.parse(raw);
	} catch {
		return null;
	}
}
function writeJsonSync(pathname, data) {
	const targetPath = pathname;
	const tmpPath = `${targetPath}.${randomUUID()}.tmp`;
	const payload = `${stringifyJsonDocument(data, null, 2)}\n`;
	fs.mkdirSync(path.dirname(targetPath), {
		recursive: true,
		mode: JSON_DIR_MODE
	});
	try {
		writeTempJsonFile(tmpPath, payload);
		trySetSecureMode(tmpPath);
		renameJsonFileWithFallback(tmpPath, targetPath);
		trySetSecureMode(targetPath);
		trySyncDirectory(targetPath);
	} finally {
		try {
			fs.rmSync(tmpPath, { force: true });
		} catch {}
	}
}
var JsonFileReadError = class extends Error {
	filePath;
	reason;
	constructor(filePath, reason, cause) {
		super(`Failed to ${reason} JSON file: ${filePath}`, { cause });
		this.name = "JsonFileReadError";
		this.filePath = filePath;
		this.reason = reason;
	}
};
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function resolveInvalidMessage(invalidMessage, relativePath) {
	if (typeof invalidMessage === "function") return invalidMessage(relativePath);
	return invalidMessage ?? `${relativePath} has an unexpected shape`;
}
function readRootStructuredFileSync(options) {
	const opened = openRootFileSync({
		absolutePath: path.resolve(options.rootDir, options.relativePath),
		rootPath: options.rootDir,
		...options.rootRealPath !== void 0 ? { rootRealPath: options.rootRealPath } : {},
		boundaryLabel: options.boundaryLabel,
		rejectHardlinks: options.rejectHardlinks,
		maxBytes: options.maxBytes,
		allowedType: "file"
	});
	if (!opened.ok) return {
		ok: false,
		reason: "open",
		failure: opened
	};
	try {
		const raw = options.maxBytes === void 0 ? fs.readFileSync(opened.fd, "utf8") : readFileDescriptorBoundedSync(opened.fd, options.maxBytes).toString("utf8");
		const parsed = options.parse(raw);
		if (options.validate && !options.validate(parsed)) return {
			ok: false,
			reason: "invalid",
			error: resolveInvalidMessage(options.invalidMessage, options.relativePath)
		};
		return {
			ok: true,
			value: parsed,
			stat: opened.stat,
			path: opened.path,
			rootRealPath: opened.rootRealPath
		};
	} catch (error) {
		return {
			ok: false,
			reason: "parse",
			error: `failed to parse ${options.relativePath}: ${String(error)}`
		};
	} finally {
		fs.closeSync(opened.fd);
	}
}
function readRootJsonSync(options) {
	return readRootStructuredFileSync({
		...options,
		parse: (raw) => JSON.parse(raw)
	});
}
function readRootJsonObjectSync(options) {
	return readRootStructuredFileSync({
		...options,
		parse: (raw) => JSON.parse(raw),
		validate: isRecord,
		invalidMessage: (relativePath) => `${relativePath} must contain a JSON object`
	});
}
async function tryReadJson(filePath, options = {}) {
	try {
		const buffer = await readRegularFileIfExistsWithRetry(filePath, options);
		if (buffer === null) return null;
		const raw = buffer.toString("utf8");
		return JSON.parse(raw);
	} catch {
		return null;
	}
}
async function readJson(filePath, options = {}) {
	let raw;
	try {
		raw = (await readRegularFileWithRetry(filePath, {
			maxBytes: options.maxBytes,
			retryOpenRaceErrors: true
		})).toString("utf8");
	} catch (err) {
		throw new JsonFileReadError(filePath, "read", err);
	}
	try {
		return JSON.parse(raw);
	} catch (err) {
		throw new JsonFileReadError(filePath, "parse", err);
	}
}
async function readJsonIfExists(filePath, options = {}) {
	let raw;
	try {
		const buffer = await readRegularFileIfExistsWithRetry(filePath, options);
		if (buffer === null) return null;
		raw = buffer.toString("utf8");
	} catch (err) {
		if (getErrorCode(err) === "ENOENT") return null;
		throw new JsonFileReadError(filePath, "read", err);
	}
	try {
		return JSON.parse(raw);
	} catch (err) {
		throw new JsonFileReadError(filePath, "parse", err);
	}
}
function readJsonSync(filePath, options = {}) {
	let raw;
	try {
		raw = readRegularFileSync({
			filePath,
			maxBytes: options.maxBytes
		}).buffer.toString("utf8");
	} catch (err) {
		throw new JsonFileReadError(filePath, "read", err);
	}
	try {
		return JSON.parse(raw);
	} catch (err) {
		throw new JsonFileReadError(filePath, "parse", err);
	}
}
async function writeJson(filePath, value, options) {
	await writeTextAtomic(filePath, stringifyJsonDocument(value, null, 2), {
		mode: options?.mode,
		dirMode: options?.dirMode,
		trailingNewline: options?.trailingNewline,
		durable: options?.durable
	});
}
//#endregion
export { readRootJsonObjectSync as a, tryReadJson as c, writeJsonSync as d, readJsonSync as i, tryReadJsonSync as l, readJson as n, readRootJsonSync as o, readJsonIfExists as r, readRootStructuredFileSync as s, JsonFileReadError as t, writeJson as u };
