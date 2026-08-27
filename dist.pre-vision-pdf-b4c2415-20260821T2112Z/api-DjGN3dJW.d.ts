import { v as OpenClawPluginToolContext, wt as AnyAgentTool } from "./plugin-entry-BvodcAaE.js";
import { d as ChannelSetupInput, u as ChannelSetupAdapter } from "./manifest-registry-CCZunLSs.js";
import { t as ChannelSetupWizard } from "./setup-wizard-types-YKNWBZ_O.js";
//#region extensions/zalouser/src/tool.d.ts
type ZalouserToolContext = Pick<OpenClawPluginToolContext, "deliveryContext">;
declare function createZalouserTool(context?: ZalouserToolContext): AnyAgentTool;
//#endregion
//#region extensions/zalouser/src/setup-core.d.ts
declare const zalouserSetupAdapter: ChannelSetupAdapter<ChannelSetupInput>;
declare function createZalouserSetupWizardProxy(loadWizard: () => Promise<ChannelSetupWizard>): ChannelSetupWizard;
//#endregion
//#region extensions/zalouser/src/setup-surface.d.ts
declare const zalouserSetupWizard: ChannelSetupWizard;
//#endregion
export { createZalouserTool as i, createZalouserSetupWizardProxy as n, zalouserSetupAdapter as r, zalouserSetupWizard as t };