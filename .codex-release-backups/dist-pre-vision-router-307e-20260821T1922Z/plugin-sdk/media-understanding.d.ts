import { _ as StructuredExtractionResult, a as ImagesDescriptionInput, b as VideoDescriptionResult, d as MediaUnderstandingProviderAuthResult, f as MediaUnderstandingProviderRequestAuth, g as StructuredExtractionRequest, h as StructuredExtractionInput, i as ImageDescriptionResult, l as MediaUnderstandingProvider, m as StructuredExtractionImageInput, n as AudioTranscriptionResult, o as ImagesDescriptionRequest, p as MediaUnderstandingProviderSyntheticAuthResult, r as ImageDescriptionRequest, s as ImagesDescriptionResult, t as AudioTranscriptionRequest, u as MediaUnderstandingProviderAuthContext, v as StructuredExtractionTextInput, y as VideoDescriptionRequest } from "../types-Bz5Nv8p5.js";
import { i as describeImagesWithModelPayloadTransform, n as describeImageWithModelPayloadTransform, r as describeImagesWithModel, t as describeImageWithModel } from "../image-runtime-8QYe2oFy.js";

//#region packages/media-understanding-common/src/openai-compatible-video.d.ts
/** Minimal OpenAI-compatible video response payload shape. */
type OpenAiCompatibleVideoPayload = {
  choices?: Array<{
    message?: {
      content?: string | Array<{
        text?: string;
      }>;
      reasoning_content?: string;
    };
  }>;
};
/** Trim optional strings, falling back when empty. */
declare function resolveMediaUnderstandingString(value: string | undefined, fallback: string): string;
/** Coerce text from OpenAI-compatible content or reasoning fields. */
declare function coerceOpenAiCompatibleVideoText(payload: OpenAiCompatibleVideoPayload): string | null;
/** Build an OpenAI-compatible request body with an inline data URL video. */
declare function buildOpenAiCompatibleVideoRequestBody(params: {
  model: string;
  prompt: string;
  mime: string;
  buffer: Buffer;
}): {
  model: string;
  messages: {
    role: string;
    content: ({
      type: string;
      text: string;
      video_url?: undefined;
    } | {
      type: string;
      video_url: {
        url: string;
      };
      text?: undefined;
    })[];
  }[];
};
//#endregion
//#region src/media-understanding/openai-compatible-audio.d.ts
type OpenAiCompatibleAudioParams = AudioTranscriptionRequest & {
  defaultBaseUrl: string;
  defaultModel: string;
  provider?: string;
};
/** Sends an OpenAI-compatible audio transcription request and returns validated text output. */
declare function transcribeOpenAiCompatibleAudio(params: OpenAiCompatibleAudioParams): Promise<AudioTranscriptionResult>;
//#endregion
export { type AudioTranscriptionRequest, type AudioTranscriptionResult, type ImageDescriptionRequest, type ImageDescriptionResult, type ImagesDescriptionInput, type ImagesDescriptionRequest, type ImagesDescriptionResult, type MediaUnderstandingProvider, type MediaUnderstandingProviderAuthContext, type MediaUnderstandingProviderAuthResult, type MediaUnderstandingProviderRequestAuth, type MediaUnderstandingProviderSyntheticAuthResult, type OpenAiCompatibleVideoPayload, type StructuredExtractionImageInput, type StructuredExtractionInput, type StructuredExtractionRequest, type StructuredExtractionResult, type StructuredExtractionTextInput, type VideoDescriptionRequest, type VideoDescriptionResult, buildOpenAiCompatibleVideoRequestBody, coerceOpenAiCompatibleVideoText, describeImageWithModel, describeImageWithModelPayloadTransform, describeImagesWithModel, describeImagesWithModelPayloadTransform, resolveMediaUnderstandingString, transcribeOpenAiCompatibleAudio };