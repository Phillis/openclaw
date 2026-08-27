import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import path from "node:path";
//#region src/worker/node-workspace-protocol.ts
const IDENTIFIER_MAX_CHARS = 256;
const GATEWAY_NAMESPACE_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/u;
const REQUEST_MAX_BYTES = 256 * 1024;
const INPUT_MAX_BYTES = 128 * 1024;
const OUTPUT_MAX_BYTES = 64 * 1024;
const STDERR_MAX_BYTES = 16 * 1024;
const ARGV_MAX_ITEMS = 128;
const ARG_MAX_BYTES = 128 * 1024;
const TIMEOUT_MAX_MS = 600 * 1e3;
function hasExactKeys(value, required, optional = []) {
	const allowed = /* @__PURE__ */ new Set([...required, ...optional]);
	return required.every((key) => Object.hasOwn(value, key)) && Object.keys(value).every((key) => allowed.has(key));
}
function parseJson(raw) {
	if (!raw || Buffer.byteLength(raw, "utf8") > REQUEST_MAX_BYTES) throw new Error("INVALID_REQUEST: invalid node worker workspace request");
	try {
		return JSON.parse(raw);
	} catch {
		throw new Error("INVALID_REQUEST: malformed node worker workspace request");
	}
}
function requireIdentifier(value, label) {
	if (typeof value !== "string" || value.length === 0 || value.length > IDENTIFIER_MAX_CHARS || value.trim() !== value || value.includes("\0")) throw new Error(`INVALID_REQUEST: ${label} must be a bounded non-empty identifier`);
	return value;
}
function parseNodeWorkerWorkspaceExecInput(raw) {
	const value = parseJson(raw);
	if (!isRecord(value) || !hasExactKeys(value, [
		"gatewayNamespace",
		"environmentId",
		"sessionId",
		"generation",
		"argv"
	], [
		"input",
		"timeoutMs",
		"resetWorkspace",
		"transfer"
	])) throw new Error("INVALID_REQUEST: invalid node worker workspace request");
	const gatewayNamespace = requireIdentifier(value.gatewayNamespace, "gatewayNamespace");
	if (!GATEWAY_NAMESPACE_PATTERN.test(gatewayNamespace)) throw new Error("INVALID_REQUEST: gatewayNamespace must be a safe bounded path component");
	if (!Number.isSafeInteger(value.generation) || typeof value.generation !== "number" || value.generation < 0) throw new Error("INVALID_REQUEST: generation must be a non-negative safe integer");
	if (!Array.isArray(value.argv) || value.argv.length === 0 || value.argv.length > ARGV_MAX_ITEMS || !value.argv.every((arg) => typeof arg === "string" && arg.length > 0 && !arg.includes("\0") && Buffer.byteLength(arg, "utf8") <= ARG_MAX_BYTES)) throw new Error("INVALID_REQUEST: argv must be a bounded non-empty string array");
	if (value.input !== void 0 && (typeof value.input !== "string" || Buffer.byteLength(value.input, "utf8") > INPUT_MAX_BYTES)) throw new Error("INVALID_REQUEST: workspace command input exceeds its bound");
	if (value.timeoutMs !== void 0 && (typeof value.timeoutMs !== "number" || !Number.isSafeInteger(value.timeoutMs) || value.timeoutMs < 1 || value.timeoutMs > TIMEOUT_MAX_MS)) throw new Error("INVALID_REQUEST: workspace command timeout is invalid");
	if (value.resetWorkspace !== void 0 && typeof value.resetWorkspace !== "boolean") throw new Error("INVALID_REQUEST: resetWorkspace must be a boolean");
	let transfer;
	if (value.transfer !== void 0) {
		if (!isRecord(value.transfer)) throw new Error("INVALID_REQUEST: workspace transfer is invalid");
		const direction = value.transfer.direction;
		const token = value.transfer.token;
		const manifestRef = value.transfer.manifestRef;
		const baseManifestRef = value.transfer.baseManifestRef;
		const validRef = (candidate) => typeof candidate === "string" && /^sha256:[a-f0-9]{64}$/u.test(candidate);
		if (typeof token !== "string" || token.length === 0 || token.length > 1024 || token.includes("\0") || (direction === "download" ? !hasExactKeys(value.transfer, [
			"direction",
			"token",
			"manifestRef"
		]) || !validRef(manifestRef) : direction === "upload" ? !hasExactKeys(value.transfer, [
			"direction",
			"token",
			"baseManifestRef"
		]) || !validRef(baseManifestRef) : true)) throw new Error("INVALID_REQUEST: workspace transfer is invalid");
		transfer = direction === "download" ? {
			direction,
			token,
			manifestRef
		} : {
			direction: "upload",
			token,
			baseManifestRef
		};
	}
	return {
		gatewayNamespace,
		environmentId: requireIdentifier(value.environmentId, "environmentId"),
		sessionId: requireIdentifier(value.sessionId, "sessionId"),
		generation: value.generation,
		argv: [...value.argv],
		...value.input === void 0 ? {} : { input: value.input },
		...value.timeoutMs === void 0 ? {} : { timeoutMs: value.timeoutMs },
		...value.resetWorkspace === void 0 ? {} : { resetWorkspace: value.resetWorkspace },
		...transfer ? { transfer } : {}
	};
}
function isBoundedText(value, maxBytes) {
	return typeof value === "string" && Buffer.byteLength(value, "utf8") <= maxBytes;
}
function isAbsoluteHostPath(value) {
	return path.posix.isAbsolute(value) || path.win32.isAbsolute(value);
}
function parseNodeWorkerWorkspaceExecResult(value) {
	if (!isRecord(value) || !hasExactKeys(value, [
		"workspaceDir",
		"stdout",
		"stderr",
		"code",
		"signal",
		"killed",
		"termination"
	], [
		"stdoutTruncatedBytes",
		"stderrTruncatedBytes",
		"noOutputTimedOut",
		"outputLimitExceeded",
		"outputErrorStream"
	]) || typeof value.workspaceDir !== "string" || !isAbsoluteHostPath(value.workspaceDir) || value.workspaceDir.length > 4096 || !isBoundedText(value.stdout, OUTPUT_MAX_BYTES) || !isBoundedText(value.stderr, STDERR_MAX_BYTES) || value.code !== null && (!Number.isSafeInteger(value.code) || typeof value.code !== "number") || value.signal !== null && (typeof value.signal !== "string" || value.signal.length === 0 || value.signal.length > 32) || typeof value.killed !== "boolean" || value.termination !== "exit" && value.termination !== "timeout" && value.termination !== "no-output-timeout" && value.termination !== "signal") return null;
	for (const key of ["stdoutTruncatedBytes", "stderrTruncatedBytes"]) {
		const count = value[key];
		if (count !== void 0 && (typeof count !== "number" || !Number.isSafeInteger(count) || count < 0)) return null;
	}
	if (value.noOutputTimedOut !== void 0 && typeof value.noOutputTimedOut !== "boolean" || value.outputLimitExceeded !== void 0 && typeof value.outputLimitExceeded !== "boolean" || value.outputErrorStream !== void 0 && value.outputErrorStream !== "stdout" && value.outputErrorStream !== "stderr") return null;
	return value;
}
const NODE_WORKER_WORKSPACE_STDOUT_MAX_BYTES = OUTPUT_MAX_BYTES;
const NODE_WORKER_WORKSPACE_STDERR_MAX_BYTES = STDERR_MAX_BYTES;
//#endregion
export { parseNodeWorkerWorkspaceExecResult as i, NODE_WORKER_WORKSPACE_STDOUT_MAX_BYTES as n, parseNodeWorkerWorkspaceExecInput as r, NODE_WORKER_WORKSPACE_STDERR_MAX_BYTES as t };
