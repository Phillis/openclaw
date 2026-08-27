import { n as ChannelSetupWizard } from "../../setup-wizard-types-D4fC5oCf.js";
import { u as ChannelSetupAdapter } from "../../manifest-registry-BwZ4TKdq.js";
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