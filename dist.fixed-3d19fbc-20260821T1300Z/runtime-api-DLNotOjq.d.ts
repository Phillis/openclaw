import { IncomingMessage, ServerResponse } from "node:http";
import { Command } from "commander";

//#region src/utils/sleep.d.ts
/** Promise-based sleep that clamps timer inputs through the shared timeout resolver. */
declare function sleep(ms: number, signal?: AbortSignal): Promise<void>;
//#endregion
//#region src/infra/http-body.d.ts
type RequestBodyLimitErrorCode = "PAYLOAD_TOO_LARGE" | "REQUEST_BODY_TIMEOUT" | "CONNECTION_CLOSED";
type RequestBodyLimitErrorInit = {
  code: RequestBodyLimitErrorCode;
  message?: string;
};
declare class RequestBodyLimitError extends Error {
  readonly code: RequestBodyLimitErrorCode;
  readonly statusCode: number;
  constructor(init: RequestBodyLimitErrorInit);
}
declare function isRequestBodyLimitError(error: unknown, code?: RequestBodyLimitErrorCode): error is RequestBodyLimitError;
declare function requestBodyErrorToText(code: RequestBodyLimitErrorCode): string;
type ReadRequestBodyOptions = {
  maxBytes: number;
  timeoutMs?: number;
  encoding?: BufferEncoding;
};
declare function readRequestBodyWithLimit(req: IncomingMessage, options: ReadRequestBodyOptions): Promise<string>;
//#endregion
export { sleep as i, readRequestBodyWithLimit as n, requestBodyErrorToText as r, isRequestBodyLimitError as t };