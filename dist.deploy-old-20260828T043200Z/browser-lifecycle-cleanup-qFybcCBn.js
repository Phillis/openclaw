import { t as runBestEffortCleanup } from "./non-fatal-cleanup-Dsr9pn7u.js";
import { t as closeTrackedBrowserTabsForSessions } from "./browser-maintenance-Cc_NRFbV.js";
//#region src/browser-lifecycle-cleanup.ts
function normalizeSessionKeys(sessionKeys) {
	const keys = /* @__PURE__ */ new Set();
	for (const sessionKey of sessionKeys) {
		const normalized = sessionKey.trim();
		if (normalized) keys.add(normalized);
	}
	return [...keys];
}
function isBrowserCleanupDisabled(cfg) {
	return cfg?.browser?.enabled === false || cfg?.plugins?.entries?.browser?.enabled === false;
}
async function cleanupBrowserSessionsForLifecycleEnd(params) {
	if (isBrowserCleanupDisabled(params.cfg)) return;
	const sessionKeys = normalizeSessionKeys(params.sessionKeys);
	if (sessionKeys.length === 0) return;
	await runBestEffortCleanup({
		cleanup: async () => {
			await closeTrackedBrowserTabsForSessions({
				sessionKeys,
				onWarn: params.onWarn
			});
		},
		onError: params.onError
	});
}
//#endregion
export { cleanupBrowserSessionsForLifecycleEnd as t };
