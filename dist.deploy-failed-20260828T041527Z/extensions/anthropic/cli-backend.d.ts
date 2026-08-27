import { V as CliBackendPlugin } from "../../plugin-entry-CX5-Xb96.js";
import "../../cli-backend-BYDmWJ4D.js";
//#region extensions/anthropic/cli-backend.d.ts
/** Build the Claude CLI backend plugin descriptor. */
declare function buildAnthropicCliBackend(options?: {
  ensureDynamicSystemPromptSectionsSupport?: () => Promise<void>;
  supportsDynamicSystemPromptSections?: () => boolean;
}): CliBackendPlugin;
//#endregion
export { buildAnthropicCliBackend };