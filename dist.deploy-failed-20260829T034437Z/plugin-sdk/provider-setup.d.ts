import { n as OpenClawConfig } from "../types.openclaw-BssW6c46.js";
import { i as ModelDefinitionConfig } from "../types.models-BxGvs1Ab.js";
import { n as WizardPrompter } from "../types.plugin-c3ODlhUq.js";
import { Jn as ProviderAuthContext, Mn as ProviderPrepareDynamicModelContext, Un as ProviderCatalogContext, Vn as ProviderRuntimeModel, Xn as ProviderAuthMethodNonInteractiveContext, Zn as ProviderAuthResult, p as OpenClawPluginApi } from "../types-CiLdD6DO.js";
import { c as defineSelfHostedOpenAICompatibleProvider, o as SelfHostedOpenAICompatibleProviderOptions } from "../provider-model-shared-KuDu2ZW5.js";
//#region src/agents/self-hosted-provider-defaults.d.ts
/**
 * Conservative defaults for self-hosted providers when the model catalog
 * cannot supply pricing or token limits.
 */
/** Default context window used for self-hosted provider catalog entries. */
declare const SELF_HOSTED_DEFAULT_CONTEXT_WINDOW = 128000;
/** Default output-token cap used for self-hosted provider catalog entries. */
declare const SELF_HOSTED_DEFAULT_MAX_TOKENS = 8192;
/** Zero-cost pricing used for self-hosted provider catalog entries. */
declare const SELF_HOSTED_DEFAULT_COST: {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
};
//#endregion
//#region src/plugins/provider-self-hosted-setup.d.ts
declare function applyProviderDefaultModel(cfg: OpenClawConfig, modelRef: string): OpenClawConfig;
type OpenAICompatibleSelfHostedProviderSetupParams = {
  cfg: OpenClawConfig;
  prompter: WizardPrompter;
  providerId: string;
  providerLabel: string;
  defaultBaseUrl: string;
  defaultApiKeyEnvVar: string;
  modelPlaceholder: string;
  input?: Array<"text" | "image">;
  reasoning?: boolean;
  contextWindow?: number;
  maxTokens?: number;
};
declare function promptAndConfigureOpenAICompatibleSelfHostedProviderAuth(params: OpenAICompatibleSelfHostedProviderSetupParams): Promise<ProviderAuthResult>;
declare function discoverOpenAICompatibleSelfHostedProvider<T extends Record<string, unknown>>(params: {
  ctx: ProviderCatalogContext;
  providerId: string;
  buildProvider: (params: {
    apiKey?: string;
    baseUrl?: string;
  }) => Promise<T>;
}): Promise<{
  provider: T & {
    apiKey: string;
  };
} | null>;
declare function configureOpenAICompatibleSelfHostedProviderNonInteractive(params: {
  ctx: ProviderAuthMethodNonInteractiveContext;
  providerId: string;
  providerLabel: string;
  defaultBaseUrl: string;
  defaultApiKeyEnvVar: string;
  modelPlaceholder: string;
  input?: Array<"text" | "image">;
  reasoning?: boolean;
  contextWindow?: number;
  maxTokens?: number;
}): Promise<OpenClawConfig | null>;
//#endregion
//#region src/plugins/provider-self-hosted-discovery.d.ts
type OpenAICompatibleModelDiscoveryRow = {
  model: Record<string, unknown>;
  props?: Record<string, unknown>;
};
type OpenAICompatibleModelDiscoveryResult = {
  kind: "success";
  health: "ready" | "loading" | "unknown";
  rows: OpenAICompatibleModelDiscoveryRow[];
  fetchedAt: number;
} | {
  kind: "unreachable";
  error: unknown;
} | {
  kind: "http-error";
  path: string;
  status: number;
} | {
  kind: "invalid-response";
  path: string;
  error: unknown;
};
type OpenAICompatibleLocalModelsParams = {
  baseUrl: string;
  serverBaseUrl?: string;
  apiKey?: string;
  headers?: Record<string, string>;
  label: string;
  healthPath?: string;
  modelsPathOrder?: "inference" | "server-first";
  routerModelProps?: boolean;
  contextWindow?: number;
  discoverRuntimeContext?: boolean;
  maxTokens?: number;
  timeoutMs?: number;
  propsTimeoutMs?: number;
  signal?: AbortSignal;
  env?: NodeJS.ProcessEnv;
  rawResult?: boolean;
};
/** Discovers normalized model configs from a conventional OpenAI-compatible endpoint. */
declare function discoverOpenAICompatibleLocalModels(params: OpenAICompatibleLocalModelsParams & {
  rawResult: true;
}): Promise<OpenAICompatibleModelDiscoveryResult>;
declare function discoverOpenAICompatibleLocalModels(params: OpenAICompatibleLocalModelsParams & {
  rawResult?: false;
}): Promise<ModelDefinitionConfig[]>;
//#endregion
export { type OpenClawPluginApi, type ProviderAuthContext, type ProviderAuthMethodNonInteractiveContext, type ProviderAuthResult, type ProviderCatalogContext, type ProviderPrepareDynamicModelContext, type ProviderRuntimeModel, SELF_HOSTED_DEFAULT_CONTEXT_WINDOW, SELF_HOSTED_DEFAULT_COST, SELF_HOSTED_DEFAULT_MAX_TOKENS, type SelfHostedOpenAICompatibleProviderOptions, applyProviderDefaultModel, configureOpenAICompatibleSelfHostedProviderNonInteractive, defineSelfHostedOpenAICompatibleProvider, discoverOpenAICompatibleLocalModels, discoverOpenAICompatibleSelfHostedProvider, promptAndConfigureOpenAICompatibleSelfHostedProviderAuth };