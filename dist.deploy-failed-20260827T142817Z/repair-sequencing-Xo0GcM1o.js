import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import "./src-BkwWvwB2.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { r as asNullableRecord } from "./record-coerce-DItp3I4t.js";
import { m as normalizeUniqueStringEntries } from "./string-normalization-e_fvmxMf.js";
import { E as isMissingPathError } from "./redact-Cl7lwBnl.js";
import { s as pathExists } from "./absolute-path-BseY-yOe.js";
import { r as root } from "./fs-safe-C9N8pCh1.js";
import { w as resolveStateDir } from "./paths-CqeDjSA4.js";
import "./errors-CSNUPl5U.js";
import { t as sanitizeForLog } from "./ansi-DjDeieuH.js";
import "./agent-scope-BizOtGGz.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { a as listAgentIds, b as tryResolveLegacyCompatibilityAgentId, d as resolveAgentWorkspaceDir, x as tryResolveSoleAgentId } from "./agent-scope-config-BdXMWufB.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { n as normalizeAccountId } from "./account-id-BRqK6RmF.js";
import { N as validateConfigObjectWithPlugins } from "./io-D1h6pxaD.js";
import { a as GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA, i as normalizeChatChannelId } from "./ids-BDKYF0d6.js";
import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync, r as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D5QeoU_L.js";
import { Mt as tableExists, d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-CXrhNigN.js";
import "./legacy.default-agent-owner-D8ws5hED.js";
import { i as loadPluginMetadataSnapshot } from "./plugin-metadata-snapshot-BfWhFzZN.js";
import "./registry-BYAHQp83.js";
import { t as normalizeAnyChannelId } from "./registry-normalize-D2WRwH5s.js";
import { a as resolveChannelDmAllowFrom, s as setCanonicalDmAllowFrom } from "./dm-access-C_vMmAfR.js";
import { i as materializePluginAutoEnableCandidates, t as applyPluginAutoEnable } from "./plugin-auto-enable-CAomcfJT.js";
import { d as resolveWorkspaceStateIdentity } from "./workspace-state-store-UQmL7k4K.js";
import { a as ensureUserProfilesSchema, g as classifyTailscaleLogin } from "./user-profiles-eJiEIUE1.js";
import { C as readSkillProposalRollback, L as hashSkillProposalContent, M as validateSkillProposalRecord, N as validateSkillProposalRollback, a as readSkillProposal, n as importLegacySkillProposal } from "./store-BAGUKOT2.js";
import { t as removePathWithinRoot } from "./fs-safe-remove-DW6J9gUb.js";
import { s as readChannelAllowFromStore } from "./pairing-store-BmIXp5gX.js";
import { r as maybeRepairCodexRoutes } from "./codex-route-warnings-BRCw6THo.js";
import { r as VERSION_BOUND_RUNTIME_PLUGIN_POLICY_IDS_BY_SURFACE } from "./configured-runtime-plugin-installs-Q-6qNNB5.js";
import { d as isUpdatePackageSwapInProgress } from "./update-phase-sBAgYpaQ.js";
import { t as repairMissingConfiguredPluginInstalls } from "./missing-configured-plugin-install-Co957f-a.js";
import { n as maybeMigrateAuthProfileJsonStoresToSqlite, r as maybeRepairOpenAICodexAuthConfig, t as collectOpenAICodexAuthProfileStoreIdMap } from "./doctor-auth-flat-profiles-B30BXm8R.js";
import { t as maybeRepairLegacyOAuthSidecarProfiles } from "./doctor-auth-oauth-sidecar-BDLLLe1M.js";
import { r as resolveConfigWideDoctorPluginMetadataSnapshot } from "./plugin-metadata-snapshot-scope-ppkK70NK.js";
import { t as applyDoctorConfigMutation } from "./config-mutation-state-BcUMmqz1.js";
import { o as maybeRepairPluginOpenClawHostLinks, r as maybeRepairStaleManagedNpmBundledPlugins } from "./doctor-plugin-registry--hKGTeDj.js";
import { t as getDoctorChannelCapabilities } from "./channel-capabilities-BThzaCna.js";
import { n as hasAllowFromEntries, t as scanEmptyAllowlistPolicyWarnings } from "./empty-allowlist-scan-BtQA4fa7.js";
import { n as maybeRepairBundledPluginLoadPaths } from "./bundled-plugin-load-paths-jIsGSVP9.js";
import { a as collectChannelDoctorRepairMutations, s as createChannelDoctorEmptyAllowlistPolicyHooks, t as collectChannelDoctorCompatibilityMutations } from "./channel-doctor-DgxaZfC7.js";
import { n as maybeRepairContextEngineHostCompatibility } from "./context-engine-host-compat-BghTFfgG.js";
import { r as maybeRepairExecSafeBinProfiles } from "./exec-safe-bins-kmzryD43.js";
import { n as maybeRepairLegacyToolsBySenderKeys } from "./legacy-tools-by-sender-D-sF95Zj.js";
import { n as maybeRepairOpenPolicyAllowFrom } from "./open-policy-allowfrom-BdMdhURC.js";
import { t as cleanupLegacyPluginDependencyState } from "./plugin-dependency-cleanup-DQIHN9PW.js";
import { t as repairStaleAgentModelRefs } from "./stale-agent-model-ref-repair-BRc5G604.js";
import { n as maybeRepairStaleConfiguredAuthOrders } from "./stale-auth-order-BqLsbVD5.js";
import { n as repairStaleOAuthProfileShadows } from "./stale-oauth-profile-shadows-BQHp8-0E.js";
import { r as maybeRepairStalePluginConfig } from "./stale-plugin-config-3npcofjy.js";
import { n as maybeRepairStaleSubagentAllowlists } from "./stale-subagent-allowlist-ORqnxK8I.js";
import { existsSync } from "node:fs";
import path from "node:path";
//#region src/infra/state-migrations.onboarding-recommendations.ts
const LEGACY_ONBOARDING_RECOMMENDATIONS_KEY = "primary";
/** Move the shipped singleton row into the default workspace during doctor repair. */
function migrateLegacyOnboardingRecommendationsScope(params) {
	const env = params.env ?? process.env;
	if (!existsSync(resolveOpenClawStateSqlitePath(env))) return {
		changes: [],
		warnings: []
	};
	try {
		const migrationAgentId = tryResolveLegacyCompatibilityAgentId(params.cfg);
		const workspaceKey = migrationAgentId ? resolveWorkspaceStateIdentity(resolveAgentWorkspaceDir(params.cfg, migrationAgentId, env)).workspaceKey : void 0;
		const outcome = runOpenClawStateWriteTransaction(({ db: writeDatabase }) => {
			const writeDb = getNodeSqliteKysely(writeDatabase);
			if (!executeSqliteQueryTakeFirstSync(writeDatabase, writeDb.selectFrom("onboarding_recommendations").select("config_key").where("config_key", "=", LEGACY_ONBOARDING_RECOMMENDATIONS_KEY))) return "unchanged";
			if (!workspaceKey) return "deferred";
			if (executeSqliteQueryTakeFirstSync(writeDatabase, writeDb.selectFrom("onboarding_recommendations").select("config_key").where("config_key", "=", workspaceKey))) {
				executeSqliteQuerySync(writeDatabase, writeDb.deleteFrom("onboarding_recommendations").where("config_key", "=", LEGACY_ONBOARDING_RECOMMENDATIONS_KEY));
				return "removed-legacy";
			}
			executeSqliteQuerySync(writeDatabase, writeDb.updateTable("onboarding_recommendations").set({ config_key: workspaceKey }).where("config_key", "=", LEGACY_ONBOARDING_RECOMMENDATIONS_KEY));
			return "migrated";
		}, { env }, { operationLabel: "onboarding.recommendations.migrate-scope" });
		if (outcome === "migrated") return {
			changes: ["Migrated onboarding recommendation state to the legacy owner workspace scope."],
			warnings: []
		};
		if (outcome === "removed-legacy") return {
			changes: ["Removed ambiguous legacy onboarding recommendation state; kept the legacy owner workspace record."],
			warnings: []
		};
		if (outcome === "deferred") return {
			changes: [],
			warnings: ["Deferred legacy onboarding recommendation migration: no owner is selected"]
		};
		return {
			changes: [],
			warnings: []
		};
	} catch (err) {
		return {
			changes: [],
			warnings: [`Failed migrating onboarding recommendation workspace scope: ${String(err)}`]
		};
	}
}
//#endregion
//#region src/state/user-profiles-tailscale-migration.ts
function migrateLegacyTailscaleProfileIdentities(options = {}) {
	const database = openOpenClawStateDatabase(options);
	if (!tableExists(database.db, "user_profile_emails")) return {
		changes: [],
		warnings: []
	};
	const kysely = getNodeSqliteKysely(database.db);
	const legacyRows = executeSqliteQuerySync(database.db, kysely.selectFrom("user_profile_emails").select([
		"email",
		"profile_id",
		"created_at"
	]).orderBy("email", "asc")).rows.flatMap((row) => {
		const classified = classifyTailscaleLogin(row.email);
		return classified.kind === "provider" ? [{
			...row,
			...classified
		}] : [];
	});
	if (legacyRows.length === 0) return {
		changes: [],
		warnings: []
	};
	ensureUserProfilesSchema(options);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const transactionKysely = getNodeSqliteKysely(db);
		let migrated = 0;
		const warnings = [];
		for (const row of legacyRows) {
			executeSqliteQuerySync(db, transactionKysely.insertInto("user_profile_identities").values({
				provider: row.provider,
				subject: row.subject,
				profile_id: row.profile_id,
				created_at: row.created_at
			}).onConflict((conflict) => conflict.columns(["provider", "subject"]).doNothing()));
			if (executeSqliteQueryTakeFirstSync(db, transactionKysely.selectFrom("user_profile_identities").select("profile_id").where("provider", "=", row.provider).where("subject", "=", row.subject))?.profile_id !== row.profile_id) {
				warnings.push(`Kept legacy profile login ${row.email}: ${row.provider} identity is already linked to another profile.`);
				continue;
			}
			executeSqliteQuerySync(db, transactionKysely.deleteFrom("user_profile_emails").where("email", "=", row.email).where("profile_id", "=", row.profile_id));
			migrated += 1;
		}
		return {
			changes: migrated > 0 ? [`Moved ${migrated} legacy Tailscale provider ${migrated === 1 ? "identity" : "identities"} out of user profile email aliases.`] : [],
			warnings
		};
	}, options, { operationLabel: "user-profiles.migrate-legacy-identities" });
}
//#endregion
//#region src/commands/doctor-skill-workshop-sqlite.ts
/** Doctor-owned migration of Skill Workshop proposal metadata into shared SQLite. */
const WORKSHOP_DIR = "skill-workshop";
const PROPOSALS_DIR = `${WORKSHOP_DIR}/proposals`;
const MANIFEST_PATH = `${WORKSHOP_DIR}/proposals.json`;
const MAX_RECORD_BYTES = 1024 * 1024;
const MAX_ROLLBACK_BYTES = 128 * 1024 * 1024;
const PROPOSAL_ID_PATTERN = /^[a-z0-9][a-z0-9-]{5,120}$/;
async function readJson(rootDir, relativePath, maxBytes) {
	const read = await rootDir.read(relativePath, {
		hardlinks: "reject",
		maxBytes,
		symlinks: "reject"
	});
	return JSON.parse(read.buffer.toString("utf8"));
}
function proposalWorkspace(record) {
	return path.dirname(path.dirname(path.resolve(record.target.skillDir)));
}
function configuredAgentIds(config) {
	return listAgentIds(config);
}
function inferOwnerAgentId(params) {
	if (params.record.origin?.agentId) return normalizeAgentId(params.record.origin.agentId);
	if (params.record.origin?.sessionKey) {
		const sessionAgentId = parseAgentSessionKey(params.record.origin.sessionKey)?.agentId;
		if (sessionAgentId) return normalizeAgentId(sessionAgentId);
	}
	const agentIds = configuredAgentIds(params.config);
	const workspaceMatches = agentIds.filter((agentId) => path.resolve(resolveAgentWorkspaceDir(params.config, agentId, params.env)) === path.resolve(params.workspaceDir));
	if (workspaceMatches.length === 1) return workspaceMatches[0];
	return agentIds.length === 1 ? agentIds[0] : void 0;
}
async function readLegacyRollback(stateRoot, proposalId) {
	try {
		const rollback = validateSkillProposalRollback(await readJson(stateRoot, `${PROPOSALS_DIR}/${proposalId}/rollback.json`, MAX_ROLLBACK_BYTES));
		if (!rollback.ok) throw new Error(rollback.error.message);
		if (rollback.value.proposalId !== proposalId) throw new Error("invalid rollback metadata");
		return rollback.value;
	} catch (error) {
		if (isMissingPathError(error)) return;
		throw error;
	}
}
async function verifyImportedProposal(params) {
	const imported = (await readSkillProposal(params.record.id, { env: params.env }, {}, { reconcile: false }))?.record;
	if (!imported || imported.draftHash !== params.record.draftHash || imported.target.skillFile !== params.record.target.skillFile) throw new Error("SQLite verification failed");
	if (params.rollback && !await readSkillProposalRollback(params.record.id, { env: params.env })) throw new Error("SQLite rollback verification failed");
}
async function migrateProposal(params) {
	const proposalDir = `${PROPOSALS_DIR}/${params.proposalId}`;
	const record = validateSkillProposalRecord(await readJson(params.stateRoot, `${proposalDir}/proposal.json`, MAX_RECORD_BYTES));
	if (!record.ok) throw new Error(record.error.message);
	if (record.value.id !== params.proposalId) throw new Error("invalid proposal metadata");
	if (hashSkillProposalContent((await params.stateRoot.read(`${proposalDir}/PROPOSAL.md`, {
		hardlinks: "reject",
		maxBytes: MAX_RECORD_BYTES,
		symlinks: "reject"
	})).buffer.toString("utf8")) !== record.value.draftHash) throw new Error("proposal draft hash does not match proposal metadata");
	const rollback = await readLegacyRollback(params.stateRoot, params.proposalId);
	const workspaceDir = proposalWorkspace(record.value);
	const ownerAgentId = inferOwnerAgentId({
		config: params.config,
		env: params.env,
		record: record.value,
		workspaceDir
	});
	if (!ownerAgentId) throw new Error("owning agent could not be inferred; legacy metadata was retained for manual recovery");
	const result = importLegacySkillProposal({
		record: record.value,
		rollback,
		ownerAgentId,
		workspaceDir,
		store: { env: params.env }
	});
	await verifyImportedProposal({
		env: params.env,
		record: record.value,
		rollback
	});
	if (rollback) await params.stateRoot.remove(`${proposalDir}/rollback.json`);
	await params.stateRoot.remove(`${proposalDir}/proposal.json`);
	return result;
}
/** Import verified legacy proposal sidecars, then remove only the imported JSON metadata. */
async function migrateLegacySkillWorkshopProposals(params) {
	const env = params.env ?? process.env;
	const stateDir = resolveStateDir(env);
	if (!await pathExists(path.join(stateDir, PROPOSALS_DIR))) {
		if (!await pathExists(path.join(stateDir, MANIFEST_PATH))) return {
			changes: [],
			warnings: [],
			detected: 0,
			migrated: 0
		};
		await removePathWithinRoot({
			rootDir: stateDir,
			relativePath: MANIFEST_PATH
		});
		return {
			changes: ["Removed the empty legacy Skill Workshop proposal index."],
			warnings: [],
			detected: 0,
			migrated: 0
		};
	}
	const stateRoot = await root(stateDir);
	let entries;
	try {
		entries = await stateRoot.list(PROPOSALS_DIR, { withFileTypes: true });
	} catch (error) {
		if (error.code === "not-found") return {
			changes: [],
			warnings: [],
			detected: 0,
			migrated: 0
		};
		return {
			changes: [],
			warnings: [`Failed to inspect legacy Skill Workshop proposals: ${String(error)}`],
			detected: 0,
			migrated: 0
		};
	}
	const proposalIds = entries.filter((entry) => entry.isDirectory && PROPOSAL_ID_PATTERN.test(entry.name)).map((entry) => entry.name).toSorted((left, right) => left.localeCompare(right));
	const warnings = [];
	let migrated = 0;
	for (const proposalId of proposalIds) try {
		await migrateProposal({
			config: params.config,
			env,
			proposalId,
			stateRoot
		});
		migrated += 1;
	} catch (error) {
		if (isMissingPathError(error)) {
			if (await readSkillProposal(proposalId, { env }, {}, { reconcile: false })) continue;
		}
		warnings.push(`Failed to migrate Skill Workshop proposal ${proposalId}: ${String(error)}`);
	}
	await removePathWithinRoot({
		rootDir: stateDir,
		relativePath: MANIFEST_PATH
	}).catch((error) => {
		if (!isMissingPathError(error)) warnings.push(`Failed to remove legacy Skill Workshop proposal index: ${String(error)}`);
	});
	return {
		changes: migrated > 0 ? [`Migrated ${migrated} Skill Workshop proposal${migrated === 1 ? "" : "s"} into shared SQLite.`] : [],
		warnings,
		detected: proposalIds.length,
		migrated
	};
}
//#endregion
//#region src/commands/doctor/shared/allowfrom-fallback-migration.ts
const PSEUDO_CHANNEL_KEYS = /* @__PURE__ */ new Set([
	"defaults",
	"modelByChannel",
	"tools"
]);
const ACCOUNT_SCHEMA_WILDCARD = "*";
const CHANNEL_GROUP_ALLOW_FROM_PATH = ["groupAllowFrom"];
const ACCOUNT_GROUP_ALLOW_FROM_PATH = [
	"accounts",
	ACCOUNT_SCHEMA_WILDCARD,
	"groupAllowFrom"
];
function isDisabled(record) {
	return record.enabled === false;
}
function normalizeAllowFrom(raw) {
	return normalizeUniqueStringEntries(Array.isArray(raw) ? raw : []);
}
function readGroupAllowFrom(record) {
	return normalizeAllowFrom(record.groupAllowFrom);
}
function readDmAllowFrom(params) {
	return normalizeAllowFrom(resolveChannelDmAllowFrom({
		account: params.account,
		parent: params.parent,
		mode: getDoctorChannelCapabilities(params.channelName).dmAllowFromMode
	}));
}
function readOwnDmAllowFrom(params) {
	return normalizeAllowFrom(resolveChannelDmAllowFrom({
		account: params.account,
		mode: getDoctorChannelCapabilities(params.channelName).dmAllowFromMode
	}));
}
function findGeneratedChannelConfigSchema(channelName) {
	const normalizedChannelId = normalizeAnyChannelId(channelName);
	return GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA.find((entry) => entry.channelId === channelName || entry.channelId === normalizedChannelId)?.schema;
}
function schemaAllowsConfigPath(schema, path) {
	if (path.length === 0) return true;
	const node = asNullableRecord(schema);
	if (!node) return true;
	const anyOf = Array.isArray(node.anyOf) ? node.anyOf : void 0;
	if (anyOf) return anyOf.some((branch) => schemaAllowsConfigPath(branch, path));
	const oneOf = Array.isArray(node.oneOf) ? node.oneOf : void 0;
	if (oneOf) return oneOf.some((branch) => schemaAllowsConfigPath(branch, path));
	const allOf = Array.isArray(node.allOf) ? node.allOf : void 0;
	if (allOf) return allOf.every((branch) => schemaAllowsConfigPath(branch, path));
	const segment = expectDefined(path[0], "schema path segment");
	const rest = path.slice(1);
	const properties = asNullableRecord(node.properties);
	if (segment !== ACCOUNT_SCHEMA_WILDCARD && properties && Object.hasOwn(properties, segment)) return schemaAllowsConfigPath(expectDefined(properties[segment], "schema property"), rest);
	const additionalProperties = node.additionalProperties;
	if (additionalProperties === false) return false;
	if (additionalProperties && typeof additionalProperties === "object") return schemaAllowsConfigPath(additionalProperties, rest);
	return true;
}
function generatedSchemaAllowsGroupAllowFrom(channelName, path) {
	const schema = findGeneratedChannelConfigSchema(channelName);
	return schema !== void 0 && schemaAllowsConfigPath(schema, path);
}
function migrateRecord(params) {
	if (!params.canWriteGroupAllowFrom) return false;
	if (readGroupAllowFrom(params.account).length > 0) return false;
	if (params.parent && params.parentHadGroupAllowFrom) return false;
	const ownAllowFrom = readOwnDmAllowFrom(params);
	if (params.parent && ownAllowFrom.length === 0 && readGroupAllowFrom(params.parent).length > 0) return false;
	const allowFrom = readDmAllowFrom(params);
	if (allowFrom.length === 0) return false;
	params.account.groupAllowFrom = allowFrom;
	const noun = allowFrom.length === 1 ? "entry" : "entries";
	params.changes.push(`${params.prefix}.groupAllowFrom: copied ${allowFrom.length} sender ${noun} from allowFrom for explicit group allowlist.`);
	return true;
}
/** Copy legacy allowFrom entries into groupAllowFrom where channel metadata permits fallback. */
function maybeRepairGroupAllowFromFallback(cfg) {
	if (!asNullableRecord(cfg.channels)) return {
		config: cfg,
		changes: []
	};
	const next = structuredClone(cfg);
	const nextChannels = next.channels;
	const changes = [];
	for (const [channelName, channelConfig] of Object.entries(nextChannels)) {
		if (PSEUDO_CHANNEL_KEYS.has(channelName) || !channelConfig || typeof channelConfig !== "object") continue;
		if (isDisabled(channelConfig)) continue;
		if (!getDoctorChannelCapabilities(channelName).groupAllowFromFallbackToAllowFrom) continue;
		const hadGroupAllowFrom = readGroupAllowFrom(channelConfig).length > 0;
		migrateRecord({
			account: channelConfig,
			canWriteGroupAllowFrom: generatedSchemaAllowsGroupAllowFrom(channelName, CHANNEL_GROUP_ALLOW_FROM_PATH),
			channelName,
			changes,
			prefix: `channels.${channelName}`
		});
		const accounts = asNullableRecord(channelConfig.accounts);
		if (!accounts) continue;
		const canWriteAccountGroupAllowFrom = generatedSchemaAllowsGroupAllowFrom(channelName, ACCOUNT_GROUP_ALLOW_FROM_PATH);
		for (const [accountId, accountConfig] of Object.entries(accounts)) {
			const account = asNullableRecord(accountConfig);
			if (!account || isDisabled(account)) continue;
			migrateRecord({
				account,
				canWriteGroupAllowFrom: canWriteAccountGroupAllowFrom,
				channelName,
				changes,
				parent: channelConfig,
				parentHadGroupAllowFrom: hadGroupAllowFrom,
				prefix: `channels.${channelName}.accounts.${accountId}`
			});
		}
	}
	if (changes.length === 0) return {
		config: cfg,
		changes: []
	};
	return {
		config: next,
		changes
	};
}
//#endregion
//#region src/commands/doctor/shared/allow-from-mode.ts
/** Return the allowFrom interpretation mode advertised by a channel's doctor metadata. */
function resolveAllowFromMode(channelName) {
	return getDoctorChannelCapabilities(channelName).dmAllowFromMode;
}
//#endregion
//#region src/commands/doctor/shared/allowlist-policy-repair.ts
/** Restore missing allowFrom entries for allowlist DM policies from persisted pairing stores. */
async function maybeRepairAllowlistPolicyAllowFrom(cfg) {
	const channels = cfg.channels;
	if (!channels || typeof channels !== "object") return {
		config: cfg,
		changes: []
	};
	const next = structuredClone(cfg);
	const changes = [];
	const applyRecoveredAllowFrom = (params) => {
		const count = params.allowFrom.length;
		const noun = count === 1 ? "entry" : "entries";
		setCanonicalDmAllowFrom({
			entry: params.account,
			mode: params.mode,
			allowFrom: params.allowFrom,
			pathPrefix: params.prefix,
			changes,
			reason: `restored ${count} sender ${noun} from pairing store (dmPolicy="allowlist").`
		});
	};
	const recoverAllowFromForAccount = async (params) => {
		const dmEntry = params.account.dm;
		const dm = dmEntry && typeof dmEntry === "object" && !Array.isArray(dmEntry) ? dmEntry : void 0;
		if ((params.account.dmPolicy ?? dm?.policy) !== "allowlist") return;
		const topAllowFrom = params.account.allowFrom;
		const nestedAllowFrom = dm?.allowFrom;
		if (hasAllowFromEntries(topAllowFrom) || hasAllowFromEntries(nestedAllowFrom)) return;
		const normalizedChannelId = normalizeOptionalLowercaseString(normalizeChatChannelId(params.channelName) ?? params.channelName);
		if (!normalizedChannelId) return;
		const normalizedAccountId = normalizeAccountId(params.accountId) || "default";
		const recovered = normalizeUniqueStringEntries(await readChannelAllowFromStore(normalizedChannelId, process.env, normalizedAccountId).catch(() => []));
		if (recovered.length === 0) return;
		applyRecoveredAllowFrom({
			account: params.account,
			allowFrom: recovered,
			mode: resolveAllowFromMode(params.channelName),
			prefix: params.prefix
		});
	};
	const nextChannels = next.channels;
	for (const [channelName, channelConfig] of Object.entries(nextChannels)) {
		if (!channelConfig || typeof channelConfig !== "object") continue;
		if (channelConfig.enabled === false) continue;
		await recoverAllowFromForAccount({
			channelName,
			account: channelConfig,
			prefix: `channels.${channelName}`
		});
		const accounts = asNullableRecord(channelConfig.accounts);
		if (!accounts) continue;
		for (const [accountId, accountConfig] of Object.entries(accounts)) {
			if (!accountConfig || typeof accountConfig !== "object") continue;
			if (accountConfig.enabled === false) continue;
			await recoverAllowFromForAccount({
				channelName,
				account: accountConfig,
				accountId,
				prefix: `channels.${channelName}.accounts.${accountId}`
			});
		}
	}
	if (changes.length === 0) return {
		config: cfg,
		changes: []
	};
	return {
		config: next,
		changes
	};
}
//#endregion
//#region src/commands/doctor/shared/invalid-plugin-config.ts
const PLUGIN_CONFIG_ISSUE_RE = /^plugins\.entries\.([^.]+)\.config(?:\.|$)/;
function scanInvalidPluginConfig(cfg) {
	const validation = validateConfigObjectWithPlugins(cfg);
	if (validation.ok) return [];
	const hits = [];
	const seen = /* @__PURE__ */ new Set();
	for (const issue of validation.issues) {
		if (!issue.message.startsWith("invalid config:")) continue;
		const pluginId = issue.path.match(PLUGIN_CONFIG_ISSUE_RE)?.[1];
		if (!pluginId || seen.has(pluginId)) continue;
		seen.add(pluginId);
		hits.push({
			pluginId,
			pathLabel: `plugins.entries.${pluginId}.config`
		});
	}
	return hits;
}
/** Disable plugin entries and clear config when plugin validation marks their config invalid. */
function maybeRepairInvalidPluginConfig(cfg) {
	const hits = scanInvalidPluginConfig(cfg);
	if (hits.length === 0) return {
		config: cfg,
		changes: []
	};
	const next = structuredClone(cfg);
	const entries = asNullableRecord(next.plugins?.entries);
	if (!entries) return {
		config: cfg,
		changes: []
	};
	const quarantined = [];
	for (const hit of hits) {
		const entry = asNullableRecord(entries[hit.pluginId]);
		if (!entry) continue;
		if ("config" in entry) delete entry.config;
		entry.enabled = false;
		quarantined.push(hit.pluginId);
	}
	if (quarantined.length === 0) return {
		config: cfg,
		changes: []
	};
	return {
		config: next,
		changes: [sanitizeForLog(`- plugins.entries: quarantined ${quarantined.length} invalid plugin config${quarantined.length === 1 ? "" : "s"} (${quarantined.join(", ")})`)]
	};
}
//#endregion
//#region src/commands/doctor/repair-sequencing.ts
/** Run doctor auto-repairs in dependency order and collect sanitized user notes. */
async function runDoctorRepairSequence(params) {
	let state = params.state;
	const pluginMetadataSnapshotState = params.pluginMetadataSnapshotState ?? {};
	const changeNotes = [];
	const warningNotes = [];
	const env = params.env ?? process.env;
	const resolveCurrentPluginMetadataScope = () => {
		const config = state.candidate;
		const soleAgentId = tryResolveSoleAgentId(config);
		return {
			config,
			workspaceDir: soleAgentId ? resolveAgentWorkspaceDir(config, soleAgentId, env) : void 0
		};
	};
	const sanitizeLines = (lines) => lines.map((line) => sanitizeForLog(line)).join("\n");
	const appendNotes = (notes, lines) => {
		if (lines && lines.length > 0) notes.push(sanitizeLines(lines));
	};
	const appendRepairNotes = (repair) => {
		appendNotes(changeNotes, repair.changes);
		appendNotes(warningNotes, repair.warnings);
		appendNotes(warningNotes, repair.notices);
	};
	const runWithCurrentPluginMetadata = (run) => {
		if (!params.runWithPluginMetadataSnapshot) return run();
		return params.runWithPluginMetadataSnapshot(resolveCurrentPluginMetadataScope(), run);
	};
	const applyMutation = (mutation) => {
		if (mutation.changes.length > 0) {
			appendNotes(changeNotes, mutation.changes);
			state = applyDoctorConfigMutation({
				state,
				mutation,
				shouldRepair: true
			});
		}
		appendNotes(warningNotes, mutation.warnings);
	};
	const applyRepairStages = async (stages) => {
		for (const repair of stages) applyMutation(await runWithCurrentPluginMetadata(() => repair(state.candidate)));
	};
	const initialChannelRepairs = await runWithCurrentPluginMetadata(() => collectChannelDoctorRepairMutations({
		cfg: state.candidate,
		doctorFixCommand: params.doctorFixCommand,
		env
	}));
	for (const mutation of initialChannelRepairs) applyMutation(mutation);
	applyMutation(maybeRepairBundledPluginLoadPaths(state.candidate, env));
	const staleManagedNpmBundledPluginRepair = maybeRepairStaleManagedNpmBundledPlugins({
		config: state.candidate,
		env,
		prompter: { shouldRepair: true }
	});
	const repairedPluginOpenClawHostLinks = await maybeRepairPluginOpenClawHostLinks({
		env,
		prompter: { shouldRepair: true }
	});
	const codexRouteRepair = runWithCurrentPluginMetadata(() => maybeRepairCodexRoutes({
		cfg: state.candidate,
		env,
		shouldRepair: true,
		blockedProviderPlan: params.blockedCodexProviderPlan
	}));
	applyMutation({
		config: codexRouteRepair.cfg,
		changes: codexRouteRepair.changes,
		warnings: codexRouteRepair.warnings
	});
	const openAICodexAuthProfileIdMap = collectOpenAICodexAuthProfileStoreIdMap({
		cfg: state.candidate,
		env
	});
	applyMutation(maybeRepairOpenAICodexAuthConfig(state.candidate, { profileIdMap: openAICodexAuthProfileIdMap }));
	applyMutation(await runWithCurrentPluginMetadata(() => maybeRepairContextEngineHostCompatibility({
		cfg: state.candidate,
		doctorFixCommand: params.doctorFixCommand,
		env
	})));
	const missingConfiguredPluginInstallRepair = await runWithCurrentPluginMetadata(() => repairMissingConfiguredPluginInstalls({
		cfg: state.candidate,
		env,
		...staleManagedNpmBundledPluginRepair ? { baselineRecords: staleManagedNpmBundledPluginRepair.installRecords } : {}
	}));
	const repairedPluginIds = missingConfiguredPluginInstallRepair.repairedPluginIds ?? [];
	if (staleManagedNpmBundledPluginRepair || repairedPluginOpenClawHostLinks || missingConfiguredPluginInstallRepair.pluginInventoryChanged) {
		const currentScope = resolveCurrentPluginMetadataScope();
		pluginMetadataSnapshotState.current = resolveConfigWideDoctorPluginMetadataSnapshot({
			snapshot: loadPluginMetadataSnapshot({
				config: currentScope.config,
				env,
				workspaceDir: currentScope.workspaceDir
			}),
			config: currentScope.config,
			env
		});
	}
	if (missingConfiguredPluginInstallRepair.changes.length > 0) {
		appendNotes(changeNotes, missingConfiguredPluginInstallRepair.changes);
		applyMutation(applyPluginAutoEnable({
			config: state.candidate,
			env,
			manifestRegistry: pluginMetadataSnapshotState.current?.manifestRegistry
		}));
		if (repairedPluginIds.length > 0) {
			applyMutation(materializePluginAutoEnableCandidates({
				config: state.candidate,
				env,
				manifestRegistry: pluginMetadataSnapshotState.current?.manifestRegistry,
				candidates: repairedPluginIds.map((pluginId) => ({
					pluginId,
					kind: "configured-plugin-repaired"
				}))
			}));
			const channelCompatibilityMutations = runWithCurrentPluginMetadata(() => collectChannelDoctorCompatibilityMutations(state.candidate, { env }));
			for (const mutation of channelCompatibilityMutations) applyMutation(mutation);
			const channelRepairs = await runWithCurrentPluginMetadata(() => collectChannelDoctorRepairMutations({
				cfg: state.candidate,
				doctorFixCommand: params.doctorFixCommand,
				env
			}));
			for (const mutation of channelRepairs) applyMutation(mutation);
		}
	}
	appendNotes(warningNotes, missingConfiguredPluginInstallRepair.warnings);
	appendNotes(warningNotes, missingConfiguredPluginInstallRepair.notices);
	const failedPluginIds = missingConfiguredPluginInstallRepair.failedPluginIds ?? [];
	const hasUnscopedInstallRepairWarnings = missingConfiguredPluginInstallRepair.warnings.length > 0 && failedPluginIds.length === 0;
	const packageSwapInProgress = isUpdatePackageSwapInProgress(env);
	if (!packageSwapInProgress && failedPluginIds.length === 0 && !hasUnscopedInstallRepairWarnings) applyMutation(repairStaleAgentModelRefs(state.candidate, {
		env,
		pluginMetadataSnapshot: pluginMetadataSnapshotState.current
	}));
	if (!packageSwapInProgress && !hasUnscopedInstallRepairWarnings) applyMutation(runWithCurrentPluginMetadata(() => maybeRepairStalePluginConfig(state.candidate, env, {
		preservePluginIds: failedPluginIds,
		surfacePreservePluginIds: VERSION_BOUND_RUNTIME_PLUGIN_POLICY_IDS_BY_SURFACE
	})));
	await applyRepairStages([
		maybeRepairInvalidPluginConfig,
		maybeRepairAllowlistPolicyAllowFrom,
		maybeRepairOpenPolicyAllowFrom,
		maybeRepairGroupAllowFromFallback,
		maybeRepairStaleSubagentAllowlists
	]);
	appendNotes(warningNotes, runWithCurrentPluginMetadata(() => scanEmptyAllowlistPolicyWarnings(state.candidate, {
		doctorFixCommand: params.doctorFixCommand,
		...createChannelDoctorEmptyAllowlistPolicyHooks({
			cfg: state.candidate,
			env
		})
	})));
	await applyRepairStages([maybeRepairLegacyToolsBySenderKeys, maybeRepairExecSafeBinProfiles]);
	appendRepairNotes(await migrateLegacySkillWorkshopProposals({
		config: state.candidate,
		env
	}));
	appendRepairNotes(migrateLegacyTailscaleProfileIdentities({ env }));
	appendRepairNotes(await cleanupLegacyPluginDependencyState({ env }));
	appendRepairNotes(migrateLegacyOnboardingRecommendationsScope({
		cfg: state.candidate,
		env
	}));
	const legacyOAuthSidecarRepair = await maybeRepairLegacyOAuthSidecarProfiles({
		cfg: state.candidate,
		prompter: { confirmAutoFix: async () => true },
		emitNotes: false,
		env
	});
	appendRepairNotes(legacyOAuthSidecarRepair);
	const staleOAuthShadowRepair = await repairStaleOAuthProfileShadows({
		cfg: state.candidate,
		env
	});
	appendRepairNotes(staleOAuthShadowRepair);
	const authProfileSqliteMigration = await maybeMigrateAuthProfileJsonStoresToSqlite({
		cfg: state.candidate,
		prompter: { confirmAutoFix: async () => true },
		env,
		openAICodexAuthProfileIdMap
	});
	if (authProfileSqliteMigration.configChanged) state = applyDoctorConfigMutation({
		state,
		mutation: {
			config: state.candidate,
			changes: ["Auth profile SQLite migration updated auth.profiles."]
		},
		shouldRepair: true
	});
	appendRepairNotes(authProfileSqliteMigration);
	applyMutation(maybeRepairStaleConfiguredAuthOrders({
		cfg: state.candidate,
		env
	}));
	const authProfilesRepaired = legacyOAuthSidecarRepair.changes.length > 0 || staleOAuthShadowRepair.changes.length > 0 || authProfileSqliteMigration.changes.length > 0;
	return {
		state,
		changeNotes,
		warningNotes,
		authProfilesRepaired,
		...openAICodexAuthProfileIdMap.size > 0 ? { openAICodexAuthProfileIdMap } : {},
		...pluginMetadataSnapshotState.current ? { pluginMetadataSnapshot: pluginMetadataSnapshotState.current } : {}
	};
}
//#endregion
export { runDoctorRepairSequence };
