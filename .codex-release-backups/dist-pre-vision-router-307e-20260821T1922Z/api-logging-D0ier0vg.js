import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import "./runtime-env-COkbgBI4.js";
import "./ssrf-runtime-Co-K4Dxq.js";
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
