import { r as describeImagesWithModel, t as describeImageWithModel } from "./image-runtime-Bjvl3Oyo.js";
import "./media-understanding-B6SU5OvA.js";
import { t as OLLAMA_PROVIDER_ID } from "./discovery-shared-DM7wPsWM.js";
//#region extensions/ollama/src/media-understanding-provider.ts
const ollamaMediaUnderstandingProvider = {
	id: OLLAMA_PROVIDER_ID,
	capabilities: ["image"],
	describeImage: describeImageWithModel,
	describeImages: describeImagesWithModel
};
//#endregion
export { ollamaMediaUnderstandingProvider };
