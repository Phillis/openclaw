import { _ as resolvePrimaryStringValue } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import "./redact-Cl7lwBnl.js";
import "./utils-DEqefz4f.js";
import { t as CONFIG_PATH } from "./paths-CqeDjSA4.js";
import { r as resolveAgentModelFallbackValues } from "./model-input-ekSMR50U.js";
import { t as OpenClawSchema } from "./zod-schema-CLzqhoa9.js";
import "./config-Dl8DJbzM.js";
import { t as note } from "./note-D7f3pYFE.js";
import path from "node:path";
//#region src/commands/doctor-config-analysis.ts
/** Doctor analysis helpers for config schema cleanup and ambiguous model fallback shapes. */
function normalizeIssuePath(pathValue) {
	return pathValue.filter((part) => typeof part !== "symbol");
}
function isUnrecognizedKeysIssue(issue) {
	return issue.code === "unrecognized_keys";
}
/** Formats a parsed config issue path into a user-facing dotted path. */
function formatConfigKeyPath(parts) {
	if (parts.length === 0) return "<root>";
	let out = "";
	for (const part of parts) {
		if (typeof part === "number") {
			out += `[${part}]`;
			continue;
		}
		out = out ? `${out}.${part}` : part;
	}
	return out || "<root>";
}
/** Resolves a config path against a loose config tree, returning null for invalid traversal. */
function resolveConfigPathTarget(root, pathLocal) {
	let current = root;
	for (const part of pathLocal) {
		if (typeof part === "number") {
			if (!Array.isArray(current)) return null;
			if (part < 0 || part >= current.length) return null;
			current = current[part];
			continue;
		}
		if (!current || typeof current !== "object" || Array.isArray(current)) return null;
		const record = current;
		if (!(part in record)) return null;
		current = record[part];
	}
	return current;
}
function isUpdateInProgress() {
	const value = process.env.OPENCLAW_UPDATE_IN_PROGRESS;
	return value === "1" || value === "true";
}
const STRIP_PROTECTED_KEYS = { plugins: /* @__PURE__ */ new Set(["installs"]) };
/**
* Removes unknown config keys reported by schema validation, except protected migration keys.
*
* Doctor skips this while an update is in progress so partially written upgrade state is not
* stripped before its migration can finish.
*/
function stripUnknownConfigKeys(config) {
	if (isUpdateInProgress()) return {
		config,
		removed: []
	};
	const parsed = OpenClawSchema.safeParse(config);
	if (parsed.success) return {
		config,
		removed: []
	};
	const next = structuredClone(config);
	const removed = [];
	for (const issue of parsed.error.issues) {
		if (!isUnrecognizedKeysIssue(issue)) continue;
		const issuePath = normalizeIssuePath(issue.path);
		const target = resolveConfigPathTarget(next, issuePath);
		if (!target || typeof target !== "object" || Array.isArray(target)) continue;
		const record = target;
		const parentKey = issuePath.length === 1 && typeof issuePath[0] === "string" ? issuePath[0] : void 0;
		const protectedSet = issuePath.length === 0 ? void 0 : parentKey ? STRIP_PROTECTED_KEYS[parentKey] : void 0;
		for (const key of issue.keys) {
			if (typeof key !== "string" || !(key in record)) continue;
			if (key === "$include") continue;
			if (protectedSet?.has(key)) continue;
			delete record[key];
			removed.push(formatConfigKeyPath([...issuePath, key]));
		}
	}
	return {
		config: next,
		removed
	};
}
/** Warns when legacy OpenCode overrides shadow an active plugin-provided catalog. */
function noteOpencodeProviderOverrides(cfg, options = {}) {
	const providers = cfg.models?.providers;
	if (!providers) return;
	const overrides = [];
	if (options.opencodePluginActive === true && providers.opencode) overrides.push("opencode");
	if (options.opencodePluginActive === true && providers["opencode-zen"]) overrides.push("opencode-zen");
	if (options.opencodeGoPluginActive === true && providers["opencode-go"]) overrides.push("opencode-go");
	if (overrides.length === 0) return;
	const lines = overrides.flatMap((id) => {
		const providerLabel = id === "opencode-go" ? "OpenCode Go" : "OpenCode Zen";
		const providerEntry = providers[id];
		const api = isRecord(providerEntry) && typeof providerEntry.api === "string" ? providerEntry.api : void 0;
		return [`- models.providers.${id} is set; this overrides the plugin-provided ${providerLabel} catalog.`, api ? `- models.providers.${id}.api=${api}` : null].filter((line) => Boolean(line));
	});
	lines.push("- Remove these entries to restore per-model API routing + costs (then re-run setup if needed).");
	note(lines.join("\n"), "OpenCode");
}
function isImplicitFallbackClobber(model) {
	const primary = resolvePrimaryStringValue(model);
	if (typeof model === "string") return primary !== void 0;
	if (model !== null && typeof model === "object" && !Array.isArray(model)) {
		const obj = model;
		return Object.hasOwn(obj, "primary") && !Object.hasOwn(obj, "fallbacks") && primary !== void 0;
	}
	return false;
}
/** Collects warnings for agent model shapes that unintentionally drop default fallbacks. */
function collectImplicitFallbackClobberWarnings(cfg) {
	const defaultFallbacks = resolveAgentModelFallbackValues(cfg.agents?.defaults?.model);
	if (defaultFallbacks.length === 0) return [];
	const warnings = [];
	const agents = Array.isArray(cfg.agents?.list) ? cfg.agents.list : [];
	for (const [index, agent] of agents.entries()) {
		if (!agent || !isImplicitFallbackClobber(agent.model)) continue;
		const id = typeof agent.id === "string" && agent.id.trim() ? agent.id.trim() : String(index);
		const primary = resolvePrimaryStringValue(agent.model);
		const location = `agents.list[${index}].model (id=${id})`;
		const modelStr = typeof agent.model === "string" ? `"${agent.model}"` : `{ primary: "${primary}" }`;
		const shape = typeof agent.model === "string" ? "bare string with no fallbacks" : "object with no explicit \"fallbacks\" key";
		warnings.push([`- ${location} is ${modelStr}, a ${shape}. At runtime this clobbers agents.defaults.model.fallbacks (${defaultFallbacks.join(", ")}), leaving the agent with no fallbacks.`, `  Fix: add "fallbacks": [...] to inherit or override, or "fallbacks": [] to explicitly disable.`].join("\n"));
	}
	return warnings;
}
/** Emits doctor notes for model fallback clobber warnings. */
function noteImplicitFallbackClobberWarnings(cfg) {
	const warnings = collectImplicitFallbackClobberWarnings(cfg);
	if (warnings.length === 0) return;
	note(warnings.join("\n"), "Doctor warnings");
}
/** Emits a config include warning when an include path escapes the config directory. */
function noteIncludeConfinementWarning(snapshot) {
	const includeIssue = (snapshot.issues ?? []).find((issue) => issue.message.includes("Include path escapes config directory") || issue.message.includes("Include path resolves outside config directory"));
	if (!includeIssue) return;
	note([
		`- $include paths must stay under: ${path.dirname(snapshot.path ?? CONFIG_PATH)}`,
		"- Move shared include files under that directory and update to relative paths like \"./shared/common.json\".",
		`- Error: ${includeIssue.message}`
	].join("\n"), "Doctor warnings");
}
/** Warns when a trusted-proxy gateway has no public sandbox origin for widget/MCP-app frames. */
function noteSandboxOriginProxyWarning(cfg) {
	if (cfg.gateway?.auth?.mode !== "trusted-proxy" || cfg.mcp?.apps?.sandboxOrigin) return;
	note([
		"- gateway.auth.mode is \"trusted-proxy\" but mcp.apps.sandboxOrigin is not set.",
		"  Dashboard widgets and MCP apps render from a separate sandbox listener (gateway port + 1). If your proxy or tunnel does not also route that port, widget frames cannot load.",
		"  Check: either route the sandbox port through your proxy, or set mcp.apps.sandboxOrigin to a dedicated public origin routed to the sandbox listener (see the MCP Apps section of docs/cli/mcp.md)."
	].join("\n"), "Doctor warnings");
}
/** Warns when per-requester MCP OAuth cannot build a public callback URL. */
function noteMcpOriginWarning(cfg) {
	if (!Object.values(cfg.mcp?.servers ?? {}).some((server) => server.oauth?.identity === "per-requester") || cfg.gateway?.publicOrigin) return;
	note(["- An MCP server uses oauth.identity \"per-requester\", but gateway.publicOrigin is not set.", "  Set gateway.publicOrigin to the externally reachable Gateway origin so senders can complete MCP sign-in."].join("\n"), "Doctor warnings");
}
//#endregion
export { noteOpencodeProviderOverrides as a, stripUnknownConfigKeys as c, noteMcpOriginWarning as i, noteImplicitFallbackClobberWarnings as n, noteSandboxOriginProxyWarning as o, noteIncludeConfinementWarning as r, resolveConfigPathTarget as s, formatConfigKeyPath as t };
