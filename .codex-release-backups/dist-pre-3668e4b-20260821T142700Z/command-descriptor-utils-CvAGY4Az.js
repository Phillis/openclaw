import { t as sanitizeForLog } from "./ansi-9qL8iF9E.js";
//#region src/cli/program/command-descriptor-utils.ts
const SAFE_COMMAND_NAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;
/** Normalize and validate a command descriptor name for safe Commander registration. */
function normalizeCommandDescriptorName(name) {
	const normalized = name.trim();
	return SAFE_COMMAND_NAME_PATTERN.test(normalized) ? normalized : null;
}
function assertSafeCommandDescriptorName(name) {
	const normalized = normalizeCommandDescriptorName(name);
	if (!normalized) throw new Error(`Invalid CLI command name: ${JSON.stringify(name.trim())}`);
	return normalized;
}
/** Strip unsafe terminal content from descriptor descriptions. */
function sanitizeCommandDescriptorDescription(description) {
	return sanitizeForLog(description).trim();
}
/** Return descriptor names in registration order. */
function getCommandDescriptorNames(descriptors) {
	return descriptors.map((descriptor) => descriptor.name);
}
/** Return descriptor names that should remain parent commands with subcommands. */
function getCommandsWithSubcommands(descriptors) {
	return descriptors.filter((descriptor) => descriptor.hasSubcommands).map((descriptor) => descriptor.name);
}
/** Return descriptors whose parent command should show help by default. */
function getParentDefaultHelpCommands(descriptors) {
	return descriptors.filter((descriptor) => descriptor.parentDefaultHelp).map((descriptor) => descriptor.name);
}
/** Merge descriptor groups while keeping the first descriptor for each command name. */
function collectUniqueCommandDescriptors(descriptorGroups) {
	const seen = /* @__PURE__ */ new Set();
	const descriptors = [];
	for (const group of descriptorGroups) for (const descriptor of group) {
		if (seen.has(descriptor.name)) continue;
		seen.add(descriptor.name);
		descriptors.push(descriptor);
	}
	return descriptors;
}
/** Create a descriptor catalog with stable derived lists. */
function defineCommandDescriptorCatalog(descriptors) {
	return {
		descriptors,
		getDescriptors: () => descriptors,
		getNames: () => getCommandDescriptorNames(descriptors),
		getCommandsWithSubcommands: () => getCommandsWithSubcommands(descriptors),
		getParentDefaultHelpCommands: () => getParentDefaultHelpCommands(descriptors)
	};
}
/** Add safe placeholder commands to Commander without duplicating existing command names. */
function addCommandDescriptorsToProgram(program, descriptors, existingCommands = /* @__PURE__ */ new Set()) {
	for (const descriptor of descriptors) {
		const name = assertSafeCommandDescriptorName(descriptor.name);
		if (existingCommands.has(name)) continue;
		program.command(name, { hidden: descriptor.hidden }).description(sanitizeCommandDescriptorDescription(descriptor.description));
		existingCommands.add(name);
	}
	return existingCommands;
}
//#endregion
export { sanitizeCommandDescriptorDescription as a, normalizeCommandDescriptorName as i, collectUniqueCommandDescriptors as n, defineCommandDescriptorCatalog as r, addCommandDescriptorsToProgram as t };
