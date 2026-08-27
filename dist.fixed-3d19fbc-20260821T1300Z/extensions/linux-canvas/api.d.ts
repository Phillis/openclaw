import { tt as OpenClawPluginNodeHostCommand } from "../../types-WpPwqCDX.js";

//#region extensions/linux-canvas/src/ipc-client.d.ts
type LinuxCanvasActionEvent = {
  event: "a2ui-action";
  id: string;
  action: unknown;
};
type LinuxCanvasIpcRequestHooks = {
  /** Called synchronously when this FIFO request is about to reach the app. */onDispatch?(): void;
};
type LinuxCanvasIpcTransport = {
  request(command: string, paramsJSON: string, hooks?: LinuxCanvasIpcRequestHooks): Promise<string>;
  setActionHandler(handler: (event: LinuxCanvasActionEvent) => Promise<void>): void;
  sendActionResult(id: string, result: {
    ok: boolean;
    error?: string;
  }): void;
  close(): void;
};
//#endregion
//#region extensions/linux-canvas/src/commands.d.ts
type LinuxCanvasCommandsOptions = {
  platform?: NodeJS.Platform;
  env?: NodeJS.ProcessEnv;
  socketExists?: (socketPath: string) => boolean;
  watchSocket?: (socketPath: string, onChange: () => void) => () => void;
  transport?: LinuxCanvasIpcTransport;
};
declare function createLinuxCanvasCommands(options?: LinuxCanvasCommandsOptions): OpenClawPluginNodeHostCommand[];
//#endregion
export { type LinuxCanvasCommandsOptions, createLinuxCanvasCommands };