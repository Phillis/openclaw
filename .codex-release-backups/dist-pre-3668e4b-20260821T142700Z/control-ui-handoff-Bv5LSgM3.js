import "./utils-D9gvQMP6.js";
import { t as sleep } from "./sleep-Bd74jGcV.js";
import { _ as resolveGatewayPort } from "./paths-CqeDjSA4.js";
import { v as resolveSecretInputRef } from "./types.secrets-BrIfhxSG.js";
import { n as sanitizeTerminalText } from "./safe-text-CpAuEO38.js";
import { u as readResponseTextSnippet } from "./http-body-B0Ouh_va.js";
import { n as fetchConfiguredLocalOriginWithSsrFGuard } from "./fetch-guard-IFayOKvf.js";
import "./config-CfeGo4K4.js";
import { t as resolveGatewayAuthToken } from "./auth-token-resolution-zfntTpM2.js";
import { n as resolveGatewayAuth } from "./auth-resolve-CAPRAoQk.js";
import "./auth-BjIfKFX2.js";
import { o as isSameProcessSpecificIpv4WithLoopbackListeners } from "./ports-format-BfMa8zv8.js";
import { n as inspectPortUsage } from "./ports-inspect-2ToD8koD.js";
import { t as normalizeFingerprint } from "./fingerprint-CFbD9c_Z.js";
import { t as loadGatewayTlsRuntime } from "./gateway-Dfu47MTs.js";
import { n as resolveControlUiLinks } from "./control-ui-links--NOqSGLU.js";
import "./onboard-helpers-CPYqMvEB.js";
import "./control-ui-assets-C_hWeKEY.js";
import { O as CONTROL_UI_OWNER_BOOTSTRAP_PROFILE, o as issueDeviceBootstrapToken } from "./device-bootstrap-B0GG6gmu.js";
import { a as CONTROL_UI_OWNER_BOOTSTRAP_PROFILE_HINT, r as CONTROL_UI_BOOTSTRAP_PROFILE_FRAGMENT_PARAM } from "./control-ui-contract-eurzifU_.js";
//#region src/commands/control-ui-handoff.ts
const CONTROL_UI_DOCUMENT_REQUEST_TIMEOUT_MS = 2e3;
const CONTROL_UI_DOCUMENT_ERROR_MAX_BYTES = 2048;
/** One canonical target keeps advertised identity, local browser delivery, and document probes distinct. */
async function resolveControlUiHandoffTarget(params) {
	const { config, env } = params;
	const port = resolveGatewayPort(config, env);
	const bind = config.gateway?.bind ?? "loopback";
	const basePath = config.gateway?.controlUi?.basePath;
	const customBindHost = config.gateway?.customBindHost;
	const tlsConfig = config.gateway?.tls;
	const tlsEnabled = tlsConfig?.enabled === true;
	const resolvedToken = await resolveGatewayAuthToken({
		cfg: config,
		env,
		envFallback: "always"
	});
	const resolvedAuth = resolveGatewayAuth({
		authConfig: config.gateway?.auth,
		env,
		tailscaleMode: config.gateway?.tailscale?.mode
	});
	const passwordSecretRefConfigured = Boolean(resolveSecretInputRef({
		value: config.gateway?.auth?.password,
		defaults: config.secrets?.defaults
	}).ref);
	const gatewayAuthHandoff = resolvedAuth.mode === "password" && !passwordSecretRefConfigured ? resolvedAuth.password : void 0;
	const customBindIsWildcard = bind === "custom" && customBindHost?.trim() === "0.0.0.0";
	const browserBind = bind === "lan" || customBindIsWildcard || !tlsEnabled && (bind === "tailnet" || bind === "custom") ? "loopback" : bind;
	const configuredLinks = resolveControlUiLinks({
		port,
		bind,
		customBindHost,
		basePath,
		tlsEnabled
	});
	const links = browserBind === bind ? configuredLinks : resolveControlUiLinks({
		port,
		bind: browserBind,
		customBindHost,
		basePath,
		tlsEnabled
	});
	const configuredHost = new URL(configuredLinks.wsUrl).hostname;
	const loopbackAliasHost = browserBind === "loopback" && (bind === "tailnet" || bind === "custom") && configuredHost !== "127.0.0.1" && configuredHost !== "0.0.0.0" ? configuredHost : void 0;
	const documentUrl = new URL(links.httpUrl);
	documentUrl.hostname = "127.0.0.1";
	documentUrl.username = "";
	documentUrl.password = "";
	documentUrl.search = "";
	documentUrl.hash = "";
	const token = resolvedToken.token ?? "";
	const includeTokenInUrl = Boolean(token) && !resolvedToken.secretRefConfigured;
	const dashboardUrl = includeTokenInUrl ? `${links.httpUrl}#token=${encodeURIComponent(token)}` : links.httpUrl;
	return {
		port,
		basePath,
		bind,
		links,
		authMode: resolvedAuth.mode,
		gatewayAuthHandoff,
		includeTokenInUrl,
		dashboardUrl,
		documentUrl: documentUrl.toString(),
		probeUrl: loopbackAliasHost ? configuredLinks.wsUrl : links.wsUrl,
		loopbackAliasHost,
		tlsConfig
	};
}
/** Keep shared browser credentials on the same process proven by the configured Gateway endpoint. */
async function hasVerifiedControlUiLoopbackAlias(target) {
	if (!target.loopbackAliasHost) return true;
	const portUsage = await inspectPortUsage(target.port).catch(() => void 0);
	return Boolean(portUsage && isSameProcessSpecificIpv4WithLoopbackListeners(portUsage.listeners, target.port, target.loopbackAliasHost));
}
/** Mint the Control-UI-scoped one-time device grant immediately before actual delivery. */
async function issueControlUiBrowserHandoff(httpUrl) {
	const issued = await issueDeviceBootstrapToken({ profile: CONTROL_UI_OWNER_BOOTSTRAP_PROFILE });
	return {
		browserUrl: `${httpUrl}#${new URLSearchParams({
			bootstrapToken: issued.token,
			[CONTROL_UI_BOOTSTRAP_PROFILE_FRAGMENT_PARAM]: CONTROL_UI_OWNER_BOOTSTRAP_PROFILE_HINT
		}).toString()}`,
		expiresAtMs: issued.expiresAtMs
	};
}
/** Wait only for an explicitly preparing dashboard; fail immediately for terminal HTTP states. */
async function waitForControlUiDocument(params) {
	const now = params.deps?.now ?? Date.now;
	const sleepFor = params.deps?.sleep ?? sleep;
	const deadline = now() + (params.timeoutMs ?? 6e5);
	let tlsFingerprint;
	let tlsConnect;
	if (params.tlsConfig?.enabled === true) try {
		const tls = await (params.deps?.loadTls ?? loadGatewayTlsRuntime)({
			...params.tlsConfig,
			autoGenerate: false
		});
		tlsFingerprint = normalizeFingerprint(tls.fingerprintSha256 ?? "");
		const serverCertificate = tls.tlsOptions?.cert;
		if (!tls.enabled || !tlsFingerprint || !serverCertificate) return {
			ready: false,
			reason: tls.error || "Gateway TLS certificate fingerprint is unavailable."
		};
		const expectedFingerprint = tlsFingerprint;
		const configuredCa = tls.tlsOptions?.ca;
		tlsConnect = {
			ca: configuredCa ? [serverCertificate, configuredCa].flat() : serverCertificate,
			checkServerIdentity: (_hostname, certificate) => normalizeFingerprint(certificate.fingerprint256 ?? "") === expectedFingerprint ? void 0 : /* @__PURE__ */ new Error("Gateway TLS certificate fingerprint mismatch.")
		};
	} catch (error) {
		return {
			ready: false,
			reason: error instanceof Error ? error.message : "Gateway TLS certificate is unavailable."
		};
	}
	let pendingReported = false;
	const origin = new URL(params.url).origin;
	const requestDocument = async (method, remainingMs) => await (params.deps?.fetch ?? fetchConfiguredLocalOriginWithSsrFGuard)({
		url: params.url,
		configuredLocalOriginBaseUrl: origin,
		policy: { allowedOrigins: [origin] },
		maxRedirects: 0,
		timeoutMs: Math.min(CONTROL_UI_DOCUMENT_REQUEST_TIMEOUT_MS, remainingMs),
		capture: false,
		auditContext: "gateway-control-ui-readiness",
		...tlsConnect ? { dispatcherPolicy: {
			mode: "direct",
			connect: tlsConnect
		} } : {},
		init: {
			method,
			headers: {
				Accept: "text/html",
				"Accept-Encoding": "identity"
			}
		}
	});
	while (true) {
		const remainingMs = deadline - now();
		if (remainingMs <= 0) return {
			ready: false,
			reason: "Control UI assets did not finish preparing in time."
		};
		try {
			const request = await requestDocument("HEAD", remainingMs);
			let pendingDelayMs;
			try {
				const mediaType = request.response.headers.get("content-type")?.split(";", 1)[0]?.trim();
				if (request.response.status === 200 && mediaType?.toLowerCase() === "text/html") return {
					ready: true,
					...tlsFingerprint ? { tlsFingerprint } : {}
				};
				const retryAfter = request.response.headers.get("retry-after");
				if (request.response.status !== 503 || !retryAfter || params.waitForPending === false) {
					let detail;
					if (request.response.status === 503 && !retryAfter) {
						const diagnostic = await requestDocument("GET", Math.max(1, deadline - now())).catch(() => void 0);
						if (diagnostic) try {
							const diagnosticType = diagnostic.response.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase();
							if (diagnostic.response.status === 503 && diagnosticType === "text/plain") {
								const snippet = await readResponseTextSnippet(diagnostic.response, {
									maxBytes: CONTROL_UI_DOCUMENT_ERROR_MAX_BYTES,
									maxChars: CONTROL_UI_DOCUMENT_ERROR_MAX_BYTES,
									timeoutMs: CONTROL_UI_DOCUMENT_REQUEST_TIMEOUT_MS
								});
								detail = snippet ? sanitizeTerminalText(snippet) : void 0;
							}
						} finally {
							await diagnostic.release();
						}
					}
					return {
						ready: false,
						reason: request.response.status === 503 && retryAfter ? "Control UI assets are still preparing." : detail || `Control UI dashboard is unavailable (HTTP ${request.response.status}).`,
						status: request.response.status
					};
				}
				const retryAfterSeconds = Number(retryAfter);
				pendingDelayMs = Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0 ? retryAfterSeconds * 1e3 : 1e3;
			} finally {
				await request.release();
			}
			if (!pendingReported) {
				pendingReported = true;
				params.onPending?.();
			}
			await sleepFor(Math.min(pendingDelayMs, Math.max(0, deadline - now())));
		} catch (error) {
			return {
				ready: false,
				reason: `Control UI dashboard is unavailable: ${error instanceof Error ? error.message : String(error)}`
			};
		}
	}
}
//#endregion
export { waitForControlUiDocument as i, issueControlUiBrowserHandoff as n, resolveControlUiHandoffTarget as r, hasVerifiedControlUiLoopbackAlias as t };
