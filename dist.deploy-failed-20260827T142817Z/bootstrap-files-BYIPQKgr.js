import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import "./utils-DEqefz4f.js";
import "./agent-scope-BizOtGGz.js";
import { s as resolveAgentConfig } from "./agent-scope-config-BdXMWufB.js";
import { f as resolveAgentIdFromSessionKey } from "./session-key-D8GLfPr_.js";
import { i as readRecentSessionTranscriptActiveEvents } from "./session-accessor-CVnxp3UM.js";
import { T as workspaceFilesShareSourceIdentity, a as DEFAULT_MEMORY_FILENAME, b as loadWorkspaceBootstrapFiles, h as filterBootstrapFilesForSession, n as DEFAULT_BOOTSTRAP_FILENAME, v as isWorkspaceSetupCompleted } from "./workspace-BV2vwVv3.js";
import { i as resolveBootstrapTotalMaxChars, n as buildBootstrapContextFiles, r as resolveBootstrapMaxChars } from "./bootstrap-C3qVpLY-.js";
import "./embedded-agent-helpers-djcKKwhg.js";
import { m as triggerInternalHook, n as createInternalHookEvent } from "./internal-hooks--FUKcLjc.js";
import { i as getOrLoadBootstrapFiles } from "./bootstrap-cache-e0hDlz1i.js";
import path from "node:path";
//#region src/agents/bootstrap-hooks.ts
/** Runs bootstrap hooks and returns the effective bootstrap file list. */
async function applyBootstrapHookOverrides(params) {
	const sessionKey = params.sessionKey ?? params.sessionId ?? "unknown";
	const agentId = params.agentId ?? (params.sessionKey ? resolveAgentIdFromSessionKey(params.sessionKey) : void 0);
	const event = createInternalHookEvent("agent", "bootstrap", sessionKey, {
		workspaceDir: params.workspaceDir,
		bootstrapFiles: params.files,
		cfg: params.config,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		agentId
	});
	await triggerInternalHook(event);
	const updated = event.context.bootstrapFiles;
	return Array.isArray(updated) ? updated : params.files;
}
//#endregion
//#region src/agents/bootstrap-files.ts
/**
* Resolves workspace bootstrap files for agent runs and converts them into
* bounded context files.
*/
const CONTINUATION_SCAN_MAX_RECORDS = 500;
const FULL_BOOTSTRAP_COMPLETED_CUSTOM_TYPE = "openclaw:bootstrap-context:full";
const BOOTSTRAP_WARNING_DEDUPE_LIMIT = 1024;
const seenBootstrapWarnings = /* @__PURE__ */ new Set();
const bootstrapWarningOrder = [];
function rememberBootstrapWarning(key) {
	if (seenBootstrapWarnings.has(key)) return false;
	if (seenBootstrapWarnings.size >= BOOTSTRAP_WARNING_DEDUPE_LIMIT) {
		const oldest = bootstrapWarningOrder.shift();
		if (oldest) seenBootstrapWarnings.delete(oldest);
	}
	seenBootstrapWarnings.add(key);
	bootstrapWarningOrder.push(key);
	return true;
}
/** Resolves the effective bootstrap injection mode for a session agent. */
function resolveContextInjectionMode(config, agentId) {
	const agentMode = config && agentId ? resolveAgentConfig(config, agentId)?.contextInjection : void 0;
	if (agentMode === "always" || agentMode === "continuation-skip" || agentMode === "never") return agentMode;
	return config?.agents?.defaults?.contextInjection ?? "always";
}
/** Checks the active SQLite transcript branch for a valid full-bootstrap marker. */
async function hasCompletedBootstrapTurn(sessionTarget) {
	const { agentId, sessionId, sessionKey, storePath } = sessionTarget ?? {};
	if (!agentId || !sessionId || !sessionKey || !storePath) return false;
	try {
		const records = readRecentSessionTranscriptActiveEvents({
			agentId,
			sessionId,
			sessionKey,
			storePath
		}, CONTINUATION_SCAN_MAX_RECORDS);
		for (const entry of records.toReversed()) {
			const record = entry;
			if (record?.type === "compaction" || record?.type === "reset") return false;
			if (record?.type === "custom" && record.customType === "openclaw:bootstrap-context:full") return true;
		}
		return false;
	} catch {
		return false;
	}
}
/** Builds a session-scoped warning sink that dedupes repeated bootstrap warnings. */
function makeBootstrapWarn(params) {
	const warn = params.warn;
	if (!warn) return;
	const workspacePrefix = params.workspaceDir ?? "";
	return (message) => {
		if (!rememberBootstrapWarning(`${workspacePrefix}\u0000${params.sessionLabel}\u0000${message}`)) return;
		warn(`${message} (sessionKey=${params.sessionLabel})`);
	};
}
function sanitizeBootstrapFiles(files, workspaceDir, warn) {
	const workspaceRoot = resolveUserPath(workspaceDir);
	const seenPaths = /* @__PURE__ */ new Set();
	const sanitized = [];
	for (const file of files) {
		const pathValue = normalizeOptionalString(file.path) ?? "";
		if (!pathValue) {
			warn?.(`skipping bootstrap file "${file.name}" — missing or invalid "path" field (hook may have used "filePath" instead)`);
			continue;
		}
		const resolvedPath = path.isAbsolute(pathValue) ? path.resolve(pathValue) : pathValue.startsWith("~") ? resolveUserPath(pathValue) : path.resolve(workspaceRoot, pathValue);
		const dedupeKey = path.normalize(path.relative(workspaceRoot, resolvedPath));
		if (seenPaths.has(dedupeKey)) continue;
		seenPaths.add(dedupeKey);
		sanitized.push({
			...file,
			path: resolvedPath
		});
	}
	return sanitized;
}
function applyContextModeFilter(params) {
	if ((params.contextMode ?? "full") !== "lightweight") return params.files;
	return [];
}
function filterCompletedWorkspaceBootstrapFile(files, setupCompleted, workspaceDir) {
	if (!setupCompleted) return files;
	const workspaceRoot = resolveUserPath(workspaceDir);
	const rootBootstrapPath = path.join(workspaceRoot, DEFAULT_BOOTSTRAP_FILENAME);
	return files.filter((file) => {
		if (file.name !== "BOOTSTRAP.md") return true;
		const pathValue = normalizeOptionalString(file.path);
		if (!pathValue) return true;
		return (path.isAbsolute(pathValue) ? path.resolve(pathValue) : pathValue.startsWith("~") ? resolveUserPath(pathValue) : path.resolve(workspaceRoot, pathValue)) !== rootBootstrapPath;
	});
}
async function isWorkspaceSetupCompletedForContext(workspaceDir) {
	try {
		return await isWorkspaceSetupCompleted(workspaceDir);
	} catch {
		return false;
	}
}
function filterBootstrapFilesAfterHooks(params) {
	const sessionFiltered = filterBootstrapFilesForSession(params.files, params.session);
	const rootMemoryFile = params.protectedRootMemoryFile;
	if (!rootMemoryFile) return sessionFiltered;
	return sessionFiltered.filter((file) => !workspaceFilesShareSourceIdentity(file, rootMemoryFile));
}
/** Resolves hook-adjusted, session-filtered bootstrap files for a run. */
async function resolveBootstrapFilesForRun(params) {
	const session = {
		sessionKey: params.sessionKey ?? params.sessionId,
		chatType: params.chatType,
		workspaceDir: params.workspaceDir
	};
	const workspaceSetupCompleted = await isWorkspaceSetupCompletedForContext(params.workspaceDir);
	const rawFiles = params.sessionKey ? await getOrLoadBootstrapFiles({
		workspaceDir: params.workspaceDir,
		sessionKey: params.sessionKey
	}) : await loadWorkspaceBootstrapFiles(params.workspaceDir);
	const rootMemoryFile = rawFiles.find((file) => file.name === DEFAULT_MEMORY_FILENAME && !file.missing);
	const protectedRootMemoryFile = rootMemoryFile && filterBootstrapFilesForSession([rootMemoryFile], session).length === 0 ? rootMemoryFile : void 0;
	return sanitizeBootstrapFiles(filterCompletedWorkspaceBootstrapFile(filterBootstrapFilesAfterHooks({
		files: await applyBootstrapHookOverrides({
			files: applyContextModeFilter({
				files: filterCompletedWorkspaceBootstrapFile(filterBootstrapFilesForSession(rawFiles, session), workspaceSetupCompleted, params.workspaceDir),
				contextMode: params.contextMode,
				runKind: params.runKind
			}),
			workspaceDir: params.workspaceDir,
			config: params.config,
			sessionKey: params.sessionKey,
			sessionId: params.sessionId,
			agentId: params.agentId
		}),
		session,
		protectedRootMemoryFile
	}), workspaceSetupCompleted, params.workspaceDir), params.workspaceDir, params.warn);
}
/** Resolves both raw bootstrap metadata and bounded context files for a run. */
async function resolveBootstrapContextForRun(params) {
	const bootstrapFiles = await resolveBootstrapFilesForRun(params);
	return {
		bootstrapFiles,
		contextFiles: buildBootstrapContextForFiles(bootstrapFiles, params)
	};
}
/** Builds bounded context files from already-resolved bootstrap file metadata. */
function buildBootstrapContextForFiles(bootstrapFiles, params) {
	return buildBootstrapContextFiles(bootstrapFiles, {
		maxChars: resolveBootstrapMaxChars(params.config, params.agentId),
		totalMaxChars: resolveBootstrapTotalMaxChars(params.config, params.agentId),
		warn: params.warn
	});
}
//#endregion
export { resolveBootstrapContextForRun as a, makeBootstrapWarn as i, buildBootstrapContextForFiles as n, resolveBootstrapFilesForRun as o, hasCompletedBootstrapTurn as r, resolveContextInjectionMode as s, FULL_BOOTSTRAP_COMPLETED_CUSTOM_TYPE as t };
