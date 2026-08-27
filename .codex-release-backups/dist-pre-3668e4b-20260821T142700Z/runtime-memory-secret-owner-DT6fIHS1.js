import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
//#region src/secrets/runtime-memory-secret-owner.ts
/** Runtime owner for one agent's configured memory embedding provider. */
function runtimeMemorySecretOwnerId(agentId) {
	return `memory-provider:${normalizeAgentId(agentId)}`;
}
//#endregion
export { runtimeMemorySecretOwnerId as t };
