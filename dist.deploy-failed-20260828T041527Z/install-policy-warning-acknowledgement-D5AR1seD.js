import { n as sanitizeTerminalText } from "./safe-text-DbwznzfG.js";
import { n as promptText, r as promptYesNo } from "./prompt-DbKlp0mU.js";
//#region src/cli/clawhub-risk-acknowledgement.ts
function canPromptForClawHubRisk() {
	return process.stdin.isTTY && process.stdout.isTTY;
}
function resolveClawHubRiskAcknowledgementCliOptions(params) {
	return {
		acknowledgeClawHubRisk: params.acknowledgeClawHubRisk,
		onClawHubRisk: params.acknowledgeClawHubRisk || params.allowPrompt === false || !canPromptForClawHubRisk() ? void 0 : async (request) => {
			const packageName = sanitizeTerminalText(request.packageName);
			const releaseLabel = `${packageName}@${sanitizeTerminalText(request.version)}`;
			if (request.acknowledgementKind === "type-package") return (await promptText(`type: '${packageName}' to ${params.action === "installing" ? "install" : "update"} anyway\n> `)).trim() === packageName;
			return await promptYesNo(`${params.action === "installing" ? "Install" : "Update"} ClawHub package "${releaseLabel}" after reviewing the warning above?`);
		}
	};
}
//#endregion
//#region src/cli/install-policy-warning-acknowledgement.ts
function canPromptForInstallPolicyWarning() {
	return process.stdin.isTTY && process.stdout.isTTY;
}
function resolveInstallPolicyWarningAcknowledgementCliOptions(params) {
	const canPrompt = !params.acknowledgeInstallPolicyWarning && params.allowPrompt !== false && canPromptForInstallPolicyWarning();
	return {
		...params.dangerouslyForceUnsafeInstall ? { dangerouslyForceUnsafeInstall: true } : {},
		...params.acknowledgeInstallPolicyWarning ? { onInstallPolicyWarning: async () => ({ status: "approved" }) } : canPrompt ? { onInstallPolicyWarning: async (request) => {
			const targetName = sanitizeTerminalText(request.targetName);
			return (await promptText(`type: '${targetName}' to ${request.requestMode} anyway\n> `)).trim() === targetName ? { status: "approved" } : { status: "declined" };
		} } : {}
	};
}
//#endregion
export { resolveClawHubRiskAcknowledgementCliOptions as n, resolveInstallPolicyWarningAcknowledgementCliOptions as t };
