import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-BH0zJUew.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import { d as stripTargetKindPrefix, t as buildChannelOutboundSessionRoute, u as stripChannelTargetPrefix } from "./core-CQsT-38z.js";
import { i as createNativeApprovalChannelRouteGates, l as shouldSuppressLocalNativeExecApprovalPrompt, n as createChannelApproverDmTargetResolver, o as createNativeApprovalMessagingTargetResolvers, r as createChannelNativeOriginTargetResolver } from "./approval-native-helpers-CbSRDP2R.js";
import { n as createApproverRestrictedNativeApprovalCapability } from "./approval-delivery-helpers-BCnTGPBj.js";
import "./approval-delivery-runtime-BKj0Y5Bk.js";
import { n as createLazyChannelApprovalNativeRuntimeAdapter } from "./approval-handler-adapter-runtime-Tv9LYgST.js";
import "./approval-native-runtime-Cy7LXjtb.js";
import "./channel-core-DYDgmix_.js";
import { r as normalizeMSTeamsConversationId, t as extractMSTeamsConversationMessageId } from "./inbound-Clg3k_wg.js";
import { r as normalizeMSTeamsMessagingTarget } from "./resolve-allowlist-Cd7Hfq6b.js";
import { n as getMSTeamsApprovalApprovers, r as msTeamsApprovalAuth, t as resolveMSTeamsRouteSessionKey } from "./thread-session-CIfzUSzJ.js";
import { r as resolveMSTeamsAccount, t as msteamsConfigAdapter } from "./channel-config-C8JtQsBg.js";
//#region extensions/msteams/src/approval-native.ts
function isMSTeamsApprovalTransportEnabled(params) {
	if (params.accountId && normalizeAccountId(params.accountId) !== "default") return false;
	const account = resolveMSTeamsAccount(params.cfg);
	return account.enabled && account.configured && account.tokenStatus === "available";
}
const msTeamsMessagingTargetResolvers = createNativeApprovalMessagingTargetResolvers({
	channel: "msteams",
	normalizeTo: normalizeMSTeamsMessagingTarget
});
const msTeamsApprovalTargetResolvers = {
	...msTeamsMessagingTargetResolvers,
	resolveTurnSourceTarget: (request) => {
		const target = msTeamsMessagingTargetResolvers.resolveTurnSourceTarget(request);
		return target ? {
			...target,
			threadId: request.request.turnSourceThreadId ?? null
		} : null;
	},
	resolveSessionTarget: (sessionTarget) => {
		const target = msTeamsMessagingTargetResolvers.resolveSessionTarget(sessionTarget);
		return target ? {
			...target,
			threadId: sessionTarget.threadId ?? null
		} : null;
	}
};
const msTeamsApprovalRouteGates = createNativeApprovalChannelRouteGates({
	channel: "msteams",
	defaultForwardingMode: "session",
	isTransportEnabled: isMSTeamsApprovalTransportEnabled,
	listAccountIds: msteamsConfigAdapter.listAccountIds,
	resolveDefaultAccountId: () => DEFAULT_ACCOUNT_ID,
	normalizeForwardTarget: msTeamsApprovalTargetResolvers.normalizeForwardTarget,
	resolveTurnSourceTarget: msTeamsApprovalTargetResolvers.resolveTurnSourceTarget
});
function isMSTeamsNativeApprovalClientEnabled(params) {
	return msTeamsApprovalRouteGates.canAnyApprovalPotentiallyRouteToChannel({
		...params,
		nativeSessionOnly: true
	}) && getMSTeamsApprovalApprovers(params).length > 0;
}
function shouldHandleMSTeamsNativeApprovalRequest(params) {
	return msTeamsApprovalRouteGates.shouldHandleApprovalRequest(params) && getMSTeamsApprovalApprovers(params).length > 0 && Boolean(msTeamsApprovalTargetResolvers.resolveTurnSourceTarget(params.request));
}
function shouldSuppressLocalMSTeamsExecApprovalPrompt(params) {
	return shouldSuppressLocalNativeExecApprovalPrompt({
		...params,
		isNativeDeliveryEnabled: isMSTeamsNativeApprovalClientEnabled
	});
}
const resolveMSTeamsOriginTarget = createChannelNativeOriginTargetResolver({
	channel: "msteams",
	shouldHandleRequest: shouldHandleMSTeamsNativeApprovalRequest,
	resolveTurnSourceTarget: msTeamsApprovalTargetResolvers.resolveTurnSourceTarget,
	resolveSessionTarget: msTeamsApprovalTargetResolvers.resolveSessionTarget,
	normalizeTarget: msTeamsApprovalTargetResolvers.normalizeTarget
});
const msTeamsLazyApprovalNativeRuntime = createLazyChannelApprovalNativeRuntimeAdapter({
	eventKinds: ["exec", "plugin"],
	isConfigured: ({ cfg, accountId }) => isMSTeamsNativeApprovalClientEnabled({
		cfg,
		accountId
	}),
	shouldHandle: ({ cfg, accountId, approvalKind, request }) => shouldHandleMSTeamsNativeApprovalRequest({
		cfg,
		accountId,
		approvalKind,
		request
	}),
	load: async () => {
		const { msTeamsApprovalNativeRuntime } = await import("./approval-handler.runtime-Bjezk_zK.js");
		return msTeamsApprovalNativeRuntime;
	}
});
const resolveMSTeamsApproverDmTargets = createChannelApproverDmTargetResolver({
	shouldHandleRequest: shouldHandleMSTeamsNativeApprovalRequest,
	resolveApprovers: getMSTeamsApprovalApprovers,
	mapApprover: (approver, params) => ({
		to: `user:${approver}`,
		accountId: normalizeOptionalString(params.accountId)
	})
});
const msTeamsApprovalCapability = {
	...createApproverRestrictedNativeApprovalCapability({
		channel: "msteams",
		channelLabel: "Microsoft Teams",
		describeExecApprovalSetup: () => "Approve it from the Web UI or terminal UI for now. Microsoft Teams supports native approvals when the bot is configured. Configure `channels.msteams.allowFrom` or `channels.msteams.defaultTo` with Microsoft Entra object ID approvers.",
		listAccountIds: msteamsConfigAdapter.listAccountIds,
		hasApprovers: ({ cfg, accountId }) => getMSTeamsApprovalApprovers({
			cfg,
			accountId
		}).length > 0,
		isExecAuthorizedSender: ({ cfg, accountId, senderId }) => msTeamsApprovalAuth.authorizeActorAction?.({
			cfg,
			accountId,
			senderId,
			action: "approve",
			approvalKind: "exec"
		})?.authorized ?? false,
		isPluginAuthorizedSender: ({ cfg, accountId, senderId }) => msTeamsApprovalAuth.authorizeActorAction?.({
			cfg,
			accountId,
			senderId,
			action: "approve",
			approvalKind: "plugin"
		})?.authorized ?? false,
		isNativeDeliveryEnabled: isMSTeamsNativeApprovalClientEnabled,
		resolveNativeDeliveryMode: () => "channel",
		requireMatchingTurnSourceChannel: true,
		resolveSuppressionAccountId: ({ target, request }) => normalizeOptionalString(target.accountId) ?? normalizeOptionalString(request.request.turnSourceAccountId),
		resolveOriginTarget: resolveMSTeamsOriginTarget,
		resolveApproverDmTargets: resolveMSTeamsApproverDmTargets,
		nativeRuntime: msTeamsLazyApprovalNativeRuntime
	}),
	authorizeActorAction: (params) => msTeamsApprovalAuth.authorizeActorAction?.(params)
};
//#endregion
//#region extensions/msteams/src/session-route.ts
function inferMSTeamsTargetChatType(raw) {
	const target = stripChannelTargetPrefix(raw, "msteams", "teams");
	if (!target) return;
	const lower = normalizeLowercaseStringOrEmpty(target);
	const rawId = stripTargetKindPrefix(target);
	if (!rawId) return;
	const conversationId = normalizeMSTeamsConversationId(rawId);
	if (lower.startsWith("user:") || /^[0-9a-f-]{16,}$/i.test(conversationId)) return "direct";
	if (/@thread\.tacv2/i.test(conversationId)) return "channel";
	return /^19:.+@thread\.(?:skype|v2)$/i.test(conversationId) ? "group" : void 0;
}
function resolveMSTeamsOutboundSessionRoute(params) {
	const trimmed = stripChannelTargetPrefix(params.target, "msteams", "teams");
	if (!trimmed) return null;
	const resolvedKind = params.resolvedTarget?.kind;
	const targetChatType = inferMSTeamsTargetChatType(trimmed);
	const isUser = resolvedKind === "user" || targetChatType === "direct";
	const rawId = stripTargetKindPrefix(trimmed);
	if (!rawId) return null;
	const conversationId = normalizeMSTeamsConversationId(rawId);
	const isChannel = !isUser && targetChatType === "channel";
	const embeddedThreadId = extractMSTeamsConversationMessageId(rawId);
	const explicitThreadId = params.threadId ?? params.replyToId;
	const channelThreadId = embeddedThreadId ?? (explicitThreadId !== void 0 && explicitThreadId !== null ? String(explicitThreadId) : void 0);
	const isCanonicalUserId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(conversationId);
	const recipientSessionExact = isUser && isCanonicalUserId || (isChannel ? channelThreadId !== void 0 : resolvedKind === "group");
	const route = buildChannelOutboundSessionRoute({
		cfg: params.cfg,
		agentId: params.agentId,
		channel: "msteams",
		accountId: params.accountId,
		recipientSessionExact,
		peer: {
			kind: isUser ? "direct" : isChannel ? "channel" : "group",
			id: conversationId
		},
		chatType: isUser ? "direct" : isChannel ? "channel" : "group",
		from: isUser ? `msteams:${conversationId}` : isChannel ? `msteams:channel:${conversationId}` : `msteams:group:${conversationId}`,
		to: isUser ? `user:${conversationId}` : `conversation:${conversationId}`
	});
	return isChannel ? {
		...route,
		sessionKey: resolveMSTeamsRouteSessionKey({
			baseSessionKey: route.baseSessionKey,
			isChannel: true,
			conversationMessageId: channelThreadId
		}),
		...channelThreadId !== void 0 ? { threadId: channelThreadId } : {}
	} : route;
}
//#endregion
export { shouldHandleMSTeamsNativeApprovalRequest as a, msTeamsApprovalCapability as i, resolveMSTeamsOutboundSessionRoute as n, shouldSuppressLocalMSTeamsExecApprovalPrompt as o, isMSTeamsNativeApprovalClientEnabled as r, inferMSTeamsTargetChatType as t };
