import { p as safeRealpathSync } from "./path-CYL8StfC.js";
import { r as openRootFile } from "./root-file-CdmcBz8_.js";
import "./boundary-file-read-Dy4MeTWa.js";
import "./boundary-path-BPbNzRAg.js";
import { r as formatErrorMessage } from "./errors-CqPTYU6G.js";
import { t as sanitizeForLog } from "./ansi-9qL8iF9E.js";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.js";
import { t as createSubsystemLogger } from "./subsystem-DNgaGOch.js";
import { f as registerInternalHook, h as unregisterInternalHook } from "./internal-hooks-KjqRukQs.js";
import { r as resolveHookKey } from "./frontmatter-CrnbUoMq.js";
import { r as shouldIncludeHook } from "./config-lcKXe5Oi.js";
import { n as resolveFunctionModuleExport } from "./module-loader-BF97Ap2W.js";
import { n as isKnownInternalHookEventKey, t as loadWorkspaceHookEntries } from "./workspace-CFG3Y7tG.js";
import { n as resolveConfiguredInternalHookNames, t as hasConfiguredInternalHooks } from "./configured-DzPK7L18.js";
import { pathToFileURL } from "node:url";
import fs from "node:fs";
//#region src/hooks/import-url.ts
/**
* Build an import URL for a hook handler module.
*
* Bundled hooks (shipped in dist/) are immutable between installs, so they
* can be imported without a cache-busting suffix — letting V8 reuse its
* module cache across gateway restarts.
*
* Workspace, managed, and plugin hooks may be edited by the user between
* restarts. For those we append `?t=<mtime>&s=<size>` so the module key
* reflects on-disk changes while staying stable for unchanged files.
*/
/**
* Sources whose handler files never change between `npm install` runs.
* Imports from these sources skip cache busting entirely.
*/
const IMMUTABLE_SOURCES = /* @__PURE__ */ new Set(["openclaw-bundled"]);
function buildImportUrl(handlerPath, source) {
	const base = pathToFileURL(handlerPath).href;
	if (IMMUTABLE_SOURCES.has(source)) return base;
	try {
		const { mtimeMs, size } = fs.statSync(handlerPath);
		return `${base}?t=${mtimeMs}&s=${size}`;
	} catch {
		return `${base}?t=${Date.now()}`;
	}
}
//#endregion
//#region src/hooks/loader.ts
/**
* Dynamic loader for hook handlers
*
* Loads hook handlers from external modules based on configuration
* and from directory-based discovery (bundled, managed, workspace)
*/
const log = createSubsystemLogger("hooks:loader");
const loadedHookRegistrations = resolveGlobalSingleton(Symbol.for("openclaw.loadedInternalHookRegistrations"), () => [], () => resetLoadedInternalHooks(), "plugin-registry");
function safeLogValue(value) {
	return sanitizeForLog(value);
}
function maybeWarnTrustedHookSource(source) {
	if (source === "openclaw-workspace") {
		log.warn("Loading workspace hook code into the gateway process. Workspace hooks are trusted local code.");
		return;
	}
	if (source === "openclaw-managed") log.warn("Loading managed hook code into the gateway process. Managed hooks are trusted local code.");
}
function resetLoadedInternalHooks() {
	while (loadedHookRegistrations.length > 0) {
		const registration = loadedHookRegistrations.pop();
		if (!registration) continue;
		unregisterInternalHook(registration.event, registration.handler);
	}
}
/**
* Load and register all hook handlers
*
* Loads hooks from directory-based discovery (bundled, managed, workspace).
*
* @param cfg - OpenClaw configuration
* @param workspaceDir - Workspace directory for hook discovery
* @returns Number of handlers successfully loaded
*
* @example
* ```ts
* const config = await getRuntimeConfig();
* const workspaceDir = resolveAgentWorkspaceDir(config, agentId);
* const count = await loadInternalHooks(config, workspaceDir);
* console.log(`Loaded ${count} hook handlers`);
* ```
*/
async function loadInternalHooks(cfg, workspaceDir, opts) {
	resetLoadedInternalHooks();
	if (!hasConfiguredInternalHooks(cfg)) return 0;
	let loadedCount = 0;
	const configuredNames = resolveConfiguredInternalHookNames(cfg);
	try {
		const eligible = loadWorkspaceHookEntries(workspaceDir, {
			config: cfg,
			managedHooksDir: opts?.managedHooksDir,
			bundledHooksDir: opts?.bundledHooksDir
		}).filter((entry) => {
			if (configuredNames) {
				const hookKey = resolveHookKey(entry.hook.name, entry);
				if (!configuredNames.has(entry.hook.name) && !configuredNames.has(hookKey)) return false;
			}
			return shouldIncludeHook({
				entry,
				config: cfg
			});
		});
		for (const entry of eligible) try {
			const hookBaseDir = safeRealpathSync(entry.hook.baseDir);
			if (!hookBaseDir) {
				log.error(`Hook '${safeLogValue(entry.hook.name)}' base directory is no longer readable: ${safeLogValue(entry.hook.baseDir)}`);
				continue;
			}
			const opened = await openRootFile({
				absolutePath: entry.hook.handlerPath,
				rootPath: hookBaseDir,
				boundaryLabel: "hook directory"
			});
			if (!opened.ok) {
				log.error(`Hook '${safeLogValue(entry.hook.name)}' handler path fails boundary checks: ${safeLogValue(entry.hook.handlerPath)}`);
				continue;
			}
			const safeHandlerPath = opened.path;
			fs.closeSync(opened.fd);
			maybeWarnTrustedHookSource(entry.hook.source);
			const mod = await import(buildImportUrl(safeHandlerPath, entry.hook.source));
			const exportName = entry.metadata?.export ?? "default";
			const handler = resolveFunctionModuleExport({
				mod,
				exportName
			});
			if (!handler) {
				log.error(`Handler '${safeLogValue(exportName)}' from ${safeLogValue(entry.hook.name)} is not a function`);
				continue;
			}
			const events = entry.metadata?.events ?? [];
			if (events.length === 0) {
				log.warn(`Hook '${safeLogValue(entry.hook.name)}' has no events defined in metadata`);
				continue;
			}
			const unknownEvents = events.filter((event) => !isKnownInternalHookEventKey(event));
			if (unknownEvents.length > 0) log.warn(`Hook '${safeLogValue(entry.hook.name)}' subscribes to event${unknownEvents.length === 1 ? "" : "s"} ${unknownEvents.map((event) => safeLogValue(event)).join(", ")} not emitted by OpenClaw core — likely a typo; unless a plugin emits it, the hook never fires. Known events: https://docs.openclaw.ai/automation/hooks`);
			for (const event of events) {
				registerInternalHook(event, handler);
				loadedHookRegistrations.push({
					event,
					handler
				});
			}
			log.debug(`Registered hook: ${safeLogValue(entry.hook.name)} -> ${events.map((event) => safeLogValue(event)).join(", ")}${exportName !== "default" ? ` (export: ${safeLogValue(exportName)})` : ""}`);
			loadedCount++;
		} catch (err) {
			log.error(`Failed to load hook ${safeLogValue(entry.hook.name)}: ${safeLogValue(formatErrorMessage(err))}`);
		}
	} catch (err) {
		log.error(`Failed to load directory-based hooks: ${safeLogValue(formatErrorMessage(err))}`);
	}
	return loadedCount;
}
//#endregion
export { loadInternalHooks };
