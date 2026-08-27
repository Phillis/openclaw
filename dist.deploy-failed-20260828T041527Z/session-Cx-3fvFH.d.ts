import { r as GroupKeyResolution } from "./types-CheMd8wT.js";
import { s as MsgContext } from "./templating-D4gA1hJr.js";
import { n as InboundLastRouteUpdate } from "./pairing-messages-CrXQq58Z.js";
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