import { P as ProviderAuthMethod, x as ProviderPlugin } from "../../plugin-entry-DyrRrRy2.js";
import "../../provider-model-shared-OqOvby2f.js";
//#region extensions/openai/openai-chatgpt-provider.d.ts
declare function buildOpenAIChatGPTAuthMethodRuns(): Readonly<Record<"oauth" | "device-code", ProviderAuthMethod["run"]>>;
declare function buildOpenAICodexProviderHooks(): Pick<ProviderPlugin, "resolveDynamicModel" | "buildAuthDoctorHint" | "resolveThinkingProfile" | "isModernModelRef" | "preferRuntimeResolvedModel" | "normalizeResolvedModel" | "normalizeTransport" | "resolveUsageAuth" | "fetchUsageSnapshot" | "refreshOAuth" | "augmentModelCatalog" | "resolveReasoningOutputMode">;
//#endregion
export { buildOpenAIChatGPTAuthMethodRuns, buildOpenAICodexProviderHooks };