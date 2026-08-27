import { h as ProviderPrepareDynamicModelContext } from "../../plugin-entry-SSZcu2d5.js";
import { n as OpenClawConfig } from "../../types.openclaw-Dbu8qmVI.js";
import "../../config-contracts-OcWhZue9.js";
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