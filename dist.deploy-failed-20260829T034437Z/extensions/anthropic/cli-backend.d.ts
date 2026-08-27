import { V as CliBackendPlugin } from "../../plugin-entry-BZAeuuKK.js";
import "../../cli-backend-eVESRQMA.js";
//#region extensions/anthropic/cli-backend.d.ts
/** Build the Claude CLI backend plugin descriptor. */
declare function buildAnthropicCliBackend(options?: {
  ensureDynamicSystemPromptSectionsSupport?: () => Promise<void>;
  supportsDynamicSystemPromptSections?: () => boolean;
}): CliBackendPlugin;
//#endregion
export { buildAnthropicCliBackend };