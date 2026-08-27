import { y as WebSearchProviderPlugin } from "../../types-DYqBZyXL.js";
//#region extensions/brave/web-search-shared.d.ts
/** Build the common Brave provider metadata without the runtime tool executor. */
declare function buildBraveWebSearchProviderBase(): Omit<WebSearchProviderPlugin, "createTool">;
//#endregion
export { buildBraveWebSearchProviderBase };