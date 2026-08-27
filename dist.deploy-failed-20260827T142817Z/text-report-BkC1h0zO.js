import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import { n as VERSION } from "./version-o4XN9fka.js";
import { a as buildPairingConnectRecoveryTitle, s as describePairingConnectRequirement } from "./connect-error-details-Do3cAiyu.js";
import { t as formatDurationCompact } from "./format-duration-DKk9BtRb.js";
import { t as areRuntimeModelRefsEquivalent } from "./model-runtime-aliases-CAkySZhG.js";
import { n as formatTimeAgo } from "./format-relative-DhTC8f11.js";
import "./update-control-plane-sentinel-DZSQPWsH.js";
import { r as readBackupFreshness, t as buildBackupStatusValue } from "./backup-health-DUdJ8yV6.js";
import "./format-CpHI926M.js";
import { u as buildStatusOverviewRowsFromSurface } from "./status-runtime-shared-Dx6wSGXx.js";
//#region src/commands/status-overview-values.ts
function countActiveStatusAgents(params) {
	const activeThresholdMs = params.activeThresholdMs ?? 10 * 6e4;
	return params.agentStatus.agents.filter((agent) => agent.lastActiveAgeMs != null && agent.lastActiveAgeMs <= activeThresholdMs).length;
}
/** Formats the status-all agents overview cell. */
function buildStatusAllAgentsValue(params) {
	const activeAgents = countActiveStatusAgents(params);
	return `${params.agentStatus.agents.length} total · ${params.agentStatus.bootstrapPendingCount} bootstrapping · ${activeAgents} active · ${params.agentStatus.totalSessions} sessions`;
}
/** Formats the secrets diagnostics count for overview output. */
function buildStatusSecretsValue(count) {
	return count > 0 ? `${count} diagnostic${count === 1 ? "" : "s"}` : "none";
}
/** Formats queued system-event count for overview output. */
function buildStatusEventsValue(params) {
	return params.queuedSystemEvents.length > 0 ? `${params.queuedSystemEvents.length} queued` : "none";
}
/** Formats whether deep probe data was collected. */
function buildStatusProbesValue(params) {
	return params.health ? params.ok("enabled") : params.muted("skipped (use --deep)");
}
/** Formats plugin compatibility notices as a compact count by notice and plugin. */
function buildStatusPluginCompatibilityValue(params) {
	if (params.notices.length === 0) return params.ok("none");
	const pluginCount = new Set(params.notices.map((notice) => notice.pluginId ?? notice.plugin ?? "")).size;
	return params.warn(`${params.notices.length} notice${params.notices.length === 1 ? "" : "s"} · ${pluginCount} plugin${pluginCount === 1 ? "" : "s"}`);
}
/** Formats active session count, default model/context, and backing store summary. */
function buildStatusSessionsOverviewValue(params) {
	const defaultCtx = params.sessions.defaults.contextTokens ? ` (${params.formatKTokens(params.sessions.defaults.contextTokens)} ctx)` : "";
	const storeLabel = params.sessions.paths.length > 1 ? `${params.sessions.paths.length} stores` : params.sessions.paths[0] ?? "unknown";
	return `${params.sessions.count} active · default ${params.sessions.defaults.model ?? "unknown"}${defaultCtx} · ${storeLabel}`;
}
//#endregion
//#region src/commands/status.command-sections.ts
const statusHealthColumns = [
	{
		key: "Item",
		header: "Item",
		minWidth: 10
	},
	{
		key: "Status",
		header: "Status",
		minWidth: 8
	},
	{
		key: "Detail",
		header: "Detail",
		flex: true,
		minWidth: 28
	}
];
/** Formats the agents overview row value, including default-agent recent activity. */
function buildStatusAgentsValue(params) {
	const pending = params.agentStatus.bootstrapPendingCount > 0 ? `${params.agentStatus.bootstrapPendingCount} bootstrap file${params.agentStatus.bootstrapPendingCount === 1 ? "" : "s"} present` : "no workspaces bootstrapping";
	const def = params.agentStatus.agents.find((a) => a.id === params.agentStatus.defaultId);
	const defActive = def?.lastActiveAgeMs != null ? params.formatTimeAgo(def.lastActiveAgeMs) : "unknown";
	const defSuffix = def ? ` · default ${def.id} active ${defActive}` : "";
	return `${params.agentStatus.agents.length} · ${pending} · sessions ${params.agentStatus.totalSessions}${defSuffix}`;
}
/** Formats task counters and audit state for the overview table. */
function buildStatusTasksValue(params) {
	if (params.summary.tasks.total <= 0) return params.muted("none");
	return [
		`${params.summary.tasks.active} active`,
		`${params.summary.tasks.byStatus.queued} queued`,
		`${params.summary.tasks.byStatus.running} running`,
		params.summary.tasks.failures > 0 ? params.warn(`${params.summary.tasks.failures} issue${params.summary.tasks.failures === 1 ? "" : "s"}`) : params.muted("no issues"),
		params.summary.taskAudit.errors > 0 ? params.warn(`audit ${params.summary.taskAudit.errors} error${params.summary.taskAudit.errors === 1 ? "" : "s"} · ${params.summary.taskAudit.warnings} warn`) : params.summary.taskAudit.warnings > 0 ? params.muted(`audit ${params.summary.taskAudit.warnings} warn`) : params.muted("audit clean"),
		`${params.summary.tasks.total} tracked`
	].join(" · ");
}
/** Formats configured heartbeat intervals by agent. */
function buildStatusHeartbeatValue(params) {
	const parts = params.summary.heartbeat.agents.map((agent) => {
		if (!agent.enabled || !agent.everyMs) return `disabled (${agent.agentId})`;
		if (agent.waitingForRoute) return `${agent.every} (${agent.agentId}; waiting for delivery route — set commands.ownerAllowFrom or channel allowFrom, or heartbeat.target)`;
		return `${agent.every} (${agent.agentId})`;
	}).filter(Boolean);
	return parts.length > 0 ? parts.join(", ") : "disabled";
}
/** Formats the last observed heartbeat when deep status queried the gateway. */
function buildStatusLastHeartbeatValue(params) {
	if (!params.deep) return null;
	if (!params.gatewayReachable) return params.warn("unavailable");
	if (!params.lastHeartbeat) return params.muted("none");
	const age = params.formatTimeAgo(Date.now() - params.lastHeartbeat.ts);
	const channel = params.lastHeartbeat.channel ?? "unknown";
	const accountLabel = params.lastHeartbeat.accountId ? `account ${params.lastHeartbeat.accountId}` : null;
	return [
		params.lastHeartbeat.status,
		`${age} ago`,
		channel,
		accountLabel
	].filter(Boolean).join(" · ");
}
/** Formats memory plugin/index/cache state for the overview table. */
function buildStatusMemoryValue(params) {
	if (!params.memoryPlugin.enabled) {
		const suffix = params.memoryPlugin.reason ? ` (${params.memoryPlugin.reason})` : "";
		return params.muted(`disabled${suffix}`);
	}
	if (!params.memory) {
		const slot = params.memoryPlugin.slot ? `plugin ${params.memoryPlugin.slot}` : "plugin";
		return params.muted(`enabled (${slot}) · ${params.memoryUnavailableLabel ?? "unavailable"}`);
	}
	const parts = [];
	const dirtySuffix = params.memory.dirty ? ` · ${params.warn("dirty")}` : "";
	parts.push(`${params.memory.files} files · ${params.memory.chunks} chunks${dirtySuffix}`);
	if (params.memory.sources?.length) parts.push(`sources ${params.memory.sources.join(", ")}`);
	if (params.memoryPlugin.slot) parts.push(`plugin ${params.memoryPlugin.slot}`);
	const colorByTone = (tone, text) => tone === "ok" ? params.ok(text) : tone === "warn" ? params.warn(text) : params.muted(text);
	if (params.memory.vector) {
		const vector = params.memory.backend === "builtin" && params.memory.vector.storeAvailable !== void 0 ? {
			...params.memory.vector,
			available: params.memory.vector.storeAvailable
		} : params.memory.vector;
		const state = params.resolveMemoryVectorState(vector);
		const prefix = params.memory.backend === "builtin" ? "vector store" : "vector";
		const label = state.state === "disabled" ? `${prefix} off` : `${prefix} ${state.state}`;
		parts.push(colorByTone(state.tone, label));
	}
	if (params.memory.fts) {
		const state = params.resolveMemoryFtsState(params.memory.fts);
		const label = state.state === "disabled" ? "fts off" : `fts ${state.state}`;
		parts.push(colorByTone(state.tone, label));
	}
	if (params.memory.cache) {
		const summary = params.resolveMemoryCacheSummary(params.memory.cache);
		parts.push(colorByTone(summary.tone, summary.text));
	}
	return parts.join(" · ");
}
/** Builds the security audit text section for status output. */
function buildStatusSecurityAuditLines(params) {
	const fmtSummary = (value) => {
		return [
			params.theme.error(`${value.critical} critical`),
			params.theme.warn(`${value.warn} warn`),
			params.theme.muted(`${value.info} info`)
		].join(" · ");
	};
	const lines = [params.theme.muted(`Summary: ${fmtSummary(params.securityAudit.summary)}`)];
	const importantFindings = params.securityAudit.findings.filter((f) => f.severity === "critical" || f.severity === "warn");
	if (importantFindings.length === 0) lines.push(params.theme.muted("No critical or warn findings detected."));
	else {
		const severityLabel = (sev) => sev === "critical" ? params.theme.error("CRITICAL") : sev === "warn" ? params.theme.warn("WARN") : params.theme.muted("INFO");
		const sevRank = (sev) => sev === "critical" ? 0 : sev === "warn" ? 1 : 2;
		const shown = [...importantFindings].toSorted((a, b) => sevRank(a.severity) - sevRank(b.severity)).slice(0, 6);
		for (const finding of shown) {
			lines.push(`  ${severityLabel(finding.severity)} ${finding.title}`);
			lines.push(`    ${params.shortenText(finding.detail.replaceAll("\n", " "), 160)}`);
			if (finding.remediation?.trim()) lines.push(`    ${params.theme.muted(`Fix: ${finding.remediation.trim()}`)}`);
		}
		if (importantFindings.length > shown.length) lines.push(params.theme.muted(`… +${importantFindings.length - shown.length} more`));
	}
	lines.push(params.theme.muted(`Full report: ${params.formatCliCommand("openclaw security audit")}`));
	lines.push(params.theme.muted(`Deep probe: ${params.formatCliCommand("openclaw security audit --deep")}`));
	return lines;
}
/** Builds health table rows from gateway health and channel health text. */
function buildStatusHealthRows(params) {
	const rows = [{
		Item: "Gateway",
		Status: params.ok("reachable"),
		Detail: `${params.health.durationMs}ms`
	}];
	if (params.health.eventLoop) rows.push({
		Item: "Event loop",
		Status: params.health.eventLoop.degraded ? params.warn("WARN") : params.ok("OK"),
		Detail: formatEventLoopHealthDetail(params.health.eventLoop)
	});
	for (const line of params.formatHealthChannelLines(params.health, { accountMode: "all" })) {
		const colon = line.indexOf(":");
		if (colon === -1) continue;
		const item = line.slice(0, colon).trim();
		const detail = line.slice(colon + 1).trim();
		const normalized = normalizeLowercaseStringOrEmpty(detail);
		const status = normalized.startsWith("ok") ? params.ok("OK") : normalized.startsWith("failed") ? params.warn("WARN") : normalized.startsWith("not configured") ? params.muted("OFF") : normalized.startsWith("configured") ? params.ok("OK") : normalized.startsWith("linked") ? params.ok("LINKED") : normalized.startsWith("not linked") ? params.warn("UNLINKED") : params.warn("WARN");
		rows.push({
			Item: item,
			Status: status,
			Detail: detail
		});
	}
	return rows;
}
/** Formats event-loop latency/utilization health into one table detail string. */
function formatEventLoopHealthDetail(eventLoop) {
	return [
		eventLoop.degraded && eventLoop.degradedSinceMs != null ? `degraded for ${formatDurationCompact(eventLoop.degradedSinceMs) ?? "0s"}` : null,
		eventLoop.reasons.length > 0 ? `reasons ${eventLoop.reasons.join(",")}` : "healthy",
		`max ${Math.round(eventLoop.delayMaxMs)}ms`,
		`p99 ${Math.round(eventLoop.delayP99Ms)}ms`,
		`util ${eventLoop.utilization}`,
		`cpu ${eventLoop.cpuCoreRatio}`
	].filter((part) => part !== null).join(" · ");
}
/** Builds recent session table rows, optionally including prompt-cache data. */
function buildStatusSessionsRows(params) {
	if (params.recent.length === 0) return [];
	return params.recent.map((sess) => ({
		Key: params.shortenText(sess.key, 32),
		Kind: sess.kind,
		Age: sess.updatedAt && sess.age != null ? params.formatTimeAgo(sess.age) : "no activity",
		Model: sess.model ?? "unknown",
		Runtime: sess.runtime ?? "unknown",
		Tokens: params.formatTokensCompact(sess),
		...params.verbose ? { Cache: params.formatPromptCacheCompact(sess) || params.muted("—") } : {}
	}));
}
/** Explains sessions pinned to a selected model different from the current configured default. */
function buildStatusModelSelectionLines(params) {
	const mismatches = params.recent.filter((sess) => {
		if (!sess.configuredModel || !sess.selectedModel || !sess.modelSelectionReason) return false;
		return sess.configuredModel !== sess.selectedModel && !areRuntimeModelRefsEquivalent(sess.configuredModel, sess.selectedModel);
	});
	if (mismatches.length === 0) return [];
	const limit = params.limit ?? 3;
	const lines = [];
	for (const sess of mismatches.slice(0, limit)) {
		const key = params.shortenText(sess.key, 48);
		const configured = sess.configuredModel ?? "unknown";
		const selected = sess.selectedModel ?? "unknown";
		const isFallback = sess.modelSelectionReason === "fallback selected";
		const intro = isFallback ? `Session ${key} is running ${selected} (auto fallback); config primary is ${configured}.` : `Session ${key} is pinned to ${selected}; config primary ${configured} will apply to new/unpinned sessions.`;
		const reasonLine = `  Reason: ${sess.modelSelectionReason ?? "session override"}`;
		const clearLine = isFallback ? "  Action: check provider availability or retry with /model" : "  Clear with: /model default";
		lines.push(params.warn(intro), `  Configured default: ${configured}`, `  Session selected: ${selected}`, reasonLine, clearLine, "  Docs: https://docs.openclaw.ai/concepts/models#selection-source-and-fallback-behavior");
	}
	if (mismatches.length > limit) lines.push(params.muted(`  … +${mismatches.length - limit} more pinned session(s)`));
	return lines;
}
/** Builds footer links and next-step commands for the current gateway state. */
function buildStatusFooterLines(params) {
	return [
		"FAQ: https://docs.openclaw.ai/faq",
		"Troubleshooting: https://docs.openclaw.ai/troubleshooting",
		...params.updateHint ? ["", params.warn(params.updateHint)] : [],
		"Next steps:",
		`  Need to share?      ${params.formatCliCommand("openclaw status --all")}`,
		`  Need to debug live? ${params.formatCliCommand("openclaw logs --follow")}`,
		params.nodeOnlyGateway ? `  Need node service?  ${params.formatCliCommand("openclaw node status")}` : params.gatewayReachable ? `  Need to test channels? ${params.formatCliCommand("openclaw status --deep")}` : `  Fix reachability first: ${params.formatCliCommand("openclaw gateway probe")}`
	];
}
/** Builds plugin compatibility lines, capped to keep status output readable. */
function buildStatusPluginCompatibilityLines(params) {
	if (params.notices.length === 0) return [];
	const limit = params.limit ?? 8;
	return [...params.notices.slice(0, limit).map((notice) => {
		return `  ${notice.severity === "warn" ? params.warn("WARN") : params.muted("INFO")} ${params.formatNotice(notice)}`;
	}), ...params.notices.length > limit ? [params.muted(`  … +${params.notices.length - limit} more`)] : []];
}
/** Builds recovery guidance when the gateway reports device pairing is required. */
function buildStatusPairingRecoveryLines(params) {
	if (!params.pairingRecovery) return [];
	return [
		params.warn(buildPairingConnectRecoveryTitle(params.pairingRecovery.reason ?? void 0)),
		...params.pairingRecovery.reason ? [params.muted(`Reason: ${describePairingConnectRequirement(params.pairingRecovery.reason)}.`)] : [],
		...params.pairingRecovery.remediationHint ? [params.muted(`Hint: ${params.pairingRecovery.remediationHint}`)] : [],
		...params.pairingRecovery.requestId ? [params.muted(`Recovery: ${params.formatCliCommand(`openclaw devices approve ${params.pairingRecovery.requestId}`)}`)] : [],
		params.muted(`Fallback: ${params.formatCliCommand("openclaw devices approve --latest")}`),
		params.muted(`Inspect: ${params.formatCliCommand("openclaw devices list")}`)
	];
}
/** Builds the queued system-events table rows. */
function buildStatusSystemEventsRows(params) {
	const limit = params.limit ?? 5;
	if (params.queuedSystemEvents.length === 0) return;
	return params.queuedSystemEvents.slice(0, limit).map((event) => ({ Event: event }));
}
/** Builds the overflow trailer for queued system events. */
function buildStatusSystemEventsTrailer(params) {
	const limit = params.limit ?? 5;
	return params.queuedSystemEvents.length > limit ? params.muted(`… +${params.queuedSystemEvents.length - limit} more`) : null;
}
//#endregion
//#region src/commands/status-overview-rows.ts
/** Builds the default `openclaw status` overview rows from scan, health, memory, and session inputs. */
function buildStatusCommandOverviewRows(params) {
	const agentsValue = buildStatusAgentsValue({
		agentStatus: params.agentStatus,
		formatTimeAgo: params.formatTimeAgo
	});
	const eventsValue = buildStatusEventsValue({ queuedSystemEvents: params.summary.queuedSystemEvents });
	const degradedSecretOwners = params.summary.degradedSecretOwners ?? [];
	const degradedSecretsValue = degradedSecretOwners.length > 0 ? params.warn(`${degradedSecretOwners.length} degraded · ${degradedSecretOwners.map((owner) => `${owner.ownerKind}:${owner.ownerId}`).join(", ")}`) : null;
	const degradedPlugins = params.summary.degradedPlugins ?? [];
	const degradedPluginsValue = degradedPlugins.length > 0 ? params.warn(`${degradedPlugins.length} configured-unavailable · ${degradedPlugins.map((plugin) => plugin.pluginId).join(", ")}`) : null;
	const tasksValue = buildStatusTasksValue({
		summary: params.summary,
		warn: params.warn,
		muted: params.muted
	});
	const probesValue = buildStatusProbesValue({
		health: params.health,
		ok: params.ok,
		muted: params.muted
	});
	const heartbeatValue = buildStatusHeartbeatValue({ summary: params.summary });
	const lastHeartbeatValue = buildStatusLastHeartbeatValue({
		deep: params.opts.deep,
		gatewayReachable: params.surface.gatewayReachable,
		lastHeartbeat: params.lastHeartbeat,
		warn: params.warn,
		muted: params.muted,
		formatTimeAgo: params.formatTimeAgo
	});
	const memoryValue = buildStatusMemoryValue({
		memory: params.memory,
		memoryPlugin: params.memoryPlugin,
		ok: params.ok,
		warn: params.warn,
		muted: params.muted,
		resolveMemoryVectorState: params.resolveMemoryVectorState,
		resolveMemoryFtsState: params.resolveMemoryFtsState,
		resolveMemoryCacheSummary: params.resolveMemoryCacheSummary,
		memoryUnavailableLabel: "not checked"
	});
	const pluginCompatibilityValue = buildStatusPluginCompatibilityValue({
		notices: params.pluginCompatibility,
		ok: params.ok,
		warn: params.warn
	});
	const hostDesktop = params.summary.hostDesktop ?? {
		enabled: false,
		state: "disabled",
		port: 5900
	};
	const hostDesktopValue = hostDesktop.state === "disabled" ? params.muted("disabled") : hostDesktop.state === "managed" ? hostDesktop.managedState === "running" ? `managed · running · display :${hostDesktop.display} · 127.0.0.1:${hostDesktop.port} · security VncAuth` : hostDesktop.managedState === "failed" ? `managed · failed: ${hostDesktop.error}` : hostDesktop.managedState === "unknown" ? "managed · runtime state unavailable" : `managed · ${hostDesktop.managedState === "not-started" ? "not started" : "starting"}` : `${hostDesktop.state} · 127.0.0.1:${hostDesktop.port}${hostDesktop.security ? ` · security ${hostDesktop.security}` : ""}`;
	return buildStatusOverviewRowsFromSurface({
		surface: params.surface,
		decorateOk: params.ok,
		decorateWarn: params.warn,
		decorateTailscaleOff: params.muted,
		decorateTailscaleWarn: params.warn,
		prefixRows: [{
			Item: "OS",
			Value: `${params.osLabel} · node ${process.versions.node}`
		}],
		updateValue: params.updateValue,
		agentsValue,
		suffixRows: [
			...params.updateRestartValue ? [{
				Item: "Update restart",
				Value: params.updateRestartValue
			}] : [],
			{
				Item: "Memory",
				Value: memoryValue
			},
			{
				Item: "Host desktop",
				Value: hostDesktopValue
			},
			...degradedSecretsValue ? [{
				Item: "Degraded secrets",
				Value: degradedSecretsValue
			}] : [],
			...degradedPluginsValue ? [{
				Item: "Degraded plugins",
				Value: degradedPluginsValue
			}] : [],
			{
				Item: "Plugin compatibility",
				Value: pluginCompatibilityValue
			},
			{
				Item: "Probes",
				Value: probesValue
			},
			{
				Item: "Events",
				Value: eventsValue
			},
			{
				Item: "Tasks",
				Value: tasksValue
			},
			{
				Item: "Backups",
				Value: buildBackupStatusValue({
					freshness: readBackupFreshness(params.env),
					formatTimeAgo: params.formatTimeAgo
				})
			},
			{
				Item: "Heartbeat",
				Value: heartbeatValue
			},
			...lastHeartbeatValue ? [{
				Item: "Last heartbeat",
				Value: lastHeartbeatValue
			}] : [],
			{
				Item: "Sessions",
				Value: buildStatusSessionsOverviewValue({
					sessions: params.summary.sessions,
					formatKTokens: params.formatKTokens
				})
			}
		],
		gatewayAuthWarningValue: params.surface.gatewayProbeAuthWarning ? params.warn(params.surface.gatewayProbeAuthWarning) : null
	});
}
/** Builds the expanded status-all overview rows, including config and security hints. */
function buildStatusAllOverviewRows(params) {
	return buildStatusOverviewRowsFromSurface({
		surface: params.surface,
		tailscaleBackendState: params.tailscaleBackendState,
		includeBackendStateWhenOff: true,
		includeBackendStateWhenOn: true,
		includeDnsNameWhenOff: true,
		prefixRows: [
			{
				Item: "Version",
				Value: VERSION
			},
			{
				Item: "OS",
				Value: params.osLabel
			},
			{
				Item: "Node",
				Value: process.versions.node
			},
			{
				Item: "Config",
				Value: params.configPath
			}
		],
		middleRows: [...params.updateRestartValue ? [{
			Item: "Update restart",
			Value: params.updateRestartValue
		}] : [], {
			Item: "Security",
			Value: `Run: ${formatCliCommand("openclaw security audit --deep")}`
		}],
		agentsValue: buildStatusAllAgentsValue({ agentStatus: params.agentStatus }),
		suffixRows: [{
			Item: "Secrets",
			Value: buildStatusSecretsValue(params.secretDiagnosticsCount)
		}],
		gatewaySelfFallbackValue: "unknown"
	});
}
//#endregion
//#region src/commands/status-update-restart.ts
function readReason(payload) {
	const reason = payload.stats?.reason;
	return typeof reason === "string" && reason.trim().length > 0 ? reason : null;
}
function readAfterVersion(payload) {
	const version = payload.stats?.after?.version;
	return typeof version === "string" && version.trim().length > 0 ? version : null;
}
/** Returns the one-line update restart status value, or null when no update sentinel applies. */
function formatUpdateRestartStatusValue(payload, opts = {}) {
	if (!payload || payload.kind !== "update") return null;
	const age = opts.formatTimeAgo && Number.isFinite(payload.ts) ? ` · ${opts.formatTimeAgo(Math.max(0, (opts.nowMs ?? Date.now()) - payload.ts))}` : "";
	const reason = readReason(payload);
	const warn = opts.warn ?? ((value) => value);
	const ok = opts.ok ?? ((value) => value);
	const muted = opts.muted ?? ((value) => value);
	if (payload.status === "error") return warn(`failed · ${reason ?? "restart failed"} · run openclaw gateway status --deep${age}`);
	if (payload.status === "skipped") {
		if (reason === "managed-service-handoff-started") return warn(`handoff running · gateway restart pending · run openclaw update status${age}`);
		if (reason === "restart-health-pending") return warn(`restart pending health verification · run openclaw gateway status --deep${age}`);
		return muted(`skipped · ${reason ?? "restart skipped"}${age}`);
	}
	const version = readAfterVersion(payload);
	return ok(`verified${version ? ` · gateway ${version}` : ""}${age}`);
}
/** Returns follow-up action lines for update restart failures or pending handoffs. */
function formatUpdateRestartActionLines(payload) {
	if (!payload || payload.kind !== "update") return [];
	if (payload.status === "error") return ["Update restart failed; run openclaw gateway status --deep.", "If the service is down, run openclaw gateway restart or openclaw gateway install --force."];
	const reason = readReason(payload);
	if (payload.status === "skipped" && (reason === "managed-service-handoff-started" || reason === "restart-health-pending")) return ["Update restart is still pending; run openclaw update status --json for handoff state.", "If it stays pending, run openclaw gateway status --deep."];
	return [];
}
//#endregion
//#region src/commands/status-all/report-tables.ts
const statusOverviewTableColumns = [{
	key: "Item",
	header: "Item",
	minWidth: 10
}, {
	key: "Value",
	header: "Value",
	flex: true,
	minWidth: 24
}];
const statusAgentsTableColumns = [
	{
		key: "Agent",
		header: "Agent",
		minWidth: 12
	},
	{
		key: "BootstrapFile",
		header: "Bootstrap file",
		minWidth: 14
	},
	{
		key: "Sessions",
		header: "Sessions",
		align: "right",
		minWidth: 8
	},
	{
		key: "Active",
		header: "Active",
		minWidth: 10
	},
	{
		key: "Store",
		header: "Store",
		flex: true,
		minWidth: 34
	}
];
/** Formats agent status rows for the status report table. */
function buildStatusAgentTableRows(params) {
	return params.agentStatus.agents.map((agent) => ({
		Agent: agent.name?.trim() ? `${agent.id} (${agent.name.trim()})` : agent.id,
		BootstrapFile: agent.bootstrapPending === true ? params.warn("PRESENT") : agent.bootstrapPending === false ? params.ok("ABSENT") : "unknown",
		Sessions: String(agent.sessionsCount),
		Active: agent.lastActiveAgeMs != null ? formatTimeAgo(agent.lastActiveAgeMs) : "unknown",
		Store: agent.sessionsPath
	}));
}
/** Converts per-channel account detail rows into renderable table sections. */
function buildStatusChannelDetailSections(params) {
	return params.details.map((detail) => ({
		kind: "table",
		title: detail.title,
		width: params.width,
		renderTable: params.renderTable,
		columns: detail.columns.map((column) => ({
			key: column,
			header: column,
			flex: column === "Notes",
			minWidth: column === "Notes" ? 28 : 10
		})),
		rows: detail.rows.map((row) => ({
			...row,
			...row.Status === "OK" ? { Status: params.ok("OK") } : row.Status === "WARN" ? { Status: params.warn("WARN") } : {}
		}))
	}));
}
//#endregion
//#region src/commands/status-all/text-report.ts
/** Appends a blank-line-separated section heading. */
function appendStatusSectionHeading(params) {
	if (params.lines.length > 0) params.lines.push("");
	params.lines.push(params.heading(params.title));
}
function appendStatusLinesSection(params) {
	appendStatusSectionHeading(params);
	params.lines.push(...params.body);
}
function appendStatusTableSection(params) {
	appendStatusSectionHeading(params);
	params.lines.push(params.renderTable({
		width: params.width,
		columns: [...params.columns],
		rows: params.rows
	}).trimEnd());
}
/** Appends all non-empty report sections in display order. */
function appendStatusReportSections(params) {
	for (const section of params.sections) {
		if (section.kind === "raw") {
			if (section.skipIfEmpty && section.body.length === 0) continue;
			params.lines.push(...section.body);
			continue;
		}
		if (section.kind === "lines") {
			if (section.skipIfEmpty && section.body.length === 0) continue;
			appendStatusLinesSection({
				lines: params.lines,
				heading: params.heading,
				title: section.title,
				body: section.body
			});
			continue;
		}
		if (section.skipIfEmpty && section.rows.length === 0) continue;
		appendStatusTableSection({
			lines: params.lines,
			heading: params.heading,
			title: section.title,
			width: section.width,
			renderTable: section.renderTable,
			columns: section.columns,
			rows: section.rows
		});
		if (section.trailer) params.lines.push(section.trailer);
	}
}
//#endregion
export { buildStatusSessionsRows as _, statusAgentsTableColumns as a, statusHealthColumns as b, formatUpdateRestartStatusValue as c, buildStatusFooterLines as d, buildStatusHealthRows as f, buildStatusSecurityAuditLines as g, buildStatusPluginCompatibilityLines as h, buildStatusChannelDetailSections as i, buildStatusAllOverviewRows as l, buildStatusPairingRecoveryLines as m, appendStatusSectionHeading as n, statusOverviewTableColumns as o, buildStatusModelSelectionLines as p, buildStatusAgentTableRows as r, formatUpdateRestartActionLines as s, appendStatusReportSections as t, buildStatusCommandOverviewRows as u, buildStatusSystemEventsRows as v, buildStatusSystemEventsTrailer as y };
