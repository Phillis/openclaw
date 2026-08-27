import { r as OpenClawConfig } from "./types.openclaw-CflOMr0r.js";
import "./types-DFD58Wgt.js";
import { l as MediaUnderstandingProvider } from "./types-DjaZR6Mg.js";
import { l as RuntimeMsgContext } from "./templating-D4gA1hJr.js";
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