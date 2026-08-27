import { a as enqueueSystemEvent, h as withSystemEventOwner } from "./system-events-B0eLVp5j.js";
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
