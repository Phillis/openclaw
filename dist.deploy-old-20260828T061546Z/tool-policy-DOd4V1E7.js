import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import "./agent-scope-DigoIwHb.js";
import { s as resolveAgentConfig } from "./agent-scope-config-CUBiGmG3.js";
import { n as matchesAnyGlobPattern, t as compileGlobPatterns } from "./glob-pattern-DFVWJ-hh.js";
import { a as expandToolGroups, c as normalizeToolPolicyName } from "./tool-policy-shared-DmpG3HvD.js";
import "./tool-policy-B1rvCc4B.js";
import { h as DEFAULT_TOOL_DENY, m as DEFAULT_TOOL_ALLOW } from "./constants-CZykxrCI.js";
//#region src/agents/sandbox/tool-policy.ts
/**
* Sandbox tool policy resolver.
*
* Merges global, agent, and default allow/deny lists into normalized policy plus source diagnostics.
*/
function buildSource(params) {
	return {
		source: params.scope,
		key: params.key
	};
}
function pickConfiguredList(params) {
	if (Array.isArray(params.agent)) return {
		values: params.agent,
		source: buildSource({
			scope: "agent",
			key: "agents.entries.*.tools.sandbox.tools.allow"
		})
	};
	if (Array.isArray(params.global)) return {
		values: params.global,
		source: buildSource({
			scope: "global",
			key: "tools.sandbox.tools.allow"
		})
	};
	return {
		values: void 0,
		source: buildSource({
			scope: "default",
			key: "tools.sandbox.tools.allow"
		})
	};
}
function pickConfiguredDeny(params) {
	if (Array.isArray(params.agent)) return {
		values: params.agent,
		source: buildSource({
			scope: "agent",
			key: "agents.entries.*.tools.sandbox.tools.deny"
		})
	};
	if (Array.isArray(params.global)) return {
		values: params.global,
		source: buildSource({
			scope: "global",
			key: "tools.sandbox.tools.deny"
		})
	};
	return {
		values: void 0,
		source: buildSource({
			scope: "default",
			key: "tools.sandbox.tools.deny"
		})
	};
}
function pickConfiguredAlsoAllow(params) {
	if (Array.isArray(params.agent)) return {
		values: params.agent,
		source: buildSource({
			scope: "agent",
			key: "agents.entries.*.tools.sandbox.tools.alsoAllow"
		})
	};
	if (Array.isArray(params.global)) return {
		values: params.global,
		source: buildSource({
			scope: "global",
			key: "tools.sandbox.tools.alsoAllow"
		})
	};
	return {
		values: void 0,
		source: void 0
	};
}
function mergeAllowlist(base, extra) {
	if (Array.isArray(base)) {
		if (base.length === 0) return [];
		if (!Array.isArray(extra) || extra.length === 0) return [...base];
		return uniqueStrings([...base, ...extra]);
	}
	if (Array.isArray(extra) && extra.length > 0) return uniqueStrings([...DEFAULT_TOOL_ALLOW, ...extra]);
	return [...DEFAULT_TOOL_ALLOW];
}
function pickAllowSource(params) {
	if (params.allowDefined && params.allow.source === "agent") return params.allow;
	if (params.alsoAllow?.source === "agent") return params.alsoAllow;
	if (params.allowDefined && params.allow.source === "global") return params.allow;
	if (params.alsoAllow?.source === "global") return params.alsoAllow;
	return params.allow;
}
function resolveExplicitSandboxReAllowPatterns(params) {
	return uniqueStrings([...params.allow ?? [], ...params.alsoAllow ?? []]);
}
function filterDefaultDenyForExplicitAllows(params) {
	if (params.explicitAllowPatterns.length === 0) return [...params.deny];
	const allowPatterns = compileGlobPatterns({
		raw: expandToolGroups(params.explicitAllowPatterns),
		normalize: normalizeToolPolicyName
	});
	if (allowPatterns.length === 0) return [...params.deny];
	return params.deny.filter((toolName) => !matchesAnyGlobPattern(normalizeToolPolicyName(toolName), allowPatterns));
}
function expandResolvedPolicy(policy) {
	let expandedDeny = expandToolGroups(policy.deny ?? []);
	let expandedAllow = expandToolGroups(policy.allow ?? []);
	const denyPatterns = compileGlobPatterns({
		raw: expandedDeny,
		normalize: normalizeToolPolicyName
	});
	if (matchesAnyGlobPattern("image", denyPatterns) && !matchesAnyGlobPattern("view_image", denyPatterns)) expandedDeny = [...expandedDeny, "view_image"];
	const expandedDenyLower = expandedDeny.map(normalizeLowercaseStringOrEmpty);
	const expandedAllowLower = expandedAllow.map(normalizeLowercaseStringOrEmpty);
	if (expandedAllow.length > 0 && !expandedDenyLower.includes("view_image") && !expandedAllowLower.includes("view_image")) expandedAllow = [...expandedAllow, "view_image"];
	return {
		allow: expandedAllow,
		deny: expandedDeny
	};
}
function classifyToolAgainstSandboxToolPolicy(name, policy) {
	if (!policy) return {
		blockedByDeny: false,
		blockedByAllow: false
	};
	const normalized = normalizeToolPolicyName(name);
	const blockedByDeny = matchesAnyGlobPattern(normalized, compileGlobPatterns({
		raw: expandToolGroups(policy.deny ?? []),
		normalize: normalizeToolPolicyName
	}));
	const allow = compileGlobPatterns({
		raw: expandToolGroups(policy.allow ?? []),
		normalize: normalizeToolPolicyName
	});
	return {
		blockedByDeny,
		blockedByAllow: !blockedByDeny && allow.length > 0 && !matchesAnyGlobPattern(normalized, allow)
	};
}
function isToolAllowed(policy, name) {
	const { blockedByDeny, blockedByAllow } = classifyToolAgainstSandboxToolPolicy(name, policy);
	return !blockedByDeny && !blockedByAllow;
}
function resolveSandboxToolPolicyForAgent(cfg, agentId) {
	const agentPolicy = (cfg && agentId ? resolveAgentConfig(cfg, agentId) : void 0)?.tools?.sandbox?.tools;
	const globalPolicy = cfg?.tools?.sandbox?.tools;
	const allowConfig = pickConfiguredList({
		agent: agentPolicy?.allow,
		global: globalPolicy?.allow
	});
	const alsoAllowConfig = pickConfiguredAlsoAllow({
		agent: agentPolicy?.alsoAllow,
		global: globalPolicy?.alsoAllow
	});
	const denyConfig = pickConfiguredDeny({
		agent: agentPolicy?.deny,
		global: globalPolicy?.deny
	});
	const explicitAllowPatterns = resolveExplicitSandboxReAllowPatterns({
		allow: allowConfig.values,
		alsoAllow: alsoAllowConfig.values
	});
	const expanded = expandResolvedPolicy({
		allow: mergeAllowlist(allowConfig.values, alsoAllowConfig.values),
		deny: Array.isArray(denyConfig.values) ? [...denyConfig.values] : filterDefaultDenyForExplicitAllows({
			deny: [...DEFAULT_TOOL_DENY],
			explicitAllowPatterns
		})
	});
	return {
		allow: expanded.allow ?? [],
		deny: expanded.deny ?? [],
		sources: {
			allow: pickAllowSource({
				allow: allowConfig.source,
				allowDefined: Array.isArray(allowConfig.values),
				alsoAllow: alsoAllowConfig.source
			}),
			deny: denyConfig.source
		}
	};
}
//#endregion
export { isToolAllowed as n, resolveSandboxToolPolicyForAgent as r, classifyToolAgainstSandboxToolPolicy as t };
