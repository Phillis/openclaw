import { r as AssistantMessage } from "../types-DTWCh4Mv.js";
import "../types-Cc0P-Eyx.js";
import "../index-Bf1XfcnS.js";
import { bn as prepareSimpleCompletionModelForAgent, yn as completeWithPreparedSimpleCompletionModel } from "../types-CiLdD6DO.js";
//#region src/agents/embedded-agent-utils.d.ts
/** Extract sanitized assistant text across all text content blocks. */
declare function extractEmbeddedAssistantText(msg: AssistantMessage): string;
//#endregion
export { completeWithPreparedSimpleCompletionModel, extractEmbeddedAssistantText as extractAssistantText, prepareSimpleCompletionModelForAgent };