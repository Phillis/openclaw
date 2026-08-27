import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { t as packageNameMatchesId } from "./install-safe-path-Blov4TZi.js";
import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import "./utils-DEqefz4f.js";
import { n as compareValidSemver } from "./semver-aYpwYdrQ.js";
import { a as isPrereleaseResolutionAllowed, l as validateRegistryNpmSpec, n as formatPrereleaseResolutionError, o as isPrereleaseSemverVersion, r as isExactSemverVersion, s as parseRegistryNpmSpec, t as compareOpenClawReleaseVersions } from "./npm-registry-spec-D3pNhy09.js";
import { a as resolveDefaultPluginNpmDir, f as safePluginInstallFileName, n as matchesExpectedPluginId, p as validatePluginId, t as encodePluginInstallDirName } from "./install-paths-BYSW9x3z.js";
import { r as validatePackageExtensionEntriesForInstall } from "./package-entry-resolution-DRFlLs_0.js";
import { o as sha256HexPrefixCore } from "./crypto-digest-PR8Utwzg.js";
import { r as hasRetainedManagedNpmInstallMarker } from "./managed-npm-retention-Ic2evivm.js";
import { r as runCommandWithTimeout } from "./exec-BL80Wdzl.js";
import { a as resolveNpmPackArchiveMetadata, n as createNpmMetadataEnv, o as resolveNpmSpecMetadata } from "./install-source-utils-DqwMuR5d.js";
import { a as createSafeNpmInstallArgs, o as createSafeNpmInstallEnv } from "./install-package-dir-CBvlaFS_.js";
import { r as preflightPluginNpmInstallPolicy } from "./install-security-scan-Ix-vNSaq.js";
import { $ as repairManagedNpmRootOpenClawPeer, A as resolveEffectiveInstallMode, C as ensureInstallTargetAvailableForMode, D as installPluginDirectoryIntoExtensions, E as hasPackageRuntimeDependencies, F as validateOpenClawPackageInstallCompatibility, H as copyPluginInstallTransactionRequest, M as runInstallSourceScan, N as sourceFamilyForInstallPolicyKind, O as loadPluginInstallRuntime, P as sourceFamilyForInstallPolicySource, Q as readOpenClawManagedNpmRootOverrides, S as emitSuccessfulPluginInstallSecurityEvent, T as formatUnresolvedOpenClawPeerLinkError, U as isPluginInstallCommitDeferred, V as attachPluginInstallTransaction, X as readManagedNpmRootInstalledDependency, Y as listMissingRequiredPlatformPackages, Z as readManagedNpmRootPeerDependencySnapshot, _ as resolveRequiredPlatformPackageNames, a as formatManagedNpmProjectQuarantineArtifacts, b as buildDirectoryInstallResult, c as listManagedNpmRootPackageNames, d as removeEmptyDirectoryIfPresent, et as resolveManagedNpmRootDependencySpec, f as resolveManagedNpmGenerationUseForInstall, g as resolveManagedNpmRootPackageDir, h as resolveManagedNpmRootForInstall, i as createManagedNpmPluginInstallRollbackSnapshot, j as resolvePreparedDirectoryInstallTarget, k as readOptionalPackageManifest, l as listNewManagedNpmRootPackageDirs, m as resolveManagedNpmRootDependencySpecForInstall, n as cleanupManagedNpmPluginInstallRollbackSnapshot, nt as upsertManagedNpmRootDependency, o as formatNpmCommandFailureOutput, p as resolveManagedNpmInstallRoot, r as cleanupManagedNpmRootPreparedDependency, s as isManagedNpmProjectCorruptionInstallFailure, t as classifyNpmManagedOverrideCompatibilityError, tt as syncManagedNpmRootPeerDependencies, u as quarantineManagedNpmProjectRebuildArtifacts, v as rollbackManagedNpmPluginInstall, w as ensureOpenClawExtensions, x as defaultLogger, y as rollbackManagedNpmRootPreparedDependency, z as PLUGIN_INSTALL_ERROR_CODE } from "./install-managed-npm-state-Jj1GJhPR.js";
import { i as linkOpenClawPeerDependencies, o as relinkOpenClawPeerDependenciesInManagedNpmRoot, t as auditDeclaredOpenClawHostDependency } from "./plugin-peer-link-OdEF4u-i.js";
import { t as resolveNpmIntegrityDriftWithDefaultMessage } from "./npm-integrity-DwDjKpwi.js";
import { n as inspectBundlePluginArtifact, r as inspectNativePluginArtifact } from "./install-artifact-inspection-DFeoJtJW.js";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/plugins/install-installed-package.ts
async function validatePackagePluginInstallSource(params) {
	const manifestResult = params.manifest ? {
		ok: true,
		manifest: params.manifest
	} : await readOptionalPackageManifest({
		runtime: params.runtime,
		packageDir: params.packageDir
	});
	if (!manifestResult.ok) return manifestResult;
	const manifest = manifestResult.manifest;
	if (!manifest) return {
		ok: false,
		error: "extracted package missing package.json"
	};
	const pkgName = normalizeOptionalString(manifest.name) ?? "";
	const npmPluginId = pkgName || "plugin";
	const ocManifestResult = params.runtime.loadPluginManifest(params.packageDir);
	if (!ocManifestResult.ok && params.requirePluginManifest) return {
		ok: false,
		error: `package missing valid openclaw.plugin.json: ${ocManifestResult.error}`,
		code: PLUGIN_INSTALL_ERROR_CODE.MISSING_PLUGIN_MANIFEST
	};
	const manifestPluginId = ocManifestResult.ok && ocManifestResult.manifest.id ? ocManifestResult.manifest.id.trim() : void 0;
	const pluginId = manifestPluginId ?? npmPluginId;
	const pluginIdError = validatePluginId(pluginId);
	if (pluginIdError) return {
		ok: false,
		error: pluginIdError
	};
	if (!matchesExpectedPluginId({
		expectedPluginId: params.expectedPluginId,
		pluginId,
		manifestPluginId,
		npmPluginId
	})) return {
		ok: false,
		error: `plugin id mismatch: expected ${params.expectedPluginId}, got ${pluginId}`,
		code: PLUGIN_INSTALL_ERROR_CODE.PLUGIN_ID_MISMATCH
	};
	if (manifestPluginId && !packageNameMatchesId(npmPluginId, manifestPluginId)) params.logger.info?.(`Plugin manifest id "${manifestPluginId}" differs from npm package name "${npmPluginId}"; using manifest id as the config key.`);
	const packageMetadata = params.runtime.getPackageManifestMetadata(manifest);
	const compatibilityError = validateOpenClawPackageInstallCompatibility({
		runtime: params.runtime,
		pluginId,
		packageMetadata
	});
	if (compatibilityError) return compatibilityError;
	const extensionsResult = ensureOpenClawExtensions({ manifest });
	if (!extensionsResult.ok) return {
		ok: false,
		error: extensionsResult.error,
		code: extensionsResult.code
	};
	const extensions = extensionsResult.entries;
	const extensionValidation = await validatePackageExtensionEntriesForInstall({
		packageDir: params.packageDir,
		extensions,
		manifest,
		allowSourceTypeScriptEntries: params.allowSourceTypeScriptEntries
	});
	if (!extensionValidation.ok) return {
		ok: false,
		error: extensionValidation.error,
		code: PLUGIN_INSTALL_ERROR_CODE.INVALID_OPENCLAW_EXTENSIONS
	};
	const scanMode = params.resolveEffectiveMode ? await params.resolveEffectiveMode(pluginId) : params.mode;
	const scanResult = await runInstallSourceScan({
		subject: `Plugin "${pluginId}"`,
		pluginId,
		mode: scanMode,
		sourceFamily: sourceFamilyForInstallPolicySource(params.installPolicyRequest?.source, sourceFamilyForInstallPolicyKind(params.installPolicyRequest?.kind, "installed-package")),
		scan: async () => await params.runtime.scanPackageInstallSource({
			dangerouslyForceUnsafeInstall: params.dangerouslyForceUnsafeInstall,
			onInstallPolicyWarning: params.onInstallPolicyWarning,
			trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
			packageDir: params.packageDir,
			config: params.config,
			pluginId,
			logger: params.logger,
			extensions,
			requestKind: params.installPolicyRequest?.kind,
			requestedSpecifier: params.installPolicyRequest?.requestedSpecifier,
			source: params.installPolicyRequest?.source,
			mode: scanMode,
			packageName: pkgName || void 0,
			manifestId: manifestPluginId,
			version: typeof manifest.version === "string" ? manifest.version : void 0
		})
	});
	if (scanResult) return scanResult;
	return {
		ok: true,
		plugin: {
			manifest,
			pluginId,
			manifestName: pkgName || void 0,
			version: typeof manifest.version === "string" ? manifest.version : void 0,
			extensions,
			...ocManifestResult.ok && ocManifestResult.manifest.setup ? { setup: ocManifestResult.manifest.setup } : {},
			hasRuntimeDependencies: hasPackageRuntimeDependencies(manifest),
			peerDependencies: {
				...manifest.dependencies,
				...manifest.peerDependencies
			}
		}
	};
}
async function scanAndLinkInstalledPackage(params) {
	const scanResult = await runInstallSourceScan({
		subject: `Plugin "${params.pluginId}"`,
		pluginId: params.pluginId,
		mode: params.mode,
		sourceFamily: sourceFamilyForInstallPolicySource(params.source, sourceFamilyForInstallPolicyKind(params.requestKind, "installed-package")),
		scan: async () => await params.runtime.scanInstalledPackageDependencyTree({
			...params.additionalDependencyPackageDirs ? { additionalPackageDirs: params.additionalDependencyPackageDirs } : {},
			allowManagedNpmRootPackagePeerSymlinks: params.dependencyScanRootDir !== void 0 && path.resolve(params.dependencyScanRootDir) !== path.resolve(params.installedDir),
			onInstallPolicyWarning: params.onInstallPolicyWarning,
			dependencyScanRootDir: params.dependencyScanRootDir,
			logger: params.logger,
			mode: params.mode,
			packageDir: params.installedDir,
			pluginId: params.pluginId,
			config: params.config,
			...params.requestKind ? { requestKind: params.requestKind } : {},
			requestedSpecifier: params.requestedSpecifier,
			source: params.source,
			trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall
		})
	});
	if (scanResult) return scanResult;
	if ((await linkOpenClawPeerDependencies({
		installedDir: params.installedDir,
		peerDependencies: params.peerDependencies,
		logger: params.logger
	})).skipped > 0) return {
		ok: false,
		error: formatUnresolvedOpenClawPeerLinkError(params.pluginId)
	};
	return null;
}
async function installPluginFromInstalledPackageDir(params) {
	return await installPluginFromInstalledPackageDirInternal(params);
}
async function installPluginFromInstalledPackageDirInternal(params) {
	const runtime = await loadPluginInstallRuntime();
	const { logger } = runtime.resolveTimedInstallModeOptions(params, defaultLogger);
	const validated = await validatePackagePluginInstallSource({
		runtime,
		packageDir: params.packageDir,
		expectedPluginId: params.expectedPluginId,
		requirePluginManifest: params.requirePluginManifest,
		allowSourceTypeScriptEntries: params.allowSourceTypeScriptEntries,
		dangerouslyForceUnsafeInstall: params.dangerouslyForceUnsafeInstall,
		onInstallPolicyWarning: params.onInstallPolicyWarning,
		trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
		config: params.config,
		installPolicyRequest: params.installPolicyRequest,
		logger,
		mode: params.mode ?? "install"
	});
	if (!validated.ok) return validated;
	const postInstallError = await scanAndLinkInstalledPackage({
		runtime,
		installedDir: params.packageDir,
		...params.additionalDependencyPackageDirs ? { additionalDependencyPackageDirs: params.additionalDependencyPackageDirs } : {},
		dependencyScanRootDir: params.dependencyScanRootDir,
		pluginId: validated.plugin.pluginId,
		peerDependencies: validated.plugin.peerDependencies,
		onInstallPolicyWarning: params.onInstallPolicyWarning,
		trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
		config: params.config,
		mode: params.mode ?? "install",
		...params.installPolicyRequest?.kind ? { requestKind: params.installPolicyRequest.kind } : {},
		requestedSpecifier: params.installPolicyRequest?.requestedSpecifier,
		source: params.installPolicyRequest?.source,
		logger
	});
	if (postInstallError) return postInstallError;
	const result = buildDirectoryInstallResult({
		pluginId: validated.plugin.pluginId,
		targetDir: params.packageDir,
		manifestName: validated.plugin.manifestName,
		version: validated.plugin.version,
		extensions: validated.plugin.extensions,
		setup: validated.plugin.setup
	});
	if (params.emitSuccessSecurityEvent !== false) emitSuccessfulPluginInstallSecurityEvent(result, {
		dryRun: params.dryRun,
		mode: params.mode ?? "install",
		sourceFamily: sourceFamilyForInstallPolicyKind(params.installPolicyRequest?.kind, "installed-package"),
		trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall
	});
	return result;
}
//#endregion
//#region src/plugins/install-npm-resolution.ts
function verifyInstalledNpmResolution(params) {
	if (!params.installed) return {
		kind: "incomplete",
		error: `npm install did not record package-lock metadata for ${params.packageName}`
	};
	if (params.expected.version && params.installed.version) {
		if (params.installed.version !== params.expected.version) return {
			kind: "conflict",
			error: `npm install resolved ${params.packageName} to version ${params.installed.version}, expected ${params.expected.version}`
		};
	}
	if (params.expected.integrity && params.installed.integrity) {
		if (params.installed.integrity !== params.expected.integrity) return {
			kind: "conflict",
			error: `npm install resolved ${params.packageName} with integrity ${params.installed.integrity}, expected ${params.expected.integrity}`
		};
	}
	if (params.expected.version && !params.installed.version || params.expected.integrity && !params.installed.integrity) return {
		kind: "incomplete",
		error: `npm install recorded incomplete package-lock metadata for ${params.packageName}: ${params.expected.version && !params.installed.version ? "version" : "integrity"} missing`
	};
	return { kind: "ok" };
}
//#endregion
//#region src/plugins/install-managed-npm.ts
async function installPluginFromManagedNpmRoot(params) {
	const runtime = await loadPluginInstallRuntime();
	const { logger, timeoutMs, mode, dryRun } = runtime.resolveTimedInstallModeOptions(params, defaultLogger);
	const expectedPluginId = params.expectedPluginId;
	const npmBaseDir = params.npmDir ? resolveUserPath(params.npmDir) : resolveDefaultPluginNpmDir();
	const generationUse = await resolveManagedNpmGenerationUseForInstall({
		runtime,
		npmBaseDir,
		packageName: params.packageName,
		requestedMode: mode,
		npmResolution: params.npmResolution
	});
	const npmRoot = resolveManagedNpmInstallRoot({
		npmBaseDir,
		packageName: params.packageName,
		npmResolution: params.npmResolution,
		useGeneration: generationUse !== "none"
	});
	const installRoot = resolveManagedNpmRootPackageDir(npmRoot, params.packageName);
	const targetMode = generationUse === "retained-install" && hasRetainedManagedNpmInstallMarker(installRoot) ? "update" : await resolveEffectiveInstallMode({
		runtime,
		requestedMode: mode,
		targetPath: installRoot
	});
	const policyMode = generationUse === "update" ? "update" : generationUse === "retained-install" ? "install" : targetMode;
	const availability = await ensureInstallTargetAvailableForMode({
		runtime,
		targetPath: installRoot,
		mode: targetMode
	});
	if (!availability.ok) return availability;
	if (!params.skipPolicyPreflight) {
		const preflightPolicyResult = await runInstallSourceScan({
			subject: `Plugin "${expectedPluginId ?? params.packageName}"`,
			pluginId: expectedPluginId ?? params.packageName,
			mode: policyMode,
			sourceFamily: sourceFamilyForInstallPolicySource(params.installPolicyRequest.source, "npm"),
			scan: async () => await preflightPluginNpmInstallPolicy({
				config: params.config,
				dangerouslyForceUnsafeInstall: params.dangerouslyForceUnsafeInstall,
				onInstallPolicyWarning: params.onInstallPolicyWarning,
				logger,
				mode: policyMode,
				packageName: params.packageName,
				...expectedPluginId ? { pluginId: expectedPluginId } : {},
				requestedSpecifier: params.installPolicyRequest.requestedSpecifier ?? params.displaySpec,
				source: params.installPolicyRequest.source,
				sourcePath: params.policyPreflightSourcePath ?? npmRoot,
				sourcePathKind: params.policyPreflightSourcePathKind ?? "directory"
			})
		});
		if (preflightPolicyResult) return preflightPolicyResult;
	}
	if (dryRun) return {
		ok: true,
		pluginId: expectedPluginId ?? params.packageName,
		targetDir: installRoot,
		extensions: [],
		npmResolution: params.npmResolution,
		...params.integrityDrift ? { integrityDrift: params.integrityDrift } : {}
	};
	params.signal?.throwIfAborted();
	let rollbackSnapshot;
	let preparedDependency;
	let rollbackPeerDependencySnapshot;
	let recovery;
	let deferredTransaction = false;
	try {
		rollbackSnapshot = await createManagedNpmPluginInstallRollbackSnapshot({ npmRoot });
	} catch (error) {
		return {
			ok: false,
			error: `Failed to snapshot managed npm root before installing ${params.packageName}: ${String(error)}`
		};
	}
	const runManagedNpmInstall = async (prepared) => {
		logger.info?.(`Installing ${params.displaySpec} into ${npmRoot}…`);
		if (params.packageName !== "openclaw") {
			if (await repairManagedNpmRootOpenClawPeer({
				npmRoot,
				timeoutMs,
				signal: params.signal,
				logger
			})) logger.info?.(`Repaired stale openclaw peer dependency in ${npmRoot}`);
		}
		const managedOverrides = await readOpenClawManagedNpmRootOverrides();
		rollbackPeerDependencySnapshot ??= await readManagedNpmRootPeerDependencySnapshot({ npmRoot });
		const rollbackFailedManagedNpmInstall = async (failure) => {
			await rollbackManagedNpmPluginInstall({
				npmRoot,
				packageName: params.packageName,
				targetDir: installRoot,
				timeoutMs,
				logger,
				peerDependencySnapshot: rollbackPeerDependencySnapshot,
				snapshot: recovery ? void 0 : rollbackSnapshot
			});
			await rollbackManagedNpmRootPreparedDependency({
				packageName: params.packageName,
				preparedDependency: prepared,
				logger
			});
			return failure;
		};
		const quarantineForRecovery = async (cause) => {
			try {
				recovery = {
					cause,
					quarantine: await quarantineManagedNpmProjectRebuildArtifacts({ npmRoot })
				};
			} catch (error) {
				return await rollbackFailedManagedNpmInstall({
					ok: false,
					error: `${cause.error}, but OpenClaw could not quarantine ${npmRoot} for rebuild: ${String(error)}`
				});
			}
			logger.warn?.(`${cause.error}; quarantined ${formatManagedNpmProjectQuarantineArtifacts(recovery.quarantine.movedArtifactNames)} at ${recovery.quarantine.quarantineDir} and rebuilding once before retrying.`);
			return null;
		};
		const syncManagedPeerDependenciesForInstall = async (options) => {
			try {
				return {
					ok: true,
					changed: await syncManagedNpmRootPeerDependencies({
						npmRoot,
						managedOverrides,
						overrideOmissions: options?.overrideOmissions,
						timeoutMs,
						signal: params.signal
					})
				};
			} catch (error) {
				return {
					ok: false,
					error: `npm peer dependency planning failed: ${error instanceof Error ? error.message : String(error)}`
				};
			}
		};
		let overrideOmissions = {};
		const preInstallRootPackageNames = await listManagedNpmRootPackageNames(npmRoot);
		await upsertManagedNpmRootDependency({
			npmRoot,
			packageName: params.packageName,
			dependencySpec: prepared.dependencySpec,
			managedOverrides,
			overrideOmissions
		});
		const initialPeerSync = await syncManagedPeerDependenciesForInstall({ overrideOmissions });
		if (!initialPeerSync.ok) return await rollbackFailedManagedNpmInstall({
			ok: false,
			error: initialPeerSync.error
		});
		const npmInstallArgs = ["npm", ...createSafeNpmInstallArgs({
			omitDev: true,
			omitPeer: true,
			loglevel: "error",
			legacyPeerDeps: true,
			noAudit: true,
			noFund: true
		})];
		const npmInstallOptions = {
			cwd: npmRoot,
			timeoutMs: Math.max(timeoutMs, 3e5),
			signal: params.signal,
			killProcessTree: true,
			env: createSafeNpmInstallEnv(process.env, {
				legacyPeerDeps: true,
				npmConfigCwd: npmRoot,
				packageLock: true,
				quiet: true
			})
		};
		let install = await runCommandWithTimeout(npmInstallArgs, npmInstallOptions);
		let compatibility = classifyNpmManagedOverrideCompatibilityError(install);
		while (install.code !== 0 && compatibility) {
			const nextOverrideOmissions = {
				npmAliases: overrideOmissions.npmAliases === true || compatibility.npmAliases,
				pnpmParentChildSelectors: overrideOmissions.pnpmParentChildSelectors === true || compatibility.pnpmParentChildSelectors
			};
			if (nextOverrideOmissions.npmAliases === (overrideOmissions.npmAliases === true) && nextOverrideOmissions.pnpmParentChildSelectors === (overrideOmissions.pnpmParentChildSelectors === true)) break;
			logger.warn?.("npm rejected managed npm overrides; retrying plugin install without npm-incompatible overrides for this npm version.");
			overrideOmissions = nextOverrideOmissions;
			await upsertManagedNpmRootDependency({
				npmRoot,
				packageName: params.packageName,
				dependencySpec: prepared.dependencySpec,
				managedOverrides,
				overrideOmissions
			});
			const aliasRetryPeerSync = await syncManagedPeerDependenciesForInstall({ overrideOmissions });
			if (!aliasRetryPeerSync.ok) return await rollbackFailedManagedNpmInstall({
				ok: false,
				error: aliasRetryPeerSync.error
			});
			install = await runCommandWithTimeout(npmInstallArgs, npmInstallOptions);
			compatibility = classifyNpmManagedOverrideCompatibilityError(install);
		}
		if (!recovery && install.code !== 0 && isManagedNpmProjectCorruptionInstallFailure(install)) {
			const recoveryFailure = await quarantineForRecovery({
				kind: "npm-corruption",
				error: `npm install failed with a managed npm project corruption signature. Original npm error: ${formatNpmCommandFailureOutput(install)}`
			});
			if (recoveryFailure) return recoveryFailure;
			return await runManagedNpmInstall(prepared);
		}
		if (install.code !== 0) return await rollbackFailedManagedNpmInstall({
			ok: false,
			error: recovery ? `npm install failed after managed npm project recovery (quarantine: ${recovery.quarantine.quarantineDir}): ${formatNpmCommandFailureOutput(install)}. Original ${recovery.cause.kind === "npm-corruption" ? "npm" : "verification"} error: ${recovery.cause.error}` : `npm install failed: ${formatNpmCommandFailureOutput(install)}`
		});
		let settledManagedPeerDependencies = false;
		for (let peerSyncPass = 0; peerSyncPass < 10; peerSyncPass += 1) {
			const peerSync = await syncManagedPeerDependenciesForInstall({ overrideOmissions });
			if (!peerSync.ok) return await rollbackFailedManagedNpmInstall({
				ok: false,
				error: peerSync.error
			});
			if (!peerSync.changed) {
				settledManagedPeerDependencies = true;
				break;
			}
			install = await runCommandWithTimeout(npmInstallArgs, npmInstallOptions);
			if (install.code !== 0) return await rollbackFailedManagedNpmInstall({
				ok: false,
				error: `npm install failed after syncing managed peer dependencies: ${formatNpmCommandFailureOutput(install)}`
			});
		}
		if (!settledManagedPeerDependencies) {
			const peerSync = await syncManagedPeerDependenciesForInstall({ overrideOmissions });
			if (!peerSync.ok) return await rollbackFailedManagedNpmInstall({
				ok: false,
				error: peerSync.error
			});
			settledManagedPeerDependencies = !peerSync.changed;
		}
		if (!settledManagedPeerDependencies) return await rollbackFailedManagedNpmInstall({
			ok: false,
			error: "npm install could not settle managed peer dependencies after 10 sync passes; refusing to leave a partially reconciled plugin dependency tree."
		});
		const packageManifestResult = await readOptionalPackageManifest({
			runtime,
			packageDir: installRoot
		});
		if (!packageManifestResult.ok) return await rollbackFailedManagedNpmInstall(packageManifestResult);
		const requiredPlatformPackageNames = resolveRequiredPlatformPackageNames(packageManifestResult.manifest ? runtime.getPackageManifestMetadata(packageManifestResult.manifest) : void 0);
		if (!requiredPlatformPackageNames.ok) return await rollbackFailedManagedNpmInstall({
			ok: false,
			error: requiredPlatformPackageNames.error
		});
		let omittedPlatformPackages;
		try {
			omittedPlatformPackages = await listMissingRequiredPlatformPackages({
				npmRoot,
				requiredPackageNames: requiredPlatformPackageNames.packageNames
			});
		} catch (error) {
			return await rollbackFailedManagedNpmInstall({
				ok: false,
				error: `Failed to verify platform-specific npm dependencies for ${params.packageName}: ${String(error)}`
			});
		}
		if (omittedPlatformPackages.length > 0) {
			const omittedPlatformPackageNames = omittedPlatformPackages.map((entry) => entry.name);
			logger.warn?.(`npm omitted current-platform package(s) ${omittedPlatformPackageNames.join(", ")}; retrying once with a fresh cache.`);
			let freshCacheDir;
			try {
				freshCacheDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-npm-cache-"));
				install = await runCommandWithTimeout(npmInstallArgs, {
					...npmInstallOptions,
					env: {
						...npmInstallOptions.env,
						NPM_CONFIG_CACHE: freshCacheDir,
						npm_config_cache: freshCacheDir
					}
				});
			} catch (error) {
				return await rollbackFailedManagedNpmInstall({
					ok: false,
					error: `Failed to repair omitted current-platform package(s) ${omittedPlatformPackageNames.join(", ")}: ${String(error)}`
				});
			} finally {
				if (freshCacheDir) try {
					await fs.rm(freshCacheDir, {
						recursive: true,
						force: true
					});
				} catch (error) {
					logger.warn?.(`Failed to remove temporary npm cache ${freshCacheDir}: ${String(error)}`);
				}
			}
			if (install.code !== 0) return await rollbackFailedManagedNpmInstall({
				ok: false,
				error: `npm install failed while repairing omitted current-platform package(s) ${omittedPlatformPackageNames.join(", ")}: ${formatNpmCommandFailureOutput(install)}`
			});
			let stillOmittedPlatformPackages;
			try {
				stillOmittedPlatformPackages = await listMissingRequiredPlatformPackages({
					npmRoot,
					requiredPackageNames: requiredPlatformPackageNames.packageNames
				});
			} catch (error) {
				return await rollbackFailedManagedNpmInstall({
					ok: false,
					error: `Failed to verify repaired platform-specific npm dependencies for ${params.packageName}: ${String(error)}`
				});
			}
			if (stillOmittedPlatformPackages.length > 0) return await rollbackFailedManagedNpmInstall({
				ok: false,
				error: `npm install reported success but omitted required current-platform package(s): ${stillOmittedPlatformPackages.map((entry) => entry.name).join(", ")}`
			});
		}
		if (params.packageName !== "openclaw") {
			if (await repairManagedNpmRootOpenClawPeer({
				npmRoot,
				timeoutMs,
				signal: params.signal,
				logger
			})) logger.info?.(`Repaired stale openclaw peer dependency in ${npmRoot} after npm install`);
		}
		try {
			await relinkOpenClawPeerDependenciesInManagedNpmRoot({
				npmRoot,
				logger
			});
		} catch (error) {
			return await rollbackFailedManagedNpmInstall({
				ok: false,
				error: `Failed to repair openclaw peer links after npm install: ${String(error)}`
			});
		}
		if (await auditDeclaredOpenClawHostDependency({ packageDir: installRoot })) return await rollbackFailedManagedNpmInstall({
			ok: false,
			error: formatUnresolvedOpenClawPeerLinkError(params.packageName)
		});
		let installedDependency;
		try {
			installedDependency = await readManagedNpmRootInstalledDependency({
				npmRoot,
				packageName: params.packageName
			});
		} catch (error) {
			return await rollbackFailedManagedNpmInstall({
				ok: false,
				error: `Failed to verify npm install metadata for ${params.packageName}: ${String(error)}`
			});
		}
		const resolutionVerification = verifyInstalledNpmResolution({
			packageName: params.packageName,
			expected: params.npmResolution,
			installed: installedDependency
		});
		if (resolutionVerification.kind === "conflict") return await rollbackFailedManagedNpmInstall({
			ok: false,
			error: resolutionVerification.error
		});
		if (resolutionVerification.kind === "incomplete") {
			if (!recovery) {
				const recoveryFailure = await quarantineForRecovery({
					kind: "incomplete-metadata",
					error: resolutionVerification.error
				});
				if (recoveryFailure) return recoveryFailure;
				return await runManagedNpmInstall(prepared);
			}
			return await rollbackFailedManagedNpmInstall({
				ok: false,
				error: `npm install metadata remained incomplete after managed npm project recovery (quarantine: ${recovery.quarantine.quarantineDir}): ${resolutionVerification.error}`
			});
		}
		const newRootPackageDirs = await listNewManagedNpmRootPackageDirs({
			beforeInstallPackageNames: preInstallRootPackageNames,
			npmRoot
		});
		let installedExpectedPluginId = expectedPluginId;
		if (mode === "update" && params.trustedSourceLinkedOfficialInstall === true && expectedPluginId && params.expectedReplacementPluginId) {
			const manifestResult = runtime.loadPluginManifest(installRoot);
			if (manifestResult.ok && manifestResult.manifest.id === params.expectedReplacementPluginId && manifestResult.manifest.legacyPluginIds?.includes(expectedPluginId)) installedExpectedPluginId = params.expectedReplacementPluginId;
		}
		const result = await installPluginFromInstalledPackageDir({
			dangerouslyForceUnsafeInstall: params.dangerouslyForceUnsafeInstall,
			onInstallPolicyWarning: params.onInstallPolicyWarning,
			config: params.config,
			additionalDependencyPackageDirs: newRootPackageDirs,
			packageDir: installRoot,
			dependencyScanRootDir: npmRoot,
			logger,
			expectedPluginId: installedExpectedPluginId,
			trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
			mode: policyMode,
			installPolicyRequest: params.installPolicyRequest,
			emitSuccessSecurityEvent: false
		});
		if (!result.ok) return await rollbackFailedManagedNpmInstall(result);
		return {
			...result,
			npmResolution: params.npmResolution,
			...params.integrityDrift ? { integrityDrift: params.integrityDrift } : {}
		};
	};
	try {
		const dependencyResult = await resolveManagedNpmRootDependencySpecForInstall({
			npmRoot,
			packageName: params.packageName,
			dependencySpec: params.dependencySpec,
			prepareDependencySpec: params.prepareDependencySpec
		});
		if (!dependencyResult.ok) return dependencyResult;
		preparedDependency = dependencyResult;
		const result = await runManagedNpmInstall(preparedDependency);
		if (!result.ok || !isPluginInstallCommitDeferred(params)) return result;
		deferredTransaction = true;
		let settled = false;
		const cleanup = async () => {
			await cleanupManagedNpmRootPreparedDependency({
				packageName: params.packageName,
				preparedDependency,
				logger
			});
			await cleanupManagedNpmPluginInstallRollbackSnapshot({
				snapshot: rollbackSnapshot,
				logger
			});
		};
		return attachPluginInstallTransaction({ ...result }, {
			async commit() {
				if (settled) return;
				settled = true;
				await cleanup();
			},
			async rollback() {
				if (settled) return;
				settled = true;
				await rollbackManagedNpmPluginInstall({
					npmRoot,
					packageName: params.packageName,
					targetDir: installRoot,
					timeoutMs,
					logger,
					peerDependencySnapshot: rollbackPeerDependencySnapshot,
					snapshot: recovery ? void 0 : rollbackSnapshot
				});
				await rollbackManagedNpmRootPreparedDependency({
					packageName: params.packageName,
					preparedDependency: dependencyResult,
					logger
				});
				await cleanup();
			}
		});
	} finally {
		if (!deferredTransaction) {
			await cleanupManagedNpmRootPreparedDependency({
				packageName: params.packageName,
				preparedDependency,
				logger
			});
			await cleanupManagedNpmPluginInstallRollbackSnapshot({
				snapshot: rollbackSnapshot,
				logger
			});
		}
	}
}
//#endregion
//#region src/plugins/install-npm-pack.ts
const MANAGED_NPM_PACK_ARCHIVE_DIR = "_openclaw-pack-archives";
function resolveTrustedNpmPackPackageName(packageName) {
	if (!packageName) return {
		ok: false,
		error: "npm pack metadata missing package name",
		code: PLUGIN_INSTALL_ERROR_CODE.INVALID_NPM_SPEC
	};
	const specError = validateRegistryNpmSpec(packageName);
	const parsedSpec = parseRegistryNpmSpec(packageName);
	if (specError || !parsedSpec || parsedSpec.selectorKind !== "none") return {
		ok: false,
		error: `unsupported npm pack package name: ${packageName}`,
		code: PLUGIN_INSTALL_ERROR_CODE.INVALID_NPM_SPEC
	};
	return {
		ok: true,
		packageName: parsedSpec.name
	};
}
async function stageNpmPackArchiveInManagedRoot(params) {
	const archiveStoreDir = path.join(params.npmRoot, MANAGED_NPM_PACK_ARCHIVE_DIR);
	const identitySlug = sha256HexPrefixCore(params.integrity ?? params.shasum ?? params.tarballName, 16);
	const archiveFileName = `${safePluginInstallFileName(params.packageName) || "plugin"}-${safePluginInstallFileName(params.version ?? "pack") || "pack"}-${identitySlug}.tgz`;
	const stableArchivePath = path.join(archiveStoreDir, archiveFileName);
	const tempArchivePath = path.join(archiveStoreDir, `.${archiveFileName}.${process.pid}.${Date.now()}.tmp`);
	let archiveStoreExisted = true;
	let backupTempDir;
	let previousArchiveBackupPath;
	const cleanupBackup = async () => {
		if (!backupTempDir) return;
		const tempDir = backupTempDir;
		backupTempDir = void 0;
		previousArchiveBackupPath = void 0;
		await fs.rm(tempDir, {
			recursive: true,
			force: true
		});
	};
	try {
		await fs.access(archiveStoreDir);
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
		archiveStoreExisted = false;
	}
	try {
		await fs.access(stableArchivePath);
		backupTempDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-npm-pack-archive-"));
		previousArchiveBackupPath = path.join(backupTempDir, archiveFileName);
		await fs.copyFile(stableArchivePath, previousArchiveBackupPath);
	} catch (error) {
		if (error.code !== "ENOENT") {
			await cleanupBackup();
			throw error;
		}
	}
	try {
		await fs.mkdir(archiveStoreDir, { recursive: true });
		await fs.copyFile(params.archivePath, tempArchivePath);
		await fs.rename(tempArchivePath, stableArchivePath);
	} catch (error) {
		await fs.rm(tempArchivePath, { force: true });
		await cleanupBackup();
		if (!archiveStoreExisted) await removeEmptyDirectoryIfPresent(archiveStoreDir);
		throw error;
	}
	return {
		stableArchivePath,
		dependencySpec: `file:./${path.posix.join(MANAGED_NPM_PACK_ARCHIVE_DIR, archiveFileName)}`,
		rollback: async () => {
			if (previousArchiveBackupPath) {
				await fs.mkdir(archiveStoreDir, { recursive: true });
				await fs.copyFile(previousArchiveBackupPath, stableArchivePath);
			} else await fs.rm(stableArchivePath, { force: true });
			await cleanupBackup();
			if (!archiveStoreExisted) await removeEmptyDirectoryIfPresent(archiveStoreDir);
		},
		cleanup: cleanupBackup
	};
}
async function installPluginFromNpmPackArchive(params) {
	const runtime = await loadPluginInstallRuntime();
	const { logger, timeoutMs, mode, dryRun } = runtime.resolveTimedInstallModeOptions(params, defaultLogger);
	const metadataResult = await resolveNpmPackArchiveMetadata({
		archivePath: params.archivePath,
		timeoutMs,
		signal: params.signal
	});
	if (!metadataResult.ok) return metadataResult;
	const npmResolution = {
		...metadataResult.metadata,
		resolvedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	const driftResult = await resolveNpmIntegrityDriftWithDefaultMessage({
		spec: metadataResult.archivePath,
		expectedIntegrity: params.expectedIntegrity,
		resolution: npmResolution,
		onIntegrityDrift: params.onIntegrityDrift,
		warn: (message) => logger.warn?.(message)
	});
	if (driftResult.error) return {
		ok: false,
		error: driftResult.error
	};
	const packageNameResult = resolveTrustedNpmPackPackageName(metadataResult.metadata.name);
	if (!packageNameResult.ok) return packageNameResult;
	const packageName = packageNameResult.packageName;
	const npmBaseDir = params.npmDir ? resolveUserPath(params.npmDir) : resolveDefaultPluginNpmDir();
	const generationUse = await resolveManagedNpmGenerationUseForInstall({
		runtime,
		npmBaseDir,
		packageName,
		requestedMode: mode,
		npmResolution
	});
	const installRoot = resolveManagedNpmRootPackageDir(resolveManagedNpmRootForInstall({
		npmBaseDir,
		packageName,
		npmResolution,
		useGeneration: generationUse !== "none"
	}), packageName);
	const targetMode = generationUse === "retained-install" && hasRetainedManagedNpmInstallMarker(installRoot) ? "update" : await resolveEffectiveInstallMode({
		runtime,
		requestedMode: mode,
		targetPath: installRoot
	});
	const policyMode = generationUse === "update" ? "update" : generationUse === "retained-install" ? "install" : targetMode;
	const result = await installPluginFromManagedNpmRoot({
		dangerouslyForceUnsafeInstall: params.dangerouslyForceUnsafeInstall,
		onInstallPolicyWarning: params.onInstallPolicyWarning,
		trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
		config: params.config,
		packageName,
		prepareDependencySpec: async ({ npmRoot }) => {
			try {
				return {
					ok: true,
					...await stageNpmPackArchiveInManagedRoot({
						archivePath: metadataResult.archivePath,
						npmRoot,
						packageName,
						version: metadataResult.metadata.version,
						integrity: metadataResult.metadata.integrity,
						shasum: metadataResult.metadata.shasum,
						tarballName: metadataResult.tarballName
					})
				};
			} catch (error) {
				return {
					ok: false,
					error: `Failed to stage npm pack archive in managed npm root: ${String(error)}`
				};
			}
		},
		displaySpec: metadataResult.archivePath,
		installPolicyRequest: {
			kind: "plugin-npm",
			requestedSpecifier: `npm-pack:${metadataResult.archivePath}`,
			source: {
				kind: "archive",
				authority: "user",
				mutable: true,
				network: false
			}
		},
		policyPreflightSourcePath: metadataResult.archivePath,
		policyPreflightSourcePathKind: "file",
		extensionsDir: params.extensionsDir,
		npmDir: npmBaseDir,
		timeoutMs,
		signal: params.signal,
		logger,
		mode,
		dryRun,
		expectedPluginId: params.expectedPluginId,
		npmResolution,
		...driftResult.integrityDrift ? { integrityDrift: driftResult.integrityDrift } : {}
	});
	emitSuccessfulPluginInstallSecurityEvent(result, {
		dryRun,
		mode: policyMode,
		sourceFamily: "archive",
		trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall
	});
	return {
		...result,
		...result.ok ? { npmTarballName: metadataResult.tarballName } : {}
	};
}
//#endregion
//#region src/plugins/install-npm-metadata.ts
function isNpmPackageNotFoundMessage(error) {
	const normalized = error.trim();
	if (normalized.startsWith("Package not found on npm:")) return true;
	return /E404|404 not found|not in this registry/i.test(normalized);
}
function compareNpmSemver(a, b) {
	const releaseCmp = compareOpenClawReleaseVersions(a, b);
	if (releaseCmp !== null) return releaseCmp;
	return compareValidSemver(a, b) ?? 0;
}
async function loadNpmPackageVersions(params) {
	const versions = await runCommandWithTimeout([
		"npm",
		"view",
		params.packageName,
		"versions",
		"--json"
	], {
		timeoutMs: Math.max(params.timeoutMs, 6e4),
		signal: params.signal,
		killProcessTree: true,
		env: createNpmMetadataEnv()
	});
	if (versions.code !== 0) return null;
	let parsed;
	try {
		parsed = JSON.parse(versions.stdout.trim());
	} catch {
		return null;
	}
	return (Array.isArray(parsed) ? parsed : [parsed]).filter((value) => typeof value === "string" && isExactSemverVersion(value));
}
async function resolveTrustedOfficialPrereleaseResolution(params) {
	if (!params.spec.name.startsWith("@openclaw/")) return null;
	const semverVersions = await loadNpmPackageVersions({
		packageName: params.spec.name,
		timeoutMs: params.timeoutMs,
		signal: params.signal
	});
	if (!semverVersions) return null;
	const stableVersion = semverVersions.filter((value) => !isPrereleaseSemverVersion(value)).toSorted(compareNpmSemver).at(-1);
	if (!stableVersion) {
		const prereleaseVersion = semverVersions.filter(isPrereleaseSemverVersion).toSorted(compareNpmSemver).at(-1);
		if (prereleaseVersion && semverVersions.every(isPrereleaseSemverVersion)) {
			if (prereleaseVersion !== params.resolvedPrereleaseVersion) {
				const prereleaseSpec = `${params.spec.name}@${prereleaseVersion}`;
				const metadataResult = await resolveNpmSpecMetadata({
					spec: prereleaseSpec,
					timeoutMs: params.timeoutMs,
					signal: params.signal
				});
				if (!metadataResult.ok) return null;
				params.logger.warn?.(`Resolved ${params.spec.raw} to prerelease version ${params.resolvedPrereleaseVersion}; using newest prerelease ${prereleaseSpec} because this trusted official OpenClaw package has no stable npm versions yet.`);
				return {
					kind: "prerelease-only",
					resolution: metadataResult.metadata
				};
			}
			params.logger.warn?.(`Resolved ${params.spec.raw} to prerelease version ${params.resolvedPrereleaseVersion}; allowing it because this trusted official OpenClaw package has no stable npm versions yet.`);
			return { kind: "allow-prerelease-only" };
		}
		return null;
	}
	const stableSpec = `${params.spec.name}@${stableVersion}`;
	const metadataResult = await resolveNpmSpecMetadata({
		spec: stableSpec,
		timeoutMs: params.timeoutMs,
		signal: params.signal
	});
	if (!metadataResult.ok) return null;
	params.logger.warn?.(`Resolved ${params.spec.raw} to prerelease version ${params.resolvedPrereleaseVersion}; falling back to stable ${stableSpec} for this trusted official OpenClaw install.`);
	return {
		kind: "stable",
		resolution: metadataResult.metadata
	};
}
function shouldResolveLatestCompatibleNpmVersion(spec) {
	return spec.selectorKind === "none" || spec.selectorKind === "tag" && (spec.selector ?? "").toLowerCase() === "latest";
}
function shouldResolveCompatiblePrereleaseNpmVersion(params) {
	if (!isPrereleaseSemverVersion(params.currentVersion)) return false;
	if (params.spec.selectorKind === "none") return true;
	return params.spec.selectorKind === "tag" && (params.spec.selector ?? "").toLowerCase() !== "latest";
}
function resolvePrereleaseChannel(version) {
	if (!isPrereleaseSemverVersion(version)) return null;
	return /^\s*v?\d+\.\d+\.\d+-([0-9A-Za-z]+)(?:[.-]|$)/.exec(version)?.[1]?.toLowerCase() ?? null;
}
function canResolveAroundCompatibilityError(error) {
	return error.code === PLUGIN_INSTALL_ERROR_CODE.INCOMPATIBLE_HOST_VERSION || error.code === PLUGIN_INSTALL_ERROR_CODE.INCOMPATIBLE_PLUGIN_API;
}
function validateNpmResolutionCompatibility(params) {
	return validateOpenClawPackageInstallCompatibility({
		runtime: params.runtime,
		pluginId: params.expectedPluginId ?? params.resolution.name ?? params.parsedSpec.name,
		packageMetadata: params.resolution.packageOpenClaw
	});
}
async function resolveLatestCompatibleNpmResolution(params) {
	if (!params.currentResolution.version) return null;
	const currentVersion = params.currentResolution.version;
	const allowPrereleaseCandidates = shouldResolveCompatiblePrereleaseNpmVersion({
		spec: params.parsedSpec,
		currentVersion
	});
	const prereleaseChannel = allowPrereleaseCandidates ? resolvePrereleaseChannel(currentVersion) : null;
	if (!shouldResolveLatestCompatibleNpmVersion(params.parsedSpec) && !allowPrereleaseCandidates) return null;
	const versions = await loadNpmPackageVersions({
		packageName: params.parsedSpec.name,
		timeoutMs: params.timeoutMs,
		signal: params.signal
	});
	if (!versions) return null;
	const candidates = versions.filter((version) => allowPrereleaseCandidates ? resolvePrereleaseChannel(version) === prereleaseChannel : !isPrereleaseSemverVersion(version)).filter((version) => compareNpmSemver(version, currentVersion) < 0).toSorted(compareNpmSemver).toReversed();
	for (const version of candidates) {
		const spec = `${params.parsedSpec.name}@${version}`;
		const metadataResult = await resolveNpmSpecMetadata({
			spec,
			timeoutMs: params.timeoutMs,
			signal: params.signal
		});
		if (!metadataResult.ok) {
			params.logger.warn?.(`Could not inspect ${spec} while looking for a compatible plugin version: ${metadataResult.error}`);
			continue;
		}
		if (!validateNpmResolutionCompatibility({
			runtime: params.runtime,
			parsedSpec: params.parsedSpec,
			expectedPluginId: params.expectedPluginId,
			resolution: metadataResult.metadata
		})) {
			params.logger.warn?.(`Resolved ${params.parsedSpec.raw} to ${params.currentResolution.resolvedSpec ?? currentVersion}, but that version is incompatible with this OpenClaw runtime; using newest compatible ${metadataResult.metadata.resolvedSpec ?? spec}.`);
			return metadataResult.metadata;
		}
	}
	return null;
}
//#endregion
//#region src/plugins/install-npm.ts
async function installPluginFromNpmSpec(params) {
	const runtime = await loadPluginInstallRuntime();
	const { logger, timeoutMs, mode, dryRun } = runtime.resolveTimedInstallModeOptions(params, defaultLogger);
	const expectedPluginId = params.expectedPluginId;
	const spec = params.spec.trim();
	const specError = runtime.validateRegistryNpmSpec(spec);
	if (specError) return {
		ok: false,
		error: specError,
		code: PLUGIN_INSTALL_ERROR_CODE.INVALID_NPM_SPEC
	};
	const parsedSpec = parseRegistryNpmSpec(spec);
	if (!parsedSpec) return {
		ok: false,
		error: "unsupported npm spec",
		code: PLUGIN_INSTALL_ERROR_CODE.INVALID_NPM_SPEC
	};
	const metadataResult = await resolveNpmSpecMetadata({
		spec,
		timeoutMs,
		signal: params.signal
	});
	if (!metadataResult.ok) return {
		ok: false,
		error: metadataResult.error,
		...isNpmPackageNotFoundMessage(metadataResult.error) ? { code: PLUGIN_INSTALL_ERROR_CODE.NPM_PACKAGE_NOT_FOUND } : metadataResult.category === "metadata-env" ? { code: PLUGIN_INSTALL_ERROR_CODE.NPM_METADATA_FAILURE } : {}
	};
	const npmResolution = {
		...metadataResult.metadata,
		resolvedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	if (npmResolution.version && !isPrereleaseResolutionAllowed({
		spec: parsedSpec,
		resolvedVersion: npmResolution.version
	})) {
		const trustedResolution = params.trustedSourceLinkedOfficialInstall ? await resolveTrustedOfficialPrereleaseResolution({
			spec: parsedSpec,
			resolvedPrereleaseVersion: npmResolution.version,
			timeoutMs,
			signal: params.signal,
			logger
		}) : null;
		if (trustedResolution?.kind === "stable" || trustedResolution?.kind === "prerelease-only") Object.assign(npmResolution, trustedResolution.resolution, { resolvedAt: npmResolution.resolvedAt });
		else if (trustedResolution?.kind === "allow-prerelease-only") {} else return {
			ok: false,
			error: formatPrereleaseResolutionError({
				spec: parsedSpec,
				resolvedVersion: npmResolution.version
			})
		};
	}
	let compatibilityError = validateNpmResolutionCompatibility({
		runtime,
		parsedSpec,
		expectedPluginId,
		resolution: npmResolution
	});
	if (compatibilityError && canResolveAroundCompatibilityError(compatibilityError)) {
		const compatibleResolution = await resolveLatestCompatibleNpmResolution({
			runtime,
			parsedSpec,
			expectedPluginId,
			currentResolution: npmResolution,
			timeoutMs,
			signal: params.signal,
			logger
		});
		if (compatibleResolution) {
			Object.assign(npmResolution, compatibleResolution, { resolvedAt: npmResolution.resolvedAt });
			compatibilityError = validateNpmResolutionCompatibility({
				runtime,
				parsedSpec,
				expectedPluginId,
				resolution: npmResolution
			});
		}
	}
	if (compatibilityError) return compatibilityError;
	const npmInstallPolicySource = {
		kind: "npm",
		authority: params.trustedSourceLinkedOfficialInstall ? "official" : "third-party",
		mutable: false,
		network: true
	};
	const driftResult = await resolveNpmIntegrityDriftWithDefaultMessage({
		spec,
		expectedIntegrity: params.expectedIntegrity,
		resolution: npmResolution,
		onIntegrityDrift: params.onIntegrityDrift,
		warn: (message) => logger.warn?.(message)
	});
	if (driftResult.error) return {
		ok: false,
		error: driftResult.error
	};
	const npmBaseDir = params.npmDir ? resolveUserPath(params.npmDir) : resolveDefaultPluginNpmDir();
	const generationUse = await resolveManagedNpmGenerationUseForInstall({
		runtime,
		npmBaseDir,
		packageName: parsedSpec.name,
		requestedMode: mode,
		npmResolution
	});
	const installRoot = resolveManagedNpmRootPackageDir(resolveManagedNpmRootForInstall({
		npmBaseDir,
		packageName: parsedSpec.name,
		npmResolution,
		useGeneration: generationUse !== "none"
	}), parsedSpec.name);
	const targetMode = generationUse === "retained-install" && hasRetainedManagedNpmInstallMarker(installRoot) ? "update" : await resolveEffectiveInstallMode({
		runtime,
		requestedMode: mode,
		targetPath: installRoot
	});
	const policyMode = generationUse === "update" ? "update" : generationUse === "retained-install" ? "install" : targetMode;
	const policyTempDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-npm-policy-"));
	try {
		const policyMetadataPath = path.join(policyTempDir, "npm-package-metadata.json");
		await fs.writeFile(policyMetadataPath, `${JSON.stringify({
			packageName: parsedSpec.name,
			requestedSpecifier: spec,
			resolution: npmResolution
		}, null, 2)}\n`, "utf8");
		const preflightPolicyResult = await runInstallSourceScan({
			subject: `Plugin "${expectedPluginId ?? parsedSpec.name}"`,
			pluginId: expectedPluginId ?? parsedSpec.name,
			mode: policyMode,
			sourceFamily: "npm",
			scan: async () => await preflightPluginNpmInstallPolicy({
				config: params.config,
				dangerouslyForceUnsafeInstall: params.dangerouslyForceUnsafeInstall,
				onInstallPolicyWarning: params.onInstallPolicyWarning,
				logger,
				mode: policyMode,
				packageName: parsedSpec.name,
				...expectedPluginId ? { pluginId: expectedPluginId } : {},
				requestedSpecifier: spec,
				source: npmInstallPolicySource,
				sourcePath: policyMetadataPath,
				sourcePathKind: "file"
			})
		});
		if (preflightPolicyResult) return preflightPolicyResult;
	} finally {
		await fs.rm(policyTempDir, {
			recursive: true,
			force: true
		});
	}
	const result = await installPluginFromManagedNpmRoot(copyPluginInstallTransactionRequest(params, {
		dangerouslyForceUnsafeInstall: params.dangerouslyForceUnsafeInstall,
		onInstallPolicyWarning: params.onInstallPolicyWarning,
		trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
		config: params.config,
		packageName: parsedSpec.name,
		dependencySpec: resolveManagedNpmRootDependencySpec({
			parsedSpec,
			resolution: npmResolution
		}),
		displaySpec: spec,
		installPolicyRequest: {
			kind: "plugin-npm",
			requestedSpecifier: spec,
			source: npmInstallPolicySource
		},
		extensionsDir: params.extensionsDir,
		npmDir: params.npmDir,
		timeoutMs,
		signal: params.signal,
		logger,
		mode,
		dryRun,
		skipPolicyPreflight: true,
		expectedPluginId,
		expectedReplacementPluginId: params.expectedReplacementPluginId,
		npmResolution,
		...driftResult.integrityDrift ? { integrityDrift: driftResult.integrityDrift } : {}
	}));
	emitSuccessfulPluginInstallSecurityEvent(result, {
		dryRun,
		mode: policyMode,
		sourceFamily: "npm",
		trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall
	});
	return result;
}
//#endregion
//#region src/plugins/install-package.ts
const PLUGIN_ARCHIVE_ROOT_MARKERS = [
	"package.json",
	"openclaw.plugin.json",
	".codex-plugin/plugin.json",
	".claude-plugin/plugin.json",
	".cursor-plugin/plugin.json",
	"plugin.json"
];
function pickPackageInstallCommonParams(params) {
	return copyPluginInstallTransactionRequest(params, {
		config: params.config,
		dangerouslyForceUnsafeInstall: params.dangerouslyForceUnsafeInstall,
		onInstallPolicyWarning: params.onInstallPolicyWarning,
		trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
		extensionsDir: params.extensionsDir,
		npmDir: params.npmDir,
		timeoutMs: params.timeoutMs,
		logger: params.logger,
		mode: params.mode,
		dryRun: params.dryRun,
		expectedPluginId: params.expectedPluginId,
		requirePluginManifest: params.requirePluginManifest,
		allowSourceTypeScriptEntries: params.allowSourceTypeScriptEntries,
		installPolicyRequest: params.installPolicyRequest,
		onEffectiveMode: params.onEffectiveMode
	});
}
function installPolicyRequestForPath(params, kind) {
	const requestKind = params.installPolicyRequest?.kind === "plugin-git" && kind === "plugin-dir" ? "plugin-git" : kind;
	return {
		kind: requestKind,
		requestedSpecifier: params.installPolicyRequest?.requestedSpecifier ?? params.path,
		source: params.installPolicyRequest?.source ?? localPluginInstallPolicySource(requestKind)
	};
}
function localPluginInstallPolicySource(kind) {
	if (kind === "plugin-archive") return {
		kind: "archive",
		authority: "user",
		mutable: true,
		network: false
	};
	if (kind === "plugin-git") return {
		kind: "git",
		authority: "third-party",
		mutable: true,
		network: true
	};
	return {
		kind: "local-path",
		authority: "user",
		mutable: true,
		network: false
	};
}
async function installBundleFromSourceDir(params) {
	const runtime = await loadPluginInstallRuntime();
	const bundleFormat = runtime.detectBundleManifestFormat(params.sourceDir);
	if (!bundleFormat) return null;
	const { logger, timeoutMs, mode, dryRun } = runtime.resolveTimedInstallModeOptions(params, defaultLogger);
	const manifestRes = runtime.loadBundleManifest({
		rootDir: params.sourceDir,
		bundleFormat,
		rejectHardlinks: true
	});
	if (!manifestRes.ok) return {
		ok: false,
		error: manifestRes.error
	};
	const pluginId = manifestRes.manifest.id;
	const pluginIdError = validatePluginId(pluginId);
	if (pluginIdError) return {
		ok: false,
		error: pluginIdError
	};
	if (params.expectedPluginId && params.expectedPluginId !== pluginId) return {
		ok: false,
		error: `plugin id mismatch: expected ${params.expectedPluginId}, got ${pluginId}`,
		code: PLUGIN_INSTALL_ERROR_CODE.PLUGIN_ID_MISMATCH
	};
	const packageManifestResult = await readOptionalPackageManifest({
		runtime,
		packageDir: params.sourceDir
	});
	if (!packageManifestResult.ok) return packageManifestResult;
	const compatibilityError = validateOpenClawPackageInstallCompatibility({
		runtime,
		pluginId,
		packageMetadata: packageManifestResult.manifest ? runtime.getPackageManifestMetadata(packageManifestResult.manifest) : void 0
	});
	if (compatibilityError) return compatibilityError;
	const targetResult = await resolvePreparedDirectoryInstallTarget({
		runtime,
		pluginId,
		extensionsDir: params.extensionsDir,
		requestedMode: mode
	});
	if (!targetResult.ok) return {
		ok: false,
		error: targetResult.error
	};
	params.onEffectiveMode?.(targetResult.target.effectiveMode);
	const scanResult = await runInstallSourceScan({
		subject: `Bundle "${pluginId}"`,
		pluginId,
		mode: targetResult.target.effectiveMode,
		sourceFamily: sourceFamilyForInstallPolicyKind(params.installPolicyRequest?.kind, "archive"),
		scan: async () => await runtime.scanBundleInstallSource({
			dangerouslyForceUnsafeInstall: params.dangerouslyForceUnsafeInstall,
			onInstallPolicyWarning: params.onInstallPolicyWarning,
			config: params.config,
			sourceDir: params.sourceDir,
			pluginId,
			logger,
			requestKind: params.installPolicyRequest?.kind,
			requestedSpecifier: params.installPolicyRequest?.requestedSpecifier,
			source: params.installPolicyRequest?.source,
			mode: targetResult.target.effectiveMode,
			version: manifestRes.manifest.version
		})
	});
	if (scanResult) return scanResult;
	const installed = await installPluginDirectoryIntoExtensions(copyPluginInstallTransactionRequest(params, {
		sourceDir: params.sourceDir,
		pluginId,
		manifestName: manifestRes.manifest.name,
		version: manifestRes.manifest.version,
		extensions: [],
		targetDir: targetResult.target.targetPath,
		extensionsDir: params.extensionsDir,
		logger,
		timeoutMs,
		mode: targetResult.target.effectiveMode,
		dryRun,
		copyErrorPrefix: "failed to copy plugin bundle",
		hasDeps: false,
		depsLogMessage: ""
	}));
	return installed.ok ? {
		...installed,
		artifactInspection: inspectBundlePluginArtifact({
			format: manifestRes.manifest.bundleFormat,
			capabilities: manifestRes.manifest.capabilities
		})
	} : installed;
}
function withArtifactInspection(result, artifactInspection) {
	return result.ok ? {
		...result,
		artifactInspection
	} : result;
}
async function installPluginFromSourceDir(params) {
	const nativePackageManifest = await detectNativePackageInstallSource(params.sourceDir);
	if (nativePackageManifest) return withArtifactInspection(await installPluginFromPackageDir({
		packageDir: params.sourceDir,
		packageManifest: nativePackageManifest,
		...pickPackageInstallCommonParams(params)
	}), inspectNativePluginArtifact());
	const bundleResult = await installBundleFromSourceDir({
		sourceDir: params.sourceDir,
		...pickPackageInstallCommonParams(params)
	});
	if (bundleResult) return bundleResult;
	return withArtifactInspection(await installPluginFromPackageDir({
		packageDir: params.sourceDir,
		...pickPackageInstallCommonParams(params)
	}), inspectNativePluginArtifact());
}
async function detectNativePackageInstallSource(packageDir) {
	const result = await readOptionalPackageManifest({
		runtime: await loadPluginInstallRuntime(),
		packageDir
	});
	const manifest = result.ok ? result.manifest : void 0;
	return manifest && ensureOpenClawExtensions({ manifest }).ok ? manifest : void 0;
}
async function installPluginFromPackageDir(params) {
	const runtime = await loadPluginInstallRuntime();
	const { logger, timeoutMs, mode, dryRun } = runtime.resolveTimedInstallModeOptions(params, defaultLogger);
	let preparedTarget;
	const resolvePreparedTargetForPluginId = async (pluginId) => {
		if (!preparedTarget) {
			const targetResult = await resolvePreparedDirectoryInstallTarget({
				runtime,
				pluginId,
				extensionsDir: params.extensionsDir,
				requestedMode: mode,
				nameEncoder: encodePluginInstallDirName
			});
			if (!targetResult.ok) throw new Error(targetResult.error);
			preparedTarget = targetResult.target;
		}
		return preparedTarget;
	};
	const validated = await validatePackagePluginInstallSource({
		runtime,
		packageDir: params.packageDir,
		manifest: params.packageManifest,
		expectedPluginId: params.expectedPluginId,
		requirePluginManifest: params.requirePluginManifest,
		allowSourceTypeScriptEntries: params.allowSourceTypeScriptEntries,
		dangerouslyForceUnsafeInstall: params.dangerouslyForceUnsafeInstall,
		onInstallPolicyWarning: params.onInstallPolicyWarning,
		trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
		config: params.config,
		installPolicyRequest: params.installPolicyRequest,
		logger,
		mode,
		resolveEffectiveMode: async (pluginId) => (await resolvePreparedTargetForPluginId(pluginId)).effectiveMode
	});
	if (!validated.ok) return validated;
	const { plugin } = validated;
	preparedTarget = await resolvePreparedTargetForPluginId(plugin.pluginId);
	const effectiveMode = preparedTarget.effectiveMode;
	params.onEffectiveMode?.(effectiveMode);
	const hasBundleManifest = Boolean(runtime.detectBundleManifestFormat(params.packageDir));
	const shouldInstallRuntimeDeps = plugin.hasRuntimeDependencies && !hasBundleManifest && params.installPolicyRequest?.kind === "plugin-archive";
	return await installPluginDirectoryIntoExtensions(copyPluginInstallTransactionRequest(params, {
		sourceDir: params.packageDir,
		pluginId: plugin.pluginId,
		manifestName: plugin.manifestName,
		version: plugin.version,
		extensions: plugin.extensions,
		setup: plugin.setup,
		targetDir: preparedTarget.targetPath,
		extensionsDir: params.extensionsDir,
		logger,
		timeoutMs,
		mode: effectiveMode,
		dryRun,
		copyErrorPrefix: "failed to copy plugin",
		hasDeps: shouldInstallRuntimeDeps,
		sourceHardlinks: shouldInstallRuntimeDeps ? "package-manager" : "reject",
		depsLogMessage: "Installing plugin dependencies…",
		nameEncoder: encodePluginInstallDirName,
		afterInstall: async (installedDir) => {
			return await scanAndLinkInstalledPackage({
				runtime,
				installedDir,
				pluginId: plugin.pluginId,
				peerDependencies: plugin.peerDependencies,
				onInstallPolicyWarning: params.onInstallPolicyWarning,
				trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
				config: params.config,
				mode: effectiveMode,
				...params.installPolicyRequest?.kind ? { requestKind: params.installPolicyRequest.kind } : {},
				requestedSpecifier: params.installPolicyRequest?.requestedSpecifier,
				source: params.installPolicyRequest?.source,
				logger
			});
		}
	}));
}
async function installPluginFromArchive(params) {
	const runtime = await loadPluginInstallRuntime();
	const logger = params.logger ?? defaultLogger;
	const timeoutMs = params.timeoutMs ?? 12e4;
	const mode = params.mode ?? "install";
	const installPolicyRequest = params.installPolicyRequest ?? {
		kind: "plugin-archive",
		requestedSpecifier: params.archivePath,
		source: localPluginInstallPolicySource("plugin-archive")
	};
	const archivePathResult = await runtime.resolveArchiveSourcePath(params.archivePath);
	if (!archivePathResult.ok) return archivePathResult;
	const archivePath = archivePathResult.path;
	let effectiveMode = mode;
	const result = await runtime.withExtractedArchiveRoot({
		archivePath,
		tempDirPrefix: "openclaw-plugin-",
		timeoutMs,
		logger,
		rootMarkers: PLUGIN_ARCHIVE_ROOT_MARKERS,
		onExtracted: async (sourceDir) => await installPluginFromSourceDir({
			sourceDir,
			...pickPackageInstallCommonParams(copyPluginInstallTransactionRequest(params, {
				dangerouslyForceUnsafeInstall: params.dangerouslyForceUnsafeInstall,
				onInstallPolicyWarning: params.onInstallPolicyWarning,
				extensionsDir: params.extensionsDir,
				timeoutMs,
				logger,
				mode,
				dryRun: params.dryRun,
				config: params.config,
				expectedPluginId: params.expectedPluginId,
				trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
				requirePluginManifest: true,
				installPolicyRequest,
				onEffectiveMode: (resolvedMode) => {
					effectiveMode = resolvedMode;
				}
			}))
		})
	});
	emitSuccessfulPluginInstallSecurityEvent(result, {
		dryRun: params.dryRun,
		mode: effectiveMode,
		sourceFamily: "archive",
		trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall
	});
	return result;
}
async function installPluginFromDir(params) {
	const runtime = await loadPluginInstallRuntime();
	const dirPath = resolveUserPath(params.dirPath);
	const installPolicyRequest = params.installPolicyRequest ?? {
		kind: "plugin-dir",
		requestedSpecifier: params.dirPath,
		source: localPluginInstallPolicySource("plugin-dir")
	};
	if (!await runtime.fileExists(dirPath)) return {
		ok: false,
		error: `directory not found: ${dirPath}`
	};
	if (!(await fs.stat(dirPath)).isDirectory()) return {
		ok: false,
		error: `not a directory: ${dirPath}`
	};
	let effectiveMode = params.mode ?? "install";
	const result = await installPluginFromSourceDir({
		sourceDir: dirPath,
		...pickPackageInstallCommonParams({
			...params,
			installPolicyRequest,
			onEffectiveMode: (resolvedMode) => {
				effectiveMode = resolvedMode;
			}
		})
	});
	emitSuccessfulPluginInstallSecurityEvent(result, {
		dryRun: params.dryRun,
		mode: effectiveMode,
		sourceFamily: sourceFamilyForInstallPolicyKind(installPolicyRequest.kind, "directory"),
		trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall
	});
	return result;
}
async function installPluginFromPath(params) {
	const runtime = await loadPluginInstallRuntime();
	const pathResult = await runtime.resolveExistingInstallPath(params.path);
	if (!pathResult.ok) return pathResult;
	const { resolvedPath: resolved, stat } = pathResult;
	const packageInstallOptions = pickPackageInstallCommonParams(params);
	if (stat.isDirectory()) return await installPluginFromDir({
		dirPath: resolved,
		...packageInstallOptions,
		installPolicyRequest: installPolicyRequestForPath(params, "plugin-dir")
	});
	if (runtime.resolveArchiveKind(resolved)) return await installPluginFromArchive({
		archivePath: resolved,
		...packageInstallOptions,
		installPolicyRequest: installPolicyRequestForPath(params, "plugin-archive")
	});
	return {
		ok: false,
		code: PLUGIN_INSTALL_ERROR_CODE.UNSUPPORTED_PLAIN_FILE_PLUGIN,
		error: "Plain file plugin installs are not supported. Install a plugin directory or archive that contains openclaw.plugin.json, or list standalone plugin files in plugins.load.paths."
	};
}
//#endregion
export { installPluginFromInstalledPackageDir as a, installPluginFromNpmPackArchive as i, installPluginFromPath as n, installPluginFromNpmSpec as r, installPluginFromArchive as t };
