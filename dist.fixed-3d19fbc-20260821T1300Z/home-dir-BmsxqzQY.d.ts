//#region src/infra/home-dir.d.ts
/** Resolves a user path against the effective home, preserving an empty input. */
declare function resolveUserPath(input: string, env?: NodeJS.ProcessEnv, homedir?: () => string): string;
//#endregion
export { resolveUserPath as t };