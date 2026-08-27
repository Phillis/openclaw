import { r as mayMatchGlobWithPrefix } from "./glob-pattern-DFVWJ-hh.js";
import { a as expandToolGroups, c as normalizeToolPolicyName, l as readToolAllowlistIntersection, r as attachToolAllowlistIntersection, s as normalizeToolList } from "./tool-policy-shared-DmpG3HvD.js";
import { o as expandPolicyWithPluginGroups, r as buildPluginToolGroups, s as expandShippedCoreToolPolicyNames } from "./tool-policy-B1rvCc4B.js";
import { r as isToolAllowedByPolicyName } from "./tool-policy-match-DfCekeWz.js";
import { n as resolveCoreToolFactoryFamily } from "./core-tool-factory-descriptors-C-BGWj2h.js";
//#region src/agents/embedded-agent-runner/run/attempt-tool-construction-plan.ts
/**
* Plans which core, bundle MCP, and bundle LSP tools an attempt should build.
*/
const ALL_CODING_TOOL_CONSTRUCTION_PLAN = {
	includeBaseCodingTools: true,
	includeShellTools: true,
	includeChannelTools: true,
	includeOpenClawTools: true,
	includePluginTools: true
};
const NO_CODING_TOOL_CONSTRUCTION_PLAN = {
	includeBaseCodingTools: false,
	includeShellTools: false,
	includeChannelTools: false,
	includeOpenClawTools: false,
	includePluginTools: false
};
function cloneCodingToolConstructionPlan(plan) {
	return { ...plan };
}
function isBundleMcpAllowlistName(normalized) {
	return normalized === "bundle-mcp" || normalized.includes("__");
}
function hasWildcardToolAllowlist(toolsAllow) {
	return toolsAllow.some((entry) => normalizeToolPolicyName(entry) === "*");
}
/**
* Applies a runtime allowlist to a concrete tool list after expanding tool and
* plugin groups. Undefined allowlists keep all tools; an explicit empty list
* intentionally disables all runtime tools.
*/
function applyEmbeddedAttemptToolsAllow(tools, toolsAllow, options) {
	if (!toolsAllow) return tools;
	return (readToolAllowlistIntersection(toolsAllow) ?? [toolsAllow]).reduce((currentTools, restriction) => {
		if (restriction.length === 0) return [];
		if (hasWildcardToolAllowlist(restriction)) return currentTools;
		const pluginGroups = options?.toolMeta ? buildPluginToolGroups({
			tools: currentTools,
			toolMeta: options.toolMeta
		}) : void 0;
		const policy = pluginGroups ? expandPolicyWithPluginGroups({ allow: restriction }, pluginGroups) : { allow: expandShippedCoreToolPolicyNames(restriction) };
		return currentTools.filter((tool) => isToolAllowedByPolicyName(tool.name, policy));
	}, tools);
}
/**
* Adds host-required tools to a narrowed runtime allowlist. Wildcard and
* undefined allowlists already cover every required tool.
*/
function mergeForcedEmbeddedAttemptToolsAllow(toolsAllow, params) {
	if (toolsAllow === void 0 || hasWildcardToolAllowlist(toolsAllow)) return toolsAllow;
	const required = [...params.forceMessageTool ? ["message"] : [], ...params.forceToolNames ?? []];
	if (required.length === 0) return toolsAllow;
	const normalized = new Set(toolsAllow.map((entry) => normalizeToolPolicyName(entry)));
	const missing = required.filter((name) => !normalized.has(normalizeToolPolicyName(name)));
	if (missing.length === 0) return toolsAllow;
	const restrictions = readToolAllowlistIntersection(toolsAllow);
	const merged = [...toolsAllow, ...missing];
	return restrictions ? attachToolAllowlistIntersection(merged, restrictions.map((restriction) => restriction.concat(missing))) : merged;
}
function resolveCodingToolConstructionPlanForAllowlist(toolsAllow) {
	if (!toolsAllow) return cloneCodingToolConstructionPlan(ALL_CODING_TOOL_CONSTRUCTION_PLAN);
	if (toolsAllow.length === 0) return cloneCodingToolConstructionPlan(NO_CODING_TOOL_CONSTRUCTION_PLAN);
	if (hasWildcardToolAllowlist(toolsAllow)) return cloneCodingToolConstructionPlan(ALL_CODING_TOOL_CONSTRUCTION_PLAN);
	const normalized = normalizeToolList(expandToolGroups(expandShippedCoreToolPolicyNames(toolsAllow)));
	const coreFamilies = /* @__PURE__ */ new Set();
	let includePluginTools = false;
	for (const name of normalized) {
		const family = resolveCoreToolFactoryFamily(name);
		if (family) {
			coreFamilies.add(family);
			continue;
		}
		if (!isBundleMcpAllowlistName(name)) includePluginTools = true;
	}
	const includeBaseCodingTools = coreFamilies.has("base-coding");
	const includeShellTools = coreFamilies.has("shell");
	const includeOpenClawTools = coreFamilies.has("openclaw");
	return {
		includeBaseCodingTools,
		includeShellTools,
		includeChannelTools: includePluginTools,
		includeOpenClawTools,
		includePluginTools
	};
}
/**
* Decides which tool families need to be constructed for an embedded attempt.
* This keeps allowlisted plugin/channel tools available without forcing every
* local core tool factory to run for narrow plugin-only configurations.
*/
function resolveEmbeddedAttemptToolConstructionPlan(params) {
	if (params.disableTools === true || params.isRawModelRun === true || params.toolsEnabled === false) return {
		constructTools: false,
		includeCoreTools: false,
		codingToolConstructionPlan: cloneCodingToolConstructionPlan(NO_CODING_TOOL_CONSTRUCTION_PLAN)
	};
	const toolsAllow = mergeForcedEmbeddedAttemptToolsAllow(params.toolsAllow, { forceMessageTool: params.forceMessageTool });
	const codingToolConstructionPlan = resolveCodingToolConstructionPlanForAllowlist(toolsAllow);
	const includeCoreTools = codingToolConstructionPlan.includeBaseCodingTools || codingToolConstructionPlan.includeShellTools || codingToolConstructionPlan.includeOpenClawTools;
	return {
		constructTools: includeCoreTools || codingToolConstructionPlan.includeChannelTools || codingToolConstructionPlan.includePluginTools,
		includeCoreTools,
		...toolsAllow ? { runtimeToolAllowlist: toolsAllow } : {},
		codingToolConstructionPlan
	};
}
function shouldCreateBundleRuntimeForAttempt(params, matchesAllowlist) {
	if (!params.toolsEnabled || params.disableTools === true) return false;
	if (!params.toolsAllow) return true;
	if (params.toolsAllow.length === 0) return false;
	if (hasWildcardToolAllowlist(params.toolsAllow)) return true;
	return matchesAllowlist(params.toolsAllow.map(normalizeToolPolicyName));
}
/**
* Decides whether the bundled MCP runtime is needed for this attempt. Bundle
* runtime creation follows explicit bundle/plugin names or globs that can reach
* a configured server namespace. Final tool policy remains authoritative.
*/
function shouldCreateBundleMcpRuntimeForAttempt(params) {
	return shouldCreateBundleRuntimeForAttempt(params, (names) => {
		if (names.some((name) => isBundleMcpAllowlistName(name) || name === "group:plugins")) return true;
		const globs = names.filter((name) => name.includes("*"));
		return globs.length > 0 && (params.resolveConfiguredMcpNamespaces?.() ?? []).some((namespace) => globs.some((glob) => mayMatchGlobWithPrefix(glob, namespace.toLowerCase())));
	});
}
/**
* Decides whether the bundled LSP runtime is needed for this attempt. LSP tools
* are enabled by default/wildcard and by allowlist entries with the `lsp_`
* prefix.
*/
function shouldCreateBundleLspRuntimeForAttempt(params) {
	return shouldCreateBundleRuntimeForAttempt(params, (names) => names.some((name) => name.startsWith("lsp_")));
}
//#endregion
export { shouldCreateBundleMcpRuntimeForAttempt as a, shouldCreateBundleLspRuntimeForAttempt as i, mergeForcedEmbeddedAttemptToolsAllow as n, resolveEmbeddedAttemptToolConstructionPlan as r, applyEmbeddedAttemptToolsAllow as t };
