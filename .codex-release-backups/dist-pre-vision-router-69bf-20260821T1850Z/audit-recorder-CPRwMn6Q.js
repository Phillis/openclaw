import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { c as normalizeOptionalLowercaseString, h as readNonEmptyStringPreservingWhitespace } from "./string-coerce-CIXf7egm.js";
import { o as asDateTimestampMs } from "./number-coercion-oCkfUEEq.js";
import { c as redactSensitiveText } from "./redact-DP7p9QfH.js";
import { w as resolveStateDir } from "./paths-CqeDjSA4.js";
import { t as createSubsystemLogger } from "./subsystem-DNgaGOch.js";
import { f as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db.paths-gKE3myqW.js";
import "./openclaw-state-db-BciZ4rHE.js";
import { t as isAllowedToolCallName } from "./tool-call-shared-BxbmRH0F.js";
import { i as buildAgentRunTerminalOutcomeFromLifecycleEvent, o as classifyAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-CpRY9lPn.js";
import { t as mergeAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-merge-DXNYLPhQ.js";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createHash, randomUUID } from "node:crypto";
import path from "node:path";
import { Worker } from "node:worker_threads";
//#region src/audit/audit-event-writer.ts
/** Non-blocking worker-thread writer for Gateway audit metadata. */
const MAX_PENDING_AUDIT_EVENTS = 4096;
const AUDIT_WRITER_SHUTDOWN_TIMEOUT_MS = OPENCLAW_SQLITE_BUSY_TIMEOUT_MS + 5e3;
function formatAuditWriterError(error) {
	return truncateUtf16Safe(redactSensitiveText(error instanceof Error ? error.message : String(error), { mode: "tools" }), 512);
}
function resolveAuditEventWriterUrl(currentModuleUrl = import.meta.url) {
	const currentPath = fileURLToPath(currentModuleUrl);
	const distIndex = currentPath.replaceAll(path.sep, "/").lastIndexOf("/dist/");
	if (distIndex >= 0) {
		const distRoot = currentPath.slice(0, distIndex + 6);
		return pathToFileURL(path.join(distRoot, "audit", "audit-event-writer.worker.js"));
	}
	const extension = path.extname(currentPath) || ".js";
	return new URL(`./audit-event-writer.worker${extension}`, currentModuleUrl);
}
/** Start one bounded worker queue. SQLite contention never blocks the agent-event callback. */
function createAuditEventWriter(options = {}) {
	const workerUrl = options.workerUrl ?? resolveAuditEventWriterUrl();
	const sourceWorkerExecArgv = workerUrl.pathname.endsWith(".ts") ? ["--import", "tsx"] : void 0;
	const maxPending = Math.max(1, Math.floor(options.maxPending ?? MAX_PENDING_AUDIT_EVENTS));
	let worker;
	try {
		worker = new Worker(workerUrl, {
			workerData: { stateDir: options.stateDir ?? resolveStateDir(process.env) },
			execArgv: sourceWorkerExecArgv
		});
	} catch (error) {
		options.onError?.(formatAuditWriterError(error));
		return {
			ready: Promise.resolve(),
			record: () => false,
			recordExecutionIdentity: () => false,
			recordExecutionDecision: () => false,
			stop: async () => {}
		};
	}
	worker.unref?.();
	let pending = 0;
	let stopped = false;
	let unavailable = false;
	let readyResolved = false;
	let resolveReady;
	const ready = new Promise((resolve) => {
		resolveReady = resolve;
	});
	let resolveStop;
	let stopTimer;
	const markReady = () => {
		if (!readyResolved) {
			readyResolved = true;
			resolveReady();
		}
	};
	const finishStop = () => {
		if (stopTimer) {
			clearTimeout(stopTimer);
			stopTimer = void 0;
		}
		const finish = resolveStop;
		resolveStop = void 0;
		finish?.();
	};
	const fail = (error) => {
		options.onError?.(formatAuditWriterError(error));
	};
	const enqueue = (message) => {
		if (stopped || unavailable || pending >= maxPending) {
			if (!stopped) fail(unavailable ? "audit event writer is unavailable; dropping metadata" : `audit event queue is full (${maxPending}); dropping metadata`);
			return false;
		}
		pending += 1;
		try {
			worker.postMessage(message);
			return true;
		} catch (error) {
			pending -= 1;
			if (message.type !== "record-event") fail(message.type === "record-execution-identity" ? "audit execution identity envelope could not be queued" : "audit execution decision receipt could not be queued");
			else {
				unavailable = true;
				worker.terminate();
				fail(error);
			}
			return false;
		}
	};
	worker.on("message", (message) => {
		switch (message.type) {
			case "ready":
				markReady();
				return;
			case "recorded":
				pending = Math.max(0, pending - 1);
				return;
			case "record-error":
				pending = Math.max(0, pending - 1);
				fail(message.error);
				return;
			case "maintenance-error":
				fail(message.error);
				return;
			case "stopped":
				pending = 0;
				markReady();
				finishStop();
		}
	});
	worker.on("error", (error) => {
		unavailable = true;
		fail(error);
		markReady();
		finishStop();
	});
	worker.on("exit", (code) => {
		unavailable = true;
		if (!stopped) fail(`audit event writer exited with code ${code}`);
		markReady();
		finishStop();
	});
	return {
		ready,
		record: (input) => enqueue({
			type: "record-event",
			input
		}),
		recordExecutionIdentity: (work) => enqueue({
			type: "record-execution-identity",
			work
		}),
		recordExecutionDecision: (receipt) => enqueue({
			type: "record-execution-decision",
			receipt
		}),
		stop: async () => {
			if (stopped) return;
			stopped = true;
			if (unavailable) return;
			await new Promise((resolve) => {
				resolveStop = resolve;
				stopTimer = setTimeout(() => {
					fail("audit event writer shutdown timed out; pending metadata may be lost");
					worker.terminate();
					finishStop();
				}, AUDIT_WRITER_SHUTDOWN_TIMEOUT_MS);
				try {
					worker.postMessage({ type: "stop" });
				} catch (error) {
					fail(error);
					finishStop();
				}
			});
		}
	};
}
//#endregion
//#region src/audit/agent-event-audit.ts
/** Redaction-safe projection from live agent events into durable audit metadata. */
const MAX_TRACKED_RUN_INSTANCES = 1024;
const log$1 = createSubsystemLogger("audit/events");
let persistenceFailureWarned$1 = false;
function auditToolName(value) {
	const toolName = readNonEmptyStringPreservingWhitespace(value)?.trim();
	if (!toolName) return;
	return isAllowedToolCallName(toolName, null) ? toolName : "unknown";
}
function auditToolCallId(value) {
	const toolCallId = readNonEmptyStringPreservingWhitespace(value);
	if (!toolCallId) return;
	return `sha256:${createHash("sha256").update(toolCallId).digest("hex")}`;
}
function legacyAuditSourceId(params) {
	return `${params.runId}:${params.sourceSequence}:${params.occurredAt}:${params.action}`;
}
function projectExplicitAttribution(event) {
	const eventAgentId = readNonEmptyStringPreservingWhitespace(event.agentId);
	return {
		actorType: eventAgentId ? "agent" : "system",
		agentId: eventAgentId ?? "unknown",
		sessionKey: readNonEmptyStringPreservingWhitespace(event.sessionKey),
		sessionId: readNonEmptyStringPreservingWhitespace(event.sessionId)
	};
}
const AUDIT_TERMINAL_BY_CLASSIFICATION = {
	success: { status: "succeeded" },
	timeout: {
		status: "timed_out",
		errorCode: "run_timed_out"
	},
	cancellation: {
		status: "cancelled",
		errorCode: "run_cancelled"
	},
	failure: {
		status: "failed",
		errorCode: "run_failed"
	}
};
function classifyRunTerminal(data, phase) {
	const outcome = buildAgentRunTerminalOutcomeFromLifecycleEvent({
		phase,
		data
	});
	if (outcome.reason === "blocked") return {
		outcome,
		status: "blocked",
		errorCode: "run_blocked"
	};
	return {
		outcome,
		...AUDIT_TERMINAL_BY_CLASSIFICATION[classifyAgentRunTerminalOutcome(outcome)]
	};
}
function projectAgentEvent(event) {
	const runId = readNonEmptyStringPreservingWhitespace(event.runId);
	const phase = readNonEmptyStringPreservingWhitespace(event.data.phase);
	if (!runId || !phase) return;
	const provenance = projectExplicitAttribution(event);
	if (event.stream === "lifecycle" && phase === "start") {
		const occurredAt = asDateTimestampMs(event.data.startedAt) ?? event.ts;
		const action = "agent.run.started";
		return { input: {
			sourceId: legacyAuditSourceId({
				runId,
				sourceSequence: event.seq,
				occurredAt,
				action
			}),
			sourceSequence: event.seq,
			occurredAt,
			kind: "agent_run",
			action,
			status: "started",
			actorType: provenance.actorType,
			actorId: provenance.agentId,
			agentId: provenance.agentId,
			...provenance.sessionKey ? { sessionKey: provenance.sessionKey } : {},
			...provenance.sessionId ? { sessionId: provenance.sessionId } : {},
			runId
		} };
	}
	if (event.stream === "lifecycle" && (phase === "end" || phase === "error")) {
		const { outcome, ...terminal } = classifyRunTerminal(event.data, phase);
		const occurredAt = asDateTimestampMs(event.data.endedAt) ?? event.ts;
		const action = "agent.run.finished";
		return {
			input: {
				sourceId: legacyAuditSourceId({
					runId,
					sourceSequence: event.seq,
					occurredAt,
					action
				}),
				sourceSequence: event.seq,
				occurredAt,
				kind: "agent_run",
				action,
				...terminal,
				actorType: provenance.actorType,
				actorId: provenance.agentId,
				agentId: provenance.agentId,
				...provenance.sessionKey ? { sessionKey: provenance.sessionKey } : {},
				...provenance.sessionId ? { sessionId: provenance.sessionId } : {},
				runId
			},
			terminal: {
				outcome,
				phase
			}
		};
	}
}
/** Project the complete trusted tool-execution lifecycle without private diagnostic content. */
function projectToolExecutionEventToAudit(event) {
	if (event.type === "tool.execution.blocked" && event.deniedReason === "unsupported_tool_schema" && !readNonEmptyStringPreservingWhitespace(event.toolCallId)) return;
	const runId = readNonEmptyStringPreservingWhitespace(event.runId);
	const toolName = auditToolName(event.toolName);
	if (!runId || !toolName) return;
	const toolCallId = auditToolCallId(event.toolCallId);
	const provenance = projectExplicitAttribution(event);
	const occurredAt = asDateTimestampMs(event.sourceTimestampMs) ?? event.ts;
	const attribution = {
		sourceSequence: event.seq,
		occurredAt,
		kind: "tool_action",
		actorType: provenance.actorType,
		actorId: provenance.agentId,
		agentId: provenance.agentId,
		...provenance.sessionKey ? { sessionKey: provenance.sessionKey } : {},
		...provenance.sessionId ? { sessionId: provenance.sessionId } : {},
		runId,
		...toolCallId ? { toolCallId } : {},
		toolName
	};
	if (event.type === "tool.execution.started") {
		const action = "tool.action.started";
		return {
			sourceId: legacyAuditSourceId({
				runId,
				sourceSequence: event.seq,
				occurredAt,
				action
			}),
			...attribution,
			action,
			status: "started"
		};
	}
	const errorCategory = event.type === "tool.execution.error" ? normalizeOptionalLowercaseString(event.errorCategory) : void 0;
	const terminalReason = event.type === "tool.execution.error" ? event.terminalReason : void 0;
	const diagnosticErrorCode = event.type === "tool.execution.error" ? normalizeOptionalLowercaseString(event.errorCode) : void 0;
	const toolCancelled = terminalReason === "cancelled" || terminalReason === void 0 && (errorCategory === "aborted" || errorCategory === "aborterror" || errorCategory === "cancelled" || errorCategory === "canceled");
	const toolTimedOut = terminalReason === "timed_out";
	const terminal = event.type === "tool.execution.completed" ? { status: "succeeded" } : event.type === "tool.execution.blocked" ? {
		status: "blocked",
		errorCode: "tool_blocked"
	} : diagnosticErrorCode === "tool_outcome_unknown" ? {
		status: "unknown",
		errorCode: "tool_outcome_unknown"
	} : toolCancelled ? {
		status: "cancelled",
		errorCode: "tool_cancelled"
	} : toolTimedOut ? {
		status: "timed_out",
		errorCode: "tool_timed_out"
	} : {
		status: "failed",
		errorCode: "tool_failed"
	};
	const action = "tool.action.finished";
	return {
		sourceId: legacyAuditSourceId({
			runId,
			sourceSequence: event.seq,
			occurredAt,
			action
		}),
		...attribution,
		action,
		...terminal
	};
}
/** Create the Gateway-owned non-blocking audit projection and persistence handle. */
function createAgentEventAuditRecorder(options) {
	const writer = options?.writer ?? createAuditEventWriter({
		...options?.stateDir ? { stateDir: options.stateDir } : {},
		onError: (error) => {
			if (!persistenceFailureWarned$1) {
				persistenceFailureWarned$1 = true;
				log$1.warn(`audit event persistence failed: ${error}`);
			}
		}
	});
	const terminalSettleMs = Math.max(0, Math.floor(options?.terminalSettleMs ?? 15e3));
	const pendingTerminals = /* @__PURE__ */ new Map();
	const openRunInstances = /* @__PURE__ */ new Set();
	const settledRunInstances = /* @__PURE__ */ new Set();
	const rememberSettled = (runInstance) => {
		settledRunInstances.delete(runInstance);
		settledRunInstances.add(runInstance);
		if (settledRunInstances.size > MAX_TRACKED_RUN_INSTANCES) {
			const oldest = settledRunInstances.values().next().value;
			if (oldest !== void 0) settledRunInstances.delete(oldest);
		}
	};
	const clearPending = (runInstance) => {
		const pending = pendingTerminals.get(runInstance);
		if (!pending) return;
		clearTimeout(pending.timer);
		pendingTerminals.delete(runInstance);
	};
	const flushPending = (runInstance) => {
		const pending = pendingTerminals.get(runInstance);
		if (!pending) return;
		clearPending(runInstance);
		openRunInstances.delete(runInstance);
		if (writer.record(pending.input)) rememberSettled(runInstance);
	};
	const scheduleTerminal = (runInstance, incoming) => {
		const existing = pendingTerminals.get(runInstance);
		let selected = incoming;
		if (existing) {
			if (existing.phase === "error" && incoming.phase === "end" && incoming.outcome.reason === "completed") selected = existing;
			else selected = mergeAgentRunTerminalOutcome(existing.outcome, incoming.outcome) === existing.outcome ? existing : incoming;
			clearTimeout(existing.timer);
		}
		const timer = setTimeout(() => flushPending(runInstance), terminalSettleMs);
		timer.unref?.();
		pendingTerminals.delete(runInstance);
		pendingTerminals.set(runInstance, {
			...selected,
			timer
		});
		if (pendingTerminals.size > MAX_TRACKED_RUN_INSTANCES) {
			const oldest = pendingTerminals.keys().next().value;
			if (oldest !== void 0) flushPending(oldest);
		}
	};
	return {
		record: (event) => {
			const projection = projectAgentEvent(event);
			if (!projection) return;
			const runInstance = `${event.lifecycleGeneration ?? "unknown"}\0${event.runId}`;
			if (!projection.terminal) {
				const alreadyOpen = openRunInstances.has(runInstance);
				clearPending(runInstance);
				settledRunInstances.delete(runInstance);
				if (alreadyOpen) return;
				openRunInstances.add(runInstance);
				writer.record(projection.input);
				return;
			}
			if (settledRunInstances.has(runInstance)) return;
			if (projection.terminal.outcome.reason === "completed" && !pendingTerminals.has(runInstance)) {
				openRunInstances.delete(runInstance);
				if (writer.record(projection.input)) rememberSettled(runInstance);
				return;
			}
			scheduleTerminal(runInstance, {
				input: projection.input,
				...projection.terminal
			});
		},
		recordTool: (event) => {
			const input = projectToolExecutionEventToAudit(event);
			if (input) writer.record(input);
		},
		stop: async () => {
			for (const runInstance of pendingTerminals.keys()) flushPending(runInstance);
			await writer.stop();
		}
	};
}
//#endregion
//#region src/audit/audit-recorder.ts
/** Gateway-owned recorder joining trusted run, tool, and message lifecycle streams. */
const log = createSubsystemLogger("audit/events");
let persistenceFailureWarned = false;
function createAuditEventRecorder(options) {
	let nextAcceptedMessageSequence = 0;
	const writer = options.writer ?? createAuditEventWriter({
		...options.stateDir ? { stateDir: options.stateDir } : {},
		onError: (error) => {
			if (!persistenceFailureWarned) {
				persistenceFailureWarned = true;
				log.warn(`audit event persistence failed: ${error}`);
			}
		}
	});
	return {
		...createAgentEventAuditRecorder({
			writer,
			...options.terminalSettleMs !== void 0 ? { terminalSettleMs: options.terminalSettleMs } : {}
		}),
		recordExecutionIdentity: writer.recordExecutionIdentity,
		recordExecutionDecision: writer.recordExecutionDecision,
		recordMessage: (event) => {
			if (options.messageMode === "off") return;
			if (options.messageMode === "direct" && event.conversationKind !== "direct") return;
			nextAcceptedMessageSequence += 1;
			writer.record({
				...event,
				sourceId: event.sourceId?.trim() || `message:${randomUUID()}`,
				sourceSequence: nextAcceptedMessageSequence
			});
		}
	};
}
//#endregion
export { createAuditEventRecorder as t };
