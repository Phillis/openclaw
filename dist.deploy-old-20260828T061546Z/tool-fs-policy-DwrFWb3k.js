import "./agent-scope-DigoIwHb.js";
import { s as resolveAgentConfig } from "./agent-scope-config-CUBiGmG3.js";
import { u as resolveToolProfilePolicy } from "./tool-policy-shared-DmpG3HvD.js";
import { n as pickSandboxToolPolicy } from "./sandbox-tool-policy-Dj2EhvVn.js";
import { l as mergeAlsoAllowPolicy } from "./tool-policy-B1rvCc4B.js";
import { n as isToolAllowedByPolicies } from "./tool-policy-match-DfCekeWz.js";
//#region src/agents/tool-fs-policy.ts
function resolveToolFsConfig(params) {
	const cfg = params.cfg;
	const globalFs = cfg?.tools?.fs;
	return { workspaceOnly: (cfg && params.agentId ? resolveAgentConfig(cfg, params.agentId)?.tools?.fs : void 0)?.workspaceOnly ?? globalFs?.workspaceOnly };
}
function resolveEffectiveToolFsWorkspaceOnly(params) {
	return resolveToolFsConfig(params).workspaceOnly === true;
}
function resolveEffectiveToolFsRootExpansionAllowed(params) {
	const cfg = params.cfg;
	if (!cfg) return true;
	const agentTools = params.agentId ? resolveAgentConfig(cfg, params.agentId)?.tools : void 0;
	const globalTools = cfg.tools;
	const profile = agentTools?.profile ?? globalTools?.profile;
	const profileAlsoAllow = new Set(agentTools?.alsoAllow ?? globalTools?.alsoAllow ?? []);
	if (resolveToolFsConfig(params).workspaceOnly === true) return false;
	return isToolAllowedByPolicies("read", [
		mergeAlsoAllowPolicy(resolveToolProfilePolicy(profile), profileAlsoAllow.size > 0 ? Array.from(profileAlsoAllow) : void 0),
		pickSandboxToolPolicy(globalTools),
		pickSandboxToolPolicy(agentTools)
	]);
}
//#endregion
export { resolveEffectiveToolFsWorkspaceOnly as n, resolveToolFsConfig as r, resolveEffectiveToolFsRootExpansionAllowed as t };
