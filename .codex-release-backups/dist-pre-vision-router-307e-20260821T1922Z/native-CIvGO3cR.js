import { n as getFsSafeNativeConfig } from "./native-config-fT3AGA-R.js";
import { t as FsSafeError } from "./errors-CQDiIdj7.js";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { closeSync, openSync, readSync, readdirSync } from "node:fs";
import { join } from "node:path";
//#region node_modules/@openclaw/fs-safe/dist/native.js
const require = createRequire(import.meta.url);
const bundledNativeDirectory = fileURLToPath(new URL("../dist/native/", import.meta.url));
let binding;
let loadError;
let attempted = false;
let loadBinding = loadBundledBinding;
function isMuslFilename(file) {
	return file.includes("libc.musl-") || file.includes("ld-musl-");
}
function isMuslFromReport() {
	try {
		if (!process.report || typeof process.report.getReport !== "function") return void 0;
		const report = process.report.getReport();
		if (report.header?.glibcVersionRuntime) return false;
		if (report.sharedObjects?.some(isMuslFilename)) return true;
	} catch {}
}
function isMuslFromFilesystem() {
	for (const directory of ["/lib", "/usr/lib"]) try {
		if (readdirSync(directory).some(isMuslFilename)) return true;
	} catch {}
}
function readUInt(buffer, offset, bytes, littleEndian) {
	if (offset < 0 || offset + bytes > buffer.length) return void 0;
	if (bytes === 2) return littleEndian ? buffer.readUInt16LE(offset) : buffer.readUInt16BE(offset);
	if (bytes === 4) return littleEndian ? buffer.readUInt32LE(offset) : buffer.readUInt32BE(offset);
	const value = littleEndian ? buffer.readBigUInt64LE(offset) : buffer.readBigUInt64BE(offset);
	return value <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(value) : void 0;
}
function isMuslFromElfInterpreter() {
	let fd;
	try {
		fd = openSync(process.execPath, "r");
		const header = Buffer.alloc(64);
		if (readSync(fd, header, 0, header.length, 0) < 52) return void 0;
		if (!header.subarray(0, 4).equals(Buffer.from([
			127,
			69,
			76,
			70
		]))) return void 0;
		const elfClass = header[4];
		const dataEncoding = header[5];
		if (elfClass !== 1 && elfClass !== 2 || dataEncoding !== 1 && dataEncoding !== 2) return;
		const littleEndian = dataEncoding === 1;
		const is64Bit = elfClass === 2;
		const tableOffset = readUInt(header, is64Bit ? 32 : 28, is64Bit ? 8 : 4, littleEndian);
		const entrySize = readUInt(header, is64Bit ? 54 : 42, 2, littleEndian);
		const entryCount = readUInt(header, is64Bit ? 56 : 44, 2, littleEndian);
		if (tableOffset === void 0 || entrySize === void 0 || entryCount === void 0 || entrySize < (is64Bit ? 56 : 32) || entryCount > 1024) return;
		const programHeader = Buffer.alloc(entrySize);
		for (let index = 0; index < entryCount; index += 1) {
			const offset = tableOffset + index * entrySize;
			if (readSync(fd, programHeader, 0, entrySize, offset) !== entrySize) return void 0;
			if (readUInt(programHeader, 0, 4, littleEndian) !== 3) continue;
			const interpreterOffset = readUInt(programHeader, is64Bit ? 8 : 4, is64Bit ? 8 : 4, littleEndian);
			const interpreterSize = readUInt(programHeader, is64Bit ? 32 : 16, is64Bit ? 8 : 4, littleEndian);
			if (interpreterOffset === void 0 || interpreterSize === void 0 || interpreterSize < 1 || interpreterSize > 4096) return;
			const interpreter = Buffer.alloc(interpreterSize);
			if (readSync(fd, interpreter, 0, interpreterSize, interpreterOffset) !== interpreterSize) return;
			return isMuslFilename(interpreter.toString("utf8"));
		}
	} catch {
		return;
	} finally {
		if (fd !== void 0) try {
			closeSync(fd);
		} catch {}
	}
}
function isMusl() {
	if (process.platform !== "linux") return false;
	for (const detector of [
		isMuslFromReport,
		isMuslFromFilesystem,
		isMuslFromElfInterpreter
	]) {
		const result = detector();
		if (result !== void 0) return result;
	}
	return false;
}
function targetFor(platform, arch, musl) {
	if (platform === "win32" && arch === "x64") return "win32-x64-msvc";
	if (platform === "darwin" && arch === "x64") return "darwin-x64";
	if (platform === "darwin" && arch === "arm64") return "darwin-arm64";
	if (platform === "linux" && (arch === "x64" || arch === "arm64")) return `linux-${arch}-${musl ? "musl" : "gnu"}`;
}
function bundledTarget() {
	return targetFor(process.platform, process.arch, isMusl());
}
function loadBundledBinding() {
	const target = bundledTarget();
	if (!target) throw new Error(`Unsupported OS or architecture: ${process.platform}-${process.arch}`);
	return require(join(bundledNativeDirectory, target, "fs-safe-native.node"));
}
function getNativeBinding() {
	const { mode } = getFsSafeNativeConfig();
	if (mode === "off") return void 0;
	if (!attempted) {
		attempted = true;
		try {
			binding = loadBinding();
		} catch (error) {
			loadError = error;
		}
	}
	if (binding) return binding;
	if (mode === "require") throw new FsSafeError("helper-unavailable", "native fs-safe helper is unavailable", { cause: loadError });
}
function requireNativeBinding() {
	const native = getNativeBinding();
	if (!native) throw new FsSafeError("helper-unavailable", "native fs-safe helper is unavailable", { cause: loadError });
	return native;
}
//#endregion
export { requireNativeBinding as n, getNativeBinding as t };
