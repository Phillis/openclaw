import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { a as resolveCoreToolProfilePolicy, t as CORE_TOOL_GROUPS } from "./tool-catalog-DKzjKSZr.js";
//#region src/agents/tool-policy-shared.ts
/**
* Shared runtime tool policy normalization.
*
* Keeps aliases, groups, profile expansion, and prefix matching consistent across allow/deny paths.
*/
const TOOL_NAME_ALIASES = {
	bash: "exec",
	"apply-patch": "apply_patch",
	cron: "automations"
};
const TOOL_ALLOWLIST_INTERSECTION = Symbol.for("openclaw.toolAllowlistIntersection");
/** Core tool groups exposed to allow/deny policy config. */
const TOOL_GROUPS = { ...CORE_TOOL_GROUPS };
/**
* Preserves independent allowlists until a concrete tool surface can evaluate
* them. Intersections of overlapping globs cannot be represented by one glob list.
*/
function attachToolAllowlistIntersection(toolsAllow, restrictions) {
	Object.defineProperty(toolsAllow, TOOL_ALLOWLIST_INTERSECTION, {
		configurable: true,
		enumerable: false,
		value: restrictions
	});
	return toolsAllow;
}
/** Reads independent restrictions attached by a modifying-hook merger. */
function readToolAllowlistIntersection(toolsAllow) {
	return toolsAllow[TOOL_ALLOWLIST_INTERSECTION];
}
/** Normalizes a tool name or alias to the policy id used for matching. */
/** Refusal for a tool that keeps its schema but sits outside the run's execution allowlist. */
const TOOL_EXECUTION_GATED_MESSAGE = "Unavailable during skill review. Use skill_workshop or finish with NOTHING_TO_LEARN.";
function isToolExecutionAllowed(allowNames, toolName) {
	const target = normalizeToolPolicyName(toolName);
	return allowNames.some((name) => normalizeToolPolicyName(name) === target);
}
function normalizeToolPolicyName(name) {
	const normalized = normalizeLowercaseStringOrEmpty(name);
	return TOOL_NAME_ALIASES[normalized] ?? normalized;
}
/** Checks whether an in-progress prefix can still resolve to an allowed tool or alias. */
function couldNormalizeToolNamePrefixToAllowedTool(prefix, allowedToolNames) {
	const normalizedPrefix = normalizeLowercaseStringOrEmpty(prefix);
	if (!normalizedPrefix) return false;
	const allowed = /* @__PURE__ */ new Set();
	for (const toolName of allowedToolNames) {
		const normalizedToolName = normalizeToolPolicyName(toolName);
		const foldedToolName = normalizeLowercaseStringOrEmpty(toolName);
		if (normalizedToolName) allowed.add(normalizedToolName);
		if (foldedToolName) allowed.add(foldedToolName);
		if (normalizedToolName.startsWith(normalizedPrefix) || foldedToolName.startsWith(normalizedPrefix)) return true;
	}
	const resolvedPrefix = normalizeToolPolicyName(normalizedPrefix);
	if (resolvedPrefix !== normalizedPrefix) {
		for (const toolName of allowed) if (toolName.startsWith(resolvedPrefix)) return true;
	}
	for (const [alias, toolName] of Object.entries(TOOL_NAME_ALIASES)) if (alias.startsWith(normalizedPrefix) && allowed.has(toolName)) return true;
	return false;
}
/** Normalizes a configured allow/deny list while dropping blank entries. */
function normalizeToolList(list) {
	if (!list) return [];
	return list.map(normalizeToolPolicyName).filter(Boolean);
}
/** Expands named tool groups into concrete tool ids. */
function expandToolGroups(list) {
	const normalized = normalizeToolList(list);
	const expanded = [];
	for (const value of normalized) {
		const group = TOOL_GROUPS[value];
		if (group) {
			expanded.push(...group);
			continue;
		}
		expanded.push(value);
	}
	return uniqueStrings(expanded);
}
/** Resolves a built-in tool profile policy by id. */
function resolveToolProfilePolicy(profile) {
	return resolveCoreToolProfilePolicy(profile);
}
//#endregion
export { expandToolGroups as a, normalizeToolPolicyName as c, couldNormalizeToolNamePrefixToAllowedTool as i, readToolAllowlistIntersection as l, TOOL_GROUPS as n, isToolExecutionAllowed as o, attachToolAllowlistIntersection as r, normalizeToolList as s, TOOL_EXECUTION_GATED_MESSAGE as t, resolveToolProfilePolicy as u };
