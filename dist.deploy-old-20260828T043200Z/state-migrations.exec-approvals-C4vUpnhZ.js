import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { i as root } from "./root-impl-BbMR4leC.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { An as executeSqliteQuerySync, Mn as getNodeSqliteKysely, d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction, jn as executeSqliteQueryTakeFirstSync } from "./openclaw-state-db-CeAO_dqo.js";
import { n as acquireGatewayLock, t as GatewayLockError } from "./gateway-lock-G9roAjek.js";
import { n as normalizeDeviceAuthScopes, t as normalizeDeviceAuthRole } from "./device-auth-C-STNejO.js";
import { c as resetLegacyDeviceAuthPresenceCache } from "./device-auth-store-DVgrQui-.js";
import { d as readStoredDeviceIdentityReadOnly, f as repairInvalidStoredDeviceIdentity, h as acquireDeviceIdentityCoordinator, l as DeviceIdentityStorageError, m as validateStoredDeviceIdentity, p as resolveDeviceIdentityStore, u as generateStoredDeviceIdentity } from "./device-identity-UxfYyiX_.js";
import { a as deriveEd25519PublicKeyRaw, i as deriveEd25519PrivateKeyRaw, o as ed25519PrivateKeyPemFromRaw, s as ed25519PublicKeyPemFromRaw, t as decodeCanonicalBase64OrBase64Url } from "./ed25519-signature-De1Kepnz.js";
import { c as resolveExecApprovalsPath, d as tryParsePersistedExecApprovals } from "./exec-approvals-config-_UJgdeLU.js";
import { l as writeExecApprovalsConfigRow, o as readExecApprovalsConfigRow, s as serializeExecApprovals } from "./exec-approvals-sqlite-DwEMj6ui.js";
import { i as recordLegacyMigrationReceipt, n as readLegacyMigrationReceipt, r as readLegacyMigrationReceiptFromDatabase, s as resolveLegacyMigrationSourceKey, t as markLegacyMigrationSourceRemoved } from "./state-migrations.receipts-DoOxYxhx.js";
import fs from "node:fs";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
//#region src/infra/state-migrations.lock.ts
/** Keep old Gateway writers excluded through migration, verification, and cleanup. */
async function withLegacyMigrationStateLock(options) {
	const env = {
		...options.env ?? process.env,
		OPENCLAW_STATE_DIR: options.stateDir
	};
	let lock;
	try {
		lock = await acquireGatewayLock({
			allowInTests: true,
			env,
			pollIntervalMs: 25,
			role: "sqlite-maintenance",
			timeoutMs: 250
		});
	} catch (error) {
		const detail = error instanceof GatewayLockError ? "the Gateway or another SQLite maintenance command owns this state directory" : options.formatAcquireError?.(error) ?? String(error);
		const guidance = options.retryGuidance ?? "Stop the Gateway and run `openclaw doctor --fix` again.";
		return {
			changes: [],
			warnings: [`Failed migrating ${options.label}: ${detail}. ${guidance}`]
		};
	}
	if (!lock) return {
		changes: [],
		warnings: [`Failed migrating ${options.label}: exclusive state ownership unavailable.`]
	};
	let result = {
		changes: [],
		warnings: []
	};
	let releaseError;
	try {
		try {
			result = await options.run(env);
		} catch (error) {
			if (!options.errorLabel) throw error;
			result.warnings.push(`${options.errorLabel}: ${String(error)}`);
		}
	} finally {
		try {
			await options.beforeRelease?.();
		} catch (error) {
			releaseError = error;
		}
		try {
			await lock.release();
		} catch (error) {
			releaseError ??= error;
		}
	}
	if (releaseError) result.warnings.push(`${options.releaseLabel} migration lock release failed: ${formatErrorMessage(releaseError)}`);
	return result;
}
//#endregion
//#region src/infra/state-migrations.device-auth.ts
const LEGACY_PATH = "identity/device-auth.json";
/** Detect the retired device-auth store only when an explicit Doctor flow opts in. */
function detectLegacyDeviceAuth(params) {
	const sourcePath = path.join(params.stateDir, LEGACY_PATH);
	const sourcePresent = fs.existsSync(sourcePath);
	return {
		sourcePath,
		sourcePresent,
		hasLegacy: params.doctorOnlyStateMigrations === true && sourcePresent
	};
}
function parseStore(value) {
	if (!isRecord(value) || value.version !== 1 || typeof value.deviceId !== "string" || !value.deviceId.trim() || !isRecord(value.tokens)) throw new Error("legacy device-auth store is invalid or unsupported");
	const entries = Object.entries(value.tokens).flatMap(([rawRole, tokenValue]) => {
		const role = normalizeDeviceAuthRole(rawRole);
		if (!role || !isRecord(tokenValue) || typeof tokenValue.token !== "string") return [];
		return [{
			token: tokenValue.token,
			role,
			scopes: normalizeDeviceAuthScopes(Array.isArray(tokenValue.scopes) ? tokenValue.scopes : void 0),
			updatedAtMs: typeof tokenValue.updatedAtMs === "number" && Number.isSafeInteger(tokenValue.updatedAtMs) ? tokenValue.updatedAtMs : 0
		}];
	});
	return {
		deviceId: value.deviceId,
		entries: [...new Map(entries.map((entry) => [entry.role, entry])).values()]
	};
}
function rowIsCanonical(row) {
	try {
		return Array.isArray(JSON.parse(row.scopes_json)) && Number.isSafeInteger(row.updated_at_ms);
	} catch {
		return false;
	}
}
async function importLegacyStore(params) {
	const stateRoot = await root(params.stateDir, {
		hardlinks: "reject",
		maxBytes: 256 * 1024,
		symlinks: "reject"
	});
	const source = await stateRoot.read(LEGACY_PATH, {
		hardlinks: "reject",
		maxBytes: 256 * 1024,
		symlinks: "reject"
	});
	const store = parseStore(JSON.parse(source.buffer.toString("utf8")));
	const counts = runOpenClawStateWriteTransaction(({ db }) => {
		const stateDb = getNodeSqliteKysely(db);
		let imported = 0;
		let preserved = 0;
		for (const entry of store.entries) {
			const query = stateDb.selectFrom("device_auth_tokens").select(["scopes_json", "updated_at_ms"]).where("device_id", "=", store.deviceId).where("role", "=", entry.role);
			const existing = executeSqliteQueryTakeFirstSync(db, query);
			if (existing && rowIsCanonical(existing)) {
				preserved += 1;
				continue;
			}
			executeSqliteQuerySync(db, stateDb.insertInto("device_auth_tokens").values({
				device_id: store.deviceId,
				role: entry.role,
				token: entry.token,
				scopes_json: JSON.stringify(entry.scopes),
				updated_at_ms: entry.updatedAtMs
			}).onConflict((conflict) => conflict.columns(["device_id", "role"]).doUpdateSet({
				token: entry.token,
				scopes_json: JSON.stringify(entry.scopes),
				updated_at_ms: entry.updatedAtMs
			})));
			if (!executeSqliteQueryTakeFirstSync(db, query)) throw new Error("SQLite verification failed for a device-auth token");
			imported += 1;
		}
		return {
			imported,
			preserved
		};
	}, { env: params.env });
	await stateRoot.remove(LEGACY_PATH);
	resetLegacyDeviceAuthPresenceCache(params.env);
	return {
		changes: [`Migrated ${counts.imported} device-auth token${counts.imported === 1 ? "" : "s"} to SQLite.`],
		warnings: [],
		notices: [...counts.preserved > 0 ? [`Preserved ${counts.preserved} canonical SQLite device-auth token${counts.preserved === 1 ? "" : "s"}.`] : [], "Removed retired device-auth JSON after verified SQLite import."]
	};
}
/** Import retired device-auth JSON while excluding Gateways that can rewrite it. */
async function migrateLegacyDeviceAuth(params) {
	if (!params.detected.hasLegacy) return {
		changes: [],
		warnings: []
	};
	return await withLegacyMigrationStateLock({
		stateDir: params.stateDir,
		env: params.env,
		label: "legacy device auth",
		releaseLabel: "Device-auth",
		errorLabel: "Failed migrating legacy device auth",
		run: async (env) => await importLegacyStore({
			...params,
			env
		})
	});
}
//#endregion
//#region src/infra/device-identity-legacy.ts
function fingerprintPublicKey(publicKeyPem) {
	return createHash("sha256").update(deriveEd25519PublicKeyRaw(publicKeyPem)).digest("hex");
}
function isValidCreatedAtMs$1(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}
function normalizeLegacyCreatedAtMs(value) {
	return isValidCreatedAtMs$1(value) ? value : Date.now();
}
function normalizeLegacyKeyPair(params) {
	try {
		const publicKeyRaw = deriveEd25519PublicKeyRaw(params.publicKeyPem);
		const privateKeyRaw = deriveEd25519PrivateKeyRaw(params.privateKeyPem);
		const publicKeyPem = ed25519PublicKeyPemFromRaw(publicKeyRaw);
		const privateKeyPem = ed25519PrivateKeyPemFromRaw(privateKeyRaw);
		const normalized = {
			deviceId: fingerprintPublicKey(publicKeyPem),
			publicKeyPem,
			privateKeyPem,
			createdAtMs: params.createdAtMs
		};
		validateStoredDeviceIdentity(normalized);
		return normalized;
	} catch {
		return null;
	}
}
/** Normalize a retired Node PEM or Swift raw-key payload for Doctor import. */
function normalizeLegacyDeviceIdentity(value) {
	if (isRecord(value) && value.version === 1 && typeof value.deviceId === "string" && typeof value.publicKeyPem === "string" && typeof value.privateKeyPem === "string") return normalizeLegacyKeyPair({
		createdAtMs: normalizeLegacyCreatedAtMs(value.createdAtMs),
		privateKeyPem: value.privateKeyPem,
		publicKeyPem: value.publicKeyPem
	});
	if (isRecord(value) && !("version" in value) && typeof value.deviceId === "string" && typeof value.publicKey === "string" && typeof value.privateKey === "string") try {
		const publicKeyRaw = decodeCanonicalBase64OrBase64Url(value.publicKey);
		const privateKeyRaw = decodeCanonicalBase64OrBase64Url(value.privateKey);
		return normalizeLegacyKeyPair({
			createdAtMs: normalizeLegacyCreatedAtMs(value.createdAtMs),
			privateKeyPem: ed25519PrivateKeyPemFromRaw(privateKeyRaw),
			publicKeyPem: ed25519PublicKeyPemFromRaw(publicKeyRaw)
		});
	} catch {
		return null;
	}
	return null;
}
//#endregion
//#region src/infra/state-migrations.device-identity-repair.ts
const LEGACY_IDENTITY_RELATIVE_PATH = path.join("identity", "device.json");
const DOCTOR_CLAIM_SUFFIX$1 = ".doctor-importing";
const NATIVE_CLAIM_SUFFIX = ".native-importing";
const IDENTITY_KEY$1 = "primary";
function pathMayExist(filePath) {
	try {
		fs.lstatSync(filePath);
		return true;
	} catch (error) {
		return error.code !== "ENOENT";
	}
}
/** Detect retired paths for an authorized importer; only Doctor may rotate invalid SQLite state. */
function detectLegacyDeviceIdentity(params) {
	const sourcePath = path.join(params.stateDir, LEGACY_IDENTITY_RELATIVE_PATH);
	const claimPath = `${sourcePath}${DOCTOR_CLAIM_SUFFIX$1}`;
	const nativeClaimPath = `${sourcePath}${NATIVE_CLAIM_SUFFIX}`;
	const doctorAuthorized = params.doctorOnlyStateMigrations === true;
	const importAuthorized = doctorAuthorized || params.allowLegacyDeviceIdentityImport === true;
	let hasInvalidCanonical = false;
	if (doctorAuthorized) try {
		readStoredDeviceIdentityReadOnly({
			env: {
				...params.env ?? process.env,
				OPENCLAW_STATE_DIR: params.stateDir
			},
			identityKey: IDENTITY_KEY$1
		});
	} catch (error) {
		hasInvalidCanonical = error instanceof DeviceIdentityStorageError;
	}
	return {
		sourcePath,
		claimPath,
		nativeClaimPath,
		hasLegacy: importAuthorized && (pathMayExist(claimPath) || pathMayExist(nativeClaimPath) || pathMayExist(sourcePath)),
		hasInvalidCanonical
	};
}
function hasLegacyDeviceIdentityPath(detected) {
	return pathMayExist(detected.claimPath) || pathMayExist(detected.nativeClaimPath) || pathMayExist(detected.sourcePath);
}
/** Generate a replacement only after the caller acquires Doctor's exclusive state lock. */
function repairInvalidCanonicalIdentity(env) {
	try {
		const result = repairInvalidStoredDeviceIdentity(generateStoredDeviceIdentity(), {
			env,
			identityKey: IDENTITY_KEY$1
		});
		if (!result.repaired) return {
			changes: [],
			warnings: []
		};
		if (!result.rotated) return {
			changes: ["Repaired invalid primary device identity metadata in SQLite."],
			warnings: []
		};
		return {
			changes: ["Replaced invalid primary device identity in SQLite."],
			warnings: [],
			notices: ["The repaired device has a new identity and must be approved again."]
		};
	} catch (error) {
		return {
			changes: [],
			warnings: [`Failed repairing invalid SQLite device identity: ${formatErrorMessage(error)}`]
		};
	}
}
//#endregion
//#region src/infra/state-migrations.source-snapshot.ts
/** Keep every claim operation bound to the same trusted owner root and source inode. */
var LegacyMigrationSourceClaim = class {
	constructor(params) {
		this.params = params;
		this.sourcePath = params.sourcePath;
		this.claimPath = `${params.sourcePath}${params.claimSuffix ?? ".doctor-importing"}`;
		this.sourceRelativePath = resolveLegacyMigrationRelativePath(params.stateDir, this.sourcePath, params.label, params.includeFilePath);
		this.claimRelativePath = resolveLegacyMigrationRelativePath(params.stateDir, this.claimPath, params.label, params.includeFilePath);
	}
	async exists(claimed = false) {
		return await this.params.stateRoot.exists(claimed ? this.claimRelativePath : this.sourceRelativePath);
	}
	async read(claimed = false) {
		return await this.params.readSnapshot(claimed ? this.claimPath : this.sourcePath);
	}
	async recover(conflictMessage) {
		if (!await this.exists(true)) return;
		const claimed = await this.read(true);
		if (!await this.exists()) {
			await this.params.stateRoot.move(this.claimRelativePath, this.sourceRelativePath);
			return;
		}
		if (!legacyMigrationSourceContentMatches(claimed, await this.read())) throw new Error(conflictMessage);
		await this.params.stateRoot.remove(this.claimRelativePath);
	}
	async restore() {
		try {
			if (!await this.exists(true)) return null;
			if (await this.exists()) return `source path already exists: ${this.sourcePath}`;
			await this.params.stateRoot.move(this.claimRelativePath, this.sourceRelativePath);
			return null;
		} catch (error) {
			return this.params.formatError?.(error) ?? String(error);
		}
	}
	async claim(params) {
		params.beforeClaim?.();
		await this.params.stateRoot.move(this.sourceRelativePath, this.claimRelativePath);
		const claimed = await this.read(true);
		if (!legacyMigrationSourceSnapshotsMatch(claimed, params.snapshot)) throw new Error(params.mismatchMessage);
		return claimed;
	}
	async remove(params = {}) {
		if (!params.skipSourceCheck && await this.exists()) throw new Error(params.sourceReappearedMessage ?? `legacy source reappeared during import: ${this.sourcePath}`);
		if (params.removeSource) await params.removeSource(this.claimPath);
		else await this.params.stateRoot.remove(this.claimRelativePath);
		const sourceRemainingMessage = params.sourceRemainingMessage ?? params.remainingMessage;
		if (sourceRemainingMessage && await this.exists()) throw new Error(sourceRemainingMessage);
		const claimRemainingMessage = params.claimRemainingMessage ?? params.remainingMessage;
		if (claimRemainingMessage && await this.exists(true)) throw new Error(claimRemainingMessage);
	}
};
/** Restore claimed sources in reverse order so a failed multi-file import remains atomic. */
async function restoreLegacyMigrationSourceClaims(claims) {
	const errors = [];
	for (const claim of claims.toReversed()) {
		const error = await claim.restore();
		if (error) errors.push(error);
	}
	return errors;
}
/** Claim every source before SQLite writes; restore the full batch on the first mismatch. */
async function claimLegacyMigrationSourceClaims(claims, params) {
	params.beforeClaim?.();
	const claimed = [];
	try {
		for (const { claim, snapshot } of claims) {
			claimed.push(claim);
			await claim.claim({
				snapshot,
				mismatchMessage: params.mismatchMessage
			});
		}
	} catch (error) {
		const restoreErrors = await restoreLegacyMigrationSourceClaims(claimed);
		throw new Error(`${String(error)}${restoreErrors.length > 0 ? `; restore failures: ${restoreErrors.join("; ")}` : ""}`, { cause: error });
	}
}
/** A source may be inaccessible; only a proven absence permits skipping repair. */
function legacyMigrationPathMayExist(filePath) {
	try {
		fs.lstatSync(filePath);
		return true;
	} catch (error) {
		return error.code !== "ENOENT";
	}
}
function legacyMigrationSourceOrClaimMayExist(sourcePath, claimSuffix = ".doctor-importing") {
	return legacyMigrationPathMayExist(sourcePath) || legacyMigrationPathMayExist(`${sourcePath}${claimSuffix}`);
}
/** Constrain migration reads and moves to the original trusted state root. */
function resolveLegacyMigrationRelativePath(stateDir, filePath, label, includeFilePath = true) {
	const relativePath = path.relative(path.resolve(stateDir), path.resolve(filePath));
	if (!relativePath || relativePath === ".." || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath)) throw new Error(`legacy ${label} path is outside the state directory${includeFilePath ? `: ${filePath}` : ""}`);
	return relativePath;
}
/** Hash the exact bounded bytes returned by the symlink/hardlink-safe root. */
async function readLegacyMigrationSourceSnapshot(params) {
	const opened = await params.stateRoot.read(resolveLegacyMigrationRelativePath(params.stateDir, params.sourcePath, params.label), {
		hardlinks: "reject",
		maxBytes: params.maxBytes,
		symlinks: "reject"
	});
	if (!opened.stat.isFile() || opened.stat.size !== opened.buffer.byteLength) throw new Error(`legacy ${params.label} source is not a stable regular file`);
	const raw = opened.buffer.toString("utf8");
	return {
		buffer: opened.buffer,
		dev: opened.stat.dev,
		ino: opened.stat.ino,
		mtimeMs: opened.stat.mtimeMs,
		raw,
		sha256: createHash("sha256").update(params.hashDecodedText ? raw : opened.buffer).digest("hex"),
		size: opened.stat.size,
		sourcePath: params.sourcePath
	};
}
/** Pin synchronous legacy files before and after parsing; never follow new links. */
function readLegacyMigrationSourceSnapshotSync(params) {
	const stat = params.followSymlinks ? fs.statSync : fs.lstatSync;
	const before = stat(params.sourcePath);
	if (!before.isFile() || !params.followSymlinks && before.isSymbolicLink()) throw new Error(`legacy ${params.label} source is not a regular${params.followSymlinks ? "" : " non-symlink"} file`);
	if (params.maxBytes !== void 0 && before.size > params.maxBytes) throw new Error(`legacy ${params.label} source exceeds the metadata size limit`);
	const raw = fs.readFileSync(params.sourcePath, "utf8");
	const after = stat(params.sourcePath);
	if (!after.isFile() || !params.followSymlinks && after.isSymbolicLink() || before.dev !== after.dev || before.ino !== after.ino || before.size !== after.size || before.mtimeMs !== after.mtimeMs) throw new Error(`legacy ${params.label} source changed while doctor was reading it`);
	return {
		buffer: Buffer.from(raw),
		dev: after.dev,
		ino: after.ino,
		mtimeMs: after.mtimeMs,
		raw,
		sha256: createHash("sha256").update(raw).digest("hex"),
		size: after.size,
		sourcePath: params.sourcePath
	};
}
/** Check source identity again before committing or deleting a verified import. */
function assertLegacyMigrationSourceUnchanged(params) {
	if (!legacyMigrationSourceSnapshotsMatch(readLegacyMigrationSourceSnapshotSync(params), params.snapshot)) throw new Error(`legacy ${params.label} source changed after doctor loaded it`);
}
/** Restore a claimed legacy source when verified cleanup cannot complete. */
function claimAndRemoveLegacyMigrationSource(params) {
	params.beforeClaim?.();
	const claimPath = `${params.sourcePath}.doctor-importing-${process.pid}-${randomUUID()}`;
	fs.renameSync(params.sourcePath, claimPath);
	try {
		if (!legacyMigrationSourceSnapshotsMatch(readLegacyMigrationSourceSnapshotSync({
			...params,
			sourcePath: claimPath
		}), params.snapshot)) throw new Error(`legacy ${params.label} source changed before doctor could claim it`);
		(params.removeSource ?? fs.unlinkSync)(claimPath);
	} catch (error) {
		let restoreFailure = "";
		if (fs.existsSync(claimPath) && !fs.existsSync(params.sourcePath)) try {
			fs.renameSync(claimPath, params.sourcePath);
		} catch (restoreError) {
			restoreFailure = `; the claimed source remains at ${claimPath} because restore also failed: ${String(restoreError)}`;
		}
		throw new Error(`${String(error)}${restoreFailure}`, { cause: error });
	}
}
function legacyMigrationSourceSnapshotsMatch(left, right) {
	return left.dev === right.dev && left.ino === right.ino && left.mtimeMs === right.mtimeMs && left.sha256 === right.sha256 && left.size === right.size;
}
function legacyMigrationSourceContentMatches(left, right) {
	return left.sha256 === right.sha256 && left.size === right.size;
}
//#endregion
//#region src/infra/state-migrations.device-identity.ts
const IDENTITY_KEY = "primary";
const MIGRATION_KIND$1 = "legacy-device-identity-json";
const MAX_LEGACY_IDENTITY_BYTES = 128 * 1024;
const utf8Decoder$1 = new TextDecoder("utf-8", { fatal: true });
function isValidCreatedAtMs(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}
function deviceIdentityKeyMaterialMatches(left, right) {
	try {
		return deriveEd25519PublicKeyRaw(left.publicKeyPem).equals(deriveEd25519PublicKeyRaw(right.publicKeyPem)) && deriveEd25519PrivateKeyRaw(left.privateKeyPem).equals(deriveEd25519PrivateKeyRaw(right.privateKeyPem));
	} catch {
		return false;
	}
}
function relativeLegacyPath(stateDir, filePath) {
	return resolveLegacyMigrationRelativePath(stateDir, filePath, "device identity", false);
}
async function readLegacySourceSnapshot$1(params) {
	const snapshot = await readLegacyMigrationSourceSnapshot({
		...params,
		maxBytes: MAX_LEGACY_IDENTITY_BYTES,
		label: "device identity"
	});
	const identity = normalizeLegacyDeviceIdentity(JSON.parse(utf8Decoder$1.decode(snapshot.buffer)));
	if (!identity) throw new Error("legacy device identity is invalid or unsupported");
	return {
		...snapshot,
		identity
	};
}
function classifyCanonicalRow(row, identity) {
	if (!isValidCreatedAtMs(row.updated_at_ms)) return "invalid";
	try {
		validateStoredDeviceIdentity({
			deviceId: row.device_id,
			publicKeyPem: row.public_key_pem,
			privateKeyPem: row.private_key_pem,
			createdAtMs: row.created_at_ms
		}, row.identity_key);
	} catch {
		return "invalid";
	}
	return row.identity_key === IDENTITY_KEY && row.device_id === identity.deviceId && deviceIdentityKeyMaterialMatches({
		deviceId: row.device_id,
		publicKeyPem: row.public_key_pem,
		privateKeyPem: row.private_key_pem
	}, identity) ? "same" : "different";
}
function readCanonicalIdentity(db) {
	return executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("device_identities").selectAll().where("identity_key", "=", IDENTITY_KEY));
}
function verifyCanonicalIdentity(identity, env) {
	const { db } = openOpenClawStateDatabase({ env });
	const row = readCanonicalIdentity(db);
	if (!row || classifyCanonicalRow(row, identity) !== "same") throw new Error("canonical SQLite device identity no longer matches the legacy source");
}
function importAndRecordReceipt(params) {
	const sourceKey = resolveLegacyMigrationSourceKey("device-identity-json", params.sourcePath);
	const runId = `${sourceKey}:${params.snapshot.sha256.slice(0, 16)}`;
	const now = Date.now();
	return runOpenClawStateWriteTransaction(({ db }) => {
		const stateDb = getNodeSqliteKysely(db);
		const existingReceipt = readLegacyMigrationReceiptFromDatabase(db, sourceKey);
		if (existingReceipt) {
			if (existingReceipt.sourceSha256 !== params.snapshot.sha256) throw new Error("migration receipt belongs to different device identity bytes");
			const existing = readCanonicalIdentity(db);
			if (!existing || classifyCanonicalRow(existing, params.snapshot.identity) !== "same") throw new Error("migration receipt does not match the canonical device identity");
			return {
				sourceKey,
				imported: false
			};
		}
		const existing = readCanonicalIdentity(db);
		const existingState = existing ? classifyCanonicalRow(existing, params.snapshot.identity) : void 0;
		if (existingState === "different") throw new Error("canonical SQLite device identity differs from the legacy identity");
		const imported = !existing || existingState === "invalid";
		const repaired = existingState === "invalid";
		if (!existing) executeSqliteQuerySync(db, stateDb.insertInto("device_identities").values({
			identity_key: IDENTITY_KEY,
			device_id: params.snapshot.identity.deviceId,
			public_key_pem: params.snapshot.identity.publicKeyPem,
			private_key_pem: params.snapshot.identity.privateKeyPem,
			created_at_ms: params.snapshot.identity.createdAtMs,
			updated_at_ms: now
		}));
		else if (repaired) executeSqliteQuerySync(db, stateDb.updateTable("device_identities").set({
			device_id: params.snapshot.identity.deviceId,
			public_key_pem: params.snapshot.identity.publicKeyPem,
			private_key_pem: params.snapshot.identity.privateKeyPem,
			created_at_ms: params.snapshot.identity.createdAtMs,
			updated_at_ms: now
		}).where("identity_key", "=", IDENTITY_KEY));
		const verified = readCanonicalIdentity(db);
		if (!verified || classifyCanonicalRow(verified, params.snapshot.identity) !== "same") throw new Error("SQLite verification failed for the primary device identity");
		const reportJson = JSON.stringify({
			source: MIGRATION_KIND$1,
			target: "device_identities",
			identityKey: IDENTITY_KEY,
			deviceId: params.snapshot.identity.deviceId,
			sourceSha256: params.snapshot.sha256,
			importedRecordCount: imported ? 1 : 0,
			preservedSqliteRecordCount: existing ? 1 : 0,
			repairedSqliteRecordCount: repaired ? 1 : 0
		});
		recordLegacyMigrationReceipt(db, {
			sourceKey,
			migrationKind: MIGRATION_KIND$1,
			sourcePath: params.sourcePath,
			targetTable: "device_identities",
			sourceSha256: params.snapshot.sha256,
			sourceSizeBytes: params.snapshot.size,
			sourceRecordCount: 1,
			runId,
			now,
			reportJson
		});
		return {
			sourceKey,
			imported
		};
	}, { env: params.env });
}
async function removePath(params) {
	if (params.removeSource) {
		await params.removeSource(params.sourcePath);
		return;
	}
	await params.stateRoot.remove(relativeLegacyPath(params.stateDir, params.sourcePath));
}
async function restoreClaim(params) {
	try {
		if (!await params.stateRoot.exists(relativeLegacyPath(params.stateDir, params.claimPath))) return null;
		if (await params.stateRoot.exists(relativeLegacyPath(params.stateDir, params.sourcePath))) return `source path already exists: ${params.sourcePath}`;
		await params.stateRoot.move(relativeLegacyPath(params.stateDir, params.claimPath), relativeLegacyPath(params.stateDir, params.sourcePath));
		return null;
	} catch (error) {
		return String(error);
	}
}
async function cleanupReceiptSources(params) {
	if (await params.stateRoot.exists(relativeLegacyPath(params.stateDir, params.detected.nativeClaimPath))) return {
		changes: [],
		warnings: ["Native device identity import is pending; restart the native app before running Doctor cleanup."]
	};
	const changes = [];
	const warnings = [];
	const notices = [];
	let removed = 0;
	for (const candidate of [params.detected.sourcePath, params.detected.claimPath]) {
		if (!await params.stateRoot.exists(relativeLegacyPath(params.stateDir, candidate))) continue;
		let snapshot;
		try {
			snapshot = await readLegacySourceSnapshot$1({
				stateRoot: params.stateRoot,
				stateDir: params.stateDir,
				sourcePath: candidate
			});
		} catch (error) {
			warnings.push(`Retired device identity cleanup refused ${candidate}: ${String(error)}`);
			continue;
		}
		if (snapshot.sha256 !== params.receipt.sourceSha256) {
			try {
				if (readStoredDeviceIdentityReadOnly({
					env: params.env,
					identityKey: IDENTITY_KEY
				})) {
					notices.push(`Preserved retired device identity ${candidate}: bytes differ from the migration receipt; the canonical SQLite identity remains authoritative. Archive or delete the file to clear this notice.`);
					continue;
				}
			} catch {}
			warnings.push(`Retired device identity cleanup preserved ${candidate}: bytes differ from the migration receipt.`);
			continue;
		}
		try {
			verifyCanonicalIdentity(snapshot.identity, params.env);
			await removePath({
				...params,
				sourcePath: candidate
			});
			removed += 1;
		} catch (error) {
			warnings.push(`Retired device identity cleanup failed for ${candidate}: ${String(error)}`);
		}
	}
	if (warnings.length === 0 && (!params.receipt.removedSource || removed > 0) && (notices.length === 0 || removed > 0)) markLegacyMigrationSourceRemoved(params.receipt.sourceKey, params.env);
	if (removed > 0) changes.push("Removed retired device identity JSON covered by its SQLite receipt.");
	return {
		changes,
		warnings,
		notices
	};
}
async function migrateWithExclusiveStateOwnership$1(params) {
	const receipt = readLegacyMigrationReceipt(resolveLegacyMigrationSourceKey("device-identity-json", params.detected.sourcePath), params.env);
	if (receipt) return await cleanupReceiptSources({
		...params,
		receipt
	});
	if (await params.stateRoot.exists(relativeLegacyPath(params.stateDir, params.detected.nativeClaimPath))) return {
		changes: [],
		warnings: ["Native device identity import is pending; restart the native app before running Doctor."]
	};
	const hasSource = await params.stateRoot.exists(relativeLegacyPath(params.stateDir, params.detected.sourcePath));
	const hasClaim = await params.stateRoot.exists(relativeLegacyPath(params.stateDir, params.detected.claimPath));
	if (hasSource && hasClaim) return {
		changes: [],
		warnings: ["Failed migrating legacy device identity: source and interrupted claim both exist."]
	};
	const activePath = hasSource ? params.detected.sourcePath : hasClaim ? params.detected.claimPath : null;
	if (!activePath) return {
		changes: [],
		warnings: []
	};
	let snapshot;
	try {
		snapshot = await readLegacySourceSnapshot$1({
			stateRoot: params.stateRoot,
			stateDir: params.stateDir,
			sourcePath: activePath
		});
	} catch (error) {
		return {
			changes: [],
			warnings: [`Failed reading legacy device identity: ${String(error)}`]
		};
	}
	if (activePath === params.detected.sourcePath) try {
		params.beforeClaim?.(params.detected.sourcePath);
		await params.stateRoot.move(relativeLegacyPath(params.stateDir, params.detected.sourcePath), relativeLegacyPath(params.stateDir, params.detected.claimPath));
		const claimed = await readLegacySourceSnapshot$1({
			stateRoot: params.stateRoot,
			stateDir: params.stateDir,
			sourcePath: params.detected.claimPath
		});
		if (!legacyMigrationSourceSnapshotsMatch(snapshot, claimed)) throw new Error("legacy device identity changed before Doctor could claim it");
		snapshot = claimed;
	} catch (error) {
		const restoreError = await restoreClaim({
			...params,
			...params.detected
		});
		return {
			changes: [],
			warnings: [`Failed migrating legacy device identity: ${String(error)}${restoreError ? `; restore failure: ${restoreError}` : ""}`]
		};
	}
	let result;
	try {
		result = importAndRecordReceipt({
			env: params.env,
			sourcePath: params.detected.sourcePath,
			snapshot
		});
	} catch (error) {
		const restoreError = await restoreClaim({
			...params,
			...params.detected
		});
		return {
			changes: [],
			warnings: [`Failed migrating legacy device identity: ${String(error)}${restoreError ? `; restore failure: ${restoreError}` : ""}`]
		};
	}
	try {
		params.beforeCleanup?.();
		if (await params.stateRoot.exists(relativeLegacyPath(params.stateDir, params.detected.sourcePath))) throw new Error("legacy device identity source reappeared during import");
		const finalSnapshot = await readLegacySourceSnapshot$1({
			stateRoot: params.stateRoot,
			stateDir: params.stateDir,
			sourcePath: params.detected.claimPath
		});
		if (!legacyMigrationSourceSnapshotsMatch(snapshot, finalSnapshot)) throw new Error("legacy device identity claim changed after SQLite import");
		verifyCanonicalIdentity(finalSnapshot.identity, params.env);
		await removePath({
			...params,
			sourcePath: params.detected.claimPath
		});
		if (await params.stateRoot.exists(relativeLegacyPath(params.stateDir, params.detected.claimPath))) throw new Error("legacy device identity Doctor claim remains after cleanup");
		markLegacyMigrationSourceRemoved(result.sourceKey, params.env);
	} catch (error) {
		return {
			changes: [],
			warnings: [`Device identity is in SQLite, but legacy cleanup failed: ${String(error)}`]
		};
	}
	return {
		changes: [result.imported ? "Migrated primary device identity to SQLite." : "Preserved identical primary device identity already in SQLite."],
		warnings: [],
		notices: ["Removed retired device identity JSON after verified SQLite import."]
	};
}
/**
* Import a verified retired primary identity under explicit Doctor or startup authority.
* Startup authority cannot repair or replace an invalid canonical identity.
*/
async function migrateLegacyDeviceIdentity(params) {
	if (!params.detected.hasLegacy && !params.detected.hasInvalidCanonical) return {
		changes: [],
		warnings: []
	};
	if (params.doctorOnlyStateMigrations !== true && params.allowLegacyDeviceIdentityImport !== true) return {
		changes: [],
		warnings: []
	};
	let identityCoordinator;
	return await withLegacyMigrationStateLock({
		stateDir: params.stateDir,
		env: params.env,
		label: "legacy device identity",
		releaseLabel: "Device identity",
		errorLabel: "Failed reading legacy device identity state",
		beforeRelease: () => identityCoordinator?.release(),
		run: async (env) => {
			try {
				identityCoordinator = acquireDeviceIdentityCoordinator({
					databasePath: resolveDeviceIdentityStore({
						env,
						identityKey: IDENTITY_KEY
					}).databasePath,
					stateDir: params.stateDir
				});
			} catch (error) {
				return {
					changes: [],
					warnings: [`Failed migrating legacy device identity: identity state is busy (${formatErrorMessage(error)}).`]
				};
			}
			if (hasLegacyDeviceIdentityPath(params.detected)) {
				const stateRoot = await root(params.stateDir, {
					hardlinks: "reject",
					maxBytes: MAX_LEGACY_IDENTITY_BYTES,
					symlinks: "reject"
				});
				return await migrateWithExclusiveStateOwnership$1({
					...params,
					env,
					stateRoot
				});
			}
			return params.detected.hasInvalidCanonical ? repairInvalidCanonicalIdentity(env) : {
				changes: [],
				warnings: []
			};
		}
	});
}
//#endregion
//#region src/infra/state-migrations.exec-approvals.ts
const DOCTOR_CLAIM_SUFFIX = ".doctor-importing";
const MAX_LEGACY_EXEC_APPROVALS_BYTES = 4 * 1024 * 1024;
const MIGRATION_KIND = "legacy-exec-approvals-json";
const TARGET_TABLE = "exec_approvals_config";
const utf8Decoder = new TextDecoder("utf-8", { fatal: true });
/** Detect retired approvals only when an explicit Doctor flow opts in. */
function detectLegacyExecApprovals(params) {
	const sourcePath = resolveExecApprovalsPath({
		...process.env,
		OPENCLAW_STATE_DIR: params.stateDir
	});
	const sourcePresent = legacyMigrationSourceOrClaimMayExist(sourcePath, DOCTOR_CLAIM_SUFFIX);
	return {
		sourcePath,
		hasLegacy: params.doctorOnlyStateMigrations === true && sourcePresent
	};
}
async function readLegacySourceSnapshot(stateRoot, stateDir, sourcePath) {
	const snapshot = await readLegacyMigrationSourceSnapshot({
		stateRoot,
		stateDir,
		sourcePath,
		maxBytes: MAX_LEGACY_EXEC_APPROVALS_BYTES,
		label: "exec approvals"
	});
	let raw = null;
	try {
		raw = utf8Decoder.decode(snapshot.buffer);
	} catch {}
	return {
		...snapshot,
		raw
	};
}
function decideAndRecordMigration(params) {
	const sourceKey = resolveLegacyMigrationSourceKey("exec-approvals-json", params.sourcePath);
	const runId = `${sourceKey}:${params.snapshot.sha256.slice(0, 16)}`;
	const now = Date.now();
	const legacyFile = params.snapshot.raw === null ? null : tryParsePersistedExecApprovals(params.snapshot.raw);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const canonical = readExecApprovalsConfigRow(db);
		const canonicalFile = canonical ? tryParsePersistedExecApprovals(canonical.raw_json) : null;
		const importedRaw = legacyFile ? serializeExecApprovals(legacyFile) : null;
		const receipt = readLegacyMigrationReceiptFromDatabase(db, sourceKey);
		let receiptImportedSameSource = false;
		if (receipt?.sourceSha256 === params.snapshot.sha256) try {
			const report = JSON.parse(receipt.reportJson);
			receiptImportedSameSource = report.decision === "legacy-imported" || report.decision === "invalid-canonical-repaired" || report.decision === "receipt-authoritative";
		} catch {}
		let decision;
		let removeSource = false;
		if (!legacyFile || params.snapshot.raw === null) decision = "malformed-legacy-preserved";
		else if (receiptImportedSameSource && canonicalFile) {
			decision = "receipt-authoritative";
			removeSource = true;
		} else if (!canonical) {
			writeExecApprovalsConfigRow({
				db,
				file: legacyFile,
				raw: importedRaw ?? void 0,
				now
			});
			decision = "legacy-imported";
			removeSource = true;
		} else if (!canonicalFile) {
			writeExecApprovalsConfigRow({
				db,
				file: legacyFile,
				raw: importedRaw ?? void 0,
				now
			});
			decision = "invalid-canonical-repaired";
			removeSource = true;
		} else {
			decision = "canonical-preserved";
			removeSource = canonical.raw_json === params.snapshot.raw;
		}
		if (decision === "legacy-imported" || decision === "invalid-canonical-repaired") {
			if (!legacyFile) throw new Error("exec approvals import decisions require a parsed legacy file");
			const verified = readExecApprovalsConfigRow(db);
			const verifiedFile = verified ? tryParsePersistedExecApprovals(verified.raw_json) : null;
			const rawMatches = verified?.raw_json === importedRaw;
			const fileMatches = verifiedFile && isDeepStrictEqual(JSON.parse(serializeExecApprovals(verifiedFile)), JSON.parse(serializeExecApprovals(legacyFile)));
			if (!rawMatches || !fileMatches) throw new Error(`SQLite verification failed for the exec approvals migration (raw=${rawMatches}, parsed=${Boolean(fileMatches)})`);
		}
		const reportJson = JSON.stringify({
			source: MIGRATION_KIND,
			target: TARGET_TABLE,
			decision,
			sourceSha256: params.snapshot.sha256,
			sourceValid: legacyFile !== null,
			importedRecordCount: decision === "legacy-imported" || decision === "invalid-canonical-repaired" ? 1 : 0,
			preservedSqliteRecordCount: decision === "canonical-preserved" || decision === "receipt-authoritative" ? 1 : 0,
			removesSource: removeSource
		});
		recordLegacyMigrationReceipt(db, {
			sourceKey,
			migrationKind: MIGRATION_KIND,
			sourcePath: params.sourcePath,
			targetTable: TARGET_TABLE,
			sourceSha256: params.snapshot.sha256,
			sourceSizeBytes: params.snapshot.size,
			sourceRecordCount: legacyFile ? 1 : 0,
			runId,
			now,
			reportJson,
			upsert: true
		});
		return {
			decision,
			removeSource,
			sourceKey
		};
	}, { env: params.env }, { operationLabel: "state-migration.exec-approvals" });
}
function decisionMessage(decision, removeSource) {
	switch (decision) {
		case "legacy-imported": return "Imported legacy exec approvals into shared SQLite state.";
		case "invalid-canonical-repaired": return "Replaced an invalid SQLite exec approvals row with validated legacy state.";
		case "canonical-preserved": return removeSource ? "Preserved byte-identical canonical SQLite exec approvals." : "Preserved canonical SQLite exec approvals and retained conflicting legacy JSON.";
		case "malformed-legacy-preserved": return "Preserved malformed legacy exec approvals for operator recovery.";
		case "receipt-authoritative": return "Completed cleanup for previously imported legacy exec approvals.";
	}
	return decision;
}
async function migrateWithExclusiveStateOwnership(params) {
	const sourcePath = params.detected.sourcePath;
	const source = new LegacyMigrationSourceClaim({
		stateRoot: params.stateRoot,
		stateDir: params.stateDir,
		sourcePath,
		label: "exec approvals",
		includeFilePath: false,
		claimSuffix: DOCTOR_CLAIM_SUFFIX,
		readSnapshot: (snapshotPath) => readLegacySourceSnapshot(params.stateRoot, params.stateDir, snapshotPath)
	});
	try {
		await source.recover("legacy exec approvals source and interrupted claim both exist");
	} catch (error) {
		return {
			changes: [],
			warnings: [`Failed recovering a legacy exec approvals Doctor claim: ${String(error)}`]
		};
	}
	if (!await source.exists()) return {
		changes: [],
		warnings: []
	};
	let snapshot;
	try {
		snapshot = await source.read();
	} catch (error) {
		return {
			changes: [],
			warnings: [`Failed reading legacy exec approvals: ${String(error)}`]
		};
	}
	try {
		params.beforeVerify?.();
		if (!legacyMigrationSourceSnapshotsMatch(await source.read(), snapshot)) throw new Error("legacy exec approvals changed after migration loaded them");
		await source.claim({
			snapshot,
			mismatchMessage: "legacy exec approvals changed before migration could claim them",
			beforeClaim: params.beforeClaim
		});
	} catch (error) {
		const restoreError = await source.restore();
		return {
			changes: [],
			warnings: [`Failed claiming legacy exec approvals: ${String(error)}${restoreError ? `; restore failure: ${restoreError}` : ""}`]
		};
	}
	let result;
	try {
		result = decideAndRecordMigration({
			env: params.env,
			sourcePath,
			snapshot
		});
	} catch (error) {
		const restoreError = await source.restore();
		return {
			changes: [],
			warnings: [`Failed migrating legacy exec approvals: ${String(error)}${restoreError ? `; restore failure: ${restoreError}` : ""}`]
		};
	}
	if (!result.removeSource) {
		const restoreError = await source.restore();
		return {
			changes: [],
			warnings: [`${decisionMessage(result.decision, result.removeSource)}${restoreError ? ` Claim restore failed: ${restoreError}` : ""}`]
		};
	}
	try {
		await source.remove({
			removeSource: params.removeSource,
			sourceReappearedMessage: "legacy exec approvals reappeared during migration cleanup",
			remainingMessage: "legacy exec approvals remain after migration cleanup"
		});
	} catch (error) {
		return {
			changes: [],
			warnings: [`Legacy exec approvals cleanup failed: ${String(error)}`]
		};
	}
	const warnings = [];
	try {
		markLegacyMigrationSourceRemoved(result.sourceKey, params.env, "state-migration.exec-approvals.receipt");
	} catch (error) {
		warnings.push(`Legacy exec approvals were removed, but their receipt could not be finalized: ${String(error)}`);
	}
	return {
		changes: [decisionMessage(result.decision, result.removeSource)],
		warnings,
		notices: ["Removed retired exec approvals JSON after recording its migration decision."]
	};
}
/** Import or retire the old file under exclusive state ownership. */
async function migrateLegacyExecApprovals(params) {
	const detected = params.detected;
	if (!detected?.hasLegacy) return {
		changes: [],
		warnings: []
	};
	return await withLegacyMigrationStateLock({
		stateDir: params.stateDir,
		env: params.env,
		label: "legacy exec approvals",
		releaseLabel: "Exec approvals",
		errorLabel: "Failed reading legacy exec approvals",
		retryGuidance: "Stop the Gateway, then run `openclaw doctor --fix` again.",
		run: async (env) => {
			const stateRoot = await root(params.stateDir, {
				hardlinks: "reject",
				maxBytes: MAX_LEGACY_EXEC_APPROVALS_BYTES,
				symlinks: "reject"
			});
			return await migrateWithExclusiveStateOwnership({
				...params,
				detected,
				env,
				stateRoot
			});
		}
	});
}
//#endregion
export { migrateLegacyDeviceAuth as _, assertLegacyMigrationSourceUnchanged as a, legacyMigrationPathMayExist as c, readLegacyMigrationSourceSnapshot as d, readLegacyMigrationSourceSnapshotSync as f, detectLegacyDeviceAuth as g, detectLegacyDeviceIdentity as h, LegacyMigrationSourceClaim as i, legacyMigrationSourceOrClaimMayExist as l, restoreLegacyMigrationSourceClaims as m, migrateLegacyExecApprovals as n, claimAndRemoveLegacyMigrationSource as o, resolveLegacyMigrationRelativePath as p, migrateLegacyDeviceIdentity as r, claimLegacyMigrationSourceClaims as s, detectLegacyExecApprovals as t, legacyMigrationSourceSnapshotsMatch as u, withLegacyMigrationStateLock as v };
