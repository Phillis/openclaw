import { j as sanitizeGoogleThinkingPayload, u as createPayloadPatchStreamWrapper } from "./provider-stream-shared-8IapgNRS.js";
import { a as buildProviderReplayFamilyHooks } from "./provider-model-shared-Br4ZCuuk.js";
import { r as buildProviderToolCompatFamilyHooks } from "./provider-tools-mj-Qt8cY.js";
import { r as stripGoogleProviderPrefix } from "./model-id-CAmKILzd.js";
import { i as resolveGoogleThinkingProfile } from "./provider-policy-CNkNRM-f.js";
import "./thinking-api-C3mseVNk.js";
//#region extensions/google/provider-hooks.ts
function classifyGoogleFailoverCode(code) {
	switch (code?.trim().toUpperCase()) {
		case "UNAVAILABLE": return "overloaded";
		case "DEADLINE_EXCEEDED": return "timeout";
		case "INTERNAL": return "server_error";
		default: return;
	}
}
function wrapGoogleThinkingStream(ctx) {
	return createPayloadPatchStreamWrapper(ctx.streamFn, ({ payload, model }) => {
		if (model.api !== "google-generative-ai" && model.api !== "google-vertex") return;
		sanitizeGoogleThinkingPayload({
			payload,
			modelId: stripGoogleProviderPrefix(model.id).replace(/^models\//u, ""),
			thinkingLevel: ctx.thinkingLevel
		});
	});
}
const GOOGLE_GEMINI_PROVIDER_HOOKS = {
	...buildProviderReplayFamilyHooks({ family: "google-gemini" }),
	...buildProviderToolCompatFamilyHooks("gemini"),
	resolveThinkingProfile: (context) => resolveGoogleThinkingProfile(context),
	wrapStreamFn: wrapGoogleThinkingStream,
	classifyFailoverReason: ({ code }) => classifyGoogleFailoverCode(code)
};
//#endregion
export { GOOGLE_GEMINI_PROVIDER_HOOKS as t };
