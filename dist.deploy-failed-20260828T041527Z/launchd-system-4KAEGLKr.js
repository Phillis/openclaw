import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { r as isMissingPathError } from "./errno-CkbDOfLk.js";
import { l as resolveGatewayLaunchAgentLabel } from "./constants-ChqKLfPp.js";
import "./errors-Ccx0R-_Z.js";
import { t as sanitizeForLog } from "./ansi-DjDeieuH.js";
import { t as getWindowsCmdExePath } from "./windows-install-roots-BdGcwph2.js";
import { t as execFileUtf8 } from "./exec-file-DdYGzzrr.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/daemon/launchd-exec.ts
/** Shared launchctl execution and result classification for macOS service owners. */
async function execLaunchctl(args, timeoutMs) {
	const isWindows = process.platform === "win32";
	return await execFileUtf8(isWindows ? getWindowsCmdExePath() : "launchctl", isWindows ? [
		"/d",
		"/s",
		"/c",
		"launchctl",
		...args
	] : args, {
		...isWindows ? { windowsHide: true } : {},
		...timeoutMs && timeoutMs > 0 ? {
			timeout: timeoutMs,
			killSignal: "SIGKILL"
		} : {}
	});
}
function isLaunchctlNotLoaded(result) {
	const detail = normalizeLowercaseStringOrEmpty(result.stderr || result.stdout);
	return result.termination === "exit" && (detail.includes("no such process") || detail.includes("could not find service") || detail.includes("not found"));
}
function formatLaunchctlResultDetail(result) {
	return truncateUtf16Safe(sanitizeForLog((result.stderr || result.stdout).replace(/[\r\n\t]+/g, " ")).replace(/\s+/g, " ").trim(), 1e3);
}
//#endregion
//#region src/daemon/launchd-label.ts
/** Resolves the one effective launchd label shared by lifecycle and diagnostics. */
function assertValidLaunchAgentLabel(label) {
	const trimmed = label.trim();
	if (!/^[A-Za-z0-9._-]+$/.test(trimmed)) throw new Error(`Invalid launchd label: ${sanitizeForLog(trimmed)}`);
	return trimmed;
}
function resolveLaunchAgentLabel(env) {
	const override = env?.OPENCLAW_LAUNCHD_LABEL?.trim();
	return assertValidLaunchAgentLabel(override || resolveGatewayLaunchAgentLabel(env?.OPENCLAW_PROFILE));
}
//#endregion
//#region src/daemon/launchd-plist.ts
/** Reads and renders macOS LaunchAgent plists for gateway service installs. */
const LAUNCH_AGENT_THROTTLE_INTERVAL_SECONDS = 10;
const LAUNCH_AGENT_UMASK_DECIMAL = 63;
const LAUNCH_AGENT_PROCESS_TYPE = "Interactive";
const LAUNCH_AGENT_STDIN_PATH = "/dev/null";
const LAUNCH_AGENT_ENV_WRAPPER_SHELL = "/bin/sh";
const plistEscape = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&apos;");
const plistUnescape = (value) => value.replaceAll("&apos;", "'").replaceAll("&quot;", "\"").replaceAll("&gt;", ">").replaceAll("&lt;", "<").replaceAll("&amp;", "&");
function parseLaunchdPlistLabel(contents) {
	const rawLabel = contents.match(/<key>Label<\/key>\s*<string>([\s\S]*?)<\/string>/i)?.at(1);
	return rawLabel === void 0 ? null : plistUnescape(rawLabel).trim() || null;
}
function parseGeneratedEnvValue(value) {
	const trimmed = value.trim();
	if (!trimmed.startsWith("'") || !trimmed.endsWith("'")) return trimmed;
	return trimmed.slice(1, -1).replaceAll("'\\''", "'");
}
function includesGeneratedEnvironmentPathToken(value, token) {
	return Boolean(value?.replaceAll("\\", "/").includes(token));
}
function includesGeneratedEnvironmentDirToken(value) {
	return Boolean(value?.replaceAll("\\", "/").includes("/service-env/"));
}
function resolveSiblingGeneratedEnvFilePath(envFilePath, options) {
	const label = options?.generatedEnvironmentLabel?.trim();
	if (!label) return;
	const markerIndex = envFilePath.replaceAll("\\", "/").lastIndexOf("/service-env/");
	if (markerIndex < 0) return;
	const serviceEnvDirEnd = markerIndex + 13 - 1;
	return `${envFilePath.slice(0, serviceEnvDirEnd)}/${label}.env`;
}
function isExpectedGeneratedEnvWrapperPair(wrapperPath, envFilePath, options) {
	if (!wrapperPath || !envFilePath) return false;
	if (!options) return wrapperPath.endsWith("-env-wrapper.sh");
	if (options.expectedEnvironmentWrapperPath && options.expectedEnvironmentFilePath && wrapperPath === options.expectedEnvironmentWrapperPath && envFilePath === options.expectedEnvironmentFilePath) return true;
	const label = options.generatedEnvironmentLabel?.trim();
	if (!label) return false;
	return includesGeneratedEnvironmentDirToken(wrapperPath) && includesGeneratedEnvironmentDirToken(envFilePath) && includesGeneratedEnvironmentPathToken(wrapperPath, `${label}-env-wrapper.sh`) && includesGeneratedEnvironmentPathToken(envFilePath, `${label}.env`);
}
function resolveGeneratedEnvWrapperLayout(programArguments, options) {
	if (programArguments[0] === "/bin/sh") {
		const wrapperPath = programArguments[1];
		const envFilePath = programArguments[2];
		if (isExpectedGeneratedEnvWrapperPair(wrapperPath, envFilePath, options) && envFilePath) return {
			envFilePath,
			commandStartIndex: 3
		};
	}
	const wrapperPath = programArguments[0];
	const envFilePath = programArguments[1];
	if (isExpectedGeneratedEnvWrapperPair(wrapperPath, envFilePath, options) && envFilePath) return {
		envFilePath,
		commandStartIndex: 2
	};
	return null;
}
async function readLaunchAgentEnvironmentFile(programArguments, options) {
	const layout = resolveGeneratedEnvWrapperLayout(programArguments, options);
	if (!layout) return {};
	const envFilePath = layout.envFilePath;
	let content = "";
	const candidateEnvFilePaths = Array.from(new Set([
		envFilePath,
		resolveSiblingGeneratedEnvFilePath(envFilePath, options),
		options?.expectedEnvironmentFilePath
	].filter((candidate) => Boolean(candidate))));
	for (const candidate of candidateEnvFilePaths) try {
		content = await fs.readFile(candidate, "utf8");
		break;
	} catch {}
	if (!content) return {};
	const environment = {};
	for (const rawLine of content.split(/\r?\n/)) {
		const line = rawLine.trim();
		if (!line || line.startsWith("#")) continue;
		const match = line.match(/^export\s+([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
		if (!match) continue;
		const key = match[1];
		const value = match[2];
		if (!key || value === void 0) continue;
		environment[key] = parseGeneratedEnvValue(value);
	}
	return environment;
}
function unwrapGeneratedEnvWrapperArgs(programArguments, options) {
	const layout = resolveGeneratedEnvWrapperLayout(programArguments, options);
	if (!layout) return programArguments;
	return programArguments.slice(layout.commandStartIndex);
}
const renderEnvDict = (env) => {
	if (!env) return "";
	const entries = Object.entries(env).filter(([, value]) => typeof value === "string" && value.trim());
	if (entries.length === 0) return "";
	return `\n    <key>EnvironmentVariables</key>\n    <dict>${entries.map(([key, value]) => `\n    <key>${plistEscape(key)}</key>\n    <string>${plistEscape(value?.trim() ?? "")}</string>`).join("")}\n    </dict>`;
};
async function readLaunchAgentProgramArgumentsFromFile(plistPath, options) {
	try {
		const plist = await fs.readFile(plistPath, "utf8");
		const programMatch = plist.match(/<key>ProgramArguments<\/key>\s*<array>([\s\S]*?)<\/array>/i);
		if (!programMatch) return null;
		const programArgumentsXml = programMatch.at(1);
		if (programArgumentsXml === void 0) return null;
		const args = [];
		for (const match of programArgumentsXml.matchAll(/<string>([\s\S]*?)<\/string>/gi)) {
			const rawArgument = match.at(1);
			if (rawArgument === void 0) return null;
			args.push(plistUnescape(rawArgument).trim());
		}
		const workingDirectoryXml = plist.match(/<key>WorkingDirectory<\/key>\s*<string>([\s\S]*?)<\/string>/i)?.at(1);
		const workingDirectory = workingDirectoryXml === void 0 ? "" : plistUnescape(workingDirectoryXml).trim();
		const envMatch = plist.match(/<key>EnvironmentVariables<\/key>\s*<dict>([\s\S]*?)<\/dict>/i);
		const inlineEnvironment = {};
		if (envMatch) {
			const environmentXml = envMatch.at(1);
			if (environmentXml === void 0) return null;
			for (const pair of environmentXml.matchAll(/<key>([\s\S]*?)<\/key>\s*<string>([\s\S]*?)<\/string>/gi)) {
				const rawKey = pair.at(1);
				const rawValue = pair.at(2);
				if (rawKey === void 0 || rawValue === void 0) return null;
				const key = plistUnescape(rawKey).trim();
				if (!key) continue;
				inlineEnvironment[key] = plistUnescape(rawValue).trim();
			}
		}
		const fileEnvironment = await readLaunchAgentEnvironmentFile(args, options);
		const effectiveProgramArguments = unwrapGeneratedEnvWrapperArgs(args, options);
		const environment = {
			...inlineEnvironment,
			...fileEnvironment
		};
		const environmentValueSources = {};
		for (const key of Object.keys(inlineEnvironment)) environmentValueSources[key] = Object.hasOwn(fileEnvironment, key) ? "inline-and-file" : "inline";
		for (const key of Object.keys(fileEnvironment)) environmentValueSources[key] = Object.hasOwn(inlineEnvironment, key) ? "inline-and-file" : "file";
		return {
			programArguments: effectiveProgramArguments.filter(Boolean),
			...workingDirectory ? { workingDirectory } : {},
			...Object.keys(environment).length > 0 ? { environment } : {},
			...Object.keys(environmentValueSources).length > 0 ? { environmentValueSources } : {},
			sourcePath: plistPath
		};
	} catch {
		return null;
	}
}
function buildLaunchAgentPlist({ label, comment, programArguments, workingDirectory, stdoutPath, stderrPath, environment }) {
	const argsXml = programArguments.map((arg) => `\n      <string>${plistEscape(arg)}</string>`).join("");
	const workingDirXml = workingDirectory ? `\n    <key>WorkingDirectory</key>\n    <string>${plistEscape(workingDirectory)}</string>` : "";
	const commentXml = comment?.trim() ? `\n    <key>Comment</key>\n    <string>${plistEscape(comment.trim())}</string>` : "";
	const envXml = renderEnvDict(environment);
	return `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0">\n  <dict>\n    <key>Label</key>\n    <string>${plistEscape(label)}</string>\n    ${commentXml}\n    <key>RunAtLoad</key>\n    <true/>\n    <key>KeepAlive</key>\n    <true/>\n    <key>ExitTimeOut</key>\n    <integer>20</integer>\n    <key>ProcessType</key>\n    <string>${LAUNCH_AGENT_PROCESS_TYPE}</string>\n    <key>ThrottleInterval</key>\n    <integer>${LAUNCH_AGENT_THROTTLE_INTERVAL_SECONDS}</integer>\n    <key>Umask</key>\n    <integer>${LAUNCH_AGENT_UMASK_DECIMAL}</integer>\n    <key>ProgramArguments</key>\n    <array>${argsXml}\n    </array>\n    ${workingDirXml}\n    <key>StandardInPath</key>\n    <string>${plistEscape(LAUNCH_AGENT_STDIN_PATH)}</string>\n    <key>StandardOutPath</key>\n    <string>${plistEscape(stdoutPath)}</string>\n    <key>StandardErrorPath</key>\n    <string>${plistEscape(stderrPath)}</string>${envXml}\n  </dict>\n</plist>\n`;
}
//#endregion
//#region src/daemon/launchd-system.ts
/** Detects system-domain launchd ownership before mutating a user LaunchAgent. */
const SYSTEM_LAUNCH_DAEMON_DIR = "/Library/LaunchDaemons";
const PLUTIL_PATH = "/usr/bin/plutil";
function formatUnknownError(error) {
	return truncateUtf16Safe(sanitizeForLog(error instanceof Error ? error.message : String(error)), 500);
}
function quotePosixArgument(value) {
	return /^[A-Za-z0-9_@%+=:,./-]+$/.test(value) ? value : `'${value.replaceAll("'", "'\\''")}'`;
}
/**
* Renders the package-independent ownership probe used by detached restart helpers.
* The caller must refuse activation when `openclaw_system_launchd_conflict` is non-empty.
*/
function renderSystemLaunchDaemonOwnershipShellProbe(label) {
	return `openclaw_system_launchd_conflict=""
openclaw_system_launchd_detail=""
openclaw_system_launchd_target=${quotePosixArgument(`system/${label}`)}
openclaw_system_launchd_dir=${quotePosixArgument(SYSTEM_LAUNCH_DAEMON_DIR)}
openclaw_system_launchd_label=${quotePosixArgument(label)}
openclaw_query_system_launchd() {
  openclaw_system_launchd_probe=$(launchctl print "$openclaw_system_launchd_target" 2>&1)
  openclaw_system_launchd_probe_status=$?
  # POSIX shell status 126/127 means execution failed; >128 can represent a signal.
  # Partial absence output cannot establish that the ownership query completed.
  if [ "$openclaw_system_launchd_probe_status" -eq 0 ]; then
    openclaw_system_launchd_conflict="$openclaw_system_launchd_target"
    openclaw_system_launchd_detail="loaded system LaunchDaemon $openclaw_system_launchd_target"
  elif [ "$openclaw_system_launchd_probe_status" -eq 126 ] || [ "$openclaw_system_launchd_probe_status" -eq 127 ] || [ "$openclaw_system_launchd_probe_status" -gt 128 ] ||
       ! printf '%s' "$openclaw_system_launchd_probe" | /usr/bin/grep -Eiq 'could not find service|no such process|not found'; then
    openclaw_system_launchd_conflict="$openclaw_system_launchd_target"
    openclaw_system_launchd_detail="could not verify $openclaw_system_launchd_target (exit $openclaw_system_launchd_probe_status): $openclaw_system_launchd_probe"
  fi
}
openclaw_query_system_launchd
if [ -z "$openclaw_system_launchd_conflict" ]; then
  if [ ! -e "$openclaw_system_launchd_dir" ]; then
    :
  elif [ ! -r "$openclaw_system_launchd_dir" ] || [ ! -x "$openclaw_system_launchd_dir" ]; then
    openclaw_system_launchd_conflict="$openclaw_system_launchd_dir"
    openclaw_system_launchd_detail="could not inspect $openclaw_system_launchd_dir"
  else
    openclaw_system_launchd_entries=""
    if openclaw_system_launchd_entries=$(/usr/bin/mktemp "\${TMPDIR:-/tmp}/openclaw-launchd-scan.XXXXXX" 2>&1); then
      if /usr/bin/find "$openclaw_system_launchd_dir" -mindepth 1 -maxdepth 1 -name '*.plist' -print0 >"$openclaw_system_launchd_entries"; then
        while IFS= read -r -d '' openclaw_system_launchd_plist; do
          # Unreadable plists are treated as foreign: loaded same-label daemons are caught by the
          # bracketing launchctl probes; an unloaded unreadable same-label plist is an accepted operator-created edge (#120481).
          if [ ! -r "$openclaw_system_launchd_plist" ]; then
            continue
          fi
          if openclaw_system_launchd_plist_label=$(/usr/bin/plutil -extract Label raw -o - -- "$openclaw_system_launchd_plist" 2>&1); then
            if [ "$openclaw_system_launchd_plist_label" != "$openclaw_system_launchd_label" ]; then
              continue
            fi
            openclaw_system_launchd_conflict="$openclaw_system_launchd_plist"
            openclaw_system_launchd_detail="installed same-label system LaunchDaemon plist $openclaw_system_launchd_plist"
            break
          elif /usr/bin/plutil -lint -- "$openclaw_system_launchd_plist" >/dev/null 2>&1; then
            continue
          else
            openclaw_system_launchd_conflict="$openclaw_system_launchd_plist"
            openclaw_system_launchd_detail="could not inspect system LaunchDaemon plist $openclaw_system_launchd_plist: $openclaw_system_launchd_plist_label"
            break
          fi
        done <"$openclaw_system_launchd_entries"
      else
        openclaw_system_launchd_conflict="$openclaw_system_launchd_dir"
        openclaw_system_launchd_detail="could not enumerate $openclaw_system_launchd_dir"
      fi
      /bin/rm -f "$openclaw_system_launchd_entries"
    else
      openclaw_system_launchd_conflict="$openclaw_system_launchd_dir"
      openclaw_system_launchd_detail="could not create a secure system LaunchDaemon scan snapshot: $openclaw_system_launchd_entries"
    fi
  fi
fi
if [ -z "$openclaw_system_launchd_conflict" ]; then
  openclaw_query_system_launchd
fi
`;
}
/** Reads the top-level Label through the native parser for XML and binary plists. */
async function readLaunchDaemonPlistLabel(plistPath) {
	const converted = await execFileUtf8(PLUTIL_PATH, [
		"-convert",
		"json",
		"-o",
		"-",
		"--",
		plistPath
	]);
	if (converted.code === 0) try {
		const label = JSON.parse(converted.stdout)?.Label;
		return typeof label === "string" && label.length > 0 ? {
			status: "ok",
			label
		} : { status: "unlabeled" };
	} catch (error) {
		return {
			status: "unverifiable",
			detail: formatUnknownError(error)
		};
	}
	try {
		await fs.access(plistPath, fs.constants.R_OK);
	} catch (error) {
		if (isMissingPathError(error)) return { status: "missing" };
		const code = error?.code;
		if (code === "EACCES" || code === "EPERM") return { status: "unreadable" };
		return {
			status: "unverifiable",
			detail: formatUnknownError(error)
		};
	}
	return {
		status: "unverifiable",
		detail: formatLaunchctlResultDetail(converted) || "plutil could not decode the plist"
	};
}
async function findInstalledSystemLaunchDaemon(label) {
	let entries;
	try {
		entries = await fs.readdir(SYSTEM_LAUNCH_DAEMON_DIR);
	} catch (error) {
		if (isMissingPathError(error)) return { status: "absent" };
		return {
			status: "unverifiable",
			detail: formatUnknownError(error)
		};
	}
	for (const entry of entries.filter((candidate) => candidate.endsWith(".plist")).toSorted()) {
		const plistPath = path.posix.join(SYSTEM_LAUNCH_DAEMON_DIR, entry);
		const result = await readLaunchDaemonPlistLabel(plistPath);
		if (result.status === "ok" && result.label === label) return {
			status: "installed",
			plistPath
		};
		if (result.status === "unreadable") continue;
		if (result.status === "unverifiable") return {
			status: "unverifiable",
			detail: `${plistPath}: ${result.detail}`
		};
	}
	return { status: "absent" };
}
function classifySystemLaunchDaemonQuery(serviceTarget, result) {
	if (result.code === 0) return {
		status: "loaded",
		serviceTarget
	};
	return isLaunchctlNotLoaded(result) ? {
		status: "absent",
		serviceTarget
	} : {
		status: "unverifiable",
		serviceTarget,
		operation: "launchctl",
		detail: formatLaunchctlResultDetail(result) || `exit code ${result.code}`
	};
}
async function inspectSystemLaunchDaemonOwnership(label, options = {}) {
	const serviceTarget = `system/${label}`;
	if (process.platform !== "darwin") return {
		status: "absent",
		serviceTarget
	};
	const initialQuery = classifySystemLaunchDaemonQuery(serviceTarget, await execLaunchctl(["print", serviceTarget], options.timeoutMs));
	if (initialQuery.status !== "absent") return initialQuery;
	if (options.scanInstalledPlists === false) return {
		status: "absent",
		serviceTarget
	};
	const installed = await findInstalledSystemLaunchDaemon(label);
	if (installed.status === "installed") return {
		status: "installed",
		serviceTarget,
		plistPath: installed.plistPath
	};
	if (installed.status === "unverifiable") return {
		status: "unverifiable",
		serviceTarget,
		operation: "filesystem",
		detail: installed.detail
	};
	return classifySystemLaunchDaemonQuery(serviceTarget, await execLaunchctl(["print", serviceTarget], options.timeoutMs));
}
function formatSystemLaunchDaemonOwnershipSummary(ownership) {
	switch (ownership.status) {
		case "loaded": return `System LaunchDaemon ${ownership.serviceTarget} already owns this gateway label.`;
		case "installed": return `System LaunchDaemon plist ${ownership.plistPath} already owns this gateway label.`;
		case "unverifiable": return `System LaunchDaemon ownership for ${ownership.serviceTarget} could not be verified: ${ownership.detail}`;
		default: throw new Error(`Unexpected system LaunchDaemon ownership: ${String(ownership)}`);
	}
}
function formatSystemLaunchDaemonOwnershipError(ownership) {
	const recovery = ownership.status === "loaded" ? `Keep it as the sole gateway manager, or unload it with \`sudo launchctl bootout ${ownership.serviceTarget}\` and remove its plist before retrying.` : ownership.status === "installed" ? `Keep it as the sole gateway manager, or remove or relocate ${quotePosixArgument(ownership.plistPath)} before retrying.` : "Fix the reported launchctl or filesystem access error, then retry.";
	return [
		formatSystemLaunchDaemonOwnershipSummary(ownership),
		"Refusing to create or activate a user LaunchAgent for the same label because duplicate KeepAlive managers can restart-loop the gateway.",
		"OpenClaw does not manage system LaunchDaemons, and --force does not override system ownership.",
		recovery
	].join("\n");
}
var SystemLaunchDaemonOwnershipError = class extends Error {
	constructor(ownership) {
		super(formatSystemLaunchDaemonOwnershipError(ownership));
		this.ownership = ownership;
		this.code = "SYSTEM_LAUNCH_DAEMON_OWNERSHIP";
		this.name = "SystemLaunchDaemonOwnershipError";
	}
};
function isSystemLaunchDaemonOwnershipError(error) {
	return error instanceof SystemLaunchDaemonOwnershipError;
}
async function assertNoSystemLaunchDaemonOwnership(label) {
	const ownership = await inspectSystemLaunchDaemonOwnership(label);
	if (ownership.status !== "absent") throw new SystemLaunchDaemonOwnershipError(ownership);
}
//#endregion
export { readLaunchDaemonPlistLabel as a, buildLaunchAgentPlist as c, assertValidLaunchAgentLabel as d, resolveLaunchAgentLabel as f, isLaunchctlNotLoaded as h, isSystemLaunchDaemonOwnershipError as i, parseLaunchdPlistLabel as l, formatLaunchctlResultDetail as m, formatSystemLaunchDaemonOwnershipSummary as n, renderSystemLaunchDaemonOwnershipShellProbe as o, execLaunchctl as p, inspectSystemLaunchDaemonOwnership as r, LAUNCH_AGENT_ENV_WRAPPER_SHELL as s, assertNoSystemLaunchDaemonOwnership as t, readLaunchAgentProgramArgumentsFromFile as u };
