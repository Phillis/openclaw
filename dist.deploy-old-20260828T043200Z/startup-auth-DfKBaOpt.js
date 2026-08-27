import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { o as getConfigResolutionFacts, r as copyConfigResolutionFactsExcept } from "./resolution-facts-DIK_QG79.js";
import { r as trimToUndefined, t as createGatewayCredentialPlan } from "./credential-planner-Cyn3ajET.js";
import { t as assertExplicitGatewayAuthModeWhenBothConfigured } from "./auth-mode-policy-DuqbQCOS.js";
import "./credentials-CNWVqkD0.js";
import { r as resolveGatewayAuthForConfig } from "./auth-resolve-BCGWcCc0.js";
import { a as resolveGatewayTokenSecretRefValue, i as resolveGatewayPasswordSecretRefValue } from "./auth-config-utils-DVajsKBW.js";
import crypto from "node:crypto";
//#region src/gateway/known-weak-gateway-secrets.ts
const KNOWN_WEAK_GATEWAY_TOKEN_PLACEHOLDERS = ["change-me-to-a-long-random-token", "change-me-now"];
const KNOWN_WEAK_GATEWAY_PASSWORD_PLACEHOLDERS = ["change-me-to-a-strong-password"];
/**
* Placeholder credentials that have ever shipped in `.env.example` or been
* used as copy-paste examples in onboarding docs. If any of these ever
* becomes the resolved gateway credential, reject it. The operator almost
* certainly copied an example file verbatim without replacing the sentinel,
* which would otherwise leave the gateway protected by a publicly-known
* credential.
*/
const KNOWN_WEAK_GATEWAY_TOKENS = new Set(KNOWN_WEAK_GATEWAY_TOKEN_PLACEHOLDERS);
const KNOWN_WEAK_GATEWAY_PASSWORDS = new Set(KNOWN_WEAK_GATEWAY_PASSWORD_PLACEHOLDERS);
function assertGatewayAuthNotKnownWeak(auth) {
	if (auth.mode === "token") {
		const token = auth.token?.trim() ?? "";
		if (token && KNOWN_WEAK_GATEWAY_TOKENS.has(token)) throw new Error("Invalid config: gateway auth token is set to a published example placeholder from docs or .env.example. Generate a real secret (e.g. `openssl rand -hex 32`) and set OPENCLAW_GATEWAY_TOKEN or gateway.auth.token before starting the gateway.");
		return;
	}
	if (auth.mode === "password") {
		const password = auth.password?.trim() ?? "";
		if (password && KNOWN_WEAK_GATEWAY_PASSWORDS.has(password)) throw new Error("Invalid config: gateway auth password is set to the example placeholder from .env.example. Choose a real password and set OPENCLAW_GATEWAY_PASSWORD or gateway.auth.password before starting the gateway.");
	}
}
//#endregion
//#region src/gateway/startup-auth.ts
const HOOKS_GATEWAY_AUTH_REUSE_WARNING = "Security warning: hooks.token matches active Gateway shared-secret auth. Startup continues for compatibility; rotate hooks.token or Gateway auth. Run openclaw security audit for a full report, and run openclaw doctor --fix when the reused hooks.token is persisted in config.";
/** Merge sparse runtime auth overrides into persisted Gateway auth config. */
function mergeGatewayAuthConfig(base, override) {
	const merged = { ...base };
	if (!override) return merged;
	if (override.mode !== void 0) merged.mode = override.mode;
	if (override.token !== void 0) merged.token = override.token;
	if (override.password !== void 0) merged.password = override.password;
	if (override.allowTailscale !== void 0) merged.allowTailscale = override.allowTailscale;
	if (override.rateLimit !== void 0) merged.rateLimit = override.rateLimit;
	if (override.trustedProxy !== void 0) merged.trustedProxy = override.trustedProxy;
	return merged;
}
/** Merge sparse runtime Tailscale overrides into persisted Gateway Tailscale config. */
function mergeGatewayTailscaleConfig(base, override) {
	const merged = { ...base };
	if (!override) return merged;
	if (override.mode !== void 0) merged.mode = override.mode;
	if (override.preserveFunnel !== void 0) merged.preserveFunnel = override.preserveFunnel;
	return merged;
}
function resolveGatewayAuthFromConfig(params) {
	const tailscaleConfig = mergeGatewayTailscaleConfig(params.cfg.gateway?.tailscale, params.tailscaleOverride);
	return resolveGatewayAuthForConfig({
		config: params.cfg,
		authOverride: params.authOverride,
		env: params.env,
		tailscaleMode: tailscaleConfig.mode ?? "off"
	});
}
function findActiveGatewaySharedSecret(auth) {
	if (auth.mode === "token") return normalizeOptionalString(auth.token) ?? "";
	if (auth.mode === "password" || auth.mode === "trusted-proxy") return normalizeOptionalString(auth.password) ?? "";
	return "";
}
function warnHooksTokenReuseGatewayAuth(params) {
	if (params.cfg.hooks?.enabled !== true || !params.warn) return;
	const hooksToken = normalizeOptionalString(params.cfg.hooks.token) ?? "";
	if (!hooksToken || hooksToken !== findActiveGatewaySharedSecret(params.auth)) return;
	params.warn(HOOKS_GATEWAY_AUTH_REUSE_WARNING);
}
/** Check every source that can satisfy token auth before startup generates one. */
function hasGatewayTokenCandidate(params) {
	if (trimToUndefined(params.env.OPENCLAW_GATEWAY_TOKEN)) return true;
	if (typeof params.authOverride?.token === "string" && params.authOverride.token.trim().length > 0) return true;
	const token = createGatewayCredentialPlan({
		config: params.cfg,
		env: params.env
	}).localToken;
	return token.hasSecretRef || Boolean(token.value);
}
function hasGatewayTokenOverrideCandidate(params) {
	return typeof params.authOverride?.token === "string" && params.authOverride.token.trim().length > 0;
}
function hasGatewayPasswordOverrideCandidate(params) {
	return typeof params.authOverride?.password === "string" && params.authOverride.password.trim().length > 0;
}
/** Ensure startup has effective Gateway auth, generating only an ephemeral token if needed. */
async function ensureGatewayStartupAuth(params) {
	assertExplicitGatewayAuthModeWhenBothConfigured(params.cfg);
	const env = params.env ?? process.env;
	const explicitMode = params.authOverride?.mode ?? params.cfg.gateway?.auth?.mode;
	const credentialPlan = createGatewayCredentialPlan({
		config: params.cfg,
		env
	});
	const resolutionEvaluated = getConfigResolutionFacts(params.cfg) !== null;
	const tokenAlreadySubstituted = resolutionEvaluated && typeof params.cfg.gateway?.auth?.token === "string";
	const passwordAlreadySubstituted = resolutionEvaluated && typeof params.cfg.gateway?.auth?.password === "string";
	const [resolvedTokenRefValue, resolvedPasswordRefValue] = await Promise.all([resolveGatewayTokenSecretRefValue({
		cfg: params.cfg,
		env,
		mode: explicitMode,
		hasTokenOverride: hasGatewayTokenOverrideCandidate({ authOverride: params.authOverride }) || tokenAlreadySubstituted,
		hasPasswordOverride: hasGatewayPasswordOverrideCandidate({ authOverride: params.authOverride }) || passwordAlreadySubstituted,
		hasTokenFallback: Boolean(trimToUndefined(env.OPENCLAW_GATEWAY_TOKEN)),
		hasPasswordFallback: Boolean(credentialPlan.envPassword || credentialPlan.localPassword.value || credentialPlan.localPassword.hasSecretRef)
	}), resolveGatewayPasswordSecretRefValue({
		cfg: params.cfg,
		env,
		mode: explicitMode,
		hasPasswordOverride: hasGatewayPasswordOverrideCandidate({ authOverride: params.authOverride }) || passwordAlreadySubstituted,
		hasTokenOverride: hasGatewayTokenOverrideCandidate({ authOverride: params.authOverride }) || tokenAlreadySubstituted,
		hasPasswordFallback: Boolean(trimToUndefined(env.OPENCLAW_GATEWAY_PASSWORD)),
		hasTokenFallback: hasGatewayTokenCandidate({
			cfg: params.cfg,
			env,
			authOverride: params.authOverride
		})
	})]);
	const authOverride = params.authOverride || resolvedTokenRefValue || resolvedPasswordRefValue ? {
		...params.authOverride,
		...resolvedTokenRefValue ? { token: resolvedTokenRefValue } : {},
		...resolvedPasswordRefValue ? { password: resolvedPasswordRefValue } : {}
	} : void 0;
	const resolutionConfig = hasGatewayTokenCandidate({
		cfg: params.cfg,
		env,
		authOverride
	}) ? params.cfg : {
		...params.cfg,
		gateway: {
			...params.cfg.gateway,
			auth: {
				...params.cfg.gateway?.auth,
				token: void 0
			}
		}
	};
	if (resolutionConfig !== params.cfg) copyConfigResolutionFactsExcept(params.cfg, resolutionConfig, ["gateway.auth.token"]);
	const resolved = resolveGatewayAuthFromConfig({
		cfg: resolutionConfig,
		env,
		authOverride,
		tailscaleOverride: params.tailscaleOverride
	});
	if (resolved.mode !== "token" || (resolved.token?.trim().length ?? 0) > 0) {
		assertGatewayAuthNotKnownWeak(resolved);
		warnHooksTokenReuseGatewayAuth({
			cfg: params.cfg,
			auth: resolved,
			warn: params.warn
		});
		return {
			cfg: params.cfg,
			auth: resolved,
			persistedGeneratedToken: false
		};
	}
	const generatedToken = crypto.randomBytes(24).toString("hex");
	const nextCfg = {
		...params.cfg,
		gateway: {
			...params.cfg.gateway,
			auth: {
				...params.cfg.gateway?.auth,
				mode: "token",
				token: generatedToken
			}
		}
	};
	copyConfigResolutionFactsExcept(params.cfg, nextCfg, ["gateway.auth.token"]);
	const nextAuth = resolveGatewayAuthFromConfig({
		cfg: nextCfg,
		env,
		authOverride: params.authOverride,
		tailscaleOverride: params.tailscaleOverride
	});
	assertGatewayAuthNotKnownWeak(nextAuth);
	warnHooksTokenReuseGatewayAuth({
		cfg: nextCfg,
		auth: nextAuth,
		warn: params.warn
	});
	return {
		cfg: nextCfg,
		auth: nextAuth,
		generatedToken,
		persistedGeneratedToken: false
	};
}
//#endregion
export { assertGatewayAuthNotKnownWeak as i, mergeGatewayAuthConfig as n, mergeGatewayTailscaleConfig as r, ensureGatewayStartupAuth as t };
