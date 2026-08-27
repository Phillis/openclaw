import { u as tryProcessCwd } from "./home-dir-DcrXWQPU.js";
import { w as resolveStateDir } from "./paths-CqeDjSA4.js";
import { M as resolveGatewayCatalogCommandPath } from "./argv-CgA2urTO.js";
import { t as resolveCliArgvInvocation } from "./argv-invocation-CtNEO_uG.js";
import { r as resolveCliContainerTarget } from "./container-target-CmkzL0zt.js";
import { t as loadGlobalRuntimeDotEnvFiles } from "./dotenv-global-VyHvz_zH.js";
import { n as loadWorkspaceDotEnvFile } from "./dotenv-DaKPWV3L.js";
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
		const { loadGatewayDispatchCliDotEnv } = await import("./gateway-dispatch-dotenv-nD4d3xpk.js");
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
