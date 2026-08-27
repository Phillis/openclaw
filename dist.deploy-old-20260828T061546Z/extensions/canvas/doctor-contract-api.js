import { g as readStringValue } from "../../string-coerce-CIXf7egm.js";
import { a as asOptionalRecord } from "../../record-coerce-DItp3I4t.js";
import { s as pathExists } from "../../absolute-path-CYFPfAjt.js";
import { c as resolveUserPath } from "../../home-dir-BFvskzn8.js";
import "../../string-coerce-runtime-C8jKEm3h.js";
import { r as resolvePluginConfigObject } from "../../plugin-config-runtime-C2UoeqsI.js";
import "../../security-runtime-qrFVi6LG.js";
import "../../text-utility-runtime-BNhX-3os.js";
import { t as migrateCanvasHostConfig } from "../../config-migration-BD3ComIy.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/canvas/doctor-contract-api.ts
const RETIRED_CANVAS_HOST_CONFIG_PATH = [
	"plugins",
	"entries",
	"canvas",
	"config",
	"host"
];
/** Retired Canvas file-host settings detected before strict plugin validation. */
const legacyConfigRules = [{
	path: ["canvasHost"],
	message: "canvasHost is retired; only plugins.entries.canvas.config.host.enabled remains. Run \"openclaw doctor --fix\"."
}, ...[
	"root",
	"port",
	"liveReload"
].map((key) => ({
	path: [...RETIRED_CANVAS_HOST_CONFIG_PATH, key],
	message: `${[...RETIRED_CANVAS_HOST_CONFIG_PATH, key].join(".")} is retired. Run "openclaw doctor --fix".`
}))];
/** Removes retired file-host config while preserving the surviving enablement switch. */
function normalizeCompatibilityConfig({ cfg }) {
	return migrateCanvasHostConfig(cfg) ?? {
		config: cfg,
		changes: []
	};
}
function resolveLegacyDocumentsDir(params) {
	const configuredRoot = readStringValue(asOptionalRecord(resolvePluginConfigObject(params.config, "canvas")?.host)?.root)?.trim();
	if (!configuredRoot) return null;
	const legacyDir = path.join(path.resolve(resolveUserPath(configuredRoot, params.env)), "documents");
	return legacyDir === path.resolve(params.stateDir, "canvas", "documents") ? null : legacyDir;
}
async function listDocumentIds(documentsDir) {
	try {
		return (await fs.readdir(documentsDir, { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => entry.name).toSorted();
	} catch {
		return [];
	}
}
const stateMigrations = [{
	id: "canvas-custom-root-documents-to-core",
	label: "Canvas documents in a custom host root",
	async detectLegacyState(params) {
		const legacyDir = resolveLegacyDocumentsDir(params);
		if (!legacyDir) return null;
		const documentIds = await listDocumentIds(legacyDir);
		if (documentIds.length === 0) return null;
		return { preview: [`- Canvas documents: ${legacyDir} -> ${path.resolve(params.stateDir, "canvas", "documents")} (${documentIds.length} document(s))`] };
	},
	async migrateLegacyState(params) {
		const changes = [];
		const warnings = [];
		const legacyDir = resolveLegacyDocumentsDir(params);
		if (!legacyDir) return {
			changes,
			warnings
		};
		const documentIds = await listDocumentIds(legacyDir);
		if (documentIds.length === 0) return {
			changes,
			warnings
		};
		const coreDir = path.resolve(params.stateDir, "canvas", "documents");
		await fs.mkdir(coreDir, { recursive: true });
		let migrated = 0;
		for (const documentId of documentIds) {
			const sourceDir = path.join(legacyDir, documentId);
			const targetDir = path.join(coreDir, documentId);
			let tempParent;
			try {
				if (await pathExists(targetDir)) throw new Error("core target already exists");
				tempParent = await fs.mkdtemp(path.join(coreDir, ".canvas-migrate-"));
				const tempDocumentDir = path.join(tempParent, documentId);
				await fs.cp(sourceDir, tempDocumentDir, {
					recursive: true,
					errorOnExist: true,
					force: false
				});
				if (await pathExists(targetDir)) throw new Error("core target was created during migration");
				await fs.rename(tempDocumentDir, targetDir);
				await fs.rm(sourceDir, {
					recursive: true,
					force: true
				});
				migrated += 1;
			} catch (error) {
				warnings.push(`Skipped Canvas document ${documentId}; core target may already exist: ${String(error)}`);
			} finally {
				if (tempParent) await fs.rm(tempParent, {
					recursive: true,
					force: true
				}).catch(() => void 0);
			}
		}
		if (migrated > 0) changes.push(`Migrated ${migrated} Canvas document(s) into core storage`);
		try {
			if ((await fs.readdir(legacyDir)).length === 0) await fs.rmdir(legacyDir);
		} catch {}
		return {
			changes,
			warnings
		};
	}
}];
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig, stateMigrations };
