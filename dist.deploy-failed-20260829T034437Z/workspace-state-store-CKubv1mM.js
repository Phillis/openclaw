import { r as root } from "./fs-safe-CmrQUApq.js";
import { c as resolveUserPath } from "./home-dir-BFvskzn8.js";
import "./utils-Bw16L5tB.js";
import { b as resolveLegacyStateDirs, w as resolveStateDir } from "./paths-BBSTUjD5.js";
import { i as resolveWorkspaceStateIdentity, r as resolveWorkspaceStateAliases, t as createWorkspaceStateIdentity } from "./workspace-state-identity-CMp50RGy.js";
import { An as executeSqliteQuerySync, Mn as getNodeSqliteKysely, Yt as resolveOpenClawStateSqlitePath, d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction, jn as executeSqliteQueryTakeFirstSync } from "./openclaw-state-db-CeAO_dqo.js";
import { l as runSqliteDeferredTransactionSync } from "./node-sqlite-_e3IvfT7.js";
import { n as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-BYdd0aMm.js";
import fs, { existsSync } from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
//#region src/agents/workspace-legacy-state.ts
const LEGACY_WORKSPACE_STATE_DIRNAME = ".openclaw";
const LEGACY_WORKSPACE_STATE_FILENAME = "workspace-state.json";
const LEGACY_WORKSPACE_STATE_CURRENT_FILENAME = "openclaw-workspace-state.json";
const LEGACY_WORKSPACE_ATTESTATION_DIRNAME = "workspace-attestations";
const LEGACY_WORKSPACE_ATTESTATION_SUFFIX = ".attested";
const LEGACY_WORKSPACE_ATTESTATION_HEADER = "openclaw-workspace-attestation:v1";
const LEGACY_WORKSPACE_ATTESTATION_MAX_BYTES = 2048;
const WORKSPACE_DOCTOR_CLAIM_SUFFIX = ".doctor-importing";
const checkedWorkspaceSourceSets = /* @__PURE__ */ new Set();
function uniqueSiblingPaths(paths) {
	const seen = /* @__PURE__ */ new Set();
	return paths.filter((candidate) => {
		let key = path.resolve(candidate);
		try {
			key = path.join(fs.realpathSync.native(path.dirname(candidate)), path.basename(candidate));
		} catch {}
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}
function resolveLegacyWorkspaceSourcePaths(workspaceDir, options) {
	const workspacePath = path.resolve(resolveUserPath(workspaceDir));
	const canonicalIdentity = resolveWorkspaceStateIdentity(workspaceDir);
	const workspaceKeys = [createHash("sha256").update(workspacePath).digest("hex"), canonicalIdentity.workspaceKey];
	const workspacePaths = [workspacePath, canonicalIdentity.workspacePath];
	const stateDirs = [resolveStateDir(options?.env ?? process.env, options?.homedir), ...resolveLegacyStateDirs(options?.homedir)];
	return {
		workspacePath,
		setupStatePaths: [path.join(canonicalIdentity.workspacePath, LEGACY_WORKSPACE_STATE_CURRENT_FILENAME), path.join(canonicalIdentity.workspacePath, LEGACY_WORKSPACE_STATE_DIRNAME, LEGACY_WORKSPACE_STATE_FILENAME)],
		stateDirAttestationPaths: [...new Set(stateDirs)].flatMap((stateDir) => [...new Set(workspaceKeys)].map((workspaceKey) => path.join(stateDir, LEGACY_WORKSPACE_ATTESTATION_DIRNAME, `${workspaceKey}${LEGACY_WORKSPACE_ATTESTATION_SUFFIX}`))),
		siblingAttestationPaths: uniqueSiblingPaths([...new Set(workspacePaths)].map((candidate) => `${candidate}${LEGACY_WORKSPACE_ATTESTATION_SUFFIX}`))
	};
}
function pathOrClaimExists(filePath) {
	for (const candidate of [filePath, `${filePath}${WORKSPACE_DOCTOR_CLAIM_SUFFIX}`]) try {
		fs.lstatSync(candidate);
		return true;
	} catch (error) {
		if (error.code !== "ENOENT") return true;
	}
	return false;
}
function siblingPathIsOwnedMarker(filePath) {
	let stat;
	try {
		stat = fs.lstatSync(filePath);
	} catch {
		return false;
	}
	if (!stat.isFile()) return false;
	try {
		const noFollow = typeof fs.constants.O_NOFOLLOW === "number" ? fs.constants.O_NOFOLLOW : 0;
		const fd = fs.openSync(filePath, fs.constants.O_RDONLY | noFollow);
		try {
			const buffer = Buffer.alloc(Math.min(stat.size, 34));
			const bytesRead = fs.readSync(fd, buffer, 0, buffer.length, 0);
			return buffer.subarray(0, bytesRead).toString("utf8") === `${LEGACY_WORKSPACE_ATTESTATION_HEADER}\n`;
		} finally {
			fs.closeSync(fd);
		}
	} catch {
		return true;
	}
}
/** Fail closed on unmigrated owned state without reading it as runtime data. */
function assertNoUnmigratedWorkspaceState(params) {
	const identity = resolveWorkspaceStateIdentity(params.workspaceDir);
	const sources = resolveLegacyWorkspaceSourcePaths(params.workspaceDir);
	const sourceSetKey = JSON.stringify([
		identity.workspaceKey,
		...sources.setupStatePaths,
		...sources.stateDirAttestationPaths,
		...sources.siblingAttestationPaths
	]);
	if (checkedWorkspaceSourceSets.has(sourceSetKey)) return;
	if (sources.setupStatePaths.some(pathOrClaimExists) || sources.stateDirAttestationPaths.some(pathOrClaimExists) || sources.siblingAttestationPaths.some((sourcePath) => siblingPathIsOwnedMarker(`${sourcePath}.doctor-importing`) || siblingPathIsOwnedMarker(sourcePath))) throw new Error(`Legacy workspace setup state requires migration for ${identity.workspacePath}; run openclaw doctor --fix.`);
	checkedWorkspaceSourceSets.add(sourceSetKey);
}
function resetLegacyWorkspaceStateCheckForTest() {
	checkedWorkspaceSourceSets.clear();
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.workspaceLegacyStateTestApi")] = { resetLegacyWorkspaceStateCheckForTest };
function isOwnedAttestationBuffer(buffer) {
	return buffer.subarray(0, 34).toString("utf8") === `${LEGACY_WORKSPACE_ATTESTATION_HEADER}\n`;
}
/** Capture canonical legacy paths before a destructive workspace removal. */
function prepareLegacyWorkspaceStateReset(workspaceDir, options) {
	const sources = resolveLegacyWorkspaceSourcePaths(workspaceDir, options);
	return { candidates: [
		...sources.setupStatePaths.map((sourcePath) => ({
			rootDir: sourcePath.endsWith("openclaw-workspace-state.json") ? path.dirname(sourcePath) : path.dirname(path.dirname(sourcePath)),
			sourcePath,
			requireAttestationHeader: false
		})),
		...sources.stateDirAttestationPaths.map((sourcePath) => ({
			rootDir: path.dirname(path.dirname(sourcePath)),
			sourcePath,
			requireAttestationHeader: false
		})),
		...sources.siblingAttestationPaths.map((sourcePath) => ({
			rootDir: path.dirname(sourcePath),
			sourcePath,
			requireAttestationHeader: true
		}))
	].flatMap((candidate) => [candidate, {
		...candidate,
		sourcePath: `${candidate.sourcePath}${WORKSPACE_DOCTOR_CLAIM_SUFFIX}`,
		requireAttestationHeader: candidate.requireAttestationHeader
	}]) };
}
/** Discard retired workspace files from a pre-removal reset plan. */
async function removeLegacyWorkspaceStateForReset(plan, options) {
	const removedPaths = [];
	const warnings = [];
	for (const candidate of plan.candidates) {
		const rootDir = path.resolve(candidate.rootDir);
		const sourcePath = path.resolve(candidate.sourcePath);
		const relativePath = path.relative(rootDir, sourcePath);
		try {
			fs.lstatSync(rootDir);
		} catch (error) {
			if (error.code === "ENOENT") continue;
			warnings.push(`Could not inspect retired workspace state at ${sourcePath}: ${String(error)}`);
			continue;
		}
		try {
			const sourceRoot = await root(rootDir, {
				hardlinks: "reject",
				maxBytes: LEGACY_WORKSPACE_ATTESTATION_MAX_BYTES,
				symlinks: "reject"
			});
			if (!await sourceRoot.exists(relativePath)) continue;
			if (candidate.requireAttestationHeader) {
				if (!isOwnedAttestationBuffer((await sourceRoot.read(relativePath)).buffer)) continue;
			}
			if (!options?.dryRun) await sourceRoot.remove(relativePath);
			removedPaths.push(sourcePath);
		} catch (error) {
			warnings.push(`Could not remove retired workspace state at ${sourcePath}: ${String(error)}`);
		}
	}
	return {
		removedPaths,
		warnings
	};
}
const WORKSPACE_ATTESTATION_RECENT_MS = 1440 * 60 * 1e3;
const WORKSPACE_LEGACY_STATE_MIGRATION_KIND = "legacy-workspace-setup-files";
const MAX_WORKSPACE_ATTESTATION_FILENAME_LENGTH = 255;
const SHA256_HEX_PATTERN = /^[a-f0-9]{64}$/u;
const SAFE_ATTESTATION_BASENAME = /^[A-Za-z0-9._-]+\.md$/u;
const WINDOWS_RESERVED_DEVICE_STEMS = /^(?:con|prn|aux|nul|com[0-9]|lpt[0-9])$/iu;
function isSafeWorkspaceAttestationFilename(filename) {
	return filename.length <= MAX_WORKSPACE_ATTESTATION_FILENAME_LENGTH && SAFE_ATTESTATION_BASENAME.test(filename) && !filename.startsWith(".") && !WINDOWS_RESERVED_DEVICE_STEMS.test(filename.split(".")[0] ?? "");
}
function isCanonicalIsoTimestamp(value) {
	const timestamp = new Date(value);
	return Number.isFinite(timestamp.getTime()) && timestamp.toISOString() === value;
}
function assertCanonicalTimestamp(value, label) {
	if (value !== null && !isCanonicalIsoTimestamp(value)) throw new Error(`workspace ${label} timestamp is invalid`);
}
function assertCanonicalIntegerTimestamp(value, label) {
	if (!Number.isSafeInteger(value) || value < 0) throw new Error(`workspace ${label} timestamp is invalid`);
}
function workspacePathEntryExists(workspaceDir) {
	try {
		fs.lstatSync(path.resolve(resolveUserPath(workspaceDir)));
		return true;
	} catch {
		return false;
	}
}
function resolveWorkspaceIdentityFromDatabase(params) {
	const aliases = resolveWorkspaceStateAliases(params.workspaceDir);
	const canonicalIdentity = aliases.at(-1);
	const kysely = getNodeSqliteKysely(params.database.db);
	const rows = executeSqliteQuerySync(params.database.db, kysely.selectFrom("workspace_path_aliases").selectAll().where("alias_key", "in", aliases.map((alias) => alias.workspaceKey))).rows;
	const aliasesByKey = new Map(aliases.map((alias) => [alias.workspaceKey, alias]));
	let storedIdentity;
	for (const row of rows) {
		const alias = aliasesByKey.get(row.alias_key);
		if (!alias || alias.workspacePath !== row.alias_path) throw new Error("workspace path alias key collision");
		const rowIdentity = createWorkspaceStateIdentity(row.workspace_path);
		if (rowIdentity.workspaceKey !== row.workspace_key) throw new Error("workspace path alias target is invalid");
		if (storedIdentity && storedIdentity.workspaceKey !== rowIdentity.workspaceKey) throw new Error("workspace path aliases resolve to conflicting state");
		storedIdentity = rowIdentity;
	}
	if (storedIdentity && workspacePathEntryExists(params.workspaceDir) && storedIdentity.workspaceKey !== canonicalIdentity.workspaceKey) throw new Error("workspace path alias points to a different current target");
	const existingAliasKeys = new Set(rows.map((row) => row.alias_key));
	return {
		identity: storedIdentity ?? canonicalIdentity,
		aliases,
		missingAliasKeys: aliases.map((alias) => alias.workspaceKey).filter((aliasKey) => !existingAliasKeys.has(aliasKey))
	};
}
function registerWorkspacePathAliases(params) {
	assertCanonicalIntegerTimestamp(params.updatedAtMs, "path alias update");
	const kysely = getNodeSqliteKysely(params.database.db);
	for (const alias of params.aliases) {
		const existing = executeSqliteQueryTakeFirstSync(params.database.db, kysely.selectFrom("workspace_path_aliases").selectAll().where("alias_key", "=", alias.workspaceKey));
		if (existing) {
			if (existing.alias_path !== alias.workspacePath || existing.workspace_key !== params.identity.workspaceKey || existing.workspace_path !== params.identity.workspacePath) throw new Error("workspace path alias conflicts with canonical state");
			continue;
		}
		executeSqliteQuerySync(params.database.db, kysely.insertInto("workspace_path_aliases").values({
			alias_key: alias.workspaceKey,
			alias_path: alias.workspacePath,
			workspace_key: params.identity.workspaceKey,
			workspace_path: params.identity.workspacePath,
			updated_at_ms: params.updatedAtMs
		}));
	}
}
function registerWorkspaceStateAliasesInTransaction(params) {
	const aliases = /* @__PURE__ */ new Map();
	for (const workspaceDir of params.workspaceDirs) for (const alias of resolveWorkspaceStateAliases(workspaceDir)) aliases.set(alias.workspaceKey, alias);
	registerWorkspacePathAliases({
		database: params.database,
		identity: params.identity,
		aliases: [...aliases.values()],
		updatedAtMs: params.updatedAtMs
	});
}
function readSnapshotFromDatabase(params) {
	const identity = params.identity;
	const kysely = getNodeSqliteKysely(params.database.db);
	const setupRow = executeSqliteQueryTakeFirstSync(params.database.db, kysely.selectFrom("workspace_setup_state").selectAll().where("workspace_key", "=", identity.workspaceKey));
	if (setupRow?.workspace_path != null && setupRow.workspace_path !== identity.workspacePath) throw new Error("workspace state key collision");
	if (setupRow?.version != null && setupRow.version !== 1) throw new Error("workspace setup state version requires openclaw doctor --fix");
	if (setupRow?.version != null) {
		assertCanonicalTimestamp(setupRow.bootstrap_seeded_at, "bootstrap seeded");
		assertCanonicalTimestamp(setupRow.setup_completed_at, "setup completed");
		if (setupRow.updated_at == null) throw new Error("workspace setup update timestamp is invalid");
		assertCanonicalIntegerTimestamp(setupRow.updated_at, "setup update");
	}
	const attestationPresent = setupRow?.attested_at_ms != null;
	const generatedHashes = /* @__PURE__ */ new Map();
	if (setupRow && attestationPresent) {
		assertCanonicalIntegerTimestamp(setupRow.attested_at_ms, "attestation");
		const hashRows = executeSqliteQuerySync(params.database.db, kysely.selectFrom("workspace_generated_bootstrap_hashes").select(["filename", "sha256"]).where("workspace_key", "=", identity.workspaceKey).orderBy("filename", "asc")).rows;
		for (const row of hashRows) {
			if (!isSafeWorkspaceAttestationFilename(row.filename) || !SHA256_HEX_PATTERN.test(row.sha256)) throw new Error("workspace attestation hash row is invalid");
			generatedHashes.set(row.filename, row.sha256);
		}
	}
	const setupExists = setupRow?.version != null;
	return {
		identity,
		setupExists,
		...setupExists && setupRow?.updated_at != null ? { setupUpdatedAtMs: setupRow.updated_at } : {},
		setup: {
			version: 1,
			...setupRow?.bootstrap_seeded_at ? { bootstrapSeededAt: setupRow.bootstrap_seeded_at } : {},
			...setupRow?.setup_completed_at ? { setupCompletedAt: setupRow.setup_completed_at } : {}
		},
		...attestationPresent ? { attestation: {
			attestedAtMs: setupRow.attested_at_ms,
			generatedHashes
		} } : {}
	};
}
function readWorkspaceStateSnapshot(workspaceDir, options = {}) {
	if (options.readOnly) return withExistingOpenClawStateDatabaseReadOnly((database) => runSqliteDeferredTransactionSync(database.db, () => {
		return readSnapshotFromDatabase({
			identity: resolveWorkspaceIdentityFromDatabase({
				workspaceDir,
				database
			}).identity,
			database
		});
	}), options) ?? {
		identity: resolveWorkspaceStateIdentity(workspaceDir),
		setupExists: false,
		setup: { version: 1 }
	};
	const database = openOpenClawStateDatabase(options);
	const initial = runSqliteDeferredTransactionSync(database.db, () => {
		const resolution = resolveWorkspaceIdentityFromDatabase({
			workspaceDir,
			database
		});
		return {
			resolution,
			snapshot: readSnapshotFromDatabase({
				identity: resolution.identity,
				database
			})
		};
	});
	if (initial.resolution.missingAliasKeys.length === 0 || options.readOnly || !initial.snapshot.setupExists && !initial.snapshot.attestation) return initial.snapshot;
	return runOpenClawStateWriteTransaction((writeDatabase) => {
		const currentAliases = resolveWorkspaceStateAliases(workspaceDir);
		const currentCanonicalIdentity = currentAliases.at(-1);
		if (workspacePathEntryExists(workspaceDir) && currentCanonicalIdentity.workspaceKey !== initial.resolution.identity.workspaceKey) throw new Error("workspace path alias points to a different current target");
		const snapshot = readSnapshotFromDatabase({
			identity: initial.resolution.identity,
			database: writeDatabase
		});
		if (snapshot.setupExists || snapshot.attestation) {
			const aliases = new Map([...initial.resolution.aliases, ...currentAliases].map((alias) => [alias.workspaceKey, alias]));
			registerWorkspacePathAliases({
				database: writeDatabase,
				identity: initial.resolution.identity,
				aliases: [...aliases.values()],
				updatedAtMs: Date.now()
			});
		}
		return snapshot;
	}, options);
}
function mergeWorkspaceSetupState(workspaceDir, next, nowMs = Date.now(), options = {}) {
	assertCanonicalIntegerTimestamp(nowMs, "setup update");
	if (next.bootstrapSeededAt) assertCanonicalTimestamp(next.bootstrapSeededAt, "bootstrap seeded");
	if (next.setupCompletedAt) assertCanonicalTimestamp(next.setupCompletedAt, "setup completed");
	return runOpenClawStateWriteTransaction((database) => {
		const resolution = resolveWorkspaceIdentityFromDatabase({
			workspaceDir,
			database
		});
		const identity = resolution.identity;
		const snapshot = readSnapshotFromDatabase({
			identity,
			database
		});
		const bootstrapSeededAt = snapshot.setup.bootstrapSeededAt ?? next.bootstrapSeededAt;
		const setupCompletedAt = snapshot.setup.setupCompletedAt ?? next.setupCompletedAt;
		const merged = {
			version: 1,
			...bootstrapSeededAt ? { bootstrapSeededAt } : {},
			...setupCompletedAt ? { setupCompletedAt } : {}
		};
		const kysely = getNodeSqliteKysely(database.db);
		executeSqliteQuerySync(database.db, kysely.insertInto("workspace_setup_state").values({
			workspace_key: identity.workspaceKey,
			workspace_path: identity.workspacePath,
			version: 1,
			bootstrap_seeded_at: merged.bootstrapSeededAt ?? null,
			setup_completed_at: merged.setupCompletedAt ?? null,
			updated_at: nowMs
		}).onConflict((conflict) => conflict.column("workspace_key").doUpdateSet({
			workspace_path: identity.workspacePath,
			version: 1,
			bootstrap_seeded_at: merged.bootstrapSeededAt ?? null,
			setup_completed_at: merged.setupCompletedAt ?? null,
			updated_at: nowMs
		})));
		registerWorkspacePathAliases({
			database,
			identity,
			aliases: resolution.aliases,
			updatedAtMs: nowMs
		});
		return merged;
	}, options);
}
function replaceWorkspaceAttestation(params) {
	assertCanonicalIntegerTimestamp(params.attestedAtMs, "attestation");
	if (params.nowMs !== void 0) assertCanonicalIntegerTimestamp(params.nowMs, "attestation update");
	for (const [filename, sha256] of params.generatedHashes) if (!isSafeWorkspaceAttestationFilename(filename) || !SHA256_HEX_PATTERN.test(sha256)) throw new Error("workspace attestation hash is invalid");
	const sortedHashes = [...params.generatedHashes.entries()].toSorted(([left], [right]) => left.localeCompare(right));
	return runOpenClawStateWriteTransaction((database) => {
		const updatedAtMs = params.nowMs ?? Date.now();
		assertCanonicalIntegerTimestamp(updatedAtMs, "attestation update");
		const resolution = resolveWorkspaceIdentityFromDatabase({
			workspaceDir: params.workspaceDir,
			database
		});
		const identity = resolution.identity;
		const snapshot = readSnapshotFromDatabase({
			identity,
			database
		});
		if (snapshot.attestation && snapshot.attestation.attestedAtMs > params.attestedAtMs && snapshot.attestation.attestedAtMs <= updatedAtMs) {
			registerWorkspacePathAliases({
				database,
				identity,
				aliases: resolution.aliases,
				updatedAtMs
			});
			return snapshot.attestation;
		}
		const kysely = getNodeSqliteKysely(database.db);
		executeSqliteQuerySync(database.db, kysely.insertInto("workspace_setup_state").values({
			workspace_key: identity.workspaceKey,
			workspace_path: identity.workspacePath,
			attested_at_ms: params.attestedAtMs,
			attestation_updated_at_ms: updatedAtMs
		}).onConflict((conflict) => conflict.column("workspace_key").doUpdateSet({
			workspace_path: identity.workspacePath,
			attested_at_ms: params.attestedAtMs,
			attestation_updated_at_ms: updatedAtMs
		})));
		executeSqliteQuerySync(database.db, kysely.deleteFrom("workspace_generated_bootstrap_hashes").where("workspace_key", "=", identity.workspaceKey));
		if (sortedHashes.length > 0) executeSqliteQuerySync(database.db, kysely.insertInto("workspace_generated_bootstrap_hashes").values(sortedHashes.map(([filename, sha256]) => ({
			workspace_key: identity.workspaceKey,
			filename,
			sha256
		}))));
		registerWorkspacePathAliases({
			database,
			identity,
			aliases: resolution.aliases,
			updatedAtMs
		});
		return {
			attestedAtMs: params.attestedAtMs,
			generatedHashes: new Map(sortedHashes)
		};
	});
}
function deleteWorkspaceRows(database, workspaceKey) {
	const kysely = getNodeSqliteKysely(database.db);
	const receiptRows = executeSqliteQuerySync(database.db, kysely.selectFrom("migration_sources").select([
		"source_key",
		"last_run_id",
		"report_json"
	]).where("migration_kind", "=", WORKSPACE_LEGACY_STATE_MIGRATION_KIND)).rows.filter((row) => {
		try {
			return JSON.parse(row.report_json).workspaceKey === workspaceKey;
		} catch {
			return false;
		}
	});
	if (receiptRows.length > 0) {
		const receiptKeys = receiptRows.map((row) => row.source_key);
		executeSqliteQuerySync(database.db, kysely.deleteFrom("migration_sources").where("source_key", "in", receiptKeys));
		const runIds = [...new Set(receiptRows.map((row) => row.last_run_id))];
		const referencedRunIds = new Set(executeSqliteQuerySync(database.db, kysely.selectFrom("migration_sources").select("last_run_id").where("last_run_id", "in", runIds)).rows.map((row) => row.last_run_id));
		const orphanedRunIds = runIds.filter((runId) => !referencedRunIds.has(runId));
		if (orphanedRunIds.length > 0) executeSqliteQuerySync(database.db, kysely.deleteFrom("migration_runs").where("id", "in", orphanedRunIds));
	}
	executeSqliteQuerySync(database.db, kysely.deleteFrom("workspace_generated_bootstrap_hashes").where("workspace_key", "=", workspaceKey));
	executeSqliteQuerySync(database.db, kysely.deleteFrom("workspace_setup_state").where("workspace_key", "=", workspaceKey));
	executeSqliteQuerySync(database.db, kysely.deleteFrom("workspace_path_aliases").where("workspace_key", "=", workspaceKey));
}
/** Clear expired state only when no concurrent writer refreshed the vanished workspace. */
function clearExpiredWorkspaceStateForVanishedWorkspace(workspaceDir, nowMs = Date.now()) {
	assertCanonicalIntegerTimestamp(nowMs, "workspace expiry check");
	return runOpenClawStateWriteTransaction((database) => {
		const resolution = resolveWorkspaceIdentityFromDatabase({
			workspaceDir,
			database
		});
		const identity = resolution.identity;
		const snapshot = readSnapshotFromDatabase({
			identity,
			database
		});
		const preserveRecentState = () => {
			registerWorkspacePathAliases({
				database,
				identity,
				aliases: resolution.aliases,
				updatedAtMs: nowMs
			});
			return false;
		};
		if (snapshot.attestation) {
			if (nowMs - snapshot.attestation.attestedAtMs <= 864e5) return preserveRecentState();
		}
		if ((snapshot.setup.bootstrapSeededAt || snapshot.setup.setupCompletedAt) && snapshot.setupUpdatedAtMs !== void 0) {
			if (nowMs - snapshot.setupUpdatedAtMs <= 864e5) return preserveRecentState();
		}
		deleteWorkspaceRows(database, identity.workspaceKey);
		return true;
	});
}
/** Capture workspace identity before the filesystem entry is removed. */
function prepareWorkspaceStateDeletion(workspaceDir) {
	const aliases = resolveWorkspaceStateAliases(workspaceDir);
	return {
		lexicalAlias: aliases[0],
		currentCanonicalIdentity: aliases.at(-1),
		pathEntryExisted: workspacePathEntryExists(workspaceDir)
	};
}
function deleteWorkspaceState(plan) {
	if (!existsSync(resolveOpenClawStateSqlitePath())) return;
	runOpenClawStateWriteTransaction((database) => {
		const { lexicalAlias, currentCanonicalIdentity } = plan;
		const kysely = getNodeSqliteKysely(database.db);
		const storedAlias = executeSqliteQueryTakeFirstSync(database.db, kysely.selectFrom("workspace_path_aliases").selectAll().where("alias_key", "=", lexicalAlias.workspaceKey));
		if (storedAlias && storedAlias.alias_path !== lexicalAlias.workspacePath) throw new Error("workspace path alias key collision");
		const storedIdentity = storedAlias ? createWorkspaceStateIdentity(storedAlias.workspace_path) : void 0;
		if (storedIdentity && storedIdentity.workspaceKey !== storedAlias?.workspace_key) throw new Error("workspace path alias target is invalid");
		if (storedIdentity && plan.pathEntryExisted && storedIdentity.workspaceKey !== currentCanonicalIdentity.workspaceKey) {
			executeSqliteQuerySync(database.db, kysely.deleteFrom("workspace_path_aliases").where("alias_key", "=", lexicalAlias.workspaceKey));
			deleteWorkspaceRows(database, resolveWorkspaceIdentityFromDatabase({
				workspaceDir: currentCanonicalIdentity.workspacePath,
				database
			}).identity.workspaceKey);
			return;
		}
		if (storedIdentity) {
			deleteWorkspaceRows(database, storedIdentity.workspaceKey);
			return;
		}
		deleteWorkspaceRows(database, resolveWorkspaceIdentityFromDatabase({
			workspaceDir: currentCanonicalIdentity.workspacePath,
			database
		}).identity.workspaceKey);
	});
}
//#endregion
export { assertNoUnmigratedWorkspaceState as _, isSafeWorkspaceAttestationFilename as a, resolveLegacyWorkspaceSourcePaths as b, readWorkspaceStateSnapshot as c, LEGACY_WORKSPACE_ATTESTATION_DIRNAME as d, LEGACY_WORKSPACE_ATTESTATION_HEADER as f, WORKSPACE_DOCTOR_CLAIM_SUFFIX as g, LEGACY_WORKSPACE_STATE_DIRNAME as h, deleteWorkspaceState as i, registerWorkspaceStateAliasesInTransaction as l, LEGACY_WORKSPACE_STATE_CURRENT_FILENAME as m, WORKSPACE_LEGACY_STATE_MIGRATION_KIND as n, mergeWorkspaceSetupState as o, LEGACY_WORKSPACE_ATTESTATION_MAX_BYTES as p, clearExpiredWorkspaceStateForVanishedWorkspace as r, prepareWorkspaceStateDeletion as s, WORKSPACE_ATTESTATION_RECENT_MS as t, replaceWorkspaceAttestation as u, prepareLegacyWorkspaceStateReset as v, removeLegacyWorkspaceStateForReset as y };
