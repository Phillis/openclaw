//#region packages/media-core/src/constants.d.ts
/** Default outbound image payload cap shared by media loaders and adapters. */
declare const MAX_IMAGE_BYTES: number;
/** Default outbound audio payload cap shared by media loaders and adapters. */
declare const MAX_AUDIO_BYTES: number;
/** Default outbound video payload cap shared by media loaders and adapters. */
declare const MAX_VIDEO_BYTES: number;
/** Default outbound document payload cap shared by media loaders and adapters. */
declare const MAX_DOCUMENT_BYTES: number;
/** Canonical media families used by attachment facts, routing, and MIME classification. */
type MediaKind = "image" | "audio" | "video" | "document" | "sticker" | "unknown";
/** Maps a MIME type to the media family used for size limits and routing. */
declare function mediaKindFromMime(mime?: string | null): MediaKind | undefined;
/** Returns the default byte cap for a classified media family. */
declare function maxBytesForKind(kind: MediaKind): number;
//#endregion
export { MediaKind as a, MAX_VIDEO_BYTES as i, MAX_DOCUMENT_BYTES as n, maxBytesForKind as o, MAX_IMAGE_BYTES as r, mediaKindFromMime as s, MAX_AUDIO_BYTES as t };