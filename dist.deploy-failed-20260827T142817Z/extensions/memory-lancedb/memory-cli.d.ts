import { r as OpenClawPluginApi } from "../../types-7E39v2Gx.js";
import { Embeddings } from "./embeddings.js";
import { a as MemoryQueryFilter, n as MemoryDB } from "../../lancedb-store-DetOLK1n.js";

//#region extensions/memory-lancedb/memory-cli.d.ts
declare function parseMemoryCliFilter(rawValue: unknown): MemoryQueryFilter | undefined;
declare function registerMemoryCli(api: OpenClawPluginApi, db: MemoryDB, embeddings: Embeddings, resolveCliAgentId: (rawAgentId: unknown) => string, recallMaxChars: number | undefined): void;
//#endregion
export { parseMemoryCliFilter, registerMemoryCli };