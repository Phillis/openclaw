import { r as theme } from "./theme-vjDs9tao.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import { t as addGatewayServiceCommands } from "./register-service-commands-Co-zenHL.js";
import "./install-b4UHtMIw.js";
import "./lifecycle-BVzBr0v4.js";
import "./status-CW1AfSLq.js";
//#region src/cli/daemon-cli/register.ts
/** Register the legacy daemon command group. */
function registerDaemonCli(program) {
	addGatewayServiceCommands(program.command("daemon").description("Manage the Gateway service (launchd/systemd/schtasks)").option("--json", "Output JSON", false).addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/gateway", "docs.openclaw.ai/cli/gateway")}\n`), { statusDescription: "Show service install status + probe connectivity/capability" });
}
//#endregion
export { registerDaemonCli as t };
