import { ct as PluginRuntime } from "../../plugin-entry-BvodcAaE.js";
import { i as ReefFriendManager, r as ReviewApprovalStore, t as ReefMessageFlow } from "../../flow-BUPw2XD6.js";

//#region extensions/reef/src/runtime.d.ts
type ActiveReef = {
  flow: ReefMessageFlow;
  friends: ReefFriendManager;
  reviews: ReviewApprovalStore;
} | undefined;
declare const setReefRuntime: (next: PluginRuntime) => void, getOptionalReefRuntime: () => PluginRuntime | null, getReefRuntime: () => PluginRuntime;
declare function setActiveReef(value: ActiveReef): void;
declare const getActiveReef: () => {
  flow: ReefMessageFlow;
  friends: ReefFriendManager;
  reviews: ReviewApprovalStore;
};
//#endregion
export { getActiveReef, getReefRuntime, setActiveReef, setReefRuntime };