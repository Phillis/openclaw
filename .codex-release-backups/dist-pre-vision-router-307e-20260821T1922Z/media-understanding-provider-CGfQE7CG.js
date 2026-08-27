import { r as describeImagesWithModel, t as describeImageWithModel } from "./image-runtime-CS_lnWJh.js";
import "./media-understanding-BWWLT7u3.js";
//#region extensions/anthropic/media-understanding-provider.ts
/**
* Anthropic media-understanding provider descriptor. It routes image and native
* document description through the shared model-backed media helpers.
*/
/** Media-understanding provider for Anthropic Claude models. */
const anthropicMediaUnderstandingProvider = {
	id: "anthropic",
	capabilities: ["image"],
	defaultModels: { image: "claude-opus-5" },
	autoPriority: { image: 20 },
	nativeDocumentInputs: ["pdf"],
	describeImage: describeImageWithModel,
	describeImages: describeImagesWithModel
};
//#endregion
export { anthropicMediaUnderstandingProvider as t };
