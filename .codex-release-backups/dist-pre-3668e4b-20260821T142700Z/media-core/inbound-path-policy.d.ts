//#region packages/media-core/src/inbound-path-policy.d.ts
type InboundPathRootMatch = {
  anchorRoot: string;
  matchedRoot: string;
};
/** Validates an absolute inbound root pattern with whole-segment wildcards only. */
declare function isValidInboundPathRootPattern(value: string): boolean;
/** Normalizes configured inbound attachment roots, dropping invalid or duplicate patterns. */
declare function normalizeInboundPathRoots(roots?: readonly string[]): string[];
/** Merges inbound attachment root lists while preserving first-seen priority. */
declare function mergeInboundPathRoots(...rootsLists: Array<readonly string[] | undefined>): string[];
/** Resolves the concrete lexical root matched by an inbound path pattern. */
declare function resolveInboundPathRoot(params: {
  filePath: string;
  roots: readonly string[];
  fallbackRoots?: readonly string[];
}): InboundPathRootMatch | undefined;
/** Checks whether a candidate inbound media path is covered by configured or fallback roots. */
declare function isInboundPathAllowed(params: {
  filePath: string;
  roots: readonly string[];
  fallbackRoots?: readonly string[];
}): boolean;
//#endregion
export { InboundPathRootMatch, isInboundPathAllowed, isValidInboundPathRootPattern, mergeInboundPathRoots, normalizeInboundPathRoots, resolveInboundPathRoot };