import { n as formatSkillsCompactForPrompt, r as formatSkillsForPromptCore } from "./skill-contract-6Z2EHE_Q.js";
//#region src/skills/loading/skill-prompt-limits.ts
const COMPACT_DESCRIPTION_MIN_CHARS = 4;
const DEFAULT_MAX_SKILLS_IN_PROMPT = 150;
const DEFAULT_MAX_SKILLS_PROMPT_CHARS = 18e3;
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
/** Render a deterministic skills catalog within the shared model-context budget. */
function formatSkillsForPromptBounded(params) {
	const maxSkillsInPrompt = params.maxSkillsInPrompt ?? DEFAULT_MAX_SKILLS_IN_PROMPT;
	const maxSkillsPromptChars = params.maxSkillsPromptChars ?? DEFAULT_MAX_SKILLS_PROMPT_CHARS;
	const orderedSkills = params.preserveOrder ? params.skills : params.skills.toSorted((a, b) => a.name.localeCompare(b.name, "en"));
	const total = orderedSkills.length;
	const byCount = orderedSkills.slice(0, Math.max(0, maxSkillsInPrompt));
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
			if (prompt.length <= maxSkillsPromptChars) return prompt;
		}
	};
	const fitsFull = (skills, includeLimitNote = true) => renderWithinLimit(skills, { kind: "full" }, includeLimitNote) !== void 0;
	const fitsCompact = (skills, descriptionMaxChars, includeLimitNote = true) => renderWithinLimit(skills, {
		kind: "compact",
		descriptionMaxChars
	}, includeLimitNote) !== void 0;
	if (fitsFull(skillsForPrompt)) return renderWithinLimit(skillsForPrompt, { kind: "full" }) ?? "";
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
		let hi = 220;
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
//#endregion
export { formatSkillsForPromptBounded as t };
