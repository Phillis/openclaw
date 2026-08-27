import { n as OpenClawConfig } from "../types.openclaw-6A5yUI1l.js";
import { _ as ImageGenerationSourceImage, a as ImageGenerationOpenAIBackground, c as ImageGenerationOutputFormat, d as ImageGenerationProviderConfiguredContext, f as ImageGenerationProviderOptions, g as ImageGenerationResult, h as ImageGenerationResolution, l as ImageGenerationProvider, m as ImageGenerationRequest, n as ImageGenerationBackground, o as ImageGenerationOpenAIModeration, p as ImageGenerationQuality, s as ImageGenerationOpenAIOptions, t as GeneratedImageAsset, u as ImageGenerationProviderCapabilities } from "../types-DwSvuTEi.js";
//#region src/image-generation/openai-compatible-image-provider.d.ts
type ModelProviderConfig = NonNullable<NonNullable<OpenClawConfig["models"]>["providers"]>[string];
/** OpenAI-compatible image endpoint mode. */
type OpenAiCompatibleImageRequestMode = "generate" | "edit";
type OpenAiCompatibleImageProviderRequestParams = {
  req: ImageGenerationRequest;
  inputImages: ImageGenerationSourceImage[];
  model: string;
  count: number;
  mode: OpenAiCompatibleImageRequestMode;
};
type OpenAiCompatibleImageProviderRequestBody = {
  kind: "json";
  body: Record<string, unknown>;
} | {
  kind: "multipart";
  form: FormData;
};
type OpenAiCompatibleImageProviderOptions = {
  id: string;
  label: string;
  defaultModel: string;
  models: readonly string[];
  capabilities: ImageGenerationProviderCapabilities;
  defaultBaseUrl: string;
  providerConfigKey?: string;
  normalizeModel?: (model: string | undefined, fallback: string) => string;
  resolveBaseUrl?: (params: {
    req: ImageGenerationRequest;
    providerConfig?: ModelProviderConfig;
    defaultBaseUrl: string;
  }) => string;
  resolveAllowPrivateNetwork?: (params: {
    baseUrl: string;
    req: ImageGenerationRequest;
    providerConfig?: ModelProviderConfig;
  }) => boolean | undefined;
  useConfiguredRequest?: boolean;
  defaultTimeoutMs?: number;
  resolveCount?: (params: {
    req: ImageGenerationRequest;
    mode: OpenAiCompatibleImageRequestMode;
  }) => number;
  buildGenerateRequest: (params: OpenAiCompatibleImageProviderRequestParams & {
    mode: "generate";
  }) => OpenAiCompatibleImageProviderRequestBody;
  buildEditRequest: (params: OpenAiCompatibleImageProviderRequestParams & {
    mode: "edit";
  }) => OpenAiCompatibleImageProviderRequestBody;
  response?: {
    defaultMimeType?: string;
    fileNamePrefix?: string;
    sniffMimeType?: boolean;
  };
  missingApiKeyError?: string;
  tooManyInputImagesError?: string;
  missingInputImageError?: string;
  emptyResponseError?: string;
  failureLabels?: {
    generate?: string;
    edit?: string;
  };
};
/** Creates an image-generation provider backed by OpenAI-style image endpoints. */
declare function createOpenAiCompatibleImageGenerationProvider(options: OpenAiCompatibleImageProviderOptions): ImageGenerationProvider;
//#endregion
//#region src/image-generation/image-assets.d.ts
/** Result of conservative image MIME sniffing for provider responses. */
type ImageMimeTypeDetection = {
  mimeType: string;
  extension: string;
};
type OpenAiCompatibleImageResponseEntry = {
  b64_json?: unknown;
  mime_type?: unknown;
  revised_prompt?: unknown;
};
type OpenAiCompatibleImageResponsePayload = {
  data?: unknown;
};
declare function resolveInlineImageJsonResponseMaxBytes(maxImages: number, maxImageBytes: number): number;
/** Maps an image MIME type to a stable filename extension. */
declare function imageFileExtensionForMimeType(mimeType: string | undefined, fallback?: string): string;
declare function sniffImageMimeType(buffer: Buffer, fallbackMimeType?: string): ImageMimeTypeDetection;
declare function toImageDataUrl(params: {
  buffer: Buffer;
  mimeType?: string;
  defaultMimeType?: string;
}): string;
declare function parseImageDataUrl(dataUrl: string): {
  mimeType: string;
  base64: string;
} | undefined;
declare function generatedImageAssetFromBase64(params: {
  base64: string | undefined;
  index: number;
  mimeType?: string;
  revisedPrompt?: string;
  defaultMimeType?: string;
  fileNamePrefix?: string;
  sniffMimeType?: boolean;
}): GeneratedImageAsset | undefined;
declare function generatedImageAssetFromDataUrl(params: {
  dataUrl: string;
  index: number;
  fileNamePrefix?: string;
}): GeneratedImageAsset | undefined;
declare function generatedImageAssetFromOpenAiCompatibleEntry(entry: OpenAiCompatibleImageResponseEntry, index: number, options?: {
  defaultMimeType?: string;
  fileNamePrefix?: string;
  sniffMimeType?: boolean;
}): GeneratedImageAsset | undefined;
declare function parseOpenAiCompatibleImageResponse(payload: unknown, options?: {
  defaultMimeType?: string;
  fileNamePrefix?: string;
  malformedResponseError?: string;
  sniffMimeType?: boolean;
}): GeneratedImageAsset[];
declare function imageSourceUploadFileName(params: {
  image: ImageGenerationSourceImage;
  index: number;
  defaultMimeType?: string;
  fileNamePrefix?: string;
}): string;
//#endregion
export { type GeneratedImageAsset, type ImageGenerationBackground, type ImageGenerationOpenAIBackground, type ImageGenerationOpenAIModeration, type ImageGenerationOpenAIOptions, type ImageGenerationOutputFormat, type ImageGenerationProvider, type ImageGenerationProviderConfiguredContext, type ImageGenerationProviderOptions, type ImageGenerationQuality, type ImageGenerationRequest, type ImageGenerationResolution, type ImageGenerationResult, type ImageGenerationSourceImage, type ImageMimeTypeDetection, type OpenAiCompatibleImageProviderOptions, type OpenAiCompatibleImageProviderRequestBody, type OpenAiCompatibleImageProviderRequestParams, type OpenAiCompatibleImageRequestMode, type OpenAiCompatibleImageResponseEntry, type OpenAiCompatibleImageResponsePayload, createOpenAiCompatibleImageGenerationProvider, generatedImageAssetFromBase64, generatedImageAssetFromDataUrl, generatedImageAssetFromOpenAiCompatibleEntry, imageFileExtensionForMimeType, imageSourceUploadFileName, parseImageDataUrl, parseOpenAiCompatibleImageResponse, resolveInlineImageJsonResponseMaxBytes, sniffImageMimeType, toImageDataUrl };