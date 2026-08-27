import { n as loadCombinedSessionStoreForGatewayCore } from "./combined-store-gateway-BoGkmc3E.js";
import { N as resolveGatewaySessionStoreTargetWithStore, k as resolveCanonicalSessionEntryFromStoreKeys } from "./session-utils-row-CB3Fore5.js";
import "./session-utils-DZT0oaJU.js";
import { n as resolveSessionIdMatchSelection } from "./session-id-resolution-9Zisrbl5.js";
//#region src/gateway/worker-environments/session-target.ts
function resolveWorkerSessionTarget(cfg, sessionId) {
	const { store } = loadCombinedSessionStoreForGatewayCore(cfg);
	const selection = resolveSessionIdMatchSelection(Object.entries(store).filter(([, entry]) => entry.sessionId === sessionId), sessionId);
	if (selection.kind !== "selected") return;
	const target = resolveGatewaySessionStoreTargetWithStore({
		cfg,
		key: selection.sessionKey,
		clone: false
	});
	const entry = resolveCanonicalSessionEntryFromStoreKeys(target.store, target.storeKeys);
	if (!entry || entry.sessionId !== sessionId) return;
	return {
		agentId: target.agentId,
		sessionEntry: entry,
		sessionId,
		sessionKey: target.canonicalKey,
		sessionStore: target.store,
		storePath: target.storePath
	};
}
//#endregion
export { resolveWorkerSessionTarget as t };
