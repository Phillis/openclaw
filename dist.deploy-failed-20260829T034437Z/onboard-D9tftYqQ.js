import { p as createDefaultModelsPresetAppliers } from "./provider-onboard-B4dg7cZS.js";
import { a as buildSelectableNvidiaProvider, t as NVIDIA_DEFAULT_MODEL_ID } from "./provider-catalog-hehqJRJY.js";
//#region extensions/nvidia/onboard.ts
const NVIDIA_DEFAULT_MODEL_REF = NVIDIA_DEFAULT_MODEL_ID;
const { applyConfig: applyNvidiaConfig, applyProviderConfig: applyNvidiaProviderConfig } = createDefaultModelsPresetAppliers({
	primaryModelRef: NVIDIA_DEFAULT_MODEL_REF,
	resolveParams: () => {
		const defaultProvider = buildSelectableNvidiaProvider();
		return {
			providerId: "nvidia",
			api: defaultProvider.api ?? "openai-completions",
			baseUrl: defaultProvider.baseUrl,
			defaultModels: defaultProvider.models ?? [],
			defaultModelId: NVIDIA_DEFAULT_MODEL_ID,
			aliases: [{
				modelRef: NVIDIA_DEFAULT_MODEL_REF,
				alias: "NVIDIA"
			}]
		};
	}
});
//#endregion
export { applyNvidiaConfig as n, applyNvidiaProviderConfig as r, NVIDIA_DEFAULT_MODEL_REF as t };
