import { n as loadCombinedSessionStoreForGatewayCore } from "./combined-store-gateway-DCSDDfZL.js";
import { n as resolveSessionIdMatchSelection } from "./session-id-resolution-Di-LWuJc.js";
import { f as resolveGatewaySessionStoreTargetWithStore, s as resolveCanonicalSessionEntryFromStoreKeys } from "./session-utils-store-DtQnSTMm.js";
import "./session-utils-BTR52tOf.js";
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
