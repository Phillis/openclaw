import { n as OpenClawConfig } from "../types.openclaw-BssW6c46.js";
import "../templating-BCMFHjRY.js";
import { a as ResolveMentionPatternPolicyParams, c as InboundImplicitMentionKind, d as InboundMentionPolicy, f as ResolveInboundMentionDecisionFlatParams, g as resolveInboundMentionDecision, h as implicitMentionKindWhen, l as InboundMentionDecision, m as ResolveInboundMentionDecisionParams, n as BuildMentionRegexesOptions, o as ResolvedMentionPatternPolicy, p as ResolveInboundMentionDecisionNestedParams, s as resolveMentionPatternPolicy, u as InboundMentionFacts } from "../mentions.types-D5lqIzsn.js";
//#region src/auto-reply/reply/history.d.ts
declare const CURRENT_MESSAGE_MARKER = "[Current message - respond to this]";
//#endregion
//#region src/auto-reply/reply/mentions.d.ts
/** Builds mention regexes from config, agent identity, and channel policy. */
declare function buildMentionRegexes(cfg: OpenClawConfig | undefined, agentId?: string, options?: BuildMentionRegexesOptions): RegExp[];
/** Normalizes text before mention matching. */
declare function normalizeMentionText(text: string): string;
//#endregion
export { type BuildMentionRegexesOptions, CURRENT_MESSAGE_MARKER, type InboundImplicitMentionKind, type InboundMentionDecision, type InboundMentionFacts, type InboundMentionPolicy, type ResolveInboundMentionDecisionFlatParams, type ResolveInboundMentionDecisionNestedParams, type ResolveInboundMentionDecisionParams, type ResolveMentionPatternPolicyParams, type ResolvedMentionPatternPolicy, buildMentionRegexes, implicitMentionKindWhen, normalizeMentionText, resolveInboundMentionDecision, resolveMentionPatternPolicy };