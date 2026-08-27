import { a as resolveAgentModelPrimaryValue } from "./model-input-ILUprkGk.js";
import { r as logConfigUpdated } from "./logging-CzP_6-o-.js";
import { l as updateDefaultModelPrimaryConfig } from "./shared-BOd9kz9I.js";
import { a as repairCopilotRuntimePluginInstallForModelSelection, i as repairCodexRuntimePluginInstallForModelSelection } from "./runtime-plugin-install-I2k_FeaD.js";
import "./codex-runtime-plugin-install-Cry5zQqF.js";
import "./copilot-runtime-plugin-install-Cry5zQqF.js";
//#region src/commands/models/set.ts
/** Command for setting the default text model. */
/** Sets agents.defaults.model.primary and repairs provider runtime plugin installs when needed. */
async function modelsSetCommand(modelRaw, runtime) {
	const { updated, warning: catalogWarning } = await updateDefaultModelPrimaryConfig({
		modelRaw,
		field: "model"
	});
	if (catalogWarning) runtime.error?.(catalogWarning);
	const selectedModel = resolveAgentModelPrimaryValue(updated.agents?.defaults?.model) ?? modelRaw;
	const repaired = await repairCodexRuntimePluginInstallForModelSelection({
		cfg: updated,
		model: selectedModel
	});
	const copilotRepaired = await repairCopilotRuntimePluginInstallForModelSelection({
		cfg: updated,
		model: selectedModel
	});
	const warnings = [...repaired.warnings, ...copilotRepaired.warnings];
	for (const warning of warnings) runtime.error?.(warning);
	logConfigUpdated(runtime);
	runtime.log(`Default model: ${selectedModel}`);
}
//#endregion
export { modelsSetCommand };
