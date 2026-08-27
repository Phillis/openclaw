import { n as ActiveNativeHookRelayRegistrationHandle, r as RegisterNativeHookRelayParams, t as NativeHookRelayRetention } from "../native-hook-relay-C59P67yM.js";

//#region src/plugin-sdk/native-hook-relay-runtime.d.ts
type RetainedNativeHookRelayParams = RegisterNativeHookRelayParams & {
  retention: NativeHookRelayRetention;
};
/** Registers a bundled-only relay that may retain host policy for direct children. */
declare function registerRetainedNativeHookRelayForBundledRuntime(params: RetainedNativeHookRelayParams): ActiveNativeHookRelayRegistrationHandle;
//#endregion
export { RetainedNativeHookRelayParams, registerRetainedNativeHookRelayForBundledRuntime };