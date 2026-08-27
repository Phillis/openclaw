import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { r as getRuntimeConfig } from "./io-CeQckj5v.js";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.js";
import { n as APPROVALS_SCOPE } from "./operator-scopes-Dw7Gu2cA.js";
import "./config-Dl8DJbzM.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import "./method-scopes-DRTuNy7j.js";
import "./message-channel-constants-2zSoJXQC.js";
import { n as normalizeMessageChannel } from "./message-channel-core-BDhVfGhd.js";
import { n as getLoadedChannelPlugin } from "./registry-B3yYjPW1.js";
import { n as resolveChannelApprovalCapability } from "./plugins-cwOWOggC.js";
import "./message-channel-T4W5YOto.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
import { i as resolveApprovalInitiatingSurfaceState } from "./exec-approval-surface-CG6Hkt94.js";
import { r as doesApprovalRequestSelectChannelAccount } from "./approval-request-account-binding-DaAFUqxc.js";
import { t as assertValidParams } from "./validation-CsGeElrb.js";
//#region src/infra/approval-turn-source.ts
/** Returns whether approval replies can route back to the turn's initiating surface. */
function hasApprovalTurnSourceRoute(params) {
	const channel = normalizeMessageChannel(params.turnSourceChannel);
	if (!channel || channel === "webchat" || channel === "tui") return false;
	return resolveApprovalInitiatingSurfaceState({
		channel,
		accountId: params.turnSourceAccountId,
		cfg: getRuntimeConfig(),
		approvalKind: params.approvalKind ?? "exec"
	}).kind === "enabled";
}
//#endregion
//#region src/gateway/approval-channel-custody.ts
function prepareApprovalChannelCustody(params) {
	const channel = params.reviewer.channel.trim().toLowerCase();
	const accountId = params.reviewer.accountId.trim();
	const senderId = params.reviewer.senderId.trim();
	if (!channel || !accountId || !senderId) return null;
	const plugin = getLoadedChannelPlugin(channel);
	const authorizeActorAction = resolveChannelApprovalCapability(plugin)?.authorizeActorAction;
	if (!plugin || !authorizeActorAction) return null;
	const isActorAuthorized = (candidateAccountId) => authorizeActorAction({
		cfg: params.cfg,
		accountId: candidateAccountId,
		senderId,
		action: "approve",
		approvalKind: params.approvalKind
	}).authorized;
	if (!isActorAuthorized(accountId)) return null;
	const eligibleAccountIds = plugin.config.listAccountIds(params.cfg).filter(isActorAuthorized);
	if (!eligibleAccountIds.includes(accountId)) return null;
	return {
		resolverId: `${channel}:${accountId}`,
		authorizes: (request) => doesApprovalRequestSelectChannelAccount({
			cfg: params.cfg,
			request,
			channel,
			accountId,
			defaultAccountId: plugin.config.defaultAccountId?.(params.cfg) ?? "",
			eligibleAccountIds
		})
	};
}
//#endregion
//#region src/gateway/server-methods/approval-record-lookup.ts
const APPROVAL_NOT_FOUND_DETAILS = {
	reason: ErrorCodes.APPROVAL_NOT_FOUND,
	remediation: "Re-request the action; pending approvals are cleared after expiry or restart."
};
function normalizeApprovalIdentity(value) {
	return normalizeOptionalString(value) ?? null;
}
function normalizeApprovalIdentities(values) {
	const normalized = /* @__PURE__ */ new Set();
	for (const value of values ?? []) {
		const identity = normalizeApprovalIdentity(value);
		if (identity) normalized.add(identity);
	}
	return [...normalized];
}
function isApprovalRecordVisibleToClient(params) {
	const scopes = Array.isArray(params.client?.connect?.scopes) ? params.client.connect.scopes : [];
	if (scopes.includes("operator.admin")) return true;
	const requestedByDeviceId = normalizeApprovalIdentity(params.record.requestedByDeviceId);
	const requestedByClientId = normalizeApprovalIdentity(params.record.requestedByClientId);
	const hasApprovalsScope = scopes.includes(APPROVALS_SCOPE);
	if (hasApprovalsScope && params.client?.internal?.approvalRuntime === true) return true;
	const approvalReviewerDeviceIds = normalizeApprovalIdentities(params.record.approvalReviewerDeviceIds);
	const clientDeviceId = normalizeApprovalIdentity(params.client?.connect?.device?.id);
	if (hasApprovalsScope && clientDeviceId && approvalReviewerDeviceIds.includes(clientDeviceId)) return true;
	if (requestedByDeviceId) return requestedByDeviceId === clientDeviceId;
	const requestedByConnId = normalizeApprovalIdentity(params.record.requestedByConnId);
	if (requestedByConnId) return requestedByConnId === normalizeApprovalIdentity(params.client?.connId);
	if (requestedByClientId || approvalReviewerDeviceIds.length > 0) return false;
	return true;
}
function listVisiblePendingApprovalRequests(params) {
	return params.manager.listPendingRecords().filter((record) => isApprovalRecordVisibleToClient({
		record,
		client: params.client ?? null
	})).map(({ id, request, createdAtMs, expiresAtMs }) => ({
		id,
		request,
		createdAtMs,
		expiresAtMs
	}));
}
function resolveLookupError(params) {
	if (params.resolvedId.kind === "none" || params.resolvedId.kind === "ambiguous" && !params.exposeAmbiguousPrefixError) return "missing";
	return {
		code: ErrorCodes.INVALID_REQUEST,
		message: "ambiguous approval id prefix; use the full id"
	};
}
function resolveApprovalRecordForState(params, expectedState) {
	const resolvedId = params.manager.lookupApprovalId(params.inputId, {
		includeResolved: expectedState === "resolved",
		filter: (record) => isApprovalRecordVisibleToClient({
			record,
			client: params.client ?? null
		}) && (params.recordFilter?.(record) ?? true)
	});
	if (resolvedId.kind !== "exact" && resolvedId.kind !== "prefix") return {
		ok: false,
		response: resolveLookupError({
			...params,
			resolvedId
		})
	};
	const snapshot = params.manager.getSnapshot(resolvedId.id);
	const isResolved = snapshot?.resolvedAtMs !== void 0;
	return !snapshot || isResolved !== (expectedState === "resolved") ? {
		ok: false,
		response: "missing"
	} : {
		ok: true,
		approvalId: resolvedId.id,
		snapshot
	};
}
function resolvePendingApprovalRecord(params) {
	return resolveApprovalRecordForState(params, "pending");
}
function resolveResolvedApprovalRecord(params) {
	return resolveApprovalRecordForState(params, "resolved");
}
function respondUnknownOrExpiredApproval(respond) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown or expired approval id", { details: APPROVAL_NOT_FOUND_DETAILS }));
}
function respondPendingApprovalLookupError(params) {
	if (params.response === "missing") {
		respondUnknownOrExpiredApproval(params.respond);
		return;
	}
	params.respond(false, void 0, errorShape(params.response.code, params.response.message));
}
//#endregion
//#region src/gateway/server-methods/approval-wait-response.ts
function buildWaitResponse(id, decision, snapshot, terminalReason) {
	return {
		id,
		decision,
		createdAtMs: snapshot.createdAtMs,
		expiresAtMs: snapshot.expiresAtMs,
		terminalReason: terminalReason ?? snapshot.terminalReason
	};
}
//#endregion
//#region src/gateway/server-methods/approval-shared.ts
const APPROVAL_ALREADY_RESOLVED_DETAILS = { reason: "APPROVAL_ALREADY_RESOLVED" };
function resolveRecordedApprovalDecision(record) {
	return record.decision ?? record.consumedDecision;
}
function isApprovalDecision(value) {
	return value === "allow-once" || value === "allow-always" || value === "deny";
}
/** Binds the current gateway client identity onto a newly-created approval record. */
function bindApprovalRequesterMetadata(params) {
	params.record.requestedByConnId = params.client?.connId ?? null;
	params.record.requestedByDeviceId = params.client?.connect?.device?.id ?? null;
	params.record.requestedByClientId = params.client?.connect?.client?.id ?? null;
	params.record.requestedByDeviceTokenAuth = params.client?.isDeviceTokenAuth === true;
}
function bindApprovalReviewerDeviceIds(params) {
	const deviceIds = normalizeApprovalIdentities(params.deviceIds);
	if (deviceIds.length > 0) params.record.approvalReviewerDeviceIds = deviceIds;
}
function respondApprovalStorageUnavailable(params) {
	params.context.logGateway?.error?.(`approval ${params.operation} storage failure: ${String(params.error)}`);
	params.respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `approval ${params.operation} unavailable`));
}
/** Registers an approval record and converts manager registration errors to gateway errors. */
function registerPendingApprovalRecord(params) {
	try {
		return params.manager.register(params.record, params.timeoutMs);
	} catch (err) {
		respondApprovalStorageUnavailable({
			...params,
			operation: "request",
			error: err
		});
		return;
	}
}
/** Builds the gateway event payload broadcast when an approval starts waiting. */
function buildRequestedApprovalEvent(record) {
	return {
		id: record.id,
		request: record.request,
		createdAtMs: record.createdAtMs,
		expiresAtMs: record.expiresAtMs
	};
}
/** Validates approval resolve params and narrows the decision to the supported enum. */
function resolveApprovalDecisionParams(params) {
	const rawParams = params.rawParams;
	if (!assertValidParams(rawParams, params.validate, params.methodName, params.respond)) return null;
	if (!isApprovalDecision(rawParams.decision)) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid decision"));
		return null;
	}
	return {
		inputId: rawParams.id,
		decision: rawParams.decision,
		...rawParams.reviewer ? { reviewer: rawParams.reviewer } : {}
	};
}
/** Resolves the approval clients that should receive request or resolution events. */
function resolveApprovalRequestRecipientConnIds(params) {
	return params.context.getApprovalClientConnIds?.({
		approvalKind: params.approvalKind,
		excludeConnId: params.excludeConnId,
		record: params.record,
		filter: (client) => isApprovalRecordVisibleToClient({
			record: params.record,
			client
		})
	}) ?? null;
}
/** Sends a resolved approval only to clients authorized for its live binding. */
function broadcastApprovalResolvedEvent(params) {
	const eventName = params.approvalKind === "system-agent" ? "openclaw.approval.resolved" : `${params.approvalKind}.approval.resolved`;
	const recipientConnIds = resolveApprovalRequestRecipientConnIds({
		approvalKind: params.approvalKind,
		context: params.context,
		record: params.record
	});
	if (recipientConnIds) {
		params.context.broadcastToConnIds(eventName, params.event, recipientConnIds, { dropIfSlow: true });
		return;
	}
	params.context.broadcast(eventName, params.event, { dropIfSlow: true });
}
async function handleApprovalWaitDecision(params) {
	const id = normalizeOptionalString(params.inputId) ?? "";
	if (!id) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "id is required"));
		return;
	}
	const snapshot = params.manager.getSnapshot(id);
	if (!snapshot || !isApprovalRecordVisibleToClient({
		record: snapshot,
		client: params.client ?? null
	})) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "approval expired or not found"));
		return;
	}
	const decisionPromise = params.manager.awaitDecision(id);
	if (!decisionPromise) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "approval expired or not found"));
		return;
	}
	const decision = params.manager.projectDecisionIfActive(id, await decisionPromise);
	const terminalSnapshot = params.manager.getSnapshot(id) ?? snapshot;
	const terminalReason = params.resolveTerminalReason?.(terminalSnapshot);
	params.respond(true, buildWaitResponse(id, decision, terminalSnapshot, terminalReason), void 0);
}
/** Broadcasts or routes a pending approval request, then responds after acceptance/decision. */
async function handlePendingApprovalRequest(params) {
	const releaseHandoff = params.manager.retainForHandoff(params.record.id);
	try {
		const suppressDelivery = params.suppressDelivery === true;
		const approvalClientConnIds = suppressDelivery ? null : resolveApprovalRequestRecipientConnIds({
			approvalKind: params.approvalKind ?? "exec",
			context: params.context,
			record: params.record,
			excludeConnId: params.clientConnId
		});
		if (!suppressDelivery) if (approvalClientConnIds) params.context.broadcastToConnIds(params.requestEventName, params.requestEvent, approvalClientConnIds, { dropIfSlow: true });
		else params.context.broadcast(params.requestEventName, params.requestEvent, { dropIfSlow: true });
		const internalApprovalSubscriberCount = suppressDelivery ? 0 : params.context.approvalEvents?.publishRequested(params.approvalKind ?? "exec", params.requestEvent) ?? 0;
		const hasApprovalClients = suppressDelivery ? false : approvalClientConnIds !== null ? approvalClientConnIds.size > 0 || internalApprovalSubscriberCount > 0 : (params.context.hasExecApprovalClients?.(params.clientConnId) ?? false) || internalApprovalSubscriberCount > 0;
		const deliveredResult = suppressDelivery ? false : params.deliverRequest();
		const delivered = isPromiseLike(deliveredResult) ? await deliveredResult : deliveredResult;
		const hasTurnSourceRoute = !hasApprovalClients && !delivered && hasApprovalTurnSourceRoute({
			turnSourceChannel: params.record.request.turnSourceChannel,
			turnSourceAccountId: params.record.request.turnSourceAccountId,
			approvalKind: params.approvalKind ?? "exec"
		});
		const deliveryRoute = delivered ? "forwarder" : hasApprovalClients ? "approval-client" : hasTurnSourceRoute ? "turn-source" : "none";
		const respondWithDecision = async (decision) => {
			let projectedDecision = params.manager.projectDecisionIfActive(params.record.id, decision);
			if (params.afterDecision) try {
				await params.afterDecision(projectedDecision, params.requestEvent);
			} catch (err) {
				params.context.logGateway?.error?.(`${params.afterDecisionErrorLabel ?? "approval follow-up failed"}: ${String(err)}`);
			}
			projectedDecision = params.manager.projectDecisionIfActive(params.record.id, projectedDecision);
			params.respond(true, {
				id: params.record.id,
				decision: projectedDecision,
				createdAtMs: params.record.createdAtMs,
				expiresAtMs: params.record.expiresAtMs
			}, void 0);
		};
		if (params.requireDeliveryRoute !== false && !params.keepPendingWithoutRoute && !hasApprovalClients && !hasTurnSourceRoute && !delivered) {
			let noRouteWon;
			try {
				noRouteWon = params.manager.expire(params.record.id, "no-approval-route");
			} catch (err) {
				respondApprovalStorageUnavailable({
					...params,
					operation: "request",
					error: err
				});
				return;
			}
			if (!noRouteWon) {
				await respondWithDecision(await params.decisionPromise);
				return;
			}
			params.respond(true, {
				id: params.record.id,
				decision: null,
				createdAtMs: params.record.createdAtMs,
				expiresAtMs: params.record.expiresAtMs
			}, void 0);
			return;
		}
		if (params.twoPhase) params.respond(true, {
			status: "accepted",
			id: params.record.id,
			deliveryRoute,
			createdAtMs: params.record.createdAtMs,
			expiresAtMs: params.record.expiresAtMs
		}, void 0);
		await respondWithDecision(await params.decisionPromise);
	} finally {
		releaseHandoff?.();
	}
}
function respondRepeatedApprovalResolution(record, decision, respond) {
	if (resolveRecordedApprovalDecision(record) === decision) {
		respond(true, { ok: true }, void 0);
		return;
	}
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "approval already resolved", { details: APPROVAL_ALREADY_RESOLVED_DETAILS }));
}
/** Resolves a pending approval and broadcasts the final decision exactly once. */
async function handleApprovalResolve(params) {
	const custody = params.reviewer ? prepareApprovalChannelCustody({
		cfg: params.context.getRuntimeConfig(),
		approvalKind: params.approvalKind,
		reviewer: params.reviewer
	}) : null;
	if (params.reviewer && !custody) {
		respondUnknownOrExpiredApproval(params.respond);
		return;
	}
	const recordFilter = custody ? (record) => custody.authorizes(record) : void 0;
	let resolved;
	try {
		resolved = resolvePendingApprovalRecord({
			manager: params.manager,
			inputId: params.inputId,
			client: params.client,
			exposeAmbiguousPrefixError: params.exposeAmbiguousPrefixError,
			recordFilter
		});
	} catch (err) {
		respondApprovalStorageUnavailable({
			...params,
			operation: "resolve",
			error: err
		});
		return;
	}
	if (!resolved.ok) {
		let resolvedRepeat;
		try {
			resolvedRepeat = resolveResolvedApprovalRecord({
				manager: params.manager,
				inputId: params.inputId,
				client: params.client,
				exposeAmbiguousPrefixError: params.exposeAmbiguousPrefixError,
				recordFilter
			});
		} catch (err) {
			respondApprovalStorageUnavailable({
				...params,
				operation: "resolve",
				error: err
			});
			return;
		}
		if (resolvedRepeat.ok) {
			respondRepeatedApprovalResolution(resolvedRepeat.snapshot, params.decision, params.respond);
			return;
		}
		respondPendingApprovalLookupError({
			respond: params.respond,
			response: resolved.response
		});
		return;
	}
	const validationError = params.validateDecision?.(resolved.snapshot);
	if (validationError) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, validationError.message, validationError.details ? { details: validationError.details } : void 0));
		return;
	}
	const resolvedBy = params.client?.connect?.client?.displayName ?? params.client?.connect?.client?.id ?? null;
	const resolver = custody ? {
		kind: "channel",
		id: custody.resolverId
	} : void 0;
	let ok;
	try {
		ok = params.resolveRecord ? params.resolveRecord({
			approvalId: resolved.approvalId,
			decision: params.decision,
			resolvedBy,
			snapshot: resolved.snapshot,
			resolver
		}) : resolver ? params.manager.resolveDetailed(resolved.approvalId, params.decision, resolver, resolvedBy).outcome === "resolved" : params.manager.resolve(resolved.approvalId, params.decision, resolvedBy);
	} catch (err) {
		respondApprovalStorageUnavailable({
			...params,
			operation: "resolve",
			error: err
		});
		return;
	}
	if (!ok) {
		const raced = params.manager.getSnapshot(resolved.approvalId);
		if (raced && raced.resolvedAtMs !== void 0) {
			respondRepeatedApprovalResolution(raced, params.decision, params.respond);
			return;
		}
		respondUnknownOrExpiredApproval(params.respond);
		return;
	}
	const resolvedEvent = {
		id: resolved.approvalId,
		decision: params.decision,
		resolvedBy,
		ts: Date.now(),
		request: resolved.snapshot.request
	};
	broadcastApprovalResolvedEvent({
		approvalKind: params.approvalKind,
		context: params.context,
		record: resolved.snapshot,
		event: resolvedEvent
	});
	params.context.approvalEvents?.publishResolved(params.approvalKind, resolvedEvent);
	const followUps = [params.forwardResolved ? {
		run: params.forwardResolved,
		errorLabel: params.forwardResolvedErrorLabel ?? "approval resolve follow-up failed"
	} : null, ...params.extraResolvedHandlers ?? []].filter((entry) => Boolean(entry));
	for (const followUp of followUps) try {
		await followUp.run(resolvedEvent);
	} catch (err) {
		params.context.logGateway?.error?.(`${followUp.errorLabel}: ${String(err)}`);
	}
	params.respond(true, { ok: true }, void 0);
}
//#endregion
export { handleApprovalResolve as a, registerPendingApprovalRecord as c, isApprovalRecordVisibleToClient as d, listVisiblePendingApprovalRequests as f, prepareApprovalChannelCustody as h, buildRequestedApprovalEvent as i, resolveApprovalDecisionParams as l, respondPendingApprovalLookupError as m, bindApprovalReviewerDeviceIds as n, handleApprovalWaitDecision as o, resolvePendingApprovalRecord as p, broadcastApprovalResolvedEvent as r, handlePendingApprovalRequest as s, bindApprovalRequesterMetadata as t, respondApprovalStorageUnavailable as u };
