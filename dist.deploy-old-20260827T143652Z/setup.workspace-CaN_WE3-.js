import { m as shortenHomePath } from "./utils-DEqefz4f.js";
import { n as t } from "./i18n-BzsUVhtU.js";
import { r as resolveOnboardingWorkspaceConflict } from "./onboard-config-DU6S3CQE.js";
//#region src/wizard/setup.workspace.ts
/** Resolves a proposed setup workspace without silently remapping an existing fleet. */
async function resolveSetupWorkspaceSelection(params) {
	const conflict = params.hasAuthoredRoster === false ? void 0 : resolveOnboardingWorkspaceConflict(params.baseConfig, params.requestedWorkspaceDir);
	if (!conflict) return {
		workspaceDir: params.requestedWorkspaceDir,
		allowWorkspaceChange: false
	};
	await params.prompter.note(t("wizard.setup.workspaceConflictNotice", {
		current: shortenHomePath(conflict.currentWorkspaceDir),
		requested: shortenHomePath(conflict.requestedWorkspaceDir)
	}), t("wizard.setup.workspaceConflictTitle"));
	const allowWorkspaceChange = params.canConfirmMove !== false && await params.prompter.confirm({
		message: t("wizard.setup.workspaceConflictConfirm"),
		initialValue: false
	});
	return {
		workspaceDir: allowWorkspaceChange ? params.requestedWorkspaceDir : conflict.currentWorkspaceDir,
		allowWorkspaceChange,
		conflict
	};
}
//#endregion
export { resolveSetupWorkspaceSelection as t };
