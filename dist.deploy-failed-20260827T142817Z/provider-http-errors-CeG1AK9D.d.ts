import { t as ReadResponseTextPrefixOptions } from "./http-body-Bc6yVqZV.js";

//#region src/agents/provider-http-errors.d.ts
/** Shared timeout and byte-limit options for provider response consumption. */
type ProviderResponseReadOptions = ReadResponseTextPrefixOptions & {
  maxBytes?: number;
  onOverflow?: (params: {
    size: number;
    maxBytes: number;
    res: Response;
  }) => Error;
};
/** Options for bounded provider error-body normalization. */
type ProviderHttpErrorOptions = {
  statusPrefix?: string;
  bodyTimeoutMs?: ReadResponseTextPrefixOptions["timeoutMs"];
  onBodyTimeout?: NonNullable<ReadResponseTextPrefixOptions["onTimeout"]>;
};
/** Trims provider error details to a log- and prompt-safe preview length. */
declare function truncateErrorDetail(detail: string, limit?: number): string;
/** Reads at most `limitBytes` from a response body without buffering provider-sized failures. */
declare function readResponseTextLimited(response: Response, limitBytes?: number, options?: ReadResponseTextPrefixOptions): Promise<string>;
/** Reads a successful provider text response under a byte cap. */
declare function readProviderTextResponse(response: Response, label: string, opts?: ProviderResponseReadOptions): Promise<string>;
/** Formats common provider JSON error payload shapes into one readable detail string. */
declare function formatProviderErrorPayload(payload: unknown): string | undefined;
/** Returns only the normalized provider detail string for callers that do not need metadata. */
declare function extractProviderErrorDetail(response: Response): Promise<string | undefined>;
/** Reads the provider request id header variants used across model and media APIs. */
declare function extractProviderRequestId(response: Response): string | undefined;
/** Builds the human-facing provider HTTP error message from normalized metadata. */
declare function formatProviderHttpErrorMessage(params: {
  label: string;
  status: number;
  detail?: string;
  requestId?: string;
  statusPrefix?: string;
}): string;
/** Creates a normalized provider HTTP error from a failed response. */
declare function createProviderHttpError(response: Response, label: string, options?: ProviderHttpErrorOptions): Promise<Error>;
/** Throws a normalized provider error when a fetch response is not OK. */
declare function assertOkOrThrowProviderError(response: Response, label: string, options?: Omit<ProviderHttpErrorOptions, "statusPrefix">): Promise<void>;
/** Throws a normalized generic HTTP error when a fetch response is not OK. */
declare function assertOkOrThrowHttpError(response: Response, label: string, options?: Omit<ProviderHttpErrorOptions, "statusPrefix">): Promise<void>;
/**
 * Parses a provider JSON response under a byte cap and wraps malformed JSON with the caller's label.
 *
 * The body is read through the same bounded reader as binary responses so a provider that streams an
 * unbounded JSON body cannot force the runtime to buffer the whole payload before parsing.
 */
declare function readProviderJsonResponse<T>(response: Response, label: string, opts?: ProviderResponseReadOptions): Promise<T>;
/** Parses a provider JSON response that must be a top-level object. */
declare function readProviderJsonObjectResponse(response: Response, label: string, opts?: ProviderResponseReadOptions): Promise<Record<string, unknown>>;
/** Parses a provider JSON object response and returns an array field. */
declare function readProviderJsonArrayFieldResponse(response: Response, label: string, field: string, opts?: ProviderResponseReadOptions): Promise<unknown[]>;
/** Rejects text or JSON responses on provider endpoints that should return binary bytes. */
declare function assertProviderBinaryResponseContent(response: Response, label: string, kind?: string): void;
/** Reads a bounded non-empty binary provider response after content-type validation. */
declare function readProviderBinaryResponse(response: Response, label: string, kind?: string, opts?: ProviderResponseReadOptions): Promise<Uint8Array>;
//#endregion
export { extractProviderErrorDetail as a, formatProviderHttpErrorMessage as c, readProviderJsonObjectResponse as d, readProviderJsonResponse as f, truncateErrorDetail as h, createProviderHttpError as i, readProviderBinaryResponse as l, readResponseTextLimited as m, assertOkOrThrowProviderError as n, extractProviderRequestId as o, readProviderTextResponse as p, assertProviderBinaryResponseContent as r, formatProviderErrorPayload as s, assertOkOrThrowHttpError as t, readProviderJsonArrayFieldResponse as u };