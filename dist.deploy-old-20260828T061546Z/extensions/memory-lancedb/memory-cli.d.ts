import { b as OpenClawPluginApi } from "../../runtime-api-B8urSeFb.js";
import "../../api-DIu5kyNj.js";
import { a as MemoryConfig } from "../../config-Cd958lsI.js";
import { Embeddings } from "./embeddings.js";
import { a as MemoryQueryFilter, n as MemoryDB } from "../../lancedb-store-DPrHOUx9.js";
//#region extensions/memory-lancedb/memory-cli.d.ts
declare function parseMemoryCliFilter(rawValue: unknown): MemoryQueryFilter | undefined;
declare function registerMemoryCli(api: OpenClawPluginApi, db: MemoryDB, embeddings: Embeddings, resolveCliAgentId: (rawAgentId: unknown) => string, resolveConfig: () => MemoryConfig): void;
//#endregion
export { parseMemoryCliFilter, registerMemoryCli };