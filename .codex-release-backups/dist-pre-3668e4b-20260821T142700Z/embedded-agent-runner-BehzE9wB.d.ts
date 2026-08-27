import { Lt as EmbeddedAgentRunResult, _ as RunEmbeddedAgentParams } from "./host-capability-types-CdpnHc99.js";
//#region src/agents/execution-auth-binding.d.ts
/** Ephemeral proof of the credential or opaque runtime that completed one agent run. */
type AgentExecutionAuthBinding = {
  authProfileId?: string; /** Exact embedded harness that completed the successful turn, including openclaw. */
  agentHarnessId?: string; /** Exact model selected by the successful embedded run. */
  modelId?: string; /** Exact transport used to select that run's credential. */
  modelApi?: string; /** Non-reversible identity hash; credential material never leaves the runner. */
  authFingerprint?: string; /** Runtime-owned principal/session shape used when credentials are intentionally opaque. */
  runtimeOwnerFingerprint?: string; /** Exact opaque owner, or plugin harness carrying a credential-backed turn. */
  runtimeOwnerKind?: OpaqueRuntimeOwnerKind; /** Exact backend/harness id that owned the successful turn. */
  runtimeOwnerId?: string; /** Exact CLI or plugin-harness implementation used by the successful turn. */
  runtimeArtifactFingerprint?: string;
  runtimeArtifactId?: string; /** The prepared CLI bridge used only the selected profile, not ambient CLI auth. */
  skipLocalCredential?: true;
};
type OpaqueRuntimeOwnerKind = "cli-runtime" | "plugin-harness" | "aws-sdk";
//#endregion
//#region src/agents/embedded-agent-runner/run-orchestrator.d.ts
declare function runEmbeddedAgent(paramsInput: RunEmbeddedAgentParams): Promise<EmbeddedAgentRunResult>;
//#endregion
export { AgentExecutionAuthBinding as n, OpaqueRuntimeOwnerKind as r, runEmbeddedAgent as t };