import { a as displayPath } from "./utils-DEqefz4f.js";
import { b as createConfigIO } from "./io-D1h6pxaD.js";
import { r as theme } from "./theme-vjDs9tao.js";
import fs from "node:fs";
//#region src/config/logging.ts
/** Formats a config path for operator-facing log output. */
function formatConfigFilePath(path = createConfigIO().configPath) {
	return displayPath(path);
}
/** Builds the config-updated log message, including backup detail only when it exists. */
function formatConfigUpdatedMessage(path, opts = {}) {
	const displayConfigPath = theme.muted(formatConfigFilePath(path));
	const suffix = opts.suffix ? ` ${opts.suffix}` : "";
	const backupPath = opts.backupPath === void 0 ? `${path}.bak` : opts.backupPath;
	const lines = [`Updated config: ${displayConfigPath}${suffix}`];
	if (backupPath && fs.existsSync(backupPath)) lines.push(`  Backup: ${theme.muted(formatConfigFilePath(backupPath))}`);
	return lines.join("\n");
}
/** Emits the standard config-updated message through the active runtime logger. */
function logConfigUpdated(runtime, opts = {}) {
	runtime.log(formatConfigUpdatedMessage(opts.path ?? createConfigIO().configPath, opts));
}
//#endregion
export { formatConfigUpdatedMessage as n, logConfigUpdated as r, formatConfigFilePath as t };
