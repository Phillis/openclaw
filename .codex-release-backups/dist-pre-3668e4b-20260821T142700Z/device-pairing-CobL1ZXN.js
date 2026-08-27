import "./src-BkwWvwB2.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { p as normalizeUniqueSingleOrTrimmedStringList } from "./string-normalization-e_fvmxMf.js";
import { t as createAsyncLock } from "./async-lock-Dub_CPte.js";
import { n as normalizeDeviceAuthScopes } from "./device-auth-C-STNejO.js";
import { n as resolveScopeOutsideRequestedRoles, r as roleScopesAllow, t as resolveMissingRequestedScope } from "./operator-scope-compat-C7_b0yme.js";
import { B as resolveDeviceProfileRoleScopes, C as persistDevicePairingStoreState, T as updatePairedDevicePresenceInTransaction, V as resolveDeviceProfileScopes, b as loadDevicePairingStoreState, g as verifyPairingToken, h as generatePairingToken, p as revokeDeviceBootstrapTokensForDevice, v as pruneExpiredPending, x as loadPairedDevicePairingStoreRecord } from "./device-bootstrap-B0GG6gmu.js";
import { createHash, randomUUID } from "node:crypto";
//#region src/infra/device-pairing.ts
const PAIRING_PENDING_TTL_MS = 300 * 1e3;
const OPERATOR_ROLE = "operator";
const OPERATOR_SCOPE_PREFIX = "operator.";
const SHARED_GATEWAY_AUTH_ISSUER_KIND = "shared-gateway-auth";
const BROWSER_DEVICE_CLIENT_IDS = /* @__PURE__ */ new Set(["openclaw-control-ui", "webchat-ui"]);
const BROWSER_DEVICE_CLIENT_MODE = "webchat";
const withLock = createAsyncLock();
const effectiveOperatorPairingListeners = /* @__PURE__ */ new Set();
/** Subscribe to canonical pairing mutations that establish an effective operator. */
function onEffectiveOperatorDevicePaired(listener) {
	effectiveOperatorPairingListeners.add(listener);
	return () => effectiveOperatorPairingListeners.delete(listener);
}
function notifyEffectiveOperatorDevicePaired(device) {
	const identity = resolveEffectiveOperatorDeviceIdentity(device);
	if (!identity) return;
	for (const listener of effectiveOperatorPairingListeners) try {
		listener(identity);
	} catch {}
}
/** Format a device-pairing authorization failure for CLI/API callers. */
function formatDevicePairingForbiddenMessage(result) {
	switch (result.reason) {
		case "caller-scopes-required": return `missing scope: ${result.scope ?? "callerScopes-required"}`;
		case "caller-missing-scope": return `missing scope: ${result.scope ?? "unknown"}`;
		case "scope-outside-requested-roles": return `invalid scope for requested roles: ${result.scope ?? "unknown"}`;
		case "effective-operator-already-paired": return "an effective operator device is already paired";
		case "bootstrap-role-not-allowed": return `bootstrap profile does not allow role: ${result.role ?? "unknown"}`;
		case "bootstrap-scope-not-allowed": return `bootstrap profile does not allow scope: ${result.scope ?? "unknown"}`;
	}
	throw new Error("Unsupported device pairing forbidden reason");
}
async function loadState(baseDir) {
	const state = loadDevicePairingStoreState(baseDir);
	const now = Date.now();
	pruneExpiredPending(state.pendingById, now, PAIRING_PENDING_TTL_MS);
	for (const device of Object.values(state.pairedByDeviceId)) if (device.pendingNodeSurface && now - device.pendingNodeSurface.ts > PAIRING_PENDING_TTL_MS) delete device.pendingNodeSurface;
	return state;
}
/**
* Internal seam for the paired-device node-surface module: run one
* operation against the paired-device records under the shared pairing lock.
* Return `persist: true` to write the paired store after the mutation. Not a
* public API — node surface state lives inside device records, and both
* modules must serialize through the same lock to avoid lost updates.
*/
async function withPairedDeviceRecords(baseDir, operate) {
	return await withLock(async () => {
		const state = await loadState(baseDir);
		const outcome = await operate(state.pairedByDeviceId);
		if (outcome.persist) persistDevicePairingStoreState(state, baseDir, "paired");
		return outcome.value;
	});
}
function normalizeDeviceId(deviceId) {
	return deviceId.trim();
}
function normalizeRole(role) {
	const trimmed = role?.trim();
	return trimmed ? trimmed : null;
}
function mergeRoles(...items) {
	const roles = /* @__PURE__ */ new Set();
	for (const item of items) for (const role of normalizeUniqueSingleOrTrimmedStringList(item)) roles.add(role);
	if (roles.size === 0) return;
	return [...roles];
}
function listActiveTokenRoles(tokens) {
	if (!tokens) return;
	return mergeRoles(Object.values(tokens).filter((entry) => !entry.revokedAtMs).map((entry) => entry.role));
}
/** List the durable roles an owner approved for a paired device record. */
function listApprovedPairedDeviceRoles(device) {
	return mergeRoles(device.roles, device.role) ?? [];
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
	const normalized = normalizeRole(role);
	if (!normalized) return false;
	return listEffectivePairedDeviceRoles(device).includes(normalized);
}
function hasEffectivePairedDeviceScope(device, role, scope) {
	const normalizedRole = normalizeRole(role);
	const token = normalizedRole ? device.tokens?.[normalizedRole] : void 0;
	return Boolean(normalizedRole && token && !token.revokedAtMs && hasEffectivePairedDeviceRole(device, normalizedRole) && roleScopesAllow({
		role: normalizedRole,
		requestedScopes: [scope],
		allowedScopes: token.scopes
	}));
}
function resolveEffectiveOperatorDeviceIdentity(device) {
	const token = device.tokens?.[OPERATOR_ROLE];
	if (!token || token.revokedAtMs || !hasEffectivePairedDeviceRole(device, OPERATOR_ROLE)) return null;
	return {
		deviceId: device.deviceId,
		publicKey: device.publicKey,
		scopes: normalizeDeviceAuthScopes(token.scopes)
	};
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
/** Clear node-surface cache state when its owning pairing generation changes. */
function clearNodePairingGenerationBins(device, previousGeneration) {
	const nextGeneration = resolveNodePairingGeneration(device);
	if (previousGeneration?.key === nextGeneration?.key || !device.nodeSurface || device.nodeSurface.bins === void 0) return;
	delete device.nodeSurface.bins;
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
function mergeScopes(...items) {
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
function sameStringSet(left, right) {
	if (left.length !== right.length) return false;
	const rightSet = new Set(right);
	for (const value of left) if (!rightSet.has(value)) return false;
	return true;
}
function resolveRequestedRoles(input) {
	return mergeRoles(input.roles, input.role) ?? [];
}
function resolveRequestedScopes(input) {
	return normalizeDeviceAuthScopes(input.scopes);
}
function samePendingApprovalSnapshot(existing, incoming) {
	if (existing.publicKey !== incoming.publicKey) return false;
	if (existing.browserOrigin !== incoming.browserOrigin) return false;
	if (normalizeRole(existing.role) !== normalizeRole(incoming.role)) return false;
	if (!sameStringSet(resolveRequestedRoles(existing), resolveRequestedRoles(incoming)) || !sameStringSet(resolveRequestedScopes(existing), resolveRequestedScopes(incoming))) return false;
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
	if (normalizeRole(existing.role) !== normalizeRole(incoming.role)) return false;
	const incomingRoles = resolveRequestedRoles(incoming);
	if (!isStringSubset(incomingRoles, resolveRequestedRoles(existing))) return false;
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
	const role = normalizeRole(params.req.role) ?? void 0;
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
		roles: mergeRoles(params.req.roles, role),
		scopes: mergeScopes(params.req.scopes),
		remoteIp: params.req.remoteIp,
		silent: params.req.silent,
		isRepair: params.isRepair,
		ts: Date.now()
	};
}
function newToken() {
	return generatePairingToken();
}
function getPairedDeviceFromState(state, deviceId) {
	return state.pairedByDeviceId[normalizeDeviceId(deviceId)] ?? null;
}
function cloneDeviceTokens(device) {
	return device.tokens ? { ...device.tokens } : {};
}
function isBrowserRelatedPairedDevice(device) {
	if (device.clientMode?.trim().toLowerCase() === BROWSER_DEVICE_CLIENT_MODE) return true;
	const clientId = device.clientId?.trim().toLowerCase();
	return clientId ? BROWSER_DEVICE_CLIENT_IDS.has(clientId) : false;
}
function deviceTokenIssuerMatches(entry, issuer) {
	if (!issuer) return !entry.issuer;
	return entry.issuer?.kind === issuer.kind && entry.issuer.generation === issuer.generation;
}
function buildDeviceAuthToken(params) {
	return {
		token: newToken(),
		role: params.role,
		scopes: params.scopes,
		issuer: params.issuer ?? (params.preserveExistingIssuer ? params.existing?.issuer : void 0),
		createdAtMs: params.existing?.createdAtMs ?? params.now,
		rotatedAtMs: params.rotatedAtMs,
		revokedAtMs: void 0,
		lastUsedAtMs: params.existing?.lastUsedAtMs
	};
}
function mergeApprovalKind(existing, incoming) {
	if (incoming === "owner" || !existing) return incoming;
	if (existing.approvedVia === void 0) return incoming === "bootstrap" ? "bootstrap" : void 0;
	if (existing.approvedVia === "owner" || existing.approvedVia === "bootstrap") return existing.approvedVia;
	return incoming;
}
function buildApprovedPairedDevice(params) {
	return {
		deviceId: params.pending.deviceId,
		publicKey: params.pending.publicKey,
		displayName: params.accessMetadata?.displayName ?? params.pending.displayName,
		platform: params.pending.platform,
		deviceFamily: params.pending.deviceFamily,
		clientId: params.pending.clientId,
		clientMode: params.pending.clientMode,
		browserOrigin: params.pending.browserOrigin,
		role: params.pending.role,
		roles: params.roles,
		scopes: params.approvedScopes,
		approvedScopes: params.approvedScopes,
		remoteIp: params.accessMetadata?.remoteIp ?? params.pending.remoteIp,
		tokens: params.tokens,
		approvedVia: mergeApprovalKind(params.existing, params.approvedVia),
		...params.existing?.nodeSurface ? { nodeSurface: params.existing.nodeSurface } : {},
		...params.existing?.pendingNodeSurface ? { pendingNodeSurface: params.existing.pendingNodeSurface } : {},
		...params.existing?.operatorLabel ? { operatorLabel: params.existing.operatorLabel } : {},
		createdAtMs: params.existing?.createdAtMs ?? params.now,
		approvedAtMs: params.now,
		lastSeenAtMs: params.accessMetadata?.lastSeenAtMs ?? params.existing?.lastSeenAtMs,
		lastSeenReason: params.accessMetadata?.lastSeenReason ?? params.existing?.lastSeenReason
	};
}
function resolveRoleScopedDeviceTokenScopes(role, scopes) {
	const normalized = normalizeDeviceAuthScopes(scopes);
	if (role === "operator") return normalized.filter((scope) => scope.startsWith(OPERATOR_SCOPE_PREFIX));
	return normalized.filter((scope) => !scope.startsWith(OPERATOR_SCOPE_PREFIX));
}
function preserveRoleScopedApprovalScopes(role, scopes) {
	return normalizeUniqueSingleOrTrimmedStringList(scopes).filter((scope) => role === OPERATOR_ROLE ? scope.startsWith(OPERATOR_SCOPE_PREFIX) : !scope.startsWith(OPERATOR_SCOPE_PREFIX));
}
function resolveApprovedTokenScopes(params) {
	const pendingScopes = resolveRoleScopedDeviceTokenScopes(params.role, params.pending.scopes);
	if (pendingScopes.length > 0) {
		const approvedBaseline = resolveRoleScopedDeviceTokenScopes(params.role, params.existing?.approvedScopes ?? params.existing?.scopes);
		const requestedScopeDelta = params.existingToken && approvedBaseline.length > 0 ? pendingScopes.filter((scope) => !approvedBaseline.includes(scope)) : pendingScopes;
		if (requestedScopeDelta.length === 0 && params.existingToken) return resolveRoleScopedDeviceTokenScopes(params.role, params.existingToken.scopes);
		return resolveRoleScopedDeviceTokenScopes(params.role, mergeScopes(params.existingToken?.scopes, requestedScopeDelta));
	}
	return resolveRoleScopedDeviceTokenScopes(params.role, params.existingToken?.scopes ?? params.approvedScopes ?? params.existing?.approvedScopes ?? params.existing?.scopes);
}
function resolveApprovedDeviceScopeBaseline(device) {
	const baseline = device.approvedScopes ?? device.scopes;
	if (!Array.isArray(baseline)) return null;
	return normalizeDeviceAuthScopes(baseline);
}
function scopesWithinApprovedDeviceBaseline(params) {
	if (!params.approvedScopes) return false;
	return roleScopesAllow({
		role: params.role,
		requestedScopes: params.scopes,
		allowedScopes: params.approvedScopes
	});
}
async function listDevicePairing(baseDir) {
	const state = await loadState(baseDir);
	return {
		pending: Object.values(state.pendingById).map(toPublicPendingDevicePairingRequest).toSorted((a, b) => b.ts - a.ts),
		paired: Object.values(state.pairedByDeviceId).toSorted((a, b) => b.approvedAtMs - a.approvedAtMs)
	};
}
/** Return one paired device by normalized device id. */
async function getPairedDevice(deviceId, baseDir) {
	const device = loadPairedDevicePairingStoreRecord(normalizeDeviceId(deviceId), baseDir);
	if (device?.pendingNodeSurface && Date.now() - device.pendingNodeSurface.ts > PAIRING_PENDING_TTL_MS) delete device.pendingNodeSurface;
	return device;
}
/** Return one pending pairing request by request id. */
async function getPendingDevicePairing(requestId, baseDir) {
	const pending = (await loadState(baseDir)).pendingById[requestId];
	return pending ? toPublicPendingDevicePairingRequest(pending) : null;
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
/** Create or refresh a pending device pairing request for owner approval. */
async function requestDevicePairing(req, baseDir) {
	return await withLock(async () => {
		const state = await loadState(baseDir);
		const deviceId = normalizeDeviceId(req.deviceId);
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
				const mergedRoles = mergeRoles(...existing.flatMap((pending) => [pending.roles, pending.role]), incoming.roles, incoming.role);
				const mergedScopes = mergeScopes(...existing.map((pending) => pending.scopes), incoming.scopes);
				return buildPendingDevicePairingRequest({
					deviceId,
					isRepair,
					req: {
						...incoming,
						role: normalizeRole(incoming.role) ?? latestPending?.role,
						roles: mergedRoles,
						scopes: mergedScopes,
						silent: resolveSupersededPendingSilent({
							existing,
							incomingSilent: incoming.silent
						})
					}
				});
			},
			persist: () => persistDevicePairingStoreState(state, baseDir, "pending")
		});
		const superseded = result.created ? pendingForDevice.filter((pending) => pending.requestId !== result.request.requestId).map((pending) => ({
			requestId: pending.requestId,
			deviceId: pending.deviceId
		})) : [];
		const publicResult = {
			...result,
			request: toPublicPendingDevicePairingRequest(result.request),
			expiresAtMs: (result.request.refreshedAtMs ?? result.request.ts) + PAIRING_PENDING_TTL_MS
		};
		return superseded.length > 0 ? {
			...publicResult,
			superseded
		} : publicResult;
	});
}
async function approveDevicePairing(requestId, optionsOrBaseDir, maybeBaseDir) {
	return await approveDevicePairingWithOptions(requestId, typeof optionsOrBaseDir === "string" || optionsOrBaseDir === void 0 ? void 0 : optionsOrBaseDir, typeof optionsOrBaseDir === "string" ? optionsOrBaseDir : maybeBaseDir);
}
/** Approve the legacy Control UI migration only while no pairing-capable operator is paired. */
async function approveControlUiDeviceAuthMigrationPairing(requestId, options, baseDir) {
	return await approveDevicePairingWithOptions(requestId, {
		...options,
		requireNoPairingCapableOperator: true
	}, baseDir);
}
async function approveDevicePairingWithOptions(requestId, options, baseDir) {
	return await withLock(async () => {
		const state = await loadState(baseDir);
		const pendingRecord = state.pendingById[requestId];
		if (!pendingRecord) return null;
		if (options?.requireNoPairingCapableOperator && Object.values(state.pairedByDeviceId).some((device) => hasEffectivePairedDeviceScope(device, OPERATOR_ROLE, "operator.pairing"))) return {
			status: "forbidden",
			reason: "effective-operator-already-paired"
		};
		const autoApproveScopes = options?.autoApproveNewDeviceScopes;
		const requestedRoles = resolveRequestedRoles(pendingRecord);
		const knownDevice = state.pairedByDeviceId[pendingRecord.deviceId];
		const trustedProxySameKeyDevice = options?.approvedVia === "trusted-proxy" && knownDevice !== void 0 && knownDevice.publicKey === pendingRecord.publicKey;
		if (autoApproveScopes && ((pendingRecord.isRepair || knownDevice) && !trustedProxySameKeyDevice || !sameStringSet(requestedRoles, [OPERATOR_ROLE]))) return null;
		const pending = autoApproveScopes ? {
			...pendingRecord,
			scopes: [...autoApproveScopes]
		} : pendingRecord;
		const roleMismatchScope = resolveScopeOutsideRequestedRoles({
			requestedRoles,
			requestedScopes: normalizeDeviceAuthScopes(pending.scopes)
		});
		if (roleMismatchScope) return {
			status: "forbidden",
			reason: "scope-outside-requested-roles",
			scope: roleMismatchScope
		};
		const now = Date.now();
		const existing = state.pairedByDeviceId[pending.deviceId];
		const roles = mergeRoles(existing?.roles, existing?.role, pending.roles, pending.role);
		const approvedScopes = mergeScopes(existing?.approvedScopes ?? existing?.scopes, pending.scopes);
		const previousNodeGeneration = resolveNodePairingGeneration(existing ?? null);
		const tokens = existing?.tokens ? { ...existing.tokens } : {};
		const nextTokenScopesByRole = /* @__PURE__ */ new Map();
		for (const roleForToken of requestedRoles) {
			const existingToken = tokens[roleForToken];
			const nextScopes = resolveApprovedTokenScopes({
				role: roleForToken,
				pending,
				existingToken,
				approvedScopes,
				existing
			});
			nextTokenScopesByRole.set(roleForToken, nextScopes);
			if (roleForToken === OPERATOR_ROLE && nextScopes.length > 0) {
				const callerRequiredScopes = mergeScopes(resolveRoleScopedDeviceTokenScopes(roleForToken, pending.scopes), nextScopes) ?? nextScopes;
				if (!options?.callerScopes) return {
					status: "forbidden",
					reason: "caller-scopes-required",
					scope: callerRequiredScopes[0]
				};
				const missingScope = resolveMissingRequestedScope({
					role: OPERATOR_ROLE,
					requestedScopes: callerRequiredScopes,
					allowedScopes: options.callerScopes
				});
				if (missingScope) return {
					status: "forbidden",
					reason: "caller-missing-scope",
					scope: missingScope
				};
			}
		}
		for (const [roleForToken, nextScopes] of nextTokenScopesByRole) {
			const existingToken = tokens[roleForToken];
			const tokenNow = Date.now();
			tokens[roleForToken] = {
				token: newToken(),
				role: roleForToken,
				scopes: nextScopes,
				createdAtMs: existingToken?.createdAtMs ?? tokenNow,
				rotatedAtMs: existingToken ? tokenNow : void 0,
				revokedAtMs: void 0,
				lastUsedAtMs: existingToken?.lastUsedAtMs
			};
		}
		const device = buildApprovedPairedDevice({
			pending,
			existing,
			roles,
			approvedScopes,
			tokens,
			now,
			approvedVia: options?.approvedVia ?? "owner",
			accessMetadata: options?.accessMetadata
		});
		const nextNodeGeneration = resolveNodePairingGeneration(device);
		const nodePairingGenerationChanged = Boolean(previousNodeGeneration && previousNodeGeneration.key !== nextNodeGeneration?.key);
		clearNodePairingGenerationBins(device, previousNodeGeneration);
		const installationIdentityChanged = Boolean(existing && existing.publicKey !== device.publicKey);
		delete state.pendingById[requestId];
		state.pairedByDeviceId[device.deviceId] = device;
		persistDevicePairingStoreState(state, baseDir, "both", installationIdentityChanged ? { clearApnsNodeIds: [device.deviceId] } : void 0);
		notifyEffectiveOperatorDevicePaired(device);
		return {
			status: "approved",
			requestId,
			device,
			...nodePairingGenerationChanged ? { nodePairingGenerationChanged: true } : {}
		};
	});
}
async function approveBootstrapDevicePairing(requestId, bootstrapProfile, optionsOrBaseDir, maybeBaseDir) {
	const options = typeof optionsOrBaseDir === "string" || optionsOrBaseDir === void 0 ? void 0 : optionsOrBaseDir;
	const baseDir = typeof optionsOrBaseDir === "string" ? optionsOrBaseDir : maybeBaseDir;
	const approvedRoles = mergeRoles(bootstrapProfile.roles) ?? [];
	const approvedScopes = resolveDeviceProfileScopes(bootstrapProfile, approvedRoles);
	return await withLock(async () => {
		const state = await loadState(baseDir);
		const pending = state.pendingById[requestId];
		if (!pending) return null;
		const requestedRoles = resolveRequestedRoles(pending);
		const missingRole = requestedRoles.find((role) => !approvedRoles.includes(role));
		if (missingRole) return {
			status: "forbidden",
			reason: "bootstrap-role-not-allowed",
			role: missingRole
		};
		const requestedOperatorScopes = normalizeDeviceAuthScopes(pending.scopes).filter((scope) => scope.startsWith(OPERATOR_SCOPE_PREFIX));
		const missingScope = resolveMissingRequestedScope({
			role: OPERATOR_ROLE,
			requestedScopes: requestedOperatorScopes,
			allowedScopes: approvedScopes
		});
		if (missingScope) return {
			status: "forbidden",
			reason: "bootstrap-scope-not-allowed",
			scope: missingScope
		};
		const now = Date.now();
		const existing = state.pairedByDeviceId[pending.deviceId];
		const grantedRoles = requestedRoles;
		const grantedScopes = resolveDeviceProfileScopes(bootstrapProfile, grantedRoles, pending.scopes ?? []);
		const grantedRoleSet = new Set(grantedRoles);
		const preservedExistingScopes = (mergeRoles(existing?.roles, existing?.role) ?? []).flatMap((existingRole) => grantedRoleSet.has(existingRole) ? [] : preserveRoleScopedApprovalScopes(existingRole, existing?.approvedScopes ?? existing?.scopes));
		const roles = mergeRoles(existing?.roles, existing?.role, pending.roles, pending.role);
		const nextApprovedScopes = mergeScopes(preservedExistingScopes, grantedScopes);
		const previousNodeGeneration = resolveNodePairingGeneration(existing ?? null);
		const tokens = existing?.tokens ? { ...existing.tokens } : {};
		for (const roleForToken of grantedRoles) {
			const existingToken = tokens[roleForToken];
			tokens[roleForToken] = buildDeviceAuthToken({
				role: roleForToken,
				scopes: roleForToken === OPERATOR_ROLE ? resolveDeviceProfileRoleScopes(bootstrapProfile, roleForToken, grantedScopes) : [],
				existing: existingToken,
				now,
				...existingToken ? { rotatedAtMs: now } : {}
			});
		}
		const device = buildApprovedPairedDevice({
			pending,
			existing,
			roles,
			approvedScopes: nextApprovedScopes,
			tokens,
			now,
			approvedVia: "bootstrap",
			accessMetadata: options?.accessMetadata
		});
		const nextNodeGeneration = resolveNodePairingGeneration(device);
		const nodePairingGenerationChanged = Boolean(previousNodeGeneration && previousNodeGeneration.key !== nextNodeGeneration?.key);
		clearNodePairingGenerationBins(device, previousNodeGeneration);
		const installationIdentityChanged = Boolean(existing && existing.publicKey !== device.publicKey);
		delete state.pendingById[requestId];
		state.pairedByDeviceId[device.deviceId] = device;
		persistDevicePairingStoreState(state, baseDir, "both", installationIdentityChanged ? { clearApnsNodeIds: [device.deviceId] } : void 0);
		notifyEffectiveOperatorDevicePaired(device);
		return {
			status: "approved",
			requestId,
			device,
			...nodePairingGenerationChanged ? { nodePairingGenerationChanged: true } : {}
		};
	});
}
/** Reject a pending request and revoke matching bootstrap tokens for that device. */
async function rejectDevicePairing(requestId, baseDir) {
	return await withLock(async () => {
		const state = await loadState(baseDir);
		const pending = state.pendingById[requestId];
		if (!pending) return null;
		delete state.pendingById[requestId];
		persistDevicePairingStoreState(state, baseDir, "pending");
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
	return await withLock(async () => {
		const state = await loadState(baseDir);
		const normalized = normalizeDeviceId(deviceId);
		if (!normalized || !state.pairedByDeviceId[normalized]) return null;
		delete state.pairedByDeviceId[normalized];
		for (const [requestId, pending] of Object.entries(state.pendingById)) if (pending.deviceId === normalized) delete state.pendingById[requestId];
		persistDevicePairingStoreState(state, baseDir, "both", { clearApnsNodeIds: [normalized] });
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
	return await withLock(async () => {
		const state = await loadState(params.baseDir);
		const anchor = state.pairedByDeviceId[normalizeDeviceId(params.deviceId)];
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
		persistDevicePairingStoreState(state, params.baseDir, "both", { clearApnsNodeIds: removed.map((entry) => entry.deviceId) });
		return removed;
	});
}
/** Remove one approved paired-device role while preserving unrelated role tokens. */
async function removePairedDeviceRole(params) {
	return await withLock(async () => {
		const state = await loadState(params.baseDir);
		const normalizedDeviceId = normalizeDeviceId(params.deviceId);
		const role = normalizeRole(params.role);
		const device = state.pairedByDeviceId[normalizedDeviceId];
		if (!device || !role || !listApprovedPairedDeviceRoles(device).includes(role)) return null;
		const tokens = cloneDeviceTokens(device);
		delete tokens[role];
		const remainingRoles = listApprovedPairedDeviceRoles(device).filter((entry) => entry !== role);
		if (remainingRoles.length === 0) {
			for (const [requestId, pending] of Object.entries(state.pendingById)) if (pending.deviceId === normalizedDeviceId) delete state.pendingById[requestId];
			delete state.pairedByDeviceId[normalizedDeviceId];
			persistDevicePairingStoreState(state, params.baseDir, "both", { clearApnsNodeIds: [normalizedDeviceId] });
			return {
				deviceId: normalizedDeviceId,
				role,
				removedDevice: true
			};
		}
		for (const [requestId, pending] of Object.entries(state.pendingById)) {
			if (pending.deviceId !== normalizedDeviceId) continue;
			const pendingRoles = resolveRequestedRoles(pending);
			if (!pendingRoles.includes(role)) continue;
			const nextPendingRoles = pendingRoles.filter((entry) => entry !== role);
			if (nextPendingRoles.length === 0) {
				delete state.pendingById[requestId];
				continue;
			}
			const pendingScopes = Array.isArray(pending.scopes) ? mergeScopes(...nextPendingRoles.map((entry) => preserveRoleScopedApprovalScopes(entry, pending.scopes))) : void 0;
			state.pendingById[requestId] = {
				...pending,
				role: nextPendingRoles[0],
				roles: nextPendingRoles,
				scopes: pendingScopes
			};
		}
		const scopeBaseline = device.approvedScopes ?? device.scopes;
		const preservedScopes = Array.isArray(scopeBaseline) ? mergeScopes(...remainingRoles.map((entry) => preserveRoleScopedApprovalScopes(entry, scopeBaseline))) : void 0;
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
		persistDevicePairingStoreState(state, params.baseDir, "both");
		return {
			deviceId: normalizedDeviceId,
			role,
			removedDevice: false
		};
	});
}
/** Update non-auth metadata for a paired device presence/status refresh. */
async function updatePairedDeviceMetadata(deviceId, patch, baseDir) {
	return await withLock(async () => {
		const state = await loadState(baseDir);
		const normalizedDeviceId = normalizeDeviceId(deviceId);
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
		persistDevicePairingStoreState(state, baseDir, "paired");
		return true;
	});
}
/** Update paired-device presence only while the authenticated node generation still owns it. */
async function updatePairedDevicePresence(deviceId, patch, expectedPairingGeneration, baseDir) {
	return await withLock(async () => {
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
/** Summarize token metadata without exposing bearer token strings. */
function summarizeDeviceTokens(tokens) {
	if (!tokens) return;
	const summaries = Object.values(tokens).map((token) => ({
		role: token.role,
		scopes: token.scopes,
		createdAtMs: token.createdAtMs,
		rotatedAtMs: token.rotatedAtMs,
		revokedAtMs: token.revokedAtMs,
		lastUsedAtMs: token.lastUsedAtMs
	})).toSorted((a, b) => a.role.localeCompare(b.role));
	return summaries.length > 0 ? summaries : void 0;
}
/** Verify a device role token, scope it to the approval baseline, and mark last use. */
async function verifyDeviceToken(params) {
	return await withLock(async () => {
		const state = await loadState(params.baseDir);
		const device = getPairedDeviceFromState(state, params.deviceId);
		if (!device) return {
			ok: false,
			reason: "device-not-paired"
		};
		const role = normalizeRole(params.role);
		if (!role) return {
			ok: false,
			reason: "role-missing"
		};
		const entry = device.tokens?.[role];
		if (!entry) return {
			ok: false,
			reason: "token-missing"
		};
		if (entry.revokedAtMs) return {
			ok: false,
			reason: "token-revoked"
		};
		if (!verifyPairingToken(params.token, entry.token)) return {
			ok: false,
			reason: "token-mismatch"
		};
		if (entry.issuer?.kind === SHARED_GATEWAY_AUTH_ISSUER_KIND && entry.issuer.generation !== params.requiredSharedGatewaySessionGeneration) return {
			ok: false,
			reason: "issuer-generation-stale"
		};
		if (!entry.issuer && params.requiredSharedGatewaySessionGeneration !== void 0 && isBrowserRelatedPairedDevice(device)) return {
			ok: false,
			reason: "legacy-browser-token"
		};
		const approvedScopes = resolveApprovedDeviceScopeBaseline(device);
		if (!scopesWithinApprovedDeviceBaseline({
			role,
			scopes: entry.scopes,
			approvedScopes
		})) return {
			ok: false,
			reason: "scope-mismatch"
		};
		if (!roleScopesAllow({
			role,
			requestedScopes: normalizeDeviceAuthScopes(params.scopes),
			allowedScopes: entry.scopes
		})) return {
			ok: false,
			reason: "scope-mismatch"
		};
		const now = Date.now();
		entry.lastUsedAtMs = now;
		device.tokens ??= {};
		device.tokens[role] = entry;
		device.lastSeenAtMs = now;
		device.lastSeenReason = "device-token-auth";
		state.pairedByDeviceId[device.deviceId] = device;
		persistDevicePairingStoreState(state, params.baseDir, "paired");
		return entry.issuer ? {
			ok: true,
			issuer: entry.issuer
		} : { ok: true };
	});
}
/** Return a reusable token for a role or issue one within the approved scope baseline. */
async function ensureDeviceToken(params) {
	return await withLock(async () => {
		const state = await loadState(params.baseDir);
		const requestedScopes = normalizeDeviceAuthScopes(params.scopes);
		const context = resolveDeviceTokenUpdateContext({
			state,
			deviceId: params.deviceId,
			role: params.role
		});
		if (!context) return null;
		const { device, role, tokens, existing } = context;
		const previousNodeGeneration = resolveNodePairingGeneration(device);
		const approvedScopes = resolveApprovedDeviceScopeBaseline(device);
		if (!scopesWithinApprovedDeviceBaseline({
			role,
			scopes: requestedScopes,
			approvedScopes
		})) return null;
		if (existing && !existing.revokedAtMs) {
			const existingWithinApproved = scopesWithinApprovedDeviceBaseline({
				role,
				scopes: existing.scopes,
				approvedScopes
			});
			const issuerAllowsReuse = deviceTokenIssuerMatches(existing, params.issuer);
			if (existingWithinApproved && issuerAllowsReuse && roleScopesAllow({
				role,
				requestedScopes,
				allowedScopes: existing.scopes
			})) return existing;
		}
		const now = Date.now();
		const next = buildDeviceAuthToken({
			role,
			scopes: requestedScopes,
			issuer: params.issuer,
			existing,
			now,
			rotatedAtMs: existing ? now : void 0
		});
		tokens[role] = next;
		device.tokens = tokens;
		clearNodePairingGenerationBins(device, previousNodeGeneration);
		state.pairedByDeviceId[device.deviceId] = device;
		persistDevicePairingStoreState(state, params.baseDir, "paired");
		return next;
	});
}
function resolveDeviceTokenUpdateContext(params) {
	const device = getPairedDeviceFromState(params.state, params.deviceId);
	if (!device) return null;
	const role = normalizeRole(params.role);
	if (!role) return null;
	if (!listApprovedPairedDeviceRoles(device).includes(role)) return null;
	const tokens = cloneDeviceTokens(device);
	return {
		device,
		role,
		tokens,
		existing: tokens[role]
	};
}
/** Rotate a role token inside the device's approved scope baseline. */
async function rotateDeviceToken(params) {
	return await withLock(async () => {
		const state = await loadState(params.baseDir);
		const context = resolveDeviceTokenUpdateContext({
			state,
			deviceId: params.deviceId,
			role: params.role
		});
		if (!context) return {
			ok: false,
			reason: "unknown-device-or-role"
		};
		const { device, role, tokens, existing } = context;
		const previousNodeGeneration = resolveNodePairingGeneration(device);
		const requestedScopes = normalizeDeviceAuthScopes(params.scopes ?? existing?.scopes ?? device.scopes);
		const approvedScopes = resolveApprovedDeviceScopeBaseline(device);
		if (!approvedScopes) return {
			ok: false,
			reason: "missing-approved-scope-baseline"
		};
		if (!scopesWithinApprovedDeviceBaseline({
			role,
			scopes: requestedScopes,
			approvedScopes
		})) return {
			ok: false,
			reason: "scope-outside-approved-baseline"
		};
		if (params.callerScopes) {
			const missingScope = resolveMissingRequestedScope({
				role,
				requestedScopes,
				allowedScopes: params.callerScopes
			});
			if (missingScope) return {
				ok: false,
				reason: "caller-missing-scope",
				scope: missingScope
			};
		}
		const now = Date.now();
		const next = buildDeviceAuthToken({
			role,
			scopes: requestedScopes,
			existing,
			preserveExistingIssuer: true,
			now,
			rotatedAtMs: now
		});
		tokens[role] = next;
		device.tokens = tokens;
		clearNodePairingGenerationBins(device, previousNodeGeneration);
		state.pairedByDeviceId[device.deviceId] = device;
		persistDevicePairingStoreState(state, params.baseDir, "paired");
		return {
			ok: true,
			entry: next
		};
	});
}
/** Revoke one active role token after optional caller-scope authorization. */
async function revokeDeviceToken(params) {
	return await withLock(async () => {
		const state = await loadState(params.baseDir);
		const context = resolveDeviceTokenUpdateContext({
			state,
			deviceId: params.deviceId,
			role: params.role
		});
		if (!context || !context.existing) return {
			ok: false,
			reason: "unknown-device-or-role"
		};
		const { device, role, tokens, existing } = context;
		const previousNodeGeneration = resolveNodePairingGeneration(device);
		const targetScopes = normalizeDeviceAuthScopes(Array.isArray(existing.scopes) ? existing.scopes : device.scopes);
		if (params.callerScopes) {
			const missingScope = resolveMissingRequestedScope({
				role,
				requestedScopes: targetScopes,
				allowedScopes: params.callerScopes
			});
			if (missingScope) return {
				ok: false,
				reason: "caller-missing-scope",
				scope: missingScope
			};
		}
		const entry = {
			...existing,
			revokedAtMs: Date.now()
		};
		tokens[role] = entry;
		device.tokens = tokens;
		clearNodePairingGenerationBins(device, previousNodeGeneration);
		state.pairedByDeviceId[device.deviceId] = device;
		persistDevicePairingStoreState(state, params.baseDir, "paired");
		return {
			ok: true,
			entry
		};
	});
}
//#endregion
export { rotateDeviceToken as C, verifyDeviceToken as D, updatePairedDevicePresence as E, withPairedDeviceRecords as O, revokeDeviceToken as S, updatePairedDeviceMetadata as T, removePairedDeviceRole as _, ensureDeviceToken as a, resolveNodePairingGeneration as b, getPendingDevicePairing as c, listDevicePairing as d, listEffectivePairedDeviceRoles as f, removePairedDevice as g, rejectDevicePairing as h, clearNodePairingGenerationBins as i, hasEffectivePairedDeviceRole as l, pruneSupersededSilentPairedDevices as m, approveControlUiDeviceAuthMigrationPairing as n, formatDevicePairingForbiddenMessage as o, onEffectiveOperatorDevicePaired as p, approveDevicePairing as r, getPairedDevice as s, approveBootstrapDevicePairing as t, listApprovedPairedDeviceRoles as u, requestDevicePairing as v, summarizeDeviceTokens as w, resolveNodePairingState as x, resolveEffectiveOperatorDeviceIdentity as y };
