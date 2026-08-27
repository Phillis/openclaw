//#region src/config/sessions/session-entry-projection.ts
const SESSION_ENTRY_PRIVATE_CLEAR_PATCH = {
	activeWriterRunId: void 0,
	lastRunId: void 0,
	lifecycleRunId: void 0,
	mainRestartRecovery: void 0,
	pendingProjectGitUrl: void 0,
	sessionDiffBaselineCapture: void 0
};
const PRIVATE_SESSION_ENTRY_KEYS = [
	"activeWriterRunId",
	"lastRunId",
	"lifecycleRunId",
	"mainRestartRecovery",
	"pendingProjectGitUrl",
	"sessionDiffBaselineCapture"
];
function projectPublicModelFallback(fallback) {
	if (!fallback) return;
	const { prevThinkingLevelSelection: _privateSelection, ...publicFallback } = fallback;
	return publicFallback;
}
function stripPrivateSessionEntryFields(entry) {
	const projected = { ...entry };
	for (const key of PRIVATE_SESSION_ENTRY_KEYS) delete projected[key];
	delete projected.thinkingLevelSelection;
	const modelFallback = projectPublicModelFallback(entry.modelFallback);
	if (modelFallback) projected.modelFallback = modelFallback;
	else delete projected.modelFallback;
	return projected;
}
function projectPublicSessionEntry(entry) {
	return stripPrivateSessionEntryFields(entry);
}
function projectPublicSessionEntryPatch(patch) {
	return stripPrivateSessionEntryFields(patch);
}
//#endregion
export { projectPublicSessionEntry as n, projectPublicSessionEntryPatch as r, SESSION_ENTRY_PRIVATE_CLEAR_PATCH as t };
