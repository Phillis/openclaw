import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
//#region src/agents/sessions/source-info.ts
/** Converts package-manager path metadata into the session source-info shape. */
function createSourceInfo(path, metadata) {
	return {
		path,
		source: metadata.source,
		scope: metadata.scope,
		origin: metadata.origin,
		baseDir: metadata.baseDir
	};
}
/** Builds source metadata for generated or synthetic session entries. */
function createSyntheticSourceInfo(path, options) {
	return {
		path,
		source: options.source,
		scope: options.scope ?? "temporary",
		origin: options.origin ?? "top-level",
		baseDir: options.baseDir
	};
}
//#endregion
//#region src/skills/loading/skill-contract.ts
function escapeSkillXml(str) {
	return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
const SKILL_FRONTMATTER_BLOCK = /^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u;
const SKILL_TITLE_HEADING = /^#\s+(.+?)\s*#*\s*$/mu;
function humanizeSkillIdentifier(value) {
	return value.trim().split(/[-_]+/u).filter(Boolean).map((word) => `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`).join(" ");
}
function resolveSkillDisplayName(content, fallbackName) {
	return content.replace(SKILL_FRONTMATTER_BLOCK, "").match(SKILL_TITLE_HEADING)?.[1]?.trim() || humanizeSkillIdentifier(fallbackName) || fallbackName;
}
function truncateSkillDescription(description, maxChars) {
	const normalized = description.replace(/\s+/g, " ").trim();
	if (normalized.length <= maxChars) return normalized;
	if (maxChars <= 3) return truncateUtf16Safe(normalized, maxChars);
	return `${truncateUtf16Safe(normalized, maxChars - 3).trimEnd()}...`;
}
/**
* Keep this formatter's XML layout byte-for-byte aligned with the upstream
* Agent Skills formatter so we can avoid importing the full session runtime
* package root on the cold skills path. Visibility policy is applied upstream
* before calling this helper.
*/
function formatSkillsForPromptCore(skills) {
	if (skills.length === 0) return "";
	const lines = [
		"\n\nThe following skills provide specialized instructions for specific tasks.",
		"Use the read tool to load a skill's file when the task matches its description.",
		"When a skill file references a relative path, resolve it against the skill directory (parent of SKILL.md / dirname of the path) and use that absolute path in tool commands.",
		"",
		"<available_skills>"
	];
	for (const skill of skills) {
		lines.push("  <skill>");
		lines.push(`    <name>${escapeSkillXml(skill.name)}</name>`);
		lines.push(`    <description>${escapeSkillXml(skill.description)}</description>`);
		lines.push(`    <location>${escapeSkillXml(skill.filePath)}</location>`);
		if (skill.locationNote) lines.push(`    <location_note>${escapeSkillXml(skill.locationNote)}</location_note>`);
		lines.push("  </skill>");
	}
	lines.push("</available_skills>");
	return lines.join("\n");
}
/** Compact prompt catalog with descriptions bounded independently from identities. */
function formatSkillsCompactForPrompt(skills, opts) {
	if (skills.length === 0) return "";
	const descriptionMaxChars = Math.max(0, Math.floor(opts?.descriptionMaxChars ?? 220));
	const lines = [
		"\n\nThe following skills provide specialized instructions for specific tasks.",
		descriptionMaxChars > 0 ? "Use the read tool to load a skill's file when the task matches its name or description." : "Use the read tool to load a skill's file when the task matches its name.",
		"When a skill file references a relative path, resolve it against the skill directory (parent of SKILL.md / dirname of the path) and use that absolute path in tool commands.",
		"",
		"<available_skills>"
	];
	for (const skill of skills) {
		lines.push("  <skill>");
		lines.push(`    <name>${escapeSkillXml(skill.name)}</name>`);
		if (descriptionMaxChars > 0) {
			const description = truncateSkillDescription(skill.description, descriptionMaxChars);
			if (description) lines.push(`    <description>${escapeSkillXml(description)}</description>`);
		}
		lines.push(`    <location>${escapeSkillXml(skill.filePath)}</location>`);
		if (skill.locationNote) lines.push(`    <location_note>${escapeSkillXml(skill.locationNote)}</location_note>`);
		lines.push("  </skill>");
	}
	lines.push("</available_skills>");
	return lines.join("\n");
}
//#endregion
export { createSourceInfo as a, resolveSkillDisplayName as i, formatSkillsCompactForPrompt as n, createSyntheticSourceInfo as o, formatSkillsForPromptCore as r, escapeSkillXml as t };
