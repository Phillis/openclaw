//#region src/auto-reply/codex-login-recovery.ts
const AUTH_PROFILE_LOGIN_REASONS = /* @__PURE__ */ new Set([
	"auth",
	"auth_permanent",
	"session_expired"
]);
/** Builds login recovery only from OAuth evidence, never from a provider name alone. */
function buildCodexLoginRecovery(evidence) {
	const provider = evidence.provider?.trim().toLowerCase().replace(/_/gu, "-");
	const needsLogin = evidence.oauthReason !== null && evidence.oauthReason !== void 0 ? true : evidence.authMode === "oauth" && evidence.failoverReason !== void 0 && AUTH_PROFILE_LOGIN_REASONS.has(evidence.failoverReason);
	if (provider !== "openai" && provider !== "codex" || !needsLogin) return;
	return {
		hint: "OpenAI needs a new login. Send `/login codex` from a private chat or Web UI session. Where shown, you can also select **Log in to Codex**.",
		presentation: { blocks: [{
			type: "buttons",
			buttons: [{
				label: "Log in to Codex",
				action: {
					type: "command",
					command: "/login codex"
				}
			}]
		}] }
	};
}
//#endregion
export { buildCodexLoginRecovery as t };
