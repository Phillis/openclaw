import { r as describeImagesWithModel, t as describeImageWithModel } from "./image-runtime-ciabHsxe.js";
import "./media-understanding-BjYvarC_.js";
import { t as OLLAMA_PROVIDER_ID } from "./discovery-shared-BqMOJDbT.js";
//#region extensions/ollama/src/media-understanding-provider.ts
const ollamaMediaUnderstandingProvider = {
	id: OLLAMA_PROVIDER_ID,
	capabilities: ["image"],
	describeImage: describeImageWithModel,
	describeImages: describeImagesWithModel
};
//#endregion
export { ollamaMediaUnderstandingProvider };
