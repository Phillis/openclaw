//#region src/agents/worktrees/name.ts
const WORKTREE_NAME_MAX_LENGTH = 64;
const WORKTREE_ALLOCATION_FAMILY_LENGTH = 59;
/** Converts a short human-readable title into a valid managed-worktree name. */
function slugifyWorktreeTitle(title) {
	const slug = title.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
	if (slug.length <= WORKTREE_NAME_MAX_LENGTH) return slug || void 0;
	const truncated = slug.slice(0, WORKTREE_NAME_MAX_LENGTH);
	const wordBoundary = truncated.lastIndexOf("-");
	return wordBoundary > 0 ? truncated.slice(0, wordBoundary) : truncated;
}
/** Maps names that can converge after a `-1000` suffix into one allocation lane. */
function worktreeNameAllocationFamily(name) {
	let base = name;
	while (/-\d+$/.test(base)) base = base.replace(/-\d+$/, "");
	return (base || name).slice(0, WORKTREE_ALLOCATION_FAMILY_LENGTH).replace(/-+$/g, "");
}
//#endregion
export { worktreeNameAllocationFamily as n, slugifyWorktreeTitle as t };
