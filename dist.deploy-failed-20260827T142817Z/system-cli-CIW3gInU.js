import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import { r as defaultRuntime } from "./runtime-DtFIMC-W.js";
import { x as isSystemMachineOutput } from "./argv-CgA2urTO.js";
import { r as theme } from "./theme-vjDs9tao.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import { t as danger } from "./globals-CAwGc4B6.js";
import { n as callGatewayFromCli, t as addGatewayClientOptions } from "./gateway-rpc-DZKXbUOF.js";
import { n as setCommandJsonMode } from "./json-mode-rPUbIBub.js";
//#region src/cli/system-cli.ts
const normalizeWakeMode = (raw) => {
	const mode = normalizeOptionalString(raw) ?? "";
	if (!mode) return "next-heartbeat";
	if (mode === "now" || mode === "next-heartbeat") return mode;
	throw new Error("--mode must be now or next-heartbeat");
};
async function runSystemGatewayCommand(opts, action, successText) {
	const machineOutput = opts.json || successText === void 0;
	try {
		const result = await action();
		if (machineOutput) defaultRuntime.writeJson(result);
		else defaultRuntime.log(successText);
	} catch (err) {
		if (machineOutput) defaultRuntime.writeJson({ error: String(err) });
		else defaultRuntime.error(danger(String(err)));
		defaultRuntime.exit(1);
	}
}
/** Register Gateway-backed system event, heartbeat, and presence commands. */
function registerSystemCli(program) {
	const system = program.command("system").description("System tools (events, heartbeat, presence)").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/system", "docs.openclaw.ai/cli/system")}\n`);
	setCommandJsonMode(system, "output", ({ argv }) => isSystemMachineOutput(argv));
	addGatewayClientOptions(system.command("event").description("Enqueue a system event and optionally trigger a heartbeat").requiredOption("--text <text>", "System event text").option("--mode <mode>", "Wake mode (now|next-heartbeat)", "next-heartbeat").option("--session-key <sessionKey>", "Target a specific session for the event (defaults to the agent's main session)").option("--json", "Output JSON", false)).action(async (opts) => {
		await runSystemGatewayCommand(opts, async () => {
			const text = normalizeOptionalString(opts.text) ?? "";
			if (!text) throw new Error(`--text is required. Example: ${formatCliCommand("openclaw system event --text \"deploy finished\"")}.`);
			const mode = normalizeWakeMode(opts.mode);
			const sessionKey = normalizeOptionalString(opts.sessionKey);
			const result = await callGatewayFromCli("wake", opts, sessionKey ? {
				mode,
				text,
				sessionKey
			} : {
				mode,
				text
			}, { expectFinal: false });
			if (typeof result === "object" && result !== null && "ok" in result && !result.ok) {
				const reason = "reason" in result && typeof result.reason === "string" ? result.reason : "Gateway did not accept the system event";
				throw new Error(reason);
			}
			return result;
		}, "ok");
	});
	const heartbeat = system.command("heartbeat").description("Heartbeat controls");
	addGatewayClientOptions(heartbeat.command("last").description("Show the last heartbeat event").option("--json", "Output JSON", false)).action(async (opts) => {
		await runSystemGatewayCommand(opts, async () => {
			return await callGatewayFromCli("last-heartbeat", opts, void 0, { expectFinal: false });
		});
	});
	for (const [name, enabled] of [["enable", true], ["disable", false]]) addGatewayClientOptions(heartbeat.command(name).description(`${enabled ? "Enable" : "Disable"} heartbeats`).option("--json", "Output JSON", false)).action(async (opts) => {
		await runSystemGatewayCommand(opts, async () => {
			return await callGatewayFromCli("set-heartbeats", opts, { enabled }, { expectFinal: false });
		});
	});
	addGatewayClientOptions(system.command("presence").description("List system presence entries").option("--json", "Output JSON", false)).action(async (opts) => {
		await runSystemGatewayCommand(opts, async () => {
			return await callGatewayFromCli("system-presence", opts, void 0, { expectFinal: false });
		});
	});
}
//#endregion
export { registerSystemCli };
