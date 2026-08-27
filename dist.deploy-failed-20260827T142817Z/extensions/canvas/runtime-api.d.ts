import { n as OpenClawConfig } from "../../types.openclaw-Djf9z9fV.js";
import { E as RuntimeEnv } from "../../manifest-registry-CHpEok17.js";
import { Duplex } from "node:stream";
import { WebSocketServer } from "ws";
import { IncomingMessage, ServerResponse } from "node:http";
import { Command } from "commander";
import chokidar from "chokidar";

//#region extensions/canvas/src/config.d.ts
/** Host-server configuration for Canvas and A2UI assets. */
type CanvasHostConfig = {
  enabled?: boolean;
  root?: string;
  port?: number;
  liveReload?: boolean;
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
/** Returns whether the bundled Canvas plugin is effectively enabled. */
declare function isCanvasPluginEnabled(config?: OpenClawConfig): boolean;
/** Resolves Canvas host config from plugin config or root config. */
declare function resolveCanvasHostConfig(params: {
  config?: OpenClawConfig;
  pluginConfig?: Record<string, unknown>;
}): CanvasHostConfig;
/** Returns whether the Canvas hosted route/server surface should be active. */
declare function isCanvasHostEnabled(config?: OpenClawConfig): boolean;
/** Runtime config parser for Canvas plugin settings. */
declare const canvasConfigSchema: CanvasPluginConfigSchema;
//#endregion
//#region extensions/canvas/src/host/a2ui-shared.d.ts
/**
 * Shared A2UI/Canvas host paths and live-reload injection helpers.
 */
/** Hosted path prefix for bundled A2UI assets. */
declare const A2UI_PATH = "/__openclaw__/a2ui";
/** Hosted path prefix for Canvas document/static assets. */
declare const CANVAS_HOST_PATH = "/__openclaw__/canvas";
/** Hosted WebSocket path for Canvas live reload. */
declare const CANVAS_WS_PATH = "/__openclaw__/ws";
//#endregion
//#region extensions/canvas/src/host/a2ui.d.ts
/** Handles one HTTP request for the hosted A2UI asset surface. */
declare function handleA2uiHttpRequest(req: IncomingMessage, res: ServerResponse, options?: {
  liveReload?: boolean;
}): Promise<boolean>;
//#endregion
//#region extensions/canvas/src/host/server.d.ts
/** Options for creating only the Canvas host request handler. */
type CanvasHostHandlerOpts = {
  runtime: RuntimeEnv;
  rootDir?: string;
  basePath?: string;
  allowInTests?: boolean;
  liveReload?: boolean;
  watchFactory?: typeof chokidar.watch;
  webSocketServerClass?: typeof WebSocketServer;
};
/** Canvas host handler for HTTP requests, WebSocket upgrades, and teardown. */
type CanvasHostHandler = {
  rootDir: string;
  basePath: string;
  handleHttpRequest: (req: IncomingMessage, res: ServerResponse) => Promise<boolean>;
  handleUpgrade: (req: IncomingMessage, socket: Duplex, head: Buffer) => boolean;
  close: () => Promise<void>;
};
/** Creates a Canvas static-file handler with optional live reload. */
declare function createCanvasHostHandler(opts: CanvasHostHandlerOpts): Promise<CanvasHostHandler>;
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
  js?: string;
  jsonl?: string;
  text?: string;
  format?: string;
  maxWidth?: string;
  quality?: string;
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
  writeBase64ToFile: (filePath: string, base64: string) => Promise<unknown>;
  shortenHomePath: (filePath: string) => string;
};
/** Registers Canvas subcommands under the nodes CLI command group. */
declare function registerNodesCanvasCommands(nodes: Command, deps: CanvasCliDependencies): void;
//#endregion
//#region extensions/canvas/src/cli-helpers.d.ts
type CanvasSnapshotPayload = {
  format: CanvasSnapshotFormat;
  base64: string;
};
type CanvasSnapshotFormat = "png" | "jpg" | "jpeg";
/** Parses the node.invoke canvas.snapshot payload shape. */
declare function parseCanvasSnapshotPayload(value: unknown): CanvasSnapshotPayload;
/** Builds a safe temp path for a Canvas snapshot output file. */
declare function canvasSnapshotTempPath(opts: {
  ext: string;
  tmpDir?: string;
  id?: string;
}): string;
//#endregion
//#region src/gateway/hosted-plugin-surface-url.d.ts
type HostSource = string | null | undefined;
/** Inputs used to infer the externally reachable plugin surface URL. */
type HostedPluginSurfaceUrlParams = {
  port?: number;
  hostOverride?: HostSource;
  forwardedHost?: HostSource | HostSource[];
  requestHost?: HostSource;
  forwardedProto?: HostSource | HostSource[];
  localAddress?: HostSource;
  scheme?: "http" | "https";
};
//#endregion
//#region extensions/canvas/src/host-url.d.ts
type CanvasHostUrlParams = Omit<HostedPluginSurfaceUrlParams, "port"> & {
  canvasPort?: number;
};
/** Resolves the externally visible Canvas host URL for a gateway/plugin surface. */
declare function resolveCanvasHostUrl(params: CanvasHostUrlParams): string | undefined;
//#endregion
export { A2UI_PATH, CANVAS_HOST_PATH, CANVAS_WS_PATH, type CanvasCliDependencies, type CanvasHostConfig, type CanvasHostHandler, type CanvasNodesRpcOpts, type CanvasPluginConfig, canvasConfigSchema, canvasSnapshotTempPath, createCanvasHostHandler, handleA2uiHttpRequest, isCanvasHostEnabled, isCanvasPluginEnabled, parseCanvasPluginConfig, parseCanvasSnapshotPayload, registerNodesCanvasCommands, resolveCanvasHostConfig, resolveCanvasHostUrl };