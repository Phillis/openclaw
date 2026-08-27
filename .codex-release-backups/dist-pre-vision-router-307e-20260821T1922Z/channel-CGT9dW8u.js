import { i as createLazyRuntimeNamedExport } from "./lazy-runtime-CgCh8H_K.js";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { u as normalizeStringEntries } from "./string-normalization-e_fvmxMf.js";
import { t as DEFAULT_ACCOUNT_ID } from "./account-id-BRqK6RmF.js";
import { f as createChannelMessageAdapterFromOutbound } from "./channel-outbound-BzRLC3ih.js";
import { t as ToolAuthorizationError } from "./common-BGOZLJ2_.js";
import { n as isSingleUseReplyToMode } from "./reply-reference-cLEWJ7Kr.js";
import { f as normalizeMessagePresentation } from "./payload-ByplrRCQ.js";
import { n as describeAccountSnapshot } from "./account-helpers-CEliAVvN.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import { t as createAccountStatusSink } from "./channel-lifecycle.core-C98dobNq.js";
import { t as chunkTextForOutbound } from "./text-chunking-DrVvfnLf.js";
import { d as stripTargetKindPrefix, i as createChatChannelPlugin, t as buildChannelOutboundSessionRoute, u as stripChannelTargetPrefix } from "./core-MZAS1VOU.js";
import { n as isDangerousNameMatchingEnabled } from "./dangerous-name-matching-5xYA17l_.js";
import { t as createChannelApprovalAuth } from "./approval-auth-helpers-Bs9uwexj.js";
import { r as resolveDefaultGroupPolicy } from "./runtime-group-policy-6UJsFi-Z.js";
import "./reply-reference-cJj4KEHq.js";
import { n as createRuntimeOutboundDelegates, t as createRuntimeDirectoryLiveAdapter } from "./runtime-forwarders-HU3_RnJn.js";
import { t as PAIRING_APPROVED_MESSAGE } from "./pairing-message-DNhqI-OE.js";
import { d as createDefaultChannelRuntimeState, i as buildProbeChannelStatusSummary, u as createComputedAccountStatusAdapter } from "./status-helpers-C_Xyyv4E.js";
import "./channel-actions-CeWsyukw.js";
import "./channel-core-CZfVWRv7.js";
import { i as createPairingPrefixStripper } from "./channel-pairing-BBZdNgVG.js";
import { O as createAllowlistProviderGroupPolicyWarningCollector, i as createDangerousNameMatchingMutableAllowlistWarningCollector, r as collectStandardAllowlistLists, t as buildMutableAllowEntryDetector, z as projectConfigWarningCollector } from "./channel-policy-DlGVx39H.js";
import { a as listDirectoryEntriesFromSources } from "./directory-config-helpers-CWfb67CM.js";
import { n as createChannelDirectoryAdapter } from "./directory-runtime-DTJ8UiOr.js";
import "./runtime-api-BN82ZBoi.js";
import { at as normalizeMSTeamsConversationId, c as listChannelsForTeamWithPageInfo, g as resolveMSTeamsCredentials, p as resolveGraphToken, rt as extractMSTeamsConversationMessageId } from "./graph-users-B9CFzCiy.js";
import { i as resolveMSTeamsRouteConfig, n as resolveMSTeamsGroupToolPolicy, r as resolveMSTeamsReplyPolicy } from "./policy-D8377PSF.js";
import { a as parseMSTeamsConversationId, d as resolveMSTeamsChannelAllowlist, f as resolveMSTeamsTeamsConfig, i as normalizeMSTeamsUserInput, n as looksLikeMSTeamsTargetId, o as parseMSTeamsTeamChannelInput, p as resolveMSTeamsUserAllowlist, r as normalizeMSTeamsMessagingTarget, t as looksLikeMSTeamsConversationId } from "./resolve-allowlist-C9_Iety3.js";
import { a as msteamsSetupContract, o as msteamsConfigAdapter, s as msteamsMeta, t as msteamsSetupWizard } from "./setup-surface-BNiFWGFC.js";
import { t as MSTeamsChannelConfigSchema } from "./config-schema-BuDy_tSh.js";
import { n as buildMSTeamsPresentationCard, t as MSTEAMS_PRESENTATION_CAPABILITIES } from "./presentation-BmMsEhfq.js";
import { t as resolveMSTeamsRouteSessionKey } from "./thread-session-Bn-WS38F.js";
import { Type } from "typebox";
//#region extensions/msteams/src/action-threading.ts
function stripConversationPrefix(raw) {
	const trimmed = raw.trim();
	if (/^conversation:/i.test(trimmed)) return trimmed.slice(13).trim();
	return trimmed;
}
/** Normalize Teams conversation targets for equality (strips `conversation:` and `;messageid=`). */
function normalizeMSTeamsThreadingTarget(raw) {
	const value = normalizeOptionalString(raw);
	if (!value) return;
	return normalizeMSTeamsConversationId(stripConversationPrefix(value));
}
function extractMSTeamsResultConversationId(value) {
	if (!isRecord(value)) return;
	const direct = normalizeOptionalString(value.conversationId);
	if (direct) return direct;
	const receipt = isRecord(value.receipt) ? value.receipt : void 0;
	if (!receipt) return;
	const candidates = [...Array.isArray(receipt.raw) ? receipt.raw : [], ...Array.isArray(receipt.parts) ? receipt.parts.map((part) => isRecord(part) ? part.raw : void 0) : []];
	for (const candidate of candidates) {
		if (!isRecord(candidate)) continue;
		const conversationId = normalizeOptionalString(candidate.conversationId);
		if (conversationId) return conversationId;
	}
}
/** Recover the actual Teams conversation resolved by a successful tool send. */
function extractMSTeamsToolSendResult(result, _send) {
	const details = isRecord(result) && isRecord(result.details) ? result.details : void 0;
	const conversationId = extractMSTeamsResultConversationId(details && isRecord(details.result) ? details.result : void 0);
	if (!conversationId) return null;
	const normalizedConversationId = normalizeMSTeamsConversationId(stripConversationPrefix(conversationId));
	return normalizedConversationId ? { to: `conversation:${normalizedConversationId}` } : null;
}
function msteamsContextTargetsMatch(target, context) {
	const normalizedTarget = normalizeMSTeamsThreadingTarget(target);
	if (!normalizedTarget) return false;
	const currentChannel = normalizeMSTeamsThreadingTarget(context.currentChannelId);
	if (currentChannel && currentChannel === normalizedTarget) return true;
	const currentMessaging = normalizeMSTeamsThreadingTarget(context.currentMessagingTarget);
	return Boolean(currentMessaging && currentMessaging === normalizedTarget);
}
function resolveMSTeamsAutoThreadId(params) {
	const explicitThreadId = extractMSTeamsConversationMessageId(params.to);
	if (explicitThreadId) return explicitThreadId;
	const context = params.toolContext;
	if (!context?.currentChannelId && !context?.currentMessagingTarget) return;
	if (!msteamsContextTargetsMatch(params.to, context)) return;
	const graphTarget = context.currentGraphChannelId ?? context.currentMessagingTarget;
	const { team, channel } = graphTarget ? parseMSTeamsTeamChannelInput(graphTarget) : {
		team: void 0,
		channel: void 0
	};
	const routeConfig = resolveMSTeamsRouteConfig({
		cfg: params.cfg,
		teamId: team,
		conversationId: channel,
		allowNameMatching: false
	});
	const { replyStyle } = resolveMSTeamsReplyPolicy({
		isDirectMessage: false,
		globalConfig: params.cfg,
		teamConfig: routeConfig.teamConfig,
		channelConfig: routeConfig.channelConfig
	});
	if (replyStyle === "top-level") return;
	if (!context.currentThreadTs) return;
	if (context.replyToMode !== "all" && !isSingleUseReplyToMode(context.replyToMode ?? "off")) return;
	if (isSingleUseReplyToMode(context.replyToMode ?? "off") && context.hasRepliedRef?.value) return;
	return context.currentThreadTs;
}
//#endregion
//#region extensions/msteams/src/approval-auth.ts
const MSTEAMS_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function normalizeMSTeamsApproverId(value) {
	const normalized = normalizeMSTeamsMessagingTarget(String(value));
	const id = normalizeOptionalLowercaseString(normalized?.startsWith("user:") ? normalized.slice(5) : normalized);
	return id && MSTEAMS_ID_RE.test(id) ? id : void 0;
}
function resolveMSTeamsChannelConfig(cfg) {
	return cfg.channels?.msteams;
}
const msTeamsApprovalAuth = createChannelApprovalAuth({
	channelLabel: "Microsoft Teams",
	resolveInputs: ({ cfg }) => {
		const channel = resolveMSTeamsChannelConfig(cfg);
		return {
			allowFrom: channel?.allowFrom,
			defaultTo: channel?.defaultTo
		};
	},
	normalizeApprover: normalizeMSTeamsApproverId,
	normalizeSenderId: (value) => {
		const trimmed = normalizeOptionalLowercaseString(value);
		if (!trimmed) return;
		return MSTEAMS_ID_RE.test(trimmed) ? trimmed : void 0;
	}
}).approvalAuth;
const collectMSTeamsMutableAllowlistWarnings = createDangerousNameMatchingMutableAllowlistWarningCollector({
	channel: "msteams",
	detector: buildMutableAllowEntryDetector({
		prefixes: ["msteams:", "user:"],
		stableIdPattern: /^[^\s@]+$/
	}),
	collectLists: (scope) => collectStandardAllowlistLists(scope)
});
//#endregion
//#region extensions/msteams/src/read-policy.ts
function normalizeTarget(raw) {
	return raw ? normalizeMSTeamsMessagingTarget(raw) ?? "" : "";
}
function sameAccount(ctx) {
	const requested = normalizeOptionalString(ctx.accountId) ?? "default";
	const requester = normalizeOptionalString(ctx.requesterAccountId);
	return requester !== void 0 && requester === requested;
}
function isCurrentMSTeamsReadTarget(params) {
	if (normalizeOptionalString(params.ctx.toolContext?.currentChannelProvider)?.toLowerCase() !== "msteams" || !sameAccount(params.ctx)) return false;
	const candidates = [
		params.ctx.toolContext?.currentChannelId,
		params.ctx.toolContext?.currentMessagingTarget,
		params.ctx.toolContext?.currentGraphChannelId
	];
	const target = normalizeTarget(params.target);
	return candidates.some((candidate) => normalizeTarget(candidate) === target);
}
function normalizeUserTarget(target) {
	return target.replace(/^user:/i, "").trim().toLowerCase();
}
function isStableUserId(value) {
	return /^[0-9a-f-]{16,}$/i.test(value);
}
async function resolveAllowedDmTarget(cfg, target) {
	const teams = cfg.channels?.msteams;
	if (teams?.dmPolicy === "disabled") return;
	const userId = normalizeUserTarget(target);
	if (!userId) return;
	const normalizedEntries = (teams?.allowFrom ?? []).map((entry) => normalizeUserTarget(entry.replace(/^(msteams|teams):/i, "")));
	const allowAll = (teams?.dmPolicy ?? "pairing") === "open" || normalizedEntries.includes("*");
	if (isStableUserId(userId)) return allowAll || normalizedEntries.some((entry) => entry === userId) ? `user:${userId}` : void 0;
	if (!isDangerousNameMatchingEnabled(teams)) return;
	try {
		const [resolvedTarget, ...resolvedEntries] = await resolveMSTeamsUserAllowlist({
			cfg,
			entries: [userId, ...normalizedEntries.filter((entry) => entry !== "*")]
		});
		if (!resolvedTarget?.resolved || !resolvedTarget.id) return;
		return allowAll || resolvedEntries.some((entry) => entry.resolved && entry.id?.toLowerCase() === resolvedTarget.id?.toLowerCase()) ? `user:${resolvedTarget.id}` : void 0;
	} catch {
		return;
	}
}
async function resolveDirectDmTarget(cfg, target) {
	if (cfg.channels?.msteams?.dmPolicy === "disabled") return;
	const userId = normalizeUserTarget(target);
	if (!userId) return;
	if (isStableUserId(userId)) return `user:${userId}`;
	if (!isDangerousNameMatchingEnabled(cfg.channels?.msteams)) return;
	try {
		const [resolved] = await resolveMSTeamsUserAllowlist({
			cfg,
			entries: [userId]
		});
		return resolved?.resolved && resolved.id ? `user:${resolved.id}` : void 0;
	} catch {
		return;
	}
}
function resolveMSTeamsReadGroupPolicy(cfg) {
	const teams = cfg.channels?.msteams;
	return teams ? teams.groupPolicy ?? resolveDefaultGroupPolicy(cfg) ?? "allowlist" : "disabled";
}
function isStableChannelKey(value) {
	return /^[0-9a-f-]{16,}$/i.test(value) || /^19:.+@thread\./i.test(value);
}
function isStableGraphTeamId(value) {
	return /^[0-9a-f-]{16,}$/i.test(value);
}
function isStableGraphChannelTarget(target) {
	const [teamId, channelId] = target.split("/", 2);
	return Boolean(teamId && channelId && isStableGraphTeamId(teamId) && isStableChannelKey(channelId));
}
function hasMutableChannelConfig(cfg) {
	const teams = cfg.channels?.msteams?.teams ?? {};
	return Object.entries(teams).some(([teamKey, teamConfig]) => {
		if (teamKey !== "*" && !isStableChannelKey(teamKey)) return true;
		return Object.keys(teamConfig?.channels ?? {}).some((channelKey) => channelKey !== "*" && !isStableChannelKey(channelKey));
	});
}
async function resolveConfiguredBotFrameworkTeamKey(cfg, graphTeamId) {
	const configuredTeams = cfg.channels?.msteams?.teams;
	if (!configuredTeams) return;
	const stableConfiguredKeys = Object.keys(configuredTeams).filter((teamKey) => teamKey !== "*" && /^19:.+@thread\./i.test(teamKey));
	if (stableConfiguredKeys.length === 0) return;
	const channelResult = await listChannelsForTeamWithPageInfo(await resolveGraphToken(cfg), graphTeamId);
	if (channelResult.truncated) return;
	const channelIds = new Set(channelResult.items.map((channel) => channel.id?.trim()).filter((channelId) => Boolean(channelId)));
	const matches = stableConfiguredKeys.filter((teamKey) => channelIds.has(teamKey));
	return matches.length === 1 ? matches[0] : void 0;
}
async function resolveStableChannelTarget(cfg, target) {
	if (isStableGraphChannelTarget(target)) return target;
	if (!isDangerousNameMatchingEnabled(cfg.channels?.msteams)) return;
	try {
		const [resolved] = await resolveMSTeamsChannelAllowlist({
			cfg,
			entries: [target]
		});
		return resolved?.resolved && resolved.graphTeamId && resolved.channelId ? `${resolved.graphTeamId}/${resolved.channelId}` : void 0;
	} catch {
		return;
	}
}
async function resolveAllowedChannelTarget(cfg, target) {
	const teams = cfg.channels?.msteams;
	const groupPolicy = resolveMSTeamsReadGroupPolicy(cfg);
	if (groupPolicy === "disabled") return;
	const [teamId, channelId] = target.split("/", 2);
	if (!teamId || !channelId) return;
	const directRoute = resolveMSTeamsRouteConfig({
		cfg: teams,
		teamId,
		teamName: teamId,
		conversationId: channelId,
		channelName: channelId,
		allowNameMatching: isDangerousNameMatchingEnabled(teams)
	});
	const stableTarget = await resolveStableChannelTarget(cfg, target);
	if (!directRoute.allowlistConfigured && groupPolicy !== "open" && stableTarget) throw new ToolAuthorizationError("Microsoft Teams read target is not allowed. Configure channels.msteams.teams.<team>.channels for this channel, or deliberately set channels.msteams.groupPolicy to \"open\".");
	if (directRoute.allowed) return stableTarget;
	if (!stableTarget || !teams?.teams) return;
	const [stableTeamId, stableChannelId] = stableTarget.split("/", 2);
	if (!stableTeamId || !stableChannelId) return;
	try {
		const botFrameworkTeamKey = await resolveConfiguredBotFrameworkTeamKey(cfg, stableTeamId);
		if (botFrameworkTeamKey) {
			if (resolveMSTeamsRouteConfig({
				cfg: teams,
				teamId: botFrameworkTeamKey,
				conversationId: stableChannelId
			}).allowed) return stableTarget;
		}
		if (!hasMutableChannelConfig(cfg)) return;
		const resolved = await resolveMSTeamsTeamsConfig({
			cfg,
			teamIdMode: "graph",
			teams: teams.teams
		});
		return resolveMSTeamsRouteConfig({
			cfg: {
				...teams,
				teams: resolved.teams
			},
			teamId: stableTeamId,
			conversationId: stableChannelId
		}).allowed ? stableTarget : void 0;
	} catch {
		return;
	}
}
function bothUnknownScopesAllowed(cfg) {
	const teams = cfg.channels?.msteams;
	return resolveMSTeamsReadGroupPolicy(cfg) === "open" && (teams?.dmPolicy ?? "pairing") === "open";
}
async function assertMSTeamsReadTargetAllowed(params) {
	const target = normalizeTarget(params.target);
	const isChannel = target.includes("/");
	const isDm = /^user:/i.test(target);
	const isChat = looksLikeMSTeamsConversationId(target);
	const current = isCurrentMSTeamsReadTarget({
		ctx: params.ctx,
		target
	});
	const directOperator = params.ctx.conversationReadOrigin === "direct-operator";
	const currentChatType = params.ctx.toolContext?.currentChatType;
	const allowedTarget = directOperator ? isChannel ? resolveMSTeamsReadGroupPolicy(params.cfg) !== "disabled" ? await resolveStableChannelTarget(params.cfg, target) : void 0 : isDm ? await resolveDirectDmTarget(params.cfg, target) : isChat && resolveMSTeamsReadGroupPolicy(params.cfg) !== "disabled" && params.cfg.channels?.msteams?.dmPolicy !== "disabled" ? target : void 0 : current ? isChannel ? resolveMSTeamsReadGroupPolicy(params.cfg) !== "disabled" ? target : void 0 : isDm ? params.cfg.channels?.msteams?.dmPolicy !== "disabled" ? target : void 0 : currentChatType === "direct" ? params.cfg.channels?.msteams?.dmPolicy !== "disabled" ? target : void 0 : currentChatType === "group" || currentChatType === "channel" ? resolveMSTeamsReadGroupPolicy(params.cfg) !== "disabled" ? target : void 0 : resolveMSTeamsReadGroupPolicy(params.cfg) !== "disabled" && params.cfg.channels?.msteams?.dmPolicy !== "disabled" ? target : void 0 : isChannel ? await resolveAllowedChannelTarget(params.cfg, target) : isDm ? await resolveAllowedDmTarget(params.cfg, target) : isChat ? bothUnknownScopesAllowed(params.cfg) ? target : void 0 : false;
	if (!allowedTarget) throw new ToolAuthorizationError("Microsoft Teams read target is not allowed.");
	return allowedTarget;
}
async function assertMSTeamsTeamEnumerationAllowed(params) {
	const teams = params.cfg.channels?.msteams;
	const groupPolicy = resolveMSTeamsReadGroupPolicy(params.cfg);
	if (groupPolicy === "disabled") throw new ToolAuthorizationError("Microsoft Teams channel list is not allowed.");
	const directRoute = resolveMSTeamsRouteConfig({
		cfg: teams,
		teamId: params.teamId,
		teamName: params.teamId,
		conversationId: "__openclaw_all_channels__",
		allowNameMatching: isDangerousNameMatchingEnabled(teams)
	});
	const stableTeamId = isStableGraphTeamId(params.teamId) ? params.teamId : isDangerousNameMatchingEnabled(teams) ? (await resolveMSTeamsChannelAllowlist({
		cfg: params.cfg,
		entries: [params.teamId]
	}))[0]?.graphTeamId : void 0;
	if (!stableTeamId) throw new ToolAuthorizationError("Microsoft Teams channel list requires access to every channel in the team.");
	if (params.ctx?.conversationReadOrigin === "direct-operator") return stableTeamId;
	let allowed = directRoute.allowlistConfigured ? directRoute.allowed : groupPolicy === "open";
	if (!allowed && teams?.teams) try {
		const botFrameworkTeamKey = await resolveConfiguredBotFrameworkTeamKey(params.cfg, stableTeamId);
		if (botFrameworkTeamKey) allowed = resolveMSTeamsRouteConfig({
			cfg: teams,
			teamId: botFrameworkTeamKey,
			conversationId: "__openclaw_all_channels__"
		}).allowed;
		if (!allowed && hasMutableChannelConfig(params.cfg)) {
			const resolved = await resolveMSTeamsTeamsConfig({
				cfg: params.cfg,
				teamIdMode: "graph",
				teams: teams.teams
			});
			allowed = resolveMSTeamsRouteConfig({
				cfg: {
					...teams,
					teams: resolved.teams
				},
				teamId: stableTeamId,
				conversationId: "__openclaw_all_channels__"
			}).allowed;
		}
	} catch {
		allowed = false;
	}
	if (!allowed) throw new ToolAuthorizationError("Microsoft Teams channel list requires access to every channel in the team.");
	return stableTeamId;
}
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
//#region extensions/msteams/src/channel.ts
const TEAMS_GRAPH_PERMISSION_HINTS = {
	"ChannelMessage.Read.All": "channel history",
	"Chat.Read.All": "chat history",
	"Channel.ReadBasic.All": "channel list",
	"Team.ReadBasic.All": "team list",
	"TeamsActivity.Read.All": "teams activity",
	"Sites.Read.All": "files (SharePoint)",
	"Files.Read.All": "files (OneDrive)"
};
const MSTEAMS_GROUP_MANAGEMENT_ACTIONS = /* @__PURE__ */ new Set([
	"addParticipant",
	"removeParticipant",
	"renameGroup"
]);
const collectMSTeamsSecurityWarnings = createAllowlistProviderGroupPolicyWarningCollector({
	providerConfigPresent: (cfg) => cfg.channels?.msteams !== void 0,
	resolveGroupPolicy: ({ cfg }) => cfg.channels?.msteams?.groupPolicy,
	collect: ({ groupPolicy }) => groupPolicy === "open" ? ["- MS Teams groups: groupPolicy=\"open\" allows any member to trigger (mention-gated). Set channels.msteams.groupPolicy=\"allowlist\" + channels.msteams.groupAllowFrom to restrict senders."] : []
});
const loadMSTeamsChannelRuntime = createLazyRuntimeNamedExport(() => import("./channel.runtime-BWJWA0Yw.js"), "msTeamsChannelRuntime");
function jsonActionResult(data) {
	return {
		content: [{
			type: "text",
			text: JSON.stringify(data)
		}],
		details: data
	};
}
function jsonMSTeamsActionResult(action, data = {}) {
	return jsonActionResult({
		channel: "msteams",
		action,
		...data
	});
}
function jsonMSTeamsOkActionResult(action, data = {}) {
	return jsonActionResult({
		ok: true,
		channel: "msteams",
		action,
		...data
	});
}
function jsonMSTeamsConversationResult(conversationId) {
	return jsonActionResultWithDetails({
		ok: true,
		channel: "msteams",
		conversationId
	}, {
		ok: true,
		channel: "msteams"
	});
}
function jsonActionResultWithDetails(contentData, details) {
	return {
		content: [{
			type: "text",
			text: JSON.stringify(contentData)
		}],
		details
	};
}
const MSTEAMS_REACTION_TYPES = [
	"like",
	"heart",
	"laugh",
	"surprised",
	"sad",
	"angry"
];
function actionError(message) {
	return {
		isError: true,
		content: [{
			type: "text",
			text: message
		}],
		details: { error: message }
	};
}
function requireMSTeamsGroupManagementAuthorization(ctx) {
	if (ctx.senderIsOwner === true || ctx.gatewayClientScopes?.includes("operator.admin")) return null;
	return actionError("Microsoft Teams group management requires an owner or operator.admin requester.");
}
function resolveActionTarget(params, currentChannelId) {
	return typeof params.to === "string" ? params.to.trim() : typeof params.target === "string" ? params.target.trim() : currentChannelId?.trim() ?? "";
}
function resolveGraphActionTarget(params, currentChannelId, currentGraphChannelId, currentChatType) {
	const explicitTarget = resolveActionTarget(params);
	const currentChannelTarget = currentChannelId?.trim();
	const currentGraphTarget = currentGraphChannelId?.trim();
	if (explicitTarget) {
		if (currentChatType === "channel" && currentGraphTarget && currentChannelTarget && explicitTarget === currentChannelTarget) return currentGraphTarget;
		return explicitTarget;
	}
	if (currentGraphTarget) return currentGraphTarget;
	return currentChatType === "channel" ? "" : currentChannelTarget ?? "";
}
function resolveCurrentGraphActionTarget(toolContext) {
	return normalizeOptionalString(toolContext?.currentGraphChannelId) ?? normalizeOptionalString(toolContext?.currentMessagingTarget);
}
function resolveActionMessageId(params) {
	return normalizeOptionalString(params.messageId) ?? "";
}
function resolveActionPinnedMessageId(params) {
	return typeof params.pinnedMessageId === "string" ? params.pinnedMessageId.trim() : typeof params.messageId === "string" ? params.messageId.trim() : "";
}
function resolveActionQuery(params) {
	return normalizeOptionalString(params.query) ?? "";
}
function resolveActionContent(params) {
	return typeof params.text === "string" ? params.text : typeof params.content === "string" ? params.content : typeof params.message === "string" ? params.message : "";
}
function readOptionalTrimmedString(params, key) {
	return normalizeOptionalString(params[key]);
}
function resolveActionUploadFilePath(params) {
	for (const key of [
		"filePath",
		"path",
		"media"
	]) if (typeof params[key] === "string") {
		const value = params[key];
		if (value.trim()) return value;
	}
}
function resolveMSTeamsActionTarget(params) {
	return params.graphOnly ? resolveGraphActionTarget(params.toolParams, params.currentChannelId, params.currentGraphChannelId, params.currentChatType) : resolveActionTarget(params.toolParams, params.currentChannelId);
}
async function runWithRequiredActionTarget(params) {
	const to = resolveMSTeamsActionTarget(params);
	if (!to) return actionError(`${params.actionLabel} requires a target (to).`);
	return await params.run(to);
}
async function runWithRequiredActionMessageTarget(params) {
	const to = resolveMSTeamsActionTarget(params);
	const messageId = resolveActionMessageId(params.toolParams);
	if (!to || !messageId) return actionError(`${params.actionLabel} requires a target (to) and messageId.`);
	return await params.run({
		to,
		messageId
	});
}
async function runWithRequiredActionPinnedMessageTarget(params) {
	const to = resolveMSTeamsActionTarget(params);
	const pinnedMessageId = resolveActionPinnedMessageId(params.toolParams);
	if (!to || !pinnedMessageId) return actionError(`${params.actionLabel} requires a target (to) and pinnedMessageId.`);
	return await params.run({
		to,
		pinnedMessageId
	});
}
function describeMSTeamsMessageTool({ cfg }) {
	const enabled = cfg.channels?.msteams?.enabled !== false && Boolean(resolveMSTeamsCredentials(cfg.channels?.msteams));
	return {
		actions: enabled ? [
			"upload-file",
			"poll",
			"edit",
			"delete",
			"pin",
			"unpin",
			"list-pins",
			"read",
			"react",
			"reactions",
			"search",
			"member-info",
			"channel-list",
			"channel-info",
			"addParticipant",
			"removeParticipant",
			"renameGroup"
		] : [],
		capabilities: enabled ? ["presentation"] : [],
		schema: enabled ? {
			actions: ["unpin"],
			properties: { pinnedMessageId: Type.Optional(Type.String({ description: "Pinned message resource ID for unpin (from pin or list-pins, not the chat message ID)." })) }
		} : null
	};
}
const msteamsChannelOutbound = {
	deliveryMode: "direct",
	chunker: chunkTextForOutbound,
	chunkerMode: "markdown",
	textChunkLimit: 4e3,
	resolveEffectiveTextChunkLimit: ({ fallbackLimit }) => typeof fallbackLimit === "number" && fallbackLimit > 0 ? Math.min(fallbackLimit, 4e3) : 4e3,
	pollMaxOptions: 12,
	deliveryCapabilities: { durableFinal: {
		text: true,
		media: true,
		payload: true,
		messageSendingHooks: true
	} },
	presentationCapabilities: MSTEAMS_PRESENTATION_CAPABILITIES,
	...createRuntimeOutboundDelegates({
		getRuntime: loadMSTeamsChannelRuntime,
		renderPresentation: { resolve: (runtime) => runtime.msteamsOutbound.renderPresentation },
		sendPayload: { resolve: (runtime) => runtime.msteamsOutbound.sendPayload },
		sendText: { resolve: (runtime) => runtime.msteamsOutbound.sendText },
		sendMedia: { resolve: (runtime) => runtime.msteamsOutbound.sendMedia },
		sendPoll: { resolve: (runtime) => runtime.msteamsOutbound.sendPoll }
	})
};
const msteamsMessageAdapter = createChannelMessageAdapterFromOutbound({
	id: "msteams",
	outbound: msteamsChannelOutbound,
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
			previewReceipt: true
		} }
	}
});
const msteamsPlugin = createChatChannelPlugin({
	base: {
		id: "msteams",
		meta: {
			...msteamsMeta,
			aliases: [...msteamsMeta.aliases]
		},
		setupWizard: msteamsSetupWizard,
		capabilities: {
			chatTypes: [
				"direct",
				"channel",
				"thread"
			],
			polls: true,
			threads: true,
			media: true
		},
		streaming: { blockStreamingCoalesceDefaults: {
			minChars: 1500,
			idleMs: 1e3
		} },
		agentPrompt: { messageToolHints: () => ["- Adaptive Cards supported. Use `action=send` with `card={type,version,body}` to send rich cards.", "- MSTeams targeting: omit `target` to reply to the current conversation (auto-inferred). Explicit targets: `user:ID` or `user:Display Name` (requires Graph API) for DMs, `conversation:19:...@thread.tacv2` for groups/channels. Prefer IDs over display names for speed."] },
		groups: { resolveToolPolicy: resolveMSTeamsGroupToolPolicy },
		reload: { configPrefixes: ["channels.msteams"] },
		configSchema: MSTeamsChannelConfigSchema,
		config: {
			...msteamsConfigAdapter,
			isConfigured: (_account, cfg) => Boolean(resolveMSTeamsCredentials(cfg.channels?.msteams)),
			describeAccount: (account) => describeAccountSnapshot({
				account,
				configured: account.configured
			})
		},
		approvalCapability: msTeamsApprovalAuth,
		doctor: {
			dmAllowFromMode: "topOnly",
			groupModel: "hybrid",
			groupAllowFromFallbackToAllowFrom: true,
			warnOnEmptyGroupSenderAllowlist: true,
			collectMutableAllowlistWarnings: collectMSTeamsMutableAllowlistWarnings
		},
		setupContract: msteamsSetupContract,
		messaging: {
			targetPrefixes: ["msteams", "teams"],
			directTargetStyle: "user-prefixed",
			normalizeTarget: normalizeMSTeamsMessagingTarget,
			inferTargetChatType: ({ to }) => inferMSTeamsTargetChatType(to),
			resolveOutboundSessionRoute: (params) => resolveMSTeamsOutboundSessionRoute(params),
			targetResolver: {
				looksLikeId: (raw) => looksLikeMSTeamsTargetId(raw),
				hint: "<conversationId|user:ID|conversation:ID>"
			}
		},
		message: msteamsMessageAdapter,
		directory: createChannelDirectoryAdapter({
			self: async ({ cfg }) => {
				const creds = resolveMSTeamsCredentials(cfg.channels?.msteams);
				if (!creds) return null;
				return {
					kind: "user",
					id: creds.appId,
					name: creds.appId
				};
			},
			listPeers: async ({ cfg, query, limit }) => listDirectoryEntriesFromSources({
				kind: "user",
				sources: [cfg.channels?.msteams?.allowFrom ?? [], Object.keys(cfg.channels?.msteams?.dms ?? {})],
				query,
				limit,
				normalizeId: (raw) => {
					const normalized = normalizeMSTeamsMessagingTarget(raw) ?? raw;
					const lowered = normalized.toLowerCase();
					if (lowered.startsWith("user:") || lowered.startsWith("conversation:")) return normalized;
					return `user:${normalized}`;
				}
			}),
			listGroups: async ({ cfg, query, limit }) => listDirectoryEntriesFromSources({
				kind: "group",
				sources: [Object.values(cfg.channels?.msteams?.teams ?? {}).flatMap((team) => Object.keys(team.channels ?? {}))],
				query,
				limit,
				normalizeId: (raw) => `conversation:${raw.replace(/^conversation:/i, "").trim()}`
			}),
			...createRuntimeDirectoryLiveAdapter({
				getRuntime: loadMSTeamsChannelRuntime,
				listPeersLive: (runtime) => runtime.listMSTeamsDirectoryPeersLive,
				listGroupsLive: (runtime) => runtime.listMSTeamsDirectoryGroupsLive
			})
		}),
		resolver: { resolveTargets: async ({ cfg, inputs, kind, runtime }) => {
			const results = inputs.map((input) => ({
				input,
				resolved: false,
				id: void 0,
				name: void 0,
				note: void 0
			}));
			const stripPrefix = (value) => normalizeMSTeamsUserInput(value);
			const markPendingLookupFailed = (pending) => {
				pending.forEach(({ index }) => {
					const entry = results[index];
					if (entry) entry.note = "lookup failed";
				});
			};
			const resolvePending = async (pending, resolveEntries, applyResolvedEntry) => {
				if (pending.length === 0) return;
				try {
					(await resolveEntries(pending.map((entry) => entry.query))).forEach((entry, idx) => {
						const target = results[pending[idx]?.index ?? -1];
						if (!target) return;
						applyResolvedEntry(target, entry);
					});
				} catch (err) {
					runtime.error?.(`msteams resolve failed: ${String(err)}`);
					markPendingLookupFailed(pending);
				}
			};
			if (kind === "user") {
				const pending = [];
				results.forEach((entry, index) => {
					const trimmed = entry.input.trim();
					if (!trimmed) {
						entry.note = "empty input";
						return;
					}
					const cleaned = stripPrefix(trimmed);
					if (/^[0-9a-fA-F-]{16,}$/.test(cleaned) || cleaned.includes("@")) {
						entry.resolved = true;
						entry.id = cleaned;
						return;
					}
					pending.push({
						input: entry.input,
						query: cleaned,
						index
					});
				});
				await resolvePending(pending, (entries) => resolveMSTeamsUserAllowlist({
					cfg,
					entries
				}), (target, entry) => {
					target.resolved = entry.resolved;
					target.id = entry.id;
					target.name = entry.name;
					target.note = entry.note;
				});
				return results;
			}
			const pending = [];
			results.forEach((entry, index) => {
				const trimmed = entry.input.trim();
				if (!trimmed) {
					entry.note = "empty input";
					return;
				}
				const conversationId = parseMSTeamsConversationId(trimmed);
				if (conversationId !== null) {
					entry.resolved = Boolean(conversationId);
					entry.id = conversationId || void 0;
					entry.note = conversationId ? "conversation id" : "empty conversation id";
					return;
				}
				const parsed = parseMSTeamsTeamChannelInput(trimmed);
				if (!parsed.team) {
					entry.note = "missing team";
					return;
				}
				const query = parsed.channel ? `${parsed.team}/${parsed.channel}` : parsed.team;
				pending.push({
					input: entry.input,
					query,
					index
				});
			});
			await resolvePending(pending, (entries) => resolveMSTeamsChannelAllowlist({
				cfg,
				entries
			}), (target, entry) => {
				if (!entry.resolved || !entry.teamId) {
					target.resolved = false;
					target.note = entry.note;
					return;
				}
				target.resolved = true;
				if (entry.channelId) {
					target.id = `${entry.teamId}/${entry.channelId}`;
					target.name = entry.channelName && entry.teamName ? `${entry.teamName}/${entry.channelName}` : entry.channelName ?? entry.teamName;
				} else {
					target.id = entry.teamId;
					target.name = entry.teamName;
					target.note = "team id";
				}
				if (entry.note) target.note = entry.note;
			});
			return results;
		} },
		actions: {
			describeMessageTool: describeMSTeamsMessageTool,
			extractToolSendResult: ({ result, send }) => extractMSTeamsToolSendResult(result, send),
			requiresTrustedRequesterSender: ({ action, toolContext }) => normalizeOptionalString(toolContext?.currentChannelProvider)?.toLowerCase() === "msteams" && MSTEAMS_GROUP_MANAGEMENT_ACTIONS.has(action),
			handleAction: async (ctx) => {
				if (MSTEAMS_GROUP_MANAGEMENT_ACTIONS.has(ctx.action)) {
					const authError = requireMSTeamsGroupManagementAuthorization(ctx);
					if (authError) return authError;
				}
				const authorizeActionTarget = (target) => assertMSTeamsReadTargetAllowed({
					cfg: ctx.cfg,
					ctx,
					target
				});
				const presentation = ctx.action === "send" ? normalizeMessagePresentation(ctx.params.presentation) : void 0;
				if (ctx.action === "send" && presentation) {
					const card = buildMSTeamsPresentationCard({
						presentation,
						text: resolveActionContent(ctx.params)
					});
					return await runWithRequiredActionTarget({
						actionLabel: "Card send",
						toolParams: ctx.params,
						run: async (to) => {
							const { sendAdaptiveCardMSTeams } = await loadMSTeamsChannelRuntime();
							const result = await sendAdaptiveCardMSTeams({
								cfg: ctx.cfg,
								to,
								card
							});
							return jsonActionResultWithDetails({
								ok: true,
								channel: "msteams",
								messageId: result.messageId,
								conversationId: result.conversationId
							}, {
								ok: true,
								channel: "msteams",
								messageId: result.messageId
							});
						}
					});
				}
				if (ctx.action === "upload-file") {
					const mediaUrl = resolveActionUploadFilePath(ctx.params);
					if (!mediaUrl) return actionError("Upload-file requires media, filePath, or path.");
					return await runWithRequiredActionTarget({
						actionLabel: "Upload-file",
						toolParams: ctx.params,
						currentChannelId: ctx.toolContext?.currentChannelId,
						run: async (to) => {
							const { sendMessageMSTeams } = await loadMSTeamsChannelRuntime();
							const result = await sendMessageMSTeams({
								cfg: ctx.cfg,
								to,
								text: resolveActionContent(ctx.params),
								mediaUrl,
								filename: readOptionalTrimmedString(ctx.params, "filename") ?? readOptionalTrimmedString(ctx.params, "title"),
								mediaAccess: ctx.mediaAccess,
								mediaLocalRoots: ctx.mediaLocalRoots,
								mediaReadFile: ctx.mediaReadFile
							});
							return jsonActionResultWithDetails({
								ok: true,
								channel: "msteams",
								action: "upload-file",
								messageId: result.messageId,
								conversationId: result.conversationId,
								...result.pendingUploadId ? { pendingUploadId: result.pendingUploadId } : {}
							}, {
								ok: true,
								channel: "msteams",
								messageId: result.messageId,
								...result.pendingUploadId ? { pendingUploadId: result.pendingUploadId } : {}
							});
						}
					});
				}
				if (ctx.action === "edit") {
					const content = resolveActionContent(ctx.params);
					if (!content) return actionError("Edit requires content.");
					return await runWithRequiredActionMessageTarget({
						actionLabel: "Edit",
						toolParams: ctx.params,
						currentChannelId: ctx.toolContext?.currentChannelId,
						run: async (target) => {
							const to = await authorizeActionTarget(target.to);
							const { editMessageMSTeams } = await loadMSTeamsChannelRuntime();
							return jsonMSTeamsConversationResult((await editMessageMSTeams({
								cfg: ctx.cfg,
								to,
								activityId: target.messageId,
								text: content
							})).conversationId);
						}
					});
				}
				if (ctx.action === "delete") return await runWithRequiredActionMessageTarget({
					actionLabel: "Delete",
					toolParams: ctx.params,
					currentChannelId: ctx.toolContext?.currentChannelId,
					run: async (target) => {
						const to = await authorizeActionTarget(target.to);
						const { deleteMessageMSTeams } = await loadMSTeamsChannelRuntime();
						return jsonMSTeamsConversationResult((await deleteMessageMSTeams({
							cfg: ctx.cfg,
							to,
							activityId: target.messageId
						})).conversationId);
					}
				});
				const graphActionTarget = {
					toolParams: ctx.params,
					currentChannelId: ctx.toolContext?.currentChannelId,
					currentGraphChannelId: resolveCurrentGraphActionTarget(ctx.toolContext),
					currentChatType: ctx.toolContext?.currentChatType,
					graphOnly: true
				};
				if (ctx.action === "read") return await runWithRequiredActionMessageTarget({
					actionLabel: "Read",
					...graphActionTarget,
					run: async (target) => {
						const to = await authorizeActionTarget(target.to);
						const { getMessageMSTeams } = await loadMSTeamsChannelRuntime();
						return jsonMSTeamsOkActionResult("read", { message: await getMessageMSTeams({
							cfg: ctx.cfg,
							to,
							messageId: target.messageId
						}) });
					}
				});
				if (ctx.action === "pin") return await runWithRequiredActionMessageTarget({
					actionLabel: "Pin",
					...graphActionTarget,
					run: async (target) => {
						const to = await authorizeActionTarget(target.to);
						const { pinMessageMSTeams } = await loadMSTeamsChannelRuntime();
						return jsonMSTeamsActionResult("pin", await pinMessageMSTeams({
							cfg: ctx.cfg,
							to,
							messageId: target.messageId
						}));
					}
				});
				if (ctx.action === "unpin") return await runWithRequiredActionPinnedMessageTarget({
					actionLabel: "Unpin",
					...graphActionTarget,
					run: async (target) => {
						const to = await authorizeActionTarget(target.to);
						const { unpinMessageMSTeams } = await loadMSTeamsChannelRuntime();
						return jsonMSTeamsActionResult("unpin", await unpinMessageMSTeams({
							cfg: ctx.cfg,
							to,
							pinnedMessageId: target.pinnedMessageId
						}));
					}
				});
				if (ctx.action === "list-pins") return await runWithRequiredActionTarget({
					actionLabel: "List-pins",
					...graphActionTarget,
					run: async (to) => {
						const allowedTarget = await authorizeActionTarget(to);
						const { listPinsMSTeams } = await loadMSTeamsChannelRuntime();
						return jsonMSTeamsOkActionResult("list-pins", await listPinsMSTeams({
							cfg: ctx.cfg,
							to: allowedTarget
						}));
					}
				});
				if (ctx.action === "react") return await runWithRequiredActionMessageTarget({
					actionLabel: "React",
					...graphActionTarget,
					run: async (target) => {
						const emoji = typeof ctx.params.emoji === "string" ? ctx.params.emoji.trim() : "";
						const remove = typeof ctx.params.remove === "boolean" ? ctx.params.remove : false;
						if (!emoji) return {
							isError: true,
							content: [{
								type: "text",
								text: `React requires an emoji (reaction type). Valid types: ${MSTEAMS_REACTION_TYPES.join(", ")}.`
							}],
							details: {
								error: "React requires an emoji (reaction type).",
								validTypes: [...MSTEAMS_REACTION_TYPES]
							}
						};
						const to = await authorizeActionTarget(target.to);
						if (remove) {
							const { unreactMessageMSTeams } = await loadMSTeamsChannelRuntime();
							return jsonMSTeamsActionResult("react", {
								removed: true,
								reactionType: emoji,
								...await unreactMessageMSTeams({
									cfg: ctx.cfg,
									to,
									messageId: target.messageId,
									reactionType: emoji
								})
							});
						}
						const { reactMessageMSTeams } = await loadMSTeamsChannelRuntime();
						return jsonMSTeamsActionResult("react", {
							reactionType: emoji,
							...await reactMessageMSTeams({
								cfg: ctx.cfg,
								to,
								messageId: target.messageId,
								reactionType: emoji
							})
						});
					}
				});
				if (ctx.action === "reactions") return await runWithRequiredActionMessageTarget({
					actionLabel: "Reactions",
					...graphActionTarget,
					run: async (target) => {
						const to = await authorizeActionTarget(target.to);
						const { listReactionsMSTeams } = await loadMSTeamsChannelRuntime();
						return jsonMSTeamsOkActionResult("reactions", await listReactionsMSTeams({
							cfg: ctx.cfg,
							to,
							messageId: target.messageId
						}));
					}
				});
				if (ctx.action === "search") return await runWithRequiredActionTarget({
					actionLabel: "Search",
					...graphActionTarget,
					run: async (to) => {
						const allowedTarget = await authorizeActionTarget(to);
						const query = resolveActionQuery(ctx.params);
						if (!query) return actionError("Search requires a target (to) and query.");
						const limit = typeof ctx.params.limit === "number" ? ctx.params.limit : void 0;
						const from = typeof ctx.params.from === "string" ? ctx.params.from.trim() : void 0;
						const { searchMessagesMSTeams } = await loadMSTeamsChannelRuntime();
						return jsonMSTeamsOkActionResult("search", await searchMessagesMSTeams({
							cfg: ctx.cfg,
							to: allowedTarget,
							query,
							from: from || void 0,
							limit
						}));
					}
				});
				if (ctx.action === "member-info") {
					const userId = normalizeOptionalString(ctx.params.userId) ?? "";
					if (!userId) return actionError("member-info requires a userId.");
					return await runWithRequiredActionTarget({
						actionLabel: "member-info",
						...graphActionTarget,
						run: async (target) => {
							const to = await authorizeActionTarget(target);
							const currentRequesterId = isCurrentMSTeamsReadTarget({
								ctx,
								target: to
							}) ? ctx.requesterSenderId : void 0;
							const { getMemberInfoMSTeams } = await loadMSTeamsChannelRuntime();
							return jsonMSTeamsOkActionResult("member-info", await getMemberInfoMSTeams({
								cfg: ctx.cfg,
								to,
								userId,
								currentRequesterId
							}));
						}
					});
				}
				if (ctx.action === "channel-list") {
					const teamId = normalizeOptionalString(ctx.params.teamId) ?? "";
					if (!teamId) return actionError("channel-list requires a teamId.");
					const graphTeamId = await assertMSTeamsTeamEnumerationAllowed({
						cfg: ctx.cfg,
						ctx,
						teamId
					});
					const { listChannelsMSTeams } = await loadMSTeamsChannelRuntime();
					return jsonMSTeamsOkActionResult("channel-list", await listChannelsMSTeams({
						cfg: ctx.cfg,
						teamId: graphTeamId
					}));
				}
				if (ctx.action === "channel-info") {
					const teamId = normalizeOptionalString(ctx.params.teamId) ?? "";
					const channelId = normalizeOptionalString(ctx.params.channelId) ?? "";
					if (!teamId || !channelId) return actionError("channel-info requires teamId and channelId.");
					const [graphTeamId, graphChannelId] = (await authorizeActionTarget(`${teamId}/${channelId}`)).split("/", 2);
					if (!graphTeamId || !graphChannelId) throw new Error("Authorized Microsoft Teams channel target is invalid.");
					const { getChannelInfoMSTeams } = await loadMSTeamsChannelRuntime();
					return jsonMSTeamsOkActionResult("channel-info", { channelInfo: (await getChannelInfoMSTeams({
						cfg: ctx.cfg,
						teamId: graphTeamId,
						channelId: graphChannelId
					})).channel });
				}
				if (ctx.action === "addParticipant") {
					const userId = typeof ctx.params.userId === "string" ? ctx.params.userId.trim() : "";
					if (!userId) return actionError("addParticipant requires a userId.");
					return await runWithRequiredActionTarget({
						actionLabel: "addParticipant",
						toolParams: ctx.params,
						currentChannelId: ctx.toolContext?.currentChannelId,
						run: async (to) => {
							const role = readOptionalTrimmedString(ctx.params, "role");
							const { addParticipantMSTeams } = await loadMSTeamsChannelRuntime();
							return jsonMSTeamsOkActionResult("addParticipant", await addParticipantMSTeams({
								cfg: ctx.cfg,
								to,
								userId,
								role
							}));
						}
					});
				}
				if (ctx.action === "removeParticipant") {
					const userId = typeof ctx.params.userId === "string" ? ctx.params.userId.trim() : "";
					if (!userId) return actionError("removeParticipant requires a userId.");
					return await runWithRequiredActionTarget({
						actionLabel: "removeParticipant",
						toolParams: ctx.params,
						currentChannelId: ctx.toolContext?.currentChannelId,
						run: async (to) => {
							const { removeParticipantMSTeams } = await loadMSTeamsChannelRuntime();
							return jsonMSTeamsOkActionResult("removeParticipant", await removeParticipantMSTeams({
								cfg: ctx.cfg,
								to,
								userId
							}));
						}
					});
				}
				if (ctx.action === "renameGroup") {
					const name = typeof ctx.params.name === "string" ? ctx.params.name.trim() : "";
					if (!name) return actionError("renameGroup requires a name.");
					return await runWithRequiredActionTarget({
						actionLabel: "renameGroup",
						toolParams: ctx.params,
						currentChannelId: ctx.toolContext?.currentChannelId,
						run: async (to) => {
							const { renameGroupMSTeams } = await loadMSTeamsChannelRuntime();
							return jsonMSTeamsOkActionResult("renameGroup", await renameGroupMSTeams({
								cfg: ctx.cfg,
								to,
								name
							}));
						}
					});
				}
				return null;
			}
		},
		status: createComputedAccountStatusAdapter({
			defaultRuntime: createDefaultChannelRuntimeState(DEFAULT_ACCOUNT_ID, { port: null }),
			buildChannelSummary: ({ snapshot }) => buildProbeChannelStatusSummary(snapshot, { port: snapshot.port ?? null }),
			probeAccount: async ({ cfg }) => await (await loadMSTeamsChannelRuntime()).probeMSTeams(cfg.channels?.msteams),
			formatCapabilitiesProbe: ({ probe }) => {
				const teamsProbe = probe;
				const lines = [];
				const appId = typeof teamsProbe?.appId === "string" ? teamsProbe.appId.trim() : "";
				if (appId) lines.push({ text: `App: ${appId}` });
				const graph = teamsProbe?.graph;
				if (graph) {
					const roles = Array.isArray(graph.roles) ? normalizeStringEntries(graph.roles) : [];
					const scopes = Array.isArray(graph.scopes) ? normalizeStringEntries(graph.scopes) : [];
					const formatPermission = (permission) => {
						const hint = TEAMS_GRAPH_PERMISSION_HINTS[permission];
						return hint ? `${permission} (${hint})` : permission;
					};
					if (!graph.ok) lines.push({
						text: `Graph: ${graph.error ?? "failed"}`,
						tone: "error"
					});
					else if (roles.length > 0 || scopes.length > 0) {
						if (roles.length > 0) lines.push({ text: `Graph roles: ${roles.map(formatPermission).join(", ")}` });
						if (scopes.length > 0) lines.push({ text: `Graph scopes: ${scopes.map(formatPermission).join(", ")}` });
					} else if (graph.ok) lines.push({ text: "Graph: ok" });
				}
				return lines;
			},
			resolveAccountSnapshot: ({ account, runtime }) => ({
				accountId: account.accountId,
				enabled: account.enabled,
				configured: account.configured,
				extra: { port: runtime?.port ?? null }
			})
		}),
		gateway: { startAccount: async (ctx) => {
			const { monitorMSTeamsProvider } = await import("./src-M43_AoG9.js");
			const port = ctx.cfg.channels?.msteams?.webhook?.port ?? 3978;
			const statusSink = createAccountStatusSink({
				accountId: ctx.accountId,
				setStatus: ctx.setStatus
			});
			statusSink({ port });
			ctx.log?.info(`starting provider (port ${port})`);
			return monitorMSTeamsProvider({
				cfg: ctx.cfg,
				runtime: ctx.runtime,
				abortSignal: ctx.abortSignal,
				statusSink
			});
		} }
	},
	security: { collectWarnings: projectConfigWarningCollector(collectMSTeamsSecurityWarnings) },
	pairing: { text: {
		idLabel: "msteamsUserId",
		message: PAIRING_APPROVED_MESSAGE,
		normalizeAllowEntry: createPairingPrefixStripper(/^(msteams|user):/i),
		notify: async ({ cfg, id, message }) => {
			const { sendMessageMSTeams } = await loadMSTeamsChannelRuntime();
			await sendMessageMSTeams({
				cfg,
				to: id,
				text: message
			});
		}
	} },
	threading: {
		matchesToolContextTarget: ({ target, toolContext }) => msteamsContextTargetsMatch(target, toolContext),
		buildToolContext: ({ context, hasRepliedRef }) => {
			const nativeChannelId = context.NativeChannelId?.trim();
			const hasChannelRoute = Boolean(nativeChannelId && nativeChannelId.includes("/"));
			const isChannel = context.ChatType === "channel";
			const currentThreadTs = (context.MessageThreadId != null ? normalizeOptionalString(String(context.MessageThreadId)) : void 0) ?? (isChannel ? normalizeOptionalString(context.ReplyToId) : void 0);
			return {
				currentChannelId: normalizeOptionalString(context.To),
				currentChatType: context.ChatType === "direct" || context.ChatType === "group" || context.ChatType === "channel" ? context.ChatType : void 0,
				currentMessagingTarget: hasChannelRoute ? nativeChannelId : void 0,
				currentGraphChannelId: hasChannelRoute ? nativeChannelId : void 0,
				currentThreadTs,
				...currentThreadTs ? { replyToMode: "all" } : {},
				hasRepliedRef
			};
		},
		resolveAutoThreadId: ({ cfg, to, toolContext }) => resolveMSTeamsAutoThreadId({
			cfg: cfg.channels?.msteams,
			to,
			toolContext
		})
	},
	outbound: msteamsChannelOutbound
});
//#endregion
export { msteamsPlugin as t };
