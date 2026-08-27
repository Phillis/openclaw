import { T as ProviderToolSchemaDiagnostic, lt as AnyAgentTool, w as ProviderNormalizeToolSchemasContext } from "../../runtime-api-B8urSeFb.js";
//#region extensions/clawrouter/tool-schemas.d.ts
declare function normalizePerplexityToolSchemas(ctx: ProviderNormalizeToolSchemasContext): AnyAgentTool[];
declare function inspectPerplexityToolSchemas(ctx: ProviderNormalizeToolSchemasContext): ProviderToolSchemaDiagnostic[];
//#endregion
export { inspectPerplexityToolSchemas, normalizePerplexityToolSchemas };