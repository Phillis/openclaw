import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-yubNQC1L.js";
import { g as isImplicitLocalGatewayTarget, s as callGateway } from "./call-CZ1eu88h.js";
import { r as withProgress } from "./progress-F0nzmXYd.js";
import { n as parseTimeoutMsWithFallback } from "./parse-timeout-CJ2ASpTh.js";
//#region src/cli/gateway-rpc.runtime.ts
const DEFAULT_GATEWAY_RPC_TIMEOUT_MS = 3e4;
async function isImplicitLocalGatewayTargetFromCliRuntime(opts) {
	return await isImplicitLocalGatewayTarget({
		config: opts.config,
		url: opts.url,
		localPortOverride: opts.localPortOverride
	});
}
async function callGatewayFromCliRuntime(method, opts, params, extra) {
	const showProgress = extra?.progress ?? opts.json !== true;
	const timeoutMs = extra?.timeoutMs !== void 0 ? extra.timeoutMs : opts.timeout === null ? null : parseTimeoutMsWithFallback(opts.timeout, extra?.defaultTimeoutMs ?? DEFAULT_GATEWAY_RPC_TIMEOUT_MS, { invalidType: "error" });
	return await withProgress({
		label: extra?.label ?? `Gateway ${method}`,
		indeterminate: true,
		enabled: showProgress
	}, async () => await callGateway({
		config: opts.config,
		url: opts.url,
		token: opts.token,
		password: opts.password,
		method,
		params,
		deviceIdentity: extra?.deviceIdentity,
		expectFinal: extra?.expectFinal ?? Boolean(opts.expectFinal),
		scopes: extra?.scopes,
		useStoredDeviceAuth: extra?.useStoredDeviceAuth,
		requiredStoredDeviceAuthScopes: extra?.requiredStoredDeviceAuthScopes,
		requireLocalBackendSharedAuth: extra?.requireLocalBackendSharedAuth,
		signal: extra?.signal,
		timeoutMs,
		localPortOverride: opts.localPortOverride,
		clientName: extra?.clientName ?? GATEWAY_CLIENT_NAMES.CLI,
		mode: extra?.mode ?? GATEWAY_CLIENT_MODES.CLI
	}));
}
//#endregion
export { callGatewayFromCliRuntime, isImplicitLocalGatewayTargetFromCliRuntime };
