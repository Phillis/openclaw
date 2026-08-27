import { t as definePluginEntry } from "../../plugin-entry-BIDZMa3K.js";
import { t as buildFalImageGenerationProvider } from "../../image-generation-provider-DobTpVAO.js";
import { t as buildFalMusicGenerationProvider } from "../../music-generation-provider-D_6Q0oYM.js";
import { t as createFalProvider } from "../../provider-registration-BcAw7vwL.js";
import { t as buildFalVideoGenerationProvider } from "../../video-generation-provider-DHZPhhBM.js";
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
