import { n as isSlackPluginAccountConfigured } from "./account-configured-sUohAxZr.js";
import { a as resolveSlackAccount, i as resolveDefaultSlackAccountId, n as listSlackAccountIds, o as resolveSlackAccountAllowFrom, r as mergeSlackAccountConfig } from "./accounts-Dm_H77gH.js";
import { a as parseSlackTarget, n as formatSlackTarget, t as canonicalizeSlackApiTargetId } from "./target-parsing-BnMD2ZqZ.js";
import { t as slackContextTargetsMatch } from "./targets-Cx5W_n3W.js";
import { normalizeAccountId } from "openclaw/plugin-sdk/account-resolution";
import { asOptionalRecord, normalizeLowercaseStringOrEmpty, normalizeOptionalLowercaseString, normalizeOptionalString, normalizeStringifiedOptionalString, readNonBlankString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { normalizeMessageChannel } from "openclaw/plugin-sdk/routing";
import { FormatCapabilityProfile, chunkTextForOutbound, markdownToIR, renderMarkdownIRChunksWithinLimit, renderMarkdownWithMarkers } from "openclaw/plugin-sdk/text-chunking";
import { isSingleUseReplyToMode } from "openclaw/plugin-sdk/reply-reference";
import { buildChannelKeyCandidates } from "openclaw/plugin-sdk/channel-targets";
import { createNativeApprovalChannelRouteGates, doesApprovalRequestSelectChannelAccount, resolveApprovalKind, resolveApprovalRequestSessionConversation } from "openclaw/plugin-sdk/approval-native-runtime";
import { createChannelApprovalAuth, resolveApprovalApprovers } from "openclaw/plugin-sdk/approval-auth-runtime";
import { createChannelExecApprovalProfile, isChannelExecApprovalClientEnabledFromConfig, isChannelExecApprovalTargetRecipient, matchesApprovalRequestFilters } from "openclaw/plugin-sdk/approval-client-runtime";
import { channelRouteTargetsMatchExact, stringifyRouteThreadId } from "openclaw/plugin-sdk/channel-route";
import { resolveGlobalMap } from "openclaw/plugin-sdk/global-singleton";
import { legacyInteractiveReplyToPresentation, normalizeMessagePresentation, renderMessagePresentationChartFallbackText, renderMessagePresentationFallbackText, renderMessagePresentationTableFallbackText, resolveMessagePresentationButtonAction, resolveMessagePresentationOptionAction } from "openclaw/plugin-sdk/interactive-runtime";
import { parseExecApprovalCommandText } from "openclaw/plugin-sdk/approval-reply-runtime";
import { resolveAskUserQuestionOptionIndex, resolveAskUserQuestionOptionIndices } from "openclaw/plugin-sdk/reply-payload";
import { buildApprovalResolutionRef } from "openclaw/plugin-sdk/approval-reference-runtime";
import { eastAsianWidthType } from "get-east-asian-width";
import { questionGatewayRuntime } from "openclaw/plugin-sdk/question-gateway-runtime";
import { sliceUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { readResponseTextLimited } from "openclaw/plugin-sdk/provider-http";
import { compileAllowlist, resolveCompiledAllowlistMatch } from "openclaw/plugin-sdk/allow-from";
import { normalizeHyphenSlug, normalizeStringEntries as normalizeStringEntries$1, normalizeStringEntriesLower } from "openclaw/plugin-sdk/string-normalization-runtime";
import { resolveScopeRequireMention, resolveScopeToolsPolicy } from "openclaw/plugin-sdk/channel-policy";
//#region extensions/slack/src/action-threading.ts
const SLACK_PRIVATE_ACTION_DELIVERY_RESULT = Symbol("slack.action.delivery-result");
function resolveSlackAutoThreadId(params) {
	const context = params.toolContext;
	if (!context?.currentChannelId && !context?.currentMessagingTarget) return;
	if (!slackContextTargetsMatch(params.to, context)) return;
	if (!context.currentThreadTs) {
		if (context.sameChannelThreadRequired) throw new Error("Slack thread context is required for same-channel replies from a threaded Slack turn. Set topLevel=true or threadId=null to post at the channel root.");
		return;
	}
	if (context.replyToMode !== "all" && !isSingleUseReplyToMode(context.replyToMode ?? "off")) return;
	if (isSingleUseReplyToMode(context.replyToMode ?? "off") && context.hasRepliedRef?.value) return;
	return context.currentThreadTs;
}
//#endregion
//#region extensions/slack/src/exec-approvals.ts
function normalizeSlackUserLikeId(value) {
	const upper = value.toUpperCase();
	return /^[UW][A-Z0-9]+$/.test(upper) ? upper : void 0;
}
function normalizeSlackApproverId(value) {
	const trimmed = normalizeStringifiedOptionalString(value);
	if (!trimmed) return;
	const prefixed = trimmed.match(/^(?:slack|user):([A-Z0-9]+)$/i);
	if (prefixed?.[1]) return normalizeSlackUserLikeId(prefixed[1]);
	const mention = trimmed.match(/^<@([A-Z0-9]+)>$/i);
	if (mention?.[1]) return normalizeSlackUserLikeId(mention[1]);
	return normalizeSlackUserLikeId(trimmed);
}
function resolveSlackOwnerApprovers(cfg) {
	const ownerAllowFrom = cfg.commands?.ownerAllowFrom;
	if (!Array.isArray(ownerAllowFrom) || ownerAllowFrom.length === 0) return [];
	return resolveApprovalApprovers({
		explicit: ownerAllowFrom,
		normalizeApprover: normalizeSlackApproverId
	});
}
function getSlackExecApprovalApprovers(params) {
	const account = resolveSlackAccount(params).config;
	return resolveApprovalApprovers({
		explicit: account.execApprovals?.approvers ?? resolveSlackOwnerApprovers(params.cfg),
		normalizeApprover: normalizeSlackApproverId
	});
}
function isSlackExecApprovalTargetRecipient(params) {
	return isChannelExecApprovalTargetRecipient({
		...params,
		channel: "slack",
		normalizeSenderId: normalizeSlackApproverId,
		matchTarget: ({ target, normalizedSenderId }) => normalizeSlackApproverId(target.to) === normalizedSenderId
	});
}
const slackExecApprovalProfile = createChannelExecApprovalProfile({
	resolveConfig: (params) => resolveSlackAccount(params).config.execApprovals,
	resolveApprovers: getSlackExecApprovalApprovers,
	normalizeSenderId: normalizeSlackApproverId,
	isTargetRecipient: isSlackExecApprovalTargetRecipient
});
const isSlackExecApprovalClientEnabled = slackExecApprovalProfile.isClientEnabled;
const isSlackExecApprovalAuthorizedSender = slackExecApprovalProfile.isAuthorizedSender;
const resolveSlackExecApprovalTarget = slackExecApprovalProfile.resolveTarget;
const shouldSuppressLocalSlackExecApprovalPrompt = slackExecApprovalProfile.shouldSuppressLocalPrompt;
//#endregion
//#region extensions/slack/src/approval-auth.ts
const slackApproval = createChannelApprovalAuth({
	channelLabel: "Slack",
	resolveInputs: ({ cfg, accountId }) => {
		const account = resolveSlackAccount({
			cfg,
			accountId
		}).config;
		return {
			allowFrom: resolveSlackAccountAllowFrom({
				cfg,
				accountId
			}),
			defaultTo: account.defaultTo
		};
	},
	normalizeApprover: normalizeSlackApproverId,
	normalizeDefaultTo: normalizeSlackApproverId,
	isWildcardAuthorized: ({ purpose, senderId, inputs, approvers }) => purpose === "sender" && Boolean(senderId) && approvers.length === 0 && inputs.allowFrom?.some((entry) => String(entry).trim() === "*") === true
});
const getSlackApprovalApprovers = slackApproval.resolveApprovers;
const isSlackApprovalAuthorizedSender = slackApproval.isAuthorizedSender;
//#endregion
//#region extensions/slack/src/installation-identity-state.ts
const slackInstallationStates = resolveGlobalMap(Symbol.for("openclaw.slack.installation-identities"), "close-and-restart");
function registerSlackInstallationState(accountId, kind) {
	const normalizedAccountId = normalizeAccountId(accountId);
	const owner = Symbol(`slack-installation:${normalizedAccountId}`);
	slackInstallationStates.set(normalizedAccountId, {
		kind,
		owner
	});
	return {
		update: (nextKind) => {
			if (slackInstallationStates.get(normalizedAccountId)?.owner === owner) slackInstallationStates.set(normalizedAccountId, {
				kind: nextKind,
				owner
			});
		},
		release: () => {
			if (slackInstallationStates.get(normalizedAccountId)?.owner === owner) slackInstallationStates.delete(normalizedAccountId);
		}
	};
}
function getSlackInstallationKind(accountId) {
	return slackInstallationStates.get(normalizeAccountId(accountId))?.kind;
}
function isSlackWorkspaceInstallation(accountId) {
	return getSlackInstallationKind(accountId) === "workspace";
}
//#endregion
//#region extensions/slack/src/approval-native-gates.ts
const DEFAULT_APPROVAL_FORWARDING_MODE = "session";
const SLACK_DM_CHANNEL_ID_RE = /^D[A-Z0-9]{8,}$/i;
const SLACK_USER_ID_RE = /^[UW][A-Z0-9]{8,}$/i;
function isSlackApprovalTransportEnabled(params) {
	return isSlackPluginAccountConfigured(resolveSlackAccount(params));
}
function resolveSlackNativeApprovalConfig(params) {
	return resolveSlackAccount(params).config.execApprovals;
}
function resolvePluginApprovalForwardingConfig(cfg) {
	return cfg.approvals?.plugin;
}
function normalizeSlackThreadMatchKey(threadId) {
	return threadId == null ? "" : String(threadId).trim();
}
function normalizeComparableTarget(value) {
	return normalizeLowercaseStringOrEmpty(value);
}
function extractSlackSessionKind(sessionKey) {
	if (!sessionKey) return null;
	const kind = normalizeLowercaseStringOrEmpty(sessionKey.match(/slack:(direct|channel|group):/i)?.[1]);
	return kind ? kind : null;
}
function resolveSlackTurnSourceDefaultKind(params) {
	if (SLACK_DM_CHANNEL_ID_RE.test(params.turnSourceTo)) return "channel";
	return params.sessionKind === "direct" ? "user" : "channel";
}
function resolveTurnSourceSlackOriginTarget(request) {
	const turnSourceChannel = normalizeLowercaseStringOrEmpty(request.request.turnSourceChannel);
	const turnSourceTo = normalizeOptionalString(request.request.turnSourceTo) ?? "";
	if (turnSourceChannel !== "slack" || !turnSourceTo) return null;
	const parsed = parseSlackTarget(turnSourceTo, { defaultKind: resolveSlackTurnSourceDefaultKind({
		turnSourceTo,
		sessionKind: extractSlackSessionKind(request.request.sessionKey ?? void 0)
	}) });
	if (!parsed) return null;
	return {
		to: formatSlackTarget({
			...parsed,
			explicitKind: true
		}),
		threadId: stringifyRouteThreadId(request.request.turnSourceThreadId)
	};
}
function resolveSessionSlackOriginTarget(sessionTarget) {
	return {
		to: sessionTarget.to,
		threadId: stringifyRouteThreadId(sessionTarget.threadId)
	};
}
function resolveSlackFallbackOriginTarget(request) {
	const sessionTarget = resolveApprovalRequestSessionConversation({
		request,
		channel: "slack",
		bundledFallback: false
	});
	if (!sessionTarget) return null;
	const parsed = parseSlackTarget(sessionTarget.id, { defaultKind: "channel" });
	if (!parsed) return null;
	return {
		to: formatSlackTarget({
			...parsed,
			id: canonicalizeSlackApiTargetId(parsed.kind, parsed.id),
			explicitKind: true
		}),
		threadId: sessionTarget.threadId
	};
}
function normalizeSlackOriginTarget(target) {
	return {
		...target,
		to: normalizeComparableTarget(target.to)
	};
}
function parseComparableSlackTarget(target) {
	return parseSlackTarget(target.to, { defaultKind: "channel" });
}
function isSlackDmChannelToUserRoutePair(a, b) {
	const left = parseComparableSlackTarget(a);
	const right = parseComparableSlackTarget(b);
	if (!left || !right) return false;
	if (left.teamId?.toLowerCase() !== right.teamId?.toLowerCase()) return false;
	return left.kind === "channel" && SLACK_DM_CHANNEL_ID_RE.test(left.id) && right.kind === "user" || right.kind === "channel" && SLACK_DM_CHANNEL_ID_RE.test(right.id) && left.kind === "user";
}
function slackTargetsMatch(a, b) {
	const threadKey = normalizeSlackThreadMatchKey(a.threadId);
	if (threadKey !== normalizeSlackThreadMatchKey(b.threadId)) return false;
	if (channelRouteTargetsMatchExact({
		left: {
			channel: "slack",
			to: a.to
		},
		right: {
			channel: "slack",
			to: b.to
		}
	})) return true;
	return Boolean(threadKey && isSlackDmChannelToUserRoutePair(a, b));
}
function normalizeSlackForwardTarget(target) {
	if ((normalizeMessageChannel(target.channel) ?? target.channel) !== "slack") return null;
	const to = normalizeOptionalString(target.to);
	if (!to) return null;
	const parsed = parseSlackTarget(to, { defaultKind: SLACK_USER_ID_RE.test(to) ? "user" : "channel" });
	if (!parsed) return null;
	return {
		to: formatSlackTarget({
			...parsed,
			explicitKind: true
		}),
		accountId: normalizeOptionalString(target.accountId),
		threadId: stringifyRouteThreadId(target.threadId)
	};
}
const { canApprovalPotentiallyRouteToChannel: canApprovalPotentiallyRouteToSlack, isSessionApprovalEligible: isForwardedSlackSessionApprovalEligible, isExplicitTargetEligible: isForwardedSlackExplicitTargetEligible } = createNativeApprovalChannelRouteGates({
	channel: "slack",
	defaultForwardingMode: DEFAULT_APPROVAL_FORWARDING_MODE,
	isTransportEnabled: isSlackApprovalTransportEnabled,
	listAccountIds: listSlackAccountIds,
	resolveDefaultAccountId: resolveDefaultSlackAccountId,
	normalizeForwardTarget: normalizeSlackForwardTarget,
	resolveTurnSourceTarget: resolveTurnSourceSlackOriginTarget,
	targetsMatch: slackTargetsMatch
});
function hasSlackPluginApprovers(params) {
	return getSlackApprovalApprovers(params).length > 0;
}
function isSlackPluginNativeApprovalClientConfigEnabled(params) {
	return isChannelExecApprovalClientEnabledFromConfig({
		enabled: resolveSlackNativeApprovalConfig(params)?.enabled,
		approverCount: getSlackApprovalApprovers(params).length
	});
}
function isSlackPluginForwardingRoutePotentiallyEnabled(params) {
	return canApprovalPotentiallyRouteToSlack({
		...params,
		approvalKind: "plugin"
	});
}
function isSlackPluginNativeApprovalClientEnabled(params) {
	return isSlackPluginNativeApprovalClientConfigEnabled(params) || isSlackPluginForwardingRoutePotentiallyEnabled(params);
}
function shouldHandleSlackPluginViaNativeClientConfig(params) {
	if (!doesApprovalRequestSelectChannelAccount({
		...params,
		channel: "slack",
		defaultAccountId: resolveDefaultSlackAccountId(params.cfg),
		eligibleAccountIds: listSlackNativeApprovalEligibleAccountIds({
			...params,
			approvalKind: "plugin"
		})
	})) return false;
	return isSlackNativeApprovalAccountEligible({
		...params,
		approvalKind: "plugin"
	});
}
function matchesSlackNativeApprovalFilters(params) {
	return matchesApprovalRequestFilters({
		request: params.request.request,
		agentFilter: params.agentFilter,
		sessionFilter: params.sessionFilter
	});
}
function isSlackNativeApprovalAccountEligible(params) {
	const config = resolveSlackNativeApprovalConfig(params);
	const approverCount = params.approvalKind === "exec" ? getSlackExecApprovalApprovers(params).length : getSlackApprovalApprovers(params).length;
	return isSlackApprovalTransportEnabled(params) && isChannelExecApprovalClientEnabledFromConfig({
		enabled: config?.enabled,
		approverCount
	}) && matchesSlackNativeApprovalFilters({
		request: params.request,
		agentFilter: config?.agentFilter,
		sessionFilter: config?.sessionFilter
	});
}
function listSlackNativeApprovalEligibleAccountIds(params) {
	const accountId = params.accountId ?? resolveDefaultSlackAccountId(params.cfg);
	return isSlackNativeApprovalAccountEligible({
		...params,
		accountId
	}) ? [accountId] : [];
}
function isAnyForwardedSlackExplicitTargetEligible(params) {
	return (resolvePluginApprovalForwardingConfig(params.cfg)?.targets ?? []).some((target) => isForwardedSlackExplicitTargetEligible({
		...params,
		approvalKind: "plugin",
		target
	}));
}
function shouldHandleSlackPluginViaForwarding(params) {
	return isForwardedSlackSessionApprovalEligible({
		...params,
		approvalKind: "plugin"
	}) || isAnyForwardedSlackExplicitTargetEligible(params);
}
function shouldHandleSlackPluginViaForwardingSession(params) {
	return isForwardedSlackSessionApprovalEligible({
		...params,
		approvalKind: "plugin"
	});
}
function isSlackNativeApprovalClientEnabled(params) {
	if (params.approvalKind === "exec") return isSlackExecApprovalClientEnabled(params);
	return isSlackPluginNativeApprovalClientEnabled(params);
}
function isSlackAnyNativeApprovalClientEnabled(params) {
	return isSlackNativeApprovalClientEnabled({
		...params,
		approvalKind: "exec"
	}) || isSlackNativeApprovalClientEnabled({
		...params,
		approvalKind: "plugin"
	});
}
function shouldHandleSlackNativeApprovalRequest(params) {
	if (getSlackInstallationKind(resolveSlackAccount(params).accountId) === "enterprise" && !resolveEnterpriseApprovalTeamId(params.request)) return false;
	if (resolveApprovalKind(params.request, params.approvalKind) === "plugin") return shouldHandleSlackPluginViaNativeClientConfig(params) || shouldHandleSlackPluginViaForwarding(params);
	const turnSourceChannel = normalizeMessageChannel(params.request.request.turnSourceChannel);
	if (turnSourceChannel && turnSourceChannel !== "slack") return false;
	if (!doesApprovalRequestSelectChannelAccount({
		...params,
		channel: "slack",
		defaultAccountId: resolveDefaultSlackAccountId(params.cfg),
		eligibleAccountIds: listSlackNativeApprovalEligibleAccountIds({
			...params,
			approvalKind: "exec"
		})
	})) return false;
	return isSlackNativeApprovalAccountEligible({
		...params,
		approvalKind: "exec"
	});
}
function resolveEnterpriseApprovalTeamId(request) {
	try {
		const target = resolveTurnSourceSlackOriginTarget(request);
		return target ? parseSlackTarget(target.to)?.teamId : void 0;
	} catch {
		return;
	}
}
//#endregion
//#region extensions/slack/src/blocks-input.ts
const SLACK_MAX_BLOCKS = 50;
function parseBlocksJson(raw) {
	try {
		return JSON.parse(raw);
	} catch {
		throw new Error("blocks must be valid JSON");
	}
}
function assertBlocksArray(raw) {
	if (!Array.isArray(raw)) throw new Error("blocks must be an array");
	if (raw.length === 0) throw new Error("blocks must contain at least one block");
	if (raw.length > 50) throw new Error(`blocks cannot exceed 50 items`);
	for (const block of raw) {
		if (!block || typeof block !== "object" || Array.isArray(block)) throw new Error("each block must be an object");
		const type = block.type;
		if (typeof type !== "string" || type.trim().length === 0) throw new Error("each block must include a non-empty string type");
	}
}
function validateSlackBlocksArray(raw) {
	assertBlocksArray(raw);
	return raw;
}
function parseSlackBlocksInput(raw) {
	if (raw == null) return;
	return validateSlackBlocksArray(typeof raw === "string" ? parseBlocksJson(raw) : raw);
}
const SLACK_BUTTON_VALUE_MAX = 2e3;
const SLACK_SECTION_TEXT_MAX = 3e3;
const SLACK_PRESENTATION_CAPABILITIES = {
	supported: true,
	buttons: true,
	selects: true,
	context: true,
	divider: true,
	charts: true,
	tables: true,
	limits: {
		actions: {
			maxActionsPerRow: 25,
			maxValueBytes: SLACK_BUTTON_VALUE_MAX,
			supportsStyles: true
		},
		selects: {
			maxOptions: 100,
			maxValueBytes: 150
		},
		text: {
			encoding: "characters",
			markdownDialect: "slack-mrkdwn",
			supportsEdit: true
		}
	}
};
//#endregion
//#region extensions/slack/src/approval-actions.ts
const SLACK_APPROVAL_VALUE_PREFIX = "openclaw:approval:v1:";
const SLACK_APPROVAL_HEADER_BLOCK_ID = "openclaw_approval_header";
function isApprovalDecision(value) {
	return value === "allow-once" || value === "allow-always" || value === "deny";
}
/** Encode portable approval facts without exposing a slash command to Slack callbacks. */
function encodeSlackApprovalAction(action) {
	const encode = (approvalId) => `${SLACK_APPROVAL_VALUE_PREFIX}${JSON.stringify({
		approvalId,
		approvalKind: action.approvalKind,
		decision: action.decision
	})}`;
	const exact = encode(action.approvalId);
	return exact.length <= 2e3 ? exact : encode(buildApprovalResolutionRef({
		approvalId: action.approvalId,
		approvalKind: action.approvalKind
	}));
}
/** Decode only the exact Slack-owned approval envelope. Malformed callbacks fail closed. */
function decodeSlackApprovalAction(value) {
	if (typeof value !== "string" || !value.startsWith(SLACK_APPROVAL_VALUE_PREFIX)) return null;
	try {
		const decoded = JSON.parse(value.slice(21));
		if (!decoded || typeof decoded !== "object" || Array.isArray(decoded)) return null;
		const record = decoded;
		if (Object.keys(record).length !== 3 || typeof record.approvalId !== "string" || record.approvalId.length === 0 || record.approvalKind !== "exec" && record.approvalKind !== "plugin" || !isApprovalDecision(record.decision)) return null;
		return {
			type: "approval",
			approvalId: record.approvalId,
			approvalKind: record.approvalKind,
			decision: record.decision
		};
	} catch {
		return null;
	}
}
//#endregion
//#region extensions/slack/src/monitor/mrkdwn.ts
function escapeSlackMrkdwn(value) {
	return value.replaceAll("\\", "\\\\").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replace(/([*_`~])/g, "\\$1");
}
//#endregion
//#region extensions/slack/src/presentation-fallback.ts
const SLACK_UNCOPYABLE_COMMAND_WARNING = "not copyable: contains backtick";
function resolveSlackCommandFallback(command) {
	if (!command.includes("`")) return { command };
	return {
		command: command.replaceAll("`", "[backtick]"),
		warning: SLACK_UNCOPYABLE_COMMAND_WARNING
	};
}
function escapeSlackPresentationChartBlock(block) {
	if (block.chartType === "pie") return {
		...block,
		title: escapeSlackMrkdwn(block.title),
		segments: block.segments.map((segment) => ({
			...segment,
			label: escapeSlackMrkdwn(segment.label)
		}))
	};
	return {
		...block,
		title: escapeSlackMrkdwn(block.title),
		categories: block.categories.map(escapeSlackMrkdwn),
		series: block.series.map((series) => ({
			...series,
			name: escapeSlackMrkdwn(series.name)
		})),
		...block.xLabel ? { xLabel: escapeSlackMrkdwn(block.xLabel) } : {},
		...block.yLabel ? { yLabel: escapeSlackMrkdwn(block.yLabel) } : {}
	};
}
function escapeSlackPresentationTableBlock(block) {
	return {
		...block,
		caption: escapeSlackMrkdwn(block.caption),
		headers: block.headers.map(escapeSlackMrkdwn),
		rows: block.rows.map((row) => row.map((cell) => typeof cell === "string" ? escapeSlackMrkdwn(cell) : cell))
	};
}
function escapeSlackPresentationFallbackBlock(block) {
	if (block.type === "chart") return escapeSlackPresentationChartBlock(block);
	if (block.type === "table") return escapeSlackPresentationTableBlock(block);
	if (block.type === "buttons") return {
		...block,
		buttons: block.buttons.map((button) => {
			const commandFallback = button.action?.type === "command" ? resolveSlackCommandFallback(button.action.command) : void 0;
			const label = commandFallback?.warning ? `${button.label} [${commandFallback.warning}]` : button.label;
			return {
				...button,
				label: escapeSlackMrkdwn(label),
				...button.value ? { value: escapeSlackMrkdwn(button.value) } : {},
				...button.url ? { url: escapeSlackMrkdwn(button.url) } : {},
				...button.webApp ? { webApp: { url: escapeSlackMrkdwn(button.webApp.url) } } : {},
				...button.web_app ? { web_app: { url: escapeSlackMrkdwn(button.web_app.url) } } : {},
				...button.action?.type === "command" && commandFallback ? { action: {
					...button.action,
					command: commandFallback.command
				} } : {}
			};
		})
	};
	if (block.type === "select") return {
		...block,
		...block.placeholder ? { placeholder: escapeSlackMrkdwn(block.placeholder) } : {},
		options: block.options.map((option) => ({
			...option,
			label: escapeSlackMrkdwn(option.label)
		}))
	};
	return block;
}
function renderSlackMessagePresentationChartFallbackText(block) {
	return renderMessagePresentationChartFallbackText(escapeSlackPresentationChartBlock(block));
}
function renderSlackMessagePresentationTableFallbackText(block) {
	return renderMessagePresentationTableFallbackText(escapeSlackPresentationTableBlock(block));
}
function renderSlackMessagePresentationFallbackText(params) {
	if (!params.presentation) return renderMessagePresentationFallbackText(params);
	const presentation = {
		...params.presentation,
		...params.presentation.title ? { title: escapeSlackMrkdwn(params.presentation.title) } : {},
		blocks: params.presentation.blocks.map(escapeSlackPresentationFallbackBlock)
	};
	return renderMessagePresentationFallbackText({
		...params,
		presentation
	});
}
//#endregion
//#region extensions/slack/src/data-table.ts
const SLACK_DATA_TABLE_COLUMNS_MAX = 20;
const SLACK_DATA_TABLE_ROWS_MAX = 100;
function countCharacters(value) {
	return Array.from(value).length;
}
function readRichTextLeaf(record) {
	if (record.type === "text" && typeof record.text === "string") return record.text;
	const text = readNonBlankString(record.text);
	if (text) return text;
	switch (record.type) {
		case "link": return readNonBlankString(record.url) ?? "";
		case "user": {
			const userId = readNonBlankString(record.user_id);
			return userId ? `<@${userId}>` : "";
		}
		case "channel": {
			const channelId = readNonBlankString(record.channel_id);
			return channelId ? `<#${channelId}>` : "";
		}
		case "usergroup": {
			const usergroupId = readNonBlankString(record.usergroup_id);
			return usergroupId ? `<!subteam^${usergroupId}>` : "";
		}
		case "broadcast": {
			const range = readNonBlankString(record.range);
			return range ? `<!${range}>` : "";
		}
		case "emoji": {
			const name = readNonBlankString(record.name);
			return name ? `:${name}:` : "";
		}
		case "date": return readNonBlankString(record.fallback) ?? "";
		default: return "";
	}
}
function readRichTextElements(value, separator = "") {
	if (!Array.isArray(value)) return "";
	const parts = [];
	for (const rawElement of value) {
		const element = asOptionalRecord(rawElement);
		if (!element) continue;
		if (Array.isArray(element.elements)) {
			const rendered = readRichTextElements(element.elements, element.type === "rich_text_list" ? "\n" : "");
			if (rendered) parts.push(rendered);
			continue;
		}
		const rendered = readRichTextLeaf(element);
		if (rendered) parts.push(rendered);
	}
	return parts.join(separator);
}
function readSlackBasicTableCell(value) {
	const cell = asOptionalRecord(value);
	if (!cell) return "";
	if (cell.type === "raw_text") return typeof cell.text === "string" ? cell.text : "";
	if (cell.type === "raw_number") {
		if (typeof cell.text === "string" && cell.text.length > 0) return cell.text;
		if (typeof cell.value === "number" && Number.isFinite(cell.value)) return String(cell.value);
		return typeof cell.value === "string" ? cell.value : "";
	}
	return cell.type === "rich_text" ? readRichTextElements(cell.elements, "\n") : "";
}
function parseSlackBasicTableRows(value) {
	const block = asOptionalRecord(value);
	if (block?.type !== "table" || !Array.isArray(block.rows)) return;
	if (block.rows.length < 1 || block.rows.length > SLACK_DATA_TABLE_ROWS_MAX) return;
	let characterCount = 0;
	const rows = [];
	for (const rawRow of block.rows) {
		if (!Array.isArray(rawRow) || rawRow.length < 1 || rawRow.length > SLACK_DATA_TABLE_COLUMNS_MAX) return;
		const row = rawRow.map(readSlackBasicTableCell);
		characterCount += row.reduce((total, cell) => total + countCharacters(cell), 0);
		if (characterCount > 1e4) return;
		rows.push(row);
	}
	return rows.some((row) => row.some((cell) => cell.length > 0)) ? rows : void 0;
}
function readSlackDataTableCell(value, allowRichText) {
	const cell = asOptionalRecord(value);
	if (!cell) return;
	if (cell.type === "raw_text") return readNonBlankString(cell.text);
	if (cell.type === "raw_number") return typeof cell.value === "number" && Number.isFinite(cell.value) ? readNonBlankString(cell.text) : void 0;
	if (allowRichText && cell.type === "rich_text") return readNonBlankString(readRichTextElements(cell.elements));
}
function parseSlackDataTable(value, options = {}) {
	const block = asOptionalRecord(value);
	const caption = readNonBlankString(block?.caption);
	if (block?.type !== "data_table" || !caption || !Array.isArray(block.rows)) return;
	if (block.rows.length < 2) return;
	const rawHeader = block.rows[0];
	if (!Array.isArray(rawHeader) || rawHeader.length < 1) return;
	const headers = rawHeader.map((cell) => readSlackDataTableCell(cell, false));
	if (!headers.every((header) => Boolean(header))) return;
	const rows = block.rows.slice(1).map((rawRow) => {
		if (!Array.isArray(rawRow) || rawRow.length !== headers.length) return;
		const cells = rawRow.map((cell) => readSlackDataTableCell(cell, true));
		return cells.every((cell) => Boolean(cell)) ? cells : void 0;
	});
	if (!rows.every((row) => Boolean(row))) return;
	const cellCharacterCount = [...headers, ...rows.flat()].reduce((total, cell) => total + countCharacters(cell), 0);
	if (options.enforceNativeLimits && (block.rows.length > 101 || headers.length > SLACK_DATA_TABLE_COLUMNS_MAX || cellCharacterCount > 1e4)) return;
	return {
		caption,
		headers,
		rows,
		cellCharacterCount
	};
}
/** Detect current native table blocks without depending on unreleased Slack SDK types. */
function hasSlackDataTableBlock(blocks) {
	return blocks?.some((block) => asOptionalRecord(block)?.type === "data_table") ?? false;
}
function countSlackDataTableCellCharacters(value) {
	return parseSlackDataTable(value, { enforceNativeLimits: true })?.cellCharacterCount;
}
/** Count the aggregate native-table cell characters already present in a message. */
function countSlackDataTableBlocksCellCharacters(blocks) {
	let total = 0;
	for (const block of blocks ?? []) {
		if (!hasSlackDataTableBlock([block])) continue;
		const cellCharacterCount = countSlackDataTableCellCharacters(block);
		if (cellCharacterCount === void 0) return;
		total += cellCharacterCount;
	}
	return total;
}
function resolvePortableTableCellCharacterCount(block) {
	if (typeof block.caption !== "string" || block.caption.trim().length === 0 || !Array.isArray(block.headers) || block.headers.length < 1 || block.headers.length > SLACK_DATA_TABLE_COLUMNS_MAX || !Array.isArray(block.rows) || block.rows.length < 1 || block.rows.length > SLACK_DATA_TABLE_ROWS_MAX || new Set(block.headers).size !== block.headers.length || !block.headers.every((header) => typeof header === "string" && header.trim().length > 0) || block.rowHeaderColumnIndex !== void 0 && (!Number.isInteger(block.rowHeaderColumnIndex) || block.rowHeaderColumnIndex < 0 || block.rowHeaderColumnIndex >= block.headers.length)) return;
	const values = [...block.headers];
	for (const row of block.rows) {
		if (!Array.isArray(row) || row.length !== block.headers.length) return;
		for (const cell of row) {
			if (typeof cell === "number") {
				if (!Number.isFinite(cell)) return;
				values.push(String(cell));
				continue;
			}
			if (typeof cell !== "string" || cell.trim().length === 0) return;
			values.push(cell);
		}
	}
	return values.reduce((total, value) => total + countCharacters(value), 0);
}
/** True when a portable table fits Slack's per-table and per-message contracts. */
function canRenderSlackDataTable(block, options = {}) {
	const cellCharacterCountOffset = options.cellCharacterCountOffset ?? 0;
	if (!Number.isSafeInteger(cellCharacterCountOffset) || cellCharacterCountOffset < 0) return false;
	const cellCharacterCount = resolvePortableTableCellCharacterCount(block);
	return cellCharacterCount !== void 0 && cellCharacterCountOffset + cellCharacterCount <= 1e4;
}
/** Map a validated portable table to Slack's current app-facing Block Kit shape. */
function buildSlackDataTableBlock(block, options = {}) {
	if (!canRenderSlackDataTable(block, options)) return;
	const header = block.headers.map((text) => ({
		type: "raw_text",
		text
	}));
	const rows = block.rows.map((row) => row.map((cell) => typeof cell === "number" ? {
		type: "raw_number",
		value: cell,
		text: String(cell)
	} : {
		type: "raw_text",
		text: cell
	}));
	return {
		type: "data_table",
		caption: block.caption,
		rows: [header, ...rows],
		...block.rowHeaderColumnIndex !== void 0 ? { row_header_column_index: block.rowHeaderColumnIndex } : {}
	};
}
/** Extract a deterministic accessible summary from a native Slack table block. */
function renderSlackDataTableFallbackText(value) {
	const block = asOptionalRecord(value);
	if (block?.type !== "data_table") return;
	const parsed = parseSlackDataTable(block);
	if (parsed) return renderMessagePresentationTableFallbackText({
		type: "table",
		caption: parsed.caption,
		headers: parsed.headers,
		rows: parsed.rows
	});
	return readNonBlankString(block.caption)?.trim();
}
function escapeCompactFallbackCell(value) {
	return value.replaceAll("\\", "\\\\").replaceAll("	", "\\t").replaceAll("\r", "\\r").replaceAll("\n", "\\n");
}
function escapeSlackBasicTableCell(value, mrkdwnSafe) {
	return (mrkdwnSafe ? escapeSlackMrkdwn(value) : value.replaceAll("\\", "\\\\")).replaceAll("	", "\\t").replaceAll("\r", "\\r").replaceAll("\n", "\\n");
}
function renderSlackBasicTableRows(value, mrkdwnSafe) {
	return parseSlackBasicTableRows(value)?.map((row) => row.map((cell) => escapeSlackBasicTableCell(cell, mrkdwnSafe)).join("	")).join("\n");
}
/** Render Slack's inbound `table` block as ordered, delimiter-safe TSV. */
function renderSlackTableFallbackText(value) {
	return renderSlackBasicTableRows(value, false);
}
/** Render Slack's inbound `table` block without activating mrkdwn control tokens. */
function renderSlackTableMrkdwnFallbackText(value) {
	return renderSlackBasicTableRows(value, true);
}
/** Render each native table cell once for bounded, formatting-disabled delivery. */
function renderSlackDataTableCompactPlainTextFallback(value) {
	const block = asOptionalRecord(value);
	if (block?.type !== "data_table") return;
	const parsed = parseSlackDataTable(block);
	if (!parsed) return readNonBlankString(block.caption)?.trim();
	return [
		`${escapeCompactFallbackCell(parsed.caption)} (table)`,
		parsed.headers.map(escapeCompactFallbackCell).join("	"),
		...parsed.rows.map((row) => row.map(escapeCompactFallbackCell).join("	"))
	].join("\n");
}
/** Render a native table as mrkdwn without activating raw cell control tokens. */
function renderSlackDataTableMrkdwnFallbackText(value) {
	const block = asOptionalRecord(value);
	if (block?.type !== "data_table") return;
	const parsed = parseSlackDataTable(block);
	if (parsed) return renderSlackMessagePresentationTableFallbackText({
		type: "table",
		caption: parsed.caption,
		headers: parsed.headers,
		rows: parsed.rows
	});
	const caption = readNonBlankString(block.caption)?.trim();
	return caption ? escapeSlackMrkdwn(caption) : void 0;
}
//#endregion
//#region extensions/slack/src/data-visualization.ts
const SLACK_CHART_TITLE_MAX = 50;
const SLACK_CHART_LABEL_MAX = 20;
const SLACK_CHART_AXIS_LABEL_MAX = 50;
const SLACK_CHART_SERIES_MAX = 12;
const SLACK_CHART_DATA_POINTS_MAX = 20;
/** Detect native chart blocks without depending on unreleased Slack SDK types. */
function hasSlackDataVisualizationBlock(blocks) {
	return blocks?.some((block) => asOptionalRecord(block)?.type === "data_visualization") ?? false;
}
function isStringWithin(value, maxLength) {
	return typeof value === "string" && value.trim().length > 0 && Array.from(value).length <= maxLength;
}
function hasUniqueStrings(values) {
	return new Set(values).size === values.length;
}
/** True when a portable chart satisfies Slack's complete native-block contract. */
function canRenderSlackDataVisualization(block) {
	if (!isStringWithin(block.title, SLACK_CHART_TITLE_MAX)) return false;
	if (block.chartType === "pie") return block.segments.length >= 1 && block.segments.length <= SLACK_CHART_SERIES_MAX && block.segments.every((segment) => isStringWithin(segment.label, SLACK_CHART_LABEL_MAX) && Number.isFinite(segment.value) && segment.value > 0);
	if (block.categories.length < 1 || block.categories.length > SLACK_CHART_DATA_POINTS_MAX || !block.categories.every((category) => isStringWithin(category, SLACK_CHART_LABEL_MAX)) || !hasUniqueStrings(block.categories) || block.series.length < 1 || block.series.length > SLACK_CHART_SERIES_MAX || !hasUniqueStrings(block.series.map((series) => series.name)) || block.xLabel !== void 0 && !isStringWithin(block.xLabel, SLACK_CHART_AXIS_LABEL_MAX) || block.yLabel !== void 0 && !isStringWithin(block.yLabel, SLACK_CHART_AXIS_LABEL_MAX)) return false;
	return block.series.every((series) => isStringWithin(series.name, SLACK_CHART_LABEL_MAX) && series.values.length === block.categories.length && series.values.every((value) => Number.isFinite(value)));
}
/** Map a validated portable chart to Slack's app-facing Block Kit shape. */
function buildSlackDataVisualizationBlock(block) {
	if (!canRenderSlackDataVisualization(block)) return;
	if (block.chartType === "pie") return {
		type: "data_visualization",
		title: block.title,
		chart: {
			type: "pie",
			segments: block.segments.map((segment) => ({ ...segment }))
		}
	};
	return {
		type: "data_visualization",
		title: block.title,
		chart: {
			type: block.chartType,
			series: block.series.map((series) => ({
				name: series.name,
				data: block.categories.map((label, index) => ({
					label,
					value: series.values[index]
				}))
			})),
			axis_config: {
				categories: [...block.categories],
				...block.xLabel ? { x_label: block.xLabel } : {},
				...block.yLabel ? { y_label: block.yLabel } : {}
			}
		}
	};
}
function readSlackChartDatum(value) {
	const record = asOptionalRecord(value);
	const label = record?.label;
	const datumValue = record?.value;
	return typeof label === "string" && typeof datumValue === "number" ? {
		label,
		value: datumValue
	} : void 0;
}
function parseSlackDataVisualizationBlock(value) {
	const block = asOptionalRecord(value);
	const title = block?.title;
	const chart = asOptionalRecord(block?.chart);
	if (block?.type !== "data_visualization" || typeof title !== "string" || !chart) return;
	if (chart.type === "pie") {
		if (!Array.isArray(chart.segments)) return;
		const segments = chart.segments.map(readSlackChartDatum);
		if (segments.some((segment) => !segment)) return;
		const normalizedBlock = normalizeMessagePresentation({ blocks: [{
			type: "chart",
			chartType: "pie",
			title,
			segments
		}] })?.blocks[0];
		return normalizedBlock?.type === "chart" ? normalizedBlock : void 0;
	}
	if (chart.type !== "bar" && chart.type !== "area" && chart.type !== "line") return;
	const axisConfig = asOptionalRecord(chart.axis_config);
	const categories = axisConfig?.categories;
	if (!Array.isArray(categories) || !categories.every((category) => typeof category === "string")) return;
	if (!Array.isArray(chart.series)) return;
	const series = chart.series.map((rawSeries) => {
		const seriesRecord = asOptionalRecord(rawSeries);
		if (typeof seriesRecord?.name !== "string" || !Array.isArray(seriesRecord.data)) return;
		const data = seriesRecord.data.map(readSlackChartDatum);
		if (data.some((datum) => !datum) || data.length !== categories.length) return;
		const dataByLabel = new Map(data.map((datum) => [datum.label, datum.value]));
		if (dataByLabel.size !== data.length || categories.some((category) => !dataByLabel.has(category))) return;
		return {
			name: seriesRecord.name,
			values: categories.map((category) => dataByLabel.get(category))
		};
	});
	if (series.some((entry) => !entry)) return;
	const normalizedBlock = normalizeMessagePresentation({ blocks: [{
		type: "chart",
		chartType: chart.type,
		title,
		categories,
		series,
		xLabel: axisConfig?.x_label,
		yLabel: axisConfig?.y_label
	}] })?.blocks[0];
	return normalizedBlock?.type === "chart" ? normalizedBlock : void 0;
}
/** Extract a deterministic accessible summary from a native Slack chart block. */
function renderSlackDataVisualizationFallbackText(value) {
	const block = asOptionalRecord(value);
	if (block?.type !== "data_visualization") return;
	const parsed = parseSlackDataVisualizationBlock(block);
	if (parsed) return renderMessagePresentationChartFallbackText(parsed);
	return typeof block.title === "string" && block.title.trim() ? block.title.trim() : void 0;
}
/** Render a native chart as mrkdwn without activating raw data control tokens. */
function renderSlackDataVisualizationMrkdwnFallbackText(value) {
	const block = asOptionalRecord(value);
	if (block?.type !== "data_visualization") return;
	const parsed = parseSlackDataVisualizationBlock(block);
	if (parsed) return renderSlackMessagePresentationChartFallbackText(parsed);
	return typeof block.title === "string" && block.title.trim() ? escapeSlackMrkdwn(block.title.trim()) : void 0;
}
//#endregion
//#region extensions/slack/src/format.ts
function escapeSlackMrkdwnSegment(text) {
	return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
const SLACK_ANGLE_TOKEN_RE = /<[^>\n]+>/g;
function isAllowedSlackAngleToken(token) {
	if (!token.startsWith("<") || !token.endsWith(">")) return false;
	const inner = token.slice(1, -1);
	return inner.startsWith("@") || inner.startsWith("#") || inner.startsWith("!") || inner.startsWith("mailto:") || inner.startsWith("tel:") || inner.startsWith("http://") || inner.startsWith("https://") || inner.startsWith("slack://");
}
function escapeSlackMrkdwnContent(text) {
	if (!text) return "";
	if (!text.includes("&") && !text.includes("<") && !text.includes(">")) return text;
	SLACK_ANGLE_TOKEN_RE.lastIndex = 0;
	const out = [];
	let lastIndex = 0;
	for (let match = SLACK_ANGLE_TOKEN_RE.exec(text); match; match = SLACK_ANGLE_TOKEN_RE.exec(text)) {
		const matchIndex = match.index ?? 0;
		out.push(escapeSlackMrkdwnSegment(text.slice(lastIndex, matchIndex)));
		const token = match[0] ?? "";
		out.push(isAllowedSlackAngleToken(token) ? token : escapeSlackMrkdwnSegment(token));
		lastIndex = matchIndex + token.length;
	}
	out.push(escapeSlackMrkdwnSegment(text.slice(lastIndex)));
	return out.join("");
}
function escapeSlackMrkdwnText(text) {
	if (!text) return "";
	if (!text.includes("&") && !text.includes("<") && !text.includes(">")) return text;
	return text.split("\n").map((line) => {
		if (line.startsWith("> ")) return `> ${escapeSlackMrkdwnContent(line.slice(2))}`;
		return escapeSlackMrkdwnContent(line);
	}).join("\n");
}
function buildSlackLink(link, text) {
	const href = link.href.trim();
	if (!href) return null;
	const trimmedLabel = text.slice(link.start, link.end).trim();
	const comparableHref = href.startsWith("mailto:") ? href.slice(7) : href;
	if (!(trimmedLabel.length > 0 && trimmedLabel !== href && trimmedLabel !== comparableHref)) return null;
	const safeHref = escapeSlackMrkdwnSegment(href);
	return {
		start: link.start,
		end: link.end,
		open: `<${safeHref}|`,
		close: ">"
	};
}
const SLACK_MRKDWN_WORD_CHARACTER_RE = /[\p{L}\p{M}\p{N}_]/u;
const SLACK_MRKDWN_PUNCTUATION_RE = /\p{P}/u;
const SLACK_MRKDWN_SYMBOL_RE = /\p{S}/u;
const SLACK_MRKDWN_CJK_SCRIPT_RE = /[\p{Script_Extensions=Han}\p{Script_Extensions=Hiragana}\p{Script_Extensions=Katakana}\p{Script_Extensions=Hangul}]/u;
const SLACK_MRKDWN_EMOJI_PRESENTATION_RE = /\p{Emoji_Presentation}/u;
function getCodePointBefore(text, index) {
	if (index <= 0) return "";
	const lastCodeUnit = text.charCodeAt(index - 1);
	if (lastCodeUnit >= 56320 && lastCodeUnit <= 57343 && index > 1) {
		const previousCodeUnit = text.charCodeAt(index - 2);
		if (previousCodeUnit >= 55296 && previousCodeUnit <= 56319) return text.slice(index - 2, index);
	}
	return text[index - 1] ?? "";
}
function getCodePointAt(text, index) {
	const codePoint = text.codePointAt(index);
	return codePoint === void 0 ? "" : String.fromCodePoint(codePoint);
}
function isSlackCjkPunctuation(character) {
	if (!SLACK_MRKDWN_PUNCTUATION_RE.test(character)) return false;
	if (SLACK_MRKDWN_CJK_SCRIPT_RE.test(character)) return true;
	const codePoint = character.codePointAt(0);
	if (codePoint === void 0) return false;
	const width = eastAsianWidthType(codePoint);
	return width === "fullwidth" || width === "halfwidth" || width === "wide" && !SLACK_MRKDWN_EMOJI_PRESENTATION_RE.test(character);
}
function isUnsafeSlackEmphasisBoundary(character) {
	if (SLACK_MRKDWN_WORD_CHARACTER_RE.test(character)) return true;
	const codePoint = character.codePointAt(0);
	if (codePoint === void 0 || codePoint <= 127) return false;
	return SLACK_MRKDWN_SYMBOL_RE.test(character) || isSlackCjkPunctuation(character);
}
function makeSlackEmphasisStylesSafe(ir) {
	const styles = ir.styles.filter((span) => {
		if (span.style !== "italic" && span.style !== "bold") return true;
		return !isUnsafeSlackEmphasisBoundary(getCodePointBefore(ir.text, span.start)) && !isUnsafeSlackEmphasisBoundary(getCodePointAt(ir.text, span.end));
	});
	return styles.length === ir.styles.length ? ir : {
		...ir,
		styles
	};
}
const SLACK_FORMAT_PROFILE = FormatCapabilityProfile.define({
	mechanism: "markdown",
	constructs: {
		underline: "strip",
		spoiler: "fallback",
		codeLanguage: "fallback",
		heading: "fallback",
		bulletList: "fallback",
		orderedList: "fallback",
		taskList: "fallback",
		table: "fallback",
		image: "fallback"
	},
	chunk: {
		limit: 4e3,
		unit: "chars",
		hardCap: 4e4
	}
});
const SLACK_ASSISTANT_TRANSCRIPT_PREFIX = "`Assistant:` ";
function tokenizeSlackMrkdwn(text) {
	const tokens = [];
	for (let index = 0; index < text.length;) {
		if (text.startsWith("```", index)) {
			tokens.push("```");
			index += 3;
			continue;
		}
		const entity = [
			"&amp;",
			"&lt;",
			"&gt;"
		].find((candidate) => text.startsWith(candidate, index));
		if (entity) {
			tokens.push(entity);
			index += entity.length;
			continue;
		}
		if (text[index] === "<") {
			const end = text.indexOf(">", index + 1);
			const angleToken = end >= 0 ? text.slice(index, end + 1) : void 0;
			if (angleToken && !angleToken.includes("\n") && isAllowedSlackAngleToken(angleToken)) {
				tokens.push(angleToken);
				index += angleToken.length;
				continue;
			}
		}
		const codePoint = text.codePointAt(index);
		if (codePoint === void 0) break;
		const character = String.fromCodePoint(codePoint);
		index += character.length;
		if (character === "\\" && index < text.length) {
			const escapedCodePoint = text.codePointAt(index);
			if (escapedCodePoint !== void 0) {
				const escapedCharacter = String.fromCodePoint(escapedCodePoint);
				tokens.push(character + escapedCharacter);
				index += escapedCharacter.length;
				continue;
			}
		}
		tokens.push(character);
	}
	return tokens;
}
function resolveSlackCodeMarkerTransition(active, token) {
	if (token === "```" && active !== "`") return active === "```" ? void 0 : "```";
	if (token === "`" && active !== "```") return active === "`" ? void 0 : "`";
	return null;
}
function maskSlackExcludedText(text) {
	return text.split("\n").map((line) => line.trim() ? `x${" ".repeat(Math.max(0, line.length - 1))}` : " ".repeat(line.length)).join("\n");
}
function maskSlackExcludedRanges(projection) {
	let masked = "";
	let cursor = 0;
	for (const range of projection.excludedRanges) {
		masked += projection.text.slice(cursor, range.start);
		masked += maskSlackExcludedText(projection.text.slice(range.start, range.end));
		cursor = range.end;
	}
	return masked + projection.text.slice(cursor);
}
function slackProjectionHasRoleHeader(projection) {
	return Boolean(markdownToIR(maskSlackExcludedRanges(projection), {
		assistantTranscriptRoleHeaders: true,
		autolink: false,
		blockquotePrefix: "",
		headingStyle: "none",
		linkify: false,
		tableMode: "off"
	}).annotations?.some((annotation) => annotation.type === "assistant_transcript_role"));
}
function decodeSlackMrkdwnEntities(text) {
	return text.replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">");
}
function projectSlackAngleToken(token, dateDisplay) {
	const inner = token.slice(1, -1);
	if (inner.startsWith("!date^")) {
		const fallbackSeparator = inner.indexOf("|");
		const tokenString = (fallbackSeparator === -1 ? inner : inner.slice(0, fallbackSeparator)).split("^")[2] ?? "";
		const fallback = fallbackSeparator === -1 ? "" : inner.slice(fallbackSeparator + 1);
		return decodeSlackMrkdwnEntities(dateDisplay === "fallback" ? fallback || tokenString : tokenString || fallback);
	}
	const labelSeparator = inner.indexOf("|");
	if (labelSeparator >= 0) return decodeSlackMrkdwnEntities(inner.slice(labelSeparator + 1));
	if (inner.startsWith("@")) return "@";
	if (inner.startsWith("#")) return "#";
	if (inner.startsWith("!")) return "!";
	return decodeSlackMrkdwnEntities(inner);
}
function appendSlackVisibleProjection(projection, visible, excluded) {
	if (!visible) return;
	const start = projection.text.length;
	projection.text += visible;
	if (!excluded) return;
	const previous = projection.excludedRanges.at(-1);
	if (previous?.end === start) previous.end = projection.text.length;
	else projection.excludedRanges.push({
		start,
		end: projection.text.length
	});
}
function projectSlackMrkdwnVisibleText(text, dateDisplay) {
	const projection = {
		text: "",
		excludedRanges: []
	};
	let activeMarker;
	let lineHasVisibleContent = false;
	for (const token of tokenizeSlackMrkdwn(text)) {
		const transition = resolveSlackCodeMarkerTransition(activeMarker, token);
		if (transition !== null) {
			activeMarker = transition;
			continue;
		}
		let visible = token;
		if (isAllowedSlackAngleToken(token)) visible = activeMarker ? token : projectSlackAngleToken(token, dateDisplay);
		else if (token === "&amp;" || token === "&lt;" || token === "&gt;") visible = decodeSlackMrkdwnEntities(token);
		else if (!activeMarker && (token === "*" || token === "_" || token === "~")) visible = "";
		else if (!activeMarker && token === ">" && !lineHasVisibleContent) visible = "";
		else if (token.startsWith("\\") && token.length > 1) visible = token.slice(1);
		appendSlackVisibleProjection(projection, visible, activeMarker !== void 0);
		for (const character of visible) if (character === "\n") lineHasVisibleContent = false;
		else if (character !== " " && character !== "	" && character !== "\r") lineHasVisibleContent = true;
	}
	return projection;
}
function protectSlackAssistantTranscriptRoleHeaders(text) {
	if (text.startsWith(SLACK_ASSISTANT_TRANSCRIPT_PREFIX)) return text;
	const tokenProjection = projectSlackMrkdwnVisibleText(text, "token");
	const fallbackProjection = projectSlackMrkdwnVisibleText(text, "fallback");
	if (!slackProjectionHasRoleHeader(tokenProjection) && !slackProjectionHasRoleHeader(fallbackProjection)) return text;
	return `${SLACK_ASSISTANT_TRANSCRIPT_PREFIX}${text}`;
}
function buildSlackRenderOptions() {
	return {
		annotationMarkers: { assistant_transcript_role: {
			open: "`",
			close: "`",
			suppressNestedFormatting: true
		} },
		styleMarkers: {
			bold: {
				open: "*",
				close: "*"
			},
			italic: {
				open: "_",
				close: "_"
			},
			strikethrough: {
				open: "~",
				close: "~"
			},
			code: {
				open: "`",
				close: "`"
			},
			code_block: {
				open: "```\n",
				close: "```"
			}
		},
		escapeText: escapeSlackMrkdwnText,
		buildLink: buildSlackLink
	};
}
function normalizeSlackOutboundText(markdown, options = {}) {
	return protectSlackAssistantTranscriptRoleHeaders(renderMarkdownWithMarkers(makeSlackEmphasisStylesSafe(markdownToIR(markdown ?? "", {
		assistantTranscriptRoleHeaders: true,
		linkify: false,
		autolink: false,
		headingStyle: "rich",
		blockquotePrefix: "> ",
		tableMode: options.tableMode
	})), buildSlackRenderOptions(), SLACK_FORMAT_PROFILE));
}
/** Chunk already-rendered Slack mrkdwn without splitting entities or code markers. */
function chunkSlackMrkdwnText(text, limit) {
	if (text.length <= limit) return [text];
	if (!(text.includes("`") || text.includes("&amp;") || text.includes("&lt;") || text.includes("&gt;") || (text.match(/<[^>\n]+>/gu)?.some(isAllowedSlackAngleToken) ?? false) || /\\[\s\S]/u.test(text))) return chunkTextForOutbound(text, limit, { preserveWhitespace: true });
	const chunks = [];
	let activeMarker;
	let content = "";
	const wrapper = (marker) => marker && limit > marker.length * 2 ? marker : void 0;
	const capacity = (marker) => limit - (wrapper(marker)?.length ?? 0);
	const flush = () => {
		const marker = wrapper(activeMarker);
		if (content && content !== marker) chunks.push(marker ? `${content}${marker}` : content);
		content = "";
	};
	for (const token of tokenizeSlackMrkdwn(text)) {
		const transition = resolveSlackCodeMarkerTransition(activeMarker, token);
		const nextMarker = transition === null ? activeMarker : transition;
		const sourceMarker = token === "`" || token === "```" ? token : void 0;
		if (transition !== null && sourceMarker && !wrapper(sourceMarker)) {
			activeMarker = nextMarker;
			continue;
		}
		if (content && content.length + token.length > capacity(nextMarker)) flush();
		activeMarker = nextMarker;
		if (!content && transition === void 0) continue;
		content ||= transition === null ? wrapper(activeMarker) ?? "" : "";
		const contentLimit = capacity(activeMarker) - (wrapper(activeMarker)?.length ?? 0);
		if (token.length > contentLimit) {
			flush();
			const marker = wrapper(activeMarker);
			if (activeMarker && isAllowedSlackAngleToken(token)) {
				if (marker) chunks.push(...chunkTextForOutbound(token, Math.max(1, Math.floor(contentLimit)), { preserveWhitespace: true }).map((fragment) => `${marker}${fragment}${marker}`));
				else chunks.push(...chunkTextForOutbound(escapeSlackMrkdwnSegment(token), Math.max(1, Math.floor(limit)), { preserveWhitespace: true }));
				continue;
			}
			chunks.push(...token.length <= limit ? [token] : chunkTextForOutbound(token, limit));
			continue;
		}
		content += token;
	}
	flush();
	return chunks;
}
function markdownToSlackMrkdwnChunks(markdown, limit, options = {}) {
	const ir = makeSlackEmphasisStylesSafe(markdownToIR(markdown ?? "", {
		assistantTranscriptRoleHeaders: true,
		linkify: false,
		autolink: false,
		headingStyle: "rich",
		blockquotePrefix: "> ",
		tableMode: options.tableMode
	}));
	const renderOptions = buildSlackRenderOptions();
	return renderMarkdownIRChunksWithinLimit({
		ir,
		limit,
		renderChunk: (chunk) => protectSlackAssistantTranscriptRoleHeaders(renderMarkdownWithMarkers(chunk, renderOptions, SLACK_FORMAT_PROFILE)),
		measureRendered: (rendered) => rendered.length
	}).map(({ rendered }) => rendered);
}
//#endregion
//#region extensions/slack/src/question-actions.ts
const SLACK_QUESTION_VALUE_PREFIX = "slq1:";
const QUESTION_RECORD_ID_PATTERN = /^ask_[a-f0-9]{32}$/u;
function encodeSlackQuestionAction(action) {
	if (!QUESTION_RECORD_ID_PATTERN.test(action.questionId) || !Number.isInteger(action.optionIndex) || action.optionIndex < 0 || action.optionIndex > 3) return;
	const value = `${SLACK_QUESTION_VALUE_PREFIX}${action.questionId}:${action.optionIndex}`;
	return value.length <= 2e3 ? value : void 0;
}
function decodeSlackQuestionAction(value) {
	if (typeof value !== "string" || value.length > 2e3) return null;
	const match = /^slq1:(ask_[a-f0-9]{32}):([0-3])$/u.exec(value);
	return match?.[1] && match[2] ? {
		questionId: match[1],
		optionIndex: Number(match[2])
	} : null;
}
async function resolveSlackQuestionAction(params) {
	let result;
	try {
		result = await (params.resolveQuestion ?? questionGatewayRuntime.resolveOption)({
			cfg: params.cfg,
			questionId: params.action.questionId,
			optionIndex: params.action.optionIndex,
			senderId: params.userId,
			clientDisplayName: `Slack question (${params.accountId})`
		});
	} catch {
		await params.respond("Could not submit this answer.").catch(() => {});
		return;
	}
	await params.respond(result.status === "answered" ? "Answer submitted." : "This question was already answered.").catch(() => {});
}
//#endregion
//#region extensions/slack/src/reply-action-ids.ts
const SLACK_REPLY_BUTTON_ACTION_ID = "openclaw:reply_button";
const SLACK_REPLY_LINK_ACTION_ID = "openclaw:reply_link";
const SLACK_SESSION_LINK_ACTION_ID = "openclaw:session_link";
const SLACK_REPLY_SELECT_ACTION_ID = "openclaw:reply_select";
const SLACK_CALLBACK_BUTTON_ACTION_ID = "openclaw:callback_button";
const SLACK_CALLBACK_SELECT_ACTION_ID = "openclaw:callback_select";
const SLACK_APPROVAL_BUTTON_ACTION_ID = "openclaw:approval_button";
const SLACK_APPROVAL_SELECT_ACTION_ID = "openclaw:approval_select";
const SLACK_QUESTION_BUTTON_ACTION_ID = "openclaw:question_button";
const SLACK_QUESTION_FINALIZATION_BLOCKS = Symbol("slackQuestionFinalizationBlocks");
function isSlackQuestionActionId(actionId) {
	return actionId === "openclaw:question_button" || actionId.startsWith(`openclaw:question_button:`);
}
/** Read only question control identities from the blocks actually sent to Slack. */
function resolveSlackQuestionActionIds(blocks) {
	return (blocks ?? []).flatMap((block) => {
		if (block.type !== "actions") return [];
		return (block.elements ?? []).flatMap(({ action_id }) => action_id && isSlackQuestionActionId(action_id) ? [action_id] : []);
	});
}
function isSlackApprovalActionId(actionId) {
	return actionId === "openclaw:approval_button" || actionId === "openclaw:approval_select" || actionId.startsWith(`openclaw:approval_button:`) || actionId.startsWith(`openclaw:approval_select:`);
}
function isSlackCallbackActionId(actionId) {
	return actionId === "openclaw:callback_button" || actionId === "openclaw:callback_select" || actionId.startsWith(`openclaw:callback_button:`) || actionId.startsWith(`openclaw:callback_select:`);
}
//#endregion
//#region extensions/slack/src/truncate.ts
function truncateSlackText(value, max) {
	const trimmed = value.trim();
	if (trimmed.length <= max) return trimmed;
	if (max <= 1) return sliceUtf16Safe(trimmed, 0, max);
	return `${sliceUtf16Safe(trimmed, 0, max - 1)}…`;
}
function countSlackTextUtf8Bytes(value) {
	return Buffer.byteLength(value, "utf8");
}
/** Truncate Slack text without splitting a code point or exceeding a UTF-8 byte limit. */
function truncateSlackTextByUtf8Bytes(value, maxBytes) {
	const trimmed = value.trim();
	if (maxBytes <= 0) return "";
	if (countSlackTextUtf8Bytes(trimmed) <= maxBytes) return trimmed;
	const suffix = "…";
	const suffixBytes = countSlackTextUtf8Bytes(suffix);
	const prefixBudget = maxBytes >= suffixBytes ? maxBytes - suffixBytes : maxBytes;
	let prefix = "";
	let prefixBytes = 0;
	for (const character of trimmed) {
		const characterBytes = countSlackTextUtf8Bytes(character);
		if (prefixBytes + characterBytes > prefixBudget) break;
		prefix += character;
		prefixBytes += characterBytes;
	}
	return maxBytes >= suffixBytes ? `${prefix}${suffix}` : prefix;
}
//#endregion
//#region extensions/slack/src/blocks-render.ts
const SLACK_BUTTON_URL_MAX = 3e3;
function buildSlackReplyButtonActionId(buttonIndex, choiceIndex) {
	return `${SLACK_REPLY_BUTTON_ACTION_ID}:${String(buttonIndex)}:${String(choiceIndex + 1)}`;
}
function buildSlackReplyLinkActionId(buttonIndex, choiceIndex) {
	return `${SLACK_REPLY_LINK_ACTION_ID}:${String(buttonIndex)}:${String(choiceIndex + 1)}`;
}
function buildSlackReplySelectActionId(selectIndex) {
	return `${SLACK_REPLY_SELECT_ACTION_ID}:${String(selectIndex)}`;
}
function buildSlackApprovalButtonActionId(buttonIndex, choiceIndex) {
	return `${SLACK_APPROVAL_BUTTON_ACTION_ID}:${String(buttonIndex)}:${String(choiceIndex + 1)}`;
}
function buildSlackApprovalSelectActionId(selectIndex) {
	return `${SLACK_APPROVAL_SELECT_ACTION_ID}:${String(selectIndex)}`;
}
function buildSlackCallbackButtonActionId(buttonIndex, choiceIndex) {
	return `${SLACK_CALLBACK_BUTTON_ACTION_ID}:${String(buttonIndex)}:${String(choiceIndex + 1)}`;
}
function buildSlackCallbackSelectActionId(selectIndex) {
	return `${SLACK_CALLBACK_SELECT_ACTION_ID}:${String(selectIndex)}`;
}
function buildSlackQuestionButtonActionId(buttonIndex, choiceIndex) {
	return `${SLACK_QUESTION_BUTTON_ACTION_ID}:${String(buttonIndex)}:${String(choiceIndex + 1)}`;
}
function resolveSlackButtonStyle(style) {
	if (style === "primary" || style === "danger") return style;
	if (style === "success") return "primary";
}
function resolveSlackActionTarget(action, questionOptionIndices) {
	if (!action) return;
	if (action.type === "approval") return {
		kind: "approval",
		value: encodeSlackApprovalAction(action)
	};
	if (action.type === "question") {
		if ("intent" in action) return;
		const optionIndex = resolveAskUserQuestionOptionIndex({
			questionOptionIndices,
			questionId: action.questionId,
			optionValue: action.optionValue
		});
		const value = optionIndex === void 0 ? void 0 : encodeSlackQuestionAction({
			questionId: action.questionId,
			optionIndex
		});
		return value ? {
			kind: "question",
			value
		} : void 0;
	}
	if (action.type === "url" || action.type === "web-app") {
		const url = normalizeOptionalString(action.url);
		return url ? {
			kind: "link",
			url
		} : void 0;
	}
	if (action.type === "callback") {
		const value = normalizeOptionalString(action.value);
		return value ? {
			kind: "callback",
			value
		} : void 0;
	}
	const command = normalizeOptionalString(action.command);
	return command && parseExecApprovalCommandText(command) ? {
		kind: "reply",
		value: command
	} : void 0;
}
function resolveSlackButtonTarget(button, questionOptionIndices) {
	if (button.action !== void 0) {
		const action = resolveMessagePresentationButtonAction(button);
		return action ? resolveSlackActionTarget(action, questionOptionIndices) : void 0;
	}
	const legacyUrl = normalizeOptionalString(button.url ?? button.webApp?.url ?? button.web_app?.url);
	if (legacyUrl && isWithinSlackLimit(legacyUrl, SLACK_BUTTON_URL_MAX)) return {
		kind: "link",
		url: legacyUrl
	};
	const legacyValue = normalizeOptionalString(button.value);
	if (legacyValue) return {
		kind: "reply",
		value: legacyValue
	};
	return legacyUrl ? {
		kind: "link",
		url: legacyUrl
	} : void 0;
}
function isSlackTextFallbackButton(button) {
	const action = resolveMessagePresentationButtonAction(button);
	return action?.type === "question" && "intent" in action && action.intent === "custom-input";
}
function resolveSlackOptionTarget(option) {
	if (option.action !== void 0) {
		const action = resolveMessagePresentationOptionAction(option);
		const target = action ? resolveSlackActionTarget(action) : void 0;
		return target?.kind === "link" || target?.kind === "question" ? void 0 : target;
	}
	const value = normalizeOptionalString(option.value);
	return value ? {
		kind: "reply",
		value
	} : void 0;
}
function isWithinSlackLimit(value, maxLength) {
	return value.length <= maxLength;
}
function isRenderableSlackOption(option) {
	return isWithinSlackLimit(option.value, 150);
}
function readSlackBlockId(block) {
	const value = block.block_id;
	return typeof value === "string" ? value : void 0;
}
function readSlackOpenClawBlockIndex(blockId, prefix) {
	if (!blockId.startsWith(prefix)) return;
	const value = Number.parseInt(blockId.slice(prefix.length), 10);
	return Number.isSafeInteger(value) && value > 0 ? value : void 0;
}
/** Resolve existing Block Kit indexes and native-data budgets before appending portable blocks. */
function resolveSlackBlockOffsets(blocks) {
	let buttonIndexOffset = 0;
	const dataTableCellCharacterCountOffset = countSlackDataTableBlocksCellCharacters(blocks) ?? 10001;
	let dataVisualizationCountOffset = 0;
	let selectIndexOffset = 0;
	for (const block of blocks ?? []) {
		if (hasSlackDataVisualizationBlock([block])) dataVisualizationCountOffset += 1;
		const blockId = readSlackBlockId(block);
		if (!blockId) continue;
		buttonIndexOffset = Math.max(buttonIndexOffset, readSlackOpenClawBlockIndex(blockId, "openclaw_reply_buttons_") ?? 0);
		selectIndexOffset = Math.max(selectIndexOffset, readSlackOpenClawBlockIndex(blockId, "openclaw_reply_select_") ?? 0);
	}
	return {
		buttonIndexOffset,
		dataTableCellCharacterCountOffset,
		dataVisualizationCountOffset,
		selectIndexOffset
	};
}
/**
* @deprecated Use buildSlackPresentationBlocks with MessagePresentation.
*/
function buildSlackInteractiveBlocks(interactive, options = {}) {
	return buildSlackPresentationBlocks(interactive ? legacyInteractiveReplyToPresentation(interactive) : void 0, options);
}
/** Render portable presentation blocks as Slack Block Kit blocks. */
function buildSlackPresentationBlocks(presentation, options = {}) {
	if (!presentation) return [];
	const renderTablesNatively = canRenderSlackPresentationTables(presentation, options);
	const blocks = [];
	if (presentation.title) blocks.push({
		type: "header",
		text: {
			type: "plain_text",
			text: truncateSlackText(presentation.title, 150),
			emoji: true
		}
	});
	let buttonIndex = options.buttonIndexOffset ?? 0;
	let dataTableCellCharacterCount = options.dataTableCellCharacterCountOffset ?? 0;
	let dataVisualizationCount = options.dataVisualizationCountOffset ?? 0;
	let selectIndex = options.selectIndexOffset ?? 0;
	for (const block of presentation.blocks) {
		if (block.type === "text" || block.type === "context") {
			const text = block.text.trim();
			if (!text) continue;
			for (const chunk of chunkSlackMrkdwnText(text, SLACK_SECTION_TEXT_MAX)) blocks.push(block.type === "context" ? {
				type: "context",
				elements: [{
					type: "mrkdwn",
					text: chunk,
					verbatim: true
				}]
			} : {
				type: "section",
				text: {
					type: "mrkdwn",
					text: chunk
				}
			});
			continue;
		}
		if (block.type === "divider") {
			blocks.push({ type: "divider" });
			continue;
		}
		if (block.type === "buttons") {
			const rendered = buildSlackPresentationButtonBlock(block, buttonIndex + 1, options.questionOptionIndices);
			if (rendered) {
				buttonIndex += 1;
				blocks.push(rendered);
			}
			continue;
		}
		if (block.type === "chart") {
			const rendered = dataVisualizationCount < 2 ? buildSlackPresentationChartBlock(block) : void 0;
			if (rendered) {
				dataVisualizationCount += 1;
				blocks.push(rendered);
			} else {
				const fallback = renderSlackMessagePresentationChartFallbackText(block);
				blocks.push(...chunkTextForOutbound(fallback, SLACK_SECTION_TEXT_MAX).map((text) => ({
					type: "context",
					elements: [{
						type: "mrkdwn",
						text,
						verbatim: true
					}]
				})));
			}
			continue;
		}
		if (block.type === "table") {
			if (!renderTablesNatively) continue;
			const rendered = buildSlackDataTableBlock(block, { cellCharacterCountOffset: dataTableCellCharacterCount });
			if (rendered) {
				dataTableCellCharacterCount += countSlackDataTableCellCharacters(rendered);
				blocks.push(rendered);
			}
			continue;
		}
		if (block.type === "select") {
			const rendered = buildSlackPresentationSelectBlock(block, selectIndex + 1);
			if (rendered) {
				selectIndex += 1;
				blocks.push(rendered);
			}
		}
	}
	return blocks;
}
function buildSlackPresentationChartBlock(block) {
	return buildSlackDataVisualizationBlock(block);
}
function buildSlackPresentationButtonBlock(block, buttonIndex, questionOptionIndices) {
	const elements = block.buttons.flatMap((button, choiceIndex) => {
		const target = resolveSlackButtonTarget(button, questionOptionIndices);
		if (!target || (target.kind === "link" ? !isWithinSlackLimit(target.url, SLACK_BUTTON_URL_MAX) : !isWithinSlackLimit(target.value, 2e3))) return [];
		const style = resolveSlackButtonStyle(button.style);
		return [{
			type: "button",
			action_id: target.kind === "link" ? buildSlackReplyLinkActionId(buttonIndex, choiceIndex) : target.kind === "approval" ? buildSlackApprovalButtonActionId(buttonIndex, choiceIndex) : target.kind === "callback" ? buildSlackCallbackButtonActionId(buttonIndex, choiceIndex) : target.kind === "question" ? buildSlackQuestionButtonActionId(buttonIndex, choiceIndex) : buildSlackReplyButtonActionId(buttonIndex, choiceIndex),
			text: {
				type: "plain_text",
				text: truncateSlackText(button.label, 75),
				emoji: true
			},
			...target.kind === "link" ? { url: target.url } : { value: target.value },
			...style ? { style } : {}
		}];
	}).slice(0, 25);
	return elements.length > 0 ? {
		type: "actions",
		block_id: `openclaw_reply_buttons_${buttonIndex}`,
		elements
	} : void 0;
}
/** True when every portable table fits Slack's native per-message table budget. */
function canRenderSlackPresentationTables(presentation, options = {}) {
	let cellCharacterCount = options.dataTableCellCharacterCountOffset ?? 0;
	for (const block of presentation.blocks) {
		if (block.type !== "table") continue;
		const rendered = buildSlackDataTableBlock(block, { cellCharacterCountOffset: cellCharacterCount });
		if (!rendered) return false;
		cellCharacterCount += countSlackDataTableCellCharacters(rendered);
	}
	return true;
}
/** True when native Slack rendering preserves every portable control. */
function canRenderSlackPresentation(presentation, options = {}) {
	if (presentation.title && !isWithinSlackLimit(presentation.title.trim(), 150)) return false;
	if (!canRenderSlackPresentationTables(presentation, options)) return false;
	let dataVisualizationCount = options.dataVisualizationCountOffset ?? 0;
	for (const block of presentation.blocks) {
		if (block.type === "text" || block.type === "context") continue;
		if (block.type === "buttons") {
			let nativeButtonCount = 0;
			if (!(block.buttons.every((button) => {
				if (isSlackTextFallbackButton(button)) return true;
				nativeButtonCount += 1;
				if (!isWithinSlackLimit(button.label, 75)) return false;
				const target = resolveSlackButtonTarget(button, options.questionOptionIndices);
				return target ? target.kind === "link" ? isWithinSlackLimit(target.url, SLACK_BUTTON_URL_MAX) : isWithinSlackLimit(target.value, 2e3) : false;
			}) && nativeButtonCount <= 25)) return false;
			continue;
		}
		if (block.type === "select") {
			if (!(isWithinSlackLimit(normalizeOptionalString(block.placeholder) ?? "Choose an option", 75) && block.options.length <= 100 && (!block.placeholder || isWithinSlackLimit(block.placeholder, 75)) && block.options.every((option) => {
				if (!isWithinSlackLimit(option.label, 75)) return false;
				const target = resolveSlackOptionTarget(option);
				return target ? isRenderableSlackOption({
					label: option.label,
					...target
				}) : false;
			}) && new Set(block.options.map((option) => resolveSlackOptionTarget(option)?.kind)).size === 1)) return false;
			continue;
		}
		if (block.type === "chart") {
			if (dataVisualizationCount >= 2 || !canRenderSlackDataVisualization(block)) return false;
			dataVisualizationCount += 1;
			continue;
		}
		if (block.type === "table") continue;
	}
	return true;
}
function buildSlackPresentationSelectBlock(block, selectIndex) {
	const options = block.options.flatMap((option) => {
		const target = resolveSlackOptionTarget(option);
		return target ? [{
			label: option.label,
			...target
		}] : [];
	}).filter(isRenderableSlackOption).slice(0, 100);
	const optionKinds = new Set(options.map((option) => option.kind));
	return options.length > 0 && optionKinds.size === 1 ? {
		type: "actions",
		block_id: `openclaw_reply_select_${selectIndex}`,
		elements: [{
			type: "static_select",
			action_id: options[0]?.kind === "approval" ? buildSlackApprovalSelectActionId(selectIndex) : options[0]?.kind === "callback" ? buildSlackCallbackSelectActionId(selectIndex) : buildSlackReplySelectActionId(selectIndex),
			placeholder: {
				type: "plain_text",
				text: truncateSlackText(normalizeOptionalString(block.placeholder) ?? "Choose an option", 75),
				emoji: true
			},
			options: options.map((option) => ({
				text: {
					type: "plain_text",
					text: truncateSlackText(option.label, 75),
					emoji: true
				},
				value: option.value
			}))
		}]
	} : void 0;
}
//#endregion
//#region extensions/slack/src/limits.ts
const SLACK_TEXT_LIMIT = 8e3;
const SLACK_MESSAGE_TEXT_RECOMMENDED_LIMIT = 4e3;
const SLACK_EDIT_TEXT_MAX_BYTES = 4e3;
const SLACK_MESSAGE_TEXT_HARD_LIMIT = 4e4;
//#endregion
//#region extensions/slack/src/authored-text.ts
function normalizeComparableSlackText(text) {
	return text.trim().replace(/\s+/g, " ");
}
function isSlackAuthoredTextRepresentedInInteractive(text, interactive) {
	return isSlackAuthoredTextRepresentedInFragments(text, interactive?.blocks.flatMap((block) => block.type === "text" ? [block.text] : []) ?? []);
}
function isSlackAuthoredTextRepresentedInFragments(text, rawFragments) {
	const target = normalizeComparableSlackText(text);
	const fragments = rawFragments.map(normalizeComparableSlackText).filter(Boolean);
	for (let start = 0; start < fragments.length; start += 1) {
		let combined = "";
		for (let end = start; end < fragments.length; end += 1) {
			combined = normalizeComparableSlackText(`${combined} ${fragments[end]}`);
			if (combined === target) return true;
			if (combined.length > target.length) break;
		}
	}
	return false;
}
/** Resolve placement from producer facts, before accessibility text changes the payload text. */
function resolveSlackAuthoredTextPlacement(params) {
	const text = normalizeOptionalString(params.text);
	if (!text) return "none";
	return params.renderedInBlocks || isSlackAuthoredTextRepresentedInFragments(text, params.renderedTextFragments ?? []) || isSlackAuthoredTextRepresentedInInteractive(text, params.interactive) ? "blocks" : "outside-blocks";
}
//#endregion
//#region extensions/slack/src/blocks-fallback.ts
const SLACK_SELECT_ELEMENT_TYPES = /* @__PURE__ */ new Set([
	"static_select",
	"multi_static_select",
	"external_select",
	"multi_external_select",
	"users_select",
	"multi_users_select",
	"conversations_select",
	"multi_conversations_select",
	"channels_select",
	"multi_channels_select"
]);
function readTextObject(value, options = {}) {
	const record = asOptionalRecord(value);
	if (!record) return;
	const text = normalizeOptionalString(record?.text);
	if (!text) return;
	return record.type === "plain_text" && options.nativeDataFormat !== "plain" ? escapeSlackMrkdwn(text) : text;
}
function readTextValue(value, options = {}) {
	return normalizeOptionalString(value) ?? readTextObject(value, options);
}
function renderSlackRichTextElement(value, renderReference) {
	const element = asOptionalRecord(value);
	if (!element) return "";
	switch (element.type) {
		case "rich_text_section":
		case "rich_text_preformatted":
		case "rich_text_quote": return renderSlackRichTextElements(element.elements, "", renderReference);
		case "rich_text_list": return renderSlackRichTextElements(element.elements, "\n", renderReference);
		case "text": return typeof element.text === "string" ? escapeSlackMrkdwn(element.text) : "";
		case "link": return escapeSlackMrkdwn(normalizeOptionalString(element.text) ?? normalizeOptionalString(element.url) ?? "");
		case "user": {
			const userId = normalizeOptionalString(element.user_id);
			return userId ? renderReference(`<@${userId}>`) : "";
		}
		case "channel": {
			const channelId = normalizeOptionalString(element.channel_id);
			return channelId ? renderReference(`<#${channelId}>`) : "";
		}
		case "usergroup": {
			const usergroupId = normalizeOptionalString(element.usergroup_id);
			return usergroupId ? renderReference(`<!subteam^${usergroupId}>`) : "";
		}
		case "broadcast": {
			const range = normalizeOptionalString(element.range);
			return range ? renderReference(`<!${range}>`) : "";
		}
		case "emoji": {
			const name = normalizeOptionalString(element.name);
			return name ? `:${name}:` : "";
		}
		case "date": return escapeSlackMrkdwn(normalizeOptionalString(element.fallback) ?? "");
		default: return "";
	}
}
function renderSlackRichTextElements(value, separator, renderReference) {
	if (!Array.isArray(value)) return "";
	return value.map((element) => renderSlackRichTextElement(element, renderReference)).filter(Boolean).join(separator);
}
function readImageText(block) {
	const altText = normalizeOptionalString(block.alt_text);
	return (altText ? escapeSlackMrkdwn(altText) : void 0) ?? readTextObject(block.title);
}
function readVideoText(block, options = {}) {
	const altText = normalizeOptionalString(block.alt_text);
	return readTextObject(block.title, options) ?? (altText ? escapeSlackMrkdwn(altText) : void 0);
}
function readContextText(block, options = {}) {
	if (!Array.isArray(block.elements)) return;
	const parts = block.elements.map((element) => {
		const record = asOptionalRecord(element);
		const altText = normalizeOptionalString(record?.alt_text);
		return readTextObject(record, options) ?? (altText ? escapeSlackMrkdwn(altText) : void 0);
	}).filter((part) => Boolean(part));
	return parts.length > 0 ? parts.join(" ") : void 0;
}
function readControlElementText(value, options = {}) {
	const element = asOptionalRecord(value);
	const type = normalizeOptionalString(element?.type);
	if (type === "button" || type === "workflow_button") return readTextValue(element?.text, options);
	if (type && SLACK_SELECT_ELEMENT_TYPES.has(type)) return readTextObject(element?.placeholder, options);
}
function readControlElementsText(values, options = {}) {
	const seen = /* @__PURE__ */ new Set();
	const labels = [];
	for (const value of values) {
		const candidate = readControlElementText(value, options);
		if (!candidate || seen.has(candidate)) continue;
		seen.add(candidate);
		labels.push(candidate);
	}
	return labels.length > 0 ? labels.join("\n") : void 0;
}
function readSectionText(block, options = {}) {
	const parts = [readTextObject(block.text, options)];
	if (Array.isArray(block.fields)) parts.push(...block.fields.map((field) => readTextObject(field, options)));
	parts.push(readControlElementText(block.accessory, options));
	const visibleParts = parts.filter((part) => Boolean(part));
	return visibleParts.length > 0 ? visibleParts.join("\n") : void 0;
}
function readActionsText(block, options = {}) {
	return Array.isArray(block.elements) ? readControlElementsText(block.elements, options) : void 0;
}
/** Read only user-visible text from one Slack block. */
function renderSlackBlockFallbackText(raw, options = {}) {
	const block = asOptionalRecord(raw);
	if (!block) return;
	switch (block.type) {
		case "rich_text": return normalizeOptionalString(renderSlackRichTextElements(block.elements, "\n", options.nativeReferenceFormat === "plain" ? (text) => text : escapeSlackMrkdwn));
		case "header": return readTextObject(block.text, options);
		case "section": return readSectionText(block, options);
		case "image": return readImageText(block) ?? "Shared an image";
		case "video": return readVideoText(block, options) ?? "Shared a video";
		case "file": return "Shared a file";
		case "context": return readContextText(block, options);
		case "actions": return readActionsText(block, options);
		case "data_visualization": return options.nativeDataFormat === "plain" ? renderSlackDataVisualizationFallbackText(block) : renderSlackDataVisualizationMrkdwnFallbackText(block);
		case "data_table": return options.nativeDataFormat === "plain" ? renderSlackDataTableFallbackText(block) : renderSlackDataTableMrkdwnFallbackText(block);
		case "table": return options.nativeDataFormat === "plain" ? renderSlackTableFallbackText(block) : renderSlackTableMrkdwnFallbackText(block);
		default: return;
	}
}
function buildSlackBlocksFallbackText(blocks) {
	for (const block of blocks) {
		const text = renderSlackBlockFallbackText(block);
		if (text) return text;
	}
	return "Shared a Block Kit message";
}
function buildSlackCompleteBlocksFallbackText(blocks) {
	return blocks.map((block) => renderSlackBlockFallbackText(block)).filter(Boolean).join("\n\n").trim() || buildSlackBlocksFallbackText(blocks);
}
//#endregion
//#region extensions/slack/src/native-data-blocks.ts
const SLACK_MALFORMED_NATIVE_DATA_FALLBACK = "Slack could not render this chart or table data.";
const SLACK_RESPONSE_URL_BODY_LIMIT_BYTES = 16 * 1024;
const SLACK_RESPONSE_URL_BODY_TIMEOUT_MS = 3e4;
/** Detect a native Slack chart or table block. */
function hasSlackNativeDataBlock(blocks) {
	return hasSlackDataVisualizationBlock(blocks) || hasSlackDataTableBlock(blocks);
}
/** Keep every sibling block while removing Slack's native data blocks. */
function stripSlackNativeDataBlocks(blocks) {
	return (blocks ?? []).filter((block) => {
		const type = asOptionalRecord(block)?.type;
		return type !== "data_table" && type !== "data_visualization";
	});
}
/** Match Slack's Web API and response_url `invalid_blocks` error shapes. */
function isSlackInvalidBlocksError(error) {
	const record = asOptionalRecord(error);
	const rawData = record?.data;
	const data = asOptionalRecord(rawData);
	const rawResponseData = asOptionalRecord(record?.response)?.data;
	const responseData = asOptionalRecord(rawResponseData);
	const code = data?.error ?? (typeof rawData === "string" ? rawData : void 0) ?? responseData?.error ?? (typeof rawResponseData === "string" ? rawResponseData : void 0) ?? record?.error;
	return typeof code === "string" && code.trim().toLowerCase() === "invalid_blocks";
}
function isSlackResponseLike(value) {
	const record = asOptionalRecord(value);
	const body = asOptionalRecord(record?.body);
	return typeof record?.status === "number" && (typeof record.arrayBuffer === "function" || typeof body?.getReader === "function");
}
/** Consume Bolt 5's native response_url body under strict time and byte bounds. */
async function isSlackInvalidBlocksResponse(response) {
	if (!isSlackResponseLike(response)) return isSlackInvalidBlocksError(response);
	try {
		const body = await readResponseTextLimited(response, SLACK_RESPONSE_URL_BODY_LIMIT_BYTES, { timeoutMs: SLACK_RESPONSE_URL_BODY_TIMEOUT_MS });
		if (body.trim().toLowerCase() === "invalid_blocks") return true;
		return isSlackInvalidBlocksError(JSON.parse(body));
	} catch {
		return false;
	}
}
/** Bolt 5 omits the response body from RespondError; 400 is contextual here. */
function isSlackNativeResponseUrlRejection(error) {
	if (isSlackInvalidBlocksError(error)) return true;
	const record = asOptionalRecord(error);
	return record?.code === "slack_bolt_respond_error" && record.statusCode === 400;
}
/** Extract a complete accessible summary from a supported native data block. */
function renderSlackNativeDataFallbackText(value) {
	const type = asOptionalRecord(value)?.type;
	if (type === "data_visualization") return renderSlackDataVisualizationMrkdwnFallbackText(value);
	if (type === "data_table") return renderSlackDataTableMrkdwnFallbackText(value);
}
function comparableText(value) {
	return value.replace(/\s+/gu, " ").trim();
}
function countComparableOccurrences(value, candidate) {
	if (!candidate) return 0;
	let count = 0;
	let offset = 0;
	while ((offset = value.indexOf(candidate, offset)) >= 0) {
		count += 1;
		offset += candidate.length;
	}
	return count;
}
/** Consume native fallback occurrences already carried by an explicit outside base. */
function createSlackNativeDataBaseTextConsumer(baseText) {
	const comparableBase = comparableText(baseText);
	const remainingByText = /* @__PURE__ */ new Map();
	return (text) => {
		const comparable = comparableText(text);
		const remaining = remainingByText.get(comparable) ?? countComparableOccurrences(comparableBase, comparable);
		if (remaining <= 0) return false;
		remainingByText.set(comparable, remaining - 1);
		return true;
	};
}
function appendSlackNativeDataFallback(text, blocks, render) {
	const base = text.trim();
	const consumeFromBase = createSlackNativeDataBaseTextConsumer(base);
	const dataTexts = [];
	for (const block of blocks ?? []) {
		const dataText = render(block);
		if (!dataText) continue;
		if (!comparableText(dataText) || consumeFromBase(dataText)) continue;
		dataTexts.push(dataText);
	}
	return [base, ...dataTexts].filter(Boolean).join("\n\n");
}
function renderSlackNativeDataPlainTextBlock(value) {
	const type = asOptionalRecord(value)?.type;
	if (type === "data_table") return renderSlackDataTableCompactPlainTextFallback(value);
	if (type === "data_visualization") return renderSlackDataVisualizationFallbackText(value);
}
/** Build formatting-disabled accessibility text from actual Slack block order. */
function buildSlackNativeDataAccessibilityText(text, blocks) {
	const parts = [];
	const consumeFromBase = createSlackNativeDataBaseTextConsumer(text);
	const append = (value) => {
		if (value?.trim()) parts.push(value);
	};
	append(text);
	for (const block of blocks ?? []) {
		const isNativeData = hasSlackNativeDataBlock([block]);
		const rendered = renderSlackNativeDataPlainTextBlock(block) ?? renderSlackBlockFallbackText(block, { nativeDataFormat: "plain" }) ?? (isNativeData ? "Slack could not render this chart or table data." : void 0);
		if (!rendered || isNativeData && consumeFromBase(rendered)) continue;
		append(rendered);
	}
	return parts.join("\n\n");
}
/** Preserve every native data block's content once when Slack requires a text-only retry. */
function appendSlackNativeDataFallbackText(text, blocks) {
	return appendSlackNativeDataFallback(text, blocks, renderSlackNativeDataFallbackText);
}
/** Build a bounded plain-text retry without activating control tokens. */
function appendSlackNativeDataPlainTextFallback(text, blocks) {
	return appendSlackNativeDataFallback(text, blocks, renderSlackNativeDataPlainTextBlock);
}
//#endregion
//#region extensions/slack/src/reply-blocks.ts
function parseSlackReplyBlockSegments(value) {
	if (value === void 0) return;
	if (!Array.isArray(value)) throw new Error("Slack rendered presentation segments must be an array");
	return value.map((raw) => {
		if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error("Slack rendered presentation segment must be an object");
		const segment = raw;
		if (segment.kind === "text" && typeof segment.text === "string" && segment.mrkdwn === false) return {
			kind: "text",
			text: segment.text,
			mrkdwn: false
		};
		if (segment.kind === "blocks") {
			const blocks = parseSlackBlocksInput(segment.blocks);
			if (blocks?.length) return {
				kind: "blocks",
				blocks
			};
		}
		throw new Error("Slack rendered presentation segment is invalid");
	});
}
/** Convert compiled segments into ordered sender calls without re-inferring text placement. */
function resolveSlackReplyDeliveryMessages(params) {
	const messages = [];
	let outsideText = params.authoredTextPlacement === "outside-blocks" ? params.text?.trim() ?? "" : "";
	for (const segment of params.segments) {
		if (segment.kind === "text") {
			const text = [outsideText, segment.text].filter(Boolean).join("\n\n");
			outsideText = "";
			if (text) messages.push({
				text,
				textIsSlackPlainText: true
			});
			continue;
		}
		const baseText = outsideText;
		outsideText = "";
		const text = buildSlackNativeDataAccessibilityText(baseText, segment.blocks) || buildSlackBlocksFallbackText(segment.blocks);
		const authoredTextPlacement = baseText ? "outside-blocks" : params.authoredTextPlacement === "blocks" ? "blocks" : "none";
		messages.push({
			text,
			blocks: segment.blocks,
			authoredTextPlacement,
			...baseText ? { nativeDataFallbackBaseText: baseText } : {}
		});
	}
	if (outsideText) messages.push({
		text: outsideText,
		authoredTextPlacement: "outside-blocks"
	});
	return messages;
}
function resolveSlackReplyText(payload, text = payload.text) {
	const presentation = normalizeMessagePresentation(payload.presentation);
	return presentation ? renderSlackMessagePresentationFallbackText({
		text,
		presentation
	}) : text ?? "";
}
function resolveSlackReplyRenderPlan(payload, text = payload.text) {
	const hasStructuredContent = hasSlackReplyStructuredContent(payload);
	const resolution = resolveSlackReplyBlockResolution({
		...payload,
		text
	}, { materializeAuthoredText: hasStructuredContent });
	const messages = resolveSlackReplyDeliveryMessages({
		authoredTextPlacement: resolution.authoredTextPlacement,
		segments: resolution.segments,
		text
	});
	if (messages.length <= 1) {
		const [message] = messages;
		const sourceText = text?.trim() ?? "";
		const blocks = message?.authoredTextPlacement === "blocks" ? addPreviewVerbatimToAuthoredTextBlocks(message.blocks, sourceText) : message?.blocks;
		let renderedText = message?.text ?? resolveSlackReplyText(payload, text);
		let textIsSlackMrkdwn = Boolean(message && !message.textIsSlackPlainText && (message.authoredTextPlacement !== "outside-blocks" || message.nativeDataFallbackBaseText));
		if (blocks?.length && sourceText) {
			if (hasSlackNativeDataBlock(blocks)) {
				renderedText = appendSlackNativeDataFallbackText(sourceText, blocks) || renderedText;
				textIsSlackMrkdwn = true;
			} else if (message?.authoredTextPlacement === "blocks") {
				renderedText = sourceText;
				textIsSlackMrkdwn = false;
			}
		}
		return {
			mode: "single",
			text: renderedText,
			...blocks ? { blocks } : {},
			...textIsSlackMrkdwn ? { textIsSlackMrkdwn: true } : {}
		};
	}
	const blockPart = messages.find((message) => message.blocks?.length);
	return {
		mode: "split",
		fallbackText: messages.map((message) => message.text).filter(Boolean).join("\n\n"),
		...blockPart ? { blockPart: {
			text: blockPart.text,
			blocks: blockPart.blocks
		} } : {}
	};
}
function readSlackChannelBlocks(payload) {
	const slackData = payload.channelData?.slack;
	if (!slackData || typeof slackData !== "object" || Array.isArray(slackData)) return [];
	return parseSlackBlocksInput(slackData.blocks) ?? [];
}
function hasSlackReplyStructuredContent(payload) {
	return Boolean(readSlackChannelBlocks(payload).length || normalizeMessagePresentation(payload.presentation) || payload.interactive?.blocks.length);
}
function renderSlackAuthoredTextFragments(blocks) {
	return blocks.flatMap((block) => {
		if (block.type === "actions") return [];
		const text = renderSlackBlockFallbackText(block, { nativeDataFormat: "plain" });
		return text ? [text] : [];
	});
}
function buildSlackAuthoredTextBlocks(text) {
	return markdownToSlackMrkdwnChunks(text, SLACK_SECTION_TEXT_MAX).map((chunk) => ({
		type: "section",
		text: {
			type: "mrkdwn",
			text: chunk,
			verbatim: true
		}
	}));
}
function addPreviewVerbatimToAuthoredTextBlocks(blocks, sourceText) {
	if (!blocks?.length || !sourceText) return blocks;
	const authoredChunks = new Set(markdownToSlackMrkdwnChunks(sourceText, SLACK_SECTION_TEXT_MAX));
	return blocks.map((block) => {
		const text = block.text;
		if (block.type !== "section" || text?.type !== "mrkdwn" || typeof text.text !== "string" || !authoredChunks.has(text.text)) return block;
		return {
			...block,
			text: {
				...text,
				verbatim: true
			}
		};
	});
}
function readLastBlockSegment(segments) {
	const last = segments.at(-1);
	return last?.kind === "blocks" ? last.blocks : [];
}
function readAllNativeBlocks(segments) {
	return segments.flatMap((segment) => segment.kind === "blocks" ? segment.blocks : []);
}
function appendTextSegment(segments, text) {
	const trimmed = text.trim();
	if (!trimmed) return;
	const last = segments.at(-1);
	if (last?.kind === "text") {
		last.text = `${last.text}\n\n${trimmed}`;
		return;
	}
	segments.push({
		kind: "text",
		text: trimmed,
		mrkdwn: false
	});
}
function appendBlockSegment(segments, blocks, startNew = false) {
	let shouldStartNew = startNew;
	for (const block of blocks) {
		const last = segments.at(-1);
		if (!shouldStartNew && last?.kind === "blocks" && last.blocks.length < 50) last.blocks.push(block);
		else segments.push({
			kind: "blocks",
			blocks: [block]
		});
		shouldStartNew = false;
	}
}
function resolvePresentationRenderOptions(segments, mode) {
	const allOffsets = resolveSlackBlockOffsets(readAllNativeBlocks(segments));
	return {
		...mode === "current" ? resolveSlackBlockOffsets(readLastBlockSegment(segments)) : {},
		buttonIndexOffset: allOffsets.buttonIndexOffset,
		selectIndexOffset: allOffsets.selectIndexOffset
	};
}
function renderNativePresentation(presentation, options) {
	if (!canRenderSlackPresentation(presentation, options)) return;
	const blocks = buildSlackPresentationBlocks(presentation, options);
	return blocks.length > 0 ? blocks : void 0;
}
function appendPresentationPart(segments, presentation, questionOptionIndices) {
	const currentBlocks = readLastBlockSegment(segments);
	const currentRendered = renderNativePresentation(presentation, {
		...resolvePresentationRenderOptions(segments, "current"),
		questionOptionIndices
	});
	if (currentRendered && currentBlocks.length + currentRendered.length <= 50) {
		appendBlockSegment(segments, currentRendered);
		return;
	}
	const freshRendered = renderNativePresentation(presentation, {
		...resolvePresentationRenderOptions(segments, "new-message"),
		questionOptionIndices
	});
	if (freshRendered) {
		appendBlockSegment(segments, freshRendered, true);
		return;
	}
	appendTextSegment(segments, renderMessagePresentationFallbackText({ presentation }));
}
const SLACK_BUTTON_CONTROL_ACTION_IDS = [
	SLACK_APPROVAL_BUTTON_ACTION_ID,
	SLACK_CALLBACK_BUTTON_ACTION_ID,
	SLACK_QUESTION_BUTTON_ACTION_ID,
	SLACK_REPLY_BUTTON_ACTION_ID,
	SLACK_REPLY_LINK_ACTION_ID
];
const SLACK_SELECT_CONTROL_ACTION_IDS = [
	SLACK_APPROVAL_SELECT_ACTION_ID,
	SLACK_CALLBACK_SELECT_ACTION_ID,
	SLACK_REPLY_SELECT_ACTION_ID
];
function readGeneratedSlackControlRowKey(block) {
	const record = block;
	if (record.type !== "actions" || typeof record.block_id !== "string") return;
	const expectedElementType = /^openclaw_reply_buttons_[1-9]\d*$/.test(record.block_id) ? "button" : /^openclaw_reply_select_[1-9]\d*$/.test(record.block_id) ? "static_select" : void 0;
	if (!expectedElementType || !Array.isArray(record.elements) || record.elements.length === 0) return;
	const actionIds = expectedElementType === "button" ? SLACK_BUTTON_CONTROL_ACTION_IDS : SLACK_SELECT_CONTROL_ACTION_IDS;
	const elements = record.elements.map((element) => {
		if (!element || typeof element !== "object" || Array.isArray(element)) return;
		const { action_id: actionId, ...content } = element;
		const actionFamily = typeof actionId === "string" ? actionIds.find((candidate) => actionId.startsWith(`${candidate}:`)) : void 0;
		return actionFamily && content.type === expectedElementType ? [actionFamily, content] : void 0;
	});
	return elements.some((element) => element === void 0) ? void 0 : JSON.stringify(elements);
}
function subtractMirroredSlackControlRows(params) {
	const remainingMirrors = /* @__PURE__ */ new Map();
	for (const block of params.presentationBlocks) {
		const key = readGeneratedSlackControlRowKey(block);
		if (key) remainingMirrors.set(key, (remainingMirrors.get(key) ?? 0) + 1);
	}
	return params.interactiveBlocks.filter((block) => {
		const key = readGeneratedSlackControlRowKey(block);
		const remaining = key ? remainingMirrors.get(key) ?? 0 : 0;
		if (!key || remaining === 0) return true;
		remainingMirrors.set(key, remaining - 1);
		return false;
	});
}
/**
* Resolve reply content into transport-order segments. Each blocks segment is
* one Slack message; text segments carry complete fallback content between it.
*/
function resolveSlackReplyBlockResolution(payload, options = {}) {
	const segments = [];
	const channelBlocks = readSlackChannelBlocks(payload);
	let compiledChannelBlocks = channelBlocks;
	let authoredTextKnownInBlocks = false;
	if (options.materializeAuthoredText) {
		const rawTextFragments = renderSlackAuthoredTextFragments(channelBlocks);
		const initialPlacement = resolveSlackAuthoredTextPlacement({
			text: payload.text,
			interactive: payload.interactive,
			renderedTextFragments: rawTextFragments
		});
		authoredTextKnownInBlocks = initialPlacement === "blocks";
		const text = normalizeOptionalString(payload.text);
		if (text && initialPlacement === "outside-blocks") {
			const textBlocks = buildSlackAuthoredTextBlocks(text);
			if (resolveSlackAuthoredTextPlacement({
				text: renderSlackAuthoredTextFragments(textBlocks).join(" "),
				renderedTextFragments: rawTextFragments
			}) !== "blocks") compiledChannelBlocks = [...channelBlocks, ...textBlocks];
			authoredTextKnownInBlocks = true;
		}
	}
	if (compiledChannelBlocks.length > 0) appendBlockSegment(segments, compiledChannelBlocks);
	const presentation = normalizeMessagePresentation(payload.presentation);
	const questionOptionIndices = resolveAskUserQuestionOptionIndices(payload);
	const presentationBlockOffset = readAllNativeBlocks(segments).length;
	if (presentation?.title) appendPresentationPart(segments, {
		title: presentation.title,
		blocks: []
	}, questionOptionIndices);
	for (const block of presentation?.blocks ?? []) appendPresentationPart(segments, { blocks: [block] }, questionOptionIndices);
	const renderedPresentationBlocks = readAllNativeBlocks(segments).slice(presentationBlockOffset);
	appendBlockSegment(segments, subtractMirroredSlackControlRows({
		interactiveBlocks: buildSlackInteractiveBlocks(payload.interactive, {
			...resolveSlackBlockOffsets(readAllNativeBlocks(segments)),
			questionOptionIndices
		}),
		presentationBlocks: renderedPresentationBlocks
	}));
	const renderedTextFragments = segments.flatMap((segment) => {
		if (segment.kind === "text") return [segment.text];
		return renderSlackAuthoredTextFragments(segment.blocks);
	});
	const authoredTextPlacement = resolveSlackAuthoredTextPlacement({
		text: payload.text,
		interactive: payload.interactive,
		renderedTextFragments
	});
	return {
		authoredTextPlacement: authoredTextKnownInBlocks ? "blocks" : authoredTextPlacement,
		segments
	};
}
/** Return the single-message native shape when no ordered text fallback is required. */
function resolveSlackReplyBlocks(payload) {
	const { segments } = resolveSlackReplyBlockResolution(payload);
	return segments.length === 1 && segments[0]?.kind === "blocks" ? segments[0].blocks : void 0;
}
//#endregion
//#region extensions/slack/src/detached-target-admission.ts
function assertSlackDetachedTargetAllowed(accountId, teamId) {
	const installationKind = getSlackInstallationKind(accountId);
	if (installationKind && installationKind !== "workspace" && !teamId) throw new Error("unsupported_enterprise_slack_delivery: detached Slack operations require team:<team-id>:channel:<channel-id> or team:<team-id>:user:<user-id> until a workspace install is authenticated");
}
//#endregion
//#region extensions/slack/src/monitor/allow-list.ts
const SLACK_SLUG_CACHE_MAX = 512;
const SLACK_STABLE_USER_ID_RE = /^[ubw][a-z0-9]+$/;
const slackSlugCache = /* @__PURE__ */ new Map();
function normalizeSlackSlug(raw) {
	const key = raw ?? "";
	const cached = slackSlugCache.get(key);
	if (cached !== void 0) return cached;
	const normalized = normalizeHyphenSlug(raw);
	slackSlugCache.set(key, normalized);
	if (slackSlugCache.size > SLACK_SLUG_CACHE_MAX) {
		const oldest = slackSlugCache.keys().next();
		if (!oldest.done) slackSlugCache.delete(oldest.value);
	}
	return normalized;
}
function normalizeAllowList(list) {
	return normalizeStringEntries$1(list);
}
function normalizeAllowListLower(list) {
	return normalizeStringEntriesLower(list);
}
function normalizeSlackAllowOwnerEntry(entry) {
	const trimmed = normalizeOptionalLowercaseString(entry);
	if (!trimmed || trimmed === "*") return;
	try {
		const target = parseSlackTarget(trimmed);
		if (target?.kind === "user" && target.teamId) return target.id.toLowerCase();
	} catch {
		return;
	}
	const withoutPrefix = trimmed.replace(/^(slack:|user:)/, "");
	return SLACK_STABLE_USER_ID_RE.test(withoutPrefix) ? withoutPrefix : void 0;
}
function resolveSlackAllowListMatch(params) {
	const compiledAllowList = compileAllowlist(params.allowList);
	const teamId = normalizeOptionalLowercaseString(params.teamId);
	const id = normalizeOptionalLowercaseString(params.id);
	const name = normalizeOptionalLowercaseString(params.name);
	const slug = normalizeSlackSlug(name);
	const scopedCandidates = [{
		value: teamId && id ? `team:${teamId}:user:${id}` : void 0,
		source: "workspace-id"
	}];
	const unscopedCandidates = [
		{
			value: id,
			source: "id"
		},
		{
			value: id ? `slack:${id}` : void 0,
			source: "prefixed-id"
		},
		{
			value: id ? `user:${id}` : void 0,
			source: "prefixed-user"
		},
		...params.allowNameMatching === true ? [
			{
				value: name,
				source: "name"
			},
			{
				value: name ? `slack:${name}` : void 0,
				source: "prefixed-name"
			},
			{
				value: slug,
				source: "slug"
			}
		] : []
	];
	return resolveCompiledAllowlistMatch({
		compiledAllowlist: compiledAllowList,
		candidates: [...scopedCandidates, ...unscopedCandidates]
	});
}
function allowListMatches(params) {
	return resolveSlackAllowListMatch(params).allowed;
}
function resolveSlackUserAllowed(params) {
	const allowList = normalizeAllowListLower(params.allowList);
	if (allowList.length === 0) return true;
	return allowListMatches({
		allowList,
		teamId: params.teamId,
		id: params.userId,
		name: params.userName,
		allowNameMatching: params.allowNameMatching
	});
}
function resolveSlackUserAllowListForTeam(params) {
	const allowList = normalizeAllowListLower(params.allowList);
	const teamId = normalizeOptionalLowercaseString(params.teamId);
	return allowList.flatMap((entry) => {
		if (entry === "*") return [entry];
		if (!entry.startsWith("team:")) return [entry];
		try {
			const target = parseSlackTarget(entry);
			if (target?.kind === "user" && target.teamId?.toLowerCase() === teamId) return [entry];
			return params.preserveUnmatchedScopedEntries ? [entry] : [];
		} catch {
			return params.preserveUnmatchedScopedEntries ? [entry] : [];
		}
	});
}
//#endregion
//#region extensions/slack/src/monitor/workspace-routing.ts
function resolveSlackEnterpriseMainDmSessionKey(params) {
	const accountId = encodeURIComponent(params.accountId).toLowerCase();
	const teamId = encodeURIComponent(params.eventScope.teamId).toLowerCase();
	return `${params.baseSessionKey}:account:${accountId}:team:${teamId}`;
}
function qualifySlackRoutePeerId(params) {
	if (!params.eventScope) return params.id;
	return `team:${encodeURIComponent(params.eventScope.teamId)}:${params.kind}:${encodeURIComponent(params.id)}`;
}
function qualifySlackConversationId(conversationId, eventScope) {
	return eventScope ? `team:${encodeURIComponent(eventScope.teamId)}:${conversationId}` : conversationId;
}
//#endregion
//#region extensions/slack/src/group-policy.ts
function buildSlackChannelIdCandidates(channelId, teamId, options) {
	const trimmedId = channelId?.trim();
	if (!trimmedId) return [];
	const lowercaseId = trimmedId.toLowerCase();
	const uppercaseId = trimmedId.toUpperCase();
	const exactTeamId = teamId || void 0;
	const lowercaseTeamId = exactTeamId?.toLowerCase();
	const uppercaseTeamId = exactTeamId?.toUpperCase();
	const scopedCandidates = buildChannelKeyCandidates(exactTeamId ? `team:${exactTeamId}:channel:${trimmedId}` : void 0, lowercaseTeamId ? `team:${lowercaseTeamId}:channel:${lowercaseId}` : void 0, uppercaseTeamId ? `team:${uppercaseTeamId}:channel:${uppercaseId}` : void 0);
	if (exactTeamId && options?.allowUnscoped !== true) return scopedCandidates;
	return buildChannelKeyCandidates(...scopedCandidates, trimmedId, lowercaseId, uppercaseId, `channel:${trimmedId}`, `channel:${lowercaseId}`, `channel:${uppercaseId}`);
}
function buildSlackChannelPolicyScope(params) {
	const channels = params.channels ?? {};
	const tree = { scopes: channels };
	const matchKey = params.candidates.find((candidate) => candidate !== "*" && Object.hasOwn(tree.scopes, candidate)) ?? (Object.hasOwn(tree.scopes, "*") ? "*" : void 0);
	const matchSource = matchKey === void 0 ? void 0 : matchKey === "*" ? "wildcard" : "direct";
	return {
		tree,
		path: matchKey ? [matchKey] : [],
		entry: matchKey ? channels[matchKey] : void 0,
		wildcardEntry: channels["*"],
		matchKey,
		matchSource
	};
}
function resolveSlackGroupPolicyScope(params) {
	const accountId = normalizeAccountId(params.accountId ?? resolveDefaultSlackAccountId(params.cfg));
	const channels = mergeSlackAccountConfig(params.cfg, accountId).channels;
	const channelName = params.groupChannel?.replace(/^#/, "");
	const allowUnscoped = getSlackInstallationKind(accountId) !== "enterprise";
	return buildSlackChannelPolicyScope({
		channels,
		candidates: buildChannelKeyCandidates(...buildSlackChannelIdCandidates(params.groupId, params.groupSpace, { allowUnscoped }), channelName ? `#${channelName}` : void 0, channelName, normalizeHyphenSlug(channelName))
	});
}
function resolveSlackGroupRequireMention(params) {
	return resolveScopeRequireMention(resolveSlackGroupPolicyScope(params));
}
function resolveSlackGroupToolPolicy(params) {
	return resolveScopeToolsPolicy({
		...resolveSlackGroupPolicyScope(params),
		senderPolicyMode: params.senderPolicyMode,
		senderId: params.senderId,
		senderName: params.senderName,
		senderUsername: params.senderUsername,
		senderE164: params.senderE164
	});
}
//#endregion
export { isSlackCallbackActionId as $, isSlackInvalidBlocksResponse as A, getSlackApprovalApprovers as At, SLACK_TEXT_LIMIT as B, SLACK_MALFORMED_NATIVE_DATA_FALLBACK as C, resolveTurnSourceSlackOriginTarget as Ct, createSlackNativeDataBaseTextConsumer as D, getSlackInstallationKind as Dt, buildSlackNativeDataAccessibilityText as E, slackTargetsMatch as Et, renderSlackBlockFallbackText as F, normalizeSlackApproverId as Ft, truncateSlackText as G, buildSlackPresentationBlocks as H, resolveSlackAuthoredTextPlacement as I, resolveSlackExecApprovalTarget as It, SLACK_REPLY_BUTTON_ACTION_ID as J, truncateSlackTextByUtf8Bytes as K, SLACK_EDIT_TEXT_MAX_BYTES as L, shouldSuppressLocalSlackExecApprovalPrompt as Lt, stripSlackNativeDataBlocks as M, getSlackExecApprovalApprovers as Mt, buildSlackBlocksFallbackText as N, isSlackExecApprovalAuthorizedSender as Nt, hasSlackNativeDataBlock as O, isSlackWorkspaceInstallation as Ot, buildSlackCompleteBlocksFallbackText as P, isSlackExecApprovalClientEnabled as Pt, isSlackApprovalActionId as Q, SLACK_MESSAGE_TEXT_HARD_LIMIT as R, SLACK_PRIVATE_ACTION_DELIVERY_RESULT as Rt, resolveSlackReplyRenderPlan as S, resolveSlackFallbackOriginTarget as St, appendSlackNativeDataPlainTextFallback as T, shouldHandleSlackPluginViaForwardingSession as Tt, canRenderSlackPresentation as U, buildSlackInteractiveBlocks as V, countSlackTextUtf8Bytes as W, SLACK_REPLY_SELECT_ACTION_ID as X, SLACK_REPLY_LINK_ACTION_ID as Y, SLACK_SESSION_LINK_ACTION_ID as Z, hasSlackReplyStructuredContent as _, isSlackAnyNativeApprovalClientEnabled as _t, qualifySlackConversationId as a, markdownToSlackMrkdwnChunks as at, resolveSlackReplyBlocks as b, resolveEnterpriseApprovalTeamId as bt, allowListMatches as c, escapeSlackMrkdwn as ct, normalizeSlackAllowOwnerEntry as d, SLACK_PRESENTATION_CAPABILITIES as dt, isSlackQuestionActionId as et, normalizeSlackSlug as f, SLACK_SECTION_TEXT_MAX as ft, assertSlackDetachedTargetAllowed as g, hasSlackPluginApprovers as gt, resolveSlackUserAllowed as h, validateSlackBlocksArray as ht, resolveSlackGroupToolPolicy as i, chunkSlackMrkdwnText as it, isSlackNativeResponseUrlRejection as j, isSlackApprovalAuthorizedSender as jt, isSlackInvalidBlocksError as k, registerSlackInstallationState as kt, normalizeAllowList as l, SLACK_APPROVAL_HEADER_BLOCK_ID as lt, resolveSlackUserAllowListForTeam as m, parseSlackBlocksInput as mt, buildSlackChannelPolicyScope as n, decodeSlackQuestionAction as nt, qualifySlackRoutePeerId as o, normalizeSlackOutboundText as ot, resolveSlackAllowListMatch as p, SLACK_MAX_BLOCKS as pt, SLACK_QUESTION_FINALIZATION_BLOCKS as q, resolveSlackGroupRequireMention as r, resolveSlackQuestionAction as rt, resolveSlackEnterpriseMainDmSessionKey as s, renderSlackMessagePresentationFallbackText as st, buildSlackChannelIdCandidates as t, resolveSlackQuestionActionIds as tt, normalizeAllowListLower as u, decodeSlackApprovalAction as ut, parseSlackReplyBlockSegments as v, normalizeSlackForwardTarget as vt, appendSlackNativeDataFallbackText as w, shouldHandleSlackNativeApprovalRequest as wt, resolveSlackReplyDeliveryMessages as x, resolveSessionSlackOriginTarget as xt, resolveSlackReplyBlockResolution as y, normalizeSlackOriginTarget as yt, SLACK_MESSAGE_TEXT_RECOMMENDED_LIMIT as z, resolveSlackAutoThreadId as zt };
