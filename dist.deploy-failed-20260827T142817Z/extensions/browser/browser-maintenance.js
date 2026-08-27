import { t as movePathToTrash } from "../../trash-Dl_zOrVI.js";
import { t as closeTrackedBrowserTabsForSessions$1 } from "../../session-tab-registry-CmX9wnld.js";
//#region extensions/browser/browser-maintenance.ts
/**
* Browser maintenance API barrel. It exposes tab cleanup and trash helpers for
* runtime and doctor flows.
*/
/** Route lifecycle cleanup through the currently running Browser runtime when available. */
async function closeTrackedBrowserTabsForSessions(params) {
	const { getBrowserControlState } = await import("../../browser-control-state-ByqYkZzP.js");
	return await closeTrackedBrowserTabsForSessions$1({
		...params,
		getResolvedBrowserConfig: () => getBrowserControlState()?.resolved ?? null
	});
}
//#endregion
export { closeTrackedBrowserTabsForSessions, movePathToTrash };
