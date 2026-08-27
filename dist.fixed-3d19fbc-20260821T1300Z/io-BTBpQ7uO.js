import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { n as isVitestRuntimeEnv } from "./test-runtime-env-DQDRzsLt.js";
import { n as isTruthyEnvValue } from "./env-uyT2Z2BT.js";
import { s as asFiniteNumber } from "./number-coercion-oCkfUEEq.js";
import "./src-BkwWvwB2.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { a as asOptionalRecord, c as isRecord, n as asNullableObjectRecord } from "./record-coerce-DItp3I4t.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { S as parseJsonWithJson5Fallback, b as resolveConfigIncludeWritePath, h as ConfigIncludeError, v as hashConfigIncludeRaw, x as resolveConfigIncludes, y as readConfigIncludeFileWithGuards } from "./redact-DP7p9QfH.js";
import { a as isPathInside } from "./path-CYL8StfC.js";
import { c as resolveUserPath, o as resolveRequiredHomeDir } from "./home-dir-DcrXWQPU.js";
import "./path-guards-CQdx2c2I.js";
import "./utils-D9gvQMP6.js";
import { t as isPlainObject } from "./plain-object-5a0EzLzX.js";
import { t as sleep } from "./sleep-Bd74jGcV.js";
import { n as containsEnvVarReference, r as resolveConfigEnvVars } from "./env-substitution-BAQgPEZV.js";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.js";
import "./path-safety-D5Is7hSS.js";
import { f as resolveConfigPath, v as resolveIncludeRoots, w as resolveStateDir } from "./paths-CqeDjSA4.js";
import { n as extractErrorCode, r as formatErrorMessage, t as collectErrorGraphCandidates } from "./errors-CqPTYU6G.js";
import { t as sanitizeForLog } from "./ansi-9qL8iF9E.js";
import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { r as normalizeConfiguredProviderCatalogModelId, t as collectManifestModelIdNormalizationPolicies } from "./provider-model-id-normalization-DvssXFxG.js";
import { n as normalizeAgentModelRefForConfig, t as normalizeAgentModelMapForConfig } from "./model-input-ekSMR50U.js";
import "./agent-scope-D9GLFAyB.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { D as isExplicitModelPolicy, E as hasModelPolicyAllowlistMigrationMarker, _ as toAgentEntriesRecord, b as tryResolveLegacyCompatibilityAgentId, d as resolveAgentWorkspaceDir, i as listAgentEntriesWithSource, n as hasAgentRosterProperty, o as readAgentRosterProperty, p as resolveDefaultAgentId, r as listAgentEntries, s as resolveAgentConfig, v as tryResolveConfiguredAgentWorkspaceDir, w as computeModelPolicyAllowlist, y as tryResolveDefaultAgentId } from "./agent-scope-config-CsnnOL14.js";
import { a as isSameFixedSessionStoreConfig, o as isPathCaseInsensitive } from "./session-store-owner-CLtsGq3M.js";
import { t as isChannelConfigMetadataKey } from "./config-metadata-aX1D2IMg.js";
import { t as isVerbose } from "./global-state-BCtvHc7P.js";
import { n as replaceFileAtomicSync } from "./replace-file-B2zhwG6u.js";
import { t as replaceFileAtomic } from "./replace-file-Bcj2RH0f.js";
import { s as coerceSecretRef } from "./types.secrets-BrIfhxSG.js";
import { E as SecretRefSchema, R as evaluateDmPolicyAllowFromDependency, z as isBuiltInModelProviderOverlayId } from "./zod-schema.core-D1Ak_xoR.js";
import { n as sanitizeTerminalText } from "./safe-text-CpAuEO38.js";
import { i as summarizeAllowedValues, r as appendAllowedValuesHint, t as validateJsonSchemaValue } from "./schema-validator-C_mQvoOg.js";
import { t as parseConfigPathArrayIndex } from "./path-array-index-CvEcUJa-.js";
import { n as resolveManifestCommandAliasOwnerInRegistry } from "./manifest-command-aliases-DFXNq8y7.js";
import { a as GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA } from "./ids-CvoHNWoD.js";
import { r as hasKind } from "./slots-BTFPUFBt.js";
import { n as VERSION } from "./version-o4XN9fka.js";
import { a as normalizePluginId, d as resolveMemorySlotDecision, l as resolveEffectivePluginActivationState, s as normalizePluginsConfig } from "./config-state-DLiU5GYQ.js";
import { r as loadInstalledPluginIndexInstallRecordsSync } from "./installed-plugin-index-record-reader-CDDyVBh4.js";
import { _ as getNodeSqliteKysely, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-gKE3myqW.js";
import { _ as OpenClawStateOwnershipError, d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BciZ4rHE.js";
import { t as createDedupeCache } from "./dedupe-C5V_sRWr.js";
import { i as getOfficialExternalPluginCatalogEntry, n as getOfficialExternalChannelHostSchemaAllOf, r as getOfficialExternalChannelSecretContract, v as resolveOfficialExternalPluginInstall } from "./official-external-plugin-catalog-BEMBT-Dn.js";
import { t as getBootstrapChannelPlugin } from "./bootstrap-registry-DyxL9X9C.js";
import { l as loadBundledChannelDoctorContractApi, n as collectRelevantDoctorPluginIds, t as applyPluginDoctorCompatibilityMigrations } from "./doctor-contract-registry-Bji_8NSw.js";
import { r as collectConfiguredModelRefs } from "./configured-model-refs-0XUAFjEF.js";
import { t as listDoctorConfiguredChannelIds } from "./configured-channel-ids-mHKWE5vU.js";
import { n as LEGACY_CONFIG_MIGRATIONS } from "./legacy-KwIPIjLH.js";
import { E as parseModelPolicyWildcardRef, T as isValidExactModelPolicyRef, w as isModelPolicyCompatSelector } from "./model-selection-shared-0DI3vxkL.js";
import { n as planManifestModelCatalogSuppressions } from "./manifest-planner-D5TF2mMe.js";
import "./defaults-CdX9UGcX.js";
import { i as tryGetLegacyDefaultAgentId, t as inheritLegacyDefaultAgentId } from "./legacy.default-agent-owner-0YGX8Nyg.js";
import { a as rebasePluginMetadataSnapshotManifestRegistry, s as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-DciqS8td.js";
import { i as writeConfigMachineState } from "./config-machine-state-4vCzA8Fc.js";
import { C as shouldSuppressMissingCodexPluginDiagnostics } from "./codex-route-model-ref-WCq2iqcj.js";
import { c as shouldEnableShellEnvFallback, i as loadShellEnvFallback, o as resolveShellEnvFallbackTimeoutMs, s as shouldDeferShellEnvFallback } from "./shell-env-Ckmdu1KV.js";
import "./model-catalog-5PpQ61MN.js";
import { r as shouldWarnOnTouchedVersion } from "./version-CG_bbh3U.js";
import { f as isLoopbackIpAddress, i as isCanonicalDottedDecimalIPv4 } from "./ip-pzzTYlfq.js";
import { s as createConfigValidationMetadataPluginIdScope } from "./gateway-startup-plugin-ids-CydfvKhz.js";
import { t as resolveConfigWidePluginManifestRegistry } from "./io.plugin-metadata-CwihyFME.js";
import { i as listChannelIdsForOwnershipMigration } from "./channel-presence-policy-CdpkZk_Q.js";
import { c as getPublishedConfigRuntimeEnvState, n as cloneEnvWithPlatformSemantics, s as createConfigRuntimeEnvBase, t as applyConfigEnvVars } from "./config-env-vars-C1wvGC4M.js";
import { a as appendConfigAuditRecordSync, b as upsertConfigSnapshotAuditRecord, c as createConfigWriteAuditRecordBase, g as fingerprintConfigSnapshotAuthoredConfig, h as configSnapshotAuditRecordMatchesPath, i as appendConfigAuditRecord, l as finalizeConfigWriteAuditRecord, m as snapshotConfigAuditProcessInfo, o as capConfigAuditIssues, s as capConfigAuditPaths, u as formatConfigOverwriteLogMessage, v as readLatestConfigSnapshotAuditRecord, y as restoreConfigSnapshotAuditRecord } from "./io.audit-BbTTac1R.js";
import { t as loadDotEnv } from "./dotenv-aWeheKUE.js";
import { t as GATEWAY_CONFIG_SELECTION_ENV_KEYS } from "./gateway-env-selection-Dax41wNj.js";
import { _ as registerRuntimeConfigWriteListener, a as getRuntimeConfigSnapshot, c as getRuntimeConfigSourceSnapshot, d as loadPinnedRuntimeConfig, f as notifyRuntimeConfigWriteListeners, h as registerManagedRuntimeConfigWriteOwner, l as hasManagedRuntimeConfigWriteOwner, m as preflightRuntimeSnapshotWrite, n as createRuntimeConfigWriteNotification, p as preflightManagedRuntimeConfigWrite, r as finalizeRuntimeSnapshotWrite, s as getRuntimeConfigSnapshotRefreshHandler } from "./runtime-snapshot-DIuCzlel.js";
import { n as formatConfigIssueLines, r as formatConfigIssueSummary } from "./issue-format-wyiFLwqS.js";
import { n as materializeLegacyDefaultAgentRoles, t as migratePersistedImplicitMainRoster } from "./legacy.roster-ESlKnWFu.js";
import { t as resolveBundledProviderPolicySurface } from "./provider-public-artifacts-CUyXoT9F.js";
import { n as normalizeTalkConfig } from "./talk-DHvIaHsU.js";
import { i as normalizeTrustedSafeBinDirs, u as normalizeSafeBinProfileFixtures } from "./exec-safe-bin-trust-CUsZYmpD.js";
import { n as ok, t as err } from "./result-BQGgYouL.js";
import { i as unsetConfigValueAtPath, n as parseConfigPath, r as setConfigValueAtPath, t as getConfigValueAtPath } from "./config-paths-BEzXwpUS.js";
import { t as resolveShellEnvExpectedKeys } from "./shell-env-expected-keys-DkflPKVu.js";
import { t as resolveWebSearchInstallCatalogEntries } from "./web-search-install-catalog-k9wKZIFl.js";
import { f as cloneSchema, n as McpServerNameSchema, r as NodeHostMcpServerNameSchema, t as OpenClawSchema } from "./zod-schema-CpTL91PM.js";
import { s as ChannelHeartbeatVisibilitySchema } from "./zod-schema.channels-config-DkZP1G3R.js";
import { a as resolveChannelDmAllowFrom, o as resolveChannelDmPolicy } from "./dm-access-C_vMmAfR.js";
import { i as isPathWithinRoot, n as isAvatarDataUrl, o as isWindowsAbsolutePath, r as isAvatarHttpUrl, t as hasAvatarUriScheme } from "./avatar-policy-palR8nY7.js";
import { n as isUnsafeGatewayTailscaleNoAuth, t as formatUnsafeGatewayTailscaleNoAuthMessage } from "./gateway-tailscale-auth-policy-DLytnhv-.js";
import { a as throwInvalidConfig } from "./io.invalid-config-D6XgN5OX.js";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.js";
import { r as shouldAttemptLastKnownGoodRecovery, t as isPluginLocalInvalidConfigSnapshot } from "./recovery-policy-CsUZ07YX.js";
import { a as includeContributionOwnsBindings, i as includeContributionOwnsAgentRoster, n as configIncludeOwnsAgentRosterValues } from "./agent-roster-provenance-b5BXVOca.js";
import { u as resolveCronJobsStorePathFromConfig } from "./store-DPYCi6M7.js";
import { t as pinSurvivorWorkspaceForRosterCollapse } from "./agent-workspace-roster-transition-Cl4yweda.js";
import { n as pinLegacyInheritedAuthOwnerForRosterTransition, t as assertSafeLegacyInheritedAuthDirTransition } from "./legacy-inherited-auth-dir-CGszFH8G.js";
import { n as prepareCronOwnerWriteRefusal } from "./io.cron-owner-refusal-Dns_HSZu.js";
import { n as createMergePatch, t as applyMergePatch } from "./merge-patch-B5RMlh8J.js";
import { n as assertConfigWriteAllowedInCurrentMode } from "./nix-mode-write-guard-DFUnyZ_3.js";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import JSON5 from "json5";
//#region src/agents/owner-display.ts
const MAX_OWNER_PROMPT_SENDERS = 16;
function exceedsOwnerPromptContentBudget(ownerNumbers) {
	let bytes = 0;
	for (const ownerId of ownerNumbers) {
		bytes += Buffer.byteLength(ownerId, "utf8") + (bytes > 0 ? 2 : 0);
		if (bytes > 980) return true;
	}
	return false;
}
/** Keep owner identity guidance bounded without changing the authorization allowlist. */
function resolveOwnerPromptNumbers(params) {
	const ownerNumbers = params.ownerNumbers;
	if (!ownerNumbers?.length) return;
	if (ownerNumbers.length <= MAX_OWNER_PROMPT_SENDERS && !exceedsOwnerPromptContentBudget(ownerNumbers)) return ownerNumbers;
	const promptOwners = ownerNumbers.slice(0, MAX_OWNER_PROMPT_SENDERS);
	const senderId = params.senderId;
	if (params.senderIsOwner && senderId && ownerNumbers.includes(senderId)) {
		if (!promptOwners.includes(senderId)) promptOwners[promptOwners.length - 1] = senderId;
		if (exceedsOwnerPromptContentBudget(promptOwners) && promptOwners[0] !== senderId) return [senderId, ...promptOwners.filter((ownerId) => ownerId !== senderId)];
	}
	return promptOwners;
}
/**
* Resolve owner display settings for prompt rendering.
* Keep auth secrets decoupled from owner hash secrets.
*/
function resolveOwnerDisplaySetting(_config) {
	return {
		ownerDisplay: "raw",
		ownerDisplaySecret: void 0
	};
}
/**
* Ensure hash mode has a dedicated secret.
* Returns updated config and generated secret when autofill was needed.
*/
function ensureOwnerDisplaySecret(config, _generateSecret) {
	return { config };
}
//#endregion
//#region src/commands/doctor/shared/include-migration-ownership.ts
function containsAuthoredInclude(value) {
	if (!value || typeof value !== "object") return false;
	if (Array.isArray(value)) return value.some(containsAuthoredInclude);
	const record = value;
	return Object.hasOwn(record, "$include") || Object.values(record).some(containsAuthoredInclude);
}
/** Classify whether Doctor can safely persist a migration at one resolved config path. */
function classifyConfigPathMigrationOwnership(params) {
	const owners = (params.snapshot.includeProvenance ?? []).filter((entry) => entry.path.length <= params.configPath.length && entry.path.every((segment, index) => segment === params.configPath[index]));
	if (owners.length === 0) return { kind: "direct" };
	const targetPaths = [...new Set(owners.flatMap((owner) => owner.targetPaths ?? (owner.targetPath ? [owner.targetPath] : [])))].toSorted();
	const owner = owners[0];
	const configDir = path.dirname(path.resolve(params.snapshot.path));
	if (owners.length === 1 && owner?.path.length === 1 && owner.path[0] === params.configPath[0] && owner.kind === "single" && !owner.hasSiblingOverrides && owner.targetPath && isPathInside(configDir, path.resolve(owner.targetPath))) return {
		kind: "single-top-level-include",
		targetPath: owner.targetPath
	};
	return {
		kind: "manual",
		targetPaths
	};
}
function readOtelProtocol(config) {
	const root = isRecord(config) ? config : null;
	const diagnostics = isRecord(root?.diagnostics) ? root.diagnostics : null;
	return (isRecord(diagnostics?.otel) ? diagnostics.otel : null)?.protocol;
}
/** Classify ownership for the sole legacy migration that consults resolved config values. */
function classifyOtelGrpcMigrationOwnership(params) {
	if (readOtelProtocol(params.resolvedConfig) !== "grpc") return null;
	const ownership = classifyConfigPathMigrationOwnership({
		snapshot: params.snapshot,
		configPath: [
			"diagnostics",
			"otel",
			"protocol"
		]
	});
	if (ownership.kind !== "direct") return ownership;
	return readOtelProtocol(params.authoredConfig) === "grpc" ? ownership : { kind: "resolved-only" };
}
function isSingleTopLevelIncludeMigration(params) {
	if (!isRecord(params.parsed)) return false;
	const keys = /* @__PURE__ */ new Set([...Object.keys(params.sourceConfig), ...Object.keys(params.candidate)]);
	const sourceConfig = params.sourceConfig;
	const candidate = params.candidate;
	const changed = [...keys].filter((key) => !isDeepStrictEqual(sourceConfig[key], candidate[key]));
	const changedKey = changed.length === 1 ? changed[0] : void 0;
	if (changedKey === void 0) return false;
	const authoredSection = params.parsed[changedKey];
	return isRecord(authoredSection) && Object.keys(authoredSection).length === 1 && typeof authoredSection["$include"] === "string";
}
//#endregion
//#region src/commands/doctor/shared/channel-legacy-config-migrate.ts
function migrateHeartbeatVisibility(raw, changes) {
	const channels = isRecord(raw.channels) ? raw.channels : null;
	if (!channels) return;
	const migrateEntry = (entry, path, preserveEmptyPluginBlock = false) => {
		const heartbeat = isRecord(entry.heartbeat) ? entry.heartbeat : null;
		const keys = heartbeat ? Object.keys(heartbeat) : [];
		if (!heartbeat || preserveEmptyPluginBlock && keys.length === 0 || keys.some((key) => key !== "showOk" && key !== "showAlerts" && key !== "useIndicator")) return;
		if (entry.heartbeatVisibility === void 0) {
			entry.heartbeatVisibility = entry.heartbeat;
			changes.push(`Moved ${path}.heartbeat → ${path}.heartbeatVisibility.`);
		} else changes.push(`Removed ${path}.heartbeat (${path}.heartbeatVisibility already set).`);
		delete entry.heartbeat;
	};
	const defaults = isRecord(channels.defaults) ? channels.defaults : null;
	if (defaults) migrateEntry(defaults, "channels.defaults");
	for (const [channelId, value] of Object.entries(channels)) {
		if (!channelId.trim() || isChannelConfigMetadataKey(channelId) || !isRecord(value)) continue;
		const preserveEmptyPluginBlock = channelId === "feishu";
		migrateEntry(value, `channels.${channelId}`, preserveEmptyPluginBlock);
		const accounts = isRecord(value.accounts) ? value.accounts : null;
		if (!accounts) continue;
		for (const [accountId, account] of Object.entries(accounts)) if (isRecord(account)) migrateEntry(account, `channels.${channelId}.accounts.${accountId}`, preserveEmptyPluginBlock);
	}
}
function resolveBundledChannelCompatibilityNormalizer(channelId) {
	const contractNormalizer = loadBundledChannelDoctorContractApi(channelId)?.normalizeCompatibilityConfig;
	if (typeof contractNormalizer === "function") return contractNormalizer;
	return getBootstrapChannelPlugin(channelId)?.doctor?.normalizeCompatibilityConfig;
}
function collectPluginDoctorCompatibilityIds(params) {
	const unresolvedChannelIds = new Set(params.unresolvedChannelIds);
	return [.../* @__PURE__ */ new Set([...params.unresolvedChannelIds, ...collectRelevantDoctorPluginIds(params.raw).filter((pluginId) => !unresolvedChannelIds.has(pluginId))])].toSorted();
}
/** Apply bundled and plugin channel compatibility migrations to a legacy config object. */
function applyChannelDoctorCompatibilityMigrations(cfg) {
	let nextCfg = cfg;
	const changes = [];
	migrateHeartbeatVisibility(cfg, changes);
	const unresolvedChannelIds = [];
	for (const channelId of listDoctorConfiguredChannelIds(cfg, {
		configEntryPolicy: "raw",
		sort: "codepoint"
	})) {
		const normalizeCompatibilityConfig = resolveBundledChannelCompatibilityNormalizer(channelId);
		if (!normalizeCompatibilityConfig) {
			unresolvedChannelIds.push(channelId);
			continue;
		}
		const mutation = normalizeCompatibilityConfig({ cfg: nextCfg });
		if (!mutation || mutation.changes.length === 0) continue;
		nextCfg = mutation.config;
		changes.push(...mutation.changes);
	}
	const pluginIds = collectPluginDoctorCompatibilityIds({
		raw: cfg,
		unresolvedChannelIds
	});
	if (pluginIds.length > 0) {
		const compat = applyPluginDoctorCompatibilityMigrations(nextCfg, {
			config: cfg,
			pluginIds
		});
		nextCfg = compat.config;
		changes.push(...compat.changes);
	}
	return {
		next: nextCfg,
		changes
	};
}
//#endregion
//#region src/commands/doctor/shared/legacy-config-compat.ts
/** Apply all legacy doctor migrations to raw config, returning null when nothing changed. */
function applyLegacyDoctorMigrations(raw, context) {
	if (!raw || typeof raw !== "object") return {
		next: null,
		changes: []
	};
	const original = raw;
	const next = structuredClone(original);
	const changes = [];
	for (const migration of LEGACY_CONFIG_MIGRATIONS) migration.apply(next, changes, context);
	const compat = applyChannelDoctorCompatibilityMigrations(next);
	changes.push(...compat.changes);
	if (changes.length === 0) return {
		next: null,
		changes: []
	};
	return {
		next: compat.next,
		changes
	};
}
//#endregion
//#region src/config/agent-dirs.ts
/** Error thrown when multiple configured agents resolve to the same state directory. */
var DuplicateAgentDirError = class extends Error {
	constructor(duplicates) {
		super(formatDuplicateAgentDirError(duplicates));
		this.name = "DuplicateAgentDirError";
		this.duplicates = duplicates;
	}
};
function realpathAgentDir(agentDir, seen = /* @__PURE__ */ new Set()) {
	const resolved = path.resolve(agentDir);
	if (seen.has(resolved)) return resolved;
	seen.add(resolved);
	const missingSegments = [];
	let cursor = resolved;
	for (;;) try {
		return path.join(fs.realpathSync.native(cursor), ...missingSegments.toReversed());
	} catch (error) {
		const code = error.code;
		if (code !== "ENOENT" && code !== "ENOTDIR") return resolved;
		try {
			if (fs.lstatSync(cursor).isSymbolicLink()) {
				const target = path.resolve(path.dirname(cursor), fs.readlinkSync(cursor));
				return realpathAgentDir(path.join(target, ...missingSegments.toReversed()), seen);
			}
		} catch {}
		const parent = path.dirname(cursor);
		if (parent === cursor) return resolved;
		missingSegments.push(path.basename(cursor));
		cursor = parent;
	}
}
function canonicalizeAgentDir(agentDir) {
	const resolved = realpathAgentDir(agentDir);
	return isPathCaseInsensitive(resolved) ? normalizeLowercaseStringOrEmpty(resolved) : resolved;
}
function collectReferencedAgentIds(cfg) {
	const ids = /* @__PURE__ */ new Set();
	const agents = listAgentEntries(cfg);
	const defaultAgentId = agents.find((agent) => agent?.default)?.id;
	if (defaultAgentId) ids.add(normalizeAgentId(defaultAgentId));
	for (const entry of agents) if (entry?.id) ids.add(normalizeAgentId(entry.id));
	const bindings = cfg.bindings;
	if (Array.isArray(bindings)) for (const binding of bindings) {
		const id = binding?.agentId;
		if (typeof id === "string" && id.trim()) ids.add(normalizeAgentId(id));
	}
	return [...ids];
}
function resolveEffectiveAgentDir(cfg, agentId, deps) {
	const id = normalizeAgentId(agentId);
	const trimmed = (resolveAgentConfig(cfg, id)?.agentDir)?.trim();
	if (trimmed) return resolveUserPath(trimmed);
	const env = deps?.env ?? process.env;
	const root = resolveStateDir(env, deps?.homedir ?? (() => resolveRequiredHomeDir(env, os.homedir)));
	return path.join(root, "agents", id, "agent");
}
/** Finds agent ids whose effective agentDir would share auth/session state. */
function findDuplicateAgentDirs(cfg, deps) {
	const byDir = /* @__PURE__ */ new Map();
	for (const agentId of collectReferencedAgentIds(cfg)) {
		const agentDir = resolveEffectiveAgentDir(cfg, agentId, deps);
		const key = canonicalizeAgentDir(agentDir);
		const entry = byDir.get(key);
		if (entry) entry.agentIds.push(agentId);
		else byDir.set(key, {
			agentDir,
			agentIds: [agentId]
		});
	}
	return [...byDir.values()].filter((v) => v.agentIds.length > 1);
}
/** Formats duplicate agentDir conflicts with the remediation operators should take. */
function formatDuplicateAgentDirError(dups) {
	return [
		"Duplicate agentDir detected (multi-agent config).",
		"Each agent must have a unique agentDir; sharing it causes auth/session state collisions and token invalidation.",
		"",
		"Conflicts:",
		...dups.map((d) => `- ${d.agentDir}: ${d.agentIds.map((id) => `"${id}"`).join(", ")}`),
		"",
		"Fix: remove the shared agents.entries.*.agentDir override (or give each agent its own directory).",
		"If you want to share credentials, copy auth-profiles.json instead of sharing the entire agentDir."
	].join("\n");
}
//#endregion
//#region src/config/io.health-state.ts
function resolveConfigHealthStateEnv(deps) {
	if (deps.env.OPENCLAW_HOME || deps.env.HOME || deps.env.USERPROFILE || deps.env.PREFIX) return deps.env;
	return {
		...deps.env,
		HOME: deps.homedir()
	};
}
function parseConfigHealthFingerprint(value) {
	if (!value) return;
	try {
		const parsed = JSON.parse(value);
		return parsed && typeof parsed === "object" ? parsed : void 0;
	} catch {
		return;
	}
}
function stringifyConfigHealthFingerprint(value) {
	return value ? JSON.stringify(value) : null;
}
function readConfigHealthStateFromStore(deps) {
	try {
		const database = openOpenClawStateDatabase({ env: resolveConfigHealthStateEnv(deps) });
		const healthDb = getNodeSqliteKysely(database.db);
		const rows = executeSqliteQuerySync(database.db, healthDb.selectFrom("config_health_entries").select([
			"config_path",
			"last_known_good_json",
			"last_promoted_good_json",
			"last_observed_suspicious_signature"
		]).orderBy("config_path", "asc")).rows;
		return { entries: Object.fromEntries(rows.map((row) => [row.config_path, {
			lastKnownGood: parseConfigHealthFingerprint(row.last_known_good_json),
			lastPromotedGood: parseConfigHealthFingerprint(row.last_promoted_good_json),
			lastObservedSuspiciousSignature: row.last_observed_suspicious_signature
		}])) };
	} catch (error) {
		if (error instanceof OpenClawStateOwnershipError) throw error;
		return {};
	}
}
function writeConfigHealthStateToStore(deps, state) {
	try {
		const entries = Object.entries(state.entries ?? {});
		if (entries.length === 0) return;
		const updatedAtMs = Date.now();
		runOpenClawStateWriteTransaction(({ db }) => {
			executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("config_health_entries").values(entries.map(([configPath, entry]) => ({
				config_path: configPath,
				last_known_good_json: stringifyConfigHealthFingerprint(entry.lastKnownGood),
				last_promoted_good_json: stringifyConfigHealthFingerprint(entry.lastPromotedGood),
				last_observed_suspicious_signature: entry.lastObservedSuspiciousSignature ?? null,
				updated_at_ms: updatedAtMs
			}))).onConflict((conflict) => conflict.column("config_path").doUpdateSet({
				last_known_good_json: (eb) => eb.ref("excluded.last_known_good_json"),
				last_promoted_good_json: (eb) => eb.ref("excluded.last_promoted_good_json"),
				last_observed_suspicious_signature: (eb) => eb.ref("excluded.last_observed_suspicious_signature"),
				updated_at_ms: (eb) => eb.ref("excluded.updated_at_ms")
			})));
		}, { env: resolveConfigHealthStateEnv(deps) });
	} catch (error) {
		if (error instanceof OpenClawStateOwnershipError) throw error;
		deps.logger.warn(`Config health-state write failed: ${formatErrorMessage(error)}`);
	}
}
//#endregion
//#region src/config/io.read-helpers.ts
function hashConfigRaw(raw) {
	if (raw === null) return hashConfigIncludeRaw(null);
	return crypto.createHash("sha256").update(raw).digest("hex");
}
function resolveConfigSnapshotHash(snapshot) {
	if (typeof snapshot.hash === "string") {
		const trimmed = snapshot.hash.trim();
		if (trimmed) return trimmed;
	}
	if (typeof snapshot.raw !== "string") return null;
	return hashConfigRaw(snapshot.raw);
}
function coerceConfig(value) {
	return asOptionalRecord(value) ?? {};
}
function hasConfigMeta(value) {
	if (!isRecord(value)) return false;
	return isRecord(value.meta);
}
function resolveGatewayMode(value) {
	if (!isRecord(value)) return null;
	const gateway = value.gateway;
	if (!isRecord(gateway) || typeof gateway.mode !== "string") return null;
	const trimmed = gateway.mode.trim();
	return trimmed.length > 0 ? trimmed : null;
}
function collectEnvRefPaths(value, pathLocal, output) {
	if (typeof value === "string") {
		if (containsEnvVarReference(value)) output.set(pathLocal, value);
		return;
	}
	if (Array.isArray(value)) {
		value.forEach((item, index) => {
			collectEnvRefPaths(item, `${pathLocal}[${index}]`, output);
		});
		return;
	}
	if (isRecord(value)) for (const [key, child] of Object.entries(value)) collectEnvRefPaths(child, pathLocal ? `${pathLocal}.${key}` : key, output);
}
function containsConfigIncludeDirective(value) {
	if (Array.isArray(value)) return value.some((item) => containsConfigIncludeDirective(item));
	if (!isRecord(value)) return false;
	if ("$include" in value) return true;
	return Object.values(value).some((item) => containsConfigIncludeDirective(item));
}
function resolveConfigPathForDeps(deps) {
	if (deps.configPath) return deps.configPath;
	return resolveConfigPath(deps.env, resolveStateDir(deps.env, deps.homedir));
}
function normalizeConfigIoDeps(overrides = {}) {
	const env = overrides.env ?? process.env;
	return {
		fs: overrides.fs ?? fs,
		json5: overrides.json5 ?? JSON5,
		env,
		lowerPrecedenceEnv: overrides.lowerPrecedenceEnv ?? {},
		homedir: overrides.homedir ?? (() => resolveRequiredHomeDir(env, os.homedir)),
		configPath: overrides.configPath ?? "",
		logger: overrides.logger ?? console,
		measure: overrides.measure ?? (async (_name, run) => await run()),
		suppressFutureVersionWarning: overrides.suppressFutureVersionWarning ?? (isTruthyEnvValue(env.OPENCLAW_UPDATE_IN_PROGRESS) || isTruthyEnvValue(env.OPENCLAW_UPDATE_POST_CORE)),
		observe: overrides.observe ?? true
	};
}
function maybeLoadDotEnvForConfig(env) {
	if (env === process.env) loadDotEnv({ quiet: true });
}
function parseConfigJson5(raw, json5 = JSON5) {
	try {
		return {
			ok: true,
			parsed: parseJsonWithJson5Fallback(raw, json5)
		};
	} catch (err) {
		return {
			ok: false,
			error: String(err)
		};
	}
}
const TILDE_PATH_VALUE_RE = /^~(?=$|[\\/])/;
const PATH_LIKE_CONFIG_KEY_RE = /(dir|path|paths|file|root|workspace)$/i;
const PATH_LIKE_CONFIG_LIST_KEYS = /* @__PURE__ */ new Set(["paths", "pathPrepend"]);
function isPathLikeConfigKey(key) {
	return Boolean(key && (PATH_LIKE_CONFIG_KEY_RE.test(key) || PATH_LIKE_CONFIG_LIST_KEYS.has(key)));
}
function expandAuthoredTildePath(value, home) {
	const suffix = value.slice(1);
	if (!suffix) return home;
	if (suffix.startsWith("/") || suffix.startsWith("\\")) return path.join(home, suffix.slice(1));
	return value;
}
function restoreAuthoredTildePathsForWrite(next, authored, key, home) {
	if (typeof next === "string" && typeof authored === "string" && isPathLikeConfigKey(key) && TILDE_PATH_VALUE_RE.test(authored.trim()) && path.normalize(next) === path.normalize(expandAuthoredTildePath(authored.trim(), home))) return authored;
	if (Array.isArray(next) && Array.isArray(authored)) {
		const normalizeChildren = isPathLikeConfigKey(key);
		return next.map((entry, index) => restoreAuthoredTildePathsForWrite(entry, authored[index], normalizeChildren ? key : void 0, home));
	}
	if (!isRecord(next) || !isRecord(authored)) return next;
	const out = { ...next };
	for (const [childKey, childValue] of Object.entries(out)) if (Object.hasOwn(authored, childKey)) out[childKey] = restoreAuthoredTildePathsForWrite(childValue, authored[childKey], childKey, home);
	return out;
}
function resolveConfigIncludesForRead(parsed, configPath, deps, includeFileHashesForWrite, includeFileTargetsForWrite, includeFilePathsForWatch, onIncludeResolved) {
	const allowedRoots = resolveIncludeRoots(deps.env, deps.homedir);
	const recordIncludeWatchPath = (resolvedPath) => {
		includeFilePathsForWatch?.add(path.normalize(resolvedPath));
	};
	const recordIncludeTarget = (resolvedPath, canonicalPath) => {
		if (!includeFileTargetsForWrite) return;
		const normalizedPath = path.normalize(resolvedPath);
		try {
			includeFileTargetsForWrite[normalizedPath] = path.normalize(canonicalPath ?? resolveConfigIncludeWritePath({
				configPath,
				includePath: resolvedPath,
				allowedRoots
			}));
		} catch {}
	};
	return resolveConfigIncludes(parsed, configPath, {
		readFile: (candidate) => deps.fs.readFileSync(candidate, "utf-8"),
		onLexicalPath: recordIncludeWatchPath,
		onIncludeResolved,
		readFileWithGuards: ({ includePath, resolvedPath, rootRealDir }) => {
			try {
				const raw = readConfigIncludeFileWithGuards({
					includePath,
					resolvedPath,
					rootRealDir,
					ioFs: deps.fs,
					onResolvedPath: (canonicalPath) => {
						recordIncludeWatchPath(canonicalPath);
						recordIncludeTarget(resolvedPath, canonicalPath);
					}
				});
				if (includeFileHashesForWrite) includeFileHashesForWrite[path.normalize(resolvedPath)] = hashConfigIncludeRaw(raw);
				return raw;
			} catch (error) {
				const missing = collectErrorGraphCandidates(error, (current) => [current.cause]).some((candidate) => extractErrorCode(candidate) === "ENOENT");
				if (includeFileHashesForWrite && missing) includeFileHashesForWrite[path.normalize(resolvedPath)] = hashConfigIncludeRaw(null);
				if (missing) recordIncludeTarget(resolvedPath);
				throw error;
			}
		},
		parseJson: (raw) => deps.json5.parse(raw)
	}, { allowedRoots });
}
function resolveConfigForRead(resolvedIncludes, env, lowerPrecedenceEnv = {}) {
	if (resolvedIncludes && typeof resolvedIncludes === "object" && "env" in resolvedIncludes) applyConfigEnvVars(resolvedIncludes, env, { lowerPrecedenceEnv });
	const envWarnings = [];
	return {
		resolvedConfigRaw: resolveConfigEnvVars(resolvedIncludes, env, { onMissing: (warning) => envWarnings.push(warning) }),
		envSnapshotForRestore: { ...env },
		envWarnings
	};
}
function snapshotEnv(env) {
	return { ...env };
}
function replaceEnvSnapshot(env, next) {
	for (const key of Object.keys(env)) delete env[key];
	Object.assign(env, next);
}
function resolveManagedRuntimeEnvBaseline() {
	const published = getPublishedConfigRuntimeEnvState();
	return {
		generation: published.generation,
		sourceConfig: published.sourceConfig ?? getRuntimeConfigSourceSnapshot() ?? {}
	};
}
function createManagedRuntimeEnvBase() {
	return createConfigRuntimeEnvBase(resolveManagedRuntimeEnvBaseline().sourceConfig, process.env, { preservedKeys: GATEWAY_CONFIG_SELECTION_ENV_KEYS });
}
function restoreEnvChangesIfUnchanged(params) {
	const keys = /* @__PURE__ */ new Set([...Object.keys(params.before), ...Object.keys(params.after)]);
	for (const key of keys) {
		if (params.before[key] === params.after[key] || params.env[key] !== params.after[key]) continue;
		const previous = params.before[key];
		if (previous === void 0) delete params.env[key];
		else params.env[key] = previous;
	}
}
//#endregion
//#region src/config/io.meta.ts
/** Metadata keys automatically stamped on config writes. */
const AUTO_MANAGED_CONFIG_META_FIELDS = {
	lastTouchedVersion: "lastTouchedVersion",
	lastTouchedAt: "lastTouchedAt"
};
const AUTO_MANAGED_CONFIG_META_PATHS = [["meta", AUTO_MANAGED_CONFIG_META_FIELDS.lastTouchedVersion], [
	"meta",
	"migrations",
	"modelPolicyAllowlist"
]];
function defaultModelScope(value) {
	if (!isRecord(value) || !isRecord(value.agents) || !isRecord(value.agents.defaults)) return null;
	return value.agents.defaults;
}
function collectLegacyDefaultModelAllow(value) {
	const defaults = defaultModelScope(value);
	if (!defaults) return null;
	return computeModelPolicyAllowlist({
		root: value,
		defaults
	});
}
function withDefaultModelAllow(cfg, allow) {
	return {
		...cfg,
		agents: {
			...cfg.agents,
			defaults: {
				...cfg.agents?.defaults,
				modelPolicy: {
					...cfg.agents?.defaults?.modelPolicy,
					allow
				}
			}
		}
	};
}
function withModelPolicyAllowlistMigrationMarker(cfg, params = {}) {
	const withDefault = params.defaultAllow ? withDefaultModelAllow(cfg, params.defaultAllow) : cfg;
	return {
		...withDefault,
		meta: {
			...withDefault.meta,
			migrations: {
				...withDefault.meta?.migrations,
				modelPolicyAllowlist: true
			}
		}
	};
}
function stampModelPolicyAllowlistMigrationForWrite(cfg, previousConfig) {
	const previousDefaultAllow = collectLegacyDefaultModelAllow(previousConfig);
	const defaultAllow = isExplicitModelPolicy(cfg.agents?.defaults?.modelPolicy) ? void 0 : previousDefaultAllow ?? void 0;
	if (defaultAllow) return withModelPolicyAllowlistMigrationMarker(cfg, { defaultAllow });
	if (hasModelPolicyAllowlistMigrationMarker(cfg)) return cfg;
	return withModelPolicyAllowlistMigrationMarker(cfg);
}
function stampConfigWriteMetadata(cfg, _now = (/* @__PURE__ */ new Date()).toISOString(), version = VERSION, previousConfig) {
	const migrationStamped = previousConfig === void 0 ? cfg : stampModelPolicyAllowlistMigrationForWrite(cfg, previousConfig);
	return {
		...migrationStamped,
		meta: {
			...migrationStamped.meta,
			[AUTO_MANAGED_CONFIG_META_FIELDS.lastTouchedVersion]: version
		}
	};
}
/** Persist machine-owned metadata only after the matching config file commit succeeds. */
function recordConfigWriteMetadata(now = (/* @__PURE__ */ new Date()).toISOString(), _version = VERSION) {
	writeConfigMachineState("config.lastTouchedAt", now);
}
//#endregion
//#region src/config/mutation-conflict.ts
/** Raised when a config write loses an optimistic snapshot race. */
var ConfigMutationConflictError = class extends Error {
	constructor(message, params) {
		super(message);
		this.name = "ConfigMutationConflictError";
		this.currentHash = params.currentHash;
		this.retryable = params.retryable ?? true;
	}
};
//#endregion
//#region src/config/io.write-safety.ts
function assertBaseSnapshotStillCurrent(snapshot, configPath, ioFs) {
	if (snapshot.path !== configPath) throw new ConfigMutationConflictError("config path changed since last load", {
		currentHash: null,
		retryable: false
	});
	if (snapshot.readError) return;
	const expectedHash = resolveConfigSnapshotHash(snapshot);
	let currentRaw = null;
	let currentExists = true;
	try {
		currentRaw = ioFs.readFileSync(configPath, "utf-8");
	} catch (error) {
		if (error?.code !== "ENOENT") throw error;
		currentExists = false;
	}
	const currentHash = currentExists ? hashConfigRaw(currentRaw) : null;
	if (currentExists !== snapshot.exists || currentExists && expectedHash !== null && currentHash !== expectedHash) throw new ConfigMutationConflictError("config changed since last load", { currentHash });
}
async function tightenStateDirPermissionsIfNeeded(params) {
	if (process.platform === "win32") return;
	const stateDir = resolveStateDir(params.env, params.homedir);
	const configDir = path.dirname(params.configPath);
	if (path.resolve(configDir) !== path.resolve(stateDir)) return;
	try {
		if (((await params.fsModule.promises.stat(configDir)).mode & 63) !== 0) await params.fsModule.promises.chmod(configDir, 448);
	} catch {}
}
async function rollbackConfigFileWriteIfUnchanged(params) {
	let currentRaw = null;
	try {
		currentRaw = await params.fsModule.promises.readFile(params.configPath, "utf-8");
	} catch (error) {
		if (error?.code !== "ENOENT") throw error;
	}
	if (hashConfigRaw(currentRaw) !== params.committedHash) return false;
	if (params.previousSnapshot.exists && typeof params.previousSnapshot.raw === "string") {
		await replaceFileAtomic({
			filePath: params.configPath,
			content: params.previousSnapshot.raw,
			dirMode: 448,
			mode: 384,
			tempPrefix: path.basename(params.configPath),
			copyFallbackOnPermissionError: true,
			fileSystem: params.fsModule
		});
		return true;
	}
	if (params.previousSnapshot.exists) return false;
	try {
		await params.fsModule.promises.unlink(params.configPath);
	} catch (error) {
		if (error?.code !== "ENOENT") throw error;
	}
	return true;
}
function normalizeStatNumber(value) {
	return asFiniteNumber(value) ?? null;
}
function normalizeStatId(value) {
	if (typeof value === "bigint") return value.toString();
	return typeof value === "number" && Number.isFinite(value) ? String(value) : null;
}
function resolveConfigStatMetadata(stat) {
	return {
		dev: normalizeStatId(stat?.dev ?? null),
		ino: normalizeStatId(stat?.ino ?? null),
		mode: normalizeStatNumber(stat ? stat.mode & 511 : null),
		nlink: normalizeStatNumber(stat?.nlink ?? null),
		uid: normalizeStatNumber(stat?.uid ?? null),
		gid: normalizeStatNumber(stat?.gid ?? null)
	};
}
function resolveConfigWriteSuspiciousReasons(params) {
	const reasons = [];
	if (!params.existsBefore) return reasons;
	if (params.unreadableBefore) reasons.push("unreadable-config-before-write");
	if (typeof params.sizeBaselineBytes === "number" && typeof params.nextBytes === "number" && params.sizeBaselineBytes >= 512 && params.nextBytes < Math.floor(params.sizeBaselineBytes * .5)) reasons.push(`size-drop:${params.sizeBaselineBytes}->${params.nextBytes}`);
	if (!params.hasMetaBefore) reasons.push("missing-meta-before-write");
	if (params.gatewayModeBefore && !params.gatewayModeAfter) reasons.push("gateway-mode-removed");
	return reasons;
}
function resolveConfigWriteBlockingReasons(suspicious, options = {}) {
	return suspicious.filter((reason) => reason === "unreadable-config-before-write" || reason.startsWith("size-drop:") && options.allowConfigSizeDrop !== true || reason === "gateway-mode-removed");
}
function formatConfigArtifactTimestamp$1(ts) {
	return ts.replaceAll(":", "-").replaceAll(".", "-");
}
function stampConfigVersion(cfg, version, previousConfig) {
	return stampConfigWriteMetadata(cfg, (/* @__PURE__ */ new Date()).toISOString(), version, previousConfig);
}
function resolveConfigSizeBaselineBytes(params) {
	if (params.raw === null) return null;
	const rawBytes = Buffer.byteLength(params.raw, "utf-8");
	const parsed = parseConfigJson5(params.raw, params.json5);
	if (!parsed.ok || !isRecord(parsed.parsed)) return rawBytes;
	const canonical = JSON.stringify(stampConfigVersion(parsed.parsed, params.lastTouchedVersionOverride), null, 2).trimEnd().concat("\n");
	return Buffer.byteLength(canonical, "utf-8");
}
//#endregion
//#region src/config/io.observe-state.ts
function readConfigHealthEntry(state, configPath) {
	const entry = state.entries?.[configPath];
	return isRecord(entry) ? entry : {};
}
function updateConfigHealthEntry(state, configPath, entry) {
	return {
		...state,
		entries: {
			...state.entries,
			[configPath]: entry
		}
	};
}
function createConfigHealthFingerprint(params) {
	return {
		hash: params.hash ?? hashConfigRaw(params.raw),
		bytes: Buffer.byteLength(params.raw, "utf-8"),
		mtimeMs: params.stat?.mtimeMs ?? null,
		ctimeMs: params.stat?.ctimeMs ?? null,
		...resolveConfigStatMetadata(params.stat),
		hasMeta: hasConfigMeta(params.parsed),
		gatewayMode: resolveGatewayMode(params.resolved ?? params.parsed),
		observedAt: params.observedAt ?? (/* @__PURE__ */ new Date()).toISOString()
	};
}
function createConfigFingerprintFromRead(params) {
	const parsed = parseConfigJson5(params.raw, params.deps.json5);
	return createConfigHealthFingerprint({
		raw: params.raw,
		parsed: parsed.ok ? parsed.parsed : {},
		stat: params.stat
	});
}
async function readConfigFingerprintForPath(deps, configPath) {
	try {
		return createConfigFingerprintFromRead({
			deps,
			raw: await deps.fs.promises.readFile(configPath, "utf-8"),
			stat: await deps.fs.promises.stat(configPath).catch(() => null)
		});
	} catch {
		return null;
	}
}
function readConfigFingerprintForPathSync(deps, configPath) {
	try {
		const raw = deps.fs.readFileSync(configPath, "utf-8");
		let stat = null;
		try {
			stat = deps.fs.statSync(configPath, { throwIfNoEntry: false }) ?? null;
		} catch {}
		return createConfigFingerprintFromRead({
			deps,
			raw,
			stat
		});
	} catch {
		return null;
	}
}
function createConfigObserveAuditRecord(params) {
	const { current, lastKnownGood, backup } = params;
	return {
		ts: current.observedAt,
		source: "config-io",
		event: "config.observe",
		phase: "read",
		configPath: params.configPath,
		...snapshotConfigAuditProcessInfo(),
		exists: true,
		valid: params.valid,
		hash: current.hash,
		bytes: current.bytes,
		mtimeMs: current.mtimeMs,
		ctimeMs: current.ctimeMs,
		dev: current.dev,
		ino: current.ino,
		mode: current.mode,
		nlink: current.nlink,
		uid: current.uid,
		gid: current.gid,
		hasMeta: current.hasMeta,
		gatewayMode: current.gatewayMode,
		suspicious: params.suspicious,
		lastKnownGoodHash: lastKnownGood?.hash ?? null,
		lastKnownGoodBytes: lastKnownGood?.bytes ?? null,
		lastKnownGoodMtimeMs: lastKnownGood?.mtimeMs ?? null,
		lastKnownGoodCtimeMs: lastKnownGood?.ctimeMs ?? null,
		lastKnownGoodDev: lastKnownGood?.dev ?? null,
		lastKnownGoodIno: lastKnownGood?.ino ?? null,
		lastKnownGoodMode: lastKnownGood?.mode ?? null,
		lastKnownGoodNlink: lastKnownGood?.nlink ?? null,
		lastKnownGoodUid: lastKnownGood?.uid ?? null,
		lastKnownGoodGid: lastKnownGood?.gid ?? null,
		lastKnownGoodGatewayMode: lastKnownGood?.gatewayMode ?? null,
		backupHash: backup?.hash ?? null,
		backupBytes: backup?.bytes ?? null,
		backupMtimeMs: backup?.mtimeMs ?? null,
		backupCtimeMs: backup?.ctimeMs ?? null,
		backupDev: backup?.dev ?? null,
		backupIno: backup?.ino ?? null,
		backupMode: backup?.mode ?? null,
		backupNlink: backup?.nlink ?? null,
		backupUid: backup?.uid ?? null,
		backupGid: backup?.gid ?? null,
		backupGatewayMode: backup?.gatewayMode ?? null,
		clobberedPath: params.clobberedPath ?? null,
		restoredFromBackup: params.restoredFromBackup ?? false,
		restoredBackupPath: params.restoredBackupPath ?? null,
		restoreErrorCode: params.restoreErrorCode ?? null,
		restoreErrorMessage: params.restoreErrorMessage ?? null
	};
}
//#endregion
//#region src/config/io.observe-suspicious.ts
function isUpdateChannelOnlyRoot(value) {
	if (!isRecord(value)) return false;
	const keys = Object.keys(value);
	if (keys.length !== 1 || keys[0] !== "update") return false;
	const update = value.update;
	if (!isRecord(update)) return false;
	return Object.keys(update).length === 1 && typeof update.channel === "string";
}
function resolveConfigObserveSuspiciousReasons(params) {
	const reasons = [];
	const baseline = params.lastKnownGood;
	if (!baseline) return reasons;
	if (baseline.bytes >= 512 && params.bytes < Math.floor(baseline.bytes * .5)) reasons.push(`size-drop-vs-last-good:${baseline.bytes}->${params.bytes}`);
	if (baseline.hasMeta && !params.hasMeta) reasons.push("missing-meta-vs-last-good");
	if (baseline.gatewayMode && !params.gatewayMode) reasons.push("gateway-mode-missing-vs-last-good");
	if (baseline.gatewayMode && isUpdateChannelOnlyRoot(params.parsed)) reasons.push("update-channel-only-root");
	return reasons;
}
//#endregion
//#region src/config/io.observe.ts
function sameFingerprint(left, right) {
	if (!left) return false;
	return left.hash === right.hash && left.bytes === right.bytes && left.mtimeMs === right.mtimeMs && left.ctimeMs === right.ctimeMs && left.dev === right.dev && left.ino === right.ino && left.mode === right.mode && left.nlink === right.nlink && left.uid === right.uid && left.gid === right.gid && left.hasMeta === right.hasMeta && left.gatewayMode === right.gatewayMode;
}
function createObservedFingerprint(snapshot, stat) {
	const raw = snapshot.raw;
	return createConfigHealthFingerprint({
		raw,
		parsed: snapshot.parsed,
		resolved: snapshot.resolved,
		stat,
		hash: resolveConfigSnapshotHash(snapshot) ?? void 0
	});
}
function resolveObservation(params) {
	const entry = readConfigHealthEntry(params.healthState, params.snapshot.path);
	const baseline = entry.lastKnownGood ?? params.backupBaseline;
	return {
		entry,
		baseline,
		suspicious: resolveConfigObserveSuspiciousReasons({
			bytes: params.current.bytes,
			hasMeta: params.current.hasMeta,
			gatewayMode: params.current.gatewayMode,
			parsed: params.snapshot.parsed,
			lastKnownGood: baseline
		})
	};
}
function updateHealthyObservation(params) {
	if (!params.snapshot.valid) return null;
	const nextEntry = {
		...params.entry,
		lastKnownGood: params.current,
		lastObservedSuspiciousSignature: null
	};
	return !sameFingerprint(params.entry.lastKnownGood, params.current) || params.entry.lastObservedSuspiciousSignature !== null ? updateConfigHealthEntry(params.healthState, params.snapshot.path, nextEntry) : null;
}
async function observeConfigSnapshot(deps, snapshot) {
	if (!snapshot.exists || typeof snapshot.raw !== "string") return;
	const current = createObservedFingerprint(snapshot, await deps.fs.promises.stat(snapshot.path).catch(() => null));
	let healthState = readConfigHealthStateFromStore(deps);
	const backupPath = `${snapshot.path}.bak`;
	const backupBaseline = readConfigHealthEntry(healthState, snapshot.path).lastKnownGood ?? await readConfigFingerprintForPath(deps, backupPath) ?? void 0;
	const { entry, baseline, suspicious } = resolveObservation({
		snapshot,
		current,
		healthState,
		backupBaseline
	});
	if (suspicious.length === 0) {
		const nextState = updateHealthyObservation({
			snapshot,
			current,
			entry,
			healthState
		});
		if (nextState) writeConfigHealthStateToStore(deps, nextState);
		return;
	}
	const signature = `${current.hash}:${suspicious.join(",")}`;
	if (entry.lastObservedSuspiciousSignature === signature) return;
	const backup = (baseline?.hash ? baseline : null) ?? await readConfigFingerprintForPath(deps, backupPath);
	deps.logger.warn(`Config observe anomaly: ${snapshot.path} (${suspicious.join(", ")})`);
	await appendConfigAuditRecord({
		env: deps.env,
		homedir: deps.homedir,
		record: createConfigObserveAuditRecord({
			configPath: snapshot.path,
			valid: snapshot.valid,
			current,
			suspicious,
			lastKnownGood: entry.lastKnownGood,
			backup
		})
	});
	healthState = updateConfigHealthEntry(healthState, snapshot.path, {
		...entry,
		lastObservedSuspiciousSignature: signature
	});
	writeConfigHealthStateToStore(deps, healthState);
}
function observeConfigSnapshotSync(deps, snapshot) {
	if (!snapshot.exists || typeof snapshot.raw !== "string") return;
	const current = createObservedFingerprint(snapshot, deps.fs.statSync(snapshot.path, { throwIfNoEntry: false }) ?? null);
	let healthState = readConfigHealthStateFromStore(deps);
	const backupPath = `${snapshot.path}.bak`;
	const backupBaseline = readConfigHealthEntry(healthState, snapshot.path).lastKnownGood ?? readConfigFingerprintForPathSync(deps, backupPath) ?? void 0;
	const { entry, baseline, suspicious } = resolveObservation({
		snapshot,
		current,
		healthState,
		backupBaseline
	});
	if (suspicious.length === 0) {
		const nextState = updateHealthyObservation({
			snapshot,
			current,
			entry,
			healthState
		});
		if (nextState) writeConfigHealthStateToStore(deps, nextState);
		return;
	}
	const signature = `${current.hash}:${suspicious.join(",")}`;
	if (entry.lastObservedSuspiciousSignature === signature) return;
	const backup = (baseline?.hash ? baseline : null) ?? readConfigFingerprintForPathSync(deps, backupPath);
	deps.logger.warn(`Config observe anomaly: ${snapshot.path} (${suspicious.join(", ")})`);
	appendConfigAuditRecordSync({
		env: deps.env,
		homedir: deps.homedir,
		record: createConfigObserveAuditRecord({
			configPath: snapshot.path,
			valid: snapshot.valid,
			current,
			suspicious,
			lastKnownGood: entry.lastKnownGood,
			backup
		})
	});
	healthState = updateConfigHealthEntry(healthState, snapshot.path, {
		...entry,
		lastObservedSuspiciousSignature: signature
	});
	writeConfigHealthStateToStore(deps, healthState);
}
//#endregion
//#region src/config/io.owner-display-secret.ts
/** Retains generated owner display secrets in memory without persisting them into config. */
function retainGeneratedOwnerDisplaySecret(params) {
	const { config, configPath, generatedSecret, state } = params;
	if (!generatedSecret) {
		state.pendingByPath.delete(configPath);
		return config;
	}
	state.pendingByPath.set(configPath, generatedSecret);
	return config;
}
//#endregion
//#region src/config/io.state.ts
const CONFIG_IO_WARNING_CACHE_MAX_SIZE = 4096;
const loggedInvalidConfigs = createDedupeCache({
	ttlMs: 0,
	maxSize: CONFIG_IO_WARNING_CACHE_MAX_SIZE
});
const loggedConfigWarningFingerprints = /* @__PURE__ */ new Map();
const warnedFutureTouchedVersions = createDedupeCache({
	ttlMs: 0,
	maxSize: CONFIG_IO_WARNING_CACHE_MAX_SIZE
});
const autoOwnerDisplaySecretByPath = /* @__PURE__ */ new Map();
/** Retains a warning fingerprint as most-recently used while enforcing the shared bound. */
function setBoundedConfigIoWarningEntry(map, key, value) {
	map.delete(key);
	map.set(key, value);
	pruneMapToMaxSize(map, CONFIG_IO_WARNING_CACHE_MAX_SIZE);
}
//#endregion
//#region src/config/agent-limits.ts
const MIN_AGENT_MAX_CONCURRENT = 8;
const MAX_AGENT_MAX_CONCURRENT = 16;
let defaultAgentMaxConcurrent;
function resolveDefaultAgentMaxConcurrent() {
	if (defaultAgentMaxConcurrent === void 0) {
		const availableParallelism = typeof os.availableParallelism === "function" ? os.availableParallelism() : os.cpus().length;
		defaultAgentMaxConcurrent = Math.min(MAX_AGENT_MAX_CONCURRENT, Math.max(MIN_AGENT_MAX_CONCURRENT, availableParallelism));
	}
	return defaultAgentMaxConcurrent;
}
/** Resolves top-level agent concurrency, flooring finite values and clamping to at least one. */
function resolveAgentMaxConcurrent(cfg) {
	const raw = cfg?.agents?.defaults?.maxConcurrent;
	if (typeof raw === "number" && Number.isFinite(raw)) return Math.max(1, Math.floor(raw));
	return resolveDefaultAgentMaxConcurrent();
}
/** Resolves subagent concurrency, flooring finite values and clamping to at least one. */
function resolveSubagentMaxConcurrent(cfg) {
	const raw = cfg?.agents?.defaults?.subagents?.maxConcurrent;
	if (typeof raw === "number" && Number.isFinite(raw)) return Math.max(1, Math.floor(raw));
	return 8;
}
//#endregion
//#region src/config/provider-policy.ts
/** Applies bundled provider-owned normalization to one provider config during config defaults. */
function normalizeProviderConfigForConfigDefaults(params) {
	const normalized = resolveBundledProviderPolicySurface(params.provider, { manifestRegistry: params.manifestRegistry })?.normalizeConfig?.({
		provider: params.provider,
		providerConfig: params.providerConfig
	});
	return normalized && normalized !== params.providerConfig ? normalized : params.providerConfig;
}
/** Applies bundled provider-owned defaults to the full config when that provider has policy. */
function applyProviderConfigDefaultsForConfig(params) {
	return resolveBundledProviderPolicySurface(params.provider, { manifestRegistry: params.manifestRegistry })?.applyConfigDefaults?.({
		provider: params.provider,
		config: params.config,
		env: params.env
	}) ?? params.config;
}
//#endregion
//#region src/config/defaults.ts
const defaultWarnState = { warned: false };
const DEFAULT_MODEL_ALIASES = {
	opus: "anthropic/claude-opus-5",
	sonnet: "anthropic/claude-sonnet-5",
	gpt: "openai/gpt-5.4",
	"gpt-mini": "openai/gpt-5.4-mini",
	"gpt-nano": "openai/gpt-5.4-nano",
	gemini: "google/gemini-3.1-pro-preview",
	"gemini-flash": "google/gemini-3-flash-preview",
	"gemini-flash-lite": "google/gemini-3.1-flash-lite"
};
const DEFAULT_MODEL_COST = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0
};
const DEFAULT_MODEL_INPUT = ["text"];
const DEFAULT_MODEL_MAX_TOKENS = 8192;
const MISTRAL_SAFE_MAX_TOKENS_BY_MODEL = {
	"devstral-medium-latest": 32768,
	"magistral-small": 4e4,
	"mistral-large-latest": 16384,
	"mistral-medium-2508": 8192,
	"mistral-small-latest": 16384,
	"pixtral-large-latest": 32768
};
function isPositiveNumber(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0;
}
function resolveModelCost(raw) {
	return {
		input: typeof raw?.input === "number" ? raw.input : DEFAULT_MODEL_COST.input,
		output: typeof raw?.output === "number" ? raw.output : DEFAULT_MODEL_COST.output,
		cacheRead: typeof raw?.cacheRead === "number" ? raw.cacheRead : DEFAULT_MODEL_COST.cacheRead,
		cacheWrite: typeof raw?.cacheWrite === "number" ? raw.cacheWrite : DEFAULT_MODEL_COST.cacheWrite,
		...raw?.tieredPricing ? { tieredPricing: raw.tieredPricing } : {}
	};
}
function resolveNormalizedProviderModelMaxTokens(params) {
	const clamped = Math.min(params.rawMaxTokens, params.contextWindow);
	if (normalizeProviderId(params.providerId) !== "mistral") return clamped;
	const safeMaxTokens = Object.hasOwn(MISTRAL_SAFE_MAX_TOKENS_BY_MODEL, params.modelId) ? MISTRAL_SAFE_MAX_TOKENS_BY_MODEL[params.modelId] : void 0;
	if (safeMaxTokens !== void 0) return Math.min(clamped, safeMaxTokens);
	return clamped < params.contextWindow ? clamped : Math.min(DEFAULT_MODEL_MAX_TOKENS, params.contextWindow);
}
function applyMessageDefaults(cfg) {
	const messages = cfg.messages;
	if (messages?.ackReactionScope !== void 0) return cfg;
	const nextMessages = messages ? { ...messages } : {};
	nextMessages.ackReactionScope = "group-mentions";
	return {
		...cfg,
		messages: nextMessages
	};
}
function applySessionDefaults(cfg, options = {}) {
	const session = cfg.session;
	if (!session || session.mainKey === void 0) return cfg;
	const trimmed = session.mainKey.trim();
	const warn = options.warn ?? console.warn;
	const warnState = options.warnState ?? defaultWarnState;
	const next = {
		...cfg,
		session: {
			...session,
			mainKey: "main"
		}
	};
	if (trimmed && trimmed !== "main" && !warnState.warned) {
		warnState.warned = true;
		warn("session.mainKey is ignored; main session is always \"main\".");
	}
	return next;
}
function applyTalkConfigNormalization(config) {
	return normalizeTalkConfig(config);
}
function applyModelDefaults(cfg, options = {}) {
	let mutated = false;
	let nextCfg = cfg;
	const providerConfig = nextCfg.models?.providers;
	if (providerConfig) {
		const manifestRegistry = options.manifestRegistry ?? options.loadManifestRegistry?.();
		const modelIdNormalizationPolicies = manifestRegistry ? collectManifestModelIdNormalizationPolicies(manifestRegistry.plugins) : void 0;
		const nextProviders = { ...providerConfig };
		for (const [providerId, provider] of Object.entries(providerConfig)) {
			const normalizedProvider = normalizeProviderConfigForConfigDefaults({
				provider: providerId,
				providerConfig: provider,
				manifestRegistry
			});
			const models = normalizedProvider.models;
			if (!Array.isArray(models) || models.length === 0) {
				if (normalizedProvider !== provider) {
					nextProviders[providerId] = normalizedProvider;
					mutated = true;
				}
				continue;
			}
			const providerApi = normalizedProvider.api;
			const providerContextWindow = isPositiveNumber(normalizedProvider.contextWindow) ? normalizedProvider.contextWindow : void 0;
			const providerContextTokens = isPositiveNumber(normalizedProvider.contextTokens) ? normalizedProvider.contextTokens : void 0;
			const providerMaxTokens = isPositiveNumber(normalizedProvider.maxTokens) ? normalizedProvider.maxTokens : void 0;
			const nextProvider = normalizedProvider;
			if (nextProvider !== provider) mutated = true;
			let providerMutated = false;
			const nextModels = models.map((model) => {
				const raw = model;
				let modelMutated = false;
				const id = normalizeConfiguredProviderCatalogModelId(providerId, raw.id, modelIdNormalizationPolicies);
				if (id !== raw.id) modelMutated = true;
				const reasoning = typeof raw.reasoning === "boolean" ? raw.reasoning : false;
				if (raw.reasoning !== reasoning) modelMutated = true;
				const input = raw.input ?? [...DEFAULT_MODEL_INPUT];
				if (raw.input === void 0) modelMutated = true;
				const cost = resolveModelCost(raw.cost);
				if (!raw.cost || raw.cost.input !== cost.input || raw.cost.output !== cost.output || raw.cost.cacheRead !== cost.cacheRead || raw.cost.cacheWrite !== cost.cacheWrite) modelMutated = true;
				const contextWindow = isPositiveNumber(raw.contextWindow) ? raw.contextWindow : providerContextWindow ?? 2e5;
				if (raw.contextWindow !== contextWindow) modelMutated = true;
				const contextTokens = isPositiveNumber(raw.contextTokens) ? raw.contextTokens : providerContextTokens;
				if (raw.contextTokens !== contextTokens) modelMutated = true;
				const defaultMaxTokens = Math.min(providerMaxTokens ?? DEFAULT_MODEL_MAX_TOKENS, contextWindow);
				const rawMaxTokens = isPositiveNumber(raw.maxTokens) ? raw.maxTokens : defaultMaxTokens;
				const maxTokens = resolveNormalizedProviderModelMaxTokens({
					providerId,
					modelId: id,
					contextWindow,
					rawMaxTokens
				});
				if (raw.maxTokens !== maxTokens) modelMutated = true;
				const api = raw.api ?? providerApi;
				if (raw.api !== api) modelMutated = true;
				if (!modelMutated) return model;
				providerMutated = true;
				return Object.assign({}, raw, {
					id,
					reasoning,
					input,
					cost,
					contextWindow,
					contextTokens,
					maxTokens,
					api
				});
			});
			if (!providerMutated) {
				if (nextProvider !== provider) nextProviders[providerId] = nextProvider;
				continue;
			}
			nextProviders[providerId] = {
				...nextProvider,
				models: nextModels
			};
			mutated = true;
		}
		if (mutated) nextCfg = {
			...nextCfg,
			models: {
				...nextCfg.models,
				providers: nextProviders
			}
		};
	}
	let nextAgents = nextCfg.agents;
	const rawAgentList = nextAgents?.list;
	if (Array.isArray(rawAgentList)) {
		let listMutated = false;
		const agentList = rawAgentList.map((agent) => {
			if (!isRecord(agent)) return agent;
			let nextAgent = agent;
			if (Object.hasOwn(agent, "model")) {
				const normalizedModel = normalizeAgentModelConfigForDefaults(agent.model);
				if (normalizedModel !== agent.model) {
					nextAgent = {
						...nextAgent,
						model: normalizedModel
					};
					listMutated = true;
				}
			}
			if (isRecord(agent.models)) {
				const normalizedModels = normalizeAgentModelMapForConfig(agent.models);
				if (normalizedModels !== agent.models) {
					nextAgent = {
						...nextAgent,
						models: normalizedModels
					};
					listMutated = true;
				}
			}
			return nextAgent;
		});
		if (listMutated) {
			nextAgents = {
				...nextAgents,
				list: agentList
			};
			mutated = true;
		}
	}
	const existingAgent = nextAgents?.defaults;
	if (!existingAgent) {
		if (!mutated) return cfg;
		return nextAgents === nextCfg.agents ? nextCfg : {
			...nextCfg,
			agents: nextAgents
		};
	}
	let nextAgent = existingAgent;
	const normalizedModel = normalizeAgentModelConfigForDefaults(existingAgent.model);
	if (normalizedModel !== existingAgent.model) {
		nextAgent = {
			...nextAgent,
			model: normalizedModel
		};
		mutated = true;
	}
	const rawExistingModels = existingAgent.models ?? {};
	const existingModels = normalizeAgentModelMapForConfig(rawExistingModels);
	if (existingModels !== rawExistingModels) mutated = true;
	if (Object.keys(existingModels).length === 0) return mutated ? {
		...nextCfg,
		agents: {
			...nextAgents,
			defaults: nextAgent
		}
	} : cfg;
	const nextModels = { ...existingModels };
	for (const [alias, target] of Object.entries(DEFAULT_MODEL_ALIASES)) {
		const entry = nextModels[target];
		if (!entry) continue;
		if (entry.alias !== void 0) continue;
		const normalizedAlias = normalizeLowercaseStringOrEmpty(alias);
		if (Object.entries(nextModels).some(([modelRef, candidate]) => modelRef !== target && normalizeLowercaseStringOrEmpty(candidate.alias) === normalizedAlias)) continue;
		nextModels[target] = {
			...entry,
			alias
		};
		mutated = true;
	}
	if (!mutated) return cfg;
	return {
		...nextCfg,
		agents: {
			...nextAgents,
			defaults: {
				...nextAgent,
				models: nextModels
			}
		}
	};
}
function normalizeAgentModelConfigForDefaults(value) {
	if (typeof value === "string") {
		const normalized = normalizeAgentModelRefForConfig(value);
		return normalized === value ? value : normalized;
	}
	if (!value || typeof value !== "object" || Array.isArray(value)) return value;
	const raw = value;
	let mutated = false;
	const next = { ...raw };
	if (typeof raw.primary === "string") {
		const primary = normalizeAgentModelRefForConfig(raw.primary);
		if (primary !== raw.primary) {
			next.primary = primary;
			mutated = true;
		}
	}
	if (Array.isArray(raw.fallbacks)) {
		const rawFallbacks = raw.fallbacks;
		const fallbacks = rawFallbacks.map((fallback) => typeof fallback === "string" ? normalizeAgentModelRefForConfig(fallback) : fallback);
		if (fallbacks.some((fallback, index) => fallback !== rawFallbacks[index])) {
			next.fallbacks = fallbacks;
			mutated = true;
		}
	}
	return mutated ? next : value;
}
function applyAgentDefaults(cfg) {
	const agents = cfg.agents;
	const defaults = agents?.defaults;
	const hasMax = typeof defaults?.maxConcurrent === "number" && Number.isFinite(defaults.maxConcurrent);
	const hasSubMax = typeof defaults?.subagents?.maxConcurrent === "number" && Number.isFinite(defaults.subagents.maxConcurrent);
	const hasSubArchive = typeof defaults?.subagents?.archiveAfterMinutes === "number" && Number.isFinite(defaults.subagents.archiveAfterMinutes);
	if (hasMax && hasSubMax && hasSubArchive) return cfg;
	let mutated = false;
	const nextDefaults = defaults ? { ...defaults } : {};
	if (!hasMax) {
		nextDefaults.maxConcurrent = resolveAgentMaxConcurrent();
		mutated = true;
	}
	const nextSubagents = defaults?.subagents ? { ...defaults.subagents } : {};
	if (!hasSubMax) {
		nextSubagents.maxConcurrent = 8;
		mutated = true;
	}
	if (!hasSubArchive) {
		nextSubagents.archiveAfterMinutes = 60;
		mutated = true;
	}
	if (!mutated) return cfg;
	return {
		...cfg,
		agents: {
			...agents,
			defaults: {
				...nextDefaults,
				subagents: nextSubagents
			}
		}
	};
}
function applyCronDefaults(cfg) {
	return cfg;
}
function applyLoggingDefaults(cfg) {
	return cfg;
}
function hasAnthropicDefaultSignal(cfg, env) {
	if (env.ANTHROPIC_API_KEY?.trim() || env.ANTHROPIC_OAUTH_TOKEN?.trim()) return true;
	const profiles = cfg.auth?.profiles;
	if (profiles) for (const profile of Object.values(profiles)) {
		const provider = normalizeProviderId(profile?.provider);
		if (provider === "anthropic" || provider === "claude-cli") return true;
	}
	const order = cfg.auth?.order;
	if (!order) return false;
	return Object.keys(order).some((provider) => {
		const normalizedProvider = normalizeProviderId(provider);
		if (normalizedProvider !== "anthropic" && normalizedProvider !== "claude-cli") return false;
		return order[provider] !== void 0;
	});
}
function applyContextPruningDefaults(cfg, options = {}) {
	if (!cfg.agents?.defaults) return cfg;
	if (!hasAnthropicDefaultSignal(cfg, process.env)) return cfg;
	return applyProviderConfigDefaultsForConfig({
		provider: "anthropic",
		config: cfg,
		env: process.env,
		manifestRegistry: options.manifestRegistry
	}) ?? cfg;
}
function applyCompactionDefaults(cfg) {
	const defaults = cfg.agents?.defaults;
	if (!defaults) return cfg;
	const compaction = defaults?.compaction;
	if (compaction?.mode) return cfg;
	return {
		...cfg,
		agents: {
			...cfg.agents,
			defaults: {
				...defaults,
				compaction: {
					...compaction,
					mode: "safeguard"
				}
			}
		}
	};
}
//#endregion
//#region src/config/normalize-exec-safe-bin.ts
/**
* Config normalization for exec safe-bin policy before materialized config is consumed.
* Keep this limited to persisted global/per-agent config shape; runtime trust decisions live in infra.
*/
/** Normalize exec safe-bin profiles and trusted dirs in global and per-agent config scopes. */
function normalizeExecSafeBinProfilesInConfig(cfg) {
	const normalizeExec = (exec) => {
		if (!exec || typeof exec !== "object" || Array.isArray(exec)) return;
		const typedExec = exec;
		const normalizedProfiles = normalizeSafeBinProfileFixtures(typedExec.safeBinProfiles);
		typedExec.safeBinProfiles = Object.keys(normalizedProfiles).length > 0 ? normalizedProfiles : void 0;
		const normalizedTrustedDirs = normalizeTrustedSafeBinDirs(typedExec.safeBinTrustedDirs);
		typedExec.safeBinTrustedDirs = normalizedTrustedDirs.length > 0 ? normalizedTrustedDirs : void 0;
	};
	normalizeExec(cfg.tools?.exec);
	for (const agent of listAgentEntries(cfg)) normalizeExec(agent?.tools?.exec);
}
//#endregion
//#region src/config/normalize-paths.ts
const PATH_VALUE_RE = /^~(?=$|[\\/])/;
const PATH_KEY_RE = /(dir|path|paths|file|root|workspace)$/i;
const PATH_LIST_KEYS = /* @__PURE__ */ new Set(["paths", "pathPrepend"]);
function normalizeStringValue(key, value) {
	if (!PATH_VALUE_RE.test(value.trim())) return value;
	if (!key) return value;
	if (PATH_KEY_RE.test(key) || PATH_LIST_KEYS.has(key)) return resolveUserPath(value);
	return value;
}
function normalizeAny(key, value) {
	if (typeof value === "string") return normalizeStringValue(key, value);
	if (Array.isArray(value)) {
		const normalizeChildren = Boolean(key && PATH_LIST_KEYS.has(key));
		return value.map((entry) => {
			if (typeof entry === "string") return normalizeChildren ? normalizeStringValue(key, entry) : entry;
			if (Array.isArray(entry)) return normalizeAny(void 0, entry);
			if (isPlainObject(entry)) return normalizeAny(void 0, entry);
			return entry;
		});
	}
	if (!isPlainObject(value)) return value;
	for (const [childKey, childValue] of Object.entries(value)) {
		const next = normalizeAny(childKey, childValue);
		if (next !== childValue) value[childKey] = next;
	}
	return value;
}
/**
* Normalize "~" paths in path-ish config fields.
*
* Goal: accept `~/...` consistently across config file + env overrides, while
* keeping the surface area small and predictable.
*/
function normalizeConfigPaths(cfg) {
	if (!cfg || typeof cfg !== "object") return cfg;
	normalizeAny(void 0, cfg);
	return cfg;
}
//#endregion
//#region src/config/materialize.ts
const FULL_MATERIALIZATION_PROFILE = {
	includeCompactionDefaults: true,
	includeContextPruningDefaults: true,
	includeLoggingDefaults: true,
	normalizePaths: true
};
const MATERIALIZATION_PROFILES = {
	load: FULL_MATERIALIZATION_PROFILE,
	missing: {
		includeCompactionDefaults: true,
		includeContextPruningDefaults: true,
		includeLoggingDefaults: false,
		normalizePaths: false
	},
	snapshot: FULL_MATERIALIZATION_PROFILE
};
function asResolvedSourceConfig(config) {
	return config;
}
function asRuntimeConfig(config) {
	return config;
}
function materializeRuntimeConfig(config, mode, options = {}) {
	const profile = MATERIALIZATION_PROFILES[mode];
	let next = applyMessageDefaults(config);
	if (profile.includeLoggingDefaults) next = applyLoggingDefaults(next);
	next = applySessionDefaults(next);
	next = applyAgentDefaults(next);
	next = applyCronDefaults(next);
	if (profile.includeContextPruningDefaults) next = applyContextPruningDefaults(next, { manifestRegistry: options.manifestRegistry });
	if (profile.includeCompactionDefaults) next = applyCompactionDefaults(next);
	next = applyModelDefaults(next, {
		manifestRegistry: options.manifestRegistry,
		loadManifestRegistry: options.loadManifestRegistry
	});
	next = applyTalkConfigNormalization(next);
	if (profile.normalizePaths) normalizeConfigPaths(next);
	normalizeExecSafeBinProfilesInConfig(next);
	return asRuntimeConfig(inheritLegacyDefaultAgentId(config, next));
}
//#endregion
//#region src/config/agent-list-projection.ts
/** Attach the non-serialized list projection used by legacy runtime consumers. */
function attachAgentListProjection(config) {
	const agents = config.agents;
	if (!agents || typeof agents !== "object" || Array.isArray(agents)) return config;
	Object.defineProperty(agents, "list", {
		configurable: true,
		enumerable: false,
		value: listAgentEntries(config),
		writable: false
	});
	return config;
}
//#endregion
//#region src/config/runtime-overrides.ts
let overrides = {};
function sanitizeOverrideValue(value, seen = /* @__PURE__ */ new WeakSet()) {
	if (Array.isArray(value)) return value.map((entry) => sanitizeOverrideValue(entry, seen));
	if (!isPlainObject(value)) return value;
	if (seen.has(value)) return {};
	seen.add(value);
	const sanitized = {};
	for (const [key, entry] of Object.entries(value)) {
		if (entry === void 0 || isBlockedObjectKey(key)) continue;
		sanitized[key] = sanitizeOverrideValue(entry, seen);
	}
	seen.delete(value);
	return sanitized;
}
function mergeOverrides(base, override) {
	if (!isPlainObject(base) || !isPlainObject(override)) return override;
	const next = { ...base };
	for (const [key, value] of Object.entries(override)) {
		if (value === void 0 || isBlockedObjectKey(key)) continue;
		next[key] = mergeOverrides(base[key], value);
	}
	return next;
}
function applyOverrideTree(cfg, overrideTree) {
	const next = mergeOverrides(cfg, overrideTree);
	if (next.agents === cfg.agents) return inheritLegacyDefaultAgentId(cfg, next);
	return inheritLegacyDefaultAgentId(cfg, attachAgentListProjection(next));
}
/** Return the process-local runtime override tree used by debug config commands. */
function getConfigOverrides() {
	return overrides;
}
/** Clear all process-local runtime overrides. Intended for debug reset flows and tests. */
function resetConfigOverrides() {
	overrides = {};
}
/** Set one runtime override at a parsed config path after sanitizing object values. */
function setConfigOverride(pathRaw, value) {
	const parsed = parseConfigPath(pathRaw);
	if (!parsed.ok) return err(parsed.error);
	setConfigValueAtPath(overrides, parsed.path, sanitizeOverrideValue(value));
	return ok(parsed.path);
}
/** Remove one runtime override path and report whether an override was present. */
function unsetConfigOverride(pathRaw) {
	const parsed = parseConfigPath(pathRaw);
	if (!parsed.ok) return err(parsed.error);
	return ok(unsetConfigValueAtPath(overrides, parsed.path));
}
/** Merge the current runtime overrides over a loaded config without mutating the input config. */
function applyConfigOverrides(cfg) {
	if (!overrides || Object.keys(overrides).length === 0) return cfg;
	return applyOverrideTree(cfg, overrides);
}
/** Capture an immutable applier for the process-local overrides active at this instant. */
function captureConfigOverrideApplier() {
	const capturedOverrides = structuredClone(overrides);
	if (Object.keys(capturedOverrides).length === 0) return (cfg) => cfg;
	return (cfg) => applyOverrideTree(cfg, capturedOverrides);
}
//#endregion
//#region src/config/official-external-channel-secret-schema.ts
/** Widens official external channel schemas for host-resolved SecretRef fields. */
const SECRET_REF_SCHEMA = SecretRefSchema.toJSONSchema({
	io: "input",
	target: "draft-07",
	unrepresentable: "any"
});
function asSchemaObject(value) {
	return asOptionalRecord(value);
}
function widenProperties(properties, fields) {
	if (!properties) return;
	for (const field of fields) {
		const current = asSchemaObject(properties[field]);
		if (current) properties[field] = { anyOf: [current, cloneSchema(SECRET_REF_SCHEMA)] };
	}
}
/** Keeps external plugin schemas honest while allowing host-resolved secret inputs. */
function widenOfficialExternalChannelSecretSchema(params) {
	const contract = getOfficialExternalChannelSecretContract(params.channelId);
	const hostSchemaAllOf = getOfficialExternalChannelHostSchemaAllOf(params.channelId);
	if (!contract && hostSchemaAllOf.length === 0 || !params.schema) return params.schema;
	const next = cloneSchema(params.schema);
	if (contract) {
		const fields = contract.fields.map((field) => field.field);
		widenProperties(next.properties, fields);
		widenProperties(asSchemaObject(asSchemaObject(next.properties?.accounts)?.additionalProperties)?.properties, fields);
	}
	if (hostSchemaAllOf.length > 0) next.allOf = [...Array.isArray(next.allOf) ? next.allOf : [], ...hostSchemaAllOf.map((clause) => cloneSchema(clause))];
	return next;
}
//#endregion
//#region src/config/channel-config-metadata.ts
/**
* Converts plugin manifest metadata into deterministic config UI metadata for docs, validation, and runtime schema.
* When multiple plugin origins expose the same id/channel, the closest origin owns the surfaced schema.
*/
const PLUGIN_ORIGIN_RANK = {
	config: 0,
	workspace: 1,
	global: 2,
	bundled: 3
};
const CHANNEL_HEARTBEAT_VISIBILITY_JSON_SCHEMA = ChannelHeartbeatVisibilitySchema.unwrap().toJSONSchema({ target: "draft-07" });
function normalizeCoreOwnedChannelSchema(schema) {
	const normalized = structuredClone(schema);
	let changed = false;
	const normalizeNode = (node, accountMap = false, rootScope = true) => {
		let withinRootScope = rootScope && (node === normalized || typeof node.$id !== "string");
		if (typeof node.$ref === "string") {
			const match = withinRootScope ? /^#\/(\$defs|definitions)\/([A-Za-z0-9_.-]+)$/.exec(node.$ref) : null;
			const definitions = match?.[1] ? normalized[match[1]] : void 0;
			const target = isRecord(definitions) && match?.[2] ? definitions[match[2]] : void 0;
			if (!isRecord(target) || Object.keys(node).some((key) => ![
				"$ref",
				"$defs",
				"definitions",
				"$id",
				"$schema"
			].includes(key)) || [
				"$id",
				"$anchor",
				"$dynamicAnchor",
				"$recursiveAnchor",
				"$schema",
				"$ref"
			].some((key) => Object.hasOwn(target, key))) return;
			const owner = { ...node };
			Object.assign(node, structuredClone(target), owner);
			delete node.$ref;
			changed = true;
			withinRootScope = node === normalized;
		}
		for (const key of [
			"allOf",
			"anyOf",
			"oneOf"
		]) {
			const variants = node[key];
			for (const variant of Array.isArray(variants) ? variants : []) if (isRecord(variant)) normalizeNode(variant, accountMap, withinRootScope);
		}
		if (accountMap) {
			if (node.additionalProperties === true) {
				node.additionalProperties = {};
				changed = true;
			}
			const entries = [
				node.additionalProperties,
				...Object.values(isRecord(node.properties) ? node.properties : {}),
				...Object.values(isRecord(node.patternProperties) ? node.patternProperties : {})
			];
			for (const entry of entries) if (isRecord(entry)) normalizeNode(entry, false, withinRootScope);
			return;
		}
		const properties = isRecord(node.properties) ? node.properties : {};
		if (JSON.stringify(properties.heartbeatVisibility) !== JSON.stringify(CHANNEL_HEARTBEAT_VISIBILITY_JSON_SCHEMA)) {
			node.properties = {
				...properties,
				heartbeatVisibility: CHANNEL_HEARTBEAT_VISIBILITY_JSON_SCHEMA
			};
			changed = true;
		}
		const accounts = properties.accounts;
		if (isRecord(accounts)) normalizeNode(accounts, true, withinRootScope);
	};
	normalizeNode(normalized);
	return changed ? normalized : schema;
}
/** Collects plugin config UI metadata with deterministic origin precedence and output ordering. */
function collectPluginSchemaMetadataCore(registry) {
	const deduped = /* @__PURE__ */ new Map();
	for (const record of registry.plugins) {
		const current = deduped.get(record.id);
		const nextRank = PLUGIN_ORIGIN_RANK[record.origin] ?? Number.MAX_SAFE_INTEGER;
		if (current && current.originRank <= nextRank) continue;
		deduped.set(record.id, {
			id: record.id,
			name: record.name,
			description: record.description,
			configUiHints: record.configUiHints,
			configSchema: record.configSchema,
			originRank: nextRank
		});
	}
	return [...deduped.values()].toSorted((left, right) => left.id.localeCompare(right.id)).map(({ originRank: _originRank, ...record }) => record);
}
/** Collects per-channel config metadata with the plugin that supplied the selected schema. */
function collectChannelSchemaMetadataWithOwnership(registry) {
	const byChannelId = /* @__PURE__ */ new Map();
	for (const record of registry.plugins) {
		const originRank = PLUGIN_ORIGIN_RANK[record.origin] ?? Number.MAX_SAFE_INTEGER;
		const rootLabel = record.channelCatalogMeta?.label;
		const rootDescription = record.channelCatalogMeta?.blurb;
		for (const channelId of record.channels) {
			const current = byChannelId.get(channelId);
			if (!current || originRank <= current.originRank) byChannelId.set(channelId, {
				id: channelId,
				label: rootLabel ?? current?.label,
				description: rootDescription ?? current?.description,
				configSchema: current?.configSchema,
				configUiHints: current?.configUiHints,
				schemaPluginId: current?.schemaPluginId,
				schemaPluginOrigin: current?.schemaPluginOrigin,
				originRank
			});
		}
		for (const [channelId, channelConfig] of Object.entries(record.channelConfigs ?? {})) {
			const current = byChannelId.get(channelId);
			if (current && current.originRank < originRank && (current.configSchema !== void 0 || current.configUiHints !== void 0)) continue;
			const configSchema = widenOfficialExternalChannelSecretSchema({
				channelId,
				schema: record.origin === "bundled" || channelConfig.schema === void 0 ? channelConfig.schema : normalizeCoreOwnedChannelSchema(channelConfig.schema)
			});
			byChannelId.set(channelId, {
				id: channelId,
				label: channelConfig.label ?? rootLabel ?? current?.label,
				description: channelConfig.description ?? rootDescription ?? current?.description,
				configSchema,
				configUiHints: channelConfig.uiHints,
				schemaPluginId: configSchema === void 0 ? void 0 : record.id,
				schemaPluginOrigin: configSchema === void 0 ? void 0 : record.origin,
				originRank
			});
		}
	}
	return [...byChannelId.values()].toSorted((left, right) => left.id.localeCompare(right.id)).map(({ originRank: _originRank, ...entry }) => entry);
}
/** Collects public per-channel config UI metadata without internal schema ownership. */
function collectChannelSchemaMetadataCore(registry) {
	return collectChannelSchemaMetadataWithOwnership(registry).map(({ schemaPluginId: _schemaPluginId, schemaPluginOrigin: _schemaPluginOrigin, ...entry }) => entry);
}
/** Collects channel DM policy metadata without importing doctor/runtime command modules. */
function collectChannelDmPolicyMetadata(registry) {
	const byChannelId = /* @__PURE__ */ new Map();
	const put = (channelId, originRank, dmAllowFromMode) => {
		const id = channelId?.trim();
		if (!id) return;
		const current = byChannelId.get(id);
		if (current && current.originRank < originRank) return;
		byChannelId.set(id, {
			id,
			...dmAllowFromMode ? { dmAllowFromMode } : {},
			originRank
		});
	};
	for (const record of registry.plugins) {
		const originRank = PLUGIN_ORIGIN_RANK[record.origin] ?? Number.MAX_SAFE_INTEGER;
		const packageChannelId = record.packageChannel?.id?.trim();
		const dmAllowFromMode = record.packageChannel?.doctorCapabilities?.dmAllowFromMode;
		for (const channelId of record.channels) put(channelId, originRank, channelId === packageChannelId ? dmAllowFromMode : void 0);
		put(packageChannelId, originRank, dmAllowFromMode);
		for (const channelId of Object.keys(record.channelConfigs ?? {})) put(channelId, originRank, channelId === packageChannelId ? dmAllowFromMode : void 0);
	}
	return [...byChannelId.values()].toSorted((left, right) => left.id.localeCompare(right.id)).map(({ originRank: _originRank, ...entry }) => entry);
}
//#endregion
//#region src/config/validation-channel-rules.ts
const bundledChannelSchemaById = new Map(GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA.filter((entry) => entry.configurable !== false).map((entry) => [entry.channelId, entry.schema]));
const bundledChannelIds = Object.freeze(GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA.filter((entry) => entry.configurable !== false).map((entry) => normalizeLowercaseStringOrEmpty(entry.channelId)).filter((channelId) => channelId.length > 0));
const bundledChannelIdSet = new Set(bundledChannelIds);
const bundledChannelAliases = new Map(GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA.filter((entry) => entry.configurable !== false).flatMap((entry) => {
	const channelId = normalizeLowercaseStringOrEmpty(entry.channelId);
	if (!channelId) return [];
	return (entry.aliases ?? []).map((alias) => [normalizeLowercaseStringOrEmpty(alias), channelId]).filter(([alias]) => alias.length > 0);
}));
function normalizeBundledChannelId(raw) {
	const normalized = normalizeLowercaseStringOrEmpty(raw);
	if (!normalized) return null;
	const resolved = bundledChannelAliases.get(normalized) ?? normalized;
	return bundledChannelIdSet.has(resolved) ? resolved : null;
}
function formatRawChannelConfigIssueMessage(message) {
	return `invalid config: ${message}`;
}
function buildDmPolicyDependencyWarning(params) {
	const channelBase = `channels.${params.channelId}`;
	const scope = params.accountId ? `${channelBase}.accounts.${params.accountId}` : channelBase;
	const allowFromPath = `${scope}.allowFrom`;
	const inherited = params.accountId && params.allowFromSource === "inherited";
	const allowFromSubject = inherited ? `${allowFromPath} is unset and ${channelBase}.allowFrom` : allowFromPath;
	const accountInheritedTarget = inherited ? ` or ${channelBase}.allowFrom` : "";
	const accountOverrideFix = params.accountId && !inherited ? `, remove ${allowFromPath} to inherit ${channelBase}.allowFrom,` : "";
	return {
		path: allowFromPath,
		message: params.violation === "open_requires_wildcard" ? `${scope}.dmPolicy="open" but ${allowFromSubject} does not include "*"; all DMs will be dropped. Add "*" to ${allowFromPath}${accountInheritedTarget}${accountOverrideFix} or set ${scope}.dmPolicy to "pairing"/"allowlist".` : `${scope}.dmPolicy="allowlist" but ${allowFromSubject} is empty; all DMs will be dropped. Add at least one sender ID to ${allowFromPath}${accountInheritedTarget}${accountOverrideFix} or change ${scope}.dmPolicy.`
	};
}
const DM_POLICY_PSEUDO_CHANNEL_KEYS = /* @__PURE__ */ new Set([
	"defaults",
	"modelByChannel",
	"tools"
]);
function hasDefinedConfigValue(record, key) {
	return Object.hasOwn(record, key) && record[key] !== void 0;
}
function hasConfiguredDmAllowFrom(record, mode) {
	const dm = isRecord(record.dm) ? record.dm : null;
	if (mode === "nestedOnly") return dm !== null && hasDefinedConfigValue(dm, "allowFrom") || hasDefinedConfigValue(record, "allowFrom");
	return hasDefinedConfigValue(record, "allowFrom") || dm !== null && hasDefinedConfigValue(dm, "allowFrom");
}
function isConfigRecordEnabled(record) {
	return record.enabled !== false;
}
function hasChannelDmPolicyDependencyWarningCandidates(config) {
	if (!config.channels || !isRecord(config.channels)) return false;
	return Object.entries(config.channels).some(([channelId, channelValue]) => !DM_POLICY_PSEUDO_CHANNEL_KEYS.has(channelId) && isRecord(channelValue) && isConfigRecordEnabled(channelValue));
}
/**
* Surface dmPolicy/allowFrom dependency problems generically for every channel that
* exposes DM policy via the canonical top-level `dmPolicy`/`allowFrom` fields. These
* configs parse fine but drop every DM at runtime, so we warn (rather than reject) to
* stay consistent with `security audit`/`doctor` and avoid breaking existing-but-usable
* configs on upgrade.
*
* Resolution goes through the shared DM-access helpers so the warning matches the
* effective policy/allowFrom the runtime sees, including the legacy `dm.*` aliases and
* account->channel inheritance. `nestedOnly` channels (canonical fields under `dm.*`)
* are skipped because their config shape does not match this warning's top-level paths.
*/
function collectChannelDmPolicyDependencyWarnings(config, options = {}) {
	if (!config.channels || !isRecord(config.channels)) return [];
	const warnings = [];
	for (const [channelId, channelValue] of Object.entries(config.channels)) {
		if (DM_POLICY_PSEUDO_CHANNEL_KEYS.has(channelId) || !isRecord(channelValue) || !isConfigRecordEnabled(channelValue)) continue;
		const mode = options.dmAllowFromModes?.get(channelId) ?? "topOnly";
		if (mode === "nestedOnly") continue;
		const channelViolation = evaluateDmPolicyAllowFromDependency({
			policy: resolveChannelDmPolicy({
				account: channelValue,
				mode
			}),
			allowFrom: resolveChannelDmAllowFrom({
				account: channelValue,
				mode
			})
		});
		if (channelViolation) warnings.push(buildDmPolicyDependencyWarning({
			channelId,
			violation: channelViolation
		}));
		if (!isRecord(channelValue.accounts)) continue;
		for (const [accountId, accountValue] of Object.entries(channelValue.accounts)) {
			if (!isRecord(accountValue) || !isConfigRecordEnabled(accountValue)) continue;
			const allowFromSource = hasConfiguredDmAllowFrom(accountValue, mode) ? "explicit" : "inherited";
			const accountViolation = evaluateDmPolicyAllowFromDependency({
				policy: resolveChannelDmPolicy({
					account: accountValue,
					parent: channelValue,
					mode
				}),
				allowFrom: resolveChannelDmAllowFrom({
					account: accountValue,
					parent: channelValue,
					mode
				})
			});
			if (accountViolation) warnings.push(buildDmPolicyDependencyWarning({
				channelId,
				accountId,
				allowFromSource,
				violation: accountViolation
			}));
		}
	}
	return warnings;
}
function collectRawBundledChannelConfigIssues(config) {
	if (!config.channels || !isRecord(config.channels)) return [];
	const issues = [];
	for (const [channelId, schema] of bundledChannelSchemaById) {
		if (!Object.hasOwn(config.channels, channelId)) continue;
		const result = validateJsonSchemaValue({
			schema,
			cacheKey: `raw-channel:${channelId}`,
			value: config.channels[channelId],
			applyDefaults: false
		});
		if (result.ok) continue;
		for (const error of result.errors) {
			const message = error.additionalProperty ? `${error.message}: "${error.additionalProperty}"` : error.message;
			const path = error.path === "<root>" ? `channels.${channelId}` : `channels.${channelId}.${error.path}`;
			issues.push({
				path,
				message: formatRawChannelConfigIssueMessage(message),
				allowedValues: error.allowedValues,
				allowedValuesHiddenCount: error.allowedValuesHiddenCount
			});
		}
	}
	return issues;
}
//#endregion
//#region src/secrets/unsupported-surface-policy.ts
/** Defines unsupported secret-ref surfaces and operator-facing policy messages. */
const CORE_UNSUPPORTED_SECRETREF_SURFACE_PATTERNS = [
	"hooks.token",
	"hooks.gmail.pushToken",
	"hooks.mappings[].sessionKey",
	"auth-profiles.oauth.*"
];
const CORE_UNSUPPORTED_SECRETREF_CONFIG_CANDIDATE_PATTERNS = [
	"hooks.token",
	"hooks.gmail.pushToken",
	"hooks.mappings[].sessionKey"
];
const bundledChannelUnsupportedSecretRefSurfacePatterns = [...new Set(GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA.flatMap((entry) => "unsupportedSecretRefSurfacePatterns" in entry ? entry.unsupportedSecretRefSurfacePatterns ?? [] : []))];
const unsupportedSecretRefSurfacePatterns = [...CORE_UNSUPPORTED_SECRETREF_SURFACE_PATTERNS, ...bundledChannelUnsupportedSecretRefSurfacePatterns];
const unsupportedSecretRefConfigCandidatePatterns = [...CORE_UNSUPPORTED_SECRETREF_CONFIG_CANDIDATE_PATTERNS, ...bundledChannelUnsupportedSecretRefSurfacePatterns];
const parsedPatternCache = /* @__PURE__ */ new Map();
function parseUnsupportedSecretRefSurfacePattern(pattern) {
	const cached = parsedPatternCache.get(pattern);
	if (cached) return cached;
	const parsed = pattern.split(".").filter((segment) => segment.length > 0).map((segment) => {
		if (segment === "*") return { kind: "wildcard" };
		if (segment.endsWith("[]")) return {
			kind: "array",
			key: segment.slice(0, -2)
		};
		return {
			kind: "key",
			key: segment
		};
	});
	parsedPatternCache.set(pattern, parsed);
	return parsed;
}
function collectPatternCandidates(params) {
	if (params.tokenIndex >= params.tokens.length) {
		params.candidates.push({
			path: params.pathSegments.join("."),
			value: params.current
		});
		return;
	}
	const token = params.tokens[params.tokenIndex];
	if (!token) return;
	if (token.kind === "wildcard") {
		if (Array.isArray(params.current)) {
			for (const [index, value] of params.current.entries()) collectPatternCandidates({
				...params,
				current: value,
				tokenIndex: params.tokenIndex + 1,
				pathSegments: [...params.pathSegments, String(index)]
			});
			return;
		}
		if (!isRecord(params.current)) return;
		for (const [key, value] of Object.entries(params.current)) collectPatternCandidates({
			...params,
			current: value,
			tokenIndex: params.tokenIndex + 1,
			pathSegments: [...params.pathSegments, key]
		});
		return;
	}
	if (!isRecord(params.current)) return;
	if (token.kind === "array") {
		if (!Object.hasOwn(params.current, token.key)) return;
		const value = params.current[token.key];
		if (!Array.isArray(value)) return;
		for (const [index, entry] of value.entries()) collectPatternCandidates({
			...params,
			current: entry,
			tokenIndex: params.tokenIndex + 1,
			pathSegments: [
				...params.pathSegments,
				token.key,
				String(index)
			]
		});
		return;
	}
	if (!Object.hasOwn(params.current, token.key)) return;
	collectPatternCandidates({
		...params,
		current: params.current[token.key],
		tokenIndex: params.tokenIndex + 1,
		pathSegments: [...params.pathSegments, token.key]
	});
}
/**
* Returns canonical config/auth-profile path patterns that do not support SecretRef values.
*/
function listUnsupportedSecretRefSurfacePatterns() {
	return [...unsupportedSecretRefSurfacePatterns];
}
/**
* Finds configured openclaw.json values whose surfaces currently reject SecretRef objects.
*/
function collectUnsupportedSecretRefConfigCandidates(raw) {
	if (!isRecord(raw)) return [];
	const candidates = [];
	for (const pattern of unsupportedSecretRefConfigCandidatePatterns) collectPatternCandidates({
		current: raw,
		tokens: parseUnsupportedSecretRefSurfacePattern(pattern),
		tokenIndex: 0,
		pathSegments: [],
		candidates
	});
	return candidates;
}
const unsupportedSecretRefSurfacePolicy = {
	listPatterns: listUnsupportedSecretRefSurfacePatterns,
	collectConfigCandidates: collectUnsupportedSecretRefConfigCandidates
};
//#endregion
//#region src/config/validation-issues.ts
const CUSTOM_EXPECTED_ONE_OF_RE = /expected one of ((?:"[^"]+"(?:\|"?[^"]+"?)*)+)/i;
const SECRETREF_POLICY_DOC_URL = "https://docs.openclaw.ai/reference/secretref-credential-surface";
function toConfigPathSegments(path) {
	if (!Array.isArray(path)) return [];
	return path.filter((segment) => {
		const segmentType = typeof segment;
		return segmentType === "string" || segmentType === "number";
	});
}
function formatConfigPath$1(segments) {
	return segments.join(".");
}
function withConfigIssuePath(issue, pathSegments) {
	Object.defineProperty(issue, "pathSegments", {
		value: [...pathSegments],
		enumerable: false
	});
	return issue;
}
function lookupJsonSchemaNode(schema, pathSegments) {
	let current = asNullableObjectRecord(schema);
	for (const segment of pathSegments) {
		if (!current) return null;
		if (typeof segment === "number") {
			const items = current.items;
			if (Array.isArray(items)) {
				current = asNullableObjectRecord(items[segment] ?? items[0]);
				continue;
			}
			current = asNullableObjectRecord(items);
			continue;
		}
		const properties = asNullableObjectRecord(current.properties);
		current = properties && asNullableObjectRecord(properties[segment]) || asNullableObjectRecord(current.additionalProperties);
	}
	return current;
}
function collectAllowedValuesFromJsonSchemaNode(schema) {
	const node = asNullableObjectRecord(schema);
	if (!node) return {
		values: [],
		incomplete: false,
		hasValues: false
	};
	if (Object.hasOwn(node, "const")) return {
		values: [node.const],
		incomplete: false,
		hasValues: true
	};
	if (Array.isArray(node.enum)) return {
		values: node.enum,
		incomplete: false,
		hasValues: node.enum.length > 0
	};
	const type = node.type;
	if (type === "boolean" || Array.isArray(type) && type.includes("boolean")) return {
		values: [true, false],
		incomplete: false,
		hasValues: true
	};
	const unionBranches = Array.isArray(node.anyOf) ? node.anyOf : Array.isArray(node.oneOf) ? node.oneOf : null;
	if (!unionBranches) return {
		values: [],
		incomplete: false,
		hasValues: false
	};
	const collected = [];
	for (const branch of unionBranches) {
		const branchCollected = collectAllowedValuesFromJsonSchemaNode(branch);
		if (branchCollected.incomplete || !branchCollected.hasValues) return {
			values: [],
			incomplete: true,
			hasValues: false
		};
		collected.push(...branchCollected.values);
	}
	return {
		values: collected,
		incomplete: false,
		hasValues: collected.length > 0
	};
}
function collectAllowedValuesFromBundledChannelSchemaPath(pathSegments) {
	if (pathSegments[0] !== "channels" || typeof pathSegments[1] !== "string") return {
		values: [],
		incomplete: false,
		hasValues: false
	};
	const channelSchema = bundledChannelSchemaById.get(pathSegments[1]);
	if (!channelSchema) return {
		values: [],
		incomplete: false,
		hasValues: false
	};
	const targetNode = lookupJsonSchemaNode(channelSchema, pathSegments.slice(2));
	return targetNode ? collectAllowedValuesFromJsonSchemaNode(targetNode) : {
		values: [],
		incomplete: false,
		hasValues: false
	};
}
function collectAllowedValuesFromCustomIssue(record) {
	const expectedMatch = (typeof record.message === "string" ? record.message : "").match(CUSTOM_EXPECTED_ONE_OF_RE);
	if (expectedMatch?.[1]) {
		const values = [...expectedMatch[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]);
		return {
			values,
			incomplete: false,
			hasValues: values.length > 0
		};
	}
	return collectAllowedValuesFromBundledChannelSchemaPath(toConfigPathSegments(record.path));
}
function appendNumericBoundHint(message, record) {
	if ((typeof record.origin === "string" ? record.origin : "") !== "number") return message;
	const inclusive = record.inclusive === true;
	if (record.code === "too_big") {
		const maximum = typeof record.maximum === "number" ? record.maximum : void 0;
		if (maximum !== void 0) return inclusive ? `${message} (maximum: ${maximum})` : `${message} (must be less than ${maximum})`;
	}
	if (record.code === "too_small") {
		const minimum = typeof record.minimum === "number" ? record.minimum : void 0;
		if (minimum !== void 0) return inclusive ? `${message} (minimum: ${minimum})` : `${message} (must be greater than ${minimum})`;
	}
	return message;
}
function collectAllowedValuesFromIssue(issue) {
	const record = asNullableObjectRecord(issue);
	if (!record) return {
		values: [],
		incomplete: false,
		hasValues: false
	};
	const code = typeof record.code === "string" ? record.code : "";
	if (code === "invalid_value") {
		const values = record.values;
		return Array.isArray(values) ? {
			values,
			incomplete: false,
			hasValues: values.length > 0
		} : {
			values: [],
			incomplete: true,
			hasValues: false
		};
	}
	if (code === "invalid_type") return record.expected === "boolean" ? {
		values: [true, false],
		incomplete: false,
		hasValues: true
	} : {
		values: [],
		incomplete: true,
		hasValues: false
	};
	if (code === "custom") return collectAllowedValuesFromCustomIssue(record);
	if (code !== "invalid_union") return {
		values: [],
		incomplete: false,
		hasValues: false
	};
	const nested = record.errors;
	if (!Array.isArray(nested) || nested.length === 0) return {
		values: [],
		incomplete: true,
		hasValues: false
	};
	const collected = [];
	for (const branch of nested) {
		if (!Array.isArray(branch) || branch.length === 0) return {
			values: [],
			incomplete: true,
			hasValues: false
		};
		const branchCollected = collectAllowedValuesFromIssueList(branch);
		if (branchCollected.incomplete || !branchCollected.hasValues) return {
			values: [],
			incomplete: true,
			hasValues: false
		};
		collected.push(...branchCollected.values);
	}
	return {
		values: collected,
		incomplete: false,
		hasValues: collected.length > 0
	};
}
function collectAllowedValuesFromIssueList(issues) {
	const collected = [];
	let hasValues = false;
	for (const issue of issues) {
		const branch = collectAllowedValuesFromIssue(issue);
		if (branch.incomplete) return {
			values: [],
			incomplete: true,
			hasValues: false
		};
		if (branch.hasValues) {
			hasValues = true;
			collected.push(...branch.values);
		}
	}
	return {
		values: collected,
		incomplete: false,
		hasValues
	};
}
function collectAllowedValuesFromUnknownIssue(issue) {
	const collection = collectAllowedValuesFromIssue(issue);
	return collection.incomplete || !collection.hasValues ? [] : collection.values;
}
function isBindingsIssuePath(pathSegments) {
	return pathSegments[0] === "bindings" && typeof pathSegments[1] === "number";
}
function isRouteTypeMismatchIssue(issue) {
	const issuePath = toConfigPathSegments(issue.path);
	return issuePath.length === 1 && issuePath[0] === "type" && issue.code === "invalid_value" && Array.isArray(issue.values) && issue.values.includes("route");
}
function extractBindingsSpecificUnionIssue(record, parentPathSegments) {
	if (!isBindingsIssuePath(toConfigPathSegments(record.path)) || !Array.isArray(record.errors)) return null;
	let matchingBranchIssue = null;
	let matchingBranchIsUnrecognized = false;
	let matchingBranchPathLen = -1;
	let sawRouteTypeMismatch = false;
	for (const errGroup of record.errors) {
		if (!Array.isArray(errGroup)) continue;
		const branch = errGroup.map(asNullableObjectRecord).filter(Boolean);
		if (branch.length === 0) continue;
		if (branch.some(isRouteTypeMismatchIssue)) {
			sawRouteTypeMismatch = true;
			continue;
		}
		let branchBestIssue = null;
		let branchBestIsUnrecognized = false;
		let branchBestPathLen = -1;
		for (const issue of branch) {
			const issuePathLen = toConfigPathSegments(issue.path).length;
			const issueIsUnrecognized = issue.code === "unrecognized_keys";
			if (issuePathLen > branchBestPathLen || issuePathLen === branchBestPathLen && issueIsUnrecognized && !branchBestIsUnrecognized) {
				branchBestIssue = issue;
				branchBestIsUnrecognized = issueIsUnrecognized;
				branchBestPathLen = issuePathLen;
			}
		}
		if (!branchBestIssue) continue;
		if (matchingBranchIssue) return null;
		matchingBranchIssue = branchBestIssue;
		matchingBranchIsUnrecognized = branchBestIsUnrecognized;
		matchingBranchPathLen = branchBestPathLen;
	}
	if (!sawRouteTypeMismatch || !matchingBranchIssue || matchingBranchPathLen === 0 && !matchingBranchIsUnrecognized) return null;
	const fullPathSegments = [...parentPathSegments, ...toConfigPathSegments(matchingBranchIssue.path)];
	const message = typeof matchingBranchIssue.message === "string" ? matchingBranchIssue.message : "Invalid input";
	return withConfigIssuePath({
		path: formatConfigPath$1(fullPathSegments),
		message
	}, fullPathSegments);
}
function mapZodIssueToConfigIssue(issue) {
	const record = asNullableObjectRecord(issue);
	const pathSegments = toConfigPathSegments(record?.path);
	const path = formatConfigPath$1(pathSegments);
	const message = typeof record?.message === "string" ? record.message : "Invalid input";
	const enrichedMessage = record ? appendNumericBoundHint(message, record) : message;
	const allowedValuesSummary = summarizeAllowedValues(collectAllowedValuesFromUnknownIssue(issue));
	if (record?.code === "invalid_union" && !allowedValuesSummary) {
		const betterIssue = extractBindingsSpecificUnionIssue(record, pathSegments);
		if (betterIssue) return betterIssue;
	}
	if (!allowedValuesSummary) return withConfigIssuePath({
		path,
		message: enrichedMessage
	}, pathSegments);
	return withConfigIssuePath({
		path,
		message: appendAllowedValuesHint(enrichedMessage, allowedValuesSummary),
		allowedValues: allowedValuesSummary.values,
		allowedValuesHiddenCount: allowedValuesSummary.hiddenCount
	}, pathSegments);
}
function isObjectSecretRefCandidate(value) {
	return isRecord(value) && Boolean(coerceSecretRef(value));
}
function formatUnsupportedMutableSecretRefMessage(path) {
	return [
		`SecretRef objects are not supported at ${path}.`,
		"This credential is runtime-mutable or runtime-managed and must stay a plain string value.",
		"Use a plain string (env template strings like \"${MY_VAR}\" are allowed).",
		`See ${SECRETREF_POLICY_DOC_URL}.`
	].join(" ");
}
function collectUnsupportedMutableSecretRefIssues(raw) {
	const issues = [];
	for (const candidate of unsupportedSecretRefSurfacePolicy.collectConfigCandidates(raw)) if (isObjectSecretRefCandidate(candidate.value)) issues.push({
		path: candidate.path,
		message: formatUnsupportedMutableSecretRefMessage(candidate.path)
	});
	return issues;
}
function formatFilteredUnrecognizedKeyMessage(message, keys) {
	const quotedKeys = keys.map((key) => `"${key}"`).join(", ");
	if (/must not have additional properties/i.test(message)) return `must not have additional properties: ${quotedKeys}`;
	return keys.length === 1 ? `Unrecognized key: ${quotedKeys}` : `Unrecognized keys: ${quotedKeys}`;
}
function filterUnsupportedMutableSecretRefSchemaIssue(params) {
	const { issue, policyIssue } = params;
	if (issue.path === policyIssue.path) return /expected string, received object/i.test(issue.message) ? null : issue;
	if (!issue.path || !policyIssue.path || !policyIssue.path.startsWith(`${issue.path}.`)) return issue;
	const childKey = policyIssue.path.slice(issue.path.length + 1).split(".")[0];
	if (!childKey || !/Unrecognized key|must not have additional properties/i.test(issue.message)) return issue;
	const unrecognizedKeys = [...issue.message.matchAll(/"([^"]+)"/g)].map((match) => match[1]);
	if (!unrecognizedKeys.includes(childKey)) return issue;
	const remainingKeys = unrecognizedKeys.filter((key) => key !== void 0 && key !== childKey);
	return remainingKeys.length === 0 ? null : {
		...issue,
		message: formatFilteredUnrecognizedKeyMessage(issue.message, remainingKeys)
	};
}
function mergeUnsupportedMutableSecretRefIssues(policyIssues, schemaIssues) {
	if (policyIssues.length === 0) return schemaIssues;
	const filteredSchemaIssues = schemaIssues.flatMap((issue) => {
		let filteredIssue = issue;
		for (const policyIssue of policyIssues) {
			if (!filteredIssue) return [];
			filteredIssue = filterUnsupportedMutableSecretRefSchemaIssue({
				issue: filteredIssue,
				policyIssue
			});
		}
		return filteredIssue ? [filteredIssue] : [];
	});
	return [...policyIssues, ...filteredSchemaIssues];
}
function collectUnsupportedSecretRefPolicyIssues(raw) {
	return collectUnsupportedMutableSecretRefIssues(raw);
}
//#endregion
//#region src/config/validation-core.ts
function materializeBundledModelProviderOverlays(config) {
	const providers = config.models?.providers;
	if (!providers) return config;
	let nextProviders;
	for (const [providerId, providerConfig] of Object.entries(providers)) {
		if (!isBuiltInModelProviderOverlayId(providerId) || providerConfig.baseUrl && Array.isArray(providerConfig.models)) continue;
		nextProviders ??= { ...providers };
		nextProviders[providerId] = {
			...providerConfig,
			baseUrl: providerConfig.baseUrl ?? "",
			models: providerConfig.models ?? []
		};
	}
	return nextProviders ? {
		...config,
		models: {
			...config.models,
			providers: nextProviders
		}
	} : config;
}
function stripPreservedLegacyRootKeysForValidation(raw, keys) {
	if (!keys || keys.length === 0 || !isRecord(raw)) return raw;
	const next = { ...raw };
	for (const key of keys) delete next[key];
	return next;
}
function collectMcpServerNameIssues(raw) {
	if (!isRecord(raw)) return [];
	const mcp = isRecord(raw.mcp) ? raw.mcp : void 0;
	const nodeHost = isRecord(raw.nodeHost) ? raw.nodeHost : void 0;
	const nodeHostMcp = isRecord(nodeHost?.mcp) ? nodeHost.mcp : void 0;
	const locations = [{
		path: ["mcp", "servers"],
		servers: isRecord(mcp?.servers) ? mcp.servers : void 0,
		schema: McpServerNameSchema
	}, {
		path: [
			"nodeHost",
			"mcp",
			"servers"
		],
		servers: isRecord(nodeHostMcp?.servers) ? nodeHostMcp.servers : void 0,
		schema: NodeHostMcpServerNameSchema
	}];
	const issues = [];
	for (const location of locations) for (const serverName of Object.keys(location.servers ?? {})) {
		const result = location.schema.safeParse(serverName);
		if (result.success) continue;
		const pathSegments = [...location.path, serverName];
		for (const issue of result.error.issues) issues.push(withConfigIssuePath({
			path: pathSegments.join("."),
			message: issue.message
		}, pathSegments));
	}
	return issues;
}
function isWorkspaceAvatarPath(value, workspaceDir) {
	const workspaceRoot = path.resolve(workspaceDir);
	return isPathWithinRoot(workspaceRoot, path.resolve(workspaceRoot, value));
}
function createIdentityAvatarIssue(source, message) {
	const pathSegments = source.kind === "entries" ? [
		"agents",
		"entries",
		source.key,
		"identity",
		"avatar"
	] : [
		"agents",
		"list",
		source.index,
		"identity",
		"avatar"
	];
	return withConfigIssuePath({
		path: pathSegments.join("."),
		message
	}, pathSegments);
}
function validateIdentityAvatar(config, env) {
	const agents = listAgentEntriesWithSource(config);
	if (agents.length === 0) return [];
	const issues = [];
	for (const { entry, source } of agents) {
		const avatarRaw = entry.identity?.avatar;
		if (typeof avatarRaw !== "string") continue;
		const avatar = avatarRaw.trim();
		if (!avatar || isAvatarDataUrl(avatar) || isAvatarHttpUrl(avatar)) continue;
		if (avatar.startsWith("~")) {
			issues.push(createIdentityAvatarIssue(source, "identity.avatar must be a workspace-relative path, http(s) URL, or data URI."));
			continue;
		}
		if (hasAvatarUriScheme(avatar) && !isWindowsAbsolutePath(avatar)) {
			issues.push(createIdentityAvatarIssue(source, "identity.avatar must be a workspace-relative path, http(s) URL, or data URI."));
			continue;
		}
		if (!isWorkspaceAvatarPath(avatar, resolveAgentWorkspaceDir(config, entry.id ?? tryResolveLegacyCompatibilityAgentId(config) ?? resolveDefaultAgentId(config), env))) issues.push(createIdentityAvatarIssue(source, "identity.avatar must stay within the agent workspace."));
	}
	return issues;
}
function validateGatewayTailscaleBind(config) {
	const tailscaleMode = config.gateway?.tailscale?.mode ?? "off";
	if (tailscaleMode !== "serve" && tailscaleMode !== "funnel") return [];
	const bindMode = config.gateway?.bind ?? "loopback";
	if (bindMode === "loopback") return [];
	const customBindHost = config.gateway?.customBindHost;
	if (bindMode === "custom" && isCanonicalDottedDecimalIPv4(customBindHost) && isLoopbackIpAddress(customBindHost)) return [];
	return [{
		path: "gateway.bind",
		message: `gateway.bind must resolve to loopback when gateway.tailscale.mode=${tailscaleMode} (use gateway.bind="loopback" or gateway.bind="custom" with gateway.customBindHost="127.0.0.1")`
	}];
}
function validateGatewayTailscaleAuth(config) {
	const tailscaleMode = config.gateway?.tailscale?.mode ?? "off";
	if (!isUnsafeGatewayTailscaleNoAuth({
		authMode: config.gateway?.auth?.mode,
		tailscaleMode
	})) return [];
	return [{
		path: "gateway.auth.mode",
		message: formatUnsafeGatewayTailscaleNoAuthMessage(tailscaleMode)
	}];
}
function collectModelPolicyAllowIssues(config) {
	const issues = [];
	const defaultModels = config.agents?.defaults?.models;
	const collectAliases = (...modelMaps) => {
		const aliases = /* @__PURE__ */ new Set();
		for (const models of modelMaps) for (const entry of Object.values(models ?? {})) {
			const alias = normalizeLowercaseStringOrEmpty(entry?.alias);
			if (alias) aliases.add(alias);
		}
		return aliases;
	};
	const validateRefs = (refs, configPath, aliases) => {
		for (const [index, raw] of (refs ?? []).entries()) {
			const trimmed = raw.trim();
			if (aliases.has(normalizeLowercaseStringOrEmpty(trimmed)) || isModelPolicyCompatSelector(trimmed) || isValidExactModelPolicyRef(trimmed) || parseModelPolicyWildcardRef(trimmed)) continue;
			issues.push({
				path: `${configPath}.${index}`,
				message: `invalid model policy ref: ${sanitizeForLog(JSON.stringify(raw))}. Use a configured alias, an exact "provider/model" ref, or a trailing prefix wildcard such as "provider/*" or "provider/namespace/*".`
			});
		}
	};
	const defaultAliases = collectAliases(defaultModels);
	validateRefs(config.agents?.defaults?.modelPolicy?.allow, "agents.defaults.modelPolicy.allow", defaultAliases);
	for (const { entry: agent, source } of listAgentEntriesWithSource(config)) {
		const pathPrefix = source.kind === "entries" ? `agents.entries.${source.key}` : `agents.list.${source.index}`;
		validateRefs(agent.modelPolicy?.allow, `${pathPrefix}.modelPolicy.allow`, collectAliases(defaultModels, agent.models));
	}
	return issues;
}
/**
* Validates config without applying runtime defaults.
* Use this when you need the raw validated config (e.g., for writing back to file).
*/
function validateConfigObjectRaw(raw, opts) {
	const legacyDefaultAgentId = isRecord(raw) ? tryGetLegacyDefaultAgentId(raw) : void 0;
	let normalizedRaw = stripPreservedLegacyRootKeysForValidation(raw, opts?.preservedLegacyRootKeys);
	let syntheticLegacyOwnership = false;
	if (legacyDefaultAgentId && isRecord(normalizedRaw) && isRecord(normalizedRaw.agents)) {
		const entries = normalizedRaw.agents.entries;
		if (isRecord(entries) && Object.keys(entries).length > 1 && normalizedRaw.agents.ownership === void 0) {
			normalizedRaw = {
				...normalizedRaw,
				agents: {
					...normalizedRaw.agents,
					ownership: "explicit"
				}
			};
			syntheticLegacyOwnership = true;
		}
	}
	const normalizedMcpServerNameIssueKeys = new Set(collectMcpServerNameIssues(normalizedRaw).map((issue) => JSON.stringify([issue.path, issue.message])));
	const mcpServerNameIssues = collectMcpServerNameIssues(opts?.sourceRaw).filter((issue) => !normalizedMcpServerNameIssueKeys.has(JSON.stringify([issue.path, issue.message])));
	const policyIssues = collectUnsupportedSecretRefPolicyIssues(normalizedRaw);
	const validated = OpenClawSchema.safeParse(normalizedRaw);
	if (!validated.success || mcpServerNameIssues.length > 0) return {
		ok: false,
		issues: mergeUnsupportedMutableSecretRefIssues(policyIssues, validated.success ? mcpServerNameIssues : [...mcpServerNameIssues, ...validated.error.issues.map(mapZodIssueToConfigIssue)])
	};
	let parsedConfig = validated.data;
	if (syntheticLegacyOwnership && parsedConfig.agents) {
		const agents = { ...parsedConfig.agents };
		delete agents.ownership;
		parsedConfig = {
			...parsedConfig,
			agents
		};
	}
	const validatedConfig = inheritLegacyDefaultAgentId(raw, attachAgentListProjection(materializeBundledModelProviderOverlays(parsedConfig)));
	const channelIssues = policyIssues.length > 0 || opts?.validateBundledChannels ? collectRawBundledChannelConfigIssues(validatedConfig) : [];
	if (channelIssues.length > 0) return {
		ok: false,
		issues: mergeUnsupportedMutableSecretRefIssues(policyIssues, channelIssues)
	};
	if (policyIssues.length > 0) return {
		ok: false,
		issues: policyIssues
	};
	const duplicates = findDuplicateAgentDirs(validatedConfig);
	if (duplicates.length > 0) return {
		ok: false,
		issues: [{
			path: "agents.entries",
			message: formatDuplicateAgentDirError(duplicates)
		}]
	};
	const avatarIssues = validateIdentityAvatar(validatedConfig, opts?.env);
	if (avatarIssues.length > 0) return {
		ok: false,
		issues: avatarIssues
	};
	const gatewayTailscaleBindIssues = validateGatewayTailscaleBind(validatedConfig);
	if (gatewayTailscaleBindIssues.length > 0) return {
		ok: false,
		issues: gatewayTailscaleBindIssues
	};
	const gatewayTailscaleAuthIssues = validateGatewayTailscaleAuth(validatedConfig);
	if (gatewayTailscaleAuthIssues.length > 0) return {
		ok: false,
		issues: gatewayTailscaleAuthIssues
	};
	const modelPolicyAllowIssues = collectModelPolicyAllowIssues(validatedConfig);
	if (modelPolicyAllowIssues.length > 0) return {
		ok: false,
		issues: modelPolicyAllowIssues
	};
	return {
		ok: true,
		config: validatedConfig
	};
}
function validateConfigObject(raw, opts) {
	const result = validateConfigObjectRaw(migratePersistedImplicitMainRoster(raw).config, opts);
	if (!result.ok) return result;
	return {
		ok: true,
		config: attachAgentListProjection(materializeRuntimeConfig(result.config, "snapshot", { manifestRegistry: opts?.manifestRegistry }))
	};
}
//#endregion
//#region src/config/validation-plugin-config.ts
const LEGACY_REMOVED_PLUGIN_IDS = /* @__PURE__ */ new Set([
	"google-antigravity-auth",
	"google-gemini-cli-auth",
	"skill-workshop"
]);
const BLOCKED_PLUGIN_CANDIDATE_PREFIX = "blocked plugin candidate:";
function collectExplicitPluginReferences(raw) {
	const references = {
		entries: /* @__PURE__ */ new Set(),
		allow: /* @__PURE__ */ new Set(),
		deny: /* @__PURE__ */ new Set(),
		slots: /* @__PURE__ */ new Map()
	};
	if (!isRecord(raw) || !isRecord(raw.plugins)) return references;
	const { plugins } = raw;
	if (isRecord(plugins.entries)) for (const pluginId of Object.keys(plugins.entries)) {
		const normalized = normalizePluginId(pluginId);
		if (normalized) references.entries.add(normalized);
	}
	for (const [key, target] of [["allow", references.allow], ["deny", references.deny]]) {
		const value = plugins[key];
		if (!Array.isArray(value)) continue;
		for (const entry of value) if (typeof entry === "string") {
			const normalized = normalizePluginId(entry);
			if (normalized) target.add(normalized);
		}
	}
	if (isRecord(plugins.slots)) for (const [slotId, pluginId] of Object.entries(plugins.slots)) {
		if (typeof pluginId !== "string") continue;
		const normalized = normalizePluginId(pluginId);
		if (normalized && normalized !== "none") references.slots.set(normalized, slotId);
	}
	return references;
}
function resolveExplicitPluginReferencePath(references, pluginId) {
	const normalized = normalizePluginId(pluginId);
	if (!normalized) return;
	if (references.entries.has(normalized)) return `plugins.entries.${normalized}`;
	if (references.allow.has(normalized)) return "plugins.allow";
	if (references.deny.has(normalized)) return "plugins.deny";
	const slotId = references.slots.get(normalized);
	return slotId ? `plugins.slots.${slotId}` : void 0;
}
function formatRemovedPluginConfigWarning(pluginId) {
	if (pluginId === "skill-workshop") return "plugin removed: skill-workshop (stale plugin config ignored; Skill Workshop is built into OpenClaw skills now. Use skills.workshop settings and openclaw skills workshop commands, then remove this plugins config entry)";
	return `plugin removed: ${pluginId} (stale config entry ignored; remove it from plugins config)`;
}
function formatMissingOfficialExternalPluginWarning(pluginId, opts) {
	const catalogEntry = getOfficialExternalPluginCatalogEntry(pluginId);
	if (!catalogEntry) return null;
	const install = resolveOfficialExternalPluginInstall(catalogEntry);
	const npmSpec = install?.npmSpec?.trim();
	const clawhubSpec = install?.clawhubSpec?.trim();
	const installSpec = install?.defaultChoice === "clawhub" ? clawhubSpec ?? npmSpec : npmSpec ?? clawhubSpec;
	if (!installSpec) return null;
	if (pluginId === "memory-lancedb" && opts?.selectedMissingMemorySlot) return `plugin not installed: ${pluginId} — gateway will run without persistent memory until installed; install the official external plugin with: openclaw plugins install ${installSpec}`;
	return `plugin not installed: ${pluginId} — install the official external plugin with: openclaw plugins install ${installSpec}`;
}
function validateExplicitPluginConfig(params) {
	const { raw, config, effectiveConfig, env, applyDefaults, registry, knownIds, normalizedPlugins, ensureCompatPluginIds, ensureOverriddenPluginIds, issues, warnings } = params;
	const blockedPluginDiagnostics = /* @__PURE__ */ new Map();
	const blockedPluginDiagnosticsWithSource = [];
	const normalizeBlockedDiagnosticPath = (value) => {
		const trimmed = value?.trim();
		if (!trimmed) return "";
		try {
			return path.resolve(resolveUserPath(trimmed, env ?? process.env));
		} catch {
			return path.resolve(trimmed);
		}
	};
	for (const diag of registry.diagnostics) {
		if (!diag.message.startsWith(BLOCKED_PLUGIN_CANDIDATE_PREFIX)) continue;
		if (!diag.pluginId && diag.source) blockedPluginDiagnosticsWithSource.push({
			message: diag.message,
			source: diag.source
		});
		if (diag.pluginId) {
			const normalizedPluginId = normalizePluginId(diag.pluginId);
			for (const key of [diag.pluginId, normalizedPluginId]) if (key && !blockedPluginDiagnostics.has(key)) blockedPluginDiagnostics.set(key, {
				message: diag.message,
				...diag.source ? { source: diag.source } : {}
			});
		}
	}
	const blockedDiagnosticSourceMatchesPluginId = (diagnostic, pluginId) => {
		const normalizedPluginId = normalizePluginId(pluginId);
		if (!normalizedPluginId) return false;
		const sourcePath = normalizeBlockedDiagnosticPath(diagnostic.source);
		if (!sourcePath) return false;
		if (normalizePluginId(path.basename(sourcePath)) === normalizedPluginId || normalizePluginId(path.basename(path.dirname(sourcePath))) === normalizedPluginId) return true;
		const loadPaths = config.plugins?.load?.paths;
		if (!Array.isArray(loadPaths)) return false;
		for (const loadPath of loadPaths) {
			if (typeof loadPath !== "string") continue;
			const resolvedLoadPath = normalizeBlockedDiagnosticPath(loadPath);
			if (resolvedLoadPath && normalizePluginId(path.basename(resolvedLoadPath)) === normalizedPluginId && (sourcePath === resolvedLoadPath || isPathInside(resolvedLoadPath, sourcePath) || isPathInside(sourcePath, resolvedLoadPath))) return true;
		}
		return false;
	};
	const findBlockedPluginDiagnostic = (pluginId) => blockedPluginDiagnostics.get(pluginId) ?? blockedPluginDiagnostics.get(normalizePluginId(pluginId)) ?? blockedPluginDiagnosticsWithSource.find((diagnostic) => blockedDiagnosticSourceMatchesPluginId(diagnostic, pluginId));
	const missingOfficialPluginWarningIds = /* @__PURE__ */ new Set();
	const pushMissingPluginIssue = (issuePath, pluginId, options) => {
		if (LEGACY_REMOVED_PLUGIN_IDS.has(pluginId)) {
			warnings.push({
				path: issuePath,
				message: formatRemovedPluginConfigWarning(pluginId)
			});
			return;
		}
		const blockedDiagnostic = findBlockedPluginDiagnostic(pluginId);
		if (blockedDiagnostic) {
			const message = `plugin present but blocked: ${pluginId} (see preceding plugin warning${blockedDiagnostic.source ? `; source: ${blockedDiagnostic.source}` : ""}; fix the blocked plugin path instead of removing config)`;
			(options?.warnOnly ? warnings : issues).push({
				path: issuePath,
				message
			});
			return;
		}
		if (normalizePluginId(pluginId) === "codex" && issuePath === "plugins.entries.codex" && shouldSuppressMissingCodexPluginDiagnostics(config, env ?? process.env, isRecord(raw) ? raw : void 0)) return;
		if (options?.warnOnly && options.officialInstallHint !== false) {
			const externalInstallWarning = options.missingMessage ?? formatMissingOfficialExternalPluginWarning(pluginId);
			if (externalInstallWarning) {
				const normalizedPluginId = normalizePluginId(pluginId);
				if (!options.missingMessage && normalizedPluginId) {
					if (missingOfficialPluginWarningIds.has(normalizedPluginId)) return;
					missingOfficialPluginWarningIds.add(normalizedPluginId);
				}
				warnings.push({
					path: issuePath,
					message: externalInstallWarning
				});
				return;
			}
		}
		const message = options?.warnOnly ? `plugin not found: ${pluginId} (stale config entry ignored; remove it from plugins config)` : `plugin not found: ${pluginId}`;
		(options?.warnOnly ? warnings : issues).push({
			path: issuePath,
			message
		});
	};
	const pluginsConfig = config.plugins;
	const entries = pluginsConfig?.entries;
	if (entries && isRecord(entries)) {
		for (const pluginId of Object.keys(entries)) if (!knownIds.has(pluginId)) pushMissingPluginIssue(`plugins.entries.${pluginId}`, pluginId, { warnOnly: true });
	}
	for (const pluginId of pluginsConfig?.allow ?? []) {
		if (typeof pluginId !== "string" || !pluginId.trim() || knownIds.has(pluginId)) continue;
		const commandAlias = resolveManifestCommandAliasOwnerInRegistry({
			command: pluginId,
			registry
		});
		if (commandAlias?.pluginId && knownIds.has(commandAlias.pluginId)) warnings.push({
			path: "plugins.allow",
			message: `"${pluginId}" is not a plugin — it is a command provided by the "${commandAlias.pluginId}" plugin. Use "${commandAlias.pluginId}" in plugins.allow instead.`
		});
		else pushMissingPluginIssue("plugins.allow", pluginId, { warnOnly: true });
	}
	for (const pluginId of pluginsConfig?.deny ?? []) if (typeof pluginId === "string" && pluginId.trim() && !knownIds.has(pluginId)) pushMissingPluginIssue("plugins.deny", pluginId, {
		warnOnly: true,
		officialInstallHint: false
	});
	const pluginSlots = pluginsConfig?.slots;
	const hasExplicitMemorySlot = pluginSlots !== void 0 && Object.hasOwn(pluginSlots, "memory");
	const memorySlot = normalizedPlugins.slots.memory;
	if (hasExplicitMemorySlot && typeof memorySlot === "string" && memorySlot.trim() && !knownIds.has(memorySlot)) {
		const missingMessage = formatMissingOfficialExternalPluginWarning(memorySlot, { selectedMissingMemorySlot: true });
		pushMissingPluginIssue("plugins.slots.memory", memorySlot, {
			warnOnly: memorySlot === "memory-lancedb" && Boolean(missingMessage) && !findBlockedPluginDiagnostic(memorySlot),
			missingMessage
		});
	}
	let selectedMemoryPluginId = null;
	const seenPlugins = /* @__PURE__ */ new Set();
	for (const record of registry.plugins) {
		const pluginId = record.id;
		if (seenPlugins.has(pluginId)) continue;
		seenPlugins.add(pluginId);
		const entry = normalizedPlugins.entries[pluginId];
		const entryHasConfig = Boolean(entry?.config);
		const activationState = resolveEffectivePluginActivationState({
			id: pluginId,
			origin: record.origin,
			config: normalizedPlugins,
			rootConfig: effectiveConfig
		});
		let enabled = activationState.activated;
		let reason = activationState.reason;
		if (enabled) {
			const memoryDecision = resolveMemorySlotDecision({
				id: pluginId,
				kind: record.kind,
				slot: memorySlot,
				selectedId: selectedMemoryPluginId
			});
			if (!memoryDecision.enabled) {
				enabled = false;
				reason = memoryDecision.reason;
			}
			if (memoryDecision.selected && hasKind(record.kind, "memory")) selectedMemoryPluginId = pluginId;
		}
		const shouldReplacePluginConfig = entryHasConfig || applyDefaults && enabled;
		if (enabled || entryHasConfig) if (record.configSchema) {
			const result = validateJsonSchemaValue({
				schema: record.configSchema,
				cacheKey: record.schemaCacheKey ?? record.manifestPath ?? pluginId,
				value: entry?.config ?? {},
				applyDefaults: true
			});
			if (!result.ok) for (const error of result.errors) {
				const base = `plugins.entries.${pluginId}.config`;
				issues.push({
					path: !error.path || error.path === "<root>" ? base : `${base}.${error.path}`,
					message: `invalid config: ${error.message}`,
					allowedValues: error.allowedValues,
					allowedValuesHiddenCount: error.allowedValuesHiddenCount
				});
			}
			else if (shouldReplacePluginConfig) params.replacePluginEntryConfig(pluginId, result.value);
		} else if (record.format === "bundle") {} else issues.push({
			path: `plugins.entries.${pluginId}`,
			message: `plugin schema missing for ${pluginId}`
		});
		const suppressDisabledConfigWarning = ensureCompatPluginIds().has(pluginId) && !ensureOverriddenPluginIds().has(pluginId);
		if (!enabled && entryHasConfig && !suppressDisabledConfigWarning) warnings.push({
			path: `plugins.entries.${pluginId}`,
			message: `plugin disabled (${reason ?? "disabled"}) but config is present`
		});
	}
}
//#endregion
//#region src/config/validation.ts
function validateConfigObjectWithPlugins(raw, params) {
	return validateConfigObjectWithPluginMode(raw, params, true);
}
function validateConfigObjectRawWithPlugins(raw, params) {
	return validateConfigObjectWithPluginMode(raw, params, false);
}
function validateConfigObjectWithPluginMode(raw, params, applyDefaults) {
	const migrated = migratePersistedImplicitMainRoster(raw).config;
	let manifestRegistry = params?.pluginMetadataSnapshot?.manifestRegistry;
	const result = validateConfigObjectWithPluginsBase(migrated, {
		applyDefaults,
		env: params?.env,
		pluginValidation: params?.pluginValidation ?? "full",
		pluginMetadataSnapshot: params?.pluginMetadataSnapshot,
		loadPluginMetadataSnapshot: params?.loadPluginMetadataSnapshot,
		sourceRaw: params?.sourceRaw,
		preservedLegacyRootKeys: params?.preservedLegacyRootKeys,
		onManifestRegistryResolved: (registry) => {
			manifestRegistry = registry;
		}
	});
	const legacyDefaultAgentId = tryGetLegacyDefaultAgentId(migrated);
	if (!result.ok || !legacyDefaultAgentId) return result;
	const config = materializeLegacyAgentOwnershipForActiveChannelsResult(inheritLegacyDefaultAgentId(migrated, result.config), legacyDefaultAgentId, params?.env, manifestRegistry?.plugins).config;
	return {
		...result,
		config
	};
}
function materializeLegacyAgentOwnershipForActiveChannelsResult(config, legacyDefaultAgentId, env, manifestRecords, options) {
	const materialized = materializeLegacyDefaultAgentRoles(config, legacyDefaultAgentId, {
		ambientChannelIds: listChannelIdsForOwnershipMigration({
			config,
			env,
			...manifestRecords ? { manifestRecords } : {}
		}),
		env,
		materializeSessionStore: options?.materializeSessionStore,
		materializeWorkspace: options?.materializeWorkspace
	});
	const next = inheritLegacyDefaultAgentId(config, materialized.config);
	return {
		...materialized,
		config: next
	};
}
function validateConfigObjectWithPluginsBase(raw, opts) {
	const base = validateConfigObjectRaw(raw, {
		sourceRaw: opts.sourceRaw,
		preservedLegacyRootKeys: opts.preservedLegacyRootKeys,
		env: opts.env
	});
	if (!base.ok) return {
		ok: false,
		issues: base.issues,
		warnings: []
	};
	const parsedConfig = inheritLegacyDefaultAgentId(raw, base.config);
	const rememberRegistry = (registry) => {
		opts.onManifestRegistryResolved?.(registry);
		return { registry };
	};
	let registryInfo = opts.pluginMetadataSnapshot ? rememberRegistry(opts.pluginMetadataSnapshot.manifestRegistry) : null;
	if (opts.applyDefaults && !registryInfo) {
		const pluginMetadataSnapshot = opts.loadPluginMetadataSnapshot?.(parsedConfig);
		if (pluginMetadataSnapshot) registryInfo = rememberRegistry(pluginMetadataSnapshot.manifestRegistry);
	}
	const config = opts.applyDefaults ? materializeRuntimeConfig(parsedConfig, "snapshot", { manifestRegistry: registryInfo?.registry }) : parsedConfig;
	if (opts.pluginValidation === "skip") return {
		ok: true,
		config,
		warnings: []
	};
	const issues = [];
	const warnings = [];
	const hasExplicitPluginsConfig = isRecord(raw) && Object.hasOwn(raw, "plugins");
	const explicitPluginReferences = collectExplicitPluginReferences(raw);
	const formatChannelConfigIssueMessage = (message, pluginId) => {
		const safePluginId = pluginId ? sanitizeForLog(pluginId).trim() : "";
		return safePluginId ? `invalid config for plugin ${safePluginId}: ${message}` : formatRawChannelConfigIssueMessage(message);
	};
	let compatConfig;
	let compatPluginIds = null;
	let compatPluginIdsResolved = false;
	let registryDiagnosticsPushed = false;
	const pushRegistryDiagnostics = (registry) => {
		if (registryDiagnosticsPushed) return;
		registryDiagnosticsPushed = true;
		for (const diag of registry.diagnostics) {
			const explicitPath = diag.pluginId ? resolveExplicitPluginReferencePath(explicitPluginReferences, diag.pluginId) : void 0;
			let issuePath = explicitPath ?? "plugins";
			if (!diag.pluginId && diag.message.includes("plugin path not found")) issuePath = "plugins.load.paths";
			const pluginLabel = diag.pluginId ? `plugin ${diag.pluginId}` : "plugin";
			const issue = {
				path: issuePath,
				message: `${pluginLabel}: ${diag.message}`
			};
			if (diag.level === "error" && (explicitPath || !diag.pluginId)) issues.push(issue);
			else warnings.push(issue);
		}
	};
	const loadValidationRegistry = () => {
		const pluginMetadataSnapshot = opts.loadPluginMetadataSnapshot?.(config);
		if (pluginMetadataSnapshot) {
			registryInfo = rememberRegistry(pluginMetadataSnapshot.manifestRegistry);
			return registryInfo;
		}
		const registry = resolveConfigWidePluginManifestRegistry({
			config,
			env: opts.env ?? process.env
		});
		registryInfo = rememberRegistry(registry);
		return registryInfo;
	};
	const ensureLoadedRegistryInfo = () => registryInfo ?? loadValidationRegistry();
	const ensureCompatPluginIds = () => {
		if (compatPluginIdsResolved) return compatPluginIds ?? /* @__PURE__ */ new Set();
		compatPluginIdsResolved = true;
		const allow = config.plugins?.allow;
		if (!Array.isArray(allow) || allow.length === 0) {
			compatPluginIds = /* @__PURE__ */ new Set();
			return compatPluginIds;
		}
		const { registry } = registryInfo ?? loadValidationRegistry();
		const overriddenBundledPluginIds = new Set(registry.diagnostics.filter((diag) => diag.message.includes("duplicate plugin id detected")).map((diag) => diag.pluginId).filter((pluginId) => typeof pluginId === "string" && pluginId !== ""));
		compatPluginIds = new Set(registry.plugins.filter((plugin) => plugin.origin === "bundled" && (plugin.contracts?.webSearchProviders?.length ?? 0) > 0 && !overriddenBundledPluginIds.has(plugin.id)).map((plugin) => plugin.id));
		return compatPluginIds;
	};
	const ensureCompatConfig = () => {
		if (compatConfig !== void 0) return compatConfig ?? config;
		compatConfig = config;
		return config;
	};
	const ensureRegistry = () => {
		const info = ensureLoadedRegistryInfo();
		ensureCompatConfig();
		pushRegistryDiagnostics(info.registry);
		return info;
	};
	const ensureKnownIds = () => {
		const info = ensureRegistry();
		info.knownIds ??= new Set(info.registry.plugins.map((record) => record.id));
		return info.knownIds;
	};
	const ensureOverriddenPluginIds = () => {
		const info = ensureRegistry();
		info.overriddenPluginIds ??= new Set(info.registry.diagnostics.filter((diag) => diag.message.includes("duplicate plugin id detected")).map((diag) => diag.pluginId).filter((pluginId) => typeof pluginId === "string" && pluginId !== ""));
		return info.overriddenPluginIds;
	};
	const ensureNormalizedPlugins = () => {
		const info = ensureRegistry();
		info.normalizedPlugins ??= normalizePluginsConfig(ensureCompatConfig().plugins);
		return info.normalizedPlugins;
	};
	const ensureChannelSchemas = () => {
		const info = ensureRegistry();
		if (!info.channelSchemas) {
			info.channelSchemas = new Map(GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA.map((entry) => [entry.channelId, { schema: entry.schema }]));
			for (const entry of collectChannelSchemaMetadataWithOwnership(info.registry)) {
				const current = info.channelSchemas.get(entry.id);
				if (entry.configSchema) info.channelSchemas.set(entry.id, {
					schema: entry.configSchema,
					pluginId: entry.schemaPluginOrigin === "bundled" ? void 0 : entry.schemaPluginId
				});
				else if (!current) info.channelSchemas.set(entry.id, {});
			}
		}
		return info.channelSchemas;
	};
	const ensureChannelDmAllowFromModes = () => {
		const info = ensureLoadedRegistryInfo();
		info.channelDmAllowFromModes ??= new Map(collectChannelDmPolicyMetadata(info.registry).flatMap((entry) => entry.dmAllowFromMode ? [[entry.id, entry.dmAllowFromMode]] : []));
		return info.channelDmAllowFromModes;
	};
	warnings.push(...hasChannelDmPolicyDependencyWarningCandidates(parsedConfig) ? collectChannelDmPolicyDependencyWarnings(parsedConfig, { dmAllowFromModes: ensureChannelDmAllowFromModes() }) : collectChannelDmPolicyDependencyWarnings(parsedConfig));
	let mutatedConfig = config;
	let channelsCloned = false;
	let pluginsCloned = false;
	let pluginEntriesCloned = false;
	let installedPluginRecordIds;
	const ensureInstalledPluginRecordIds = () => {
		if (installedPluginRecordIds) return installedPluginRecordIds;
		try {
			installedPluginRecordIds = new Set(Object.keys(loadInstalledPluginIndexInstallRecordsSync({ env: opts.env })).map(normalizePluginId));
		} catch {
			installedPluginRecordIds = /* @__PURE__ */ new Set();
		}
		return installedPluginRecordIds;
	};
	const hasStalePluginEvidenceForUnknownChannel = (channelId) => {
		const normalizedChannelId = normalizePluginId(channelId);
		if (!normalizedChannelId || ensureKnownIds().has(normalizedChannelId)) return false;
		const pluginConfig = config.plugins;
		const matches = (pluginId) => normalizePluginId(pluginId) === normalizedChannelId;
		return Array.isArray(pluginConfig?.allow) && pluginConfig.allow.some(matches) || isRecord(pluginConfig?.entries) && Object.keys(pluginConfig.entries).some(matches) || isRecord(pluginConfig?.installs) && Object.keys(pluginConfig.installs).some(matches) || ensureInstalledPluginRecordIds().has(normalizedChannelId);
	};
	const collectActiveWebSearchProviderIds = () => {
		const { registry } = ensureRegistry();
		return [...new Set(registry.plugins.flatMap((record) => record.contracts?.webSearchProviders ?? []).map((providerId) => providerId.trim()).filter((providerId) => providerId.length > 0))].toSorted((left, right) => left.localeCompare(right));
	};
	const collectKnownWebSearchProviderIds = () => {
		return [.../* @__PURE__ */ new Set([...collectActiveWebSearchProviderIds(), ...resolveWebSearchInstallCatalogEntries().map((entry) => entry.provider.id.trim()).filter((providerId) => providerId.length > 0)])].toSorted((left, right) => left.localeCompare(right));
	};
	const hasPluginEvidenceForWebSearchProvider = (...pluginOrProviderIds) => {
		const candidateIds = new Set(pluginOrProviderIds.map(normalizePluginId).filter((id) => id.length > 0));
		if (candidateIds.size === 0) return false;
		const matches = (pluginId) => candidateIds.has(normalizePluginId(pluginId));
		const pluginConfig = config.plugins;
		if (Array.isArray(pluginConfig?.allow) && pluginConfig.allow.some(matches) || isRecord(pluginConfig?.entries) && Object.keys(pluginConfig.entries).some(matches) || isRecord(pluginConfig?.installs) && Object.keys(pluginConfig.installs).some(matches)) return true;
		return [...candidateIds].some((pluginId) => ensureInstalledPluginRecordIds().has(pluginId));
	};
	const validateWebSearchProvider = () => {
		const provider = config.tools?.web?.search?.provider;
		if (typeof provider !== "string") return;
		const trimmed = provider.trim();
		const issuePath = "tools.web.search.provider";
		if (!trimmed) {
			issues.push({
				path: issuePath,
				message: "web_search provider must not be empty"
			});
			return;
		}
		if (collectActiveWebSearchProviderIds().includes(trimmed)) return;
		const installCatalogEntry = resolveWebSearchInstallCatalogEntries().find((entry) => entry.provider.id === trimmed);
		if (installCatalogEntry) {
			const issue = {
				path: issuePath,
				message: `web_search provider is not available: ${trimmed} (install or enable plugin "${installCatalogEntry.pluginId}", then run openclaw doctor --fix)`,
				allowedValues: collectKnownWebSearchProviderIds()
			};
			if (hasPluginEvidenceForWebSearchProvider(trimmed, installCatalogEntry.pluginId)) warnings.push({
				...issue,
				message: `web_search provider is not available: ${trimmed} (configured plugin "${installCatalogEntry.pluginId}" is unavailable; Gateway will ignore this optional provider until the plugin is installed/enabled or openclaw doctor --fix repairs the config)`
			});
			else issues.push(issue);
			return;
		}
		const allowedValues = collectKnownWebSearchProviderIds();
		if (allowedValues.length === 0) return;
		const issue = {
			path: issuePath,
			message: `unknown web_search provider: ${trimmed}`,
			allowedValues
		};
		const normalizedProviderId = normalizePluginId(trimmed);
		if (Boolean(normalizedProviderId && !ensureKnownIds().has(normalizedProviderId) && hasPluginEvidenceForWebSearchProvider(trimmed))) warnings.push({
			...issue,
			message: `${issue.message} (stale web search plugin config ignored; run openclaw doctor --fix to remove stale config, or install the plugin)`
		});
		else issues.push(issue);
	};
	const validateConfiguredModelRefs = () => {
		const configuredRefs = collectConfiguredModelRefs(config);
		if (configuredRefs.length === 0) return;
		const { registry } = ensureRegistry();
		const suppressedModels = /* @__PURE__ */ new Map();
		for (const suppression of planManifestModelCatalogSuppressions({ registry }).suppressions) {
			const key = `${suppression.provider}/${suppression.model}`;
			if (!suppression.when && !suppressedModels.has(key)) suppressedModels.set(key, {
				provider: suppression.provider,
				model: suppression.model,
				...suppression.reason ? { reason: suppression.reason } : {}
			});
		}
		const seen = /* @__PURE__ */ new Set();
		for (const ref of configuredRefs) {
			const slashIndex = ref.value.indexOf("/");
			if (slashIndex <= 0 || slashIndex >= ref.value.length - 1) continue;
			const provider = normalizeLowercaseStringOrEmpty(ref.value.slice(0, slashIndex));
			const model = normalizeLowercaseStringOrEmpty(ref.value.slice(slashIndex + 1));
			if (!provider || !model) continue;
			const suppression = suppressedModels.get(`${provider}/${model}`);
			const issueKey = `${ref.path}\0${provider}/${model}`;
			if (!suppression || seen.has(issueKey)) continue;
			seen.add(issueKey);
			const modelRef = `${suppression.provider}/${suppression.model}`;
			issues.push({
				path: ref.path,
				message: suppression.reason ? `Unknown model: ${modelRef}. ${suppression.reason}` : `Unknown model: ${modelRef}.`
			});
		}
	};
	const replaceChannelConfig = (channelId, nextValue) => {
		if (!channelsCloned) {
			mutatedConfig = {
				...mutatedConfig,
				channels: { ...mutatedConfig.channels }
			};
			channelsCloned = true;
		}
		mutatedConfig.channels[channelId] = nextValue;
	};
	const replacePluginEntryConfig = (pluginId, nextValue) => {
		if (!pluginsCloned) {
			mutatedConfig = {
				...mutatedConfig,
				plugins: { ...mutatedConfig.plugins }
			};
			pluginsCloned = true;
		}
		if (!pluginEntriesCloned) {
			mutatedConfig.plugins = {
				...mutatedConfig.plugins,
				entries: { ...mutatedConfig.plugins?.entries }
			};
			pluginEntriesCloned = true;
		}
		const currentEntry = mutatedConfig.plugins?.entries?.[pluginId];
		mutatedConfig.plugins.entries[pluginId] = {
			...currentEntry,
			config: nextValue
		};
	};
	const allowedChannels = /* @__PURE__ */ new Set([
		"defaults",
		"modelByChannel",
		...bundledChannelIds
	]);
	if (config.channels && isRecord(config.channels)) for (const key of Object.keys(config.channels)) {
		const trimmed = key.trim();
		if (!trimmed) continue;
		if (!allowedChannels.has(trimmed)) for (const record of ensureRegistry().registry.plugins) for (const channelId of record.channels) allowedChannels.add(channelId);
		if (!allowedChannels.has(trimmed)) {
			const issue = {
				path: `channels.${trimmed}`,
				message: `unknown channel id: ${trimmed}`
			};
			if (hasStalePluginEvidenceForUnknownChannel(trimmed)) warnings.push({
				...issue,
				message: `${issue.message} (stale channel plugin config ignored; run openclaw doctor --fix to remove stale config, or install the plugin)`
			});
			else issues.push(issue);
			continue;
		}
		const channelSchema = ensureChannelSchemas().get(trimmed);
		if (!channelSchema?.schema) continue;
		const result = validateJsonSchemaValue({
			schema: channelSchema.schema,
			cacheKey: `channel:${trimmed}`,
			value: config.channels[trimmed],
			applyDefaults: true
		});
		if (!result.ok) for (const error of result.errors) issues.push({
			path: error.path === "<root>" ? `channels.${trimmed}` : `channels.${trimmed}.${error.path}`,
			message: formatChannelConfigIssueMessage(error.message, channelSchema.pluginId),
			allowedValues: error.allowedValues,
			allowedValuesHiddenCount: error.allowedValuesHiddenCount
		});
		else replaceChannelConfig(trimmed, result.value);
	}
	const heartbeatChannelIds = new Set(bundledChannelIds.map((channelId) => normalizeLowercaseStringOrEmpty(channelId)));
	const validateHeartbeatTarget = (target, issuePath) => {
		if (typeof target !== "string") return;
		const trimmed = target.trim();
		if (!trimmed) {
			issues.push({
				path: issuePath,
				message: "heartbeat target must not be empty"
			});
			return;
		}
		const normalized = normalizeLowercaseStringOrEmpty(trimmed);
		if (normalized === "owner" || normalized === "last" || normalized === "none" || normalizeBundledChannelId(trimmed)) return;
		if (!heartbeatChannelIds.has(normalized)) for (const record of ensureRegistry().registry.plugins) for (const channelId of record.channels) {
			const pluginChannel = channelId.trim();
			if (pluginChannel) heartbeatChannelIds.add(normalizeLowercaseStringOrEmpty(pluginChannel));
		}
		if (!heartbeatChannelIds.has(normalized)) issues.push({
			path: issuePath,
			message: `unknown heartbeat target: ${target}`
		});
	};
	validateHeartbeatTarget(config.agents?.defaults?.heartbeat?.target, "agents.defaults.heartbeat.target");
	for (const { entry, source } of listAgentEntriesWithSource(config)) {
		const pathPrefix = source.kind === "entries" ? `agents.entries.${source.key}` : `agents.list.${source.index}`;
		validateHeartbeatTarget(entry?.heartbeat?.target, `${pathPrefix}.heartbeat.target`);
	}
	validateWebSearchProvider();
	validateConfiguredModelRefs();
	if (!hasExplicitPluginsConfig) return issues.length > 0 ? {
		ok: false,
		issues,
		warnings
	} : {
		ok: true,
		config: mutatedConfig,
		warnings
	};
	const { registry } = ensureRegistry();
	validateExplicitPluginConfig({
		raw,
		config,
		effectiveConfig: ensureCompatConfig(),
		env: opts.env,
		applyDefaults: opts.applyDefaults,
		registry,
		knownIds: ensureKnownIds(),
		normalizedPlugins: ensureNormalizedPlugins(),
		ensureCompatPluginIds,
		ensureOverriddenPluginIds,
		replacePluginEntryConfig,
		issues,
		warnings
	});
	return issues.length > 0 ? {
		ok: false,
		issues,
		warnings
	} : {
		ok: true,
		config: mutatedConfig,
		warnings
	};
}
//#endregion
//#region src/config/io.context.ts
function createConfigIoContext(options = {}) {
	const deps = normalizeConfigIoDeps(options);
	const configPath = resolveConfigPathForDeps(deps);
	function observeLoadConfigSnapshot(snapshot) {
		if (deps.observe) observeConfigSnapshotSync(deps, snapshot);
		return snapshot;
	}
	function finalizeLoadedRuntimeConfig(cfg) {
		const duplicates = findDuplicateAgentDirs(cfg, {
			env: deps.env,
			homedir: deps.homedir
		});
		if (duplicates.length > 0) throw new DuplicateAgentDirError(duplicates);
		applyConfigEnvVars(cfg, deps.env);
		if ((shouldEnableShellEnvFallback(deps.env) || cfg.env?.shellEnv?.enabled === true) && options.shellEnvFallback !== "defer" && !shouldDeferShellEnvFallback(deps.env)) loadShellEnvFallback({
			enabled: true,
			env: deps.env,
			expectedKeys: resolveShellEnvExpectedKeys(deps.env),
			logger: deps.logger,
			timeoutMs: cfg.env?.shellEnv?.timeoutMs ?? resolveShellEnvFallbackTimeoutMs(deps.env)
		});
		const pendingValue = autoOwnerDisplaySecretByPath.get(configPath);
		const { config: resolvedConfig, generatedSecret } = ensureOwnerDisplaySecret(cfg, () => pendingValue ?? crypto.randomBytes(32).toString("hex"));
		return inheritLegacyDefaultAgentId(cfg, applyConfigOverrides(retainGeneratedOwnerDisplaySecret({
			config: resolvedConfig,
			configPath,
			generatedSecret,
			state: { pendingByPath: autoOwnerDisplaySecretByPath }
		})));
	}
	function createValidationPluginMetadataSnapshotLoader(params) {
		let metadataConfig;
		let manifestRegistry;
		let snapshot;
		let configWideSnapshot;
		const resolvePluginIdScope = (config) => createConfigValidationMetadataPluginIdScope({
			config,
			env: params.env
		});
		return {
			load: (config) => {
				if (manifestRegistry) return { manifestRegistry };
				metadataConfig = config;
				manifestRegistry = resolveConfigWidePluginManifestRegistry({
					config,
					env: params.env,
					allowCurrent: params.allowCurrentPluginMetadata,
					pluginIdScope: resolvePluginIdScope(config)
				});
				return { manifestRegistry };
			},
			getManifestRegistry: () => manifestRegistry,
			getSnapshot: () => {
				if (!metadataConfig) return;
				snapshot ??= resolvePluginMetadataSnapshot({
					config: metadataConfig,
					workspaceDir: tryResolveConfiguredAgentWorkspaceDir(metadataConfig, params.env),
					env: params.env,
					allowCurrent: params.allowCurrentPluginMetadata,
					allowWorkspaceScopedCurrent: true,
					pluginIdScope: resolvePluginIdScope(metadataConfig)
				});
				configWideSnapshot ??= manifestRegistry ? rebasePluginMetadataSnapshotManifestRegistry(snapshot, manifestRegistry) : snapshot;
				return configWideSnapshot;
			}
		};
	}
	function resolveRuntimePreflightSourceConfig(candidate) {
		const env = { ...deps.env };
		return coerceConfig(migratePersistedImplicitMainRoster(resolveConfigForRead(resolveConfigIncludesForRead(candidate, configPath, {
			...deps,
			env
		}), env, deps.lowerPrecedenceEnv).resolvedConfigRaw).config);
	}
	function prepareRecoveryBackupCandidate(candidate) {
		try {
			const originalEnv = cloneEnvWithPlatformSemantics(deps.env);
			const includeProvenance = [];
			const originalResolution = resolveConfigForRead(resolveConfigIncludesForRead(candidate.parsed, configPath, {
				...deps,
				env: originalEnv
			}, void 0, void 0, void 0, (event) => {
				const { value: _value, ...ownership } = event;
				includeProvenance.push(ownership);
			}), originalEnv, deps.lowerPrecedenceEnv);
			const otelOwnership = classifyOtelGrpcMigrationOwnership({
				snapshot: {
					path: configPath,
					includeProvenance
				},
				authoredConfig: candidate.parsed,
				resolvedConfig: originalResolution.resolvedConfigRaw
			});
			if (otelOwnership && otelOwnership.kind !== "direct") return {
				ok: false,
				reason: otelOwnership.kind === "resolved-only" ? "candidate migration cannot persist an env-resolved diagnostics.otel.protocol repair" : "candidate migration requires an include-owned diagnostics.otel.protocol repair"
			};
			const migrated = applyLegacyDoctorMigrations(candidate.parsed, {
				authoredRaw: candidate.parsed,
				resolvedRaw: originalResolution.resolvedConfigRaw
			});
			const authoredCandidate = migrated.next ?? candidate.parsed;
			const candidateEnv = cloneEnvWithPlatformSemantics(deps.env);
			const effectiveConfigRaw = resolveConfigForRead(resolveConfigIncludesForRead(authoredCandidate, configPath, {
				...deps,
				env: candidateEnv
			}), candidateEnv, deps.lowerPrecedenceEnv).resolvedConfigRaw;
			const pluginMetadata = createValidationPluginMetadataSnapshotLoader({
				effectiveConfigRaw,
				env: candidateEnv
			});
			const validated = validateConfigObjectWithPlugins(effectiveConfigRaw, {
				env: candidateEnv,
				pluginValidation: options.pluginValidation,
				loadPluginMetadataSnapshot: pluginMetadata.load,
				sourceRaw: authoredCandidate,
				preservedLegacyRootKeys: options.preservedLegacyRootKeys
			});
			if (!validated.ok) {
				const issueSummary = formatConfigIssueSummary(validated.issues.slice(0, 3)) ?? "";
				const detail = issueSummary.length > 800 ? `${issueSummary.slice(0, 799)}…` : issueSummary;
				return {
					ok: false,
					reason: `candidate remains invalid after legacy migration${detail ? `: ${detail}` : ""}`
				};
			}
			return {
				ok: true,
				candidate: {
					config: validated.config,
					parsed: authoredCandidate,
					raw: migrated.next ? JSON.stringify(authoredCandidate, null, 2).trimEnd().concat("\n") : candidate.raw
				}
			};
		} catch (error) {
			return {
				ok: false,
				reason: `candidate preparation failed: ${error instanceof Error ? error.message : String(error)}`
			};
		}
	}
	return {
		deps,
		configPath,
		options,
		observeLoadConfigSnapshot,
		finalizeLoadedRuntimeConfig,
		createValidationPluginMetadataSnapshotLoader,
		resolveRuntimePreflightSourceConfig,
		prepareRecoveryBackupCandidate
	};
}
function resolveModelIdNormalizationPolicies(snapshot) {
	return snapshot ? collectManifestModelIdNormalizationPolicies(snapshot.plugins) : void 0;
}
function materializeConfigForLoad(_context, config, _effectiveConfigRaw, manifestRegistry) {
	return materializeRuntimeConfig(config, "load", { manifestRegistry });
}
//#endregion
//#region src/config/io.clobber-snapshot.ts
/** Maximum retained clobbered-config snapshots per config file. */
const CONFIG_CLOBBER_SNAPSHOT_LIMIT = 32;
const CONFIG_CLOBBER_LOCK_STALE_MS = 3e4;
const CONFIG_CLOBBER_LOCK_RETRY_MS = 10;
const CONFIG_CLOBBER_LOCK_TIMEOUT_MS = 2e3;
const clobberSnapshotQueue = new KeyedAsyncQueue();
const clobberCapWarnedPaths = createDedupeCache({
	ttlMs: 0,
	maxSize: 4096
});
function formatConfigArtifactTimestamp(ts) {
	return ts.replaceAll(":", "-").replaceAll(".", "-");
}
function isFsErrorCode(error, code) {
	return error instanceof Error && "code" in error && typeof error.code === "string" && error.code === code;
}
function resolveClobberPaths(configPath) {
	const dir = path.dirname(configPath);
	const basename = path.basename(configPath);
	return {
		dir,
		prefix: `${basename}.clobbered.`,
		lockPath: path.join(dir, `${basename}.clobber.lock`)
	};
}
function shouldRemoveStaleLock(mtimeMs, nowMs) {
	return typeof mtimeMs === "number" && nowMs - mtimeMs > CONFIG_CLOBBER_LOCK_STALE_MS;
}
async function acquireClobberLock(deps, lockPath) {
	const startedAt = Date.now();
	while (Date.now() - startedAt < CONFIG_CLOBBER_LOCK_TIMEOUT_MS) try {
		await deps.fs.promises.mkdir(lockPath, { mode: 448 });
		return true;
	} catch (error) {
		if (!isFsErrorCode(error, "EEXIST")) return false;
		if (shouldRemoveStaleLock((await deps.fs.promises.stat(lockPath).catch(() => null))?.mtimeMs, Date.now())) {
			await deps.fs.promises.rmdir(lockPath).catch(() => {});
			continue;
		}
		await sleep(CONFIG_CLOBBER_LOCK_RETRY_MS);
	}
	return false;
}
function acquireClobberLockSync(deps, lockPath) {
	for (let attempt = 0; attempt < 2; attempt++) try {
		deps.fs.mkdirSync(lockPath, { mode: 448 });
		return true;
	} catch (error) {
		if (!isFsErrorCode(error, "EEXIST")) return false;
		if (!shouldRemoveStaleLock(deps.fs.statSync(lockPath, { throwIfNoEntry: false })?.mtimeMs, Date.now())) return false;
		try {
			deps.fs.rmdirSync(lockPath);
		} catch {
			return false;
		}
	}
	return false;
}
function compareClobberedSiblings(left, right) {
	return left.timestampKey.localeCompare(right.timestampKey) || left.mtimeMs - right.mtimeMs || left.name.localeCompare(right.name);
}
function createClobberedSiblingSnapshot(params) {
	return {
		name: params.entry,
		path: path.join(params.dir, params.entry),
		timestampKey: params.entry.slice(params.prefix.length).replace(/-\d{2}$/, ""),
		mtimeMs: params.mtimeMs
	};
}
async function listClobberedSiblings(deps, dir, prefix) {
	try {
		const entries = await deps.fs.promises.readdir(dir);
		const snapshots = [];
		for (const entry of entries) {
			if (!entry.startsWith(prefix)) continue;
			const stat = await deps.fs.promises.stat(path.join(dir, entry)).catch(() => null);
			snapshots.push(createClobberedSiblingSnapshot({
				dir,
				entry,
				prefix,
				mtimeMs: stat?.mtimeMs ?? 0
			}));
		}
		return snapshots.toSorted(compareClobberedSiblings);
	} catch {
		return [];
	}
}
function listClobberedSiblingsSync(deps, dir, prefix) {
	try {
		const snapshots = [];
		for (const entry of deps.fs.readdirSync(dir)) {
			if (!entry.startsWith(prefix)) continue;
			const stat = deps.fs.statSync(path.join(dir, entry), { throwIfNoEntry: false });
			snapshots.push(createClobberedSiblingSnapshot({
				dir,
				entry,
				prefix,
				mtimeMs: stat?.mtimeMs ?? 0
			}));
		}
		return snapshots.toSorted(compareClobberedSiblings);
	} catch {
		return [];
	}
}
function warnClobberCapReached(deps, configPath, existing) {
	if (clobberCapWarnedPaths.check(configPath)) return;
	deps.logger.warn(`Config clobber snapshot cap reached for ${configPath}: ${existing} existing .clobbered.* files; rotating oldest snapshots to preserve the latest forensic copy.`);
}
async function rotateOldestClobberedSiblings(deps, snapshots) {
	const deleteCount = Math.max(0, snapshots.length - CONFIG_CLOBBER_SNAPSHOT_LIMIT + 1);
	for (const snapshot of snapshots.slice(0, deleteCount)) try {
		await deps.fs.promises.unlink(snapshot.path);
	} catch (error) {
		if (!isFsErrorCode(error, "ENOENT")) return false;
	}
	return true;
}
function rotateOldestClobberedSiblingsSync(deps, snapshots) {
	const deleteCount = Math.max(0, snapshots.length - CONFIG_CLOBBER_SNAPSHOT_LIMIT + 1);
	for (const snapshot of snapshots.slice(0, deleteCount)) try {
		deps.fs.unlinkSync(snapshot.path);
	} catch (error) {
		if (!isFsErrorCode(error, "ENOENT")) return false;
	}
	return true;
}
function buildClobberedTargetPath(configPath, observedAt, attempt) {
	const basePath = `${configPath}.clobbered.${formatConfigArtifactTimestamp(observedAt)}`;
	return attempt === 0 ? basePath : `${basePath}-${String(attempt).padStart(2, "0")}`;
}
async function persistBoundedClobberedConfigSnapshot(params) {
	const paths = resolveClobberPaths(params.configPath);
	return await clobberSnapshotQueue.enqueue(paths.lockPath, async () => {
		if (!await acquireClobberLock(params.deps, paths.lockPath)) return null;
		try {
			const existing = await listClobberedSiblings(params.deps, paths.dir, paths.prefix);
			if (existing.length >= CONFIG_CLOBBER_SNAPSHOT_LIMIT) {
				warnClobberCapReached(params.deps, params.configPath, existing.length);
				if (!await rotateOldestClobberedSiblings(params.deps, existing)) return null;
			}
			for (let attempt = 0; attempt < CONFIG_CLOBBER_SNAPSHOT_LIMIT; attempt++) {
				const targetPath = buildClobberedTargetPath(params.configPath, params.observedAt, attempt);
				try {
					await params.deps.fs.promises.writeFile(targetPath, params.raw, {
						encoding: "utf-8",
						mode: 384,
						flag: "wx"
					});
					return targetPath;
				} catch (error) {
					if (!isFsErrorCode(error, "EEXIST")) return null;
				}
			}
			return null;
		} finally {
			await params.deps.fs.promises.rmdir(paths.lockPath).catch(() => {});
		}
	});
}
function persistBoundedClobberedConfigSnapshotSync(params) {
	const paths = resolveClobberPaths(params.configPath);
	if (!acquireClobberLockSync(params.deps, paths.lockPath)) return null;
	try {
		const existing = listClobberedSiblingsSync(params.deps, paths.dir, paths.prefix);
		if (existing.length >= CONFIG_CLOBBER_SNAPSHOT_LIMIT) {
			warnClobberCapReached(params.deps, params.configPath, existing.length);
			if (!rotateOldestClobberedSiblingsSync(params.deps, existing)) return null;
		}
		for (let attempt = 0; attempt < CONFIG_CLOBBER_SNAPSHOT_LIMIT; attempt++) {
			const targetPath = buildClobberedTargetPath(params.configPath, params.observedAt, attempt);
			try {
				params.deps.fs.writeFileSync(targetPath, params.raw, {
					encoding: "utf-8",
					mode: 384,
					flag: "wx"
				});
				return targetPath;
			} catch (error) {
				if (!isFsErrorCode(error, "EEXIST")) return null;
			}
		}
		return null;
	} finally {
		try {
			params.deps.fs.rmdirSync(paths.lockPath);
		} catch {}
	}
}
//#endregion
//#region src/config/json5-comments.ts
function hasJSON5Comments(raw) {
	let quote;
	for (let index = 0; index < raw.length; index += 1) {
		const char = raw[index];
		if (quote) {
			if (char === "\\") index += 1;
			else if (char === quote) quote = void 0;
			continue;
		}
		if (char === "\"" || char === "'") {
			quote = char;
			continue;
		}
		if (char === "/" && (raw[index + 1] === "/" || raw[index + 1] === "*")) return true;
	}
	return false;
}
function warnIfJSON5CommentsWillBeStripped(params) {
	if (params.skipOutputLogs || typeof params.raw !== "string" || !hasJSON5Comments(params.raw)) return;
	(params.warn ?? console.warn)(`Config write will strip JSON5 comments from ${params.filePath}.`);
}
//#endregion
//#region src/config/io.observe-recovery.ts
function formatConfigPermissionHardeningWarning(params) {
	const detail = params.error instanceof Error ? params.error.message : String(params.error);
	return `Config permission hardening failed (${params.context}): ${params.configPath}: ${detail}`;
}
async function chmodConfigBestEffort(params) {
	try {
		await params.deps.fs.promises.chmod?.(params.configPath, 384);
	} catch (error) {
		params.deps.logger.warn(formatConfigPermissionHardeningWarning({
			configPath: params.configPath,
			context: params.context,
			error
		}));
	}
}
function chmodConfigBestEffortSync(params) {
	try {
		params.deps.fs.chmodSync?.(params.configPath, 384);
	} catch (error) {
		params.deps.logger.warn(formatConfigPermissionHardeningWarning({
			configPath: params.configPath,
			context: params.context,
			error
		}));
	}
}
function createRecoveryCommitEffect(params) {
	const options = {
		filePath: params.configPath,
		content: params.raw,
		dirMode: 448,
		mode: 384,
		tempPrefix: path.basename(params.configPath),
		fileSystem: params.deps.fs
	};
	return {
		sync: () => {
			replaceFileAtomicSync(options);
		},
		async: async () => {
			await replaceFileAtomic(options);
		}
	};
}
function createConfigObserveAuditAppendParams(deps, params) {
	return {
		env: deps.env,
		homedir: deps.homedir,
		record: createConfigObserveAuditRecord(params)
	};
}
function extractRestoreErrorDetails(error) {
	if (!error || typeof error !== "object") return {
		code: null,
		message: typeof error === "string" ? error : null
	};
	return {
		code: "code" in error && typeof error.code === "string" ? error.code : null,
		message: "message" in error && typeof error.message === "string" ? error.message : null
	};
}
function returnOriginalConfigRead(params) {
	return {
		raw: params.raw,
		parsed: params.parsed
	};
}
function parseBackupConfigRaw(deps, backupRaw) {
	try {
		return { parsed: deps.json5.parse(backupRaw) };
	} catch {
		return null;
	}
}
function logBackupRestoreResult(params) {
	if (params.restoredFromBackup) {
		params.deps.logger.warn(`Config auto-restored from backup: ${params.configPath} (${params.suspicious.join(", ")})`);
		return;
	}
	params.deps.logger.warn(`Config auto-restore from backup failed: ${params.configPath} (${params.suspicious.join(", ")}${params.restoreErrorMessage ? `; ${params.restoreErrorMessage}` : ""})`);
}
function createBackupRestoreAuditAppendParams(params) {
	return createConfigObserveAuditAppendParams(params.deps, {
		configPath: params.configPath,
		valid: params.restoredFromBackup,
		current: params.current,
		suspicious: params.suspicious,
		lastKnownGood: params.entry.lastKnownGood,
		backup: params.backup,
		clobberedPath: params.clobberedPath,
		restoredFromBackup: params.restoredFromBackup,
		restoredBackupPath: params.backupPath,
		restoreErrorCode: params.restoreErrorDetails.code,
		restoreErrorMessage: params.restoreErrorDetails.message
	});
}
function resolveSuspiciousSignature(current, suspicious) {
	return `${current.hash}:${suspicious.join(",")}`;
}
function isRecoverableConfigReadSuspiciousReason(reason) {
	return reason === "missing-meta-vs-last-good" || reason === "gateway-mode-missing-vs-last-good" || reason === "update-channel-only-root" || reason.startsWith("size-drop-vs-last-good:");
}
function resolveConfigReadRecoveryContext(params) {
	const suspicious = resolveConfigObserveSuspiciousReasons({
		bytes: params.current.bytes,
		hasMeta: params.current.hasMeta,
		gatewayMode: params.current.gatewayMode,
		parsed: params.parsed,
		lastKnownGood: params.backupBaseline
	});
	if (!suspicious.some(isRecoverableConfigReadSuspiciousReason)) return null;
	const suspiciousSignature = resolveSuspiciousSignature(params.current, suspicious);
	if (params.entry.lastObservedSuspiciousSignature === suspiciousSignature) return null;
	return {
		suspicious,
		suspiciousSignature
	};
}
function resolveLastKnownGoodConfigPath(configPath) {
	return `${configPath}.last-good`;
}
function isSensitiveConfigPath(pathLabel) {
	return /(^|\.)(api[-_]?key|auth|bearer|credential|password|private[-_]?key|secret|token)(\.|$)/i.test(pathLabel);
}
function collectPollutedSecretPlaceholders(value, pathLabel = "", output = []) {
	if (typeof value === "string") {
		const trimmed = value.trim();
		if (trimmed === "***" || trimmed === "[redacted]") {
			output.push(pathLabel || "<root>");
			return output;
		}
		if (isSensitiveConfigPath(pathLabel) && (trimmed.includes("...") || trimmed.includes("…"))) output.push(pathLabel || "<root>");
		return output;
	}
	if (Array.isArray(value)) {
		value.forEach((item, index) => collectPollutedSecretPlaceholders(item, `${pathLabel}[${index}]`, output));
		return output;
	}
	if (isRecord(value)) for (const [key, child] of Object.entries(value)) collectPollutedSecretPlaceholders(child, pathLabel ? `${pathLabel}.${key}` : key, output);
	return output;
}
async function maybeRecoverSuspiciousConfigRead(params) {
	const recovery = recoverSuspiciousConfigRead(params);
	let step = recovery.next();
	while (!step.done) try {
		step = recovery.next(await step.value.async());
	} catch (error) {
		step = recovery.throw(error);
	}
	return step.value;
}
function maybeRecoverSuspiciousConfigReadSync(params) {
	const recovery = recoverSuspiciousConfigRead(params);
	let step = recovery.next();
	while (!step.done) try {
		step = recovery.next(step.value.sync());
	} catch (error) {
		step = recovery.throw(error);
	}
	return step.value;
}
function createConfigRecoveryStatEffect(deps, configPath) {
	return {
		sync: () => {
			try {
				return deps.fs.statSync(configPath, { throwIfNoEntry: false }) ?? null;
			} catch {
				return null;
			}
		},
		async: () => deps.fs.promises.stat(configPath).catch(() => null)
	};
}
function createConfigBackupReadEffect(deps, backupPath) {
	return {
		sync: () => {
			try {
				return deps.fs.readFileSync(backupPath, "utf-8");
			} catch {
				return null;
			}
		},
		async: () => deps.fs.promises.readFile(backupPath, "utf-8").catch(() => null)
	};
}
function* recoverSuspiciousConfigRead(params) {
	const { deps, configPath, raw, parsed } = params;
	const stat = yield createConfigRecoveryStatEffect(deps, configPath);
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const current = createConfigHealthFingerprint({
		raw,
		parsed,
		stat,
		observedAt: now
	});
	const healthState = readConfigHealthStateFromStore(deps);
	const entry = readConfigHealthEntry(healthState, configPath);
	const backupPath = `${configPath}.bak`;
	const recoveryContext = resolveConfigReadRecoveryContext({
		current,
		parsed,
		entry,
		backupBaseline: entry.lastKnownGood ?? (yield {
			sync: () => readConfigFingerprintForPathSync(deps, backupPath),
			async: () => readConfigFingerprintForPath(deps, backupPath)
		}) ?? void 0
	});
	if (!recoveryContext) return returnOriginalConfigRead(params);
	const { suspicious, suspiciousSignature } = recoveryContext;
	const backupRaw = yield createConfigBackupReadEffect(deps, backupPath);
	if (!backupRaw) return returnOriginalConfigRead(params);
	const backupParse = parseBackupConfigRaw(deps, backupRaw);
	if (!backupParse) return returnOriginalConfigRead(params);
	const backupCandidate = {
		raw: backupRaw,
		parsed: backupParse.parsed
	};
	const prepared = yield {
		sync: () => params.prepareBackup(backupCandidate),
		async: () => params.prepareBackup(backupCandidate)
	};
	if (!prepared.ok) return returnOriginalConfigRead(params);
	const preparedCandidate = prepared.candidate;
	const backupStat = yield createConfigRecoveryStatEffect(deps, backupPath);
	const backup = createConfigHealthFingerprint({
		raw: backupRaw,
		parsed: backupParse.parsed,
		stat: backupStat
	});
	if (!backup.gatewayMode) return returnOriginalConfigRead(params);
	if (params.allowBackupRecovery) {
		if (!(yield {
			sync: () => true,
			async: () => params.allowBackupRecovery?.() ?? true
		})) return returnOriginalConfigRead(params);
	}
	const snapshotParams = {
		deps,
		configPath,
		raw,
		observedAt: now
	};
	const clobberedPath = yield {
		sync: () => persistBoundedClobberedConfigSnapshotSync(snapshotParams),
		async: () => persistBoundedClobberedConfigSnapshot(snapshotParams)
	};
	let restoredFromBackup = false;
	let restoreError;
	try {
		if (preparedCandidate.raw !== backupRaw) warnIfJSON5CommentsWillBeStripped({
			raw: backupRaw,
			filePath: configPath,
			warn: (message) => deps.logger.warn(message)
		});
		yield createRecoveryCommitEffect({
			deps,
			configPath,
			raw: preparedCandidate.raw
		});
		const chmodParams = {
			deps,
			configPath,
			context: "backup restore"
		};
		yield {
			sync: () => chmodConfigBestEffortSync(chmodParams),
			async: () => chmodConfigBestEffort(chmodParams)
		};
		restoredFromBackup = true;
	} catch (error) {
		restoreError = error;
	}
	const restoreErrorDetails = restoredFromBackup ? {
		code: null,
		message: null
	} : extractRestoreErrorDetails(restoreError);
	logBackupRestoreResult({
		deps,
		configPath,
		suspicious,
		restoredFromBackup,
		restoreErrorMessage: restoreErrorDetails.message
	});
	const audit = createBackupRestoreAuditAppendParams({
		deps,
		configPath,
		restoredFromBackup,
		current,
		suspicious,
		entry,
		backup,
		clobberedPath,
		backupPath,
		restoreErrorDetails
	});
	yield {
		sync: () => appendConfigAuditRecordSync(audit),
		async: () => appendConfigAuditRecord(audit)
	};
	if (restoredFromBackup) writeConfigHealthStateToStore(deps, updateConfigHealthEntry(healthState, configPath, {
		...entry,
		lastObservedSuspiciousSignature: suspiciousSignature
	}));
	return preparedCandidate;
}
async function promoteConfigSnapshotToLastKnownGoodCore(params) {
	const { deps, snapshot } = params;
	if (!snapshot.exists || !snapshot.valid || typeof snapshot.raw !== "string") return false;
	const polluted = collectPollutedSecretPlaceholders(snapshot.parsed);
	if (polluted.length > 0) {
		params.logger?.warn(`Config last-known-good promotion skipped: redacted secret placeholder at ${polluted[0]}`);
		return false;
	}
	const stat = await deps.fs.promises.stat(snapshot.path).catch(() => null);
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const current = createConfigHealthFingerprint({
		hash: resolveConfigSnapshotHash(snapshot) ?? void 0,
		raw: snapshot.raw,
		parsed: snapshot.parsed,
		resolved: snapshot.resolved,
		stat,
		observedAt: now
	});
	const lastGoodPath = resolveLastKnownGoodConfigPath(snapshot.path);
	await deps.fs.promises.writeFile(lastGoodPath, snapshot.raw, {
		encoding: "utf-8",
		mode: 384
	});
	await chmodConfigBestEffort({
		deps,
		configPath: lastGoodPath,
		context: "last-known-good promotion"
	});
	const healthState = readConfigHealthStateFromStore(deps);
	const entry = readConfigHealthEntry(healthState, snapshot.path);
	writeConfigHealthStateToStore(deps, updateConfigHealthEntry(healthState, snapshot.path, {
		...entry,
		lastKnownGood: current,
		lastPromotedGood: current,
		lastObservedSuspiciousSignature: null
	}));
	return true;
}
async function recoverConfigFromLastKnownGoodCore(params) {
	const { deps, snapshot } = params;
	if (!snapshot.exists || typeof snapshot.raw !== "string") return false;
	if (!shouldAttemptLastKnownGoodRecovery(snapshot)) {
		if (isPluginLocalInvalidConfigSnapshot(snapshot)) deps.logger.warn(`Config last-known-good recovery skipped: invalidity is scoped to stale plugin config (${params.reason})`);
		return false;
	}
	const healthState = readConfigHealthStateFromStore(deps);
	const entry = readConfigHealthEntry(healthState, snapshot.path);
	const promoted = entry.lastPromotedGood;
	if (!promoted?.hash) return false;
	const lastGoodPath = resolveLastKnownGoodConfigPath(snapshot.path);
	const backupRaw = await deps.fs.promises.readFile(lastGoodPath, "utf-8").catch(() => null);
	if (!backupRaw || hashConfigRaw(backupRaw) !== promoted.hash) return false;
	let backupParsed;
	try {
		backupParsed = deps.json5.parse(backupRaw);
	} catch {
		return false;
	}
	const originalCandidate = {
		raw: backupRaw,
		parsed: backupParsed
	};
	const prepared = params.prepareCandidate(originalCandidate);
	if (!prepared.ok) {
		deps.logger.warn(`Config last-known-good recovery skipped: ${prepared.reason} (${params.reason})`);
		return false;
	}
	const recoveryCandidate = prepared.candidate;
	const polluted = collectPollutedSecretPlaceholders(recoveryCandidate.parsed);
	if (polluted.length > 0) {
		deps.logger.warn(`Config last-known-good recovery skipped: redacted secret placeholder at ${polluted[0]}`);
		return false;
	}
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const stat = await deps.fs.promises.stat(snapshot.path).catch(() => null);
	const current = createConfigHealthFingerprint({
		hash: resolveConfigSnapshotHash(snapshot) ?? void 0,
		raw: snapshot.raw,
		parsed: snapshot.parsed,
		resolved: snapshot.resolved,
		stat,
		observedAt: now
	});
	const clobberedPath = await preserveConfigSnapshotAsClobberedCore({
		deps,
		snapshot,
		observedAt: now
	});
	if (recoveryCandidate.raw !== backupRaw) warnIfJSON5CommentsWillBeStripped({
		raw: backupRaw,
		filePath: snapshot.path,
		warn: (message) => deps.logger.warn(message)
	});
	await createRecoveryCommitEffect({
		deps,
		configPath: snapshot.path,
		raw: recoveryCandidate.raw
	}).async();
	await chmodConfigBestEffort({
		deps,
		configPath: snapshot.path,
		context: "last-known-good recovery"
	});
	const issueSummary = formatConfigIssueSummary([...snapshot.issues, ...snapshot.legacyIssues]);
	deps.logger.warn(`Config auto-restored from last-known-good: ${snapshot.path} (${params.reason})${issueSummary ? `; Rejected validation details: ${issueSummary}.` : ""}`);
	await appendConfigAuditRecord(createConfigObserveAuditAppendParams(deps, {
		configPath: snapshot.path,
		valid: snapshot.valid,
		current,
		suspicious: [params.reason],
		lastKnownGood: promoted,
		backup: promoted,
		clobberedPath,
		restoredFromBackup: true,
		restoredBackupPath: lastGoodPath
	}));
	writeConfigHealthStateToStore(deps, updateConfigHealthEntry(healthState, snapshot.path, {
		...entry,
		lastKnownGood: promoted,
		lastPromotedGood: promoted,
		lastObservedSuspiciousSignature: null
	}));
	return true;
}
async function preserveConfigSnapshotAsClobberedCore(params) {
	if (!params.snapshot.exists || typeof params.snapshot.raw !== "string") return null;
	return await persistBoundedClobberedConfigSnapshot({
		deps: params.deps,
		configPath: params.snapshot.path,
		raw: params.snapshot.raw,
		observedAt: params.observedAt ?? (/* @__PURE__ */ new Date()).toISOString()
	});
}
//#endregion
//#region src/config/io.snapshot-shared.ts
function createConfigFileSnapshot(params) {
	const sourceConfig = asResolvedSourceConfig(params.sourceConfig);
	const runtimeConfig = asRuntimeConfig(params.runtimeConfig);
	return {
		path: params.path,
		includedPaths: [...params.includedPaths ?? []],
		...params.includeProvenance ? { includeProvenance: params.includeProvenance.map((entry) => ({
			...entry,
			path: [...entry.path],
			...entry.targetPaths ? { targetPaths: [...entry.targetPaths] } : {}
		})) } : {},
		...params.agentRosterIncludeOwned !== void 0 ? { agentRosterIncludeOwned: params.agentRosterIncludeOwned } : {},
		...params.bindingsIncludeOwned !== void 0 ? { bindingsIncludeOwned: params.bindingsIncludeOwned } : {},
		exists: params.exists,
		raw: params.raw,
		parsed: params.parsed,
		...params.sourceConfigBeforeMigrations ? { sourceConfigBeforeMigrations: asResolvedSourceConfig(params.sourceConfigBeforeMigrations) } : {},
		sourceConfig,
		resolved: sourceConfig,
		valid: params.valid,
		runtimeConfig,
		config: runtimeConfig,
		hash: params.hash,
		...params.readError ? { readError: params.readError } : {},
		issues: params.issues,
		warnings: params.warnings,
		legacyIssues: params.legacyIssues
	};
}
async function finalizeReadConfigSnapshotInternalResult(deps, result, options) {
	if (deps.observe && options?.observe !== false) await observeConfigSnapshot(deps, result.snapshot);
	return result;
}
async function collectInvalidConfigLegacyIssues(raw, sourceRaw) {
	if (!raw || typeof raw !== "object") return [];
	const { findDoctorLegacyConfigIssues } = await import("./legacy-config-issues-DaAeUiD3.js");
	return findDoctorLegacyConfigIssues(raw, sourceRaw);
}
//#endregion
//#region src/config/io.warnings.ts
function warnOnConfigMiskeys(raw, logger) {
	if (!raw || typeof raw !== "object") return;
	const gateway = raw.gateway;
	if (!gateway || typeof gateway !== "object") return;
	if ("token" in gateway) logger.warn("Config uses \"gateway.token\". This key is ignored; use \"gateway.auth.token\" instead.");
}
function logConfigWarningsOnce(params) {
	if (params.warnings.length === 0) {
		loggedConfigWarningFingerprints.delete(params.configPath);
		return;
	}
	const details = params.warnings.map((warning) => `- ${sanitizeTerminalText(warning.path || "<root>")}: ${sanitizeTerminalText(warning.message)}`).join("\n");
	const fingerprint = hashConfigRaw(details);
	if (loggedConfigWarningFingerprints.get(params.configPath) === fingerprint) {
		setBoundedConfigIoWarningEntry(loggedConfigWarningFingerprints, params.configPath, fingerprint);
		return;
	}
	setBoundedConfigIoWarningEntry(loggedConfigWarningFingerprints, params.configPath, fingerprint);
	params.logger.warn(`Config warnings:\n${details}`);
}
function warnIfConfigFromFuture(cfg, logger) {
	const touched = cfg.meta?.lastTouchedVersion;
	if (!touched || !shouldWarnOnTouchedVersion(VERSION, touched)) return;
	if (warnedFutureTouchedVersions.check(touched)) return;
	logger.warn([
		`Your OpenClaw config was written by version ${touched}, but this command is running ${VERSION}.`,
		"Check: `openclaw --version`, `which openclaw`, and `openclaw gateway status --deep`.",
		"If unexpected, update PATH so `openclaw` points to the version you want, or reinstall the Gateway service from that same OpenClaw install."
	].join("\n"));
}
//#endregion
//#region src/config/io.load.ts
function loadConfigFromContext(context, options = {}) {
	const { deps, configPath } = context;
	let envBeforeRead;
	try {
		maybeLoadDotEnvForConfig(deps.env);
		envBeforeRead = snapshotEnv(deps.env);
		if (!deps.fs.existsSync(configPath)) {
			loggedConfigWarningFingerprints.delete(configPath);
			if (context.options.shellEnvFallback !== "defer" && shouldEnableShellEnvFallback(deps.env) && !shouldDeferShellEnvFallback(deps.env)) loadShellEnvFallback({
				enabled: true,
				env: deps.env,
				expectedKeys: resolveShellEnvExpectedKeys(deps.env),
				logger: deps.logger,
				timeoutMs: resolveShellEnvFallbackTimeoutMs(deps.env)
			});
			return migratePersistedImplicitMainRoster({}).config;
		}
		const raw = deps.fs.readFileSync(configPath, "utf-8");
		const parsed = deps.json5.parse(raw);
		const readResolution = resolveConfigForRead(resolveConfigIncludesForRead(parsed, configPath, deps), deps.env, deps.lowerPrecedenceEnv);
		const rosterMigration = migratePersistedImplicitMainRoster(readResolution.resolvedConfigRaw);
		const effectiveConfigRaw = rosterMigration.config;
		const validationConfigRaw = effectiveConfigRaw;
		const snapshotRaw = raw;
		const snapshotParsed = parsed;
		const hash = hashConfigRaw(snapshotRaw);
		for (const warning of readResolution.envWarnings) deps.logger.warn(`Config (${configPath}): missing env var "${warning.varName}" at ${warning.configPath} - feature using this value will be unavailable`);
		for (const diagnostic of rosterMigration.diagnostics) deps.logger.warn(`Config (${configPath}): ${diagnostic}`);
		warnOnConfigMiskeys(validationConfigRaw, deps.logger);
		if (typeof validationConfigRaw !== "object" || validationConfigRaw === null) {
			loggedConfigWarningFingerprints.delete(configPath);
			context.observeLoadConfigSnapshot(createConfigFileSnapshot({
				path: configPath,
				exists: true,
				raw: snapshotRaw,
				parsed: snapshotParsed,
				sourceConfig: {},
				valid: true,
				runtimeConfig: {},
				hash,
				issues: [],
				warnings: [],
				legacyIssues: []
			}));
			return {};
		}
		const duplicates = findDuplicateAgentDirs(validationConfigRaw, {
			env: deps.env,
			homedir: deps.homedir
		});
		if (duplicates.length > 0) throw new DuplicateAgentDirError(duplicates);
		const pluginMetadata = context.createValidationPluginMetadataSnapshotLoader({
			effectiveConfigRaw,
			env: deps.env
		});
		const validated = validateConfigObjectWithPlugins(validationConfigRaw, {
			env: deps.env,
			pluginValidation: context.options.pluginValidation,
			loadPluginMetadataSnapshot: pluginMetadata.load,
			sourceRaw: snapshotParsed,
			preservedLegacyRootKeys: context.options.preservedLegacyRootKeys
		});
		if (!validated.ok) {
			context.observeLoadConfigSnapshot(createConfigFileSnapshot({
				path: configPath,
				exists: true,
				raw: snapshotRaw,
				parsed: snapshotParsed,
				sourceConfig: coerceConfig(effectiveConfigRaw),
				valid: false,
				runtimeConfig: coerceConfig(effectiveConfigRaw),
				hash,
				issues: validated.issues,
				warnings: validated.warnings,
				legacyIssues: []
			}));
			throwInvalidConfig({
				configPath,
				issues: validated.issues,
				logger: deps.logger,
				loggedConfigPaths: loggedInvalidConfigs
			});
		}
		if (context.options.pluginValidation !== "skip") logConfigWarningsOnce({
			configPath,
			warnings: validated.warnings,
			logger: deps.logger
		});
		if (!deps.suppressFutureVersionWarning) warnIfConfigFromFuture(validated.config, deps.logger);
		if (deps.observe && !options.skipSuspiciousRecovery && !containsConfigIncludeDirective(parsed)) {
			if (maybeRecoverSuspiciousConfigReadSync({
				deps,
				configPath,
				raw,
				parsed,
				prepareBackup: context.prepareRecoveryBackupCandidate
			}).raw !== raw) {
				restoreEnvChangesIfUnchanged({
					env: deps.env,
					before: envBeforeRead,
					after: snapshotEnv(deps.env)
				});
				return loadConfigFromContext(context, { skipSuspiciousRecovery: true });
			}
		}
		const cfg = materializeConfigForLoad(context, validated.config, effectiveConfigRaw, pluginMetadata.getManifestRegistry());
		context.observeLoadConfigSnapshot(createConfigFileSnapshot({
			path: configPath,
			exists: true,
			raw: snapshotRaw,
			parsed: snapshotParsed,
			sourceConfig: coerceConfig(effectiveConfigRaw),
			valid: true,
			runtimeConfig: cfg,
			hash,
			issues: [],
			warnings: validated.warnings,
			legacyIssues: []
		}));
		return context.finalizeLoadedRuntimeConfig(cfg);
	} catch (error) {
		if (envBeforeRead) restoreEnvChangesIfUnchanged({
			env: deps.env,
			before: envBeforeRead,
			after: snapshotEnv(deps.env)
		});
		if (error instanceof DuplicateAgentDirError) {
			deps.logger.error(error.message);
			throw error;
		}
		if (error?.code === "INVALID_CONFIG") throw error;
		deps.logger.error(`Failed to read config at ${configPath}`, error);
		throw error;
	}
}
//#endregion
//#region src/config/io.recovery.ts
function findJsonRootSuffix(raw, json5) {
	if (/^\s*(?:\{|\[)/.test(raw)) return null;
	let offset = 0;
	while (offset < raw.length) {
		const nextNewline = raw.indexOf("\n", offset);
		const lineEnd = nextNewline === -1 ? raw.length : nextNewline + 1;
		const line = raw.slice(offset, lineEnd);
		if (/^\s*(?:\{|\[)/.test(line)) {
			const candidate = raw.slice(offset);
			const parsed = parseConfigJson5(candidate, json5);
			return parsed.ok ? {
				raw: candidate,
				parsed: parsed.parsed
			} : null;
		}
		offset = lineEnd;
	}
	return null;
}
function warnOnConfigPermissionHardeningFailure(params) {
	const message = params.error instanceof Error ? params.error.message : String(params.error);
	params.context.deps.logger.warn(`Config permission hardening failed (${params.detail}): ${params.context.configPath}: ${message}`);
}
async function persistPrefixedConfigRecovery(params) {
	const { context } = params;
	const observedAt = (/* @__PURE__ */ new Date()).toISOString();
	const clobberedPath = await persistBoundedClobberedConfigSnapshot({
		deps: context.deps,
		configPath: context.configPath,
		raw: params.originalRaw,
		observedAt
	});
	await context.deps.fs.promises.writeFile(context.configPath, params.recoveredRaw, {
		encoding: "utf-8",
		mode: 384
	});
	await context.deps.fs.promises.chmod?.(context.configPath, 384).catch((error) => {
		warnOnConfigPermissionHardeningFailure({
			context,
			detail: "prefix recovery",
			error
		});
	});
	context.deps.logger.warn(`Config auto-stripped non-JSON prefix: ${context.configPath}` + (clobberedPath ? ` (original saved as ${clobberedPath})` : ""));
}
async function recoverConfigFromJsonRootSuffixWithContext(context, snapshot) {
	if (!snapshot.exists || snapshot.valid || typeof snapshot.raw !== "string") return false;
	const suffixRecovery = findJsonRootSuffix(snapshot.raw, context.deps.json5);
	if (!suffixRecovery) return false;
	let resolved;
	try {
		resolved = resolveConfigIncludesForRead(suffixRecovery.parsed, context.configPath, context.deps);
	} catch {
		return false;
	}
	if (!validateConfigObjectWithPlugins(resolveConfigForRead(resolved, context.deps.env, context.deps.lowerPrecedenceEnv).resolvedConfigRaw, {
		env: context.deps.env,
		sourceRaw: suffixRecovery.parsed
	}).ok) return false;
	await persistPrefixedConfigRecovery({
		context,
		originalRaw: snapshot.raw,
		recoveredRaw: suffixRecovery.raw
	});
	return true;
}
//#endregion
//#region src/config/config-path-mutation.ts
const MANAGED_CONFIG_UNSET_PATHS = [["plugins", "installs"]];
const WRITE_PRUNED_OBJECT = Symbol("write-pruned-object");
function unsetPathForWriteAt(value, pathSegments, depth) {
	if (depth >= pathSegments.length) return {
		changed: false,
		value
	};
	const segment = expectDefined(pathSegments[depth], "path segments entry at depth");
	const isLeaf = depth === pathSegments.length - 1;
	if (Array.isArray(value)) {
		const index = parseConfigPathArrayIndex(segment);
		if (index === void 0 || index >= value.length) return {
			changed: false,
			value
		};
		if (isLeaf) {
			const next = value.slice();
			next.splice(index, 1);
			return {
				changed: true,
				value: next
			};
		}
		const child = unsetPathForWriteAt(value[index], pathSegments, depth + 1);
		if (!child.changed) return {
			changed: false,
			value
		};
		const next = value.slice();
		if (child.value === WRITE_PRUNED_OBJECT) next.splice(index, 1);
		else next[index] = child.value;
		return {
			changed: true,
			value: next
		};
	}
	if (isBlockedObjectKey(segment) || !isRecord(value) || !Object.hasOwn(value, segment)) return {
		changed: false,
		value
	};
	if (isLeaf) {
		const next = { ...value };
		delete next[segment];
		return {
			changed: true,
			value: Object.keys(next).length === 0 ? WRITE_PRUNED_OBJECT : next
		};
	}
	const child = unsetPathForWriteAt(value[segment], pathSegments, depth + 1);
	if (!child.changed) return {
		changed: false,
		value
	};
	const next = { ...value };
	if (child.value === WRITE_PRUNED_OBJECT) delete next[segment];
	else next[segment] = child.value;
	return {
		changed: true,
		value: Object.keys(next).length === 0 ? WRITE_PRUNED_OBJECT : next
	};
}
function unsetPathForWrite(root, pathSegments) {
	if (pathSegments.length === 0) return {
		changed: false,
		next: root
	};
	const result = unsetPathForWriteAt(root, pathSegments, 0);
	if (!result.changed) return {
		changed: false,
		next: root
	};
	if (result.value === WRITE_PRUNED_OBJECT) return {
		changed: true,
		next: {}
	};
	if (isRecord(result.value)) return {
		changed: true,
		next: result.value
	};
	return {
		changed: false,
		next: root
	};
}
function applyUnsetPathsForWrite(root, unsetPaths) {
	let next = root;
	for (const unsetPath of unsetPaths ?? []) {
		if (!Array.isArray(unsetPath) || unsetPath.length === 0) continue;
		const unsetResult = unsetPathForWrite(next, unsetPath);
		if (unsetResult.changed) next = unsetResult.next;
	}
	return next;
}
function resolveManagedUnsetPathsForWrite(unsetPaths) {
	const next = [];
	for (const managedPath of MANAGED_CONFIG_UNSET_PATHS) next.push(Array.from(managedPath));
	for (const unsetPath of unsetPaths ?? []) {
		if (!Array.isArray(unsetPath) || unsetPath.length === 0) continue;
		if (next.some((existing) => isDeepStrictEqual(existing, unsetPath))) continue;
		next.push([...unsetPath]);
	}
	return next;
}
//#endregion
//#region src/config/io.snapshot.ts
function listResolvedIncludePaths(includeFilePathsForWatch) {
	return [...includeFilePathsForWatch].toSorted();
}
async function readConfigFileSnapshotInternal(context, options = {}) {
	const { deps, configPath } = context;
	maybeLoadDotEnvForConfig(deps.env);
	const envBeforeRead = snapshotEnv(deps.env);
	if (!deps.fs.existsSync(configPath)) {
		const config = coerceConfig(migratePersistedImplicitMainRoster({}).config);
		return await finalizeReadConfigSnapshotInternalResult(deps, { snapshot: createConfigFileSnapshot({
			path: configPath,
			exists: false,
			raw: null,
			parsed: {},
			sourceConfig: config,
			valid: true,
			runtimeConfig: config,
			hash: hashConfigRaw(null),
			issues: [],
			warnings: [],
			legacyIssues: []
		}) });
	}
	let fallbackRaw = null;
	let fallbackParsed = {};
	let fallbackSourceConfig = {};
	let fallbackHash = hashConfigRaw(null);
	let fallbackEnvSnapshotForRestore;
	const includeFileHashesForWrite = {};
	const includeFileTargetsForWrite = {};
	const includeFilePathsForWatch = /* @__PURE__ */ new Set();
	const includeProvenance = [];
	let agentRosterIncludeOwned = false;
	let bindingsIncludeOwned = false;
	try {
		const raw = await deps.measure("config.snapshot.read.file", () => deps.fs.readFileSync(configPath, "utf-8"));
		const rawHash = await deps.measure("config.snapshot.read.hash", () => hashConfigRaw(raw));
		fallbackRaw = raw;
		fallbackHash = rawHash;
		const parsedRes = await deps.measure("config.snapshot.read.parse", () => parseConfigJson5(raw, deps.json5));
		if (!parsedRes.ok) return await finalizeReadConfigSnapshotInternalResult(deps, { snapshot: createConfigFileSnapshot({
			path: configPath,
			includedPaths: listResolvedIncludePaths(includeFilePathsForWatch),
			exists: true,
			raw,
			parsed: {},
			sourceConfig: {},
			valid: false,
			runtimeConfig: {},
			hash: rawHash,
			issues: [{
				path: "",
				message: `JSON5 parse failed: ${parsedRes.error}`
			}],
			warnings: [],
			legacyIssues: []
		}) });
		const effectiveParsed = parsedRes.parsed;
		fallbackParsed = effectiveParsed;
		fallbackSourceConfig = coerceConfig(effectiveParsed);
		let resolved;
		try {
			resolved = await deps.measure("config.snapshot.read.includes", () => resolveConfigIncludesForRead(effectiveParsed, configPath, deps, includeFileHashesForWrite, includeFileTargetsForWrite, includeFilePathsForWatch, (event) => {
				const { value: _value, ...ownership } = event;
				includeProvenance.push(ownership);
				agentRosterIncludeOwned ||= includeContributionOwnsAgentRoster(event);
				bindingsIncludeOwned ||= includeContributionOwnsBindings(event);
			}));
		} catch (error) {
			const message = error instanceof ConfigIncludeError ? error.message : `Include resolution failed: ${String(error)}`;
			return await finalizeReadConfigSnapshotInternalResult(deps, {
				snapshot: createConfigFileSnapshot({
					path: configPath,
					includedPaths: listResolvedIncludePaths(includeFilePathsForWatch),
					exists: true,
					raw,
					parsed: effectiveParsed,
					sourceConfig: coerceConfig(effectiveParsed),
					valid: false,
					runtimeConfig: coerceConfig(effectiveParsed),
					hash: rawHash,
					issues: [{
						path: "",
						message
					}],
					warnings: [],
					legacyIssues: []
				}),
				includeFileHashesForWrite,
				includeFileTargetsForWrite
			});
		}
		const readResolution = await deps.measure("config.snapshot.read.env", () => resolveConfigForRead(resolved, deps.env, deps.lowerPrecedenceEnv));
		fallbackEnvSnapshotForRestore = readResolution.envSnapshotForRestore;
		const envVarWarnings = readResolution.envWarnings.map((warning) => ({
			path: warning.configPath,
			message: `Missing env var "${warning.varName}" - feature using this value will be unavailable`
		}));
		const rosterMigration = migratePersistedImplicitMainRoster(readResolution.resolvedConfigRaw);
		envVarWarnings.push(...rosterMigration.diagnostics.map((message) => ({
			path: "agents.entries",
			message
		})));
		const effectiveConfigRaw = rosterMigration.config;
		const validationConfigRaw = effectiveConfigRaw;
		const snapshotRaw = raw;
		const snapshotParsed = effectiveParsed;
		const snapshotHash = rawHash;
		fallbackSourceConfig = coerceConfig(effectiveConfigRaw);
		const pluginMetadata = context.createValidationPluginMetadataSnapshotLoader({
			effectiveConfigRaw,
			env: deps.env,
			allowCurrentPluginMetadata: options.allowCurrentPluginMetadata
		});
		const validated = await deps.measure("config.snapshot.read.validate", () => validateConfigObjectWithPlugins(validationConfigRaw, {
			env: deps.env,
			pluginValidation: context.options.pluginValidation,
			loadPluginMetadataSnapshot: pluginMetadata.load,
			sourceRaw: effectiveParsed,
			preservedLegacyRootKeys: context.options.preservedLegacyRootKeys
		}));
		if (!validated.ok) {
			const legacyIssues = await deps.measure("config.snapshot.read.legacy-issues", () => collectInvalidConfigLegacyIssues(effectiveConfigRaw, effectiveParsed));
			restoreEnvChangesIfUnchanged({
				env: deps.env,
				before: envBeforeRead,
				after: snapshotEnv(deps.env)
			});
			return await finalizeReadConfigSnapshotInternalResult(deps, {
				snapshot: createConfigFileSnapshot({
					path: configPath,
					includedPaths: listResolvedIncludePaths(includeFilePathsForWatch),
					exists: true,
					raw: snapshotRaw,
					parsed: snapshotParsed,
					includeProvenance,
					agentRosterIncludeOwned,
					bindingsIncludeOwned,
					sourceConfigBeforeMigrations: coerceConfig(readResolution.resolvedConfigRaw),
					sourceConfig: coerceConfig(effectiveConfigRaw),
					valid: false,
					runtimeConfig: coerceConfig(effectiveConfigRaw),
					hash: snapshotHash,
					issues: validated.issues,
					warnings: [...validated.warnings, ...envVarWarnings],
					legacyIssues
				}),
				envSnapshotForRestore: readResolution.envSnapshotForRestore,
				includeFileHashesForWrite,
				includeFileTargetsForWrite
			});
		}
		if (!deps.suppressFutureVersionWarning) warnIfConfigFromFuture(validated.config, deps.logger);
		let callerRejectedSuspiciousRecovery = false;
		if (options.recoverSuspicious === true && deps.observe && !options.skipSuspiciousRecovery && !containsConfigIncludeDirective(effectiveParsed)) {
			const allowSuspiciousRecovery = options.allowSuspiciousRecovery;
			let recoveryCandidate = null;
			if ((await deps.measure("config.snapshot.read.recover-suspicious", () => maybeRecoverSuspiciousConfigRead({
				deps,
				configPath,
				raw,
				parsed: effectiveParsed,
				prepareBackup: (backup) => {
					const prepared = context.prepareRecoveryBackupCandidate(backup);
					recoveryCandidate = prepared.ok ? prepared.candidate.config ?? null : null;
					return prepared;
				},
				...allowSuspiciousRecovery ? { allowBackupRecovery: async () => {
					const allowed = recoveryCandidate !== null && await allowSuspiciousRecovery(recoveryCandidate, validated.config);
					callerRejectedSuspiciousRecovery = !allowed;
					return allowed;
				} } : {}
			}))).raw !== raw) {
				restoreEnvChangesIfUnchanged({
					env: deps.env,
					before: envBeforeRead,
					after: snapshotEnv(deps.env)
				});
				return await readConfigFileSnapshotInternal(context, {
					allowCurrentPluginMetadata: options.allowCurrentPluginMetadata,
					recoverSuspicious: options.recoverSuspicious,
					skipSuspiciousRecovery: true
				});
			}
		}
		const snapshotConfig = await deps.measure("config.snapshot.read.materialize", () => materializeRuntimeConfig(validated.config, "snapshot", { manifestRegistry: pluginMetadata.getSnapshot()?.manifestRegistry }));
		return await deps.measure("config.snapshot.read.observe", () => finalizeReadConfigSnapshotInternalResult(deps, {
			snapshot: createConfigFileSnapshot({
				path: configPath,
				includedPaths: listResolvedIncludePaths(includeFilePathsForWatch),
				exists: true,
				raw: snapshotRaw,
				parsed: snapshotParsed,
				includeProvenance,
				agentRosterIncludeOwned,
				bindingsIncludeOwned,
				sourceConfigBeforeMigrations: coerceConfig(readResolution.resolvedConfigRaw),
				sourceConfig: coerceConfig(effectiveConfigRaw),
				valid: true,
				runtimeConfig: snapshotConfig,
				hash: snapshotHash,
				issues: [],
				warnings: [...validated.warnings, ...envVarWarnings],
				legacyIssues: []
			}),
			envSnapshotForRestore: readResolution.envSnapshotForRestore,
			includeFileHashesForWrite,
			includeFileTargetsForWrite,
			pluginMetadataSnapshot: pluginMetadata.getSnapshot()
		}, { observe: !callerRejectedSuspiciousRecovery }));
	} catch (error) {
		const nodeError = error;
		let message;
		if (nodeError?.code === "EACCES") {
			const uid = process.getuid?.();
			const uidHint = typeof uid === "number" ? String(uid) : "$(id -u)";
			message = [
				`read failed: ${String(error)}`,
				"",
				"Config file is not readable by the current process. If running in a container",
				"or 1-click deployment, fix ownership with:",
				`  chown ${uidHint} "${configPath}"`,
				"Then restart the gateway."
			].join("\n");
			deps.logger.error(message);
		} else message = `read failed: ${String(error)}`;
		return await finalizeReadConfigSnapshotInternalResult(deps, {
			snapshot: createConfigFileSnapshot({
				path: configPath,
				includedPaths: listResolvedIncludePaths(includeFilePathsForWatch),
				exists: true,
				raw: fallbackRaw,
				parsed: fallbackParsed,
				sourceConfig: fallbackSourceConfig,
				valid: false,
				runtimeConfig: fallbackSourceConfig,
				hash: fallbackHash,
				...fallbackRaw === null ? { readError: { code: nodeError?.code ?? null } } : {},
				issues: [{
					path: "",
					message
				}],
				warnings: [],
				legacyIssues: []
			}),
			envSnapshotForRestore: fallbackEnvSnapshotForRestore,
			includeFileHashesForWrite,
			includeFileTargetsForWrite
		});
	}
}
async function readConfigFileSnapshotFromContext(context, options = {}) {
	return (await readConfigFileSnapshotInternal(context, {
		recoverSuspicious: options.recoverSuspicious === true,
		allowSuspiciousRecovery: options.allowSuspiciousRecovery
	})).snapshot;
}
async function readConfigFileSnapshotWithPluginMetadataFromContext(context, options = {}) {
	const result = await readConfigFileSnapshotInternal(context, {
		allowCurrentPluginMetadata: options.allowCurrentPluginMetadata,
		recoverSuspicious: options.recoverSuspicious === true,
		allowSuspiciousRecovery: options.allowSuspiciousRecovery
	});
	let pluginMetadataSnapshot = result.pluginMetadataSnapshot;
	if (!pluginMetadataSnapshot && result.snapshot.valid) {
		const pluginMetadata = context.createValidationPluginMetadataSnapshotLoader({
			effectiveConfigRaw: result.snapshot.sourceConfig,
			env: context.deps.env,
			allowCurrentPluginMetadata: options.allowCurrentPluginMetadata
		});
		pluginMetadata.load(result.snapshot.sourceConfig);
		pluginMetadataSnapshot = pluginMetadata.getSnapshot();
	}
	return {
		snapshot: result.snapshot,
		...pluginMetadataSnapshot ? { pluginMetadataSnapshot } : {}
	};
}
async function readConfigFileSnapshotForWriteFromContext(context) {
	const assertConfigPathForWrite = () => {
		if (resolveConfigPathForDeps(context.deps) !== context.configPath) throw new ConfigMutationConflictError("config path changed since last load", {
			currentHash: null,
			retryable: false
		});
	};
	assertConfigPathForWrite();
	const result = await readConfigFileSnapshotInternal(context);
	assertConfigPathForWrite();
	return {
		snapshot: result.snapshot,
		writeOptions: {
			assertConfigPathForWrite,
			basePluginMetadataSnapshot: result.pluginMetadataSnapshot,
			envSnapshotForRestore: result.envSnapshotForRestore,
			expectedConfigPath: context.configPath,
			ownedConfigPathForWrite: context.configPath,
			includeFileHashesForWrite: result.includeFileHashesForWrite,
			includeFileTargetsForWrite: result.includeFileTargetsForWrite,
			unsetPaths: resolveManagedUnsetPathsForWrite(void 0)
		}
	};
}
async function readBestEffortConfigSnapshotFromContext(context) {
	const result = await readConfigFileSnapshotInternal(context);
	if (!result.snapshot.valid) return {
		config: result.snapshot.config,
		sourceConfig: result.snapshot.sourceConfig
	};
	return {
		config: context.finalizeLoadedRuntimeConfig(materializeRuntimeConfig(result.snapshot.sourceConfig, "load", { manifestRegistry: result.pluginMetadataSnapshot?.manifestRegistry })),
		sourceConfig: result.snapshot.sourceConfig
	};
}
async function readSourceConfigBestEffortFromContext(context) {
	const { deps, configPath } = context;
	maybeLoadDotEnvForConfig(deps.env);
	if (!deps.fs.existsSync(configPath)) return {};
	try {
		const parsed = parseConfigJson5(deps.fs.readFileSync(configPath, "utf-8"), deps.json5);
		if (!parsed.ok) return {};
		let resolved;
		try {
			resolved = resolveConfigIncludesForRead(parsed.parsed, configPath, deps);
		} catch {
			return coerceConfig(parsed.parsed);
		}
		return coerceConfig(resolveConfigForRead(resolved, deps.env, deps.lowerPrecedenceEnv).resolvedConfigRaw);
	} catch {
		return {};
	}
}
//#endregion
//#region src/config/backup-rotation.ts
const CONFIG_BACKUP_COUNT = 5;
/**
* Advances the config `.bak` ring before a new primary backup is copied in.
*
* Missing slots are ignored so interrupted writes or first-run configs do not
* block the next config write.
*/
async function rotateConfigBackups(configPath, ioFs) {
	const backupBase = `${configPath}.bak`;
	const maxIndex = CONFIG_BACKUP_COUNT - 1;
	await ioFs.unlink(`${backupBase}.${maxIndex}`).catch(() => {});
	for (let index = maxIndex - 1; index >= 1; index -= 1) await ioFs.rename(`${backupBase}.${index}`, `${backupBase}.${index + 1}`).catch(() => {});
	await ioFs.rename(backupBase, `${backupBase}.1`).catch(() => {});
}
/**
* Sets owner-only permissions on every backup slot when chmod exists.
*
* Backups are copied on mixed filesystems, so copy mode preservation is not a
* portable security guarantee.
*/
async function hardenBackupPermissions(configPath, ioFs) {
	if (!ioFs.chmod) return;
	const backupBase = `${configPath}.bak`;
	await ioFs.chmod(backupBase, 384).catch(() => {});
	for (let i = 1; i < CONFIG_BACKUP_COUNT; i++) await ioFs.chmod(`${backupBase}.${i}`, 384).catch(() => {});
}
const preUpdateConfigSnapshotsWritten = /* @__PURE__ */ new Set();
/**
* Captures the first on-disk config state for an update attempt.
*
* The snapshot is outside the rotating `.bak` ring so repeated writes during
* one process keep an operator-visible rollback point for the original file.
*/
async function createPreUpdateConfigSnapshot(params) {
	if (!params.fs.existsSync(params.configPath)) return;
	const snapshotKey = path.resolve(params.configPath);
	if (preUpdateConfigSnapshotsWritten.has(snapshotKey)) return;
	preUpdateConfigSnapshotsWritten.add(snapshotKey);
	const snapshotPath = `${params.configPath}.pre-update`;
	try {
		const content = await params.fs.readFile(params.configPath, "utf-8");
		await params.fs.writeFile(snapshotPath, content, {
			encoding: "utf-8",
			mode: 384,
			flag: "w"
		});
	} catch {
		preUpdateConfigSnapshotsWritten.delete(snapshotKey);
	}
}
/** Runs rotation, primary copy, and permission hardening. */
async function maintainConfigBackups(configPath, ioFs) {
	await rotateConfigBackups(configPath, ioFs);
	await ioFs.copyFile(configPath, `${configPath}.bak`).catch(() => {});
	await hardenBackupPermissions(configPath, ioFs);
}
//#endregion
//#region src/config/config-change-paths.ts
function collectChangedPaths(base, target, path, output) {
	if (Array.isArray(base) && Array.isArray(target)) {
		const max = Math.max(base.length, target.length);
		for (let index = 0; index < max; index += 1) {
			const childPath = path ? `${path}[${index}]` : `[${index}]`;
			if (index >= base.length || index >= target.length) {
				output.add(childPath);
				continue;
			}
			collectChangedPaths(base[index], target[index], childPath, output);
		}
		return;
	}
	if (isRecord(base) && isRecord(target)) {
		const keys = /* @__PURE__ */ new Set([...Object.keys(base), ...Object.keys(target)]);
		for (const key of keys) {
			const childPath = path ? `${path}.${key}` : key;
			const hasBase = Object.hasOwn(base, key);
			if (!Object.hasOwn(target, key) || !hasBase) {
				output.add(childPath);
				continue;
			}
			collectChangedPaths(base[key], target[key], childPath, output);
		}
		return;
	}
	if (!isDeepStrictEqual(base, target)) output.add(path);
}
//#endregion
//#region src/config/env-preserve.ts
/**
* Preserves `${VAR}` environment variable references during config write-back.
*
* When config is read, `${VAR}` references are resolved to their values.
* When writing back, callers pass the resolved config. This module detects
* values that match what a `${VAR}` reference would resolve to and restores
* the original reference, so env var references survive config round-trips.
*
* A value is restored only if:
* 1. The pre-substitution value contained a `${VAR}` pattern
* 2. Resolving that pattern with current env vars produces the incoming value
*
* If a caller intentionally set a new value (different from what the env var
* resolves to), the new value is kept as-is.
*/
const ENV_VAR_PATTERN = /\$\{[A-Z_][A-Z0-9_]*\}/;
const ENV_VAR_NAME_PATTERN = /^[A-Z_][A-Z0-9_]*$/;
var EnvRefArrayMutationError = class extends Error {
	constructor() {
		super("Config write would reorder or modify an array containing environment references.");
		this.name = "EnvRefArrayMutationError";
	}
};
/**
* Check if a string contains any `${VAR}` env var references.
*/
function hasEnvVarRef(value) {
	return ENV_VAR_PATTERN.test(value);
}
function collectAuthoredEnvRefs(value) {
	const refs = [];
	for (let index = 0; index < value.length; index += 1) {
		if (value[index] !== "$") continue;
		const isEscaped = value[index + 1] === "$" && value[index + 2] === "{";
		const nameStart = index + (isEscaped ? 3 : 2);
		if (!isEscaped && value[index + 1] !== "{") continue;
		const nameEnd = value.indexOf("}", nameStart);
		if (nameEnd === -1 || !ENV_VAR_NAME_PATTERN.test(value.slice(nameStart, nameEnd))) continue;
		refs.push({
			kind: isEscaped ? "escaped" : "unescaped",
			name: value.slice(nameStart, nameEnd)
		});
		index = nameEnd;
	}
	return refs;
}
function hasUnescapedEnvVarRef(value) {
	return collectAuthoredEnvRefs(value).some((ref) => ref.kind === "unescaped");
}
function hasEscapedEnvVarRef(value) {
	return collectAuthoredEnvRefs(value).some((ref) => ref.kind === "escaped");
}
function containsAuthoredUnescapedEnvTemplate(value) {
	if (typeof value === "string") return hasUnescapedEnvVarRef(value);
	if (Array.isArray(value)) return value.some((item) => containsAuthoredUnescapedEnvTemplate(item));
	if (isPlainObject(value)) return Object.values(value).some((item) => containsAuthoredUnescapedEnvTemplate(item));
	return false;
}
function containsAuthoredEscapedEnvTemplate(value) {
	if (typeof value === "string") return hasEscapedEnvVarRef(value);
	if (Array.isArray(value)) return value.some((item) => containsAuthoredEscapedEnvTemplate(item));
	if (isPlainObject(value)) return Object.values(value).some((item) => containsAuthoredEscapedEnvTemplate(item));
	return false;
}
function countAuthoredEnvRefsByPath(value, kind) {
	const countsByName = /* @__PURE__ */ new Map();
	const visit = (item, path) => {
		if (typeof item === "string") {
			for (const ref of collectAuthoredEnvRefs(item)) if (ref.kind === kind) {
				const pathCounts = countsByName.get(ref.name) ?? /* @__PURE__ */ new Map();
				const pathKey = JSON.stringify(path);
				pathCounts.set(pathKey, (pathCounts.get(pathKey) ?? 0) + 1);
				countsByName.set(ref.name, pathCounts);
			}
			return;
		}
		if (Array.isArray(item)) {
			item.forEach((child, index) => visit(child, [...path, String(index)]));
			return;
		}
		if (isPlainObject(item)) Object.entries(item).forEach(([key, child]) => visit(child, [...path, key]));
	};
	visit(value, []);
	return countsByName;
}
function countResolvedActiveEnvRefsByPath(incoming, parsed, env) {
	const countsByName = /* @__PURE__ */ new Map();
	const visit = (incomingItem, parsedItem, path) => {
		if (typeof incomingItem === "string" && typeof parsedItem === "string") {
			if (!isDeepStrictEqual(incomingItem, tryResolveString(parsedItem, env))) return;
			for (const ref of collectAuthoredEnvRefs(parsedItem)) if (ref.kind === "unescaped") {
				const pathCounts = countsByName.get(ref.name) ?? /* @__PURE__ */ new Map();
				const pathKey = JSON.stringify(path);
				pathCounts.set(pathKey, (pathCounts.get(pathKey) ?? 0) + 1);
				countsByName.set(ref.name, pathCounts);
			}
			return;
		}
		if (Array.isArray(incomingItem) && Array.isArray(parsedItem)) {
			parsedItem.forEach((child, index) => visit(incomingItem[index], child, [...path, String(index)]));
			return;
		}
		if (isPlainObject(incomingItem) && isPlainObject(parsedItem)) Object.entries(parsedItem).forEach(([key, child]) => visit(incomingItem[key], child, [...path, key]));
	};
	visit(incoming, parsed, []);
	return countsByName;
}
function containsUnaccountedActiveEscapedEnvRef(incoming, escapedParsed, matchedIncoming, matchedParsed, env) {
	const escapedCounts = countAuthoredEnvRefsByPath(escapedParsed, "escaped");
	const incomingActiveCounts = countAuthoredEnvRefsByPath(incoming, "unescaped");
	const incomingEscapedCounts = countAuthoredEnvRefsByPath(incoming, "escaped");
	const matchedActiveCounts = countResolvedActiveEnvRefsByPath(matchedIncoming, matchedParsed, env);
	const matchedEscapedCounts = countAuthoredEnvRefsByPath(matchedParsed, "escaped");
	return [...escapedCounts].some(([name, escapedPathCounts]) => [...incomingActiveCounts.get(name) ?? /* @__PURE__ */ new Map()].some(([path, count]) => count > (matchedActiveCounts.get(name)?.get(path) ?? 0)) || [...escapedPathCounts.keys()].some((path) => {
		return (incomingActiveCounts.get(name)?.get(path) ?? 0) > 0 && (incomingEscapedCounts.get(name)?.get(path) ?? 0) < (matchedEscapedCounts.get(name)?.get(path) ?? 0);
	}));
}
function preservesAuthoredEscapedEnvRefs(incoming, parsed) {
	const parsedEscapedCounts = countAuthoredEnvRefsByPath(parsed, "escaped");
	const incomingEscapedCounts = countAuthoredEnvRefsByPath(incoming, "escaped");
	return [...parsedEscapedCounts].every(([name, parsedPathCounts]) => [...parsedPathCounts].every(([path, count]) => (incomingEscapedCounts.get(name)?.get(path) ?? 0) >= count));
}
function getArrayIdentityPathValue(value, path) {
	let current = value;
	for (const segment of path) {
		if (!isPlainObject(current)) return;
		current = current[segment];
	}
	return current;
}
function collectStableArrayIdentityPaths(value) {
	if (!isPlainObject(value)) return [];
	for (const key of ["id", "agentId"]) {
		const child = value[key];
		if (typeof child === "string" && !hasEnvVarRef(child)) return [[key]];
	}
	return [];
}
function resolveStableArrayIdentityMatch(params) {
	const parsedItem = params.parsed[params.parsedIndex];
	const identityPaths = collectStableArrayIdentityPaths(parsedItem);
	if (identityPaths.length === 0) return { kind: "none" };
	let incomingIndex;
	let hasUniqueAuthoredIdentity = false;
	for (const identityPath of identityPaths) {
		const identityValue = getArrayIdentityPathValue(parsedItem, identityPath);
		if (params.parsed.filter((item) => isDeepStrictEqual(getArrayIdentityPathValue(item, identityPath), identityValue)).length !== 1) continue;
		hasUniqueAuthoredIdentity = true;
		const incomingMatches = params.incoming.flatMap((item, index) => isDeepStrictEqual(getArrayIdentityPathValue(item, identityPath), identityValue) ? [index] : []);
		if (incomingMatches.length !== 1 || incomingIndex !== void 0 && incomingIndex !== incomingMatches[0]) return { kind: "invalid" };
		incomingIndex = incomingMatches[0];
	}
	if (incomingIndex !== void 0) return {
		kind: "match",
		incomingIndex
	};
	return hasUniqueAuthoredIdentity ? { kind: "invalid" } : { kind: "none" };
}
function collectLiteralArrayIdentityPaths(value, path = []) {
	if (typeof value === "string") return hasEnvVarRef(value) ? [] : [path];
	if (!isPlainObject(value)) return [];
	return Object.entries(value).flatMap(([key, child]) => collectLiteralArrayIdentityPaths(child, [...path, key]));
}
function hasStableSameIndexLiteralShape(params) {
	if (params.incoming.length !== params.parsed.length) return false;
	const parsedItem = params.parsed[params.parsedIndex];
	const literalPaths = collectLiteralArrayIdentityPaths(parsedItem);
	if (literalPaths.length === 0 || literalPaths.some((identityPath) => {
		const identityValue = getArrayIdentityPathValue(parsedItem, identityPath);
		return !isDeepStrictEqual(getArrayIdentityPathValue(params.incoming[params.parsedIndex], identityPath), identityValue);
	})) return false;
	return literalPaths.some((identityPath) => {
		const identityValue = getArrayIdentityPathValue(parsedItem, identityPath);
		const authoredCount = params.parsed.filter((item) => isDeepStrictEqual(getArrayIdentityPathValue(item, identityPath), identityValue)).length;
		const incomingCount = params.incoming.filter((item) => isDeepStrictEqual(getArrayIdentityPathValue(item, identityPath), identityValue)).length;
		return authoredCount === 1 && incomingCount === 1;
	});
}
function matchesArrayElementAtSameIndex(incoming, parsed, env) {
	return isDeepStrictEqual(incoming, parsed) || isDeepStrictEqual(incoming, resolveEnvVarRefsForComparison(parsed, env));
}
function matchesRetainedArrayItem(params) {
	if (matchesArrayElementAtSameIndex(params.incoming[params.incomingIndex], params.parsed[params.parsedIndex], params.env)) return true;
	const stableIdentity = resolveStableArrayIdentityMatch({
		incoming: params.incoming,
		parsed: params.parsed,
		parsedIndex: params.parsedIndex
	});
	return stableIdentity.kind === "match" && stableIdentity.incomingIndex === params.incomingIndex;
}
function hasStableSameIndexNeighbors(params) {
	return params.incoming.length === params.parsed.length && params.parsed.every((item, index) => index === params.parsedIndex || matchesArrayElementAtSameIndex(params.incoming[index], item, params.env));
}
function matchUniqueRetainedArrayItems(params) {
	if (params.incoming.length >= params.parsed.length) return;
	const earliestParsedIndexes = [];
	let nextParsedIndex = 0;
	for (let incomingIndex = 0; incomingIndex < params.incoming.length; incomingIndex += 1) {
		const parsedIndex = params.parsed.findIndex((_parsedItem, index) => index >= nextParsedIndex && matchesRetainedArrayItem({
			...params,
			incomingIndex,
			parsedIndex: index
		}));
		if (parsedIndex < 0) return;
		earliestParsedIndexes.push(parsedIndex);
		nextParsedIndex = parsedIndex + 1;
	}
	const latestParsedIndexes = Array.from({ length: params.incoming.length }, () => 0);
	nextParsedIndex = params.parsed.length - 1;
	for (let incomingIndex = params.incoming.length - 1; incomingIndex >= 0; incomingIndex -= 1) {
		let parsedIndex = nextParsedIndex;
		while (parsedIndex >= 0 && !matchesRetainedArrayItem({
			...params,
			incomingIndex,
			parsedIndex
		})) parsedIndex -= 1;
		if (parsedIndex < 0) return;
		latestParsedIndexes[incomingIndex] = parsedIndex;
		nextParsedIndex = parsedIndex - 1;
	}
	if (!isDeepStrictEqual(earliestParsedIndexes, latestParsedIndexes)) return;
	return new Map(earliestParsedIndexes.map((parsedIndex, incomingIndex) => [parsedIndex, incomingIndex]));
}
function matchAuthoredTemplateArrayItems(params) {
	const templateIndexes = params.parsed.flatMap((item, index) => containsAuthoredUnescapedEnvTemplate(item) ? [index] : []);
	if (params.incoming.length === params.parsed.length && params.incoming.every((item, index) => matchesArrayElementAtSameIndex(item, params.parsed[index], params.env))) return new Map(templateIndexes.map((index) => [index, index]));
	const retainedDeletionMatches = matchUniqueRetainedArrayItems(params);
	if (retainedDeletionMatches) return new Map(templateIndexes.flatMap((parsedIndex) => {
		const incomingIndex = retainedDeletionMatches.get(parsedIndex);
		return incomingIndex === void 0 ? [] : [[parsedIndex, incomingIndex]];
	}));
	const matches = /* @__PURE__ */ new Map();
	const usedIncomingIndexes = /* @__PURE__ */ new Set();
	const addMatch = (parsedIndex, incomingIndex) => {
		if (usedIncomingIndexes.has(incomingIndex)) throw new EnvRefArrayMutationError();
		matches.set(parsedIndex, incomingIndex);
		usedIncomingIndexes.add(incomingIndex);
	};
	for (const parsedIndex of templateIndexes) {
		const parsedItem = params.parsed[parsedIndex];
		const stableIdentity = resolveStableArrayIdentityMatch({
			incoming: params.incoming,
			parsed: params.parsed,
			parsedIndex
		});
		if (stableIdentity.kind !== "none") {
			if (stableIdentity.kind === "invalid") throw new EnvRefArrayMutationError();
			addMatch(parsedIndex, stableIdentity.incomingIndex);
			continue;
		}
		if (parsedIndex < params.incoming.length && matchesArrayElementAtSameIndex(params.incoming[parsedIndex], parsedItem, params.env)) {
			const precedingItemsRemainAligned = params.parsed.slice(0, parsedIndex).every((item, index) => matchesArrayElementAtSameIndex(params.incoming[index], item, params.env));
			const duplicateAuthoredMatch = params.parsed.some((item, index) => index !== parsedIndex && matchesArrayElementAtSameIndex(params.incoming[parsedIndex], item, params.env));
			const duplicateIncomingMatch = params.incoming.some((item, index) => index !== parsedIndex && matchesArrayElementAtSameIndex(item, parsedItem, params.env));
			if (!(params.incoming.length === params.parsed.length || precedingItemsRemainAligned) || duplicateAuthoredMatch || duplicateIncomingMatch) throw new EnvRefArrayMutationError();
			addMatch(parsedIndex, parsedIndex);
			continue;
		}
		if (isPlainObject(parsedItem) || Array.isArray(parsedItem)) {
			const isSinglePositionEdit = params.incoming.length === 1 && params.parsed.length === 1;
			const hasSameIndexLiteralIdentity = hasStableSameIndexLiteralShape({
				incoming: params.incoming,
				parsed: params.parsed,
				parsedIndex
			});
			const hasSameIndexNeighbors = hasStableSameIndexNeighbors({
				incoming: params.incoming,
				parsed: params.parsed,
				parsedIndex,
				env: params.env
			});
			if (!isSinglePositionEdit && !hasSameIndexLiteralIdentity && !hasSameIndexNeighbors) throw new EnvRefArrayMutationError();
			addMatch(parsedIndex, parsedIndex);
			continue;
		}
		if (params.incoming.some((item, incomingIndex) => incomingIndex !== parsedIndex && matchesArrayElementAtSameIndex(item, parsedItem, params.env))) throw new EnvRefArrayMutationError();
		if (parsedIndex < params.incoming.length) addMatch(parsedIndex, parsedIndex);
	}
	return matches;
}
function matchAuthoredEscapedTemplateArrayItems(params) {
	const escapedTemplateIndexes = params.parsed.flatMap((item, index) => containsAuthoredEscapedEnvTemplate(item) && !containsAuthoredUnescapedEnvTemplate(item) ? [index] : []);
	if (params.incoming.length === params.parsed.length && params.incoming.every((item, index) => matchesArrayElementAtSameIndex(item, params.parsed[index], params.env))) return new Map(escapedTemplateIndexes.map((index) => [index, index]));
	const retainedDeletionMatches = matchUniqueRetainedArrayItems(params);
	if (retainedDeletionMatches) return new Map(escapedTemplateIndexes.flatMap((parsedIndex) => {
		const incomingIndex = retainedDeletionMatches.get(parsedIndex);
		if (incomingIndex === void 0) return [];
		if (params.usedIncomingIndexes.has(incomingIndex)) throw new EnvRefArrayMutationError();
		return [[parsedIndex, incomingIndex]];
	}));
	const matches = /* @__PURE__ */ new Map();
	const usedIncomingIndexes = new Set(params.usedIncomingIndexes);
	const addMatch = (parsedIndex, incomingIndex) => {
		if (usedIncomingIndexes.has(incomingIndex)) throw new EnvRefArrayMutationError();
		matches.set(parsedIndex, incomingIndex);
		usedIncomingIndexes.add(incomingIndex);
	};
	for (const parsedIndex of escapedTemplateIndexes) {
		const parsedItem = params.parsed[parsedIndex];
		const stableIdentity = resolveStableArrayIdentityMatch({
			incoming: params.incoming,
			parsed: params.parsed,
			parsedIndex
		});
		if (stableIdentity.kind !== "none") {
			if (stableIdentity.kind === "match") {
				addMatch(parsedIndex, stableIdentity.incomingIndex);
				continue;
			}
		}
		const resolvedItem = resolveEnvVarRefsForComparison(parsedItem, params.env);
		const incomingMatches = params.incoming.flatMap((item, incomingIndex) => !usedIncomingIndexes.has(incomingIndex) && isDeepStrictEqual(item, resolvedItem) ? [incomingIndex] : []);
		const authoredMatches = escapedTemplateIndexes.filter((index) => isDeepStrictEqual(resolveEnvVarRefsForComparison(params.parsed[index], params.env), resolvedItem));
		const authoredRepresentationsAreIdentical = authoredMatches.every((index) => isDeepStrictEqual(params.parsed[index], parsedItem));
		if (incomingMatches.length > 0 && incomingMatches.length <= authoredMatches.length && authoredRepresentationsAreIdentical) {
			addMatch(parsedIndex, expectDefined(incomingMatches.includes(parsedIndex) ? parsedIndex : incomingMatches[0], "env preserve same index match"));
			continue;
		}
		if (incomingMatches.length > 0) throw new EnvRefArrayMutationError();
		if (isPlainObject(parsedItem) || Array.isArray(parsedItem)) {
			const isSinglePositionEdit = params.incoming.length === 1 && params.parsed.length === 1;
			const hasSameIndexLiteralIdentity = hasStableSameIndexLiteralShape({
				incoming: params.incoming,
				parsed: params.parsed,
				parsedIndex
			});
			const hasSameIndexNeighbors = hasStableSameIndexNeighbors({
				incoming: params.incoming,
				parsed: params.parsed,
				parsedIndex,
				env: params.env
			});
			if (stableIdentity.kind === "none" && parsedIndex < params.incoming.length && !usedIncomingIndexes.has(parsedIndex) && (isSinglePositionEdit || hasSameIndexLiteralIdentity || hasSameIndexNeighbors)) {
				addMatch(parsedIndex, parsedIndex);
				continue;
			}
		}
	}
	return matches;
}
/**
* Resolve `${VAR}` references in a single string using the given env.
* Preserves missing references so matching remains aligned with config reads.
*
* Mirrors the substitution semantics of `substituteString` in env-substitution.ts:
* - `${VAR}` → env value (returns null if missing)
* - `$${VAR}` → literal `${VAR}` (escape sequence)
*/
function tryResolveString(template, env) {
	const chunks = [];
	for (let i = 0; i < template.length; i++) {
		if (template[i] === "$") {
			if (template[i + 1] === "$" && template[i + 2] === "{") {
				const start = i + 3;
				const end = template.indexOf("}", start);
				if (end !== -1) {
					const name = template.slice(start, end);
					if (ENV_VAR_NAME_PATTERN.test(name)) {
						chunks.push(`\${${name}}`);
						i = end;
						continue;
					}
				}
			}
			if (template[i + 1] === "{") {
				const start = i + 2;
				const end = template.indexOf("}", start);
				if (end !== -1) {
					const name = template.slice(start, end);
					if (ENV_VAR_NAME_PATTERN.test(name)) {
						const val = env[name];
						if (val === void 0 || val === "") {
							chunks.push(`\${${name}}`);
							i = end;
							continue;
						}
						chunks.push(val);
						i = end;
						continue;
					}
				}
			}
		}
		chunks.push(template.charAt(i));
	}
	return chunks.join("");
}
function resolveEnvVarRefsForComparison(value, env) {
	if (typeof value === "string") return hasEnvVarRef(value) ? tryResolveString(value, env) : value;
	if (Array.isArray(value)) return value.map((item) => resolveEnvVarRefsForComparison(item, env));
	if (isPlainObject(value)) return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, resolveEnvVarRefsForComparison(item, env)]));
	return value;
}
/**
* Deep-walk the incoming config and restore `${VAR}` references from the
* pre-substitution parsed config wherever the resolved value matches.
*
* @param incoming - The resolved config about to be written
* @param parsed - The pre-substitution parsed config (from the current file on disk)
* @param env - Environment variables for verification
* @returns A new config object with env var references restored where appropriate
*/
function restoreEnvVarRefs(incoming, parsed, env = process.env) {
	if (parsed === null || parsed === void 0) return incoming;
	if (typeof incoming === "string" && typeof parsed === "string") {
		if (hasEnvVarRef(parsed)) {
			if (tryResolveString(parsed, env) === incoming) return parsed;
		}
		return incoming;
	}
	if (Array.isArray(incoming) && Array.isArray(parsed)) {
		if (!containsAuthoredUnescapedEnvTemplate(parsed) && !containsAuthoredEscapedEnvTemplate(parsed)) return incoming.map((item, index) => index < parsed.length ? restoreEnvVarRefs(item, parsed[index], env) : item);
		const unescapedMatches = matchAuthoredTemplateArrayItems({
			incoming,
			parsed,
			env
		});
		const escapedMatches = matchAuthoredEscapedTemplateArrayItems({
			incoming,
			parsed,
			env,
			usedIncomingIndexes: new Set(unescapedMatches.values())
		});
		const matches = new Map([...unescapedMatches, ...escapedMatches]);
		const next = [...incoming];
		const matchedIncomingIndexes = new Set(matches.values());
		for (const [parsedIndex, incomingIndex] of matches) next[incomingIndex] = restoreEnvVarRefs(incoming[incomingIndex], parsed[parsedIndex], env);
		for (let index = 0; index < incoming.length && index < parsed.length; index += 1) if (!matchedIncomingIndexes.has(index) && !containsAuthoredUnescapedEnvTemplate(parsed[index]) && !containsAuthoredEscapedEnvTemplate(parsed[index])) next[index] = restoreEnvVarRefs(incoming[index], parsed[index], env);
		const matchedParsedIndexByIncoming = new Map([...matches].map(([parsedIndex, incomingIndex]) => [incomingIndex, parsedIndex]));
		for (const [escapedParsedIndex, escapedParsedItem] of parsed.entries()) {
			if (!containsAuthoredEscapedEnvTemplate(escapedParsedItem)) continue;
			const matchedIncomingIndex = matches.get(escapedParsedIndex);
			if (matchedIncomingIndex !== void 0 && preservesAuthoredEscapedEnvRefs(next[matchedIncomingIndex], escapedParsedItem)) continue;
			if (next.some((item, incomingIndex) => {
				const matchedParsedIndex = matchedParsedIndexByIncoming.get(incomingIndex);
				return containsUnaccountedActiveEscapedEnvRef(item, escapedParsedItem, incoming[incomingIndex], matchedParsedIndex === void 0 ? void 0 : parsed[matchedParsedIndex], env);
			})) throw new EnvRefArrayMutationError();
		}
		return next;
	}
	if (isPlainObject(incoming) && isPlainObject(parsed)) {
		const result = {};
		for (const [key, value] of Object.entries(incoming)) if (Object.hasOwn(parsed, key)) result[key] = restoreEnvVarRefs(value, parsed[key], env);
		else result[key] = value;
		return result;
	}
	return incoming;
}
function parentPath(value) {
	if (!value) return "";
	if (value.endsWith("]")) {
		const index = value.lastIndexOf("[");
		return index > 0 ? value.slice(0, index) : "";
	}
	const index = value.lastIndexOf(".");
	return index >= 0 ? value.slice(0, index) : "";
}
function isPathChanged(path, changedPaths) {
	if (changedPaths.has(path)) return true;
	let current = parentPath(path);
	while (current) {
		if (changedPaths.has(current)) return true;
		current = parentPath(current);
	}
	return changedPaths.has("");
}
function restoreEnvRefsFromMap(value, path, envRefMap, changedPaths, identityRestoredPaths = /* @__PURE__ */ new Set()) {
	if (typeof value === "string") {
		if (identityRestoredPaths.has(path)) return value;
		if (!isPathChanged(path, changedPaths)) {
			const original = envRefMap.get(path);
			if (original !== void 0) return original;
		}
		return value;
	}
	if (Array.isArray(value)) {
		let changed = false;
		const next = value.map((item, index) => {
			const updated = restoreEnvRefsFromMap(item, `${path}[${index}]`, envRefMap, changedPaths, identityRestoredPaths);
			if (updated !== item) changed = true;
			return updated;
		});
		return changed ? next : value;
	}
	if (isRecord(value)) {
		let changed = false;
		const next = {};
		for (const [key, child] of Object.entries(value)) {
			const updated = restoreEnvRefsFromMap(child, path ? `${path}.${key}` : key, envRefMap, changedPaths, identityRestoredPaths);
			if (updated !== child) changed = true;
			next[key] = updated;
		}
		return changed ? next : value;
	}
	return value;
}
function resolveWriteEnvSnapshotForPath(params) {
	if (params.expectedConfigPath === void 0 || params.expectedConfigPath === params.actualConfigPath) return params.envSnapshotForRestore;
}
//#endregion
//#region src/config/io.auth-inheritance-owner.ts
const AUTH_INHERITANCE_PATH = "agents.defaults.authInheritance";
function explicitlySetsAuthInheritance(explicitSetPaths) {
	return Boolean(explicitSetPaths?.some((writePath) => {
		const path = writePath.join(".");
		return path === AUTH_INHERITANCE_PATH || path.startsWith(`${AUTH_INHERITANCE_PATH}.`);
	}));
}
function prepareAuthInheritanceOwnerForWrite(params) {
	if (!params.writesOwnershipTopology || explicitlySetsAuthInheritance(params.explicitSetPaths)) return {
		config: params.targetConfig,
		insertedPaths: []
	};
	assertSafeLegacyInheritedAuthDirTransition(params.currentConfig, params.targetConfig, params.env);
	const config = pinLegacyInheritedAuthOwnerForRosterTransition(params.currentConfig, params.targetConfig);
	return {
		config,
		insertedPaths: config === params.targetConfig ? [] : [[
			"agents",
			"defaults",
			"authInheritance",
			"agentId"
		]]
	};
}
//#endregion
//#region src/config/io.ownership-write-guard.ts
function assertAutomaticBindingsWriteAllowed(params) {
	if (params.bindingsIncludeOwned && params.ownershipPaths.some((ownershipPath) => ownershipPath[0] === "bindings")) throw Object.assign(/* @__PURE__ */ new Error("Automatic agent ownership materialization cannot append to $include-owned bindings. Add the required channel-wide binding to the include, then retry."), { code: "CONFIG_WRITE_REJECTED" });
}
//#endregion
//#region src/config/io.session-store-owner.ts
const SESSION_STORE_OWNER_PATH = [
	"agents",
	"defaults",
	"sessionStore",
	"agentId"
];
const SESSION_STORE_CONFIG_PATH = SESSION_STORE_OWNER_PATH.slice(0, -1);
function prepareSessionStoreOwnershipForWrite(params) {
	const sameFixedSessionStore = isSameFixedSessionStoreConfig(params.currentStore, params.targetConfig.session?.store, params.env);
	const previousOwner = params.currentConfig.agents?.defaults?.sessionStore?.agentId;
	const explicitSessionStore = getConfigValueAtPath(params.explicitSetValueSource ?? params.targetConfig, SESSION_STORE_CONFIG_PATH);
	const suppliesDestinationOwner = Boolean(isRecord(explicitSessionStore) && typeof explicitSessionStore.agentId === "string" && params.explicitSetPaths?.some((entry) => isDeepStrictEqual(entry, SESSION_STORE_CONFIG_PATH) || isDeepStrictEqual(entry, SESSION_STORE_OWNER_PATH)));
	if (sameFixedSessionStore || !previousOwner || suppliesDestinationOwner) return {
		config: params.targetConfig,
		sameFixedSessionStore
	};
	const agents = structuredClone(params.targetConfig.agents ?? {});
	unsetConfigValueAtPath(agents, SESSION_STORE_OWNER_PATH.slice(1));
	return {
		config: {
			...params.targetConfig,
			agents
		},
		sameFixedSessionStore
	};
}
//#endregion
//#region src/config/io.types.ts
const configWritePostCommitRollback = Symbol("configWritePostCommitRollback");
var ConfigRuntimeRefreshError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "ConfigRuntimeRefreshError";
	}
};
//#endregion
//#region src/config/io.write-errors.ts
const OPEN_DM_POLICY_ALLOW_FROM_RE = /^(?<policyPath>[a-z0-9_.-]+)\s*=\s*"open"\s+requires\s+(?<allowPath>[a-z0-9_.-]+)(?:\s+\(or\s+[a-z0-9_.-]+\))?\s+to include "\*"$/i;
function formatConfigValidationFailure(pathLabel, issueMessage) {
	const match = issueMessage.match(OPEN_DM_POLICY_ALLOW_FROM_RE);
	const policyPath = match?.groups?.policyPath?.trim();
	const allowPath = match?.groups?.allowPath?.trim();
	if (!policyPath || !allowPath) return `Config validation failed: ${pathLabel}: ${issueMessage}`;
	return [
		`Config validation failed: ${pathLabel}`,
		"",
		`Configuration mismatch: ${policyPath} is "open", but ${allowPath} does not include "*".`,
		"",
		"Fix with:",
		`  openclaw config set ${allowPath} '["*"]'`,
		"",
		"Or switch policy:",
		`  openclaw config set ${policyPath} "pairing"`
	].join("\n");
}
//#endregion
//#region src/config/io.write-prepare.ts
const AGENT_ROSTER_PATHS = [["agents", "entries"], ["agents", "list"]];
var DuplicateAgentRosterIdError = class extends Error {
	constructor(agentId) {
		super(`Config write cannot canonicalize duplicate normalized agent id "${agentId}".`);
		this.name = "DuplicateAgentRosterIdError";
	}
};
function assertUniqueNormalizedLegacyRosterIds(value) {
	const normalizedIds = /* @__PURE__ */ new Set();
	for (const entry of value) {
		if (!isRecord(entry) || typeof entry.id !== "string") continue;
		const agentId = normalizeAgentId(entry.id);
		if (normalizedIds.has(agentId)) throw new DuplicateAgentRosterIdError(agentId);
		normalizedIds.add(agentId);
	}
}
function cloneUnknown(value) {
	return structuredClone(value);
}
function projectSourceOntoRuntimeShape(source, runtime) {
	if (!isRecord(source) || !isRecord(runtime)) return cloneUnknown(source);
	const next = {};
	for (const [key, sourceValue] of Object.entries(source)) {
		if (!(key in runtime)) {
			next[key] = cloneUnknown(sourceValue);
			continue;
		}
		next[key] = projectSourceOntoRuntimeShape(sourceValue, runtime[key]);
	}
	return next;
}
function hasOwnValidIncludeDirective(value) {
	if (!isRecord(value) || !Object.hasOwn(value, "$include")) return false;
	const includeValue = value.$include;
	return typeof includeValue === "string" || Array.isArray(includeValue) && includeValue.every((entry) => typeof entry === "string");
}
function collectIncludeOwnedPaths(value, path = []) {
	if (Array.isArray(value)) return value.flatMap((child, index) => collectIncludeOwnedPaths(child, [...path, String(index)]));
	if (!isRecord(value)) return [];
	if (hasOwnValidIncludeDirective(value)) return [path];
	return Object.entries(value).flatMap(([key, child]) => collectIncludeOwnedPaths(child, [...path, key]));
}
function collectMutableSiblingPathsAtInclude(rootAuthoredConfig, includePath) {
	const includeValue = getPathValue(rootAuthoredConfig, includePath);
	if (!hasOwnValidIncludeDirective(includeValue)) return [];
	return Object.keys(includeValue).flatMap((key) => key === "$include" || isBlockedObjectKey(key) ? [] : [[...includePath, key]]);
}
function isMutableSiblingPathAtInclude(rootAuthoredConfig, includePath, path) {
	return collectMutableSiblingPathsAtInclude(rootAuthoredConfig, includePath).some((siblingPath) => {
		if (!pathStartsWith(path, siblingPath)) return false;
		return !collectIncludeOwnedPaths(getPathValue(rootAuthoredConfig, siblingPath), siblingPath).some((nestedIncludePath) => pathStartsWith(path, nestedIncludePath) || pathStartsWith(nestedIncludePath, path));
	});
}
function formatConfigPath(path) {
	return path.length > 0 ? path.join(".") : "<root>";
}
function findContainingArrayPath(root, path) {
	let current = root;
	const currentPath = [];
	for (const segment of path) {
		if (Array.isArray(current)) return currentPath;
		if (!isRecord(current)) return;
		current = current[segment];
		currentPath.push(segment);
	}
}
function hasChangedEquivalentArraySibling(value, nextValue, index) {
	if (!Array.isArray(value) || !Array.isArray(nextValue) || index >= value.length) return false;
	return value.some((item, itemIndex) => itemIndex !== index && isDeepStrictEqual(item, value[index]) && !isDeepStrictEqual(nextValue[itemIndex], item));
}
function hasNewEquivalentArraySibling(value, nextValue, index) {
	if (!Array.isArray(value) || !Array.isArray(nextValue) || index >= value.length) return false;
	const includedValue = value[index];
	if (!isDeepStrictEqual(nextValue[index], includedValue)) return false;
	return nextValue.some((item, itemIndex) => itemIndex !== index && isDeepStrictEqual(item, includedValue) && !isDeepStrictEqual(value[itemIndex], includedValue));
}
function getPathValue(value, path) {
	let current = value;
	for (const segment of path) {
		if (Array.isArray(current)) {
			const index = parseArrayIndexPathSegment(segment);
			if (index === void 0 || index >= current.length) return;
			current = current[index];
			continue;
		}
		if (!isRecord(current)) return;
		current = current[segment];
	}
	return current;
}
function setPathValue(value, path, nextValue) {
	if (path.length === 0) return cloneUnknown(nextValue);
	const head = expectDefined(path[0], "config path head");
	const tail = path.slice(1);
	if (Array.isArray(value)) {
		const index = parseArrayIndexPathSegment(head);
		if (index === void 0 || index >= value.length) return value;
		const next = [...value];
		next[index] = setPathValue(value[index], tail, nextValue);
		return next;
	}
	if (!isRecord(value)) return value;
	return {
		...value,
		[head]: setPathValue(value[head], tail, nextValue)
	};
}
function pathStartsWith(path, prefix) {
	return prefix.length <= path.length && prefix.every((segment, index) => path[index] === segment);
}
function pathOverlapsAny(path, candidates) {
	return Boolean(candidates?.some((candidate) => pathStartsWith(path, candidate) || pathStartsWith(candidate, path)));
}
function isIncludeOwnedPath(rootAuthoredConfig, path) {
	return collectIncludeOwnedPaths(rootAuthoredConfig).some((includePath) => {
		if (!(pathStartsWith(path, includePath) || pathStartsWith(includePath, path))) return false;
		return !isMutableSiblingPathAtInclude(rootAuthoredConfig, includePath, path);
	});
}
function findOverlappingIncludeOwnedPath(rootAuthoredConfig, path) {
	return collectIncludeOwnedPaths(rootAuthoredConfig).find((includePath) => {
		if (!(pathStartsWith(path, includePath) || pathStartsWith(includePath, path))) return false;
		return !isMutableSiblingPathAtInclude(rootAuthoredConfig, includePath, path);
	});
}
function setPathValueCreatingParents(value, path, nextValue) {
	if (path.length === 0) return cloneUnknown(nextValue);
	const head = expectDefined(path[0], "config path head");
	const tail = path.slice(1);
	if (Array.isArray(value) || isNumericPathSegment(head)) {
		const index = parseArrayIndexPathSegment(head);
		if (index === void 0) return value;
		const next = Array.isArray(value) ? [...value] : [];
		next[index] = setPathValueCreatingParents(next[index], tail, nextValue);
		return next;
	}
	const record = isRecord(value) ? value : {};
	return {
		...record,
		[head]: setPathValueCreatingParents(record[head], tail, nextValue)
	};
}
function deletePathValue(value, path) {
	if (path.length === 0) return value;
	const head = expectDefined(path[0], "config path head");
	const tail = path.slice(1);
	if (Array.isArray(value)) {
		const index = parseArrayIndexPathSegment(head);
		if (index === void 0 || index >= value.length || tail.length === 0) return value;
		const next = [...value];
		next[index] = deletePathValue(value[index], tail);
		return next;
	}
	if (!isRecord(value) || !Object.hasOwn(value, head)) return value;
	const next = { ...value };
	if (tail.length === 0) {
		delete next[head];
		return next;
	}
	next[head] = deletePathValue(value[head], tail);
	return next;
}
function normalizeTouchedAgentModelMapEntries(params) {
	const touchedMaps = /* @__PURE__ */ new Map();
	const addKey = (path, modelId) => {
		const serialized = path.join("\0");
		const target = touchedMaps.get(serialized) ?? {
			path,
			canonicalKeys: /* @__PURE__ */ new Set()
		};
		target.canonicalKeys.add(normalizeAgentModelRefForConfig(modelId));
		touchedMaps.set(serialized, target);
	};
	const defaultsModelsPatch = getPathValue(params.patch, [
		"agents",
		"defaults",
		"models"
	]);
	if (isRecord(defaultsModelsPatch)) for (const modelId of Object.keys(defaultsModelsPatch)) addKey([
		"agents",
		"defaults",
		"models"
	], modelId);
	const entriesPatch = getPathValue(params.patch, ["agents", "entries"]);
	if (isRecord(entriesPatch)) {
		for (const [agentId, entryPatch] of Object.entries(entriesPatch)) if (isRecord(entryPatch) && isRecord(entryPatch.models)) for (const modelId of Object.keys(entryPatch.models)) addKey([
			"agents",
			"entries",
			agentId,
			"models"
		], modelId);
	}
	const explicitModelMaps = [[
		"agents",
		"defaults",
		"models"
	]];
	const explicitEntries = getPathValue(params.explicitSetValueSource, ["agents", "entries"]);
	if (isRecord(explicitEntries)) for (const agentId of Object.keys(explicitEntries)) explicitModelMaps.push([
		"agents",
		"entries",
		agentId,
		"models"
	]);
	for (const modelMapPath of explicitModelMaps) for (const explicitPath of params.explicitSetPaths ?? []) {
		if (pathStartsWith(explicitPath, modelMapPath) && explicitPath.length > modelMapPath.length) {
			const modelId = explicitPath[modelMapPath.length];
			if (modelId) addKey(modelMapPath, modelId);
			continue;
		}
		if (!pathStartsWith(explicitPath, modelMapPath) && !pathStartsWith(modelMapPath, explicitPath)) continue;
		const explicitModels = getPathValue(params.explicitSetValueSource, modelMapPath);
		if (!isRecord(explicitModels)) continue;
		for (const modelId of Object.keys(explicitModels)) addKey(modelMapPath, modelId);
	}
	let next = params.projectedSource;
	for (const { path, canonicalKeys } of touchedMaps.values()) {
		const models = getPathValue(next, path);
		if (!isRecord(models)) continue;
		const touchedEntries = [];
		const untouchedEntries = [];
		let hasRetiredTouchedKey = false;
		for (const [modelId, entry] of Object.entries(models)) {
			const normalizedModelId = normalizeAgentModelRefForConfig(modelId);
			if (!canonicalKeys.has(normalizedModelId)) {
				untouchedEntries.push([modelId, entry]);
				continue;
			}
			touchedEntries.push([modelId, entry]);
			hasRetiredTouchedKey ||= normalizedModelId !== modelId;
		}
		if (hasRetiredTouchedKey) {
			const normalizedTouchedEntries = normalizeAgentModelMapForConfig(Object.fromEntries(touchedEntries));
			next = setPathValue(next, path, Object.fromEntries([...untouchedEntries, ...Object.entries(normalizedTouchedEntries)]));
		}
	}
	return next;
}
function preserveSourceValueAtPath(params) {
	if (pathOverlapsAny(params.path, params.unsetPaths)) return params.persistedCandidate;
	if (isIncludeOwnedPath(params.rootAuthoredConfig, params.path)) return params.persistedCandidate;
	if (getPathValue(params.nextConfig, params.path) !== void 0) return params.persistedCandidate;
	const sourceValue = params.sourceValue ?? getPathValue(params.sourceConfig, params.path);
	if (sourceValue === void 0 || getPathValue(params.persistedCandidate, params.path) !== void 0) return params.persistedCandidate;
	return setPathValueCreatingParents(params.persistedCandidate, params.path, sourceValue);
}
function preserveAuthoredAgentParams(params) {
	const defaults = getPathValue(params.sourceConfig, ["agents", "defaults"]);
	if (!isRecord(defaults)) return params.persistedCandidate;
	let next = params.persistedCandidate;
	if (Object.hasOwn(defaults, "params")) next = preserveSourceValueAtPath({
		...params,
		persistedCandidate: next,
		path: [
			"agents",
			"defaults",
			"params"
		],
		sourceValue: defaults.params
	});
	const models = defaults.models;
	if (!isRecord(models)) return next;
	const nextModels = getPathValue(params.nextConfig, [
		"agents",
		"defaults",
		"models"
	]);
	for (const [modelId, modelEntry] of Object.entries(models)) {
		if (!isRecord(modelEntry) || !Object.hasOwn(modelEntry, "params")) continue;
		const modelPath = [
			"agents",
			"defaults",
			"models",
			normalizeAgentModelRefForConfig(modelId) || modelId
		];
		const normalizedModelId = modelPath.at(-1);
		if (isRecord(nextModels) && normalizedModelId && !Object.hasOwn(nextModels, normalizedModelId)) continue;
		const paramsPath = [...modelPath, "params"];
		if (modelPath.at(-1) !== modelId) next = deletePathValue(next, [
			"agents",
			"defaults",
			"models",
			modelId
		]);
		if (getPathValue(next, modelPath) === void 0) {
			next = preserveSourceValueAtPath({
				...params,
				persistedCandidate: next,
				path: modelPath,
				sourceValue: modelEntry
			});
			continue;
		}
		next = preserveSourceValueAtPath({
			...params,
			persistedCandidate: next,
			path: paramsPath,
			sourceValue: modelEntry.params
		});
	}
	return next;
}
function projectRootAuthoredIncludeSibling(params) {
	if (params.nextPresent && params.baselinePresent && isDeepStrictEqual(params.next, params.baseline)) return {
		ok: true,
		present: true,
		value: cloneUnknown(params.authored)
	};
	if (!params.nextPresent) return collectIncludeOwnedPaths(params.authored).length > 0 ? { ok: false } : {
		ok: true,
		present: false
	};
	if (!params.baselinePresent) return {
		ok: true,
		present: true,
		value: cloneUnknown(params.next)
	};
	if (hasOwnValidIncludeDirective(params.authored)) return { ok: false };
	if (Array.isArray(params.authored)) return Array.isArray(params.next) ? { ok: false } : {
		ok: true,
		present: true,
		value: cloneUnknown(params.next)
	};
	if (!isRecord(params.authored)) return {
		ok: true,
		present: true,
		value: cloneUnknown(params.next)
	};
	if (!isRecord(params.next)) return collectIncludeOwnedPaths(params.authored).length > 0 ? { ok: false } : {
		ok: true,
		present: true,
		value: cloneUnknown(params.next)
	};
	if (!isRecord(params.baseline)) return {
		ok: true,
		present: true,
		value: cloneUnknown(params.next)
	};
	const value = cloneUnknown(params.authored);
	const keys = /* @__PURE__ */ new Set([
		...Object.keys(params.authored),
		...Object.keys(params.baseline),
		...Object.keys(params.next)
	]);
	for (const key of keys) {
		if (isBlockedObjectKey(key)) continue;
		const authoredPresent = Object.hasOwn(params.authored, key);
		const baselinePresent = Object.hasOwn(params.baseline, key);
		const nextPresent = Object.hasOwn(params.next, key);
		if (!authoredPresent) {
			if (baselinePresent && nextPresent && isDeepStrictEqual(params.baseline[key], params.next[key])) continue;
			if (!nextPresent) return { ok: false };
			if (baselinePresent && Array.isArray(params.baseline[key]) && Array.isArray(params.next[key])) return { ok: false };
		}
		const projected = projectRootAuthoredIncludeSibling({
			authored: authoredPresent ? params.authored[key] : {},
			baseline: params.baseline[key],
			next: params.next[key],
			baselinePresent,
			nextPresent
		});
		if (!projected.ok) return projected;
		if (projected.present) value[key] = projected.value;
		else delete value[key];
	}
	return {
		ok: true,
		present: true,
		value
	};
}
function preserveUntouchedIncludes(params) {
	let next = params.persistedCandidate;
	for (const includePath of collectIncludeOwnedPaths(params.rootAuthoredConfig)) {
		const containingArrayPath = findContainingArrayPath(params.rootAuthoredConfig, includePath);
		const includeIsArrayEntry = containingArrayPath !== void 0 && includePath.length === containingArrayPath.length + 1;
		const comparisonPath = includeIsArrayEntry ? includePath : containingArrayPath ?? includePath;
		const mutableSiblingPaths = collectMutableSiblingPathsAtInclude(params.rootAuthoredConfig, includePath);
		const relativeMutableSiblingPaths = mutableSiblingPaths.map((path) => path.slice(comparisonPath.length));
		const omitMutableSiblingValues = (value) => relativeMutableSiblingPaths.reduce((current, path) => deletePathValue(current, path), value);
		const nextValue = omitMutableSiblingValues(getPathValue(params.nextConfig, comparisonPath));
		const sourceValue = omitMutableSiblingValues(getPathValue(params.sourceConfig, comparisonPath));
		const runtimeValue = omitMutableSiblingValues(getPathValue(params.runtimeConfig, comparisonPath));
		if (!isDeepStrictEqual(nextValue, sourceValue) && !isDeepStrictEqual(nextValue, runtimeValue)) throw new Error(`Config write would flatten $include-owned config at ${formatConfigPath(includePath)}; edit that include file directly or remove the $include first.`);
		if (includeIsArrayEntry) {
			const index = parseArrayIndexPathSegment(includePath.at(-1) ?? "");
			const nextArray = getPathValue(params.nextConfig, containingArrayPath);
			const sourceArray = getPathValue(params.sourceConfig, containingArrayPath);
			const runtimeArray = getPathValue(params.runtimeConfig, containingArrayPath);
			if (index !== void 0 && (hasChangedEquivalentArraySibling(sourceArray, nextArray, index) || hasChangedEquivalentArraySibling(runtimeArray, nextArray, index) || hasNewEquivalentArraySibling(sourceArray, nextArray, index) || hasNewEquivalentArraySibling(runtimeArray, nextArray, index))) throw new Error(`Config write would flatten $include-owned config at ${formatConfigPath(includePath)}; edit that include file directly or remove the $include first.`);
		}
		let authoredIncludeValue = getPathValue(params.rootAuthoredConfig, includePath);
		for (const siblingPath of mutableSiblingPaths) {
			const relativeSiblingPath = siblingPath.slice(includePath.length);
			const nextPresent = hasPathValue(params.nextConfig, siblingPath);
			const projectAgainst = (baselineConfig) => projectRootAuthoredIncludeSibling({
				authored: getPathValue(params.rootAuthoredConfig, siblingPath),
				baseline: getPathValue(baselineConfig, siblingPath),
				next: getPathValue(params.nextConfig, siblingPath),
				baselinePresent: hasPathValue(baselineConfig, siblingPath),
				nextPresent
			});
			const sourceProjection = projectAgainst(params.sourceConfig);
			const projection = sourceProjection.ok ? sourceProjection : projectAgainst(params.runtimeConfig);
			if (!projection.ok) throw new Error(`Config write would flatten $include-owned config at ${formatConfigPath(includePath)}; edit that include file directly or remove the $include first.`);
			authoredIncludeValue = projection.present ? setPathValue(authoredIncludeValue, relativeSiblingPath, projection.value) : deletePathValue(authoredIncludeValue, relativeSiblingPath);
		}
		next = setPathValue(next, includePath, authoredIncludeValue);
	}
	return next;
}
function preserveIncludeOwnedConfigForWrite(params) {
	return preserveUntouchedIncludes({
		...params,
		persistedCandidate: params.nextConfig
	});
}
function hasPathValue(value, path) {
	if (path.length === 0) return true;
	const head = expectDefined(path[0], "config path head");
	const tail = path.slice(1);
	if (Array.isArray(value)) {
		const index = parseArrayIndexPathSegment(head);
		if (index === void 0 || index >= value.length) return false;
		return tail.length === 0 || hasPathValue(value[index], tail);
	}
	if (!isRecord(value)) return false;
	if (isBlockedObjectKey(head) || !Object.hasOwn(value, head)) return false;
	return tail.length === 0 || hasPathValue(value[head], tail);
}
function mergeMissingExplicitValues(currentValue, explicitValue) {
	if (!isRecord(currentValue) || !isRecord(explicitValue)) {
		if (!Array.isArray(currentValue) || !Array.isArray(explicitValue)) return {
			changed: false,
			value: currentValue
		};
		let changed = false;
		const next = [...currentValue];
		for (const [key, childExplicitValue] of Object.entries(explicitValue)) {
			const index = parseArrayIndexPathSegment(key);
			if (index === void 0) continue;
			if (index >= next.length || next[index] === void 0) {
				next[index] = cloneUnknown(childExplicitValue);
				changed = true;
				continue;
			}
			const childMerged = mergeMissingExplicitValues(next[index], childExplicitValue);
			if (childMerged.changed) {
				next[index] = childMerged.value;
				changed = true;
			}
		}
		return {
			changed,
			value: changed ? next : currentValue
		};
	}
	let changed = false;
	const next = { ...currentValue };
	for (const [key, childExplicitValue] of Object.entries(explicitValue)) {
		if (isBlockedObjectKey(key)) continue;
		if (!Object.hasOwn(next, key)) {
			next[key] = cloneUnknown(childExplicitValue);
			changed = true;
			continue;
		}
		const childMerged = mergeMissingExplicitValues(next[key], childExplicitValue);
		if (childMerged.changed) {
			next[key] = childMerged.value;
			changed = true;
		}
	}
	return {
		changed,
		value: changed ? next : currentValue
	};
}
function injectExplicitlySetPaths(params) {
	if (!params.explicitSetPaths || params.explicitSetPaths.length === 0) return params.persistedCandidate;
	let next = params.persistedCandidate;
	for (const path of params.explicitSetPaths) {
		if (path.length === 0 || path.some(isBlockedObjectKey)) continue;
		const includeOwnedPath = params.rootAuthoredConfig ? findOverlappingIncludeOwnedPath(params.rootAuthoredConfig, [...path]) : void 0;
		const preserveDescendantInclude = includeOwnedPath && params.preserveDescendantIncludes === true && includeOwnedPath.length > path.length && pathStartsWith(includeOwnedPath, path);
		const allowIncludeAncestorOverride = includeOwnedPath !== void 0 && includeOwnedPath.length < path.length && pathStartsWith(path, includeOwnedPath) && params.allowIncludeAncestorExplicitSetPaths === true;
		if (includeOwnedPath && !preserveDescendantInclude && !allowIncludeAncestorOverride) throw new Error(`Config write would flatten $include-owned config at ${formatConfigPath(includeOwnedPath)}; edit that include file directly or remove the $include first.`);
		const nextValue = getPathValue(params.valueSource, [...path]);
		if (nextValue === void 0) continue;
		if (!hasPathValue(next, path)) {
			next = setPathValueCreatingParents(next, [...path], nextValue);
			continue;
		}
		const merged = mergeMissingExplicitValues(getPathValue(next, [...path]), nextValue);
		if (merged.changed) next = setPathValue(next, [...path], merged.value);
	}
	return next;
}
function pathTouchesAgentRoster(path) {
	return AGENT_ROSTER_PATHS.some((rosterPath) => pathStartsWith(path, rosterPath) || pathStartsWith(rosterPath, path));
}
function pathTargetsAgentRoster(path) {
	return AGENT_ROSTER_PATHS.some((rosterPath) => pathStartsWith(path, rosterPath));
}
function canCanonicalizeAgentRoster(value) {
	const roster = readAgentRosterProperty(value);
	if (!roster) return false;
	if (roster.kind === "list") {
		if (!Array.isArray(roster.value) || !roster.value.every((entry) => isRecord(entry) && typeof entry.id === "string")) return false;
		assertUniqueNormalizedLegacyRosterIds(roster.value);
		return true;
	}
	return isRecord(roster.value) && Object.values(roster.value).every(isRecord);
}
function shouldPersistCanonicalAgentRoster(params) {
	if (!canCanonicalizeAgentRoster(params.nextConfig)) return false;
	if (params.explicitSetPaths?.some(pathTouchesAgentRoster) || params.unsetPaths?.some(pathTouchesAgentRoster)) return true;
	const runtimeRoster = toAgentEntriesRecord(listAgentEntries(params.runtimeConfig));
	const sourceRoster = toAgentEntriesRecord(listAgentEntries(params.sourceConfig));
	const nextRoster = toAgentEntriesRecord(listAgentEntries(params.nextConfig));
	return !isDeepStrictEqual(runtimeRoster, nextRoster) && !isDeepStrictEqual(sourceRoster, nextRoster);
}
function assertCanonicalAgentRosterRetainsEntries(params) {
	const allowedRemovals = new Set((params.allowedRemovals ?? []).map((agentId) => normalizeAgentId(agentId)));
	const canonicalIds = new Set(listAgentEntries(params.canonicalConfig).map((entry) => normalizeAgentId(entry.id)));
	const droppedIds = listAgentEntries(params.currentConfig).filter((entry) => {
		const agentId = normalizeAgentId(entry.id);
		return !canonicalIds.has(agentId) && !allowedRemovals.has(agentId);
	}).map((entry) => entry.id).toSorted();
	if (droppedIds.length === 0) return;
	throw new Error(`Config write would drop agent roster entries without an explicit deletion: ${droppedIds.join(", ")}.`);
}
function containsAuthoredRosterReference(value) {
	if (typeof value === "string") return value.includes("${");
	if (Array.isArray(value)) return value.some(containsAuthoredRosterReference);
	if (!isRecord(value)) return false;
	if (typeof value.source === "string" && typeof value.id === "string") return true;
	return Object.values(value).some(containsAuthoredRosterReference);
}
function projectAuthoredRosterValue(params) {
	if (!params.nextPresent) return { present: false };
	const explicitlySet = params.explicitPaths.some((path) => pathStartsWith(params.path, path));
	if (isRecord(params.next)) {
		const authored = isRecord(params.authored) ? params.authored : {};
		const explicit = isRecord(params.explicit) ? params.explicit : {};
		const runtime = isRecord(params.runtime) ? params.runtime : {};
		const source = isRecord(params.source) ? params.source : {};
		const value = {};
		for (const [key, nextValue] of Object.entries(params.next)) {
			if (isBlockedObjectKey(key)) continue;
			const projected = projectAuthoredRosterValue({
				authored: authored[key],
				authoredPresent: Object.hasOwn(authored, key),
				explicit: explicit[key],
				explicitPresent: Object.hasOwn(explicit, key),
				explicitPaths: params.explicitPaths,
				path: [...params.path, key],
				runtime: runtime[key],
				runtimePresent: Object.hasOwn(runtime, key),
				source: source[key],
				sourcePresent: Object.hasOwn(source, key),
				next: nextValue,
				nextPresent: true
			});
			if (projected.present) value[key] = projected.value;
		}
		return {
			present: true,
			value
		};
	}
	if (Array.isArray(params.next)) {
		if (explicitlySet && params.explicitPresent && Array.isArray(params.explicit)) return {
			present: true,
			value: cloneUnknown(params.explicit)
		};
		const authored = Array.isArray(params.authored) ? params.authored : [];
		const explicit = Array.isArray(params.explicit) ? params.explicit : [];
		const runtime = Array.isArray(params.runtime) ? params.runtime : [];
		const source = Array.isArray(params.source) ? params.source : [];
		const usedRuntimeIndexes = /* @__PURE__ */ new Set();
		const usedSourceIndexes = /* @__PURE__ */ new Set();
		const findMatchingIndex = (values, used, nextValue, preferredIndex) => {
			if (preferredIndex < values.length && !used.has(preferredIndex) && isDeepStrictEqual(values[preferredIndex], nextValue)) return preferredIndex;
			const index = values.findIndex((value, candidate) => !used.has(candidate) && isDeepStrictEqual(value, nextValue));
			return index >= 0 ? index : void 0;
		};
		return {
			present: true,
			value: params.next.map((nextValue, index) => {
				const runtimeIndex = findMatchingIndex(runtime, usedRuntimeIndexes, nextValue, index);
				if (runtimeIndex !== void 0) usedRuntimeIndexes.add(runtimeIndex);
				const sourceIndex = findMatchingIndex(source, usedSourceIndexes, nextValue, index);
				if (sourceIndex !== void 0) usedSourceIndexes.add(sourceIndex);
				const fallbackIndexAvailable = !usedRuntimeIndexes.has(index) && !usedSourceIndexes.has(index);
				const authoredIndex = runtimeIndex ?? sourceIndex ?? (fallbackIndexAvailable ? index : void 0);
				const projected = projectAuthoredRosterValue({
					authored: authoredIndex === void 0 ? void 0 : authored[authoredIndex],
					authoredPresent: authoredIndex !== void 0 && authoredIndex < authored.length,
					explicit: explicit[index],
					explicitPresent: index < explicit.length,
					explicitPaths: params.explicitPaths,
					path: [...params.path, String(index)],
					runtime: runtimeIndex === void 0 ? fallbackIndexAvailable ? runtime[index] : void 0 : runtime[runtimeIndex],
					runtimePresent: runtimeIndex !== void 0 || fallbackIndexAvailable && index < runtime.length,
					source: sourceIndex === void 0 ? fallbackIndexAvailable ? source[index] : void 0 : source[sourceIndex],
					sourcePresent: sourceIndex !== void 0 || fallbackIndexAvailable && index < source.length,
					next: nextValue,
					nextPresent: true
				});
				return projected.present ? projected.value : nextValue;
			})
		};
	}
	if (explicitlySet && params.explicitPresent) return {
		present: true,
		value: cloneUnknown(params.explicit)
	};
	const unchangedFromRuntime = params.runtimePresent && isDeepStrictEqual(params.runtime, params.next);
	const unchangedFromSource = params.sourcePresent && isDeepStrictEqual(params.source, params.next);
	return {
		present: true,
		value: params.authoredPresent && (unchangedFromRuntime || unchangedFromSource) ? cloneUnknown(params.authored) : cloneUnknown(params.next)
	};
}
function canonicalizeAgentRosterForExplicitWrite(params) {
	const authoredRoster = readAgentRosterProperty(params.rootAuthoredConfig);
	const preMigrationRoster = readAgentRosterProperty(params.sourceConfigBeforeMigrations);
	const resolvedLegacyList = preMigrationRoster?.kind === "list" && Array.isArray(preMigrationRoster.value) ? preMigrationRoster.value : void 0;
	const authoredEntries = authoredRoster?.kind === "list" && Array.isArray(authoredRoster.value) ? Object.fromEntries(authoredRoster.value.flatMap((entry, index) => {
		if (!isRecord(entry)) return [];
		const resolvedEntry = resolvedLegacyList?.[index];
		const resolvedId = isRecord(resolvedEntry) ? resolvedEntry.id : void 0;
		const id = typeof resolvedId === "string" ? resolvedId : entry.id;
		if (typeof id !== "string") return [];
		const { id: _authoredId, ...config } = entry;
		return [[id, config]];
	})) : toAgentEntriesRecord(listAgentEntries(params.rootAuthoredConfig));
	const runtimeEntries = toAgentEntriesRecord(listAgentEntries(params.runtimeConfig));
	const sourceEntries = toAgentEntriesRecord(listAgentEntries(params.sourceConfig));
	const nextEntries = toAgentEntriesRecord(listAgentEntries(params.nextConfig));
	const explicitRoster = readAgentRosterProperty(params.valueSource);
	const renamedLegacyIndexes = new Set((params.explicitSetPaths ?? []).flatMap((path) => {
		if (path[0] !== "agents" || path[1] !== "list" || path.length !== 4 || path[3] !== "id") return [];
		const index = parseArrayIndexPathSegment(path[2] ?? "");
		return index === void 0 ? [] : [index];
	}));
	const structurallyExplicitLegacyIndexes = new Set(renamedLegacyIndexes);
	for (const path of params.explicitSetPaths ?? []) {
		if (path[0] !== "agents" || path[1] !== "list") continue;
		if (path.length === 2 && explicitRoster?.kind === "list" && Array.isArray(explicitRoster.value)) {
			explicitRoster.value.forEach((_entry, index) => structurallyExplicitLegacyIndexes.add(index));
			continue;
		}
		if (path.length === 3) {
			const index = parseArrayIndexPathSegment(path[2] ?? "");
			if (index !== void 0) structurallyExplicitLegacyIndexes.add(index);
		}
	}
	for (const index of renamedLegacyIndexes) {
		const entry = explicitRoster?.kind === "list" && Array.isArray(explicitRoster.value) ? explicitRoster.value[index] : void 0;
		if (isRecord(entry) && typeof entry.id === "string" && entry.id.includes("${")) throw new Error("Config write cannot safely resolve an env-backed renamed agent id; set the resolved literal id or rename the authored entry directly.");
	}
	const resolveExplicitLegacyEntryId = (entry, index) => {
		const explicitId = entry.id;
		if (typeof explicitId !== "string") return;
		if (renamedLegacyIndexes.has(index) || Object.hasOwn(nextEntries, explicitId)) return explicitId;
		if (authoredRoster?.kind === "list" && Array.isArray(authoredRoster.value)) {
			const authoredIndex = authoredRoster.value.findIndex((authoredEntry) => isRecord(authoredEntry) && authoredEntry.id === explicitId);
			const resolvedEntry = authoredIndex < 0 ? void 0 : resolvedLegacyList?.[authoredIndex];
			if (isRecord(resolvedEntry) && typeof resolvedEntry.id === "string") return resolvedEntry.id;
		}
		return explicitId.includes("${") ? void 0 : explicitId;
	};
	if (explicitRoster?.kind === "list" && Array.isArray(explicitRoster.value)) {
		const normalizedIds = /* @__PURE__ */ new Set();
		for (const [index, entry] of explicitRoster.value.entries()) {
			if (!isRecord(entry)) continue;
			const resolvedId = resolveExplicitLegacyEntryId(entry, index);
			if (resolvedId === void 0) continue;
			const agentId = normalizeAgentId(resolvedId);
			if (normalizedIds.has(agentId)) throw new DuplicateAgentRosterIdError(agentId);
			normalizedIds.add(agentId);
		}
	}
	const explicitEntries = explicitRoster?.kind === "list" && Array.isArray(explicitRoster.value) ? Object.fromEntries(explicitRoster.value.flatMap((entry, index) => {
		if (!isRecord(entry)) return [];
		const resolvedEntry = resolvedLegacyList?.[index];
		const resolvedId = isRecord(resolvedEntry) ? resolvedEntry.id : void 0;
		const id = structurallyExplicitLegacyIndexes.has(index) ? resolveExplicitLegacyEntryId(entry, index) : typeof resolvedId === "string" ? resolvedId : entry.id;
		if (typeof id !== "string") {
			if (structurallyExplicitLegacyIndexes.has(index) && typeof entry.id === "string") throw new Error(`Config write cannot safely resolve an explicitly replaced agent list slot for id "${entry.id}"; use a resolved literal id before writing the roster.`);
			return [];
		}
		const { id: _explicitId, ...config } = entry;
		return [[id, config]];
	})) : toAgentEntriesRecord(listAgentEntries(params.valueSource));
	const explicitPaths = (params.explicitSetPaths ?? []).flatMap((path) => {
		if (path[0] !== "agents") return [];
		if (path.length === 1) return [[]];
		if (path[1] === "entries") return [path.slice(2)];
		if (path[1] !== "list") return [];
		if (path.length === 2) return [[]];
		const index = parseArrayIndexPathSegment(path[2] ?? "");
		const authoredEntry = authoredRoster?.kind === "list" && Array.isArray(authoredRoster.value) && index !== void 0 ? authoredRoster.value[index] : void 0;
		const explicitEntry = explicitRoster?.kind === "list" && Array.isArray(explicitRoster.value) && index !== void 0 ? explicitRoster.value[index] : void 0;
		const resolvedEntry = index === void 0 ? void 0 : resolvedLegacyList?.[index];
		const id = index !== void 0 && (renamedLegacyIndexes.has(index) || path.length === 3 && structurallyExplicitLegacyIndexes.has(index)) && isRecord(explicitEntry) ? explicitEntry.id : isRecord(resolvedEntry) && typeof resolvedEntry.id === "string" ? resolvedEntry.id : isRecord(authoredEntry) ? authoredEntry.id : void 0;
		return typeof id === "string" ? [[id, ...path.slice(3)]] : [];
	});
	const entryIdentityByNextId = /* @__PURE__ */ new Map();
	for (const id of Object.keys(nextEntries)) if (Object.hasOwn(runtimeEntries, id) || Object.hasOwn(sourceEntries, id)) entryIdentityByNextId.set(id, id);
	if (authoredRoster?.kind === "list" && Array.isArray(authoredRoster.value) && explicitRoster?.kind === "list" && Array.isArray(explicitRoster.value)) for (const path of params.explicitSetPaths ?? []) {
		if (path[0] !== "agents" || path[1] !== "list" || path.length !== 4 || path[3] !== "id") continue;
		const index = parseArrayIndexPathSegment(path[2] ?? "");
		const authoredEntry = index === void 0 ? void 0 : authoredRoster.value[index];
		const explicitEntry = index === void 0 ? void 0 : explicitRoster.value[index];
		const resolvedEntry = index === void 0 ? void 0 : resolvedLegacyList?.[index];
		const oldId = isRecord(resolvedEntry) ? resolvedEntry.id : isRecord(authoredEntry) ? authoredEntry.id : void 0;
		const nextId = isRecord(explicitEntry) ? explicitEntry.id : void 0;
		if (typeof oldId === "string" && typeof nextId === "string") entryIdentityByNextId.set(nextId, oldId);
	}
	const priorIds = /* @__PURE__ */ new Set([...Object.keys(runtimeEntries), ...Object.keys(sourceEntries)]);
	const removedIds = [...priorIds].filter((id) => !Object.hasOwn(nextEntries, id));
	const addedIds = Object.keys(nextEntries).filter((id) => !priorIds.has(id));
	const claimedPriorIds = new Set(entryIdentityByNextId.values());
	for (const nextId of addedIds) {
		if (entryIdentityByNextId.has(nextId)) continue;
		const candidates = removedIds.filter((oldId) => !claimedPriorIds.has(oldId) && (isDeepStrictEqual(nextEntries[nextId], runtimeEntries[oldId]) || isDeepStrictEqual(nextEntries[nextId], sourceEntries[oldId])));
		if (candidates.length === 1) {
			const oldId = candidates[0];
			entryIdentityByNextId.set(nextId, oldId);
			claimedPriorIds.add(oldId);
		}
	}
	const ambiguousAddedIds = addedIds.filter((id) => !entryIdentityByNextId.has(id));
	const ambiguousRemovedIds = removedIds.filter((id) => !claimedPriorIds.has(id));
	if (ambiguousAddedIds.length > 0 && ambiguousRemovedIds.some((id) => containsAuthoredRosterReference(authoredEntries[id]))) throw new Error("Config write cannot safely match renamed agent entries with authored references; rename agents one at a time.");
	let entries = Object.fromEntries(Object.entries(nextEntries).map(([id, nextEntry]) => {
		const priorId = entryIdentityByNextId.get(id) ?? id;
		const projected = projectAuthoredRosterValue({
			authored: authoredEntries[priorId],
			authoredPresent: Object.hasOwn(authoredEntries, priorId),
			explicit: explicitEntries[id],
			explicitPresent: Object.hasOwn(explicitEntries, id),
			explicitPaths,
			path: [id],
			runtime: runtimeEntries[priorId],
			runtimePresent: Object.hasOwn(runtimeEntries, priorId),
			source: sourceEntries[priorId],
			sourcePresent: Object.hasOwn(sourceEntries, priorId),
			next: nextEntry,
			nextPresent: true
		});
		const value = projected.present ? projected.value : nextEntry;
		if (isRecord(value) && isRecord(nextEntry)) if (Object.hasOwn(nextEntry, "default")) {
			if (!(Object.hasOwn(value, "default") && containsAuthoredRosterReference(value.default) && (Object.hasOwn(runtimeEntries, priorId) && isRecord(runtimeEntries[priorId]) && isDeepStrictEqual(runtimeEntries[priorId].default, nextEntry.default) || Object.hasOwn(sourceEntries, priorId) && isRecord(sourceEntries[priorId]) && isDeepStrictEqual(sourceEntries[priorId].default, nextEntry.default)))) value.default = cloneUnknown(nextEntry.default);
		} else delete value.default;
		return [id, value];
	}));
	if (authoredRoster?.kind === "list" && Array.isArray(authoredRoster.value)) {
		const authoredList = authoredRoster.value;
		const nextIdByPriorId = new Map([...entryIdentityByNextId].map(([nextId, priorId]) => [priorId, nextId]));
		const resolveExplicitLegacyIdCandidate = (index) => {
			if (explicitRoster?.kind !== "list" || !Array.isArray(explicitRoster.value)) return;
			const explicitEntry = explicitRoster.value[index];
			if (!isRecord(explicitEntry)) return;
			const id = resolveExplicitLegacyEntryId(explicitEntry, index);
			return id === void 0 ? void 0 : normalizeAgentId(id);
		};
		const resolveExplicitLegacyId = (index) => {
			const resolvedId = resolveExplicitLegacyIdCandidate(index);
			if (!resolvedId || explicitRoster?.kind !== "list" || !Array.isArray(explicitRoster.value)) throw new Error("Config write cannot safely resolve an explicitly replaced agent list slot for unset.");
			for (const [candidateIndex] of explicitRoster.value.entries()) {
				if (candidateIndex === index) continue;
				const candidateId = resolveExplicitLegacyIdCandidate(candidateIndex);
				if (!candidateId) throw new Error("Config write cannot safely resolve every explicit agent id across an indexed list unset.");
				if (candidateId === resolvedId) throw new Error("Config write cannot safely resolve duplicate agent ids across an indexed list unset.");
			}
			return resolvedId;
		};
		for (const unsetPath of params.unsetPaths ?? []) {
			if (unsetPath[0] !== "agents" || unsetPath[1] !== "list") continue;
			if (unsetPath.length === 2) {
				entries = void 0;
				break;
			}
			if (unsetPath.length === 4 && unsetPath[3] === "id") throw new Error("Config write cannot unset an agent id; delete the complete roster entry instead.");
			const index = parseArrayIndexPathSegment(unsetPath[2] ?? "");
			const authoredEntry = index === void 0 ? void 0 : authoredList[index];
			const resolvedEntry = index === void 0 ? void 0 : resolvedLegacyList?.[index];
			const explicitResolvedId = index !== void 0 && structurallyExplicitLegacyIndexes.has(index) && index !== void 0 ? resolveExplicitLegacyId(index) : void 0;
			const id = explicitResolvedId !== void 0 ? explicitResolvedId : isRecord(resolvedEntry) ? resolvedEntry.id : isRecord(authoredEntry) ? authoredEntry.id : void 0;
			if (typeof id !== "string") continue;
			const targetId = explicitResolvedId !== void 0 ? id : nextIdByPriorId.get(id) ?? id;
			entries = deletePathValue(entries, [targetId, ...unsetPath.slice(3)]);
		}
	}
	const withoutLegacyList = deletePathValue(params.valueSource, ["agents", "list"]);
	return entries === void 0 ? deletePathValue(withoutLegacyList, ["agents", "entries"]) : setPathValueCreatingParents(withoutLegacyList, ["agents", "entries"], entries);
}
function restoreAuthoredAgentRoster(value, rootAuthoredConfig) {
	let next = deletePathValue(value, ["agents", "entries"]);
	next = deletePathValue(next, ["agents", "list"]);
	const authoredRoster = readAgentRosterProperty(rootAuthoredConfig);
	return authoredRoster ? setPathValueCreatingParents(next, ["agents", authoredRoster.kind], cloneUnknown(authoredRoster.value)) : next;
}
function projectAuthoredAgentRosterForCanonicalIncludes(params) {
	const authoredRoster = readAgentRosterProperty(params.rootAuthoredConfig);
	if (authoredRoster?.kind !== "list" || !Array.isArray(authoredRoster.value)) return params.rootAuthoredConfig;
	const preMigrationRoster = readAgentRosterProperty(params.sourceConfigBeforeMigrations);
	const resolvedLegacyList = preMigrationRoster?.kind === "list" && Array.isArray(preMigrationRoster.value) ? preMigrationRoster.value : void 0;
	const entries = Object.fromEntries(authoredRoster.value.flatMap((entry, index) => {
		if (!isRecord(entry)) return [];
		const resolvedEntry = resolvedLegacyList?.[index];
		const resolvedId = isRecord(resolvedEntry) ? resolvedEntry.id : void 0;
		const id = typeof resolvedId === "string" ? resolvedId : entry.id;
		if (typeof id !== "string") return [];
		const { id: _authoredId, ...config } = entry;
		return [[normalizeAgentId(id), config]];
	}));
	return setPathValueCreatingParents(deletePathValue(deletePathValue(params.rootAuthoredConfig, ["agents", "list"]), ["agents", "entries"]), ["agents", "entries"], entries);
}
function resolvePersistCandidateForWrite(params) {
	const patch = createMergePatch(params.runtimeConfig, params.nextConfig);
	const projectedSource = normalizeTouchedAgentModelMapEntries({
		projectedSource: projectSourceOntoRuntimeShape(params.sourceConfig, params.runtimeConfig),
		patch,
		explicitSetPaths: params.explicitSetPaths,
		explicitSetValueSource: params.explicitSetValueSource ?? params.nextConfig
	});
	const rootAuthoredConfig = params.rootAuthoredConfig ?? params.sourceConfig;
	const persistCanonicalRoster = shouldPersistCanonicalAgentRoster(params);
	if (persistCanonicalRoster && configIncludeOwnsAgentRosterValues({
		parsed: rootAuthoredConfig,
		sourceConfigBeforeMigrations: params.sourceConfigBeforeMigrations ?? params.sourceConfig,
		includeContributesRoster: params.agentRosterIncludeOwned
	})) throw new Error("Config write would flatten $include-owned config at agents; edit that include file directly or remove the $include first.");
	const projectedAuthoredRoster = persistCanonicalRoster ? projectAuthoredAgentRosterForCanonicalIncludes({
		rootAuthoredConfig,
		sourceConfigBeforeMigrations: params.sourceConfigBeforeMigrations
	}) : rootAuthoredConfig;
	const includeProjectionRootAuthoredConfig = persistCanonicalRoster && !hasAgentRosterProperty(projectedAuthoredRoster) ? setPathValueCreatingParents(projectedAuthoredRoster, ["agents", "entries"], toAgentEntriesRecord(listAgentEntries(params.sourceConfig))) : projectedAuthoredRoster;
	let persistedBase = preserveUntouchedIncludes({
		runtimeConfig: params.runtimeConfig,
		sourceConfig: params.sourceConfig,
		nextConfig: params.nextConfig,
		rootAuthoredConfig: includeProjectionRootAuthoredConfig,
		persistedCandidate: applyMergePatch(projectedSource, patch)
	});
	const explicitSetPaths = persistCanonicalRoster ? [...(params.explicitSetPaths ?? []).filter((path) => !pathTargetsAgentRoster(path)), ["agents", "entries"]] : params.explicitSetPaths;
	const explicitSetValueSource = persistCanonicalRoster ? canonicalizeAgentRosterForExplicitWrite({
		valueSource: params.explicitSetValueSource ?? params.nextConfig,
		rootAuthoredConfig,
		runtimeConfig: params.runtimeConfig,
		sourceConfig: params.sourceConfig,
		sourceConfigBeforeMigrations: params.sourceConfigBeforeMigrations,
		nextConfig: params.nextConfig,
		explicitSetPaths: params.explicitSetPaths,
		unsetPaths: params.unsetPaths
	}) : params.explicitSetValueSource ?? params.nextConfig;
	if (persistCanonicalRoster) {
		persistedBase = deletePathValue(persistedBase, ["agents", "entries"]);
		persistedBase = deletePathValue(persistedBase, ["agents", "list"]);
	}
	const persisted = injectExplicitlySetPaths({
		valueSource: explicitSetValueSource,
		persistedCandidate: persistedBase,
		explicitSetPaths,
		rootAuthoredConfig: includeProjectionRootAuthoredConfig,
		preserveDescendantIncludes: persistCanonicalRoster,
		allowIncludeAncestorExplicitSetPaths: params.allowIncludeAncestorExplicitSetPaths
	});
	const withPreservedIncludes = persistCanonicalRoster ? preserveUntouchedIncludes({
		runtimeConfig: params.runtimeConfig,
		sourceConfig: params.sourceConfig,
		nextConfig: params.nextConfig,
		rootAuthoredConfig: includeProjectionRootAuthoredConfig,
		persistedCandidate: persisted
	}) : persisted;
	const preserveAuthoredRoster = canCanonicalizeAgentRoster(params.nextConfig) || params.preserveLegacyAgentRoster === true;
	const withAuthoredRoster = persistCanonicalRoster || !preserveAuthoredRoster ? withPreservedIncludes : restoreAuthoredAgentRoster(withPreservedIncludes, rootAuthoredConfig);
	if (persistCanonicalRoster) assertCanonicalAgentRosterRetainsEntries({
		currentConfig: params.sourceConfig,
		canonicalConfig: withAuthoredRoster,
		allowedRemovals: params.allowedAgentRosterRemovals
	});
	const withSchema = preserveRootSchemaUri({
		rootAuthoredConfig,
		nextConfig: params.nextConfig,
		persistedCandidate: withAuthoredRoster
	});
	return preserveAuthoredAgentParams({
		sourceConfig: params.sourceConfig,
		nextConfig: params.nextConfig,
		rootAuthoredConfig,
		persistedCandidate: withSchema,
		unsetPaths: params.unsetPaths
	});
}
function readRootSchemaUri(value) {
	if (!isRecord(value) || typeof value.$schema !== "string") return;
	return value.$schema;
}
function hasOwnRootSchemaKey(value) {
	return isRecord(value) && Object.hasOwn(value, "$schema");
}
function preserveRootSchemaUri(params) {
	if (hasOwnRootSchemaKey(params.nextConfig)) return params.persistedCandidate;
	const sourceSchema = readRootSchemaUri(params.rootAuthoredConfig);
	if (sourceSchema === void 0 || !isRecord(params.persistedCandidate)) return params.persistedCandidate;
	return {
		...params.persistedCandidate,
		$schema: sourceSchema
	};
}
function isNumericPathSegment(raw) {
	return parseArrayIndexPathSegment(raw) !== void 0;
}
function parseArrayIndexPathSegment(raw) {
	return parseConfigPathArrayIndex(raw);
}
//#endregion
//#region src/config/io.write.ts
function hasOwnIncludeDirective(value) {
	return value !== null && typeof value === "object" && Object.hasOwn(value, "$include");
}
function hasIncludedGatewayModeOwner(value) {
	if (hasOwnIncludeDirective(value)) return true;
	if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
	const gateway = value.gateway;
	if (hasOwnIncludeDirective(gateway)) return true;
	if (gateway === null || typeof gateway !== "object" || Array.isArray(gateway)) return false;
	return hasOwnIncludeDirective(gateway.mode);
}
async function writeConfigFileFromContext(context, cfg, options, readSnapshot) {
	const { deps, configPath } = context;
	options.assertConfigPathForWrite?.();
	assertConfigWriteAllowedInCurrentMode({
		configPath,
		env: deps.env
	});
	const unsetPaths = resolveManagedUnsetPathsForWrite(options.unsetPaths);
	let nextConfig = cfg;
	const snapshotRead = options.baseSnapshot ? {
		snapshot: options.baseSnapshot,
		pluginMetadataSnapshot: options.basePluginMetadataSnapshot
	} : await readSnapshot();
	const snapshot = snapshotRead.snapshot;
	if (options.baseSnapshot) assertBaseSnapshotStillCurrent(snapshot, configPath, deps.fs);
	const sourceRosterMigration = migratePersistedImplicitMainRoster(snapshot.sourceConfigBeforeMigrations ?? snapshot.parsed);
	const retainedLegacyDefaultAgentId = sourceRosterMigration.retainedLegacyDefaultAgentId;
	const previousEntries = listAgentEntries(snapshot.config);
	const nextEntries = listAgentEntries(nextConfig);
	const nextAgentIds = new Set(nextEntries.map((entry) => normalizeAgentId(entry.id)));
	const previousSoleAgentId = tryResolveDefaultAgentId(snapshot.config);
	const entersMultiAgent = previousEntries.length <= 1 && nextEntries.length > 1;
	const previousSoleRemains = Boolean(previousSoleAgentId && nextAgentIds.has(normalizeAgentId(previousSoleAgentId)));
	const writesOwnershipTopology = !isDeepStrictEqual(previousEntries, nextEntries) || [...options.explicitSetPaths ?? [], ...unsetPaths].some((writePath) => writePath[0] === "agents" && (writePath.length === 1 || writePath[1] === "entries" || writePath[1] === "list" || writePath[1] === "ownership"));
	const persistOwnership = entersMultiAgent || retainedLegacyDefaultAgentId !== void 0 && writesOwnershipTopology;
	const keepOwnership = nextEntries.length > 1 && snapshot.config.agents?.ownership === "explicit";
	const stampOwnership = (persistOwnership || keepOwnership) && nextConfig.agents?.ownership === void 0;
	if (stampOwnership) nextConfig = {
		...nextConfig,
		agents: {
			...nextConfig.agents,
			ownership: "explicit"
		}
	};
	const workspaceCollapse = pinSurvivorWorkspaceForRosterCollapse(snapshot.config, nextConfig, deps.env);
	nextConfig = workspaceCollapse.config;
	const authInheritanceOwnership = prepareAuthInheritanceOwnerForWrite({
		currentConfig: snapshot.config,
		targetConfig: nextConfig,
		writesOwnershipTopology,
		explicitSetPaths: options.explicitSetPaths,
		env: deps.env
	});
	nextConfig = authInheritanceOwnership.config;
	const sessionStoreOwnership = prepareSessionStoreOwnershipForWrite({
		currentConfig: snapshot.config,
		currentStore: (snapshot.sourceConfigBeforeMigrations ?? snapshot.config).session?.store,
		targetConfig: nextConfig,
		env: deps.env,
		explicitSetPaths: options.explicitSetPaths,
		explicitSetValueSource: options.explicitSetValueSource
	});
	nextConfig = sessionStoreOwnership.config;
	const { sameFixedSessionStore } = sessionStoreOwnership;
	const retainedFleetOwner = retainedLegacyDefaultAgentId && writesOwnershipTopology && nextAgentIds.has(normalizeAgentId(retainedLegacyDefaultAgentId)) ? retainedLegacyDefaultAgentId : void 0;
	const ownerAgentId = (entersMultiAgent && previousSoleRemains ? previousSoleAgentId : void 0) ?? retainedFleetOwner;
	const ownershipMaterialization = ownerAgentId ? materializeLegacyAgentOwnershipForActiveChannelsResult(nextConfig, ownerAgentId, deps.env, snapshotRead.pluginMetadataSnapshot?.manifestRegistry.plugins, {
		materializeSessionStore: sameFixedSessionStore,
		materializeWorkspace: true
	}) : {
		config: nextConfig,
		insertedPaths: []
	};
	nextConfig = ownershipMaterialization.config;
	const insertedPaths = [
		...persistOwnership || keepOwnership ? (sourceRosterMigration.insertedPaths ?? []).filter((entry) => sameFixedSessionStore || entry.join(".") !== "agents.defaults.sessionStore.agentId") : [],
		...(persistOwnership || keepOwnership) && retainedLegacyDefaultAgentId && Array.isArray(snapshot.config.bindings) && !isDeepStrictEqual(snapshot.sourceConfigBeforeMigrations?.bindings, snapshot.config.bindings) ? [["bindings"]] : [],
		...ownershipMaterialization.insertedPaths.concat(workspaceCollapse.insertedPaths),
		...authInheritanceOwnership.insertedPaths,
		...persistOwnership ? [["agents", "entries"]] : [],
		...stampOwnership ? [["agents", "ownership"]] : []
	];
	const nextSessionStoreConfig = nextConfig.agents?.defaults?.sessionStore;
	if (!ownerAgentId && writesOwnershipTopology && previousEntries.length === 1 && previousSoleAgentId && !previousSoleRemains && sameFixedSessionStore && (nextSessionStoreConfig === void 0 || isRecord(nextSessionStoreConfig) && !Object.hasOwn(nextSessionStoreConfig, "agentId"))) {
		nextConfig = {
			...nextConfig,
			agents: {
				...nextConfig.agents,
				defaults: {
					...nextConfig.agents?.defaults,
					sessionStore: {
						...isRecord(nextSessionStoreConfig) ? nextSessionStoreConfig : {},
						agentId: normalizeAgentId(previousSoleAgentId)
					}
				}
			}
		};
		insertedPaths.push([
			"agents",
			"defaults",
			"sessionStore",
			"agentId"
		]);
	}
	const topologyPaths = [...new Map(insertedPaths.map((entry) => [entry.join("\0"), entry])).values()];
	assertAutomaticBindingsWriteAllowed({
		bindingsIncludeOwned: snapshot.bindingsIncludeOwned === true,
		ownershipPaths: topologyPaths
	});
	const explicitSetPaths = [...options.explicitSetPaths ?? [], ...topologyPaths];
	const explicitSetValueSource = structuredClone(options.explicitSetValueSource ?? nextConfig);
	for (const ownershipPath of topologyPaths) setConfigValueAtPath(explicitSetValueSource, ownershipPath, getConfigValueAtPath(nextConfig, ownershipPath));
	const cronOwnerRefusal = persistOwnership ? await prepareCronOwnerWriteRefusal(snapshot.config, {
		storePath: resolveCronJobsStorePathFromConfig(nextConfig, deps.env),
		...retainedFleetOwner ? { provenOwnerAgentId: retainedFleetOwner } : {},
		env: deps.env
	}) : void 0;
	let persistCandidate = nextConfig;
	let envRefMap = null;
	const changedPaths = /* @__PURE__ */ new Set();
	collectChangedPaths(snapshot.config, nextConfig, "", changedPaths);
	for (const changedPath of [...explicitSetPaths, ...options.unsetPaths ?? []]) {
		const normalizedPath = changedPath.filter((segment) => segment.length > 0).join(".");
		if (normalizedPath) changedPaths.add(normalizedPath);
	}
	const identityRestoredPaths = /* @__PURE__ */ new Set();
	const hasAuthoredIncludes = containsConfigIncludeDirective(snapshot.parsed);
	const hasIncludes = hasAuthoredIncludes && !containsConfigIncludeDirective(snapshot.sourceConfig);
	if (snapshot.valid) persistCandidate = resolvePersistCandidateForWrite({
		runtimeConfig: snapshot.config,
		sourceConfig: snapshot.resolved,
		sourceConfigBeforeMigrations: snapshot.sourceConfigBeforeMigrations,
		nextConfig,
		rootAuthoredConfig: snapshot.parsed,
		agentRosterIncludeOwned: snapshot.agentRosterIncludeOwned,
		unsetPaths,
		explicitSetPaths,
		explicitSetValueSource,
		allowedAgentRosterRemovals: options.allowedAgentRosterRemovals,
		allowIncludeAncestorExplicitSetPaths: options.allowIncludeAncestorExplicitSetPaths,
		preserveLegacyAgentRoster: Boolean(retainedLegacyDefaultAgentId) && !writesOwnershipTopology
	});
	else if (snapshot.exists && hasAuthoredIncludes) persistCandidate = preserveIncludeOwnedConfigForWrite({
		runtimeConfig: snapshot.config,
		sourceConfig: snapshot.resolved,
		nextConfig,
		rootAuthoredConfig: snapshot.parsed
	});
	if (snapshot.exists && (snapshot.valid || hasIncludes)) try {
		const resolvedIncludes = resolveConfigIncludes(snapshot.parsed, configPath, {
			readFile: (candidate) => deps.fs.readFileSync(candidate, "utf-8"),
			readFileWithGuards: ({ includePath, resolvedPath, rootRealDir }) => readConfigIncludeFileWithGuards({
				includePath,
				resolvedPath,
				rootRealDir,
				ioFs: deps.fs
			}),
			parseJson: (raw) => deps.json5.parse(raw)
		}, { allowedRoots: resolveIncludeRoots(deps.env, deps.homedir) });
		const collected = /* @__PURE__ */ new Map();
		collectEnvRefPaths(resolvedIncludes, "", collected);
		if (collected.size > 0) envRefMap = collected;
	} catch {
		envRefMap = null;
	}
	persistCandidate = applyUnsetPathsForWrite(persistCandidate, unsetPaths);
	const envForRestore = options.envSnapshotForRestore ?? deps.env;
	const validationSourceCandidate = containsConfigIncludeDirective(persistCandidate) ? restoreEnvVarRefs(persistCandidate, snapshot.parsed, envForRestore) : persistCandidate;
	const validated = validateConfigObjectRawWithPlugins(containsConfigIncludeDirective(validationSourceCandidate) ? context.resolveRuntimePreflightSourceConfig(validationSourceCandidate) : validationSourceCandidate, {
		env: deps.env,
		pluginValidation: options.skipPluginValidation ? "skip" : "full",
		preservedLegacyRootKeys: options.preservedLegacyRootKeys
	});
	if (!validated.ok) {
		const issue = validated.issues[0];
		throw new Error(formatConfigValidationFailure(issue?.path || "<root>", issue?.message ?? "invalid"));
	}
	const previousWarningFingerprint = loggedConfigWarningFingerprints.get(configPath);
	const priorSnapshotAuditRecord = readLatestConfigSnapshotAuditRecord({
		env: deps.env,
		homedir: deps.homedir
	});
	let cfgToWrite = persistCandidate;
	try {
		if (deps.fs.existsSync(configPath)) {
			const parsed = parseConfigJson5(await deps.fs.promises.readFile(configPath, "utf-8"), deps.json5);
			if (parsed.ok) {
				const beforeIdentityRestore = cfgToWrite;
				cfgToWrite = restoreEnvVarRefs(cfgToWrite, parsed.parsed, envForRestore);
				collectChangedPaths(beforeIdentityRestore, cfgToWrite, "", identityRestoredPaths);
			}
		}
	} catch (error) {
		if (error instanceof EnvRefArrayMutationError) throw error;
	}
	await deps.fs.promises.mkdir(path.dirname(configPath), {
		recursive: true,
		mode: 448
	});
	await tightenStateDirPermissionsIfNeeded({
		configPath,
		env: deps.env,
		homedir: deps.homedir,
		fsModule: deps.fs
	});
	const stampedOutputConfig = stampConfigVersion(applyUnsetPathsForWrite(restoreAuthoredTildePathsForWrite(envRefMap ? restoreEnvRefsFromMap(cfgToWrite, "", envRefMap, changedPaths, identityRestoredPaths) : cfgToWrite, snapshot.parsed, void 0, deps.homedir()), unsetPaths), options.lastTouchedVersionOverride, snapshot.exists ? snapshot.parsed : null);
	const json = JSON.stringify(stampedOutputConfig, null, 2).trimEnd().concat("\n");
	const nextHash = hashConfigRaw(json);
	const previousHash = resolveConfigSnapshotHash(snapshot);
	const changedPathCount = changedPaths.size;
	const previousBytes = typeof snapshot.raw === "string" ? Buffer.byteLength(snapshot.raw, "utf-8") : null;
	const sizeBaselineBytes = resolveConfigSizeBaselineBytes({
		raw: snapshot.raw,
		json5: deps.json5,
		lastTouchedVersionOverride: options.lastTouchedVersionOverride
	});
	const nextBytes = Buffer.byteLength(json, "utf-8");
	const previousStat = snapshot.exists ? await deps.fs.promises.stat(configPath).catch(() => null) : null;
	const hasMetaBefore = hasConfigMeta(snapshot.parsed);
	const hasMetaAfter = hasConfigMeta(stampedOutputConfig);
	const gatewayModeBefore = resolveGatewayMode(snapshot.resolved);
	const authoredGateway = snapshot.parsed.gateway;
	const authoredGatewayMode = authoredGateway !== null && typeof authoredGateway === "object" && !Array.isArray(authoredGateway) ? authoredGateway.mode : void 0;
	const gatewayModeAuthoredLocally = authoredGateway !== null && typeof authoredGateway === "object" && !Array.isArray(authoredGateway) && Object.hasOwn(authoredGateway, "mode") && !hasOwnIncludeDirective(authoredGatewayMode);
	const preservesIncludedGatewayMode = options.allowIncludeAncestorExplicitSetPaths === true && gatewayModeBefore != null && !gatewayModeAuthoredLocally && hasIncludedGatewayModeOwner(stampedOutputConfig) && !options.explicitSetPaths?.some((explicitPath) => explicitPath[0] === "gateway");
	const gatewayModeAfter = resolveGatewayMode(stampedOutputConfig) ?? (preservesIncludedGatewayMode ? gatewayModeBefore : null) ?? null;
	const suspiciousReasons = resolveConfigWriteSuspiciousReasons({
		existsBefore: snapshot.exists,
		unreadableBefore: snapshot.readError != null,
		sizeBaselineBytes,
		nextBytes,
		hasMetaBefore,
		gatewayModeBefore,
		gatewayModeAfter
	});
	const readTestLogFlag = (name) => isVitestRuntimeEnv(deps.env) && deps.env[name] === "1";
	const logConfigOverwrite = () => {
		if (!snapshot.exists || options.skipOutputLogs || isVitestRuntimeEnv(deps.env) && !readTestLogFlag("OPENCLAW_TEST_CONFIG_WRITE_LOG")) return;
		const testLog = readTestLogFlag("OPENCLAW_TEST_CONFIG_WRITE_LOG");
		if (!isVerbose() && deps.env.OPENCLAW_CONFIG_OVERWRITE_LOG !== "1" && !testLog) return;
		deps.logger.warn(formatConfigOverwriteLogMessage({
			configPath,
			previousHash: previousHash ?? null,
			nextHash,
			changedPathCount
		}));
	};
	const logConfigWriteAnomalies = () => {
		const testLog = readTestLogFlag("OPENCLAW_TEST_CONFIG_WRITE_LOG");
		if (suspiciousReasons.length === 0 || options.skipOutputLogs || isVitestRuntimeEnv(deps.env) && !testLog) return;
		const visibleReasons = isVerbose() || deps.env.OPENCLAW_CONFIG_WRITE_ANOMALY_LOG === "1" || testLog ? suspiciousReasons : suspiciousReasons.filter((reason) => reason !== "missing-meta-before-write");
		if (visibleReasons.length > 0) deps.logger.warn(`Config write anomaly: ${configPath} (${visibleReasons.join(", ")})`);
	};
	const auditRecordBase = createConfigWriteAuditRecordBase({
		configPath,
		env: deps.env,
		existsBefore: snapshot.exists,
		previousHash: previousHash ?? null,
		nextHash,
		previousBytes,
		nextBytes,
		previousMetadata: resolveConfigStatMetadata(previousStat),
		changedPathCount,
		changedPaths: [...changedPaths],
		origin: options.auditOrigin,
		hasMetaBefore,
		hasMetaAfter,
		gatewayModeBefore,
		gatewayModeAfter,
		suspicious: suspiciousReasons
	});
	const appendWriteAudit = async (result, error, nextStat) => {
		await appendConfigAuditRecord({
			env: deps.env,
			homedir: deps.homedir,
			record: finalizeConfigWriteAuditRecord({
				base: auditRecordBase,
				result,
				err: error,
				nextMetadata: resolveConfigStatMetadata(nextStat ?? null)
			})
		});
	};
	const blockingReasons = resolveConfigWriteBlockingReasons(suspiciousReasons, options);
	if (blockingReasons.length > 0 && options.allowDestructiveWrite !== true) {
		const rejectedPath = `${configPath}.rejected.${formatConfigArtifactTimestamp$1((/* @__PURE__ */ new Date()).toISOString())}`;
		await deps.fs.promises.writeFile(rejectedPath, json, {
			encoding: "utf-8",
			mode: 384,
			flag: "wx"
		}).catch(() => {});
		const message = `Config write rejected: ${configPath} (${blockingReasons.join(", ")}). Rejected payload saved to ${rejectedPath}.`;
		const error = Object.assign(new Error(message), {
			code: "CONFIG_WRITE_REJECTED",
			rejectedPath,
			reasons: blockingReasons
		});
		deps.logger.warn(message);
		await appendWriteAudit("rejected", error);
		throw error;
	}
	await (options.preCommitRuntimePreflight ?? (async (sourceConfig) => {
		await preflightRuntimeSnapshotWrite({
			nextSourceConfig: sourceConfig,
			refreshOptions: options.runtimeRefresh,
			formatRefreshError: (error) => formatErrorMessage(error),
			createRefreshError: (detail, cause) => new ConfigRuntimeRefreshError(`Config write blocked before committing ${configPath}: active SecretRef resolution failed: ${detail}`, { cause })
		});
	}))(context.resolveRuntimePreflightSourceConfig(stampedOutputConfig));
	try {
		const result = await replaceFileAtomic({
			filePath: configPath,
			content: json,
			dirMode: 448,
			mode: 384,
			tempPrefix: path.basename(configPath),
			copyFallbackOnPermissionError: true,
			fileSystem: deps.fs,
			beforeRename: async () => {
				options.assertConfigPathForWrite?.();
				if (options.baseSnapshot) assertBaseSnapshotStillCurrent(snapshot, configPath, deps.fs);
				if (deps.fs.existsSync(configPath)) await maintainConfigBackups(configPath, deps.fs.promises);
				if (options.baseSnapshot) assertBaseSnapshotStillCurrent(snapshot, configPath, deps.fs);
				options.assertConfigPathForWrite?.();
				await cronOwnerRefusal?.recheck();
				options.assertConfigPathForWrite?.();
				warnIfJSON5CommentsWillBeStripped({
					raw: snapshot.raw,
					filePath: configPath,
					warn: (message) => deps.logger.warn(message),
					skipOutputLogs: options.skipOutputLogs
				});
			}
		});
		try {
			options.assertConfigPathForWrite?.();
		} catch (error) {
			try {
				await rollbackConfigFileWriteIfUnchanged({
					configPath,
					previousSnapshot: snapshot,
					committedHash: nextHash,
					fsModule: deps.fs
				});
			} catch (rollbackError) {
				throw new ConfigRuntimeRefreshError(`${formatErrorMessage(error)} Rollback failed: ${formatErrorMessage(rollbackError)}`, { cause: error });
			}
			throw error;
		}
		try {
			recordConfigWriteMetadata((/* @__PURE__ */ new Date()).toISOString(), options.lastTouchedVersionOverride);
		} catch (error) {
			deps.logger.warn(`Config metadata state update failed: ${formatErrorMessage(error)}`);
		}
		logConfigOverwrite();
		logConfigWriteAnomalies();
		await appendWriteAudit(result.method, void 0, await deps.fs.promises.stat(configPath).catch(() => null));
		if (configSnapshotAuditRecordMatchesPath(priorSnapshotAuditRecord, configPath) && priorSnapshotAuditRecord.rawHash !== previousHash) {
			const offlineChangedPaths = /* @__PURE__ */ new Set();
			collectChangedPaths(priorSnapshotAuditRecord.fingerprintedAuthoredConfig, fingerprintConfigSnapshotAuthoredConfig(snapshot.parsed, {
				env: deps.env,
				homedir: deps.homedir
			}), "", offlineChangedPaths);
			await appendConfigAuditRecord({
				env: deps.env,
				homedir: deps.homedir,
				record: {
					ts: (/* @__PURE__ */ new Date()).toISOString(),
					source: "config-io",
					event: "config.external",
					detectedBy: "write",
					configPath,
					previousHash: priorSnapshotAuditRecord.rawHash,
					nextHash: previousHash ?? null,
					valid: snapshot.valid,
					...snapshot.valid ? offlineChangedPaths.size > 0 ? { changedPaths: capConfigAuditPaths([...offlineChangedPaths]) } : { opaqueChange: true } : { issues: capConfigAuditIssues(formatConfigIssueLines(snapshot.issues, "", { normalizeRoot: true })) }
				}
			});
		}
		const writtenSnapshotAuditRecord = upsertConfigSnapshotAuditRecord({
			env: deps.env,
			homedir: deps.homedir,
			configPath,
			rawHash: nextHash,
			authoredConfig: stampedOutputConfig,
			expectedSnapshot: priorSnapshotAuditRecord
		});
		if (!options.skipPluginValidation) logConfigWarningsOnce({
			configPath,
			warnings: validated.warnings,
			logger: deps.logger
		});
		return {
			persistedHash: nextHash,
			persistedConfig: stampedOutputConfig,
			[configWritePostCommitRollback]: () => {
				restoreConfigSnapshotAuditRecord({
					env: deps.env,
					homedir: deps.homedir,
					snapshot: priorSnapshotAuditRecord,
					expectedSnapshot: writtenSnapshotAuditRecord
				});
				if (previousWarningFingerprint === void 0) loggedConfigWarningFingerprints.delete(configPath);
				else setBoundedConfigIoWarningEntry(loggedConfigWarningFingerprints, configPath, previousWarningFingerprint);
			}
		};
	} catch (error) {
		await appendWriteAudit("failed", error);
		throw error;
	}
}
//#endregion
//#region src/config/io.factory.ts
function createConfigIO(options = {}) {
	const context = createConfigIoContext(options);
	const readInternal = () => readConfigFileSnapshotInternal(context);
	return {
		configPath: context.configPath,
		env: context.deps.env,
		loadConfig: (loadOptions) => loadConfigFromContext(context, loadOptions),
		readBestEffortConfig: async () => (await readBestEffortConfigSnapshotFromContext(context)).config,
		readBestEffortConfigSnapshot: () => readBestEffortConfigSnapshotFromContext(context),
		readSourceConfigBestEffort: () => readSourceConfigBestEffortFromContext(context),
		readConfigFileSnapshot: (readOptions = {}) => readConfigFileSnapshotFromContext(context, readOptions),
		readConfigFileSnapshotWithPluginMetadata: (readOptions = {}) => readConfigFileSnapshotWithPluginMetadataFromContext(context, readOptions),
		readConfigFileSnapshotForWrite: () => readConfigFileSnapshotForWriteFromContext(context),
		promoteConfigSnapshotToLastKnownGood: (snapshot) => promoteConfigSnapshotToLastKnownGoodCore({
			deps: context.deps,
			snapshot,
			logger: context.deps.logger
		}),
		recoverConfigFromLastKnownGood: (params) => recoverConfigFromLastKnownGoodCore({
			deps: context.deps,
			snapshot: params.snapshot,
			reason: params.reason,
			prepareCandidate: context.prepareRecoveryBackupCandidate
		}),
		preserveConfigSnapshotAsClobbered: (snapshot) => preserveConfigSnapshotAsClobberedCore({
			deps: context.deps,
			snapshot
		}),
		recoverConfigFromJsonRootSuffix: (snapshot) => recoverConfigFromJsonRootSuffixWithContext(context, snapshot),
		writeConfigFile: (config, writeOptions = {}) => writeConfigFileFromContext(context, config, writeOptions, readInternal)
	};
}
//#endregion
//#region src/config/io.runtime.ts
function clearConfigCache() {}
function registerConfigWriteListener(listener, options = {}) {
	const unregisterOwner = options.ownsRuntimeActivationFor ? registerManagedRuntimeConfigWriteOwner(options.ownsRuntimeActivationFor, options.preCommitRuntimePreflight) : void 0;
	const unregisterListener = registerRuntimeConfigWriteListener((event) => {
		const { preparedCandidate: _preparedCandidate, preparedCandidatesByOwner: _preparedCandidatesByOwner, ...baseEvent } = event;
		const preparedCandidate = unregisterOwner ? event.preparedCandidatesByOwner?.get(unregisterOwner.ownerId) : void 0;
		listener({
			...baseEvent,
			...preparedCandidate ? { preparedCandidate } : {}
		});
	});
	return () => {
		unregisterListener();
		unregisterOwner?.();
	};
}
function loadConfig(options) {
	const loadFresh = () => createConfigIO({
		...options?.skipPluginValidation ? { pluginValidation: "skip" } : {},
		...options?.skipShellEnvFallback ? { shellEnvFallback: "defer" } : {}
	}).loadConfig();
	return options?.pin === false ? loadFresh() : loadPinnedRuntimeConfig(loadFresh);
}
function getRuntimeConfig(options) {
	return loadConfig(options);
}
async function readBestEffortConfig(options) {
	return await createConfigIO({
		...options?.isolateEnv ? { env: cloneEnvWithPlatformSemantics(process.env) } : {},
		...options?.observe === false ? { observe: false } : {},
		...options?.skipPluginValidation ? { pluginValidation: "skip" } : {}
	}).readBestEffortConfig();
}
async function readBestEffortConfigSnapshot(options) {
	return await createConfigIO({
		...options?.observe === false ? { observe: false } : {},
		...options?.skipPluginValidation ? { pluginValidation: "skip" } : {}
	}).readBestEffortConfigSnapshot();
}
async function readSourceConfigBestEffort() {
	return await createConfigIO().readSourceConfigBestEffort();
}
async function readConfigFileSnapshot(options = {}) {
	return await createConfigIO({
		...options.measure ? { measure: options.measure } : {},
		...options.observe === false ? { observe: false } : {},
		...options.isolateEnv ? { env: cloneEnvWithPlatformSemantics(process.env) } : {},
		...options.lowerPrecedenceEnv ? { lowerPrecedenceEnv: options.lowerPrecedenceEnv } : {},
		...options.skipPluginValidation ? { pluginValidation: "skip" } : {},
		...options.suppressFutureVersionWarning ? { suppressFutureVersionWarning: true } : {},
		...options.preservedLegacyRootKeys ? { preservedLegacyRootKeys: options.preservedLegacyRootKeys } : {}
	}).readConfigFileSnapshot({
		recoverSuspicious: options.recoverSuspicious === true,
		allowSuspiciousRecovery: options.allowSuspiciousRecovery
	});
}
async function readConfigFileSnapshotWithPluginMetadata(options) {
	return await createConfigIO({
		...options?.measure ? { measure: options.measure } : {},
		...options?.observe === false ? { observe: false } : {},
		...options?.isolateEnv ? { env: cloneEnvWithPlatformSemantics(process.env) } : {},
		...options?.lowerPrecedenceEnv ? { lowerPrecedenceEnv: options.lowerPrecedenceEnv } : {}
	}).readConfigFileSnapshotWithPluginMetadata({
		allowCurrentPluginMetadata: options?.allowCurrentPluginMetadata,
		recoverSuspicious: options?.recoverSuspicious === true,
		allowSuspiciousRecovery: options?.allowSuspiciousRecovery
	});
}
async function promoteConfigSnapshotToLastKnownGood(snapshot) {
	return await createConfigIO().promoteConfigSnapshotToLastKnownGood(snapshot);
}
async function recoverConfigFromLastKnownGood(params) {
	return await createConfigIO().recoverConfigFromLastKnownGood(params);
}
async function preserveConfigSnapshotAsClobbered(snapshot) {
	return await createConfigIO().preserveConfigSnapshotAsClobbered(snapshot);
}
async function recoverConfigFromJsonRootSuffix(snapshot) {
	return await createConfigIO().recoverConfigFromJsonRootSuffix(snapshot);
}
async function readSourceConfigSnapshot() {
	return await readConfigFileSnapshot();
}
async function readConfigFileSnapshotForRuntimeTransaction(activeSourceConfig) {
	return await createConfigIO({ env: createConfigRuntimeEnvBase(activeSourceConfig, process.env, { preservedKeys: GATEWAY_CONFIG_SELECTION_ENV_KEYS }) }).readConfigFileSnapshot();
}
async function readConfigFileSnapshotForWrite(options) {
	const readOptions = options?.skipPluginValidation ? { pluginValidation: "skip" } : {};
	for (let attempt = 0; attempt < 3; attempt += 1) try {
		const processIo = createConfigIO(readOptions);
		const result = await (hasManagedRuntimeConfigWriteOwner(processIo.configPath) ? createConfigIO({
			...readOptions,
			env: createManagedRuntimeEnvBase()
		}) : processIo).readConfigFileSnapshotForWrite();
		result.writeOptions.assertConfigPathForWrite?.();
		return result;
	} catch (error) {
		if (!(error instanceof ConfigMutationConflictError) || error.retryable || attempt === 2) throw error;
	}
	throw new Error("unreachable");
}
async function readSourceConfigSnapshotForWrite() {
	return await readConfigFileSnapshotForWrite();
}
async function writeConfigFile(cfg, options = {}) {
	options.assertConfigPathForWrite?.();
	const ioOptions = {
		...options.ownedConfigPathForWrite ? { configPath: options.ownedConfigPathForWrite } : {},
		...options.skipPluginValidation ? { pluginValidation: "skip" } : {},
		...options.preservedLegacyRootKeys ? { preservedLegacyRootKeys: options.preservedLegacyRootKeys } : {}
	};
	const processIo = createConfigIO(ioOptions);
	const deferRuntimeActivation = hasManagedRuntimeConfigWriteOwner(processIo.configPath);
	const io = deferRuntimeActivation ? createConfigIO({
		...ioOptions,
		env: createManagedRuntimeEnvBase()
	}) : processIo;
	assertConfigWriteAllowedInCurrentMode({ configPath: io.configPath });
	let nextCfg = cfg;
	const runtimeConfigSnapshot = getRuntimeConfigSnapshot();
	const runtimeConfigSourceSnapshot = getRuntimeConfigSourceSnapshot();
	const hadRuntimeSnapshot = Boolean(runtimeConfigSnapshot);
	const hadBothSnapshots = Boolean(runtimeConfigSnapshot && runtimeConfigSourceSnapshot);
	if (hadBothSnapshots) nextCfg = coerceConfig(applyMergePatch(runtimeConfigSourceSnapshot, createMergePatch(runtimeConfigSnapshot, cfg)));
	const baseSnapshotRead = options.baseSnapshot ? {
		snapshot: options.baseSnapshot,
		pluginMetadataSnapshot: options.basePluginMetadataSnapshot
	} : await io.readConfigFileSnapshotWithPluginMetadata();
	const baseSnapshot = baseSnapshotRead.snapshot;
	if (deferRuntimeActivation) replaceEnvSnapshot(io.env, createManagedRuntimeEnvBase());
	let runtimePreflightResult;
	let managedPreparedCandidates = /* @__PURE__ */ new Map();
	const writeResult = await io.writeConfigFile(nextCfg, {
		baseSnapshot,
		basePluginMetadataSnapshot: baseSnapshotRead.pluginMetadataSnapshot,
		assertConfigPathForWrite: options.assertConfigPathForWrite,
		envSnapshotForRestore: resolveWriteEnvSnapshotForPath({
			actualConfigPath: io.configPath,
			expectedConfigPath: options.expectedConfigPath,
			envSnapshotForRestore: options.envSnapshotForRestore
		}),
		unsetPaths: resolveManagedUnsetPathsForWrite(options.unsetPaths),
		explicitSetPaths: options.explicitSetPaths,
		explicitSetValueSource: options.explicitSetPaths ? options.explicitSetValueSource ?? cfg : void 0,
		allowedAgentRosterRemovals: options.allowedAgentRosterRemovals,
		allowIncludeAncestorExplicitSetPaths: options.allowIncludeAncestorExplicitSetPaths,
		afterWrite: options.afterWrite,
		allowDestructiveWrite: options.allowDestructiveWrite,
		allowConfigSizeDrop: options.allowConfigSizeDrop,
		skipRuntimeSnapshotRefresh: options.skipRuntimeSnapshotRefresh,
		skipOutputLogs: options.skipOutputLogs,
		skipPluginValidation: options.skipPluginValidation,
		preservedLegacyRootKeys: options.preservedLegacyRootKeys,
		lastTouchedVersionOverride: options.lastTouchedVersionOverride,
		preCommitRuntimePreflight: async (sourceConfig) => {
			if (deferRuntimeActivation) managedPreparedCandidates = await preflightManagedRuntimeConfigWrite(io.configPath, sourceConfig, options.runtimeRefresh);
			else runtimePreflightResult = await preflightRuntimeSnapshotWrite({
				nextSourceConfig: sourceConfig,
				refreshOptions: options.runtimeRefresh,
				formatRefreshError: (error) => formatErrorMessage(error),
				createRefreshError: (detail, cause) => new ConfigRuntimeRefreshError(`Config write blocked before committing ${io.configPath}: active SecretRef resolution failed: ${detail}`, { cause })
			});
			await options.preCommitRuntimePreflight?.(sourceConfig);
		}
	});
	if (options.skipRuntimeSnapshotRefresh && !hadRuntimeSnapshot && !getRuntimeConfigSnapshotRefreshHandler()) return writeResult;
	if (deferRuntimeActivation) replaceEnvSnapshot(io.env, createManagedRuntimeEnvBase());
	return await finalizeCommittedConfigWrite({
		io,
		options,
		nextCfg,
		writeResult,
		baseSnapshot,
		hadRuntimeSnapshot,
		hadBothSnapshots,
		deferRuntimeActivation,
		runtimePreflightResult,
		managedPreparedCandidates
	});
}
async function finalizeCommittedConfigWrite(params) {
	const { io, options, writeResult, baseSnapshot, deferRuntimeActivation, managedPreparedCandidates } = params;
	let canonicalSourceConfig = params.nextCfg;
	let canonicalRuntimeConfig = params.nextCfg;
	let envBeforeCanonicalRead = snapshotEnv(io.env);
	let envAfterCanonicalRead;
	let canonicalReadFailure = null;
	try {
		let stableEnvGeneration = !deferRuntimeActivation;
		for (let attempt = 0; attempt < 3; attempt += 1) {
			const baseline = resolveManagedRuntimeEnvBaseline();
			if (deferRuntimeActivation) {
				replaceEnvSnapshot(io.env, createConfigRuntimeEnvBase(baseline.sourceConfig, process.env, { preservedKeys: GATEWAY_CONFIG_SELECTION_ENV_KEYS }));
				envBeforeCanonicalRead = snapshotEnv(io.env);
			}
			const freshSnapshot = await io.readConfigFileSnapshot();
			if (freshSnapshot.exists && freshSnapshot.valid) {
				canonicalSourceConfig = freshSnapshot.sourceConfig;
				canonicalRuntimeConfig = freshSnapshot.config;
			}
			if (!deferRuntimeActivation || resolveManagedRuntimeEnvBaseline().generation === baseline.generation) {
				stableEnvGeneration = true;
				break;
			}
		}
		if (!stableEnvGeneration) canonicalReadFailure = new ConfigRuntimeRefreshError(`Config was written to ${io.configPath}, but the active config environment changed during every canonical reread`);
	} catch (error) {
		canonicalReadFailure = new ConfigRuntimeRefreshError(`Config was written to ${io.configPath}, but the canonical reread failed: ${formatErrorMessage(error)}`, { cause: error });
	} finally {
		envAfterCanonicalRead = snapshotEnv(io.env);
	}
	const notifyCommittedWrite = () => {
		const currentRuntimeConfig = getRuntimeConfigSnapshot();
		const notificationRuntimeConfig = deferRuntimeActivation ? canonicalRuntimeConfig : currentRuntimeConfig;
		if (!notificationRuntimeConfig) return;
		const notificationPreparedCandidates = new Map([...managedPreparedCandidates].map(([ownerId, candidate]) => [ownerId, {
			...candidate,
			runtimeConfig: candidate.reapplyRuntimeOverlays?.(canonicalRuntimeConfig) ?? candidate.runtimeConfig,
			compareConfig: candidate.reapplyCompareOverlays?.(canonicalSourceConfig) ?? candidate.compareConfig
		}]));
		notifyRuntimeConfigWriteListeners(createRuntimeConfigWriteNotification({
			configPath: io.configPath,
			sourceConfig: canonicalSourceConfig,
			runtimeConfig: notificationRuntimeConfig,
			persistedHash: writeResult.persistedHash,
			afterWrite: options.afterWrite,
			runtimeRefresh: options.runtimeRefresh,
			...notificationPreparedCandidates.size > 0 ? { preparedCandidatesByOwner: notificationPreparedCandidates } : {}
		}));
	};
	try {
		if (canonicalReadFailure) throw canonicalReadFailure;
		options.assertConfigPathForWrite?.();
		await finalizeRuntimeSnapshotWrite({
			nextSourceConfig: canonicalSourceConfig,
			refreshOptions: options.runtimeRefresh,
			hadRuntimeSnapshot: params.hadRuntimeSnapshot,
			hadBothSnapshots: params.hadBothSnapshots,
			loadFreshConfig: () => io.loadConfig(),
			notifyCommittedWrite,
			formatRefreshError: (error) => formatErrorMessage(error),
			preflightResult: params.runtimePreflightResult,
			deferRuntimeActivation,
			createRefreshError: (detail, cause) => new ConfigRuntimeRefreshError(`Config was written to ${io.configPath}, but runtime snapshot refresh failed: ${detail}`, { cause })
		});
	} catch (error) {
		try {
			if (await rollbackConfigFileWriteIfUnchanged({
				configPath: io.configPath,
				previousSnapshot: baseSnapshot,
				committedHash: writeResult.persistedHash,
				fsModule: fs
			})) {
				restoreEnvChangesIfUnchanged({
					env: io.env,
					before: envBeforeCanonicalRead,
					after: envAfterCanonicalRead
				});
				writeResult[configWritePostCommitRollback]?.();
			}
		} catch (rollbackError) {
			throw new ConfigRuntimeRefreshError(`${formatErrorMessage(error)} Rollback failed: ${formatErrorMessage(rollbackError)}`, { cause: error });
		}
		throw error;
	}
	return writeResult;
}
//#endregion
//#region src/config/runtime-source-projection.ts
function isCompatibleTopLevelRuntimeProjectionShape(params) {
	const runtime = params.runtimeSnapshot;
	const candidate = params.candidate;
	for (const key of Object.keys(runtime)) {
		if (!Object.hasOwn(candidate, key)) return false;
		const runtimeValue = runtime[key];
		const candidateValue = candidate[key];
		if ((Array.isArray(runtimeValue) ? "array" : runtimeValue === null ? "null" : typeof runtimeValue) !== (Array.isArray(candidateValue) ? "array" : candidateValue === null ? "null" : typeof candidateValue)) return false;
	}
	return true;
}
/** Projects a runtime-derived config back onto the active authored source snapshot. */
function projectConfigOntoRuntimeSourceSnapshot(config) {
	const runtimeConfigSnapshot = getRuntimeConfigSnapshot();
	const runtimeConfigSourceSnapshot = getRuntimeConfigSourceSnapshot();
	if (!runtimeConfigSnapshot || !runtimeConfigSourceSnapshot) return config;
	if (config === runtimeConfigSnapshot) return runtimeConfigSourceSnapshot;
	if (!isCompatibleTopLevelRuntimeProjectionShape({
		runtimeSnapshot: runtimeConfigSnapshot,
		candidate: config
	})) return config;
	return applyMergePatch(projectSourceOntoRuntimeShape(runtimeConfigSourceSnapshot, runtimeConfigSnapshot), createMergePatch(runtimeConfigSnapshot, config));
}
//#endregion
export { AUTO_MANAGED_CONFIG_META_PATHS as $, warnIfJSON5CommentsWillBeStripped as A, captureConfigOverrideApplier as B, resolveWriteEnvSnapshotForPath as C, maintainConfigBackups as D, createPreUpdateConfigSnapshot as E, validateConfigObjectRaw as F, asResolvedSourceConfig as G, resetConfigOverrides as H, collectUnsupportedSecretRefPolicyIssues as I, resolveNormalizedProviderModelMaxTokens as J, asRuntimeConfig as K, collectChannelSchemaMetadataCore as L, validateConfigObjectRawWithPlugins as M, validateConfigObjectWithPlugins as N, applyUnsetPathsForWrite as O, validateConfigObject as P, ConfigMutationConflictError as Q, collectPluginSchemaMetadataCore as R, ConfigRuntimeRefreshError as S, collectChangedPaths as T, setConfigOverride as U, getConfigOverrides as V, unsetConfigOverride as W, resolveAgentMaxConcurrent as X, normalizeProviderConfigForConfigDefaults as Y, resolveSubagentMaxConcurrent as Z, recoverConfigFromLastKnownGood as _, preserveConfigSnapshotAsClobbered as a, applyLegacyDoctorMigrations as at, createConfigIO as b, readBestEffortConfigSnapshot as c, containsAuthoredInclude as ct, readConfigFileSnapshotForWrite as d, resolveOwnerPromptNumbers as dt, containsConfigIncludeDirective as et, readConfigFileSnapshotWithPluginMetadata as f, recoverConfigFromJsonRootSuffix as g, readSourceConfigSnapshotForWrite as h, loadConfig as i, snapshotEnv as it, resolveModelIdNormalizationPolicies as j, resolveManagedUnsetPathsForWrite as k, readConfigFileSnapshot as l, isSingleTopLevelIncludeMigration as lt, readSourceConfigSnapshot as m, clearConfigCache as n, resolveConfigSnapshotHash as nt, promoteConfigSnapshotToLastKnownGood as o, applyChannelDoctorCompatibilityMigrations as ot, readSourceConfigBestEffort as p, DEFAULT_MODEL_ALIASES as q, getRuntimeConfig as r, restoreEnvChangesIfUnchanged as rt, readBestEffortConfig as s, classifyOtelGrpcMigrationOwnership as st, projectConfigOntoRuntimeSourceSnapshot as t, parseConfigJson5 as tt, readConfigFileSnapshotForRuntimeTransaction as u, resolveOwnerDisplaySetting as ut, registerConfigWriteListener as v, restoreEnvVarRefs as w, projectSourceOntoRuntimeShape as x, writeConfigFile as y, applyConfigOverrides as z };
