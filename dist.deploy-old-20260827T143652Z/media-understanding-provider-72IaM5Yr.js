import { r as describeImagesWithModel, t as describeImageWithModel } from "./image-runtime-vSAja5v-.js";
import "./media-understanding-BHtdVlkB.js";
import { t as OLLAMA_PROVIDER_ID } from "./discovery-shared-CtQLcYmU.js";
//#region extensions/ollama/src/media-understanding-provider.ts
const ollamaMediaUnderstandingProvider = {
	id: OLLAMA_PROVIDER_ID,
	capabilities: ["image"],
	describeImage: describeImageWithModel,
	describeImages: describeImagesWithModel
};
//#endregion
export { ollamaMediaUnderstandingProvider };
