import { l as MigrationItem } from "../../types-BwmvzNiR.js";
//#region extensions/migrate-hermes/helpers.d.ts
declare function resolveHomePath(input: string): string;
declare function exists(filePath: string): Promise<boolean>;
declare function isDirectory(dirPath: string): Promise<boolean>;
declare function sanitizeName(name: string): string;
declare function readText(filePath: string | undefined): Promise<string | undefined>;
declare function parseEnv(content: string | undefined): Record<string, string>;
declare function parseHermesConfig(content: string | undefined): Record<string, unknown>;
declare function childRecord(root: Record<string, unknown> | undefined, key: string): Record<string, unknown>;
declare function readStringArray(value: unknown): string[];
declare function appendItem(item: MigrationItem): Promise<MigrationItem>;
//#endregion
export { appendItem, childRecord, exists, isDirectory, parseEnv, parseHermesConfig, readStringArray, readText, resolveHomePath, sanitizeName };