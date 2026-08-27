import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { S as parseJsonWithJson5Fallback, b as resolveConfigIncludeWritePath, v as hashConfigIncludeRaw, y as readConfigIncludeFileWithGuards } from "./redact-Cl7lwBnl.js";
import { a as isPathInside, p as safeRealpathSync } from "./path-D138yf8v.js";
import { c as tracePluginLifecyclePhaseAsync, n as discoverOpenClawPlugins, p as resolvePluginCandidateInstallOwner, u as isPluginCandidateInstallOwnerAmbiguous } from "./discovery-C2Bhkw0t.js";
import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import "./path-guards-fBZukd5S.js";
import { m as shortenHomePath } from "./utils-DEqefz4f.js";
import { r as defaultRuntime } from "./runtime-DtFIMC-W.js";
import { et as containsConfigIncludeDirective } from "./io-CeQckj5v.js";
import { t as validateJsonSchemaValue } from "./schema-validator-C_X6l1xv.js";
import "./path-safety-Dv61TTin.js";
import { a as isPluginManifestInstallOwnerAmbiguous, n as loadPluginManifestRegistryCore, o as resolvePluginManifestInstallOwner } from "./manifest-registry-Q7fHcAUz.js";
import { i as readPersistedInstalledPluginIndexInstallRecords, n as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-PWJi_KhT.js";
import { r as theme } from "./theme-vjDs9tao.js";
import { n as enablePluginInConfig } from "./enable-DlxSFwiq.js";
import { d as reconcileNpmPluginLoadPath, n as recordPluginInstallInRecords, o as withoutPluginInstallRecords } from "./installed-plugin-index-records-C5AmaeOQ.js";
import { n as recordPluginPackageUninstallPlan } from "./uninstall-package-plan-DVdwa1CC.js";
import { a as planPluginUninstall, n as applyPluginUninstallDirectoryRemoval } from "./uninstall-Tlo40JJZ.js";
import { i as commitPluginInstallRecordsWithConfig } from "./install-record-commit-DQjHzbZN.js";
import { n as refreshPluginRegistryAfterConfigMutation } from "./registry-refresh-clDTOJoC.js";
import { s as buildPluginSnapshotReport } from "./status-DYYEr43V.js";
import { t as applySlotSelectionForPlugin } from "./slot-selection-DuU6QuKj.js";
import fs from "node:fs";
import path from "node:path";
//#region src/plugins/install-persistence.ts
function addInstalledPluginToAllowlist(cfg, pluginId) {
	const allow = cfg.plugins?.allow;
	if (!Array.isArray(allow) || allow.length === 0 || allow.includes(pluginId)) return cfg;
	return {
		...cfg,
		plugins: {
			...cfg.plugins,
			allow: [...allow, pluginId]
		}
	};
}
function removeInstalledPluginFromDenylist(cfg, pluginId) {
	const deny = cfg.plugins?.deny;
	if (!Array.isArray(deny) || !deny.includes(pluginId)) return cfg;
	const nextDeny = deny.filter((id) => id !== pluginId);
	const plugins = {
		...cfg.plugins,
		...nextDeny.length > 0 ? { deny: nextDeny } : {}
	};
	if (nextDeny.length === 0) delete plugins.deny;
	return {
		...cfg,
		plugins
	};
}
const CONFIG_MUTATION_ALLOWED = { mode: "allowed" };
function supportsInstallConfigSingleTopLevelIncludeShape(authoredSection) {
	if (!containsConfigIncludeDirective(authoredSection)) return true;
	return isRecord(authoredSection) && Object.keys(authoredSection).length === 1 && typeof authoredSection.$include === "string";
}
function resolveSingleTopLevelIncludePath(parsed, configPath, section) {
	const authoredSection = parsed[section];
	if (!isRecord(authoredSection) || Object.keys(authoredSection).length !== 1 || typeof authoredSection.$include !== "string") return null;
	return path.normalize(path.isAbsolute(authoredSection.$include) ? authoredSection.$include : path.resolve(path.dirname(configPath), authoredSection.$include));
}
function resolveConfigMutationPreflight(params) {
	if (Object.hasOwn(params.parsed, "$include")) return {
		mode: "blocked",
		scope: "config",
		reason: `Config ${params.section} are stored through an unsupported $include shape at the root; edit the included file directly or move ${params.section} into the root config before installing.`
	};
	if (!supportsInstallConfigSingleTopLevelIncludeShape(params.parsed[params.section])) return {
		mode: "blocked",
		scope: params.section,
		reason: `Config ${params.section} are stored through an unsupported $include shape; edit the included file directly or move ${params.section} to a single-file top-level include before installing.`
	};
	const includePath = resolveSingleTopLevelIncludePath(params.parsed, params.snapshotPath, params.section);
	if (!includePath) return CONFIG_MUTATION_ALLOWED;
	const expectedTarget = params.writeOptions.includeFileTargetsForWrite?.[includePath];
	let resolvedTarget = null;
	try {
		resolvedTarget = resolveConfigIncludeWritePath({
			configPath: params.snapshotPath,
			includePath,
			allowedRoots: []
		});
	} catch {}
	if (expectedTarget && resolvedTarget && path.normalize(expectedTarget) === path.normalize(resolvedTarget)) {
		const expectedHash = params.writeOptions.includeFileHashesForWrite?.[includePath];
		try {
			const raw = readConfigIncludeFileWithGuards({
				includePath,
				resolvedPath: resolvedTarget,
				rootRealDir: fs.realpathSync(path.dirname(params.snapshotPath))
			});
			if (expectedHash !== hashConfigIncludeRaw(raw)) return {
				mode: "blocked",
				scope: params.section,
				reason: `Config ${params.section} include changed since the config was read; rerun the install after reloading the config.`
			};
			if (containsConfigIncludeDirective(parseJsonWithJson5Fallback(raw))) return {
				mode: "blocked",
				scope: params.section,
				reason: `Config ${params.section} are stored through a nested $include; edit the included file directly or remove the nested $include before installing.`
			};
			return CONFIG_MUTATION_ALLOWED;
		} catch {
			return {
				mode: "blocked",
				scope: params.section,
				reason: `Config ${params.section} include could not be inspected at its snapshot target; rerun the install after repairing or reloading the config.`
			};
		}
	}
	return {
		mode: "blocked",
		scope: params.section,
		reason: `Config ${params.section} are stored in an external or unresolved top-level $include; edit the included file directly or move it under the config directory before installing.`
	};
}
function resolveInstallConfigMutationPreflights(params) {
	const pluginMutation = resolveConfigMutationPreflight({
		...params,
		section: "plugins"
	});
	const hookMutation = resolveConfigMutationPreflight({
		...params,
		section: "hooks"
	});
	const pluginIncludePath = resolveSingleTopLevelIncludePath(params.parsed, params.snapshotPath, "plugins");
	const hookIncludePath = resolveSingleTopLevelIncludePath(params.parsed, params.snapshotPath, "hooks");
	const pluginTarget = pluginIncludePath ? params.writeOptions.includeFileTargetsForWrite?.[pluginIncludePath] : void 0;
	const hookTarget = hookIncludePath ? params.writeOptions.includeFileTargetsForWrite?.[hookIncludePath] : void 0;
	if (pluginTarget && hookTarget && path.normalize(pluginTarget) === path.normalize(hookTarget)) {
		const blocked = {
			mode: "blocked",
			scope: "config",
			reason: "Config plugins and hooks share the same top-level $include target; split them into separate include files before installing."
		};
		return {
			hookMutation: blocked,
			pluginMutation: blocked
		};
	}
	return {
		hookMutation,
		pluginMutation
	};
}
function resolveCombinedPluginAndHookConfigMutationPreflight(params) {
	const pluginIncludePath = resolveSingleTopLevelIncludePath(params.parsed, params.snapshotPath, "plugins");
	const hookIncludePath = resolveSingleTopLevelIncludePath(params.parsed, params.snapshotPath, "hooks");
	if (!pluginIncludePath && !hookIncludePath) return CONFIG_MUTATION_ALLOWED;
	return {
		mode: "blocked",
		scope: "config",
		reason: "Config plugins and hooks cannot be updated together while either section uses a top-level $include; update them separately."
	};
}
function selectInstallMutationWriteOptions(writeOptions) {
	return {
		auditOrigin: "plugin-install",
		...writeOptions.assertConfigPathForWrite ? { assertConfigPathForWrite: writeOptions.assertConfigPathForWrite } : {},
		expectedConfigPath: writeOptions.expectedConfigPath,
		ownedConfigPathForWrite: writeOptions.ownedConfigPathForWrite,
		envSnapshotForRestore: writeOptions.envSnapshotForRestore,
		includeFileHashesForWrite: writeOptions.includeFileHashesForWrite,
		includeFileTargetsForWrite: writeOptions.includeFileTargetsForWrite
	};
}
function sourceMatchesInstalledPath(params) {
	const activeSource = resolveUserPath(params.activeSource, params.env);
	const installedSource = resolveUserPath(params.installedSource, params.env);
	return activeSource === installedSource || isPathInside(installedSource, activeSource);
}
function logShadowedNpmInstallWarning(params) {
	if (params.install.source !== "npm") return;
	const installedSource = params.install.installPath ?? params.install.sourcePath;
	if (!installedSource) return;
	const active = buildPluginSnapshotReport({
		config: params.config,
		effectiveOnly: true,
		onlyPluginIds: [params.pluginId]
	}).plugins.find((plugin) => plugin.id === params.pluginId);
	if (!active || active.origin !== "config" || sourceMatchesInstalledPath({
		activeSource: active.source,
		installedSource
	})) return;
	params.warn([
		`Warning: installed plugin "${params.pluginId}" is not the active source because a config-selected plugin with the same id is currently selected:`,
		`  active config source: ${shortenHomePath(active.source)}`,
		`  installed npm source: ${shortenHomePath(installedSource)}`,
		"Run `openclaw plugins doctor` for repair options."
	].join("\n"), `Installed plugin "${params.pluginId}" is shadowed by a configured plugin source. Run \`openclaw plugins doctor\`.`);
}
function resolveComparableInstallPath(install) {
	return install.installPath ?? install.sourcePath;
}
function shouldPreserveReplacedInstallPath(params) {
	const removalTarget = resolveUserPath(params.removalTarget);
	const nextInstallPath = resolveUserPath(params.nextInstallPath);
	return isPathInside(removalTarget, nextInstallPath) || isPathInside(nextInstallPath, removalTarget);
}
function resolveReplacedManagedInstallRemoval(params) {
	if (!params.previousInstall) return null;
	const previousInstallPath = resolveComparableInstallPath(params.previousInstall);
	const nextInstallPath = resolveComparableInstallPath(params.nextInstall);
	if (!previousInstallPath || !nextInstallPath) return null;
	if (params.previousInstall.source === "npm" && params.nextInstall.source === "npm") return null;
	if (shouldPreserveReplacedInstallPath({
		removalTarget: previousInstallPath,
		nextInstallPath
	})) return null;
	const plan = planPluginUninstall(recordPluginPackageUninstallPlan({
		config: { plugins: { installs: { [params.pluginId]: params.previousInstall } } },
		pluginId: params.pluginId,
		deleteFiles: true
	}, { runtimePluginIds: [] }));
	if (!plan.ok || !plan.directoryRemoval) return null;
	if (shouldPreserveReplacedInstallPath({
		removalTarget: plan.directoryRemoval.target,
		nextInstallPath
	})) return null;
	return plan.directoryRemoval;
}
function prepareConfigForDisabledInstall(config, pluginId) {
	const entry = config.plugins?.entries?.[pluginId];
	const policy = isRecord(entry) ? { ...entry } : {};
	delete policy.config;
	return {
		...config,
		plugins: {
			...config.plugins,
			entries: {
				...config.plugins?.entries,
				[pluginId]: {
					...policy,
					enabled: false
				}
			}
		}
	};
}
function resolvePluginConfigEnablement(params) {
	const manifest = params.manifest;
	if (!manifest?.configSchema) return { mode: "ready" };
	const entry = params.config.plugins?.entries?.[params.pluginId];
	const hasConfig = isRecord(entry) && Object.hasOwn(entry, "config");
	const result = validateJsonSchemaValue({
		schema: manifest.configSchema,
		cacheKey: manifest.schemaCacheKey ?? manifest.manifestPath,
		value: hasConfig ? entry.config : {},
		applyDefaults: true
	});
	if (result.ok) return { mode: "ready" };
	if (!hasConfig) return { mode: "missing" };
	return {
		mode: "invalid",
		error: result.errors[0]?.text ?? "invalid plugin config"
	};
}
async function persistPluginInstall(params) {
	const runtime = params.runtime ?? defaultRuntime;
	const warn = (message, managementMessage) => {
		params.persistenceLogger?.warn?.(managementMessage);
		runtime.log(theme.warn(message));
	};
	const { installRecords, persistedInstallRecords } = await tracePluginLifecyclePhaseAsync("install records load", async () => {
		const [records, persisted] = await Promise.all([loadInstalledPluginIndexInstallRecords(), readPersistedInstalledPluginIndexInstallRecords()]);
		return {
			installRecords: records,
			persistedInstallRecords: persisted
		};
	}, { command: "install" });
	const previousInstall = persistedInstallRecords?.[params.pluginId];
	const replacedInstallRemoval = resolveReplacedManagedInstallRemoval({
		pluginId: params.pluginId,
		previousInstall,
		nextInstall: params.install
	});
	const nextInstallRecords = recordPluginInstallInRecords(installRecords, {
		pluginId: params.pluginId,
		...params.install
	});
	const reconciledConfig = reconcileNpmPluginLoadPath({
		config: params.snapshot.config,
		previousInstall,
		nextInstall: params.install
	});
	const installedDiscovery = discoverOpenClawPlugins({ installRecords: nextInstallRecords });
	const realpathCache = /* @__PURE__ */ new Map();
	const targetPathKeys = new Set([params.install.installPath, params.install.sourcePath].filter((candidate) => Boolean(candidate?.trim())).map((candidate) => {
		const resolved = resolveUserPath(candidate, process.env);
		return safeRealpathSync(resolved, realpathCache) ?? path.resolve(resolved);
	}));
	const installedCandidates = installedDiscovery.candidates.filter((candidate) => {
		if (resolvePluginCandidateInstallOwner(candidate) === params.pluginId) return true;
		const resolved = resolveUserPath(candidate.packageDir ?? candidate.rootDir, process.env);
		const pathKey = safeRealpathSync(resolved, realpathCache) ?? path.resolve(resolved);
		return targetPathKeys.has(pathKey);
	});
	if (installedCandidates.some(isPluginCandidateInstallOwnerAmbiguous)) throw new Error(`Plugin package "${params.pluginId}" has ambiguous install ownership. Refresh the plugin registry or reinstall the package before retrying.`);
	const installedRegistry = loadPluginManifestRegistryCore({
		config: reconciledConfig,
		candidates: installedCandidates,
		diagnostics: installedDiscovery.diagnostics,
		installRecords: nextInstallRecords
	});
	if (installedRegistry.plugins.some(isPluginManifestInstallOwnerAmbiguous)) throw new Error(`Plugin package "${params.pluginId}" has ambiguous install ownership. Refresh the plugin registry or reinstall the package before retrying.`);
	const manifests = installedRegistry.plugins.filter((plugin) => resolvePluginManifestInstallOwner(plugin) === params.pluginId);
	if (manifests.length === 0) throw new Error(`Plugin package "${params.pluginId}" has no authoritative runtime child list. Refresh the plugin registry, then reinstall the package or run openclaw doctor before retrying.`);
	const ownedPluginIds = manifests.map((plugin) => plugin.id).toSorted();
	const manifestByPluginId = new Map(manifests.map((plugin) => [plugin.id, plugin]));
	const enablementByPluginId = new Map(ownedPluginIds.map((pluginId) => [pluginId, resolvePluginConfigEnablement({
		config: reconciledConfig,
		pluginId,
		manifest: manifestByPluginId.get(pluginId)
	})]));
	for (const [pluginId, configEnablement] of enablementByPluginId) if (configEnablement.mode === "invalid") throw new Error(`Plugin "${pluginId}" has invalid configured settings: ${configEnablement.error}. Fix plugins.entries.${pluginId}.config, then rerun the install.`);
	let next = reconciledConfig;
	const enabledPluginIds = [];
	for (const pluginId of ownedPluginIds) {
		const configEnablement = enablementByPluginId.get(pluginId) ?? { mode: "ready" };
		const explicitlyDisabled = reconciledConfig.plugins?.entries?.[pluginId]?.enabled === false;
		if (configEnablement.mode === "missing") next = prepareConfigForDisabledInstall(next, pluginId);
		if (params.enable === false) continue;
		next = removeInstalledPluginFromDenylist(addInstalledPluginToAllowlist(next, pluginId), pluginId);
		if (configEnablement.mode !== "ready" || explicitlyDisabled) continue;
		const enabled = enablePluginInConfig(next, pluginId, { updateChannelConfig: false });
		next = enabled.config;
		if (enabled.enabled) enabledPluginIds.push(pluginId);
	}
	const slotWarnings = [];
	for (const pluginId of enabledPluginIds) {
		const slotResult = await tracePluginLifecyclePhaseAsync("slot selection", async () => applySlotSelectionForPlugin(next, pluginId), {
			command: "install",
			pluginId
		});
		next = slotResult.config;
		slotWarnings.push(...slotResult.warnings);
	}
	next = withoutPluginInstallRecords(next);
	await tracePluginLifecyclePhaseAsync("config mutation", () => commitPluginInstallRecordsWithConfig({
		previousInstallRecords: installRecords,
		nextInstallRecords,
		nextConfig: next,
		baseHash: params.snapshot.baseHash,
		writeOptions: {
			...params.snapshot.writeOptions,
			afterWrite: {
				mode: "restart",
				reason: "plugin source changed"
			}
		}
	}), { command: "install" });
	if (replacedInstallRemoval) {
		const removalResult = await tracePluginLifecyclePhaseAsync("replaced install cleanup", () => applyPluginUninstallDirectoryRemoval(replacedInstallRemoval), {
			command: "install",
			pluginId: params.pluginId
		});
		for (const warning of removalResult.warnings) warn(warning, "A previous plugin installation could not be fully cleaned up. Run `openclaw plugins doctor`.");
		if (removalResult.directoryRemoved) runtime.log(theme.muted(`Removed previous plugin install directory: ${shortenHomePath(replacedInstallRemoval.target)}`));
	}
	await refreshPluginRegistryAfterConfigMutation({
		config: next,
		reason: "source-changed",
		installRecords: nextInstallRecords,
		invalidateRuntimeCache: params.invalidateRuntimeCache,
		traceCommand: "install",
		logger: { warn: (message) => warn(message, "Plugin registry refresh or runtime cache invalidation failed. Restart the gateway.") }
	});
	for (const warning of slotWarnings) warn(warning, warning);
	const configurationRequiredPluginIds = [...enablementByPluginId].filter(([, state]) => state.mode === "missing").map(([pluginId]) => pluginId);
	const configWarning = params.enable !== false && configurationRequiredPluginIds.length > 0 ? configurationRequiredPluginIds.length === 1 ? `Installed plugin "${configurationRequiredPluginIds[0]}" without enabling it because it requires configuration first. Configure it, then run \`openclaw plugins enable ${configurationRequiredPluginIds[0]}\`.` : `Installed plugin entries ${configurationRequiredPluginIds.join(", ")} without enabling them because they require configuration first. Configure each entry, then run \`openclaw plugins enable <plugin-id>\`.` : void 0;
	const warningMessage = [params.warningMessage, configWarning].filter(Boolean).join("\n");
	if (warningMessage) warn(warningMessage, configWarning ?? "Plugin installation reported a warning. Run `openclaw plugins doctor`.");
	runtime.log(params.successMessage ?? (ownedPluginIds.length > 1 ? `Installed plugin package ${params.pluginId}: ${ownedPluginIds.join(", ")}` : `Installed plugin: ${params.pluginId}`));
	logShadowedNpmInstallWarning({
		config: next,
		pluginId: params.pluginId,
		install: params.install,
		warn
	});
	runtime.log("Restart the gateway to load plugins.");
	return next;
}
//#endregion
export { supportsInstallConfigSingleTopLevelIncludeShape as a, selectInstallMutationWriteOptions as i, resolveCombinedPluginAndHookConfigMutationPreflight as n, resolveInstallConfigMutationPreflights as r, persistPluginInstall as t };
