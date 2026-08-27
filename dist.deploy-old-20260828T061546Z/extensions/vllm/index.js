import { o as defineSelfHostedOpenAICompatibleProvider } from "../../provider-model-shared-CF2CrQqB.js";
import { i as VLLM_PROVIDER_LABEL, n as VLLM_DEFAULT_BASE_URL, r as VLLM_MODEL_PLACEHOLDER, t as VLLM_DEFAULT_API_KEY_ENV_VAR } from "../../defaults-Cha6Xv-5.js";
import { t as resolveThinkingProfile } from "../../thinking-policy-DA5SFdfR.js";
import { n as wrapVllmProviderStream } from "../../stream-SyLxSRND.js";
import "../../api-CN50pZjN.js";
//#region extensions/vllm/index.ts
var vllm_default = defineSelfHostedOpenAICompatibleProvider({
	id: "vllm",
	label: VLLM_PROVIDER_LABEL,
	hint: "Local/self-hosted OpenAI-compatible server",
	groupHint: "Local/self-hosted OpenAI-compatible",
	defaultBaseUrl: VLLM_DEFAULT_BASE_URL,
	apiKeyEnvVar: VLLM_DEFAULT_API_KEY_ENV_VAR,
	modelPlaceholder: VLLM_MODEL_PLACEHOLDER,
	overrides: {
		buildUnknownModelHint: () => "vLLM requires authentication to be registered as a provider. Set VLLM_API_KEY (any value works) or run \"openclaw configure\". See: https://docs.openclaw.ai/providers/vllm",
		resolveThinkingProfile,
		wrapStreamFn: wrapVllmProviderStream
	}
});
//#endregion
export { vllm_default as default };
