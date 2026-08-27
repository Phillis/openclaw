import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import "./src-BntaCZM-.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { r as logVerbose } from "./globals-GZNLg1ns.js";
import { t as getChannelPlugin } from "./registry-CL5HFEAI.js";
import { n as resolveChannelApprovalCapability } from "./plugins-CmLI4MOi.js";
import { n as normalizeMessageChannel } from "./message-channel-core-D5yZGaHY.js";
import "./message-channel-BZwx7FCw.js";
import { t as isApprovalNotFoundError } from "./approval-errors-Bzw_-cAg.js";
import { c as requireGatewayClientScope } from "./command-gates-BN6pp6B0.js";
import { r as isImplicitSameChatApprovalAuthorization } from "./approval-auth-helpers-Bs9uwexj.js";
import { t as resolveApprovalOverGateway } from "./approval-gateway-resolver-DZwKp22W.js";
import { t as resolveChannelAccountId } from "./channel-context-C0RSvo_2.js";
//#region src/infra/channel-approval-auth.ts
/** Resolves whether a chat `/approve` command is authorized by channel-specific approval policy. */
function resolveApprovalCommandAuthorization(params) {
	const channel = normalizeMessageChannel(params.channel);
	if (!channel) return {
		authorized: true,
		explicit: false
	};
	const approvalCapability = resolveChannelApprovalCapability(getChannelPlugin(channel));
	const resolved = approvalCapability?.authorizeActorAction?.({
		cfg: params.cfg,
		accountId: params.accountId,
		senderId: params.senderId,
		action: "approve",
		approvalKind: params.kind
	});
	if (!resolved) return {
		authorized: true,
		explicit: false
	};
	const implicitSameChatAuthorization = isImplicitSameChatApprovalAuthorization(resolved);
	const availability = approvalCapability?.getActionAvailabilityState?.({
		cfg: params.cfg,
		accountId: params.accountId,
		action: "approve",
		approvalKind: params.kind
	});
	return {
		authorized: resolved.authorized,
		reason: resolved.reason,
		explicit: resolved.authorized ? !implicitSameChatAuthorization && availability?.kind !== "disabled" : true
	};
}
//#endregion
//#region src/auto-reply/reply/commands-approve.ts
const COMMAND_REGEX = /^\/?approve(?:\s|$)/i;
const FOREIGN_COMMAND_MENTION_REGEX = /^\/approve@([^\s]+)(?:\s|$)/i;
const DECISION_ALIASES = {
	allow: "allow-once",
	once: "allow-once",
	"allow-once": "allow-once",
	allowonce: "allow-once",
	always: "allow-always",
	"allow-always": "allow-always",
	allowalways: "allow-always",
	deny: "deny",
	reject: "deny",
	block: "deny"
};
const APPROVE_USAGE_TEXT = "Usage: /approve <id> <decision> (see the pending approval message for available decisions)";
function parseApproveCommand(raw) {
	const trimmed = raw.trim();
	if (FOREIGN_COMMAND_MENTION_REGEX.test(trimmed)) return {
		ok: false,
		error: "❌ This /approve command targets a different Telegram bot."
	};
	const commandMatch = trimmed.match(COMMAND_REGEX);
	if (!commandMatch) return null;
	const rest = trimmed.slice(commandMatch[0].length).trim();
	if (!rest) return {
		ok: false,
		error: APPROVE_USAGE_TEXT
	};
	const tokens = rest.split(/\s+/).filter(Boolean);
	if (tokens.length < 2) return {
		ok: false,
		error: APPROVE_USAGE_TEXT
	};
	const first = normalizeLowercaseStringOrEmpty(tokens[0]);
	const second = normalizeLowercaseStringOrEmpty(tokens[1]);
	if (DECISION_ALIASES[first]) return {
		ok: true,
		decision: DECISION_ALIASES[first],
		id: tokens.slice(1).join(" ").trim()
	};
	if (DECISION_ALIASES[second]) return {
		ok: true,
		decision: DECISION_ALIASES[second],
		id: expectDefined(tokens[0], "tokens entry at 0")
	};
	return {
		ok: false,
		error: APPROVE_USAGE_TEXT
	};
}
function buildResolvedByLabel(params) {
	return `${params.command.channel}:${params.command.senderId ?? "unknown"}`;
}
function formatApprovalSubmitError(error) {
	return formatErrorMessage(error);
}
function resolveAuthorizedApprovalKinds(params) {
	return [...params.execAuthorization.authorized ? ["exec"] : [], ...params.pluginAuthorization.authorized ? ["plugin"] : []];
}
function resolveApprovalAuthorizationError(params) {
	return params.execAuthorization.reason ?? params.pluginAuthorization.reason ?? "❌ You are not authorized to approve this request.";
}
async function handleApproveCommandFromContext(params, allowTextCommands) {
	if (!allowTextCommands) return null;
	const normalized = params.command.commandBodyNormalized;
	const parsed = parseApproveCommand(normalized);
	if (!parsed) return null;
	if (!parsed.ok) return {
		shouldContinue: false,
		reply: { text: parsed.error }
	};
	const effectiveAccountId = resolveChannelAccountId({
		cfg: params.cfg,
		ctx: params.ctx,
		command: params.command
	});
	const execApprovalAuthorization = resolveApprovalCommandAuthorization({
		cfg: params.cfg,
		channel: params.command.channel,
		accountId: effectiveAccountId,
		senderId: params.command.senderId,
		kind: "exec"
	});
	const pluginApprovalAuthorization = resolveApprovalCommandAuthorization({
		cfg: params.cfg,
		channel: params.command.channel,
		accountId: effectiveAccountId,
		senderId: params.command.senderId,
		kind: "plugin"
	});
	const hasExplicitApprovalAuthorization = execApprovalAuthorization.explicit && execApprovalAuthorization.authorized || pluginApprovalAuthorization.explicit && pluginApprovalAuthorization.authorized;
	if (!params.command.isAuthorizedSender && !hasExplicitApprovalAuthorization) {
		logVerbose(`Ignoring /approve from unauthorized sender: ${params.command.senderId || "<unknown>"}`);
		return { shouldContinue: false };
	}
	const missingScope = requireGatewayClientScope(params, {
		label: "/approve",
		allowedScopes: ["operator.approvals", "operator.admin"],
		missingText: "❌ /approve requires operator.approvals for gateway clients."
	});
	if (missingScope) return missingScope;
	const approvalCapability = resolveChannelApprovalCapability(getChannelPlugin(params.command.channel));
	const commandBehaviors = /* @__PURE__ */ new Map();
	for (const approvalKind of ["exec", "plugin"]) commandBehaviors.set(approvalKind, approvalCapability?.resolveApproveCommandBehavior?.({
		cfg: params.cfg,
		accountId: effectiveAccountId,
		senderId: params.command.senderId,
		approvalKind
	}));
	const blockedCommandResult = () => {
		const replyBehavior = Array.from(commandBehaviors.values()).find((behavior) => behavior?.kind === "reply");
		if (replyBehavior?.kind === "reply") return {
			shouldContinue: false,
			reply: { text: replyBehavior.text }
		};
		if (Array.from(commandBehaviors.values()).some((behavior) => behavior?.kind === "ignore")) return { shouldContinue: false };
		return null;
	};
	const resolvedBy = buildResolvedByLabel(params);
	const callApprovalMethod = async (resolveMethod) => {
		await resolveApprovalOverGateway({
			cfg: params.cfg,
			approvalId: parsed.id,
			decision: parsed.decision,
			...approvalCapability?.authorizeActorAction ? {
				channel: params.command.channel,
				accountId: effectiveAccountId,
				senderId: params.command.senderId
			} : {},
			resolveMethod,
			clientDisplayName: `Chat approval (${resolvedBy})`
		});
	};
	const methods = resolveAuthorizedApprovalKinds({
		execAuthorization: execApprovalAuthorization,
		pluginAuthorization: pluginApprovalAuthorization
	}).filter((approvalKind) => {
		const behavior = commandBehaviors.get(approvalKind);
		return !behavior || behavior.kind === "allow";
	});
	if (methods.length === 0) {
		const blocked = blockedCommandResult();
		if (blocked) return blocked;
		return {
			shouldContinue: false,
			reply: { text: resolveApprovalAuthorizationError({
				execAuthorization: execApprovalAuthorization,
				pluginAuthorization: pluginApprovalAuthorization
			}) }
		};
	}
	for (const [index, method] of methods.entries()) try {
		await callApprovalMethod(method);
		break;
	} catch (error) {
		const isLastMethod = index === methods.length - 1;
		if (!isApprovalNotFoundError(error)) return {
			shouldContinue: false,
			reply: { text: `❌ Failed to submit approval: ${formatApprovalSubmitError(error)}` }
		};
		if (isLastMethod) {
			const blocked = blockedCommandResult();
			if (blocked) return blocked;
			return {
				shouldContinue: false,
				reply: { text: `❌ Failed to submit approval: ${formatApprovalSubmitError(error)}` }
			};
		}
	}
	return {
		shouldContinue: false,
		reply: { text: `✅ Approval ${parsed.decision} submitted for ${parsed.id}.` }
	};
}
const handleApproveCommand = async (params, allowTextCommands) => await handleApproveCommandFromContext(params, allowTextCommands);
//#endregion
export { handleApproveCommandFromContext as n, handleApproveCommand as t };
