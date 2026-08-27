import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { a as listAgentIds } from "./agent-scope-config-CUBiGmG3.js";
import { c as resolveEffectiveEnableState, s as normalizePluginsConfig } from "./config-state-Bgpvw0Q6.js";
import "./openai-routing-mOc2UICM.js";
import { w as resolveDefaultModelForAgent } from "./codex-route-model-ref-Du1KAbLA.js";
import { d as getActivePluginRegistry } from "./runtime-DMlUh4Cg.js";
import { o as resolveEffectiveAgentRuntime } from "./thinking-runtime-1slENmfx.js";
import "./model-selection-DHDS-v4K.js";
import { n as hasConfiguredGatewayAuthSecretInput } from "./auth-config-utils-DVajsKBW.js";
//#region src/commands/doctor-node-hosting-preconditions.ts
const CHECK_ID = "core/doctor/node-hosting-preconditions";
const LOOPBACK_JOIN_CODE_MESSAGE = "Gateway is only bound to loopback. Set gateway.bind=lan, enable tailscale serve, or configure plugins.entries.device-pair.config.publicUrl.";
function usesIdentityHeadersWithoutMachineCredentials(cfg) {
	const hasToken = hasConfiguredGatewayAuthSecretInput(cfg, "gateway.auth.token");
	const hasPassword = hasConfiguredGatewayAuthSecretInput(cfg, "gateway.auth.password");
	if (hasToken || hasPassword) return false;
	if (cfg.gateway?.auth?.mode === "trusted-proxy") return true;
	return cfg.gateway?.tailscale?.mode === "serve" && cfg.gateway?.auth?.mode !== "password" && cfg.gateway?.auth?.mode !== "none" && cfg.gateway?.auth?.allowTailscale !== false;
}
function lacksNodeOnboardingUrl(cfg) {
	const bind = cfg.gateway?.bind ?? "loopback";
	if (bind !== "loopback" && bind !== "auto") return false;
	const publicUrl = cfg.plugins?.entries?.["device-pair"]?.config?.["publicUrl"];
	const remoteUrl = cfg.gateway?.remote?.url;
	const tailscaleMode = cfg.gateway?.tailscale?.mode ?? "off";
	return !normalizeOptionalString(publicUrl) && !normalizeOptionalString(remoteUrl) && tailscaleMode !== "serve" && tailscaleMode !== "funnel";
}
function lacksNodeOnboardingPlugin(cfg) {
	return !resolveEffectiveEnableState({
		id: "device-pair",
		origin: "bundled",
		config: normalizePluginsConfig(cfg.plugins),
		rootConfig: cfg,
		enabledByDefault: true
	}).enabled;
}
function lacksDeviceCapableRuntimeRoute(cfg) {
	const registry = getActivePluginRegistry();
	return listAgentIds(cfg).every((agentId) => {
		const model = resolveDefaultModelForAgent({
			cfg,
			agentId
		});
		const runtime = resolveEffectiveAgentRuntime({
			cfg,
			provider: model.provider,
			modelId: model.model,
			agentId
		});
		if (runtime === "openclaw") return false;
		const harness = registry?.agentHarnesses.find((entry) => entry.harness.id === runtime)?.harness;
		return harness !== void 0 && harness.cloudPlacement?.devicePlacement === void 0;
	});
}
/** Collects config-only warnings for node authentication, onboarding, and worker ingress. */
function collectNodeHostingPreconditionFindings(cfg) {
	const findings = [];
	if (lacksNodeOnboardingPlugin(cfg)) findings.push({
		checkId: CHECK_ID,
		severity: "warning",
		message: "The device-pair plugin is not enabled; node onboarding join codes and openclaw connect are unavailable.",
		path: "plugins.entries.device-pair.enabled",
		requirement: "node-onboarding-plugin",
		fixHint: "Set plugins.entries.device-pair.enabled: true, ensure device-pair is not denied or excluded by plugins.allow, then restart the Gateway."
	});
	if (lacksDeviceCapableRuntimeRoute(cfg)) findings.push({
		checkId: CHECK_ID,
		severity: "warning",
		message: "No configured agent/model route resolves to a runtime that supports paired-device placement.",
		path: "agents",
		requirement: "device-session-runtime",
		fixHint: "Select an agent/model route whose runtime supports paired-device placement, then ensure its plugin is enabled and its required node commands are explicitly allowed. Runtime policy is model/provider-scoped; whole-agent runtime keys are ignored. For a multi-agent roster, set agents.ownership: \"explicit\"."
	});
	if (usesIdentityHeadersWithoutMachineCredentials(cfg)) findings.push({
		checkId: CHECK_ID,
		severity: "warning",
		message: "Gateway identity-header auth has no configured token/password path for machine clients; new node hosts cannot authenticate or become worker hosts.",
		path: "gateway.auth",
		requirement: "machine-client-auth",
		fixHint: "Switch gateway.auth.mode to token and configure gateway.auth.token as a SecretRef so machine clients can authenticate as devices. Keep trusted-proxy only if machine clients use a clean loopback/direct gateway.auth.password path. For Access-fronted gateways, configure the node gateway.cloudflareAccess.clientId / clientSecret SecretInputs or set CF_ACCESS_CLIENT_ID / CF_ACCESS_CLIENT_SECRET before openclaw connect."
	});
	if (lacksNodeOnboardingUrl(cfg)) findings.push({
		checkId: CHECK_ID,
		severity: "warning",
		message: LOOPBACK_JOIN_CODE_MESSAGE,
		path: "gateway.bind",
		requirement: "node-onboarding-url",
		fixHint: "If an edge proxy fronts node onboarding, allow /j/* and /__openclaw__/worker without edge identity auth, and preserve WebSocket upgrade on /__openclaw__/worker. Both routes enforce their own credentials."
	});
	return findings;
}
//#endregion
export { collectNodeHostingPreconditionFindings };
