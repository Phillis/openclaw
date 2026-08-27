import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import "./utils-D9gvQMP6.js";
import { l as runSqliteDeferredTransactionSync } from "./node-sqlite-B9zMic_z.js";
import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync, r as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-gKE3myqW.js";
import { d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BciZ4rHE.js";
import { createHash } from "node:crypto";
import fs, { existsSync } from "node:fs";
import path from "node:path";
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
const MAX_WORKSPACE_IDENTITY_SYMLINKS = 40;
function normalizeWorkspaceIdentityPath(value) {
	const normalized = path.normalize(value).normalize("NFC");
	return process.platform === "win32" ? normalized.toLowerCase() : normalized;
}
function canonicalizeWorkspaceIdentityPath(workspaceDir) {
	const fallback = normalizeWorkspaceIdentityPath(path.resolve(resolveUserPath(workspaceDir)));
	let candidate = fallback;
	const followedSymlinks = /* @__PURE__ */ new Set();
	for (let redirectCount = 0; redirectCount < MAX_WORKSPACE_IDENTITY_SYMLINKS; redirectCount += 1) {
		const missingSegments = [];
		let current = candidate;
		while (true) {
			try {
				return normalizeWorkspaceIdentityPath(path.join(fs.realpathSync.native(current), ...missingSegments.toReversed()));
			} catch {}
			try {
				if (fs.lstatSync(current).isSymbolicLink()) {
					const normalizedLink = normalizeWorkspaceIdentityPath(current);
					if (followedSymlinks.has(normalizedLink)) return fallback;
					followedSymlinks.add(normalizedLink);
					candidate = path.resolve(path.dirname(current), fs.readlinkSync(current), ...missingSegments.toReversed());
					break;
				}
			} catch {}
			const parent = path.dirname(current);
			if (parent === current) return fallback;
			missingSegments.push(path.basename(current));
			current = parent;
		}
	}
	return fallback;
}
function createWorkspaceStateIdentity(workspacePath) {
	return {
		workspacePath,
		workspaceKey: createHash("sha256").update(workspacePath).digest("hex")
	};
}
function resolveWorkspaceStateAliases(workspaceDir) {
	const lexicalPath = normalizeWorkspaceIdentityPath(path.resolve(resolveUserPath(workspaceDir)));
	const canonicalPath = canonicalizeWorkspaceIdentityPath(workspaceDir);
	return [.../* @__PURE__ */ new Set([lexicalPath, canonicalPath])].map(createWorkspaceStateIdentity);
}
function workspacePathEntryExists(workspaceDir) {
	try {
		fs.lstatSync(path.resolve(resolveUserPath(workspaceDir)));
		return true;
	} catch {
		return false;
	}
}
function resolveWorkspaceStateIdentity(workspaceDir) {
	return createWorkspaceStateIdentity(canonicalizeWorkspaceIdentityPath(workspaceDir));
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
	if (setupRow && setupRow.workspace_path !== identity.workspacePath) throw new Error("workspace state key collision");
	if (setupRow && setupRow.version !== 1) throw new Error("workspace setup state version requires openclaw doctor --fix");
	if (setupRow) {
		assertCanonicalTimestamp(setupRow.bootstrap_seeded_at, "bootstrap seeded");
		assertCanonicalTimestamp(setupRow.setup_completed_at, "setup completed");
		assertCanonicalIntegerTimestamp(setupRow.updated_at, "setup update");
	}
	const attestationRow = executeSqliteQueryTakeFirstSync(params.database.db, kysely.selectFrom("workspace_attestations").selectAll().where("workspace_key", "=", identity.workspaceKey));
	const generatedHashes = /* @__PURE__ */ new Map();
	if (attestationRow) {
		assertCanonicalIntegerTimestamp(attestationRow.attested_at_ms, "attestation");
		const hashRows = executeSqliteQuerySync(params.database.db, kysely.selectFrom("workspace_generated_bootstrap_hashes").select(["filename", "sha256"]).where("workspace_key", "=", identity.workspaceKey).orderBy("filename", "asc")).rows;
		for (const row of hashRows) {
			if (!isSafeWorkspaceAttestationFilename(row.filename) || !SHA256_HEX_PATTERN.test(row.sha256)) throw new Error("workspace attestation hash row is invalid");
			generatedHashes.set(row.filename, row.sha256);
		}
	}
	return {
		identity,
		setupExists: Boolean(setupRow),
		...setupRow ? { setupUpdatedAtMs: setupRow.updated_at } : {},
		setup: {
			version: 1,
			...setupRow?.bootstrap_seeded_at ? { bootstrapSeededAt: setupRow.bootstrap_seeded_at } : {},
			...setupRow?.setup_completed_at ? { setupCompletedAt: setupRow.setup_completed_at } : {}
		},
		...attestationRow ? { attestation: {
			attestedAtMs: attestationRow.attested_at_ms,
			generatedHashes
		} } : {}
	};
}
function readWorkspaceStateSnapshot(workspaceDir, options = {}) {
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
		executeSqliteQuerySync(database.db, kysely.insertInto("workspace_attestations").values({
			workspace_key: identity.workspaceKey,
			attested_at_ms: params.attestedAtMs,
			updated_at_ms: updatedAtMs
		}).onConflict((conflict) => conflict.column("workspace_key").doUpdateSet({
			attested_at_ms: params.attestedAtMs,
			updated_at_ms: updatedAtMs
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
	executeSqliteQuerySync(database.db, kysely.deleteFrom("workspace_attestations").where("workspace_key", "=", workspaceKey));
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
export { isSafeWorkspaceAttestationFilename as a, readWorkspaceStateSnapshot as c, resolveWorkspaceStateIdentity as d, deleteWorkspaceState as i, registerWorkspaceStateAliasesInTransaction as l, WORKSPACE_LEGACY_STATE_MIGRATION_KIND as n, mergeWorkspaceSetupState as o, clearExpiredWorkspaceStateForVanishedWorkspace as r, prepareWorkspaceStateDeletion as s, WORKSPACE_ATTESTATION_RECENT_MS as t, replaceWorkspaceAttestation as u };
