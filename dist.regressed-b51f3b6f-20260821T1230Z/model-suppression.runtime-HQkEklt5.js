import { r as shouldSuppressBuiltInModelCore, t as buildShouldSuppressBuiltInModelCore } from "./model-suppression-BAHzgnL2.js";
//#region src/agents/model-suppression.runtime.ts
/**
* Runtime seam for built-in model suppression.
* Lets tests and lazy catalog paths stub suppression behavior without importing
* the full suppression implementation at module load.
*/
/** Runtime-forwarded predicate for hiding bundled models. */
function shouldSuppressBuiltInModel(...args) {
	return shouldSuppressBuiltInModelCore(...args);
}
/** Build a provider-aware predicate for hiding bundled models. */
function buildShouldSuppressBuiltInModel(...args) {
	return buildShouldSuppressBuiltInModelCore(...args);
}
//#endregion
export { buildShouldSuppressBuiltInModel, shouldSuppressBuiltInModel };
