import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import { l as hasConfiguredSecretInput, v as resolveSecretInputRef } from "./types.secrets-BrIfhxSG.js";
import { p as hasConfiguredPlaintextSecretValue } from "./runtime-shared-D-v-cKxA.js";
import { n as discoverConfigSecretTargets } from "./target-registry-query-Cu36BxFQ.js";
import "./target-registry-UxdnmGQF.js";
import { h as resolveGatewayBindHost, o as isLoopbackHost } from "./net-BRYQcUG8.js";
import { n as resolveGatewayAuth } from "./auth-resolve-U982W6CT.js";
import "./auth-CCT61CRz.js";
import { s as resolveExecApprovalsDisplayPath } from "./exec-approvals-config-moZwurok.js";
import { K as loadExecApprovals } from "./exec-approvals-DkNiV-ux.js";
import { t as listReadOnlyChannelPluginsForConfig } from "./read-only-DGFVk-Cu.js";
import { t as note } from "./note-D7f3pYFE.js";
import { r as resolveExecPolicyScopeSnapshot } from "./exec-approvals-effective-RuMRHohq.js";
import { t as resolveGatewayAuthTokenSourceConflict } from "./auth-token-source-conflict-Bv2r7TNj.js";
import { t as collectExecFilesystemPolicyDriftHits } from "./exec-filesystem-policy-Av-Jh1tA.js";
import { t as isLikelySensitiveModelProviderHeaderName } from "./model-provider-header-policy-DaO5ykFx.js";
import { t as collectChannelSecurityFindingsCore } from "./audit-channel-D-7r62rj.js";
//#region src/commands/doctor-security.ts
/** Security warnings for gateway exposure, exec policy drift, channel DMs, and plaintext secrets. */
function collectImplicitHeartbeatDirectPolicyWarnings(cfg) {
	const warnings = [];
	const maybeWarn = (params) => {
		const heartbeat = params.heartbeat;
		if (!heartbeat || heartbeat.target === void 0 || heartbeat.target === "none") return;
		if (heartbeat.directPolicy !== void 0) return;
		warnings.push(`- ${params.label}: heartbeat delivery is configured while ${params.pathHint} is unset.`, "  Heartbeat now allows direct/DM targets by default. Set it explicitly to \"allow\" or \"block\" to pin upgrade behavior.");
	};
	maybeWarn({
		label: "Heartbeat defaults",
		heartbeat: cfg.agents?.defaults?.heartbeat,
		pathHint: "agents.defaults.heartbeat.directPolicy"
	});
	const agents = Array.isArray(cfg.agents?.list) ? cfg.agents.list : [];
	for (const agent of agents) maybeWarn({
		label: `Heartbeat agent "${agent.id}"`,
		heartbeat: agent.heartbeat,
		pathHint: `heartbeat.directPolicy for agent "${agent.id}"`
	});
	return warnings;
}
function execSecurityRank(value) {
	switch (value) {
		case "deny": return 0;
		case "allowlist": return 1;
		case "full": return 2;
	}
	throw new Error("Unsupported exec security value");
}
function execAskRank(value) {
	switch (value) {
		case "off": return 0;
		case "on-miss": return 1;
		case "always": return 2;
	}
	throw new Error("Unsupported exec ask value");
}
function collectExecPolicyConflictWarnings(cfg) {
	const warnings = [];
	const approvals = loadExecApprovals();
	const defaultRequestedSecuritySource = "OpenClaw default (full)";
	const defaultRequestedAskSource = "OpenClaw default (off)";
	const maybeWarn = (params) => {
		const scopeExecConfig = params.scopeExecConfig;
		const globalExecConfig = params.globalExecConfig;
		if (!scopeExecConfig?.mode && !scopeExecConfig?.security && !scopeExecConfig?.ask && !globalExecConfig?.mode && !globalExecConfig?.security && !globalExecConfig?.ask) return;
		const snapshot = resolveExecPolicyScopeSnapshot({
			approvals,
			scopeExecConfig,
			globalExecConfig,
			configPath: params.scopeLabel === "tools.exec" ? "tools.exec" : `agents.entries.${params.agentId}.tools.exec`,
			scopeLabel: params.scopeLabel,
			agentId: params.agentId
		});
		const securityConfigured = snapshot.security.requestedSource !== defaultRequestedSecuritySource;
		const askConfigured = snapshot.ask.requestedSource !== defaultRequestedAskSource;
		const securityConflict = securityConfigured && execSecurityRank(snapshot.security.requested) > execSecurityRank(snapshot.security.effective);
		const askConflict = askConfigured && execAskRank(snapshot.ask.requested) < execAskRank(snapshot.ask.effective);
		if (!securityConflict && !askConflict) return;
		const configParts = [];
		const hostParts = [];
		const canonicalModeSource = snapshot.security.requestedSource === snapshot.ask.requestedSource && snapshot.security.requestedSource.endsWith(".mode") ? snapshot.security.requestedSource : void 0;
		if (canonicalModeSource) configParts.push(`${canonicalModeSource}="${snapshot.mode.requested}"`);
		if (securityConflict) {
			if (!canonicalModeSource) configParts.push(`${snapshot.security.requestedSource}="${snapshot.security.requested}"`);
			hostParts.push(`${snapshot.security.hostSource}="${snapshot.security.host}"`);
		}
		if (askConflict) {
			if (!canonicalModeSource) configParts.push(`${snapshot.ask.requestedSource}="${snapshot.ask.requested}"`);
			hostParts.push(`${snapshot.ask.hostSource}="${snapshot.ask.host}"`);
		}
		warnings.push([
			`- ${params.scopeLabel} is broader than the host exec policy.`,
			`  Config: ${configParts.join(", ")}`,
			`  Host: ${hostParts.join(", ")}`,
			`  Effective host exec stays security="${snapshot.security.effective}" ask="${snapshot.ask.effective}" because the stricter side wins.`,
			"  Headless runs like isolated cron cannot answer approval prompts; align both files or enable Web UI, terminal UI, or chat exec approvals.",
			`  Inspect with: ${formatCliCommand("openclaw approvals get --gateway")}`
		].join("\n"));
	};
	maybeWarn({
		scopeLabel: "tools.exec",
		scopeExecConfig: cfg.tools?.exec
	});
	const agents = cfg.agents?.entries ?? {};
	for (const [agentId, agent] of Object.entries(agents)) maybeWarn({
		scopeLabel: `agents.entries.${agentId}.tools.exec`,
		scopeExecConfig: agent.tools?.exec,
		globalExecConfig: cfg.tools?.exec,
		agentId
	});
	return warnings;
}
function collectDurableExecApprovalWarnings(cfg) {
	return [];
}
function collectExecFilesystemPolicyWarnings(cfg) {
	return collectExecFilesystemPolicyDriftHits(cfg).map((hit) => [
		`- ${hit.scopeLabel}: filesystem write tools are disabled, but exec is still available.`,
		`  Runtime tools: ${hit.runtimeTools.join(", ")}; disabled filesystem tools: ${hit.disabledFilesystemTools.join(", ")}.`,
		`  Effective exec host is "${hit.execHost}" with sandbox.mode="${hit.sandboxMode}" and workspaceAccess="${hit.sandboxWorkspaceAccess}".`,
		"  The exec shell can still write wherever that host or sandbox filesystem permits.",
		"  For read-only agents, also deny exec/process; otherwise use sandbox mode \"all\" with workspaceAccess \"ro\" or \"none\"."
	].join("\n"));
}
function collectPlaintextConfigSecretWarnings(cfg) {
	const plaintextPaths = [];
	const defaults = cfg.secrets?.defaults;
	for (const target of discoverConfigSecretTargets(cfg)) {
		if (!target.entry.includeInAudit) continue;
		if (target.entry.id === "models.providers.*.headers.*" && !isLikelySensitiveModelProviderHeaderName(target.pathSegments.at(-1) ?? "")) continue;
		const { ref } = resolveSecretInputRef({
			value: target.value,
			refValue: target.refValue,
			defaults
		});
		if (ref) continue;
		if (!hasConfiguredPlaintextSecretValue(target.value, target.entry.expectedResolvedValue)) continue;
		plaintextPaths.push(target.path);
	}
	if (plaintextPaths.length === 0) return [];
	const samplePaths = plaintextPaths.slice(0, 5);
	const extraCount = plaintextPaths.length - samplePaths.length;
	return [
		"- WARNING: openclaw.json contains plaintext secret-bearing config fields.",
		`  Paths: ${extraCount > 0 ? `${samplePaths.join(", ")} (+${extraCount} more)` : samplePaths.join(", ")}`,
		"  Agents or workspace tools that can read config files may see these API keys/tokens.",
		`  Migrate them to SecretRefs with ${formatCliCommand("openclaw secrets configure")} or ${formatCliCommand("openclaw secrets apply")}, then verify with ${formatCliCommand("openclaw secrets audit --check")}.`
	];
}
/** Collects doctor security warnings without emitting terminal notes. */
async function collectSecurityWarnings(cfg, env = process.env) {
	const warnings = [];
	if (cfg.approvals?.exec?.enabled === false) warnings.push("- Note: approvals.exec.enabled=false disables approval forwarding only.", `  Host exec gating still comes from ${resolveExecApprovalsDisplayPath()}.`, `  Check local policy with: ${formatCliCommand("openclaw approvals get --gateway")}`);
	warnings.push(...collectImplicitHeartbeatDirectPolicyWarnings(cfg));
	warnings.push(...collectExecPolicyConflictWarnings(cfg));
	warnings.push(...collectExecFilesystemPolicyWarnings(cfg));
	warnings.push(...collectPlaintextConfigSecretWarnings(cfg));
	warnings.push(...collectDurableExecApprovalWarnings(cfg));
	const tailscaleMode = cfg.gateway?.tailscale?.mode ?? "off";
	const gatewayBind = cfg.gateway?.bind ?? "loopback";
	const customBindHost = cfg.gateway?.customBindHost?.trim();
	const bindMode = [
		"auto",
		"lan",
		"loopback",
		"custom",
		"tailnet"
	].includes(gatewayBind) ? gatewayBind : void 0;
	const resolvedBindHost = bindMode ? await resolveGatewayBindHost(bindMode, customBindHost) : "0.0.0.0";
	const isExposed = !isLoopbackHost(resolvedBindHost);
	const resolvedAuth = resolveGatewayAuth({
		authConfig: cfg.gateway?.auth,
		env,
		tailscaleMode
	});
	const authToken = normalizeOptionalString(resolvedAuth.token) ?? "";
	const authPassword = normalizeOptionalString(resolvedAuth.password) ?? "";
	const hasToken = authToken.length > 0 || hasConfiguredSecretInput(cfg.gateway?.auth?.token, cfg.secrets?.defaults);
	const hasPassword = authPassword.length > 0 || hasConfiguredSecretInput(cfg.gateway?.auth?.password, cfg.secrets?.defaults);
	const hasSharedSecret = resolvedAuth.mode === "token" && hasToken || resolvedAuth.mode === "password" && hasPassword;
	const bindDescriptor = `"${gatewayBind}" (${resolvedBindHost})`;
	const saferRemoteAccessLines = [
		"  Safer remote access: keep bind loopback and use Tailscale Serve/Funnel or an SSH tunnel.",
		"  Example tunnel: ssh -N -L 18789:127.0.0.1:18789 user@gateway-host",
		"  Docs: https://docs.openclaw.ai/gateway/remote"
	];
	if (isExposed) if (!hasSharedSecret) {
		const authFixLines = resolvedAuth.mode === "password" ? [`  Fix: ${formatCliCommand("openclaw configure")} to set a password`, `  Or switch to token: ${formatCliCommand("openclaw config set gateway.auth.mode token")}`] : [`  Fix: ${formatCliCommand("openclaw doctor --fix")} to generate a token`, `  Or set token directly: ${formatCliCommand("openclaw config set gateway.auth.mode token")}`];
		warnings.push(`- CRITICAL: Gateway bound to ${bindDescriptor} without authentication.`, `  Anyone on your network (or internet if port-forwarded) can fully control your agent.`, `  Fix: ${formatCliCommand("openclaw config set gateway.bind loopback")}`, ...saferRemoteAccessLines, ...authFixLines);
	} else warnings.push(`- WARNING: Gateway bound to ${bindDescriptor} (network-accessible).`, `  Ensure your auth credentials are strong and not exposed.`, ...saferRemoteAccessLines);
	const tokenConflict = resolveGatewayAuthTokenSourceConflict({
		cfg,
		env
	});
	if (tokenConflict) warnings.push(...tokenConflict.warningLines);
	const channelFindings = await collectChannelSecurityFindingsCore({
		cfg,
		mode: "doctor",
		plugins: listReadOnlyChannelPluginsForConfig(cfg, {
			includePersistedAuthState: true,
			includeSetupFallbackPlugins: true
		})
	});
	for (const finding of channelFindings) {
		warnings.push(`- ${finding.title}: ${finding.detail}`);
		if (finding.remediation) warnings.push(`  ${finding.remediation}`);
	}
	return warnings;
}
/** Emits security warnings plus the deep audit follow-up command. */
async function noteSecurityWarnings(cfg) {
	const warnings = await collectSecurityWarnings(cfg);
	if (warnings.length > 0) {
		warnings.push(`- Run: ${formatCliCommand("openclaw security audit --deep")}`);
		note(warnings.join("\n"), "Security");
	}
}
//#endregion
export { collectSecurityWarnings, noteSecurityWarnings };
