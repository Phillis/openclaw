import { r as defaultRuntime } from "./runtime-DtFIMC-W.js";
import { r as theme } from "./theme-vjDs9tao.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import { t as addTuiOptions } from "./tui-cli-options-5C6_KTVs.js";
//#region src/cli/resume-cli.ts
/** Register the Gateway-backed session resume command. */
function registerResumeCli(program) {
	addTuiOptions(program.command("resume").description("Resume a recent Gateway session in the TUI").argument("[query]", "Session key, display name, or label").option("--handoff <payload>", "Opaque session handoff copied from the Control UI")).addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/resume", "docs.openclaw.ai/cli/resume")}\n`).action(async (query, opts) => {
		try {
			const { runResumeCommand } = await import("./resume-cli.runtime.js");
			await runResumeCommand(query, opts);
		} catch (error) {
			defaultRuntime.error(String(error));
			defaultRuntime.exit(1);
		}
	});
}
//#endregion
export { registerResumeCli };
