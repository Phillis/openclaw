import "./src-BntaCZM-.js";
import { t as stableStringify } from "./stable-stringify-DoZ6Yalc.js";
import { Dt as registerOpenClawStateDatabaseLifecycleListener, jt as resolveDatabasePath, kt as assertOpenClawStateDatabaseOwner } from "./openclaw-state-db-kmBThqu6.js";
import { n as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-KXgHmJVs.js";
import { createHash } from "node:crypto";
//#region src/claws/agent-config-digest.ts
function digestClawAgentConfig(agent) {
	return `sha256:${createHash("sha256").update(stableStringify(agent)).digest("hex")}`;
}
//#endregion
//#region src/claws/provenance-schema-version.ts
const LEGACY_CLAW_INSTALL_RECORD_SCHEMA_VERSION = "openclaw.clawInstallRecord.v1";
const CLAW_INSTALL_RECORD_SCHEMA_VERSION = "openclaw.clawInstallRecord.v2";
function parseClawInstallRecordSchemaVersion(value) {
	if (value === LEGACY_CLAW_INSTALL_RECORD_SCHEMA_VERSION || value === "openclaw.clawInstallRecord.v2") return value;
	throw new Error(`Unsupported Claw install record schema ${JSON.stringify(value)}.`);
}
function upgradeClawInstallSchema(db, agentId, record, expectedRecord, replacement) {
	if (!expectedRecord || stableStringify(record) !== stableStringify(expectedRecord)) throw new Error(`Legacy Claw install record for agent ${JSON.stringify(agentId)} is not an exact resumable attempt.`);
	db.prepare(`UPDATE claw_installs
          SET schema_version = ?, plan_integrity = ?, agent_config_digest = ?
        WHERE agent_id = ?`).run(CLAW_INSTALL_RECORD_SCHEMA_VERSION, replacement?.planIntegrity ?? record.planIntegrity, replacement?.agentConfigDigest ?? record.agentConfigDigest, agentId);
	return {
		...record,
		...replacement,
		schemaVersion: CLAW_INSTALL_RECORD_SCHEMA_VERSION
	};
}
//#endregion
//#region src/claws/provenance-runtime-read.ts
const snapshotsByPath = /* @__PURE__ */ new Map();
const snapshotListeners = /* @__PURE__ */ new Set();
function notifySnapshotListeners() {
	for (const listener of snapshotListeners) listener();
}
function readSchemaVersions(db) {
	try {
		if (!db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'claw_installs'").get()) return {
			kind: "ready",
			schemaVersions: /* @__PURE__ */ new Map()
		};
		const rows = db.prepare("SELECT agent_id, schema_version, agent_config_digest FROM claw_installs").all();
		const schemaVersions = /* @__PURE__ */ new Map();
		for (const row of rows) try {
			schemaVersions.set(row.agent_id, {
				kind: "ok",
				schemaVersion: parseClawInstallRecordSchemaVersion(row.schema_version),
				agentConfigDigest: row.agent_config_digest
			});
		} catch (error) {
			schemaVersions.set(row.agent_id, {
				kind: "error",
				error
			});
		}
		return {
			kind: "ready",
			schemaVersions
		};
	} catch (error) {
		return {
			kind: "state-error",
			error,
			knownAgentIds: /* @__PURE__ */ new Set(),
			ownershipUnknown: true
		};
	}
}
function knownAgentIds(snapshot) {
	if (snapshot?.kind === "ready") return new Set(snapshot.schemaVersions.keys());
	return snapshot?.kind === "state-error" ? snapshot.knownAgentIds : /* @__PURE__ */ new Set();
}
function isOwnershipUnknown(snapshot) {
	return !snapshot || snapshot.kind === "uninitialized" || snapshot.kind === "state-error" && snapshot.ownershipUnknown;
}
registerOpenClawStateDatabaseLifecycleListener((event) => {
	const previous = snapshotsByPath.get(event.kind === "opened" ? event.database.path : event.path);
	if (event.kind === "opened") {
		const snapshot = readSchemaVersions(event.database.db);
		snapshotsByPath.set(event.database.path, snapshot.kind === "state-error" ? {
			...snapshot,
			knownAgentIds: knownAgentIds(previous),
			ownershipUnknown: isOwnershipUnknown(previous)
		} : snapshot);
	} else if (event.kind === "open-error") snapshotsByPath.set(event.path, {
		kind: "state-error",
		error: event.error,
		knownAgentIds: knownAgentIds(previous),
		ownershipUnknown: isOwnershipUnknown(previous)
	});
	else snapshotsByPath.set(event.path, {
		kind: "state-error",
		error: /* @__PURE__ */ new Error("OpenClaw state database closed before consent provenance verification."),
		knownAgentIds: knownAgentIds(previous),
		ownershipUnknown: isOwnershipUnknown(previous)
	});
	notifySnapshotListeners();
});
function resolveSnapshotPath(options) {
	return options.database?.path ?? resolveDatabasePath(options);
}
function readCachedClawInstallSchemaVersions(options = {}) {
	return snapshotsByPath.get(resolveSnapshotPath(options)) ?? { kind: "uninitialized" };
}
function initializeCachedClawInstallSchemaVersions(options = {}) {
	const path = resolveSnapshotPath(options);
	const previous = snapshotsByPath.get(path);
	try {
		const snapshot = withExistingOpenClawStateDatabaseReadOnly(({ db, path: pathname }) => {
			assertOpenClawStateDatabaseOwner(db, { pathname });
			return readSchemaVersions(db);
		}, options);
		if (snapshot) snapshotsByPath.set(path, snapshot);
		else {
			const previousAgentIds = knownAgentIds(previous);
			snapshotsByPath.set(path, previousAgentIds.size > 0 || previous !== void 0 && isOwnershipUnknown(previous) ? {
				kind: "state-error",
				error: /* @__PURE__ */ new Error("OpenClaw state database disappeared after Claw ownership was observed."),
				knownAgentIds: previousAgentIds,
				ownershipUnknown: true
			} : {
				kind: "ready",
				schemaVersions: /* @__PURE__ */ new Map()
			});
		}
	} catch (error) {
		snapshotsByPath.set(path, {
			kind: "state-error",
			error,
			knownAgentIds: knownAgentIds(previous),
			ownershipUnknown: true
		});
	}
	notifySnapshotListeners();
}
function registerClawInstallSchemaVersionSnapshotListener(listener) {
	snapshotListeners.add(listener);
	return () => snapshotListeners.delete(listener);
}
function cacheClawInstallSchemaVersion(agentId, schemaVersion, agentConfigDigest, options = {}) {
	const snapshot = snapshotsByPath.get(resolveSnapshotPath(options));
	if (snapshot?.kind !== "ready") return;
	snapshot.schemaVersions.set(agentId, {
		kind: "ok",
		schemaVersion,
		agentConfigDigest
	});
	notifySnapshotListeners();
}
function deleteCachedClawInstallSchemaVersion(agentId, options = {}) {
	const snapshot = snapshotsByPath.get(resolveSnapshotPath(options));
	if (snapshot?.kind !== "ready" || !snapshot.schemaVersions.delete(agentId)) return;
	notifySnapshotListeners();
}
//#endregion
export { registerClawInstallSchemaVersionSnapshotListener as a, upgradeClawInstallSchema as c, readCachedClawInstallSchemaVersions as i, digestClawAgentConfig as l, deleteCachedClawInstallSchemaVersion as n, CLAW_INSTALL_RECORD_SCHEMA_VERSION as o, initializeCachedClawInstallSchemaVersions as r, parseClawInstallRecordSchemaVersion as s, cacheClawInstallSchemaVersion as t };
