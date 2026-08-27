import { d as isRootVersionInvocation } from "./argv-CCdO9MSu.js";
import { t as parseNodeOptionsEnvVar } from "./node-options-W869vrJq.js";
import { r as resolveCliContainerTarget } from "./container-target-DeeG-3q9.js";
import Module from "node:module";
import process$1 from "node:process";
//#region src/entry.esm-resolve-fast-path.ts
/**
* Short-circuits Node's ESM resolution for dist-internal relative imports.
*
* Node's default resolver calls getPackageScopeConfig() for every file: URL to
* pick a module format, and each call re-materializes the package.json
* `exports` map. With openclaw's 300+ subpath exports that costs ~0.1ms per
* resolution and multiple seconds across the ~15k module edges of a gateway
* boot. Every built dist file is ESM (all dist package.json files declare
* "type": "module"), so a relative "./chunk.js" import inside dist can resolve
* by URL join with format "module" without consulting the package scope at
* all. This hook removes only resolver cost; the resolved URL and format are
* byte-identical to Node's default resolution.
*/
const moduleWithHooks = Module;
const installedDistRootUrls = /* @__PURE__ */ new Set();
const NODE_RESOLVER_HOOK_OPTIONS = /* @__PURE__ */ new Set([
	"--import",
	"--require",
	"-r",
	"--loader",
	"--experimental-loader",
	"--experimental-config-file",
	"--experimental-default-config-file"
]);
const normalizeNodeOptionName = (token) => (token.split("=", 1)[0] ?? "").replaceAll("_", "-");
function hasNodeResolverHookOption(execArgv, nodeOptions) {
	const envOptions = parseNodeOptionsEnvVar(nodeOptions);
	return envOptions === null || [...execArgv, ...envOptions].some((token) => NODE_RESOLVER_HOOK_OPTIONS.has(normalizeNodeOptionName(token)));
}
/**
* Resolves a dist-internal relative ESM specifier to its final file URL, or
* returns null when the specifier must go through Node's default resolution.
* Only relative ".js" specifiers whose parent and target both live under the
* dist root qualify; require() resolutions stay on the default path because
* the CJS loader does not pay the eager format-detection cost this bypasses.
*/
function resolveDistEsmFastPathUrl(params) {
	const { specifier, parentUrl } = params;
	if (specifier.charCodeAt(0) !== 46 || !specifier.endsWith(".js") || parentUrl === void 0 || !parentUrl.startsWith(params.distRootUrl) || params.conditions?.includes("require") === true || specifier.charCodeAt(1) !== 47 && (specifier.charCodeAt(1) !== 46 || specifier.charCodeAt(2) !== 47)) return null;
	let resolved;
	try {
		resolved = new URL(specifier, parentUrl).href;
	} catch {
		return null;
	}
	return resolved.startsWith(params.distRootUrl) ? resolved : null;
}
/**
* Installs the dist-relative ESM resolve fast path for a built entry file.
* No-ops (returns false) outside a dist layout — source checkouts run through
* tsx/vitest resolvers that must keep owning ".js" specifier rewrites — and
* on runtimes without Module.registerHooks.
*/
function installDistEsmResolveFastPath(entryFileUrl, deps = {}) {
	const registerHooks = "registerHooks" in deps ? deps.registerHooks : moduleWithHooks.registerHooks;
	if (typeof registerHooks !== "function") return false;
	const distRootUrl = new URL("./", entryFileUrl).href;
	if (!distRootUrl.endsWith("/dist/")) return false;
	const nodeOptions = "nodeOptions" in deps ? deps.nodeOptions : process$1.env.NODE_OPTIONS;
	if (hasNodeResolverHookOption(deps.execArgv ?? process$1.execArgv, nodeOptions)) return false;
	if (installedDistRootUrls.has(distRootUrl)) return true;
	registerHooks({ resolve(specifier, context, nextResolve) {
		const url = resolveDistEsmFastPathUrl({
			specifier,
			parentUrl: context.parentURL,
			conditions: context.conditions,
			distRootUrl
		});
		if (url !== null) return {
			url,
			format: "module",
			shortCircuit: true
		};
		return nextResolve(specifier, context);
	} });
	installedDistRootUrls.add(distRootUrl);
	return true;
}
//#endregion
//#region src/entry.version-fast-path.ts
function tryHandleRootVersionFastPath(argv, deps = {}) {
	if (resolveCliContainerTarget(argv, deps.env)) return false;
	if (!isRootVersionInvocation(argv)) return false;
	const output = deps.output ?? ((message) => console.log(message));
	const exit = deps.exit ?? ((code) => process.exit(code));
	const onError = deps.onError ?? (async (error) => {
		const message = `[openclaw] Failed to resolve version: ${error instanceof Error ? error.stack ?? error.message : String(error)}\n`;
		try {
			const [{ loadCliDotEnv }, { formatConsoleDiagnosticBlock }] = await Promise.all([import("./dotenv-DLvHYU08.js"), import("./json-console-line-D2mHj3RF.js")]);
			loadCliDotEnv({ quiet: true });
			process.stderr.write(formatConsoleDiagnosticBlock({
				level: "error",
				message
			}));
		} catch {
			process.stderr.write(message);
		} finally {
			exit(1);
		}
	});
	(deps.resolveVersion ?? (async () => {
		const [{ VERSION }, { resolveCommitHash }] = await Promise.all([import("./version-B4pBx2Bg.js"), import("./git-commit-DYIkEZfC.js")]);
		return {
			VERSION,
			resolveCommitHash
		};
	}))().then(({ VERSION, resolveCommitHash }) => {
		const commit = resolveCommitHash({ moduleUrl: deps.moduleUrl ?? import.meta.url });
		output(commit ? `OpenClaw ${VERSION} (${commit})` : `OpenClaw ${VERSION}`);
		exit(0);
	}).catch(onError);
	return true;
}
//#endregion
export { installDistEsmResolveFastPath as n, tryHandleRootVersionFastPath as t };
