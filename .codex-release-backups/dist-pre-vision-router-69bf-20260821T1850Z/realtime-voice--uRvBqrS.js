import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { t as asBoolean } from "./boolean-DmBL0YJK.js";
import { F as resolveTimerTimeoutMs, M as resolveNonNegativeIntegerOption } from "./number-coercion-oCkfUEEq.js";
import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { r as withTimeout } from "./timing-DpgMro2Q.js";
import { r as formatErrorMessage } from "./errors-CqPTYU6G.js";
import "./with-timeout-BolVqLUB.js";
import { i as getActiveMemorySearchManagerCore, t as authorizeActiveMemorySearchHits } from "./memory-runtime-CVV4sSeL.js";
import { c as sortRealtimeVoiceActivationNames, o as normalizeSupportedRealtimeVoiceActivationName } from "./activation-name-BgBhI-hm.js";
import { E as buildRealtimeVoiceAgentConsultChatMessage, I as resolveRealtimeVoiceAgentConsultToolsAllow, N as parseRealtimeVoiceAgentConsultArgs, P as resolveRealtimeVoiceAgentConsultToolPolicy } from "./realtime-session-harness-DSORoVBM.js";
import "./agent-run-control-Cg46VFce.js";
import "./audio-energy-DF0tOiok.js";
//#region src/talk/consult-transcript.ts
/**
* Transcript guardrails for realtime voice agent consults.
*
* ASR often emits partial fragments or polite closings that should not trigger
* an OpenClaw consult. This classifier names those skip reasons for callers.
*/
const REALTIME_VOICE_CONSULT_TRAILING_FRAGMENT_WORDS = /* @__PURE__ */ new Set([
	"a",
	"about",
	"an",
	"and",
	"as",
	"at",
	"because",
	"but",
	"by",
	"for",
	"from",
	"in",
	"of",
	"on",
	"or",
	"so",
	"that",
	"the",
	"then",
	"to",
	"with"
]);
/** Classify transcript text that is empty, incomplete, fragmented, or non-actionable. */
function classifySkippableRealtimeVoiceConsultTranscript(text) {
	const normalized = text.replace(/\s+/g, " ").trim().toLowerCase();
	if (!normalized) return "empty";
	if (/(\.\.\.|…)\s*$/.test(normalized)) return "incomplete-transcript";
	const lastWord = normalized.match(/[a-z']+$/)?.[0]?.replace(/^'+|'+$/g, "");
	if (lastWord && REALTIME_VOICE_CONSULT_TRAILING_FRAGMENT_WORDS.has(lastWord)) return "trailing-fragment";
	if (!normalized.includes("?") && (/^(i'?ll|i will) be (right )?back\b/.test(normalized) || /\b(see you|bye(?:-bye)?|goodbye)\b/.test(normalized))) return "non-actionable-closing";
}
//#endregion
//#region src/talk/turn-context-tracker.ts
const DEFAULT_REALTIME_VOICE_TURN_CONTEXT_LIMIT = 32;
const DEFAULT_REALTIME_VOICE_IGNORED_CONTEXT_TTL_MS = 1e4;
function createRealtimeVoiceTurnContextTracker(options = {}) {
	const turns = [];
	let recentIgnoredContext;
	let nextId = 0;
	const owner = Symbol("realtimeVoiceTurnContextTracker");
	const now = options.now ?? Date.now;
	const limit = resolveNonNegativeIntegerOption(options.limit, DEFAULT_REALTIME_VOICE_TURN_CONTEXT_LIMIT);
	const ignoredContextTtlMs = resolveNonNegativeIntegerOption(options.ignoredContextTtlMs, DEFAULT_REALTIME_VOICE_IGNORED_CONTEXT_TTL_MS);
	const deferUntilAudio = options.deferUntilAudio === true;
	const prune = () => {
		for (let index = turns.length - 1; index >= 0; index -= 1) {
			const turn = turns[index];
			if (turn?.closed && !turn.hasAudio) turns.splice(index, 1);
		}
		while (turns.length > limit) {
			const completedIndex = turns.findIndex((turn) => turn.closed);
			turns.splice(Math.max(completedIndex, 0), 1);
		}
	};
	const expireClosedTurnsBeforeLaterAudio = () => {
		let hasLaterAudio = false;
		for (let index = turns.length - 1; index >= 0; index -= 1) {
			const turn = turns[index];
			if (!turn?.hasAudio) continue;
			if (turn.closed && hasLaterAudio) {
				turns.splice(index, 1);
				continue;
			}
			hasLaterAudio = true;
		}
	};
	const prepareForAudioContextRead = () => {
		prune();
		expireClosedTurnsBeforeLaterAudio();
	};
	const owns = (handle) => handle[owner] === true;
	return {
		open(context, ...extra) {
			const startedAt = now();
			const handle = {
				...extra[0] ?? {},
				[owner]: true,
				id: `realtime-turn:${startedAt}:${++nextId}`,
				context,
				hasAudio: false,
				closed: false,
				startedAt
			};
			if (!deferUntilAudio) {
				turns.push(handle);
				prune();
			}
			return handle;
		},
		markAudio(handle) {
			if (!owns(handle)) return;
			handle.hasAudio = true;
			handle.lastAudioAt = now();
			if (!turns.includes(handle)) {
				turns.push(handle);
				prune();
			}
		},
		close(handle) {
			if (!owns(handle)) return;
			handle.closed = true;
			if (!turns.includes(handle)) return;
			prune();
		},
		consumeAudioContext() {
			prepareForAudioContextRead();
			const index = turns.findIndex((turn) => turn.hasAudio);
			if (index < 0) return;
			const [turn] = turns.splice(index, 1);
			prune();
			return turn?.context;
		},
		peekAudioTurn() {
			prepareForAudioContextRead();
			return turns.find((turn) => turn.hasAudio);
		},
		hasAudioContext() {
			prepareForAudioContextRead();
			return turns.some((turn) => turn.hasAudio);
		},
		rememberIgnoredContext(context) {
			if (context === void 0) return;
			recentIgnoredContext = {
				context,
				createdAt: now()
			};
		},
		consumeIgnoredContext() {
			const recent = recentIgnoredContext;
			recentIgnoredContext = void 0;
			if (!recent || now() - recent.createdAt > ignoredContextTtlMs) return;
			return recent.context;
		},
		size() {
			prune();
			return turns.length;
		},
		clear() {
			turns.length = 0;
			recentIgnoredContext = void 0;
		}
	};
}
//#endregion
//#region src/talk/exact-speech-protocol.ts
/** Build the internal user message that asks a realtime model to speak exact text. */
function buildRealtimeVoiceSpeakExactMessage(params) {
	return [
		"Internal OpenClaw voice playback result.",
		"Do not call openclaw_agent_consult or any other tool for this message.",
		`Speak this exact OpenClaw answer to ${params.surfaceLabel}, without adding, removing, or rephrasing words.`,
		`Answer: ${JSON.stringify(params.text)}`
	].join("\n");
}
/** Classify a provider consult call before normal agent delegation. */
function classifyRealtimeVoiceConsultToolCall(args, options) {
	const message = collectRealtimeConsultArgStrings(args).join("\n");
	if (message.includes("Speak this exact OpenClaw answer")) {
		const text = readJsonStringAfterLabel(message, "Answer:");
		if (text !== void 0 && options.retainedExactSpeechTexts.includes(text)) return {
			kind: "exact-speech-echo",
			text
		};
	}
	for (const text of options.retainedExactSpeechTexts) if (text && message.includes(JSON.stringify(text))) return {
		kind: "exact-speech-echo",
		text
	};
	try {
		return {
			kind: "consult",
			message: buildRealtimeVoiceAgentConsultChatMessage(args)
		};
	} catch (error) {
		return {
			kind: "malformed",
			error: formatErrorMessage(error)
		};
	}
}
function collectRealtimeConsultArgStrings(args) {
	if (!args || typeof args !== "object") return typeof args === "string" ? [args] : [];
	const values = [];
	for (const key of [
		"question",
		"prompt",
		"query",
		"task",
		"context",
		"responseStyle"
	]) {
		const value = args[key];
		if (typeof value === "string") values.push(value);
	}
	return values;
}
function readJsonStringAfterLabel(text, label) {
	const labelIndex = text.indexOf(label);
	if (labelIndex < 0) return;
	const quoteIndex = text.indexOf("\"", labelIndex + label.length);
	if (quoteIndex < 0) return;
	for (let index = quoteIndex + 1; index < text.length; index += 1) {
		if (text[index] !== "\"" || isEscapedQuote(text, index)) continue;
		try {
			const parsed = JSON.parse(text.slice(quoteIndex, index + 1));
			return typeof parsed === "string" ? parsed : void 0;
		} catch {
			return;
		}
	}
}
function isEscapedQuote(text, quoteIndex) {
	let backslashes = 0;
	for (let index = quoteIndex - 1; index >= 0 && text[index] === "\\"; index -= 1) backslashes += 1;
	return backslashes % 2 === 1;
}
//#endregion
//#region src/talk/realtime-session-policy.ts
/** Resolve generic consult, activation-name, and auto-response session policy. */
function resolveRealtimeVoiceSessionPolicy(params) {
	const toolPolicy = resolveRealtimeVoiceAgentConsultToolPolicy(params.configuredToolPolicy, params.isAgentProxy ? "owner" : "safe-read-only");
	const consultPolicy = params.configuredConsultPolicy ?? (params.isAgentProxy ? "always" : "auto");
	const wakeNamePolicy = resolveRealtimeVoiceWakeNamePolicy(params);
	const wakeNames = wakeNamePolicy === "never" ? [] : resolveRealtimeVoiceWakeNames({
		configuredWakeNames: params.configuredWakeNames,
		cfg: params.cfg,
		agentId: params.agentId
	});
	return {
		toolPolicy,
		consultToolsAllow: resolveRealtimeVoiceAgentConsultToolsAllow(toolPolicy),
		consultPolicy,
		wakeNamePolicy,
		wakeNames,
		autoRespondToAudio: wakeNamePolicy === "never" && (!params.isAgentProxy || consultPolicy !== "always")
	};
}
function isRealtimeVoiceWakeNameRequired(policy, humanParticipantCount) {
	return policy === "always" || policy === "automatic" && humanParticipantCount > 1;
}
function resolveRealtimeVoiceInterruptResponseOnInputAudio(value) {
	return asBoolean(value) ?? true;
}
function resolveRealtimeVoiceBargeIn(params) {
	if (typeof params.configuredBargeIn === "boolean") return params.configuredBargeIn;
	return resolveRealtimeVoiceInterruptResponseOnInputAudio(params.interruptResponseOnInputAudio);
}
function resolveRealtimeVoiceMinBargeInAudioEndMs(configured) {
	return typeof configured === "number" ? configured : 250;
}
function resolveRealtimeVoiceWakeNamePolicy(params) {
	if (!params.isAgentProxy || !params.supportsActivationNameGating) return "never";
	if (params.requireWakeName === true) return "always";
	if (params.requireWakeName === false) return "never";
	return "automatic";
}
function resolveRealtimeVoiceWakeNames(params) {
	if (params.configuredWakeNames !== void 0) return sortRealtimeVoiceActivationNames(uniqueStrings(params.configuredWakeNames.map((name) => normalizeSupportedRealtimeVoiceActivationName(name)).filter((name) => Boolean(name))));
	const agent = params.cfg.agents?.list?.find((candidate) => candidate.id === params.agentId);
	const configuredAgentNames = [agent?.name, agent?.identity?.name].map((name) => normalizeSupportedRealtimeVoiceActivationName(name)).filter((name) => Boolean(name));
	const productWakeNames = [normalizeSupportedRealtimeVoiceActivationName("OpenClaw")].filter((name) => Boolean(name));
	return sortRealtimeVoiceActivationNames(uniqueStrings(configuredAgentNames.length > 0 ? [...configuredAgentNames, ...productWakeNames] : [normalizeSupportedRealtimeVoiceActivationName(params.agentId), ...productWakeNames].filter((name) => Boolean(name))));
}
//#endregion
//#region src/talk/fast-context-runtime.ts
/**
* Fast context lookup for realtime voice consults.
*
* When memory/session search can answer quickly, Talk can return concise
* context without launching a full agent consult; otherwise callers may fall
* back to the normal consult flow.
*/
const MAX_SNIPPET_CHARS = 700;
function normalizeSnippet(text) {
	const normalized = text.replace(/\s+/g, " ").trim();
	if (normalized.length <= MAX_SNIPPET_CHARS) return normalized;
	return `${truncateUtf16Safe(normalized, MAX_SNIPPET_CHARS - 1).trimEnd()}...`;
}
function buildSearchQuery(args) {
	const parsed = parseRealtimeVoiceAgentConsultArgs(args);
	return [parsed.question, parsed.context].filter(Boolean).join("\n\n");
}
function resolveLabels(labels) {
	return {
		audienceLabel: labels?.audienceLabel?.trim() || "person",
		contextName: labels?.contextName?.trim() || "OpenClaw memory context"
	};
}
function buildContextText(params) {
	const hits = params.hits.map((hit, index) => {
		const location = `${hit.path}:${hit.startLine}-${hit.endLine}`;
		return `${index + 1}. [${hit.source}] ${location}\n${normalizeSnippet(hit.snippet)}`;
	}).join("\n\n");
	return [
		`Fast ${params.labels.contextName} found for the live ${params.labels.audienceLabel}.`,
		`Use this context only if it answers the ${params.labels.audienceLabel}'s question. If it is not relevant, say briefly that you do not have that context handy.`,
		`Question:\n${params.query}`,
		`Context:\n${hits}`
	].join("\n\n");
}
function buildMissText(query, labels) {
	return [
		`No relevant ${labels.contextName} was found quickly for the live ${labels.audienceLabel}.`,
		`Answer briefly that you do not have that context handy. Do not keep checking unless the ${labels.audienceLabel} asks you to.`,
		`Question:\n${query}`
	].join("\n\n");
}
async function lookupFastContext(params) {
	const memory = await getActiveMemorySearchManagerCore({
		cfg: params.cfg,
		agentId: params.agentId
	});
	if (!memory.manager) return {
		status: "unavailable",
		error: memory.error ?? "no active memory manager"
	};
	const rawHits = await memory.manager.search(params.query, {
		maxResults: params.config.maxResults,
		sessionKey: params.sessionKey,
		sources: params.config.sources
	});
	return {
		status: "hits",
		hits: await authorizeActiveMemorySearchHits({
			cfg: params.cfg,
			agentId: params.agentId,
			requesterSessionKey: params.sessionKey,
			sandboxed: false,
			hits: rawHits
		})
	};
}
/** Try to answer a realtime consult from fast memory/session context. */
async function resolveRealtimeVoiceFastContextConsult(params) {
	if (!params.config.enabled) return { handled: false };
	const labels = resolveLabels(params.labels);
	const query = buildSearchQuery(params.args);
	try {
		const timeoutMs = resolveTimerTimeoutMs(params.config.timeoutMs, 1);
		const lookup = await withTimeout(lookupFastContext({
			cfg: params.cfg,
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			config: params.config,
			query
		}), timeoutMs, { createError: () => /* @__PURE__ */ new Error(`fast context lookup timed out after ${timeoutMs}ms`) });
		if (lookup.status === "unavailable") {
			params.logger.debug?.(`[talk] fast context unavailable: ${lookup.error}`);
			return params.config.fallbackToConsult ? { handled: false } : {
				handled: true,
				result: { text: buildMissText(query, labels) }
			};
		}
		const { hits } = lookup;
		if (hits.length === 0) return params.config.fallbackToConsult ? { handled: false } : {
			handled: true,
			result: { text: buildMissText(query, labels) }
		};
		return {
			handled: true,
			result: { text: buildContextText({
				query,
				hits,
				labels
			}) }
		};
	} catch (error) {
		const message = formatErrorMessage(error);
		params.logger.debug?.(`[talk] fast context lookup failed: ${message}`);
		return params.config.fallbackToConsult ? { handled: false } : {
			handled: true,
			result: { text: buildMissText(query, labels) }
		};
	}
}
//#endregion
export { resolveRealtimeVoiceMinBargeInAudioEndMs as a, classifyRealtimeVoiceConsultToolCall as c, resolveRealtimeVoiceInterruptResponseOnInputAudio as i, createRealtimeVoiceTurnContextTracker as l, isRealtimeVoiceWakeNameRequired as n, resolveRealtimeVoiceSessionPolicy as o, resolveRealtimeVoiceBargeIn as r, buildRealtimeVoiceSpeakExactMessage as s, resolveRealtimeVoiceFastContextConsult as t, classifySkippableRealtimeVoiceConsultTranscript as u };
