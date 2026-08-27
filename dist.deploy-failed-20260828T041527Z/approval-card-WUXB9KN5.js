import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import crypto from "node:crypto";
//#region extensions/msteams/src/approval-card-actions.ts
const approvalCardBindings = /* @__PURE__ */ new Map();
const approvalCardResolvingTokens = /* @__PURE__ */ new Set();
const MSTEAMS_APPROVAL_CARD_BINDING_MAX_ENTRIES = 1024;
function createMSTeamsApprovalToken() {
	return crypto.randomBytes(18).toString("base64url");
}
function readMSTeamsApprovalActionToken(value) {
	if (!isRecord(value)) return null;
	const action = isRecord(value.action) ? value.action : void 0;
	const submitted = action && normalizeOptionalLowercaseString(action.type) === "action.submit" && isRecord(action.data) ? action.data : value;
	if (submitted.openclawAction !== "approval") return null;
	return normalizeOptionalString(submitted.token) ?? null;
}
function registerMSTeamsApprovalCardBinding(binding) {
	if (binding.expiresAtMs <= Date.now()) return false;
	approvalCardBindings.delete(binding.token);
	approvalCardBindings.set(binding.token, binding);
	pruneMapToMaxSize(approvalCardBindings, MSTEAMS_APPROVAL_CARD_BINDING_MAX_ENTRIES);
	return true;
}
function getMSTeamsApprovalCardBinding(token) {
	const binding = approvalCardBindings.get(token);
	if (!binding) return null;
	if (binding.expiresAtMs <= Date.now()) {
		approvalCardBindings.delete(token);
		approvalCardResolvingTokens.delete(token);
		return null;
	}
	return binding;
}
function claimMSTeamsApprovalCardBinding(token) {
	const binding = getMSTeamsApprovalCardBinding(token);
	if (!binding) return { kind: "missing" };
	if (approvalCardResolvingTokens.has(token)) return { kind: "in-flight" };
	approvalCardResolvingTokens.add(token);
	return {
		kind: "claimed",
		binding
	};
}
function completeMSTeamsApprovalCardBinding(token) {
	approvalCardResolvingTokens.delete(token);
	approvalCardBindings.delete(token);
}
function releaseMSTeamsApprovalCardBinding(token) {
	approvalCardResolvingTokens.delete(token);
}
function unregisterMSTeamsApprovalCardBindings(tokens) {
	for (const token of tokens) completeMSTeamsApprovalCardBinding(token);
}
//#endregion
//#region extensions/msteams/src/approval-card.ts
function buildCardHeading(title, subtitle) {
	return [{
		type: "TextBlock",
		text: title,
		weight: "Bolder",
		size: "Medium",
		wrap: true
	}, {
		type: "TextBlock",
		text: subtitle,
		isSubtle: true,
		wrap: true
	}];
}
function buildApprovalSubject(view) {
	if (view.approvalKind === "exec") return [
		{
			type: "TextBlock",
			text: "Command",
			weight: "Bolder",
			wrap: true
		},
		{
			type: "TextBlock",
			text: view.commandText,
			fontType: "Monospace",
			wrap: true
		},
		...view.commandPreview && view.commandPreview !== view.commandText ? [{
			type: "TextBlock",
			text: "Preview",
			weight: "Bolder",
			wrap: true
		}, {
			type: "TextBlock",
			text: view.commandPreview,
			fontType: "Monospace",
			wrap: true
		}] : []
	];
	return [
		{
			type: "TextBlock",
			text: "Request",
			weight: "Bolder",
			wrap: true
		},
		{
			type: "TextBlock",
			text: view.title,
			weight: "Bolder",
			wrap: true
		},
		...view.description ? [{
			type: "TextBlock",
			text: view.description,
			wrap: true
		}] : []
	];
}
function buildApprovalMetadata(approvalId, metadata) {
	return {
		type: "FactSet",
		facts: [{
			title: "Approval ID:",
			value: approvalId
		}].concat(metadata.map(({ label, value }) => ({
			title: `${label}:`,
			value
		})))
	};
}
function buildAdaptiveCard(body, actions) {
	return {
		type: "AdaptiveCard",
		version: "1.5",
		body,
		...actions?.length ? { actions } : {}
	};
}
function formatApprovalDecision(decision) {
	return decision === "allow-once" ? "Allowed once" : decision === "allow-always" ? "Allowed always" : "Denied";
}
function buildMSTeamsPendingApprovalCard(params) {
	const { view, nowMs } = params;
	const kindLabel = view.approvalKind === "plugin" ? "Plugin" : "Exec";
	const actionTokens = [];
	const actions = view.actions.map(({ decision, label }) => {
		const token = createMSTeamsApprovalToken();
		actionTokens.push({
			token,
			decision
		});
		return {
			type: "Action.Submit",
			title: label,
			data: {
				openclawAction: "approval",
				token
			}
		};
	});
	const remainingSeconds = Math.max(0, Math.ceil((view.expiresAtMs - nowMs) / 1e3));
	const body = [
		...buildCardHeading(`${kindLabel} Approval Required`, `Expires in ${remainingSeconds}s`),
		...buildApprovalSubject(view),
		buildApprovalMetadata(view.approvalId, view.metadata)
	];
	return {
		approvalId: view.approvalId,
		approvalKind: view.approvalKind,
		expiresAtMs: view.expiresAtMs,
		card: buildAdaptiveCard(body, actions),
		actionTokens,
		allowedDecisions: view.actions.map(({ decision }) => decision)
	};
}
function buildMSTeamsResolvedApprovalCard(view) {
	const kindLabel = view.approvalKind === "plugin" ? "Plugin" : "Exec";
	const resolvedBy = normalizeOptionalString(view.resolvedBy);
	return buildAdaptiveCard([
		...buildCardHeading(`${kindLabel} Approval: ${formatApprovalDecision(view.decision)}`, resolvedBy ? `Resolved by ${resolvedBy}` : "Resolved"),
		...buildApprovalSubject(view),
		buildApprovalMetadata(view.approvalId, view.metadata)
	]);
}
function buildMSTeamsExpiredApprovalCard(view) {
	return buildAdaptiveCard([
		...buildCardHeading(`${view.approvalKind === "plugin" ? "Plugin" : "Exec"} Approval Expired`, "This approval request expired before it was resolved."),
		...buildApprovalSubject(view),
		buildApprovalMetadata(view.approvalId, view.metadata)
	]);
}
function buildMSTeamsCanonicalApprovalTerminalCard(result) {
	const { approval } = result;
	const { presentation } = approval;
	const kindLabel = presentation.kind === "exec" ? "Exec" : presentation.kind === "plugin" ? "Plugin" : "System Agent";
	const outcome = approval.status === "allowed" ? formatApprovalDecision(approval.decision) : approval.status === "denied" ? "Denied" : approval.status === "expired" ? "Expired" : "Cancelled";
	const subject = presentation.kind === "exec" ? [{
		type: "TextBlock",
		text: "Command",
		weight: "Bolder",
		wrap: true
	}, {
		type: "TextBlock",
		text: presentation.commandPreview ?? presentation.commandText,
		fontType: "Monospace",
		wrap: true
	}] : [{
		type: "TextBlock",
		text: presentation.title,
		weight: "Bolder",
		wrap: true
	}, {
		type: "TextBlock",
		text: presentation.description,
		wrap: true
	}];
	const metadata = [
		{
			label: "Status",
			value: approval.status
		},
		..."decision" in approval ? [{
			label: "Decision",
			value: approval.decision
		}] : [],
		{
			label: "Reason",
			value: approval.reason
		}
	];
	return buildAdaptiveCard([
		...buildCardHeading(`${kindLabel} Approval: ${outcome}`, result.applied ? "Resolved by this action" : "Already resolved"),
		...subject,
		buildApprovalMetadata(approval.id, metadata)
	]);
}
//#endregion
export { claimMSTeamsApprovalCardBinding as a, readMSTeamsApprovalActionToken as c, unregisterMSTeamsApprovalCardBindings as d, buildMSTeamsResolvedApprovalCard as i, registerMSTeamsApprovalCardBinding as l, buildMSTeamsExpiredApprovalCard as n, completeMSTeamsApprovalCardBinding as o, buildMSTeamsPendingApprovalCard as r, getMSTeamsApprovalCardBinding as s, buildMSTeamsCanonicalApprovalTerminalCard as t, releaseMSTeamsApprovalCardBinding as u };
