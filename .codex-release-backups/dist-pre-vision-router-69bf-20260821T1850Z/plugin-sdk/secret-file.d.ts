import { c as createSecretFileAtomic, l as readSecretFileSync, r as tryReadSecretFileSync, s as SecretFileReadOptions } from "../secret-file-1u4T0pEh.js";

//#region ../../../../../../openclaw/node_modules/@openclaw/fs-safe/dist/secret-read-async.d.ts
declare function readSecretFile(filePath: string, label: string, options?: SecretFileReadOptions): Promise<string>;
//#endregion
export { type SecretFileReadOptions, createSecretFileAtomic, readSecretFile, readSecretFileSync, tryReadSecretFileSync };