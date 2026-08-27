import { r as describeImagesWithModel, t as describeImageWithModel } from "./image-runtime-CleqRgm3.js";
import "./media-understanding-BZzGeoPt.js";
import { t as OLLAMA_PROVIDER_ID } from "./discovery-shared-BEv-0Rf0.js";
//#region extensions/ollama/src/media-understanding-provider.ts
const ollamaMediaUnderstandingProvider = {
	id: OLLAMA_PROVIDER_ID,
	capabilities: ["image"],
	describeImage: describeImageWithModel,
	describeImages: describeImagesWithModel
};
//#endregion
export { ollamaMediaUnderstandingProvider };
