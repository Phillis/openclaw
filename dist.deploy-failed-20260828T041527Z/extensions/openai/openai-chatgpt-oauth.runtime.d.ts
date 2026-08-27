import { N as ProviderAuthContext } from "../../plugin-entry-bE5OaTNY.js";
import { t as OAuthCredentials } from "../../provider-oauth-runtime-D9CxXQu2.js";
//#region extensions/openai/openai-chatgpt-oauth.runtime.d.ts
declare function loginOpenAICodexOAuth(params: {
  prompter: ProviderAuthContext["prompter"];
  runtime: ProviderAuthContext["runtime"];
  oauth: ProviderAuthContext["oauth"];
  isRemote: boolean;
  openUrl: (url: string) => Promise<void>;
  signal?: AbortSignal;
  onManualCodeInput?: () => Promise<string>;
  localBrowserMessage?: string;
}): Promise<OAuthCredentials | null>;
//#endregion
export { loginOpenAICodexOAuth };