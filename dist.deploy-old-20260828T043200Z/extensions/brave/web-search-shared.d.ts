import { it as WebSearchProviderPlugin } from "../../runtime-api-IAhSVA75.js";
import "../../provider-web-search-config-contract-DfaJSLBp.js";
//#region extensions/brave/web-search-shared.d.ts
/** Build the common Brave provider metadata without the runtime tool executor. */
declare function buildBraveWebSearchProviderBase(): Omit<WebSearchProviderPlugin, "createTool">;
//#endregion
export { buildBraveWebSearchProviderBase };