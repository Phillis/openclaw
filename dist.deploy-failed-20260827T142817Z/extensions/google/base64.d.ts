//#region extensions/google/base64.d.ts
/**
 * Convert a ProtoJSON URL-safe Base64 payload to the standard alphabet without
 * validating the payload. Returns undefined when the input mixes alphabets, so
 * callers can reject it before the shared strict validator runs once.
 */
declare function toStandardGoogleProviderBase64(value: string): string | undefined;
declare function canonicalizeGoogleProviderBase64(value: string): string | undefined;
//#endregion
export { canonicalizeGoogleProviderBase64, toStandardGoogleProviderBase64 };