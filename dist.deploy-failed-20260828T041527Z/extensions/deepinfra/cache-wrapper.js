import { applyAnthropicEphemeralCacheControlMarkers, createPayloadPatchStreamWrapper } from "openclaw/plugin-sdk/provider-stream-shared";
//#region extensions/deepinfra/cache-wrapper.ts
function createDeepInfraAnthropicCacheWrapper(baseStreamFn) {
	return createPayloadPatchStreamWrapper(baseStreamFn, ({ payload }) => {
		applyAnthropicEphemeralCacheControlMarkers(payload);
	}, { shouldPatch: ({ model }) => model.id.toLowerCase().startsWith("anthropic/") });
}
//#endregion
export { createDeepInfraAnthropicCacheWrapper };
