//#region extensions/xai/provider-routing.d.ts
declare function resolveXaiTransport(params: {
  provider: string;
  api?: unknown;
  baseUrl?: unknown;
}): {
  api: "openai-responses";
  baseUrl?: string;
} | undefined;
//#endregion
export { resolveXaiTransport };