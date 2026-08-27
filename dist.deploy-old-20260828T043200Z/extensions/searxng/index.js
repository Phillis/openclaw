import { t as createSearxngWebSearchProvider } from "./searxng-search-provider-DRnBkbzG.js";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
//#region extensions/searxng/index.ts
var searxng_default = definePluginEntry({
	id: "searxng",
	name: "SearXNG Plugin",
	description: "Bundled SearXNG web search plugin",
	register(api) {
		api.registerWebSearchProvider(createSearxngWebSearchProvider());
	}
});
//#endregion
export { searxng_default as default };
