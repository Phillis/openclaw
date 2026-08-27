import { t as definePluginEntry } from "../../plugin-entry-B4wzLSpS.js";
import { t as buildFalImageGenerationProvider } from "../../image-generation-provider-JpPHCLVf.js";
import { t as buildFalMusicGenerationProvider } from "../../music-generation-provider-uryHi8mZ.js";
import { t as createFalProvider } from "../../provider-registration-BkM0ADo6.js";
import { t as buildFalVideoGenerationProvider } from "../../video-generation-provider-opukCvQz.js";
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
