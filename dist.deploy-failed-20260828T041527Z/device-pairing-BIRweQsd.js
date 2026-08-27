import "./src-BntaCZM-.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { p as normalizeUniqueSingleOrTrimmedStringList } from "./string-normalization-e_fvmxMf.js";
import { t as createAsyncLock } from "./async-lock-CaiUOILd.js";
import { w as resolveStateDir } from "./paths-BBSTUjD5.js";
import { n as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-KXgHmJVs.js";
import { n as normalizeDeviceAuthScopes } from "./device-auth-C-STNejO.js";
import { r as roleScopesAllow } from "./operator-scope-compat-C7_b0yme.js";
import { l as isProgressCardRendererClient } from "./message-channel-BZwx7FCw.js";
import { D as updatePairedDevicePresenceInTransaction, S as loadPairedDevicePairingStoreRecord, T as readDevicePairingStoreStateFromDatabase, m as revokeDeviceBootstrapTokensForDevice, w as persistDevicePairingStoreState, x as loadDevicePairingStoreState, y as pruneExpiredPending } from "./device-bootstrap-6c0qs5r-.js";
import { createHash, randomUUID } from "node:crypto";
//#region src/infra/device-pairing-store-readonly.ts
/** Load pairing state without creating or migrating the shared state database. */
function loadDevicePairingStoreStateReadOnly(baseDir) {
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => readDevicePairingStoreStateFromDatabase(db), baseDir ? { env: {
		...process.env,
		OPENCLAW_STATE_DIR: baseDir
	} } : {}) ?? {
		pendingById: {},
		pairedByDeviceId: {}
	};
}
//#endregion
//#region src/infra/device-pairing-state.ts
const PAIRING_PENDING_TTL_MS = 300 * 1e3;
const withLock = createAsyncLock();
function pruneExpiredPairingState(state) {
	const now = Date.now();
	pruneExpiredPending(state.pendingById, now, PAIRING_PENDING_TTL_MS);
	for (const device of Object.values(state.pairedByDeviceId)) if (device.pendingNodeSurface && now - device.pendingNodeSurface.ts > PAIRING_PENDING_TTL_MS) delete device.pendingNodeSurface;
}
/** Run one pairing mutation under the process-wide device pairing lock. */
async function withDevicePairingLock(operate) {
	return await withLock(operate);
}
/** Load one mutable pairing snapshot with expired pending state removed. */
async function loadDevicePairingState(baseDir) {
	const state = loadDevicePairingStoreState(baseDir);
	pruneExpiredPairingState(state);
	return state;
}
/** Load one read-only pairing snapshot with expired pending state removed. */
async function loadDevicePairingStateReadOnly(baseDir) {
	const state = loadDevicePairingStoreStateReadOnly(baseDir);
	pruneExpiredPairingState(state);
	return state;
}
/** Return whether one pending pairing timestamp is beyond the shared TTL. */
function isPairingRequestExpired(timestampMs, nowMs = Date.now()) {
	return nowMs - timestampMs > PAIRING_PENDING_TTL_MS;
}
/** Resolve the expiry timestamp for one pending pairing request. */
function resolvePairingRequestExpiry(timestampMs) {
	return timestampMs + PAIRING_PENDING_TTL_MS;
}
/** Normalize a device id at pairing state boundaries. */
function normalizeDevicePairingId(deviceId) {
	return deviceId.trim();
}
/** Normalize one requested or approved pairing role. */
function normalizeDevicePairingRole(role) {
	const trimmed = role?.trim();
	return trimmed ? trimmed : null;
}
/** Merge pairing roles while preserving first-seen order. */
function mergeDevicePairingRoles(...items) {
	const roles = /* @__PURE__ */ new Set();
	for (const item of items) for (const role of normalizeUniqueSingleOrTrimmedStringList(item)) roles.add(role);
	if (roles.size === 0) return;
	return [...roles];
}
/** Merge pairing scopes while preserving first-seen order and explicit emptiness. */
function mergeDevicePairingScopes(...items) {
	const scopes = /* @__PURE__ */ new Set();
	let sawExplicitScopeList = false;
	for (const item of items) {
		if (!Array.isArray(item)) continue;
		sawExplicitScopeList = true;
		for (const scope of normalizeUniqueSingleOrTrimmedStringList(item)) scopes.add(scope);
	}
	if (scopes.size === 0) return sawExplicitScopeList ? [] : void 0;
	return [...scopes];
}
/** Preserve only approval scopes owned by one pairing role. */
function preserveDeviceRoleScopes(role, scopes) {
	return normalizeUniqueSingleOrTrimmedStringList(scopes).filter((scope) => role === "operator" ? scope.startsWith("operator.") : !scope.startsWith("operator."));
}
/** Compare pairing role or scope lists as unordered sets. */
function sameDevicePairingStringSet(left, right) {
	if (left.length !== right.length) return false;
	const rightSet = new Set(right);
	for (const value of left) if (!rightSet.has(value)) return false;
	return true;
}
/** Resolve the normalized role set requested by a pairing record. */
function resolveRequestedDeviceRoles(input) {
	return mergeDevicePairingRoles(input.roles, input.role) ?? [];
}
/** Clone a paired device's role-token map before mutation. */
function cloneDevicePairingTokens(device) {
	return device.tokens ? { ...device.tokens } : {};
}
/** Refresh one compatible pending request or replace a superseded request set atomically. */
function reconcilePendingPairingRequests(params) {
	if (params.existing.length === 1 && params.canRefreshSingle(expectDefined(params.existing[0], "existing entry at 0"), params.incoming)) {
		const refreshed = params.refreshSingle(expectDefined(params.existing[0], "existing entry at 0"), params.incoming);
		params.pendingById[refreshed.requestId] = refreshed;
		params.persist();
		return {
			status: "pending",
			request: refreshed,
			created: false
		};
	}
	for (const existing of params.existing) delete params.pendingById[existing.requestId];
	const request = params.buildReplacement({
		existing: params.existing,
		incoming: params.incoming
	});
	params.pendingById[request.requestId] = request;
	params.persist();
	return {
		status: "pending",
		request,
		created: true
	};
}
//#endregion
//#region src/infra/device-pairing.ts
let pairedCardRendererCache;
function invalidatePairedCardRendererCache() {
	pairedCardRendererCache = void 0;
}
/** Return whether this Gateway has a paired client that can render progress cards. */
function hasPairedCardRenderer(baseDir) {
	const stateDir = baseDir ?? resolveStateDir();
	if (pairedCardRendererCache?.stateDir !== stateDir) pairedCardRendererCache = {
		stateDir,
		value: listDevicePairingReadOnly(stateDir).then(({ paired }) => paired.some(isProgressCardRendererClient)).catch(() => false)
	};
	return pairedCardRendererCache.value;
}
function persistState(...args) {
	persistDevicePairingStoreState(...args);
	invalidatePairedCardRendererCache();
}
/**
* Internal seam for the paired-device node-surface module: run one
* operation against the paired-device records under the shared pairing lock.
* Return `persist: true` to write the paired store after the mutation. Not a
* public API — node surface state lives inside device records, and both
* modules must serialize through the same lock to avoid lost updates.
*/
async function withPairedDeviceRecords(baseDir, operate) {
	return await withDevicePairingLock(async () => {
		const state = await loadDevicePairingState(baseDir);
		const outcome = await operate(state.pairedByDeviceId);
		if (outcome.persist) persistState(state, baseDir, "paired");
		return outcome.value;
	});
}
function listActiveTokenRoles(tokens) {
	if (!tokens) return;
	return mergeDevicePairingRoles(Object.values(tokens).filter((entry) => !entry.revokedAtMs).map((entry) => entry.role));
}
/** List the durable roles an owner approved for a paired device record. */
function listApprovedPairedDeviceRoles(device) {
	return mergeDevicePairingRoles(device.roles, device.role) ?? [];
}
/** List active-token roles, bounded by the durable approved pairing roles. */
function listEffectivePairedDeviceRoles(device) {
	const activeTokenRoles = listActiveTokenRoles(device.tokens);
	if (activeTokenRoles && activeTokenRoles.length > 0) {
		const approvedRoles = new Set(listApprovedPairedDeviceRoles(device));
		return activeTokenRoles.filter((role) => approvedRoles.has(role));
	}
	return [];
}
/** Return whether a paired device currently has an active token for one role. */
function hasEffectivePairedDeviceRole(device, role) {
	const normalized = normalizeDevicePairingRole(role);
	if (!normalized) return false;
	return listEffectivePairedDeviceRoles(device).includes(normalized);
}
/** Resolve the authenticated node pairing independently of surface approval. */
function resolveNodePairingIdentity(device) {
	if (!device || !hasEffectivePairedDeviceRole(device, "node")) return null;
	const nodeToken = device.tokens?.node;
	if (!nodeToken) return null;
	const key = createHash("sha256").update([
		device.publicKey,
		device.createdAtMs,
		nodeToken.token,
		nodeToken.createdAtMs,
		nodeToken.rotatedAtMs ?? "",
		nodeToken.revokedAtMs ?? ""
	].join("\0")).digest("hex");
	return {
		nodeId: device.deviceId,
		key
	};
}
/** Resolve the durable node-owned identity used to admit asynchronous work. */
function resolveNodePairingGeneration(device) {
	if (!device || !hasEffectivePairedDeviceRole(device, "node") || !device.nodeSurface) return null;
	const nodeToken = device.tokens?.node;
	const nodeSurface = device.nodeSurface;
	const key = createHash("sha256").update([
		device.publicKey,
		device.createdAtMs,
		nodeToken?.token ?? "",
		nodeToken?.revokedAtMs ?? "",
		nodeSurface.createdAtMs,
		nodeSurface.approvedAtMs
	].join("\0")).digest("hex");
	return {
		nodeId: device.deviceId,
		key
	};
}
/** Clear node runtime facts when their owning pairing generation changes. */
function clearNodePairingGenerationState(device, previousGeneration) {
	const nextGeneration = resolveNodePairingGeneration(device);
	if (previousGeneration?.key === nextGeneration?.key || !device.nodeSurface) return;
	delete device.nodeSurface.bins;
	delete device.nodeSurface.sessionHost;
}
/** Resolve connection identity and optional approved surface generation from one row. */
function resolveNodePairingState(device) {
	const identity = resolveNodePairingIdentity(device);
	if (!identity) return null;
	return {
		identity,
		generation: resolveNodePairingGeneration(device)
	};
}
function resolveRequestedScopes(input) {
	return normalizeDeviceAuthScopes(input.scopes);
}
function samePendingApprovalSnapshot(existing, incoming) {
	if (existing.publicKey !== incoming.publicKey) return false;
	if (existing.browserOrigin !== incoming.browserOrigin) return false;
	if (normalizeDevicePairingRole(existing.role) !== normalizeDevicePairingRole(incoming.role)) return false;
	if (!sameDevicePairingStringSet(resolveRequestedDeviceRoles(existing), resolveRequestedDeviceRoles(incoming)) || !sameDevicePairingStringSet(resolveRequestedScopes(existing), resolveRequestedScopes(incoming))) return false;
	return true;
}
function isStringSubset(subset, superset) {
	const supersetSet = new Set(superset);
	for (const value of subset) if (!supersetSet.has(value)) return false;
	return true;
}
function incomingApprovalCoveredByExisting(existing, incoming) {
	if (existing.publicKey !== incoming.publicKey) return false;
	if (existing.browserOrigin !== incoming.browserOrigin) return false;
	if (normalizeDevicePairingRole(existing.role) !== normalizeDevicePairingRole(incoming.role)) return false;
	const incomingRoles = resolveRequestedDeviceRoles(incoming);
	if (!isStringSubset(incomingRoles, resolveRequestedDeviceRoles(existing))) return false;
	const existingScopes = resolveRequestedScopes(existing);
	for (const scope of resolveRequestedScopes(incoming)) if (!incomingRoles.some((role) => roleScopesAllow({
		role,
		requestedScopes: [scope],
		allowedScopes: existingScopes
	}))) return false;
	return true;
}
function refreshPendingDevicePairingRequest(existing, incoming, isRepair) {
	return {
		...existing,
		publicKey: incoming.publicKey,
		displayName: incoming.displayName ?? existing.displayName,
		platform: incoming.platform ?? existing.platform,
		deviceFamily: incoming.deviceFamily ?? existing.deviceFamily,
		clientId: incoming.clientId ?? existing.clientId,
		clientMode: incoming.clientMode ?? existing.clientMode,
		browserOrigin: existing.browserOrigin,
		remoteIp: incoming.remoteIp ?? existing.remoteIp,
		silent: Boolean(existing.silent && incoming.silent),
		isRepair: existing.isRepair || isRepair,
		ts: existing.ts,
		refreshedAtMs: Date.now()
	};
}
function resolveSupersededPendingSilent(params) {
	return Boolean(params.incomingSilent && params.existing.every((pending) => pending.silent === true));
}
function toPublicPendingDevicePairingRequest(pending) {
	const { refreshedAtMs: _refreshedAtMs, ...request } = pending;
	return request;
}
function buildPendingDevicePairingRequest(params) {
	const role = normalizeDevicePairingRole(params.req.role) ?? void 0;
	return {
		requestId: params.requestId ?? randomUUID(),
		deviceId: params.deviceId,
		publicKey: params.req.publicKey,
		displayName: params.req.displayName,
		platform: params.req.platform,
		deviceFamily: params.req.deviceFamily,
		clientId: params.req.clientId,
		clientMode: params.req.clientMode,
		browserOrigin: params.req.browserOrigin,
		role,
		roles: mergeDevicePairingRoles(params.req.roles, role),
		scopes: mergeDevicePairingScopes(params.req.scopes),
		remoteIp: params.req.remoteIp,
		silent: params.req.silent,
		isRepair: params.isRepair,
		ts: Date.now()
	};
}
async function listDevicePairing(baseDir) {
	const state = await loadDevicePairingState(baseDir);
	return {
		pending: Object.values(state.pendingById).map(toPublicPendingDevicePairingRequest).toSorted((a, b) => b.ts - a.ts),
		paired: Object.values(state.pairedByDeviceId).toSorted((a, b) => b.approvedAtMs - a.approvedAtMs)
	};
}
/** List pairing state without creating or migrating shared state. */
async function listDevicePairingReadOnly(baseDir) {
	const state = await loadDevicePairingStateReadOnly(baseDir);
	return {
		pending: Object.values(state.pendingById).map(toPublicPendingDevicePairingRequest).toSorted((a, b) => b.ts - a.ts),
		paired: Object.values(state.pairedByDeviceId).toSorted((a, b) => b.approvedAtMs - a.approvedAtMs)
	};
}
/** Return one paired device by normalized device id. */
async function getPairedDevice(deviceId, baseDir) {
	const device = loadPairedDevicePairingStoreRecord(normalizeDevicePairingId(deviceId), baseDir);
	if (device?.pendingNodeSurface && isPairingRequestExpired(device.pendingNodeSurface.ts)) delete device.pendingNodeSurface;
	return device;
}
/** Return one pending pairing request by request id. */
async function getPendingDevicePairing(requestId, baseDir) {
	const pending = (await loadDevicePairingState(baseDir)).pendingById[requestId];
	return pending ? toPublicPendingDevicePairingRequest(pending) : null;
}
/** Create or refresh a pending device pairing request for owner approval. */
async function requestDevicePairing(req, baseDir) {
	return await withDevicePairingLock(async () => {
		const state = await loadDevicePairingState(baseDir);
		const deviceId = normalizeDevicePairingId(req.deviceId);
		if (!deviceId) throw new Error("deviceId required");
		const isRepair = Boolean(state.pairedByDeviceId[deviceId]);
		const pendingForDevice = Object.values(state.pendingById).filter((pending) => pending.deviceId === deviceId).toSorted((left, right) => right.ts - left.ts);
		const result = reconcilePendingPairingRequests({
			pendingById: state.pendingById,
			existing: pendingForDevice,
			incoming: req,
			canRefreshSingle: (existing, incoming) => samePendingApprovalSnapshot(existing, incoming) || incomingApprovalCoveredByExisting(existing, incoming),
			refreshSingle: (existing, incoming) => refreshPendingDevicePairingRequest(existing, incoming, isRepair),
			buildReplacement: ({ existing, incoming }) => {
				const latestPending = existing[0];
				const mergedRoles = mergeDevicePairingRoles(...existing.flatMap((pending) => [pending.roles, pending.role]), incoming.roles, incoming.role);
				const mergedScopes = mergeDevicePairingScopes(...existing.map((pending) => pending.scopes), incoming.scopes);
				return buildPendingDevicePairingRequest({
					deviceId,
					isRepair,
					req: {
						...incoming,
						role: normalizeDevicePairingRole(incoming.role) ?? latestPending?.role,
						roles: mergedRoles,
						scopes: mergedScopes,
						silent: resolveSupersededPendingSilent({
							existing,
							incomingSilent: incoming.silent
						})
					}
				});
			},
			persist: () => persistState(state, baseDir, "pending")
		});
		const superseded = result.created ? pendingForDevice.filter((pending) => pending.requestId !== result.request.requestId).map((pending) => ({
			requestId: pending.requestId,
			deviceId: pending.deviceId
		})) : [];
		const publicResult = {
			...result,
			request: toPublicPendingDevicePairingRequest(result.request),
			expiresAtMs: resolvePairingRequestExpiry(result.request.refreshedAtMs ?? result.request.ts)
		};
		return superseded.length > 0 ? {
			...publicResult,
			superseded
		} : publicResult;
	});
}
/** Reject a pending request and revoke matching bootstrap tokens for that device. */
async function rejectDevicePairing(requestId, baseDir) {
	return await withDevicePairingLock(async () => {
		const state = await loadDevicePairingState(baseDir);
		const pending = state.pendingById[requestId];
		if (!pending) return null;
		delete state.pendingById[requestId];
		persistState(state, baseDir, "pending");
		await revokeDeviceBootstrapTokensForDevice({
			deviceId: pending.deviceId,
			publicKey: pending.publicKey,
			baseDir
		});
		return {
			requestId,
			deviceId: pending.deviceId
		};
	});
}
/** Remove a paired device and any pending repair requests for the same device id. */
async function removePairedDevice(deviceId, baseDir) {
	return await withDevicePairingLock(async () => {
		const state = await loadDevicePairingState(baseDir);
		const normalized = normalizeDevicePairingId(deviceId);
		if (!normalized || !state.pairedByDeviceId[normalized]) return null;
		delete state.pairedByDeviceId[normalized];
		for (const [requestId, pending] of Object.entries(state.pendingById)) if (pending.deviceId === normalized) delete state.pendingById[requestId];
		persistState(state, baseDir, "both", { clearApnsNodeIds: [normalized] });
		return { deviceId: normalized };
	});
}
function silentPairingClusterKey(device) {
	const clientId = device.clientId?.trim().toLowerCase() ?? "";
	const clientMode = device.clientMode?.trim().toLowerCase() ?? "";
	const displayName = device.displayName?.trim().toLowerCase() ?? "";
	if (!clientId && !clientMode && !displayName) return null;
	return `${clientId}\0${clientMode}\0${displayName}`;
}
const PRUNE_RECENT_APPROVAL_GRACE_MS = 6e4;
/**
* Remove silent-approved sibling records superseded by a newly approved silent
* pairing of the same client cluster. Only records whose latest approval was
* same-host local ("silent") are eligible, as anchor and as victim: local
* clients re-pair silently by construction and share the gateway host, so the
* metadata cluster key cannot match a different machine. Currently connected
* devices are skipped so concurrent sessions with distinct state dirs keep
* their tokens while live.
*/
async function pruneSupersededSilentPairedDevices(params) {
	return await withDevicePairingLock(async () => {
		const state = await loadDevicePairingState(params.baseDir);
		const anchor = state.pairedByDeviceId[normalizeDevicePairingId(params.deviceId)];
		if (!anchor || anchor.approvedVia !== "silent") return [];
		const anchorKey = silentPairingClusterKey(anchor);
		if (!anchorKey) return [];
		const nowMs = params.nowMs ?? Date.now();
		const removed = [];
		for (const device of Object.values(state.pairedByDeviceId)) {
			if (device.deviceId === anchor.deviceId) continue;
			if (device.approvedVia !== "silent") continue;
			if (silentPairingClusterKey(device) !== anchorKey) continue;
			if (nowMs - device.approvedAtMs < PRUNE_RECENT_APPROVAL_GRACE_MS) continue;
			if (params.isDeviceConnected?.(device.deviceId)) continue;
			delete state.pairedByDeviceId[device.deviceId];
			for (const [requestId, pending] of Object.entries(state.pendingById)) if (pending.deviceId === device.deviceId) delete state.pendingById[requestId];
			removed.push({
				deviceId: device.deviceId,
				roles: listApprovedPairedDeviceRoles(device)
			});
		}
		if (removed.length === 0) return [];
		persistState(state, params.baseDir, "both", { clearApnsNodeIds: removed.map((entry) => entry.deviceId) });
		return removed;
	});
}
/** Remove one approved paired-device role while preserving unrelated role tokens. */
async function removePairedDeviceRole(params) {
	return await withDevicePairingLock(async () => {
		const state = await loadDevicePairingState(params.baseDir);
		const normalizedDeviceId = normalizeDevicePairingId(params.deviceId);
		const role = normalizeDevicePairingRole(params.role);
		const device = state.pairedByDeviceId[normalizedDeviceId];
		if (!device || !role || !listApprovedPairedDeviceRoles(device).includes(role)) return null;
		const tokens = cloneDevicePairingTokens(device);
		delete tokens[role];
		const remainingRoles = listApprovedPairedDeviceRoles(device).filter((entry) => entry !== role);
		if (remainingRoles.length === 0) {
			for (const [requestId, pending] of Object.entries(state.pendingById)) if (pending.deviceId === normalizedDeviceId) delete state.pendingById[requestId];
			delete state.pairedByDeviceId[normalizedDeviceId];
			persistState(state, params.baseDir, "both", { clearApnsNodeIds: [normalizedDeviceId] });
			return {
				deviceId: normalizedDeviceId,
				role,
				removedDevice: true
			};
		}
		for (const [requestId, pending] of Object.entries(state.pendingById)) {
			if (pending.deviceId !== normalizedDeviceId) continue;
			const pendingRoles = resolveRequestedDeviceRoles(pending);
			if (!pendingRoles.includes(role)) continue;
			const nextPendingRoles = pendingRoles.filter((entry) => entry !== role);
			if (nextPendingRoles.length === 0) {
				delete state.pendingById[requestId];
				continue;
			}
			const pendingScopes = Array.isArray(pending.scopes) ? mergeDevicePairingScopes(...nextPendingRoles.map((entry) => preserveDeviceRoleScopes(entry, pending.scopes))) : void 0;
			state.pendingById[requestId] = {
				...pending,
				role: nextPendingRoles[0],
				roles: nextPendingRoles,
				scopes: pendingScopes
			};
		}
		const scopeBaseline = device.approvedScopes ?? device.scopes;
		const preservedScopes = Array.isArray(scopeBaseline) ? mergeDevicePairingScopes(...remainingRoles.map((entry) => preserveDeviceRoleScopes(entry, scopeBaseline))) : void 0;
		const next = {
			...device,
			role: remainingRoles[0],
			roles: remainingRoles,
			...preservedScopes !== void 0 ? {
				scopes: preservedScopes,
				approvedScopes: preservedScopes
			} : {},
			tokens: Object.keys(tokens).length > 0 ? tokens : void 0
		};
		if (role === "node") {
			delete next.nodeSurface;
			delete next.pendingNodeSurface;
		}
		state.pairedByDeviceId[normalizedDeviceId] = next;
		persistState(state, params.baseDir, "both");
		return {
			deviceId: normalizedDeviceId,
			role,
			removedDevice: false
		};
	});
}
/** Update non-auth metadata for a paired device presence/status refresh. */
async function updatePairedDeviceMetadata(deviceId, patch, baseDir) {
	return await withDevicePairingLock(async () => {
		const state = await loadDevicePairingState(baseDir);
		const normalizedDeviceId = normalizeDevicePairingId(deviceId);
		const existing = state.pairedByDeviceId[normalizedDeviceId];
		if (!existing) return false;
		const next = { ...existing };
		if ("displayName" in patch) next.displayName = patch.displayName;
		if ("operatorLabel" in patch) next.operatorLabel = patch.operatorLabel;
		if ("platform" in patch) next.platform = patch.platform;
		if ("clientId" in patch) next.clientId = patch.clientId;
		if ("clientMode" in patch) next.clientMode = patch.clientMode;
		if ("remoteIp" in patch) next.remoteIp = patch.remoteIp;
		if ("lastSeenAtMs" in patch) next.lastSeenAtMs = patch.lastSeenAtMs;
		if ("lastSeenReason" in patch) next.lastSeenReason = patch.lastSeenReason;
		state.pairedByDeviceId[normalizedDeviceId] = next;
		persistState(state, baseDir, "paired");
		return true;
	});
}
/** Update paired-device presence only while the authenticated node generation still owns it. */
async function updatePairedDevicePresence(deviceId, patch, expectedPairingGeneration, baseDir) {
	return await withDevicePairingLock(async () => {
		return updatePairedDevicePresenceInTransaction(deviceId, baseDir, (device) => {
			const currentPairingGeneration = resolveNodePairingGeneration(device);
			if (!device || expectedPairingGeneration.nodeId !== device.deviceId || currentPairingGeneration?.key !== expectedPairingGeneration.key) return {
				value: false,
				persist: false
			};
			return {
				value: true,
				persist: true,
				lastSeenAtMs: patch.lastSeenAtMs,
				lastSeenReason: patch.lastSeenReason
			};
		});
	});
}
//#endregion
export { withDevicePairingLock as A, mergeDevicePairingRoles as C, preserveDeviceRoleScopes as D, normalizeDevicePairingRole as E, resolveRequestedDeviceRoles as O, loadDevicePairingState as S, normalizeDevicePairingId as T, resolveNodePairingState as _, hasPairedCardRenderer as a, withPairedDeviceRecords as b, listDevicePairing as c, pruneSupersededSilentPairedDevices as d, rejectDevicePairing as f, resolveNodePairingGeneration as g, requestDevicePairing as h, hasEffectivePairedDeviceRole as i, sameDevicePairingStringSet as k, listDevicePairingReadOnly as l, removePairedDeviceRole as m, getPairedDevice as n, invalidatePairedCardRendererCache as o, removePairedDevice as p, getPendingDevicePairing as r, listApprovedPairedDeviceRoles as s, clearNodePairingGenerationState as t, listEffectivePairedDeviceRoles as u, updatePairedDeviceMetadata as v, mergeDevicePairingScopes as w, cloneDevicePairingTokens as x, updatePairedDevicePresence as y };
