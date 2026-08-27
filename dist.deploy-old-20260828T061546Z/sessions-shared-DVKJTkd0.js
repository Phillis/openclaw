import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as parseAgentSessionKey } from "./session-key-utils-Di3FvABa.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { r as resolveAgentMainSessionKey } from "./main-session-CPkeRwvL.js";
import { d as errorShape } from "./validation-errors-rELRlKfn.js";
import { i as resolveWorkerPlacementSessionRuntime, r as resolveWorkerPlacementExecutionMode } from "./placement-session-runtime-CugBJIqO.js";
import { d as resolveGatewaySessionStoreTarget, f as resolveGatewaySessionStoreTargetWithStore, s as resolveCanonicalSessionEntryFromStoreKeys } from "./session-utils-store-Dmx2MxPy.js";
import "./session-utils-uVsFjoXC.js";
import { i as resolveWorkerPlacementArchiveRestoreError } from "./session-placement-lifecycle-SteNC2br.js";
import { t as resolvePluginSessionOwnershipError } from "./session-plugin-ownership-Dk6fjq2Z.js";
//#region src/gateway/server-methods/sessions-shared.ts
const sessionLog = createSubsystemLogger("gateway/sessions");
function respondSessionWorkerPlacementMutationError(error, respond) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message));
}
function resolveSessionWorkerPlacementPatchError(params) {
	const placement = params.entry?.sessionId ? params.context.workerSessionPlacementService?.getMany([params.entry.sessionId]).get(params.entry.sessionId) : void 0;
	if (!placement || placement.state === "local") return;
	if (params.patch.archived === false) {
		const restoreError = resolveWorkerPlacementArchiveRestoreError({
			context: params.context,
			key: params.key,
			placement
		});
		if (restoreError) return restoreError;
	}
	if (!params.validateModelRuntime || params.patch.model === void 0 || !params.entry?.sessionId) return;
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
export { loadSessionEntriesForTarget as a, requireSessionKey as c, respondSessionWorkerPlacementMutationError as d, sessionLog as f, loadAccessorSessionEntryForGatewayTarget as i, resolveGatewaySessionTargetFromKey as l, isAgentMainSessionKey as n, loadSessionsRuntimeModule as o, isWorkerDispatchInputError as r, rejectPluginRuntimeSessionOwnershipMismatch as s, emitSessionOperation as t, resolveSessionWorkerPlacementPatchError as u };
