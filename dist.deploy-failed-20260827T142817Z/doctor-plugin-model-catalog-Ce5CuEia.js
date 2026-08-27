import { m as shortenHomePath } from "./utils-DEqefz4f.js";
import "./agent-scope-BizOtGGz.js";
import { a as listAgentIds, f as resolveDefaultAgentDir, l as resolveAgentDir } from "./agent-scope-config-BdXMWufB.js";
import { t as privateFileStore } from "./private-file-store-p6c2I0-s.js";
import { a as isPluginModelCatalogMigrationFile, c as migrateLegacyPluginModelCatalogs, i as isGeneratedPluginModelCatalog, t as decodePluginModelCatalogRelativePathPluginId } from "./plugin-model-catalog-D6SwPimH.js";
import { t as note } from "./note-D7f3pYFE.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/commands/doctor-plugin-model-catalog.ts
function resolveMigrationAgentDirs(params) {
	if (params.agentDirs) return [...new Set(params.agentDirs)].toSorted((left, right) => left.localeCompare(right));
	const env = params.env ?? process.env;
	return [.../* @__PURE__ */ new Set([resolveDefaultAgentDir(params.cfg, env), ...listAgentIds(params.cfg).map((agentId) => resolveAgentDir(params.cfg, agentId, env))])].toSorted((left, right) => left.localeCompare(right));
}
async function readLegacyPluginCatalogContents(params) {
	return await privateFileStore(path.dirname(path.join(params.agentDir, params.relativePath))).readTextIfExists(path.basename(params.relativePath));
}
/** Detects only marker-backed catalogs produced by tagged OpenClaw releases. */
async function collectLegacyPluginModelCatalogMigrations(params) {
	const migrations = [];
	for (const agentDir of resolveMigrationAgentDirs(params)) {
		const pluginsDir = path.join(agentDir, "plugins");
		let pluginDirs;
		try {
			pluginDirs = await fs.readdir(pluginsDir, { withFileTypes: true });
		} catch (error) {
			if (error.code === "ENOENT") continue;
			params.warnings?.push(`Could not inspect legacy provider catalogs: ${shortenHomePath(pluginsDir)}`);
			continue;
		}
		for (const pluginDir of pluginDirs) {
			if (!pluginDir.isDirectory()) continue;
			const pluginId = decodePluginModelCatalogRelativePathPluginId(path.join("plugins", pluginDir.name, "catalog.json"));
			if (!pluginId) continue;
			const pluginPath = path.join(pluginsDir, pluginDir.name);
			let catalogFiles;
			try {
				catalogFiles = await fs.readdir(pluginPath, { withFileTypes: true });
			} catch {
				params.warnings?.push(`Could not inspect legacy provider catalogs: ${shortenHomePath(pluginPath)}`);
				continue;
			}
			const sourceFiles = catalogFiles.filter((entry) => entry.isFile() && isPluginModelCatalogMigrationFile(entry.name)).toSorted((left, right) => {
				if (left.name === "catalog.json") return 1;
				if (right.name === "catalog.json") return -1;
				return left.name.localeCompare(right.name);
			});
			const pluginMigrations = [];
			let hasUnreadableCatalog = false;
			for (const sourceFile of sourceFiles) {
				const relativePath = path.join("plugins", pluginDir.name, sourceFile.name);
				let contents;
				try {
					contents = await readLegacyPluginCatalogContents({
						agentDir,
						relativePath
					});
				} catch {
					hasUnreadableCatalog = true;
					params.warnings?.push(`Could not read legacy provider catalog: ${shortenHomePath(path.join(agentDir, relativePath))}`);
					continue;
				}
				if (contents === null) continue;
				let parsed;
				try {
					parsed = JSON.parse(contents);
				} catch {
					continue;
				}
				if (isGeneratedPluginModelCatalog(parsed)) pluginMigrations.push({
					agentDir,
					pluginId,
					relativePath,
					contents
				});
			}
			if (hasUnreadableCatalog) continue;
			if (!pluginMigrations.some((migration) => path.basename(migration.relativePath) === "catalog.json") && new Set(pluginMigrations.map((migration) => migration.contents)).size > 1) {
				params.warnings?.push(`Conflicting retained legacy provider catalogs: ${shortenHomePath(pluginPath)}`);
				continue;
			}
			migrations.push(...pluginMigrations);
		}
	}
	return migrations.toSorted((left, right) => {
		const agentOrder = left.agentDir.localeCompare(right.agentDir);
		return agentOrder !== 0 ? agentOrder : left.pluginId.localeCompare(right.pluginId);
	});
}
/** Imports and verifies released sidecars before Doctor removes any legacy bytes. */
async function maybeMigrateLegacyPluginModelCatalogs(params) {
	const warnings = [];
	const migrations = await collectLegacyPluginModelCatalogMigrations({
		...params,
		warnings
	});
	for (const warning of warnings) params.runtime.error(warning);
	if (migrations.length === 0) return {
		detected: 0,
		migrated: 0,
		warnings
	};
	const emitNote = params.note ?? note;
	emitNote([
		"Legacy generated provider catalogs contain model and credential state.",
		...migrations.map((migration) => `- ${shortenHomePath(path.join(migration.agentDir, migration.relativePath))}`),
		"Run openclaw doctor --fix to verify and migrate these catalogs into agent SQLite."
	].join("\n"), "Plugin model catalogs");
	if (!(params.prompter.shouldRepair || await params.prompter.confirmAutoFix({
		message: "Migrate generated provider model catalogs into agent SQLite now?",
		initialValue: true
	}))) return {
		detected: migrations.length,
		migrated: 0,
		warnings
	};
	const grouped = /* @__PURE__ */ new Map();
	for (const migration of migrations) {
		const agentMigrations = grouped.get(migration.agentDir) ?? [];
		agentMigrations.push(migration);
		grouped.set(migration.agentDir, agentMigrations);
	}
	let migrated = 0;
	for (const [agentDir, agentMigrations] of grouped) {
		const result = migrateLegacyPluginModelCatalogs({
			agentDir,
			expectedContents: new Map(agentMigrations.map((migration) => [migration.pluginId, migration.contents]))
		});
		migrated += result.migrated;
		for (const warning of result.warnings) {
			const displayWarning = shortenHomePath(warning);
			if (warnings.includes(displayWarning)) continue;
			warnings.push(displayWarning);
			params.runtime.error(displayWarning);
		}
	}
	if (migrated > 0) emitNote(`Migrated and verified ${migrated} generated provider catalog${migrated === 1 ? "" : "s"} in agent SQLite.`, "Doctor changes");
	return {
		detected: migrations.length,
		migrated,
		warnings
	};
}
//#endregion
export { maybeMigrateLegacyPluginModelCatalogs };
