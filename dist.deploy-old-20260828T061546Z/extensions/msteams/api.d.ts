import { u as ChannelSetupAdapter } from "../../manifest-registry-DdCvbEOK.js";
import { t as ChannelSetupWizard } from "../../setup-wizard-types-BFO9MBX3.js";
import "../../setup-Cg_c54xI.js";
import { t as msteamsPlugin } from "../../channel-D6rt1rxZ.js";
//#region extensions/msteams/src/setup-core.d.ts
declare const msteamsSetupAdapter: ChannelSetupAdapter;
declare function createMSTeamsSetupWizardBase(): Pick<ChannelSetupWizard, "channel" | "resolveAccountIdForConfigure" | "resolveShouldPromptAccountIds" | "status" | "credentials" | "finalize">;
//#endregion
//#region extensions/msteams/src/setup-surface.d.ts
declare function openDelegatedOAuthUrl(url: string): Promise<void>;
declare const msteamsSetupWizard: ChannelSetupWizard;
//#endregion
export { createMSTeamsSetupWizardBase, msteamsPlugin, msteamsSetupAdapter, msteamsSetupWizard, openDelegatedOAuthUrl };