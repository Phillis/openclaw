import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { a as isLoopbackAddress, c as isPrivateOrLoopbackHost, o as isLoopbackHost, s as isPrivateOrLoopbackAddress, v as resolveHostName } from "./net-BRYQcUG8.js";
import { c as AUTH_RATE_LIMIT_SCOPE_SHARED_SECRET, i as AUTH_RATE_LIMIT_SCOPE_DEVICE_TOKEN, t as AUTH_RATE_LIMIT_SCOPE_BOOTSTRAP_TOKEN } from "./auth-rate-limit-Bw_B6Pm2.js";
import { t as withSerializedRateLimitAttempt } from "./rate-limit-attempt-serialization-DPdAzsUS.js";
import { i as authorizeWsControlUiGatewayConnect, n as authorizeHttpGatewayConnect } from "./auth-CCT61CRz.js";
import { n as GATEWAY_CLIENT_IDS, r as GATEWAY_CLIENT_MODES } from "./client-info-yubNQC1L.js";
import { c as verifyDeviceSignature } from "./device-identity-D1g4SzdB.js";
import { n as buildDeviceAuthPayloadV3, t as buildDeviceAuthPayload } from "./device-auth-na9vtJo1.js";
import { h as parseComputerUseCapabilityDescriptor } from "./computer-use-contract-Din_sL74.js";
import { c as normalizeDeclaredNodeCommands, u as resolveNodePairingCommandAllowlist } from "./node-command-policy-Cru_no7H.js";
import { n as confirmDevicePairSetupCompletionDelivery, r as consumeDeviceBootstrapTokenWithSetupCompletion } from "./device-bootstrap-ftwhmc0m.js";
import { h as normalizeNodeApprovalSurfaceList } from "./device-pairing-node-koBZUtkr.js";
//#region src/gateway/server/ws-connection/auth-context.ts
function mapDeviceTokenAuthFailureReason(params) {
	if (params.tokenCheckReason === "scope-mismatch" || params.tokenCheckReason === "scope_mismatch") return "scope_mismatch";
	if (params.candidateSource === "explicit-device-token") return "device_token_mismatch";
	return params.fallbackReason ?? "device_token_mismatch";
}
function resolveSharedConnectAuth(connectAuth) {
	const token = normalizeOptionalString(connectAuth?.token);
	const password = normalizeOptionalString(connectAuth?.password);
	if (!token && !password) return;
	return {
		token,
		password
	};
}
function resolveDeviceTokenCandidate(connectAuth) {
	const explicitDeviceToken = normalizeOptionalString(connectAuth?.deviceToken);
	if (explicitDeviceToken) return {
		token: explicitDeviceToken,
		source: "explicit-device-token"
	};
	const fallbackToken = normalizeOptionalString(connectAuth?.token);
	if (!fallbackToken) return {};
	return {
		token: fallbackToken,
		source: "shared-token-fallback"
	};
}
async function resolveConnectAuthState(params) {
	const sharedConnectAuth = resolveSharedConnectAuth(params.connectAuth);
	const sharedAuthProvided = Boolean(sharedConnectAuth);
	const bootstrapTokenCandidate = params.hasDeviceIdentity ? normalizeOptionalString(params.connectAuth?.bootstrapToken) : void 0;
	const { token: deviceTokenCandidate, source: deviceTokenCandidateSource } = params.hasDeviceIdentity ? resolveDeviceTokenCandidate(params.connectAuth) : {};
	const authResult = await authorizeWsControlUiGatewayConnect({
		auth: params.resolvedAuth,
		connectAuth: sharedConnectAuth,
		req: params.req,
		trustedProxies: params.trustedProxies,
		allowRealIpFallback: params.allowRealIpFallback,
		rateLimiter: sharedAuthProvided ? params.rateLimiter : void 0,
		clientIp: params.clientIp,
		rateLimitScope: AUTH_RATE_LIMIT_SCOPE_SHARED_SECRET
	});
	const sharedAuthResult = sharedConnectAuth && await authorizeHttpGatewayConnect({
		auth: {
			...params.resolvedAuth,
			allowTailscale: false
		},
		connectAuth: sharedConnectAuth,
		req: params.req,
		trustedProxies: params.trustedProxies,
		allowRealIpFallback: params.allowRealIpFallback,
		rateLimitScope: "shared-secret"
	});
	const sharedAuthOk = sharedAuthResult?.ok === true && (sharedAuthResult.method === "token" || sharedAuthResult.method === "password") || authResult.ok && authResult.method === "trusted-proxy";
	return {
		authResult,
		authOk: authResult.ok,
		authMethod: authResult.method ?? (params.resolvedAuth.mode === "password" ? "password" : "token"),
		sharedAuthOk,
		sharedAuthProvided,
		bootstrapTokenCandidate,
		deviceTokenCandidate,
		deviceTokenCandidateSource
	};
}
async function resolveConnectAuthDecision(params) {
	if (!Boolean(params.rateLimiter && params.hasDeviceIdentity && params.deviceId && params.publicKey && params.state.bootstrapTokenCandidate)) return await resolveConnectAuthDecisionCore(params);
	return await withSerializedRateLimitAttempt({
		ip: params.clientIp,
		scope: AUTH_RATE_LIMIT_SCOPE_BOOTSTRAP_TOKEN,
		run: async () => await resolveConnectAuthDecisionCore(params)
	});
}
async function resolveConnectAuthDecisionCore(params) {
	let authResult = params.state.authResult;
	let authOk = params.state.authOk;
	let authMethod = params.state.authMethod;
	let deviceTokenSharedGatewaySessionGeneration;
	let pendingBootstrapFailure = false;
	function finish() {
		if (pendingBootstrapFailure && !authOk) params.rateLimiter?.recordFailure(params.clientIp, AUTH_RATE_LIMIT_SCOPE_BOOTSTRAP_TOKEN);
		return {
			authResult,
			authOk,
			authMethod,
			deviceTokenSharedGatewaySessionGeneration
		};
	}
	const bootstrapTokenCandidate = params.state.bootstrapTokenCandidate;
	if (params.hasDeviceIdentity && params.deviceId && params.publicKey && bootstrapTokenCandidate) {
		let bootstrapRateLimited = false;
		if (params.rateLimiter) {
			const bootstrapRateCheck = params.rateLimiter.check(params.clientIp, AUTH_RATE_LIMIT_SCOPE_BOOTSTRAP_TOKEN);
			if (!bootstrapRateCheck.allowed) {
				bootstrapRateLimited = true;
				if (!authOk) authResult = {
					ok: false,
					reason: "rate_limited",
					rateLimited: true,
					retryAfterMs: bootstrapRateCheck.retryAfterMs
				};
			}
		}
		if (!bootstrapRateLimited) {
			const tokenCheck = await params.verifyBootstrapToken({
				deviceId: params.deviceId,
				publicKey: params.publicKey,
				token: bootstrapTokenCandidate,
				role: params.role,
				scopes: params.scopes
			});
			if (tokenCheck.ok) {
				authOk = true;
				authMethod = "bootstrap-token";
				params.rateLimiter?.reset(params.clientIp, AUTH_RATE_LIMIT_SCOPE_BOOTSTRAP_TOKEN);
			} else {
				pendingBootstrapFailure = true;
				if (!authOk) authResult = {
					ok: false,
					reason: tokenCheck.reason ?? "bootstrap_token_invalid"
				};
			}
		}
	}
	const deviceTokenCandidate = params.state.deviceTokenCandidate;
	if (!params.hasDeviceIdentity || !params.deviceId || authOk || !deviceTokenCandidate) return finish();
	let deviceTokenRateLimited = false;
	if (params.rateLimiter) {
		const deviceRateCheck = params.rateLimiter.check(params.clientIp, AUTH_RATE_LIMIT_SCOPE_DEVICE_TOKEN);
		if (!deviceRateCheck.allowed) {
			deviceTokenRateLimited = true;
			authResult = {
				ok: false,
				reason: "rate_limited",
				rateLimited: true,
				retryAfterMs: deviceRateCheck.retryAfterMs
			};
		}
	}
	if (!deviceTokenRateLimited) {
		const tokenCheck = await params.verifyDeviceToken({
			deviceId: params.deviceId,
			token: deviceTokenCandidate,
			role: params.role,
			scopes: params.scopes
		});
		if (tokenCheck.ok) {
			authOk = true;
			authMethod = "device-token";
			if (tokenCheck.issuer?.kind === "shared-gateway-auth") deviceTokenSharedGatewaySessionGeneration = tokenCheck.issuer.generation;
			params.rateLimiter?.reset(params.clientIp, AUTH_RATE_LIMIT_SCOPE_DEVICE_TOKEN);
			if (params.state.sharedAuthProvided) params.rateLimiter?.reset(params.clientIp, AUTH_RATE_LIMIT_SCOPE_SHARED_SECRET);
		} else {
			authResult = {
				ok: false,
				reason: mapDeviceTokenAuthFailureReason({
					tokenCheckReason: tokenCheck.reason,
					candidateSource: params.state.deviceTokenCandidateSource,
					fallbackReason: authResult.reason
				})
			};
			params.rateLimiter?.recordFailure(params.clientIp, AUTH_RATE_LIMIT_SCOPE_DEVICE_TOKEN);
		}
	}
	return finish();
}
//#endregion
//#region src/gateway/server/ws-connection/handshake-auth-helpers.ts
const BROWSER_ORIGIN_LOOPBACK_RATE_LIMIT_IP = "198.18.0.1";
const BROWSER_ORIGIN_RATE_LIMIT_KEY_PREFIX = "browser-origin:";
function isNativeAppUiClient(client) {
	return client.mode === GATEWAY_CLIENT_MODES.UI && (client.id === GATEWAY_CLIENT_IDS.MACOS_APP || client.id === GATEWAY_CLIENT_IDS.LINUX_APP || client.id === GATEWAY_CLIENT_IDS.IOS_APP || client.id === GATEWAY_CLIENT_IDS.ANDROID_APP);
}
function resolveBrowserOriginRateLimitKey(requestOrigin) {
	const trimmedOrigin = requestOrigin?.trim();
	if (!trimmedOrigin) return BROWSER_ORIGIN_LOOPBACK_RATE_LIMIT_IP;
	try {
		return `${BROWSER_ORIGIN_RATE_LIMIT_KEY_PREFIX}${normalizeLowercaseStringOrEmpty(new URL(trimmedOrigin).origin)}`;
	} catch {
		return BROWSER_ORIGIN_LOOPBACK_RATE_LIMIT_IP;
	}
}
function resolveHandshakeBrowserSecurityContext(params) {
	const hasBrowserOriginHeader = Boolean(params.requestOrigin && params.requestOrigin.trim() !== "");
	return {
		hasBrowserOriginHeader,
		enforceOriginCheckForAnyClient: hasBrowserOriginHeader,
		rateLimitClientIp: hasBrowserOriginHeader && isLoopbackAddress(params.clientIp) ? resolveBrowserOriginRateLimitKey(params.requestOrigin) : params.clientIp,
		authRateLimiter: hasBrowserOriginHeader && params.browserRateLimiter ? params.browserRateLimiter : params.rateLimiter
	};
}
function shouldAllowSilentLocalPairing(params) {
	if (params.locality === "remote") return false;
	if (params.hasBrowserOriginHeader && !params.isControlUi && !params.isWebchat) return false;
	if (params.autoApproveLocal === false && params.reason !== "metadata-upgrade") return false;
	if (params.reason === "not-paired" || params.reason === "scope-upgrade" || params.reason === "role-upgrade") return true;
	if (params.reason === "metadata-upgrade" && !params.hasBrowserOriginHeader && !params.isControlUi && !params.isWebchat && (params.locality === "direct_local" && params.isNativeAppUi === true || params.locality === "cli_container_local" || params.locality === "shared_secret_loopback_local")) return true;
	return false;
}
function isCliContainerLocalEquivalent(params) {
	const isCliClient = params.connectParams.client.id === GATEWAY_CLIENT_IDS.CLI && params.connectParams.client.mode === GATEWAY_CLIENT_MODES.CLI;
	const usesSharedSecretAuth = params.authMethod === "token" || params.authMethod === "password";
	return isCliClient && params.sharedAuthOk && usesSharedSecretAuth && !params.hasProxyHeaders && !params.hasBrowserOriginHeader && isLoopbackAddress(params.remoteAddress) && isPrivateOrLoopbackHost(resolveHostName(params.requestHost));
}
function isSharedSecretLoopbackLocalEquivalent(params) {
	const usesSharedSecretAuth = params.authMethod === "token" || params.authMethod === "password";
	return params.sharedAuthOk && usesSharedSecretAuth && !params.hasProxyHeaders && !params.hasBrowserOriginHeader && isLoopbackAddress(params.remoteAddress) && isPrivateOrLoopbackHost(resolveHostName(params.requestHost));
}
function resolveOriginHost(origin) {
	const trimmed = origin?.trim();
	if (!trimmed) return "";
	try {
		return new URL(trimmed).hostname;
	} catch {
		return "";
	}
}
function isControlUiBrowserContainerLocalEquivalent(params) {
	const isControlUiBrowser = params.connectParams.client.id === GATEWAY_CLIENT_IDS.CONTROL_UI && params.connectParams.client.mode === GATEWAY_CLIENT_MODES.WEBCHAT;
	const usesSharedSecretAuth = params.authMethod === "token" || params.authMethod === "password";
	return isControlUiBrowser && params.sharedAuthOk && usesSharedSecretAuth && !params.hasProxyHeaders && params.hasBrowserOriginHeader && isPrivateOrLoopbackAddress(params.remoteAddress) && isLoopbackHost(resolveHostName(params.requestHost)) && isLoopbackHost(resolveOriginHost(params.requestOrigin));
}
function resolvePairingLocality(params) {
	if (params.isLocalClient) return "direct_local";
	if (isControlUiBrowserContainerLocalEquivalent({
		connectParams: params.connectParams,
		requestHost: params.requestHost,
		requestOrigin: params.requestOrigin,
		remoteAddress: params.remoteAddress,
		hasProxyHeaders: params.hasProxyHeaders,
		hasBrowserOriginHeader: params.hasBrowserOriginHeader,
		sharedAuthOk: params.sharedAuthOk,
		authMethod: params.authMethod
	})) return "browser_container_local";
	if (isCliContainerLocalEquivalent({
		connectParams: params.connectParams,
		requestHost: params.requestHost,
		remoteAddress: params.remoteAddress,
		hasProxyHeaders: params.hasProxyHeaders,
		hasBrowserOriginHeader: params.hasBrowserOriginHeader,
		sharedAuthOk: params.sharedAuthOk,
		authMethod: params.authMethod
	})) return "cli_container_local";
	if (isSharedSecretLoopbackLocalEquivalent({
		requestHost: params.requestHost,
		remoteAddress: params.remoteAddress,
		hasProxyHeaders: params.hasProxyHeaders,
		hasBrowserOriginHeader: params.hasBrowserOriginHeader,
		sharedAuthOk: params.sharedAuthOk,
		authMethod: params.authMethod
	})) return "shared_secret_loopback_local";
	return "remote";
}
function shouldSkipLocalBackendSelfPairing(params) {
	if (!(params.connectParams.client.id === GATEWAY_CLIENT_IDS.GATEWAY_CLIENT && params.connectParams.client.mode === GATEWAY_CLIENT_MODES.BACKEND)) return false;
	if (!(params.locality === "direct_local" || params.locality === "shared_secret_loopback_local") || params.hasBrowserOriginHeader) return false;
	if (params.authMethod === "none") return true;
	const usesSharedSecretAuth = params.authMethod === "token" || params.authMethod === "password";
	const usesDeviceTokenAuth = params.authMethod === "device-token";
	return params.sharedAuthOk && usesSharedSecretAuth || usesDeviceTokenAuth;
}
function shouldPreserveLocalCliSharedAuthScopes(params) {
	if (!(params.connectParams.client.id === GATEWAY_CLIENT_IDS.CLI && params.connectParams.client.mode === GATEWAY_CLIENT_MODES.CLI)) return false;
	const isLocal = params.locality === "direct_local" || params.locality === "cli_container_local";
	const usesSharedSecretAuth = params.authMethod === "token" || params.authMethod === "password";
	return isLocal && !params.hasBrowserOriginHeader && params.sharedAuthOk && usesSharedSecretAuth;
}
function resolveSignatureToken(connectParams) {
	return connectParams.auth?.token ?? connectParams.auth?.deviceToken ?? connectParams.auth?.bootstrapToken ?? null;
}
function buildUnauthorizedHandshakeContext(params) {
	return {
		authProvided: params.authProvided,
		canRetryWithDeviceToken: params.canRetryWithDeviceToken,
		recommendedNextStep: params.recommendedNextStep
	};
}
function resolveDeviceSignaturePayloadVersion(params) {
	const signatureToken = resolveSignatureToken(params.connectParams);
	const basePayload = {
		deviceId: params.device.id,
		clientId: params.connectParams.client.id,
		clientMode: params.connectParams.client.mode,
		role: params.role,
		scopes: params.scopes,
		signedAtMs: params.signedAtMs,
		token: signatureToken,
		nonce: params.nonce
	};
	const payloadV3 = buildDeviceAuthPayloadV3({
		...basePayload,
		platform: params.connectParams.client.platform,
		deviceFamily: params.connectParams.client.deviceFamily
	});
	if (verifyDeviceSignature(params.device.publicKey, payloadV3, params.device.signature)) return "v3";
	const payloadV2 = buildDeviceAuthPayload(basePayload);
	if (verifyDeviceSignature(params.device.publicKey, payloadV2, params.device.signature)) return "v2";
	return null;
}
function resolveAuthProvidedKind(connectAuth) {
	return connectAuth?.password ? "password" : connectAuth?.token ? "token" : connectAuth?.bootstrapToken ? "bootstrap-token" : connectAuth?.deviceToken ? "device-token" : "none";
}
function resolveUnauthorizedHandshakeContext(params) {
	const authProvided = resolveAuthProvidedKind(params.connectAuth);
	const canRetryWithDeviceToken = params.failedAuth.reason === "token_mismatch" && params.hasDeviceIdentity && authProvided === "token" && !params.connectAuth?.deviceToken;
	if (canRetryWithDeviceToken) return buildUnauthorizedHandshakeContext({
		authProvided,
		canRetryWithDeviceToken,
		recommendedNextStep: "retry_with_device_token"
	});
	switch (params.failedAuth.reason) {
		case "token_missing":
		case "token_missing_config":
		case "password_missing":
		case "password_missing_config": return buildUnauthorizedHandshakeContext({
			authProvided,
			canRetryWithDeviceToken,
			recommendedNextStep: "update_auth_configuration"
		});
		case "token_mismatch":
		case "password_mismatch":
		case "device_token_mismatch": return buildUnauthorizedHandshakeContext({
			authProvided,
			canRetryWithDeviceToken,
			recommendedNextStep: "update_auth_credentials"
		});
		case "scope_mismatch": return buildUnauthorizedHandshakeContext({
			authProvided,
			canRetryWithDeviceToken,
			recommendedNextStep: "review_auth_configuration"
		});
		case "rate_limited": return buildUnauthorizedHandshakeContext({
			authProvided,
			canRetryWithDeviceToken,
			recommendedNextStep: "wait_then_retry"
		});
		default: return buildUnauthorizedHandshakeContext({
			authProvided,
			canRetryWithDeviceToken,
			recommendedNextStep: "review_auth_configuration"
		});
	}
}
//#endregion
//#region src/gateway/device-pair-setup-completion.ts
async function consumeSetupHandoff(params) {
	const completedAtMs = params.ts ?? Date.now();
	return await consumeDeviceBootstrapTokenWithSetupCompletion({
		token: params.token,
		deviceId: params.deviceId,
		completedAtMs,
		...params.pairedDeviceMatches ? { pairedDeviceMatches: params.pairedDeviceMatches } : {},
		...params.baseDir ? { baseDir: params.baseDir } : {}
	});
}
/** Confirm the response completed before the operator can observe success. */
async function confirmSetupHandoffDelivery(params) {
	const completion = params.handoff.completion;
	if (!completion) return params.handoff;
	const confirmed = await confirmDevicePairSetupCompletionDelivery({
		setupId: completion.setupId,
		deviceId: completion.deviceId,
		...params.baseDir ? { baseDir: params.baseDir } : {}
	});
	return confirmed ? {
		record: params.handoff.record,
		completion: confirmed
	} : null;
}
/** Broadcast the already-committed completion; status reconciliation owns delivery loss. */
function broadcastSetupHandoffCompletion(params) {
	const completion = params.handoff.completion;
	if (!completion || completion.deliveryState !== "confirmed") return;
	const payload = {
		setupId: completion.setupId,
		deviceId: completion.deviceId,
		...completion.deviceName ? { deviceName: completion.deviceName } : {},
		access: completion.access,
		ts: completion.completedAtMs
	};
	params.broadcast("device.pair.setup.completed", payload, { dropIfSlow: true });
}
/** Tell the operator that replay is blocked but credential delivery is unknown. */
function broadcastSetupHandoffDeliveryUncertain(params) {
	const completion = params.handoff.completion;
	if (!completion || completion.deliveryState !== "uncertain") return;
	const payload = {
		setupId: completion.setupId,
		deviceId: completion.deviceId,
		...completion.deviceName ? { deviceName: completion.deviceName } : {},
		access: completion.access,
		ts: completion.completedAtMs
	};
	params.broadcast("device.pair.setup.deliveryUncertain", payload, { dropIfSlow: true });
}
//#endregion
//#region src/gateway/node-connect-reconcile.ts
/** Publish Computer Use metadata only after the command pair is effective for this session. */
function resolveEffectiveComputerUseDescriptor(params) {
	return params.commands.includes("computer.act") && params.commands.includes("screen.snapshot") ? params.declared : void 0;
}
function resolveApprovedReconnectCommands(params) {
	return normalizeDeclaredNodeCommands({
		declaredCommands: Array.isArray(params.pairedCommands) ? params.pairedCommands : [],
		allowlist: params.allowlist
	});
}
function normalizePermissionMap(value) {
	if (!value) return;
	const entries = Object.entries(value).toSorted(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey));
	return entries.length > 0 ? Object.fromEntries(entries) : void 0;
}
function intersectApprovalSurfaceList(params) {
	const approved = new Set(normalizeNodeApprovalSurfaceList(params.approved));
	return normalizeNodeApprovalSurfaceList(params.declared).filter((entry) => approved.has(entry));
}
function intersectPermissionSurface(params) {
	const entries = [];
	for (const [key, declaredValue] of Object.entries(params.declared ?? {})) {
		const approvedValue = params.approved?.[key];
		if (!declaredValue) {
			entries.push([key, false]);
			continue;
		}
		if (approvedValue === true) {
			entries.push([key, true]);
			continue;
		}
		if (approvedValue === false) entries.push([key, false]);
	}
	return entries.length > 0 ? Object.fromEntries(entries) : void 0;
}
function hasPermissionUpgrade(params) {
	return Object.entries(params.declared ?? {}).some(([key, declaredValue]) => declaredValue && params.approved?.[key] !== true);
}
function buildNodePairingRequestInput(params) {
	return {
		nodeId: params.nodeId,
		displayName: params.connectParams.client.displayName,
		platform: params.connectParams.client.platform,
		version: params.connectParams.client.version,
		deviceFamily: params.connectParams.client.deviceFamily,
		modelIdentifier: params.connectParams.client.modelIdentifier,
		caps: params.caps,
		commands: params.commands,
		permissions: params.permissions,
		remoteIp: params.remoteIp,
		...params.silent ? { silent: true } : {}
	};
}
/** Reconciles a connecting node against stored approval and requests pairing when needed. */
async function reconcileNodePairingOnConnect(params) {
	const nodeId = params.connectParams.device?.id ?? params.connectParams.client.id;
	const policyNode = {
		platform: params.connectParams.client.platform,
		deviceFamily: params.connectParams.client.deviceFamily,
		caps: params.connectParams.caps,
		commands: params.connectParams.commands
	};
	const pairingAllowlist = resolveNodePairingCommandAllowlist(params.cfg, policyNode);
	const declared = normalizeDeclaredNodeCommands({
		declaredCommands: Array.isArray(params.connectParams.commands) ? params.connectParams.commands : [],
		allowlist: pairingAllowlist
	});
	const declaredCaps = normalizeNodeApprovalSurfaceList(params.connectParams.caps);
	const declaredPermissions = normalizePermissionMap(params.connectParams.permissions);
	const declaredComputerUse = params.connectParams.computerUse === void 0 ? void 0 : parseComputerUseCapabilityDescriptor(params.connectParams.computerUse);
	if (!params.pairedNode) {
		const pendingPairing = await params.requestPairing(buildNodePairingRequestInput({
			nodeId,
			connectParams: params.connectParams,
			caps: declaredCaps,
			commands: declared,
			permissions: declaredPermissions,
			remoteIp: params.reportedClientIp,
			silent: params.initialSurfaceSilent
		}));
		if (!pendingPairing) throw new Error("node pairing request required");
		return {
			nodeId,
			declaredCaps,
			effectiveCaps: [],
			declaredCommands: declared,
			effectiveCommands: [],
			...declaredComputerUse ? { declaredComputerUse } : {},
			declaredPermissions,
			effectivePermissions: void 0,
			pendingPairing
		};
	}
	const approvedCommands = resolveApprovedReconnectCommands({
		pairedCommands: params.pairedNode.commands,
		allowlist: pairingAllowlist
	});
	const approvedCaps = normalizeNodeApprovalSurfaceList(params.pairedNode.caps);
	const approvedPermissions = normalizePermissionMap(params.pairedNode.permissions);
	const hasCommandUpgrade = declared.some((command) => !approvedCommands.includes(command));
	const hasCapabilityUpgrade = declaredCaps.some((capability) => !approvedCaps.includes(capability));
	const permissionUpgrade = hasPermissionUpgrade({
		approved: approvedPermissions,
		declared: declaredPermissions
	});
	const effectiveApprovedDeclaredCaps = intersectApprovalSurfaceList({
		approved: approvedCaps,
		declared: declaredCaps
	});
	const effectiveApprovedDeclaredCommands = intersectApprovalSurfaceList({
		approved: approvedCommands,
		declared
	});
	const effectiveApprovedDeclaredPermissions = intersectPermissionSurface({
		approved: approvedPermissions,
		declared: declaredPermissions
	});
	if (hasCommandUpgrade || hasCapabilityUpgrade || permissionUpgrade) {
		const pendingPairing = await params.requestPairing(buildNodePairingRequestInput({
			nodeId,
			connectParams: params.connectParams,
			caps: declaredCaps,
			commands: declared,
			permissions: declaredPermissions ?? (permissionUpgrade ? {} : void 0),
			remoteIp: params.reportedClientIp
		}));
		return {
			nodeId,
			declaredCaps,
			effectiveCaps: effectiveApprovedDeclaredCaps,
			declaredCommands: declared,
			effectiveCommands: effectiveApprovedDeclaredCommands,
			...declaredComputerUse ? { declaredComputerUse } : {},
			declaredPermissions,
			effectivePermissions: effectiveApprovedDeclaredPermissions,
			...pendingPairing ? { pendingPairing } : {}
		};
	}
	return {
		nodeId,
		declaredCaps,
		effectiveCaps: declaredCaps,
		declaredCommands: declared,
		effectiveCommands: declared,
		...declaredComputerUse ? { declaredComputerUse } : {},
		declaredPermissions,
		effectivePermissions: declaredPermissions,
		shouldClearPendingPairings: true
	};
}
//#endregion
export { confirmSetupHandoffDelivery as a, resolveDeviceSignaturePayloadVersion as c, resolveUnauthorizedHandshakeContext as d, shouldAllowSilentLocalPairing as f, resolveConnectAuthState as g, resolveConnectAuthDecision as h, broadcastSetupHandoffDeliveryUncertain as i, resolveHandshakeBrowserSecurityContext as l, shouldSkipLocalBackendSelfPairing as m, resolveEffectiveComputerUseDescriptor as n, consumeSetupHandoff as o, shouldPreserveLocalCliSharedAuthScopes as p, broadcastSetupHandoffCompletion as r, isNativeAppUiClient as s, reconcileNodePairingOnConnect as t, resolvePairingLocality as u };
