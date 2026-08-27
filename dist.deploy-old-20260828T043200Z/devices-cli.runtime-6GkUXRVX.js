import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty, p as normalizeStringifiedOptionalString } from "./string-coerce-CIXf7egm.js";
import { t as coerceErrorMessage } from "./error-coercion-CKFmnpjH.js";
import { p as normalizeUniqueSingleOrTrimmedStringList, v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { t as formatCliCommand } from "./command-format-HwSAdvXB.js";
import { t as sanitizeForLog } from "./ansi-DjDeieuH.js";
import { r as defaultRuntime } from "./runtime-LRpY2Icg.js";
import { r as theme } from "./theme-vjDs9tao.js";
import { r as PAIRING_SCOPE, t as ADMIN_SCOPE } from "./operator-scopes-Dw7Gu2cA.js";
import { r as callGatewayFromCliWithTransport } from "./gateway-rpc-4LDXqcsd.js";
import { o as isLoopbackHost } from "./net-DeK7gO-9.js";
import { f as readConnectPairingRequiredMessage } from "./connect-error-details-Dxf1zdDX.js";
import { d as formatGatewayTransportErrorJson, i as buildGatewayConnectionDetails } from "./call-Bwn2P4nz.js";
import { n as normalizeDeviceAuthScopes } from "./device-auth-C-STNejO.js";
import "./method-scopes-BTnJZEGh.js";
import { t as quoteCliArg } from "./quote-cli-arg-BriMa9wW.js";
import { n as formatTimeAgo } from "./format-relative-DerIyym2.js";
import { c as listDevicePairing } from "./device-pairing-Li5h-3GZ.js";
import { n as renderTable, t as getTerminalTableWidth } from "./table-Bcnfo7BA.js";
import { o as summarizeDeviceTokens } from "./device-pairing-tokens-D6HD-g7z.js";
import { n as approveDevicePairing, r as formatDevicePairingForbiddenMessage } from "./device-pairing-approval-BDF-0zH-.js";
import { t as formatConnectionFlagReminder } from "./cli-utils-BTXACHTk.js";
//#region src/shared/device-pairing-access.ts
function normalizeRoleList(...items) {
	const roles = /* @__PURE__ */ new Set();
	for (const item of items) for (const role of normalizeUniqueSingleOrTrimmedStringList(item)) roles.add(role);
	return [...roles].toSorted();
}
function includesAll(allowed, requested) {
	const allowedSet = new Set(allowed);
	return requested.every((value) => allowedSet.has(value));
}
/** Normalizes requested roles/scopes from pending pairing records, including legacy singular role. */
function summarizePendingDeviceAccess(request) {
	return {
		roles: normalizeRoleList(request.roles, request.role),
		scopes: normalizeDeviceAuthScopes(request.scopes)
	};
}
/** Summarizes currently approved device access, excluding roles whose tokens are revoked. */
function summarizeApprovedDeviceAccess(device) {
	const approvedRoles = normalizeRoleList(device.roles, device.role);
	const tokenList = Array.isArray(device.tokens) ? device.tokens : device.tokens ? Object.values(device.tokens) : void 0;
	return {
		roles: tokenList === void 0 ? approvedRoles : normalizeRoleList(tokenList.filter((token) => !token.revokedAtMs).flatMap((token) => token.role ?? [])).filter((role) => approvedRoles.includes(role)),
		scopes: normalizeDeviceAuthScopes(device.scopes)
	};
}
/** Classifies a pending pairing request as new pairing, role upgrade, scope upgrade, or re-approval. */
function resolvePendingDeviceApprovalState(request, paired) {
	const requested = summarizePendingDeviceAccess(request);
	const approved = paired ? summarizeApprovedDeviceAccess(paired) : null;
	if (!approved) return {
		kind: "new-pairing",
		requested,
		approved: null
	};
	if (!includesAll(approved.roles, requested.roles)) return {
		kind: "role-upgrade",
		requested,
		approved
	};
	if (!includesAll(approved.scopes, requested.scopes)) return {
		kind: "scope-upgrade",
		requested,
		approved
	};
	return {
		kind: "re-approval",
		requested,
		approved
	};
}
//#endregion
//#region src/cli/devices-cli.runtime.ts
const FALLBACK_NOTICE = "Direct scope access failed; using local fallback.";
const DEFAULT_DEVICES_TIMEOUT_MS = 1e4;
const FALLBACK_STATE_MISMATCH_MESSAGE = "Gateway requires device pairing, but local fallback pairing state does not contain the gateway request.";
const OPERATOR_ROLE = "operator";
const OPERATOR_SCOPE_PREFIX = "operator.";
const KNOWN_NON_ADMIN_OPERATOR_SCOPES = /* @__PURE__ */ new Set([
	"operator.approvals",
	"operator.pairing",
	"operator.read",
	"operator.talk.secrets",
	"operator.write"
]);
const callGatewayCli = async (method, opts, params, callOpts) => callGatewayFromCliWithTransport(method, opts, params, {
	label: `Devices ${method}`,
	defaultTimeoutMs: DEFAULT_DEVICES_TIMEOUT_MS,
	scopes: callOpts?.scopes,
	sharedStateMode: "read-only"
});
function buildNodeApproveCommand(opts, requestId) {
	const args = [
		"openclaw",
		"nodes",
		"approve",
		requestId
	];
	const timeout = normalizeOptionalString(opts.timeout);
	if (timeout && timeout !== String(DEFAULT_DEVICES_TIMEOUT_MS)) args.push("--timeout", timeout);
	return formatCliCommand(args.map(quoteCliArg).join(" "));
}
function stringsMatch(left, right) {
	const normalizedLeft = normalizeOptionalString(left);
	const normalizedRight = normalizeOptionalString(right);
	return Boolean(normalizedLeft && normalizedRight && normalizedLeft === normalizedRight);
}
function pairedDeviceMatchesNodeApprovalQuery(device, query) {
	return stringsMatch(device.deviceId, query) || stringsMatch(device.remoteIp, query) || stringsMatch(device.pendingNodeSurface?.requestId, query) || stringsMatch(device.pendingNodeSurface?.remoteIp, query);
}
function buildPendingNodeApprovalNotice(device, opts) {
	const pending = device.pendingNodeSurface;
	const requestId = normalizeOptionalString(pending?.requestId);
	if (!pending || !requestId) return null;
	return {
		action: device.nodeSurface ? "reapproval" : "approval",
		label: normalizeOptionalString(pending.displayName) ?? normalizeOptionalString(device.nodeSurface?.displayName) ?? normalizeOptionalString(device.displayName) ?? device.deviceId,
		command: buildNodeApproveCommand(opts, requestId),
		connectionReminder: formatConnectionFlagReminder(opts)
	};
}
function formatNodeApprovalNotice(notice) {
	const lines = [`Node ${notice.action} pending for ${sanitizeForLog(notice.label)}. Run ${sanitizeForLog(notice.command)}`];
	if (notice.connectionReminder) lines.push(notice.connectionReminder);
	return lines.join("\n");
}
function findPairedDevicePendingNodeApprovalNotices(opts, paired) {
	return (paired ?? []).flatMap((device) => {
		const notice = buildPendingNodeApprovalNotice(device, opts);
		return notice ? [notice] : [];
	});
}
function findQueryPendingNodeApprovalNotices(opts, paired, query) {
	return (paired ?? []).filter((device) => pairedDeviceMatchesNodeApprovalQuery(device, query)).flatMap((device) => {
		const notice = buildPendingNodeApprovalNotice(device, opts);
		return notice ? [notice] : [];
	});
}
function isDevicePairingApprovalDenied(error) {
	return normalizeLowercaseStringOrEmpty(coerceErrorMessage(error)).includes("device pairing approval denied");
}
function isUnknownRequestIdError(error) {
	const maybeGatewayError = typeof error === "object" && error !== null ? error : void 0;
	const gatewayCode = maybeGatewayError?.gatewayCode;
	if (gatewayCode !== void 0 && gatewayCode !== "INVALID_REQUEST") return false;
	return normalizeLowercaseStringOrEmpty(typeof maybeGatewayError?.message === "string" ? maybeGatewayError.message : coerceErrorMessage(error)).includes("unknown requestid");
}
function isScopeUpgradePendingApproval(error) {
	return readConnectPairingRequiredMessage(coerceErrorMessage(error))?.reason === "scope-upgrade";
}
function resolveLocalPairingFallback(opts, error) {
	const details = readConnectPairingRequiredMessage(normalizeLowercaseStringOrEmpty(coerceErrorMessage(error)));
	if (!details) return null;
	if (typeof opts.url === "string" && opts.url.trim().length > 0) return null;
	const connection = buildGatewayConnectionDetails();
	if (connection.urlSource !== "local loopback") return null;
	try {
		return isLoopbackHost(new URL(connection.url).hostname) ? { details } : null;
	} catch {
		return null;
	}
}
function buildFallbackStateMismatchError(details, pendingRequestIds) {
	const heading = details.requestId ? `${FALLBACK_STATE_MISMATCH_MESSAGE} Missing requestId: ${details.requestId}.` : FALLBACK_STATE_MISMATCH_MESSAGE;
	const guidance = pendingRequestIds.length > 0 ? ["That request was superseded by a newer pending request.", `Approve the current request instead: openclaw devices approve ${pendingRequestIds[0]}`] : ["The running gateway may be using a different OPENCLAW_PROFILE or OPENCLAW_STATE_DIR than this CLI.", "Rerun with the gateway's profile/state-dir; if the gateway uses shared auth, pass --token/--password to approve through it."];
	return new Error([heading, ...guidance].join("\n"));
}
function assertLocalFallbackMatchesGatewayRequest(details, list) {
	const requestId = normalizeOptionalString(details.requestId);
	if (!requestId) return;
	const pendingRequestIds = (list.pending ?? []).map((request) => normalizeOptionalString(request.requestId)).filter((id) => Boolean(id));
	if (!pendingRequestIds.includes(requestId)) throw buildFallbackStateMismatchError(details, pendingRequestIds);
}
function redactLocalPairedDevice(device) {
	const { tokens, ...rest } = device;
	return {
		...rest,
		tokens: summarizeDeviceTokens(tokens)
	};
}
async function listPairingWithFallback(opts) {
	try {
		return parseDevicePairingList(await callGatewayCli("device.pair.list", opts, {}, { scopes: [PAIRING_SCOPE] }));
	} catch (error) {
		const fallback = resolveLocalPairingFallback(opts, error);
		if (!fallback) throw error;
		const local = await listDevicePairing();
		const list = {
			pending: local.pending,
			paired: local.paired.map((device) => redactLocalPairedDevice(device))
		};
		assertLocalFallbackMatchesGatewayRequest(fallback.details, list);
		if (opts.json !== true) defaultRuntime.log(theme.warn(FALLBACK_NOTICE));
		return list;
	}
}
async function approvePairingWithFallback(opts, requestId, context) {
	const { scopes, originalRequest } = context;
	try {
		return await callGatewayCli("device.pair.approve", opts, { requestId }, scopes ? { scopes } : void 0);
	} catch (error) {
		if (isDevicePairingApprovalDenied(error) && !scopes?.includes("operator.admin")) try {
			return await callGatewayCli("device.pair.approve", opts, { requestId }, { scopes: [ADMIN_SCOPE] });
		} catch (adminError) {
			if (isUnknownRequestIdError(adminError)) return null;
			throw adminError;
		}
		const fallback = resolveLocalPairingFallback(opts, error);
		if (!fallback) {
			if (isUnknownRequestIdError(error)) return null;
			throw error;
		}
		const gatewayRequestId = normalizeOptionalString(fallback.details.requestId);
		if (gatewayRequestId && gatewayRequestId !== requestId) {
			const local = await listDevicePairing();
			const localList = {
				pending: local.pending,
				paired: local.paired.map((device) => redactLocalPairedDevice(device))
			};
			context.pairingList = localList;
			const replacement = findSameDeviceReplacementRequest({
				originalRequest,
				originalRequestId: requestId,
				gatewayRequestId,
				pending: localList.pending,
				paired: localList.paired
			});
			if (replacement) {
				const approved = await approveDevicePairing(replacement.requestId, { callerScopes: ["operator.admin"] });
				if (!approved) return null;
				if (approved.status === "forbidden") throw new Error(formatDevicePairingForbiddenMessage(approved), { cause: error });
				if (opts.json !== true) {
					defaultRuntime.log(theme.warn(`Pending request ${sanitizeForLog(requestId)} was replaced by same-device repair ${sanitizeForLog(replacement.requestId)}; approving latest compatible request.`));
					defaultRuntime.log(theme.warn(FALLBACK_NOTICE));
				}
				return {
					requestId: replacement.requestId,
					resolved: {
						kind: "same-device-replacement",
						requestedRequestId: requestId,
						approvedRequestId: replacement.requestId
					},
					device: redactLocalPairedDevice(approved.device)
				};
			}
			const hasOriginalPending = Boolean(findPendingRequestById(localList.pending, requestId));
			const hasGatewayPending = Boolean(findPendingRequestById(localList.pending, gatewayRequestId));
			if (!hasOriginalPending && !hasGatewayPending) return null;
			throw buildFallbackStateMismatchError(fallback.details, []);
		}
		const approved = await approveDevicePairing(requestId, { callerScopes: ["operator.admin"] });
		if (!approved) {
			if (gatewayRequestId && gatewayRequestId === requestId) throw buildFallbackStateMismatchError(fallback.details, []);
			return null;
		}
		if (approved.status === "forbidden") throw new Error(formatDevicePairingForbiddenMessage(approved), { cause: error });
		if (opts.json !== true) defaultRuntime.log(theme.warn(FALLBACK_NOTICE));
		return {
			requestId,
			device: redactLocalPairedDevice(approved.device)
		};
	}
}
function parseDevicePairingList(value) {
	const obj = typeof value === "object" && value !== null ? value : {};
	return {
		pending: Array.isArray(obj.pending) ? obj.pending : [],
		paired: Array.isArray(obj.paired) ? obj.paired : []
	};
}
function normalizeDeviceRoles(request) {
	const roles = /* @__PURE__ */ new Set();
	for (const role of request.roles ?? []) {
		const normalized = normalizeOptionalString(role);
		if (normalized) roles.add(normalized);
	}
	const role = normalizeOptionalString(request.role);
	if (role) roles.add(role);
	return [...roles];
}
function normalizeOperatorScopes(scopes) {
	return normalizeDeviceAuthScopes(scopes).filter((scope) => scope.startsWith(OPERATOR_SCOPE_PREFIX));
}
function findPendingRequestById(pending, requestId) {
	const normalizedRequestId = normalizeOptionalString(requestId);
	if (!normalizedRequestId) return null;
	return pending?.find((request) => normalizeOptionalString(request.requestId) === normalizedRequestId) ?? null;
}
function hasExactRoleMatch(original, replacement) {
	const originalRoles = normalizeDeviceRoles(original);
	const replacementRoles = normalizeDeviceRoles(replacement);
	if (originalRoles.length !== replacementRoles.length) return false;
	const replacementRoleSet = new Set(replacementRoles);
	return originalRoles.every((role) => replacementRoleSet.has(role));
}
function hasCompatibleClientMetadata(original, replacement) {
	const originalClientId = normalizeOptionalString(original.clientId);
	const replacementClientId = normalizeOptionalString(replacement.clientId);
	if (originalClientId && replacementClientId && originalClientId !== replacementClientId) return false;
	const originalClientMode = normalizeOptionalString(original.clientMode);
	const replacementClientMode = normalizeOptionalString(replacement.clientMode);
	return !(originalClientMode && replacementClientMode && originalClientMode !== replacementClientMode);
}
function resolveOriginalReplacementScopes(original, paired) {
	const requestedScopes = normalizeDeviceAuthScopes(original.scopes);
	const inferredOperatorScopes = resolvePendingOperatorApprovalScopes(original, paired);
	return uniqueStrings([...requestedScopes, ...inferredOperatorScopes]);
}
function replacementScopesCoverOriginal(original, replacement, paired) {
	const originalScopes = resolveOriginalReplacementScopes(original, paired);
	const replacementScopes = normalizeDeviceAuthScopes(replacement.scopes);
	const replacementScopeSet = new Set(replacementScopes);
	if (!originalScopes.every((scope) => replacementScopeSet.has(scope))) return false;
	return replacementScopes.every((scope) => originalScopes.includes(scope) || scope === "operator.pairing");
}
function findSameDeviceReplacementRequest(params) {
	const originalRequestId = normalizeOptionalString(params.originalRequestId);
	if (!params.originalRequest || !originalRequestId) return null;
	if (normalizeOptionalString(params.originalRequest.requestId) !== originalRequestId) return null;
	const replacement = findPendingRequestById(params.pending, params.gatewayRequestId);
	if (!replacement) return null;
	const originalDeviceId = normalizeOptionalString(params.originalRequest.deviceId);
	const replacementDeviceId = normalizeOptionalString(replacement.deviceId);
	if (!originalDeviceId || originalDeviceId !== replacementDeviceId) return null;
	const originalPublicKey = normalizeOptionalString(params.originalRequest.publicKey);
	const replacementPublicKey = normalizeOptionalString(replacement.publicKey);
	if (!originalPublicKey || !replacementPublicKey || originalPublicKey !== replacementPublicKey) return null;
	if (!hasExactRoleMatch(params.originalRequest, replacement)) return null;
	if (!hasCompatibleClientMetadata(params.originalRequest, replacement)) return null;
	const pairedByDeviceId = indexPairedDevices(params.paired);
	const originalPaired = lookupPairedDevice(pairedByDeviceId, params.originalRequest);
	const replacementPaired = lookupPairedDevice(pairedByDeviceId, replacement);
	if (!replacementScopesCoverOriginal(params.originalRequest, replacement, originalPaired)) return null;
	if (replacement.isRepair !== true && (!originalPaired || !replacementPaired)) return null;
	return replacement;
}
function resolvePairedOperatorScopes(paired) {
	const operatorToken = paired?.tokens?.find((token) => {
		return normalizeOptionalString(token.role) === OPERATOR_ROLE && !token.revokedAtMs;
	});
	return normalizeOperatorScopes(operatorToken?.scopes ?? paired?.scopes);
}
function resolvePendingOperatorApprovalScopes(request, paired) {
	if (!normalizeDeviceRoles(request).includes(OPERATOR_ROLE)) return [];
	const requestedScopes = normalizeOperatorScopes(request.scopes);
	return requestedScopes.length > 0 ? requestedScopes : resolvePairedOperatorScopes(paired);
}
function isKnownNonAdminOperatorScope(scope) {
	return KNOWN_NON_ADMIN_OPERATOR_SCOPES.has(scope);
}
function resolveApprovePairingScopesForRequest(request, paired) {
	const operatorScopes = resolvePendingOperatorApprovalScopes(request, paired);
	if (operatorScopes.length === 0) return;
	if (operatorScopes.includes("operator.admin")) return [ADMIN_SCOPE];
	const out = /* @__PURE__ */ new Set([PAIRING_SCOPE]);
	for (const scope of operatorScopes) {
		if (!isKnownNonAdminOperatorScope(scope)) return [ADMIN_SCOPE];
		out.add(scope);
	}
	return [...out];
}
async function resolveApprovePairingGatewayContext(opts, requestId) {
	try {
		const list = await listPairingWithFallback(opts);
		const request = findPendingRequestById(list.pending, requestId);
		if (!request) return {
			originalRequest: null,
			pairingList: list,
			scopes: void 0
		};
		return {
			originalRequest: request,
			pairingList: list,
			scopes: resolveApprovePairingScopesForRequest(request, lookupPairedDevice(indexPairedDevices(list.paired), request))
		};
	} catch {
		return {
			originalRequest: null,
			pairingList: null,
			scopes: void 0
		};
	}
}
function selectLatestPendingRequest(pending) {
	if (!pending?.length) return null;
	return pending.reduce((latest, current) => {
		const latestTs = typeof latest.ts === "number" ? latest.ts : 0;
		return (typeof current.ts === "number" ? current.ts : 0) > latestTs ? current : latest;
	});
}
function formatTokenSummary(tokens) {
	if (!tokens || tokens.length === 0) return "none";
	return tokens.map((t) => `${sanitizeForLog(t.role)}${t.revokedAtMs ? " (revoked)" : ""}`).toSorted((a, b) => a.localeCompare(b)).join(", ");
}
function formatPendingDeviceIdentity(request) {
	const displayName = normalizeOptionalString(request.displayName);
	if (displayName) return sanitizeForLog(displayName);
	return sanitizeForLog(normalizeOptionalString(request.deviceId) ?? "");
}
function formatAccessSummary(access) {
	if (!access) return "none";
	return `roles: ${access.roles.length > 0 ? access.roles.map((role) => sanitizeForLog(role)).join(", ") : "none"}; scopes: ${access.scopes.length > 0 ? access.scopes.map((scope) => sanitizeForLog(scope)).join(", ") : "none"}`;
}
function formatPendingApprovalKind(kind) {
	switch (kind) {
		case "new-pairing": return "new pairing";
		case "role-upgrade": return "role upgrade";
		case "scope-upgrade": return "scope upgrade";
		case "re-approval": return "re-approval";
	}
	throw new Error("unsupported pending approval kind");
}
function indexPairedDevices(paired) {
	const out = /* @__PURE__ */ new Map();
	for (const device of paired ?? []) {
		const deviceId = normalizeOptionalString(device.deviceId);
		if (deviceId) out.set(deviceId, device);
	}
	return out;
}
function lookupPairedDevice(pairedByDeviceId, request) {
	const normalizedDeviceId = normalizeOptionalString(request.deviceId);
	if (!normalizedDeviceId) return;
	const paired = pairedByDeviceId.get(normalizedDeviceId);
	if (!paired) return;
	const requestPublicKey = normalizeOptionalString(request.publicKey);
	const pairedPublicKey = normalizeOptionalString(paired.publicKey);
	if (requestPublicKey && pairedPublicKey && requestPublicKey !== pairedPublicKey) return;
	return paired;
}
function buildExplicitApproveCommand(opts, requestId) {
	const args = [
		"openclaw",
		"devices",
		"approve",
		requestId
	];
	const url = normalizeOptionalString(opts.url);
	if (url) args.push("--url", url);
	const timeout = normalizeOptionalString(opts.timeout);
	if (timeout && timeout !== String(DEFAULT_DEVICES_TIMEOUT_MS)) args.push("--timeout", timeout);
	if (opts.json === true) args.push("--json");
	return args.map(quoteCliArg).join(" ");
}
function formatAuthFlagReminder(opts) {
	const flags = [];
	if (normalizeOptionalString(opts.token)) flags.push("--token");
	if (normalizeOptionalString(opts.password)) flags.push("--password");
	if (flags.length === 0) return "";
	return `Reuse the same ${flags.join("/")} option${flags.length === 1 ? "" : "s"} when rerunning.`;
}
function resolveRequiredDeviceRole(opts) {
	const deviceId = normalizeStringifiedOptionalString(opts.device) ?? "";
	const role = normalizeStringifiedOptionalString(opts.role) ?? "";
	if (deviceId && role) return {
		deviceId,
		role
	};
	defaultRuntime.error(`--device and --role are required. Run ${formatCliCommand("openclaw devices list")} to choose a paired device.`);
	defaultRuntime.exit(1);
	return null;
}
async function runDevicesListCommand(opts) {
	let list;
	try {
		list = await listPairingWithFallback(opts);
	} catch (error) {
		if (opts.json) {
			const payload = formatGatewayTransportErrorJson(error);
			if (payload) {
				defaultRuntime.writeJson(payload);
				defaultRuntime.exit(1);
				return;
			}
		}
		throw error;
	}
	const pairedByDeviceId = indexPairedDevices(list.paired);
	if (opts.json) {
		defaultRuntime.writeJson(list);
		return;
	}
	if (list.pending?.length) {
		const tableWidth = getTerminalTableWidth();
		defaultRuntime.log(`${theme.heading("Pending")} ${theme.muted(`(${list.pending.length})`)}`);
		defaultRuntime.log(renderTable({
			width: tableWidth,
			columns: [
				{
					key: "Request",
					header: "Request",
					minWidth: 10
				},
				{
					key: "Device",
					header: "Device",
					minWidth: 16,
					flex: true
				},
				{
					key: "Requested",
					header: "Requested",
					minWidth: 20,
					flex: true
				},
				{
					key: "Approved",
					header: "Approved",
					minWidth: 20,
					flex: true
				},
				{
					key: "Age",
					header: "Age",
					minWidth: 8
				},
				{
					key: "Status",
					header: "Status",
					minWidth: 12
				}
			],
			rows: list.pending.map((req) => {
				const approval = resolvePendingDeviceApprovalState(req, lookupPairedDevice(pairedByDeviceId, req));
				const statusParts = [formatPendingApprovalKind(approval.kind)];
				if (req.isRepair) statusParts.push("repair");
				return {
					Request: req.requestId,
					Device: `${formatPendingDeviceIdentity(req)}${req.remoteIp ? ` · ${sanitizeForLog(req.remoteIp)}` : ""}`,
					Requested: formatAccessSummary(approval.requested),
					Approved: formatAccessSummary(approval.approved),
					Age: typeof req.ts === "number" ? formatTimeAgo(Date.now() - req.ts) : "",
					Status: statusParts.join(", ")
				};
			})
		}).trimEnd());
	}
	if (list.paired?.length) {
		const tableWidth = getTerminalTableWidth();
		const rows = list.paired.map((device) => ({
			Device: sanitizeForLog(device.operatorLabel || device.displayName || device.clientId || device.deviceId),
			"Device ID": sanitizeForLog(device.deviceId),
			Roles: device.roles?.length ? device.roles.map((role) => sanitizeForLog(role)).join(", ") : "",
			Scopes: device.scopes?.length ? device.scopes.map((scope) => sanitizeForLog(scope)).join(", ") : "",
			Tokens: formatTokenSummary(device.tokens),
			IP: device.remoteIp ? sanitizeForLog(device.remoteIp) : ""
		}));
		defaultRuntime.log(`${theme.heading("Paired")} ${theme.muted(`(${list.paired.length})`)}`);
		defaultRuntime.log(renderTable({
			width: tableWidth,
			columns: [
				{
					key: "Device",
					header: "Device",
					minWidth: 16,
					flex: true
				},
				{
					key: "Device ID",
					header: "Device ID",
					minWidth: 12,
					flex: true
				},
				{
					key: "Roles",
					header: "Roles",
					minWidth: 12,
					flex: true
				},
				{
					key: "Scopes",
					header: "Scopes",
					minWidth: 12,
					flex: true
				},
				{
					key: "Tokens",
					header: "Tokens",
					minWidth: 12,
					flex: true
				},
				{
					key: "IP",
					header: "IP",
					minWidth: 12
				}
			],
			rows
		}).trimEnd());
		defaultRuntime.log(theme.muted("Full device IDs"));
		for (const row of rows) defaultRuntime.log(`  ${row["Device ID"]}  ${row.Device}`);
		const nodeApprovalNotices = findPairedDevicePendingNodeApprovalNotices(opts, list.paired);
		for (const notice of nodeApprovalNotices) defaultRuntime.log(theme.warn(formatNodeApprovalNotice(notice)));
	}
	if (!list.pending?.length && !list.paired?.length) defaultRuntime.log(theme.muted("No device pairing entries."));
}
async function runDevicesJoinCodeCommand(opts) {
	const joinUrl = normalizeOptionalString((await callGatewayCli("device.pair.setupCode", opts, {
		bootstrapProfile: "node",
		includeQr: false,
		joinUrl: true
	}, { scopes: [ADMIN_SCOPE] })).joinUrl);
	if (!joinUrl) throw new Error("Gateway did not return a device join URL.");
	const command = `npx openclaw connect ${quoteCliArg(joinUrl)}`;
	if (opts.json) {
		defaultRuntime.writeJson({
			joinUrl,
			command
		});
		return;
	}
	defaultRuntime.log(joinUrl);
	defaultRuntime.log(command);
}
async function runDevicesRemoveCommand(deviceId, opts) {
	const trimmed = deviceId.trim();
	if (!trimmed) {
		defaultRuntime.error(`deviceId is required. Run ${formatCliCommand("openclaw devices list")} to choose a paired device.`);
		defaultRuntime.exit(1);
		return;
	}
	const result = await callGatewayCli("device.pair.remove", opts, { deviceId: trimmed });
	if (opts.json) {
		defaultRuntime.writeJson(result);
		return;
	}
	defaultRuntime.log(`${theme.warn("Removed")} ${theme.command(trimmed)}`);
}
async function runDevicesClearCommand(opts) {
	if (!opts.yes) {
		defaultRuntime.error("Refusing to clear pairing table without --yes");
		defaultRuntime.exit(1);
		return;
	}
	const list = parseDevicePairingList(await callGatewayCli("device.pair.list", opts, {}));
	const removedDeviceIds = [];
	const rejectedRequestIds = [];
	const paired = Array.isArray(list.paired) ? list.paired : [];
	for (const device of paired) {
		const deviceId = normalizeOptionalString(device.deviceId) ?? "";
		if (!deviceId) continue;
		await callGatewayCli("device.pair.remove", opts, { deviceId });
		removedDeviceIds.push(deviceId);
	}
	if (opts.pending) {
		const pending = Array.isArray(list.pending) ? list.pending : [];
		for (const req of pending) {
			const requestId = normalizeOptionalString(req.requestId) ?? "";
			if (!requestId) continue;
			await callGatewayCli("device.pair.reject", opts, { requestId });
			rejectedRequestIds.push(requestId);
		}
	}
	if (opts.json) {
		defaultRuntime.writeJson({
			removedDevices: removedDeviceIds,
			rejectedPending: rejectedRequestIds
		});
		return;
	}
	defaultRuntime.log(`${theme.warn("Cleared")} ${removedDeviceIds.length} paired device${removedDeviceIds.length === 1 ? "" : "s"}`);
	if (opts.pending) defaultRuntime.log(`${theme.warn("Rejected")} ${rejectedRequestIds.length} pending request${rejectedRequestIds.length === 1 ? "" : "s"}`);
}
async function runDevicesApproveCommand(requestId, opts) {
	let pairingList = null;
	let resolvedRequestId = requestId?.trim();
	const usingImplicitSelection = !resolvedRequestId || Boolean(opts.latest);
	let selectedRequest = null;
	if (usingImplicitSelection) {
		pairingList = await listPairingWithFallback(opts);
		selectedRequest = selectLatestPendingRequest(pairingList.pending);
		resolvedRequestId = selectedRequest?.requestId?.trim();
	}
	if (!resolvedRequestId) {
		defaultRuntime.error("No pending device pairing requests to approve");
		defaultRuntime.exit(1);
		return;
	}
	if (usingImplicitSelection) {
		const req = selectedRequest;
		const approval = resolvePendingDeviceApprovalState(req, lookupPairedDevice(indexPairedDevices(pairingList?.paired), req));
		const approveCommand = buildExplicitApproveCommand(opts, req.requestId);
		const authReminder = formatAuthFlagReminder(opts);
		if (opts.json) {
			defaultRuntime.writeJson({
				selected: req,
				approvalState: {
					kind: approval.kind,
					requested: approval.requested,
					approved: approval.approved
				},
				approveCommand,
				requiresAuthFlags: {
					token: Boolean(normalizeOptionalString(opts.token)),
					password: Boolean(normalizeOptionalString(opts.password))
				}
			});
			defaultRuntime.exit(1);
			return;
		}
		defaultRuntime.log(`${theme.warn("Selected pending device request")} ${theme.command(req.requestId)}`);
		defaultRuntime.log(`  Device: ${formatPendingDeviceIdentity(req)}`);
		defaultRuntime.log(`  Requested: ${formatAccessSummary(approval.requested)}`);
		if (approval.approved) defaultRuntime.log(`  Approved: ${formatAccessSummary(approval.approved)}`);
		if (req.remoteIp) defaultRuntime.log(`  IP:     ${sanitizeForLog(req.remoteIp)}`);
		switch (approval.kind) {
			case "scope-upgrade":
				defaultRuntime.log("  Note:   Already paired. Requested scopes exceed the current approval, so reconnect stays blocked until you approve this upgrade.");
				break;
			case "role-upgrade":
				defaultRuntime.log("  Note:   Already paired. Requested role exceeds the current approval, so reconnect stays blocked until you approve this upgrade.");
				break;
			case "re-approval":
				defaultRuntime.log("  Note:   Already paired. Approval-bound device details changed, so OpenClaw created a fresh request instead of silently reusing the old approval.");
				break;
			case "new-pairing":
				defaultRuntime.log("  Note:   First-time device pairing request.");
				break;
		}
		defaultRuntime.error(`Approve this exact request with: ${approveCommand}`);
		if (authReminder) defaultRuntime.error(authReminder);
		defaultRuntime.exit(1);
		return;
	}
	let result;
	const approvalContext = await resolveApprovePairingGatewayContext(opts, resolvedRequestId);
	try {
		result = await approvePairingWithFallback(opts, resolvedRequestId, approvalContext);
	} catch (error) {
		if (isScopeUpgradePendingApproval(error)) {
			defaultRuntime.error("This device can't approve its own scope upgrade. Approve it from the Control UI or another authorized device.");
			defaultRuntime.exit(1);
			return;
		}
		throw error;
	}
	if (!result) {
		defaultRuntime.error(`No pending device request matches ${sanitizeForLog(resolvedRequestId)}. Run ${formatCliCommand("openclaw devices list")} and retry with the current request ID.`);
		const nodeApprovalNotices = findQueryPendingNodeApprovalNotices(opts, approvalContext.pairingList?.paired, resolvedRequestId);
		for (const notice of nodeApprovalNotices) defaultRuntime.error(formatNodeApprovalNotice(notice));
		defaultRuntime.exit(1);
		return;
	}
	if (opts.json) {
		defaultRuntime.writeJson(result);
		return;
	}
	const resultRequestId = result?.requestId;
	const approvedRequestId = typeof resultRequestId === "string" && resultRequestId.trim().length > 0 ? resultRequestId : resolvedRequestId;
	const deviceId = result?.device?.deviceId;
	defaultRuntime.log(`${theme.success("Approved")} ${theme.command(deviceId ?? "ok")} ${theme.muted(`(${approvedRequestId})`)}`);
}
async function runDevicesRejectCommand(requestId, opts) {
	const normalizedRequestId = normalizeOptionalString(requestId);
	if (!normalizedRequestId) {
		defaultRuntime.error(`requestId is required. Run ${formatCliCommand("openclaw devices list")} to choose a pending request.`);
		defaultRuntime.exit(1);
		return;
	}
	const result = await callGatewayCli("device.pair.reject", opts, { requestId: normalizedRequestId });
	if (opts.json) {
		defaultRuntime.writeJson(result);
		return;
	}
	const deviceId = result?.deviceId;
	defaultRuntime.log(`${theme.warn("Rejected")} ${theme.command(deviceId ?? "ok")}`);
}
async function runDevicesRenameCommand(opts) {
	const deviceId = normalizeStringifiedOptionalString(opts.device) ?? "";
	const label = normalizeStringifiedOptionalString(opts.name) ?? "";
	if (!deviceId || !label) {
		defaultRuntime.error(`--device and --name are required. Run ${formatCliCommand("openclaw devices list")} to choose a paired device.`);
		defaultRuntime.exit(1);
		return;
	}
	const result = await callGatewayCli("device.pair.rename", opts, {
		deviceId,
		label
	});
	if (opts.json) {
		defaultRuntime.writeJson(result);
		return;
	}
	defaultRuntime.log(`${theme.success("Renamed")} ${theme.command(deviceId)} ${theme.muted("→")} ${sanitizeForLog(label)}`);
}
async function runDevicesRotateCommand(opts) {
	const required = resolveRequiredDeviceRole(opts);
	if (!required) return;
	const result = await callGatewayCli("device.token.rotate", opts, {
		deviceId: required.deviceId,
		role: required.role,
		scopes: Array.isArray(opts.scope) ? opts.scope : void 0
	});
	defaultRuntime.writeJson(result);
}
async function runDevicesRevokeCommand(opts) {
	const required = resolveRequiredDeviceRole(opts);
	if (!required) return;
	const result = await callGatewayCli("device.token.revoke", opts, {
		deviceId: required.deviceId,
		role: required.role
	});
	defaultRuntime.writeJson(result);
}
//#endregion
export { runDevicesApproveCommand, runDevicesClearCommand, runDevicesJoinCodeCommand, runDevicesListCommand, runDevicesRejectCommand, runDevicesRemoveCommand, runDevicesRenameCommand, runDevicesRevokeCommand, runDevicesRotateCommand };
