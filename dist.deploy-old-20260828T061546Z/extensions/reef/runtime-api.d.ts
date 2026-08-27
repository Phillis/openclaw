import { u as PluginRuntime } from "../../plugin-entry-CX5-Xb96.js";
import { i as ReefFriendManager, r as ReviewApprovalStore, t as ReefMessageFlow } from "../../flow-D_k2jIp5.js";
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