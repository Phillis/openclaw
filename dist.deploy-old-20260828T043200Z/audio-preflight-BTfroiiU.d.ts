import { r as OpenClawConfig } from "./types.openclaw-Cjm06lg9.js";
import "./types-336a6ztO.js";
import { l as MediaUnderstandingProvider } from "./types-DY2Fz8pS.js";
import { l as RuntimeMsgContext } from "./templating-tHzj-d8O.js";
import { t as ActiveMediaModel } from "./active-model-Cxn6sQSw.js";
//#region src/media-understanding/audio-preflight.d.ts
/**
 * Transcribes the first audio attachment BEFORE mention checking.
 * This allows voice notes to be processed in group chats with requireMention: true.
 * Returns the transcript or undefined if transcription fails or no audio is found.
 */
declare function transcribeFirstAudio(params: {
  ctx: RuntimeMsgContext;
  cfg: OpenClawConfig;
  agentDir?: string;
  providers?: Record<string, MediaUnderstandingProvider>;
  activeModel?: ActiveMediaModel;
}): Promise<string | undefined>;
//#endregion
export { transcribeFirstAudio as t };