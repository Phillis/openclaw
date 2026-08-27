import { a as isPathInside, n as hasNodeErrorCode } from "./path-D138yf8v.js";
import "./path-guards-CQoZeoCG.js";
import { t as formatCliCommand } from "./command-format-HwSAdvXB.js";
import { n as resolveOpenClawPackageRootSync } from "./openclaw-root-DSkQ6e_8.js";
import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { d as errorShape } from "./validation-errors-rELRlKfn.js";
import { fileURLToPath } from "node:url";
//#region src/gateway/stale-install.ts
const GATEWAY_STALE_INSTALL_CLOSE_REASON = "gateway install changed; run: openclaw gateway restart";
const gatewayInstallRoot = resolveOpenClawPackageRootSync({ moduleUrl: import.meta.url });
function classifyGatewayStaleInstall(error) {
	if (!gatewayInstallRoot || !(error instanceof Error) || !hasNodeErrorCode(error, "ERR_MODULE_NOT_FOUND")) return null;
	const url = error.url;
	if (typeof url !== "string") return null;
	let missingPath;
	try {
		missingPath = fileURLToPath(url);
	} catch {
		return null;
	}
	if (!isPathInside(gatewayInstallRoot, missingPath)) return null;
	const restartCommand = formatCliCommand("openclaw gateway restart");
	return {
		error: errorShape(ErrorCodes.UNAVAILABLE, `The running Gateway can no longer load part of its OpenClaw installation. The installation may have changed while the Gateway was running. Restart it with: ${restartCommand}`, {
			details: {
				code: "STALE_INSTALL",
				restartCommand
			},
			retryable: false
		}),
		restartCommand
	};
}
//#endregion
export { classifyGatewayStaleInstall as n, GATEWAY_STALE_INSTALL_CLOSE_REASON as t };
