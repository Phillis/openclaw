import { m as readNonBlankString } from "./string-coerce-CIXf7egm.js";
import { c as resolveUserPath } from "./home-dir-BFvskzn8.js";
import "./utils-Bw16L5tB.js";
import { w as resolveStateDir } from "./paths-BBSTUjD5.js";
import "./agent-scope-DigoIwHb.js";
import { a as listAgentIds, l as resolveAgentDir } from "./agent-scope-config-CUBiGmG3.js";
import { o as resolveSharedMainAuthAgentDir } from "./path-resolve-Bjd7UUgA.js";
import { r as resolveLegacyInheritedAuthAgentDir } from "./legacy-inherited-auth-dir-DCEipwnb.js";
import fs from "node:fs";
import path from "node:path";
//#region src/commands/doctor-auth-legacy-paths.ts
function resolveLegacyAuthAgentDir(agentDir) {
	return agentDir ? resolveUserPath(agentDir) : resolveSharedMainAuthAgentDir();
}
function addCandidate(candidates, agentDir) {
	const authPath = resolveLegacyAuthProfilesPath(agentDir);
	const key = path.resolve(authPath);
	if (!candidates.get(key) || agentDir === void 0) candidates.set(key, {
		agentDir,
		authPath
	});
}
function listExistingAgentDirsFromState(env) {
	const root = path.join(resolveStateDir(env), "agents");
	let entries;
	try {
		entries = fs.readdirSync(root, { withFileTypes: true });
	} catch {
		return [];
	}
	return entries.filter((entry) => entry.isDirectory() || entry.isSymbolicLink()).map((entry) => path.join(root, entry.name, "agent")).filter((agentDir) => {
		try {
			return fs.statSync(agentDir).isDirectory();
		} catch {
			return false;
		}
	});
}
/**
* One canonical enumeration of legacy auth-store repair candidates. Sidecar
* inline-recovery and flat-store SQLite migration must see the same dirs, or
* decryptable sidecar secrets get imported as credential-less profiles.
*/
function listAuthProfileRepairCandidates(cfg, env) {
	const candidates = /* @__PURE__ */ new Map();
	addCandidate(candidates, void 0);
	addCandidate(candidates, resolveLegacyInheritedAuthAgentDir(cfg, env));
	const envAgentDir = readNonBlankString(env.OPENCLAW_AGENT_DIR) ?? readNonBlankString(env.PI_CODING_AGENT_DIR);
	if (envAgentDir) addCandidate(candidates, envAgentDir);
	for (const agentId of listAgentIds(cfg)) addCandidate(candidates, resolveAgentDir(cfg, agentId, env));
	for (const agentDir of listExistingAgentDirsFromState(env)) addCandidate(candidates, agentDir);
	return [...candidates.values()];
}
function resolveLegacyAuthProfilesPath(agentDir) {
	return path.join(resolveLegacyAuthAgentDir(agentDir), "auth-profiles.json");
}
function resolveLegacyAuthStatePath(agentDir) {
	return path.join(resolveLegacyAuthAgentDir(agentDir), "auth-state.json");
}
function resolveLegacyFlatAuthPath(agentDir) {
	return path.join(resolveLegacyAuthAgentDir(agentDir), "auth.json");
}
//#endregion
export { resolveLegacyFlatAuthPath as i, resolveLegacyAuthProfilesPath as n, resolveLegacyAuthStatePath as r, listAuthProfileRepairCandidates as t };
