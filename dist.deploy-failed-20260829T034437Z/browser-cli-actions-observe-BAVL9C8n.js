import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { m as shortenHomePath } from "./utils-Bw16L5tB.js";
import { r as defaultRuntime } from "./runtime-LRpY2Icg.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import "./core-api-33TAiIzf.js";
import { a as parseBrowserPositiveIntegerOption, l as runBrowserCliCommand, n as callBrowserRequest, s as printBrowserJsonResult, t as BROWSER_TAB_REFERENCE_HELP, u as withBrowserActionTimeoutSlack } from "./browser-cli-shared-IxsodPHK.js";
//#region extensions/browser/src/cli/browser-cli-actions-observe.ts
const BROWSER_CONSOLE_LEVELS = [
	"error",
	"warn",
	"info"
];
function parseBrowserConsoleLevel(value) {
	const level = BROWSER_CONSOLE_LEVELS.find((candidate) => candidate === value);
	if (!level) throw new Error(`--level must be ${BROWSER_CONSOLE_LEVELS.slice(0, -1).join(", ")}, or ${BROWSER_CONSOLE_LEVELS.at(-1)}.`);
	return level;
}
/** Registers Browser commands that observe current page state without direct input. */
function registerBrowserActionObserveCommands(browser, parentOpts) {
	browser.command("console").description("Get recent console messages").option("--level <level>", `Filter by level (${BROWSER_CONSOLE_LEVELS.join(", ")})`, parseBrowserConsoleLevel).option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).action(async (opts, cmd) => {
		const parent = parentOpts(cmd);
		const profile = parent?.browserProfile;
		await runBrowserCliCommand(async () => {
			const result = await callBrowserRequest(parent, {
				method: "GET",
				path: "/console",
				query: {
					level: normalizeOptionalString(opts.level),
					targetId: normalizeOptionalString(opts.targetId),
					profile
				}
			});
			if (printBrowserJsonResult(parent, result)) return;
			defaultRuntime.writeJson(result.messages);
		});
	});
	browser.command("pdf").description("Save page as PDF").option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).action(async (opts, cmd) => {
		const parent = parentOpts(cmd);
		const profile = parent?.browserProfile;
		await runBrowserCliCommand(async () => {
			const result = await callBrowserRequest(parent, {
				method: "POST",
				path: "/pdf",
				query: profile ? { profile } : void 0,
				body: { targetId: normalizeOptionalString(opts.targetId) }
			});
			if (printBrowserJsonResult(parent, result)) return;
			defaultRuntime.log(`PDF: ${shortenHomePath(result.path)}`);
		});
	});
	browser.command("responsebody").description("Wait for a network response and return its body").argument("<url>", "URL (exact, substring, or glob like **/api)").option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).option("--timeout-ms <ms>", "How long to wait for the complete response body (default: 20000)", (v) => parseBrowserPositiveIntegerOption(v, "--timeout-ms")).option("--max-chars <n>", "Max body chars to return (default: 200000)", (v) => parseBrowserPositiveIntegerOption(v, "--max-chars")).action(async (url, opts, cmd) => {
		const parent = parentOpts(cmd);
		const profile = parent?.browserProfile;
		await runBrowserCliCommand(async () => {
			const timeoutMs = Number.isFinite(opts.timeoutMs) ? opts.timeoutMs : void 0;
			const maxChars = Number.isFinite(opts.maxChars) ? opts.maxChars : void 0;
			const result = await callBrowserRequest(parent, {
				method: "POST",
				path: "/response/body",
				query: profile ? { profile } : void 0,
				body: {
					url,
					targetId: normalizeOptionalString(opts.targetId),
					timeoutMs,
					maxChars
				}
			}, { timeoutMs: withBrowserActionTimeoutSlack(timeoutMs) });
			if (printBrowserJsonResult(parent, result)) return;
			defaultRuntime.log(result.response.body);
		});
	});
}
//#endregion
export { registerBrowserActionObserveCommands };
