import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import "./utils-Bw16L5tB.js";
import { t as sleep } from "./sleep-D7nua6TP.js";
import { f as resolveGatewayServiceDescription, m as resolveGatewayWindowsTaskName, s as NODE_SERVICE_KIND } from "./constants-ChqKLfPp.js";
import { n as parseTcpPort, r as parseTcpPortFromArgs } from "./tcp-port-C3gLZtJi.js";
import { t as killProcessTree } from "./kill-tree-CR2oLt9D.js";
import { a as getWindowsSystem32ExePath, r as getWindowsPowerShellExePath, t as getWindowsCmdExePath } from "./windows-install-roots-BdGcwph2.js";
import { a as resolveWindowsOemCodePage, o as resolveWindowsOemCodePageForEncoding, s as resolveWindowsOemEncoding } from "./windows-encoding-BFYUNnZu.js";
import { o as isGatewayArgv } from "./windows-port-pids-Dw25m5j1.js";
import { a as renderCmdSetAssignment, i as parseCmdSetAssignment, n as quoteCmdScriptArg, r as assertNoCmdLineBreak, t as parseCmdScriptCommandLine } from "./cmd-argv-BseV0o2O.js";
import { r as resolveGatewayTaskScriptPath } from "./paths-CzCbqt0l.js";
import { n as spawnWithFallback } from "./spawn-utils-DPql2kkW.js";
import { t as resolveGatewayServiceProbeHosts } from "./gateway-service-probe-hosts-Cnn-HT7z.js";
import { a as writeFormattedLines, n as parseKeyValueOutput, r as formatLine, t as createGatewayLifecycleMutationReporter } from "./service-mutation-DyzHamq7.js";
import { n as inspectPortUsage } from "./ports-inspect-8eZVwL-B.js";
import { t as execSchtasks } from "./schtasks-exec-DhUxMY0L.js";
import { t as findVerifiedGatewayListenerPidsOnPortSync } from "./gateway-processes-DEnCr0sT.js";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { spawnSync } from "node:child_process";
import iconv from "iconv-lite";
//#region src/infra/windows-launcher-encoding.ts
/** Encodes and decodes generated Windows launcher scripts (`.cmd` / `.vbs`). */
const UTF16LE_BOM = Buffer.from([255, 254]);
const WHATWG_VERIFIABLE_ENCODINGS = /* @__PURE__ */ new Set([
	"gbk",
	"big5",
	"shift_jis",
	"windows-874"
]);
const LAUNCHER_ENCODING_MARKER_PREFIX = "@rem openclaw-launcher-encoding=";
const LAUNCHER_ENCODING_MARKER_RE = /^@rem openclaw-launcher-encoding=(\S+)\s*$/;
const LAUNCHER_CODEPAGE_PREAMBLE_RE = /^@chcp \d+ >nul\s*$/;
function isAsciiOnly(value) {
	for (let index = 0; index < value.length; index += 1) if (value.charCodeAt(index) > 127) return false;
	return true;
}
/**
* wscript.exe reads .vbs only as ANSI or UTF-16 LE with BOM, and cmd.exe reads
* .cmd in the console (OEM) code page; plain UTF-8 garbles non-ASCII profile
* paths into "file not found" launch failures (#107416, #108774). Do not
* simplify back to utf8.
*/
function encodeWindowsLauncherScript(params) {
	if (params.format === "vbs") return Buffer.concat([UTF16LE_BOM, Buffer.from(params.content, "utf16le")]);
	if (isAsciiOnly(params.content)) {
		if (process.platform === "win32") {
			const codePage = resolveWindowsOemCodePage();
			if (codePage === null || codePage === 864) throw new Error("Windows cmd launcher script cannot be written safely because the Windows OEM code page is unavailable or remaps ASCII syntax.");
		}
		return Buffer.from(params.content, "utf8");
	}
	const encoding = resolveWindowsOemEncoding();
	if (!encoding || !iconv.encodingExists(encoding)) throw new Error("Windows cmd launcher script contains non-ASCII content, but the Windows OEM code page is unavailable or unsupported; writing UTF-8 would make cmd.exe misread the script. Switch Windows to UTF-8 (code page 65001) or remove the non-ASCII content.");
	const codePage = resolveWindowsOemCodePageForEncoding(encoding);
	if (codePage === null) return Buffer.from(params.content, "utf8");
	const marked = `@chcp ${codePage} >nul\r\n${LAUNCHER_ENCODING_MARKER_PREFIX}${encoding}\r\n${params.content}`;
	const encoded = iconv.encode(marked, encoding);
	const decoded = WHATWG_VERIFIABLE_ENCODINGS.has(encoding) ? new TextDecoder(encoding).decode(encoded) : iconv.decode(encoded, encoding);
	const windowsWouldPrecompose = encoding === "windows-1258" && decoded.normalize("NFC") !== decoded;
	if (decoded !== marked || windowsWouldPrecompose) throw new Error(`Windows ${params.format} launcher script contains characters that cannot be represented in the Windows console code page (${encoding}); cmd.exe would misread the script. Remove those characters or switch Windows to UTF-8 (code page 65001).`);
	return encoded;
}
/** Decodes launcher scripts written by any OpenClaw version (UTF-16 LE BOM, marked code page, or UTF-8). */
function decodeWindowsLauncherScript(params) {
	const { buffer } = params;
	if (buffer.length >= 2 && buffer[0] === 255 && buffer[1] === 254) return buffer.subarray(2).toString("utf16le");
	let markerStart = 0;
	let newlineIndex = buffer.indexOf(10);
	if (newlineIndex !== -1 && LAUNCHER_CODEPAGE_PREAMBLE_RE.test(buffer.subarray(0, newlineIndex).toString("latin1"))) {
		markerStart = newlineIndex + 1;
		newlineIndex = buffer.indexOf(10, markerStart);
	}
	if (newlineIndex !== -1) {
		const marker = LAUNCHER_ENCODING_MARKER_RE.exec(buffer.subarray(markerStart, newlineIndex).toString("latin1"));
		if (marker?.[1] && iconv.encodingExists(marker[1])) return iconv.decode(buffer.subarray(newlineIndex + 1), marker[1]);
	}
	return buffer.toString("utf8");
}
//#endregion
//#region src/daemon/schtasks-layout.ts
function resolveTaskName(env) {
	const override = env.OPENCLAW_WINDOWS_TASK_NAME?.trim();
	if (override) return override;
	return resolveGatewayWindowsTaskName(env.OPENCLAW_PROFILE);
}
function shouldFallbackToStartupEntry(params) {
	return params.code === 1 || /(?:access is denied|acceso denegado)/i.test(params.detail) || params.code === 124 || /schtasks timed out/i.test(params.detail) || /schtasks produced no output/i.test(params.detail);
}
function resolveTaskScriptPath(env) {
	return resolveGatewayTaskScriptPath(env);
}
function resolveWindowsStartupDir(env) {
	const appData = env.APPDATA?.trim();
	if (appData) return path.join(appData, "Microsoft", "Windows", "Start Menu", "Programs", "Startup");
	const home = env.USERPROFILE?.trim() || env.HOME?.trim();
	if (!home) throw new Error("Windows startup folder unavailable: APPDATA/USERPROFILE not set");
	return path.join(home, "AppData", "Roaming", "Microsoft", "Windows", "Start Menu", "Programs", "Startup");
}
function sanitizeWindowsFilename(value) {
	return value.replace(/[<>:"/\\|?*]/g, "_").replace(/\p{Cc}/gu, "_");
}
function resolveStartupEntryPath(env, extension) {
	const taskName = resolveTaskName(env);
	const entryExtension = extension ?? (shouldUseHiddenWindowsTaskLauncher(env) ? "vbs" : "cmd");
	return path.join(resolveWindowsStartupDir(env), `${sanitizeWindowsFilename(taskName)}.${entryExtension}`);
}
function resolveStartupEntryPaths(env) {
	return uniqueStrings([
		resolveStartupEntryPath(env),
		resolveStartupEntryPath(env, "cmd"),
		resolveStartupEntryPath(env, "vbs")
	]);
}
function quoteSchtasksArg(value) {
	if (!/[ \t"]/g.test(value)) return value;
	return `"${value.replace(/"/g, "\\\"")}"`;
}
function escapeXmlText(value) {
	return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function buildScheduledTaskXml(params) {
	const description = escapeXmlText(params.taskDescription);
	const command = escapeXmlText(params.launchPath);
	const principalLogon = params.taskUser ? `\n      <UserId>${escapeXmlText(params.taskUser)}</UserId>\n      <LogonType>InteractiveToken</LogonType>` : "\n      <GroupId>S-1-5-32-545</GroupId>";
	return `<?xml version="1.0" encoding="UTF-16"?>
<Task version="1.2" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
  <RegistrationInfo>
    <Description>${description}</Description>
  </RegistrationInfo>
  <Triggers>
    <LogonTrigger>
      <Enabled>true</Enabled>${params.taskUser ? `\n      <UserId>${escapeXmlText(params.taskUser)}</UserId>` : ""}
    </LogonTrigger>
  </Triggers>
  <Principals>
    <Principal id="Author">${principalLogon}
      <RunLevel>LeastPrivilege</RunLevel>
    </Principal>
  </Principals>
  <Settings>
    <MultipleInstancesPolicy>IgnoreNew</MultipleInstancesPolicy>
    <DisallowStartIfOnBatteries>false</DisallowStartIfOnBatteries>
    <StopIfGoingOnBatteries>false</StopIfGoingOnBatteries>
    <AllowHardTerminate>true</AllowHardTerminate>
    <StartWhenAvailable>false</StartWhenAvailable>
    <RunOnlyIfNetworkAvailable>false</RunOnlyIfNetworkAvailable>
    <IdleSettings>
      <StopOnIdleEnd>false</StopOnIdleEnd>
      <RestartOnIdle>false</RestartOnIdle>
    </IdleSettings>
    <AllowStartOnDemand>true</AllowStartOnDemand>
    <Enabled>true</Enabled>
    <Hidden>false</Hidden>
    <RunOnlyIfIdle>false</RunOnlyIfIdle>
    <WakeToRun>false</WakeToRun>
    <ExecutionTimeLimit>PT0S</ExecutionTimeLimit>
    <Priority>7</Priority>
  </Settings>
  <Actions Context="Author">
    <Exec>
      <Command>${command}</Command>
    </Exec>
  </Actions>
</Task>`;
}
async function writeTaskXmlTempFile(xml) {
	const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-task-xml-"));
	const xmlPath = path.join(tmpDir, "task.xml");
	const bom = Buffer.from([255, 254]);
	const body = Buffer.from(xml, "utf16le");
	await fs.writeFile(xmlPath, Buffer.concat([bom, body]));
	return xmlPath;
}
function resolveTaskUser(env) {
	const username = env.USERNAME || env.USER || env.LOGNAME;
	if (!username) return null;
	if (username.includes("\\")) return username;
	const domain = env.USERDOMAIN;
	if (normalizeLowercaseStringOrEmpty(domain) === "workgroup") return username;
	if (domain) return `${domain}\\${username}`;
	return username;
}
function resolveSchtasksCreateUser(env, taskUser) {
	if (normalizeLowercaseStringOrEmpty(env.USERDOMAIN) === "workgroup") return null;
	return taskUser;
}
function shouldUseHiddenWindowsTaskLauncher(env) {
	const value = normalizeLowercaseStringOrEmpty(env.OPENCLAW_WINDOWS_TASK_HIDDEN_LAUNCHER);
	return value === "1" || value === "true" || value === "yes";
}
function resolveTaskLauncherScriptPath(env, scriptPath) {
	if (!shouldUseHiddenWindowsTaskLauncher(env)) return scriptPath;
	const parsed = path.parse(scriptPath);
	return path.join(parsed.dir, `${parsed.name}.vbs`);
}
async function readScheduledTaskCommand(env) {
	const scriptPath = resolveTaskScriptPath(env);
	try {
		const content = decodeWindowsLauncherScript({ buffer: await fs.readFile(scriptPath) });
		let workingDirectory = "";
		let commandLine = "";
		const environment = {};
		for (const rawLine of content.split(/\r?\n/)) {
			const line = rawLine.trim();
			if (!line) continue;
			const lower = normalizeLowercaseStringOrEmpty(line);
			if (line.startsWith("@echo") || lower.startsWith("rem ")) continue;
			if (lower.startsWith("set ")) {
				const assignment = parseCmdSetAssignment(line.slice(4));
				if (assignment) environment[assignment.key] = assignment.value;
				continue;
			}
			if (lower.startsWith("cd /d ")) {
				workingDirectory = line.slice(6).trim().replace(/^"|"$/g, "");
				continue;
			}
			commandLine = line;
			break;
		}
		if (!commandLine) return null;
		const hasEnvironment = Object.keys(environment).length > 0;
		return {
			programArguments: parseCmdScriptCommandLine(commandLine),
			...workingDirectory ? { workingDirectory } : {},
			...hasEnvironment ? { environment } : {},
			...hasEnvironment ? { environmentValueSources: Object.fromEntries(Object.keys(environment).map((key) => [key, "inline"])) } : {},
			sourcePath: scriptPath
		};
	} catch {
		return null;
	}
}
function buildTaskScript({ description, programArguments, workingDirectory, environment }) {
	const lines = ["@echo off"];
	const trimmedDescription = description?.trim();
	if (trimmedDescription) {
		assertNoCmdLineBreak(trimmedDescription, "Task description");
		lines.push(`rem ${trimmedDescription}`);
	}
	if (workingDirectory) lines.push(`cd /d ${quoteCmdScriptArg(workingDirectory)}`);
	if (environment) for (const [key, value] of Object.entries(environment)) {
		if (!value || key.toUpperCase() === "PATH") continue;
		lines.push(renderCmdSetAssignment(key, value));
	}
	lines.push(programArguments.map(quoteCmdScriptArg).join(" "));
	return `${lines.join("\r\n")}\r\n`;
}
function renderStartupLaunchCommand(scriptPath) {
	return `start "" /min ${quoteCmdScriptArg(getWindowsCmdExePath())} /d /c ${quoteCmdScriptArg(scriptPath)}`;
}
function buildStartupLauncherScript(params) {
	const lines = ["@echo off"];
	const trimmedDescription = params.description?.trim();
	if (trimmedDescription) {
		assertNoCmdLineBreak(trimmedDescription, "Startup launcher description");
		lines.push(`rem ${trimmedDescription}`);
	}
	lines.push(renderStartupLaunchCommand(params.scriptPath));
	return `${lines.join("\r\n")}\r\n`;
}
function quoteVbsString(value) {
	return `"${value.replace(/"/g, "\"\"")}"`;
}
function quoteVbsRunCommand(scriptPath) {
	return quoteVbsString(`"${scriptPath}"`);
}
function buildHiddenLauncherScript(params) {
	const lines = [];
	const trimmedDescription = params.description?.trim();
	if (trimmedDescription) {
		assertNoCmdLineBreak(trimmedDescription, "Hidden launcher description");
		lines.push(`' ${trimmedDescription}`);
	}
	lines.push(`CreateObject("WScript.Shell").Run ${quoteVbsRunCommand(params.scriptPath)}, 0, False`);
	return `${lines.join("\r\n")}\r\n`;
}
//#endregion
//#region src/daemon/schtasks-process.ts
function resolveScheduledTaskCommandPort(env, command) {
	return parseTcpPortFromArgs(command?.programArguments) ?? parseTcpPort(command?.environment?.OPENCLAW_GATEWAY_PORT) ?? parseTcpPort(env.OPENCLAW_GATEWAY_PORT);
}
function isNodeHostArgv(programArguments) {
	const normalized = programArguments.map((arg) => normalizeLowercaseStringOrEmpty(arg.replaceAll("\\", "/")));
	return normalized.some((arg, index) => arg === "node" && normalized[index + 1] === "run");
}
function normalizeProgramArguments(programArguments) {
	return programArguments.map((arg) => normalizeLowercaseStringOrEmpty(arg.replaceAll("\\", "/")));
}
function matchesInstalledProgramArguments(actualArguments, installedArguments) {
	const actual = normalizeProgramArguments(actualArguments);
	const installed = normalizeProgramArguments(installedArguments);
	return actual.length === installed.length && actual.every((arg, index) => arg === installed[index]);
}
function getSnapshotProcessId(entry) {
	const pid = entry.ProcessId;
	return typeof pid === "number" && Number.isFinite(pid) && pid > 0 ? pid : null;
}
function findInstalledProcessPid(entries, port, installedArguments, matchesProcess) {
	for (const entry of entries) {
		if (!normalizeLowercaseStringOrEmpty(entry.CommandLine ?? "")) continue;
		const argv = parseCmdScriptCommandLine(entry.CommandLine ?? "");
		if (!matchesProcess(argv) || parseTcpPortFromArgs(argv) !== port || !matchesInstalledProgramArguments(argv, installedArguments)) continue;
		const pid = getSnapshotProcessId(entry);
		if (pid) return pid;
	}
	return null;
}
async function resolveScheduledTaskProcess(env, matchesProcess) {
	const command = await readScheduledTaskCommand(env).catch(() => null);
	const installedArguments = command?.programArguments;
	if (!installedArguments?.length) return null;
	const port = resolveScheduledTaskCommandPort(env, command);
	if (!port) return null;
	const snapshot = readWindowsProcessSnapshot();
	if (!snapshot) return null;
	const pid = findInstalledProcessPid(snapshot, port, installedArguments, matchesProcess);
	return pid ? {
		pid,
		port
	} : null;
}
async function resolveScheduledTaskNodeHostProcess(env) {
	return resolveScheduledTaskProcess(env, isNodeHostArgv);
}
function shouldManageGatewayListenerPort(env) {
	return normalizeLowercaseStringOrEmpty(env.OPENCLAW_SERVICE_KIND) !== NODE_SERVICE_KIND;
}
async function resolveScheduledTaskGatewayContext(env) {
	const command = await readScheduledTaskCommand(env).catch(() => null);
	return {
		port: resolveScheduledTaskCommandPort(env, command),
		probeHosts: await resolveGatewayServiceProbeHosts({
			env,
			command
		})
	};
}
function resolveGatewayListenerPids(listeners) {
	return Array.from(new Set(listeners.filter((listener) => typeof listener.pid === "number" && listener.commandLine && isGatewayArgv(parseCmdScriptCommandLine(listener.commandLine), { allowGatewayBinary: true })).map((listener) => listener.pid)));
}
async function resolveScheduledTaskOwnedGatewayPids(env, context, installedCommand) {
	const command = installedCommand === void 0 ? await readScheduledTaskCommand(env).catch(() => null) : installedCommand;
	const installedArguments = command?.programArguments;
	if (!installedArguments?.length) return [];
	const resolvedContext = context ?? {
		port: resolveScheduledTaskCommandPort(env, command),
		probeHosts: await resolveGatewayServiceProbeHosts({
			env,
			command
		})
	};
	const port = resolvedContext.port;
	if (!port) return [];
	const ownedPids = /* @__PURE__ */ new Set();
	const snapshot = readWindowsProcessSnapshot();
	if (process.platform === "win32") {
		if (!snapshot) return [];
		const pid = findInstalledProcessPid(snapshot, port, installedArguments, () => true);
		if (pid) return [pid];
		return [];
	}
	const diagnostics = await inspectPortUsage(port, { probeHosts: resolvedContext.probeHosts }).catch(() => null);
	if (diagnostics?.status === "busy") for (const listener of diagnostics.listeners) {
		if (typeof listener.pid !== "number" || !listener.commandLine) continue;
		const argv = parseCmdScriptCommandLine(listener.commandLine);
		if (parseTcpPortFromArgs(argv) === port && matchesInstalledProgramArguments(argv, installedArguments)) ownedPids.add(listener.pid);
	}
	return Array.from(ownedPids);
}
async function resolveListenerBackedScheduledTaskRuntime(env) {
	if (!shouldManageGatewayListenerPort(env)) {
		const matched = await resolveScheduledTaskNodeHostProcess(env);
		return matched ? {
			status: "running",
			pid: matched.pid,
			detail: `Node host process detected for gateway port ${matched.port}.`
		} : null;
	}
	const command = await readScheduledTaskCommand(env).catch(() => null);
	const context = {
		port: resolveScheduledTaskCommandPort(env, command),
		probeHosts: await resolveGatewayServiceProbeHosts({
			env,
			command
		})
	};
	const pids = await resolveScheduledTaskOwnedGatewayPids(env, context, command);
	return pids.length > 0 ? {
		status: "running",
		pid: pids[0],
		detail: `Gateway process detected for gateway port ${context.port}.`
	} : null;
}
async function terminateScheduledTaskNodeHost(env) {
	const matched = await resolveScheduledTaskNodeHostProcess(env);
	if (!matched) return [];
	await terminateGatewayProcessTree(matched.pid, 300);
	return [matched.pid];
}
async function terminateScheduledTaskGatewayListeners(env, context) {
	if (!shouldManageGatewayListenerPort(env)) return [];
	const resolvedContext = context ?? await resolveScheduledTaskGatewayContext(env);
	if (!resolvedContext.port) return [];
	const pids = await resolveScheduledTaskOwnedGatewayPids(env, resolvedContext);
	for (const pid of pids) await terminateGatewayProcessTree(pid, 300);
	return pids;
}
function probeProcessState(pid) {
	if (process.platform === "win32") {
		const snapshot = readWindowsProcessSnapshot();
		if (snapshot) return snapshot.some((entry) => getSnapshotProcessId(entry) === pid) ? "alive" : "missing";
		const tasklist = spawnSync(getWindowsSystem32ExePath("tasklist.exe"), [
			"/FI",
			`PID eq ${pid}`,
			"/FO",
			"CSV",
			"/NH"
		], {
			encoding: "utf8",
			timeout: 1500,
			windowsHide: true
		});
		if (tasklist.error || tasklist.status !== 0) return "unknown";
		return tasklist.stdout.split(/\r?\n/).some((line) => line.includes(`,"${pid}",`)) ? "alive" : "missing";
	}
	try {
		process.kill(pid, 0);
		return "alive";
	} catch (err) {
		return err.code === "ESRCH" ? "missing" : "unknown";
	}
}
async function waitForProcessExit(pid, timeoutMs) {
	const deadline = Date.now() + timeoutMs;
	while (Date.now() < deadline) {
		if (probeProcessState(pid) === "missing") return true;
		await sleep(100);
	}
	return probeProcessState(pid) === "missing";
}
async function terminateGatewayProcessTree(pid, graceMs) {
	if (process.platform !== "win32") {
		killProcessTree(pid, { graceMs });
		return;
	}
	const taskkillPath = getWindowsSystem32ExePath("taskkill.exe");
	const graceful = spawnSync(taskkillPath, [
		"/T",
		"/PID",
		String(pid)
	], {
		stdio: "ignore",
		timeout: 5e3,
		windowsHide: true
	});
	if (await waitForProcessExit(pid, graceful.status === 0 && !graceful.error ? graceMs : 0)) return;
	const forced = spawnSync(taskkillPath, [
		"/F",
		"/T",
		"/PID",
		String(pid)
	], {
		stdio: "ignore",
		timeout: 5e3,
		windowsHide: true
	});
	if (forced.error || forced.status !== 0) {
		if (probeProcessState(pid) === "missing") return;
		throw new Error(`taskkill could not terminate gateway process ${pid}`);
	}
	if (!await waitForProcessExit(pid, 5e3) && probeProcessState(pid) === "alive") throw new Error(`gateway process ${pid} is still running after taskkill`);
}
async function waitForGatewayPortRelease(port, timeoutMs = 5e3, options) {
	const deadline = Date.now() + timeoutMs;
	while (Date.now() < deadline) {
		if ((await inspectPortUsage(port, options?.probeHosts ? { probeHosts: options.probeHosts } : void 0).catch(() => null))?.status === "free") return true;
		await sleep(250);
	}
	return false;
}
function readWindowsProcessSnapshot() {
	if (process.platform !== "win32") return null;
	const processSnapshot = spawnSync(getWindowsPowerShellExePath(), [
		"-NoProfile",
		"-Command",
		"Get-CimInstance Win32_Process | Select-Object ProcessId,CommandLine | ConvertTo-Json -Compress"
	], {
		encoding: "utf8",
		timeout: 5e3,
		windowsHide: true
	});
	if (processSnapshot.error || processSnapshot.status !== 0) return null;
	let parsedSnapshot;
	try {
		parsedSnapshot = JSON.parse(processSnapshot.stdout.trim() || "[]");
	} catch {
		return null;
	}
	const entries = (Array.isArray(parsedSnapshot) ? parsedSnapshot : [parsedSnapshot]).filter((entry) => typeof entry === "object" && entry !== null);
	return entries.length > 0 ? entries : null;
}
async function assertReplacementPortAvailableForTakeover(params) {
	if (!shouldManageGatewayListenerPort(params.env)) return;
	const port = resolveScheduledTaskCommandPort(params.env, {
		programArguments: params.programArguments,
		...params.environment ? { environment: params.environment } : {}
	});
	if (!port) throw new Error("Could not verify the replacement Windows Scheduled Task port.");
	const diagnostics = await inspectPortUsage(port, { probeHosts: await resolveGatewayServiceProbeHosts({
		env: params.env,
		command: {
			programArguments: params.programArguments,
			...params.environment ? { environment: Object.fromEntries(Object.entries(params.environment).filter((entry) => typeof entry[1] === "string")) } : {}
		}
	}) }).catch(() => null);
	if (!diagnostics) throw new Error(`Could not inspect replacement gateway port ${port}.`);
	if (diagnostics.status === "free") return;
	if (diagnostics.status !== "busy") throw new Error(`Could not verify replacement gateway port ${port}.`);
	const allowedPids = /* @__PURE__ */ new Set();
	if (params.fallbackPid) allowedPids.add(params.fallbackPid);
	if (process.platform === "win32") {
		const snapshot = readWindowsProcessSnapshot();
		if (snapshot) {
			const replacementPid = findInstalledProcessPid(snapshot, port, params.programArguments, () => true);
			if (replacementPid) allowedPids.add(replacementPid);
		}
	}
	const listenerPids = diagnostics.listeners.map((listener) => listener.pid);
	if (listenerPids.length > 0 && listenerPids.every((pid) => typeof pid === "number" && pid > 0 && allowedPids.has(pid))) return;
	throw new Error(`replacement gateway port ${port} is occupied by an unverified process`);
}
//#endregion
//#region src/daemon/schtasks-runtime.ts
function parseSchtasksQuery(output) {
	const entries = parseKeyValueOutput(output, ":");
	const info = {};
	if (entries.status) info.status = entries.status;
	if (entries["last run time"]) info.lastRunTime = entries["last run time"];
	const lastRunResult = entries["last run result"] ?? entries["last result"];
	if (lastRunResult) info.lastRunResult = lastRunResult;
	return info;
}
function normalizeTaskResultCode(value) {
	if (!value) return null;
	const raw = normalizeLowercaseStringOrEmpty(value);
	if (!raw) return null;
	if (/^0x[0-9a-f]+$/.test(raw)) return `0x${raw.slice(2).replace(/^0+/, "") || "0"}`;
	if (/^\d+$/.test(raw)) {
		const numeric = Number.parseInt(raw, 10);
		if (Number.isFinite(numeric)) return `0x${numeric.toString(16)}`;
	}
	return null;
}
const RUNNING_RESULT_CODES = /* @__PURE__ */ new Set(["0x41301"]);
const NOT_YET_RUN_RESULT_CODES = /* @__PURE__ */ new Set(["0x41303"]);
const UNKNOWN_STATUS_DETAIL = "Task status is locale-dependent and no numeric Last Run Result was available.";
const SCHEDULED_TASK_FALLBACK_TIMEOUT_MS = 15e3;
function deriveScheduledTaskRuntimeStatus(parsed) {
	const normalizedResult = normalizeTaskResultCode(parsed.lastRunResult);
	if (normalizedResult != null) return RUNNING_RESULT_CODES.has(normalizedResult) ? { status: "running" } : {
		status: "stopped",
		detail: `Task Last Run Result=${parsed.lastRunResult}; treating as not running.`
	};
	return parsed.status?.trim() ? {
		status: "unknown",
		detail: UNKNOWN_STATUS_DETAIL
	} : { status: "unknown" };
}
async function assertSchtasksAvailable() {
	const res = await execSchtasks(["/Query"]);
	if (res.code !== 0) {
		const detail = res.stderr || res.stdout;
		throw new Error(`schtasks unavailable: ${detail || "unknown error"}`.trim());
	}
}
async function isStartupEntryInstalled(env) {
	for (const startupEntryPath of resolveStartupEntryPaths(env)) try {
		await fs.access(startupEntryPath);
		return true;
	} catch {}
	return false;
}
async function removeStartupEntries(env, stdout) {
	for (const startupEntryPath of resolveStartupEntryPaths(env)) try {
		await fs.unlink(startupEntryPath);
		stdout.write(`${formatLine("Removed Windows login item", startupEntryPath)}\n`);
	} catch (error) {
		if (error.code !== "ENOENT") throw createStartupEntryRemovalError(error);
	}
}
function createStartupEntryRemovalError(error) {
	const code = error.code;
	return new Error(`Windows login item removal failed${code ? ` (${code})` : ""}. Check permissions and retry.`, { cause: code ? { code } : void 0 });
}
async function hasScheduledTaskRunningEvidence(env) {
	const runtime = await readScheduledTaskRuntime(env).catch(() => null);
	if (runtime?.status !== "running") return false;
	const normalizedResult = normalizeTaskResultCode(runtime.lastRunResult);
	if (normalizedResult !== null && RUNNING_RESULT_CODES.has(normalizedResult)) return true;
	return shouldUseHiddenWindowsTaskLauncher(env) && normalizedResult === "0x0";
}
async function waitForScheduledTaskRunningEvidence(env) {
	const deadline = Date.now() + SCHEDULED_TASK_FALLBACK_TIMEOUT_MS;
	while (true) {
		if (await hasScheduledTaskRunningEvidence(env)) return true;
		if (Date.now() >= deadline) return false;
		await sleep(250);
	}
}
async function isRegisteredScheduledTask(env) {
	return (await execSchtasks([
		"/Query",
		"/TN",
		resolveTaskName(env)
	]).catch(() => ({
		code: 1,
		stdout: "",
		stderr: ""
	}))).code === 0;
}
async function launchFallbackTaskScript(env, installedCommand) {
	const scriptPath = resolveTaskScriptPath(env);
	const command = installedCommand === void 0 ? await readScheduledTaskCommand(env) : installedCommand;
	if (command?.programArguments.length) {
		const { child } = await spawnWithFallback({
			argv: command.programArguments,
			options: {
				cwd: command.workingDirectory || void 0,
				detached: true,
				env: {
					...process.env,
					...command.environment
				},
				stdio: "ignore",
				windowsHide: true
			}
		});
		child.unref();
		return;
	}
	await (await fs.open(scriptPath, "r")).close();
	const scriptEnv = {
		...process.env,
		OPENCLAW_TASK_SCRIPT: scriptPath
	};
	const scriptProbe = spawnSync(getWindowsPowerShellExePath(), [
		"-NoProfile",
		"-NonInteractive",
		"-EncodedCommand",
		Buffer.from("$ErrorActionPreference='Stop'; [System.IO.File]::OpenRead($env:OPENCLAW_TASK_SCRIPT).Dispose()", "utf16le").toString("base64")
	], {
		env: scriptEnv,
		stdio: "ignore",
		windowsHide: true
	});
	if (scriptProbe.error) throw scriptProbe.error;
	if (scriptProbe.status !== 0) throw Object.assign(/* @__PURE__ */ new Error("Windows login item script is not readable"), { code: "EACCES" });
	const { child } = await spawnWithFallback({
		argv: [
			getWindowsCmdExePath(),
			"/d",
			"/s",
			"/v:off",
			"/c",
			"\"\"%OPENCLAW_TASK_SCRIPT%\"\""
		],
		options: {
			detached: true,
			env: scriptEnv,
			stdio: "ignore",
			windowsHide: true,
			windowsVerbatimArguments: true
		}
	});
	child.unref();
}
async function resolveFallbackRuntime(env, installedCommand, mode = "observe") {
	const command = installedCommand === void 0 ? await readScheduledTaskCommand(env).catch(() => null) : installedCommand;
	const port = resolveScheduledTaskCommandPort(env, command);
	if (!port) return {
		status: "unknown",
		detail: shouldManageGatewayListenerPort(env) ? "Startup-folder login item installed; gateway port unknown." : "Startup-folder login item installed; node gateway port unknown."
	};
	const installedArguments = command?.programArguments;
	if (!shouldManageGatewayListenerPort(env)) {
		const snapshot = readWindowsProcessSnapshot();
		if (!snapshot) return {
			status: "unknown",
			detail: `Startup-folder login item installed; could not inspect node host process for gateway port ${port}.`
		};
		const pid = installedArguments?.length ? findInstalledProcessPid(snapshot, port, installedArguments, isNodeHostArgv) : null;
		return pid ? {
			status: "running",
			pid,
			detail: `Startup-folder login item installed; node host process detected for gateway port ${port}.`
		} : {
			status: "stopped",
			detail: `Startup-folder login item installed; no node host process detected for gateway port ${port}.`
		};
	}
	const shouldInspectProcess = process.platform === "win32" && Boolean(installedArguments?.length);
	const snapshot = shouldInspectProcess ? readWindowsProcessSnapshot() : null;
	const processPid = snapshot && installedArguments ? findInstalledProcessPid(snapshot, port, installedArguments, () => true) : null;
	if (processPid) return {
		status: "running",
		pid: processPid,
		detail: `Startup-folder login item installed; matching gateway process detected for port ${port}.`
	};
	const requireCommandOwnership = mode === "control" && process.platform === "win32";
	if (requireCommandOwnership) {
		if (!installedArguments?.length) return {
			status: "unknown",
			detail: `Startup-folder login item installed; persisted command unavailable for gateway port ${port}.`
		};
		if (!snapshot) return {
			status: "unknown",
			detail: `Startup-folder login item installed; could not verify the installed process for gateway port ${port}.`
		};
	}
	const diagnostics = await inspectPortUsage(port, { probeHosts: await resolveGatewayServiceProbeHosts({
		env,
		command
	}) }).catch(() => null);
	if (!diagnostics) return {
		status: "unknown",
		detail: `Startup-folder login item installed; could not inspect port ${port}.`
	};
	if (diagnostics.status !== "busy") {
		const status = diagnostics.status === "free" && !(shouldInspectProcess && !snapshot) ? "stopped" : "unknown";
		return {
			status,
			detail: status === "unknown" && diagnostics.status === "free" ? `Startup-folder login item installed; no listener detected on port ${port}, but process inspection was unavailable.` : `Startup-folder login item installed; no gateway listener detected on port ${port}.`
		};
	}
	const matchedGatewayPids = resolveGatewayListenerPids(diagnostics.listeners);
	const scopedListenerPids = new Set(diagnostics.listeners.map((listener) => listener.pid));
	const verifiedGatewayPids = findVerifiedGatewayListenerPidsOnPortSync(port).filter((pid) => scopedListenerPids.has(pid));
	const ownedGatewayPids = matchedGatewayPids.length > 0 ? matchedGatewayPids : verifiedGatewayPids;
	if (ownedGatewayPids.length > 0) return requireCommandOwnership ? {
		status: "unknown",
		detail: `Startup-folder login item installed; gateway listener on port ${port} does not match the persisted command.`
	} : {
		status: "running",
		pid: ownedGatewayPids[0],
		detail: `Startup-folder login item installed; verified gateway listener detected on port ${port}.`
	};
	return {
		status: "unknown",
		detail: `Startup-folder login item installed; port ${port} is busy, but the listener is not a verified gateway process.`
	};
}
function probeScheduledTaskState(taskName) {
	const script = [
		"$ErrorActionPreference='Stop'",
		`$taskName=[Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${Buffer.from(taskName, "utf8").toString("base64")}'))`,
		"try { $service=New-Object -ComObject 'Schedule.Service'; $service.Connect(); $task=$service.GetFolder('\\').GetTask($taskName); [Console]::Out.Write([int]$task.State); exit 0 } catch { $exception=$_.Exception; while($null -ne $exception.InnerException){$exception=$exception.InnerException}; [Console]::Out.Write($exception.HResult); exit 1 }"
	].join("; ");
	const probe = spawnSync(getWindowsPowerShellExePath(), [
		"-NoProfile",
		"-NonInteractive",
		"-EncodedCommand",
		Buffer.from(script, "utf16le").toString("base64")
	], {
		encoding: "utf8",
		timeout: 5e3,
		windowsHide: true
	});
	if (probe.error) return { status: "unknown" };
	if (probe.status === 0) {
		const rawState = probe.stdout.trim();
		return {
			status: "found",
			state: /^\d+$/.test(rawState) ? Number.parseInt(rawState, 10) : null
		};
	}
	const hresult = Number.parseInt(probe.stdout.trim(), 10);
	return hresult === -2147024894 || hresult === -2147024893 ? { status: "missing" } : { status: "unknown" };
}
function probeScheduledTaskExists(taskName) {
	const probe = probeScheduledTaskState(taskName);
	return probe.status === "found" ? true : probe.status === "missing" ? false : null;
}
function isScheduledTaskDefinitelyNotRunning(taskName) {
	const probe = probeScheduledTaskState(taskName);
	if (probe.status !== "found") return false;
	return probe.state === 1 || probe.state === 3;
}
async function readWindowsStartupFallbackRuntimeForUpdate(env) {
	if (!await isStartupEntryInstalled(env)) return null;
	const taskExists = probeScheduledTaskExists(resolveTaskName(env));
	if (taskExists === null) throw new Error("Could not verify whether the Windows Scheduled Task exists.");
	return taskExists ? null : resolveFallbackRuntime(env, void 0, "control");
}
const FALLBACK_TAKEOVER_REPROBE_TIMEOUT_MS = 5e3;
const FALLBACK_TAKEOVER_REPROBE_INTERVAL_MS = 250;
async function waitForFallbackTakeoverRuntime(env, installedCommand, initialRuntime, previousRuntime) {
	let runtime = initialRuntime;
	const deadline = Date.now() + FALLBACK_TAKEOVER_REPROBE_TIMEOUT_MS;
	while (runtime.status !== "running" && Date.now() < deadline) {
		await sleep(FALLBACK_TAKEOVER_REPROBE_INTERVAL_MS);
		runtime = await resolveFallbackRuntime(env, installedCommand, "control").catch((err) => ({
			status: "unknown",
			detail: `Could not re-inspect the existing Windows login item: ${String(err)}`
		}));
	}
	if (runtime.status === "stopped" && previousRuntime.status === "running") {
		const previousPid = previousRuntime.pid;
		if (!previousPid || probeProcessState(previousPid) !== "missing") return {
			status: "unknown",
			detail: "The previously running Windows login item has not exited cleanly."
		};
	}
	return runtime;
}
async function resolveControllableFallbackRuntime(env) {
	const runtime = await resolveFallbackRuntime(env, void 0, "control");
	if (runtime.status === "unknown") throw new Error(runtime.detail ?? "Could not verify Windows login item ownership.");
	return runtime;
}
async function stopStartupEntry(env, stdout, onMutation) {
	const runtime = await resolveControllableFallbackRuntime(env);
	if (runtime.pid) await terminateGatewayProcessTree(runtime.pid, 300);
	onMutation?.();
	stdout.write(`${formatLine("Stopped Windows login item", resolveTaskName(env))}\n`);
}
async function terminateInstalledStartupRuntime(env) {
	if (!await isStartupEntryInstalled(env)) return;
	const runtime = await resolveControllableFallbackRuntime(env);
	if (runtime.pid) await terminateGatewayProcessTree(runtime.pid, 300);
}
async function restartStartupEntry(env, stdout, onMutation) {
	const runtime = await resolveControllableFallbackRuntime(env);
	if (runtime.pid) {
		await terminateGatewayProcessTree(runtime.pid, 300);
		onMutation?.("stop");
	}
	await launchFallbackTaskScript(env);
	onMutation?.("restart");
	stdout.write(`${formatLine("Restarted Windows login item", resolveTaskName(env))}\n`);
	return { outcome: "completed" };
}
async function startStartupEntry(env, stdout, onMutation) {
	await launchFallbackTaskScript(env);
	onMutation?.();
	stdout.write(`${formatLine("Started Windows login item", resolveTaskName(env))}\n`);
}
async function isScheduledTaskInstalled(args) {
	const effectiveEnv = args.env ?? process.env;
	return await isRegisteredScheduledTask(effectiveEnv) || await isStartupEntryInstalled(effectiveEnv);
}
async function readScheduledTaskRuntime(env = process.env) {
	try {
		await assertSchtasksAvailable();
	} catch (err) {
		if (await isStartupEntryInstalled(env)) return resolveFallbackRuntime(env);
		return {
			status: "unknown",
			detail: String(err)
		};
	}
	const taskName = resolveTaskName(env);
	const res = await execSchtasks([
		"/Query",
		"/TN",
		taskName,
		"/V",
		"/FO",
		"LIST"
	]);
	if (res.code !== 0) {
		if (await isStartupEntryInstalled(env)) return resolveFallbackRuntime(env);
		const detail = (res.stderr || res.stdout).trim();
		const missing = probeScheduledTaskExists(taskName) === false;
		return {
			status: missing ? "stopped" : "unknown",
			...!missing && detail ? { detail } : {},
			missingUnit: missing
		};
	}
	const parsed = parseSchtasksQuery(res.stdout || "");
	const derived = deriveScheduledTaskRuntimeStatus(parsed);
	if (derived.status !== "running") {
		const observedRuntime = await resolveListenerBackedScheduledTaskRuntime(env);
		if (observedRuntime) return {
			...observedRuntime,
			state: parsed.status,
			lastRunTime: parsed.lastRunTime,
			lastRunResult: parsed.lastRunResult
		};
	}
	return {
		status: derived.status,
		state: parsed.status,
		lastRunTime: parsed.lastRunTime,
		lastRunResult: parsed.lastRunResult,
		...derived.detail ? { detail: derived.detail } : {}
	};
}
//#endregion
//#region src/daemon/schtasks-control.ts
function runtimeSignature(runtime) {
	return [
		runtime?.state,
		runtime?.lastRunTime,
		runtime?.lastRunResult,
		runtime?.detail
	].filter(Boolean).join("|");
}
async function shouldFallbackScheduledTaskLaunch(params) {
	const readLaunchObservation = async () => {
		const runtime = await readScheduledTaskRuntime(params.env).catch(() => null);
		if (runtime?.status === "running") return {
			state: "running",
			signature: runtimeSignature(runtime)
		};
		const normalizedResult = normalizeTaskResultCode(runtime?.lastRunResult);
		if (normalizedResult && NOT_YET_RUN_RESULT_CODES.has(normalizedResult)) return {
			state: "not-yet-run",
			signature: runtimeSignature(runtime)
		};
		return normalizedResult === "0x0" ? {
			state: "stopped-success",
			signature: runtimeSignature(runtime)
		} : {
			state: "other",
			signature: runtimeSignature(runtime)
		};
	};
	const hasLaunchEvidence = async () => {
		const command = await readScheduledTaskCommand(params.env).catch(() => null);
		const installedArguments = command?.programArguments;
		const taskPort = resolveScheduledTaskCommandPort(params.env, command);
		const manageGatewayPort = shouldManageGatewayListenerPort(params.env);
		if (manageGatewayPort && taskPort) {
			const probeHosts = await resolveGatewayServiceProbeHosts({
				env: params.env,
				command
			});
			if ((await resolveScheduledTaskOwnedGatewayPids(params.env, {
				port: taskPort,
				probeHosts
			}, command)).length > 0) return true;
		}
		const scriptPathNeedle = normalizeLowercaseStringOrEmpty(params.scriptPath.replaceAll("/", "\\"));
		if (!scriptPathNeedle) return false;
		const entries = readWindowsProcessSnapshot();
		if (!entries) return false;
		if (entries.some((entry) => normalizeLowercaseStringOrEmpty(entry.CommandLine ?? "").replaceAll("/", "\\").includes(scriptPathNeedle))) return true;
		if (!taskPort) return false;
		if (!installedArguments?.length) return false;
		return findInstalledProcessPid(entries, taskPort, installedArguments, manageGatewayPort ? (argv) => isGatewayArgv(argv, { allowGatewayBinary: true }) : isNodeHostArgv) != null;
	};
	let previous = await readLaunchObservation();
	if (previous.state !== "not-yet-run" && previous.state !== "stopped-success") return false;
	const deadline = Date.now() + SCHEDULED_TASK_FALLBACK_TIMEOUT_MS;
	while (Date.now() < deadline) {
		await sleep(250);
		const current = await readLaunchObservation();
		if (current.state !== "not-yet-run" && current.state !== "stopped-success") return false;
		if (current.state === "not-yet-run" && previous.state === "not-yet-run" && current.signature !== previous.signature) return false;
		if (previous.state === "stopped-success" && current.state === "not-yet-run") return false;
		previous = current;
		if (await hasLaunchEvidence()) return false;
	}
	return true;
}
async function runScheduledTaskOrThrow(params) {
	const run = await execSchtasks([
		"/Run",
		"/TN",
		params.taskName
	]);
	if (run.code !== 0) throw new Error(`schtasks run failed: ${run.stderr || run.stdout}`.trim());
	params.onMutation?.();
	if (!await shouldFallbackScheduledTaskLaunch({
		env: params.env,
		scriptPath: params.scriptPath
	})) return "scheduled-task";
	await launchFallbackTaskScript(params.env);
	return "direct-fallback";
}
function parseScheduledTaskXmlEnabled(output) {
	const normalized = output.replace(/^\uFEFF/u, "").replaceAll(String.fromCharCode(0), "");
	const settings = /<Settings(?:\s[^>]*)?>([\s\S]*?)<\/Settings>/iu.exec(normalized)?.[1];
	if (settings === void 0) return null;
	const enabled = /<Enabled>\s*(true|false)\s*<\/Enabled>/iu.exec(settings)?.[1];
	return enabled === void 0 ? true : enabled.toLowerCase() === "true";
}
async function changeScheduledTaskEnabledState(params) {
	const taskName = resolveTaskName(params.env);
	if (!params.enabled) {
		const query = await execSchtasks([
			"/Query",
			"/TN",
			taskName,
			"/XML"
		]);
		if (query.code !== 0) {
			if (probeScheduledTaskExists(taskName) === false) return false;
			const detail = (query.stderr || query.stdout).trim() || "unknown error";
			throw new Error(`schtasks XML query failed: ${detail}`);
		}
		const enabled = parseScheduledTaskXmlEnabled(query.stdout);
		if (enabled === null) throw new Error("schtasks XML query did not expose the task enabled state");
		if (!enabled) return false;
	}
	const result = await execSchtasks([
		"/Change",
		"/TN",
		taskName,
		params.enabled ? "/ENABLE" : "/DISABLE"
	]);
	if (result.code !== 0) {
		const detail = (result.stderr || result.stdout).trim() || "unknown error";
		const changeError = /* @__PURE__ */ new Error(`schtasks ${params.enabled ? "enable" : "disable"} failed: ${detail}`);
		if (!params.enabled) {
			const restore = await execSchtasks([
				"/Change",
				"/TN",
				taskName,
				"/ENABLE"
			]);
			if (restore.code !== 0) {
				const restoreDetail = (restore.stderr || restore.stdout).trim() || "unknown error";
				throw new AggregateError([changeError, /* @__PURE__ */ new Error(`schtasks enable failed: ${restoreDetail}`)], "Scheduled Task disable failed and its enabled state could not be restored");
			}
		}
		throw changeError;
	}
	return true;
}
async function suspendScheduledTaskAutoStartForUpdate(env = process.env) {
	return changeScheduledTaskEnabledState({
		env,
		enabled: false
	});
}
async function resumeScheduledTaskAutoStartAfterUpdate(env = process.env) {
	return changeScheduledTaskEnabledState({
		env,
		enabled: true
	});
}
async function shouldControlStartupEntry(env) {
	try {
		await assertSchtasksAvailable();
	} catch (err) {
		if (!await isStartupEntryInstalled(env)) throw err;
		return true;
	}
	return !await isRegisteredScheduledTask(env) && await isStartupEntryInstalled(env);
}
async function stopScheduledTask({ stdout, env, onMutation }) {
	const effectiveEnv = env ?? process.env;
	const reportMutation = createGatewayLifecycleMutationReporter(onMutation);
	if (await shouldControlStartupEntry(effectiveEnv)) {
		await stopStartupEntry(effectiveEnv, stdout, () => reportMutation("startup-entry-stop"));
		return;
	}
	const taskName = resolveTaskName(effectiveEnv);
	const res = await execSchtasks([
		"/End",
		"/TN",
		taskName
	]);
	if (res.code !== 0 && !isScheduledTaskDefinitelyNotRunning(taskName)) throw new Error(`schtasks end failed: ${res.stderr || res.stdout}`.trim());
	reportMutation("schtasks-stop");
	const manageGatewayPort = shouldManageGatewayListenerPort(effectiveEnv);
	const stopContext = manageGatewayPort ? await resolveScheduledTaskGatewayContext(effectiveEnv) : null;
	const stopPort = stopContext?.port ?? null;
	if (manageGatewayPort) await terminateScheduledTaskGatewayListeners(effectiveEnv, stopContext ?? void 0);
	else await terminateScheduledTaskNodeHost(effectiveEnv);
	await terminateInstalledStartupRuntime(effectiveEnv);
	if (stopPort) {
		if (!await waitForGatewayPortRelease(stopPort, 5e3, { probeHosts: stopContext?.probeHosts ?? [] })) throw new Error(`gateway port ${stopPort} is still busy after stop; remaining listener ownership could not be verified`);
	}
	stdout.write(`${formatLine("Stopped Scheduled Task", taskName)}\n`);
}
async function startScheduledTask({ stdout, env, onMutation }) {
	const effectiveEnv = env ?? process.env;
	const reportMutation = createGatewayLifecycleMutationReporter(onMutation);
	if (await shouldControlStartupEntry(effectiveEnv)) {
		await startStartupEntry(effectiveEnv, stdout, () => reportMutation("startup-entry-start"));
		return;
	}
	const taskName = resolveTaskName(effectiveEnv);
	await runScheduledTaskOrThrow({
		taskName,
		env: effectiveEnv,
		scriptPath: resolveTaskScriptPath(effectiveEnv),
		onMutation: () => reportMutation("schtasks-start")
	});
	stdout.write(`${formatLine("Started Scheduled Task", taskName)}\n`);
}
async function restartRegisteredScheduledTask(params) {
	const taskName = resolveTaskName(params.env);
	if ((await execSchtasks([
		"/End",
		"/TN",
		taskName
	])).code === 0) params.onEndMutation?.();
	const manageGatewayPort = shouldManageGatewayListenerPort(params.env);
	const restartContext = manageGatewayPort ? await resolveScheduledTaskGatewayContext(params.env) : null;
	const restartPort = restartContext?.port ?? null;
	if (params.mode.kind === "standard") {
		if (manageGatewayPort) await terminateScheduledTaskGatewayListeners(params.env, restartContext ?? void 0);
		else await terminateScheduledTaskNodeHost(params.env);
		await terminateInstalledStartupRuntime(params.env);
	} else {
		const replacementRuntime = await resolveFallbackRuntime(params.env, void 0, "control");
		if (replacementRuntime.status === "unknown") throw new Error(replacementRuntime.detail ?? "Could not verify the replacement Windows Scheduled Task process.");
		if (replacementRuntime.status === "running" && replacementRuntime.pid) await terminateGatewayProcessTree(replacementRuntime.pid, 300);
	}
	if (restartPort) {
		if (!await waitForGatewayPortRelease(restartPort, 5e3, { probeHosts: restartContext?.probeHosts ?? [] })) {
			if (params.mode.kind === "fallback-takeover") throw new Error(`replacement gateway port ${restartPort} is occupied by an unverified process`);
			throw new Error(`gateway port ${restartPort} is still busy before restart; remaining listener ownership could not be verified`);
		}
	}
	const activation = await runScheduledTaskOrThrow({
		taskName,
		env: params.env,
		scriptPath: resolveTaskScriptPath(params.env),
		...params.onRunMutation ? { onMutation: params.onRunMutation } : {}
	});
	const startupEntryInstalled = await isStartupEntryInstalled(params.env);
	const hasRunningEvidence = startupEntryInstalled ? activation === "scheduled-task" && await waitForScheduledTaskRunningEvidence(params.env) : await hasScheduledTaskRunningEvidence(params.env);
	if (params.mode.kind === "fallback-takeover" && startupEntryInstalled && activation === "scheduled-task" && !hasRunningEvidence) {
		await execSchtasks([
			"/End",
			"/TN",
			taskName
		]);
		const failedRuntime = await resolveFallbackRuntime(params.env, void 0, "control").catch(() => null);
		if (failedRuntime?.status === "running" && failedRuntime.pid) await terminateGatewayProcessTree(failedRuntime.pid, 300);
		throw new Error("Replacement Windows Scheduled Task did not produce running evidence.");
	}
	if (startupEntryInstalled && hasRunningEvidence) await removeStartupEntries(params.env, params.stdout);
	params.stdout.write(`${formatLine("Restarted Scheduled Task", taskName)}\n`);
	return { outcome: "completed" };
}
async function restartScheduledTask({ stdout, env, onMutation }) {
	const effectiveEnv = env ?? process.env;
	const reportMutation = createGatewayLifecycleMutationReporter(onMutation);
	if (await shouldControlStartupEntry(effectiveEnv)) return restartStartupEntry(effectiveEnv, stdout, (kind) => reportMutation(kind === "stop" ? "startup-entry-stop" : "startup-entry-restart"));
	return restartRegisteredScheduledTask({
		env: effectiveEnv,
		stdout,
		mode: { kind: "standard" },
		onEndMutation: () => reportMutation("schtasks-end"),
		onRunMutation: () => reportMutation("schtasks-restart")
	});
}
//#endregion
//#region src/daemon/schtasks-install.ts
const CALLER_OWNED_SERVICE_IDENTITY_KEYS = [
	"OPENCLAW_LAUNCHD_LABEL",
	"OPENCLAW_SYSTEMD_UNIT",
	"OPENCLAW_WINDOWS_TASK_NAME"
];
function resolveScheduledTaskRenderEnv(env, environment) {
	if (!environment) return env;
	const merged = {
		...env,
		...environment
	};
	for (const key of CALLER_OWNED_SERVICE_IDENTITY_KEYS) {
		const value = env[key]?.trim();
		if (value) merged[key] = value;
	}
	return merged;
}
function resolveScheduledTaskScriptEnvironment(taskEnv, environment) {
	const scriptEnv = environment ? { ...environment } : {};
	for (const key of CALLER_OWNED_SERVICE_IDENTITY_KEYS) {
		const value = taskEnv[key]?.trim();
		if (value) scriptEnv[key] = value;
	}
	return Object.keys(scriptEnv).length > 0 ? scriptEnv : void 0;
}
const SCHEDULED_TASK_ACTIVATION_KEYS = [
	"OPENCLAW_WINDOWS_TASK_HIDDEN_LAUNCHER",
	"OPENCLAW_TASK_SCRIPT_NAME",
	"OPENCLAW_TASK_SCRIPT",
	"OPENCLAW_SERVICE_KIND",
	"OPENCLAW_GATEWAY_PORT",
	"OPENCLAW_STATE_DIR",
	"OPENCLAW_PROFILE"
];
function resolveScheduledTaskActivationEnv(env, environment) {
	if (!environment) return env;
	const activationEnv = { ...env };
	for (const key of SCHEDULED_TASK_ACTIVATION_KEYS) {
		const value = environment[key];
		if (value !== void 0) activationEnv[key] = value;
	}
	return activationEnv;
}
async function writeScheduledTaskScript({ env, programArguments, workingDirectory, environment, description }) {
	await assertSchtasksAvailable().catch(() => void 0);
	const taskEnv = resolveScheduledTaskRenderEnv(env, environment);
	const scriptPath = resolveTaskScriptPath(taskEnv);
	const taskLaunchPath = resolveTaskLauncherScriptPath(taskEnv, scriptPath);
	await fs.mkdir(path.dirname(scriptPath), { recursive: true });
	const taskDescription = resolveGatewayServiceDescription({
		env: taskEnv,
		description
	});
	const script = buildTaskScript({
		description: taskDescription,
		programArguments,
		workingDirectory,
		environment: resolveScheduledTaskScriptEnvironment(taskEnv, environment)
	});
	await fs.writeFile(scriptPath, encodeWindowsLauncherScript({
		format: "cmd",
		content: script
	}));
	if (taskLaunchPath !== scriptPath) {
		const launcher = buildHiddenLauncherScript({
			description: taskDescription,
			scriptPath
		});
		await fs.writeFile(taskLaunchPath, encodeWindowsLauncherScript({
			format: "vbs",
			content: launcher
		}));
	}
	return {
		scriptPath,
		taskLaunchPath,
		taskDescription,
		taskEnv
	};
}
async function stageScheduledTask({ stdout, ...args }) {
	const { scriptPath } = await writeScheduledTaskScript(args);
	writeFormattedLines(stdout, [{
		label: "Staged task script",
		value: scriptPath
	}], { leadingBlankLine: true });
	return { scriptPath };
}
async function updateExistingScheduledTask(params) {
	if (!await isRegisteredScheduledTask(params.env)) return null;
	if ((await execSchtasks([
		"/Change",
		"/TN",
		params.taskName,
		"/TR",
		params.quotedLaunchPath
	])).code !== 0) return null;
	const upgradeXmlPath = await writeTaskXmlTempFile(buildScheduledTaskXml({
		taskDescription: params.description ?? "OpenClaw Gateway",
		taskUser: resolveTaskUser(params.env),
		launchPath: params.taskLaunchPath
	}));
	try {
		await execSchtasks([
			"/Create",
			"/F",
			"/TN",
			params.taskName,
			"/XML",
			upgradeXmlPath
		]);
	} finally {
		await fs.rm(path.dirname(upgradeXmlPath), {
			recursive: true,
			force: true
		}).catch(() => {});
	}
	const activation = await runScheduledTaskOrThrow({
		taskName: params.taskName,
		env: params.env,
		scriptPath: params.scriptPath
	});
	writeFormattedLines(params.stdout, [{
		label: "Updated Scheduled Task",
		value: params.taskName
	}, {
		label: "Task script",
		value: params.scriptPath
	}], { leadingBlankLine: true });
	return activation;
}
async function activateScheduledTask(params) {
	const taskDescription = params.description ?? "OpenClaw Gateway";
	const taskName = resolveTaskName(params.env);
	const quotedLaunchPath = quoteSchtasksArg(params.taskLaunchPath);
	const existingActivation = await updateExistingScheduledTask({
		...params,
		taskName,
		quotedLaunchPath
	});
	if (existingActivation) return existingActivation;
	const taskUser = resolveTaskUser(params.env);
	const xmlPath = await writeTaskXmlTempFile(buildScheduledTaskXml({
		taskDescription,
		taskUser,
		launchPath: params.taskLaunchPath
	}));
	let create;
	try {
		const xmlArgs = [
			"/Create",
			"/F",
			"/TN",
			taskName,
			"/XML",
			xmlPath
		];
		const createUser = resolveSchtasksCreateUser(params.env, taskUser);
		create = await execSchtasks(createUser ? [
			...xmlArgs,
			"/RU",
			createUser,
			"/NP"
		] : xmlArgs);
		if (create.code !== 0 && createUser) create = await execSchtasks(xmlArgs);
	} finally {
		await fs.rm(path.dirname(xmlPath), {
			recursive: true,
			force: true
		}).catch(() => {});
	}
	if (create.code !== 0) {
		const detail = create.stderr || create.stdout;
		if (shouldFallbackToStartupEntry({
			code: create.code,
			detail
		})) {
			const startupEntryPath = resolveStartupEntryPath(params.env);
			await fs.mkdir(path.dirname(startupEntryPath), { recursive: true });
			const useHiddenLauncher = shouldUseHiddenWindowsTaskLauncher(params.env);
			const launcher = useHiddenLauncher ? buildHiddenLauncherScript({
				description: taskDescription,
				scriptPath: params.scriptPath
			}) : buildStartupLauncherScript({
				description: taskDescription,
				scriptPath: params.scriptPath
			});
			await fs.writeFile(startupEntryPath, encodeWindowsLauncherScript({
				format: useHiddenLauncher ? "vbs" : "cmd",
				content: launcher
			}));
			await launchFallbackTaskScript(params.env);
			writeFormattedLines(params.stdout, [{
				label: "Installed Windows login item",
				value: startupEntryPath
			}, {
				label: "Task script",
				value: params.scriptPath
			}], { leadingBlankLine: true });
			return "startup-fallback";
		}
		throw new Error(`schtasks create failed: ${detail}`.trim());
	}
	const activation = await runScheduledTaskOrThrow({
		taskName,
		env: params.env,
		scriptPath: params.scriptPath
	});
	writeFormattedLines(params.stdout, [{
		label: "Installed Scheduled Task",
		value: taskName
	}, {
		label: "Task script",
		value: params.scriptPath
	}], { leadingBlankLine: true });
	return activation;
}
async function installScheduledTask(args) {
	const installedCommand = await readScheduledTaskCommand(args.env).catch(() => null);
	const fallbackEnv = resolveScheduledTaskActivationEnv(args.env, installedCommand?.environment);
	const startupEntryInstalled = await isStartupEntryInstalled(fallbackEnv);
	let startupRuntime = startupEntryInstalled ? await resolveFallbackRuntime(fallbackEnv, installedCommand, "control").catch(() => null) : null;
	if (startupEntryInstalled && args.startupFallbackTakeoverRuntime?.status === "running" && startupRuntime?.status !== "running") startupRuntime = await waitForFallbackTakeoverRuntime(fallbackEnv, installedCommand, startupRuntime ?? { status: "unknown" }, args.startupFallbackTakeoverRuntime);
	if (startupEntryInstalled && (!startupRuntime || startupRuntime.status === "unknown")) throw new Error(startupRuntime?.detail ?? "Could not verify the existing Windows login item before Scheduled Task migration.");
	const activationEnv = resolveScheduledTaskActivationEnv(args.env, args.environment);
	if (startupRuntime) {
		const fallbackPid = startupRuntime.status === "running" ? startupRuntime.pid : void 0;
		if (startupRuntime.status === "running" && !fallbackPid) throw new Error("Could not verify the existing Windows login item process.");
		await assertReplacementPortAvailableForTakeover({
			env: activationEnv,
			programArguments: args.programArguments,
			...args.environment ? { environment: args.environment } : {},
			...fallbackPid ? { fallbackPid } : {}
		});
	}
	const staged = await writeScheduledTaskScript(args);
	if (await activateScheduledTask({
		env: activationEnv,
		stdout: args.stdout,
		scriptPath: staged.scriptPath,
		taskLaunchPath: staged.taskLaunchPath,
		description: staged.taskDescription
	}) !== "scheduled-task") return { scriptPath: staged.scriptPath };
	const takeoverRuntime = startupRuntime?.status === "stopped" ? await resolveFallbackRuntime(fallbackEnv, installedCommand, "control").catch(() => startupRuntime) : startupRuntime;
	if (takeoverRuntime?.status === "running" && takeoverRuntime.pid) {
		await terminateGatewayProcessTree(takeoverRuntime.pid, 300);
		try {
			await restartRegisteredScheduledTask({
				env: activationEnv,
				stdout: args.stdout,
				mode: { kind: "fallback-takeover" }
			});
		} catch (err) {
			await launchFallbackTaskScript(fallbackEnv, installedCommand);
			throw err;
		}
	} else if (takeoverRuntime?.status === "stopped" && await waitForScheduledTaskRunningEvidence(activationEnv)) await removeStartupEntries(activationEnv, args.stdout);
	return { scriptPath: staged.scriptPath };
}
async function uninstallScheduledTask({ env, stdout }) {
	await assertSchtasksAvailable();
	const taskName = resolveTaskName(env);
	const query = await execSchtasks([
		"/Query",
		"/TN",
		taskName
	]);
	const queryDetail = normalizeLowercaseStringOrEmpty(query.stderr || query.stdout);
	const exists = query.code === 0 ? true : queryDetail.includes("cannot find the file") ? false : probeScheduledTaskExists(taskName);
	if (exists === null) throw new Error(`Could not verify whether Scheduled Task ${taskName} exists.`);
	if (exists) {
		const deletion = await execSchtasks([
			"/Delete",
			"/F",
			"/TN",
			taskName
		]);
		if (deletion.code !== 0) {
			const detail = (deletion.stderr || deletion.stdout).trim() || "unknown error";
			throw new Error(`schtasks delete failed: ${detail}`);
		}
	}
	await removeStartupEntries(env, stdout);
	const scriptPath = resolveTaskScriptPath(env);
	const parsedScriptPath = path.parse(scriptPath);
	const launcherPaths = uniqueStrings([resolveTaskLauncherScriptPath(env, scriptPath), path.join(parsedScriptPath.dir, `${parsedScriptPath.name}.vbs`)]);
	for (const launcherPath of launcherPaths) {
		if (launcherPath === scriptPath) continue;
		try {
			await fs.unlink(launcherPath);
			stdout.write(`${formatLine("Removed task launcher", launcherPath)}\n`);
		} catch (error) {
			if (error.code !== "ENOENT") throw error;
		}
	}
	try {
		await fs.unlink(scriptPath);
		stdout.write(`${formatLine("Removed task script", scriptPath)}\n`);
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
		stdout.write(`Task script not found at ${scriptPath}\n`);
	}
}
//#endregion
export { resumeScheduledTaskAutoStartAfterUpdate as a, suspendScheduledTaskAutoStartForUpdate as c, readWindowsStartupFallbackRuntimeForUpdate as d, readScheduledTaskCommand as f, restartScheduledTask as i, isScheduledTaskInstalled as l, encodeWindowsLauncherScript as m, stageScheduledTask as n, startScheduledTask as o, resolveTaskScriptPath as p, uninstallScheduledTask as r, stopScheduledTask as s, installScheduledTask as t, readScheduledTaskRuntime as u };
