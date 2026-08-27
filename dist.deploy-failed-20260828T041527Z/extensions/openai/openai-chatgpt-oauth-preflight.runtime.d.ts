//#region extensions/openai/openai-chatgpt-oauth-preflight.runtime.d.ts
type PreflightFailureKind = "tls-cert" | "network";
type OpenAIOAuthTlsPreflightResult = {
  ok: true;
} | {
  ok: false;
  kind: PreflightFailureKind;
  code?: string;
  message: string;
};
declare function runOpenAIOAuthTlsPreflight(options?: {
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}): Promise<OpenAIOAuthTlsPreflightResult>;
//#endregion
export { runOpenAIOAuthTlsPreflight };