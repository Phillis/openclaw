import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { o as toStructuredErrorObject } from "./error-coercion-CKFmnpjH.js";
import "./src-BntaCZM-.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { t as stableStringify } from "./stable-stringify-DoZ6Yalc.js";
import { f as redactSensitiveText } from "./redact-CWP17HFN.js";
import { n as GATEWAY_CLIENT_IDS, r as GATEWAY_CLIENT_MODES } from "./client-info-UYcIi_5g.js";
import { C as WorkerConnectRequestFrameSchema, X as WorkerTranscriptMessageSchema } from "./worker-admission-v0PuudgP.js";
import "./worker-protocol-primitives-Ch87u2k0.js";
import "./version-CwNT1gaY.js";
import { r as normalizeTlsFingerprint } from "./client-address-utils-ycG4vrin.js";
import { r as resolveGatewayWebSocketTransport, t as GatewayWebSocketTransportConfigurationError } from "./websocket-transport-wJ1IBbMW.js";
import { c as WorkerInferenceModelRefSchema, l as WorkerInferenceOptionsSchema, y as SessionPermissionModeSchema } from "./worker-inference-BzU_LUo9.js";
import { a as isWorkerToolName } from "./tool-authority-BfRQ7maz.js";
import { i as isWorkerTranscriptMessageFrameSafe } from "./transcript-message-WHdKssX2.js";
import path from "node:path";
import { createHash } from "node:crypto";
import { Value } from "typebox/value";
//#region packages/gateway-client/src/cloudflare-access.ts
const CF_ACCESS_CLIENT_ID_HEADER = "CF-Access-Client-Id";
const CF_ACCESS_CLIENT_SECRET_HEADER = "CF-Access-Client-Secret";
/** Build only the two headers Cloudflare Access defines for service-token auth. */
function buildCloudflareAccessHeaders(credentials) {
	return {
		[CF_ACCESS_CLIENT_ID_HEADER]: credentials.clientId,
		[CF_ACCESS_CLIENT_SECRET_HEADER]: credentials.clientSecret
	};
}
//#endregion
//#region src/worker/worker-connection-endpoint.ts
var WorkerConnectionEndpointError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "WorkerConnectionEndpointError";
	}
};
function hasExactKeys$2(value, required, optional = []) {
	const allowed = /* @__PURE__ */ new Set([...required, ...optional]);
	return required.every((key) => key in value) && Object.keys(value).every((key) => allowed.has(key));
}
function parseUnixEndpoint(value) {
	if (!hasExactKeys$2(value, ["kind", "socketPath"]) || value.kind !== "unix" || typeof value.socketPath !== "string" || value.socketPath.length > 256 || !path.isAbsolute(value.socketPath) || value.socketPath.includes(":")) return;
	return {
		kind: "unix",
		socketPath: value.socketPath
	};
}
function parseWebSocketEndpoint(value) {
	const tlsFingerprint = typeof value.tlsFingerprint === "string" ? normalizeTlsFingerprint(value.tlsFingerprint) : void 0;
	if (!hasExactKeys$2(value, ["kind", "url"], ["tlsFingerprint", "cloudflareAccess"]) || value.kind !== "websocket" || typeof value.url !== "string" || value.url.length > 4096 || value.tlsFingerprint !== void 0 && !tlsFingerprint) return;
	const cloudflareAccess = parseCloudflareAccessCredentials(value.cloudflareAccess);
	if (value.cloudflareAccess !== void 0 && !cloudflareAccess) return;
	let url;
	try {
		url = new URL(value.url);
	} catch {
		return;
	}
	if (url.protocol !== "ws:" && url.protocol !== "wss:" || url.username !== "" || url.password !== "" || url.search !== "" || url.hash !== "" || !url.pathname.endsWith("/__openclaw__/worker") || value.tlsFingerprint !== void 0 && url.protocol !== "wss:" || cloudflareAccess !== void 0 && url.protocol !== "wss:") return;
	return {
		kind: "websocket",
		url: value.url,
		...tlsFingerprint ? { tlsFingerprint } : {},
		...cloudflareAccess ? { cloudflareAccess } : {}
	};
}
function parseCloudflareAccessCredentials(value) {
	if (value === void 0) return;
	if (!isRecord(value) || !hasExactKeys$2(value, ["clientId", "clientSecret"]) || typeof value.clientId !== "string" || value.clientId.trim().length === 0 || value.clientId.length > 4096 || typeof value.clientSecret !== "string" || value.clientSecret.trim().length === 0 || value.clientSecret.length > 4096) return;
	return {
		clientId: value.clientId,
		clientSecret: value.clientSecret
	};
}
function parseWorkerConnectionEndpoint(value) {
	if (!isRecord(value)) return;
	return parseUnixEndpoint(value) ?? parseWebSocketEndpoint(value);
}
function resolveWorkerConnectionTarget(endpoint, env = process.env) {
	if (endpoint.kind === "unix") return {
		url: `ws+unix://${endpoint.socketPath}:/`,
		options: {},
		validateSocket: () => null
	};
	if (endpoint.cloudflareAccess && new URL(endpoint.url).protocol !== "wss:") throw new WorkerConnectionEndpointError("Cloudflare Access credentials require a wss:// worker endpoint");
	try {
		const transport = resolveGatewayWebSocketTransport({
			url: endpoint.url,
			tlsFingerprint: endpoint.tlsFingerprint,
			env,
			options: endpoint.cloudflareAccess ? {
				followRedirects: false,
				headers: buildCloudflareAccessHeaders(endpoint.cloudflareAccess)
			} : {}
		});
		return {
			url: endpoint.url,
			...transport
		};
	} catch (error) {
		if (error instanceof GatewayWebSocketTransportConfigurationError) throw new WorkerConnectionEndpointError(error.message);
		throw error;
	}
}
//#endregion
//#region src/worker/launch-descriptor.ts
const LAUNCH_VERSION = 4;
function hasExactKeys$1(value, required, optional = []) {
	const allowed = /* @__PURE__ */ new Set([...required, ...optional]);
	return required.every((key) => key in value) && Object.keys(value).every((key) => allowed.has(key));
}
function isIdentifier$1(value) {
	return typeof value === "string" && value.trim() === value && value.length > 0 && value.length <= 256;
}
function isSafeSequence(value, minimum) {
	return Number.isSafeInteger(value) && typeof value === "number" && value >= minimum;
}
function isAbsoluteHostPath(value) {
	return path.posix.isAbsolute(value) || path.win32.isAbsolute(value);
}
function isInferenceOptions(value) {
	return Value.Check(WorkerInferenceOptionsSchema, value);
}
function parseToolAuthority(value) {
	if (!isRecord(value) || !hasExactKeys$1(value, ["allowedToolNames"]) || !Array.isArray(value.allowedToolNames) || !value.allowedToolNames.every(isWorkerToolName) || new Set(value.allowedToolNames).size !== value.allowedToolNames.length) return;
	return { allowedToolNames: [...value.allowedToolNames] };
}
function parseBrowserLaunchDescriptor(value) {
	if (!isRecord(value) || !hasExactKeys$1(value, ["cdpUrl", "launcherPath"]) || typeof value.cdpUrl !== "string" || typeof value.launcherPath !== "string" || !isAbsoluteHostPath(value.launcherPath)) return;
	let cdpUrl;
	try {
		cdpUrl = new URL(value.cdpUrl);
	} catch {
		return;
	}
	const port = Number(cdpUrl.port);
	if (cdpUrl.protocol !== "http:" || cdpUrl.hostname !== "127.0.0.1" || cdpUrl.username !== "" || cdpUrl.password !== "" || cdpUrl.port === "" || !Number.isInteger(port) || port < 1 || port > 65535 || cdpUrl.pathname !== "/" || cdpUrl.search !== "" || cdpUrl.hash !== "") return;
	return {
		cdpUrl: value.cdpUrl,
		launcherPath: value.launcherPath
	};
}
function parseAssignment(value) {
	if (!isRecord(value) || !hasExactKeys$1(value, [
		"agentId",
		"runId",
		"operationalRunInstance",
		"agentRuntimeIdentityToken",
		"turnId",
		"prompt",
		"suppressPromptTranscript",
		"workspaceDir",
		"modelRef",
		"inferenceOptions",
		"initialMessages",
		"transcript",
		"liveEvents",
		"toolAuthority"
	], [
		"systemPrompt",
		"browser",
		"permissionMode",
		"workerContainmentRoot"
	])) return;
	const hasPermissionMode = Object.hasOwn(value, "permissionMode");
	if (hasPermissionMode !== Object.hasOwn(value, "workerContainmentRoot") || hasPermissionMode && (!Value.Check(SessionPermissionModeSchema, value.permissionMode) || typeof value.workerContainmentRoot !== "string" || !isIdentifier$1(value.workerContainmentRoot) || !isAbsoluteHostPath(value.workerContainmentRoot))) return;
	if (!isIdentifier$1(value.agentId) || !isIdentifier$1(value.runId) || !isRecord(value.operationalRunInstance) || !isIdentifier$1(value.operationalRunInstance.instanceId) || value.operationalRunInstance.runId !== value.runId || typeof value.agentRuntimeIdentityToken !== "string" || value.agentRuntimeIdentityToken.length < 1 || value.agentRuntimeIdentityToken.length > 16384 || !isIdentifier$1(value.turnId) || typeof value.prompt !== "string" || typeof value.suppressPromptTranscript !== "boolean" || !isIdentifier$1(value.workspaceDir) || !isAbsoluteHostPath(value.workspaceDir) || value.systemPrompt !== void 0 && typeof value.systemPrompt !== "string" || !Array.isArray(value.initialMessages) || value.initialMessages.length > 1024 || !value.initialMessages.every((message) => Value.Check(WorkerTranscriptMessageSchema, message))) return;
	const toolAuthority = parseToolAuthority(value.toolAuthority);
	if (!toolAuthority) return;
	const browser = value.browser === void 0 ? void 0 : parseBrowserLaunchDescriptor(value.browser);
	if (value.browser !== void 0 && !browser) return;
	if (!Value.Check(WorkerInferenceModelRefSchema, value.modelRef) || !isInferenceOptions(value.inferenceOptions)) return;
	if (!isRecord(value.transcript) || !hasExactKeys$1(value.transcript, ["baseLeafId", "nextSeq"]) || value.transcript.baseLeafId !== null && !isIdentifier$1(value.transcript.baseLeafId) || !isSafeSequence(value.transcript.nextSeq, 1)) return;
	if (!isRecord(value.liveEvents) || !hasExactKeys$1(value.liveEvents, ["ackedSeq", "nextSeq"]) || !isSafeSequence(value.liveEvents.ackedSeq, 0) || !isSafeSequence(value.liveEvents.nextSeq, 1) || value.liveEvents.nextSeq !== value.liveEvents.ackedSeq + 1) return;
	return {
		...value,
		operationalRunInstance: Object.freeze({
			instanceId: value.operationalRunInstance.instanceId,
			runId: value.runId
		}),
		toolAuthority,
		...browser ? { browser } : {}
	};
}
function buildWorkerConnectParams(descriptor) {
	return {
		minProtocol: 4,
		maxProtocol: 4,
		client: {
			id: GATEWAY_CLIENT_IDS.WORKER,
			version: descriptor.admission.handshake.openclawVersion,
			platform: process.platform,
			mode: GATEWAY_CLIENT_MODES.WORKER
		},
		role: "worker",
		admission: {
			...descriptor.admission,
			runId: descriptor.assignment.runId
		}
	};
}
function validateWorkerLaunchPlan(candidate) {
	const frame = {
		type: "req",
		id: "launch-validation",
		method: "connect",
		params: buildWorkerConnectParams(candidate)
	};
	if (!Value.Check(WorkerConnectRequestFrameSchema, frame) || candidate.admission.sessionId === null || candidate.admission.ownerEpoch < 1 || !isWorkerTranscriptMessageFrameSafe({
		role: "user",
		content: [{
			type: "text",
			text: candidate.assignment.prompt
		}],
		timestamp: Number.MAX_SAFE_INTEGER
	})) throw new Error("invalid worker launch descriptor");
	return candidate;
}
function parseWorkerLaunchPlan(value) {
	if (!isRecord(value) || !hasExactKeys$1(value, [
		"version",
		"admission",
		"assignment"
	]) || value.version !== LAUNCH_VERSION) throw new Error("invalid worker launch descriptor");
	const assignment = parseAssignment(value.assignment);
	if (!assignment || !isRecord(value.admission)) throw new Error("invalid worker launch descriptor");
	return validateWorkerLaunchPlan({
		version: LAUNCH_VERSION,
		admission: value.admission,
		assignment
	});
}
function completeWorkerLaunchDescriptor(plan, connectionEndpoint) {
	const parsedPlan = parseWorkerLaunchPlan(plan);
	const parsedEndpoint = parseWorkerConnectionEndpoint(connectionEndpoint);
	if (!parsedEndpoint) throw new Error("invalid worker launch descriptor");
	return {
		...parsedPlan,
		connectionEndpoint: parsedEndpoint
	};
}
function parseWorkerLaunchDescriptor(value) {
	if (!isRecord(value) || !hasExactKeys$1(value, [
		"version",
		"connectionEndpoint",
		"admission",
		"assignment"
	])) throw new Error("invalid worker launch descriptor");
	return completeWorkerLaunchDescriptor({
		version: value.version,
		admission: value.admission,
		assignment: value.assignment
	}, value.connectionEndpoint);
}
//#endregion
//#region src/worker/node-supervisor-protocol.ts
const IDENTIFIER_MAX_CHARS = 256;
const GATEWAY_NAMESPACE_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/u;
const NODE_WORKER_SUPERVISOR_CONTROL_REQUEST_MAX_BYTES = 4 * 1024;
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
function assertNodeWorkerLaunchIdentity(input, descriptor) {
	if (descriptor.assignment.turnId !== input.launchId) throw new Error("INVALID_REQUEST: launchId must match descriptor assignment turnId");
	if (descriptor.admission.handshake.bundleHash !== input.expectedBundleHash) throw new Error("INVALID_REQUEST: descriptor bundle hash does not match expectedBundleHash");
}
function parseNodeWorkerLaunchInput(raw) {
	return validateNodeWorkerLaunchInput(decodeRequest(raw));
}
function validateNodeWorkerLaunchInput(value) {
	if (!isRecord(value) || !hasExactKeys(value, [
		"environmentSession",
		"launchId",
		"gatewayNamespace",
		"expectedBundleHash",
		"placementGeneration",
		"descriptor"
	])) throw new Error("INVALID_REQUEST: invalid node worker launch request");
	if (value.environmentSession !== 1) throw new Error("INVALID_REQUEST: node worker environment lifetime support required");
	const launchId = requireIdentifier(value.launchId, "launchId");
	const gatewayNamespace = requireIdentifier(value.gatewayNamespace, "gatewayNamespace");
	if (!GATEWAY_NAMESPACE_PATTERN.test(gatewayNamespace)) throw new Error("INVALID_REQUEST: gatewayNamespace must be a safe bounded path component");
	if (!isPlanHash(value.expectedBundleHash)) throw new Error("INVALID_REQUEST: expectedBundleHash must be 64 lowercase hexadecimal characters");
	let descriptor;
	try {
		descriptor = parseWorkerLaunchPlan(value.descriptor);
	} catch {
		throw new Error("INVALID_REQUEST: invalid worker launch descriptor");
	}
	assertNodeWorkerLaunchIdentity({
		launchId,
		expectedBundleHash: value.expectedBundleHash
	}, descriptor);
	return {
		environmentSession: 1,
		launchId,
		gatewayNamespace,
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
	if (!raw || Buffer.byteLength(raw, "utf8") > NODE_WORKER_SUPERVISOR_CONTROL_REQUEST_MAX_BYTES) throw new Error("INVALID_REQUEST: invalid node worker cancel request");
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
function parseNodeWorkerEnvironmentStopInput(raw) {
	if (!raw || Buffer.byteLength(raw, "utf8") > NODE_WORKER_SUPERVISOR_CONTROL_REQUEST_MAX_BYTES) throw new Error("INVALID_REQUEST: invalid node worker environment stop request");
	const value = decodeRequest(raw);
	if (!isRecord(value) || !hasExactKeys(value, [
		"gatewayNamespace",
		"environmentId",
		"sessionId",
		"ownerEpoch"
	])) throw new Error("INVALID_REQUEST: invalid node worker environment stop request");
	const gatewayNamespace = requireIdentifier(value.gatewayNamespace, "gatewayNamespace");
	if (!GATEWAY_NAMESPACE_PATTERN.test(gatewayNamespace)) throw new Error("INVALID_REQUEST: gatewayNamespace must be a safe bounded path component");
	return {
		gatewayNamespace,
		environmentId: requireIdentifier(value.environmentId, "environmentId"),
		sessionId: requireIdentifier(value.sessionId, "sessionId"),
		ownerEpoch: requireNonNegativeInteger(value.ownerEpoch, "ownerEpoch")
	};
}
function nodeWorkerPlanHash(input) {
	return createHash("sha256").update(stableStringify({
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
//#region src/worker/worker-connection-contract.ts
const FENCED_CLOSE_REASONS = /* @__PURE__ */ new Set(["credential-replaced", "owner-epoch-mismatch"]);
function isFencedCloseReason(reason) {
	return FENCED_CLOSE_REASONS.has(reason);
}
var WorkerConnectionInterruptedError = class extends Error {
	constructor(message = "worker connection interrupted") {
		super(message);
		this.name = "WorkerConnectionInterruptedError";
	}
};
var WorkerConnectionStoppedError = class extends Error {
	constructor(message = "worker connection stopped") {
		super(message);
		this.name = "WorkerConnectionStoppedError";
	}
};
var WorkerAdmissionError = class extends Error {
	constructor(reason, retryable) {
		super(`worker admission rejected: ${reason}`);
		this.reason = reason;
		this.retryable = retryable;
		this.name = "WorkerAdmissionError";
	}
};
const WORKER_ADMISSION_DEADLINE_MS = 12e4;
var WorkerAdmissionDeadlineExceededError = class extends Error {
	constructor(diagnosis) {
		super(diagnosis);
		this.name = "WorkerAdmissionDeadlineExceededError";
	}
};
function parseWorkerAdmissionDeadlineResult(value) {
	if (isRecord(value) && Object.keys(value).length === 3 && value.status === "not-started" && value.reason === "admission-deadline" && typeof value.errorText === "string" && value.errorText.length > 0 && Buffer.byteLength(value.errorText, "utf8") <= 4096 && !/[\r\n\0]/u.test(value.errorText)) return {
		status: value.status,
		reason: value.reason,
		errorText: value.errorText
	};
}
var WorkerFencedError = class extends Error {
	constructor(reason) {
		super(`worker fenced: ${reason}`);
		this.reason = reason;
		this.name = "WorkerFencedError";
	}
};
function resolvePositiveTimeout(value, fallback) {
	if (value === void 0) return fallback;
	if (!Number.isSafeInteger(value) || value <= 0) throw new Error("worker connection timeout must be a positive safe integer");
	return value;
}
function toWorkerConnectionError(error) {
	return toStructuredErrorObject(error);
}
function formatWorkerConnectionFailure(options, error, attempts) {
	const endpoint = options.endpoint;
	let address;
	if (endpoint.kind === "websocket") {
		const url = new URL(endpoint.url);
		address = `${url.hostname}:${url.port || (url.protocol === "wss:" ? "443" : "80")}`;
	} else address = endpoint.socketPath;
	const target = truncateUtf16Safe(address, 128);
	let detail = toWorkerConnectionError(error).message;
	const access = endpoint.kind === "websocket" ? endpoint.cloudflareAccess : void 0;
	const credentials = [options.connectParams.admission.credential, ...access ? [access.clientId, access.clientSecret] : []];
	for (const credential of credentials) for (const value of [
		credential,
		encodeURIComponent(credential),
		JSON.stringify(credential).slice(1, -1)
	]) if (value) detail = detail.replaceAll(value, "[REDACTED]");
	if (endpoint.kind === "websocket") detail = detail.replaceAll(endpoint.url, target);
	const cause = truncateUtf16Safe(redactSensitiveText(detail, { mode: "tools" }).replace(/\s+/gu, " ").trim(), 160) || "connection failed";
	if (attempts !== void 0) return `worker admission deadline exceeded after ${attempts} attempts to ${target}: ${cause}`;
	return `worker could not reach gateway ${target}: ${cause}; ${endpoint.kind === "websocket" ? "check TLS pin/publicUrl configuration" : "check the local gateway socket"}`;
}
//#endregion
export { buildCloudflareAccessHeaders as A, parseWorkerLaunchDescriptor as C, resolveWorkerConnectionTarget as D, parseWorkerConnectionEndpoint as E, CF_ACCESS_CLIENT_ID_HEADER as O, completeWorkerLaunchDescriptor as S, WorkerConnectionEndpointError as T, parseNodeWorkerLaunchInput as _, WorkerConnectionStoppedError as a, validateNodeWorkerLaunchInput as b, isFencedCloseReason as c, toWorkerConnectionError as d, NODE_WORKER_CONNECTION_FAILURE_MESSAGE_TYPE as f, parseNodeWorkerEnvironmentStopInput as g, parseNodeWorkerConnectionFailureMessage as h, WorkerConnectionInterruptedError as i, CF_ACCESS_CLIENT_SECRET_HEADER as k, parseWorkerAdmissionDeadlineResult as l, parseNodeWorkerCancelInput as m, WorkerAdmissionDeadlineExceededError as n, WorkerFencedError as o, nodeWorkerPlanHash as p, WorkerAdmissionError as r, formatWorkerConnectionFailure as s, WORKER_ADMISSION_DEADLINE_MS as t, resolvePositiveTimeout as u, parseNodeWorkerLookupInput as v, parseWorkerLaunchPlan as w, buildWorkerConnectParams as x, parseNodeWorkerSupervisorReceipt as y };
