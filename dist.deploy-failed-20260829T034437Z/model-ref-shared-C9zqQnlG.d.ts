import { t as PluginManifestRecord } from "./manifest-registry-BvU-V0_L.js";
//#region src/agents/model-ref-shared.d.ts
type ModelRef = {
  provider: string;
  model: string;
};
type ModelManifestNormalizationContext = {
  manifestPlugins?: readonly Pick<PluginManifestRecord, "modelIdNormalization">[];
};
//#endregion
export { ModelRef as n, ModelManifestNormalizationContext as t };