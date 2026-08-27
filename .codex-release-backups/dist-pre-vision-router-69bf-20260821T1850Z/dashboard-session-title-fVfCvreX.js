import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.js";
import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-D9GLFAyB.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { dt as stripInboundMetadata } from "./openclaw-state-db-BciZ4rHE.js";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.js";
import { K as updateSessionEntry } from "./session-accessor-CIiPoGwM.js";
import { i as resolveSessionRuntimeOverrideForProvider } from "./session-runtime-compat-DNLW-mvy.js";
import { i as stripInlineDirectiveTagsForDisplay } from "./directive-tags-CvzK-y8_.js";
import { a as resolveSessionModelRef } from "./placement-session-runtime-D3R4yOqT.js";
import { s as readSessionTitleFieldsFromTranscript } from "./session-utils-row-xwseApeF.js";
import { n as resolveUtilityModelRefForAgent } from "./utility-model-CPi3mZzQ.js";
import { n as generateConversationLabelWithFallback } from "./conversation-label-generator-Bb9501B3.js";
import { i as isValidAttachmentBase64 } from "./chat-attachments-BhBYBo3A.js";
//#region src/gateway/dashboard-session-title.ts
const DASHBOARD_SESSION_TITLE_MAX_CHARS = 60;
const DASHBOARD_SESSION_TITLE_SOURCE_MAX_CHARS = 1e3;
const DASHBOARD_SESSION_TITLE_PROMPT = "Generate a concise session title (3-6 words, max 60 characters) from the user's first message. Use the same language as the message. No emoji. Return only the title.";
const sessionTitleRequests = /* @__PURE__ */ new Map();
function decodeTextAttachmentPrefix(attachment, maxChars) {
	const mimeType = attachment.mimeType?.trim().toLowerCase();
	const content = attachment.content;
	if (!mimeType?.startsWith("text/") || typeof content !== "string" || !content) return null;
	if (!isValidAttachmentBase64(content)) return null;
	const maxBase64Chars = Math.ceil((maxChars * 3 + 3) / 3) * 4;
	const truncated = content.length > maxBase64Chars;
	const prefixLength = truncated ? maxBase64Chars : content.length;
	const prefix = content.slice(0, prefixLength);
	const bytes = Buffer.from(prefix, "base64");
	try {
		return new TextDecoder("utf-8", { fatal: true }).decode(bytes, { stream: truncated });
	} catch {
		return null;
	}
}
/** Builds the bounded model source shared by dashboard and worktree titles. */
function buildDashboardSessionTitleSource(params) {
	const visibleMessage = stripInlineDirectiveTagsForDisplay(params.message).text.trim();
	const slashCommand = visibleMessage.startsWith("/");
	let source = slashCommand ? "" : visibleMessage;
	for (const attachment of params.attachments ?? []) {
		const separatorLength = source ? 1 : 0;
		const remaining = DASHBOARD_SESSION_TITLE_SOURCE_MAX_CHARS - source.length - separatorLength;
		if (remaining <= 0) break;
		const text = decodeTextAttachmentPrefix(attachment, remaining)?.trim();
		if (!text) continue;
		source += `${source ? "\n" : ""}${truncateUtf16Safe(text, remaining)}`;
	}
	if (!source && slashCommand) return truncateUtf16Safe(visibleMessage, DASHBOARD_SESSION_TITLE_SOURCE_MAX_CHARS);
	return truncateUtf16Safe(source.trim(), DASHBOARD_SESSION_TITLE_SOURCE_MAX_CHARS);
}
function hasExplicitSessionName(entry) {
	return Boolean(entry?.label?.trim() || entry?.displayName?.trim() || entry?.subject?.trim() || entry?.groupChannel?.trim() || entry?.space?.trim());
}
function isDashboardSessionKey(sessionKey) {
	return parseAgentSessionKey(sessionKey)?.rest.startsWith("dashboard:") === true;
}
function isDashboardSessionTitleCandidate(params) {
	const sourceText = params.userMessage.trim();
	return Boolean(sourceText && !sourceText.startsWith("/") && isDashboardSessionKey(params.sessionKey));
}
function resolveDashboardTitleAuthProfile(params) {
	const sessionProfile = params.entry?.authProfileOverride?.trim();
	if (sessionProfile) return sessionProfile;
	const configuredRef = resolveAgentEffectiveModelPrimary(params.cfg, params.agentId)?.trim();
	const configuredProfile = configuredRef ? splitTrailingAuthProfile(configuredRef).profile : void 0;
	if (!configuredProfile) return;
	return resolveSessionModelRef(params.cfg, void 0, params.agentId).provider === params.regularProvider ? configuredProfile : void 0;
}
function normalizeDashboardSessionTitle(raw) {
	const firstLine = raw.replace(/\r/g, "").split("\n").map((line) => line.trim()).find((line) => line && !line.startsWith("```"));
	if (!firstLine) return null;
	const normalized = firstLine.replace(/^\s*(?:title\s*:\s*)?/i, "").replace(/^["'`]+|["'`]+$/g, "").replace(/\s+/g, " ").trim();
	return normalized ? truncateUtf16Safe(normalized, DASHBOARD_SESSION_TITLE_MAX_CHARS) : null;
}
async function generateDashboardSessionTitle(params) {
	const sourceText = buildDashboardSessionTitleSource({
		message: params.userMessage,
		attachments: params.attachments
	});
	if (!sourceText || sourceText.startsWith("/")) return null;
	const regularModel = resolveSessionModelRef(params.cfg, params.entry, params.agentId);
	const agentHarnessRuntimeOverride = resolveSessionRuntimeOverrideForProvider({
		provider: regularModel.provider,
		entry: params.entry,
		cfg: params.cfg
	});
	const preferredProfile = resolveDashboardTitleAuthProfile({
		cfg: params.cfg,
		agentId: params.agentId,
		entry: params.entry,
		regularProvider: regularModel.provider
	});
	const regularModelRef = `${regularModel.provider}/${regularModel.model}${preferredProfile ? `@${preferredProfile}` : ""}`;
	const utilityModelRef = resolveUtilityModelRefForAgent({
		cfg: params.cfg,
		agentId: params.agentId,
		primaryProvider: regularModel.provider,
		primaryModelRef: regularModelRef
	});
	const generated = await generateConversationLabelWithFallback({
		userMessage: truncateUtf16Safe(sourceText, DASHBOARD_SESSION_TITLE_SOURCE_MAX_CHARS),
		prompt: DASHBOARD_SESSION_TITLE_PROMPT,
		cfg: params.cfg,
		agentId: params.agentId,
		...agentHarnessRuntimeOverride ? { agentHarnessRuntimeOverride } : {},
		...utilityModelRef ? { utilityModelRef } : {},
		regularModelRef,
		...preferredProfile ? { preferredProfile } : {},
		normalizeLabel: normalizeDashboardSessionTitle,
		maxLength: DASHBOARD_SESSION_TITLE_MAX_CHARS
	});
	return generated ? normalizeDashboardSessionTitle(generated) : null;
}
async function maybeGenerateDashboardSessionTitle(params) {
	const sourceText = params.userMessage.trim();
	if (!isDashboardSessionTitleCandidate({
		sessionKey: params.sessionKey,
		userMessage: sourceText
	})) return false;
	return (await maybeGenerateSessionTitle({
		...params,
		userMessage: sourceText
	})).kind === "persisted";
}
async function maybeGenerateSessionTitle(params) {
	if (hasExplicitSessionName(params.entry) || params.entry?.sessionId !== params.sessionId) return { kind: "skipped" };
	const requestKey = `${params.storePath}\0${params.sessionKey}\0${params.sessionId}`;
	const existing = sessionTitleRequests.get(requestKey);
	if (existing) return {
		kind: "in-flight",
		settled: existing
	};
	const transcriptSource = readSessionTitleFieldsFromTranscript({
		agentId: params.agentId,
		sessionEntry: params.entry,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		storePath: params.storePath
	}).firstUserMessage;
	const transcriptText = transcriptSource ? stripInlineDirectiveTagsForDisplay(stripInboundMetadata(transcriptSource)).text.trim() : "";
	const currentText = params.currentUserMessage ? stripInlineDirectiveTagsForDisplay(params.currentUserMessage).text.trim() : "";
	const sourceText = !transcriptText || currentText && currentText === transcriptText ? params.userMessage.trim() : transcriptText;
	if (!sourceText) return { kind: "skipped" };
	return await getOrCreatePromise(sessionTitleRequests, requestKey, async () => {
		const displayName = await generateDashboardSessionTitle({
			cfg: params.cfg,
			agentId: params.agentId,
			entry: params.entry,
			userMessage: sourceText
		});
		if (!displayName) return false;
		let persisted = false;
		await updateSessionEntry({
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		}, (current) => {
			if (current.sessionId !== params.sessionId || hasExplicitSessionName(current)) return null;
			persisted = true;
			return { displayName };
		}, { requireWriteSuccess: true });
		return persisted;
	}, { evictOnSettled: true }) ? { kind: "persisted" } : { kind: "skipped" };
}
//#endregion
export { maybeGenerateSessionTitle as a, maybeGenerateDashboardSessionTitle as i, hasExplicitSessionName as n, isDashboardSessionTitleCandidate as r, buildDashboardSessionTitleSource as t };
