import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { u as redactToolPayloadText } from "./redact-Cl7lwBnl.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { Ln as strictObject, Rn as string, wn as number, yt as _enum } from "./schemas-CZ9Toj_c.js";
import { at as normalizeAgentRunTerminalReplySnapshot } from "./openclaw-state-db-DlCMR4eQ.js";
import { $t as loadSessionEntryReadOnly, en as patchSessionEntryCore } from "./session-accessor-Bi6bzKQE.js";
import { Df as SESSION_OBSERVER_HEALTH_VALUES } from "./src-Bo4ezI_n.js";
import { t as resolveSessionSubscriptionKey } from "./session-subscription-keys-KDeUeJtW.js";
import { i as terminalHealthFor } from "./session-activity-notes-D5wEFVAJ.js";
//#region src/gateway/session-observer-model.ts
const HEADLINE_MAX_CHARS = 120;
const ASSESSMENT_MAX_CHARS = 320;
const MAX_REVISION_FLOORS = 256;
const MAX_SUPERSEDED_RUNS = 256;
const MAX_DORMANT_RUNS = 256;
const MAX_DISABLED_RUNS = 512;
function sessionObserverScopeKey(sessionKey, agentId) {
	return parseAgentSessionKey(sessionKey) ? sessionKey : `agent:${normalizeAgentId(agentId)}:${sessionKey}`;
}
function rememberSessionObserverRevisionFloor(floors, sessionKey, candidate) {
	const current = floors.get(sessionKey);
	if (!current || candidate.revision > current.revision) {
		floors.delete(sessionKey);
		floors.set(sessionKey, candidate);
	}
	pruneMapToMaxSize(floors, MAX_REVISION_FLOORS);
}
function rememberSessionObserverDormantRun(runs, floors, run) {
	runs.delete(run.runId);
	runs.set(run.runId, run);
	while (runs.size > MAX_DORMANT_RUNS) {
		const oldest = runs.keys().next().value;
		if (oldest === void 0) break;
		const evicted = runs.get(oldest);
		runs.delete(oldest);
		if (evicted) rememberSessionObserverRevisionFloor(floors, resolveSessionSubscriptionKey(evicted.sessionKey, evicted.agentId), {
			revision: evicted.revision,
			previousDigest: evicted.previousDigest
		});
	}
}
function rememberSessionObserverDisabledRun(runs, runId) {
	runs.delete(runId);
	runs.add(runId);
	while (runs.size > MAX_DISABLED_RUNS) {
		const oldest = runs.values().next().value;
		if (oldest === void 0) break;
		runs.delete(oldest);
	}
}
function markSessionObserverRunSuperseded(runs, runId, observedAt) {
	runs.delete(runId);
	runs.set(runId, observedAt);
	pruneMapToMaxSize(runs, MAX_SUPERSEDED_RUNS);
}
function createDormantSessionObserverRun(state) {
	return {
		sessionKey: state.sessionKey,
		sessionId: state.sessionId,
		runId: state.runId,
		agentId: state.agentId,
		...state.utilityModelRef ? { utilityModelRef: state.utilityModelRef } : {},
		startedAt: state.startedAt,
		lastPersistedAt: state.lastPersistedAt,
		revision: state.revision,
		digestCount: state.digestCount,
		consecutiveFailures: state.consecutiveFailures,
		...state.lastPublishedPreambleHeadline ? { lastPreambleHeadline: state.lastPublishedPreambleHeadline } : {},
		planProgress: state.planProgress,
		previousDigest: state.previousDigest
	};
}
let completionRuntimePromise;
function loadCompletionRuntime() {
	completionRuntimePromise ??= import("./simple-completion-runtime-DDn5DIze.js");
	return completionRuntimePromise;
}
async function defaultPrepareModel(params) {
	return await (await loadCompletionRuntime()).prepareSimpleCompletionModelForAgent(params);
}
async function defaultCompleteModel(params) {
	return await (await loadCompletionRuntime()).completeWithPreparedSimpleCompletionModel(params);
}
const SESSION_OBSERVER_SYSTEM_PROMPT = [
	"You judge the trajectory of a running AI agent session for an operator status surface.",
	"Judge whether the agent is progressing, grinding through necessary work, stuck in a repeated failing loop, waiting on the user, wrapping up, done, or failed.",
	"Do not transcribe the activity log. Summarize what it is doing and how it is going.",
	"Use American English and present tense. Do not use markdown in string values.",
	"Set health to exactly one of \"on-track\", \"grinding\", \"stuck\", \"waiting-on-user\", \"wrapping-up\", \"done\", or \"failed\".",
	"Return strict JSON only, for example: {\"headline\":\"Checking the fix\",\"assessment\":\"Tests are passing.\",\"health\":\"on-track\",\"planProgress\":{\"completed\":2,\"total\":3}}. Omit optional fields instead of setting them to null."
].join(" ");
const ModelDigestSchema = strictObject({
	headline: string().min(1),
	assessment: string().min(1).optional(),
	health: _enum(SESSION_OBSERVER_HEALTH_VALUES),
	planProgress: strictObject({
		completed: number().int().nonnegative(),
		total: number().int().nonnegative()
	}).refine((value) => value.completed <= value.total).optional()
}).strict();
function sanitizeSessionObserverModelText(value, maxChars) {
	return truncateUtf16Safe(redactToolPayloadText(value).replace(/\s+/gu, " ").trim(), maxChars);
}
function defaultReadSession(sessionKey, agentId) {
	return loadSessionEntryReadOnly({
		sessionKey,
		agentId
	});
}
async function defaultPersistDigest(params) {
	let missingEntry = false;
	if (await patchSessionEntryCore({
		sessionKey: params.sessionKey,
		agentId: params.agentId
	}, (entry, context) => {
		if (!context.existingEntry) {
			missingEntry = true;
			return null;
		}
		if (params.stillCurrent?.() === false) return null;
		if (params.sessionId && entry.sessionId !== params.sessionId) return null;
		if ((entry.observerDigest?.revision ?? 0) >= params.digest.revision) return null;
		return { observerDigest: params.digest };
	}, { preserveActivity: true })) return true;
	return missingEntry ? null : false;
}
function isTerminalLifecycleEvent(event) {
	return event.stream === "lifecycle" && (event.data.phase === "end" || event.data.phase === "error");
}
async function synthesizeSessionObserverTerminalDigest(params) {
	const runId = params.source.event?.runId ?? params.source.state?.runId;
	if (!runId) return;
	const sessionKey = params.source.event?.sessionKey ?? params.source.state?.sessionKey ?? params.dormant?.sessionKey;
	const agentId = params.source.event?.agentId ?? params.source.state?.agentId ?? params.dormant?.agentId;
	const health = params.source.event ? terminalHealthFor(params.source.event) : params.source.state?.terminalHealth;
	if (!sessionKey || !agentId || !health) return;
	const session = params.readSession(sessionKey, agentId);
	const previous = [
		params.source.state?.previousDigest,
		params.dormant?.previousDigest,
		session?.observerDigest
	].find((digest) => digest?.runId === runId);
	if (!previous) return;
	const sessionId = params.source.state?.sessionId ?? params.dormant?.sessionId ?? session?.sessionId;
	const terminalReply = params.source.event ? normalizeAgentRunTerminalReplySnapshot(params.source.event.data.terminalReply) : params.source.state?.terminalReply;
	const terminalHeadline = terminalReply?.disposition === "visible" ? sanitizeSessionObserverModelText(terminalReply.text, HEADLINE_MAX_CHARS) : void 0;
	const persistBounded = async (candidate) => {
		let lastError;
		for (let attempt = 0; attempt < 2; attempt += 1) {
			if (params.stillCurrent?.() === false) return false;
			try {
				return await params.persistDigest({
					sessionKey,
					sessionId,
					agentId,
					digest: candidate,
					stillCurrent: params.stillCurrent
				}) === true;
			} catch (error) {
				lastError = error;
			}
		}
		throw lastError;
	};
	if (previous.health === health) {
		if (previous.revision > (session?.observerDigest?.revision ?? 0)) await persistBounded(previous);
		return;
	}
	const digest = {
		...previous,
		sessionKey,
		agentId,
		runId,
		health,
		...terminalHeadline ? { headline: terminalHeadline } : {},
		revision: previous.revision + 1,
		updatedAt: params.now()
	};
	return await persistBounded(digest) ? digest : void 0;
}
function buildSessionObserverPrompt(state, notes) {
	return JSON.stringify({
		previousDigest: state.previousDigest ?? null,
		newNotes: notes,
		planProgress: state.planProgress ?? null
	});
}
/** Validates strict model JSON and applies the protocol's hard string caps. */
function normalizeSessionObserverModelOutput(text) {
	let parsed;
	try {
		parsed = JSON.parse(text.trim());
	} catch {
		return null;
	}
	const result = ModelDigestSchema.safeParse(parsed);
	if (!result.success) return null;
	const headline = sanitizeSessionObserverModelText(result.data.headline, HEADLINE_MAX_CHARS);
	const assessment = result.data.assessment ? sanitizeSessionObserverModelText(result.data.assessment, ASSESSMENT_MAX_CHARS) : void 0;
	if (!headline || result.data.assessment && !assessment) return null;
	return {
		headline,
		...assessment ? { assessment } : {},
		health: result.data.health,
		...result.data.planProgress ? { planProgress: result.data.planProgress } : {}
	};
}
//#endregion
export { defaultPersistDigest as a, isTerminalLifecycleEvent as c, rememberSessionObserverDisabledRun as d, rememberSessionObserverDormantRun as f, synthesizeSessionObserverTerminalDigest as h, defaultCompleteModel as i, markSessionObserverRunSuperseded as l, sessionObserverScopeKey as m, buildSessionObserverPrompt as n, defaultPrepareModel as o, rememberSessionObserverRevisionFloor as p, createDormantSessionObserverRun as r, defaultReadSession as s, SESSION_OBSERVER_SYSTEM_PROMPT as t, normalizeSessionObserverModelOutput as u };
