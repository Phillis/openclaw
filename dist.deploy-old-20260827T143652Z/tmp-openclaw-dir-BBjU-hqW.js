//#region src/infra/tmp-openclaw-dir.ts
/** Preferred shared OpenClaw temp root on POSIX systems when ownership and permissions are safe. */
const DEFAULT_POSIX_TMP_ROOT = "/tmp/openclaw";
let resolveSecureTempRootRuntime;
function loadResolveSecureTempRoot() {
	if (resolveSecureTempRootRuntime) return resolveSecureTempRootRuntime;
	const getBuiltinModule = process.getBuiltinModule;
	if (typeof getBuiltinModule !== "function") throw new Error("Node module loading is unavailable for secure temp-root resolution");
	const moduleNamespace = getBuiltinModule("module");
	if (typeof moduleNamespace.createRequire !== "function") throw new Error("Node createRequire is unavailable for secure temp-root resolution");
	resolveSecureTempRootRuntime = moduleNamespace.createRequire(import.meta.url)("@openclaw/fs-safe/temp").resolveSecureTempRoot;
	return resolveSecureTempRootRuntime;
}
/** Resolves a safe OpenClaw temp root, falling back to user-scoped os.tmpdir paths when needed. */
function resolvePreferredOpenClawTmpDir(options = {}) {
	return loadResolveSecureTempRoot()({
		...options,
		preferredDir: DEFAULT_POSIX_TMP_ROOT,
		fallbackPrefix: "openclaw",
		warningPrefix: "[openclaw]",
		unsafeFallbackLabel: "OpenClaw temp dir",
		skipPreferredOnWindows: true
	});
}
//#endregion
export { resolvePreferredOpenClawTmpDir as n, DEFAULT_POSIX_TMP_ROOT as t };
