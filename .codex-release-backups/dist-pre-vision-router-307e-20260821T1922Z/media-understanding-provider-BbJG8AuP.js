import { r as describeImagesWithModel, t as describeImageWithModel } from "./image-runtime-CS_lnWJh.js";
import "./media-understanding-BWWLT7u3.js";
import { t as OLLAMA_PROVIDER_ID } from "./discovery-shared-DmNtuPcd.js";
//#region extensions/ollama/src/media-understanding-provider.ts
const ollamaMediaUnderstandingProvider = {
	id: OLLAMA_PROVIDER_ID,
	capabilities: ["image"],
	describeImage: describeImageWithModel,
	describeImages: describeImagesWithModel
};
//#endregion
export { ollamaMediaUnderstandingProvider };
