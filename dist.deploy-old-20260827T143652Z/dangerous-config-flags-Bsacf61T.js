import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import "./utils-DEqefz4f.js";
import "./agent-scope-BizOtGGz.js";
import { d as resolveAgentWorkspaceDir, r as listAgentEntries, s as resolveAgentConfig, y as tryResolveDefaultAgentId } from "./agent-scope-config-BdXMWufB.js";
import { n as resolveDefaultAgentWorkspaceDir } from "./workspace-default-kpBt4Iki.js";
import { t as collectPluginConfigContractMatches } from "./config-contract-matches-CJFCzwZy.js";
import { t as resolvePluginConfigContractsById } from "./config-contracts-DjQ2UJvq.js";
import { n as collectEnabledInsecureOrDangerousFlagsFromContracts, t as collectEnabledInsecureOrDangerousFlagsFromCurrentSnapshot } from "./dangerous-config-flags-current-CEJjFxu0.js";
//#region src/security/dangerous-config-flags.ts
/**
* Collect enabled insecure/dangerous config flags for audit and startup warnings.
* Plugin flags use current metadata when requested, then fall back to resolving manifest contracts.
*/
function collectEnabledInsecureOrDangerousFlags(cfg, options = {}) {
	const pluginEntries = cfg.plugins?.entries;
	if (!isRecord(pluginEntries)) return collectEnabledInsecureOrDangerousFlagsFromContracts(cfg);
	const pluginIds = Object.keys(pluginEntries);
	if (options.preferCurrentPluginMetadataSnapshot) {
		const currentSnapshotFlags = collectEnabledInsecureOrDangerousFlagsFromCurrentSnapshot(cfg);
		if (currentSnapshotFlags) return currentSnapshotFlags;
	}
	const defaultAgentId = tryResolveDefaultAgentId(cfg);
	const workspaceDirs = /* @__PURE__ */ new Set();
	if (defaultAgentId) workspaceDirs.add(resolveAgentWorkspaceDir(cfg, defaultAgentId));
	else {
		const roster = listAgentEntries(cfg);
		if (roster.length === 0) {
			const configuredWorkspace = cfg.agents?.defaults?.workspace?.trim();
			workspaceDirs.add(configuredWorkspace ? resolveUserPath(configuredWorkspace, process.env) : resolveDefaultAgentWorkspaceDir(process.env));
		} else {
			let hasInheritedWorkspace = false;
			for (const entry of roster) {
				const workspace = resolveAgentConfig(cfg, entry.id)?.workspace?.trim();
				if (workspace) workspaceDirs.add(resolveUserPath(workspace, process.env));
				else hasInheritedWorkspace = true;
			}
			if (hasInheritedWorkspace) {
				const inheritedWorkspace = cfg.agents?.defaults?.workspace?.trim();
				workspaceDirs.add(inheritedWorkspace ? resolveUserPath(inheritedWorkspace, process.env) : resolveDefaultAgentWorkspaceDir(process.env));
			}
		}
	}
	const flags = /* @__PURE__ */ new Set();
	for (const workspaceDir of workspaceDirs) {
		const configContracts = resolvePluginConfigContractsById({
			config: cfg,
			...workspaceDir ? { workspaceDir } : {},
			env: process.env,
			pluginIds
		});
		for (const flag of collectEnabledInsecureOrDangerousFlagsFromContracts(cfg, {
			collectPluginConfigContractMatches,
			configContractsById: configContracts
		})) flags.add(flag);
	}
	return [...flags];
}
//#endregion
export { collectEnabledInsecureOrDangerousFlags as t };
