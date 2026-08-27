import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import "./src-BkwWvwB2.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { i as asOptionalObjectRecord } from "./record-coerce-DItp3I4t.js";
import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { u as tryProcessCwd } from "./home-dir-DcrXWQPU.js";
import { r as formatErrorMessage } from "./errors-CqPTYU6G.js";
import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import { t as loggingState } from "./state-CNIDfzP9.js";
import { r as stripAnsi$1 } from "./ansi-9qL8iF9E.js";
import { s as registerUncaughtExceptionHandler } from "./unhandled-rejections-D39qPF7L.js";
import { t as modelKey } from "./model-key-CMdQNkZf.js";
import { h as resolveSessionAgentId, l as resolveAgentIdByWorkspacePath } from "./agent-scope-D9GLFAyB.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { b as tryResolveLegacyCompatibilityAgentId, p as resolveDefaultAgentId, y as tryResolveDefaultAgentId } from "./agent-scope-config-CsnnOL14.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { b as toAgentStoreSessionKey, i as agentSessionKeysMatchByRequestKey, u as normalizeMainKey } from "./session-key-D8GLfPr_.js";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-CLtsGq3M.js";
import { r as getRuntimeConfig } from "./io-BTBpQ7uO.js";
import { o as setConsoleSubsystemFilter } from "./console-BvkCzW3T.js";
import "./model-ref-shared-poyRjWh_.js";
import "./legacy.default-agent-owner-0YGX8Nyg.js";
import { f as resolveResponseUsageMode, i as isSessionDefaultDirectiveValue, l as normalizeUsageDisplay, s as normalizeThinkLevel } from "./thinking.shared-bHYuuc1L.js";
import { i as resolveExecutableFromPathEnv } from "./executable-path-D05F-hRH.js";
import { r as listThinkingLevelLabels, t as formatThinkingLevels } from "./thinking-D9bT8eOf.js";
import { n as ok, t as err } from "./result-BQGgYouL.js";
import "./config-CfeGo4K4.js";
import { r as runCommandWithTimeout } from "./exec-Cmwsxh9J.js";
import { i as resolveTrustedWindowsCmdExe, n as isWindowsBatchCommand, t as buildWindowsCmdExeCommandLine } from "./windows-command-LFdkl-nm.js";
import { o as classifyGatewayConnectFailure } from "./connect-error-details-Do3cAiyu.js";
import { t as resolveCanonicalMainSessionKey } from "./main-session-key-D69_dk8f.js";
import { a as formatRawAssistantErrorForUi } from "./assistant-error-format-DYl5XHJg.js";
import { h as isAuthErrorMessage, t as classifyFailoverReason } from "./classify-kl1ByQTv.js";
import { n as shouldForwardModelCommandToServer } from "./commands-registry.data-DjRvv6xX.js";
import { n as listChatCommands, r as listChatCommandsForConfig } from "./commands-registry-list-NuMFGX1G.js";
import { i as resolveTextCommand } from "./commands-registry-normalize-CaOk1bq2.js";
import { t as formatTokenCount } from "./token-format-D942KbWN.js";
import "./usage-format-DVlX8Bjz.js";
import "./embedded-agent-helpers-DHqB9zvZ.js";
import { o as resolveToolDisplay, t as formatToolDetail } from "./tool-display-BmGn_9WG.js";
import { r as resolveSessionInfoModelSelection } from "./model-selection-display-Bi55ID0l.js";
import { n as resolveCurrentOpenClawCliInvocation } from "./openclaw-cli-invocation-B9R05uXF.js";
import "./commands-registry-C38Kk_Ud.js";
import { a as isChatStopCommandText } from "./chat-abort-9K8jqLDL.js";
import { n as isApprovalStaleError } from "./approval-errors-Bzw_-cAg.js";
import { n as formatTimeAgo } from "./format-relative-DhTC8f11.js";
import { t as normalizeGroupActivation } from "./group-activation-B6ER3hWD.js";
import { n as loadRecentSessions, t as buildSessionChoices } from "./tui-session-picker-DefD8GxZ.js";
import { a as writeTuiLastSessionKey, i as resolveRememberedTuiSessionKey, r as readTuiLastSessionKey, t as buildTuiLastSessionScopeKey } from "./tui-last-session-BclEWoo1.js";
import { t as resolveLocalRunShutdownGraceMs } from "./local-run-shutdown-BQKagb2W.js";
import { _ as sanitizeMarkdownSource, a as extractThinkingFromMessage, c as formatPrimitiveString, d as formatTuiFooter, f as isCommandMarkedMessage, g as resolveFinalAssistantText, h as isolateRtlRenderedLine, i as extractTextFromMessage, l as formatTuiAbortDiagnostic, m as isTuiAssistantAttachmentBlock, n as extractAssistantAttachmentText, o as extractTuiAbortedText, p as isTerminalSafeAutocompleteValue, r as extractContentFromMessage, s as formatContextUsageLine, t as composeThinkingAndContent, u as formatTuiErrorMessage, v as sanitizeRenderableLine, y as sanitizeRenderableText } from "./tui-formatters-ByaIXdNl.js";
import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import chalk from "chalk";
import { StringDecoder } from "node:string_decoder";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
import { Box, CombinedAutocompleteProvider, Container, Editor, Input, Key, Loader, Markdown, ProcessTerminal, SelectList, SettingsList, Spacer, TUI, Text, fuzzyFilter, getKeybindings, isKeyRelease, matchesKey, truncateToWidth, visibleWidth } from "@earendil-works/pi-tui";
//#region packages/gateway-client/src/session-projection-run-event.ts
function readNonemptyString$1(value) {
	return typeof value === "string" ? value.trim() || null : null;
}
function reduceSessionProjectionRunEventImpl(projection, event, scope = {}) {
	const runId = readNonemptyString$1(event.runId);
	if (!runId || typeof event.state !== "string" || ![
		"delta",
		"final",
		"error",
		"aborted"
	].includes(event.state)) return null;
	const message = event.message;
	const messageStopReason = message !== null && typeof message === "object" && !Array.isArray(message) ? readNonemptyString$1(message.stopReason) : null;
	const stopReason = readNonemptyString$1(event.stopReason) ?? messageStopReason;
	const errorKind = readNonemptyString$1(event.errorKind);
	const base = {
		runId,
		...message === void 0 ? {} : { message },
		scope
	};
	const next = reduceSessionProjection(projection, event.state === "delta" ? {
		type: "runDelta",
		...base
	} : {
		type: "runTerminal",
		...base,
		status: event.state === "aborted" ? "aborted" : event.state === "error" ? errorKind === "timeout" ? "timeout" : "error" : event.yielded === true && stopReason === "end_turn" ? "yielded" : stopReason === "error" ? "error" : "completed",
		...stopReason === null ? {} : { stopReason },
		...errorKind === null ? {} : { errorKind },
		...typeof event.errorMessage === "string" ? { errorMessage: event.errorMessage } : {}
	});
	return {
		projection: next,
		previousRun: projection.runs[runId],
		currentRun: next.runs[runId]
	};
}
//#endregion
//#region packages/gateway-client/src/session-projection.ts
/** Browser-safe identity and replay rules shared by Gateway conversation clients. */
const MAX_TRACKED_SESSION_RUNS = 200;
const RETAINED_SESSION_RUNS = 150;
const SESSION_PROJECTION_SCOPE_KEYS = [
	"sessionKey",
	"sessionId",
	"agentId",
	"lifecycleRevision",
	"activeLeafEntryId"
];
function readRecord(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value) ? value : null;
}
function readNonemptyString(value) {
	return typeof value === "string" ? value.trim() || null : null;
}
function readPositiveSafeInteger(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value > 0 ? value : null;
}
/** History and status markers carry transcript order even when they have no chat role. */
function readSessionMessageSequence(message, envelope) {
	return readPositiveSafeInteger(readRecord(readRecord(message)?.["__openclaw"])?.seq) ?? readPositiveSafeInteger(envelope?.messageSeq);
}
/** Run ownership normalizes a user-turn suffix without changing its persisted send key. */
function normalizeSessionProjectionRunId(value) {
	const runId = readNonemptyString(value);
	return runId?.endsWith(":user") ? runId.slice(0, -5) || null : runId;
}
/** Persisted transcript facts win over envelope projections and provider-local import IDs. */
function readSessionMessageIdentity(message, envelope) {
	const record = readRecord(message);
	const role = readNonemptyString(record?.role)?.toLowerCase();
	if (!record || !role) return null;
	const metadata = readRecord(record["__openclaw"]);
	const importedFrom = readNonemptyString(metadata?.importedFrom);
	const cliSessionId = readNonemptyString(metadata?.cliSessionId);
	const externalId = readNonemptyString(metadata?.externalId);
	const idempotencyKey = readNonemptyString(metadata?.idempotencyKey) ?? readNonemptyString(record.idempotencyKey) ?? readNonemptyString(envelope?.idempotencyKey) ?? readNonemptyString(envelope?.clientRunId);
	return {
		role,
		id: readNonemptyString(metadata?.id) ?? readNonemptyString(envelope?.messageId),
		sequence: readSessionMessageSequence(message, envelope),
		idempotencyKey,
		runId: normalizeSessionProjectionRunId(idempotencyKey) ?? normalizeSessionProjectionRunId(envelope?.runId),
		isImported: Boolean(importedFrom || cliSessionId || externalId),
		externalSource: importedFrom && cliSessionId && externalId ? JSON.stringify([
			importedFrom,
			cliSessionId,
			externalId
		]) : null
	};
}
/** Local turns have no durable transcript metadata beyond their own optional send key. */
function isLocallyOptimisticSessionMessage(message) {
	const identity = readSessionMessageIdentity(message);
	if (!identity || identity.role !== "user" && identity.role !== "assistant") return false;
	const metadata = readRecord(readRecord(message)?.["__openclaw"]);
	return !metadata || Object.keys(metadata).every((key) => key === "idempotencyKey");
}
function createEntry(message, options) {
	const identity = readSessionMessageIdentity(message, options?.envelope);
	const inferredPendingRunId = options?.live !== true && isLocallyOptimisticSessionMessage(message) ? identity?.runId : null;
	const pendingRunId = normalizeSessionProjectionRunId(options?.pendingRunId ?? inferredPendingRunId);
	return {
		message,
		identity,
		live: options?.live === true,
		pending: pendingRunId !== null,
		pendingRunId
	};
}
function createProjectionEntries(messages) {
	let pendingUserRunId = null;
	return messages.map((message) => {
		const entry = createEntry(message);
		if (entry.identity?.role === "user") {
			pendingUserRunId = entry.pending ? entry.pendingRunId : null;
			return entry;
		}
		if (pendingUserRunId && entry.identity?.role === "assistant" && !entry.pending && isLocallyOptimisticSessionMessage(message)) return createEntry(message, { pendingRunId: pendingUserRunId });
		if (!isLocallyOptimisticSessionMessage(message)) pendingUserRunId = null;
		return entry;
	});
}
function createSessionProjection(scope = {}, messages = []) {
	const entries = createProjectionEntries(messages);
	return {
		scope: { ...scope },
		entries,
		messages: entries.map((entry) => entry.message),
		runs: {},
		hasTransportGap: false
	};
}
function scopesMatch(left, right) {
	return SESSION_PROJECTION_SCOPE_KEYS.every((key) => left[key] === void 0 || right[key] === void 0 || left[key] === right[key]);
}
function readEventScope(event) {
	const scope = { ...event.scope };
	for (const key of SESSION_PROJECTION_SCOPE_KEYS) if (event[key] !== void 0) Object.assign(scope, { [key]: event[key] });
	return scope;
}
function sameTranscriptIdentity(left, right) {
	if (!left || !right || left.role !== right.role) return false;
	if (left.isImported || right.isImported) {
		if (!left.isImported || !right.isImported) return false;
		if (left.externalSource || right.externalSource) return Boolean(left.externalSource && left.externalSource === right.externalSource);
		return left.sequence !== null && right.sequence !== null && left.sequence === right.sequence;
	}
	if (left.id || right.id) return Boolean(left.id && right.id && left.id === right.id);
	return left.sequence !== null && right.sequence !== null && left.sequence === right.sequence;
}
function entryMatches(left, right, allowSnapshotPromotion = false) {
	if (sameTranscriptIdentity(left.identity, right.identity)) return true;
	const durableEntry = left.identity?.id ? left : right.identity?.id ? right : null;
	const provisionalEntry = durableEntry === left ? right : durableEntry === right ? left : null;
	if (durableEntry?.live && provisionalEntry?.live && durableEntry.identity?.role === "assistant" && provisionalEntry.identity?.role === "assistant" && !durableEntry.identity.isImported && !provisionalEntry.identity.isImported && !provisionalEntry.identity.id && durableEntry.identity.runId && durableEntry.identity.runId === provisionalEntry.identity.runId) return true;
	const persisted = left.identity;
	const observed = right.identity;
	if (allowSnapshotPromotion && right.live && persisted && observed && persisted.role === observed.role && !persisted.isImported && !observed.isImported && persisted.id && !observed.id && (persisted.sequence !== null && persisted.sequence === observed.sequence || persisted.role === "assistant" && observed.sequence === null && persisted.runId !== null && persisted.runId === observed.runId)) return true;
	if (left.pending && right.pending) return Boolean(left.identity?.role === right.identity?.role && left.pendingRunId && left.pendingRunId === right.pendingRunId);
	const pending = left.pending ? left : right.pending ? right : null;
	const authoritative = pending === left ? right : pending === right ? left : null;
	return Boolean(pending && authoritative && pending.identity && authoritative.identity && pending.identity.role === authoritative.identity.role && !pending.identity.isImported && !authoritative.identity.isImported && pending.pendingRunId && pending.pendingRunId === authoritative.identity.runId && (pending.identity.sequence === null || authoritative.identity.sequence === null || pending.identity.sequence === authoritative.identity.sequence));
}
function withEntries(state, entries) {
	return {
		...state,
		entries,
		messages: entries.map((entry) => entry.message)
	};
}
function insertEntry(entries, incoming, runs) {
	const sequence = incoming.identity?.sequence;
	let nextIndex = sequence === void 0 || sequence === null ? -1 : entries.findIndex((entry) => {
		const candidate = entry.identity?.sequence;
		return candidate !== void 0 && candidate !== null && candidate > sequence;
	});
	if (nextIndex < 0 && incoming.identity?.role === "user" && incoming.identity.runId) {
		const runId = incoming.identity.runId;
		const terminalMessage = runs?.[runId]?.message;
		nextIndex = entries.findIndex((entry) => entry.identity?.role === "assistant" && (entry.identity.runId === runId || entry.message === terminalMessage));
	}
	return nextIndex < 0 ? [...entries, incoming] : [
		...entries.slice(0, nextIndex),
		incoming,
		...entries.slice(nextIndex)
	];
}
function projectLiveSessionMessage(state, message, envelope, scope = {}) {
	if (!scopesMatch(state.scope, scope)) return state;
	const incoming = createEntry(message, {
		envelope,
		live: true
	});
	if (!incoming.identity) return state;
	const existingIndex = state.entries.findIndex((entry) => entryMatches(entry, incoming));
	if (existingIndex < 0) return withEntries(state, insertEntry(state.entries, incoming, state.runs));
	const existing = state.entries[existingIndex];
	if (existing && existing.message === message && existing.live && !existing.pending) return state;
	if (existing?.pending && incoming.identity.sequence !== null) {
		const sequence = incoming.identity.sequence;
		return withEntries(state, state.entries.some(({ identity }, index) => identity?.sequence != null && (index < existingIndex ? identity.sequence > sequence : identity.sequence < sequence)) ? insertEntry(state.entries.filter((_, index) => index !== existingIndex), incoming, state.runs) : state.entries.toSpliced(existingIndex, 1, incoming));
	}
	return withEntries(state, [
		...state.entries.slice(0, existingIndex),
		incoming,
		...state.entries.slice(existingIndex + 1)
	]);
}
/** Only observed live events and this client's pending turns may survive an older snapshot. */
function reconcileSessionProjectionSnapshot(state, messages, scope = {}, options = {}) {
	const visibleMessages = options.shouldIncludeMessage ? messages.filter(options.shouldIncludeMessage) : messages;
	if (!scopesMatch(state.scope, scope)) return createSessionProjection(scope, visibleMessages);
	let entries = createProjectionEntries(visibleMessages);
	for (const current of state.entries) {
		if (!current.live && !current.pending || options.shouldIncludeMessage?.(current.message) === false || entries.filter((entry) => entryMatches(entry, current, true)).length === 1) continue;
		entries = insertEntry(entries, current, state.runs);
	}
	return {
		...withEntries(state, entries),
		scope: {
			...state.scope,
			...scope
		},
		hasTransportGap: false
	};
}
function hasDisplayableSessionMessage(message) {
	if (typeof message === "string") return message.trim().length > 0;
	const record = readRecord(message);
	if (!record) return false;
	const displayableBlocks = Array.isArray(record.content) && record.content.some((block) => {
		const entry = readRecord(block);
		return entry ? entry.type !== "text" || readNonemptyString(entry.text) !== null : typeof block === "string" && block.trim().length > 0;
	});
	const media = readRecord(record["__openclaw"])?.media;
	return Boolean(typeof record.content === "string" && record.content.trim() || displayableBlocks || Array.isArray(media) && media.length > 0);
}
function readSessionProjectionFinalMessageIdentity(message) {
	if (!hasDisplayableSessionMessage(message)) return null;
	const identity = readSessionMessageIdentity(message);
	if (identity?.externalSource) return `import:${identity.role}:${identity.externalSource}`;
	if (identity?.id && !identity.isImported) return `id:${identity.role}:${identity.id}`;
	if (identity?.sequence !== null && identity?.sequence !== void 0) return `seq:${identity.role}:${identity.sequence}`;
	const record = readRecord(message);
	const metadata = readRecord(record?.["__openclaw"]);
	try {
		return `content:${JSON.stringify([
			identity?.role ?? "assistant",
			typeof message === "string" ? message : record?.content ?? null,
			metadata?.media ?? null,
			identity?.isImported ? [
				metadata?.importedFrom ?? null,
				metadata?.cliSessionId ?? null,
				metadata?.externalId ?? null
			] : null
		])}`;
	} catch {
		return null;
	}
}
/** Replayed finals are recognized against this run's bounded canonical terminal history. */
function hasSessionProjectionAcceptedFinal(run, message) {
	const identity = readSessionProjectionFinalMessageIdentity(message);
	return Boolean(identity && run && (run.acceptedFinalMessageIdentities?.includes(identity) || readSessionProjectionFinalMessageIdentity(run.message) === identity));
}
function retainSessionProjectionRuns(runs) {
	const entries = Object.entries(runs);
	if (entries.length <= MAX_TRACKED_SESSION_RUNS) return runs;
	const active = entries.filter(([, run]) => run.status === "streaming");
	const terminal = entries.filter(([, run]) => run.status !== "streaming");
	const terminalLimit = Math.max(0, RETAINED_SESSION_RUNS - active.length);
	const retainedTerminal = terminalLimit > 0 ? terminal.slice(-terminalLimit) : [];
	return Object.fromEntries([...active, ...retainedTerminal]);
}
function updateRun(state, incoming) {
	const incomingErrorMessage = readNonemptyString(incoming.errorMessage);
	const normalizedIncoming = { ...incoming };
	if (incomingErrorMessage) normalizedIncoming.errorMessage = incomingErrorMessage;
	else delete normalizedIncoming.errorMessage;
	const current = state.runs[incoming.runId];
	if (current && current.status !== "streaming") {
		const incomingFinalIdentity = readSessionProjectionFinalMessageIdentity(incoming.message);
		const incomingIsFinal = incoming.status === "completed" || incoming.status === "yielded";
		const canRecoverFinal = !hasDisplayableSessionMessage(current.message) || (current.acceptedFinalMessageIdentities?.length ?? 0) > 0;
		const acceptFinal = incomingIsFinal && (current.status === incoming.status || canRecoverFinal) && incomingFinalIdentity !== null && !hasSessionProjectionAcceptedFinal(current, incoming.message);
		const recoverMessage = acceptFinal && !hasDisplayableSessionMessage(current.message);
		const recoverError = readNonemptyString(current.errorMessage) === null && incomingErrorMessage !== null;
		if (!acceptFinal && !recoverError) return state;
		const firstFinalIdentity = readSessionProjectionFinalMessageIdentity(current.message);
		const previousFinalIdentities = current.acceptedFinalMessageIdentities ?? (firstFinalIdentity ? [firstFinalIdentity] : []);
		return {
			...state,
			runs: {
				...state.runs,
				[incoming.runId]: {
					...current,
					...recoverMessage ? { message: incoming.message } : {},
					...acceptFinal && incomingFinalIdentity ? { acceptedFinalMessageIdentities: [...previousFinalIdentities, incomingFinalIdentity].slice(-32) } : {},
					...recoverError && incomingErrorMessage ? {
						errorMessage: incomingErrorMessage,
						...incoming.errorKind ? { errorKind: incoming.errorKind } : {}
					} : {}
				}
			}
		};
	}
	const previousRuns = current && current.status === "streaming" && incoming.status !== "streaming" ? Object.fromEntries(Object.entries(state.runs).filter(([runId]) => runId !== incoming.runId)) : state.runs;
	const acceptedFinalIdentity = incoming.status === "completed" || incoming.status === "yielded" ? readSessionProjectionFinalMessageIdentity(incoming.message) : null;
	return {
		...state,
		runs: retainSessionProjectionRuns({
			...previousRuns,
			[incoming.runId]: {
				...current,
				...normalizedIncoming,
				...acceptedFinalIdentity ? { acceptedFinalMessageIdentities: [acceptedFinalIdentity] } : {},
				...incoming.message === void 0 && current?.message !== void 0 ? { message: current.message } : {}
			}
		})
	};
}
/** Reduces durable events, snapshots, and transport lifecycle without client-specific policy. */
function reduceSessionProjection(state, event) {
	const scope = readEventScope(event);
	if (event.type === "snapshotLoaded") return scopesMatch(state.scope, scope) ? reconcileSessionProjectionSnapshot(state, event.messages, scope, event.options) : state;
	if (event.type === "sessionReset") {
		const { sessionKey, sessionId, agentId } = state.scope;
		return scopesMatch({
			sessionKey,
			sessionId,
			agentId
		}, scope) ? createSessionProjection({
			...state.scope,
			...scope
		}) : state;
	}
	if (!scopesMatch(state.scope, scope)) return state;
	switch (event.type) {
		case "messagePersisted": return projectLiveSessionMessage(state, event.message, event.envelope ?? event, scope);
		case "sendPending": {
			const pendingRunId = normalizeSessionProjectionRunId(event.idempotencyKey ?? event.runId);
			const incoming = createEntry(event.message, { pendingRunId });
			if (!pendingRunId || !incoming.identity) return state;
			const seed = state.entries.find((entry) => entry.message === event.message);
			if (seed && !seed.pending && incoming.identity.id === null && !incoming.identity.isImported && incoming.identity.runId === pendingRunId) return withEntries(state, state.entries.map((entry) => entry === seed ? {
				...seed,
				pending: true,
				pendingRunId
			} : entry));
			return seed || state.entries.some((entry) => entryMatches(entry, incoming)) ? state : withEntries(state, insertEntry(state.entries, incoming, state.runs));
		}
		case "sendAcknowledged": {
			const runId = normalizeSessionProjectionRunId(event.idempotencyKey ?? event.runId);
			const previousRunId = normalizeSessionProjectionRunId(event.previousRunId);
			if (!runId || !previousRunId || previousRunId === runId) return state;
			let changed = false;
			const entries = state.entries.flatMap((entry) => {
				if (!entry.pending || entry.pendingRunId !== previousRunId) return [entry];
				changed = true;
				const rekeyed = {
					...entry,
					pendingRunId: runId
				};
				return state.entries.some((candidate) => !candidate.pending && entryMatches(rekeyed, candidate)) ? [] : [rekeyed];
			});
			return changed ? withEntries(state, entries) : state;
		}
		case "sendFailed": {
			const runId = normalizeSessionProjectionRunId(event.runId);
			const entries = state.entries.filter((entry) => !entry.pending || entry.pendingRunId !== runId);
			return entries.length === state.entries.length ? state : withEntries(state, entries);
		}
		case "runDelta": return updateRun(state, {
			runId: event.runId,
			status: "streaming",
			...event.message === void 0 ? {} : { message: event.message }
		});
		case "runTerminal": return updateRun(state, {
			runId: event.runId,
			status: event.status,
			...event.message === void 0 ? {} : { message: event.message },
			...event.stopReason === void 0 ? {} : { stopReason: event.stopReason },
			...event.errorKind === void 0 ? {} : { errorKind: event.errorKind },
			...event.errorMessage === void 0 ? {} : { errorMessage: event.errorMessage }
		});
		case "transportGap": return state.hasTransportGap ? state : {
			...state,
			hasTransportGap: true
		};
		case "reconnected": return state;
		default: return state;
	}
}
/** Normalizes Gateway run envelopes once for every browser and terminal adapter. */
function reduceSessionProjectionRunEvent(projection, event, scope = {}) {
	return reduceSessionProjectionRunEventImpl(projection, event, scope);
}
//#endregion
//#region src/tui/commands.ts
const VERBOSE_LEVELS = [
	"on",
	"off",
	"full"
];
const TRACE_LEVELS = ["on", "off"];
const FAST_LEVELS = [
	"status",
	"auto",
	"on",
	"off"
];
const REASONING_LEVELS = [
	"on",
	"off",
	"stream"
];
const ELEVATED_LEVELS = [
	"on",
	"off",
	"ask",
	"full"
];
const ACTIVATION_LEVELS = ["mention", "always"];
const USAGE_FOOTER_LEVELS = [
	"off",
	"tokens",
	"full",
	"reset",
	"inherit",
	"clear",
	"default"
];
function createLevelCompletion(levels) {
	return (prefix) => levels.filter((value) => value.startsWith(normalizeLowercaseStringOrEmpty(prefix))).map((value) => ({
		value,
		label: value
	}));
}
/** Keep TUI help and no-argument usage aligned with actual directive completions. */
function formatTuiLevelCommandUsage(command) {
	return `/${command} <${(command === "verbose" ? VERBOSE_LEVELS : REASONING_LEVELS).join("|")}>`;
}
const TUI_COMMAND_DESCRIPTORS = [
	[
		"help",
		"Show slash command help",
		"/help"
	],
	[
		"commands",
		void 0,
		"/commands",
		void 0,
		{
			scope: "remote",
			shared: true,
			handler: false
		}
	],
	[
		"status",
		void 0,
		"/status",
		void 0,
		{
			scope: "remote",
			shared: true,
			handler: false
		}
	],
	[
		"gateway-status",
		"Show gateway status summary",
		["/gateway-status", "/gwstatus"],
		void 0,
		{ aliases: [{
			name: "gwstatus",
			description: "Alias for /gateway-status"
		}] }
	],
	[
		"auth",
		"Run provider auth/login flow",
		"/auth [provider]",
		void 0,
		{ scope: "local" }
	],
	[
		"agent",
		"Switch agent (or open picker)",
		"/agent <id> (or /agents)"
	],
	["agents", "Open agent picker"],
	[
		"openclaw",
		"Return to OpenClaw",
		"/openclaw [request]",
		void 0,
		{ aliases: [{
			name: "crestodian",
			hidden: true
		}] }
	],
	[
		"session",
		"Switch session (or open picker)",
		"/session <key> (or /sessions)"
	],
	["sessions", "Open session picker"],
	[
		"model",
		"Set model (or open picker)",
		"/model <provider/model> (or /models)"
	],
	["models", "Open model picker"],
	[
		"think",
		"Set thinking level",
		"/think <{thinkingLevels}>",
		"thinking"
	],
	[
		"fast",
		"Set fast mode auto/on/off",
		"/fast <status|auto|on|off>",
		FAST_LEVELS
	],
	[
		"verbose",
		`Set verbose ${VERBOSE_LEVELS.join("/")}`,
		formatTuiLevelCommandUsage("verbose"),
		VERBOSE_LEVELS
	],
	[
		"trace",
		"Set trace on/off",
		"/trace <on|off>",
		TRACE_LEVELS
	],
	[
		"reasoning",
		`Set reasoning ${REASONING_LEVELS.join("/")}`,
		formatTuiLevelCommandUsage("reasoning"),
		REASONING_LEVELS
	],
	[
		"usage",
		"Toggle per-response usage line",
		"/usage <off|tokens|full|reset|inherit|clear|default>",
		USAGE_FOOTER_LEVELS
	],
	[
		"elevated",
		"Set elevated on/off/ask/full",
		["/elevated <on|off|ask|full>", "/elev <on|off|ask|full>"],
		ELEVATED_LEVELS,
		{ aliases: [{
			name: "elev",
			description: "Alias for /elevated"
		}] }
	],
	[
		"activation",
		"Set group activation",
		"/activation <mention|always>",
		ACTIVATION_LEVELS
	],
	[
		"context",
		void 0,
		void 0,
		void 0,
		{
			scope: "remote",
			shared: true
		}
	],
	[
		"goal",
		void 0,
		"/goal <objective> | /goal [status] | /goal start <objective> | /goal edit <objective> | /goal pause|resume|complete|block|clear",
		void 0,
		{ shared: true }
	],
	[
		"btw",
		void 0,
		"/btw <side question>",
		void 0,
		{ shared: true }
	],
	[
		"queue",
		void 0,
		"/queue [mode]",
		void 0,
		{ shared: true }
	],
	[
		"stop",
		void 0,
		"/stop",
		void 0,
		{ shared: true }
	],
	[
		"new",
		"Spawn a new isolated session",
		"/new or /reset"
	],
	["reset", "Reset the current session"],
	[
		"abort",
		"Abort active run",
		"/abort"
	],
	[
		"settings",
		"Open settings",
		"/settings"
	],
	[
		"exit",
		"Exit the TUI",
		"/exit",
		void 0,
		{ aliases: [{
			name: "quit",
			description: "Exit the TUI"
		}] }
	]
].map(([name, description, help, completions, options]) => {
	const descriptor = {
		name,
		description,
		help,
		completions
	};
	descriptor.aliases = options?.aliases;
	descriptor.scope = options?.scope;
	descriptor.shared = options?.shared;
	if (options?.handler !== false) descriptor.handler = true;
	return descriptor;
});
function resolveTuiCommandDescriptor(name) {
	return TUI_COMMAND_DESCRIPTORS.find((command) => command.name === name || command.aliases?.some((alias) => alias.name === name));
}
function commandIsVisible(command, local) {
	return command.scope !== (local ? "remote" : "local");
}
function normalizeSlashCommandName(value) {
	return value.replace(/^\//, "").trim();
}
function appendSlashCommand(commands, seen, name, description, getArgumentCompletions) {
	const normalizedName = normalizeSlashCommandName(name);
	if (!normalizedName || seen.has(normalizedName)) return;
	seen.add(normalizedName);
	commands.push({
		name: normalizedName,
		description,
		getArgumentCompletions
	});
}
function parseCommand(input) {
	const sharedCommand = resolveTextCommand(input);
	if (sharedCommand) return {
		name: sharedCommand.command.key,
		args: sharedCommand.args ?? ""
	};
	const trimmed = input.replace(/^\//, "").trim();
	if (!trimmed) return {
		name: "",
		args: ""
	};
	const [name, ...rest] = trimmed.split(/\s+/);
	const normalized = normalizeLowercaseStringOrEmpty(name);
	return {
		name: resolveTuiCommandDescriptor(normalized)?.name ?? normalized,
		args: rest.join(" ").trim()
	};
}
/** Whether a slash input belongs to the shared Gateway command registry. */
function isSharedTextCommand(input) {
	return resolveTextCommand(input) !== null;
}
function getSlashCommands(options = {}) {
	const thinkLevels = options.thinkingLevels?.length ? options.thinkingLevels.map((level) => level.label) : listThinkingLevelLabels(options.provider, options.model, void 0, options.agentRuntime);
	const commands = [];
	const seen = /* @__PURE__ */ new Set();
	for (const command of TUI_COMMAND_DESCRIPTORS) {
		if (command.shared || !command.description || !commandIsVisible(command, options.local === true)) continue;
		const completions = command.completions === "thinking" ? createLevelCompletion(thinkLevels) : command.completions ? createLevelCompletion([...command.completions]) : void 0;
		appendSlashCommand(commands, seen, command.name, command.description, completions);
		for (const alias of command.aliases ?? []) if (!alias.hidden) appendSlashCommand(commands, seen, alias.name, alias.description ?? command.description, completions);
	}
	const gatewayCommands = options.cfg ? listChatCommandsForConfig(options.cfg) : listChatCommands();
	for (const command of gatewayCommands) {
		const descriptor = resolveTuiCommandDescriptor(command.key);
		if (options.local && !seen.has(command.key) && !descriptor?.shared) continue;
		if (options.local && descriptor && !commandIsVisible(descriptor, true)) continue;
		const aliases = command.textAliases.length > 0 ? command.textAliases : [`/${command.key}`];
		for (const alias of aliases) appendSlashCommand(commands, seen, alias, command.description);
	}
	for (const command of options.dynamicCommands ?? []) {
		const aliases = command.textAliases?.length ? command.textAliases : [command.name];
		for (const alias of aliases) appendSlashCommand(commands, seen, alias, command.description);
	}
	return commands;
}
function shouldSubmitExactArgumentCompletion(input, commands) {
	const match = /^\/([^\s]+)\s+(.+)$/u.exec(input);
	if (!match) return false;
	const [, commandName, argumentText] = match;
	if (argumentText === void 0) return false;
	const command = commands.find((candidate) => candidate.name === commandName);
	if (!command?.getArgumentCompletions) return false;
	const completions = command.getArgumentCompletions(argumentText);
	return Array.isArray(completions) && completions.length === 1 && completions[0]?.value === argumentText;
}
function helpText(options = {}) {
	const thinkLevels = formatThinkingLevels(options.provider, options.model, "|", void 0, options.agentRuntime);
	return [
		"Slash commands:",
		...TUI_COMMAND_DESCRIPTORS.flatMap((command) => {
			if (!command.help || !commandIsVisible(command, options.local === true)) return [];
			return (typeof command.help === "string" ? [command.help] : command.help).map((line) => line.replace("{thinkingLevels}", thinkLevels));
		}),
		"",
		"Keyboard shortcuts:",
		"Enter: send message",
		"Shift+Enter or Ctrl+J: insert a newline"
	].join("\n");
}
//#endregion
//#region src/tui/theme/theme.ts
const DARK_TEXT = "#E8E3D5";
const LIGHT_TEXT = "#1E1E1E";
const XTERM_LEVELS = [
	0,
	95,
	135,
	175,
	215,
	255
];
function channelToSrgb(value) {
	const normalized = value / 255;
	return normalized <= .03928 ? normalized / 12.92 : ((normalized + .055) / 1.055) ** 2.4;
}
function relativeLuminanceRgb(r, g, b) {
	const red = channelToSrgb(r);
	const green = channelToSrgb(g);
	const blue = channelToSrgb(b);
	return .2126 * red + .7152 * green + .0722 * blue;
}
function relativeLuminanceHex(hex) {
	return relativeLuminanceRgb(Number.parseInt(hex.slice(1, 3), 16), Number.parseInt(hex.slice(3, 5), 16), Number.parseInt(hex.slice(5, 7), 16));
}
function contrastRatio(background, foregroundHex) {
	const foreground = relativeLuminanceHex(foregroundHex);
	const lighter = Math.max(background, foreground);
	const darker = Math.min(background, foreground);
	return (lighter + .05) / (darker + .05);
}
function pickHigherContrastText(r, g, b) {
	const background = relativeLuminanceRgb(r, g, b);
	return contrastRatio(background, LIGHT_TEXT) >= contrastRatio(background, DARK_TEXT);
}
function isLightBackground() {
	const explicit = normalizeOptionalLowercaseString(process.env.OPENCLAW_THEME);
	if (explicit === "light") return true;
	if (explicit === "dark") return false;
	const colorfgbg = process.env.COLORFGBG;
	if (colorfgbg && colorfgbg.length <= 64) {
		const sep = colorfgbg.lastIndexOf(";");
		const bg = Number.parseInt(sep >= 0 ? colorfgbg.slice(sep + 1) : colorfgbg, 10);
		if (bg >= 0 && bg <= 255) {
			if (bg <= 15) return bg === 7 || bg === 15;
			if (bg >= 232) return bg >= 244;
			const cubeIndex = bg - 16;
			const bVal = expectDefined(XTERM_LEVELS[cubeIndex % 6], "xterm levels entry at cube index % 6");
			const gVal = expectDefined(XTERM_LEVELS[Math.floor(cubeIndex / 6) % 6], "xterm levels entry at math.floor(cube index / 6) % 6");
			return pickHigherContrastText(expectDefined(XTERM_LEVELS[Math.floor(cubeIndex / 36)], "xterm levels entry at math.floor(cube index / 36)"), gVal, bVal);
		}
	}
	return false;
}
const palette = isLightBackground() ? {
	text: "#1E1E1E",
	dim: "#5B6472",
	accent: "#B45309",
	accentSoft: "#C2410C",
	border: "#5B6472",
	userBg: "#F3F0E8",
	userText: "#1E1E1E",
	systemText: "#4B5563",
	toolPendingBg: "#EFF6FF",
	toolSuccessBg: "#ECFDF5",
	toolErrorBg: "#FEF2F2",
	toolTitle: "#B45309",
	toolOutput: "#374151",
	quote: "#1D4ED8",
	quoteBorder: "#2563EB",
	code: "#92400E",
	codeBorder: "#92400E",
	link: "#047857",
	error: "#DC2626",
	success: "#047857"
} : {
	text: "#E8E3D5",
	dim: "#7B7F87",
	accent: "#F6C453",
	accentSoft: "#F2A65A",
	border: "#3C414B",
	userBg: "#2B2F36",
	userText: "#F3EEE0",
	systemText: "#9BA3B2",
	toolPendingBg: "#1F2A2F",
	toolSuccessBg: "#1E2D23",
	toolErrorBg: "#2F1F1F",
	toolTitle: "#F6C453",
	toolOutput: "#E1DACB",
	quote: "#8CC8FF",
	quoteBorder: "#3B4D6B",
	code: "#F0C987",
	codeBorder: "#343A45",
	link: "#7DD3A5",
	error: "#F97066",
	success: "#7DD3A5"
};
const fg = (hex) => (text) => chalk.hex(hex)(text);
const bg = (hex) => (text) => chalk.bgHex(hex)(text);
/**
* Render code blocks with the theme code color without pulling a parser into the base TUI path.
* Returns an array of lines with ANSI escape codes.
*/
function highlightCode(code) {
	return code.split("\n").map((line) => fg(palette.code)(line));
}
const tuiTheme = {
	fg: fg(palette.text),
	assistantText: (text) => text,
	dim: fg(palette.dim),
	accent: fg(palette.accent),
	accentSoft: fg(palette.accentSoft),
	success: fg(palette.success),
	error: fg(palette.error),
	header: (text) => chalk.bold(fg(palette.accent)(text)),
	system: fg(palette.systemText),
	userBg: bg(palette.userBg),
	userText: fg(palette.userText),
	toolTitle: fg(palette.toolTitle),
	toolOutput: fg(palette.toolOutput),
	toolPendingBg: bg(palette.toolPendingBg),
	toolSuccessBg: bg(palette.toolSuccessBg),
	toolErrorBg: bg(palette.toolErrorBg),
	border: fg(palette.border),
	bold: (text) => chalk.bold(text),
	italic: (text) => chalk.italic(text)
};
const markdownTheme = {
	heading: (text) => chalk.bold(fg(palette.accent)(text)),
	link: (text) => fg(palette.link)(text),
	linkUrl: (text) => chalk.dim(text),
	code: (text) => fg(palette.code)(text),
	codeBlock: (text) => fg(palette.code)(text),
	codeBlockBorder: (text) => fg(palette.codeBorder)(text),
	quote: (text) => fg(palette.quote)(text),
	quoteBorder: (text) => fg(palette.quoteBorder)(text),
	hr: (text) => fg(palette.border)(text),
	listBullet: (text) => fg(palette.accentSoft)(text),
	bold: (text) => chalk.bold(text),
	italic: (text) => chalk.italic(text),
	strikethrough: (text) => chalk.strikethrough(text),
	underline: (text) => chalk.underline(text),
	highlightCode
};
const baseSelectListTheme = {
	selectedPrefix: (text) => fg(palette.accent)(text),
	selectedText: (text) => chalk.bold(fg(palette.accent)(text)),
	description: (text) => fg(palette.dim)(text),
	scrollInfo: (text) => fg(palette.dim)(text),
	noMatch: (text) => fg(palette.dim)(text)
};
const selectListTheme = baseSelectListTheme;
const filterableSelectListTheme = {
	...baseSelectListTheme,
	filterLabel: (text) => fg(palette.dim)(text)
};
const settingsListTheme = {
	label: (text, selected) => selected ? chalk.bold(fg(palette.accent)(text)) : fg(palette.text)(text),
	value: (text, selected) => selected ? fg(palette.accentSoft)(text) : fg(palette.dim)(text),
	description: (text) => fg(palette.systemText)(text),
	cursor: fg(palette.accent)("→ "),
	hint: (text) => fg(palette.dim)(text)
};
const editorTheme = {
	borderColor: (text) => fg(palette.border)(text),
	selectList: selectListTheme
};
const searchableSelectListTheme = {
	...baseSelectListTheme,
	searchPrompt: (text) => fg(palette.accentSoft)(text),
	searchInput: (text) => fg(palette.text)(text),
	matchHighlight: (text) => chalk.bold(fg(palette.accent)(text))
};
//#endregion
//#region src/tui/osc8-hyperlinks.ts
const SGR_PATTERN = "\\x1b\\[[0-9;]*m";
const OSC8_PATTERN = "\\x1b\\]8;;.*?(?:\\x07|\\x1b\\\\)";
const ANSI_RE = new RegExp(`${SGR_PATTERN}|${OSC8_PATTERN}`, "g");
const SGR_START_RE = new RegExp(`^${SGR_PATTERN}`);
const OSC8_START_RE = new RegExp(`^${OSC8_PATTERN}`);
/** Allow one level of balanced parentheses inside a URL so markdown link
*  targets like `https://en.wikipedia.org/wiki/URL_(disambiguation)` are
*  fully captured instead of truncated at the first `)`. */
const URL_PATH_WITH_PARENS = /https?:\/\/[^()\s<>\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]+(?:\([^()\s<>\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]*\)[^()\s<>\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]*)*/g;
/** Strip the suffix starting at a `)` without a matching `(` in the URL.
*  Bare URLs in prose can pick up a trailing `)` that belongs to surrounding
*  punctuation, e.g. `(see https://example.com/path)` — the `)` after `path`
*  and anything after it are sentence punctuation, not part of the URL. */
function trimUnbalancedTrailingParens(url) {
	let open = 0;
	for (let index = 0; index < url.length; index++) {
		const ch = url[index];
		if (ch === "(") open++;
		else if (ch === ")") {
			if (open === 0) return url.slice(0, index);
			open--;
		}
	}
	return url;
}
function hasUrlContent(url) {
	const authority = expectDefined(url.slice(url.indexOf("://") + 3).split(/[/?#]/, 1)[0], "url.slice(url.index of(\"://\") + 3).split(/[/?#]/, 1) entry at 0");
	return /[\p{L}\p{N}]/u.test(authority) || /^\[[0-9a-f:.]+\](?::\d+)?$/i.test(authority);
}
/**
* Extract all unique URLs from raw markdown text.
* Finds both bare URLs and markdown link hrefs [text](url).
*/
function extractUrls(markdown) {
	const urls = /* @__PURE__ */ new Set();
	const mdLinkRe = new RegExp(`\\[(?:[^\\]]*)\\]\\(\\s*<?(${URL_PATH_WITH_PARENS.source})>?(?:\\s+["'][^"']*["'])?\\s*\\)`, "g");
	let m;
	while ((m = mdLinkRe.exec(markdown)) !== null) if (hasUrlContent(expectDefined(m[1], "m capture group 1"))) urls.add(expectDefined(m[1], "m capture group 1"));
	const stripped = markdown.replace(mdLinkRe, "");
	const bareRe = /https?:\/\/(?:\[[0-9a-f:.]+\](?::\d+)?[^\s\]>\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]*|[^\s[\]>\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]+)/gi;
	while ((m = bareRe.exec(stripped)) !== null) {
		const url = trimUnbalancedTrailingParens(m[0]);
		if (hasUrlContent(url)) urls.add(url);
	}
	return [...urls];
}
/** Strip ANSI SGR and OSC 8 sequences to get visible text. */
function stripAnsi(input) {
	return input.replace(ANSI_RE, "");
}
/**
* Find URL ranges in a line's visible text, handling cross-line URL splits.
*/
function findUrlRanges(visibleText, knownUrls, pending, nextVisibleText) {
	const ranges = [];
	let newPending = null;
	let searchFrom = 0;
	if (pending) {
		const remaining = pending.url.slice(pending.consumed);
		const trimmed = visibleText.trimStart();
		const leadingSpaces = visibleText.length - trimmed.length;
		let matchLen = 0;
		for (let j = 0; j < remaining.length && j < trimmed.length; j++) if (remaining[j] === trimmed[j]) matchLen++;
		else break;
		if (matchLen > 0) {
			ranges.push({
				start: leadingSpaces,
				end: leadingSpaces + matchLen,
				url: pending.url
			});
			searchFrom = leadingSpaces + matchLen;
			if (pending.consumed + matchLen < pending.url.length) newPending = {
				url: pending.url,
				consumed: pending.consumed + matchLen
			};
		}
	}
	const urlRe = /https?:\/\/(?:\[[0-9a-f:.]+\](?::\d+)?[^\s\]>\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]*|[^\s[\]>\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]*)/gi;
	urlRe.lastIndex = searchFrom;
	let match;
	while ((match = urlRe.exec(visibleText)) !== null) {
		const fragment = trimUnbalancedTrailingParens(match[0]);
		const start = match.index;
		let resolvedUrl = fragment;
		let found = false;
		if (!hasUrlContent(fragment)) {
			if (!(fragment === match[0] && visibleText.slice(start + match[0].length).trim().length === 0)) continue;
			const nextFragment = trimUnbalancedTrailingParens(nextVisibleText?.trimStart().match(/^[^\s\]>\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]+/)?.[0] ?? "");
			for (const known of knownUrls) {
				if (!known.startsWith(fragment)) continue;
				const remaining = known.slice(fragment.length);
				if (nextFragment.length > 0 && remaining.startsWith(nextFragment) && known.length > resolvedUrl.length) {
					resolvedUrl = known;
					found = true;
				}
			}
			if (!found) continue;
		}
		if (!found) {
			for (const known of knownUrls) if (known === fragment) {
				resolvedUrl = known;
				found = true;
				break;
			}
		}
		if (!found) {
			let bestLen = 0;
			for (const known of knownUrls) if (known.startsWith(fragment) && known.length > bestLen) {
				resolvedUrl = known;
				bestLen = known.length;
				found = true;
			}
		}
		if (!found) {
			let bestLen = 0;
			for (const known of knownUrls) if (fragment.startsWith(known) && known.length > bestLen) {
				resolvedUrl = known;
				bestLen = known.length;
			}
		}
		ranges.push({
			start,
			end: start + fragment.length,
			url: resolvedUrl
		});
		if (resolvedUrl.length > fragment.length && resolvedUrl.startsWith(fragment)) newPending = {
			url: resolvedUrl,
			consumed: fragment.length
		};
	}
	return {
		ranges,
		pending: newPending
	};
}
/**
* Apply OSC 8 hyperlink sequences to a line based on visible-text URL ranges.
* Walks through the raw string character by character, inserting OSC 8
* open/close sequences at URL range boundaries while preserving ANSI codes.
*/
function applyOsc8Ranges(line, ranges) {
	if (ranges.length === 0) return line;
	const urlAt = /* @__PURE__ */ new Map();
	for (const r of ranges) for (let p = r.start; p < r.end; p++) urlAt.set(p, r.url);
	let result = "";
	let visiblePos = 0;
	let activeUrl = null;
	let i = 0;
	while (i < line.length) {
		if (line.charCodeAt(i) === 27) {
			const sgr = line.slice(i).match(SGR_START_RE);
			if (sgr) {
				result += sgr[0];
				i += sgr[0].length;
				continue;
			}
			const osc = line.slice(i).match(OSC8_START_RE);
			if (osc) {
				result += osc[0].replace(/[\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, "");
				i += osc[0].length;
				continue;
			}
		}
		const targetUrl = urlAt.get(visiblePos) ?? null;
		if (targetUrl !== activeUrl) {
			if (activeUrl !== null) result += "\x1B]8;;\x07";
			if (targetUrl !== null) result += `\x1b]8;;${targetUrl}\x07`;
			activeUrl = targetUrl;
		}
		result += line[i];
		visiblePos++;
		i++;
	}
	if (activeUrl !== null) result += "\x1B]8;;\x07";
	return result;
}
/**
* Add OSC 8 hyperlinks to rendered lines using a pre-extracted URL list.
*
* For each line, finds URL-like substrings in the visible text, matches them
* against known URLs, and wraps each fragment with OSC 8 escape sequences.
* Handles URLs broken across multiple lines by pi-tui's word wrapping.
*/
function addOsc8Hyperlinks(lines, urls) {
	if (urls.length === 0) return lines;
	let pending = null;
	const visibleLines = lines.map(stripAnsi);
	return lines.map((line, index) => {
		const result = findUrlRanges(expectDefined(visibleLines[index], "visible lines entry at index"), urls, pending, visibleLines[index + 1]);
		pending = result.pending;
		return applyOsc8Ranges(line, result.ranges);
	});
}
//#endregion
//#region src/tui/components/hyperlink-markdown.ts
function sanitizeMarkdownDisplayText(text) {
	if (!text) return text;
	return sanitizeMarkdownSource(text) || "(no output)";
}
/**
* Wrapper around pi-tui's Markdown component that adds OSC 8 terminal
* hyperlinks to rendered output, making URLs clickable even when broken
* across multiple lines by word wrapping.
*/
var HyperlinkMarkdown = class {
	constructor(text, paddingX, paddingY, theme, defaultTextStyle, options) {
		const displayText = sanitizeMarkdownDisplayText(text);
		this.inner = new Markdown(displayText, paddingX, paddingY, theme, defaultTextStyle, options);
		this.urls = extractUrls(displayText);
	}
	render(width) {
		return addOsc8Hyperlinks(this.inner.render(width), this.urls).map(isolateRtlRenderedLine);
	}
	setText(text) {
		const displayText = sanitizeMarkdownDisplayText(text);
		this.inner.setText(displayText);
		this.urls = extractUrls(displayText);
	}
	invalidate() {
		this.inner.invalidate();
	}
};
//#endregion
//#region src/tui/components/assistant-message.ts
var AssistantMessageComponent = class extends Container {
	constructor(text) {
		super();
		this.body = new HyperlinkMarkdown(text, 0, 0, markdownTheme, { color: (line) => tuiTheme.assistantText(line) });
		this.addChild(new Spacer(1));
		this.addChild(this.body);
	}
	setText(text) {
		this.body.setText(text);
	}
};
//#endregion
//#region src/tui/components/btw-inline-message.ts
/** Renders a dismissible BTW result, with error text or assistant markdown content. */
var BtwInlineMessage = class extends Container {
	constructor(params) {
		super();
		this.setResult(params);
	}
	/** Replaces the current BTW content without reallocating the host component. */
	setResult(params) {
		const question = sanitizeRenderableLine(params.question);
		let text = params.text;
		if (params.isError) {
			text = sanitizeRenderableText(text);
			if (!text.trim()) text = "(no output)";
		}
		this.clear();
		this.addChild(new Spacer(1));
		this.addChild(new Text(tuiTheme.header(`BTW: ${question}`), 1, 0));
		if (params.isError) this.addChild(new Text(tuiTheme.error(text), 1, 0));
		else this.addChild(new AssistantMessageComponent(text));
		this.addChild(new Text(tuiTheme.dim("Press Enter or Esc to dismiss"), 1, 0));
	}
};
//#endregion
//#region src/tui/components/tool-execution.ts
const PREVIEW_LINES = 12;
const MAX_PREVIEW_CHARS = PREVIEW_LINES * 256;
var ToolOutputComponent = class extends HyperlinkMarkdown {
	constructor(..._args) {
		super(..._args);
		this.sourceText = "";
		this.expanded = false;
	}
	setText(text) {
		const sourceText = sanitizeMarkdownSource(text);
		if (this.sourceText === sourceText) return;
		this.sourceText = sourceText;
		this.renderedSource = void 0;
		super.invalidate();
	}
	setExpanded(expanded) {
		if (this.expanded === expanded) return;
		this.expanded = expanded;
		this.renderedSource = void 0;
		super.invalidate();
	}
	render(width) {
		const safeWidth = Math.max(0, Math.floor(width));
		const previewBudget = Math.min(MAX_PREVIEW_CHARS, PREVIEW_LINES * Math.max(1, safeWidth));
		const text = this.expanded ? this.sourceText : truncateUtf16Safe(this.sourceText, previewBudget);
		if (this.renderedSource !== text) {
			super.setText(text);
			this.renderedSource = text;
		}
		const lines = super.render(safeWidth);
		if (this.expanded || text.length === this.sourceText.length && lines.length <= PREVIEW_LINES) return lines;
		return [...lines.slice(0, PREVIEW_LINES - 1), truncateToWidth("…", safeWidth, "")];
	}
};
function formatArgs(toolName, args) {
	const detail = formatToolDetail(resolveToolDisplay({
		name: toolName,
		args
	}));
	if (detail) return sanitizeRenderableText(detail);
	if (!args || typeof args !== "object") return "";
	try {
		return sanitizeRenderableText(JSON.stringify(args));
	} catch {
		return "";
	}
}
function extractText(result) {
	if (!result?.content) return "";
	const lines = [];
	for (const entry of result.content) if (entry.type === "text" && entry.text) lines.push(entry.text);
	else if (entry.type === "image") {
		const mime = entry.mimeType ?? "image";
		const size = entry.bytes ? ` ${Math.round(entry.bytes / 1024)}kb` : "";
		const omitted = entry.omitted ? " (omitted)" : "";
		lines.push(`[${mime}${size}${omitted}]`);
	}
	return lines.join("\n").trim();
}
/** Displays a running or completed tool call with optional expandable output. */
var ToolExecutionComponent = class extends Container {
	constructor(toolName, args) {
		super();
		this.expanded = false;
		this.isError = false;
		this.isPartial = true;
		this.toolName = toolName;
		this.args = args;
		this.box = new Box(1, 1, (line) => tuiTheme.toolPendingBg(line));
		this.header = new Text("", 0, 0);
		this.argsLine = new Text("", 0, 0);
		this.output = new ToolOutputComponent("", 0, 0, markdownTheme, { color: (line) => tuiTheme.toolOutput(line) });
		this.addChild(new Spacer(1));
		this.addChild(this.box);
		this.box.addChild(this.header);
		this.box.addChild(this.argsLine);
		this.box.addChild(this.output);
		this.refresh();
	}
	/** Re-renders tool arguments when streaming tool call input changes. */
	setArgs(args) {
		this.args = args;
		this.refresh();
	}
	/** Toggles preview/full output rendering for long tool results. */
	setExpanded(expanded) {
		this.expanded = expanded;
		this.refresh();
	}
	/** Marks the tool call complete and renders final output. */
	setResult(result, opts) {
		this.result = result;
		this.isPartial = false;
		this.isError = Boolean(opts?.isError);
		this.refresh();
	}
	/** Renders partial output while the tool call is still running. */
	setPartialResult(result) {
		this.result = result;
		this.isPartial = true;
		this.refresh();
	}
	refresh() {
		const bg = this.isPartial ? tuiTheme.toolPendingBg : this.isError ? tuiTheme.toolErrorBg : tuiTheme.toolSuccessBg;
		this.box.setBgFn((line) => bg(line));
		const display = resolveToolDisplay({
			name: this.toolName,
			args: this.args
		});
		const title = sanitizeRenderableLine(`${display.emoji} ${display.label}${this.isPartial ? " (running)" : ""}`);
		this.header.setText(tuiTheme.toolTitle(tuiTheme.bold(title)));
		const argLine = formatArgs(this.toolName, this.args);
		this.argsLine.setText(argLine ? tuiTheme.dim(argLine) : tuiTheme.dim(" "));
		const text = extractText(this.result) || (this.isPartial ? "…" : "");
		this.output.setExpanded(this.expanded);
		this.output.setText(text);
	}
};
//#endregion
//#region src/tui/components/markdown-message.ts
/** Container-backed markdown message that can update text in place. */
var MarkdownMessageComponent = class extends Container {
	constructor(text, y, defaultTextStyle, options) {
		super();
		this.body = new HyperlinkMarkdown(text, 0, y, markdownTheme, defaultTextStyle, options);
		this.addChild(new Spacer(1));
		this.addChild(this.body);
	}
	/** Updates the rendered markdown without replacing the component. */
	setText(text) {
		this.body.setText(text);
	}
};
//#endregion
//#region src/tui/components/user-message.ts
/** Markdown chat-log row styled as user input. */
var UserMessageComponent = class extends MarkdownMessageComponent {
	constructor(text) {
		super(text, 1, {
			bgColor: (line) => tuiTheme.userBg(line),
			color: (line) => tuiTheme.userText(line)
		}, {
			preserveOrderedListMarkers: true,
			preserveBackslashEscapes: true
		});
	}
};
//#endregion
//#region src/tui/components/chat-log.ts
/** Scrollback container that tracks pending users, streaming assistant runs, tools, and notices. */
var ChatLog = class extends Container {
	constructor(maxComponents = 180) {
		super();
		this.tools = /* @__PURE__ */ new Map();
		this.assistantRuns = /* @__PURE__ */ new Map();
		this.userComponents = /* @__PURE__ */ new Map();
		this.pendingUsers = /* @__PURE__ */ new Map();
		this.pendingSystemNotices = /* @__PURE__ */ new Map();
		this.btwMessage = null;
		this.toolsExpanded = false;
		this.repeatableSystemMessage = null;
		this.maxComponents = Math.max(20, Math.floor(maxComponents));
	}
	dropComponentReferences(component) {
		for (const [toolId, tool] of this.tools.entries()) if (tool.component === component) this.tools.delete(toolId);
		if (component instanceof AssistantMessageComponent) for (const [runId, run] of this.assistantRuns.entries()) {
			if (run.streaming === component) run.streaming = void 0;
			run.frozen.delete(component);
			run.finalized.delete(component);
			this.releaseAssistantRunIfEmpty(runId, run);
		}
		for (const [runId, entry] of this.pendingUsers.entries()) if (entry.component === component) this.pendingUsers.delete(runId);
		for (const [messageId, user] of this.userComponents.entries()) if (user === component) this.userComponents.delete(messageId);
		for (const [runId, entry] of this.pendingSystemNotices.entries()) if (entry === component) this.pendingSystemNotices.delete(runId);
		if (this.btwMessage === component) this.btwMessage = null;
		if (this.repeatableSystemMessage?.component === component) this.repeatableSystemMessage = null;
	}
	pruneOverflow(protectedComponents) {
		while (this.children.length > this.maxComponents) {
			const oldest = protectedComponents ? this.children.find((component) => !protectedComponents.has(component)) ?? this.children.find((component) => component instanceof ToolExecutionComponent) : this.children[0];
			if (!oldest) return;
			this.removeChild(oldest);
			this.dropComponentReferences(oldest);
		}
	}
	reserveLiveUserSlot(protectedComponents, firstRunComponent, runId) {
		if (protectedComponents.size <= this.maxComponents) return;
		const streaming = runId ? this.assistantRuns.get(runId)?.streaming : void 0;
		const completedTools = /* @__PURE__ */ new Set();
		for (const tool of this.tools.values()) if (!tool.active) completedTools.add(tool.component);
		const evictable = this.children.find((entry) => entry !== firstRunComponent && entry !== streaming && entry instanceof AssistantMessageComponent && protectedComponents.has(entry)) ?? this.children.find((entry) => entry !== firstRunComponent && entry instanceof ToolExecutionComponent && completedTools.has(entry) && protectedComponents.has(entry)) ?? (streaming && firstRunComponent instanceof AssistantMessageComponent && firstRunComponent !== streaming ? firstRunComponent : void 0) ?? (firstRunComponent instanceof ToolExecutionComponent && completedTools.has(firstRunComponent) ? firstRunComponent : void 0) ?? this.children.find((entry) => entry !== firstRunComponent && entry instanceof ToolExecutionComponent && protectedComponents.has(entry));
		if (evictable) protectedComponents.delete(evictable);
	}
	append(component) {
		this.addChild(component);
		this.pruneOverflow();
	}
	appendNonSystem(component) {
		this.repeatableSystemMessage = null;
		this.append(component);
	}
	clearAll() {
		this.clear();
		this.tools.clear();
		this.assistantRuns.clear();
		this.userComponents.clear();
		this.pendingUsers.clear();
		this.pendingSystemNotices.clear();
		this.btwMessage = null;
		this.repeatableSystemMessage = null;
	}
	clearTools() {
		for (const tool of this.tools.values()) this.removeChild(tool.component);
		this.tools.clear();
	}
	clearPendingUsers() {
		for (const entry of this.pendingUsers.values()) this.removeChild(entry.component);
		this.pendingUsers.clear();
	}
	formatSystemText(text, count = 1) {
		const visible = sanitizeRenderableText(text).trim() || (text ? "(no output)" : "");
		return tuiTheme.system(count > 1 ? `${visible} x${count}` : visible);
	}
	createSystemMessage(text) {
		const entry = new Container();
		const textNode = new Text(this.formatSystemText(text), 1, 0);
		entry.addChild(new Spacer(1));
		entry.addChild(textNode);
		return {
			component: entry,
			textNode,
			baseText: text,
			count: 1
		};
	}
	addSystem(text, opts) {
		if (opts?.coalesceConsecutive && this.repeatableSystemMessage?.baseText === text && this.children[this.children.length - 1] === this.repeatableSystemMessage.component) {
			this.repeatableSystemMessage.count += 1;
			this.repeatableSystemMessage.textNode.setText(this.formatSystemText(text, this.repeatableSystemMessage.count));
			return;
		}
		const message = this.createSystemMessage(text);
		this.append(message.component);
		this.repeatableSystemMessage = opts?.coalesceConsecutive ? message : null;
	}
	addPendingSystem(runId, text) {
		const existing = this.pendingSystemNotices.get(runId);
		if (existing) this.removeChild(existing);
		const message = this.createSystemMessage(text);
		this.pendingSystemNotices.set(runId, message.component);
		this.append(message.component);
	}
	dismissPendingSystem(runId) {
		const existing = this.pendingSystemNotices.get(runId);
		if (!existing) return false;
		this.removeChild(existing);
		this.pendingSystemNotices.delete(runId);
		return true;
	}
	addUser(text, options) {
		const previous = options?.messageId ? this.userComponents.get(options.messageId) : void 0;
		if (previous) {
			previous.setText(text);
			return previous;
		}
		const component = new UserMessageComponent(text);
		if (options?.messageId) this.userComponents.set(options.messageId, component);
		this.appendNonSystem(component);
		return component;
	}
	addLiveUser(text, options) {
		const existing = this.userComponents.get(options.messageId);
		if (existing) {
			existing.setText(text);
			return existing;
		}
		const pending = options.runId ? this.pendingUsers.get(options.runId) : void 0;
		if (pending && options.runId && pending.text === text) {
			pending.component.setText(text);
			this.pendingUsers.delete(options.runId);
			this.userComponents.set(options.messageId, pending.component);
			return pending.component;
		}
		const component = new UserMessageComponent(text);
		this.userComponents.set(options.messageId, component);
		const protectedComponents = /* @__PURE__ */ new Set([component]);
		if (options.runId) {
			const run = this.assistantRuns.get(options.runId);
			for (const segment of run?.frozen ?? []) protectedComponents.add(segment);
			const streaming = run?.streaming;
			if (streaming) protectedComponents.add(streaming);
			for (const segment of run?.finalized ?? []) protectedComponents.add(segment);
			for (const tool of this.tools.values()) if (tool.runId === options.runId) protectedComponents.add(tool.component);
		}
		const firstRunComponentIndex = this.children.findIndex((entry) => protectedComponents.has(entry));
		if (firstRunComponentIndex >= 0) {
			const firstRunComponent = this.children[firstRunComponentIndex];
			this.repeatableSystemMessage = null;
			this.children.splice(firstRunComponentIndex, 0, component);
			this.reserveLiveUserSlot(protectedComponents, firstRunComponent, options.runId);
			this.pruneOverflow(protectedComponents);
			return component;
		}
		this.appendNonSystem(component);
		return component;
	}
	addPendingUser(runId, text) {
		const existing = this.pendingUsers.get(runId);
		if (existing) {
			existing.text = text;
			existing.component.setText(text);
			return existing.component;
		}
		const component = new UserMessageComponent(text);
		this.pendingUsers.set(runId, {
			component,
			text
		});
		this.appendNonSystem(component);
		return component;
	}
	dropPendingUser(runId) {
		const existing = this.pendingUsers.get(runId);
		if (!existing) return false;
		this.removeChild(existing.component);
		this.pendingUsers.delete(runId);
		return true;
	}
	rekeyPendingUser(fromRunId, toRunId) {
		if (fromRunId === toRunId) return false;
		const existing = this.pendingUsers.get(fromRunId);
		if (!existing) return false;
		this.pendingUsers.delete(fromRunId);
		this.pendingUsers.set(toRunId, existing);
		return true;
	}
	countPendingUsers() {
		return this.pendingUsers.size;
	}
	resolveRunId(runId) {
		return runId ?? "default";
	}
	getAssistantRun(runId) {
		let run = this.assistantRuns.get(runId);
		if (!run) {
			run = {
				frozen: /* @__PURE__ */ new Set(),
				finalized: /* @__PURE__ */ new Set()
			};
			this.assistantRuns.set(runId, run);
		}
		return run;
	}
	releaseAssistantRunIfEmpty(runId, run) {
		if (!run.streaming && run.frozen.size === 0 && run.finalized.size === 0 && run.committedText === void 0 && run.latestText === void 0) this.assistantRuns.delete(runId);
	}
	resolveSingleStreamingRunId() {
		let streamingRunId;
		for (const [runId, run] of this.assistantRuns) {
			if (!run.streaming) continue;
			if (streamingRunId !== void 0) return;
			streamingRunId = runId;
		}
		return streamingRunId;
	}
	resolveAssistantSegment(runId, text) {
		const run = this.assistantRuns.get(runId);
		const committed = run?.committedText;
		if (!run || !committed) return text;
		if (text.startsWith(committed)) return text.slice(committed.length).replace(/^(?:\r?\n)+/u, "");
		if (!run.frozen.size) return text;
		for (const component of run.frozen) this.removeChild(component);
		run.frozen.clear();
		if (run.streaming) {
			this.removeChild(run.streaming);
			run.streaming = void 0;
		}
		run.committedText = void 0;
		return text;
	}
	freezeStreamingAssistants() {
		for (const run of this.assistantRuns.values()) {
			if (!run.streaming) continue;
			run.frozen.add(run.streaming);
			run.committedText = run.latestText ?? "";
			run.streaming = void 0;
		}
	}
	startAssistant(text, runId) {
		const effectiveRunId = this.resolveRunId(runId);
		const run = this.getAssistantRun(effectiveRunId);
		run.finalized.clear();
		run.latestText = text;
		const segmentText = this.resolveAssistantSegment(effectiveRunId, text);
		const existing = run.streaming;
		if (existing) {
			existing.setText(segmentText);
			return existing;
		}
		const component = new AssistantMessageComponent(segmentText);
		run.streaming = component;
		this.appendNonSystem(component);
		return component;
	}
	reserveAssistantSlot(runId) {
		const effectiveRunId = this.resolveRunId(runId);
		const existing = this.assistantRuns.get(effectiveRunId)?.streaming;
		if (existing) return existing;
		return this.startAssistant("", runId);
	}
	updateAssistant(text, runId) {
		const effectiveRunId = this.resolveRunId(runId);
		const run = this.getAssistantRun(effectiveRunId);
		run.latestText = text;
		const segmentText = this.resolveAssistantSegment(effectiveRunId, text);
		const existing = run.streaming;
		if (!existing) {
			if (!segmentText && run.committedText !== void 0) return;
			this.startAssistant(text, runId);
			return;
		}
		existing.setText(segmentText);
	}
	finalizeAssistant(text, runId) {
		const effectiveRunId = this.resolveRunId(runId);
		const run = this.getAssistantRun(effectiveRunId);
		const segmentText = this.resolveAssistantSegment(effectiveRunId, text);
		const existing = run.streaming;
		const finalized = new Set(run.frozen);
		let lastAssistant;
		run.frozen.clear();
		run.committedText = void 0;
		run.latestText = void 0;
		if (existing) {
			if (segmentText) {
				existing.setText(segmentText);
				lastAssistant = existing;
			} else this.removeChild(existing);
			run.streaming = void 0;
		} else if (segmentText) {
			const component = new AssistantMessageComponent(segmentText);
			this.appendNonSystem(component);
			lastAssistant = component;
		}
		if (lastAssistant) finalized.add(lastAssistant);
		for (const segment of finalized) if (!this.children.includes(segment)) finalized.delete(segment);
		if (finalized.size > 0) {
			run.finalized = finalized;
			this.assistantRuns.set(effectiveRunId, run);
		}
		this.releaseAssistantRunIfEmpty(effectiveRunId, run);
	}
	dropAssistant(runId) {
		const effectiveRunId = this.resolveRunId(runId);
		const run = this.assistantRuns.get(effectiveRunId);
		if (!run) return;
		for (const component of run.frozen) this.removeChild(component);
		if (run.streaming) this.removeChild(run.streaming);
		this.assistantRuns.delete(effectiveRunId);
	}
	showBtw(params) {
		if (this.btwMessage) {
			this.btwMessage.setResult(params);
			if (this.children[this.children.length - 1] !== this.btwMessage) {
				this.removeChild(this.btwMessage);
				this.appendNonSystem(this.btwMessage);
			}
			return this.btwMessage;
		}
		const component = new BtwInlineMessage(params);
		this.btwMessage = component;
		this.appendNonSystem(component);
		return component;
	}
	dismissBtw() {
		if (!this.btwMessage) return;
		this.removeChild(this.btwMessage);
		this.btwMessage = null;
	}
	hasVisibleBtw() {
		return this.btwMessage !== null;
	}
	startTool(toolCallId, toolName, args, runId) {
		const existing = this.tools.get(toolCallId);
		if (existing) {
			existing.component.setArgs(args);
			return existing.component;
		}
		const owningRunId = runId ?? this.resolveSingleStreamingRunId();
		this.freezeStreamingAssistants();
		const component = new ToolExecutionComponent(toolName, args);
		component.setExpanded(this.toolsExpanded);
		this.tools.set(toolCallId, {
			component,
			runId: owningRunId,
			active: true
		});
		this.appendNonSystem(component);
		return component;
	}
	updateToolResult(toolCallId, result, opts) {
		const existing = this.tools.get(toolCallId);
		if (!existing) return;
		if (opts?.partial) {
			existing.active = true;
			existing.component.setPartialResult(result);
			return;
		}
		existing.active = false;
		existing.component.setResult(result, { isError: opts?.isError });
	}
	setToolsExpanded(expanded) {
		this.toolsExpanded = expanded;
		for (const tool of this.tools.values()) tool.component.setExpanded(expanded);
	}
};
//#endregion
//#region src/tui/tui-submit.ts
function isExecutableBangLine(text) {
	return !text.includes("\n") && text.startsWith("!") && text !== "!";
}
function trimWouldCreateExecutableBangLine(text) {
	return !isExecutableBangLine(text) && isExecutableBangLine(text.trim());
}
function runSubmitAction(action, run, onError) {
	try {
		Promise.resolve(run()).catch((error) => {
			onError(action, error);
		});
	} catch (error) {
		onError(action, error);
	}
}
function createEditorSubmitHandler(params) {
	const clearSubmittedEditor = () => {
		if (!params.editor.getText?.()) params.editor.setText("");
	};
	const restoreBlockedEditor = (value) => {
		const newerDraft = params.editor.getText?.() ?? "";
		params.editor.setText(newerDraft ? `${value}\n${newerDraft}` : value);
	};
	return (text, snapshot) => {
		const raw = text;
		const value = raw.trim();
		const multiline = raw.includes("\n");
		const trimCreatesExecutableBangLine = trimWouldCreateExecutableBangLine(raw);
		if (!value) {
			clearSubmittedEditor();
			return;
		}
		if (isExecutableBangLine(raw)) {
			clearSubmittedEditor();
			params.editor.addToHistory(raw);
			runSubmitAction("local shell", () => params.handleBangLine(raw), params.onSubmitError);
			return;
		}
		if (!multiline && value.startsWith("/")) {
			clearSubmittedEditor();
			params.editor.addToHistory(value);
			runSubmitAction("command", () => params.handleCommand(value), params.onSubmitError);
			return;
		}
		const admission = (snapshot ? params.admitMessage?.(value, snapshot) : params.admitMessage?.(value)) ?? { status: "allowed" };
		if (admission.status === "blocked") {
			restoreBlockedEditor(trimCreatesExecutableBangLine ? raw : value);
			params.onBlockedMessageSubmit?.(value, admission);
			return;
		}
		clearSubmittedEditor();
		if (!trimCreatesExecutableBangLine) params.editor.addToHistory(value);
		runSubmitAction("message", () => params.sendMessage(value), params.onSubmitError);
	};
}
function shouldEnableWindowsGitBashPasteFallback(params) {
	const platform = params?.platform ?? process.platform;
	const env = params?.env ?? process.env;
	const termProgram = normalizeLowercaseStringOrEmpty(env.TERM_PROGRAM);
	if (platform === "darwin") {
		if (termProgram.includes("iterm") || termProgram.includes("apple_terminal")) return true;
		return false;
	}
	if (platform !== "win32") return false;
	const msystem = (env.MSYSTEM ?? "").toUpperCase();
	const shell = env.SHELL ?? "";
	if (msystem.startsWith("MINGW") || msystem.startsWith("MSYS")) return true;
	if (normalizeLowercaseStringOrEmpty(shell).includes("bash")) return true;
	return termProgram.includes("mintty");
}
function createSubmitBurstCoalescer(params) {
	const windowMs = Math.max(1, params.burstWindowMs ?? 50);
	const now = params.now ?? (() => Date.now());
	const setTimer = params.setTimer ?? setTimeout;
	const clearTimer = params.clearTimer ?? clearTimeout;
	let pending = null;
	let pendingAt = 0;
	let flushTimer = null;
	let disposed = false;
	const clearFlushTimer = () => {
		if (!flushTimer) return;
		clearTimer(flushTimer);
		flushTimer = null;
	};
	const submit = (value, snapshot) => {
		if (snapshot) params.submit(value, snapshot);
		else params.submit(value);
	};
	const flushPending = () => {
		if (disposed || !pending) return;
		const { value, snapshot } = pending;
		pending = null;
		pendingAt = 0;
		clearFlushTimer();
		submit(value, snapshot);
	};
	const scheduleFlush = () => {
		clearFlushTimer();
		flushTimer = setTimer(() => {
			flushPending();
		}, windowMs);
	};
	const submitBurst = (value) => {
		if (disposed) return;
		if (!params.enabled) {
			submit(value, params.captureSnapshot?.());
			return;
		}
		if (value.includes("\n")) {
			flushPending();
			submit(value, params.captureSnapshot?.());
			return;
		}
		const ts = now();
		const snapshot = params.captureSnapshot?.();
		params.onCapture?.(value, snapshot);
		if (!pending) {
			pending = {
				value,
				...snapshot ? { snapshot } : {}
			};
			pendingAt = ts;
			scheduleFlush();
			return;
		}
		if (ts - pendingAt <= windowMs) {
			pending = {
				value: `${pending.value}\n${value}`,
				...pending.snapshot || snapshot ? { snapshot: pending.snapshot ?? snapshot } : {}
			};
			pendingAt = ts;
			scheduleFlush();
			return;
		}
		flushPending();
		pending = {
			value,
			...snapshot ? { snapshot } : {}
		};
		pendingAt = ts;
		scheduleFlush();
	};
	const dispose = () => {
		disposed = true;
		pending = null;
		clearFlushTimer();
	};
	return Object.assign(submitBurst, { dispose });
}
//#endregion
//#region src/tui/components/custom-editor.ts
const KITTY_CSI_U_SUFFIX_REGEX = /^(\d+)(?::(\d*))?(?::(\d+))?(?:;(\d+))?(?::(\d+))?u$/u;
const KITTY_MODIFIERS = {
	alt: 2,
	ctrl: 4
};
function decodeAltGrPrintable(data) {
	if (!data.startsWith("\x1B[")) return;
	const match = data.slice(2).match(KITTY_CSI_U_SUFFIX_REGEX);
	if (!match) return;
	const codepoint = Number.parseInt(match[1] ?? "", 10);
	const baseLayoutKey = match[3] ? Number.parseInt(match[3], 10) : void 0;
	const modifierValue = match[4] ? Number.parseInt(match[4], 10) : 1;
	if (((Number.isFinite(modifierValue) ? modifierValue - 1 : 0) & -193) !== (KITTY_MODIFIERS.alt | KITTY_MODIFIERS.ctrl)) return;
	if (typeof baseLayoutKey !== "number" || baseLayoutKey === codepoint) return;
	if (!Number.isFinite(codepoint) || codepoint < 32) return;
	try {
		return String.fromCodePoint(codepoint);
	} catch {
		return;
	}
}
/** Editor with OpenClaw TUI shortcuts layered on top of pi-tui text editing. */
var CustomEditor = class extends Editor {
	/** Preserves text when pi-tui trimming would create an executable bang line. */
	handleInput(data) {
		if (isKeyRelease(data)) return;
		if (matchesKey(data, Key.alt("enter")) && this.onAltEnter) {
			this.onAltEnter();
			return;
		}
		if (matchesKey(data, Key.alt("up")) && this.onAltUp) {
			this.onAltUp();
			return;
		}
		if (matchesKey(data, Key.ctrl("l")) && this.onCtrlL) {
			this.onCtrlL();
			return;
		}
		if (matchesKey(data, Key.ctrl("o")) && this.onCtrlO) {
			this.onCtrlO();
			return;
		}
		if (matchesKey(data, Key.ctrl("p")) && this.onCtrlP) {
			this.onCtrlP();
			return;
		}
		if (matchesKey(data, Key.ctrl("g")) && this.onCtrlG) {
			this.onCtrlG();
			return;
		}
		if (matchesKey(data, Key.ctrl("t")) && this.onCtrlT) {
			this.onCtrlT();
			return;
		}
		if (matchesKey(data, Key.shift("tab")) && this.onShiftTab) {
			this.onShiftTab();
			return;
		}
		if (matchesKey(data, Key.escape) && this.onEscape && !this.isShowingAutocomplete()) {
			this.onEscape();
			return;
		}
		if (matchesKey(data, Key.ctrl("c")) && this.onCtrlC) {
			this.onCtrlC();
			return;
		}
		if (matchesKey(data, Key.ctrl("d")) && this.getText().length === 0 && this.onCtrlD) {
			this.onCtrlD();
			return;
		}
		const altGrPrintable = decodeAltGrPrintable(data);
		if (altGrPrintable !== void 0) {
			super.handleInput(altGrPrintable);
			return;
		}
		const keybindings = getKeybindings();
		const cursor = this.getCursor();
		const lines = this.getLines();
		if (cursor.line === lines.length - 1 && cursor.col === (lines[cursor.line]?.length ?? 0) && this.isShowingAutocomplete() && keybindings.matches(data, "tui.select.confirm") && keybindings.matches(data, "tui.input.submit") && this.shouldSubmitAutocomplete?.(this.getText())) this.setText(this.getText());
		if (keybindings.matches(data, "tui.input.submit") && this.onSubmit) {
			const expandedText = this.getExpandedText();
			if (trimWouldCreateExecutableBangLine(expandedText)) {
				const onSubmit = this.onSubmit;
				this.onSubmit = () => onSubmit(expandedText);
				try {
					super.handleInput(data);
				} finally {
					this.onSubmit = onSubmit;
				}
				return;
			}
		}
		super.handleInput(data);
	}
};
//#endregion
//#region src/tui/tui-autocomplete.ts
const originalSafeItem = Symbol("originalSafeItem");
/** Sanitize autocomplete presentation and omit values unsafe for editor rendering. */
function sanitizeAutocompleteProvider(inner) {
	return {
		triggerCharacters: inner.triggerCharacters,
		async getSuggestions(...args) {
			const suggestions = await inner.getSuggestions(...args);
			if (!suggestions) return null;
			const safeItems = suggestions.items.filter((item) => isTerminalSafeAutocompleteValue(item.value));
			if (safeItems.length === 0) return null;
			return {
				...suggestions,
				items: Array.from(safeItems, (item) => {
					const { description: rawDescription, ...displayFields } = item;
					const label = sanitizeRenderableLine(item.label) || sanitizeRenderableLine(item.value) || "(unnamed)";
					const description = rawDescription === void 0 ? void 0 : sanitizeRenderableLine(rawDescription);
					const displayItem = {
						...displayFields,
						label,
						...description ? { description } : {}
					};
					return Object.defineProperty(displayItem, originalSafeItem, { value: item });
				})
			};
		},
		applyCompletion(lines, cursorLine, cursorCol, item, prefix) {
			return inner.applyCompletion(lines, cursorLine, cursorCol, Reflect.get(item, originalSafeItem) ?? item, prefix);
		},
		shouldTriggerFileCompletion: inner.shouldTriggerFileCompletion ? (...args) => inner.shouldTriggerFileCompletion(...args) : void 0
	};
}
//#endregion
//#region src/tui/components/filterable-select-list.ts
/**
* Combines text input filtering with a select list.
* User types to filter, arrows or Ctrl+P/Ctrl+N navigate, and Escape clears or cancels.
*/
var FilterableSelectList = class {
	constructor(items, maxVisible, theme) {
		this.filterText = "";
		this.allItems = items;
		this.maxVisible = maxVisible;
		this.theme = theme;
		this.input = new Input();
		this.selectList = this.createSelectList(this.allItems);
	}
	get focused() {
		return this.input.focused;
	}
	set focused(value) {
		this.input.focused = value;
	}
	applyFilter() {
		if (!this.filterText.trim()) {
			this.selectList = this.createSelectList(this.allItems);
			return;
		}
		const filtered = fuzzyFilter(this.allItems, this.filterText, (item) => [
			item.label,
			item.description,
			item.searchText
		].filter(Boolean).join(" "));
		this.selectList = this.createSelectList(filtered);
	}
	createSelectList(items) {
		return new SelectList(items.map((item) => ({
			...item,
			label: sanitizeRenderableLine(item.label || item.value) || sanitizeRenderableLine(item.value) || "(unnamed)",
			description: sanitizeRenderableLine(item.description ?? "")
		})), this.maxVisible, this.theme);
	}
	invalidate() {
		this.input.invalidate();
		this.selectList.invalidate();
	}
	render(width) {
		const lines = [];
		const safeWidth = Math.max(0, width);
		const filterLabel = this.theme.filterLabel("Filter: ");
		const inputText = this.input.render(Math.max(0, safeWidth - visibleWidth(filterLabel)))[0] ?? "";
		lines.push(truncateToWidth(filterLabel + inputText, safeWidth, ""));
		lines.push(chalk.dim("─".repeat(safeWidth)));
		const listLines = this.selectList.render(safeWidth);
		lines.push(...listLines.map((line) => truncateToWidth(line, safeWidth, "")));
		return lines;
	}
	handleInput(keyData) {
		if (matchesKey(keyData, "up") || matchesKey(keyData, "ctrl+p")) {
			this.selectList.handleInput("\x1B[A");
			return;
		}
		if (matchesKey(keyData, "down") || matchesKey(keyData, "ctrl+n")) {
			this.selectList.handleInput("\x1B[B");
			return;
		}
		if (matchesKey(keyData, "enter")) {
			const selected = this.selectList.getSelectedItem();
			if (selected) this.onSelect?.(selected);
			return;
		}
		if (matchesKey(keyData, "escape") || keyData === "") {
			if (this.filterText) {
				this.filterText = "";
				this.input.setValue("");
				this.applyFilter();
			} else this.onCancel?.();
			return;
		}
		const prevValue = this.input.getValue();
		this.input.handleInput(keyData);
		const newValue = this.input.getValue();
		if (newValue !== prevValue) {
			this.filterText = newValue;
			this.applyFilter();
		}
	}
	getSelectedItem() {
		return this.selectList.getSelectedItem();
	}
	getFilterText() {
		return this.filterText;
	}
};
//#endregion
//#region src/tui/components/searchable-select-list.ts
const ANSI_SGR_REGEX = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, "g");
/**
* A select list with a search input at the top for fuzzy filtering.
*/
var SearchableSelectList = class SearchableSelectList {
	static {
		this.DESCRIPTION_LAYOUT_MIN_WIDTH = 40;
	}
	static {
		this.DESCRIPTION_MIN_WIDTH = 12;
	}
	static {
		this.DESCRIPTION_SPACING_WIDTH = 2;
	}
	static {
		this.RIGHT_MARGIN_WIDTH = 2;
	}
	constructor(items, maxVisible, theme) {
		this.selectedIndex = 0;
		this.regexCache = /* @__PURE__ */ new Map();
		this.compareByScore = (a, b) => {
			if (a.tier !== b.tier) return a.tier - b.tier;
			if (a.score !== b.score) return a.score - b.score;
			return this.getItemLabel(a.item).localeCompare(this.getItemLabel(b.item));
		};
		this.items = items;
		this.filteredItems = items;
		this.maxVisible = maxVisible;
		this.theme = theme;
		this.searchInput = new Input();
	}
	get focused() {
		return this.searchInput.focused;
	}
	set focused(value) {
		this.searchInput.focused = value;
	}
	getCachedRegex(pattern) {
		let regex = this.regexCache.get(pattern);
		if (!regex) {
			regex = new RegExp(this.escapeRegex(pattern), "gi");
			this.regexCache.set(pattern, regex);
		}
		return regex;
	}
	updateFilter() {
		const query = this.searchInput.getValue().trim();
		if (!query) this.filteredItems = this.items;
		else this.filteredItems = this.smartFilter(query);
		this.selectedIndex = 0;
		this.notifySelectionChange();
	}
	/**
	* Smart filtering that prioritizes:
	* 1. Exact substring match in label (highest priority)
	* 2. Exact substring in description
	* 3. Fuzzy match (lowest priority)
	*/
	smartFilter(query) {
		const q = normalizeLowercaseStringOrEmpty(query);
		const scoredItems = [];
		const fuzzyCandidates = [];
		for (const item of this.items) {
			const rawLabel = this.getItemLabel(item);
			const rawDesc = item.description ?? "";
			const label = normalizeLowercaseStringOrEmpty(stripAnsi$1(rawLabel));
			const desc = normalizeLowercaseStringOrEmpty(stripAnsi$1(rawDesc));
			const labelIndex = label.indexOf(q);
			if (labelIndex !== -1) {
				scoredItems.push({
					item,
					tier: 0,
					score: labelIndex
				});
				continue;
			}
			const descIndex = desc.indexOf(q);
			if (descIndex !== -1) {
				scoredItems.push({
					item,
					tier: 1,
					score: descIndex
				});
				continue;
			}
			const searchText = item.searchText ?? "";
			fuzzyCandidates.push({
				item,
				searchText: normalizeLowercaseStringOrEmpty([
					rawLabel,
					rawDesc,
					searchText
				].map((value) => stripAnsi$1(value)).filter((value) => value.length > 0).join(" "))
			});
		}
		scoredItems.sort(this.compareByScore);
		const fuzzyMatches = fuzzyFilter(fuzzyCandidates, q, (entry) => entry.searchText);
		return [...scoredItems.map((s) => s.item), ...fuzzyMatches.map((entry) => entry.item)];
	}
	escapeRegex(str) {
		return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	}
	getItemLabel(item) {
		return item.label || item.value;
	}
	splitAnsiParts(text) {
		const parts = [];
		ANSI_SGR_REGEX.lastIndex = 0;
		let lastIndex = 0;
		let match;
		while ((match = ANSI_SGR_REGEX.exec(text)) !== null) {
			if (match.index > lastIndex) parts.push({
				text: text.slice(lastIndex, match.index),
				isAnsi: false
			});
			parts.push({
				text: match[0],
				isAnsi: true
			});
			lastIndex = match.index + match[0].length;
		}
		if (lastIndex < text.length) parts.push({
			text: text.slice(lastIndex),
			isAnsi: false
		});
		return parts;
	}
	highlightMatch(text, query) {
		const tokens = query.trim().split(/\s+/).map((token) => normalizeLowercaseStringOrEmpty(token)).filter((token) => token.length > 0);
		if (tokens.length === 0) return text;
		const uniqueTokens = uniqueStrings(tokens).toSorted((a, b) => b.length - a.length);
		let parts = this.splitAnsiParts(text);
		for (const token of uniqueTokens) {
			const regex = this.getCachedRegex(token);
			const nextParts = [];
			for (const part of parts) {
				if (part.isAnsi) {
					nextParts.push(part);
					continue;
				}
				regex.lastIndex = 0;
				const replaced = part.text.replace(regex, (match) => this.theme.matchHighlight(match));
				if (replaced === part.text) {
					nextParts.push(part);
					continue;
				}
				nextParts.push(...this.splitAnsiParts(replaced));
			}
			parts = nextParts;
		}
		return parts.map((part) => part.text).join("");
	}
	setSelectedIndex(index) {
		this.selectedIndex = Math.max(0, Math.min(index, this.filteredItems.length - 1));
	}
	invalidate() {
		this.searchInput.invalidate();
	}
	render(width) {
		const lines = [];
		const safeWidth = Math.max(0, width);
		const prompt = this.theme.searchPrompt("search: ");
		const inputWidth = Math.max(0, safeWidth - visibleWidth(prompt));
		const inputText = this.searchInput.render(inputWidth)[0] ?? "";
		lines.push(truncateToWidth(`${prompt}${this.theme.searchInput(inputText)}`, safeWidth, ""));
		lines.push("");
		const query = this.searchInput.getValue().trim();
		if (this.filteredItems.length === 0) {
			lines.push(truncateToWidth(this.theme.noMatch("  No matches"), safeWidth, ""));
			return lines;
		}
		const startIndex = Math.max(0, Math.min(this.selectedIndex - Math.floor(this.maxVisible / 2), this.filteredItems.length - this.maxVisible));
		const endIndex = Math.min(startIndex + this.maxVisible, this.filteredItems.length);
		for (let i = startIndex; i < endIndex; i++) {
			const item = this.filteredItems[i];
			if (!item) continue;
			const isSelected = i === this.selectedIndex;
			lines.push(truncateToWidth(this.renderItemLine(item, isSelected, safeWidth, query), safeWidth, ""));
		}
		if (this.filteredItems.length > this.maxVisible) {
			const scrollInfo = `${this.selectedIndex + 1}/${this.filteredItems.length}`;
			lines.push(truncateToWidth(this.theme.scrollInfo(`  ${scrollInfo}`), safeWidth, ""));
		}
		return lines;
	}
	renderItemLine(item, isSelected, width, query) {
		const prefix = isSelected ? "→ " : "  ";
		const prefixWidth = prefix.length;
		const displayValue = sanitizeRenderableLine(this.getItemLabel(item)) || sanitizeRenderableLine(item.value) || "(unnamed)";
		const description = sanitizeRenderableLine(item.description ?? "");
		if (description) {
			const descriptionLayout = this.getDescriptionLayout(width, prefixWidth);
			if (descriptionLayout) {
				const truncatedValue = truncateToWidth(displayValue, descriptionLayout.maxValueWidth, "");
				const valueText = this.highlightMatch(truncatedValue, query);
				const usedByValue = visibleWidth(valueText);
				const descriptionWidth = descriptionLayout.availableWidth - usedByValue - descriptionLayout.spacingWidth;
				if (descriptionWidth >= SearchableSelectList.DESCRIPTION_MIN_WIDTH) {
					const spacing = " ".repeat(descriptionLayout.spacingWidth);
					const truncatedDesc = truncateToWidth(description, descriptionWidth, "");
					const highlightedDesc = this.highlightMatch(truncatedDesc, query);
					const line = `${prefix}${valueText}${spacing}${isSelected ? highlightedDesc : this.theme.description(highlightedDesc)}`;
					return isSelected ? this.theme.selectedText(line) : line;
				}
			}
		}
		const truncatedValue = truncateToWidth(displayValue, width - prefixWidth - 2, "");
		const line = `${prefix}${this.highlightMatch(truncatedValue, query)}`;
		return isSelected ? this.theme.selectedText(line) : line;
	}
	getDescriptionLayout(width, prefixWidth) {
		if (width <= SearchableSelectList.DESCRIPTION_LAYOUT_MIN_WIDTH) return null;
		const availableWidth = Math.max(1, width - prefixWidth - SearchableSelectList.RIGHT_MARGIN_WIDTH);
		const maxValueWidth = availableWidth - SearchableSelectList.DESCRIPTION_MIN_WIDTH - SearchableSelectList.DESCRIPTION_SPACING_WIDTH;
		if (maxValueWidth < 1) return null;
		return {
			availableWidth,
			maxValueWidth,
			spacingWidth: SearchableSelectList.DESCRIPTION_SPACING_WIDTH
		};
	}
	handleInput(keyData) {
		if (isKeyRelease(keyData)) return;
		if (matchesKey(keyData, "up") || matchesKey(keyData, "ctrl+p")) {
			this.selectedIndex = Math.max(0, this.selectedIndex - 1);
			this.notifySelectionChange();
			return;
		}
		if (matchesKey(keyData, "down") || matchesKey(keyData, "ctrl+n")) {
			this.selectedIndex = Math.min(this.filteredItems.length - 1, this.selectedIndex + 1);
			this.notifySelectionChange();
			return;
		}
		if (matchesKey(keyData, "enter")) {
			const item = this.filteredItems[this.selectedIndex];
			if (item && this.onSelect) this.onSelect(item);
			return;
		}
		if (matchesKey(keyData, "escape") || keyData === "") {
			if (this.onCancel) this.onCancel();
			return;
		}
		const prevValue = this.searchInput.getValue();
		this.searchInput.handleInput(keyData);
		if (prevValue !== this.searchInput.getValue()) {
			this.regexCache.clear();
			this.updateFilter();
		}
	}
	notifySelectionChange() {
		const item = this.filteredItems[this.selectedIndex];
		if (item && this.onSelectionChange) this.onSelectionChange(item);
	}
	getSelectedItem() {
		return this.filteredItems[this.selectedIndex] ?? null;
	}
};
//#endregion
//#region src/tui/components/selectors.ts
/** Creates a themed searchable select list for TUI overlays. */
function createSearchableSelectList(items, maxVisible = 7) {
	return new SearchableSelectList(items, maxVisible, searchableSelectListTheme);
}
/** Creates a themed filterable select list for TUI overlays. */
function createFilterableSelectList(items, maxVisible = 7) {
	return new FilterableSelectList(items, maxVisible, filterableSelectListTheme);
}
/** Creates a themed settings list with change and cancel callbacks. */
function createSettingsList(items, onChange, onCancel, maxVisible = 7) {
	return new SettingsList(items, maxVisible, settingsListTheme, onChange, onCancel);
}
//#endregion
//#region src/tui/tui-busy-notice.ts
const TUI_AGENT_BUSY_MESSAGE = "agent is busy — press Esc to abort before sending a new message";
function addBlockedChatSubmitNotice(chatLog) {
	chatLog.addSystem(TUI_AGENT_BUSY_MESSAGE, { coalesceConsecutive: true });
}
//#endregion
//#region src/tui/tui-session-projection.ts
/** Admit only finals the terminal formatter can actually render. */
function hasDisplayableTuiSessionFinal(event, showThinking) {
	if (typeof event.errorMessage === "string" && event.errorMessage.trim()) return true;
	if (!event.message) return false;
	return extractTextFromMessage(event.message, { includeThinking: showThinking }).trim().length > 0;
}
/** Distinguish a legacy batch invalidation from an individually replayable message. */
function isIdentityOnlyTuiSessionInvalidation(event) {
	if (event.phase !== "message") return false;
	const changed = event;
	return changed.message === void 0 && !(typeof changed.messageId === "string" && changed.messageId.trim().length > 0) && !(typeof changed.messageSeq === "number" && Number.isSafeInteger(changed.messageSeq) && changed.messageSeq > 0) && !(typeof event.runId === "string" && event.runId.trim().length > 0) && !(typeof event.clientRunId === "string" && event.clientRunId.trim().length > 0);
}
/** Provider-local imports require a complete source or persisted—not envelope—sequence. */
function isReplayableTuiSessionMessage(event) {
	const identity = readSessionMessageIdentity(event.message, event);
	return Boolean(identity && (!identity.isImported || identity.externalSource || readSessionMessageSequence(event.message) !== null));
}
/** Scope the shared transcript projection to the TUI's actual selected session. */
function readTuiSessionProjectionScope(state) {
	return {
		sessionKey: state.currentSessionKey,
		agentId: state.currentAgentId,
		...state.currentSessionId ? { sessionId: state.currentSessionId } : {}
	};
}
/** Keep event handlers, history, and optimistic sends on one selected-session projection. */
function getTuiSessionProjection(state) {
	const scope = readTuiSessionProjectionScope(state);
	const current = state.sessionProjection;
	if (current && agentSessionKeysMatchByRequestKey(current.scope.sessionKey, scope.sessionKey) && current.scope.agentId === scope.agentId && (current.scope.sessionId === scope.sessionId || current.scope.sessionId === void 0 && scope.sessionId !== void 0)) {
		if (current.scope.sessionKey === scope.sessionKey && current.scope.sessionId === scope.sessionId) return current;
		const projection = {
			...current,
			scope: {
				...current.scope,
				...scope
			}
		};
		state.sessionProjection = projection;
		return projection;
	}
	const projection = createSessionProjection(scope);
	state.sessionProjection = projection;
	return projection;
}
/** Apply durable facts to the same TUI-owned reducer observed by every client path. */
function reduceTuiSessionProjection(state, event) {
	const projection = reduceSessionProjection(getTuiSessionProjection(state), event);
	state.sessionProjection = projection;
	return projection;
}
/** Promote a durable assistant row into the matching live run projection. */
function projectTuiSessionMessage(state, event, unboundDisplayedRunIds) {
	if (!isReplayableTuiSessionMessage(event)) return;
	const identity = readSessionMessageIdentity(event.message, event);
	const authoritativeRunId = (identity?.role === "assistant" && !identity.isImported ? identity.id ?? void 0 : void 0) ? identity?.runId ?? event.clientRunId ?? state.activeChatRunId ?? (unboundDisplayedRunIds.length === 1 ? unboundDisplayedRunIds[0] : void 0) : void 0;
	reduceTuiSessionProjection(state, {
		type: "messagePersisted",
		message: event.message,
		envelope: authoritativeRunId ? {
			...event,
			runId: authoritativeRunId
		} : event,
		scope: readTuiSessionProjectionScope(state)
	});
	return authoritativeRunId;
}
/** Retain the assistant reply actually rendered until authoritative history adopts it. */
function projectTuiSessionFinal(state, event, finalText, hasStreamedText) {
	if (state.sessionProjection?.runs[event.runId]?.stopReason === "error" || !hasStreamedText && !hasDisplayableTuiSessionFinal({
		...event,
		errorMessage: void 0
	}, state.showThinking)) return;
	const source = event.message && typeof event.message === "object" && !Array.isArray(event.message) ? event.message : {};
	const attachments = Array.isArray(source.content) ? source.content.filter(isTuiAssistantAttachmentBlock) : [];
	reduceTuiSessionProjection(state, {
		type: "messagePersisted",
		message: {
			...source,
			role: "assistant",
			content: attachments.length ? [{
				type: "text",
				text: finalText
			}, ...attachments] : finalText
		},
		envelope: { runId: event.runId },
		scope: readTuiSessionProjectionScope(state)
	});
}
//#endregion
//#region src/tui/tui-status-summary.ts
/** Formats Gateway/session health into compact status lines for the TUI. */
function formatStatusSummary(summary) {
	const lines = [];
	lines.push("Gateway status");
	if (summary.runtimeVersion) lines.push(`Version: ${summary.runtimeVersion}`);
	if (!summary.linkChannel) lines.push("Link channel: unknown");
	else {
		const linkLabel = summary.linkChannel.label ?? "Link channel";
		const linked = summary.linkChannel.linked === true;
		const authAge = linked && typeof summary.linkChannel.authAgeMs === "number" ? ` (last refreshed ${formatTimeAgo(summary.linkChannel.authAgeMs)})` : "";
		lines.push(`${linkLabel}: ${linked ? "linked" : "not linked"}${authAge}`);
	}
	const providerSummary = Array.isArray(summary.providerSummary) ? summary.providerSummary : [];
	if (providerSummary.length > 0) {
		lines.push("");
		lines.push("System:");
		for (const line of providerSummary) lines.push(`  ${line}`);
	}
	const heartbeatAgents = summary.heartbeat?.agents ?? [];
	if (heartbeatAgents.length > 0) {
		const heartbeatParts = heartbeatAgents.map((agent) => {
			const agentId = agent.agentId ?? "unknown";
			if (!agent.enabled || !agent.everyMs) return `disabled (${agentId})`;
			return `${agent.every ?? "unknown"} (${agentId})`;
		});
		lines.push("");
		lines.push(`Heartbeat: ${heartbeatParts.join(", ")}`);
	}
	const sessionPaths = summary.sessions?.paths ?? [];
	if (sessionPaths.length === 1) lines.push(`Session store: ${sessionPaths[0]}`);
	else if (sessionPaths.length > 1) lines.push(`Session stores: ${sessionPaths.length}`);
	const defaults = summary.sessions?.defaults;
	const defaultModel = defaults?.model ?? "unknown";
	const defaultCtx = typeof defaults?.contextTokens === "number" ? ` (${formatTokenCount(defaults.contextTokens)} ctx)` : "";
	lines.push(`Default model: ${defaultModel}${defaultCtx}`);
	const sessionCount = summary.sessions?.count ?? 0;
	lines.push(`Active sessions: ${sessionCount}`);
	const recent = Array.isArray(summary.sessions?.recent) ? summary.sessions?.recent : [];
	if (recent.length > 0) {
		lines.push("Recent sessions:");
		for (const entry of recent) {
			const ageLabel = typeof entry.age === "number" ? formatTimeAgo(entry.age) : "no activity";
			const model = entry.model ?? "unknown";
			const usage = formatContextUsageLine({
				total: entry.totalTokens ?? null,
				context: entry.contextTokens ?? null,
				remaining: entry.remainingTokens ?? null,
				percent: entry.percentUsed ?? null
			});
			const flags = entry.flags?.length ? ` | flags: ${entry.flags.join(", ")}` : "";
			lines.push(`- ${entry.key}${entry.kind ? ` [${entry.kind}]` : ""} | ${ageLabel} | model ${model} | ${usage}${flags}`);
		}
	}
	const queued = Array.isArray(summary.queuedSystemEvents) ? summary.queuedSystemEvents : [];
	if (queued.length > 0) {
		const preview = queued.slice(0, 3).join(" | ");
		lines.push(`Queued system events (${queued.length}): ${preview}`);
	}
	return lines;
}
//#endregion
//#region src/tui/tui-submit-state.ts
function beginPendingSubmit(state, runId, text) {
	state.pendingSubmit = {
		phase: "sending",
		runId,
		draftText: text
	};
}
function acceptPendingSubmit(params) {
	const pending = params.state.pendingSubmit;
	if (!pending || pending.phase !== "sending" || pending.runId !== params.provisionalRunId) return false;
	params.state.pendingSubmit = {
		phase: "accepted",
		runId: params.acceptedRunId,
		draftText: params.preserveDraft ? pending.draftText : null
	};
	return true;
}
function clearPendingSubmit(state, runId) {
	const pending = state.pendingSubmit;
	if (!pending || runId !== void 0 && pending.runId !== runId) return false;
	state.pendingSubmit = null;
	return true;
}
function clearPendingSubmitDraft(state, runId) {
	const pending = state.pendingSubmit;
	if (pending?.phase !== "accepted" || pending.runId !== runId || pending.draftText === null) return false;
	state.pendingSubmit = {
		...pending,
		draftText: null
	};
	return true;
}
function hasPendingSubmit(state) {
	return state.pendingSubmit !== null;
}
function getPendingSubmitAcceptedRunId(state) {
	return state.pendingSubmit?.phase === "accepted" ? state.pendingSubmit.runId : null;
}
function getPendingSubmitDraft(state) {
	const pending = state.pendingSubmit;
	if (!pending || pending.draftText === null) return null;
	return {
		runId: pending.runId,
		text: pending.draftText
	};
}
function reconcilePendingSubmitHistory(state, reconciledRunIds) {
	const runId = state.pendingSubmit?.runId;
	if (!runId || !new Set(reconciledRunIds).has(runId)) return false;
	state.pendingSubmit = null;
	return true;
}
function resolveTuiChatSubmitAdmission(params) {
	if (!params.isConnected) return {
		status: "blocked",
		reason: "disconnected"
	};
	if (isChatStopCommandText(params.message) && (params.activeChatRunId || params.pendingSubmit?.phase === "accepted")) return { status: "allowed" };
	return params.pendingSubmit ? {
		status: "blocked",
		reason: "pending"
	} : { status: "allowed" };
}
function disconnectedTuiChatSubmitMessage(local) {
	return local ? "local runtime not ready — message not sent" : "not connected to gateway — message not sent";
}
//#endregion
//#region src/tui/tui-command-handlers.ts
function formatTuiFastMode(mode) {
	return mode === "auto" ? "auto" : mode === true ? "on" : "off";
}
function isBtwCommand(text) {
	return /^\/(?:btw|side)(?::|\s|$)/i.test(text.trim());
}
function isSlashStopCommand(text) {
	const trimmed = text.trim();
	return trimmed.startsWith("/") && isChatStopCommandText(trimmed);
}
function isTerminalChatSendAckFailure(status) {
	const normalized = normalizeLowercaseStringOrEmpty(status);
	return normalized === "timeout" || normalized === "error";
}
function isTerminalChatSendAckSuccess(status) {
	return normalizeLowercaseStringOrEmpty(status) === "ok";
}
const TERMINAL_CHAT_SEND_FAILURE_MESSAGE = "Chat failed before the run started; try again.";
function createCommandHandlers(context) {
	const { client, chatLog, tui, opts, state, deliverDefault, openOverlay, closeOverlay, refreshSessionInfo, loadHistory, setSession, refreshAgents, abortActive, setActivityStatus, applySessionInfoFromPatch, applySessionMutationResult, noteLocalRunId, noteLocalBtwRunId, forgetLocalRunId, forgetLocalBtwRunId, consumeCompletedRunForPendingSend, isRunObserved, flushPendingHistoryRefreshIfIdle, runAuthFlow, requestExit } = context;
	let sessionTransition = {
		active: null,
		boundary: null,
		epoch: 0
	};
	const beginSessionTransition = (command) => {
		const epoch = sessionTransition.epoch + 1;
		sessionTransition = {
			active: command,
			boundary: command,
			epoch
		};
		return () => {
			if (sessionTransition.active === command && sessionTransition.epoch === epoch) sessionTransition = {
				active: null,
				boundary: command,
				epoch: epoch + 1
			};
		};
	};
	const captureMessageAdmission = () => ({
		sessionTransition: sessionTransition.active,
		sessionTransitionEpoch: sessionTransition.epoch
	});
	const resolveMessageAdmission = (message, snapshot) => {
		const admission = resolveTuiChatSubmitAdmission({
			isConnected: state.isConnected,
			activeChatRunId: state.activeChatRunId,
			pendingSubmit: state.pendingSubmit,
			message
		});
		if (admission.status === "blocked" && admission.reason === "disconnected") return admission;
		const transitionCommand = snapshot ? snapshot.sessionTransition ?? (snapshot.sessionTransitionEpoch !== sessionTransition.epoch ? sessionTransition.active ?? sessionTransition.boundary : null) : sessionTransition.active;
		if (transitionCommand) return {
			status: "blocked",
			reason: "session-transition",
			command: transitionCommand
		};
		return admission.status === "blocked" && isBtwCommand(message) ? { status: "allowed" } : admission;
	};
	const reportBlockedMessageSubmit = (_message, admission) => {
		if (admission.reason === "pending") addBlockedChatSubmitNotice(chatLog);
		else if (admission.reason === "disconnected") {
			chatLog.addSystem(disconnectedTuiChatSubmitMessage(opts.local === true));
			setActivityStatus("disconnected");
		} else chatLog.addSystem(`session change in progress; wait for /${admission.command} to finish`);
		tui.requestRender();
	};
	const addUnsupportedLocalCommand = (name) => {
		chatLog.addSystem(`/${name} is not available in local embedded mode; message not sent`);
	};
	const setAgent = async (id) => {
		state.currentAgentId = normalizeAgentId(id);
		await setSession("");
		chatLog.addSystem(`agent set to ${state.currentAgentId}; use /openclaw to return`);
	};
	const closeOverlayAndRender = (handle) => {
		closeOverlay(handle);
		tui.requestRender();
	};
	const hasTrackedAbortTarget = () => Boolean(state.activeChatRunId || hasPendingSubmit(state));
	const hasUnsafeSessionRollover = () => hasTrackedAbortTarget() || state.activityStatus === "finishing context";
	const rejectUnsafeSessionRollover = (command) => {
		if (!hasUnsafeSessionRollover()) return false;
		chatLog.addSystem(`abort the current run before /${command}`);
		tui.requestRender();
		return true;
	};
	const captureSessionSelection = () => ({
		sessionKey: state.currentSessionKey,
		agentId: state.currentAgentId
	});
	const isCurrentSessionSelection = (selection) => state.currentAgentId === selection.agentId && agentSessionKeysMatchByRequestKey(state.currentSessionKey, selection.sessionKey);
	const patchCurrentSession = async (patch) => {
		const selection = captureSessionSelection();
		try {
			const result = await client.patchSession({
				key: selection.sessionKey,
				...!parseAgentSessionKey(selection.sessionKey) ? { agentId: selection.agentId } : {},
				...patch
			});
			return isCurrentSessionSelection(selection) ? result : null;
		} catch (err) {
			if (!isCurrentSessionSelection(selection)) return null;
			throw err;
		}
	};
	const applySessionSetting = async (patch, success, failure, after) => {
		try {
			const result = await patchCurrentSession(patch);
			if (!result) return;
			chatLog.addSystem(typeof success === "function" ? success(result) : success);
			applySessionInfoFromPatch(result);
			if (after) await after(result);
			else await refreshSessionInfo();
		} catch (err) {
			chatLog.addSystem(`${failure}: ${formatTuiErrorMessage(err)}`);
		}
	};
	const openSelector = (selector, onSelect) => {
		selector.onSelect = (item) => {
			(async () => {
				await onSelect(item.value);
				closeOverlayAndRender(overlayHandle);
			})();
		};
		selector.onCancel = () => closeOverlayAndRender(overlayHandle);
		const overlayHandle = openOverlay(selector);
		tui.requestRender();
	};
	const openModelSelector = async () => {
		const selection = captureSessionSelection();
		try {
			chatLog.addSystem("loading models...");
			tui.requestRender();
			const models = await client.listModels();
			if (!isCurrentSessionSelection(selection)) return;
			if (models.length === 0) {
				chatLog.addSystem("no models available");
				tui.requestRender();
				return;
			}
			const selector = createSearchableSelectList(models.map((model) => {
				const ref = modelKey(model.provider, model.id);
				return {
					value: ref,
					label: ref,
					description: model.name && model.name !== model.id ? model.name : ""
				};
			}), 9);
			openSelector(selector, async (value) => {
				await applySessionSetting({ model: value }, `model set to ${value}`, "model set failed");
			});
		} catch (err) {
			if (!isCurrentSessionSelection(selection)) return;
			chatLog.addSystem(`model list failed: ${formatTuiErrorMessage(err)}`);
			tui.requestRender();
		}
	};
	const openAgentSelector = async () => {
		if (!(await refreshAgents()).ok) {
			tui.requestRender();
			return;
		}
		const selectableAgents = state.agents.filter((agent) => agent.kind !== "system");
		if (selectableAgents.length === 0) {
			chatLog.addSystem("no agents found");
			tui.requestRender();
			return;
		}
		const selector = createSearchableSelectList(selectableAgents.map((agent) => ({
			value: agent.id,
			label: agent.name ? `${agent.id} (${agent.name})` : agent.id,
			description: agent.id === state.agentDefaultId ? "default" : ""
		})), 9);
		openSelector(selector, async (value) => {
			await setAgent(value);
		});
	};
	const openContextModeSelector = () => {
		const selector = createSearchableSelectList([
			{
				value: "list",
				label: "list",
				description: "Short context breakdown"
			},
			{
				value: "detail",
				label: "detail",
				description: "Per-file, per-tool, per-skill, and system prompt size"
			},
			{
				value: "json",
				label: "json",
				description: "Machine-readable context report"
			}
		], 9);
		openSelector(selector, async (value) => {
			await sendMessage(`/context ${value}`);
		});
	};
	const openSessionSelector = async () => {
		const selection = captureSessionSelection();
		try {
			const sessions = await loadRecentSessions(client, { agentId: selection.agentId });
			if (!isCurrentSessionSelection(selection)) return;
			const selector = createFilterableSelectList(buildSessionChoices(sessions), 9);
			openSelector(selector, async (value) => {
				await setSession(value);
			});
		} catch (err) {
			if (!isCurrentSessionSelection(selection)) return;
			chatLog.addSystem(`sessions list failed: ${formatTuiErrorMessage(err)}`);
			tui.requestRender();
		}
	};
	const openSettings = () => {
		const settings = createSettingsList([{
			id: "tools",
			label: "Tool output",
			currentValue: state.toolsExpanded ? "expanded" : "collapsed",
			values: ["collapsed", "expanded"]
		}, {
			id: "thinking",
			label: "Show thinking",
			currentValue: state.showThinking ? "on" : "off",
			values: ["off", "on"]
		}], (id, value) => {
			if (id === "tools") {
				state.toolsExpanded = value === "expanded";
				chatLog.setToolsExpanded(state.toolsExpanded);
			}
			if (id === "thinking") {
				state.showThinking = value === "on";
				loadHistory();
			}
			tui.requestRender();
		}, () => {
			closeOverlay(overlayHandle);
			tui.requestRender();
		});
		const overlayHandle = openOverlay(settings);
		tui.requestRender();
	};
	const commandHandlers = {
		help: () => {
			chatLog.addSystem(helpText({
				local: opts.local,
				provider: state.sessionInfo.modelProvider,
				model: state.sessionInfo.model,
				agentRuntime: state.sessionInfo.agentRuntime?.id
			}));
		},
		auth: async (args) => {
			if (!runAuthFlow) {
				chatLog.addSystem("auth login is only available in local embedded mode");
				return;
			}
			if (state.activeChatRunId || hasPendingSubmit(state)) {
				chatLog.addSystem("abort the current run before /auth");
				return;
			}
			const provider = args.trim() || state.sessionInfo.modelProvider || void 0;
			chatLog.addSystem(provider ? `opening auth flow for ${provider}; TUI will resume when it exits` : "opening auth flow; TUI will resume when it exits");
			tui.requestRender();
			setActivityStatus("auth");
			try {
				const result = await runAuthFlow({ provider });
				await refreshSessionInfo();
				if (result.exitCode === 0 && !result.signal) {
					chatLog.addSystem(provider ? `auth flow finished for ${provider}` : "auth flow finished");
					setActivityStatus("idle");
				} else {
					const failureSuffix = result.signal ? ` (signal ${result.signal})` : typeof result.exitCode === "number" ? ` (exit ${String(result.exitCode)})` : "";
					chatLog.addSystem(`auth flow failed${failureSuffix}`);
					setActivityStatus("error");
				}
			} catch (err) {
				chatLog.addSystem(`auth flow failed: ${formatTuiErrorMessage(err)}`);
				setActivityStatus("error");
			}
		},
		"gateway-status": async () => {
			try {
				const status = await client.getGatewayStatus();
				if (typeof status === "string") {
					chatLog.addSystem(status);
					return;
				}
				if (status && typeof status === "object") {
					const lines = formatStatusSummary(status);
					for (const line of lines) chatLog.addSystem(line);
					return;
				}
				chatLog.addSystem("status: unknown response");
			} catch (err) {
				chatLog.addSystem(`status failed: ${formatTuiErrorMessage(err)}`);
			}
		},
		agent: async (args) => {
			if (!args) await openAgentSelector();
			else await setAgent(args);
		},
		agents: async () => await openAgentSelector(),
		context: async (args, raw) => {
			if (opts.local) addUnsupportedLocalCommand("context");
			else if (!args) openContextModeSelector();
			else await sendMessage(raw);
		},
		goal: async (_args, raw) => {
			if (opts.local === true && client.runGoalCommand) try {
				const result = await client.runGoalCommand({
					sessionKey: state.currentSessionKey,
					agentId: state.currentAgentId,
					command: raw
				});
				chatLog.addSystem(result.text);
				await refreshSessionInfo();
				if (result.continuationPrompt) await sendMessage(result.continuationPrompt);
			} catch (err) {
				chatLog.addSystem(`goal failed: ${formatTuiErrorMessage(err)}`);
			}
			else await sendMessage(raw);
		},
		btw: async (args, raw) => {
			if (args) await sendMessage(raw);
			else chatLog.addSystem("Usage: /btw <side question>");
		},
		queue: async (_args, raw) => await sendMessage(raw),
		openclaw: (args) => {
			chatLog.addSystem(args ? `returning to OpenClaw with request: ${args}` : "returning to OpenClaw");
			requestExit({
				exitReason: "return-to-system-agent",
				...args ? { systemAgentMessage: args } : {}
			});
		},
		session: async (args) => {
			if (!args) await openSessionSelector();
			else await setSession(args);
		},
		sessions: async () => await openSessionSelector(),
		model: async (args, raw) => {
			if (shouldForwardModelCommandToServer(args)) await sendMessage(raw);
			else if (!args) await openModelSelector();
			else await applySessionSetting({ model: args }, (result) => {
				const resolvedModel = result.resolved?.model;
				const resolvedProvider = result.resolved?.modelProvider;
				return `model set to ${resolvedModel ? resolvedProvider ? modelKey(resolvedProvider, resolvedModel) : resolvedModel : args}`;
			}, "model set failed");
		},
		models: async () => await openModelSelector(),
		think: async (args) => {
			if (!args) {
				const levels = state.sessionInfo.thinkingLevels?.map((level) => level.label).join("|") || formatThinkingLevels(state.sessionInfo.modelProvider, state.sessionInfo.model, "|", void 0, state.sessionInfo.agentRuntime?.id);
				chatLog.addSystem(`usage: /think <${levels}>`);
				return;
			}
			await applySessionSetting({ thinkingLevel: args }, `thinking set to ${args}`, "think failed");
		},
		verbose: async (args) => {
			if (!args) {
				chatLog.addSystem(`usage: ${formatTuiLevelCommandUsage("verbose")}`);
				return;
			}
			await applySessionSetting({ verboseLevel: args }, `verbose set to ${args}`, "verbose failed", async () => {
				if (args === "off") {
					chatLog.clearTools();
					await refreshSessionInfo();
				} else await loadHistory();
			});
		},
		trace: async (args) => {
			if (!args) {
				chatLog.addSystem("usage: /trace <on|off>");
				return;
			}
			await applySessionSetting({ traceLevel: args }, `trace set to ${args}`, "trace failed");
		},
		fast: async (args) => {
			if (!args || args === "status") {
				chatLog.addSystem(`fast mode: ${formatTuiFastMode(state.sessionInfo.fastMode)}`);
				return;
			}
			if (args !== "auto" && args !== "on" && args !== "off") {
				chatLog.addSystem("usage: /fast <status|auto|on|off>");
				return;
			}
			await applySessionSetting({ fastMode: args === "auto" ? "auto" : args === "on" }, `fast mode set to ${args}`, "fast failed");
		},
		reasoning: async (args) => {
			if (!args) {
				chatLog.addSystem(`usage: ${formatTuiLevelCommandUsage("reasoning")}`);
				return;
			}
			await applySessionSetting({ reasoningLevel: args }, `reasoning set to ${args}`, "reasoning failed");
		},
		usage: async (args) => {
			const isReset = args ? isSessionDefaultDirectiveValue(args) : false;
			const normalized = args && !isReset ? normalizeUsageDisplay(args) : void 0;
			if (args && !normalized && !isReset) {
				chatLog.addSystem("usage: /usage <off|tokens|full|reset>");
				return;
			}
			if (isReset) {
				await applySessionSetting({ responseUsage: null }, "usage footer: reset to default", "usage failed", async () => {
					delete state.sessionInfo.responseUsage;
					delete state.sessionInfo.effectiveResponseUsage;
					await refreshSessionInfo();
				});
				return;
			}
			const current = state.sessionInfo.effectiveResponseUsage ?? resolveResponseUsageMode(state.sessionInfo.responseUsage);
			const next = normalized ?? (current === "off" ? "tokens" : current === "tokens" ? "full" : "off");
			await applySessionSetting({ responseUsage: next }, `usage footer: ${next}`, "usage failed");
		},
		elevated: async (args) => {
			if (!args) {
				chatLog.addSystem("usage: /elevated <on|off|ask|full>");
				return;
			}
			if (![
				"on",
				"off",
				"ask",
				"full"
			].includes(args)) {
				chatLog.addSystem("usage: /elevated <on|off|ask|full>");
				return;
			}
			await applySessionSetting({ elevatedLevel: args }, `elevated set to ${args}`, "elevated failed");
		},
		activation: async (args) => {
			if (!args) {
				chatLog.addSystem("usage: /activation <mention|always>");
				return;
			}
			const activation = normalizeGroupActivation(args);
			if (!activation) {
				chatLog.addSystem("usage: /activation <mention|always>");
				return;
			}
			await applySessionSetting({ groupActivation: activation }, `activation set to ${activation}`, "activation failed");
		},
		new: async () => {
			if (rejectUnsafeSessionRollover("new")) return;
			const finishSessionTransition = beginSessionTransition("new");
			try {
				const uniqueKey = `tui-${randomUUID()}`;
				const result = await client.createSession({
					key: uniqueKey,
					agentId: state.currentAgentId,
					...state.currentSessionId ? {
						parentSessionKey: state.currentSessionKey,
						succeedsParent: true
					} : {}
				});
				if (!result.key) throw new Error("sessions.create returned no session key");
				state.sessionInfo.inputTokens = null;
				state.sessionInfo.outputTokens = null;
				state.sessionInfo.totalTokens = null;
				tui.requestRender();
				await setSession(result.key);
				chatLog.addSystem(`new session: ${result.key}`);
			} catch (err) {
				chatLog.addSystem(`new session failed: ${formatTuiErrorMessage(err)}`);
			} finally {
				finishSessionTransition();
			}
		},
		reset: async () => {
			if (rejectUnsafeSessionRollover("reset")) return;
			const resetSelection = captureSessionSelection();
			let resetResultSelection = resetSelection;
			const finishSessionTransition = beginSessionTransition("reset");
			try {
				const result = await client.resetSession(resetSelection.sessionKey, "reset", !parseAgentSessionKey(resetSelection.sessionKey) ? { agentId: resetSelection.agentId } : void 0);
				if (!isCurrentSessionSelection(resetSelection)) return;
				state.sessionInfo.inputTokens = null;
				state.sessionInfo.outputTokens = null;
				state.sessionInfo.totalTokens = null;
				tui.requestRender();
				if (applySessionMutationResult(result, resetSelection)) {
					resetResultSelection = captureSessionSelection();
					await refreshSessionInfo();
				} else await loadHistory();
				if (!isCurrentSessionSelection(resetResultSelection)) return;
				chatLog.addSystem(`session ${state.currentSessionKey} reset`);
			} catch (err) {
				if (!isCurrentSessionSelection(resetResultSelection)) return;
				chatLog.addSystem(`reset failed: ${formatTuiErrorMessage(err)}`);
			} finally {
				finishSessionTransition();
			}
		},
		abort: async () => await abortActive(),
		stop: async () => {
			await abortActive({ preferActive: true });
		},
		settings: () => openSettings(),
		exit: () => requestExit()
	};
	const handleCommand = async (raw) => {
		const { name, args } = parseCommand(raw);
		if (!name) return;
		const descriptor = resolveTuiCommandDescriptor(name);
		if (sessionTransition.active && descriptor?.name !== "exit") {
			chatLog.addSystem(`session change in progress; wait for /${sessionTransition.active} to finish`);
			tui.requestRender();
			return;
		}
		if (descriptor?.handler) await commandHandlers[descriptor.name](args, raw);
		else if (opts.local && isSharedTextCommand(raw)) addUnsupportedLocalCommand(name);
		else await sendMessage(raw);
		tui.requestRender();
	};
	const sendMessage = async (text) => {
		const admission = resolveMessageAdmission(text);
		if (admission.status === "blocked") {
			reportBlockedMessageSubmit(text, admission);
			return;
		}
		const isBtw = isBtwCommand(text);
		const busy = Boolean(state.activeChatRunId || hasPendingSubmit(state));
		if (isSlashStopCommand(text) || hasTrackedAbortTarget() && busy && isChatStopCommandText(text)) {
			await abortActive({ preferActive: true });
			return;
		}
		const runId = randomUUID();
		const sendSelection = captureSessionSelection();
		const sendSessionId = state.currentSessionId;
		const sendSessionGeneration = state.sessionGeneration ?? 0;
		const isCurrentSendViewport = () => isCurrentSessionSelection(sendSelection) && (state.sessionGeneration ?? 0) === sendSessionGeneration && (sendSessionId === null || state.currentSessionId === sendSessionId);
		const sendScope = readTuiSessionProjectionScope(state);
		try {
			if (!isBtw) {
				if (opts.local === true && state.activeChatRunId && !hasPendingSubmit(state)) chatLog.reserveAssistantSlot(state.activeChatRunId);
				chatLog.addPendingUser(runId, text);
				reduceTuiSessionProjection(state, {
					type: "sendPending",
					message: {
						role: "user",
						content: [{
							type: "text",
							text
						}],
						__openclaw: { idempotencyKey: `${runId}:user` }
					},
					runId,
					scope: sendScope
				});
				beginPendingSubmit(state, runId, text);
				noteLocalRunId?.(runId);
				setActivityStatus("sending");
			} else noteLocalBtwRunId?.(runId);
			tui.requestRender();
			const sendResult = await client.sendChat({
				sessionKey: sendSelection.sessionKey,
				...!parseAgentSessionKey(sendSelection.sessionKey) ? { agentId: sendSelection.agentId } : {},
				sessionId: sendSessionId,
				message: text,
				thinking: opts.thinking,
				deliver: deliverDefault,
				timeoutMs: opts.timeoutMs,
				runId
			});
			const acceptedRunId = sendResult.runId || runId;
			const terminalAckFailure = isTerminalChatSendAckFailure(sendResult.status);
			const terminalAckSuccess = isTerminalChatSendAckSuccess(sendResult.status);
			const terminalAck = terminalAckFailure || terminalAckSuccess;
			if (!isCurrentSendViewport()) {
				if (isBtw) {
					forgetLocalBtwRunId?.(runId);
					if (acceptedRunId !== runId) forgetLocalBtwRunId?.(acceptedRunId);
				} else {
					forgetLocalRunId?.(runId);
					if (acceptedRunId !== runId) forgetLocalRunId?.(acceptedRunId);
					clearPendingSubmit(state, runId);
					clearPendingSubmit(state, acceptedRunId);
					consumeCompletedRunForPendingSend?.(acceptedRunId);
				}
				return;
			}
			if (isBtw && terminalAck) {
				forgetLocalBtwRunId?.(runId);
				if (acceptedRunId !== runId) forgetLocalBtwRunId?.(acceptedRunId);
				if (terminalAckFailure) chatLog.addSystem(`btw failed: ${TERMINAL_CHAT_SEND_FAILURE_MESSAGE}`);
				tui.requestRender();
				return;
			}
			if (isBtw) {
				if (acceptedRunId !== runId) {
					forgetLocalBtwRunId?.(runId);
					noteLocalBtwRunId?.(acceptedRunId);
				}
				return;
			}
			if (!isBtw) {
				const acknowledgedProjection = reduceTuiSessionProjection(state, {
					type: "sendAcknowledged",
					runId: acceptedRunId,
					previousRunId: runId,
					scope: sendScope
				});
				const acceptedRunAlreadyCompleted = acceptedRunId !== runId && !terminalAck && (consumeCompletedRunForPendingSend?.(acceptedRunId) ?? false);
				acceptPendingSubmit({
					state,
					provisionalRunId: runId,
					acceptedRunId,
					preserveDraft: !(isRunObserved?.(acceptedRunId) || terminalAck)
				});
				if (acceptedRunId !== runId) {
					forgetLocalRunId?.(runId);
					if (!acceptedRunAlreadyCompleted && !terminalAck) noteLocalRunId?.(acceptedRunId);
					if (acknowledgedProjection.entries.some((entry) => entry.pending && entry.pendingRunId === acceptedRunId)) chatLog.rekeyPendingUser(runId, acceptedRunId);
					else chatLog.dropPendingUser(runId);
				}
				if (terminalAck) {
					clearPendingSubmit(state, acceptedRunId);
					forgetLocalRunId?.(acceptedRunId);
					if (terminalAckFailure) {
						reduceTuiSessionProjection(state, {
							type: "sendFailed",
							runId: acceptedRunId,
							scope: sendScope
						});
						chatLog.dropPendingUser(acceptedRunId);
					}
					if (state.activeChatRunId === acceptedRunId) state.activeChatRunId = null;
					await loadHistory();
					if (terminalAckFailure) {
						chatLog.addSystem(`send failed: ${TERMINAL_CHAT_SEND_FAILURE_MESSAGE}`);
						setActivityStatus("error");
					} else setActivityStatus("idle");
					tui.requestRender();
					return;
				}
				if (hasPendingSubmit(state)) {
					if (acceptedRunAlreadyCompleted) {
						clearPendingSubmit(state, acceptedRunId);
						setActivityStatus("idle");
						flushPendingHistoryRefreshIfIdle?.();
					} else setActivityStatus("waiting");
					tui.requestRender();
				}
			}
		} catch (err) {
			if (isBtw) forgetLocalBtwRunId?.(runId);
			else forgetLocalRunId?.(runId);
			if (!isCurrentSendViewport()) {
				clearPendingSubmit(state, runId);
				return;
			}
			if (!isBtw && state.activeChatRunId === runId) forgetLocalRunId?.(state.activeChatRunId);
			if (!isBtw) {
				if (state.activeChatRunId === runId) state.activeChatRunId = null;
				clearPendingSubmit(state, runId);
				reduceTuiSessionProjection(state, {
					type: "sendFailed",
					runId,
					scope: sendScope
				});
				chatLog.dropPendingUser(runId);
			}
			chatLog.addSystem(`${isBtw ? "btw failed" : "send failed"}: ${formatTuiErrorMessage(err)}`);
			if (!isBtw) setActivityStatus("error");
			tui.requestRender();
		}
	};
	return {
		handleCommand,
		sendMessage,
		captureMessageAdmission,
		resolveMessageAdmission,
		reportBlockedMessageSubmit,
		openModelSelector,
		openAgentSelector,
		openSessionSelector,
		openSettings,
		setAgent
	};
}
//#endregion
//#region src/tui/tui-run-lifecycle.ts
const DEFAULT_STREAMING_WATCHDOG_MS = 3e4;
const LIFECYCLE_ERROR_RETRY_GRACE_MS = 15e3;
const STREAMING_WATCHDOG_USER_MESSAGE = "This response is taking longer than expected. Still waiting for the current run.";
/** Gives session resets, concurrent runs, and reconnects one lifecycle owner. */
function createTuiRunLifecycle(context) {
	const { state, runCoordinator, chatLog, btw, tui, setActivityStatus, refreshSessionInfo, isLocalRunId, forgetLocalRunId, clearLocalRunIds, clearLocalBtwRunIds, localMode } = context;
	const { sessionRuns, liveTerminalErrorMessages } = runCoordinator;
	const pendingTerminalLifecycleErrors = /* @__PURE__ */ new Map();
	const streamingWatchdogMs = typeof context.streamingWatchdogMs === "number" && Number.isFinite(context.streamingWatchdogMs) && context.streamingWatchdogMs >= 0 ? Math.floor(context.streamingWatchdogMs) : DEFAULT_STREAMING_WATCHDOG_MS;
	let lastSessionKey = state.currentSessionKey;
	let reconnectPendingRunId = null;
	let streamingWatchdogTimer = null;
	let streamingWatchdogRunId = null;
	const flushPendingHistoryRefreshIfIdle = () => {
		if (state.activeChatRunId || hasPendingSubmit(state)) return;
		if (!runCoordinator.pendingHistoryRefresh) return;
		runCoordinator.pendingHistoryRefresh = false;
		runCoordinator.queueHistoryReload();
	};
	const clearStreamingWatchdog = () => {
		if (streamingWatchdogTimer) {
			clearTimeout(streamingWatchdogTimer);
			streamingWatchdogTimer = null;
		}
		streamingWatchdogRunId = null;
	};
	const clearPendingTerminalLifecycleError = (runId) => {
		const pending = pendingTerminalLifecycleErrors.get(runId);
		if (!pending) return;
		clearTimeout(pending.timer);
		pendingTerminalLifecycleErrors.delete(runId);
	};
	const clearPendingTerminalLifecycleErrors = () => {
		for (const pending of pendingTerminalLifecycleErrors.values()) clearTimeout(pending.timer);
		pendingTerminalLifecycleErrors.clear();
	};
	const clearTrackedRunState = () => {
		runCoordinator.clear();
		clearPendingSubmit(state);
		reconnectPendingRunId = null;
		clearLocalRunIds?.();
		clearLocalBtwRunIds?.();
		clearPendingTerminalLifecycleErrors();
		btw.clear();
		clearStreamingWatchdog();
	};
	const armStreamingWatchdog = (runId) => {
		if (streamingWatchdogMs <= 0) return;
		if (streamingWatchdogTimer) clearTimeout(streamingWatchdogTimer);
		streamingWatchdogRunId = runId;
		streamingWatchdogTimer = setTimeout(() => {
			streamingWatchdogTimer = null;
			if (streamingWatchdogRunId !== runId || state.activeChatRunId !== runId) return;
			streamingWatchdogRunId = null;
			if (reconnectPendingRunId === runId) {
				reconnectPendingRunId = null;
				state.activeChatRunId = null;
				state.activityStatus = "idle";
				setActivityStatus("idle");
				runCoordinator.pendingHistoryRefresh = false;
				runCoordinator.queueHistoryReload();
				tui.requestRender();
				return;
			}
			chatLog.addPendingSystem(runId, STREAMING_WATCHDOG_USER_MESSAGE);
			tui.requestRender();
		}, streamingWatchdogMs);
		streamingWatchdogTimer.unref?.();
	};
	const syncSessionKey = () => {
		if (state.currentSessionKey === lastSessionKey) return;
		lastSessionKey = state.currentSessionKey;
		if (!state.activeChatRunId && !hasPendingSubmit(state)) clearTrackedRunState();
	};
	const resolveAuthErrorHint = (errorMessage) => {
		if (!localMode) return;
		const provider = state.sessionInfo.modelProvider?.trim();
		const failoverReason = classifyFailoverReason(errorMessage, { provider });
		if (failoverReason === "billing" || failoverReason === "rate_limit") return;
		if (!isAuthErrorMessage(errorMessage)) return;
		return provider ? `auth or provider access failed for ${provider}. Run /auth ${provider} to refresh credentials; if you already re-authed, switch models/providers because this account may still be blocked for inference.` : "auth or provider access failed for the current provider. Run /auth to refresh credentials; if you already re-authed, switch models/providers because this account may still be blocked for inference.";
	};
	const applyFallbackStepModelUpdate = (event) => {
		const data = event.data ?? {};
		if (event.stream !== "lifecycle" || formatPrimitiveString(data.phase, "") !== "fallback_step") return false;
		if (typeof data.fallbackStepToModel !== "string") return false;
		const modelRef = data.fallbackStepToModel.trim();
		const separator = modelRef.indexOf("/");
		if (separator <= 0 || separator >= modelRef.length - 1) return false;
		const provider = modelRef.slice(0, separator).trim();
		const model = modelRef.slice(separator + 1).trim();
		if (!provider || !model) return false;
		state.sessionInfo.modelProvider = provider;
		state.sessionInfo.model = model;
		return true;
	};
	const markSubmittedRunRegistered = (runId) => {
		clearPendingSubmitDraft(state, runId);
	};
	const acknowledgeChatRun = (runId, options) => {
		if (reconnectPendingRunId === runId) reconnectPendingRunId = null;
		clearPendingTerminalLifecycleError(runId);
		chatLog.dismissPendingSystem(runId);
		runCoordinator.noteSessionRun(runId, options);
		markSubmittedRunRegistered(runId);
	};
	const clearActiveRunIfMatch = (runId) => {
		if (state.activeChatRunId === runId) state.activeChatRunId = null;
	};
	const promoteMostRecentSessionRun = () => {
		if (state.activeChatRunId) return false;
		const nextRunId = runCoordinator.resolveMostRecentPromotableRun();
		if (!nextRunId) return false;
		state.activeChatRunId = nextRunId;
		clearStreamingWatchdog();
		setActivityStatus("running");
		armStreamingWatchdog(nextRunId);
		return true;
	};
	const clearStaleStreamingIfNoTrackedRunRemains = () => {
		const activeRunId = state.activeChatRunId;
		const activeRunIsStillTracked = activeRunId ? sessionRuns.has(activeRunId) : false;
		if (state.activityStatus !== "streaming" || activeRunIsStillTracked || sessionRuns.size > 0) return;
		state.activeChatRunId = null;
		state.activityStatus = "idle";
		setActivityStatus("idle");
		clearStreamingWatchdog();
		flushPendingHistoryRefreshIfIdle();
	};
	const reconnectStreamingWatchdog = (historyInFlightRunId) => {
		clearStreamingWatchdog();
		const activeRunId = state.activeChatRunId;
		if (!activeRunId) {
			reconnectPendingRunId = null;
			clearStaleStreamingIfNoTrackedRunRemains();
			return;
		}
		if (historyInFlightRunId === null) {
			runCoordinator.noteFinalizedRun(activeRunId, { displayedFinal: true });
			state.activeChatRunId = null;
			clearPendingTerminalLifecycleError(activeRunId);
			setActivityStatus("idle");
			flushPendingHistoryRefreshIfIdle();
			return;
		}
		if (!sessionRuns.has(activeRunId)) {
			reconnectPendingRunId = null;
			state.activeChatRunId = null;
			state.activityStatus = "idle";
			setActivityStatus("idle");
			flushPendingHistoryRefreshIfIdle();
			return;
		}
		reconnectPendingRunId = activeRunId;
		setActivityStatus("streaming");
		armStreamingWatchdog(activeRunId);
	};
	const finalizeRun = (params) => {
		runCoordinator.noteFinalizedRun(params.runId, { displayedFinal: params.displayedFinal });
		clearActiveRunIfMatch(params.runId);
		const promotedRemainingRun = promoteMostRecentSessionRun();
		flushPendingHistoryRefreshIfIdle();
		if (!promotedRemainingRun) if (params.wasActiveRun) {
			setActivityStatus(params.status);
			clearStreamingWatchdog();
		} else {
			if (streamingWatchdogRunId === params.runId) clearStreamingWatchdog();
			clearStaleStreamingIfNoTrackedRunRemains();
		}
		refreshSessionInfo?.();
	};
	const terminateRun = (params) => {
		runCoordinator.noteCompletedRun(params.runId);
		runCoordinator.dropSessionRun(params.runId);
		clearActiveRunIfMatch(params.runId);
		const promotedRemainingRun = promoteMostRecentSessionRun();
		flushPendingHistoryRefreshIfIdle();
		if (!promotedRemainingRun) {
			if (params.wasActiveRun) {
				setActivityStatus(params.status);
				clearStreamingWatchdog();
			} else if (streamingWatchdogRunId === params.runId) clearStreamingWatchdog();
		}
		refreshSessionInfo?.();
	};
	const hasConcurrentActiveRun = (runId) => {
		const activeRunId = state.activeChatRunId;
		return Boolean(activeRunId && activeRunId !== runId);
	};
	const maybeRefreshHistoryForRun = (runId, options) => {
		const isPendingChatRun = options?.wasPendingChatRun === true || getPendingSubmitAcceptedRunId(state) === runId;
		if (isLocalRunId?.(runId) ?? false) {
			forgetLocalRunId?.(runId);
			if (!options?.allowLocalWithoutDisplayableFinal) return;
			if (state.activeChatRunId && state.activeChatRunId !== runId) {
				runCoordinator.pendingHistoryRefresh = true;
				return;
			}
		}
		if (!isPendingChatRun && hasPendingSubmit(state)) {
			runCoordinator.pendingHistoryRefresh = true;
			return;
		}
		if (options?.hasDisplayableFinal || hasConcurrentActiveRun(runId)) return;
		runCoordinator.pendingHistoryRefresh = false;
		runCoordinator.queueHistoryReload();
	};
	const renderTerminalRunError = (params) => {
		const { runId, errorMessage } = params;
		const wasActiveRun = state.activeChatRunId === runId;
		if (params.requireActiveOrPending && !wasActiveRun && getPendingSubmitAcceptedRunId(state) !== runId) return false;
		const renderedError = formatRawAssistantErrorForUi(errorMessage);
		chatLog.dismissPendingSystem(runId);
		const displayMessage = resolveAuthErrorHint(errorMessage) ?? `run error: ${renderedError}`;
		liveTerminalErrorMessages.set(runId, displayMessage);
		chatLog.addSystem(displayMessage);
		runCoordinator.noteFinalizedRun(runId, { displayedFinal: true });
		terminateRun({
			runId,
			wasActiveRun,
			status: "error"
		});
		maybeRefreshHistoryForRun(runId, { hasDisplayableFinal: true });
		return true;
	};
	const scheduleTerminalLifecycleError = (runId, errorMessage) => {
		clearPendingTerminalLifecycleError(runId);
		const timer = setTimeout(() => {
			pendingTerminalLifecycleErrors.delete(runId);
			if (renderTerminalRunError({
				runId,
				errorMessage,
				requireActiveOrPending: true
			})) tui.requestRender(true);
		}, LIFECYCLE_ERROR_RETRY_GRACE_MS);
		timer.unref?.();
		pendingTerminalLifecycleErrors.set(runId, {
			errorMessage,
			timer
		});
	};
	const dispose = () => {
		clearTrackedRunState();
	};
	return {
		acknowledgeChatRun,
		applyFallbackStepModelUpdate,
		armStreamingWatchdog,
		clearPendingTerminalLifecycleError,
		clearStreamingWatchdog,
		clearStaleStreamingIfNoTrackedRunRemains,
		clearTrackedRunState,
		dispose,
		finalizeRun,
		flushPendingHistoryRefreshIfIdle,
		hasConcurrentActiveRun,
		markSubmittedRunRegistered,
		maybeRefreshHistoryForRun,
		pauseStreamingWatchdog: clearStreamingWatchdog,
		reconnectStreamingWatchdog,
		renderTerminalRunError,
		scheduleTerminalLifecycleError,
		syncSessionKey,
		terminateRun
	};
}
//#endregion
//#region src/tui/tui-session-events.ts
/** Reads the durable user identity without mistaking another run's prompt for this one. */
function readTuiSessionUserMessage(event) {
	const message = event.message;
	if (!message || typeof message !== "object" || Array.isArray(message)) return null;
	const record = message;
	const identity = readSessionMessageIdentity(message, event);
	if (identity?.role !== "user") return null;
	const persistedSequence = readSessionMessageSequence(message);
	const messageId = identity.isImported ? identity.externalSource ? `external:${identity.externalSource}` : persistedSequence !== null ? `imported-seq:${persistedSequence}` : null : identity.id ?? (identity.sequence !== null ? `seq:${identity.sequence}` : null);
	const text = extractTextFromMessage(record);
	if (!messageId || !text) return null;
	return {
		messageId,
		text,
		...identity.runId ? { runId: identity.runId } : {}
	};
}
/** Preserves opaque peer IDs while guarding canonical, global, and alias ownership. */
function matchesSelectedTuiSession(state, event, options) {
	const eventSessionKey = event.sessionKey?.trim();
	if (!agentSessionKeysMatchByRequestKey(eventSessionKey, state.currentSessionKey)) return false;
	const parsedEvent = parseAgentSessionKey(eventSessionKey);
	const parsedSelection = parseAgentSessionKey(state.currentSessionKey);
	if (parsedEvent && parsedSelection && normalizeLowercaseStringOrEmpty(parsedEvent.agentId) !== normalizeLowercaseStringOrEmpty(parsedSelection.agentId)) return false;
	const selectedAgentId = normalizeLowercaseStringOrEmpty(state.currentAgentId);
	const eventAgentId = normalizeLowercaseStringOrEmpty(event.agentId);
	const defaultAgentId = normalizeLowercaseStringOrEmpty(state.agentDefaultId);
	if (!(normalizeLowercaseStringOrEmpty(eventSessionKey) === "global" || options?.requireAliasOwnership === true && !parsedEvent)) return true;
	return eventAgentId ? eventAgentId === selectedAgentId : selectedAgentId === defaultAgentId;
}
//#endregion
//#region src/tui/tui-stream-assembler.ts
const MAX_TRACKED_STREAM_RUNS = 200;
function extractTextBlocksAndSignals(message) {
	if (!message || typeof message !== "object") return {
		textBlocks: [],
		sawNonTextContentBlocks: false
	};
	const content = message.content;
	if (typeof content === "string") {
		const text = content.trim();
		return {
			textBlocks: text ? [text] : [],
			sawNonTextContentBlocks: false
		};
	}
	if (!Array.isArray(content)) return {
		textBlocks: [],
		sawNonTextContentBlocks: false
	};
	const textBlocks = [];
	let sawNonTextContentBlocks = false;
	for (const block of content) {
		if (!block || typeof block !== "object") continue;
		const rec = block;
		if (rec.type === "text" && typeof rec.text === "string") {
			const text = rec.text.trim();
			if (text) textBlocks.push(text);
			continue;
		}
		if (typeof rec.type === "string" && rec.type !== "thinking") sawNonTextContentBlocks = true;
	}
	return {
		textBlocks,
		sawNonTextContentBlocks
	};
}
function isDroppedBoundaryTextBlockSubset(params) {
	const { streamedTextBlocks, finalTextBlocks } = params;
	if (finalTextBlocks.length === 0 || finalTextBlocks.length >= streamedTextBlocks.length) return false;
	if (finalTextBlocks.every((block, index) => streamedTextBlocks[index] === block)) return true;
	const suffixStart = streamedTextBlocks.length - finalTextBlocks.length;
	return finalTextBlocks.every((block, index) => streamedTextBlocks[suffixStart + index] === block);
}
function shouldPreserveBoundaryDroppedText(params) {
	if (params.boundaryDropMode === "off") return false;
	if (!(params.boundaryDropMode === "streamed-or-incoming" ? params.streamedSawNonTextContentBlocks || params.incomingSawNonTextContentBlocks : params.streamedSawNonTextContentBlocks)) return false;
	return isDroppedBoundaryTextBlockSubset({
		streamedTextBlocks: params.streamedTextBlocks,
		finalTextBlocks: params.nextContentBlocks
	});
}
/** Assembles assistant stream deltas and final messages into stable TUI display text. */
var TuiStreamAssembler = class {
	constructor(isProtectedRun) {
		this.isProtectedRun = isProtectedRun;
		this.runs = /* @__PURE__ */ new Map();
	}
	createRunState() {
		return {
			thinkingText: "",
			contentText: "",
			contentBlocks: [],
			sawNonTextContentBlocks: false,
			displayText: ""
		};
	}
	getTrackedRun(runId) {
		const existing = this.runs.get(runId);
		if (existing) {
			this.runs.delete(runId);
			this.runs.set(runId, existing);
			return existing;
		}
		const state = this.createRunState();
		this.runs.set(runId, state);
		if (this.runs.size > MAX_TRACKED_STREAM_RUNS) for (const trackedRunId of this.runs.keys()) {
			if (this.runs.size <= MAX_TRACKED_STREAM_RUNS) break;
			if (!this.isProtectedRun?.(trackedRunId)) this.runs.delete(trackedRunId);
		}
		return state;
	}
	updateRunState(state, message, showThinking, opts) {
		const thinkingText = extractThinkingFromMessage(message);
		const contentText = extractContentFromMessage(message);
		const { textBlocks, sawNonTextContentBlocks } = extractTextBlocksAndSignals(message);
		if (thinkingText) state.thinkingText = thinkingText;
		if (contentText) {
			const nextContentBlocks = textBlocks.length > 0 ? textBlocks : [contentText];
			if (!shouldPreserveBoundaryDroppedText({
				boundaryDropMode: opts?.boundaryDropMode ?? "off",
				streamedSawNonTextContentBlocks: state.sawNonTextContentBlocks,
				incomingSawNonTextContentBlocks: sawNonTextContentBlocks,
				streamedTextBlocks: state.contentBlocks,
				nextContentBlocks
			})) {
				state.contentText = contentText;
				state.contentBlocks = nextContentBlocks;
			}
		}
		if (sawNonTextContentBlocks) state.sawNonTextContentBlocks = true;
		state.displayText = composeThinkingAndContent({
			thinkingText: state.thinkingText,
			contentText: state.contentText,
			showThinking
		});
	}
	/** Ingests a streaming delta and returns updated display text only when it changed. */
	ingestDelta(runId, message, showThinking) {
		const state = this.getTrackedRun(runId);
		const previousDisplayText = state.displayText;
		this.updateRunState(state, message, showThinking, { boundaryDropMode: "streamed-or-incoming" });
		if (!state.displayText || state.displayText === previousDisplayText) return null;
		return state.displayText;
	}
	/** Reports whether a run already has real displayable streamed content. */
	hasDisplayText(runId) {
		return Boolean(this.runs.get(runId)?.displayText);
	}
	/** Finalizes a run, combines any error text, and drops stored stream state. */
	finalize(runId, message, showThinking, errorMessage) {
		const state = this.runs.get(runId) ?? this.createRunState();
		const streamedContentText = state.contentText;
		const streamedTextBlocks = [...state.contentBlocks];
		const streamedSawNonTextContentBlocks = state.sawNonTextContentBlocks;
		this.updateRunState(state, message, showThinking, { boundaryDropMode: "streamed-only" });
		const responseText = resolveFinalAssistantText({
			finalText: streamedSawNonTextContentBlocks && isDroppedBoundaryTextBlockSubset({
				streamedTextBlocks,
				finalTextBlocks: state.contentBlocks
			}) ? streamedContentText : state.contentText,
			streamedText: streamedContentText,
			errorMessage,
			attachmentText: extractAssistantAttachmentText(message)
		});
		const omitEmptyPlaceholder = responseText === "(no output)" && Boolean(state.thinkingText);
		const finalText = composeThinkingAndContent({
			thinkingText: state.thinkingText,
			contentText: omitEmptyPlaceholder ? "" : responseText,
			showThinking
		});
		this.runs.delete(runId);
		return finalText || "(no output)";
	}
	/** Drops stored stream state for an aborted or discarded run. */
	drop(runId) {
		this.runs.delete(runId);
	}
	/** Clears stream fragments when the selected conversation changes. */
	clear() {
		this.runs.clear();
	}
};
//#endregion
//#region src/tui/tui-session-run-coordinator.ts
const MAX_TRACKED_RUNS = 200;
const RETAINED_TRACKED_RUNS = 150;
const TRACKED_RUN_RETENTION_MS = 600 * 1e3;
const HISTORY_RELOAD_QUEUED = 1;
const HISTORY_RELOAD_OWNED = 2;
const HISTORY_RELOAD_DISPLAYED = 4;
const HISTORY_RELOAD_GAP_RECOVERY = 8;
/** A small FIFO membership tracker for run IDs that need no lifecycle metadata. */
function createTuiRunIdTracker() {
	const runIds = /* @__PURE__ */ new Set();
	return {
		note: (runId) => {
			if (runId) runIds.add(runId);
			if (runIds.size > MAX_TRACKED_RUNS) runIds.delete(runIds.values().next().value);
		},
		forget: (runId) => void runIds.delete(runId),
		has: (runId) => runIds.has(runId),
		clear: () => runIds.clear()
	};
}
/** Keeps one session's run, persistence, and transcript ownership together. */
var TuiSessionRunCoordinator = class {
	constructor(context) {
		this.context = context;
		this.sessionRuns = /* @__PURE__ */ new Map();
		this.finalizedRuns = /* @__PURE__ */ new Map();
		this.finalizedRunsWithDisplay = /* @__PURE__ */ new Map();
		this.pendingNewSessionRunIds = /* @__PURE__ */ new Set();
		this.persistedTerminalRunIds = /* @__PURE__ */ new Map();
		this.liveTerminalErrorMessages = /* @__PURE__ */ new Map();
		this.completedRuns = /* @__PURE__ */ new Map();
		this.postFinalizingRuns = /* @__PURE__ */ new Map();
		this.pendingHistoryRefresh = false;
		this.historyReloadRuns = /* @__PURE__ */ new Map();
		this.confirmedStreamRunIds = /* @__PURE__ */ new Set();
		this.retiredOrphanRunIds = /* @__PURE__ */ new Map();
		this.rejectUnconfirmedRuns = false;
		this.historyReloadInFlight = false;
		this.historyReloadQueued = false;
		this.historyReloadGeneration = 0;
		this.streamAssembler = new TuiStreamAssembler((runId) => {
			return runId === this.context.state.activeChatRunId || runId === getPendingSubmitAcceptedRunId(this.context.state) || this.confirmedStreamRunIds.has(runId);
		});
	}
	pruneRunMap(runs, protectActiveRun = false) {
		if (runs.size <= MAX_TRACKED_RUNS) return;
		const keepUntil = Date.now() - TRACKED_RUN_RETENTION_MS;
		const canRemove = (runId) => !protectActiveRun || runId !== this.context.state.activeChatRunId && runId !== getPendingSubmitAcceptedRunId(this.context.state) && !this.confirmedStreamRunIds.has(runId);
		for (const [runId, seenAt] of runs) {
			if (runs.size <= RETAINED_TRACKED_RUNS) break;
			if (seenAt < keepUntil && canRemove(runId)) runs.delete(runId);
		}
		if (runs.size <= MAX_TRACKED_RUNS) return;
		for (const runId of runs.keys()) {
			if (canRemove(runId)) runs.delete(runId);
			if (runs.size <= RETAINED_TRACKED_RUNS) break;
		}
	}
	noteSessionRun(runId, options) {
		const confirmedRun = options?.protectStream === true || runId === getPendingSubmitAcceptedRunId(this.context.state);
		if (!confirmedRun && this.isRetiredOrphanRun(runId)) return;
		if (confirmedRun) {
			this.retiredOrphanRunIds.delete(runId);
			this.confirmedStreamRunIds.add(runId);
			if (this.confirmedStreamRunIds.size > MAX_TRACKED_RUNS) {
				for (const protectedRunId of this.confirmedStreamRunIds) if (protectedRunId !== this.context.state.activeChatRunId && protectedRunId !== getPendingSubmitAcceptedRunId(this.context.state)) {
					this.confirmedStreamRunIds.delete(protectedRunId);
					break;
				}
			}
		}
		this.sessionRuns.set(runId, Date.now());
		this.pruneRunMap(this.sessionRuns, true);
	}
	isRetiredOrphanRun(runId) {
		return this.retiredOrphanRunIds.has(runId) || this.rejectUnconfirmedRuns && !this.sessionRuns.has(runId);
	}
	resolveMostRecentPromotableRun() {
		const pendingRunId = getPendingSubmitAcceptedRunId(this.context.state);
		let nextRunId;
		let nextSeenAt = -1;
		let unconfirmedRunId;
		let unconfirmedSeenAt = -1;
		for (const [runId, seenAt] of this.sessionRuns) {
			if (runId !== pendingRunId && !this.confirmedStreamRunIds.has(runId)) {
				if (seenAt > unconfirmedSeenAt) {
					unconfirmedRunId = runId;
					unconfirmedSeenAt = seenAt;
				}
				continue;
			}
			if (seenAt > nextSeenAt) {
				nextRunId = runId;
				nextSeenAt = seenAt;
			}
		}
		return nextRunId ?? unconfirmedRunId;
	}
	dropSessionRun(runId) {
		this.sessionRuns.delete(runId);
		const completedConfirmedRun = this.confirmedStreamRunIds.delete(runId);
		this.streamAssembler.drop(runId);
		if (completedConfirmedRun && this.confirmedStreamRunIds.size === 0) {
			this.rejectUnconfirmedRuns = true;
			const activeRunId = this.context.state.activeChatRunId;
			const pendingRunId = getPendingSubmitAcceptedRunId(this.context.state);
			for (const candidateRunId of this.sessionRuns.keys()) {
				if (candidateRunId === activeRunId || candidateRunId === pendingRunId) continue;
				this.sessionRuns.delete(candidateRunId);
				this.streamAssembler.drop(candidateRunId);
				this.retiredOrphanRunIds.set(candidateRunId, Date.now());
			}
			this.pruneRunMap(this.retiredOrphanRunIds);
		}
	}
	noteCompletedRun(runId) {
		this.completedRuns.set(runId, Date.now());
		this.pruneRunMap(this.completedRuns);
	}
	noteFinalizedRun(runId, options) {
		this.finalizedRuns.set(runId, Date.now());
		this.noteCompletedRun(runId);
		if (options?.displayedFinal) this.finalizedRunsWithDisplay.set(runId, Date.now());
		this.dropSessionRun(runId);
		this.pruneRunMap(this.finalizedRuns);
		this.pruneRunMap(this.finalizedRunsWithDisplay);
		for (const retainedRunId of this.liveTerminalErrorMessages.keys()) if (!this.finalizedRunsWithDisplay.has(retainedRunId)) this.liveTerminalErrorMessages.delete(retainedRunId);
	}
	notePostFinalizingRun(runId) {
		this.postFinalizingRuns.set(runId, Date.now());
		this.pruneRunMap(this.postFinalizingRuns);
	}
	notePersistedRun(runId) {
		this.persistedTerminalRunIds.set(runId, Date.now());
		this.pruneRunMap(this.persistedTerminalRunIds);
	}
	routeSessionMessageRefresh(projected) {
		if (projected) return true;
		if (this.context.state.activeChatRunId || hasPendingSubmit(this.context.state)) {
			this.pendingHistoryRefresh = true;
			return true;
		}
		this.queueHistoryReload();
		return false;
	}
	isHistoryReloadingRun(runId) {
		return this.historyReloadRuns.has(runId);
	}
	deferHistoryRunEvent(event) {
		const reload = this.historyReloadRuns.get(event.runId);
		if (!reload) return;
		const previous = reload.deferredEvent;
		if (!previous || previous.state === "delta" || event.state !== "delta") reload.deferredEvent = event;
	}
	async loadHistoryPreservingTerminalErrors() {
		if (!this.context.loadHistory) return { loaded: false };
		const generation = this.historyReloadGeneration;
		const result = await this.context.loadHistory() ?? { loaded: false };
		if (!result.loaded || generation !== this.historyReloadGeneration) return result;
		let restored = false;
		for (const [runId, message] of this.liveTerminalErrorMessages) if (this.finalizedRunsWithDisplay.has(runId)) {
			this.context.restoreTerminalError(message);
			restored = true;
		}
		if (restored) this.context.requestRender(true);
		return result;
	}
	drainHistoryReloadQueue() {
		if (this.historyReloadInFlight || !this.historyReloadQueued || !this.context.loadHistory) return;
		const generation = this.historyReloadGeneration;
		const reloads = [];
		for (const [runId, reload] of this.historyReloadRuns) if (reload.flags & HISTORY_RELOAD_QUEUED) {
			reloads.push({
				runId,
				flags: reload.flags
			});
			reload.flags = 0;
		}
		this.historyReloadQueued = false;
		this.historyReloadInFlight = true;
		const finishReload = (result) => {
			if (generation !== this.historyReloadGeneration) return;
			for (const { runId, flags } of reloads) {
				const current = this.historyReloadRuns.get(runId);
				if (!current || current.flags & HISTORY_RELOAD_QUEUED) continue;
				this.historyReloadRuns.delete(runId);
				const deferred = current.deferredEvent;
				const historyOwned = Boolean(flags & HISTORY_RELOAD_OWNED);
				const previouslyDisplayed = Boolean(flags & HISTORY_RELOAD_DISPLAYED);
				const gapRecovery = Boolean(flags & HISTORY_RELOAD_GAP_RECOVERY);
				const restoredInFlight = result.loaded && result.inFlightRunId === runId;
				if (historyOwned && !restoredInFlight && (result.loaded || !gapRecovery)) this.context.finalizeHistoryOwnedRun({
					runId,
					result,
					previouslyDisplayed
				});
				if (deferred && (!result.loaded || historyOwned || restoredInFlight)) this.context.replayHistoryRunEvent(deferred);
			}
		};
		this.loadHistoryPreservingTerminalErrors().then(finishReload, () => finishReload({ loaded: false })).finally(() => {
			this.historyReloadInFlight = false;
			this.drainHistoryReloadQueue();
		});
	}
	queueHistoryReload(runIds, historyOwnedRunIds = [], displayedRunIds = []) {
		const historyOwned = new Set(historyOwnedRunIds);
		const displayed = new Set(displayedRunIds);
		const queuedRunIds = runIds ?? [];
		if (!this.context.loadHistory) {
			for (const runId of queuedRunIds) if (historyOwned.has(runId)) this.noteFinalizedRun(runId, { displayedFinal: true });
			this.context.refreshSessionInfo?.();
			return;
		}
		if (runIds === void 0) this.historyReloadQueued = true;
		for (const runId of queuedRunIds) {
			this.historyReloadQueued = true;
			const reload = this.historyReloadRuns.get(runId) ?? { flags: 0 };
			reload.flags |= HISTORY_RELOAD_QUEUED;
			if (historyOwned.has(runId)) reload.flags |= HISTORY_RELOAD_OWNED;
			if (displayed.has(runId)) reload.flags |= HISTORY_RELOAD_DISPLAYED;
			this.historyReloadRuns.set(runId, reload);
		}
		this.drainHistoryReloadQueue();
	}
	queueGapHistoryReload(runIds, displayedRunIds = []) {
		if (!this.context.loadHistory) {
			this.context.refreshSessionInfo?.();
			return;
		}
		const trackedRunIds = Array.from(runIds);
		if (trackedRunIds.length === 0) {
			this.queueHistoryReload();
			return;
		}
		for (const runId of trackedRunIds) {
			const reload = this.historyReloadRuns.get(runId) ?? { flags: 0 };
			reload.flags |= HISTORY_RELOAD_GAP_RECOVERY;
			this.historyReloadRuns.set(runId, reload);
		}
		this.queueHistoryReload(trackedRunIds, trackedRunIds, displayedRunIds);
	}
	clear() {
		this.historyReloadGeneration += 1;
		this.sessionRuns.clear();
		this.finalizedRuns.clear();
		this.finalizedRunsWithDisplay.clear();
		this.pendingNewSessionRunIds.clear();
		this.persistedTerminalRunIds.clear();
		this.liveTerminalErrorMessages.clear();
		this.completedRuns.clear();
		this.postFinalizingRuns.clear();
		this.historyReloadRuns.clear();
		this.confirmedStreamRunIds.clear();
		this.retiredOrphanRunIds.clear();
		this.rejectUnconfirmedRuns = false;
		this.historyReloadQueued = false;
		this.pendingHistoryRefresh = false;
		this.streamAssembler.clear();
	}
};
//#endregion
//#region src/tui/tui-event-handlers.ts
function isFailedTuiRunStatus(status) {
	return status === "aborted" || status === "error" || status === "timeout";
}
function createEventHandlers(context) {
	const { chatLog, btw, tui, state, setActivityStatus, refreshSessionInfo, loadHistory, noteLocalRunId, isLocalRunId, forgetLocalRunId, clearLocalRunIds, isLocalBtwRunId, forgetLocalBtwRunId, clearLocalBtwRunIds, localMode } = context;
	const runCoordinator = new TuiSessionRunCoordinator({
		state,
		loadHistory,
		refreshSessionInfo,
		restoreTerminalError: (message) => chatLog.addSystem(message),
		requestRender: (force) => tui.requestRender(force),
		finalizeHistoryOwnedRun: ({ runId, result, previouslyDisplayed }) => {
			finalizeRun({
				runId,
				wasActiveRun: state.activeChatRunId === runId,
				status: "idle",
				displayedFinal: result.loaded || previouslyDisplayed
			});
		},
		replayHistoryRunEvent: (event) => handleChatEvent(event)
	});
	const { sessionRuns, finalizedRuns, finalizedRunsWithDisplay, pendingNewSessionRunIds, persistedTerminalRunIds, completedRuns, postFinalizingRuns, streamAssembler } = runCoordinator;
	const { acknowledgeChatRun, applyFallbackStepModelUpdate, armStreamingWatchdog, clearPendingTerminalLifecycleError, clearStreamingWatchdog, clearStaleStreamingIfNoTrackedRunRemains, clearTrackedRunState, dispose, finalizeRun, flushPendingHistoryRefreshIfIdle, hasConcurrentActiveRun, markSubmittedRunRegistered, maybeRefreshHistoryForRun, pauseStreamingWatchdog, reconnectStreamingWatchdog, renderTerminalRunError, scheduleTerminalLifecycleError, syncSessionKey, terminateRun } = createTuiRunLifecycle({
		state,
		runCoordinator,
		chatLog,
		btw,
		tui,
		setActivityStatus,
		refreshSessionInfo,
		isLocalRunId,
		forgetLocalRunId,
		clearLocalRunIds,
		clearLocalBtwRunIds,
		streamingWatchdogMs: context.streamingWatchdogMs,
		localMode
	});
	const handleChatEvent = (payload) => {
		if (!payload || typeof payload !== "object") return;
		const evt = payload;
		syncSessionKey();
		if (!matchesSelectedTuiSession(state, evt)) return;
		const isSequencedGatewayEvent = Number.isSafeInteger(evt.seq) && (evt.seq ?? -1) >= 0;
		if (runCoordinator.isRetiredOrphanRun(evt.runId) && !isSequencedGatewayEvent && evt.runId !== getPendingSubmitAcceptedRunId(state)) return;
		if (runCoordinator.isHistoryReloadingRun(evt.runId)) {
			runCoordinator.deferHistoryRunEvent(evt);
			return;
		}
		const reducedRun = reduceSessionProjectionRunEvent(getTuiSessionProjection(state), evt, readTuiSessionProjectionScope(state));
		if (!reducedRun) return;
		const previousProjectedRun = reducedRun.previousRun;
		state.sessionProjection = reducedRun.projection;
		if (evt.state === "final" && isFailedTuiRunStatus(previousProjectedRun?.status)) {
			if (!(Boolean(extractTuiAbortedText(evt.message, state.showThinking).trim()) || streamAssembler.hasDisplayText(evt.runId))) {
				clearStaleStreamingIfNoTrackedRunRemains();
				return;
			}
		}
		if (evt.state === "aborted" && previousProjectedRun?.status === "aborted") {
			clearStaleStreamingIfNoTrackedRunRemains();
			return;
		}
		if (finalizedRuns.has(evt.runId)) {
			if (evt.state === "delta") return;
			if (evt.state === "error" && finalizedRunsWithDisplay.has(evt.runId)) {
				const lateError = evt.errorMessage?.trim();
				if (lateError && !runCoordinator.liveTerminalErrorMessages.has(evt.runId) && state.sessionProjection.runs[evt.runId]?.errorMessage === lateError) {
					renderTerminalRunError({
						runId: evt.runId,
						errorMessage: lateError
					});
					tui.requestRender(true);
					return;
				}
				clearStaleStreamingIfNoTrackedRunRemains();
				return;
			}
			if (evt.state === "final") {
				if (!(hasDisplayableTuiSessionFinal(evt, state.showThinking) && (!finalizedRunsWithDisplay.has(evt.runId) || !hasSessionProjectionAcceptedFinal(previousProjectedRun, evt.message)))) {
					clearStaleStreamingIfNoTrackedRunRemains();
					return;
				}
			}
		}
		acknowledgeChatRun(evt.runId, { protectStream: isSequencedGatewayEvent });
		const isPendingChatRun = getPendingSubmitAcceptedRunId(state) === evt.runId;
		const isLocalChatRun = isLocalRunId?.(evt.runId) ?? false;
		const isLocalBtwRun = isLocalBtwRunId?.(evt.runId) ?? false;
		if (hasPendingSubmit(state) && !isLocalBtwRun && (isPendingChatRun || isLocalChatRun && evt.runId !== state.activeChatRunId)) {
			noteLocalRunId?.(evt.runId);
			clearPendingSubmit(state, evt.runId);
		}
		if (!state.activeChatRunId && !isLocalBtwRun) state.activeChatRunId = evt.runId;
		if (isPendingChatRun) clearPendingSubmit(state, evt.runId);
		if (evt.state === "delta") {
			setActivityStatus("streaming");
			if (state.activeChatRunId === evt.runId) armStreamingWatchdog(evt.runId);
			const displayText = streamAssembler.ingestDelta(evt.runId, evt.message, state.showThinking);
			if (!displayText) return;
			chatLog.updateAssistant(displayText, evt.runId);
		}
		if (evt.state === "final") {
			const isLocalBtwRunLocal = isLocalBtwRunId?.(evt.runId) ?? false;
			const wasActiveRun = state.activeChatRunId === evt.runId;
			if (!evt.message && isLocalBtwRunLocal) {
				forgetLocalBtwRunId?.(evt.runId);
				runCoordinator.noteFinalizedRun(evt.runId);
				clearStaleStreamingIfNoTrackedRunRemains();
				tui.requestRender(true);
				return;
			}
			if (!evt.message) {
				maybeRefreshHistoryForRun(evt.runId, {
					allowLocalWithoutDisplayableFinal: true,
					wasPendingChatRun: isPendingChatRun
				});
				chatLog.dropAssistant(evt.runId);
				finalizeRun({
					runId: evt.runId,
					wasActiveRun,
					status: "idle"
				});
				tui.requestRender(true);
				return;
			}
			if (isCommandMarkedMessage(evt.message)) {
				maybeRefreshHistoryForRun(evt.runId, { wasPendingChatRun: isPendingChatRun });
				const text = extractTextFromMessage(evt.message);
				if (text) chatLog.addSystem(text);
				finalizeRun({
					runId: evt.runId,
					wasActiveRun,
					status: "idle",
					displayedFinal: true
				});
				tui.requestRender(true);
				return;
			}
			const terminalStopReason = state.sessionProjection.runs[evt.runId]?.stopReason;
			const hasStreamedText = streamAssembler.hasDisplayText(evt.runId);
			const finalText = streamAssembler.finalize(evt.runId, evt.message, state.showThinking, evt.errorMessage);
			const suppressEmptyExternalPlaceholder = finalText === "(no output)" && !isLocalRunId?.(evt.runId);
			if (!suppressEmptyExternalPlaceholder) projectTuiSessionFinal(state, evt, finalText, hasStreamedText);
			maybeRefreshHistoryForRun(evt.runId, {
				hasDisplayableFinal: !suppressEmptyExternalPlaceholder,
				wasPendingChatRun: isPendingChatRun
			});
			if (suppressEmptyExternalPlaceholder) chatLog.dropAssistant(evt.runId);
			else chatLog.finalizeAssistant(finalText, evt.runId);
			finalizeRun({
				runId: evt.runId,
				wasActiveRun,
				status: terminalStopReason === "error" ? "error" : "idle",
				displayedFinal: !suppressEmptyExternalPlaceholder
			});
		}
		if (evt.state === "aborted") {
			forgetLocalBtwRunId?.(evt.runId);
			const wasActiveRun = state.activeChatRunId === evt.runId;
			const hasDisplayableAbortedText = Boolean(extractTuiAbortedText(evt.message, state.showThinking).trim()) || streamAssembler.hasDisplayText(evt.runId);
			const abortedText = streamAssembler.finalize(evt.runId, evt.message, state.showThinking);
			if (hasDisplayableAbortedText) chatLog.finalizeAssistant(abortedText, evt.runId);
			const diagnostic = formatTuiAbortDiagnostic(evt.errorMessage);
			chatLog.addSystem(diagnostic ? `run aborted: ${diagnostic}` : "run aborted");
			terminateRun({
				runId: evt.runId,
				wasActiveRun,
				status: "aborted"
			});
			maybeRefreshHistoryForRun(evt.runId, { hasDisplayableFinal: hasDisplayableAbortedText });
		}
		if (evt.state === "error") {
			forgetLocalBtwRunId?.(evt.runId);
			renderTerminalRunError({
				runId: evt.runId,
				errorMessage: evt.errorMessage ?? "unknown"
			});
		}
		tui.requestRender();
	};
	const collectTrackedSessionRunIds = () => {
		const runIds = new Set(sessionRuns.keys());
		if (state.activeChatRunId) runIds.add(state.activeChatRunId);
		const pendingRunId = getPendingSubmitAcceptedRunId(state);
		if (pendingRunId) runIds.add(pendingRunId);
		const finalizedRunIds = new Set(finalizedRuns.keys());
		const displayedRunIds = new Set(finalizedRunsWithDisplay.keys());
		for (const runId of finalizedRunIds) runIds.add(runId);
		return {
			runIds,
			finalizedRunIds,
			displayedRunIds
		};
	};
	const handleSessionsChangedEvent = (payload) => {
		if (!payload || typeof payload !== "object") return;
		const evt = payload;
		syncSessionKey();
		if (!matchesSelectedTuiSession(state, evt)) return;
		if (evt.phase === "message") {
			const matchesCurrentSessionId = typeof evt.sessionId !== "string" || !state.currentSessionId || evt.sessionId === state.currentSessionId;
			if (!matchesSelectedTuiSession(state, evt, { requireAliasOwnership: true }) || !matchesCurrentSessionId || !isIdentityOnlyTuiSessionInvalidation(evt)) return;
			runCoordinator.queueHistoryReload();
			return;
		}
		const persistedRunId = evt.clientRunId || evt.runId;
		if (persistedRunId && (evt.phase === "end" || evt.phase === "error")) {
			runCoordinator.notePersistedRun(persistedRunId);
			if (pendingNewSessionRunIds.delete(persistedRunId)) if (evt.phase === "end") {
				const displayedRunIds = finalizedRunsWithDisplay.has(persistedRunId) ? [persistedRunId] : [];
				runCoordinator.queueHistoryReload([persistedRunId], [persistedRunId], displayedRunIds);
			} else refreshSessionInfo?.();
			flushPendingHistoryRefreshIfIdle();
			return;
		}
		if (evt.reason !== "new" && evt.reason !== "reset") return;
		const nextSessionId = typeof evt.sessionId === "string" ? evt.sessionId : null;
		const replacesKnownSession = state.currentSessionId !== null && nextSessionId !== null && state.currentSessionId !== nextSessionId;
		if (evt.reason === "new" && !replacesKnownSession) {
			const { runIds, displayedRunIds } = collectTrackedSessionRunIds();
			if (runIds.size > 0) {
				if (nextSessionId) state.currentSessionId = nextSessionId;
				if (typeof evt.updatedAt === "number" || evt.updatedAt === null) state.sessionInfo.updatedAt = evt.updatedAt;
				const persistedRunIds = [];
				for (const runId of runIds) if (persistedTerminalRunIds.has(runId)) persistedRunIds.push(runId);
				else pendingNewSessionRunIds.add(runId);
				runCoordinator.queueHistoryReload(persistedRunIds, persistedRunIds, displayedRunIds);
				tui.requestRender();
				return;
			}
		}
		const { runIds: reloadingRunIds, finalizedRunIds, displayedRunIds } = collectTrackedSessionRunIds();
		state.sessionGeneration = (state.sessionGeneration ?? 0) + 1;
		reduceTuiSessionProjection(state, {
			type: "sessionReset",
			scope: readTuiSessionProjectionScope(state)
		});
		clearTrackedRunState();
		state.activeChatRunId = null;
		state.activityStatus = "idle";
		setActivityStatus("idle");
		if (nextSessionId) state.currentSessionId = nextSessionId;
		if (typeof evt.updatedAt === "number" || evt.updatedAt === null) state.sessionInfo.updatedAt = evt.updatedAt;
		getTuiSessionProjection(state);
		if (reloadingRunIds.size > 0) runCoordinator.queueHistoryReload(reloadingRunIds, finalizedRunIds, displayedRunIds);
		else runCoordinator.queueHistoryReload();
		tui.requestRender();
	};
	const handleSessionMessageEvent = (payload) => {
		if (!payload || typeof payload !== "object") return;
		const evt = payload;
		syncSessionKey();
		if (!matchesSelectedTuiSession(state, evt, { requireAliasOwnership: true })) return;
		const unboundDisplayedRunIds = [...finalizedRunsWithDisplay.keys()].filter((runId) => !persistedTerminalRunIds.has(runId));
		const authoritativeRunId = projectTuiSessionMessage(state, evt, unboundDisplayedRunIds);
		if (authoritativeRunId) runCoordinator.notePersistedRun(authoritativeRunId);
		const liveUserMessage = readTuiSessionUserMessage(evt);
		if (liveUserMessage) {
			chatLog.addLiveUser(liveUserMessage.text, {
				messageId: liveUserMessage.messageId,
				...liveUserMessage.runId ? { runId: liveUserMessage.runId } : {}
			});
			tui.requestRender();
		}
		const currentUpdatedAt = state.sessionInfo.updatedAt;
		if (!(typeof evt.updatedAt === "number" && typeof currentUpdatedAt === "number" && evt.updatedAt < currentUpdatedAt)) {
			if (typeof evt.sessionId === "string") {
				state.currentSessionId = evt.sessionId;
				getTuiSessionProjection(state);
			}
			if (typeof evt.updatedAt === "number" || evt.updatedAt === null) state.sessionInfo.updatedAt = evt.updatedAt;
		}
		if (runCoordinator.routeSessionMessageRefresh(Boolean(liveUserMessage || authoritativeRunId))) refreshSessionInfo?.();
	};
	const handleAgentEvent = (payload) => {
		if (!payload || typeof payload !== "object") return;
		const evt = payload;
		syncSessionKey();
		const isUntrackedRun = evt.runId !== state.activeChatRunId && evt.runId !== getPendingSubmitAcceptedRunId(state) && !sessionRuns.has(evt.runId) && !finalizedRuns.has(evt.runId);
		if (evt.stream === "lifecycle" && formatPrimitiveString(evt.data?.phase, "") === "start" && !finalizedRuns.has(evt.runId) && !(isLocalBtwRunId?.(evt.runId) ?? false) && matchesSelectedTuiSession(state, evt)) {
			runCoordinator.noteSessionRun(evt.runId, { protectStream: true });
			if (isUntrackedRun && !state.activeChatRunId) state.activeChatRunId = evt.runId;
		}
		const isActiveRun = evt.runId === state.activeChatRunId;
		const isPendingRun = evt.runId === getPendingSubmitAcceptedRunId(state);
		const isSessionRun = sessionRuns.has(evt.runId);
		if ((isActiveRun || isPendingRun || isSessionRun) && applyFallbackStepModelUpdate(evt)) {
			if (isActiveRun) armStreamingWatchdog(evt.runId);
			tui.requestRender();
			return;
		}
		if (!(isActiveRun || isPendingRun || isSessionRun || finalizedRuns.has(evt.runId))) return;
		if (evt.stream === "tool") {
			if (isActiveRun) armStreamingWatchdog(evt.runId);
			const verbose = state.sessionInfo.verboseLevel ?? "off";
			const allowToolEvents = verbose !== "off";
			const allowToolOutput = verbose === "full";
			if (!allowToolEvents) return;
			const data = evt.data ?? {};
			const phase = formatPrimitiveString(data.phase, "");
			const toolCallId = formatPrimitiveString(data.toolCallId, "");
			const toolName = formatPrimitiveString(data.name, "tool");
			if (!toolCallId) return;
			if (phase === "start") chatLog.startTool(toolCallId, toolName, data.args, evt.runId);
			else if (phase === "update") {
				if (!allowToolOutput) return;
				chatLog.updateToolResult(toolCallId, data.partialResult, { partial: true });
			} else if (phase === "result") if (allowToolOutput) chatLog.updateToolResult(toolCallId, data.result, { isError: Boolean(data.isError) });
			else chatLog.updateToolResult(toolCallId, { content: [] }, { isError: Boolean(data.isError) });
			tui.requestRender();
			return;
		}
		if (evt.stream === "lifecycle") {
			if (isPendingRun) {
				runCoordinator.noteSessionRun(evt.runId, { protectStream: true });
				markSubmittedRunRegistered(evt.runId);
				state.activeChatRunId = evt.runId;
				noteLocalRunId?.(evt.runId);
				clearPendingSubmit(state, evt.runId);
			}
			const phase = typeof evt.data?.phase === "string" ? evt.data.phase : "";
			if (phase && phase !== "error") clearPendingTerminalLifecycleError(evt.runId);
			const isPostFinalTerminalPhase = postFinalizingRuns.has(evt.runId) && (phase === "end" || phase === "error");
			if (!isActiveRun && !isPendingRun && phase !== "finishing" && !isPostFinalTerminalPhase) return;
			const canUpdateActivityStatus = !hasConcurrentActiveRun(evt.runId);
			if (phase && phase !== "end" && phase !== "error" && phase !== "finishing") armStreamingWatchdog(evt.runId);
			if (phase === "start") {
				if (!canUpdateActivityStatus) return;
				setActivityStatus("running");
			}
			if (phase === "finishing") {
				runCoordinator.notePostFinalizingRun(evt.runId);
				if (!canUpdateActivityStatus) return;
				clearStreamingWatchdog();
				setActivityStatus("finishing context");
			}
			let forceRender = phase === "end";
			if (phase === "end") {
				postFinalizingRuns.delete(evt.runId);
				if (!canUpdateActivityStatus) return;
				if (!localMode || !isLocalRunId?.(evt.runId) || finalizedRuns.has(evt.runId)) setActivityStatus("idle");
			}
			if (phase === "error") {
				postFinalizingRuns.delete(evt.runId);
				if (!canUpdateActivityStatus) return;
				if (typeof evt.data?.endedAt === "number" && (isActiveRun || isPendingRun)) {
					const errorMessage = typeof evt.data?.error === "string" ? evt.data.error : typeof evt.data?.errorMessage === "string" ? evt.data.errorMessage : "unknown";
					scheduleTerminalLifecycleError(evt.runId, errorMessage);
				}
				setActivityStatus("error");
				forceRender = true;
			}
			tui.requestRender(forceRender);
		}
	};
	const handleBtwEvent = (payload) => {
		if (!payload || typeof payload !== "object") return;
		const evt = payload;
		syncSessionKey();
		if (!matchesSelectedTuiSession(state, evt)) return;
		if (evt.kind !== "btw") return;
		const question = evt.question.trim();
		const text = evt.text.trim();
		if (!question || !text) return;
		btw.showResult({
			question,
			text,
			isError: evt.isError
		});
		tui.requestRender();
	};
	const isRunObserved = (runId) => sessionRuns.has(runId);
	const reconcileHistoryAfterGap = () => {
		reduceTuiSessionProjection(state, {
			type: "transportGap",
			scope: readTuiSessionProjectionScope(state)
		});
		const { runIds, displayedRunIds } = collectTrackedSessionRunIds();
		if (runIds.size === 0) {
			runCoordinator.queueHistoryReload();
			return;
		}
		runCoordinator.queueGapHistoryReload(runIds, displayedRunIds);
	};
	return {
		handleChatEvent,
		handleAgentEvent,
		handleBtwEvent,
		handleSessionsChangedEvent,
		handleSessionMessageEvent,
		pauseStreamingWatchdog,
		reconnectStreamingWatchdog,
		consumeCompletedRunForPendingSend: (runId) => completedRuns.delete(runId),
		isRunObserved,
		reconcileHistoryAfterGap,
		flushPendingHistoryRefreshIfIdle,
		dispose
	};
}
//#endregion
//#region src/tui/tui-local-shell.ts
function createLocalShellRunner(deps) {
	let localExecAsked = false;
	let localExecAllowed = false;
	const createSelector = deps.createSelector ?? createSearchableSelectList;
	const spawnCommand = deps.spawnCommand ?? spawn;
	const getCwd = deps.getCwd ?? tryProcessCwd;
	const env = deps.env ?? process.env;
	const maxChars = deps.maxOutputChars ?? 4e4;
	const ensureLocalExecAllowed = async () => {
		if (localExecAllowed) return true;
		if (localExecAsked) return false;
		localExecAsked = true;
		return await new Promise((resolve) => {
			deps.chatLog.addSystem("Allow local shell commands for this session?");
			deps.chatLog.addSystem("This runs commands on YOUR machine (not the gateway) and may delete files or reveal secrets.");
			deps.chatLog.addSystem("Select Yes/No (arrows + Enter), Esc to cancel.");
			const selector = createSelector([{
				value: "no",
				label: "No"
			}, {
				value: "yes",
				label: "Yes"
			}], 2);
			selector.onSelect = (item) => {
				deps.closeOverlay(overlayHandle);
				if (item.value === "yes") {
					localExecAllowed = true;
					deps.chatLog.addSystem("local shell: enabled for this session");
					resolve(true);
				} else {
					deps.chatLog.addSystem("local shell: not enabled");
					resolve(false);
				}
				deps.tui.requestRender();
			};
			selector.onCancel = () => {
				deps.closeOverlay(overlayHandle);
				deps.chatLog.addSystem("local shell: cancelled");
				deps.tui.requestRender();
				resolve(false);
			};
			const overlayHandle = deps.openOverlay(selector);
			deps.tui.requestRender();
		});
	};
	const runLocalShellLine = async (line) => {
		const cmd = line.slice(1);
		if (cmd === "") return;
		if (localExecAsked && !localExecAllowed) {
			deps.chatLog.addSystem("local shell: not enabled for this session");
			deps.tui.requestRender();
			return;
		}
		if (!await ensureLocalExecAllowed()) return;
		const cwd = getCwd();
		if (!cwd) {
			deps.chatLog.addSystem("local shell: working directory was deleted; cd to an existing directory first");
			deps.tui.requestRender();
			return;
		}
		deps.chatLog.addSystem(`[local] $ ${cmd}`);
		deps.tui.requestRender();
		const appendWithCap = (text, chunk) => {
			const combined = text + chunk;
			return combined.length > maxChars ? sliceUtf16Safe(combined, -maxChars) : combined;
		};
		await new Promise((resolve) => {
			const child = spawnCommand(cmd, {
				shell: true,
				cwd,
				env: {
					...env,
					OPENCLAW_SHELL: "tui-local"
				}
			});
			let stdout = "";
			let stderr = "";
			let error;
			const stdoutDecoder = new StringDecoder("utf8");
			const stderrDecoder = new StringDecoder("utf8");
			const ignoreOutputStreamError = () => {};
			child.stdout.on("error", ignoreOutputStreamError);
			child.stderr.on("error", ignoreOutputStreamError);
			child.stdout.on("data", (buf) => {
				stdout = appendWithCap(stdout, stdoutDecoder.write(buf));
			});
			child.stderr.on("data", (buf) => {
				stderr = appendWithCap(stderr, stderrDecoder.write(buf));
			});
			child.on("close", (code, signal) => {
				stdout = appendWithCap(stdout, stdoutDecoder.end());
				stderr = appendWithCap(stderr, stderrDecoder.end());
				const combined = sliceUtf16Safe(stdout + (stderr ? (stdout ? "\n" : "") + stderr : ""), -maxChars).trimEnd();
				if (combined) for (const lineLocal of combined.split("\n")) deps.chatLog.addSystem(`[local] ${lineLocal}`);
				const status = error ? `error: ${formatTuiErrorMessage(error)}` : `exit ${code ?? "?"}`;
				deps.chatLog.addSystem(`[local] ${status}${signal ? ` (signal ${signal})` : ""}`);
				deps.tui.requestRender();
				resolve();
			});
			child.on("error", (err) => {
				error = err;
			});
		});
	};
	return { runLocalShellLine };
}
//#endregion
//#region src/tui/tui-overlays.ts
/** Creates open/close handlers that restore focus when no overlay is active. */
function createOverlayHandlers(host, fallbackFocus) {
	const openOverlay = (component) => {
		return host.showOverlay(component);
	};
	const closeOverlay = (handle) => {
		if (handle) {
			handle.hide();
			if (!host.hasOverlay()) host.setFocus(fallbackFocus);
			return;
		}
		if (host.hasOverlay()) {
			host.hideOverlay();
			return;
		}
		host.setFocus(fallbackFocus);
	};
	return {
		openOverlay,
		closeOverlay
	};
}
//#endregion
//#region src/tui/coalesced-refresh.ts
/** Keeps refresh bursts to one active lookup plus one latest-state rerun. */
function createTuiRefreshCoalescer(refresh, afterDrain) {
	let active;
	let rerunRequested = false;
	const requestRerun = () => {
		rerunRequested = true;
	};
	return {
		isRunning: () => active !== void 0,
		async run() {
			if (active) {
				requestRerun();
				return await active;
			}
			const current = (async () => {
				do {
					rerunRequested = false;
					if (await refresh(requestRerun) === false) return;
				} while (rerunRequested);
				afterDrain?.();
			})();
			active = current;
			try {
				await current;
			} finally {
				if (active === current) active = void 0;
			}
		}
	};
}
//#endregion
//#region src/tui/tui-plugin-approvals.ts
const APPROVAL_BIDI_CONTROL_RE = /[\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]/g;
function sanitizeApprovalText(text) {
	return sanitizeRenderableText(text.replace(APPROVAL_BIDI_CONTROL_RE, "").replace(/\s+/g, " ").trim());
}
var PluginApprovalPrompt = class {
	constructor(surfaceLabel, approval, selector) {
		this.selector = selector;
		this.confirmation = new Text();
		const title = sanitizeApprovalText(approval.request.title);
		const description = sanitizeApprovalText(approval.request.description ?? "");
		const severity = approval.request.severity ?? "warning";
		const metadata = [
			`Severity: ${severity === "critical" ? "Critical" : severity === "info" ? "Info" : "Warning"}`,
			...approval.request.toolName ? [`Tool: ${sanitizeApprovalText(approval.request.toolName)}`] : [],
			...approval.request.pluginId ? [`Plugin: ${sanitizeApprovalText(approval.request.pluginId)}`] : []
		];
		this.title = new Text(tuiTheme.header(`${surfaceLabel}: ${title}`));
		this.metadata = new Text(tuiTheme.dim(metadata.join("\n")));
		this.description = new Text(tuiTheme.system(description ? `Request: ${description}` : ""));
	}
	setConfirmation(text) {
		this.confirmation.setText(tuiTheme.accent(text));
	}
	invalidate() {
		this.title.invalidate();
		this.metadata.invalidate();
		this.description.invalidate();
		this.confirmation.invalidate();
		this.selector.invalidate();
	}
	render(width) {
		const description = this.description.render(width);
		const confirmation = this.confirmation.render(width);
		return [
			...this.title.render(width),
			...this.metadata.render(width),
			...description.some((line) => line.trim()) ? description : [],
			...confirmation.some((line) => line.trim()) ? ["", ...confirmation] : [],
			"",
			...this.selector.render(width)
		];
	}
	handleInput(data) {
		this.selector.handleInput?.(data);
	}
};
const DEFAULT_DECISIONS = [
	"allow-once",
	"allow-always",
	"deny"
];
const DECISION_ITEMS = {
	"allow-once": {
		value: "allow-once",
		label: "Allow once",
		description: "Approve this change"
	},
	"allow-always": {
		value: "allow-always",
		label: "Always allow",
		description: "Approve matching future changes"
	},
	deny: {
		value: "deny",
		label: "Deny",
		description: "Do not apply this change"
	}
};
function parseDecision(value) {
	return value === "allow-once" || value === "allow-always" || value === "deny" ? value : null;
}
function parseAllowedDecisions(value) {
	if (!Array.isArray(value)) return;
	const decisions = [];
	for (const candidate of value) {
		const decision = parseDecision(candidate);
		if (decision && !decisions.includes(decision)) decisions.push(decision);
	}
	return decisions.length > 0 ? decisions : void 0;
}
function parseSeverity(value) {
	return value === "info" || value === "warning" || value === "critical" ? value : null;
}
/** Parses the gateway event/list shape used for pending plugin approvals. */
function parseTuiPluginApproval(payload) {
	const record = asOptionalObjectRecord(payload);
	const request = asOptionalObjectRecord(record?.request);
	if (!record || !request) return null;
	const id = typeof record.id === "string" ? record.id.trim() : "";
	const title = typeof request.title === "string" ? request.title.trim() : "";
	const createdAtMs = typeof record.createdAtMs === "number" ? record.createdAtMs : 0;
	const expiresAtMs = typeof record.expiresAtMs === "number" ? record.expiresAtMs : 0;
	if (!id || !title || !createdAtMs || !expiresAtMs) return null;
	return {
		id,
		request: {
			title,
			description: typeof request.description === "string" ? request.description : null,
			pluginId: typeof request.pluginId === "string" ? request.pluginId : null,
			severity: parseSeverity(request.severity),
			toolName: typeof request.toolName === "string" ? request.toolName : null,
			allowedDecisions: parseAllowedDecisions(request.allowedDecisions),
			agentId: typeof request.agentId === "string" ? request.agentId : null,
			sessionKey: typeof request.sessionKey === "string" ? request.sessionKey : null
		},
		createdAtMs,
		expiresAtMs
	};
}
function parseResolvedApprovalId(payload) {
	const id = asOptionalObjectRecord(payload)?.id;
	if (typeof id !== "string") return null;
	return id.trim() || null;
}
function decisionLabel(decision) {
	if (decision === "allow-once") return "allowed once";
	if (decision === "allow-always") return "always allowed";
	return "denied";
}
function approvalSurfaceLabel(approval) {
	return approval.request.toolName === "skill_workshop" ? "workspace skill approval" : "plugin approval";
}
/** Coordinates pending plugin approval events with the active TUI overlay. */
function createTuiPluginApprovalController(deps) {
	const createSelector = deps.createSelector ?? ((items) => new SelectList(items, items.length, selectListTheme));
	const nowMs = deps.nowMs ?? Date.now;
	const setTimeoutFn = deps.setTimeoutFn ?? setTimeout;
	const clearTimeoutFn = deps.clearTimeoutFn ?? clearTimeout;
	let queue = [];
	let activeId = null;
	let activeOverlay = null;
	let expiryTimer = null;
	let disposed = false;
	let mutationVersion = 0;
	const refreshRunner = createTuiRefreshCoalescer(async () => await refreshOnce());
	const mutations = /* @__PURE__ */ new Map();
	const resolvingIds = /* @__PURE__ */ new Set();
	const dismissedIds = /* @__PURE__ */ new Set();
	const clearExpiryTimer = () => {
		if (expiryTimer !== null) {
			clearTimeoutFn(expiryTimer);
			expiryTimer = null;
		}
	};
	const closeActiveOverlay = () => {
		const handle = activeOverlay;
		activeOverlay = null;
		if (handle) deps.closeOverlay(handle);
	};
	const recordMutation = (id, approval) => {
		if (!refreshRunner.isRunning()) return;
		mutationVersion += 1;
		mutations.set(id, {
			version: mutationVersion,
			approval
		});
	};
	const remove = (id, record = true) => {
		queue = queue.filter((approval) => approval.id !== id);
		dismissedIds.delete(id);
		if (record) recordMutation(id, null);
	};
	const add = (approval, record = true) => {
		queue = queue.filter((entry) => entry.id !== approval.id);
		queue.push(approval);
		queue.sort((left, right) => left.createdAtMs - right.createdAtMs);
		if (record) recordMutation(approval.id, approval);
	};
	const matchesActiveSession = (approval) => {
		const sessionKey = approval.request.sessionKey?.trim();
		if (!sessionKey || sessionKey !== deps.getSessionKey()) return false;
		if (sessionKey !== "global") return true;
		const agentId = approval.request.agentId?.trim();
		return Boolean(agentId && agentId === deps.getAgentId());
	};
	const prune = () => {
		const now = nowMs();
		for (const approval of queue.filter((entry) => entry.expiresAtMs <= now)) remove(approval.id);
	};
	const presentNext = () => {
		if (disposed || activeId) return;
		prune();
		const approval = queue.find((candidate) => !resolvingIds.has(candidate.id) && !dismissedIds.has(candidate.id) && matchesActiveSession(candidate));
		if (!approval) return;
		activeId = approval.id;
		const surfaceLabel = approvalSurfaceLabel(approval);
		const decisions = approval.request.allowedDecisions ?? DEFAULT_DECISIONS;
		const selector = createSelector(decisions.map((decision) => DECISION_ITEMS[decision]));
		let allowDecisionArmed = false;
		let prompt = null;
		const denyIndex = decisions.indexOf("deny");
		let selectedDecision = denyIndex >= 0 ? decisions[denyIndex] : decisions[0];
		if (denyIndex >= 0) selector.setSelectedIndex?.(denyIndex);
		selector.onSelectionChange = (item) => {
			const decision = parseDecision(item.value);
			if (!decision || decision === selectedDecision) return;
			selectedDecision = decision;
			allowDecisionArmed = decision !== "deny";
			prompt?.setConfirmation("");
		};
		const resolve = async (decision) => {
			if (activeId !== approval.id) return;
			clearExpiryTimer();
			activeId = null;
			resolvingIds.add(approval.id);
			closeActiveOverlay();
			deps.requestRender();
			let stale = false;
			try {
				if (!deps.client.resolvePluginApproval) throw new Error("plugin approval resolution is unavailable");
				if ((await deps.client.resolvePluginApproval(approval.id, decision))?.ok === false) stale = true;
				else {
					remove(approval.id);
					deps.chatLog.addSystem(`${surfaceLabel}: ${decisionLabel(decision)}`);
				}
			} catch (error) {
				if (isApprovalStaleError(error)) stale = true;
				else deps.chatLog.addSystem(`${surfaceLabel} failed: ${formatErrorMessage(error)}`);
			}
			if (stale) {
				remove(approval.id);
				deps.chatLog.addSystem(`${surfaceLabel}: no longer pending`);
				try {
					await refreshApprovals();
				} catch (error) {
					deps.chatLog.addSystem(`${surfaceLabel} refresh failed: ${formatErrorMessage(error)}`);
				}
			}
			resolvingIds.delete(approval.id);
			presentNext();
			if (!disposed) deps.requestRender();
		};
		selector.onSelect = (item) => {
			const decision = parseDecision(item.value);
			if (!decision) return;
			if (decision !== "deny" && !allowDecisionArmed) {
				allowDecisionArmed = true;
				prompt?.setConfirmation(`Press Enter again to confirm ${item.label}.`);
				deps.requestRender();
				return;
			}
			resolve(decision);
		};
		selector.onCancel = () => {
			const deny = decisions.includes("deny") ? "deny" : null;
			if (deny) {
				resolve(deny);
				return;
			}
			clearExpiryTimer();
			dismissedIds.add(approval.id);
			activeId = null;
			closeActiveOverlay();
			deps.chatLog.addSystem(`${surfaceLabel}: dismissed; request remains pending`);
			presentNext();
			deps.requestRender();
		};
		const timer = setTimeoutFn(() => {
			if (activeId !== approval.id) return;
			expiryTimer = null;
			activeId = null;
			remove(approval.id);
			closeActiveOverlay();
			deps.chatLog.addSystem(`${surfaceLabel}: expired`);
			presentNext();
			deps.requestRender();
		}, Math.max(1, approval.expiresAtMs - nowMs()));
		expiryTimer = timer;
		if (typeof timer !== "number") timer.unref?.();
		prompt = new PluginApprovalPrompt(surfaceLabel, approval, selector);
		activeOverlay = deps.openOverlay(prompt);
		deps.requestRender();
	};
	const applySnapshot = (approvals, startedAtVersion) => {
		const next = new Map(approvals.map((approval) => [approval.id, approval]));
		for (const [id, mutation] of mutations) {
			if (mutation.version <= startedAtVersion) {
				mutations.delete(id);
				continue;
			}
			if (mutation.approval) next.set(id, mutation.approval);
			else next.delete(id);
		}
		for (const id of dismissedIds) if (!next.has(id)) dismissedIds.delete(id);
		queue = [...next.values()].toSorted((left, right) => left.createdAtMs - right.createdAtMs);
	};
	async function refreshOnce() {
		if (disposed || !deps.client.listPluginApprovals) return;
		const startedAtVersion = mutationVersion;
		const payload = await deps.client.listPluginApprovals();
		if (disposed || !Array.isArray(payload)) return;
		const approvals = [];
		for (const entry of payload) {
			const approval = parseTuiPluginApproval(entry);
			if (approval) approvals.push(approval);
		}
		applySnapshot(approvals, startedAtVersion);
		if (activeId && !queue.some((approval) => approval.id === activeId)) {
			clearExpiryTimer();
			activeId = null;
			closeActiveOverlay();
		}
		presentNext();
		deps.requestRender();
	}
	const refreshApprovals = async () => {
		if (disposed || !deps.client.listPluginApprovals) return;
		await refreshRunner.run();
	};
	return {
		handleEvent(event, payload) {
			if (disposed) return;
			if (event === "plugin.approval.requested") {
				const approval = parseTuiPluginApproval(payload);
				if (approval) {
					add(approval);
					presentNext();
				}
				return;
			}
			if (event !== "plugin.approval.resolved" && event !== "plugin.approval.removed") return;
			const id = parseResolvedApprovalId(payload);
			if (!id) return;
			remove(id);
			resolvingIds.delete(id);
			if (activeId === id) {
				clearExpiryTimer();
				activeId = null;
				closeActiveOverlay();
			}
			presentNext();
			deps.requestRender();
		},
		refresh: refreshApprovals,
		sessionChanged() {
			if (disposed) return;
			const activeApproval = activeId ? queue.find((approval) => approval.id === activeId) : void 0;
			if (activeApproval && !matchesActiveSession(activeApproval)) {
				clearExpiryTimer();
				activeId = null;
				closeActiveOverlay();
				deps.requestRender();
			}
			presentNext();
		},
		dispose() {
			if (disposed) return;
			disposed = true;
			clearExpiryTimer();
			queue = [];
			dismissedIds.clear();
			mutations.clear();
			resolvingIds.clear();
			if (activeId) {
				activeId = null;
				closeActiveOverlay();
				deps.requestRender();
			}
		}
	};
}
//#endregion
//#region src/tui/tui-agent-list-refresh.ts
/** Refresh an authoritative agent roster without discarding the last good snapshot on failure. */
async function refreshTuiAgentList(params) {
	try {
		params.apply(await params.load());
		return ok(void 0);
	} catch (error) {
		const message = formatTuiErrorMessage(error);
		params.reportError(message);
		return err(message);
	}
}
//#endregion
//#region src/tui/tui-session-info.ts
/** Compare only session facts that change visible TUI behavior. */
function sessionInfoUiEquals(left, right) {
	return left.thinkingLevel === right.thinkingLevel && (left.thinkingLevels === right.thinkingLevels || JSON.stringify(left.thinkingLevels ?? null) === JSON.stringify(right.thinkingLevels ?? null)) && left.fastMode === right.fastMode && left.verboseLevel === right.verboseLevel && left.traceLevel === right.traceLevel && left.reasoningLevel === right.reasoningLevel && left.model === right.model && left.modelProvider === right.modelProvider && left.agentRuntime?.id === right.agentRuntime?.id && left.agentRuntime?.source === right.agentRuntime?.source && left.agentRuntime?.fallback === right.agentRuntime?.fallback && left.contextTokens === right.contextTokens && left.inputTokens === right.inputTokens && left.outputTokens === right.outputTokens && left.totalTokens === right.totalTokens && left.responseUsage === right.responseUsage && left.effectiveResponseUsage === right.effectiveResponseUsage && left.displayName === right.displayName && (left.goal === right.goal || JSON.stringify(left.goal ?? null) === JSON.stringify(right.goal ?? null));
}
/** Clear selection-owned modes so a switch cannot display its predecessor while loading. */
function clearTuiSessionModeOverrides(sessionInfo) {
	sessionInfo.fastMode = void 0;
	sessionInfo.verboseLevel = void 0;
	sessionInfo.traceLevel = void 0;
	sessionInfo.reasoningLevel = void 0;
}
//#endregion
//#region src/tui/tui-session-actions.ts
function createSessionActions(context) {
	const { client, chatLog, btw, tui, opts, state, agentNames, initialSessionInput, initialSessionAgentId, resolveSessionSelection, updateHeader, updateFooter, updateAutocompleteProvider, setActivityStatus, invalidateRunOwnership, clearLocalRunIds, rememberSessionKey } = context;
	let historyLoadGeneration = 0;
	let lastSessionDefaults = null;
	const captureSessionSelection = () => ({
		sessionKey: state.currentSessionKey,
		agentId: state.currentAgentId
	});
	const isCurrentSessionSelection = (selection) => state.currentAgentId === selection.agentId && agentSessionKeysMatchByRequestKey(state.currentSessionKey, selection.sessionKey);
	const isCurrentSessionMutation = (result) => {
		if (!result.key) return true;
		const parsed = parseAgentSessionKey(result.key);
		return isCurrentSessionSelection({
			sessionKey: result.key,
			agentId: parsed ? normalizeAgentId(parsed.agentId) : state.currentAgentId
		});
	};
	const applyAgentsResult = (result) => {
		state.agentDefaultId = normalizeAgentId(result.defaultId);
		state.sessionMainKey = normalizeMainKey(result.mainKey);
		state.sessionScope = result.scope ?? state.sessionScope;
		state.agents = result.agents.map((agent) => ({
			id: normalizeAgentId(agent.id),
			kind: agent.kind,
			name: normalizeOptionalString(agent.name)
		}));
		agentNames.clear();
		for (const agent of state.agents) if (agent.name) agentNames.set(agent.id, agent.name);
		if (!state.initialSessionApplied) {
			if (initialSessionAgentId) {
				if (state.agents.some((agent) => agent.id === initialSessionAgentId)) state.currentAgentId = initialSessionAgentId;
			} else if (!state.agents.some((agent) => agent.id === state.currentAgentId)) state.currentAgentId = state.agents[0]?.id ?? normalizeAgentId(result.defaultId ?? state.currentAgentId);
			const nextSelection = resolveSessionSelection(initialSessionInput);
			state.currentAgentId = nextSelection.agentId;
			if (nextSelection.key !== state.currentSessionKey) state.currentSessionKey = nextSelection.key;
			state.initialSessionApplied = true;
		} else if (!state.agents.some((agent) => agent.id === state.currentAgentId)) state.currentAgentId = state.agents[0]?.id ?? normalizeAgentId(result.defaultId ?? state.currentAgentId);
		updateHeader();
		updateFooter();
	};
	const refreshAgents = () => refreshTuiAgentList({
		load: () => client.listAgents(),
		apply: applyAgentsResult,
		reportError: (message) => chatLog.addSystem(`agents list failed: ${message}`)
	});
	const updateAgentFromSessionKey = (key) => {
		const parsed = parseAgentSessionKey(key);
		if (!parsed) return;
		const next = normalizeAgentId(parsed.agentId);
		if (next !== state.currentAgentId) state.currentAgentId = next;
	};
	const resolveModelSelection = (entry) => {
		return resolveSessionInfoModelSelection({
			currentProvider: state.sessionInfo.modelProvider,
			currentModel: state.sessionInfo.model,
			defaultProvider: lastSessionDefaults?.modelProvider,
			defaultModel: lastSessionDefaults?.model,
			entryProvider: entry?.modelProvider,
			entryModel: entry?.model,
			overrideProvider: entry?.providerOverride,
			overrideModel: entry?.modelOverride
		});
	};
	const applySessionInfo = (params) => {
		const hasEntryUpdate = "entry" in params;
		const entry = params.entry ?? void 0;
		const defaults = params.defaults ?? lastSessionDefaults ?? void 0;
		const previousDefaults = lastSessionDefaults;
		const defaultsChanged = params.defaults ? previousDefaults?.model !== params.defaults.model || previousDefaults?.modelProvider !== params.defaults.modelProvider || previousDefaults?.contextTokens !== params.defaults.contextTokens : false;
		if (params.defaults) lastSessionDefaults = params.defaults;
		const entryUpdatedAt = entry?.updatedAt ?? null;
		const currentUpdatedAt = state.sessionInfo.updatedAt ?? null;
		if (!params.force && entryUpdatedAt !== null && currentUpdatedAt !== null && entryUpdatedAt < currentUpdatedAt && !defaultsChanged) return;
		const next = { ...state.sessionInfo };
		if (entry?.thinkingLevel !== void 0) next.thinkingLevel = entry.thinkingLevel;
		if (entry?.thinkingLevels !== void 0 || defaults?.thinkingLevels !== void 0) next.thinkingLevels = entry?.thinkingLevels ?? defaults?.thinkingLevels;
		if (entry?.agentRuntime !== void 0) next.agentRuntime = entry.agentRuntime;
		if (entry?.fastMode !== void 0) next.fastMode = entry.fastMode;
		if (entry?.verboseLevel !== void 0) next.verboseLevel = entry.verboseLevel;
		if (entry?.traceLevel !== void 0) next.traceLevel = entry.traceLevel;
		if (entry?.reasoningLevel !== void 0) next.reasoningLevel = entry.reasoningLevel;
		if (entry?.responseUsage !== void 0) next.responseUsage = entry.responseUsage;
		if (entry?.effectiveResponseUsage !== void 0) next.effectiveResponseUsage = entry.effectiveResponseUsage;
		if (entry?.inputTokens !== void 0) next.inputTokens = entry.inputTokens;
		if (entry?.outputTokens !== void 0) next.outputTokens = entry.outputTokens;
		if (entry?.totalTokens !== void 0) {
			next.totalTokens = entry.totalTokens;
			next.totalTokensFresh = entry.totalTokensFresh === true;
		} else if (entry?.totalTokensFresh === true) {
			next.totalTokens = 0;
			next.totalTokensFresh = true;
		}
		if (params.clearMissingUsage) {
			if (entry?.inputTokens === void 0) next.inputTokens = null;
			if (entry?.outputTokens === void 0) next.outputTokens = null;
			if (entry?.totalTokens === void 0 && entry?.totalTokensFresh !== true) {
				next.totalTokens = null;
				next.totalTokensFresh = void 0;
			}
		}
		if (hasEntryUpdate) next.goal = entry?.goal;
		if (entry?.contextTokens !== void 0 || defaults?.contextTokens !== void 0) next.contextTokens = entry?.contextTokens ?? defaults?.contextTokens ?? state.sessionInfo.contextTokens;
		if (entry?.displayName !== void 0) next.displayName = entry.displayName;
		if (entry?.updatedAt !== void 0) next.updatedAt = entry.updatedAt;
		const selection = resolveModelSelection(entry);
		if (selection.modelProvider !== void 0) next.modelProvider = selection.modelProvider;
		if (selection.model !== void 0) next.model = selection.model;
		const previous = state.sessionInfo;
		const uiChanged = !sessionInfoUiEquals(previous, next);
		if (!uiChanged && previous.updatedAt === next.updatedAt) return;
		state.sessionInfo = next;
		if (uiChanged) {
			updateAutocompleteProvider();
			updateFooter();
			tui.requestRender();
		}
	};
	const runRefreshSessionInfo = async () => {
		const selection = captureSessionSelection();
		const historyGeneration = historyLoadGeneration;
		const isCurrentRefresh = () => historyGeneration === historyLoadGeneration && isCurrentSessionSelection(selection);
		try {
			const resolveListAgentId = () => {
				if (selection.sessionKey === "global") return selection.agentId;
				if (selection.sessionKey === "unknown") return;
				const parsed = parseAgentSessionKey(selection.sessionKey);
				return parsed?.agentId ? normalizeAgentId(parsed.agentId) : selection.agentId;
			};
			const listAgentId = resolveListAgentId();
			const result = await client.listSessions({
				limit: 5,
				search: selection.sessionKey,
				includeGlobal: selection.sessionKey === "global",
				includeUnknown: selection.sessionKey === "unknown",
				agentId: listAgentId
			});
			if (!isCurrentRefresh()) return;
			const entry = result.sessions.find((row) => {
				return agentSessionKeysMatchByRequestKey(row.key, selection.sessionKey);
			});
			if (entry?.key && entry.key !== state.currentSessionKey) {
				updateAgentFromSessionKey(entry.key);
				state.currentSessionKey = entry.key;
				updateHeader();
			}
			state.currentSessionId = typeof entry?.sessionId === "string" ? entry.sessionId : null;
			applySessionInfo({
				entry,
				defaults: result.defaults
			});
		} catch (err) {
			if (!isCurrentRefresh()) return;
			chatLog.addSystem(`sessions list failed: ${formatTuiErrorMessage(err)}`);
		}
	};
	const refreshSessionInfoRunner = createTuiRefreshCoalescer(async () => {
		await runRefreshSessionInfo();
	});
	const refreshSessionInfo = () => refreshSessionInfoRunner.run();
	const applySessionInfoFromPatch = (result) => {
		if (!result?.entry || !isCurrentSessionMutation(result)) return;
		if (result.key && result.key !== state.currentSessionKey) {
			updateAgentFromSessionKey(result.key);
			state.currentSessionKey = result.key;
			updateHeader();
		}
		const resolved = result.resolved;
		const entry = resolved ? {
			...result.entry,
			modelProvider: resolved.modelProvider ?? result.entry.modelProvider,
			model: resolved.model ?? result.entry.model,
			...resolved.agentRuntime ? { agentRuntime: resolved.agentRuntime } : {},
			...resolved.thinkingLevel ? { thinkingLevel: resolved.thinkingLevel } : {},
			...resolved.thinkingLevels ? { thinkingLevels: resolved.thinkingLevels } : {}
		} : result.entry;
		applySessionInfo({
			entry,
			force: true
		});
	};
	const applySessionMutationResult = (result, requestSelection = captureSessionSelection()) => {
		if (!result?.entry || !isCurrentSessionSelection(requestSelection)) return false;
		historyLoadGeneration += 1;
		state.sessionGeneration = (state.sessionGeneration ?? 0) + 1;
		reduceTuiSessionProjection(state, {
			type: "sessionReset",
			scope: readTuiSessionProjectionScope(state)
		});
		if (result.key && result.key !== state.currentSessionKey) {
			updateAgentFromSessionKey(result.key);
			state.currentSessionKey = result.key;
			updateHeader();
		}
		const sessionId = result.entry.sessionId;
		state.currentSessionId = typeof sessionId === "string" ? sessionId : null;
		applySessionInfoFromPatch(result);
		chatLog.clearAll();
		btw.clear();
		chatLog.addSystem(`session ${state.currentSessionKey}`);
		state.historyLoaded = true;
		rememberSessionKey?.(state.currentSessionKey);
		tui.requestRender(true);
		return true;
	};
	const loadHistory = async () => {
		const generation = ++historyLoadGeneration;
		const selection = captureSessionSelection();
		const isCurrentLoad = () => generation === historyLoadGeneration && isCurrentSessionSelection(selection);
		try {
			const history = await client.loadHistory({
				sessionKey: selection.sessionKey,
				...!parseAgentSessionKey(selection.sessionKey) ? { agentId: selection.agentId } : {},
				limit: opts.historyLimit ?? 200
			});
			if (!isCurrentLoad()) return { loaded: false };
			const record = history;
			const sessionInfo = record.sessionInfo;
			if (sessionInfo?.key && sessionInfo.key !== state.currentSessionKey) {
				updateAgentFromSessionKey(sessionInfo.key);
				state.currentSessionKey = sessionInfo.key;
				selection.sessionKey = state.currentSessionKey;
				selection.agentId = state.currentAgentId;
				updateHeader();
			}
			const historySessionInfo = sessionInfo && sessionInfo.thinkingLevel === void 0 && record.thinkingLevel !== void 0 ? {
				...sessionInfo,
				thinkingLevel: record.thinkingLevel
			} : sessionInfo;
			state.currentSessionId = typeof sessionInfo?.sessionId === "string" ? sessionInfo.sessionId : typeof record.sessionId === "string" ? record.sessionId : null;
			applySessionInfo({
				entry: historySessionInfo ?? {
					sessionId: record.sessionId,
					thinkingLevel: record.thinkingLevel,
					fastMode: record.fastMode,
					verboseLevel: record.verboseLevel,
					traceLevel: record.traceLevel
				},
				defaults: record.defaults,
				clearMissingUsage: Boolean(historySessionInfo)
			});
			if (!sessionInfo) {
				await refreshSessionInfo();
				if (!isCurrentLoad()) return { loaded: false };
			}
			const pendingRunIds = new Set(getTuiSessionProjection(state).entries.flatMap((entry) => entry.pending && entry.pendingRunId ? [entry.pendingRunId] : []));
			const projection = reduceTuiSessionProjection(state, {
				type: "snapshotLoaded",
				messages: record.messages ?? [],
				scope: readTuiSessionProjectionScope(state),
				options: { shouldIncludeMessage: (message) => Boolean(message) && typeof message === "object" && (message.role !== "toolResult" || (state.sessionInfo.verboseLevel ?? "off") !== "off") }
			});
			chatLog.clearAll();
			btw.clear();
			chatLog.addSystem(`session ${state.currentSessionKey}`);
			for (const entry of projection.entries) {
				const message = entry.message;
				if (isCommandMarkedMessage(message)) {
					const text = extractTextFromMessage(message);
					if (text) chatLog.addSystem(text);
					continue;
				}
				if (message.role === "user") {
					const text = extractTextFromMessage(message);
					if (text) {
						const liveUserMessage = readTuiSessionUserMessage({ message });
						if (entry.pending && entry.pendingRunId) chatLog.addPendingUser(entry.pendingRunId, text);
						else if (entry.live && liveUserMessage) chatLog.addLiveUser(text, {
							messageId: liveUserMessage.messageId,
							...liveUserMessage.runId ? { runId: liveUserMessage.runId } : {}
						});
						else if (liveUserMessage) chatLog.addUser(text, { messageId: liveUserMessage.messageId });
						else chatLog.addUser(text);
					}
					continue;
				}
				if (message.role === "assistant") {
					const text = extractTextFromMessage(message, { includeThinking: state.showThinking });
					if (text) chatLog.finalizeAssistant(text);
					continue;
				}
				if (message.role === "toolResult") {
					const toolCallId = formatPrimitiveString(message.toolCallId, "");
					const toolName = formatPrimitiveString(message.toolName, "tool");
					chatLog.startTool(toolCallId, toolName, {}).setResult({
						content: Array.isArray(message.content) ? message.content : [],
						details: typeof message.details === "object" && message.details ? message.details : void 0
					}, { isError: Boolean(message.isError) });
				}
			}
			reconcilePendingSubmitHistory(state, projection.entries.flatMap((entry) => !entry.pending && entry.identity?.role === "user" && entry.identity.runId !== null && pendingRunIds.has(entry.identity.runId) ? [entry.identity.runId] : []));
			const inFlightRunId = formatPrimitiveString(record.inFlightRun?.runId, "");
			const inFlightText = formatPrimitiveString(record.inFlightRun?.text, "");
			if (inFlightRunId) {
				if (inFlightText) chatLog.updateAssistant(inFlightText, inFlightRunId);
				state.activeChatRunId = inFlightRunId;
				setActivityStatus("streaming");
			}
			state.historyLoaded = true;
			if (record.runtimePluginsPrewarm?.status === "failed") chatLog.addSystem(`runtime prewarm failed: ${record.runtimePluginsPrewarm.error ?? "unknown"}`);
			rememberSessionKey?.(state.currentSessionKey);
			tui.requestRender(true);
			return {
				loaded: true,
				inFlightRunId: inFlightRunId || null
			};
		} catch (err) {
			if (!isCurrentLoad()) return { loaded: false };
			chatLog.addSystem(`history failed: ${formatTuiErrorMessage(err)}`);
			tui.requestRender(true);
			return { loaded: false };
		}
	};
	const setSession = async (rawKey) => {
		const previousSelection = captureSessionSelection();
		const nextSelection = resolveSessionSelection(rawKey);
		const nextKey = nextSelection.key;
		const selectionChanged = !(nextSelection.agentId === previousSelection.agentId && agentSessionKeysMatchByRequestKey(nextKey, previousSelection.sessionKey));
		if (selectionChanged) {
			invalidateRunOwnership?.();
			reduceTuiSessionProjection(state, {
				type: "sessionReset",
				scope: readTuiSessionProjectionScope(state)
			});
		}
		state.currentAgentId = nextSelection.agentId;
		state.currentSessionKey = nextKey;
		state.activeChatRunId = null;
		clearPendingSubmit(state);
		setActivityStatus("idle");
		if (selectionChanged) {
			state.currentSessionId = null;
			clearTuiSessionModeOverrides(state.sessionInfo);
		}
		state.sessionInfo.updatedAt = null;
		state.historyLoaded = false;
		if (selectionChanged) chatLog.clearAll();
		chatLog.clearPendingUsers();
		clearLocalRunIds?.();
		btw.clear();
		updateHeader();
		updateFooter();
		await loadHistory();
	};
	const abortActive = async (params) => {
		if (opts.local === true && state.activityStatus === "finishing context" && !params?.preferActive && !getPendingSubmitAcceptedRunId(state)) {
			chatLog.addSystem("agent is finishing context; wait for it to finish before aborting");
			tui.requestRender();
			return;
		}
		const selection = captureSessionSelection();
		const pendingRunId = getPendingSubmitAcceptedRunId(state);
		const activeRunId = state.activeChatRunId;
		const dropPendingRun = (runId) => {
			reduceTuiSessionProjection(state, {
				type: "sendFailed",
				runId,
				scope: readTuiSessionProjectionScope(state)
			});
			chatLog.dropPendingUser(runId);
		};
		try {
			const result = await client.abortChat({
				sessionKey: selection.sessionKey,
				...!parseAgentSessionKey(selection.sessionKey) ? { agentId: selection.agentId } : {}
			});
			if (!isCurrentSessionSelection(selection)) return;
			if (!result.aborted) {
				chatLog.addSystem("no active run", { coalesceConsecutive: true });
				tui.requestRender();
				return;
			}
			for (const runId of result.runIds ?? []) {
				const stillTracked = state.activeChatRunId === runId || getPendingSubmitAcceptedRunId(state) === runId;
				if (runId !== activeRunId && !stillTracked) dropPendingRun(runId);
			}
			if (pendingRunId) {
				const pendingDraft = getPendingSubmitDraft(state);
				clearPendingSubmit(state, pendingRunId ?? void 0);
				if (pendingDraft?.runId === pendingRunId) dropPendingRun(pendingRunId);
			}
			setActivityStatus("aborted");
		} catch (err) {
			if (!isCurrentSessionSelection(selection)) return;
			chatLog.addSystem(`abort failed: ${formatTuiErrorMessage(err)}`);
			setActivityStatus("abort failed");
		}
		tui.requestRender();
	};
	return {
		applyAgentsResult,
		refreshAgents,
		refreshSessionInfo,
		applySessionInfoFromPatch,
		applySessionMutationResult,
		loadHistory,
		setSession,
		abortActive
	};
}
//#endregion
//#region src/tui/tui-task-suggestions.ts
const TASK_BIDI_CONTROL_RE = /[\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]/g;
const TASK_DETAIL_VIEWPORT_LINES = 12;
const TASK_DETAIL_PAGE_LINES = TASK_DETAIL_VIEWPORT_LINES - 1;
const PAGE_UP_INPUT = "\x1B[5~";
const PAGE_DOWN_INPUT = "\x1B[6~";
const TASK_ACTIONS = {
	worktree: {
		value: "accept",
		label: "Start in worktree",
		description: "Create an isolated session and begin this task",
		kind: "accept",
		mode: "worktree"
	},
	local: {
		value: "accept-local",
		label: "Start locally",
		description: "Start a new session in this checkout",
		kind: "accept",
		mode: "local"
	},
	session: {
		value: "accept-session",
		label: "Fix in this session",
		description: "Deliver the task into this transcript",
		kind: "accept",
		mode: "session"
	},
	dismiss: {
		value: "dismiss",
		label: "Dismiss",
		description: "Leave the repository untouched",
		kind: "dismiss"
	}
};
function taskActions(cloudProfileIds) {
	return [
		TASK_ACTIONS.local,
		...cloudProfileIds.map((profileId) => ({
			value: "accept-cloud",
			label: `Send to cloud · ${clean(profileId)}`,
			description: "Start a new session on this cloud worker",
			kind: "accept",
			mode: "cloud",
			cloudProfileId: profileId
		})),
		TASK_ACTIONS.session,
		TASK_ACTIONS.worktree,
		TASK_ACTIONS.dismiss
	];
}
function taskActionKey(action) {
	return `${action.value}\0${action.cloudProfileId ?? ""}`;
}
function clean(text) {
	return sanitizeTaskText(text.replace(/\s+/g, " ").trim());
}
function sanitizeTaskText(text) {
	return sanitizeRenderableText(text.replace(TASK_BIDI_CONTROL_RE, ""));
}
/** Parses the task suggestion shape carried by Gateway list and event payloads. */
function parseTuiTaskSuggestion(value) {
	const record = asOptionalObjectRecord(value);
	if (!record) return null;
	if ([
		"id",
		"title",
		"prompt",
		"tldr",
		"cwd",
		"sessionKey"
	].some((field) => typeof record[field] !== "string" || !record[field].trim())) return null;
	if (typeof record.createdAt !== "number" || record.createdAt < 0) return null;
	return {
		id: record.id.trim(),
		title: record.title.trim(),
		prompt: record.prompt.trim(),
		tldr: record.tldr.trim(),
		cwd: record.cwd.trim(),
		sessionKey: record.sessionKey.trim(),
		...typeof record.agentId === "string" && record.agentId.trim() ? { agentId: record.agentId.trim() } : {},
		createdAt: record.createdAt
	};
}
var TaskPrompt = class {
	constructor(suggestion, selector, requestRender) {
		this.selector = selector;
		this.requestRender = requestRender;
		this.instructionLabel = new Text(tuiTheme.system("Instructions:"));
		this.detailPosition = new Text();
		this.confirmation = new Text();
		this.detailOffset = 0;
		this.detailLineCount = 0;
		this.title = new Text(tuiTheme.header(`Suggested follow-up: ${clean(suggestion.title)}`));
		this.metadata = new Text(tuiTheme.dim(`Project: ${clean(suggestion.cwd)}`));
		this.summary = new Text(tuiTheme.system(`Why: ${clean(suggestion.tldr)}`));
		this.instructions = new Text(tuiTheme.system(sanitizeTaskText(suggestion.prompt.trim())));
	}
	setConfirmation(text) {
		this.confirmation.setText(tuiTheme.accent(text));
	}
	invalidate() {
		for (const component of [
			this.title,
			this.metadata,
			this.summary,
			this.instructionLabel,
			this.instructions,
			this.detailPosition,
			this.confirmation,
			this.selector
		]) component.invalidate();
	}
	render(width) {
		const detailLines = [
			...this.metadata.render(width),
			...this.summary.render(width),
			...this.instructionLabel.render(width),
			...this.instructions.render(width)
		];
		this.detailLineCount = detailLines.length;
		const maxDetailOffset = Math.max(0, detailLines.length - TASK_DETAIL_VIEWPORT_LINES);
		this.detailOffset = Math.min(this.detailOffset, maxDetailOffset);
		const visibleDetails = detailLines.slice(this.detailOffset, this.detailOffset + TASK_DETAIL_VIEWPORT_LINES);
		if (detailLines.length > TASK_DETAIL_VIEWPORT_LINES) {
			const visibleEnd = this.detailOffset + visibleDetails.length;
			this.detailPosition.setText(tuiTheme.dim(`Details ${this.detailOffset + 1}-${visibleEnd} of ${detailLines.length} · PgUp/PgDn to inspect`));
		} else this.detailPosition.setText("");
		const detailPosition = this.detailPosition.render(width);
		const confirmation = this.confirmation.render(width);
		return [
			...this.title.render(width).slice(0, 2),
			...visibleDetails,
			...detailPosition.some((line) => line.trim()) ? detailPosition : [],
			...confirmation.some((line) => line.trim()) ? ["", ...confirmation] : [],
			"",
			...this.selector.render(width)
		];
	}
	handleInput(data) {
		if (data === PAGE_UP_INPUT || data === PAGE_DOWN_INPUT) {
			const maxOffset = Math.max(0, this.detailLineCount - TASK_DETAIL_VIEWPORT_LINES);
			const delta = data === PAGE_UP_INPUT ? -11 : TASK_DETAIL_PAGE_LINES;
			const nextOffset = Math.min(maxOffset, Math.max(0, this.detailOffset + delta));
			if (nextOffset !== this.detailOffset) {
				this.detailOffset = nextOffset;
				this.metadata.invalidate();
				this.summary.invalidate();
				this.instructionLabel.invalidate();
				this.instructions.invalidate();
				this.requestRender();
			}
			return;
		}
		this.selector.handleInput?.(data);
	}
};
/** Coordinates Gateway task-suggestion events with the active TUI overlay. */
function createTuiTaskSuggestionController(deps) {
	const createSelector = deps.createSelector ?? ((items) => new SelectList(items, items.length, selectListTheme));
	const suggestions = /* @__PURE__ */ new Map();
	const hiddenIds = /* @__PURE__ */ new Set();
	let activeId = null;
	let activeOverlay = null;
	let activeSelector = null;
	let activeActionKey = null;
	let cloudProfileIds = [];
	let revision = 0;
	let disposed = false;
	const closeActive = () => {
		if (activeOverlay) {
			deps.closeOverlay(activeOverlay);
			activeOverlay = null;
		}
		activeId = null;
		activeSelector = null;
		activeActionKey = null;
	};
	const remove = (id) => {
		revision += 1;
		suggestions.delete(id);
		hiddenIds.delete(id);
		if (activeId === id) closeActive();
	};
	const matchesSession = (suggestion) => suggestion.sessionKey === deps.getSessionKey() && (suggestion.sessionKey !== "global" || suggestion.agentId === deps.getAgentId());
	const availableActions = () => {
		const capabilities = deps.client.getTaskSuggestionActionCapabilities?.() ?? {
			canAccept: Boolean(deps.client.acceptTaskSuggestion),
			canAcceptModes: false,
			canDismiss: Boolean(deps.client.dismissTaskSuggestion)
		};
		return (capabilities.canAcceptModes ? taskActions(cloudProfileIds) : [TASK_ACTIONS.worktree, TASK_ACTIONS.dismiss]).filter((action) => action.kind === "accept" ? capabilities.canAccept : capabilities.canDismiss);
	};
	const presentNext = () => {
		if (disposed) return;
		const actions = availableActions();
		const actionKey = actions.map(taskActionKey).join(",");
		if (activeId) {
			if (activeActionKey === actionKey) return;
			closeActive();
		}
		const suggestion = [...suggestions.values()].toSorted((left, right) => left.createdAt - right.createdAt).find((entry) => !hiddenIds.has(entry.id) && matchesSession(entry));
		if (!suggestion) return;
		if (actions.length === 0) return;
		activeId = suggestion.id;
		const selector = createSelector(actions);
		activeSelector = selector;
		activeActionKey = actionKey;
		const dismissIndex = actions.findIndex((action) => action.value === "dismiss");
		selector.setSelectedIndex?.(Math.max(dismissIndex, 0));
		let acceptArmed = false;
		let prompt = null;
		const resolve = async (action) => {
			if (activeId !== suggestion.id || activeSelector !== selector) return;
			closeActive();
			hiddenIds.add(suggestion.id);
			deps.requestRender();
			try {
				if (action.kind === "accept") {
					if (!deps.client.acceptTaskSuggestion) throw new Error("task suggestion acceptance is unavailable");
					const result = action.cloudProfileId ? await deps.client.acceptTaskSuggestion(suggestion.id, action.mode, action.cloudProfileId) : action.mode === "worktree" ? await deps.client.acceptTaskSuggestion(suggestion.id) : await deps.client.acceptTaskSuggestion(suggestion.id, action.mode);
					remove(suggestion.id);
					deps.chatLog.addSystem(`follow-up task started in ${result.key}`);
					if (action.mode !== "session" && matchesSession(suggestion)) await deps.onAccepted(result.key);
				} else {
					if (!deps.client.dismissTaskSuggestion) throw new Error("task suggestion dismissal is unavailable");
					if (!(await deps.client.dismissTaskSuggestion(suggestion.id)).dismissed) throw new Error("task suggestion is no longer pending");
					remove(suggestion.id);
					deps.chatLog.addSystem("follow-up task dismissed");
				}
			} catch (error) {
				hiddenIds.delete(suggestion.id);
				deps.chatLog.addSystem(`follow-up task failed: ${formatErrorMessage(error)}`);
				refresh().catch((refreshError) => {
					deps.chatLog.addSystem(`task suggestion refresh failed: ${formatErrorMessage(refreshError)}`);
				});
			}
			presentNext();
			if (!disposed) deps.requestRender();
		};
		selector.onSelectionChange = () => {
			acceptArmed = false;
			prompt?.setConfirmation("");
		};
		selector.onSelect = (item) => {
			if (activeSelector !== selector) return;
			const selectedAction = actions.find((action) => taskActionKey(action) === taskActionKey(item));
			if (!selectedAction || !availableActions().some((action) => taskActionKey(action) === taskActionKey(item))) {
				closeActive();
				presentNext();
				deps.requestRender();
				return;
			}
			if (selectedAction.kind === "dismiss") {
				resolve(selectedAction);
				return;
			}
			if (acceptArmed) {
				resolve(selectedAction);
				return;
			}
			acceptArmed = true;
			prompt?.setConfirmation("Press Enter again to start this task.");
			deps.requestRender();
		};
		selector.onCancel = () => {
			if (activeSelector !== selector) return;
			hiddenIds.add(suggestion.id);
			closeActive();
			deps.chatLog.addSystem("follow-up task hidden; suggestion remains pending");
			presentNext();
			deps.requestRender();
		};
		prompt = new TaskPrompt(suggestion, selector, deps.requestRender);
		activeOverlay = deps.openOverlay(prompt);
		deps.requestRender();
	};
	const refreshRunner = createTuiRefreshCoalescer(async (requestRerun) => {
		const startRevision = revision;
		const [listed, profiles] = await Promise.all([deps.client.listTaskSuggestions?.(), deps.client.listCloudWorkerProfiles?.() ?? Promise.resolve([])]);
		if (disposed || !listed) return false;
		if (revision !== startRevision) {
			requestRerun();
			return true;
		}
		suggestions.clear();
		cloudProfileIds = profiles;
		for (const value of listed) {
			const suggestion = parseTuiTaskSuggestion(value);
			if (suggestion) suggestions.set(suggestion.id, suggestion);
		}
		for (const id of hiddenIds) if (!suggestions.has(id)) hiddenIds.delete(id);
		return true;
	}, () => {
		if (activeId && !suggestions.has(activeId)) closeActive();
		presentNext();
		deps.requestRender();
	});
	const refresh = async () => {
		if (disposed || !deps.client.listTaskSuggestions) return;
		await refreshRunner.run();
	};
	return {
		handleEvent(event, payload) {
			const record = asOptionalObjectRecord(payload);
			if (disposed || event !== "task.suggestion" || !record) return;
			if (record.action === "created") {
				const suggestion = parseTuiTaskSuggestion(record.suggestion);
				if (suggestion) {
					revision += 1;
					hiddenIds.delete(suggestion.id);
					suggestions.set(suggestion.id, suggestion);
					presentNext();
				}
				return;
			}
			if (record.action === "resolved" && typeof record.taskId === "string") {
				remove(record.taskId);
				presentNext();
				deps.requestRender();
			}
		},
		refresh,
		sessionChanged() {
			if (disposed) return;
			hiddenIds.clear();
			const active = activeId ? suggestions.get(activeId) : void 0;
			if (active && !matchesSession(active)) closeActive();
			presentNext();
			deps.requestRender();
		},
		dispose() {
			if (disposed) return;
			disposed = true;
			suggestions.clear();
			hiddenIds.clear();
			closeActive();
			deps.requestRender();
		}
	};
}
//#endregion
//#region src/tui/tui-waiting.ts
/** Default phrase cycle for animated waiting status. */
const defaultWaitingPhrases = [
	"flibbertigibbeting",
	"kerfuffling",
	"dillydallying",
	"twiddling thumbs",
	"noodling",
	"bamboozling",
	"moseying",
	"hobnobbing",
	"pondering",
	"conjuring"
];
/** Picks a stable phrase for a timer tick. */
function pickWaitingPhrase(tick, phrases = defaultWaitingPhrases) {
	return phrases[Math.floor(tick / 10) % phrases.length] ?? phrases[0] ?? "waiting";
}
/** Applies a moving highlight window to status text. */
function shimmerText(theme, text, tick) {
	const width = 6;
	const hi = (ch) => theme.bold(theme.accentSoft(ch));
	const pos = tick % (text.length + width);
	const start = Math.max(0, pos - width);
	const end = Math.min(text.length - 1, pos);
	let out = "";
	for (let i = 0; i < text.length; i++) {
		const ch = text.charAt(i);
		out += i >= start && i <= end ? hi(ch) : theme.dim(ch);
	}
	return out;
}
/** Builds the single-line waiting status shown while a TUI run is active. */
function buildWaitingStatusMessage(params) {
	const phrase = pickWaitingPhrase(params.tick, params.phrases);
	return `${shimmerText(params.theme, `${phrase}…`, params.tick)} • ${params.elapsed} | ${params.connectionStatus}`;
}
//#endregion
//#region src/tui/tui.ts
const OPENAI_CODEX_PROVIDER = "openai";
const CODEX_CLI_LOOKUP_TIMEOUT_MS = 5e3;
const SESSION_SUBSCRIPTION_MAX_ATTEMPTS = 5;
const SESSION_SUBSCRIPTION_RETRY_DELAY_MS = 25;
/** Resolve the absolute path to the `codex` CLI binary, or `null` if not installed. */
async function resolveCodexCliBin() {
	if (process.platform === "win32") {
		const pathEnv = process.env.PATH ?? process.env.Path ?? "";
		return resolveExecutableFromPathEnv("codex", pathEnv, process.env, { includeExtensionless: false }) ?? resolveExecutableFromPathEnv("codex", pathEnv, process.env, { includeExtensionless: true }) ?? null;
	}
	try {
		const result = await runCommandWithTimeout(["which", "codex"], {
			killSignal: "SIGKILL",
			maxOutputBytes: 64 * 1024,
			timeoutMs: CODEX_CLI_LOOKUP_TIMEOUT_MS
		});
		if (result.code !== 0 || result.termination !== "exit") return null;
		return result.stdout.trim().split(/\r?\n/)[0]?.trim() || null;
	} catch {
		return null;
	}
}
function resolveLocalAuthSpawnInvocation(params) {
	const platform = params.platform ?? process.platform;
	if (!isWindowsBatchCommand(params.command.trim(), platform)) return {
		command: params.command,
		args: params.args,
		options: {}
	};
	return {
		command: resolveTrustedWindowsCmdExe(platform),
		args: [
			"/d",
			"/s",
			"/c",
			buildWindowsCmdExeCommandLine(params.command, params.args)
		],
		options: {
			windowsHide: true,
			windowsVerbatimArguments: true
		}
	};
}
function resolveTuiLocalAuthCliInvocation(params) {
	const provider = params.provider?.trim();
	return resolveCurrentOpenClawCliInvocation([
		"models",
		"auth",
		"login",
		...provider ? ["--provider", provider] : []
	], { execArgv: params.execArgv ?? process.execArgv });
}
function resolveTuiSessionKey(params) {
	const trimmed = (params.raw ?? "").trim();
	if (!trimmed) return resolveCanonicalMainSessionKey({
		agentId: params.currentAgentId,
		mainKey: params.sessionMainKey,
		sessionScope: params.sessionScope
	});
	if (parseAgentSessionKey(trimmed)?.rest === "global") return "global";
	if (trimmed === "global" || trimmed === "unknown") return trimmed;
	return toAgentStoreSessionKey({
		agentId: params.currentAgentId,
		requestKey: trimmed,
		mainKey: params.sessionMainKey
	});
}
function resolveTuiSessionSelection(params) {
	const trimmed = (params.raw ?? "").trim();
	const parsed = parseAgentSessionKey(trimmed);
	const persistedOwner = trimmed ? resolvePersistedSessionStoreOwnerForKey(params.cfg, trimmed) : void 0;
	const agentId = parsed?.agentId ? normalizeAgentId(parsed.agentId) : persistedOwner?.kind === "configured" ? persistedOwner.agentId : trimmed ? resolveSessionAgentId({
		config: params.cfg,
		sessionKey: trimmed,
		fallbackAgentId: params.currentAgentId
	}) : params.currentAgentId;
	const mainKey = normalizeMainKey(params.sessionMainKey);
	return {
		key: !parsed && persistedOwner?.kind === "configured" && trimmed !== "global" && trimmed !== "unknown" && trimmed.toLowerCase() !== "main" && trimmed.toLowerCase() !== mainKey ? trimmed : resolveTuiSessionKey({
			raw: trimmed,
			sessionScope: params.sessionScope,
			currentAgentId: agentId,
			sessionMainKey: params.sessionMainKey
		}),
		agentId
	};
}
function resolveInitialTuiAgentId(params) {
	const initialSessionInput = (params.initialSessionInput ?? "").trim();
	const explicitAgentId = resolveExplicitInitialTuiAgentId(params);
	if (explicitAgentId) return explicitAgentId;
	const effectiveUnscopedSessionKey = initialSessionInput ? initialSessionInput : params.cfg.session?.scope === "global" ? "global" : void 0;
	if (effectiveUnscopedSessionKey) return resolveSessionAgentId({
		config: params.cfg,
		sessionKey: effectiveUnscopedSessionKey,
		fallbackAgentId: params.fallbackAgentId
	});
	const cwd = params.cwd ?? tryProcessCwd();
	const inferredFromWorkspace = cwd ? resolveAgentIdByWorkspacePath(params.cfg, cwd) : null;
	if (inferredFromWorkspace) return inferredFromWorkspace;
	return normalizeAgentId(params.fallbackAgentId ?? tryResolveLegacyCompatibilityAgentId(params.cfg) ?? resolveDefaultAgentId(params.cfg, {
		surface: "TUI startup",
		hint: "Pass an agent-scoped --session key."
	}));
}
function resolveExplicitInitialTuiAgentId(params) {
	const explicitAgentId = parseAgentSessionKey((params.initialSessionInput ?? "").trim())?.agentId ?? params.agentId?.trim();
	return explicitAgentId ? normalizeAgentId(explicitAgentId) : null;
}
function resolveGatewayDisconnectState(input = {}) {
	const failure = classifyGatewayConnectFailure(input);
	const reasonLabel = failure.userMessage === "gateway unreachable" ? "closed" : failure.userMessage;
	if (failure.kind === "pairing-required") return {
		connectionStatus: `gateway disconnected: ${reasonLabel}`,
		activityStatus: "device approval needed: preview latest request",
		remediation: failure.remediation
	};
	if (failure.kind === "rate-limited") return {
		connectionStatus: `gateway disconnected: ${reasonLabel}`,
		activityStatus: "gateway authentication temporarily rate-limited",
		remediation: failure.remediation
	};
	return {
		connectionStatus: `gateway disconnected: ${reasonLabel}`,
		activityStatus: failure.remediation ? "gateway authentication needs attention" : "idle",
		remediation: failure.remediation
	};
}
function createBackspaceDeduper(params) {
	const dedupeWindowMs = Math.max(0, Math.floor(params?.dedupeWindowMs ?? 8));
	const now = params?.now ?? (() => Date.now());
	let previousBackspace;
	return (data) => {
		if (data !== "\b" && data !== "" || !matchesKey(data, "backspace")) {
			previousBackspace = void 0;
			return data;
		}
		const at = now();
		const isDuplicate = previousBackspace !== void 0 && previousBackspace.data !== data && at - previousBackspace.at <= dedupeWindowMs;
		previousBackspace = isDuplicate ? void 0 : {
			data,
			at
		};
		return isDuplicate ? "" : data;
	};
}
function isIgnorableTuiStopError(error) {
	if (!error || typeof error !== "object") return false;
	const err = error;
	const code = typeof err.code === "string" ? err.code : "";
	const syscall = typeof err.syscall === "string" ? err.syscall : "";
	const message = typeof err.message === "string" ? err.message : "";
	if (code === "EBADF" && syscall === "setRawMode") return true;
	return /setRawMode/i.test(message) && /EBADF/i.test(message);
}
function stopTuiSafely(stop) {
	try {
		stop();
	} catch (error) {
		if (!isIgnorableTuiStopError(error)) throw error;
	}
}
function isTuiTerminalLossError(error) {
	if (!error || typeof error !== "object") return false;
	const err = error;
	const code = typeof err.code === "string" ? err.code : "";
	const message = typeof err.message === "string" ? err.message : "";
	const syscall = typeof err.syscall === "string" ? err.syscall : "";
	if (code === "EIO" || code === "EPIPE") return true;
	return /\b(EIO|EPIPE)\b/i.test(message) && /\b(read|write|TTY|stdin|stdout)\b/i.test(message + syscall);
}
function installTuiTerminalLossExitHandler(requestExit, targets = {
	stdin: process.stdin,
	stdout: process.stdout
}) {
	let requested = false;
	const requestOnce = () => {
		if (requested) return;
		requested = true;
		requestExit();
	};
	const removeUncaughtExceptionHandler = registerUncaughtExceptionHandler((error) => {
		if (!isTuiTerminalLossError(error)) return false;
		requestOnce();
		return true;
	});
	const onClose = () => requestOnce();
	targets.stdin?.on("end", onClose);
	targets.stdin?.on("close", onClose);
	targets.stdout?.on("close", onClose);
	return () => {
		removeUncaughtExceptionHandler();
		targets.stdin?.off("end", onClose);
		targets.stdin?.off("close", onClose);
		targets.stdout?.off("close", onClose);
	};
}
function createDeferredTuiFinish() {
	let finishTui = null;
	let finishRequested = false;
	return {
		requestFinish: () => {
			const finish = finishTui;
			if (finish) {
				finish();
				return;
			}
			finishRequested = true;
		},
		setFinish: (finish) => {
			finishTui = finish;
			if (finishRequested) finish();
		},
		clearFinish: () => {
			finishTui = null;
		}
	};
}
const TUI_SHUTDOWN_DRAIN_MAX_MS = 500;
const TUI_SHUTDOWN_DRAIN_IDLE_MS = 100;
const TUI_SHUTDOWN_HARD_EXIT_MS = 2e3;
const TUI_PROCESS_EXIT_AFTER_RETURN_MS = 2e3;
function beginTuiShutdown(params) {
	const hardExitTimer = (params.setTimeoutFn ?? ((callback, timeoutMs) => setTimeout(callback, timeoutMs)))(params.forceExit, params.hardExitMs);
	hardExitTimer.unref?.();
	params.disposeStatus();
	Promise.resolve().then(async () => {
		const errors = [];
		try {
			await params.stopClient();
		} catch (error) {
			errors.push(error);
		}
		try {
			await params.stopTui();
		} catch (error) {
			errors.push(error);
		}
		if (errors.length === 1) throw errors[0];
		if (errors.length > 1) throw new AggregateError(errors, "TUI shutdown failed");
	}).finally(() => {
		if (params.keepHardExitArmed !== true) (params.clearTimeoutFn ?? ((timer) => clearTimeout(timer)))(hardExitTimer);
		params.disposeStatus();
	}).catch(params.onError).finally(params.requestFinish);
	return hardExitTimer;
}
function createTuiSignalHandlers(params) {
	return {
		sigintHandler: params.handleCtrlC,
		sigtermHandler: params.requestExit,
		sighupHandler: params.requestExit
	};
}
async function drainAndStopTuiSafely(tui) {
	if (typeof tui.terminal?.drainInput === "function") try {
		await tui.terminal.drainInput(TUI_SHUTDOWN_DRAIN_MAX_MS, TUI_SHUTDOWN_DRAIN_IDLE_MS);
	} catch {}
	stopTuiSafely(() => tui.stop());
}
const TUI_BUSY_ACTIVITY_STATUSES = /* @__PURE__ */ new Set([
	"sending",
	"waiting",
	"streaming",
	"running",
	"finishing context",
	"starting up"
]);
function isTuiBusyActivityStatus(status) {
	return TUI_BUSY_ACTIVITY_STATUSES.has(status);
}
function resolveTuiToolsToggleActivityStatus(params) {
	const toolsStatus = params.toolsExpanded ? "tools expanded" : "tools collapsed";
	if (isTuiBusyActivityStatus(params.currentStatus)) return params.currentStatus;
	return toolsStatus;
}
function resolveTuiShutdownHardExitMs(params = {}) {
	return TUI_SHUTDOWN_HARD_EXIT_MS + (params.localMode ? resolveLocalRunShutdownGraceMs() : 0);
}
function scheduleProcessExitAfterTuiReturn(params = {}) {
	const delayMs = Math.max(0, Math.floor(params.delayMs ?? TUI_PROCESS_EXIT_AFTER_RETURN_MS));
	const setTimeoutFn = params.setTimeoutFn ?? ((callback, timeoutMs) => setTimeout(callback, timeoutMs));
	const exit = params.exit ?? ((code) => process.exit(code));
	const writeStderr = params.writeStderr ?? ((text) => {
		process.stderr.write(text);
	});
	const timer = setTimeoutFn(() => {
		try {
			writeStderr("openclaw tui forcing process exit after return\n");
		} catch {}
		exit(0);
	}, delayMs);
	timer.unref?.();
	return timer;
}
function resolveCtrlCAction(params) {
	const exitWindowMs = Math.max(1, Math.floor(params.exitWindowMs ?? 1e3));
	if (params.hasInput) return {
		action: "clear",
		nextLastCtrlCAt: params.now
	};
	if (params.now - params.lastCtrlCAt <= exitWindowMs) return {
		action: "exit",
		nextLastCtrlCAt: params.lastCtrlCAt
	};
	return {
		action: "warn",
		nextLastCtrlCAt: params.now
	};
}
function resolveTuiCtrlCAction(params) {
	if (params.exitRequested === true) return {
		action: "force-exit",
		nextLastCtrlCAt: params.lastCtrlCAt
	};
	if (params.hasInput) return resolveCtrlCAction(params);
	if (params.wasDisconnected === true) return {
		action: "exit",
		nextLastCtrlCAt: params.lastCtrlCAt
	};
	return resolveCtrlCAction(params);
}
function resolveEmptySessionInfoDefaults(config) {
	return { verboseLevel: config.agents?.defaults?.verboseDefault };
}
function formatActiveGatewayTuiRefusal(identity) {
	return `A Gateway is running for this state directory (pid ${identity.pid}, port ${identity.port}). Run without --local to use it, or stop the Gateway first (${formatCliCommand("openclaw gateway stop")}).`;
}
/** Hold canonical state ownership for the complete lifetime of a local TUI. */
async function withEmbeddedTuiStateLock(run, deps = {}) {
	const { acquireEmbeddedStateLock, createEmbeddedStateSignalBridge } = await import("./embedded-state-lock-DWKjt36u.js");
	const signalBridge = createEmbeddedStateSignalBridge(deps.process ?? process);
	let stateLock;
	try {
		stateLock = await acquireEmbeddedStateLock({
			options: deps.gatewayLockOptions,
			signal: signalBridge.signal,
			formatActiveGatewayRefusal: formatActiveGatewayTuiRefusal
		});
		return await run(signalBridge.signal);
	} finally {
		await stateLock?.release();
		signalBridge.dispose();
	}
}
async function runTui(opts) {
	if (opts.local === true && opts.backend === void 0) return await withEmbeddedTuiStateLock(async () => await runTuiUnlocked(opts));
	return await runTuiUnlocked(opts);
}
async function runTuiUnlocked(opts) {
	const isLocalMode = opts.local === true || opts.backend !== void 0;
	const config = opts.config ?? getRuntimeConfig({ skipPluginValidation: !isLocalMode });
	const cliInvocation = resolveCurrentOpenClawCliInvocation([]);
	const resolveUsableCwd = () => tryProcessCwd() ?? cliInvocation.cwd;
	const emptySessionInfoDefaults = resolveEmptySessionInfoDefaults(config);
	const initialSessionInput = (opts.session ?? "").trim();
	const sessionScope = config.session?.scope ?? "per-sender";
	const sessionMainKey = normalizeMainKey(config.session?.mainKey);
	const configuredDefaultAgentId = tryResolveDefaultAgentId(config);
	let currentAgentId = resolveInitialTuiAgentId({
		cfg: config,
		fallbackAgentId: configuredDefaultAgentId,
		initialSessionInput,
		agentId: opts.agentId
	});
	const agentDefaultId = configuredDefaultAgentId ?? currentAgentId;
	const agentNames = /* @__PURE__ */ new Map();
	let currentSessionKey = "";
	let rememberedSessionApplied = false;
	let currentSessionId = null;
	const sessionGenerations = /* @__PURE__ */ new Map();
	const sessionIds = /* @__PURE__ */ new Map();
	let connectionGeneration = 0;
	let wasDisconnected = false;
	let remediationShown = false;
	const localRunIds = createTuiRunIdTracker();
	const localBtwRunIds = createTuiRunIdTracker();
	const deliverDefault = opts.deliver ?? false;
	const autoMessage = opts.message?.trim();
	const thinkingLevelOverride = normalizeThinkLevel(opts.thinking);
	let dynamicSlashCommands = [];
	let dynamicSlashCommandsKey = null;
	let dynamicSlashCommandsInFlightKey = null;
	let dynamicSlashCommandsRequestId = 0;
	let dynamicSlashCommandsReady = false;
	let dynamicSlashCommandsRefreshTimer = null;
	let exitRequested = false;
	let exitResult = { exitReason: "exit" };
	let statusTimer = null;
	let statusStartedAt = null;
	let lastActivityStatus = "idle";
	let invalidateSessionRunOwnership = () => void 0;
	let retireHistoryAbsentRun = () => void 0;
	const currentSessionGenerationKey = () => JSON.stringify([currentAgentId, currentSessionKey]);
	const readCurrentSessionGeneration = () => sessionGenerations.get(currentSessionGenerationKey()) ?? 0;
	const writeCurrentSessionGeneration = (value) => {
		sessionGenerations.set(currentSessionGenerationKey(), value);
	};
	const state = {
		agentDefaultId,
		sessionMainKey,
		sessionScope,
		agents: [],
		get currentAgentId() {
			return currentAgentId;
		},
		set currentAgentId(value) {
			if (currentAgentId === value) return;
			currentAgentId = value;
			invalidateSessionRunOwnership();
			pluginApprovals?.sessionChanged();
			taskSuggestions?.sessionChanged();
		},
		get currentSessionKey() {
			return currentSessionKey;
		},
		set currentSessionKey(value) {
			currentSessionKey = value;
			pluginApprovals?.sessionChanged();
			taskSuggestions?.sessionChanged();
		},
		get currentSessionId() {
			return currentSessionId;
		},
		set currentSessionId(value) {
			if (value) {
				const generationKey = currentSessionGenerationKey();
				const previousSessionId = sessionIds.get(generationKey);
				if (previousSessionId && previousSessionId !== value) writeCurrentSessionGeneration(readCurrentSessionGeneration() + 1);
				sessionIds.set(generationKey, value);
			}
			currentSessionId = value;
		},
		get sessionGeneration() {
			return readCurrentSessionGeneration();
		},
		set sessionGeneration(value) {
			writeCurrentSessionGeneration(Math.max(readCurrentSessionGeneration(), value));
		},
		activeChatRunId: null,
		pendingSubmit: null,
		historyLoaded: false,
		sessionInfo: { ...emptySessionInfoDefaults },
		initialSessionApplied: false,
		isConnected: false,
		autoMessageSent: false,
		toolsExpanded: false,
		showThinking: false,
		connectionStatus: isLocalMode ? "starting local runtime" : "connecting",
		activityStatus: "idle",
		statusTimeout: null,
		lastCtrlCAt: 0
	};
	let client;
	if (opts.backend) client = opts.backend;
	else if (opts.local) {
		const { EmbeddedTuiBackend } = await import("./embedded-backend-CXIH0qKr.js");
		client = new EmbeddedTuiBackend();
	} else {
		const { GatewayChatClient } = await import("./gateway-chat-osZ0dDRF.js");
		client = opts.boundGateway ? GatewayChatClient.connectBound({
			config,
			...opts.boundGateway
		}) : await GatewayChatClient.connect({
			url: opts.url,
			token: opts.token,
			password: opts.password,
			tlsFingerprint: opts.tlsFingerprint
		});
	}
	const previousConsoleSubsystemFilter = isLocalMode ? loggingState.consoleSubsystemFilter ? [...loggingState.consoleSubsystemFilter] : null : null;
	if (isLocalMode) setConsoleSubsystemFilter(["__openclaw_tui_quiet__"]);
	const tui = new TUI(new ProcessTerminal());
	const dedupeBackspace = createBackspaceDeduper();
	tui.addInputListener((data) => {
		const next = dedupeBackspace(data);
		if (next.length === 0) return { consume: true };
		return { data: next };
	});
	const header = new Text("", 1, 0);
	const statusContainer = new Container();
	const footer = new Text("", 1, 0);
	const chatLog = new ChatLog();
	const connectionNotices = [];
	const addConnectionNotice = (text) => {
		connectionNotices.push(text);
		if (connectionNotices.length > 12) connectionNotices.shift();
		chatLog.addSystem(text, { coalesceConsecutive: true });
	};
	const restoreConnectionNotices = () => {
		for (const notice of connectionNotices) chatLog.addSystem(notice, { coalesceConsecutive: true });
	};
	const editor = new CustomEditor(tui, editorTheme);
	const root = new Container();
	root.addChild(header);
	root.addChild(chatLog);
	root.addChild(statusContainer);
	root.addChild(footer);
	root.addChild(editor);
	const resolveDynamicSlashCommandsKey = () => state.currentAgentId;
	const applyAutocompleteProvider = () => {
		const dynamicKey = resolveDynamicSlashCommandsKey();
		const slashCommands = getSlashCommands({
			cfg: config,
			local: isLocalMode,
			provider: state.sessionInfo.modelProvider,
			model: state.sessionInfo.model,
			agentRuntime: state.sessionInfo.agentRuntime?.id,
			thinkingLevels: state.sessionInfo.thinkingLevels,
			dynamicCommands: dynamicSlashCommandsKey === dynamicKey ? dynamicSlashCommands : []
		});
		editor.shouldSubmitAutocomplete = (text) => shouldSubmitExactArgumentCompletion(text, slashCommands);
		editor.setAutocompleteProvider(sanitizeAutocompleteProvider(new CombinedAutocompleteProvider(slashCommands, resolveUsableCwd())));
	};
	const clearDynamicSlashCommandsRefreshTimer = () => {
		if (!dynamicSlashCommandsRefreshTimer) return;
		clearTimeout(dynamicSlashCommandsRefreshTimer);
		dynamicSlashCommandsRefreshTimer = null;
	};
	const refreshDynamicSlashCommands = () => {
		clearDynamicSlashCommandsRefreshTimer();
		const key = resolveDynamicSlashCommandsKey();
		if (!dynamicSlashCommandsReady || !state.isConnected || !client.listCommands || dynamicSlashCommandsKey === key || dynamicSlashCommandsInFlightKey === key) return;
		dynamicSlashCommandsInFlightKey = key;
		const requestId = ++dynamicSlashCommandsRequestId;
		const agentId = state.currentAgentId;
		client.listCommands({
			agentId,
			scope: "text",
			includeArgs: false
		}).then((commands) => {
			if (requestId !== dynamicSlashCommandsRequestId || key !== resolveDynamicSlashCommandsKey()) return;
			dynamicSlashCommands = commands;
			dynamicSlashCommandsKey = key;
			applyAutocompleteProvider();
		}).catch(() => void 0).finally(() => {
			if (dynamicSlashCommandsInFlightKey === key) dynamicSlashCommandsInFlightKey = null;
		});
	};
	const scheduleDynamicSlashCommandsRefresh = () => {
		if (!dynamicSlashCommandsReady || dynamicSlashCommandsRefreshTimer || dynamicSlashCommandsKey === resolveDynamicSlashCommandsKey()) return;
		dynamicSlashCommandsRefreshTimer = setTimeout(refreshDynamicSlashCommands, 0);
		dynamicSlashCommandsRefreshTimer.unref?.();
	};
	const updateAutocompleteProvider = () => {
		applyAutocompleteProvider();
		scheduleDynamicSlashCommandsRefresh();
	};
	tui.addChild(root);
	tui.setFocus(editor);
	const formatSessionKey = (key) => {
		if (key === "global" || key === "unknown") return key;
		return parseAgentSessionKey(key)?.rest ?? key;
	};
	const formatAgentLabel = (id) => {
		const name = agentNames.get(id);
		return name ? `${id} (${name})` : id;
	};
	const resolveSessionSelection = (raw) => {
		return resolveTuiSessionSelection({
			raw,
			cfg: config,
			sessionScope: state.sessionScope,
			currentAgentId: state.currentAgentId,
			sessionMainKey: state.sessionMainKey
		});
	};
	currentSessionKey = resolveSessionSelection(initialSessionInput).key;
	const buildLastSessionScopeKeyFor = (sessionKey = currentSessionKey) => {
		const parsed = parseAgentSessionKey(sessionKey);
		return buildTuiLastSessionScopeKey({
			connectionUrl: client.connection.url,
			agentId: parsed?.agentId ?? state.currentAgentId,
			sessionScope: state.sessionScope
		});
	};
	const rememberCurrentSessionKey = (sessionKey) => {
		const trimmed = sessionKey.trim();
		if (!trimmed || trimmed === "unknown") return;
		writeTuiLastSessionKey({
			scopeKey: buildLastSessionScopeKeyFor(trimmed),
			sessionKey: trimmed
		}).catch(() => void 0);
	};
	const restoreRememberedSession = async (expectedConnectionGeneration) => {
		if (initialSessionInput || rememberedSessionApplied) return;
		const remembered = await readTuiLastSessionKey({ scopeKey: buildLastSessionScopeKeyFor() });
		if (expectedConnectionGeneration !== connectionGeneration || !state.isConnected || exitRequested) return;
		const rememberedSelection = remembered ? resolveSessionSelection(remembered) : null;
		const rememberedKey = rememberedSelection?.key ?? null;
		if (!rememberedKey || rememberedKey === currentSessionKey) {
			rememberedSessionApplied = true;
			return;
		}
		const rememberedAgent = rememberedSelection?.agentId;
		if (rememberedAgent && normalizeAgentId(rememberedAgent) !== state.currentAgentId) {
			rememberedSessionApplied = true;
			return;
		}
		const sessions = await client.listSessions({
			limit: 5,
			search: rememberedKey,
			includeGlobal: false,
			includeUnknown: false,
			agentId: state.currentAgentId
		}).catch(() => null);
		if (!sessions || expectedConnectionGeneration !== connectionGeneration || !state.isConnected || exitRequested) return;
		rememberedSessionApplied = true;
		const restored = resolveRememberedTuiSessionKey({
			rememberedKey,
			currentAgentId: state.currentAgentId,
			sessions: sessions.sessions
		});
		if (!restored || restored === currentSessionKey) return;
		currentSessionKey = restored;
		updateHeader();
		updateFooter();
	};
	const updateHeader = () => {
		const sessionLabel = formatSessionKey(currentSessionKey);
		const agentLabel = formatAgentLabel(state.currentAgentId);
		const text = `${opts.title ?? "openclaw tui"} - ${client.connection.url} - agent ${agentLabel} - session ${sessionLabel}`;
		header.setText(tuiTheme.header(sanitizeRenderableLine(text)));
	};
	let statusText = null;
	let statusLoader = null;
	const formatElapsed = (startMs) => {
		const totalSeconds = Math.max(0, Math.floor((Date.now() - startMs) / 1e3));
		if (totalSeconds < 60) return `${totalSeconds}s`;
		return `${Math.floor(totalSeconds / 60)}m ${totalSeconds % 60}s`;
	};
	const ensureStatusText = () => {
		if (statusText) return;
		statusContainer.clear();
		statusLoader?.stop();
		statusLoader = null;
		statusText = new Text("", 1, 0);
		statusContainer.addChild(statusText);
	};
	const ensureStatusLoader = () => {
		if (statusLoader) return;
		statusContainer.clear();
		statusText = null;
		statusLoader = new Loader(tui, (spinner) => tuiTheme.accent(spinner), (text) => tuiTheme.bold(tuiTheme.accentSoft(text)), "");
		statusContainer.addChild(statusLoader);
	};
	let waitingTick = 0;
	let waitingTimer = null;
	let waitingPhrase = null;
	const updateBusyStatusMessage = () => {
		if (!statusLoader || !statusStartedAt) return;
		const elapsed = formatElapsed(statusStartedAt);
		if (state.activityStatus === "waiting") {
			waitingTick++;
			statusLoader.setMessage(buildWaitingStatusMessage({
				theme: tuiTheme,
				tick: waitingTick,
				elapsed,
				connectionStatus: state.connectionStatus,
				phrases: waitingPhrase ? [waitingPhrase] : void 0
			}));
			return;
		}
		statusLoader.setMessage(`${state.activityStatus} • ${elapsed} | ${state.connectionStatus}`);
	};
	const startStatusTimer = () => {
		if (statusTimer) return;
		statusTimer = setInterval(() => {
			if (!isTuiBusyActivityStatus(state.activityStatus)) return;
			updateBusyStatusMessage();
		}, 1e3);
	};
	const stopStatusTimer = () => {
		if (!statusTimer) return;
		clearInterval(statusTimer);
		statusTimer = null;
	};
	const stopStatusTimeout = () => {
		if (!state.statusTimeout) return;
		clearTimeout(state.statusTimeout);
		state.statusTimeout = null;
	};
	const startWaitingTimer = () => {
		if (waitingTimer) return;
		if (!waitingPhrase) waitingPhrase = defaultWaitingPhrases[Math.floor(Math.random() * defaultWaitingPhrases.length)] ?? defaultWaitingPhrases[0] ?? "waiting";
		waitingTick = 0;
		waitingTimer = setInterval(() => {
			if (state.activityStatus !== "waiting") return;
			updateBusyStatusMessage();
		}, 120);
	};
	const stopWaitingTimer = () => {
		if (!waitingTimer) return;
		clearInterval(waitingTimer);
		waitingTimer = null;
		waitingPhrase = null;
	};
	const disposeStatus = () => {
		stopStatusTimer();
		stopWaitingTimer();
		stopStatusTimeout();
		clearDynamicSlashCommandsRefreshTimer();
		dynamicSlashCommandsRequestId += 1;
		statusLoader?.stop();
		statusLoader = null;
	};
	const renderStatus = () => {
		if (isTuiBusyActivityStatus(state.activityStatus)) {
			if (!statusStartedAt || lastActivityStatus !== state.activityStatus) statusStartedAt = Date.now();
			ensureStatusLoader();
			if (state.activityStatus === "waiting") {
				stopStatusTimer();
				startWaitingTimer();
			} else {
				stopWaitingTimer();
				startStatusTimer();
			}
			updateBusyStatusMessage();
		} else {
			statusStartedAt = null;
			stopStatusTimer();
			stopWaitingTimer();
			statusLoader?.stop();
			statusLoader = null;
			ensureStatusText();
			const text = state.activityStatus ? `${state.connectionStatus} | ${state.activityStatus}` : state.connectionStatus;
			statusText?.setText(tuiTheme.dim(text));
		}
		lastActivityStatus = state.activityStatus;
	};
	const setConnectionStatus = (text, ttlMs) => {
		state.connectionStatus = sanitizeRenderableLine(text);
		renderStatus();
		if (state.statusTimeout) stopStatusTimeout();
		if (ttlMs && ttlMs > 0) state.statusTimeout = setTimeout(() => {
			state.connectionStatus = state.isConnected ? isLocalMode ? "local ready" : "connected" : isLocalMode ? "local stopped" : "disconnected";
			renderStatus();
		}, ttlMs);
	};
	const setActivityStatus = (text) => {
		state.activityStatus = text;
		renderStatus();
	};
	const withTuiSuspended = async (work) => {
		await drainAndStopTuiSafely(tui);
		if (isLocalMode) setConsoleSubsystemFilter(previousConsoleSubsystemFilter);
		try {
			return await work();
		} finally {
			if (isLocalMode) setConsoleSubsystemFilter(["__openclaw_tui_quiet__"]);
			tui.start();
			tui.setFocus(editor);
			updateHeader();
			updateFooter();
			tui.requestRender(true);
		}
	};
	const runAuthFlow = isLocalMode ? async (params) => await withTuiSuspended(async () => {
		const provider = params.provider?.trim() || void 0;
		const codexBin = provider === OPENAI_CODEX_PROVIDER || !provider && state.sessionInfo.modelProvider === OPENAI_CODEX_PROVIDER ? await resolveCodexCliBin() : null;
		return await new Promise((resolve, reject) => {
			let command;
			let args;
			let cwd;
			if (codexBin) {
				command = codexBin;
				args = ["login"];
				cwd = resolveUsableCwd();
			} else {
				const invocation = resolveTuiLocalAuthCliInvocation({ provider });
				({command, args, cwd} = invocation);
			}
			const invocation = resolveLocalAuthSpawnInvocation({
				command,
				args
			});
			const child = spawn(invocation.command, invocation.args, {
				cwd,
				env: process.env,
				stdio: "inherit",
				...invocation.options
			});
			child.once("error", reject);
			child.once("exit", (exitCode, signal) => {
				resolve({
					exitCode,
					signal
				});
			});
		});
	}) : void 0;
	const updateFooter = () => {
		const sessionKeyLabel = formatSessionKey(currentSessionKey);
		const sessionLabel = state.sessionInfo.displayName ? `${sessionKeyLabel} (${state.sessionInfo.displayName})` : sessionKeyLabel;
		const agentLabel = formatAgentLabel(state.currentAgentId);
		footer.setText(tuiTheme.dim(formatTuiFooter({
			agentLabel,
			sessionLabel,
			sessionInfo: state.sessionInfo,
			thinkingLevel: thinkingLevelOverride ?? state.sessionInfo.thinkingLevel,
			deliver: deliverDefault
		})));
	};
	const { openOverlay, closeOverlay } = createOverlayHandlers(tui, editor);
	const pluginApprovals = createTuiPluginApprovalController({
		client,
		chatLog,
		getAgentId: () => state.currentAgentId,
		getSessionKey: () => currentSessionKey,
		openOverlay,
		closeOverlay,
		requestRender: () => tui.requestRender()
	});
	const btw = {
		showResult: (params) => {
			chatLog.showBtw(params);
		},
		clear: () => {
			chatLog.dismissBtw();
		}
	};
	const { refreshAgents, refreshSessionInfo, applySessionInfoFromPatch, applySessionMutationResult, loadHistory: loadHistorySnapshot, setSession, abortActive } = createSessionActions({
		client,
		chatLog,
		btw,
		tui,
		opts,
		state,
		agentNames,
		initialSessionInput,
		initialSessionAgentId: (() => {
			if (!initialSessionInput) return null;
			return currentAgentId;
		})(),
		resolveSessionSelection,
		updateHeader,
		updateFooter,
		updateAutocompleteProvider,
		setActivityStatus,
		invalidateRunOwnership: () => invalidateSessionRunOwnership(),
		clearLocalRunIds: localRunIds.clear,
		rememberSessionKey: rememberCurrentSessionKey
	});
	const loadHistory = async (options) => {
		const activeRunAtStart = state.activeChatRunId;
		const result = await loadHistorySnapshot();
		if (result.loaded) {
			if (options?.retireMissingReconnectRun === true && activeRunAtStart && !result.inFlightRunId && activeRunAtStart === state.activeChatRunId) retireHistoryAbsentRun(activeRunAtStart);
			restoreConnectionNotices();
			tui.requestRender();
		}
		return result;
	};
	const taskSuggestions = createTuiTaskSuggestionController({
		client,
		chatLog,
		getAgentId: () => currentAgentId,
		getSessionKey: () => currentSessionKey,
		openOverlay,
		closeOverlay,
		requestRender: () => tui.requestRender(),
		onAccepted: setSession
	});
	const { handleChatEvent, handleAgentEvent, handleBtwEvent, handleSessionsChangedEvent, handleSessionMessageEvent, pauseStreamingWatchdog, reconnectStreamingWatchdog, consumeCompletedRunForPendingSend, isRunObserved, reconcileHistoryAfterGap, flushPendingHistoryRefreshIfIdle, dispose: disposeEventHandlers } = createEventHandlers({
		chatLog,
		btw,
		tui,
		state,
		localMode: isLocalMode,
		setActivityStatus,
		refreshSessionInfo,
		loadHistory,
		noteLocalRunId: localRunIds.note,
		isLocalRunId: localRunIds.has,
		forgetLocalRunId: localRunIds.forget,
		clearLocalRunIds: localRunIds.clear,
		isLocalBtwRunId: localBtwRunIds.has,
		forgetLocalBtwRunId: localBtwRunIds.forget,
		clearLocalBtwRunIds: localBtwRunIds.clear
	});
	retireHistoryAbsentRun = () => reconnectStreamingWatchdog(null);
	invalidateSessionRunOwnership = () => {
		disposeEventHandlers();
		state.activeChatRunId = null;
		setActivityStatus("idle");
	};
	const deferredFinish = createDeferredTuiFinish();
	let disposeSubmitBurst = () => {};
	const forceExit = () => {
		try {
			process.stderr.write("openclaw tui forcing exit\n");
		} catch {}
		process.exit(130);
	};
	const requestExit = (result) => {
		if (exitRequested) {
			forceExit();
			return;
		}
		exitRequested = true;
		disposeSubmitBurst();
		connectionGeneration += 1;
		exitResult = {
			exitReason: result?.exitReason ?? "exit",
			...result?.systemAgentMessage ? { systemAgentMessage: result.systemAgentMessage } : {}
		};
		disposeEventHandlers();
		pluginApprovals?.dispose();
		taskSuggestions?.dispose();
		beginTuiShutdown({
			stopClient: () => client.stop(),
			stopTui: () => drainAndStopTuiSafely(tui),
			disposeStatus,
			requestFinish: deferredFinish.requestFinish,
			forceExit,
			hardExitMs: resolveTuiShutdownHardExitMs({ localMode: isLocalMode }),
			keepHardExitArmed: opts.forceProcessExitOnReturn === true,
			onError: (err) => {
				if (!isTuiTerminalLossError(err)) try {
					process.stderr.write(`openclaw tui shutdown failed: ${formatTuiErrorMessage(err)}\n`);
				} catch {}
			}
		});
	};
	client.setRequestExitHandler?.(() => requestExit());
	const { handleCommand, sendMessage, captureMessageAdmission, resolveMessageAdmission, reportBlockedMessageSubmit, openModelSelector, openAgentSelector, openSessionSelector } = createCommandHandlers({
		client,
		chatLog,
		tui,
		opts: {
			...opts,
			local: isLocalMode
		},
		state,
		deliverDefault,
		openOverlay,
		closeOverlay,
		refreshSessionInfo,
		applySessionInfoFromPatch,
		applySessionMutationResult,
		loadHistory,
		setSession,
		refreshAgents,
		abortActive,
		setActivityStatus,
		formatSessionKey,
		noteLocalRunId: localRunIds.note,
		noteLocalBtwRunId: localBtwRunIds.note,
		forgetLocalRunId: localRunIds.forget,
		forgetLocalBtwRunId: localBtwRunIds.forget,
		consumeCompletedRunForPendingSend,
		isRunObserved,
		flushPendingHistoryRefreshIfIdle,
		runAuthFlow,
		requestExit
	});
	const { runLocalShellLine } = createLocalShellRunner({
		chatLog,
		tui,
		openOverlay,
		closeOverlay
	});
	updateAutocompleteProvider();
	const notifySubmitError = (action, error) => {
		const message = formatTuiErrorMessage(error);
		chatLog.addSystem(`${action} submit failed: ${message}`);
		tui.requestRender();
	};
	const submitBurst = createSubmitBurstCoalescer({
		submit: createEditorSubmitHandler({
			editor,
			handleCommand,
			sendMessage,
			handleBangLine: runLocalShellLine,
			onSubmitError: notifySubmitError,
			admitMessage: resolveMessageAdmission,
			onBlockedMessageSubmit: reportBlockedMessageSubmit
		}),
		captureSnapshot: captureMessageAdmission,
		enabled: opts.submitBurstWindowMs !== void 0 || shouldEnableWindowsGitBashPasteFallback(),
		burstWindowMs: opts.submitBurstWindowMs,
		onCapture: opts.onSubmitBurstCaptured
	});
	disposeSubmitBurst = submitBurst.dispose;
	editor.onSubmit = submitBurst;
	editor.onEscape = () => {
		if (chatLog.hasVisibleBtw()) {
			chatLog.dismissBtw();
			tui.requestRender();
			return;
		}
		abortActive();
	};
	const handleCtrlC = () => {
		const now = Date.now();
		const decision = resolveTuiCtrlCAction({
			hasInput: editor.getText().length > 0,
			now,
			lastCtrlCAt: state.lastCtrlCAt,
			exitRequested,
			wasDisconnected,
			exitWindowMs: opts.ctrlCExitWindowMs
		});
		if (decision.action === "force-exit") {
			forceExit();
			return;
		}
		state.lastCtrlCAt = decision.nextLastCtrlCAt;
		if (decision.action === "clear") {
			editor.setText("");
			setActivityStatus("cleared input; press ctrl+c again to exit");
			tui.requestRender();
			return;
		}
		if (decision.action === "exit") {
			requestExit();
			return;
		}
		setActivityStatus("press ctrl+c again to exit");
		tui.requestRender();
	};
	editor.onCtrlC = () => {
		handleCtrlC();
	};
	editor.onCtrlD = () => {
		requestExit();
	};
	editor.onCtrlO = () => {
		state.toolsExpanded = !state.toolsExpanded;
		chatLog.setToolsExpanded(state.toolsExpanded);
		setActivityStatus(resolveTuiToolsToggleActivityStatus({
			currentStatus: state.activityStatus,
			toolsExpanded: state.toolsExpanded
		}));
		tui.requestRender();
	};
	editor.onCtrlL = () => {
		openModelSelector();
	};
	editor.onCtrlG = () => {
		openAgentSelector();
	};
	editor.onCtrlP = () => {
		openSessionSelector();
	};
	editor.onCtrlT = () => {
		state.showThinking = !state.showThinking;
		loadHistory();
	};
	tui.addInputListener((data) => {
		if (tui.hasOverlay() || !chatLog.hasVisibleBtw()) return;
		if (editor.getText().length > 0) return;
		if (matchesKey(data, "enter")) {
			chatLog.dismissBtw();
			tui.requestRender();
			return { consume: true };
		}
	});
	client.onEvent = (evt) => {
		if (exitRequested) return;
		pluginApprovals?.handleEvent(evt.event, evt.payload);
		taskSuggestions?.handleEvent(evt.event, evt.payload);
		if (evt.event === "chat") handleChatEvent(evt.payload);
		if (evt.event === "chat.side_result") handleBtwEvent(evt.payload);
		if (evt.event === "agent") handleAgentEvent(evt.payload);
		if (evt.event === "sessions.changed") handleSessionsChangedEvent(evt.payload);
		if (evt.event === "session.message") handleSessionMessageEvent(evt.payload);
	};
	client.onConnected = () => {
		if (exitRequested) return;
		const connectedGeneration = ++connectionGeneration;
		const ownsConnection = () => connectedGeneration === connectionGeneration && state.isConnected && !exitRequested;
		state.isConnected = true;
		remediationShown = false;
		const reconnected = wasDisconnected;
		wasDisconnected = false;
		if (reconnected) reconnectStreamingWatchdog();
		setConnectionStatus(isLocalMode ? "local ready" : "connected");
		if (!isTuiBusyActivityStatus(state.activityStatus)) setActivityStatus("starting up");
		(async () => {
			for (let attempt = 0; attempt < SESSION_SUBSCRIPTION_MAX_ATTEMPTS; attempt += 1) try {
				await client.subscribeSessionEvents?.();
				break;
			} catch (err) {
				if (!ownsConnection()) return;
				if (attempt + 1 === SESSION_SUBSCRIPTION_MAX_ATTEMPTS) {
					chatLog.addSystem(`session event subscribe failed: ${formatTuiErrorMessage(err)}`);
					if (state.activityStatus === "starting up") setActivityStatus("idle");
					setConnectionStatus("session event subscription failed");
					tui.requestRender();
					return;
				}
				await setTimeout$1(SESSION_SUBSCRIPTION_RETRY_DELAY_MS * (attempt + 1));
				if (!ownsConnection()) return;
			}
			if (!ownsConnection()) return;
			await refreshAgents();
			if (!ownsConnection()) return;
			await restoreRememberedSession(connectedGeneration);
			if (!ownsConnection()) return;
			updateHeader();
			updateAutocompleteProvider();
			try {
				await pluginApprovals?.refresh();
			} catch (err) {
				if (!ownsConnection()) return;
				chatLog.addSystem(`plugin approval refresh failed: ${formatTuiErrorMessage(err)}`);
			}
			if (!ownsConnection()) return;
			try {
				await taskSuggestions?.refresh();
			} catch (err) {
				if (!ownsConnection()) return;
				chatLog.addSystem(`task suggestion refresh failed: ${formatTuiErrorMessage(err)}`);
			}
			if (!ownsConnection()) return;
			await loadHistory({ retireMissingReconnectRun: reconnected });
			if (!ownsConnection()) return;
			if (state.activityStatus === "starting up") setActivityStatus("idle");
			if (reconnected) addConnectionNotice("gateway reconnected after transport loss");
			setConnectionStatus(isLocalMode ? "local ready" : reconnected ? "gateway reconnected" : "gateway connected", 4e3);
			tui.requestRender();
			dynamicSlashCommandsReady = true;
			scheduleDynamicSlashCommandsRefresh();
			if (!state.autoMessageSent && autoMessage) {
				state.autoMessageSent = true;
				await sendMessage(autoMessage);
				if (!ownsConnection()) return;
			}
			updateFooter();
			tui.requestRender();
		})().catch((err) => {
			if (!ownsConnection()) return;
			chatLog.addSystem(`startup failed: ${formatTuiErrorMessage(err)}`);
			if (state.activityStatus === "starting up") setActivityStatus("idle");
			setConnectionStatus("startup failed", 5e3);
			tui.requestRender();
		});
	};
	const handleBackendDisconnected = (reason, details) => {
		if (exitRequested) return;
		connectionGeneration += 1;
		state.isConnected = false;
		wasDisconnected = true;
		state.historyLoaded = false;
		dynamicSlashCommands = [];
		dynamicSlashCommandsKey = null;
		dynamicSlashCommandsInFlightKey = null;
		dynamicSlashCommandsReady = false;
		clearDynamicSlashCommandsRefreshTimer();
		dynamicSlashCommandsRequestId += 1;
		updateAutocompleteProvider();
		pauseStreamingWatchdog();
		const disconnectState = isLocalMode ? {
			connectionStatus: `local runtime stopped${reason ? `: ${reason}` : ""}`,
			activityStatus: "idle",
			remediation: void 0
		} : resolveGatewayDisconnectState({
			reason,
			details
		});
		setConnectionStatus(disconnectState.connectionStatus, 5e3);
		setActivityStatus(disconnectState.activityStatus);
		if (disconnectState.remediation && !remediationShown) {
			remediationShown = true;
			chatLog.addSystem(disconnectState.remediation);
		}
		updateFooter();
		tui.requestRender();
	};
	client.onConnectError = (error) => {
		const details = "details" in error ? error.details : void 0;
		handleBackendDisconnected(formatTuiErrorMessage(error), details);
	};
	client.onDisconnected = handleBackendDisconnected;
	client.onGap = (info) => {
		if (exitRequested || !state.isConnected) return;
		setConnectionStatus(`event gap: expected ${info.expected}, got ${info.received}`, 5e3);
		addConnectionNotice(`gateway event gap: expected ${info.expected}, got ${info.received}`);
		reconcileHistoryAfterGap();
		(async () => {
			try {
				await pluginApprovals?.refresh();
			} catch (err) {
				chatLog.addSystem(`plugin approval refresh failed: ${formatTuiErrorMessage(err)}`);
			}
			try {
				await taskSuggestions?.refresh();
			} catch (err) {
				chatLog.addSystem(`task suggestion refresh failed: ${formatTuiErrorMessage(err)}`);
			}
		})();
		tui.requestRender();
	};
	updateHeader();
	setConnectionStatus(isLocalMode ? "starting local runtime" : "connecting");
	updateFooter();
	const { sigintHandler, sigtermHandler, sighupHandler } = createTuiSignalHandlers({
		handleCtrlC,
		requestExit
	});
	process.on("SIGINT", sigintHandler);
	process.on("SIGTERM", sigtermHandler);
	process.on("SIGHUP", sighupHandler);
	let cleanupTerminalLossHandler = installTuiTerminalLossExitHandler(() => requestExit());
	tui.start();
	client.start();
	await new Promise((resolve) => {
		const finish = () => {
			disposeStatus();
			disposeEventHandlers();
			pluginApprovals?.dispose();
			taskSuggestions?.dispose();
			if (isLocalMode) setConsoleSubsystemFilter(previousConsoleSubsystemFilter);
			cleanupTerminalLossHandler?.();
			cleanupTerminalLossHandler = null;
			process.removeListener("SIGINT", sigintHandler);
			process.removeListener("SIGTERM", sigtermHandler);
			process.removeListener("SIGHUP", sighupHandler);
			process.removeListener("exit", finish);
			deferredFinish.clearFinish();
			resolve();
		};
		process.once("exit", finish);
		deferredFinish.setFinish(finish);
	});
	if (opts.forceProcessExitOnReturn === true) scheduleProcessExitAfterTuiReturn();
	return exitResult;
}
//#endregion
export { stopTuiSafely as C, shouldEnableWindowsGitBashPasteFallback as D, createSubmitBurstCoalescer as E, scheduleProcessExitAfterTuiReturn as S, createEditorSubmitHandler as T, resolveTuiSessionKey as _, drainAndStopTuiSafely as a, resolveTuiToolsToggleActivityStatus as b, isTuiBusyActivityStatus as c, resolveCtrlCAction as d, resolveGatewayDisconnectState as f, resolveTuiLocalAuthCliInvocation as g, resolveTuiCtrlCAction as h, createTuiSignalHandlers as i, isTuiTerminalLossError as l, resolveLocalAuthSpawnInvocation as m, createBackspaceDeduper as n, installTuiTerminalLossExitHandler as o, resolveInitialTuiAgentId as p, createDeferredTuiFinish as r, isIgnorableTuiStopError as s, beginTuiShutdown as t, resolveCodexCliBin as u, resolveTuiSessionSelection as v, withEmbeddedTuiStateLock as w, runTui as x, resolveTuiShutdownHardExitMs as y };
