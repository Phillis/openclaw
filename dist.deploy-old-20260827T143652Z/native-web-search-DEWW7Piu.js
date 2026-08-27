import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { u as createPayloadPatchStreamWrapper } from "./provider-stream-shared-1C_TI60c.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import { d as normalizeProviderId } from "./provider-model-shared-CNe85HhA.js";
import { a as isOpenAIApiBaseUrl } from "./base-url-DivcnZZH.js";
//#region extensions/openai/native-web-search.ts
const OPENAI_WEB_SEARCH_TOOL = { type: "web_search" };
function isOpenAINativeWebSearchEligibleModel(model) {
	const provider = typeof model.provider === "string" ? model.provider : void 0;
	if (model.api !== "openai-responses" || !provider || normalizeProviderId(provider) !== "openai") return false;
	const baseUrl = typeof model.baseUrl === "string" ? model.baseUrl : void 0;
	return !baseUrl || isOpenAIApiBaseUrl(baseUrl);
}
function shouldUseOpenAINativeWebSearchProvider(config) {
	const provider = config?.tools?.web?.search?.provider;
	if (typeof provider !== "string") return true;
	const normalized = provider.trim().toLowerCase();
	return normalized === "" || normalized === "auto" || normalized === "openai";
}
function shouldEnableOpenAINativeWebSearch(params) {
	return params.config?.tools?.web?.search?.enabled !== false && shouldUseOpenAINativeWebSearchProvider(params.config) && isOpenAINativeWebSearchEligibleModel(params.model);
}
function isNativeWebSearchTool(tool) {
	return isRecord(tool) && tool.type === OPENAI_WEB_SEARCH_TOOL.type;
}
function isManagedWebSearchTool(tool) {
	return isRecord(tool) && tool.type === "function" && tool.name === OPENAI_WEB_SEARCH_TOOL.type;
}
function raiseMinimalReasoningForOpenAINativeWebSearch(payload) {
	const reasoning = payload.reasoning;
	if (!isRecord(reasoning) || reasoning.effort !== "minimal") return;
	reasoning.effort = "low";
}
function patchOpenAINativeWebSearchPayload(payload) {
	if (!isRecord(payload)) return "payload_not_object";
	const existingTools = Array.isArray(payload.tools) ? payload.tools : [];
	const filteredTools = existingTools.filter((tool) => !isManagedWebSearchTool(tool));
	if (filteredTools.some(isNativeWebSearchTool)) {
		if (filteredTools.length !== existingTools.length) payload.tools = filteredTools;
		raiseMinimalReasoningForOpenAINativeWebSearch(payload);
		return "native_tool_already_present";
	}
	payload.tools = [...filteredTools, OPENAI_WEB_SEARCH_TOOL];
	raiseMinimalReasoningForOpenAINativeWebSearch(payload);
	return "injected";
}
function createOpenAINativeWebSearchWrapper(baseStreamFn, params) {
	return createPayloadPatchStreamWrapper(baseStreamFn, ({ payload, options }) => {
		options?.openclawCodeModeAllowedHostedToolTypes?.add(OPENAI_WEB_SEARCH_TOOL.type);
		patchOpenAINativeWebSearchPayload(payload);
	}, { shouldPatch: ({ model }) => params.nativeWebSearchAllowedByToolPolicy !== false && shouldEnableOpenAINativeWebSearch({
		config: params.config,
		model
	}) });
}
//#endregion
export { createOpenAINativeWebSearchWrapper as t };
