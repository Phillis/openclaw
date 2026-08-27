import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { y as tryResolveDefaultAgentId } from "./agent-scope-config-CsnnOL14.js";
import { a as isBlockedLegacyCodexModelRef, p as normalizeRuntimeString } from "./codex-route-model-ref-WCq2iqcj.js";
//#region src/commands/doctor/cron/runtime-policy-migration.ts
function ensureRecord(container, key) {
	const existing = asOptionalRecord(container[key]);
	if (existing) return existing;
	const created = {};
	container[key] = created;
	return created;
}
function resolvePolicyOwner(params) {
	const root = params.cfg;
	const agents = ensureRecord(root, "agents");
	const requestedAgentId = params.target.agentId ? normalizeAgentId(params.target.agentId) : void 0;
	const defaultAgentId = tryResolveDefaultAgentId(params.cfg);
	const effectiveAgentId = requestedAgentId ?? defaultAgentId;
	if (!effectiveAgentId) return;
	const entries = asOptionalRecord(agents.entries);
	const keyedEntry = entries ? Object.entries(entries).find(([agentId]) => normalizeAgentId(agentId) === effectiveAgentId) : void 0;
	const keyedRecord = asOptionalRecord(keyedEntry?.[1]);
	if (keyedEntry && keyedRecord) return {
		owner: keyedRecord,
		path: `agents.entries.${keyedEntry[0]}`
	};
	const record = asOptionalRecord((Array.isArray(agents.list) ? agents.list : []).find((entry) => {
		const record = asOptionalRecord(entry);
		return normalizeAgentId(typeof record?.id === "string" ? record.id : "") === effectiveAgentId;
	}));
	if (record) return {
		owner: record,
		path: `agents.list.${effectiveAgentId}`
	};
	return !requestedAgentId || requestedAgentId === defaultAgentId ? {
		owner: ensureRecord(agents, "defaults"),
		path: "agents.defaults"
	} : void 0;
}
/** Install model-scoped Codex runtime intent for canonical refs migrated out of cron payloads. */
function repairCronCodexRuntimePolicies(params) {
	if (params.targets.length === 0) return {
		config: params.cfg,
		changes: [],
		warnings: [],
		blockedTargets: [],
		changedTargets: []
	};
	const next = structuredClone(params.cfg);
	const changes = [];
	const warnings = [];
	const blockedTargets = [];
	const changedTargets = [];
	const decisions = /* @__PURE__ */ new Map();
	for (const target of params.targets) {
		if (isBlockedLegacyCodexModelRef({
			modelRef: target.legacyModelRef ?? target.modelRef,
			blockedModelIdentities: params.blockedModelIdentities
		})) {
			blockedTargets.push(target);
			continue;
		}
		const owner = resolvePolicyOwner({
			cfg: next,
			target
		});
		const targetLabel = target.agentId ? `agent ${target.agentId}` : "the default agent";
		if (!owner) {
			blockedTargets.push(target);
			warnings.push(`Cron model ${target.modelRef} was migrated to openai/*, but ${targetLabel} has no configured agent entry; set its model-scoped agentRuntime.id to "codex" manually.`);
			continue;
		}
		const key = `${owner.path}\u0000${target.modelRef}`;
		const priorDecision = decisions.get(key);
		if (priorDecision) {
			if (priorDecision === "blocked") blockedTargets.push(target);
			else if (priorDecision === "changed") changedTargets.push(target);
			continue;
		}
		const modelEntry = ensureRecord(ensureRecord(owner.owner, "models"), target.modelRef);
		const priorRuntime = asOptionalRecord(modelEntry.agentRuntime);
		const priorRuntimeId = normalizeRuntimeString(priorRuntime?.id);
		if (priorRuntimeId && priorRuntimeId !== "codex" && priorRuntimeId !== "auto") {
			decisions.set(key, "blocked");
			blockedTargets.push(target);
			warnings.push(`Retained ${owner.path}.models.${target.modelRef}.agentRuntime.id="${priorRuntimeId}": it conflicts with migrated cron Codex runtime intent; repair the cron model or runtime policy manually.`);
			continue;
		}
		if (priorRuntimeId === "codex") {
			decisions.set(key, "noop");
			continue;
		}
		decisions.set(key, "changed");
		modelEntry.agentRuntime = {
			...priorRuntime,
			id: "codex"
		};
		changedTargets.push(target);
		changes.push(`Set ${owner.path}.models.${target.modelRef}.agentRuntime.id to "codex" for migrated cron runtime intent.`);
	}
	return {
		config: changes.length > 0 ? next : params.cfg,
		changes,
		warnings,
		blockedTargets,
		changedTargets
	};
}
/** Restrict a post-config-write cron rewrite to runtime policies already on disk. */
function planCronCodexRefRewriteAgainstPersistedConfig(params) {
	const policyPlan = repairCronCodexRuntimePolicies(params);
	return {
		warnings: [...policyPlan.warnings, ...policyPlan.changedTargets.map((target) => `Retained the legacy cron route for ${target.modelRef} because its model-scoped agentRuntime.id="codex" policy is not present in persisted config; rerun doctor --fix.`)],
		blockedTargets: [...policyPlan.blockedTargets, ...policyPlan.changedTargets]
	};
}
//#endregion
export { repairCronCodexRuntimePolicies as n, planCronCodexRefRewriteAgainstPersistedConfig as t };
