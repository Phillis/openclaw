import { I as ProviderToolSchemaDiagnostic, N as ProviderNormalizeToolSchemasContext, Q as AnyAgentTool } from "../../types-DYqBZyXL.js";
//#region extensions/clawrouter/tool-schemas.d.ts
declare function normalizePerplexityToolSchemas(ctx: ProviderNormalizeToolSchemasContext): AnyAgentTool[];
declare function inspectPerplexityToolSchemas(ctx: ProviderNormalizeToolSchemasContext): ProviderToolSchemaDiagnostic[];
//#endregion
export { inspectPerplexityToolSchemas, normalizePerplexityToolSchemas };