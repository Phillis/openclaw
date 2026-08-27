import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import "./redact-Cl7lwBnl.js";
import { o as isPathInsideWithRealpath } from "./path-D138yf8v.js";
import { i as readRegularFileSync } from "./regular-file-CXw3t-8J.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import "./agent-scope-BizOtGGz.js";
import { a as listAgentIds, d as resolveAgentWorkspaceDir } from "./agent-scope-config-BdXMWufB.js";
import { n as resolveEffectiveAgentSkillFilter } from "./agent-filter-DTbxyJ2D.js";
import "./regular-file-C2hsuc07.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { a as readRootJsonObjectSync } from "./json-BE1X9L-o.js";
import "./json-files-C6dF5uZO.js";
import { l as resolveEffectivePluginActivationState, r as hasExplicitPluginConfig, s as normalizePluginsConfig } from "./config-state-CpuWFwzR.js";
import { c as normalizeBundlePathList, n as CLAUDE_BUNDLE_MANIFEST_RELATIVE_PATH, s as mergeBundlePathLists } from "./bundle-manifest-BxBJbko_.js";
import { t as createDedupeCache } from "./dedupe-C5V_sRWr.js";
import { n as loadPluginManifestRegistryForPluginRegistry } from "./plugin-registry-contributions-Dt1rr-bF.js";
import { r as logVerbose } from "./globals-CAwGc4B6.js";
import { i as stripFrontmatterBlock, n as parseFrontmatterBlock } from "./frontmatter-4ex1ODAy.js";
import { i as isSkillPromptVisible, o as canonicalizePath, r as filterUserInvocableSkillEntries } from "./skill-index-CEvOAhOd.js";
import { i as parseFrontmatterBool } from "./frontmatter-CgDupxio.js";
import { n as resolveSkillTelemetrySource } from "./source-BBJAIIqh.js";
import { t as getChatCommands } from "./commands-registry.data-DFNdfIjj.js";
import { n as loadVisibleSkills, t as filterWorkspaceSkills } from "./workspace-skill-loader-Cv5Ol3Y8.js";
import { n as resolveNodeExecEligibility } from "./exec-defaults-BaiESr_l.js";
import { t as getRemoteSkillEligibility } from "./remote-DxaHmq2z.js";
import fs from "node:fs";
import path from "node:path";
//#region src/skills/discovery/chat-command-invocation.ts
/** Lists slash command names reserved by built-in chat commands and callers. */
function listReservedChatSlashCommandNames(extraNames = []) {
	const reserved = /* @__PURE__ */ new Set();
	for (const command of getChatCommands()) {
		if (command.nativeName) reserved.add(normalizeOptionalLowercaseString(command.nativeName) ?? "");
		for (const alias of command.textAliases) {
			const trimmed = alias.trim();
			if (!trimmed.startsWith("/")) continue;
			reserved.add(normalizeLowercaseStringOrEmpty(trimmed.slice(1)));
		}
	}
	for (const name of extraNames) {
		const trimmed = normalizeOptionalLowercaseString(name);
		if (trimmed) reserved.add(trimmed);
	}
	return reserved;
}
function normalizeSkillCommandLookup(value) {
	return (normalizeOptionalLowercaseString(value) ?? "").replace(/[\s_]+/g, "-");
}
function findSkillCommand(skillCommands, rawName) {
	const trimmed = rawName.trim();
	if (!trimmed) return;
	const lowered = normalizeOptionalLowercaseString(trimmed) ?? "";
	const normalized = normalizeSkillCommandLookup(trimmed);
	return skillCommands.find((entry) => {
		if (normalizeOptionalLowercaseString(entry.name) === lowered) return true;
		if (normalizeOptionalLowercaseString(entry.skillName) === lowered) return true;
		return normalizeSkillCommandLookup(entry.name) === normalized || normalizeSkillCommandLookup(entry.skillName) === normalized;
	});
}
function skillReferenceMatches(text) {
	return text.matchAll(/\$([-a-zA-Z0-9_:]+)/gu);
}
function isEscapedReference(text, index) {
	let backslashes = 0;
	for (let cursor = index - 1; cursor >= 0 && text[cursor] === "\\"; cursor -= 1) backslashes += 1;
	return backslashes % 2 === 1;
}
function isShellVariableReference(name) {
	return !/[a-z]/u.test(name);
}
/** Returns true when text may contain an explicit `$skill-name` reference. */
function hasSkillReferenceCandidate(text) {
	for (const match of skillReferenceMatches(text)) {
		const name = match[1]?.replace(/:+$/gu, "");
		const index = match.index;
		if (name && index !== void 0 && !isEscapedReference(text, index) && !isShellVariableReference(name)) return true;
	}
	return false;
}
/** Resolves explicit `$skill-name` references against the current eligible skill commands. */
function resolveSkillReferenceInvocations(params) {
	const resolved = [];
	const seen = /* @__PURE__ */ new Set();
	for (const match of skillReferenceMatches(params.text)) {
		const name = match[1]?.replace(/:+$/gu, "");
		const index = match.index;
		if (!name || index === void 0 || isEscapedReference(params.text, index) || isShellVariableReference(name)) continue;
		const command = findSkillCommand(params.skillCommands, name);
		if (!command || seen.has(command.name)) continue;
		seen.add(command.name);
		resolved.push(command);
	}
	return resolved;
}
function resolveSkillCommandInvocation(params) {
	const trimmed = params.commandBodyNormalized.trim();
	if (!trimmed.startsWith("/")) return null;
	const match = trimmed.match(/^\/([^\s]+)(?:\s+([\s\S]+))?$/);
	if (!match) return null;
	const commandName = normalizeOptionalLowercaseString(match[1]);
	if (!commandName) return null;
	if (commandName === "skill") {
		const remainder = match[2]?.trim();
		if (!remainder) return null;
		const skillMatch = remainder.match(/^([^\s]+)(?:\s+([\s\S]+))?$/);
		if (!skillMatch) return null;
		const skillCommand = findSkillCommand(params.skillCommands, skillMatch[1] ?? "");
		if (!skillCommand) return null;
		return {
			command: skillCommand,
			args: skillMatch[2]?.trim() || void 0
		};
	}
	const command = params.skillCommands.find((entry) => normalizeOptionalLowercaseString(entry.name) === commandName);
	if (!command) return null;
	return {
		command,
		args: match[2]?.trim() || void 0
	};
}
//#endregion
//#region src/plugins/bundle-commands.ts
const BUNDLE_COMMAND_MAX_BYTES = 1 * 1024 * 1024;
const log = createSubsystemLogger("plugins/bundle-commands");
function readClaudeBundleManifest(rootDir) {
	const result = readRootJsonObjectSync({
		rootDir,
		relativePath: CLAUDE_BUNDLE_MANIFEST_RELATIVE_PATH,
		boundaryLabel: "plugin root",
		rejectHardlinks: true
	});
	return result.ok ? result.value : {};
}
function resolveClaudeCommandRootDirs(rootDir) {
	const declared = normalizeBundlePathList(readClaudeBundleManifest(rootDir).commands);
	return mergeBundlePathLists(fs.existsSync(path.join(rootDir, "commands")) ? ["commands"] : [], declared);
}
function listMarkdownFilesRecursive(rootDir) {
	const pending = [rootDir];
	const files = [];
	while (pending.length > 0) {
		const current = pending.pop();
		if (!current) continue;
		let entries;
		try {
			entries = fs.readdirSync(current, { withFileTypes: true });
		} catch {
			continue;
		}
		for (const entry of entries) {
			if (entry.name.startsWith(".")) continue;
			const fullPath = path.join(current, entry.name);
			if (entry.isDirectory()) {
				pending.push(fullPath);
				continue;
			}
			if (entry.isFile() && normalizeOptionalLowercaseString(entry.name)?.endsWith(".md")) files.push(fullPath);
		}
	}
	return files.toSorted((a, b) => a.localeCompare(b));
}
function toDefaultCommandName(rootDir, filePath) {
	return path.relative(rootDir, filePath).replace(/\.[^.]+$/u, "").split(path.sep).join(":");
}
function toDefaultDescription(rawName, promptTemplate) {
	return promptTemplate.split(/\r?\n/u).map((line) => line.trim()).find(Boolean) || rawName;
}
function loadBundleCommandsFromRoot(params) {
	const entries = [];
	for (const filePath of listMarkdownFilesRecursive(params.commandRoot)) {
		let raw;
		try {
			raw = readRegularFileSync({
				filePath,
				maxBytes: BUNDLE_COMMAND_MAX_BYTES
			}).buffer.toString("utf-8");
		} catch (error) {
			log.warn(`skipping unreadable bundle command file ${filePath}: ${formatErrorMessage(error)}`);
			continue;
		}
		const frontmatter = parseFrontmatterBlock(raw);
		if (!parseFrontmatterBool(frontmatter["user-invocable"], true)) continue;
		const promptTemplate = stripFrontmatterBlock(raw);
		if (!promptTemplate) continue;
		const rawName = normalizeOptionalString(frontmatter.name) || toDefaultCommandName(params.commandRoot, filePath);
		if (!rawName) continue;
		const description = normalizeOptionalString(frontmatter.description) || toDefaultDescription(rawName, promptTemplate);
		entries.push({
			pluginId: params.pluginId,
			rawName,
			description,
			promptTemplate,
			sourceFilePath: filePath
		});
	}
	return entries;
}
function loadEnabledClaudeBundleCommands(params) {
	if (!hasExplicitPluginConfig(params.cfg?.plugins)) return [];
	const registry = loadPluginManifestRegistryForPluginRegistry({
		workspaceDir: params.workspaceDir,
		config: params.cfg,
		includeDisabled: true
	});
	const normalizedPlugins = normalizePluginsConfig(params.cfg?.plugins);
	const commands = [];
	for (const record of registry.plugins) {
		if (record.format !== "bundle" || record.bundleFormat !== "claude" || !(record.bundleCapabilities ?? []).includes("commands")) continue;
		if (!resolveEffectivePluginActivationState({
			id: record.id,
			origin: record.origin,
			config: normalizedPlugins,
			rootConfig: params.cfg
		}).activated) continue;
		for (const relativeRoot of resolveClaudeCommandRootDirs(record.rootDir)) {
			const commandRoot = path.resolve(record.rootDir, relativeRoot);
			if (!fs.existsSync(commandRoot)) continue;
			if (!isPathInsideWithRealpath(record.rootDir, commandRoot, { requireRealpath: true })) continue;
			commands.push(...loadBundleCommandsFromRoot({
				pluginId: record.id,
				commandRoot
			}));
		}
	}
	return commands;
}
//#endregion
//#region src/skills/discovery/command-specs.ts
const skillsLogger = createSubsystemLogger("skills");
const skillCommandDebugOnce = createDedupeCache({
	ttlMs: 0,
	maxSize: 1024
});
const SKILL_COMMAND_MAX_LENGTH = 32;
const SKILL_COMMAND_FALLBACK = "skill";
function debugSkillCommandOnce(messageKey, message, meta) {
	if (skillCommandDebugOnce.check(messageKey)) return;
	skillsLogger.debug(message, meta);
}
function traceSkillCommandOnce(messageKey, message, meta) {
	if (skillCommandDebugOnce.check(messageKey)) return;
	skillsLogger.trace(message, meta);
}
function sanitizeSkillCommandName(raw) {
	return normalizeLowercaseStringOrEmpty(raw).replace(/[^a-z0-9_]+/g, "_").replace(/_+/g, "_").replace(/^_+|_+$/g, "").slice(0, SKILL_COMMAND_MAX_LENGTH) || SKILL_COMMAND_FALLBACK;
}
function resolveUniqueSkillCommandName(base, used) {
	const normalizedBase = normalizeLowercaseStringOrEmpty(base);
	if (!used.has(normalizedBase)) return base;
	for (let index = 2; index < 1e3; index += 1) {
		const suffix = `_${index}`;
		const maxBaseLength = Math.max(1, SKILL_COMMAND_MAX_LENGTH - suffix.length);
		const candidate = `${base.slice(0, maxBaseLength)}${suffix}`;
		const candidateKey = normalizeLowercaseStringOrEmpty(candidate);
		if (!used.has(candidateKey)) return candidate;
	}
	return `${base.slice(0, Math.max(1, SKILL_COMMAND_MAX_LENGTH - 2))}_x`;
}
/** Builds user-invocable slash command specs for visible workspace skills. */
function buildWorkspaceSkillCommandSpecs(workspaceDir, opts) {
	const effectiveSkillFilter = opts?.skillFilter ?? resolveEffectiveAgentSkillFilter(opts?.config, opts?.agentId);
	const userInvocable = filterUserInvocableSkillEntries(opts?.entries ? filterWorkspaceSkills(opts.entries, {
		config: opts?.config,
		skillFilter: effectiveSkillFilter,
		eligibility: opts?.eligibility
	}) : loadVisibleSkills(workspaceDir, {
		config: opts?.config,
		managedSkillsDir: opts?.managedSkillsDir,
		bundledSkillsDir: opts?.bundledSkillsDir,
		skillFilter: effectiveSkillFilter,
		eligibility: opts?.eligibility
	}));
	const used = /* @__PURE__ */ new Set();
	for (const reserved of opts?.reservedNames ?? []) used.add(normalizeLowercaseStringOrEmpty(reserved));
	const specs = [];
	for (const entry of userInvocable) {
		const rawName = entry.skill.name;
		const base = sanitizeSkillCommandName(rawName);
		if (base !== rawName) traceSkillCommandOnce(`sanitize:${rawName}:${base}`, `Sanitized skill command name "${rawName}" to "/${base}".`, {
			rawName,
			sanitized: `/${base}`
		});
		const unique = resolveUniqueSkillCommandName(base, used);
		if (unique !== base) traceSkillCommandOnce(`dedupe:${rawName}:${unique}`, `De-duplicated skill command name for "${rawName}" to "/${unique}".`, {
			rawName,
			deduped: `/${unique}`
		});
		used.add(normalizeLowercaseStringOrEmpty(unique));
		const description = entry.skill.description?.trim() || rawName;
		const dispatch = entry.disableCommandDispatch ? void 0 : (() => {
			const kindRaw = normalizeLowercaseStringOrEmpty(entry.frontmatter?.["command-dispatch"] ?? entry.frontmatter?.["command_dispatch"] ?? "");
			if (!kindRaw || kindRaw !== "tool") return;
			const toolName = (entry.frontmatter?.["command-tool"] ?? entry.frontmatter?.["command_tool"] ?? "").trim();
			if (!toolName) {
				debugSkillCommandOnce(`dispatch:missingTool:${rawName}`, `Skill command "/${unique}" requested tool dispatch but did not provide command-tool. Ignoring dispatch.`, {
					skillName: rawName,
					command: unique
				});
				return;
			}
			const argModeRaw = normalizeOptionalLowercaseString(entry.frontmatter?.["command-arg-mode"] ?? entry.frontmatter?.["command_arg_mode"] ?? "");
			if (!(!argModeRaw || argModeRaw === "raw" ? "raw" : null)) debugSkillCommandOnce(`dispatch:badArgMode:${rawName}:${argModeRaw}`, `Skill command "/${unique}" requested tool dispatch but has unknown command-arg-mode. Falling back to raw.`, {
				skillName: rawName,
				command: unique,
				argMode: argModeRaw
			});
			return {
				kind: "tool",
				toolName,
				argMode: "raw"
			};
		})();
		specs.push({
			name: unique,
			skillFile: canonicalizePath(entry.skill.filePath),
			skillName: rawName,
			description,
			modelVisible: isSkillPromptVisible(entry),
			skillSource: resolveSkillTelemetrySource(entry.skill),
			...dispatch ? { dispatch } : {}
		});
	}
	const bundleCommands = loadEnabledClaudeBundleCommands({
		workspaceDir,
		cfg: opts?.config
	});
	for (const entry of bundleCommands) {
		const base = sanitizeSkillCommandName(entry.rawName);
		if (base !== entry.rawName) debugSkillCommandOnce(`bundle-sanitize:${entry.rawName}:${base}`, `Sanitized bundle command name "${entry.rawName}" to "/${base}".`, {
			rawName: entry.rawName,
			sanitized: `/${base}`
		});
		const unique = resolveUniqueSkillCommandName(base, used);
		if (unique !== base) debugSkillCommandOnce(`bundle-dedupe:${entry.rawName}:${unique}`, `De-duplicated bundle command name for "${entry.rawName}" to "/${unique}".`, {
			rawName: entry.rawName,
			deduped: `/${unique}`
		});
		used.add(normalizeLowercaseStringOrEmpty(unique));
		specs.push({
			name: unique,
			skillName: entry.rawName,
			description: entry.description,
			modelVisible: false,
			promptTemplate: entry.promptTemplate,
			sourceFilePath: entry.sourceFilePath
		});
	}
	return specs;
}
//#endregion
//#region src/skills/discovery/chat-commands.ts
function listSkillCommandsForWorkspace(params) {
	const nodeSkills = resolveNodeExecEligibility({
		cfg: params.cfg,
		agentId: params.agentId,
		sessionEntry: params.sessionEntry,
		sessionKey: params.sessionKey,
		execOverrides: params.execOverrides
	});
	return buildWorkspaceSkillCommandSpecs(params.workspaceDir, {
		config: params.cfg,
		agentId: params.agentId,
		skillFilter: params.skillFilter,
		eligibility: {
			nodeSkills,
			remote: getRemoteSkillEligibility({ advertiseExecNode: nodeSkills.canExec })
		},
		reservedNames: listReservedChatSlashCommandNames()
	});
}
function dedupeBySkillName(commands) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const cmd of commands) {
		const key = normalizeOptionalLowercaseString(cmd.skillName);
		if (key && seen.has(key)) continue;
		if (key) seen.add(key);
		out.push(cmd);
	}
	return out;
}
function listSkillCommandsForAgents(params) {
	const agentIds = params.agentIds ?? listAgentIds(params.cfg);
	const used = listReservedChatSlashCommandNames();
	const entries = [];
	const hasSingleAgentContext = agentIds.length === 1;
	const workspaceAgents = [];
	for (const agentId of agentIds) {
		const workspaceDir = resolveAgentWorkspaceDir(params.cfg, agentId);
		if (!fs.existsSync(workspaceDir)) {
			logVerbose(`Skipping agent "${agentId}": workspace does not exist: ${workspaceDir}`);
			continue;
		}
		try {
			fs.realpathSync(workspaceDir);
		} catch {
			logVerbose(`Skipping agent "${agentId}": cannot resolve workspace: ${workspaceDir}`);
			continue;
		}
		workspaceAgents.push({
			agentId,
			workspaceDir,
			skillFilter: resolveEffectiveAgentSkillFilter(params.cfg, agentId)
		});
	}
	for (const { agentId, workspaceDir, skillFilter } of workspaceAgents) {
		const nodeSkills = resolveNodeExecEligibility({
			cfg: params.cfg,
			agentId,
			...hasSingleAgentContext ? {
				sessionEntry: params.sessionEntry,
				sessionKey: params.sessionKey,
				execOverrides: params.execOverrides
			} : {}
		});
		const commands = buildWorkspaceSkillCommandSpecs(workspaceDir, {
			config: params.cfg,
			agentId,
			skillFilter,
			eligibility: {
				nodeSkills,
				remote: getRemoteSkillEligibility({ advertiseExecNode: nodeSkills.canExec })
			},
			reservedNames: used
		});
		for (const command of commands) {
			used.add(normalizeLowercaseStringOrEmpty(command.name));
			entries.push(command);
		}
	}
	return dedupeBySkillName(entries).toSorted((left, right) => left.skillName.localeCompare(right.skillName, "en"));
}
//#endregion
export { resolveSkillCommandInvocation as a, listReservedChatSlashCommandNames as i, listSkillCommandsForWorkspace as n, resolveSkillReferenceInvocations as o, hasSkillReferenceCandidate as r, listSkillCommandsForAgents as t };
