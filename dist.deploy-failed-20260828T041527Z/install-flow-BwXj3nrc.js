import { s as pathExists } from "./absolute-path-CYFPfAjt.js";
import "./fs-safe-CmrQUApq.js";
import { c as resolveUserPath } from "./home-dir-BFvskzn8.js";
import "./utils-Bw16L5tB.js";
import { t as extractArchive } from "./archive-BGeFIA99.js";
import { n as resolvePackedRootDir } from "./archive-C_u9XKKj.js";
import { s as withInstallWorkspace } from "./install-source-utils-D2m0UUwS.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/infra/install-flow.ts
/** Resolve and stat a user-provided install path. */
async function resolveExistingInstallPath(inputPath) {
	const resolvedPath = resolveUserPath(inputPath);
	if (!await pathExists(resolvedPath)) return {
		ok: false,
		error: `path not found: ${resolvedPath}`
	};
	return {
		ok: true,
		resolvedPath,
		stat: await fs.stat(resolvedPath)
	};
}
/** Extract an archive to a temp dir and run work against the detected package root. */
async function withExtractedArchiveRoot(params) {
	return await withInstallWorkspace(params.tempDirPrefix, async (tmpDir) => {
		const extractDir = path.join(tmpDir, "extract");
		await fs.mkdir(extractDir, { recursive: true });
		params.logger?.info?.(`Extracting ${params.archivePath}…`);
		try {
			await extractArchive({
				archivePath: params.archivePath,
				destDir: extractDir,
				timeoutMs: params.timeoutMs,
				logger: params.logger
			});
		} catch (err) {
			return {
				ok: false,
				error: `failed to extract archive: ${String(err)}`
			};
		}
		let rootDir;
		try {
			rootDir = await resolvePackedRootDir(extractDir, { rootMarkers: params.rootMarkers ? [...params.rootMarkers] : void 0 });
		} catch (err) {
			return {
				ok: false,
				error: String(err)
			};
		}
		return await params.onExtracted(rootDir);
	});
}
//#endregion
export { withExtractedArchiveRoot as n, resolveExistingInstallPath as t };
