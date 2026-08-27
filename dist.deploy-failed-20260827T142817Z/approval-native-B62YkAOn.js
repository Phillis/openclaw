import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import { i as createNativeApprovalChannelRouteGates, l as shouldSuppressLocalNativeExecApprovalPrompt, n as createChannelApproverDmTargetResolver, r as createChannelNativeOriginTargetResolver } from "./approval-native-helpers-DAB_WEGV.js";
import { n as createApproverRestrictedNativeApprovalCapability } from "./approval-delivery-helpers-1b7VwEWo.js";
import "./approval-delivery-runtime-DC0b_KyF.js";
import { n as createLazyChannelApprovalNativeRuntimeAdapter } from "./approval-handler-adapter-runtime-Tv9LYgST.js";
import "./approval-native-runtime-d-HpbJKY.js";
import { i as resolveGoogleChatAccount, n as listGoogleChatAccountIds, r as resolveDefaultGoogleChatAccountId } from "./accounts-DOsM6Oru.js";
import { i as normalizeGoogleChatTarget, n as isGoogleChatSpaceTarget } from "./targets-BTsK21VQ.js";
import { n as googleChatApprovalAuth, r as normalizeGoogleChatApproverId, t as getGoogleChatApprovalApprovers } from "./approval-auth-Wy5DSzHQ.js";
//#region extensions/googlechat/src/approval-native.ts
const DEFAULT_APPROVAL_FORWARDING_MODE = "session";
function isGoogleChatAccountConfigured(params) {
	const account = resolveGoogleChatAccount(params);
	return account.enabled && account.credentialSource !== "none" && account.tokenStatus !== "configured_unavailable";
}
function hasGoogleChatWebhookApprovalAuthConfig(params) {
	const account = resolveGoogleChatAccount(params).config;
	if (!normalizeOptionalString(account.audience)) return false;
	if (account.audienceType === "project-number") return true;
	return account.audienceType === "app-url";
}
function isGoogleChatApprovalTransportEnabled(params) {
	return isGoogleChatAccountConfigured(params) && hasGoogleChatWebhookApprovalAuthConfig(params);
}
function normalizeGoogleChatForwardTarget(target) {
	if (normalizeLowercaseStringOrEmpty(target.channel) !== "googlechat") return null;
	const to = normalizeGoogleChatTarget(target.to);
	return to ? {
		to,
		accountId: normalizeOptionalString(target.accountId),
		threadId: target.threadId ?? null
	} : null;
}
function resolveTurnSourceGoogleChatOriginTarget(request) {
	if (normalizeLowercaseStringOrEmpty(request.request.turnSourceChannel) !== "googlechat") return null;
	const target = normalizeGoogleChatTarget(request.request.turnSourceTo ?? "");
	if (!target || !isGoogleChatSpaceTarget(target)) return null;
	return {
		to: target,
		accountId: normalizeOptionalString(request.request.turnSourceAccountId),
		threadId: request.request.turnSourceThreadId ?? null
	};
}
const googleChatApprovalRouteGates = createNativeApprovalChannelRouteGates({
	channel: "googlechat",
	defaultForwardingMode: DEFAULT_APPROVAL_FORWARDING_MODE,
	isTransportEnabled: isGoogleChatApprovalTransportEnabled,
	listAccountIds: listGoogleChatAccountIds,
	resolveDefaultAccountId: resolveDefaultGoogleChatAccountId,
	normalizeForwardTarget: normalizeGoogleChatForwardTarget,
	resolveTurnSourceTarget: resolveTurnSourceGoogleChatOriginTarget
});
function isGoogleChatNativeApprovalClientEnabled(params) {
	return googleChatApprovalRouteGates.canAnyApprovalPotentiallyRouteToChannel({
		...params,
		nativeSessionOnly: true
	}) && getGoogleChatApprovalApprovers(params).length > 0;
}
function resolveSessionGoogleChatOriginTarget(sessionTarget) {
	const target = normalizeGoogleChatTarget(sessionTarget.to);
	return target && isGoogleChatSpaceTarget(target) ? {
		to: target,
		threadId: sessionTarget.threadId ?? null
	} : null;
}
function shouldHandleGoogleChatNativeApprovalRequest(params) {
	return googleChatApprovalRouteGates.shouldHandleApprovalRequest(params) && getGoogleChatApprovalApprovers(params).length > 0 && Boolean(resolveTurnSourceGoogleChatOriginTarget(params.request));
}
function shouldSuppressLocalGoogleChatExecApprovalPrompt(params) {
	return shouldSuppressLocalNativeExecApprovalPrompt({
		...params,
		isNativeDeliveryEnabled: isGoogleChatNativeApprovalClientEnabled
	});
}
const googleChatApprovalCapability = createApproverRestrictedNativeApprovalCapability({
	channel: "googlechat",
	channelLabel: "Google Chat",
	describeExecApprovalSetup: ({ accountId }) => {
		const prefix = accountId && accountId !== "default" ? `channels.googlechat.accounts.${accountId}` : "channels.googlechat";
		return `Approve it from the Web UI or terminal UI for now. Google Chat supports native approvals for this account when the webhook and service account are configured. Configure \`${prefix}.allowFrom\` or \`${prefix}.defaultTo\` with numeric \`users/{id}\` approvers.`;
	},
	listAccountIds: listGoogleChatAccountIds,
	hasApprovers: ({ cfg, accountId }) => getGoogleChatApprovalApprovers({
		cfg,
		accountId
	}).length > 0,
	isExecAuthorizedSender: ({ cfg, accountId, senderId }) => googleChatApprovalAuth.authorizeActorAction?.({
		cfg,
		accountId,
		senderId,
		action: "approve",
		approvalKind: "exec"
	})?.authorized ?? false,
	isPluginAuthorizedSender: ({ cfg, accountId, senderId }) => googleChatApprovalAuth.authorizeActorAction?.({
		cfg,
		accountId,
		senderId,
		action: "approve",
		approvalKind: "plugin"
	})?.authorized ?? false,
	isNativeDeliveryEnabled: isGoogleChatNativeApprovalClientEnabled,
	resolveNativeDeliveryMode: () => "channel",
	requireMatchingTurnSourceChannel: true,
	resolveSuppressionAccountId: ({ target, request }) => normalizeOptionalString(target.accountId) ?? normalizeOptionalString(request.request.turnSourceAccountId),
	resolveOriginTarget: createChannelNativeOriginTargetResolver({
		channel: "googlechat",
		shouldHandleRequest: shouldHandleGoogleChatNativeApprovalRequest,
		resolveTurnSourceTarget: resolveTurnSourceGoogleChatOriginTarget,
		resolveSessionTarget: resolveSessionGoogleChatOriginTarget
	}),
	resolveApproverDmTargets: createChannelApproverDmTargetResolver({
		shouldHandleRequest: shouldHandleGoogleChatNativeApprovalRequest,
		resolveApprovers: getGoogleChatApprovalApprovers,
		mapApprover: (approver, params) => {
			const to = normalizeGoogleChatApproverId(approver);
			return to ? {
				to,
				accountId: normalizeOptionalString(params.accountId)
			} : null;
		}
	}),
	nativeRuntime: createLazyChannelApprovalNativeRuntimeAdapter({
		eventKinds: ["exec", "plugin"],
		isConfigured: ({ cfg, accountId }) => isGoogleChatNativeApprovalClientEnabled({
			cfg,
			accountId
		}),
		shouldHandle: ({ cfg, accountId, approvalKind, request }) => shouldHandleGoogleChatNativeApprovalRequest({
			cfg,
			accountId,
			approvalKind,
			request
		}),
		load: async () => (await import("./approval-handler.runtime-DeK_vkuE.js")).googleChatApprovalNativeRuntime
	})
});
//#endregion
export { shouldSuppressLocalGoogleChatExecApprovalPrompt as i, isGoogleChatNativeApprovalClientEnabled as n, shouldHandleGoogleChatNativeApprovalRequest as r, googleChatApprovalCapability as t };
