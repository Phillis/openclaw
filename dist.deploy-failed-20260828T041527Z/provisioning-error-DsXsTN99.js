import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { d as isTrustedSecretSurfaceUnavailableError, t as SECRET_DEGRADATION_RETRY_HINT } from "./runtime-degraded-state-D5EZZ925.js";
//#region src/agents/sandbox/provisioning-error.ts
const SANDBOX_PROVISIONING_ERROR_CODE = "sandbox_provisioning";
/** Model-independent sandbox setup failure that must not consume model fallbacks. */
var SandboxProvisioningError = class extends Error {
	constructor(message, params) {
		super(message, { cause: params.cause });
		this.code = SANDBOX_PROVISIONING_ERROR_CODE;
		this.name = "SandboxProvisioningError";
		this.backendId = params.backendId;
	}
};
/** Preserve an existing typed failure or attach sandbox ownership to a backend setup error. */
function toSandboxProvisioningError(error, backendId) {
	if (error instanceof SandboxProvisioningError) return error;
	const detail = formatErrorMessage(error) || `Sandbox backend "${backendId}" provisioning failed.`;
	return new SandboxProvisioningError(isTrustedSecretSurfaceUnavailableError(error) ? `${detail} Fix the referenced secret, run \`${SECRET_DEGRADATION_RETRY_HINT}\`, then retry.` : detail, {
		backendId,
		cause: error
	});
}
/** Recognize the provisioning marker through ordinary error-wrapper cause chains. */
function isSandboxProvisioningError(error, seen = /* @__PURE__ */ new Set()) {
	if (error instanceof SandboxProvisioningError) return true;
	if (!error || typeof error !== "object" || seen.has(error)) return false;
	seen.add(error);
	const candidate = error;
	if (candidate.name === "SandboxProvisioningError" && candidate.code === SANDBOX_PROVISIONING_ERROR_CODE) return true;
	return [
		candidate.cause,
		candidate.error,
		...Array.isArray(candidate.errors) ? candidate.errors : []
	].some((nested) => isSandboxProvisioningError(nested, seen));
}
//#endregion
export { toSandboxProvisioningError as n, isSandboxProvisioningError as t };
