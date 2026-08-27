import { r as formatErrorMessage } from "./errors-CqPTYU6G.js";
import { n as defaultSlotIdForKey } from "./slots-BTFPUFBt.js";
import { a as resolveDefaultPluginNpmDir, d as resolvePluginNpmProjectsDir, i as resolveDefaultPluginGitDir, o as resolvePluginInstallDir } from "./install-paths-Bp_9OgEZ.js";
import { r as runCommandWithTimeout } from "./exec-Cmwsxh9J.js";
import { o as createSafeNpmInstallEnv } from "./install-package-dir-C42XyOJV.js";
import { o as removePluginInstallOwnerFromConfig, r as resolveComparableUninstallPath, s as removePluginRuntimePolicyFromConfig, t as isUninstallPathInsideOrEqual } from "./uninstall-config-D8bR2yov.js";
import { r as resolvePluginPackageUninstallPlan } from "./uninstall-package-plan-DVdwa1CC.js";
import { Q as readOpenClawManagedNpmRootOverrides, t as classifyNpmManagedOverrideCompatibilityError, tt as syncManagedNpmRootPeerDependencies } from "./install-managed-npm-state-BFhK_f1u.js";
import { o as relinkOpenClawPeerDependenciesInManagedNpmRoot } from "./plugin-peer-link-oazrYpdj.js";
import { lstatSync } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region src/plugins/uninstall-managed-npm.ts
const MANAGED_NPM_PEER_CLEANUP_ARGS = [
	"npm",
	"install",
	"--omit=dev",
	"--omit=peer",
	"--loglevel=error",
	"--legacy-peer-deps",
	"--ignore-scripts",
	"--no-audit",
	"--no-fund"
];
async function pruneManagedNpmPeerDependenciesAfterUninstall(params) {
	const command = params.runCommand ?? runCommandWithTimeout;
	const commandOptions = {
		cwd: params.npmRoot,
		timeoutMs: 3e5,
		env: createSafeNpmInstallEnv(process.env, {
			legacyPeerDeps: true,
			npmConfigCwd: params.npmRoot,
			packageLock: true,
			quiet: true
		})
	};
	let overrideOmissions = {
		npmAliases: false,
		pnpmParentChildSelectors: false
	};
	const syncPeerDependencies = async () => await syncManagedNpmRootPeerDependencies({
		npmRoot: params.npmRoot,
		managedOverrides: params.managedOverrides,
		overrideOmissions,
		runCommand: command
	});
	if (!await syncPeerDependencies()) return;
	let cleanup = await command([...MANAGED_NPM_PEER_CLEANUP_ARGS], commandOptions);
	while (cleanup.code !== 0) {
		const compatibility = classifyNpmManagedOverrideCompatibilityError(cleanup);
		if (!compatibility) break;
		const nextOverrideOmissions = {
			npmAliases: overrideOmissions.npmAliases || compatibility.npmAliases,
			pnpmParentChildSelectors: overrideOmissions.pnpmParentChildSelectors || compatibility.pnpmParentChildSelectors
		};
		if (nextOverrideOmissions.npmAliases === overrideOmissions.npmAliases && nextOverrideOmissions.pnpmParentChildSelectors === overrideOmissions.pnpmParentChildSelectors) break;
		overrideOmissions = nextOverrideOmissions;
		await syncPeerDependencies();
		await syncPeerDependencies();
		cleanup = await command([...MANAGED_NPM_PEER_CLEANUP_ARGS], commandOptions);
	}
	if (cleanup.code === 0) return;
	return `Failed to prune managed peer dependencies after uninstalling ${params.packageName}: ${cleanup.stderr.trim() || cleanup.stdout.trim() || `npm exited with code ${cleanup.code}`}`;
}
//#endregion
//#region src/plugins/uninstall.ts
const UNINSTALL_ACTION_LABELS = {
	entry: "config entry",
	install: "install record",
	allowlist: "allowlist entry",
	denylist: "denylist entry",
	loadPath: "load path",
	memorySlot: "memory slot",
	contextEngineSlot: "context engine slot",
	channelConfig: "channel config",
	directory: "directory"
};
const UNINSTALL_ACTION_ORDER = [
	"entry",
	"install",
	"allowlist",
	"denylist",
	"loadPath",
	"memorySlot",
	"contextEngineSlot",
	"channelConfig",
	"directory"
];
function formatUninstallActionLabels(actions) {
	return UNINSTALL_ACTION_ORDER.flatMap((key) => actions[key] ? [UNINSTALL_ACTION_LABELS[key]] : []);
}
function hasUninstallAction(actions) {
	return Object.values(actions).some(Boolean);
}
function formatUninstallSlotResetPreview(slotKey) {
	return `${UNINSTALL_ACTION_LABELS[slotKey === "memory" ? "memorySlot" : "contextEngineSlot"]} (will reset to "${defaultSlotIdForKey(slotKey)}")`;
}
function resolveUninstallDirectoryTarget(params) {
	if (!params.hasInstall) return null;
	if (isLinkedPathInstallRecord(params.installRecord)) return null;
	const npmManagedInstall = resolveNpmManagedInstall({
		installRecord: params.installRecord,
		extensionsDir: params.extensionsDir
	});
	if (npmManagedInstall) return npmManagedInstall.installPath;
	const gitManagedInstall = resolveGitManagedInstall({
		installRecord: params.installRecord,
		extensionsDir: params.extensionsDir
	});
	if (gitManagedInstall) return gitManagedInstall.installPath;
	let defaultPath;
	try {
		defaultPath = resolvePluginInstallDir(params.pluginId, params.extensionsDir);
	} catch {
		return null;
	}
	const configuredPath = params.installRecord?.installPath;
	if (!configuredPath) return defaultPath;
	if (path.resolve(configuredPath) === path.resolve(defaultPath)) return configuredPath;
	if (params.extensionsDir && isUninstallPathInsideOrEqual(params.extensionsDir, configuredPath)) return configuredPath;
	const recordedManagedPath = resolveRecordedManagedInstallPath({
		pluginId: params.pluginId,
		installPath: configuredPath
	});
	if (recordedManagedPath) return recordedManagedPath;
	return defaultPath;
}
function resolveNpmManagedInstall(params) {
	const installPath = params.installRecord?.installPath?.trim();
	if (params.installRecord?.source !== "npm" || !installPath) return null;
	const npmRoots = /* @__PURE__ */ new Set();
	if (params.extensionsDir) npmRoots.add(path.join(path.dirname(path.resolve(params.extensionsDir)), "npm"));
	npmRoots.add(resolveDefaultPluginNpmDir());
	for (const npmRoot of npmRoots) {
		const nodeModulesRoot = path.join(npmRoot, "node_modules");
		if (isUninstallPathInsideOrEqual(nodeModulesRoot, installPath) && resolveComparableUninstallPath(nodeModulesRoot) !== resolveComparableUninstallPath(installPath)) {
			const packageName = resolveNpmPackageNameFromInstallPath({
				installPath,
				nodeModulesRoot
			});
			return packageName ? {
				installPath,
				npmRoot,
				packageName
			} : null;
		}
		const projectMatch = resolveNpmManagedProjectInstall({
			installPath,
			projectsDir: resolvePluginNpmProjectsDir(npmRoot)
		});
		if (projectMatch) return projectMatch;
	}
	return null;
}
function resolveNpmManagedProjectInstall(params) {
	if (!isUninstallPathInsideOrEqual(params.projectsDir, params.installPath) || resolveComparableUninstallPath(params.projectsDir) === resolveComparableUninstallPath(params.installPath)) return null;
	const segments = path.relative(path.resolve(params.projectsDir), path.resolve(params.installPath)).split(path.sep).filter(Boolean);
	if (segments.length < 3 || segments[1] !== "node_modules") return null;
	const npmRoot = path.join(params.projectsDir, segments[0] ?? "");
	const nodeModulesRoot = path.join(npmRoot, "node_modules");
	const packageName = resolveNpmPackageNameFromInstallPath({
		installPath: params.installPath,
		nodeModulesRoot
	});
	return packageName ? {
		installPath: params.installPath,
		npmRoot,
		packageName
	} : null;
}
function resolveNpmPackageNameFromInstallPath(params) {
	const relativePath = path.relative(path.resolve(params.nodeModulesRoot), path.resolve(params.installPath));
	if (!relativePath || relativePath.startsWith("..") || path.isAbsolute(relativePath)) return null;
	const segments = relativePath.split(path.sep).filter(Boolean);
	if (segments.length < 1) return null;
	if (segments[0]?.startsWith("@")) return segments.length >= 2 ? `${segments[0]}/${segments[1]}` : null;
	return segments[0] ?? null;
}
function resolveGitManagedInstall(params) {
	const installPath = params.installRecord?.installPath?.trim();
	if (params.installRecord?.source !== "git" || !installPath) return null;
	const gitRoots = /* @__PURE__ */ new Set();
	if (params.extensionsDir) gitRoots.add(path.join(path.dirname(path.resolve(params.extensionsDir)), "git"));
	gitRoots.add(resolveDefaultPluginGitDir());
	for (const gitRoot of gitRoots) if (isUninstallPathInsideOrEqual(gitRoot, installPath) && resolveComparableUninstallPath(gitRoot) !== resolveComparableUninstallPath(installPath)) return {
		installPath,
		parentDir: path.dirname(installPath)
	};
	return null;
}
function resolveRecordedManagedInstallPath(params) {
	const resolvedInstallPath = path.resolve(params.installPath);
	const recordedExtensionsDir = path.dirname(resolvedInstallPath);
	if (path.basename(recordedExtensionsDir) !== "extensions") return null;
	try {
		return path.resolve(resolvePluginInstallDir(params.pluginId, recordedExtensionsDir)) === resolvedInstallPath ? params.installPath : null;
	} catch {
		return null;
	}
}
function isLinkedPathInstallRecord(installRecord) {
	if (installRecord?.source !== "path") return false;
	if (!installRecord.sourcePath || !installRecord.installPath) return true;
	return resolveComparableUninstallPath(installRecord.sourcePath) === resolveComparableUninstallPath(installRecord.installPath);
}
/**
* Plan a plugin uninstall by removing it from config and resolving a safe file-removal target.
* Linked path plugins never have their source directory deleted. Copied path installs still remove
* their managed install directory.
*/
function planPluginUninstall(params) {
	const { config, pluginId, channelIds, deleteFiles = true, extensionsDir } = params;
	const packagePlan = resolvePluginPackageUninstallPlan(params);
	const runtimePluginIds = packagePlan?.runtimePluginIds ?? [pluginId];
	const entries = config.plugins?.entries ?? {};
	const installs = config.plugins?.installs ?? {};
	const hasEntry = runtimePluginIds.some((entryId) => Object.hasOwn(entries, entryId));
	const hasInstall = Object.hasOwn(installs, pluginId);
	const installRecord = hasInstall ? installs[pluginId] : void 0;
	const isLinked = isLinkedPathInstallRecord(installRecord);
	let newConfig = config;
	const configActions = {
		entry: false,
		install: false,
		allowlist: false,
		denylist: false,
		loadPath: false,
		memorySlot: false,
		contextEngineSlot: false,
		channelConfig: false
	};
	for (const configPluginId of new Set(runtimePluginIds)) {
		const removal = removePluginRuntimePolicyFromConfig(newConfig, configPluginId, {
			channelIds,
			loadPaths: packagePlan?.runtimeLoadPaths ? [...packagePlan.runtimeLoadPaths] : void 0
		});
		newConfig = removal.config;
		for (const key of Object.keys(configActions)) configActions[key] ||= removal.actions[key];
	}
	const ownerRemoval = removePluginInstallOwnerFromConfig(newConfig, pluginId);
	newConfig = ownerRemoval.config;
	for (const key of Object.keys(configActions)) configActions[key] ||= ownerRemoval.actions[key];
	if (!hasEntry && !hasInstall && !hasUninstallAction(configActions)) return {
		ok: false,
		error: `Plugin not found: ${pluginId}`
	};
	const actions = {
		...configActions,
		directory: false
	};
	const npmManagedInstall = deleteFiles && !isLinked ? resolveNpmManagedInstall({
		installRecord,
		extensionsDir
	}) : null;
	const gitManagedInstall = deleteFiles && !isLinked ? resolveGitManagedInstall({
		installRecord,
		extensionsDir
	}) : null;
	const deleteTarget = deleteFiles && !isLinked ? resolveUninstallDirectoryTarget({
		pluginId,
		hasInstall,
		installRecord,
		extensionsDir
	}) : null;
	return {
		ok: true,
		config: newConfig,
		pluginId,
		actions,
		directoryRemoval: deleteTarget ? {
			target: deleteTarget,
			...npmManagedInstall ? { cleanup: {
				kind: "npm",
				npmRoot: npmManagedInstall.npmRoot,
				packageName: npmManagedInstall.packageName
			} } : gitManagedInstall && deleteTarget === gitManagedInstall.installPath ? { cleanup: {
				kind: "git",
				parentDir: gitManagedInstall.parentDir
			} } : {}
		} : null
	};
}
function pluginUninstallTargetExists(target) {
	try {
		lstatSync(target);
		return true;
	} catch (error) {
		return error.code !== "ENOENT";
	}
}
async function applyPluginUninstallDirectoryRemoval(removal) {
	if (!removal) return {
		directoryRemoved: false,
		warnings: []
	};
	const existed = pluginUninstallTargetExists(removal.target);
	const warnings = [];
	if (!existed && removal.cleanup?.kind !== "npm") return {
		directoryRemoved: false,
		warnings
	};
	const npmCleanupManifestExists = removal.cleanup?.kind === "npm" ? await fs$1.access(path.join(removal.cleanup.npmRoot, "package.json")).then(() => true).catch(() => false) : false;
	if (!existed && removal.cleanup?.kind === "npm" && !npmCleanupManifestExists) return {
		directoryRemoved: false,
		warnings
	};
	if (removal.cleanup?.kind === "npm" && npmCleanupManifestExists) {
		const uninstall = await runCommandWithTimeout([
			"npm",
			"uninstall",
			"--loglevel=error",
			"--legacy-peer-deps",
			"--ignore-scripts",
			"--no-audit",
			"--no-fund",
			removal.cleanup.packageName
		], {
			cwd: removal.cleanup.npmRoot,
			timeoutMs: 3e5,
			env: createSafeNpmInstallEnv(process.env, {
				legacyPeerDeps: true,
				npmConfigCwd: removal.cleanup.npmRoot,
				packageLock: true,
				quiet: true
			})
		});
		if (uninstall.code !== 0) warnings.push(`Failed to prune npm dependencies for plugin package ${removal.cleanup.packageName}: ${uninstall.stderr.trim() || uninstall.stdout.trim() || `npm exited with code ${uninstall.code}`}`);
		try {
			const managedOverrides = await readOpenClawManagedNpmRootOverrides();
			const warning = await pruneManagedNpmPeerDependenciesAfterUninstall({
				npmRoot: removal.cleanup.npmRoot,
				packageName: removal.cleanup.packageName,
				managedOverrides
			});
			if (warning) warnings.push(warning);
		} catch (error) {
			warnings.push(`Failed to sync managed peer dependencies after uninstalling ${removal.cleanup.packageName}: ${formatErrorMessage(error)}`);
		}
		try {
			await relinkOpenClawPeerDependenciesInManagedNpmRoot({
				npmRoot: removal.cleanup.npmRoot,
				logger: { warn: (message) => warnings.push(message) }
			});
		} catch (error) {
			warnings.push(`Failed to repair managed npm peer links after uninstalling ${removal.cleanup.packageName}: ${formatErrorMessage(error)}`);
		}
	}
	try {
		await fs$1.rm(removal.target, {
			recursive: true,
			force: true
		});
		if (removal.cleanup?.kind === "git") try {
			await fs$1.rmdir(removal.cleanup.parentDir);
		} catch (error) {
			const code = error.code;
			if (code !== "ENOENT" && code !== "ENOTEMPTY") warnings.push(`Failed to remove empty git plugin install parent ${removal.cleanup.parentDir}: ${formatErrorMessage(error)}`);
		}
		return {
			directoryRemoved: existed,
			warnings
		};
	} catch (error) {
		return {
			directoryRemoved: false,
			warnings: [...warnings, `Failed to remove plugin directory ${removal.target}: ${formatErrorMessage(error)}`]
		};
	}
}
//#endregion
export { planPluginUninstall as a, formatUninstallSlotResetPreview as i, applyPluginUninstallDirectoryRemoval as n, pluginUninstallTargetExists as o, formatUninstallActionLabels as r, UNINSTALL_ACTION_LABELS as t };
