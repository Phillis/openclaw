//#region src/agents/session-permission-exec-mode.ts
const EXEC_MODE_BY_PERMISSION_MODE = {
	"read-only": "deny",
	guarded: "ask",
	workspace: "auto",
	full: "full"
};
function resolveSessionPermissionCoreToolPolicy(policy) {
	const workspaceOnly = policy.mode !== "full";
	return {
		workspaceOnly,
		readOnly: policy.mode === "read-only",
		applyPatchWorkspaceOnly: workspaceOnly,
		execMode: EXEC_MODE_BY_PERMISSION_MODE[policy.mode],
		bypassHostApprovalFloors: policy.mode === "full"
	};
}
function resolveSessionPermissionExecMode(policy) {
	return resolveSessionPermissionCoreToolPolicy(policy).execMode;
}
//#endregion
export { resolveSessionPermissionExecMode as n, resolveSessionPermissionCoreToolPolicy as t };
