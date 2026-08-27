import { T as ProviderRuntimeModel, y as ProviderResolveDynamicModelContext } from "../../types-CbXjz50O.js";
import { c as Model, n as Api } from "../../types-GU_0Dtwq.js";
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