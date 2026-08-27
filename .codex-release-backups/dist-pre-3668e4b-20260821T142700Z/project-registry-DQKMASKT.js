import "./agent-scope-D9GLFAyB.js";
import { a as listAgentIds, d as resolveAgentWorkspaceDir } from "./agent-scope-config-CsnnOL14.js";
import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-gKE3myqW.js";
import { d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BciZ4rHE.js";
import { i as insideGitCheckout, u as runGit } from "./git-DtO1o8gm.js";
import { l as slugifyWorktreeTitle } from "./service-BcZ9HgDx.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/projects/project-registry.ts
const ensuredDatabases = /* @__PURE__ */ new WeakSet();
const PROJECT_ID_MAX_LENGTH = 64;
const PROJECTS_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS projects (
  id TEXT NOT NULL PRIMARY KEY,
  display_name TEXT NOT NULL,
  repo_root TEXT NOT NULL,
  origin_url TEXT,
  source TEXT NOT NULL CHECK (source IN ('registered', 'cloned')),
  created_at_ms INT NOT NULL,
  updated_at_ms INT NOT NULL
) STRICT;
`;
var ProjectCheckoutError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "ProjectCheckoutError";
	}
};
function ensureProjectRegistrySchema(options = {}) {
	const database = openOpenClawStateDatabase(options);
	if (ensuredDatabases.has(database.db)) return;
	runOpenClawStateWriteTransaction(({ db }) => {
		db.exec(PROJECTS_SCHEMA_SQL);
	}, options, { operationLabel: "projects.registry.schema.ensure" });
	ensuredDatabases.add(database.db);
}
function openProjectsDatabase(options = {}) {
	ensureProjectRegistrySchema(options);
	const state = openOpenClawStateDatabase(options);
	return {
		sqlite: state.db,
		kysely: getNodeSqliteKysely(state.db)
	};
}
function rowToProject(row) {
	return {
		id: row.id,
		displayName: row.display_name,
		repoRoot: row.repo_root,
		...row.origin_url ? { originUrl: row.origin_url } : {},
		source: row.source
	};
}
function insertProjectRegistry(input, options) {
	ensureProjectRegistrySchema(options);
	return runOpenClawStateWriteTransaction(({ db: sqlite }) => {
		const db = getNodeSqliteKysely(sqlite);
		if (input.source === "cloned" && input.originUrl) {
			const duplicate = executeSqliteQueryTakeFirstSync(sqlite, db.selectFrom("projects").selectAll().where("origin_url", "=", input.originUrl));
			if (duplicate) return rowToProject(duplicate);
		}
		const existing = new Set(executeSqliteQuerySync(sqlite, db.selectFrom("projects").select("id")).rows.map((row) => row.id));
		const id = allocateProjectId(slugifyWorktreeTitle(input.displayName) ?? "project", existing);
		const now = Date.now();
		const row = {
			id,
			display_name: input.displayName,
			repo_root: input.repoRoot,
			origin_url: input.originUrl ?? null,
			source: input.source,
			created_at_ms: now,
			updated_at_ms: now
		};
		executeSqliteQuerySync(sqlite, db.insertInto("projects").values(row));
		return rowToProject(row);
	}, options, { operationLabel: "projects.registry.insert" });
}
function workspaceProject(cfg, agentId) {
	const repoRoot = resolveAgentWorkspaceDir(cfg, agentId);
	return {
		id: `workspace:${agentId}`,
		displayName: path.basename(repoRoot) || agentId,
		repoRoot,
		source: "workspace",
		agentId
	};
}
function compareProjects(left, right) {
	const leftName = left.displayName.toLowerCase();
	const rightName = right.displayName.toLowerCase();
	if (leftName !== rightName) return leftName < rightName ? -1 : 1;
	return left.id < right.id ? -1 : left.id > right.id ? 1 : 0;
}
function allocateProjectId(base, existing) {
	if (!existing.has(base)) return base;
	for (let suffixNumber = 2;; suffixNumber += 1) {
		const suffix = `-${suffixNumber}`;
		const candidate = `${base.slice(0, PROJECT_ID_MAX_LENGTH - suffix.length).replace(/-+$/u, "")}${suffix}`;
		if (!existing.has(candidate)) return candidate;
	}
}
async function resolveProjectCheckout(projectPath) {
	const requested = await fs.realpath(projectPath).catch(() => {
		throw new ProjectCheckoutError(`project path does not exist: ${projectPath}`);
	});
	if (!(await fs.stat(requested).catch(() => null))?.isDirectory() || !insideGitCheckout(requested)) throw new ProjectCheckoutError(`project path is not a git checkout: ${projectPath}`);
	const rootResult = await runGit(requested, ["rev-parse", "--show-toplevel"]);
	if (rootResult.code !== 0) throw new ProjectCheckoutError(`project path is not a git checkout: ${projectPath}`);
	const repoRoot = await fs.realpath(rootResult.stdout.trim()).catch(() => {
		throw new ProjectCheckoutError(`project checkout root is unavailable: ${projectPath}`);
	});
	if ((await runGit(repoRoot, [
		"rev-parse",
		"--verify",
		"HEAD^{commit}"
	])).code !== 0) throw new ProjectCheckoutError(`project checkout has no commits: ${projectPath}`);
	const originResult = await runGit(repoRoot, [
		"config",
		"--get",
		"remote.origin.url"
	]);
	const originUrl = originResult.code === 0 ? originResult.stdout.trim() : "";
	return {
		path: requested,
		repoRoot,
		...originUrl ? { originUrl } : {}
	};
}
async function registerProjectRegistry(input, options = {}) {
	const checkout = await resolveProjectCheckout(input.path);
	return insertProjectRegistry({
		displayName: input.name?.trim() || path.basename(checkout.repoRoot) || "Project",
		repoRoot: checkout.repoRoot,
		originUrl: checkout.originUrl,
		source: "registered"
	}, options);
}
async function registerClonedProjectRegistry(input, options = {}) {
	const checkout = await resolveProjectCheckout(input.path);
	return insertProjectRegistry({
		displayName: input.name,
		repoRoot: checkout.repoRoot,
		originUrl: input.originUrl,
		source: "cloned"
	}, options);
}
function listProjectRegistry(cfg, options = {}) {
	const { sqlite, kysely } = openProjectsDatabase(options);
	const stored = executeSqliteQuerySync(sqlite, kysely.selectFrom("projects").selectAll()).rows.map(rowToProject);
	return [...listAgentIds(cfg).map((agentId) => workspaceProject(cfg, agentId)), ...stored].toSorted(compareProjects);
}
function resolveProjectRegistry(cfg, id, options = {}) {
	if (id.startsWith("workspace:")) {
		const agentId = id.slice(10);
		return listAgentIds(cfg).includes(agentId) ? workspaceProject(cfg, agentId) : void 0;
	}
	const { sqlite, kysely } = openProjectsDatabase(options);
	const row = executeSqliteQueryTakeFirstSync(sqlite, kysely.selectFrom("projects").selectAll().where("id", "=", id));
	return row ? rowToProject(row) : void 0;
}
async function resolveRecordedProjectRoot(projectPath, options = {}) {
	const repoRoot = await fs.realpath(projectPath).catch(() => void 0);
	if (!repoRoot) return;
	const { sqlite, kysely } = openProjectsDatabase(options);
	return executeSqliteQueryTakeFirstSync(sqlite, kysely.selectFrom("projects").select("repo_root").where("repo_root", "=", repoRoot))?.repo_root;
}
function removeProjectRegistry(id, options = {}) {
	ensureProjectRegistrySchema(options);
	return runOpenClawStateWriteTransaction(({ db: sqlite }) => {
		return executeSqliteQuerySync(sqlite, getNodeSqliteKysely(sqlite).deleteFrom("projects").where("id", "=", id)).numAffectedRows === 1n;
	}, options, { operationLabel: "projects.registry.remove" });
}
//#endregion
export { removeProjectRegistry as a, resolveRecordedProjectRoot as c, registerProjectRegistry as i, listProjectRegistry as n, resolveProjectCheckout as o, registerClonedProjectRegistry as r, resolveProjectRegistry as s, ProjectCheckoutError as t };
