import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { n as isRich, r as theme, t as colorize } from "./theme-vjDs9tao.js";
//#region src/daemon/output.ts
/** Shared terminal output formatting helpers for daemon install/control commands. */
/** Normalizes Windows separators for command output paths. */
const normalizeWindowsPathSeparators = (value) => value.replace(/\\/g, "/");
/** Formats a labeled daemon output line with terminal-aware styling. */
function formatLine(label, value) {
	const rich = isRich();
	return `${colorize(rich, theme.muted, `${label}:`)} ${colorize(rich, theme.command, value)}`;
}
function writeFormattedLines(stdout, lines, opts) {
	if (opts?.leadingBlankLine) stdout.write("\n");
	for (const line of lines) stdout.write(`${formatLine(line.label, line.value)}\n`);
}
//#endregion
//#region src/daemon/runtime-parse.ts
/** Parses daemon runtime command output into normalized key-value maps. */
/** Parses command output key-value lines using a caller-supplied separator. */
function parseKeyValueOutput(output, separator) {
	const entries = {};
	for (const rawLine of output.split(/\r?\n/)) {
		const line = rawLine.trim();
		if (!line) continue;
		const idx = line.indexOf(separator);
		if (idx <= 0) continue;
		const key = normalizeLowercaseStringOrEmpty(line.slice(0, idx));
		if (!key) continue;
		entries[key] = line.slice(idx + separator.length).trim();
	}
	return entries;
}
//#endregion
//#region src/daemon/service-mutation.ts
/** Isolate diagnostic observers from authoritative service-control mutations. */
function createGatewayLifecycleMutationReporter(onMutation) {
	return (mode) => {
		try {
			onMutation?.({ mode });
		} catch {}
	};
}
//#endregion
export { writeFormattedLines as a, normalizeWindowsPathSeparators as i, parseKeyValueOutput as n, formatLine as r, createGatewayLifecycleMutationReporter as t };
