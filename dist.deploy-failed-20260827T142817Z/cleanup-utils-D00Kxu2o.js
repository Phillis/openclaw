import { a as isPathInside } from "./path-D138yf8v.js";
import "./path-guards-fBZukd5S.js";
import { f as resolveHomeDir, p as shortenHomeInString } from "./utils-DEqefz4f.js";
import { a as listAgentIds, d as resolveAgentWorkspaceDir } from "./agent-scope-config-BdXMWufB.js";
import { n as resolveDefaultAgentWorkspaceDir } from "./workspace-default-kpBt4Iki.js";
import { i as deleteWorkspaceState, s as prepareWorkspaceStateDeletion } from "./workspace-state-store-UQmL7k4K.js";
import { c as prepareLegacyWorkspaceStateReset, l as removeLegacyWorkspaceStateForReset } from "./workspace-legacy-state-DZx3hw9m.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/commands/cleanup-utils.ts
function collectWorkspaceDirs(cfg) {
	const dirs = /* @__PURE__ */ new Set();
	if (!cfg) {
		dirs.add(resolveDefaultAgentWorkspaceDir());
		return [...dirs];
	}
	for (const agentId of listAgentIds(cfg)) dirs.add(resolveAgentWorkspaceDir(cfg, agentId));
	return [...dirs];
}
/** Determine which config, credential, and workspace paths cleanup should consider. */
function buildCleanupPlan(params) {
	return {
		configInsideState: isPathWithin(params.configPath, params.stateDir),
		oauthInsideState: isPathWithin(params.oauthDir, params.stateDir),
		workspaceDirs: collectWorkspaceDirs(params.cfg)
	};
}
/** Return true when `child` resolves inside `parent`. */
function isPathWithin(child, parent) {
	return isPathInside(parent, child);
}
function isUnsafeRemovalTarget(target) {
	if (!target.trim()) return true;
	const resolved = path.resolve(target);
	if (resolved === path.parse(resolved).root) return true;
	const home = resolveHomeDir();
	if (home && resolved === path.resolve(home)) return true;
	if (isPathWithin(path.resolve(process.cwd()), resolved)) return true;
	return false;
}
/** Remove one path after rejecting empty/root/home targets and honoring dry-run mode. */
async function removePath(target, runtime, opts) {
	if (!target?.trim()) return {
		ok: false,
		skipped: true
	};
	const resolved = path.resolve(target);
	const displayLabel = shortenHomeInString(opts?.label ?? resolved);
	if (isUnsafeRemovalTarget(resolved)) {
		runtime.error(`Refusing to remove unsafe path: ${displayLabel}`);
		return { ok: false };
	}
	if (opts?.dryRun) {
		runtime.log(`[dry-run] remove ${displayLabel}`);
		return {
			ok: true,
			skipped: true
		};
	}
	try {
		await fs.rm(resolved, {
			recursive: true,
			force: true
		});
		runtime.log(`Removed ${displayLabel}`);
		return { ok: true };
	} catch (err) {
		runtime.error(`Failed to remove ${displayLabel}: ${String(err)}`);
		return { ok: false };
	}
}
async function existingPaths(paths) {
	const existing = [];
	for (const target of paths) {
		if (!target?.trim()) continue;
		const resolved = path.resolve(target);
		try {
			await fs.lstat(resolved);
			existing.push(resolved);
		} catch {}
	}
	return existing;
}
function shouldPreservePath(target, preservePaths) {
	return preservePaths.some((preservePath) => isPathWithin(target, preservePath));
}
function pathContainsPreservedPath(target, preservePaths) {
	return preservePaths.some((preservePath) => isPathWithin(preservePath, target));
}
async function removePathPreserving(target, preservePaths, runtime, opts) {
	if (!target?.trim()) return {
		ok: false,
		skipped: true
	};
	const resolved = path.resolve(target);
	const displayLabel = shortenHomeInString(opts?.label ?? resolved);
	if (isUnsafeRemovalTarget(resolved)) {
		runtime.error(`Refusing to remove unsafe path: ${displayLabel}`);
		return { ok: false };
	}
	if (shouldPreservePath(resolved, preservePaths)) return {
		ok: true,
		skipped: true
	};
	if (!pathContainsPreservedPath(resolved, preservePaths)) return removePath(resolved, runtime, opts);
	if (opts?.dryRun) {
		const preserved = preservePaths.filter((preservePath) => isPathWithin(preservePath, resolved)).map((preservePath) => shortenHomeInString(preservePath)).join(", ");
		runtime.log(`[dry-run] remove ${displayLabel} preserving ${preserved}`);
		return {
			ok: true,
			skipped: true
		};
	}
	try {
		if (!(await fs.lstat(resolved)).isDirectory()) return removePath(resolved, runtime, opts);
		const entries = await fs.readdir(resolved);
		for (const entry of entries) await removePathPreserving(path.join(resolved, entry), preservePaths, runtime);
		runtime.log(`Removed contents of ${displayLabel}`);
		return { ok: true };
	} catch (err) {
		runtime.error(`Failed to remove ${displayLabel}: ${String(err)}`);
		return { ok: false };
	}
}
/** Remove state plus config/OAuth paths, preserving selected paths nested inside state. */
async function removeStateAndLinkedPaths(cleanup, runtime, opts) {
	const stateDir = path.resolve(cleanup.stateDir);
	const preservePaths = (opts?.dryRun ? (opts.preservePaths ?? []).map((target) => path.resolve(target)) : await existingPaths(opts?.preservePaths ?? [])).filter((target) => isPathWithin(target, stateDir));
	const stateRemoval = preservePaths.length > 0 ? await removePathPreserving(stateDir, preservePaths, runtime, {
		dryRun: opts?.dryRun,
		label: cleanup.stateDir
	}) : await removePath(cleanup.stateDir, runtime, {
		dryRun: opts?.dryRun,
		label: cleanup.stateDir
	});
	if (!cleanup.configInsideState) await removePath(cleanup.configPath, runtime, {
		dryRun: opts?.dryRun,
		label: cleanup.configPath
	});
	if (!cleanup.oauthInsideState) await removePath(cleanup.oauthDir, runtime, {
		dryRun: opts?.dryRun,
		label: cleanup.oauthDir
	});
	return stateRemoval.ok;
}
/** Remove all workspace directories selected by the cleanup plan. */
async function removeWorkspaceDirs(workspaceDirs, runtime, opts) {
	const failures = /* @__PURE__ */ new Set();
	const attempt = async (label, action) => {
		try {
			return await action();
		} catch (error) {
			failures.add(label);
			runtime.error?.(`Failed to clean up ${shortenHomeInString(label)}: ${String(error)}`);
			return;
		}
	};
	for (const workspace of workspaceDirs) {
		const legacyLabel = `${workspace} (retired workspace state)`;
		const stateLabel = `${workspace} (workspace state)`;
		const legacyPlan = await attempt(legacyLabel, () => prepareLegacyWorkspaceStateReset(workspace));
		const statePlan = opts?.removeStateRows ? await attempt(stateLabel, () => prepareWorkspaceStateDeletion(workspace)) : void 0;
		if (!(opts?.removeWorkspace ? { ok: await attempt(workspace, () => opts.removeWorkspace(workspace)) === true } : await removePath(workspace, runtime, {
			dryRun: opts?.dryRun,
			label: workspace
		})).ok) {
			failures.add(workspace);
			continue;
		}
		if (legacyPlan) {
			const legacyCleanup = await attempt(legacyLabel, () => removeLegacyWorkspaceStateForReset(legacyPlan, opts?.dryRun ? { dryRun: true } : void 0));
			if (legacyCleanup) {
				if (opts?.dryRun) for (const removedPath of legacyCleanup.removedPaths) runtime.log(`[dry-run] remove ${shortenHomeInString(removedPath)}`);
				for (const warning of legacyCleanup.warnings) {
					(opts?.removeWorkspace ? runtime.log : runtime.error)(warning);
					failures.add(warning);
				}
			}
		}
		if (!opts?.dryRun && statePlan) await attempt(stateLabel, () => {
			deleteWorkspaceState(statePlan);
		});
	}
	return [...failures];
}
/** List per-agent session directories beneath a state directory. */
async function listAgentSessionDirs(stateDir) {
	const root = path.join(stateDir, "agents");
	try {
		return (await fs.readdir(root, { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => path.join(root, entry.name, "sessions"));
	} catch (error) {
		if (error.code === "ENOENT") return [];
		throw error;
	}
}
//#endregion
export { removeStateAndLinkedPaths as a, removePath as i, isPathWithin as n, removeWorkspaceDirs as o, listAgentSessionDirs as r, buildCleanupPlan as t };
