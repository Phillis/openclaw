import { t as sanitizeExecApprovalDisplayText } from "./exec-approval-text-sanitize-B7KSiT_n.js";
//#region src/infra/approval-scope.ts
function exceedsApprovalScopeStringLimit(value, maxLength) {
	return Array.from(value).length > maxLength;
}
function summarizeApprovalScope(scope) {
	switch (scope.kind) {
		case "message-send": {
			const recipientLabel = scope.recipientCount === 1 ? "recipient" : "recipients";
			const audience = scope.audience ? ` (${scope.audience})` : "";
			const recipients = scope.recipients ?? [];
			const remaining = scope.recipientCount - recipients.length;
			const preview = recipients.length ? `: ${[...recipients, ...remaining > 0 ? [`+${remaining} more`] : []].join(", ")}` : "";
			return `Send to ${scope.recipientCount} ${recipientLabel} via ${scope.target}${audience}${preview}`;
		}
		case "payment": return `Pay ${scope.amount} ${scope.currency} to ${scope.target}`;
		case "external-post": return `Post ${scope.visibility === "public" ? "publicly" : "restricted"} to ${scope.target}`;
	}
	throw new Error("Unsupported approval scope");
}
function sanitizeApprovalScope(scope) {
	const target = sanitizeExecApprovalDisplayText(scope.target);
	if (exceedsApprovalScopeStringLimit(target, 128)) return null;
	switch (scope.kind) {
		case "message-send": {
			const recipients = scope.recipients?.slice(0, scope.recipientCount).map(sanitizeExecApprovalDisplayText);
			if (recipients?.some((recipient) => exceedsApprovalScopeStringLimit(recipient, 128))) return null;
			return {
				...scope,
				target,
				...recipients ? { recipients } : {}
			};
		}
		case "payment": {
			const amount = sanitizeExecApprovalDisplayText(scope.amount);
			const currency = sanitizeExecApprovalDisplayText(scope.currency);
			return exceedsApprovalScopeStringLimit(amount, 40) || exceedsApprovalScopeStringLimit(currency, 12) ? null : {
				...scope,
				amount,
				currency,
				target
			};
		}
		case "external-post": return {
			...scope,
			target
		};
	}
	return null;
}
//#endregion
export { summarizeApprovalScope as n, sanitizeApprovalScope as t };
