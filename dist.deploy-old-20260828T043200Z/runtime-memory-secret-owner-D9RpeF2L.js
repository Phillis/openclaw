import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
//#region src/secrets/runtime-memory-secret-owner.ts
/** Runtime owner for one agent's configured memory embedding provider. */
function runtimeMemorySecretOwnerId(agentId) {
	return `memory-provider:${normalizeAgentId(agentId)}`;
}
//#endregion
export { runtimeMemorySecretOwnerId as t };
