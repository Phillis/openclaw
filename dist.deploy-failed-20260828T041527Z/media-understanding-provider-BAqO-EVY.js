import { r as describeImagesWithModel, t as describeImageWithModel } from "./image-runtime-Di2Lep6Z.js";
import "./media-understanding-D0hMpRCx.js";
import { t as OLLAMA_PROVIDER_ID } from "./discovery-shared-BleTb87g.js";
//#region extensions/ollama/src/media-understanding-provider.ts
const ollamaMediaUnderstandingProvider = {
	id: OLLAMA_PROVIDER_ID,
	capabilities: ["image"],
	describeImage: describeImageWithModel,
	describeImages: describeImagesWithModel
};
//#endregion
export { ollamaMediaUnderstandingProvider };
