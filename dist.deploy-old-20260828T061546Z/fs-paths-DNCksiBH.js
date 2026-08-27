import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { u as normalizeStringEntries } from "./string-normalization-e_fvmxMf.js";
import { a as isPathInside } from "./path-D138yf8v.js";
import "./path-guards-CQoZeoCG.js";
import { g as shortenPathWithHome } from "./utils-Bw16L5tB.js";
import { c as splitSandboxBindSpec, s as resolveSandboxHostPathViaExistingAncestor } from "./network-mode-DeGMP6dE.js";
import { a as resolveSandboxInputPath, o as resolveSandboxPath } from "./sandbox-paths-C7Hkb46-.js";
import { g as SANDBOX_AGENT_WORKSPACE_MOUNT } from "./constants-CZykxrCI.js";
import { n as normalizeContainerPathCore, r as relativePathEscapesContainerRoot, t as isPathInsideContainerRoot } from "./path-utils-Drbu0ZHc.js";
import { c as resolveReadOnlyWorkspaceSkillMounts, s as resolveProtectedSkillMountContainerPaths } from "./workspace-mounts-DBv2Eyoj.js";
import os from "node:os";
import path from "node:path";
//#region src/agents/sandbox/fs-paths.ts
/**
* Sandbox filesystem mount and path resolution helpers.
*
* Builds the container-to-host mount table and maps requested sandbox paths to writable/read-only host targets.
*/
function parseSandboxBindMount(spec) {
	const trimmed = spec.trim();
	if (!trimmed) return null;
	const parsed = splitSandboxBindSpec(trimmed);
	if (!parsed) return null;
	const hostToken = parsed.host.trim();
	const containerToken = parsed.container.trim();
	if (!hostToken || !containerToken || !path.posix.isAbsolute(containerToken)) return null;
	const optionsToken = normalizeOptionalLowercaseString(parsed.options) ?? "";
	const writable = !(optionsToken ? normalizeStringEntries(optionsToken.split(",")) : []).includes("ro");
	return {
		hostRoot: path.resolve(hostToken),
		containerRoot: normalizeContainerPathCore(containerToken),
		writable
	};
}
function buildSandboxFsMounts(sandbox) {
	const mounts = [{
		hostRoot: path.resolve(sandbox.workspaceDir),
		containerRoot: normalizeContainerPathCore(sandbox.containerWorkdir),
		writable: sandbox.workspaceAccess === "rw",
		source: "workspace"
	}];
	if (sandbox.workspaceAccess !== "none" && path.resolve(sandbox.agentWorkspaceDir) !== path.resolve(sandbox.workspaceDir)) mounts.push({
		hostRoot: path.resolve(sandbox.agentWorkspaceDir),
		containerRoot: SANDBOX_AGENT_WORKSPACE_MOUNT,
		writable: sandbox.workspaceAccess === "rw",
		source: "agent"
	});
	const protectedSkillMounts = resolveReadOnlyWorkspaceSkillMounts({
		workspaceDir: sandbox.workspaceDir,
		agentWorkspaceDir: sandbox.agentWorkspaceDir,
		skillsWorkspaceDir: sandbox.skillsWorkspaceDir,
		workdir: sandbox.containerWorkdir,
		workspaceAccess: sandbox.workspaceAccess
	});
	for (const mount of protectedSkillMounts) mounts.push({
		hostRoot: path.resolve(mount.hostPath),
		containerRoot: normalizeContainerPathCore(mount.containerPath),
		writable: false,
		source: "protectedSkill"
	});
	const protectedPaths = resolveProtectedSkillMountContainerPaths(protectedSkillMounts);
	for (const bind of sandbox.docker.binds ?? []) {
		const parsed = parseSandboxBindMount(bind);
		if (!parsed) continue;
		if (protectedPaths.has(parsed.containerRoot)) continue;
		mounts.push({
			hostRoot: parsed.hostRoot,
			containerRoot: parsed.containerRoot,
			writable: parsed.writable,
			source: "bind"
		});
	}
	return dedupeMounts(mounts);
}
function resolveWritableSandboxBindHostRoots(binds) {
	const parsedBinds = parseSandboxBindMounts(binds);
	const readonlyRoots = parsedBinds.filter((bind) => !bind.writable).map((bind) => bind.hostRoot);
	const roots = [];
	const seen = /* @__PURE__ */ new Set();
	for (const parsed of parsedBinds) {
		if (!parsed.writable || seen.has(parsed.hostRoot) || readonlyRoots.some((root) => isPathInside(parsed.hostRoot, root))) continue;
		seen.add(parsed.hostRoot);
		roots.push(parsed.hostRoot);
	}
	return roots;
}
function hasSandboxBindContainerPathAliases(binds) {
	for (const parsed of parseSandboxBindMounts(binds)) if (parsed.hostRoot !== parsed.containerRoot) return true;
	return false;
}
function hasSandboxBindReadonlyHostShadows(binds) {
	const parsedBinds = parseSandboxBindMounts(binds);
	const writableRoots = parsedBinds.filter((bind) => bind.writable).map((bind) => bind.hostRoot);
	const readonlyRoots = parsedBinds.filter((bind) => !bind.writable).map((bind) => bind.hostRoot);
	return writableRoots.some((writableRoot) => readonlyRoots.some((readonlyRoot) => isPathInside(writableRoot, readonlyRoot)));
}
function parseSandboxBindMounts(binds) {
	const parsed = [];
	for (const bind of binds ?? []) {
		const mount = parseSandboxBindMount(bind);
		if (mount) parsed.push(mount);
	}
	return parsed;
}
function resolveSandboxFsPathWithMounts(params) {
	const mountsByContainer = [...params.mounts].toSorted(compareMountsByContainerPath);
	const mountsByHost = [...params.mounts].toSorted(compareMountsByHostPath);
	const input = params.filePath;
	const inputPosix = normalizePosixInput(input);
	if (path.posix.isAbsolute(inputPosix)) {
		const containerMount = findMountByContainerPath(mountsByContainer, inputPosix);
		if (containerMount) return resolveMountedContainerPath({
			mount: containerMount,
			containerPath: inputPosix,
			defaultContainerRoot: params.defaultContainerRoot
		});
	}
	if (!path.posix.isAbsolute(inputPosix)) {
		const protectedContainerCandidate = resolveRelativeContainerCandidate({
			inputPosix,
			cwd: params.cwd,
			defaultContainerRoot: params.defaultContainerRoot,
			mountsByHost
		});
		const protectedContainerMount = findMountByContainerPath(mountsByContainer, protectedContainerCandidate);
		if (protectedContainerMount?.source === "protectedSkill") return resolveMountedContainerPath({
			mount: protectedContainerMount,
			containerPath: protectedContainerCandidate,
			defaultContainerRoot: params.defaultContainerRoot
		});
	}
	const hostResolved = resolveSandboxInputPath(input, params.cwd);
	const hostMount = findMountByHostPath(mountsByHost, hostResolved);
	if (hostMount) {
		const relHost = path.relative(hostMount.hostRoot, hostResolved);
		const relPosix = relHost ? relHost.split(path.sep).join(path.posix.sep) : "";
		const containerPath = relPosix ? path.posix.join(hostMount.containerRoot, relPosix) : hostMount.containerRoot;
		return {
			hostPath: hostResolved,
			containerPath,
			relativePath: toDisplayRelative({
				containerPath,
				defaultContainerRoot: params.defaultContainerRoot
			}),
			writable: hostMount.writable
		};
	}
	const escapeMessage = formatSandboxRootEscapeMessage({
		input,
		defaultWorkspaceRoot: params.defaultWorkspaceRoot,
		defaultContainerRoot: params.defaultContainerRoot
	});
	try {
		resolveSandboxPath({
			filePath: input,
			cwd: params.cwd,
			root: params.defaultWorkspaceRoot
		});
	} catch {
		throw new Error(escapeMessage);
	}
	throw new Error(escapeMessage);
}
function resolveMountedContainerPath(params) {
	const rel = path.posix.relative(params.mount.containerRoot, params.containerPath);
	const hostPath = rel ? path.resolve(params.mount.hostRoot, ...toHostSegments(rel)) : params.mount.hostRoot;
	const containerPath = rel ? path.posix.join(params.mount.containerRoot, rel) : params.mount.containerRoot;
	return {
		hostPath,
		containerPath,
		relativePath: toDisplayRelative({
			containerPath,
			defaultContainerRoot: params.defaultContainerRoot
		}),
		writable: params.mount.writable
	};
}
function resolveRelativeContainerCandidate(params) {
	const cwdMount = findMountByHostPath(params.mountsByHost, path.resolve(params.cwd));
	if (cwdMount) {
		const relHost = path.relative(cwdMount.hostRoot, path.resolve(params.cwd));
		const relPosix = relHost ? relHost.split(path.sep).join(path.posix.sep) : "";
		const containerCwd = relPosix ? path.posix.join(cwdMount.containerRoot, relPosix) : cwdMount.containerRoot;
		return normalizeContainerPathCore(path.posix.resolve(containerCwd, params.inputPosix));
	}
	const cwdPosix = normalizePosixInput(params.cwd);
	if (path.posix.isAbsolute(cwdPosix)) return normalizeContainerPathCore(path.posix.resolve(cwdPosix, params.inputPosix));
	return normalizeContainerPathCore(path.posix.resolve(params.defaultContainerRoot, params.inputPosix));
}
function formatSandboxRootEscapeMessage(params) {
	const containerRoot = normalizeContainerPathCore(params.defaultContainerRoot);
	let workspaceRoot = shortenHomePath(path.resolve(params.defaultWorkspaceRoot));
	if (workspaceRoot.startsWith(`~${path.sep}`)) workspaceRoot = workspaceRoot.replaceAll(path.sep, path.posix.sep);
	return `Path escapes sandbox root (${workspaceRoot}; container root ${containerRoot}): ${params.input}. Use a path under ${containerRoot}/ instead.`;
}
function shortenHomePath(value) {
	return shortenPathWithHome(value, {
		home: os.homedir(),
		prefix: "~"
	});
}
function compareMountsByContainerPath(a, b) {
	const byLength = b.containerRoot.length - a.containerRoot.length;
	if (byLength !== 0) return byLength;
	return mountSourcePriority(b.source) - mountSourcePriority(a.source);
}
function compareMountsByHostPath(a, b) {
	const byLength = b.hostRoot.length - a.hostRoot.length;
	if (byLength !== 0) return byLength;
	return mountSourcePriority(b.source) - mountSourcePriority(a.source);
}
function mountSourcePriority(source) {
	if (source === "protectedSkill") return 3;
	if (source === "bind") return 2;
	if (source === "agent") return 1;
	return 0;
}
function dedupeMounts(mounts) {
	const seen = /* @__PURE__ */ new Set();
	const deduped = [];
	for (const mount of mounts) {
		const key = `${mount.hostRoot}=>${mount.containerRoot}`;
		if (seen.has(key)) continue;
		seen.add(key);
		deduped.push(mount);
	}
	return deduped;
}
function findMountByContainerPath(mounts, target) {
	for (const mount of mounts) if (isPathInsideContainerRoot(mount.containerRoot, target)) return mount;
	return null;
}
function findMountByHostPath(mounts, target) {
	for (const mount of mounts) if (isPathInsideHost(mount.hostRoot, target)) return mount;
	return null;
}
function isPathInsideHost(root, target) {
	const canonicalRoot = resolveSandboxHostPathViaExistingAncestor(path.resolve(root));
	const resolvedTarget = path.resolve(target);
	const canonicalTargetParent = resolveSandboxHostPathViaExistingAncestor(path.dirname(resolvedTarget));
	return isPathInside(canonicalRoot, path.resolve(canonicalTargetParent, path.basename(resolvedTarget)));
}
function toHostSegments(relativePosix) {
	return relativePosix.split("/").filter(Boolean);
}
function toDisplayRelative(params) {
	const rel = path.posix.relative(params.defaultContainerRoot, params.containerPath);
	if (!rel) return "";
	if (!relativePathEscapesContainerRoot(rel)) return rel;
	return params.containerPath;
}
function normalizePosixInput(value) {
	return value.replace(/\\/g, "/").trim();
}
//#endregion
export { resolveWritableSandboxBindHostRoots as a, resolveSandboxFsPathWithMounts as i, hasSandboxBindContainerPathAliases as n, hasSandboxBindReadonlyHostShadows as r, buildSandboxFsMounts as t };
