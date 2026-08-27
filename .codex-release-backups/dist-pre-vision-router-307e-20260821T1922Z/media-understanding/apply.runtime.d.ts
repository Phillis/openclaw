import { i as OpenClawConfig } from "../types.openclaw-woQof385.js";
import { o as ImageContent } from "../types-GU_0Dtwq.js";
import { _ as MediaUnderstandingProvider, a as MsgContext, g as MediaUnderstandingDecision, y as MediaUnderstandingOutput } from "../templating-CbdZP_k6.js";
import { t as ActiveMediaModel } from "../active-model-Cxn6sQSw.js";

//#region src/media-understanding/extracted-file-images.d.ts
type ExtractedFileImage = ImageContent & {
  attachmentIndex: number;
};
//#endregion
//#region src/media-understanding/apply.d.ts
type ApplyMediaUnderstandingResult = {
  outputs: MediaUnderstandingOutput[];
  decisions: MediaUnderstandingDecision[];
  extractedFileImages: ExtractedFileImage[];
  appliedImage: boolean;
  appliedAudio: boolean;
  appliedVideo: boolean;
  appliedFile: boolean;
  enableLocalPathSelfServe?: (contexts: MsgContext[], stagedPaths?: ReadonlyMap<number, string>) => void;
};
declare function applyMediaUnderstanding(params: {
  ctx: MsgContext;
  cfg: OpenClawConfig;
  agentId?: string;
  agentDir?: string;
  workspaceDir?: string;
  providers?: Record<string, MediaUnderstandingProvider>;
  activeModel?: ActiveMediaModel; /** Preserve native-harness ownership of image, video, and file inputs while applying STT. */
  processingMode?: "audio-only"; /** Render local paths immediately only when the caller owns the final tool surface. */
  selfServeLocalPaths?: boolean; /** Attachment indexes the caller (ACP) has already resolved into native turn attachments. */
  deliveredImageIndexes?: ReadonlySet<number>;
}): Promise<ApplyMediaUnderstandingResult>;
//#endregion
export { applyMediaUnderstanding };