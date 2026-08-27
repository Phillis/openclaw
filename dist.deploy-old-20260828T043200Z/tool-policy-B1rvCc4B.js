import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { a as expandToolGroups, c as normalizeToolPolicyName, s as normalizeToolList } from "./tool-policy-shared-DmpG3HvD.js";
import { a as sanitizeServerName } from "./agent-bundle-mcp-names-CP3ugHLh.js";
import { t as IMPLICIT_ALLOW_ALL_FROM_ALSO_ALLOW } from "./sandbox-tool-policy-Dj2EhvVn.js";
//#region src/agents/tool-policy.ts
/**
* Tool allow/deny policy helpers.
* Normalizes core and plugin tool groups, expands plugin entries, and extracts
* explicit operator allow/deny lists.
*/
/** Synthetic allowlist entry that means "use default plugin tools". */
const DEFAULT_PLUGIN_TOOLS_ALLOWLIST_ENTRY = "__openclaw_default_plugin_tools__";
const SHIPPED_PLUGIN_POLICY_FAMILY_CORE_TOOLS = /* @__PURE__ */ new Map([["canvas", ["show_widget"]]]);
const SHIPPED_CORE_POLICY_RENAMES = /* @__PURE__ */ new Map([["update_plan", "progress_card"]]);
/** Maps retired shipped policy names to their current core tool ids. */
function expandShippedCoreToolPolicyNames(list) {
	if (!list) return;
	return uniqueStrings(list.map((entry) => {
		const normalized = normalizeToolPolicyName(entry);
		return SHIPPED_CORE_POLICY_RENAMES.get(normalized) ?? normalized;
	}));
}
/** Returns true when an allow policy is narrower than all/default plugin tools. */
function hasRestrictiveAllowPolicy(policy) {
	if (!Array.isArray(policy?.allow)) return false;
	const normalizedAllow = policy.allow.map((entry) => normalizeToolPolicyName(entry));
	if (normalizedAllow.includes("*")) return false;
	return normalizedAllow.some((entry) => Boolean(entry) && entry !== "__openclaw_default_plugin_tools__");
}
/** Returns whether a policy removes at least one tool from the default surface. */
function toolPolicyRestrictsTools(policy) {
	if (!policy) return false;
	if (expandToolGroups(policy.deny ?? []).some((entry) => Boolean(normalizeToolPolicyName(entry)))) return true;
	return Array.isArray(policy.allow) && policy.allow.length > 0 && !expandToolGroups(policy.allow).some((entry) => normalizeToolPolicyName(entry) === "*");
}
/** Replaces an allowlist with the normalized names of an effective tool array. */
function replaceWithEffectiveToolAllowlist(target, tools) {
	target.length = 0;
	const seen = /* @__PURE__ */ new Set();
	for (const tool of tools) {
		const normalized = normalizeToolPolicyName(tool.name);
		if (!normalized || seen.has(normalized)) continue;
		seen.add(normalized);
		target.push(normalized);
	}
}
/** Collects explicit allow entries from layered policies. */
function collectExplicitAllowlist(policies) {
	const entries = [];
	for (const policy of policies) {
		if (!policy?.allow) continue;
		for (const value of policy.allow) {
			if (typeof value !== "string") continue;
			const trimmed = value.trim();
			if (trimmed === "*" && policy[IMPLICIT_ALLOW_ALL_FROM_ALSO_ALLOW] === true) continue;
			if (trimmed) entries.push(trimmed);
		}
		if (policy[IMPLICIT_ALLOW_ALL_FROM_ALSO_ALLOW] === true) entries.push(DEFAULT_PLUGIN_TOOLS_ALLOWLIST_ENTRY);
	}
	return uniqueStrings(entries);
}
/** Collects explicit deny entries from layered policies. */
function collectExplicitDenylist(policies) {
	const entries = [];
	for (const policy of policies) {
		if (!policy?.deny) continue;
		for (const value of policy.deny) {
			if (typeof value !== "string") continue;
			const trimmed = value.trim();
			if (trimmed) entries.push(trimmed);
		}
	}
	return entries;
}
/** Builds plugin tool groups from tool metadata. */
function buildPluginToolGroups(params) {
	const all = [];
	const byPlugin = /* @__PURE__ */ new Map();
	for (const tool of params.tools) {
		const meta = params.toolMeta(tool);
		if (!meta) continue;
		const name = normalizeToolPolicyName(tool.name);
		all.push(name);
		const pluginId = normalizeOptionalLowercaseString(meta.pluginId);
		if (!pluginId) continue;
		const list = byPlugin.get(pluginId) ?? [];
		list.push(name);
		byPlugin.set(pluginId, list);
	}
	return {
		all,
		byPlugin
	};
}
/** Expands group:plugins and plugin-id entries into concrete plugin tool names. */
function expandPluginGroups(list, groups) {
	const renamed = expandShippedCoreToolPolicyNames(list);
	if (!renamed || renamed.length === 0) return renamed;
	const expanded = [];
	for (const entry of renamed) {
		const normalized = normalizeToolPolicyName(entry);
		if (normalized === "group:plugins") {
			if (groups.all.length > 0) expanded.push(...groups.all);
			else expanded.push(normalized);
			continue;
		}
		const tools = groups.byPlugin.get(normalized) ?? [];
		const promotedCoreTools = SHIPPED_PLUGIN_POLICY_FAMILY_CORE_TOOLS.get(normalized) ?? [];
		if (tools.length > 0 || promotedCoreTools.length > 0) {
			expanded.push(...tools, ...promotedCoreTools);
			continue;
		}
		expanded.push(normalized);
	}
	return uniqueStrings(expanded);
}
/** Expands plugin groups in a policy while preserving undefined policies. */
function expandPolicyWithPluginGroups(policy, groups) {
	if (!policy) return;
	return {
		allow: expandPluginGroups(policy.allow, groups),
		deny: expandPluginGroups(policy.deny, groups)
	};
}
function buildDeclaredMcpToolPrefixes(serverNames) {
	const prefixes = /* @__PURE__ */ new Set();
	const usedNames = /* @__PURE__ */ new Set();
	for (const serverName of serverNames ?? []) {
		const prefix = normalizeToolPolicyName(sanitizeServerName(serverName, usedNames) + "__");
		if (prefix) prefixes.add(prefix);
	}
	return prefixes;
}
function normalizeDeclaredPluginIds(values) {
	return new Set(Array.from(values ?? [], (value) => normalizeOptionalLowercaseString(value)).filter((value) => Boolean(value)));
}
function normalizeDeclaredToolNames(values) {
	return new Set(Array.from(values ?? [], (value) => normalizeToolPolicyName(value)).filter((value) => Boolean(value)));
}
function isDeclaredMcpAllowlistEntry(entry, prefixes) {
	if (prefixes.size === 0) return false;
	if (entry === "bundle-mcp") return true;
	for (const prefix of prefixes) if (entry.length > prefix.length && entry.startsWith(prefix)) return true;
	return false;
}
/** Classifies allowlists as core, plugin-only, or unknown for diagnostics. */
function analyzeAllowlistByToolType(policy, groups, coreTools, declaredTools) {
	if (!policy?.allow || policy.allow.length === 0) return {
		policy,
		unknownAllowlist: [],
		pluginOnlyAllowlist: false
	};
	const normalized = normalizeToolList(expandShippedCoreToolPolicyNames(policy.allow));
	if (normalized.length === 0) return {
		policy,
		unknownAllowlist: [],
		pluginOnlyAllowlist: false
	};
	const pluginIds = /* @__PURE__ */ new Set([...groups.byPlugin.keys(), ...normalizeDeclaredPluginIds(declaredTools?.pluginIds)]);
	const pluginTools = /* @__PURE__ */ new Set([...groups.all, ...normalizeDeclaredToolNames(declaredTools?.pluginToolNames)]);
	const mcpToolPrefixes = buildDeclaredMcpToolPrefixes(declaredTools?.mcpServerNames);
	const unknownAllowlist = [];
	let hasOnlyPluginEntries = true;
	for (const entry of normalized) {
		if (entry === "*") {
			hasOnlyPluginEntries = false;
			continue;
		}
		const isPluginEntry = entry === "group:plugins" || pluginIds.has(entry) || pluginTools.has(entry) || isDeclaredMcpAllowlistEntry(entry, mcpToolPrefixes);
		const isCoreEntry = expandToolGroups([entry]).some((tool) => coreTools.has(tool));
		if (!isPluginEntry) hasOnlyPluginEntries = false;
		if (!isCoreEntry && !isPluginEntry) unknownAllowlist.push(entry);
	}
	const pluginOnlyAllowlist = hasOnlyPluginEntries;
	return {
		policy,
		unknownAllowlist: uniqueStrings(unknownAllowlist),
		pluginOnlyAllowlist
	};
}
/** Merges alsoAllow entries into an existing allow policy. */
function mergeAlsoAllowPolicy(policy, alsoAllow) {
	if (!policy?.allow || !Array.isArray(alsoAllow) || alsoAllow.length === 0) return policy;
	return {
		...policy,
		allow: uniqueStrings([...policy.allow, ...alsoAllow])
	};
}
//#endregion
export { collectExplicitDenylist as a, hasRestrictiveAllowPolicy as c, toolPolicyRestrictsTools as d, collectExplicitAllowlist as i, mergeAlsoAllowPolicy as l, analyzeAllowlistByToolType as n, expandPolicyWithPluginGroups as o, buildPluginToolGroups as r, expandShippedCoreToolPolicyNames as s, DEFAULT_PLUGIN_TOOLS_ALLOWLIST_ENTRY as t, replaceWithEffectiveToolAllowlist as u };
