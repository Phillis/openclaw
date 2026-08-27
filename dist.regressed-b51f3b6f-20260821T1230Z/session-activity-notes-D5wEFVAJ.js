import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { m as readNonBlankString } from "./string-coerce-CIXf7egm.js";
import { s as asFiniteNumber } from "./number-coercion-oCkfUEEq.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { u as redactToolPayloadText } from "./redact-Cl7lwBnl.js";
import { at as normalizeAgentRunTerminalReplySnapshot } from "./openclaw-state-db-DlCMR4eQ.js";
import { f as stripInternalRuntimeContext, t as INTERNAL_RUNTIME_CONTEXT_BEGIN } from "./internal-runtime-context-E3ku7Huk.js";
import "./tokens-CMI0yx54.js";
import { i as buildAgentRunTerminalOutcomeFromLifecycleEvent, o as classifyAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-D3lKKt7D.js";
import "./heartbeat-BB6nm0Fy.js";
import { d as normalizeAgentPlanSteps } from "./streaming-3t37hp7G.js";
//#region src/agents/session-activity-notes.ts
const MAX_NOTES = 40;
const MAX_NOTE_BYTES = 8 * 1024;
const DEFAULT_NOTE_MAX_CHARS = 360;
const ASSISTANT_NOTE_MAX_CHARS = 240;
const ASSISTANT_BUFFER_MAX_CHARS = 4096;
const ASSISTANT_BUFFER_THROTTLE_MS = 150;
const MAX_ITEM_STATUSES = 160;
function createSessionActivityNoteState() {
	return {
		noteSequence: 0,
		notes: [],
		noteBytes: 0,
		itemStatuses: /* @__PURE__ */ new Map(),
		assistantBuffer: "",
		assistantRawBuffer: "",
		assistantBufferDirty: false,
		lastAssistantBufferAt: 0
	};
}
function assembleAssistantBuffer(value, maxChars) {
	const openIndex = value.lastIndexOf(INTERNAL_RUNTIME_CONTEXT_BEGIN);
	if (!(openIndex !== -1 && !value.includes("<<<END_OPENCLAW_INTERNAL_CONTEXT>>>", openIndex))) return keepUtf16SafeTail(stripInternalRuntimeContext(value), maxChars);
	return `${keepUtf16SafeTail(stripInternalRuntimeContext(value.slice(0, openIndex)), maxChars)}${INTERNAL_RUNTIME_CONTEXT_BEGIN}${keepUtf16SafeTail(value.slice(openIndex + INTERNAL_RUNTIME_CONTEXT_BEGIN.length), maxChars)}`;
}
function syncAssistantBuffer(state, at = Date.now()) {
	if (!state.assistantBufferDirty) return;
	state.assistantBuffer = assembleAssistantBuffer(state.assistantRawBuffer, ASSISTANT_BUFFER_MAX_CHARS);
	state.assistantBufferDirty = false;
	state.lastAssistantBufferAt = at;
}
function keepUtf16SafeTail(value, maxChars) {
	if (value.length <= maxChars) return value;
	let start = value.length - maxChars;
	const lead = value.charCodeAt(start);
	if (lead >= 56320 && lead <= 57343) start += 1;
	return value.slice(start);
}
function sanitizeActivityText(value, maxChars) {
	return truncateUtf16Safe(redactToolPayloadText(stripInternalRuntimeContext(value)).replace(/\s+/gu, " ").trim(), maxChars);
}
function summarizeToolArgs(args) {
	if (!args || typeof args !== "object") return "";
	const record = args;
	const summary = {};
	for (const key of [
		"action",
		"cmd",
		"command",
		"cwd",
		"file",
		"filePath",
		"host",
		"package",
		"path",
		"pattern",
		"query",
		"target",
		"url"
	]) {
		const value = record[key];
		if (typeof value === "string") summary[key] = redactToolPayloadText(value);
		else if (typeof value === "number" || typeof value === "boolean") summary[key] = value;
	}
	try {
		if (Object.keys(summary).length > 0) return sanitizeActivityText(JSON.stringify(summary), 220);
		return sanitizeActivityText(`args: ${Object.keys(record).toSorted().slice(0, 8).join(", ")}`, 220);
	} catch {
		return "";
	}
}
function addActivityNote(state, raw, maxChars) {
	const text = sanitizeActivityText(raw, maxChars);
	if (!text) return;
	state.noteSequence += 1;
	const note = {
		sequence: state.noteSequence,
		text,
		bytes: Buffer.byteLength(text, "utf8")
	};
	state.notes.push(note);
	state.noteBytes += note.bytes;
	while (state.notes.length > MAX_NOTES || state.noteBytes > MAX_NOTE_BYTES) {
		const removed = state.notes.shift();
		state.noteBytes -= removed?.bytes ?? 0;
	}
}
function rememberItemStatus(state, itemId, status, limit) {
	if (state.itemStatuses.get(itemId) === status) return false;
	state.itemStatuses.delete(itemId);
	state.itemStatuses.set(itemId, status);
	pruneMapToMaxSize(state.itemStatuses, limit);
	return true;
}
function flushSessionActivityAssistantNote(state, noteMaxChars = DEFAULT_NOTE_MAX_CHARS) {
	syncAssistantBuffer(state);
	if (!state.assistantBuffer || state.assistantBuffer.includes("<<<BEGIN_OPENCLAW_INTERNAL_CONTEXT>>>")) return;
	const visible = keepUtf16SafeTail(sanitizeActivityText(state.assistantBuffer, ASSISTANT_BUFFER_MAX_CHARS), ASSISTANT_NOTE_MAX_CHARS).trim();
	if (!visible || visible === "HEARTBEAT_OK" || visible === "[OpenClaw heartbeat poll]") return;
	if (visible === state.lastAssistantNote) return;
	state.lastAssistantNote = visible;
	addActivityNote(state, `Assistant: ${visible}`, noteMaxChars);
}
function noteSessionActivityEvent(state, event, noteMaxChars = DEFAULT_NOTE_MAX_CHARS) {
	const data = event.data;
	switch (event.stream) {
		case "lifecycle": {
			const phase = data.phase;
			if (phase === "start") addActivityNote(state, "Run started", noteMaxChars);
			else if (phase === "finishing") addActivityNote(state, "Run is wrapping up", noteMaxChars);
			else if (phase === "end" || phase === "error") {
				const health = terminalHealthFor(event);
				const error = readNonBlankString(data.error);
				addActivityNote(state, error ? `Run ${health}: ${error}` : `Run ${health}`, noteMaxChars);
				const terminalReply = normalizeAgentRunTerminalReplySnapshot(data.terminalReply);
				state.terminalReply = terminalReply;
				if (terminalReply?.disposition === "visible") addActivityNote(state, `Assistant: ${terminalReply.text}`, noteMaxChars);
			}
			return;
		}
		case "tool": {
			if (data.phase !== "start") return;
			const name = readNonBlankString(data.name) ?? "tool";
			const args = summarizeToolArgs(data.args);
			addActivityNote(state, args ? `Tool ${name}: ${args}` : `Tool ${name}`, noteMaxChars);
			return;
		}
		case "command_output": {
			if (data.phase !== "end") return;
			const title = readNonBlankString(data.title) ?? readNonBlankString(data.name) ?? "command";
			const exitCode = asFiniteNumber(data.exitCode);
			addActivityNote(state, `${title}: ${readNonBlankString(data.status) ?? (exitCode === 0 ? "completed" : "failed")}${exitCode === void 0 ? "" : ` (exit ${exitCode})`}`, noteMaxChars);
			return;
		}
		case "item": {
			const status = readNonBlankString(data.status);
			const title = readNonBlankString(data.title);
			const itemId = readNonBlankString(data.itemId) ?? title;
			if (!status || !title || !itemId) return;
			if (![
				"running",
				"completed",
				"failed",
				"blocked"
			].includes(status)) return;
			if (!rememberItemStatus(state, itemId, status, MAX_ITEM_STATUSES)) return;
			addActivityNote(state, `${title}: ${status}`, noteMaxChars);
			return;
		}
		case "plan": {
			const steps = normalizeAgentPlanSteps(data.steps);
			if (!steps) return;
			state.planProgress = {
				completed: steps.filter((step) => step.status === "completed").length,
				total: steps.length
			};
			for (const [index, step] of steps.entries()) {
				if (!rememberItemStatus(state, `plan:${index}:${step.step}`, step.status, MAX_ITEM_STATUSES)) continue;
				const status = step.status === "in_progress" ? "running" : step.status;
				addActivityNote(state, `Plan: ${step.step}: ${status}`, noteMaxChars);
			}
			return;
		}
		case "assistant": {
			const full = readNonBlankString(data.text);
			const delta = readNonBlankString(data.delta);
			if (full) state.assistantRawBuffer = full;
			else if (delta) {
				syncAssistantBuffer(state, event.ts);
				state.assistantBuffer = assembleAssistantBuffer(state.assistantBuffer + delta, ASSISTANT_BUFFER_MAX_CHARS);
				state.assistantRawBuffer = state.assistantBuffer;
				state.lastAssistantBufferAt = event.ts;
				return;
			} else return;
			state.assistantBufferDirty = true;
			if (event.ts - state.lastAssistantBufferAt >= ASSISTANT_BUFFER_THROTTLE_MS) syncAssistantBuffer(state, event.ts);
			return;
		}
		case "approval":
			if (data.status !== "pending" && data.phase !== "requested") return;
			addActivityNote(state, `Waiting for approval: ${readNonBlankString(data.title) ?? "user action"}`, noteMaxChars);
			break;
		default: break;
	}
}
function terminalHealthFor(event) {
	const phase = event.data.phase;
	return classifyAgentRunTerminalOutcome(buildAgentRunTerminalOutcomeFromLifecycleEvent({
		phase: phase === "end" ? "end" : "error",
		data: event.data
	})) === "success" ? "done" : "failed";
}
//#endregion
export { terminalHealthFor as i, flushSessionActivityAssistantNote as n, noteSessionActivityEvent as r, createSessionActivityNoteState as t };
