import { u as tryProcessCwd } from "./home-dir-BFvskzn8.js";
import { w as resolveStateDir } from "./paths-BBSTUjD5.js";
import { t as loadGlobalRuntimeDotEnvFiles } from "./dotenv-global-BMOKJx-V.js";
import fs from "node:fs";
import path from "node:path";
//#region src/cli/gateway-dispatch-dotenv.ts
/** Load only the env files needed before dispatching a command through the gateway. */
async function loadGatewayDispatchCliDotEnv(opts) {
	const quiet = opts?.quiet ?? true;
	const cwd = tryProcessCwd();
	if (cwd && fs.existsSync(path.join(cwd, ".env"))) {
		const { loadCliDotEnv } = await import("./dotenv-Dz6_8AD0.js");
		loadCliDotEnv({ quiet });
		return;
	}
	loadGlobalRuntimeDotEnvFiles({
		quiet,
		stateEnvPath: path.join(resolveStateDir(process.env), ".env")
	});
}
//#endregion
export { loadGatewayDispatchCliDotEnv };
