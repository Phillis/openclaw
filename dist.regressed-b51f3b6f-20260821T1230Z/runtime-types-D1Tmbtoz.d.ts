import { n as OpenClawConfig } from "./types.openclaw-LvSHMCsQ.js";
import { a as MediaUnderstandingProvider, i as MediaUnderstandingDecision, o as StructuredExtractionInput, s as MediaUnderstandingOutput } from "./types-BWT7ESoe.js";
import { r as AuthProfileStore } from "./types-DN31KF-t.js";

//#region packages/media-understanding-common/src/active-model.d.ts
/** Provider/model pair selected for one media-understanding request. */
type ActiveMediaModel = {
  provider: string;
  model?: string;
};
//#endregion
//#region src/media-understanding/runtime-types.d.ts
type RunMediaUnderstandingFileParams = {
  capability: "image" | "audio" | "video";
  filePath: string;
  mediaUrl?: string;
  cfg: OpenClawConfig;
  agentId?: string;
  agentDir?: string;
  workspaceDir?: string;
  mime?: string;
  activeModel?: ActiveMediaModel;
  prompt?: string;
  timeoutMs?: number;
  scopeContext?: MediaUnderstandingScopeContext;
};
type MediaUnderstandingScopeContext = {
  sessionKey?: string;
  channel?: string;
  chatType?: string;
};
type RunMediaUnderstandingFileResult = {
  text: string | undefined;
  provider?: string;
  model?: string;
  output?: MediaUnderstandingOutput;
  decision?: MediaUnderstandingDecision;
};
type DescribeImageFileParams = {
  filePath: string;
  mediaUrl?: string;
  cfg: OpenClawConfig;
  agentId?: string;
  agentDir?: string;
  workspaceDir?: string;
  mime?: string;
  activeModel?: ActiveMediaModel;
  prompt?: string;
  timeoutMs?: number;
  scopeContext?: MediaUnderstandingScopeContext;
};
type DescribeImageFileWithModelParams = {
  filePath: string;
  mediaUrl?: string;
  cfg: OpenClawConfig;
  agentId?: string;
  agentDir?: string;
  workspaceDir?: string;
  mime?: string;
  provider: string;
  model: string;
  prompt: string;
  maxTokens?: number;
  timeoutMs?: number;
};
type PreparedImageDescriptionInput = {
  buffer: Buffer;
  fileName: string;
  mime?: string;
};
type PrepareImageDescriptionInputParams = Pick<DescribeImageFileWithModelParams, "filePath" | "mediaUrl" | "mime" | "cfg" | "timeoutMs">;
type DescribePreparedImageWithModelParams = Omit<DescribeImageFileWithModelParams, "filePath" | "mediaUrl" | "mime"> & {
  image: PreparedImageDescriptionInput;
};
type DescribeImageFileWithModelResult = Awaited<ReturnType<NonNullable<MediaUnderstandingProvider["describeImage"]>>>;
type ExtractStructuredWithModelParams = {
  /** At least one image input is required; text inputs provide supplemental context. */input: StructuredExtractionInput[];
  instructions: string;
  schemaName?: string;
  jsonSchema?: unknown;
  jsonMode?: boolean;
  cfg: OpenClawConfig;
  agentDir?: string;
  provider: string;
  model: string;
  profile?: string;
  preferredProfile?: string;
  authStore?: AuthProfileStore;
  timeoutMs?: number;
};
type ExtractStructuredWithModelResult = Awaited<ReturnType<NonNullable<MediaUnderstandingProvider["extractStructured"]>>>;
type DescribeVideoFileParams = {
  filePath: string;
  cfg: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  mime?: string;
  activeModel?: ActiveMediaModel;
};
type TranscribeAudioFileParams = {
  filePath: string;
  cfg: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  mime?: string;
  activeModel?: ActiveMediaModel;
  language?: string;
  prompt?: string;
};
type MediaUnderstandingRuntime = {
  runMediaUnderstandingFile: (params: RunMediaUnderstandingFileParams) => Promise<RunMediaUnderstandingFileResult>;
  describeImageFile: (params: DescribeImageFileParams) => Promise<RunMediaUnderstandingFileResult>;
  prepareImageDescriptionInput: (params: PrepareImageDescriptionInputParams) => Promise<PreparedImageDescriptionInput>;
  describePreparedImageWithModel: (params: DescribePreparedImageWithModelParams) => Promise<DescribeImageFileWithModelResult>;
  describeImageFileWithModel: (params: DescribeImageFileWithModelParams) => Promise<DescribeImageFileWithModelResult>;
  extractStructuredWithModel: (params: ExtractStructuredWithModelParams) => Promise<ExtractStructuredWithModelResult>;
  describeVideoFile: (params: DescribeVideoFileParams) => Promise<RunMediaUnderstandingFileResult>;
  transcribeAudioFile: (params: TranscribeAudioFileParams) => Promise<RunMediaUnderstandingFileResult>;
};
//#endregion
export { RunMediaUnderstandingFileParams as a, MediaUnderstandingRuntime as i, DescribeImageFileWithModelParams as n, RunMediaUnderstandingFileResult as o, DescribeVideoFileParams as r, TranscribeAudioFileParams as s, DescribeImageFileParams as t };