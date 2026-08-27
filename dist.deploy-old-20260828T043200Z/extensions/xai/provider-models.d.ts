import { C as ProviderResolveDynamicModelContext, st as ProviderRuntimeModel } from "../../runtime-api-IAhSVA75.js";
import { c as Model, n as Api } from "../../types-Sg3pk96c.js";
import "../../index-Dd1tm5Mu.js";
//#region extensions/xai/provider-models.d.ts
declare function isModernXaiModel(modelId: string): boolean;
declare function resolveXaiForwardCompatModel(params: {
  providerId: string;
  ctx: ProviderResolveDynamicModelContext;
}): (Model<Api> & {
  compat: Record<string, unknown>;
  thinkingLevelMap: Partial<Record<"off" | "minimal" | "low" | "medium" | "high" | "xhigh", string | null>>;
}) | undefined;
declare function normalizeXaiResolvedModel(model: ProviderRuntimeModel): ProviderRuntimeModel;
//#endregion
export { isModernXaiModel, normalizeXaiResolvedModel, resolveXaiForwardCompatModel };