import { o as TOKENPLAN_PROVIDER_ID, r as TOKENHUB_PROVIDER_ID } from "./models-B2pfwcxZ.js";
import { createPayloadPatchStreamWrapper } from "openclaw/plugin-sdk/provider-stream-shared";
//#region extensions/tencent/stream.ts
const TENCENT_PROVIDER_IDS = /* @__PURE__ */ new Set([TOKENHUB_PROVIDER_ID, TOKENPLAN_PROVIDER_ID]);
const TENCENT_REASONING_EFFORT_MAP = Object.freeze({
	off: "none",
	none: "none",
	minimal: "high",
	low: "high",
	medium: "high",
	high: "high",
	xhigh: "high"
});
const TOKENHUB_HY3_PREVIEW_REASONING_EFFORTS = /* @__PURE__ */ new Set([
	"none",
	"low",
	"high"
]);
function resolveRequestedEffort(thinkingLevel, options) {
	const withEffort = options ?? {};
	const raw = typeof withEffort.reasoningEffort === "string" && withEffort.reasoningEffort || typeof withEffort.reasoning === "string" && withEffort.reasoning || typeof thinkingLevel === "string" && thinkingLevel || void 0;
	return raw ? raw.trim().toLowerCase() : void 0;
}
function mapEffortForTencent(model, effort) {
	if (!effort) return;
	if (model.provider === "tencent-tokenhub" && model.id === "hy3-preview") {
		if (effort === "off") return "none";
		return TOKENHUB_HY3_PREVIEW_REASONING_EFFORTS.has(effort) ? effort : void 0;
	}
	return TENCENT_REASONING_EFFORT_MAP[effort];
}
function isTencentCompletionsCall(model) {
	const provider = model.provider;
	const api = model.api;
	return typeof provider === "string" && TENCENT_PROVIDER_IDS.has(provider) && api === "openai-completions";
}
function wrapTencentProviderStream(ctx) {
	return createPayloadPatchStreamWrapper(ctx.streamFn, ({ payload, model, options }) => {
		const mapped = mapEffortForTencent(model, resolveRequestedEffort(ctx.thinkingLevel, options));
		if (mapped === void 0) return;
		if (mapped === "none" || mapped === "off") {
			payload.reasoning_effort = "none";
			return;
		}
		payload.reasoning_effort = mapped;
	}, { shouldPatch: ({ model }) => isTencentCompletionsCall(model) });
}
//#endregion
export { wrapTencentProviderStream };
