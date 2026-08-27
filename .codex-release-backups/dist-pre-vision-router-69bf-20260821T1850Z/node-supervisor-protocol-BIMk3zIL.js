import "./src-BkwWvwB2.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { t as stableStringify } from "./stable-stringify-DoZ6Yalc.js";
import { i as parseWorkerLaunchPlan } from "./launch-descriptor-D6h907h0.js";
import { createHash } from "node:crypto";
//#region src/worker/node-supervisor-protocol.ts
const IDENTIFIER_MAX_CHARS = 256;
const GATEWAY_NAMESPACE_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/u;
const NODE_WORKER_SUPERVISOR_CANCEL_REQUEST_MAX_BYTES = 4 * 1024;
const NODE_WORKER_RESULT_JSON_MAX_BYTES = 64 * 1024;
const NODE_WORKER_ERROR_TEXT_MAX_BYTES = 4 * 1024;
const NODE_WORKER_CONNECTION_FAILURE_CAUSE_MAX_BYTES = 64 * 1024;
const NODE_WORKER_CONNECTION_FAILURE_MESSAGE_TYPE = "openclaw-worker-connection-failure-v1";
function hasExactKeys(value, keys) {
	return Object.keys(value).length === keys.length && keys.every((key) => Object.hasOwn(value, key));
}
function isIdentifier(value) {
	return typeof value === "string" && value.length > 0 && value.length <= IDENTIFIER_MAX_CHARS && value.trim() === value && !value.includes("\0");
}
function requireIdentifier(value, label) {
	if (!isIdentifier(value)) throw new Error(`INVALID_REQUEST: ${label} must be a bounded non-empty identifier`);
	return value;
}
function isNonNegativeInteger(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}
function requireNonNegativeInteger(value, label) {
	if (!isNonNegativeInteger(value)) throw new Error(`INVALID_REQUEST: ${label} must be a non-negative safe integer`);
	return value;
}
function isPlanHash(value) {
	return typeof value === "string" && /^[a-f0-9]{64}$/u.test(value);
}
function decodeRequest(raw) {
	if (!raw) throw new Error("INVALID_REQUEST: paramsJSON required");
	try {
		return JSON.parse(raw);
	} catch {
		throw new Error("INVALID_REQUEST: paramsJSON malformed JSON");
	}
}
function parseNodeWorkerLaunchInput(raw) {
	const value = decodeRequest(raw);
	if (!isRecord(value) || !hasExactKeys(value, [
		"launchId",
		"gatewayNamespace",
		"installKind",
		"expectedBundleHash",
		"placementGeneration",
		"descriptor"
	])) throw new Error("INVALID_REQUEST: invalid node worker launch request");
	const launchId = requireIdentifier(value.launchId, "launchId");
	const gatewayNamespace = requireIdentifier(value.gatewayNamespace, "gatewayNamespace");
	if (!GATEWAY_NAMESPACE_PATTERN.test(gatewayNamespace)) throw new Error("INVALID_REQUEST: gatewayNamespace must be a safe bounded path component");
	if (value.installKind !== "local" && value.installKind !== "bundle") throw new Error("INVALID_REQUEST: installKind must be local or bundle");
	if (!isPlanHash(value.expectedBundleHash)) throw new Error("INVALID_REQUEST: expectedBundleHash must be 64 lowercase hexadecimal characters");
	let descriptor;
	try {
		descriptor = parseWorkerLaunchPlan(value.descriptor);
	} catch {
		throw new Error("INVALID_REQUEST: invalid worker launch descriptor");
	}
	if (descriptor.admission.handshake.bundleHash !== value.expectedBundleHash) throw new Error("INVALID_REQUEST: descriptor bundle hash does not match expectedBundleHash");
	return {
		launchId,
		gatewayNamespace,
		installKind: value.installKind,
		expectedBundleHash: value.expectedBundleHash,
		placementGeneration: requireNonNegativeInteger(value.placementGeneration, "placementGeneration"),
		descriptor
	};
}
function parseNodeWorkerLookupInput(raw) {
	const value = decodeRequest(raw);
	if (!isRecord(value) || !hasExactKeys(value, ["launchId"])) throw new Error("INVALID_REQUEST: invalid node worker lookup request");
	return { launchId: requireIdentifier(value.launchId, "launchId") };
}
function parseNodeWorkerCancelInput(raw) {
	if (!raw || Buffer.byteLength(raw, "utf8") > NODE_WORKER_SUPERVISOR_CANCEL_REQUEST_MAX_BYTES) throw new Error("INVALID_REQUEST: invalid node worker cancel request");
	const value = decodeRequest(raw);
	if (!isRecord(value) || !hasExactKeys(value, [
		"launchId",
		"planHash",
		"environmentId",
		"sessionId",
		"ownerEpoch",
		"placementGeneration",
		"runId"
	])) throw new Error("INVALID_REQUEST: invalid node worker cancel request");
	if (!isPlanHash(value.planHash)) throw new Error("INVALID_REQUEST: planHash must be 64 lowercase hexadecimal characters");
	return {
		launchId: requireIdentifier(value.launchId, "launchId"),
		planHash: value.planHash,
		environmentId: requireIdentifier(value.environmentId, "environmentId"),
		sessionId: requireIdentifier(value.sessionId, "sessionId"),
		ownerEpoch: requireNonNegativeInteger(value.ownerEpoch, "ownerEpoch"),
		placementGeneration: requireNonNegativeInteger(value.placementGeneration, "placementGeneration"),
		runId: requireIdentifier(value.runId, "runId")
	};
}
function nodeWorkerPlanHash(input) {
	return createHash("sha256").update(stableStringify({
		installKind: input.installKind,
		expectedBundleHash: input.expectedBundleHash,
		descriptor: input.descriptor,
		gatewayNamespace: input.gatewayNamespace,
		placementGeneration: input.placementGeneration
	})).digest("hex");
}
const RECEIPT_IDENTITY_KEYS = [
	"launchId",
	"planHash",
	"environmentId",
	"sessionId",
	"ownerEpoch",
	"placementGeneration",
	"runId"
];
function parseReceiptIdentity(value) {
	if (!isIdentifier(value.launchId) || !isPlanHash(value.planHash) || !isIdentifier(value.environmentId) || !isIdentifier(value.sessionId) || !isNonNegativeInteger(value.ownerEpoch) || !isNonNegativeInteger(value.placementGeneration) || !isIdentifier(value.runId)) return null;
	return {
		launchId: value.launchId,
		planHash: value.planHash,
		environmentId: value.environmentId,
		sessionId: value.sessionId,
		ownerEpoch: value.ownerEpoch,
		placementGeneration: value.placementGeneration,
		runId: value.runId
	};
}
function isBoundedResultJson(value) {
	if (typeof value !== "string" || value.length === 0 || Buffer.byteLength(value, "utf8") > NODE_WORKER_RESULT_JSON_MAX_BYTES) return false;
	try {
		return isRecord(JSON.parse(value));
	} catch {
		return false;
	}
}
function isBoundedErrorText(value) {
	return typeof value === "string" && value.length > 0 && Buffer.byteLength(value, "utf8") <= NODE_WORKER_ERROR_TEXT_MAX_BYTES && !/[\r\n]/u.test(value);
}
function parseNodeWorkerConnectionFailureMessage(value) {
	if (!isRecord(value) || !hasExactKeys(value, ["type", "cause"]) || value.type !== "openclaw-worker-connection-failure-v1" || value.cause !== null && (typeof value.cause !== "string" || value.cause.length === 0 || Buffer.byteLength(value.cause, "utf8") > NODE_WORKER_CONNECTION_FAILURE_CAUSE_MAX_BYTES)) return null;
	return {
		type: NODE_WORKER_CONNECTION_FAILURE_MESSAGE_TYPE,
		cause: value.cause
	};
}
function parseNodeWorkerSupervisorReceipt(value) {
	if (!isRecord(value) || typeof value.state !== "string") return null;
	const identity = parseReceiptIdentity(value);
	if (!identity) return null;
	if (value.state === "pending" || value.state === "running") return hasExactKeys(value, [...RECEIPT_IDENTITY_KEYS, "state"]) ? {
		...identity,
		state: value.state
	} : null;
	if (value.state === "completed") return hasExactKeys(value, [
		...RECEIPT_IDENTITY_KEYS,
		"state",
		"resultJson"
	]) && isBoundedResultJson(value.resultJson) ? {
		...identity,
		state: value.state,
		resultJson: value.resultJson
	} : null;
	if (value.state === "failed" || value.state === "interrupted" || value.state === "cancelled") return hasExactKeys(value, [
		...RECEIPT_IDENTITY_KEYS,
		"state",
		"errorText"
	]) && isBoundedErrorText(value.errorText) ? {
		...identity,
		state: value.state,
		errorText: value.errorText
	} : null;
	return null;
}
//#endregion
export { parseNodeWorkerLaunchInput as a, parseNodeWorkerConnectionFailureMessage as i, nodeWorkerPlanHash as n, parseNodeWorkerLookupInput as o, parseNodeWorkerCancelInput as r, parseNodeWorkerSupervisorReceipt as s, NODE_WORKER_CONNECTION_FAILURE_MESSAGE_TYPE as t };
