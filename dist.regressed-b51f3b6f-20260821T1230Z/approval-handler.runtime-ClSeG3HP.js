import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { t as buildChannelApprovalNativeTargetKey } from "./approval-native-target-key-xnWMm3an.js";
import "./runtime-env-COkbgBI4.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./text-utility-runtime-LRU688AB.js";
import { r as createChannelApprovalNativeRuntimeAdapter } from "./approval-handler-runtime-DTi_kV6g.js";
import "./approval-handler-runtime-urabgcyx.js";
import "./approval-native-runtime-C2YMa3vm.js";
import { i as resolveGoogleChatAccount } from "./accounts-DOsM6Oru.js";
import { E as unregisterGoogleChatManualApprovalFollowupSuppression, S as registerGoogleChatManualApprovalFollowupSuppression, T as unregisterGoogleChatApprovalCardBindings, d as sendGoogleChatMessage, f as updateGoogleChatMessage, h as buildGoogleChatApprovalActionParameters, m as GOOGLECHAT_APPROVAL_ACTION, o as resolveGoogleChatOutboundSpace, v as createGoogleChatApprovalToken, x as registerGoogleChatApprovalCardBinding } from "./targets-CVGSAx9_.js";
import { n as isGoogleChatNativeApprovalClientEnabled, r as shouldHandleGoogleChatNativeApprovalRequest } from "./approval-native-pBZ0CH0L.js";
//#region extensions/googlechat/src/approval-handler.runtime.ts
const log = createSubsystemLogger("googlechat/approvals");
const GOOGLECHAT_APPROVAL_CARD_ID = "openclaw-approval";
const MAX_TEXT_PARAGRAPH_CHARS = 1800;
function resolveHandlerAccount(params) {
	const account = params.context?.account ?? resolveGoogleChatAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	if (!account.enabled || account.credentialSource === "none" || account.tokenStatus === "configured_unavailable") return null;
	return account;
}
function escapeGoogleChatText(text) {
	return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function truncateText(text, maxChars = MAX_TEXT_PARAGRAPH_CHARS) {
	return text.length <= maxChars ? text : `${truncateUtf16Safe(text, maxChars - 3)}...`;
}
function buildMetadataText(metadata) {
	return metadata.map((item) => `<b>${escapeGoogleChatText(item.label)}:</b> ${escapeGoogleChatText(item.value)}`).join("<br>");
}
function formatDecision(decision) {
	return decision === "allow-once" ? "Allowed once" : decision === "allow-always" ? "Allowed always" : "Denied";
}
function buildMainTextWidget(text) {
	return { textParagraph: { text: escapeGoogleChatText(truncateText(text)) } };
}
function buildHtmlTextWidget(text) {
	return { textParagraph: { text: truncateText(text) } };
}
function buildExecPendingSections(view) {
	if (view.approvalKind !== "exec") return [];
	return [{
		header: "Command",
		widgets: [buildMainTextWidget(view.commandText)]
	}, ...view.commandPreview && view.commandPreview !== view.commandText ? [{
		header: "Preview",
		widgets: [buildMainTextWidget(view.commandPreview)]
	}] : []];
}
function buildPluginPendingSections(view) {
	if (view.approvalKind !== "plugin") return [];
	return [{
		header: "Request",
		widgets: [buildHtmlTextWidget(`<b>${escapeGoogleChatText(view.title)}</b>${view.description ? `<br>${escapeGoogleChatText(view.description)}` : ""}`)]
	}];
}
function buildMetadataSection(view) {
	const metadata = [{
		label: "Approval ID",
		value: view.approvalId
	}, ...view.metadata];
	return metadata.length > 0 ? [{
		header: "Details",
		widgets: [buildHtmlTextWidget(buildMetadataText(metadata))]
	}] : [];
}
function buildActionSection(params) {
	const { actionFunction, view } = params;
	const actionTokens = view.actions.map((action) => ({
		token: createGoogleChatApprovalToken(),
		decision: action.decision
	}));
	return {
		actionTokens,
		section: { widgets: [{ buttonList: { buttons: view.actions.map((action, index) => {
			const actionToken = actionTokens[index];
			if (!actionToken) throw new Error("Google Chat approval action token missing.");
			return {
				text: action.label,
				onClick: { action: {
					function: actionFunction,
					parameters: buildGoogleChatApprovalActionParameters(actionToken.token),
					loadIndicator: "SPINNER"
				} }
			};
		}) } }] }
	};
}
function buildPendingPayload(params) {
	const { actionFunction, nowMs, view } = params;
	const { section: actionSection, actionTokens } = buildActionSection({
		actionFunction,
		view
	});
	const title = view.approvalKind === "plugin" ? "Plugin Approval Required" : "Exec Approval Required";
	const subtitle = `Expires in ${Math.max(0, Math.ceil((view.expiresAtMs - nowMs) / 1e3))}s`;
	const card = {
		cardId: GOOGLECHAT_APPROVAL_CARD_ID,
		card: {
			header: {
				title,
				subtitle
			},
			sections: [
				...buildExecPendingSections(view),
				...buildPluginPendingSections(view),
				...buildMetadataSection(view),
				actionSection
			]
		}
	};
	return {
		approvalId: view.approvalId,
		approvalKind: view.approvalKind,
		expiresAtMs: view.expiresAtMs,
		cardsV2: [card],
		actionTokens,
		allowedDecisions: view.actions.map((action) => action.decision)
	};
}
function resolveApprovalActionFunction(params) {
	const account = resolveHandlerAccount(params);
	const audience = normalizeOptionalString(account?.config.audience);
	const appPrincipal = normalizeOptionalString(account?.config.appPrincipal);
	return account?.config.audienceType === "app-url" && audience && appPrincipal ? audience : GOOGLECHAT_APPROVAL_ACTION;
}
function buildResolvedPayload(view) {
	const resolvedBy = normalizeOptionalString(view.resolvedBy);
	return { cardsV2: [{
		cardId: GOOGLECHAT_APPROVAL_CARD_ID,
		card: {
			header: {
				title: `${view.approvalKind === "plugin" ? "Plugin" : "Exec"} Approval: ${formatDecision(view.decision)}`,
				subtitle: resolvedBy ? `Resolved by ${resolvedBy}` : "Resolved"
			},
			sections: buildMetadataSection(view)
		}
	}] };
}
function buildExpiredPayload(view) {
	return { cardsV2: [{
		cardId: GOOGLECHAT_APPROVAL_CARD_ID,
		card: {
			header: {
				title: `${view.approvalKind === "plugin" ? "Plugin" : "Exec"} Approval Expired`,
				subtitle: "This approval request expired before it was resolved."
			},
			sections: buildMetadataSection(view)
		}
	}] };
}
const googleChatApprovalNativeRuntime = createChannelApprovalNativeRuntimeAdapter({
	eventKinds: ["exec", "plugin"],
	availability: {
		isConfigured: ({ cfg, accountId }) => isGoogleChatNativeApprovalClientEnabled({
			cfg,
			accountId
		}),
		shouldHandle: ({ cfg, accountId, approvalKind, request }) => shouldHandleGoogleChatNativeApprovalRequest({
			cfg,
			accountId,
			approvalKind,
			request
		})
	},
	presentation: {
		buildPendingPayload: ({ cfg, accountId, context, nowMs, view }) => buildPendingPayload({
			actionFunction: resolveApprovalActionFunction({
				cfg,
				accountId,
				context
			}),
			nowMs,
			view
		}),
		buildResolvedResult: ({ view }) => ({
			kind: "update",
			payload: buildResolvedPayload(view)
		}),
		buildExpiredResult: ({ view }) => ({
			kind: "update",
			payload: buildExpiredPayload(view)
		})
	},
	transport: {
		prepareTarget: ({ plannedTarget }) => ({
			dedupeKey: buildChannelApprovalNativeTargetKey(plannedTarget.target),
			target: {
				to: plannedTarget.target.to,
				threadName: plannedTarget.target.threadId != null ? String(plannedTarget.target.threadId) : void 0
			}
		}),
		deliverPending: async ({ cfg, accountId, context, preparedTarget, pendingPayload }) => {
			const account = resolveHandlerAccount({
				cfg,
				accountId,
				context
			});
			if (!account) return null;
			const spaceName = await resolveGoogleChatOutboundSpace({
				account,
				target: preparedTarget.to
			});
			registerGoogleChatManualApprovalFollowupSuppression({
				approvalId: pendingPayload.approvalId,
				approvalKind: pendingPayload.approvalKind,
				allowedDecisions: pendingPayload.allowedDecisions,
				expiresAtMs: pendingPayload.expiresAtMs
			});
			let sent;
			try {
				sent = await sendGoogleChatMessage({
					account,
					space: spaceName,
					cardsV2: pendingPayload.cardsV2,
					thread: preparedTarget.threadName
				});
			} catch (error) {
				unregisterGoogleChatManualApprovalFollowupSuppression(pendingPayload.approvalId);
				throw error;
			}
			if (!sent?.messageName) {
				unregisterGoogleChatManualApprovalFollowupSuppression(pendingPayload.approvalId);
				return null;
			}
			return {
				accountId: account.accountId,
				spaceName,
				messageName: sent.messageName,
				...preparedTarget.threadName ? { threadName: preparedTarget.threadName } : {},
				actionTokens: pendingPayload.actionTokens
			};
		},
		updateEntry: async ({ cfg, accountId, context, entry, payload }) => {
			const account = resolveHandlerAccount({
				cfg,
				accountId,
				context
			});
			if (!account) return;
			await updateGoogleChatMessage({
				account,
				messageName: entry.messageName,
				cardsV2: payload.cardsV2
			});
		}
	},
	interactions: {
		bindPending: ({ entry, request, approvalKind, view, pendingPayload }) => {
			const tokens = [];
			for (const actionToken of entry.actionTokens) if (registerGoogleChatApprovalCardBinding({
				token: actionToken.token,
				accountId: entry.accountId,
				approvalId: request.id,
				approvalKind,
				decision: actionToken.decision,
				allowedDecisions: pendingPayload.allowedDecisions,
				spaceName: entry.spaceName,
				messageName: entry.messageName,
				threadName: entry.threadName ?? null,
				expiresAtMs: view.expiresAtMs
			})) tokens.push(actionToken.token);
			return tokens.length > 0 ? tokens : null;
		},
		unbindPending: ({ binding }) => {
			unregisterGoogleChatApprovalCardBindings(binding);
		},
		cancelDelivered: ({ entry }) => {
			unregisterGoogleChatApprovalCardBindings(entry.actionTokens.map((actionToken) => actionToken.token));
		}
	},
	observe: { onDeliveryError: ({ error, request }) => {
		log.error(`googlechat approvals: failed to send request ${request.id}: ${String(error)}`);
	} }
});
//#endregion
export { googleChatApprovalNativeRuntime };
