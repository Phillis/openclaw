import { r as GroupKeyResolution } from "./types-ByIHlRxL.js";
import { s as MsgContext } from "./templating-DzyASgcc.js";
import { l as InboundLastRouteUpdate } from "./pairing-messages-CKBHvQNZ.js";

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