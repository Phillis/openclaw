import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { t as createGatewayCredentialPlan } from "./credential-planner-Cyn3ajET.js";
import { n as isGatewaySecretRefUnavailableError, o as resolveGatewayProbeCredentialsFromConfig } from "./credentials-CNWVqkD0.js";
import { n as resolveGatewayProbeSurfaceAuth } from "./auth-surface-resolution-DXXPBMhL.js";
import { n as resolveGatewayCredentialsWithSecretInputs } from "./credentials-secret-inputs-WvTGd3yR.js";
//#region src/gateway/probe-auth.ts
function buildGatewayProbeCredentialPolicy(params) {
	const cfg = resolveGatewayProbeCredentialConfig(params);
	const plan = params.mode === "local" && params.localPrecedence === "env-first" ? createGatewayCredentialPlan({
		config: cfg,
		env: params.env
	}) : void 0;
	const activeLocalRef = plan?.localTokenCanWin && plan.localToken.hasSecretRef || (plan?.localPasswordCanWin || plan?.authMode === void 0) && plan?.localPassword.hasSecretRef;
	return {
		activeLocalRef,
		config: cfg,
		cfg,
		env: params.env,
		explicitAuth: params.explicitAuth,
		urlOverride: params.urlOverride,
		urlOverrideSource: params.urlOverrideSource,
		modeOverride: params.mode,
		mode: params.mode,
		localPrecedence: activeLocalRef ? "config-first" : params.localPrecedence,
		remoteTokenFallback: "remote-only"
	};
}
function resolveGatewayProbeCredentialConfig(params) {
	const gateway = params.cfg.gateway;
	const credentials = params.mode === "local" ? gateway?.remote : gateway?.auth;
	if (!credentials || credentials.token === void 0 && credentials.password === void 0) return params.cfg;
	const credentialsWithoutAuth = { ...credentials };
	delete credentialsWithoutAuth.token;
	delete credentialsWithoutAuth.password;
	return {
		...params.cfg,
		gateway: {
			...gateway,
			...params.mode === "local" ? { remote: credentialsWithoutAuth } : { auth: credentialsWithoutAuth }
		}
	};
}
function resolveExplicitProbeAuth(explicitAuth) {
	return {
		token: normalizeOptionalString(explicitAuth?.token),
		password: normalizeOptionalString(explicitAuth?.password)
	};
}
function hasExplicitProbeAuth(auth) {
	return Boolean(auth.token || auth.password);
}
function buildUnresolvedProbeAuthWarning(path) {
	return `${path} SecretRef is unresolved in this command path; probing without configured auth credentials.`;
}
function resolveGatewayProbeWarning(error) {
	if (!isGatewaySecretRefUnavailableError(error)) throw error;
	return buildUnresolvedProbeAuthWarning(error.path);
}
/** Resolves synchronous probe auth, throwing when configured secrets cannot be read. */
function resolveGatewayProbeAuth(params) {
	return resolveGatewayProbeCredentialsFromConfig(buildGatewayProbeCredentialPolicy(params));
}
async function resolveGatewayProbeAuthResolutionWithSecretInputs(params) {
	const policy = buildGatewayProbeCredentialPolicy(params);
	const explicitAuth = resolveExplicitProbeAuth(params.explicitAuth);
	if ((params.mode === "remote" || policy.activeLocalRef) && !hasExplicitProbeAuth(explicitAuth) && !normalizeOptionalString(params.urlOverride)) {
		const resolved = await resolveGatewayProbeSurfaceAuth({
			config: policy.config,
			env: policy.env,
			surface: params.mode
		});
		const warning = resolved.diagnostics?.join("\n");
		if (warning) return {
			auth: resolved.source === "config" ? {
				token: resolved.token,
				password: resolved.password
			} : {},
			warning
		};
		return { auth: {
			token: resolved.token,
			password: resolved.password
		} };
	}
	return { auth: await resolveGatewayCredentialsWithSecretInputs({
		config: policy.config,
		env: policy.env,
		explicitAuth: policy.explicitAuth,
		urlOverride: policy.urlOverride,
		urlOverrideSource: policy.urlOverrideSource,
		modeOverride: policy.modeOverride,
		localPrecedence: policy.localPrecedence,
		remoteTokenFallback: policy.remoteTokenFallback
	}) };
}
/** Resolves probe auth with async SecretRef support. */
async function resolveGatewayProbeAuthWithSecretInputs(params) {
	return (await resolveGatewayProbeAuthResolutionWithSecretInputs(params)).auth;
}
/** Resolves probe auth without throwing for unavailable SecretRefs, returning a warning. */
async function resolveGatewayProbeAuthSafeWithSecretInputs(params) {
	const explicitAuth = resolveExplicitProbeAuth(params.explicitAuth);
	if (hasExplicitProbeAuth(explicitAuth)) return { auth: explicitAuth };
	try {
		return await resolveGatewayProbeAuthResolutionWithSecretInputs(params);
	} catch (error) {
		return {
			auth: {},
			warning: resolveGatewayProbeWarning(error)
		};
	}
}
/** Synchronous safe probe auth wrapper for config-only credential paths. */
function resolveGatewayProbeAuthSafe(params) {
	const explicitAuth = resolveExplicitProbeAuth(params.explicitAuth);
	if (hasExplicitProbeAuth(explicitAuth)) return { auth: explicitAuth };
	try {
		return { auth: resolveGatewayProbeAuth(params) };
	} catch (error) {
		return {
			auth: {},
			warning: resolveGatewayProbeWarning(error)
		};
	}
}
//#endregion
export { resolveGatewayProbeCredentialConfig as a, resolveGatewayProbeAuthWithSecretInputs as i, resolveGatewayProbeAuthSafe as n, resolveGatewayProbeAuthSafeWithSecretInputs as r, resolveGatewayProbeAuth as t };
