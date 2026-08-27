import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { l as pathExists } from "./utils-DEqefz4f.js";
import { w as resolveStateDir } from "./paths-CqeDjSA4.js";
import { t as publishOutputFileAtomically } from "./output-file.runtime.js";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region src/cli/completion-runtime.ts
const COMPLETION_SHELLS = [
	"zsh",
	"bash",
	"powershell",
	"fish"
];
const COMPLETION_SKIP_PLUGIN_COMMANDS_ENV = "OPENCLAW_COMPLETION_SKIP_PLUGIN_COMMANDS";
/** Narrows an arbitrary shell label to a completion shell supported by installer logic. */
function isCompletionShell(value) {
	return COMPLETION_SHELLS.includes(value);
}
function resolveShellBasename(shellPath, platform = process.platform) {
	const platformBasename = platform === "win32" ? path.win32.basename(shellPath) : path.basename(shellPath);
	const winBasename = path.win32.basename(shellPath);
	return normalizeLowercaseStringOrEmpty((winBasename.length < platformBasename.length ? winBasename : platformBasename).replace(/\.(?:exe|cmd|bat)$/i, ""));
}
/** Resolves the active shell from environment paths, defaulting to zsh for unknown shells. */
function resolveShellFromEnv(env = process.env) {
	const shellPath = normalizeOptionalString(env.SHELL) ?? "";
	const shellName = shellPath ? resolveShellBasename(shellPath) : "";
	if (shellName === "zsh") return "zsh";
	if (shellName === "bash") return "bash";
	if (shellName === "fish") return "fish";
	if (shellName === "pwsh" || shellName === "powershell") return "powershell";
	return "zsh";
}
function sanitizeCompletionBasename(value) {
	const trimmed = value.trim();
	if (!trimmed) return "openclaw";
	return trimmed.replace(/[^a-zA-Z0-9._-]/g, "-");
}
function resolveCompletionCacheDir(env = process.env) {
	const stateDir = resolveStateDir(env, os.homedir);
	return path.join(stateDir, "completions");
}
function completionShellExtension(shell) {
	return shell === "powershell" ? "ps1" : shell;
}
/** Returns the per-shell cached completion script path for a sanitized CLI binary name. */
function resolveCompletionCachePath(shell, binName) {
	const basename = sanitizeCompletionBasename(binName);
	return path.join(resolveCompletionCacheDir(), `${basename}.${completionShellExtension(shell)}`);
}
/** Check if the completion cache file exists for the given shell. */
async function completionCacheExists(shell, binName = "openclaw") {
	return pathExists(resolveCompletionCachePath(shell, binName));
}
function escapePowerShellSingleQuotedString(value) {
	return value.replace(/'/g, "''");
}
function formatCompletionSourceLine(shell, cachePath) {
	if (shell === "powershell") return `. '${escapePowerShellSingleQuotedString(cachePath)}'`;
	if (shell === "fish") return `test -f "${cachePath}"; and source "${cachePath}"`;
	return `[ -f "${cachePath}" ] && source "${cachePath}"`;
}
function appendCompletionProfilePath(directory, pathApi, ...segments) {
	const nativeDirectory = pathApi.sep === "\\" ? directory.replaceAll("/", pathApi.sep) : directory;
	return `${nativeDirectory}${nativeDirectory.endsWith(pathApi.sep) ? "" : pathApi.sep}${segments.join(pathApi.sep)}`;
}
/** Formats the command users can run to reload the shell profile after installation. */
function formatCompletionReloadCommand(shell, profilePath) {
	if (shell === "powershell") return `. '${escapePowerShellSingleQuotedString(profilePath)}'`;
	if (/^[a-zA-Z0-9_./~+-]+$/u.test(profilePath)) return `source ${profilePath}`;
	const homePrefix = profilePath.startsWith("~/") ? "~/" : "";
	const value = profilePath.slice(homePrefix.length);
	return `source ${homePrefix}'${shell === "fish" ? value.replace(/[\\']/gu, "\\$&") : value.replaceAll("'", "'\\''")}'`;
}
function isCompletionProfileHeader(line) {
	return line.trim() === "# OpenClaw Completion";
}
function isCompletionProfileLine(line, binName, cachePath) {
	if (isSlowDynamicCompletionLine(line, binName)) return true;
	if (!cachePath) return false;
	const trimmed = line.trim();
	return trimmed === `source "${cachePath}"` || COMPLETION_SHELLS.some((shell) => trimmed === formatCompletionSourceLine(shell, cachePath));
}
function isPreviousCompletionSourceLine(line, currentCachePath) {
	if (!currentCachePath) return false;
	const trimmed = line.trim();
	const guarded = /^(?:\[\s+-f|test\s+-f)\s+"([^"]+)"\s*(?:\]\s*&&|;\s*and)\s+source\s+"([^"]+)"$/u.exec(trimmed);
	const direct = /^source\s+"([^"]+)"$/u.exec(trimmed);
	const powershell = /^\.\s+'((?:[^']|'')+)'$/u.exec(trimmed);
	let sourcePath;
	if (guarded && guarded[1] === guarded[2]) sourcePath = guarded[1];
	else if (direct) sourcePath = direct[1];
	else if (powershell) sourcePath = powershell[1]?.replace(/''/g, "'");
	if (!sourcePath) return false;
	const sourcePaths = sourcePath.includes("\\") ? path.win32 : path;
	if (sourcePaths.basename(sourcePaths.dirname(sourcePath)) !== "completions") return false;
	return sourcePaths.basename(sourcePath) === path.basename(currentCachePath);
}
function isOwnedCompletionInvocation(invocation, binName) {
	const [command, action, ...args] = invocation.trim().split(/\s+/u);
	if (command !== binName || action !== "completion") return false;
	if (args.length === 0) return true;
	if (args.length === 1) {
		const argument = args[0] ?? "";
		return isCompletionShell(argument.startsWith("--shell=") ? argument.slice(8) : argument.startsWith("-s") && argument.length > 2 ? argument.slice(2).replace(/^=/u, "") : argument);
	}
	return args.length === 2 && (args[0] === "--shell" || args[0] === "-s") && isCompletionShell(args[1] ?? "");
}
/** Check if a line uses an owned slow dynamic completion pattern (source <(...)). */
function isSlowDynamicCompletionLine(line, binName) {
	const trimmed = line.trim();
	const dynamicMarker = `<(${binName} completion`;
	const markerIndex = trimmed.indexOf(dynamicMarker);
	if (markerIndex >= 0) {
		const expression = trimmed.slice(markerIndex);
		return /^(?:(?:\[\s+-f\s+[^\]]+\]\s*&&\s*)?(?:source|\.))\s*$/u.test(trimmed.slice(0, markerIndex).trimEnd()) && expression.endsWith(")") && isOwnedCompletionInvocation(expression.slice(2, -1), binName);
	}
	const invocationIndex = trimmed.indexOf(`${binName} completion`);
	if (invocationIndex < 0) return false;
	const invocationPrefix = trimmed.slice(0, invocationIndex).trimEnd();
	const evalPrefix = /^eval\s+(["']?)\$\($/u.exec(invocationPrefix);
	if (evalPrefix) {
		const invocation = trimmed.slice(invocationIndex);
		const closing = `)${evalPrefix[1] ?? ""}`;
		return invocation.endsWith(closing) && isOwnedCompletionInvocation(invocation.slice(0, -closing.length), binName);
	}
	if (invocationIndex !== 0 || /[;&]/u.test(trimmed)) return false;
	const pipeline = trimmed.split("|").map((stage) => stage.trim());
	const terminal = pipeline.at(-1) ?? "";
	return isOwnedCompletionInvocation(pipeline[0] ?? "", binName) && /^(?:source|Invoke-Expression|iex)$/iu.test(terminal) && (pipeline.length === 2 || pipeline.length === 3 && /^Out-String$/iu.test(pipeline[1] ?? ""));
}
function updateCompletionProfile(content, binName, cachePath, sourceLine) {
	const lines = content.split("\n");
	const filtered = [];
	let hadExisting = false;
	for (let i = 0; i < lines.length; i += 1) {
		const line = lines[i] ?? "";
		if (isCompletionProfileHeader(line)) {
			hadExisting = true;
			const following = lines[i + 1] ?? "";
			if (isCompletionProfileLine(following, binName, cachePath) || isPreviousCompletionSourceLine(following, cachePath)) i += 1;
			continue;
		}
		if (isCompletionProfileLine(line, binName, cachePath)) {
			hadExisting = true;
			continue;
		}
		filtered.push(line);
	}
	const trimmed = filtered.join("\n").trimEnd();
	const block = `# OpenClaw Completion\n${sourceLine}`;
	const next = trimmed ? `${trimmed}\n\n${block}\n` : `${block}\n`;
	return {
		next,
		changed: next !== content,
		hadExisting
	};
}
async function resolveCompletionProfileWritePath(profilePath) {
	const profileDir = path.dirname(profilePath);
	await fs$1.mkdir(profileDir, { recursive: true });
	const canonicalDir = await fs$1.realpath(profileDir);
	try {
		return await fs$1.realpath(profilePath);
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
	}
	const linkTarget = await fs$1.readlink(profilePath).catch((error) => {
		const code = error.code;
		if (code === "ENOENT" || code === "EINVAL") return;
		throw error;
	});
	if (linkTarget === void 0) return path.join(canonicalDir, path.basename(profilePath));
	const targetPath = path.isAbsolute(linkTarget) ? linkTarget : `${canonicalDir}${path.sep}${linkTarget}`;
	const targetDir = path.dirname(targetPath);
	await fs$1.mkdir(targetDir, { recursive: true });
	return path.join(await fs$1.realpath(targetDir), path.basename(targetPath));
}
/** Resolves the shell startup profile path that should contain the OpenClaw completion block. */
function resolveCompletionProfilePath(shell, options = {}) {
	const env = options.env ?? process.env;
	const homeDir = options.homeDir ?? os.homedir;
	const platform = options.platform ?? process.platform;
	const pathApi = platform === "win32" ? path.win32 : path.posix;
	const home = env.HOME || homeDir();
	if (shell === "zsh") return appendCompletionProfilePath(env.ZDOTDIR === void 0 ? home : env.ZDOTDIR || pathApi.sep, pathApi, ".zshrc");
	if (shell === "bash") {
		const bashrc = appendCompletionProfilePath(home, pathApi, ".bashrc");
		return existsSync(bashrc) ? bashrc : appendCompletionProfilePath(home, pathApi, ".bash_profile");
	}
	if (shell === "fish") {
		const configuredHome = env.XDG_CONFIG_HOME;
		return appendCompletionProfilePath(configuredHome && pathApi.isAbsolute(configuredHome) ? configuredHome : appendCompletionProfilePath(home, pathApi, ".config"), pathApi, "fish", "config.fish");
	}
	if (platform === "win32") {
		const shellPath = normalizeOptionalString(env.SHELL) ?? "";
		const profileDirectory = (shellPath ? resolveShellBasename(shellPath, platform) : "") === "powershell" ? "WindowsPowerShell" : "PowerShell";
		return appendCompletionProfilePath(env.USERPROFILE || home, pathApi, "Documents", profileDirectory, "Microsoft.PowerShell_profile.ps1");
	}
	return appendCompletionProfilePath(home, pathApi, ".config", "powershell", "Microsoft.PowerShell_profile.ps1");
}
/** Formats the resolved startup profile relative to HOME when that preserves its actual location. */
function resolveCompletionProfileHint(shell) {
	const profilePath = resolveCompletionProfilePath(shell);
	if (shell === "powershell") return profilePath;
	if (!path.isAbsolute(profilePath)) return profilePath.startsWith(`.${path.sep}`) || profilePath.startsWith(`..${path.sep}`) ? profilePath : `.${path.sep}${profilePath}`;
	const home = process.env.HOME;
	return home && profilePath.startsWith(`${home}${path.sep}`) ? `~/${profilePath.slice(home.length + 1)}` : profilePath;
}
/** Returns whether a shell profile already contains an OpenClaw completion block or source line. */
async function isCompletionInstalled(shell, binName = "openclaw") {
	const profilePath = resolveCompletionProfilePath(shell);
	if (!await pathExists(profilePath)) return false;
	const cachePath = resolveCompletionCachePath(shell, binName);
	return (await fs$1.readFile(profilePath, "utf-8")).split("\n").some((line) => isCompletionProfileLine(line, binName, cachePath));
}
/**
* Check if the profile uses the slow dynamic completion pattern.
* Returns true if profile has `source <(openclaw completion ...)` instead of cached file.
*/
async function usesSlowDynamicCompletion(shell, binName = "openclaw") {
	const profilePath = resolveCompletionProfilePath(shell);
	if (!await pathExists(profilePath)) return false;
	const cachePath = resolveCompletionCachePath(shell, binName);
	const lines = (await fs$1.readFile(profilePath, "utf-8")).split("\n");
	for (const line of lines) if (isSlowDynamicCompletionLine(line, binName) && !line.includes(cachePath)) return true;
	return false;
}
async function installCompletion(shell, yes, binName = "openclaw") {
	if (!isCompletionShell(shell)) throw new Error(`Automated installation not supported for ${shell} yet.`);
	const cachePath = resolveCompletionCachePath(shell, binName);
	if (!await pathExists(cachePath)) throw new Error(`Completion cache not found at ${cachePath}. Run \`${binName} completion --write-state\` first.`);
	const profilePath = resolveCompletionProfilePath(shell);
	const sourceLine = formatCompletionSourceLine(shell, cachePath);
	try {
		let content;
		try {
			content = await fs$1.readFile(profilePath, "utf-8");
		} catch (error) {
			if (error.code !== "ENOENT") throw error;
			if (!yes) console.warn(`Profile not found at ${profilePath}. Creating a new one.`);
			content = "";
		}
		const update = updateCompletionProfile(content, binName, cachePath, sourceLine);
		if (!update.changed) {
			if (!yes) console.log(`Completion already installed in ${profilePath}`);
			return;
		}
		if (!yes) {
			const action = update.hadExisting ? "Updating" : "Installing";
			console.log(`${action} completion in ${profilePath}...`);
		}
		await publishOutputFileAtomically({
			filePath: await resolveCompletionProfileWritePath(profilePath),
			tempPrefix: ".openclaw-completion-profile",
			durable: true,
			writeTemp: async (tempPath) => {
				await fs$1.writeFile(tempPath, update.next, {
					encoding: "utf-8",
					flag: "wx"
				});
			}
		});
		if (!yes) console.log(`Completion installed. Restart your shell or run: ${formatCompletionReloadCommand(shell, resolveCompletionProfileHint(shell))}`);
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		throw new Error(`Failed to install completion: ${message}`, { cause: err });
	}
}
//#endregion
export { installCompletion as a, resolveCompletionCachePath as c, resolveShellFromEnv as d, usesSlowDynamicCompletion as f, formatCompletionReloadCommand as i, resolveCompletionProfileHint as l, COMPLETION_SKIP_PLUGIN_COMMANDS_ENV as n, isCompletionInstalled as o, completionCacheExists as r, isCompletionShell as s, COMPLETION_SHELLS as t, resolveCompletionProfilePath as u };
