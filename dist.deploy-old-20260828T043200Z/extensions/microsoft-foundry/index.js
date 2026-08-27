import { t as definePluginEntry } from "../../plugin-entry-BIDZMa3K.js";
import { t as buildMicrosoftFoundryImageGenerationProvider } from "../../image-generation-provider-C0Tl3saG.js";
import { t as buildMicrosoftFoundryProvider } from "../../provider-B64DrSs9.js";
//#region extensions/microsoft-foundry/index.ts
var microsoft_foundry_default = definePluginEntry({
	id: "microsoft-foundry",
	name: "Microsoft Foundry Provider",
	description: "Microsoft Foundry provider with Entra ID and API key auth",
	register(api) {
		api.registerProvider(buildMicrosoftFoundryProvider());
		api.registerImageGenerationProvider(buildMicrosoftFoundryImageGenerationProvider());
	}
});
//#endregion
export { microsoft_foundry_default as default };
