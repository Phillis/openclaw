import { i as OpenClawConfig } from "../types.openclaw-ClnaeuRs.js";
import { o as ImageContent } from "../types-Sg3pk96c.js";
import "../types-Db5QLc7j.js";
import { M as MediaUnderstandingProvider, P as MediaUnderstandingOutput, a as MsgContext, j as MediaUnderstandingDecision } from "../templating-B2U7ExGD.js";
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
  activeModel?: ActiveMediaModel;
  /** Preserve native-harness ownership of image, video, and file inputs while applying STT. */
  processingMode?: "audio-only";
  /** Render local paths immediately only when the caller owns the final tool surface. */
  selfServeLocalPaths?: boolean;
  /** Attachment indexes the caller (ACP) has already resolved into native turn attachments. */
  deliveredImageIndexes?: ReadonlySet<number>;
}): Promise<ApplyMediaUnderstandingResult>;
//#endregion
export { applyMediaUnderstanding };