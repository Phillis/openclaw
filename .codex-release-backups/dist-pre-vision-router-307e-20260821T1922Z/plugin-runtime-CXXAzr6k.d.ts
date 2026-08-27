import { R as PluginRegistry } from "./types-CCx6rk6K.js";
import { i as GatewayRequestOptions, t as GatewayRequestContext } from "./types-_oRRa2Gg.js";
import { a as PluginOrigin } from "./manifest-registry-BwZ4TKdq.js";
//#region src/plugins/runtime/gateway-request-scope.d.ts
type PluginRuntimeGatewayRequestScope = {
  context?: GatewayRequestContext;
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