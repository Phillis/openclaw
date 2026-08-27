import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
//#region src/agents/harness/auto-selection.ts
/** Returns a prepared negative auto-selection fact, or undefined when full support needs probing. */
function resolveAgentHarnessAutoSelectionHint(params) {
	const providerIds = params.harness.autoSelection?.providerIds;
	if (providerIds === void 0) return;
	const provider = normalizeProviderId(params.provider);
	if (providerIds.some((id) => normalizeProviderId(id) === provider)) return;
	return {
		supported: false,
		reason: providerIds.length === 0 ? "harness is explicit-only" : "provider is not auto-selectable"
	};
}
//#endregion
export { resolveAgentHarnessAutoSelectionHint as t };
