import { m as readNonBlankString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
//#region src/gateway/github-remote.ts
/** Parse a GitHub remote in HTTPS, SSH URL, or scp-like form. */
function parseGitHubRemoteUrl(raw) {
	const trimmed = raw.trim();
	let path;
	const scpMatch = /^git@github\.com:(.+)$/i.exec(trimmed);
	if (scpMatch) path = scpMatch[1];
	else try {
		const url = new URL(trimmed);
		if (!(url.protocol === "https:" || url.protocol === "http:" || url.protocol === "ssh:") || url.hostname.toLowerCase() !== "github.com") return null;
		path = url.pathname;
	} catch {
		return null;
	}
	const segments = (path ?? "").split("/").filter(Boolean);
	const owner = segments[0];
	const repo = segments[1]?.replace(/\.git$/i, "");
	if (segments.length !== 2 || !owner || !repo) return null;
	return {
		owner,
		repo
	};
}
//#endregion
//#region src/gateway/github-repository-target.ts
function resolveGitHubForkParent(value) {
	if (!isRecord(value) || value.fork !== true || !isRecord(value.parent)) return;
	const owner = readNonBlankString((isRecord(value.parent.owner) ? value.parent.owner : void 0)?.login)?.trim();
	const repo = readNonBlankString(value.parent.name)?.trim();
	return owner && repo ? {
		owner,
		repo
	} : void 0;
}
/** Projects GitHub's repository response into the canonical push/head/base relationship. */
function resolveGitHubRepositoryTarget(value, push) {
	if (!isRecord(value)) return;
	const defaultBranch = readNonBlankString(value.default_branch)?.trim();
	if (value.fork !== true) return defaultBranch ? {
		fork: false,
		push,
		pullRequest: {
			...push,
			defaultBranch
		}
	} : void 0;
	const parent = resolveGitHubForkParent(value);
	const parentDefaultBranch = readNonBlankString((isRecord(value.parent) ? value.parent : void 0)?.default_branch)?.trim();
	return parent && parentDefaultBranch ? {
		fork: true,
		push,
		pullRequest: {
			...parent,
			defaultBranch: parentDefaultBranch
		}
	} : void 0;
}
//#endregion
export { resolveGitHubRepositoryTarget as n, parseGitHubRemoteUrl as r, resolveGitHubForkParent as t };
