import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { s as asFiniteNumber } from "./number-coercion-oCkfUEEq.js";
import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { n as computeBackoff } from "./src-BQ327IOM.js";
import { a as readErrorName, r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { r as defaultRuntime } from "./runtime-DtFIMC-W.js";
import { f as resolveAgentIdFromSessionKey } from "./session-key-D8GLfPr_.js";
import { o as resolveSessionStorePathCore } from "./paths-B2oibYbs.js";
import { r as getRuntimeConfig } from "./io-CeQckj5v.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { nt as selectDeliverableSessionsReply } from "./openclaw-state-db-DlCMR4eQ.js";
import "./config-Dl8DJbzM.js";
import { t as truncateUtf8Prefix } from "./utf8-truncate-Dro7v_iB.js";
import { t as getGlobalHookRunner } from "./hook-runner-global-IYtayVps.js";
import { $t as loadSessionEntryReadOnly, en as patchSessionEntryCore, hn as resolveSessionStorePathForScope, qt as listSessionEntriesReadOnly } from "./session-accessor-Bi6bzKQE.js";
import "./backoff-BkMI1WEL.js";
import { at as SUBAGENT_KILL_TASK_ERROR } from "./task-registry-activity-Da_BdI-a.js";
import { n as extractTextFromChatContent } from "./chat-content-BbLAEXko.js";
import { i as failTaskRunByRunId, l as setDetachedTaskDeliveryStatusByRunId, t as completeTaskRunByRunId } from "./detached-task-runtime-Q4uJAo_a.js";
import { n as resolveRequiredCompletionTerminalResult, t as resolveRequiredCompletionDeliveryFailureTerminalResult } from "./task-completion-contract-BJW3TUQJ.js";
import "./sessions-D-jhKYGW.js";
import { d as clearDeliveryState, f as ensureCompletionState, h as getDeliveryLastError, l as compareSubagentRunGeneration, m as getDeliveryAttemptCount, p as ensureDeliveryState } from "./subagent-registry.store.sqlite-okpdNwYx.js";
import { f as SUBAGENT_ENDED_OUTCOME_TIMEOUT, g as SUBAGENT_TARGET_KIND_SUBAGENT, h as SUBAGENT_ENDED_REASON_KILLED, i as isStaleUnendedSubagentRun, l as resolveSubagentSessionStatus, m as SUBAGENT_ENDED_REASON_ERROR, o as getSubagentSessionRuntimeMs, p as SUBAGENT_ENDED_REASON_COMPLETE, s as getSubagentSessionStartedAt, u as SUBAGENT_ENDED_OUTCOME_ERROR } from "./subagent-run-liveness-Xp6SfCLg.js";
import { n as buildAnnounceIdempotencyKey, t as buildAnnounceIdFromChildRun } from "./announce-idempotency-D7LnUTJR.js";
import { s as isSilentAgentReplyText } from "./message-visibility-CIRFeK2g.js";
import fs, { promises } from "node:fs";
import path from "node:path";
//#region src/agents/subagents/completion/subagent-completion-result.ts
/** Selects the canonical operator-visible result from captured completion state. */
function resolveSubagentCompletionResultText(entry) {
	const terminalReply = entry.completion?.terminalReply;
	if (terminalReply) return terminalReply.disposition === "visible" ? terminalReply.text : void 0;
	const primary = entry.completion?.resultText;
	const fallback = entry.completion?.fallbackResultText;
	if (entry.execution.outcome?.status === "ok") return selectDeliverableSessionsReply(primary, fallback);
	return (primary ?? fallback)?.trim() || void 0;
}
//#endregion
//#region src/agents/subagents/registry/subagent-registry-completion.ts
/**
* Subagent run completion helpers.
* Compares outcomes, maps them to lifecycle events, and emits completion hooks
* exactly once per completed child run.
*/
const log = createSubsystemLogger("agents/subagent-registry-completion");
/** Returns the complete task projection only after completion capture has settled. */
function resolveFinalizedSubagentTaskState(entry) {
	const endedAt = entry.execution.endedAt;
	const outcome = entry.execution.outcome;
	const completion = entry.completion;
	if (typeof endedAt !== "number" || !outcome || entry.pauseReason === "sessions_yield" || completion?.resultText === void 0 && typeof completion?.capturedAt !== "number") return;
	const progressSummary = resolveSubagentCompletionResultText(entry);
	if (entry.endedReason === "subagent-killed" && entry.suppressAnnounceReason !== "steer-restart") return {
		status: "cancelled",
		endedAt,
		lastEventAt: endedAt,
		error: SUBAGENT_KILL_TASK_ERROR,
		progressSummary,
		terminalSummary: null
	};
	if (outcome.status === "ok") {
		const terminal = entry.expectsCompletionMessage === true ? resolveRequiredCompletionTerminalResult(progressSummary) : {};
		return {
			status: "succeeded",
			endedAt,
			lastEventAt: endedAt,
			progressSummary,
			terminalSummary: terminal.terminalSummary ?? null,
			terminalOutcome: terminal.terminalOutcome
		};
	}
	return {
		status: outcome.status === "timeout" ? "timed_out" : "failed",
		endedAt,
		lastEventAt: endedAt,
		error: outcome.status === "error" ? outcome.error : void 0,
		progressSummary,
		terminalSummary: null
	};
}
/** Preserves execution end time, except when a paused run was killed after its yield. */
function resolveKilledSubagentTaskEndedAt(entry) {
	if (entry.killReconciliation) return entry.killReconciliation.killedAt;
	const endedAt = entry.execution.endedAt;
	const cleanupCompletedAt = entry.cleanupCompletedAt;
	return entry.suppressAnnounceReason === "killed" && typeof endedAt === "number" && typeof cleanupCompletedAt === "number" && cleanupCompletedAt > endedAt ? cleanupCompletedAt : endedAt;
}
/** Maps registry run outcome to lifecycle event outcome. */
function resolveLifecycleOutcomeFromRunOutcome(outcome) {
	if (outcome?.status === "error") return SUBAGENT_ENDED_OUTCOME_ERROR;
	if (outcome?.status === "timeout") return SUBAGENT_ENDED_OUTCOME_TIMEOUT;
	return "ok";
}
/** Emits the transient presentation event for a newly terminal child run. */
async function emitSubagentProgressEndedHook(entry) {
	const hookRunner = getGlobalHookRunner();
	if (!hookRunner?.hasHooks("subagent_progress")) return;
	const outcome = entry.endedReason === "subagent-killed" ? "killed" : entry.execution.outcome ? resolveLifecycleOutcomeFromRunOutcome(entry.execution.outcome) : "unknown";
	try {
		await hookRunner.runSubagentProgress({
			phase: "ended",
			runId: entry.runId,
			childSessionKey: entry.childSessionKey,
			outcome,
			requester: entry.progressOrigin
		}, {
			runId: entry.runId,
			childSessionKey: entry.childSessionKey,
			requesterSessionKey: entry.requesterSessionKey
		});
	} catch (err) {
		log.warn(`failed to emit subagent progress for run ${entry.runId}: ${err instanceof Error ? err.message : String(err)}`);
	}
}
/** Emits the subagent_ended hook once per completed run. */
async function emitSubagentEndedHookOnce(params) {
	const runId = params.entry.runId.trim();
	if (!runId) return false;
	if (params.entry.endedHookEmittedAt) return false;
	if (params.inFlightRunIds.has(runId)) return false;
	params.inFlightRunIds.add(runId);
	try {
		const hookRunner = getGlobalHookRunner();
		if (!hookRunner) return false;
		if (hookRunner?.hasHooks("subagent_ended")) await hookRunner.runSubagentEnded({
			targetSessionKey: params.entry.childSessionKey,
			targetKind: SUBAGENT_TARGET_KIND_SUBAGENT,
			reason: params.reason,
			sendFarewell: params.sendFarewell,
			accountId: params.accountId,
			runId: params.entry.runId,
			endedAt: params.entry.execution.endedAt,
			outcome: params.outcome,
			error: params.error
		}, {
			runId: params.entry.runId,
			childSessionKey: params.entry.childSessionKey,
			requesterSessionKey: params.entry.requesterSessionKey
		});
		params.entry.endedHookEmittedAt = Date.now();
		params.persist(runId);
		return true;
	} catch (err) {
		log.warn(`failed to emit subagent_ended hook for run ${runId}: ${err instanceof Error ? err.message : String(err)}`);
		return false;
	} finally {
		params.inFlightRunIds.delete(runId);
	}
}
//#endregion
//#region src/agents/subagents/registry/subagent-session-reconciliation.ts
/**
* Subagent session-store reconciliation.
*
* Infers child completion from persisted session entries when registry updates arrive late.
*/
function finiteTimestamp(value) {
	return asFiniteNumber(value);
}
function terminalSessionTimestamp(sessionEntry) {
	return finiteTimestamp(sessionEntry?.endedAt) ?? finiteTimestamp(sessionEntry?.updatedAt);
}
function isFreshForRun(sessionEntry, notBeforeMs) {
	if (notBeforeMs === void 0) return true;
	const terminalAt = terminalSessionTimestamp(sessionEntry);
	return terminalAt !== void 0 && terminalAt >= notBeforeMs;
}
function freshSessionStartedAt(sessionEntry, notBeforeMs) {
	const startedAt = finiteTimestamp(sessionEntry?.startedAt);
	if (startedAt === void 0) return;
	return notBeforeMs === void 0 || startedAt >= notBeforeMs ? startedAt : void 0;
}
function findSessionEntryByKey(store, sessionKey) {
	const direct = store[sessionKey];
	if (direct) return direct;
	const normalized = sessionKey.trim().toLowerCase();
	for (const [key, entry] of Object.entries(store)) if (key.trim().toLowerCase() === normalized) return entry;
}
/** Load a child session entry using the agent-specific session store path. */
function loadSubagentSessionEntry(params) {
	const key = params.childSessionKey.trim();
	if (!key) return;
	const agentId = resolveAgentIdFromSessionKey(key);
	const storePath = resolveSessionStorePathCore((params.cfg ?? getRuntimeConfig()).session?.store, { agentId });
	let store = params.storeCache?.get(storePath);
	if (!store) {
		store = Object.fromEntries(listSessionEntriesReadOnly({
			storePath,
			clone: false
		}).map(({ sessionKey, entry }) => [sessionKey, entry]));
		params.storeCache?.set(storePath, store);
	}
	return findSessionEntryByKey(store, key);
}
/** Resolve a child session entry without depending on the file-backed store shape. */
function loadSubagentSessionEntryForAccessor(params) {
	const key = params.childSessionKey.trim();
	if (!key) return;
	const agentId = resolveAgentIdFromSessionKey(key);
	return loadSessionEntryReadOnly({
		storePath: resolveSessionStorePathCore((params.cfg ?? getRuntimeConfig()).session?.store, { agentId }),
		sessionKey: key,
		clone: false
	});
}
/** Resolves whether a registry row is orphaned from its child session entry. */
function resolveSubagentRunOrphanReason(params) {
	const childSessionKey = params.entry.childSessionKey?.trim();
	if (!childSessionKey) return "missing-session-entry";
	try {
		const sessionEntry = loadSubagentSessionEntryForAccessor({
			childSessionKey,
			cfg: params.cfg
		});
		if (!sessionEntry) return "missing-session-entry";
		if (typeof sessionEntry.sessionId !== "string" || !sessionEntry.sessionId.trim()) return "missing-session-id";
		if (params.includeStaleUnended === true && sessionEntry.abortedLastRun !== true && isStaleUnendedSubagentRun(params.entry, params.now)) return "stale-unended-run";
		return null;
	} catch {
		return null;
	}
}
/** Convert persisted session status into a subagent completion outcome. */
function resolveCompletionFromSessionEntry(sessionEntry, fallbackEndedAt, opts) {
	const status = sessionEntry?.status;
	const startedAt = freshSessionStartedAt(sessionEntry, opts?.notBeforeMs);
	const endedAt = finiteTimestamp(sessionEntry?.endedAt) ?? finiteTimestamp(sessionEntry?.updatedAt) ?? fallbackEndedAt;
	if (status === "done") {
		if (!isFreshForRun(sessionEntry, opts?.notBeforeMs)) return null;
		return {
			startedAt,
			endedAt,
			outcome: { status: "ok" },
			reason: SUBAGENT_ENDED_REASON_COMPLETE
		};
	}
	if (status === "timeout") {
		if (!isFreshForRun(sessionEntry, opts?.notBeforeMs)) return null;
		return {
			startedAt,
			endedAt,
			outcome: { status: "timeout" },
			reason: SUBAGENT_ENDED_REASON_COMPLETE
		};
	}
	if (status === "failed") {
		if (!isFreshForRun(sessionEntry, opts?.notBeforeMs)) return null;
		return {
			startedAt,
			endedAt,
			outcome: {
				status: "error",
				error: "session completed before registry settled"
			},
			reason: SUBAGENT_ENDED_REASON_ERROR
		};
	}
	if (status === "killed") {
		if (!isFreshForRun(sessionEntry, opts?.notBeforeMs)) return null;
		return {
			startedAt,
			endedAt,
			outcome: {
				status: "error",
				error: "subagent run terminated"
			},
			reason: SUBAGENT_ENDED_REASON_KILLED
		};
	}
	if (status !== "running" && typeof sessionEntry?.endedAt === "number") {
		if (!isFreshForRun(sessionEntry, opts?.notBeforeMs)) return null;
		return {
			startedAt,
			endedAt,
			outcome: { status: "ok" },
			reason: SUBAGENT_ENDED_REASON_COMPLETE
		};
	}
	return null;
}
/** Resolve child completion by reading its persisted session entry. */
function resolveSubagentSessionCompletion(params) {
	return resolveCompletionFromSessionEntry(loadSubagentSessionEntry({
		childSessionKey: params.childSessionKey,
		storeCache: params.storeCache,
		cfg: params.cfg
	}), params.fallbackEndedAt, { notBeforeMs: params.notBeforeMs });
}
/** Resolve a fresh child session start time for lifecycle reconciliation. */
function resolveSubagentSessionStartedAt(params) {
	const sessionEntry = loadSubagentSessionEntry({
		childSessionKey: params.childSessionKey,
		storeCache: params.storeCache,
		cfg: params.cfg
	});
	return isFreshForRun(sessionEntry, params.notBeforeMs) ? freshSessionStartedAt(sessionEntry, params.notBeforeMs) : void 0;
}
//#endregion
//#region src/agents/subagents/registry/subagent-registry-helpers.ts
/**
* Subagent registry persistence and recovery helpers.
*
* Handles frozen result caps, orphan detection, timing persistence, and announce retry logging.
*/
const PROVISIONAL_KILL_RECONCILIATION_MS = 5 * 6e4;
const MIN_ANNOUNCE_RETRY_DELAY_MS = 15e3;
const MAX_ANNOUNCE_RETRY_DELAY_MS = 5 * 6e4;
const ANNOUNCE_RETRY_JITTER = .2;
const ANNOUNCE_EXPIRY_MS = 5 * 6e4;
const ANNOUNCE_COMPLETION_HARD_EXPIRY_MS = 30 * 6e4;
const ANNOUNCE_RETRY_BACKOFF = {
	initialMs: MIN_ANNOUNCE_RETRY_DELAY_MS,
	maxMs: MAX_ANNOUNCE_RETRY_DELAY_MS,
	factor: 2,
	jitter: ANNOUNCE_RETRY_JITTER
};
const FROZEN_RESULT_TEXT_MAX_BYTES = 100 * 1024;
/** Caps frozen completion text stored for later announce/recovery delivery. */
function capFrozenResultText(resultText) {
	const trimmed = resultText.trim();
	if (!trimmed) return "";
	const totalBytes = Buffer.byteLength(trimmed, "utf8");
	if (totalBytes <= FROZEN_RESULT_TEXT_MAX_BYTES) return trimmed;
	const notice = `\n\n[truncated: frozen completion output exceeded ${Math.round(FROZEN_RESULT_TEXT_MAX_BYTES / 1024)}KB (${Math.round(totalBytes / 1024)}KB)]`;
	return `${truncateUtf8Prefix(trimmed, Math.max(0, FROZEN_RESULT_TEXT_MAX_BYTES - Buffer.byteLength(notice, "utf8")))}${notice}`;
}
/** Computes bounded exponential backoff for subagent announce retries. */
function resolveAnnounceRetryDelayMs(retryCount) {
	return computeBackoff(ANNOUNCE_RETRY_BACKOFF, Math.max(1, retryCount));
}
function formatAnnounceGiveUpLogField(value) {
	const normalized = value.replace(/\s+/g, " ").trim();
	return JSON.stringify(normalized.length > 2e3 ? `${truncateUtf16Safe(normalized, 2e3)}…` : normalized);
}
/** Logs a sanitized final give-up line for failed subagent announce delivery. */
function logAnnounceGiveUp(entry, reason) {
	const retryCount = getDeliveryAttemptCount(entry);
	const endedAt = entry.execution.endedAt;
	const endedAgoMs = typeof endedAt === "number" ? Math.max(0, Date.now() - endedAt) : void 0;
	const endedAgoLabel = endedAgoMs != null ? `${Math.round(endedAgoMs / 1e3)}s` : "n/a";
	const lastDeliveryError = getDeliveryLastError(entry);
	const deliveryError = lastDeliveryError ? ` deliveryError=${formatAnnounceGiveUpLogField(lastDeliveryError)}` : "";
	defaultRuntime.log(`[warn] Subagent announce give up (${reason}) run=${entry.runId} child=${entry.childSessionKey} requester=${entry.requesterSessionKey} retries=${retryCount} endedAgo=${endedAgoLabel}${deliveryError}`);
}
/** Persists child session timing/status derived from the subagent registry row. */
async function persistSubagentSessionTiming(entry, options) {
	const childSessionKey = entry.childSessionKey?.trim();
	if (!childSessionKey) return;
	const cfg = getRuntimeConfig();
	const agentId = resolveAgentIdFromSessionKey(childSessionKey);
	const storePath = resolveSessionStorePathCore(cfg.session?.store, { agentId });
	const startedAt = getSubagentSessionStartedAt(entry);
	const endedAt = typeof entry.execution.endedAt === "number" && Number.isFinite(entry.execution.endedAt) ? entry.execution.endedAt : void 0;
	const runtimeMs = endedAt !== void 0 ? getSubagentSessionRuntimeMs(entry, endedAt) : getSubagentSessionRuntimeMs(entry);
	const status = resolveSubagentSessionStatus(entry);
	await patchSessionEntryCore({
		storePath,
		sessionKey: childSessionKey
	}, (sessionEntry) => {
		if (options?.isCurrentGeneration && !options.isCurrentGeneration()) return null;
		if (status === "killed") {
			const existingCompletion = resolveCompletionFromSessionEntry(sessionEntry, Date.now(), { notBeforeMs: entry.execution.startedAt ?? entry.createdAt });
			if (existingCompletion && existingCompletion.reason !== "subagent-killed") {
				if (sessionEntry.abortedLastRun !== true) return null;
				const completedEntry = { ...sessionEntry };
				delete completedEntry.abortedLastRun;
				return completedEntry;
			}
		}
		const next = { ...sessionEntry };
		if (typeof startedAt === "number" && Number.isFinite(startedAt)) next.startedAt = startedAt;
		else delete next.startedAt;
		if (typeof endedAt === "number" && Number.isFinite(endedAt)) next.endedAt = endedAt;
		else delete next.endedAt;
		if (typeof runtimeMs === "number" && Number.isFinite(runtimeMs)) next.runtimeMs = runtimeMs;
		else delete next.runtimeMs;
		if (status) next.status = status;
		else delete next.status;
		if (status && status !== "killed") delete next.abortedLastRun;
		return next;
	}, {
		assertCommitAllowed: options?.assertCommitAllowed,
		replaceEntry: true
	});
}
function isResolvedChildPath(params) {
	const rootWithSep = params.rootPath.endsWith(path.sep) ? params.rootPath : `${params.rootPath}${path.sep}`;
	return params.childPath.startsWith(rootWithSep);
}
/** Best-effort async removal for a subagent attachment directory. */
async function safeRemoveAttachmentsDir(entry) {
	if (!entry.attachmentsDir || !entry.attachmentsRootDir) return true;
	const resolveReal = async (targetPath) => {
		try {
			return await promises.realpath(targetPath);
		} catch (err) {
			if (err?.code === "ENOENT") return null;
			throw err;
		}
	};
	try {
		const [rootReal, dirReal] = await Promise.all([resolveReal(entry.attachmentsRootDir), resolveReal(entry.attachmentsDir)]);
		if (!dirReal) return true;
		const rootBase = rootReal ?? path.resolve(entry.attachmentsRootDir);
		const dirBase = dirReal;
		if (!isResolvedChildPath({
			childPath: dirBase,
			rootPath: rootBase
		})) return false;
		await promises.rm(dirBase, {
			recursive: true,
			force: true
		});
		return true;
	} catch {
		return false;
	}
}
function safeRemoveAttachmentsDirSync(entry) {
	if (!entry.attachmentsDir || !entry.attachmentsRootDir) return;
	const resolveReal = (targetPath) => {
		try {
			return fs.realpathSync.native(targetPath);
		} catch (err) {
			if (err?.code === "ENOENT") return null;
			throw err;
		}
	};
	try {
		const rootReal = resolveReal(entry.attachmentsRootDir);
		const dirReal = resolveReal(entry.attachmentsDir);
		if (!dirReal) return;
		if (!isResolvedChildPath({
			childPath: dirReal,
			rootPath: rootReal ?? path.resolve(entry.attachmentsRootDir)
		})) return;
		fs.rmSync(dirReal, {
			recursive: true,
			force: true
		});
	} catch {}
}
/** Marks an orphaned registry run finished, cleans attachments, and removes it. */
function reconcileOrphanedRun(params) {
	if (params.entry.cleanup === "delete" || !params.entry.retainAttachmentsOnKeep) safeRemoveAttachmentsDirSync(params.entry);
	const removed = params.runs.delete(params.runId);
	params.resumedRuns.delete(params.runId);
	if (!removed) return false;
	defaultRuntime.log(`[warn] Subagent orphan run pruned source=${params.source} run=${params.runId} child=${params.entry.childSessionKey} reason=${params.reason}`);
	return true;
}
/** Reconciles orphaned runs found when restoring persisted subagent registry state. */
function reconcileOrphanedRestoredRuns(params) {
	const now = Date.now();
	let changed = false;
	for (const [runId, entry] of params.runs.entries()) {
		if (entry.collect && entry.collectorCompletion) continue;
		if (entry.requesterSettleWake) continue;
		if (entry.killReconciliation || entry.killIntent || entry.execution.restartRecovery || entry.terminalOwner === "interrupted-recovery") continue;
		const orphanReason = resolveSubagentRunOrphanReason({
			entry,
			includeStaleUnended: true,
			now
		});
		if (!orphanReason) continue;
		if (reconcileOrphanedRun({
			runId,
			entry,
			reason: orphanReason,
			source: "restore",
			runs: params.runs,
			resumedRuns: params.resumedRuns
		})) changed = true;
	}
	return changed;
}
/** Resolves the completed subagent archive delay from config. */
function resolveArchiveAfterMs(cfg) {
	const minutes = (cfg ?? getRuntimeConfig()).agents?.defaults?.subagents?.archiveAfterMinutes ?? 60;
	if (!Number.isFinite(minutes) || minutes < 0) return;
	if (minutes === 0) return;
	return Math.max(1, Math.floor(minutes)) * 6e4;
}
/** Arms retention only after the run or its waitable collector result has completed. */
function updateSubagentArchiveAtMs(entry, cfg) {
	const endedAt = typeof entry.execution.endedAt === "number" && Number.isFinite(entry.execution.endedAt) ? entry.execution.endedAt : void 0;
	const completedAt = entry.collect ? endedAt === void 0 && !entry.collectorCompletion ? void 0 : typeof entry.completion?.capturedAt === "number" && Number.isFinite(entry.completion.capturedAt) ? entry.completion.capturedAt : endedAt : entry.cleanup === "delete" && entry.pauseReason !== "sessions_yield" ? endedAt : void 0;
	const archiveAfterMs = entry.spawnMode === "session" || completedAt === void 0 ? void 0 : resolveArchiveAfterMs(cfg);
	const expectedArchiveAt = completedAt !== void 0 && archiveAfterMs !== void 0 ? completedAt + archiveAfterMs : void 0;
	if (entry.archiveAtMs === expectedArchiveAt) return false;
	if (expectedArchiveAt === void 0) delete entry.archiveAtMs;
	else entry.archiveAtMs = expectedArchiveAt;
	return true;
}
//#endregion
//#region src/agents/subagents/registry/subagent-registry-lifecycle-delivery.ts
const DELIVERY_MIRROR_HISTORY_MAX_CHARS = 128 * 1024;
function buildSafeLifecycleErrorMeta(error) {
	const message = formatErrorMessage(error);
	const name = readErrorName(error);
	return name ? {
		name,
		message
	} : { message };
}
function maskLifecycleIdentifier(value, kind) {
	const trimmed = value.trim();
	if (!trimmed) return "unknown";
	return kind === "session" ? `${trimmed.split(":").slice(0, 2).join(":") || "session"}:…` : trimmed.length <= 8 ? "***" : `${sliceUtf16Safe(trimmed, 0, 4)}…${sliceUtf16Safe(trimmed, -4)}`;
}
const formatAnnounceDeliveryError = (delivery) => {
	const errors = [
		delivery.error,
		delivery.reason,
		...(delivery.phases ?? []).map((phase) => phase.error ? `${phase.phase}: ${phase.error}` : void 0)
	].map((value) => value?.trim()).filter((value) => Boolean(value));
	return errors.length > 0 ? uniqueStrings(errors).join("; ") : `delivery path ${delivery.path} did not complete`;
};
const recordAnnounceDeliveryResult = (entry, delivery) => {
	const deliveryState = ensureDeliveryState(entry);
	if (typeof delivery.enqueuedAt === "number") deliveryState.enqueuedAt ??= delivery.enqueuedAt;
	if (delivery.delivered) {
		deliveryState.deliveredAt = typeof delivery.deliveredAt === "number" ? delivery.deliveredAt : Date.now();
		deliveryState.lastDropReason = void 0;
	}
	deliveryState.disposition = delivery.disposition ?? (delivery.delivered ? "delivered" : "retryable");
};
const hasPriorRequesterDeliveryMirror = async (params, entry) => {
	const expectedText = extractTextFromChatContent(ensureCompletionState(entry).resultText, { joinWith: "" });
	if (entry.expectsCompletionMessage !== true || expectedText == null) return false;
	const mirrorNotBefore = entry.execution.startedAt ?? entry.createdAt;
	const mirrorNotAfter = Date.now() + 3e4;
	const expectedIdempotencyKey = buildAnnounceIdempotencyKey(buildAnnounceIdFromChildRun({
		childSessionKey: entry.childSessionKey,
		childRunId: entry.runId
	}));
	const isExpectedMirrorIdempotencyKey = (value) => typeof value === "string" && (value === expectedIdempotencyKey || value.startsWith(`${expectedIdempotencyKey}:internal-source-reply:`) || value.startsWith(`${expectedIdempotencyKey}:message-tool:internal-source-reply:`) || value.startsWith(`${entry.runId}:message-tool:`) || value.startsWith(`${entry.runId}:internal-source-reply:`));
	try {
		const mirror = (await params.callGateway({
			method: "chat.history",
			params: {
				sessionKey: entry.requesterSessionKey,
				limit: 25,
				maxChars: DELIVERY_MIRROR_HISTORY_MAX_CHARS
			},
			timeoutMs: 5e3
		})).messages?.find((message) => {
			if (!message || typeof message !== "object") return false;
			const record = message;
			const timestamp = record.timestamp;
			if (typeof timestamp !== "number" || !Number.isFinite(timestamp) || timestamp < mirrorNotBefore || timestamp > mirrorNotAfter || !isExpectedMirrorIdempotencyKey(record.idempotencyKey)) return false;
			const text = extractTextFromChatContent(record.content, { joinWith: "" });
			return record.role === "assistant" && record.provider === "openclaw" && record.model === "delivery-mirror" && text === expectedText;
		});
		if (mirror) ensureDeliveryState(entry).deliveredAt = mirror.timestamp;
		return Boolean(mirror);
	} catch {
		return false;
	}
};
const resolveSubagentTaskTarget = (params, entry, resolution = params.resolveSubagentTask(entry)) => {
	const durableTaskRunId = entry.taskRunId ?? entry.runId;
	return {
		runId: resolution.lookup === "available" ? resolution.task?.runId ?? durableTaskRunId : durableTaskRunId,
		sessionKey: resolution.lookup === "available" ? resolution.task?.childSessionKey ?? entry.childSessionKey : entry.childSessionKey
	};
};
const safeSetSubagentTaskDeliveryStatus = (params, args) => {
	const target = resolveSubagentTaskTarget(params, args.entry);
	try {
		setDetachedTaskDeliveryStatusByRunId({
			runId: target.runId,
			runtime: "subagent",
			sessionKey: target.sessionKey,
			deliveryStatus: args.deliveryStatus,
			error: args.deliveryStatus === "failed" ? args.deliveryError : void 0
		});
	} catch (err) {
		params.warn("failed to update subagent background task delivery state", {
			error: buildSafeLifecycleErrorMeta(err),
			runId: maskLifecycleIdentifier(target.runId, "run"),
			childSessionKey: maskLifecycleIdentifier(target.sessionKey, "session"),
			deliveryStatus: args.deliveryStatus
		});
	}
};
const safeFinalizeSubagentTaskRun = (params, args) => {
	const terminal = resolveFinalizedSubagentTaskState(args.entry);
	if (!terminal) return [];
	const target = resolveSubagentTaskTarget(params, args.entry, args.taskResolution);
	const { status, error, terminalOutcome, ...details } = terminal;
	const suppressDelivery = args.entry.suppressCompletionDelivery === true;
	try {
		if (status === "succeeded") return completeTaskRunByRunId({
			runId: target.runId,
			runtime: "subagent",
			sessionKey: target.sessionKey,
			...details,
			terminalOutcome,
			suppressDelivery
		});
		return failTaskRunByRunId({
			runId: target.runId,
			runtime: "subagent",
			sessionKey: target.sessionKey,
			...details,
			status,
			error,
			suppressDelivery
		});
	} catch (err) {
		params.warn("failed to finalize subagent background task state", {
			error: buildSafeLifecycleErrorMeta(err),
			runId: maskLifecycleIdentifier(args.entry.runId, "run"),
			childSessionKey: maskLifecycleIdentifier(args.entry.childSessionKey, "session"),
			outcomeStatus: args.outcome.status
		});
		return [];
	}
};
const safeMarkRequiredCompletionDeliveryBlocked = (params, args) => {
	if (args.entry.expectsCompletionMessage !== true || args.entry.execution.outcome?.status !== "ok") return;
	const endedAt = args.entry.execution.endedAt ?? Date.now();
	const terminalResult = resolveRequiredCompletionDeliveryFailureTerminalResult(args.reason);
	const target = resolveSubagentTaskTarget(params, args.entry);
	try {
		completeTaskRunByRunId({
			runId: target.runId,
			runtime: "subagent",
			sessionKey: target.sessionKey,
			endedAt,
			lastEventAt: Date.now(),
			progressSummary: resolveSubagentCompletionResultText(args.entry),
			terminalSummary: terminalResult.terminalSummary,
			terminalOutcome: terminalResult.terminalOutcome
		});
	} catch (err) {
		params.warn("failed to mark subagent completion delivery blocked", {
			error: buildSafeLifecycleErrorMeta(err),
			runId: maskLifecycleIdentifier(args.entry.runId, "run"),
			childSessionKey: maskLifecycleIdentifier(args.entry.childSessionKey, "session")
		});
	}
};
const freezeRunResultAtCompletion = async (context, entry, outcome) => {
	const params = context.options;
	if (ensureCompletionState(entry).resultText !== void 0) return false;
	if (outcome.status === "error") {
		const completion = ensureCompletionState(entry);
		completion.resultText = null;
		completion.capturedAt = Date.now();
		return true;
	}
	let resultText;
	try {
		const transcriptTarget = entry.execution.transcriptTarget;
		const agentId = transcriptTarget?.agentId ?? resolveAgentIdFromSessionKey(entry.childSessionKey);
		const sessionKey = transcriptTarget?.sessionKey ?? entry.childSessionKey;
		const configuredStorePath = agentId ? transcriptTarget?.storePath ?? resolveSessionStorePathCore(params.getRuntimeConfig().session?.store, { agentId }) : void 0;
		const storePath = configuredStorePath ? resolveSessionStorePathForScope({
			agentId,
			sessionKey,
			storePath: configuredStorePath
		}) : void 0;
		const sessionId = transcriptTarget?.sessionId ?? (agentId && storePath ? loadSessionEntryReadOnly({
			agentId,
			sessionKey,
			storePath
		})?.sessionId : void 0);
		const sessionTarget = agentId && sessionId && storePath ? {
			agentId,
			sessionId,
			sessionKey,
			storePath
		} : void 0;
		const captured = await params.captureSubagentCompletionReply(entry.childSessionKey, {
			waitForReply: entry.expectsCompletionMessage === true,
			outcome,
			...sessionTarget ? { sessionTarget } : {}
		});
		resultText = captured?.trim() ? capFrozenResultText(captured) : null;
	} catch {
		resultText = null;
	}
	const liveEntry = params.runs.get(entry.runId);
	if (entry.pauseReason === "sessions_yield" || liveEntry?.pauseReason === "sessions_yield" || context.newerGenerationOwnsSession(entry)) return false;
	const completion = ensureCompletionState(entry);
	if (completion.resultText !== void 0) return false;
	completion.resultText = resultText;
	completion.capturedAt = Date.now();
	return true;
};
const listPendingCompletionRunsForSession = (params, sessionKey) => {
	const key = sessionKey.trim();
	if (!key) return [];
	const out = [];
	for (const entry of params.runs.values()) {
		if (entry.childSessionKey !== key) continue;
		if (entry.expectsCompletionMessage !== true) continue;
		if (typeof entry.execution.endedAt !== "number") continue;
		if (typeof entry.cleanupCompletedAt === "number") continue;
		if (entry.pauseReason === "sessions_yield") continue;
		out.push(entry);
	}
	return out;
};
const refreshFrozenResultFromSession = async (context, sessionKey) => {
	const params = context.options;
	const entry = listPendingCompletionRunsForSession(params, sessionKey).filter((entry) => entry.execution.outcome?.status !== "error").toSorted(compareSubagentRunGeneration).at(-1);
	if (!entry || context.newerGenerationOwnsSession(entry)) return false;
	const generation = entry.generation;
	let captured;
	try {
		captured = await params.captureSubagentCompletionReply(sessionKey);
	} catch {
		return false;
	}
	const trimmed = captured?.trim();
	if (!trimmed || isSilentAgentReplyText(trimmed)) return false;
	if (params.runs.get(entry.runId) !== entry || entry.generation !== generation || context.newerGenerationOwnsSession(entry)) return false;
	const nextFrozen = capFrozenResultText(trimmed);
	const completion = ensureCompletionState(entry);
	if (completion.resultText === nextFrozen) return false;
	completion.resultText = nextFrozen;
	completion.capturedAt = Date.now();
	params.persist(entry.runId);
	return true;
};
const emitCompletionEndedHookIfNeeded = async (params, entry, reason, isCurrent) => {
	if (params.shouldEmitEndedHookForRun({
		entry,
		reason
	})) await params.emitSubagentEndedHookForRun({
		entry,
		reason,
		sendFarewell: true,
		isCurrent
	});
};
const clearSubagentPendingDelivery = (entry) => {
	const delivery = ensureDeliveryState(entry);
	delivery.payload = void 0;
	delivery.createdAt = void 0;
	delivery.lastAttemptAt = void 0;
	delivery.attemptCount = void 0;
	delivery.lastError = void 0;
	delivery.suspendedAt = void 0;
	delivery.suspendedReason = void 0;
	if (delivery.status !== "delivered" && delivery.status !== "failed") clearDeliveryState(entry);
};
const loadPendingFinalDeliveryPayload = (entry) => {
	return {
		requesterSessionKey: entry.delivery?.payload?.requesterSessionKey ?? entry.requesterSessionKey,
		requesterOrigin: entry.delivery?.payload?.requesterOrigin ?? entry.requesterOrigin,
		requesterDisplayKey: entry.delivery?.payload?.requesterDisplayKey ?? entry.requesterDisplayKey,
		childSessionKey: entry.delivery?.payload?.childSessionKey ?? entry.childSessionKey,
		childRunId: entry.delivery?.payload?.childRunId ?? entry.runId,
		task: entry.delivery?.payload?.task ?? entry.task,
		label: entry.delivery?.payload?.label ?? entry.label,
		startedAt: entry.delivery?.payload?.startedAt ?? entry.execution.startedAt,
		endedAt: entry.delivery?.payload?.endedAt ?? entry.execution.endedAt,
		outcome: entry.delivery?.payload?.outcome ?? entry.execution.outcome,
		expectsCompletionMessage: entry.delivery?.payload?.expectsCompletionMessage ?? entry.expectsCompletionMessage,
		spawnMode: entry.delivery?.payload?.spawnMode ?? entry.spawnMode,
		wakeOnDescendantSettle: entry.delivery?.payload?.wakeOnDescendantSettle ?? entry.wakeOnDescendantSettle,
		terminalReply: entry.delivery?.payload?.terminalReply ?? entry.completion?.terminalReply
	};
};
const markPendingFinalDelivery = (args) => {
	const now = Date.now();
	const payload = loadPendingFinalDeliveryPayload(args.entry);
	const delivery = ensureDeliveryState(args.entry);
	delivery.status = "pending";
	delivery.createdAt ??= now;
	delivery.lastAttemptAt = now;
	delivery.attemptCount = (delivery.attemptCount ?? 0) + 1;
	delivery.lastError = args.error ?? null;
	delivery.payload = payload;
};
const refreshPendingFinalDeliveryPayload = (entry) => {
	const delivery = entry.delivery;
	if (!delivery?.payload || delivery.status === "delivered" || typeof delivery.announcedAt === "number") return false;
	delivery.payload = {
		...delivery.payload,
		startedAt: entry.execution.startedAt,
		endedAt: entry.execution.endedAt,
		outcome: entry.execution.outcome,
		terminalReply: entry.completion?.terminalReply
	};
	return true;
};
//#endregion
export { resolveSubagentSessionCompletion as A, reconcileOrphanedRun as C, loadSubagentSessionEntry as D, updateSubagentArchiveAtMs as E, resolveKilledSubagentTaskEndedAt as F, resolveLifecycleOutcomeFromRunOutcome as I, resolveSubagentCompletionResultText as L, emitSubagentEndedHookOnce as M, emitSubagentProgressEndedHook as N, resolveCompletionFromSessionEntry as O, resolveFinalizedSubagentTaskState as P, reconcileOrphanedRestoredRuns as S, safeRemoveAttachmentsDir as T, ANNOUNCE_EXPIRY_MS as _, freezeRunResultAtCompletion as a, logAnnounceGiveUp as b, markPendingFinalDelivery as c, refreshFrozenResultFromSession as d, refreshPendingFinalDeliveryPayload as f, ANNOUNCE_COMPLETION_HARD_EXPIRY_MS as g, safeSetSubagentTaskDeliveryStatus as h, formatAnnounceDeliveryError as i, resolveSubagentSessionStartedAt as j, resolveSubagentRunOrphanReason as k, maskLifecycleIdentifier as l, safeMarkRequiredCompletionDeliveryBlocked as m, clearSubagentPendingDelivery as n, hasPriorRequesterDeliveryMirror as o, safeFinalizeSubagentTaskRun as p, emitCompletionEndedHookIfNeeded as r, loadPendingFinalDeliveryPayload as s, buildSafeLifecycleErrorMeta as t, recordAnnounceDeliveryResult as u, MIN_ANNOUNCE_RETRY_DELAY_MS as v, resolveAnnounceRetryDelayMs as w, persistSubagentSessionTiming as x, PROVISIONAL_KILL_RECONCILIATION_MS as y };
