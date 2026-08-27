import { i as OpenClawConfig } from "./types.openclaw-Bon4guJK.js";
//#region src/hooks/llm-slug-generator.d.ts
/**
 * Generate a short 1-2 word filename slug from session content using LLM
 */
declare function generateSlugViaLLM(params: {
  sessionContent: string;
  cfg: OpenClawConfig;
  agentId: string;
  /** Optional hook-level override; the embedded runner owns model resolution. */
  model?: string;
}): Promise<string | null>;
//#endregion
export { generateSlugViaLLM };