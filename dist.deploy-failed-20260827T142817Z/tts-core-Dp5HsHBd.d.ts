import { n as OpenClawConfig } from "./types.openclaw-CNftZ6Ix.js";
import { B as completeWithPreparedSimpleCompletionModel, K as requireApiKey, V as prepareSimpleCompletionModel, v as ResolvedTtsConfig } from "./types-lxuSJRGv.js";

//#region src/tts/tts-core.d.ts
type SummarizeTextDeps = {
  completeWithPreparedSimpleCompletionModel: typeof completeWithPreparedSimpleCompletionModel;
  prepareSimpleCompletionModel: typeof prepareSimpleCompletionModel;
  requireApiKey: typeof requireApiKey;
};
type SummarizeResult = {
  summary: string;
  latencyMs: number;
  inputLength: number;
  outputLength: number;
};
/** Summarize long text before synthesis using the configured summary model. */
declare function summarizeText(params: {
  text: string;
  targetLength: number;
  cfg: OpenClawConfig;
  config: ResolvedTtsConfig;
  timeoutMs: number;
}, deps?: SummarizeTextDeps): Promise<SummarizeResult>;
//#endregion
export { summarizeText as t };