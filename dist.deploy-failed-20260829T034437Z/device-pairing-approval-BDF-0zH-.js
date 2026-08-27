import { n as normalizeDeviceAuthScopes } from "./device-auth-C-STNejO.js";
import { n as resolveScopeOutsideRequestedRoles, t as resolveMissingRequestedScope } from "./operator-scope-compat-C7_b0yme.js";
import { U as resolveDeviceProfileRoleScopes, W as resolveDeviceProfileScopes, g as generatePairingToken, w as persistDevicePairingStoreState } from "./device-bootstrap-DpkEF5MF.js";
import { A as withDevicePairingLock, C as mergeDevicePairingRoles, D as preserveDeviceRoleScopes, O as resolveRequestedDeviceRoles, S as loadDevicePairingState, g as resolveNodePairingGeneration, k as sameDevicePairingStringSet, o as invalidatePairedCardRendererCache, t as clearNodePairingGenerationState, w as mergeDevicePairingScopes } from "./device-pairing-Li5h-3GZ.js";
import { r as resolveRoleTokenScopes, t as createDeviceAuthToken } from "./device-pairing-tokens-D6HD-g7z.js";
//#region src/infra/device-pairing-approval.ts
const OPERATOR_ROLE = "operator";
const OPERATOR_SCOPE_PREFIX = "operator.";
/** Format a device-pairing authorization failure for CLI/API callers. */
function formatDevicePairingForbiddenMessage(result) {
	switch (result.reason) {
		case "caller-scopes-required": return `missing scope: ${result.scope ?? "callerScopes-required"}`;
		case "caller-missing-scope": return `missing scope: ${result.scope ?? "unknown"}`;
		case "scope-outside-requested-roles": return `invalid scope for requested roles: ${result.scope ?? "unknown"}`;
		case "bootstrap-role-not-allowed": return `bootstrap profile does not allow role: ${result.role ?? "unknown"}`;
		case "bootstrap-scope-not-allowed": return `bootstrap profile does not allow scope: ${result.scope ?? "unknown"}`;
	}
	throw new Error("Unsupported device pairing forbidden reason");
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
function commitApprovedDevicePairing(params) {
	const { state, requestId, device, baseDir } = params;
	const existing = state.pairedByDeviceId[device.deviceId];
	const previousNodeGeneration = resolveNodePairingGeneration(existing ?? null);
	const nextNodeGeneration = resolveNodePairingGeneration(device);
	const nodePairingGenerationChanged = Boolean(previousNodeGeneration && previousNodeGeneration.key !== nextNodeGeneration?.key);
	clearNodePairingGenerationState(device, previousNodeGeneration);
	const installationIdentityChanged = Boolean(existing && existing.publicKey !== device.publicKey);
	delete state.pendingById[requestId];
	state.pairedByDeviceId[device.deviceId] = device;
	persistDevicePairingStoreState(state, baseDir, "both", installationIdentityChanged ? { clearApnsNodeIds: [device.deviceId] } : void 0);
	invalidatePairedCardRendererCache();
	return {
		status: "approved",
		requestId,
		device,
		...nodePairingGenerationChanged ? { nodePairingGenerationChanged: true } : {}
	};
}
function resolveApprovedTokenScopes(params) {
	const pendingScopes = resolveRoleTokenScopes(params.role, params.pending.scopes);
	if (pendingScopes.length > 0) {
		const approvedBaseline = resolveRoleTokenScopes(params.role, params.existing?.approvedScopes ?? params.existing?.scopes);
		const requestedScopeDelta = params.existingToken && approvedBaseline.length > 0 ? pendingScopes.filter((scope) => !approvedBaseline.includes(scope)) : pendingScopes;
		if (requestedScopeDelta.length === 0 && params.existingToken) return resolveRoleTokenScopes(params.role, params.existingToken.scopes);
		return resolveRoleTokenScopes(params.role, mergeDevicePairingScopes(params.existingToken?.scopes, requestedScopeDelta));
	}
	return resolveRoleTokenScopes(params.role, params.existingToken?.scopes ?? params.approvedScopes ?? params.existing?.approvedScopes ?? params.existing?.scopes);
}
async function approveDevicePairing(requestId, optionsOrBaseDir, maybeBaseDir) {
	return await approveDevicePairingWithOptions(requestId, typeof optionsOrBaseDir === "string" || optionsOrBaseDir === void 0 ? void 0 : optionsOrBaseDir, typeof optionsOrBaseDir === "string" ? optionsOrBaseDir : maybeBaseDir);
}
async function approveDevicePairingWithOptions(requestId, options, baseDir) {
	return await withDevicePairingLock(async () => {
		const state = await loadDevicePairingState(baseDir);
		const pendingRecord = state.pendingById[requestId];
		if (!pendingRecord) return null;
		const autoApproveScopes = options?.autoApproveNewDeviceScopes;
		const requestedRoles = resolveRequestedDeviceRoles(pendingRecord);
		const knownDevice = state.pairedByDeviceId[pendingRecord.deviceId];
		const trustedProxySameKeyDevice = options?.approvedVia === "trusted-proxy" && knownDevice !== void 0 && knownDevice.publicKey === pendingRecord.publicKey;
		if (autoApproveScopes && ((pendingRecord.isRepair || knownDevice) && !trustedProxySameKeyDevice || !sameDevicePairingStringSet(requestedRoles, [OPERATOR_ROLE]))) return null;
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
		const roles = mergeDevicePairingRoles(existing?.roles, existing?.role, pending.roles, pending.role);
		const approvedScopes = mergeDevicePairingScopes(existing?.approvedScopes ?? existing?.scopes, pending.scopes);
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
				const callerRequiredScopes = mergeDevicePairingScopes(resolveRoleTokenScopes(roleForToken, pending.scopes), nextScopes) ?? nextScopes;
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
				token: generatePairingToken(),
				role: roleForToken,
				scopes: nextScopes,
				createdAtMs: existingToken?.createdAtMs ?? tokenNow,
				rotatedAtMs: existingToken ? tokenNow : void 0,
				revokedAtMs: void 0,
				lastUsedAtMs: existingToken?.lastUsedAtMs
			};
		}
		return commitApprovedDevicePairing({
			state,
			requestId,
			device: buildApprovedPairedDevice({
				pending,
				existing,
				roles,
				approvedScopes,
				tokens,
				now,
				approvedVia: options?.approvedVia ?? "owner",
				accessMetadata: options?.accessMetadata
			}),
			baseDir
		});
	});
}
async function approveBootstrapDevicePairing(requestId, bootstrapProfile, optionsOrBaseDir, maybeBaseDir) {
	const options = typeof optionsOrBaseDir === "string" || optionsOrBaseDir === void 0 ? void 0 : optionsOrBaseDir;
	const baseDir = typeof optionsOrBaseDir === "string" ? optionsOrBaseDir : maybeBaseDir;
	const approvedRoles = mergeDevicePairingRoles(bootstrapProfile.roles) ?? [];
	const approvedScopes = resolveDeviceProfileScopes(bootstrapProfile, approvedRoles);
	return await withDevicePairingLock(async () => {
		const state = await loadDevicePairingState(baseDir);
		const pending = state.pendingById[requestId];
		if (!pending) return null;
		const requestedRoles = resolveRequestedDeviceRoles(pending);
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
		const preservedExistingScopes = (mergeDevicePairingRoles(existing?.roles, existing?.role) ?? []).flatMap((existingRole) => grantedRoleSet.has(existingRole) ? [] : preserveDeviceRoleScopes(existingRole, existing?.approvedScopes ?? existing?.scopes));
		const roles = mergeDevicePairingRoles(existing?.roles, existing?.role, pending.roles, pending.role);
		const nextApprovedScopes = mergeDevicePairingScopes(preservedExistingScopes, grantedScopes);
		const tokens = existing?.tokens ? { ...existing.tokens } : {};
		for (const roleForToken of grantedRoles) {
			const existingToken = tokens[roleForToken];
			tokens[roleForToken] = createDeviceAuthToken({
				role: roleForToken,
				scopes: roleForToken === OPERATOR_ROLE ? resolveDeviceProfileRoleScopes(bootstrapProfile, roleForToken, grantedScopes) : [],
				existing: existingToken,
				now,
				...existingToken ? { rotatedAtMs: now } : {}
			});
		}
		return commitApprovedDevicePairing({
			state,
			requestId,
			device: buildApprovedPairedDevice({
				pending,
				existing,
				roles,
				approvedScopes: nextApprovedScopes,
				tokens,
				now,
				approvedVia: "bootstrap",
				accessMetadata: options?.accessMetadata
			}),
			baseDir
		});
	});
}
//#endregion
export { approveDevicePairing as n, formatDevicePairingForbiddenMessage as r, approveBootstrapDevicePairing as t };
