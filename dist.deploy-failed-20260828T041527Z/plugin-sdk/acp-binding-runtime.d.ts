import { n as OpenClawConfig } from "../types.openclaw-DckSqIPo.js";
import { n as ResolvedConfiguredAcpBinding, t as resolveConfiguredAcpBindingRecord } from "../persistent-bindings.resolve-Bfa1sx6u.js";
//#region src/acp/persistent-bindings.lifecycle.d.ts
/** Resolves a configured binding for a conversation and ensures its ACP session exists. */
declare function ensureConfiguredAcpBindingReadyCore(params: {
  cfg: OpenClawConfig;
  configuredBinding: ResolvedConfiguredAcpBinding | null;
}): Promise<{
  ok: true;
} | {
  ok: false;
  error: string;
}>;
//#endregion
export { ensureConfiguredAcpBindingReadyCore as ensureConfiguredAcpBindingReady, resolveConfiguredAcpBindingRecord };