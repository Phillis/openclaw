import { X as OpenClawPluginNodeInvokePolicy, i as OpenClawPluginApi } from "../../plugin-entry-CX5-Xb96.js";
//#region extensions/anthropic/session-catalog-registration.d.ts
declare function createClaudeSessionNodeInvokePolicies(): OpenClawPluginNodeInvokePolicy[];
declare function registerClaudeSessionDiscovery(api: OpenClawPluginApi): void;
//#endregion
export { createClaudeSessionNodeInvokePolicies, registerClaudeSessionDiscovery };