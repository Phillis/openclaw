import { St as OAuthLoginCallbacks, m as ProviderAuthDoctorHintContext, xt as OAuthCredentials } from "../../plugin-entry-C1So83n6.js";
import { a as OAuthProvider, i as OAuthCredential, o as LegacyOAuthRef } from "../../types-zNfpXEzJ.js";
import "../../provider-auth-B-CeAyxE.js";
//#region extensions/github-copilot/oauth.d.ts
declare function loginGithubCopilotOAuth(callbacks: OAuthLoginCallbacks): Promise<OAuthCredentials>;
declare function refreshGithubCopilotOAuth(credential: OAuthCredential): {
  access: string;
  expires: number;
  refresh: string;
  provider: OAuthProvider;
  email?: string;
  enterpriseUrl?: string;
  projectId?: string;
  accountId?: string;
  chatgptPlanType?: string;
  subscriptionType?: string;
  rateLimitTier?: string;
  idToken?: string;
  type: "oauth";
  oauthRef?: LegacyOAuthRef;
  clientId?: string;
  copyToAgents?: boolean;
  displayName?: string;
};
declare function formatGithubCopilotApiKey(credential: {
  type: string;
  refresh?: string;
  enterpriseUrl?: string;
}): string;
declare function parseGithubCopilotApiKey(value: string): {
  githubToken: string;
  githubDomain?: string;
};
declare function buildGithubCopilotAuthDoctorHint(context: ProviderAuthDoctorHintContext): string | undefined;
//#endregion
export { buildGithubCopilotAuthDoctorHint, formatGithubCopilotApiKey, loginGithubCopilotOAuth, parseGithubCopilotApiKey, refreshGithubCopilotOAuth };