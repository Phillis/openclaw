import { a as resolveXaiOAuthAutoModelId, i as normalizeXaiModelId, n as isXaiFrontierModelId, r as isXaiGrok46ModelId } from "./model-id-BJsQwvwb.js";
import { u as resolveXaiCatalogEntry } from "./model-definitions-LKzPOBHs.js";
import { t as isXaiProviderId } from "./provider-id-DPtgGuju.js";
//#region extensions/xai/provider-policy-api.ts
function resolveThinkingProfile(ctx) {
	const modelId = normalizeXaiModelId(resolveXaiOAuthAutoModelId(ctx.modelId, ctx.params).trim().toLowerCase());
	const reasoning = ctx.reasoning ?? resolveXaiCatalogEntry(modelId)?.reasoning;
	if (!isXaiProviderId(ctx.provider) || !reasoning) return {
		levels: [{ id: "off" }],
		defaultLevel: "off"
	};
	if (isXaiFrontierModelId(modelId)) return {
		levels: isXaiGrok46ModelId(modelId) ? [
			{ id: "low" },
			{ id: "medium" },
			{ id: "high" },
			{ id: "xhigh" }
		] : [
			{ id: "low" },
			{ id: "medium" },
			{ id: "high" }
		],
		defaultLevel: "high"
	};
	if (!(modelId === "grok-latest" || modelId === "grok-4.3" || modelId.startsWith("grok-4.3-"))) return {
		levels: [{ id: "off" }],
		defaultLevel: "off"
	};
	return {
		levels: [
			{ id: "off" },
			{ id: "minimal" },
			{ id: "low" },
			{ id: "medium" },
			{ id: "high" }
		],
		defaultLevel: "low"
	};
}
//#endregion
export { resolveThinkingProfile as t };
