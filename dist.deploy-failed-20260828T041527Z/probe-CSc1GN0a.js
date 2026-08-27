import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-BN1NZvXG.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { o as classifyGatewayConnectFailure, t as ConnectErrorDetailCodes, u as readConnectErrorDetailCode } from "./connect-error-details-Dxf1zdDX.js";
import { r as withProgress } from "./progress-3-oJv0bD.js";
//#region src/cli/daemon-cli/probe.ts
const probeGatewayModuleLoader = createLazyImportLoader(() => import("./probe-DJ_wGe7l.js"));
const CONNECT_ERROR_DETAIL_CODE_VALUES = new Set(Object.values(ConnectErrorDetailCodes));
async function loadProbeGatewayModule() {
	return await probeGatewayModuleLoader.load();
}
function resolveProbeFailureMessage(result) {
	const closeHint = result.close ? `gateway closed (${result.close.code}): ${result.close.reason}` : null;
	if (closeHint && (!result.error || result.error === "timeout")) return closeHint;
	return result.error ?? closeHint ?? "gateway probe failed";
}
function projectGatewayConnectFailure(params) {
	const failure = classifyGatewayConnectFailure(params);
	const detailCode = readConnectErrorDetailCode(params.details);
	return {
		kind: failure.kind,
		...detailCode && CONNECT_ERROR_DETAIL_CODE_VALUES.has(detailCode) ? { detailCode } : {}
	};
}
/** Probe Gateway connectivity or read-capability status with optional RPC verification. */
async function probeGatewayStatus(opts) {
	const kind = opts.requireRpc ? "read" : "connect";
	try {
		const result = await withProgress({
			label: "Checking gateway status...",
			indeterminate: true,
			enabled: opts.json !== true
		}, async () => {
			if (opts.requireRpc) {
				const allowRpcConfigCredentials = opts.allowRpcConfigCredentials !== false;
				if (!allowRpcConfigCredentials && !opts.token && !opts.password) throw new Error("gateway status RPC skipped because configured gateway credentials are disabled for this status request");
				const { resolveProbeAuthSummary } = await loadProbeGatewayModule();
				const { callGateway } = await import("./call-DPYKD0iw.js");
				let auth;
				let server;
				await callGateway({
					url: opts.url,
					localPortOverride: opts.localPortOverride,
					token: opts.token,
					password: opts.password,
					tlsFingerprint: opts.tlsFingerprint,
					preauthHandshakeTimeoutMs: opts.preauthHandshakeTimeoutMs,
					...allowRpcConfigCredentials && opts.config ? { config: opts.config } : {},
					method: "status",
					timeoutMs: opts.timeoutMs,
					sharedStateMode: "read-only",
					...opts.configPath ? { configPath: opts.configPath } : {},
					onHelloOk: (hello) => {
						auth = resolveProbeAuthSummary({
							role: hello.auth.role,
							scopes: hello.auth.scopes,
							authMetadataPresent: true
						});
						server = hello.server;
					}
				});
				return {
					ok: true,
					auth,
					server
				};
			}
			const { probeGateway } = await loadProbeGatewayModule();
			return await probeGateway({
				url: opts.url,
				...opts.config ? { config: opts.config } : {},
				auth: {
					token: opts.token,
					password: opts.password
				},
				tlsFingerprint: opts.tlsFingerprint,
				...opts.preauthHandshakeTimeoutMs !== void 0 ? { preauthHandshakeTimeoutMs: opts.preauthHandshakeTimeoutMs } : {},
				timeoutMs: opts.timeoutMs,
				includeDetails: false
			});
		});
		const auth = result.auth;
		const server = result.server;
		const serverSummary = server ? { server } : {};
		const version = server?.version ?? null;
		if (result.ok) return {
			ok: true,
			kind,
			capability: kind === "read" ? auth?.capability && auth.capability !== "unknown" ? auth.capability : "read_only" : auth?.capability,
			auth,
			...serverSummary,
			...version != null ? { version } : {}
		};
		const error = redactSensitiveUrlLikeString(resolveProbeFailureMessage(result));
		return {
			ok: false,
			kind,
			capability: auth?.capability,
			auth,
			...serverSummary,
			...version != null ? { version } : {},
			connectFailure: projectGatewayConnectFailure({
				details: result.connectErrorDetails,
				message: error,
				reason: result.close?.reason
			}),
			error
		};
	} catch (err) {
		const error = redactSensitiveUrlLikeString(formatErrorMessage(err));
		return {
			ok: false,
			kind,
			connectFailure: projectGatewayConnectFailure({ message: error }),
			error
		};
	}
}
//#endregion
export { probeGatewayStatus as t };
