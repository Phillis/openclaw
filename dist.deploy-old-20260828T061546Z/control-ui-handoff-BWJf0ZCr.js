import "./utils-Bw16L5tB.js";
import { t as sleep } from "./sleep-D7nua6TP.js";
import { _ as resolveGatewayPort } from "./paths-BBSTUjD5.js";
import { n as sanitizeTerminalText } from "./safe-text-DbwznzfG.js";
import { d as readResponseTextSnippet } from "./http-body-DthsuKdw.js";
import { r as fetchConfiguredLocalOriginWithSsrFGuard } from "./fetch-guard-Dt4YqBT2.js";
import { l as CONTROL_UI_OWNER_BOOTSTRAP_PROFILE_HINT, s as CONTROL_UI_BOOTSTRAP_PROFILE_FRAGMENT_PARAM } from "./zod-schema-D4cp1qYW.js";
import "./config-B_0xOnKq.js";
import { t as createGatewayCredentialPlan } from "./credential-planner-Cyn3ajET.js";
import { o as isSameProcessSpecificIpv4WithLoopbackListeners } from "./ports-format-FOKK5FaA.js";
import { n as inspectPortUsage } from "./ports-inspect-8eZVwL-B.js";
import { r as normalizeTlsFingerprint } from "./client-address-utils-ycG4vrin.js";
import { t as loadGatewayTlsRuntime } from "./gateway-JLU8_492.js";
import { t as resolveGatewayInteractiveSurfaceAuth } from "./auth-surface-resolution-DXXPBMhL.js";
import { n as resolveControlUiLinks } from "./control-ui-links-CTWv3QrL.js";
import "./control-ui-contract-CgrOMhfo.js";
import { j as CONTROL_UI_OWNER_BOOTSTRAP_PROFILE, s as issueDeviceBootstrapToken } from "./device-bootstrap-6c0qs5r-.js";
import "./onboard-helpers-DsV_5p6H.js";
import "./control-ui-assets-D92--EZN.js";
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
	const credentialPlan = createGatewayCredentialPlan({
		config,
		env
	});
	const resolvedAuth = await resolveGatewayInteractiveSurfaceAuth({
		config,
		env,
		surface: "local"
	});
	const authMode = config.gateway?.auth?.mode ?? (credentialPlan.localPassword.value || credentialPlan.envPassword ? "password" : "token");
	const gatewayAuthHandoff = authMode === "password" && !credentialPlan.localPassword.hasSecretRef ? resolvedAuth.password : void 0;
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
	const token = credentialPlan.localToken.value ?? credentialPlan.envToken ?? "";
	const includeTokenInUrl = Boolean(token) && !credentialPlan.localToken.hasSecretRef;
	return {
		port,
		basePath,
		bind,
		links,
		authMode,
		gatewayAuthHandoff,
		includeTokenInUrl,
		dashboardUrl: includeTokenInUrl ? `${links.httpUrl}#token=${encodeURIComponent(token)}` : links.httpUrl,
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
		tlsFingerprint = normalizeTlsFingerprint(tls.fingerprintSha256 ?? "");
		const serverCertificate = tls.tlsOptions?.cert;
		if (!tls.enabled || !tlsFingerprint || !serverCertificate) return {
			ready: false,
			reason: tls.error || "Gateway TLS certificate fingerprint is unavailable."
		};
		const expectedFingerprint = tlsFingerprint;
		const configuredCa = tls.tlsOptions?.ca;
		tlsConnect = {
			ca: configuredCa ? [serverCertificate, configuredCa].flat() : serverCertificate,
			checkServerIdentity: (_hostname, certificate) => normalizeTlsFingerprint(certificate.fingerprint256 ?? "") === expectedFingerprint ? void 0 : /* @__PURE__ */ new Error("Gateway TLS certificate fingerprint mismatch.")
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
