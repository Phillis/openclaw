import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { t as formatCliCommand } from "./command-format-HwSAdvXB.js";
import { t as sanitizeForLog } from "./ansi-DjDeieuH.js";
import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { n as formatInlineCodeSpan } from "./markdown-code-Buzx6wvi.js";
//#region src/agents/auth-profiles/oauth-refresh-failure.ts
/**
* OAuth refresh failure classification and operator hints.
* Parses provider/reason codes from refresh failures and formats safe login
* commands without trusting raw provider text.
*/
/** Error type that carries provider and classified OAuth refresh failure reason. */
var OAuthRefreshFailureError = class extends Error {
	constructor(params) {
		super(params.message, { cause: params.cause });
		this.name = "OAuthRefreshFailureError";
		this.provider = params.provider;
		this.profileId = params.profileId;
		this.reason = classifyOAuthRefreshFailureReason(params.message);
	}
};
const OAUTH_REFRESH_FAILURE_PROVIDER_RE = /OAuth token refresh failed for ([^:]+):/i;
const SAFE_PROVIDER_ID_RE = /^[a-z0-9][a-z0-9._-]*$/;
const CLAUDE_CLI_AUTH_FAILURE_RE = /\bclaude-cli\b.+?\b(failed to authenticate|401\s+invalid authentication credentials)\b/is;
function isClaudeCliExpiredOAuthMessage(message) {
	return CLAUDE_CLI_AUTH_FAILURE_RE.test(message);
}
function readStructuredClaudeCliAuthFailure(err) {
	if (!err || typeof err !== "object") return null;
	const candidate = err;
	if (candidate.name !== "FailoverError" || candidate.provider !== "claude-cli" || candidate.reason !== "auth" || candidate.status !== 401) return null;
	return candidate;
}
function classifyStructuredClaudeCliOAuthFailureReason(err) {
	const failure = readStructuredClaudeCliAuthFailure(err);
	if (!failure) return null;
	const rawError = typeof failure.rawError === "string" ? failure.rawError : "";
	const combined = `${err instanceof Error ? err.message : ""}\n${rawError}`;
	const lower = combined.toLowerCase();
	if (/\bnot logged in\b\s*·\s*please run \/login\b/i.test(combined)) return "sign_in_again";
	return lower.includes("failed to authenticate") || lower.includes("invalid authentication credentials") ? "revoked" : null;
}
function isOAuthRefreshFailureMessage(message) {
	const lower = message.toLowerCase();
	return lower.includes("oauth token refresh failed") || lower.includes("access token could not be refreshed") || lower.includes("authentication session could not be refreshed automatically") || isClaudeCliExpiredOAuthMessage(message);
}
function extractOAuthRefreshFailureProvider(message) {
	if (isClaudeCliExpiredOAuthMessage(message)) return "claude-cli";
	const provider = message.match(OAUTH_REFRESH_FAILURE_PROVIDER_RE)?.[1]?.trim();
	return provider && provider.length > 0 ? provider : null;
}
function sanitizeOAuthRefreshFailureProvider(provider) {
	const normalized = normalizeProviderId(provider ? sanitizeForLog(provider).replaceAll("`", "").trim() : "");
	return normalized && SAFE_PROVIDER_ID_RE.test(normalized) ? normalized : null;
}
function sanitizeOAuthRefreshFailureProfileId(profileId) {
	return (profileId ? sanitizeForLog(profileId).trim() : "") || null;
}
function quoteShellArg(value) {
	return `'${process.platform === "win32" ? value.replaceAll("'", "''") : value.replaceAll("'", "'\\''")}'`;
}
/** Wrap a rendered login command in a Markdown code span that survives embedded backticks. */
function formatOAuthRefreshFailureLoginCommandMarkdown(command) {
	return formatInlineCodeSpan(command);
}
/** Classify a raw OAuth refresh failure message into a stable reason code. */
function classifyOAuthRefreshFailureReason(message) {
	const lower = message.toLowerCase();
	if (lower.includes("refresh_token_reused")) return "refresh_token_reused";
	if (lower.includes("invalid_grant")) return "invalid_grant";
	if (lower.includes("token_invalidated")) return "token_invalidated";
	if (lower.includes("signing in again") || lower.includes("sign in again") || lower.includes("log in again")) return "sign_in_again";
	if (lower.includes("invalid refresh token")) return "invalid_refresh_token";
	if (lower.includes("expired or revoked") || lower.includes("revoked")) return "revoked";
	if (isClaudeCliExpiredOAuthMessage(message)) return "revoked";
	return null;
}
/** Classify provider/reason from a user-facing OAuth refresh failure message. */
function classifyOAuthRefreshFailure(message) {
	if (!isOAuthRefreshFailureMessage(message)) return null;
	return {
		provider: sanitizeOAuthRefreshFailureProvider(extractOAuthRefreshFailureProvider(message)),
		reason: classifyOAuthRefreshFailureReason(message)
	};
}
/** Classify provider/reason from the structured OAuth refresh failure error. */
function classifyOAuthRefreshFailureError(err) {
	const seen = /* @__PURE__ */ new Set();
	let candidate = err;
	while (candidate && typeof candidate === "object") {
		const claudeCliReason = classifyStructuredClaudeCliOAuthFailureReason(candidate);
		if (claudeCliReason) return {
			provider: "claude-cli",
			reason: claudeCliReason
		};
		if (candidate instanceof OAuthRefreshFailureError) {
			const profileId = sanitizeOAuthRefreshFailureProfileId(candidate.profileId);
			return {
				provider: sanitizeOAuthRefreshFailureProvider(candidate.provider),
				...profileId ? { profileId } : {},
				reason: candidate.reason
			};
		}
		const record = asOptionalRecord(candidate);
		const rawError = record?.rawError;
		if (typeof rawError === "string") {
			const classified = classifyOAuthRefreshFailure(rawError);
			if (classified) {
				const rawProfileId = record?.profileId;
				const profileId = sanitizeOAuthRefreshFailureProfileId(typeof rawProfileId === "string" ? rawProfileId : void 0);
				return {
					...classified,
					...profileId ? { profileId } : {}
				};
			}
		}
		if (seen.has(candidate)) return null;
		seen.add(candidate);
		candidate = candidate.cause;
	}
	return null;
}
/** Build the login command operators should run after OAuth refresh failure. */
function buildOAuthRefreshFailureLoginCommand(provider, options) {
	const sanitizedProvider = sanitizeOAuthRefreshFailureProvider(provider);
	const sanitizedProfileId = sanitizeOAuthRefreshFailureProfileId(options?.profileId);
	if (sanitizedProvider === "claude-cli") return `${formatCliCommand("claude auth login")} && ${formatCliCommand(sanitizedProfileId ? `openclaw models auth login --provider anthropic --method cli --profile-id ${quoteShellArg(sanitizedProfileId)}` : "openclaw models auth login --provider anthropic --method cli")}`;
	return sanitizedProvider ? formatCliCommand(sanitizedProfileId ? `openclaw models auth login --provider ${sanitizedProvider} --profile-id ${quoteShellArg(sanitizedProfileId)}` : `openclaw models auth login --provider ${sanitizedProvider}`) : formatCliCommand("openclaw models auth login");
}
/** Build operator guidance for an active profile cooldown or disable window. */
function buildAuthProfileUnusableHint(params) {
	if (params.reason === "auth" || params.reason === "auth_permanent" || params.reason === "session_expired") {
		if (params.provider === "google-gemini-cli") return `Gemini CLI OAuth cannot be repaired by OpenClaw. Connect Google with an AI Studio API key using ${formatOAuthRefreshFailureLoginCommandMarkdown(formatCliCommand("openclaw models auth login --provider google"))}, then select that Google profile for the Gemini CLI runtime.`;
		return `Re-authenticate with ${formatOAuthRefreshFailureLoginCommandMarkdown(buildOAuthRefreshFailureLoginCommand(params.provider, { profileId: params.profileId }))}.`;
	}
	if (params.kind === "disabled" && params.reason === "billing") return "Top up credits (provider billing) or switch provider.";
	return "Wait for cooldown or switch provider.";
}
//#endregion
export { classifyOAuthRefreshFailureError as a, classifyOAuthRefreshFailure as i, buildAuthProfileUnusableHint as n, classifyOAuthRefreshFailureReason as o, buildOAuthRefreshFailureLoginCommand as r, formatOAuthRefreshFailureLoginCommandMarkdown as s, OAuthRefreshFailureError as t };
