import "./src-BkwWvwB2.js";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { Y as WORKER_PROTOCOL_MAX_PAYLOAD_BYTES, u as WORKER_PROVIDER_REPLAY_MAX_DATA_BYTES } from "./worker-admission-R0mXKdG7.js";
import { t as redactAgentDiagnosticPayload } from "./diagnostic-redaction-BaYiZsI1.js";
//#region src/worker/transcript-message.ts
const SIZE_FRAME_ID = "00000000-0000-4000-8000-000000000000";
const WORKER_PROVIDER_REPLAY_LOCAL_RETRY_MESSAGE = "Cloud worker could not preserve authoritative provider replay. Stop or reclaim the cloud worker, then retry locally.";
function cloneTextContent(part) {
	return {
		type: "text",
		text: part.text,
		...part.textSignature ? { textSignature: part.textSignature } : {}
	};
}
function cloneImageContent(part) {
	return {
		type: "image",
		data: part.data,
		mimeType: part.mimeType
	};
}
function providerReplayUnavailable(details) {
	return {
		kind: "provider-replay-unavailable",
		details
	};
}
function cloneProviderReplay(state) {
	return {
		v: state.v,
		type: state.type,
		...state.id === void 0 ? {} : { id: state.id },
		data: state.data,
		...state.replayIndex === void 0 ? {} : { replayIndex: state.replayIndex },
		provider: state.provider,
		api: state.api,
		model: state.model,
		...state.baseUrlHash === void 0 ? {} : { baseUrlHash: state.baseUrlHash },
		...state.sessionHash === void 0 ? {} : { sessionHash: state.sessionHash },
		...state.authProfileHash === void 0 ? {} : { authProfileHash: state.authProfileHash }
	};
}
function redactWorkerDiagnosticText(value) {
	const redacted = redactAgentDiagnosticPayload(value);
	return typeof redacted === "string" ? redacted : "[unreadable diagnostic text]";
}
function projectWorkerDiagnostic(diagnostic) {
	const details = asOptionalRecord(redactAgentDiagnosticPayload(diagnostic.details));
	const error = diagnostic.error;
	return {
		type: diagnostic.type,
		timestamp: diagnostic.timestamp,
		...error ? { error: {
			message: redactWorkerDiagnosticText(error.message),
			...error.name ? { name: redactWorkerDiagnosticText(error.name) } : {},
			...error.stack ? { stack: redactWorkerDiagnosticText(error.stack) } : {},
			...error.code === void 0 ? {} : { code: error.code }
		} } : {},
		...details ? { details } : {}
	};
}
function workerTranscriptMessageFrameBytes(message) {
	const frame = {
		type: "req",
		id: SIZE_FRAME_ID,
		method: "worker.transcript.commit",
		params: {
			runEpoch: Number.MAX_SAFE_INTEGER,
			seq: Number.MAX_SAFE_INTEGER,
			baseLeafId: "x".repeat(256),
			messages: [message]
		}
	};
	try {
		return Buffer.byteLength(JSON.stringify(frame), "utf8");
	} catch {
		return;
	}
}
function projectWorkerProviderReplay(params) {
	if (!params.providerReplay) return {
		kind: "complete",
		message: params.message
	};
	const dataBytes = Buffer.byteLength(params.providerReplay.data, "utf8");
	if (dataBytes > WORKER_PROVIDER_REPLAY_MAX_DATA_BYTES) return providerReplayUnavailable({
		bytes: dataBytes,
		limitBytes: WORKER_PROVIDER_REPLAY_MAX_DATA_BYTES,
		reason: "provider-replay-data-budget"
	});
	const candidate = {
		...params.message,
		providerReplay: cloneProviderReplay(params.providerReplay)
	};
	if (params.purpose === "inference") return {
		kind: "complete",
		message: candidate
	};
	const frameBytes = workerTranscriptMessageFrameBytes(candidate);
	if (frameBytes === void 0 || frameBytes > 65536) return providerReplayUnavailable({
		bytes: frameBytes ?? 65537,
		limitBytes: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES,
		reason: "transcript-commit-frame-budget"
	});
	return {
		kind: "complete",
		message: candidate
	};
}
function toWorkerAssistantMessage(message) {
	return {
		role: "assistant",
		content: message.content.map((part) => {
			if (part.type === "text") return cloneTextContent(part);
			if (part.type === "thinking") return {
				type: "thinking",
				thinking: part.thinking,
				...part.thinkingSignature ? { thinkingSignature: part.thinkingSignature } : {},
				...part.redacted === void 0 ? {} : { redacted: part.redacted }
			};
			return {
				type: "toolCall",
				id: part.id,
				name: part.name,
				arguments: structuredClone(part.arguments),
				...part.thoughtSignature ? { thoughtSignature: part.thoughtSignature } : {},
				...part.executionMode ? { executionMode: part.executionMode } : {}
			};
		}),
		api: message.api,
		provider: message.provider,
		model: message.model,
		...message.responseModel ? { responseModel: message.responseModel } : {},
		...message.responseId ? { responseId: message.responseId } : {},
		...message.diagnostics ? { diagnostics: message.diagnostics.map(projectWorkerDiagnostic) } : {},
		usage: {
			input: message.usage.input,
			output: message.usage.output,
			cacheRead: message.usage.cacheRead,
			cacheWrite: message.usage.cacheWrite,
			...message.usage.contextUsage ? { contextUsage: structuredClone(message.usage.contextUsage) } : {},
			totalTokens: message.usage.totalTokens,
			cost: {
				input: message.usage.cost.input,
				output: message.usage.cost.output,
				cacheRead: message.usage.cost.cacheRead,
				cacheWrite: message.usage.cost.cacheWrite,
				total: message.usage.cost.total,
				...message.usage.cost.totalOrigin ? { totalOrigin: message.usage.cost.totalOrigin } : {}
			}
		},
		stopReason: message.stopReason,
		...message.errorMessage ? { errorMessage: redactWorkerDiagnosticText(message.errorMessage) } : {},
		...message.errorCode ? { errorCode: message.errorCode } : {},
		...message.errorType ? { errorType: message.errorType } : {},
		...message.errorBody ? { errorBody: redactWorkerDiagnosticText(message.errorBody) } : {},
		timestamp: message.timestamp
	};
}
function toWorkerTranscriptMessage(message, purpose) {
	if (message.role === "user") return {
		kind: "complete",
		message: {
			role: "user",
			content: typeof message.content === "string" ? [{
				type: "text",
				text: message.content
			}] : message.content.map((part) => part.type === "text" ? cloneTextContent(part) : cloneImageContent(part)),
			timestamp: message.timestamp
		}
	};
	if (message.role === "assistant") return projectWorkerProviderReplay({
		message: toWorkerAssistantMessage(message),
		providerReplay: message.providerReplay,
		purpose
	});
	if (message.role === "toolResult") return {
		kind: "complete",
		message: {
			role: "toolResult",
			toolCallId: message.toolCallId,
			toolName: message.toolName,
			content: message.content.map((part) => part.type === "text" ? cloneTextContent(part) : cloneImageContent(part)),
			...message.details === void 0 ? {} : { details: redactAgentDiagnosticPayload(message.details) },
			isError: message.isError,
			timestamp: message.timestamp
		}
	};
}
function isWorkerTranscriptMessageFrameSafe(message) {
	const frameBytes = workerTranscriptMessageFrameBytes(message);
	return frameBytes !== void 0 && frameBytes <= 65536;
}
//#endregion
export { projectWorkerProviderReplay as a, isWorkerTranscriptMessageFrameSafe as i, cloneImageContent as n, toWorkerTranscriptMessage as o, cloneTextContent as r, WORKER_PROVIDER_REPLAY_LOCAL_RETRY_MESSAGE as t };
