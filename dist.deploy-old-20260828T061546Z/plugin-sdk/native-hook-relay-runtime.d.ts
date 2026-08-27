import { d as RegisterNativeHookRelayParams, l as NativeHookRelayRetention, u as ActiveNativeHookRelayRegistrationHandle } from "../types-DP7cDwEi.js";
//#region src/plugin-sdk/native-hook-relay-runtime.d.ts
type RetainedNativeHookRelayParams = RegisterNativeHookRelayParams & {
  retention: NativeHookRelayRetention;
};
/** Registers a bundled-only relay that may retain host policy for direct children. */
declare function registerRetainedNativeHookRelayForBundledRuntime(params: RetainedNativeHookRelayParams): ActiveNativeHookRelayRegistrationHandle;
//#endregion
export { RetainedNativeHookRelayParams, registerRetainedNativeHookRelayForBundledRuntime };