import { n as ModelRef, t as ModelManifestNormalizationContext } from "./model-ref-shared-C9zqQnlG.js";
//#region src/agents/model-selection-normalize.d.ts
type ModelRefNormalizeOptions = ModelManifestNormalizationContext & {
  allowManifestNormalization?: boolean;
  allowPluginNormalization?: boolean;
};
/** Parse `provider/model` or bare model text using a default provider. */
declare function parseModelRef(raw: string, defaultProvider: string, options?: ModelRefNormalizeOptions): ModelRef | null;
//#endregion
export { parseModelRef as t };