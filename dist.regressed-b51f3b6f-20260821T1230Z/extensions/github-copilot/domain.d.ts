import { n as OpenClawConfig } from "../../types.openclaw-CTCn19OD.js";
//#region extensions/github-copilot/domain.d.ts
/** Public GitHub Copilot host used when no data-residency domain is configured. */
declare const PUBLIC_GITHUB_COPILOT_DOMAIN = "github.com";
declare function isSupportedGithubCopilotDomain(raw: string | undefined | null): boolean;
declare function normalizeGithubCopilotDomain(raw: string | undefined | null): string;
/**
 * Resolve the GitHub Copilot host for this provider from (in priority order) the
 * `COPILOT_GITHUB_DOMAIN` env override, the persisted
 * `models.providers.github-copilot.params.githubDomain` config, then public
 * `github.com`. The result always passes through the SDK allowlist
 * (`normalizeGithubCopilotDomain`) so an unsafe value fails closed.
 */
declare function resolveGithubCopilotDomain(params?: {
  env?: NodeJS.ProcessEnv;
  explicit?: string;
  config?: OpenClawConfig;
}): string;
//#endregion
export { PUBLIC_GITHUB_COPILOT_DOMAIN, isSupportedGithubCopilotDomain, normalizeGithubCopilotDomain, resolveGithubCopilotDomain };