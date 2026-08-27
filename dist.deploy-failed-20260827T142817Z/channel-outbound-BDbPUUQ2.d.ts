import { F as ChannelAccountSnapshot } from "./setup-wizard-types-CzVLMkGu.js";
//#region src/plugin-sdk/channel-lifecycle.core.d.ts
type PassiveAccountLifecycleParams<Handle> = {
  abortSignal?: AbortSignal;
  start: () => Promise<Handle>;
  stop?: (handle: Handle) => void | Promise<void>;
  onStop?: () => void | Promise<void>;
};
/** Runtime context passed to queued channel work. */
/** Bind a fixed account id into a status writer so lifecycle code can emit partial snapshots. */
declare function createAccountStatusSink(params: {
  accountId: string;
  setStatus: (next: ChannelAccountSnapshot) => void;
}): (patch: Omit<ChannelAccountSnapshot, "accountId">) => void;
/**
 * Keep a passive account task alive until abort, then run optional cleanup.
 */
declare function runPassiveAccountLifecycle<Handle>(params: PassiveAccountLifecycleParams<Handle>): Promise<void>;
//#endregion
export { runPassiveAccountLifecycle as n, createAccountStatusSink as t };