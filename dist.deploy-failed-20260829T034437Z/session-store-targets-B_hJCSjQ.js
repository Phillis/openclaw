import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { a as writeRuntimeJson } from "./runtime-LRpY2Icg.js";
import { t as AgentSelectionRequiredError } from "./agent-scope-config-CUBiGmG3.js";
import { t as openNodeSqliteDatabase } from "./node-sqlite-_e3IvfT7.js";
import { r as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-CVc2mOCy.js";
import { c as resolveSessionStoreTargets } from "./targets-Bo3OPXck.js";
import "./sessions-CdrF1uzY.js";
import fs from "node:fs";
import path from "node:path";
//#region src/commands/session-store-targets.ts
/**
* Session store target resolution wrapper for CLI commands.
*
* The config helper throws on invalid agent/store combinations; this module
* converts those errors into command output and exit codes.
*/
const SESSION_STORE_SELECTION_CONTEXT = {
	surface: "session-store selection",
	hint: "Pass --agent <id> to select one agent, or --all-agents to include every configured agent."
};
function formatResolvedStoreTarget(params) {
	return path.resolve(params.storePath) === params.resolvedPath ? params.resolvedPath : `${params.resolvedPath} (resolved from --store ${JSON.stringify(params.inputStorePath)})`;
}
function resolveExplicitSessionStorePath(params) {
	const storePath = path.resolve(params.storePath);
	const resolvedPath = resolveSqliteTargetFromSessionStorePath(storePath, { agentId: params.agentId }).path;
	const displayTarget = formatResolvedStoreTarget({
		inputStorePath: params.inputStorePath,
		resolvedPath,
		storePath
	});
	let stat;
	let statFailure;
	try {
		stat = fs.statSync(resolvedPath);
	} catch (error) {
		statFailure = { error };
	}
	if (statFailure) {
		const error = statFailure.error;
		if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") throw new Error(`Session store target does not exist: ${displayTarget}. Pass a selector whose resolved SQLite target exists.`);
		throw new Error(`Could not inspect session store target ${displayTarget}: ${formatErrorMessage(error)}`);
	}
	if (!stat?.isFile()) throw new Error(`Session store target is not a regular file: ${displayTarget}. Pass a selector whose resolved SQLite target is a regular file.`);
	let database;
	let databaseFailure;
	try {
		database = openNodeSqliteDatabase(resolvedPath, { readOnly: true });
		const applicationTables = database.prepare("SELECT name FROM sqlite_schema WHERE type = 'table' AND name NOT LIKE 'sqlite_%'").all();
		if (applicationTables.length > 0 && !applicationTables.some((row) => row.name === "schema_meta")) throw new Error("the SQLite file has application tables but no OpenClaw schema metadata");
	} catch (error) {
		databaseFailure = { error };
	} finally {
		database?.close();
	}
	if (databaseFailure) throw new Error(`Session store target is not a session store: ${displayTarget}. ${formatErrorMessage(databaseFailure.error)}. Pass a legacy store selector or SQLite target reported by openclaw sessions or openclaw status.`);
	return storePath;
}
/** Resolves and validates an operator-supplied legacy selector without changing its semantics. */
function resolveExplicitSessionStorePathOrExit(params) {
	try {
		return resolveExplicitSessionStorePath({
			agentId: params.agentId,
			inputStorePath: params.inputStorePath ?? params.storePath,
			storePath: params.storePath
		});
	} catch (error) {
		return exitSessionStoreError(params, error);
	}
}
function exitSessionStoreError(params, error) {
	const message = formatErrorMessage(error);
	if (params.json) writeRuntimeJson(params.runtime, { error: message });
	else params.runtime.error(message);
	params.runtime.exit(1);
	return null;
}
/** Resolves session store targets or exits the current command on validation errors. */
function resolveSessionStoreTargetsOrExit(params) {
	let targets;
	try {
		targets = resolveSessionStoreTargets(params.cfg, params.opts);
	} catch (error) {
		return exitSessionStoreError(params, error instanceof AgentSelectionRequiredError ? new AgentSelectionRequiredError(error.agentIds, SESSION_STORE_SELECTION_CONTEXT) : error);
	}
	if (!params.opts.store) return targets;
	const target = targets[0];
	if (!target) return exitSessionStoreError(params, /* @__PURE__ */ new Error("Explicit session store selection did not resolve a target."));
	const storePath = resolveExplicitSessionStorePathOrExit({
		storePath: target.storePath,
		inputStorePath: params.opts.store,
		agentId: target.agentId,
		runtime: params.runtime,
		json: params.json
	});
	return storePath ? [{
		...target,
		storePath
	}] : null;
}
//#endregion
export { resolveSessionStoreTargetsOrExit as n, resolveExplicitSessionStorePath as t };
