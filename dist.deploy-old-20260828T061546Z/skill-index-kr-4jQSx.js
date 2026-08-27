import { r as resolveSkillKey } from "./frontmatter-BUnBwW_N.js";
import { t as resolveSkillSource } from "./source-0ivX3dtK.js";
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
		bundled: source === "openclaw-bundled" || source === "openclaw-custodian" || source === "unknown" && opts?.bundledNames?.has(name) === true,
		agentAllowed: agentSkillSet === void 0 || agentSkillSet.has(name),
		runtimeVisible: isSkillRuntimeVisible(entry),
		promptVisible: isSkillPromptVisible(entry),
		userInvocable: isSkillUserInvocable(entry)
	};
}
//#endregion
export { normalizeSkillIndexName as a, isSkillPromptVisible as i, filterPromptVisibleSkillEntries as n, filterUserInvocableSkillEntries as r, buildSkillIndexEntries as t };
