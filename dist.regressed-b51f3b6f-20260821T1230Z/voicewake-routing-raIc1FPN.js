import { t as loadVoiceWakeRoutingConfig } from "./voicewake-routing-Dz70NBC0.js";
//#region src/gateway/server-methods/voicewake-routing.ts
/** Gateway request handlers for reading voice wake routing. */
const voicewakeRoutingHandlers = { "voicewake.routing.get": async ({ respond }) => {
	respond(true, { config: await loadVoiceWakeRoutingConfig() });
} };
//#endregion
export { voicewakeRoutingHandlers };
