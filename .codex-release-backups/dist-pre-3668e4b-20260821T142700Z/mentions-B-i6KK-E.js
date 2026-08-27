import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { D as compileConfigRegexes } from "./redact-DP7p9QfH.js";
import "./utils-D9gvQMP6.js";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.js";
import "./agent-scope-D9GLFAyB.js";
import { s as resolveAgentConfig } from "./agent-scope-config-CsnnOL14.js";
import { t as createSubsystemLogger } from "./subsystem-DNgaGOch.js";
import "./registry-BAJij-wJ.js";
import { t as normalizeAnyChannelId } from "./registry-normalize-D2WRwH5s.js";
import { t as getLoadedChannelPluginById } from "./registry-loaded-W2ggd3eH.js";
import "./history-DLKGD0Dj.js";
//#region src/channels/mention-pattern-policy.ts
/**
* Mention-pattern policy resolver.
*
* Applies provider and conversation allow/deny rules to mention pattern matching.
*/
function normalizeIdList(values) {
	const normalized = /* @__PURE__ */ new Set();
	for (const value of values ?? []) {
		const next = normalizeOptionalString(value);
		if (next) normalized.add(next);
	}
	return normalized;
}
function isMentionPatternsPolicyConfig(value) {
	return isRecord(value);
}
function resolveProviderMentionPatternsPolicy(cfg, provider) {
	if (!cfg || !provider) return;
	const channelConfig = cfg.channels?.[provider];
	const policy = isRecord(channelConfig) ? channelConfig.mentionPatterns : void 0;
	return isMentionPatternsPolicyConfig(policy) ? policy : void 0;
}
/**
* Resolves provider-scoped mention-pattern policy for a single conversation.
*/
function resolveMentionPatternPolicy(params) {
	const conversationId = normalizeOptionalString(params.conversationId ?? void 0) ?? void 0;
	const providerPolicy = params.providerPolicy ?? resolveProviderMentionPatternsPolicy(params.cfg, params.provider);
	const effectiveMode = providerPolicy?.mode === "allow" || providerPolicy?.mode === "deny" ? providerPolicy.mode : "allow";
	const allowMatched = conversationId != null && normalizeIdList(providerPolicy?.allowIn).has(conversationId);
	const denyMatched = conversationId != null && normalizeIdList(providerPolicy?.denyIn).has(conversationId);
	return {
		effectiveMode,
		allowMatched,
		denyMatched,
		enabled: effectiveMode === "allow" ? !denyMatched : allowMatched && !denyMatched
	};
}
//#endregion
//#region src/auto-reply/reply/mentions.ts
/** Mention matching, stripping, and explicit mention handling for group triggers. */
const UNICODE_WORD_CHAR = String.raw`[\p{L}\p{M}\p{N}\p{Pc}\u200C\u200D]`;
function wrapDerivedMentionPattern(pattern) {
	return `(?:@|(?<!${UNICODE_WORD_CHAR}))${pattern}(?!${UNICODE_WORD_CHAR})`;
}
function deriveMentionPatterns(identity) {
	const patterns = [];
	const name = normalizeOptionalString(identity?.name);
	if (name) {
		const parts = name.split(/\s+/).filter(Boolean).map(escapeRegExp);
		const re = parts.length ? parts.join(String.raw`\s+`) : escapeRegExp(name);
		patterns.push(wrapDerivedMentionPattern(re));
	}
	const emoji = normalizeOptionalString(identity?.emoji);
	if (emoji) patterns.push(escapeRegExp(emoji));
	return patterns;
}
const BACKSPACE_CHAR = "\b";
const mentionMatchRegexCompileCache = /* @__PURE__ */ new Map();
const mentionStripRegexCompileCache = /* @__PURE__ */ new Map();
const MAX_MENTION_REGEX_COMPILE_CACHE_KEYS = 512;
const mentionPatternWarningCache = /* @__PURE__ */ new Set();
const MAX_MENTION_PATTERN_WARNING_KEYS = 512;
const log = createSubsystemLogger("mentions");
function normalizeMentionPattern(pattern) {
	if (!pattern.includes(BACKSPACE_CHAR)) return pattern;
	return pattern.split(BACKSPACE_CHAR).join("\\b");
}
function normalizeMentionPatterns(patterns) {
	return patterns.map(normalizeMentionPattern);
}
function warnRejectedMentionPattern(pattern, flags, reason) {
	const key = `${flags}::${reason}::${pattern}`;
	if (mentionPatternWarningCache.has(key)) return;
	mentionPatternWarningCache.add(key);
	if (mentionPatternWarningCache.size > MAX_MENTION_PATTERN_WARNING_KEYS) {
		mentionPatternWarningCache.clear();
		mentionPatternWarningCache.add(key);
	}
	log.warn("Ignoring unsupported group mention pattern", {
		pattern,
		flags,
		reason
	});
}
function cacheMentionRegexes(cache, cacheKey, regexes) {
	cache.set(cacheKey, regexes);
	if (cache.size > MAX_MENTION_REGEX_COMPILE_CACHE_KEYS) {
		cache.clear();
		cache.set(cacheKey, regexes);
	}
	return [...regexes];
}
function compileMentionPatternsCached(params) {
	if (params.patterns.length === 0) return [];
	const cacheKey = `${params.flags}\u001e${params.patterns.join("")}`;
	const cached = params.cache.get(cacheKey);
	if (cached) return [...cached];
	const compiled = compileConfigRegexes(params.patterns, params.flags);
	if (params.warnRejected) for (const rejected of compiled.rejected) warnRejectedMentionPattern(rejected.pattern, rejected.flags, rejected.reason);
	return cacheMentionRegexes(params.cache, cacheKey, compiled.regexes);
}
function resolveMentionPatterns(cfg, agentId) {
	if (!cfg) return {
		patterns: [],
		unicode: false
	};
	const agentConfig = agentId ? resolveAgentConfig(cfg, agentId) : void 0;
	const agentGroupChat = agentConfig?.groupChat;
	if (agentGroupChat && Object.hasOwn(agentGroupChat, "mentionPatterns")) return {
		patterns: agentGroupChat.mentionPatterns ?? [],
		unicode: false
	};
	const globalGroupChat = cfg.messages?.groupChat;
	if (globalGroupChat && Object.hasOwn(globalGroupChat, "mentionPatterns")) return {
		patterns: globalGroupChat.mentionPatterns ?? [],
		unicode: false
	};
	const derived = deriveMentionPatterns(agentConfig?.identity);
	return {
		patterns: derived,
		unicode: derived.length > 0
	};
}
/** Builds mention regexes from config, agent identity, and channel policy. */
function buildMentionRegexes(cfg, agentId, options) {
	if (!resolveMentionPatternPolicy({
		...options,
		cfg,
		agentId
	}).enabled) return [];
	const resolved = resolveMentionPatterns(cfg, agentId);
	return compileMentionPatternsCached({
		patterns: normalizeMentionPatterns(resolved.patterns),
		flags: resolved.unicode ? "iu" : "i",
		cache: mentionMatchRegexCompileCache,
		warnRejected: true
	});
}
/** Normalizes text before mention matching. */
function normalizeMentionText(text) {
	return normalizeLowercaseStringOrEmpty((text ?? "").replace(/[\u200b-\u200f\u202a-\u202e\u2060-\u206f]/g, ""));
}
/** Returns true when text matches one of the configured mention patterns. */
function matchesMentionPatterns(text, mentionRegexes) {
	if (mentionRegexes.length === 0) return false;
	const cleaned = normalizeMentionText(text ?? "");
	return mentionRegexes.some((re) => re.test(cleaned));
}
/** Combines regex mention matching with provider-native explicit mention metadata. */
function matchesMentionWithExplicit(params) {
	const cleaned = normalizeMentionText(params.text ?? "");
	const explicit = params.explicit?.isExplicitlyMentioned === true;
	const transcriptCleaned = params.transcript ? normalizeMentionText(params.transcript) : "";
	const textToCheck = cleaned || transcriptCleaned;
	return explicit || params.mentionRegexes.some((re) => re.test(textToCheck));
}
/** Removes structural prompt prefixes before mention stripping. */
function stripStructuralPrefixes(text) {
	if (!text) return "";
	if (text.trimStart().startsWith("[Chat messages since your last reply - for context]")) return text.trim();
	const afterMarker = text;
	const afterEnvelope = afterMarker.replace(/^(?:[ \t]*\[[^\]\n]+\][ \t]*)+/, "");
	const senderPrefixPattern = afterEnvelope === afterMarker ? /^[ \t]*(?!\/)[^\n:]{1,120}:\s+/gm : /^[ \t]*[^\n:]{1,120}:\s+/gm;
	const stripped = afterEnvelope.replace(senderPrefixPattern, "").replace(/\\n/g, " ").trim();
	if (stripped.startsWith("/")) return stripped.replace(/[ \t]+/g, " ");
	return stripped.replace(/\s+/g, " ");
}
/** Removes bot mentions from command text before command normalization. */
function stripMentions(text, ctx, cfg, agentId) {
	let result = text;
	const providerId = (ctx.Provider ? normalizeAnyChannelId(ctx.Provider) : null) ?? normalizeOptionalLowercaseString(ctx.Provider) ?? null;
	const providerMentions = providerId ? getLoadedChannelPluginById(providerId)?.mentions : void 0;
	const resolvedPatterns = resolveMentionPatterns(cfg, agentId);
	const configRegexes = compileMentionPatternsCached({
		patterns: normalizeMentionPatterns(resolvedPatterns.patterns),
		flags: resolvedPatterns.unicode ? "giu" : "gi",
		cache: mentionStripRegexCompileCache,
		warnRejected: true
	});
	const providerRegexes = providerMentions?.stripRegexes?.({
		ctx,
		cfg,
		agentId
	}) ?? compileMentionPatternsCached({
		patterns: normalizeMentionPatterns(providerMentions?.stripPatterns?.({
			ctx,
			cfg,
			agentId
		}) ?? []),
		flags: "gi",
		cache: mentionStripRegexCompileCache,
		warnRejected: false
	});
	for (const re of [...configRegexes, ...providerRegexes]) result = result.replace(re, " ");
	if (providerMentions?.stripMentions) result = providerMentions.stripMentions({
		text: result,
		ctx,
		cfg,
		agentId
	});
	result = result.replace(/@[0-9+]{5,}/g, " ");
	return result.replace(/\s+/g, " ").trim();
}
//#endregion
export { stripMentions as a, normalizeMentionText as i, matchesMentionPatterns as n, stripStructuralPrefixes as o, matchesMentionWithExplicit as r, resolveMentionPatternPolicy as s, buildMentionRegexes as t };
