import { t as PluginManifestRecord } from "./manifest-registry-2CBAZ6tk.js";

//#region src/agents/model-ref-shared.d.ts
type ModelRef = {
  provider: string;
  model: string;
};
type ModelManifestNormalizationContext = {
  manifestPlugins?: readonly Pick<PluginManifestRecord, "modelIdNormalization">[];
};
//#endregion
//#region src/agents/model-selection-normalize.d.ts
type ModelRefNormalizeOptions = ModelManifestNormalizationContext & {
  allowManifestNormalization?: boolean;
  allowPluginNormalization?: boolean;
};
/** Find a provider value by normalized provider ID. */
/** Parse `provider/model` or bare model text using a default provider. */
declare function parseModelRef(raw: string, defaultProvider: string, options?: ModelRefNormalizeOptions): ModelRef | null;
//#endregion
export { parseModelRef as t };