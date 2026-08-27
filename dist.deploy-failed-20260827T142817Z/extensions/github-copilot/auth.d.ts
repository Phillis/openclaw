import { T as ProviderPrepareDynamicModelContext } from "../../types-7E39v2Gx.js";
import { n as OpenClawConfig } from "../../types.openclaw-3CDavCPO.js";
//#region extensions/github-copilot/auth.d.ts
declare function resolveFirstGithubToken(params: {
  agentDir?: string;
  config?: OpenClawConfig;
  env: NodeJS.ProcessEnv;
  profileId?: string;
  authProfileMode?: ProviderPrepareDynamicModelContext["authProfileMode"];
}): Promise<{
  githubToken: string;
  hasProfile: boolean;
}>;
//#endregion
export { resolveFirstGithubToken };