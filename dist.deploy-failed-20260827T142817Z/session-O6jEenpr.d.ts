import { r as GroupKeyResolution } from "./types-Byd4mWhx.js";
import { s as MsgContext } from "./templating-CW47wETJ.js";
import { l as InboundLastRouteUpdate } from "./pairing-messages-Cn-H_QsE.js";

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