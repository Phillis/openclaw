import { t as createExaWebSearchProvider } from "./exa-web-search-provider-Du2L8CNV.js";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
//#region extensions/exa/index.ts
var exa_default = definePluginEntry({
	id: "exa",
	name: "Exa Plugin",
	description: "Bundled Exa web search plugin",
	register(api) {
		api.registerWebSearchProvider(createExaWebSearchProvider());
	}
});
//#endregion
export { exa_default as default };
