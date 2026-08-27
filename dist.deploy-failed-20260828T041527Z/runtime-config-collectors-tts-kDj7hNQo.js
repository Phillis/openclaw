import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import "./shared-DSMB324f.js";
import { n as collectRuntimeSecretInputAssignment } from "./runtime-shared-BoNGt4zS.js";
//#region src/secrets/runtime-config-collectors-tts.ts
/** Collects text-to-speech secret refs from runtime config. */
function collectProviderApiKeyAssignment(params) {
	collectRuntimeSecretInputAssignment({
		value: params.providerConfig.apiKey,
		path: `${params.pathPrefix}.providers.${params.providerId}.apiKey`,
		expected: "string",
		defaults: params.defaults,
		context: params.context,
		active: params.active,
		inactiveReason: params.inactiveReason,
		owner: {
			ownerKind: "capability",
			ownerId: params.ownerId,
			requiredForGateway: false,
			disposition: "isolate",
			contract: params.contract
		},
		apply: (value) => {
			params.providerConfig.apiKey = value;
		}
	});
}
/** Collects provider API key SecretRefs from a TTS-compatible provider config block. */
function collectTtsApiKeyAssignments(params) {
	const providers = params.tts.providers;
	if (isRecord(providers)) for (const [providerId, providerConfig] of Object.entries(providers)) {
		if (!isRecord(providerConfig)) continue;
		collectProviderApiKeyAssignment({
			providerId,
			providerConfig,
			pathPrefix: params.pathPrefix,
			defaults: params.defaults,
			context: params.context,
			contract: params.tts,
			ownerId: typeof params.ownerId === "function" ? params.ownerId(providerId) : params.ownerId ?? "tts",
			active: params.active,
			inactiveReason: params.inactiveReason
		});
	}
}
//#endregion
export { collectTtsApiKeyAssignments as t };
