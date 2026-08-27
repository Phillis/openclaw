//#region src/cli/program/commander-parse-facts.ts
const activeErrorCommandByRoot = /* @__PURE__ */ new WeakMap();
function getCommandHierarchy(command) {
	const hierarchy = [];
	for (let current = command; current; current = current.parent ?? null) hierarchy.unshift(current);
	return hierarchy;
}
function requiresFollowingValue(token, options) {
	if (token.includes("=")) return false;
	const exact = options.find((option) => option.short === token || option.long === token);
	if (exact) return exact.required;
	if (!token.startsWith("-") || token.startsWith("--")) return false;
	const shortGroup = token.slice(1);
	for (let index = 0; index < shortGroup.length; index += 1) {
		const option = options.find((candidate) => candidate.short === `-${shortGroup[index]}`);
		if (!option) return false;
		if (option.required || option.optional) return option.required && index === shortGroup.length - 1;
	}
	return false;
}
/** Return whether Commander consumed one of the supplied argv tokens as a required option value. */
function hasCommanderOptionValue(command, argv, tokens) {
	const hierarchy = getCommandHierarchy(command);
	const args = argv.slice(2);
	let commandIndex = 0;
	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index];
		if (arg === void 0 || arg === "--") break;
		const nextCommand = hierarchy[commandIndex + 1];
		if (nextCommand && (arg === nextCommand.name() || nextCommand.aliases().includes(arg))) {
			commandIndex += 1;
			continue;
		}
		if (requiresFollowingValue(arg, hierarchy[commandIndex]?.options ?? [])) {
			const value = args[index + 1];
			if (value && tokens.has(value)) return true;
			index += 1;
		}
	}
	return false;
}
/** Return the registered command path for the exact Commander node handling an error or action. */
function getCommanderCommandPath(command) {
	const commandPath = [];
	for (let current = command; current?.parent; current = current.parent) commandPath.unshift(current.name());
	return commandPath;
}
function getRootCommand(command) {
	let root = command;
	while (root.parent) root = root.parent;
	return root;
}
/** Scope the exact Commander node synchronously emitting an error. */
function setCommanderErrorCommand(command) {
	const root = getRootCommand(command);
	const previous = activeErrorCommandByRoot.get(root);
	activeErrorCommandByRoot.set(root, command);
	return () => {
		if (previous) activeErrorCommandByRoot.set(root, previous);
		else activeErrorCommandByRoot.delete(root);
	};
}
/** Return the active parse-error path without replacing Commander's configured output handler. */
function getCommanderErrorCommandPath(program) {
	const command = activeErrorCommandByRoot.get(getRootCommand(program));
	return command ? getCommanderCommandPath(command) : void 0;
}
//#endregion
export { setCommanderErrorCommand as i, getCommanderErrorCommandPath as n, hasCommanderOptionValue as r, getCommanderCommandPath as t };
