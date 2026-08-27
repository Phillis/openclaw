import { h as ProviderPrepareDynamicModelContext } from "../../plugin-entry-C1So83n6.js";
import { n as OpenClawConfig } from "../../types.openclaw-OHssSjQn.js";
import "../../config-contracts-CbBCWgEm.js";
//#region extensions/github-copilot/auth.d.ts
declare function resolveFirstGithubToken(params: {
  agentDir?: string;
  config?: OpenClawConfig;
  env: NodeJS.ProcessEnv;
  profileId?: string;
  authProfileMode?: ProviderPrepareDynamicModelContext["authProfileMode"];
}): Promise<{
  githubToken: string;
  githubDomain?: string;
  hasProfile: boolean;
}>;
//#endregion
export { resolveFirstGithubToken };