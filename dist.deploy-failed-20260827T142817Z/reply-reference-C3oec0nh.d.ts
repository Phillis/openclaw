import { V as InboundMediaFacts } from "./types-DYqBZyXL.js";
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
type MediaPlaceholderTextFact = Readonly<Pick<ChannelInboundMediaInput, "contentType" | "kind" | "path" | "url">>;
//#endregion
export { MediaPlaceholderTextFact as t };