import { n as getWindowsInstallRoots } from "./windows-install-roots-BdGcwph2.js";
import { t as resolveSystemBin } from "./resolve-system-bin-ClCg60C2.js";
import path from "node:path";
//#region src/infra/ssh-client.ts
function resolveSshClient() {
	if (process.platform !== "win32") return resolveSystemBin("ssh", { trust: "strict" });
	const { systemRoot } = getWindowsInstallRoots();
	return resolveSystemBin("ssh", {
		trust: "strict",
		extraDirs: [path.win32.join(systemRoot, "System32", "OpenSSH")]
	});
}
//#endregion
export { resolveSshClient as t };
