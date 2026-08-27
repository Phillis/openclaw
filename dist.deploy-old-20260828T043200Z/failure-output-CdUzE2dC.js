import { r as isGatewayTransportError } from "./transport-error-D_LRKgla.js";
import { n as isTruthyEnvValue } from "./env-ChWDbSFK.js";
import { a as formatUncaughtError, r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { t as formatCliCommand } from "./command-format-HwSAdvXB.js";
//#region src/cli/failure-output.ts
var ExpectedCliError = class extends Error {
	constructor(params) {
		super(params.message);
		this.name = "ExpectedCliError";
		this.humanOutput = params.humanOutput;
		this.humanOutputWritten = params.humanOutputWritten ?? false;
		this.machineOutput = params.machineOutput;
	}
};
function isGatewayCredentialsCliError(error) {
	if (!(error instanceof Error)) return false;
	return error.name === "GatewayCredentialsRequiredError" && "method" in error && typeof error.method === "string" && "configPath" in error && typeof error.configPath === "string";
}
function isExpectedCliError(error) {
	return error instanceof ExpectedCliError || isGatewayCredentialsCliError(error) || isGatewayTransportError(error);
}
function rethrowExpectedCliError(error) {
	if (isExpectedCliError(error)) throw error;
}
function resolveExpectedCliOutput(error) {
	return error instanceof ExpectedCliError ? error : {
		humanOutput: error.message,
		humanOutputWritten: false,
		machineOutput: error.message
	};
}
/** Canonical machine-readable failure envelope for CLI-owned errors. */
function formatCliJsonFailure(error, options = {}) {
	return {
		ok: false,
		error: {
			type: "cli_error",
			message: isExpectedCliError(error) ? formatErrorMessage(resolveExpectedCliOutput(error).machineOutput.trimEnd()) : formatCliOperatorError(error, options)
		}
	};
}
function hasDebugArg(argv) {
	for (const arg of argv ?? []) {
		if (arg === "--") return false;
		if (arg === "--debug" || arg === "--verbose") return true;
	}
	return false;
}
function shouldShowDebugDetails(argv = process.argv, env = process.env) {
	return hasDebugArg(argv) || isTruthyEnvValue(env.OPENCLAW_DEBUG);
}
function formatCliOperatorError(error, options = {}) {
	return formatErrorMessage(!shouldShowDebugDetails(options.argv, options.env) && error instanceof Error ? error.message || error.name || "Error" : error);
}
function pushPrefixed(out, value) {
	for (const line of value.split("\n")) if (line.trim().length > 0) out.push(`[openclaw] ${line}`);
}
function formatCliFailureLines(options) {
	if (isExpectedCliError(options.error)) {
		const output = resolveExpectedCliOutput(options.error);
		return output.humanOutputWritten ? [] : output.humanOutput.trimEnd().split("\n");
	}
	const env = options.env ?? process.env;
	const showDebugDetails = shouldShowDebugDetails(options.argv, env);
	const lines = [`[openclaw] ${options.title}`, `[openclaw] Reason: ${formatCliOperatorError(options.error, {
		argv: options.argv,
		env
	})}`];
	if (showDebugDetails) {
		lines.push("[openclaw] Stack:");
		pushPrefixed(lines, formatUncaughtError(options.error));
	} else lines.push("[openclaw] Debug: set OPENCLAW_DEBUG=1 to include the stack trace.");
	if (options.includeDoctorHint !== false) lines.push(`[openclaw] Try: ${formatCliCommand("openclaw doctor", env)}`);
	lines.push(`[openclaw] Help: ${formatCliCommand("openclaw --help", env)}`);
	return lines;
}
//#endregion
export { isExpectedCliError as a, formatCliOperatorError as i, formatCliFailureLines as n, isGatewayCredentialsCliError as o, formatCliJsonFailure as r, rethrowExpectedCliError as s, ExpectedCliError as t };
