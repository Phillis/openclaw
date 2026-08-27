import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { a as isWssUrl } from "./url-protocol-OU3K-ySz.js";
import { r as trimToUndefined } from "./credential-planner-DbFT4bf0.js";
import { r as resolveExplicitGatewayAuth } from "./credentials-CBejaoWm.js";
import { t as loadGatewayTlsRuntime } from "./gateway-BGXKG1MZ.js";
import { t as gatewayOriginScope } from "./gateway-origin-scope-D4zHFrov.js";
import { t as resolveGatewayPublicOrigin } from "./gateway-public-origin-BcHLka2A.js";
import { n as resolveGatewayProbeSurfaceAuth, t as resolveGatewayInteractiveSurfaceAuth } from "./auth-surface-resolution-DnhrIAeA.js";
import { t as buildGatewayConnectionDetailsWithResolvers } from "./connection-details-BsRSnf71.js";
import { r as normalizeControlUiBasePath } from "./control-ui-shared-BqBD1Err.js";
import { n as resolveGatewayCredentialsWithSecretInputs } from "./credentials-secret-inputs-D4pZ-FxC.js";
//#region src/gateway/tls-fingerprint.ts
/** Resolve the certificate pin for one already-selected Gateway target. */
async function resolveGatewayConnectionTlsFingerprint(params) {
	const explicitTlsFingerprint = normalizeOptionalString(params.explicitTlsFingerprint);
	if (explicitTlsFingerprint) return explicitTlsFingerprint;
	const remoteTlsFingerprint = params.config.gateway?.mode === "remote" && (params.urlSource === "config gateway.remote.url" || params.urlSource === "env OPENCLAW_GATEWAY_URL") ? normalizeOptionalString(params.config.gateway.remote?.tlsFingerprint) : void 0;
	if (remoteTlsFingerprint) return remoteTlsFingerprint;
	if (!isWssUrl(params.url)) return;
	if (!(params.urlSource === "local loopback" || params.urlSource === "missing gateway.remote.url (fallback local)") || params.config.gateway?.tls?.enabled !== true) return;
	const tlsRuntime = await params.loadGatewayTlsRuntime(params.config.gateway.tls);
	return tlsRuntime.enabled ? tlsRuntime.fingerprintSha256 : void 0;
}
//#endregion
//#region src/gateway/client-bootstrap.ts
/**
* Maps connection-detail source labels to the override kinds that affect auth fallback.
*/
function resolveGatewayUrlOverrideSource(urlSource) {
	if (urlSource === "cli --url") return "cli";
	if (urlSource === "env OPENCLAW_GATEWAY_URL") return "env";
}
var GatewayExplicitAuthRequiredError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "GatewayExplicitAuthRequiredError";
	}
};
function ensureExplicitGatewayAuth(params) {
	if (!params.urlOverride || !params.urlOverrideSource) return;
	if (params.explicitAuth?.token || params.explicitAuth?.password) return;
	if (params.urlOverrideSource === "env" && (params.resolvedAuth?.token || params.resolvedAuth?.password)) return;
	if (params.deviceAuthScope && params.allowStoredOriginAuth?.(params.deviceAuthScope) === true) return;
	const sourceHint = params.urlOverrideSource === "env" ? "Set OPENCLAW_GATEWAY_TOKEN or OPENCLAW_GATEWAY_PASSWORD alongside OPENCLAW_GATEWAY_URL; config credentials are intentionally not reused." : "For the default local or SSH-tunneled Gateway, remove --url to use the configured target.";
	throw new GatewayExplicitAuthRequiredError([
		"gateway url override requires explicit credentials",
		params.errorHint,
		sourceHint,
		params.configPath ? `Config: ${params.configPath}` : void 0
	].filter(Boolean).join("\n"));
}
function appendControlUiBasePath(url, basePath) {
	return `${url}${normalizeControlUiBasePath(basePath)}`;
}
function resolveExactConfiguredGatewayTarget(params) {
	const candidates = [];
	if (params.config.gateway?.mode === "remote") {
		const remoteUrl = trimToUndefined(params.config.gateway.remote?.url);
		if (remoteUrl) candidates.push({
			target: remoteUrl,
			identity: {
				authSurface: "remote",
				tlsSource: "config gateway.remote.url"
			}
		});
	} else {
		const localGateway = {
			...params.config.gateway,
			mode: "local"
		};
		delete localGateway.remote;
		const localUrl = params.buildConnectionDetails({
			config: {
				...params.config,
				gateway: localGateway
			},
			ignoreEnvUrlOverride: true,
			...params.localPortOverride !== void 0 ? { localPortOverride: params.localPortOverride } : {}
		}).url;
		const basePath = params.config.gateway?.controlUi?.basePath ?? "";
		candidates.push({
			target: appendControlUiBasePath(localUrl, basePath),
			identity: {
				authSurface: "local",
				tlsSource: "local loopback"
			}
		});
		const publicOrigin = resolveGatewayPublicOrigin(params.config);
		if (publicOrigin) candidates.push({
			target: appendControlUiBasePath(publicOrigin.replace(/^https:/u, "wss:").replace(/^http:/u, "ws:"), basePath),
			identity: { authSurface: "local" }
		});
	}
	return candidates.find(({ target }) => target === params.explicitUrl)?.identity;
}
/** Resolve the only URL overrides allowed to displace configured Gateway targets. */
function resolveGatewayUrlOverride(params) {
	const cliUrl = trimToUndefined(params.gatewayUrl);
	if (cliUrl) return {
		url: cliUrl,
		source: "cli"
	};
	if (params.ignoreEnvUrlOverride || params.localPortOverride !== void 0) return {};
	const envUrl = trimToUndefined((params.env ?? process.env).OPENCLAW_GATEWAY_URL);
	return envUrl ? {
		url: envUrl,
		source: "env"
	} : {};
}
/**
* Resolves the URL, auth material, and handshake tuning needed to start a GatewayClient.
*/
async function resolveGatewayClientBootstrap(params) {
	const env = params.env ?? process.env;
	const explicitAuth = resolveExplicitGatewayAuth(params.explicitAuth);
	const urlOverride = resolveGatewayUrlOverride({
		gatewayUrl: params.gatewayUrl,
		env,
		ignoreEnvUrlOverride: params.ignoreEnvUrlOverride,
		localPortOverride: params.localPortOverride
	});
	const buildConnectionDetails = params.buildConnectionDetails ?? buildGatewayConnectionDetailsWithResolvers;
	const connection = buildConnectionDetails({
		config: params.config,
		url: urlOverride.url,
		...params.configPath ? { configPath: params.configPath } : {},
		...urlOverride.source ? { urlSource: urlOverride.source } : {},
		ignoreEnvUrlOverride: true,
		...params.localPortOverride !== void 0 ? { localPortOverride: params.localPortOverride } : {}
	});
	const detectedUrlOverrideSource = resolveGatewayUrlOverrideSource(connection.urlSource);
	const urlOverrideSource = urlOverride.source ?? detectedUrlOverrideSource;
	const configuredTarget = params.allowConfiguredAuthForExactTarget && urlOverrideSource === "cli" ? resolveExactConfiguredGatewayTarget({
		buildConnectionDetails,
		config: params.config,
		explicitUrl: connection.url,
		...params.localPortOverride !== void 0 ? { localPortOverride: params.localPortOverride } : {}
	}) : void 0;
	const tlsUrlSource = configuredTarget?.tlsSource ?? connection.urlSource;
	const tlsFingerprint = params.resolveTlsFingerprint ? await params.resolveTlsFingerprint({
		config: params.config,
		url: connection.url,
		urlSource: tlsUrlSource,
		explicitTlsFingerprint: params.explicitTlsFingerprint
	}) : await resolveGatewayConnectionTlsFingerprint({
		config: params.config,
		url: connection.url,
		urlSource: tlsUrlSource,
		explicitTlsFingerprint: params.explicitTlsFingerprint,
		loadGatewayTlsRuntime
	});
	const surface = configuredTarget?.authSurface ?? params.modeOverride ?? (params.config.gateway?.mode === "remote" ? "remote" : "local");
	let auth;
	if (params.skipImplicitAuth) auth = explicitAuth;
	else if (urlOverrideSource && !configuredTarget) auth = params.suppressEnvAuthFallback ? explicitAuth : await resolveGatewayCredentialsWithSecretInputs({
		config: params.config,
		explicitAuth,
		env,
		urlOverride: connection.url,
		urlOverrideSource,
		modeOverride: params.modeOverride
	});
	else if (params.authPolicy === "probe") auth = await resolveGatewayProbeSurfaceAuth({
		config: params.config,
		env,
		surface
	});
	else if (params.authPolicy === "interactive") auth = await resolveGatewayInteractiveSurfaceAuth({
		config: params.config,
		env,
		explicitAuth,
		suppressEnvAuthFallback: params.suppressEnvAuthFallback,
		surface
	});
	else auth = await resolveGatewayCredentialsWithSecretInputs({
		config: params.config,
		explicitAuth,
		env,
		urlOverride: urlOverrideSource ? connection.url : void 0,
		urlOverrideSource,
		modeOverride: params.modeOverride
	});
	const deviceAuthScope = urlOverrideSource || params.config.gateway?.mode === "remote" ? gatewayOriginScope(connection.url) : void 0;
	if (params.overrideAuthErrorHint && !configuredTarget) ensureExplicitGatewayAuth({
		urlOverride: urlOverrideSource ? connection.url : void 0,
		urlOverrideSource,
		explicitAuth,
		resolvedAuth: auth,
		deviceAuthScope,
		allowStoredOriginAuth: params.allowStoredOriginAuth,
		errorHint: params.overrideAuthErrorHint ?? "Fix: pass --token or --password with --url.",
		configPath: params.configPath
	});
	return {
		url: connection.url,
		urlSource: connection.urlSource,
		connectionDetails: connection,
		...urlOverrideSource ? { urlOverrideSource } : {},
		...deviceAuthScope ? { deviceAuthScope } : {},
		...auth.failureReason ? { authFailureReason: auth.failureReason } : {},
		...tlsFingerprint ? { tlsFingerprint } : {},
		auth: {
			token: auth.token,
			password: auth.password
		}
	};
}
//#endregion
export { resolveGatewayConnectionTlsFingerprint as a, resolveGatewayUrlOverride as i, ensureExplicitGatewayAuth as n, resolveGatewayClientBootstrap as r, GatewayExplicitAuthRequiredError as t };
