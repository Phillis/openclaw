import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import "./src-BntaCZM-.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import "./utils-Bw16L5tB.js";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.js";
import { t as getChatCommands } from "./commands-registry.data-D1RtQjvy.js";
//#region src/auto-reply/commands-registry-normalize.ts
/** Normalizes slash-command text aliases and builds command detection caches. */
let cachedRegistryLookup;
const TARGETED_COMMAND_BODY_RE = /^\/([^\s@]+)@([A-Za-z0-9_]+)(?=$|\s|[.!?！？…,，。;；:：'"’”)\]}])([\s\S]*)$/u;
function appendMultilineTail(head, tail, spec) {
	if (!tail) return head;
	if (!spec || spec.command.key === "skill" || spec.command.key === "learn") return `${head}\n${tail}`;
	if (spec.command.key === "reset") {
		const flattened = tail.replace(/\s+/g, " ").trim();
		return flattened ? `${head} ${flattened}` : head;
	}
	return head;
}
function getCommandRegistryLookup() {
	const commands = getChatCommands();
	if (cachedRegistryLookup?.commands === commands) return cachedRegistryLookup;
	const aliases = /* @__PURE__ */ new Map();
	const exact = /* @__PURE__ */ new Set();
	const patterns = [];
	for (const command of commands) {
		const canonical = normalizeOptionalString(command.textAliases[0]) || `/${command.key}`;
		const acceptsArgs = Boolean(command.acceptsArgs);
		for (const alias of command.textAliases) {
			const normalized = normalizeOptionalLowercaseString(alias);
			if (!normalized) continue;
			if (!aliases.has(normalized)) aliases.set(normalized, {
				command,
				canonical,
				acceptsArgs
			});
			exact.add(normalized);
			const escaped = escapeRegExp(normalized);
			patterns.push(acceptsArgs ? `${escaped}(?:\\s+[\\s\\S]+|\\s*:\\s*[\\s\\S]*)?` : `${escaped}(?:\\s*:\\s*)?`);
		}
	}
	cachedRegistryLookup = {
		commands,
		aliases,
		detection: {
			exact,
			regex: patterns.length ? new RegExp(`^(?:${patterns.join("|")})$`, "i") : /$^/
		}
	};
	return cachedRegistryLookup;
}
/** Normalizes command text to canonical aliases, removing bot mentions when appropriate. */
function normalizeCommandBody(raw, options) {
	const trimmed = raw.trim();
	if (!trimmed.startsWith("/")) return trimmed;
	const newline = trimmed.indexOf("\n");
	const singleLine = newline === -1 ? trimmed : trimmed.slice(0, newline).trim();
	const multilineTail = newline === -1 ? void 0 : trimmed.slice(newline + 1).trimStart();
	const colonMatch = singleLine.match(/^\/([^\s:]+)\s*:(.*)$/);
	const normalized = colonMatch ? (() => {
		const [, command, rest] = colonMatch;
		const normalizedRest = expectDefined(rest, "commands registry normalize rest").trimStart();
		return normalizedRest ? `/${command} ${normalizedRest}` : `/${command}`;
	})() : singleLine;
	const normalizedBotUsername = normalizeOptionalLowercaseString(options?.botUsername);
	const mentionMatch = normalized.match(TARGETED_COMMAND_BODY_RE);
	const targetBotUsername = normalizeOptionalLowercaseString(mentionMatch?.[2]);
	const targetMatchesBot = normalizedBotUsername !== void 0 && targetBotUsername === normalizedBotUsername;
	const resolveBeforeIdentity = normalizedBotUsername === void 0 && options?.targetedCommandMode === "pre-identity";
	const commandBody = mentionMatch && (targetMatchesBot || resolveBeforeIdentity) ? `/${mentionMatch[1]}${mentionMatch[3] ?? ""}` : normalized;
	const lowered = normalizeLowercaseStringOrEmpty(commandBody);
	const textAliasMap = getCommandRegistryLookup().aliases;
	const exact = textAliasMap.get(lowered);
	if (exact) return appendMultilineTail(exact.canonical, multilineTail, exact);
	const tokenMatch = commandBody.match(/^\/([^\s]+)(?:\s+([\s\S]+))?$/);
	if (!tokenMatch) return appendMultilineTail(commandBody, multilineTail);
	const [, token, rest] = tokenMatch;
	const tokenKey = `/${normalizeLowercaseStringOrEmpty(token)}`;
	const tokenSpec = textAliasMap.get(tokenKey);
	if (!tokenSpec) return appendMultilineTail(commandBody, multilineTail);
	if (rest && !tokenSpec.acceptsArgs) return commandBody;
	const normalizedRest = rest?.trimStart();
	return appendMultilineTail(normalizedRest ? `${tokenSpec.canonical} ${normalizedRest}` : tokenSpec.canonical, multilineTail, tokenSpec);
}
/** Returns cached exact and regex detectors for the current command registry instance. */
function getCommandDetection(_cfg) {
	return getCommandRegistryLookup().detection;
}
/** Resolves a raw text command to the matching normalized alias when known. */
function maybeResolveTextAlias(raw, cfg) {
	const trimmed = normalizeCommandBody(raw).trim();
	if (!trimmed.startsWith("/")) return null;
	const detection = getCommandDetection(cfg);
	const normalized = normalizeLowercaseStringOrEmpty(trimmed);
	if (detection.exact.has(normalized)) return normalized;
	if (!detection.regex.test(normalized)) return null;
	const tokenMatch = normalized.match(/^\/([^\s:]+)(?:\s|$)/);
	if (!tokenMatch) return null;
	const tokenKey = `/${tokenMatch[1]}`;
	return getCommandRegistryLookup().aliases.has(tokenKey) ? tokenKey : null;
}
/** Resolves a raw text command into its command definition and raw argument tail. */
function resolveTextCommand(raw, cfg) {
	const trimmed = normalizeCommandBody(raw).trim();
	const alias = maybeResolveTextAlias(trimmed, cfg);
	if (!alias) return null;
	const spec = getCommandRegistryLookup().aliases.get(alias);
	if (!spec) return null;
	if (!spec.acceptsArgs) return { command: spec.command };
	const args = trimmed.slice(alias.length).trim();
	return {
		command: spec.command,
		args: args || void 0
	};
}
//#endregion
export { resolveTextCommand as i, maybeResolveTextAlias as n, normalizeCommandBody as r, getCommandDetection as t };
