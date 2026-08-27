import { it as WebSearchProviderPlugin } from "../../runtime-api-B8urSeFb.js";
import "../../provider-web-search-config-contract-Ctb3wfmR.js";
//#region extensions/xai/web-search-provider-shared.d.ts
declare function buildXaiWebSearchProviderBase(): Omit<WebSearchProviderPlugin, "createTool" | "runSetup">;
//#endregion
export { buildXaiWebSearchProviderBase };