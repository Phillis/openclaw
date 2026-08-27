import { d as projectMediaFacts } from "./media-facts-CdKKNGmE.js";
import "./local-roots-Beya70q2.js";
//#region src/plugin-sdk/agent-media-payload.ts
/**
* @deprecated Pass ordered facts as `MsgContext.media`; use
* `toInboundMediaFacts` from `openclaw/plugin-sdk/channel-inbound`.
*/
function buildAgentMediaPayload(mediaList) {
	return projectMediaFacts(mediaList, "compact");
}
//#endregion
export { buildAgentMediaPayload as t };
