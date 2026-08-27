import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { w as resolveStateDir } from "./paths-CqeDjSA4.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { b as tryResolveLegacyCompatibilityAgentId, l as resolveAgentDir } from "./agent-scope-config-CsnnOL14.js";
import "./legacy.default-agent-owner-0YGX8Nyg.js";
import path from "node:path";
//#region src/agents/legacy-inherited-auth-dir.ts
function resolveLegacyInheritedAuthAgentId(config) {
	return normalizeOptionalString(config.agents?.defaults?.authInheritance?.agentId) ?? tryResolveLegacyCompatibilityAgentId(config) ?? "main";
}
function resolveLegacyInheritedAuthDir(config, env = process.env) {
	return resolveAgentDir(config, resolveLegacyInheritedAuthAgentId(config), env);
}
function pinLegacyInheritedAuthOwnerForRosterTransition(sourceConfig, targetConfig) {
	const sourceOwner = resolveLegacyInheritedAuthAgentId(sourceConfig);
	if (sourceOwner === resolveLegacyInheritedAuthAgentId(targetConfig)) return targetConfig;
	return {
		...targetConfig,
		agents: {
			...targetConfig.agents,
			defaults: {
				...targetConfig.agents?.defaults,
				authInheritance: {
					...targetConfig.agents?.defaults?.authInheritance,
					agentId: sourceOwner
				}
			}
		}
	};
}
function assertSafeLegacyInheritedAuthDirTransition(sourceConfig, targetConfig, env = process.env) {
	const sourceOwner = resolveLegacyInheritedAuthAgentId(sourceConfig);
	const sourceDir = resolveAgentDir(sourceConfig, sourceOwner, env);
	const conventionalDir = path.join(resolveStateDir(env), "agents", normalizeAgentId(sourceOwner), "agent");
	const targetDir = resolveAgentDir(targetConfig, sourceOwner, env);
	if (path.resolve(sourceDir) === path.resolve(conventionalDir) || targetDir === sourceDir) return;
	throw Object.assign(/* @__PURE__ */ new Error(`Config write refused: inherited auth for agent "${sourceOwner}" is stored in custom agentDir ${JSON.stringify(sourceDir)}, but this roster change removes or changes that directory. Relocate the credentials to ${JSON.stringify(conventionalDir)} or set agents.defaults.authInheritance explicitly for the destination owner, then retry.`), { code: "CONFIG_WRITE_REJECTED" });
}
//#endregion
export { resolveLegacyInheritedAuthDir as i, pinLegacyInheritedAuthOwnerForRosterTransition as n, resolveLegacyInheritedAuthAgentId as r, assertSafeLegacyInheritedAuthDirTransition as t };
