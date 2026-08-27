import { n as matchesAnyGlobPattern, t as compileGlobPatterns } from "./glob-pattern-CrqljM7B.js";
import { _ as readToolAllowlistIntersection, g as normalizeToolPolicyName, m as expandToolGroups } from "./tool-policy-CWmnHLY1.js";
//#region src/agents/tool-policy-match.ts
/**
* Runtime matcher for sandbox tool policies. Deny patterns always win, then
* an empty allow list means "allow everything not denied".
*/
function makeToolPolicyMatcher(policy) {
	const deny = compileGlobPatterns({
		raw: expandToolGroups(policy.deny ?? []),
		normalize: normalizeToolPolicyName
	});
	const allow = compileGlobPatterns({
		raw: expandToolGroups(policy.allow ?? []),
		normalize: normalizeToolPolicyName
	});
	return (name) => {
		const normalized = normalizeToolPolicyName(name);
		if (matchesAnyGlobPattern(normalized, deny)) return false;
		if (allow.length === 0) return true;
		if (matchesAnyGlobPattern(normalized, allow)) return true;
		if (normalized === "apply_patch" && matchesAnyGlobPattern("write", allow)) return true;
		return false;
	};
}
/** Return whether one tool name is allowed by a single sandbox policy. */
function isToolAllowedByPolicyName(name, policy) {
	if (!policy) return true;
	return makeToolPolicyMatcher(policy)(name);
}
/** Runtime caps deny empty lists and preserve every independently merged restriction. */
function isRuntimeToolAllowed(name, toolsAllow) {
	return toolsAllow === void 0 || (readToolAllowlistIntersection(toolsAllow) ?? [toolsAllow]).every((allow) => allow.length > 0 && isToolAllowedByPolicyName(name, { allow }));
}
/** Return whether one tool name is allowed by every active sandbox policy. */
function isToolAllowedByPolicies(name, policies) {
	return policies.every((policy) => isToolAllowedByPolicyName(name, policy));
}
//#endregion
export { isToolAllowedByPolicies as n, isToolAllowedByPolicyName as r, isRuntimeToolAllowed as t };
