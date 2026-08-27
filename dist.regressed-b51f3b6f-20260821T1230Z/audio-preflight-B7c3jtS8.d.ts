import { r as OpenClawConfig } from "./types.openclaw-D3TBp_34.js";
import { l as MediaUnderstandingProvider } from "./types-Bz5Nv8p5.js";
import { l as RuntimeMsgContext } from "./templating-DzyASgcc.js";
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