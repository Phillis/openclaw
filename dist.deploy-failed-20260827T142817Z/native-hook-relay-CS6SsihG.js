import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
import { n as invokeNativeHookRelay } from "./native-hook-relay-Cd68IilN.js";
//#region src/gateway/server-methods/native-hook-relay.ts
/** Gateway request handlers for invoking registered native hook relays. */
const nativeHookRelayHandlers = { "nativeHook.invoke": async ({ params, respond }) => {
	try {
		respond(true, await invokeNativeHookRelay({
			provider: params.provider,
			relayId: params.relayId,
			generation: params.generation,
			event: params.event,
			rawPayload: params.rawPayload,
			requireGeneration: true
		}));
	} catch (error) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error instanceof Error ? error.message : "native hook relay failed"));
	}
} };
//#endregion
export { nativeHookRelayHandlers };
