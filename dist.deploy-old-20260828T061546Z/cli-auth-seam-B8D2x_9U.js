import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import { r as CLAUDE_CLI_CLEAR_ENV } from "./cli-constants-Djv4WtLq.js";
import { spawnSync } from "node:child_process";
//#region extensions/anthropic/cli-auth-seam.ts
/** Ask Claude CLI whether its own login is usable without reading token material. */
function probeClaudeCliAuthStatus(params) {
	const env = { ...params?.env ?? process.env };
	for (const name of CLAUDE_CLI_CLEAR_ENV) delete env[name];
	const result = spawnSync(params?.command ?? "claude", [
		"auth",
		"status",
		"--json"
	], {
		encoding: "utf8",
		env,
		maxBuffer: 64 * 1024,
		timeout: 3e3,
		windowsHide: true
	});
	if (result.error || result.status === null) return { status: "unreadable" };
	if (result.status !== 0) return { status: "missing" };
	try {
		const parsed = JSON.parse(result.stdout);
		if (!isRecord(parsed) || parsed.loggedIn !== true) return { status: "missing" };
		return { status: "available" };
	} catch {
		return { status: "unreadable" };
	}
}
//#endregion
export { probeClaudeCliAuthStatus as t };
