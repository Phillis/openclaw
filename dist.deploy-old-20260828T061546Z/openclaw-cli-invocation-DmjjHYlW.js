import { u as tryProcessCwd } from "./home-dir-BFvskzn8.js";
import { t as isBunRuntime } from "./runtime-binary-nmSHaTFz.js";
import { n as resolveOpenClawPackageRootSync } from "./openclaw-root-DSkQ6e_8.js";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
//#region src/infra/openclaw-cli-invocation.ts
const requireFromHere = createRequire(import.meta.url);
const OPENCLAW_CLI_ENTRY_BASENAMES = /* @__PURE__ */ new Set(["openclaw", "openclaw.mjs"]);
const OPENCLAW_PACKAGE_ENTRY_PATHS = /* @__PURE__ */ new Set([
	path.join("dist", "entry.js"),
	path.join("dist", "entry.mjs"),
	path.join("dist", "index.js"),
	path.join("dist", "index.mjs"),
	path.join("src", "entry.ts")
]);
/** Keep child CLI launches on the parent's loader/runtime flags without inheriting its debugger. */
function filterOpenClawChildExecArgv(execArgv) {
	const filtered = [];
	for (let index = 0; index < execArgv.length; index += 1) {
		const arg = execArgv[index] ?? "";
		if (arg === "--inspect" || arg.startsWith("--inspect=") || arg === "--inspect-brk" || arg.startsWith("--inspect-brk=") || arg === "--inspect-wait" || arg.startsWith("--inspect-wait=")) {
			const next = execArgv[index + 1];
			if (!arg.includes("=") && typeof next === "string" && !next.startsWith("-")) index += 1;
			continue;
		}
		if (arg === "--inspect-port") {
			const next = execArgv[index + 1];
			if (typeof next === "string" && !next.startsWith("-")) index += 1;
			continue;
		}
		if (arg.startsWith("--inspect-port=")) continue;
		filtered.push(arg);
	}
	return filtered;
}
function resolveTrustedTsxLoader(packageRoot) {
	try {
		return requireFromHere.resolve("tsx", { paths: [packageRoot] });
	} catch {
		return null;
	}
}
function buildPackageRootCliArgs(packageRoot, execPath) {
	const sourceEntry = path.join(packageRoot, "src", "entry.ts");
	if (fs.existsSync(sourceEntry)) {
		const tsxLoader = resolveTrustedTsxLoader(packageRoot);
		return isBunRuntime(execPath) ? [sourceEntry] : tsxLoader ? [
			"--import",
			tsxLoader,
			sourceEntry
		] : [path.join(packageRoot, "openclaw.mjs")];
	}
	return [path.join(packageRoot, "openclaw.mjs")];
}
function resolveCurrentOpenClawCliInvocation(args, options = {}) {
	const execPath = options.execPath ?? process.execPath;
	const execArgv = filterOpenClawChildExecArgv(options.execArgv ?? process.execArgv);
	const entry = (options.argv1 ?? process.argv[1])?.trim();
	const cwd = options.cwd ?? tryProcessCwd();
	const entryPackageRoot = entry ? resolveOpenClawPackageRootSync({ argv1: entry }) : null;
	const packageRoot = entryPackageRoot ?? resolveOpenClawPackageRootSync({
		argv1: entry,
		cwd,
		moduleUrl: options.moduleUrl ?? import.meta.url
	});
	const invocationCwd = packageRoot ?? cwd ?? (entry ? path.dirname(path.resolve(entry)) : path.dirname(execPath));
	if (entry && entry !== execPath && entryPackageRoot && (OPENCLAW_CLI_ENTRY_BASENAMES.has(path.basename(entry)) || OPENCLAW_PACKAGE_ENTRY_PATHS.has(path.relative(path.resolve(entryPackageRoot), path.resolve(entry))))) return {
		command: execPath,
		args: [
			...execArgv,
			entry,
			...args
		],
		cwd: invocationCwd
	};
	if (packageRoot) return {
		command: execPath,
		args: [...buildPackageRootCliArgs(packageRoot, execPath), ...args],
		cwd: invocationCwd
	};
	return {
		command: execPath,
		args: [...entry && entry !== execPath ? [entry] : [], ...args],
		cwd: invocationCwd
	};
}
//#endregion
export { resolveCurrentOpenClawCliInvocation as n, filterOpenClawChildExecArgv as t };
