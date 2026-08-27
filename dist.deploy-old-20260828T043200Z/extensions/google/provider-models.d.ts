import { jt as ProviderResolveDynamicModelContext, tr as ProviderRuntimeModel } from "../../acpx-BA25QFjp.js";
//#region extensions/google/provider-models.d.ts
declare function isGoogleTextGenerationModelId(id: string): boolean;
declare function isGoogleNativeVideoModelId(id: string): boolean;
declare function resolveGoogleStaticModelId(id: string, staticIds: ReadonlySet<string>): string | undefined;
declare function resolveGoogleGeminiForwardCompatModel(params: {
  providerId: string;
  templateProviderId?: string;
  ctx: ProviderResolveDynamicModelContext;
}): ProviderRuntimeModel | undefined;
declare function isModernGoogleModel(modelId: string): boolean;
//#endregion
export { isGoogleNativeVideoModelId, isGoogleTextGenerationModelId, isModernGoogleModel, resolveGoogleGeminiForwardCompatModel, resolveGoogleStaticModelId };