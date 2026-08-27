import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { r as defaultRuntime } from "./runtime-LRpY2Icg.js";
import { n as isRich, r as theme } from "./theme-vjDs9tao.js";
import { n as runCommandWithRuntime } from "./cli-utils-DKdcuZ9M.js";
import { f as unauthorizedHintForMessage } from "./rpc-DSpNcV0f.js";
//#region src/cli/nodes-cli/cli-utils.ts
/** Return color helpers that degrade to plain text in non-rich terminals. */
function getNodesTheme() {
	const rich = isRich();
	const color = (fn) => (value) => rich ? fn(value) : value;
	return {
		rich,
		heading: color(theme.heading),
		ok: color(theme.success),
		warn: color(theme.warn),
		muted: color(theme.muted),
		error: color(theme.error)
	};
}
function formatConnectionFlagReminder(opts) {
	const flags = [normalizeOptionalString(opts.url) ? "--url" : null, normalizeOptionalString(opts.token) ? "--token" : null].filter((flag) => flag !== null);
	return flags.length > 0 ? `Reuse the same connection option${flags.length === 1 ? "" : "s"} when rerunning: ${flags.join(", ")}.` : null;
}
/** Run a node CLI action with standard failure text and authorization hints. */
function runNodesCommand(label, action) {
	return runCommandWithRuntime(defaultRuntime, action, (err) => {
		const message = formatErrorMessage(err);
		const { error, warn } = getNodesTheme();
		defaultRuntime.error(error(`nodes ${label} failed: ${message}`));
		const hint = unauthorizedHintForMessage(message);
		if (hint) defaultRuntime.error(warn(hint));
		defaultRuntime.exit(1);
	});
}
//#endregion
export { getNodesTheme as n, runNodesCommand as r, formatConnectionFlagReminder as t };
