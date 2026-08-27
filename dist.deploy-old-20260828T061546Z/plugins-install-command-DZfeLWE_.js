import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { c as tracePluginLifecyclePhaseAsync } from "./discovery-KmR2BWJK.js";
import { c as resolveUserPath } from "./home-dir-BFvskzn8.js";
import { m as shortenHomePath } from "./utils-Bw16L5tB.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { t as formatCliCommand } from "./command-format-HwSAdvXB.js";
import { r as defaultRuntime } from "./runtime-LRpY2Icg.js";
import { l as readConfigFileSnapshotForWrite } from "./io-ClLVsBMp.js";
import { t as parseClawHubPluginSpec } from "./clawhub-spec-Er3Np6VI.js";
import { o as loadInstalledPluginIndexInstallRecords } from "./manifest-registry-DqYRJvWI.js";
import { r as theme } from "./theme-vjDs9tao.js";
import { n as assertConfigWriteAllowedInCurrentMode } from "./nix-mode-write-guard-HeQJZ2vC.js";
import { r as replaceConfigFile } from "./mutate-BjBakg7Z.js";
import "./config-B_0xOnKq.js";
import { t as resolveArchiveKind } from "./archive-C_u9XKKj.js";
import { t as buildNpmResolutionFields } from "./install-source-utils-D2m0UUwS.js";
import "./installed-plugin-index-records-CHK-Mu2-.js";
import { t as withPluginLifecycleLease } from "./plugin-lifecycle-lease-QVxAzcU7.js";
import { r as withClawPackageLifecycleLease } from "./claw-package-lifecycle-lease-KD4Ith7s.js";
import { a as reportClawHubPluginInstallTelemetry } from "./clawhub-packages-s89sYo31.js";
import { t as markClawPackageIndependentlyOwned } from "./claw-package-adoption-C9ojZSlg.js";
import { t as findBundledPluginSource } from "./bundled-sources-8oSxLSsI.js";
import { n as formatNonClawHubInstallWarning, t as NON_CLAWHUB_INSTALL_FORCE_FLAG } from "./install-provenance-D_0AXLg6.js";
import { r as promptYesNo } from "./prompt-DbKlp0mU.js";
import { n as resolvePluginCapabilityConsentCliOptions } from "./plugin-capability-consent-BmEuLeTG.js";
import { z as PLUGIN_INSTALL_ERROR_CODE } from "./install-managed-npm-state-BKmVpI9X.js";
import { a as supportsInstallConfigSingleTopLevelIncludeShape, i as selectInstallMutationWriteOptions, r as resolveInstallConfigMutationPreflights } from "./install-persistence--RyplCkl.js";
import "./install-DJ6ueg-H.js";
import { n as resolveBundledInstallPlanForNpmFailure, r as resolvePluginInstallSourcePlan } from "./plugin-install-plan-Dz2XWMPo.js";
import { n as installHooksFromNpmSpec, r as installHooksFromPath } from "./install-CVJmbiTk.js";
import { a as logHookPackRestartHint, i as formatPluginInstallWithHookFallbackError, n as createPluginInstallLogger, r as enableInternalHookEntries, t as createHookPackInstallLogger } from "./plugins-command-helpers-CJtcBFDQ.js";
import { t as CLAWHUB_INSTALL_ERROR_CODE } from "./clawhub-error-codes-Bqqw9uh0.js";
import "./clawhub-wnJByH0c.js";
import { i as installManagedPluginSource } from "./management-service-B2JHS0QY.js";
import { r as resolveMarketplaceInstallShortcut } from "./marketplace-CYY05lla.js";
import { r as resolvePluginInstallRequestContext, t as resolvePluginInstallInvalidConfigPolicy } from "./plugin-install-config-policy-B1yj6OFJ.js";
import { n as resolveClawHubRiskAcknowledgementCliOptions, t as resolveInstallPolicyWarningAcknowledgementCliOptions } from "./install-policy-warning-acknowledgement-D5AR1seD.js";
import { n as listPersistedBundledPluginRecoveryLocations } from "./plugins-location-bridges-B9Dc-dkq.js";
import { n as recordHookInstall } from "./installs-q3mBPhcR.js";
import fs from "node:fs";
//#region src/cli/non-clawhub-install-acknowledgement.ts
function canPromptForNonClawHubInstall() {
	return process.stdin.isTTY && process.stdout.isTTY;
}
async function confirmNonClawHubInstall(params) {
	const warning = formatNonClawHubInstallWarning({
		sourceClass: params.sourceClass,
		spec: params.spec
	});
	if (params.acknowledged) {
		params.runtime.log(theme.warn(warning));
		return true;
	}
	if (canPromptForNonClawHubInstall()) {
		params.runtime.log(theme.warn(warning));
		return await promptYesNo("Install this non-ClawHub plugin source?");
	}
	params.runtime.error(`${warning}\nInstall cancelled; rerun with ${NON_CLAWHUB_INSTALL_FORCE_FLAG} after reviewing the source.`);
	return false;
}
//#endregion
//#region src/cli/plugins-install-config.ts
function resolveFullyBlockedConfigMutationReason(snapshot) {
	if (snapshot.pluginMutation.mode !== "blocked" || snapshot.hookMutation.mode !== "blocked") return null;
	if (snapshot.pluginMutation.reason === snapshot.hookMutation.reason) return snapshot.pluginMutation.reason;
	return `Config plugin and hook mutations are both blocked. ${snapshot.pluginMutation.reason} ${snapshot.hookMutation.reason}`;
}
function buildInvalidPluginInstallConfigError(message) {
	return Object.assign(new Error(message), { code: "INVALID_CONFIG" });
}
function assertPluginConfigMutationAllowed(preflight) {
	if (preflight.mode === "blocked") throw buildInvalidPluginInstallConfigError(preflight.reason);
}
function supportsPluginRecoveryIncludeShape(parsed) {
	if (Object.hasOwn(parsed, "$include")) return false;
	return supportsInstallConfigSingleTopLevelIncludeShape(parsed.plugins);
}
function extractMissingPluginLoadPath(issue) {
	if (issue.path !== "plugins.load.paths") return null;
	const markerIndex = issue.message.indexOf("plugin path not found:");
	if (markerIndex < 0) return null;
	return issue.message.slice(markerIndex + 22).trim() || null;
}
function isOwnedMissingPluginLoadPathIssue(issue, ownedLoadPaths, env = process.env) {
	const missingPath = extractMissingPluginLoadPath(issue);
	return missingPath !== null && ownedLoadPaths.has(resolveUserPath(missingPath, env));
}
function isAllowedPluginRecoveryIssue(issue, request, ownedLoadPaths) {
	const pluginId = request.bundledPluginId?.trim();
	if (!pluginId) return false;
	return issue.path === `channels.${pluginId}` && issue.message === `unknown channel id: ${pluginId}` || issue.path.startsWith("channels.") && issue.message.startsWith(`invalid config for plugin ${pluginId}:`) || isOwnedMissingPluginLoadPathIssue(issue, ownedLoadPaths) || issue.path === `plugins.entries.${pluginId}` && issue.message.includes("requires compiled runtime output") || issue.path === "tools.web.search.provider" && issue.message.includes(`plugin "${pluginId}"`);
}
function collectRequestedPluginInstallPaths(cfg, installRecords, request, env) {
	const pluginId = request.bundledPluginId?.trim();
	if (!pluginId) return /* @__PURE__ */ new Set();
	const paths = /* @__PURE__ */ new Set();
	const record = installRecords[pluginId] ?? cfg.plugins?.installs?.[pluginId];
	for (const value of [record?.sourcePath, record?.installPath]) if (typeof value === "string" && value.trim()) paths.add(resolveUserPath(value, env));
	return paths;
}
async function collectRequestedPluginLocationBridgePaths(request, env) {
	const pluginId = request.bundledPluginId?.trim();
	if (!pluginId) return /* @__PURE__ */ new Set();
	const locations = await listPersistedBundledPluginRecoveryLocations({ env });
	return new Set(locations.filter((location) => location.pluginId === pluginId).flatMap((location) => location.loadPaths.map((loadPath) => resolveUserPath(loadPath, env))));
}
function removeOwnedMissingPluginLoadPaths(cfg, issues, ownedLoadPaths, env) {
	const missingPaths = /* @__PURE__ */ new Set();
	for (const issue of issues) {
		const missingPath = extractMissingPluginLoadPath(issue);
		if (!missingPath) continue;
		const resolved = resolveUserPath(missingPath, env);
		if (ownedLoadPaths.has(resolved)) missingPaths.add(resolved);
	}
	const paths = cfg.plugins?.load?.paths;
	if (missingPaths.size === 0 || !Array.isArray(paths)) return cfg;
	const nextPaths = paths.filter((entry) => typeof entry !== "string" || !missingPaths.has(resolveUserPath(entry, env)));
	if (nextPaths.length === paths.length) return cfg;
	return {
		...cfg,
		plugins: {
			...cfg.plugins,
			load: {
				...cfg.plugins?.load,
				paths: nextPaths
			}
		}
	};
}
async function resolveRequestedPluginInstallPaths(cfg, issues, request, env) {
	if (!issues.some((issue) => extractMissingPluginLoadPath(issue) !== null)) return /* @__PURE__ */ new Set();
	const ownedLoadPaths = collectRequestedPluginInstallPaths(cfg, await loadInstalledPluginIndexInstallRecords(), request, env);
	if (issues.some((issue) => extractMissingPluginLoadPath(issue) !== null && !isOwnedMissingPluginLoadPathIssue(issue, ownedLoadPaths, env))) for (const loadPath of await collectRequestedPluginLocationBridgePaths(request, env)) ownedLoadPaths.add(loadPath);
	return ownedLoadPaths;
}
async function loadConfigFromSnapshotForInstall(request, prepared) {
	const { snapshot, writeOptions } = prepared;
	const mutationWriteOptions = selectInstallMutationWriteOptions(writeOptions);
	if (resolvePluginInstallInvalidConfigPolicy(request) !== "allow-plugin-recovery") throw buildInvalidPluginInstallConfigError("Config invalid; run `openclaw doctor --fix` before installing plugins.");
	const parsed = snapshot.parsed ?? {};
	if (!snapshot.exists || Object.keys(parsed).length === 0) throw buildInvalidPluginInstallConfigError("Config file could not be parsed; run `openclaw doctor` to repair it.");
	const ownedLoadPaths = await resolveRequestedPluginInstallPaths(snapshot.config, snapshot.issues, request, process.env);
	if (snapshot.legacyIssues.length > 0 || snapshot.issues.length === 0 || snapshot.issues.some((issue) => !isAllowedPluginRecoveryIssue(issue, request, ownedLoadPaths))) throw buildInvalidPluginInstallConfigError(`Config invalid outside the plugin recovery path for ${request.bundledPluginId ?? "the requested plugin"}; run \`openclaw doctor --fix\` before reinstalling it.`);
	if (!supportsPluginRecoveryIncludeShape(parsed)) throw buildInvalidPluginInstallConfigError("Config plugin recovery uses an unsupported $include shape; use a single-file top-level plugins include or run `openclaw doctor --fix` before reinstalling it.");
	const { hookMutation, pluginMutation } = resolveInstallConfigMutationPreflights({
		parsed,
		snapshotPath: snapshot.path,
		writeOptions: mutationWriteOptions
	});
	assertPluginConfigMutationAllowed(pluginMutation);
	return {
		config: removeOwnedMissingPluginLoadPaths(snapshot.config, snapshot.issues, ownedLoadPaths, process.env),
		baseHash: snapshot.hash,
		writeOptions: mutationWriteOptions,
		hookMutation,
		pluginMutation
	};
}
/** Read and authorize install configuration only after mutation-free request preflight. */
async function loadConfigForInstall(request) {
	const prepared = await tracePluginLifecyclePhaseAsync("config read", () => readConfigFileSnapshotForWrite(), { command: "install" });
	const { snapshot, writeOptions } = prepared;
	const mutationWriteOptions = selectInstallMutationWriteOptions(writeOptions);
	if (!snapshot.valid) return await loadConfigFromSnapshotForInstall(request, prepared);
	const { hookMutation, pluginMutation } = resolveInstallConfigMutationPreflights({
		parsed: snapshot.parsed ?? {},
		snapshotPath: snapshot.path,
		writeOptions: mutationWriteOptions
	});
	if (request.installKind === "plugin") assertPluginConfigMutationAllowed(pluginMutation);
	return {
		config: snapshot.sourceConfig,
		baseHash: snapshot.hash,
		writeOptions: mutationWriteOptions,
		hookMutation,
		pluginMutation
	};
}
//#endregion
//#region src/cli/hook-install-persistence.ts
async function persistHookPackInstall(params) {
	const runtime = params.runtime ?? defaultRuntime;
	let next = enableInternalHookEntries(params.snapshot.config, params.hooks);
	next = recordHookInstall(next, {
		hookId: params.hookPackId,
		hooks: params.hooks,
		...params.install
	});
	await replaceConfigFile({
		nextConfig: next,
		baseHash: params.snapshot.baseHash,
		writeOptions: params.snapshot.writeOptions
	});
	runtime.log(params.successMessage ?? `Installed hook pack: ${params.hookPackId}`);
	logHookPackRestartHint(runtime);
	return next;
}
//#endregion
//#region src/cli/npm-resolution.ts
/** Build the npm section of a plugin install record. */
function buildNpmInstallRecordFields(params) {
	return {
		source: "npm",
		spec: params.spec,
		installPath: params.installPath,
		version: params.version,
		...buildNpmResolutionFields(params.resolution)
	};
}
/** CLI adapter for npm install-record pinning with styled warning output. */
function resolvePinnedNpmInstallRecordForCli(rawSpec, pin, installPath, version, resolution, log, warnFormat) {
	const resolvedSpec = resolution?.resolvedSpec;
	const recordSpec = pin && resolvedSpec ? resolvedSpec : rawSpec;
	if (pin) if (resolvedSpec) log(`Pinned npm install record to ${resolvedSpec}.`);
	else log(warnFormat("Could not resolve exact npm version for --pin; storing original npm spec."));
	return buildNpmInstallRecordFields({
		spec: recordSpec,
		installPath,
		version,
		resolution
	});
}
//#endregion
//#region src/cli/plugins-install-hook-fallback.ts
function resolveInstallSafetyOverrides(overrides) {
	return {
		config: overrides.config,
		dangerouslyForceUnsafeInstall: overrides.dangerouslyForceUnsafeInstall,
		onInstallPolicyWarning: overrides.onInstallPolicyWarning,
		trustedSourceLinkedOfficialInstall: overrides.trustedSourceLinkedOfficialInstall
	};
}
async function probeHookPackFromNpmSpec(params) {
	try {
		return await installHooksFromNpmSpec(params);
	} catch (error) {
		return {
			ok: false,
			error: formatErrorMessage(error)
		};
	}
}
async function probeHookPackFromPath(params) {
	try {
		return await installHooksFromPath(params);
	} catch (error) {
		return {
			ok: false,
			error: formatErrorMessage(error)
		};
	}
}
function isTerminalPluginInstallFailure(code) {
	return code === PLUGIN_INSTALL_ERROR_CODE.SECURITY_SCAN_BLOCKED || code === PLUGIN_INSTALL_ERROR_CODE.SECURITY_SCAN_FAILED || code === PLUGIN_INSTALL_ERROR_CODE.RELEASE_COHORT_UNAVAILABLE || code === PLUGIN_INSTALL_ERROR_CODE.UNSUPPORTED_PLAIN_FILE_PLUGIN;
}
async function tryInstallHookPackFromLocalPath(params) {
	if (params.snapshot.hookMutation.mode === "blocked") return {
		ok: false,
		error: params.snapshot.hookMutation.reason
	};
	if (params.link) {
		if (!fs.statSync(params.resolvedPath).isDirectory()) return {
			ok: false,
			error: "Linked hook pack paths must be directories."
		};
		const probe = await installHooksFromPath({
			...resolveInstallSafetyOverrides(params.safetyOverrides ?? {}),
			path: params.resolvedPath,
			dryRun: true,
			...params.expectedPackageKind ? { expectedPackageKind: params.expectedPackageKind } : {}
		});
		if (!probe.ok) return probe;
		const merged = uniqueStrings([...params.snapshot.config.hooks?.internal?.load?.extraDirs ?? [], params.resolvedPath]);
		await persistHookPackInstall({
			snapshot: {
				...params.snapshot,
				config: {
					...params.snapshot.config,
					hooks: {
						...params.snapshot.config.hooks,
						internal: {
							...params.snapshot.config.hooks?.internal,
							enabled: true,
							load: {
								...params.snapshot.config.hooks?.internal?.load,
								extraDirs: merged
							}
						}
					}
				}
			},
			hookPackId: probe.hookPackId,
			hooks: probe.hooks,
			install: {
				source: "path",
				sourcePath: params.resolvedPath,
				installPath: params.resolvedPath,
				version: probe.version
			},
			successMessage: `Linked hook pack path: ${shortenHomePath(params.resolvedPath)}`,
			runtime: params.runtime
		});
		return { ok: true };
	}
	const result = await installHooksFromPath({
		...resolveInstallSafetyOverrides(params.safetyOverrides ?? {}),
		path: params.resolvedPath,
		mode: params.installMode,
		...params.expectedPackageKind ? { expectedPackageKind: params.expectedPackageKind } : {},
		logger: createHookPackInstallLogger(params.runtime)
	});
	if (!result.ok) return result;
	const source = resolveArchiveKind(params.resolvedPath) ? "archive" : "path";
	await persistHookPackInstall({
		snapshot: params.snapshot,
		hookPackId: result.hookPackId,
		hooks: result.hooks,
		install: {
			source,
			sourcePath: params.resolvedPath,
			installPath: result.targetDir,
			version: result.version
		},
		runtime: params.runtime
	});
	return { ok: true };
}
async function tryInstallHookPackFromNpmSpec(params) {
	if (params.snapshot.hookMutation.mode === "blocked") return {
		ok: false,
		error: params.snapshot.hookMutation.reason
	};
	const result = await installHooksFromNpmSpec({
		...resolveInstallSafetyOverrides(params.safetyOverrides ?? {}),
		config: params.snapshot.config,
		spec: params.spec,
		mode: params.installMode,
		...params.expectedIntegrity ? { expectedIntegrity: params.expectedIntegrity } : {},
		...params.expectedPackageKind ? { expectedPackageKind: params.expectedPackageKind } : {},
		logger: createHookPackInstallLogger(params.runtime)
	});
	if (!result.ok) return result;
	const installRecord = resolvePinnedNpmInstallRecordForCli(params.spec, Boolean(params.pin), result.targetDir, result.version, result.npmResolution, params.runtime?.log ?? defaultRuntime.log, theme.warn);
	await persistHookPackInstall({
		snapshot: params.snapshot,
		hookPackId: result.hookPackId,
		hooks: result.hooks,
		install: installRecord,
		runtime: params.runtime
	});
	return { ok: true };
}
/** Preserve npm plugin and hook ownership without executing a blocked mutation. */
async function tryInstallPluginOrHookPackFromNpmSpec(params) {
	const runtime = params.runtime ?? defaultRuntime;
	const fullyBlockedReason = resolveFullyBlockedConfigMutationReason(params.snapshot);
	if (fullyBlockedReason) {
		runtime.error(fullyBlockedReason);
		return { ok: false };
	}
	if (params.snapshot.pluginMutation.mode === "blocked" || params.snapshot.hookMutation.mode === "blocked") {
		const hookProbe = await probeHookPackFromNpmSpec({
			...resolveInstallSafetyOverrides(params.safetyOverrides),
			config: params.snapshot.config,
			spec: params.spec,
			mode: params.installMode,
			inspection: "package-kind",
			...params.expectedIntegrity ? { expectedIntegrity: params.expectedIntegrity } : {},
			logger: createHookPackInstallLogger(params.runtime)
		});
		if (hookProbe.ok && hookProbe.packageKind === "hook-only") {
			if (params.snapshot.hookMutation.mode === "blocked") {
				runtime.error(params.snapshot.hookMutation.reason);
				return { ok: false };
			}
			const hookFallback = await tryInstallHookPackFromNpmSpec({
				snapshot: params.snapshot,
				installMode: params.installMode,
				spec: params.spec,
				safetyOverrides: params.safetyOverrides,
				pin: params.pin,
				expectedIntegrity: hookProbe.npmResolution?.integrity ?? params.expectedIntegrity,
				expectedPackageKind: "hook-only",
				runtime: params.runtime
			});
			if (hookFallback.ok) return { ok: true };
			runtime.error(hookFallback.error);
			return { ok: false };
		}
		if (params.snapshot.pluginMutation.mode === "blocked") {
			runtime.error(params.snapshot.pluginMutation.reason);
			return { ok: false };
		}
	}
	const result = await installManagedPluginSource({
		request: params.official ? {
			source: "official",
			spec: params.spec,
			pluginId: params.expectedPluginId ?? params.spec,
			mode: params.installMode,
			pin: params.pin,
			...params.expectedIntegrity ? { expectedIntegrity: params.expectedIntegrity } : {}
		} : {
			source: "npm",
			spec: params.spec,
			mode: params.installMode,
			pin: params.pin,
			...params.expectedPluginId ? { expectedPluginId: params.expectedPluginId } : {},
			...params.expectedIntegrity ? { expectedIntegrity: params.expectedIntegrity } : {},
			...params.trustedSourceLinkedOfficialInstall ? { trustedSourceLinkedOfficialInstall: true } : {}
		},
		snapshot: params.snapshot,
		...params.capabilityConsent,
		safetyOverrides: params.safetyOverrides,
		logger: createPluginInstallLogger(params.runtime),
		invalidateRuntimeCache: params.invalidateRuntimeCache,
		runtime: params.runtime
	});
	if (!result.ok) {
		if (isTerminalPluginInstallFailure(result.code)) {
			runtime.error(result.error);
			return { ok: false };
		}
		if (params.allowBundledFallback) {
			const bundledFallbackPlan = resolveBundledInstallPlanForNpmFailure({
				rawSpec: params.spec,
				code: result.code,
				findBundledSource: (lookup) => findBundledPluginSource({ lookup })
			});
			if (bundledFallbackPlan) {
				const bundledResult = await installManagedPluginSource({
					request: {
						source: "bundled",
						rawSpec: params.spec,
						bundledSource: bundledFallbackPlan.bundledSource,
						warning: bundledFallbackPlan.warning
					},
					snapshot: params.snapshot,
					invalidateRuntimeCache: params.invalidateRuntimeCache,
					runtime: params.runtime
				});
				if (!bundledResult.ok) {
					runtime.error(bundledResult.error);
					return { ok: false };
				}
				return { ok: true };
			}
		}
		const hookFallback = await tryInstallHookPackFromNpmSpec({
			snapshot: params.snapshot,
			installMode: params.installMode,
			spec: params.spec,
			safetyOverrides: params.safetyOverrides,
			pin: params.pin,
			expectedIntegrity: params.expectedIntegrity,
			runtime: params.runtime
		});
		if (hookFallback.ok) return { ok: true };
		runtime.error(formatPluginInstallWithHookFallbackError(result.error, hookFallback));
		return { ok: false };
	}
	if (params.pin) {
		const resolvedSpec = result.npmResolution?.resolvedSpec;
		runtime.log(resolvedSpec ? `Pinned npm install record to ${resolvedSpec}.` : theme.warn("Could not resolve exact npm version for --pin; storing original npm spec."));
	}
	return { ok: true };
}
//#endregion
//#region src/cli/plugins-install-preflight.ts
function resolveMarketplaceOptionError(opts) {
	if (opts.link) return `--link is not supported with --marketplace. Remove --link, or install a local path with ${formatCliCommand(`openclaw plugins install --link <path> ${NON_CLAWHUB_INSTALL_FORCE_FLAG}`)}.`;
	if (opts.pin) return `--pin is not supported with --marketplace. Use ${formatCliCommand(`openclaw plugins install <plugin> --marketplace <name> ${NON_CLAWHUB_INSTALL_FORCE_FLAG}`)} without --pin.`;
	return null;
}
function resolveSourceOptionError(opts, sourcePlan) {
	if (sourcePlan.request.source === "git" && opts.link) return `--link is not supported with git: installs. Use ${formatCliCommand(`openclaw plugins install git:<repo>@<ref> ${NON_CLAWHUB_INSTALL_FORCE_FLAG}`)} for Git installs or ${formatCliCommand(`openclaw plugins install --link <path> ${NON_CLAWHUB_INSTALL_FORCE_FLAG}`)} for local paths.`;
	if (sourcePlan.request.source === "git" && opts.pin) return `--pin is not supported with git: installs. Pin the ref in the spec instead, for example ${formatCliCommand(`openclaw plugins install git:<repo>@<ref> ${NON_CLAWHUB_INSTALL_FORCE_FLAG}`)}.`;
	if (opts.pin && sourcePlan.request.source !== "npm" && sourcePlan.request.source !== "official" && sourcePlan.request.source !== "bundled") return "--pin is only supported with npm registry installs.";
	if (opts.link && sourcePlan.request.source !== "local") return `--link requires a local path. Run ${formatCliCommand(`openclaw plugins install --link <path> ${NON_CLAWHUB_INSTALL_FORCE_FLAG}`)}.`;
	return null;
}
/** Complete source and option validation before acquiring the persistent lifecycle lease. */
async function resolvePluginInstallPreflight(params) {
	if (!params.raw.trim()) return {
		ok: false,
		error: "Plugin install source must not be empty."
	};
	if (params.opts.marketplace !== void 0 && !params.opts.marketplace.trim()) return {
		ok: false,
		error: "--marketplace requires a non-empty source."
	};
	const installMode = params.opts.force && !params.opts.link ? "update" : "install";
	let raw = params.raw;
	let marketplace = params.opts.marketplace;
	let sourcePlan = null;
	if (marketplace === void 0) {
		const shorthand = await tracePluginLifecyclePhaseAsync("marketplace shortcut resolution", () => resolveMarketplaceInstallShortcut(raw), { command: "install" });
		if (shorthand?.ok === false) return {
			ok: false,
			error: shorthand.error
		};
		if (shorthand?.ok) {
			raw = shorthand.plugin;
			marketplace = shorthand.marketplaceSource;
		} else {
			const planned = resolvePluginInstallSourcePlan({
				raw,
				mode: installMode,
				link: params.opts.link,
				pin: params.opts.pin
			});
			if (!planned.ok) return planned;
			sourcePlan = planned;
		}
	}
	const opts = {
		...params.opts,
		marketplace
	};
	const optionError = marketplace ? resolveMarketplaceOptionError(opts) : sourcePlan ? resolveSourceOptionError(opts, sourcePlan) : "Plugin install source could not be resolved.";
	if (optionError) return {
		ok: false,
		error: optionError
	};
	const requestResolution = resolvePluginInstallRequestContext({
		rawSpec: raw,
		marketplace
	});
	if (!requestResolution.ok) return requestResolution;
	const source = sourcePlan?.request.source;
	const request = source && [
		"npm-pack",
		"git",
		"clawhub",
		"bundled",
		"official"
	].includes(source) ? {
		...requestResolution.request,
		installKind: "plugin"
	} : requestResolution.request;
	if (marketplace) return {
		ok: true,
		raw,
		opts,
		installMode,
		request,
		marketplace,
		sourcePlan: null
	};
	if (!sourcePlan) return {
		ok: false,
		error: "Plugin install source could not be resolved."
	};
	return {
		ok: true,
		raw,
		opts,
		installMode,
		request,
		sourcePlan
	};
}
//#endregion
//#region src/cli/plugins-install-command.ts
const DEPRECATED_DANGEROUS_FORCE_UNSAFE_INSTALL_WARNING = "--dangerously-force-unsafe-install is deprecated and no longer affects plugin installs because built-in install-time dangerous-code scanning has been removed. Configure security.installPolicy for operator-owned install decisions.";
function isClawHubBlockedCliFailure(result) {
	return result.code === CLAWHUB_INSTALL_ERROR_CODE.CLAWHUB_DOWNLOAD_BLOCKED && typeof result.warning === "string" && result.warning.trim().length > 0;
}
/** Validate install intent before opening the SQLite-backed plugin lifecycle lease. */
async function runPluginInstallCommand(params) {
	assertConfigWriteAllowedInCurrentMode();
	const runtime = params.runtime ?? defaultRuntime;
	const preflight = await resolvePluginInstallPreflight(params);
	if (!preflight.ok) {
		runtime.error(preflight.error);
		return runtime.exit(1);
	}
	return await withPluginLifecycleLease({}, async () => await runPluginInstallCommandUnlocked(params, preflight));
}
async function runPluginInstallCommandUnlocked(params, preflight) {
	assertConfigWriteAllowedInCurrentMode();
	const runtime = params.runtime ?? defaultRuntime;
	const invalidateRuntimeCache = params.invalidateRuntimeCache ?? true;
	const { raw, opts, installMode, request } = preflight;
	if (opts.dangerouslyForceUnsafeInstall) runtime.log(theme.warn(DEPRECATED_DANGEROUS_FORCE_UNSAFE_INSTALL_WARNING));
	const snapshot = await loadConfigForInstall(request).catch((error) => {
		runtime.error(formatErrorMessage(error));
		return null;
	});
	if (!snapshot) return runtime.exit(1);
	const safetyOverrides = resolveInstallSafetyOverrides({
		...opts,
		config: snapshot.config,
		...resolveInstallPolicyWarningAcknowledgementCliOptions({
			acknowledgeInstallPolicyWarning: opts.acknowledgeInstallPolicyWarning,
			allowPrompt: params.allowInstallPolicyWarningPrompt,
			dangerouslyForceUnsafeInstall: opts.dangerouslyForceUnsafeInstall
		})
	});
	const capabilityConsent = resolvePluginCapabilityConsentCliOptions({
		acceptCapabilities: opts.acceptCapabilities,
		action: "install",
		runtime
	});
	const acknowledgeNonClawHubSource = async (sourceClass, spec) => await confirmNonClawHubInstall({
		acknowledged: opts.force,
		runtime,
		sourceClass,
		spec
	});
	if (preflight.sourcePlan === null) {
		if (!await acknowledgeNonClawHubSource("marketplace", `${raw} from ${preflight.marketplace}`)) return runtime.exit(1);
		const result = await installManagedPluginSource({
			request: {
				source: "marketplace",
				marketplace: preflight.marketplace,
				plugin: raw,
				mode: installMode
			},
			snapshot,
			...capabilityConsent,
			safetyOverrides,
			logger: createPluginInstallLogger(runtime),
			invalidateRuntimeCache,
			runtime
		});
		if (!result.ok) {
			if (!isClawHubBlockedCliFailure(result)) runtime.error(result.error);
			return runtime.exit(1);
		}
		return;
	}
	const { sourcePlan } = preflight;
	if (sourcePlan.acknowledgement && !await acknowledgeNonClawHubSource(sourcePlan.acknowledgement.sourceClass, sourcePlan.acknowledgement.spec)) return runtime.exit(1);
	const sourceRequest = sourcePlan.request;
	switch (sourceRequest.source) {
		case "local": {
			const resolved = sourceRequest.path;
			if (sourceRequest.link) sourceRequest.successMessage = `Linked plugin path: ${shortenHomePath(resolved)}`;
			const fullyBlockedReason = resolveFullyBlockedConfigMutationReason(snapshot);
			if (fullyBlockedReason) {
				runtime.error(fullyBlockedReason);
				return runtime.exit(1);
			}
			if (snapshot.pluginMutation.mode === "blocked" || snapshot.hookMutation.mode === "blocked") {
				const hookProbe = await probeHookPackFromPath({
					...safetyOverrides,
					path: resolved,
					mode: installMode,
					inspection: "package-kind"
				});
				if (hookProbe.ok && hookProbe.packageKind === "hook-only") {
					if (snapshot.hookMutation.mode === "blocked") {
						runtime.error(snapshot.hookMutation.reason);
						return runtime.exit(1);
					}
					const hookFallback = await tryInstallHookPackFromLocalPath({
						snapshot,
						installMode,
						resolvedPath: resolved,
						safetyOverrides,
						...opts.link ? { link: true } : {},
						expectedPackageKind: "hook-only",
						runtime
					});
					if (hookFallback.ok) return;
					runtime.error(hookFallback.error);
					return runtime.exit(1);
				}
				if (snapshot.pluginMutation.mode === "blocked") {
					runtime.error(snapshot.pluginMutation.reason);
					return runtime.exit(1);
				}
			}
			const result = await installManagedPluginSource({
				request: sourceRequest,
				snapshot,
				...capabilityConsent,
				safetyOverrides,
				logger: createPluginInstallLogger(runtime),
				invalidateRuntimeCache,
				runtime
			});
			if (result.ok) return;
			if (isTerminalPluginInstallFailure(result.code)) {
				runtime.error(result.error);
				return runtime.exit(1);
			}
			const hookFallback = await tryInstallHookPackFromLocalPath({
				snapshot,
				installMode,
				resolvedPath: resolved,
				safetyOverrides,
				...sourceRequest.link ? { link: true } : {},
				runtime
			});
			if (hookFallback.ok) return;
			runtime.error(formatPluginInstallWithHookFallbackError(result.error, hookFallback));
			return runtime.exit(1);
		}
		case "marketplace":
		case "npm-pack":
		case "git": {
			const result = await installManagedPluginSource({
				request: sourceRequest,
				snapshot,
				...capabilityConsent,
				safetyOverrides,
				logger: createPluginInstallLogger(runtime),
				invalidateRuntimeCache,
				runtime
			});
			if (!result.ok) {
				runtime.error(result.error);
				return runtime.exit(1);
			}
			return;
		}
		case "bundled": {
			const result = await tracePluginLifecyclePhaseAsync("install execution", () => installManagedPluginSource({
				request: sourceRequest,
				snapshot,
				invalidateRuntimeCache,
				runtime
			}), {
				command: "install",
				source: "bundled",
				pluginId: sourceRequest.bundledSource.pluginId
			});
			if (!result.ok) {
				runtime.error(result.error);
				return runtime.exit(1);
			}
			return;
		}
		case "official":
			if (!(await tryInstallPluginOrHookPackFromNpmSpec({
				snapshot,
				installMode,
				spec: sourceRequest.spec,
				pin: sourceRequest.pin,
				safetyOverrides,
				capabilityConsent,
				allowBundledFallback: false,
				expectedPluginId: sourceRequest.pluginId,
				expectedIntegrity: sourceRequest.expectedIntegrity,
				trustedSourceLinkedOfficialInstall: true,
				official: true,
				invalidateRuntimeCache,
				runtime
			})).ok) return runtime.exit(1);
			return;
		case "clawhub": {
			const installFromClawHub = async (installSnapshot = snapshot, installSafetyOverrides = safetyOverrides) => {
				const acknowledgement = resolveClawHubRiskAcknowledgementCliOptions({
					acknowledgeClawHubRisk: opts.acknowledgeClawHubRisk,
					action: "installing"
				});
				const result = await installManagedPluginSource({
					request: {
						...sourceRequest,
						...opts.expectedIntegrity ? { expectedIntegrity: opts.expectedIntegrity } : {},
						...opts.expectedPluginId ? { expectedPluginId: opts.expectedPluginId } : {},
						...acknowledgement.acknowledgeClawHubRisk ? { acknowledgeClawHubRisk: true } : {},
						...acknowledgement.onClawHubRisk ? { onClawHubRisk: acknowledgement.onClawHubRisk } : {}
					},
					snapshot: installSnapshot,
					...capabilityConsent,
					safetyOverrides: installSafetyOverrides,
					logger: createPluginInstallLogger(runtime),
					invalidateRuntimeCache,
					runtime
				});
				if (!result.ok) {
					if (!isClawHubBlockedCliFailure(result)) runtime.error(result.error);
					return runtime.exit(1);
				}
				if (!result.clawhub) {
					runtime.error("ClawHub plugin install completed without source metadata.");
					return runtime.exit(1);
				}
				if (!params.clawManaged && result.clawhub.version) markClawPackageIndependentlyOwned({
					kind: "plugin",
					source: "clawhub",
					ref: result.clawhub.clawhubPackage,
					version: result.clawhub.version
				});
				await reportClawHubPluginInstallTelemetry({
					baseUrl: result.clawhub.clawhubUrl,
					packageName: result.clawhub.clawhubPackage,
					version: result.clawhub.version
				}).catch(() => void 0);
			};
			if (params.clawManaged) return await installFromClawHub();
			return await withClawPackageLifecycleLease({
				kind: "plugin",
				source: "clawhub",
				ref: parseClawHubPluginSpec(sourceRequest.spec)?.name ?? sourceRequest.spec
			}, async () => {
				const leasedSnapshot = await loadConfigForInstall(request).catch((error) => {
					runtime.error(formatErrorMessage(error));
					return null;
				});
				if (!leasedSnapshot) return runtime.exit(1);
				return await installFromClawHub(leasedSnapshot, resolveInstallSafetyOverrides({
					...safetyOverrides,
					config: leasedSnapshot.config
				}));
			});
		}
		case "npm": if (!(await tryInstallPluginOrHookPackFromNpmSpec({
			snapshot,
			installMode,
			spec: sourceRequest.spec,
			pin: sourceRequest.pin,
			safetyOverrides,
			capabilityConsent,
			allowBundledFallback: sourceRequest.allowBundledFallback ?? false,
			invalidateRuntimeCache,
			expectedPluginId: sourceRequest.expectedPluginId,
			expectedIntegrity: sourceRequest.expectedIntegrity,
			trustedSourceLinkedOfficialInstall: sourceRequest.trustedSourceLinkedOfficialInstall,
			runtime
		})).ok) return runtime.exit(1);
	}
}
//#endregion
export { runPluginInstallCommand as t };
