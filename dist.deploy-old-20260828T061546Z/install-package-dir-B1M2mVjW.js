import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { s as pathExists } from "./absolute-path-CYFPfAjt.js";
import "./fs-safe-CmrQUApq.js";
import { r as assertCanonicalPathWithinBase } from "./install-safe-path-DQTxRazZ.js";
import { t as movePathWithCopyFallback } from "./move-path-DwtBa1y6.js";
import "./replace-file-CLSCJ1qR.js";
import { c as tryReadJson, u as writeJson } from "./json-Dx6zyhjY.js";
import "./json-files-E5e5TtK3.js";
import { r as runCommandWithTimeout } from "./exec-D2kbpwdA.js";
import { i as createNpmProjectInstallEnv } from "./npm-install-env-DIasXTZP.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/infra/safe-package-install.ts
/**
* Creates a project-local npm install environment for untrusted package dirs.
* It disables lifecycle scripts, global/workspace leakage, prompts, and noisy
* npm features while preserving caller-supplied process env values.
*/
function createSafeNpmInstallEnv(env, options = {}) {
	const nextEnv = {
		...createNpmProjectInstallEnv(env, options),
		COREPACK_ENABLE_DOWNLOAD_PROMPT: "0",
		NPM_CONFIG_IGNORE_SCRIPTS: "true",
		npm_config_audit: "false",
		npm_config_fund: "false",
		npm_config_ignore_scripts: "true",
		npm_config_legacy_peer_deps: options.legacyPeerDeps ? "true" : "false",
		npm_config_package_lock: options.packageLock === true ? "true" : "false",
		npm_config_strict_peer_deps: "false",
		...options.packageLock === true ? { npm_config_save: "true" } : {},
		...options.ignoreWorkspaces ? { npm_config_workspaces: "false" } : {}
	};
	if (options.quiet) Object.assign(nextEnv, {
		npm_config_loglevel: "error",
		npm_config_progress: "false",
		npm_config_yes: "true"
	});
	return nextEnv;
}
/**
* Builds npm install argv that mirrors the safe environment defaults.
* Callers opt into dependency omission, legacy peer resolution, and quiet flags.
*/
function createSafeNpmInstallArgs(options = {}) {
	return [
		"install",
		...options.omitDev ? ["--omit=dev"] : [],
		...options.omitPeer ? ["--omit=peer"] : [],
		...options.legacyPeerDeps ? ["--legacy-peer-deps"] : [],
		...options.loglevel ? [`--loglevel=${options.loglevel}`] : [],
		"--ignore-scripts",
		...options.ignoreWorkspaces ? ["--workspaces=false"] : [],
		...options.noAudit ? ["--no-audit"] : [],
		...options.noFund ? ["--no-fund"] : []
	];
}
//#endregion
//#region src/infra/install-package-dir.ts
const DEFAULT_INSTALL_SOURCE_HARDLINKS = "reject";
const INSTALL_BASE_CHANGED_ERROR_MESSAGE = "install base directory changed during install";
const INSTALL_BASE_CHANGED_ABORT_WARNING = "Install base directory changed during install; aborting staged publish.";
const INSTALL_BASE_CHANGED_BACKUP_WARNING = "Install base directory changed before backup cleanup; leaving backup in place.";
const STAGED_NPM_PROJECT_CONFIG_NAME = ".npmrc";
const STAGED_NPM_PROJECT_CONFIG_PREFIX = ".openclaw-install-hidden-npmrc-";
async function sanitizeManifestForNpmInstall(targetDir) {
	const manifestPath = path.join(targetDir, "package.json");
	const parsed = await tryReadJson(manifestPath);
	if (!isRecord(parsed)) return;
	const manifest = parsed;
	const devDependencies = manifest.devDependencies;
	if (!isRecord(devDependencies)) return;
	const filteredEntries = Object.entries(devDependencies).filter(([, rawSpec]) => {
		return !(typeof rawSpec === "string" ? rawSpec.trim() : "").startsWith("workspace:");
	});
	if (filteredEntries.length === Object.keys(devDependencies).length) return;
	if (filteredEntries.length === 0) delete manifest.devDependencies;
	else manifest.devDependencies = Object.fromEntries(filteredEntries);
	await writeJson(manifestPath, manifest, { trailingNewline: true });
}
function formatNpmDependencyInstallFailure(result) {
	const detail = result.stderr.trim() || result.stdout.trim();
	if (detail) return detail;
	if (result.code !== null) return `exit code ${result.code} (no output from npm)`;
	if (result.signal) return `signal ${result.signal} (no output from npm)`;
	return `termination ${result.termination} (no output from npm)`;
}
async function hideProjectNpmConfigForInstall(targetDir) {
	const originalPath = path.join(targetDir, STAGED_NPM_PROJECT_CONFIG_NAME);
	let hiddenDir = "";
	try {
		hiddenDir = await fs.mkdtemp(path.join(targetDir, STAGED_NPM_PROJECT_CONFIG_PREFIX));
		const hiddenPath = path.join(hiddenDir, STAGED_NPM_PROJECT_CONFIG_NAME);
		await fs.rename(originalPath, hiddenPath);
		return {
			hiddenDir,
			originalPath,
			hiddenPath
		};
	} catch (error) {
		if (hiddenDir) await fs.rm(hiddenDir, {
			recursive: true,
			force: true
		}).catch(() => void 0);
		if (error.code === "ENOENT") return null;
		throw error;
	}
}
async function restoreProjectNpmConfigAfterInstall(hiddenConfig) {
	if (!hiddenConfig) return;
	await fs.rename(hiddenConfig.hiddenPath, hiddenConfig.originalPath);
	await fs.rm(hiddenConfig.hiddenDir, {
		recursive: true,
		force: true
	});
}
async function assertInstallBoundaryPaths(params) {
	for (const candidatePath of params.candidatePaths) await assertCanonicalPathWithinBase({
		baseDir: params.installBaseDir,
		candidatePath,
		boundaryLabel: "install directory"
	});
}
function isRelativePathInsideBase(relativePath) {
	return Boolean(relativePath) && relativePath !== ".." && !relativePath.startsWith(`..${path.sep}`);
}
function isInstallBaseChangedError(error) {
	return error instanceof Error && error.message === INSTALL_BASE_CHANGED_ERROR_MESSAGE;
}
function resolveMoveSourceHardlinks(policy) {
	return policy === "package-manager" ? "allow" : "reject";
}
async function assertInstallBaseStable(params) {
	if (!(await fs.stat(params.installBaseDir)).isDirectory()) throw new Error(INSTALL_BASE_CHANGED_ERROR_MESSAGE);
	if (await fs.realpath(params.installBaseDir) !== params.expectedRealPath) throw new Error(INSTALL_BASE_CHANGED_ERROR_MESSAGE);
}
async function cleanupInstallTempDir(dirPath) {
	if (!dirPath) return;
	await fs.rm(dirPath, {
		recursive: true,
		force: true
	}).catch(() => void 0);
}
async function resolveInstallPublishTarget(params) {
	const installBaseResolved = path.resolve(params.installBaseDir);
	const targetResolved = path.resolve(params.targetDir);
	const targetRelativePath = path.relative(installBaseResolved, targetResolved);
	if (!isRelativePathInsideBase(targetRelativePath)) throw new Error("invalid install target path");
	const installBaseRealPath = await fs.realpath(params.installBaseDir);
	return {
		installBaseRealPath,
		canonicalTargetDir: path.join(installBaseRealPath, targetRelativePath)
	};
}
const PACKAGE_DIR_INSTALL_TRANSACTION = Symbol.for("openclaw.packageDirInstallTransaction");
const PACKAGE_DIR_INSTALL_TRANSACTION_REQUEST = Symbol.for("openclaw.packageDirInstallTransactionRequest");
function requestDeferredPackageDirInstall(params) {
	Object.defineProperty(params, PACKAGE_DIR_INSTALL_TRANSACTION_REQUEST, {
		configurable: false,
		enumerable: true,
		value: true
	});
	return params;
}
function isPackageDirInstallCommitDeferred(params) {
	return params[PACKAGE_DIR_INSTALL_TRANSACTION_REQUEST] === true;
}
function attachPackageDirInstallTransaction(result, transaction) {
	Object.defineProperty(result, PACKAGE_DIR_INSTALL_TRANSACTION, {
		configurable: false,
		enumerable: true,
		value: transaction
	});
	return result;
}
function resolvePackageDirInstallTransaction(result) {
	return result[PACKAGE_DIR_INSTALL_TRANSACTION];
}
/**
* Publishes a package directory into an install target via a staged copy.
* Update mode backs up the existing target, runs optional validation hooks,
* and rolls back when copy, dependency install, or validation fails.
*/
async function installPackageDir(params) {
	const deferCommit = isPackageDirInstallCommitDeferred(params);
	params.logger?.info?.(`Installing to ${params.targetDir}…`);
	const installBaseDir = path.dirname(params.targetDir);
	let initialInstallBaseRealPath;
	try {
		await fs.mkdir(installBaseDir, { recursive: true });
		initialInstallBaseRealPath = await fs.realpath(installBaseDir);
		await assertInstallBoundaryPaths({
			installBaseDir,
			candidatePaths: [params.targetDir]
		});
	} catch (err) {
		return {
			ok: false,
			error: `${params.copyErrorPrefix}: ${String(err)}`
		};
	}
	let installBaseRealPath;
	let canonicalTargetDir;
	try {
		({installBaseRealPath, canonicalTargetDir} = await resolveInstallPublishTarget({
			installBaseDir,
			targetDir: params.targetDir
		}));
		if (installBaseRealPath !== initialInstallBaseRealPath) throw new Error(INSTALL_BASE_CHANGED_ERROR_MESSAGE);
	} catch (err) {
		if (isInstallBaseChangedError(err)) params.logger?.warn?.(INSTALL_BASE_CHANGED_ABORT_WARNING);
		return {
			ok: false,
			error: `${params.copyErrorPrefix}: ${String(err)}`
		};
	}
	let stageDir = null;
	let backupDir = null;
	const sourceHardlinks = resolveMoveSourceHardlinks(params.sourceHardlinks ?? DEFAULT_INSTALL_SOURCE_HARDLINKS);
	const fail = async (error, cause) => {
		const installBaseChanged = isInstallBaseChangedError(cause);
		let restoreError;
		if (installBaseChanged) params.logger?.warn?.(INSTALL_BASE_CHANGED_ABORT_WARNING);
		else {
			restoreError = await restoreBackup();
			if (stageDir) {
				await cleanupInstallTempDir(stageDir);
				stageDir = null;
			}
		}
		return {
			ok: false,
			error: restoreError ? `${error}; could not restore existing install: ${restoreError}` : error
		};
	};
	const restoreBackup = async () => {
		if (!backupDir) return;
		try {
			await movePathWithCopyFallback({
				from: backupDir,
				sourceHardlinks,
				to: canonicalTargetDir
			});
			backupDir = null;
			return;
		} catch (error) {
			return String(error);
		}
	};
	try {
		await assertInstallBoundaryPaths({
			installBaseDir: installBaseRealPath,
			candidatePaths: [canonicalTargetDir]
		});
		stageDir = await fs.mkdtemp(path.join(installBaseRealPath, ".openclaw-install-stage-"));
		await fs.cp(params.sourceDir, stageDir, {
			recursive: true,
			verbatimSymlinks: true
		});
	} catch (err) {
		return await fail(`${params.copyErrorPrefix}: ${String(err)}`, err);
	}
	try {
		await params.afterCopy?.(stageDir);
	} catch (err) {
		return await fail(`post-copy validation failed: ${String(err)}`, err);
	}
	if (params.hasDeps) try {
		await sanitizeManifestForNpmInstall(stageDir);
		const hiddenProjectNpmConfig = await hideProjectNpmConfigForInstall(stageDir);
		params.logger?.info?.(params.depsLogMessage);
		const npmRes = await (async () => {
			try {
				return await runCommandWithTimeout(["npm", ...createSafeNpmInstallArgs({
					omitDev: true,
					loglevel: "error"
				})], {
					timeoutMs: Math.max(params.timeoutMs, 3e5),
					cwd: stageDir,
					env: createSafeNpmInstallEnv(process.env, { npmConfigCwd: stageDir })
				});
			} finally {
				await restoreProjectNpmConfigAfterInstall(hiddenProjectNpmConfig);
			}
		})();
		if (npmRes.code !== 0) return await fail(`npm install failed: ${formatNpmDependencyInstallFailure(npmRes)}`);
	} catch (error) {
		return await fail(`npm install failed: ${String(error)}`, error);
	}
	if (params.afterInstall) try {
		const postInstallResult = await params.afterInstall(stageDir);
		if (!postInstallResult.ok) {
			const failed = await fail(postInstallResult.error);
			return {
				...postInstallResult,
				error: failed.error
			};
		}
	} catch (err) {
		return await fail(`post-install validation failed: ${String(err)}`, err);
	}
	if (params.mode === "update" && await pathExists(canonicalTargetDir)) {
		const backupRoot = path.join(installBaseRealPath, ".openclaw-install-backups");
		backupDir = path.join(backupRoot, `${path.basename(canonicalTargetDir)}-${Date.now()}`);
		try {
			await fs.mkdir(backupRoot, { recursive: true });
			await assertInstallBoundaryPaths({
				installBaseDir: installBaseRealPath,
				candidatePaths: [backupDir]
			});
			await assertInstallBaseStable({
				installBaseDir,
				expectedRealPath: installBaseRealPath
			});
			await movePathWithCopyFallback({
				from: canonicalTargetDir,
				sourceHardlinks,
				to: backupDir
			});
		} catch (err) {
			return await fail(`${params.copyErrorPrefix}: ${String(err)}`, err);
		}
	}
	if (backupDir && params.afterBackup) try {
		const backupResult = await params.afterBackup(backupDir);
		if (!backupResult.ok) {
			const failed = await fail(backupResult.error);
			return {
				...backupResult,
				error: failed.error
			};
		}
	} catch (err) {
		return await fail(`backup validation failed: ${String(err)}`, err);
	}
	try {
		await assertInstallBaseStable({
			installBaseDir,
			expectedRealPath: installBaseRealPath
		});
		await movePathWithCopyFallback({
			from: stageDir,
			sourceHardlinks,
			to: canonicalTargetDir
		});
		stageDir = null;
	} catch (err) {
		return await fail(`${params.copyErrorPrefix}: ${String(err)}`, err);
	}
	if (backupDir) try {
		await assertInstallBaseStable({
			installBaseDir,
			expectedRealPath: installBaseRealPath
		});
	} catch (err) {
		if (isInstallBaseChangedError(err)) params.logger?.warn?.(INSTALL_BASE_CHANGED_BACKUP_WARNING);
		backupDir = null;
	}
	const retainedBackupDir = backupDir;
	if (backupDir && !deferCommit) await fs.rm(backupDir, {
		recursive: true,
		force: true
	}).catch(() => void 0);
	if (stageDir) await cleanupInstallTempDir(stageDir);
	if (!deferCommit) return { ok: true };
	let settled = false;
	return attachPackageDirInstallTransaction({ ok: true }, {
		async commit() {
			if (settled) return;
			settled = true;
			if (retainedBackupDir) await fs.rm(retainedBackupDir, {
				recursive: true,
				force: true
			}).catch(() => void 0);
		},
		async rollback() {
			if (settled) return;
			settled = true;
			await fs.rm(canonicalTargetDir, {
				recursive: true,
				force: true
			});
			if (retainedBackupDir) await movePathWithCopyFallback({
				from: retainedBackupDir,
				sourceHardlinks,
				to: canonicalTargetDir
			});
		}
	});
}
/**
* Installs a manifest-backed package directory while deriving whether npm
* dependencies must be installed and which hardlink policy is safe to use.
*/
async function installPackageDirWithManifestDeps(params) {
	const hasDeps = Object.keys(params.manifestDependencies ?? {}).length > 0;
	return installPackageDir({
		...params,
		hasDeps,
		sourceHardlinks: hasDeps ? "package-manager" : "reject"
	});
}
//#endregion
export { createSafeNpmInstallArgs as a, resolvePackageDirInstallTransaction as i, installPackageDirWithManifestDeps as n, createSafeNpmInstallEnv as o, requestDeferredPackageDirInstall as r, installPackageDir as t };
