import { $ as AcpRuntimeTurn, G as AcpRuntimeCapabilities, J as AcpRuntimeEvent, K as AcpRuntimeDoctorReport, Q as AcpRuntimeStatus, W as AcpRuntime, Y as AcpRuntimeHandle, et as AcpRuntimeTurnAttachment, it as AcpSessionUpdateTag, n as OpenClawConfig, nt as AcpRuntimeTurnResult, q as AcpRuntimeEnsureInput, rt as AcpRuntimeTurnResultError, tt as AcpRuntimeTurnInput } from "../types.openclaw-DckSqIPo.js";
import { Ct as AcpRuntimeError, St as unregisterAcpRuntimeBackend, Tt as isAcpRuntimeError, _t as readAcpSessionEntry, bt as registerAcpRuntimeBackend, gt as AcpSessionStoreEntry, ht as AcpSessionManager, vt as AcpRuntimeBackend, wt as AcpRuntimeErrorCode, xt as requireAcpRuntimeBackend, yt as getAcpRuntimeBackend } from "../types-DP7cDwEi.js";
import { t as tryDispatchAcpReplyHook } from "../acpx-B7PJ7Mcc.js";
//#region src/acp/control-plane/manager.d.ts
/** Returns the process-wide ACP session manager singleton. */
declare function getAcpSessionManager(): AcpSessionManager;
//#endregion
//#region src/plugin-sdk/acp-runtime.d.ts
declare function resolveAcpSessionAvailability(params: {
  config: OpenClawConfig;
  backendId: string;
  agentId: string;
}): {
  available: true;
} | {
  available: false;
  message: string;
};
/** Lazy ACP test helper facade combining control-plane and runtime registry helpers. */
declare const testing: {
  resetAcpSessionManagerForTests(): void;
  setAcpSessionManagerForTests(manager: unknown): void;
} & {
  resetAcpRuntimeBackendsForTests(): void;
  getAcpRuntimeRegistryGlobalStateForTests(): {
    backendsById: Map<string, AcpRuntimeBackend>;
  };
};
//#endregion
export { type AcpRuntime, type AcpRuntimeCapabilities, type AcpRuntimeDoctorReport, type AcpRuntimeEnsureInput, AcpRuntimeError, type AcpRuntimeErrorCode, type AcpRuntimeEvent, type AcpRuntimeHandle, type AcpRuntimeStatus, type AcpRuntimeTurn, type AcpRuntimeTurnAttachment, type AcpRuntimeTurnInput, type AcpRuntimeTurnResult, type AcpRuntimeTurnResultError, type AcpSessionStoreEntry, type AcpSessionUpdateTag, testing as __testing, testing, getAcpRuntimeBackend, getAcpSessionManager, isAcpRuntimeError, readAcpSessionEntry, registerAcpRuntimeBackend, requireAcpRuntimeBackend, resolveAcpSessionAvailability, tryDispatchAcpReplyHook, unregisterAcpRuntimeBackend };