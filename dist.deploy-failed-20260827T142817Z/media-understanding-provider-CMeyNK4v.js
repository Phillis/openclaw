import { r as describeImagesWithModel, t as describeImageWithModel } from "./image-runtime-CYuu4eVp.js";
import "./media-understanding-BvzVs9aF.js";
import { t as OLLAMA_PROVIDER_ID } from "./discovery-shared-zdJhs5gC.js";
//#region extensions/ollama/src/media-understanding-provider.ts
const ollamaMediaUnderstandingProvider = {
	id: OLLAMA_PROVIDER_ID,
	capabilities: ["image"],
	describeImage: describeImageWithModel,
	describeImages: describeImagesWithModel
};
//#endregion
export { ollamaMediaUnderstandingProvider };
