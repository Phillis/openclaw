import { y as uniqueValues } from "./string-normalization-e_fvmxMf.js";
import { i as readWindowsProcessArgsSync, l as parseProcCmdline, o as isGatewayArgv, t as readWindowsListeningPidsOnPortSync } from "./windows-port-pids-CMSygYlL.js";
import { a as spawnPsSync, n as findGatewayPidsOnPortSync } from "./restart-stale-pids-C2sCOjHx.js";
import fs from "node:fs";
//#region src/infra/gateway-processes.ts
const GATEWAY_PS_PROBE_TIMEOUT_MS = 1e3;
/** Read command argv for a PID using the current platform's process APIs. */
function readGatewayProcessArgsSync(pid) {
	if (process.platform === "linux") try {
		return parseProcCmdline(fs.readFileSync(`/proc/${pid}/cmdline`, "utf8"));
	} catch {
		return null;
	}
	if (process.platform === "darwin") {
		const ps = spawnPsSync([
			"-o",
			"command=",
			"-p",
			String(pid)
		], GATEWAY_PS_PROBE_TIMEOUT_MS);
		if (ps.error || ps.status !== 0) return null;
		const command = ps.stdout.trim();
		return command ? command.split(/\s+/) : null;
	}
	if (process.platform === "win32") return readWindowsProcessArgsSync(pid);
	return null;
}
/** Signal a PID only after its argv matches a gateway process. */
function signalVerifiedGatewayPidSync(pid, signal) {
	const args = readGatewayProcessArgsSync(pid);
	if (!args || !isGatewayArgv(args, { allowGatewayBinary: true })) throw new Error(`refusing to signal non-gateway process pid ${pid}`);
	try {
		process.kill(pid, signal);
	} catch (err) {
		if (err.code !== "ESRCH") throw err;
	}
}
/** Find listener PIDs on `port` and keep only verified gateway processes. */
function findVerifiedGatewayListenerPidsOnPortSync(port) {
	return uniqueValues(process.platform === "win32" ? readWindowsListeningPidsOnPortSync(port) : findGatewayPidsOnPortSync(port)).filter((pid) => Number.isFinite(pid) && pid > 0 && pid !== process.pid).filter((pid) => {
		const args = readGatewayProcessArgsSync(pid);
		return args != null && isGatewayArgv(args, { allowGatewayBinary: true });
	});
}
/** Format gateway PIDs for human-facing diagnostics. */
function formatGatewayPidList(pids) {
	return pids.join(", ");
}
//#endregion
export { formatGatewayPidList as n, signalVerifiedGatewayPidSync as r, findVerifiedGatewayListenerPidsOnPortSync as t };
