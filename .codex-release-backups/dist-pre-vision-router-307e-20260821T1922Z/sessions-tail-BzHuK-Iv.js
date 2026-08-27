import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { C as parseStrictNonNegativeInteger } from "./number-coercion-oCkfUEEq.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { f as resolveAgentIdFromSessionKey } from "./session-key-D8GLfPr_.js";
import { r as getRuntimeConfig } from "./io-CeQckj5v.js";
import "./config-Dl8DJbzM.js";
import { i as resolveStoredSessionKeyForAgentStore } from "./session-store-key-CoZdm5gl.js";
import { qt as listSessionEntriesReadOnly } from "./session-accessor-Bi6bzKQE.js";
import { r as readAcpSessionMeta } from "./session-meta-CkBRKe6w.js";
import { n as loadSqliteTrajectoryRuntimeEventRowsSync } from "./runtime-store.sqlite-BP4PPEie.js";
import { t as shortenText } from "./text-format-B61TPv4i.js";
import { t as resolveSessionStoreTargetsOrExit } from "./session-store-targets-CytBdW8t.js";
//#region src/commands/sessions-tail.ts
/**
* Session trajectory tail command.
*
* It selects active or requested sessions, renders recent trajectory events,
* and can follow newly appended SQLite trajectory rows.
*/
const DEFAULT_TAIL_COUNT = 80;
const SESSION_KEY_PAD = 30;
const EVENT_TYPE_PAD = 16;
const FOLLOW_INTERVAL_MS = 1e3;
function parseTailCount(value) {
	if (value === void 0) return DEFAULT_TAIL_COUNT;
	return parseStrictNonNegativeInteger(value) ?? null;
}
function formatTimestamp(ts) {
	const date = new Date(ts);
	if (Number.isNaN(date.getTime())) return "--:--:--";
	return date.toISOString().slice(11, 19);
}
function modelLabel(event) {
	const provider = event.provider?.trim();
	const model = event.modelId?.trim();
	if (provider && model) return `${provider}/${model}`;
	return model || provider || void 0;
}
function toolName(data) {
	return normalizeOptionalString(data?.name) ?? normalizeOptionalString(data?.toolName) ?? "tool";
}
function resultStatus(data) {
	if (data?.success === true) return "ok";
	if (data?.success === false || data?.isError === true) return "error";
	return normalizeOptionalString(data?.status) ?? "done";
}
function modelCompletionStatus(data) {
	if (data?.timedOut === true) return "timeout";
	if (data?.aborted === true) return "aborted";
	if (normalizeOptionalString(data?.promptError)) return "error";
	return "done";
}
function safePreview(event) {
	const data = event.data;
	switch (event.type) {
		case "session.started": return "session started";
		case "context.compiled": {
			const tools = Array.isArray(data?.tools) ? data.tools.length : void 0;
			return tools === void 0 ? "context compiled" : `context compiled (${tools} tools)`;
		}
		case "prompt.submitted": return "prompt submitted";
		case "prompt.skipped": {
			const reason = normalizeOptionalString(data?.reason);
			return `prompt skipped${reason ? `: ${reason}` : ""}`;
		}
		case "tool.call": return `${toolName(data)} {...redacted...}`;
		case "tool.timeout": return `${toolName(data)} timeout`;
		case "tool.result": return `${toolName(data)} ${resultStatus(data)}`;
		case "model.completed": {
			const model = modelLabel(event);
			const status = modelCompletionStatus(data);
			return model ? `${model} ${status}` : status;
		}
		case "session.ended": return normalizeOptionalString(data?.status) ?? "ended";
		case "trace.truncated": return "trajectory truncated";
		default: return normalizeOptionalString(data?.status) ?? normalizeOptionalString(data?.name) ?? "";
	}
}
function formatProgressLine(event) {
	const sessionLabel = shortenText(event.sessionKey ?? event.sessionId, SESSION_KEY_PAD).padEnd(SESSION_KEY_PAD);
	const typeLabel = shortenText(event.type, EVENT_TYPE_PAD).padEnd(EVENT_TYPE_PAD);
	const preview = safePreview(event);
	return [
		formatTimestamp(event.ts),
		typeLabel,
		sessionLabel,
		preview
	].join(" ").trimEnd();
}
function readSqliteTrajectorySnapshot(source, tailEvents) {
	const rows = loadSqliteTrajectoryRuntimeEventRowsSync({
		agentId: source.agentId,
		sessionId: source.sessionId,
		storePath: source.storePath,
		tailEvents
	});
	return {
		events: rows.map((row) => row.event),
		maxStorageSeq: rows.at(-1)?.seq ?? -1
	};
}
function readTailSnapshot(selection, tailEvents) {
	return readSqliteTrajectorySnapshot(selection.source, tailEvents);
}
function renderEvents(events, runtime) {
	for (const event of events) runtime.log(formatProgressLine(event));
}
function isRunningSession(selection) {
	const acpMeta = readAcpSessionMeta({ sessionKey: resolveStoredSessionKeyForAgentStore({
		cfg: getRuntimeConfig(),
		agentId: selection.agentId,
		sessionKey: selection.key
	}) });
	return selection.entry.status === "running" || acpMeta?.state === "running";
}
function compareSelectionsByUpdatedAt(a, b) {
	return (b.entry.updatedAt ?? 0) - (a.entry.updatedAt ?? 0);
}
function buildTailSelection(params) {
	const sessionId = params.entry.sessionId?.trim();
	if (!sessionId) return null;
	return {
		agentId: params.agentId,
		entry: params.entry,
		key: params.key,
		source: {
			agentId: params.agentId,
			sessionId,
			storePath: params.storePath
		},
		storePath: params.storePath
	};
}
function selectSessionsToTail(selections, sessionKey) {
	const requested = sessionKey?.trim();
	if (requested) return selections.filter((selection) => selection.key === requested);
	const running = selections.filter((selection) => isRunningSession(selection));
	if (running.length > 0) return running.toSorted(compareSelectionsByUpdatedAt);
	const latest = selections.toSorted(compareSelectionsByUpdatedAt)[0];
	return latest ? [latest] : [];
}
function readNewSqliteFollowEvents(state) {
	const rows = loadSqliteTrajectoryRuntimeEventRowsSync({
		agentId: state.selection.source.agentId,
		afterSeq: state.lastStorageSeq,
		sessionId: state.selection.source.sessionId,
		storePath: state.selection.source.storePath
	});
	if (rows.length === 0) return [];
	state.lastStorageSeq = rows.at(-1)?.seq ?? state.lastStorageSeq;
	return rows.map((row) => row.event);
}
async function followSelections(selections, runtime, initialSnapshots) {
	const states = selections.map((selection) => {
		return {
			lastStorageSeq: initialSnapshots.get(selection)?.maxStorageSeq ?? -1,
			selection
		};
	});
	await new Promise((resolve) => {
		const interval = setInterval(() => {
			for (const state of states) try {
				renderEvents(readNewSqliteFollowEvents(state), runtime);
			} catch (error) {
				runtime.error(`Failed to read trajectory progress for ${state.selection.key}: ${formatErrorMessage(error)}`);
			}
		}, FOLLOW_INTERVAL_MS);
		const stop = () => {
			clearInterval(interval);
			process.off("SIGINT", stop);
			process.off("SIGTERM", stop);
			resolve();
		};
		process.once("SIGINT", stop);
		process.once("SIGTERM", stop);
	});
}
function resolveTailTargetAgent(opts) {
	if (opts.agent?.trim() || opts.store?.trim() || opts.allAgents === true) return opts.agent;
	return opts.sessionKey?.trim() ? resolveAgentIdFromSessionKey(opts.sessionKey) : void 0;
}
/** Tails recent trajectory events for the selected session(s). */
async function sessionsTailCommand(opts, runtime) {
	const tailCount = parseTailCount(opts.tail);
	if (tailCount === null) {
		runtime.error("--tail must be a non-negative integer, for example --tail 25.");
		runtime.exit(1);
		return;
	}
	const targets = resolveSessionStoreTargetsOrExit({
		cfg: getRuntimeConfig(),
		opts: {
			store: opts.store,
			agent: resolveTailTargetAgent(opts),
			allAgents: opts.allAgents
		},
		runtime
	});
	if (!targets) return;
	const selections = [];
	for (const target of targets) for (const { sessionKey, entry } of listSessionEntriesReadOnly({
		agentId: target.agentId,
		storePath: target.storePath
	})) {
		const selection = buildTailSelection({
			agentId: target.agentId,
			entry,
			key: sessionKey,
			storePath: target.storePath
		});
		if (selection) selections.push(selection);
	}
	const selected = selectSessionsToTail(selections, opts.sessionKey);
	if (selected.length === 0) {
		const suffix = opts.sessionKey ? ` for ${opts.sessionKey}` : "";
		runtime.log(`No sessions found${suffix}.`);
		return;
	}
	const followSnapshots = /* @__PURE__ */ new Map();
	for (const selection of selected) {
		const snapshot = readTailSnapshot(selection, Math.max(tailCount, opts.follow ? 1 : 0));
		followSnapshots.set(selection, snapshot);
		renderEvents(tailCount > 0 ? snapshot.events.slice(-tailCount) : [], runtime);
	}
	if (opts.follow) await followSelections(selected, runtime, followSnapshots);
}
//#endregion
export { sessionsTailCommand };
