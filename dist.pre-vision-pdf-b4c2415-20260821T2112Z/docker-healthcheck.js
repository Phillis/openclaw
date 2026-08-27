import { _ as resolveGatewayPort } from "./paths-CqeDjSA4.js";
import { t as isMainModule } from "./is-main-CH4EEB_R.js";
import { r as getRuntimeConfig } from "./io-CeQckj5v.js";
import "./config-Dl8DJbzM.js";
import { a as readActiveGatewayLockPort } from "./gateway-lock-EiOnxvh_.js";
import { fileURLToPath } from "node:url";
//#region src/docker-healthcheck.ts
async function resolveDockerHealthcheckPort(deps = {}) {
	const env = deps.env ?? process.env;
	const readActivePort = deps.readActiveGatewayLockPort ?? readActiveGatewayLockPort;
	try {
		const activePort = await readActivePort({ env });
		if (activePort !== void 0) return activePort;
	} catch {}
	const config = (deps.getRuntimeConfig ?? (() => getRuntimeConfig({
		pin: false,
		skipPluginValidation: true,
		skipShellEnvFallback: true
	})))();
	return (deps.resolveGatewayPort ?? resolveGatewayPort)(config, env);
}
async function probeDockerGatewayHealth(deps = {}) {
	try {
		const port = await resolveDockerHealthcheckPort(deps);
		return (await (deps.fetch ?? globalThis.fetch)(`http://127.0.0.1:${port}/healthz`)).ok;
	} catch {
		return false;
	}
}
if (isMainModule({ currentFile: fileURLToPath(import.meta.url) })) probeDockerGatewayHealth().then((healthy) => {
	process.exitCode = healthy ? 0 : 1;
});
//#endregion
export { probeDockerGatewayHealth, resolveDockerHealthcheckPort };
