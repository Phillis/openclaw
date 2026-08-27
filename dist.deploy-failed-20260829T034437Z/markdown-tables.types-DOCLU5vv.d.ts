import { r as OpenClawConfig } from "./types.openclaw-Cjm06lg9.js";
import { S as MarkdownTableMode } from "./types.base-nhGY37Gp.js";
import "./openclaw-state-db.generated-CIYJwO5s.js";
import { o as CronStoreFile } from "./types-D6y8aRnD.js";
import { DatabaseSync } from "node:sqlite";
import "kysely";
//#region src/cron/store.d.ts
type SaveCronStoreOptions = {
  stateOnly?: boolean;
};
/** Resolves the public plugin-SDK cron store path. */
declare function resolveCronStorePath(storePath?: string): string;
/** Plugin-SDK alias for loading the cron store. */
declare function loadCronStore(storePath: string): Promise<CronStoreFile>;
/** Plugin-SDK alias for saving the cron store. */
declare function saveCronStore(storePath: string, store: CronStoreFile, opts?: SaveCronStoreOptions): Promise<void>;
//#endregion
//#region src/config/markdown-tables.types.d.ts
/** Parameters for resolving markdown table rendering per config and channel. */
type ResolveMarkdownTableModeParams = {
  cfg?: Partial<OpenClawConfig>;
  channel?: string | null;
  accountId?: string | null;
  supportsBlockTables?: boolean;
};
type ResolveMarkdownTableMode = (params: ResolveMarkdownTableModeParams) => MarkdownTableMode;
//#endregion
export { saveCronStore as a, resolveCronStorePath as i, ResolveMarkdownTableModeParams as n, loadCronStore as r, ResolveMarkdownTableMode as t };