//#region extensions/memory-lancedb/lancedb-schema.d.ts
declare const MEMORY_TABLE_NAME = "memories";
declare const MEMORY_AGENT_ID_COLUMN = "agentId";
declare function quoteLanceSqlString(value: string): string;
declare function memoryAgentPredicate(agentId: string): string;
declare function hasAgentScopeColumn(schema: {
  fields: Array<{
    name: string;
  }>;
}): boolean;
declare function legacyMemorySchemaError(): Error;
//#endregion
export { MEMORY_AGENT_ID_COLUMN, MEMORY_TABLE_NAME, hasAgentScopeColumn, legacyMemorySchemaError, memoryAgentPredicate, quoteLanceSqlString };