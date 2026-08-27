import { a as MusicGenerationModeCapabilities, c as MusicGenerationProvider, d as MusicGenerationResult, f as MusicGenerationSourceImage, i as MusicGenerationMode, l as MusicGenerationProviderCapabilities, n as MusicGenerationEditCapabilities, s as MusicGenerationOutputFormat, t as GeneratedMusicAsset, u as MusicGenerationRequest } from "../types-QsZ9pkNo.js";
import { t as ProviderOperationDeadline } from "../shared-Db5D4Tpz.js";

//#region src/music-generation/provider-assets.d.ts
type GeneratedMusicResponseHandle = {
  response: Response;
  release?: () => Promise<void>;
  mimeType?: string;
};
type GeneratedMusicResponseFactory = (params: {
  deadline: ProviderOperationDeadline;
  timeoutMs: () => number;
}) => Promise<GeneratedMusicResponseHandle>;
/**
 * Asset extraction and download helpers for music generation providers.
 *
 * Providers may return audio as URLs, file objects, or base64 payloads; these
 * helpers normalize those shapes into bounded in-memory GeneratedMusicAsset values.
 */
/** Candidate audio file returned by a provider before download. */
type GeneratedMusicFileCandidate = {
  url: string;
  mimeType?: string;
  fileName?: string;
};
/** Extract URL/file candidates from common provider response keys. */
declare function extractGeneratedMusicFileCandidates(payload: unknown, keys?: readonly string[]): GeneratedMusicFileCandidate[];
/** Convert a base64 provider payload into a generated music asset. */
declare function generatedMusicAssetFromBase64(params: {
  base64: string;
  mimeType: string;
  index?: number;
  fileName?: string;
}): GeneratedMusicAsset;
/** Download a generated music URL with size limits and inferred audio metadata. */
declare function downloadGeneratedMusicAsset(params: {
  candidate: GeneratedMusicFileCandidate;
  timeoutMs: number;
  fetchFn: typeof fetch;
  provider: string;
  requestFailedMessage: string;
  index?: number;
  maxBytes?: number;
  validateBinaryResponse?: boolean;
  includeSourceUrl?: boolean;
  fetchResponse?: GeneratedMusicResponseFactory;
}): Promise<GeneratedMusicAsset>;
//#endregion
export { type GeneratedMusicAsset, type GeneratedMusicFileCandidate, type MusicGenerationEditCapabilities, type MusicGenerationMode, type MusicGenerationModeCapabilities, type MusicGenerationOutputFormat, type MusicGenerationProvider, type MusicGenerationProviderCapabilities, type MusicGenerationRequest, type MusicGenerationResult, type MusicGenerationSourceImage, downloadGeneratedMusicAsset, extractGeneratedMusicFileCandidates, generatedMusicAssetFromBase64 };