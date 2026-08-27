import { o as OpenClawPluginNodeInvokePolicy, r as OpenClawPluginApi } from "../../types-R6eI-mj_.js";
//#region extensions/anthropic/session-catalog-registration.d.ts
declare function createClaudeSessionNodeInvokePolicies(): OpenClawPluginNodeInvokePolicy[];
declare function registerClaudeSessionDiscovery(api: OpenClawPluginApi): void;
//#endregion
export { createClaudeSessionNodeInvokePolicies, registerClaudeSessionDiscovery };