import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import "./runtime-env-_YEv0JPQ.js";
import "./ssrf-runtime-CIuLn0o4.js";
//#region extensions/telegram/src/api-logging.ts
const fallbackLogger = createSubsystemLogger("telegram/api");
function resolveTelegramApiLogger(runtime, logger) {
	if (logger) return logger;
	if (runtime?.error) return runtime.error;
	return (message) => fallbackLogger.error(message);
}
async function withTelegramApiErrorLogging({ operation, fn, runtime, logger, shouldLog }) {
	try {
		return await fn();
	} catch (err) {
		if (!shouldLog || shouldLog(err)) {
			const errText = formatErrorMessage(err);
			resolveTelegramApiLogger(runtime, logger)(`telegram ${operation} failed: ${errText}`);
		}
		throw err;
	}
}
//#endregion
export { withTelegramApiErrorLogging as t };
