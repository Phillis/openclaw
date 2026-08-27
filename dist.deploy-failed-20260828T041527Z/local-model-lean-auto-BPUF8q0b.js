import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { r as isCloudModelRef } from "./model-catalog-refs-BdjEHOKQ.js";
//#region src/config/local-model-lean-auto.ts
const AUTO_LOCAL_MODEL_LEAN_PROVIDER_IDS = /* @__PURE__ */ new Set(["lmstudio", "ollama"]);
/** Returns true only for local runtimes that onboarding can identify without model-name guesses. */
function shouldAutoEnableLocalModelLean(providerId, modelRef) {
	const normalizedProviderId = normalizeProviderId(providerId);
	if (!AUTO_LOCAL_MODEL_LEAN_PROVIDER_IDS.has(normalizedProviderId)) return false;
	if (normalizedProviderId !== "ollama") return true;
	return !isCloudModelRef(modelRef);
}
function resolveDefaultModelRef(config) {
	const model = config.agents?.defaults?.model;
	return typeof model === "string" ? model : model?.primary;
}
function clearAutoModel(config) {
	const wizard = { ...config.wizard };
	delete wizard.localModelLeanAutoModel;
	return {
		...config,
		wizard
	};
}
/** Maintains the onboarding-owned lean default while preserving explicit user configuration. */
function applyAutoLocalModelLean(params) {
	const localModelLean = params.config.agents?.defaults?.experimental?.localModelLean;
	const autoModel = params.config.wizard?.localModelLeanAutoModel;
	const onboardingOwnsSetting = autoModel !== void 0 && (params.previousModelRef ?? resolveDefaultModelRef(params.config)) === autoModel;
	if (!shouldAutoEnableLocalModelLean(params.providerId, params.modelRef)) {
		if (!autoModel) return {
			config: params.config,
			changed: false,
			enabled: false
		};
		const config = clearAutoModel(params.config);
		if (!onboardingOwnsSetting || localModelLean !== true) return {
			config,
			changed: true,
			enabled: false
		};
		const experimental = { ...params.config.agents?.defaults?.experimental };
		delete experimental.localModelLean;
		return {
			config: {
				...config,
				agents: {
					...config.agents,
					defaults: {
						...config.agents?.defaults,
						experimental
					}
				}
			},
			changed: true,
			enabled: false
		};
	}
	if (localModelLean !== void 0) {
		if (!autoModel) return {
			config: params.config,
			changed: false,
			enabled: false
		};
		if (!onboardingOwnsSetting || !localModelLean) return {
			config: clearAutoModel(params.config),
			changed: true,
			enabled: false
		};
		if (autoModel === params.modelRef) return {
			config: params.config,
			changed: false,
			enabled: false
		};
		return {
			config: {
				...params.config,
				wizard: {
					...params.config.wizard,
					localModelLeanAutoModel: params.modelRef
				}
			},
			changed: true,
			enabled: false
		};
	}
	return {
		config: {
			...params.config,
			wizard: {
				...params.config.wizard,
				localModelLeanAutoModel: params.modelRef
			},
			agents: {
				...params.config.agents,
				defaults: {
					...params.config.agents?.defaults,
					experimental: {
						...params.config.agents?.defaults?.experimental,
						localModelLean: true
					}
				}
			}
		},
		changed: true,
		enabled: true
	};
}
//#endregion
export { applyAutoLocalModelLean as t };
