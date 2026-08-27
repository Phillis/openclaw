import { p as ChannelSetupAdapter } from "../../target-registry-types-Ny7UXMrh.js";
import { t as ChannelSetupWizard } from "../../setup-wizard-types-BW-DTrda.js";
import "../../setup-aU-rV8yP.js";
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