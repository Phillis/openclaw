import { t as definePluginEntry } from "../../plugin-entry-B4wzLSpS.js";
import { t as alibabaVideoGenerationProvider } from "../../video-generation-provider-B8MUsH3U.js";
//#region extensions/alibaba/index.ts
/**
* Alibaba Model Studio plugin entry. Registers the DashScope-backed video
* generation provider.
*/
var alibaba_default = definePluginEntry({
	id: "alibaba",
	name: "Alibaba Model Studio Plugin",
	description: "Bundled Alibaba Model Studio video provider plugin",
	register(api) {
		api.registerVideoGenerationProvider(alibabaVideoGenerationProvider);
	}
});
//#endregion
export { alibaba_default as default };
