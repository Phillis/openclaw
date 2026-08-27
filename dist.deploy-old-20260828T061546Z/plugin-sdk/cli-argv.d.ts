//#region src/infra/cli-root-options.d.ts
/** CLI token that stops root option scanning and leaves following args positional. */
declare const FLAG_TERMINATOR = "--";
/** Returns whether a token can be consumed as a root option value. */
declare function isValueToken(arg: string | undefined): boolean;
/** Returns how many argv tokens a supported root option consumes at the given index. */
declare function consumeRootOptionToken(args: ReadonlyArray<string>, index: number): number;
/** Read positional command tokens while accepting root options at any pre-terminator position. */
declare function getRootOptionAwareCommandPath(argv: readonly string[], depth: number): string[];
//#endregion
export { FLAG_TERMINATOR, consumeRootOptionToken, getRootOptionAwareCommandPath, isValueToken };