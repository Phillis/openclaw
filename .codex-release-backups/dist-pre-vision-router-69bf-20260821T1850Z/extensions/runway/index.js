import { t as definePluginEntry } from "../../plugin-entry-Ckewxva0.js";
import { t as buildRunwayVideoGenerationProvider } from "../../video-generation-provider-C6Yr9IHs.js";
//#region extensions/runway/index.ts
var runway_default = definePluginEntry({
	id: "runway",
	name: "Runway Provider",
	description: "Bundled Runway video provider plugin",
	register(api) {
		api.registerVideoGenerationProvider(buildRunwayVideoGenerationProvider());
	}
});
//#endregion
export { runway_default as default };
