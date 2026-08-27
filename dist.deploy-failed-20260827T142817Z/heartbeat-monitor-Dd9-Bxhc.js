import "./heartbeat-BB6nm0Fy.js";
import { n as resolveHeartbeatIntervalMs } from "./heartbeat-summary-D3cbsUP0.js";
import { f as resolveHeartbeatAgents, g as resolveHeartbeatSchedulerSeed } from "./heartbeat-runner-session-DG5Kq8Z-.js";
import { n as resolveHeartbeatPhaseMs } from "./heartbeat-runner-DCrrevnn.js";
//#region src/cron/heartbeat-monitor.ts
/** Canonical projection from heartbeat config to system-owned cron monitor jobs. */
const HEARTBEAT_DECLARATION_PREFIX = "heartbeat:";
function heartbeatMonitorDeclarationKey(agentId) {
	return `${HEARTBEAT_DECLARATION_PREFIX}${agentId}`;
}
function heartbeatMonitorAgentId(job) {
	const key = job.declarationKey;
	if (!key?.startsWith(HEARTBEAT_DECLARATION_PREFIX) || job.payload.kind !== "heartbeat") return;
	return key.slice(10) || void 0;
}
function resolveHeartbeatMonitorSpecs(cfg, existingJobs, options = {}) {
	const existingByAgentId = /* @__PURE__ */ new Map();
	for (const job of existingJobs) {
		const agentId = heartbeatMonitorAgentId(job);
		if (agentId) existingByAgentId.set(agentId, job);
	}
	const schedulerSeed = resolveHeartbeatSchedulerSeed(options.schedulerSeed);
	return resolveHeartbeatAgents(cfg).flatMap((agent) => {
		const configuredIntervalMs = resolveHeartbeatIntervalMs(cfg, void 0, agent.heartbeat);
		const existing = existingByAgentId.get(agent.agentId);
		const intervalMs = configuredIntervalMs ?? (existing?.schedule.kind === "every" ? existing.schedule.everyMs : void 0) ?? resolveHeartbeatIntervalMs(cfg, "30m", agent.heartbeat);
		if (!intervalMs) return [];
		return [{
			agentId: agent.agentId,
			input: {
				declarationKey: heartbeatMonitorDeclarationKey(agent.agentId),
				displayName: `Heartbeat (${agent.agentId})`,
				name: `heartbeat-${agent.agentId}`,
				agentId: agent.agentId,
				enabled: configuredIntervalMs !== null,
				schedule: {
					kind: "every",
					everyMs: intervalMs,
					anchorMs: resolveHeartbeatPhaseMs({
						schedulerSeed,
						agentId: agent.agentId,
						intervalMs
					})
				},
				payload: { kind: "heartbeat" },
				sessionTarget: "main",
				wakeMode: "next-heartbeat"
			}
		}];
	});
}
//#endregion
export { resolveHeartbeatMonitorSpecs as n, heartbeatMonitorAgentId as t };
