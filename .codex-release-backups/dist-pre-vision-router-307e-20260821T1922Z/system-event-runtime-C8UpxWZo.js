import { o as withSystemEventOwner } from "./system-event-ownership-BACexIXt.js";
import { a as enqueueSystemEvent } from "./system-events-kSFsVzdG.js";
import "./main-session.runtime.js";
//#region src/plugin-sdk/system-event-runtime.ts
function enqueueRoutedSystemEvent(text, route, options = {}) {
	if (!route.agentId.trim()) throw new Error("routed system events require route.agentId");
	return enqueueSystemEvent(text, withSystemEventOwner({
		...options,
		sessionKey: route.sessionKey
	}, route.agentId));
}
//#endregion
export { enqueueRoutedSystemEvent as t };
