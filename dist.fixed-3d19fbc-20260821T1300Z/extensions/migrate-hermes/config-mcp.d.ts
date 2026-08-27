import { l as MigrationItem } from "../../types-BwmvzNiR.js";
//#region extensions/migrate-hermes/config-mcp.d.ts
declare function importsMcpSensitiveValues(value: Record<string, unknown>, includeSecrets: boolean): boolean;
declare function mapMcpServer(value: Record<string, unknown>, includeSecrets: boolean, env: Record<string, string>): Record<string, unknown>;
declare function mcpManualItems(params: {
  name: string;
  raw: Record<string, unknown>;
  includeSecrets: boolean;
  env: Record<string, string>;
  source: string;
}): MigrationItem[];
//#endregion
export { importsMcpSensitiveValues, mapMcpServer, mcpManualItems };