import { o as isGatewayExternallySupervised } from "./gateway-supervision-C0L8fX98.js";
import { t as isContainerEnvironment } from "./container-environment-CNsJSTpY.js";
//#region src/commands/doctor-service-repair-policy.ts
/** Doctor policy for native gateway service ownership and repair. */
const GATEWAY_SERVICE_MANAGER_TIMEOUT_MS = 5e3;
const SERVICE_REPAIR_POLICY_ENV = "OPENCLAW_SERVICE_REPAIR_POLICY";
const EXTERNAL_SERVICE_REPAIR_NOTE = "Gateway service is managed externally; skipped service install/start repair. Start or repair the gateway through your supervisor.";
async function shouldManageGatewayService(env = process.env) {
	if (isGatewayExternallySupervised(env) || env.KUBERNETES_SERVICE_HOST?.trim() && env.KUBERNETES_SERVICE_PORT?.trim()) return false;
	if (!isContainerEnvironment()) return true;
	if (process.platform !== "linux") return false;
	try {
		const { findInstalledSystemdGatewayScope } = await import("./systemd-R20Y84Rl.js");
		if ((await findInstalledSystemdGatewayScope(env))?.scope !== "user") return false;
		const { resolveGatewayService } = await import("./service-e6C1wJjT.js");
		await resolveGatewayService().isLoaded({
			env,
			timeoutMs: GATEWAY_SERVICE_MANAGER_TIMEOUT_MS
		});
		return true;
	} catch {
		return false;
	}
}
/** Resolves whether doctor may repair managed services or must defer to an external supervisor. */
function resolveServiceRepairPolicy(env = process.env) {
	return env["OPENCLAW_SERVICE_REPAIR_POLICY"]?.trim().toLowerCase() === "external" ? "external" : "auto";
}
/** Returns true when Doctor service mutations must defer to an external supervisor. */
function isServiceRepairExternallyManaged(policy = resolveServiceRepairPolicy()) {
	return policy === "external" || isGatewayExternallySupervised();
}
/** Confirms a service repair unless Doctor mutations are externally managed. */
async function confirmDoctorServiceRepair(prompter, params, policy = resolveServiceRepairPolicy()) {
	return !isServiceRepairExternallyManaged(policy) && await prompter.confirmRuntimeRepair(params);
}
//#endregion
export { resolveServiceRepairPolicy as a, isServiceRepairExternallyManaged as i, SERVICE_REPAIR_POLICY_ENV as n, shouldManageGatewayService as o, confirmDoctorServiceRepair as r, EXTERNAL_SERVICE_REPAIR_NOTE as t };
