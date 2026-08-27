import { c as parseAgentSessionKey } from "./session-key-utils-Di3FvABa.js";
import "./operator-scopes-Dw7Gu2cA.js";
import { r as authorizeOperatorScopesForRequiredScope } from "./method-scopes-BQC2sTma.js";
import { c as resolveCanonicalSessionStoreMatchFromStoreKeys, f as resolveGatewaySessionStoreTargetWithStore } from "./session-utils-store-Dmx2MxPy.js";
import { f as isGatewayClientProfilePending } from "./operator-role-policy-il7s4lXY.js";
import { d as isGatewayAdmin, u as createSessionListEntryFilter } from "./session-sharing-DSLYm21V.js";
//#region src/gateway/presence-projection.ts
/** One synchronous snapshot/fanout owns these reads; never reuse them across broadcasts. */
function createPresenceRecipientProjection(params) {
	const targets = /* @__PURE__ */ new Map();
	const targetDiscoveryCache = /* @__PURE__ */ new Map();
	const resolveTarget = (sessionKey) => {
		if (!targets.has(sessionKey)) {
			const parsed = parseAgentSessionKey(sessionKey);
			const key = parsed?.rest === "global" || parsed?.rest === "unknown" ? parsed.rest : sessionKey;
			const target = resolveGatewaySessionStoreTargetWithStore({
				cfg: params.cfg,
				key,
				agentId: parsed?.agentId,
				readOnly: true,
				exactRead: true,
				clone: false,
				targetDiscoveryCache
			});
			const match = resolveCanonicalSessionStoreMatchFromStoreKeys(target.store, target.storeKeys);
			targets.set(sessionKey, match ? {
				canonicalKey: target.canonicalKey,
				entry: match.entry
			} : void 0);
		}
		return targets.get(sessionKey);
	};
	return (client) => {
		if (!client?.connect || (client.connect.role ?? "operator") !== "operator" || !authorizeOperatorScopesForRequiredScope("operator.read", client.connect.scopes ?? []).allowed) return [];
		const canReadSessions = isGatewayAdmin(client) || !isGatewayClientProfilePending(client);
		const entryFilter = canReadSessions ? createSessionListEntryFilter({
			cfg: params.cfg,
			client
		}) : void 0;
		return params.presence.map((row) => {
			if (!row.watchedSessions) return row;
			const watchedSessions = canReadSessions ? row.watchedSessions.filter((key) => {
				const target = resolveTarget(key);
				return target && (entryFilter?.(target.canonicalKey, target.entry) ?? true);
			}) : [];
			const { watchedSessions: _watchedSessions, ...person } = row;
			return watchedSessions.length ? {
				...person,
				watchedSessions
			} : person;
		});
	};
}
//#endregion
export { createPresenceRecipientProjection as t };
