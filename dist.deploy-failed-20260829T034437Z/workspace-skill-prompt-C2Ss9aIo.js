import { r as resolveEffectiveAgentSkillsLimits } from "./agent-filter-BQrGxhsA.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { t as escapeSkillXml } from "./skill-contract-6Z2EHE_Q.js";
import { r as resolveSkillKey } from "./frontmatter-BUnBwW_N.js";
import { t as formatSkillsForPromptBounded } from "./skill-prompt-limits-CDRegxQK.js";
import { n as filterPromptVisibleSkillEntries } from "./skill-index-kr-4jQSx.js";
import { a as isSkillSecretOwnerUnavailable, t as hasUnavailableSkillSecretOwners } from "./config-axwakNc8.js";
import { o as resolveWorkspaceSkillPromptEntries, s as compactPromptSkills } from "./workspace-skill-loader-BIyN38wj.js";
//#region src/skills/loading/workspace-skill-prompt.ts
const skillsLogger = createSubsystemLogger("skills");
function resolveWorkspaceSkillPromptState(workspaceDir, opts) {
	const { eligible, skillFilter } = resolveWorkspaceSkillPromptEntries(workspaceDir, opts);
	const promptEntries = filterPromptVisibleSkillEntries(eligible);
	const remoteNote = opts?.eligibility?.remote?.note?.trim();
	const resolvedSkills = promptEntries.map((entry) => entry.skill);
	const limits = opts?.config?.skills?.limits;
	const agentLimits = resolveEffectiveAgentSkillsLimits(opts?.config, opts?.agentId);
	return {
		eligible,
		prompt: formatSkillsForPromptBounded({
			skills: compactPromptSkills(resolvedSkills),
			maxSkillsInPrompt: limits?.maxSkillsInPrompt,
			maxSkillsPromptChars: agentLimits?.maxSkillsPromptChars ?? limits?.maxSkillsPromptChars,
			remoteNote,
			preserveOrder: opts?.preserveEntryOrder
		}),
		resolvedSkills,
		skillFilter
	};
}
function buildSkillSnapshot(workspaceDir, opts) {
	const { eligible, prompt, resolvedSkills, skillFilter } = resolveWorkspaceSkillPromptState(workspaceDir, opts);
	return {
		prompt,
		skills: eligible.map((entry) => ({
			name: entry.skill.name,
			skillKey: resolveSkillKey(entry.skill, entry),
			primaryEnv: entry.metadata?.primaryEnv,
			requiredEnv: entry.metadata?.requires?.env?.slice()
		})),
		...skillFilter === void 0 ? {} : { skillFilter },
		...opts?.skillOverrides ? { skillOverrides: opts.skillOverrides } : {},
		...opts?.eligibility?.nodeSkills ? { nodeSkillsEligibility: opts.eligibility.nodeSkills } : {},
		resolvedSkills,
		version: opts?.snapshotVersion,
		promptFormatVersion: 4
	};
}
function buildSkillsPromptFromEntries(params, entries) {
	if (!entries || entries.length === 0) return "";
	const prompt = buildSkillSnapshot(params.workspaceDir, {
		entries,
		config: params.config,
		agentId: params.agentId,
		eligibility: params.eligibility,
		preserveEntryOrder: params.preserveEntryOrder
	}).prompt;
	return prompt.trim() ? prompt : "";
}
function rebuildAfterUnsafeSnapshot(params, reason) {
	skillsLogger.warn("Cached skills prompt could not be safely filtered; rebuilding from current skill entries.", { reason });
	const entries = (params.entries ?? params.loadEntries?.())?.filter((entry) => !isSkillSecretOwnerUnavailable(resolveSkillKey(entry.skill, entry)));
	return buildSkillsPromptFromEntries(params, entries);
}
function resolveSkillsPrompt(params) {
	const snapshotPrompt = params.skillsSnapshot?.prompt?.trim();
	if (params.skillsSnapshot && !snapshotPrompt) return "";
	const snapshotHasLegacySkillIdentity = params.skillsSnapshot?.skills.some((skill) => !skill.skillKey);
	if (snapshotPrompt) {
		if ((params.skillsSnapshot?.skills.some((skill) => isSkillSecretOwnerUnavailable(skill.skillKey ?? skill.name)) || snapshotHasLegacySkillIdentity && hasUnavailableSkillSecretOwners()) && params.skillsSnapshot?.promptFormatVersion !== 4) return rebuildAfterUnsafeSnapshot(params, "unsupported-prompt-format");
		if (snapshotHasLegacySkillIdentity && hasUnavailableSkillSecretOwners()) return rebuildAfterUnsafeSnapshot(params, "legacy-skill-identity");
		const unavailableNames = new Set(params.skillsSnapshot?.skills.filter((skill) => skill.skillKey !== void 0 && isSkillSecretOwnerUnavailable(skill.skillKey)).map((skill) => escapeSkillXml(skill.name)));
		if (unavailableNames.size === 0) return snapshotPrompt;
		const catalogOpen = "<available_skills>";
		const catalogClose = "</available_skills>";
		const catalogStart = snapshotPrompt.indexOf(catalogOpen);
		const catalogEnd = snapshotPrompt.indexOf(catalogClose, catalogStart + 18);
		if (catalogStart < 0 || catalogEnd < 0 || snapshotPrompt.includes(catalogOpen, catalogStart + 18) || snapshotPrompt.includes(catalogClose, catalogEnd + 19)) return rebuildAfterUnsafeSnapshot(params, "invalid-catalog-structure");
		const bodyStart = catalogStart + 18;
		const catalogBody = snapshotPrompt.slice(bodyStart, catalogEnd);
		const blockPattern = /\n[ ]{2}<skill>\n[\s\S]*?\n[ ]{2}<\/skill>/g;
		let cursor = 0;
		let filteredBody = "";
		for (const match of catalogBody.matchAll(blockPattern)) {
			const gap = catalogBody.slice(cursor, match.index);
			const block = match[0];
			const name = /^[ ]{4}<name>(.*)<\/name>$/m.exec(block)?.[1];
			if (gap.trim() || !name) return rebuildAfterUnsafeSnapshot(params, "invalid-catalog-structure");
			filteredBody += gap;
			if (!unavailableNames.has(name)) filteredBody += block;
			cursor = (match.index ?? 0) + block.length;
		}
		const tail = catalogBody.slice(cursor);
		if (tail.trim()) return rebuildAfterUnsafeSnapshot(params, "invalid-catalog-structure");
		return `${snapshotPrompt.slice(0, bodyStart)}${filteredBody}${tail}${snapshotPrompt.slice(catalogEnd)}`.trim();
	}
	return buildSkillsPromptFromEntries(params, params.entries);
}
//#endregion
export { resolveSkillsPrompt as n, buildSkillSnapshot as t };
