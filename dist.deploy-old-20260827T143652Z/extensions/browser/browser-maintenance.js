import { t as movePathToTrash } from "../../trash-DbUVw_yo.js";
import { t as closeTrackedBrowserTabsForSessions$1 } from "../../session-tab-registry-4FaeH-h4.js";
//#region extensions/browser/browser-maintenance.ts
/**
* Browser maintenance API barrel. It exposes tab cleanup and trash helpers for
* runtime and doctor flows.
*/
/** Route lifecycle cleanup through the currently running Browser runtime when available. */
async function closeTrackedBrowserTabsForSessions(params) {
	const { getBrowserControlState } = await import("../../browser-control-state-Dt7rgaWX.js");
	return await closeTrackedBrowserTabsForSessions$1({
		...params,
		getResolvedBrowserConfig: () => getBrowserControlState()?.resolved ?? null
	});
}
//#endregion
export { closeTrackedBrowserTabsForSessions, movePathToTrash };
