import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { a as isPathInside } from "./path-D138yf8v.js";
import "./path-guards-CQoZeoCG.js";
import { Nn as getNodeSqliteKysely, h as runOpenClawStateWriteTransaction, jn as executeSqliteQuerySync } from "./openclaw-state-db-kmBThqu6.js";
import { i as logWarn } from "./logger-D4iLuGk3.js";
import { r as tryRealpath } from "./symlink-targets-BsV9JHNo.js";
import { A as readWorkspaceSkillFile, C as assertInsideWorkspace, c as openSkillWorkshopStore, o as databaseOptions, r as parseSkillProposalRow, s as ensureSkillWorkshopSchema } from "./store-sqlite-record-B1DXrdfq.js";
import { n as resolveSkillStatusEntry, t as buildWorkspaceSkillStatus } from "./status-C77NfbH4.js";
import path from "node:path";
//#region src/skills/workshop/ownership.ts
function setWorkshopOwnershipClaimRelease(database, workspaceDir, skillDirs, releaseTime) {
	const targetDirs = new Set(skillDirs.map((skillDir) => path.resolve(skillDir)));
	if (targetDirs.size === 0) return;
	const kysely = getNodeSqliteKysely(database);
	const proposalIds = executeSqliteQuerySync(database, kysely.selectFrom("skill_workshop_proposals").selectAll().where("workspace_dir", "=", path.resolve(workspaceDir)).where("kind", "=", "create").where("status", "=", "applied")).rows.flatMap((row) => {
		const record = parseSkillProposalRow(row);
		return record && targetDirs.has(path.resolve(record.target.skillDir)) ? [record.id] : [];
	});
	if (proposalIds.length === 0) return;
	executeSqliteQuerySync(database, kysely.updateTable("skill_workshop_proposals").set({ claim_released_time: releaseTime }).where("proposal_id", "in", proposalIds));
}
function writeWorkshopOwnershipClaims(workspaceDir, claimedSkillDirs, releasedSkillDirs, releaseTime, options) {
	const claimedDirs = new Set(claimedSkillDirs.map((skillDir) => path.resolve(skillDir)));
	const releasedDirs = releasedSkillDirs.filter((skillDir) => !claimedDirs.has(path.resolve(skillDir)));
	if (claimedDirs.size === 0 && releasedDirs.length === 0) return;
	ensureSkillWorkshopSchema(options);
	runOpenClawStateWriteTransaction(({ db }) => {
		setWorkshopOwnershipClaimRelease(db, workspaceDir, releasedDirs, releaseTime);
		setWorkshopOwnershipClaimRelease(db, workspaceDir, [...claimedDirs], null);
	}, databaseOptions(options));
}
function releaseWorkshopOwnershipClaims(workspaceDir, skillDirs, releaseTime, options = {}) {
	writeWorkshopOwnershipClaims(workspaceDir, [], skillDirs, releaseTime, options);
}
function restoreWorkshopOwnershipClaims(workspaceDir, skillDirs, resultSkillDirs, releaseTime, options = {}) {
	writeWorkshopOwnershipClaims(workspaceDir, skillDirs, resultSkillDirs, releaseTime, options);
}
function restoreWorkshopOwnershipClaimsBestEffort(workspaceDir, skillDirs, options = {}) {
	try {
		writeWorkshopOwnershipClaims(workspaceDir, skillDirs, [], 0, options);
	} catch (error) {
		logWarn(`skill-workshop: failed to reclaim ownership after rollback: ${String(error)}`);
	}
}
/** Paths claimed by a successfully applied Workshop create proposal. */
function listWorkshopOwnedSkillDirs(workspaceDir, options = {}) {
	const { database, kysely } = openSkillWorkshopStore(options);
	const rows = executeSqliteQuerySync(database.db, kysely.selectFrom("skill_workshop_proposals").selectAll().where("workspace_dir", "=", path.resolve(workspaceDir)).where("kind", "=", "create").where("status", "=", "applied").where("claim_released_time", "is", null)).rows;
	return new Set(rows.flatMap((row) => {
		const record = parseSkillProposalRow(row);
		return record ? [path.resolve(record.target.skillDir)] : [];
	}));
}
function isWorkshopOwnedSkillDir(workspaceDir, skillDir, options = {}) {
	return listWorkshopOwnedSkillDirs(workspaceDir, options).has(path.resolve(skillDir));
}
//#endregion
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
	const ownedDirs = listWorkshopOwnedSkillDirs(workspaceDir, opts?.env ? { env: opts.env } : {});
	const summaries = [];
	for (const skill of status.skills) {
		if (!WRITABLE_WORKSPACE_SOURCES.has(skill.source)) continue;
		const userAuthored = !ownedDirs.has(path.resolve(skill.baseDir));
		summaries.push(skill.description ? {
			name: skill.skillKey,
			description: skill.description,
			filePath: skill.filePath,
			userAuthored
		} : {
			name: skill.skillKey,
			filePath: skill.filePath,
			userAuthored
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
export { isWorkshopOwnedSkillDir as a, restoreWorkshopOwnershipClaims as c, readWritableWorkspaceSkill as i, restoreWorkshopOwnershipClaimsBestEffort as l, isWorkspaceOwnedSkillTarget as n, listWorkshopOwnedSkillDirs as o, listWritableWorkspaceSkillSummaries as r, releaseWorkshopOwnershipClaims as s, assertWritableSkillTarget as t };
