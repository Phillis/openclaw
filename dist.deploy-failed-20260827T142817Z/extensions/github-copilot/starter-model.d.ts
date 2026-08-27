import { n as OpenClawConfig } from "../../types.openclaw-3CDavCPO.js";
//#region extensions/github-copilot/starter-model.d.ts
declare function resolveCopilotStarterModel(params: {
  githubToken: string;
  env?: NodeJS.ProcessEnv;
  githubDomain?: string;
  config?: OpenClawConfig;
}): Promise<string>;
//#endregion
export { resolveCopilotStarterModel };