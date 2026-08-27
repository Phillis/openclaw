import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { u as normalizeStringEntries } from "./string-normalization-e_fvmxMf.js";
import { t as FsSafeError } from "./errors-CQDiIdj7.js";
import { a as isPathInside } from "./path-D138yf8v.js";
import "./fs-safe-C9N8pCh1.js";
import { r as openRootFile } from "./root-file-Chr9dJBe.js";
import "./path-guards-fBZukd5S.js";
import { g as shortenPathWithHome } from "./utils-DEqefz4f.js";
import { i as readFileDescriptorBoundedSync } from "./boundary-file-read-BoOq_oud.js";
import { c as splitSandboxBindSpec, s as resolveSandboxHostPathViaExistingAncestor } from "./network-mode-CIoz0eps.js";
import { a as resolveSandboxPath, i as resolveSandboxInputPath } from "./sandbox-paths-BihmZ4cR.js";
import { g as SANDBOX_AGENT_WORKSPACE_MOUNT } from "./constants-B8EtrfM_.js";
import { n as normalizeContainerPathCore, r as relativePathEscapesContainerRoot, t as isPathInsideContainerRoot } from "./path-utils-Drbu0ZHc.js";
import { c as resolveReadOnlyWorkspaceSkillMounts, s as resolveProtectedSkillMountContainerPaths } from "./workspace-mounts-BsoH3efL.js";
import { C as buildPinnedCopyPlan, D as buildPinnedRenamePlan, E as buildPinnedRemovePlan, N as runDockerSandboxShellCommand, O as buildPinnedWritePlan, T as buildPinnedMkdirpPlan, v as parseSandboxStatMtimeMs, w as buildPinnedCreatePlan, y as parseSandboxStatSize } from "./ssh-backend-DVQ-nxjR.js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
//#region src/agents/sandbox/fs-bridge-path-safety.ts
/**
* Host/container path safety guard for the sandbox filesystem bridge.
*
* Proves requested container paths stay inside allowed mounts before host paths are opened or mutated.
*/
function sandboxBoundaryError(action, containerPath, error) {
	if (error instanceof Error && !(error instanceof FsSafeError && error.code === "not-file")) return error;
	return new Error(`Sandbox boundary checks failed; cannot ${action}: ${containerPath}`, { cause: error });
}
/** Validates sandbox fs bridge paths against mount, symlink, and writability boundaries. */
var SandboxFsPathGuard = class {
	constructor(params) {
		this.mountsByContainer = params.mountsByContainer;
		this.runCommand = params.runCommand;
	}
	async assertPathChecks(checks) {
		for (const check of checks) await this.assertPathSafety(check.target, check.options);
	}
	async assertPathSafety(target, options) {
		const guarded = await this.openBoundaryWithinRequiredMount(target, options.action, {
			aliasPolicy: options.aliasPolicy,
			allowedType: options.allowedType
		});
		await this.assertGuardedPathSafety(target, options, guarded);
	}
	async openReadableFile(target) {
		const opened = await this.openBoundaryWithinRequiredMount(target, "read files");
		if (!opened.ok) throw sandboxBoundaryError("read files", target.containerPath, opened.error);
		return opened;
	}
	resolveRequiredMount(containerPath, action) {
		const lexicalMount = this.resolveMountByContainerPath(containerPath);
		if (!lexicalMount) throw new Error(`Sandbox path escapes allowed mounts; cannot ${action}: ${containerPath}`);
		return lexicalMount;
	}
	finalizePinnedEntry(params) {
		const relativeParentPath = path.posix.relative(params.mount.containerRoot, params.parentPath);
		if (relativePathEscapesContainerRoot(relativeParentPath)) throw new Error(`Sandbox path escapes allowed mounts; cannot ${params.action}: ${params.targetPath}`);
		return {
			mountRootPath: params.mount.containerRoot,
			relativeParentPath: relativeParentPath === "." ? "" : relativeParentPath,
			basename: params.basename
		};
	}
	async assertGuardedPathSafety(target, options, guarded) {
		if (!guarded.ok) {
			if (guarded.reason !== "path") {
				if (!(options.allowedType === "directory" && this.pathIsExistingDirectory(target.hostPath))) throw sandboxBoundaryError(options.action, target.containerPath, guarded.error);
			}
		} else fs.closeSync(guarded.fd);
		const canonicalContainerPath = await this.resolveCanonicalContainerPath({
			containerPath: target.containerPath,
			allowFinalSymlinkForUnlink: options.aliasPolicy?.allowFinalSymlinkForUnlink === true
		});
		const canonicalMount = this.resolveRequiredMount(canonicalContainerPath, options.action);
		if (options.requireWritable && !canonicalMount.writable) throw new Error(`Sandbox path is read-only; cannot ${options.action}: ${target.containerPath}`);
	}
	async openBoundaryWithinRequiredMount(target, action, options) {
		const lexicalMount = this.resolveRequiredMount(target.containerPath, action);
		return await openRootFile({
			absolutePath: target.hostPath,
			rootPath: lexicalMount.hostRoot,
			boundaryLabel: "sandbox mount root",
			rejectSymlinks: false,
			aliasPolicy: options?.aliasPolicy,
			allowedType: options?.allowedType
		});
	}
	resolvePinnedEntry(target, action) {
		const basename = path.posix.basename(target.containerPath);
		if (!basename || basename === "." || basename === "/") throw new Error(`Invalid sandbox entry target: ${target.containerPath}`);
		const parentPath = normalizeContainerPathCore(path.posix.dirname(target.containerPath));
		const mount = this.resolveRequiredMount(parentPath, action);
		return this.finalizePinnedEntry({
			mount,
			parentPath,
			basename,
			targetPath: target.containerPath,
			action
		});
	}
	async resolveAnchoredSandboxEntry(target, action) {
		const basename = path.posix.basename(target.containerPath);
		if (!basename || basename === "." || basename === "/") throw new Error(`Invalid sandbox entry target: ${target.containerPath}`);
		const parentPath = normalizeContainerPathCore(path.posix.dirname(target.containerPath));
		const canonicalParentPath = await this.resolveCanonicalContainerPath({
			containerPath: parentPath,
			allowFinalSymlinkForUnlink: false
		});
		this.resolveRequiredMount(canonicalParentPath, action);
		return {
			canonicalParentPath,
			basename
		};
	}
	async resolveAnchoredPinnedEntry(target, action) {
		const anchoredTarget = await this.resolveAnchoredSandboxEntry(target, action);
		const mount = this.resolveRequiredMount(anchoredTarget.canonicalParentPath, action);
		return this.finalizePinnedEntry({
			mount,
			parentPath: anchoredTarget.canonicalParentPath,
			basename: anchoredTarget.basename,
			targetPath: target.containerPath,
			action
		});
	}
	resolvePinnedDirectoryEntry(target, action) {
		const mount = this.resolveRequiredMount(target.containerPath, action);
		const relativePath = path.posix.relative(mount.containerRoot, target.containerPath);
		if (relativePathEscapesContainerRoot(relativePath)) throw new Error(`Sandbox path escapes allowed mounts; cannot ${action}: ${target.containerPath}`);
		return {
			mountRootPath: mount.containerRoot,
			relativePath: relativePath === "." ? "" : relativePath
		};
	}
	pathIsExistingDirectory(hostPath) {
		try {
			return fs.statSync(hostPath).isDirectory();
		} catch {
			return false;
		}
	}
	resolveMountByContainerPath(containerPath) {
		const normalized = normalizeContainerPathCore(containerPath);
		for (const mount of this.mountsByContainer) if (isPathInsideContainerRoot(normalizeContainerPathCore(mount.containerRoot), normalized)) return mount;
		return null;
	}
	async resolveCanonicalContainerPath(params) {
		const script = [
			"set -eu",
			"target=\"$1\"",
			"allow_final=\"$2\"",
			"suffix=\"\"",
			"probe=\"$target\"",
			"if [ \"$allow_final\" = \"1\" ] && [ -L \"$target\" ]; then probe=$(dirname -- \"$target\"); fi",
			"cursor=\"$probe\"",
			"while [ ! -e \"$cursor\" ] && [ ! -L \"$cursor\" ]; do",
			"  parent=$(dirname -- \"$cursor\")",
			"  if [ \"$parent\" = \"$cursor\" ]; then break; fi",
			"  base=$(basename -- \"$cursor\")",
			"  suffix=\"/$base$suffix\"",
			"  cursor=\"$parent\"",
			"done",
			"canonical=$(readlink -f -- \"$cursor\")",
			"printf \"%s%s\\n\" \"$canonical\" \"$suffix\""
		].join("\n");
		const canonical = (await this.runCommand(script, { args: [params.containerPath, params.allowFinalSymlinkForUnlink ? "1" : "0"] })).stdout.toString("utf8").trim();
		if (!canonical.startsWith("/")) throw new Error(`Failed to resolve canonical sandbox path: ${params.containerPath}`);
		return normalizeContainerPathCore(canonical);
	}
};
//#endregion
//#region src/agents/sandbox/fs-bridge-shell-command-plans.ts
/** Builds a stat command that anchors the path at its canonical parent before reading metadata. */
function buildStatPlan(target, anchoredTarget) {
	return {
		checks: [{
			target,
			options: { action: "stat files" }
		}],
		script: "set -eu\ncd -- \"$1\"\nLC_ALL=C stat -c \"%F|%s|%y\" -- \"$2\"",
		args: [anchoredTarget.canonicalParentPath, anchoredTarget.basename],
		allowFailure: true
	};
}
//#endregion
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
		if (!parsed.writable || seen.has(parsed.hostRoot) || readonlyRoots.some((root) => isHostPathWithinOrEqual(parsed.hostRoot, root))) continue;
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
	return writableRoots.some((writableRoot) => readonlyRoots.some((readonlyRoot) => isHostPathWithinOrEqual(writableRoot, readonlyRoot)));
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
	return `Path escapes sandbox root (${shortenHomePath(path.resolve(params.defaultWorkspaceRoot))}; container root ${containerRoot}): ${params.input}. Use a path under ${containerRoot}/ instead.`;
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
function isHostPathWithinOrEqual(root, target) {
	const relative = path.relative(path.resolve(root), path.resolve(target));
	return relative === "" || !relative.startsWith("..") && !path.isAbsolute(relative);
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
//#region src/agents/sandbox/fs-bridge.ts
/**
* Sandbox filesystem bridge implementation.
*
* Resolves container paths to mounted host paths and executes guarded reads, writes, stats, renames, and deletes.
*/
/** Create the filesystem bridge for local Docker-style mounted sandboxes. */
function createSandboxFsBridge(params) {
	return new SandboxFsBridgeImpl(params.sandbox);
}
var SandboxFsBridgeImpl = class {
	constructor(sandbox) {
		this.sandbox = sandbox;
		this.mounts = buildSandboxFsMounts(sandbox);
		const mountsByContainer = [...this.mounts].toSorted((a, b) => b.containerRoot.length - a.containerRoot.length);
		this.pathGuard = new SandboxFsPathGuard({
			mountsByContainer,
			runCommand: (script, options) => this.runCommand(script, options)
		});
	}
	resolvePath(params) {
		const target = this.resolveResolvedPath(params);
		return {
			hostPath: target.hostPath,
			relativePath: target.relativePath,
			containerPath: target.containerPath
		};
	}
	async readFile(params) {
		const target = this.resolveResolvedPath(params);
		return this.readPinnedFile(target, params.maxBytes);
	}
	async copyFile(params) {
		const source = this.resolveResolvedPath({
			filePath: params.sourcePath,
			cwd: params.cwd
		});
		const destination = this.resolveResolvedPath({
			filePath: params.destinationPath,
			cwd: params.cwd
		});
		this.ensureWriteAccess(destination, "copy files");
		const sourceCheck = {
			target: source,
			options: {
				action: "copy files",
				allowedType: "file"
			}
		};
		const destinationCheck = {
			target: destination,
			options: {
				action: "copy files",
				requireWritable: true
			}
		};
		await this.runCheckedCommand({
			...buildPinnedCopyPlan({
				sourceCheck,
				destinationCheck,
				source: await this.pathGuard.resolveAnchoredPinnedEntry(source, "copy files"),
				destination: await this.pathGuard.resolveAnchoredPinnedEntry(destination, "copy files"),
				mkdir: params.mkdir !== false
			}),
			signal: params.signal
		});
	}
	async writeFile(params) {
		const target = this.resolveResolvedPath(params);
		this.ensureWriteAccess(target, "write files");
		const writeCheck = {
			target,
			options: {
				action: "write files",
				requireWritable: true
			}
		};
		await this.pathGuard.assertPathSafety(target, writeCheck.options);
		const buffer = Buffer.isBuffer(params.data) ? params.data : Buffer.from(params.data, params.encoding ?? "utf8");
		const pinnedWriteTarget = await this.pathGuard.resolveAnchoredPinnedEntry(target, "write files");
		await this.runCheckedCommand({
			...buildPinnedWritePlan({
				check: writeCheck,
				pinned: pinnedWriteTarget,
				mkdir: params.mkdir !== false
			}),
			stdin: buffer,
			signal: params.signal
		});
	}
	async createFileExclusive(params) {
		const target = this.resolveResolvedPath(params);
		this.ensureWriteAccess(target, "create files");
		const createCheck = {
			target,
			options: {
				action: "create files",
				requireWritable: true
			}
		};
		await this.pathGuard.assertPathSafety(target, createCheck.options);
		const buffer = Buffer.isBuffer(params.data) ? params.data : Buffer.from(params.data, params.encoding ?? "utf8");
		const pinnedCreateTarget = await this.pathGuard.resolveAnchoredPinnedEntry(target, "create files");
		const result = await this.runCheckedCommand({
			...buildPinnedCreatePlan({
				check: createCheck,
				pinned: pinnedCreateTarget,
				mkdir: params.mkdir !== false
			}),
			allowFailure: true,
			stdin: buffer,
			signal: params.signal
		});
		if (result.code === 17) return "exists";
		if (result.code !== 0) throw new Error(`sandbox create failed for ${target.containerPath}: ${result.stderr.toString("utf8").trim()}`);
		return "created";
	}
	async mkdirp(params) {
		const target = this.resolveResolvedPath(params);
		this.ensureWriteAccess(target, "create directories");
		const mkdirCheck = {
			target,
			options: {
				action: "create directories",
				requireWritable: true,
				allowedType: "directory"
			}
		};
		await this.runCheckedCommand({
			...buildPinnedMkdirpPlan({
				check: mkdirCheck,
				pinned: this.pathGuard.resolvePinnedDirectoryEntry(target, "create directories")
			}),
			signal: params.signal
		});
	}
	async remove(params) {
		const target = this.resolveResolvedPath(params);
		this.ensureWriteAccess(target, "remove files");
		const removeCheck = {
			target,
			options: {
				action: "remove files",
				requireWritable: true
			}
		};
		await this.runCheckedCommand({
			...buildPinnedRemovePlan({
				check: removeCheck,
				pinned: this.pathGuard.resolvePinnedEntry(target, "remove files"),
				recursive: params.recursive,
				force: params.force
			}),
			signal: params.signal
		});
	}
	async rename(params) {
		const from = this.resolveResolvedPath({
			filePath: params.from,
			cwd: params.cwd
		});
		const to = this.resolveResolvedPath({
			filePath: params.to,
			cwd: params.cwd
		});
		this.ensureWriteAccess(from, "rename files");
		this.ensureWriteAccess(to, "rename files");
		const fromCheck = {
			target: from,
			options: {
				action: "rename files",
				requireWritable: true
			}
		};
		const toCheck = {
			target: to,
			options: {
				action: "rename files",
				requireWritable: true
			}
		};
		await this.runCheckedCommand({
			...buildPinnedRenamePlan({
				fromCheck,
				toCheck,
				from: this.pathGuard.resolvePinnedEntry(from, "rename files"),
				to: this.pathGuard.resolvePinnedEntry(to, "rename files")
			}),
			signal: params.signal
		});
	}
	async stat(params) {
		const target = this.resolveResolvedPath(params);
		const anchoredTarget = await this.pathGuard.resolveAnchoredSandboxEntry(target, "stat files");
		const result = await this.runPlannedCommand(buildStatPlan(target, anchoredTarget), params.signal);
		if (result.code !== 0) {
			const stderr = result.stderr.toString("utf8");
			if (stderr.includes("No such file or directory")) return null;
			const message = stderr.trim() || `stat failed with code ${result.code}`;
			throw new Error(`stat failed for ${target.containerPath}: ${message}`);
		}
		const [typeRaw, sizeRaw, mtimeRaw] = result.stdout.toString("utf8").trim().split("|");
		return {
			type: coerceStatType(typeRaw),
			size: parseSandboxStatSize(sizeRaw),
			mtimeMs: parseSandboxStatMtimeMs(mtimeRaw)
		};
	}
	async runCommand(script, options = {}) {
		const backend = this.sandbox.backend;
		if (backend) return await backend.runShellCommand({
			script,
			args: options.args,
			stdin: options.stdin,
			allowFailure: options.allowFailure,
			signal: options.signal
		});
		return await runDockerSandboxShellCommand({
			containerName: this.sandbox.containerName,
			script,
			args: options.args,
			stdin: options.stdin,
			allowFailure: options.allowFailure,
			signal: options.signal
		});
	}
	async readPinnedFile(target, maxBytes) {
		const opened = await this.pathGuard.openReadableFile(target);
		try {
			if (maxBytes === void 0) return fs.readFileSync(opened.fd);
			if (!Number.isSafeInteger(maxBytes) || maxBytes < 0) throw new RangeError("maxBytes must be a non-negative safe integer");
			const initialStat = fs.fstatSync(opened.fd);
			if (!initialStat.isFile()) throw new Error(`Sandbox read requires a regular file: ${target.containerPath}`);
			if (initialStat.size > maxBytes) throw new RangeError(`File exceeds ${maxBytes} bytes`);
			const data = readFileDescriptorBoundedSync(opened.fd, maxBytes);
			const finalStat = fs.fstatSync(opened.fd);
			if (!finalStat.isFile() || finalStat.size > maxBytes) throw new RangeError(`File exceeds ${maxBytes} bytes`);
			return data;
		} finally {
			fs.closeSync(opened.fd);
		}
	}
	async runCheckedCommand(plan) {
		await this.pathGuard.assertPathChecks(plan.checks);
		if (plan.recheckBeforeCommand) await this.pathGuard.assertPathChecks(plan.checks);
		return await this.runCommand(plan.script, {
			args: plan.args,
			stdin: plan.stdin,
			allowFailure: plan.allowFailure,
			signal: plan.signal
		});
	}
	async runPlannedCommand(plan, signal) {
		return await this.runCheckedCommand({
			...plan,
			signal
		});
	}
	ensureWriteAccess(target, action) {
		if (!allowsWrites(this.sandbox.workspaceAccess) || !target.writable) throw new Error(`Sandbox path is read-only; cannot ${action}: ${target.containerPath}`);
	}
	resolveResolvedPath(params) {
		return resolveSandboxFsPathWithMounts({
			filePath: params.filePath,
			cwd: params.cwd ?? this.sandbox.workspaceDir,
			defaultWorkspaceRoot: this.sandbox.workspaceDir,
			defaultContainerRoot: this.sandbox.containerWorkdir,
			mounts: this.mounts
		});
	}
};
function allowsWrites(access) {
	return access === "rw";
}
function coerceStatType(typeRaw) {
	if (!typeRaw) return "other";
	const normalized = normalizeOptionalLowercaseString(typeRaw) ?? "";
	if (normalized.includes("directory")) return "directory";
	if (normalized.includes("file")) return "file";
	return "other";
}
//#endregion
export { resolveWritableSandboxBindHostRoots as a, hasSandboxBindReadonlyHostShadows as i, buildSandboxFsMounts as n, hasSandboxBindContainerPathAliases as r, createSandboxFsBridge as t };
