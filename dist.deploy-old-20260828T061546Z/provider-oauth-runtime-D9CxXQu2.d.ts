import { c as Model } from "./types-Sg3pk96c.js";
//#region src/plugin-sdk/provider-oauth-runtime.d.ts
/** Normalized OAuth credential bundle persisted by provider auth profiles. */
type OAuthCredentials = {
  /** Refresh token or provider-equivalent long-lived credential. */
  refresh: string;
  /** Access token or provider-equivalent bearer credential. */
  access: string;
  /** Absolute epoch milliseconds when the access token should be considered expired. */
  expires: number;
  [key: string]: unknown;
};
/** Stable provider id used by OAuth credential and config routing. */
type OAuthProviderId = string;
/** Manual input prompt shown during OAuth login flows. */
type OAuthPrompt = {
  /** Prompt text shown to the operator. */
  message: string;
  /** Optional placeholder for manual text entry. */
  placeholder?: string;
  /** Whether empty input should be accepted instead of reprompting. */
  allowEmpty?: boolean;
};
/** Authorization URL and optional instructions shown before OAuth completion. */
type OAuthAuthInfo = {
  /** Provider authorization URL shown to the user. */
  url: string;
  /** Optional provider-specific instruction text for manual flows. */
  instructions?: string;
};
/** One selectable OAuth login option. */
type OAuthSelectOption = {
  /** Stable option id returned when the operator selects this entry. */
  id: string;
  /** Human-readable option label shown in the selector. */
  label: string;
};
/** Selector prompt used when a provider offers multiple OAuth login choices. */
type OAuthSelectPrompt = {
  /** Prompt text shown above the selectable options. */
  message: string;
  /** Options available for the operator to choose from. */
  options: OAuthSelectOption[];
};
/** UI/runtime callbacks used by provider OAuth login implementations. */
interface OAuthLoginCallbacks {
  /** Emits authorization URL/instructions to the UI before waiting for completion. */
  onAuth: (info: OAuthAuthInfo) => void;
  /** Prompts for manual input such as pasted callback URLs or authorization codes. */
  onPrompt: (prompt: OAuthPrompt) => Promise<string>;
  /** Reports human-readable login progress without exposing secrets. */
  onProgress?: (message: string) => void;
  /** Optional direct manual-code entry hook used when callback-server flows cannot complete. */
  onManualCodeInput?: () => Promise<string>;
  /** Show an interactive selector and return the selected option id, or undefined on cancel. */
  onSelect?: (prompt: OAuthSelectPrompt) => Promise<string | undefined>;
  /** Cancels pending OAuth waits and prompts when aborted. */
  signal?: AbortSignal;
}
/** Provider OAuth contract implemented by provider plugins. */
interface OAuthProviderInterface {
  /** Stable provider id used for credential and config routing. */
  readonly id: OAuthProviderId;
  /** Human-readable provider name shown in login flows. */
  readonly name: string;
  /** Run the login flow and return credentials to persist. */
  login(callbacks: OAuthLoginCallbacks): Promise<OAuthCredentials>;
  /** Whether login uses a local callback server and supports manual code input. */
  usesCallbackServer?: boolean;
  /** Refresh expired credentials and return updated credentials to persist. */
  refreshToken(credentials: OAuthCredentials): Promise<OAuthCredentials>;
  /** Convert credentials to an API key string for the provider. */
  getApiKey(credentials: OAuthCredentials): string;
  /** Optionally adjust models for this provider, such as updating baseUrl. */
  modifyModels?(models: Model[], credentials: OAuthCredentials): Model[];
}
//#endregion
export { OAuthProviderInterface as a, OAuthProviderId as i, OAuthLoginCallbacks as n, OAuthPrompt as r, OAuthCredentials as t };