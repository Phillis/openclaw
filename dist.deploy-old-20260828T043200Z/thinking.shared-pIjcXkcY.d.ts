import { g as ThinkingLevelMap } from "./types-CL_qQaPo.js";
//#region src/auto-reply/thinking.shared.d.ts
/** Canonical thinking level values accepted by chat commands and session state. */
type ThinkLevel = "off" | "minimal" | "low" | "medium" | "high" | "xhigh" | "adaptive" | "max" | "ultra";
type VerboseLevel = "off" | "on" | "full";
type ReasoningLevel = "off" | "on" | "stream";
/** Prepared model catalog fields reused while choosing and dispatching a queued runtime. */
type ThinkingCatalogEntry = {
  provider: string;
  id: string;
  api?: string;
  contextWindow?: number;
  contextTokens?: number;
  reasoning?: boolean;
  configuredReasoning?: boolean;
  /** Concrete runtime owner of thinking policy; internal and never project to clients. */
  thinkingPolicyProvider?: string;
  thinkingLevelMap?: ThinkingLevelMap;
  input?: readonly ("text" | "image" | "audio" | "video" | "document")[];
  params?: Record<string, unknown>;
  compat?: {
    thinkingFormat?: string;
    supportedReasoningEfforts?: readonly string[] | null;
  } | null;
};
//#endregion
export { VerboseLevel as i, ThinkLevel as n, ThinkingCatalogEntry as r, ReasoningLevel as t };