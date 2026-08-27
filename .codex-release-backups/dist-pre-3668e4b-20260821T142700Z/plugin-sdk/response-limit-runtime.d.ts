import { i as readResponseWithLimit, n as ReadResponseTextPrefixResult, r as readResponseTextPrefix, t as ReadResponseTextPrefixOptions } from "../http-body-Bc6yVqZV.js";

//#region packages/media-core/src/read-byte-stream-with-limit.d.ts
/** Details passed to byte-stream overflow error factories. */
type ByteStreamLimitOverflow = {
  size: number;
  maxBytes: number;
};
/** Options for reading an async byte stream under a hard byte cap. */
type ReadByteStreamWithLimitOptions = {
  maxBytes: number;
  onOverflow?: (params: ByteStreamLimitOverflow) => Error;
};
/** Reads and concatenates an async byte stream, throwing once the byte cap is exceeded. */
declare function readByteStreamWithLimit(stream: AsyncIterable<unknown>, opts: ReadByteStreamWithLimitOptions): Promise<Buffer>;
//#endregion
export { type ReadResponseTextPrefixOptions, type ReadResponseTextPrefixResult, readByteStreamWithLimit, readResponseTextPrefix, readResponseWithLimit };