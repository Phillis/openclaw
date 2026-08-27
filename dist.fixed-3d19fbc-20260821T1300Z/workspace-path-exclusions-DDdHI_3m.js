//#region src/gateway/worker-environments/workspace-path-exclusions.ts
const DERIVED_WORKSPACE_DIRECTORY_NAMES = [
	"__pycache__",
	".pytest_cache",
	".mypy_cache",
	".ruff_cache",
	"node_modules"
];
const DERIVED_WORKSPACE_FILE_NAMES = [".DS_Store"];
const DERIVED_WORKSPACE_FILE_SUFFIXES = [".pyc", ".pyo"];
function isDerivedWorkspacePath(relativePath) {
	return relativePath.split("/").some((segment) => DERIVED_WORKSPACE_DIRECTORY_NAMES.includes(segment) || DERIVED_WORKSPACE_FILE_NAMES.includes(segment) || DERIVED_WORKSPACE_FILE_SUFFIXES.some((suffix) => segment.endsWith(suffix)));
}
const DERIVED_WORKSPACE_RSYNC_EXCLUDES = [
	...DERIVED_WORKSPACE_DIRECTORY_NAMES,
	...DERIVED_WORKSPACE_FILE_NAMES,
	...DERIVED_WORKSPACE_FILE_SUFFIXES.map((suffix) => `*${suffix}`)
];
//#endregion
export { isDerivedWorkspacePath as a, DERIVED_WORKSPACE_RSYNC_EXCLUDES as i, DERIVED_WORKSPACE_FILE_NAMES as n, DERIVED_WORKSPACE_FILE_SUFFIXES as r, DERIVED_WORKSPACE_DIRECTORY_NAMES as t };
