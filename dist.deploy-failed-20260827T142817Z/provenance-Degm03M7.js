import "./src-BkwWvwB2.js";
import { t as stableStringify } from "./stable-stringify-DoZ6Yalc.js";
import { Nt as tableHasColumn, d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-CXrhNigN.js";
import { c as upgradeClawInstallSchema, l as digestClawAgentConfig, n as deleteCachedClawInstallSchemaVersion, o as CLAW_INSTALL_RECORD_SCHEMA_VERSION, s as parseClawInstallRecordSchemaVersion, t as cacheClawInstallSchemaVersion } from "./provenance-runtime-read-BpA_QW4N.js";
//#region src/claws/package-extension-provenance.ts
const CLAW_PACKAGE_REF_SCHEMA_VERSION = "openclaw.clawPackageRef.v1";
function parsePackageRefExtension(row) {
	const values = [
		row.extension_id,
		row.extension_format,
		row.extension_detected_format,
		row.extension_mapped_json,
		row.extension_unavailable_json,
		row.extension_adapter_identity
	];
	if (values.every((value) => value === null)) return;
	if (values.some((value) => value === null)) throw new Error(`Claw package reference ${row.package_kind}:${row.package_ref} has incomplete extension provenance.`);
	const formats = /* @__PURE__ */ new Set([
		"openclaw",
		"claude",
		"codex",
		"cursor"
	]);
	if (!formats.has(row.extension_format) || !formats.has(row.extension_detected_format)) throw new Error(`Claw package reference ${row.package_kind}:${row.package_ref} has unsupported extension format provenance.`);
	const mapped = JSON.parse(row.extension_mapped_json);
	const unavailable = JSON.parse(row.extension_unavailable_json);
	if (!Array.isArray(mapped) || !mapped.every((value) => typeof value === "string") || !Array.isArray(unavailable) || !unavailable.every((value) => typeof value === "string")) throw new Error(`Claw package reference ${row.package_kind}:${row.package_ref} has invalid extension inventory provenance.`);
	return {
		id: row.extension_id,
		format: row.extension_format,
		detectedFormat: row.extension_detected_format,
		mapped,
		unavailable,
		adapterIdentity: row.extension_adapter_identity
	};
}
function rowToPackageRef(row) {
	const extension = parsePackageRefExtension(row);
	return {
		schemaVersion: CLAW_PACKAGE_REF_SCHEMA_VERSION,
		agentId: row.agent_id,
		clawName: row.claw_name,
		kind: row.package_kind,
		source: row.package_source,
		ref: row.package_ref,
		version: row.package_version,
		integrity: row.package_integrity,
		status: row.package_status,
		relationship: row.relationship,
		origin: row.origin,
		independentOwner: Number(row.independent_owner) === 1,
		...extension ? { extension } : {},
		installedAtMs: Number(row.installed_at_ms),
		updatedAtMs: Number(row.updated_at_ms)
	};
}
//#endregion
//#region src/claws/provenance-bootstrap.ts
function selectClawBootstrapProvenanceColumns(db) {
	return `${tableHasColumn(db, "claw_installs", "bootstrap_source_path") ? "bootstrap_source_path" : "NULL AS bootstrap_source_path"}, ${tableHasColumn(db, "claw_installs", "bootstrap_content_digest") ? "bootstrap_content_digest" : "NULL AS bootstrap_content_digest"}`;
}
function clawBootstrapProvenanceFromRow(row) {
	return row.bootstrap_source_path && row.bootstrap_content_digest ? { bootstrap: {
		sourcePath: row.bootstrap_source_path,
		contentDigest: row.bootstrap_content_digest
	} } : {};
}
//#endregion
//#region src/claws/provenance-legacy-columns.ts
function canSelect(db, table, projection) {
	try {
		db.prepare(`SELECT ${projection} FROM ${table} LIMIT 0`);
		return true;
	} catch {
		return false;
	}
}
/**
* Read-only opens never run the additive column migration, so a same-version
* database written before a column existed must still answer planning reads.
* Absent columns project as SQL NULL, which the row parsers already treat as
* "no recorded provenance".
*/
function legacySafeColumnProjection(db, table, columns) {
	const full = columns.join(", ");
	if (canSelect(db, table, full)) return full;
	return columns.map((column) => canSelect(db, table, column) ? column : `NULL AS ${column}`).join(", ");
}
//#endregion
//#region src/claws/provenance.ts
function rowToRecord(row) {
	return {
		schemaVersion: parseClawInstallRecordSchemaVersion(row.schema_version),
		claw: {
			kind: row.source_kind,
			name: row.claw_name,
			version: row.claw_version,
			packageRoot: row.package_root,
			manifestPath: row.manifest_path,
			integrityKind: row.integrity_kind,
			integrity: row.integrity,
			byteLength: Number(row.source_byte_length)
		},
		manifestSchemaVersion: Number(row.manifest_schema_version),
		planIntegrity: row.plan_integrity,
		agentId: row.agent_id,
		workspace: row.workspace,
		agentConfigDigest: row.agent_config_digest,
		agentOwnedPaths: JSON.parse(row.agent_owned_paths_json),
		...clawBootstrapProvenanceFromRow(row),
		status: row.status,
		addedAtMs: Number(row.added_at_ms),
		updatedAtMs: Number(row.updated_at_ms)
	};
}
function agentOwnedPaths(plan) {
	return plan.actions.filter((action) => action.kind === "agent").map((action) => action.target);
}
function bootstrapProvenance(plan) {
	const action = plan.actions.find((candidate) => candidate.kind === "bootstrap");
	const sourcePath = action?.details?.sourcePath;
	return action && typeof sourcePath === "string" && action.digest ? {
		sourcePath,
		contentDigest: action.digest
	} : void 0;
}
function clawInstallRecordMatchesPlan(record, plan) {
	const bootstrap = bootstrapProvenance(plan);
	return record.claw.kind === plan.claw.kind && record.claw.name === plan.claw.name && record.claw.version === plan.claw.version && record.claw.packageRoot === plan.claw.packageRoot && record.claw.manifestPath === plan.claw.manifestPath && record.claw.integrityKind === plan.claw.integrityKind && record.claw.integrity === plan.claw.integrity && record.claw.byteLength === plan.claw.byteLength && record.manifestSchemaVersion === plan.manifestSchemaVersion && record.planIntegrity === plan.planIntegrity && record.workspace === plan.agent.workspace && record.agentConfigDigest === digestClawAgentConfig(plan.agent.config) && stableStringify(record.agentOwnedPaths) === stableStringify(agentOwnedPaths(plan)) && record.bootstrap?.sourcePath === bootstrap?.sourcePath && record.bootstrap?.contentDigest === bootstrap?.contentDigest;
}
function selectClawInstallRow(db, agentId) {
	const bootstrapColumns = selectClawBootstrapProvenanceColumns(db);
	return db.prepare(`SELECT agent_id, schema_version, source_kind, claw_name, claw_version,
              package_root, manifest_path, integrity_kind, integrity, source_byte_length,
              manifest_schema_version, plan_integrity, workspace, agent_config_digest,
              agent_owned_paths_json, ${bootstrapColumns},
              status, added_at_ms, updated_at_ms
         FROM claw_installs
        WHERE agent_id = ?`).get(agentId);
}
function readClawInstallRecordFromDatabase(db, agentId) {
	const row = selectClawInstallRow(db, agentId);
	return row ? rowToRecord(row) : void 0;
}
function readClawInstallRecord(agentId, options = {}) {
	const row = selectClawInstallRow(openOpenClawStateDatabase(options).db, agentId);
	return row ? rowToRecord(row) : void 0;
}
function persistClawInstallRecord(plan, options = {}) {
	const nowMs = options.nowMs ?? Date.now();
	const status = options.status ?? "complete";
	const agentConfigDigest = digestClawAgentConfig(plan.agent.config);
	const ownedPaths = agentOwnedPaths(plan);
	const bootstrap = bootstrapProvenance(plan);
	const persistedRecord = runOpenClawStateWriteTransaction(({ db }) => {
		const existing = selectClawInstallRow(db, plan.agent.finalId);
		if (existing) {
			const record = rowToRecord(existing);
			const expectedPlan = options.expectedExistingPlan ?? plan;
			if (existing.status !== "complete" && clawInstallRecordMatchesPlan(record, expectedPlan)) {
				if (record.schemaVersion !== "openclaw.clawInstallRecord.v2") {
					if (options.deferLegacyPlanUpgrade) return record;
					return upgradeClawInstallSchema(db, plan.agent.finalId, record, options.expectedExistingRecord, {
						planIntegrity: plan.planIntegrity,
						agentConfigDigest
					});
				}
				return record;
			}
			throw new Error(`Claw install record for agent ${JSON.stringify(plan.agent.finalId)} already exists.`);
		}
		db.prepare(`INSERT INTO claw_installs (
         agent_id, schema_version, source_kind, claw_name, claw_version,
         package_root, manifest_path, integrity_kind, integrity, source_byte_length,
         manifest_schema_version, plan_integrity, workspace, agent_config_digest,
         agent_owned_paths_json, bootstrap_source_path, bootstrap_content_digest,
         status, added_at_ms, updated_at_ms
       ) VALUES (
         @agent_id, @schema_version, @source_kind, @claw_name, @claw_version,
         @package_root, @manifest_path, @integrity_kind, @integrity, @source_byte_length,
         @manifest_schema_version, @plan_integrity, @workspace, @agent_config_digest,
         @agent_owned_paths_json, @bootstrap_source_path, @bootstrap_content_digest,
         @status, @added_at_ms, @updated_at_ms
       )`).run({
			agent_id: plan.agent.finalId,
			schema_version: CLAW_INSTALL_RECORD_SCHEMA_VERSION,
			source_kind: plan.claw.kind,
			claw_name: plan.claw.name,
			claw_version: plan.claw.version,
			package_root: plan.claw.packageRoot,
			manifest_path: plan.claw.manifestPath,
			integrity_kind: plan.claw.integrityKind,
			integrity: plan.claw.integrity,
			source_byte_length: plan.claw.byteLength,
			manifest_schema_version: plan.manifestSchemaVersion,
			plan_integrity: plan.planIntegrity,
			workspace: plan.agent.workspace,
			agent_config_digest: agentConfigDigest,
			agent_owned_paths_json: JSON.stringify(ownedPaths),
			bootstrap_source_path: bootstrap?.sourcePath ?? null,
			bootstrap_content_digest: bootstrap?.contentDigest ?? null,
			status,
			added_at_ms: nowMs,
			updated_at_ms: nowMs
		});
		return {
			schemaVersion: CLAW_INSTALL_RECORD_SCHEMA_VERSION,
			claw: plan.claw,
			manifestSchemaVersion: plan.manifestSchemaVersion,
			planIntegrity: plan.planIntegrity,
			agentId: plan.agent.finalId,
			workspace: plan.agent.workspace,
			agentConfigDigest,
			agentOwnedPaths: ownedPaths,
			...bootstrap ? { bootstrap } : {},
			status,
			addedAtMs: nowMs,
			updatedAtMs: nowMs
		};
	}, options);
	cacheClawInstallSchemaVersion(plan.agent.finalId, persistedRecord.schemaVersion, persistedRecord.agentConfigDigest, options);
	return persistedRecord;
}
function updateClawInstallRecordStatus(agentId, status, options = {}) {
	runOpenClawStateWriteTransaction(({ db }) => {
		const expectedStatuses = options.expectedStatuses ?? [];
		const expectedClause = expectedStatuses.length > 0 ? ` AND status IN (${expectedStatuses.map(() => "?").join(", ")})` : "";
		if (db.prepare(`UPDATE claw_installs
            SET status = ?, updated_at_ms = ?
          WHERE agent_id = ?${expectedClause}`).run(status, options.nowMs ?? Date.now(), agentId, ...expectedStatuses).changes !== 1) throw new Error(`Claw install record for agent ${JSON.stringify(agentId)} did not match the expected phase.`);
	}, options);
}
function deleteClawInstallRecord(agentId, options = {}) {
	runOpenClawStateWriteTransaction(({ db }) => {
		const expectedStatuses = options.expectedStatuses ?? [];
		const expectedClause = expectedStatuses.length > 0 ? ` AND status IN (${expectedStatuses.map(() => "?").join(", ")})` : "";
		if (db.prepare(`DELETE FROM claw_installs WHERE agent_id = ?${expectedClause}`).run(agentId, ...expectedStatuses).changes !== 1) throw new Error(`Claw install record for agent ${JSON.stringify(agentId)} did not match the expected phase.`);
	}, options);
	deleteCachedClawInstallSchemaVersion(agentId, options);
}
function readClawInstallRecords(options = {}) {
	const database = openOpenClawStateDatabase(options);
	const bootstrapColumns = selectClawBootstrapProvenanceColumns(database.db);
	return database.db.prepare(`SELECT schema_version, source_kind, claw_name, claw_version, package_root,
              manifest_path, integrity_kind, integrity, source_byte_length,
              manifest_schema_version, plan_integrity, agent_id, workspace,
              agent_config_digest, agent_owned_paths_json, ${bootstrapColumns},
              status, added_at_ms,
              updated_at_ms
         FROM claw_installs
        ORDER BY agent_id`).all().map(rowToRecord);
}
function updateClawInstallRecord(plan, options = {}) {
	const current = readClawInstallRecord(plan.agent.finalId, options);
	if (!current) throw new Error(`No Claw install record exists for agent ${JSON.stringify(plan.agent.finalId)}.`);
	const updatedAtMs = options.nowMs ?? Date.now();
	const status = options.status ?? "complete";
	const agentConfigDigest = digestClawAgentConfig(plan.agent.config);
	const ownedAgentPaths = plan.actions.filter((action) => action.kind === "agent").map((action) => action.target);
	const bootstrap = bootstrapProvenance(plan) ?? current.bootstrap;
	runOpenClawStateWriteTransaction(({ db }) => {
		const result = db.prepare(`UPDATE claw_installs
            SET schema_version = @schema_version,
                source_kind = @source_kind,
                claw_name = @claw_name,
                claw_version = @claw_version,
                package_root = @package_root,
                manifest_path = @manifest_path,
                integrity_kind = @integrity_kind,
                integrity = @integrity,
                source_byte_length = @source_byte_length,
                manifest_schema_version = @manifest_schema_version,
                plan_integrity = @plan_integrity,
                workspace = @workspace,
                agent_config_digest = @agent_config_digest,
                agent_owned_paths_json = @agent_owned_paths_json,
                bootstrap_source_path = @bootstrap_source_path,
                bootstrap_content_digest = @bootstrap_content_digest,
                status = @status,
                updated_at_ms = @updated_at_ms
          WHERE agent_id = @agent_id
            AND claw_version = @expected_claw_version
            AND integrity = @expected_integrity`).run({
			agent_id: plan.agent.finalId,
			schema_version: CLAW_INSTALL_RECORD_SCHEMA_VERSION,
			source_kind: plan.claw.kind,
			claw_name: plan.claw.name,
			claw_version: plan.claw.version,
			package_root: plan.claw.packageRoot,
			manifest_path: plan.claw.manifestPath,
			integrity_kind: plan.claw.integrityKind,
			integrity: plan.claw.integrity,
			source_byte_length: plan.claw.byteLength,
			manifest_schema_version: plan.manifestSchemaVersion,
			plan_integrity: plan.planIntegrity,
			workspace: plan.agent.workspace,
			agent_config_digest: agentConfigDigest,
			agent_owned_paths_json: JSON.stringify(ownedAgentPaths),
			bootstrap_source_path: bootstrap?.sourcePath ?? null,
			bootstrap_content_digest: bootstrap?.contentDigest ?? null,
			status,
			updated_at_ms: updatedAtMs,
			expected_claw_version: options.expectedClaw?.version ?? current.claw.version,
			expected_integrity: options.expectedClaw?.integrity ?? current.claw.integrity
		});
		if (Number(result.changes) !== 1) throw new Error(`Claw install record changed for agent ${JSON.stringify(plan.agent.finalId)}.`);
	}, options);
	const record = {
		schemaVersion: CLAW_INSTALL_RECORD_SCHEMA_VERSION,
		claw: plan.claw,
		manifestSchemaVersion: plan.manifestSchemaVersion,
		planIntegrity: plan.planIntegrity,
		agentId: plan.agent.finalId,
		workspace: plan.agent.workspace,
		agentConfigDigest,
		agentOwnedPaths: ownedAgentPaths,
		...bootstrap ? { bootstrap } : {},
		status,
		addedAtMs: current.addedAtMs,
		updatedAtMs
	};
	cacheClawInstallSchemaVersion(plan.agent.finalId, record.schemaVersion, record.agentConfigDigest, options);
	return record;
}
function persistClawPackageRef(plan, pkg, options = {}) {
	const nowMs = options.nowMs ?? Date.now();
	let record = {
		schemaVersion: CLAW_PACKAGE_REF_SCHEMA_VERSION,
		agentId: plan.agent.finalId,
		clawName: plan.claw.name,
		kind: pkg.kind,
		source: pkg.source,
		ref: pkg.ref,
		version: pkg.version,
		integrity: pkg.integrity,
		status: options.status ?? "complete",
		relationship: options.relationship ?? (pkg.kind === "skill" ? "managed" : "referenced"),
		origin: options.origin ?? "claw-introduced",
		independentOwner: options.independentOwner ?? false,
		...pkg.extension ? { extension: pkg.extension } : {},
		installedAtMs: nowMs,
		updatedAtMs: nowMs
	};
	runOpenClawStateWriteTransaction(({ db }) => {
		const existing = db.prepare(`SELECT schema_version, agent_id, claw_name, package_kind, package_source,
                package_ref, package_version, package_integrity, package_status, relationship, origin,
                independent_owner, extension_id, extension_format, extension_detected_format,
                extension_mapped_json, extension_unavailable_json, extension_adapter_identity,
                installed_at_ms, updated_at_ms
           FROM claw_package_refs
          WHERE agent_id = @agent_id
            AND package_kind = @package_kind
            AND package_source = @package_source
            AND package_ref = @package_ref
            AND package_version = @package_version`).get({
			agent_id: record.agentId,
			package_kind: record.kind,
			package_source: record.source,
			package_ref: record.ref,
			package_version: record.version
		});
		if (existing) {
			const previous = rowToPackageRef(existing);
			if (previous.integrity !== record.integrity) throw new Error(`Claw package reference ${record.kind}:${record.ref}@${record.version} changed integrity from ${previous.integrity} to ${record.integrity}.`);
			record = {
				...record,
				relationship: previous.relationship,
				origin: previous.origin === "claw-introduced" ? "claw-introduced" : record.origin,
				independentOwner: previous.independentOwner || record.independentOwner,
				installedAtMs: previous.installedAtMs
			};
			db.prepare(`UPDATE claw_package_refs
            SET schema_version = @schema_version,
                claw_name = @claw_name,
                package_status = @package_status,
                relationship = @relationship,
                origin = @origin,
                independent_owner = @independent_owner,
                extension_id = @extension_id,
                extension_format = @extension_format,
                extension_detected_format = @extension_detected_format,
                extension_mapped_json = @extension_mapped_json,
                extension_unavailable_json = @extension_unavailable_json,
                extension_adapter_identity = @extension_adapter_identity,
                updated_at_ms = @updated_at_ms
          WHERE agent_id = @agent_id
            AND package_kind = @package_kind
            AND package_source = @package_source
            AND package_ref = @package_ref
            AND package_version = @package_version
            AND package_integrity = @package_integrity`).run({
				agent_id: record.agentId,
				package_kind: record.kind,
				package_source: record.source,
				package_ref: record.ref,
				package_version: record.version,
				package_integrity: record.integrity,
				schema_version: record.schemaVersion,
				claw_name: record.clawName,
				package_status: record.status,
				relationship: record.relationship,
				origin: record.origin,
				independent_owner: record.independentOwner ? 1 : 0,
				extension_id: record.extension?.id ?? null,
				extension_format: record.extension?.format ?? null,
				extension_detected_format: record.extension?.detectedFormat ?? null,
				extension_mapped_json: record.extension ? JSON.stringify(record.extension.mapped) : null,
				extension_unavailable_json: record.extension ? JSON.stringify(record.extension.unavailable) : null,
				extension_adapter_identity: record.extension?.adapterIdentity ?? null,
				updated_at_ms: record.updatedAtMs
			});
			return;
		}
		db.prepare(`INSERT INTO claw_package_refs (
         agent_id, package_kind, package_source, package_ref, package_version,
         package_integrity, schema_version, claw_name, package_status, relationship, origin,
         independent_owner, extension_id, extension_format, extension_detected_format,
         extension_mapped_json, extension_unavailable_json, extension_adapter_identity,
         installed_at_ms,
         updated_at_ms
       ) VALUES (
         @agent_id, @package_kind, @package_source, @package_ref, @package_version,
         @package_integrity, @schema_version, @claw_name, @package_status, @relationship, @origin,
         @independent_owner, @extension_id, @extension_format, @extension_detected_format,
         @extension_mapped_json, @extension_unavailable_json, @extension_adapter_identity,
         @installed_at_ms,
         @updated_at_ms
       )`).run({
			agent_id: record.agentId,
			package_kind: record.kind,
			package_source: record.source,
			package_ref: record.ref,
			package_version: record.version,
			package_integrity: record.integrity,
			schema_version: record.schemaVersion,
			claw_name: record.clawName,
			package_status: record.status,
			relationship: record.relationship,
			origin: record.origin,
			independent_owner: record.independentOwner ? 1 : 0,
			extension_id: record.extension?.id ?? null,
			extension_format: record.extension?.format ?? null,
			extension_detected_format: record.extension?.detectedFormat ?? null,
			extension_mapped_json: record.extension ? JSON.stringify(record.extension.mapped) : null,
			extension_unavailable_json: record.extension ? JSON.stringify(record.extension.unavailable) : null,
			extension_adapter_identity: record.extension?.adapterIdentity ?? null,
			installed_at_ms: record.installedAtMs,
			updated_at_ms: record.updatedAtMs
		});
	}, options);
	return record;
}
function updateClawPackageRefStatus(ref, status, options = {}) {
	const nowMs = options.nowMs ?? Date.now();
	runOpenClawStateWriteTransaction(({ db }) => {
		db.prepare(`UPDATE claw_package_refs
          SET package_status = @package_status, updated_at_ms = @updated_at_ms
        WHERE agent_id = @agent_id
          AND package_kind = @package_kind
          AND package_source = @package_source
          AND package_ref = @package_ref
          AND package_version = @package_version
          AND package_integrity = @package_integrity`).run({
			agent_id: ref.agentId,
			package_kind: ref.kind,
			package_source: ref.source,
			package_ref: ref.ref,
			package_version: ref.version,
			package_integrity: ref.integrity,
			package_status: status,
			updated_at_ms: nowMs
		});
	}, options);
	return {
		...ref,
		status,
		updatedAtMs: nowMs
	};
}
function readClawPackageRefs(options = {}) {
	const database = openOpenClawStateDatabase(options);
	if (options.readOnly && !database.db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'claw_package_refs'").get()) return [];
	const conditions = [];
	const params = {};
	for (const [column, value] of [
		["agent_id", options.agentId],
		["package_kind", options.kind],
		["package_source", options.source],
		["package_ref", options.ref],
		["package_version", options.version],
		["package_integrity", options.integrity],
		["package_status", options.status]
	]) if (value !== void 0) {
		conditions.push(`${column} = @${column}`);
		params[column] = value;
	}
	const where = conditions.length > 0 ? ` WHERE ${conditions.join(" AND ")}` : "";
	const extensionColumns = legacySafeColumnProjection(database.db, "claw_package_refs", [
		"extension_id",
		"extension_format",
		"extension_detected_format",
		"extension_mapped_json",
		"extension_unavailable_json",
		"extension_adapter_identity"
	]);
	return database.db.prepare(`SELECT schema_version, agent_id, claw_name, package_kind, package_source,
              package_ref, package_version, package_integrity, package_status, relationship, origin,
              independent_owner, ${extensionColumns},
              installed_at_ms,
              updated_at_ms
         FROM claw_package_refs${where}
        ORDER BY agent_id, package_kind, package_ref`).all(params).map(rowToPackageRef);
}
//#endregion
export { readClawInstallRecord as a, readClawPackageRefs as c, updateClawPackageRefStatus as d, CLAW_PACKAGE_REF_SCHEMA_VERSION as f, persistClawPackageRef as i, updateClawInstallRecord as l, deleteClawInstallRecord as n, readClawInstallRecordFromDatabase as o, persistClawInstallRecord as r, readClawInstallRecords as s, clawInstallRecordMatchesPlan as t, updateClawInstallRecordStatus as u };
