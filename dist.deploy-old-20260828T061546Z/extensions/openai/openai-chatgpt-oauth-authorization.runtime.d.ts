//#region extensions/openai/openai-chatgpt-oauth-authorization.runtime.d.ts
declare function resolveOpenAICallbackHost(env?: NodeJS.ProcessEnv): string;
declare function resolveOpenAIRedirectUri(host: string): string;
declare function createOpenAIAuthorizationFlow(originator: string, redirectUri: string): Promise<{
  verifier: string;
  redirectUri: string;
  state: string;
  url: string;
}>;
//#endregion
export { createOpenAIAuthorizationFlow, resolveOpenAICallbackHost, resolveOpenAIRedirectUri };