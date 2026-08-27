import { u as tryProcessCwd } from "./home-dir-BFvskzn8.js";
import { w as resolveStateDir } from "./paths-BBSTUjD5.js";
import { B as resolveGatewayCatalogCommandPath } from "./argv-CCdO9MSu.js";
import { t as resolveCliArgvInvocation } from "./argv-invocation-DXuFeGZ6.js";
import { r as resolveCliContainerTarget } from "./container-target-DeeG-3q9.js";
import { t as loadGlobalRuntimeDotEnvFiles } from "./dotenv-global-BMOKJx-V.js";
import { n as loadWorkspaceDotEnvFile } from "./dotenv-e2A4jMLG.js";
import path from "node:path";
//#region src/cli/dotenv.ts
/** Load `.env` files for normal CLI commands without overriding existing process env. */
function loadCliDotEnv(opts) {
	const quiet = opts?.quiet ?? true;
	const cwd = tryProcessCwd();
	if (cwd) loadWorkspaceDotEnvFile(path.join(cwd, ".env"), { quiet });
	if (opts?.loadGlobalEnv === false) return;
	loadGlobalRuntimeDotEnvFiles({
		quiet,
		stateEnvPath: path.join(resolveStateDir(process.env), ".env")
	});
}
/** Load only the dotenv scope an early CLI failure may consult for diagnostic formatting. */
async function loadCliDotEnvForEarlyDiagnostic(argv, env = process.env) {
	if (resolveCliContainerTarget(argv, env)) return;
	const invocation = resolveCliArgvInvocation(argv);
	if (invocation.commandPath[0] === "agent" && invocation.commandPath[1] === "exec") return;
	if (invocation.primary === "agent" && !argv.includes("--local")) {
		const { loadGatewayDispatchCliDotEnv } = await import("./gateway-dispatch-dotenv-BvniBH22.js");
		await loadGatewayDispatchCliDotEnv({ quiet: true });
		return;
	}
	const gatewayPath = resolveGatewayCatalogCommandPath(argv);
	loadCliDotEnv({
		loadGlobalEnv: !(!invocation.hasHelpOrVersion && (gatewayPath?.length === 1 || gatewayPath?.length === 2 && gatewayPath[1] === "run")),
		quiet: true
	});
}
//#endregion
export { loadCliDotEnv, loadCliDotEnvForEarlyDiagnostic };
