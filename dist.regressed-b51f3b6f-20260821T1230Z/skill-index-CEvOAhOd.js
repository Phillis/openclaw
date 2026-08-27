import { r as resolveSkillKey } from "./frontmatter-BE0jYufM.js";
import { t as resolveSkillSource } from "./source-BBJAIIqh.js";
import { realpathSync } from "node:fs";
import { isAbsolute, relative, resolve, sep } from "node:path";
//#region src/agents/utils/paths.ts
/**
* Agent path formatting helpers.
*
* Canonicalizes local paths and formats paths relative to a workspace when possible.
*/
/**
* Resolve a path to its canonical (real) form, following symlinks.
* Falls back to the raw path if resolution fails (e.g. the target does
* not exist yet), so that callers never crash on missing filesystem
* entries.
*/
function canonicalizePath(path) {
	try {
		return realpathSync(path);
	} catch {
		return path;
	}
}
/**
* Returns true if the value is NOT a package source (npm:, git:, etc.)
* or a URL protocol. Bare names and relative paths without ./ prefix
* are considered local.
*/
function isLocalPath(value) {
	const trimmed = value.trim();
	if (trimmed.startsWith("npm:") || trimmed.startsWith("git:") || trimmed.startsWith("github:") || trimmed.startsWith("http:") || trimmed.startsWith("https:") || trimmed.startsWith("ssh:")) return false;
	return true;
}
function resolveAgainstCwd(filePath, cwd) {
	return isAbsolute(filePath) ? resolve(filePath) : resolve(cwd, filePath);
}
function getCwdRelativePath(filePath, cwd) {
	const resolvedCwd = resolve(cwd);
	const relativePath = relative(resolvedCwd, resolveAgainstCwd(filePath, resolvedCwd));
	return relativePath === "" || relativePath !== ".." && !relativePath.startsWith(`..${sep}`) && !isAbsolute(relativePath) ? relativePath || "." : void 0;
}
function formatPathRelativeToCwdOrAbsolute(filePath, cwd) {
	const absolutePath = resolveAgainstCwd(filePath, cwd);
	return (getCwdRelativePath(absolutePath, cwd) ?? absolutePath).split(sep).join("/");
}
//#endregion
//#region src/skills/discovery/skill-index.ts
/** Normalizes a skill name to the comparable key used by filters and commands. */
function normalizeSkillIndexName(value) {
	return value.trim().toLowerCase().replace(/[\s_/]+/g, "-").replace(/[^a-z0-9-]+/g, "").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
}
function isSkillRuntimeVisible(entry) {
	return entry.exposure?.includeInRuntimeRegistry ?? true;
}
function isSkillPromptVisible(entry) {
	if (entry.exposure) return entry.exposure.includeInAvailableSkillsPrompt ?? true;
	if (entry.invocation) return !entry.invocation.disableModelInvocation;
	return !entry.skill.disableModelInvocation;
}
function isSkillUserInvocable(entry) {
	if (entry.exposure) return entry.exposure.userInvocable ?? true;
	if (entry.invocation) return entry.invocation.userInvocable ?? true;
	return true;
}
function filterPromptVisibleSkillEntries(entries) {
	return entries.filter(isSkillPromptVisible);
}
function filterUserInvocableSkillEntries(entries) {
	return entries.filter(isSkillUserInvocable);
}
function buildSkillIndexEntries(entries, opts) {
	const agentSkillSet = opts?.agentSkillFilter === void 0 ? void 0 : new Set(opts.agentSkillFilter);
	return entries.map((entry) => createSkillIndexEntry(entry, opts, agentSkillSet));
}
function createSkillIndexEntry(entry, opts, agentSkillSet) {
	const name = entry.skill.name;
	const skillKey = resolveSkillKey(entry.skill, entry);
	const source = resolveSkillSource(entry.skill);
	return {
		entry,
		name,
		normalizedName: normalizeSkillIndexName(name),
		skillKey,
		normalizedSkillKey: normalizeSkillIndexName(skillKey),
		source,
		bundled: source === "openclaw-bundled" || source === "unknown" && opts?.bundledNames?.has(name) === true,
		agentAllowed: agentSkillSet === void 0 || agentSkillSet.has(name),
		runtimeVisible: isSkillRuntimeVisible(entry),
		promptVisible: isSkillPromptVisible(entry),
		userInvocable: isSkillUserInvocable(entry)
	};
}
//#endregion
export { normalizeSkillIndexName as a, isLocalPath as c, isSkillPromptVisible as i, filterPromptVisibleSkillEntries as n, canonicalizePath as o, filterUserInvocableSkillEntries as r, formatPathRelativeToCwdOrAbsolute as s, buildSkillIndexEntries as t };
