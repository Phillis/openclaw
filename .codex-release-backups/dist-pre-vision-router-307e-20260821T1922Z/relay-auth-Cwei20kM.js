import { i as createSecretFileAtomic } from "./secret-file-CSNlJNCL.js";
import { t as readSecretFile } from "./secret-read-async-oIy8Pzit.js";
import { C as resolveOAuthDir } from "./paths-CqeDjSA4.js";
import { n as tryReadSecretFileSync } from "./secret-file-Cz1V4EjA.js";
import "./secret-file-DD5yEM8Q.js";
import "./state-paths-BIUvtBLx.js";
import crypto from "node:crypto";
import path from "node:path";
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
	const existing = readExtensionRelayToken(env);
	if (existing) return existing;
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
		for (let attempt = 0; attempt < RELAY_SECRET_REREAD_ATTEMPTS; attempt += 1) {
			try {
				const winner = normalizeToken(await readSecretFile(secretPath, "browser extension relay secret"));
				if (winner) return winner;
			} catch {}
			await new Promise((resolve) => {
				setTimeout(resolve, RELAY_SECRET_REREAD_DELAY_MS);
			});
		}
		throw new Error("extension relay secret exists but is unreadable/malformed", { cause: err });
	}
}
/** Resolve the relay token for config (read-only; null until first ensured). */
function resolveExtensionRelayToken(env = process.env) {
	return readExtensionRelayToken(env);
}
//#endregion
export { readExtensionRelayToken as n, resolveExtensionRelayToken as r, ensureExtensionRelayToken as t };
