//#region src/version.d.ts
type RuntimeVersionEnv = {
  [key: string]: string | undefined;
};
declare function resolveRuntimeServiceVersion(env?: RuntimeVersionEnv, fallback?: string): string;
declare const VERSION: string;
//#endregion
export { VERSION as n, resolveRuntimeServiceVersion as r, RuntimeVersionEnv as t };