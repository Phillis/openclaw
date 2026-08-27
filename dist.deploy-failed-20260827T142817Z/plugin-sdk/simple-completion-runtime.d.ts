import { r as AssistantMessage } from "../types-Cm3n7XMD.js";
import { B as completeWithPreparedSimpleCompletionModel, H as prepareSimpleCompletionModelForAgent } from "../types-lxuSJRGv.js";

//#region src/agents/embedded-agent-utils.d.ts
/** Extract sanitized assistant text across all text content blocks. */
declare function extractEmbeddedAssistantText(msg: AssistantMessage): string;
//#endregion
export { completeWithPreparedSimpleCompletionModel, extractEmbeddedAssistantText as extractAssistantText, prepareSimpleCompletionModelForAgent };