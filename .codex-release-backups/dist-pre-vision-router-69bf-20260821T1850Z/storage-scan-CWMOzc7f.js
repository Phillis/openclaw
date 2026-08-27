import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import "./utils-D9gvQMP6.js";
import { r as formatErrorMessage } from "./errors-CqPTYU6G.js";
import "./agent-scope-D9GLFAyB.js";
import { a as listAgentIds, l as resolveAgentDir } from "./agent-scope-config-CsnnOL14.js";
import { a as parseEnvValue } from "./shared-D1NvanUW.js";
import fs from "node:fs";
import path from "node:path";
//#region src/secrets/storage-scan.ts
/** Filesystem discovery and bounded JSON readers for local secret storage audits. */
/** Parses one .env assignment value using the shared shell-ish env parser. */
function parseEnvAssignmentValue(raw) {
	return parseEnvValue(raw);
}
/** Lists global dotenv files that can supply secrets for the selected config and state roots. */
function listSecretsDotEnvPaths(params) {
	const candidates = [path.join(params.stateDir, ".env"), path.join(path.dirname(params.configPath), ".env")];
	return [...new Map(candidates.map((candidate) => [path.resolve(candidate), candidate])).values()];
}
function resolveActiveAgentDir(stateDir, env = process.env) {
	const override = env.OPENCLAW_AGENT_DIR?.trim() || env.PI_CODING_AGENT_DIR?.trim();
	if (override) return resolveUserPath(override, env);
	return path.join(resolveUserPath(stateDir), "agents", "main", "agent");
}
/**
* Lists deduplicated models.json paths that may contain materialized provider credentials.
* Includes active env override, implicit main agent, discovered state dirs, and configured agents.
*/
function listAgentModelsJsonPaths(config, stateDir, env = process.env) {
	const resolvedStateDir = resolveUserPath(stateDir);
	const paths = /* @__PURE__ */ new Set();
	paths.add(path.join(resolvedStateDir, "agents", "main", "agent", "models.json"));
	paths.add(path.join(resolveActiveAgentDir(stateDir, env), "models.json"));
	const agentsRoot = path.join(resolvedStateDir, "agents");
	if (fs.existsSync(agentsRoot)) for (const entry of fs.readdirSync(agentsRoot, { withFileTypes: true })) {
		if (!entry.isDirectory()) continue;
		paths.add(path.join(agentsRoot, entry.name, "agent", "models.json"));
	}
	for (const agentId of listAgentIds(config)) {
		if (agentId === "main") {
			paths.add(path.join(resolvedStateDir, "agents", "main", "agent", "models.json"));
			continue;
		}
		const agentDir = resolveAgentDir(config, agentId);
		paths.add(path.join(resolveUserPath(agentDir), "models.json"));
	}
	return [...paths];
}
function readJsonObjectIfExists(filePath, options = {}) {
	if (!fs.existsSync(filePath)) return { value: null };
	try {
		const stats = fs.statSync(filePath);
		if (options.requireRegularFile && !stats.isFile()) return {
			value: null,
			error: `Refusing to read non-regular file: ${filePath}`
		};
		if (typeof options.maxBytes === "number" && Number.isFinite(options.maxBytes) && options.maxBytes >= 0 && stats.size > options.maxBytes) return {
			value: null,
			error: `Refusing to read oversized JSON (${stats.size} bytes): ${filePath}`
		};
		const raw = fs.readFileSync(filePath, "utf8");
		const parsed = JSON.parse(raw);
		if (!isRecord(parsed)) return { value: null };
		return { value: parsed };
	} catch (err) {
		return {
			value: null,
			error: formatErrorMessage(err)
		};
	}
}
//#endregion
export { readJsonObjectIfExists as i, listSecretsDotEnvPaths as n, parseEnvAssignmentValue as r, listAgentModelsJsonPaths as t };
