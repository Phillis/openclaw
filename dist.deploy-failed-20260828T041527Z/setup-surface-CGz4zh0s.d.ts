import { n as OpenClawConfig } from "./types.openclaw-D3Ap19Na.js";
import { u as ChannelSetupAdapter } from "./manifest-registry-DdCvbEOK.js";
import { t as ChannelSetupWizard } from "./setup-wizard-types-BFO9MBX3.js";
import "./setup-Cg_c54xI.js";
//#region extensions/feishu/src/setup-core.d.ts
declare function setFeishuNamedAccountEnabled(cfg: OpenClawConfig, accountId: string, enabled: boolean): OpenClawConfig;
declare const feishuSetupAdapter: ChannelSetupAdapter;
//#endregion
//#region extensions/feishu/src/setup-surface.d.ts
type WizardPrompter = Parameters<NonNullable<ChannelSetupWizard["finalize"]>>[0]["prompter"];
declare function runFeishuLogin(params: {
  cfg: OpenClawConfig;
  prompter: WizardPrompter;
}): Promise<OpenClawConfig>;
declare const feishuSetupWizard: ChannelSetupWizard;
//#endregion
export { setFeishuNamedAccountEnabled as i, runFeishuLogin as n, feishuSetupAdapter as r, feishuSetupWizard as t };