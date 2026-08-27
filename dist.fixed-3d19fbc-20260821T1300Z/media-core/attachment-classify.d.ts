//#region packages/media-core/src/attachment-classify.d.ts
type AttachmentClass = "text" | "document" | "image" | "audio" | "video" | "archive" | "binary";
type AttachmentCharset = "utf-16le" | "utf-16be";
type AttachmentClassification = {
  mime: string | undefined;
  class: AttachmentClass;
  charset?: AttachmentCharset;
};
declare function attachmentClassFromMime(mime?: string | null): AttachmentClass;
declare function classifyAttachmentBytes(params: {
  buffer: Buffer;
  declaredMime?: string | null; /** Ordered fallback hints (e.g. transport Content-Type); bytes arbitrate. */
  additionalMimeHints?: readonly (string | null | undefined)[];
  name?: string | null;
}): Promise<AttachmentClassification>;
//#endregion
export { AttachmentClass, AttachmentClassification, attachmentClassFromMime, classifyAttachmentBytes };