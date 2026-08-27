import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { r as resolveAgentMainSessionKey } from "./main-session-er-Gn_t_.js";
import { n as resolveSessionStoreAgentId, r as resolveSessionStoreKey } from "./session-store-key-CoZdm5gl.js";
import { n as listConfiguredSessionStoreAgentIds } from "./targets-BzJLDErS.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
import "./sessions-B_ifzq5W.js";
import { n as resolveWorkerPlacementExecutionMode, r as resolveWorkerPlacementSessionRuntime } from "./placement-session-runtime-Bg1IJ7s4.js";
import { M as resolveGatewaySessionStoreTarget, N as resolveGatewaySessionStoreTargetWithStore, k as resolveCanonicalSessionEntryFromStoreKeys } from "./session-utils-row-CriEgq90.js";
import "./session-utils-rhyq5EVD.js";
import { t as resolvePluginSessionOwnershipError } from "./session-plugin-ownership-DIFuSi8s.js";
import { n as isWorkerPlacementSafeForArchive } from "./session-placement-lifecycle-BZjFQ_8W.js";
//#region src/gateway/server-methods/sessions-shared.ts
const sessionLog = createSubsystemLogger("gateway/sessions");
function respondSessionWorkerPlacementMutationError(error, respond) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message));
}
function resolveSessionWorkerPlacementPatchError(params) {
	const placement = params.entry?.sessionId ? params.context.workerSessionPlacementService?.getMany([params.entry.sessionId]).get(params.entry.sessionId) : void 0;
	if (!placement || placement.state === "local") return;
	if (params.patch.archived === false) {
		if (!isWorkerPlacementSafeForArchive(params.context, placement)) return `Session ${params.key} cannot change archive state while cloud worker placement is ${placement.state}.`;
	}
	if (!params.validateModelRuntime || params.patch.model === void 0 || !params.entry) return;
	const runtime = resolveWorkerPlacementSessionRuntime({
		cfg: params.cfg,
		entry: params.entry,
		agentId: params.agentId,
		sessionKey: params.sessionKey
	});
	const executionMode = resolveWorkerPlacementExecutionMode(runtime);
	if (executionMode === placement.executionMode) return;
	return executionMode ? `Session ${params.key} cannot change cloud placement execution mode while placement is ${placement.state}.` : `Session ${params.key} cannot select the ${runtime} runtime while cloud worker placement is ${placement.state}.`;
}
function filterSessionStoreToConfiguredAgents(cfg, store) {
	const configuredAgentIds = new Set(listConfiguredSessionStoreAgentIds(cfg));
	const isConfiguredSessionKey = (key) => {
		const normalizedKey = normalizeOptionalString(key);
		if (!normalizedKey) return false;
		const agentId = resolveSessionStoreAgentId(cfg, resolveSessionStoreKey({
			cfg,
			sessionKey: normalizedKey
		}));
		return configuredAgentIds.has(normalizeAgentId(agentId));
	};
	return Object.fromEntries(Object.entries(store).filter(([key, entry]) => {
		if (key === "global" || key === "unknown") return true;
		if (isConfiguredSessionKey(key)) return true;
		return isConfiguredSessionKey(entry?.spawnedBy) || isConfiguredSessionKey(entry?.parentSessionKey);
	}));
}
const loadSessionsRuntimeModule = createLazyRuntimeModule(() => import("./sessions.runtime.js"));
function requireSessionKey(key, respond) {
	const normalized = normalizeOptionalString(typeof key === "string" ? key : typeof key === "number" ? String(key) : typeof key === "bigint" ? String(key) : "") ?? "";
	if (!normalized) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "key required"));
		return null;
	}
	return normalized;
}
function rejectPluginRuntimeSessionOwnershipMismatch(params) {
	const error = resolvePluginSessionOwnershipError({
		action: params.action,
		entry: params.entry,
		key: params.key,
		pluginOwnerId: params.client?.internal?.pluginRuntimeOwnerId
	});
	if (!error) return false;
	params.respond(false, void 0, error);
	return true;
}
function resolveGatewaySessionTargetFromKey(key, cfg, opts) {
	const target = resolveGatewaySessionStoreTarget({
		cfg,
		key,
		...opts?.agentId ? { agentId: opts.agentId } : {}
	});
	return {
		cfg,
		target,
		storePath: target.storePath
	};
}
function loadAccessorSessionEntryForGatewayTarget(params) {
	const target = resolveGatewaySessionStoreTargetWithStore({
		cfg: params.cfg,
		key: params.key,
		clone: false,
		...params.agentId ? { agentId: params.agentId } : {}
	});
	let best;
	for (const sessionStoreKey of target.storeKeys) {
		const entry = target.store[sessionStoreKey];
		if (entry) {
			if (!best || (entry.updatedAt ?? 0) > (best.entry.updatedAt ?? 0)) best = {
				entry,
				sessionStoreKey
			};
		}
	}
	if (best) return {
		target,
		storePath: target.storePath,
		entry: best.entry,
		canonicalKey: target.canonicalKey,
		sessionStoreKey: best.sessionStoreKey
	};
	return {
		target,
		storePath: target.storePath,
		entry: void 0,
		canonicalKey: target.canonicalKey,
		sessionStoreKey: target.canonicalKey
	};
}
function loadSessionEntriesForTarget(params) {
	const target = resolveGatewaySessionStoreTargetWithStore({
		cfg: params.cfg,
		key: params.key,
		clone: false,
		...params.agentId ? { agentId: params.agentId } : {}
	});
	const store = target.store;
	const entry = resolveCanonicalSessionEntryFromStoreKeys(store, target.storeKeys);
	return {
		target,
		storePath: target.storePath,
		store,
		entry
	};
}
function emitSessionOperation(context, payload) {
	const connIds = context.getSessionEventSubscriberConnIds();
	if (connIds.size === 0) return;
	context.broadcastToConnIds("session.operation", {
		...payload,
		ts: Date.now()
	}, connIds, { dropIfSlow: true });
}
function isWorkerDispatchInputError(error) {
	if (typeof error !== "object" || error === null || !("code" in error)) return false;
	const code = error.code;
	return code === "invalid_profile" || code === "profile_not_found" || code === "invalid_state";
}
function isAgentMainSessionKey(cfg, sessionKey) {
	const parsed = parseAgentSessionKey(sessionKey);
	if (!parsed) return false;
	return sessionKey === resolveAgentMainSessionKey({
		cfg,
		agentId: parsed.agentId
	});
}
//#endregion
export { loadAccessorSessionEntryForGatewayTarget as a, rejectPluginRuntimeSessionOwnershipMismatch as c, resolveSessionWorkerPlacementPatchError as d, respondSessionWorkerPlacementMutationError as f, isWorkerDispatchInputError as i, requireSessionKey as l, filterSessionStoreToConfiguredAgents as n, loadSessionEntriesForTarget as o, sessionLog as p, isAgentMainSessionKey as r, loadSessionsRuntimeModule as s, emitSessionOperation as t, resolveGatewaySessionTargetFromKey as u };
