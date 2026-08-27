import { r as formatErrorMessage } from "./errors-CqPTYU6G.js";
import { t as createSubsystemLogger } from "./subsystem-DNgaGOch.js";
import "./runtime-env-dZQRmQRq.js";
import "./ssrf-runtime-D3OHU1vE.js";
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
