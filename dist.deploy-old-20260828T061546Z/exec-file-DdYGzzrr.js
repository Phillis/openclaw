import { n as extractErrorCode } from "./errors-Ccx0R-_Z.js";
import { l as createSanitizedCommandError, r as runCommandWithTimeout } from "./exec-D2kbpwdA.js";
//#region src/daemon/exec-file.ts
/** Child-process wrapper used by daemon installers to preserve stdout/stderr on failure. */
/** Runs a child process as UTF-8 and returns exit data instead of throwing on nonzero exit. */
async function execFileUtf8(command, args, options = {}) {
	try {
		const { stdout, stderr, code, termination, signal } = await runCommandWithTimeout([command, ...args], {
			baseEnv: options.env,
			cwd: options.cwd,
			killSignal: options.killSignal,
			maxOutputBytes: 1024 * 1024,
			timeoutMs: options.timeout
		});
		return {
			stdout,
			stderr: [stderr, termination === "exit" ? "" : createSanitizedCommandError({
				timedOut: termination === "timeout" || termination === "no-output-timeout",
				isTerminated: true,
				signal
			}).message].filter(Boolean).join("\n"),
			code: termination === "exit" ? code ?? 1 : code || 1,
			termination
		};
	} catch (error) {
		return {
			stdout: "",
			stderr: error instanceof Error ? error.message : String(error),
			code: 1,
			termination: "error",
			errorCode: extractErrorCode(error)
		};
	}
}
//#endregion
export { execFileUtf8 as t };
