import { n as OpenClawConfig } from "./types.openclaw-n6JIVcIK.js";
import { d as ChannelSetupInput, f as RuntimeEnv } from "./manifest-registry-CMV4LCJ1.js";
import { n as ChannelSetupWizard, t as ChannelSetupDmPolicy } from "./setup-wizard-types-CEvwzrXW.js";
import "./runtime-env-BaxUg6ql.js";
import "./setup-0oKNc6nY.js";
//#region extensions/zalo/src/setup-core.d.ts
declare const zaloSetupAdapter: {
  singleAccountKeysToMove: string[];
  resolveAccountId?: ((params: {
    cfg: OpenClawConfig;
    accountId?: string;
    input?: ChannelSetupInput | undefined;
  }) => string) | undefined;
  prepareAccountConfigInput?: ((params: {
    cfg: OpenClawConfig;
    accountId: string;
    input: ChannelSetupInput;
    runtime: RuntimeEnv;
  }) => ChannelSetupInput | Promise<ChannelSetupInput>) | undefined;
  resolveBindingAccountId?: (params: {
    cfg: OpenClawConfig;
    agentId: string;
    accountId?: string;
  }) => string | undefined;
  applyAccountName?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    name?: string;
  }) => OpenClawConfig;
  applyAccountConfig: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    input: ChannelSetupInput;
  }) => OpenClawConfig;
  afterAccountConfigWritten?: ((params: {
    previousCfg: OpenClawConfig;
    cfg: OpenClawConfig;
    accountId: string;
    input: ChannelSetupInput;
    runtime: RuntimeEnv;
  }) => Promise<void> | void) | undefined;
  validateInput?: ((params: {
    cfg: OpenClawConfig;
    accountId: string;
    input: ChannelSetupInput;
  }) => string | null) | undefined;
  namedAccountPromotionKeys?: readonly string[];
  resolveSingleAccountPromotionTarget?: (params: {
    channel: Record<string, unknown>;
  }) => string | undefined;
};
declare const zaloDmPolicy: ChannelSetupDmPolicy & {
  promptAllowFrom: NonNullable<ChannelSetupDmPolicy["promptAllowFrom"]>;
};
declare function createZaloSetupWizardProxy(loadWizard: () => Promise<ChannelSetupWizard>): ChannelSetupWizard;
//#endregion
//#region extensions/zalo/src/setup-surface.d.ts
declare const zaloSetupWizard: ChannelSetupWizard;
declare namespace setup_surface_d_exports {
  export { zaloSetupAdapter, zaloSetupWizard };
}
//#endregion
export { zaloSetupAdapter as a, zaloDmPolicy as i, zaloSetupWizard as n, createZaloSetupWizardProxy as r, setup_surface_d_exports as t };