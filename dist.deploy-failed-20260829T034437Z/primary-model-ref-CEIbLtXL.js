import { a as resolveAgentModelPrimaryValue } from "./model-input-ILUprkGk.js";
import "./defaults-CdX9UGcX.js";
import { n as parseModelRef } from "./model-selection-normalize-DRjRnS6Y.js";
//#region src/commands/doctor/shared/primary-model-ref.ts
function resolveDoctorPrimaryModelRef(cfg, agentModel) {
	return parseModelRef(resolveAgentModelPrimaryValue(agentModel) ?? resolveAgentModelPrimaryValue(cfg.agents?.defaults?.model) ?? "gpt-5.6-sol", "openai", { allowPluginNormalization: false }) ?? {
		provider: "openai",
		model: "gpt-5.6-sol"
	};
}
//#endregion
export { resolveDoctorPrimaryModelRef as t };
