import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { n as isTruthyEnvValue } from "./env-uyT2Z2BT.js";
import { f as resolveHomeDir } from "./utils-D9gvQMP6.js";
import { d as resolveCanonicalConfigPath } from "./paths-CqeDjSA4.js";
import { t as ExitError } from "./runtime-DtFIMC-W.js";
import { _ as recoverConfigFromLastKnownGood, a as preserveConfigSnapshotAsClobbered, f as readConfigFileSnapshotWithPluginMetadata, g as recoverConfigFromJsonRootSuffix, l as readConfigFileSnapshot, tt as parseConfigJson5 } from "./io-BTBpQ7uO.js";
import { s as resolveCompatibilityHostVersion } from "./version-o4XN9fka.js";
import { c as resolveEffectiveEnableState, s as normalizePluginsConfig } from "./config-state-DLiU5GYQ.js";
import { r as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-gKE3myqW.js";
import { x as assertOpenClawStateWriteAllowedAtPath } from "./openclaw-state-db-BciZ4rHE.js";
import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-C1wvGC4M.js";
import "./env-vars-DOg189uj.js";
import { u as hashRuntimeConfigValue } from "./runtime-snapshot-DIuCzlel.js";
import { n as formatConfigIssueLines } from "./issue-format-wyiFLwqS.js";
import { a as formatPluginVerificationDiagnostic, c as setActiveDegradedPlugins, t as buildDegradedPluginsFromVerificationFailures } from "./runtime-degraded-state-D2KYvUdx.js";
import { t as note } from "./note-C_xoKlB9.js";
import { r as noteIncludeConfinementWarning } from "./doctor-config-analysis--_78vSq1.js";
import { t as migrateLegacyConfig } from "./legacy-config-migrate-DEI20RUm.js";
import { t as addDoctorLegacyIssues } from "./legacy-config-issues-8n13Sw2q.js";
import { n as createDoctorPluginMetadataSnapshotScope, t as completeDoctorPluginMetadataSnapshot } from "./plugin-metadata-snapshot-scope-BcAGslRg.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/commands/doctor/shared/legacy-config-state-migration-input.ts
function resolveStateMigrationConfigInput(params) {
	const pluginDoctorConfig = params.snapshot.sourceConfig ?? params.snapshot.config ?? params.snapshot.parsed;
	if (params.snapshot.valid) return params.snapshot.legacyIssues.length > 0 && pluginDoctorConfig !== void 0 ? {
		cfg: params.baseConfig,
		pluginDoctorConfig
	} : { cfg: params.baseConfig };
	const migrationSource = pluginDoctorConfig ?? params.snapshot.parsed;
	if (params.snapshot.legacyIssues.length === 0 || migrationSource === void 0) return null;
	const migrated = migrateLegacyConfig(migrationSource);
	if (!migrated.config) return null;
	if (migrated.partiallyValid) return { pluginDoctorConfig: pluginDoctorConfig ?? migrationSource };
	return {
		cfg: migrated.config,
		...pluginDoctorConfig ? { pluginDoctorConfig } : {}
	};
}
//#endregion
//#region src/commands/doctor-config-preflight-checkpoint.ts
function resolveMigrationCheckpointIdentity(params) {
	if (!params.snapshot.valid || !params.pluginMigrationFingerprint) return null;
	const stateMigrationInput = resolveStateMigrationConfigInput({
		snapshot: params.snapshot,
		baseConfig: params.baseConfig
	});
	const effectiveConfig = stateMigrationInput?.cfg ?? params.baseConfig;
	const pluginDoctorConfig = stateMigrationInput?.pluginDoctorConfig ?? effectiveConfig;
	return {
		effectiveConfigFingerprint: hashRuntimeConfigValue(effectiveConfig),
		pluginDoctorConfigFingerprint: hashRuntimeConfigValue(pluginDoctorConfig),
		pluginMigrationFingerprint: params.pluginMigrationFingerprint
	};
}
function migrationCheckpointIdentitiesMatch(left, right) {
	return left !== null && right !== null && left.effectiveConfigFingerprint === right.effectiveConfigFingerprint && left.pluginDoctorConfigFingerprint === right.pluginDoctorConfigFingerprint && left.pluginMigrationFingerprint === right.pluginMigrationFingerprint;
}
//#endregion
//#region src/commands/doctor-config-preflight-measure.ts
const startupPreflightTraceStartedAt = performance.now();
async function measureGatewayStartupPreflightStep(name, run) {
	if (!isTruthyEnvValue(process.env.OPENCLAW_GATEWAY_STARTUP_TRACE)) return await run();
	const startedAt = performance.now();
	try {
		return await run();
	} finally {
		const durationMs = performance.now() - startedAt;
		const totalMs = performance.now() - startupPreflightTraceStartedAt;
		const { formatConsoleDiagnosticLine } = await import("./json-console-line-BVGe0_he.js");
		const message = `[gateway] startup trace: cli.bootstrap.${name} ${durationMs.toFixed(1)}ms total=${totalMs.toFixed(1)}ms`;
		process.stderr.write(`${formatConsoleDiagnosticLine({
			level: "info",
			message
		})}\n`);
	}
}
async function measureDoctorConfigPreflightStep(name, run, measure) {
	const tracedRun = () => measureGatewayStartupPreflightStep(name, run);
	return measure ? await measure(`doctor.config-preflight.${name}`, tracedRun) : await tracedRun();
}
//#endregion
//#region src/commands/doctor-config-preflight-plugin-index.ts
const loadInstalledPluginIndexStore = createLazyRuntimeModule(() => import("./installed-plugin-index-store-D5ka-f8C.js"));
function throwPluginRegistryPersistenceFailed(reason) {
	throw new Error(`OpenClaw refreshed the plugin registry but could not verify the persisted replacement (${reason}); refusing to write the migration checkpoint. Run "openclaw doctor --fix" and retry.`);
}
async function readDoctorConfigPreflightSnapshot(params) {
	const sharedOptions = {
		...params.observe === false ? { observe: false } : {},
		...params.measure ? { measure: params.measure } : {},
		...params.allowCurrentPluginMetadata ? {} : { allowCurrentPluginMetadata: false }
	};
	if (params.includePluginMetadata && !params.skipPluginValidation) {
		const result = await readConfigFileSnapshotWithPluginMetadata(sharedOptions);
		const pluginMetadataSnapshot = params.preparePluginMetadataSnapshot ? completeDoctorPluginMetadataSnapshot({
			snapshot: result.pluginMetadataSnapshot,
			config: result.snapshot.sourceConfig ?? result.snapshot.config ?? {}
		}) : result.pluginMetadataSnapshot;
		return {
			snapshot: addDoctorLegacyIssues(result.snapshot, pluginMetadataSnapshot),
			pluginMigrationFingerprint: pluginMetadataSnapshot?.configFingerprint?.trim() || null,
			...pluginMetadataSnapshot ? { pluginMetadataSnapshot } : {}
		};
	}
	return {
		snapshot: addDoctorLegacyIssues(await readConfigFileSnapshot({
			...sharedOptions,
			skipPluginValidation: params.skipPluginValidation
		})),
		pluginMigrationFingerprint: null
	};
}
function needsRefreshedPluginIndexPersistence(snapshotRead) {
	return snapshotRead.pluginMetadataSnapshot?.registrySource === "derived";
}
async function persistRefreshedPluginIndex(params) {
	const derivedPluginMetadataSnapshot = params.snapshotRead.pluginMetadataSnapshot;
	if (!derivedPluginMetadataSnapshot || !params.snapshotRead.pluginMigrationFingerprint) throwPluginRegistryPersistenceFailed("derived metadata was incomplete");
	const lease = params.lease;
	if (!lease) throwPluginRegistryPersistenceFailed("startup migration lease was not acquired");
	const { writePersistedInstalledPluginIndexWithLeaseSync } = await params.measure("plugin-index-store-import", loadInstalledPluginIndexStore);
	await params.measure("plugin-index-persistence", () => writePersistedInstalledPluginIndexWithLeaseSync(derivedPluginMetadataSnapshot.index, {
		env: params.env,
		lease
	}));
	const persistedSnapshotRead = await params.readPersistedSnapshot();
	const persistedPluginMetadataSnapshot = persistedSnapshotRead.pluginMetadataSnapshot;
	if (persistedPluginMetadataSnapshot?.registrySource !== "persisted") {
		const diagnosticCodes = persistedPluginMetadataSnapshot?.registryDiagnostics.map((diagnostic) => diagnostic.code);
		throwPluginRegistryPersistenceFailed(`reread source was ${persistedPluginMetadataSnapshot?.registrySource ?? "missing"}${diagnosticCodes?.length ? `; diagnostics: ${diagnosticCodes.join(", ")}` : ""}`);
	}
	return persistedSnapshotRead;
}
//#endregion
//#region src/commands/doctor-config-preflight-plugin-verification.ts
async function planStartupPluginVerification(params) {
	const { planStartupPluginConvergence } = await measureDoctorConfigPreflightStep("plugin-plan-import", () => import("./startup-plugin-convergence-plan-DPa1j4M7.js"), params.measure);
	return await measureDoctorConfigPreflightStep("plugin-plan", () => planStartupPluginConvergence({
		config: params.cfg,
		env: params.env
	}), params.measure);
}
function isStartupPluginVerificationFailureActive(params) {
	return resolveEffectiveEnableState({
		id: params.failure.pluginId,
		origin: "global",
		config: normalizePluginsConfig(params.cfg.plugins),
		rootConfig: params.cfg
	}).enabled;
}
function buildStartupPluginQuarantine(params) {
	return buildDegradedPluginsFromVerificationFailures(params.failures.filter((failure) => Boolean(failure.installPath) && isStartupPluginVerificationFailureActive({
		cfg: params.cfg,
		failure
	})));
}
function formatStartupPluginSmokeFailure(failure) {
	return `Plugin "${failure.pluginId}": ${formatPluginVerificationDiagnostic({
		kind: "plugin-verification",
		reason: failure.reason,
		detail: failure.detail,
		...failure.installPath ? { installPath: failure.installPath } : {}
	})}. Run \`openclaw update repair\` to retry plugin repair.`;
}
async function runStartupUpgradeConvergence(params) {
	if (!(await planStartupPluginVerification(params)).required) return {
		blockingDiagnostic: null,
		quarantinedPlugins: []
	};
	const { runPostCorePluginConvergence } = await measureDoctorConfigPreflightStep("plugin-convergence-import", () => import("./post-core-plugin-convergence-BYkTyHtR.js"), params.measure);
	const convergence = await measureDoctorConfigPreflightStep("plugin-convergence", () => runPostCorePluginConvergence({
		cfg: params.cfg,
		env: params.env,
		compatibilityHostVersion: resolveCompatibilityHostVersion(params.env)
	}), params.measure);
	if (convergence.changes.length > 0) note(convergence.changes.map((entry) => `- ${entry}`).join("\n"), "Doctor changes");
	const notices = convergence.notices ?? [];
	if (notices.length > 0) note(notices.map((notice) => `- ${notice.message} ${notice.guidance.join(" ")}`.trim()).join("\n"), "Doctor notices");
	const warnings = convergence.warnings.map((warning) => `${warning.message} ${warning.guidance.join(" ")}`.trim());
	if (warnings.length > 0) note(warnings.map((warning) => `- ${warning}`).join("\n"), "Doctor warnings");
	const quarantinedPlugins = buildStartupPluginQuarantine({
		cfg: params.cfg,
		failures: convergence.smokeFailures
	});
	const nonBlockingWarningKeys = new Set(convergence.smokeFailures.filter((failure) => Boolean(failure.installPath) || !isStartupPluginVerificationFailureActive({
		cfg: params.cfg,
		failure
	})).map((failure) => JSON.stringify([failure.pluginId, `${failure.reason}: ${failure.detail}`])));
	const blockingMessages = convergence.warnings.filter((warning) => !warning.pluginId || !nonBlockingWarningKeys.has(JSON.stringify([warning.pluginId, warning.reason]))).map((warning) => `${warning.message} ${warning.guidance.join(" ")}`.trim());
	return {
		blockingDiagnostic: blockingMessages.length > 0 ? {
			kind: "plugin-verification",
			messages: blockingMessages
		} : null,
		quarantinedPlugins
	};
}
async function refreshStartupPluginQuarantine(params) {
	const plan = await planStartupPluginVerification(params);
	if (!plan.required) return {
		blockingDiagnostic: null,
		quarantinedPlugins: []
	};
	const { runActivePluginPayloadSmokeCheck } = await measureDoctorConfigPreflightStep("plugin-payload-verification-import", () => import("./active-plugin-payload-validation-ClVBQikU.js"), params.measure);
	const smoke = await measureDoctorConfigPreflightStep("plugin-payload-verification", () => runActivePluginPayloadSmokeCheck({
		cfg: params.cfg,
		records: plan.installRecords,
		env: params.env
	}), params.measure);
	const result = mapStartupPluginQuarantineRefresh({
		cfg: params.cfg,
		failures: smoke.failures
	});
	if (result.quarantinedPlugins.length > 0) note(result.quarantinedPlugins.map((plugin) => `- ${formatStartupPluginSmokeFailure({
		pluginId: plugin.pluginId,
		reason: plugin.diagnostic.reason,
		detail: plugin.diagnostic.detail,
		...plugin.diagnostic.installPath ? { installPath: plugin.diagnostic.installPath } : {}
	})}`).join("\n"), "Doctor warnings");
	return result;
}
function mapStartupPluginQuarantineRefresh(params) {
	const quarantinedPlugins = buildStartupPluginQuarantine(params);
	const blockingFailures = params.failures.filter((failure) => !failure.installPath && isStartupPluginVerificationFailureActive({
		cfg: params.cfg,
		failure
	}));
	return {
		blockingDiagnostic: blockingFailures.length > 0 ? {
			kind: "plugin-verification",
			messages: blockingFailures.map(formatStartupPluginSmokeFailure)
		} : null,
		quarantinedPlugins
	};
}
function formatStartupPluginVerificationFailure(diagnostic) {
	return [
		"OpenClaw plugin verification failed; refusing to report the gateway ready.",
		...diagnostic.messages.map((message) => `- ${message}`),
		"Resolve the plugin verification errors above, then restart the Gateway."
	].join("\n");
}
//#endregion
//#region src/commands/doctor-config-preflight.cron.ts
/** Restores retired cron migration inputs that canonical config migration intentionally strips. */
function withLegacyConfig(config, legacyConfig) {
	const legacyCron = legacyConfig?.cron;
	if (!legacyCron || !Object.hasOwn(legacyCron, "store") && !Object.hasOwn(legacyCron, "webhook")) return config;
	return {
		...config,
		cron: {
			...config.cron,
			...Object.hasOwn(legacyCron, "store") ? { store: legacyCron.store } : {},
			...Object.hasOwn(legacyCron, "webhook") ? { webhook: legacyCron.webhook } : {}
		}
	};
}
/** Isolates the trusted partition selector from a partially valid legacy config. */
function retainStoreConfig(config) {
	const cron = config?.cron;
	if (typeof cron?.store !== "string" || !cron.store.trim()) return;
	return { cron: {
		store: cron.store,
		...Object.hasOwn(cron, "webhook") ? { webhook: cron.webhook } : {}
	} };
}
//#endregion
//#region src/commands/doctor-config-preflight.ts
/** Config preflight for doctor: legacy config/state migration, recovery, and snapshot loading. */
const loadDoctorStateMigrations = createLazyRuntimeModule(() => import("./doctor-state-migrations-CZltBM2v.js"));
const loadLegacyCronRepair = createLazyRuntimeModule(() => import("./legacy-repair-c6vnhuNX.js"));
async function maybeMigrateLegacyConfig() {
	const changes = [];
	const home = resolveHomeDir();
	if (!home) return changes;
	const targetPath = resolveCanonicalConfigPath();
	const targetDir = path.dirname(targetPath);
	try {
		await fs.access(targetPath);
		return changes;
	} catch {}
	const legacyCandidates = [path.join(home, ".clawdbot", "clawdbot.json")];
	let legacyPath = null;
	for (const candidate of legacyCandidates) try {
		await fs.access(candidate);
		legacyPath = candidate;
		break;
	} catch {}
	if (!legacyPath) return changes;
	await fs.mkdir(targetDir, { recursive: true });
	try {
		await fs.copyFile(legacyPath, targetPath, fs.constants.COPYFILE_EXCL);
		changes.push(`Migrated legacy config: ${legacyPath} -> ${targetPath}`);
	} catch {}
	return changes;
}
/** Returns true during updater-managed config rewrites where plugin validation may be stale. */
function shouldSkipPluginValidationForDoctorConfigPreflight(env = process.env) {
	return isTruthyEnvValue(env.OPENCLAW_UPDATE_IN_PROGRESS);
}
function noteStateMigrationResult(result) {
	if (result.changes.length > 0) note(result.changes.map((entry) => `- ${entry}`).join("\n"), "Doctor changes");
	const notices = result.notices ?? [];
	if (notices.length > 0) note(notices.map((entry) => `- ${entry}`).join("\n"), "Doctor notices");
	if (result.warnings.length > 0) note(result.warnings.map((entry) => `- ${entry}`).join("\n"), "Doctor warnings");
}
function formatStartupMigrationFailure(params) {
	return [
		"OpenClaw startup migrations did not complete cleanly; refusing to report the gateway ready.",
		...[...params.warnings.map((warning) => `- ${warning}`), ...params.blockers.map((blocker) => `- ${blocker}`)],
		"Run \"openclaw doctor --fix\" against the same state/config, then restart the gateway."
	].join("\n");
}
function throwStartupMigrationRefusal(message) {
	console.error(message);
	throw new ExitError(1, message);
}
function throwStartupMigrationGuardRejected() {
	throw new Error("OpenClaw startup migrations were skipped because the selected config changed during startup; refusing to report the gateway ready. Retry startup so the new config can be validated.");
}
function throwStartupMigrationIdentityChanged() {
	throwStartupMigrationRefusal("OpenClaw plugin migration inputs changed during startup convergence; refusing to report the gateway ready. Restart OpenClaw so state migrations run against the final config and plugin inventory.");
}
/**
* Runs early doctor config checks before the main config repair flow.
*
* It may migrate legacy state/config paths, recover corrupt target config when requested, and
* returns the best-effort config snapshot used by later doctor checks.
*/
async function runDoctorConfigPreflight(options = {}) {
	const stateMigrationsRequested = options.migrateState !== false;
	if (stateMigrationsRequested) await assertOpenClawStateWriteAllowedAtPath({
		databasePath: resolveOpenClawStateSqlitePath(process.env),
		env: process.env
	});
	const measurePreflightStep = (name, run) => measureDoctorConfigPreflightStep(name, run, options.measure);
	const gatewayStartupCheckpointRequired = options.requireStartupMigrationCheckpoint === true;
	let migrationCheckpoint = gatewayStartupCheckpointRequired || options.requireStateMigrationCheckpoint === true ? await measurePreflightStep("startup-checkpoint-import", () => import("./startup-migration-checkpoint-CIELehTC.js")) : void 0;
	let stateMigrations;
	let startupMigrationEnv = process.env;
	let shouldRecordStateCheckpoint = false;
	let shouldRecordStartupCheckpoint = false;
	let shouldPersistRefreshedPluginIndex;
	let migrationCheckpointIdentity = null;
	let skipPristineStartupStateMigrations = options.skipPristineStartupStateMigrations === true;
	let skipPristineCoreStateMigrations = skipPristineStartupStateMigrations || options.skipPristineCoreStateMigrations === true;
	let startupMigrationLease;
	let startupMigrationHeartbeat;
	let startupMigrationHeartbeatError;
	const startupMigrationWarnings = [];
	const cronCodexRuntimePolicyTargets = [];
	let doctorMediaPersistenceAttempted = false;
	let legacyConfigMigrationComplete = false;
	let configSnapshotRead;
	const { run: runWithPluginMetadataSnapshot } = createDoctorPluginMetadataSnapshotScope({
		getBaseSnapshot: () => configSnapshotRead?.pluginMetadataSnapshot,
		env: process.env
	});
	const ensureStartupMigrationLease = async () => {
		if (startupMigrationLease || !migrationCheckpoint) return;
		startupMigrationLease = await migrationCheckpoint.acquireStartupMigrationLeaseWithWait({ env: startupMigrationEnv });
		configSnapshotRead = await readConfigSnapshotForPreflight();
		const latestBaseConfig = configSnapshotRead.snapshot.sourceConfig ?? configSnapshotRead.snapshot.config ?? {};
		migrationCheckpointIdentity = resolveMigrationCheckpointIdentity({
			snapshot: configSnapshotRead.snapshot,
			baseConfig: latestBaseConfig,
			pluginMigrationFingerprint: configSnapshotRead.pluginMigrationFingerprint
		});
		shouldRecordStateCheckpoint = stateMigrationsRequested && migrationCheckpoint.needsStateMigrationCheckpoint({
			env: startupMigrationEnv,
			identity: migrationCheckpointIdentity
		});
		shouldRecordStartupCheckpoint = gatewayStartupCheckpointRequired && migrationCheckpoint.needsStartupMigrationCheckpoint({
			env: startupMigrationEnv,
			identity: migrationCheckpointIdentity
		});
		shouldPersistRefreshedPluginIndex = needsRefreshedPluginIndexPersistence(configSnapshotRead);
		if (!shouldRecordStateCheckpoint && !shouldRecordStartupCheckpoint && !shouldPersistRefreshedPluginIndex) {
			startupMigrationLease.release();
			startupMigrationLease = void 0;
			return;
		}
		startupMigrationHeartbeat = setInterval(() => {
			try {
				startupMigrationLease?.heartbeat();
			} catch (error) {
				startupMigrationHeartbeatError = error;
			}
		}, 6e4);
		startupMigrationHeartbeat.unref?.();
	};
	const noteStartupStateMigrationResult = (result) => {
		startupMigrationWarnings.push(...result.warnings);
		noteStateMigrationResult(result);
	};
	const migrateLegacyConfigIfNeeded = async () => {
		if (legacyConfigMigrationComplete) return;
		legacyConfigMigrationComplete = true;
		if (options.migrateLegacyConfig === false) return;
		const legacyConfigChanges = await measurePreflightStep("legacy-config-migration", maybeMigrateLegacyConfig);
		if (legacyConfigChanges.length > 0) note(legacyConfigChanges.map((entry) => `- ${entry}`).join("\n"), "Doctor changes");
	};
	const readConfigSnapshotForPreflight = async (allowCurrentPluginMetadata = true) => await measurePreflightStep("config-snapshot", () => readDoctorConfigPreflightSnapshot({
		allowCurrentPluginMetadata,
		includePluginMetadata: Boolean(migrationCheckpoint) || options.preparePluginMetadataSnapshot === true,
		measure: options.measure,
		observe: options.observe,
		preparePluginMetadataSnapshot: options.preparePluginMetadataSnapshot === true,
		skipPluginValidation: shouldSkipPluginValidationForDoctorConfigPreflight()
	}));
	try {
		if (migrationCheckpoint && !skipPristineStartupStateMigrations) {
			const { planPristineStartupStateMigrations } = await measurePreflightStep("pristine-state-plan-import", () => import("./pristine-startup-state-Ccbv5wJc.js"));
			const pristineStatePlan = await measurePreflightStep("pristine-state-plan", () => planPristineStartupStateMigrations(process.env));
			skipPristineStartupStateMigrations = pristineStatePlan.skipAllStateMigrations;
			skipPristineCoreStateMigrations ||= pristineStatePlan.skipCoreStateMigrations;
		}
		if (skipPristineStartupStateMigrations && !gatewayStartupCheckpointRequired) migrationCheckpoint = void 0;
		const stateMigrationsAllowed = !stateMigrationsRequested || options.beforeStateMigrations === void 0 || await measurePreflightStep("state-migration-guard", () => options.beforeStateMigrations?.());
		if (gatewayStartupCheckpointRequired && !stateMigrationsAllowed) throwStartupMigrationGuardRejected();
		if (migrationCheckpoint) {
			await migrateLegacyConfigIfNeeded();
			configSnapshotRead = await readConfigSnapshotForPreflight();
			const initialBaseConfig = configSnapshotRead.snapshot.sourceConfig ?? configSnapshotRead.snapshot.config ?? {};
			migrationCheckpointIdentity = resolveMigrationCheckpointIdentity({
				snapshot: configSnapshotRead.snapshot,
				baseConfig: initialBaseConfig,
				pluginMigrationFingerprint: configSnapshotRead.pluginMigrationFingerprint
			});
			startupMigrationEnv = cloneEnvWithPlatformSemantics(process.env);
			shouldRecordStateCheckpoint = stateMigrationsRequested && migrationCheckpoint.needsStateMigrationCheckpoint({
				env: startupMigrationEnv,
				identity: migrationCheckpointIdentity
			});
			shouldRecordStartupCheckpoint = gatewayStartupCheckpointRequired && migrationCheckpoint.needsStartupMigrationCheckpoint({
				env: startupMigrationEnv,
				identity: migrationCheckpointIdentity
			});
			shouldPersistRefreshedPluginIndex = needsRefreshedPluginIndexPersistence(configSnapshotRead);
			if (shouldRecordStateCheckpoint || shouldRecordStartupCheckpoint || shouldPersistRefreshedPluginIndex) await ensureStartupMigrationLease();
		}
		stateMigrations = stateMigrationsRequested && (!migrationCheckpoint || shouldRecordStateCheckpoint) && !skipPristineStartupStateMigrations ? await measurePreflightStep("state-migrations-import", loadDoctorStateMigrations) : void 0;
		if (stateMigrations && stateMigrationsAllowed) {
			const { autoMigrateLegacyStateDir } = stateMigrations;
			noteStartupStateMigrationResult(await measurePreflightStep("state-dir-migrations", () => autoMigrateLegacyStateDir({ env: process.env })));
		}
		await migrateLegacyConfigIfNeeded();
		if (!configSnapshotRead || stateMigrations) configSnapshotRead = await readConfigSnapshotForPreflight();
		let snapshot = configSnapshotRead.snapshot;
		if (options.repairPrefixedConfig === true && snapshot.exists && !snapshot.valid) {
			if (await recoverConfigFromJsonRootSuffix(snapshot)) {
				note("Removed non-JSON prefix from openclaw.json; original saved as .clobbered.*.", "Config");
				configSnapshotRead = await readConfigSnapshotForPreflight();
				snapshot = configSnapshotRead.snapshot;
			} else if (await recoverConfigFromLastKnownGood({
				snapshot,
				reason: "doctor-invalid-config"
			})) {
				note("Restored openclaw.json from last-known-good; original saved as .clobbered.*.", "Config");
				configSnapshotRead = await readConfigSnapshotForPreflight();
				snapshot = configSnapshotRead.snapshot;
			}
			if (!snapshot.valid && typeof snapshot.raw === "string" && !parseConfigJson5(snapshot.raw).ok) {
				const clobberedPath = await preserveConfigSnapshotAsClobbered(snapshot);
				if (!clobberedPath) throw new Error(`Config could not be parsed or recovered, and doctor could not preserve a .clobbered snapshot. The original remains unchanged at ${snapshot.path}; refusing to apply repairs.`);
				throw new Error(`Config could not be parsed or recovered. Original preserved at ${clobberedPath}. The current file remains unchanged; refusing to apply repairs.`);
			}
		}
		const invalidConfigNote = options.invalidConfigNote ?? "Config invalid; doctor will run with best-effort config.";
		if (invalidConfigNote && snapshot.exists && !snapshot.valid && snapshot.legacyIssues.length === 0) {
			note(invalidConfigNote, "Config");
			noteIncludeConfinementWarning(snapshot);
		}
		const warnings = snapshot.warnings ?? [];
		if (warnings.length > 0) note(formatConfigIssueLines(warnings, "-").join("\n"), "Config warnings");
		const baseConfig = snapshot.sourceConfig ?? snapshot.config ?? {};
		const stateMigrationInput = resolveStateMigrationConfigInput({
			snapshot,
			baseConfig
		});
		if (migrationCheckpoint) migrationCheckpointIdentity = resolveMigrationCheckpointIdentity({
			snapshot,
			baseConfig,
			pluginMigrationFingerprint: configSnapshotRead.pluginMigrationFingerprint
		});
		shouldPersistRefreshedPluginIndex = migrationCheckpoint !== void 0 && needsRefreshedPluginIndexPersistence(configSnapshotRead);
		if (shouldPersistRefreshedPluginIndex) await ensureStartupMigrationLease();
		const freshConfigGuardAllowed = !(stateMigrations !== void 0 || shouldRecordStateCheckpoint || shouldRecordStartupCheckpoint || shouldPersistRefreshedPluginIndex) || !stateMigrationsAllowed || options.beforeStateMigrations === void 0 || await measurePreflightStep("fresh-config-guard", () => options.beforeStateMigrations?.(snapshot));
		if (gatewayStartupCheckpointRequired && !freshConfigGuardAllowed) throwStartupMigrationGuardRejected();
		if (stateMigrations && stateMigrationsAllowed && freshConfigGuardAllowed) {
			const { autoMigrateLegacyState, autoMigrateLegacyPluginDoctorState, autoMigrateLegacyTaskStateSidecars, migrateLegacyConfigMachineState } = stateMigrations;
			if (stateMigrationInput) {
				const pluginDoctorOnlyConfig = stateMigrationInput.pluginDoctorConfig ?? stateMigrationInput.cfg;
				if (skipPristineCoreStateMigrations && pluginDoctorOnlyConfig && !retainStoreConfig(pluginDoctorOnlyConfig)) noteStartupStateMigrationResult(await measurePreflightStep("plugin-doctor-migrations", () => runWithPluginMetadataSnapshot({ config: pluginDoctorOnlyConfig }, () => autoMigrateLegacyPluginDoctorState({
					config: pluginDoctorOnlyConfig,
					env: process.env,
					...options.doctorOnlyStateMigrations === true ? { doctorOnlyStateMigrations: true } : {}
				}))));
				else if (stateMigrationInput.cfg) {
					const migrationConfig = stateMigrationInput.cfg;
					const pluginDoctorConfig = stateMigrationInput.pluginDoctorConfig;
					const { collectCronCodexRuntimePolicyTargetsReadOnly, repairLegacyCronStoreWithoutPrompt } = await measurePreflightStep("cron-repair-import", loadLegacyCronRepair);
					noteStartupStateMigrationResult(await measurePreflightStep("cron-repair", () => repairLegacyCronStoreWithoutPrompt({
						cfg: withLegacyConfig(migrationConfig, pluginDoctorConfig),
						migrateCodexModelRefs: false
					})));
					if (options.repairPrefixedConfig === true) {
						const cronCodexPlan = await measurePreflightStep("cron-policy-scan", () => collectCronCodexRuntimePolicyTargetsReadOnly({ cfg: migrationConfig }));
						cronCodexRuntimePolicyTargets.push(...cronCodexPlan.targets);
						noteStartupStateMigrationResult({
							changes: [],
							warnings: cronCodexPlan.warnings
						});
					}
					const legacyStateResult = await measurePreflightStep("legacy-state-migrations", () => runWithPluginMetadataSnapshot({ config: pluginDoctorConfig ?? migrationConfig }, () => autoMigrateLegacyState({
						cfg: migrationConfig,
						...pluginDoctorConfig ? { pluginDoctorConfig } : {},
						env: process.env,
						recoverCorruptTargetStore: options.recoverCorruptTargetStore,
						doctorOnlyStateMigrations: options.doctorOnlyStateMigrations
					})));
					doctorMediaPersistenceAttempted = options.doctorOnlyStateMigrations === true;
					noteStartupStateMigrationResult(legacyStateResult);
				} else if (stateMigrationInput.pluginDoctorConfig) {
					const pluginDoctorConfig = stateMigrationInput.pluginDoctorConfig;
					const cronMigrationConfig = retainStoreConfig(pluginDoctorConfig);
					if (cronMigrationConfig) {
						const { repairLegacyCronStoreWithoutPrompt } = await measurePreflightStep("cron-repair-import", loadLegacyCronRepair);
						noteStartupStateMigrationResult(await measurePreflightStep("cron-repair", () => repairLegacyCronStoreWithoutPrompt({
							cfg: cronMigrationConfig,
							migrateCodexModelRefs: false
						})));
						noteStartupStateMigrationResult(migrateLegacyConfigMachineState({
							config: pluginDoctorConfig,
							env: process.env
						}));
					}
					noteStartupStateMigrationResult(await measurePreflightStep("plugin-doctor-migrations", () => runWithPluginMetadataSnapshot({ config: pluginDoctorConfig }, () => autoMigrateLegacyPluginDoctorState({
						config: pluginDoctorConfig,
						env: process.env,
						...options.doctorOnlyStateMigrations === true ? { doctorOnlyStateMigrations: true } : {}
					}))));
					noteStartupStateMigrationResult(await measurePreflightStep("task-sidecar-migrations", () => autoMigrateLegacyTaskStateSidecars({ env: process.env })));
				}
			} else noteStartupStateMigrationResult(await measurePreflightStep("task-sidecar-migrations", () => autoMigrateLegacyTaskStateSidecars({ env: process.env })));
		}
		if (stateMigrations && stateMigrationsAllowed && freshConfigGuardAllowed && options.doctorOnlyStateMigrations === true && !doctorMediaPersistenceAttempted) {
			const activeStateMigrations = stateMigrations;
			noteStartupStateMigrationResult(await measurePreflightStep("media-persistence-migration", () => activeStateMigrations.migrateLegacyMediaPersistence({ env: process.env })));
		}
		if (shouldPersistRefreshedPluginIndex && stateMigrationsAllowed && freshConfigGuardAllowed && startupMigrationWarnings.length === 0 && snapshot.valid) {
			const persistedSnapshotRead = await persistRefreshedPluginIndex({
				env: startupMigrationEnv,
				lease: startupMigrationLease,
				measure: measurePreflightStep,
				readPersistedSnapshot: () => readConfigSnapshotForPreflight(false),
				snapshotRead: configSnapshotRead
			});
			const persistedBaseConfig = persistedSnapshotRead.snapshot.sourceConfig ?? persistedSnapshotRead.snapshot.config ?? {};
			const persistedIdentity = resolveMigrationCheckpointIdentity({
				snapshot: persistedSnapshotRead.snapshot,
				baseConfig: persistedBaseConfig,
				pluginMigrationFingerprint: persistedSnapshotRead.pluginMigrationFingerprint
			});
			if (!migrationCheckpointIdentity || !persistedIdentity || migrationCheckpointIdentity.effectiveConfigFingerprint !== persistedIdentity.effectiveConfigFingerprint || migrationCheckpointIdentity.pluginDoctorConfigFingerprint !== persistedIdentity.pluginDoctorConfigFingerprint) throw new Error("OpenClaw config identity changed while persisting the refreshed plugin registry; refusing to write the migration checkpoint. Run \"openclaw doctor --fix\" and retry.");
			configSnapshotRead = persistedSnapshotRead;
			migrationCheckpointIdentity = persistedIdentity;
		}
		if ((shouldRecordStateCheckpoint || shouldRecordStartupCheckpoint) && startupMigrationHeartbeatError) throw startupMigrationHeartbeatError instanceof Error ? startupMigrationHeartbeatError : /* @__PURE__ */ new Error("OpenClaw startup migration lease heartbeat failed.");
		if (shouldRecordStateCheckpoint && stateMigrationsAllowed && freshConfigGuardAllowed && startupMigrationWarnings.length === 0 && snapshot.valid) {
			if (!migrationCheckpoint) throw new Error("OpenClaw state migration checkpoint module was not loaded.");
			migrationCheckpoint.recordSuccessfulStateMigrations({
				env: startupMigrationEnv,
				identity: migrationCheckpointIdentity,
				lease: startupMigrationLease
			});
		}
		if (gatewayStartupCheckpointRequired) {
			if (startupMigrationWarnings.length > 0) throwStartupMigrationRefusal(formatStartupMigrationFailure({
				warnings: startupMigrationWarnings,
				blockers: []
			}));
			if (shouldRecordStartupCheckpoint && !snapshot.valid) throwStartupMigrationRefusal(formatStartupMigrationFailure({
				warnings: [],
				blockers: ["OpenClaw config is invalid; run \"openclaw doctor --fix\" before startup."]
			}));
			setActiveDegradedPlugins([]);
			if (snapshot.valid) {
				const pluginConvergence = shouldRecordStartupCheckpoint ? await runStartupUpgradeConvergence({
					cfg: baseConfig,
					env: process.env,
					...options.measure ? { measure: options.measure } : {}
				}) : await refreshStartupPluginQuarantine({
					cfg: baseConfig,
					env: process.env,
					...options.measure ? { measure: options.measure } : {}
				});
				setActiveDegradedPlugins(pluginConvergence.quarantinedPlugins);
				if (pluginConvergence.blockingDiagnostic) throwStartupMigrationRefusal(formatStartupPluginVerificationFailure(pluginConvergence.blockingDiagnostic));
				if (shouldRecordStartupCheckpoint) {
					const convergedSnapshotRead = await readConfigSnapshotForPreflight();
					const convergedBaseConfig = convergedSnapshotRead.snapshot.sourceConfig ?? convergedSnapshotRead.snapshot.config ?? {};
					const convergedIdentity = resolveMigrationCheckpointIdentity({
						snapshot: convergedSnapshotRead.snapshot,
						baseConfig: convergedBaseConfig,
						pluginMigrationFingerprint: convergedSnapshotRead.pluginMigrationFingerprint
					});
					if (!migrationCheckpointIdentitiesMatch(migrationCheckpointIdentity, convergedIdentity)) throwStartupMigrationIdentityChanged();
				}
			}
		}
		if (shouldRecordStartupCheckpoint) {
			if (!migrationCheckpoint) throw new Error("OpenClaw startup migration checkpoint module was not loaded.");
			migrationCheckpoint.recordSuccessfulStartupMigrations({
				env: startupMigrationEnv,
				identity: migrationCheckpointIdentity,
				lease: startupMigrationLease
			});
		}
		return {
			snapshot,
			baseConfig,
			...configSnapshotRead.pluginMetadataSnapshot ? { pluginMetadataSnapshot: configSnapshotRead.pluginMetadataSnapshot } : {},
			...cronCodexRuntimePolicyTargets.length > 0 ? { cronCodexRuntimePolicyTargets } : {}
		};
	} finally {
		if (startupMigrationHeartbeat) clearInterval(startupMigrationHeartbeat);
		startupMigrationLease?.release();
	}
}
//#endregion
export { shouldSkipPluginValidationForDoctorConfigPreflight as n, runDoctorConfigPreflight as t };
