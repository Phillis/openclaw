import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as parseBooleanValue } from "./boolean-DmBL0YJK.js";
import { c as redactSecrets } from "./redact-CWP17HFN.js";
import { c as parseAgentSessionKey } from "./session-key-utils-Di3FvABa.js";
import { t as truncateUtf8Prefix } from "./utf8-truncate-Dro7v_iB.js";
import { f as loadSessionEntry } from "./session-accessor.sqlite-entry-CNdoUuFZ.js";
import { n as parseSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.js";
import { r as TRAJECTORY_RUNTIME_EVENT_MAX_BYTES } from "./paths-DtHbXAUb.js";
import "./session-accessor-B-FKZX9M.js";
import { t as sanitizeDiagnosticPayload } from "./payload-redaction-DPHUXa81.js";
import { t as safeJsonStringify } from "./safe-json-CY5cd4H1.js";
import { t as appendSqliteTrajectoryRuntimeEvents } from "./runtime-store.sqlite-BGLqZk_6.js";
import path from "node:path";
//#region src/trajectory/runtime.ts
const TRAJECTORY_RUNTIME_DATA_STRING_MAX_CHARS = 32768;
const TRAJECTORY_RUNTIME_DATA_ARRAY_MAX_ITEMS = 64;
const TRAJECTORY_RUNTIME_DATA_OBJECT_MAX_KEYS = 64;
const TRAJECTORY_RUNTIME_DATA_MAX_DEPTH = 6;
const TRAJECTORY_RUNTIME_FINAL_PROMPT_MAX_BYTES = 4 * 1024;
const TRAJECTORY_RUNTIME_OVERSIZE_DROP_FIRST_DATA_KEYS = [
	"messagesSnapshot",
	"messages",
	"systemPrompt"
];
const OVERSIZE_PRESERVED_DATA_KEYS = [
	"threadId",
	"turnId",
	"timedOut",
	"yieldDetected",
	"aborted",
	"promptError",
	"stopReason",
	"usage",
	"promptCache",
	"prompt"
];
function truncateOversizedTrajectoryEvent(event, line) {
	const bytes = Buffer.byteLength(line, "utf8");
	if (bytes <= 262144) return line;
	const originalData = event.data ?? {};
	const originalDataKeys = Object.keys(originalData);
	const preservedDataKeys = /* @__PURE__ */ new Set();
	const baseData = {
		truncated: true,
		originalBytes: bytes,
		limitBytes: TRAJECTORY_RUNTIME_EVENT_MAX_BYTES,
		reason: "trajectory-event-size-limit"
	};
	const reducedData = { ...originalData };
	const reducedDroppedFields = [];
	for (const key of TRAJECTORY_RUNTIME_OVERSIZE_DROP_FIRST_DATA_KEYS) {
		if (!Object.hasOwn(reducedData, key)) continue;
		delete reducedData[key];
		reducedDroppedFields.push(key);
		const reduced = safeJsonStringify({
			...event,
			data: {
				...reducedData,
				...baseData,
				droppedFields: reducedDroppedFields
			}
		});
		if (reduced && Buffer.byteLength(reduced, "utf8") <= 262144) return reduced;
	}
	const buildTruncatedEventLine = (includeDroppedFields) => {
		const data = { ...baseData };
		for (const key of OVERSIZE_PRESERVED_DATA_KEYS) if (preservedDataKeys.has(key)) data[key] = originalData[key];
		if (includeDroppedFields) {
			const droppedFields = originalDataKeys.filter((key) => !preservedDataKeys.has(key));
			if (droppedFields.length > 0) data.droppedFields = droppedFields;
		}
		const truncated = safeJsonStringify({
			...event,
			data
		});
		if (truncated && Buffer.byteLength(truncated, "utf8") <= 262144) return truncated;
	};
	let best = buildTruncatedEventLine(true) ?? buildTruncatedEventLine(false);
	if (!best) return;
	for (const key of OVERSIZE_PRESERVED_DATA_KEYS) {
		if (!Object.hasOwn(originalData, key)) continue;
		preservedDataKeys.add(key);
		const next = buildTruncatedEventLine(true) ?? buildTruncatedEventLine(false);
		if (next) {
			best = next;
			continue;
		}
		preservedDataKeys.delete(key);
	}
	return best;
}
function truncatedTrajectoryValue(reason, details = {}) {
	return {
		truncated: true,
		reason,
		...details
	};
}
function limitTrajectoryPayloadValue(value, depth = 0, seen = /* @__PURE__ */ new WeakSet()) {
	if (typeof value === "string") {
		if (value.length > TRAJECTORY_RUNTIME_DATA_STRING_MAX_CHARS) return truncatedTrajectoryValue("trajectory-field-size-limit", {
			originalChars: value.length,
			limitChars: TRAJECTORY_RUNTIME_DATA_STRING_MAX_CHARS
		});
		return value;
	}
	if (typeof value !== "object" || value === null) return value;
	if (seen.has(value)) return truncatedTrajectoryValue("trajectory-circular-reference");
	if (depth >= TRAJECTORY_RUNTIME_DATA_MAX_DEPTH) return truncatedTrajectoryValue("trajectory-depth-limit", { limitDepth: TRAJECTORY_RUNTIME_DATA_MAX_DEPTH });
	seen.add(value);
	if (Array.isArray(value)) {
		const limited = value.slice(0, TRAJECTORY_RUNTIME_DATA_ARRAY_MAX_ITEMS).map((item) => limitTrajectoryPayloadValue(item, depth + 1, seen));
		if (value.length > TRAJECTORY_RUNTIME_DATA_ARRAY_MAX_ITEMS) limited.push(truncatedTrajectoryValue("trajectory-array-size-limit", {
			originalLength: value.length,
			limitItems: TRAJECTORY_RUNTIME_DATA_ARRAY_MAX_ITEMS
		}));
		seen.delete(value);
		return limited;
	}
	const record = value;
	const keys = Object.keys(record);
	const limited = {};
	for (const key of keys.slice(0, TRAJECTORY_RUNTIME_DATA_OBJECT_MAX_KEYS)) limited[key] = limitTrajectoryPayloadValue(record[key], depth + 1, seen);
	if (keys.length > TRAJECTORY_RUNTIME_DATA_OBJECT_MAX_KEYS) limited["_truncated"] = truncatedTrajectoryValue("trajectory-object-size-limit", {
		originalKeys: keys.length,
		limitKeys: TRAJECTORY_RUNTIME_DATA_OBJECT_MAX_KEYS
	});
	seen.delete(value);
	return limited;
}
function sanitizeTrajectoryPayload(data) {
	const finalPromptText = data.finalPromptText;
	const redactedFinalPromptText = typeof finalPromptText === "string" ? redactSecrets(finalPromptText) : void 0;
	return redactSecrets(sanitizeDiagnosticPayload(limitTrajectoryPayloadValue(typeof finalPromptText === "string" && typeof redactedFinalPromptText === "string" && (Buffer.byteLength(finalPromptText, "utf8") > TRAJECTORY_RUNTIME_FINAL_PROMPT_MAX_BYTES || Buffer.byteLength(redactedFinalPromptText, "utf8") > TRAJECTORY_RUNTIME_FINAL_PROMPT_MAX_BYTES) ? {
		...data,
		finalPromptText: truncateUtf8Prefix(redactedFinalPromptText, TRAJECTORY_RUNTIME_FINAL_PROMPT_MAX_BYTES),
		finalPromptTextOriginalLength: finalPromptText.length
	} : typeof redactedFinalPromptText === "string" ? {
		...data,
		finalPromptText: redactedFinalPromptText
	} : data)));
}
function describeTrajectoryWriterFlushState(writer) {
	const diagnostics = writer.describeQueue?.();
	if (!diagnostics) return;
	const parts = [
		`pendingWrites=${diagnostics.pendingWrites}`,
		`queuedBytes=${diagnostics.queuedBytes}`,
		`activeOperation=${diagnostics.activeOperation}`,
		`yieldBeforeWrite=${diagnostics.yieldBeforeWrite}`
	];
	if (diagnostics.activeWriteBytes !== void 0) parts.push(`activeWriteBytes=${diagnostics.activeWriteBytes}`);
	if (diagnostics.maxQueuedBytes !== void 0) parts.push(`maxQueuedBytes=${diagnostics.maxQueuedBytes}`);
	if (diagnostics.maxFileBytes !== void 0) parts.push(`maxFileBytes=${diagnostics.maxFileBytes}`);
	return parts.join(" ");
}
function createFileTrajectoryRuntimeSink(writer) {
	return {
		describeFlushState: () => describeTrajectoryWriterFlushState(writer),
		flush: async () => {
			await writer.flush();
		},
		nextSourceSeq: writer.nextSourceSeq,
		write: (_event, line) => {
			writer.write(`${line}\n`);
		}
	};
}
function createSqliteTrajectoryRuntimeSink(params) {
	const target = params.sessionTarget ? {
		agentId: normalizeOptionalString(params.sessionTarget.agentId),
		sessionId: normalizeOptionalString(params.sessionTarget.sessionId),
		sessionKey: normalizeOptionalString(params.sessionTarget.sessionKey),
		storePath: normalizeOptionalString(params.sessionTarget.storePath)
	} : void 0;
	const legacyMarker = parseSqliteSessionFileMarker(params.sessionFile);
	const completeTarget = Boolean(target?.agentId && target.sessionId && target.sessionKey && target.storePath);
	const targetKeyAgentId = parseAgentSessionKey(target?.sessionKey)?.agentId;
	const requestedSessionKey = normalizeOptionalString(params.sessionKey);
	const completeTargetKeyEntry = completeTarget && target?.agentId && target.sessionKey && target.storePath ? loadSessionEntry({
		agentId: target.agentId,
		sessionKey: target.sessionKey,
		storePath: target.storePath
	}) : void 0;
	if (completeTarget && (requestedSessionKey && target?.sessionKey !== requestedSessionKey || targetKeyAgentId && target?.agentId !== targetKeyAgentId || completeTargetKeyEntry && completeTargetKeyEntry.sessionId !== target?.sessionId)) return null;
	const targetKeyEntry = target?.sessionKey && legacyMarker && !completeTarget ? loadSessionEntry({
		agentId: legacyMarker.agentId,
		sessionKey: target.sessionKey,
		storePath: legacyMarker.storePath
	}) : void 0;
	if (target && !completeTarget && legacyMarker && (target.agentId && target.agentId !== legacyMarker.agentId || target.sessionId && target.sessionId !== legacyMarker.sessionId || targetKeyAgentId && targetKeyAgentId !== legacyMarker.agentId || target.sessionKey && targetKeyEntry?.sessionId !== legacyMarker.sessionId || target.storePath && path.resolve(target.storePath) !== path.resolve(legacyMarker.storePath))) return null;
	const marker = target?.agentId && target.sessionId && target.sessionKey && target.storePath ? {
		agentId: target.agentId,
		sessionId: target.sessionId,
		sessionKey: target.sessionKey,
		storePath: target.storePath
	} : legacyMarker;
	if (!marker || marker.sessionId !== params.sessionId) return null;
	let pendingEvents = [];
	let queuedBytes = 0;
	return {
		describeFlushState: () => pendingEvents.length > 0 ? `pendingRows=${pendingEvents.length} queuedBytes=${queuedBytes} activeOperation=sqlite-append` : void 0,
		flush: async () => {
			if (pendingEvents.length === 0) return;
			const events = pendingEvents;
			pendingEvents = [];
			queuedBytes = 0;
			appendSqliteTrajectoryRuntimeEvents({
				agentId: marker.agentId,
				env: params.env,
				maxRuntimeBytes: params.maxRuntimeFileBytes,
				sessionId: marker.sessionId,
				storePath: marker.storePath
			}, events);
		},
		write: (event, line) => {
			pendingEvents.push(event);
			queuedBytes += Buffer.byteLength(line, "utf8") + 1;
		}
	};
}
function toTrajectoryToolDefinitions(tools) {
	return tools.flatMap((tool) => {
		const name = tool.name?.trim();
		if (!name) return [];
		return [{
			name,
			description: tool.description,
			parameters: sanitizeDiagnosticPayload(limitTrajectoryPayloadValue(tool.parameters))
		}];
	}).toSorted((left, right) => left.name.localeCompare(right.name));
}
function createTrajectoryRuntimeRecorder(params) {
	const env = params.env ?? process.env;
	if (!(parseBooleanValue(env.OPENCLAW_TRAJECTORY) ?? true)) return null;
	const maxRuntimeFileBytes = Math.max(1, Math.floor(params.maxRuntimeFileBytes ?? 10485760));
	const sink = params.writer ? createFileTrajectoryRuntimeSink(params.writer) : createSqliteTrajectoryRuntimeSink({
		env,
		maxRuntimeFileBytes,
		sessionFile: params.sessionFile,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		sessionTarget: params.sessionTarget
	});
	if (!sink) return null;
	let seq = 0;
	const traceId = params.sessionId;
	const buildEvent = (type, data) => {
		const nextSeq = seq + 1;
		const sourceSeq = sink.nextSourceSeq?.() ?? nextSeq;
		const event = {
			traceSchema: "openclaw-trajectory",
			schemaVersion: 1,
			traceId,
			source: "runtime",
			type,
			ts: (/* @__PURE__ */ new Date()).toISOString(),
			seq: nextSeq,
			sourceSeq,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			runId: params.runId,
			workspaceDir: params.workspaceDir,
			provider: params.provider,
			modelId: params.modelId,
			modelApi: params.modelApi,
			data: data ? sanitizeTrajectoryPayload(data) : void 0
		};
		const line = safeJsonStringify(event);
		if (!line) return;
		const boundedLine = truncateOversizedTrajectoryEvent(event, line);
		if (!boundedLine) return;
		const boundedEvent = JSON.parse(boundedLine);
		seq = nextSeq;
		return {
			event: boundedEvent,
			line: boundedLine
		};
	};
	return {
		enabled: true,
		recordEvent: (type, data) => {
			const built = buildEvent(type, data);
			if (!built) return;
			sink.write(built.event, built.line);
		},
		flush: async () => {
			await sink.flush();
		},
		describeFlushState: () => sink.describeFlushState()
	};
}
//#endregion
export { toTrajectoryToolDefinitions as n, createTrajectoryRuntimeRecorder as t };
