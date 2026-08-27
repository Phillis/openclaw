import { p as ChannelSetupAdapter } from "../../target-registry-types-B_YdM07w.js";
import { t as ChannelSetupWizard } from "../../setup-wizard-types-D9afUG0f.js";
import "../../setup-BlAaE7kJ.js";
//#region extensions/nostr/src/setup-surface.d.ts
declare const nostrSetupAdapter: ChannelSetupAdapter<{
  name?: string;
  privateKey?: string;
  relayUrls?: string;
  useEnv?: boolean;
}>;
declare const nostrSetupWizard: ChannelSetupWizard;
//#endregion
export { nostrSetupAdapter, nostrSetupWizard };