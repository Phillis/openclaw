import { o as CronStoreFile } from "./types-BKb7Omjs.js";
import { DatabaseSync } from "node:sqlite";
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
export { resolveCronStorePath as n, saveCronStore as r, loadCronStore as t };