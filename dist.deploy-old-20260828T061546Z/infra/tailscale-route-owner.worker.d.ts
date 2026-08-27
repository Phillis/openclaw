//#region src/infra/tailscale-route-owner-protocol.d.ts
type TailscaleRouteOwnerMessage = {
  type: "spawned";
  pid: number;
} | {
  type: "ready";
} | {
  type: "failed";
  code: number | null;
  signal: NodeJS.Signals | null;
  stdout: string;
  stderr: string;
};
//#endregion
//#region src/infra/tailscale-route-owner.worker.d.ts
type RouteOwnerStart = {
  argv: string[];
};
type TailscaleRouteOwnerExit = {
  code: number | null;
  signal: NodeJS.Signals | null;
  stopping: boolean;
};
type TailscaleRouteOwnerHandle = {
  exited: Promise<TailscaleRouteOwnerExit>;
  stop: () => void;
};
declare function runTailscaleRouteOwner(start: RouteOwnerStart, sendMessage?: (message: TailscaleRouteOwnerMessage) => void): TailscaleRouteOwnerHandle;
//#endregion
export { TailscaleRouteOwnerExit, TailscaleRouteOwnerHandle, runTailscaleRouteOwner };