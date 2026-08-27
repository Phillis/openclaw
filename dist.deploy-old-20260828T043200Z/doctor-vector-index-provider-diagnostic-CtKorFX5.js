import fs from "node:fs";
import path from "node:path";
//#region extensions/memory-core/src/migration/doctor-vector-index-provider-diagnostic.ts
const MEMORY_INDEX_META_KEY = "memory_index_meta_v1";
function listConfiguredAgentIds(config) {
	const ids = new Set(Object.keys(config.agents?.entries ?? {}));
	for (const entry of config.agents?.list ?? []) if (entry.id.trim()) ids.add(entry.id.trim());
	return ids.size > 0 ? [...ids] : ["main"];
}
async function readExistingVectorModel(databasePath, inspectionMode) {
	if (!fs.existsSync(databasePath)) return null;
	const { openNodeSqliteDatabase, prepareSqliteReadOnlyLocationSync } = await import("./plugin-sdk/sqlite-runtime.js");
	let prepared;
	let db;
	let failure;
	let model = null;
	try {
		prepared = inspectionMode === "readiness" ? prepareSqliteReadOnlyLocationSync(databasePath) : void 0;
		db = openNodeSqliteDatabase(prepared?.location ?? databasePath, { readOnly: true });
		if (db.prepare("SELECT 1 AS ok FROM sqlite_master WHERE type = 'table' AND name = 'memory_index_meta'").get()) {
			const row = db.prepare("SELECT value FROM memory_index_meta WHERE key = ?").get(MEMORY_INDEX_META_KEY);
			const parsed = typeof row?.value === "string" ? JSON.parse(row.value) : null;
			const configuredModel = parsed && typeof parsed === "object" && typeof parsed.model === "string" ? parsed.model.trim() : "";
			model = configuredModel && configuredModel !== "fts-only" ? configuredModel : null;
		}
	} catch (error) {
		failure = error;
	} finally {
		try {
			db?.close();
		} catch (error) {
			failure ??= error;
		}
		if (prepared && !prepared.cleanup()) failure ??= /* @__PURE__ */ new Error("Temporary SQLite inspection snapshot cleanup did not complete.");
	}
	if (failure && inspectionMode === "readiness") throw failure instanceof Error ? failure : new Error("Memory index inspection failed.", { cause: failure });
	return failure ? null : model;
}
function resolveConfigPrefix(config, agentId) {
	if (config.agents?.entries?.[agentId]?.memory?.search) return `agents.entries.${agentId}.memory.search`;
	if (config.agents?.list?.find((entry) => entry.id === agentId)?.memory?.search) return `agents.list[].memory.search (agent id ${agentId})`;
	return "memory.search";
}
function hasConfiguredMemorySecretRef(config, agentId) {
	const apiKey = (config.agents?.entries?.[agentId] ?? config.agents?.list?.find((entry) => entry.id === agentId))?.memory?.search?.remote?.apiKey ?? config.memory?.search?.remote?.apiKey;
	return apiKey !== null && typeof apiKey === "object";
}
async function collectVectorProviderFindings(params, inspectProvider, options) {
	const findings = [];
	for (const agentId of listConfiguredAgentIds(params.config)) {
		const agentDatabasePath = path.join(params.stateDir, "agents", agentId, "agent", "openclaw-agent.sqlite");
		const model = await readExistingVectorModel(agentDatabasePath, options?.indexInspectionMode ?? "best-effort");
		if (!model) continue;
		if (options?.inspectConfiguredMemorySecretRefs !== true && hasConfiguredMemorySecretRef(params.config, agentId)) continue;
		const failure = await inspectProvider({
			config: params.config,
			agentId,
			env: params.env,
			agentDatabasePath
		});
		if (failure) findings.push({
			...failure,
			agentId,
			model,
			configPrefix: resolveConfigPrefix(params.config, agentId)
		});
	}
	return findings;
}
function formatFinding(finding) {
	return `Memory index for agent ${finding.agentId} uses vector model ${finding.model}, but embedding provider "${finding.provider}" cannot initialize (${finding.reason}). Set ${finding.configPrefix}.remote.apiKey (for example, to a SecretRef) or choose a working ${finding.configPrefix}.provider. Memory sync will abort rather than overwrite this semantic index with FTS-only data.`;
}
function createVectorIndexProviderDiagnostic(inspectProvider) {
	return {
		id: "memory-core-vector-index-provider-diagnostic",
		label: "Memory Core vector index provider readiness",
		async detectLegacyState(params) {
			const findings = await collectVectorProviderFindings(params, inspectProvider);
			return findings.length > 0 ? { preview: findings.map((finding) => `- ${formatFinding(finding)}`) } : null;
		},
		async migrateLegacyState(params) {
			return {
				changes: [],
				warnings: (await collectVectorProviderFindings(params, inspectProvider)).map(formatFinding)
			};
		}
	};
}
//#endregion
export { createVectorIndexProviderDiagnostic as n, collectVectorProviderFindings as t };
