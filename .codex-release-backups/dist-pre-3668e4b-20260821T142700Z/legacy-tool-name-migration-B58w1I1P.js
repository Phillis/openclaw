import { c as isRecord } from "./record-coerce-DItp3I4t.js";
//#region src/commands/doctor/shared/legacy-tool-name-migration.ts
const LEGACY_TASK_SUGGESTION_TOOL_NAME = "spawn_task";
const TASK_SUGGESTION_TOOL_NAME = "suggest_task";
function isLegacyTaskSuggestionToolName(value) {
	return typeof value === "string" && value.trim().toLowerCase() === "spawn_task";
}
function hasLegacyTaskSuggestionToolList(value) {
	return Array.isArray(value) && value.some(isLegacyTaskSuggestionToolName);
}
function migrateLegacyTaskSuggestionToolList(value) {
	if (!Array.isArray(value)) return false;
	let mutated = false;
	for (const [index, entry] of value.entries()) if (isLegacyTaskSuggestionToolName(entry)) {
		value[index] = TASK_SUGGESTION_TOOL_NAME;
		mutated = true;
	}
	return mutated;
}
function isToolPolicyPath(path) {
	if (path.at(-1) === "tools" || path.includes("toolsBySender")) return true;
	const byProviderIndex = path.lastIndexOf("byProvider");
	return byProviderIndex >= 0 && path.slice(0, byProviderIndex).includes("tools");
}
function visitLegacyTaskSuggestionToolNames(value, path, migrate, matchedPaths) {
	if (Array.isArray(value)) {
		for (const [index, entry] of value.entries()) visitLegacyTaskSuggestionToolNames(entry, [...path, String(index)], migrate, matchedPaths);
		return;
	}
	if (!isRecord(value)) return;
	const listKeys = isToolPolicyPath(path) ? [
		"allow",
		"alsoAllow",
		"deny"
	] : [];
	if (Object.hasOwn(value, "toolsAllow")) listKeys.push("toolsAllow");
	for (const key of listKeys) {
		const list = value[key];
		if (!Array.isArray(list) || !list.some(isLegacyTaskSuggestionToolName)) continue;
		matchedPaths.push([...path, key].join("."));
		if (migrate) migrateLegacyTaskSuggestionToolList(list);
	}
	for (const [key, entry] of Object.entries(value)) visitLegacyTaskSuggestionToolNames(entry, [...path, key], migrate, matchedPaths);
}
function findLegacyTaskSuggestionToolPaths(value, path = []) {
	const matchedPaths = [];
	visitLegacyTaskSuggestionToolNames(value, path, false, matchedPaths);
	return matchedPaths;
}
function migrateLegacyTaskSuggestionToolPolicies(value, path = []) {
	const matchedPaths = [];
	visitLegacyTaskSuggestionToolNames(value, path, true, matchedPaths);
	return matchedPaths;
}
//#endregion
export { migrateLegacyTaskSuggestionToolList as a, hasLegacyTaskSuggestionToolList as i, TASK_SUGGESTION_TOOL_NAME as n, migrateLegacyTaskSuggestionToolPolicies as o, findLegacyTaskSuggestionToolPaths as r, LEGACY_TASK_SUGGESTION_TOOL_NAME as t };
