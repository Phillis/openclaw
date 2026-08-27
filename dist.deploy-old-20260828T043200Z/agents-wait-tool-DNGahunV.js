import { t as createAbortError } from "./abort-signal-D2k14JsD.js";
import { x as resolvePersistedSessionStoreOwnerForKey } from "./agent-scope-DigoIwHb.js";
import { C as tryResolveLegacyCompatibilityAgentId } from "./agent-scope-config-CUBiGmG3.js";
import { c as parseAgentSessionKey } from "./session-key-utils-Di3FvABa.js";
import { S as describeAgentsWaitTool } from "./tool-catalog-DKzjKSZr.js";
import "./legacy.default-agent-owner-CL_-T11Y.js";
import { n as ToolInputError } from "./common-CI1GnPjt.js";
import { t as jsonResult } from "./tool-results-BCM3fdVS.js";
import { b as onSubagentRegistryPersisted } from "./subagent-registry-read-kfj2Ed2f.js";
import { t as resolveSubagentCompletionResultText } from "./subagent-completion-result-DHC2b2aV.js";
import { d as getSubagentRunsByRunIds } from "./subagent-registry-C_-WD7pT.js";
import { t as resolveSwarmConfig } from "./swarm-config-Df_H07Y6.js";
import { Type } from "typebox";
//#region src/agents/tools/agents-wait-tool.ts
const MAX_WAIT_IDS = 1e3;
const AgentsWaitToolSchema = Type.Object({
	ids: Type.Array(Type.String({ minLength: 1 }), {
		minItems: 1,
		maxItems: MAX_WAIT_IDS
	}),
	timeoutSeconds: Type.Optional(Type.Number({ minimum: 0 }))
});
function ownsRun(entry, currentSessionKeys, currentAgentId, config) {
	const owner = entry.swarmRequesterSessionKey?.trim();
	if (!owner) return false;
	return (entry.swarmWaitOwnerSessionKeys && entry.swarmWaitOwnerSessionKeys.length > 0 ? entry.swarmWaitOwnerSessionKeys : [owner]).some((sessionKey) => {
		if (!currentSessionKeys.has(sessionKey)) return false;
		const ownerAgentId = parseAgentSessionKey(sessionKey)?.agentId ?? entry.requesterAgentId ?? paramsOwner(config, sessionKey);
		return Boolean(ownerAgentId && (!currentAgentId || ownerAgentId === currentAgentId));
	});
}
function paramsOwner(config, sessionKey) {
	if (!config) return;
	const persisted = resolvePersistedSessionStoreOwnerForKey(config, sessionKey);
	return persisted.kind === "configured" ? persisted.agentId : persisted.kind === "none" ? tryResolveLegacyCompatibilityAgentId(config) : void 0;
}
function completionResult(entry) {
	const completion = entry.collectorCompletion;
	if (!completion) return;
	return {
		runId: entry.swarmRunId ?? entry.runId,
		status: completion.status,
		result: resolveSubagentCompletionResultText(entry) ?? "",
		...completion.structured !== void 0 ? { structured: completion.structured } : {},
		...entry.execution.outcome?.status === "error" ? { error: entry.execution.outcome.error } : {},
		...completion.schemaError ? { schemaError: completion.schemaError } : {},
		sessionKey: entry.childSessionKey,
		...entry.label ? { label: entry.label } : {},
		...completion.usage ? { usage: completion.usage } : {}
	};
}
/** Park one host bridge until its collector completes; registry writes wake it without polling. */
async function waitForCollectorCompletion(params) {
	const readCompletion = () => {
		const state = readWaitState([params.runId], params.currentSessionKeys, params.currentAgentId, params.config);
		const error = state.errors?.[0];
		if (error) throw new ToolInputError(`agents.run ${error.error}: ${error.runId}`);
		return state.completed[0];
	};
	const immediate = readCompletion();
	if (immediate) return immediate;
	if (params.signal?.aborted) throw new ToolInputError("agents.run wait aborted.");
	return await new Promise((resolve, reject) => {
		let settled = false;
		const finish = (result) => {
			if (settled) return;
			settled = true;
			unsubscribe();
			params.signal?.removeEventListener("abort", onAbort);
			if (result instanceof Error) reject(result);
			else resolve(result);
		};
		const check = () => {
			try {
				const completion = readCompletion();
				if (completion) finish(completion);
			} catch (error) {
				finish(error instanceof Error ? error : new Error(String(error)));
			}
		};
		const onAbort = () => finish(new ToolInputError("agents.run wait aborted."));
		const unsubscribe = onSubagentRegistryPersisted(check);
		params.signal?.addEventListener("abort", onAbort, { once: true });
		if (params.signal?.aborted) onAbort();
		else check();
	});
}
function resolveWaitTargets(ids, currentSessionKeys, currentAgentId, config) {
	const targets = [];
	const errors = [];
	const snapshot = getSubagentRunsByRunIds(ids);
	for (const runId of ids) {
		const entry = snapshot.entries.get(runId);
		if (!entry?.collect) errors.push({
			runId,
			error: "not_found"
		});
		else if (!ownsRun(entry, currentSessionKeys, currentAgentId, config)) errors.push({
			runId,
			error: "not_owner"
		});
		else targets.push({
			runId,
			entry
		});
	}
	return {
		targets,
		errors
	};
}
function readResolvedWaitState(targets, errors) {
	const completed = [];
	const pending = [];
	for (const [inputIndex, { runId, entry }] of targets.entries()) {
		const result = completionResult(entry);
		if (result) completed.push({
			result,
			completedAt: entry.completion?.capturedAt ?? entry.execution.endedAt ?? Number.MAX_SAFE_INTEGER,
			inputIndex
		});
		else pending.push(runId);
	}
	completed.sort((left, right) => left.completedAt - right.completedAt || left.inputIndex - right.inputIndex);
	return {
		completed: completed.map((entry) => entry.result),
		pending,
		...errors.length > 0 ? { errors } : {}
	};
}
function readWaitState(ids, currentSessionKeys, currentAgentId, config) {
	const resolved = resolveWaitTargets(ids, currentSessionKeys, currentAgentId, config);
	return readResolvedWaitState(resolved.targets, resolved.errors);
}
async function waitForCollector(params) {
	const deadline = Date.now() + params.timeoutMs;
	for (;;) {
		if (params.signal?.aborted) throw createAbortError("agents_wait aborted.");
		const state = readWaitState(params.ids, params.currentSessionKeys, params.currentAgentId, params.config);
		if (state.completed.length > 0 || state.pending.length === 0 || Date.now() >= deadline) return state;
		await new Promise((resolve, reject) => {
			const finish = (error) => {
				clearTimeout(timer);
				params.signal?.removeEventListener("abort", onAbort);
				if (error) {
					reject(error);
					return;
				}
				resolve();
			};
			const onAbort = () => finish(createAbortError("agents_wait aborted."));
			const timer = setTimeout(finish, Math.min(25, Math.max(0, deadline - Date.now())));
			params.signal?.addEventListener("abort", onAbort, { once: true });
			if (params.signal?.aborted) onAbort();
		});
	}
}
function createAgentsWaitTool(opts) {
	const swarm = resolveSwarmConfig(opts.config, opts.agentId);
	return {
		label: "Wait for Agents",
		name: "agents_wait",
		displaySummary: "Wait for collector children.",
		description: describeAgentsWaitTool(false),
		parameters: AgentsWaitToolSchema,
		execute: async (_toolCallId, args, signal) => {
			const params = args;
			if (params.ids.length > MAX_WAIT_IDS) throw new ToolInputError(`agents_wait supports at most ${MAX_WAIT_IDS} ids.`);
			const ids = [...new Set(params.ids.map((id) => id.trim()).filter(Boolean))];
			if (ids.length === 0) throw new ToolInputError("agents_wait requires at least one non-empty run id.");
			const currentSessionKeys = new Set([opts.runSessionKey, opts.agentSessionKey].filter((key) => Boolean(key?.trim())));
			const requestedTimeout = typeof params.timeoutSeconds === "number" && Number.isFinite(params.timeoutSeconds) ? params.timeoutSeconds : 30;
			const timeoutSeconds = Math.min(Math.max(0, requestedTimeout), swarm.waitTimeoutSecondsMax);
			const result = await waitForCollector({
				ids,
				currentSessionKeys,
				currentAgentId: opts.agentId,
				config: opts.config,
				timeoutMs: timeoutSeconds * 1e3,
				signal
			});
			return jsonResult(result.completed.length === 0 && result.pending.length === 0 && Boolean(result.errors?.length) ? {
				...result,
				success: false
			} : result);
		}
	};
}
//#endregion
export { waitForCollectorCompletion as n, createAgentsWaitTool as t };
