import { n as OpenClawConfig } from "../../types.openclaw-OHssSjQn.js";
import "../../config-contracts-CbBCWgEm.js";
//#region extensions/llama-cpp/provider-policy-api.d.ts
declare function inspectEmbeddingProviderSetup(params: {
  config: OpenClawConfig;
  env: NodeJS.ProcessEnv;
  agentId: string;
  provider: string;
}): {
  provider: string;
  reason: string;
  requirement: string;
  fixHint: string;
} | null;
//#endregion
export { inspectEmbeddingProviderSetup };