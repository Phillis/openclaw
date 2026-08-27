import { A as ProviderAuthResult, D as ProviderAppGuidedSetupContext, M as ProviderRuntimeModel, N as ProviderCatalogContext, T as ProviderPrepareDynamicModelContext, W as SecretInputMode, k as ProviderAuthMethodNonInteractiveContext } from "../../types-BwmvzNiR.js";
import { n as OpenClawConfig, u as ModelProviderDeclarationConfig } from "../../types.openclaw-CTCn19OD.js";
import { n as WizardPrompter } from "../../types.public-Ca4rxCP0.js";
import { A as LMSTUDIO_PROVIDER_LABEL, C as LMSTUDIO_DEFAULT_LOAD_CONTEXT_LENGTH, D as LMSTUDIO_LOCAL_API_KEY_PLACEHOLDER, E as LMSTUDIO_DOCKER_HOST_INFERENCE_BASE_URL, O as LMSTUDIO_MODEL_PLACEHOLDER, S as LMSTUDIO_DEFAULT_INFERENCE_BASE_URL, T as LMSTUDIO_DOCKER_HOST_BASE_URL, _ as resolveLmstudioServerBase, a as resolveLmstudioRuntimeApiKey, b as LMSTUDIO_DEFAULT_BASE_URL, c as buildLmstudioModelName, d as normalizeLmstudioConfiguredCatalogEntries, f as normalizeLmstudioConfiguredCatalogEntry, g as resolveLmstudioReasoningCompat, h as resolveLmstudioReasoningCapability, i as resolveLmstudioRequestContext, k as LMSTUDIO_PROVIDER_ID, l as mapLmstudioWireEntry, m as resolveLmstudioInferenceBase, n as resolveLmstudioConfiguredApiKey, o as LmstudioModelBase, p as normalizeLmstudioProviderConfig, r as resolveLmstudioProviderHeaders, s as LmstudioModelWire, t as buildLmstudioAuthHeaders, u as mapLmstudioWireModelsToConfig, v as resolveLoadedContextWindow, w as LMSTUDIO_DEFAULT_MODEL_ID, x as LMSTUDIO_DEFAULT_EMBEDDING_MODEL, y as LMSTUDIO_DEFAULT_API_KEY_ENV_VAR } from "../../runtime-DMFZI1z7.js";
//#region extensions/lmstudio/src/setup.d.ts
type ProviderPromptText = (params: {
  message: string;
  initialValue?: string;
  placeholder?: string;
  validate?: (value: string | undefined) => string | undefined;
}) => Promise<string | undefined>;
type ProviderPromptNote = (message: string, title?: string) => Promise<void> | void;
/** Read-only local discovery plus a success-gated config proposal for guided setup. */
declare function prepareAppGuidedLmstudioSetup(ctx: ProviderAppGuidedSetupContext & {
  modelRef?: string;
}): Promise<ProviderAuthResult | null>;
/** Interactive LM Studio setup with connectivity and model-availability checks. */
declare function promptAndConfigureLmstudioInteractive(params: {
  config: OpenClawConfig;
  agentDir?: string;
  prompter?: WizardPrompter;
  secretInputMode?: SecretInputMode;
  allowSecretRefPrompt?: boolean;
  isRemote?: boolean;
  signal?: AbortSignal;
  promptText?: ProviderPromptText;
  note?: ProviderPromptNote;
}): Promise<ProviderAuthResult>;
/** Non-interactive setup path backed by the shared self-hosted helper. */
declare function configureLmstudioNonInteractive(ctx: ProviderAuthMethodNonInteractiveContext): Promise<OpenClawConfig | null>;
/** Discovers provider settings, merging explicit config with live model discovery. */
declare function discoverLmstudioProvider(ctx: ProviderCatalogContext): Promise<{
  provider: ModelProviderDeclarationConfig;
} | null>;
declare function prepareLmstudioDynamicModels(ctx: ProviderPrepareDynamicModelContext): Promise<ProviderRuntimeModel[]>;
//#endregion
export { LMSTUDIO_DEFAULT_API_KEY_ENV_VAR, LMSTUDIO_DEFAULT_BASE_URL, LMSTUDIO_DEFAULT_EMBEDDING_MODEL, LMSTUDIO_DEFAULT_INFERENCE_BASE_URL, LMSTUDIO_DEFAULT_LOAD_CONTEXT_LENGTH, LMSTUDIO_DEFAULT_MODEL_ID, LMSTUDIO_DOCKER_HOST_BASE_URL, LMSTUDIO_DOCKER_HOST_INFERENCE_BASE_URL, LMSTUDIO_LOCAL_API_KEY_PLACEHOLDER, LMSTUDIO_MODEL_PLACEHOLDER, LMSTUDIO_PROVIDER_ID, LMSTUDIO_PROVIDER_LABEL, type LmstudioModelBase, type LmstudioModelWire, buildLmstudioAuthHeaders, buildLmstudioModelName, configureLmstudioNonInteractive, discoverLmstudioProvider, mapLmstudioWireEntry, mapLmstudioWireModelsToConfig, normalizeLmstudioConfiguredCatalogEntries, normalizeLmstudioConfiguredCatalogEntry, normalizeLmstudioProviderConfig, prepareAppGuidedLmstudioSetup, prepareLmstudioDynamicModels, promptAndConfigureLmstudioInteractive, resolveLmstudioConfiguredApiKey, resolveLmstudioInferenceBase, resolveLmstudioProviderHeaders, resolveLmstudioReasoningCapability, resolveLmstudioReasoningCompat, resolveLmstudioRequestContext, resolveLmstudioRuntimeApiKey, resolveLmstudioServerBase, resolveLoadedContextWindow };