import { i as createSecretFileAtomic } from "./secret-file-DN5Ks0Ca.js";
import { C as resolveOAuthDir } from "./paths-BBSTUjD5.js";
import { n as tryReadSecretFileSync } from "./secret-file-Cbg2G7na.js";
import "./secret-file-D0-UDab9.js";
import "./state-paths-DQKtm04E.js";
import path from "node:path";
import crypto from "node:crypto";
//#region extensions/browser/src/browser/extension-relay/relay-auth.ts
/**
* Extension relay auth material.
*
* The relay authenticates the loopback link between OpenClaw and the paired
* Chrome extension with a host-local secret. It is persisted per machine in the
* credentials dir, so the gateway host and every browser node host each own an
* independent token — the extension pairs with whichever machine runs its
* Chrome, and no gateway credential ever has to travel to a node.
*/
const RELAY_SECRET_FILE = "browser-extension-relay.secret";
const RELAY_SECRET_REREAD_ATTEMPTS = 50;
const RELAY_SECRET_REREAD_DELAY_MS = 10;
function resolveExtensionRelaySecretPath(env = process.env) {
	return path.join(resolveOAuthDir(env), RELAY_SECRET_FILE);
}
function normalizeToken(raw) {
	const value = raw.trim();
	return /^[0-9a-f]{64}$/.test(value) ? value : null;
}
/** Read the host-local relay token, or null when it has not been created yet. */
function readExtensionRelayToken(env = process.env) {
	return normalizeToken(tryReadSecretFileSync(resolveExtensionRelaySecretPath(env), "browser extension relay secret") ?? "");
}
/**
* Read the host-local relay token, creating it on first use. Called from relay
* startup and `openclaw browser extension pair` — both run on the machine that
* hosts the browser, so they resolve the same per-host secret.
*
* The create is atomic (O_CREAT|O_EXCL): the gateway service and the pair CLI
* are separate processes that can race on a fresh host, and a non-atomic
* read-then-write would let each mint a distinct token (relay expects one, the
* printed pairing string carries the other → 401). On EEXIST the winner's token
* is re-read.
*/
async function ensureExtensionRelayToken(env = process.env) {
	const secretPath = resolveExtensionRelaySecretPath(env);
	let lastError;
	for (let attempt = 0; attempt < RELAY_SECRET_REREAD_ATTEMPTS; attempt += 1) {
		let canCreate = false;
		try {
			const winner = readExtensionRelayToken(env);
			if (winner) return winner;
			canCreate = attempt === 0;
		} catch (err) {
			lastError = err;
		}
		if (canCreate) {
			const token = crypto.randomBytes(32).toString("hex");
			try {
				await createSecretFileAtomic({
					rootDir: path.dirname(secretPath),
					filePath: secretPath,
					content: `${token}\n`
				});
				return token;
			} catch (err) {
				if (err.code !== "secret-exists") throw err;
				lastError = err;
			}
		}
		await new Promise((resolve) => {
			setTimeout(resolve, RELAY_SECRET_REREAD_DELAY_MS);
		});
	}
	throw new Error("extension relay secret exists but is unreadable/malformed", { cause: lastError });
}
//#endregion
export { readExtensionRelayToken as n, ensureExtensionRelayToken as t };
