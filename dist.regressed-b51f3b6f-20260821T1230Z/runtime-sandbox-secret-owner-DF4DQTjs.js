import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { r as assertSecretOwnerAvailable } from "./runtime-degraded-state-DqIBoQI-.js";
//#region src/secrets/runtime-sandbox-secret-owner.ts
/** Runtime owner for one agent's SSH sandbox credentials. */
function runtimeSandboxSecretOwnerId(agentId) {
	return `agent-sandbox:${normalizeAgentId(agentId)}`;
}
/** Rejects one agent's SSH sandbox when its runtime credentials are cold. */
function assertRuntimeSandboxSecretOwnerAvailable(agentId) {
	assertSecretOwnerAvailable("capability", runtimeSandboxSecretOwnerId(agentId));
}
//#endregion
export { runtimeSandboxSecretOwnerId as n, assertRuntimeSandboxSecretOwnerAvailable as t };
