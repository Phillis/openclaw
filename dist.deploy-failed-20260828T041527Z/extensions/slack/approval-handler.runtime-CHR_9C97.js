import { a as parseSlackTarget } from "./target-parsing-BnMD2ZqZ.js";
import { Ft as normalizeSlackApproverId, K as truncateSlackTextByUtf8Bytes, L as SLACK_EDIT_TEXT_MAX_BYTES, _t as isSlackAnyNativeApprovalClientEnabled, b as resolveSlackReplyBlocks, lt as SLACK_APPROVAL_HEADER_BLOCK_ID, wt as shouldHandleSlackNativeApprovalRequest } from "./group-policy-OYHYNnR0.js";
import { r as sendMessageSlack } from "./send-e3st1vaR.js";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { buildChannelApprovalNativeTargetKey } from "openclaw/plugin-sdk/approval-native-runtime";
import { buildApprovalPresentationFromActionDescriptors } from "openclaw/plugin-sdk/approval-reply-runtime";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { logError } from "openclaw/plugin-sdk/logging-core";
import { createChannelApprovalNativeRuntimeAdapter } from "openclaw/plugin-sdk/approval-handler-runtime";
//#region extensions/slack/src/approval-handler.runtime.ts
const SLACK_CONTEXT_ELEMENTS_MAX = 10;
const SLACK_TEXT_OBJECT_MAX = 3e3;
function resolveHandlerContext(params) {
	const context = params.context;
	const accountId = normalizeOptionalString(params.accountId) ?? "";
	if (!context?.app || !accountId) return null;
	return {
		accountId,
		context
	};
}
function truncateSlackMrkdwn(text, maxChars) {
	const limit = Math.max(0, Math.floor(maxChars));
	if (text.length <= limit) return text;
	if (limit <= 1) return truncateUtf16Safe(text, limit);
	return `${truncateUtf16Safe(text, limit - 1)}…`;
}
function buildSlackCodeBlock(text) {
	let fence = "```";
	while (text.includes(fence)) fence += "`";
	return `${fence}\n${text}\n${fence}`;
}
function formatSlackApprover(resolvedBy) {
	const normalized = resolvedBy ? normalizeSlackApproverId(resolvedBy) : void 0;
	if (normalized) return `<@${normalized}>`;
	const trimmed = normalizeOptionalString(resolvedBy);
	return trimmed ? trimmed : null;
}
function formatSlackMetadataLine(label, value) {
	return `*${label}:* ${value}`;
}
function buildSlackMetadataLines(metadata) {
	const lines = [];
	for (const item of metadata) lines.push(formatSlackMetadataLine(item.label, item.value));
	return lines;
}
function buildSlackMetadataContextElements(metadata) {
	const lines = buildSlackMetadataLines(metadata);
	const visibleLineCount = lines.length > SLACK_CONTEXT_ELEMENTS_MAX ? SLACK_CONTEXT_ELEMENTS_MAX - 1 : lines.length;
	const elements = [];
	for (let index = 0; index < visibleLineCount; index += 1) {
		const line = lines[index];
		if (line === void 0) continue;
		elements.push({
			type: "mrkdwn",
			text: truncateSlackMrkdwn(line, SLACK_TEXT_OBJECT_MAX)
		});
	}
	if (lines.length > SLACK_CONTEXT_ELEMENTS_MAX) elements.push({
		type: "mrkdwn",
		text: `…+${lines.length - visibleLineCount} more`
	});
	return elements;
}
function buildSlackMetadataContextBlocks(metadata) {
	const metadataElements = buildSlackMetadataContextElements(metadata);
	return metadataElements.length > 0 ? [{
		type: "context",
		elements: metadataElements
	}] : [];
}
function resolveSlackApprovalDecisionLabel(decision) {
	return decision === "allow-once" ? "Allowed once" : decision === "allow-always" ? "Allowed always" : "Denied";
}
function buildSlackPluginMetadata(view) {
	return [{
		label: "Approval ID",
		value: view.approvalId
	}, ...view.metadata];
}
function resolveSlackPluginDescription(view) {
	return normalizeOptionalString(view.description) ?? "A plugin action needs your approval.";
}
function buildSlackPluginRequestBlocks(view) {
	return [{
		type: "section",
		text: {
			type: "mrkdwn",
			text: `*Request*\n${truncateSlackMrkdwn(view.title, 2600)}`
		}
	}, ...buildSlackMetadataContextBlocks(buildSlackPluginMetadata(view))];
}
function buildSlackApprovalPayload(input) {
	const { phase, view } = input;
	const isPlugin = view.approvalKind === "plugin";
	const approvalName = isPlugin ? "Plugin" : "Exec";
	let heading;
	let description;
	if (phase === "pending") {
		heading = `*${approvalName} approval required*`;
		description = view.approvalKind === "plugin" ? resolveSlackPluginDescription(view) : "A command needs your approval.";
	} else if (phase === "resolved") {
		heading = `*${approvalName} approval: ${resolveSlackApprovalDecisionLabel(view.decision)}*`;
		const resolvedBy = formatSlackApprover(view.resolvedBy);
		description = resolvedBy ? `Resolved by ${resolvedBy}.` : "Resolved.";
	} else {
		heading = `*${approvalName} approval expired*`;
		description = "This approval request expired before it was resolved.";
	}
	const metadata = isPlugin ? buildSlackPluginMetadata(view) : view.metadata;
	const bodyLabel = isPlugin ? "*Request*" : "*Command*";
	const bodyText = isPlugin ? view.title : buildSlackCodeBlock(view.commandText);
	const text = [
		heading,
		description,
		"",
		bodyLabel,
		bodyText,
		...isPlugin || phase === "pending" ? buildSlackMetadataLines(metadata) : []
	].join("\n");
	const headerDescription = isPlugin && phase === "pending" ? truncateSlackMrkdwn(description, 2600) : description;
	const blocks = [{
		type: "section",
		...phase === "pending" ? { block_id: SLACK_APPROVAL_HEADER_BLOCK_ID } : {},
		text: {
			type: "mrkdwn",
			text: `${heading}\n${headerDescription}`
		}
	}, ...view.approvalKind === "plugin" ? buildSlackPluginRequestBlocks(view) : [{
		type: "section",
		text: {
			type: "mrkdwn",
			text: `*Command*\n${buildSlackCodeBlock(truncateSlackMrkdwn(view.commandText, 2600))}`
		}
	}, ...phase === "pending" ? buildSlackMetadataContextBlocks(view.metadata) : []]];
	if (phase === "pending") blocks.push(...resolveSlackReplyBlocks({
		text: "",
		presentation: buildApprovalPresentationFromActionDescriptors(view.actions)
	}) ?? []);
	return {
		text,
		blocks
	};
}
async function updateMessage(params) {
	try {
		await params.client.chat.update({
			channel: params.channelId,
			ts: params.messageTs,
			text: truncateSlackTextByUtf8Bytes(params.text, SLACK_EDIT_TEXT_MAX_BYTES),
			blocks: params.blocks
		});
	} catch (err) {
		logError(`slack approvals: failed to update message: ${String(err)}`);
	}
}
const slackApprovalNativeRuntime = createChannelApprovalNativeRuntimeAdapter({
	eventKinds: ["exec", "plugin"],
	availability: {
		isConfigured: (params) => {
			const resolved = resolveHandlerContext(params);
			return resolved ? isSlackAnyNativeApprovalClientEnabled({
				cfg: params.cfg,
				accountId: resolved.accountId
			}) : false;
		},
		shouldHandle: (params) => {
			const resolved = resolveHandlerContext(params);
			if (!resolved) return false;
			return shouldHandleSlackNativeApprovalRequest({
				cfg: params.cfg,
				accountId: resolved.accountId,
				approvalKind: params.approvalKind,
				request: params.request
			});
		}
	},
	presentation: {
		buildPendingPayload: ({ view }) => buildSlackApprovalPayload({
			phase: "pending",
			view
		}),
		buildResolvedResult: ({ view }) => ({
			kind: "update",
			payload: buildSlackApprovalPayload({
				phase: "resolved",
				view
			})
		}),
		buildExpiredResult: ({ view }) => ({
			kind: "update",
			payload: buildSlackApprovalPayload({
				phase: "expired",
				view
			})
		})
	},
	transport: {
		prepareTarget: ({ plannedTarget }) => {
			const parsed = parseSlackTarget(plannedTarget.target.to, { defaultKind: "channel" });
			if (!parsed) throw new Error("Slack approval delivery target is missing");
			return {
				dedupeKey: buildChannelApprovalNativeTargetKey(plannedTarget.target),
				target: {
					to: `${parsed.kind}:${parsed.id}`,
					threadTs: plannedTarget.target.threadId != null ? String(plannedTarget.target.threadId) : void 0,
					teamId: parsed.teamId
				}
			};
		},
		deliverPending: async ({ cfg, accountId, context, preparedTarget, pendingPayload }) => {
			const resolved = resolveHandlerContext({
				cfg,
				accountId,
				context
			});
			if (!resolved) return null;
			const client = resolveApprovalClient(resolved.context, preparedTarget.teamId);
			const to = await resolveApprovalChannel(client, preparedTarget.to, preparedTarget.teamId);
			const eventScope = resolveApprovalEventScope(client, preparedTarget.teamId);
			const message = await sendMessageSlack(to, pendingPayload.text, {
				cfg,
				accountId: resolved.accountId,
				threadTs: preparedTarget.threadTs,
				blocks: pendingPayload.blocks,
				client,
				eventScope
			});
			return {
				channelId: message.channelId,
				messageTs: message.messageId,
				teamId: preparedTarget.teamId
			};
		},
		updateEntry: async ({ cfg, accountId, context, entry, payload }) => {
			const resolved = resolveHandlerContext({
				cfg,
				accountId,
				context
			});
			if (!resolved) return;
			const nextPayload = payload;
			await updateMessage({
				client: resolveApprovalClient(resolved.context, entry.teamId),
				channelId: entry.channelId,
				messageTs: entry.messageTs,
				text: nextPayload.text,
				blocks: nextPayload.blocks
			});
		}
	},
	observe: { onDeliveryError: ({ error, request }) => {
		logError(`slack approvals: failed to deliver approval ${request.id}: ${String(error)}`);
	} }
});
function resolveApprovalClient(context, teamId) {
	if (!teamId) return context.app.client;
	if (!context.enterprise || !context.resolveClient) throw new Error("Slack Enterprise Grid approval client is unavailable");
	const client = context.resolveClient(teamId);
	if (!client) throw new Error("Slack Enterprise Grid approval client is unavailable");
	return client;
}
function resolveApprovalEventScope(client, teamId) {
	if (!teamId) return;
	return {
		teamId,
		client
	};
}
async function resolveApprovalChannel(client, target, teamId) {
	if (!teamId) return target;
	const parsed = parseSlackTarget(target, { defaultKind: "channel" });
	if (!parsed) throw new Error("Slack approval delivery target is missing");
	if (parsed.kind === "channel") return `channel:${parsed.id}`;
	const channelId = normalizeOptionalString((await client.conversations.open({
		users: parsed.id,
		return_im: true
	})).channel?.id);
	if (!channelId) throw new Error("Slack Enterprise Grid approval DM did not return a channel id");
	return `channel:${channelId}`;
}
//#endregion
export { slackApprovalNativeRuntime };
