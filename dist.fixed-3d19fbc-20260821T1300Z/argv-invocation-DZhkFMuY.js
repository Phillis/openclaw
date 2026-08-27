import { O as resolveParentAwareCommandPath, a as getPrimaryCommand, l as isHelpOrVersionInvocation, n as getCommandPathWithRootOptions, u as isRootHelpInvocation } from "./argv-ubyZhwcH.js";
//#region src/cli/argv-invocation.ts
/** Resolves startup policy paths while consuming known parent-command option values. */
function resolveCliStartupCommandPath(argv) {
	return resolveParentAwareCommandPath(argv) ?? getCommandPathWithRootOptions(argv, 2);
}
/** Resolves command path and help/version mode from a raw process argv array. */
function resolveCliArgvInvocation(argv) {
	return {
		argv,
		commandPath: resolveCliStartupCommandPath(argv),
		primary: getPrimaryCommand(argv),
		hasHelpOrVersion: isHelpOrVersionInvocation(argv),
		isRootHelpInvocation: isRootHelpInvocation(argv)
	};
}
//#endregion
export { resolveCliStartupCommandPath as n, resolveCliArgvInvocation as t };
