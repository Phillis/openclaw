import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-DmtKty-F.js";
import { d as openOpenClawStateDatabase } from "./openclaw-state-db-DlCMR4eQ.js";
//#region src/infra/voicewake-routing.ts
const VOICEWAKE_ROUTING_CONFIG_KEY = "default";
const DEFAULT_ROUTING = {
	version: 1,
	defaultTarget: { mode: "current" },
	routes: [],
	updatedAtMs: 0
};
function openStateDatabase(stateDir) {
	return openOpenClawStateDatabase({ env: stateDir ? {
		...process.env,
		OPENCLAW_STATE_DIR: stateDir
	} : process.env });
}
/** Normalize a voice wake trigger phrase for matching and duplicate checks. */
function normalizeVoiceWakeTriggerWord(value) {
	return value.toLowerCase().split(/\s+/).map((token) => token.replace(/^[\p{P}\p{S}]+|[\p{P}\p{S}]+$/gu, "")).filter(Boolean).join(" ");
}
function normalizeRouteTarget(value) {
	if (!value || typeof value !== "object") return null;
	const rec = value;
	if (normalizeOptionalString(rec.mode) === "current") return { mode: "current" };
	const agentId = normalizeOptionalString(rec.agentId);
	const sessionKey = normalizeOptionalString(rec.sessionKey);
	if (agentId && !sessionKey) return { agentId: normalizeAgentId(agentId) };
	if (sessionKey && !agentId) return { sessionKey };
	return null;
}
function normalizeRouteRule(value) {
	if (!value || typeof value !== "object") return null;
	const rec = value;
	const triggerRaw = normalizeOptionalString(rec.trigger);
	if (!triggerRaw) return null;
	const trigger = normalizeVoiceWakeTriggerWord(triggerRaw);
	if (!trigger) return null;
	const target = normalizeRouteTarget(rec.target);
	if (!target) return null;
	return {
		trigger,
		target
	};
}
/** Normalize persisted or user-provided voice wake routing config. */
function normalizeVoiceWakeRoutingConfig(input) {
	if (!input || typeof input !== "object") return { ...DEFAULT_ROUTING };
	const rec = input;
	return {
		version: 1,
		defaultTarget: normalizeRouteTarget(rec.defaultTarget) ?? { mode: "current" },
		routes: Array.isArray(rec.routes) ? rec.routes.map((entry) => normalizeRouteRule(entry)).filter((entry) => Boolean(entry)) : [],
		updatedAtMs: typeof rec.updatedAtMs === "number" && Number.isFinite(rec.updatedAtMs) && rec.updatedAtMs > 0 ? Math.floor(rec.updatedAtMs) : 0
	};
}
function targetFromColumns(params) {
	if (params.mode === "agent" && params.agentId) return { agentId: params.agentId };
	if (params.mode === "session" && params.sessionKey) return { sessionKey: params.sessionKey };
	return { mode: "current" };
}
/** Load persisted voice wake routing config from state. */
async function loadVoiceWakeRoutingConfig(baseDir) {
	const database = openStateDatabase(baseDir);
	const routingDb = getNodeSqliteKysely(database.db);
	const configRow = executeSqliteQueryTakeFirstSync(database.db, routingDb.selectFrom("voicewake_routing_config").selectAll().where("config_key", "=", VOICEWAKE_ROUTING_CONFIG_KEY));
	if (!configRow) return { ...DEFAULT_ROUTING };
	const routeRows = executeSqliteQuerySync(database.db, routingDb.selectFrom("voicewake_routing_routes").selectAll().where("config_key", "=", VOICEWAKE_ROUTING_CONFIG_KEY).orderBy("position", "asc")).rows;
	return {
		version: 1,
		defaultTarget: targetFromColumns({
			agentId: configRow.default_target_agent_id,
			mode: configRow.default_target_mode,
			sessionKey: configRow.default_target_session_key
		}),
		routes: routeRows.map((row) => ({
			trigger: row.trigger,
			target: targetFromColumns({
				agentId: row.target_agent_id,
				mode: row.target_mode,
				sessionKey: row.target_session_key
			})
		})),
		updatedAtMs: configRow.updated_at_ms
	};
}
function resolveVoiceWakeRouteTarget(routeTarget) {
	if (!routeTarget || "mode" in routeTarget && routeTarget.mode === "current") return { mode: "current" };
	if ("agentId" in routeTarget && routeTarget.agentId) return { agentId: routeTarget.agentId };
	if ("sessionKey" in routeTarget && routeTarget.sessionKey) return { sessionKey: routeTarget.sessionKey };
	return { mode: "current" };
}
/** Resolve the route target for a normalized wake trigger. */
function resolveVoiceWakeRouteByTrigger(params) {
	const normalizedTrigger = normalizeOptionalString(params.trigger) ? normalizeVoiceWakeTriggerWord(params.trigger) : "";
	if (normalizedTrigger) {
		const matched = params.config.routes.find((route) => route.trigger === normalizedTrigger);
		if (matched) return resolveVoiceWakeRouteTarget(matched.target);
	}
	return resolveVoiceWakeRouteTarget(params.config.defaultTarget);
}
//#endregion
export { normalizeVoiceWakeRoutingConfig as n, resolveVoiceWakeRouteByTrigger as r, loadVoiceWakeRoutingConfig as t };
