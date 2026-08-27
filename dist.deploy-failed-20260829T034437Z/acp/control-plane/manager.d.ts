import { i as AcpSessionRuntimeOptions } from "../../types-Cx-scs5J.js";
import { a as AcpManagerObservabilitySnapshot, c as AcpSessionStatus, i as AcpInitializeSessionInput, l as AcpStartupIdentityReconcileResult, n as AcpCloseSessionInput, o as AcpRunTurnInput, r as AcpCloseSessionResult, s as AcpSessionResolution, t as AcpSessionManager } from "../../manager.core-Dd3r7Zhk.js";
//#region src/acp/control-plane/manager.d.ts
/** Returns the process-wide ACP session manager singleton. */
declare function getAcpSessionManager(): AcpSessionManager;
declare const testing: {
  resetAcpSessionManagerForTests(): void;
  setAcpSessionManagerForTests(manager: unknown): void;
};
//#endregion
export { type AcpCloseSessionInput, type AcpCloseSessionResult, type AcpInitializeSessionInput, type AcpManagerObservabilitySnapshot, type AcpRunTurnInput, AcpSessionManager, type AcpSessionResolution, type AcpSessionRuntimeOptions, type AcpSessionStatus, type AcpStartupIdentityReconcileResult, getAcpSessionManager, testing };