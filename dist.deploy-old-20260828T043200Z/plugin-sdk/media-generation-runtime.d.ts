import { n as OpenClawConfig } from "../types.openclaw-BssW6c46.js";
import { t as MediaKind } from "../constants-CbtCb9df.js";
import { t as GeneratedVideoAsset } from "../types-CN4xEaaq.js";
import { r as resolveClosestSize } from "../runtime-shared-B7CzEHyU.js";
import { n as ProviderOperationTimeoutMs, t as ProviderOperationDeadline } from "../shared-DhUZj3pQ.js";
//#region src/media/configured-max-bytes.d.ts
type GeneratedMediaKind = Extract<MediaKind, "audio" | "image" | "video">;
/** Returns the configured media cap, falling back to the media-core per-kind default. */
declare function resolveGeneratedMediaMaxBytes(cfg: OpenClawConfig | undefined, kind: GeneratedMediaKind): number;
//#endregion
//#region src/media-generation/provider-assets.d.ts
type GeneratedVideoResponseHandle = {
  response: Response;
  release?: () => Promise<void>;
};
type GeneratedVideoResponseFactory = (params: {
  deadline: ProviderOperationDeadline;
  timeoutMs: () => number;
}) => Promise<GeneratedVideoResponseHandle>;
/** Download a generated video URL with size limits and inferred video metadata. */
declare function downloadGeneratedVideoAsset(params: {
  url: string;
  timeoutMs: ProviderOperationTimeoutMs;
  defaultTimeoutMs: number;
  fetchFn: typeof fetch;
  provider: string;
  label: string;
  requestFailedMessage: string;
  index?: number;
  maxBytes?: number;
  validateBinaryResponse?: boolean;
  metadata?: Record<string, unknown>;
  fetchResponse?: GeneratedVideoResponseFactory;
}): Promise<GeneratedVideoAsset>;
//#endregion
export { downloadGeneratedVideoAsset, resolveClosestSize, resolveGeneratedMediaMaxBytes };