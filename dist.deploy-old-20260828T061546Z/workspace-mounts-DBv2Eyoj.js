import { a as isPathInside } from "./path-D138yf8v.js";
import "./path-guards-CQoZeoCG.js";
import { c as splitSandboxBindSpec, s as resolveSandboxHostPathViaExistingAncestor } from "./network-mode-DeGMP6dE.js";
import { g as SANDBOX_AGENT_WORKSPACE_MOUNT } from "./constants-CZykxrCI.js";
import { n as normalizeContainerPathCore } from "./path-utils-Drbu0ZHc.js";
import fs from "node:fs";
import path from "node:path";
//#region src/agents/sandbox/workspace-mounts.ts
/**
* Sandbox workspace mount argument builder.
*
* Creates Docker bind specs for writable workspaces and read-only skill source mounts.
*/
const MATERIALIZED_SANDBOX_SKILLS_WORKSPACE_PARTS = [".openclaw", "sandbox-skills"];
function formatManagedWorkspaceBind(params) {
	return `${params.hostPath}:${params.containerPath}:${params.readOnly ? "ro,z" : "z"}`;
}
function containerJoin(root, ...parts) {
	const normalizedRoot = root.endsWith("/") && root !== "/" ? root.slice(0, -1) : root;
	const suffix = parts.map((part) => part.replace(/^\/+|\/+$/g, "")).filter(Boolean).join("/");
	return suffix ? `${normalizedRoot}/${suffix}` : normalizedRoot;
}
function normalizeMountContainerPath(containerPath) {
	return normalizeContainerPathCore(containerPath).replace(/\/+$/, "") || "/";
}
/** Hidden workspace used to materialize non-workspace skills for rw sandboxes. */
function resolveMaterializedSandboxSkillsWorkspaceDir(rootDir) {
	return path.join(rootDir, ...MATERIALIZED_SANDBOX_SKILLS_WORKSPACE_PARTS);
}
/** Returns true when a skill mount source exists inside the canonical mount root. */
function isExistingWorkspaceSkillMountSource(params) {
	try {
		if (!fs.lstatSync(params.hostPath).isDirectory()) return false;
	} catch {
		return false;
	}
	return isPathInside(resolveSandboxHostPathViaExistingAncestor(path.resolve(params.rootDir)), resolveSandboxHostPathViaExistingAncestor(path.resolve(params.hostPath)));
}
/** Finds agent-workspace skill directories that should be mounted read-only in rw workspaces. */
function resolveReadOnlyWorkspaceSkillMounts(params) {
	if (params.workspaceAccess !== "rw") return [];
	const materializedSkillsWorkspaceDir = params.skillsWorkspaceDir ?? resolveMaterializedSandboxSkillsWorkspaceDir(params.agentWorkspaceDir);
	return [
		{
			hostPath: path.join(params.agentWorkspaceDir, "skills"),
			containerPath: containerJoin(params.workdir, "skills"),
			rootDir: params.agentWorkspaceDir
		},
		{
			hostPath: path.join(params.agentWorkspaceDir, ".agents", "skills"),
			containerPath: containerJoin(params.workdir, ".agents", "skills"),
			rootDir: params.agentWorkspaceDir
		},
		{
			hostPath: path.join(materializedSkillsWorkspaceDir, "skills"),
			containerPath: containerJoin(params.workdir, ...MATERIALIZED_SANDBOX_SKILLS_WORKSPACE_PARTS, "skills"),
			rootDir: materializedSkillsWorkspaceDir
		}
	].filter((mount) => isExistingWorkspaceSkillMountSource({
		rootDir: mount.rootDir,
		hostPath: mount.hostPath
	})).map(({ hostPath, containerPath }) => ({
		hostPath,
		containerPath
	}));
}
/** Returns stable mount state for sandbox config hashes. */
function formatReadOnlyWorkspaceSkillMountHashState(mounts) {
	return mounts.map((mount) => `${mount.hostPath}:${mount.containerPath}:ro`);
}
/**
* Returns the set of container paths that are protected by read-only skill mounts.
*
* User-defined binds that target any path in this set must be skipped so the
* container engine sees one authoritative read-only mount for each destination.
*/
function resolveProtectedSkillMountContainerPaths(mounts) {
	return new Set(mounts.map((mount) => normalizeMountContainerPath(mount.containerPath)));
}
/**
* Returns a filtered copy of `binds` with entries whose container path conflicts with a
* protected skill mount removed. Protected skill mounts always take precedence so checked-in
* skills cannot be made writable by a user bind.
*/
function filterBindsConflictingWithProtectedMounts(binds, protectedContainerPaths) {
	if (!binds?.length) return [];
	if (protectedContainerPaths.size === 0) return [...binds];
	const filtered = [];
	for (const bind of binds) {
		const spec = splitSandboxBindSpec(bind);
		if (!spec) {
			filtered.push(bind);
			continue;
		}
		const containerPath = normalizeMountContainerPath(spec.container);
		if (!protectedContainerPaths.has(containerPath)) filtered.push(bind);
	}
	return filtered;
}
/** Appends Docker `-v` args for read-only skill mounts. */
function appendReadOnlyWorkspaceSkillMountArgs(params) {
	for (const mount of params.readOnlyWorkspaceSkillMounts) params.args.push("-v", formatManagedWorkspaceBind({
		hostPath: mount.hostPath,
		containerPath: mount.containerPath,
		readOnly: true
	}));
}
/** Appends Docker workspace mount args for the project, agent workspace, and skill overlays. */
function appendWorkspaceMountArgs(params) {
	const { args, workspaceDir, agentWorkspaceDir, workdir, workspaceAccess } = params;
	args.push("-v", formatManagedWorkspaceBind({
		hostPath: workspaceDir,
		containerPath: workdir,
		readOnly: workspaceAccess !== "rw"
	}));
	if (workspaceAccess !== "none" && workspaceDir !== agentWorkspaceDir) args.push("-v", formatManagedWorkspaceBind({
		hostPath: agentWorkspaceDir,
		containerPath: SANDBOX_AGENT_WORKSPACE_MOUNT,
		readOnly: workspaceAccess === "ro"
	}));
	if (params.includeReadOnlyWorkspaceSkillMounts !== false) appendReadOnlyWorkspaceSkillMountArgs({
		args,
		readOnlyWorkspaceSkillMounts: params.readOnlyWorkspaceSkillMounts ?? resolveReadOnlyWorkspaceSkillMounts({
			workspaceDir,
			agentWorkspaceDir,
			skillsWorkspaceDir: params.skillsWorkspaceDir,
			workdir,
			workspaceAccess
		})
	});
}
//#endregion
export { isExistingWorkspaceSkillMountSource as a, resolveReadOnlyWorkspaceSkillMounts as c, formatReadOnlyWorkspaceSkillMountHashState as i, appendWorkspaceMountArgs as n, resolveMaterializedSandboxSkillsWorkspaceDir as o, filterBindsConflictingWithProtectedMounts as r, resolveProtectedSkillMountContainerPaths as s, appendReadOnlyWorkspaceSkillMountArgs as t };
