import { n as normalizeMessageChannel } from "./message-channel-core-D5yZGaHY.js";
import "./message-channel-BZwx7FCw.js";
//#region src/auto-reply/reply/origin-routing.ts
/** Resolves the original message provider before reply redirection. */
function resolveOriginMessageProvider(params) {
	return normalizeMessageChannel(params.originatingChannel) ?? normalizeMessageChannel(params.provider);
}
//#endregion
export { resolveOriginMessageProvider as t };
