import { n as isXaiFrontierModelId, r as isXaiGrok46ModelId } from "./model-id-BJsQwvwb.js";
import { r as applyXaiModelCompat } from "./model-compat-CsK61pcr.js";
//#region extensions/xai/runtime-model-compat.ts
const XAI_UNSUPPORTED_REASONING_EFFORTS = {
	off: null,
	minimal: null,
	low: null,
	medium: null,
	high: null,
	xhigh: null
};
const XAI_REASONING_EFFORTS = {
	off: null,
	minimal: "low",
	low: "low",
	medium: "medium",
	high: "high",
	xhigh: "high"
};
const XAI_SUPPORTED_REASONING_EFFORTS = [
	"low",
	"medium",
	"high"
];
function isGrok43Model(id) {
	return id === "grok-latest" || id === "grok-4.3" || id.startsWith("grok-4.3-");
}
function normalizeXaiCompatModelId(id) {
	return typeof id === "string" ? id.trim().toLowerCase() : "";
}
function supportsConfigurableXaiReasoningEffort(model) {
	const id = normalizeXaiCompatModelId(model.id);
	const isConfigurableModel = isGrok43Model(id) || isXaiFrontierModelId(id);
	return model.reasoning === true && isConfigurableModel;
}
function resolveXaiReasoningEffortCompat(model) {
	if (supportsConfigurableXaiReasoningEffort(model)) {
		const id = normalizeXaiCompatModelId(model.id);
		return {
			supportsReasoningEffort: true,
			supportedReasoningEfforts: [
				...isGrok43Model(id) ? ["none"] : [],
				...XAI_SUPPORTED_REASONING_EFFORTS,
				...isXaiGrok46ModelId(id) ? ["xhigh"] : []
			]
		};
	}
	return { supportsReasoningEffort: false };
}
function applyXaiRuntimeModelCompat(model) {
	const withCompat = applyXaiModelCompat(model);
	const supportsReasoningEffort = supportsConfigurableXaiReasoningEffort(withCompat);
	const id = normalizeXaiCompatModelId(withCompat.id);
	const existingCompat = withCompat.compat && typeof withCompat.compat === "object" ? withCompat.compat : {};
	return {
		...withCompat,
		compat: {
			...existingCompat,
			...resolveXaiReasoningEffortCompat(withCompat)
		},
		thinkingLevelMap: {
			...withCompat.thinkingLevelMap,
			...supportsReasoningEffort ? XAI_REASONING_EFFORTS : XAI_UNSUPPORTED_REASONING_EFFORTS,
			...supportsReasoningEffort && isGrok43Model(id) ? { off: "none" } : {},
			...supportsReasoningEffort && isXaiGrok46ModelId(id) ? { xhigh: "xhigh" } : {}
		}
	};
}
//#endregion
export { applyXaiRuntimeModelCompat as t };
