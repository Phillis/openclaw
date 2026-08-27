import { n as OpenClawConfig } from "../../types.openclaw-R2xZRh0U.js";
import "../../config-contracts-CGgezQeX.js";
import { Command } from "commander";
//#region extensions/canvas/src/config.d.ts
/** Enablement for Canvas-owned document and renderer routes. */
type CanvasHostConfig = {
  enabled?: boolean;
};
/** Canvas plugin configuration shape. */
type CanvasPluginConfig = {
  host?: CanvasHostConfig;
};
type CanvasPluginConfigSchema = {
  parse: (value: unknown) => CanvasPluginConfig;
};
/** Parses raw Canvas plugin config into a typed, normalized shape. */
declare function parseCanvasPluginConfig(value: unknown): CanvasPluginConfig;
/** Resolves Canvas route configuration from plugin-owned config. */
declare function resolveCanvasHostConfig(params: {
  config?: OpenClawConfig;
  pluginConfig?: Record<string, unknown>;
}): CanvasHostConfig;
/** Returns whether Canvas-owned document and renderer routes should be active. */
declare function isCanvasHostEnabled(config?: OpenClawConfig): boolean;
/** Runtime config parser for Canvas plugin settings. */
declare const canvasConfigSchema: CanvasPluginConfigSchema;
//#endregion
//#region extensions/canvas/src/host/a2ui-route.d.ts
type A2uiHttpRequest = {
  method?: string;
  url?: string;
};
type A2uiHttpResponse = {
  statusCode: number;
  setHeader(name: string, value: number | string | readonly string[]): void;
  end(chunk?: Buffer | string): void;
};
//#endregion
//#region extensions/canvas/src/host/a2ui-shared.d.ts
/** Stable hosted paths for Canvas-owned widget resources. */
/** Hosted path prefix for bundled A2UI renderer assets. */
declare const A2UI_PATH = "/__openclaw__/a2ui";
/** Hosted path prefix for managed widget documents. */
declare const CANVAS_HOST_PATH = "/__openclaw__/canvas";
//#endregion
//#region extensions/canvas/src/host/a2ui.d.ts
/** Handles one HTTP request for the hosted A2UI asset surface. */
declare function handleA2uiHttpRequest(req: A2uiHttpRequest, res: A2uiHttpResponse): Promise<boolean>;
//#endregion
//#region extensions/canvas/src/cli.d.ts
/** Runtime output surface used by Canvas CLI commands. */
type CanvasCliRuntime = {
  log: (message: string) => void;
  error: (message: string) => void;
  exit: (code: number) => void;
  writeJson: (value: unknown) => void;
};
/** Parent node/gateway options consumed by Canvas CLI commands. */
type CanvasNodesRpcOpts = {
  url?: string;
  token?: string;
  timeout?: string;
  json?: boolean;
  node?: string;
  invokeTimeout?: string;
  target?: string;
  x?: string;
  y?: string;
  width?: string;
  height?: string;
};
/** Dependency bundle used to keep Canvas CLI commands testable. */
type CanvasCliDependencies = {
  defaultRuntime: CanvasCliRuntime;
  nodesCallOpts: (cmd: Command, defaults?: {
    timeoutMs?: number;
  }) => Command;
  runNodesCommand: (label: string, action: () => Promise<void>) => Promise<void> | void;
  getNodesTheme: () => {
    ok: (value: string) => string;
  };
  parseTimeoutMs: (raw: unknown) => number | undefined;
  resolveNodeId: (opts: CanvasNodesRpcOpts, query: string) => Promise<string>;
  buildNodeInvokeParams: (params: {
    nodeId: string;
    command: string;
    params?: Record<string, unknown>;
    timeoutMs?: number;
  }) => Record<string, unknown>;
  callGatewayCli: (method: string, opts: CanvasNodesRpcOpts, params?: unknown, callOpts?: {
    transportTimeoutMs?: number;
  }) => Promise<unknown>;
};
/** Registers Canvas subcommands under the nodes CLI command group. */
declare function registerNodesCanvasCommands(nodes: Command, deps: CanvasCliDependencies): void;
//#endregion
export { A2UI_PATH, CANVAS_HOST_PATH, type CanvasCliDependencies, type CanvasHostConfig, type CanvasNodesRpcOpts, type CanvasPluginConfig, canvasConfigSchema, handleA2uiHttpRequest, isCanvasHostEnabled, parseCanvasPluginConfig, registerNodesCanvasCommands, resolveCanvasHostConfig };