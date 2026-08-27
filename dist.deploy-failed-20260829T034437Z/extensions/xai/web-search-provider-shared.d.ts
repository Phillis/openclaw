import { it as WebSearchProviderPlugin } from "../../runtime-api-IAhSVA75.js";
import "../../provider-web-search-config-contract-DfaJSLBp.js";
//#region extensions/xai/web-search-provider-shared.d.ts
declare function buildXaiWebSearchProviderBase(): Omit<WebSearchProviderPlugin, "createTool" | "runSetup">;
//#endregion
export { buildXaiWebSearchProviderBase };