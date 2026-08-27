import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import "./redact-CWP17HFN.js";
import { o as isPathInsideWithRealpath } from "./path-D138yf8v.js";
import { i as readRegularFileSync } from "./regular-file-Dwz6p59y.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import "./agent-scope-DigoIwHb.js";
import { a as listAgentIds, f as resolveAgentWorkspaceDir } from "./agent-scope-config-CUBiGmG3.js";
import { n as resolveEffectiveAgentSkillFilter } from "./agent-filter-BQrGxhsA.js";
import "./regular-file-C2hsuc07.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { a as readRootJsonObjectSync } from "./json-Dx6zyhjY.js";
import "./json-files-E5e5TtK3.js";
import { l as resolveEffectivePluginActivationState, r as hasExplicitPluginConfig, s as normalizePluginsConfig } from "./config-state-Bgpvw0Q6.js";
import { c as normalizeBundlePathList, n as CLAUDE_BUNDLE_MANIFEST_RELATIVE_PATH, s as mergeBundlePathLists } from "./bundle-manifest-BaJfS3mk.js";
import { t as createDedupeCache } from "./dedupe-C9TI3O0j.js";
import { n as loadPluginManifestRegistryForPluginRegistry } from "./plugin-registry-contributions-JopjOY3b.js";
import { r as logVerbose } from "./globals-GZNLg1ns.js";
import { i as stripFrontmatterBlock, n as parseFrontmatterBlock } from "./frontmatter-4ex1ODAy.js";
import { t as canonicalizePath } from "./paths-Bf0MEhmU.js";
import { i as parseFrontmatterBool } from "./frontmatter-CgDupxio.js";
import { t as getChatCommands } from "./commands-registry.data-D1RtQjvy.js";
import { n as resolveSkillTelemetrySource } from "./source-0ivX3dtK.js";
import { i as isSkillPromptVisible, r as filterUserInvocableSkillEntries } from "./skill-index-kr-4jQSx.js";
import { i as loadWorkspaceSkills, r as loadVisibleSkills, t as filterWorkspaceSkills } from "./workspace-skill-loader-CRn-e6M4.js";
import { n as resolveNodeExecEligibility } from "./exec-defaults-DFjm1Q5i.js";
import { t as getRemoteSkillEligibility } from "./remote-BHibO2zu.js";
import fs from "node:fs";
import path from "node:path";
//#region src/skills/discovery/chat-command-invocation.ts
const MAX_EXPLICIT_SKILL_REFERENCES = 8;
const MAX_EXPLICIT_SKILL_REFERENCE_CHARS = 512;
const MAX_EXPLICIT_SKILL_INSTRUCTION_CHARS = 1e3;
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
function* skillReferenceNames(text) {
	for (const match of skillReferenceMatches(text)) {
		const name = match[1]?.replace(/:+$/gu, "");
		const index = match.index;
		if (name && index !== void 0 && !isEscapedReference(text, index) && !isShellVariableReference(name)) yield name;
	}
}
/** Returns true when text may contain an explicit `$skill-name` reference. */
function hasSkillReferenceCandidate(text) {
	return !skillReferenceNames(text).next().done;
}
/** Resolves explicit `$skill-name` references against the current eligible skill commands. */
function resolveSkillReferenceInvocations(params) {
	const resolved = [];
	const seen = /* @__PURE__ */ new Set();
	for (const name of skillReferenceNames(params.text)) {
		const command = findSkillCommand(params.skillCommands, name);
		if (!command || command.promptTemplate || seen.has(command.name)) continue;
		seen.add(command.name);
		resolved.push(command);
	}
	return resolved;
}
function resolveSkillCommandInvocation(params) {
	const trimmed = params.commandBodyNormalized.trim();
	if (trimmed.startsWith("/")) {
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
		if (command) return {
			command,
			args: match[2]?.trim() || void 0
		};
	}
	return null;
}
function expandBundleCommandPromptTemplate(template, args) {
	const normalizedArgs = args?.trim() ?? "";
	const rendered = template.includes("$ARGUMENTS") ? template.replaceAll("$ARGUMENTS", () => normalizedArgs) : template;
	if (!normalizedArgs || template.includes("$ARGUMENTS")) return rendered.trim();
	return `${rendered.trim()}\n\nUser input:\n${normalizedArgs}`;
}
function resolveExplicitSkillCommands(text, skillCommands) {
	if (!text.trimStart().startsWith("/")) return resolveSkillReferenceInvocations({
		text,
		skillCommands
	});
	const invocation = resolveSkillCommandInvocation({
		commandBodyNormalized: text,
		skillCommands
	});
	return invocation ? [invocation.command] : [];
}
function resolveUnavailableExplicitSkillCommand(params) {
	if (params.text.trimStart().startsWith("/")) {
		if (resolveExplicitSkillCommands(params.text, params.skillCommands).length > 0) return;
		return resolveExplicitSkillCommands(params.text, params.allSkillCommands)[0];
	}
	for (const name of skillReferenceNames(params.text)) {
		if (findSkillCommand(params.skillCommands, name)) continue;
		const unavailable = findSkillCommand(params.allSkillCommands, name);
		if (unavailable) return unavailable;
	}
}
/** Expands model-routed skill references while leaving unknown slash commands untouched. */
function expandExplicitSkillReferences(params) {
	const leadingInvocation = params.text.trimStart().startsWith("/") ? resolveSkillCommandInvocation({
		commandBodyNormalized: params.text,
		skillCommands: params.skillCommands
	}) : null;
	if (leadingInvocation?.command.promptTemplate) return {
		body: expandBundleCommandPromptTemplate(leadingInvocation.command.promptTemplate, leadingInvocation.args),
		skills: [leadingInvocation.command]
	};
	const available = resolveExplicitSkillCommands(params.text, params.skillCommands);
	const allCommands = params.allSkillCommands ?? params.skillCommands;
	const unavailable = allCommands === params.skillCommands ? void 0 : resolveUnavailableExplicitSkillCommand({
		text: params.text,
		skillCommands: params.skillCommands,
		allSkillCommands: allCommands
	});
	const error = unavailable ? `Skill "${unavailable.skillName}" is not available for this agent. Update the skill allowlist or choose an allowed skill.` : available.length > MAX_EXPLICIT_SKILL_REFERENCES ? `Too many skill references. Use at most ${MAX_EXPLICIT_SKILL_REFERENCES} skills in one message.` : void 0;
	return expandResolvedSkillReferences({
		text: params.text,
		skills: available,
		error
	});
}
function expandResolvedSkillReferences(params) {
	const error = params.error ?? (params.skills.length > MAX_EXPLICIT_SKILL_REFERENCES ? `Too many skill references. Use at most ${MAX_EXPLICIT_SKILL_REFERENCES} skills in one message.` : void 0);
	if (error) return {
		body: params.text,
		error,
		skills: []
	};
	if (params.skills.length === 0) return {
		body: params.text,
		skills: []
	};
	const referenceLines = params.skills.map((skill) => skill.modelVisible === false && skill.skillFile ? `- ${skill.skillName} (SKILL.md: ${skill.skillFile})` : `- ${skill.skillName}`);
	if (referenceLines.some((line) => line.length > MAX_EXPLICIT_SKILL_REFERENCE_CHARS)) return {
		body: params.text,
		error: `Skill reference metadata is too long. Keep each rendered reference at ${MAX_EXPLICIT_SKILL_REFERENCE_CHARS} characters or less.`,
		skills: []
	};
	const instructionPrefix = [
		"Use the following explicitly referenced skills for this request. Read each skill's SKILL.md before acting:",
		...referenceLines,
		"",
		"User request:",
		""
	].join("\n");
	if (instructionPrefix.length > MAX_EXPLICIT_SKILL_INSTRUCTION_CHARS) return {
		body: params.text,
		error: "Combined skill reference metadata is too long. Use fewer or shorter skill references.",
		skills: []
	};
	return {
		body: `${instructionPrefix}${params.text}`,
		skills: params.skills
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
	const effectiveSkillFilter = opts?.includeAllowlistHidden ? void 0 : opts?.skillFilter ?? resolveEffectiveAgentSkillFilter(opts?.config, opts?.agentId);
	const userInvocable = filterUserInvocableSkillEntries(opts?.entries ? filterWorkspaceSkills(opts.entries, {
		config: opts?.config,
		skillFilter: effectiveSkillFilter,
		eligibility: opts?.eligibility
	}) : loadVisibleSkills(workspaceDir, {
		config: opts?.config,
		managedSkillsDir: opts?.managedSkillsDir,
		bundledSkillsDir: opts?.bundledSkillsDir,
		skillFilter: effectiveSkillFilter,
		eligibility: opts?.eligibility,
		pluginMetadataSnapshot: opts?.pluginMetadataSnapshot
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
			displayName: entry.skill.displayName ?? rawName,
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
	const eligibility = {
		nodeSkills,
		remote: getRemoteSkillEligibility({ advertiseExecNode: nodeSkills.canExec })
	};
	const entries = params.includeAllowlistHidden ? loadWorkspaceSkills(params.workspaceDir, {
		config: params.cfg,
		eligibility,
		pluginMetadataSnapshot: params.pluginMetadataSnapshot
	}) : void 0;
	return buildWorkspaceSkillCommandSpecs(params.workspaceDir, {
		config: params.cfg,
		agentId: params.agentId,
		skillFilter: params.skillFilter,
		includeAllowlistHidden: params.includeAllowlistHidden,
		eligibility,
		pluginMetadataSnapshot: params.pluginMetadataSnapshot,
		...entries ? { entries } : {},
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
export { hasSkillReferenceCandidate as a, expandExplicitSkillReferences as i, listSkillCommandsForWorkspace as n, listReservedChatSlashCommandNames as o, expandBundleCommandPromptTemplate as r, resolveSkillCommandInvocation as s, listSkillCommandsForAgents as t };
