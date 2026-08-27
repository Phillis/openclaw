import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BBjU-hqW.js";
import { c as tryReadJson, u as writeJson } from "./json-BE1X9L-o.js";
import "./json-files-C6dF5uZO.js";
import { t as applyMergePatch } from "./merge-patch-CQFyXoKe.js";
import { t as extractMcpServerMap } from "./bundle-mcp-Biidb2Hy.js";
import { n as prepareOwnedBundleMcpDataDirs, r as toCliBundleMcpServerConfig, t as loadMergedBundleMcpConfig } from "./bundle-mcp-config-C-CeqUb2.js";
import { r as resolveMcpBearerBundleConfig } from "./mcp-auth-profile-BwVBXoqo.js";
import { a as decodeHeaderEnvPlaceholder, o as normalizeBundleMcpServerConfig, s as normalizeMcpStringRecord } from "./codex-mcp-config-pxQlYm8A.js";
import { r as injectCodexMcpConfigArgs } from "./bundle-mcp-codex-DG1rYuI0.js";
import { n as OPENCLAW_TOOLS_MCP_SYSTEM_AGENT_PROPOSAL_ENV, t as OPENCLAW_TOOLS_MCP_SYSTEM_AGENT_APPROVAL_ARMED_ENV } from "./openclaw-tools-serve-config-CPi0gqnN.js";
import { r as cliBackendLog } from "./log-ClSqV59J.js";
import crypto from "node:crypto";
import { accessSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region src/agents/cli-runner/bundle-mcp-runtime.ts
function injectBundleMcpBackendArgs(backend, inject) {
	return {
		...backend,
		args: inject(backend.args),
		resumeArgs: inject(backend.resumeArgs ?? backend.args ?? [])
	};
}
async function writeTemporaryBundleMcpJson(prefix, value, fileName = "settings.json", atomic = true) {
	const tempDir = await fs$1.mkdtemp(path.join(os.tmpdir(), prefix));
	const filePath = path.join(tempDir, fileName);
	if (atomic) await writeJson(filePath, value, { trailingNewline: true });
	else await fs$1.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf-8");
	return {
		filePath,
		cleanup: () => fs$1.rm(tempDir, {
			recursive: true,
			force: true
		})
	};
}
function withOpenClawMcpCaptureHeader(config, captureKey, missingServerError) {
	const mcpServers = isRecord(config.mcpServers) ? config.mcpServers : {};
	if (!(isRecord(mcpServers.openclaw) ? mcpServers.openclaw : void 0) && missingServerError) throw new Error(missingServerError);
	return applyMergePatch(config, { mcpServers: { openclaw: { headers: { "x-openclaw-cli-capture-key": captureKey } } } });
}
//#endregion
//#region src/agents/cli-runner/bundle-mcp-claude.ts
/**
* Claude CLI argument helpers for OpenClaw-managed bundle MCP config.
*/
/** Find existing Claude `--mcp-config` argument values. */
function findClaudeMcpConfigPaths(args) {
	const paths = [];
	if (!args?.length) return paths;
	for (let i = 0; i < args.length; i += 1) {
		const arg = args[i] ?? "";
		if (arg === "--mcp-config") {
			while (typeof args[i + 1] === "string" && !args[i + 1]?.startsWith("-")) {
				i += 1;
				const path = normalizeOptionalString(args[i]);
				if (path) paths.push(path);
			}
			continue;
		}
		if (arg.startsWith("--mcp-config=")) {
			const path = normalizeOptionalString(arg.slice(13));
			if (path) paths.push(path);
		}
	}
	return paths;
}
/** Return Claude args with OpenClaw's strict MCP config path injected. */
function mergeClaudeDisallowedTools(args, deniedTools) {
	if (deniedTools.length === 0) return args;
	const next = [];
	const existingDisallowed = [];
	for (let i = 0; i < args.length; i += 1) {
		const arg = args[i] ?? "";
		if (arg === "--disallowedTools" || arg === "--disallowed-tools") {
			while (typeof args[i + 1] === "string" && !args[i + 1]?.startsWith("-")) {
				i += 1;
				existingDisallowed.push(args[i] ?? "");
			}
			continue;
		}
		if (arg.startsWith("--disallowedTools=") || arg.startsWith("--disallowed-tools=")) {
			existingDisallowed.push(arg.slice(arg.indexOf("=") + 1));
			continue;
		}
		next.push(arg);
	}
	next.push("--disallowedTools", [.../* @__PURE__ */ new Set([...existingDisallowed, ...deniedTools])].join(","));
	return next;
}
function injectClaudeWebSearchDisabledArgs(args) {
	return mergeClaudeDisallowedTools(args ?? [], ["WebSearch"]);
}
function injectClaudeMcpConfigArgs(args, mcpConfigPath, mcpToolsDeny, webSearchEnabled) {
	const next = [];
	for (let i = 0; i < (args?.length ?? 0); i += 1) {
		const arg = args?.[i] ?? "";
		if (arg === "--strict-mcp-config") continue;
		if (arg === "--mcp-config") {
			while (typeof args?.[i + 1] === "string" && !args[i + 1]?.startsWith("-")) i += 1;
			continue;
		}
		if (arg.startsWith("--mcp-config=")) continue;
		next.push(arg);
	}
	next.push("--strict-mcp-config", "--mcp-config", mcpConfigPath);
	const deniedTools = Object.entries(mcpToolsDeny ?? {}).flatMap(([serverName, toolNames]) => toolNames.map((toolName) => `mcp__${serverName}__${toolName}`));
	if (webSearchEnabled === false) deniedTools.push("WebSearch");
	return mergeClaudeDisallowedTools(next, deniedTools.toSorted());
}
/** Writes the active per-attempt capture token into OpenClaw's generated Claude MCP config. */
async function writeClaudeMcpCaptureConfig(params) {
	const raw = JSON.parse(await fs$1.readFile(params.mcpConfigPath, "utf-8"));
	if (!isRecord(raw)) throw new Error("Claude MCP capture requires an object config");
	await fs$1.writeFile(params.mcpConfigPath, `${JSON.stringify(withOpenClawMcpCaptureHeader(raw, params.captureKey, "Claude MCP capture requires an openclaw server config"), null, 2)}\n`, "utf-8");
}
//#endregion
//#region src/agents/cli-runner/bundle-mcp-gemini.ts
/**
* Gemini CLI bundle MCP adapter that writes temporary system settings files.
*/
const GEMINI_MCP_SERVER_FIELDS = {
	strings: ["type"],
	booleans: ["trust"]
};
async function readJsonObject(filePath) {
	const raw = await tryReadJson(filePath);
	return raw && typeof raw === "object" && !Array.isArray(raw) ? { ...raw } : {};
}
async function readGeminiBaseSettings(inheritedEnv) {
	const settingsPath = inheritedEnv?.GEMINI_CLI_SYSTEM_SETTINGS_PATH ?? process.env.GEMINI_CLI_SYSTEM_SETTINGS_PATH;
	return typeof settingsPath === "string" && settingsPath.trim() ? await readJsonObject(settingsPath) : {};
}
function mergeGeminiWebSearchDisabled(base) {
	const existing = isRecord(base.tools) && Array.isArray(base.tools.exclude) ? base.tools.exclude.filter((name) => typeof name === "string") : [];
	return applyMergePatch(base, { tools: { exclude: [.../* @__PURE__ */ new Set([...existing, "google_web_search"])] } });
}
async function writeGeminiSettings(settings, inheritedEnv) {
	const temporary = await writeTemporaryBundleMcpJson("openclaw-gemini-mcp-", settings);
	return {
		env: {
			...inheritedEnv,
			GEMINI_CLI_SYSTEM_SETTINGS_PATH: temporary.filePath
		},
		cleanup: temporary.cleanup
	};
}
async function writeGeminiWebSearchDisabledSettings(inheritedEnv) {
	return await writeGeminiSettings(mergeGeminiWebSearchDisabled(await readGeminiBaseSettings(inheritedEnv)), inheritedEnv);
}
function resolveEnvPlaceholder(value, inheritedEnv) {
	const decoded = decodeHeaderEnvPlaceholder(value);
	if (!decoded) return value;
	const resolved = inheritedEnv?.[decoded.envVar] ?? process.env[decoded.envVar] ?? "";
	return decoded.bearer ? `Bearer ${resolved}` : resolved;
}
function normalizeGeminiServerConfig(server, inheritedEnv, deniedTools) {
	const next = normalizeBundleMcpServerConfig(server, GEMINI_MCP_SERVER_FIELDS);
	const headers = normalizeMcpStringRecord(server.headers);
	if (headers) next.headers = Object.fromEntries(Object.entries(headers).map(([name, value]) => [name, resolveEnvPlaceholder(value, inheritedEnv)]));
	if (deniedTools?.length) {
		const existing = Array.isArray(server.excludeTools) ? server.excludeTools.filter((name) => typeof name === "string") : [];
		next.excludeTools = [.../* @__PURE__ */ new Set([...existing, ...deniedTools])].toSorted();
	}
	return next;
}
/** Writes merged Gemini system settings and returns env plus cleanup hook. */
async function writeGeminiSystemSettings(mergedConfig, inheritedEnv, mcpToolsDeny, webSearchEnabled) {
	const base = await readGeminiBaseSettings(inheritedEnv);
	const normalizedConfig = { mcpServers: Object.fromEntries(Object.entries(mergedConfig.mcpServers).map(([name, server]) => [name, normalizeGeminiServerConfig(server, inheritedEnv, mcpToolsDeny && Object.hasOwn(mcpToolsDeny, name) ? mcpToolsDeny[name] : void 0)])) };
	const settings = applyMergePatch(webSearchEnabled === false ? mergeGeminiWebSearchDisabled(base) : base, {
		mcp: { allowed: Object.keys(normalizedConfig.mcpServers) },
		mcpServers: normalizedConfig.mcpServers
	});
	if (!isRecord(settings.mcp) || !isRecord(settings.mcpServers)) throw new Error("Gemini MCP settings merge produced an invalid object");
	return await writeGeminiSettings(settings, inheritedEnv);
}
/** Writes per-attempt Gemini settings with the active loopback capture token. */
async function writeGeminiMcpCaptureSettings(params) {
	const existingSettingsPath = params.inheritedEnv?.GEMINI_CLI_SYSTEM_SETTINGS_PATH;
	if (!existingSettingsPath) throw new Error("Gemini MCP capture requires prepared system settings");
	const temporary = await writeTemporaryBundleMcpJson("openclaw-gemini-mcp-attempt-", withOpenClawMcpCaptureHeader(await readJsonObject(existingSettingsPath), params.captureKey));
	return {
		env: {
			...params.inheritedEnv,
			GEMINI_CLI_SYSTEM_SETTINGS_PATH: temporary.filePath
		},
		cleanup: temporary.cleanup
	};
}
//#endregion
//#region src/agents/cli-runner/bundle-mcp.ts
/**
* Prepares bundled MCP configuration for CLI runner backends.
*/
async function readExternalMcpConfig(configPath) {
	return { mcpServers: extractMcpServerMap(await tryReadJson(configPath)) };
}
function sortJsonValue(value) {
	if (Array.isArray(value)) return value.map((entry) => sortJsonValue(entry));
	if (!isRecord(value)) return value;
	return Object.fromEntries(Object.keys(value).toSorted().map((key) => [key, sortJsonValue(value[key])]));
}
function normalizeOpenClawLoopbackUrl(value) {
	const match = /^(http:\/\/(?:127\.0\.0\.1|localhost|\[::1\])):\d+(\/mcp)$/.exec(value.trim()) ?? void 0;
	if (!match) return value;
	return `${match[1]}:<openclaw-loopback>${match[2]}`;
}
function canonicalizeSystemAgentTurnStateForResume(server) {
	if (!isRecord(server.env) || server.env["OPENCLAW_TOOLS_MCP_TOOLS"] !== "openclaw") return server;
	return {
		...server,
		env: {
			...server.env,
			[OPENCLAW_TOOLS_MCP_SYSTEM_AGENT_APPROVAL_ARMED_ENV]: "<openclaw-turn-state>",
			[OPENCLAW_TOOLS_MCP_SYSTEM_AGENT_PROPOSAL_ENV]: "<openclaw-turn-state>"
		}
	};
}
function canonicalizeBundleMcpConfigForResume(config) {
	return { mcpServers: sortJsonValue(Object.fromEntries(Object.entries(config.mcpServers).map(([name, server]) => {
		const canonicalServer = canonicalizeSystemAgentTurnStateForResume(server);
		if (name !== "openclaw" || typeof canonicalServer.url !== "string") return [name, sortJsonValue(canonicalServer)];
		return [name, sortJsonValue({
			...canonicalServer,
			url: normalizeOpenClawLoopbackUrl(canonicalServer.url)
		})];
	}))) };
}
const OPENCLAW_MCP_ENV_TEMPLATE_PATTERN = /\$\{(OPENCLAW_MCP_[A-Z0-9_]+)\}/g;
function normalizeMcpToolDenials(value) {
	const entries = Object.entries(value ?? {}).map(([serverName, toolNames]) => [serverName, [...new Set(toolNames)].toSorted()]).filter(([, toolNames]) => toolNames.length > 0).toSorted(([left], [right]) => left.localeCompare(right));
	return entries.length > 0 ? Object.fromEntries(entries) : void 0;
}
function applyCodexMcpToolDenials(config, denials) {
	if (!denials) return config;
	return { mcpServers: Object.fromEntries(Object.entries(config.mcpServers).map(([serverName, server]) => {
		const denied = Object.hasOwn(denials, serverName) ? denials[serverName] : void 0;
		if (!denied?.length) return [serverName, server];
		const toolFilter = isRecord(server.toolFilter) ? server.toolFilter : {};
		const existing = Array.isArray(toolFilter.exclude) ? toolFilter.exclude.filter((name) => typeof name === "string") : [];
		return [serverName, {
			...server,
			toolFilter: {
				...toolFilter,
				exclude: [.../* @__PURE__ */ new Set([...existing, ...denied])].toSorted()
			}
		}];
	})) };
}
function applyMcpServerOverrides(config, overrides) {
	return overrides ? { mcpServers: Object.fromEntries(Object.entries(config.mcpServers).filter(([serverName]) => !Object.hasOwn(overrides, serverName) || overrides[serverName] !== false)) } : config;
}
function resolveOpenClawMcpEnvTemplates(value, env) {
	if (!env) return value;
	if (typeof value === "string") return value.replace(OPENCLAW_MCP_ENV_TEMPLATE_PATTERN, (match, name) => {
		const replacement = env[name];
		return Object.hasOwn(env, name) && replacement !== void 0 ? replacement : match;
	});
	if (Array.isArray(value)) return value.map((entry) => resolveOpenClawMcpEnvTemplates(entry, env));
	if (!isRecord(value)) return value;
	return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, resolveOpenClawMcpEnvTemplates(entry, env)]));
}
async function prepareModeSpecificBundleMcpConfig(params) {
	const mcpToolsDeny = normalizeMcpToolDenials(params.mcpToolsDeny);
	const webSearchDisabled = params.webSearchEnabled === false;
	const configHashInput = mcpToolsDeny || webSearchDisabled ? {
		config: params.mergedConfig,
		mcpToolsDeny,
		webSearchDisabled
	} : params.mergedConfig;
	const serializedConfig = `${JSON.stringify(configHashInput, null, 2)}\n`;
	const mcpConfigHash = crypto.createHash("sha256").update(serializedConfig).digest("hex");
	const serializedResumeConfig = `${JSON.stringify(mcpToolsDeny || webSearchDisabled ? {
		config: canonicalizeBundleMcpConfigForResume(params.mergedConfig),
		mcpToolsDeny,
		webSearchDisabled
	} : canonicalizeBundleMcpConfigForResume(params.mergedConfig), null, 2)}\n`;
	const mcpResumeHash = crypto.createHash("sha256").update(serializedResumeConfig).digest("hex");
	if (params.mode === "codex-config-overrides") {
		const codexConfig = applyCodexMcpToolDenials(params.mergedConfig, mcpToolsDeny);
		return {
			backend: injectBundleMcpBackendArgs(params.backend, (args) => webSearchDisabled ? [
				...injectCodexMcpConfigArgs(args, codexConfig),
				"-c",
				"web_search=\"disabled\""
			] : injectCodexMcpConfigArgs(args, codexConfig)),
			mcpConfigHash,
			mcpResumeHash,
			env: params.env
		};
	}
	if (params.mode === "gemini-system-settings") {
		const settings = await writeGeminiSystemSettings(params.mergedConfig, params.env, mcpToolsDeny, params.webSearchEnabled);
		return {
			backend: params.backend,
			mcpConfigHash,
			mcpResumeHash,
			env: settings.env,
			cleanup: settings.cleanup
		};
	}
	const temporary = await writeTemporaryBundleMcpJson("openclaw-cli-mcp-", resolveOpenClawMcpEnvTemplates(params.mergedConfig, params.env), "mcp.json", false);
	return {
		backend: injectBundleMcpBackendArgs(params.backend, (args) => injectClaudeMcpConfigArgs(args, temporary.filePath, mcpToolsDeny, params.webSearchEnabled)),
		mcpConfigHash,
		mcpResumeHash,
		env: params.env,
		cleanup: temporary.cleanup
	};
}
async function prepareCliWebSearchDisabled(params) {
	const fingerprint = crypto.createHash("sha256").update("web-search-disabled-v1").digest("hex");
	if (params.mode === "gemini-system-settings") {
		const settings = await writeGeminiWebSearchDisabledSettings(params.env);
		return {
			backend: params.backend,
			env: settings.env,
			cleanup: settings.cleanup,
			mcpConfigHash: fingerprint,
			mcpResumeHash: fingerprint
		};
	}
	return {
		backend: injectBundleMcpBackendArgs(params.backend, (args) => params.mode === "codex-config-overrides" ? [
			...args ?? [],
			"-c",
			"web_search=\"disabled\""
		] : injectClaudeWebSearchDisabledArgs(args)),
		env: params.env,
		mcpConfigHash: fingerprint,
		mcpResumeHash: fingerprint
	};
}
/** Prepare backend args/env/cleanup for bundle MCP injection into a CLI run. */
async function prepareCliBundleMcpConfig(params) {
	if (!params.enabled) return params.toolOverrides?.webSearch === false ? await prepareCliWebSearchDisabled({
		mode: params.mode ?? "claude-config-file",
		backend: params.backend,
		env: params.env
	}) : {
		backend: params.backend,
		env: params.env
	};
	const mode = params.mode ?? "claude-config-file";
	if (params.exclusiveConfig) return await prepareModeSpecificBundleMcpConfig({
		mode,
		backend: params.backend,
		mergedConfig: applyMcpServerOverrides(params.exclusiveConfig, params.toolOverrides?.mcpServers),
		env: params.env,
		mcpToolsDeny: params.toolOverrides?.mcpToolsDeny,
		webSearchEnabled: params.toolOverrides?.webSearch
	});
	const resumeMcpConfigPaths = mode === "claude-config-file" ? findClaudeMcpConfigPaths(params.backend.resumeArgs) : [];
	const existingMcpConfigPaths = mode === "claude-config-file" && resumeMcpConfigPaths.length > 0 ? resumeMcpConfigPaths : mode === "claude-config-file" ? findClaudeMcpConfigPaths(params.backend.args) : [];
	let mergedConfig = { mcpServers: {} };
	for (const existingMcpConfigPath of existingMcpConfigPaths) {
		const resolvedExistingPath = path.isAbsolute(existingMcpConfigPath) ? existingMcpConfigPath : path.resolve(params.workspaceDir, existingMcpConfigPath);
		mergedConfig = applyMergePatch(mergedConfig, await readExternalMcpConfig(resolvedExistingPath));
	}
	const bundleConfig = loadMergedBundleMcpConfig({
		workspaceDir: params.workspaceDir,
		cfg: params.config,
		mapConfiguredServer: toCliBundleMcpServerConfig,
		toolOverrides: params.toolOverrides
	});
	for (const diagnostic of bundleConfig.diagnostics) params.warn?.(`bundle MCP skipped for ${diagnostic.pluginId}: ${diagnostic.message}`);
	mergedConfig = applyMergePatch(mergedConfig, bundleConfig.config);
	const prepareDataDirsByServer = { ...bundleConfig.prepareDataDirsByServer };
	if (params.additionalConfig) {
		mergedConfig = applyMergePatch(mergedConfig, params.additionalConfig);
		for (const serverName of Object.keys(params.additionalConfig.mcpServers)) delete prepareDataDirsByServer[serverName];
	}
	const resolvedBearerConfig = await resolveMcpBearerBundleConfig({
		config: mergedConfig,
		cfg: params.config,
		agentDir: params.agentDir,
		env: params.env,
		omitUnavailableOAuthServers: true,
		onServerUnavailable: (serverName, error) => params.warn?.(`bundle MCP skipped unavailable OAuth server ${serverName}: ${formatErrorMessage(error)}`)
	});
	const preparedDataDirs = prepareOwnedBundleMcpDataDirs({
		config: applyMcpServerOverrides(resolvedBearerConfig.config, params.toolOverrides?.mcpServers),
		prepareDataDirsByServer
	});
	for (const diagnostic of preparedDataDirs.diagnostics) params.warn?.(`bundle MCP skipped for ${diagnostic.pluginId}: ${diagnostic.message}`);
	return await prepareModeSpecificBundleMcpConfig({
		mode,
		backend: params.backend,
		mergedConfig: preparedDataDirs.config,
		env: resolvedBearerConfig.env,
		mcpToolsDeny: params.toolOverrides?.mcpToolsDeny,
		webSearchEnabled: params.toolOverrides?.webSearch
	});
}
/** Prepares a per-attempt capture token without changing resume compatibility hashes. */
async function prepareCliBundleMcpCaptureAttempt(params) {
	if (!params.captureKey) return { env: params.env };
	if ((params.mode ?? "claude-config-file") === "gemini-system-settings") return await writeGeminiMcpCaptureSettings({
		inheritedEnv: params.env,
		captureKey: params.captureKey
	});
	if ((params.mode ?? "claude-config-file") === "claude-config-file") {
		const mcpConfigPath = findClaudeMcpConfigPaths(params.backend?.args)[0] ?? findClaudeMcpConfigPaths(params.backend?.resumeArgs)[0];
		if (mcpConfigPath) await writeClaudeMcpCaptureConfig({
			mcpConfigPath,
			captureKey: params.captureKey
		});
	}
	return { env: {
		...params.env,
		OPENCLAW_MCP_CLI_CAPTURE_KEY: params.captureKey
	} };
}
//#endregion
//#region src/agents/cli-runner/claude-skills-plugin.ts
/**
* Materializes selected OpenClaw skills as a temporary Claude CLI plugin.
*/
const CLAUDE_CLI_BACKEND_ID = "claude-cli";
const OPENCLAW_CLAUDE_PLUGIN_NAME = "openclaw-skills";
function sanitizeSkillDirName(name, used) {
	const base = name.trim().replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "skill";
	const safeBase = base.startsWith(".") ? `skill-${base.replace(/^\.+/, "") || "skill"}` : base;
	let candidate = safeBase;
	for (let index = 2; used.has(candidate); index += 1) candidate = `${safeBase}-${index}`;
	used.add(candidate);
	return candidate;
}
/** Returns whether a resolved skill file is readable before linking it into the Claude plugin. */
function isClaudeCliSkillFileAccessible(skillFilePath) {
	try {
		accessSync(skillFilePath);
		return true;
	} catch {
		return false;
	}
}
async function collectClaudePluginSkills(snapshot) {
	const skills = snapshot?.resolvedSkills ?? [];
	if (skills.length === 0) return [];
	const usedTargetNames = /* @__PURE__ */ new Set();
	const materialized = [];
	for (const skill of skills) {
		const name = skill.name?.trim();
		const skillFilePath = skill.filePath?.trim();
		if (!name || !skillFilePath) continue;
		if (!isClaudeCliSkillFileAccessible(skillFilePath)) {
			cliBackendLog.warn(`claude skill plugin skipped missing skill file: ${skillFilePath}`);
			continue;
		}
		materialized.push({
			name,
			sourceDir: path.dirname(skillFilePath),
			targetDirName: sanitizeSkillDirName(name, usedTargetNames)
		});
	}
	return materialized;
}
async function linkOrCopySkillDir(params) {
	try {
		await fs$1.symlink(params.sourceDir, params.targetDir, process.platform === "win32" ? "junction" : "dir");
	} catch {
		await fs$1.cp(params.sourceDir, params.targetDir, {
			recursive: true,
			force: true,
			verbatimSymlinks: true
		});
	}
}
/** Prepares Claude CLI `--plugin-dir` args for the current session skill snapshot. */
async function prepareClaudeCliSkillsPlugin(params) {
	if (normalizeLowercaseStringOrEmpty(params.backendId) !== CLAUDE_CLI_BACKEND_ID) return {
		args: [],
		cleanup: async () => {}
	};
	const skills = await collectClaudePluginSkills(params.skillsSnapshot);
	if (skills.length === 0) return {
		args: [],
		cleanup: async () => {}
	};
	const tempDir = await fs$1.mkdtemp(path.join(resolvePreferredOpenClawTmpDir(), "openclaw-claude-skills-"));
	const pluginDir = path.join(tempDir, OPENCLAW_CLAUDE_PLUGIN_NAME);
	const manifestDir = path.join(pluginDir, ".claude-plugin");
	const skillsDir = path.join(pluginDir, "skills");
	await fs$1.mkdir(manifestDir, {
		recursive: true,
		mode: 448
	});
	await fs$1.mkdir(skillsDir, {
		recursive: true,
		mode: 448
	});
	const manifest = {
		name: OPENCLAW_CLAUDE_PLUGIN_NAME,
		version: "0.0.0",
		description: "Session-scoped OpenClaw skills selected for this agent run.",
		skills: "./skills"
	};
	await fs$1.writeFile(path.join(manifestDir, "plugin.json"), `${JSON.stringify(manifest, null, 2)}\n`, {
		encoding: "utf-8",
		mode: 384
	});
	let linkedSkillCount = 0;
	for (const skill of skills) try {
		await linkOrCopySkillDir({
			sourceDir: skill.sourceDir,
			targetDir: path.join(skillsDir, skill.targetDirName)
		});
		linkedSkillCount += 1;
	} catch (error) {
		cliBackendLog.warn(`claude skill plugin skipped ${skill.name}: ${error instanceof Error ? error.message : String(error)}`);
	}
	if (linkedSkillCount === 0) {
		await fs$1.rm(tempDir, {
			recursive: true,
			force: true
		});
		return {
			args: [],
			cleanup: async () => {}
		};
	}
	return {
		args: ["--plugin-dir", pluginDir],
		pluginDir,
		cleanup: async () => {
			await fs$1.rm(tempDir, {
				recursive: true,
				force: true
			});
		}
	};
}
//#endregion
export { prepareCliBundleMcpCaptureAttempt as n, prepareCliBundleMcpConfig as r, prepareClaudeCliSkillsPlugin as t };
