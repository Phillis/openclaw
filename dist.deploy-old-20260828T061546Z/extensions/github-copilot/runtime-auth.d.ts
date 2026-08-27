import { n as OpenClawConfig } from "../../types.openclaw-OHssSjQn.js";
import "../../config-contracts-CbBCWgEm.js";
//#region extensions/github-copilot/runtime-auth.d.ts
declare const DEFAULT_COPILOT_API_BASE_URL = "https://api.individual.githubcopilot.com";
declare function resolveCopilotRuntimeAuth(params: {
  githubToken: string;
  env?: NodeJS.ProcessEnv;
  fetchImpl?: typeof fetch;
  githubDomain?: string;
  config?: OpenClawConfig;
}): Promise<{
  apiKey: string;
  source: string;
  baseUrl: string;
}>;
//#endregion
export { DEFAULT_COPILOT_API_BASE_URL, resolveCopilotRuntimeAuth };