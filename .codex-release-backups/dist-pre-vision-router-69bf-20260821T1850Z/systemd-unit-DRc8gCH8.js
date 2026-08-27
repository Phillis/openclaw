import { u as normalizeStringEntries } from "./string-normalization-e_fvmxMf.js";
import { t as splitArgsPreservingQuotes } from "./arg-split-CR3xkHmb.js";
//#region src/daemon/systemd-unit.ts
/** Renders and parses systemd unit snippets for managed gateway services. */
const SYSTEMD_LINE_BREAKS = /[\r\n]/;
function assertNoSystemdLineBreaks(value, label) {
	if (SYSTEMD_LINE_BREAKS.test(value)) throw new Error(`${label} cannot contain CR or LF characters.`);
}
function systemdEscapeArg(value) {
	assertNoSystemdLineBreaks(value, "Systemd unit values");
	if (!/[\s"\\]/.test(value)) return value;
	return `"${value.replaceAll("\\", "\\\\").replaceAll("\"", "\\\"")}"`;
}
function renderEnvLines(env) {
	if (!env) return [];
	const entries = Object.entries(env).filter(([, value]) => typeof value === "string" && value.trim());
	if (entries.length === 0) return [];
	return entries.map(([key, value]) => {
		const rawValue = value ?? "";
		assertNoSystemdLineBreaks(key, "Systemd environment variable names");
		assertNoSystemdLineBreaks(rawValue, "Systemd environment variable values");
		return `Environment=${systemdEscapeArg(`${key}=${rawValue.trim()}`)}`;
	});
}
function renderEnvironmentFileLines(environmentFiles) {
	if (!environmentFiles) return [];
	return normalizeStringEntries(environmentFiles).map((entry) => {
		assertNoSystemdLineBreaks(entry, "Systemd EnvironmentFile values");
		return `EnvironmentFile=-${systemdEscapeArg(entry)}`;
	});
}
function buildSystemdUnit({ description, programArguments, workingDirectory, environment, environmentFiles }) {
	const execStart = programArguments.map(systemdEscapeArg).join(" ");
	const descriptionValue = description?.trim() || "OpenClaw Gateway";
	assertNoSystemdLineBreaks(descriptionValue, "Systemd Description");
	const descriptionLine = `Description=${descriptionValue}`;
	const workingDirLine = workingDirectory ? `WorkingDirectory=${systemdEscapeArg(workingDirectory)}` : null;
	const envLines = renderEnvLines(environment);
	const environmentFileLines = renderEnvironmentFileLines(environmentFiles);
	return [
		"[Unit]",
		descriptionLine,
		"After=network-online.target",
		"Wants=network-online.target",
		"StartLimitBurst=5",
		"StartLimitIntervalSec=60",
		"",
		"[Service]",
		`ExecStart=${execStart}`,
		"Restart=always",
		"RestartSec=5",
		"RestartPreventExitStatus=78",
		"TimeoutStopSec=30",
		"TimeoutStartSec=30",
		"SuccessExitStatus=0 143",
		"OOMPolicy=continue",
		"KillMode=control-group",
		workingDirLine,
		...environmentFileLines,
		...envLines,
		"",
		"[Install]",
		"WantedBy=default.target",
		""
	].filter((line) => line !== null).join("\n");
}
function parseSystemdExecStart(value) {
	return splitArgsPreservingQuotes(value, { escapeMode: "backslash" });
}
function parseSystemdEnvAssignment(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return null;
	const eq = trimmed.indexOf("=");
	if (eq <= 0) return null;
	const key = trimmed.slice(0, eq).trim();
	if (!key) return null;
	return {
		key,
		value: trimmed.slice(eq + 1)
	};
}
function parseSystemdEnvAssignments(raw) {
	return splitArgsPreservingQuotes(raw, {
		escapeMode: "backslash",
		quoteChars: ["\"", "'"],
		quoteStart: "item-start"
	}).flatMap((entry) => {
		const parsed = parseSystemdEnvAssignment(entry);
		return parsed ? [parsed] : [];
	});
}
function renderSystemdEnvAssignment(key, value) {
	return systemdEscapeArg(`${key}=${value}`);
}
//#endregion
export { renderSystemdEnvAssignment as i, parseSystemdEnvAssignments as n, parseSystemdExecStart as r, buildSystemdUnit as t };
