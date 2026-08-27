import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { a as isPathInside } from "./path-D138yf8v.js";
import "./path-guards-fBZukd5S.js";
import { n as resolveSkillStatusEntry, t as buildWorkspaceSkillStatus } from "./status-BFrBUUAi.js";
import { r as tryRealpath } from "./symlink-targets-Cwce114b.js";
import { r as assertInsideWorkspace, u as readWorkspaceSkillFile } from "./workspace-skill-write-BmSx-_PN.js";
import path from "node:path";
//#region src/skills/workshop/workspace-skill-read.ts
const WRITABLE_WORKSPACE_SOURCES = /* @__PURE__ */ new Set(["openclaw-workspace", "agents-skills-project"]);
function assertWritableSkillTarget(workspaceDir, skill) {
	if (!WRITABLE_WORKSPACE_SOURCES.has(skill.source)) throw new Error(`Skill source is not writable by Skill Workshop: ${skill.source}`);
	assertInsideWorkspace(workspaceDir, skill.filePath, "skill file");
	assertInsideWorkspace(workspaceDir, skill.baseDir, "skill directory");
	if (path.basename(skill.filePath) !== "SKILL.md") throw new Error("Skill Workshop can only update SKILL.md targets.");
}
function isWorkspaceOwnedSkillTarget(workspaceDir, skill) {
	const workspaceRealPath = tryRealpath(path.resolve(workspaceDir));
	const skillRealPath = tryRealpath(path.resolve(skill.baseDir));
	return Boolean(workspaceRealPath && skillRealPath && isPathInside(workspaceRealPath, skillRealPath));
}
/**
* Lists the workspace skills the workshop can target with update proposals, using the same
* status discovery as `proposeUpdateSkill` so callers that route learnings to existing
* skills stay in lockstep with what an update can actually write.
*/
function listWritableWorkspaceSkillSummaries(workspaceDir, opts) {
	const status = buildWorkspaceSkillStatus(workspaceDir, {
		config: opts?.config,
		agentId: opts?.agentId
	});
	const summaries = [];
	for (const skill of status.skills) {
		if (!WRITABLE_WORKSPACE_SOURCES.has(skill.source)) continue;
		summaries.push(skill.description ? {
			name: skill.skillKey,
			description: skill.description,
			filePath: skill.filePath
		} : {
			name: skill.skillKey,
			filePath: skill.filePath
		});
	}
	return summaries;
}
/** Reads the live SKILL.md of a writable workspace skill, resolved like an update target. */
async function readWritableWorkspaceSkill(workspaceDir, skillName, opts) {
	const name = normalizeOptionalString(skillName);
	if (!name) throw new Error("Skill name is required.");
	const targetSkill = resolveSkillStatusEntry(buildWorkspaceSkillStatus(workspaceDir, {
		config: opts?.config,
		agentId: opts?.agentId
	}).skills, name);
	if (!targetSkill) throw new Error(`Skill not found: ${name}`);
	assertWritableSkillTarget(workspaceDir, targetSkill);
	const content = await readWorkspaceSkillFile(targetSkill.filePath);
	if (content === null) throw new Error(`Skill file is missing: ${targetSkill.filePath}`);
	return {
		skillKey: targetSkill.skillKey,
		skillFile: targetSkill.filePath,
		content
	};
}
//#endregion
export { readWritableWorkspaceSkill as i, isWorkspaceOwnedSkillTarget as n, listWritableWorkspaceSkillSummaries as r, assertWritableSkillTarget as t };
