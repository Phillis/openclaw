import "./agent-scope-DigoIwHb.js";
import { a as listAgentIds, f as resolveAgentWorkspaceDir } from "./agent-scope-config-CUBiGmG3.js";
import { An as executeSqliteQuerySync, Mn as getNodeSqliteKysely, d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction, jn as executeSqliteQueryTakeFirstSync } from "./openclaw-state-db-CeAO_dqo.js";
import { n as withOpenClawStateLease } from "./openclaw-state-lease-Bw2pQRks.js";
import { a as insideGitCheckout, d as runGit } from "./git-CsWoUZAt.js";
import { t as slugifyWorktreeTitle } from "./name-DmUK_jiX.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/projects/project-registry.ts
const ensuredDatabases = /* @__PURE__ */ new WeakSet();
const PROJECT_ID_MAX_LENGTH = 64;
const PROJECT_CHECKOUT_LEASE_MS = 3e4;
const PROJECT_CHECKOUT_WAIT_MS = 3e4;
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
function insertProjectRegistry(input, options, lease) {
	ensureProjectRegistrySchema(options);
	return runOpenClawStateWriteTransaction(({ db: sqlite }) => {
		lease.assertOwnedInTransaction(sqlite);
		const db = getNodeSqliteKysely(sqlite);
		const sameRoot = executeSqliteQueryTakeFirstSync(sqlite, db.selectFrom("projects").selectAll().where("repo_root", "=", input.repoRoot));
		if (sameRoot) return rowToProject(sameRoot);
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
async function withProjectCheckoutLifecycle(repoRoot, options, run) {
	return await withOpenClawStateLease({
		scope: "projects.checkout",
		key: repoRoot,
		database: {
			scope: "shared",
			options
		},
		leaseMs: PROJECT_CHECKOUT_LEASE_MS,
		waitMs: PROJECT_CHECKOUT_WAIT_MS,
		leaseLabel: "project checkout lease",
		operationLabel: "projects.checkout.lease"
	}, run);
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
async function resolveProjectDirectory(projectPath) {
	const requested = await fs.realpath(projectPath).catch(() => {
		throw new ProjectCheckoutError(`project path does not exist: ${projectPath}`);
	});
	if (!(await fs.stat(requested).catch(() => null))?.isDirectory()) throw new ProjectCheckoutError(`project path is not a directory: ${projectPath}`);
	return requested;
}
async function resolveProjectCheckout(projectPath) {
	const requested = await resolveProjectDirectory(projectPath);
	if (!insideGitCheckout(requested)) throw new ProjectCheckoutError(`project path is not a git checkout: ${projectPath}`);
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
async function registerResolvedProject(input, options = {}) {
	const checkout = await resolveProjectCheckout(input.path);
	const displayName = input.name?.trim() || path.basename(checkout.repoRoot) || "Project";
	return await withProjectCheckoutLifecycle(checkout.repoRoot, options, async (lease) => {
		if ((await resolveProjectCheckout(checkout.repoRoot)).repoRoot !== checkout.repoRoot) throw new ProjectCheckoutError(`project checkout changed while registering: ${input.path}`);
		return insertProjectRegistry({
			displayName,
			repoRoot: checkout.repoRoot,
			originUrl: input.originUrl ?? checkout.originUrl,
			source: input.source
		}, options, lease);
	});
}
async function registerProjectRegistry(input, options = {}) {
	return await registerResolvedProject({
		...input,
		source: "registered"
	}, options);
}
async function registerClonedProjectRegistry(input, options = {}) {
	return await registerResolvedProject({
		...input,
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
function removeProjectCheckoutReference(project, lease, options = {}) {
	ensureProjectRegistrySchema(options);
	return runOpenClawStateWriteTransaction(({ db: sqlite }) => {
		lease.assertOwnedInTransaction(sqlite);
		const db = getNodeSqliteKysely(sqlite);
		const current = executeSqliteQueryTakeFirstSync(sqlite, db.selectFrom("projects").selectAll().where("id", "=", project.id));
		if (!current) return "missing";
		if (current.source !== "cloned" || current.repo_root !== project.repoRoot) return "changed";
		executeSqliteQuerySync(sqlite, db.deleteFrom("projects").where("id", "=", project.id));
		const sibling = executeSqliteQueryTakeFirstSync(sqlite, db.selectFrom("projects").selectAll().where("repo_root", "=", project.repoRoot).orderBy("id", "asc"));
		if (!sibling) return "final";
		if (sibling.source === "registered") executeSqliteQuerySync(sqlite, db.updateTable("projects").set({
			source: "cloned",
			origin_url: sibling.origin_url ?? current.origin_url,
			updated_at_ms: Date.now()
		}).where("id", "=", sibling.id));
		return "remaining";
	}, options, { operationLabel: "projects.registry.checkout-reference.remove" });
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
export { removeProjectCheckoutReference as a, resolveProjectDirectory as c, withProjectCheckoutLifecycle as d, registerProjectRegistry as i, resolveProjectRegistry as l, listProjectRegistry as n, removeProjectRegistry as o, registerClonedProjectRegistry as r, resolveProjectCheckout as s, ProjectCheckoutError as t, resolveRecordedProjectRoot as u };
