import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { c as AnsiSequenceStripper, i as stripAnsiForStreamChunk } from "./ansi-9qL8iF9E.js";
import { t as killProcessTree$1 } from "./kill-tree-B-nnBWyI.js";
import { fileURLToPath } from "node:url";
import fs, { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import path, { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
//#region src/agents/config.ts
/**
* Resolves package assets and per-user agent directories for the CLI/runtime.
*
* These helpers must work from source, dist, and Bun single-file binaries.
*/
const currentDir = dirname(fileURLToPath(import.meta.url));
/**
* Detect if we're running as a Bun compiled binary.
* Bun binaries have import.meta.url containing "$bunfs", "~BUN", or "%7EBUN" (Bun's virtual filesystem path)
*/
const isBunBinary = import.meta.url.includes("$bunfs") || import.meta.url.includes("~BUN") || import.meta.url.includes("%7EBUN");
/**
* Get the base directory for resolving package assets (themes, package.json, README.md, CHANGELOG.md).
* - For Bun binary: returns the directory containing the executable
* - For Node.js (dist/): returns currentDir (the dist/ directory)
* - For tsx (src/): returns parent directory (the package root)
*/
function getPackageDir() {
	const envDir = process.env.OPENCLAW_PACKAGE_DIR;
	if (envDir) {
		if (envDir === "~") return homedir();
		if (envDir.startsWith("~/")) return homedir() + envDir.slice(1);
		return envDir;
	}
	if (isBunBinary) return dirname(process.execPath);
	let dir = currentDir;
	while (dir !== dirname(dir)) {
		if (existsSync(join(dir, "package.json"))) return dir;
		dir = dirname(dir);
	}
	return currentDir;
}
/** Get path to package.json */
function getPackageJsonPath() {
	return join(getPackageDir(), "package.json");
}
/** Get path to README.md */
function getReadmePath() {
	return resolve(join(getPackageDir(), "README.md"));
}
/** Get path to docs directory */
function getDocsPath() {
	return resolve(join(getPackageDir(), "docs"));
}
/** Get path to examples directory */
function getExamplesPath() {
	return resolve(join(getPackageDir(), "examples"));
}
const pkg = JSON.parse(readFileSync(getPackageJsonPath(), "utf-8"));
const APP_NAME = pkg.openclawConfig?.name || "openclaw";
const CONFIG_DIR_NAME = pkg.openclawConfig?.configDir || ".openclaw";
const PACKAGE_MANIFEST_VERSION = pkg.version || "0.0.0";
const ENV_AGENT_DIR = `${APP_NAME.toUpperCase()}_AGENT_DIR`;
function expandTildePath(path) {
	if (path === "~") return homedir();
	if (path.startsWith("~/")) return homedir() + path.slice(1);
	return path;
}
/** Get the agent config directory (e.g., ~/.openclaw/agent/) */
function getAgentDir() {
	const envDir = process.env[ENV_AGENT_DIR];
	if (envDir) return expandTildePath(envDir);
	return join(homedir(), CONFIG_DIR_NAME, "agent");
}
/** Get path to managed binaries directory (fd, rg) */
function getBinDir() {
	return join(getAgentDir(), "bin");
}
//#endregion
//#region src/agents/shell-utils.ts
/**
* Shell execution helpers.
*
* Resolves platform shell commands, sanitizes binary output, and exposes process-tree cleanup.
*/
function createArgvShellConfig(shell, args) {
	return {
		shell,
		args,
		commandTransport: "argv"
	};
}
function resolvePowerShellPath() {
	const programFiles = process.env.ProgramFiles || process.env.PROGRAMFILES || "C:\\Program Files";
	const pwsh7 = path.join(programFiles, "PowerShell", "7", "pwsh.exe");
	if (fs.existsSync(pwsh7)) return pwsh7;
	const programW6432 = process.env.ProgramW6432;
	if (programW6432 && programW6432 !== programFiles) {
		const pwsh7Alt = path.join(programW6432, "PowerShell", "7", "pwsh.exe");
		if (fs.existsSync(pwsh7Alt)) return pwsh7Alt;
	}
	const pwshInPath = resolveShellFromPath("pwsh");
	if (pwshInPath) return pwshInPath;
	const systemRoot = process.env.SystemRoot || process.env.WINDIR;
	if (systemRoot) {
		const candidate = path.join(systemRoot, "System32", "WindowsPowerShell", "v1.0", "powershell.exe");
		if (fs.existsSync(candidate)) return candidate;
	}
	return "powershell.exe";
}
const NON_INTERACTIVE_SHELLS = /* @__PURE__ */ new Set(["false", "nologin"]);
function isNonInteractiveShell(shellPath) {
	if (!shellPath) return false;
	return NON_INTERACTIVE_SHELLS.has(path.basename(shellPath));
}
function getPosixShellArgs(shellPath) {
	switch (path.basename(shellPath)) {
		case "bash": return [
			"--noprofile",
			"--norc",
			"-c"
		];
		case "zsh": return ["-f", "-c"];
		case "fish": return ["--no-config", "-c"];
		default: return ["-c"];
	}
}
function resolveWindowsBashPath(env = process.env) {
	const candidates = [env.ProgramFiles, env["ProgramFiles(x86)"]].filter((dir) => Boolean(dir?.trim())).map((dir) => path.join(dir, "Git", "bin", "bash.exe"));
	for (const candidate of candidates) if (fs.existsSync(candidate)) return candidate;
	return resolveShellFromPath("bash.exe", env) ?? resolveShellFromPath("bash", env);
}
const WINDOWS_GIT_BASH_CACHE_LIMIT = 16;
const windowsGitBashUsrBinCache = /* @__PURE__ */ new Map();
let defaultWindowsGitBashUsrBinResolved = false;
let defaultWindowsGitBashUsrBin;
function resolveWindowsGitBashUsrBin(shellPath) {
	const cacheKey = path.resolve(shellPath).toLowerCase();
	if (windowsGitBashUsrBinCache.has(cacheKey)) return windowsGitBashUsrBinCache.get(cacheKey);
	const normalized = path.normalize(shellPath);
	const shellName = path.basename(normalized).toLowerCase();
	const binDir = path.dirname(normalized);
	let gitRoot;
	if ((shellName === "bash.exe" || shellName === "bash") && path.basename(binDir).toLowerCase() === "bin") {
		const parent = path.dirname(binDir);
		gitRoot = path.basename(parent).toLowerCase() === "usr" ? path.dirname(parent) : parent;
	}
	const usrBin = gitRoot ? path.join(gitRoot, "usr", "bin") : void 0;
	const resolved = gitRoot && fs.existsSync(path.join(gitRoot, "cmd", "git.exe")) && usrBin && fs.existsSync(usrBin) ? usrBin : void 0;
	pruneMapToMaxSize(windowsGitBashUsrBinCache, WINDOWS_GIT_BASH_CACHE_LIMIT - 1);
	windowsGitBashUsrBinCache.set(cacheKey, resolved);
	return resolved;
}
function getWindowsGitBashUsrBin(shellPath) {
	if (process.platform !== "win32") return;
	if (shellPath) return resolveWindowsGitBashUsrBin(shellPath);
	if (!defaultWindowsGitBashUsrBinResolved) {
		defaultWindowsGitBashUsrBinResolved = true;
		const resolvedShell = resolveWindowsBashPath();
		defaultWindowsGitBashUsrBin = resolvedShell ? resolveWindowsGitBashUsrBin(resolvedShell) : void 0;
	}
	return defaultWindowsGitBashUsrBin;
}
function isLegacyWslBashPath(shellPath) {
	const normalized = shellPath.replace(/\//g, "\\").toLowerCase();
	return /(?:^|\\)windows\\(?:system32|sysnative)\\bash\.exe$/.test(normalized);
}
function resolveBashCommandConfig(shell) {
	if (isLegacyWslBashPath(shell)) return {
		shell,
		args: ["-s"],
		commandTransport: "stdin"
	};
	return createArgvShellConfig(shell, process.platform === "win32" ? ["-c"] : getPosixShellArgs(shell));
}
function buildShellCommandInvocation(command, config) {
	if (config.commandTransport === "stdin") return {
		argv: [config.shell, ...config.args],
		input: command,
		stdin: "pipe"
	};
	return {
		argv: [
			config.shell,
			...config.args,
			command
		],
		stdin: "ignore"
	};
}
function getShellConfig(customShellPath) {
	if (customShellPath) {
		if (!fs.existsSync(customShellPath)) throw new Error(`Custom shell path not found: ${customShellPath}`);
		return createArgvShellConfig(customShellPath, getPosixShellArgs(customShellPath));
	}
	if (process.platform === "win32") return createArgvShellConfig(resolvePowerShellPath(), [
		"-NoProfile",
		"-NonInteractive",
		"-Command"
	]);
	const rawEnvShell = process.env.SHELL?.trim();
	const envShell = rawEnvShell && !isNonInteractiveShell(rawEnvShell) ? rawEnvShell : void 0;
	if ((envShell ? path.basename(envShell) : "") === "fish") {
		const bash = resolveShellFromPath("bash");
		if (bash) return createArgvShellConfig(bash, getPosixShellArgs(bash));
		const sh = resolveShellFromPath("sh");
		if (sh) return createArgvShellConfig(sh, getPosixShellArgs(sh));
	}
	if (envShell) return createArgvShellConfig(envShell, getPosixShellArgs(envShell));
	const shell = resolveShellFromPath("sh") ?? resolveShellFromPath("bash") ?? "sh";
	return createArgvShellConfig(shell, getPosixShellArgs(shell));
}
function getBashShellConfig(customShellPath) {
	if (customShellPath) {
		if (!fs.existsSync(customShellPath)) throw new Error(`Custom shell path not found: ${customShellPath}`);
		return resolveBashCommandConfig(customShellPath);
	}
	if (process.platform === "win32") {
		const bash = resolveWindowsBashPath();
		if (bash) return resolveBashCommandConfig(bash);
		throw new Error("No bash shell found. Install Git for Windows or add bash.exe to PATH.");
	}
	if (fs.existsSync("/bin/bash")) return resolveBashCommandConfig("/bin/bash");
	return resolveBashCommandConfig(resolveShellFromPath("bash") ?? resolveShellFromWhich("bash") ?? resolveShellFromPath("sh") ?? "sh");
}
function resolveShellFromPath(name, env = process.env) {
	const envPath = env.PATH ?? "";
	if (!envPath) return;
	const entries = envPath.split(path.delimiter).filter(Boolean);
	const executableNames = process.platform === "win32" && !path.extname(name) ? [`${name}.exe`, name] : [name];
	for (const executableName of executableNames) for (const entry of entries) {
		const candidate = path.join(entry, executableName);
		try {
			fs.accessSync(candidate, fs.constants.X_OK);
			return candidate;
		} catch {}
	}
}
function resolveShellFromWhich(name) {
	if (process.platform === "win32") return;
	try {
		const result = spawnSync("which", [name], {
			encoding: "utf8",
			timeout: 5e3,
			windowsHide: true
		});
		if (result.status !== 0 || !result.stdout) return;
		return result.stdout.trim().split(/\r?\n/)[0]?.trim() || void 0;
	} catch {
		return;
	}
}
function normalizeShellName(value) {
	const trimmed = value.trim();
	if (!trimmed) return "";
	return path.basename(trimmed).replace(/\.(exe|cmd|bat)$/i, "").replace(/[^a-zA-Z0-9_-]/g, "");
}
function detectRuntimeShell() {
	const overrideShell = process.env.OPENCLAW_SHELL?.trim();
	if (overrideShell) {
		const name = normalizeShellName(overrideShell);
		if (name) return name;
	}
	if (process.platform === "win32") {
		if (process.env.POWERSHELL_DISTRIBUTION_CHANNEL) return "pwsh";
		return "powershell";
	}
	const envShell = process.env.SHELL?.trim();
	if (envShell && !isNonInteractiveShell(envShell)) {
		const name = normalizeShellName(envShell);
		if (name) return name;
	}
	if (process.env.POWERSHELL_DISTRIBUTION_CHANNEL) return "pwsh";
	if (process.env.BASH_VERSION) return "bash";
	if (process.env.ZSH_VERSION) return "zsh";
	if (process.env.FISH_VERSION) return "fish";
	if (process.env.KSH_VERSION) return "ksh";
	if (process.env.NU_VERSION || process.env.NUSHELL_VERSION) return "nu";
}
function sanitizeBinaryOutput(text, options) {
	return sanitizeStrippedBinaryOutput(stripAnsiForStreamChunk(text, { compatibilityGrammar: options?.ansiMode === "compat" }));
}
/** Keep one ANSI parser per process stream so control sequences can span callbacks. */
function createStreamingBinaryOutputSanitizer() {
	const ansiStripper = new AnsiSequenceStripper();
	return (text) => sanitizeStrippedBinaryOutput(ansiStripper.write(text));
}
function sanitizeStrippedBinaryOutput(text) {
	const scrubbed = text.replace(/[\p{Format}\p{Surrogate}]/gu, "");
	if (!scrubbed) return scrubbed;
	const chunks = [];
	for (const char of scrubbed) {
		const code = char.codePointAt(0);
		if (code == null) continue;
		if (code === 9 || code === 10 || code === 13) {
			chunks.push(char);
			continue;
		}
		if (code < 32 || code >= 127 && code <= 159) {
			chunks.push(`\\x${code.toString(16).padStart(2, "0")}`);
			continue;
		}
		chunks.push(char);
	}
	return chunks.join("");
}
function getShellEnv(sourceEnv) {
	const binDir = getBinDir();
	const pathKeys = Object.keys(sourceEnv).filter((key) => key.toLowerCase() === "path");
	const sourcePathKey = process.platform === "win32" ? pathKeys.toSorted()[0] : pathKeys[0];
	const pathKey = process.platform === "win32" ? "PATH" : sourcePathKey ?? "PATH";
	const currentPath = sourcePathKey ? sourceEnv[sourcePathKey] ?? "" : "";
	const updatedPath = currentPath.split(path.delimiter).filter(Boolean).includes(binDir) ? currentPath : [binDir, currentPath].filter(Boolean).join(path.delimiter);
	const env = { ...sourceEnv };
	if (process.platform === "win32") for (const key of pathKeys) delete env[key];
	env[pathKey] = updatedPath;
	return env;
}
function getBashShellEnv(shellPath, sourceEnv = process.env) {
	const env = getShellEnv(sourceEnv);
	const usrBin = getWindowsGitBashUsrBin(shellPath);
	if (!usrBin) return env;
	const pathEntries = (env.PATH ?? "").split(path.delimiter).filter(Boolean);
	const normalizedUsrBin = usrBin.toLowerCase();
	env.PATH = [usrBin, ...pathEntries.filter((entry) => entry.toLowerCase() !== normalizedUsrBin)].join(path.delimiter);
	return env;
}
function killProcessTree(pid, opts) {
	killProcessTree$1(pid, {
		force: true,
		...opts
	});
}
//#endregion
export { isBunBinary as _, getBashShellEnv as a, sanitizeBinaryOutput as c, PACKAGE_MANIFEST_VERSION as d, getAgentDir as f, getReadmePath as g, getExamplesPath as h, getBashShellConfig as i, APP_NAME as l, getDocsPath as m, createStreamingBinaryOutputSanitizer as n, getShellConfig as o, getBinDir as p, detectRuntimeShell as r, killProcessTree as s, buildShellCommandInvocation as t, CONFIG_DIR_NAME as u };
