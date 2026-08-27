import { u as ChannelSetupAdapter } from "../../manifest-registry-BJhqwERh.js";
import { t as ChannelSetupWizard } from "../../setup-wizard-types-CTl56MML.js";
import "../../setup-D8bin8hp.js";
import { t as msteamsPlugin } from "../../channel-C6_uUjIW.js";
//#region extensions/msteams/src/setup-core.d.ts
declare const msteamsSetupAdapter: ChannelSetupAdapter;
declare function createMSTeamsSetupWizardBase(): Pick<ChannelSetupWizard, "channel" | "resolveAccountIdForConfigure" | "resolveShouldPromptAccountIds" | "status" | "credentials" | "finalize">;
//#endregion
//#region extensions/msteams/src/setup-surface.d.ts
declare function openDelegatedOAuthUrl(url: string): Promise<void>;
declare const msteamsSetupWizard: ChannelSetupWizard;
//#endregion
export { createMSTeamsSetupWizardBase, msteamsPlugin, msteamsSetupAdapter, msteamsSetupWizard, openDelegatedOAuthUrl };