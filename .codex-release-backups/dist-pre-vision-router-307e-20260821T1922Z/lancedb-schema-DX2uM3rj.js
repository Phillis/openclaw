//#region extensions/memory-lancedb/lancedb-schema.ts
const MEMORY_TABLE_NAME = "memories";
const MEMORY_AGENT_ID_COLUMN = "agentId";
function quoteLanceSqlString(value) {
	return `'${value.replaceAll("'", "''")}'`;
}
function memoryAgentPredicate(agentId) {
	return `${MEMORY_AGENT_ID_COLUMN} = ${quoteLanceSqlString(agentId)}`;
}
function hasAgentScopeColumn(schema) {
	return schema.fields.some((field) => field.name === MEMORY_AGENT_ID_COLUMN);
}
function legacyMemorySchemaError() {
	return /* @__PURE__ */ new Error("memory-lancedb: the existing memory table predates per-agent isolation. Run \"openclaw doctor --fix\" to assign legacy rows to the default agent, then restart OpenClaw.");
}
//#endregion
export { memoryAgentPredicate as a, legacyMemorySchemaError as i, MEMORY_TABLE_NAME as n, quoteLanceSqlString as o, hasAgentScopeColumn as r, MEMORY_AGENT_ID_COLUMN as t };
