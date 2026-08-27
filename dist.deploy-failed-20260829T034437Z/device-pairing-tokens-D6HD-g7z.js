import { n as normalizeDeviceAuthScopes } from "./device-auth-C-STNejO.js";
import { r as roleScopesAllow, t as resolveMissingRequestedScope } from "./operator-scope-compat-C7_b0yme.js";
import { _ as verifyPairingToken, g as generatePairingToken, w as persistDevicePairingStoreState } from "./device-bootstrap-DpkEF5MF.js";
import { A as withDevicePairingLock, E as normalizeDevicePairingRole, S as loadDevicePairingState, T as normalizeDevicePairingId, g as resolveNodePairingGeneration, s as listApprovedPairedDeviceRoles, t as clearNodePairingGenerationState, x as cloneDevicePairingTokens } from "./device-pairing-Li5h-3GZ.js";
//#region src/infra/device-pairing-tokens.ts
const OPERATOR_SCOPE_PREFIX = "operator.";
const SHARED_GATEWAY_AUTH_ISSUER_KIND = "shared-gateway-auth";
const BROWSER_DEVICE_CLIENT_IDS = /* @__PURE__ */ new Set(["openclaw-control-ui", "webchat-ui"]);
const BROWSER_DEVICE_CLIENT_MODE = "webchat";
function getPairedDeviceFromState(state, deviceId) {
	return state.pairedByDeviceId[normalizeDevicePairingId(deviceId)] ?? null;
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
/** Build one freshly generated role token while preserving requested lifecycle fields. */
function createDeviceAuthToken(params) {
	return {
		token: generatePairingToken(),
		role: params.role,
		scopes: params.scopes,
		issuer: params.issuer ?? (params.preserveExistingIssuer ? params.existing?.issuer : void 0),
		createdAtMs: params.existing?.createdAtMs ?? params.now,
		rotatedAtMs: params.rotatedAtMs,
		revokedAtMs: void 0,
		lastUsedAtMs: params.existing?.lastUsedAtMs
	};
}
/** Select scopes owned by one device-token role. */
function resolveRoleTokenScopes(role, scopes) {
	const normalized = normalizeDeviceAuthScopes(scopes);
	if (role === "operator") return normalized.filter((scope) => scope.startsWith(OPERATOR_SCOPE_PREFIX));
	return normalized.filter((scope) => !scope.startsWith(OPERATOR_SCOPE_PREFIX));
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
	return await withDevicePairingLock(async () => {
		const state = await loadDevicePairingState(params.baseDir);
		const device = getPairedDeviceFromState(state, params.deviceId);
		if (!device) return {
			ok: false,
			reason: "device-not-paired"
		};
		const role = normalizeDevicePairingRole(params.role);
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
	return await withDevicePairingLock(async () => {
		const state = await loadDevicePairingState(params.baseDir);
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
		const next = createDeviceAuthToken({
			role,
			scopes: requestedScopes,
			issuer: params.issuer,
			existing,
			now,
			rotatedAtMs: existing ? now : void 0
		});
		tokens[role] = next;
		device.tokens = tokens;
		clearNodePairingGenerationState(device, previousNodeGeneration);
		state.pairedByDeviceId[device.deviceId] = device;
		persistDevicePairingStoreState(state, params.baseDir, "paired");
		return next;
	});
}
function resolveDeviceTokenUpdateContext(params) {
	const device = getPairedDeviceFromState(params.state, params.deviceId);
	if (!device) return null;
	const role = normalizeDevicePairingRole(params.role);
	if (!role) return null;
	if (!listApprovedPairedDeviceRoles(device).includes(role)) return null;
	const tokens = cloneDevicePairingTokens(device);
	return {
		device,
		role,
		tokens,
		existing: tokens[role]
	};
}
/** Rotate a role token inside the device's approved scope baseline. */
async function rotateDeviceToken(params) {
	return await withDevicePairingLock(async () => {
		const state = await loadDevicePairingState(params.baseDir);
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
		const next = createDeviceAuthToken({
			role,
			scopes: requestedScopes,
			existing,
			preserveExistingIssuer: true,
			now,
			rotatedAtMs: now
		});
		tokens[role] = next;
		device.tokens = tokens;
		clearNodePairingGenerationState(device, previousNodeGeneration);
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
	return await withDevicePairingLock(async () => {
		const state = await loadDevicePairingState(params.baseDir);
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
		clearNodePairingGenerationState(device, previousNodeGeneration);
		state.pairedByDeviceId[device.deviceId] = device;
		persistDevicePairingStoreState(state, params.baseDir, "paired");
		return {
			ok: true,
			entry
		};
	});
}
//#endregion
export { rotateDeviceToken as a, revokeDeviceToken as i, ensureDeviceToken as n, summarizeDeviceTokens as o, resolveRoleTokenScopes as r, verifyDeviceToken as s, createDeviceAuthToken as t };
