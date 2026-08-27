import { t as GeneratedVideoAsset } from "../../types-CJzc75hI.js";
import { n as GuardedFetchResult } from "../../fetch-guard-DNck_vGd.js";
import { n as fetchWithTimeoutGuarded, t as ProviderOperationTimeoutMs } from "../../shared-C8jPm2KY.js";
import "../../provider-http-BYabNk3I.js";
import "../../video-generation-DxrWG0Dk.js";
//#region extensions/xai/video-generation-transport.d.ts
type XaiVideoRequestPolicy = {
  allowPrivateNetwork: boolean;
  dispatcherPolicy?: NonNullable<Parameters<typeof fetchWithTimeoutGuarded>[4]>["dispatcherPolicy"];
};
declare function fetchXaiVideoResponse(params: {
  url: string;
  init: RequestInit;
  stage: "poll" | "download";
  requestFailedMessage: string;
  auditContext: string;
  timeoutMs?: ProviderOperationTimeoutMs;
  defaultTimeoutMs: number;
  fetchFn: typeof fetch;
} & XaiVideoRequestPolicy): Promise<GuardedFetchResult>;
declare function downloadXaiVideo(params: {
  url: string;
  timeoutMs?: ProviderOperationTimeoutMs;
  defaultTimeoutMs: number;
  fetchFn: typeof fetch;
  maxBytes: number;
} & XaiVideoRequestPolicy): Promise<GeneratedVideoAsset>;
//#endregion
export { XaiVideoRequestPolicy, downloadXaiVideo, fetchXaiVideoResponse };