import { l as isOperatorScope } from "./operator-scopes-Dw7Gu2cA.js";
import { t as ConnectErrorDetailCodes } from "./connect-error-details-Do3cAiyu.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { n as normalizeDeviceAuthScopes } from "./device-auth-C-STNejO.js";
import { r as roleScopesAllow } from "./operator-scope-compat-C7_b0yme.js";
import { Ct as validateDevicePairRemoveParams, Dt as validateDeviceTokenRevokeParams, Gn as validateScopeUpgradeRequest, Kn as validateScopeUpgradeWait, Ot as validateDeviceTokenRotateParams, St as validateDevicePairRejectParams, bt as validateDevicePairApproveParams, wt as validateDevicePairRenameParams, xt as validateDevicePairListParams } from "./src-BlUKtAtD.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
import { C as rotateDeviceToken, S as revokeDeviceToken, T as updatePairedDeviceMetadata, c as getPendingDevicePairing, d as listDevicePairing, g as removePairedDevice, h as rejectDevicePairing, n as approveControlUiDeviceAuthMigrationPairing, o as formatDevicePairingForbiddenMessage, r as approveDevicePairing, s as getPairedDevice, v as requestDevicePairing, w as summarizeDeviceTokens } from "./device-pairing-CkbDK__R.js";
import { t as assertValidParams } from "./validation-CsGeElrb.js";
import { n as clearRemovedNodeRuntimeState, s as reconcileRevokedDeviceWorker } from "./node-runtime-state-tTOstbUl.js";
import { a as invalidateNodeWakeState } from "./node-wake-state-CLsta4Jn.js";
import { a as requestsNonOperatorDeviceRole, i as pairedDeviceHasNonOperatorRole, n as deniesCrossDeviceManagement, o as resolveDeviceManagementAuthz, r as deniesDeviceTokenRoleManagement, s as resolveDeviceSessionAuthz, t as emitDeviceManagementSecurityEvent } from "./device-management-security-ZHPNgMpw.js";
//#region src/gateway/server-methods/device-scope-upgrade.ts
const DEVICE_REQUIRED_MESSAGE = "device scope upgrade requires a paired browser identity; reopen the Control UI over HTTPS or localhost, then retry";
function readUpgradeOwner(client) {
	const deviceId = client?.connect.device?.id.trim();
	const publicKey = client?.connect.device?.publicKey.trim();
	return client?.connId && client.connect.role === "operator" && deviceId && publicKey ? {
		deviceId,
		publicKey
	} : null;
}
function respondDeviceRequired(respond) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, DEVICE_REQUIRED_MESSAGE, { details: {
		code: ConnectErrorDetailCodes.DEVICE_IDENTITY_REQUIRED,
		recommendedNextStep: "reopen_control_ui_securely"
	} }));
}
/** Live operator scope-upgrade request and identity-bound wait handlers. */
const scopeUpgradeHandlers = {
	"device.scopes.requestUpgrade": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateScopeUpgradeRequest, "device.scopes.requestUpgrade", respond)) return;
		const owner = readUpgradeOwner(client);
		if (!owner) {
			respondDeviceRequired(respond);
			return;
		}
		const paired = await getPairedDevice(owner.deviceId);
		if (!paired || paired.publicKey !== owner.publicKey) {
			respondDeviceRequired(respond);
			return;
		}
		const requestedScopes = normalizeDeviceAuthScopes(params.scopes);
		if (!requestedScopes.every(isOperatorScope)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "requested scopes contain an unknown operator scope"));
			return;
		}
		const currentScopes = Array.isArray(client?.connect.scopes) ? client.connect.scopes : [];
		if (!roleScopesAllow({
			role: "operator",
			requestedScopes: currentScopes,
			allowedScopes: requestedScopes
		})) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "requested scopes must include the connection's current scopes"));
			return;
		}
		const pairing = await requestDevicePairing({
			deviceId: owner.deviceId,
			publicKey: owner.publicKey,
			displayName: client?.connect.client.displayName,
			platform: client?.connect.client.platform,
			deviceFamily: client?.connect.client.deviceFamily,
			clientId: client?.connect.client.id,
			clientMode: client?.connect.client.mode,
			browserOrigin: paired.browserOrigin,
			role: "operator",
			scopes: requestedScopes,
			remoteIp: client?.clientIp,
			silent: false
		});
		const coordinator = context.scopeUpgradeCoordinator;
		if (!coordinator?.register({
			requestId: pairing.request.requestId,
			expiresAtMs: pairing.expiresAtMs,
			owner,
			requestedScopes,
			initialToken: paired.tokens?.operator?.token,
			initialApprovedAtMs: paired.approvedAtMs
		})) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "device scope upgrade is temporarily unavailable", { retryable: true }));
			return;
		}
		const resolvedAt = Date.now();
		for (const superseded of pairing.superseded ?? []) {
			coordinator.notify(superseded.requestId, "rejected");
			context.broadcast("device.pair.resolved", {
				requestId: superseded.requestId,
				deviceId: superseded.deviceId,
				decision: "rejected",
				ts: resolvedAt
			}, { dropIfSlow: true });
		}
		if (pairing.created) context.broadcast("device.pair.requested", pairing.request, { dropIfSlow: true });
		context.logGateway.warn(`security audit: live device scope upgrade requested device=${owner.deviceId} scopesFrom=${currentScopes.join(",")} scopesTo=${requestedScopes.join(",")}`);
		respond(true, { requestId: pairing.request.requestId }, void 0);
	},
	"device.scopes.waitUpgrade": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateScopeUpgradeWait, "device.scopes.waitUpgrade", respond)) return;
		const owner = readUpgradeOwner(client);
		if (!owner) {
			respondDeviceRequired(respond);
			return;
		}
		const requestId = params.requestId;
		const result = await context.scopeUpgradeCoordinator?.wait(requestId, owner);
		if (!result) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "scope upgrade expired or not found"));
			return;
		}
		respond(true, result, void 0);
	}
};
//#endregion
//#region src/gateway/server-methods/devices.ts
const DEVICE_TOKEN_ROTATION_DENIED_MESSAGE = "device token rotation denied";
const DEVICE_TOKEN_REVOCATION_DENIED_MESSAGE = "device token revocation denied";
const DEVICE_PAIR_APPROVAL_DENIED_MESSAGE = "device pairing approval denied";
const DEVICE_PAIR_REJECTION_DENIED_MESSAGE = "device pairing rejection denied";
function redactPairedDevice(device, opts) {
	const { tokens, approvedScopes: _approvedScopes, ...rest } = device;
	return {
		...rest,
		...opts?.connected !== void 0 ? { connected: opts.connected } : {},
		tokens: summarizeDeviceTokens(tokens)
	};
}
function logDeviceTokenRotationDenied(params) {
	const suffix = params.scope ? ` scope=${params.scope}` : "";
	params.log.warn(`device token rotation denied device=${params.deviceId} role=${params.role} reason=${params.reason}${suffix}`);
}
function logDeviceTokenRevocationDenied(params) {
	const suffix = params.scope ? ` scope=${params.scope}` : "";
	params.log.warn(`device token revocation denied device=${params.deviceId} role=${params.role} reason=${params.reason}${suffix}`);
}
function shouldReturnRotatedDeviceToken(authz) {
	return Boolean(authz.callerDeviceId && authz.callerDeviceId === authz.normalizedTargetDeviceId);
}
function emitDeviceSecurityEvent(params) {
	emitDeviceManagementSecurityEvent(params);
}
function emitDevicePairingDeniedSecurityEvent(params) {
	emitDeviceSecurityEvent({
		action: "device.pairing.denied",
		outcome: "denied",
		severity: params.severity ?? "medium",
		authz: params.authz,
		targetDeviceId: params.targetDeviceId,
		policyId: "gateway.device-pairing",
		decision: "deny",
		controlId: params.controlId,
		reason: params.reason
	});
}
function emitDevicePairingLifecycleSecurityEvent(params) {
	emitDeviceSecurityEvent({
		action: params.action,
		outcome: "success",
		severity: params.severity,
		authz: params.authz,
		targetDeviceId: params.targetDeviceId,
		policyId: "gateway.device-pairing",
		decision: "allow",
		controlId: params.controlId,
		attributes: params.attributes
	});
}
function emitDeviceTokenDeniedSecurityEvent(params) {
	emitDeviceSecurityEvent({
		action: params.action,
		outcome: "denied",
		severity: "medium",
		authz: params.authz,
		targetDeviceId: params.targetDeviceId,
		policyId: "gateway.device-token",
		decision: "deny",
		controlId: params.controlId,
		reason: params.reason,
		attributes: { role: params.role.trim() }
	});
}
function emitDeviceTokenLifecycleSecurityEvent(params) {
	emitDeviceSecurityEvent({
		action: params.action,
		outcome: "success",
		severity: params.severity,
		authz: params.authz,
		targetDeviceId: params.targetDeviceId,
		policyId: "gateway.device-token",
		decision: "allow",
		controlId: params.controlId,
		attributes: {
			role: params.role,
			...params.scopeCount !== void 0 ? { scope_count: params.scopeCount } : {}
		}
	});
}
/** Gateway request handlers for device pair approval, removal, token rotation, and revocation. */
const deviceHandlers = {
	...scopeUpgradeHandlers,
	"device.pair.list": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateDevicePairListParams, "device.pair.list", respond)) return;
		const list = await listDevicePairing();
		const authz = resolveDeviceSessionAuthz(client);
		let visibleList = list;
		if (authz.isDeviceAuthMigrationSession && !authz.callerDeviceId) visibleList = {
			pending: [],
			paired: []
		};
		else if (authz.callerDeviceId && !authz.isAdminCaller) visibleList = {
			pending: list.pending.filter((request) => request.deviceId.trim() === authz.callerDeviceId),
			paired: list.paired.filter((device) => device.deviceId.trim() === authz.callerDeviceId)
		};
		respond(true, {
			pending: visibleList.pending,
			paired: visibleList.paired.map((device) => redactPairedDevice(device, { connected: context.hasConnectedClientsForDevice?.(device.deviceId.trim()) ?? false }))
		}, void 0);
	},
	"device.pair.approve": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateDevicePairApproveParams, "device.pair.approve", respond)) return;
		const { requestId } = params;
		const authz = resolveDeviceSessionAuthz(client);
		let migrationApprovalScopes;
		if (!authz.isAdminCaller) {
			if (authz.isDeviceAuthMigrationSession && !authz.isDeviceAuthMigrationCaller) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, DEVICE_PAIR_APPROVAL_DENIED_MESSAGE));
				return;
			}
			const pending = await getPendingDevicePairing(requestId);
			if (!pending) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, DEVICE_PAIR_APPROVAL_DENIED_MESSAGE));
				return;
			}
			if (authz.callerDeviceId && pending.deviceId.trim() !== authz.callerDeviceId) {
				context.logGateway.warn(`device pairing approval denied request=${requestId} reason=device-ownership-mismatch`);
				emitDevicePairingDeniedSecurityEvent({
					authz,
					targetDeviceId: pending.deviceId,
					controlId: "device.pair.approve",
					reason: "device-ownership-mismatch"
				});
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, DEVICE_PAIR_APPROVAL_DENIED_MESSAGE));
				return;
			}
			if (requestsNonOperatorDeviceRole(pending)) {
				context.logGateway.warn(`device pairing approval denied request=${requestId} reason=role-management-requires-admin`);
				emitDevicePairingDeniedSecurityEvent({
					authz,
					targetDeviceId: pending.deviceId,
					controlId: "device.pair.approve",
					reason: "role-management-requires-admin"
				});
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, DEVICE_PAIR_APPROVAL_DENIED_MESSAGE));
				return;
			}
			if (authz.isDeviceAuthMigrationCaller) migrationApprovalScopes = pending.scopes ?? [];
		}
		const migrationDeviceId = authz.isDeviceAuthMigrationCaller ? authz.callerDeviceId : null;
		if (authz.isDeviceAuthMigrationCaller && (!migrationDeviceId || context.claimControlUiDeviceAuthMigration?.(migrationDeviceId) !== true)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, DEVICE_PAIR_APPROVAL_DENIED_MESSAGE));
			return;
		}
		const releaseMigrationClaim = () => {
			if (migrationDeviceId) context.releaseControlUiDeviceAuthMigrationClaim?.(migrationDeviceId);
		};
		let approved;
		try {
			const callerScopes = migrationApprovalScopes ?? authz.callerScopes;
			approved = authz.isDeviceAuthMigrationCaller ? await approveControlUiDeviceAuthMigrationPairing(requestId, { callerScopes }) : await approveDevicePairing(requestId, { callerScopes });
		} catch (error) {
			releaseMigrationClaim();
			throw error;
		}
		if (!approved) {
			releaseMigrationClaim();
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown requestId"));
			return;
		}
		if (approved.status === "forbidden") {
			releaseMigrationClaim();
			emitDevicePairingDeniedSecurityEvent({
				authz,
				controlId: "device.pair.approve",
				reason: approved.reason
			});
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, formatDevicePairingForbiddenMessage(approved)));
			return;
		}
		const normalizedDeviceId = approved.device.deviceId.trim();
		context.scopeUpgradeCoordinator?.notify(requestId, "approved");
		if (approved.nodePairingGenerationChanged) {
			invalidateNodeWakeState(normalizedDeviceId);
			context.invalidateClientsForDevice?.(normalizedDeviceId, {
				role: "node",
				reason: "device-pairing-reapproved"
			});
		}
		context.logGateway.info(`device pairing approved device=${approved.device.deviceId} role=${approved.device.role ?? "unknown"}`);
		emitDevicePairingLifecycleSecurityEvent({
			action: "device.pairing.approved",
			severity: "low",
			authz,
			targetDeviceId: approved.device.deviceId,
			controlId: "device.pair.approve",
			attributes: {
				role_count: approved.device.roles?.length ?? (approved.device.role ? 1 : 0),
				scope_count: approved.device.approvedScopes?.length ?? approved.device.scopes?.length ?? 0
			}
		});
		context.broadcast("device.pair.resolved", {
			requestId,
			deviceId: approved.device.deviceId,
			decision: "approved",
			ts: Date.now()
		}, { dropIfSlow: true });
		respond(true, {
			requestId,
			device: redactPairedDevice(approved.device)
		}, void 0);
		if (approved.nodePairingGenerationChanged) queueMicrotask(() => {
			context.disconnectClientsForDevice?.(normalizedDeviceId, { role: "node" });
		});
	},
	"device.pair.reject": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateDevicePairRejectParams, "device.pair.reject", respond)) return;
		const { requestId } = params;
		const authz = resolveDeviceSessionAuthz(client);
		if (authz.isDeviceAuthMigrationSession && !authz.isDeviceAuthMigrationCaller) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, DEVICE_PAIR_REJECTION_DENIED_MESSAGE));
			return;
		}
		if (authz.callerDeviceId && !authz.isAdminCaller) {
			const pending = await getPendingDevicePairing(requestId);
			if (!pending) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, DEVICE_PAIR_REJECTION_DENIED_MESSAGE));
				return;
			}
			if (pending.deviceId.trim() !== authz.callerDeviceId) {
				context.logGateway.warn(`device pairing rejection denied request=${requestId} reason=device-ownership-mismatch`);
				emitDevicePairingDeniedSecurityEvent({
					authz,
					targetDeviceId: pending.deviceId,
					controlId: "device.pair.reject",
					reason: "device-ownership-mismatch"
				});
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, DEVICE_PAIR_REJECTION_DENIED_MESSAGE));
				return;
			}
		}
		const rejected = await rejectDevicePairing(requestId);
		if (!rejected) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown requestId"));
			return;
		}
		context.scopeUpgradeCoordinator?.notify(requestId, "rejected");
		emitDevicePairingLifecycleSecurityEvent({
			action: "device.pairing.rejected",
			authz,
			targetDeviceId: rejected.deviceId,
			controlId: "device.pair.reject",
			severity: "low"
		});
		context.broadcast("device.pair.resolved", {
			requestId,
			deviceId: rejected.deviceId,
			decision: "rejected",
			ts: Date.now()
		}, { dropIfSlow: true });
		respond(true, rejected, void 0);
	},
	"device.pair.remove": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateDevicePairRemoveParams, "device.pair.remove", respond)) return;
		const { deviceId } = params;
		const authz = resolveDeviceManagementAuthz(client, deviceId);
		if (deniesCrossDeviceManagement(authz)) {
			context.logGateway.warn(`device pairing removal denied device=${deviceId} reason=device-ownership-mismatch`);
			emitDevicePairingDeniedSecurityEvent({
				authz,
				targetDeviceId: deviceId,
				controlId: "device.pair.remove",
				reason: "device-ownership-mismatch"
			});
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "device pairing removal denied"));
			return;
		}
		if (authz.callerDeviceId && !authz.isAdminCaller) {
			const paired = await getPairedDevice(authz.normalizedTargetDeviceId);
			if (paired && pairedDeviceHasNonOperatorRole(paired)) {
				context.logGateway.warn(`device pairing removal denied device=${deviceId} reason=role-management-requires-admin`);
				emitDevicePairingDeniedSecurityEvent({
					authz,
					targetDeviceId: deviceId,
					controlId: "device.pair.remove",
					reason: "role-management-requires-admin"
				});
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "device pairing removal denied"));
				return;
			}
		}
		const removed = await removePairedDevice(deviceId);
		if (!removed) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown deviceId"));
			return;
		}
		clearRemovedNodeRuntimeState({
			nodeId: removed.deviceId,
			context
		});
		context.invalidateClientsForDevice?.(removed.deviceId, { reason: "device-pair-removed" });
		await reconcileRevokedDeviceWorker(context, removed.deviceId);
		context.logGateway.info(`device pairing removed device=${removed.deviceId}`);
		emitDevicePairingLifecycleSecurityEvent({
			action: "device.pairing.removed",
			severity: "medium",
			authz,
			targetDeviceId: removed.deviceId,
			controlId: "device.pair.remove"
		});
		respond(true, removed, void 0);
		queueMicrotask(() => {
			context.disconnectClientsForDevice?.(removed.deviceId);
		});
	},
	"device.pair.rename": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateDevicePairRenameParams, "device.pair.rename", respond)) return;
		const { deviceId, label } = params;
		const trimmed = label.trim();
		if (!trimmed) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "label required"));
			return;
		}
		const authz = resolveDeviceManagementAuthz(client, deviceId);
		if (deniesCrossDeviceManagement(authz)) {
			context.logGateway.warn(`device pairing rename denied device=${deviceId} reason=device-ownership-mismatch`);
			emitDevicePairingDeniedSecurityEvent({
				authz,
				targetDeviceId: deviceId,
				controlId: "device.pair.rename",
				reason: "device-ownership-mismatch"
			});
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "device pairing rename denied"));
			return;
		}
		if (authz.callerDeviceId && !authz.isAdminCaller) {
			const paired = await getPairedDevice(authz.normalizedTargetDeviceId);
			if (paired && pairedDeviceHasNonOperatorRole(paired)) {
				context.logGateway.warn(`device pairing rename denied device=${deviceId} reason=role-management-requires-admin`);
				emitDevicePairingDeniedSecurityEvent({
					authz,
					targetDeviceId: deviceId,
					controlId: "device.pair.rename",
					reason: "role-management-requires-admin"
				});
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "device pairing rename denied"));
				return;
			}
		}
		if (!await updatePairedDeviceMetadata(deviceId, { operatorLabel: trimmed })) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown deviceId"));
			return;
		}
		context.logGateway.info(`device pairing renamed device=${deviceId} label=${trimmed}`);
		emitDevicePairingLifecycleSecurityEvent({
			action: "device.pairing.renamed",
			severity: "low",
			authz,
			targetDeviceId: deviceId,
			controlId: "device.pair.rename"
		});
		respond(true, {
			deviceId,
			label: trimmed
		}, void 0);
	},
	"device.token.rotate": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateDeviceTokenRotateParams, "device.token.rotate", respond)) return;
		const { deviceId, role, scopes } = params;
		const authz = resolveDeviceManagementAuthz(client, deviceId);
		if (deniesCrossDeviceManagement(authz)) {
			logDeviceTokenRotationDenied({
				log: context.logGateway,
				deviceId,
				role,
				reason: "device-ownership-mismatch"
			});
			emitDeviceTokenDeniedSecurityEvent({
				action: "device.token.rotation_denied",
				authz,
				targetDeviceId: deviceId,
				controlId: "device.token.rotate",
				reason: "device-ownership-mismatch",
				role
			});
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, DEVICE_TOKEN_ROTATION_DENIED_MESSAGE));
			return;
		}
		if (deniesDeviceTokenRoleManagement(authz, role)) {
			logDeviceTokenRotationDenied({
				log: context.logGateway,
				deviceId,
				role,
				reason: "role-management-requires-admin"
			});
			emitDeviceTokenDeniedSecurityEvent({
				action: "device.token.rotation_denied",
				authz,
				targetDeviceId: deviceId,
				controlId: "device.token.rotate",
				reason: "role-management-requires-admin",
				role
			});
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, DEVICE_TOKEN_ROTATION_DENIED_MESSAGE));
			return;
		}
		const rotated = await rotateDeviceToken({
			deviceId,
			role,
			scopes,
			callerScopes: authz.callerScopes
		});
		if (!rotated.ok) {
			logDeviceTokenRotationDenied({
				log: context.logGateway,
				deviceId,
				role,
				reason: rotated.reason,
				scope: rotated.scope
			});
			emitDeviceTokenDeniedSecurityEvent({
				action: "device.token.rotation_denied",
				authz,
				targetDeviceId: deviceId,
				controlId: "device.token.rotate",
				reason: rotated.reason,
				role
			});
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, DEVICE_TOKEN_ROTATION_DENIED_MESSAGE));
			return;
		}
		const entry = rotated.entry;
		const normalizedDeviceId = deviceId.trim();
		context.logGateway.info(`device token rotated device=${deviceId} role=${entry.role} scopes=${entry.scopes.join(",")}`);
		emitDeviceTokenLifecycleSecurityEvent({
			action: "device.token.rotated",
			severity: "medium",
			authz,
			targetDeviceId: deviceId,
			controlId: "device.token.rotate",
			role: entry.role,
			scopeCount: entry.scopes.length
		});
		if (entry.role === "node") invalidateNodeWakeState(normalizedDeviceId);
		context.invalidateClientsForDevice?.(normalizedDeviceId, {
			role: entry.role,
			reason: "device-token-rotated"
		});
		const deliversTokenInBand = shouldReturnRotatedDeviceToken(authz);
		respond(true, {
			deviceId,
			role: entry.role,
			...deliversTokenInBand ? { token: entry.token } : {},
			scopes: entry.scopes,
			rotatedAtMs: entry.rotatedAtMs ?? entry.createdAtMs,
			tokenDelivery: deliversTokenInBand ? "in-band" : "withheld-cross-device"
		}, void 0);
		queueMicrotask(() => {
			context.disconnectClientsForDevice?.(normalizedDeviceId, { role: entry.role });
		});
	},
	"device.token.revoke": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateDeviceTokenRevokeParams, "device.token.revoke", respond)) return;
		const { deviceId, role } = params;
		const authz = resolveDeviceManagementAuthz(client, deviceId);
		if (deniesCrossDeviceManagement(authz)) {
			context.logGateway.warn(`device token revocation denied device=${deviceId} role=${role} reason=device-ownership-mismatch`);
			emitDeviceTokenDeniedSecurityEvent({
				action: "device.token.revocation_denied",
				authz,
				targetDeviceId: deviceId,
				controlId: "device.token.revoke",
				reason: "device-ownership-mismatch",
				role
			});
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, DEVICE_TOKEN_REVOCATION_DENIED_MESSAGE));
			return;
		}
		if (deniesDeviceTokenRoleManagement(authz, role)) {
			logDeviceTokenRevocationDenied({
				log: context.logGateway,
				deviceId,
				role,
				reason: "role-management-requires-admin"
			});
			emitDeviceTokenDeniedSecurityEvent({
				action: "device.token.revocation_denied",
				authz,
				targetDeviceId: deviceId,
				controlId: "device.token.revoke",
				reason: "role-management-requires-admin",
				role
			});
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, DEVICE_TOKEN_REVOCATION_DENIED_MESSAGE));
			return;
		}
		const revoked = await revokeDeviceToken({
			deviceId,
			role,
			callerScopes: authz.callerScopes
		});
		if (!revoked.ok) {
			logDeviceTokenRevocationDenied({
				log: context.logGateway,
				deviceId,
				role,
				reason: revoked.reason,
				scope: revoked.scope
			});
			emitDeviceTokenDeniedSecurityEvent({
				action: "device.token.revocation_denied",
				authz,
				targetDeviceId: deviceId,
				controlId: "device.token.revoke",
				reason: revoked.reason,
				role
			});
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, DEVICE_TOKEN_REVOCATION_DENIED_MESSAGE));
			return;
		}
		const entry = revoked.entry;
		const normalizedDeviceId = deviceId.trim();
		context.logGateway.info(`device token revoked device=${normalizedDeviceId} role=${entry.role}`);
		emitDeviceTokenLifecycleSecurityEvent({
			action: "device.token.revoked",
			severity: "high",
			authz,
			targetDeviceId: normalizedDeviceId,
			controlId: "device.token.revoke",
			role: entry.role
		});
		if (entry.role === "node") invalidateNodeWakeState(normalizedDeviceId);
		context.invalidateClientsForDevice?.(normalizedDeviceId, {
			role: entry.role,
			reason: "device-token-revoked"
		});
		respond(true, {
			deviceId: normalizedDeviceId,
			role: entry.role,
			revokedAtMs: entry.revokedAtMs ?? Date.now()
		}, void 0);
		queueMicrotask(() => {
			context.disconnectClientsForDevice?.(normalizedDeviceId, { role: entry.role });
		});
	}
};
//#endregion
export { deviceHandlers };
