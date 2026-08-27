import { b as ProviderNormalizeConfigContext } from "../../plugin-entry-CX5-Xb96.js";
import { o as ModelProviderConfig } from "../../types.models-DQnz5K9u.js";
import "../../provider-model-types-Dy05kVgC.js";
//#region extensions/lmstudio/provider-policy-api.d.ts
/** Normalize saved reasoning metadata without activating provider runtime or changing transport. */
declare function normalizeConfig({ provider, providerConfig }: ProviderNormalizeConfigContext): ModelProviderConfig;
//#endregion
export { normalizeConfig };