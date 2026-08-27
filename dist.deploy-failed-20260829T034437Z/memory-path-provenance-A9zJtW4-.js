import { t as isPathStrictlyInside } from "./path-guards-CQoZeoCG.js";
import { i as readMemoryArtifactProvenance } from "./memory-artifact-provenance-DT0NglMM.js";
import "./file-access-runtime-DRZWsOJC.js";
import "./memory-core-host-runtime-core-l5CDi0zI.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/memory-core/src/memory/memory-path-provenance.ts
async function resolveMemoryPathClassification(params) {
	if (params.source !== "memory") return {
		curatedRoot: false,
		originClass: "untrusted"
	};
	let workspacePath;
	let filePath;
	try {
		[workspacePath, filePath] = await Promise.all([fs.realpath(params.workspaceDir), fs.realpath(params.absolutePath)]);
	} catch {
		return {
			curatedRoot: false,
			originClass: "untrusted"
		};
	}
	if (!isPathStrictlyInside(workspacePath, filePath)) return {
		curatedRoot: false,
		originClass: "untrusted"
	};
	const relativePath = path.relative(workspacePath, filePath);
	const segments = relativePath.split(path.sep);
	const curatedRoot = segments.length === 1 && (segments[0] === "MEMORY.md" || segments[0] === "memory.md" || segments[0] === "USER.md");
	if (segments.length === 1 && (segments[0] === "DREAMS.md" || segments[0] === "dreams.md") || segments[0] === "memory" && (segments[1] === "dreaming" || segments[1] === ".dreams")) return {
		curatedRoot,
		originClass: "system"
	};
	const isWorkspaceMemory = curatedRoot || segments[0] === "memory" && segments.at(-1)?.endsWith(".md") === true;
	const normalizedRelativePath = relativePath.replaceAll(path.sep, "/");
	const recorded = isWorkspaceMemory ? await readMemoryArtifactProvenance({
		workspaceDir: params.workspaceDir,
		relativePath: normalizedRelativePath
	}) : void 0;
	if (recorded) return {
		curatedRoot,
		originClass: recorded.originClass
	};
	return {
		curatedRoot,
		originClass: isWorkspaceMemory ? "agent" : "untrusted"
	};
}
//#endregion
export { resolveMemoryPathClassification as t };
