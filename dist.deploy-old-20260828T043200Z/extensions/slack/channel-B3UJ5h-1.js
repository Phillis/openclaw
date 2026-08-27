import { n as isSlackPluginAccountConfigured } from "./account-configured-sUohAxZr.js";
import { a as resolveSlackAccount, i as resolveDefaultSlackAccountId, l as resolveSlackOperationToken, n as listSlackAccountIds, o as resolveSlackAccountAllowFrom } from "./accounts-Dm_H77gH.js";
import { n as resolveSlackConversationBindingRoute, r as resolveSlackReplyToMode, t as normalizeSlackRouteBindingConfig } from "./conversation-binding-route-DFVLUdYF.js";
import { a as parseSlackTarget, i as normalizeSlackMessagingTarget, n as formatSlackTarget, o as resolveSlackChannelId, r as looksLikeSlackTargetId, t as canonicalizeSlackApiTargetId } from "./target-parsing-BnMD2ZqZ.js";
import { t as slackContextTargetsMatch } from "./targets-Cx5W_n3W.js";
import { At as getSlackApprovalApprovers, B as SLACK_TEXT_LIMIT, Ct as resolveTurnSourceSlackOriginTarget, Dt as getSlackInstallationKind, Et as slackTargetsMatch, H as buildSlackPresentationBlocks, It as resolveSlackExecApprovalTarget, L as SLACK_EDIT_TEXT_MAX_BYTES, Lt as shouldSuppressLocalSlackExecApprovalPrompt, Mt as getSlackExecApprovalApprovers, Nt as isSlackExecApprovalAuthorizedSender, Ot as isSlackWorkspaceInstallation, Pt as isSlackExecApprovalClientEnabled, St as resolveSlackFallbackOriginTarget, Tt as shouldHandleSlackPluginViaForwardingSession, U as canRenderSlackPresentation, W as countSlackTextUtf8Bytes, _t as isSlackAnyNativeApprovalClientEnabled, a as qualifySlackConversationId, b as resolveSlackReplyBlocks, bt as resolveEnterpriseApprovalTeamId, dt as SLACK_PRESENTATION_CAPABILITIES, g as assertSlackDetachedTargetAllowed, gt as hasSlackPluginApprovers, i as resolveSlackGroupToolPolicy, jt as isSlackApprovalAuthorizedSender, o as qualifySlackRoutePeerId, ot as normalizeSlackOutboundText, r as resolveSlackGroupRequireMention, st as renderSlackMessagePresentationFallbackText, vt as normalizeSlackForwardTarget, wt as shouldHandleSlackNativeApprovalRequest, x as resolveSlackReplyDeliveryMessages, xt as resolveSessionSlackOriginTarget, y as resolveSlackReplyBlockResolution, yt as normalizeSlackOriginTarget, zt as resolveSlackAutoThreadId } from "./group-policy-OYHYNnR0.js";
import { n as resolveSlackThreadTsValue, t as normalizeSlackThreadTsCandidate } from "./thread-ts-DUGhaYKq.js";
import { n as extractSlackToolSend, t as describeSlackMessageTool } from "./message-tool-api-CWosHSi5.js";
import { a as PAIRING_APPROVED_MESSAGE, i as DEFAULT_ACCOUNT_ID$1, n as slackConfigAdapter, o as projectCredentialSnapshotFields, r as slackSecurityAdapter, s as resolveConfiguredFromRequiredCredentialStatuses, t as createSlackPluginBase } from "./shared-CPSf9CPX.js";
import { d as getSlackWriteClient, r as formatSlackError } from "./probe-4_aHtVT3.js";
import { n as resolveSlackChannelType, r as resolveSlackConversationInfo } from "./channel-type-DUyG_UxQ.js";
import { t as getOptionalSlackRuntime } from "./runtime-JSVZSWAj.js";
import { a as slackSetupContract, i as createSlackSetupWizardProxy, o as SLACK_CHANNEL } from "./channel.setup-B9T1V792.js";
import { normalizeAccountId } from "openclaw/plugin-sdk/account-resolution";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalLowercaseString, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { adaptScopedAccountAccessor } from "openclaw/plugin-sdk/channel-config-helpers";
import { buildOutboundBaseSessionKey, normalizeMessageChannel, resolveAgentRoute } from "openclaw/plugin-sdk/routing";
import { buildLegacyDmAccountAllowlistAdapter, createAccountScopedAllowlistNameResolver, createFlatAllowlistOverrideResolver } from "openclaw/plugin-sdk/allowlist-config-edit";
import { buildThreadAwareOutboundSessionRoute, createChatChannelPlugin } from "openclaw/plugin-sdk/channel-core";
import { createChannelMessageAdapterFromOutbound, createRuntimeOutboundDelegates, resolveOutboundSendDep } from "openclaw/plugin-sdk/channel-outbound";
import { createPairingPrefixStripper } from "openclaw/plugin-sdk/channel-pairing";
import { createChannelDirectoryAdapter, createRuntimeDirectoryLiveAdapter } from "openclaw/plugin-sdk/directory-runtime";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { logVerbose } from "openclaw/plugin-sdk/runtime-env";
import { createComputedAccountStatusAdapter, createDefaultChannelRuntimeState } from "openclaw/plugin-sdk/status-helpers";
import { sanitizeAssistantVisibleText } from "openclaw/plugin-sdk/text-chunking";
import { createApproverRestrictedNativeApprovalCapability } from "openclaw/plugin-sdk/approval-delivery-runtime";
import { createLazyChannelApprovalNativeRuntimeAdapter } from "openclaw/plugin-sdk/approval-handler-adapter-runtime";
import { createChannelNativeOriginTargetResolver, createNativeApprovalForwardingFallbackSuppressor } from "openclaw/plugin-sdk/approval-native-runtime";
import { readBooleanParam } from "openclaw/plugin-sdk/boolean-param";
import { resolveReactionMessageId } from "openclaw/plugin-sdk/channel-actions";
import { normalizeLegacyInteractiveReply, normalizeMessagePresentation } from "openclaw/plugin-sdk/interactive-runtime";
import { resolveMarkdownTableMode } from "openclaw/plugin-sdk/markdown-table-runtime";
import { readPositiveIntegerParam as readPositiveIntegerParam$1, readStringParam as readStringParam$1 } from "openclaw/plugin-sdk/param-readers";
//#region extensions/slack/src/approval-native.ts
function resolveSlackNativeSuppressionAccountId({ target, request }) {
	return normalizeOptionalString(target.accountId) ?? normalizeOptionalString(request.request.turnSourceAccountId);
}
function shouldConsiderSlackNativeForwardingSuppression(input) {
	if ((normalizeMessageChannel(input.target.channel) ?? input.target.channel) !== "slack") return false;
	if (input.approvalKind === "plugin") return true;
	return normalizeMessageChannel(input.request.request.turnSourceChannel) === "slack";
}
const resolveSlackOriginTarget = createChannelNativeOriginTargetResolver({
	channel: "slack",
	shouldHandleRequest: ({ cfg, accountId, approvalKind, request }) => shouldHandleSlackNativeApprovalRequest({
		cfg,
		accountId,
		approvalKind,
		request
	}),
	resolveTurnSourceTarget: resolveTurnSourceSlackOriginTarget,
	resolveSessionTarget: resolveSessionSlackOriginTarget,
	normalizeTargetForMatch: normalizeSlackOriginTarget,
	targetsMatch: slackTargetsMatch,
	resolveFallbackTarget: resolveSlackFallbackOriginTarget
});
function resolveSlackApproverDmTargets(params) {
	if (!shouldHandleSlackNativeApprovalRequest({
		cfg: params.cfg,
		accountId: params.accountId,
		approvalKind: params.approvalKind,
		request: params.request
	})) return [];
	const approvers = params.approvalKind === "plugin" ? getSlackApprovalApprovers(params) : getSlackExecApprovalApprovers(params);
	const teamId = resolveEnterpriseApprovalTeamId(params.request);
	return approvers.map((approver) => ({ to: formatSlackTarget({
		kind: "user",
		id: approver,
		teamId,
		explicitKind: true
	}) }));
}
const shouldSuppressSlackForwardingFallback = createNativeApprovalForwardingFallbackSuppressor({
	channel: "slack",
	normalizeForwardTarget: normalizeSlackForwardTarget,
	resolveAccountId: ({ target, request }) => resolveSlackNativeSuppressionAccountId({
		target,
		request
	}),
	isSessionRouteEligible: shouldHandleSlackNativeApprovalRequest,
	isExplicitTargetEligible: shouldHandleSlackNativeApprovalRequest,
	resolveOriginTarget: resolveSlackOriginTarget,
	resolveApproverDmTargets: resolveSlackApproverDmTargets,
	targetsMatch: slackTargetsMatch
});
const baseSlackApprovalCapability = createApproverRestrictedNativeApprovalCapability({
	channel: "slack",
	channelLabel: "Slack",
	describeExecApprovalSetup: ({ accountId }) => {
		const prefix = accountId && accountId !== "default" ? `channels.slack.accounts.${accountId}` : "channels.slack";
		return `Approve it from the Web UI or terminal UI for now. Slack supports native exec approvals for this account. Configure \`${prefix}.execApprovals.approvers\` or \`commands.ownerAllowFrom\`; set \`${prefix}.execApprovals.enabled\` to \`auto\` or \`true\`. Unset or \`false\` disables native exec approval delivery.`;
	},
	listAccountIds: listSlackAccountIds,
	hasApprovers: ({ cfg, accountId }) => getSlackExecApprovalApprovers({
		cfg,
		accountId
	}).length > 0,
	isExecAuthorizedSender: ({ cfg, accountId, senderId }) => isSlackExecApprovalAuthorizedSender({
		cfg,
		accountId,
		senderId
	}),
	isPluginAuthorizedSender: ({ cfg, accountId, senderId }) => isSlackApprovalAuthorizedSender({
		cfg,
		accountId,
		senderId
	}),
	isNativeDeliveryEnabled: ({ cfg, accountId }) => isSlackExecApprovalClientEnabled({
		cfg,
		accountId
	}),
	resolveNativeDeliveryMode: ({ cfg, accountId }) => resolveSlackExecApprovalTarget({
		cfg,
		accountId
	}),
	requireMatchingTurnSourceChannel: true,
	resolveSuppressionAccountId: resolveSlackNativeSuppressionAccountId,
	resolveOriginTarget: resolveSlackOriginTarget,
	resolveApproverDmTargets: resolveSlackApproverDmTargets,
	notifyOriginWhenDmOnly: true,
	nativeRuntime: createLazyChannelApprovalNativeRuntimeAdapter({
		eventKinds: ["exec", "plugin"],
		isConfigured: ({ cfg, accountId }) => isSlackAnyNativeApprovalClientEnabled({
			cfg,
			accountId
		}),
		shouldHandle: ({ cfg, accountId, approvalKind, request }) => shouldHandleSlackNativeApprovalRequest({
			cfg,
			accountId,
			approvalKind,
			request
		}),
		load: async () => (await import("./approval-handler.runtime-CHR_9C97.js")).slackApprovalNativeRuntime
	})
});
const baseSlackNativeAdapter = baseSlackApprovalCapability.native;
const slackApprovalCapability = {
	...baseSlackApprovalCapability,
	delivery: {
		...baseSlackApprovalCapability.delivery,
		shouldSuppressForwardingFallback: (input) => {
			if (!shouldConsiderSlackNativeForwardingSuppression(input)) return false;
			const canHandleNative = shouldHandleSlackNativeApprovalRequest({
				cfg: input.cfg,
				accountId: resolveSlackNativeSuppressionAccountId(input),
				approvalKind: input.approvalKind,
				request: input.request
			});
			if (!canHandleNative || input.approvalKind !== "plugin") return canHandleNative;
			return shouldSuppressSlackForwardingFallback(input);
		}
	},
	native: baseSlackNativeAdapter ? {
		...baseSlackNativeAdapter,
		describeDeliveryCapabilities: (params) => {
			const capabilities = baseSlackNativeAdapter.describeDeliveryCapabilities(params);
			const request = params.request;
			const approvalKind = params.approvalKind;
			return {
				...capabilities,
				enabled: shouldHandleSlackNativeApprovalRequest({
					cfg: params.cfg,
					accountId: params.accountId,
					approvalKind,
					request
				}),
				...approvalKind === "plugin" && shouldHandleSlackPluginViaForwardingSession({
					cfg: params.cfg,
					accountId: params.accountId,
					request
				}) ? {
					preferredSurface: "origin",
					supportsApproverDmSurface: hasSlackPluginApprovers({
						cfg: params.cfg,
						accountId: params.accountId
					})
				} : {}
			};
		}
	} : void 0
};
//#endregion
//#region extensions/slack/src/message-action-dispatch.ts
function readSlackForceDocument(params) {
	return readBooleanParam(params, "forceDocument") ?? readBooleanParam(params, "asDocument") ?? false;
}
function resolveSlackPresentationText(content, presentation) {
	return presentation?.blocks.some((block) => block.type === "chart" || block.type === "table") ? renderSlackMessagePresentationFallbackText({
		text: content,
		presentation
	}) : content ?? "";
}
function renderSlackActionPresentation(presentation) {
	if (!presentation) return { usesPresentationTextFallback: false };
	const renderedBlocks = !presentation.blocks.some((block) => (block.type === "text" || block.type === "context") && block.text.trim().length > 3e3) && canRenderSlackPresentation(presentation) ? buildSlackPresentationBlocks(presentation) : void 0;
	const usesPresentationTextFallback = !renderedBlocks || renderedBlocks.length > 50;
	const blocks = usesPresentationTextFallback ? void 0 : renderedBlocks;
	return {
		...blocks?.length ? { blocks } : {},
		usesPresentationTextFallback
	};
}
/** Translate generic channel action requests into Slack-specific tool invocations and payload shapes. */
async function handleSlackMessageAction(params) {
	const { providerId, ctx, invoke, normalizeChannelId, includeReadThreadId = false } = params;
	const { action, cfg, params: actionParams } = ctx;
	const accountId = ctx.accountId ?? void 0;
	const resolveChannelId = () => {
		const channelId = readStringParam$1(actionParams, "channelId") ?? readStringParam$1(actionParams, "to", { required: true });
		return normalizeChannelId ? normalizeChannelId(channelId) : channelId;
	};
	if (action === "send") {
		const to = readStringParam$1(actionParams, "to", { required: true });
		const content = readStringParam$1(actionParams, "message", {
			required: false,
			allowEmpty: true
		});
		const mediaUrl = readStringParam$1(actionParams, "media", { trim: false });
		const presentation = normalizeMessagePresentation(actionParams.presentation);
		const interactive = normalizeLegacyInteractiveReply(actionParams.interactive);
		const hasStructuredContent = Boolean(presentation || interactive?.blocks.length);
		const resolution = resolveSlackReplyBlockResolution({
			text: content,
			presentation,
			interactive
		}, { materializeAuthoredText: hasStructuredContent });
		const preparedMessages = resolution.segments.length > 0 ? resolveSlackReplyDeliveryMessages({
			authoredTextPlacement: resolution.authoredTextPlacement,
			segments: resolution.segments,
			text: content
		}) : [];
		if (!content && preparedMessages.length === 0 && !mediaUrl) throw new Error("Slack send requires message, blocks, or media.");
		const replyBroadcast = readBooleanParam(actionParams, "replyBroadcast");
		if (replyBroadcast && mediaUrl) throw new Error("Slack replyBroadcast is only supported for text or block thread replies.");
		const threadId = readStringParam$1(actionParams, "threadId");
		const replyTo = readStringParam$1(actionParams, "replyTo");
		const topLevel = readBooleanParam(actionParams, "topLevel") === true || actionParams.threadId === null;
		const toolContext = preparedMessages.length > 0 ? {
			...ctx.toolContext,
			preparedMessages
		} : ctx.toolContext;
		return await invoke({
			action: "sendMessage",
			to,
			content: content ?? "",
			mediaUrl: mediaUrl ?? void 0,
			...readSlackForceDocument(actionParams) ? { forceDocument: true } : {},
			accountId,
			threadTs: resolveSlackThreadTsValue({
				replyToId: replyTo,
				threadId
			}),
			...topLevel ? { topLevel: true } : {},
			...replyBroadcast ? { replyBroadcast } : {}
		}, cfg, toolContext);
	}
	if (action === "react") {
		const messageIdRaw = resolveReactionMessageId({
			args: actionParams,
			toolContext: ctx.toolContext
		});
		if (messageIdRaw == null) throw new Error("messageId required. Provide messageId explicitly or react to the current inbound message.");
		const messageId = String(messageIdRaw);
		const emoji = readStringParam$1(actionParams, "emoji", { allowEmpty: true });
		const remove = typeof actionParams.remove === "boolean" ? actionParams.remove : void 0;
		return await invoke({
			action: "react",
			channelId: resolveChannelId(),
			messageId,
			emoji,
			remove,
			accountId
		}, cfg, ctx.toolContext);
	}
	if (action === "reactions") {
		const messageId = readStringParam$1(actionParams, "messageId", { required: true });
		return await invoke({
			action: "reactions",
			channelId: resolveChannelId(),
			messageId,
			limit: actionParams.limit,
			accountId
		}, cfg, ctx.toolContext);
	}
	if (action === "read") {
		const readAction = {
			action: "readMessages",
			channelId: resolveChannelId(),
			limit: actionParams.limit,
			before: readStringParam$1(actionParams, "before"),
			after: readStringParam$1(actionParams, "after"),
			messageId: readStringParam$1(actionParams, "messageId"),
			accountId
		};
		if (includeReadThreadId) readAction.threadId = readStringParam$1(actionParams, "threadId");
		return await invoke(readAction, cfg, ctx.toolContext);
	}
	if (action === "edit") {
		const messageId = readStringParam$1(actionParams, "messageId", { required: true });
		const content = readStringParam$1(actionParams, "message", { allowEmpty: true });
		const presentation = normalizeMessagePresentation(actionParams.presentation);
		const renderedPresentation = renderSlackActionPresentation(presentation);
		const blocks = renderedPresentation.usesPresentationTextFallback ? void 0 : renderedPresentation.blocks;
		const accessibleContent = renderedPresentation.usesPresentationTextFallback ? renderSlackMessagePresentationFallbackText({
			text: content,
			presentation
		}) : resolveSlackPresentationText(content, presentation);
		const tableMode = resolveMarkdownTableMode({
			cfg,
			channel: "slack",
			accountId: accountId ?? resolveDefaultSlackAccountId(cfg)
		});
		if (!blocks && countSlackTextUtf8Bytes(normalizeSlackOutboundText(accessibleContent, { tableMode })) > 4e3) {
			const editSubject = renderedPresentation.usesPresentationTextFallback ? "Slack presentation fallback" : "Slack edit";
			throw new Error(`${editSubject} exceeds the ${String(SLACK_EDIT_TEXT_MAX_BYTES)}-byte edit limit. Send a new message instead.`);
		}
		if (!accessibleContent && !blocks) throw new Error("Slack edit requires message or blocks.");
		return await invoke({
			action: "editMessage",
			channelId: resolveChannelId(),
			messageId,
			content: accessibleContent,
			blocks,
			accountId
		}, cfg, ctx.toolContext);
	}
	if (action === "delete") {
		const messageId = readStringParam$1(actionParams, "messageId", { required: true });
		return await invoke({
			action: "deleteMessage",
			channelId: resolveChannelId(),
			messageId,
			accountId
		}, cfg, ctx.toolContext);
	}
	if (action === "pin" || action === "unpin" || action === "list-pins") {
		const messageId = action === "list-pins" ? void 0 : readStringParam$1(actionParams, "messageId", { required: true });
		return await invoke({
			action: action === "pin" ? "pinMessage" : action === "unpin" ? "unpinMessage" : "listPins",
			channelId: resolveChannelId(),
			messageId,
			accountId
		}, cfg, ctx.toolContext);
	}
	if (action === "member-info") {
		const requesterAccountId = ctx.requesterAccountId ? normalizeAccountId(ctx.requesterAccountId) : void 0;
		const targetAccountId = normalizeAccountId(accountId ?? resolveDefaultSlackAccountId(cfg));
		const requesterUserId = normalizeOptionalLowercaseString(ctx.toolContext?.currentChannelProvider) === "slack" && requesterAccountId !== void 0 && requesterAccountId === targetAccountId ? normalizeOptionalString(ctx.requesterSenderId) : void 0;
		const userId = readStringParam$1(actionParams, "userId") ?? requesterUserId;
		if (!userId) throw new Error("member-info requires a userId outside a current Slack conversation.");
		return await invoke({
			action: "memberInfo",
			userId,
			accountId
		}, cfg, ctx.toolContext);
	}
	if (action === "emoji-list") return await invoke({
		action: "emojiList",
		limit: readPositiveIntegerParam$1(actionParams, "limit", { message: "limit must be a positive integer." }),
		accountId
	}, cfg, ctx.toolContext);
	if (action === "download-file") {
		const fileIdParam = readStringParam$1(actionParams, "fileId");
		const messageIdParam = readStringParam$1(actionParams, "messageId") ?? readStringParam$1(actionParams, "message_id");
		if (!fileIdParam && messageIdParam) throw new Error("download-file requires fileId (the Slack file id, for example F0B0LTT8M36 from event.files[].id), not messageId. Did you mean to pass fileId? messageId is the Slack message timestamp and is used by react / reactions / edit / delete / pin / unpin actions, not download-file.");
		const fileId = readStringParam$1(actionParams, "fileId", { required: true });
		const channelId = readStringParam$1(actionParams, "channelId") ?? readStringParam$1(actionParams, "to");
		const threadId = readStringParam$1(actionParams, "threadId") ?? readStringParam$1(actionParams, "replyTo");
		return await invoke({
			action: "downloadFile",
			fileId,
			channelId: channelId ?? void 0,
			threadId: threadId ?? void 0,
			accountId
		}, cfg, ctx.toolContext);
	}
	if (action === "upload-file") {
		if (readBooleanParam(actionParams, "replyBroadcast")) throw new Error("Slack replyBroadcast is only supported for text or block thread replies.");
		const to = readStringParam$1(actionParams, "to") ?? resolveChannelId();
		const filePath = readStringParam$1(actionParams, "filePath", { trim: false }) ?? readStringParam$1(actionParams, "path", { trim: false }) ?? readStringParam$1(actionParams, "media", { trim: false });
		if (!filePath) throw new Error("upload-file requires filePath, path, or media");
		const threadId = readStringParam$1(actionParams, "threadId") ?? readStringParam$1(actionParams, "replyTo");
		const topLevel = readBooleanParam(actionParams, "topLevel") === true || actionParams.threadId === null;
		return await invoke({
			action: "uploadFile",
			to,
			filePath,
			initialComment: readStringParam$1(actionParams, "initialComment", { allowEmpty: true }) ?? readStringParam$1(actionParams, "message", { allowEmpty: true }) ?? readStringParam$1(actionParams, "caption", { allowEmpty: true }) ?? "",
			filename: readStringParam$1(actionParams, "filename"),
			title: readStringParam$1(actionParams, "title"),
			threadTs: threadId ?? void 0,
			...readSlackForceDocument(actionParams) ? { forceDocument: true } : {},
			...topLevel ? { topLevel: true } : {},
			accountId
		}, cfg, ctx.toolContext);
	}
	throw new Error(`Action ${action} is not supported for provider ${providerId}.`);
}
//#endregion
//#region extensions/slack/src/channel-actions.ts
const SLACK_TOOL_DELIVERY_ACTIONS = /* @__PURE__ */ new Set([
	"deleteMessage",
	"editMessage",
	"pinMessage",
	"react",
	"sendMessage",
	"unpinMessage",
	"uploadFile"
]);
const loadSlackActionRuntime$1 = createLazyRuntimeModule(() => import("./action-runtime.runtime-DFbpfjCu.js"));
function resolveSlackActionContext(ctx, toolContext) {
	if (!toolContext && !ctx.mediaAccess && !ctx.mediaLocalRoots && !ctx.mediaReadFile && !ctx.conversationReadOrigin && !ctx.requesterAccountId && !ctx.requesterSenderId) return;
	return {
		...toolContext,
		mediaAccess: ctx.mediaAccess,
		mediaLocalRoots: ctx.mediaLocalRoots,
		mediaReadFile: ctx.mediaReadFile,
		conversationReadOrigin: ctx.conversationReadOrigin,
		requesterAccountId: ctx.requesterAccountId ?? void 0,
		requesterSenderId: ctx.requesterSenderId ?? void 0
	};
}
function createSlackActions(providerId, options) {
	return {
		providerOwnedReadGates: true,
		describeMessageTool: describeSlackMessageTool,
		extractToolSend: ({ args }) => extractSlackToolSend(args),
		isToolDeliveryAction: ({ args }) => typeof args.action === "string" && SLACK_TOOL_DELIVERY_ACTIONS.has(args.action),
		prepareSendPayload: ({ ctx, to, payload }) => ctx.action === "send" && !shouldUseWorkspaceAwareSlackActionSend(to, ctx.toolContext) ? payload : null,
		handleAction: async (ctx) => {
			return await handleSlackMessageAction({
				providerId,
				ctx,
				normalizeChannelId: normalizeSlackActionChannelTarget,
				includeReadThreadId: true,
				invoke: async (action, cfg, toolContext) => {
					const actionContext = resolveSlackActionContext(ctx, toolContext);
					return await (options?.invoke ? options.invoke(action, cfg, actionContext) : (await loadSlackActionRuntime$1()).handleSlackAction(action, cfg, actionContext));
				}
			});
		}
	};
}
function normalizeSlackActionChannelTarget(raw) {
	const target = parseSlackTarget(raw, { defaultKind: "channel" });
	const channelId = resolveSlackChannelId(raw);
	return formatSlackTarget({
		teamId: target?.teamId,
		kind: "channel",
		id: channelId
	});
}
function shouldUseWorkspaceAwareSlackActionSend(rawTarget, context) {
	const target = parseSlackTarget(rawTarget, { defaultKind: "channel" });
	if (!target || target.teamId) return false;
	for (const rawCurrentTarget of [context?.currentChannelId, context?.currentMessagingTarget]) {
		if (!rawCurrentTarget) continue;
		const currentTarget = parseSlackTarget(rawCurrentTarget);
		if (currentTarget?.teamId && currentTarget.kind === target.kind && currentTarget.id.toLowerCase() === target.id.toLowerCase()) return true;
	}
	return false;
}
//#endregion
//#region extensions/slack/src/conversation-route-owner.ts
function inspectSlackConversationRouteOwner(params) {
	const installationKind = getSlackInstallationKind(params.accountId);
	const direct = params.conversation.kind === "direct";
	const target = parseSlackTarget(params.conversation.peerId, { defaultKind: direct ? "user" : "channel" });
	if (!target || target.kind !== (direct ? "user" : "channel")) return null;
	const targetIsEnterprise = Boolean(target.teamId);
	if (!targetIsEnterprise && (installationKind === "degraded" || !installationKind)) return { kind: "unavailable" };
	if (targetIsEnterprise && installationKind === "workspace") return null;
	const contextTeamId = params.conversation.context?.teamId?.trim();
	if (contextTeamId && target.teamId && contextTeamId.toLowerCase() !== target.teamId.toLowerCase()) return null;
	const teamId = contextTeamId ?? target.teamId;
	if (!direct && params.conversation.nativeChannelId && params.conversation.nativeChannelId.toLowerCase() !== target.id.toLowerCase()) return null;
	const enterpriseRoute = installationKind === "enterprise" || targetIsEnterprise;
	if (enterpriseRoute && !teamId) return null;
	const enterpriseScope = enterpriseRoute && teamId ? { teamId } : void 0;
	const route = resolveAgentRoute({
		cfg: normalizeSlackRouteBindingConfig(params.cfg),
		channel: "slack",
		accountId: params.accountId,
		teamId,
		peer: {
			kind: params.conversation.kind,
			id: qualifySlackRoutePeerId({
				id: target.id,
				kind: direct ? "user" : "channel",
				eventScope: enterpriseScope
			})
		}
	});
	const baseConversationId = qualifySlackConversationId(direct ? `user:${target.id}` : target.id, enterpriseScope);
	const bindingRoute = resolveSlackConversationBindingRoute({
		cfg: params.cfg,
		route,
		accountId: params.accountId,
		baseConversationId,
		runtimeBindingThreadId: params.conversation.threadId,
		bindingsEnabled: !enterpriseRoute,
		touchBinding: false
	});
	if (!bindingRoute.runtimeRoute.bindingOwnerAvailable) return { kind: "unavailable" };
	if (bindingRoute.runtimeRoute.pluginId) return {
		kind: "plugin",
		pluginId: bindingRoute.runtimeRoute.pluginId,
		fallbackAgentId: route.agentId
	};
	return {
		kind: "agent",
		agentId: bindingRoute.runtimeRoute.boundAgentId ?? bindingRoute.configuredRoute?.boundAgentId ?? route.agentId
	};
}
//#endregion
//#region extensions/slack/src/threading-tool-context.ts
function buildSlackThreadingToolContext(params) {
	const account = resolveSlackAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	const configuredReplyToMode = params.context.ReplyToMode ?? resolveSlackReplyToMode(account, params.context.ChatType);
	const messageThreadTs = normalizeSlackThreadTsCandidate(params.context.MessageThreadId);
	const transportThreadTs = normalizeSlackThreadTsCandidate(params.context.TransportThreadId);
	const replyToThreadTs = normalizeSlackThreadTsCandidate(params.context.ReplyToId);
	const currentMessageTs = normalizeSlackThreadTsCandidate(params.context.CurrentMessageId);
	const currentThreadTs = messageThreadTs ?? transportThreadTs ?? replyToThreadTs ?? currentMessageTs;
	const hasExplicitThreadTarget = messageThreadTs != null || transportThreadTs != null || replyToThreadTs != null && currentMessageTs != null && replyToThreadTs !== currentMessageTs;
	const effectiveReplyToMode = hasExplicitThreadTarget ? "all" : configuredReplyToMode;
	const currentMessagingTarget = normalizeOptionalString(params.context.To);
	const parsedMessagingTarget = currentMessagingTarget ? parseSlackTarget(currentMessagingTarget) : void 0;
	const nativeChannelId = normalizeOptionalString(params.context.NativeChannelId);
	return {
		currentChannelId: parsedMessagingTarget?.teamId && nativeChannelId ? formatSlackTarget({
			teamId: parsedMessagingTarget.teamId,
			kind: "channel",
			id: nativeChannelId
		}) : parsedMessagingTarget?.teamId ? currentMessagingTarget : parsedMessagingTarget?.kind === "channel" ? parsedMessagingTarget.id : nativeChannelId ?? currentMessagingTarget,
		currentMessagingTarget,
		currentThreadTs,
		replyToMode: effectiveReplyToMode,
		hasRepliedRef: params.hasRepliedRef,
		sameChannelThreadRequired: hasExplicitThreadTarget
	};
}
//#endregion
//#region extensions/slack/src/channel.ts
const EXTENSION_SHARED_MODULE_ID = "openclaw/plugin-sdk/extension-shared";
const TARGET_RESOLVER_RUNTIME_MODULE_ID = "openclaw/plugin-sdk/target-resolver-runtime";
const loadExtensionSharedSdk = createLazyRuntimeModule(() => import(EXTENSION_SHARED_MODULE_ID));
const loadTargetResolverRuntimeSdk = createLazyRuntimeModule(() => import(TARGET_RESOLVER_RUNTIME_MODULE_ID));
const loadSlackSetupSurfaceModule = createLazyRuntimeModule(() => import("./setup-surface-DgJ-sgeO.js"));
const loadSlackScopesModule = createLazyRuntimeModule(() => import("./scopes-BBrUzpBH.js"));
const loadSlackOutboundAdapterModule = createLazyRuntimeModule(() => import("./outbound-adapter-Bhr6Zxq-.js"));
async function resolveSlackHandleAction() {
	return getOptionalSlackRuntime()?.channel?.slack?.handleSlackAction ?? (await loadSlackActionRuntime()).handleSlackAction;
}
function shouldTreatSlackDeliveredTextAsVisible(params) {
	return params.kind === "block" && typeof params.text === "string" && params.text.trim().length > 0;
}
const loadSlackDirectoryConfigModule = createLazyRuntimeModule(() => import("./directory-config-DqfQ42OV.js").then((n) => n.t));
const loadSlackResolveChannelsModule = createLazyRuntimeModule(() => import("./resolve-channels-DSamDgVs.js").then((n) => n.n));
const loadSlackResolveUsersModule = createLazyRuntimeModule(() => import("./resolve-users-CIzwbaJR.js").then((n) => n.n));
const loadSlackActionRuntime = createLazyRuntimeModule(() => import("./action-runtime.runtime-DFbpfjCu.js"));
const loadSlackSendRuntime = createLazyRuntimeModule(() => import("./send.runtime-Amj_huNJ.js"));
const loadSlackProbeModule = createLazyRuntimeModule(() => import("./probe-4_aHtVT3.js").then((n) => n.n));
const loadSlackMonitorModule = createLazyRuntimeModule(() => import("./monitor-DdIHuR2i.js").then((n) => n.t));
const loadSlackDirectoryLiveModule = createLazyRuntimeModule(() => import("./directory-live-lC6X_Ru-.js").then((n) => n.t));
async function resolveSlackSendContext(params) {
	const account = resolveSlackAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	const target = parseSlackTarget(params.to, { defaultKind: "channel" });
	assertSlackDetachedTargetAllowed(account.accountId, target?.teamId);
	const send = resolveOutboundSendDep(params.deps, "slack") ?? (await loadSlackSendRuntime()).sendMessageSlack;
	const token = resolveSlackOperationToken(account, "write");
	const botToken = account.botToken?.trim();
	const tokenOverride = token && token !== botToken ? token : void 0;
	return {
		send,
		threadTsValue: resolveSlackThreadTsValue(params),
		tokenOverride,
		to: params.to
	};
}
async function setSlackHeartbeatThreadStatus(params) {
	const threadTs = resolveSlackThreadTsValue({ threadId: params.threadId });
	const target = parseSlackTarget(params.to, { defaultKind: "channel" });
	if (!threadTs || !target) return;
	const account = resolveSlackAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	assertSlackDetachedTargetAllowed(account.accountId, target.teamId);
	const botToken = normalizeOptionalString(account.botToken);
	if (!botToken) return;
	try {
		const client = getSlackWriteClient(botToken, { teamId: target.teamId });
		const apiTargetId = canonicalizeSlackApiTargetId(target.kind, target.id, params.to);
		const channelId = target.kind === "channel" ? apiTargetId : await (await loadSlackSendRuntime()).resolveSlackDmChannelId({
			client,
			userId: apiTargetId,
			accountId: account.accountId,
			token: botToken
		});
		await client.assistant.threads.setStatus({
			token: botToken,
			channel_id: channelId,
			thread_ts: threadTs,
			status: params.status
		});
	} catch (error) {
		logVerbose(`slack heartbeat status update failed: ${formatSlackError(error)}`);
	}
}
function withSlackSendOverride(params) {
	return {
		...params.deps,
		slack: async (to, text, opts) => await params.send(to, text, {
			...opts,
			...params.tokenOverride ? { token: params.tokenOverride } : {}
		})
	};
}
function resolveSlackRouteTarget(raw) {
	const target = parseSlackTarget(raw, { defaultKind: "channel" });
	if (!target) return null;
	return {
		to: target.teamId ? target.normalized : target.id,
		chatType: target.kind === "user" ? "direct" : "channel"
	};
}
function normalizeSlackAcpConversationId(raw) {
	const trimmed = normalizeOptionalString(raw);
	if (!trimmed) return null;
	const conversationId = normalizeLowercaseStringOrEmpty(parseSlackTarget(trimmed, { defaultKind: "channel" })?.id ?? trimmed.replace(/^slack:/i, "").replace(/^(?:channel|group|direct|user):/i, ""));
	return conversationId ? { conversationId } : null;
}
function matchSlackAcpConversation(params) {
	const bindingConversationId = normalizeSlackAcpConversationId(params.bindingConversationId)?.conversationId;
	const conversationId = normalizeSlackAcpConversationId(params.conversationId)?.conversationId;
	const parentConversationId = normalizeSlackAcpConversationId(params.parentConversationId)?.conversationId;
	if (!bindingConversationId || !conversationId) return null;
	if (bindingConversationId === conversationId) return {
		conversationId,
		matchPriority: 2
	};
	if (parentConversationId && parentConversationId !== conversationId && bindingConversationId === parentConversationId) return {
		conversationId: parentConversationId,
		matchPriority: 1
	};
	return null;
}
function buildSlackBaseSessionKey(params) {
	return buildOutboundBaseSessionKey({
		...params,
		channel: "slack"
	});
}
function shouldRecoverSlackThreadFromCurrentSession(params) {
	if (params.peerKind === "direct" && (params.cfg.session?.dmScope ?? "main") === "main") return false;
	return true;
}
async function resolveSlackOutboundSessionRoute(params) {
	const parsed = parseSlackTarget(params.target, { defaultKind: "channel" });
	if (!parsed) return null;
	const apiTargetId = canonicalizeSlackApiTargetId(parsed.kind, parsed.id, params.target);
	const isDm = parsed.kind === "user";
	let peerKind = isDm ? "direct" : "channel";
	let peerId = formatSlackTarget(parsed);
	let recipientSessionExact = isDm ? /^[UW][A-Z0-9]{8,}$/i.test(parsed.id) : /^C[A-Z0-9]{8,}$/i.test(parsed.id);
	if (!isDm && /^D/i.test(parsed.id)) {
		const conversation = await resolveSlackConversationInfo({
			cfg: params.cfg,
			accountId: params.accountId,
			channelId: apiTargetId,
			teamId: parsed.teamId
		});
		if (conversation.type !== "dm" || !conversation.user) return null;
		peerKind = "direct";
		peerId = formatSlackTarget({
			teamId: parsed.teamId,
			kind: "user",
			id: conversation.user
		});
		recipientSessionExact = true;
	} else if (!isDm && /^G/i.test(parsed.id)) {
		const channelType = await resolveSlackChannelType({
			cfg: params.cfg,
			accountId: params.accountId,
			channelId: apiTargetId,
			teamId: parsed.teamId
		});
		if (channelType === "group") peerKind = "group";
		if (channelType === "dm") peerKind = "direct";
		recipientSessionExact = channelType !== "unknown";
	}
	const peer = {
		kind: peerKind,
		id: peerId
	};
	const unpartitionedBaseSessionKey = buildSlackBaseSessionKey({
		cfg: params.cfg,
		agentId: params.agentId,
		accountId: params.accountId,
		peer
	});
	const baseSessionKey = parsed.teamId && peerKind === "direct" && (params.cfg.session?.dmScope ?? "main") === "main" ? `${unpartitionedBaseSessionKey}:account:${encodeURIComponent(resolveSlackAccount({
		cfg: params.cfg,
		accountId: params.accountId
	}).accountId).toLowerCase()}:team:${encodeURIComponent(parsed.teamId).toLowerCase()}` : unpartitionedBaseSessionKey;
	return buildThreadAwareOutboundSessionRoute({
		route: {
			sessionKey: baseSessionKey,
			baseSessionKey,
			recipientSessionExact,
			peer,
			chatType: peerKind === "direct" ? "direct" : "channel",
			from: peerKind === "direct" ? `slack:${peerId}` : peerKind === "group" ? `slack:group:${peerId}` : `slack:channel:${peerId}`,
			to: parsed.teamId ? peerId : peerKind === "direct" ? `user:${peerId}` : `channel:${peerId}`
		},
		replyToId: params.replyToId,
		threadId: params.threadId,
		currentSessionKey: params.currentSessionKey,
		canRecoverCurrentThread: () => shouldRecoverSlackThreadFromCurrentSession({
			cfg: params.cfg,
			peerKind
		})
	});
}
function formatSlackScopeDiagnostic(params) {
	const source = params.result.source ? ` (${params.result.source})` : "";
	const label = params.tokenType === "user" ? "User scopes" : "Bot scopes";
	if (params.result.ok && params.result.scopes?.length) return { text: `${label}${source}: ${params.result.scopes.join(", ")}` };
	return {
		text: `${label}: ${params.result.error ?? "scope lookup failed"}`,
		tone: "error"
	};
}
const resolveSlackAllowlistGroupOverrides = createFlatAllowlistOverrideResolver({
	resolveRecord: (account) => account.channels,
	label: (key) => key,
	resolveEntries: (value) => value?.users
});
const resolveSlackAllowlistNames = createAccountScopedAllowlistNameResolver({
	resolveAccount: resolveSlackAccount,
	resolveToken: (account) => normalizeOptionalString(account.userToken) ?? normalizeOptionalString(account.botToken),
	resolveNames: async ({ token, entries }) => (await loadSlackResolveUsersModule()).resolveSlackUserAllowlist({
		token,
		entries
	})
});
const slackChannelOutbound = {
	deliveryMode: "direct",
	chunker: null,
	textChunkLimit: SLACK_TEXT_LIMIT,
	sanitizeText: ({ text }) => sanitizeAssistantVisibleText(text),
	deliveryCapabilities: { durableFinal: {
		text: true,
		media: true,
		payload: true,
		replyTo: true,
		thread: true,
		messageSendingHooks: true
	} },
	shouldTreatDeliveredTextAsVisible: shouldTreatSlackDeliveredTextAsVisible,
	preferFinalAssistantVisibleText: true,
	shouldSuppressLocalPayloadPrompt: ({ cfg, accountId, payload }) => shouldSuppressLocalSlackExecApprovalPrompt({
		cfg,
		accountId,
		payload
	}),
	afterDeliverPayload: async (ctx) => {
		const { slackOutbound } = await loadSlackOutboundAdapterModule();
		await slackOutbound.afterDeliverPayload(ctx);
	},
	presentationCapabilities: SLACK_PRESENTATION_CAPABILITIES,
	...createRuntimeOutboundDelegates({
		getRuntime: loadSlackOutboundAdapterModule,
		renderPresentation: {
			resolve: ({ slackOutbound }) => slackOutbound.renderPresentation,
			unavailableMessage: "Slack outbound presentation rendering is unavailable"
		}
	}),
	sendPayload: async (ctx) => {
		const { send, threadTsValue, tokenOverride, to } = await resolveSlackSendContext({
			cfg: ctx.cfg,
			accountId: ctx.accountId ?? void 0,
			to: ctx.to,
			deps: ctx.deps,
			replyToId: ctx.replyToId,
			threadId: ctx.threadId
		});
		const { slackOutbound } = await loadSlackOutboundAdapterModule();
		return await slackOutbound.sendPayload({
			...ctx,
			to,
			replyToId: threadTsValue,
			threadId: null,
			deliveryQueueId: void 0,
			deps: withSlackSendOverride({
				deps: ctx.deps,
				send,
				tokenOverride
			})
		});
	},
	sendText: async (ctx) => {
		const { send, threadTsValue, tokenOverride, to } = await resolveSlackSendContext({
			cfg: ctx.cfg,
			accountId: ctx.accountId ?? void 0,
			to: ctx.to,
			deps: ctx.deps,
			replyToId: ctx.replyToId,
			threadId: ctx.threadId
		});
		const { slackOutbound } = await loadSlackOutboundAdapterModule();
		return await slackOutbound.sendText({
			...ctx,
			to,
			replyToId: threadTsValue,
			threadId: null,
			deps: withSlackSendOverride({
				deps: ctx.deps,
				send,
				tokenOverride
			})
		});
	},
	sendMedia: async (ctx) => {
		const { send, threadTsValue, tokenOverride, to } = await resolveSlackSendContext({
			cfg: ctx.cfg,
			accountId: ctx.accountId ?? void 0,
			to: ctx.to,
			deps: ctx.deps,
			replyToId: ctx.replyToId,
			threadId: ctx.threadId
		});
		const { slackOutbound } = await loadSlackOutboundAdapterModule();
		return await slackOutbound.sendMedia({
			...ctx,
			to,
			replyToId: threadTsValue,
			threadId: null,
			deliveryQueueId: void 0,
			deps: withSlackSendOverride({
				deps: ctx.deps,
				send,
				tokenOverride
			})
		});
	}
};
const slackMessageAdapterBase = createChannelMessageAdapterFromOutbound({
	id: "slack",
	outbound: slackChannelOutbound,
	live: {
		capabilities: {
			draftPreview: true,
			previewFinalization: true,
			progressUpdates: true,
			nativeStreaming: true
		},
		finalizer: { capabilities: {
			finalEdit: true,
			normalFallback: true,
			discardPending: true
		} }
	}
});
const slackMessageAdapter = {
	...slackMessageAdapterBase,
	durableFinal: {
		capabilities: {
			...slackMessageAdapterBase.durableFinal?.capabilities,
			reconcileUnknownSend: true
		},
		admitDeferredDelivery: ({ cfg, accountId, to }) => {
			const account = resolveSlackAccount({
				cfg,
				accountId
			});
			const target = parseSlackTarget(to, { defaultKind: "channel" });
			try {
				assertSlackDetachedTargetAllowed(account.accountId, target?.teamId);
				return { status: "allowed" };
			} catch (error) {
				return {
					status: "permanent_rejection",
					reason: error instanceof Error ? error.message : String(error)
				};
			}
		},
		reconcileUnknownSendKinds: { text: true },
		reconcileUnknownSend: async (ctx) => await (await loadSlackSendRuntime()).reconcileSlackUnknownSend(ctx)
	}
};
const slackPlugin = createChatChannelPlugin({
	base: {
		...createSlackPluginBase({
			setupWizard: createSlackSetupWizardProxy(loadSlackSetupSurfaceModule),
			setupContract: slackSetupContract
		}),
		allowlist: {
			...buildLegacyDmAccountAllowlistAdapter({
				channelId: "slack",
				resolveAccount: resolveSlackAccount,
				normalize: ({ cfg, accountId, values }) => slackConfigAdapter.formatAllowFrom({
					cfg,
					accountId,
					allowFrom: values
				}),
				resolveDmAllowFrom: (account, { cfg }) => resolveSlackAccountAllowFrom({
					cfg,
					accountId: account.accountId
				}),
				resolveGroupPolicy: (account) => account.groupPolicy,
				resolveGroupOverrides: resolveSlackAllowlistGroupOverrides
			}),
			resolveNames: resolveSlackAllowlistNames
		},
		approvalCapability: slackApprovalCapability,
		groups: {
			resolveRequireMention: resolveSlackGroupRequireMention,
			resolveToolPolicy: resolveSlackGroupToolPolicy
		},
		bindings: {
			compileConfiguredBinding: ({ conversationId }) => normalizeSlackAcpConversationId(conversationId),
			matchInboundConversation: ({ compiledBinding, conversationId, parentConversationId }) => matchSlackAcpConversation({
				bindingConversationId: compiledBinding.conversationId,
				conversationId,
				parentConversationId
			})
		},
		conversationBindings: { isCurrentConversationBindingSupported: ({ accountId }) => isSlackWorkspaceInstallation(accountId) },
		messaging: {
			resolveConversationRouteOwner: inspectSlackConversationRouteOwner,
			targetPrefixes: ["slack"],
			directTargetStyle: "user-prefixed",
			targetIdComparison: "lowercase",
			normalizeTarget: normalizeSlackMessagingTarget,
			resolveDeliveryTarget: ({ conversationId, parentConversationId }) => {
				const parent = parentConversationId?.trim();
				const child = conversationId.trim();
				return parent && parent !== child ? {
					to: normalizeSlackMessagingTarget(parent),
					threadId: child
				} : { to: normalizeSlackMessagingTarget(child) };
			},
			resolveSessionTarget: ({ id }) => {
				return normalizeSlackMessagingTarget(`channel:${id}`);
			},
			inferTargetChatType: ({ to }) => resolveSlackRouteTarget(to)?.chatType,
			resolveOutboundSessionRoute: async (params) => await resolveSlackOutboundSessionRoute(params),
			hasStructuredReplyPayload: ({ payload }) => {
				try {
					return Boolean(resolveSlackReplyBlocks(payload)?.length);
				} catch {
					return false;
				}
			},
			targetResolver: {
				looksLikeId: looksLikeSlackTargetId,
				hint: "<channelId|user:ID|channel:ID>",
				resolveTarget: async ({ input }) => {
					const parsed = resolveSlackRouteTarget(input);
					if (!parsed) return null;
					return {
						to: parsed.to,
						kind: parsed.chatType === "direct" ? "user" : "group",
						source: "normalized"
					};
				}
			}
		},
		directory: createChannelDirectoryAdapter({
			listPeers: async (params) => (await loadSlackDirectoryConfigModule()).listSlackDirectoryPeersFromConfig(params),
			listGroups: async (params) => (await loadSlackDirectoryConfigModule()).listSlackDirectoryGroupsFromConfig(params),
			...createRuntimeDirectoryLiveAdapter({
				getRuntime: loadSlackDirectoryLiveModule,
				self: (runtime) => runtime.getSlackDirectorySelfLive,
				listPeersLive: (runtime) => runtime.listSlackDirectoryPeersLive,
				listGroupsLive: (runtime) => runtime.listSlackDirectoryGroupsLive
			})
		}),
		resolver: { resolveTargets: async ({ cfg, accountId, inputs, kind }) => {
			const toResolvedTarget = (entry, note) => ({
				input: entry.input,
				resolved: entry.resolved,
				id: entry.id,
				name: entry.name,
				note
			});
			const account = resolveSlackAccount({
				cfg,
				accountId
			});
			const { resolveTargetsWithOptionalToken } = await loadTargetResolverRuntimeSdk();
			if (kind === "group") return resolveTargetsWithOptionalToken({
				token: normalizeOptionalString(account.userToken) ?? normalizeOptionalString(account.botToken),
				inputs,
				missingTokenNote: "missing Slack token",
				resolveWithToken: async ({ token, inputs: inputsValue }) => (await loadSlackResolveChannelsModule()).resolveSlackChannelAllowlist({
					token,
					entries: inputsValue
				}),
				mapResolved: (entry) => toResolvedTarget(entry, entry.archived ? "archived" : void 0)
			});
			return resolveTargetsWithOptionalToken({
				token: normalizeOptionalString(account.userToken) ?? normalizeOptionalString(account.botToken),
				inputs,
				missingTokenNote: "missing Slack token",
				resolveWithToken: async ({ token, inputs: inputsLocal }) => (await loadSlackResolveUsersModule()).resolveSlackUserAllowlist({
					token,
					entries: inputsLocal
				}),
				mapResolved: (entry) => toResolvedTarget(entry, entry.note)
			});
		} },
		actions: createSlackActions(SLACK_CHANNEL, { invoke: async (action, cfg, toolContext) => await (await resolveSlackHandleAction())(action, cfg, toolContext) }),
		message: slackMessageAdapter,
		heartbeat: {
			sendTyping: async ({ cfg, to, accountId, threadId }) => {
				await setSlackHeartbeatThreadStatus({
					cfg,
					to,
					accountId,
					threadId,
					status: "is typing..."
				});
			},
			clearTyping: async ({ cfg, to, accountId, threadId }) => {
				await setSlackHeartbeatThreadStatus({
					cfg,
					to,
					accountId,
					threadId,
					status: ""
				});
			}
		},
		status: createComputedAccountStatusAdapter({
			defaultRuntime: createDefaultChannelRuntimeState(DEFAULT_ACCOUNT_ID$1),
			buildChannelSummary: async ({ snapshot }) => {
				const { buildPassiveProbedChannelStatusSummary } = await loadExtensionSharedSdk();
				return buildPassiveProbedChannelStatusSummary(snapshot, snapshot.identity === "user" ? {
					postAs: "user",
					userTokenSource: snapshot.userTokenSource ?? "none",
					...snapshot.mode === "http" ? { signingSecretSource: snapshot.signingSecretSource ?? "none" } : { appTokenSource: snapshot.appTokenSource ?? "none" }
				} : {
					botTokenSource: snapshot.botTokenSource ?? "none",
					appTokenSource: snapshot.appTokenSource ?? "none"
				});
			},
			probeAccount: async ({ account, timeoutMs }) => {
				const token = account.identity === "user" ? account.userToken?.trim() : account.botToken?.trim();
				if (!token) return {
					ok: false,
					error: account.identity === "user" ? "missing user token" : "missing token"
				};
				return await (await loadSlackProbeModule()).probeSlack(token, timeoutMs, {
					accountId: account.accountId,
					...account.identity === "user" ? { identity: "user" } : {}
				});
			},
			formatCapabilitiesProbe: ({ probe }) => {
				const slackProbe = probe;
				const lines = [];
				if (slackProbe?.warning) lines.push({
					text: `Warning: ${slackProbe.warning}`,
					tone: "warn"
				});
				if (slackProbe?.bot?.name) lines.push({ text: `Bot: @${slackProbe.bot.name}` });
				if (slackProbe?.user?.id || slackProbe?.user?.name) {
					const name = slackProbe.user.name ? `@${slackProbe.user.name}` : "unknown";
					const id = slackProbe.user.id ? ` (${slackProbe.user.id})` : "";
					lines.push({ text: `User identity: ${name}${id}` });
				}
				if (slackProbe?.team?.name || slackProbe?.team?.id) {
					const id = slackProbe.team?.id ? ` (${slackProbe.team.id})` : "";
					lines.push({ text: `Team: ${slackProbe.team?.name ?? "unknown"}${id}` });
				}
				return lines;
			},
			buildCapabilitiesDiagnostics: async ({ account, timeoutMs }) => {
				const lines = [];
				const details = {};
				const botToken = account.botToken?.trim();
				const userToken = account.userToken?.trim();
				const { fetchSlackScopes } = await loadSlackScopesModule();
				if (account.identity === "user") {
					const userScopes = userToken ? await fetchSlackScopes(userToken, timeoutMs) : {
						ok: false,
						error: "Slack user token missing."
					};
					lines.push(formatSlackScopeDiagnostic({
						tokenType: "user",
						result: userScopes
					}));
					details.userScopes = userScopes;
				} else {
					const botScopes = botToken ? await fetchSlackScopes(botToken, timeoutMs) : {
						ok: false,
						error: "Slack bot token missing."
					};
					lines.push(formatSlackScopeDiagnostic({
						tokenType: "bot",
						result: botScopes
					}));
					details.botScopes = botScopes;
				}
				if (account.identity !== "user" && userToken) {
					const userScopes = await fetchSlackScopes(userToken, timeoutMs);
					lines.push(formatSlackScopeDiagnostic({
						tokenType: "user",
						result: userScopes
					}));
					details.userScopes = userScopes;
				}
				return {
					lines,
					details
				};
			},
			resolveAccountSnapshot: ({ account }) => {
				const mode = account.config.mode ?? "socket";
				const identity = account.config.postAs ?? "bot";
				const configured = (mode === "http" ? resolveConfiguredFromRequiredCredentialStatuses(account, [identity === "user" ? "userTokenStatus" : "botTokenStatus", "signingSecretStatus"]) : mode === "socket" ? resolveConfiguredFromRequiredCredentialStatuses(account, [identity === "user" ? "userTokenStatus" : "botTokenStatus", "appTokenStatus"]) : void 0) ?? isSlackPluginAccountConfigured(account);
				return {
					accountId: account.accountId,
					name: account.name,
					enabled: account.enabled,
					configured,
					extra: {
						...projectCredentialSnapshotFields(account),
						...identity === "user" ? {
							identity,
							mode,
							userTokenSource: account.userTokenSource
						} : {}
					}
				};
			}
		}),
		gateway: { startAccount: async (ctx) => {
			const account = ctx.account;
			const botToken = account.botToken?.trim();
			const appToken = account.appToken?.trim();
			ctx.log?.info(`[${account.accountId}] starting provider`);
			return (await loadSlackMonitorModule()).monitorSlackProvider({
				botToken: botToken ?? "",
				appToken: appToken ?? "",
				accountId: account.accountId,
				config: ctx.cfg,
				runtime: ctx.runtime,
				channelRuntime: ctx.channelRuntime,
				abortSignal: ctx.abortSignal,
				mediaMaxMb: account.config.mediaMaxMb,
				slashCommand: account.config.slashCommand,
				setStatus: ctx.setStatus,
				getStatus: ctx.getStatus
			});
		} },
		mentions: { stripPatterns: () => ["<@[^>\\s]+>"] }
	},
	pairing: {
		idLabel: "slackUserId",
		normalizeAllowEntry: createPairingPrefixStripper(/^(slack|user):/i),
		resolveApprovalStoreEntry: ({ id, meta }) => {
			const senderId = meta?.senderId ?? id;
			return formatSlackTarget({
				teamId: meta?.teamId,
				kind: "user",
				id: senderId
			});
		},
		notifyApproval: async ({ cfg, id, accountId, meta }) => {
			const account = resolveSlackAccount({
				cfg,
				accountId: accountId ?? resolveDefaultSlackAccountId(cfg)
			});
			const { sendMessageSlack } = await loadSlackSendRuntime();
			const token = resolveSlackOperationToken(account, "write");
			const senderId = meta?.senderId ?? id;
			await sendMessageSlack(formatSlackTarget({
				teamId: meta?.teamId,
				kind: "user",
				id: senderId,
				explicitKind: true
			}), PAIRING_APPROVED_MESSAGE, {
				cfg,
				accountId: account.accountId,
				...token ? { token } : {}
			});
		}
	},
	security: slackSecurityAdapter,
	threading: {
		threadAddressing: "message",
		matchesToolContextTarget: ({ target, toolContext }) => slackContextTargetsMatch(target, toolContext),
		scopedAccountReplyToMode: {
			resolveAccount: adaptScopedAccountAccessor(resolveSlackAccount),
			resolveReplyToMode: (account, chatType) => resolveSlackReplyToMode(account, chatType)
		},
		allowExplicitReplyTagsWhenOff: false,
		buildToolContext: (params) => buildSlackThreadingToolContext(params),
		resolveAutoThreadId: ({ to, toolContext, replyToId }) => normalizeSlackThreadTsCandidate(replyToId) ? void 0 : normalizeSlackThreadTsCandidate(resolveSlackAutoThreadId({
			to,
			toolContext
		})),
		resolveReplyTransport: ({ threadId, replyToId, replyToIsExplicit, replyDelivery }) => {
			const allowedReplyToId = replyDelivery?.replyToMode === "off" ? void 0 : replyToId;
			const preferThreadId = replyToIsExplicit === false;
			const resolvedReplyToId = resolveSlackThreadTsValue({
				replyToId: preferThreadId ? threadId : allowedReplyToId,
				threadId: preferThreadId ? allowedReplyToId : threadId
			});
			return {
				replyToId: replyDelivery?.replyToMode === "off" && !resolvedReplyToId ? null : resolvedReplyToId,
				threadId: null
			};
		}
	},
	outbound: slackChannelOutbound
});
//#endregion
export { buildSlackThreadingToolContext as n, slackPlugin as t };
