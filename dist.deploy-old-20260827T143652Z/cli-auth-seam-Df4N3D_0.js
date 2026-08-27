import { o as readClaudeCliCredentialsCached } from "./external-cli-sync-CU9M9_mw.js";
import "./provider-auth-CZW5iaiY.js";
//#region extensions/anthropic/cli-auth-seam.ts
/**
* Claude CLI auth seam. Setup may prompt for keychain-backed credentials while
* runtime paths stay non-interactive.
*/
/** Read Claude CLI credentials for interactive setup paths. */
function readClaudeCliCredentialsForSetup() {
	return readClaudeCliCredentialsCached();
}
/** Read Claude CLI credentials for setup checks that must not prompt. */
function readClaudeCliCredentialsForSetupNonInteractive() {
	let unreadable = false;
	const credential = readClaudeCliCredentialsCached({
		allowKeychainPrompt: false,
		tryKeychainWithoutPrompt: true,
		ttlMs: 0,
		onStoredCredentialUnreadable: () => {
			unreadable = true;
		}
	});
	return credential ? {
		status: "available",
		credential
	} : { status: unreadable ? "unreadable" : "missing" };
}
/** Read Claude CLI credentials for runtime without keychain prompts. */
function readClaudeCliCredentialsForRuntime() {
	return readClaudeCliCredentialsCached({ allowKeychainPrompt: false });
}
//#endregion
export { readClaudeCliCredentialsForSetup as n, readClaudeCliCredentialsForSetupNonInteractive as r, readClaudeCliCredentialsForRuntime as t };
