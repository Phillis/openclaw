import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { c as normalizeOptionalLowercaseString, h as readNonEmptyStringPreservingWhitespace } from "./string-coerce-CIXf7egm.js";
import { o as asDateTimestampMs } from "./number-coercion-CLj0HTDM.js";
import { f as redactSensitiveText } from "./redact-CWP17HFN.js";
import { w as resolveStateDir } from "./paths-BBSTUjD5.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { o as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-DsoDzKB9.js";
import { T as isOpenClawStateWriteContentionError, g as runWithOpenClawStateBusyTimeout } from "./openclaw-state-db-kmBThqu6.js";
import { t as isAllowedToolCallName } from "./tool-call-shared-BxbmRH0F.js";
import { i as buildAgentRunTerminalOutcomeFromLifecycleEvent, o as classifyAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-DafVNgmX.js";
import { t as mergeAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-merge-DXNYLPhQ.js";
import { i as recordExecutionDecisionFact, r as pruneExpiredExecutionDecisionFacts } from "./execution-decision-facts-2puDcKuZ.js";
import { n as parseExecutionDecisionWork, r as processExecutionDecisionWork } from "./execution-decision-work-B-G2Z43n.js";
import { d as isOutboundMessageProgressInput, l as pruneExpiredAuditEvents, n as processExecutionIdentityAdmissionWork, o as pruneExpiredOutboundMessageProgress, r as pruneExpiredExecutionIdentityContexts, s as recordOutboundMessageProgress, u as recordAuditEvent } from "./execution-identity-context-CosKAuLQ.js";
import { createHash, randomUUID } from "node:crypto";
//#region src/audit/audit-event-writer.ts
/** Non-blocking process-owned queue for audit metadata persistence. */
const MAX_PENDING_AUDIT_EVENTS = 4096;
const AUDIT_MAINTENANCE_INTERVAL_MS = 60 * 6e4;
const AUDIT_LOCK_RETRY_DELAY_MS = 25;
const AUDIT_LOCK_RETRY_MAX_DELAY_MS = 1e3;
const AUDIT_LOCK_CONTENTION_REPORT_MS = 1e3;
const AUDIT_WRITER_SHUTDOWN_TIMEOUT_MS = OPENCLAW_SQLITE_BUSY_TIMEOUT_MS + 5e3;
function formatAuditWriterError(error) {
	return truncateUtf16Safe(redactSensitiveText(error instanceof Error ? error.message : String(error), { mode: "tools" }), 512);
}
function executionIdentityFailureMessage(error) {
	const message = error instanceof Error ? error.message : String(error);
	if (message.includes("audit identity key is missing") || message.includes("audit identity key is corrupt")) return "audit execution identity key unavailable";
	if (message.includes("execution identity context conflict")) return "audit execution identity context conflict";
	if (message.includes("execution identity recovery evidence unavailable")) return "audit execution identity recovery evidence unavailable";
	if (message.includes("admission envelope") || message.includes("admission work") || message.includes("admission token")) return "audit execution identity envelope rejected";
	return "audit execution identity persistence failed";
}
/** Start one bounded queue on the current process's cached shared-state connection owner. */
function createAuditEventWriter(options = {}) {
	const database = { env: { OPENCLAW_STATE_DIR: options.stateDir ?? resolveStateDir(process.env) } };
	const maxPending = Math.max(1, Math.floor(options.maxPending ?? MAX_PENDING_AUDIT_EVENTS));
	const queue = [];
	let stopped = false;
	let unavailable = false;
	let maintenancePending = true;
	let readyPending = true;
	let scheduled;
	let retryTimer;
	let lockRetryAttempt = 0;
	let lockContentionDelayMs = 0;
	let lockContentionReported = false;
	let resolveReady;
	const ready = new Promise((resolve) => {
		resolveReady = resolve;
	});
	let stopPromise;
	let resolveStop;
	let stopTimer;
	const fail = (error) => {
		options.onError?.(formatAuditWriterError(error));
	};
	const reportContention = (message) => {
		options.onContention?.(formatAuditWriterError(message));
	};
	const runWithoutBusyWait = (operation) => runWithOpenClawStateBusyTimeout(() => operation(), database, 0);
	const observeLockContention = () => {
		lockRetryAttempt += 1;
	};
	const resetLockContention = () => {
		lockRetryAttempt = 0;
		lockContentionDelayMs = 0;
		lockContentionReported = false;
	};
	const reportMaintenance = () => {
		let more = false;
		for (const maintenance of [
			() => pruneExpiredAuditEvents({ database }),
			() => pruneExpiredExecutionIdentityContexts({ database }),
			() => pruneExpiredExecutionDecisionFacts({ database }),
			() => pruneExpiredOutboundMessageProgress({ database })
		]) try {
			more = runWithoutBusyWait(maintenance) > 0 || more;
		} catch (error) {
			if (isOpenClawStateWriteContentionError(error)) {
				observeLockContention();
				return "retry";
			}
			fail(error);
		}
		return more ? "more" : "settled";
	};
	const processRequest = (request) => {
		try {
			runWithoutBusyWait(() => {
				if (request.type === "record-event") {
					if (isOutboundMessageProgressInput(request.input)) recordOutboundMessageProgress(request.input, database);
					else recordAuditEvent(request.input, database);
					return;
				}
				if (request.type === "record-execution-identity") {
					processExecutionIdentityAdmissionWork(request.work, database);
					return;
				}
				if (request.type === "record-execution-decision-work") {
					processExecutionDecisionWork(request.work, database);
					return;
				}
				recordExecutionDecisionFact(request.receipt, database);
			});
			return "settled";
		} catch (error) {
			if (isOpenClawStateWriteContentionError(error)) {
				observeLockContention();
				return "retry";
			}
			resetLockContention();
			if (request.type === "record-execution-identity") fail(executionIdentityFailureMessage(error));
			else if (request.type === "record-execution-decision" || request.type === "record-execution-decision-work") fail("audit execution decision rejected");
			else fail(error);
			return "settled";
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
	const schedule = () => {
		if (retryTimer) {
			if (stopped) retryTimer.ref?.();
			return;
		}
		if (scheduled) {
			if (stopped) scheduled.ref?.();
			return;
		}
		scheduled = setImmediate(drainOne);
		if (!stopped) scheduled.unref?.();
	};
	const scheduleRetry = () => {
		const delayMs = Math.min(AUDIT_LOCK_RETRY_MAX_DELAY_MS, AUDIT_LOCK_RETRY_DELAY_MS * 2 ** Math.min(6, Math.max(0, lockRetryAttempt - 1)));
		lockContentionDelayMs += delayMs;
		if (!lockContentionReported && lockContentionDelayMs >= AUDIT_LOCK_CONTENTION_REPORT_MS) {
			lockContentionReported = true;
			reportContention("audit event persistence delayed by SQLite lock contention");
		}
		retryTimer = setTimeout(() => {
			retryTimer = void 0;
			drainOne();
		}, delayMs);
		if (!stopped) retryTimer.unref?.();
	};
	function drainOne() {
		scheduled = void 0;
		if (maintenancePending) {
			const maintenance = reportMaintenance();
			if (readyPending) {
				readyPending = false;
				resolveReady();
			}
			if (maintenance === "retry") {
				scheduleRetry();
				return;
			}
			maintenancePending = maintenance === "more";
			resetLockContention();
		}
		const request = queue.shift();
		if (request && processRequest(request) === "retry") {
			queue.unshift(request);
			scheduleRetry();
			return;
		}
		if (request) resetLockContention();
		if (queue.length > 0 || maintenancePending) {
			schedule();
			return;
		}
		if (stopped) finishStop();
	}
	const maintenanceTimer = setInterval(() => {
		maintenancePending = true;
		schedule();
	}, AUDIT_MAINTENANCE_INTERVAL_MS);
	maintenanceTimer.unref?.();
	schedule();
	const enqueue = (message) => {
		if (stopped || unavailable || queue.length >= maxPending) {
			if (!stopped) fail(unavailable ? "audit event writer is unavailable; dropping metadata" : `audit event queue is full (${maxPending}); dropping metadata`);
			return false;
		}
		try {
			const boundedMessage = message.type === "record-execution-decision-work" ? {
				...message,
				work: parseExecutionDecisionWork(message.work)
			} : message;
			queue.push(structuredClone(boundedMessage));
			schedule();
			return true;
		} catch (error) {
			if (message.type !== "record-event") fail(message.type === "record-execution-identity" ? "audit execution identity envelope could not be queued" : "audit execution decision receipt could not be queued");
			else {
				unavailable = true;
				fail(error);
			}
			return false;
		}
	};
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
		recordExecutionDecisionWork: (work) => enqueue({
			type: "record-execution-decision-work",
			work
		}),
		stop: () => {
			if (stopPromise) return stopPromise;
			stopped = true;
			clearInterval(maintenanceTimer);
			maintenancePending = true;
			stopPromise = new Promise((resolve) => {
				resolveStop = resolve;
				stopTimer = setTimeout(() => {
					queue.length = 0;
					if (scheduled) {
						clearImmediate(scheduled);
						scheduled = void 0;
					}
					if (retryTimer) {
						clearTimeout(retryTimer);
						retryTimer = void 0;
					}
					fail("audit event writer shutdown timed out; pending metadata may be lost");
					finishStop();
				}, AUDIT_WRITER_SHUTDOWN_TIMEOUT_MS);
				stopTimer.unref?.();
				schedule();
			});
			return stopPromise;
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
		onContention: (message) => log$1.warn(message),
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
		onContention: (message) => log.warn(message),
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
		recordExecutionDecisionWork: writer.recordExecutionDecisionWork,
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
