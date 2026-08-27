import { T as ProviderPrepareDynamicModelContext } from "../../types-BwmvzNiR.js";
import { n as OpenClawConfig } from "../../types.openclaw-CTCn19OD.js";
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