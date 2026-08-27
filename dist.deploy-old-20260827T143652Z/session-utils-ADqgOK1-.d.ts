import { i as OpenClawConfig } from "./types.openclaw-woQof385.js";
import { IncomingMessage, ServerResponse } from "node:http";

//#region src/infra/heartbeat-runner-scheduler.d.ts
type HeartbeatRunner = {
  stop: () => void;
  updateConfig: (cfg: OpenClawConfig) => void;
};
//#endregion
//#region src/plugins/services.d.ts
type PluginServicesHandle = {
  stop: () => Promise<void>;
};
//#endregion
//#region src/gateway/server-startup-post-attach.d.ts
type Awaitable<T> = T | Promise<T>;
type GatewayPostReadySidecarHandle = {
  stop: () => Awaitable<void>;
};
//#endregion
export { PluginServicesHandle as n, HeartbeatRunner as r, GatewayPostReadySidecarHandle as t };