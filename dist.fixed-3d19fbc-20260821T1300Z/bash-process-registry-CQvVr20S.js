import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { c as readEnvInt } from "./bash-tools.shared-ChrqMtqb.js";
//#region src/agents/bash-process-registry.ts
const DEFAULT_JOB_TTL_MS = 1800 * 1e3;
const MIN_JOB_TTL_MS = 60 * 1e3;
const MAX_JOB_TTL_MS = 10800 * 1e3;
const DEFAULT_PENDING_OUTPUT_CHARS = 3e4;
const MAX_FINISHED_SESSION_COUNT = 50;
const MAX_FINISHED_SESSION_OUTPUT_CHARS = 2e6;
function clampTtl(value) {
	if (value === void 0 || Number.isNaN(value)) return DEFAULT_JOB_TTL_MS;
	return Math.min(Math.max(value, MIN_JOB_TTL_MS), MAX_JOB_TTL_MS);
}
let jobTtlMs = clampTtl(readEnvInt("OPENCLAW_BASH_JOB_TTL_MS", "PI_BASH_JOB_TTL_MS"));
const runningSessions = /* @__PURE__ */ new Map();
const finishedSessions = /* @__PURE__ */ new Map();
let finishedSessionsByProcess = /* @__PURE__ */ new WeakMap();
const activeBackgroundExecSessionIds = /* @__PURE__ */ new Set();
let finishedSessionOutputChars = 0;
let sweeper = null;
/** Return whether a process session id is live, retained, or reserved for notification. */
function isProcessSessionIdTaken(id) {
	return runningSessions.has(id) || finishedSessions.has(id) || activeBackgroundExecSessionIds.has(id);
}
/** Adds a running session and starts retention sweeping if needed. */
function addSession(session) {
	runningSessions.set(session.id, session);
	startSweeper();
}
/** Returns a running session by id. */
function getSession(id) {
	return runningSessions.get(id);
}
/** Returns a retained finished background session by id. */
function getFinishedSession(id) {
	return finishedSessions.get(id);
}
/** Returns the terminal snapshot owned by this exact process incarnation. */
function getFinishedSessionForProcess(session) {
	return finishedSessionsByProcess.get(session);
}
function deleteFinishedSession(id) {
	const session = finishedSessions.get(id);
	if (!session) return false;
	finishedSessions.delete(id);
	finishedSessionOutputChars -= session.aggregated.length;
	return true;
}
/** Removes visible session records without changing live-process activity. */
function deleteSession(id) {
	runningSessions.delete(id);
	deleteFinishedSession(id);
}
/** Removes completed process records belonging to retired session identities. */
function clearFinishedSessionsForScopes(scopeKeys) {
	const retiredScopes = /* @__PURE__ */ new Set();
	for (const scopeKey of scopeKeys) {
		const normalizedScope = scopeKey.trim();
		if (normalizedScope) retiredScopes.add(normalizedScope);
	}
	if (retiredScopes.size === 0) return;
	for (const [id, session] of finishedSessions) if (session.scopeKey && retiredScopes.has(session.scopeKey)) deleteFinishedSession(id);
}
/** Appends process output while enforcing aggregate and pending-output caps. */
function appendOutput(session, stream, chunk) {
	const streamChars = stream === "stdout" ? session.pendingStdoutChars : session.pendingStderrChars;
	const pendingCap = Math.min(session.pendingMaxOutputChars ?? DEFAULT_PENDING_OUTPUT_CHARS, session.maxOutputChars);
	session.pendingOutput.push({
		stream,
		text: chunk
	});
	let pendingChars = streamChars + chunk.length;
	if (pendingChars > pendingCap) {
		session.truncated = true;
		session.pendingOutputDropped = true;
		pendingChars = capPendingStream(session.pendingOutput, stream, pendingChars, pendingCap);
	}
	if (stream === "stdout") session.pendingStdoutChars = pendingChars;
	else session.pendingStderrChars = pendingChars;
	session.totalOutputChars += chunk.length;
	const aggregated = trimWithCap(session.aggregated + chunk, session.maxOutputChars);
	session.truncated = session.truncated || aggregated.length < session.aggregated.length + chunk.length;
	session.aggregated = aggregated;
	session.tail = tail(session.aggregated, 2e3);
}
/** Drains pending chunks in producer callback order for a process poll. */
function drainSession(session) {
	const output = session.pendingOutput.map((chunk) => chunk.text).join("");
	const outputDropped = session.pendingOutputDropped;
	session.pendingOutput = [];
	session.pendingStdoutChars = 0;
	session.pendingStderrChars = 0;
	session.pendingOutputDropped = false;
	return {
		output,
		outputDropped
	};
}
/** Consumes the output transferred to one exact terminal snapshot. */
function drainFinishedSession(session) {
	const output = session.unreadOutput;
	session.unreadOutput = void 0;
	return output ?? {
		output: "",
		outputDropped: false
	};
}
/** Moves a session to finished state and records exit metadata. */
function markExited(session, exitCode, exitSignal, status, exitReason, noOutputTimedOut) {
	activeBackgroundExecSessionIds.delete(session.id);
	session.terminalStatus = status;
	session.exited = true;
	session.exitCode = exitCode;
	session.exitSignal = exitSignal;
	session.exitReason = exitReason;
	session.noOutputTimedOut = noOutputTimedOut;
	session.tail = tail(session.aggregated, 2e3);
	moveToFinished(session, status);
}
/** Marks a running session as reconnectable after the exec call returns. */
function markBackgrounded(session) {
	session.backgrounded = true;
	if (!session.exited) activeBackgroundExecSessionIds.add(session.id);
}
/** Records that a terminal process poll consumed the process result. */
function markTerminalPollObserved(session) {
	session.terminalPollObserved = true;
	const finished = finishedSessionsByProcess.get(session);
	if (finished) finished.terminalPollObserved = true;
}
/** Retains the precise event removal handle across the finished-session move. */
function recordNotifyOnExitRemoval(session, remove) {
	if (session.terminalPollObserved) {
		remove();
		return;
	}
	session.notifyOnExitRemoval = remove;
	const finished = finishedSessionsByProcess.get(session);
	if (finished) finished.notifyOnExitRemoval = remove;
}
/** Acknowledges one completion event without touching unrelated queue entries. */
function acknowledgeNotifyOnExit(record) {
	const remove = record.notifyOnExitRemoval;
	if (!remove) return;
	remove();
	record.notifyOnExitRemoval = void 0;
}
/** Reports owner-tracked process liveness even after visibility is removed. */
function hasActiveBackgroundExecSession(sessionId) {
	return activeBackgroundExecSessionIds.has(sessionId);
}
/** Returns the number of live background exec sessions without exposing process details. */
function getActiveBackgroundExecSessionCount() {
	return activeBackgroundExecSessionIds.size;
}
function moveToFinished(session, status) {
	runningSessions.delete(session.id);
	const stdin = session.stdin;
	if (stdin) {
		if (typeof stdin.destroy === "function") stdin.destroy();
		else if (typeof stdin.end === "function") stdin.end();
		delete session.stdin;
	}
	if (!session.backgrounded) return;
	deleteFinishedSession(session.id);
	const finished = {
		id: session.id,
		command: session.command,
		scopeKey: session.scopeKey,
		startedAt: session.startedAt,
		endedAt: Date.now(),
		cwd: session.cwd,
		status,
		exitCode: session.exitCode,
		exitSignal: session.exitSignal,
		exitReason: session.exitReason,
		...session.noOutputTimedOut !== void 0 ? { noOutputTimedOut: session.noOutputTimedOut } : {},
		aggregated: session.aggregated,
		tail: session.tail,
		truncated: session.truncated,
		totalOutputChars: session.totalOutputChars,
		unreadOutput: drainSession(session),
		...session.terminalPollObserved ? { terminalPollObserved: true } : {},
		...session.notifyOnExitRemoval ? { notifyOnExitRemoval: session.notifyOnExitRemoval } : {}
	};
	finishedSessionsByProcess.set(session, finished);
	finishedSessions.set(session.id, finished);
	finishedSessionOutputChars += session.aggregated.length;
	while (finishedSessions.size > MAX_FINISHED_SESSION_COUNT || finishedSessions.size > 1 && finishedSessionOutputChars > MAX_FINISHED_SESSION_OUTPUT_CHARS) {
		const oldestSessionId = finishedSessions.keys().next().value;
		if (oldestSessionId === void 0) break;
		deleteFinishedSession(oldestSessionId);
	}
}
/** Returns the last `max` characters of text without adding ellipses. */
function tail(text, max = 2e3) {
	if (text.length <= max) return text;
	return sliceUtf16Safe(text, text.length - max);
}
function capPendingStream(output, stream, pendingCharsInput, cap) {
	let pendingChars = pendingCharsInput;
	let overflow = pendingChars - cap;
	for (let index = 0; index < output.length && overflow > 0;) {
		const chunk = output[index];
		if (!chunk || chunk.stream !== stream) {
			index += 1;
			continue;
		}
		if (chunk.text.length <= overflow) {
			overflow -= chunk.text.length;
			pendingChars -= chunk.text.length;
			output.splice(index, 1);
			continue;
		}
		const trimmed = sliceUtf16Safe(chunk.text, overflow);
		const removedChars = chunk.text.length - trimmed.length;
		pendingChars -= removedChars;
		chunk.text = trimmed;
		break;
	}
	return pendingChars;
}
/** Keeps only the last `max` characters for bounded aggregate output storage. */
function trimWithCap(text, max) {
	return tail(text, max);
}
/** Lists backgrounded running sessions visible to reconnect/poll callers. */
function listRunningSessions() {
	return Array.from(runningSessions.values()).filter((s) => s.backgrounded);
}
/** Lists retained finished background sessions. */
function listFinishedSessions() {
	return Array.from(finishedSessions.values());
}
/** Test-only reset for in-memory registry state and retention timers. */
function resetProcessRegistryForTests() {
	runningSessions.clear();
	finishedSessions.clear();
	finishedSessionsByProcess = /* @__PURE__ */ new WeakMap();
	finishedSessionOutputChars = 0;
	activeBackgroundExecSessionIds.clear();
	stopSweeper();
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.bashProcessRegistryTestApi")] = { resetProcessRegistryForTests };
/** Overrides finished-session retention TTL, clamped to supported bounds. */
function setJobTtlMs(value) {
	if (value === void 0 || Number.isNaN(value)) return;
	jobTtlMs = clampTtl(value);
	stopSweeper();
	startSweeper();
}
function pruneFinishedSessions() {
	const cutoff = Date.now() - jobTtlMs;
	for (const [id, session] of finishedSessions.entries()) if (session.endedAt < cutoff) deleteFinishedSession(id);
}
function startSweeper() {
	if (sweeper) return;
	sweeper = setInterval(pruneFinishedSessions, Math.max(3e4, jobTtlMs / 6));
	sweeper.unref?.();
}
function stopSweeper() {
	if (!sweeper) return;
	clearInterval(sweeper);
	sweeper = null;
}
//#endregion
export { markExited as _, deleteSession as a, setJobTtlMs as b, getActiveBackgroundExecSessionCount as c, getSession as d, hasActiveBackgroundExecSession as f, markBackgrounded as g, listRunningSessions as h, clearFinishedSessionsForScopes as i, getFinishedSession as l, listFinishedSessions as m, addSession as n, drainFinishedSession as o, isProcessSessionIdTaken as p, appendOutput as r, drainSession as s, acknowledgeNotifyOnExit as t, getFinishedSessionForProcess as u, markTerminalPollObserved as v, tail as x, recordNotifyOnExitRemoval as y };
