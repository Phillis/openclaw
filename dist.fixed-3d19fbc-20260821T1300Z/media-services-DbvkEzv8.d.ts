import { ImageMetadata } from "rastermill";

//#region src/media/image-ops.d.ts
/** JPEG resize request passed through the media-runtime/plugin SDK surface. */
type ResizeToJpegParams = {
  buffer: Buffer;
  maxSide: number;
  quality: number;
  withoutEnlargement?: boolean;
};
/** Ordered JPEG quality ladder used when shrinking generated or attached images. */
declare const IMAGE_REDUCE_QUALITY_STEPS: readonly [85, 75, 65, 55, 45, 35];
/** Detects either OpenClaw's wrapper error or Rastermill's native unavailable error. */
declare function isImageProcessorUnavailableError(err: unknown): boolean;
/** Builds a descending, de-duplicated max-side search grid for iterative image resizing. */
declare function buildImageResizeSideGrid(maxSide: number, sideStart: number): number[];
/** Fully probes display dimensions through Rastermill when header-only metadata is insufficient. */
declare function getImageMetadata(buffer: Buffer): Promise<ImageMetadata | null>;
/** Resizes or encodes image bytes as JPEG through the shared image processor. */
declare function resizeToJpeg(params: ResizeToJpegParams): Promise<Buffer>;
/** Optimizes PNG bytes under a target size and returns the chosen search parameters. */
declare function optimizeImageToPng(buffer: Buffer, maxBytes: number, options?: {
  sides?: readonly number[];
}): Promise<{
  buffer: Buffer;
  optimizedSize: number;
  resizeSide: number;
  compressionLevel: number;
}>;
//#endregion
export { optimizeImageToPng as a, isImageProcessorUnavailableError as i, buildImageResizeSideGrid as n, resizeToJpeg as o, getImageMetadata as r, IMAGE_REDUCE_QUALITY_STEPS as t };