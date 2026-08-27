import { t as definePluginEntry } from "../../plugin-entry-B4wzLSpS.js";
import { t as buildMicrosoftSpeechProvider } from "../../speech-provider-DZza9xpj.js";
//#region extensions/microsoft/index.ts
var microsoft_default = definePluginEntry({
	id: "microsoft",
	name: "Microsoft Speech",
	description: "Bundled Microsoft speech provider",
	register(api) {
		api.registerSpeechProvider(buildMicrosoftSpeechProvider());
	}
});
//#endregion
export { microsoft_default as default };
