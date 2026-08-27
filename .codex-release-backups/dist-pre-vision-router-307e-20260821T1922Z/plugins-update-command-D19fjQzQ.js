import "./src-BkwWvwB2.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { r as defaultRuntime } from "./runtime-DtFIMC-W.js";
import { Q as ConfigMutationConflictError, d as readConfigFileSnapshotForWrite, et as containsConfigIncludeDirective, r as getRuntimeConfig } from "./io-CeQckj5v.js";
import { n as VERSION } from "./version-o4XN9fka.js";
import { s as parseRegistryNpmSpec } from "./npm-registry-spec-D3pNhy09.js";
import { i as loadInstalledPluginIndex } from "./installed-plugin-index-CqyEIHSI.js";
import { n as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-PWJi_KhT.js";
import { n as resolveInstalledPluginPackageOwnership } from "./installed-plugin-package-ownership-DMNKpP-8.js";
import { r as theme } from "./theme-vjDs9tao.js";
import { n as formatInvalidConfigDetails, t as createInvalidConfigError } from "./io.invalid-config-Ghwrjj2j.js";
import { n as createMergePatch, t as applyMergePatch } from "./merge-patch-CQFyXoKe.js";
import { n as assertConfigWriteAllowedInCurrentMode } from "./nix-mode-write-guard-DFUnyZ_3.js";
import { r as replaceConfigFile } from "./mutate-DOUWd6so.js";
import "./config-Dl8DJbzM.js";
import { t as buildNpmResolutionFields } from "./install-source-utils-DqwMuR5d.js";
import { a as withPluginInstallRecords, o as withoutPluginInstallRecords, u as configReferencesNpmInstallPath } from "./installed-plugin-index-records-C5AmaeOQ.js";
import { a as hasMatchingPluginLoadPath, s as removePluginRuntimePolicyFromConfig } from "./uninstall-config-D8bR2yov.js";
import { t as withPluginLifecycleLease } from "./plugin-lifecycle-lease-wbp6QsX_.js";
import { G as resolvePluginInstallOwnerMigrations, J as settlePluginInstallTransactions, W as requestDeferredPluginInstall } from "./install-managed-npm-state-Jj1GJhPR.js";
import { i as commitPluginInstallRecordsWithConfig, r as commitPluginInstallRecordsOnly } from "./install-record-commit-DQjHzbZN.js";
import { n as refreshPluginRegistryAfterConfigMutation } from "./registry-refresh-clDTOJoC.js";
import { i as selectInstallMutationWriteOptions, n as resolveCombinedPluginAndHookConfigMutationPreflight, r as resolveInstallConfigMutationPreflights } from "./install-persistence-CWT1RvBg.js";
import { i as resolveHookInstallDir, n as installHooksFromNpmSpec } from "./install-Sg8kzawT.js";
import { f as resolveRegistryUpdateChannel, l as normalizeUpdateChannel } from "./update-channels-Dv2OGOSa.js";
import { r as promptYesNo } from "./prompt-B0zmTD08.js";
import { n as resolveClawHubRiskAcknowledgementCliOptions, t as resolveInstallPolicyWarningAcknowledgementCliOptions } from "./install-policy-warning-acknowledgement-DbmZTrl9.js";
import { n as recordHookInstall, t as readHookInstalls } from "./installs-DIditAvC.js";
import { r as readInstalledPackageVersion, t as expectedIntegrityForUpdate } from "./package-update-utils-BWe9VJp8.js";
import { a as pluginInstallRecordMayMigrateConfigId, i as isPluginInstallRecordUpdateSource, n as updateNpmInstalledPlugins, r as isClawHubTrustSkippedOutcome } from "./update-DYGHJ-bY.js";
import { t as notifyGatewayPluginMetadataChanged } from "./plugins-update-gateway-signal-Bn1NsuG-.js";
import { isDeepStrictEqual } from "node:util";
//#region src/hooks/update.ts
function createHookPackUpdateIntegrityDriftHandler(params) {
	return async (drift) => {
		const payload = {
			hookId: params.hookId,
			spec: drift.spec,
			expectedIntegrity: drift.expectedIntegrity,
			actualIntegrity: drift.actualIntegrity,
			resolution: drift.resolution,
			resolvedSpec: drift.resolution.resolvedSpec,
			resolvedVersion: drift.resolution.version,
			dryRun: params.dryRun
		};
		if (params.onIntegrityDrift) return await params.onIntegrityDrift(payload);
		params.logger.warn?.(`Integrity drift for hook pack "${params.hookId}" (${payload.resolvedSpec ?? payload.spec}): expected ${payload.expectedIntegrity}, got ${payload.actualIntegrity}`);
		return false;
	};
}
/** Update npm-installed hook packs and return config changes plus per-pack outcomes. */
async function updateNpmInstalledHookPacks(params) {
	const logger = params.logger ?? {};
	const installs = readHookInstalls();
	const targets = params.hookIds?.length ? params.hookIds : Object.keys(installs);
	const outcomes = [];
	let next = params.config;
	let changed = false;
	for (const hookId of targets) {
		const record = installs[hookId];
		if (!record) {
			outcomes.push({
				hookId,
				status: "skipped",
				message: `No install record for hook pack "${hookId}".`
			});
			continue;
		}
		if (record.source !== "npm") {
			outcomes.push({
				hookId,
				status: "skipped",
				message: `Skipping hook pack "${hookId}" (source: ${record.source}).`
			});
			continue;
		}
		const effectiveSpec = params.specOverrides?.[hookId] ?? record.spec;
		const expectedIntegrity = effectiveSpec === record.spec ? expectedIntegrityForUpdate(record.spec, record.integrity) : void 0;
		if (!effectiveSpec) {
			outcomes.push({
				hookId,
				status: "skipped",
				message: `Skipping hook pack "${hookId}" (missing npm spec).`
			});
			continue;
		}
		let installPath;
		try {
			installPath = record.installPath ?? resolveHookInstallDir(hookId);
		} catch (err) {
			outcomes.push({
				hookId,
				status: "error",
				message: `Invalid install path for hook pack "${hookId}": ${String(err)}`
			});
			continue;
		}
		const currentVersion = await readInstalledPackageVersion(installPath);
		const result = await installHooksFromNpmSpec({
			config: params.config,
			dangerouslyForceUnsafeInstall: params.dangerouslyForceUnsafeInstall,
			onInstallPolicyWarning: params.onInstallPolicyWarning,
			spec: effectiveSpec,
			mode: "update",
			dryRun: params.dryRun,
			expectedHookPackId: hookId,
			expectedIntegrity,
			onIntegrityDrift: createHookPackUpdateIntegrityDriftHandler({
				hookId,
				dryRun: Boolean(params.dryRun),
				logger,
				onIntegrityDrift: params.onIntegrityDrift
			}),
			logger
		});
		if (!result.ok) {
			outcomes.push({
				hookId,
				status: "error",
				message: `Failed to ${params.dryRun ? "check" : "update"} hook pack "${hookId}": ${result.error}`
			});
			continue;
		}
		const nextVersion = result.version ?? await readInstalledPackageVersion(result.targetDir);
		const currentLabel = currentVersion ?? "unknown";
		const nextLabel = nextVersion ?? "unknown";
		const status = currentVersion && nextVersion && currentVersion === nextVersion ? "unchanged" : "updated";
		if (params.dryRun) {
			outcomes.push({
				hookId,
				status,
				currentVersion: currentVersion ?? void 0,
				nextVersion: nextVersion ?? void 0,
				message: status === "unchanged" ? `Hook pack "${hookId}" is up to date (${currentLabel}).` : `Would update hook pack "${hookId}": ${currentLabel} -> ${nextLabel}.`
			});
			continue;
		}
		next = recordHookInstall(next, {
			hookId,
			source: "npm",
			spec: effectiveSpec,
			installPath: result.targetDir,
			version: nextVersion,
			...buildNpmResolutionFields(result.npmResolution),
			hooks: result.hooks
		});
		changed = true;
		outcomes.push({
			hookId,
			status,
			currentVersion: currentVersion ?? void 0,
			nextVersion: nextVersion ?? void 0,
			message: status === "unchanged" ? `Hook pack "${hookId}" already at ${currentLabel}.` : `Updated hook pack "${hookId}": ${currentLabel} -> ${nextLabel}.`
		});
	}
	return {
		config: next,
		changed,
		outcomes
	};
}
//#endregion
//#region src/plugins/plugin-package-update.ts
function capturePluginPackageUpdateSnapshot(params) {
	const snapshot = /* @__PURE__ */ new Map();
	for (const installOwner of new Set(params.installOwners)) {
		const ownership = resolveInstalledPluginPackageOwnership(params.index, installOwner, params.env);
		if (!ownership.ok) return ownership;
		snapshot.set(installOwner, ownership.value);
	}
	return {
		ok: true,
		value: snapshot
	};
}
function contributionKeys(index, pluginIds) {
	const keys = /* @__PURE__ */ new Set();
	for (const plugin of index.plugins) {
		if (!pluginIds.has(plugin.pluginId)) continue;
		for (const key of [...plugin.contributions?.channels ?? [], ...plugin.contributions?.channelConfigs ?? []]) keys.add(key);
	}
	return keys;
}
/** Reconcile policy for children removed by a package update. */
function reconcilePluginPackageUpdateConfig(params) {
	let config = params.config;
	for (const [installOwner, before] of params.snapshot) {
		const nextInstallOwner = params.installOwnerMigrations?.[installOwner] ?? installOwner;
		const after = resolveInstalledPluginPackageOwnership(params.afterIndex, nextInstallOwner, params.env);
		if (!after.ok) return after;
		const afterPluginIds = new Set(after.value.pluginIds);
		const removedPluginIds = before.pluginIds.filter((pluginId) => !afterPluginIds.has(pluginId));
		if (removedPluginIds.length === 0) continue;
		const retainedContributionKeys = contributionKeys(params.afterIndex, afterPluginIds);
		for (const pluginId of removedPluginIds) {
			const oldRecord = params.beforeIndex.plugins.find((plugin) => plugin.pluginId === pluginId);
			const channelIds = [...oldRecord?.contributions?.channels ?? [], ...oldRecord?.contributions?.channelConfigs ?? []].filter((channelId) => !retainedContributionKeys.has(channelId));
			config = removePluginRuntimePolicyFromConfig(config, pluginId, {
				channelIds,
				loadPaths: oldRecord?.source ? [oldRecord.source] : []
			}).config;
		}
	}
	return {
		ok: true,
		config
	};
}
function pluginPackageUpdateMayMutateConfig(params) {
	const plugins = params.config.plugins;
	const channels = params.config.channels;
	for (const ownership of params.snapshot.values()) {
		const pluginIds = new Set(ownership.pluginIds);
		const ownedSources = params.index.plugins.filter((plugin) => pluginIds.has(plugin.pluginId) && plugin.source).map((plugin) => plugin.source);
		if (hasMatchingPluginLoadPath(params.config, ownedSources)) return true;
		for (const pluginId of ownership.pluginIds) if (plugins?.allow?.includes(pluginId) || plugins?.deny?.includes(pluginId) || Object.hasOwn(plugins?.entries ?? {}, pluginId) || plugins?.slots?.memory === pluginId || plugins?.slots?.contextEngine === pluginId) return true;
		if (channels && [...contributionKeys(params.index, pluginIds)].some((key) => Object.hasOwn(channels, key))) return true;
	}
	return false;
}
//#endregion
//#region src/cli/plugins-update-outcomes.ts
/** Log update outcomes with severity styling and report whether any errors occurred. */
function logPluginUpdateOutcomes(params) {
	let hasErrors = false;
	for (const outcome of params.outcomes) {
		if (outcome.status === "error") {
			hasErrors = true;
			params.log(theme.error(outcome.message));
			if (outcome.channelFallback) params.log(theme.warn(outcome.channelFallback.message));
			continue;
		}
		if (outcome.status === "skipped") {
			if (isClawHubTrustSkippedOutcome(outcome)) hasErrors = true;
			params.log(theme.warn(outcome.message));
			if (outcome.channelFallback) params.log(theme.warn(outcome.channelFallback.message));
			continue;
		}
		params.log(outcome.message);
		if (outcome.channelFallback) params.log(theme.warn(outcome.channelFallback.message));
	}
	return { hasErrors };
}
//#endregion
//#region src/cli/plugins-install-records.ts
/** Return the installed npm package name for a plugin install record when available. */
function extractInstalledNpmPackageName(install) {
	if (install.source !== "npm") return;
	const resolvedName = install.resolvedName?.trim();
	if (resolvedName) return resolvedName;
	return (install.spec ? parseRegistryNpmSpec(install.spec)?.name : void 0) ?? (install.resolvedSpec ? parseRegistryNpmSpec(install.resolvedSpec)?.name : void 0);
}
/** Return the installed npm package name for a hook-pack install record when available. */
function extractInstalledNpmHookPackageName(install) {
	const resolvedName = install.resolvedName?.trim();
	if (resolvedName) return resolvedName;
	return (install.spec ? parseRegistryNpmSpec(install.spec)?.name : void 0) ?? (install.resolvedSpec ? parseRegistryNpmSpec(install.resolvedSpec)?.name : void 0);
}
//#endregion
//#region src/cli/plugins-update-selection.ts
/** Resolve a plugin update target and optional npm spec override from CLI input. */
function resolvePluginUpdateSelection(params) {
	if (params.all) {
		const rejectedOwners = Object.keys(params.installs).filter((pluginId) => params.rejectedPluginIds?.has(pluginId));
		if (rejectedOwners.length > 0) return {
			pluginIds: [],
			error: params.rejectedPluginIds?.get(rejectedOwners[0])
		};
		return { pluginIds: Object.keys(params.installs) };
	}
	if (!params.rawId) return { pluginIds: [] };
	if (params.rejectedPluginIds?.has(params.rawId)) return {
		pluginIds: [],
		error: params.rejectedPluginIds.get(params.rawId)
	};
	if (Object.hasOwn(params.installs, params.rawId)) return { pluginIds: [params.rawId] };
	const installOwner = params.installOwnerByPluginId?.get(params.rawId);
	if (installOwner && Object.hasOwn(params.installs, installOwner)) return { pluginIds: [installOwner] };
	const parsedSpec = parseRegistryNpmSpec(params.rawId);
	if (!parsedSpec) return { pluginIds: [] };
	const matches = Object.entries(params.installs).filter(([, install]) => {
		return extractInstalledNpmPackageName(install) === parsedSpec.name;
	});
	if (matches.length !== 1) return { pluginIds: [] };
	const [pluginId] = expectDefined(matches[0], "matches capture group 0");
	if (!pluginId) return { pluginIds: [] };
	if (params.rejectedPluginIds?.has(pluginId)) return {
		pluginIds: [],
		error: params.rejectedPluginIds.get(pluginId)
	};
	return {
		pluginIds: [pluginId],
		specOverrides: { [pluginId]: parsedSpec.raw }
	};
}
/** Resolve a hook-pack update target and optional npm spec override from CLI input. */
function resolveHookPackUpdateSelection(params) {
	if (params.all) return { hookIds: Object.keys(params.installs) };
	if (!params.rawId) return { hookIds: [] };
	if (Object.hasOwn(params.installs, params.rawId)) return { hookIds: [params.rawId] };
	const parsedSpec = parseRegistryNpmSpec(params.rawId);
	if (!parsedSpec || parsedSpec.selectorKind === "none") return { hookIds: [] };
	const matches = Object.entries(params.installs).filter(([, install]) => {
		return extractInstalledNpmHookPackageName(install) === parsedSpec.name;
	});
	if (matches.length !== 1) return { hookIds: [] };
	const [hookId] = expectDefined(matches[0], "matches capture group 0");
	if (!hookId) return { hookIds: [] };
	return {
		hookIds: [hookId],
		specOverrides: { [hookId]: parsedSpec.raw }
	};
}
//#endregion
//#region src/cli/plugins-update-command.ts
const DEPRECATED_DANGEROUS_FORCE_UNSAFE_UPDATE_WARNING = "--dangerously-force-unsafe-install is deprecated and no longer affects plugin updates because built-in install-time dangerous-code scanning has been removed. Configure security.installPolicy for operator-owned install decisions.";
function mayMutatePluginInstallRecord(record, specOverride) {
	if (!isPluginInstallRecordUpdateSource(record)) return false;
	if (record?.source === "npm") return Boolean(specOverride ?? record.spec);
	if (record?.source === "git") return Boolean(record.spec);
	if (record?.source === "clawhub") return Boolean(record.clawhubPackage);
	return Boolean(record?.marketplaceSource && record.marketplacePlugin);
}
function pluginConfigReferencesId(config, pluginId) {
	const plugins = config.plugins;
	return plugins?.allow?.includes(pluginId) || plugins?.deny?.includes(pluginId) || Object.hasOwn(plugins?.entries ?? {}, pluginId) || plugins?.slots?.memory === pluginId || plugins?.slots?.contextEngine === pluginId;
}
function shouldPreserveEmptyPlugins(params) {
	const plugins = params.sourceConfig.plugins;
	const parsedPlugins = params.parsed && typeof params.parsed === "object" && !Array.isArray(params.parsed) ? params.parsed.plugins : void 0;
	return Boolean(plugins && (!Object.hasOwn(plugins, "installs") || Object.keys(plugins).some((key) => key !== "installs") || containsConfigIncludeDirective(parsedPlugins)));
}
function projectUpdaterResultOntoSourceConfig(params) {
	const updatePatch = createMergePatch(params.runtimeBase, params.updatedConfig);
	return applyMergePatch(params.sourceBase, updatePatch);
}
function assertWriteOptionRecordFresh(params) {
	if (!isDeepStrictEqual(params.current ?? {}, params.expected ?? {})) throw new ConfigMutationConflictError(params.message, { currentHash: params.currentHash });
}
async function assertRecordsOnlyUpdateConfigFresh(params) {
	const prepared = await readConfigFileSnapshotForWrite(params.writeOptions);
	const writeOptions = {
		...prepared.writeOptions,
		...params.writeOptions
	};
	const currentHash = prepared.snapshot.hash ?? null;
	writeOptions.assertConfigPathForWrite?.();
	if (writeOptions.expectedConfigPath !== void 0 && writeOptions.expectedConfigPath !== prepared.snapshot.path) throw new ConfigMutationConflictError("config path changed since last load", {
		currentHash,
		retryable: false
	});
	if (params.baseHash !== void 0 && params.baseHash !== currentHash) throw new ConfigMutationConflictError("config changed since last load", { currentHash });
	assertWriteOptionRecordFresh({
		currentHash,
		current: prepared.writeOptions.includeFileTargetsForWrite,
		expected: params.writeOptions?.includeFileTargetsForWrite,
		message: "included config target changed since last load"
	});
	assertWriteOptionRecordFresh({
		currentHash,
		current: prepared.writeOptions.includeFileHashesForWrite,
		expected: params.writeOptions?.includeFileHashesForWrite,
		message: "included config changed since last load"
	});
	if (!prepared.snapshot.valid) throw createInvalidConfigError(prepared.snapshot.path, formatInvalidConfigDetails(prepared.snapshot.issues));
}
/** Run plugin/hook-pack updates, persist changed install records, and refresh runtime registry. */
async function runPluginUpdateCommand(params) {
	if (params.opts.dryRun) return await runPluginUpdateCommandUnlocked(params);
	assertConfigWriteAllowedInCurrentMode();
	return await withPluginLifecycleLease({}, async () => await runPluginUpdateCommandUnlocked(params));
}
async function runPluginUpdateCommandUnlocked(params) {
	if (!params.opts.dryRun) assertConfigWriteAllowedInCurrentMode();
	const sourceSnapshotPromise = readConfigFileSnapshotForWrite().then((prepared) => ({
		...prepared,
		writeOptions: selectInstallMutationWriteOptions(prepared.writeOptions)
	})).catch(() => null);
	const mutationSnapshot = params.opts.dryRun ? null : await sourceSnapshotPromise;
	if (!params.opts.dryRun && !mutationSnapshot) {
		defaultRuntime.error("Could not inspect config ownership before updating plugins or hooks.");
		return defaultRuntime.exit(1);
	}
	if (mutationSnapshot && !mutationSnapshot.snapshot.valid) {
		defaultRuntime.error("Cannot update plugins or hooks while the config is invalid.");
		return defaultRuntime.exit(1);
	}
	const cfg = mutationSnapshot?.snapshot.runtimeConfig ?? getRuntimeConfig();
	const sourceCfg = mutationSnapshot?.snapshot.sourceConfig ?? cfg;
	const persistedPluginInstallRecords = await loadInstalledPluginIndexInstallRecords();
	const pluginInstallRecords = persistedPluginInstallRecords;
	const cfgWithPluginInstallRecords = withPluginInstallRecords(cfg, pluginInstallRecords);
	const sourceCfgWithPluginInstallRecords = withPluginInstallRecords(sourceCfg, pluginInstallRecords);
	const installedPluginIndex = loadInstalledPluginIndex({
		config: cfgWithPluginInstallRecords,
		installRecords: pluginInstallRecords
	});
	const installOwnerByPluginId = /* @__PURE__ */ new Map();
	const rejectedPluginIds = /* @__PURE__ */ new Map();
	for (const pluginId of /* @__PURE__ */ new Set([...installedPluginIndex.plugins.map((plugin) => plugin.pluginId), ...Object.keys(pluginInstallRecords)])) {
		const ownership = resolveInstalledPluginPackageOwnership(installedPluginIndex, pluginId);
		if (!ownership.ok) {
			rejectedPluginIds.set(pluginId, ownership.error);
			continue;
		}
		installOwnerByPluginId.set(pluginId, ownership.value.installOwner);
		installOwnerByPluginId.set(ownership.value.installOwner, ownership.value.installOwner);
	}
	const configuredUpdateChannel = normalizeUpdateChannel(cfg.update?.channel) ?? void 0;
	const officialPluginUpdateChannel = resolveRegistryUpdateChannel({
		configChannel: configuredUpdateChannel,
		currentVersion: VERSION
	});
	const logger = {
		info: (msg) => defaultRuntime.log(msg),
		warn: (msg) => defaultRuntime.log(msg.includes("╭─") ? msg : theme.warn(msg))
	};
	if (params.opts.dangerouslyForceUnsafeInstall) defaultRuntime.log(theme.warn(DEPRECATED_DANGEROUS_FORCE_UNSAFE_UPDATE_WARNING));
	const pluginSelection = resolvePluginUpdateSelection({
		installs: pluginInstallRecords,
		installOwnerByPluginId,
		rejectedPluginIds,
		rawId: params.id,
		all: params.opts.all
	});
	if (pluginSelection.error) {
		defaultRuntime.error(pluginSelection.error);
		return defaultRuntime.exit(1);
	}
	const packageUpdateSnapshotResult = capturePluginPackageUpdateSnapshot({
		index: installedPluginIndex,
		installOwners: pluginSelection.pluginIds
	});
	if (!packageUpdateSnapshotResult.ok) {
		defaultRuntime.error(packageUpdateSnapshotResult.error);
		return defaultRuntime.exit(1);
	}
	const packageUpdateSnapshot = packageUpdateSnapshotResult.value;
	const selectedHooks = readHookInstalls();
	const hookSelection = resolveHookPackUpdateSelection({
		installs: selectedHooks,
		rawId: params.id,
		all: params.opts.all
	});
	if (pluginSelection.pluginIds.length === 0 && hookSelection.hookIds.length === 0) {
		if (params.opts.all) {
			defaultRuntime.log("No tracked plugins or hook packs to update.");
			return;
		}
		defaultRuntime.error(params.id ? `No tracked plugin or hook pack found for "${params.id}". Run "openclaw plugins list" or "openclaw hooks list" to inspect installed packages.` : "Provide a plugin or hook-pack id, or use --all.");
		return defaultRuntime.exit(1);
	}
	const pluginUpdateMayMutate = !params.opts.dryRun && pluginSelection.pluginIds.some((pluginId) => {
		return mayMutatePluginInstallRecord(pluginInstallRecords[pluginId], pluginSelection.specOverrides?.[pluginId]);
	});
	const hookUpdateMayMutate = !params.opts.dryRun && hookSelection.hookIds.some((hookId) => {
		const record = selectedHooks[hookId];
		return record?.source === "npm" && Boolean(hookSelection.specOverrides?.[hookId] ?? record.spec);
	});
	if (pluginUpdateMayMutate || hookUpdateMayMutate) {
		if (!mutationSnapshot) {
			defaultRuntime.error("Could not inspect config ownership before updating plugins or hooks.");
			return defaultRuntime.exit(1);
		}
		const { hookMutation, pluginMutation } = resolveInstallConfigMutationPreflights({
			parsed: mutationSnapshot.snapshot.parsed ?? {},
			snapshotPath: mutationSnapshot.snapshot.path,
			writeOptions: mutationSnapshot.writeOptions
		});
		const parsedConfig = mutationSnapshot.snapshot.parsed && typeof mutationSnapshot.snapshot.parsed === "object" && !Array.isArray(mutationSnapshot.snapshot.parsed) ? mutationSnapshot.snapshot.parsed : {};
		const pluginReferencesMayBeUnresolved = Object.hasOwn(parsedConfig, "$include") || containsConfigIncludeDirective(mutationSnapshot.snapshot.sourceConfig.plugins);
		const pluginIdMigrationMayMutate = pluginSelection.pluginIds.some((pluginId) => {
			return pluginInstallRecordMayMigrateConfigId({
				pluginId,
				record: pluginInstallRecords[pluginId],
				specOverride: pluginSelection.specOverrides?.[pluginId]
			}) && (pluginReferencesMayBeUnresolved || pluginConfigReferencesId(mutationSnapshot.snapshot.sourceConfig, pluginId));
		});
		const pluginLoadPathMayMutate = pluginSelection.pluginIds.some((pluginId) => configReferencesNpmInstallPath({
			config: cfg,
			install: pluginInstallRecords[pluginId]
		}));
		const pluginConfigMayMutate = pluginIdMigrationMayMutate || pluginLoadPathMayMutate || pluginPackageUpdateMayMutateConfig({
			config: mutationSnapshot.snapshot.sourceConfig,
			index: installedPluginIndex,
			snapshot: packageUpdateSnapshot
		});
		const blockedReasons = /* @__PURE__ */ new Set();
		if (pluginConfigMayMutate && pluginMutation.mode === "blocked") blockedReasons.add(pluginMutation.reason);
		if (hookUpdateMayMutate && hookMutation.mode === "blocked") blockedReasons.add(hookMutation.reason);
		if (pluginConfigMayMutate && hookUpdateMayMutate && pluginMutation.mode === "allowed" && hookMutation.mode === "allowed") {
			const combinedMutation = resolveCombinedPluginAndHookConfigMutationPreflight({
				parsed: mutationSnapshot.snapshot.parsed ?? {},
				snapshotPath: mutationSnapshot.snapshot.path
			});
			if (combinedMutation.mode === "blocked") blockedReasons.add(combinedMutation.reason);
		}
		if (blockedReasons.size > 0) {
			defaultRuntime.error(Array.from(blockedReasons).join(" "));
			return defaultRuntime.exit(1);
		}
	}
	const installPolicyWarningAcknowledgement = resolveInstallPolicyWarningAcknowledgementCliOptions({
		acknowledgeInstallPolicyWarning: params.opts.acknowledgeInstallPolicyWarning,
		dangerouslyForceUnsafeInstall: params.opts.dangerouslyForceUnsafeInstall,
		allowPrompt: !params.opts.dryRun
	});
	const deferredPluginTransactions = [];
	let pluginResult;
	try {
		pluginResult = pluginSelection.pluginIds.length > 0 ? await updateNpmInstalledPlugins(requestDeferredPluginInstall({
			config: cfgWithPluginInstallRecords,
			pluginIds: pluginSelection.pluginIds,
			specOverrides: pluginSelection.specOverrides,
			dryRun: params.opts.dryRun,
			updateChannel: params.opts.all ? void 0 : configuredUpdateChannel,
			officialPluginUpdateChannel,
			syncOfficialPluginInstalls: params.opts.all ? true : void 0,
			coreVersion: VERSION,
			...installPolicyWarningAcknowledgement,
			...resolveClawHubRiskAcknowledgementCliOptions({
				acknowledgeClawHubRisk: params.opts.acknowledgeClawHubRisk,
				action: "updating",
				allowPrompt: !params.opts.dryRun
			}),
			logger,
			onIntegrityDrift: async (drift) => {
				const specLabel = drift.resolvedSpec ?? drift.spec;
				defaultRuntime.log(theme.warn(`Integrity drift detected for "${drift.pluginId}" (${specLabel})\nExpected: ${drift.expectedIntegrity}\nActual:   ${drift.actualIntegrity}`));
				if (drift.dryRun) return true;
				return await promptYesNo(`Continue updating "${drift.pluginId}" with this artifact?`);
			}
		}, deferredPluginTransactions)) : {
			config: cfgWithPluginInstallRecords,
			changed: false,
			outcomes: []
		};
	} catch (error) {
		await settlePluginInstallTransactions(deferredPluginTransactions, "rollback");
		throw error;
	}
	const settlePluginTransactions = async (action) => {
		await settlePluginInstallTransactions(deferredPluginTransactions, action);
	};
	let packageCommitFinalized = false;
	try {
		if (pluginSelection.pluginIds.length > 0 && pluginResult.changed && !params.opts.dryRun) {
			const nextInstallRecords = pluginResult.config.plugins?.installs ?? {};
			const afterIndex = loadInstalledPluginIndex({
				config: pluginResult.config,
				installRecords: nextInstallRecords
			});
			const reconciled = reconcilePluginPackageUpdateConfig({
				config: pluginResult.config,
				beforeIndex: installedPluginIndex,
				afterIndex,
				snapshot: packageUpdateSnapshot,
				installOwnerMigrations: resolvePluginInstallOwnerMigrations(pluginResult)
			});
			if (!reconciled.ok) {
				await settlePluginTransactions("rollback");
				defaultRuntime.error(reconciled.error);
				return defaultRuntime.exit(1);
			}
			pluginResult = {
				...pluginResult,
				config: reconciled.config
			};
		}
		const hookResult = hookSelection.hookIds.length > 0 ? await updateNpmInstalledHookPacks({
			config: pluginResult.config,
			hookIds: hookSelection.hookIds,
			specOverrides: hookSelection.specOverrides,
			dryRun: params.opts.dryRun,
			...installPolicyWarningAcknowledgement,
			logger,
			onIntegrityDrift: async (drift) => {
				const specLabel = drift.resolvedSpec ?? drift.spec;
				defaultRuntime.log(theme.warn(`Integrity drift detected for hook pack "${drift.hookId}" (${specLabel})\nExpected: ${drift.expectedIntegrity}\nActual:   ${drift.actualIntegrity}`));
				if (drift.dryRun) return true;
				return await promptYesNo(`Continue updating hook pack "${drift.hookId}" with this artifact?`);
			}
		}) : {
			config: pluginResult.config,
			changed: false,
			outcomes: []
		};
		const outcomeSummary = logPluginUpdateOutcomes({
			outcomes: [...pluginResult.outcomes, ...hookResult.outcomes],
			log: (message) => defaultRuntime.log(message)
		});
		if (!params.opts.dryRun && (pluginResult.changed || hookResult.changed)) {
			const sourceSnapshot = mutationSnapshot ?? await sourceSnapshotPromise;
			if (pluginResult.changed) {
				const currentInstallRecords = await loadInstalledPluginIndexInstallRecords();
				const currentSnapshot = capturePluginPackageUpdateSnapshot({
					index: installedPluginIndex,
					installOwners: pluginSelection.pluginIds
				});
				if (!isDeepStrictEqual(currentInstallRecords, persistedPluginInstallRecords) || !currentSnapshot.ok || !isDeepStrictEqual([...currentSnapshot.value], [...packageUpdateSnapshot])) {
					await settlePluginTransactions("rollback");
					defaultRuntime.error(currentSnapshot.ok ? "Plugin package ownership changed during update; no config or index changes were committed. Refresh the plugin registry and retry." : currentSnapshot.error);
					return defaultRuntime.exit(1);
				}
			}
			const nextPluginInstallRecords = pluginResult.config.plugins?.installs ?? {};
			const shouldPersistPluginInstallIndex = pluginResult.changed || Object.keys(pluginInstallRecords).length > 0;
			const nextConfig = withoutPluginInstallRecords(projectUpdaterResultOntoSourceConfig({
				runtimeBase: cfgWithPluginInstallRecords,
				sourceBase: sourceCfgWithPluginInstallRecords,
				updatedConfig: hookResult.config
			}), { preserveEmptyPlugins: shouldPreserveEmptyPlugins({
				parsed: sourceSnapshot?.snapshot.parsed,
				sourceConfig: sourceSnapshot?.snapshot.sourceConfig ?? {}
			}) });
			let recordsOnlyPluginUpdate = false;
			if (shouldPersistPluginInstallIndex) if (isDeepStrictEqual(nextConfig, sourceSnapshot?.snapshot.sourceConfig ?? sourceCfg)) {
				await commitPluginInstallRecordsOnly({
					previousInstallRecords: persistedPluginInstallRecords,
					nextInstallRecords: nextPluginInstallRecords,
					nextConfig,
					verifyConfigFresh: async () => {
						await assertRecordsOnlyUpdateConfigFresh({
							baseHash: sourceSnapshot?.snapshot.hash,
							writeOptions: sourceSnapshot?.writeOptions
						});
					}
				});
				recordsOnlyPluginUpdate = pluginResult.changed;
			} else await commitPluginInstallRecordsWithConfig({
				previousInstallRecords: persistedPluginInstallRecords,
				nextInstallRecords: nextPluginInstallRecords,
				nextConfig,
				baseHash: sourceSnapshot?.snapshot.hash,
				writeOptions: {
					...sourceSnapshot?.writeOptions,
					afterWrite: {
						mode: "restart",
						reason: "plugin source changed"
					}
				}
			});
			else await replaceConfigFile({
				nextConfig,
				baseHash: sourceSnapshot?.snapshot.hash,
				writeOptions: sourceSnapshot?.writeOptions
			});
			packageCommitFinalized = true;
			await settlePluginTransactions("commit");
			if (pluginResult.changed) {
				await refreshPluginRegistryAfterConfigMutation({
					config: nextConfig,
					reason: "source-changed",
					installRecords: nextPluginInstallRecords,
					invalidateRuntimeCache: false,
					logger
				});
				if (recordsOnlyPluginUpdate) await notifyGatewayPluginMetadataChanged(cfg);
			}
			defaultRuntime.log("Restart the gateway to load plugins and hooks.");
		}
		if (outcomeSummary.hasErrors) defaultRuntime.exit(1);
	} catch (error) {
		if (!packageCommitFinalized) await settlePluginTransactions("rollback");
		throw error;
	}
}
//#endregion
export { runPluginUpdateCommand as t };
