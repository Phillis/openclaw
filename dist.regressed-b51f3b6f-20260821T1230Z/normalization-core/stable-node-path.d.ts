//#region packages/normalization-core/src/stable-node-path.d.ts
/**
 * Returns stable Homebrew paths for a versioned Cellar Node executable.
 * Availability remains caller-owned so packages can reuse the path contract
 * without importing another package's filesystem/runtime layer.
 */
declare function stableHomebrewNodePathCandidates(nodePath: string): string[];
//#endregion
export { stableHomebrewNodePathCandidates };