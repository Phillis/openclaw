//#region extensions/openai/openai-chatgpt-oauth-token.runtime.d.ts
type TokenSuccess = {
  type: "success";
  access: string;
  refresh: string;
  expires: number;
};
type TokenFailure = {
  type: "failed";
  message: string;
  status?: number;
};
type TokenResult = TokenSuccess | TokenFailure;
type TokenRequestOptions = {
  signal?: AbortSignal;
  timeoutMs?: number;
};
declare function exchangeOpenAIAuthorizationCode(code: string, verifier: string, redirectUri: string, options?: TokenRequestOptions): Promise<TokenResult>;
declare function refreshOpenAIAccessToken(refreshToken: string, options?: TokenRequestOptions): Promise<TokenResult>;
//#endregion
export { exchangeOpenAIAuthorizationCode, refreshOpenAIAccessToken };