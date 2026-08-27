import { lt as InboundMediaFacts } from "./plugin-entry-GuVBIlyS.js";
//#region src/channels/inbound-event/media.d.ts
/** Attachment metadata accepted from channel plugins before core normalization. */
type ChannelInboundMediaInput = {
  path?: string | null;
  url?: string | null;
  contentType?: string | null;
  kind?: InboundMediaFacts["kind"] | null;
  durationMs?: number | null;
  width?: number | null;
  height?: number | null;
  transcribed?: boolean | null;
  messageId?: string | null;
};
//#endregion
export { ChannelInboundMediaInput as t };