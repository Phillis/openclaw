import { u as PluginRuntime } from "../../plugin-entry-BZAeuuKK.js";
import { i as ReefFriendManager, r as ReviewApprovalStore, t as ReefMessageFlow } from "../../flow-Cmkd3gM5.js";
//#region extensions/reef/src/runtime.d.ts
type ActiveReef = {
  flow: ReefMessageFlow;
  friends: ReefFriendManager;
  reviews: ReviewApprovalStore;
};
declare const setReefRuntime: (next: PluginRuntime) => void, getOptionalReefRuntime: () => PluginRuntime | null, getReefRuntime: () => PluginRuntime;
declare function getActiveReef(): ActiveReef;
//#endregion
export { getActiveReef, getReefRuntime, setReefRuntime };