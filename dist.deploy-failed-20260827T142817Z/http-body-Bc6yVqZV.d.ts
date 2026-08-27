import { IncomingMessage, ServerResponse } from "node:http";

//#region src/infra/http-body.d.ts
type ReadResponseTextPrefixOptions = {
  chunkTimeoutMs?: number;
  onIdleTimeout?: (params: {
    chunkTimeoutMs: number;
  }) => Error; /** Static timeout or lazy resolver evaluated immediately before body consumption. */
  timeoutMs?: number | (() => number);
  onTimeout?: (params: {
    timeoutMs: number;
  }) => Error;
};
type ReadResponseTextPrefixResult = {
  text: string;
  size: number;
  truncated: boolean;
};
/** Reads and decodes a bounded text prefix while cancelling unread overflow. */
declare function readResponseTextPrefix(response: Response, maxBytes: number, options?: ReadResponseTextPrefixOptions): Promise<ReadResponseTextPrefixResult>;
/** Reads a response body under byte, idle, and overall timeout bounds. */
declare function readResponseWithLimit(response: Response, maxBytes: number, options?: ReadResponseTextPrefixOptions & {
  onOverflow?: (params: {
    size: number;
    maxBytes: number;
    res: Response;
  }) => Error;
}): Promise<Buffer>;
//#endregion
export { readResponseWithLimit as i, ReadResponseTextPrefixResult as n, readResponseTextPrefix as r, ReadResponseTextPrefixOptions as t };