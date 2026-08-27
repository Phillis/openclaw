import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
//#region src/infra/runtime-worker-url.ts
/** Resolve a source worker sibling or its stable packaged path under dist. */
function resolveRuntimeWorkerUrl(params) {
	const currentPath = fileURLToPath(params.currentModuleUrl);
	const distIndex = currentPath.replaceAll(path.sep, "/").lastIndexOf("/dist/");
	if (distIndex >= 0) {
		const distRoot = currentPath.slice(0, distIndex + 6);
		return pathToFileURL(path.join(distRoot, params.distWorkerPath));
	}
	const extension = path.extname(currentPath) || ".js";
	return new URL(`./${params.sourceWorkerName}${extension}`, params.currentModuleUrl);
}
//#endregion
export { resolveRuntimeWorkerUrl as t };
