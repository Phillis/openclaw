import { r as GroupKeyResolution } from "./types-CNsppBy_.js";
import { s as MsgContext } from "./templating-tHzj-d8O.js";
import { n as InboundLastRouteUpdate } from "./pairing-messages-DeWn9DT3.js";
//#region src/channels/session.d.ts
declare function recordInboundSession(params: {
  storePath: string;
  sessionKey: string;
  ctx: MsgContext;
  groupResolution?: GroupKeyResolution | null;
  createIfMissing?: boolean;
  updateLastRoute?: InboundLastRouteUpdate;
  onRecordError: (err: unknown) => void;
  trackSessionMetaTask?: (task: Promise<unknown>) => void;
}): Promise<void>;
//#endregion
export { recordInboundSession as t };