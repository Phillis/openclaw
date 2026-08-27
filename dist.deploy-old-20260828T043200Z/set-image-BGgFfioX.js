import { a as resolveAgentModelPrimaryValue } from "./model-input-ILUprkGk.js";
import { r as logConfigUpdated } from "./logging-CzP_6-o-.js";
import { l as updateDefaultModelPrimaryConfig } from "./shared-BOd9kz9I.js";
//#region src/commands/models/set-image.ts
/** Command for setting the default image model. */
/** Sets agents.defaults.imageModel.primary after resolving aliases/catalog provider aliases. */
async function modelsSetImageCommand(modelRaw, runtime) {
	const { updated, warning } = await updateDefaultModelPrimaryConfig({
		modelRaw,
		field: "imageModel"
	});
	if (warning) runtime.error?.(warning);
	logConfigUpdated(runtime);
	runtime.log(`Image model: ${resolveAgentModelPrimaryValue(updated.agents?.defaults?.imageModel) ?? modelRaw}`);
}
//#endregion
export { modelsSetImageCommand };
