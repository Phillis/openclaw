import { r as resolveEffectiveAgentSkillsLimits } from "./agent-filter-DTbxyJ2D.js";
import { n as filterPromptVisibleSkillEntries } from "./skill-index-CEvOAhOd.js";
import { r as resolveSkillKey } from "./frontmatter-BE0jYufM.js";
import { n as formatSkillsCompactForPrompt, r as formatSkillsForPromptCore, t as escapeSkillXml } from "./skill-contract-CcNjm_Kp.js";
import { a as isSkillSecretOwnerUnavailable, t as hasUnavailableSkillSecretOwners } from "./config-Dq2GoT57.js";
import { a as compactPromptSkills, i as resolveWorkspaceSkillPromptEntries } from "./workspace-skill-loader-DRvJ_h-x.js";
//#region src/skills/loading/workspace-skill-prompt.ts
const COMPACT_DESCRIPTION_MAX_CHARS = 220;
const COMPACT_DESCRIPTION_MIN_CHARS = 4;
const DEFAULT_MAX_SKILLS_IN_PROMPT = 150;
const DEFAULT_MAX_SKILLS_PROMPT_CHARS = 18e3;
function resolveSkillsPromptLimits(config, agentId) {
	const limits = config?.skills?.limits;
	const agentLimits = resolveEffectiveAgentSkillsLimits(config, agentId);
	return {
		maxSkillsInPrompt: limits?.maxSkillsInPrompt ?? DEFAULT_MAX_SKILLS_IN_PROMPT,
		maxSkillsPromptChars: agentLimits?.maxSkillsPromptChars ?? limits?.maxSkillsPromptChars ?? DEFAULT_MAX_SKILLS_PROMPT_CHARS
	};
}
function buildSkillsLimitNote(params) {
	if (params.truncated) {
		const compactDetails = params.format.kind === "compact" ? ` (compact format, ${params.format.descriptionMaxChars > 0 ? "descriptions shortened" : "descriptions omitted"})` : "";
		return `⚠️ Skills truncated: included ${params.included} of ${params.total}${compactDetails}. Run \`openclaw skills check\` to audit.`;
	}
	if (params.format.kind === "compact") return `⚠️ Skills catalog using compact format (${params.format.descriptionMaxChars > 0 ? "descriptions shortened" : "descriptions omitted"}). Run \`openclaw skills check\` to audit.`;
	return "";
}
function buildRenderedSkillsPrompt(params) {
	const truncated = params.skills.length < params.total;
	const limitNote = params.includeLimitNote === false ? "" : buildSkillsLimitNote({
		truncated,
		format: params.format,
		included: params.skills.length,
		total: params.total
	});
	const catalog = params.format.kind === "compact" ? formatSkillsCompactForPrompt(params.skills, { descriptionMaxChars: params.format.descriptionMaxChars }) : formatSkillsForPromptCore(params.skills);
	return [
		params.remoteNote,
		limitNote,
		catalog
	].filter(Boolean).join("\n");
}
function applySkillsPromptLimits(params) {
	const limits = resolveSkillsPromptLimits(params.config, params.agentId);
	const total = params.skills.length;
	const byCount = params.skills.slice(0, Math.max(0, limits.maxSkillsInPrompt));
	let skillsForPrompt = byCount;
	const renderWithinLimit = (skills, format, includeLimitNote = true) => {
		const remoteNotes = params.remoteNote ? [params.remoteNote, void 0] : [void 0];
		for (const remoteNote of remoteNotes) {
			const prompt = buildRenderedSkillsPrompt({
				remoteNote,
				skills,
				total,
				format,
				includeLimitNote
			});
			if (prompt.length <= limits.maxSkillsPromptChars) return prompt;
		}
	};
	const fitsFull = (skills, includeLimitNote = true) => renderWithinLimit(skills, { kind: "full" }, includeLimitNote) !== void 0;
	const fitsCompact = (skills, descriptionMaxChars, includeLimitNote = true) => renderWithinLimit(skills, {
		kind: "compact",
		descriptionMaxChars
	}, includeLimitNote) !== void 0;
	if (!fitsFull(skillsForPrompt)) {
		if (!fitsCompact(skillsForPrompt, 0)) {
			let lo = 0;
			let hi = skillsForPrompt.length;
			while (lo < hi) {
				const mid = Math.ceil((lo + hi) / 2);
				if (fitsCompact(skillsForPrompt.slice(0, mid), 0)) lo = mid;
				else hi = mid - 1;
			}
			skillsForPrompt = skillsForPrompt.slice(0, lo);
		}
		if (skillsForPrompt.length === 0 && byCount.length > 0) {
			const fullWithoutNotice = renderWithinLimit(byCount, { kind: "full" }, false);
			if (fullWithoutNotice !== void 0) return fullWithoutNotice;
			let lo = 0;
			let hi = byCount.length;
			while (lo < hi) {
				const mid = Math.ceil((lo + hi) / 2);
				if (fitsCompact(byCount.slice(0, mid), 0, false)) lo = mid;
				else hi = mid - 1;
			}
			if (lo > 0) skillsForPrompt = byCount.slice(0, lo);
		}
		const includeLimitNote = fitsCompact(skillsForPrompt, 0);
		let descriptionMaxChars = 0;
		if (skillsForPrompt.length > 0 && fitsCompact(skillsForPrompt, COMPACT_DESCRIPTION_MIN_CHARS, includeLimitNote)) {
			let lo = COMPACT_DESCRIPTION_MIN_CHARS;
			let hi = COMPACT_DESCRIPTION_MAX_CHARS;
			while (lo < hi) {
				const mid = Math.ceil((lo + hi) / 2);
				if (fitsCompact(skillsForPrompt, mid, includeLimitNote)) lo = mid;
				else hi = mid - 1;
			}
			descriptionMaxChars = lo;
		}
		return renderWithinLimit(skillsForPrompt, {
			kind: "compact",
			descriptionMaxChars
		}, includeLimitNote) ?? "";
	}
	return renderWithinLimit(skillsForPrompt, { kind: "full" }) ?? "";
}
function resolveWorkspaceSkillPromptState(workspaceDir, opts) {
	const { eligible, skillFilter } = resolveWorkspaceSkillPromptEntries(workspaceDir, opts);
	const promptEntries = filterPromptVisibleSkillEntries(eligible);
	const remoteNote = opts?.eligibility?.remote?.note?.trim();
	const resolvedSkills = promptEntries.map((entry) => entry.skill);
	return {
		eligible,
		prompt: applySkillsPromptLimits({
			skills: compactPromptSkills(resolvedSkills).toSorted((a, b) => a.name.localeCompare(b.name, "en")),
			config: opts?.config,
			agentId: opts?.agentId,
			remoteNote
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
		promptFormatVersion: 3
	};
}
function resolveSkillsPrompt(params) {
	const snapshotPrompt = params.skillsSnapshot?.prompt?.trim();
	if (params.skillsSnapshot && !snapshotPrompt) return "";
	const snapshotHasLegacySkillIdentity = params.skillsSnapshot?.skills.some((skill) => !skill.skillKey);
	if (snapshotPrompt) {
		if ((params.skillsSnapshot?.skills.some((skill) => isSkillSecretOwnerUnavailable(skill.skillKey ?? skill.name)) || snapshotHasLegacySkillIdentity && hasUnavailableSkillSecretOwners()) && params.skillsSnapshot?.promptFormatVersion !== 3) return "";
		if (snapshotHasLegacySkillIdentity && hasUnavailableSkillSecretOwners()) return "";
		const unavailableNames = new Set(params.skillsSnapshot?.skills.filter((skill) => skill.skillKey !== void 0 && isSkillSecretOwnerUnavailable(skill.skillKey)).map((skill) => escapeSkillXml(skill.name)));
		if (unavailableNames.size === 0) return snapshotPrompt;
		const catalogOpen = "<available_skills>";
		const catalogClose = "</available_skills>";
		const catalogStart = snapshotPrompt.indexOf(catalogOpen);
		const catalogEnd = snapshotPrompt.indexOf(catalogClose, catalogStart + 18);
		if (catalogStart < 0 || catalogEnd < 0 || snapshotPrompt.includes(catalogOpen, catalogStart + 18) || snapshotPrompt.includes(catalogClose, catalogEnd + 19)) return "";
		const bodyStart = catalogStart + 18;
		const catalogBody = snapshotPrompt.slice(bodyStart, catalogEnd);
		const blockPattern = /\n[ ]{2}<skill>\n[\s\S]*?\n[ ]{2}<\/skill>/g;
		let cursor = 0;
		let filteredBody = "";
		for (const match of catalogBody.matchAll(blockPattern)) {
			const gap = catalogBody.slice(cursor, match.index);
			const block = match[0];
			const name = /^[ ]{4}<name>(.*)<\/name>$/m.exec(block)?.[1];
			if (gap.trim() || !name) return "";
			filteredBody += gap;
			if (!unavailableNames.has(name)) filteredBody += block;
			cursor = (match.index ?? 0) + block.length;
		}
		const tail = catalogBody.slice(cursor);
		if (tail.trim()) return "";
		return `${snapshotPrompt.slice(0, bodyStart)}${filteredBody}${tail}${snapshotPrompt.slice(catalogEnd)}`.trim();
	}
	if (params.entries && params.entries.length > 0) {
		const prompt = buildSkillSnapshot(params.workspaceDir, {
			entries: params.entries,
			config: params.config,
			agentId: params.agentId,
			eligibility: params.eligibility
		}).prompt;
		return prompt.trim() ? prompt : "";
	}
	return "";
}
//#endregion
export { resolveSkillsPrompt as n, buildSkillSnapshot as t };
