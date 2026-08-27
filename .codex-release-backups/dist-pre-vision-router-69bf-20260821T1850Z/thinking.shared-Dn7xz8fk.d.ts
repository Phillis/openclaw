//#region src/auto-reply/thinking.shared.d.ts
/** Canonical thinking level values accepted by chat commands and session state. */
type ThinkLevel = "off" | "minimal" | "low" | "medium" | "high" | "xhigh" | "adaptive" | "max" | "ultra";
type VerboseLevel = "off" | "on" | "full";
type ReasoningLevel = "off" | "on" | "stream";
/** Minimal model catalog entry needed to choose thinking defaults. */
type ThinkingCatalogEntry = {
  provider: string;
  id: string;
  api?: string;
  reasoning?: boolean;
  params?: Record<string, unknown>;
  compat?: {
    thinkingFormat?: string;
    supportedReasoningEfforts?: readonly string[] | null;
  } | null;
};
//#endregion
export { VerboseLevel as i, ThinkLevel as n, ThinkingCatalogEntry as r, ReasoningLevel as t };