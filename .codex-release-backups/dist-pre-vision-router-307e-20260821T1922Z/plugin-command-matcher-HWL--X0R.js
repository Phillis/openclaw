import { c as normalizeOptionalLowercaseString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { t as pluginCommandSupportsChannel } from "./plugin-command-metadata-jSFxBwiS.js";
//#region src/plugins/plugin-command-matcher.ts
function listInvocationKeys(command, aliasScope) {
	const keys = /* @__PURE__ */ new Set();
	const add = (value) => {
		const normalized = normalizeOptionalLowercaseString(value);
		if (normalized) keys.add(`/${normalized}`);
	};
	add(command.name);
	if (aliasScope.kind === "all") {
		for (const alias of Object.values(command.nativeNames ?? {})) if (typeof alias === "string") add(alias);
		return [...keys];
	}
	const provider = normalizeOptionalLowercaseString(aliasScope.provider);
	const providerAlias = provider ? command.nativeNames?.[provider] : void 0;
	add(typeof providerAlias === "string" ? providerAlias : command.nativeNames?.default);
	return [...keys];
}
function matchRegisteredPluginCommand(params) {
	const trimmed = params.commandBody.trim();
	if (!trimmed.startsWith("/")) return null;
	const commandMatch = trimmed.match(/^\/\s*([^\s]+)(?:\s+([\s\S]*))?$/);
	if (!commandMatch) return null;
	const key = normalizeLowercaseStringOrEmpty(`/${commandMatch[1]}`);
	const alternateKeys = [key];
	if (key.includes("_")) alternateKeys.push(key.replace(/_/g, "-"));
	if (key.includes("-")) alternateKeys.push(key.replace(/-/g, "_"));
	const command = alternateKeys.map((candidateKey) => params.commands.find((candidate) => pluginCommandSupportsChannel(candidate, params.channel) && listInvocationKeys(candidate, params.aliasScope).includes(candidateKey))).find((candidate) => candidate !== void 0);
	if (!command) return null;
	const args = commandMatch[2]?.trim();
	if (args && !command.acceptsArgs) return null;
	return {
		command,
		args: args || void 0
	};
}
//#endregion
export { matchRegisteredPluginCommand as t };
