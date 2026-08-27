import "./src-BkwWvwB2.js";
import { t as safeParseJson } from "./json-coercion-ighRFv8Y.js";
import { t as createSubsystemLogger } from "./subsystem-DNgaGOch.js";
import { _ as getNodeSqliteKysely, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-gKE3myqW.js";
import { Lt as normalizeSqliteNumber, d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BciZ4rHE.js";
//#region src/sessions/session-upstream-links.ts
const log = createSubsystemLogger("sessions/upstream-links");
function getSessionUpstreamKysely(db) {
	return getNodeSqliteKysely(db);
}
function parseJson(value) {
	if (value === null) return null;
	return safeParseJson(value) ?? null;
}
function rowToSessionUpstreamLink(row) {
	return {
		sessionKey: row.session_key,
		agentId: row.agent_id,
		catalogId: row.catalog_id,
		hostId: row.host_id,
		threadId: row.thread_id,
		upstreamKind: row.upstream_kind,
		upstreamRef: parseJson(row.upstream_ref_json),
		marker: parseJson(row.last_marker_json),
		...row.last_scanned_at === null ? {} : { lastScannedAt: normalizeSqliteNumber(row.last_scanned_at) ?? 0 },
		createdAt: normalizeSqliteNumber(row.created_at) ?? 0,
		updatedAt: normalizeSqliteNumber(row.updated_at) ?? 0
	};
}
function upsertSessionUpstreamLink(input, options = {}) {
	const now = options.now ?? Date.now();
	try {
		runOpenClawStateWriteTransaction(({ db }) => {
			executeSqliteQuerySync(db, getSessionUpstreamKysely(db).insertInto("session_upstream_links").values({
				session_key: input.sessionKey,
				agent_id: input.agentId,
				catalog_id: input.catalogId,
				host_id: input.hostId,
				thread_id: input.threadId,
				upstream_kind: input.upstreamKind,
				upstream_ref_json: JSON.stringify(input.upstreamRef),
				last_marker_json: JSON.stringify(input.marker),
				last_scanned_at: null,
				created_at: now,
				updated_at: now
			}).onConflict((conflict) => conflict.columns(["session_key", "agent_id"]).doUpdateSet((eb) => {
				const sourceChanged = eb.or([
					eb("session_upstream_links.thread_id", "!=", eb.ref("excluded.thread_id")),
					eb("session_upstream_links.host_id", "!=", eb.ref("excluded.host_id")),
					eb("session_upstream_links.upstream_kind", "!=", eb.ref("excluded.upstream_kind")),
					eb("session_upstream_links.upstream_ref_json", "!=", eb.ref("excluded.upstream_ref_json"))
				]);
				return {
					agent_id: input.agentId,
					catalog_id: input.catalogId,
					host_id: input.hostId,
					thread_id: input.threadId,
					upstream_kind: input.upstreamKind,
					upstream_ref_json: JSON.stringify(input.upstreamRef),
					last_marker_json: eb.case().when(sourceChanged).then(JSON.stringify(input.marker)).else(eb.ref("session_upstream_links.last_marker_json")).end(),
					last_scanned_at: eb.case().when(sourceChanged).then(null).else(eb.ref("session_upstream_links.last_scanned_at")).end(),
					updated_at: now
				};
			})));
		}, options);
		return true;
	} catch (error) {
		log.warn(`failed to upsert session upstream link: ${String(error)}`);
		return false;
	}
}
function readSessionUpstreamLink(sessionKey, agentId, options = {}) {
	try {
		const { db } = openOpenClawStateDatabase(options);
		const row = executeSqliteQuerySync(db, getSessionUpstreamKysely(db).selectFrom("session_upstream_links").selectAll().where("session_key", "=", sessionKey).where("agent_id", "=", agentId)).rows[0];
		return row ? rowToSessionUpstreamLink(row) : void 0;
	} catch (error) {
		log.warn(`failed to read session upstream link: ${String(error)}`);
		return;
	}
}
function updateSessionUpstreamLinkMarker(sessionKey, agentId, marker, options = {}) {
	const now = options.now ?? Date.now();
	try {
		let updated = false;
		runOpenClawStateWriteTransaction(({ db }) => {
			let query = getSessionUpstreamKysely(db).updateTable("session_upstream_links").set({
				last_marker_json: JSON.stringify(marker),
				last_scanned_at: now,
				updated_at: now
			}).where("session_key", "=", sessionKey).where("agent_id", "=", agentId);
			if (options.expectedUpdatedAt !== void 0) query = query.where("updated_at", "=", options.expectedUpdatedAt);
			updated = executeSqliteQuerySync(db, query).numAffectedRows === 1n;
		}, options);
		return updated;
	} catch (error) {
		log.warn(`failed to update session upstream marker: ${String(error)}`);
		return false;
	}
}
function deleteSessionUpstreamLink(sessionKey, agentId, options = {}) {
	try {
		runOpenClawStateWriteTransaction(({ db }) => {
			executeSqliteQuerySync(db, getSessionUpstreamKysely(db).deleteFrom("session_upstream_links").where("session_key", "=", sessionKey).where("agent_id", "=", agentId));
		}, options);
	} catch (error) {
		log.warn(`failed to delete session upstream link: ${String(error)}`);
	}
}
function listWatchedSessionUpstreamLinks(options = {}) {
	const grouped = /* @__PURE__ */ new Map();
	try {
		const { db } = openOpenClawStateDatabase(options);
		const links = executeSqliteQuerySync(db, getSessionUpstreamKysely(db).selectFrom("session_upstream_links as links").innerJoin("session_watch_cursors as cursors", "cursors.target_session_key", "links.session_key").selectAll("links").distinct().orderBy("links.catalog_id", "asc").orderBy("links.session_key", "asc")).rows.map(rowToSessionUpstreamLink);
		const keyCounts = /* @__PURE__ */ new Map();
		for (const link of links) keyCounts.set(link.sessionKey, (keyCounts.get(link.sessionKey) ?? 0) + 1);
		for (const link of links) {
			if ((keyCounts.get(link.sessionKey) ?? 0) > 1) {
				log.warn(`skipping ambiguous upstream links for ${link.sessionKey}: multiple agents adopt the same key`);
				continue;
			}
			const catalogLinks = grouped.get(link.catalogId) ?? [];
			catalogLinks.push(link);
			grouped.set(link.catalogId, catalogLinks);
		}
	} catch (error) {
		log.warn(`failed to list watched session upstream links: ${String(error)}`);
	}
	return grouped;
}
//#endregion
export { upsertSessionUpstreamLink as a, updateSessionUpstreamLinkMarker as i, listWatchedSessionUpstreamLinks as n, readSessionUpstreamLink as r, deleteSessionUpstreamLink as t };
