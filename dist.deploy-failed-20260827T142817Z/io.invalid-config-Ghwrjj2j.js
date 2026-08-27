import { n as extractErrorCode } from "./errors-CSNUPl5U.js";
import { n as sanitizeTerminalText } from "./safe-text-DbwznzfG.js";
//#region src/config/io.invalid-config.ts
/**
* Shared invalid-config formatting, logging, and error helpers for config reads and mutations.
* All terminal-facing text is sanitized here so callers can reuse the same failure surface.
*/
/** Formats validation issues as terminal-safe bullet lines for config load failures. */
function formatInvalidConfigDetails(issues) {
	return issues.map((issue) => `- ${sanitizeTerminalText(issue.path || "<root>")}: ${sanitizeTerminalText(issue.message)}`).join("\n");
}
/** Builds the one-line invalid-config prefix plus preformatted validation details. */
function formatInvalidConfigLogMessage(configPath, details) {
	return `Invalid config at ${configPath}:\n${details}`;
}
/** Logs an invalid config message once per path during a load sequence. */
function logInvalidConfigOnce(params) {
	if (params.loggedConfigPaths.check(params.configPath)) return;
	params.logger.error(formatInvalidConfigLogMessage(params.configPath, params.details));
}
/** Creates the tagged error shape used by callers that need details after catch. */
function createInvalidConfigError(configPath, details, options = {}) {
	const error = /* @__PURE__ */ new Error(`Invalid config at ${configPath}:\n${details}`);
	error.name = "InvalidConfigError";
	const tagged = error;
	tagged.code = "INVALID_CONFIG";
	tagged.details = details;
	tagged.recovery = options.recovery ?? "doctor";
	return error;
}
function isInvalidConfigError(err) {
	return extractErrorCode(err) === "INVALID_CONFIG";
}
function isDoctorRecoverableInvalidConfigError(err) {
	return isInvalidConfigError(err) && err.recovery !== "manual";
}
/** Logs and throws the standard invalid-config error for a validation result. */
function throwInvalidConfig(params) {
	const details = formatInvalidConfigDetails(params.issues);
	logInvalidConfigOnce({
		configPath: params.configPath,
		details,
		logger: params.logger,
		loggedConfigPaths: params.loggedConfigPaths
	});
	throw createInvalidConfigError(params.configPath, details);
}
//#endregion
export { throwInvalidConfig as a, isInvalidConfigError as i, formatInvalidConfigDetails as n, isDoctorRecoverableInvalidConfigError as r, createInvalidConfigError as t };
