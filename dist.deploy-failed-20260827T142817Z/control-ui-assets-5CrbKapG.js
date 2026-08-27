import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { u as normalizeStringEntries } from "./string-normalization-e_fvmxMf.js";
import { r as defaultRuntime } from "./runtime-DtFIMC-W.js";
import { n as resolveOpenClawPackageRootSync, t as resolveOpenClawPackageRoot } from "./openclaw-root-DSkQ6e_8.js";
import { r as runCommandWithTimeout } from "./exec-BL80Wdzl.js";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";
//#region src/infra/control-ui-assets.fs.runtime.ts
const existsSync$1 = fs.existsSync.bind(fs);
const readFileSync$1 = fs.readFileSync.bind(fs);
const statSync$1 = fs.statSync.bind(fs);
const realpathSync$1 = fs.realpathSync.bind(fs);
//#endregion
//#region src/infra/control-ui-assets.ts
const CONTROL_UI_DIST_PATH_SEGMENTS = [
	"dist",
	"control-ui",
	"index.html"
];
function resolveControlUiDistIndexPathForRoot(root) {
	return path.join(root, ...CONTROL_UI_DIST_PATH_SEGMENTS);
}
async function resolveControlUiDistIndexHealth(opts = {}) {
	const indexPath = opts.root ? resolveControlUiDistIndexPathForRoot(opts.root) : await resolveControlUiDistIndexPath({
		argv1: opts.argv1 ?? process.argv[1],
		moduleUrl: opts.moduleUrl
	});
	return {
		indexPath,
		exists: Boolean(indexPath && existsSync$1(indexPath))
	};
}
function resolveControlUiRepoRoot(opts) {
	const cwd = opts.cwd ?? process.cwd();
	return (opts.root ? [path.resolve(opts.root)] : [resolveOpenClawPackageRootSync({
		argv1: opts.argv1 ?? process.argv[1],
		moduleUrl: opts.moduleUrl ?? import.meta.url,
		cwd
	}), resolveOpenClawPackageRootSync({ cwd })]).find((root) => root !== null && existsSync$1(path.join(root, "ui", "vite.config.ts"))) ?? null;
}
async function resolveControlUiDistIndexPath(argv1OrOpts) {
	const argv1 = typeof argv1OrOpts === "string" ? argv1OrOpts : argv1OrOpts?.argv1 ?? process.argv[1];
	const moduleUrl = typeof argv1OrOpts === "object" ? argv1OrOpts?.moduleUrl : void 0;
	if (!argv1) return null;
	const normalized = path.resolve(argv1);
	const entrypointCandidates = [normalized];
	try {
		const realpathEntrypoint = realpathSync$1(normalized);
		if (realpathEntrypoint !== normalized) entrypointCandidates.push(realpathEntrypoint);
	} catch {}
	for (const entrypoint of entrypointCandidates) {
		const distDir = path.dirname(entrypoint);
		if (path.basename(distDir) === "dist") return path.join(distDir, "control-ui", "index.html");
	}
	const packageRoot = await resolveOpenClawPackageRoot({
		argv1: normalized,
		moduleUrl
	});
	if (packageRoot) return path.join(packageRoot, "dist", "control-ui", "index.html");
	const fallbackStartDirs = new Set(entrypointCandidates.map((candidate) => path.dirname(candidate)));
	for (const startDir of fallbackStartDirs) {
		let dir = startDir;
		for (let i = 0; i < 8; i++) {
			const pkgJsonPath = path.join(dir, "package.json");
			const indexPath = path.join(dir, "dist", "control-ui", "index.html");
			if (existsSync$1(pkgJsonPath)) try {
				const raw = readFileSync$1(pkgJsonPath, "utf-8");
				if (JSON.parse(raw).name === "openclaw") return existsSync$1(indexPath) ? indexPath : null;
				break;
			} catch {
				break;
			}
			const parent = path.dirname(dir);
			if (parent === dir) break;
			dir = parent;
		}
	}
	return null;
}
function pathsMatchByRealpathOrResolve(left, right) {
	let realLeft;
	let realRight;
	try {
		realLeft = realpathSync$1(left);
	} catch {
		realLeft = path.resolve(left);
	}
	try {
		realRight = realpathSync$1(right);
	} catch {
		realRight = path.resolve(right);
	}
	return realLeft === realRight;
}
function addCandidate(candidates, value) {
	if (!value) return;
	candidates.add(path.resolve(value));
}
function resolveControlUiRootOverrideSync(rootOverride) {
	const resolved = path.resolve(rootOverride);
	try {
		const stats = statSync$1(resolved);
		if (stats.isFile()) return path.basename(resolved) === "index.html" ? path.dirname(resolved) : null;
		if (stats.isDirectory()) {
			const indexPath = path.join(resolved, "index.html");
			return existsSync$1(indexPath) ? resolved : null;
		}
	} catch {
		return null;
	}
	return null;
}
function resolveControlUiRootSync(opts = {}) {
	const candidates = /* @__PURE__ */ new Set();
	const argv1 = opts.argv1 ?? process.argv[1];
	const cwd = opts.cwd ?? process.cwd();
	const moduleDir = opts.moduleUrl ? path.dirname(fileURLToPath(opts.moduleUrl)) : null;
	const argv1Dir = argv1 ? path.dirname(path.resolve(argv1)) : null;
	const argv1RealpathDir = (() => {
		if (!argv1) return null;
		try {
			return path.dirname(realpathSync$1(path.resolve(argv1)));
		} catch {
			return null;
		}
	})();
	const execDir = (() => {
		try {
			const execPath = opts.execPath ?? process.execPath;
			return path.dirname(realpathSync$1(execPath));
		} catch {
			return null;
		}
	})();
	const packageRoot = resolveOpenClawPackageRootSync({
		argv1,
		moduleUrl: opts.moduleUrl,
		cwd
	});
	addCandidate(candidates, execDir ? path.join(execDir, "../Resources/control-ui") : null);
	addCandidate(candidates, execDir ? path.join(execDir, "control-ui") : null);
	if (moduleDir) {
		addCandidate(candidates, path.join(moduleDir, "control-ui"));
		addCandidate(candidates, path.join(moduleDir, "../control-ui"));
		addCandidate(candidates, path.join(moduleDir, "../../dist/control-ui"));
	}
	if (argv1Dir) {
		addCandidate(candidates, path.join(argv1Dir, "dist", "control-ui"));
		addCandidate(candidates, path.join(argv1Dir, "control-ui"));
	}
	if (argv1RealpathDir && argv1RealpathDir !== argv1Dir) {
		addCandidate(candidates, path.join(argv1RealpathDir, "dist", "control-ui"));
		addCandidate(candidates, path.join(argv1RealpathDir, "control-ui"));
	}
	if (packageRoot) addCandidate(candidates, path.join(packageRoot, "dist", "control-ui"));
	addCandidate(candidates, path.join(cwd, "dist", "control-ui"));
	for (const dir of candidates) {
		const indexPath = path.join(dir, "index.html");
		if (existsSync$1(indexPath)) return dir;
	}
	return null;
}
function isPackageProvenControlUiRootSync(root, opts = {}) {
	const argv1 = opts.argv1 ?? process.argv[1];
	const cwd = opts.cwd ?? process.cwd();
	const packageRoot = resolveOpenClawPackageRootSync({
		argv1,
		moduleUrl: opts.moduleUrl,
		cwd
	});
	if (!packageRoot) return false;
	return pathsMatchByRealpathOrResolve(root, path.join(packageRoot, "dist", "control-ui"));
}
const CONTROL_UI_ASSETS_BUILD_TIMEOUT_MS = 10 * 6e4;
function controlUiAssetsFailure(message, built = false) {
	return {
		ok: false,
		built,
		message
	};
}
function findMissingControlUiStartupAsset(indexPath) {
	let html;
	try {
		if (statSync$1(indexPath).size > 256 * 1024) return "index.html exceeds its size limit";
		html = readFileSync$1(indexPath, "utf8");
	} catch {
		return "index.html";
	}
	let references = 0;
	for (const tag of html.matchAll(/<(?:link|script)\b[^>]*>/giu)) {
		const reference = tag[0].match(/\s(?:href|src)\s*=\s*["']([^"']+)["']/iu)?.[1]?.split(/[?#]/u, 1)[0]?.replace(/\\/gu, "/");
		if (!reference || /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/iu.test(reference)) continue;
		const marker = reference.lastIndexOf("assets/");
		if (marker === -1 || !/\.(?:css|js)$/iu.test(reference)) continue;
		const asset = reference.slice(marker);
		if (++references > 128 || reference.split("/").includes("..")) return references > 128 ? "too many startup assets" : asset;
		if (!existsSync$1(path.join(path.dirname(indexPath), asset))) return asset;
	}
}
function isControlUiStartupAssetsReady(root) {
	return !findMissingControlUiStartupAsset(path.join(root, "index.html"));
}
function summarizeCommandOutput(text) {
	const lines = normalizeStringEntries(text.split(/\r?\n/g));
	if (!lines.length) return;
	const last = lines.at(-1);
	if (!last) return;
	return last.length > 240 ? `${truncateUtf16Safe(last, 239)}…` : last;
}
async function ensureControlUiAssetsBuilt(runtime = defaultRuntime, opts = {}) {
	const argv1 = opts.argv1 ?? process.argv[1];
	const health = await resolveControlUiDistIndexHealth({
		...opts.root ? { root: opts.root } : {},
		argv1,
		moduleUrl: opts.moduleUrl
	});
	const indexFromDist = health.indexPath;
	let missingStartupAsset = health.exists && indexFromDist ? findMissingControlUiStartupAsset(indexFromDist) : void 0;
	if (!opts.force && health.exists && !missingStartupAsset) return {
		ok: true,
		built: false
	};
	if (!opts.force && !opts.root) {
		const detectedRoot = resolveControlUiRootSync({
			argv1,
			moduleUrl: opts.moduleUrl,
			cwd: opts.cwd,
			execPath: opts.execPath
		});
		if (detectedRoot) {
			missingStartupAsset = findMissingControlUiStartupAsset(path.join(detectedRoot, "index.html"));
			if (!missingStartupAsset) return {
				ok: true,
				built: false
			};
		}
	}
	const repoRoot = resolveControlUiRepoRoot({
		root: opts.root,
		argv1,
		moduleUrl: opts.moduleUrl,
		cwd: opts.cwd
	});
	if (!repoRoot) return controlUiAssetsFailure(`${missingStartupAsset ? `Incomplete Control UI assets${indexFromDist ? ` at ${indexFromDist}` : ""} (missing ${missingStartupAsset})` : indexFromDist ? `Missing Control UI assets at ${indexFromDist}` : "Missing Control UI assets"}. Reinstall OpenClaw to restore bundled Control UI assets.`);
	const indexPath = resolveControlUiDistIndexPathForRoot(repoRoot);
	if (!opts.force && existsSync$1(indexPath) && !findMissingControlUiStartupAsset(indexPath)) return {
		ok: true,
		built: false
	};
	const uiScript = path.join(repoRoot, "scripts", "ui.js");
	if (!existsSync$1(uiScript)) return controlUiAssetsFailure(`Control UI assets missing but ${uiScript} is unavailable.`);
	if (opts.signal?.aborted) return controlUiAssetsFailure("Control UI build canceled.");
	if (opts.onBuildStart) opts.onBuildStart();
	else runtime.log("Control UI assets missing; building them now (rerun `pnpm ui:build` after UI changes, or use `pnpm ui:dev` while developing the Control UI)…");
	let build;
	try {
		build = await runCommandWithTimeout([
			process.execPath,
			uiScript,
			"build"
		], {
			cwd: repoRoot,
			timeoutMs: opts.timeoutMs ?? 6e5,
			...opts.signal ? { signal: opts.signal } : {}
		});
	} catch (error) {
		return controlUiAssetsFailure(`Control UI build failed: ${summarizeCommandOutput(error instanceof Error ? error.message : String(error)) ?? "unknown error"}`);
	}
	if (build.termination === "signal") return controlUiAssetsFailure("Control UI build canceled.");
	if (build.termination === "timeout" || build.termination === "no-output-timeout") return controlUiAssetsFailure("Control UI build timed out.");
	if (build.code !== 0) return controlUiAssetsFailure(`Control UI build failed: ${summarizeCommandOutput(build.stderr) ?? `exit ${build.code}`}`);
	if (!existsSync$1(indexPath)) return controlUiAssetsFailure(`Control UI build completed but ${indexPath} is still missing.`, true);
	const missingBuiltAsset = findMissingControlUiStartupAsset(indexPath);
	if (missingBuiltAsset) return controlUiAssetsFailure(`Control UI build completed but startup asset ${missingBuiltAsset} is missing.`, true);
	return {
		ok: true,
		built: true
	};
}
//#endregion
export { resolveControlUiDistIndexHealth as a, resolveControlUiRootSync as c, isPackageProvenControlUiRootSync as i, ensureControlUiAssetsBuilt as n, resolveControlUiDistIndexPathForRoot as o, isControlUiStartupAssetsReady as r, resolveControlUiRootOverrideSync as s, CONTROL_UI_ASSETS_BUILD_TIMEOUT_MS as t };
