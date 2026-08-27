import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { n as GATEWAY_CLIENT_IDS, r as GATEWAY_CLIENT_MODES } from "./client-info-yubNQC1L.js";
import "./version-CwNT1gaY.js";
import { r as resolveGatewayWebSocketTransport, t as GatewayWebSocketTransportConfigurationError } from "./websocket-transport-CK5UrhFX.js";
import { U as WorkerTranscriptMessageSchema, b as WorkerConnectRequestFrameSchema } from "./worker-admission-R0mXKdG7.js";
import { c as WorkerInferenceModelRefSchema, l as WorkerInferenceOptionsSchema } from "./worker-inference-DaOiVsCq.js";
import { a as isWorkerToolName } from "./tool-authority-DJXVjqm0.js";
import { i as isWorkerTranscriptMessageFrameSafe } from "./transcript-message-CAkPZKyT.js";
import path from "node:path";
import { Value } from "typebox/value";
//#region src/worker/worker-connection-endpoint.ts
var WorkerConnectionEndpointError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "WorkerConnectionEndpointError";
	}
};
function hasExactKeys$1(value, required, optional = []) {
	const allowed = /* @__PURE__ */ new Set([...required, ...optional]);
	return required.every((key) => key in value) && Object.keys(value).every((key) => allowed.has(key));
}
function parseUnixEndpoint(value) {
	if (!hasExactKeys$1(value, ["kind", "socketPath"]) || value.kind !== "unix" || typeof value.socketPath !== "string" || value.socketPath.length > 256 || !path.isAbsolute(value.socketPath) || value.socketPath.includes(":")) return;
	return {
		kind: "unix",
		socketPath: value.socketPath
	};
}
function parseWebSocketEndpoint(value) {
	if (!hasExactKeys$1(value, ["kind", "url"], ["tlsFingerprint"]) || value.kind !== "websocket" || typeof value.url !== "string" || value.url.length > 4096 || value.tlsFingerprint !== void 0 && (typeof value.tlsFingerprint !== "string" || value.tlsFingerprint.trim().length === 0 || value.tlsFingerprint.length > 256)) return;
	let url;
	try {
		url = new URL(value.url);
	} catch {
		return;
	}
	if (url.protocol !== "ws:" && url.protocol !== "wss:" || url.username !== "" || url.password !== "" || url.search !== "" || url.hash !== "" || !url.pathname.endsWith("/__openclaw__/worker") || value.tlsFingerprint !== void 0 && url.protocol !== "wss:") return;
	return {
		kind: "websocket",
		url: value.url,
		...value.tlsFingerprint === void 0 ? {} : { tlsFingerprint: value.tlsFingerprint }
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
	try {
		const transport = resolveGatewayWebSocketTransport({
			url: endpoint.url,
			tlsFingerprint: endpoint.tlsFingerprint,
			env,
			options: {}
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
const LAUNCH_VERSION = 3;
function hasExactKeys(value, required, optional = []) {
	const allowed = /* @__PURE__ */ new Set([...required, ...optional]);
	return required.every((key) => key in value) && Object.keys(value).every((key) => allowed.has(key));
}
function isIdentifier(value) {
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
	if (!isRecord(value) || !hasExactKeys(value, ["allowedToolNames"]) || !Array.isArray(value.allowedToolNames) || !value.allowedToolNames.every(isWorkerToolName) || new Set(value.allowedToolNames).size !== value.allowedToolNames.length) return;
	return { allowedToolNames: [...value.allowedToolNames] };
}
function parseBrowserLaunchDescriptor(value) {
	if (!isRecord(value) || !hasExactKeys(value, ["cdpUrl", "launcherPath"]) || typeof value.cdpUrl !== "string" || typeof value.launcherPath !== "string" || !isAbsoluteHostPath(value.launcherPath)) return;
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
	if (!isRecord(value) || !hasExactKeys(value, [
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
	], ["systemPrompt", "browser"])) return;
	if (!isIdentifier(value.agentId) || !isIdentifier(value.runId) || !isRecord(value.operationalRunInstance) || !isIdentifier(value.operationalRunInstance.instanceId) || value.operationalRunInstance.runId !== value.runId || typeof value.agentRuntimeIdentityToken !== "string" || value.agentRuntimeIdentityToken.length < 1 || value.agentRuntimeIdentityToken.length > 16384 || !isIdentifier(value.turnId) || typeof value.prompt !== "string" || typeof value.suppressPromptTranscript !== "boolean" || !isIdentifier(value.workspaceDir) || !isAbsoluteHostPath(value.workspaceDir) || value.systemPrompt !== void 0 && typeof value.systemPrompt !== "string" || !Array.isArray(value.initialMessages) || value.initialMessages.length > 1024 || !value.initialMessages.every((message) => Value.Check(WorkerTranscriptMessageSchema, message))) return;
	const toolAuthority = parseToolAuthority(value.toolAuthority);
	if (!toolAuthority) return;
	const browser = value.browser === void 0 ? void 0 : parseBrowserLaunchDescriptor(value.browser);
	if (value.browser !== void 0 && !browser) return;
	if (!Value.Check(WorkerInferenceModelRefSchema, value.modelRef) || !isInferenceOptions(value.inferenceOptions)) return;
	if (!isRecord(value.transcript) || !hasExactKeys(value.transcript, ["baseLeafId", "nextSeq"]) || value.transcript.baseLeafId !== null && !isIdentifier(value.transcript.baseLeafId) || !isSafeSequence(value.transcript.nextSeq, 1)) return;
	if (!isRecord(value.liveEvents) || !hasExactKeys(value.liveEvents, ["ackedSeq", "nextSeq"]) || !isSafeSequence(value.liveEvents.ackedSeq, 0) || !isSafeSequence(value.liveEvents.nextSeq, 1) || value.liveEvents.nextSeq !== value.liveEvents.ackedSeq + 1) return;
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
	if (!isRecord(value) || !hasExactKeys(value, [
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
	if (!isRecord(value) || !hasExactKeys(value, [
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
export { WorkerConnectionEndpointError as a, parseWorkerLaunchPlan as i, completeWorkerLaunchDescriptor as n, parseWorkerConnectionEndpoint as o, parseWorkerLaunchDescriptor as r, resolveWorkerConnectionTarget as s, buildWorkerConnectParams as t };
