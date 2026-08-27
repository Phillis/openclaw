import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import "./worker-protocol-primitives-Ch87u2k0.js";
import { C as parseWorkerLaunchDescriptor, l as parseWorkerAdmissionDeadlineResult } from "./worker-connection-contract-CLo4JQpE.js";
//#region src/worker/worker-process-protocol.ts
function parseWorkerProcessRequest(value) {
	if (!isRecord(value) || typeof value.turnId !== "string" || !value.turnId.trim() || value.turnId.length > 256) throw new Error("invalid managed worker request");
	if (value.type === "cancel" && Object.keys(value).length === 2) return {
		type: "cancel",
		turnId: value.turnId
	};
	if (value.type === "turn" && Object.keys(value).length === 3) {
		const descriptor = parseWorkerLaunchDescriptor(value.descriptor);
		if (descriptor.assignment.turnId !== value.turnId) throw new Error("managed worker request disagrees with its assigned turn");
		return {
			type: "turn",
			turnId: value.turnId,
			descriptor
		};
	}
	throw new Error("invalid managed worker request");
}
function parseWorkerRuntimeResult(value) {
	const admissionFailure = parseWorkerAdmissionDeadlineResult(value);
	if (admissionFailure) return admissionFailure;
	if (!isRecord(value)) return null;
	if (value.status === "fenced" && (value.reason === "credential-replaced" || value.reason === "owner-epoch-mismatch") && Object.keys(value).length === 2) return {
		status: value.status,
		reason: value.reason
	};
	if ((value.transcriptLeafId === null || typeof value.transcriptLeafId === "string") && typeof value.transcriptNextSeq === "number" && Number.isSafeInteger(value.transcriptNextSeq) && value.transcriptNextSeq >= 1) {
		const transcript = {
			transcriptLeafId: value.transcriptLeafId,
			transcriptNextSeq: value.transcriptNextSeq
		};
		if (value.status === "completed" && Object.keys(value).length === 3) return {
			status: value.status,
			...transcript
		};
		if (value.status === "failed" && value.reason === "turn-failed" && Object.keys(value).length === 4) return {
			status: value.status,
			reason: value.reason,
			...transcript
		};
	}
	return null;
}
function parseWorkerProcessResult(value) {
	if (!isRecord(value) || Object.keys(value).length !== 4 || value.type !== "result" || typeof value.turnId !== "string" || !value.turnId.trim() || value.turnId.length > 256 || typeof value.retainWorker !== "boolean") return null;
	const result = parseWorkerRuntimeResult(value.result);
	if (!result || value.retainWorker && result.status !== "completed" && result.status !== "failed") return null;
	return {
		type: "result",
		turnId: value.turnId,
		result,
		retainWorker: value.retainWorker
	};
}
//#endregion
export { parseWorkerProcessResult as n, parseWorkerRuntimeResult as r, parseWorkerProcessRequest as t };
