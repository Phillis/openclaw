import { t as definePluginEntry } from "../../plugin-entry-B4wzLSpS.js";
import { t as buildFalImageGenerationProvider } from "../../image-generation-provider-sVNAy9HT.js";
import { t as buildFalMusicGenerationProvider } from "../../music-generation-provider-BaWxnpXZ.js";
import { t as createFalProvider } from "../../provider-registration-BOHUZtOt.js";
import { t as buildFalVideoGenerationProvider } from "../../video-generation-provider-BcOPHWCq.js";
var fal_default = definePluginEntry({
	id: "fal",
	name: "fal Provider",
	description: "Bundled fal image, video, and music generation provider",
	register(api) {
		api.registerProvider(createFalProvider());
		api.registerImageGenerationProvider(buildFalImageGenerationProvider());
		api.registerMusicGenerationProvider(buildFalMusicGenerationProvider());
		api.registerVideoGenerationProvider(buildFalVideoGenerationProvider());
	}
});
//#endregion
export { fal_default as default };
