import { t as closeTrackedBrowserTabsForSessions$1 } from "../../session-tab-registry-XdV_Wu2D.js";
import { t as movePathToTrash } from "../../trash-Xk5ha1PQ.js";
//#region extensions/browser/browser-maintenance.d.ts
type CloseTrackedBrowserTabsParams = Parameters<typeof closeTrackedBrowserTabsForSessions$1>[0];
/** Route lifecycle cleanup through the currently running Browser runtime when available. */
declare function closeTrackedBrowserTabsForSessions(params: CloseTrackedBrowserTabsParams): Promise<number>;
//#endregion
export { closeTrackedBrowserTabsForSessions, movePathToTrash };