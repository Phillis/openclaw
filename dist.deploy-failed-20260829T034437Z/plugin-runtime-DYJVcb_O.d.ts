import { E as PluginRegistry, M as GatewayRequestContext, N as GatewayRequestOptions, j as GatewayContextResolver } from "./plugin-entry-BZAeuuKK.js";
import "./types.openclaw-CZEJqSSW.js";
import { c as PluginOrigin } from "./target-registry-types-Ny7UXMrh.js";
import "./setup-wizard-types-BW-DTrda.js";
//#region src/plugins/runtime/gateway-request-scope.d.ts
type PluginRuntimeGatewayRequestScope = {
  context?: GatewayRequestContext;
  resolveGatewayContext?: GatewayContextResolver;
  client?: GatewayRequestOptions["client"];
  isWebchatConnect: GatewayRequestOptions["isWebchatConnect"];
  pluginId?: string;
  pluginSource?: string;
  pluginOrigin?: PluginOrigin;
  pluginTrustedOfficialInstall?: boolean;
  gatewayMethodDispatchAllowed?: boolean;
  pluginRegistry?: PluginRegistry;
};
/**
 * Returns the current plugin gateway request scope when called from a plugin request handler.
 */
declare function getPluginRuntimeGatewayRequestScope(): PluginRuntimeGatewayRequestScope | undefined;
//#endregion
export { getPluginRuntimeGatewayRequestScope as t };