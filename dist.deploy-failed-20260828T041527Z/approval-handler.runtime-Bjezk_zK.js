import "./account-id-BH0zJUew.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { t as buildChannelApprovalNativeTargetKey } from "./approval-native-target-key-CMH-nkEa.js";
import "./runtime-env-_YEv0JPQ.js";
import { r as createChannelApprovalNativeRuntimeAdapter } from "./approval-handler-runtime-DyEQpGva.js";
import "./approval-handler-runtime-BcTJtfVV.js";
import "./approval-native-runtime-Cy7LXjtb.js";
import { t as extractMSTeamsConversationMessageId } from "./inbound-Clg3k_wg.js";
import { r as normalizeMSTeamsMessagingTarget } from "./resolve-allowlist-Cd7Hfq6b.js";
import { a as shouldHandleMSTeamsNativeApprovalRequest, r as isMSTeamsNativeApprovalClientEnabled, t as inferMSTeamsTargetChatType } from "./session-route-Cc9CcgtA.js";
import { d as unregisterMSTeamsApprovalCardBindings, i as buildMSTeamsResolvedApprovalCard, l as registerMSTeamsApprovalCardBinding, n as buildMSTeamsExpiredApprovalCard, r as buildMSTeamsPendingApprovalCard } from "./approval-card-WUXB9KN5.js";
import { a as sendMessageMSTeams, i as sendAdaptiveCardMSTeams, n as editAdaptiveCardMSTeams } from "./send-CnXqt6c6.js";
//#region extensions/msteams/src/approval-handler.runtime.ts
const log = createSubsystemLogger("msteams/approvals");
const msTeamsApprovalNativeRuntime = createChannelApprovalNativeRuntimeAdapter({
	eventKinds: ["exec", "plugin"],
	availability: {
		isConfigured: ({ cfg, accountId }) => isMSTeamsNativeApprovalClientEnabled({
			cfg,
			accountId
		}),
		shouldHandle: ({ cfg, accountId, approvalKind, request }) => shouldHandleMSTeamsNativeApprovalRequest({
			cfg,
			accountId,
			approvalKind,
			request
		})
	},
	presentation: {
		buildPendingPayload: ({ view, nowMs }) => buildMSTeamsPendingApprovalCard({
			view,
			nowMs
		}),
		buildResolvedResult: ({ view }) => ({
			kind: "update",
			payload: buildMSTeamsResolvedApprovalCard(view)
		}),
		buildExpiredResult: ({ view }) => ({
			kind: "update",
			payload: buildMSTeamsExpiredApprovalCard(view)
		})
	},
	transport: {
		prepareTarget: ({ plannedTarget }) => {
			const normalizedTarget = normalizeMSTeamsMessagingTarget(plannedTarget.target.to);
			if (!normalizedTarget) throw new Error("Microsoft Teams approval delivery target is missing");
			const threadId = plannedTarget.target.threadId;
			const to = threadId != null && inferMSTeamsTargetChatType(normalizedTarget) === "channel" && !extractMSTeamsConversationMessageId(normalizedTarget) ? `${normalizedTarget};messageid=${threadId}` : normalizedTarget;
			return {
				dedupeKey: buildChannelApprovalNativeTargetKey({
					...plannedTarget.target,
					to: normalizedTarget
				}),
				target: { to }
			};
		},
		deliverPending: async ({ cfg, accountId, preparedTarget, pendingPayload }) => {
			const sent = await sendAdaptiveCardMSTeams({
				cfg,
				to: preparedTarget.to,
				card: pendingPayload.card
			});
			if (!sent.messageId || sent.messageId === "unknown" || !sent.conversationId) return null;
			return {
				accountId: accountId ?? "default",
				conversationId: sent.conversationId,
				activityId: sent.messageId,
				actionTokens: pendingPayload.actionTokens
			};
		},
		updateEntry: async ({ cfg, entry, payload }) => {
			await editAdaptiveCardMSTeams({
				cfg,
				to: entry.conversationId,
				activityId: entry.activityId,
				card: payload
			});
		}
	},
	interactions: {
		bindPending: ({ entry, request, approvalKind, view, pendingPayload }) => {
			const tokens = [];
			for (const actionToken of entry.actionTokens) if (registerMSTeamsApprovalCardBinding({
				token: actionToken.token,
				accountId: entry.accountId,
				approvalId: request.id,
				approvalKind,
				decision: actionToken.decision,
				allowedDecisions: pendingPayload.allowedDecisions,
				conversationId: entry.conversationId,
				activityId: entry.activityId,
				expiresAtMs: view.expiresAtMs
			})) tokens.push(actionToken.token);
			return tokens.length > 0 ? tokens : null;
		},
		unbindPending: ({ binding }) => unregisterMSTeamsApprovalCardBindings(binding),
		cancelDelivered: ({ entry }) => unregisterMSTeamsApprovalCardBindings(entry.actionTokens.map(({ token }) => token))
	},
	observe: { onDeliveryError: ({ cfg, error, plannedTarget, request, approvalKind, pendingPayload }) => {
		log.error(`msteams approvals: failed to deliver request ${request.id}: ${String(error)}`);
		const decisions = pendingPayload.allowedDecisions.join("|");
		sendMessageMSTeams({
			cfg,
			to: plannedTarget.target.to,
			text: `⚠️ Could not deliver the ${approvalKind} approval card for ${request.id}. Reply "/approve ${request.id} <${decisions}>" to resolve it.`
		}).catch((fallbackError) => {
			log.error(`msteams approvals: fallback prompt for ${request.id} also failed: ${String(fallbackError)}`);
		});
	} }
});
//#endregion
export { msTeamsApprovalNativeRuntime };
