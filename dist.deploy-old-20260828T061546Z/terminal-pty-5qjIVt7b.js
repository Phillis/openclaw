import { r as signalPtySessionTree } from "./kill-tree-CR2oLt9D.js";
import { n as resolveEnvironmentValue } from "./process-env-CW4bkwqq.js";
import { i as resolveTrustedWindowsCmdExe, n as isWindowsBatchCommand, t as buildWindowsCmdExeCommandLine } from "./windows-command-CUOcsQOM.js";
import { a as resolveWindowsSpawnProgram, i as resolveWindowsExecutablePath, r as materializeWindowsSpawnProgram } from "./windows-spawn-zZP1Z6cM.js";
import { n as resolvePtyTerminalName, r as setPtyTerminalName, t as readPtyTerminalName } from "./pty-terminal-name-CCuR8Uei.js";
import path from "node:path";
//#region src/process/terminal-pty.ts
function resolveTerminalNodeExecutable(env) {
	const candidate = path.win32.basename(process.execPath).toLowerCase() === "node.exe" ? process.execPath : resolveWindowsExecutablePath("node", env);
	if (path.win32.basename(candidate).toLowerCase() === "node.exe") return candidate;
	throw new Error("A Node executable is required to launch this Windows npm wrapper; add node.exe to PATH.");
}
function resolveTerminalPtyInvocation(params) {
	const platform = params.platform ?? process.platform;
	if (!isWindowsBatchCommand(params.file, platform)) return {
		file: params.file,
		args: params.args
	};
	const program = resolveWindowsSpawnProgram({
		command: params.file,
		platform,
		env: params.env,
		execPath: process.execPath,
		allowShellFallback: true
	});
	if (program.resolution !== "shell-fallback") {
		const invocation = materializeWindowsSpawnProgram(program.resolution === "node-entrypoint" ? {
			...program,
			command: resolveTerminalNodeExecutable(params.env)
		} : program, params.args);
		return {
			file: invocation.command,
			args: invocation.argv
		};
	}
	return {
		file: params.comSpec?.trim() || resolveTrustedWindowsCmdExe(platform),
		args: [
			"/d",
			"/s",
			"/c",
			buildWindowsCmdExeCommandLine(params.file, params.args)
		]
	};
}
async function spawnTerminalPty(params) {
	const { spawn } = await import("@lydell/node-pty");
	const env = { ...params.env };
	const terminalName = resolvePtyTerminalName(readPtyTerminalName(env, process.platform));
	setPtyTerminalName({
		env,
		name: terminalName,
		platform: process.platform
	});
	const comSpec = resolveEnvironmentValue(env, "COMSPEC");
	const invocation = resolveTerminalPtyInvocation({
		file: params.file,
		args: params.args,
		env,
		...comSpec ? { comSpec } : {}
	});
	const pty = spawn(invocation.file, invocation.args, {
		name: terminalName,
		cols: params.cols,
		rows: params.rows,
		cwd: params.cwd,
		env
	});
	return {
		get pid() {
			return pty.pid;
		},
		write: (data) => pty.write(data),
		resize: (cols, rows) => pty.resize(cols, rows),
		pause: () => pty.pause(),
		resume: () => pty.resume(),
		onData: (listener) => {
			pty.onData(listener);
		},
		onExit: (listener) => {
			pty.onExit(listener);
		},
		kill: (signal) => killPtyTree(pty, signal)
	};
}
function killPtyTree(pty, signal) {
	const sig = signal ?? "SIGKILL";
	try {
		if ((sig === "SIGKILL" || sig === "SIGTERM") && typeof pty.pid === "number" && pty.pid > 0) signalPtySessionTree(pty.pid, sig);
		else if (process.platform === "win32") pty.kill();
		else pty.kill(sig);
	} catch {}
}
//#endregion
export { spawnTerminalPty as t };
