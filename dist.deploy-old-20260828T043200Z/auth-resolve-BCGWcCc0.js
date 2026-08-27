import { v as resolveSecretInputRef } from "./types.secrets-Bre8L6Ts.js";
import { r as copyConfigResolutionFactsExcept } from "./resolution-facts-DIK_QG79.js";
import { a as getRuntimeConfigSnapshot } from "./runtime-snapshot-Cv5MaU8U.js";
import { t as createGatewayCredentialPlan } from "./credential-planner-Cyn3ajET.js";
import { a as resolveGatewayCredentialsFromValues } from "./credentials-CNWVqkD0.js";
//#region src/gateway/auth-resolve.ts
function mergeGatewayAuthConfig(base, override) {
	const merged = { ...base };
	if (!override) return merged;
	for (const key of [
		"mode",
		"token",
		"password",
		"allowTailscale",
		"rateLimit",
		"trustedProxy"
	]) if (override[key] !== void 0) Object.assign(merged, { [key]: override[key] });
	return merged;
}
function finalizeResolvedGatewayAuth(params) {
	const { authConfig, authOverride, token, password } = params;
	const mode = authOverride?.mode ?? authConfig.mode ?? (password ? "password" : token ? "token" : "token");
	return {
		mode,
		modeSource: authOverride?.mode !== void 0 ? "override" : authConfig.mode ? "config" : password ? "password" : token ? "token" : "default",
		token,
		password,
		allowTailscale: authConfig.allowTailscale ?? (params.tailscaleMode === "serve" && mode !== "password" && mode !== "trusted-proxy"),
		trustedProxy: authConfig.trustedProxy
	};
}
/** Resolve Gateway auth mode, credentials, trusted-proxy policy, and Tailscale allowance. */
function resolveGatewayAuth(params) {
	const runtimeConfig = getRuntimeConfigSnapshot();
	if (runtimeConfig && runtimeConfig.gateway?.auth === params.authConfig) return resolveGatewayAuthForConfig({
		config: runtimeConfig,
		authOverride: params.authOverride,
		env: params.env,
		tailscaleMode: params.tailscaleMode
	});
	const authOverride = params.authOverride ?? void 0;
	const authConfig = mergeGatewayAuthConfig(params.authConfig, authOverride);
	const env = params.env ?? process.env;
	const tokenRef = resolveSecretInputRef({ value: authConfig.token }).ref;
	const passwordRef = resolveSecretInputRef({ value: authConfig.password }).ref;
	const resolvedCredentials = resolveGatewayCredentialsFromValues({
		configToken: tokenRef ? void 0 : authConfig.token,
		configPassword: passwordRef ? void 0 : authConfig.password,
		env,
		tokenPrecedence: "config-first",
		passwordPrecedence: "config-first"
	});
	return finalizeResolvedGatewayAuth({
		authConfig,
		authOverride,
		token: resolvedCredentials.token,
		password: resolvedCredentials.password,
		tailscaleMode: params.tailscaleMode
	});
}
/** Resolve auth from an env-substituted config while retaining its resolution facts. */
function resolveGatewayAuthForConfig(params) {
	const authOverride = params.authOverride ?? void 0;
	const authConfig = mergeGatewayAuthConfig(params.config.gateway?.auth, authOverride);
	const config = {
		...params.config,
		gateway: {
			...params.config.gateway,
			auth: authConfig
		}
	};
	const overriddenPaths = [...authOverride?.token !== void 0 ? ["gateway.auth.token"] : [], ...authOverride?.password !== void 0 ? ["gateway.auth.password"] : []];
	copyConfigResolutionFactsExcept(params.config, config, overriddenPaths);
	const plan = createGatewayCredentialPlan({
		config,
		env: params.env
	});
	return finalizeResolvedGatewayAuth({
		authConfig,
		authOverride,
		token: plan.localToken.hasSecretRef ? void 0 : plan.localToken.value ?? plan.envToken ?? plan.remoteToken.value,
		password: plan.localPassword.hasSecretRef ? void 0 : plan.localPassword.value ?? plan.envPassword ?? (plan.authMode === "trusted-proxy" ? void 0 : plan.remotePassword.value),
		tailscaleMode: params.tailscaleMode
	});
}
/** Return the effective token/password secret for clients that cannot model every auth mode. */
function resolveEffectiveSharedGatewayAuth(params) {
	const resolvedAuth = resolveGatewayAuth(params);
	if (resolvedAuth.mode === "token") return {
		mode: "token",
		secret: resolvedAuth.token
	};
	if (resolvedAuth.mode === "password") return {
		mode: "password",
		secret: resolvedAuth.password
	};
	return null;
}
//#endregion
export { resolveGatewayAuth as n, resolveGatewayAuthForConfig as r, resolveEffectiveSharedGatewayAuth as t };
